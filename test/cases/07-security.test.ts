/**
 * Security Integration Tests
 *
 * Tests security features that protect the bot:
 * - Tool access control (owner can use restricted tools)
 * - Admin commands for block management (blocked, unblock)
 * - Block state invariants (owner never blocked)
 * - Response safety (no leaked directives)
 *
 * TEST ENVIRONMENT:
 *   ~zod = bot ship
 *   ~ten = test user (configured as ownerShip)
 *
 * NOTE: Block state is verified via admin commands (not direct scry)
 * because @tloncorp/api cannot scry /chat/blocked.json on fakezods.
 *
 * COVERAGE LIMITATIONS:
 * Tests marked [NEEDS_3RD_SHIP] require a non-owner ship and are skipped.
 */
import { describe, test, expect, beforeAll } from "vitest";
import { getFixtures, type TestFixtures } from "../lib/index.js";

describe("security", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  /**
   * Seed a blocked ship via direct poke to the bot's chat app.
   * The poke succeeds even though we can't scry the block list externally.
   */
  async function seedBlock(ship: string): Promise<void> {
    await fixtures.botState.poke({
      app: "chat",
      mark: "chat-block-ship",
      json: { ship },
    });
    // Give the poke time to take effect
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  /**
   * Query the block list via the "blocked" admin command.
   * Returns the bot's response text (the formatted block list).
   */
  async function getBlockedList(): Promise<string> {
    const response = await fixtures.client.prompt("blocked");
    if (!response.success) {
      throw new Error(response.error ?? "'blocked' admin command failed");
    }
    return response.text ?? "";
  }

  // =========================================================================
  // 1. Tool Access Control
  // =========================================================================

  describe("tool access control", () => {
    test("owner can use the tlon tool", async () => {
      // Owner (~ten) sends a command that requires the tlon tool.
      // If tool access control blocked the owner, this would fail/timeout.
      const prompt =
        "Use the tlon tool to check your own contacts (contacts self) and tell me what you see.";
      console.log(`\n[TEST] Sending prompt: "${prompt}"`);

      const response = await fixtures.client.prompt(prompt);
      console.log(`[TEST] Response success: ${response.success}`);
      console.log(`[TEST] Response text: ${response.text?.slice(0, 300)}`);

      if (!response.success) {
        throw new Error(response.error ?? "Prompt failed");
      }

      // A successful response with content proves the tlon tool was not blocked.
      // The bot returns contact/profile info (format varies by LLM).
      const text = response.text ?? "";
      expect(text.length).toBeGreaterThan(0);
    });

    test.skip("[NEEDS_3RD_SHIP] non-owner cannot use restricted tools", () => {
      // Would test: non-owner sends DM → bot sets sessionRole "user" →
      // before_tool_call hook (index.ts:229-249) blocks tlon/read/cron →
      // response indicates tool is not available.
      // Requires a ship that doesn't match ownerShip.
    });
  });

  // =========================================================================
  // 2. Admin Commands: Block Management
  // =========================================================================

  describe("admin commands: block management", () => {
    test("'blocked' command lists blocked ships", async () => {
      // Seed a blocked ship on the bot
      const fakeShip = "~sampel-palnet";
      await seedBlock(fakeShip);

      // Owner sends "blocked" admin command
      const text = await getBlockedList();
      console.log(`\n[TEST] Blocked list response: ${text.slice(0, 500)}`);

      // Response should list the seeded ship
      expect(text.toLowerCase()).toContain("sampel-palnet");

      // Clean up via unblock admin command
      await fixtures.client.prompt(`unblock ${fakeShip}`);
    });

    test("'unblock ~ship' removes a blocked ship", async () => {
      // Seed a blocked ship
      const fakeShip = "~marzod";
      await seedBlock(fakeShip);

      // Verify it shows up in the blocked list
      const before = await getBlockedList();
      console.log(`\n[TEST] Blocked list before unblock: ${before.slice(0, 500)}`);
      expect(before.toLowerCase()).toContain("marzod");

      // Owner sends "unblock ~marzod"
      const response = await fixtures.client.prompt("unblock ~marzod");
      console.log(`[TEST] Unblock response: ${response.text?.slice(0, 500)}`);

      if (!response.success) {
        throw new Error(response.error ?? "Prompt failed");
      }

      // Response should confirm the unblock
      expect(response.text?.toLowerCase() ?? "").toContain("unblock");

      // Verify it's no longer in the blocked list
      const after = await getBlockedList();
      console.log(`[TEST] Blocked list after unblock: ${after.slice(0, 500)}`);
      expect(after.toLowerCase()).not.toContain("marzod");
    });

    test("'unblock ~ship' reports when ship is not blocked", async () => {
      // Owner sends "unblock ~wanzod" for a ship that's not blocked
      const response = await fixtures.client.prompt("unblock ~wanzod");
      console.log(`\n[TEST] Response: ${response.text?.slice(0, 500)}`);

      if (!response.success) {
        throw new Error(response.error ?? "Prompt failed");
      }

      // Response should indicate the ship is not blocked
      expect(response.text?.toLowerCase() ?? "").toContain("not blocked");
    });
  });

  // =========================================================================
  // 3. Block State Invariants
  // =========================================================================

  describe("block state invariants", () => {
    test("owner never appears in block list after interaction", async () => {
      // Verifies the safety invariant: owner can never be blocked.
      // Prior tests already involved interaction, so just check the list.
      const blockedText = await getBlockedList();
      console.log(`\n[TEST] Blocked list: ${blockedText}`);

      // Owner ship should never appear in the block list
      const ownerName = fixtures.userShip.replace("~", "");
      expect(blockedText.toLowerCase()).not.toContain(ownerName);
    });
  });

  // =========================================================================
  // 4. Response Safety
  // =========================================================================

  describe("response safety", () => {
    test("bot responses do not contain raw [BLOCK_USER] directives", async () => {
      // Under normal conditions the LLM should not produce [BLOCK_USER]
      // directives for an owner sending benign messages. If it did,
      // processBlockDirectives() would strip them before sending the DM.
      const prompts = ["What is 2 + 2?", "Say hello."];

      for (const prompt of prompts) {
        console.log(`\n[TEST] Sending prompt: "${prompt}"`);
        const response = await fixtures.client.prompt(prompt);
        if (response.success && response.text) {
          console.log(
            `[TEST] Checking response for directive leakage: "${response.text.slice(0, 200)}"`,
          );
          expect(response.text).not.toContain("[BLOCK_USER:");
        }
      }
    });
  });

  // =========================================================================
  // 5. Future Tests (Require 3rd Ship)
  // =========================================================================

  describe("[NEEDS_3RD_SHIP] full blocking flow", () => {
    test.skip("agent blocks abusive non-owner via [BLOCK_USER] directive", () => {
      // Would test: non-owner sends abusive DM → LLM responds with
      // [BLOCK_USER: ~non-owner | reason] → processBlockDirectives()
      // parses and executes block → ship in /chat/blocked.json →
      // directive stripped from visible response → owner notified.
    });

    test.skip("blocked non-owner DMs are silently ignored", () => {
      // Would test: block ~non-owner via poke → non-owner sends DM →
      // queueApprovalRequest() checks isShipBlocked() and returns early →
      // bot does NOT respond.
    });

    test.skip("non-owner tool access is blocked with correct reason", () => {
      // Would test: non-owner sends DM asking bot to use tlon tool →
      // before_tool_call hook returns { block: true } → response
      // indicates tool is not available.
    });
  });
});
