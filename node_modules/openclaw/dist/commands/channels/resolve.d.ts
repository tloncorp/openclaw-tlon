import type { RuntimeEnv } from "../../runtime.js";
export type ChannelsResolveOptions = {
    channel?: string;
    account?: string;
    kind?: "auto" | "user" | "group" | "channel";
    json?: boolean;
    entries?: string[];
};
export declare function channelsResolveCommand(opts: ChannelsResolveOptions, runtime: RuntimeEnv): Promise<void>;
