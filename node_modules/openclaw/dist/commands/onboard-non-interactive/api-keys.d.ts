import type { OpenClawConfig } from "../../config/config.js";
import type { RuntimeEnv } from "../../runtime.js";
export type NonInteractiveApiKeySource = "flag" | "env" | "profile";
export declare function resolveNonInteractiveApiKey(params: {
    provider: string;
    cfg: OpenClawConfig;
    flagValue?: string;
    flagName: string;
    envVar: string;
    runtime: RuntimeEnv;
    agentDir?: string;
    allowProfile?: boolean;
}): Promise<{
    key: string;
    source: NonInteractiveApiKeySource;
} | null>;
