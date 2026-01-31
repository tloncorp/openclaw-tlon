import { format } from "node:util";

import type { RuntimeEnv, ReplyPayload, MoltbotConfig } from "openclaw/plugin-sdk";

import { getTlonRuntime } from "../runtime.js";
import { resolveTlonAccount } from "../types.js";
import { normalizeShip, parseChannelNest } from "../targets.js";
import { authenticate } from "../urbit/auth.js";
import { UrbitSSEClient } from "../urbit/sse-client.js";
import { sendDm, sendGroupMessage } from "../urbit/send.js";
import { cacheMessage, getChannelHistory, fetchThreadHistory } from "./history.js";
import { createProcessedMessageTracker } from "./processed-messages.js";
import {
  extractMessageText,
  extractCites,
  formatModelName,
  isBotMentioned,
  isDmAllowed,
  isSummarizationRequest,
  type ParsedCite,
} from "./utils.js";
import { downloadMessageImages } from "./media.js";
import { fetchAllChannels, fetchInitData } from "./discovery.js";
import { createSettingsManager, type TlonSettingsStore } from "../settings.js";
import type { Foreigns, DmInvite } from "../urbit/foreigns.js";

export type MonitorTlonOpts = {
  runtime?: RuntimeEnv;
  abortSignal?: AbortSignal;
  accountId?: string | null;
};

type ChannelAuthorization = {
  mode?: "restricted" | "open";
  allowedShips?: string[];
};

/**
 * Resolve channel authorization by merging file config with settings store.
 * Settings store takes precedence for fields it defines.
 */
