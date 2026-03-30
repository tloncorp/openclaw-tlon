import { describe, test, expect, beforeAll } from "vitest";
import {
  getFixtures,
  waitFor,
  getContainerLogsSince,
  toolWasInvoked,
  type TestFixtures,
} from "../lib/index.js";

// Poke mark verified against fakezod — see 09-media.test.ts.
const STORAGE_POKE_MARK = "storage-action";

const storageEnv = {
  endpoint: process.env.TEST_STORAGE_ENDPOINT,
  bucket: process.env.TEST_STORAGE_BUCKET,
  accessKey: process.env.TEST_STORAGE_ACCESS_KEY,
  secretKey: process.env.TEST_STORAGE_SECRET_KEY,
  region: process.env.TEST_STORAGE_REGION ?? "auto",
};

const hasBraveKey = Boolean(process.env.BRAVE_API_KEY);
const hasTlonbotToken = Boolean(process.env.TLONBOT_TOKEN);
const hasStorageEnv = Boolean(
  storageEnv.endpoint &&
    storageEnv.bucket &&
    storageEnv.accessKey &&
    storageEnv.secretKey,
);

const composeFile = process.env.TEST_COMPOSE_FILE;
const isTlonbotMounted = Boolean(process.env.TEST_TLONBOT_MOUNTED);
const isCI = Boolean(composeFile);

// CI path: missing env vars are a hard failure, not a skip.
// Throws at definition time — before describe/test registration.
if (isCI && !hasBraveKey) {
  throw new Error(
    "BRAVE_API_KEY is required for image_search integration test in CI. " +
      "Add it as a GitHub Actions secret.",
  );
}
// TLONBOT_TOKEN is only required when ../tlonbot is not mounted,
// because the entrypoint must fetch the plugin from GitHub.
if (isCI && !isTlonbotMounted && !hasTlonbotToken) {
  throw new Error(
    "TLONBOT_TOKEN is required for image_search integration test when " +
      "../tlonbot is not mounted. The compose harness fetches the image-search " +
      "plugin from GitHub. Add TLONBOT_TOKEN as a GitHub Actions secret, " +
      "or clone ../tlonbot locally.",
  );
}
if (isCI && !hasStorageEnv) {
  throw new Error(
    "TEST_STORAGE_* env vars are required for image_search integration test in CI. " +
      "Add TEST_STORAGE_ENDPOINT, TEST_STORAGE_BUCKET, TEST_STORAGE_ACCESS_KEY, " +
      "and TEST_STORAGE_SECRET_KEY as GitHub Actions secrets.",
  );
}

// Dev path: skip when env vars are absent (no throw).
const imageSearchTest = hasBraveKey && hasStorageEnv ? test : test.skip;

