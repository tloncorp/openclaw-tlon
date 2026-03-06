import type {
  ChannelOutboundAdapter,
  ChannelPlugin,
  ChannelSetupInput,
  OpenClawConfig,
} from "openclaw/plugin-sdk";
import {
  applyAccountNameToChannelSection,
  DEFAULT_ACCOUNT_ID,
  normalizeAccountId,
} from "openclaw/plugin-sdk";
import { buildTlonAccountFields } from "./account-fields.js";
import { tlonChannelConfigSchema } from "./config-schema.js";
import { monitorTlonProvider } from "./monitor/index.js";
import { tlonOnboardingAdapter } from "./onboarding.js";
import { formatTargetHint, normalizeShip, parseTlonTarget } from "./targets.js";
import { resolveTlonAccount, listTlonAccountIds } from "./types.js";
import { authenticate } from "./urbit/auth.js";
import { withAuthenticatedTlonApi } from "./urbit/api-client.js";
import { ssrfPolicyFromAllowPrivateNetwork } from "./urbit/context.js";
import { urbitFetch } from "./urbit/fetch.js";
import {
  buildMediaStory,
  sendDm,
  sendDmWithStory,
  sendChannelPost,
} from "./urbit/send.js";
import { uploadImageFromUrl } from "./urbit/upload.js";
import { tlonMessageActions } from "./actions.js";
import { markdownToStory } from "./urbit/story.js";
import { scry } from "@tloncorp/api";
import type { BotProfile } from "./urbit/send.js";

const TLON_CHANNEL_ID = "tlon" as const;

// Cache for bot profiles per ship (supports multi-account setups)
const profileCache = new Map<string, BotProfile | null>();

/**
 * Get bot profile for outbound messages from the ship's Tlon profile.
 * Caches per-ship to support multi-account configurations.
 */
async function getBotProfile(ship: string): Promise<BotProfile | undefined> {
  // Try to use cached profile for this ship
  if (profileCache.has(ship)) {
    const cached = profileCache.get(ship);
    if (cached && (cached.nickname || cached.avatar)) {
      return cached;
    }
    return undefined; // Already fetched, nothing found
  }

  // Fetch self profile (runs inside authenticated context)
  try {
    const selfProfile = await scry<{
      nickname?: { value?: string };
      avatar?: { value?: string };
    }>({ app: "contacts", path: "/v1/self" });
    
    const profile: BotProfile = {
      nickname: selfProfile?.nickname?.value ?? "",
      avatar: selfProfile?.avatar?.value ?? "",
    };
    profileCache.set(ship, profile);
    
    if (profile.nickname || profile.avatar) {
      console.log(`[tlon] Using self profile for bot meta (${ship}): ${profile.nickname || "(no nickname)"}`);
      return profile;
    }
  } catch (err) {
    console.log(`[tlon] Could not fetch self profile for bot meta: ${err}`);
    // Don't cache failures - allow retry on next send
  }

  return undefined;
}

type TlonSetupInput = ChannelSetupInput & {
  ship?: string;
  url?: string;
  code?: string;
  allowPrivateNetwork?: boolean;
  groupChannels?: string[];
  dmAllowlist?: string[];
  autoDiscoverChannels?: boolean;
  ownerShip?: string;
};

function applyTlonSetupConfig(params: {
  cfg: OpenClawConfig;
  accountId: string;
  input: TlonSetupInput;
}): OpenClawConfig {
  const { cfg, accountId, input } = params;
  const useDefault = accountId === DEFAULT_ACCOUNT_ID;
  const namedConfig = applyAccountNameToChannelSection({
    cfg,
    channelKey: "tlon",
    accountId,
    name: input.name,
  });
  const base = namedConfig.channels?.tlon ?? {};

  const payload = buildTlonAccountFields(input);

  if (useDefault) {
    return {
      ...namedConfig,
      channels: {
        ...namedConfig.channels,
        tlon: {
          ...base,
          enabled: true,
          ...payload,
        },
      },
    };
  }

  return {
    ...namedConfig,
    channels: {
      ...namedConfig.channels,
      tlon: {
        ...base,
        enabled: base.enabled ?? true,
        accounts: {
          ...(base as { accounts?: Record<string, unknown> }).accounts,
          [accountId]: {
            ...(base as { accounts?: Record<string, Record<string, unknown>> }).accounts?.[
              accountId
            ],
            enabled: true,
            ...payload,
          },
        },
      },
    },
  };
}

