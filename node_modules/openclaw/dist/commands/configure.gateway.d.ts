import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
export declare function promptGatewayConfig(cfg: OpenClawConfig, runtime: RuntimeEnv): Promise<{
    config: OpenClawConfig;
    port: number;
    token?: string;
}>;
