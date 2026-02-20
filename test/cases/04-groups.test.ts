import { describe, test, expect, beforeAll } from "vitest";
import {
  getFixtures,
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
  });
});
