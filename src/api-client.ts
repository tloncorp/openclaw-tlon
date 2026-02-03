/**
 * Wrapper around @tloncorp/api for plugin operations.
 * 
 * The @tloncorp/api uses a singleton pattern, so we need to reconfigure
 * the client before each operation when dealing with multiple accounts.
 */

import {
  configureClient,
  sendPost,
  sendReply,
  getChannelPosts,
  addReaction,
  removeReaction,
  respondToDMInvite,
  scry,
  poke,
  type PostContent,
} from '@tloncorp/api';

export interface TlonAccount {
  ship: string;
  url: string;
  code: string;
}

/**
 * Configure the @tloncorp/api client for a specific account.
 * Must be called before using any API functions.
 */
export function configureForAccount(account: TlonAccount): string {
  const ship = account.ship.startsWith('~') ? account.ship : `~${account.ship}`;
  
  configureClient({
    shipName: ship,
    shipUrl: account.url,
    getCode: async () => account.code,
  });
  
  return ship;
}

/**
 * Send a text message to a channel or DM.
 */
export async function sendMessage(params: {
  account: TlonAccount;
  channelId: string;
  content: string;
  replyToId?: string;
}): Promise<{ messageId: string }> {
  const authorId = configureForAccount(params.account);
  const sentAt = Date.now();
  
  const postContent: PostContent[] = [{ inline: [params.content] }];
  
  if (params.replyToId) {
    await sendReply({
      channelId: params.channelId,
      parentId: params.replyToId,
      authorId,
      sentAt,
      content: postContent,
    });
  } else {
    await sendPost({
      channelId: params.channelId,
      authorId,
      sentAt,
      content: postContent,
    });
  }
  
  // Generate message ID (same format as @tloncorp/api)
  return { messageId: `${authorId}/${sentAt}` };
}

/**
 * Send a message with rich content (Story format).
 */
export async function sendStoryMessage(params: {
  account: TlonAccount;
  channelId: string;
  content: PostContent[];
  replyToId?: string;
}): Promise<{ messageId: string }> {
  const authorId = configureForAccount(params.account);
  const sentAt = Date.now();
  
  if (params.replyToId) {
    await sendReply({
      channelId: params.channelId,
      parentId: params.replyToId,
      authorId,
      sentAt,
      content: params.content,
    });
  } else {
    await sendPost({
      channelId: params.channelId,
      authorId,
      sentAt,
      content: params.content,
    });
  }
  
  return { messageId: `${authorId}/${sentAt}` };
}

/**
 * Fetch message history for a channel or DM.
 */
export async function fetchHistory(params: {
  account: TlonAccount;
  channelId: string;
  limit?: number;
}): Promise<Array<{
  id: string;
  author: string;
  sent: number;
  content: string;
  replyCount: number;
}>> {
  configureForAccount(params.account);
  
  const { posts } = await getChannelPosts({
    channelId: params.channelId,
    count: params.limit || 20,
    mode: 'newest',
  });
  
  return posts.map(p => ({
    id: p.id,
    author: p.authorId,
    sent: p.sentAt,
    content: p.textContent || '',
    replyCount: p.replyCount || 0,
  }));
}

/**
 * Add or remove a reaction.
 */
export async function react(params: {
  account: TlonAccount;
  channelId: string;
  postId: string;
  emoji: string;
  remove?: boolean;
}): Promise<void> {
  configureForAccount(params.account);
  
  if (params.remove) {
    await removeReaction({
      channelId: params.channelId,
      postId: params.postId,
      odor: params.emoji,
    });
  } else {
    await addReaction({
      channelId: params.channelId,
      postId: params.postId,
      odor: params.emoji,
    });
  }
}

/**
 * Accept or decline a DM invite.
 */
export async function respondToDm(params: {
  account: TlonAccount;
  ship: string;
  accept: boolean;
}): Promise<void> {
  configureForAccount(params.account);
  await respondToDMInvite({ odor: params.ship, accept: params.accept });
}

/**
 * Low-level scry.
 */
export async function scryUrbit<T>(params: {
  account: TlonAccount;
  app: string;
  path: string;
}): Promise<T> {
  configureForAccount(params.account);
  return scry({ app: params.app, path: params.path });
}

/**
 * Low-level poke.
 */
export async function pokeUrbit(params: {
  account: TlonAccount;
  app: string;
  mark: string;
  json: unknown;
}): Promise<void> {
  configureForAccount(params.account);
  await poke({ app: params.app, mark: params.mark, json: params.json });
}

// Re-export types
export type { PostContent };
