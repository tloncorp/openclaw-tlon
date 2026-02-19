import { type RuntimeEnv } from "../runtime.js";
export type HostedMedia = {
    url: string;
    id: string;
    size: number;
};
export declare function ensureMediaHosted(source: string, opts?: {
    port?: number;
    startServer?: boolean;
    runtime?: RuntimeEnv;
}): Promise<HostedMedia>;