const tlonOutbound: ChannelOutboundAdapter = {
  deliveryMode: "direct",
  textChunkLimit: 10000,
  resolveTarget: ({ to }) => {
    const parsed = parseTlonTarget(to ?? "");
    if (!parsed) {
      return {
        ok: false,
        error: new Error(`Invalid Tlon target. Use ${formatTargetHint()}`),
      };
    }
    if (parsed.kind === "dm") {
      return { ok: true, to: parsed.ship };
    }
    return { ok: true, to: parsed.nest };
  },
  sendText: async ({ cfg, to, text, accountId, replyToId, threadId }) => {
    console.log(`[tlon:sendText] to=${to}, text=${text.slice(0, 50)}..., replyToId=${replyToId}, threadId=${threadId}`);
    const account = resolveTlonAccount(cfg, accountId ?? undefined);
    if (!account.configured || !account.ship || !account.url || !account.code) {
      throw new Error("Tlon account not configured");
    }

    const parsed = parseTlonTarget(to);
    if (!parsed) {
      throw new Error(`Invalid Tlon target. Use ${formatTargetHint()}`);
    }
    console.log(`[tlon:sendText] parsed target: kind=${parsed.kind}`);

    return await withAuthenticatedTlonApi(
      { url: account.url, code: account.code, ship: account.ship, allowPrivateNetwork: account.allowPrivateNetwork ?? undefined },
      async () => {
        const fromShip = normalizeShip(account.ship!);
        const replyId = (replyToId ?? threadId) ? String(replyToId ?? threadId) : undefined;
        // Get bot profile (from config or self profile)
        const botProfile = await getBotProfile(fromShip);
        if (parsed.kind === "dm") {
          return await sendDm({ fromShip, toShip: parsed.ship, text, replyToId: replyId, botProfile });
        }
        // Channel post (chat, heap, or diary)
        return await sendChannelPost({
          fromShip,
          nest: parsed.nest,
          story: markdownToStory(text),
          replyToId: replyId,
          botProfile,
        });
      },
    );
  },
  sendMedia: async ({ cfg, to, text, mediaUrl, accountId, replyToId, threadId }) => {
    const account = resolveTlonAccount(cfg, accountId ?? undefined);
    if (!account.configured || !account.ship || !account.url || !account.code) {
      throw new Error("Tlon account not configured");
    }

    const parsed = parseTlonTarget(to);
    if (!parsed) {
      throw new Error(`Invalid Tlon target. Use ${formatTargetHint()}`);
    }

    return await withAuthenticatedTlonApi(
      { url: account.url, code: account.code, ship: account.ship, allowPrivateNetwork: account.allowPrivateNetwork ?? undefined },
      async () => {
        // Upload inside authenticated context — uploadFile needs scry access
        const uploadedUrl = mediaUrl ? await uploadImageFromUrl(mediaUrl) : undefined;
        const fromShip = normalizeShip(account.ship!);
        const story = buildMediaStory(text, uploadedUrl);
        const replyId = (replyToId ?? threadId) ? String(replyToId ?? threadId) : undefined;

        // Get bot profile (from config or self profile)
        const botProfile = await getBotProfile(fromShip);
        if (parsed.kind === "dm") {
          return await sendDmWithStory({ fromShip, toShip: parsed.ship, story, replyToId: replyId, botProfile });
        }
        // Channel post (chat, heap, or diary)
        return await sendChannelPost({
          fromShip,
          nest: parsed.nest,
          story,
          replyToId: replyId,
          botProfile,
        });
      },
    );
  },
};

