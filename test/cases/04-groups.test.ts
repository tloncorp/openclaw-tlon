import { describe, test, expect, beforeAll } from "vitest";
import {
  getFixtures,
  waitFor,
  type TestFixtures,
} from "../lib/index.js";

describe("groups", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();

    if (!fixtures.group) {
      console.log("[GROUPS] No fixture group available, tests will be skipped");
    }
  });

  test("knows about the fixture group", async () => {
    if (!fixtures.group) {
      console.log("[TEST] Skipping: no fixture group");
      return;
    }

    const response = await fixtures.client.prompt(
      `Tell me about your group ${fixtures.group.id}. Include both the group id and title.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    const text = response.text?.toLowerCase() ?? "";
    expect(text).toContain(fixtures.group.id.toLowerCase());
  });

  test("lists group channels", async () => {
    if (!fixtures.group) {
      console.log("[TEST] Skipping: no fixture group");
      return;
    }

    const response = await fixtures.client.prompt(
      `List the channels in group ${fixtures.group.id}.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    expect(response.text).toBeDefined();
    expect(response.text!.length).toBeGreaterThan(0);
    expect(response.text?.toLowerCase()).toContain(fixtures.group.chatChannel.toLowerCase());
  });

  test("creates a new group on the bot ship", async () => {
    const uniqueTitle = `OpenClaw IT Group ${Date.now().toString(36)}`;
    const response = await fixtures.client.prompt(
      `Create a new private group on your own ship with title "${uniqueTitle}". Reply with only the new group id.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    const created = await waitFor(async () => {
      const groups = await fixtures.botState.groups();
      return (groups ?? []).find((group) => {
        const g = group as { title?: string | null };
        return (g.title ?? "").trim() === uniqueTitle;
      });
    }, 30_000);

    expect(created).toBeTruthy();
  });
});
