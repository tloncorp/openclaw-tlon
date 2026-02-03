/**
 * Tlon channel message actions adapter
 *
 * Implements OpenClaw's native action system for Tlon/Urbit operations.
 */

import {
  createActionGate,
  jsonResult,
  readNumberParam,
  readStringParam,
  type ChannelMessageActionAdapter,
  type ChannelMessageActionName,
  type ChannelToolSend,
  type OpenClawConfig,
} from "openclaw/plugin-sdk";

import { resolveTlonAccount } from "./types.js";
import { authenticate } from "./urbit/auth.js";
import { normalizeShip, parseTlonTarget } from "./targets.js";
import { markdownToStory, type Story } from "./urbit/story.js";

// Tlon-specific action definitions with capability gates
export const TLON_ACTIONS: Record<string, { gate: string; groupOnly?: boolean }> = {
  react: { gate: "reactions" },
  edit: { gate: "messages" },
  delete: { gate: "messages" },
  read: { gate: "messages" },
  search: { gate: "messages" },
  "member-info": { gate: "memberInfo" },
  "channel-info": { gate: "channelInfo" },
  "channel-list": { gate: "channelInfo" },
  "channel-create": { gate: "channelManage", groupOnly: true },
  "channel-edit": { gate: "channelManage", groupOnly: true },
  "channel-delete": { gate: "channelManage", groupOnly: true },
  kick: { gate: "groupManage", groupOnly: true },
  ban: { gate: "groupManage", groupOnly: true },
  "role-add": { gate: "groupManage", groupOnly: true },
  "role-remove": { gate: "groupManage", groupOnly: true },
  addParticipant: { gate: "groupManage", groupOnly: true },
  removeParticipant: { gate: "groupManage", groupOnly: true },
  leaveGroup: { gate: "groupManage", groupOnly: true },
  renameGroup: { gate: "groupManage", groupOnly: true },
};

export const TLON_ACTION_NAMES = Object.keys(TLON_ACTIONS) as ChannelMessageActionName[];

interface TlonClient {
  url: string;
  ship: string;
  cookie: string;
  scry: <T>(params: { app: string; path: string }) => Promise<T>;
  poke: (params: { app: string; mark: string; json: unknown }) => Promise<void>;
}