function resolveChannelAuthorization(
  cfg: MoltbotConfig,
  channelNest: string,
  settings?: TlonSettingsStore,
): { mode: "restricted" | "open"; allowedShips: string[] } {
  const tlonConfig = cfg.channels?.tlon as
    | {
        authorization?: { channelRules?: Record<string, ChannelAuthorization> };
        defaultAuthorizedShips?: string[];
      }
    | undefined;

  // Merge channel rules: settings override file config
  const fileRules = tlonConfig?.authorization?.channelRules ?? {};
  const settingsRules = settings?.channelRules ?? {};
  const rule = settingsRules[channelNest] ?? fileRules[channelNest];

  // Merge default authorized ships: settings override file config
  const defaultShips = settings?.defaultAuthorizedShips
    ?? tlonConfig?.defaultAuthorizedShips
    ?? [];

  const allowedShips = rule?.allowedShips ?? defaultShips;
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

  // Settings store manager for hot-reloading config
  const settingsManager = createSettingsManager(api!, {
    log: (msg) => runtime.log?.(msg),
    error: (msg) => runtime.error?.(msg),
  });

  // Reactive state that can be updated via settings store
  let effectiveDmAllowlist: string[] = account.dmAllowlist;
  let effectiveShowModelSig: boolean = account.showModelSignature ?? false;
  let effectiveAutoAcceptDmInvites: boolean = account.autoAcceptDmInvites ?? false;
  let effectiveAutoAcceptGroupInvites: boolean = account.autoAcceptGroupInvites ?? false;
  let effectiveGroupInviteAllowlist: string[] = account.groupInviteAllowlist;
  let currentSettings: TlonSettingsStore = {};

  // Track threads we've participated in (by parentId) - respond without mention requirement
  const participatedThreads = new Set<string>();

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

  // Store init foreigns for processing after settings are loaded
  let initForeigns: Foreigns | null = null;

  if (account.autoDiscoverChannels !== false) {
    try {
      const initData = await fetchInitData(api, runtime);
      if (initData.channels.length > 0) {
        groupChannels = initData.channels;
      }
      initForeigns = initData.foreigns;
    } catch (error: any) {
      runtime.error?.(`[tlon] Auto-discovery failed: ${error?.message ?? String(error)}`);
    }
  }

  // Merge manual config with auto-discovered channels
  if (account.groupChannels.length > 0) {
    for (const ch of account.groupChannels) {
      if (!groupChannels.includes(ch)) {
        groupChannels.push(ch);
      }
    }
    runtime.log?.(`[tlon] Added ${account.groupChannels.length} manual groupChannels to monitoring`);
  }

  if (groupChannels.length > 0) {
    runtime.log?.(
      `[tlon] Monitoring ${groupChannels.length} group channel(s): ${groupChannels.join(", ")}`,
    );
  } else {
    runtime.log?.("[tlon] No group channels to monitor (DMs only)");
  }

  // Migrate file config to settings store (seed on first run)
  async function migrateConfigToSettings() {
    const migrations: Array<{ key: string; fileValue: unknown; settingsValue: unknown }> = [
      { key: "dmAllowlist", fileValue: account.dmAllowlist, settingsValue: currentSettings.dmAllowlist },
      { key: "groupInviteAllowlist", fileValue: account.groupInviteAllowlist, settingsValue: currentSettings.groupInviteAllowlist },
      { key: "groupChannels", fileValue: account.groupChannels, settingsValue: currentSettings.groupChannels },
      { key: "autoAcceptDmInvites", fileValue: account.autoAcceptDmInvites, settingsValue: currentSettings.autoAcceptDmInvites },
      { key: "autoAcceptGroupInvites", fileValue: account.autoAcceptGroupInvites, settingsValue: currentSettings.autoAcceptGroupInvites },
      { key: "showModelSig", fileValue: account.showModelSignature, settingsValue: currentSettings.showModelSig },
    ];

    for (const { key, fileValue, settingsValue } of migrations) {
      // Only migrate if file has a value and settings store doesn't
      const hasFileValue = Array.isArray(fileValue) ? fileValue.length > 0 : fileValue != null;
      const hasSettingsValue = Array.isArray(settingsValue) ? settingsValue.length > 0 : settingsValue != null;

      if (hasFileValue && !hasSettingsValue) {
        try {
          await api!.poke({
            app: "settings",
            mark: "settings-event",
            json: {
              "put-entry": {
                "bucket-key": "tlon",
                "entry-key": key,
                "value": fileValue,
                "desk": "moltbot"
              }
            }
          });
          runtime.log?.(`[tlon] Migrated ${key} from config to settings store`);
        } catch (err) {
          runtime.log?.(`[tlon] Failed to migrate ${key}: ${String(err)}`);
        }
      }
    }
  }

  // Load settings from settings store (hot-reloadable config)
  try {
    currentSettings = await settingsManager.load();

    // Migrate file config to settings store if not already present
    await migrateConfigToSettings();

    // Apply settings overrides
    if (currentSettings.groupChannels?.length) {
      groupChannels = currentSettings.groupChannels;
      runtime.log?.(`[tlon] Using groupChannels from settings store: ${groupChannels.join(", ")}`);
    }
    if (currentSettings.dmAllowlist?.length) {
      effectiveDmAllowlist = currentSettings.dmAllowlist;
      runtime.log?.(`[tlon] Using dmAllowlist from settings store: ${effectiveDmAllowlist.join(", ")}`);
    }
    if (currentSettings.showModelSig !== undefined) {
      effectiveShowModelSig = currentSettings.showModelSig;
    }
    if (currentSettings.autoAcceptDmInvites !== undefined) {
      effectiveAutoAcceptDmInvites = currentSettings.autoAcceptDmInvites;
      runtime.log?.(`[tlon] Using autoAcceptDmInvites from settings store: ${effectiveAutoAcceptDmInvites}`);
    }
    if (currentSettings.autoAcceptGroupInvites !== undefined) {
      effectiveAutoAcceptGroupInvites = currentSettings.autoAcceptGroupInvites;
      runtime.log?.(`[tlon] Using autoAcceptGroupInvites from settings store: ${effectiveAutoAcceptGroupInvites}`);
    }
    if (currentSettings.groupInviteAllowlist?.length) {
      effectiveGroupInviteAllowlist = currentSettings.groupInviteAllowlist;
      runtime.log?.(`[tlon] Using groupInviteAllowlist from settings store: ${effectiveGroupInviteAllowlist.join(", ")}`);
    }
  } catch (err) {
    runtime.log?.(`[tlon] Settings store not available, using file config: ${String(err)}`);
  }

  // Helper to resolve cited message content
  async function resolveCiteContent(cite: ParsedCite): Promise<string | null> {
    if (cite.type !== "chan" || !cite.nest || !cite.postId) return null;

    try {
      // Scry for the specific post: /v4/{nest}/posts/post/{postId}
      const scryPath = `/channels/v4/${cite.nest}/posts/post/${cite.postId}.json`;
      runtime.log?.(`[tlon] Fetching cited post: ${scryPath}`);

      const data: any = await api!.scry(scryPath);

      // Extract text from the post's essay content
      if (data?.essay?.content) {
        const text = extractMessageText(data.essay.content);
        return text || null;
      }

      return null;
    } catch (err) {
      runtime.log?.(`[tlon] Failed to fetch cited post: ${String(err)}`);
      return null;
    }
  }

  // Resolve all cites in message content and return quoted text
  async function resolveAllCites(content: unknown): Promise<string> {
    const cites = extractCites(content);
    if (cites.length === 0) return "";

    const resolved: string[] = [];
    for (const cite of cites) {
      const text = await resolveCiteContent(cite);
      if (text) {
        const author = cite.author || "unknown";
        resolved.push(`> ${author} wrote: ${text}`);
      }
    }

    return resolved.length > 0 ? resolved.join("\n") + "\n\n" : "";
  }

  const processMessage = async (params: {
    messageId: string;
    senderShip: string;
    messageText: string;
    messageContent?: unknown; // Raw Tlon content for media extraction
    isGroup: boolean;
    channelNest?: string;
    hostShip?: string;
    channelName?: string;
    timestamp: number;
    parentId?: string | null;
    isThreadReply?: boolean;
  }) => {
    const { messageId, senderShip, isGroup, channelNest, hostShip, channelName, timestamp, parentId, isThreadReply, messageContent } = params;
    const groupChannel = channelNest; // For compatibility
    let messageText = params.messageText;

    // Download any images from the message content
    let attachments: Array<{ path: string; contentType: string }> = [];
    if (messageContent) {
      try {
        attachments = await downloadMessageImages(messageContent);
        if (attachments.length > 0) {
          runtime.log?.(`[tlon] Downloaded ${attachments.length} image(s) from message`);
        }
      } catch (error: any) {
        runtime.log?.(`[tlon] Failed to download images: ${error?.message ?? String(error)}`);
      }
    }

    // Fetch thread context when entering a thread for the first time
    if (isThreadReply && parentId && groupChannel) {
      try {
        const threadHistory = await fetchThreadHistory(api!, groupChannel, parentId, 20, runtime);
        if (threadHistory.length > 0) {
          const threadContext = threadHistory
            .slice(-10) // Last 10 messages for context
            .map((msg) => `${msg.author}: ${msg.content}`)
            .join("\n");

          // Prepend thread context to the message
          // Include note about ongoing conversation for agent judgment
          const contextNote = `[Thread conversation - ${threadHistory.length} previous replies. You are participating in this thread. Only respond if relevant or helpful - you don't need to reply to every message.]`;
          messageText = `${contextNote}\n\n[Previous messages]\n${threadContext}\n\n[Current message]\n${messageText}`;
          runtime?.log?.(`[tlon] Added thread context (${threadHistory.length} replies) to message`);
        }
      } catch (error: any) {
        runtime?.log?.(`[tlon] Could not fetch thread context: ${error?.message ?? String(error)}`);
        // Continue without thread context - not critical
      }
    }

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
    
    // Prepend attachment annotations to message body (similar to Signal format)
    let bodyWithAttachments = messageText;
    if (attachments.length > 0) {
      const mediaLines = attachments
        .map(a => `[media attached: ${a.path} (${a.contentType}) | ${a.path}]`)
        .join("\n");
      bodyWithAttachments = mediaLines + "\n" + messageText;
    }
    
    const body = core.channel.reply.formatAgentEnvelope({
      channel: "Tlon",
      from: fromLabel,
      timestamp,
      body: bodyWithAttachments,
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
      // Include downloaded media attachments
      ...(attachments.length > 0 && { Attachments: attachments }),
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

          // Use settings store value if set, otherwise fall back to file config
          const showSignature = effectiveShowModelSig;
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
            // Track thread participation for future replies without mention
            if (parentId) {
              participatedThreads.add(String(parentId));
              runtime.log?.(`[tlon] Now tracking thread for future replies: ${parentId}`);
            }
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

      // Resolve any cited/quoted messages first
      const citedContent = await resolveAllCites(content.content);
      const rawText = extractMessageText(content.content);
      const messageText = citedContent + rawText;
      if (!messageText.trim()) return;

      cacheMessage(nest, {
        author: senderShip,
        content: messageText,
        timestamp: content.sent || Date.now(),
        id: messageId,
      });

      // Get thread info early for participation check
      const seal = isThreadReply
        ? response?.post?.["r-post"]?.reply?.["r-reply"]?.set?.seal
        : response?.post?.["r-post"]?.set?.seal;
      const parentId = seal?.["parent-id"] || seal?.parent || null;

      // Check if we should respond:
      // 1. Direct mention always triggers response
      // 2. Thread replies where we've participated - respond if relevant (let agent decide)
      const mentioned = isBotMentioned(messageText, botShipName, botNickname ?? undefined);
      const inParticipatedThread = isThreadReply && parentId && participatedThreads.has(String(parentId));

      if (!mentioned && !inParticipatedThread) {
        return;
      }

      // Log why we're responding
      if (inParticipatedThread && !mentioned) {
        runtime.log?.(`[tlon] Responding to thread we participated in (no mention): ${parentId}`);
      }

      const { mode, allowedShips } = resolveChannelAuthorization(cfg, nest, currentSettings);
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

      const parsed = parseChannelNest(nest);
      await processMessage({
        messageId: messageId ?? "",
        senderShip,
        messageText,
        messageContent: content.content, // Pass raw content for media extraction
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
  // Track which DM invites we've already processed to avoid duplicate accepts
  const processedDmInvites = new Set<string>();

  const handleChatFirehose = async (event: any) => {
    try {
      // Handle DM invite lists (arrays)
      if (Array.isArray(event)) {
        if (effectiveAutoAcceptDmInvites) {
          for (const invite of event as DmInvite[]) {
            const ship = normalizeShip(invite.ship || "");
            if (!ship || processedDmInvites.has(ship)) continue;

            // Only auto-accept from ships in the allowlist
            if (isDmAllowed(ship, effectiveDmAllowlist)) {
              try {
                await api!.poke({
                  app: "chat",
                  mark: "chat-dm-rsvp",
                  json: { ship, ok: true },
                });
                processedDmInvites.add(ship);
                runtime.log?.(`[tlon] Auto-accepted DM invite from ${ship}`);
              } catch (err) {
                runtime.error?.(`[tlon] Failed to auto-accept DM from ${ship}: ${String(err)}`);
              }
            }
          }
        }
        return;
      }
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

      // Resolve any cited/quoted messages first
      const citedContent = await resolveAllCites(essay.content);
      const rawText = extractMessageText(essay.content);
      const messageText = citedContent + rawText;
      if (!messageText.trim()) return;

      // For DMs, check allowlist (uses settings store if available)
      if (!isDmAllowed(senderShip, effectiveDmAllowlist)) {
        runtime.log?.(`[tlon] Blocked DM from ${senderShip}: not in allowlist`);
        return;
      }

      await processMessage({
        messageId: messageId ?? "",
        senderShip,
        messageText,
        messageContent: essay.content, // Pass raw content for media extraction
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

    // Subscribe to settings store for hot-reloading config
    settingsManager.onChange((newSettings) => {
      currentSettings = newSettings;

      // Update watched channels if settings changed
      if (newSettings.groupChannels?.length) {
        const newChannels = newSettings.groupChannels;
        for (const ch of newChannels) {
          if (!watchedChannels.has(ch)) {
            watchedChannels.add(ch);
            runtime.log?.(`[tlon] Settings: now watching channel ${ch}`);
          }
        }
        // Note: we don't remove channels from watchedChannels to avoid missing messages
        // during transitions. The authorization check handles access control.
      }

      // Update DM allowlist
      if (newSettings.dmAllowlist !== undefined) {
        effectiveDmAllowlist = newSettings.dmAllowlist.length > 0
          ? newSettings.dmAllowlist
          : account.dmAllowlist;
        runtime.log?.(`[tlon] Settings: dmAllowlist updated to ${effectiveDmAllowlist.join(", ")}`);
      }

      // Update model signature setting
      if (newSettings.showModelSig !== undefined) {
        effectiveShowModelSig = newSettings.showModelSig;
        runtime.log?.(`[tlon] Settings: showModelSig = ${effectiveShowModelSig}`);
      }

      // Update auto-accept DM invites setting
      if (newSettings.autoAcceptDmInvites !== undefined) {
        effectiveAutoAcceptDmInvites = newSettings.autoAcceptDmInvites;
        runtime.log?.(`[tlon] Settings: autoAcceptDmInvites = ${effectiveAutoAcceptDmInvites}`);
      }

      // Update auto-accept group invites setting
      if (newSettings.autoAcceptGroupInvites !== undefined) {
        effectiveAutoAcceptGroupInvites = newSettings.autoAcceptGroupInvites;
        runtime.log?.(`[tlon] Settings: autoAcceptGroupInvites = ${effectiveAutoAcceptGroupInvites}`);
      }

      // Update group invite allowlist
      if (newSettings.groupInviteAllowlist !== undefined) {
        effectiveGroupInviteAllowlist = newSettings.groupInviteAllowlist.length > 0
          ? newSettings.groupInviteAllowlist
          : account.groupInviteAllowlist;
        runtime.log?.(`[tlon] Settings: groupInviteAllowlist updated to ${effectiveGroupInviteAllowlist.join(", ")}`);
      }
    });

    try {
      await settingsManager.startSubscription();
    } catch (err) {
      // Settings subscription is optional - don't fail if it doesn't work
      runtime.log?.(`[tlon] Settings subscription not available: ${String(err)}`);
    }

    // Subscribe to groups-ui for real-time channel additions (when invites are accepted)
    try {
      await api!.subscribe({
        app: "groups",
        path: "/groups/ui",
        event: async (event: any) => {
          try {
            // Handle group/channel join events
            // Event structure: { group: { flag: "~host/group-name", ... }, channels: { ... } }
            if (event && typeof event === "object") {
              // Check for new channels being added to groups
              if (event.channels && typeof event.channels === "object") {
                const channels = event.channels as Record<string, any>;
                for (const [channelNest, channelData] of Object.entries(channels)) {
                  // Only monitor chat channels
                  if (!channelNest.startsWith("chat/")) continue;

                  // If this is a new channel we're not watching yet, add it
                  if (!watchedChannels.has(channelNest)) {
                    watchedChannels.add(channelNest);
                    runtime.log?.(`[tlon] Auto-detected new channel (invite accepted): ${channelNest}`);

                    // Persist to settings store so it survives restarts
                    if (effectiveAutoAcceptGroupInvites) {
                      try {
                        const currentChannels = currentSettings.groupChannels || [];
                        if (!currentChannels.includes(channelNest)) {
                          const updatedChannels = [...currentChannels, channelNest];
                          // Poke settings store to persist
                          await api!.poke({
                            app: "settings",
                            mark: "settings-event",
                            json: {
                              "put-entry": {
                                "bucket-key": "tlon",
                                "entry-key": "groupChannels",
                                "value": updatedChannels,
                                "desk": "moltbot"
                              }
                            }
                          });
                          runtime.log?.(`[tlon] Persisted ${channelNest} to settings store`);
                        }
                      } catch (err) {
                        runtime.error?.(`[tlon] Failed to persist channel to settings: ${String(err)}`);
                      }
                    }
                  }
                }
              }

              // Also check for the "join" event structure
              if (event.join && typeof event.join === "object") {
                const join = event.join as { group?: string; channels?: string[] };
                if (join.channels) {
                  for (const channelNest of join.channels) {
                    if (!channelNest.startsWith("chat/")) continue;
                    if (!watchedChannels.has(channelNest)) {
                      watchedChannels.add(channelNest);
                      runtime.log?.(`[tlon] Auto-detected joined channel: ${channelNest}`);

                      // Persist to settings store
                      if (effectiveAutoAcceptGroupInvites) {
                        try {
                          const currentChannels = currentSettings.groupChannels || [];
                          if (!currentChannels.includes(channelNest)) {
                            const updatedChannels = [...currentChannels, channelNest];
                            await api!.poke({
                              app: "settings",
                              mark: "settings-event",
                              json: {
                                "put-entry": {
                                  "bucket-key": "tlon",
                                  "entry-key": "groupChannels",
                                  "value": updatedChannels,
                                  "desk": "moltbot"
                                }
                              }
                            });
                            runtime.log?.(`[tlon] Persisted ${channelNest} to settings store`);
                          }
                        } catch (err) {
                          runtime.error?.(`[tlon] Failed to persist channel to settings: ${String(err)}`);
                        }
                      }
                    }
                  }
                }
              }
            }
          } catch (error: any) {
            runtime.error?.(`[tlon] Error handling groups-ui event: ${error?.message ?? String(error)}`);
          }
        },
        err: (error) => {
          runtime.error?.(`[tlon] Groups-ui subscription error: ${String(error)}`);
        },
        quit: () => {
          runtime.log?.("[tlon] Groups-ui subscription ended");
        },
      });
      runtime.log?.("[tlon] Subscribed to groups-ui for real-time channel detection");
    } catch (err) {
      // Groups-ui subscription is optional - channel discovery will still work via polling
      runtime.log?.(`[tlon] Groups-ui subscription failed (will rely on polling): ${String(err)}`);
    }

    // Subscribe to foreigns for auto-accepting group invites
    // Always subscribe so we can hot-reload the setting via settings store
    {
      const processedGroupInvites = new Set<string>();

      // Helper to process pending invites
      const processPendingInvites = async (foreigns: Foreigns) => {
        if (!effectiveAutoAcceptGroupInvites) return;
        if (!foreigns || typeof foreigns !== "object") return;

        for (const [groupFlag, foreign] of Object.entries(foreigns)) {
          if (processedGroupInvites.has(groupFlag)) continue;
          if (!foreign.invites || foreign.invites.length === 0) continue;

          const validInvite = foreign.invites.find(inv => inv.valid);
          if (!validInvite) continue;

          // SECURITY: Check if inviter is on allowlist
          // If allowlist is empty, accept all (backward-compatible, but logged as warning)
          const inviterShip = validInvite.from;
          if (effectiveGroupInviteAllowlist.length > 0) {
            const normalizedInviter = normalizeShip(inviterShip);
            const isAllowed = effectiveGroupInviteAllowlist
              .map(s => normalizeShip(s))
              .some(s => s === normalizedInviter);

            if (!isAllowed) {
              runtime.log?.(`[tlon] Rejected group invite from ${inviterShip} (not in groupInviteAllowlist): ${groupFlag}`);
              processedGroupInvites.add(groupFlag); // Mark as processed to avoid spam
              continue;
            }
          } else {
            // SECURITY: Fail-safe to deny - require explicit allowlist
            runtime.log?.(`[tlon] Skipping group invite from ${inviterShip} - no groupInviteAllowlist configured (fail-safe)`);
            processedGroupInvites.add(groupFlag);
            continue;
          }

          try {
            await api!.poke({
              app: "groups",
              mark: "group-join",
              json: {
                flag: groupFlag,
                "join-all": true,
              },
            });
            processedGroupInvites.add(groupFlag);
            runtime.log?.(`[tlon] Auto-accepted group invite: ${groupFlag} (from ${validInvite.from})`);
          } catch (err) {
            runtime.error?.(`[tlon] Failed to auto-accept group ${groupFlag}: ${String(err)}`);
          }
        }
      };

      // Process existing pending invites from init data
      if (initForeigns) {
        await processPendingInvites(initForeigns);
      }

      try {
        await api!.subscribe({
          app: "groups",
          path: "/v1/foreigns",
          event: async (event: Foreigns) => {
            try {
              await processPendingInvites(event);
            } catch (error: any) {
              runtime.error?.(`[tlon] Error handling foreigns event: ${error?.message ?? String(error)}`);
            }
          },
          err: (error) => {
            runtime.error?.(`[tlon] Foreigns subscription error: ${String(error)}`);
          },
          quit: () => {
            runtime.log?.("[tlon] Foreigns subscription ended");
          },
        });
        runtime.log?.("[tlon] Subscribed to foreigns (/v1/foreigns) for auto-accepting group invites");
      } catch (err) {
        runtime.log?.(`[tlon] Foreigns subscription failed: ${String(err)}`);
      }
    }

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
