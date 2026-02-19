import type { OpenClawConfig } from "../config/config.js";
type ModelsConfig = NonNullable<OpenClawConfig["models"]>;
export type ProviderConfig = NonNullable<ModelsConfig["providers"]>[string];
export declare const XIAOMI_DEFAULT_MODEL_ID = "mimo-v2-flash";
export declare function normalizeGoogleModelId(id: string): string;
export declare function normalizeProviders(params: {
    providers: ModelsConfig["providers"];
    agentDir: string;
}): ModelsConfig["providers"];
export declare function buildXiaomiProvider(): ProviderConfig;
export declare function resolveImplicitProviders(params: {
    agentDir: string;
}): Promise<ModelsConfig["providers"]>;
export declare function resolveImplicitCopilotProvider(params: {
    agentDir: string;
    env?: NodeJS.ProcessEnv;
}): Promise<ProviderConfig | null>;
export declare function resolveImplicitBedrockProvider(params: {
    agentDir: string;
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): Promise<ProviderConfig | null>;
export {};
