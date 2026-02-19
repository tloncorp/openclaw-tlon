import type { SubagentRunRecord } from "../../agents/subagent-registry.js";
export declare function formatDurationShort(valueMs?: number): string;
export declare function formatAgeShort(valueMs?: number): string;
export declare function resolveSubagentLabel(entry: SubagentRunRecord, fallback?: string): string;
export declare function formatRunLabel(entry: SubagentRunRecord, options?: {
    maxLength?: number;
}): string;
export declare function formatRunStatus(entry: SubagentRunRecord): "unknown" | "error" | "timeout" | "done" | "running";
export declare function sortSubagentRuns(runs: SubagentRunRecord[]): SubagentRunRecord[];
