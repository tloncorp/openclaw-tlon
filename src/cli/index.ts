#!/usr/bin/env node
/**
 * Tlon CLI - TypeScript CLI using @tloncorp/api
 * 
 * Usage:
 *   tlon contacts self|get|list|update [options]
 *   tlon channels list|groups|dms|info [options]
 *   tlon history --target <nest|ship> [--limit N]
 *   tlon groups list|info|join|leave|invite|kick|ban|... [options]
 *   tlon posts send|reply|edit|delete|react [options]
 *   tlon dm accept|decline|create [options]
 *   tlon activity unread|mentions|all [--limit N]
 *   tlon settings get|set [options]
 */

import {
  configureClient,
  getCurrentUserId,
  // Groups
  getGroups,
  getGroup,
  createGroup,
  deleteGroup,
  updateGroupMeta,
  updateGroupPrivacy,
  inviteGroupMembers,
  leaveGroup,
  kickUsersFromGroup,
  banUsersFromGroup,
  unbanUsersFromGroup,
  acceptGroupJoin,
  rejectGroupJoin,
  addGroupRole,
  deleteGroupRole,
  addMembersToRole,
  removeMembersFromRole,
  // Channels
  createChannel,
  updateChannelMeta,
  joinChannel,
  leaveChannel,
  searchChannel,
  // Posts
  sendPost,
  sendReply,
  editPost,
  deletePost,
  addReaction,
  removeReaction,
  getChannelPosts,
  // DMs
  respondToDMInvite,
  createGroupDm,
  // Contacts
  getContacts,
  updateContactMetadata,
  // Activity
  getGroupAndChannelUnreads,
  getInitialActivity,
  // Settings
  getSettings,
  setSetting,
  // Utils
  scry,
  poke,
} from '@tloncorp/api';

// =============================================================================
// Configuration
// =============================================================================

