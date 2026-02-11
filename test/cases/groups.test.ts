/**
 * Group Management Tests
 *
 * Tests the bot's ability to create, manage, and query groups.
 */

import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { createTestClient, getTestConfig, type TestClient } from "../lib/index.js";

describe("groups", () => {
  let client: TestClient;
  const testGroupSlug = `test-${Date.now()}`;

  beforeAll(() => {
    client = createTestClient(getTestConfig());
  });

  test("lists groups", async () => {
    const response = await client.prompt("List my groups");

    expect(response.success).toBe(true);
    expect(response.text).toBeDefined();
    // The response should mention groups or indicate none exist
  });

  test("creates a group", async () => {
    const response = await client.prompt(
      `Create a private group called "${testGroupSlug}" with description "Test group for automated testing"`
    );

    expect(response.success).toBe(true);

    // Verify the group was created via state check
    const groups = await client.state.groups();
    const created = Object.keys(groups).find((k) => k.includes(testGroupSlug));

    expect(created).toBeDefined();
  });

  test("gets group info", async () => {
    // First find the group we created
    const groups = await client.state.groups();
    const groupFlag = Object.keys(groups).find((k) => k.includes(testGroupSlug));

    if (!groupFlag) {
      throw new Error("Test group not found - did the create test fail?");
    }

    const response = await client.prompt(`Get info about the group ${groupFlag}`);

    expect(response.success).toBe(true);
    expect(response.text).toContain(testGroupSlug);
  });

  afterAll(async () => {
    // Cleanup: delete the test group
    const groups = await client.state.groups();
    const groupFlag = Object.keys(groups).find((k) => k.includes(testGroupSlug));

    if (groupFlag) {
      await client.prompt(`Delete the group ${groupFlag}`);
    }
  });
});
