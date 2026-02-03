/**
 * Channel post management handlers for tlon_run
 *
 * Note: Sending and replying to channel posts is handled by the openclaw-tlon
 * channel plugin. This handles reactions, edits, and deletes only.
 */

import type { HandlerParams } from "../index.js";
import { markdownToStory, type Story } from "../../urbit/story.js";
import { getOption } from "../parser.js";
import { createToolClient, getShipWithTilde } from "../urbit-client.js";

function extractNumericId(id: string): string {
  const slash = id.indexOf("/");
  return slash >= 0 ? id.slice(slash + 1) : id;
}

function formatUd(id: string): string {
  const clean = id.replace(/\./g, "");
  const parts: string[] = [];
  for (let i = clean.length; i > 0; i -= 3) {
    parts.unshift(clean.slice(Math.max(0, i - 3), i));
  }
  return parts.join(".");
}

export async function react({ accountId, args }: HandlerParams): Promise<string> {
  const nest = args[0];
  const postId = args[1];
  const emoji = args[2];

  if (!nest || !postId || !emoji) {
    throw new Error(
      "Usage: posts react <channel> <post-id> <emoji>\nExample: posts react chat/~sampel/general 170.141.184.507... thumbsup",
    );
  }

  const client = await createToolClient(accountId);
  const ship = getShipWithTilde(client);
  const formattedId = formatUd(extractNumericId(postId));

  await client.poke({
    app: "channels",
    mark: "channel-action-1",
    json: {
      channel: {
        nest,
        action: {
          post: {
            "add-react": {
              id: formattedId,
              react: emoji,
              ship,
            },
          },
        },
      },
    },
  });

  return `Reacted with ${emoji} to post ${postId}`;
}

export async function unreact({ accountId, args }: HandlerParams): Promise<string> {
  const nest = args[0];
  const postId = args[1];

  if (!nest || !postId) {
    throw new Error("Usage: posts unreact <channel> <post-id>");
  }

  const client = await createToolClient(accountId);
  const ship = getShipWithTilde(client);
  const formattedId = formatUd(extractNumericId(postId));

  await client.poke({
    app: "channels",
    mark: "channel-action-1",
    json: {
      channel: {
        nest,
        action: {
          post: {
            "del-react": {
              id: formattedId,
              ship,
            },
          },
        },
      },
    },
  });

  return `Removed reaction from post ${postId}`;
}

export async function edit({ accountId, args }: HandlerParams): Promise<string> {
  const nest = args[0];
  const postId = args[1];

  if (!nest || !postId) {
    throw new Error(
      "Usage: posts edit <channel> <post-id> <new-message> [--title <title>]\nExample: posts edit diary/~ship/notes 170.141... 'Updated content' --title 'New Title'",
    );
  }

  const title = getOption(args, "title");
  const titleIdx = args.indexOf("--title");

  let messageArgs: string[];
  if (titleIdx !== -1) {
    const beforeTitle = args.slice(2, titleIdx);
    const afterTitle = args.slice(titleIdx + 2);
    messageArgs = [...beforeTitle, ...afterTitle];
  } else {
    messageArgs = args.slice(2);
  }

  const message = messageArgs.join(" ");
  if (!message) {
    throw new Error("Message content is required");
  }

  const client = await createToolClient(accountId);
  const author = getShipWithTilde(client);
  const sent = Date.now();
  const content: Story = markdownToStory(message);

  const kind = nest.startsWith("diary/") ? "/diary" : nest.startsWith("heap/") ? "/heap" : "/chat";

  interface Essay {
    content: Story;
    author: string;
    sent: number;
    kind: string;
    blob: null;
    meta: { title: string; description: string; image: string; cover: string } | null;
  }

  const essay: Essay = {
    content,
    author,
    sent,
    kind,
    blob: null,
    meta: title
      ? {
          title,
          description: "",
          image: "",
          cover: "",
        }
      : null,
  };

  await client.poke({
    app: "channels",
    mark: "channel-action-1",
    json: {
      channel: {
        nest,
        action: {
          post: {
            edit: {
              id: formatUd(extractNumericId(postId)),
              essay,
            },
          },
        },
      },
    },
  });

  return `Post ${postId} edited.`;
}

export async function deletePost({ accountId, args }: HandlerParams): Promise<string> {
  const nest = args[0];
  const postId = args[1];

  if (!nest || !postId) {
    throw new Error(
      "Usage: posts delete <channel> <post-id>\nNote: post-id must be @ud format with dots (e.g., 170.141.184.507...).",
    );
  }

  const client = await createToolClient(accountId);

  await client.poke({
    app: "channels",
    mark: "channel-action-1",
    json: {
      channel: {
        nest,
        action: {
          post: {
            del: formatUd(extractNumericId(postId)),
          },
        },
      },
    },
  });

  return `Post ${postId} deleted.`;
}
