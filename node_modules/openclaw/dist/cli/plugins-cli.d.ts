import type { Command } from "commander";
export type PluginsListOptions = {
    json?: boolean;
    enabled?: boolean;
    verbose?: boolean;
};
export type PluginInfoOptions = {
    json?: boolean;
};
export type PluginUpdateOptions = {
    all?: boolean;
    dryRun?: boolean;
};
export declare function registerPluginsCli(program: Command): void;
