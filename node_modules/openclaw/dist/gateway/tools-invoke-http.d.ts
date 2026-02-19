import type { IncomingMessage, ServerResponse } from "node:http";
import { type ResolvedGatewayAuth } from "./auth.js";
export declare function handleToolsInvokeHttpRequest(req: IncomingMessage, res: ServerResponse, opts: {
    auth: ResolvedGatewayAuth;
    maxBodyBytes?: number;
    trustedProxies?: string[];
}): Promise<boolean>;