async function createClient(cfg: OpenClawConfig, accountId?: string): Promise<TlonClient> {
  const account = resolveTlonAccount(cfg, accountId);
  if (!account.configured || !account.url || !account.code || !account.ship) {
    throw new Error("Tlon account not configured");
  }

  const cookie = await authenticate(account.url, account.code);
  const ship = account.ship.replace(/^~/, "");

  return {
    url: account.url,
    ship,
    cookie,
    scry: async <T>(params: { app: string; path: string }): Promise<T> => {
      const scryUrl = `${account.url}/~/scry/${params.app}${params.path}.json`;
      const resp = await fetch(scryUrl, {
        method: "GET",
        headers: { Cookie: cookie.split(";")[0] },
      });
      if (!resp.ok) {
        throw new Error(`Scry failed (${resp.status})`);
      }
      return resp.json();
    },
    poke: async (params: { app: string; mark: string; json: unknown }): Promise<void> => {
      const channelId = `action-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const channelUrl = `${account.url}/~/channel/${channelId}`;
      const pokeReq = {
        id: 1,
        action: "poke",
        ship,
        app: params.app,
        mark: params.mark,
        json: params.json,
      };
      const resp = await fetch(channelUrl, {
        method: "PUT",
        headers: {
          Cookie: cookie.split(";")[0],
          "Content-Type": "application/json",
        },
        body: JSON.stringify([pokeReq]),
      });
      if (!resp.ok) {
        throw new Error(`Poke failed (${resp.status})`);
      }
      // Cleanup channel
      await fetch(channelUrl, {
        method: "PUT",
        headers: {
          Cookie: cookie.split(";")[0],
          "Content-Type": "application/json",
        },
        body: JSON.stringify([{ id: 2, action: "delete" }]),
      }).catch(() => {});
    },
  };
}

function formatUd(id: string): string {
  const clean = id.replace(/\./g, "");
  const parts: string[] = [];
  for (let i = clean.length; i > 0; i -= 3) {
    parts.unshift(clean.slice(Math.max(0, i - 3), i));
  }
  return parts.join(".");
}

function extractNumericId(id: string): string {
  const slash = id.indexOf("/");
  return slash >= 0 ? id.slice(slash + 1) : id;
}

const SUPPORTED_ACTIONS = new Set<ChannelMessageActionName>(TLON_ACTION_NAMES);

export const tlonMessageActions: ChannelMessageActionAdapter = {
  listActions: ({ cfg }) => {
    const account = resolveTlonAccount(cfg as OpenClawConfig);
    if (!account.enabled || !account.configured) {return [];}
    const gate = createActionGate((cfg as OpenClawConfig).channels?.tlon?.actions);
    const actions = new Set<ChannelMessageActionName>(["send"]);
    for (const actionName of TLON_ACTION_NAMES) {
      const spec = TLON_ACTIONS[actionName];
      if (!spec?.gate) {continue;}
      if (gate(spec.gate)) {actions.add(actionName);}
    }
    return Array.from(actions);
  },

  supportsAction: ({ action }) => SUPPORTED_ACTIONS.has(action),

  extractToolSend: ({ args }): ChannelToolSend | null => {
    const action = typeof args.action === "string" ? args.action.trim() : "";
    if (action !== "sendMessage" && action !== "send") {return null;}
    const to = typeof args.to === "string" ? args.to : undefined;
    if (!to) {return null;}
    const accountId = typeof args.accountId === "string" ? args.accountId.trim() : undefined;
    return { to, accountId };
  },

  handleAction: async ({ action, params, cfg, accountId }) => {
    const client = await createClient(cfg as OpenClawConfig, accountId ?? undefined);
    const shipWithTilde = `~${client.ship}`;

    // Helper to resolve channel/target
    const resolveNest = (): string => {
      const nest = readStringParam(params, "nest") ?? readStringParam(params, "channelId") ?? readStringParam(params, "to");
      if (!nest) {throw new Error(`${action} requires nest, channelId, or to parameter`);}
      return nest;
    };

    const resolveGroupId = (): string => {
      const groupId = readStringParam(params, "groupId") ?? readStringParam(params, "group");
      if (!groupId) {throw new Error(`${action} requires groupId parameter`);}
      return groupId;
    };

    // ===== REACT =====
    if (action === "react") {
      const nest = resolveNest();
      const messageId = readStringParam(params, "messageId", { required: true });
      const emoji = readStringParam(params, "emoji");
      const remove = typeof params.remove === "boolean" ? params.remove : false;

      if (!emoji && !remove) {
        throw new Error("react requires emoji parameter");
      }

      const parsed = parseTlonTarget(nest);
      const formattedId = formatUd(extractNumericId(messageId));

      if (parsed?.kind === "dm") {
        // DM reaction
        if (remove) {
          await client.poke({
            app: "chat",
            mark: "chat-dm-action-1",
            json: {
              ship: parsed.ship,
              diff: { id: messageId, delta: { "del-react": shipWithTilde } },
            },
          });
        } else {
          await client.poke({
            app: "chat",
            mark: "chat-dm-action-1",
            json: {
              ship: parsed.ship,
              diff: { id: messageId, delta: { "add-react": { react: emoji, author: shipWithTilde } } },
            },
          });
        }
      } else {
        // Channel reaction
        if (remove) {
          await client.poke({
            app: "channels",
            mark: "channel-action-1",
            json: {
              channel: { nest, action: { post: { "del-react": { id: formattedId, ship: shipWithTilde } } } },
            },
          });
        } else {
          await client.poke({
            app: "channels",
            mark: "channel-action-1",
            json: {
              channel: { nest, action: { post: { "add-react": { id: formattedId, react: emoji, ship: shipWithTilde } } } },
            },
          });
        }
      }

      return jsonResult({ ok: true, ...(remove ? { removed: true } : { added: emoji }) });
    }

    // ===== EDIT =====
    if (action === "edit") {
      const nest = resolveNest();
      const messageId = readStringParam(params, "messageId", { required: true });
      const message = readStringParam(params, "message", { required: true });
      const title = readStringParam(params, "title");

      const content: Story = markdownToStory(message);
      const kind = nest.startsWith("diary/") ? "/diary" : nest.startsWith("heap/") ? "/heap" : "/chat";

      const essay = {
        content,
        author: shipWithTilde,
        sent: Date.now(),
        kind,
        blob: null,
        meta: title ? { title, description: "", image: "", cover: "" } : null,
      };

      await client.poke({
        app: "channels",
        mark: "channel-action-1",
        json: {
          channel: { nest, action: { post: { edit: { id: formatUd(extractNumericId(messageId)), essay } } } },
        },
      });

      return jsonResult({ ok: true, edited: messageId });
    }

    // ===== DELETE =====
    if (action === "delete") {
      const nest = resolveNest();
      const messageId = readStringParam(params, "messageId", { required: true });

      const parsed = parseTlonTarget(nest);

      if (parsed?.kind === "dm") {
        await client.poke({
          app: "chat",
          mark: "chat-dm-action",
          json: {
            ship: parsed.ship,
            diff: { id: messageId, delta: { del: null } },
          },
        });
      } else {
        await client.poke({
          app: "channels",
          mark: "channel-action-1",
          json: {
            channel: { nest, action: { post: { del: formatUd(extractNumericId(messageId)) } } },
          },
        });
      }

      return jsonResult({ ok: true, deleted: messageId });
    }

    // ===== READ =====
    if (action === "read") {
      const nest = resolveNest();
      const limit = readNumberParam(params, "limit", { integer: true }) ?? 20;

      const parsed = parseTlonTarget(nest);

      if (parsed?.kind === "dm") {
        const data = await client.scry<{ writs?: Record<string, unknown> }>({
          app: "chat",
          path: `/v3/dm/${parsed.ship}/writs/newest/${limit}/light`,
        });
        return jsonResult({ ok: true, messages: data.writs ?? {} });
      } else {
        const data = await client.scry<{ posts?: Record<string, unknown> }>({
          app: "channels",
          path: `/v4/${nest}/posts/newest/${limit}/outline`,
        });
        return jsonResult({ ok: true, posts: data.posts ?? {} });
      }
    }

    // ===== SEARCH =====
    if (action === "search") {
      const nest = resolveNest();
      const query = readStringParam(params, "query", { required: true });

      const results = await client.scry<unknown>({
        app: "chat",
        path: `/v1/chats/${nest}/search/${encodeURIComponent(query)}`,
      });

      return jsonResult({ ok: true, results });
    }

    // ===== MEMBER-INFO =====
    if (action === "member-info") {
      const ship = readStringParam(params, "ship") ?? readStringParam(params, "userId", { required: true });
      const normalizedShip = normalizeShip(ship);

      const contacts = await client.scry<Record<string, unknown>>({
        app: "contacts",
        path: "/v1/book",
      });

      const profile = contacts[normalizedShip];
      return jsonResult({ ok: true, ship: normalizedShip, profile: profile ?? null });
    }

    // ===== CHANNEL-INFO =====
    if (action === "channel-info") {
      const nest = resolveNest();

      const groups = await client.scry<Record<string, { channels?: Record<string, unknown>; meta?: { title?: string } }>>({
        app: "groups",
        path: "/groups",
      });

      for (const [groupId, group] of Object.entries(groups)) {
        if (group.channels?.[nest]) {
          return jsonResult({
            ok: true,
            nest,
            group: groupId,
            groupTitle: group.meta?.title,
            channel: group.channels[nest],
          });
        }
      }

      throw new Error(`Channel ${nest} not found`);
    }

    // ===== CHANNEL-LIST =====
    if (action === "channel-list") {
      const [dms, clubs, groups] = await Promise.all([
        client.scry<string[]>({ app: "chat", path: "/dm" }),
        client.scry<Record<string, unknown>>({ app: "chat", path: "/clubs" }),
        client.scry<Record<string, { channels?: Record<string, unknown>; meta?: { title?: string } }>>({
          app: "groups",
          path: "/groups",
        }),
      ]);

      return jsonResult({
        ok: true,
        dms,
        groupDms: Object.keys(clubs),
        groups: Object.entries(groups).map(([id, g]) => ({
          id,
          title: g.meta?.title,
          channels: Object.keys(g.channels ?? {}),
        })),
      });
    }

    // ===== CHANNEL-CREATE =====
    if (action === "channel-create") {
      const groupId = resolveGroupId();
      const title = readStringParam(params, "title", { required: true });
      const kindOpt = readStringParam(params, "kind");
      const kind: "chat" | "diary" | "heap" = kindOpt && ["chat", "diary", "heap"].includes(kindOpt) ? (kindOpt as "chat" | "diary" | "heap") : "chat";
      const description = readStringParam(params, "description") ?? "";

      const slug = Math.random().toString(36).substring(2, 10);
      const nest = `${kind}/${shipWithTilde}/${slug}`;

      await client.poke({
        app: "channels",
        mark: "channel-action-1",
        json: {
          create: { kind, group: groupId, name: slug, title, description, meta: null, readers: [], writers: [] },
        },
      });

      return jsonResult({ ok: true, nest, title, group: groupId });
    }

    // ===== CHANNEL-EDIT =====
    if (action === "channel-edit") {
      const nest = resolveNest();
      const title = readStringParam(params, "title");
      const description = readStringParam(params, "description");

      if (!title && !description) {
        throw new Error("channel-edit requires title or description parameter");
      }

      // Find the group
      const groups = await client.scry<Record<string, { channels?: Record<string, { meta?: { title?: string; description?: string; image?: string; cover?: string }; zone?: string; readers?: string[]; join?: boolean; added?: number }> }>>({
        app: "groups",
        path: "/groups",
      });

      let groupFlag: string | null = null;
      let channel: { meta?: { title?: string; description?: string; image?: string; cover?: string }; zone?: string; readers?: string[]; join?: boolean; added?: number } | null = null;

      for (const [gid, group] of Object.entries(groups)) {
        if (group.channels?.[nest]) {
          groupFlag = gid;
          channel = group.channels[nest];
          break;
        }
      }

      if (!groupFlag || !channel) {
        throw new Error(`Channel ${nest} not found in any group`);
      }

      const channelUpdate = {
        added: channel.added ?? Date.now(),
        meta: {
          title: title ?? channel.meta?.title ?? "",
          description: description ?? channel.meta?.description ?? "",
          image: channel.meta?.image ?? "",
          cover: channel.meta?.cover ?? "",
        },
        section: channel.zone ?? "default",
        readers: channel.readers ?? [],
        join: channel.join ?? true,
      };

      await client.poke({
        app: "groups",
        mark: "group-action-4",
        json: {
          group: { flag: groupFlag, "a-group": { channel: { nest, "a-channel": { edit: channelUpdate } } } },
        },
      });

      return jsonResult({ ok: true, updated: nest });
    }

    // ===== CHANNEL-DELETE =====
    if (action === "channel-delete") {
      const nest = resolveNest();

      const groups = await client.scry<Record<string, { channels?: Record<string, unknown> }>>({
        app: "groups",
        path: "/groups",
      });

      let groupFlag: string | null = null;
      for (const [gid, group] of Object.entries(groups)) {
        if (group.channels?.[nest]) {
          groupFlag = gid;
          break;
        }
      }

      if (!groupFlag) {
        throw new Error(`Channel ${nest} not found in any group`);
      }

      await client.poke({
        app: "groups",
        mark: "group-action-4",
        json: {
          group: { flag: groupFlag, "a-group": { channel: { nest, "a-channel": { del: null } } } },
        },
      });

      return jsonResult({ ok: true, deleted: nest });
    }

    // ===== KICK =====
    if (action === "kick") {
      const groupId = resolveGroupId();
      const ship = readStringParam(params, "ship") ?? readStringParam(params, "userId", { required: true });
      const normalizedShip = normalizeShip(ship);

      await client.poke({
        app: "groups",
        mark: "group-action-4",
        json: {
          group: { flag: groupId, "a-group": { seat: { ships: [normalizedShip], "a-seat": { del: null } } } },
        },
      });

      return jsonResult({ ok: true, kicked: normalizedShip, group: groupId });
    }

    // ===== BAN =====
    if (action === "ban") {
      const groupId = resolveGroupId();
      const ship = readStringParam(params, "ship") ?? readStringParam(params, "userId", { required: true });
      const normalizedShip = normalizeShip(ship);
      const unban = typeof params.unban === "boolean" ? params.unban : false;

      if (unban) {
        await client.poke({
          app: "groups",
          mark: "group-action-4",
          json: {
            group: { flag: groupId, "a-group": { entry: { ban: { "del-ships": [normalizedShip] } } } },
          },
        });
        return jsonResult({ ok: true, unbanned: normalizedShip, group: groupId });
      } else {
        await client.poke({
          app: "groups",
          mark: "group-action-4",
          json: {
            group: { flag: groupId, "a-group": { entry: { ban: { "add-ships": [normalizedShip] } } } },
          },
        });
        return jsonResult({ ok: true, banned: normalizedShip, group: groupId });
      }
    }

    // ===== ROLE-ADD =====
    if (action === "role-add") {
      const groupId = resolveGroupId();
      const roleId = readStringParam(params, "roleId") ?? readStringParam(params, "role", { required: true });
      const ship = readStringParam(params, "ship") ?? readStringParam(params, "userId", { required: true });
      const normalizedShip = normalizeShip(ship);

      await client.poke({
        app: "groups",
        mark: "group-action-4",
        json: {
          group: { flag: groupId, "a-group": { seat: { ships: [normalizedShip], "a-seat": { "add-roles": [roleId] } } } },
        },
      });

      return jsonResult({ ok: true, added: roleId, ship: normalizedShip, group: groupId });
    }

    // ===== ROLE-REMOVE =====
    if (action === "role-remove") {
      const groupId = resolveGroupId();
      const roleId = readStringParam(params, "roleId") ?? readStringParam(params, "role", { required: true });
      const ship = readStringParam(params, "ship") ?? readStringParam(params, "userId", { required: true });
      const normalizedShip = normalizeShip(ship);

      await client.poke({
        app: "groups",
        mark: "group-action-4",
        json: {
          group: { flag: groupId, "a-group": { seat: { ships: [normalizedShip], "a-seat": { "del-roles": [roleId] } } } },
        },
      });

      return jsonResult({ ok: true, removed: roleId, ship: normalizedShip, group: groupId });
    }

    // ===== ADD PARTICIPANT =====
    if (action === "addParticipant") {
      const groupId = resolveGroupId();
      const ship = readStringParam(params, "ship") ?? readStringParam(params, "participant", { required: true });
      const normalizedShip = normalizeShip(ship);

      await client.poke({
        app: "groups",
        mark: "group-action-4",
        json: {
          invite: { flag: groupId, ships: [normalizedShip], "a-invite": { token: null, note: null } },
        },
      });

      return jsonResult({ ok: true, invited: normalizedShip, group: groupId });
    }

    // ===== REMOVE PARTICIPANT =====
    if (action === "removeParticipant") {
      const groupId = resolveGroupId();
      const ship = readStringParam(params, "ship") ?? readStringParam(params, "participant", { required: true });
      const normalizedShip = normalizeShip(ship);

      await client.poke({
        app: "groups",
        mark: "group-action-4",
        json: {
          group: { flag: groupId, "a-group": { seat: { ships: [normalizedShip], "a-seat": { del: null } } } },
        },
      });

      return jsonResult({ ok: true, removed: normalizedShip, group: groupId });
    }

    // ===== LEAVE GROUP =====
    if (action === "leaveGroup") {
      const groupId = resolveGroupId();

      await client.poke({
        app: "groups",
        mark: "group-leave",
        json: groupId,
      });

      return jsonResult({ ok: true, left: groupId });
    }

    // ===== RENAME GROUP =====
    if (action === "renameGroup") {
      const groupId = resolveGroupId();
      const title = readStringParam(params, "title") ?? readStringParam(params, "name", { required: true });

      const group = await client.scry<{ meta?: { title?: string; description?: string; image?: string; cover?: string } }>({
        app: "groups",
        path: `/v2/ui/groups/${groupId}`,
      });

      const meta = {
        title,
        description: group.meta?.description ?? "",
        image: group.meta?.image ?? "",
        cover: group.meta?.cover ?? "",
      };

      await client.poke({
        app: "groups",
        mark: "group-action-4",
        json: {
          group: { flag: groupId, "a-group": { meta } },
        },
      });

      return jsonResult({ ok: true, renamed: groupId, title });
    }

    throw new Error(`Action ${action} is not supported for provider tlon.`);
  },
};
