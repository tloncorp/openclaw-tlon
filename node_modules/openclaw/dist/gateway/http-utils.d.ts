import type { IncomingMessage } from "node:http";
export declare function getHeader(req: IncomingMessage, name: string): string | undefined;
export declare function getBearerToken(req: IncomingMessage): string | undefined;
export declare function resolveAgentIdFromHeader(req: IncomingMessage): string | undefined;
export declare function resolveAgentIdFromModel(model: string | undefined): string | undefined;
export declare function resolveAgentIdForRequest(params: {
    req: IncomingMessage;
    model: string | undefined;
}): string;
export declare function resolveSessionKey(params: {
    req: IncomingMessage;
    agentId: string;
    user?: string | undefined;
    prefix: string;
}): string;
