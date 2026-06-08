import { describe, expect, it } from "vitest";
import {
  bindContextLensToSession,
  createContextLensRegistry,
  ensureBackgroundContextLensForSession,
  finalizeBackgroundContextLensForSession,
  hashSessionKey,
  recordContextLensToolResultForSession,
  recordContextLensToolStartForSession,
  unbindContextLensFromSession,
} from "./context-lens.js";
import {
  findRecentContextLensById,
  listRecentContextLensEvents,
  publishContextLensEvent,
  subscribeToContextLensEvents,
} from "./context-lens-events.js";

describe("context lens registry", () => {
  it("creates redacted receipts without storing raw session keys or prompt text", () => {
    const registry = createContextLensRegistry({ ttlMs: 1_000 });
    const lens = registry.create({
      messageId: "message-1",
      chatType: "dm",
      runKind: "conversation",
      visibility: "owner",
      trigger: "dm",
      sessionKey: "agent:test:tlon:direct:~ten",
      now: 100,
    });

    expect(lens).toMatchObject({
      messageId: "message-1",
      chatType: "dm",
      runKind: "conversation",
      visibility: "owner",
      trigger: "dm",
      sessionKeyHash: hashSessionKey("agent:test:tlon:direct:~ten"),
      status: "assembling",
      context: {
        currentMessage: true,
        threadMessages: 0,
        channelMessages: 0,
        citedPosts: 0,
        attachments: 0,
        pendingNudge: false,
      },
    });
    expect(JSON.stringify(lens)).not.toContain("agent:test:tlon:direct:~ten");
    expect(JSON.stringify(lens)).not.toContain("~ten");
  });

  it("records context and persistence facts by patching nested fields", () => {
    const registry = createContextLensRegistry();
    const lens = registry.create({
      messageId: "message-2",
      chatType: "channel",
      trigger: "mention",
      sessionKey: "session-2",
      senderShip: "~ten",
      conversationId: "chat/~ten/test",
      receivedAt: 123,
      preview: "hello bot",
    });

    registry.recordContext(lens.lensId, {
      channelMessages: 12,
      citedPosts: 2,
      attachments: 1,
    });
    registry.recordContextSource(lens.lensId, {
      kind: "message",
      label: "Recent channel activity",
      sourceId: "chat/~ten/test",
      included: true,
      reason: "12 recent channel messages",
    });
    registry.recordPersistence(lens.lensId, {
      cachesHistory: true,
      writesMedia: true,
      emitsTelemetry: true,
    });
    registry.recordPersistenceEvent(lens.lensId, {
      kind: "conversation_state",
      action: "read",
      location: "openclaw",
      status: "ok",
      key: "session:abc",
      at: 456,
    });
    registry.setStatus(lens.lensId, "dispatching");
    registry.recordLifecycle(lens.lensId, {
      dispatchStartedAt: 123,
      timeoutMs: 90_000,
    });
    registry.recordToolCall(lens.lensId, "tlon", { phase: "start" });
    registry.recordToolCall(lens.lensId, "tlon");
    registry.completeOpenToolRuns(lens.lensId);
    registry.recordOutput(lens.lensId, {
      messageId: "~zod/170.141.184",
      conversationId: "chat/~ten/test",
      kind: "channel",
      sentAt: 789,
      preview: "reply",
      chunkIndex: 0,
    });

    expect(registry.get(lens.lensId)).toMatchObject({
      status: "dispatching",
      triggerDetails: {
        type: "mention",
        messageId: "message-2",
        authorShip: "~ten",
        conversationId: "chat/~ten/test",
        receivedAt: 123,
        preview: "hello bot",
      },
      context: {
        currentMessage: true,
        threadMessages: 0,
        channelMessages: 12,
        citedPosts: 2,
        attachments: 1,
        pendingNudge: false,
        sources: expect.arrayContaining([
          expect.objectContaining({
            label: "Current message",
            included: true,
            preview: "hello bot",
          }),
          expect.objectContaining({
            label: "Recent channel activity",
            included: true,
          }),
        ]),
      },
      persistence: {
        postsReply: false,
        updatesSettings: false,
        writesMedia: true,
        emitsTelemetry: true,
        cachesHistory: true,
        events: [
          expect.objectContaining({
            kind: "conversation_state",
            action: "read",
            location: "openclaw",
          }),
        ],
      },
      tools: {
        ownerOnlyAvailable: [],
        called: ["tlon"],
        callCount: 2,
        runs: [
          expect.objectContaining({
            callIndex: 1,
            name: "tlon",
            phase: "start",
            status: "completed",
          }),
          expect.objectContaining({
            callIndex: 2,
            name: "tlon",
            status: "completed",
          }),
        ],
      },
      outputs: [
        expect.objectContaining({
          messageId: "~zod/170.141.184",
          kind: "channel",
          preview: "reply",
        }),
      ],
      lifecycle: {
        dispatchStartedAt: 123,
        timeoutMs: 90_000,
        deliveredMessageCount: 0,
        queuedFinal: false,
      },
    });
  });

  it("records summarization triggers distinctly from ordinary mentions", () => {
    const registry = createContextLensRegistry();
    const lens = registry.create({
      messageId: "summary-message",
      chatType: "channel",
      trigger: "summarization",
      sessionKey: "session-summary",
      senderShip: "~ten",
      conversationId: "chat/~ten/test",
      preview: "summarize this channel",
    });

    expect(lens).toMatchObject({
      trigger: "summarization",
      triggerDetails: {
        type: "summarization",
        messageId: "summary-message",
        conversationKind: "channel",
      },
    });
  });

  it("records no-reply and timeout lifecycle outcomes without raw content", () => {
    const registry = createContextLensRegistry();
    const noReply = registry.create({ messageId: "message-3", chatType: "dm" });
    const timedOut = registry.create({ messageId: "message-4", chatType: "dm" });

    registry.recordLifecycle(noReply.lensId, {
      completedAt: 500,
      durationMs: 250,
      deliveredMessageCount: 0,
    });
    registry.setStatus(noReply.lensId, "no_reply");

    registry.recordLifecycle(timedOut.lensId, {
      completedAt: 1_000,
      durationMs: 120_000,
      timeoutMs: 120_000,
      timedOut: true,
    });
    registry.setStatus(timedOut.lensId, "timed_out", new Error("dispatch timed out"));

    expect(registry.get(noReply.lensId)).toMatchObject({
      status: "no_reply",
      lifecycle: {
        durationMs: 250,
        deliveredMessageCount: 0,
        timedOut: false,
      },
    });
    expect(registry.get(timedOut.lensId)).toMatchObject({
      status: "timed_out",
      error: "dispatch timed out",
      lifecycle: {
        durationMs: 120_000,
        timeoutMs: 120_000,
        timedOut: true,
      },
    });
  });

  it("records completed tool durations from session tool results", () => {
    const registry = createContextLensRegistry();
    const sessionKey = "session-tool-result";
    const lens = registry.create({
      messageId: "message-tool-result",
      chatType: "dm",
      sessionKey,
    });

    bindContextLensToSession(sessionKey, registry, lens.lensId);

    try {
      recordContextLensToolStartForSession(sessionKey, "read", {
        argumentSummary: "2 keys: path, line",
      });
      recordContextLensToolStartForSession(sessionKey, "tlon");
      recordContextLensToolResultForSession(sessionKey, "read", { durationMs: 17 });
      registry.completeOpenToolRuns(lens.lensId);
    } finally {
      unbindContextLensFromSession(sessionKey, lens.lensId);
    }

    expect(registry.get(lens.lensId)?.tools.runs).toEqual([
      expect.objectContaining({
        name: "read",
        status: "completed",
        durationMs: 17,
        argumentSummary: "2 keys: path, line",
      }),
      expect.objectContaining({
        name: "tlon",
        status: "completed",
      }),
    ]);
  });

  it("records blocked tool calls from session tool results", () => {
    const registry = createContextLensRegistry();
    const sessionKey = "session-blocked-tool";
    const lens = registry.create({
      messageId: "message-blocked-tool",
      chatType: "dm",
      sessionKey,
    });

    bindContextLensToSession(sessionKey, registry, lens.lensId);

    try {
      recordContextLensToolStartForSession(sessionKey, "read");
      recordContextLensToolResultForSession(sessionKey, "read", {
        status: "blocked",
        error: "read is not available",
      });
    } finally {
      unbindContextLensFromSession(sessionKey, lens.lensId);
    }

    expect(registry.get(lens.lensId)?.tools.runs).toEqual([
      expect.objectContaining({
        name: "read",
        status: "blocked",
        error: "read is not available",
      }),
    ]);
  });

  it("creates and finalizes owner-visible background tool runs", () => {
    const sessionKey = "session-background-tool";
    const lens = ensureBackgroundContextLensForSession(sessionKey, {
      runKind: "cron",
      trigger: "cron",
      preview: "cron tool activity",
    });

    expect(lens).toMatchObject({
      chatType: "internal",
      runKind: "cron",
      visibility: "owner",
      trigger: "cron",
      triggerDetails: {
        conversationKind: "internal",
        preview: "cron tool activity",
      },
    });

    recordContextLensToolStartForSession(sessionKey, "cron");
    recordContextLensToolResultForSession(sessionKey, "cron", { durationMs: 42 });
    const finalLens = finalizeBackgroundContextLensForSession(sessionKey);

    expect(finalLens).toMatchObject({
      status: "completed",
      lifecycle: {
        deliveredMessageCount: 0,
      },
      tools: {
        runs: [
          expect.objectContaining({
            name: "cron",
            status: "completed",
            durationMs: 42,
          }),
        ],
      },
    });
    expect(recordContextLensToolStartForSession(sessionKey, "cron")).toBeNull();
  });

  it("expires old lenses and caps registry size", () => {
    const registry = createContextLensRegistry({ ttlMs: 1_000_000, maxEntries: 2 });
    const now = Date.now();
    const first = registry.create({ messageId: "first", chatType: "dm", now });
    const second = registry.create({ messageId: "second", chatType: "dm", now: now + 5 });
    const third = registry.create({ messageId: "third", chatType: "dm", now: now + 6 });

    expect(registry.get(first.lensId)).toBeNull();
    expect(registry.get(second.lensId)?.messageId).toBe("second");
    expect(registry.get(third.lensId)?.messageId).toBe("third");

    registry.prune(now + 1_000_006);
    expect(registry.get(second.lensId)).toBeNull();
    expect(registry.get(third.lensId)).toBeNull();
  });

});

