import type { DatabaseSync } from "node:sqlite";
import type { SessionFileEntry } from "./session-files.js";
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
export declare function syncSessionFiles(params: {
    agentId: string;
    db: DatabaseSync;
    needsFullReindex: boolean;
    progress?: ProgressState;
    batchEnabled: boolean;
    concurrency: number;
    runWithConcurrency: <T>(tasks: Array<() => Promise<T>>, concurrency: number) => Promise<T[]>;
    indexFile: (entry: SessionFileEntry) => Promise<void>;
    vectorTable: string;
    ftsTable: string;
    ftsEnabled: boolean;
    ftsAvailable: boolean;
    model: string;
    dirtyFiles: Set<string>;
}): Promise<void>;
export {};
