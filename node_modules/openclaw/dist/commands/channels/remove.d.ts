import { type RuntimeEnv } from "../../runtime.js";
export type ChannelsRemoveOptions = {
    channel?: string;
    account?: string;
    delete?: boolean;
};
export declare function channelsRemoveCommand(opts: ChannelsRemoveOptions, runtime?: RuntimeEnv, params?: {
    hasFlags?: boolean;
}): Promise<void>;
