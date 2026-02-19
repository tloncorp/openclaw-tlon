export type HookInstallLogger = {
    info?: (message: string) => void;
    warn?: (message: string) => void;
};
export type InstallHooksResult = {
    ok: true;
    hookPackId: string;
    hooks: string[];
    targetDir: string;
    version?: string;
} | {
    ok: false;
    error: string;
};
export declare function resolveHookInstallDir(hookId: string, hooksDir?: string): string;
export declare function installHooksFromArchive(params: {
    archivePath: string;
    hooksDir?: string;
    timeoutMs?: number;
    logger?: HookInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
    expectedHookPackId?: string;
}): Promise<InstallHooksResult>;
export declare function installHooksFromNpmSpec(params: {
    spec: string;
    hooksDir?: string;
    timeoutMs?: number;
    logger?: HookInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
    expectedHookPackId?: string;
}): Promise<InstallHooksResult>;
export declare function installHooksFromPath(params: {
    path: string;
    hooksDir?: string;
    timeoutMs?: number;
    logger?: HookInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
    expectedHookPackId?: string;
}): Promise<InstallHooksResult>;