describe("context lens event bus", () => {
  it("does not expose expired lens snapshots from the global event store", () => {
    const registry = createContextLensRegistry();
    const expired = registry.create({
      messageId: "message-expired-event",
      chatType: "dm",
      trigger: "dm",
      now: 100,
      ttlMs: 1,
    });

    publishContextLensEvent("created", expired);

    expect(findRecentContextLensById(expired.lensId)).toBeNull();
    expect(listRecentContextLensEvents()).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ lens: expect.objectContaining({ lensId: expired.lensId }) })]),
    );
  });

  it("continues publishing when a listener throws", () => {
    const registry = createContextLensRegistry();
    const lens = registry.create({
      messageId: "message-listener-throw",
      chatType: "dm",
      trigger: "dm",
    });
    const received: string[] = [];
    const unsubscribeThrowing = subscribeToContextLensEvents(() => {
      throw new Error("closed response");
    });
    const unsubscribeReceiving = subscribeToContextLensEvents((event) => {
      received.push(event.lens.lensId);
    });

    try {
      expect(() => publishContextLensEvent("created", lens)).not.toThrow();
      expect(received).toContain(lens.lensId);
    } finally {
      unsubscribeThrowing();
      unsubscribeReceiving();
    }
  });

  it("shares recent events across repeated module loads", async () => {
    const registry = createContextLensRegistry();
    const lens = registry.create({
      messageId: "message-global-bus",
      chatType: "dm",
      trigger: "dm",
      sessionKey: "session-global-bus",
    });

    publishContextLensEvent("created", lens);

    // @ts-expect-error Vitest supports query-string imports for duplicate module instances.
    const duplicateBus = await import("./context-lens-events.js?duplicate");

    expect(duplicateBus.findRecentContextLensById(lens.lensId)).toMatchObject({
      lensId: lens.lensId,
      messageId: "message-global-bus",
    });
  });
});
