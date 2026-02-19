import type { OpenClawPluginApi } from "../plugins/types.js";
import type { HookEntry } from "./types.js";
export type PluginHookLoadResult = {
    hooks: HookEntry[];
    loaded: number;
    skipped: number;
    errors: string[];
};
export declare function registerPluginHooksFromDir(api: OpenClawPluginApi, dir: string): Promise<PluginHookLoadResult>;
