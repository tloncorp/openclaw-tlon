import { describe, test, expect, beforeAll } from "vitest";
import { createTestClient, createStateClient, getTestConfig, type TestClient, type StateClient } from "../lib/index.js";

describe("contacts", () => {
  let client: TestClient;
  let botState: StateClient;
  let botShip: string;

  beforeAll(() => {
    const config = getTestConfig();
    client = createTestClient(config);
    botState = createStateClient(config.bot);
    botShip = config.bot.shipName.startsWith("~") ? config.bot.shipName : `~${config.bot.shipName}`;
  });

  test("reads the bot ship profile", async () => {
    const response = await client.prompt("Show your own profile details, including your ship.");

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }
    expect(response.text).toBeDefined();
    expect(response.text?.toLowerCase()).toContain(botShip.toLowerCase());
  });

  test("updates the bot profile status", async () => {
    const statusToken = `it-status-${Date.now().toString(36)}`;
    const response = await client.prompt(
      `Update your own profile status to exactly "${statusToken}" and confirm when done.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    const updated = await waitFor(async () => {
      const contacts = await botState.contacts();
      const self = (contacts ?? []).find((contact) => {
        const c = contact as { id?: string | null };
        return c.id === botShip;
      }) as { status?: string | null } | undefined;
      return (self?.status ?? "") === statusToken;
    }, 30_000);

    expect(updated).toBe(true);
  });

  test("updates the bot profile bio", async () => {
    const bioToken = `openclaw-integration-bio-${Date.now().toString(36)}`;
    const response = await client.prompt(
      `Update your own profile bio to exactly "${bioToken}" and confirm when done.`
    );

    if (!response.success) {
      throw new Error(response.error ?? "Prompt failed");
    }

    const updated = await waitFor(async () => {
      const contacts = await botState.contacts();
      const self = (contacts ?? []).find((contact) => {
        const c = contact as { id?: string | null };
        return c.id === botShip;
      }) as { bio?: string | null } | undefined;
      return (self?.bio ?? "") === bioToken;
    }, 30_000);

    expect(updated).toBe(true);
  });
});

async function waitFor(fn: () => Promise<boolean>, timeoutMs: number, intervalMs = 1500): Promise<boolean> {
  const started = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await fn();
    if (result) {
      return true;
    }
    if (Date.now() - started >= timeoutMs) {
      throw new Error(`Timed out after ${timeoutMs}ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}
