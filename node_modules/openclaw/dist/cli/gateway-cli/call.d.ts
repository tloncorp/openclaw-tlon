import type { Command } from "commander";
export type GatewayRpcOpts = {
    url?: string;
    token?: string;
    password?: string;
    timeout?: string;
    expectFinal?: boolean;
    json?: boolean;
};
export declare const gatewayCallOpts: (cmd: Command) => Command;
export declare const callGatewayCli: (method: string, opts: GatewayRpcOpts, params?: unknown) => Promise<Record<string, unknown>>;
