import type { GatewayAuthConfig, GatewayBindMode, GatewayTailscaleConfig, loadConfig } from "../config/config.js";
import { type ResolvedGatewayAuth } from "./auth.js";
import { resolveHooksConfig } from "./hooks.js";
export type GatewayRuntimeConfig = {
    bindHost: string;
    controlUiEnabled: boolean;
    openAiChatCompletionsEnabled: boolean;
    openResponsesEnabled: boolean;
    openResponsesConfig?: import("../config/types.gateway.js").GatewayHttpResponsesConfig;
    controlUiBasePath: string;
    resolvedAuth: ResolvedGatewayAuth;
    authMode: ResolvedGatewayAuth["mode"];
    tailscaleConfig: GatewayTailscaleConfig;
    tailscaleMode: "off" | "serve" | "funnel";
    hooksConfig: ReturnType<typeof resolveHooksConfig>;
    canvasHostEnabled: boolean;
};
export declare function resolveGatewayRuntimeConfig(params: {
    cfg: ReturnType<typeof loadConfig>;
    port: number;
    bind?: GatewayBindMode;
    host?: string;
    controlUiEnabled?: boolean;
    openAiChatCompletionsEnabled?: boolean;
    openResponsesEnabled?: boolean;
    auth?: GatewayAuthConfig;
    tailscale?: GatewayTailscaleConfig;
}): Promise<GatewayRuntimeConfig>;
