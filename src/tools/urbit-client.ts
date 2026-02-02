/**
 * Lightweight Urbit HTTP client for tools (no SSE, just poke/scry)
 */

export interface TlonConfig {
  url: string;
  ship: string;
  code: string;
}

export interface UrbitToolClient {
  scry: <T>(params: { app: string; path: string }) => Promise<T>;
  poke: (params: { app: string; mark: string; json: unknown }) => Promise<void>;
  ship: string;
}

/**
 * Create a simple HTTP client for tool operations
 */
export async function createToolClient(config: TlonConfig): Promise<UrbitToolClient> {
  const { url, ship, code } = config;
  const normalizedShip = ship.replace(/^~/, "");

  // Authenticate
  const loginResp = await fetch(`${url}/~/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `password=${code}`,
  });

  if (!loginResp.ok) {
    throw new Error(`Login failed: ${loginResp.status}`);
  }

  const setCookie = loginResp.headers.get("set-cookie");
  if (!setCookie) {
    throw new Error("No auth cookie received");
  }
  const cookie = setCookie.split(";")[0];

  return {
    ship: `~${normalizedShip}`,

    async scry<T>(params: { app: string; path: string }): Promise<T> {
      const scryUrl = `${url}/~/scry/${params.app}${params.path}.json`;
      const resp = await fetch(scryUrl, {
        method: "GET",
        headers: { Cookie: cookie },
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Scry failed (${resp.status}): ${text}`);
      }

      return resp.json();
    },

    async poke(params: { app: string; mark: string; json: unknown }): Promise<void> {
      const channelId = `tool-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const channelUrl = `${url}/~/channel/${channelId}`;

      const pokeReq = {
        id: 1,
        action: "poke",
        ship: normalizedShip,
        app: params.app,
        mark: params.mark,
        json: params.json,
      };

      const resp = await fetch(channelUrl, {
        method: "PUT",
        headers: {
          Cookie: cookie,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([pokeReq]),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Poke failed (${resp.status}): ${text}`);
      }

      // Cleanup channel
      fetch(channelUrl, {
        method: "PUT",
        headers: { Cookie: cookie, "Content-Type": "application/json" },
        body: JSON.stringify([{ id: 2, action: "delete" }]),
      }).catch(() => {});
    },
  };
}
