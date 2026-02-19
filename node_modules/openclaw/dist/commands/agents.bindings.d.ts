import type { OpenClawConfig } from "../config/config.js";
import type { AgentBinding } from "../config/types.js";
import type { ChannelChoice } from "./onboard-types.js";
export declare function describeBinding(binding: AgentBinding): string;
export declare function applyAgentBindings(cfg: OpenClawConfig, bindings: AgentBinding[]): {
    config: OpenClawConfig;
    added: AgentBinding[];
    skipped: AgentBinding[];
    conflicts: Array<{
        binding: AgentBinding;
        existingAgentId: string;
    }>;
};
export declare function buildChannelBindings(params: {
    agentId: string;
    selection: ChannelChoice[];
    config: OpenClawConfig;
    accountIds?: Partial<Record<ChannelChoice, string>>;
}): AgentBinding[];
export declare function parseBindingSpecs(params: {
    agentId: string;
    specs?: string[];
    config: OpenClawConfig;
}): {
    bindings: AgentBinding[];
    errors: string[];
};
