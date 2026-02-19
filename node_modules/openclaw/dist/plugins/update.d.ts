import type { OpenClawConfig } from "../config/config.js";
import type { UpdateChannel } from "../infra/update-channels.js";
export type PluginUpdateLogger = {
    info?: (message: string) => void;
    warn?: (message: string) => void;
    error?: (message: string) => void;
};
export type PluginUpdateStatus = "updated" | "unchanged" | "skipped" | "error";
export type PluginUpdateOutcome = {
    pluginId: string;
    status: PluginUpdateStatus;
    message: string;
    currentVersion?: string;
    nextVersion?: string;
};
export type PluginUpdateSummary = {
    config: OpenClawConfig;
    changed: boolean;
    outcomes: PluginUpdateOutcome[];
};
export type PluginChannelSyncSummary = {
    switchedToBundled: string[];
    switchedToNpm: string[];
    warnings: string[];
    errors: string[];
};
export type PluginChannelSyncResult = {
    config: OpenClawConfig;
    changed: boolean;
    summary: PluginChannelSyncSummary;
};
export declare function updateNpmInstalledPlugins(params: {
    config: OpenClawConfig;
    logger?: PluginUpdateLogger;
    pluginIds?: string[];
    skipIds?: Set<string>;
    dryRun?: boolean;
}): Promise<PluginUpdateSummary>;
export declare function syncPluginsForUpdateChannel(params: {
    config: OpenClawConfig;
    channel: UpdateChannel;
    workspaceDir?: string;
    logger?: PluginUpdateLogger;
}): Promise<PluginChannelSyncResult>;
