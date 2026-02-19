export type GlobalInstallManager = "npm" | "pnpm" | "bun";
export type CommandRunner = (argv: string[], options: {
    timeoutMs: number;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
}) => Promise<{
    stdout: string;
    stderr: string;
    code: number | null;
}>;
export declare function resolveGlobalRoot(manager: GlobalInstallManager, runCommand: CommandRunner, timeoutMs: number): Promise<string | null>;
export declare function resolveGlobalPackageRoot(manager: GlobalInstallManager, runCommand: CommandRunner, timeoutMs: number): Promise<string | null>;
export declare function detectGlobalInstallManagerForRoot(runCommand: CommandRunner, pkgRoot: string, timeoutMs: number): Promise<GlobalInstallManager | null>;
export declare function detectGlobalInstallManagerByPresence(runCommand: CommandRunner, timeoutMs: number): Promise<GlobalInstallManager | null>;
export declare function globalInstallArgs(manager: GlobalInstallManager, spec: string): string[];
