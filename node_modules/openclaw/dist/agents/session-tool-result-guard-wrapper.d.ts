import type { SessionManager } from "@mariozechner/pi-coding-agent";
export type GuardedSessionManager = SessionManager & {
    /** Flush any synthetic tool results for pending tool calls. Idempotent. */
    flushPendingToolResults?: () => void;
};
/**
 * Apply the tool-result guard to a SessionManager exactly once and expose
 * a flush method on the instance for easy teardown handling.
 */
export declare function guardSessionManager(sessionManager: SessionManager, opts?: {
    agentId?: string;
    sessionKey?: string;
    allowSyntheticToolResults?: boolean;
}): GuardedSessionManager;
