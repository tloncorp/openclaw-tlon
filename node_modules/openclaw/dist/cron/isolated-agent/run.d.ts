import type { OpenClawConfig } from "../../config/config.js";
import type { CronJob } from "../types.js";
import { type CliDeps } from "../../cli/outbound-send-deps.js";
export type RunCronAgentTurnResult = {
    status: "ok" | "error" | "skipped";
    summary?: string;
    /** Last non-empty agent text output (not truncated). */
    outputText?: string;
    error?: string;
};
export declare function runCronIsolatedAgentTurn(params: {
    cfg: OpenClawConfig;
    deps: CliDeps;
    job: CronJob;
    message: string;
    sessionKey: string;
    agentId?: string;
    lane?: string;
}): Promise<RunCronAgentTurnResult>;
