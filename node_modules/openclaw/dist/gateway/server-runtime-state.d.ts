import type { Server as HttpServer } from "node:http";
import { WebSocketServer } from "ws";
import type { CliDeps } from "../cli/deps.js";
import type { createSubsystemLogger } from "../logging/subsystem.js";
import type { PluginRegistry } from "../plugins/registry.js";
import type { RuntimeEnv } from "../runtime.js";
import type { ResolvedGatewayAuth } from "./auth.js";
import type { ChatAbortControllerEntry } from "./chat-abort.js";
import type { HooksConfigResolved } from "./hooks.js";
import type { DedupeEntry } from "./server-shared.js";
import type { GatewayTlsRuntime } from "./server/tls.js";
import type { GatewayWsClient } from "./server/ws-types.js";
import { type CanvasHostHandler } from "../canvas-host/server.js";
import { type ChatRunEntry, createChatRunState } from "./server-chat.js";
export declare function createGatewayRuntimeState(params: {
    cfg: import("../config/config.js").OpenClawConfig;
    bindHost: string;
    port: number;
    controlUiEnabled: boolean;
    controlUiBasePath: string;
    openAiChatCompletionsEnabled: boolean;
    openResponsesEnabled: boolean;
    openResponsesConfig?: import("../config/types.gateway.js").GatewayHttpResponsesConfig;
    resolvedAuth: ResolvedGatewayAuth;
    gatewayTls?: GatewayTlsRuntime;
    hooksConfig: () => HooksConfigResolved | null;
    pluginRegistry: PluginRegistry;
    deps: CliDeps;
    canvasRuntime: RuntimeEnv;
    canvasHostEnabled: boolean;
    allowCanvasHostInTests?: boolean;
    logCanvas: {
        info: (msg: string) => void;
        warn: (msg: string) => void;
    };
    log: {
        info: (msg: string) => void;
        warn: (msg: string) => void;
    };
    logHooks: ReturnType<typeof createSubsystemLogger>;
    logPlugins: ReturnType<typeof createSubsystemLogger>;
}): Promise<{
    canvasHost: CanvasHostHandler | null;
    httpServer: HttpServer;
    httpServers: HttpServer[];
    httpBindHosts: string[];
    wss: WebSocketServer;
    clients: Set<GatewayWsClient>;
    broadcast: (event: string, payload: unknown, opts?: {
        dropIfSlow?: boolean;
        stateVersion?: {
            presence?: number;
            health?: number;
        };
    }) => void;
    agentRunSeq: Map<string, number>;
    dedupe: Map<string, DedupeEntry>;
    chatRunState: ReturnType<typeof createChatRunState>;
    chatRunBuffers: Map<string, string>;
    chatDeltaSentAt: Map<string, number>;
    addChatRun: (sessionId: string, entry: ChatRunEntry) => void;
    removeChatRun: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
    chatAbortControllers: Map<string, ChatAbortControllerEntry>;
}>;
