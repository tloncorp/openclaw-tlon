import { type AgentEventPayload } from "../infra/agent-events.js";
export type ChatRunEntry = {
    sessionKey: string;
    clientRunId: string;
};
export type ChatRunRegistry = {
    add: (sessionId: string, entry: ChatRunEntry) => void;
    peek: (sessionId: string) => ChatRunEntry | undefined;
    shift: (sessionId: string) => ChatRunEntry | undefined;
    remove: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
    clear: () => void;
};
export declare function createChatRunRegistry(): ChatRunRegistry;
export type ChatRunState = {
    registry: ChatRunRegistry;
    buffers: Map<string, string>;
    deltaSentAt: Map<string, number>;
    abortedRuns: Map<string, number>;
    clear: () => void;
};
export declare function createChatRunState(): ChatRunState;
export type ChatEventBroadcast = (event: string, payload: unknown, opts?: {
    dropIfSlow?: boolean;
}) => void;
export type NodeSendToSession = (sessionKey: string, event: string, payload: unknown) => void;
export type AgentEventHandlerOptions = {
    broadcast: ChatEventBroadcast;
    nodeSendToSession: NodeSendToSession;
    agentRunSeq: Map<string, number>;
    chatRunState: ChatRunState;
    resolveSessionKeyForRun: (runId: string) => string | undefined;
    clearAgentRunContext: (runId: string) => void;
};
export declare function createAgentEventHandler({ broadcast, nodeSendToSession, agentRunSeq, chatRunState, resolveSessionKeyForRun, clearAgentRunContext, }: AgentEventHandlerOptions): (evt: AgentEventPayload) => void;
