import { beforeEach, describe, expect, it, vi } from "vitest";

const postHogMocks = vi.hoisted(() => ({
  identify: vi.fn(),
  capture: vi.fn(),
  flush: vi.fn().mockResolvedValue(undefined),
  shutdown: vi.fn(),
}));

vi.mock("posthog-node", () => ({
  PostHog: vi.fn(
    class MockPostHog {
      constructor() {
        return postHogMocks;
      }
    },
  ),
}));

import {
  _testing,
  collectToolUsageSince,
  createTlonTelemetry,
  createToolTraceCursor,
  recordToolCall,
  resolveReplyOutcome,
} from "./telemetry.js";

describe("telemetry tool tracking", () => {
  beforeEach(() => {
    _testing.clearToolCalls();
    postHogMocks.identify.mockClear();
    postHogMocks.capture.mockClear();
    postHogMocks.flush.mockClear();
    postHogMocks.shutdown.mockClear();
  });

  it("collects tool calls recorded after a cursor", () => {
    const cursor = createToolTraceCursor("session-1");

    recordToolCall({
      sessionKey: "session-1",
      toolName: "web_search",
      durationMs: 125,
    });
    recordToolCall({
      sessionKey: "session-1",
      toolName: "read",
      error: "tool failed",
    });

    expect(collectToolUsageSince("session-1", cursor)).toEqual({
      calls: [
        {
          toolName: "web_search",
          durationMs: 125,
          error: null,
        },
        {
          toolName: "read",
          durationMs: null,
          error: "tool failed",
        },
      ],
      names: ["web_search", "read"],
      totalDurationMs: 125,
      errorCount: 1,
    });
  });

  it("ignores missing session keys", () => {
    recordToolCall({
      sessionKey: "",
      toolName: "web_search",
      durationMs: 50,
    });

    expect(collectToolUsageSince("session-2", 0)).toEqual({
      calls: [],
      names: [],
      totalDurationMs: 0,
      errorCount: 0,
    });
  });

  it("classifies reply outcomes", () => {
    expect(resolveReplyOutcome({ deliveredMessageCount: 1 })).toBe("responded");
    expect(resolveReplyOutcome({ deliveredMessageCount: 0 })).toBe("no_reply");
    expect(
      resolveReplyOutcome({ deliveredMessageCount: 0, dispatchError: new Error("boom") }),
    ).toBe("error");
  });

  it("captures camelCase telemetry properties without routing metadata", async () => {
    const telemetry = createTlonTelemetry({
      config: {
        enabled: true,
        apiKey: "phc_test",
        host: "https://us.i.posthog.com",
      },
    });

    telemetry?.captureReplyOutcome({
      ownerShip: "~zod",
      botShip: "~nec",
      outcome: "responded",
      chatType: "dm",
      isThreadReply: false,
      senderRole: "owner",
      attachmentCount: 1,
      deliveredMessageCount: 1,
      replyCharCount: 42,
      replyWordCount: 7,
      replyMediaCount: 0,
      dispatchDurationMs: 250,
      queuedFinal: false,
      queuedFinalCount: 1,
      queuedBlockCount: 0,
      provider: "anthropic",
      model: "claude-test",
      thinkLevel: null,
      toolUsage: {
        calls: [
          {
            toolName: "web_search",
            durationMs: 125,
            error: null,
          },
        ],
        names: ["web_search"],
        totalDurationMs: 125,
        errorCount: 0,
      },
    });

    expect(postHogMocks.identify).toHaveBeenCalledWith({
      distinctId: "~zod",
      properties: {
        logSource: "openclawPlugin",
        tlonOwnerShip: "~zod",
        tlonBotShip: "~nec",
      },
    });

    expect(postHogMocks.capture).toHaveBeenCalledWith({
      distinctId: "~zod",
      event: "TlonBot Reply Handled",
      properties: {
        logSource: "openclawPlugin",
        botShip: "~nec",
        ownerShip: "~zod",
        outcome: "responded",
        chatType: "dm",
        isThreadReply: false,
        senderRole: "owner",
        attachmentCount: 1,
        hasAttachments: true,
        deliveredMessageCount: 1,
        replyCharCount: 42,
        replyWordCount: 7,
        replyMediaCount: 0,
        dispatchDurationMs: 250,
        queuedFinal: false,
        queuedFinalCount: 1,
        queuedBlockCount: 0,
        provider: "anthropic",
        model: "claude-test",
        thinkLevel: null,
        toolCount: 1,
        toolNames: ["web_search"],
        toolTotalDurationMs: 125,
        toolErrorCount: 0,
        toolCalls: [
          {
            toolName: "web_search",
            durationMs: 125,
            error: null,
          },
        ],
      },
    });

    const capturedEvent = postHogMocks.capture.mock.calls[0]?.[0];
    expect(capturedEvent?.properties).not.toHaveProperty("accountId");
    expect(capturedEvent?.properties).not.toHaveProperty("agentId");
    expect(capturedEvent?.properties).not.toHaveProperty("channel");

    await telemetry?.close();

    expect(postHogMocks.flush).toHaveBeenCalledTimes(1);
    expect(postHogMocks.shutdown).toHaveBeenCalledTimes(1);
  });
});
