type NodeHostRunOptions = {
    gatewayHost: string;
    gatewayPort: number;
    gatewayTls?: boolean;
    gatewayTlsFingerprint?: string;
    nodeId?: string;
    displayName?: string;
};
type NodeInvokeRequestPayload = {
    id: string;
    nodeId: string;
    command: string;
    paramsJSON?: string | null;
    timeoutMs?: number | null;
    idempotencyKey?: string | null;
};
export declare function runNodeHost(opts: NodeHostRunOptions): Promise<void>;
export declare function buildNodeInvokeResultParams(frame: NodeInvokeRequestPayload, result: {
    ok: boolean;
    payload?: unknown;
    payloadJSON?: string | null;
    error?: {
        code?: string;
        message?: string;
    } | null;
}): {
    id: string;
    nodeId: string;
    ok: boolean;
    payload?: unknown;
    payloadJSON?: string;
    error?: {
        code?: string;
        message?: string;
    };
};
export {};
