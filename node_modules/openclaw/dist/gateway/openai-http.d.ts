import type { IncomingMessage, ServerResponse } from "node:http";
import { type ResolvedGatewayAuth } from "./auth.js";
type OpenAiHttpOptions = {
    auth: ResolvedGatewayAuth;
    maxBodyBytes?: number;
    trustedProxies?: string[];
};
export declare function handleOpenAiHttpRequest(req: IncomingMessage, res: ServerResponse, opts: OpenAiHttpOptions): Promise<boolean>;
export {};
