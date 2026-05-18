import { describe, expect, it } from "vitest";

import { createContextLensRegistry, hashSessionKey } from "./context-lens.js";

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
    });

    registry.recordContext(lens.lensId, {
      channelMessages: 12,
      citedPosts: 2,
      attachments: 1,
    });
    registry.recordPersistence(lens.lensId, {
      cachesHistory: true,
      writesMedia: true,
      emitsTelemetry: true,
    });
    registry.setStatus(lens.lensId, "dispatching");
    registry.recordToolCall(lens.lensId, "tlon");
    registry.recordToolCall(lens.lensId, "tlon");

    expect(registry.get(lens.lensId)).toMatchObject({
      status: "dispatching",
      context: {
        currentMessage: true,
        threadMessages: 0,
        channelMessages: 12,
        citedPosts: 2,
        attachments: 1,
        pendingNudge: false,
      },
      persistence: {
        postsReply: false,
        updatesSettings: false,
        writesMedia: true,
        emitsTelemetry: true,
        cachesHistory: true,
      },
      tools: {
        ownerOnlyAvailable: [],
        called: ["tlon"],
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
