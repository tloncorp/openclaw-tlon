import type { OpenClawConfig } from "../../config/config.js";
export type AuthProbeStatus = "ok" | "auth" | "rate_limit" | "billing" | "timeout" | "format" | "unknown" | "no_model";
export type AuthProbeResult = {
    provider: string;
    model?: string;
    profileId?: string;
    label: string;
    source: "profile" | "env" | "models.json";
    mode?: string;
    status: AuthProbeStatus;
    error?: string;
    latencyMs?: number;
};
export type AuthProbeSummary = {
    startedAt: number;
    finishedAt: number;
    durationMs: number;
    totalTargets: number;
    options: {
        provider?: string;
        profileIds?: string[];
        timeoutMs: number;
        concurrency: number;
        maxTokens: number;
    };
    results: AuthProbeResult[];
};
export type AuthProbeOptions = {
    provider?: string;
    profileIds?: string[];
    timeoutMs: number;
    concurrency: number;
    maxTokens: number;
};
export declare function runAuthProbes(params: {
    cfg: OpenClawConfig;
    providers: string[];
    modelCandidates: string[];
    options: AuthProbeOptions;
    onProgress?: (update: {
        completed: number;
        total: number;
        label?: string;
    }) => void;
}): Promise<AuthProbeSummary>;
export declare function formatProbeLatency(latencyMs?: number | null): string;
export declare function groupProbeResults(results: AuthProbeResult[]): Map<string, AuthProbeResult[]>;
export declare function sortProbeResults(results: AuthProbeResult[]): AuthProbeResult[];
export declare function describeProbeSummary(summary: AuthProbeSummary): string;
