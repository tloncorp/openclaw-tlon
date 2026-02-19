export type CdpSendFn = (method: string, params?: Record<string, unknown>) => Promise<unknown>;
export declare function isLoopbackHost(host: string): boolean;
export declare function getHeadersWithAuth(url: string, headers?: Record<string, string>): {
    [x: string]: string;
};
export declare function appendCdpPath(cdpUrl: string, path: string): string;
export declare function fetchJson<T>(url: string, timeoutMs?: number, init?: RequestInit): Promise<T>;
export declare function fetchOk(url: string, timeoutMs?: number, init?: RequestInit): Promise<void>;
export declare function withCdpSocket<T>(wsUrl: string, fn: (send: CdpSendFn) => Promise<T>, opts?: {
    headers?: Record<string, string>;
}): Promise<T>;
