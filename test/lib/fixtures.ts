import type { TestClient } from "./client.js";
import type { StateClient } from "./state.js";

export type FixtureGroup = {
  id: string;
  title: string;
  channelId: string;
};

/**
 * Wait for a condition to be true, polling at intervals.
 */
export async function waitFor<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  intervalMs = 1500
): Promise<T> {
  const started = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await fn();
    if (result) {
      return result;
    }
    if (Date.now() - started >= timeoutMs) {
      throw new Error(`Timed out after ${timeoutMs}ms`);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
}

/**
 * Pick the first available group from a list.
 */
export function pickAnyGroup(groups: unknown[] | undefined): FixtureGroup | null {
  for (const group of groups ?? []) {
    const g = group as { id?: string | null; title?: string | null; channels?: unknown[] };
    if (!g.id) {
      continue;
    }
    const channels = (g.channels ?? []) as Array<{ id?: string | null }>;
    const channelId = channels.find((c) => c.id)?.id ?? `chat/${g.id}/general`;
    return {
      id: g.id,
      title: g.title ?? g.id,
      channelId,
    };
  }
  return null;
}

/**
 * Ensure a fixture group exists for testing, creating one if needed.
 */
export async function ensureFixtureGroup(
  client: TestClient,
  botState: StateClient
): Promise<FixtureGroup> {
  const existing = await botState.groups();
  const firstExisting = pickAnyGroup(existing);
  const existingFixture = (existing ?? []).find((group) => {
    const g = group as { id?: string | null; title?: string | null };
    return (g.title ?? "").startsWith("OpenClaw Fixture Group");
  }) as { id?: string | null; title?: string | null; channels?: unknown[] } | undefined;

  if (existingFixture?.id) {
    const channels = (existingFixture.channels ?? []) as Array<{ id?: string | null }>;
    const firstChannel = channels.find((c) => c.id)?.id;
    return {
      id: existingFixture.id,
      title: existingFixture.title ?? "OpenClaw Fixture Group",
      channelId: firstChannel ?? `chat/${existingFixture.id}/general`,
    };
  }

  const suffix = Date.now().toString(36);
  const groupTitle = `OpenClaw Fixture Group ${suffix}`;
  const createResponse = await client.prompt(
    `Create a private group on your own ship with title "${groupTitle}". Reply with only the new group id.`
  );
  if (!createResponse.success) {
    if (firstExisting) {
      return firstExisting;
    }
    throw new Error(`Failed to create fixture group: ${createResponse.error ?? "unknown error"}`);
  }

  const created = await waitFor(async () => {
    const groups = await botState.groups();
    return (groups ?? []).find((group) => {
      const g = group as { id?: string | null; title?: string | null; channels?: unknown[] };
      return (g.title ?? "").trim() === groupTitle;
    }) as { id?: string | null; title?: string | null; channels?: unknown[] } | undefined;
  }, 45_000);

  const createdId = created?.id;
  if (!createdId) {
    if (firstExisting) {
      return firstExisting;
    }
    throw new Error("Fixture group was created but no group id was returned by state");
  }
  const channels = (created?.channels ?? []) as Array<{ id?: string | null }>;
  const firstChannel = channels.find((c) => c.id)?.id ?? `chat/${createdId}/general`;
  return { id: createdId, title: groupTitle, channelId: firstChannel };
}
