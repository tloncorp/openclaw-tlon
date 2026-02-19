import type { SystemPresence } from "../infra/system-presence.js";
export type GatewayProbeAuth = {
    token?: string;
    password?: string;
};
export type GatewayProbeClose = {
    code: number;
    reason: string;
    hint?: string;
};
export type GatewayProbeResult = {
    ok: boolean;
    url: string;
    connectLatencyMs: number | null;
    error: string | null;
    close: GatewayProbeClose | null;
    health: unknown;
    status: unknown;
    presence: SystemPresence[] | null;
    configSnapshot: unknown;
};
export declare function probeGateway(opts: {
    url: string;
    auth?: GatewayProbeAuth;
    timeoutMs: number;
}): Promise<GatewayProbeResult>;
