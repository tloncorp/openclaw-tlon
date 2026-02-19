import type { TlsOptions } from "node:tls";
import type { WebSocketServer } from "ws";
import { type Server as HttpServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { CanvasHostHandler } from "../canvas-host/server.js";
import type { createSubsystemLogger } from "../logging/subsystem.js";
import { type HookMessageChannel, type HooksConfigResolved } from "./hooks.js";
type SubsystemLogger = ReturnType<typeof createSubsystemLogger>;
type HookDispatchers = {
    dispatchWakeHook: (value: {
        text: string;
        mode: "now" | "next-heartbeat";
    }) => void;
    dispatchAgentHook: (value: {
        message: string;
        name: string;
        wakeMode: "now" | "next-heartbeat";
        sessionKey: string;
        deliver: boolean;
        channel: HookMessageChannel;
        to?: string;
        model?: string;
        thinking?: string;
        timeoutSeconds?: number;
        allowUnsafeExternalContent?: boolean;
    }) => string;
};
export type HooksRequestHandler = (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;
export declare function createHooksRequestHandler(opts: {
    getHooksConfig: () => HooksConfigResolved | null;
    bindHost: string;
    port: number;
    logHooks: SubsystemLogger;
} & HookDispatchers): HooksRequestHandler;
export declare function createGatewayHttpServer(opts: {
    canvasHost: CanvasHostHandler | null;
    controlUiEnabled: boolean;
    controlUiBasePath: string;
    openAiChatCompletionsEnabled: boolean;
    openResponsesEnabled: boolean;
    openResponsesConfig?: import("../config/types.gateway.js").GatewayHttpResponsesConfig;
    handleHooksRequest: HooksRequestHandler;
    handlePluginRequest?: HooksRequestHandler;
    resolvedAuth: import("./auth.js").ResolvedGatewayAuth;
    tlsOptions?: TlsOptions;
}): HttpServer;
export declare function attachGatewayUpgradeHandler(opts: {
    httpServer: HttpServer;
    wss: WebSocketServer;
    canvasHost: CanvasHostHandler | null;
}): void;
export {};
