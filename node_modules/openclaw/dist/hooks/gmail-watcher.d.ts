/**
 * Gmail Watcher Service
 *
 * Automatically starts `gog gmail watch serve` when the gateway starts,
 * if hooks.gmail is configured with an account.
 */
import type { OpenClawConfig } from "../config/config.js";
export declare function isAddressInUseError(line: string): boolean;
export type GmailWatcherStartResult = {
    started: boolean;
    reason?: string;
};
/**
 * Start the Gmail watcher service.
 * Called automatically by the gateway if hooks.gmail is configured.
 */
export declare function startGmailWatcher(cfg: OpenClawConfig): Promise<GmailWatcherStartResult>;
/**
 * Stop the Gmail watcher service.
 */
export declare function stopGmailWatcher(): Promise<void>;
/**
 * Check if the Gmail watcher is running.
 */
export declare function isGmailWatcherRunning(): boolean;
