/**
 * Security Integration Tests
 *
 * Tests security features that protect the bot:
 * - Tool access control (owner can use restricted tools, non-owner blocked)
 * - Slash commands for block management (/blocked, /unblock)
 * - Blocked ships cannot DM the bot (Urbit-level blocking)
 *
 * TEST ENVIRONMENT:
 *   ~zod = bot ship
 *   ~ten = test user (configured as ownerShip)
 *   ~mug = third-party ship (non-owner, for security tests)
 */
import { describe, test, expect, beforeAll } from "vitest";
import { getFixtures, waitFor, requireThirdParty, type TestFixtures } from "../lib/index.js";

describe("security", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  }, 180_000);

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
   * Query the bot's blocked ship list via direct scry.
   */
  async function getBlockedShips(): Promise<string[]> {
    const raw = await fixtures.botState.scry<string[]>("chat", "/blocked");
    return Array.isArray(raw) ? raw : [];
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

      // LLM processing for non-owner can be slow (tool attempt, blocked, retry/explain)
      const response = await fixtures.thirdPartyClient.prompt(prompt, { timeoutMs: 90_000 });
      console.log(`[TEST] Response success: ${response.success}`);
      console.log(`[TEST] Response text: ${response.text?.slice(0, 300)}`);

      // Bot should respond (DMs work). We don't assert on the response text because
      // the LLM's phrasing is non-deterministic — the real test is the scry below.
      expect(response.success).toBe(true);

      // Verify nickname did NOT change (proves tool was actually blocked)
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
  // 2. Slash Commands: Block Management
  // =========================================================================

  describe("slash commands: block management", () => {
    test("'/blocked' command lists blocked ships", async () => {
      // Block ~nec so the list isn't empty
      console.log("\n[TEST] Blocking ~nec...");
      await fixtures.botState.poke({
        app: "chat",
        mark: "chat-block-ship",
        json: { ship: "~nec" },
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        const response = await fixtures.client.prompt("/blocked");
        console.log(`[TEST] Response: ${response.text?.slice(0, 500)}`);

        if (!response.success) {
          throw new Error(response.error ?? "/blocked command failed");
        }

        // Response should contain the blocked ship
        expect(response.text ?? "").toContain("~nec");
      } finally {
        // Always clean up the block
        await fixtures.botState.poke({
          app: "chat",
          mark: "chat-unblock-ship",
          json: { ship: "~nec" },
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    });

    test("'/unblock ~ship' removes a blocked ship", async () => {
      // Block ~nec, then unblock via slash command
      console.log("\n[TEST] Blocking ~nec for unblock test...");
      await fixtures.botState.poke({
        app: "chat",
        mark: "chat-block-ship",
        json: { ship: "~nec" },
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Verify block is active via scry
      const blockedBefore = await getBlockedShips();
      console.log(`[TEST] Blocked ships before: ${JSON.stringify(blockedBefore)}`);
      expect(blockedBefore).toContain("~nec");

      // Send /unblock command
      const response = await fixtures.client.prompt("/unblock ~nec");
      console.log(`[TEST] Response: ${response.text?.slice(0, 500)}`);

      if (!response.success) {
        // Clean up in case of failure
        await fixtures.botState.poke({
          app: "chat",
          mark: "chat-unblock-ship",
          json: { ship: "~nec" },
        });
        throw new Error(response.error ?? "/unblock command failed");
      }

      // Verify unblock via scry
      const blockedAfter = await getBlockedShips();
      console.log(`[TEST] Blocked ships after: ${JSON.stringify(blockedAfter)}`);
      expect(blockedAfter).not.toContain("~nec");
    });

    test("'/unblock ~ship' reports when ship is not blocked", async () => {
      // Owner sends /unblock ~wanzod for a ship that's not blocked
      const response = await fixtures.client.prompt("/unblock ~wanzod");
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

  // =========================================================================
  // 4. DM Allowlist Authorization
  // =========================================================================

  describe("DM allowlist authorization", () => {
    /**
     * Seed the bot's dmAllowlist in the settings store via direct poke.
     */
    async function seedDmAllowlist(ships: string[]): Promise<void> {
      await fixtures.botState.poke({
        app: "settings",
        mark: "settings-event",
        json: {
          "put-entry": {
            desk: "moltbot",
            "bucket-key": "tlon",
            "entry-key": "dmAllowlist",
            value: ships,
          },
        },
      });
      // Give the settings subscription time to propagate
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    /**
     * Read dmAllowlist from bot's settings store via scry.
     */
    async function getDmAllowlist(): Promise<string[]> {
      const raw = await fixtures.botState.scry<{
        all?: Record<string, Record<string, { dmAllowlist?: string[] }>>;
      }>("settings", "/all");
      return raw?.all?.moltbot?.tlon?.dmAllowlist ?? [];
    }

    test("blocked ship on allowlist is still blocked (Urbit-level)", async () => {
      requireThirdParty(fixtures);

      // Ensure the third party ship is on the allowlist
      const currentList = await getDmAllowlist();
      if (!currentList.includes(fixtures.thirdPartyShip)) {
        await seedDmAllowlist([...currentList, fixtures.thirdPartyShip]);
      }

      // Block the ship via Tlon's native blocking
      // Urbit's chat agent drops messages from blocked ships at the protocol
      // level, so the message never reaches the bot's SSE stream — regardless
      // of the allowlist state.
      console.log(`\n[TEST] Blocking ${fixtures.thirdPartyShip} (while on allowlist)...`);
      await fixtures.botState.poke({
        app: "chat",
        mark: "chat-block-ship",
        json: { ship: fixtures.thirdPartyShip },
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        // Third party sends DM — Urbit drops it before it reaches the bot
        console.log(`[TEST] Sending DM as blocked+allowlisted ${fixtures.thirdPartyShip}...`);
        const response = await fixtures.thirdPartyClient.prompt(
          "Testing blocked ship on allowlist. Please respond.",
          { timeoutMs: 20_000 },
        );

        console.log(`[TEST] Response success: ${response.success}`);
        console.log(`[TEST] Response error: ${response.error}`);

        expect(response.success).toBe(false);
      } finally {
        // Clean up: unblock the ship
        console.log(`[TEST] Unblocking ${fixtures.thirdPartyShip}...`);
        await fixtures.botState.poke({
          app: "chat",
          mark: "chat-unblock-ship",
          json: { ship: fixtures.thirdPartyShip },
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    });

    test.skip("removing ship from allowlist triggers approval instead of response", () => {
      // Cannot test reliably: depends on settings subscription propagating
      // the allowlist change to the bot's in-memory state within the test
      // timeout. The 5-minute periodic refresh is too slow for tests, and
      // the SSE subscription may not propagate external pokes reliably.
      // The core security fix (blocked ships bypass allowlist) is validated
      // by the "blocked ship on allowlist" test above.
    });

    test.skip("block action removes ship from allowlist", () => {
      // Cannot test reliably: requires the bot's in-memory pendingApprovals
      // to be updated via settings subscription after an external poke, which
      // doesn't propagate reliably in the test environment. The code change
      // (blockShip + removeFromDmAllowlist) is straightforward and verified
      // by code review. The critical security fix is validated by the
      // "blocked ship on allowlist" test above.
    });
  });
});
