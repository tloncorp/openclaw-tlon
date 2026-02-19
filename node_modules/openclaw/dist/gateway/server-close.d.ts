import type { Server as HttpServer } from "node:http";
import type { WebSocketServer } from "ws";
import type { CanvasHostHandler, CanvasHostServer } from "../canvas-host/server.js";
import type { HeartbeatRunner } from "../infra/heartbeat-runner.js";
import type { PluginServicesHandle } from "../plugins/services.js";
import { type ChannelId } from "../channels/plugins/index.js";
export declare function createGatewayCloseHandler(params: {
    bonjourStop: (() => Promise<void>) | null;
    tailscaleCleanup: (() => Promise<void>) | null;
    canvasHost: CanvasHostHandler | null;
    canvasHostServer: CanvasHostServer | null;
    stopChannel: (name: ChannelId, accountId?: string) => Promise<void>;
    pluginServices: PluginServicesHandle | null;
    cron: {
        stop: () => void;
    };
    heartbeatRunner: HeartbeatRunner;
    nodePresenceTimers: Map<string, ReturnType<typeof setInterval>>;
    broadcast: (event: string, payload: unknown, opts?: {
        dropIfSlow?: boolean;
    }) => void;
    tickInterval: ReturnType<typeof setInterval>;
    healthInterval: ReturnType<typeof setInterval>;
    dedupeCleanup: ReturnType<typeof setInterval>;
    agentUnsub: (() => void) | null;
    heartbeatUnsub: (() => void) | null;
    chatRunState: {
        clear: () => void;
    };
    clients: Set<{
        socket: {
            close: (code: number, reason: string) => void;
        };
    }>;
    configReloader: {
        stop: () => Promise<void>;
    };
    browserControl: {
        stop: () => Promise<void>;
    } | null;
    wss: WebSocketServer;
    httpServer: HttpServer;
    httpServers?: HttpServer[];
}): (opts?: {
    reason?: string;
    restartExpectedMs?: number | null;
}) => Promise<void>;
