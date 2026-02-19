import type { IncomingMessage } from "node:http";
import type { GatewayAuthConfig, GatewayTailscaleMode } from "../config/config.js";
import { type TailscaleWhoisIdentity } from "../infra/tailscale.js";
export type ResolvedGatewayAuthMode = "token" | "password";
export type ResolvedGatewayAuth = {
    mode: ResolvedGatewayAuthMode;
    token?: string;
    password?: string;
    allowTailscale: boolean;
};
export type GatewayAuthResult = {
    ok: boolean;
    method?: "token" | "password" | "tailscale" | "device-token";
    user?: string;
    reason?: string;
};
type ConnectAuth = {
    token?: string;
    password?: string;
};
type TailscaleWhoisLookup = (ip: string) => Promise<TailscaleWhoisIdentity | null>;
export declare function isLocalDirectRequest(req?: IncomingMessage, trustedProxies?: string[]): boolean;
export declare function resolveGatewayAuth(params: {
    authConfig?: GatewayAuthConfig | null;
    env?: NodeJS.ProcessEnv;
    tailscaleMode?: GatewayTailscaleMode;
}): ResolvedGatewayAuth;
export declare function assertGatewayAuthConfigured(auth: ResolvedGatewayAuth): void;
export declare function authorizeGatewayConnect(params: {
    auth: ResolvedGatewayAuth;
    connectAuth?: ConnectAuth | null;
    req?: IncomingMessage;
    trustedProxies?: string[];
    tailscaleWhois?: TailscaleWhoisLookup;
}): Promise<GatewayAuthResult>;
export {};
