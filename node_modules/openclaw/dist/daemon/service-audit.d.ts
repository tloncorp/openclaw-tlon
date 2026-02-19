export type GatewayServiceCommand = {
    programArguments: string[];
    workingDirectory?: string;
    environment?: Record<string, string>;
    sourcePath?: string;
} | null;
export type ServiceConfigIssue = {
    code: string;
    message: string;
    detail?: string;
    level?: "recommended" | "aggressive";
};
export type ServiceConfigAudit = {
    ok: boolean;
    issues: ServiceConfigIssue[];
};
export declare const SERVICE_AUDIT_CODES: {
    readonly gatewayCommandMissing: "gateway-command-missing";
    readonly gatewayEntrypointMismatch: "gateway-entrypoint-mismatch";
    readonly gatewayPathMissing: "gateway-path-missing";
    readonly gatewayPathMissingDirs: "gateway-path-missing-dirs";
    readonly gatewayPathNonMinimal: "gateway-path-nonminimal";
    readonly gatewayRuntimeBun: "gateway-runtime-bun";
    readonly gatewayRuntimeNodeVersionManager: "gateway-runtime-node-version-manager";
    readonly gatewayRuntimeNodeSystemMissing: "gateway-runtime-node-system-missing";
    readonly launchdKeepAlive: "launchd-keep-alive";
    readonly launchdRunAtLoad: "launchd-run-at-load";
    readonly systemdAfterNetworkOnline: "systemd-after-network-online";
    readonly systemdRestartSec: "systemd-restart-sec";
    readonly systemdWantsNetworkOnline: "systemd-wants-network-online";
};
export declare function needsNodeRuntimeMigration(issues: ServiceConfigIssue[]): boolean;
export declare function auditGatewayServiceConfig(params: {
    env: Record<string, string | undefined>;
    command: GatewayServiceCommand;
    platform?: NodeJS.Platform;
}): Promise<ServiceConfigAudit>;
