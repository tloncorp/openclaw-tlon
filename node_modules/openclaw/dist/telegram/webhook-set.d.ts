import type { TelegramNetworkConfig } from "../config/types.telegram.js";
export declare function setTelegramWebhook(opts: {
    token: string;
    url: string;
    secret?: string;
    dropPendingUpdates?: boolean;
    network?: TelegramNetworkConfig;
}): Promise<void>;
export declare function deleteTelegramWebhook(opts: {
    token: string;
    network?: TelegramNetworkConfig;
}): Promise<void>;
