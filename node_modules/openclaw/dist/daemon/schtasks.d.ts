import type { GatewayServiceRuntime } from "./service-runtime.js";
export declare function resolveTaskScriptPath(env: Record<string, string | undefined>): string;
export declare function readScheduledTaskCommand(env: Record<string, string | undefined>): Promise<{
    programArguments: string[];
    workingDirectory?: string;
    environment?: Record<string, string>;
} | null>;
export type ScheduledTaskInfo = {
    status?: string;
    lastRunTime?: string;
    lastRunResult?: string;
};
export declare function parseSchtasksQuery(output: string): ScheduledTaskInfo;
export declare function installScheduledTask({ env, stdout, programArguments, workingDirectory, environment, description, }: {
    env: Record<string, string | undefined>;
    stdout: NodeJS.WritableStream;
    programArguments: string[];
    workingDirectory?: string;
    environment?: Record<string, string | undefined>;
    description?: string;
}): Promise<{
    scriptPath: string;
}>;
export declare function uninstallScheduledTask({ env, stdout, }: {
    env: Record<string, string | undefined>;
    stdout: NodeJS.WritableStream;
}): Promise<void>;
export declare function stopScheduledTask({ stdout, env, }: {
    stdout: NodeJS.WritableStream;
    env?: Record<string, string | undefined>;
}): Promise<void>;
export declare function restartScheduledTask({ stdout, env, }: {
    stdout: NodeJS.WritableStream;
    env?: Record<string, string | undefined>;
}): Promise<void>;
export declare function isScheduledTaskInstalled(args: {
    env?: Record<string, string | undefined>;
}): Promise<boolean>;
export declare function readScheduledTaskRuntime(env?: Record<string, string | undefined>): Promise<GatewayServiceRuntime>;
