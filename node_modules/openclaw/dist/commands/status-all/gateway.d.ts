export declare function readFileTailLines(filePath: string, maxLines: number): Promise<string[]>;
export declare function summarizeLogTail(rawLines: string[], opts?: {
    maxLines?: number;
}): string[];
export declare function pickGatewaySelfPresence(presence: unknown): {
    host?: string;
    ip?: string;
    version?: string;
    platform?: string;
} | null;
