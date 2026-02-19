/**
 * OpenResponses HTTP Handler
 *
 * Implements the OpenResponses `/v1/responses` endpoint for OpenClaw Gateway.
 *
 * @see https://www.open-responses.com/
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import type { GatewayHttpResponsesConfig } from "../config/types.gateway.js";
import { type ResolvedGatewayAuth } from "./auth.js";
import { type ItemParam } from "./open-responses.schema.js";
type OpenResponsesHttpOptions = {
    auth: ResolvedGatewayAuth;
    maxBodyBytes?: number;
    config?: GatewayHttpResponsesConfig;
    trustedProxies?: string[];
};
export declare function buildAgentPrompt(input: string | ItemParam[]): {
    message: string;
    extraSystemPrompt?: string;
};
export declare function handleOpenResponsesHttpRequest(req: IncomingMessage, res: ServerResponse, opts: OpenResponsesHttpOptions): Promise<boolean>;
export {};
