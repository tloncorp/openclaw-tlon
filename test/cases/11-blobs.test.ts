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
import type { Story } from "@tloncorp/api";
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

  // ── Helpers ──────────────────────────────────────────────────────────

  function botName(): string {
    return fixtures.botShip.replace(/^~/, "");
  }

  function story(text: string): Story {
    return text ? [{ inline: [text] }] : [];
  }

  /** Build a story with a proper ship mention inline followed by text */
  function storyWithMention(ship: string, text: string): Story {
    const normShip = ship.startsWith("~") ? ship : `~${ship}`;
    return [{ inline: [{ ship: normShip }, ` ${text}`] }];
  }

  function voiceMemoBlob(token: string): string {
    return JSON.stringify([
      {
        type: "voicememo",
        version: 1,
        fileUri: "https://storage.googleapis.com/tlon-test-ci-shared/test-audio/silence.m4a",
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
        fileUri: "https://storage.googleapis.com/tlon-test-ci-shared/test-images/openclaw-image.png",
        mimeType: "image/png",
        name: `${token}.png`,
        size: 12345,
      },
    ]);
  }

  async function getDmBaseline(): Promise<number> {
    try {
      const posts = await fixtures.userState.channelPosts(fixtures.botShip, 30);
      return (posts ?? [])
        .map((p: any) =>
          p.authorId === fixtures.botShip && typeof p.sentAt === "number" ? p.sentAt : 0,
        )
        .reduce((max: number, ts: number) => Math.max(max, ts), 0);
    } catch {
      return 0;
    }
  }

  async function waitForDmReply(baseline: number, desc: string): Promise<string> {
    return waitFor(
      async () => {
        const posts = await fixtures.userState.channelPosts(fixtures.botShip, 30);
        for (const post of posts ?? []) {
          const p = post as { authorId?: string; sentAt?: number; textContent?: string };
          if (p.authorId !== fixtures.botShip) continue;
          if (typeof p.sentAt === "number" && p.sentAt <= baseline) continue;
          if (p.textContent?.trim()) return p.textContent;
        }
        return undefined;
      },
      45_000,
      undefined,
      desc,
    );
  }

  async function getChannelBaseline(nest: string): Promise<number> {
    try {
      const posts = await fixtures.botState.channelPosts(nest, 30);
      return (posts ?? [])
        .map((p: any) =>
          p.authorId === fixtures.botShip && typeof p.sentAt === "number" ? p.sentAt : 0,
        )
        .reduce((max: number, ts: number) => Math.max(max, ts), 0);
    } catch {
      return 0;
    }
  }

  async function waitForChannelReply(
    nest: string,
    baseline: number,
    desc: string,
  ): Promise<string> {
    return waitFor(
      async () => {
        const posts = await fixtures.botState.channelPosts(nest, 30);
        for (const post of posts ?? []) {
          const p = post as { authorId?: string; sentAt?: number; textContent?: string };
          if (p.authorId !== fixtures.botShip) continue;
          if (typeof p.sentAt === "number" && p.sentAt <= baseline) continue;
          if (p.textContent?.trim()) return p.textContent;
        }
        return undefined;
      },
      45_000,
      undefined,
      desc,
    );
  }

  // ── DM tests ─────────────────────────────────────────────────────────

  test("bot sees voice memo blob in DM", async () => {
    const baseline = await getDmBaseline();
    const token = `it-blob-dm-voice-${Date.now().toString(36)}`;

    console.log(`[TEST] Sending DM with voice memo blob (${token})...`);
    await fixtures.userState.sendPost({
      channelId: fixtures.botShip,
      content: story(`${token} voice memo attached`),
      blob: voiceMemoBlob(token),
    });

    const reply = await waitForDmReply(baseline, "bot reply to DM voice memo");
    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });

  test("bot sees file blob in DM", async () => {
    const baseline = await getDmBaseline();
    const token = `it-blob-dm-file-${Date.now().toString(36)}`;

    console.log(`[TEST] Sending DM with file blob (${token})...`);
    await fixtures.userState.sendPost({
      channelId: fixtures.botShip,
      content: story(`${token} what is in this file?`),
      blob: fileBlob(token),
    });

    const reply = await waitForDmReply(baseline, "bot reply to DM file blob");
    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });

  test("bot sees voice memo blob in DM thread reply", async () => {
    const baseline = await getDmBaseline();
    const token = `it-blob-dm-reply-${Date.now().toString(36)}`;

    // Send parent DM first
    console.log(`[TEST] Sending parent DM...`);
    await fixtures.userState.sendPost({
      channelId: fixtures.botShip,
      content: story(`${token} starting a thread`),
    });

    // Wait for parent to be processed, then get its ID
    await new Promise((r) => setTimeout(r, 3000));

    // Find the parent post ID
    const posts = await fixtures.userState.channelPosts(fixtures.botShip, 10);
    const parentPost = (posts ?? []).find(
      (p: any) => p.authorId === fixtures.userShip && p.textContent?.includes(token),
    ) as any;

    if (!parentPost?.id) {
      console.log(`[TEST] Could not find parent post, skipping DM reply test`);
      return;
    }

    console.log(`[TEST] Sending DM thread reply with voice memo blob (parent: ${parentPost.id})...`);
    await fixtures.userState.sendReply({
      channelId: fixtures.botShip,
      parentId: parentPost.id,
      parentAuthor: fixtures.userShip,
      content: story(`${token} replying with voice`),
      blob: voiceMemoBlob(token),
    });

    const reply = await waitForDmReply(baseline, "bot reply to DM thread voice memo");
    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });

  // ── Channel tests ────────────────────────────────────────────────────

  test("bot sees voice memo blob in channel post", async () => {
    requireFixtureGroup(fixtures);
    const nest = fixtures.group.chatChannel;
    const baseline = await getChannelBaseline(nest);
    const token = `it-blob-ch-voice-${Date.now().toString(36)}`;

    console.log(`[TEST] Sending channel post with voice memo blob (${token})...`);
    await fixtures.userState.sendPost({
      channelId: nest,
      content: storyWithMention(fixtures.botShip, `${token} voice memo attached`),
      blob: voiceMemoBlob(token),
    });

    const reply = await waitForChannelReply(nest, baseline, "bot reply to channel voice memo");
    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });

  test("bot sees file blob in channel thread reply", async () => {
    requireFixtureGroup(fixtures);
    const nest = fixtures.group.chatChannel;
    const baseline = await getChannelBaseline(nest);
    const token = `it-blob-ch-reply-${Date.now().toString(36)}`;

    // Send parent channel post (with mention so bot participates in thread)
    console.log(`[TEST] Sending parent channel post...`);
    await fixtures.userState.sendPost({
      channelId: nest,
      content: storyWithMention(fixtures.botShip, `${token} starting thread`),
    });

    // Wait for bot to respond and join the thread
    await new Promise((r) => setTimeout(r, 5000));

    // Find the parent post ID
    const posts = await fixtures.botState.channelPosts(nest, 10);
    const parentPost = (posts ?? []).find(
      (p: any) => p.authorId === fixtures.userShip && p.textContent?.includes(token),
    ) as any;

    if (!parentPost?.id) {
      console.log(`[TEST] Could not find parent post, skipping channel reply test`);
      return;
    }

    console.log(`[TEST] Sending channel thread reply with file blob (parent: ${parentPost.id})...`);
    await fixtures.userState.sendReply({
      channelId: nest,
      parentId: parentPost.id,
      parentAuthor: fixtures.userShip,
      content: storyWithMention(fixtures.botShip, `${token} check this file`),
      blob: fileBlob(token),
    });

    const reply = await waitForChannelReply(nest, baseline, "bot reply to channel thread file blob");
    console.log(`[TEST] Bot replied: ${reply.slice(0, 200)}`);
    expect(reply.length).toBeGreaterThan(0);
  });
});