export const tlonPlugin: ChannelPlugin = {
  id: TLON_CHANNEL_ID,
  meta: {
    id: TLON_CHANNEL_ID,
    label: "Tlon",
    selectionLabel: "Tlon (Urbit)",
    docsPath: "/channels/tlon",
    docsLabel: "tlon",
    blurb: "Decentralized messaging on Urbit",
    aliases: ["urbit"],
    order: 90,
  },
  capabilities: {
    chatTypes: ["direct", "group", "thread"],
    media: true,
    reply: true,
    threads: true,
    reactions: true,
  },
  threading: {
    resolveReplyToMode: () => "all",
    buildToolContext: ({ context, hasRepliedRef }) => {
      const threadId = context.MessageThreadId ?? context.ReplyToId;
      return {
        currentChannelId: context.To?.trim() || undefined,
        currentThreadTs: threadId != null ? String(threadId) : undefined,
        hasRepliedRef,
      };
    },
  },
  onboarding: tlonOnboardingAdapter,
  reload: { configPrefixes: ["channels.tlon"] },
  configSchema: tlonChannelConfigSchema,
  config: {
    listAccountIds: (cfg) => listTlonAccountIds(cfg),
    resolveAccount: (cfg, accountId) => resolveTlonAccount(cfg, accountId ?? undefined),
    defaultAccountId: () => "default",
    setAccountEnabled: ({ cfg, accountId, enabled }) => {
      const useDefault = !accountId || accountId === "default";
      if (useDefault) {
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            tlon: {
              ...cfg.channels?.tlon,
              enabled,
            },
          },
        } as OpenClawConfig;
      }
      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          tlon: {
            ...cfg.channels?.tlon,
            accounts: {
              ...cfg.channels?.tlon?.accounts,
              [accountId]: {
                ...cfg.channels?.tlon?.accounts?.[accountId],
                enabled,
              },
            },
          },
        },
      } as OpenClawConfig;
    },
    deleteAccount: ({ cfg, accountId }) => {
      const useDefault = !accountId || accountId === "default";
      if (useDefault) {
        const {
          ship: _ship,
          code: _code,
          url: _url,
          name: _name,
          ...rest
        } = cfg.channels?.tlon ?? {};
        return {
          ...cfg,
          channels: {
            ...cfg.channels,
            tlon: rest,
          },
        } as OpenClawConfig;
      }
      const { [accountId]: _removed, ...remainingAccounts } = cfg.channels?.tlon?.accounts ?? {};
      return {
        ...cfg,
        channels: {
          ...cfg.channels,
          tlon: {
            ...cfg.channels?.tlon,
            accounts: remainingAccounts,
          },
        },
      } as OpenClawConfig;
    },
    isConfigured: (account) => account.configured,
    describeAccount: (account) => ({
      accountId: account.accountId,
      name: account.name,
      enabled: account.enabled,
      configured: account.configured,
      ship: account.ship,
      url: account.url,
    }),
  },
  setup: {
    resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
    applyAccountName: ({ cfg, accountId, name }) =>
      applyAccountNameToChannelSection({
        cfg: cfg,
        channelKey: "tlon",
        accountId,
        name,
      }),
    validateInput: ({ cfg, accountId, input }) => {
      const setupInput = input as TlonSetupInput;
      const resolved = resolveTlonAccount(cfg, accountId ?? undefined);
      const ship = setupInput.ship?.trim() || resolved.ship;
      const url = setupInput.url?.trim() || resolved.url;
      const code = setupInput.code?.trim() || resolved.code;
      if (!ship) {
        return "Tlon requires --ship.";
      }
      if (!url) {
        return "Tlon requires --url.";
      }
      if (!code) {
        return "Tlon requires --code.";
      }
      return null;
    },
    applyAccountConfig: ({ cfg, accountId, input }) =>
      applyTlonSetupConfig({
        cfg: cfg,
        accountId,
        input: input as TlonSetupInput,
      }),
  },
  messaging: {
    normalizeTarget: (target) => {
      const parsed = parseTlonTarget(target);
      if (!parsed) {
        return target.trim();
      }
      if (parsed.kind === "dm") {
        return parsed.ship;
      }
      return parsed.nest;
    },
    targetResolver: {
      looksLikeId: (target) => Boolean(parseTlonTarget(target)),
      hint: formatTargetHint(),
    },
  },
  outbound: tlonOutbound,
  actions: tlonMessageActions,
  agentPrompt: {
    messageToolHints: ({ cfg, accountId }) => {
      const account = resolveTlonAccount(cfg, accountId ?? undefined);
      const hints: string[] = [];

      // Gallery/heap channel guidance
      hints.push(
        "",
        "Tlon gallery channels (heap/~host/name) are for collecting images, links, and media.",
        "- To post to a gallery: use action=send, to=heap/~host/name, message=<text or URL>",
        "- For image posts, include media=<imageUrl> with an optional message=<caption>",
        "- To react to a gallery comment: use action=react, to=heap/~host/name, messageId=<commentId>, parentId=<postId>, emoji=<emoji>",
      );

      // Reaction guidance
      const level = account.reactionLevel ?? "minimal";
      if (level !== "off" && level !== "ack") {
        if (level === "extensive") {
          hints.push(
            "",
            "Reactions are enabled for Tlon in EXTENSIVE mode.",
            "Feel free to react liberally:",
            "- Acknowledge messages with appropriate emojis",
            "- Express sentiment and personality through reactions",
            "- React to interesting content, humor, or notable events",
            "- Use reactions to confirm understanding or agreement",
            "- Use action=react with emoji, messageId, and target (channel nest or DM ship)",
            "Guideline: react whenever it feels natural.",
          );
        } else {
          // minimal (default)
          hints.push(
            "",
            "Reactions are enabled for Tlon in MINIMAL mode.",
            "React ONLY when truly relevant:",
            "- Acknowledge important user requests or confirmations",
            "- Express genuine sentiment (humor, appreciation) sparingly",
            "- Avoid reacting to routine messages or your own replies",
            "- Use action=react with emoji, messageId, and target (channel nest or DM ship)",
            "Guideline: at most 1 reaction per 5-10 exchanges.",
          );
        }
      }

      return hints;
    },
  },
  status: {
    defaultRuntime: {
      accountId: "default",
      running: false,
      lastStartAt: null,
      lastStopAt: null,
      lastError: null,
    },
    collectStatusIssues: (accounts) => {
      return accounts.flatMap((account) => {
        if (!account.configured) {
          return [
            {
              channel: TLON_CHANNEL_ID,
              accountId: account.accountId,
              kind: "config",
              message: "Account not configured (missing ship, code, or url)",
            },
          ];
        }
        return [];
      });
    },
    buildChannelSummary: ({ snapshot }) => {
      const s = snapshot as { configured?: boolean; ship?: string; url?: string };
      return {
        configured: s.configured ?? false,
        ship: s.ship ?? null,
        url: s.url ?? null,
      };
    },
    probeAccount: async ({ account }) => {
      if (!account.configured || !account.ship || !account.url || !account.code) {
        return { ok: false, error: "Not configured" };
      }
      try {
        const ssrfPolicy = ssrfPolicyFromAllowPrivateNetwork(account.allowPrivateNetwork);
        const cookie = await authenticate(account.url, account.code, { ssrfPolicy });
        // Simple probe - just verify we can reach /~/name
        const { response, release } = await urbitFetch({
          baseUrl: account.url,
          path: "/~/name",
          init: {
            method: "GET",
            headers: { Cookie: cookie },
          },
          ssrfPolicy,
          timeoutMs: 30_000,
          auditContext: "tlon-probe-account",
        });
        try {
          if (!response.ok) {
            return { ok: false, error: `Name request failed: ${response.status}` };
          }
          return { ok: true };
        } finally {
          await release();
        }
      } catch (error) {
        return { ok: false, error: (error as { message?: string })?.message ?? String(error) };
      }
    },
    buildAccountSnapshot: ({ account, runtime, probe }) => {
      // Tlon-specific snapshot with ship/url for status display
      const snapshot = {
        accountId: account.accountId,
        name: account.name,
        enabled: account.enabled,
        configured: account.configured,
        ship: account.ship,
        url: account.url,
        running: runtime?.running ?? false,
        lastStartAt: runtime?.lastStartAt ?? null,
        lastStopAt: runtime?.lastStopAt ?? null,
        lastError: runtime?.lastError ?? null,
        probe,
      };
      return snapshot as import("openclaw/plugin-sdk").ChannelAccountSnapshot;
    },
  },
  gateway: {
    startAccount: async (ctx) => {
      const account = ctx.account;
      ctx.setStatus({
        accountId: account.accountId,
        ship: account.ship,
        url: account.url,
      } as import("openclaw/plugin-sdk").ChannelAccountSnapshot);
      ctx.log?.info(`[${account.accountId}] starting Tlon provider for ${account.ship ?? "tlon"}`);
      return monitorTlonProvider({
        runtime: ctx.runtime,
        abortSignal: ctx.abortSignal,
        accountId: account.accountId,
      });
    },
  },
};
