import type { WorkspaceBootstrapFile } from "../agents/workspace.js";
export declare const DEFAULT_SOUL_EVIL_FILENAME = "SOUL_EVIL.md";
export type SoulEvilConfig = {
    /** Alternate SOUL file name (default: SOUL_EVIL.md). */
    file?: string;
    /** Random chance (0-1) to use SOUL_EVIL on any message. */
    chance?: number;
    /** Daily purge window (static time each day). */
    purge?: {
        /** Start time in 24h HH:mm format. */
        at?: string;
        /** Duration (e.g. 30s, 10m, 1h). */
        duration?: string;
    };
};
type SoulEvilDecision = {
    useEvil: boolean;
    reason?: "purge" | "chance";
    fileName: string;
};
type SoulEvilCheckParams = {
    config?: SoulEvilConfig;
    userTimezone?: string;
    now?: Date;
    random?: () => number;
};
type SoulEvilLog = {
    debug?: (message: string) => void;
    warn?: (message: string) => void;
};
export declare function resolveSoulEvilConfigFromHook(entry: Record<string, unknown> | undefined, log?: SoulEvilLog): SoulEvilConfig | null;
export declare function decideSoulEvil(params: SoulEvilCheckParams): SoulEvilDecision;
export declare function applySoulEvilOverride(params: {
    files: WorkspaceBootstrapFile[];
    workspaceDir: string;
    config?: SoulEvilConfig;
    userTimezone?: string;
    now?: Date;
    random?: () => number;
    log?: SoulEvilLog;
}): Promise<WorkspaceBootstrapFile[]>;
export {};
