import type { OpenClawConfig } from "../config/config.js";
export type RoutePeerKind = "dm" | "group" | "channel";
export type RoutePeer = {
    kind: RoutePeerKind;
    id: string;
};
export type ResolveAgentRouteInput = {
    cfg: OpenClawConfig;
    channel: string;
    accountId?: string | null;
    peer?: RoutePeer | null;
    /** Parent peer for threads — used for binding inheritance when peer doesn't match directly. */
    parentPeer?: RoutePeer | null;
    guildId?: string | null;
    teamId?: string | null;
};
export type ResolvedAgentRoute = {
    agentId: string;
    channel: string;
    accountId: string;
    /** Internal session key used for persistence + concurrency. */
    sessionKey: string;
    /** Convenience alias for direct-chat collapse. */
    mainSessionKey: string;
    /** Match description for debugging/logging. */
    matchedBy: "binding.peer" | "binding.peer.parent" | "binding.guild" | "binding.team" | "binding.account" | "binding.channel" | "default";
};
export { DEFAULT_ACCOUNT_ID, DEFAULT_AGENT_ID } from "./session-key.js";
export declare function buildAgentSessionKey(params: {
    agentId: string;
    channel: string;
    accountId?: string | null;
    peer?: RoutePeer | null;
    /** DM session scope. */
    dmScope?: "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
    identityLinks?: Record<string, string[]>;
}): string;
export declare function resolveAgentRoute(input: ResolveAgentRouteInput): ResolvedAgentRoute;
