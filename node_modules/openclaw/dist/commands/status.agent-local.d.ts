export type AgentLocalStatus = {
    id: string;
    name?: string;
    workspaceDir: string | null;
    bootstrapPending: boolean | null;
    sessionsPath: string;
    sessionsCount: number;
    lastUpdatedAt: number | null;
    lastActiveAgeMs: number | null;
};
export declare function getAgentLocalStatuses(): Promise<{
    defaultId: string;
    agents: AgentLocalStatus[];
    totalSessions: number;
    bootstrapPendingCount: number;
}>;
