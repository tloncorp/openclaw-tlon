export type MinimalServicePathOptions = {
    platform?: NodeJS.Platform;
    extraDirs?: string[];
    home?: string;
    env?: Record<string, string | undefined>;
};
type BuildServicePathOptions = MinimalServicePathOptions & {
    env?: Record<string, string | undefined>;
};
/**
 * Resolve common user bin directories for Linux.
 * These are paths where npm global installs and node version managers typically place binaries.
 */
export declare function resolveLinuxUserBinDirs(home: string | undefined, env?: Record<string, string | undefined>): string[];
export declare function getMinimalServicePathParts(options?: MinimalServicePathOptions): string[];
export declare function getMinimalServicePathPartsFromEnv(options?: BuildServicePathOptions): string[];
export declare function buildMinimalServicePath(options?: BuildServicePathOptions): string;
export declare function buildServiceEnvironment(params: {
    env: Record<string, string | undefined>;
    port: number;
    token?: string;
    launchdLabel?: string;
}): Record<string, string | undefined>;
export declare function buildNodeServiceEnvironment(params: {
    env: Record<string, string | undefined>;
}): Record<string, string | undefined>;
export {};
