export type ExecHostRequest = {
    command: string[];
    rawCommand?: string | null;
    cwd?: string | null;
    env?: Record<string, string> | null;
    timeoutMs?: number | null;
    needsScreenRecording?: boolean | null;
    agentId?: string | null;
    sessionKey?: string | null;
    approvalDecision?: "allow-once" | "allow-always" | null;
};
export type ExecHostRunResult = {
    exitCode?: number;
    timedOut: boolean;
    success: boolean;
    stdout: string;
    stderr: string;
    error?: string | null;
};
export type ExecHostError = {
    code: string;
    message: string;
    reason?: string;
};
export type ExecHostResponse = {
    ok: true;
    payload: ExecHostRunResult;
} | {
    ok: false;
    error: ExecHostError;
};
export declare function requestExecHostViaSocket(params: {
    socketPath: string;
    token: string;
    request: ExecHostRequest;
    timeoutMs?: number;
}): Promise<ExecHostResponse | null>;
