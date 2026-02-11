/**
 * Group Management Tests
 *
 * Tests the bot's ability to query and interact with groups.
 * Uses existing groups on test user's ship.
 */

import { describe, test, expect, beforeAll } from "vitest";
import { Urbit } from "@tloncorp/api";
import { createTestClient, getTestConfig, type TestClient } from "../lib/index.js";

describe("groups", () => {
  let client: TestClient;
  let testUserUrbit: Urbit;
  let existingGroups: string[] = [];

  beforeAll(async () => {
    const config = getTestConfig();
    client = createTestClient(config);

    // Connect as test user to check existing groups
    const shipClean = config.testUser.shipName.replace(/^~/, "");
    testUserUrbit = new Urbit(config.testUser.shipUrl, config.testUser.code);
    testUserUrbit.ship = shipClean;
    await testUserUrbit.connect();

    // Get existing groups
    const groups = await testUserUrbit.scry<Record<string, unknown>>({
      app: "groups",
      path: "/groups",
    });
    existingGroups = Object.keys(groups);
    console.log("Test user's existing groups:", existingGroups);
  });

  test("lists groups", async () => {
    const response = await client.prompt("List my groups");

    expect(response.success).toBe(true);
    expect(response.text).toBeDefined();
    console.log("Bot response:", response.text?.slice(0, 200));
  });

  test("handles group queries", async () => {
    if (existingGroups.length === 0) {
      // No groups - test the "no groups" response
      const response = await client.prompt("What groups am I in?");
      expect(response.success).toBe(true);
      expect(response.text).toBeDefined();
      console.log("No groups response:", response.text?.slice(0, 200));
    } else {
      // Has groups - test querying a specific one
      const firstGroup = existingGroups[0];
      const response = await client.prompt(`Tell me about the group ${firstGroup}`);
      expect(response.success).toBe(true);
      expect(response.text).toBeDefined();
      console.log("Group info response:", response.text?.slice(0, 200));
    }
  });

  test("responds to group-related questions", async () => {
    const response = await client.prompt("How do Tlon groups work?");

    expect(response.success).toBe(true);
    expect(response.text).toBeDefined();
  });
});
