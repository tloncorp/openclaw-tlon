/**
 * Shared Test Fixtures
 *
 * Creates test resources (groups, channels, DMs) once and caches them
 * for all test suites to use.
 */

import {
  createTestClient,
  createTlonClient,
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
  /** Third-party (non-owner) client for security tests */
  thirdPartyClient?: TestClient;
  /** Third-party ship state client */
  thirdPartyState?: StateClient;
  /** Third-party ship name (with ~) */
  thirdPartyShip?: string;
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
  let existing:
    | { id?: string; title?: string; channels?: Array<{ id?: string }> }
    | undefined;

  try {
    // Check for existing fixture group first
    const existingGroups = await botState.groups();
    existing = (existingGroups ?? []).find((g) => {
      const gr = g as { title?: string };
      return gr.title?.startsWith("OpenClaw Test Fixtures");
    }) as { id?: string; title?: string; channels?: Array<{ id?: string }> } | undefined;
  } catch (err) {
    console.log(
      `[FIXTURES] Warning: Failed to list existing groups, falling back to createGroup(): ${err}`,
    );
  }

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
    // Create new group directly via API (more reliable than prompting agent)
    const suffix = Date.now().toString(36);
    const groupTitle = `OpenClaw Test Fixtures ${suffix}`;

    for (let attempt = 1; attempt <= 3 && !group; attempt++) {
      try {
        const { groupId, chatChannel } = await botState.createGroup(groupTitle);
        group = {
          id: groupId,
          title: groupTitle,
          chatChannel,
        };
        console.log(`[FIXTURES] ✓ Created group: ${groupId}`);
      } catch (err) {
        console.log(
          `[FIXTURES] Warning: Failed to create group (attempt ${attempt}/3): ${err}`,
        );
        if (attempt < 3) {
          await sleep(2000);
        }
      }
    }
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

  // 4. Set up third-party (non-owner) ship if configured
  let thirdPartyClient: TestClient | undefined;
  let thirdPartyState: StateClient | undefined;
  let thirdPartyShip: string | undefined;

  if (config.thirdParty) {
    thirdPartyShip = config.thirdParty.shipName.startsWith("~")
      ? config.thirdParty.shipName
      : `~${config.thirdParty.shipName}`;
    thirdPartyState = createStateClient(config.thirdParty);
    thirdPartyClient = createTlonClient({
      testUser: config.thirdParty,
      bot: config.bot,
    });

    console.log(`[FIXTURES] Establishing DM access for ${thirdPartyShip} via approval flow...`);
    try {
      let accessReady = false;

      for (let attempt = 1; attempt <= 3 && !accessReady; attempt++) {
        console.log(`[FIXTURES] ${thirdPartyShip} approval attempt ${attempt}/3...`);

        // ~mug sends DM (not on allowlist, triggers approval request to owner)
        const mugPromise = thirdPartyClient.prompt(
          `Hello, requesting DM access for integration tests (attempt ${attempt}).`,
          { timeoutMs: 45_000 },
        );

        // Wait for the approval notification to reach the owner
        await sleep(8000);

        // Owner (~ten) approves the DM request via slash command
        const approvalResponse = await client.prompt("/allow", { timeoutMs: 45_000 });
        console.log(
          `[FIXTURES] Approval response: ${approvalResponse.text?.slice(0, 200)}`,
        );

        // Log whatever the initial ~mug request got back, but don't treat it as proof
        // that DM access is actually established.
        const mugResponse = await mugPromise;
        console.log(
          `[FIXTURES] ${thirdPartyShip} initial DM response: ${mugResponse.text?.slice(0, 200)}`,
        );

        // The real proof is whether a fresh, normal follow-up DM now gets a response.
        const probeResponse = await thirdPartyClient.prompt(
          "Hi there! Just reply with a short hello so I know DM access is working now.",
          { timeoutMs: 45_000 },
        );
        console.log(
          `[FIXTURES] ${thirdPartyShip} probe response: ${probeResponse.text?.slice(0, 200)}`,
        );

        if (probeResponse.success) {
          accessReady = true;
          console.log(`[FIXTURES] ✓ ${thirdPartyShip} DM access established via approval`);
        } else {
          console.log(
            `[FIXTURES] Warning: ${thirdPartyShip} approval probe failed on attempt ${attempt}: ${probeResponse.error}`,
          );
          if (attempt < 3) {
            await sleep(5000);
          }
        }
      }
    } catch (err) {
      console.log(`[FIXTURES] Warning: ${thirdPartyShip} DM setup failed: ${String(err)}`);
    }
  }

  console.log("[FIXTURES] Setup complete!\n");

  return {
    client,
    botState,
    userState,
    botShip,
    userShip,
    group,
    thirdPartyClient,
    thirdPartyState,
    thirdPartyShip,
  };
}

export async function waitFor<T>(
  fn: () => Promise<T | undefined>,
  timeoutMs: number,
  intervalMs = 1500,
  description = "condition"
): Promise<T> {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const result = await fn();
    if (result) {
      return result;
    }
    await sleep(intervalMs);
  }
  throw new Error(`Timeout waiting for ${description} after ${timeoutMs}ms`);
}

/**
 * Asserts that fixture group exists, throwing a descriptive error if not.
 * Use this instead of early returns so tests fail clearly when fixtures are missing.
 */
export function requireFixtureGroup(
  fixtures: TestFixtures
): asserts fixtures is TestFixtures & { group: NonNullable<TestFixtures["group"]> } {
  if (!fixtures.group) {
    throw new Error(
      "Test requires fixture group but it was not created. " +
        "Check fixture setup logs for errors."
    );
  }
}

/**
 * Asserts that third-party (non-owner) ship fixtures exist.
 * Tests using this require TEST_THIRD_PARTY_* env vars (set by test/run.sh).
 */
export function requireThirdParty(
  fixtures: TestFixtures
): asserts fixtures is TestFixtures & {
  thirdPartyClient: TestClient;
  thirdPartyState: StateClient;
  thirdPartyShip: string;
} {
  if (!fixtures.thirdPartyClient || !fixtures.thirdPartyState || !fixtures.thirdPartyShip) {
    throw new Error(
      "Test requires third-party ship but it was not configured. " +
        "Set TEST_THIRD_PARTY_URL, TEST_THIRD_PARTY_SHIP, TEST_THIRD_PARTY_CODE env vars."
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
