import type { OpenClawConfig } from "../config/config.js";
import type { PluginRegistry } from "./registry.js";
export type PluginServicesHandle = {
    stop: () => Promise<void>;
};
export declare function startPluginServices(params: {
    registry: PluginRegistry;
    config: OpenClawConfig;
    workspaceDir?: string;
}): Promise<PluginServicesHandle>;
