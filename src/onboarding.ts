import type {
  ChannelSetupInput,
  ChannelSetupWizard,
  OpenClawConfig,
  WizardPrompter,
} from "openclaw/plugin-sdk/setup";
import {
  applyAccountNameToChannelSection,
  DEFAULT_ACCOUNT_ID,
  formatDocsLink,
  normalizeAccountId,
} from "openclaw/plugin-sdk/setup";
import { buildTlonAccountFields } from "./account-fields.js";
import type { TlonResolvedAccount } from "./types.js";
import { listTlonAccountIds, resolveTlonAccount } from "./types.js";
import { isBlockedUrbitHostname, validateUrbitBaseUrl } from "./urbit/base-url.js";

const channel = "tlon" as const;

const TLON_SETUP_NOTE_LINES = [
  "You need your Urbit ship URL and login code.",
  "Example URL: https://your-ship-host",
  "Example ship: ~sampel-palnet",
  "If your ship URL is on a private network (LAN/localhost), you must explicitly allow it during setup.",
  `Docs: ${formatDocsLink("/channels/tlon", "channels/tlon")}`,
];

export type TlonSetupInput = ChannelSetupInput & {
  ship?: string;
  url?: string;
  code?: string;
  allowPrivateNetwork?: boolean;
  groupChannels?: string[];
  dmAllowlist?: string[];
  autoDiscoverChannels?: boolean;
  ownerShip?: string;
};

function isConfigured(account: TlonResolvedAccount): boolean {
  return Boolean(account.ship && account.url && account.code);
}

