import type { loadConfig } from "../config/config.js";
import type { GatewayRequestHandler } from "./server-methods/types.js";
export declare function loadGatewayPlugins(params: {
    cfg: ReturnType<typeof loadConfig>;
    workspaceDir: string;
    log: {
        info: (msg: string) => void;
        warn: (msg: string) => void;
        error: (msg: string) => void;
        debug: (msg: string) => void;
    };
    coreGatewayHandlers: Record<string, GatewayRequestHandler>;
    baseMethods: string[];
}): {
    pluginRegistry: import("../plugins/registry.js").PluginRegistry;
    gatewayMethods: string[];
};
