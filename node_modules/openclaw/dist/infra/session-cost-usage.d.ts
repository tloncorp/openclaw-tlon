import type { OpenClawConfig } from "../config/config.js";
import type { SessionEntry } from "../config/sessions/types.js";
export type CostUsageTotals = {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
    totalTokens: number;
    totalCost: number;
    missingCostEntries: number;
};
export type CostUsageDailyEntry = CostUsageTotals & {
    date: string;
};
export type CostUsageSummary = {
    updatedAt: number;
    days: number;
    daily: CostUsageDailyEntry[];
    totals: CostUsageTotals;
};
export type SessionCostSummary = CostUsageTotals & {
    sessionId?: string;
    sessionFile?: string;
    lastActivity?: number;
};
export declare function loadCostUsageSummary(params?: {
    days?: number;
    config?: OpenClawConfig;
    agentId?: string;
}): Promise<CostUsageSummary>;
export declare function loadSessionCostSummary(params: {
    sessionId?: string;
    sessionEntry?: SessionEntry;
    sessionFile?: string;
    config?: OpenClawConfig;
}): Promise<SessionCostSummary | null>;
