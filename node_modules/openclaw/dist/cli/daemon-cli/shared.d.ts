export declare function parsePort(raw: unknown): number | null;
export declare function parsePortFromArgs(programArguments: string[] | undefined): number | null;
export declare function pickProbeHostForBind(bindMode: string, tailnetIPv4: string | undefined, customBindHost?: string): string;
export declare function filterDaemonEnv(env: Record<string, string> | undefined): Record<string, string>;
export declare function safeDaemonEnv(env: Record<string, string> | undefined): string[];
export declare function normalizeListenerAddress(raw: string): string;
export declare function formatRuntimeStatus(runtime: {
    status?: string;
    state?: string;
    subState?: string;
    pid?: number;
    lastExitStatus?: number;
    lastExitReason?: string;
    lastRunResult?: string;
    lastRunTime?: string;
    detail?: string;
} | undefined): string | null;
export declare function renderRuntimeHints(runtime: {
    missingUnit?: boolean;
    status?: string;
} | undefined, env?: NodeJS.ProcessEnv): string[];
export declare function renderGatewayServiceStartHints(env?: NodeJS.ProcessEnv): string[];
