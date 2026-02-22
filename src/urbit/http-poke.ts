import { authenticate } from "./auth.js";
import { ssrfPolicyFromAllowPrivateNetwork } from "./context.js";

export type HttpPokeApi = {
  poke: (params: { app: string; mark: string; json: unknown }) => Promise<number>;
  delete: () => Promise<void>;
};

/**
 * Simple HTTP-only poke that doesn't open an EventSource (avoids conflict with monitor's SSE)
 */
export async function createHttpPokeApi(params: {
  url: string;
  code: string;
  ship: string;
  allowPrivateNetwork?: boolean;
}): Promise<HttpPokeApi> {
  const ssrfPolicy = ssrfPolicyFromAllowPrivateNetwork(params.allowPrivateNetwork);
  const cookie = await authenticate(params.url, params.code, { ssrfPolicy });
  const channelId = `${Math.floor(Date.now() / 1000)}-${Math.random().toString(36).substring(2, 8)}`;
  const channelUrl = `${params.url}/~/channel/${channelId}`;
  const shipName = params.ship.replace(/^~/, "");

  return {
    poke: async (pokeParams: { app: string; mark: string; json: unknown }) => {
      const pokeId = Date.now();
      const pokeData = {
        id: pokeId,
        action: "poke",
        ship: shipName,
        app: pokeParams.app,
        mark: pokeParams.mark,
        json: pokeParams.json,
      };

      const response = await fetch(channelUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie.split(";")[0],
        },
        body: JSON.stringify([pokeData]),
      });

      if (!response.ok && response.status !== 204) {
        const errorText = await response.text();
        throw new Error(`Poke failed: ${response.status} - ${errorText}`);
      }

      return pokeId;
    },
    delete: async () => {
      // No-op for HTTP-only client
    },
  };
}
