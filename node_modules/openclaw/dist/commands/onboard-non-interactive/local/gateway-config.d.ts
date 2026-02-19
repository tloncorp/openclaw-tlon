import type { OpenClawConfig } from "../../../config/config.js";
import type { RuntimeEnv } from "../../../runtime.js";
import type { OnboardOptions } from "../../onboard-types.js";
export declare function applyNonInteractiveGatewayConfig(params: {
    nextConfig: OpenClawConfig;
    opts: OnboardOptions;
    runtime: RuntimeEnv;
    defaultPort: number;
}): {
    nextConfig: OpenClawConfig;
    port: number;
    bind: string;
    authMode: string;
    tailscaleMode: string;
    tailscaleResetOnExit: boolean;
    gatewayToken?: string;
} | null;
