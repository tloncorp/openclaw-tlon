import type { RuntimeEnv } from "../runtime.js";
export type IMessageProbe = {
    ok: boolean;
    error?: string | null;
    fatal?: boolean;
};
export type IMessageProbeOptions = {
    cliPath?: string;
    dbPath?: string;
    runtime?: RuntimeEnv;
};
export declare function probeIMessage(timeoutMs?: number, opts?: IMessageProbeOptions): Promise<IMessageProbe>;
