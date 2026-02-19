import type { AcpSession } from "./types.js";
export type AcpSessionStore = {
    createSession: (params: {
        sessionKey: string;
        cwd: string;
        sessionId?: string;
    }) => AcpSession;
    getSession: (sessionId: string) => AcpSession | undefined;
    getSessionByRunId: (runId: string) => AcpSession | undefined;
    setActiveRun: (sessionId: string, runId: string, abortController: AbortController) => void;
    clearActiveRun: (sessionId: string) => void;
    cancelActiveRun: (sessionId: string) => boolean;
    clearAllSessionsForTest: () => void;
};
export declare function createInMemorySessionStore(): AcpSessionStore;
export declare const defaultAcpSessionStore: AcpSessionStore;
