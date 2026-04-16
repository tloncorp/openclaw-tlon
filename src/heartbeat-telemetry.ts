/**
 * Heartbeat telemetry hook handler logic.
 *
 * Owns heartbeat session tracking and candidate-send classification.
 * Independent of index.ts plugin registration. Does NOT own PostHog emission —
 * that happens in the monitor at confirmation time.
 */

import type { OpenClawConfig } from "openclaw/plugin-sdk/tlon";
import { clearAllCandidates, setCandidateSend } from "./nudge-candidate.js";
import { normalizeShip } from "./targets.js";
import { resolveTlonAccount, listTlonAccountIds } from "./types.js";

// Stage markers from HEARTBEAT.md — retained for optional debugging/validation.
const STAGE_1_MARKER = "Quick ideas for your week";
const STAGE_2_MARKER = "A few things I can do for you";
const STAGE_3_MARKER = "Still here! Here's what I can do";

/**
 * Derive nudge stage from message content markers.
 * Retained for optional debugging/validation only — NOT the source of truth
 * for nudgeStage (that comes from lastNudgeStage in the settings store).
 */
export function deriveNudgeStage(content: string): 1 | 2 | 3 | null {
  const lower = content.toLowerCase();
  if (lower.includes(STAGE_1_MARKER.toLowerCase())) {return 1;}
  if (lower.includes(STAGE_2_MARKER.toLowerCase())) {return 2;}
  if (lower.includes(STAGE_3_MARKER.toLowerCase())) {return 3;}
  return null;
}

export type HeartbeatSessionInfo = {
  sessionKey: string;
  startedAt: number;
  provider: string | null;
  model: string | null;
};

/** TTL for heartbeat sessions (30 minutes). */
const HEARTBEAT_SESSION_TTL_MS = 30 * 60 * 1000;

const heartbeatSessions = new Map<string, HeartbeatSessionInfo>();

function cleanupStaleSessions(now = Date.now()): void {
  for (const [key, session] of heartbeatSessions) {
    if (now - session.startedAt > HEARTBEAT_SESSION_TTL_MS) {
      heartbeatSessions.delete(key);
    }
  }
}

export type HeartbeatTelemetryDeps = {
  config: OpenClawConfig;
  getEffectiveOwnerShip: (accountId: string) => string | null;
  logger: { info: (msg: string) => void; warn: (msg: string) => void };
};

// Minimal event shapes matching the SDK hook signatures.
// We use structural types instead of importing InternalHookEvent
// because the SDK does not publicly export those types.

type AgentHookEvent = {
  prompt?: string;
  [key: string]: unknown;
};

type AgentHookContext = {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  workspaceDir?: string;
  messageProvider?: string;
};

type LlmInputEvent = {
  provider: string;
  model: string;
  [key: string]: unknown;
};

type InternalEvent = {
  type: string;
  action: string;
  sessionKey: string;
  context: Record<string, unknown>;
  timestamp: Date;
  messages: string[];
};

export function createHeartbeatTelemetryHandlers(deps: HeartbeatTelemetryDeps) {
  // Resolve configured account IDs once at creation time for safe accountId resolution.
  const configuredAccountIds = listTlonAccountIds(deps.config);

  function resolveAccountId(contextAccountId: string | undefined): string | null {
    if (contextAccountId) {return contextAccountId;}
    if (configuredAccountIds.length === 1) {return configuredAccountIds[0];}
    if (configuredAccountIds.length > 1) {
      deps.logger.warn(
        `[tlon] heartbeat: message:sent missing accountId with ${configuredAccountIds.length} accounts configured; dropping event`,
      );
    }
    return null;
  }

  function resolveOwnerShip(accountId: string): string | null {
    const effective = deps.getEffectiveOwnerShip(accountId);
    if (effective) {return effective;}
    const fileConfig = resolveTlonAccount(deps.config, accountId).ownerShip;
    return fileConfig ? normalizeShip(fileConfig) : null;
  }

  const onBeforeAgentStart = (_event: AgentHookEvent, ctx: AgentHookContext): void => {
    if (ctx.messageProvider !== "heartbeat" || !ctx.sessionKey) {return;}
    cleanupStaleSessions();
    heartbeatSessions.set(ctx.sessionKey, {
      sessionKey: ctx.sessionKey,
      startedAt: Date.now(),
      provider: null,
      model: null,
    });
  };

  const onLlmInput = (event: LlmInputEvent, ctx: AgentHookContext): void => {
    if (!ctx.sessionKey) {return;}
    const session = heartbeatSessions.get(ctx.sessionKey);
    if (!session) {return;}
    session.provider = event.provider;
    session.model = event.model;
  };

  const onMessageSent = (event: InternalEvent): void => {
    if (!event.sessionKey) {return;}
    const session = heartbeatSessions.get(event.sessionKey);
    if (!session) {return;}

    // Defensive field access — InternalHookEvent.context is Record<string, unknown>
    const ctx = event.context;
    const success = ctx.success;
    const channelId = ctx.channelId;
    const to = ctx.to;
    const content = ctx.content;
    const contextAccountId = ctx.accountId;

    if (!success || channelId !== "tlon") {return;}
    if (typeof to !== "string") {return;}

    const accountId = resolveAccountId(
      typeof contextAccountId === "string" ? contextAccountId : undefined,
    );
    if (!accountId) {return;}

    const ownerShip = resolveOwnerShip(accountId);
    if (!ownerShip) {return;}

    const normalizedTo = normalizeShip(to);
    if (normalizedTo !== ownerShip) {return;}

    setCandidateSend(accountId, {
      accountId,
      sessionKey: event.sessionKey,
      sentAt: event.timestamp.getTime(),
      ownerShip,
      content: typeof content === "string" ? content : "",
      provider: session.provider,
      model: session.model,
    });
  };

  const onAgentEnd = (_event: AgentHookEvent, ctx: AgentHookContext): void => {
    if (ctx.sessionKey) {
      heartbeatSessions.delete(ctx.sessionKey);
    }
    cleanupStaleSessions();
  };

  const close = (): void => {
    heartbeatSessions.clear();
    clearAllCandidates();
  };

  return {
    onBeforeAgentStart,
    onLlmInput,
    onMessageSent,
    onAgentEnd,
    close,
  };
}

export const _testing = {
  clearSessions: () => heartbeatSessions.clear(),
  getSessionTtlMs: () => HEARTBEAT_SESSION_TTL_MS,
  getSession: (key: string) => heartbeatSessions.get(key) ?? null,
};
