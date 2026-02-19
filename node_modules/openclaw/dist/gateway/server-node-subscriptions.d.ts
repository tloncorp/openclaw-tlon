export type NodeSendEventFn = (opts: {
    nodeId: string;
    event: string;
    payloadJSON?: string | null;
}) => void;
export type NodeListConnectedFn = () => Array<{
    nodeId: string;
}>;
export type NodeSubscriptionManager = {
    subscribe: (nodeId: string, sessionKey: string) => void;
    unsubscribe: (nodeId: string, sessionKey: string) => void;
    unsubscribeAll: (nodeId: string) => void;
    sendToSession: (sessionKey: string, event: string, payload: unknown, sendEvent?: NodeSendEventFn | null) => void;
    sendToAllSubscribed: (event: string, payload: unknown, sendEvent?: NodeSendEventFn | null) => void;
    sendToAllConnected: (event: string, payload: unknown, listConnected?: NodeListConnectedFn | null, sendEvent?: NodeSendEventFn | null) => void;
    clear: () => void;
};
export declare function createNodeSubscriptionManager(): NodeSubscriptionManager;
