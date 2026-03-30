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
  createTlonTelemetry,
  recordToolCall,
} from "./telemetry.js";

describe("telemetry tool tracking", () => {
  beforeEach(() => {
    _testing.clearToolCalls();
    postHogMocks.identify.mockClear();
    postHogMocks.capture.mockClear();
    postHogMocks.flush.mockClear();
    postHogMocks.shutdown.mockClear();
  });

  function createEnabledTelemetry() {
    return createTlonTelemetry({
      config: {
        enabled: true,
        apiKey: "phc_test",
        host: "https://us.i.posthog.com",
      },
    });
  }

  async function captureReply(params?: {
    sessionKey?: string;
    deliveredMessageCount?: number;
    dispatchError?: unknown;
  }) {
    const telemetry = createEnabledTelemetry();
    const replyTelemetry = telemetry?.startReply({
      sessionKey: params?.sessionKey ?? "session-1",
      ownerShip: "~zod",
      botShip: "~nec",
      chatType: "dm",
      isThreadReply: false,
      senderRole: "owner",
      attachmentCount: 1,
    });

    await replyTelemetry?.capture({
      deliveredMessageCount: params?.deliveredMessageCount ?? 1,
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
      dispatchError: params?.dispatchError,
    });

    await telemetry?.close();
    return postHogMocks.capture.mock.calls.at(-1)?.[0];
  }

  it("captures only tool calls recorded after reply tracking starts", async () => {
    recordToolCall({
      sessionKey: "session-1",
      toolName: "read",
      durationMs: 25,
    });

    const telemetry = createEnabledTelemetry();
    const replyTelemetry = telemetry?.startReply({
      sessionKey: "session-1",
      ownerShip: "~zod",
      botShip: "~nec",
      chatType: "dm",
      isThreadReply: false,
      senderRole: "owner",
      attachmentCount: 1,
    });

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

    await replyTelemetry?.capture({
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
    });

    expect(postHogMocks.capture).toHaveBeenCalledWith({
      distinctId: "~zod",
      event: "TlonBot Reply Handled",
      properties: expect.objectContaining({
        toolCount: 2,
        toolNames: ["web_search", "read"],
        toolTotalDurationMs: 125,
        toolErrorCount: 1,
        toolCalls: [
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
      }),
    });

    await telemetry?.close();
  });

  it("ignores missing session keys", async () => {
    recordToolCall({
      sessionKey: "",
      toolName: "web_search",
      durationMs: 50,
    });

    const capturedEvent = await captureReply({ sessionKey: "session-2" });

    expect(capturedEvent?.properties.toolCalls).toEqual([]);
    expect(capturedEvent?.properties.toolNames).toEqual([]);
    expect(capturedEvent?.properties.toolCount).toBe(0);
    expect(capturedEvent?.properties.toolTotalDurationMs).toBe(0);
    expect(capturedEvent?.properties.toolErrorCount).toBe(0);
  });

  it("classifies reply outcomes", async () => {
    await captureReply({ deliveredMessageCount: 1 });
    expect(postHogMocks.capture.mock.calls.at(-1)?.[0]?.properties.outcome).toBe("responded");

    await captureReply({ deliveredMessageCount: 0 });
    expect(postHogMocks.capture.mock.calls.at(-1)?.[0]?.properties.outcome).toBe("no_reply");

    await captureReply({
      deliveredMessageCount: 0,
      dispatchError: new Error("boom"),
    });
    expect(postHogMocks.capture.mock.calls.at(-1)?.[0]?.properties.outcome).toBe("error");
  });

  it("captures camelCase telemetry properties without routing metadata", async () => {
    const telemetry = createEnabledTelemetry();
    const replyTelemetry = telemetry?.startReply({
      sessionKey: "session-1",
      ownerShip: "~zod",
      botShip: "~nec",
      chatType: "dm",
      isThreadReply: false,
      senderRole: "owner",
      attachmentCount: 1,
    });

    recordToolCall({
      sessionKey: "session-1",
      toolName: "web_search",
      durationMs: 125,
    });

    await replyTelemetry?.capture({
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
