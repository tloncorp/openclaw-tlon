import { describe, expect, it } from "vitest";
import { createContextLensRegistry, hashSessionKey } from "./context-lens.js";
import { publishContextLensEvent } from "./context-lens-events.js";

describe("context lens registry", () => {
  it("creates redacted receipts without storing raw session keys or prompt text", () => {
    const registry = createContextLensRegistry({ ttlMs: 1_000 });
    const lens = registry.create({
      messageId: "message-1",
      chatType: "dm",
      trigger: "dm",
      sessionKey: "agent:test:tlon:direct:~ten",
      now: 100,
    });

    expect(lens).toMatchObject({
      messageId: "message-1",
      chatType: "dm",
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
  it("shares recent events across repeated module loads", async () => {
    const registry = createContextLensRegistry();
    const lens = registry.create({
      messageId: "message-global-bus",
      chatType: "dm",
      trigger: "dm",
      sessionKey: "session-global-bus",
    });

    publishContextLensEvent("created", lens);

    const duplicateBus = await import("./context-lens-events.js?duplicate");

    expect(duplicateBus.findRecentContextLensById(lens.lensId)).toMatchObject({
      lensId: lens.lensId,
      messageId: "message-global-bus",
    });
  });
});
