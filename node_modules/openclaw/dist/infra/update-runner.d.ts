import { type CommandOptions } from "../process/exec.js";
import { type UpdateChannel } from "./update-channels.js";
export type UpdateStepResult = {
    name: string;
    command: string;
    cwd: string;
    durationMs: number;
    exitCode: number | null;
    stdoutTail?: string | null;
    stderrTail?: string | null;
};
export type UpdateRunResult = {
    status: "ok" | "error" | "skipped";
    mode: "git" | "pnpm" | "bun" | "npm" | "unknown";
    root?: string;
    reason?: string;
    before?: {
        sha?: string | null;
        version?: string | null;
    };
    after?: {
        sha?: string | null;
        version?: string | null;
    };
    steps: UpdateStepResult[];
    durationMs: number;
};
type CommandRunner = (argv: string[], options: CommandOptions) => Promise<{
    stdout: string;
    stderr: string;
    code: number | null;
}>;
export type UpdateStepInfo = {
    name: string;
    command: string;
    index: number;
    total: number;
};
export type UpdateStepCompletion = UpdateStepInfo & {
    durationMs: number;
    exitCode: number | null;
    stderrTail?: string | null;
};
export type UpdateStepProgress = {
    onStepStart?: (step: UpdateStepInfo) => void;
    onStepComplete?: (step: UpdateStepCompletion) => void;
};
type UpdateRunnerOptions = {
    cwd?: string;
    argv1?: string;
    tag?: string;
    channel?: UpdateChannel;
    timeoutMs?: number;
    runCommand?: CommandRunner;
    progress?: UpdateStepProgress;
};
export declare function runGatewayUpdate(opts?: UpdateRunnerOptions): Promise<UpdateRunResult>;
export {};
