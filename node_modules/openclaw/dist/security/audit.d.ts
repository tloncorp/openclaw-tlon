import type { OpenClawConfig } from "../config/config.js";
import type { ExecFn } from "./windows-acl.js";
import { listChannelPlugins } from "../channels/plugins/index.js";
import { probeGateway } from "../gateway/probe.js";
export type SecurityAuditSeverity = "info" | "warn" | "critical";
export type SecurityAuditFinding = {
    checkId: string;
    severity: SecurityAuditSeverity;
    title: string;
    detail: string;
    remediation?: string;
};
export type SecurityAuditSummary = {
    critical: number;
    warn: number;
    info: number;
};
export type SecurityAuditReport = {
    ts: number;
    summary: SecurityAuditSummary;
    findings: SecurityAuditFinding[];
    deep?: {
        gateway?: {
            attempted: boolean;
            url: string | null;
            ok: boolean;
            error: string | null;
            close?: {
                code: number;
                reason: string;
            } | null;
        };
    };
};
export type SecurityAuditOptions = {
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    platform?: NodeJS.Platform;
    deep?: boolean;
    includeFilesystem?: boolean;
    includeChannelSecurity?: boolean;
    /** Override where to check state (default: resolveStateDir()). */
    stateDir?: string;
    /** Override config path check (default: resolveConfigPath()). */
    configPath?: string;
    /** Time limit for deep gateway probe. */
    deepTimeoutMs?: number;
    /** Dependency injection for tests. */
    plugins?: ReturnType<typeof listChannelPlugins>;
    /** Dependency injection for tests. */
    probeGatewayFn?: typeof probeGateway;
    /** Dependency injection for tests (Windows ACL checks). */
    execIcacls?: ExecFn;
};
export declare function runSecurityAudit(opts: SecurityAuditOptions): Promise<SecurityAuditReport>;
