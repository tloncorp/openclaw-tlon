export type ExecHost = "sandbox" | "gateway" | "node";
export type ExecSecurity = "deny" | "allowlist" | "full";
export type ExecAsk = "off" | "on-miss" | "always";
export type ExecApprovalsDefaults = {
    security?: ExecSecurity;
    ask?: ExecAsk;
    askFallback?: ExecSecurity;
    autoAllowSkills?: boolean;
};
export type ExecAllowlistEntry = {
    id?: string;
    pattern: string;
    lastUsedAt?: number;
    lastUsedCommand?: string;
    lastResolvedPath?: string;
};
export type ExecApprovalsAgent = ExecApprovalsDefaults & {
    allowlist?: ExecAllowlistEntry[];
};
export type ExecApprovalsFile = {
    version: 1;
    socket?: {
        path?: string;
        token?: string;
    };
    defaults?: ExecApprovalsDefaults;
    agents?: Record<string, ExecApprovalsAgent>;
};
export type ExecApprovalsSnapshot = {
    path: string;
    exists: boolean;
    raw: string | null;
    file: ExecApprovalsFile;
    hash: string;
};
export type ExecApprovalsResolved = {
    path: string;
    socketPath: string;
    token: string;
    defaults: Required<ExecApprovalsDefaults>;
    agent: Required<ExecApprovalsDefaults>;
    allowlist: ExecAllowlistEntry[];
    file: ExecApprovalsFile;
};
export declare const DEFAULT_SAFE_BINS: string[];
export declare function resolveExecApprovalsPath(): string;
export declare function resolveExecApprovalsSocketPath(): string;
export declare function normalizeExecApprovals(file: ExecApprovalsFile): ExecApprovalsFile;
export declare function readExecApprovalsSnapshot(): ExecApprovalsSnapshot;
export declare function loadExecApprovals(): ExecApprovalsFile;
export declare function saveExecApprovals(file: ExecApprovalsFile): void;
export declare function ensureExecApprovals(): ExecApprovalsFile;
export type ExecApprovalsDefaultOverrides = {
    security?: ExecSecurity;
    ask?: ExecAsk;
    askFallback?: ExecSecurity;
    autoAllowSkills?: boolean;
};
export declare function resolveExecApprovals(agentId?: string, overrides?: ExecApprovalsDefaultOverrides): ExecApprovalsResolved;
export declare function resolveExecApprovalsFromFile(params: {
    file: ExecApprovalsFile;
    agentId?: string;
    overrides?: ExecApprovalsDefaultOverrides;
    path?: string;
    socketPath?: string;
    token?: string;
}): ExecApprovalsResolved;
type CommandResolution = {
    rawExecutable: string;
    resolvedPath?: string;
    executableName: string;
};
export declare function resolveCommandResolution(command: string, cwd?: string, env?: NodeJS.ProcessEnv): CommandResolution | null;
export declare function resolveCommandResolutionFromArgv(argv: string[], cwd?: string, env?: NodeJS.ProcessEnv): CommandResolution | null;
export declare function matchAllowlist(entries: ExecAllowlistEntry[], resolution: CommandResolution | null): ExecAllowlistEntry | null;
export type ExecCommandSegment = {
    raw: string;
    argv: string[];
    resolution: CommandResolution | null;
};
export type ExecCommandAnalysis = {
    ok: boolean;
    reason?: string;
    segments: ExecCommandSegment[];
    chains?: ExecCommandSegment[][];
};
export declare function analyzeShellCommand(params: {
    command: string;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
}): ExecCommandAnalysis;
export declare function analyzeArgvCommand(params: {
    argv: string[];
    cwd?: string;
    env?: NodeJS.ProcessEnv;
}): ExecCommandAnalysis;
export declare function normalizeSafeBins(entries?: string[]): Set<string>;
export declare function resolveSafeBins(entries?: string[] | null): Set<string>;
export declare function isSafeBinUsage(params: {
    argv: string[];
    resolution: CommandResolution | null;
    safeBins: Set<string>;
    cwd?: string;
    fileExists?: (filePath: string) => boolean;
}): boolean;
export type ExecAllowlistEvaluation = {
    allowlistSatisfied: boolean;
    allowlistMatches: ExecAllowlistEntry[];
};
export declare function evaluateExecAllowlist(params: {
    analysis: ExecCommandAnalysis;
    allowlist: ExecAllowlistEntry[];
    safeBins: Set<string>;
    cwd?: string;
    skillBins?: Set<string>;
    autoAllowSkills?: boolean;
}): ExecAllowlistEvaluation;
export type ExecAllowlistAnalysis = {
    analysisOk: boolean;
    allowlistSatisfied: boolean;
    allowlistMatches: ExecAllowlistEntry[];
    segments: ExecCommandSegment[];
};
/**
 * Evaluates allowlist for shell commands (including &&, ||, ;) and returns analysis metadata.
 */
export declare function evaluateShellAllowlist(params: {
    command: string;
    allowlist: ExecAllowlistEntry[];
    safeBins: Set<string>;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
    skillBins?: Set<string>;
    autoAllowSkills?: boolean;
}): ExecAllowlistAnalysis;
export declare function requiresExecApproval(params: {
    ask: ExecAsk;
    security: ExecSecurity;
    analysisOk: boolean;
    allowlistSatisfied: boolean;
}): boolean;
export declare function recordAllowlistUse(approvals: ExecApprovalsFile, agentId: string | undefined, entry: ExecAllowlistEntry, command: string, resolvedPath?: string): void;
export declare function addAllowlistEntry(approvals: ExecApprovalsFile, agentId: string | undefined, pattern: string): void;
export declare function minSecurity(a: ExecSecurity, b: ExecSecurity): ExecSecurity;
export declare function maxAsk(a: ExecAsk, b: ExecAsk): ExecAsk;
export type ExecApprovalDecision = "allow-once" | "allow-always" | "deny";
export declare function requestExecApprovalViaSocket(params: {
    socketPath: string;
    token: string;
    request: Record<string, unknown>;
    timeoutMs?: number;
}): Promise<ExecApprovalDecision | null>;
export {};
