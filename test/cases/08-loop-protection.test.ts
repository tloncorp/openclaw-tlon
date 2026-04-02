/**
 * Loop Protection Integration Tests
 *
 * Tests the bot-to-bot loop protection feature that prevents infinite
 * conversation loops between bots mentioning each other.
 *
 * LIMITATIONS:
 * Full bot-to-bot loop testing requires two OpenClaw bots in the same channel.
 * The current test environment only has one bot, so loop scenarios are skipped.
 */
import { describe, test, expect, beforeAll } from "vitest";
import {
  getFixtures,
  requireFixtureGroup,
  ensureThirdPartyDmAccess,
  type TestFixtures,
} from "../lib/index.js";

describe("loop protection", () => {
  let fixtures: TestFixtures;
  let hasThirdParty: boolean;

  beforeAll(async () => {
    fixtures = await getFixtures();
    requireFixtureGroup(fixtures);
    hasThirdParty = !!fixtures.thirdPartyClient;

    if (hasThirdParty) {
      await ensureThirdPartyDmAccess(fixtures);
    } else {
      console.log("[LOOP-PROTECTION] Skipping third-party tests - not configured");
    }
  }, 180_000);

  describe("human interactions", () => {
    test("human mention resets consecutive bot counter", async () => {
      // Owner sends a message in the channel
      // This should reset any consecutive bot counter for this channel
      const response = await fixtures.client.prompt(
        `Hey @${fixtures.botShip}, just checking in as a human`,
        { timeoutMs: 45_000, correlate: false }
      );

      expect(response.success).toBe(true);
      expect(response.text).toBeDefined();
      console.log(`[TEST] Bot responded to human: ${response.text?.slice(0, 100)}`);
    });

    test("consecutive human mentions all get responses", async () => {
      // Send multiple messages as the owner (human)
      // All should get responses since humans aren't rate-limited
      for (let i = 1; i <= 3; i++) {
        const response = await fixtures.client.prompt(
          `Human message ${i} of 3`,
          { timeoutMs: 30_000, correlate: false }
        );

        expect(response.success).toBe(true);
        console.log(`[TEST] Human response ${i}: ${response.text?.slice(0, 50)}`);
      }
    });
  });

  describe("regular users (no BotProfile)", () => {
    test("non-owner without BotProfile is treated as human", async () => {
      if (!hasThirdParty) {
        console.log("[TEST] Skipped - no third-party configured");
        return;
      }

      // Third-party ship sends via regular Tlon client (string author)
      // They should always get responses since they're not detected as a bot
      for (let i = 1; i <= 5; i++) {
        const response = await fixtures.thirdPartyClient!.prompt(
          `Regular user message ${i} - should always get response`,
          { timeoutMs: 30_000 }
        );

        expect(response.success).toBe(true);
        console.log(`[TEST] Regular user response ${i}: ${response.text?.slice(0, 30)}`);
      }
    });
  });

  describe("bot-to-bot loop protection", () => {
    /**
     * These tests require two OpenClaw bots in the same channel.
     * The current test environment only has one bot (~zod).
     *
     * To test properly, you would need:
     * 1. Two ships running OpenClaw bots
     * 2. Both bots in the same group channel
     * 3. Owner tells Bot A to mention Bot B
     * 4. Bot B responds and mentions Bot A
     * 5. Loop continues until maxConsecutiveBotResponses is reached
     */

    test.skip("bot stops responding after maxConsecutiveBotResponses", async () => {
      // Requires multi-bot setup
      // After 3 consecutive bot mentions (default limit), bot should stop responding
    });

    test.skip("warning message appears when at limit", async () => {
      // Requires multi-bot setup
      // Response to 3rd consecutive bot mention should include:
      // "This is my last response to [bot] for now..."
    });

    test.skip("human mention breaks the loop and allows continuation", async () => {
      // Requires multi-bot setup
      // After human mentions bot, the counter resets and bot responds to bots again
    });
  });
});
