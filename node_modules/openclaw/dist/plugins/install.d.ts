type PluginInstallLogger = {
    info?: (message: string) => void;
    warn?: (message: string) => void;
};
export type InstallPluginResult = {
    ok: true;
    pluginId: string;
    targetDir: string;
    manifestName?: string;
    version?: string;
    extensions: string[];
} | {
    ok: false;
    error: string;
};
export declare function resolvePluginInstallDir(pluginId: string, extensionsDir?: string): string;
export declare function installPluginFromArchive(params: {
    archivePath: string;
    extensionsDir?: string;
    timeoutMs?: number;
    logger?: PluginInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
    expectedPluginId?: string;
}): Promise<InstallPluginResult>;
export declare function installPluginFromDir(params: {
    dirPath: string;
    extensionsDir?: string;
    timeoutMs?: number;
    logger?: PluginInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
    expectedPluginId?: string;
}): Promise<InstallPluginResult>;
export declare function installPluginFromFile(params: {
    filePath: string;
    extensionsDir?: string;
    logger?: PluginInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
}): Promise<InstallPluginResult>;
export declare function installPluginFromNpmSpec(params: {
    spec: string;
    extensionsDir?: string;
    timeoutMs?: number;
    logger?: PluginInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
    expectedPluginId?: string;
}): Promise<InstallPluginResult>;
export declare function installPluginFromPath(params: {
    path: string;
    extensionsDir?: string;
    timeoutMs?: number;
    logger?: PluginInstallLogger;
    mode?: "install" | "update";
    dryRun?: boolean;
    expectedPluginId?: string;
}): Promise<InstallPluginResult>;
export {};
