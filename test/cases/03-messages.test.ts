import { describe, test, expect, beforeAll } from "vitest";
import {
  getFixtures,
  waitFor,
  type TestFixtures,
} from "../lib/index.js";

describe("messages", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  test("can read messages from fixture group channel", async () => {
    if (!fixtures.group) {
      console.log("[TEST] Skipping: no fixture group");
      return;
    }

    const response = await fixtures.client.prompt(
      `Show me recent messages from your own channel ${fixtures.group.chatChannel}.`
    );

    // ... rest of test
  });

  test("responds to a simple prompt", async () => {
    const response = await fixtures.client.prompt(
      "Reply with one short sentence confirming you are online."
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();
    expect(response.text!.length).toBeGreaterThan(0);
  });
});
