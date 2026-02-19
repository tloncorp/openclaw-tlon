import type { TelegramContext, TelegramMessage } from "./bot/types.js";
declare const MEDIA_GROUP_TIMEOUT_MS = 500;
export type MediaGroupEntry = {
    messages: Array<{
        msg: TelegramMessage;
        ctx: TelegramContext;
    }>;
    timer: ReturnType<typeof setTimeout>;
};
export type TelegramUpdateKeyContext = {
    update?: {
        update_id?: number;
        message?: TelegramMessage;
        edited_message?: TelegramMessage;
    };
    update_id?: number;
    message?: TelegramMessage;
    callbackQuery?: {
        id?: string;
        message?: TelegramMessage;
    };
};
export declare const resolveTelegramUpdateId: (ctx: TelegramUpdateKeyContext) => number | undefined;
export declare const buildTelegramUpdateKey: (ctx: TelegramUpdateKeyContext) => string | undefined;
export declare const createTelegramUpdateDedupe: () => import("../infra/dedupe.js").DedupeCache;
export { MEDIA_GROUP_TIMEOUT_MS };
