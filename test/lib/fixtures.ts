/**
 * Shared Test Fixtures
 *
 * Creates test resources (groups, channels, DMs) once and caches them
 * for all test suites to use.
 */

import {
  createTestClient,
  createStateClient,
  getTestConfig,
  type TestClient,
  type StateClient,
} from "./index.js";

export interface TestFixtures {
  /** Test client for sending prompts */
  client: TestClient;
  /** Bot ship state client */
  botState: StateClient;
  /** Test user ship state client */
  userState: StateClient;
  /** Bot ship name (with ~) */
  botShip: string;
  /** Test user ship name (with ~) */
  userShip: string;
  /** Test group created by bot */
  group: {
    id: string;
    title: string;
    chatChannel: string;
  } | null;
}

let cachedFixtures: TestFixtures | null = null;
let setupPromise: Promise<TestFixtures> | null = null;

/**
 * Get or create shared test fixtures.
 * Safe to call from multiple test files - will only set up once.
 */
export async function getFixtures(): Promise<TestFixtures> {
  if (cachedFixtures) {
    return cachedFixtures;
  }

  if (setupPromise) {
    return setupPromise;
  }

  setupPromise = setupFixtures();
  cachedFixtures = await setupPromise;
  return cachedFixtures;
}

async function setupFixtures(): Promise<TestFixtures> {
  console.log("\n[FIXTURES] Setting up shared test fixtures...");

  const config = getTestConfig();
  const client = createTestClient(config);
  const botState = createStateClient(config.bot);
  const userState = createStateClient(config.testUser);

  const botShip = config.bot.shipName.startsWith("~")
    ? config.bot.shipName
    : `~${config.bot.shipName}`;
  const userShip = config.testUser.shipName.startsWith("~")
    ? config.testUser.shipName
    : `~${config.testUser.shipName}`;

  // 1. Initialize bot profile
  console.log("[FIXTURES] Initializing bot profile...");
  try {
    await botState.poke({
      app: "contacts",
      mark: "contact-action",
      json: {
        edit: [
          { nickname: "OpenClaw Test Bot" },
          { bio: "Integration test bot" },
          { status: "online" },
        ],
      },
    });
    await sleep(2000);
    console.log("[FIXTURES] ✓ Bot profile initialized");
  } catch (err) {
    console.log(`[FIXTURES] Warning: Failed to initialize profile: ${err}`);
  }

  // 2. Create a test group with a chat channel
  console.log("[FIXTURES] Creating test group...");
  let group: TestFixtures["group"] = null;

  try {
    // Check for existing fixture group first
    const existingGroups = await botState.groups();
    const existing = (existingGroups ?? []).find((g) => {
      const gr = g as { title?: string };
      return gr.title?.startsWith("OpenClaw Test Fixtures");
    }) as { id?: string; title?: string; channels?: Array<{ id?: string }> } | undefined;

    if (existing?.id) {
      console.log(`[FIXTURES] ✓ Using existing group: ${existing.id}`);
      const channels = existing.channels ?? [];
      const chatChannel = channels.find((c) => c.id?.includes("chat"))?.id;
      group = {
        id: existing.id,
        title: existing.title ?? "OpenClaw Test Fixtures",
        chatChannel: chatChannel ?? `chat/${existing.id}/general`,
      };
    } else {
      // Create new group via the agent
      const suffix = Date.now().toString(36);
      const groupTitle = `OpenClaw Test Fixtures ${suffix}`;

      const createResponse = await client.prompt(
        `Create a private group with title "${groupTitle}". After creating it, tell me the group id.`,
        { timeoutMs: 90_000 }
      );

      if (createResponse.success) {
        // Wait for group to appear
        const created = await waitFor(async () => {
          const groups = await botState.groups();
          return (groups ?? []).find((g) => {
            const gr = g as { title?: string };
            return gr.title === groupTitle;
          }) as { id?: string; title?: string; channels?: Array<{ id?: string }> } | undefined;
        }, 45_000);

        if (created?.id) {
          const channels = created.channels ?? [];
          const chatChannel = channels.find((c) => c.id?.includes("chat"))?.id;
          group = {
            id: created.id,
            title: groupTitle,
            chatChannel: chatChannel ?? `chat/${created.id}/general`,
          };
          console.log(`[FIXTURES] ✓ Created group: ${created.id}`);
        }
      }
    }
  } catch (err) {
    console.log(`[FIXTURES] Warning: Failed to create group: ${err}`);
  }

  // 3. Ensure DM channel exists by sending a message
  console.log("[FIXTURES] Ensuring DM channel exists...");
  try {
    // The test client sends via DM, so just sending any prompt establishes the channel
    await client.prompt("Hello, this is a test setup message.", { timeoutMs: 60_000 });
    await sleep(2000);
    console.log("[FIXTURES] ✓ DM channel established");
  } catch (err) {
    console.log(`[FIXTURES] Warning: DM setup failed: ${err}`);
  }

  console.log("[FIXTURES] Setup complete!\n");

  return {
    client,
    botState,
    userState,
    botShip,
    userShip,
    group,
  };
}

export async function waitFor<T>(
  fn: () => Promise<T | undefined>,
  timeoutMs: number,
  intervalMs = 1500
): Promise<T | undefined> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = await fn();
    if (result) {
      return result;
    }
    await sleep(intervalMs);
  }
  return undefined;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
