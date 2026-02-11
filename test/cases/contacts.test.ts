/**
 * Contacts Tests
 *
 * Tests the bot's ability to query and manage contacts.
 */

import { describe, test, expect, beforeAll } from "vitest";
import { createTestClient, getTestConfig, type TestClient } from "../lib/index.js";

describe("contacts", () => {
  let client: TestClient;

  beforeAll(() => {
    client = createTestClient(getTestConfig());
  });

  test("lists contacts", async () => {
    const response = await client.prompt("List my contacts");

    expect(response.success).toBe(true);
    expect(response.text).toBeDefined();
  });

  test("gets own profile", async () => {
    const response = await client.prompt("Show my profile");

    expect(response.success).toBe(true);
    expect(response.text).toBeDefined();

    // Verify against state
    const contacts = await client.state.contacts();
    // Own contact should be in the list
    expect(Object.keys(contacts).length).toBeGreaterThan(0);
  });

  test("gets specific contact", async () => {
    // Get a known contact from state first
    const contacts = await client.state.contacts();
    const ships = Object.keys(contacts);

    if (ships.length === 0) {
      console.log("No contacts to test with, skipping");
      return;
    }

    const testShip = ships[0];
    const response = await client.prompt(`Get contact info for ${testShip}`);

    expect(response.success).toBe(true);
  });
});
