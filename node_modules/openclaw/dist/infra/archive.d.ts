export type ArchiveKind = "tar" | "zip";
export type ArchiveLogger = {
    info?: (message: string) => void;
    warn?: (message: string) => void;
};
export declare function resolveArchiveKind(filePath: string): ArchiveKind | null;
export declare function resolvePackedRootDir(extractDir: string): Promise<string>;
export declare function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T>;
export declare function extractArchive(params: {
    archivePath: string;
    destDir: string;
    timeoutMs: number;
    logger?: ArchiveLogger;
}): Promise<void>;
export declare function fileExists(filePath: string): Promise<boolean>;
export declare function readJsonFile<T>(filePath: string): Promise<T>;
