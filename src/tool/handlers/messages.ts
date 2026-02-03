/**
 * Messages fetching handlers for tlon_run
 */

import type { HandlerParams } from "../index.js";
import { parseLimit, hasFlag, getOption } from "../parser.js";
import { createToolClient, normalizeShip } from "../urbit-client.js";

function extractText(content: unknown): string {
  if (!content) {return "";}

  if (Array.isArray(content)) {
    return content
      .map((block: { inline?: unknown[]; block?: unknown }) => {
        if (block.inline) {
          return extractInlines(block.inline);
        }
        if (block.block) {
          return extractBlocks(block.block);
        }
        return "";
      })
      .join("");
  }

  if (typeof content === "object" && content !== null && "inline" in content) {
    return extractInlines((content as { inline: unknown[] }).inline);
  }

  return "";
}

function extractInlines(inlines: unknown[]): string {
  return inlines
    .map((inline: unknown) => {
      if (typeof inline === "string") {return inline;}
      if (!inline || typeof inline !== "object") {return "";}
      const obj = inline as Record<string, unknown>;
      if ("break" in obj) {return "\n";}
      if ("ship" in obj) {return obj.ship as string;}
      if ("bold" in obj) {return `**${extractInlines(obj.bold as unknown[])}**`;}
      if ("italics" in obj) {return `*${extractInlines(obj.italics as unknown[])}*`;}
      if ("strike" in obj) {return `~~${extractInlines(obj.strike as unknown[])}~~`;}
      if ("blockquote" in obj) {return `> ${extractInlines(obj.blockquote as unknown[])}`;}
      if ("link" in obj) {
        const link = obj.link as { content?: string; href: string };
        return `[${link.content || link.href}](${link.href})`;
      }
      if ("inline-code" in obj) {return `\`${String(obj["inline-code"])}\``;}
      if ("code" in obj) {return `\`\`\`\n${String(obj.code)}\n\`\`\``;}
      return "";
    })
    .join("");
}

function extractBlocks(blocks: unknown): string {
  const blockArray = Array.isArray(blocks) ? blocks : [blocks];

  return blockArray
    .map((block: unknown) => {
      if (!block || typeof block !== "object") {return "";}
      const obj = block as Record<string, unknown>;
      if ("quote" in obj) {return `> ${extractText(obj.quote)}`;}
      if ("code" in obj) {
        const code = obj.code as { lang?: string; code: string };
        return `\`\`\`${code.lang || ""}\n${code.code}\n\`\`\``;
      }
      if ("header" in obj) {
        const header = obj.header as { tag: string; content: unknown };
        return `## ${header.tag} ${extractText(header.content)}`;
      }
      if ("cite" in obj) {
        const cite = parseCite(obj.cite);
        if (cite?.type === "chan" && cite.author) {
          return `> [quoted: ${cite.author}]`;
        }
        if (cite?.type === "group" && cite.group) {
          return `> [ref: group ${cite.group}]`;
        }
        return "> [quoted message]";
      }
      return "";
    })
    .join("\n");
}

interface ParsedCite {
  type: "chan" | "group" | "desk" | "bait";
  nest?: string;
  author?: string;
  postId?: string;
  group?: string;
  where?: string;
}

function parseCite(cite: unknown): ParsedCite | null {
  if (!cite || typeof cite !== "object") {return null;}
  const obj = cite as Record<string, unknown>;

  if (obj.chan && typeof obj.chan === "object") {
    const chan = obj.chan as { nest?: string; where?: string };
    const whereMatch = chan.where?.match(/\/msg\/(~[a-z-]+)\/(.+)/);
    return {
      type: "chan",
      nest: chan.nest,
      where: chan.where,
      author: whereMatch?.[1],
      postId: whereMatch?.[2],
    };
  }
  if (obj.group && typeof obj.group === "string") {
    return { type: "group", group: obj.group };
  }
  if (obj.desk && typeof obj.desk === "object") {
    return { type: "desk", where: (obj.desk as { where?: string }).where };
  }
  if (obj.bait && typeof obj.bait === "object") {
    const bait = obj.bait as { group?: string; graph?: string; where?: string };
    return { type: "bait", group: bait.group, nest: bait.graph, where: bait.where };
  }
  return null;
}

