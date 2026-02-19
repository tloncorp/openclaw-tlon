import type { ExecApprovalDecision } from "../infra/exec-approvals.js";
export type ExecApprovalRequestPayload = {
    command: string;
    cwd?: string | null;
    host?: string | null;
    security?: string | null;
    ask?: string | null;
    agentId?: string | null;
    resolvedPath?: string | null;
    sessionKey?: string | null;
};
export type ExecApprovalRecord = {
    id: string;
    request: ExecApprovalRequestPayload;
    createdAtMs: number;
    expiresAtMs: number;
    resolvedAtMs?: number;
    decision?: ExecApprovalDecision;
    resolvedBy?: string | null;
};
export declare class ExecApprovalManager {
    private pending;
    create(request: ExecApprovalRequestPayload, timeoutMs: number, id?: string | null): ExecApprovalRecord;
    waitForDecision(record: ExecApprovalRecord, timeoutMs: number): Promise<ExecApprovalDecision | null>;
    resolve(recordId: string, decision: ExecApprovalDecision, resolvedBy?: string | null): boolean;
    getSnapshot(recordId: string): ExecApprovalRecord | null;
}
