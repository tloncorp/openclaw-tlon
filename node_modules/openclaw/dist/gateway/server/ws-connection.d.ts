import type { WebSocketServer } from "ws";
import type { createSubsystemLogger } from "../../logging/subsystem.js";
import type { ResolvedGatewayAuth } from "../auth.js";
import type { GatewayRequestContext, GatewayRequestHandlers } from "../server-methods/types.js";
import type { GatewayWsClient } from "./ws-types.js";
type SubsystemLogger = ReturnType<typeof createSubsystemLogger>;
export declare function attachGatewayWsConnectionHandler(params: {
    wss: WebSocketServer;
    clients: Set<GatewayWsClient>;
    port: number;
    gatewayHost?: string;
    canvasHostEnabled: boolean;
    canvasHostServerPort?: number;
    resolvedAuth: ResolvedGatewayAuth;
    gatewayMethods: string[];
    events: string[];
    logGateway: SubsystemLogger;
    logHealth: SubsystemLogger;
    logWsControl: SubsystemLogger;
    extraHandlers: GatewayRequestHandlers;
    broadcast: (event: string, payload: unknown, opts?: {
        dropIfSlow?: boolean;
        stateVersion?: {
            presence?: number;
            health?: number;
        };
    }) => void;
    buildRequestContext: () => GatewayRequestContext;
}): void;
export {};
