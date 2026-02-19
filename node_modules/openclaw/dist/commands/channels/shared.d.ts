import { type ChannelId } from "../../channels/plugins/index.js";
import { type OpenClawConfig } from "../../config/config.js";
import { type RuntimeEnv } from "../../runtime.js";
export type ChatChannel = ChannelId;
export declare function requireValidConfig(runtime?: RuntimeEnv): Promise<OpenClawConfig | null>;
export declare function formatAccountLabel(params: {
    accountId: string;
    name?: string;
}): string;
export declare const channelLabel: (channel: ChatChannel) => string;
export declare function formatChannelAccountLabel(params: {
    channel: ChatChannel;
    accountId: string;
    name?: string;
    channelStyle?: (value: string) => string;
    accountStyle?: (value: string) => string;
}): string;
export declare function shouldUseWizard(params?: {
    hasFlags?: boolean;
}): boolean;