export function applyTlonSetupConfig(params: {
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

function parseList(value: string): string[] {
  return value
    .split(/[\n,;]+/g)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

async function promptTlonAccountId(params: {
  cfg: OpenClawConfig;
  prompter: WizardPrompter;
  currentId: string;
  defaultAccountId: string;
}): Promise<string> {
  const existingIds = listTlonAccountIds(params.cfg);
  const choice = await params.prompter.select({
    message: "Tlon account",
    options: [
      ...existingIds.map((accountId) => ({
        value: accountId,
        label: accountId === "default" ? "default (primary)" : accountId,
      })),
      { value: "__new__", label: "Add a new account" },
    ],
    initialValue: params.currentId,
  });

  if (choice !== "__new__") {
    return normalizeAccountId(choice);
  }

  const entered = await params.prompter.text({
    message: "New Tlon account id",
    validate: (value) => (value?.trim() ? undefined : "Required"),
  });
  const normalized = normalizeAccountId(String(entered));
  if (String(entered).trim() !== normalized) {
    await params.prompter.note(`Normalized account id to "${normalized}".`, "Tlon account");
  }
  return normalized;
}

export const tlonSetupWizard: ChannelSetupWizard = {
  channel,
  status: {
    configuredLabel: "configured",
    unconfiguredLabel: "needs setup",
    configuredHint: "configured",
    unconfiguredHint: "urbit messenger",
    configuredScore: 1,
    unconfiguredScore: 4,
    resolveConfigured: ({ cfg }) => {
      const accountIds = listTlonAccountIds(cfg);
      return accountIds.length > 0
        ? accountIds.some((accountId) => isConfigured(resolveTlonAccount(cfg, accountId)))
        : isConfigured(resolveTlonAccount(cfg, DEFAULT_ACCOUNT_ID));
    },
    resolveStatusLines: ({ configured }) => [`Tlon: ${configured ? "configured" : "needs setup"}`],
    resolveSelectionHint: ({ configured }) => (configured ? "configured" : "urbit messenger"),
    resolveQuickstartScore: ({ configured }) => (configured ? 1 : 4),
  },
  introNote: {
    title: "Tlon setup",
    lines: TLON_SETUP_NOTE_LINES,
  },
  resolveAccountIdForConfigure: async ({
    cfg,
    prompter,
    accountOverride,
    shouldPromptAccountIds,
    defaultAccountId,
  }) => {
    const override = accountOverride?.trim();
    const currentId = override ? normalizeAccountId(override) : defaultAccountId;
    if (!shouldPromptAccountIds || override) {
      return currentId;
    }
    return await promptTlonAccountId({
      cfg,
      prompter,
      currentId,
      defaultAccountId,
    });
  },
  stepOrder: "text-first",
  credentials: [],
  textInputs: [
    {
      inputKey: "ship",
      message: "Ship name",
      placeholder: "~sampel-palnet",
      currentValue: ({ cfg, accountId }) => resolveTlonAccount(cfg, accountId).ship ?? undefined,
      applySet: ({ cfg, accountId, value }) =>
        applyTlonSetupConfig({
          cfg,
          accountId,
          input: { ship: value.trim() },
        }),
    },
    {
      inputKey: "url",
      message: "Ship URL",
      placeholder: "https://your-ship-host",
      currentValue: ({ cfg, accountId }) => resolveTlonAccount(cfg, accountId).url ?? undefined,
      validate: ({ value }) => {
        const next = validateUrbitBaseUrl(value);
        return next.ok ? undefined : next.error;
      },
      normalizeValue: ({ value }) => {
        const next = validateUrbitBaseUrl(value);
        return next.ok ? next.baseUrl : value.trim();
      },
      applySet: ({ cfg, accountId, value }) =>
        applyTlonSetupConfig({
          cfg,
          accountId,
          input: { url: value.trim() },
        }),
    },
    {
      inputKey: "code",
      message: "Login code",
      placeholder: "lidlut-tabwed-pillex-ridrup",
      currentValue: ({ cfg, accountId }) => resolveTlonAccount(cfg, accountId).code ?? undefined,
      applySet: ({ cfg, accountId, value }) =>
        applyTlonSetupConfig({
          cfg,
          accountId,
          input: { code: value.trim() },
        }),
    },
  ],
  finalize: async ({ cfg, accountId, prompter }) => {
    let next = cfg;
    let resolved = resolveTlonAccount(next, accountId);

    const validatedUrl = validateUrbitBaseUrl(resolved.url ?? "");
    if (!validatedUrl.ok) {
      throw new Error(`Invalid URL: ${validatedUrl.error}`);
    }

    let allowPrivateNetwork = resolved.allowPrivateNetwork ?? false;
    if (isBlockedUrbitHostname(validatedUrl.hostname)) {
      allowPrivateNetwork = await prompter.confirm({
        message:
          "Ship URL looks like a private/internal host. Allow private network access? (SSRF risk)",
        initialValue: allowPrivateNetwork,
      });
      if (!allowPrivateNetwork) {
        throw new Error("Refusing private/internal Ship URL without explicit approval");
      }
      next = applyTlonSetupConfig({
        cfg: next,
        accountId,
        input: { allowPrivateNetwork },
      });
      resolved = resolveTlonAccount(next, accountId);
    }

    const wantsGroupChannels = await prompter.confirm({
      message: "Add group channels manually? (optional)",
      initialValue: resolved.groupChannels.length > 0,
    });
    if (wantsGroupChannels) {
      const entry = await prompter.text({
        message: "Group channels (comma-separated)",
        placeholder: "chat/~host-ship/general, chat/~host-ship/support",
        initialValue:
          resolved.groupChannels.length > 0 ? resolved.groupChannels.join(", ") : undefined,
      });
      const groupChannels = parseList(String(entry ?? ""));
      next = applyTlonSetupConfig({
        cfg: next,
        accountId,
        input: {
          groupChannels: groupChannels.length > 0 ? groupChannels : undefined,
        },
      });
      resolved = resolveTlonAccount(next, accountId);
    }

    const wantsAllowlist = await prompter.confirm({
      message: "Restrict DMs with an allowlist?",
      initialValue: resolved.dmAllowlist.length > 0,
    });
    if (wantsAllowlist) {
      const entry = await prompter.text({
        message: "DM allowlist (comma-separated ship names)",
        placeholder: "~zod, ~nec",
        initialValue:
          resolved.dmAllowlist.length > 0 ? resolved.dmAllowlist.join(", ") : undefined,
      });
      const dmAllowlist = parseList(String(entry ?? ""));
      next = applyTlonSetupConfig({
        cfg: next,
        accountId,
        input: {
          dmAllowlist: dmAllowlist.length > 0 ? dmAllowlist : undefined,
        },
      });
      resolved = resolveTlonAccount(next, accountId);
    }

    const autoDiscoverChannels = await prompter.confirm({
      message: "Enable auto-discovery of group channels?",
      initialValue: resolved.autoDiscoverChannels ?? true,
    });
    next = applyTlonSetupConfig({
      cfg: next,
      accountId,
      input: { autoDiscoverChannels },
    });

    return { cfg: next };
  },
};
