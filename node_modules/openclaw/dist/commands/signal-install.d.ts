import type { RuntimeEnv } from "../runtime.js";
export type SignalInstallResult = {
    ok: boolean;
    cliPath?: string;
    version?: string;
    error?: string;
};
export declare function installSignalCli(runtime: RuntimeEnv): Promise<SignalInstallResult>;
