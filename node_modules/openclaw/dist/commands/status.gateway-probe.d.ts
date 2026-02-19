import type { loadConfig } from "../config/config.js";
export declare function resolveGatewayProbeAuth(cfg: ReturnType<typeof loadConfig>): {
    token?: string;
    password?: string;
};
export declare function pickGatewaySelfPresence(presence: unknown): {
    host?: string;
    ip?: string;
    version?: string;
    platform?: string;
} | null;
