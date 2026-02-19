import type { Guild, Message, User } from "@buape/carbon";
import { type EnvelopeFormatOptions } from "../../auto-reply/envelope.js";
export declare function resolveReplyContext(message: Message, resolveDiscordMessageText: (message: Message, options?: {
    includeForwarded?: boolean;
}) => string, options?: {
    envelope?: EnvelopeFormatOptions;
}): string | null;
export declare function buildDirectLabel(author: User, tagOverride?: string): string;
export declare function buildGuildLabel(params: {
    guild?: Guild;
    channelName: string;
    channelId: string;
}): string;
