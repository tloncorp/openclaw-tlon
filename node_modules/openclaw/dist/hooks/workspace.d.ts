import type { OpenClawConfig } from "../config/config.js";
import type { HookEligibilityContext, HookEntry, HookSnapshot, HookSource } from "./types.js";
export declare function loadHookEntriesFromDir(params: {
    dir: string;
    source: HookSource;
    pluginId?: string;
}): HookEntry[];
export declare function buildWorkspaceHookSnapshot(workspaceDir: string, opts?: {
    config?: OpenClawConfig;
    managedHooksDir?: string;
    bundledHooksDir?: string;
    entries?: HookEntry[];
    eligibility?: HookEligibilityContext;
    snapshotVersion?: number;
}): HookSnapshot;
export declare function loadWorkspaceHookEntries(workspaceDir: string, opts?: {
    config?: OpenClawConfig;
    managedHooksDir?: string;
    bundledHooksDir?: string;
}): HookEntry[];
