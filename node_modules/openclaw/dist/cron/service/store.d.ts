import type { CronServiceState } from "./state.js";
export declare function ensureLoaded(state: CronServiceState): Promise<void>;
export declare function warnIfDisabled(state: CronServiceState, action: string): void;
export declare function persist(state: CronServiceState): Promise<void>;
