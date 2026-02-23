/**
 * Heartbeat Engagement Recovery Tests
 *
 * Tests that the heartbeat system sends re-engagement nudges
 * when the owner hasn't messaged in a while.
 *
 * Requires heartbeat interval set to "1m" in test config.
 */

import { getTextContent, type PostContent } from "@tloncorp/api";
import { describe, test, expect, beforeAll } from "vitest";
import { createStateClient, getTestConfig, waitFor, type StateClient } from "../lib/index.js";

const EIGHT_DAYS_MS = 8 * 24 * 60 * 60 * 1000;

/** Stage 1 template snippet (first line) */
const STAGE_1_MARKER = "Quick ideas for your week";

describe("heartbeat engagement recovery", () => {
  let botState: StateClient;
  let ownerState: StateClient;
  let botShip: string;

  beforeAll(async () => {
    const config = getTestConfig();
    botState = createStateClient(config.bot);
    // Owner is the test user in ephemeral test env (~ten)
    ownerState = createStateClient(config.testUser);
    botShip = config.bot.shipName.startsWith("~") ? config.bot.shipName : `~${config.bot.shipName}`;
  });

  test("sends stage 1 nudge when owner idle > 7 days", async () => {
    // Snapshot existing DMs so we only check for new messages
    let baselineTimestamp = 0;
    try {
      const existingPosts = await ownerState.channelPosts(botShip, 30);
      baselineTimestamp = (existingPosts ?? [])
        .map((post) => {
          const p = post as { authorId?: string; sentAt?: number };
          return p.authorId === botShip && typeof p.sentAt === "number" ? p.sentAt : 0;
        })
        .reduce((max, ts) => (ts > max ? ts : max), 0);
    } catch {
      // No existing DMs, that's fine
    }

    // Seed lastOwnerMessageAt to 8 days ago
    const eightDaysAgo = Date.now() - EIGHT_DAYS_MS;
    await botState.poke({
      app: "settings",
      mark: "settings-event",
      json: {
        "put-entry": {
          desk: "moltbot",
          "bucket-key": "tlon",
          "entry-key": "lastOwnerMessageAt",
          value: eightDaysAgo,
        },
      },
    });

    // Clear any previous nudge stage so the heartbeat doesn't skip
    await botState.poke({
      app: "settings",
      mark: "settings-event",
      json: {
        "del-entry": {
          desk: "moltbot",
          "bucket-key": "tlon",
          "entry-key": "lastNudgeStage",
        },
      },
    });

    console.log(`Seeded lastOwnerMessageAt to ${eightDaysAgo} (8 days ago)`);
    console.log(`Waiting for heartbeat cycle to send stage 1 nudge...`);

    // Wait for the heartbeat to fire and send the stage 1 message.
    // With "every": "1m", this should happen within ~90 seconds.
    const nudgePost = await waitFor(
      async () => {
        const posts = await ownerState.channelPosts(botShip, 30);
        const newBotPosts = (posts ?? [])
          .map((post) => {
            const p = post as {
              authorId?: string;
              sentAt?: number;
              textContent?: string | null;
              content?: PostContent;
            };
            const text = p.textContent ?? (p.content ? getTextContent(p.content) : null);
            return {
              authorId: p.authorId,
              sentAt: p.sentAt ?? 0,
              text: (text ?? "").trim(),
            };
          })
          .filter((p) => p.authorId === botShip)
          .filter((p) => p.sentAt > baselineTimestamp)
          .filter((p) => p.text.includes(STAGE_1_MARKER));

        return newBotPosts.length > 0 ? newBotPosts[0] : null;
      },
      180_000, // 3 minutes max (heartbeat fires every 1m)
      5_000, // poll every 5s
    );

    expect(nudgePost).not.toBeNull();
    console.log(`Got heartbeat nudge: ${nudgePost!.text.slice(0, 80)}...`);
    expect(nudgePost!.text).toContain(STAGE_1_MARKER);
  }, 200_000);
});
