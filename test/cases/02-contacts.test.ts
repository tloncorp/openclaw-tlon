import { describe, test, expect, beforeAll } from "vitest";
import { getFixtures, waitFor, type TestFixtures } from "../lib/index.js";

describe("contacts", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  test("reads the bot ship profile", async () => {
    const prompt = "Show your own profile details, including your ship name.";
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 300)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();
    expect(response.text?.toLowerCase()).toContain(fixtures.botShip.toLowerCase());
    expect(response.text?.toLowerCase()).toContain("OpenClaw Test Bot".toLowerCase());
  });

  test("updates the bot profile status", async () => {
    const statusToken = `it-status-${Date.now().toString(36)}`;
    const prompt = `Update your own profile status to exactly "${statusToken}" and confirm when done.`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    console.log(`[TEST] Waiting for profile status to be "${statusToken}"...`);
    const updated = await waitFor(async () => {
      const contacts = await fixtures.botState.contacts();
      const self = (contacts ?? []).find((contact) => {
        const c = contact as { id?: string | null };
        return c.id === fixtures.botShip;
      }) as { status?: string | null } | undefined;
      const currentStatus = self?.status ?? "";
      console.log(`[TEST] Current status: "${currentStatus}"`);
      return currentStatus === statusToken ? true : undefined;
    }, 30_000);

    expect(updated).toBe(true);
  });

  test("updates the bot profile bio", async () => {
    const bioToken = `openclaw-integration-bio-${Date.now().toString(36)}`;
    const prompt = `Update your own profile bio to exactly "${bioToken}" and confirm when done.`;
    console.log(`\n[TEST] Sending prompt: "${prompt}"`);

    const response = await fixtures.client.prompt(prompt);
    console.log(`[TEST] Response success: ${response.success}`);
    console.log(`[TEST] Response text: ${response.text?.slice(0, 500)}`);

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    console.log(`[TEST] Waiting for profile bio to be "${bioToken}"...`);
    const updated = await waitFor(async () => {
      const contacts = await fixtures.botState.contacts();
      const self = (contacts ?? []).find((contact) => {
        const c = contact as { id?: string | null };
        return c.id === fixtures.botShip;
      }) as { bio?: string | null } | undefined;
      const currentBio = self?.bio ?? "";
      console.log(`[TEST] Current bio: "${currentBio}"`);
      return currentBio === bioToken ? true : undefined;
    }, 30_000);

    expect(updated).toBe(true);
  });
});
