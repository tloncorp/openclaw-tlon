type EnsureOpenClawPathOpts = {
    execPath?: string;
    cwd?: string;
    homeDir?: string;
    platform?: NodeJS.Platform;
    pathEnv?: string;
};
/**
 * Best-effort PATH bootstrap so skills that require the `openclaw` CLI can run
 * under launchd/minimal environments (and inside the macOS app bundle).
 */
export declare function ensureOpenClawCliOnPath(opts?: EnsureOpenClawPathOpts): void;
export {};
