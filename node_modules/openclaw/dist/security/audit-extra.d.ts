import type { OpenClawConfig, ConfigFileSnapshot } from "../config/config.js";
import type { ExecFn } from "./windows-acl.js";
export type SecurityAuditFinding = {
    checkId: string;
    severity: "info" | "warn" | "critical";
    title: string;
    detail: string;
    remediation?: string;
};
export declare function collectAttackSurfaceSummaryFindings(cfg: OpenClawConfig): SecurityAuditFinding[];
export declare function collectSyncedFolderFindings(params: {
    stateDir: string;
    configPath: string;
}): SecurityAuditFinding[];
export declare function collectSecretsInConfigFindings(cfg: OpenClawConfig): SecurityAuditFinding[];
export declare function collectHooksHardeningFindings(cfg: OpenClawConfig): SecurityAuditFinding[];
export declare function collectModelHygieneFindings(cfg: OpenClawConfig): SecurityAuditFinding[];
export declare function collectSmallModelRiskFindings(params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
}): SecurityAuditFinding[];
export declare function collectPluginsTrustFindings(params: {
    cfg: OpenClawConfig;
    stateDir: string;
}): Promise<SecurityAuditFinding[]>;
export declare function collectIncludeFilePermFindings(params: {
    configSnapshot: ConfigFileSnapshot;
    env?: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
    execIcacls?: ExecFn;
}): Promise<SecurityAuditFinding[]>;
export declare function collectStateDeepFilesystemFindings(params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    platform?: NodeJS.Platform;
    execIcacls?: ExecFn;
}): Promise<SecurityAuditFinding[]>;
export declare function collectExposureMatrixFindings(cfg: OpenClawConfig): SecurityAuditFinding[];
export declare function readConfigSnapshotForAudit(params: {
    env: NodeJS.ProcessEnv;
    configPath: string;
}): Promise<ConfigFileSnapshot>;
