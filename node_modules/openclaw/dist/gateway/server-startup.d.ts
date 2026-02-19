import type { CliDeps } from "../cli/deps.js";
import type { loadConfig } from "../config/config.js";
import type { loadOpenClawPlugins } from "../plugins/loader.js";
import { type PluginServicesHandle } from "../plugins/services.js";
export declare function startGatewaySidecars(params: {
    cfg: ReturnType<typeof loadConfig>;
    pluginRegistry: ReturnType<typeof loadOpenClawPlugins>;
    defaultWorkspaceDir: string;
    deps: CliDeps;
    startChannels: () => Promise<void>;
    log: {
        warn: (msg: string) => void;
    };
    logHooks: {
        info: (msg: string) => void;
        warn: (msg: string) => void;
        error: (msg: string) => void;
    };
    logChannels: {
        info: (msg: string) => void;
        error: (msg: string) => void;
    };
    logBrowser: {
        error: (msg: string) => void;
    };
}): Promise<{
    browserControl: import("./server-browser.js").BrowserControlServer | null;
    pluginServices: PluginServicesHandle | null;
}>;
