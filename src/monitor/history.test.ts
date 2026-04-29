import { describe, expect, it } from "vitest";

import {
  buildThreadContextMessage,
  fetchParentPostHistoryEntry,
  retainThreadContextMessages,
  type TlonHistoryEntry,
} from "./history.js";

function makeEntry(overrides: Partial<TlonHistoryEntry> = {}): TlonHistoryEntry {
  return {
    author: "~zod",
    content: "message",
    timestamp: 1,
    id: "1",
    ...overrides,
  };
}

describe("fetchParentPostHistoryEntry", () => {
  it("extracts parent post text from memo-shaped post payloads", async () => {
    const api = {
      scry: async () => ({
        post: {
          memo: {
            author: "~nec",
            sent: 123,
            content: [{ inline: ["Parent post from memo"] }],
          },
          seal: { id: "170.141.184.507.939.843.704.966.283.402.546.249.728" },
        },
      }),
    };

    const entry = await fetchParentPostHistoryEntry(
      api,
      "diary/~ship/plans",
      "170141184507939843704966283402546249728",
    );

    expect(entry).toEqual({
      author: "~nec",
      content: "Parent post from memo",
      timestamp: 123,
      id: "170.141.184.507.939.843.704.966.283.402.546.249.728",
    });
  });
});

describe("retainThreadContextMessages", () => {
  it("keeps parent plus last N-1 replies when truncating", () => {
    const history = [
      makeEntry({ id: "parent", content: "PARENT", timestamp: 0 }),
      ...Array.from({ length: 25 }, (_, index) =>
        makeEntry({
          id: `reply-${index + 1}`,
          content: `reply ${index + 1}`,
          timestamp: index + 1,
        }),
      ),
    ];

    const retained = retainThreadContextMessages(history, 20);

    expect(retained).toHaveLength(20);
    expect(retained[0]?.content).toBe("PARENT");
    expect(retained.slice(1).map((entry) => entry.content)).toEqual(
      Array.from({ length: 19 }, (_, index) => `reply ${index + 7}`),
    );
  });
});

describe("buildThreadContextMessage", () => {
  it("includes the parent post body in the emitted previous-messages block", () => {
    const history = [
      makeEntry({ author: "~nec", content: "Heartbeat to System Cron Migration Plan", id: "parent" }),
      makeEntry({ author: "~zod", content: "latest reply", id: "reply-1", timestamp: 2 }),
    ];

    const result = buildThreadContextMessage(history, "hello?", {
      formatAuthor: (author) => author,
      sanitizeContent: (content) => content,
    });

    expect(result).not.toBeNull();
    expect(result?.contextMessages).toEqual(history);
    expect(result?.messageText).toContain("[Previous messages]");
    expect(result?.messageText).toContain("~nec: Heartbeat to System Cron Migration Plan");
    expect(result?.messageText).toContain("~zod: latest reply");
    expect(result?.messageText).toContain("[Current message]\nhello?");
  });
});
