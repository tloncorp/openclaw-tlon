import {
  sendPost as apiSendPost,
  sendReply as apiSendReply,
  addReaction as apiAddReaction,
  removeReaction as apiRemoveReaction,
  deletePost as apiDeletePost,
} from "@tloncorp/api";
import { scot, da } from "@urbit/aura";
import { markdownToStory, createImageBlock, isImageUrl, type Story } from "./story.js";

// --- Helpers ---

/**
 * Format a post ID as @ud (with dots) if it's a bare digit string.
 * Tlon requires @ud-formatted IDs for post references.
 */
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

/**
 * Parse a writ-id string into author and bare ID components.
 * Writ-ids look like "~sampel-palnet/170.141.184..." (author/udId).
 * Returns the components for use with @tloncorp/api which expects them separately.
 */
function parseWritId(id: string): { author: string; bareId: string } {
  if (id.includes("/") && id.startsWith("~")) {
    const idx = id.indexOf("/");
    return { author: id.slice(0, idx), bareId: id.slice(idx + 1) };
  }
  return { author: "", bareId: id };
}

/**
 * Compute a @ud-formatted timestamp for building message IDs.
 */
function formatSentAt(sentAt: number): string {
  return scot("ud", da.fromUnix(sentAt));
}

// --- DMs ---

type SendTextParams = {
  fromShip: string;
  toShip: string;
  text: string;
  replyToId?: string | null;
  parentAuthor?: string;
};

type SendStoryParams = {
  fromShip: string;
  toShip: string;
  story: Story;
  replyToId?: string | null;
  parentAuthor?: string;
};

export async function sendDm(params: SendTextParams) {
  const story: Story = markdownToStory(params.text);
  return sendDmWithStory({ ...params, story });
}

export async function sendDmWithStory({
  fromShip,
  toShip,
  story,
  replyToId,
  parentAuthor,
}: SendStoryParams) {
  const sentAt = Date.now();
  const messageId = `${fromShip}/${formatSentAt(sentAt)}`;

  if (replyToId) {
    const parsed = parseWritId(replyToId);
    const effectiveAuthor = parentAuthor || parsed.author || toShip;
    const bareParentId = formatPostId(parsed.bareId);

    await apiSendReply({
      channelId: toShip,
      parentId: bareParentId,
      parentAuthor: effectiveAuthor,
      content: story,
      sentAt,
      authorId: fromShip,
    });
    return { channel: "tlon", messageId };
  }

  await apiSendPost({
    channelId: toShip,
    authorId: fromShip,
    sentAt,
    content: story,
  });
  return { channel: "tlon", messageId };
}

// --- Group channels ---

type SendGroupParams = {
  fromShip: string;
  hostShip: string;
  channelName: string;
  text: string;
  replyToId?: string | null;
};

type SendGroupStoryParams = {
  fromShip: string;
  hostShip: string;
  channelName: string;
  story: Story;
  replyToId?: string | null;
};

export async function sendGroupMessage({
  fromShip,
  hostShip,
  channelName,
  text,
  replyToId,
}: SendGroupParams) {
  const story: Story = markdownToStory(text);
  return sendGroupMessageWithStory({ fromShip, hostShip, channelName, story, replyToId });
}

export async function sendGroupMessageWithStory({
  fromShip,
  hostShip,
  channelName,
  story,
  replyToId,
}: SendGroupStoryParams) {
  const sentAt = Date.now();
  const nest = `chat/${hostShip}/${channelName}`;

  if (replyToId) {
    const formattedReplyId = formatPostId(replyToId);
    await apiSendReply({
      channelId: nest,
      parentId: formattedReplyId,
      parentAuthor: "", // Not used for channel replies
      content: story,
      sentAt,
      authorId: fromShip,
    });
    return { channel: "tlon", messageId: `${fromShip}/${sentAt}` };
  }

  await apiSendPost({
    channelId: nest,
    authorId: fromShip,
    sentAt,
    content: story,
  });
  return { channel: "tlon", messageId: `${fromShip}/${sentAt}` };
}

// --- Utilities ---

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
  fromShip: string;
  hostShip: string;
  channelName: string;
  postId: string;
  react: string;
  nestPrefix?: string;
  parentId?: string;
};

