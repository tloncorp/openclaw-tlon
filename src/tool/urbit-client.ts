/**
 * Urbit HTTP API client for the tlon_run tool
 *
 * Uses the OpenClaw config to get credentials, reuses auth.ts for authentication
 */

import { getTlonRuntime } from "../runtime.js";
import { resolveTlonAccount } from "../types.js";
import { authenticate } from "../urbit/auth.js";

export interface ToolClient {
  url: string;
  ship: string;
  cookie: string;
  scry: <T>(params: { app: string; path: string }) => Promise<T>;
  poke: (params: { app: string; mark: string; json: unknown }) => Promise<void>;
}

/**
 * Create an authenticated client for the tlon_run tool
 * Gets credentials from OpenClaw config via runtime
 */
export async function createToolClient(accountId?: string): Promise<ToolClient> {
  const runtime = getTlonRuntime();
  const cfg = await runtime.config.get();
  const account = resolveTlonAccount(cfg, accountId);

  if (!account.configured || !account.url || !account.code || !account.ship) {
    throw new Error(
      "Tlon account not configured. Run 'openclaw setup tlon' to configure your Urbit ship.",
    );
  }

  const cookie = await authenticate(account.url, account.code);
  const ship = account.ship.replace(/^~/, "");

  return {
    url: account.url,
    ship,
    cookie,
    scry: (params) => scry(account.url!, cookie, params),
    poke: (params) => poke(account.url!, cookie, ship, params),
  };
}

/**
 * Scry (read) from an Urbit agent
 */
async function scry<T>(
  url: string,
  cookie: string,
  params: { app: string; path: string },
): Promise<T> {
  const scryUrl = `${url}/~/scry/${params.app}${params.path}.json`;

  const resp = await fetch(scryUrl, {
    method: "GET",
    headers: {
      Cookie: cookie.split(";")[0],
    },
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Scry failed (${resp.status}): ${text}`);
  }

  return resp.json();
}

/**
 * Poke (write) to an Urbit agent
 */
async function poke(
  url: string,
  cookie: string,
  ship: string,
  params: { app: string; mark: string; json: unknown },
): Promise<void> {
  // Generate a unique channel ID
  const channelId = `tool-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const channelUrl = `${url}/~/channel/${channelId}`;

  // Open channel and send poke
  const pokeReq = {
    id: 1,
    action: "poke",
    ship,
    app: params.app,
    mark: params.mark,
    json: params.json,
  };

  const resp = await fetch(channelUrl, {
    method: "PUT",
    headers: {
      Cookie: cookie.split(";")[0],
      "Content-Type": "application/json",
    },
    body: JSON.stringify([pokeReq]),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Poke failed (${resp.status}): ${text}`);
  }

  // Delete the channel (cleanup)
  const deleteReq = {
    id: 2,
    action: "delete",
  };

  await fetch(channelUrl, {
    method: "PUT",
    headers: {
      Cookie: cookie.split(";")[0],
      "Content-Type": "application/json",
    },
    body: JSON.stringify([deleteReq]),
  }).catch(() => {
    // Ignore cleanup errors
  });
}

/**
 * Normalize ship name to include ~
 */
export function normalizeShip(ship: string): string {
  return ship.startsWith("~") ? ship : `~${ship}`;
}

/**
 * Get ship with tilde from client
 */
export function getShipWithTilde(client: ToolClient): string {
  return normalizeShip(client.ship);
}
