import type { OpenClawConfig } from "../../config/config.js";
export declare function getAgentLocalStatuses(cfg: OpenClawConfig): Promise<{
    defaultId: string;
    agents: {
        id: string;
        name: string | undefined;
        workspaceDir: string | null;
        bootstrapPending: boolean | null;
        sessionsPath: string;
        sessionsCount: number;
        lastUpdatedAt: number | null;
        lastActiveAgeMs: number | null;
    }[];
    totalSessions: number;
    bootstrapPendingCount: number;
}>;