function getConfig(): { url: string; ship: string; code: string } {
  const url = process.env.TLON_URL;
  const ship = process.env.TLON_SHIP;
  const code = process.env.TLON_CODE;

  if (!url || !ship || !code) {
    const missing = [];
    if (!url) missing.push('TLON_URL');
    if (!ship) missing.push('TLON_SHIP');
    if (!code) missing.push('TLON_CODE');
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  return { url, ship: ship.startsWith('~') ? ship : `~${ship}`, code };
}

function setupClient(): string {
  const { url, ship, code } = getConfig();
  
  configureClient({
    shipName: ship,
    shipUrl: url,
    getCode: async () => code,
  });
  
  return ship;
}

// =============================================================================
// Output Helpers
// =============================================================================

function output(success: boolean, data?: unknown, error?: string): void {
  if (success) {
    console.log(JSON.stringify({ success: true, data }));
  } else {
    console.log(JSON.stringify({ success: false, error }));
  }
}

// =============================================================================
// Command Handlers
// =============================================================================

async function cmdContacts(args: string[]): Promise<unknown> {
  const action = args[0];
  const ship = setupClient();

  switch (action) {
    case 'self': {
      const contacts = await getContacts();
      return contacts.find(c => c.id === ship) || { id: ship };
    }
    case 'get': {
      const targetShip = getArg(args, '--ship');
      if (!targetShip) throw new Error('--ship required');
      const contacts = await getContacts();
      return contacts.find(c => c.id === targetShip) || { id: targetShip };
    }
    case 'list': {
      return await getContacts();
    }
    case 'update': {
      const nickname = getArg(args, '--nickname');
      const bio = getArg(args, '--bio');
      const status = getArg(args, '--status');
      const avatarImage = getArg(args, '--avatar');
      const coverImage = getArg(args, '--cover');
      
      await updateContactMetadata({
        id: ship,
        ...(nickname && { nickname }),
        ...(bio && { bio }),
        ...(status && { status }),
        ...(avatarImage && { avatarImage }),
        ...(coverImage && { coverImage }),
      });
      return { updated: true };
    }
    default:
      throw new Error(`Unknown contacts action: ${action}`);
  }
}

async function cmdChannels(args: string[]): Promise<unknown> {
  const action = args[0];
  setupClient();

  switch (action) {
    case 'list': {
      const result = await scry({ app: 'channels', path: '/v2/channels' });
      return Object.keys(result || {}).map(nest => ({ nest, kind: nest.split('/')[0] }));
    }
    case 'groups': {
      const groups = await getGroups();
      return groups.map(g => ({ id: g.id, title: g.title }));
    }
    case 'dms': {
      const result = await scry({ app: 'chat', path: '/dm' });
      return result || [];
    }
    case 'info': {
      const channel = getArg(args, '--channel');
      if (!channel) throw new Error('--channel required');
      const result = await scry({ app: 'channels', path: `/v2/channels/${encodeURIComponent(channel)}` });
      return result;
    }
    case 'search': {
      const channel = getArg(args, '--channel');
      const query = getArg(args, '--query');
      if (!channel || !query) throw new Error('--channel and --query required');
      return await searchChannel({ channelId: channel, query });
    }
    default:
      throw new Error(`Unknown channels action: ${action}`);
  }
}

async function cmdHistory(args: string[]): Promise<unknown> {
  setupClient();
  
  const target = getArg(args, '--target');
  const limit = parseInt(getArg(args, '--limit') || '20', 10);
  
  if (!target) throw new Error('--target required');

  const { posts } = await getChannelPosts({
    channelId: target,
    count: limit,
    mode: 'newest',
  });

  return posts.map(p => ({
    id: p.id,
    author: p.authorId,
    sent: p.sentAt,
    content: p.textContent,
    replyCount: p.replyCount || 0,
  }));
}

async function cmdGroups(args: string[]): Promise<unknown> {
  const action = args[0];
  const ship = setupClient();

  switch (action) {
    case 'list': {
      const groups = await getGroups();
      return groups.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        privacy: g.privacy,
        memberCount: g.members?.length || 0,
      }));
    }
    case 'info': {
      const groupId = getArg(args, '--group');
      if (!groupId) throw new Error('--group required');
      return await getGroup(groupId);
    }
    case 'create': {
      const title = getArg(args, '--title');
      const description = getArg(args, '--description') || '';
      if (!title) throw new Error('--title required');
      
      return await createGroup({
        group: {
          id: '',
          title,
          description,
          privacy: 'private',
          currentUserIsMember: true,
          currentUserIsHost: true,
          hostUserId: ship,
        },
      });
    }
    case 'delete': {
      const groupId = getArg(args, '--group');
      if (!groupId) throw new Error('--group required');
      await deleteGroup({ groupId });
      return { deleted: groupId };
    }
    case 'join': {
      const groupId = getArg(args, '--group');
      if (!groupId) throw new Error('--group required');
      // Join is done via poke
      await poke({
        app: 'groups',
        mark: 'group-join',
        json: { flag: groupId, 'join-all': true },
      });
      return { joined: groupId };
    }
    case 'leave': {
      const groupId = getArg(args, '--group');
      if (!groupId) throw new Error('--group required');
      await leaveGroup({ groupId });
      return { left: groupId };
    }
    case 'invite': {
      const groupId = getArg(args, '--group');
      const ships = getArgs(args, '--ships');
      if (!groupId || ships.length === 0) throw new Error('--group and --ships required');
      await inviteGroupMembers({ groupId, contactIds: ships });
      return { invited: ships, group: groupId };
    }
    case 'kick': {
      const groupId = getArg(args, '--group');
      const ships = getArgs(args, '--ships');
      if (!groupId || ships.length === 0) throw new Error('--group and --ships required');
      await kickUsersFromGroup({ groupId, contactIds: ships });
      return { kicked: ships, group: groupId };
    }
    case 'ban': {
      const groupId = getArg(args, '--group');
      const ships = getArgs(args, '--ships');
      if (!groupId || ships.length === 0) throw new Error('--group and --ships required');
      await banUsersFromGroup({ groupId, contactIds: ships });
      return { banned: ships, group: groupId };
    }
    case 'unban': {
      const groupId = getArg(args, '--group');
      const ships = getArgs(args, '--ships');
      if (!groupId || ships.length === 0) throw new Error('--group and --ships required');
      await unbanUsersFromGroup({ groupId, contactIds: ships });
      return { unbanned: ships, group: groupId };
    }
    case 'set-privacy': {
      const groupId = getArg(args, '--group');
      const privacy = getArg(args, '--privacy') as 'public' | 'private' | 'secret';
      if (!groupId || !privacy) throw new Error('--group and --privacy required');
      await updateGroupPrivacy({ groupId, privacy });
      return { group: groupId, privacy };
    }
    case 'accept-join': {
      const groupId = getArg(args, '--group');
      const ships = getArgs(args, '--ships');
      if (!groupId || ships.length === 0) throw new Error('--group and --ships required');
      for (const contactId of ships) {
        await acceptGroupJoin({ groupId, contactId });
      }
      return { accepted: ships, group: groupId };
    }
    case 'reject-join': {
      const groupId = getArg(args, '--group');
      const ships = getArgs(args, '--ships');
      if (!groupId || ships.length === 0) throw new Error('--group and --ships required');
      for (const contactId of ships) {
        await rejectGroupJoin({ groupId, contactId });
      }
      return { rejected: ships, group: groupId };
    }
    case 'add-role': {
      const groupId = getArg(args, '--group');
      const roleId = getArg(args, '--role');
      const title = getArg(args, '--title') || roleId;
      const description = getArg(args, '--description') || '';
      if (!groupId || !roleId) throw new Error('--group and --role required');
      await addGroupRole({ groupId, roleId, title, description });
      return { role: roleId, group: groupId };
    }
    case 'delete-role': {
      const groupId = getArg(args, '--group');
      const roleId = getArg(args, '--role');
      if (!groupId || !roleId) throw new Error('--group and --role required');
      await deleteGroupRole({ groupId, roleId });
      return { deleted: roleId, group: groupId };
    }
    case 'assign-role': {
      const groupId = getArg(args, '--group');
      const roleId = getArg(args, '--role');
      const ships = getArgs(args, '--ships');
      if (!groupId || !roleId || ships.length === 0) throw new Error('--group, --role and --ships required');
      await addMembersToRole({ groupId, roleId, contactIds: ships });
      return { role: roleId, assigned: ships, group: groupId };
    }
    case 'remove-role': {
      const groupId = getArg(args, '--group');
      const roleId = getArg(args, '--role');
      const ships = getArgs(args, '--ships');
      if (!groupId || !roleId || ships.length === 0) throw new Error('--group, --role and --ships required');
      await removeMembersFromRole({ groupId, roleId, contactIds: ships });
      return { role: roleId, removed: ships, group: groupId };
    }
    default:
      throw new Error(`Unknown groups action: ${action}`);
  }
}

