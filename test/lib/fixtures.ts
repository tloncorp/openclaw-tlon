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

interface SettingsAllResponse {
  all?: Record<
    string,
    Record<
      string,
      {
        dmAllowlist?: string[];
        pendingApprovals?: string;
      }
    >
  >;
}

interface PendingApproval {
  id: string;
  requestingShip: string;
  notificationMessageId?: string;
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
      // Create new group directly via API (more reliable than prompting agent)
      const suffix = Date.now().toString(36);
      const groupTitle = `OpenClaw Test Fixtures ${suffix}`;

      const { groupId, chatChannel } = await botState.createGroup(groupTitle);
      group = {
        id: groupId,
        title: groupTitle,
        chatChannel,
      };
      console.log(`[FIXTURES] ✓ Created group: ${groupId}`);
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

export async function ensureThirdPartyDmAccess(fixtures: TestFixtures): Promise<void> {
  requireThirdParty(fixtures);

  const { botState, client, thirdPartyClient, thirdPartyState, thirdPartyShip, botShip } =
    fixtures;

  console.log(`[FIXTURES] Ensuring DM access for ${thirdPartyShip}...`);

  await ensureShipUnblocked(botState, thirdPartyShip);
  await ensureShipOnDmAllowlist(botState, thirdPartyShip);

  if (await hasPriorBotDm(thirdPartyState, botShip)) {
    console.log(`[FIXTURES] ✓ ${thirdPartyShip} already has prior DM access`);
    return;
  }

  const probeToken = `fixture-dm-check-${Date.now().toString(36)}`;
  const probeResponse = await thirdPartyClient.prompt(
    `Hello, this is a DM access check for integration tests. Reply with "${probeToken}".`,
    { timeoutMs: 45_000 },
  );

  if (probeResponse.success) {
    console.log(`[FIXTURES] ✓ ${thirdPartyShip} DM access confirmed`);
    return;
  }

  console.log(
    `[FIXTURES] DM probe failed for ${thirdPartyShip}: ${probeResponse.error ?? "no response"}`,
  );

  const pendingApproval = await waitFor(
    async () => getPendingApproval(botState, thirdPartyShip),
    20_000,
    2000,
    `pending approval for ${thirdPartyShip}`,
  ).catch(() => undefined);

  if (!pendingApproval) {
    throw new Error(
      `Failed to confirm DM access for ${thirdPartyShip}: ` +
        `${probeResponse.error ?? "probe did not succeed"}, and no pending approval was found.`,
    );
  }

  console.log(
    `[FIXTURES] Pending approval ${pendingApproval.id} found for ${thirdPartyShip}; approving...`,
  );
  const approvalResponse = await client.prompt("/allow", { timeoutMs: 45_000 });
  console.log(
    `[FIXTURES] Approval response: ${approvalResponse.text?.slice(0, 200)}`,
  );

  const confirmToken = `fixture-dm-confirm-${Date.now().toString(36)}`;
  const confirmResponse = await thirdPartyClient.prompt(
    `Hello again, this is a DM access confirmation. Reply with "${confirmToken}".`,
    { timeoutMs: 60_000 },
  );

  if (!confirmResponse.success) {
    throw new Error(
      `DM access approval did not complete for ${thirdPartyShip}: ` +
        `${confirmResponse.error ?? "no response after approval"}`,
    );
  }

  console.log(`[FIXTURES] ✓ ${thirdPartyShip} DM access established`);
}

async function getDmAllowlist(botState: StateClient): Promise<string[]> {
  const raw = await botState.scry<SettingsAllResponse>("settings", "/all");
  return raw?.all?.moltbot?.tlon?.dmAllowlist ?? [];
}

async function setDmAllowlist(botState: StateClient, ships: string[]): Promise<void> {
  await botState.poke({
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
  await sleep(3000);
}

async function ensureShipOnDmAllowlist(
  botState: StateClient,
  ship: string,
): Promise<void> {
  const currentList = await getDmAllowlist(botState);
  if (!currentList.includes(ship)) {
    await setDmAllowlist(botState, [...currentList, ship]);
  }
}

async function getPendingApproval(
  botState: StateClient,
  ship: string,
): Promise<PendingApproval | undefined> {
  const raw = await botState.scry<SettingsAllResponse>("settings", "/all");
  const serialized = raw?.all?.moltbot?.tlon?.pendingApprovals;
  if (!serialized) {
    return undefined;
  }

  const approvals = JSON.parse(serialized) as PendingApproval[];
  return approvals.find((approval) => approval.requestingShip === ship);
}

async function ensureShipUnblocked(botState: StateClient, ship: string): Promise<void> {
  const blocked = await botState.scry<string[]>("chat", "/blocked");
  if (Array.isArray(blocked) && blocked.includes(ship)) {
    await botState.poke({
      app: "chat",
      mark: "chat-unblock-ship",
      json: { ship },
    });
    await sleep(3000);
  }
}

async function hasPriorBotDm(
  thirdPartyState: StateClient,
  botShip: string,
): Promise<boolean> {
  try {
    const posts = await thirdPartyState.channelPosts(botShip, 10);
    return (posts ?? []).some((post) => {
      const p = post as { authorId?: string; sentAt?: number };
      return p.authorId === botShip && typeof p.sentAt === "number";
    });
  } catch {
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
