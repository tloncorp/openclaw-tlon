type UpdateFileChunk = {
    changeContext?: string;
    oldLines: string[];
    newLines: string[];
    isEndOfFile: boolean;
};
export declare function applyUpdateHunk(filePath: string, chunks: UpdateFileChunk[]): Promise<string>;
export {};
