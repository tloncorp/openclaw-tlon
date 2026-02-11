/**
 * Ship State Client
 *
 * Uses @tloncorp/api Urbit class to query ship state for test assertions.
 */

import { Urbit } from "@tloncorp/api";

export interface StateClientConfig {
  shipUrl: string;
  shipName: string;
  code: string;
}

export interface StateClient {
  /** Connect and authenticate (call before other methods) */
  connect(): Promise<void>;

  /** Get all groups the ship is a member of */
  groups(): Promise<Record<string, unknown>>;

  /** Get a specific group by flag (~host/name) */
  group(flag: string): Promise<unknown | null>;

  /** Get all contacts */
  contacts(): Promise<Record<string, unknown>>;

  /** Raw scry */
  scry<T = unknown>(app: string, path: string): Promise<T>;

  /** Raw poke */
  poke(params: { app: string; mark: string; json: unknown }): Promise<void>;
}

/**
 * Create a state client for querying ship state.
 *
 * Uses the Urbit class directly for reliable authentication.
 */
export function createStateClient(config: StateClientConfig): StateClient {
  const shipName = config.shipName.replace(/^~/, "");
  const urbit = new Urbit(config.shipUrl, config.code);
  urbit.ship = shipName;

  let connected = false;

  const ensureConnected = async () => {
    if (!connected) {
      await urbit.connect();
      connected = true;
    }
  };

  return {
    async connect() {
      await ensureConnected();
    },

    async groups() {
      await ensureConnected();
      return urbit.scry({ app: "groups", path: "/groups" });
    },

    async group(flag: string) {
      await ensureConnected();
      try {
        return await urbit.scry({ app: "groups", path: `/groups/${flag}` });
      } catch {
        return null;
      }
    },

    async contacts() {
      await ensureConnected();
      return urbit.scry({ app: "contacts", path: "/all" });
    },

    async scry<T = unknown>(app: string, path: string): Promise<T> {
      await ensureConnected();
      return urbit.scry({ app, path });
    },

    async poke(params: { app: string; mark: string; json: unknown }) {
      await ensureConnected();
      return urbit.poke(params);
    },
  };
}
