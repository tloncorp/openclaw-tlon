import type { TUI } from "@mariozechner/pi-tui";
import type { ChatLog } from "./components/chat-log.js";
import type { GatewayAgentsList, GatewayChatClient } from "./gateway-chat.js";
import type { TuiOptions, TuiStateAccess } from "./tui-types.js";
type SessionActionContext = {
    client: GatewayChatClient;
    chatLog: ChatLog;
    tui: TUI;
    opts: TuiOptions;
    state: TuiStateAccess;
    agentNames: Map<string, string>;
    initialSessionInput: string;
    initialSessionAgentId: string | null;
    resolveSessionKey: (raw?: string) => string;
    updateHeader: () => void;
    updateFooter: () => void;
    updateAutocompleteProvider: () => void;
    setActivityStatus: (text: string) => void;
};
export declare function createSessionActions(context: SessionActionContext): {
    applyAgentsResult: (result: GatewayAgentsList) => void;
    refreshAgents: () => Promise<void>;
    refreshSessionInfo: () => Promise<void>;
    loadHistory: () => Promise<void>;
    setSession: (rawKey: string) => Promise<void>;
    abortActive: () => Promise<void>;
};
export {};
