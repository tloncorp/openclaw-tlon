import type { CliDeps } from "../cli/deps.js";
export declare function scheduleRestartSentinelWake(params: {
    deps: CliDeps;
}): Promise<void>;
export declare function shouldWakeFromRestartSentinel(): boolean;
