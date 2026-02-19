import { type RuntimeEnv } from "../../runtime.js";
export type ChannelsStatusOptions = {
    json?: boolean;
    probe?: boolean;
    timeout?: string;
};
export declare function formatGatewayChannelsStatusLines(payload: Record<string, unknown>): string[];
export declare function channelsStatusCommand(opts: ChannelsStatusOptions, runtime?: RuntimeEnv): Promise<void>;