async function cmdPosts(args: string[]): Promise<unknown> {
  const action = args[0];
  const ship = setupClient();

  switch (action) {
    case 'send': {
      const channel = getArg(args, '--channel');
      const content = getArg(args, '--content');
      if (!channel || !content) throw new Error('--channel and --content required');
      
      await sendPost({
        channelId: channel,
        authorId: ship,
        sentAt: Date.now(),
        content: [{ inline: [content] }],
      });
      return { sent: true, channel };
    }
    case 'reply': {
      const channel = getArg(args, '--channel');
      const postId = getArg(args, '--post-id');
      const content = getArg(args, '--content');
      if (!channel || !postId || !content) throw new Error('--channel, --post-id and --content required');
      
      await sendReply({
        channelId: channel,
        parentId: postId,
        authorId: ship,
        sentAt: Date.now(),
        content: [{ inline: [content] }],
      });
      return { replied: true, postId };
    }
    case 'edit': {
      const channel = getArg(args, '--channel');
      const postId = getArg(args, '--post-id');
      const content = getArg(args, '--content');
      if (!channel || !postId || !content) throw new Error('--channel, --post-id and --content required');
      
      await editPost({
        channelId: channel,
        postId,
        authorId: ship,
        sentAt: Date.now(),
        content: [{ inline: [content] }],
      });
      return { edited: true, postId };
    }
    case 'delete': {
      const channel = getArg(args, '--channel');
      const postId = getArg(args, '--post-id');
      if (!channel || !postId) throw new Error('--channel and --post-id required');
      
      await deletePost({ channelId: channel, postId });
      return { deleted: true, postId };
    }
    case 'react': {
      const channel = getArg(args, '--channel');
      const postId = getArg(args, '--post-id');
      const emoji = getArg(args, '--emoji');
      const remove = args.includes('--remove');
      if (!channel || !postId) throw new Error('--channel and --post-id required');
      
      if (remove) {
        await removeReaction({ channelId: channel, postId, odor: emoji || '' });
        return { removed: true, postId };
      } else {
        if (!emoji) throw new Error('--emoji required for adding reaction');
        await addReaction({ channelId: channel, postId, odor: emoji });
        return { reacted: true, emoji, postId };
      }
    }
    default:
      throw new Error(`Unknown posts action: ${action}`);
  }
}

