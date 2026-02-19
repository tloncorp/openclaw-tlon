import type { GatewayServiceRuntime } from "./service-runtime.js";
export type GatewayServiceInstallArgs = {
    env: Record<string, string | undefined>;
    stdout: NodeJS.WritableStream;
    programArguments: string[];
    workingDirectory?: string;
    environment?: Record<string, string | undefined>;
    description?: string;
};
export type GatewayService = {
    label: string;
    loadedText: string;
    notLoadedText: string;
    install: (args: GatewayServiceInstallArgs) => Promise<void>;
    uninstall: (args: {
        env: Record<string, string | undefined>;
        stdout: NodeJS.WritableStream;
    }) => Promise<void>;
    stop: (args: {
        env?: Record<string, string | undefined>;
        stdout: NodeJS.WritableStream;
    }) => Promise<void>;
    restart: (args: {
        env?: Record<string, string | undefined>;
        stdout: NodeJS.WritableStream;
    }) => Promise<void>;
    isLoaded: (args: {
        env?: Record<string, string | undefined>;
    }) => Promise<boolean>;
    readCommand: (env: Record<string, string | undefined>) => Promise<{
        programArguments: string[];
        workingDirectory?: string;
        environment?: Record<string, string>;
        sourcePath?: string;
    } | null>;
    readRuntime: (env: Record<string, string | undefined>) => Promise<GatewayServiceRuntime>;
};
export declare function resolveGatewayService(): GatewayService;
