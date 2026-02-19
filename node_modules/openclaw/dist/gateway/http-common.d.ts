import type { IncomingMessage, ServerResponse } from "node:http";
export declare function sendJson(res: ServerResponse, status: number, body: unknown): void;
export declare function sendText(res: ServerResponse, status: number, body: string): void;
export declare function sendMethodNotAllowed(res: ServerResponse, allow?: string): void;
export declare function sendUnauthorized(res: ServerResponse): void;
export declare function sendInvalidRequest(res: ServerResponse, message: string): void;
export declare function readJsonBodyOrError(req: IncomingMessage, res: ServerResponse, maxBytes: number): Promise<unknown>;
export declare function writeDone(res: ServerResponse): void;
export declare function setSseHeaders(res: ServerResponse): void;
