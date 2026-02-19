import type { OpenClawConfig } from "../config/config.js";
import type { ExecApprovalForwardingConfig, ExecApprovalForwardTarget } from "../config/types.approvals.js";
import type { ExecApprovalDecision } from "./exec-approvals.js";
import { deliverOutboundPayloads } from "./outbound/deliver.js";
export type ExecApprovalRequest = {
    id: string;
    request: {
        command: string;
        cwd?: string | null;
        host?: string | null;
        security?: string | null;
        ask?: string | null;
        agentId?: string | null;
        resolvedPath?: string | null;
        sessionKey?: string | null;
    };
    createdAtMs: number;
    expiresAtMs: number;
};
export type ExecApprovalResolved = {
    id: string;
    decision: ExecApprovalDecision;
    resolvedBy?: string | null;
    ts: number;
};
export type ExecApprovalForwarder = {
    handleRequested: (request: ExecApprovalRequest) => Promise<void>;
    handleResolved: (resolved: ExecApprovalResolved) => Promise<void>;
    stop: () => void;
};
export type ExecApprovalForwarderDeps = {
    getConfig?: () => OpenClawConfig;
    deliver?: typeof deliverOutboundPayloads;
    nowMs?: () => number;
    resolveSessionTarget?: (params: {
        cfg: OpenClawConfig;
        request: ExecApprovalRequest;
    }) => ExecApprovalForwardTarget | null;
};
export declare function createExecApprovalForwarder(deps?: ExecApprovalForwarderDeps): ExecApprovalForwarder;
export declare function shouldForwardExecApproval(params: {
    config?: ExecApprovalForwardingConfig;
    request: ExecApprovalRequest;
}): boolean;
