import type { CliDeps } from "../cli/deps.js";
import type { RuntimeEnv } from "../runtime.js";
type AgentGatewayResult = {
    payloads?: Array<{
        text?: string;
        mediaUrl?: string | null;
        mediaUrls?: string[];
    }>;
    meta?: unknown;
};
type GatewayAgentResponse = {
    runId?: string;
    status?: string;
    summary?: string;
    result?: AgentGatewayResult;
};
export type AgentCliOpts = {
    message: string;
    agent?: string;
    to?: string;
    sessionId?: string;
    thinking?: string;
    verbose?: string;
    json?: boolean;
    timeout?: string;
    deliver?: boolean;
    channel?: string;
    replyTo?: string;
    replyChannel?: string;
    replyAccount?: string;
    bestEffortDeliver?: boolean;
    lane?: string;
    runId?: string;
    extraSystemPrompt?: string;
    local?: boolean;
};
export declare function agentViaGatewayCommand(opts: AgentCliOpts, runtime: RuntimeEnv): Promise<GatewayAgentResponse>;
export declare function agentCliCommand(opts: AgentCliOpts, runtime: RuntimeEnv, deps?: CliDeps): Promise<{
    payloads: import("../infra/outbound/payloads.js").OutboundPayloadJson[];
    meta: import("../agents/pi-embedded.js").EmbeddedPiRunMeta;
} | GatewayAgentResponse>;
export {};
