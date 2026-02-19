export { __resetModelCatalogCacheForTest } from "./server-model-catalog.js";
export type GatewayServer = {
    close: (opts?: {
        reason?: string;
        restartExpectedMs?: number | null;
    }) => Promise<void>;
};
export type GatewayServerOptions = {
    /**
     * Bind address policy for the Gateway WebSocket/HTTP server.
     * - loopback: 127.0.0.1
     * - lan: 0.0.0.0
     * - tailnet: bind only to the Tailscale IPv4 address (100.64.0.0/10)
     * - auto: prefer loopback, else LAN
     */
    bind?: import("../config/config.js").GatewayBindMode;
    /**
     * Advanced override for the bind host, bypassing bind resolution.
     * Prefer `bind` unless you really need a specific address.
     */
    host?: string;
    /**
     * If false, do not serve the browser Control UI.
     * Default: config `gateway.controlUi.enabled` (or true when absent).
     */
    controlUiEnabled?: boolean;
    /**
     * If false, do not serve `POST /v1/chat/completions`.
     * Default: config `gateway.http.endpoints.chatCompletions.enabled` (or false when absent).
     */
    openAiChatCompletionsEnabled?: boolean;
    /**
     * If false, do not serve `POST /v1/responses` (OpenResponses API).
     * Default: config `gateway.http.endpoints.responses.enabled` (or false when absent).
     */
    openResponsesEnabled?: boolean;
    /**
     * Override gateway auth configuration (merges with config).
     */
    auth?: import("../config/config.js").GatewayAuthConfig;
    /**
     * Override gateway Tailscale exposure configuration (merges with config).
     */
    tailscale?: import("../config/config.js").GatewayTailscaleConfig;
    /**
     * Test-only: allow canvas host startup even when NODE_ENV/VITEST would disable it.
     */
    allowCanvasHostInTests?: boolean;
    /**
     * Test-only: override the onboarding wizard runner.
     */
    wizardRunner?: (opts: import("../commands/onboard-types.js").OnboardOptions, runtime: import("../runtime.js").RuntimeEnv, prompter: import("../wizard/prompts.js").WizardPrompter) => Promise<void>;
};
export declare function startGatewayServer(port?: number, opts?: GatewayServerOptions): Promise<GatewayServer>;
