import type { GatewayRpcOpts } from "./gateway-rpc.js";
export type BrowserParentOpts = GatewayRpcOpts & {
    json?: boolean;
    browserProfile?: string;
};
type BrowserRequestParams = {
    method: "GET" | "POST" | "DELETE";
    path: string;
    query?: Record<string, string | number | boolean | undefined>;
    body?: unknown;
};
export declare function callBrowserRequest<T>(opts: BrowserParentOpts, params: BrowserRequestParams, extra?: {
    timeoutMs?: number;
    progress?: boolean;
}): Promise<T>;
export {};
