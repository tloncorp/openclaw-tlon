type AgentRunSnapshot = {
    runId: string;
    status: "ok" | "error";
    startedAt?: number;
    endedAt?: number;
    error?: string;
    ts: number;
};
export declare function waitForAgentJob(params: {
    runId: string;
    timeoutMs: number;
}): Promise<AgentRunSnapshot | null>;
export {};