describe("image search", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  imageSearchTest(
    "finds an image via image_search and sends it with rewritten URL",
    async () => {
      // ── Seed S3 storage config on bot ship (idempotent) ──────────────
      const rawConfig = await fixtures.botState.scry<{
        "storage-update": {
          configuration: {
            buckets: string[];
            currentBucket: string;
            region: string;
          };
        };
      }>("storage", "/configuration");
      const config = rawConfig["storage-update"].configuration;

      const rawCreds = await fixtures.botState.scry<{
        "storage-update": {
          credentials: {
            endpoint: string;
            accessKeyId: string;
            secretAccessKey: string;
          };
        };
      }>("storage", "/credentials");
      const creds = rawCreds["storage-update"].credentials;

      const pokes: Record<string, unknown>[] = [];
      if (creds.endpoint !== storageEnv.endpoint) {
        pokes.push({ "set-endpoint": storageEnv.endpoint });
      }
      if (creds.accessKeyId !== storageEnv.accessKey) {
        pokes.push({ "set-access-key-id": storageEnv.accessKey });
      }
      if (creds.secretAccessKey !== storageEnv.secretKey) {
        pokes.push({ "set-secret-access-key": storageEnv.secretKey });
      }
      if (config.region !== storageEnv.region) {
        pokes.push({ "set-region": storageEnv.region });
      }
      if (!config.buckets.includes(storageEnv.bucket!)) {
        pokes.push({ "add-bucket": storageEnv.bucket });
      }
      if (config.currentBucket !== storageEnv.bucket) {
        pokes.push({ "set-current-bucket": storageEnv.bucket });
      }

      for (const json of pokes) {
        await fixtures.botState.poke({
          app: "storage",
          mark: STORAGE_POKE_MARK,
          json,
        });
      }
      if (pokes.length > 0) {
        console.log(
          `[TEST] Seeded ${pokes.length} storage config poke(s), waiting for propagation...`,
        );
        await waitFor(
          async () => {
            const cfg = (
              await fixtures.botState.scry<{
                "storage-update": {
                  configuration: { currentBucket: string; region: string };
                };
              }>("storage", "/configuration")
            )["storage-update"].configuration;

            const crd = (
              await fixtures.botState.scry<{
                "storage-update": {
                  credentials: {
                    endpoint: string;
                    accessKeyId: string;
                    secretAccessKey: string;
                  };
                };
              }>("storage", "/credentials")
            )["storage-update"].credentials;

            const ready =
              cfg.currentBucket === storageEnv.bucket &&
              cfg.region === storageEnv.region &&
              crd.endpoint === storageEnv.endpoint &&
              crd.accessKeyId === storageEnv.accessKey &&
              crd.secretAccessKey === storageEnv.secretKey;
            return ready ? true : undefined;
          },
          15_000,
          undefined,
          "storage config propagation",
        );
        console.log("[TEST] Storage config confirmed");
      }

      // ── Capture DM baseline before prompting ───────────────────────
      let baselineSentAt = 0;
      try {
        const beforePosts = await fixtures.userState.channelPosts(
          fixtures.botShip,
          30,
        );
        baselineSentAt = (beforePosts ?? [])
          .map((post) => {
            const p = post as { authorId?: string; sentAt?: number };
            return p.authorId === fixtures.botShip &&
              typeof p.sentAt === "number"
              ? p.sentAt
              : 0;
          })
          .reduce((max, ts) => (ts > max ? ts : max), 0);
      } catch (err) {
        console.log(`[TEST] DM baseline poll failed: ${err}`);
      }
      console.log(`[TEST] DM baseline sentAt: ${baselineSentAt}`);

      // ── Record timestamp for log correlation ───────────────────────
      const promptedAt = new Date().toISOString();

      // ── Prompt bot to search for an image and send it ──────────────
      const token = `it-imgsearch-${Date.now().toString(36)}`;
      const prompt =
        `Find an image of a golden retriever puppy and send it to me in this DM. ` +
        `Include the text "${token}" in your message.`;

      console.log(`\n[TEST] Sending prompt: "${prompt}"`);
      const response = await fixtures.client.prompt(prompt);
      console.log(`[TEST] Response success: ${response.success}`);
      console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

      if (!response.success) {
        throw new Error(response.error ?? "Prompt failed");
      }

      // ── Assert: bot sent an image in the DM with rewritten URL ─────
      console.log(`[TEST] Waiting for image DM with token "${token}"...`);
      const result = await waitFor(
        async () => {
          const posts = await fixtures.userState.channelPosts(
            fixtures.botShip,
            30,
          );
          for (const post of posts ?? []) {
            const p = post as {
              authorId?: string;
              sentAt?: number;
              textContent?: string | null;
              images?: Array<{ src?: string | null }>;
            };
            if (p.authorId !== fixtures.botShip) { continue; }
            if (typeof p.sentAt === "number" && p.sentAt <= baselineSentAt) {
              continue;
            }
            const text = (p.textContent ?? "").toLowerCase();
            if (!text.includes(token.toLowerCase())) { continue; }
            if (!p.images?.length || !p.images[0]?.src) { continue; }
            return { src: p.images[0].src };
          }
          return undefined;
        },
        60_000,
        2000,
        "image DM from bot via image_search",
      );

      console.log(`[TEST] Found image DM with src: ${result.src}`);

      // The image URL must be present
      expect(result.src).toBeDefined();

      // The URL must point to our test storage bucket (proves upload happened)
      expect(result.src).toContain(storageEnv.bucket);

      // ── Assert: image_search tool was actually invoked ─────────────
      if (composeFile) {
        // CI path (pnpm test:integration): mandatory assertion
        const logs = getContainerLogsSince(composeFile, promptedAt);
        console.log(
          `[TEST] Captured ${logs.length} chars of container logs since ${promptedAt}`,
        );
        expect(toolWasInvoked(logs, "image_search")).toBe(true);
      } else {
        // Dev path (test:integration:dev): warn only
        console.warn(
          "[TEST] Skipping image_search log proof (no TEST_COMPOSE_FILE). " +
            "Run pnpm test:integration for full verification.",
        );
      }
    },
  );
});
