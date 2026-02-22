import {
  createActionGate,
  jsonResult,
  readReactionParams,
  readStringParam,
  type ChannelMessageActionAdapter,
  type ChannelMessageActionName,
} from "openclaw/plugin-sdk";
import { resolveTlonAccount } from "./types.js";
import { normalizeShip, parseTlonTarget } from "./targets.js";
import { createHttpPokeApi } from "./urbit/http-poke.js";
import {
  addChannelReaction,
  removeChannelReaction,
  addDmReaction,
  removeDmReaction,
  deleteHeapPost,
} from "./urbit/send.js";

const SUPPORTED_ACTIONS = new Set<ChannelMessageActionName>(["react", "delete"]);

export const tlonMessageActions: ChannelMessageActionAdapter = {
  listActions: ({ cfg }) => {
    const account = resolveTlonAccount(cfg);
    if (!account.configured || !account.enabled) {
      return [];
    }
    const gate = createActionGate(
      (cfg.channels?.tlon as { actions?: Record<string, unknown> })?.actions,
    );
    const actions: ChannelMessageActionName[] = [];
    if (gate("reactions")) actions.push("react");
    if (gate("delete")) actions.push("delete");
    return actions;
  },

  supportsAction: ({ action }) => SUPPORTED_ACTIONS.has(action),

  handleAction: async ({ action, params, cfg, accountId, toolContext }) => {
    const account = resolveTlonAccount(cfg, accountId ?? undefined);
    if (!account.configured || !account.ship || !account.url || !account.code) {
      throw new Error("Tlon account not configured");
    }

    const api = await createHttpPokeApi({
      url: account.url,
      code: account.code,
      ship: account.ship,
      allowPrivateNetwork: account.allowPrivateNetwork ?? undefined,
    });

    try {
      const fromShip = normalizeShip(account.ship);

      if (action === "react") {
        const level = account.reactionLevel ?? "minimal";
        if (level === "off" || level === "ack") {
          throw new Error(
            `Tlon agent reactions disabled (reactionLevel="${level}"). ` +
              `Set channels.tlon.reactionLevel to "minimal" or "extensive" to enable.`,
          );
        }
        return await handleReact({ params, api, fromShip, toolContext });
      }

      if (action === "delete") {
        return await handleDelete({ params, api, toolContext });
      }

      throw new Error(`Tlon action "${action}" is not supported.`);
    } finally {
      try {
        await api.delete();
      } catch {
        // ignore cleanup errors
      }
    }
  },
};

async function handleReact({
  params,
  api,
  fromShip,
  toolContext,
}: {
  params: Record<string, unknown>;
  api: { poke: (p: { app: string; mark: string; json: unknown }) => Promise<unknown>; delete: () => Promise<void> };
  fromShip: string;
  toolContext?: { currentChannelId?: string };
}) {
  const { emoji, remove, isEmpty } = readReactionParams(params, {
    removeErrorMessage: "Emoji is required to remove a Tlon reaction.",
  });
  if (isEmpty && !remove) {
    throw new Error(
      "Tlon react requires emoji parameter. Use action=react with emoji=<emoji> and messageId=<message_id>.",
    );
  }

  const messageId = readStringParam(params, "messageId");
  if (!messageId) {
    throw new Error("Tlon react requires messageId parameter.");
  }

  const to =
    readStringParam(params, "target") ??
    readStringParam(params, "to") ??
    toolContext?.currentChannelId;
  if (!to) {
    throw new Error("Tlon react requires 'to' parameter (target channel or DM).");
  }

  const parsed = parseTlonTarget(to);
  if (!parsed) {
    throw new Error(`Invalid Tlon target: ${to}`);
  }

  if (parsed.kind === "dm") {
    if (remove) {
      await removeDmReaction({ api, fromShip, toShip: parsed.ship, messageId });
      return jsonResult({ ok: true, removed: true });
    }
    await addDmReaction({ api, fromShip, toShip: parsed.ship, messageId, react: emoji });
    return jsonResult({ ok: true, added: emoji });
  }

  // Channel or heap reaction
  const nestPrefix = parsed.kind === "heap" ? "heap" : "chat";
  if (remove) {
    await removeChannelReaction({
      api,
      fromShip,
      hostShip: parsed.hostShip,
      channelName: parsed.channelName,
      postId: messageId,
      nestPrefix,
    });
    return jsonResult({ ok: true, removed: true });
  }
  await addChannelReaction({
    api,
    fromShip,
    hostShip: parsed.hostShip,
    channelName: parsed.channelName,
    postId: messageId,
    react: emoji,
    nestPrefix,
  });
  return jsonResult({ ok: true, added: emoji });
}

async function handleDelete({
  params,
  api,
  toolContext,
}: {
  params: Record<string, unknown>;
  api: { poke: (p: { app: string; mark: string; json: unknown }) => Promise<unknown>; delete: () => Promise<void> };
  toolContext?: { currentChannelId?: string };
}) {
  const messageId = readStringParam(params, "messageId");
  if (!messageId) {
    throw new Error("Tlon delete requires messageId parameter.");
  }

  const to =
    readStringParam(params, "target") ??
    readStringParam(params, "to") ??
    toolContext?.currentChannelId;
  if (!to) {
    throw new Error("Tlon delete requires 'to' parameter.");
  }

  const parsed = parseTlonTarget(to);
  if (!parsed || parsed.kind === "dm") {
    throw new Error("Tlon delete is only supported for heap posts.");
  }

  if (parsed.kind !== "heap") {
    throw new Error("Tlon delete is currently only supported for heap posts. Use heap/~host/channel as the target.");
  }

  await deleteHeapPost({
    api,
    hostShip: parsed.hostShip,
    channelName: parsed.channelName,
    curioId: messageId,
  });

  return jsonResult({ ok: true, deleted: messageId });
}
