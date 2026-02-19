import type { GatewayWsClient } from "./server/ws-types.js";
export declare function createGatewayBroadcaster(params: {
    clients: Set<GatewayWsClient>;
}): {
    broadcast: (event: string, payload: unknown, opts?: {
        dropIfSlow?: boolean;
        stateVersion?: {
            presence?: number;
            health?: number;
        };
    }) => void;
};
