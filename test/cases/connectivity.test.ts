/**
 * Connectivity Tests
 *
 * Basic tests to verify we can connect to ships and scry data.
 * Run these first to isolate connectivity issues from bot logic.
 */

import { describe, test, expect, beforeAll } from "vitest";
import { createStateClient, getTestConfig, type StateClient } from "../lib/index.js";

describe("connectivity", () => {
  let botState: StateClient;
  let userState: StateClient;
  let botShip: string;
  let userShip: string;

  beforeAll(() => {
    const config = getTestConfig();
    botState = createStateClient(config.bot);
    userState = createStateClient(config.testUser);
    botShip = config.bot.shipName.startsWith("~") ? config.bot.shipName : `~${config.bot.shipName}`;
    userShip = config.testUser.shipName.startsWith("~")
      ? config.testUser.shipName
      : `~${config.testUser.shipName}`;

    console.log(`\n=== Test Configuration ===`);
    console.log(`Bot ship: ${botShip} @ ${config.bot.shipUrl}`);
    console.log(`User ship: ${userShip} @ ${config.testUser.shipUrl}`);
    console.log(`===========================\n`);
  });

  test("connects to bot ship (~zod)", async () => {
    console.log(`Connecting to bot ship ${botShip}...`);
    await botState.connect();
    console.log(`✓ Connected to bot ship`);
  });

  test("connects to test user ship (~ten)", async () => {
    console.log(`Connecting to test user ship ${userShip}...`);
    await userState.connect();
    console.log(`✓ Connected to test user ship`);
  });

  test("scries contacts from bot ship", async () => {
    console.log(`Scrying contacts from bot ship...`);
    const contacts = await botState.contacts();
    console.log(`✓ Got ${Array.isArray(contacts) ? contacts.length : 0} contacts from bot ship`);
    expect(Array.isArray(contacts)).toBe(true);
  });

  test("scries contacts from test user ship", async () => {
    console.log(`Scrying contacts from test user ship...`);
    const contacts = await userState.contacts();
    console.log(`✓ Got ${Array.isArray(contacts) ? contacts.length : 0} contacts from test user ship`);
    expect(Array.isArray(contacts)).toBe(true);
  });

  test("scries self profile from bot ship", async () => {
    console.log(`Scrying self profile from bot ship...`);
    try {
      const profile = await botState.scry("contacts", `/v1/self`);
      console.log(`✓ Bot self profile:`, JSON.stringify(profile, null, 2));
      expect(profile).toBeDefined();
    } catch (err) {
      console.log(`✗ Failed to scry self profile:`, err);
      throw err;
    }
  });

  test("scries groups from bot ship", async () => {
    console.log(`Scrying groups from bot ship...`);
    const groups = await botState.groups();
    console.log(`✓ Bot has ${Array.isArray(groups) ? groups.length : 0} groups`);
    expect(groups).toBeDefined();
  });

  test("scries settings from bot ship", async () => {
    console.log(`Scrying settings from bot ship...`);
    const settings = await botState.settings();
    console.log(`✓ Got settings from bot ship:`, typeof settings);
    expect(settings).toBeDefined();
  });

  test("can read DM channel posts from test user", async () => {
    console.log(`Reading DM channel from test user's perspective...`);
    try {
      const posts = await userState.channelPosts(botShip, 10);
      console.log(`✓ Got ${Array.isArray(posts) ? posts.length : 0} posts from DM channel`);
      if (Array.isArray(posts) && posts.length > 0) {
        console.log(`  Sample post:`, JSON.stringify(posts[0], null, 2).slice(0, 500));
      }
      expect(posts).toBeDefined();
    } catch (err) {
      console.log(`✗ Failed to read DM channel:`, err);
      throw err;
    }
  });

  test("can send DM from test user to bot", async () => {
    console.log(`Sending test DM from ${userShip} to ${botShip}...`);
    const { Urbit } = await import("@tloncorp/api");
    const { sendDm } = await import("../../src/urbit/send.js");

    const config = getTestConfig();
    const testUserShipClean = config.testUser.shipName.replace(/^~/, "");
    const urbit = new Urbit(config.testUser.shipUrl, config.testUser.code);
    urbit.ship = testUserShipClean;

    try {
      await urbit.connect();
      console.log(`✓ Connected urbit client for ${userShip}`);

      const testMessage = `connectivity-test-${Date.now()}`;
      await sendDm({
        api: { poke: (params) => urbit.poke(params) },
        fromShip: config.testUser.shipName,
        toShip: config.bot.shipName,
        text: testMessage,
      });
      console.log(`✓ Sent DM: "${testMessage}"`);

      // Wait a bit for the message to propagate
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check if the message appears in the DM channel
      const posts = await userState.channelPosts(botShip, 10);
      const found = (posts ?? []).some((post) => {
        const p = post as { textContent?: string };
        return p.textContent?.includes(testMessage);
      });
      console.log(`✓ Message found in DM channel: ${found}`);
      expect(found).toBe(true);

      // Wait for the bot to process and respond so subsequent tests have a clean baseline.
      // This prevents the bot's response from bleeding into later tests.
      console.log(`Waiting for bot to respond (to clear queue for subsequent tests)...`);
      const maxWaitMs = 30_000;
      const startTime = Date.now();
      let botResponded = false;
      while (Date.now() - startTime < maxWaitMs) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const laterPosts = await userState.channelPosts(botShip, 30);
        const botPosts = (laterPosts ?? []).filter((post) => {
          const p = post as { authorId?: string };
          return p.authorId === botShip;
        });
        // Check if any bot post is newer than our test message
        const ourMsgPost = (laterPosts ?? []).find((post) => {
          const p = post as { textContent?: string };
          return p.textContent?.includes(testMessage);
        }) as { sentAt?: number } | undefined;
        const ourMsgTime = ourMsgPost?.sentAt ?? 0;
        const newerBotPost = botPosts.find((post) => {
          const p = post as { sentAt?: number };
          return (p.sentAt ?? 0) > ourMsgTime;
        });
        if (newerBotPost) {
          console.log(`✓ Bot responded - queue cleared for subsequent tests`);
          botResponded = true;
          break;
        }
      }
      if (!botResponded) {
        console.log(`⚠ Bot did not respond within ${maxWaitMs}ms - subsequent tests may be affected`);
      }
    } catch (err) {
      console.log(`✗ DM send failed:`, err);
      throw err;
    }
  });
});
