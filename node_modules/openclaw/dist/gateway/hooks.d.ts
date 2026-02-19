import type { IncomingMessage } from "node:http";
import type { ChannelId } from "../channels/plugins/types.js";
import type { OpenClawConfig } from "../config/config.js";
import { type HookMappingResolved } from "./hooks-mapping.js";
export type HooksConfigResolved = {
    basePath: string;
    token: string;
    maxBodyBytes: number;
    mappings: HookMappingResolved[];
};
export declare function resolveHooksConfig(cfg: OpenClawConfig): HooksConfigResolved | null;
export type HookTokenResult = {
    token: string | undefined;
    fromQuery: boolean;
};
export declare function extractHookToken(req: IncomingMessage, url: URL): HookTokenResult;
export declare function readJsonBody(req: IncomingMessage, maxBytes: number): Promise<{
    ok: true;
    value: unknown;
} | {
    ok: false;
    error: string;
}>;
export declare function normalizeHookHeaders(req: IncomingMessage): Record<string, string>;
export declare function normalizeWakePayload(payload: Record<string, unknown>): {
    ok: true;
    value: {
        text: string;
        mode: "now" | "next-heartbeat";
    };
} | {
    ok: false;
    error: string;
};
export type HookAgentPayload = {
    message: string;
    name: string;
    wakeMode: "now" | "next-heartbeat";
    sessionKey: string;
    deliver: boolean;
    channel: HookMessageChannel;
    to?: string;
    model?: string;
    thinking?: string;
    timeoutSeconds?: number;
};
export type HookMessageChannel = ChannelId | "last";
export declare const getHookChannelError: () => string;
export declare function resolveHookChannel(raw: unknown): HookMessageChannel | null;
export declare function resolveHookDeliver(raw: unknown): boolean;
export declare function normalizeAgentPayload(payload: Record<string, unknown>, opts?: {
    idFactory?: () => string;
}): {
    ok: true;
    value: HookAgentPayload;
} | {
    ok: false;
    error: string;
};
