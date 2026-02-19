import type { OpenClawConfig } from "../../config/config.js";
import type { ChannelAccountSnapshot, ChannelPlugin } from "./types.js";
export declare function buildChannelAccountSnapshot<ResolvedAccount>(params: {
    plugin: ChannelPlugin<ResolvedAccount>;
    cfg: OpenClawConfig;
    accountId: string;
    runtime?: ChannelAccountSnapshot;
    probe?: unknown;
    audit?: unknown;
}): Promise<ChannelAccountSnapshot>;
