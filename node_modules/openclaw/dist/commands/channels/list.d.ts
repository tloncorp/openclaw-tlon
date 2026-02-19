import { type RuntimeEnv } from "../../runtime.js";
export type ChannelsListOptions = {
    json?: boolean;
    usage?: boolean;
};
export declare function channelsListCommand(opts: ChannelsListOptions, runtime?: RuntimeEnv): Promise<void>;
