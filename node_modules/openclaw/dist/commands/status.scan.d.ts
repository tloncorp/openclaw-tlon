import type { MemoryIndexManager } from "../memory/manager.js";
import type { RuntimeEnv } from "../runtime.js";
import { loadConfig } from "../config/config.js";
import { buildGatewayConnectionDetails } from "../gateway/call.js";
import { probeGateway } from "../gateway/probe.js";
import { collectChannelStatusIssues } from "../infra/channels-status-issues.js";
import { resolveOsSummary } from "../infra/os-summary.js";
import { buildChannelsTable } from "./status-all/channels.js";
import { getAgentLocalStatuses } from "./status.agent-local.js";
import { pickGatewaySelfPresence } from "./status.gateway-probe.js";
import { getStatusSummary } from "./status.summary.js";
import { getUpdateCheckResult } from "./status.update.js";
type MemoryStatusSnapshot = ReturnType<MemoryIndexManager["status"]> & {
    agentId: string;
};
type MemoryPluginStatus = {
    enabled: boolean;
    slot: string | null;
    reason?: string;
};
export type StatusScanResult = {
    cfg: ReturnType<typeof loadConfig>;
    osSummary: ReturnType<typeof resolveOsSummary>;
    tailscaleMode: string;
    tailscaleDns: string | null;
    tailscaleHttpsUrl: string | null;
    update: Awaited<ReturnType<typeof getUpdateCheckResult>>;
    gatewayConnection: ReturnType<typeof buildGatewayConnectionDetails>;
    remoteUrlMissing: boolean;
    gatewayMode: "local" | "remote";
    gatewayProbe: Awaited<ReturnType<typeof probeGateway>> | null;
    gatewayReachable: boolean;
    gatewaySelf: ReturnType<typeof pickGatewaySelfPresence>;
    channelIssues: ReturnType<typeof collectChannelStatusIssues>;
    agentStatus: Awaited<ReturnType<typeof getAgentLocalStatuses>>;
    channels: Awaited<ReturnType<typeof buildChannelsTable>>;
    summary: Awaited<ReturnType<typeof getStatusSummary>>;
    memory: MemoryStatusSnapshot | null;
    memoryPlugin: MemoryPluginStatus;
};
export declare function scanStatus(opts: {
    json?: boolean;
    timeoutMs?: number;
    all?: boolean;
}, _runtime: RuntimeEnv): Promise<StatusScanResult>;
export {};
