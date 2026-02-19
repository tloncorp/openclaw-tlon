import type { HealthSummary } from "../commands/health.js";
import type { ChatRunEntry } from "./server-chat.js";
import type { DedupeEntry } from "./server-shared.js";
import { type ChatAbortControllerEntry } from "./chat-abort.js";
export declare function startGatewayMaintenanceTimers(params: {
    broadcast: (event: string, payload: unknown, opts?: {
        dropIfSlow?: boolean;
        stateVersion?: {
            presence?: number;
            health?: number;
        };
    }) => void;
    nodeSendToAllSubscribed: (event: string, payload: unknown) => void;
    getPresenceVersion: () => number;
    getHealthVersion: () => number;
    refreshGatewayHealthSnapshot: (opts?: {
        probe?: boolean;
    }) => Promise<HealthSummary>;
    logHealth: {
        error: (msg: string) => void;
    };
    dedupe: Map<string, DedupeEntry>;
    chatAbortControllers: Map<string, ChatAbortControllerEntry>;
    chatRunState: {
        abortedRuns: Map<string, number>;
    };
    chatRunBuffers: Map<string, string>;
    chatDeltaSentAt: Map<string, number>;
    removeChatRun: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
    agentRunSeq: Map<string, number>;
    nodeSendToSession: (sessionKey: string, event: string, payload: unknown) => void;
}): {
    tickInterval: ReturnType<typeof setInterval>;
    healthInterval: ReturnType<typeof setInterval>;
    dedupeCleanup: ReturnType<typeof setInterval>;
};
