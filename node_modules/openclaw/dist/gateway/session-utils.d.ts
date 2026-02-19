import type { GatewayAgentRow, GatewaySessionRow, GatewaySessionsDefaults, SessionsListResult } from "./session-utils.types.js";
import { type OpenClawConfig } from "../config/config.js";
import { type SessionEntry, type SessionScope } from "../config/sessions.js";
export { archiveFileOnDisk, capArrayByJsonBytes, readFirstUserMessageFromTranscript, readLastMessagePreviewFromTranscript, readSessionPreviewItemsFromTranscript, readSessionMessages, resolveSessionTranscriptCandidates, } from "./session-utils.fs.js";
export type { GatewayAgentRow, GatewaySessionRow, GatewaySessionsDefaults, SessionsListResult, SessionsPatchResult, SessionsPreviewEntry, SessionsPreviewResult, } from "./session-utils.types.js";
export declare function deriveSessionTitle(entry: SessionEntry | undefined, firstUserMessage?: string | null): string | undefined;
export declare function loadSessionEntry(sessionKey: string): {
    cfg: OpenClawConfig;
    storePath: string;
    store: Record<string, SessionEntry>;
    entry: SessionEntry;
    canonicalKey: string;
};
export declare function classifySessionKey(key: string, entry?: SessionEntry): GatewaySessionRow["kind"];
export declare function parseGroupKey(key: string): {
    channel?: string;
    kind?: "group" | "channel";
    id?: string;
} | null;
export declare function listAgentsForGateway(cfg: OpenClawConfig): {
    defaultId: string;
    mainKey: string;
    scope: SessionScope;
    agents: GatewayAgentRow[];
};
export declare function resolveSessionStoreKey(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
}): string;
export declare function resolveGatewaySessionStoreTarget(params: {
    cfg: OpenClawConfig;
    key: string;
}): {
    agentId: string;
    storePath: string;
    canonicalKey: string;
    storeKeys: string[];
};
export declare function loadCombinedSessionStoreForGateway(cfg: OpenClawConfig): {
    storePath: string;
    store: Record<string, SessionEntry>;
};
export declare function getSessionDefaults(cfg: OpenClawConfig): GatewaySessionsDefaults;
export declare function resolveSessionModelRef(cfg: OpenClawConfig, entry?: SessionEntry): {
    provider: string;
    model: string;
};
export declare function listSessionsFromStore(params: {
    cfg: OpenClawConfig;
    storePath: string;
    store: Record<string, SessionEntry>;
    opts: import("./protocol/index.js").SessionsListParams;
}): SessionsListResult;
