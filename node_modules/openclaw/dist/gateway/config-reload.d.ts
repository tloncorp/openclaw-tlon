import type { OpenClawConfig, ConfigFileSnapshot, GatewayReloadMode } from "../config/config.js";
import { type ChannelId } from "../channels/plugins/index.js";
export type GatewayReloadSettings = {
    mode: GatewayReloadMode;
    debounceMs: number;
};
export type ChannelKind = ChannelId;
export type GatewayReloadPlan = {
    changedPaths: string[];
    restartGateway: boolean;
    restartReasons: string[];
    hotReasons: string[];
    reloadHooks: boolean;
    restartGmailWatcher: boolean;
    restartBrowserControl: boolean;
    restartCron: boolean;
    restartHeartbeat: boolean;
    restartChannels: Set<ChannelKind>;
    noopPaths: string[];
};
export declare function diffConfigPaths(prev: unknown, next: unknown, prefix?: string): string[];
export declare function resolveGatewayReloadSettings(cfg: OpenClawConfig): GatewayReloadSettings;
export declare function buildGatewayReloadPlan(changedPaths: string[]): GatewayReloadPlan;
export type GatewayConfigReloader = {
    stop: () => Promise<void>;
};
export declare function startGatewayConfigReloader(opts: {
    initialConfig: OpenClawConfig;
    readSnapshot: () => Promise<ConfigFileSnapshot>;
    onHotReload: (plan: GatewayReloadPlan, nextConfig: OpenClawConfig) => Promise<void>;
    onRestart: (plan: GatewayReloadPlan, nextConfig: OpenClawConfig) => void;
    log: {
        info: (msg: string) => void;
        warn: (msg: string) => void;
        error: (msg: string) => void;
    };
    watchPath: string;
}): GatewayConfigReloader;
