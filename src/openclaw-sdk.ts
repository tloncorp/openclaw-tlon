import type {
  ChannelMessageActionAdapter,
  ChannelMessageActionName,
} from "openclaw/plugin-sdk";
import type { OpenClawConfig, WizardPrompter } from "openclaw/plugin-sdk/tlon";
import {
  DEFAULT_ACCOUNT_ID,
  SsrFBlockedError,
  applyAccountNameToChannelSection,
  buildChannelConfigSchema,
  emptyPluginConfigSchema,
  fetchWithSsrFGuard,
  formatDocsLink,
  isBlockedHostnameOrIp,
  normalizeAccountId,
  tlonSetupWizard,
} from "openclaw/plugin-sdk/tlon";

export type {
  ChannelAccountSnapshot,
  ChannelOutboundAdapter,
  ChannelPlugin,
  ChannelSetupInput,
  LookupFn,
  OpenClawConfig,
  OpenClawPluginApi,
  PluginRuntime,
  ReplyPayload,
  RuntimeEnv,
  SsrFPolicy,
  WizardPrompter,
} from "openclaw/plugin-sdk/tlon";
export type {
  ChannelMessageActionAdapter,
  ChannelMessageActionName,
} from "openclaw/plugin-sdk";
export type {
  ChannelSetupWizardAdapter as ChannelOnboardingAdapter,
} from "openclaw/plugin-sdk/setup";

export {
  DEFAULT_ACCOUNT_ID,
  SsrFBlockedError,
  applyAccountNameToChannelSection,
  buildChannelConfigSchema,
  emptyPluginConfigSchema,
  fetchWithSsrFGuard,
  formatDocsLink,
  isBlockedHostnameOrIp,
  normalizeAccountId,
  tlonSetupWizard,
};

type PromptAccountIdParams = {
  cfg: OpenClawConfig;
  prompter: WizardPrompter;
  label: string;
  currentId?: string;
  listAccountIds: (cfg: OpenClawConfig) => string[];
  defaultAccountId: string;
};

type StringParamOptions = {
  required?: boolean;
  trim?: boolean;
  label?: string;
  allowEmpty?: boolean;
};

export type ReactionParams = {
  emoji: string;
  remove: boolean;
  isEmpty: boolean;
};

export async function promptAccountId(params: PromptAccountIdParams): Promise<string> {
  const existingIds = params.listAccountIds(params.cfg);
  const initial = params.currentId?.trim() || params.defaultAccountId || DEFAULT_ACCOUNT_ID;
  const choice = await params.prompter.select({
    message: `${params.label} account`,
    options: [
      ...existingIds.map((id) => ({
        value: id,
        label: id === DEFAULT_ACCOUNT_ID ? "default (primary)" : id,
      })),
      { value: "__new__", label: "Add a new account" },
    ],
    initialValue: initial,
  });

  if (choice !== "__new__") {
    return normalizeAccountId(choice);
  }

  const entered = await params.prompter.text({
    message: `New ${params.label} account id`,
    validate: (value) => (value?.trim() ? undefined : "Required"),
  });
  const normalized = normalizeAccountId(String(entered));
  if (String(entered).trim() !== normalized) {
    await params.prompter.note(
      `Normalized account id to "${normalized}".`,
      `${params.label} account`,
    );
  }
  return normalized;
}

export function createActionGate<T extends Record<string, boolean | undefined>>(
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

export function readStringParam(
  params: Record<string, unknown>,
  key: string,
  options: StringParamOptions & { required: true },
): string;
export function readStringParam(
  params: Record<string, unknown>,
  key: string,
  options?: StringParamOptions,
): string | undefined;
export function readStringParam(
  params: Record<string, unknown>,
  key: string,
  options: StringParamOptions = {},
) {
  const { required = false, trim = true, label = key, allowEmpty = false } = options;
  const raw = params[key];
  if (typeof raw !== "string") {
    if (required) {
      throw new Error(`${label} required`);
    }
    return undefined;
  }
  const value = trim ? raw.trim() : raw;
  if (!value && !allowEmpty) {
    if (required) {
      throw new Error(`${label} required`);
    }
    return undefined;
  }
  return value;
}

export function readNumberParam(
  params: Record<string, unknown>,
  key: string,
  options: { required?: boolean; label?: string; integer?: boolean } = {},
): number | undefined {
  const { required = false, label = key, integer = false } = options;
  const raw = params[key];
  let value: number | undefined;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    value = raw;
  } else if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed) {
      const parsed = Number.parseFloat(trimmed);
      if (Number.isFinite(parsed)) {
        value = parsed;
      }
    }
  }
  if (value === undefined) {
    if (required) {
      throw new Error(`${label} required`);
    }
    return undefined;
  }
  return integer ? Math.trunc(value) : value;
}

export function readReactionParams(
  params: Record<string, unknown>,
  options: {
    emojiKey?: string;
    removeKey?: string;
    removeErrorMessage: string;
  },
): ReactionParams {
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

export function jsonResult(payload: unknown) {
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

export function describeMessageToolActions(
  actions: readonly ChannelMessageActionName[],
): ReturnType<NonNullable<ChannelMessageActionAdapter["describeMessageTool"]>> {
  return { actions };
}
