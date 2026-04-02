/**
 * Blob Attachment Integration Tests
 *
 * Verifies that blob data (voice memos, file attachments) sent as DMs,
 * DM replies, channel posts, and channel replies are visible to the bot
 * agent and produce meaningful responses.
 *
 * TEST ENVIRONMENT:
 *   ~zod = bot ship
 *   ~ten = test user (configured as ownerShip)
 */
import { describe, test, expect, beforeAll } from "vitest";
import {
  getFixtures,
  requireFixtureGroup,
  waitFor,
  type TestFixtures,
} from "../lib/index.js";

describe("blobs", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  function fromShip(): string {
    return fixtures.userShip.startsWith("~")
      ? fixtures.userShip
      : `~${fixtures.userShip}`;
  }

  function botShip(): string {
    return fixtures.botShip.startsWith("~")
      ? fixtures.botShip
      : `~${fixtures.botShip}`;
  }

  // ── Poke helpers ─────────────────────────────────────────────────────

  /** Send a top-level DM with blob via chat-dm-action-2 */
  async function sendDmWithBlob(text: string, blob: string) {
    const sentAt = Date.now();
    await fixtures.userState.poke({
      app: "chat",
      mark: "chat-dm-action-2",
      json: {
        ship: botShip(),
        diff: {
          id: `${fromShip()}/${sentAt}`,
          delta: {
            add: {
              essay: {
                content: text ? [{ inline: [text] }] : [],
                author: fromShip(),
                sent: sentAt,
                kind: ["chat", "0"],
                meta: null,
                blob,
              },
              time: null,
            },
          },
        },
      },
    });
    return sentAt;
  }

  /** Send a DM thread reply with blob via chat-dm-action-2 */
  async function sendDmReplyWithBlob(
    parentId: string,
    text: string,
    blob: string,
  ) {
    const sentAt = Date.now();
    await fixtures.userState.poke({
      app: "chat",
      mark: "chat-dm-action-2",
      json: {
        ship: botShip(),
        diff: {
          id: parentId,
          delta: {
            reply: {
              id: parentId,
              meta: null,
              delta: {
                add: {
                  "reply-essay": {
                    content: text ? [{ inline: [text] }] : [],
                    author: fromShip(),
                    sent: sentAt,
                    blob,
                  },
                  time: null,
                },
              },
            },
          },
        },
      },
    });
    return sentAt;
  }

  /** Send a channel post with blob via channel-action-2 */
  async function sendChannelPostWithBlob(
    nest: string,
    text: string,
    blob: string,
  ) {
    const sentAt = Date.now();
    await fixtures.userState.poke({
      app: "channels",
      mark: "channel-action-2",
      json: {
        channel: {
          nest,
          action: {
            post: {
              add: {
                content: text ? [{ inline: [text] }] : [],
                author: fromShip(),
                sent: sentAt,
                kind: ["chat", "0"],
                meta: null,
                blob,
              },
            },
          },
        },
      },
    });
    return sentAt;
  }

  /** Send a channel thread reply with blob via channel-action-2 */
  async function sendChannelReplyWithBlob(
    nest: string,
    parentId: string,
    text: string,
    blob: string,
  ) {
    const sentAt = Date.now();
    await fixtures.userState.poke({
      app: "channels",
      mark: "channel-action-2",
      json: {
        channel: {
          nest,
          action: {
            post: {
              reply: {
                id: parentId,
                action: {
                  add: {
                    content: text ? [{ inline: [text] }] : [],
                    author: fromShip(),
                    sent: sentAt,
                    blob,
                  },
                },
              },
            },
          },
        },
      },
    });
    return sentAt;
  }

  // ── Polling helpers ──────────────────────────────────────────────────

  async function getDmBaselineSentAt(): Promise<number> {
    try {
      const posts = await fixtures.userState.channelPosts(botShip(), 30);
      return (posts ?? [])
        .map((post: any) =>
          post.authorId === botShip() && typeof post.sentAt === "number"
            ? post.sentAt
            : 0,
        )
        .reduce((max: number, ts: number) => Math.max(max, ts), 0);
    } catch {
      return 0;
    }
  }

  async function waitForDmReply(
    baselineSentAt: number,
    description: string,
    timeoutMs = 45_000,
  ): Promise<string> {
    return waitFor(
      async () => {
        const posts = await fixtures.userState.channelPosts(botShip(), 30);
        for (const post of posts ?? []) {
          const p = post as {
            authorId?: string;
            sentAt?: number;
            textContent?: string;
          };
          if (p.authorId !== botShip()) continue;
          if (typeof p.sentAt === "number" && p.sentAt <= baselineSentAt)
            continue;
          if (p.textContent?.trim()) return p.textContent;
        }
        return undefined;
      },
      timeoutMs,
      undefined,
      description,
    );
  }

  async function getChannelBaselineSentAt(nest: string): Promise<number> {
    try {
      const posts = await fixtures.botState.channelPosts(nest, 30);
      return (posts ?? [])
        .map((post: any) =>
          post.authorId === botShip() && typeof post.sentAt === "number"
            ? post.sentAt
            : 0,
        )
        .reduce((max: number, ts: number) => Math.max(max, ts), 0);
    } catch {
      return 0;
    }
  }

  async function waitForChannelReply(
    nest: string,
    baselineSentAt: number,
    description: string,
    timeoutMs = 45_000,
  ): Promise<string> {
    return waitFor(
      async () => {
        const posts = await fixtures.botState.channelPosts(nest, 30);
        for (const post of posts ?? []) {
          const p = post as {
            authorId?: string;
            sentAt?: number;
            textContent?: string;
          };
          if (p.authorId !== botShip()) continue;
          if (typeof p.sentAt === "number" && p.sentAt <= baselineSentAt)
            continue;
          if (p.textContent?.trim()) return p.textContent;
        }
        return undefined;
      },
      timeoutMs,
      undefined,
      description,
    );
  }

  // ── Shared blob payloads ─────────────────────────────────────────────

  function voiceMemoBlob(token: string): string {
    return JSON.stringify([
      {
        type: "voicememo",
        version: 1,
        fileUri:
          "https://storage.googleapis.com/tlon-test-ci-shared/test-audio/silence.m4a",
        size: 4096,
        duration: 3,
        transcription: `Test voice memo ${token}`,
      },
    ]);
  }

  function fileBlob(token: string): string {
    return JSON.stringify([
      {
        type: "file",
        version: 1,
        fileUri:
          "https://storage.googleapis.com/tlon-test-ci-shared/test-images/openclaw-image.png",
        mimeType: "image/png",
        name: `${token}.png`,
        size: 12345,
      },
    ]);
  }

  // ── DM tests ─────────────────────────────────────────────────────────

  test("bot sees voice memo blob in DM", async () => {
    const baseline = await getDmBaselineSentAt();
    const token = `it-blob-dm-voice-${Date.now().toString(36)}`;

    console.log(`[TEST] Sending DM with voice memo blob (${token})...`);
    await sendDmWithBlob(`${token} voice memo attached`, voiceMemoBlob(token));

    const reply = await waitForDmReply(baseline, "bot reply to DM voice memo");
    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });

  test("bot sees file blob in DM", async () => {
    const baseline = await getDmBaselineSentAt();
    const token = `it-blob-dm-file-${Date.now().toString(36)}`;

    console.log(`[TEST] Sending DM with file blob (${token})...`);
    await sendDmWithBlob(
      `${token} what is in this file?`,
      fileBlob(token),
    );

    const reply = await waitForDmReply(baseline, "bot reply to DM file blob");
    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });

  test("bot sees voice memo blob in DM thread reply", async () => {
    const baseline = await getDmBaselineSentAt();
    const token = `it-blob-dm-reply-${Date.now().toString(36)}`;

    // First send a normal DM to establish a parent post
    console.log(`[TEST] Sending parent DM...`);
    const parentSentAt = await sendDmWithBlob(
      `${token} starting a thread`,
      "null",
    );
    const parentId = `${fromShip()}/${parentSentAt}`;

    // Wait a moment for the parent to be processed
    await new Promise((r) => setTimeout(r, 2000));

    // Now send a reply with a voice memo blob
    console.log(`[TEST] Sending DM thread reply with voice memo blob...`);
    await sendDmReplyWithBlob(
      parentId,
      `${token} replying with voice`,
      voiceMemoBlob(token),
    );

    const reply = await waitForDmReply(baseline, "bot reply to DM thread voice memo");
    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });

  // ── Channel tests ────────────────────────────────────────────────────

  test("bot sees voice memo blob in channel post", async () => {
    requireFixtureGroup(fixtures);
    const nest = fixtures.group.chatChannel;
    const baseline = await getChannelBaselineSentAt(nest);
    const token = `it-blob-ch-voice-${Date.now().toString(36)}`;
    const botName = botShip().replace("~", "");

    console.log(`[TEST] Sending channel post with voice memo blob (${token})...`);
    await sendChannelPostWithBlob(
      nest,
      `@${botName} ${token} voice memo attached`,
      voiceMemoBlob(token),
    );

    const reply = await waitForChannelReply(
      nest,
      baseline,
      "bot reply to channel voice memo",
    );
    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });

  test("bot sees file blob in channel reply", async () => {
    requireFixtureGroup(fixtures);
    const nest = fixtures.group.chatChannel;
    const baseline = await getChannelBaselineSentAt(nest);
    const token = `it-blob-ch-reply-${Date.now().toString(36)}`;
    const botName = botShip().replace("~", "");

    // Send a parent post first
    console.log(`[TEST] Sending parent channel post...`);
    const parentSentAt = await sendChannelPostWithBlob(
      nest,
      `@${botName} ${token} starting thread`,
      "null",
    );

    // Wait for the parent to be processed and get its ID
    await new Promise((r) => setTimeout(r, 3000));

    // Send a thread reply with file blob
    // Use the sentAt as an approximate post ID
    const parentId = String(parentSentAt);
    console.log(`[TEST] Sending channel thread reply with file blob...`);
    await sendChannelReplyWithBlob(
      nest,
      parentId,
      `@${botName} ${token} check this file`,
      fileBlob(token),
    );

    const reply = await waitForChannelReply(
      nest,
      baseline,
      "bot reply to channel thread file blob",
    );
    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });
});
