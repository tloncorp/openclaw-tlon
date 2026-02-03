/**
 * Direct Message management handlers for tlon_run
 *
 * Note: 1:1 DM send/reply is handled by the openclaw-tlon channel plugin.
 * This handles club (group DM) messaging and DM management ops only.
 */

import type { HandlerParams } from "../index.js";
import { markdownToStory, type Story } from "../../urbit/story.js";
import { createToolClient, normalizeShip, getShipWithTilde } from "../urbit-client.js";

function isClub(whom: string): boolean {
  return whom.startsWith("0v");
}

function formatUd(num: bigint): string {
  const str = num.toString();
  const parts: string[] = [];
  for (let i = str.length; i > 0; i -= 3) {
    parts.unshift(str.slice(Math.max(0, i - 3), i));
  }
  return parts.join(".");
}

function daFromUnix(ms: number): bigint {
  const DA_SECOND = BigInt("18446744073709551616");
  const DA_UNIX_EPOCH = BigInt("170141184475152167957503069145530368000");
  const msBigInt = BigInt(ms);
  return DA_UNIX_EPOCH + (msBigInt * DA_SECOND) / BigInt(1000);
}

export async function send({ accountId, args }: HandlerParams): Promise<string> {
  const whom = args[0];
  const message = args.slice(1).join(" ");

  if (!whom || !message) {
    throw new Error(
      "Usage: dms send <club-id> <message>\nNote: For 1:1 DMs, use the Tlon channel message tool.",
    );
  }

  if (!isClub(whom)) {
    throw new Error(
      "1:1 DM send is handled by the Tlon channel plugin.\nUse the channel message tool instead.",
    );
  }

  const client = await createToolClient(accountId);
  const author = getShipWithTilde(client);
  const sent = Date.now();
  const content: Story = markdownToStory(message);
  const idUd = formatUd(daFromUnix(sent));
  const id = `${author}/${idUd}`;

  await client.poke({
    app: "chat",
    mark: "chat-club-action-0",
    json: {
      id: whom,
      diff: {
        uid: "0v3",
        delta: {
          writ: {
            id,
            delta: {
              add: {
                memo: { content, author, sent },
                kind: null,
                time: null,
              },
            },
          },
        },
      },
    },
  });

  return `Message sent to club ${whom}.\n  Post ID: ${id}`;
}

export async function reply({ accountId, args }: HandlerParams): Promise<string> {
  const whom = args[0];
  const postId = args[1];
  const message = args.slice(2).join(" ");

  if (!whom || !postId || !message) {
    throw new Error("Usage: dms reply <club-id> <post-id> <message>");
  }

  if (!isClub(whom)) {
    throw new Error(
      "1:1 DM reply is handled by the Tlon channel plugin.\nUse the channel message tool with replyTo instead.",
    );
  }

  const client = await createToolClient(accountId);
  const author = getShipWithTilde(client);
  const sent = Date.now();
  const content: Story = markdownToStory(message);
  const idUd = formatUd(daFromUnix(sent));
  const replyId = `${author}/${idUd}`;

  await client.poke({
    app: "chat",
    mark: "chat-club-action-0",
    json: {
      id: whom,
      diff: {
        uid: "0v3",
        delta: {
          writ: {
            id: postId,
            delta: {
              reply: {
                id: replyId,
                meta: null,
                delta: {
                  add: {
                    memo: { content, author, sent },
                    time: null,
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return `Reply sent to club ${whom}.\n  Reply ID: ${replyId}`;
}

export async function react({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  const postId = args[1];
  const emoji = args[2];

  if (!ship || !postId || !emoji) {
    throw new Error(
      "Usage: dms react <~ship> <post-id> <emoji>\nExample: dms react ~sampel-palnet ~zod/170.141... thumbsup",
    );
  }

  const client = await createToolClient(accountId);
  const normalizedShip = normalizeShip(ship);
  const author = getShipWithTilde(client);

  await client.poke({
    app: "chat",
    mark: "chat-dm-action-1",
    json: {
      ship: normalizedShip,
      diff: {
        id: postId,
        delta: {
          "add-react": {
            react: emoji,
            author,
          },
        },
      },
    },
  });

  return `Reacted with ${emoji} to DM from ${normalizedShip}`;
}

export async function unreact({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  const postId = args[1];

  if (!ship || !postId) {
    throw new Error("Usage: dms unreact <~ship> <post-id>");
  }

  const client = await createToolClient(accountId);
  const normalizedShip = normalizeShip(ship);
  const author = getShipWithTilde(client);

  await client.poke({
    app: "chat",
    mark: "chat-dm-action-1",
    json: {
      ship: normalizedShip,
      diff: {
        id: postId,
        delta: {
          "del-react": author,
        },
      },
    },
  });

  return `Removed reaction from DM with ${normalizedShip}`;
}

export async function deleteDm({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  const postId = args[1];

  if (!ship || !postId) {
    throw new Error("Usage: dms delete <~ship> <post-id>");
  }

  const client = await createToolClient(accountId);
  const normalizedShip = normalizeShip(ship);

  await client.poke({
    app: "chat",
    mark: "chat-dm-action",
    json: {
      ship: normalizedShip,
      diff: {
        id: postId,
        delta: {
          del: null,
        },
      },
    },
  });

  return `Deleted DM ${postId} from conversation with ${normalizedShip}`;
}

export async function accept({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  if (!ship) {
    throw new Error("Usage: dms accept <~ship>");
  }

  const client = await createToolClient(accountId);
  const normalizedShip = normalizeShip(ship);

  await client.poke({
    app: "chat",
    mark: "chat-dm-rsvp",
    json: {
      ship: normalizedShip,
      ok: true,
    },
  });

  return `Accepted DM invite from ${normalizedShip}`;
}

export async function decline({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  if (!ship) {
    throw new Error("Usage: dms decline <~ship>");
  }

  const client = await createToolClient(accountId);
  const normalizedShip = normalizeShip(ship);

  await client.poke({
    app: "chat",
    mark: "chat-dm-rsvp",
    json: {
      ship: normalizedShip,
      ok: false,
    },
  });

  return `Declined DM invite from ${normalizedShip}`;
}
