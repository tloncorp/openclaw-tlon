export type CronRunLogEntry = {
    ts: number;
    jobId: string;
    action: "finished";
    status?: "ok" | "error" | "skipped";
    error?: string;
    summary?: string;
    runAtMs?: number;
    durationMs?: number;
    nextRunAtMs?: number;
};
export declare function resolveCronRunLogPath(params: {
    storePath: string;
    jobId: string;
}): string;
export declare function appendCronRunLog(filePath: string, entry: CronRunLogEntry, opts?: {
    maxBytes?: number;
    keepLines?: number;
}): Promise<void>;
export declare function readCronRunLogEntries(filePath: string, opts?: {
    limit?: number;
    jobId?: string;
}): Promise<CronRunLogEntry[]>;
