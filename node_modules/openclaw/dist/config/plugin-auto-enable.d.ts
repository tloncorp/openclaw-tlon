import type { OpenClawConfig } from "./config.js";
export type PluginAutoEnableResult = {
    config: OpenClawConfig;
    changes: string[];
};
export declare function isChannelConfigured(cfg: OpenClawConfig, channelId: string, env?: NodeJS.ProcessEnv): boolean;
export declare function applyPluginAutoEnable(params: {
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): PluginAutoEnableResult;
