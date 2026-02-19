import { type RuntimeEnv } from "../../runtime.js";
export type ChannelsCapabilitiesOptions = {
    channel?: string;
    account?: string;
    target?: string;
    timeout?: string;
    json?: boolean;
};
export declare function channelsCapabilitiesCommand(opts: ChannelsCapabilitiesOptions, runtime?: RuntimeEnv): Promise<void>;
