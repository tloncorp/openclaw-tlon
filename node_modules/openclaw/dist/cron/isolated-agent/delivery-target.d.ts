import type { ChannelId } from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";
import type { OutboundChannel } from "../../infra/outbound/targets.js";
export declare function resolveDeliveryTarget(cfg: OpenClawConfig, agentId: string, jobPayload: {
    channel?: "last" | ChannelId;
    to?: string;
}): Promise<{
    channel: Exclude<OutboundChannel, "none">;
    to?: string;
    accountId?: string;
    mode: "explicit" | "implicit";
    error?: Error;
}>;
