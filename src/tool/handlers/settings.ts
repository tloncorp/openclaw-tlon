/**
 * OpenClaw settings management handlers for tlon_run
 */

import type { HandlerParams } from "../index.js";
import { createToolClient, normalizeShip } from "../urbit-client.js";

const SETTINGS_DESK = "moltbot";
const SETTINGS_BUCKET = "tlon";

interface SettingsAll {
  all: Record<string, Record<string, Record<string, unknown>>>;
}

async function getSettings(
  client: Awaited<ReturnType<typeof createToolClient>>,
): Promise<Record<string, unknown>> {
  try {
    const result = await client.scry<SettingsAll>({
      app: "settings",
      path: "/all",
    });
    return (result?.all?.[SETTINGS_DESK]?.[SETTINGS_BUCKET]) ?? {};
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("404") || message.includes("not found")) {
      return {};
    }
    throw err;
  }
}

async function putEntry(
  client: Awaited<ReturnType<typeof createToolClient>>,
  key: string,
  value: unknown,
): Promise<void> {
  await client.poke({
    app: "settings",
    mark: "settings-event",
    json: {
      "put-entry": {
        desk: SETTINGS_DESK,
        "bucket-key": SETTINGS_BUCKET,
        "entry-key": key,
        value,
      },
    },
  });
}

async function delEntry(
  client: Awaited<ReturnType<typeof createToolClient>>,
  key: string,
): Promise<void> {
  await client.poke({
    app: "settings",
    mark: "settings-event",
    json: {
      "del-entry": {
        desk: SETTINGS_DESK,
        "bucket-key": SETTINGS_BUCKET,
        "entry-key": key,
      },
    },
  });
}

async function addToArray(
  client: Awaited<ReturnType<typeof createToolClient>>,
  key: string,
  item: string,
): Promise<string> {
  const settings = await getSettings(client);
  const current = (settings[key] as string[]) ?? [];
  const normalized =
    key === "dmAllowlist" || key === "defaultAuthorizedShips" ? normalizeShip(item) : item;

  if (current.includes(normalized)) {
    return `${normalized} already in ${key}`;
  }

  await putEntry(client, key, [...current, normalized]);
  return `Added ${normalized} to ${key}`;
}

async function removeFromArray(
  client: Awaited<ReturnType<typeof createToolClient>>,
  key: string,
  item: string,
): Promise<string> {
  const settings = await getSettings(client);
  const current = (settings[key] as string[]) ?? [];
  const normalized =
    key === "dmAllowlist" || key === "defaultAuthorizedShips" ? normalizeShip(item) : item;

  const updated = current.filter((x) => x !== normalized);
  if (updated.length === current.length) {
    return `${normalized} not in ${key}`;
  }

  await putEntry(client, key, updated);
  return `Removed ${normalized} from ${key}`;
}

function parseChannelRules(
  value: unknown,
): Record<string, { mode?: string; allowedShips?: string[] }> {
  if (!value) {return {};}
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  if (typeof value === "object") {
    return value as Record<string, { mode?: string; allowedShips?: string[] }>;
  }
  return {};
}

async function setChannelRule(
  client: Awaited<ReturnType<typeof createToolClient>>,
  channel: string,
  mode: "open" | "restricted",
  allowedShips?: string[],
): Promise<string> {
  const settings = await getSettings(client);
  const rules = parseChannelRules(settings.channelRules);

  const rule: Record<string, unknown> = { mode };
  if (mode === "restricted" && allowedShips?.length) {
    rule.allowedShips = allowedShips.map(normalizeShip);
  }

  await putEntry(client, "channelRules", JSON.stringify({ ...rules, [channel]: rule }));
  return mode === "open"
    ? `Opened ${channel} to all`
    : `Restricted ${channel}${allowedShips?.length ? ` to ${allowedShips.join(", ")}` : ""}`;
}

export async function get({ accountId }: HandlerParams): Promise<string> {
  const client = await createToolClient(accountId);
  const settings = await getSettings(client);
  return JSON.stringify(settings, null, 2);
}

export async function set({ accountId, args }: HandlerParams): Promise<string> {
  const key = args[0];
  const jsonValue = args[1];

  if (!key || jsonValue === undefined) {
    throw new Error("Usage: settings set <key> <json-value>");
  }

  const client = await createToolClient(accountId);
  const value = JSON.parse(jsonValue);
  await putEntry(client, key, value);
  return `Set ${key}`;
}

export async function deleteEntry({ accountId, args }: HandlerParams): Promise<string> {
  const key = args[0];
  if (!key) {
    throw new Error("Usage: settings delete <key>");
  }

  const client = await createToolClient(accountId);
  await delEntry(client, key);
  return `Deleted ${key}`;
}

export async function allowDm({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  if (!ship) {
    throw new Error("Usage: settings allow-dm <~ship>");
  }

  const client = await createToolClient(accountId);
  return addToArray(client, "dmAllowlist", ship);
}

export async function removeDm({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  if (!ship) {
    throw new Error("Usage: settings remove-dm <~ship>");
  }

  const client = await createToolClient(accountId);
  return removeFromArray(client, "dmAllowlist", ship);
}

export async function allowChannel({ accountId, args }: HandlerParams): Promise<string> {
  const channel = args[0];
  if (!channel) {
    throw new Error("Usage: settings allow-channel <channel-nest>");
  }

  const client = await createToolClient(accountId);
  return addToArray(client, "groupChannels", channel);
}

export async function removeChannel({ accountId, args }: HandlerParams): Promise<string> {
  const channel = args[0];
  if (!channel) {
    throw new Error("Usage: settings remove-channel <channel-nest>");
  }

  const client = await createToolClient(accountId);
  return removeFromArray(client, "groupChannels", channel);
}

export async function openChannel({ accountId, args }: HandlerParams): Promise<string> {
  const channel = args[0];
  if (!channel) {
    throw new Error("Usage: settings open-channel <channel-nest>");
  }

  const client = await createToolClient(accountId);
  return setChannelRule(client, channel, "open");
}

export async function restrictChannel({ accountId, args }: HandlerParams): Promise<string> {
  const channel = args[0];
  const ships = args.slice(1);

  if (!channel) {
    throw new Error("Usage: settings restrict-channel <channel-nest> [~ship1 ~ship2 ...]");
  }

  const client = await createToolClient(accountId);
  return setChannelRule(client, channel, "restricted", ships.length ? ships : undefined);
}

export async function authorizeShip({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  if (!ship) {
    throw new Error("Usage: settings authorize-ship <~ship>");
  }

  const client = await createToolClient(accountId);
  return addToArray(client, "defaultAuthorizedShips", ship);
}

export async function deauthorizeShip({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  if (!ship) {
    throw new Error("Usage: settings deauthorize-ship <~ship>");
  }

  const client = await createToolClient(accountId);
  return removeFromArray(client, "defaultAuthorizedShips", ship);
}
