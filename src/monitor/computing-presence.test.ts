import { describe, expect, test, vi } from "vitest";
import { createComputingPresenceTracker } from "./computing-presence.js";

describe("createComputingPresenceTracker", () => {
  test("publishes thinking state for a new run and sends thinking false when the run stops", async () => {
    const reporter = {
      publish: vi.fn(async () => {}),
    };

    const tracker = createComputingPresenceTracker({ reporter });

    await tracker.refreshRun({
      conversationId: "~nec",
      runId: "run-1",
      disclose: ["~nec"],
    });

    expect(reporter.publish).toHaveBeenCalledWith({
      conversationId: "~nec",
      disclose: ["~nec"],
      thinking: true,
      toolNames: [],
    });

    await tracker.stopRun({
      conversationId: "~nec",
      runId: "run-1",
    });

    expect(reporter.publish).toHaveBeenLastCalledWith({
      conversationId: "~nec",
      disclose: ["~nec"],
      thinking: false,
      toolNames: [],
    });
  });

  test("throttles intermediate tool updates to at most one publish per second", async () => {
    vi.useFakeTimers();

    try {
      const reporter = {
        publish: vi.fn(async () => {}),
      };

      const tracker = createComputingPresenceTracker({ reporter });

      await tracker.refreshRun({
        conversationId: "~nec",
        runId: "run-1",
        disclose: ["~nec"],
      });

      expect(reporter.publish).toHaveBeenCalledTimes(1);

      await tracker.addToolCall({
        conversationId: "~nec",
        runId: "run-1",
        disclose: ["~nec"],
        toolName: "web_fetch",
      });

      await tracker.addToolCall({
        conversationId: "~nec",
        runId: "run-1",
        disclose: ["~nec"],
        toolName: "exec",
      });

      expect(reporter.publish).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(999);
      expect(reporter.publish).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1);
      expect(reporter.publish).toHaveBeenLastCalledWith({
        conversationId: "~nec",
        disclose: ["~nec"],
        thinking: true,
        toolNames: ["web_fetch", "exec"],
      });

      await tracker.clearToolCalls({
        conversationId: "~nec",
        runId: "run-1",
      });

      expect(reporter.publish).toHaveBeenCalledTimes(2);

      await vi.advanceTimersByTimeAsync(1_000);
      expect(reporter.publish).toHaveBeenLastCalledWith({
        conversationId: "~nec",
        disclose: ["~nec"],
        thinking: true,
        toolNames: [],
      });
    } finally {
      vi.useRealTimers();
    }
  });

  test("does not republish identical active state on refresh", async () => {
    const reporter = {
      publish: vi.fn(async () => {}),
    };

    const tracker = createComputingPresenceTracker({ reporter });

    await tracker.refreshRun({
      conversationId: "~nec",
      runId: "run-1",
      disclose: ["~nec"],
    });

    await tracker.refreshRun({
      conversationId: "~nec",
      runId: "run-1",
      disclose: ["~nec"],
    });

    expect(reporter.publish).toHaveBeenCalledTimes(1);
  });

  test("unions active runs in the same conversation", async () => {
    const reporter = {
      publish: vi.fn(async () => {}),
    };

    const tracker = createComputingPresenceTracker({ reporter, minUpdateIntervalMs: 0 });

    await tracker.refreshRun({
      conversationId: "chat/~bus/general",
      runId: "run-1",
      disclose: ["~nec"],
    });
    await tracker.addToolCall({
      conversationId: "chat/~bus/general",
      runId: "run-1",
      disclose: ["~nec"],
      toolName: "web_fetch",
    });

    await tracker.refreshRun({
      conversationId: "chat/~bus/general",
      runId: "run-2",
      disclose: ["~bud"],
    });
    await tracker.addToolCall({
      conversationId: "chat/~bus/general",
      runId: "run-2",
      disclose: ["~bud"],
      toolName: "exec",
    });

    expect(reporter.publish).toHaveBeenLastCalledWith({
      conversationId: "chat/~bus/general",
      disclose: ["~nec", "~bud"],
      thinking: true,
      toolNames: ["web_fetch", "exec"],
    });

    await tracker.stopRun({
      conversationId: "chat/~bus/general",
      runId: "run-1",
    });

    expect(reporter.publish).toHaveBeenNthCalledWith(5, {
      conversationId: "chat/~bus/general",
      disclose: ["~nec"],
      thinking: false,
      toolNames: [],
    });

    expect(reporter.publish).toHaveBeenNthCalledWith(6, {
      conversationId: "chat/~bus/general",
      disclose: ["~bud"],
      thinking: true,
      toolNames: ["exec"],
    });
  });

  test("sends thinking false to the last disclosed audience when a missing run is stopped", async () => {
    const reporter = {
      publish: vi.fn(async () => {}),
    };

    const tracker = createComputingPresenceTracker({ reporter, minUpdateIntervalMs: 0 });

    await tracker.refreshRun({
      conversationId: "~nec",
      runId: "run-1",
      disclose: ["~nec"],
    });

    await tracker.stopRun({
      conversationId: "~nec",
      runId: "run-1",
    });

    await tracker.stopRun({
      conversationId: "~nec",
      runId: "run-1",
    });

    expect(reporter.publish).toHaveBeenCalledTimes(2);
  });
});
