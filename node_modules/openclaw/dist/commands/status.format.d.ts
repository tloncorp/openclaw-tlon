import type { SessionStatus } from "./status.types.js";
export declare const formatKTokens: (value: number) => string;
export declare const formatAge: (ms: number | null | undefined) => string;
export declare const formatDuration: (ms: number | null | undefined) => string;
export declare const shortenText: (value: string, maxLen: number) => string;
export declare const formatTokensCompact: (sess: Pick<SessionStatus, "totalTokens" | "contextTokens" | "percentUsed">) => string;
export declare const formatDaemonRuntimeShort: (runtime?: {
    status?: string;
    pid?: number;
    state?: string;
    detail?: string;
    missingUnit?: boolean;
}) => string | null;
