import { type RuntimeEnv } from "../runtime.js";
type ChannelAuthOptions = {
    channel?: string;
    account?: string;
    verbose?: boolean;
};
export declare function runChannelLogin(opts: ChannelAuthOptions, runtime?: RuntimeEnv): Promise<void>;
export declare function runChannelLogout(opts: ChannelAuthOptions, runtime?: RuntimeEnv): Promise<void>;
export {};
