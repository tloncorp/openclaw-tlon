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

    // Initialize bot's contact profile (fresh fakezods don't have one)
    console.log("[SETUP] Initializing bot contact profile...");
    try {
      await botState.poke({
        app: "contacts",
        mark: "contact-action",
        json: {
          edit: [
            { nickname: "OpenClaw Bot" },
            { bio: "Integration test bot" },
            { status: "online" },
          ],
        },
      });
      // Give it a moment to propagate
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("[SETUP] Bot contact profile initialized");
    } catch (err) {
      console.log(`[SETUP] Warning: Failed to initialize profile: ${err}`);
    }
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
    const prompt = "Show your own profile details, including your ship name.";
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 300)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    // LLM formatting can vary, so don't require exact phrasing.
    // Require at least one strong profile identifier to appear.
    const text = response.text?.toLowerCase() ?? "";
    expect(text.length).toBeGreaterThan(0);
    expect(
      text.includes(botShip.toLowerCase()) ||
        text.includes("openclaw bot") ||
        text.includes("integration test bot") ||
        text.includes("status")
    ).toBe(true);
  });

  test("updates the bot profile nickname", async () => {
    const nicknameToken = `it-nick-${Date.now().toString(36)}`;
    const prompt = `Update your own profile nickname to exactly "${nicknameToken}" and confirm when done.`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    console.log(`[TEST] Waiting for profile nickname to be "${nicknameToken}"...`);
    const updated = await waitFor(async () => {
      const contacts = await botState.contacts();
      const self = (contacts ?? []).find((contact) => {
        const c = contact as { id?: string | null };
        return c.id === botShip;
      }) as
        | {
            nickname?: string | { value?: string | null } | null;
            nickName?: string | { value?: string | null } | null;
          }
        | undefined;

      const nicknameFromField =
        typeof self?.nickname === "string"
          ? self.nickname
          : (self?.nickname as { value?: string | null } | null | undefined)?.value;
      const nicknameFromAltField =
        typeof self?.nickName === "string"
          ? self.nickName
          : (self?.nickName as { value?: string | null } | null | undefined)?.value;

      const currentNickname = nicknameFromField ?? nicknameFromAltField ?? "";
      console.log(`[TEST] Current nickname: "${currentNickname}"`);
      return currentNickname === nicknameToken;
    }, 30_000);

    expect(updated).toBe(true);
  });

  test("updates the bot profile bio", async () => {
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
