import type { RuntimeEnv } from "openclaw/plugin-sdk/tlon";
import { PostHog } from "posthog-node";
import type { TlonTelemetryConfig } from "./types.js";

type ToolCallRecord = {
  toolName: string;
  durationMs: number | null;
  error: string | null;
  recordedAt: number;
};

type ToolSessionTrace = {
  updatedAt: number;
  calls: ToolCallRecord[];
};

export type ToolUsageSummary = {
  calls: Array<{
    toolName: string;
    durationMs: number | null;
    error: string | null;
  }>;
  names: string[];
  totalDurationMs: number;
  errorCount: number;
};

export type TlonReplyOutcome = "responded" | "no_reply" | "error";

export type TlonReplyOutcomeEvent = {
  ownerShip: string | null;
  botShip: string;
  outcome: TlonReplyOutcome;
  chatType: "dm" | "groupChannel";
  isThreadReply: boolean;
  senderRole: "owner" | "user";
  attachmentCount: number;
  deliveredMessageCount: number;
  replyCharCount: number;
  replyWordCount: number;
  replyMediaCount: number;
  dispatchDurationMs: number;
  queuedFinal: boolean;
  queuedFinalCount: number;
  queuedBlockCount: number;
  provider: string | null;
  model: string | null;
  thinkLevel: string | null;
  toolUsage: ToolUsageSummary;
};

export type TlonReplyTelemetryStart = {
  sessionKey: string;
  ownerShip: string | null;
  botShip: string;
  chatType: "dm" | "groupChannel";
  isThreadReply: boolean;
  senderRole: "owner" | "user";
  attachmentCount: number;
};

export type TlonReplyTelemetryResult = {
  deliveredMessageCount: number;
  replyCharCount: number;
  replyWordCount: number;
  replyMediaCount: number;
  dispatchDurationMs: number;
  queuedFinal: boolean;
  queuedFinalCount: number;
  queuedBlockCount: number;
  provider: string | null;
  model: string | null;
  thinkLevel: string | null;
  dispatchError?: unknown;
};

export interface TlonReplyTelemetrySession {
  capture(result: TlonReplyTelemetryResult): Promise<void>;
}

export interface TlonTelemetryClient {
  startReply(params: TlonReplyTelemetryStart): TlonReplyTelemetrySession;
  close(): Promise<void>;
}

const TLON_TELEMETRY_EVENT_NAME = "TlonBot Reply Handled";
const TLON_TELEMETRY_LOG_SOURCE = "openclawPlugin";
const TOOL_TRACE_TTL_MS = 60 * 60 * 1000;
const MAX_TOOL_CALLS_PER_SESSION = 200;
const toolCallsBySession = new Map<string, ToolSessionTrace>();

function cleanupToolCalls(now = Date.now()): void {
  for (const [sessionKey, trace] of toolCallsBySession) {
    if (now - trace.updatedAt > TOOL_TRACE_TTL_MS) {
      toolCallsBySession.delete(sessionKey);
    }
  }
}

export function recordToolCall(params: {
  sessionKey?: string | null;
  toolName: string;
  durationMs?: number;
  error?: string;
}): void {
  const sessionKey = params.sessionKey?.trim();
  if (!sessionKey) {
    return;
  }

  const now = Date.now();
  cleanupToolCalls(now);

  const existing = toolCallsBySession.get(sessionKey);
  const trace: ToolSessionTrace = existing ?? {
    updatedAt: now,
    calls: [],
  };

  trace.updatedAt = now;
  trace.calls.push({
    toolName: params.toolName,
    durationMs: typeof params.durationMs === "number" ? params.durationMs : null,
    error: params.error ?? null,
    recordedAt: now,
  });

  if (trace.calls.length > MAX_TOOL_CALLS_PER_SESSION) {
    trace.calls.splice(0, trace.calls.length - MAX_TOOL_CALLS_PER_SESSION);
  }

  toolCallsBySession.set(sessionKey, trace);
}

function createToolTraceCursor(sessionKey: string): number {
  cleanupToolCalls();
  return toolCallsBySession.get(sessionKey)?.calls.length ?? 0;
}

function collectToolUsageSince(sessionKey: string, cursor: number): ToolUsageSummary {
  cleanupToolCalls();

  const calls =
    toolCallsBySession
      .get(sessionKey)
      ?.calls.slice(Math.max(0, cursor))
      .map((call) => ({
        toolName: call.toolName,
        durationMs: call.durationMs,
        error: call.error,
      })) ?? [];

  return {
    calls,
    names: calls.map((call) => call.toolName),
    totalDurationMs: calls.reduce((total, call) => total + (call.durationMs ?? 0), 0),
    errorCount: calls.filter((call) => call.error).length,
  };
}

function resolveReplyOutcome(params: {
  deliveredMessageCount: number;
  dispatchError?: unknown;
}): TlonReplyOutcome {
  if (params.deliveredMessageCount > 0) {
    return "responded";
  }

  return params.dispatchError ? "error" : "no_reply";
}

class PostHogTlonTelemetry implements TlonTelemetryClient {
  private readonly client: PostHog;
  private readonly runtime?: RuntimeEnv;
  private readonly identifiedOwners = new Set<string>();
  private missingOwnerWarningLogged = false;

