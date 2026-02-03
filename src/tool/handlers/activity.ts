/**
 * Activity/Notifications handlers for tlon_run
 */

import type { HandlerParams } from "../index.js";
import { parseLimit } from "../parser.js";
import { createToolClient } from "../urbit-client.js";

interface MessageKey {
  id: string;
  time: string;
}

interface Story {
  inline?: unknown[];
  block?: unknown[];
}

interface ActivityEvent {
  notified: boolean;
  post?: {
    key: MessageKey;
    group: string;
    channel: string;
    content: Story;
    mention: boolean;
  };
  reply?: {
    parent: MessageKey;
    key: MessageKey;
    group: string;
    channel: string;
    content: Story;
    mention: boolean;
  };
  "dm-post"?: {
    key: MessageKey;
    whom: { ship: string } | { club: string };
    content: Story;
    mention: boolean;
  };
  "dm-reply"?: {
    parent: MessageKey;
    key: MessageKey;
    whom: { ship: string } | { club: string };
    content: Story;
    mention: boolean;
  };
  "group-ask"?: { ship: string; group: string };
  "group-join"?: { ship: string; group: string };
  "group-invite"?: { ship: string; group: string };
  contact?: { who: string; update: unknown };
}

interface ActivityBundle {
  source: unknown;
  latest: string;
  events: { event: ActivityEvent; time: string }[];
  "source-key": string;
}

interface ActivitySummary {
  recency: number;
  count: number;
  "notify-count": number;
  notify: boolean;
  unread: { id: string; time: string; count: number; notify: boolean } | null;
}

interface InitActivityFeeds {
  all: ActivityBundle[];
  mentions: ActivityBundle[];
  replies: ActivityBundle[];
  summaries: Record<string, ActivitySummary>;
}

