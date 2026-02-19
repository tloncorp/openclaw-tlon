import type { CliDeps } from "../cli/deps.js";
import type { loadConfig } from "../config/config.js";
import type { HeartbeatRunner } from "../infra/heartbeat-runner.js";
import type { ChannelKind, GatewayReloadPlan } from "./config-reload.js";
import { resolveHooksConfig } from "./hooks.js";
import { startBrowserControlServerIfEnabled } from "./server-browser.js";
import { type GatewayCronState } from "./server-cron.js";
type GatewayHotReloadState = {
    hooksConfig: ReturnType<typeof resolveHooksConfig>;
    heartbeatRunner: HeartbeatRunner;
    cronState: GatewayCronState;
    browserControl: Awaited<ReturnType<typeof startBrowserControlServerIfEnabled>> | null;
};
export declare function createGatewayReloadHandlers(params: {
    deps: CliDeps;
    broadcast: (event: string, payload: unknown, opts?: {
        dropIfSlow?: boolean;
    }) => void;
    getState: () => GatewayHotReloadState;
    setState: (state: GatewayHotReloadState) => void;
    startChannel: (name: ChannelKind) => Promise<void>;
    stopChannel: (name: ChannelKind) => Promise<void>;
    logHooks: {
        info: (msg: string) => void;
        warn: (msg: string) => void;
        error: (msg: string) => void;
    };
    logBrowser: {
        error: (msg: string) => void;
    };
    logChannels: {
        info: (msg: string) => void;
        error: (msg: string) => void;
    };
    logCron: {
        error: (msg: string) => void;
    };
    logReload: {
        info: (msg: string) => void;
        warn: (msg: string) => void;
    };
}): {
    applyHotReload: (plan: GatewayReloadPlan, nextConfig: ReturnType<typeof loadConfig>) => Promise<void>;
    requestGatewayRestart: (plan: GatewayReloadPlan, nextConfig: ReturnType<typeof loadConfig>) => void;
};
export {};
