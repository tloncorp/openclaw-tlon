import { sendPost } from "@tloncorp/api";
import type { Story } from "./story.js";

/**
 * A2UI blob — structured interactive card for Tlon channels.
 * See tlon-skill references/a2ui-components.md for full schema.
 */
export type A2UIBlobItem = {
  type: "a2ui";
  version: 1;
  root: string;
  title?: string;
  icon?: string;
  components: Array<{
    id: string;
    component: Record<string, unknown>;
  }>;
};

export type SendBlobPostParams = {
  fromShip: string;
  /** Full nest: "chat/~host/channel", "heap/~host/channel", or "diary/~host/channel" */
  nest: string;
  /** The blob array. Will be JSON.stringified before sending. */
  blob: unknown[];
  /** Optional caption shown as plain text alongside the blob */
  caption?: string;
  botProfile?: { nickname?: string | null; avatar?: string | null };
};

/**
 * Post a blob (A2UI, chart, table, etc.) to a Tlon channel.
 * Uses @tloncorp/api sendPost with the blob field.
 */
export async function sendBlobPost({
  fromShip,
  nest,
  blob,
  caption,
  botProfile,
}: SendBlobPostParams): Promise<{ channel: string; messageId: string }> {
  const sentAt = Date.now();

  const content: Story = caption
    ? [{ inline: [caption] }]
    : [{ inline: [""] }];

  await sendPost({
    channelId: nest,
    authorId: fromShip,
    sentAt,
    content,
    blob: JSON.stringify(blob),
    botProfile: botProfile ?? undefined,
  });

  return { channel: "tlon", messageId: `${fromShip}/${sentAt}` };
}

/**
 * Validate basic A2UI blob structure.
 * Returns error string if invalid, null if ok.
 */
export function validateA2UIBlob(blob: unknown): string | null {
  if (!Array.isArray(blob) || blob.length === 0) {
    return "Blob must be a non-empty array";
  }
  const item = blob[0] as Record<string, unknown>;
  if (item.type !== "a2ui") {
    return `Expected type "a2ui", got "${String(item.type)}"`;
  }
  if (item.version !== 1) {
    return `Expected version 1, got ${String(item.version)}`;
  }
  if (typeof item.root !== "string") {
    return "Missing required field: root (must be string)";
  }
  if (!Array.isArray(item.components)) {
    return "Missing required field: components (must be array)";
  }
  return null;
}
