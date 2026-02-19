import type { OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
export declare function checkGatewayHealth(params: {
    runtime: RuntimeEnv;
    cfg: OpenClawConfig;
    timeoutMs?: number;
}): Promise<{
    healthOk: boolean;
}>;
