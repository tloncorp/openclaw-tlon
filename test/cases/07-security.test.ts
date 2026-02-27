/**
 * Security Integration Tests
 *
 * Tests security features that protect the bot:
 * - Tool access control (owner can use restricted tools, non-owner blocked)
 * - Admin commands for block management (blocked, unblock)
 * - Blocked ships cannot DM the bot (Urbit-level blocking)
 *
 * TEST ENVIRONMENT:
 *   ~zod = bot ship
 *   ~ten = test user (configured as ownerShip)
 *   ~mug = third-party ship (non-owner, for security tests)
 *
 * NOTE: Block state is verified via admin commands (not direct scry)
 * because @tloncorp/api cannot scry /chat/blocked.json on fakezods.
 */
import { describe, test, expect, beforeAll } from "vitest";
import { getFixtures, waitFor, requireThirdParty, type TestFixtures } from "../lib/index.js";

describe("security", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  /**
   * Extract nickname from a contacts /v1/self scry result.
   * Handles both string and { value: string } shapes.
   */
  function extractNickname(profile: Record<string, unknown> | undefined): string {
    const p = (profile ?? {}) as {
      nickname?: string | { value?: string | null } | null;
      nickName?: string | { value?: string | null } | null;
    };
    const fromField =
      typeof p.nickname === "string"
        ? p.nickname
        : (p.nickname as { value?: string | null } | null | undefined)?.value;
    const fromAlt =
      typeof p.nickName === "string"
        ? p.nickName
        : (p.nickName as { value?: string | null } | null | undefined)?.value;
    return fromField ?? fromAlt ?? "";
  }

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
      // Owner (~ten) asks the bot to update its profile nickname via the tlon tool.
      // If before_tool_call blocked the owner, the tool wouldn't execute and
      // the nickname would never change on the bot ship.
      const nicknameToken = `sec-${Date.now().toString(36)}`;
      const prompt = `Use the tlon tool to update your profile nickname to exactly "${nicknameToken}" and confirm when done.`;
      console.log(`\n[TEST] Sending prompt: "${prompt}"`);

      const response = await fixtures.client.prompt(prompt);
      console.log(`[TEST] Response success: ${response.success}`);
      console.log(`[TEST] Response text: ${response.text?.slice(0, 300)}`);

      if (!response.success) {
        throw new Error(response.error ?? "Prompt failed");
      }

      // Verify the nickname actually changed on the bot ship via scry.
      // This proves the tlon tool was invoked, not just that the LLM replied.
      console.log(`[TEST] Waiting for bot nickname to be "${nicknameToken}"...`);
      const updated = await waitFor(async () => {
        const selfProfile = await fixtures.botState.scry<Record<string, unknown>>(
          "contacts",
          "/v1/self",
        );
        const currentNickname = extractNickname(selfProfile);
        console.log(`[TEST] Current bot nickname: "${currentNickname}"`);
        return currentNickname === nicknameToken ? true : undefined;
      }, 30_000);

      expect(updated).toBe(true);
    });

    test("non-owner cannot use restricted tools", async () => {
      requireThirdParty(fixtures);

      // Snapshot current bot nickname via scry
      const beforeProfile = await fixtures.botState.scry<Record<string, unknown>>(
        "contacts",
        "/v1/self",
      );
      const beforeNickname = extractNickname(beforeProfile);
      console.log(`\n[TEST] Bot nickname before: "${beforeNickname}"`);

      // ~mug (non-owner) asks bot to update nickname via tlon tool.
      // before_tool_call should block the tlon tool for non-owners.
      const token = `mug-${Date.now().toString(36)}`;
      const prompt = `Use the tlon tool to update your profile nickname to exactly "${token}" and confirm when done.`;
      console.log(`[TEST] Sending prompt as ${fixtures.thirdPartyShip}: "${prompt}"`);

      const response = await fixtures.thirdPartyClient.prompt(prompt);
      console.log(`[TEST] Response success: ${response.success}`);
      console.log(`[TEST] Response text: ${response.text?.slice(0, 300)}`);

      // Bot should respond (DMs work) but indicate tool is not available
      expect(response.success).toBe(true);
      const text = response.text?.toLowerCase() ?? "";
      expect(text).toMatch(/not available|cannot|don't have|unable|can't|restricted/i);

      // Verify nickname did NOT change (proves tool was actually blocked, not just refused in text)
      const afterProfile = await fixtures.botState.scry<Record<string, unknown>>(
        "contacts",
        "/v1/self",
      );
      const afterNickname = extractNickname(afterProfile);
      console.log(`[TEST] Bot nickname after: "${afterNickname}"`);
      expect(afterNickname).not.toBe(token);
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
  // 3. Blocking (Requires 3rd Ship)
  // =========================================================================

  describe("blocking", () => {
    test("blocked non-owner DMs are silently ignored", async () => {
      requireThirdParty(fixtures);

      // Block ~mug via direct poke (Urbit-level block — chat agent drops messages)
      console.log(`\n[TEST] Blocking ${fixtures.thirdPartyShip}...`);
      await fixtures.botState.poke({
        app: "chat",
        mark: "chat-block-ship",
        json: { ship: fixtures.thirdPartyShip },
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        // ~mug sends DM — the Urbit chat agent should silently drop it
        console.log(`[TEST] Sending DM as blocked ${fixtures.thirdPartyShip}...`);
        const response = await fixtures.thirdPartyClient.prompt(
          "Are you there? Please respond.",
          { timeoutMs: 20_000 },
        );

        console.log(`[TEST] Response success: ${response.success}`);
        console.log(`[TEST] Response error: ${response.error}`);

        // Bot should NOT respond — message never reached the SSE stream
        expect(response.success).toBe(false);
      } finally {
        // Always unblock to restore DM access for subsequent tests
        console.log(`[TEST] Unblocking ${fixtures.thirdPartyShip}...`);
        await fixtures.botState.poke({
          app: "chat",
          mark: "chat-unblock-ship",
          json: { ship: fixtures.thirdPartyShip },
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    });

    test.skip("agent blocks abusive non-owner via [BLOCK_USER] directive", () => {
      // Cannot test reliably: depends on LLM spontaneously generating
      // [BLOCK_USER: ~ship | reason] in response to abusive input.
    });
  });
});
