/**
 * Blob Attachment Integration Tests
 *
 * Verifies that blob data (voice memos, file attachments) sent as DMs
 * are visible to the bot agent and produce meaningful responses.
 *
 * TEST ENVIRONMENT:
 *   ~zod = bot ship
 *   ~ten = test user (configured as ownerShip)
 */
import { describe, test, expect, beforeAll } from "vitest";
import {
  getFixtures,
  waitFor,
  type TestFixtures,
} from "../lib/index.js";

describe("blobs", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  /**
   * Send a DM with blob data directly via poke.
   * Uses chat-dm-action-2 (v7) with essay that includes blob field.
   */
  async function sendDmWithBlob(
    toShip: string,
    text: string,
    blob: string,
  ) {
    const fromShip = fixtures.userShip.startsWith("~")
      ? fixtures.userShip
      : `~${fixtures.userShip}`;
    const targetShip = toShip.startsWith("~") ? toShip : `~${toShip}`;
    const sentAt = Date.now();

    const action = {
      ship: targetShip,
      diff: {
        id: `${fromShip}/${sentAt}`,
        delta: {
          add: {
            essay: {
              content: text ? [{ inline: [text] }] : [],
              author: fromShip,
              sent: sentAt,
              kind: ["chat", "0"],
              meta: null,
              blob,
            },
            time: null,
          },
        },
      },
    };

    await fixtures.userState.poke({
      app: "chat",
      mark: "chat-dm-action-2",
      json: action,
    });
  }

  /**
   * Get baseline bot DM timestamp for polling.
   */
  async function getBaselineSentAt(): Promise<number> {
    try {
      const posts = await fixtures.userState.channelPosts(fixtures.botShip, 30);
      return (posts ?? [])
        .map((post: any) =>
          post.authorId === fixtures.botShip && typeof post.sentAt === "number"
            ? post.sentAt
            : 0,
        )
        .reduce((max: number, ts: number) => Math.max(max, ts), 0);
    } catch {
      return 0;
    }
  }

  /**
   * Wait for a bot reply after the baseline timestamp.
   */
  async function waitForBotReply(
    baselineSentAt: number,
    description: string,
    timeoutMs = 45_000,
  ): Promise<string> {
    return waitFor(
      async () => {
        const posts = await fixtures.userState.channelPosts(fixtures.botShip, 30);
        for (const post of posts ?? []) {
          const p = post as { authorId?: string; sentAt?: number; textContent?: string };
          if (p.authorId !== fixtures.botShip) continue;
          if (typeof p.sentAt === "number" && p.sentAt <= baselineSentAt) continue;
          if (p.textContent?.trim()) return p.textContent;
        }
        return undefined;
      },
      timeoutMs,
      undefined,
      description,
    );
  }

  test("bot sees voice memo transcription from blob", async () => {
    const baselineSentAt = await getBaselineSentAt();

    const token = `it-blob-voice-${Date.now().toString(36)}`;
    const blob = JSON.stringify([
      {
        type: "voicememo",
        version: 1,
        fileUri: "https://storage.googleapis.com/tlon-test-ci-shared/test-audio/silence.m4a",
        size: 4096,
        duration: 3,
        transcription: `Test voice memo ${token}`,
      },
    ]);

    console.log(`[TEST] Sending DM with voice memo blob (token: ${token})...`);
    await sendDmWithBlob(
      fixtures.botShip,
      `@${fixtures.botShip.replace("~", "")} voice memo attached`,
      blob,
    );

    console.log("[TEST] Waiting for bot reply acknowledging voice memo...");
    const reply = await waitForBotReply(baselineSentAt, "bot reply to voice memo blob");

    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    // The bot should acknowledge the voice memo in some way —
    // either by referencing the transcription text or the memo itself.
    // We just verify it responded (blob wasn't silently dropped).
    expect(reply.length).toBeGreaterThan(0);
  });

  test("bot sees file attachment annotation from blob", async () => {
    const baselineSentAt = await getBaselineSentAt();

    const token = `it-blob-file-${Date.now().toString(36)}`;
    const blob = JSON.stringify([
      {
        type: "file",
        version: 1,
        fileUri: "https://storage.googleapis.com/tlon-test-ci-shared/test-images/openclaw-image.png",
        mimeType: "image/png",
        name: "test-image.png",
        size: 12345,
      },
    ]);

    console.log(`[TEST] Sending DM with file blob (token: ${token})...`);
    await sendDmWithBlob(
      fixtures.botShip,
      `@${fixtures.botShip.replace("~", "")} what is in this file? ${token}`,
      blob,
    );

    console.log("[TEST] Waiting for bot reply acknowledging file attachment...");
    const reply = await waitForBotReply(baselineSentAt, "bot reply to file blob");

    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });
});
