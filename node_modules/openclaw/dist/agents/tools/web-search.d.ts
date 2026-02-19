import type { OpenClawConfig } from "../../config/config.js";
import type { AnyAgentTool } from "./common.js";
type PerplexityConfig = {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
};
type PerplexityApiKeySource = "config" | "perplexity_env" | "openrouter_env" | "none";
type PerplexityBaseUrlHint = "direct" | "openrouter";
declare function inferPerplexityBaseUrlFromApiKey(apiKey?: string): PerplexityBaseUrlHint | undefined;
declare function resolvePerplexityBaseUrl(perplexity?: PerplexityConfig, apiKeySource?: PerplexityApiKeySource, apiKey?: string): string;
declare function normalizeFreshness(value: string | undefined): string | undefined;
export declare function createWebSearchTool(options?: {
    config?: OpenClawConfig;
    sandboxed?: boolean;
}): AnyAgentTool | null;
export declare const __testing: {
    readonly inferPerplexityBaseUrlFromApiKey: typeof inferPerplexityBaseUrlFromApiKey;
    readonly resolvePerplexityBaseUrl: typeof resolvePerplexityBaseUrl;
    readonly normalizeFreshness: typeof normalizeFreshness;
};
export {};
