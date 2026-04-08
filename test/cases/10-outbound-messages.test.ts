/**
 * Outbound DM Delivery Integration Test
 *
 * Verifies that the bot can deliver an outbound DM to a third-party ship
 * when the owner's prompt nudges toward the wrong tool path (`tlon dms send`).
 * The runtime guard in src/tlon-tool-guard.ts redirects to the built-in
 * `message` tool; this test proves the end-to-end delivery works regardless
 * of which path the agent takes.
 *
 * TEST ENVIRONMENT:
 *   ~zod = bot ship
 *   ~ten = test user (configured as ownerShip)
 *   ~mug = third-party ship (DM recipient)
 */
import { describe, test, expect, beforeAll } from "vitest";
import { getTextContent } from "@tloncorp/api";
import {
  getFixtures,
  waitFor,
  requireThirdParty,
  ensureThirdPartyDmAccess,
  type TestFixtures,
} from "../lib/index.js";
import { getLatestSequenceForAuthor, isPostNewerThanSequence } from "../lib/post-baseline.js";

describe("outbound DM delivery", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
    await ensureThirdPartyDmAccess(fixtures);
  });

  test("bot delivers DM to third-party ship without tlon tool", async () => {
    requireThirdParty(fixtures);

    // Baseline: snapshot latest bot DM sequence in ~mug's channel
    // to avoid false positives from fixture-setup messages.
    const baselineSequence = await getLatestSequenceForAuthor(
      fixtures.thirdPartyState!,
      fixtures.botShip,
      fixtures.botShip,
      30,
    );
    console.log(`[TEST] DM baseline sequence: ${baselineSequence}`);

    const token = `it-outbound-${Date.now().toString(36)}`;
    const prompt = `Use the tlon tool to send ${fixtures.thirdPartyShip} this DM: ${token}`;

    console.log(`\n[TEST] Sending DM: "${prompt}"`);
    await fixtures.client.sendDm(prompt);

    // Verify: message with token arrived at ~mug's DM channel from the bot
    console.log(
      `[TEST] Polling ${fixtures.thirdPartyShip} DMs for token "${token}"...`,
    );
    const delivered = await waitFor(
      async () => {
        const posts = await fixtures.thirdPartyState!.channelPosts(
          fixtures.botShip,
          30,
        );
        const found = (posts ?? []).some((post: any) => {
          const text = (
            post.textContent ??
            getTextContent(post.content) ??
            ""
          ).toLowerCase();
          return (
            post.authorId === fixtures.botShip &&
            isPostNewerThanSequence(post, baselineSequence) &&
            text.includes(token.toLowerCase())
          );
        });
        return found ? true : undefined;
      },
      45_000,
      2000,
      "outbound DM with token to arrive at third-party ship",
    );

    expect(delivered).toBe(true);
  });
});
