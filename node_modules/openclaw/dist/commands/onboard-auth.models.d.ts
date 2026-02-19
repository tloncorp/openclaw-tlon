import type { ModelDefinitionConfig } from "../config/types.js";
export declare const DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.io/v1";
export declare const MINIMAX_API_BASE_URL = "https://api.minimax.io/anthropic";
export declare const MINIMAX_HOSTED_MODEL_ID = "MiniMax-M2.1";
export declare const MINIMAX_HOSTED_MODEL_REF = "minimax/MiniMax-M2.1";
export declare const DEFAULT_MINIMAX_CONTEXT_WINDOW = 200000;
export declare const DEFAULT_MINIMAX_MAX_TOKENS = 8192;
export declare const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
export declare const MOONSHOT_DEFAULT_MODEL_ID = "kimi-k2-0905-preview";
export declare const MOONSHOT_DEFAULT_MODEL_REF = "moonshot/kimi-k2-0905-preview";
export declare const MOONSHOT_DEFAULT_CONTEXT_WINDOW = 256000;
export declare const MOONSHOT_DEFAULT_MAX_TOKENS = 8192;
export declare const KIMI_CODING_MODEL_ID = "k2p5";
export declare const KIMI_CODING_MODEL_REF = "kimi-coding/k2p5";
export declare const MINIMAX_API_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare const MINIMAX_HOSTED_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare const MINIMAX_LM_STUDIO_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare const MOONSHOT_DEFAULT_COST: {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
};
export declare function buildMinimaxModelDefinition(params: {
    id: string;
    name?: string;
    reasoning?: boolean;
    cost: ModelDefinitionConfig["cost"];
    contextWindow: number;
    maxTokens: number;
}): ModelDefinitionConfig;
export declare function buildMinimaxApiModelDefinition(modelId: string): ModelDefinitionConfig;
export declare function buildMoonshotModelDefinition(): ModelDefinitionConfig;