  constructor(params: { apiKey: string; host: string | null; runtime?: RuntimeEnv }) {
    this.runtime = params.runtime;
    this.client = new PostHog(params.apiKey, {
      host: params.host ?? undefined,
      flushAt: 1,
      flushInterval: 10_000,
      disableGeoip: true,
      preloadFeatureFlags: false,
      disableRemoteConfig: true,
    });
  }

  startReply(params: TlonReplyTelemetryStart): TlonReplyTelemetrySession {
    const toolTraceCursor = createToolTraceCursor(params.sessionKey);

    return {
      capture: async (result) => {
        // Yield once so after_tool_call hooks for the just-finished reply have time to run.
        await new Promise<void>((resolve) => setTimeout(resolve, 0));

        this.captureReplyOutcome({
          ownerShip: params.ownerShip,
          botShip: params.botShip,
          outcome: resolveReplyOutcome({
            deliveredMessageCount: result.deliveredMessageCount,
            dispatchError: result.dispatchError,
          }),
          chatType: params.chatType,
          isThreadReply: params.isThreadReply,
          senderRole: params.senderRole,
          attachmentCount: params.attachmentCount,
          deliveredMessageCount: result.deliveredMessageCount,
          replyCharCount: result.replyCharCount,
          replyWordCount: result.replyWordCount,
          replyMediaCount: result.replyMediaCount,
          dispatchDurationMs: result.dispatchDurationMs,
          queuedFinal: result.queuedFinal,
          queuedFinalCount: result.queuedFinalCount,
          queuedBlockCount: result.queuedBlockCount,
          provider: result.provider,
          model: result.model,
          thinkLevel: result.thinkLevel,
          toolUsage: collectToolUsageSince(params.sessionKey, toolTraceCursor),
        });
      },
    };
  }

  private captureReplyOutcome(event: TlonReplyOutcomeEvent): void {
    if (!event.ownerShip) {
      if (!this.missingOwnerWarningLogged) {
        this.missingOwnerWarningLogged = true;
        this.runtime?.log?.(
          "[tlon] Telemetry is enabled but ownerShip is not configured; skipping telemetry events",
        );
      }
      return;
    }

    if (!this.identifiedOwners.has(event.ownerShip)) {
      this.identifiedOwners.add(event.ownerShip);
      this.client.identify({
        distinctId: event.ownerShip,
        properties: {
          logSource: TLON_TELEMETRY_LOG_SOURCE,
          tlonOwnerShip: event.ownerShip,
          tlonBotShip: event.botShip,
        },
      });
    }

    this.client.capture({
      distinctId: event.ownerShip,
      event: TLON_TELEMETRY_EVENT_NAME,
      properties: {
        logSource: TLON_TELEMETRY_LOG_SOURCE,
        botShip: event.botShip,
        ownerShip: event.ownerShip,
        outcome: event.outcome,
        chatType: event.chatType,
        isThreadReply: event.isThreadReply,
        senderRole: event.senderRole,
        attachmentCount: event.attachmentCount,
        hasAttachments: event.attachmentCount > 0,
        deliveredMessageCount: event.deliveredMessageCount,
        replyCharCount: event.replyCharCount,
        replyWordCount: event.replyWordCount,
        replyMediaCount: event.replyMediaCount,
        dispatchDurationMs: event.dispatchDurationMs,
        queuedFinal: event.queuedFinal,
        queuedFinalCount: event.queuedFinalCount,
        queuedBlockCount: event.queuedBlockCount,
        provider: event.provider,
        model: event.model,
        thinkLevel: event.thinkLevel,
        toolCount: event.toolUsage.calls.length,
        toolNames: event.toolUsage.names,
        toolTotalDurationMs: event.toolUsage.totalDurationMs,
        toolErrorCount: event.toolUsage.errorCount,
        toolCalls: event.toolUsage.calls.map((call) => ({
          toolName: call.toolName,
          durationMs: call.durationMs,
          error: call.error,
        })),
      },
    });
  }

  async close(): Promise<void> {
    try {
      await this.client.flush();
    } catch (error) {
      this.runtime?.error?.(`[tlon] Telemetry flush failed: ${String(error)}`);
    }

    try {
      this.client.shutdown();
    } catch (error) {
      this.runtime?.error?.(`[tlon] Telemetry shutdown failed: ${String(error)}`);
    }
  }
}

export function createTlonTelemetry(params: {
  config: TlonTelemetryConfig;
  runtime?: RuntimeEnv;
}): TlonTelemetryClient | null {
  if (!params.config.enabled) {
    return null;
  }

  if (!params.config.apiKey) {
    params.runtime?.log?.(
      "[tlon] Telemetry is enabled but telemetry.apiKey is missing; telemetry disabled",
    );
    return null;
  }

  params.runtime?.log?.(
    `[tlon] Telemetry enabled${params.config.host ? ` (${params.config.host})` : ""}`,
  );

  return new PostHogTlonTelemetry({
    apiKey: params.config.apiKey,
    host: params.config.host,
    runtime: params.runtime,
  });
}

export const _testing = {
  clearToolCalls: () => toolCallsBySession.clear(),
  getToolTraceTtlMs: () => TOOL_TRACE_TTL_MS,
};