async function cmdDm(args: string[]): Promise<unknown> {
  const action = args[0];
  setupClient();

  switch (action) {
    case 'accept': {
      const targetShip = getArg(args, '--ship');
      if (!targetShip) throw new Error('--ship required');
      await respondToDMInvite({ odor: targetShip, accept: true });
      return { accepted: targetShip };
    }
    case 'decline': {
      const targetShip = getArg(args, '--ship');
      if (!targetShip) throw new Error('--ship required');
      await respondToDMInvite({ odor: targetShip, accept: false });
      return { declined: targetShip };
    }
    case 'create': {
      const ships = getArgs(args, '--ships');
      if (ships.length === 0) throw new Error('--ships required');
      const result = await createGroupDm({ contactIds: ships });
      return result;
    }
    default:
      throw new Error(`Unknown dm action: ${action}`);
  }
}

async function cmdActivity(args: string[]): Promise<unknown> {
  const action = args[0];
  const limit = parseInt(getArg(args, '--limit') || '20', 10);
  setupClient();

  switch (action) {
    case 'unread': {
      return await getGroupAndChannelUnreads();
    }
    case 'mentions':
    case 'all': {
      const activity = await getInitialActivity();
      // Filter for mentions if needed
      if (action === 'mentions') {
        return activity.filter((a: any) => a.type === 'mention').slice(0, limit);
      }
      return activity.slice(0, limit);
    }
    default:
      throw new Error(`Unknown activity action: ${action}`);
  }
}

async function cmdSettings(args: string[]): Promise<unknown> {
  const action = args[0];
  setupClient();

  switch (action) {
    case 'get': {
      return await getSettings();
    }
    case 'set': {
      const key = getArg(args, '--key');
      const value = getArg(args, '--value');
      if (!key || value === undefined) throw new Error('--key and --value required');
      
      let parsedValue: unknown;
      try {
        parsedValue = JSON.parse(value);
      } catch {
        parsedValue = value;
      }
      
      await setSetting({ key, value: parsedValue });
      return { set: key, value: parsedValue };
    }
    default:
      throw new Error(`Unknown settings action: ${action}`);
  }
}

// =============================================================================
// Argument Parsing Helpers
// =============================================================================

function getArg(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  return undefined;
}

function getArgs(args: string[], name: string): string[] {
  const idx = args.indexOf(name);
  if (idx === -1) return [];
  
  const result: string[] = [];
  for (let i = idx + 1; i < args.length; i++) {
    if (args[i].startsWith('--')) break;
    result.push(args[i].startsWith('~') ? args[i] : `~${args[i]}`);
  }
  return result;
}

// =============================================================================
// Main
// =============================================================================

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const command = args[0];
  const subArgs = args.slice(1);

  try {
    let result: unknown;

    switch (command) {
      case 'contacts':
        result = await cmdContacts(subArgs);
        break;
      case 'channels':
        result = await cmdChannels(subArgs);
        break;
      case 'history':
        result = await cmdHistory(subArgs);
        break;
      case 'groups':
        result = await cmdGroups(subArgs);
        break;
      case 'posts':
        result = await cmdPosts(subArgs);
        break;
      case 'dm':
        result = await cmdDm(subArgs);
        break;
      case 'activity':
        result = await cmdActivity(subArgs);
        break;
      case 'settings':
        result = await cmdSettings(subArgs);
        break;
      case '--help':
      case '-h':
      case undefined:
        console.log(`Tlon CLI - Interact with Tlon/Urbit

Commands:
  contacts  self|get|list|update       Manage contacts and profiles
  channels  list|groups|dms|info|search List channels and search
  history   --target <nest|ship>       Fetch message history
  groups    list|info|create|join|...  Full group management
  posts     send|reply|edit|delete|react Manage posts
  dm        accept|decline|create      Manage DMs
  activity  unread|mentions|all        Check activity
  settings  get|set                    Manage settings

Environment:
  TLON_URL   Ship URL (e.g., https://your-ship.tlon.network)
  TLON_SHIP  Ship name (e.g., ~zod)
  TLON_CODE  Access code`);
        return 0;
      default:
        throw new Error(`Unknown command: ${command}`);
    }

    output(true, result);
    return 0;
  } catch (err) {
    output(false, undefined, err instanceof Error ? err.message : String(err));
    return 1;
  }
}

main().then(process.exit);
