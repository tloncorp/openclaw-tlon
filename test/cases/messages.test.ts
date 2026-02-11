/**
 * Messages Tests
 *
 * Tests the bot's ability to read and send messages.
 */

import { describe, test, expect, beforeAll } from "vitest";
import { createTestClient, getTestConfig, type TestClient } from "../lib/index.js";

describe("messages", () => {
  let client: TestClient;

  beforeAll(() => {
    client = createTestClient(getTestConfig());
  });

  test("reads channel history", async () => {
    // First, get a channel to read from
    const groups = await client.state.groups();
    const groupFlags = Object.keys(groups);

    if (groupFlags.length === 0) {
      console.log("No groups to test with, skipping");
      return;
    }

    // Find a chat channel in the first group
    const group = groups[groupFlags[0]];
    const channels = group.channels ?? [];

    if (channels.length === 0) {
      console.log("No channels in group, skipping");
      return;
    }

    const channelNest = channels[0];
    const response = await client.prompt(
      `Show me the last 5 messages from ${channelNest}`
    );

    expect(response.success).toBe(true);
  });

  test("responds to simple prompt", async () => {
    const response = await client.prompt("Hello, how are you?");

    expect(response.success).toBe(true);
    expect(response.text).toBeDefined();
    expect(response.text!.length).toBeGreaterThan(0);
  });

  test("handles tool use", async () => {
    // Ask something that requires using a tool
    const response = await client.prompt("What groups am I in?");

    expect(response.success).toBe(true);
    expect(response.text).toBeDefined();
  });
});
