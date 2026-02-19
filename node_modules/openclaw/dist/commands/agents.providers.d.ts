import type { ChannelId } from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";
import type { AgentBinding } from "../config/types.js";
type ProviderAccountStatus = {
    provider: ChannelId;
    accountId: string;
    name?: string;
    state: "linked" | "not linked" | "configured" | "not configured" | "enabled" | "disabled";
    enabled?: boolean;
    configured?: boolean;
};
export declare function buildProviderStatusIndex(cfg: OpenClawConfig): Promise<Map<string, ProviderAccountStatus>>;
export declare function summarizeBindings(cfg: OpenClawConfig, bindings: AgentBinding[]): string[];
export declare function listProvidersForAgent(params: {
    summaryIsDefault: boolean;
    cfg: OpenClawConfig;
    bindings: AgentBinding[];
    providerStatus: Map<string, ProviderAccountStatus>;
}): string[];
export {};
