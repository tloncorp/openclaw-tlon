import { createServer } from "node:net";
import { WebSocket } from "ws";
import type { GatewayServerOptions } from "./server.js";
import { type SessionEntry } from "../config/sessions.js";
export declare function writeSessionStore(params: {
    entries: Record<string, Partial<SessionEntry>>;
    storePath?: string;
    agentId?: string;
    mainKey?: string;
}): Promise<void>;
export declare function installGatewayTestHooks(options?: {
    scope?: "test" | "suite";
}): void;
export declare function getFreePort(): Promise<number>;
export declare function occupyPort(): Promise<{
    server: ReturnType<typeof createServer>;
    port: number;
}>;
export declare function onceMessage<T = unknown>(ws: WebSocket, filter: (obj: unknown) => boolean, timeoutMs?: number): Promise<T>;
export declare function startGatewayServer(port: number, opts?: GatewayServerOptions): Promise<import("./server.impl.js").GatewayServer>;
export declare function startServerWithClient(token?: string, opts?: GatewayServerOptions): Promise<{
    server: import("./server.impl.js").GatewayServer;
    ws: WebSocket;
    port: number;
    prevToken: string | undefined;
}>;
type ConnectResponse = {
    type: "res";
    id: string;
    ok: boolean;
    payload?: unknown;
    error?: {
        message?: string;
    };
};
export declare function connectReq(ws: WebSocket, opts?: {
    token?: string;
    password?: string;
    skipDefaultAuth?: boolean;
    minProtocol?: number;
    maxProtocol?: number;
    client?: {
        id: string;
        displayName?: string;
        version: string;
        platform: string;
        mode: string;
        deviceFamily?: string;
        modelIdentifier?: string;
        instanceId?: string;
    };
    role?: string;
    scopes?: string[];
    caps?: string[];
    commands?: string[];
    permissions?: Record<string, boolean>;
    device?: {
        id: string;
        publicKey: string;
        signature: string;
        signedAt: number;
        nonce?: string;
    } | null;
}): Promise<ConnectResponse>;
export declare function connectOk(ws: WebSocket, opts?: Parameters<typeof connectReq>[1]): Promise<{
    type: "hello-ok";
}>;
export declare function rpcReq<T = unknown>(ws: WebSocket, method: string, params?: unknown, timeoutMs?: number): Promise<{
    type: "res";
    id: string;
    ok: boolean;
    payload?: T;
    error?: {
        message?: string;
        code?: string;
    };
}>;
export declare function waitForSystemEvent(timeoutMs?: number): Promise<string[]>;
export {};
