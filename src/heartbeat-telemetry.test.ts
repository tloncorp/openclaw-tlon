import type { OpenClawConfig } from "openclaw/plugin-sdk/tlon";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createHeartbeatTelemetryHandlers,
  deriveNudgeStage,
  _testing,
} from "./heartbeat-telemetry.js";
import { getCandidateSend, _testing as candidateTesting } from "./nudge-candidate.js";

function makeConfig(overrides?: {
  ownerShip?: string;
  accounts?: Record<string, Record<string, unknown>>;
}): OpenClawConfig {
  return {
    channels: {
      tlon: {
        enabled: true,
        ship: "~bot-ship",
        url: "http://localhost:8080",
        code: "test-code",
        ownerShip: overrides?.ownerShip ?? "~sampel-palnet",
        accounts: overrides?.accounts,
      },
    },
  } as OpenClawConfig;
}

function makeDeps(overrides?: {
  config?: OpenClawConfig;
  getEffectiveOwnerShip?: (accountId: string) => string | null;
}) {
  return {
    config: overrides?.config ?? makeConfig(),
    getEffectiveOwnerShip: overrides?.getEffectiveOwnerShip ?? (() => null),
    logger: { info: vi.fn(), warn: vi.fn() },
  };
}

function makeMessageSentEvent(overrides?: {
  sessionKey?: string;
  to?: string;
  content?: string;
  success?: boolean;
  channelId?: string;
  accountId?: string | null;
}) {
  const context: Record<string, unknown> = {
    to: overrides?.to ?? "~sampel-palnet",
    content: overrides?.content ?? "Hello owner!",
    success: overrides?.success ?? true,
    channelId: overrides?.channelId ?? "tlon",
  };
  // Only set accountId when not explicitly null (null = omit from context)
  if (overrides?.accountId !== null) {
    context.accountId = overrides?.accountId ?? "default";
  }
  return {
    type: "message" as const,
    action: "sent" as const,
    sessionKey: overrides?.sessionKey ?? "hb-sess-1",
    context,
    timestamp: new Date(),
    messages: [],
  };
}

