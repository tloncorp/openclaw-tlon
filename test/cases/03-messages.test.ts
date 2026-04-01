import { describe, test, expect, beforeAll } from "vitest";
import { getTextContent } from "@tloncorp/api";
import {
  getFixtures,
  waitFor,
  requireFixtureGroup,
  type TestFixtures,
} from "../lib/index.js";

describe("messages", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  test("can read messages from fixture group channel", async () => {
    requireFixtureGroup(fixtures);

    const prompt = `Show me recent messages from your own channel ${fixtures.group.chatChannel}.`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();

    // Verify by checking if the response includes content from actual channel history
    const posts = await fixtures.botState.channelPosts(fixtures.group.chatChannel, 5);
    const postTexts = (posts ?? [])
      .map((post) => {
        const p = post as { textContent?: string | null; content?: unknown };
        return p.textContent ?? getTextContent(p.content);
      })
      .map((text) => (text ?? "").trim())
      .filter((text) => text.length > 0);

    console.log(`[TEST] Found ${postTexts.length} posts in channel`);

    if (postTexts.length > 0) {
      // Expect the model to surface at least one snippet from channel history.
      const sample = postTexts[0].slice(0, 24).toLowerCase();
      console.log(`[TEST] Checking for sample text: "${sample}"`);
      if (sample.length > 6) {
        expect(response.text?.toLowerCase()).toContain(sample);
      }
    }
  });

  test("posts a message into a bot-owned channel", async () => {
    requireFixtureGroup(fixtures);

    const token = `it-post-${Date.now().toString(36)}`;
    const prompt = `Post this exact text into your channel ${fixtures.group.chatChannel}: "${token}" — You MUST respond with exactly 'Done' after posting`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt, { correlate: false });
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    // Check we got a response (bot should reply to this DM)
    expect(response.text).toBeDefined();
    expect(response.text!.length).toBeGreaterThan(0);

    // Verify the message was actually posted by checking channel state
    console.log(`[TEST] Waiting for message with token "${token}" to appear...`);
    const created = await waitFor(async () => {
      const posts = await fixtures.botState.channelPosts(fixtures.group!.chatChannel, 30);
      const found = (posts ?? []).some((post) => {
        const p = post as { authorId?: string; textContent?: string | null; content?: unknown };
        const text = (p.textContent ?? getTextContent(p.content) ?? "").toLowerCase();
        const isFromBot = p.authorId === fixtures.botShip;
        const hasToken = text.includes(token.toLowerCase());
        if (hasToken) {
          console.log(`[TEST] Found token in post from ${p.authorId}, isFromBot: ${isFromBot}`);
        }
        return isFromBot && hasToken;
      });
      return found ? true : undefined;
    }, 30_000);

    expect(created).toBe(true);
  });

  test("responds to a simple prompt", async () => {
    const prompt = "Reply with one short sentence confirming you are online.";
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 200)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();
    expect(response.text!.length).toBeGreaterThan(0);
  });
});
