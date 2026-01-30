import { format } from "node:util";

import type { RuntimeEnv, ReplyPayload, MoltbotConfig } from "clawdbot/plugin-sdk";

import { getTlonRuntime } from "../runtime.js";
import { resolveTlonAccount } from "../types.js";
import { normalizeShip, parseChannelNest } from "../targets.js";
import { authenticate } from "../urbit/auth.js";
import { UrbitSSEClient } from "../urbit/sse-client.js";
import { sendDm, sendGroupMessage } from "../urbit/send.js";
import { cacheMessage, getChannelHistory } from "./history.js";
import { createProcessedMessageTracker } from "./processed-messages.js";
import {
  extractMessageText,
  formatModelName,
  isBotMentioned,
  isDmAllowed,
  isSummarizationRequest,
} from "./utils.js";
import { fetchAllChannels } from "./discovery.js";

export type MonitorTlonOpts = {
  runtime?: RuntimeEnv;
  abortSignal?: AbortSignal;
  accountId?: string | null;
};

type ChannelAuthorization = {
  mode?: "restricted" | "open";
  allowedShips?: string[];
};

function resolveChannelAuthorization(
  cfg: MoltbotConfig,
  channelNest: string,
): { mode: "restricted" | "open"; allowedShips: string[] } {
  const tlonConfig = cfg.channels?.tlon as
    | {
        authorization?: { channelRules?: Record<string, ChannelAuthorization> };
        defaultAuthorizedShips?: string[];
      }
    | undefined;
  const rules = tlonConfig?.authorization?.channelRules ?? {};
  const rule = rules[channelNest];
  const allowedShips = rule?.allowedShips ?? tlonConfig?.defaultAuthorizedShips ?? [];
  const mode = rule?.mode ?? "restricted";
  return { mode, allowedShips };
}

