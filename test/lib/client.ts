/**
 * Test Client
 *
 * Dual-mode client for testing the bot:
 * - Direct mode: POST to OpenClaw gateway API (tests agent logic)
 * - Tlon mode: Send actual DM to bot (tests full plugin/skill stack)
 */

import crypto from "node:crypto";
import { Urbit, getTextContent } from "@tloncorp/api";
import { scot, da } from "@urbit/aura";
import { createStateClient, type StateClient, type StateClientConfig } from "./state.js";
import { markdownToStory, type Story } from "../../src/urbit/story.js";

/** Matches the correlation tag format injected by prompt(). */
const CORRELATION_TAG_RE = /\[ref-[a-f0-9]{8}\]/;

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
  prompt(text: string, opts?: { timeoutMs?: number; correlate?: boolean }): Promise<AgentResponse>;
  /** Send a DM without waiting for a bot response */
  sendDm(text: string): Promise<void>;
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
  const testUserShipNorm = testUser.shipName.startsWith("~") ? testUser.shipName : `~${testUser.shipName}`;
  const urbit = new Urbit(testUser.shipUrl, testUser.code);
  urbit.ship = testUserShipClean;

  let connected = false;

  const ensureConnected = async () => {
    if (!connected) {
      await urbit.connect();
      connected = true;
    }
  };

  /**
   * Send a DM using direct poke to chat app.
   * Can't use the plugin's sendDm because it uses @tloncorp/api global client
   * which is configured for the bot, not the test user.
   */
  const sendTestUserDm = async (toShip: string, message: string) => {
    await ensureConnected();
    const story: Story = markdownToStory(message);
    const targetShip = toShip.startsWith("~") ? toShip : `~${toShip}`;
    const sentAt = Date.now();
    const idUd = scot("ud", da.fromUnix(sentAt));
    const id = `${testUserShipNorm}/${idUd}`;

    const delta = {
      add: {
        memo: {
          content: story,
          author: testUserShipNorm,
          sent: sentAt,
        },
        kind: null,
        time: null,
      },
    };

    const action = {
      ship: targetShip,
      diff: { id, delta },
    };

    await urbit.poke({
      app: "chat",
      mark: "chat-dm-action",
      json: action,
    });
  };

  const sendDmWithRetry = async (text: string): Promise<void> => {
    let lastSendError = "";
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        await sendTestUserDm(bot.shipName, text);
        return;
      } catch (err) {
        lastSendError = String(err);
        console.log(`Send DM attempt ${attempt}/3 failed: ${lastSendError}`);
        connected = false;
        if (attempt < 3) {
          await sleep(1000);
        }
      }
    }

    throw new Error(`Failed to send DM after 3 attempts: ${lastSendError}`);
  };

  const bestEffortStopAfterTimeout = async (): Promise<void> => {
    try {
      console.log(`[timeout cleanup] sending /stop to ${bot.shipName}`);
      await sendDmWithRetry("/stop");
      await sleep(3000);
      console.log(`[timeout cleanup] /stop sent; gave it 3s to drain`);
    } catch (err) {
      console.log(`[timeout cleanup] failed to send /stop: ${err}`);
    }
  };

  return {
    async sendDm(text) {
      await sendDmWithRetry(text);
    },
    async prompt(text, opts = {}) {
      const timeoutMs = opts.timeoutMs ?? 90_000;

      console.log(`\n[TEST] Sending prompt: ${JSON.stringify(text)}`);

      try {
        const botShipNorm = bot.shipName.startsWith("~") ? bot.shipName : `~${bot.shipName}`;

        // Determine correlation mode:
        //   slash commands  → no token, sequence baseline
        //   correlate:false → no token, sequence baseline, skip tagged posts
        //   default         → inject token, match by token
        const isSlash = text.trimStart().startsWith("/");
        const useToken = !isSlash && opts.correlate !== false;

        let tag: string | null = null;
        let textToSend = text;
        if (useToken) {
          const token = crypto.randomUUID().slice(0, 8);
          tag = `[ref-${token}]`;
          textToSend = `${text}\n\n(Include reference: ${tag} in your reply.)`;
        }

        let sendBaselineSequence = -1;
        if (!useToken) {
          try {
            const beforePosts = await testUserState.channelPosts(botShipNorm, 30);
            sendBaselineSequence = (beforePosts ?? [])
              .map((post) => {
                const p = post as { authorId?: string; sequenceNum?: number | null };
                return p.authorId === botShipNorm && typeof p.sequenceNum === "number"
                  ? p.sequenceNum
                  : -1;
              })
              .reduce((max, seq) => Math.max(max, seq), -1);
          } catch (err) {
            console.log(`Failed to capture DM baseline sequence: ${err}`);
          }
        }

        const mode = useToken ? "correlated" : "sequence";

        // Send DM via direct poke (can't use plugin's sendDm since it uses global API client)
        // Retry transient channel failures so tests don't fail fast and cascade prompts.
        try {
          await sendDmWithRetry(textToSend);
        } catch (err) {
          const lastSendError = err instanceof Error ? err.message : String(err);
          console.log(`[TEST] Response success: false`);
          console.log(`[TEST] Response text: ${JSON.stringify(`Failed to send DM after 3 attempts: ${lastSendError}`.slice(0, 500))}`);
          return {
            success: false,
            error: `Failed to send DM after 3 attempts: ${lastSendError}`,
          };
        }

        // Poll for response
        const startTime = Date.now();
        let lastPollError = "";
        let attempts = 0;

        while (Date.now() - startTime < timeoutMs) {
          attempts += 1;
          await sleep(2000);

          try {
            const dmPosts = await testUserState.channelPosts(botShipNorm, 30);
            const allBotPosts = (dmPosts ?? [])
              .map((post) => {
                const p = post as {
                  authorId?: string;
                  sentAt?: number;
                  sequenceNum?: number | null;
                  textContent?: string | null;
                  content?: unknown;
                };
                const textContent = p.textContent ?? getTextContent(p.content);
                return {
                  authorId: p.authorId,
                  sentAt: p.sentAt,
                  sequenceNum: p.sequenceNum,
                  text: (textContent ?? "").trim(),
                };
              })
              .filter((post) => post.authorId === botShipNorm)
              .filter((post) => post.text.length > 0);

            if (useToken) {
              // Correlated path: accept only posts containing this prompt's tag.
              // No sentAt filter needed — the tag IS the correlation.
              const matched = allBotPosts.find((p) => p.text.includes(tag!));

              if (attempts === 1 || attempts % 5 === 0) {
                console.log(`[poll #${attempts}] mode=${mode} token=${tag} matched=${!!matched} botPosts=${allBotPosts.length}`);
                if (allBotPosts.length > 0) {
                  console.log(`[poll #${attempts}] last 3 bot posts: ${JSON.stringify(allBotPosts.slice(-3).map((p) => ({ sentAt: p.sentAt, text: p.text.slice(0, 40) })))}`);
                }
              }

              if (matched) {
                const cleanText = matched.text.replace(CORRELATION_TAG_RE, "").trim();
                console.log(`[TEST] Response success: true`);
                console.log(`[TEST] Response text: ${JSON.stringify(cleanText.slice(0, 500))}`);
                return { success: true, text: cleanText };
              }
            } else {
              // No-token path (slash commands and correlate:false):
              // Accept posts with a newer sequence number than the snapshot we took
              // before sending, but skip any post bearing a correlation tag — those
              // belong to a correlated prompt.
              const candidates = allBotPosts
                .filter((p) => typeof p.sequenceNum === "number" && p.sequenceNum > sendBaselineSequence)
                .filter((p) => !CORRELATION_TAG_RE.test(p.text));
              const skippedTagged = allBotPosts
                .filter((p) => typeof p.sequenceNum === "number" && p.sequenceNum > sendBaselineSequence)
                .filter((p) => CORRELATION_TAG_RE.test(p.text)).length;

              if (attempts === 1 || attempts % 5 === 0) {
                console.log(`[poll #${attempts}] mode=${mode} baselineSequence=${sendBaselineSequence} candidates=${candidates.length} skippedTagged=${skippedTagged} botPosts=${allBotPosts.length}`);
                if (allBotPosts.length > 0) {
                  console.log(`[poll #${attempts}] last 3 bot posts: ${JSON.stringify(allBotPosts.slice(-3).map((p) => ({ sequenceNum: p.sequenceNum, sentAt: p.sentAt, text: p.text.slice(0, 40) })))}`);
                }
              }

              if (candidates.length > 0) {
                const latest = candidates.sort((a, b) => (b.sequenceNum ?? -1) - (a.sequenceNum ?? -1))[0];
                console.log(`[TEST] Response success: true`);
                console.log(`[TEST] Response text: ${JSON.stringify(latest.text.slice(0, 500))}`);
                return { success: true, text: latest.text };
              }
            }
          } catch (err) {
            lastPollError = String(err);
            console.log(`DM poll failed: ${err}`);
          }
        }

        await bestEffortStopAfterTimeout();
        const timeoutError =
          `Timeout waiting for bot response after ${timeoutMs}ms ` +
          `(mode=${mode}, attempts=${attempts}` +
          (tag ? `, token=${tag}` : `, baselineSequence=${sendBaselineSequence}`) +
          (lastPollError ? `, lastPollError=${lastPollError}` : "") +
          `; sent /stop for cleanup)`;
        console.log(`[TEST] Response success: false`);
        console.log(`[TEST] Response text: ${JSON.stringify(timeoutError.slice(0, 500))}`);
        return {
          success: false,
          error: timeoutError,
        };
      } catch (err) {
        console.log(`Failed to send DM: ${err}`);
        const fatalError = `Failed to send DM: ${err}`;
        console.log(`[TEST] Response success: false`);
        console.log(`[TEST] Response text: ${JSON.stringify(fatalError.slice(0, 500))}`);
        return {
          success: false,
          error: fatalError,
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
  /** Third-party ship credentials (non-owner, for security tests) */
  thirdParty?: ShipCredentials;
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
