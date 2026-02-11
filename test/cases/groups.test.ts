/**
 * Group Management Tests
 *
 * Tests the bot's ability to query groups.
 * Note: Group creation/deletion requires elevated permissions that the bot may not have.
 */

import { describe, test, expect, beforeAll } from "vitest";
import { createTestClient, getTestConfig, type TestClient } from "../lib/index.js";

describe("groups", () => {
  let client: TestClient;

  beforeAll(() => {
    client = createTestClient(getTestConfig());
  });

  test("lists groups", async () => {
    const response = await client.prompt("List my groups");

    expect(response.success).toBe(true);
    expect(response.text).toBeDefined();
    // Bot should respond with groups list or indicate none exist
  });

  test("handles group query when no groups exist", async () => {
    // Check bot's actual groups
    const groups = await client.state.groups();
    const groupFlags = Object.keys(groups);

    if (groupFlags.length === 0) {
      // Bot has no groups - verify it handles this gracefully
      const response = await client.prompt("What groups am I in?");
      expect(response.success).toBe(true);
      expect(response.text).toBeDefined();
      // Response should indicate no groups or similar
      console.log("Bot has no groups, response:", response.text?.slice(0, 100));
    } else {
      // Bot has groups - test getting info about the first one
      const firstGroup = groupFlags[0];
      const response = await client.prompt(`Tell me about the group ${firstGroup}`);
      expect(response.success).toBe(true);
      expect(response.text).toBeDefined();
      console.log("Bot has groups:", groupFlags);
    }
  });

  test("responds to group-related questions", async () => {
    const response = await client.prompt("Can you help me with Tlon groups?");

    expect(response.success).toBe(true);
    expect(response.text).toBeDefined();
    // Bot should respond helpfully about groups
  });
});
