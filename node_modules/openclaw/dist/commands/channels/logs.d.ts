import { type RuntimeEnv } from "../../runtime.js";
export type ChannelsLogsOptions = {
    channel?: string;
    lines?: string | number;
    json?: boolean;
};
export declare function channelsLogsCommand(opts: ChannelsLogsOptions, runtime?: RuntimeEnv): Promise<void>;
