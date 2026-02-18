import { describe, test, expect, beforeAll } from "vitest";
import { getTextContent } from "@tloncorp/api";
import {
  createTestClient,
  createStateClient,
  getTestConfig,
  ensureFixtureGroup,
  type TestClient,
  type StateClient,
  type FixtureGroup,
} from "../lib/index.js";

describe("messages", () => {
  let client: TestClient;
  let botState: StateClient;
  let botShip: string;
  let fixture: FixtureGroup;

  beforeAll(async () => {
    const config = getTestConfig();
    client = createTestClient(config);
    botState = createStateClient(config.bot);
    botShip = config.bot.shipName.startsWith("~") ? config.bot.shipName : `~${config.bot.shipName}`;
    fixture = await ensureFixtureGroup(client, botState);
  });

  test("reads bot-owned channel history", async () => {
    const response = await client.prompt(
      `Show me recent messages from your own channel ${fixture.channelId}.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();

    const posts = await botState.channelPosts(fixture.channelId, 5);
    const postTexts = (posts ?? [])
      .map((post) => {
        const p = post as { textContent?: string | null; content?: unknown };
        return p.textContent ?? getTextContent(p.content);
      })
      .map((text) => (text ?? "").trim())
      .filter((text) => text.length > 0);

    if (postTexts.length > 0) {
      // Expect the model to surface at least one snippet from channel history.
      const sample = postTexts[0].slice(0, 24).toLowerCase();
      if (sample.length > 6) {
        expect(response.text?.toLowerCase()).toContain(sample);
      }
    }
  });

  // test("posts a message into a bot-owned channel", async () => {
  //   const token = `it-post-${Date.now().toString(36)}`;
  //   const response = await client.prompt(
  //     `Post this exact text into your channel ${fixture.channelId}: "${token}"`
  //   );

  //   if (!response.success) {
  //     throw new Error(response.error ?? "Prompt failed");
  //   }

  //   const created = await waitFor(async () => {
  //     const posts = await botState.channelPosts(fixture.channelId, 30);
  //     return (posts ?? []).some((post) => {
  //       const p = post as { authorId?: string; textContent?: string | null; content?: unknown };
  //       const text = (p.textContent ?? getTextContent(p.content) ?? "").toLowerCase();
  //       return p.authorId === botShip && text.includes(token.toLowerCase());
  //     });
  //   }, 30_000);

  //   expect(created).toBe(true);
  // });

  test("responds to a simple DM prompt", async () => {
    const response = await client.prompt("Reply with one short sentence confirming you are online.");

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();
    expect((response.text ?? "").trim().length).toBeGreaterThan(0);
  });
});
