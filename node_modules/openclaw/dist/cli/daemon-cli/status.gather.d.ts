import type { GatewayBindMode, GatewayControlUiConfig } from "../../config/types.js";
import type { FindExtraGatewayServicesOptions } from "../../daemon/inspect.js";
import type { ServiceConfigAudit } from "../../daemon/service-audit.js";
import type { GatewayRpcOpts } from "./types.js";
import { type PortListener, type PortUsageStatus } from "../../infra/ports.js";
type ConfigSummary = {
    path: string;
    exists: boolean;
    valid: boolean;
    issues?: Array<{
        path: string;
        message: string;
    }>;
    controlUi?: GatewayControlUiConfig;
};
type GatewayStatusSummary = {
    bindMode: GatewayBindMode;
    bindHost: string;
    customBindHost?: string;
    port: number;
    portSource: "service args" | "env/config";
    probeUrl: string;
    probeNote?: string;
};
export type DaemonStatus = {
    service: {
        label: string;
        loaded: boolean;
        loadedText: string;
        notLoadedText: string;
        command?: {
            programArguments: string[];
            workingDirectory?: string;
            environment?: Record<string, string>;
            sourcePath?: string;
        } | null;
        runtime?: {
            status?: string;
            state?: string;
            subState?: string;
            pid?: number;
            lastExitStatus?: number;
            lastExitReason?: string;
            lastRunResult?: string;
            lastRunTime?: string;
            detail?: string;
            cachedLabel?: boolean;
            missingUnit?: boolean;
        };
        configAudit?: ServiceConfigAudit;
    };
    config?: {
        cli: ConfigSummary;
        daemon?: ConfigSummary;
        mismatch?: boolean;
    };
    gateway?: GatewayStatusSummary;
    port?: {
        port: number;
        status: PortUsageStatus;
        listeners: PortListener[];
        hints: string[];
    };
    portCli?: {
        port: number;
        status: PortUsageStatus;
        listeners: PortListener[];
        hints: string[];
    };
    lastError?: string;
    rpc?: {
        ok: boolean;
        error?: string;
        url?: string;
    };
    extraServices: Array<{
        label: string;
        detail: string;
        scope: string;
    }>;
};
export declare function gatherDaemonStatus(opts: {
    rpc: GatewayRpcOpts;
    probe: boolean;
    deep?: boolean;
} & FindExtraGatewayServicesOptions): Promise<DaemonStatus>;
export declare function renderPortDiagnosticsForCli(status: DaemonStatus, rpcOk?: boolean): string[];
export declare function resolvePortListeningAddresses(status: DaemonStatus): string[];
export {};
