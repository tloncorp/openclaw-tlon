import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { readFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import * as path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk";
import { getDefaultSsrFPolicy } from "../urbit/context.js";

// Lazy-loaded PDFParse class to avoid startup cost
let PDFParseClass: (new (options: { data: Uint8Array }) => {
  getText: () => Promise<{ text: string; total: number }>;
  destroy: () => Promise<void>;
}) | undefined;

// Default to OpenClaw workspace media directory
const DEFAULT_MEDIA_DIR = path.join(homedir(), ".openclaw", "workspace", "media", "inbound");

export interface ExtractedImage {
  url: string;
  alt?: string;
}

export interface DownloadedMedia {
  localPath: string;
  contentType: string;
  originalUrl: string;
}

/**
 * Extract image blocks from Tlon message content.
 * Returns array of image URLs found in the message.
 */
export function extractImageBlocks(content: unknown): ExtractedImage[] {
  if (!content || !Array.isArray(content)) {
    return [];
  }

  const images: ExtractedImage[] = [];

  for (const verse of content) {
    if (verse?.block?.image?.src) {
      images.push({
        url: verse.block.image.src,
        alt: verse.block.image.alt,
      });
    }
  }

  return images;
}

/**
 * Download a media file from URL to local storage.
 * Returns the local path where the file was saved.
 */
export async function downloadMedia(
  url: string,
  mediaDir: string = DEFAULT_MEDIA_DIR,
): Promise<DownloadedMedia | null> {
  try {
    // Validate URL is http/https before fetching
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      console.warn(`[tlon-media] Rejected non-http(s) URL: ${url}`);
      return null;
    }

    // Ensure media directory exists
    await mkdir(mediaDir, { recursive: true });

    // Fetch with SSRF protection
    // Use fetchWithSsrFGuard directly (not urbitFetch) to preserve the full URL path
    const { response, release } = await fetchWithSsrFGuard({
      url,
      init: { method: "GET" },
      policy: getDefaultSsrFPolicy(),
      auditContext: "tlon-media-download",
    });

    try {
      if (!response.ok) {
        console.error(`[tlon-media] Failed to fetch ${url}: ${response.status}`);
        return null;
      }

      // Determine content type and extension
      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const ext = getExtensionFromContentType(contentType) || getExtensionFromUrl(url) || "bin";

      // Generate unique filename
      const filename = `${randomUUID()}.${ext}`;
      const localPath = path.join(mediaDir, filename);

      // Stream to file
      const body = response.body;
      if (!body) {
        console.error(`[tlon-media] No response body for ${url}`);
        return null;
      }

      const writeStream = createWriteStream(localPath);
      await pipeline(Readable.fromWeb(body as any), writeStream);

      return {
        localPath,
        contentType,
        originalUrl: url,
      };
    } finally {
      await release();
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[tlon-media] Error downloading ${url}: ${message}`);
    return null;
  }
}

function getExtensionFromContentType(contentType: string): string | null {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "text/plain": "txt",
    "text/csv": "csv",
    "audio/mp4": "m4a",
    "audio/aac": "aac",
    "audio/wav": "wav",
    "audio/x-m4a": "m4a",
  };
  return map[contentType.split(";")[0].trim()] ?? null;
}

function getExtensionFromUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-z0-9]+)$/i);
    return match ? match[1].toLowerCase() : null;
  } catch {
    return null;
  }
}

/**
 * Download all images from a message and return attachment metadata.
 * Format matches OpenClaw's expected attachment structure.
 */
export async function downloadMessageImages(
  content: unknown,
  mediaDir?: string,
): Promise<Array<{ path: string; contentType: string }>> {
  const images = extractImageBlocks(content);
  if (images.length === 0) {
    return [];
  }

  const attachments: Array<{ path: string; contentType: string }> = [];

  for (const image of images) {
    const downloaded = await downloadMedia(image.url, mediaDir);
    if (downloaded) {
      attachments.push({
        path: downloaded.localPath,
        contentType: downloaded.contentType,
      });
    }
  }

  return attachments;
}

// ─── Blob (essay.blob) support ───────────────────────────────────────────────

/**
 * Parsed representation of a single entry in the essay.blob JSON array.
 */
export interface ParsedBlobEntry {
  type: "voicememo" | "file" | "video" | "unknown";
  fileUri?: string;
  mimeType?: string;
  name?: string;
  size?: number;
  transcription?: string;
  duration?: number;
}

/**
 * Parse the essay.blob JSON string into structured entries.
 * Returns an empty array on null / invalid input — never throws.
 */
export function parseBlobData(blob: string | null | undefined): ParsedBlobEntry[] {
  if (!blob) return [];
  let raw: unknown;
  try {
    raw = JSON.parse(blob);
  } catch {
    console.warn("[tlon-media] Could not parse blob JSON");
    return [];
  }
  if (!Array.isArray(raw)) return [];

  const entries: ParsedBlobEntry[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const entry = item as Record<string, unknown>;
    const type = entry.type;
    if (type === "voicememo") {
      entries.push({
        type: "voicememo",
        fileUri: typeof entry.fileUri === "string" ? entry.fileUri : undefined,
        size: typeof entry.size === "number" ? entry.size : undefined,
        transcription: typeof entry.transcription === "string" ? entry.transcription : undefined,
        duration: typeof entry.duration === "number" ? entry.duration : undefined,
      });
    } else if (type === "file") {
      entries.push({
        type: "file",
        fileUri: typeof entry.fileUri === "string" ? entry.fileUri : undefined,
        mimeType: typeof entry.mimeType === "string" ? entry.mimeType : undefined,
        name: typeof entry.name === "string" ? entry.name : undefined,
        size: typeof entry.size === "number" ? entry.size : undefined,
      });
    } else if (type === "video") {
      entries.push({
        type: "video",
        fileUri: typeof entry.fileUri === "string" ? entry.fileUri : undefined,
        mimeType: typeof entry.mimeType === "string" ? entry.mimeType : undefined,
        name: typeof entry.name === "string" ? entry.name : undefined,
        size: typeof entry.size === "number" ? entry.size : undefined,
        duration: typeof entry.duration === "number" ? entry.duration : undefined,
      });
    } else {
      entries.push({ type: "unknown" });
    }
  }
  return entries;
}

/**
 * Extract voice memo transcription strings from blob data.
 * Returns an empty array when there are no transcriptions.
 */
export function extractTranscriptions(blob: string | null | undefined): string[] {
  return parseBlobData(blob)
    .filter((e): e is ParsedBlobEntry & { type: "voicememo"; transcription: string } =>
      e.type === "voicememo" && typeof e.transcription === "string" && e.transcription.length > 0,
    )
    .map((e) => e.transcription);
}

/**
 * Download file attachments (PDFs, docs, etc.) from blob data.
 * Skips voice memos and entries without a fileUri.
 * Returns attachment metadata compatible with OpenClaw's expected format.
 */
export async function downloadBlobFiles(
  blob: string | null | undefined,
  mediaDir?: string,
): Promise<Array<{ path: string; contentType: string; name?: string }>> {
  const entries = parseBlobData(blob);
  const downloadable = entries.filter(
    (e): e is ParsedBlobEntry & { fileUri: string } =>
      (e.type === "file" || e.type === "video") && typeof e.fileUri === "string",
  );

  if (downloadable.length === 0) return [];

  const attachments: Array<{ path: string; contentType: string; name?: string }> = [];

  for (const entry of downloadable) {
    const downloaded = await downloadMedia(entry.fileUri, mediaDir);
    if (downloaded) {
      attachments.push({
        path: downloaded.localPath,
        contentType: entry.mimeType ?? downloaded.contentType,
        ...(entry.name ? { name: entry.name } : {}),
      });
    }
  }

  return attachments;
}

// ─── PDF text extraction ─────────────────────────────────────────────────────

/** Max chars of extracted PDF text to prepend to the message. */
const PDF_EXCERPT_MAX_CHARS = 8000;

/**
 * Extract text from PDF attachments and return a context string to prepend.
 * Uses `pdf-parse` (pure JS, no native deps). Returns empty string if no PDFs
 * or extraction fails.
 */
export async function extractPdfText(
  attachments: Array<{ path: string; contentType: string; name?: string }>,
): Promise<string> {
  const pdfAttachments = attachments.filter(
    (a) =>
      a.contentType === "application/pdf" ||
      a.path.toLowerCase().endsWith(".pdf"),
  );

  if (pdfAttachments.length === 0) return "";

  // Lazy-load pdf-parse on first use
  if (!PDFParseClass) {
    try {
      const mod = await import("pdf-parse");
      PDFParseClass = mod.PDFParse as unknown as typeof PDFParseClass;
    } catch (err) {
      console.warn("[tlon-media] pdf-parse not available, skipping PDF text extraction");
      return "";
    }
  }

  const sections: string[] = [];

  for (const att of pdfAttachments) {
    let parser: InstanceType<NonNullable<typeof PDFParseClass>> | undefined;
    try {
      const buf = await readFile(att.path);
      parser = new PDFParseClass!({ data: new Uint8Array(buf) });
      const result = await parser.getText();
      const text = result.text?.trim();
      if (!text) continue;

      const label = att.name ?? path.basename(att.path);
      const pages = result.total ?? "?";
      const truncated = text.length > PDF_EXCERPT_MAX_CHARS;
      const excerpt = truncated
        ? text.slice(0, PDF_EXCERPT_MAX_CHARS) + "…"
        : text;

      sections.push(
        `[PDF: "${label}" (${pages} pages${truncated ? ", truncated" : ""})]\n${excerpt}`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[tlon-media] Failed to extract text from ${att.path}: ${msg}`);
    } finally {
      await parser?.destroy().catch(() => {});
    }
  }

  return sections.join("\n\n");
}
