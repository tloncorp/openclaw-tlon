import type { RequestClient } from "@buape/carbon";
import type { RetryConfig } from "../infra/retry.js";
import type { PollInput } from "../polls.js";
import type { DiscordSendResult } from "./send.types.js";
type DiscordSendOpts = {
    token?: string;
    accountId?: string;
    mediaUrl?: string;
    verbose?: boolean;
    rest?: RequestClient;
    replyTo?: string;
    retry?: RetryConfig;
    embeds?: unknown[];
};
export declare function sendMessageDiscord(to: string, text: string, opts?: DiscordSendOpts): Promise<DiscordSendResult>;
export declare function sendStickerDiscord(to: string, stickerIds: string[], opts?: DiscordSendOpts & {
    content?: string;
}): Promise<DiscordSendResult>;
export declare function sendPollDiscord(to: string, poll: PollInput, opts?: DiscordSendOpts & {
    content?: string;
}): Promise<DiscordSendResult>;
export {};
