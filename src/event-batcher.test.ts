import { describe, expect, it, vi } from "vitest";
import { EventBatcher } from "./event-batcher.js";

describe("EventBatcher", () => {
  it("batches events by key and flushes after window", async () => {
    vi.useFakeTimers();
    const flushed: Array<Array<{ key: string }>> = [];

    const batcher = new EventBatcher<{ key: string }>({
      windowMs: 50,
      buildKey: (event) => event.key,
      onFlush: async (_key, events) => {
        flushed.push(events.map((entry) => entry.event));
      },
    });

    batcher.queueEvent({ key: "alpha" });
    batcher.queueEvent({ key: "alpha" });

    await vi.advanceTimersByTimeAsync(60);

    expect(flushed).toHaveLength(1);
    expect(flushed[0]).toHaveLength(2);
    vi.useRealTimers();
  });

  it("flushes immediately when window is zero", async () => {
    const flushed: Array<Array<{ key: string }>> = [];
    const batcher = new EventBatcher<{ key: string }>({
      windowMs: 0,
      buildKey: (event) => event.key,
      onFlush: async (_key, events) => {
        flushed.push(events.map((entry) => entry.event));
      },
    });

    batcher.queueEvent({ key: "now" });

    expect(flushed).toHaveLength(1);
    expect(flushed[0]).toHaveLength(1);
  });
});
