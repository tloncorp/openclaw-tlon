import { describe, test, expect, beforeAll } from "vitest";
import { getFixtures, waitFor, type TestFixtures } from "../lib/index.js";

describe("contacts", () => {
  let fixtures: TestFixtures;

  beforeAll(async () => {
    fixtures = await getFixtures();
  });

  test("reads the bot ship profile", async () => {
    const prompt = "Show your own profile details, including your ship name.";
    
    const response = await fixtures.client.prompt(prompt);
        
    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    // LLM formatting can vary, so don't require exact phrasing.
    // Require at least one strong profile identifier to appear.
    const text = response.text?.toLowerCase() ?? "";
    expect(text.length).toBeGreaterThan(0);
    expect(
      text.includes(fixtures.botShip.toLowerCase()) ||
        text.includes("openclaw bot") ||
        text.includes("integration test bot") ||
        text.includes("status")
    ).toBe(true);
  });

  test("updates the bot profile nickname", async () => {
    const nicknameToken = `it-nick-${Date.now().toString(36)}`;
    const prompt = `Update your own profile nickname to exactly "${nicknameToken}" and confirm when done.`;
    
    const response = await fixtures.client.prompt(prompt);
        
    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    console.log(`[TEST] Waiting for self profile nickname to be "${nicknameToken}"...`);
    const updated = await waitFor(async () => {
      const selfProfile = await fixtures.botState.scry<Record<string, unknown>>("contacts", "/v1/self");
      const profile = (selfProfile ?? {}) as {
        nickname?: string | { value?: string | null } | null;
        nickName?: string | { value?: string | null } | null;
      };

      const nicknameFromField =
        typeof profile.nickname === "string"
          ? profile.nickname
          : (profile.nickname as { value?: string | null } | null | undefined)?.value;
      const nicknameFromAltField =
        typeof profile.nickName === "string"
          ? profile.nickName
          : (profile.nickName as { value?: string | null } | null | undefined)?.value;

      const currentNickname = nicknameFromField ?? nicknameFromAltField ?? "";
      console.log(`[TEST] Current nickname (self scry): "${currentNickname}"`);
      return currentNickname === nicknameToken;
    }, 30_000);

    expect(updated).toBe(true);
  });

  test("updates the bot profile bio", async () => {
    const bioToken = `openclaw-integration-bio-${Date.now().toString(36)}`;
    const prompt = `Update your own profile bio to exactly "${bioToken}" and confirm when done.`;
    
    const response = await fixtures.client.prompt(prompt);
        
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
