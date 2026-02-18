/**
 * Slash Command Integration Tests
 *
 * IMPORTANT: Slash commands are owner-only. The test user (TEST_USER_SHIP)
 * must match the bot's configured ownerShip for these tests to pass.
 *
 * If tests timeout, check that:
 * 1. TEST_USER_SHIP equals the ownerShip in your openclaw.json config
 * 2. Or leave TEST_USER_* unset to use bot credentials (if bot is owner)
 */
import { describe, test, expect, beforeAll } from "vitest";
import { createTestClient, getTestConfig, type TestClient } from "../lib/index.js";

describe("slash commands (owner-only)", () => {
  let client: TestClient;

  beforeAll(() => {
    client = createTestClient(getTestConfig());
  });

  test("/status command returns status info", async () => {
    const response = await client.prompt("/status");

    // Commands from non-owners are silently ignored (timeout)
    if (!response.success) {
      throw new Error(
        `${response.error} -- Slash commands are owner-only. ` +
          "Ensure TEST_USER_SHIP matches the bot's ownerShip config."
      );
    }
    expect(response.text).toBeDefined();
    // Status responses typically contain model or session info
    expect(response.text?.toLowerCase()).toMatch(/status|model|session|online/i);
  });

  test("/help command returns help info", async () => {
    const response = await client.prompt("/help");

    if (!response.success) {
      throw new Error(
        `${response.error} -- Slash commands are owner-only. ` +
          "Ensure TEST_USER_SHIP matches the bot's ownerShip config."
      );
    }
    expect(response.text).toBeDefined();
    // Help responses list available commands
    expect(response.text?.toLowerCase()).toMatch(/help|command|available/i);
  });

  test("/new command resets session", async () => {
    const response = await client.prompt("/new");

    if (!response.success) {
      throw new Error(
        `${response.error} -- Slash commands are owner-only. ` +
          "Ensure TEST_USER_SHIP matches the bot's ownerShip config."
      );
    }
    // /new typically returns an acknowledgment or starts fresh
    expect(response.text).toBeDefined();
  });
});
