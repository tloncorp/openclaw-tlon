import { type RuntimeEnv } from "../runtime.js";
export declare function resolveControlUiRepoRoot(argv1?: string | undefined): string | null;
export declare function resolveControlUiDistIndexPath(argv1?: string | undefined): Promise<string | null>;
export type EnsureControlUiAssetsResult = {
    ok: boolean;
    built: boolean;
    message?: string;
};
export declare function ensureControlUiAssetsBuilt(runtime?: RuntimeEnv, opts?: {
    timeoutMs?: number;
}): Promise<EnsureControlUiAssetsResult>;
