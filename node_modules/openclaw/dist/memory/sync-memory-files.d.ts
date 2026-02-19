import type { DatabaseSync } from "node:sqlite";
import { type MemoryFileEntry } from "./internal.js";
type ProgressState = {
    completed: number;
    total: number;
    label?: string;
    report: (update: {
        completed: number;
        total: number;
        label?: string;
    }) => void;
};
export declare function syncMemoryFiles(params: {
    workspaceDir: string;
    extraPaths?: string[];
    db: DatabaseSync;
    needsFullReindex: boolean;
    progress?: ProgressState;
    batchEnabled: boolean;
    concurrency: number;
    runWithConcurrency: <T>(tasks: Array<() => Promise<T>>, concurrency: number) => Promise<T[]>;
    indexFile: (entry: MemoryFileEntry) => Promise<void>;
    vectorTable: string;
    ftsTable: string;
    ftsEnabled: boolean;
    ftsAvailable: boolean;
    model: string;
}): Promise<void>;
export {};
