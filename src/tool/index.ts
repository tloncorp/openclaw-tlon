/**
 * tlon_run tool for OpenClaw
 *
 * Provides Urbit API access for activity, channels, contacts, groups,
 * messages, posts, DMs, and settings management.
 */

import * as activity from "./handlers/activity.js";
import * as channels from "./handlers/channels.js";
import * as contacts from "./handlers/contacts.js";
import * as dms from "./handlers/dms.js";
import * as groups from "./handlers/groups.js";
import * as messages from "./handlers/messages.js";
import * as posts from "./handlers/posts.js";
import * as settings from "./handlers/settings.js";
import { shellSplit } from "./parser.js";

export interface HandlerParams {
  accountId?: string;
  args: string[];
}

type HandlerFn = (params: HandlerParams) => Promise<string>;

const handlers: Record<string, Record<string, HandlerFn>> = {
  activity: {
    mentions: activity.mentions,
    replies: activity.replies,
    all: activity.all,
    unreads: activity.unreads,
  },
  channels: {
    dms: channels.dms,
    "group-dms": channels.groupDms,
    groups: channels.groups,
    all: channels.all,
    info: channels.info,
    update: channels.update,
    delete: channels.deleteChannel,
  },
  contacts: {
    list: contacts.list,
    self: contacts.self,
    get: contacts.get,
    sync: contacts.sync,
    add: contacts.add,
    remove: contacts.remove,
    "update-profile": contacts.updateProfile,
  },
  groups: {
    list: groups.list,
    info: groups.info,
    create: groups.create,
    invite: groups.invite,
    join: groups.join,
    leave: groups.leave,
    delete: groups.deleteGroup,
    update: groups.update,
    kick: groups.kick,
    ban: groups.ban,
    unban: groups.unban,
    "add-role": groups.addRole,
    "delete-role": groups.deleteRole,
    "update-role": groups.updateRole,
    "assign-role": groups.assignRole,
    "remove-role": groups.removeRole,
    "set-privacy": groups.setPrivacy,
    "accept-join": groups.acceptJoin,
    "reject-join": groups.rejectJoin,
    "add-channel": groups.addChannel,
  },
  messages: {
    dm: messages.dm,
    channel: messages.channel,
    history: messages.history,
    search: messages.search,
  },
  posts: {
    react: posts.react,
    unreact: posts.unreact,
    edit: posts.edit,
    delete: posts.deletePost,
  },
  dms: {
    send: dms.send,
    reply: dms.reply,
    react: dms.react,
    unreact: dms.unreact,
    delete: dms.deleteDm,
    accept: dms.accept,
    decline: dms.decline,
  },
  settings: {
    get: settings.get,
    set: settings.set,
    delete: settings.deleteEntry,
    "allow-dm": settings.allowDm,
    "remove-dm": settings.removeDm,
    "allow-channel": settings.allowChannel,
    "remove-channel": settings.removeChannel,
    "open-channel": settings.openChannel,
    "restrict-channel": settings.restrictChannel,
    "authorize-ship": settings.authorizeShip,
    "deauthorize-ship": settings.deauthorizeShip,
  },
};

function getUsageHelp(): string {
  return `Tlon/Urbit API tool. Commands:

activity {mentions|replies|all|unreads} [--limit N]
channels {dms|group-dms|groups|all|info|update|delete} [args...]
contacts {list|self|get|sync|add|remove|update-profile} [args...]
groups {list|info|create|invite|join|leave|delete|update|kick|ban|unban|...} [args...]
messages {dm|channel|history|search} [args...]
posts {react|unreact|edit|delete} [args...]
dms {send|reply|react|unreact|delete|accept|decline} [args...]
settings {get|set|delete|allow-dm|remove-dm|...} [args...]

Optional: --account <id> prefix for multi-account setups

Examples:
  activity mentions --limit 10
  channels groups
  contacts get ~sampel-palnet
  groups list
  messages dm ~friend --limit 20
  posts react chat/~host/slug 170.141... thumbsup
  settings allow-dm ~sampel-palnet`;
}

export const tlonToolDefinition = {
  name: "tlon_run",
  description:
    "Tlon/Urbit API access and management. Commands: activity {mentions|replies|all|unreads}, channels {dms|group-dms|groups|all|info|update|delete}, contacts {list|self|get|sync|add|remove|update-profile}, groups {list|info|create|invite|join|leave|delete|update|kick|ban|...}, messages {dm|channel|history|search}, posts {react|unreact|edit|delete}, dms {send|reply|react|unreact|delete|accept|decline}, settings {get|set|delete|allow-dm|...}",
  parameters: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description:
          "The tlon-run command and arguments. Examples: 'activity mentions --limit 10', 'channels groups', 'contacts get ~sampel-palnet', 'messages dm ~friend --limit 20', 'posts react chat/~host/slug 170.141... thumbsup'",
      },
    },
    required: ["command"],
  },
  async execute(_id: string, params: { command: string }) {
    try {
      const args = shellSplit(params.command.trim());

      if (args.length === 0) {
        return {
          content: [{ type: "text", text: getUsageHelp() }],
        };
      }

      // Handle optional --account prefix
      let accountId: string | undefined;
      let startIdx = 0;
      if (args[0] === "--account" && args[1]) {
        accountId = args[1];
        startIdx = 2;
      }

      const domain = args[startIdx];
      const action = args[startIdx + 1];
      const rest = args.slice(startIdx + 2);

      // Check for help
      if (domain === "help" || domain === "--help" || domain === "-h") {
        return {
          content: [{ type: "text", text: getUsageHelp() }],
        };
      }

      // Get the handler
      const domainHandlers = handlers[domain];
      if (!domainHandlers) {
        return {
          content: [
            {
              type: "text",
              text: `Unknown command domain: ${domain}\n\n${getUsageHelp()}`,
            },
          ],
          isError: true,
        };
      }

      if (!action) {
        const actions = Object.keys(domainHandlers).join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Missing action for ${domain}. Available: ${actions}`,
            },
          ],
          isError: true,
        };
      }

      const handler = domainHandlers[action];
      if (!handler) {
        const actions = Object.keys(domainHandlers).join(", ");
        return {
          content: [
            {
              type: "text",
              text: `Unknown action: ${domain} ${action}. Available: ${actions}`,
            },
          ],
          isError: true,
        };
      }

      // Execute the handler
      const result = await handler({ accountId, args: rest });
      return {
        content: [{ type: "text", text: result }],
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  },
};
