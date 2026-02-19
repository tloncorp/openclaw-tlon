import type { Agent, AgentSideConnection, AuthenticateRequest, AuthenticateResponse, CancelNotification, InitializeRequest, InitializeResponse, ListSessionsRequest, ListSessionsResponse, LoadSessionRequest, LoadSessionResponse, NewSessionRequest, NewSessionResponse, PromptRequest, PromptResponse, SetSessionModeRequest, SetSessionModeResponse } from "@agentclientprotocol/sdk";
import type { GatewayClient } from "../gateway/client.js";
import type { EventFrame } from "../gateway/protocol/index.js";
import { type AcpSessionStore } from "./session.js";
import { type AcpServerOptions } from "./types.js";
type AcpGatewayAgentOptions = AcpServerOptions & {
    sessionStore?: AcpSessionStore;
};
export declare class AcpGatewayAgent implements Agent {
    private connection;
    private gateway;
    private opts;
    private log;
    private sessionStore;
    private pendingPrompts;
    constructor(connection: AgentSideConnection, gateway: GatewayClient, opts?: AcpGatewayAgentOptions);
    start(): void;
    handleGatewayReconnect(): void;
    handleGatewayDisconnect(reason: string): void;
    handleGatewayEvent(evt: EventFrame): Promise<void>;
    initialize(_params: InitializeRequest): Promise<InitializeResponse>;
    newSession(params: NewSessionRequest): Promise<NewSessionResponse>;
    loadSession(params: LoadSessionRequest): Promise<LoadSessionResponse>;
    unstable_listSessions(params: ListSessionsRequest): Promise<ListSessionsResponse>;
    authenticate(_params: AuthenticateRequest): Promise<AuthenticateResponse>;
    setSessionMode(params: SetSessionModeRequest): Promise<SetSessionModeResponse>;
    prompt(params: PromptRequest): Promise<PromptResponse>;
    cancel(params: CancelNotification): Promise<void>;
    private handleAgentEvent;
    private handleChatEvent;
    private handleDeltaEvent;
    private finishPrompt;
    private findPendingBySessionKey;
    private sendAvailableCommands;
}
export {};
