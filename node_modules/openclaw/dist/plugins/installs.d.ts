import type { OpenClawConfig } from "../config/config.js";
import type { PluginInstallRecord } from "../config/types.plugins.js";
export type PluginInstallUpdate = PluginInstallRecord & {
    pluginId: string;
};
export declare function recordPluginInstall(cfg: OpenClawConfig, update: PluginInstallUpdate): OpenClawConfig;
