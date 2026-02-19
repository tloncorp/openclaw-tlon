import type { Command } from "commander";
import { type HookStatusReport } from "../hooks/hooks-status.js";
export type HooksListOptions = {
    json?: boolean;
    eligible?: boolean;
    verbose?: boolean;
};
export type HookInfoOptions = {
    json?: boolean;
};
export type HooksCheckOptions = {
    json?: boolean;
};
export type HooksUpdateOptions = {
    all?: boolean;
    dryRun?: boolean;
};
/**
 * Format the hooks list output
 */
export declare function formatHooksList(report: HookStatusReport, opts: HooksListOptions): string;
/**
 * Format detailed info for a single hook
 */
export declare function formatHookInfo(report: HookStatusReport, hookName: string, opts: HookInfoOptions): string;
/**
 * Format check output
 */
export declare function formatHooksCheck(report: HookStatusReport, opts: HooksCheckOptions): string;
export declare function enableHook(hookName: string): Promise<void>;
export declare function disableHook(hookName: string): Promise<void>;
export declare function registerHooksCli(program: Command): void;
