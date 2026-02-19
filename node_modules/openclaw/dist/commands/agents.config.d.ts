import type { AgentIdentityFile } from "../agents/identity-file.js";
import type { OpenClawConfig } from "../config/config.js";
export type AgentSummary = {
    id: string;
    name?: string;
    identityName?: string;
    identityEmoji?: string;
    identitySource?: "identity" | "config";
    workspace: string;
    agentDir: string;
    model?: string;
    bindings: number;
    bindingDetails?: string[];
    routes?: string[];
    providers?: string[];
    isDefault: boolean;
};
type AgentEntry = NonNullable<NonNullable<OpenClawConfig["agents"]>["list"]>[number];
export type AgentIdentity = AgentIdentityFile;
export declare function listAgentEntries(cfg: OpenClawConfig): AgentEntry[];
export declare function findAgentEntryIndex(list: AgentEntry[], agentId: string): number;
export declare function parseIdentityMarkdown(content: string): AgentIdentity;
export declare function loadAgentIdentity(workspace: string): AgentIdentity | null;
export declare function buildAgentSummaries(cfg: OpenClawConfig): AgentSummary[];
export declare function applyAgentConfig(cfg: OpenClawConfig, params: {
    agentId: string;
    name?: string;
    workspace?: string;
    agentDir?: string;
    model?: string;
}): OpenClawConfig;
export declare function pruneAgentConfig(cfg: OpenClawConfig, agentId: string): {
    config: OpenClawConfig;
    removedBindings: number;
    removedAllow: number;
};
export {};
