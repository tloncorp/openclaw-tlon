import { type OpenClawConfig, type HooksGmailTailscaleMode } from "../config/config.js";
export declare const DEFAULT_GMAIL_LABEL = "INBOX";
export declare const DEFAULT_GMAIL_TOPIC = "gog-gmail-watch";
export declare const DEFAULT_GMAIL_SUBSCRIPTION = "gog-gmail-watch-push";
export declare const DEFAULT_GMAIL_SERVE_BIND = "127.0.0.1";
export declare const DEFAULT_GMAIL_SERVE_PORT = 8788;
export declare const DEFAULT_GMAIL_SERVE_PATH = "/gmail-pubsub";
export declare const DEFAULT_GMAIL_MAX_BYTES = 20000;
export declare const DEFAULT_GMAIL_RENEW_MINUTES: number;
export declare const DEFAULT_HOOKS_PATH = "/hooks";
export type GmailHookOverrides = {
    account?: string;
    label?: string;
    topic?: string;
    subscription?: string;
    pushToken?: string;
    hookToken?: string;
    hookUrl?: string;
    includeBody?: boolean;
    maxBytes?: number;
    renewEveryMinutes?: number;
    serveBind?: string;
    servePort?: number;
    servePath?: string;
    tailscaleMode?: HooksGmailTailscaleMode;
    tailscalePath?: string;
    tailscaleTarget?: string;
};
export type GmailHookRuntimeConfig = {
    account: string;
    label: string;
    topic: string;
    subscription: string;
    pushToken: string;
    hookToken: string;
    hookUrl: string;
    includeBody: boolean;
    maxBytes: number;
    renewEveryMinutes: number;
    serve: {
        bind: string;
        port: number;
        path: string;
    };
    tailscale: {
        mode: HooksGmailTailscaleMode;
        path: string;
        target?: string;
    };
};
export declare function generateHookToken(bytes?: number): string;
export declare function mergeHookPresets(existing: string[] | undefined, preset: string): string[];
export declare function normalizeHooksPath(raw?: string): string;
export declare function normalizeServePath(raw?: string): string;
export declare function buildDefaultHookUrl(hooksPath?: string, port?: number): string;
export declare function resolveGmailHookRuntimeConfig(cfg: OpenClawConfig, overrides: GmailHookOverrides): {
    ok: true;
    value: GmailHookRuntimeConfig;
} | {
    ok: false;
    error: string;
};
export declare function buildGogWatchStartArgs(cfg: Pick<GmailHookRuntimeConfig, "account" | "label" | "topic">): string[];
export declare function buildGogWatchServeArgs(cfg: GmailHookRuntimeConfig): string[];
export declare function buildTopicPath(projectId: string, topicName: string): string;
export declare function parseTopicPath(topic: string): {
    projectId: string;
    topicName: string;
} | null;
