import type { loadConfig } from "../config/config.js";
export declare function logGatewayStartup(params: {
    cfg: ReturnType<typeof loadConfig>;
    bindHost: string;
    bindHosts?: string[];
    port: number;
    tlsEnabled?: boolean;
    log: {
        info: (msg: string, meta?: Record<string, unknown>) => void;
    };
    isNixMode: boolean;
}): void;
