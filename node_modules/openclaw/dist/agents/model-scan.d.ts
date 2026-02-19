declare const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
type OpenRouterModelMeta = {
    id: string;
    name: string;
    contextLength: number | null;
    maxCompletionTokens: number | null;
    supportedParameters: string[];
    supportedParametersCount: number;
    supportsToolsMeta: boolean;
    modality: string | null;
    inferredParamB: number | null;
    createdAtMs: number | null;
    pricing: OpenRouterModelPricing | null;
};
type OpenRouterModelPricing = {
    prompt: number;
    completion: number;
    request: number;
    image: number;
    webSearch: number;
    internalReasoning: number;
};
export type ProbeResult = {
    ok: boolean;
    latencyMs: number | null;
    error?: string;
    skipped?: boolean;
};
export type ModelScanResult = {
    id: string;
    name: string;
    provider: string;
    modelRef: string;
    contextLength: number | null;
    maxCompletionTokens: number | null;
    supportedParametersCount: number;
    supportsToolsMeta: boolean;
    modality: string | null;
    inferredParamB: number | null;
    createdAtMs: number | null;
    pricing: OpenRouterModelPricing | null;
    isFree: boolean;
    tool: ProbeResult;
    image: ProbeResult;
};
export type OpenRouterScanOptions = {
    apiKey?: string;
    fetchImpl?: typeof fetch;
    timeoutMs?: number;
    concurrency?: number;
    minParamB?: number;
    maxAgeDays?: number;
    providerFilter?: string;
    probe?: boolean;
    onProgress?: (update: {
        phase: "catalog" | "probe";
        completed: number;
        total: number;
    }) => void;
};
export declare function scanOpenRouterModels(options?: OpenRouterScanOptions): Promise<ModelScanResult[]>;
export { OPENROUTER_MODELS_URL };
export type { OpenRouterModelMeta, OpenRouterModelPricing };