describe("heartbeat-telemetry", () => {
  beforeEach(() => {
    _testing.clearSessions();
    candidateTesting.clearAll();
  });

  describe("heartbeat session lifecycle", () => {
    it("registers a heartbeat session on before_agent_start", () => {
      const handlers = createHeartbeatTelemetryHandlers(makeDeps());
      handlers.onBeforeAgentStart(
        { prompt: "heartbeat check" },
        { sessionKey: "hb-sess-1", messageProvider: "heartbeat" },
      );
      expect(_testing.getSession("hb-sess-1")).not.toBeNull();
    });

    it("ignores non-heartbeat sessions", () => {
      const handlers = createHeartbeatTelemetryHandlers(makeDeps());
      handlers.onBeforeAgentStart(
        { prompt: "user message" },
        { sessionKey: "sess-1", messageProvider: "tlon" },
      );
      expect(_testing.getSession("sess-1")).toBeNull();
    });

    it("removes session on agent_end", () => {
      const handlers = createHeartbeatTelemetryHandlers(makeDeps());
      handlers.onBeforeAgentStart(
        { prompt: "heartbeat" },
        { sessionKey: "hb-sess-1", messageProvider: "heartbeat" },
      );
      handlers.onAgentEnd({ messages: [], success: true }, { sessionKey: "hb-sess-1" });
      expect(_testing.getSession("hb-sess-1")).toBeNull();
    });
  });

  describe("provider/model capture from llm_input", () => {
    it("captures provider and model for heartbeat session", () => {
      const handlers = createHeartbeatTelemetryHandlers(makeDeps());
      handlers.onBeforeAgentStart(
        { prompt: "heartbeat" },
        { sessionKey: "hb-sess-1", messageProvider: "heartbeat" },
      );
      handlers.onLlmInput(
        { provider: "anthropic", model: "claude-3", runId: "r1", sessionId: "s1" },
        { sessionKey: "hb-sess-1" },
      );
      const session = _testing.getSession("hb-sess-1");
      expect(session?.provider).toBe("anthropic");
      expect(session?.model).toBe("claude-3");
    });

    it("ignores llm_input for non-heartbeat sessions", () => {
      const handlers = createHeartbeatTelemetryHandlers(makeDeps());
      handlers.onLlmInput(
        { provider: "anthropic", model: "claude-3", runId: "r1", sessionId: "s1" },
        { sessionKey: "non-hb" },
      );
      expect(_testing.getSession("non-hb")).toBeNull();
    });
  });

  describe("onMessageSent — candidate storage", () => {
    function setupHeartbeatSession(handlers: ReturnType<typeof createHeartbeatTelemetryHandlers>) {
      handlers.onBeforeAgentStart(
        { prompt: "heartbeat" },
        { sessionKey: "hb-sess-1", messageProvider: "heartbeat" },
      );
      handlers.onLlmInput(
        { provider: "anthropic", model: "claude-3", runId: "r1", sessionId: "s1" },
        { sessionKey: "hb-sess-1" },
      );
    }

    it("stores candidate for successful Tlon send to owner", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: () => "~sampel-palnet",
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      setupHeartbeatSession(handlers);

      handlers.onMessageSent(makeMessageSentEvent());

      const candidate = getCandidateSend("default");
      expect(candidate).toMatchObject({
        accountId: "default",
        sessionKey: "hb-sess-1",
        ownerShip: "~sampel-palnet",
        content: "Hello owner!",
        provider: "anthropic",
        model: "claude-3",
        ambiguous: false,
      });
    });

    it("ignores non-Tlon sends", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: () => "~sampel-palnet",
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      setupHeartbeatSession(handlers);

      handlers.onMessageSent(makeMessageSentEvent({ channelId: "telegram" }));
      expect(getCandidateSend("default")).toBeNull();
    });

    it("ignores non-owner target", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: () => "~sampel-palnet",
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      setupHeartbeatSession(handlers);

      handlers.onMessageSent(makeMessageSentEvent({ to: "~other-ship" }));
      expect(getCandidateSend("default")).toBeNull();
    });

    it("ignores failed sends", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: () => "~sampel-palnet",
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      setupHeartbeatSession(handlers);

      handlers.onMessageSent(makeMessageSentEvent({ success: false }));
      expect(getCandidateSend("default")).toBeNull();
    });

    it("ignores non-heartbeat session sends", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: () => "~sampel-palnet",
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      // No heartbeat session registered

      handlers.onMessageSent(makeMessageSentEvent());
      expect(getCandidateSend("default")).toBeNull();
    });

    it("uses settings-store owner override", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: () => "~new-owner",
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      setupHeartbeatSession(handlers);

      // Send to new owner matches
      handlers.onMessageSent(makeMessageSentEvent({ to: "~new-owner" }));
      expect(getCandidateSend("default")).not.toBeNull();

      candidateTesting.clearAll();

      // Send to old file-config owner does not match
      handlers.onMessageSent(makeMessageSentEvent({ to: "~sampel-palnet" }));
      expect(getCandidateSend("default")).toBeNull();
    });

    it("falls back to file config when no settings-store value", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: () => null,
        config: makeConfig({ ownerShip: "~file-owner" }),
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      setupHeartbeatSession(handlers);

      handlers.onMessageSent(makeMessageSentEvent({ to: "~file-owner" }));
      expect(getCandidateSend("default")).not.toBeNull();
    });

    it("skips when ownerShip is null everywhere", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: () => null,
        config: makeConfig({ ownerShip: undefined }),
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      setupHeartbeatSession(handlers);

      handlers.onMessageSent(makeMessageSentEvent({ to: "~someone" }));
      expect(getCandidateSend("default")).toBeNull();
    });

    it("uses context.accountId when present", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: (id) => (id === "acct-a" ? "~owner-a" : null),
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      setupHeartbeatSession(handlers);

      handlers.onMessageSent(makeMessageSentEvent({ accountId: "acct-a", to: "~owner-a" }));
      expect(getCandidateSend("acct-a")).not.toBeNull();
    });

    it("infers single account when context.accountId is absent", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: () => "~sampel-palnet",
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      setupHeartbeatSession(handlers);

      // null = omit accountId from context entirely
      handlers.onMessageSent(makeMessageSentEvent({ accountId: null }));
      expect(getCandidateSend("default")).not.toBeNull();
    });

    it("drops event when accountId absent and multiple accounts configured", () => {
      const config = makeConfig({
        accounts: {
          "acct-a": { ship: "~ship-a" },
          "acct-b": { ship: "~ship-b" },
        },
      });
      const deps = makeDeps({ config });
      const handlers = createHeartbeatTelemetryHandlers(deps);

      // Must register a heartbeat session before onMessageSent will proceed
      handlers.onBeforeAgentStart(
        { prompt: "heartbeat" },
        { sessionKey: "hb-sess-1", messageProvider: "heartbeat" },
      );

      // null = omit accountId from context entirely
      handlers.onMessageSent(makeMessageSentEvent({ accountId: null }));
      expect(getCandidateSend("default")).toBeNull();
      expect(getCandidateSend("acct-a")).toBeNull();
      expect(getCandidateSend("acct-b")).toBeNull();
      expect(deps.logger.warn).toHaveBeenCalled();
    });
  });

  describe("TTL cleanup", () => {
    it("removes stale sessions", () => {
      const handlers = createHeartbeatTelemetryHandlers(makeDeps());
      const ttlMs = _testing.getSessionTtlMs();

      // Manually insert a stale session
      handlers.onBeforeAgentStart(
        { prompt: "heartbeat" },
        { sessionKey: "stale-sess", messageProvider: "heartbeat" },
      );
      // Forge staleness by reaching into the session
      const session = _testing.getSession("stale-sess");
      if (session) {
        session.startedAt = Date.now() - ttlMs - 1000;
      }

      // Registering a new session triggers cleanup
      handlers.onBeforeAgentStart(
        { prompt: "heartbeat" },
        { sessionKey: "fresh-sess", messageProvider: "heartbeat" },
      );

      expect(_testing.getSession("stale-sess")).toBeNull();
      expect(_testing.getSession("fresh-sess")).not.toBeNull();
    });
  });

  describe("deriveNudgeStage (debugging helper)", () => {
    it("detects stage 1", () => {
      expect(deriveNudgeStage("Hey! Quick ideas for your week — check these out")).toBe(1);
    });

    it("detects stage 2", () => {
      expect(deriveNudgeStage("A few things I can do for you right now")).toBe(2);
    });

    it("detects stage 3", () => {
      expect(deriveNudgeStage("Still here! Here's what I can do to help")).toBe(3);
    });

    it("is case-insensitive", () => {
      expect(deriveNudgeStage("quick IDEAS for YOUR week")).toBe(1);
    });

    it("returns null for no marker", () => {
      expect(deriveNudgeStage("Just a regular message")).toBeNull();
    });
  });

  describe("close", () => {
    it("clears all heartbeat sessions", () => {
      const handlers = createHeartbeatTelemetryHandlers(makeDeps());
      handlers.onBeforeAgentStart(
        { prompt: "heartbeat" },
        { sessionKey: "sess-1", messageProvider: "heartbeat" },
      );
      handlers.close();
      expect(_testing.getSession("sess-1")).toBeNull();
    });

    it("clears candidate-send state", () => {
      const deps = makeDeps({
        getEffectiveOwnerShip: () => "~sampel-palnet",
      });
      const handlers = createHeartbeatTelemetryHandlers(deps);
      handlers.onBeforeAgentStart(
        { prompt: "heartbeat" },
        { sessionKey: "hb-sess-1", messageProvider: "heartbeat" },
      );
      handlers.onMessageSent(makeMessageSentEvent());
      expect(getCandidateSend("default")).not.toBeNull();

      handlers.close();
      expect(getCandidateSend("default")).toBeNull();
    });
  });
});
