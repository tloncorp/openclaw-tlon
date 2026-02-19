import type { ProgressReporter } from "../../cli/progress.js";
import { type RestartSentinelPayload } from "../../infra/restart-sentinel.js";
type ConfigIssueLike = {
    path: string;
    message: string;
};
type ConfigSnapshotLike = {
    exists: boolean;
    valid: boolean;
    path?: string | null;
    legacyIssues?: ConfigIssueLike[] | null;
    issues?: ConfigIssueLike[] | null;
};
type PortUsageLike = {
    listeners: unknown[];
};
type TailscaleStatusLike = {
    backendState: string | null;
    dnsName: string | null;
    ips: string[];
    error: string | null;
};
type SkillStatusLike = {
    workspaceDir: string;
    skills: Array<{
        eligible: boolean;
        missing: Record<string, unknown[]>;
    }>;
};
type ChannelIssueLike = {
    channel: string;
    accountId: string;
    kind: string;
    message: string;
    fix?: string;
};
export declare function appendStatusAllDiagnosis(params: {
    lines: string[];
    progress: ProgressReporter;
    muted: (text: string) => string;
    ok: (text: string) => string;
    warn: (text: string) => string;
    fail: (text: string) => string;
    connectionDetailsForReport: string;
    snap: ConfigSnapshotLike | null;
    remoteUrlMissing: boolean;
    sentinel: {
        payload?: RestartSentinelPayload | null;
    } | null;
    lastErr: string | null;
    port: number;
    portUsage: PortUsageLike | null;
    tailscaleMode: string;
    tailscale: TailscaleStatusLike;
    tailscaleHttpsUrl: string | null;
    skillStatus: SkillStatusLike | null;
    channelsStatus: unknown;
    channelIssues: ChannelIssueLike[];
    gatewayReachable: boolean;
    health: unknown;
}): Promise<void>;
export {};
