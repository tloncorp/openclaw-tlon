import { describe, expect, it, vi } from "vitest";
import { createPendingNudgePersistenceQueue } from "./pending-nudge-persistence.js";

describe("pending-nudge-persistence", () => {
  it("serializes writes in enqueue order", async () => {
    const calls: string[] = [];
    let releaseFirst: (() => void) | null = null;

    const queue = createPendingNudgePersistenceQueue(async (nudge) => {
      calls.push(nudge ? `start:${nudge.stage}` : "start:clear");
      if (nudge?.stage === 1) {
        await new Promise<void>((resolve) => {
          releaseFirst = resolve;
        });
      }
      calls.push(nudge ? `end:${nudge.stage}` : "end:clear");
    });

    queue.enqueue({
      sentAt: 1,
      stage: 1,
      ownerShip: "~zod",
      accountId: "default",
      sessionKey: "sess-1",
      provider: null,
      model: null,
    });
    queue.enqueue(null);

    await vi.waitFor(() => {
      expect(calls).toEqual(["start:1"]);
    });

    releaseFirst?.();
    await queue.flush();

    expect(calls).toEqual(["start:1", "end:1", "start:clear", "end:clear"]);
  });
});
