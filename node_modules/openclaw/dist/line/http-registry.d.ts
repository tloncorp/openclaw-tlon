import type { IncomingMessage, ServerResponse } from "node:http";
export type LineHttpRequestHandler = (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;
type RegisterLineHttpHandlerArgs = {
    path?: string | null;
    handler: LineHttpRequestHandler;
    log?: (message: string) => void;
    accountId?: string;
};
export declare function normalizeLineWebhookPath(path?: string | null): string;
export declare function registerLineHttpHandler(params: RegisterLineHttpHandlerArgs): () => void;
export declare function handleLineHttpRequest(req: IncomingMessage, res: ServerResponse): Promise<boolean>;
export {};