export async function monitorTlonProvider(opts: MonitorTlonOpts = {}): Promise<void> {
  const core = getTlonRuntime();
  const cfg = core.config.loadConfig() as MoltbotConfig;
  if (cfg.channels?.tlon?.enabled === false) return;

  const logger = core.logging.getChildLogger({ module: "tlon-auto-reply" });
  const formatRuntimeMessage = (...args: Parameters<RuntimeEnv["log"]>) => format(...args);
  const runtime: RuntimeEnv = opts.runtime ?? {
    log: (...args) => {
      logger.info(formatRuntimeMessage(...args));
    },
    error: (...args) => {
      logger.error(formatRuntimeMessage(...args));
    },
    exit: (code: number): never => {
      throw new Error(`exit ${code}`);
    },
  };

  const account = resolveTlonAccount(cfg, opts.accountId ?? undefined);
  if (!account.enabled) return;
  if (!account.configured || !account.ship || !account.url || !account.code) {
    throw new Error("Tlon account not configured (ship/url/code required)");
  }

  const botShipName = normalizeShip(account.ship);
  runtime.log?.(`[tlon] Starting monitor for ${botShipName}`);

  let api: UrbitSSEClient | null = null;
  try {
    runtime.log?.(`[tlon] Attempting authentication to ${account.url}...`);
    const cookie = await authenticate(account.url, account.code);
    api = new UrbitSSEClient(account.url, cookie, {
      ship: botShipName,
      logger: {
        log: (message) => runtime.log?.(message),
        error: (message) => runtime.error?.(message),
      },
    });
  } catch (error: any) {
    runtime.error?.(`[tlon] Failed to authenticate: ${error?.message ?? String(error)}`);
    throw error;
  }

  const processedTracker = createProcessedMessageTracker(2000);
  let groupChannels: string[] = [];
  let botNickname: string | null = null;

  // Fetch bot's nickname from contacts
  try {
    const selfProfile = await api.scry("/contacts/v1/self.json");
    if (selfProfile && typeof selfProfile === "object") {
      const profile = selfProfile as { nickname?: { value?: string } };
      botNickname = profile.nickname?.value || null;
      if (botNickname) {
        runtime.log?.(`[tlon] Bot nickname: ${botNickname}`);
      }
    }
  } catch (error: any) {
    runtime.log?.(`[tlon] Could not fetch nickname: ${error?.message ?? String(error)}`);
  }

  if (account.autoDiscoverChannels !== false) {
    try {
      const discoveredChannels = await fetchAllChannels(api, runtime);
      if (discoveredChannels.length > 0) {
        groupChannels = discoveredChannels;
      }
    } catch (error: any) {
      runtime.error?.(`[tlon] Auto-discovery failed: ${error?.message ?? String(error)}`);
    }
  }

  if (groupChannels.length === 0 && account.groupChannels.length > 0) {
    groupChannels = account.groupChannels;
    runtime.log?.(`[tlon] Using manual groupChannels config: ${groupChannels.join(", ")}`);
  }

  if (groupChannels.length > 0) {
    runtime.log?.(
      `[tlon] Monitoring ${groupChannels.length} group channel(s): ${groupChannels.join(", ")}`,
    );
  } else {
    runtime.log?.("[tlon] No group channels to monitor (DMs only)");
  }

  const processMessage = async (params: {
    messageId: string;
    senderShip: string;
    messageText: string;
    isGroup: boolean;
    channelNest?: string;
    hostShip?: string;
    channelName?: string;
    timestamp: number;
    parentId?: string | null;
    isThreadReply?: boolean;
  }) => {
    const { messageId, senderShip, isGroup, channelNest, hostShip, channelName, timestamp, parentId, isThreadReply } = params;
    const groupChannel = channelNest; // For compatibility
    let messageText = params.messageText;

    if (isGroup && groupChannel && isSummarizationRequest(messageText)) {
      try {
        const history = await getChannelHistory(api!, groupChannel, 50, runtime);
        if (history.length === 0) {
          const noHistoryMsg =
            "I couldn't fetch any messages for this channel. It might be empty or there might be a permissions issue.";
          if (isGroup) {
            const parsed = parseChannelNest(groupChannel);
            if (parsed) {
              await sendGroupMessage({
                api: api!,
                fromShip: botShipName,
                hostShip: parsed.hostShip,
                channelName: parsed.channelName,
                text: noHistoryMsg,
              });
            }
          } else {
            await sendDm({ api: api!, fromShip: botShipName, toShip: senderShip, text: noHistoryMsg });
          }
          return;
        }

        const historyText = history
          .map((msg) => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.author}: ${msg.content}`)
          .join("\n");

        messageText =
          `Please summarize this channel conversation (${history.length} recent messages):\n\n${historyText}\n\n` +
          "Provide a concise summary highlighting:\n" +
          "1. Main topics discussed\n" +
          "2. Key decisions or conclusions\n" +
          "3. Action items if any\n" +
          "4. Notable participants";
      } catch (error: any) {
        const errorMsg = `Sorry, I encountered an error while fetching the channel history: ${error?.message ?? String(error)}`;
        if (isGroup && groupChannel) {
          const parsed = parseChannelNest(groupChannel);
          if (parsed) {
            await sendGroupMessage({
              api: api!,
              fromShip: botShipName,
              hostShip: parsed.hostShip,
              channelName: parsed.channelName,
              text: errorMsg,
            });
          }
        } else {
          await sendDm({ api: api!, fromShip: botShipName, toShip: senderShip, text: errorMsg });
        }
        return;
      }
    }

    const route = core.channel.routing.resolveAgentRoute({
      cfg,
      channel: "tlon",
      accountId: opts.accountId ?? undefined,
      peer: {
        kind: isGroup ? "group" : "dm",
        id: isGroup ? groupChannel ?? senderShip : senderShip,
      },
    });

    const fromLabel = isGroup ? `${senderShip} in ${channelNest}` : senderShip;
    const body = core.channel.reply.formatAgentEnvelope({
      channel: "Tlon",
      from: fromLabel,
      timestamp,
      body: messageText,
    });

    const ctxPayload = core.channel.reply.finalizeInboundContext({
      Body: body,
      RawBody: messageText,
      CommandBody: messageText,
      From: isGroup ? `tlon:group:${groupChannel}` : `tlon:${senderShip}`,
      To: `tlon:${botShipName}`,
      SessionKey: route.sessionKey,
      AccountId: route.accountId,
      ChatType: isGroup ? "group" : "direct",
      ConversationLabel: fromLabel,
      SenderName: senderShip,
      SenderId: senderShip,
      Provider: "tlon",
      Surface: "tlon",
      MessageSid: messageId,
      OriginatingChannel: "tlon",
      OriginatingTo: `tlon:${isGroup ? groupChannel : botShipName}`,
    });

    const dispatchStartTime = Date.now();

    const responsePrefix = core.channel.reply.resolveEffectiveMessagesConfig(cfg, route.agentId)
      .responsePrefix;
    const humanDelay = core.channel.reply.resolveHumanDelayConfig(cfg, route.agentId);

    await core.channel.reply.dispatchReplyWithBufferedBlockDispatcher({
      ctx: ctxPayload,
      cfg,
      dispatcherOptions: {
        responsePrefix,
        humanDelay,
        deliver: async (payload: ReplyPayload) => {
          let replyText = payload.text;
          if (!replyText) return;

          const showSignature = account.showModelSignature ?? cfg.channels?.tlon?.showModelSignature ?? false;
          if (showSignature) {
            const modelInfo =
              payload.metadata?.model || payload.model || route.model || cfg.agents?.defaults?.model?.primary;
            replyText = `${replyText}\n\n_[Generated by ${formatModelName(modelInfo)}]_`;
          }

          if (isGroup && groupChannel) {
            const parsed = parseChannelNest(groupChannel);
            if (!parsed) return;
            await sendGroupMessage({
              api: api!,
              fromShip: botShipName,
              hostShip: parsed.hostShip,
              channelName: parsed.channelName,
              text: replyText,
              replyToId: parentId ?? undefined,
            });
          } else {
            await sendDm({ api: api!, fromShip: botShipName, toShip: senderShip, text: replyText });
          }
        },
        onError: (err, info) => {
          const dispatchDuration = Date.now() - dispatchStartTime;
          runtime.error?.(
            `[tlon] ${info.kind} reply failed after ${dispatchDuration}ms: ${String(err)}`,
          );
        },
      },
    });
  };

  // Track which channels we're interested in for filtering firehose events
  const watchedChannels = new Set<string>(groupChannels);
  const watchedDMs = new Set<string>();

  // Firehose handler for all channel messages (/v2)
  const handleChannelsFirehose = async (event: any) => {
    try {
      const nest = event?.nest;
      if (!nest) return;

      // Only process channels we're watching
      if (!watchedChannels.has(nest)) return;

      const response = event?.response;
      if (!response) return;

      // Handle post responses (new posts and replies)
      const essay = response?.post?.["r-post"]?.set?.essay;
      const memo = response?.post?.["r-post"]?.reply?.["r-reply"]?.set?.memo;
      if (!essay && !memo) return;

      const content = memo || essay;
      const isThreadReply = Boolean(memo);
      const messageId = isThreadReply
        ? response?.post?.["r-post"]?.reply?.id
        : response?.post?.id;

      if (!processedTracker.mark(messageId)) return;

      const senderShip = normalizeShip(content.author ?? "");
      if (!senderShip || senderShip === botShipName) return;

      const messageText = extractMessageText(content.content);
      if (!messageText) return;

      cacheMessage(nest, {
        author: senderShip,
        content: messageText,
        timestamp: content.sent || Date.now(),
        id: messageId,
      });

      const mentioned = isBotMentioned(messageText, botShipName, botNickname ?? undefined);
      if (!mentioned) return;

      const { mode, allowedShips } = resolveChannelAuthorization(cfg, nest);
      if (mode === "restricted") {
        if (allowedShips.length === 0) {
          runtime.log?.(`[tlon] Access denied: ${senderShip} in ${nest} (no allowlist)`);
          return;
        }
        const normalizedAllowed = allowedShips.map(normalizeShip);
        if (!normalizedAllowed.includes(senderShip)) {
          runtime.log?.(`[tlon] Access denied: ${senderShip} in ${nest} (allowed: ${allowedShips.join(", ")})`);
          return;
        }
      }

      const seal = isThreadReply
        ? response?.post?.["r-post"]?.reply?.["r-reply"]?.set?.seal
        : response?.post?.["r-post"]?.set?.seal;
      const parentId = seal?.["parent-id"] || seal?.parent || null;

      const parsed = parseChannelNest(nest);
      await processMessage({
        messageId: messageId ?? "",
        senderShip,
        messageText,
        isGroup: true,
        channelNest: nest,
        hostShip: parsed?.hostShip,
        channelName: parsed?.channelName,
        timestamp: content.sent || Date.now(),
        parentId,
        isThreadReply,
      });
    } catch (error: any) {
      runtime.error?.(`[tlon] Error handling channel firehose event: ${error?.message ?? String(error)}`);
    }
  };

  // Firehose handler for all DM messages (/v3)
  const handleChatFirehose = async (event: any) => {
    try {
      // Skip non-message events (arrays are DM invite lists, etc.)
      if (Array.isArray(event)) return;
      if (!("whom" in event) || !("response" in event)) return;

      const whom = event.whom; // DM partner ship or club ID
      const messageId = event.id;
      const response = event.response;

      // Handle add events (new messages)
      const essay = response?.add?.essay;
      if (!essay) return;

      if (!processedTracker.mark(messageId)) return;

      const senderShip = normalizeShip(essay.author ?? "");
      if (!senderShip || senderShip === botShipName) return;

      const messageText = extractMessageText(essay.content);
      if (!messageText) return;

      // For DMs, check allowlist
      if (!isDmAllowed(senderShip, account.dmAllowlist)) {
        runtime.log?.(`[tlon] Blocked DM from ${senderShip}: not in allowlist`);
        return;
      }

      await processMessage({
        messageId: messageId ?? "",
        senderShip,
        messageText,
        isGroup: false,
        timestamp: essay.sent || Date.now(),
      });
    } catch (error: any) {
      runtime.error?.(`[tlon] Error handling chat firehose event: ${error?.message ?? String(error)}`);
    }
  };

  try {
    runtime.log?.("[tlon] Subscribing to firehose updates...");

    // Subscribe to channels firehose (/v2)
    await api!.subscribe({
      app: "channels",
      path: "/v2",
      event: handleChannelsFirehose,
      err: (error) => {
        runtime.error?.(`[tlon] Channels firehose error: ${String(error)}`);
      },
      quit: () => {
        runtime.log?.("[tlon] Channels firehose subscription ended");
      },
    });
    runtime.log?.("[tlon] Subscribed to channels firehose (/v2)");

    // Subscribe to chat/DM firehose (/v3)
    await api!.subscribe({
      app: "chat",
      path: "/v3",
      event: handleChatFirehose,
      err: (error) => {
        runtime.error?.(`[tlon] Chat firehose error: ${String(error)}`);
      },
      quit: () => {
        runtime.log?.("[tlon] Chat firehose subscription ended");
      },
    });
    runtime.log?.("[tlon] Subscribed to chat firehose (/v3)");

    // Subscribe to contacts updates to track nickname changes
    await api!.subscribe({
      app: "contacts",
      path: "/v1/news",
      event: (event: any) => {
        try {
          // Look for self profile updates
          if (event?.self) {
            const selfUpdate = event.self;
            if (selfUpdate?.contact?.nickname?.value !== undefined) {
              const newNickname = selfUpdate.contact.nickname.value || null;
              if (newNickname !== botNickname) {
                botNickname = newNickname;
                runtime.log?.(`[tlon] Nickname updated: ${botNickname}`);
              }
            }
          }
        } catch (error: any) {
          runtime.error?.(`[tlon] Error handling contacts event: ${error?.message ?? String(error)}`);
        }
      },
      err: (error) => {
        runtime.error?.(`[tlon] Contacts subscription error: ${String(error)}`);
      },
      quit: () => {
        runtime.log?.("[tlon] Contacts subscription ended");
      },
    });
    runtime.log?.("[tlon] Subscribed to contacts updates (/v1/news)");

    // Discover channels to watch
    if (account.autoDiscoverChannels !== false) {
      const discoveredChannels = await fetchAllChannels(api!, runtime);
      for (const channelNest of discoveredChannels) {
        watchedChannels.add(channelNest);
      }
      runtime.log?.(`[tlon] Watching ${watchedChannels.size} channel(s)`);
    }

    // Log watched channels
    for (const channelNest of watchedChannels) {
      runtime.log?.(`[tlon] Watching channel: ${channelNest}`);
    }

    runtime.log?.("[tlon] All subscriptions registered, connecting to SSE stream...");
    await api!.connect();
    runtime.log?.("[tlon] Connected! Firehose subscriptions active");

    // Periodically refresh channel discovery
    const pollInterval = setInterval(async () => {
      if (!opts.abortSignal?.aborted) {
        try {
          if (account.autoDiscoverChannels !== false) {
            const discoveredChannels = await fetchAllChannels(api!, runtime);
            for (const channelNest of discoveredChannels) {
              if (!watchedChannels.has(channelNest)) {
                watchedChannels.add(channelNest);
                runtime.log?.(`[tlon] Now watching new channel: ${channelNest}`);
              }
            }
          }
        } catch (error: any) {
          runtime.error?.(`[tlon] Channel refresh error: ${error?.message ?? String(error)}`);
        }
      }
    }, 2 * 60 * 1000);

    if (opts.abortSignal) {
      await new Promise((resolve) => {
        opts.abortSignal.addEventListener(
          "abort",
          () => {
            clearInterval(pollInterval);
            resolve(null);
          },
          { once: true },
        );
      });
    } else {
      await new Promise(() => {});
    }
  } finally {
    try {
      await api?.close();
    } catch (error: any) {
      runtime.error?.(`[tlon] Cleanup error: ${error?.message ?? String(error)}`);
    }
  }
}
