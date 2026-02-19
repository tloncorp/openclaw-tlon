import type { CliDeps } from "../cli/deps.js";
import type { OpenClawConfig } from "../config/config.js";
export type BootRunResult = {
    status: "skipped";
    reason: "missing" | "empty";
} | {
    status: "ran";
} | {
    status: "failed";
    reason: string;
};
export declare function runBootOnce(params: {
    cfg: OpenClawConfig;
    deps: CliDeps;
    workspaceDir: string;
}): Promise<BootRunResult>;
