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

interface PluginSettingsAll {
  all?: Record<
    string,
    Record<
      string,
      {
        dmAllowlist?: string[];
        pendingApprovals?: string | PendingApprovalRecord[];
      }
    >
  >;
}

interface PendingApprovalRecord {
  id: string;
  requestingShip: string;
  notificationMessageId?: string;
}

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

  const getPluginSettings = async (): Promise<PluginSettingsAll> =>
    botState.scry<PluginSettingsAll>("settings", "/all");

  const putPluginEntry = async (entryKey: string, value: unknown) => {
    await botState.poke({
      app: "settings",
      mark: "settings-event",
      json: {
        "put-entry": {
          desk: "moltbot",
          "bucket-key": "tlon",
          "entry-key": entryKey,
          value,
        },
      },
    });
  };

  const getDmAllowlist = async (): Promise<string[]> => {
    const settings = await getPluginSettings();
    return settings.all?.moltbot?.tlon?.dmAllowlist ?? [];
  };

  const setDmAllowlist = async (ships: string[]) => {
    await putPluginEntry("dmAllowlist", ships);
  };

  const getPendingApprovals = async (): Promise<PendingApprovalRecord[]> => {
    const settings = await getPluginSettings();
    const raw = settings.all?.moltbot?.tlon?.pendingApprovals;
    if (!raw) {
      return [];
    }
    if (Array.isArray(raw)) {
      return raw.filter(
        (item): item is PendingApprovalRecord =>
          typeof item?.id === "string" && typeof item?.requestingShip === "string",
      );
    }
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(
        (item): item is PendingApprovalRecord =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as PendingApprovalRecord).id === "string" &&
          typeof (item as PendingApprovalRecord).requestingShip === "string",
      );
    } catch {
      return [];
    }
  };

  const getBlockedShips = async (): Promise<string[]> => {
    const blocked = await botState.scry<string[]>("chat", "/blocked");
    return Array.isArray(blocked) ? blocked : [];
  };

  const clearPendingApprovals = async () => {
    await putPluginEntry("pendingApprovals", "[]");
  };

  const ensureShipUnblocked = async (ship: string) => {
    const normalizedShip = ship.startsWith("~") ? ship : `~${ship}`;
    const blockedBefore = (await getBlockedShips()).map((item) =>
      item.startsWith("~") ? item : `~${item}`,
    );
    if (!blockedBefore.includes(normalizedShip)) {
      return;
    }

    console.log(`[FIXTURES] Unblocking lingering blocked ship ${normalizedShip}...`);
    await botState.poke({
      app: "chat",
      mark: "chat-unblock-ship",
      json: { ship: normalizedShip },
    });
    await waitFor(async () => {
      const blockedAfter = (await getBlockedShips()).map((item) =>
        item.startsWith("~") ? item : `~${item}`,
      );
      return blockedAfter.includes(normalizedShip) ? undefined : true;
    }, 30_000, 2000, `${normalizedShip} to be unblocked`);
  };

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

  for (let attempt = 1; attempt <= 3 && !group; attempt += 1) {
    try {
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
        break;
      }

      const suffix = Date.now().toString(36);
      const groupTitle = `OpenClaw Test Fixtures ${suffix}`;
      const { groupId, chatChannel } = await botState.createGroup(groupTitle);
      await waitFor(async () => {
        const created = await botState.group(groupId);
        return created ? true : undefined;
      }, 15_000, 1500, `group ${groupId} to appear`);
      group = {
        id: groupId,
        title: groupTitle,
        chatChannel,
      };
      console.log(`[FIXTURES] ✓ Created group: ${groupId}`);
    } catch (err) {
      console.log(`[FIXTURES] Group setup attempt ${attempt}/3 failed: ${String(err)}`);
      if (attempt < 3) {
        await sleep(3000);
      }
    }
  }
  if (!group) {
    console.log("[FIXTURES] Warning: Failed to create group after 3 attempts");
  }

  // 3. Ensure DM channel exists by sending a message
  console.log("[FIXTURES] Ensuring DM channel exists...");
  try {
    // The test client sends via DM, so just sending any prompt establishes the channel
    const dmSetup = await client.prompt("Hello, this is a test setup message.", { timeoutMs: 60_000 });
    if (!dmSetup.success) {
      throw new Error(dmSetup.error ?? "DM setup prompt did not receive a usable reply");
    }
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

    console.log(`[FIXTURES] Restoring DM baseline for ${thirdPartyShip}...`);
    try {
      const staleApprovals = await getPendingApprovals();
      if (staleApprovals.length > 0) {
        console.log(`[FIXTURES] Clearing ${staleApprovals.length} stale pending approval(s)`);
        await clearPendingApprovals();
        await sleep(2000);
      }

      await ensureShipUnblocked(thirdPartyShip);

      const currentAllowlist = await getDmAllowlist();
      if (currentAllowlist.includes(thirdPartyShip)) {
        console.log(`[FIXTURES] ✓ ${thirdPartyShip} already has DM access`);
      } else {
        await setDmAllowlist([...currentAllowlist, thirdPartyShip]);
        await waitFor(async () => {
          const allowlist = await getDmAllowlist();
          return allowlist.includes(thirdPartyShip) ? true : undefined;
        }, 30_000, 2000, `${thirdPartyShip} to appear in dmAllowlist`);
        await sleep(2000);
        console.log(`[FIXTURES] ✓ ${thirdPartyShip} DM access restored in baseline`);
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
