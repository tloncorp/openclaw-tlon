import type { ChannelId, ChannelMessageActionName } from "../channels/plugins/types.js";
import type { MessageActionRunResult } from "../infra/outbound/message-action-runner.js";
export type MessageCliJsonEnvelope = {
    action: ChannelMessageActionName;
    channel: ChannelId;
    dryRun: boolean;
    handledBy: "plugin" | "core" | "dry-run";
    payload: unknown;
};
export declare function buildMessageCliJson(result: MessageActionRunResult): MessageCliJsonEnvelope;
export declare function formatMessageCliText(result: MessageActionRunResult): string[];
