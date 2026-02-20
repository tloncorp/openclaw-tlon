import { describe, test, expect, beforeAll } from "vitest";
import {
  createTestClient,
  createStateClient,
  getTestConfig,
  ensureFixtureGroup,
  waitFor,
  type TestClient,
  type StateClient,
  type FixtureGroup,
} from "../lib/index.js";

describe("groups", () => {
  let client: TestClient;
  let botState: StateClient;
  let fixture: FixtureGroup;

  beforeAll(async () => {
    const config = getTestConfig();
    client = createTestClient(config);
    botState = createStateClient(config.bot);

    // Wait for any pending messages from previous tests to settle
    await new Promise((resolve) => setTimeout(resolve, 5000));

    fixture = await ensureFixtureGroup(client, botState);
  });

  test("reads a bot-owned group", async () => {
    const response = await client.prompt(
      `Tell me about your group ${fixture.id}. Include both the group id and title.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();

    const text = response.text?.toLowerCase() ?? "";
    expect(text).toContain(fixture.id.toLowerCase());
    expect(text).toContain(fixture.title.toLowerCase());
  });

  test("creates a new group on the bot ship", async () => {
    const uniqueTitle = `OpenClaw IT Group ${Date.now().toString(36)}`;
    const response = await client.prompt(
      `Create a new private group on your own ship with title "${uniqueTitle}". Reply with only the new group id.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    const created = await waitFor(async () => {
      const groups = await botState.groups();
      return (groups ?? []).find((group) => {
        const g = group as { title?: string | null };
        return (g.title ?? "").trim() === uniqueTitle;
      });
    }, 30_000);

    expect(created).toBeTruthy();
  });

  test("adds a channel to an existing bot-owned group", async () => {
    const channelName = `it-${Date.now().toString(36)}`;
    const channelTitle = `IT ${channelName}`;
    const prompt = `In group ${fixture.id}, add a new chat channel named "${channelName}" with title "${channelTitle}".`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    const expectedChannelId = `chat/${fixture.id}/${channelName}`;
    const channelExists = await waitFor(async () => {
      const group = await botState.group(fixture.id);
      const channels = ((group as { channels?: unknown[] } | null)?.channels ?? []) as Array<{
        id?: string | null;
        title?: string | null;
      }>;
      return channels.some((channel) => channel.id === expectedChannelId || channel.title === channelTitle);
    }, 30_000);

    expect(channelExists).toBe(true);
  });
});
