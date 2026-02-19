import type { ProviderPlugin } from "./types.js";
import { type PluginLoadOptions } from "./loader.js";
export declare function resolvePluginProviders(params: {
    config?: PluginLoadOptions["config"];
    workspaceDir?: string;
}): ProviderPlugin[];
