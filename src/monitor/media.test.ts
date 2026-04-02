import { describe, expect, it } from "vitest";
import { parseBlobData, formatBlobAnnotations } from "./media.js";

// ── parseBlobData ──────────────────────────────────────────────────────────

describe("parseBlobData", () => {
  it("returns null for null/undefined/empty", () => {
    expect(parseBlobData(null)).toBeNull();
    expect(parseBlobData(undefined)).toBeNull();
    expect(parseBlobData("")).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    expect(parseBlobData("not json")).toBeNull();
  });

  it("returns null for empty array", () => {
    expect(parseBlobData("[]")).toBeNull();
  });

  it("parses a file blob", () => {
    const blob = JSON.stringify([
      {
        type: "file",
        version: 1,
        fileUri: "https://storage.example.com/report.pdf",
        mimeType: "application/pdf",
        name: "report.pdf",
        size: 245760,
      },
    ]);
    const result = parseBlobData(blob);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0]).toMatchObject({
      type: "file",
      fileUri: "https://storage.example.com/report.pdf",
      name: "report.pdf",
    });
  });

  it("parses a voice memo blob", () => {
    const blob = JSON.stringify([
      {
        type: "voicememo",
        version: 1,
        fileUri: "https://storage.example.com/memo.m4a",
        size: 51200,
        duration: 12.5,
        transcription: "Hey check this out",
      },
    ]);
    const result = parseBlobData(blob);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0]).toMatchObject({
      type: "voicememo",
      transcription: "Hey check this out",
    });
  });

  it("parses a video blob", () => {
    const blob = JSON.stringify([
      {
        type: "video",
        version: 1,
        fileUri: "https://storage.example.com/clip.mp4",
        mimeType: "video/mp4",
        name: "clip.mp4",
        size: 5242880,
        duration: 30,
      },
    ]);
    const result = parseBlobData(blob);
    expect(result).not.toBeNull();
    expect(result).toHaveLength(1);
    expect(result![0]).toMatchObject({ type: "video", name: "clip.mp4" });
  });

  it("parses multiple entries", () => {
    const blob = JSON.stringify([
      { type: "file", version: 1, fileUri: "https://example.com/a.pdf", size: 100 },
      { type: "voicememo", version: 1, fileUri: "https://example.com/b.m4a", size: 200, duration: 5 },
    ]);
    const result = parseBlobData(blob);
    expect(result).toHaveLength(2);
  });

  it("skips unknown blob types", () => {
    const blob = JSON.stringify([
      { type: "unknown_future_type", version: 99 },
      { type: "file", version: 1, fileUri: "https://example.com/a.pdf", size: 100 },
    ]);
    const result = parseBlobData(blob);
    expect(result).toHaveLength(2);
    expect(result![0]).toMatchObject({ type: "unknown" });
    expect(result![1]).toMatchObject({ type: "file" });
  });
});

// ── formatBlobAnnotations ──────────────────────────────────────────────────

describe("formatBlobAnnotations", () => {
  it("formats a file annotation", () => {
    const text = formatBlobAnnotations([
      {
        type: "file",
        version: 1,
        fileUri: "https://storage.example.com/report.pdf",
        mimeType: "application/pdf",
        name: "report.pdf",
        size: 245760,
      },
    ]);
    expect(text).toContain("📎");
    expect(text).toContain("report.pdf");
    expect(text).toContain("application/pdf");
    expect(text).toContain("240KB");
    expect(text).toContain("https://storage.example.com/report.pdf");
  });

  it("formats a voice memo with transcription", () => {
    const text = formatBlobAnnotations([
      {
        type: "voicememo",
        version: 1,
        fileUri: "https://storage.example.com/memo.m4a",
        size: 51200,
        duration: 12.5,
        transcription: "Hey check this out",
      },
    ]);
    expect(text).toContain("🎙️");
    expect(text).toContain("13s"); // Math.round(12.5) = 13
    expect(text).toContain('"Hey check this out"');
  });

  it("formats a video annotation", () => {
    const text = formatBlobAnnotations([
      {
        type: "video",
        version: 1,
        fileUri: "https://storage.example.com/clip.mp4",
        mimeType: "video/mp4",
        name: "clip.mp4",
        size: 5242880,
      },
    ]);
    expect(text).toContain("🎬");
    expect(text).toContain("clip.mp4");
    expect(text).toContain("video/mp4");
    expect(text).toContain("5.0MB");
  });

  it("returns empty string for unknown-only entries", () => {
    const text = formatBlobAnnotations([{ type: "unknown" }]);
    expect(text).toBe("");
  });

  it("formats multiple entries on separate lines", () => {
    const text = formatBlobAnnotations([
      { type: "file", version: 1, fileUri: "https://example.com/a.pdf", name: "a.pdf", size: 1024 },
      { type: "voicememo", version: 1, fileUri: "https://example.com/b.m4a", size: 2048, duration: 5 },
    ]);
    const lines = text.split("\n").filter(Boolean);
    expect(lines.length).toBeGreaterThanOrEqual(2);
    expect(lines[0]).toContain("📎");
    expect(lines[1]).toContain("🎙️");
  });
});
