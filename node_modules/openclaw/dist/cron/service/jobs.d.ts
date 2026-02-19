import type { CronJob, CronJobCreate, CronJobPatch } from "../types.js";
import type { CronServiceState } from "./state.js";
export declare function assertSupportedJobSpec(job: Pick<CronJob, "sessionTarget" | "payload">): void;
export declare function findJobOrThrow(state: CronServiceState, id: string): CronJob;
export declare function computeJobNextRunAtMs(job: CronJob, nowMs: number): number | undefined;
export declare function recomputeNextRuns(state: CronServiceState): void;
export declare function nextWakeAtMs(state: CronServiceState): number | undefined;
export declare function createJob(state: CronServiceState, input: CronJobCreate): CronJob;
export declare function applyJobPatch(job: CronJob, patch: CronJobPatch): void;
export declare function isJobDue(job: CronJob, nowMs: number, opts: {
    forced: boolean;
}): boolean;
export declare function resolveJobPayloadTextForMain(job: CronJob): string | undefined;
