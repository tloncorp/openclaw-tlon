import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { createTestClient, createStateClient, getTestConfig, type TestClient, type StateClient } from "../lib/index.js";
import { getTextContent } from "@tloncorp/api";

describe("contacts", () => {
  let client: TestClient;
  let botState: StateClient;
  let userState: StateClient;
  let botShip: string;
  let testFailed = false;

  beforeAll(async () => {
    const config = getTestConfig();
    client = createTestClient(config);
    botState = createStateClient(config.bot);
    userState = createStateClient(config.testUser);
    botShip = config.bot.shipName.startsWith("~") ? config.bot.shipName : `~${config.bot.shipName}`;

    // Wait for any pending messages from previous tests to settle.
    // This prevents the baseline timestamp from racing with message propagation.
    await new Promise((resolve) => setTimeout(resolve, 5000));
  });

  afterAll(async () => {
    // Dump all DM messages for debugging
    console.log("\n=== DM Channel Debug Dump ===");
    try {
      const dmPosts = await userState.channelPosts(botShip, 50);
      console.log(`Total posts in DM channel: ${(dmPosts ?? []).length}`);
      
      const messages = (dmPosts ?? []).map((post) => {
        const p = post as {
          authorId?: string;
          sentAt?: number;
          textContent?: string | null;
          content?: unknown;
        };
        const textContent = p.textContent ?? getTextContent(p.content);
        return {
          from: p.authorId,
          time: p.sentAt ? new Date(p.sentAt).toISOString() : "unknown",
          text: (textContent ?? "").slice(0, 500),
        };
      });
      
      // Sort by time
      messages.sort((a, b) => (a.time > b.time ? 1 : -1));
      
      console.log("\nMessage flow:");
      for (const msg of messages) {
        console.log(`[${msg.time}] ${msg.from}: ${msg.text}`);
      }
      console.log("=== End Debug Dump ===\n");
    } catch (err) {
      console.log(`Failed to dump DM messages: ${err}`);
    }
  });

  test("reads the bot ship profile", async () => {
    const prompt = "Show your own profile details, including your ship.";
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);
    
    const response = await client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 300)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();
    expect(response.text?.toLowerCase()).toContain(botShip.toLowerCase());
  });

  // Skip: fresh fakezod ships don't have contact profiles initialized
  // TODO: Add contact profile initialization to CI setup
  test.skip("updates the bot profile status", async () => {
    const statusToken = `it-status-${Date.now().toString(36)}`;
    const prompt = `Update your own profile status to exactly "${statusToken}" and confirm when done.`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);
    
    const response = await client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    console.log(`[TEST] Waiting for profile status to be "${statusToken}"...`);
    const updated = await waitFor(async () => {
      const contacts = await botState.contacts();
      const self = (contacts ?? []).find((contact) => {
        const c = contact as { id?: string | null };
        return c.id === botShip;
      }) as { status?: string | null } | undefined;
      const currentStatus = self?.status ?? "";
      console.log(`[TEST] Current status: "${currentStatus}"`);
      return currentStatus === statusToken;
    }, 30_000);

    expect(updated).toBe(true);
  });

  // Skip: fresh fakezod ships don't have contact profiles initialized
  // TODO: Add contact profile initialization to CI setup
  test.skip("updates the bot profile bio", async () => {
    const bioToken = `openclaw-integration-bio-${Date.now().toString(36)}`;
    const prompt = `Update your own profile bio to exactly "${bioToken}" and confirm when done.`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);
    
    const response = await client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    console.log(`[TEST] Waiting for profile bio to be "${bioToken}"...`);
    const updated = await waitFor(async () => {
      const contacts = await botState.contacts();
      const self = (contacts ?? []).find((contact) => {
        const c = contact as { id?: string | null };
        return c.id === botShip;
      }) as { bio?: string | null } | undefined;
      const currentBio = self?.bio ?? "";
      console.log(`[TEST] Current bio: "${currentBio}"`);
      return currentBio === bioToken;
    }, 30_000);

    expect(updated).toBe(true);
  });
});

async function waitFor(fn: () => Promise<boolean>, timeoutMs: number, intervalMs = 1500): Promise<boolean> {
  const started = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await fn();
    if (result) {
      return true;
    }
    if (Date.now() - started >= timeoutMs) {
      throw new Error(`Timed out after ${timeoutMs}ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
