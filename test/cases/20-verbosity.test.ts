/**
 * Verbosity Measurement Harness
 *
 * State-driven: sends prompts via fire-and-forget DM, then polls the test
 * user's ship state for the bot's delivered reply. Each test snapshots a
 * fresh DM baseline immediately before sending, matching the pattern used
 * by 09-media, 10-outbound-messages, and 11-image-search.
 *
 * Each prompt includes a unique token (it-verbosity-...) that the bot must
 * echo. The poll matches on both sentAt > baseline AND token presence,
 * preventing delayed replies from prior tests from being scored.
 *
 * Emits NDJSON lines for before/after comparison. No hard assertions on
 * verbosity — soft warnings only.
 *
 * Usage:
 *   pnpm test:integration test/cases/20-verbosity.test.ts 2>&1 | tee verbosity-test-run-1.txt
 *
 * Extract metrics:
 *   grep '^{' verbosity-test-run-1.txt
 */

import { describe, test, beforeAll } from "vitest";
import { getTextContent } from "@tloncorp/api";
import { getFixtures, waitFor, type TestFixtures } from "../lib/index.js";
import { scoreResponse } from "../lib/verbosity.js";

// Each prompt explicitly asks the bot to "Reply with..." so the agent emits a
// visible DM that state-driven capture can find. Prompts are non-tool-driving
// (no factual lookups, no Tlon operations, no web searches) but open-ended
// enough that a verbose model will pad the response with filler/narration.
//
// The token instruction is appended at runtime — see buildPrompt().
const PROMPTS = [
  { id: "casual-greeting", text: "Reply with a short casual greeting." },
  { id: "casual-opinion", text: "Reply in one or two sentences: do you like pineapple on pizza?" },
  { id: "short-answer", text: "Reply with the answer: what is 2+2?" },
  { id: "preference", text: "Reply saying whether you prefer cats or dogs and why." },
  { id: "creative-short", text: "Reply with a one-sentence joke." },
  { id: "advice", text: "Reply with your advice: should someone learn TypeScript or JavaScript first?" },
  { id: "self-describe", text: "Reply with exactly three words that describe yourself." },
];

/** Regex to strip the token from captured text before scoring. */
const TOKEN_RE = /\s*it-verbosity-[a-z0-9]+\s*/g;

/** Snapshot the highest sentAt among bot-authored DMs visible to the test user. */
async function snapshotBaseline(fixtures: TestFixtures): Promise<number> {
  try {
    const posts = await fixtures.userState.channelPosts(fixtures.botShip, 30);
    return (posts ?? [])
      .map((post: any) => {
        return post.authorId === fixtures.botShip && typeof post.sentAt === "number"
          ? post.sentAt
          : 0;
      })
      .reduce((max: number, ts: number) => (ts > max ? ts : max), 0);
  } catch {
    return 0;
  }
}

describe("verbosity baseline", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  for (const prompt of PROMPTS) {
    test(
      `[${prompt.id}] measure response`,
      { timeout: 120_000 },
      async () => {
        const token = `it-verbosity-${Date.now().toString(36)}`;

        // Per-test baseline: snapshot immediately before sending
        const baselineSentAt = await snapshotBaseline(fixtures);
        const textToSend = `${prompt.text}\n\n(Include "${token}" somewhere in your reply.)`;
        console.log(`[VERBOSITY] baseline=${baselineSentAt} token=${token} sending: "${prompt.text}"`);

        await fixtures.client.sendDm(textToSend);

        // Poll for the bot's reply DM matching both baseline and token
        const reply = await waitFor(
          async () => {
            const posts = await fixtures.userState.channelPosts(fixtures.botShip, 30);
            for (const post of posts ?? []) {
              const p = post as {
                authorId?: string;
                sentAt?: number;
                textContent?: string | null;
                content?: unknown;
              };
              if (p.authorId !== fixtures.botShip) continue;
              if (typeof p.sentAt !== "number" || p.sentAt <= baselineSentAt) continue;
              const text = (p.textContent ?? getTextContent(p.content) ?? "").trim();
              if (text.length === 0) continue;
              if (!text.includes(token)) continue;
              return { text, sentAt: p.sentAt };
            }
            return undefined;
          },
          90_000,
          2000,
          `bot DM reply for [${prompt.id}] with token ${token}`,
        );

        // Strip the token before scoring so it doesn't affect metrics
        const scoredText = reply.text.replace(TOKEN_RE, " ").trim();
        const metrics = scoreResponse(scoredText);

        // Emit NDJSON line for report — scored text is clean, raw preserved for debug
        console.log(
          JSON.stringify({
            promptId: prompt.id,
            prompt: prompt.text,
            responseText: scoredText,
            rawText: reply.text,
            ...metrics,
          }),
        );

        // Soft warnings — flag anti-patterns but don't fail the test
        if (metrics.fillerHits > 0) {
          console.warn(
            `[VERBOSE] ${prompt.id}: ${metrics.fillerHits} filler phrase(s): ${metrics.fillerMatches.join(", ")}`,
          );
        }
        if (metrics.hedgingHits > 0) {
          console.warn(
            `[VERBOSE] ${prompt.id}: ${metrics.hedgingHits} hedging phrase(s): ${metrics.hedgingMatches.join(", ")}`,
          );
        }
        if (metrics.narrationHits > 0) {
          console.warn(
            `[VERBOSE] ${prompt.id}: ${metrics.narrationHits} narration phrase(s): ${metrics.narrationMatches.join(", ")}`,
          );
        }
      },
    );
  }
});
