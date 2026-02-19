import type { TUI } from "@mariozechner/pi-tui";
import type { ChatLog } from "./components/chat-log.js";
import type { TuiStateAccess } from "./tui-types.js";
type EventHandlerContext = {
    chatLog: ChatLog;
    tui: TUI;
    state: TuiStateAccess;
    setActivityStatus: (text: string) => void;
    refreshSessionInfo?: () => Promise<void>;
};
export declare function createEventHandlers(context: EventHandlerContext): {
    handleChatEvent: (payload: unknown) => void;
    handleAgentEvent: (payload: unknown) => void;
};
export {};
