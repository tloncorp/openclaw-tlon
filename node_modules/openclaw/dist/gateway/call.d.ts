import type { OpenClawConfig } from "../config/config.js";
import { type GatewayClientMode, type GatewayClientName } from "../utils/message-channel.js";
export type CallGatewayOptions = {
    url?: string;
    token?: string;
    password?: string;
    tlsFingerprint?: string;
    config?: OpenClawConfig;
    method: string;
    params?: unknown;
    expectFinal?: boolean;
    timeoutMs?: number;
    clientName?: GatewayClientName;
    clientDisplayName?: string;
    clientVersion?: string;
    platform?: string;
    mode?: GatewayClientMode;
    instanceId?: string;
    minProtocol?: number;
    maxProtocol?: number;
    /**
     * Overrides the config path shown in connection error details.
     * Does not affect config loading; callers still control auth via opts.token/password/env/config.
     */
    configPath?: string;
};
export type GatewayConnectionDetails = {
    url: string;
    urlSource: string;
    bindDetail?: string;
    remoteFallbackNote?: string;
    message: string;
};
export declare function buildGatewayConnectionDetails(options?: {
    config?: OpenClawConfig;
    url?: string;
    configPath?: string;
}): GatewayConnectionDetails;
export declare function callGateway<T = Record<string, unknown>>(opts: CallGatewayOptions): Promise<T>;
export declare function randomIdempotencyKey(): `${string}-${string}-${string}-${string}-${string}`;
