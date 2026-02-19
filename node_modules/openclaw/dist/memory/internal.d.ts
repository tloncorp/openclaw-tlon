export type MemoryFileEntry = {
    path: string;
    absPath: string;
    mtimeMs: number;
    size: number;
    hash: string;
};
export type MemoryChunk = {
    startLine: number;
    endLine: number;
    text: string;
    hash: string;
};
export declare function ensureDir(dir: string): string;
export declare function normalizeRelPath(value: string): string;
export declare function normalizeExtraMemoryPaths(workspaceDir: string, extraPaths?: string[]): string[];
export declare function isMemoryPath(relPath: string): boolean;
export declare function listMemoryFiles(workspaceDir: string, extraPaths?: string[]): Promise<string[]>;
export declare function hashText(value: string): string;
export declare function buildFileEntry(absPath: string, workspaceDir: string): Promise<MemoryFileEntry>;
export declare function chunkMarkdown(content: string, chunking: {
    tokens: number;
    overlap: number;
}): MemoryChunk[];
export declare function parseEmbedding(raw: string): number[];
export declare function cosineSimilarity(a: number[], b: number[]): number;
