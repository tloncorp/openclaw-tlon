import type { ChannelId } from "../../channels/plugins/types.js";
import type { OpenClawConfig } from "../../config/config.js";
export type ChannelRow = {
    id: ChannelId;
    label: string;
    enabled: boolean;
    state: "ok" | "setup" | "warn" | "off";
    detail: string;
};
export declare function buildChannelsTable(cfg: OpenClawConfig, opts?: {
    showSecrets?: boolean;
}): Promise<{
    rows: ChannelRow[];
    details: Array<{
        title: string;
        columns: string[];
        rows: Array<Record<string, string>>;
    }>;
}>;
