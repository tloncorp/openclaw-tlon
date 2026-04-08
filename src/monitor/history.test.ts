import { describe, expect, it } from "vitest";
import { renderHistoryContent, type TlonHistoryEntry } from "./history.js";

describe("renderHistoryContent", () => {
  it("returns text content when no blob", () => {
    const entry: TlonHistoryEntry = {
      author: "~zod",
      content: "Hello world",
      timestamp: Date.now(),
    };
    expect(renderHistoryContent(entry)).toBe("Hello world");
  });

  it("returns blob annotation when no text content", () => {
    const entry: TlonHistoryEntry = {
      author: "~zod",
      content: "",
      timestamp: Date.now(),
      blob: JSON.stringify([
        { type: "voicememo", version: 1, duration: 10, transcription: "Hey there" },
      ]),
    };
    expect(renderHistoryContent(entry)).toBe('[🎙️ voice memo: "Hey there"]');
  });

  it("combines blob annotation with text content", () => {
    const entry: TlonHistoryEntry = {
      author: "~zod",
      content: "Check this out",
      timestamp: Date.now(),
      blob: JSON.stringify([
        { type: "file", version: 1, name: "notes.pdf" },
      ]),
    };
    const result = renderHistoryContent(entry);
    expect(result).toBe("[📎 notes.pdf]\nCheck this out");
  });

  it("surfaces voice memo transcript prominently in history", () => {
    const entry: TlonHistoryEntry = {
      author: "~zod",
      content: "",
      timestamp: Date.now(),
      blob: JSON.stringify([
        {
          type: "voicememo",
          version: 1,
          duration: 30,
          transcription: "Can you look into the deploy issue from yesterday",
        },
      ]),
    };
    const result = renderHistoryContent(entry);
    expect(result).toContain("Can you look into the deploy issue from yesterday");
    expect(result).toContain("🎙️");
  });

  it("handles null/undefined blob gracefully", () => {
    expect(renderHistoryContent({ author: "~zod", content: "hi", timestamp: 0, blob: null })).toBe("hi");
    expect(renderHistoryContent({ author: "~zod", content: "hi", timestamp: 0, blob: undefined })).toBe("hi");
  });

  it("handles invalid blob JSON gracefully", () => {
    const entry: TlonHistoryEntry = {
      author: "~zod",
      content: "text",
      timestamp: Date.now(),
      blob: "not-valid-json",
    };
    expect(renderHistoryContent(entry)).toBe("text");
  });

  it("handles blob with only unknown types", () => {
    const entry: TlonHistoryEntry = {
      author: "~zod",
      content: "",
      timestamp: Date.now(),
      blob: JSON.stringify([{ type: "unknown_future", version: 99 }]),
    };
    // Unknown types produce no output, and content is empty
    expect(renderHistoryContent(entry)).toBe("");
  });

  it("renders multiple blob entries with text", () => {
    const entry: TlonHistoryEntry = {
      author: "~zod",
      content: "Here are the files",
      timestamp: Date.now(),
      blob: JSON.stringify([
        { type: "file", version: 1, name: "a.pdf" },
        { type: "file", version: 1, name: "b.txt" },
      ]),
    };
    const result = renderHistoryContent(entry);
    expect(result).toBe("[📎 a.pdf]\n[📎 b.txt]\nHere are the files");
  });
});
