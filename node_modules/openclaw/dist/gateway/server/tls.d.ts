import type { GatewayTlsConfig } from "../../config/types.gateway.js";
import { type GatewayTlsRuntime } from "../../infra/tls/gateway.js";
export type { GatewayTlsRuntime } from "../../infra/tls/gateway.js";
export declare function loadGatewayTlsRuntime(cfg: GatewayTlsConfig | undefined, log?: {
    info?: (msg: string) => void;
    warn?: (msg: string) => void;
}): Promise<GatewayTlsRuntime>;
