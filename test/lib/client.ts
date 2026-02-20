/**
 * Test Client
 *
 * Dual-mode client for testing the bot:
 * - Direct mode: POST to OpenClaw gateway API (tests agent logic)
 * - Tlon mode: Send actual DM to bot (tests full plugin/skill stack)
 */

import { Urbit, getTextContent } from "@tloncorp/api";
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
  // Test user state client is used to poll DM posts for bot responses.
  const testUserState = createStateClient(config.testUser);

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
        const botShipNorm = bot.shipName.startsWith("~") ? bot.shipName : `~${bot.shipName}`;
        // Snapshot latest bot DM timestamp before sending, so we only accept truly new replies.
        let baselineBotSentAt = 0;
        try {
          const beforePosts = await testUserState.channelPosts(botShipNorm, 30);
          baselineBotSentAt = (beforePosts ?? [])
            .map((post) => {
              const p = post as { authorId?: string; sentAt?: number };
              return p.authorId === botShipNorm && typeof p.sentAt === "number" ? p.sentAt : 0;
            })
            .reduce((max, ts) => (ts > max ? ts : max), 0);
        } catch (err) {
          console.log(`DM baseline poll failed: ${err}`);
        }

        // Use the plugin's sendDm function for correct formatting.
        // Retry transient channel failures so tests don't fail fast and cascade prompts.
        let sent = false;
        let lastSendError = "";
        for (let attempt = 1; attempt <= 3; attempt += 1) {
          try {
            await ensureConnected();
            await sendDm({
              api,
              fromShip: testUser.shipName,
              toShip: bot.shipName,
              text,
            });
            sent = true;
            break;
          } catch (err) {
            lastSendError = String(err);
            console.log(`Send DM attempt ${attempt}/3 failed: ${lastSendError}`);
            connected = false;
            if (attempt < 3) {
              await sleep(1000);
            }
          }
        }
        if (!sent) {
          return {
            success: false,
            error: `Failed to send DM after 3 attempts: ${lastSendError}`,
          };
        }

        // Poll for response using the activity feed
        const startTime = Date.now();
        let lastPollError = "";
        let attempts = 0;

        while (Date.now() - startTime < timeoutMs) {
          attempts += 1;
          await sleep(2000);

          try {
            // Poll DM channel directly to avoid activity timestamp parsing edge cases.
            const dmPosts = await testUserState.channelPosts(botShipNorm, 30);
            const botDmPosts = (dmPosts ?? [])
              .map((post) => {
                const p = post as {
                  authorId?: string;
                  sentAt?: number;
                  textContent?: string | null;
                  content?: unknown;
                };
                const textContent = p.textContent ?? getTextContent(p.content);
                return {
                  authorId: p.authorId,
                  sentAt: p.sentAt,
                  text: (textContent ?? "").trim(),
                };
              })
              .filter((post) => post.authorId === botShipNorm)
              .filter((post) => typeof post.sentAt === "number" && post.sentAt > baselineBotSentAt)
              .filter((post) => post.text.length > 0);

            if (botDmPosts.length > 0) {
              const latest = botDmPosts.sort((a, b) => (b.sentAt ?? 0) - (a.sentAt ?? 0))[0];
              return {
                success: true,
                text: latest.text,
              };
            }
          } catch (err) {
            // Poll failed, continue retrying until timeout.
            lastPollError = String(err);
            console.log(`DM poll failed: ${err}`);
          }
        }

        return {
          success: false,
          error:
            `Timeout waiting for bot response after ${timeoutMs}ms ` +
            `(attempts=${attempts}, baselineBotSentAt=${baselineBotSentAt})` +
            (lastPollError ? `, lastPollError=${lastPollError}` : ""),
        };
      } catch (err) {
        console.log(`Failed to send DM: ${err}`);
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