export async function addChannelReaction({
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

  await apiAddReaction({
    channelId: nest,
    postId: formattedPostId,
    emoji: react,
    our: fromShip,
    postAuthor: fromShip, // Not used for channel reactions
    ...(parentId && { parentId: formatPostId(parentId) }),
  });
}

export async function removeChannelReaction({
  fromShip,
  hostShip,
  channelName,
  postId,
  nestPrefix = "chat",
  parentId,
}: Omit<ChannelReactParams, "react">) {
  const nest = `${nestPrefix}/${hostShip}/${channelName}`;
  const formattedPostId = formatPostId(postId);

  await apiRemoveReaction({
    channelId: nest,
    postId: formattedPostId,
    our: fromShip,
    postAuthor: fromShip, // Not used for channel reactions
    ...(parentId && { parentId: formatPostId(parentId) }),
  });
}

type DmReactParams = {
  fromShip: string;
  toShip: string;
  messageId: string;
  react: string;
  parentId?: string;
  postAuthor?: string;
  parentAuthor?: string;
};

export async function addDmReaction({
  fromShip,
  toShip,
  messageId,
  react,
  parentId,
  postAuthor,
  parentAuthor,
}: DmReactParams) {
  const parsedMessage = parseWritId(messageId);
  const effectivePostAuthor = postAuthor || parsedMessage.author || toShip;
  const formattedPostId = formatPostId(parsedMessage.bareId);

  if (parentId) {
    const parsedParent = parseWritId(parentId);
    const effectiveParentAuthor = parentAuthor || parsedParent.author || toShip;
    const formattedParentId = formatPostId(parsedParent.bareId);

    await apiAddReaction({
      channelId: toShip,
      postId: formattedPostId,
      emoji: react,
      our: fromShip,
      postAuthor: effectivePostAuthor,
      parentId: formattedParentId,
      parentAuthorId: effectiveParentAuthor,
    });
    return;
  }

  await apiAddReaction({
    channelId: toShip,
    postId: formattedPostId,
    emoji: react,
    our: fromShip,
    postAuthor: effectivePostAuthor,
  });
}

export async function removeDmReaction({
  fromShip,
  toShip,
  messageId,
  parentId,
  postAuthor,
  parentAuthor,
}: Omit<DmReactParams, "react">) {
  const parsedMessage = parseWritId(messageId);
  const effectivePostAuthor = postAuthor || parsedMessage.author || toShip;
  const formattedPostId = formatPostId(parsedMessage.bareId);

  if (parentId) {
    const parsedParent = parseWritId(parentId);
    const effectiveParentAuthor = parentAuthor || parsedParent.author || toShip;
    const formattedParentId = formatPostId(parsedParent.bareId);

    await apiRemoveReaction({
      channelId: toShip,
      postId: formattedPostId,
      our: fromShip,
      postAuthor: effectivePostAuthor,
      parentId: formattedParentId,
      parentAuthorId: effectiveParentAuthor,
    });
    return;
  }

  await apiRemoveReaction({
    channelId: toShip,
    postId: formattedPostId,
    our: fromShip,
    postAuthor: effectivePostAuthor,
  });
}

// --- Heap/Gallery ---

type SendHeapPostParams = {
  fromShip: string;
  hostShip: string;
  channelName: string;
  story: Story;
  title?: string;
};

export async function sendHeapPost({
  fromShip,
  hostShip,
  channelName,
  story,
  title,
}: SendHeapPostParams) {
  const sentAt = Date.now();
  const nest = `heap/${hostShip}/${channelName}`;

  await apiSendPost({
    channelId: nest,
    authorId: fromShip,
    sentAt,
    content: story,
    metadata: title ? { title } : undefined,
  });

  return { channel: "tlon", messageId: `${fromShip}/${sentAt}` };
}

type HeapCommentParams = {
  fromShip: string;
  hostShip: string;
  channelName: string;
  curioId: string;
  story: Story;
};

export async function commentOnHeapPost({
  fromShip,
  hostShip,
  channelName,
  curioId,
  story,
}: HeapCommentParams) {
  const sentAt = Date.now();
  const nest = `heap/${hostShip}/${channelName}`;
  const formattedCurioId = formatPostId(curioId);

  await apiSendReply({
    channelId: nest,
    parentId: formattedCurioId,
    parentAuthor: "", // Not used for channel replies
    content: story,
    sentAt,
    authorId: fromShip,
  });

  return { channel: "tlon", messageId: `${fromShip}/${sentAt}` };
}

type DeleteHeapPostParams = {
  hostShip: string;
  channelName: string;
  curioId: string;
};

export async function deleteHeapPost({
  hostShip,
  channelName,
  curioId,
}: DeleteHeapPostParams) {
  const nest = `heap/${hostShip}/${channelName}`;
  const formattedCurioId = formatPostId(curioId);

  await apiDeletePost(nest, formattedCurioId, "");

  return { ok: true };
}
