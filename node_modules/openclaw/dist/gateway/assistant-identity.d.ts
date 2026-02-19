import type { OpenClawConfig } from "../config/config.js";
export declare const DEFAULT_ASSISTANT_IDENTITY: AssistantIdentity;
export type AssistantIdentity = {
    agentId: string;
    name: string;
    avatar: string;
};
export declare function resolveAssistantIdentity(params: {
    cfg: OpenClawConfig;
    agentId?: string | null;
    workspaceDir?: string | null;
}): AssistantIdentity;
