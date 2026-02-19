import type { GatewayServiceRuntime } from "./service-runtime.js";
export declare function resolveLaunchAgentPlistPath(env: Record<string, string | undefined>): string;
export declare function resolveGatewayLogPaths(env: Record<string, string | undefined>): {
    logDir: string;
    stdoutPath: string;
    stderrPath: string;
};
export declare function readLaunchAgentProgramArguments(env: Record<string, string | undefined>): Promise<{
    programArguments: string[];
    workingDirectory?: string;
    environment?: Record<string, string>;
    sourcePath?: string;
} | null>;
export declare function buildLaunchAgentPlist({ label, comment, programArguments, workingDirectory, stdoutPath, stderrPath, environment, }: {
    label?: string;
    comment?: string;
    programArguments: string[];
    workingDirectory?: string;
    stdoutPath: string;
    stderrPath: string;
    environment?: Record<string, string | undefined>;
}): string;
export type LaunchctlPrintInfo = {
    state?: string;
    pid?: number;
    lastExitStatus?: number;
    lastExitReason?: string;
};
export declare function parseLaunchctlPrint(output: string): LaunchctlPrintInfo;
export declare function isLaunchAgentLoaded(args: {
    env?: Record<string, string | undefined>;
}): Promise<boolean>;
export declare function isLaunchAgentListed(args: {
    env?: Record<string, string | undefined>;
}): Promise<boolean>;
export declare function launchAgentPlistExists(env: Record<string, string | undefined>): Promise<boolean>;
export declare function readLaunchAgentRuntime(env: Record<string, string | undefined>): Promise<GatewayServiceRuntime>;
export declare function repairLaunchAgentBootstrap(args: {
    env?: Record<string, string | undefined>;
}): Promise<{
    ok: boolean;
    detail?: string;
}>;
export type LegacyLaunchAgent = {
    label: string;
    plistPath: string;
    loaded: boolean;
    exists: boolean;
};
export declare function findLegacyLaunchAgents(env: Record<string, string | undefined>): Promise<LegacyLaunchAgent[]>;
export declare function uninstallLegacyLaunchAgents({ env, stdout, }: {
    env: Record<string, string | undefined>;
    stdout: NodeJS.WritableStream;
}): Promise<LegacyLaunchAgent[]>;
export declare function uninstallLaunchAgent({ env, stdout, }: {
    env: Record<string, string | undefined>;
    stdout: NodeJS.WritableStream;
}): Promise<void>;
export declare function stopLaunchAgent({ stdout, env, }: {
    stdout: NodeJS.WritableStream;
    env?: Record<string, string | undefined>;
}): Promise<void>;
export declare function installLaunchAgent({ env, stdout, programArguments, workingDirectory, environment, description, }: {
    env: Record<string, string | undefined>;
    stdout: NodeJS.WritableStream;
    programArguments: string[];
    workingDirectory?: string;
    environment?: Record<string, string | undefined>;
    description?: string;
}): Promise<{
    plistPath: string;
}>;
export declare function restartLaunchAgent({ stdout, env, }: {
    stdout: NodeJS.WritableStream;
    env?: Record<string, string | undefined>;
}): Promise<void>;
