import { type HelloOk, type SessionsListParams, type SessionsPatchParams } from "../gateway/protocol/index.js";
export type GatewayConnectionOptions = {
    url?: string;
    token?: string;
    password?: string;
};
export type ChatSendOptions = {
    sessionKey: string;
    message: string;
    thinking?: string;
    deliver?: boolean;
    timeoutMs?: number;
};
export type GatewayEvent = {
    event: string;
    payload?: unknown;
    seq?: number;
};
export type GatewaySessionList = {
    ts: number;
    path: string;
    count: number;
    defaults?: {
        model?: string | null;
        modelProvider?: string | null;
        contextTokens?: number | null;
    };
    sessions: Array<{
        key: string;
        sessionId?: string;
        updatedAt?: number | null;
        thinkingLevel?: string;
        verboseLevel?: string;
        reasoningLevel?: string;
        sendPolicy?: string;
        model?: string;
        contextTokens?: number | null;
        inputTokens?: number | null;
        outputTokens?: number | null;
        totalTokens?: number | null;
        responseUsage?: "on" | "off" | "tokens" | "full";
        modelProvider?: string;
        label?: string;
        displayName?: string;
        provider?: string;
        groupChannel?: string;
        space?: string;
        subject?: string;
        chatType?: string;
        lastProvider?: string;
        lastTo?: string;
        lastAccountId?: string;
        derivedTitle?: string;
        lastMessagePreview?: string;
    }>;
};
export type GatewayAgentsList = {
    defaultId: string;
    mainKey: string;
    scope: "per-sender" | "global";
    agents: Array<{
        id: string;
        name?: string;
    }>;
};
export type GatewayModelChoice = {
    id: string;
    name: string;
    provider: string;
    contextWindow?: number;
    reasoning?: boolean;
};
export declare class GatewayChatClient {
    private client;
    private readyPromise;
    private resolveReady?;
    readonly connection: {
        url: string;
        token?: string;
        password?: string;
    };
    hello?: HelloOk;
    onEvent?: (evt: GatewayEvent) => void;
    onConnected?: () => void;
    onDisconnected?: (reason: string) => void;
    onGap?: (info: {
        expected: number;
        received: number;
    }) => void;
    constructor(opts: GatewayConnectionOptions);
    start(): void;
    stop(): void;
    waitForReady(): Promise<void>;
    sendChat(opts: ChatSendOptions): Promise<{
        runId: string;
    }>;
    abortChat(opts: {
        sessionKey: string;
        runId: string;
    }): Promise<{
        ok: boolean;
        aborted: boolean;
    }>;
    loadHistory(opts: {
        sessionKey: string;
        limit?: number;
    }): Promise<Record<string, unknown>>;
    listSessions(opts?: SessionsListParams): Promise<GatewaySessionList>;
    listAgents(): Promise<GatewayAgentsList>;
    patchSession(opts: SessionsPatchParams): Promise<Record<string, unknown>>;
    resetSession(key: string): Promise<Record<string, unknown>>;
    getStatus(): Promise<Record<string, unknown>>;
    listModels(): Promise<GatewayModelChoice[]>;
}
export declare function resolveGatewayConnection(opts: GatewayConnectionOptions): {
    url: string;
    token: string | undefined;
    password: string | undefined;
};
