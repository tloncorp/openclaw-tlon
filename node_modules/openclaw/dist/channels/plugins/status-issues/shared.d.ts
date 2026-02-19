export declare function asString(value: unknown): string | undefined;
export declare function isRecord(value: unknown): value is Record<string, unknown>;
export declare function formatMatchMetadata(params: {
    matchKey?: unknown;
    matchSource?: unknown;
}): string | undefined;
export declare function appendMatchMetadata(message: string, params: {
    matchKey?: unknown;
    matchSource?: unknown;
}): string;