function extractText(content: unknown): string {
  if (!content) {return "";}

  if (Array.isArray(content)) {
    return content
      .map((block: { inline?: unknown[] }) => {
        if (block.inline) {
          return extractInlines(block.inline);
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
      if ("bold" in obj) {return extractInlines(obj.bold as unknown[]);}
      if ("italics" in obj) {return extractInlines(obj.italics as unknown[]);}
      if ("strike" in obj) {return extractInlines(obj.strike as unknown[]);}
      if ("blockquote" in obj) {return extractInlines(obj.blockquote as unknown[]);}
      if ("link" in obj) {
        const link = obj.link as { content?: string; href: string };
        return link.content || link.href;
      }
      if ("inline-code" in obj) {return obj["inline-code"] as string;}
      if ("code" in obj) {return obj.code as string;}
      return "";
    })
    .join("");
}

function getAuthor(key: MessageKey): string {
  return key.id.split("/")[0];
}

function formatTime(timeStr: string): string {
  try {
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
    return "unknown date";
  } catch {
    return "unknown";
  }
}

function formatWhom(whom: { ship: string } | { club: string }): string {
  if ("ship" in whom) {return whom.ship;}
  return `club:${whom.club}`;
}

function formatEvent(event: ActivityEvent, time: string): string {
  const lines: string[] = [];
  const timeStr = formatTime(time);

  if (event.post) {
    const author = getAuthor(event.post.key);
    const text = extractText(event.post.content);
    const mention = event.post.mention ? " [MENTION]" : "";
    lines.push(`Post${mention} by ${author} in ${event.post.channel}`);
    lines.push(`  Group: ${event.post.group}`);
    lines.push(`  Time: ${timeStr}`);
    lines.push(`  Content: ${text.substring(0, 200)}${text.length > 200 ? "..." : ""}`);
  }

  if (event.reply) {
    const author = getAuthor(event.reply.key);
    const text = extractText(event.reply.content);
    const mention = event.reply.mention ? " [MENTION]" : "";
    lines.push(`Reply${mention} by ${author} in ${event.reply.channel}`);
    lines.push(`  Group: ${event.reply.group}`);
    lines.push(`  Time: ${timeStr}`);
    lines.push(`  Content: ${text.substring(0, 200)}${text.length > 200 ? "..." : ""}`);
  }

  if (event["dm-post"]) {
    const dm = event["dm-post"];
    const author = getAuthor(dm.key);
    const text = extractText(dm.content);
    const mention = dm.mention ? " [MENTION]" : "";
    lines.push(`DM${mention} from ${author}`);
    lines.push(`  To: ${formatWhom(dm.whom)}`);
    lines.push(`  Time: ${timeStr}`);
    lines.push(`  Content: ${text.substring(0, 200)}${text.length > 200 ? "..." : ""}`);
  }

  if (event["dm-reply"]) {
    const dm = event["dm-reply"];
    const author = getAuthor(dm.key);
    const text = extractText(dm.content);
    const mention = dm.mention ? " [MENTION]" : "";
    lines.push(`DM Reply${mention} from ${author}`);
    lines.push(`  To: ${formatWhom(dm.whom)}`);
    lines.push(`  Time: ${timeStr}`);
    lines.push(`  Content: ${text.substring(0, 200)}${text.length > 200 ? "..." : ""}`);
  }

  if (event["group-ask"]) {
    lines.push(`Join request from ${event["group-ask"].ship}`);
    lines.push(`  Group: ${event["group-ask"].group}`);
    lines.push(`  Time: ${timeStr}`);
  }

  if (event["group-join"]) {
    lines.push(`${event["group-join"].ship} joined`);
    lines.push(`  Group: ${event["group-join"].group}`);
    lines.push(`  Time: ${timeStr}`);
  }

  if (event["group-invite"]) {
    lines.push(`Invite from ${event["group-invite"].ship}`);
    lines.push(`  Group: ${event["group-invite"].group}`);
    lines.push(`  Time: ${timeStr}`);
  }

  if (event.contact) {
    lines.push(`Contact update from ${event.contact.who}`);
    lines.push(`  Time: ${timeStr}`);
  }

  return lines.join("\n");
}

async function getActivity(
  accountId: string | undefined,
  bucket: "all" | "mentions" | "replies",
  limit: number,
): Promise<string> {
  const client = await createToolClient(accountId);

  const response = await client.scry<InitActivityFeeds>({
    app: "activity",
    path: `/v5/feed/init/${limit}`,
  });

  const feed = response[bucket];

  if (!feed || feed.length === 0) {
    return `No ${bucket} activity found.`;
  }

  const lines: string[] = [`=== ${bucket.toUpperCase()} (${feed.length} bundles) ===`, ""];

  for (const bundle of feed) {
    lines.push(`Source: ${bundle["source-key"]}`);
    lines.push("---");

    for (const { event, time } of bundle.events) {
      const formatted = formatEvent(event, time);
      if (formatted) {
        lines.push(formatted);
        lines.push("");
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

export async function mentions({ accountId, args }: HandlerParams): Promise<string> {
  const limit = parseLimit(args, 10);
  return getActivity(accountId, "mentions", limit);
}

export async function replies({ accountId, args }: HandlerParams): Promise<string> {
  const limit = parseLimit(args, 10);
  return getActivity(accountId, "replies", limit);
}

export async function all({ accountId, args }: HandlerParams): Promise<string> {
  const limit = parseLimit(args, 10);
  return getActivity(accountId, "all", limit);
}

export async function unreads({ accountId }: HandlerParams): Promise<string> {
  const client = await createToolClient(accountId);

  const activity = await client.scry<Record<string, ActivitySummary>>({
    app: "activity",
    path: "/v4/activity",
  });

  const entries = Object.entries(activity)
    .filter(([, summary]) => summary.count > 0 || summary.notify)
    .toSorted((a, b) => b[1].recency - a[1].recency);

  if (entries.length === 0) {
    return "No unreads!";
  }

  const lines: string[] = ["=== UNREADS ===", ""];

  for (const [sourceId, summary] of entries) {
    const notify = summary.notify ? "[!] " : "";
    lines.push(`${notify}${sourceId}`);
    lines.push(`  Count: ${summary.count}, Notify count: ${summary["notify-count"]}`);
    if (summary.unread) {
      lines.push(`  First unread: ${summary.unread.time}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
