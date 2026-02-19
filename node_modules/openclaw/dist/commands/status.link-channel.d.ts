import type { ChannelPlugin } from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";
export type LinkChannelContext = {
    linked: boolean;
    authAgeMs: number | null;
    account?: unknown;
    accountId?: string;
    plugin: ChannelPlugin;
};
export declare function resolveLinkChannelContext(cfg: OpenClawConfig): Promise<LinkChannelContext | null>;
