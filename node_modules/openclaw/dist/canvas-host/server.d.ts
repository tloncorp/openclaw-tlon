import type { Duplex } from "node:stream";
import { type IncomingMessage, type ServerResponse } from "node:http";
import type { RuntimeEnv } from "../runtime.js";
export type CanvasHostOpts = {
    runtime: RuntimeEnv;
    rootDir?: string;
    port?: number;
    listenHost?: string;
    allowInTests?: boolean;
    liveReload?: boolean;
};
export type CanvasHostServerOpts = CanvasHostOpts & {
    handler?: CanvasHostHandler;
    ownsHandler?: boolean;
};
export type CanvasHostServer = {
    port: number;
    rootDir: string;
    close: () => Promise<void>;
};
export type CanvasHostHandlerOpts = {
    runtime: RuntimeEnv;
    rootDir?: string;
    basePath?: string;
    allowInTests?: boolean;
    liveReload?: boolean;
};
export type CanvasHostHandler = {
    rootDir: string;
    basePath: string;
    handleHttpRequest: (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;
    handleUpgrade: (req: IncomingMessage, socket: Duplex, head: Buffer) => boolean;
    close: () => Promise<void>;
};
export declare function createCanvasHostHandler(opts: CanvasHostHandlerOpts): Promise<CanvasHostHandler>;
export declare function startCanvasHost(opts: CanvasHostServerOpts): Promise<CanvasHostServer>;
