import { scot, da } from "@urbit/aura";
import { markdownToStory, createImageBlock, isImageUrl, type Story } from "./story.js";

export type TlonPokeApi = {
  poke: (params: { app: string; mark: string; json: unknown }) => Promise<unknown>;
};

type SendTextParams = {
  api: TlonPokeApi;
  fromShip: string;
  toShip: string;
  text: string;
  replyToId?: string | null;
};

type SendStoryParams = {
  api: TlonPokeApi;
  fromShip: string;
  toShip: string;
  story: Story;
  replyToId?: string | null;
};

export async function sendDm({ api, fromShip, toShip, text, replyToId }: SendTextParams) {
  const story: Story = markdownToStory(text);
  return sendDmWithStory({ api, fromShip, toShip, story, replyToId });
}

export async function sendDmWithStory({ api, fromShip, toShip, story, replyToId }: SendStoryParams) {
  const sentAt = Date.now();
  const idUd = scot("ud", da.fromUnix(sentAt));
  const replyId = `${fromShip}/${idUd}`;

  // DM thread reply
  if (replyToId) {
    const formattedParentId = formatPostId(replyToId);
    const delta = {
      reply: {
        id: replyId,
        meta: null,
        delta: {
          add: {
            memo: {
              content: story,
              author: fromShip,
              sent: sentAt,
            },
            time: null,
          },
        },
      },
    };

    await api.poke({
      app: "chat",
      mark: "chat-dm-action-1",
      json: {
        ship: toShip,
        diff: { id: formattedParentId, delta },
      },
    });

    return { channel: "tlon", messageId: replyId };
  }

  // Regular DM (top-level)
  const delta = {
    add: {
      memo: {
        content: story,
        author: fromShip,
        sent: sentAt,
      },
      kind: null,
      time: null,
    },
  };

  const action = {
    ship: toShip,
    diff: { id: replyId, delta },
  };

  await api.poke({
    app: "chat",
    mark: "chat-dm-action",
    json: action,
  });

  return { channel: "tlon", messageId: replyId };
}

type SendGroupParams = {
  api: TlonPokeApi;
  fromShip: string;
  hostShip: string;
  channelName: string;
  text: string;
  replyToId?: string | null;
};

type SendGroupStoryParams = {
  api: TlonPokeApi;
  fromShip: string;
  hostShip: string;
  channelName: string;
  story: Story;
  replyToId?: string | null;
};

export async function sendGroupMessage({
  api,
  fromShip,
  hostShip,
  channelName,
  text,
  replyToId,
}: SendGroupParams) {
  const story: Story = markdownToStory(text);
  return sendGroupMessageWithStory({ api, fromShip, hostShip, channelName, story, replyToId });
}

export async function sendGroupMessageWithStory({
  api,
  fromShip,
  hostShip,
  channelName,
  story,
  replyToId,
}: SendGroupStoryParams) {
  const sentAt = Date.now();

  // Format reply ID as @ud (with dots) - required for Tlon to recognize thread replies
  let formattedReplyId = replyToId;
  if (replyToId && /^\d+$/.test(replyToId)) {
    try {
      // scot('ud', n) formats a number as @ud with dots
      formattedReplyId = scot("ud", BigInt(replyToId));
    } catch {
      // Fall back to raw ID if formatting fails
    }
  }

  const action = {
    channel: {
      nest: `chat/${hostShip}/${channelName}`,
      action: formattedReplyId
        ? {
            // Thread reply - needs post wrapper around reply action
            // ReplyActionAdd takes Memo: {content, author, sent} - no kind/blob/meta
            post: {
              reply: {
                id: formattedReplyId,
                action: {
                  add: {
                    content: story,
                    author: fromShip,
                    sent: sentAt,
                  },
                },
              },
            },
          }
        : {
            // Regular post
            post: {
              add: {
                content: story,
                author: fromShip,
                sent: sentAt,
                kind: "/chat",
                blob: null,
                meta: null,
              },
            },
          },
    },
  };

  await api.poke({
    app: "channels",
    mark: "channel-action-1",
    json: action,
  });

  return { channel: "tlon", messageId: `${fromShip}/${sentAt}` };
}

export function buildMediaText(text: string | undefined, mediaUrl: string | undefined): string {
  const cleanText = text?.trim() ?? "";
  const cleanUrl = mediaUrl?.trim() ?? "";
  if (cleanText && cleanUrl) {
    return `${cleanText}\n${cleanUrl}`;
  }
  if (cleanUrl) {
    return cleanUrl;
  }
  return cleanText;
}

/**
 * Build a story with text and optional media (image)
 */
export function buildMediaStory(text: string | undefined, mediaUrl: string | undefined): Story {
  const story: Story = [];
  const cleanText = text?.trim() ?? "";
  const cleanUrl = mediaUrl?.trim() ?? "";

  // Add text content if present
  if (cleanText) {
    story.push(...markdownToStory(cleanText));
  }

  // Add image block if URL looks like an image
  if (cleanUrl && isImageUrl(cleanUrl)) {
    story.push(createImageBlock(cleanUrl, ""));
  } else if (cleanUrl) {
    // For non-image URLs, add as a link
    story.push({ inline: [{ link: { href: cleanUrl, content: cleanUrl } }] });
  }

  return story.length > 0 ? story : [{ inline: [""] }];
}

// --- Reactions ---

type ChannelReactParams = {
  api: TlonPokeApi;
  fromShip: string;
  hostShip: string;
  channelName: string;
  postId: string;
  react: string;
  nestPrefix?: string;
  parentId?: string; // For reacting to a reply/comment (postId is the reply, parentId is the parent post)
};

