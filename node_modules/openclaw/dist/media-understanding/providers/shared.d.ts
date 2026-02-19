export declare function normalizeBaseUrl(baseUrl: string | undefined, fallback: string): string;
export declare function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number, fetchFn: typeof fetch): Promise<Response>;
export declare function readErrorResponse(res: Response): Promise<string | undefined>;
