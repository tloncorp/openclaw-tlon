import type { ChannelPlugin } from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";
import type { GatewayRequestContext, GatewayRequestHandlers } from "./types.js";
import { type ChannelId } from "../../channels/plugins/index.js";
type ChannelLogoutPayload = {
    channel: ChannelId;
    accountId: string;
    cleared: boolean;
    [key: string]: unknown;
};
export declare function logoutChannelAccount(params: {
    channelId: ChannelId;
    accountId?: string | null;
    cfg: OpenClawConfig;
    context: GatewayRequestContext;
    plugin: ChannelPlugin;
}): Promise<ChannelLogoutPayload>;
export declare const channelsHandlers: GatewayRequestHandlers;
export {};
