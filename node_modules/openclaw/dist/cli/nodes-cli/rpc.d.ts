import type { Command } from "commander";
import type { NodesRpcOpts } from "./types.js";
export declare const nodesCallOpts: (cmd: Command, defaults?: {
    timeoutMs?: number;
}) => Command;
export declare const callGatewayCli: (method: string, opts: NodesRpcOpts, params?: unknown) => Promise<Record<string, unknown>>;
export declare function unauthorizedHintForMessage(message: string): string | null;
export declare function resolveNodeId(opts: NodesRpcOpts, query: string): Promise<string>;
