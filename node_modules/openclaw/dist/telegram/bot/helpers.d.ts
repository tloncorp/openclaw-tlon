import type { TelegramMessage, TelegramStreamMode } from "./types.js";
import { type NormalizedLocation } from "../../channels/location.js";
export type TelegramThreadSpec = {
    id?: number;
    scope: "dm" | "forum" | "none";
};
/**
 * Resolve the thread ID for Telegram forum topics.
 * For non-forum groups, returns undefined even if messageThreadId is present
 * (reply threads in regular groups should not create separate sessions).
 * For forum groups, returns the topic ID (or General topic ID=1 if unspecified).
 */
export declare function resolveTelegramForumThreadId(params: {
    isForum?: boolean;
    messageThreadId?: number | null;
}): number | undefined;
export declare function resolveTelegramThreadSpec(params: {
    isGroup: boolean;
    isForum?: boolean;
    messageThreadId?: number | null;
}): TelegramThreadSpec;
/**
 * Build thread params for Telegram API calls (messages, media).
 * General forum topic (id=1) must be treated like a regular supergroup send:
 * Telegram rejects sendMessage/sendMedia with message_thread_id=1 ("thread not found").
 */
export declare function buildTelegramThreadParams(thread?: TelegramThreadSpec | null): {
    message_thread_id: number;
} | undefined;
/**
 * Build thread params for typing indicators (sendChatAction).
 * Empirically, General topic (id=1) needs message_thread_id for typing to appear.
 */
export declare function buildTypingThreadParams(messageThreadId?: number): {
    message_thread_id: number;
} | undefined;
export declare function resolveTelegramStreamMode(telegramCfg?: {
    streamMode?: TelegramStreamMode;
}): TelegramStreamMode;
export declare function buildTelegramGroupPeerId(chatId: number | string, messageThreadId?: number): string;
export declare function buildTelegramGroupFrom(chatId: number | string, messageThreadId?: number): string;
export declare function buildSenderName(msg: TelegramMessage): string | undefined;
export declare function buildSenderLabel(msg: TelegramMessage, senderId?: number | string): string;
export declare function buildGroupLabel(msg: TelegramMessage, chatId: number | string, messageThreadId?: number): string;
export declare function hasBotMention(msg: TelegramMessage, botUsername: string): boolean;
type TelegramTextLinkEntity = {
    type: string;
    offset: number;
    length: number;
    url?: string;
};
export declare function expandTextLinks(text: string, entities?: TelegramTextLinkEntity[] | null): string;
export declare function resolveTelegramReplyId(raw?: string): number | undefined;
export type TelegramReplyTarget = {
    id?: string;
    sender: string;
    body: string;
    kind: "reply" | "quote";
};
export declare function describeReplyTarget(msg: TelegramMessage): TelegramReplyTarget | null;
export type TelegramForwardedContext = {
    from: string;
    date?: number;
    fromType: string;
    fromId?: string;
    fromUsername?: string;
    fromTitle?: string;
    fromSignature?: string;
};
/**
 * Extract forwarded message origin info from Telegram message.
 * Supports both new forward_origin API and legacy forward_from/forward_from_chat fields.
 */
export declare function normalizeForwardedContext(msg: TelegramMessage): TelegramForwardedContext | null;
export declare function extractTelegramLocation(msg: TelegramMessage): NormalizedLocation | null;
export {};
