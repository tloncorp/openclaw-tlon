import type { AgentCommandOpts } from "./agent/types.js";
import { type CliDeps } from "../cli/deps.js";
import { type RuntimeEnv } from "../runtime.js";
export declare function agentCommand(opts: AgentCommandOpts, runtime?: RuntimeEnv, deps?: CliDeps): Promise<{
    payloads: import("../infra/outbound/payloads.js").OutboundPayloadJson[];
    meta: import("../agents/pi-embedded.js").EmbeddedPiRunMeta;
}>;
