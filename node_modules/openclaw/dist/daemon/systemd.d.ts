import type { GatewayServiceRuntime } from "./service-runtime.js";
import { enableSystemdUserLinger, readSystemdUserLingerStatus, type SystemdUserLingerStatus } from "./systemd-linger.js";
export declare function resolveSystemdUserUnitPath(env: Record<string, string | undefined>): string;
export { enableSystemdUserLinger, readSystemdUserLingerStatus };
export type { SystemdUserLingerStatus };
export declare function readSystemdServiceExecStart(env: Record<string, string | undefined>): Promise<{
    programArguments: string[];
    workingDirectory?: string;
    environment?: Record<string, string>;
    sourcePath?: string;
} | null>;
export type SystemdServiceInfo = {
    activeState?: string;
    subState?: string;
    mainPid?: number;
    execMainStatus?: number;
    execMainCode?: string;
};
export declare function parseSystemdShow(output: string): SystemdServiceInfo;
export declare function isSystemdUserServiceAvailable(): Promise<boolean>;
export declare function installSystemdService({ env, stdout, programArguments, workingDirectory, environment, description, }: {
    env: Record<string, string | undefined>;
    stdout: NodeJS.WritableStream;
    programArguments: string[];
    workingDirectory?: string;
    environment?: Record<string, string | undefined>;
    description?: string;
}): Promise<{
    unitPath: string;
}>;
export declare function uninstallSystemdService({ env, stdout, }: {
    env: Record<string, string | undefined>;
    stdout: NodeJS.WritableStream;
}): Promise<void>;
export declare function stopSystemdService({ stdout, env, }: {
    stdout: NodeJS.WritableStream;
    env?: Record<string, string | undefined>;
}): Promise<void>;
export declare function restartSystemdService({ stdout, env, }: {
    stdout: NodeJS.WritableStream;
    env?: Record<string, string | undefined>;
}): Promise<void>;
export declare function isSystemdServiceEnabled(args: {
    env?: Record<string, string | undefined>;
}): Promise<boolean>;
export declare function readSystemdServiceRuntime(env?: Record<string, string | undefined>): Promise<GatewayServiceRuntime>;
export type LegacySystemdUnit = {
    name: string;
    unitPath: string;
    enabled: boolean;
    exists: boolean;
};
export declare function findLegacySystemdUnits(env: Record<string, string | undefined>): Promise<LegacySystemdUnit[]>;
export declare function uninstallLegacySystemdUnits({ env, stdout, }: {
    env: Record<string, string | undefined>;
    stdout: NodeJS.WritableStream;
}): Promise<LegacySystemdUnit[]>;
