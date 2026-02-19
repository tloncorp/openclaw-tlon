import type { GatewayClient } from "../gateway/client.js";
import type { AcpServerOptions } from "./types.js";
export type AcpSessionMeta = {
    sessionKey?: string;
    sessionLabel?: string;
    resetSession?: boolean;
    requireExisting?: boolean;
    prefixCwd?: boolean;
};
export declare function parseSessionMeta(meta: unknown): AcpSessionMeta;
export declare function resolveSessionKey(params: {
    meta: AcpSessionMeta;
    fallbackKey: string;
    gateway: GatewayClient;
    opts: AcpServerOptions;
}): Promise<string>;
export declare function resetSessionIfNeeded(params: {
    meta: AcpSessionMeta;
    sessionKey: string;
    gateway: GatewayClient;
    opts: AcpServerOptions;
}): Promise<void>;
