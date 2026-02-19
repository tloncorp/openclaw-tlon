import type { OpenClawConfig, HookConfig } from "../config/config.js";
import type { HookEligibilityContext, HookEntry } from "./types.js";
export declare function resolveConfigPath(config: OpenClawConfig | undefined, pathStr: string): unknown;
export declare function isConfigPathTruthy(config: OpenClawConfig | undefined, pathStr: string): boolean;
export declare function resolveHookConfig(config: OpenClawConfig | undefined, hookKey: string): HookConfig | undefined;
export declare function resolveRuntimePlatform(): string;
export declare function hasBinary(bin: string): boolean;
export declare function shouldIncludeHook(params: {
    entry: HookEntry;
    config?: OpenClawConfig;
    eligibility?: HookEligibilityContext;
}): boolean;
