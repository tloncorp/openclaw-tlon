import type { OpenClawConfig } from "./openclaw-sdk.js";

export type TlonResolvedAccount = {
  accountId: string;
  name: string | null;
  enabled: boolean;
  configured: boolean;
  ship: string | null;
  url: string | null;
  code: string | null;
  allowPrivateNetwork: boolean | null;
  groupChannels: string[];
  dmAllowlist: string[];
  /** Ships allowed to invite us to groups (security: prevent malicious group invites) */
  groupInviteAllowlist: string[];
  autoDiscoverChannels: boolean | null;
  showModelSignature: boolean | null;
  autoAcceptDmInvites: boolean | null;
  autoAcceptGroupInvites: boolean | null;
  defaultAuthorizedShips: string[];
  /** Ship that receives approval requests for DMs, channel mentions, and group invites */
  ownerShip: string | null;
  /** Controls agent reaction behavior: off | ack | minimal | extensive (default: minimal) */
  reactionLevel: string | null;
  /** Max consecutive responses to another bot before stopping (default: 3) */
  maxConsecutiveBotResponses: number | null;
};

export function resolveTlonAccount(
  cfg: OpenClawConfig,
  accountId?: string | null,
): TlonResolvedAccount {
  const base = cfg.channels?.tlon as
    | {
        name?: string;
        enabled?: boolean;
        ship?: string;
        url?: string;
        code?: string;
        allowPrivateNetwork?: boolean;
        groupChannels?: string[];
        dmAllowlist?: string[];
        groupInviteAllowlist?: string[];
        autoDiscoverChannels?: boolean;
        showModelSignature?: boolean;
        autoAcceptDmInvites?: boolean;
        autoAcceptGroupInvites?: boolean;
        ownerShip?: string;
        reactionLevel?: string;
        maxConsecutiveBotResponses?: number;
        accounts?: Record<string, Record<string, unknown>>;
      }
    | undefined;

  if (!base) {
    return {
      accountId: accountId || "default",
      name: null,
      enabled: false,
      configured: false,
      ship: null,
      url: null,
      code: null,
      allowPrivateNetwork: null,
      groupChannels: [],
      dmAllowlist: [],
      groupInviteAllowlist: [],
      autoDiscoverChannels: null,
      showModelSignature: null,
      autoAcceptDmInvites: null,
      autoAcceptGroupInvites: null,
      defaultAuthorizedShips: [],
      ownerShip: null,
      reactionLevel: null,
      maxConsecutiveBotResponses: null,
    };
  }

  const useDefault = !accountId || accountId === "default";
  const account = useDefault ? base : base.accounts?.[accountId];

  const ship = (account?.ship ?? base.ship ?? null) as string | null;
  const url = (account?.url ?? base.url ?? null) as string | null;
  const code = (account?.code ?? base.code ?? null) as string | null;
  const allowPrivateNetwork = (account?.allowPrivateNetwork ?? base.allowPrivateNetwork ?? null) as
    | boolean
    | null;
  const groupChannels = (account?.groupChannels ?? base.groupChannels ?? []) as string[];
  const dmAllowlist = (account?.dmAllowlist ?? base.dmAllowlist ?? []) as string[];
  const groupInviteAllowlist = (account?.groupInviteAllowlist ??
    base.groupInviteAllowlist ??
    []) as string[];
  const autoDiscoverChannels = (account?.autoDiscoverChannels ??
    base.autoDiscoverChannels ??
    null) as boolean | null;
  const showModelSignature = (account?.showModelSignature ?? base.showModelSignature ?? null) as
    | boolean
    | null;
  const autoAcceptDmInvites = (account?.autoAcceptDmInvites ?? base.autoAcceptDmInvites ?? null) as
    | boolean
    | null;
  const autoAcceptGroupInvites = (account?.autoAcceptGroupInvites ??
    base.autoAcceptGroupInvites ??
    null) as boolean | null;
  const ownerShip = (account?.ownerShip ?? base.ownerShip ?? null) as string | null;
  const reactionLevel = (account?.reactionLevel ?? base.reactionLevel ?? null) as string | null;
  const maxConsecutiveBotResponses = ((account as Record<string, unknown>)?.maxConsecutiveBotResponses ??
    base.maxConsecutiveBotResponses ??
    null) as number | null;
  const defaultAuthorizedShips = ((account as Record<string, unknown>)?.defaultAuthorizedShips ??
    (base as Record<string, unknown>)?.defaultAuthorizedShips ??
    []) as string[];
  const configured = Boolean(ship && url && code);

  return {
    accountId: accountId || "default",
    name: (account?.name ?? base.name ?? null) as string | null,
    enabled: (account?.enabled ?? base.enabled ?? true) !== false,
    configured,
    ship,
    url,
    code,
    allowPrivateNetwork,
    groupChannels,
    dmAllowlist,
    groupInviteAllowlist,
    autoDiscoverChannels,
    showModelSignature,
    autoAcceptDmInvites,
    autoAcceptGroupInvites,
    defaultAuthorizedShips,
    ownerShip,
    reactionLevel,
    maxConsecutiveBotResponses,
  };
}

export function listTlonAccountIds(cfg: OpenClawConfig): string[] {
  const base = cfg.channels?.tlon as
    | { ship?: string; accounts?: Record<string, Record<string, unknown>> }
    | undefined;
  if (!base) {
    return [];
  }
  const accounts = base.accounts ?? {};
  return [...(base.ship ? ["default"] : []), ...Object.keys(accounts)];
}
