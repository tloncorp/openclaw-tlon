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
import { getLatestSequenceForAuthor, getPostSequence } from "../lib/post-baseline.js";

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
    const baselineSequence = await getLatestSequenceForAuthor(ownerState, botShip, botShip, 30);

    // Seed settings for heartbeat: idle date and clear nudge stage.
    // ownerShip is migrated from file config to settings store on startup
    // (migrateConfigToSettings in monitor/index.ts), so we don't need to seed it.
    const eightDaysAgo = Date.now() - EIGHT_DAYS_MS;
    const eightDaysAgoDate = new Date(eightDaysAgo).toISOString().split("T")[0];

    await Promise.all([
      botState.poke({
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
      }),
      botState.poke({
        app: "settings",
        mark: "settings-event",
        json: {
          "put-entry": {
            desk: "moltbot",
            "bucket-key": "tlon",
            "entry-key": "lastOwnerMessageDate",
            value: eightDaysAgoDate,
          },
        },
      }),
      // Clear any previous nudge stage so the heartbeat doesn't skip
      botState.poke({
        app: "settings",
        mark: "settings-event",
        json: {
          "del-entry": {
            desk: "moltbot",
            "bucket-key": "tlon",
            "entry-key": "lastNudgeStage",
          },
        },
      }),
    ]);

    console.log(`Seeded lastOwnerMessageDate=${eightDaysAgoDate} (8 days ago)`);
    console.log(`Waiting for heartbeat cycle to send stage 1 nudge...`);

    // Wait for the heartbeat to fire and send the stage 1 message.
    // With "every": "1m", this should happen within ~90 seconds.
    let pollCount = 0;
    const nudgePost = await waitFor(
      async () => {
        pollCount++;
        const posts = await ownerState.channelPosts(botShip, 30);
        const allParsed = (posts ?? []).map((post) => {
          const p = post as {
            authorId?: string;
            sentAt?: number;
            sequenceNum?: number | null;
            textContent?: string | null;
            content?: PostContent;
          };
          const text = p.textContent ?? (p.content ? getTextContent(p.content) : null);
          return {
            authorId: p.authorId,
            sentAt: p.sentAt ?? 0,
            sequenceNum: getPostSequence(p),
            text: (text ?? "").trim(),
          };
        });

        const newBotPosts = allParsed
          .filter((p) => p.authorId === botShip)
          .filter((p) => p.sequenceNum > baselineSequence);

        // Log diagnostics every 6th poll (~30s)
        if (pollCount % 6 === 1) {
          console.log(
            `[poll ${pollCount}] total=${allParsed.length} newBot=${newBotPosts.length} baselineSequence=${baselineSequence}`,
          );
          for (const p of newBotPosts) {
            console.log(`  [new] sequence=${p.sequenceNum} sentAt=${p.sentAt} text=${JSON.stringify(p.text.slice(0, 120))}`);
          }
        }

        const match = newBotPosts.filter((p) => p.text.includes(STAGE_1_MARKER));
        return match.length > 0 ? match[0] : null;
      },
      300_000, // 5 minutes max (heartbeat fires every 1m but can be slow)
      5_000, // poll every 5s
    );

    expect(nudgePost).not.toBeNull();
    console.log(`Got heartbeat nudge: ${nudgePost!.text.slice(0, 80)}...`);
    expect(nudgePost!.text).toContain(STAGE_1_MARKER);
  }, 360_000);
});
