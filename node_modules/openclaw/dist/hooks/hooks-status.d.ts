import type { OpenClawConfig } from "../config/config.js";
import type { HookEligibilityContext, HookEntry, HookInstallSpec } from "./types.js";
export type HookStatusConfigCheck = {
    path: string;
    value: unknown;
    satisfied: boolean;
};
export type HookInstallOption = {
    id: string;
    kind: HookInstallSpec["kind"];
    label: string;
    bins: string[];
};
export type HookStatusEntry = {
    name: string;
    description: string;
    source: string;
    pluginId?: string;
    filePath: string;
    baseDir: string;
    handlerPath: string;
    hookKey: string;
    emoji?: string;
    homepage?: string;
    events: string[];
    always: boolean;
    disabled: boolean;
    eligible: boolean;
    managedByPlugin: boolean;
    requirements: {
        bins: string[];
        anyBins: string[];
        env: string[];
        config: string[];
        os: string[];
    };
    missing: {
        bins: string[];
        anyBins: string[];
        env: string[];
        config: string[];
        os: string[];
    };
    configChecks: HookStatusConfigCheck[];
    install: HookInstallOption[];
};
export type HookStatusReport = {
    workspaceDir: string;
    managedHooksDir: string;
    hooks: HookStatusEntry[];
};
export declare function buildWorkspaceHookStatus(workspaceDir: string, opts?: {
    config?: OpenClawConfig;
    managedHooksDir?: string;
    entries?: HookEntry[];
    eligibility?: HookEligibilityContext;
}): HookStatusReport;
