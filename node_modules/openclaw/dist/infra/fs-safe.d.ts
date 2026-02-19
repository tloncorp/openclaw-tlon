import type { Stats } from "node:fs";
import type { FileHandle } from "node:fs/promises";
export type SafeOpenErrorCode = "invalid-path" | "not-found";
export declare class SafeOpenError extends Error {
    code: SafeOpenErrorCode;
    constructor(code: SafeOpenErrorCode, message: string);
}
export type SafeOpenResult = {
    handle: FileHandle;
    realPath: string;
    stat: Stats;
};
export declare function openFileWithinRoot(params: {
    rootDir: string;
    relativePath: string;
}): Promise<SafeOpenResult>;
