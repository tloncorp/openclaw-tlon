export type SessionFileEntry = {
    path: string;
    absPath: string;
    mtimeMs: number;
    size: number;
    hash: string;
    content: string;
};
export declare function listSessionFilesForAgent(agentId: string): Promise<string[]>;
export declare function sessionPathForFile(absPath: string): string;
export declare function extractSessionText(content: unknown): string | null;
export declare function buildSessionEntry(absPath: string): Promise<SessionFileEntry | null>;
