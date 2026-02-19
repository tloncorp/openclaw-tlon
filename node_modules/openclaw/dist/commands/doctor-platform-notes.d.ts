import type { OpenClawConfig } from "../config/config.js";
import { note } from "../terminal/note.js";
export declare function noteMacLaunchAgentOverrides(): Promise<void>;
export declare function noteMacLaunchctlGatewayEnvOverrides(cfg: OpenClawConfig, deps?: {
    platform?: NodeJS.Platform;
    getenv?: (name: string) => Promise<string | undefined>;
    noteFn?: typeof note;
}): Promise<void>;
export declare function noteDeprecatedLegacyEnvVars(env?: NodeJS.ProcessEnv, deps?: {
    noteFn?: typeof note;
}): void;
