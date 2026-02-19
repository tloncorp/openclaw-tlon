import type { SessionEntry } from "./types.js";
export declare function resolveSessionTranscriptsDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
export declare function resolveSessionTranscriptsDirForAgent(agentId?: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
export declare function resolveDefaultSessionStorePath(agentId?: string): string;
export declare function resolveSessionTranscriptPath(sessionId: string, agentId?: string, topicId?: string | number): string;
export declare function resolveSessionFilePath(sessionId: string, entry?: SessionEntry, opts?: {
    agentId?: string;
}): string;
export declare function resolveStorePath(store?: string, opts?: {
    agentId?: string;
}): string;
