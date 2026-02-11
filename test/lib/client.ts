/**
 * Test Client
 *
 * Dual-mode client for testing the bot:
 * - Direct mode: POST to OpenClaw gateway API (tests agent logic)
 * - Tlon mode: Send actual DM to bot (tests full plugin/skill stack)
 */

import { Urbit } from "@tloncorp/api";
import { sendDm, type TlonPokeApi } from "../../src/urbit/send.js";
import { createStateClient, type StateClient, type StateClientConfig } from "./state.js";

/** Ship connection credentials */
export interface ShipCredentials {
  shipUrl: string;
  shipName: string;
  code: string;
}

export interface AgentResponse {
  /** The agent's text response, if any */
  text?: string;
  /** Whether the agent completed successfully */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

export interface TestClient {
  /** Send a prompt to the agent and wait for response */
  prompt(text: string, opts?: { timeoutMs?: number }): Promise<AgentResponse>;
  /** Ship state client for assertions (checks BOT state) */
  state: StateClient;
}

// =============================================================================
// Direct Mode - OpenClaw Gateway API
// =============================================================================

export interface DirectClientConfig {
  /** Test user credentials (for sending prompts) */
  testUser: ShipCredentials;
  /** Bot credentials (for checking state) */
  bot: ShipCredentials;
  /** Gateway URL */
  gatewayUrl: string;
  sessionKey?: string;
  gatewayToken?: string;
}

/**
 * Create a direct client that prompts via OpenClaw gateway API.
 *
 * NOTE: The gateway uses WebSocket + JSON-RPC, not REST.
 * This mode is not yet implemented - use tlon mode instead.
 */
export function createDirectClient(config: DirectClientConfig): TestClient {
  // State client uses BOT credentials to check bot's state
  const state = createStateClient(config.bot);

  throw new Error(
    "Direct mode not yet implemented. The gateway uses WebSocket + JSON-RPC. " +
    "Use TEST_MODE=tlon to test through actual Tlon DMs instead."
  );
}

// =============================================================================
// Tlon Mode - Actual DMs
// =============================================================================

export interface TlonClientConfig {
  /** Test user credentials (for sending prompts via DM) */
  testUser: ShipCredentials;
  /** Bot credentials (for checking state after processing) */
  bot: ShipCredentials;
}

/**
 * Create a Tlon client that prompts via actual DMs.
 *
 * This tests the full plugin/skill stack:
 * - Test user sends DM to bot
 * - Bot processes and may change its own state
 * - We check bot's state to verify the action worked
 */
export function createTlonClient(config: TlonClientConfig): TestClient {
  // State client uses BOT credentials to check bot's state
  const state = createStateClient(config.bot);

  const { testUser, bot } = config;

  // Create Urbit client for test user to send DMs
  const testUserShipClean = testUser.shipName.replace(/^~/, "");
  const urbit = new Urbit(testUser.shipUrl, testUser.code);
  urbit.ship = testUserShipClean;

  let connected = false;

  const ensureConnected = async () => {
    if (!connected) {
      await urbit.connect();
      connected = true;
    }
  };

  // Create poke API wrapper for sendDm
  const api: TlonPokeApi = {
    poke: (params) => urbit.poke(params),
  };

  return {
    async prompt(text, opts = {}) {
      const timeoutMs = opts.timeoutMs ?? 60_000;

      try {
        await ensureConnected();

        // Use the plugin's sendDm function for correct formatting
        await sendDm({
          api,
          fromShip: testUser.shipName,
          toShip: bot.shipName,
          text,
        });

        // Poll for response using the activity feed
        const startTime = Date.now();
        const botShipNorm = bot.shipName.startsWith("~") ? bot.shipName : `~${bot.shipName}`;

        // Record the send time to filter for new messages
        const sentAt = Date.now();

        while (Date.now() - startTime < timeoutMs) {
          await sleep(2000);

          try {
            // Use activity feed to find DM responses
            const activity = await urbit.scry<Record<string, ActivityEntry>>({
              app: "activity",
              path: "/v4/all",
            });

            // Look for dm-post entries from the bot
            const botDmPosts = Object.values(activity)
              .filter((entry): entry is ActivityEntry & { "dm-post": DmPost } => {
                if (!entry["dm-post"]) return false;
                const dmPost = entry["dm-post"];
                // Check if from the bot ship
                return dmPost.whom?.ship === botShipNorm;
              })
              .map((entry) => ({
                content: extractActivityContent(entry["dm-post"].content),
                // Time is the activity timestamp key, but we can use key.time
                timestamp: parseUdTime(entry["dm-post"].key?.time),
              }))
              .filter((m) => m.content && m.timestamp > sentAt - 5000);

            if (botDmPosts.length > 0) {
              // Get the most recent
              const latest = botDmPosts.sort((a, b) => b.timestamp - a.timestamp)[0];
              return {
                success: true,
                text: latest.content,
              };
            }
          } catch (err) {
            // Scry failed, continue polling
            console.log(`Activity scry failed: ${err}`);
          }
        }

        return {
          success: false,
          error: `Timeout waiting for bot response after ${timeoutMs}ms`,
        };
      } catch (err) {
        return {
          success: false,
          error: `Failed to send DM: ${err}`,
        };
      }
    },
    state,
  };
}

// =============================================================================
// Factory
// =============================================================================

export type TestMode = "direct" | "tlon";

export interface TestClientConfig {
  mode: TestMode;
  /** Test user credentials (for sending prompts) */
  testUser: ShipCredentials;
  /** Bot credentials (for checking state) */
  bot: ShipCredentials;
  /** Direct mode options */
  gatewayUrl?: string;
  sessionKey?: string;
  gatewayToken?: string;
}

/**
 * Create a test client based on configuration.
 */
export function createTestClient(config: TestClientConfig): TestClient {
  if (config.mode === "direct") {
    if (!config.gatewayUrl) {
      throw new Error("gatewayUrl is required for direct mode");
    }
    return createDirectClient({
      testUser: config.testUser,
      bot: config.bot,
      gatewayUrl: config.gatewayUrl,
      sessionKey: config.sessionKey,
      gatewayToken: config.gatewayToken,
    });
  } else {
    return createTlonClient({
      testUser: config.testUser,
      bot: config.bot,
    });
  }
}

// =============================================================================
// Helpers
// =============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Activity feed types
interface DmPost {
  key?: { id?: string; time?: string };
  whom?: { ship?: string };
  content?: unknown[];
}

interface ActivityEntry {
  notified?: boolean;
  "dm-post"?: DmPost;
}

function parseUdTime(udTime: string | undefined): number {
  if (!udTime) return 0;
  // @ud time format: "170.141.184.507.818.380.655.398.580.886.458.859.520"
  // Remove dots and parse as BigInt, convert to ms
  try {
    const clean = udTime.replace(/\./g, "");
    // Urbit time is in ~2000.1.1 epoch, roughly
    // The timestamp is in 2^-64 second units from Unix epoch
    // For our purposes, we just need relative ordering
    return Number(BigInt(clean) / BigInt(1e12)); // Rough conversion to ms-ish scale
  } catch {
    return 0;
  }
}

function extractActivityContent(content: unknown[] | undefined): string {
  if (!content || !Array.isArray(content)) return "";
  
  return content
    .map((block) => {
      if (typeof block === "string") return block;
      if (typeof block === "object" && block !== null) {
        const b = block as { inline?: unknown[]; text?: string };
        if (b.text) return b.text;
        if (Array.isArray(b.inline)) {
          return b.inline
            .map((i) => (typeof i === "string" ? i : ""))
            .join("");
        }
      }
      return "";
    })
    .join(" ")
    .trim();
}

interface ParsedWrit {
  author: string;
  content: string;
  timestamp: number;
}

function parseWrits(data: unknown): ParsedWrit[] {
  if (!data) return [];
  
  // Handle various response formats
  let writs: unknown[] = [];
  
  if (Array.isArray(data)) {
    writs = data;
  } else if (typeof data === "object" && data !== null) {
    const d = data as Record<string, unknown>;
    if (d.writs && Array.isArray(d.writs)) {
      writs = d.writs;
    } else if (d.posts && typeof d.posts === "object") {
      writs = Object.values(d.posts as Record<string, unknown>);
    } else {
      writs = Object.values(d);
    }
  }

  return writs
    .map((item) => {
      const w = item as Record<string, unknown>;
      const memo = (w.memo ?? w) as Record<string, unknown>;
      const seal = w.seal as Record<string, unknown> | undefined;
      
      return {
        author: String(memo?.author ?? "unknown"),
        content: extractPostText(memo?.content) ?? "",
        timestamp: Number(memo?.sent ?? seal?.time ?? 0),
      };
    })
    .filter((m) => m.content);
}

function extractPostText(post: unknown): string | undefined {
  // Post content structure varies - handle both memo and content formats
  try {
    const p = post as { memo?: { content?: unknown }; content?: unknown };
    const content = p.memo?.content ?? p.content;

    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .map((block: unknown) => {
          if (typeof block === "string") return block;
          if (typeof block === "object" && block !== null) {
            const b = block as { text?: string; inline?: unknown[] };
            if (b.text) return b.text;
            if (Array.isArray(b.inline)) {
              return b.inline
                .map((i) => (typeof i === "string" ? i : ""))
                .join("");
            }
          }
          return "";
        })
        .join("\n");
    }
  } catch {
    // Ignore extraction errors
  }
  return undefined;
}
