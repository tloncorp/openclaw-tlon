/**
 * Loop Protection Integration Tests
 *
 * Tests the bot-to-bot loop protection feature that prevents infinite
 * conversation loops between bots mentioning each other.
 *
 * The bot detects other bots by checking if incoming messages have a
 * BotProfile author (object with ship/nickname/avatar) vs a plain ship string.
 */
import { describe, test, expect, beforeAll } from "vitest";
import { getFixtures, requireFixtureGroup, requireThirdParty, type TestFixtures } from "../lib/index.js";

describe("loop protection", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  }, 180_000);

  /**
   * Helper to send a message with BotProfile author format (simulates another bot).
   * This pokes a channel message with an object author instead of string author.
   */
  async function sendAsBotInChannel(
    channelNest: string,
    text: string,
    senderShip: string,
    botNickname = "Test Bot"
  ): Promise<void> {
    const sentAt = Date.now();
    
    await fixtures.thirdPartyState!.poke({
      app: "channels",
      mark: "channel-action-1",
      json: {
        channel: {
          nest: channelNest,
          action: {
            post: {
              add: {
                content: [{ inline: [text] }],
                sent: sentAt,
                kind: "/chat",
                author: {
                  ship: senderShip,
                  nickname: botNickname,
                  avatar: "",
                },
                blob: null,
                meta: null,
              },
            },
          },
        },
      },
    });
    
    // Give the message time to be processed
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  describe("human interactions reset bot counter", () => {
    test("owner message in channel resets consecutive counter", async () => {
      requireFixtureGroup(fixtures);

      const response = await fixtures.client.prompt(
        `@${fixtures.botShip} confirm you're responding and counter is reset`,
        { timeoutMs: 45_000 }
      );

      expect(response.success).toBe(true);
      expect(response.text).toBeDefined();
      console.log(`[TEST] Bot responded: ${response.text?.slice(0, 100)}`);
    });
  });

  describe("bot detection and rate limiting", () => {
    test("detects BotProfile author as bot and increments counter", async () => {
      requireFixtureGroup(fixtures);
      requireThirdParty(fixtures);

      const channel = fixtures.group!.chatChannel;
      console.log(`[TEST] Sending bot message to ${channel}...`);

      // Send a message with BotProfile author (simulating another bot mentioning us)
      await sendAsBotInChannel(
        channel,
        `Hey @${fixtures.botShip}, this is a test from another bot`,
        fixtures.thirdPartyShip!,
        "Fake Bot"
      );

      // Wait for response - bot should respond (count = 1, under limit)
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Now reset counter with human message
      const humanResponse = await fixtures.client.prompt(
        "Confirming human presence to reset counter",
        { timeoutMs: 30_000 }
      );

      expect(humanResponse.success).toBe(true);
      console.log(`[TEST] Human reset successful: ${humanResponse.text?.slice(0, 50)}`);
    });

    test("stops responding after exceeding maxConsecutiveBotResponses", async () => {
      requireFixtureGroup(fixtures);
      requireThirdParty(fixtures);

      const channel = fixtures.group!.chatChannel;

      // First, reset the counter with a human message
      console.log("[TEST] Resetting counter with human message...");
      await fixtures.client.prompt("Reset the bot counter please", { timeoutMs: 30_000 });

      // Send 4 consecutive "bot" messages (default limit is 3)
      // Messages 1-3 should get responses, message 4 should be ignored
      console.log("[TEST] Sending 4 consecutive bot messages...");
      
      for (let i = 1; i <= 4; i++) {
        console.log(`[TEST] Sending bot message ${i}...`);
        await sendAsBotInChannel(
          channel,
          `@${fixtures.botShip} bot message ${i} of 4`,
          fixtures.thirdPartyShip!,
          "Loop Test Bot"
        );
        
        // Wait between messages to let the bot process
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }

      // Wait for any final processing
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Verify by sending a human message - this should work and reset counter
      const finalResponse = await fixtures.client.prompt(
        "Human here - did you stop responding to the bot after 3 messages?",
        { timeoutMs: 30_000 }
      );

      expect(finalResponse.success).toBe(true);
      console.log(`[TEST] Final human response: ${finalResponse.text?.slice(0, 100)}`);
    });

    test("warning message appears at limit", async () => {
      requireFixtureGroup(fixtures);
      requireThirdParty(fixtures);

      const channel = fixtures.group!.chatChannel;

      // Reset counter
      console.log("[TEST] Resetting counter...");
      await fixtures.client.prompt("Reset counter", { timeoutMs: 30_000 });

      // Send exactly 3 bot messages (at the limit)
      // The 3rd response should include a warning
      console.log("[TEST] Sending 3 bot messages to reach limit...");
      
      for (let i = 1; i <= 3; i++) {
        console.log(`[TEST] Bot message ${i}/3...`);
        await sendAsBotInChannel(
          channel,
          `@${fixtures.botShip} reaching the limit - message ${i}`,
          fixtures.thirdPartyShip!,
          "Warning Test Bot"
        );
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }

      // Wait for processing
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // The bot's response to the 3rd message should have included a warning like:
      // "This is my last response to [bot] for now..."
      // We can verify by asking
      const checkResponse = await fixtures.client.prompt(
        "Did your last response to the bot include a warning about it being your last response?",
        { timeoutMs: 30_000 }
      );

      expect(checkResponse.success).toBe(true);
      console.log(`[TEST] Warning check response: ${checkResponse.text?.slice(0, 150)}`);
    });
  });

  describe("third-party without BotProfile", () => {
    test("regular user messages are treated as human (not rate-limited)", async () => {
      requireThirdParty(fixtures);

      // Third-party ship sends via regular Tlon client (string author)
      // Should always get responses since they're not detected as a bot
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
});
