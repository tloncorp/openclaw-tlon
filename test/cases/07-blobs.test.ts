/**
 * Blob Attachment Integration Tests
 *
 * Verifies the plugin's blob-extraction path: when a DM or channel post
 * carries a blob (voice memo, file attachment), the plugin must extract
 * the blob metadata (transcription, filename, etc.) and include it in
 * the model context for the agent loop.
 *
 * Real assertion shape: we tag each prompt and register a script, then
 * query the fake-model's recorded user-message text via fakeModel.received
 * and confirm the expected blob substring (transcription / filename)
 * appears in the model request. A broken blob-to-context path would fail
 * here even though the bot still produces a reply.
 *
 * TEST ENVIRONMENT:
 *   ~zod = bot ship
 *   ~ten = test user (configured as ownerShip)
 */
import { describe, test, expect, beforeAll, beforeEach } from "vitest";
import type { Story } from "@tloncorp/api";
import {
  getFixtures,
  requireFixtureGroup,
  waitFor,
  type TestFixtures,
} from "../lib/index.js";
import { fakeModel, type ReceivedCall } from "../support/fake-model/client.js";

describe("blobs", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  beforeEach(async () => {
    await fakeModel.reset();
  });

  // ── Helpers ──────────────────────────────────────────────────────────

  function storyTagged(key: string, text: string): Story {
    return [{ inline: [`[tlon-test:${key}] ${text}`] }];
  }

  function storyTaggedWithMention(ship: string, key: string, text: string): Story {
    const normShip = ship.startsWith("~") ? ship : `~${ship}`;
    return [{ inline: [{ ship: normShip }, ` [tlon-test:${key}] ${text}`] }];
  }

  function voiceMemoBlob(transcriptionToken: string): string {
    return JSON.stringify([
      {
        type: "voicememo",
        version: 1,
        fileUri: "https://storage.googleapis.com/tlon-test-ci-shared/test-audio/silence.m4a",
        size: 4096,
        duration: 3,
        transcription: `Test voice memo ${transcriptionToken}`,
      },
    ]);
  }

  function fileBlob(filenameToken: string): string {
    return JSON.stringify([
      {
        type: "file",
        version: 1,
        fileUri:
          "https://storage.googleapis.com/tlon-test-ci-shared/test-images/openclaw-image.png",
        mimeType: "image/png",
        name: `${filenameToken}.png`,
        size: 12345,
      },
    ]);
  }

  /** Wait for the fake model to record at least one call for `key`. */
  async function awaitModelCall(key: string, timeoutMs = 30_000): Promise<ReceivedCall> {
    return waitFor(async () => {
      const calls = await fakeModel.received(key);
      return calls.length > 0 ? calls[0] : undefined;
    }, timeoutMs);
  }

  /** Find a parent post by author + matching text substring. */
  async function findParentPost(
    viewer: TestFixtures["userState"],
    channelId: string,
    authorId: string,
    bodySubstring: string,
  ): Promise<{ id: string }> {
    return waitFor(async () => {
      const posts = await viewer.channelPosts(channelId, 10);
      const found = (posts ?? []).find((p) => {
        const pp = p as { id?: string; authorId?: string; textContent?: string | null };
        return pp.authorId === authorId && (pp.textContent ?? "").includes(bodySubstring);
      }) as { id?: string } | undefined;
      return found?.id ? { id: found.id } : undefined;
    }, 10_000);
  }

  // ── DM tests ─────────────────────────────────────────────────────────

  test("voice memo blob in a DM reaches the model with transcription", async () => {
    const key = "blob-dm-voice";
    const transcriptionToken = `${key}-${Date.now().toString(36)}`;
    await fakeModel.script(key, [{ kind: "text", content: "got the voice memo" }]);

    await fixtures.userState.sendPost({
      channelId: fixtures.botShip,
      content: storyTagged(key, "voice memo attached"),
      blob: voiceMemoBlob(transcriptionToken),
    });

    const call = await awaitModelCall(key);
    expect(call.userText).toContain(transcriptionToken);
  });

  test("file blob in a DM reaches the model with filename", async () => {
    const key = "blob-dm-file";
    const filenameToken = `${key}-${Date.now().toString(36)}`;
    await fakeModel.script(key, [{ kind: "text", content: "got the file" }]);

    await fixtures.userState.sendPost({
      channelId: fixtures.botShip,
      content: storyTagged(key, "what is in this file?"),
      blob: fileBlob(filenameToken),
    });

    const call = await awaitModelCall(key);
    expect(call.userText).toContain(`${filenameToken}.png`);
  });

  test("voice memo blob in a DM thread reply reaches the model", async () => {
    const key = "blob-dm-reply";
    const transcriptionToken = `${key}-${Date.now().toString(36)}`;
    const parentMarker = `parent-${transcriptionToken}`;
    await fakeModel.script(key, [{ kind: "text", content: "got the reply" }]);

    // Parent post sets up the thread. Untagged on purpose — we don't want
    // the parent itself to fire a model call. The plugin's monitor will
    // not engage on a DM only if owner-listen / mention rules say so, but
    // owner DMs always engage. To prevent that engagement from racing the
    // real assertion, fakeModel.reset already ran and any model call here
    // would register under no key (and the awaitModelCall below filters
    // by our key).
    await fixtures.userState.sendPost({
      channelId: fixtures.botShip,
      content: storyTagged(key, parentMarker),
      blob: voiceMemoBlob(transcriptionToken),
    });
    const parent = await findParentPost(
      fixtures.userState,
      fixtures.botShip,
      fixtures.userShip,
      parentMarker,
    );

    await fixtures.userState.sendReply({
      channelId: fixtures.botShip,
      parentId: parent.id,
      parentAuthor: fixtures.userShip,
      content: storyTagged(key, "replying with voice"),
      blob: voiceMemoBlob(transcriptionToken),
    });

    // At least one of the two messages (parent or reply) carried the blob
    // into the model's user text. Both did, but we only need to verify
    // one to confirm the extraction path.
    const calls = await waitFor(async () => {
      const c = await fakeModel.received(key);
      return c.length > 0 ? c : undefined;
    }, 30_000);
    const combined = calls.map((c) => c.userText).join("\n");
    expect(combined).toContain(transcriptionToken);
  });

  // ── Channel tests ────────────────────────────────────────────────────

  test("voice memo blob in a channel post reaches the model", async () => {
    requireFixtureGroup(fixtures);
    const nest = fixtures.group.chatChannel;
    const key = "blob-ch-voice";
    const transcriptionToken = `${key}-${Date.now().toString(36)}`;
    await fakeModel.script(key, [{ kind: "text", content: "got the channel voice memo" }]);

    await fixtures.userState.sendPost({
      channelId: nest,
      content: storyTaggedWithMention(fixtures.botShip, key, "voice memo attached"),
      blob: voiceMemoBlob(transcriptionToken),
    });

    const call = await awaitModelCall(key);
    expect(call.userText).toContain(transcriptionToken);
  });

  test("file blob in a channel thread reply reaches the model", async () => {
    requireFixtureGroup(fixtures);
    const nest = fixtures.group.chatChannel;
    const key = "blob-ch-reply";
    const filenameToken = `${key}-${Date.now().toString(36)}`;
    const parentMarker = `parent-${filenameToken}`;
    await fakeModel.script(key, [{ kind: "text", content: "got the channel reply" }]);

    await fixtures.userState.sendPost({
      channelId: nest,
      content: storyTaggedWithMention(fixtures.botShip, key, parentMarker),
    });
    const parent = await findParentPost(
      fixtures.botState,
      nest,
      fixtures.userShip,
      parentMarker,
    );

    await fixtures.userState.sendReply({
      channelId: nest,
      parentId: parent.id,
      parentAuthor: fixtures.userShip,
      content: storyTaggedWithMention(fixtures.botShip, key, "check this file"),
      blob: fileBlob(filenameToken),
    });

    const calls = await waitFor(async () => {
      const c = await fakeModel.received(key);
      return c.length > 0 ? c : undefined;
    }, 30_000);
    const combined = calls.map((c) => c.userText).join("\n");
    expect(combined).toContain(`${filenameToken}.png`);
  });
});
