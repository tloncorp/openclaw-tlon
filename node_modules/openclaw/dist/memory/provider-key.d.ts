export declare function computeEmbeddingProviderKey(params: {
    providerId: string;
    providerModel: string;
    openAi?: {
        baseUrl: string;
        model: string;
        headers: Record<string, string>;
    };
    gemini?: {
        baseUrl: string;
        model: string;
        headers: Record<string, string>;
    };
}): string;
