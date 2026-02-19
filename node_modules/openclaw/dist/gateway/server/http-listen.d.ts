import type { Server as HttpServer } from "node:http";
export declare function listenGatewayHttpServer(params: {
    httpServer: HttpServer;
    bindHost: string;
    port: number;
}): Promise<void>;
