import {
  type ChannelMessageActionAdapter,
  type ChannelMessageActionName,
} from "openclaw/plugin-sdk";
import {
  readStringParam,
} from "openclaw/plugin-sdk/param-readers";
import { resolveTlonAccount } from "./types.js";
import { normalizeShip, parseTlonTarget } from "./targets.js";
import { withAuthenticatedTlonApi } from "./urbit/api-client.js";
import {
  addChannelReaction,
  removeChannelReaction,
  addDmReaction,
  removeDmReaction,
  deleteHeapPost,
  sendChannelPost,
} from "./urbit/send.js";
import { markdownToStory } from "./urbit/story.js";

const SUPPORTED_ACTIONS = new Set<ChannelMessageActionName>(["react", "delete", "reply"]);

function createActionGate<T extends Record<string, boolean | undefined>>(
  actions: T | undefined,
) {
  return (key: keyof T, defaultValue = true) => {
    const value = actions?.[key];
    if (value === undefined) {
      return defaultValue;
    }
    return value !== false;
  };
}

function describeMessageToolActions(
  actions: readonly ChannelMessageActionName[],
): ReturnType<NonNullable<ChannelMessageActionAdapter["describeMessageTool"]>> {
  return { actions };
}

function jsonResult(payload: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload, null, 2),
      },
    ],
    details: payload,
  };
}

function readReactionParams(
  params: Record<string, unknown>,
  options: {
    emojiKey?: string;
    removeKey?: string;
    removeErrorMessage: string;
  },
) {
  const emojiKey = options.emojiKey ?? "emoji";
  const removeKey = options.removeKey ?? "remove";
  const remove = typeof params[removeKey] === "boolean" ? params[removeKey] : false;
  const emoji = readStringParam(params, emojiKey, {
    required: true,
    allowEmpty: true,
  });
  if (remove && !emoji) {
    throw new Error(options.removeErrorMessage);
  }
  return { emoji, remove, isEmpty: !emoji };
}

export const tlonMessageActions: ChannelMessageActionAdapter = {
  describeMessageTool: ({ cfg }) => {
    const account = resolveTlonAccount(cfg);
    if (!account.configured || !account.enabled) {
      return null;
    }
    const gate = createActionGate(
      (cfg.channels?.tlon as { actions?: Record<string, boolean | undefined> })?.actions,
    );
    const actions: ChannelMessageActionName[] = [];
    if (gate("reactions")) actions.push("react");
    if (gate("delete")) actions.push("delete");
    actions.push("reply");
    return describeMessageToolActions(actions);
  },

  supportsAction: ({ action }) => SUPPORTED_ACTIONS.has(action),

  handleAction: async ({ action, params, cfg, accountId, toolContext }) => {
    const account = resolveTlonAccount(cfg, accountId ?? undefined);
    if (!account.configured || !account.ship || !account.url || !account.code) {
      throw new Error("Tlon account not configured");
    }

    return await withAuthenticatedTlonApi(
      { url: account.url, code: account.code, ship: account.ship, allowPrivateNetwork: account.allowPrivateNetwork ?? undefined },
      async () => {
        const fromShip = normalizeShip(account.ship!);

        if (action === "react") {
          const level = account.reactionLevel ?? "minimal";
          if (level === "off" || level === "ack") {
            throw new Error(
              `Tlon agent reactions disabled (reactionLevel="${level}"). ` +
                `Set channels.tlon.reactionLevel to "minimal" or "extensive" to enable.`,
            );
          }
          return await handleReact({ params, fromShip, toolContext });
        }

        if (action === "delete") {
          return await handleDelete({ params, toolContext });
        }

        if (action === "reply") {
          return await handleReply({ params, fromShip, toolContext });
        }

        throw new Error(`Tlon action "${action}" is not supported.`);
      },
    );
  },
};

async function handleReact({
  params,
  fromShip,
  toolContext,
}: {
  params: Record<string, unknown>;
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

  // For reply/thread reactions: explicit parentId, or infer from thread context
  const parentId =
    readStringParam(params, "parentId") ??
    (toolContext as { currentThreadTs?: string })?.currentThreadTs ??
    undefined;

  if (parsed.kind === "dm") {
    if (remove) {
      await removeDmReaction({ fromShip, toShip: parsed.ship, messageId, parentId });
      return jsonResult({ ok: true, removed: true });
    }
    await addDmReaction({ fromShip, toShip: parsed.ship, messageId, react: emoji, parentId });
    return jsonResult({ ok: true, added: emoji });
  }

  // Channel reaction (chat, heap, or diary)
  // Extract nest prefix from the nest string (e.g., "heap" from "heap/~host/channel")
  const nestPrefix = parsed.nest.split("/")[0];
  if (remove) {
    await removeChannelReaction({
      fromShip,
      hostShip: parsed.hostShip,
      channelName: parsed.channelName,
      postId: messageId,
      nestPrefix,
      parentId,
    });
    return jsonResult({ ok: true, removed: true });
  }
  await addChannelReaction({
    fromShip,
    hostShip: parsed.hostShip,
    channelName: parsed.channelName,
    postId: messageId,
    react: emoji,
    nestPrefix,
    parentId,
  });
  return jsonResult({ ok: true, added: emoji });
}

async function handleDelete({
  params,
  toolContext,
}: {
  params: Record<string, unknown>;
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
    throw new Error("Tlon delete is only supported for channel posts.");
  }

  const nestPrefix = parsed.nest.split("/")[0];
  if (nestPrefix !== "heap") {
    throw new Error("Tlon delete is currently only supported for heap posts. Use heap/~host/channel as the target.");
  }

  await deleteHeapPost({
    hostShip: parsed.hostShip,
    channelName: parsed.channelName,
    curioId: messageId,
  });

  return jsonResult({ ok: true, deleted: messageId });
}

async function handleReply({
  params,
  fromShip,
  toolContext,
}: {
  params: Record<string, unknown>;
  fromShip: string;
  toolContext?: { currentChannelId?: string };
}) {
  const messageId = readStringParam(params, "messageId");
  if (!messageId) {
    throw new Error(
      "Tlon reply requires messageId parameter (the ID of the post to reply to).",
    );
  }

  const message = readStringParam(params, "message");
  if (!message) {
    throw new Error("Tlon reply requires message parameter (the reply text).");
  }

  const to =
    readStringParam(params, "target") ??
    readStringParam(params, "to") ??
    toolContext?.currentChannelId;
  if (!to) {
    throw new Error("Tlon reply requires 'to' parameter (target channel).");
  }

  const parsed = parseTlonTarget(to);
  if (!parsed) {
    throw new Error(`Invalid Tlon target: ${to}`);
  }

  const story = markdownToStory(message);

  if (parsed.kind === "dm") {
    throw new Error(
      "Tlon reply action is supported for channel targets. For DMs, use action=send with replyTo.",
    );
  }

  // Channel reply (chat, heap, or diary)
  await sendChannelPost({
    fromShip,
    nest: parsed.nest,
    story,
    replyToId: messageId,
  });
  return jsonResult({ ok: true, replied: messageId, target: to });
}