async function fetchCiteContent(
  client: Awaited<ReturnType<typeof createToolClient>>,
  cite: ParsedCite,
): Promise<string | null> {
  if (cite.type !== "chan" || !cite.nest || !cite.postId) {return null;}

  try {
    const scryPath = `/v4/${cite.nest}/posts/post/${cite.postId}`;
    const data = await client.scry<{ essay?: { content?: unknown } }>({
      app: "channels",
      path: scryPath,
    });

    if (data?.essay?.content) {
      return extractText(data.essay.content);
    }
    return null;
  } catch {
    return null;
  }
}

function extractCites(content: unknown[]): ParsedCite[] {
  const cites: ParsedCite[] = [];
  if (!Array.isArray(content)) {return cites;}

  for (const block of content) {
    if (typeof block === "object" && block !== null) {
      const obj = block as { block?: { cite?: unknown } };
      if (obj.block?.cite) {
        const cite = parseCite(obj.block.cite);
        if (cite) {cites.push(cite);}
      }
    }
  }
  return cites;
}

function formatTime(timeVal: string | number): string {
  try {
    const num = typeof timeVal === "number" ? timeVal : parseInt(timeVal, 10);
    if (!isNaN(num) && num > 1600000000000) {
      const date = new Date(num);
      return date.toLocaleString();
    }

    const timeStr = String(timeVal);
    const daNum = BigInt(timeStr.replace(/\./g, ""));
    const DA_SECOND = BigInt("18446744073709551616");
    const DA_UNIX_EPOCH = BigInt("170141184475152167957503069145530368000");
    const offset = DA_SECOND / BigInt(2000);
    const epochAdjusted = offset + (daNum - DA_UNIX_EPOCH);
    const unixMs = Math.round(Number((epochAdjusted * BigInt(1000)) / DA_SECOND));

    const date = new Date(unixMs);
    if (date.getFullYear() > 2020 && date.getFullYear() < 2100) {
      return date.toLocaleString();
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}

export async function dm({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  if (!ship) {
    throw new Error("Usage: messages dm <~ship> [--limit N] [--resolve-cites]");
  }

  const limit = parseLimit(args, 20);
  const resolveCites = hasFlag(args, "resolve-cites") || hasFlag(args, "quotes");

  const client = await createToolClient(accountId);
  const normalizedShip = normalizeShip(ship);

  interface WritsResponse {
    writs?: Record<string, unknown>;
    posts?: Record<string, unknown>;
  }

  const data = await client.scry<WritsResponse>({
    app: "chat",
    path: `/v3/dm/${normalizedShip}/writs/newest/${limit}/light`,
  });

  if (!data) {
    return "No messages found.";
  }

  const writsObj = data.writs || data.posts || data;
  let entries: [string, unknown][];

  if (typeof writsObj === "object" && !Array.isArray(writsObj)) {
    entries = Object.entries(writsObj);
  } else if (Array.isArray(writsObj)) {
    entries = writsObj.map((item: unknown, i: number) => [String(i), item]);
  } else {
    return "No messages found.";
  }

  interface MessageItem {
    essay?: { author?: string; sent?: number; content?: unknown[] };
    memo?: { author?: string; sent?: number; content?: unknown[] };
    seal?: { meta?: { replyCount?: number } };
  }

  entries.sort((a, b) => {
    const itemA = a[1] as MessageItem;
    const itemB = b[1] as MessageItem;
    const timeA = itemA?.essay?.sent || itemA?.memo?.sent || 0;
    const timeB = itemB?.essay?.sent || itemB?.memo?.sent || 0;
    return timeA - timeB;
  });

  const recent = entries.slice(-limit);

  if (recent.length === 0) {
    return "No messages found.";
  }

  const lines: string[] = [`=== DMs with ${normalizedShip} (${recent.length}) ===`, ""];

  for (const [, item] of recent) {
    const msgItem = item as MessageItem;
    const essay = msgItem.essay || msgItem.memo;
    const seal = msgItem.seal;
    const author = essay?.author || "unknown";
    const time = essay?.sent ? formatTime(essay.sent) : "unknown";
    const replyRef = seal?.meta?.replyCount ? ` (${seal.meta.replyCount} replies)` : "";

    let quotedText = "";
    if (resolveCites && essay?.content) {
      const cites = extractCites(essay.content);
      for (const cite of cites) {
        const citedContent = await fetchCiteContent(client, cite);
        if (citedContent) {
          const citeAuthor = cite.author || "unknown";
          quotedText += `> ${citeAuthor} wrote: ${citedContent.substring(0, 200)}${citedContent.length > 200 ? "..." : ""}\n`;
        }
      }
    }

    const text = extractText(essay?.content || []);

    lines.push(`[${author}] ${time}${replyRef}`);
    if (quotedText) {lines.push(quotedText);}
    lines.push(text.substring(0, 500));
    if (text.length > 500) {lines.push("...");}
    lines.push("");
  }

  return lines.join("\n");
}

export async function channel({ accountId, args }: HandlerParams): Promise<string> {
  const channelPath = args[0];
  if (!channelPath) {
    throw new Error("Usage: messages channel <chat/~host/slug> [--limit N] [--resolve-cites]");
  }

  const limit = parseLimit(args, 20);
  const resolveCites = hasFlag(args, "resolve-cites") || hasFlag(args, "quotes");

  const client = await createToolClient(accountId);

  interface PostsResponse {
    posts?: Record<
      string,
      {
        essay?: { author?: string; sent?: number; content?: unknown[]; meta?: { title?: string } };
        seal?: { meta?: { replyCount?: number } };
      }
    >;
  }

  const scryPath = `/v4/${channelPath}/posts/newest/${limit}/outline`;
  const data = await client.scry<PostsResponse>({
    app: "channels",
    path: scryPath,
  });

  if (!data) {
    return "No messages found.";
  }

  const postsObj = data.posts || {};
  const postIds = Object.keys(postsObj).toSorted((a, b) => {
    const timeA = postsObj[a]?.essay?.sent || 0;
    const timeB = postsObj[b]?.essay?.sent || 0;
    return timeA - timeB;
  });

  const recentIds = postIds.slice(-limit);

  if (recentIds.length === 0) {
    return "No messages found.";
  }

  const lines: string[] = [`=== Messages (${recentIds.length}) ===`, ""];

  for (const id of recentIds) {
    const item = postsObj[id];
    const essay = item.essay;
    const seal = item.seal;
    const author = essay?.author || "unknown";
    const time = essay?.sent ? formatTime(essay.sent) : "unknown";
    const replyRef = seal?.meta?.replyCount ? ` (${seal.meta.replyCount} replies)` : "";

    let quotedText = "";
    if (resolveCites && essay?.content) {
      const cites = extractCites(essay.content);
      for (const cite of cites) {
        const citedContent = await fetchCiteContent(client, cite);
        if (citedContent) {
          const citeAuthor = cite.author || "unknown";
          quotedText += `> ${citeAuthor} wrote: ${citedContent.substring(0, 200)}${citedContent.length > 200 ? "..." : ""}\n`;
        }
      }
    }

    const text = extractText(essay?.content || []);

    const title = essay?.meta?.title;
    const idLine = title ? `[notebook] ${title}` : `ID: ${id}`;
    lines.push(`[${author}] ${time}${replyRef}`);
    lines.push(idLine);
    if (quotedText) {lines.push(quotedText);}
    lines.push(text.substring(0, 500));
    if (text.length > 500) {lines.push("...");}
    lines.push("");
  }

  return lines.join("\n");
}

export async function history({ accountId, args }: HandlerParams): Promise<string> {
  const channelPath = args[0] || getOption(args, "channel");
  if (!channelPath) {
    throw new Error("Usage: messages history <chat/~host/slug> [--limit N] [--resolve-cites]");
  }
  return channel({ accountId, args: [channelPath, ...args.slice(1)] });
}

export async function search({ accountId, args }: HandlerParams): Promise<string> {
  const query = args[0];
  const channelPath = getOption(args, "channel") || args[1];

  if (!query || !channelPath) {
    throw new Error('Usage: messages search "query" --channel <chat/~host/slug>');
  }

  const client = await createToolClient(accountId);

  try {
    const results = await client.scry<unknown>({
      app: "chat",
      path: `/v1/chats/${channelPath}/search/${query}`,
    });

    return JSON.stringify(results, null, 2);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return `Search failed: ${message}\nNote: Search may require a different API endpoint.`;
  }
}
