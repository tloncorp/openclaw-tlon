import { describe, expect, it, vi, afterEach } from "vitest";

vi.mock("@tloncorp/api", () => ({
  uploadFile: vi.fn(),
}));

describe("uploadImageFromUrl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches image and calls uploadFile, returns uploaded URL", async () => {
    const { uploadFile } = await import("@tloncorp/api");
    const mockUploadFile = vi.mocked(uploadFile);
    mockUploadFile.mockResolvedValue({ url: "https://memex.tlon.network/uploaded.png" });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake-image"], { type: "image/png" })),
      }),
    );

    const { uploadImageFromUrl } = await import("./upload.js");
    const result = await uploadImageFromUrl("https://example.com/image.png");

    expect(result).toBe("https://memex.tlon.network/uploaded.png");
    expect(mockUploadFile).toHaveBeenCalledTimes(1);
  });

  it("returns original URL if fetch fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    const { uploadImageFromUrl } = await import("./upload.js");
    const result = await uploadImageFromUrl("https://example.com/image.png");

    expect(result).toBe("https://example.com/image.png");
  });

  it("returns original URL if upload fails", async () => {
    const { uploadFile } = await import("@tloncorp/api");
    const mockUploadFile = vi.mocked(uploadFile);
    mockUploadFile.mockRejectedValue(new Error("Upload failed"));

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(new Blob(["fake-image"], { type: "image/png" })),
      }),
    );

    const { uploadImageFromUrl } = await import("./upload.js");
    const result = await uploadImageFromUrl("https://example.com/image.png");

    expect(result).toBe("https://example.com/image.png");
  });
});
