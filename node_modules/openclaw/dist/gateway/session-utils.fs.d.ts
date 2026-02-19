import type { SessionPreviewItem } from "./session-utils.types.js";
export declare function readSessionMessages(sessionId: string, storePath: string | undefined, sessionFile?: string): unknown[];
export declare function resolveSessionTranscriptCandidates(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): string[];
export declare function archiveFileOnDisk(filePath: string, reason: string): string;
export declare function capArrayByJsonBytes<T>(items: T[], maxBytes: number): {
    items: T[];
    bytes: number;
};
export declare function readFirstUserMessageFromTranscript(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): string | null;
export declare function readLastMessagePreviewFromTranscript(sessionId: string, storePath: string | undefined, sessionFile?: string, agentId?: string): string | null;
export declare function readSessionPreviewItemsFromTranscript(sessionId: string, storePath: string | undefined, sessionFile: string | undefined, agentId: string | undefined, maxItems: number, maxChars: number): SessionPreviewItem[];
