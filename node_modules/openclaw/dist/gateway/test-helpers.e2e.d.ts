import { type GatewayClientMode, type GatewayClientName } from "../utils/message-channel.js";
import { GatewayClient } from "./client.js";
export declare function getFreeGatewayPort(): Promise<number>;
export declare function connectGatewayClient(params: {
    url: string;
    token?: string;
    clientName?: GatewayClientName;
    clientDisplayName?: string;
    clientVersion?: string;
    mode?: GatewayClientMode;
}): Promise<GatewayClient>;
export declare function connectDeviceAuthReq(params: {
    url: string;
    token?: string;
}): Promise<{
    type: "res";
    id: string;
    ok: boolean;
    error?: {
        message?: string;
    };
}>;