function formatPostId(postId: string): string {
  if (/^\d+$/.test(postId)) {
    try {
      return scot("ud", BigInt(postId));
    } catch {
      // fall through
    }
  }
  return postId;
}

export async function addChannelReaction({
  api,
  fromShip,
  hostShip,
  channelName,
  postId,
  react,
  nestPrefix = "chat",
  parentId,
}: ChannelReactParams) {
  const nest = `${nestPrefix}/${hostShip}/${channelName}`;
  const formattedPostId = formatPostId(postId);

  // Reacting to a reply/comment requires wrapping in post.reply structure
  if (parentId) {
    const formattedParentId = formatPostId(parentId);
    await api.poke({
      app: "channels",
      mark: "channel-action-1",
      json: {
        channel: {
          nest,
          action: {
            post: {
              reply: {
                id: formattedParentId,
                action: {
                  "add-react": {
                    id: formattedPostId,
                    react,
                    ship: fromShip,
                  },
                },
              },
            },
          },
        },
      },
    });
    return;
  }

  await api.poke({
    app: "channels",
    mark: "channel-action-1",
    json: {
      channel: {
        nest,
        action: {
          post: {
            "add-react": {
              id: formattedPostId,
              react,
              ship: fromShip,
            },
          },
        },
      },
    },
  });
}

export async function removeChannelReaction({
  api,
  fromShip,
  hostShip,
  channelName,
  postId,
  nestPrefix = "chat",
  parentId,
}: Omit<ChannelReactParams, "react">) {
  const nest = `${nestPrefix}/${hostShip}/${channelName}`;
  const formattedPostId = formatPostId(postId);

  // Removing reaction from a reply/comment
  if (parentId) {
    const formattedParentId = formatPostId(parentId);
    await api.poke({
      app: "channels",
      mark: "channel-action-1",
      json: {
        channel: {
          nest,
          action: {
            post: {
              reply: {
                id: formattedParentId,
                action: {
                  "del-react": {
                    id: formattedPostId,
                    ship: fromShip,
                  },
                },
              },
            },
          },
        },
      },
    });
    return;
  }

  await api.poke({
    app: "channels",
    mark: "channel-action-1",
    json: {
      channel: {
        nest,
        action: {
          post: {
            "del-react": {
              id: formattedPostId,
              ship: fromShip,
            },
          },
        },
      },
    },
  });
}

type DmReactParams = {
  api: TlonPokeApi;
  fromShip: string;
  toShip: string;
  messageId: string;
  react: string;
};

export async function addDmReaction({
  api,
  fromShip,
  toShip,
  messageId,
  react,
}: DmReactParams) {
  await api.poke({
    app: "chat",
    mark: "chat-dm-action-1",
    json: {
      ship: toShip,
      diff: {
        id: messageId,
        delta: {
          "add-react": {
            react,
            author: fromShip,
          },
        },
      },
    },
  });
}

export async function removeDmReaction({
  api,
  fromShip,
  toShip,
  messageId,
}: Omit<DmReactParams, "react">) {
  await api.poke({
    app: "chat",
    mark: "chat-dm-action-1",
    json: {
      ship: toShip,
      diff: {
        id: messageId,
        delta: {
          "del-react": fromShip,
        },
      },
    },
  });
}

// --- Heap/Gallery ---

type SendHeapPostParams = {
  api: TlonPokeApi;
  fromShip: string;
  hostShip: string;
  channelName: string;
  story: Story;
  title?: string;
};

export async function sendHeapPost({
  api,
  fromShip,
  hostShip,
  channelName,
  story,
  title,
}: SendHeapPostParams) {
  const sentAt = Date.now();
  const nest = `heap/${hostShip}/${channelName}`;

  const action = {
    channel: {
      nest,
      action: {
        post: {
          add: {
            content: story,
            author: fromShip,
            sent: sentAt,
            kind: "/heap",
            blob: null,
            meta: title ? { title } : null,
          },
        },
      },
    },
  };

  await api.poke({
    app: "channels",
    mark: "channel-action-1",
    json: action,
  });

  return { channel: "tlon", messageId: `${fromShip}/${sentAt}` };
}

type HeapCommentParams = {
  api: TlonPokeApi;
  fromShip: string;
  hostShip: string;
  channelName: string;
  curioId: string;
  story: Story;
};

export async function commentOnHeapPost({
  api,
  fromShip,
  hostShip,
  channelName,
  curioId,
  story,
}: HeapCommentParams) {
  const sentAt = Date.now();
  const nest = `heap/${hostShip}/${channelName}`;
  const formattedCurioId = formatPostId(curioId);

  const action = {
    channel: {
      nest,
      action: {
        post: {
          reply: {
            id: formattedCurioId,
            action: {
              add: {
                content: story,
                author: fromShip,
                sent: sentAt,
              },
            },
          },
        },
      },
    },
  };

  await api.poke({
    app: "channels",
    mark: "channel-action-1",
    json: action,
  });

  return { channel: "tlon", messageId: `${fromShip}/${sentAt}` };
}

type DeleteHeapPostParams = {
  api: TlonPokeApi;
  hostShip: string;
  channelName: string;
  curioId: string;
};

export async function deleteHeapPost({
  api,
  hostShip,
  channelName,
  curioId,
}: DeleteHeapPostParams) {
  const nest = `heap/${hostShip}/${channelName}`;
  const formattedCurioId = formatPostId(curioId);

  const action = {
    channel: {
      nest,
      action: {
        post: {
          del: {
            id: formattedCurioId,
          },
        },
      },
    },
  };

  await api.poke({
    app: "channels",
    mark: "channel-action-1",
    json: action,
  });

  return { ok: true };
}
