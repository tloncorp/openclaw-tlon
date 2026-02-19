import type { Bot } from "grammy";
import type { OpenClawConfig } from "../config/config.js";
import type { DmPolicy, TelegramGroupConfig, TelegramTopicConfig } from "../config/types.js";
import type { TelegramContext } from "./bot/types.js";
import { type HistoryEntry } from "../auto-reply/reply/history.js";
type TelegramMediaRef = {
    path: string;
    contentType?: string;
    stickerMetadata?: {
        emoji?: string;
        setName?: string;
        fileId?: string;
        fileUniqueId?: string;
        cachedDescription?: string;
    };
};
type TelegramMessageContextOptions = {
    forceWasMentioned?: boolean;
    messageIdOverride?: string;
};
type TelegramLogger = {
    info: (obj: Record<string, unknown>, msg: string) => void;
};
type ResolveTelegramGroupConfig = (chatId: string | number, messageThreadId?: number) => {
    groupConfig?: TelegramGroupConfig;
    topicConfig?: TelegramTopicConfig;
};
type ResolveGroupActivation = (params: {
    chatId: string | number;
    agentId?: string;
    messageThreadId?: number;
    sessionKey?: string;
}) => boolean | undefined;
type ResolveGroupRequireMention = (chatId: string | number) => boolean;
type BuildTelegramMessageContextParams = {
    primaryCtx: TelegramContext;
    allMedia: TelegramMediaRef[];
    storeAllowFrom: string[];
    options?: TelegramMessageContextOptions;
    bot: Bot;
    cfg: OpenClawConfig;
    account: {
        accountId: string;
    };
    historyLimit: number;
    groupHistories: Map<string, HistoryEntry[]>;
    dmPolicy: DmPolicy;
    allowFrom?: Array<string | number>;
    groupAllowFrom?: Array<string | number>;
    ackReactionScope: "off" | "group-mentions" | "group-all" | "direct" | "all";
    logger: TelegramLogger;
    resolveGroupActivation: ResolveGroupActivation;
    resolveGroupRequireMention: ResolveGroupRequireMention;
    resolveTelegramGroupConfig: ResolveTelegramGroupConfig;
};
export declare const buildTelegramMessageContext: ({ primaryCtx, allMedia, storeAllowFrom, options, bot, cfg, account, historyLimit, groupHistories, dmPolicy, allowFrom, groupAllowFrom, ackReactionScope, logger, resolveGroupActivation, resolveGroupRequireMention, resolveTelegramGroupConfig, }: BuildTelegramMessageContextParams) => Promise<{
    ctxPayload: {
        CommandAuthorized: boolean;
        MessageThreadId: number | undefined;
        IsForum: boolean;
        OriginatingChannel: "telegram";
        OriginatingTo: string;
        LocationLat?: number | undefined;
        LocationLon?: number | undefined;
        LocationAccuracy?: number;
        LocationName?: string;
        LocationAddress?: string;
        LocationSource?: import("../channels/location.js").LocationSource | undefined;
        LocationIsLive?: boolean | undefined;
        Body: string;
        RawBody: string;
        CommandBody: string;
        From: string;
        To: string;
        SessionKey: string;
        AccountId: string;
        ChatType: string;
        ConversationLabel: string;
        GroupSubject: string | undefined;
        GroupSystemPrompt: string | undefined;
        SenderName: string | undefined;
        SenderId: string | undefined;
        SenderUsername: string | undefined;
        Provider: string;
        Surface: string;
        MessageSid: string;
        ReplyToId: string | undefined;
        ReplyToBody: string | undefined;
        ReplyToSender: string | undefined;
        ReplyToIsQuote: boolean | undefined;
        ForwardedFrom: string | undefined;
        ForwardedFromType: string | undefined;
        ForwardedFromId: string | undefined;
        ForwardedFromUsername: string | undefined;
        ForwardedFromTitle: string | undefined;
        ForwardedFromSignature: string | undefined;
        ForwardedDate: number | undefined;
        Timestamp: number | undefined;
        WasMentioned: boolean | undefined;
        MediaPath: string | undefined;
        MediaType: string | undefined;
        MediaUrl: string | undefined;
        MediaPaths: string[] | undefined;
        MediaUrls: string[] | undefined;
        MediaTypes: string[] | undefined;
        Sticker: {
            emoji?: string;
            setName?: string;
            fileId?: string;
            fileUniqueId?: string;
            cachedDescription?: string;
        } | undefined;
    } & Omit<import("../auto-reply/templating.js").MsgContext, "CommandAuthorized"> & {
        CommandAuthorized: boolean;
    };
    primaryCtx: TelegramContext;
    msg: import("./bot/types.js").TelegramMessage;
    chatId: number;
    isGroup: boolean;
    resolvedThreadId: number | undefined;
    threadSpec: import("./bot/helpers.js").TelegramThreadSpec;
    replyThreadId: number | undefined;
    isForum: boolean;
    historyKey: string | undefined;
    historyLimit: number;
    groupHistories: Map<string, HistoryEntry[]>;
    route: import("../routing/resolve-route.js").ResolvedAgentRoute;
    skillFilter: string[] | undefined;
    sendTyping: () => Promise<void>;
    sendRecordVoice: () => Promise<void>;
    ackReactionPromise: Promise<boolean> | null;
    reactionApi: ((chatId: number | string, messageId: number, reactions: Array<{
        type: "emoji";
        emoji: string;
    }>) => Promise<void>) | null;
    removeAckAfterReply: boolean;
    accountId: string;
} | null>;
export {};
