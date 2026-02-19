import type { OpenClawConfig } from "../config/config.js";
import type { SessionScope } from "../config/sessions/types.js";
export type LegacyStateDetection = {
    targetAgentId: string;
    targetMainKey: string;
    targetScope?: SessionScope;
    stateDir: string;
    oauthDir: string;
    sessions: {
        legacyDir: string;
        legacyStorePath: string;
        targetDir: string;
        targetStorePath: string;
        hasLegacy: boolean;
        legacyKeys: string[];
    };
    agentDir: {
        legacyDir: string;
        targetDir: string;
        hasLegacy: boolean;
    };
    whatsappAuth: {
        legacyDir: string;
        targetDir: string;
        hasLegacy: boolean;
    };
    preview: string[];
};
type MigrationLogger = {
    info: (message: string) => void;
    warn: (message: string) => void;
};
export declare function resetAutoMigrateLegacyStateForTest(): void;
export declare function resetAutoMigrateLegacyAgentDirForTest(): void;
export declare function resetAutoMigrateLegacyStateDirForTest(): void;
type StateDirMigrationResult = {
    migrated: boolean;
    skipped: boolean;
    changes: string[];
    warnings: string[];
};
export declare function autoMigrateLegacyStateDir(params: {
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
    log?: MigrationLogger;
}): Promise<StateDirMigrationResult>;
export declare function detectLegacyStateMigrations(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
}): Promise<LegacyStateDetection>;
export declare function migrateLegacyAgentDir(detected: LegacyStateDetection, now: () => number): Promise<{
    changes: string[];
    warnings: string[];
}>;
export declare function runLegacyStateMigrations(params: {
    detected: LegacyStateDetection;
    now?: () => number;
}): Promise<{
    changes: string[];
    warnings: string[];
}>;
export declare function autoMigrateLegacyAgentDir(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
    log?: MigrationLogger;
    now?: () => number;
}): Promise<{
    migrated: boolean;
    skipped: boolean;
    changes: string[];
    warnings: string[];
}>;
export declare function autoMigrateLegacyState(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
    log?: MigrationLogger;
    now?: () => number;
}): Promise<{
    migrated: boolean;
    skipped: boolean;
    changes: string[];
    warnings: string[];
}>;
export {};
