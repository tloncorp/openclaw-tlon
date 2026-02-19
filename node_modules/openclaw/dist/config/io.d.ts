import JSON5 from "json5";
import fs from "node:fs";
import type { OpenClawConfig, ConfigFileSnapshot } from "./types.js";
export { CircularIncludeError, ConfigIncludeError } from "./includes.js";
export { MissingEnvVarError } from "./env-substitution.js";
export type ParseConfigJson5Result = {
    ok: true;
    parsed: unknown;
} | {
    ok: false;
    error: string;
};
export declare function resolveConfigSnapshotHash(snapshot: {
    hash?: string;
    raw?: string | null;
}): string | null;
export type ConfigIoDeps = {
    fs?: typeof fs;
    json5?: typeof JSON5;
    env?: NodeJS.ProcessEnv;
    homedir?: () => string;
    configPath?: string;
    logger?: Pick<typeof console, "error" | "warn">;
};
export declare function parseConfigJson5(raw: string, json5?: {
    parse: (value: string) => unknown;
}): ParseConfigJson5Result;
export declare function createConfigIO(overrides?: ConfigIoDeps): {
    configPath: string;
    loadConfig: () => OpenClawConfig;
    readConfigFileSnapshot: () => Promise<ConfigFileSnapshot>;
    writeConfigFile: (cfg: OpenClawConfig) => Promise<void>;
};
export declare function loadConfig(): OpenClawConfig;
export declare function readConfigFileSnapshot(): Promise<ConfigFileSnapshot>;
export declare function writeConfigFile(cfg: OpenClawConfig): Promise<void>;
