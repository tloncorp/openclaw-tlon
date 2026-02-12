/**
 * Ship State Client
 *
 * Uses @tloncorp/api high-level functions for test assertions.
 * API calls are serialized because @tloncorp/api uses a shared client singleton.
 */

import {
  Urbit,
  configureClient,
  getGroups,
  getGroup,
  getContacts,
  getSettings,
  getChannelPosts,
  getInitialActivity,
  getGroupAndChannelUnreads,
  scry,
  poke,
} from "@tloncorp/api";

export interface StateClientConfig {
  shipUrl: string;
  shipName: string;
  code: string;
}

export interface StateClient {
  /** Connect and authenticate (call before other methods) */
  connect(): Promise<void>;

  /** Get all groups the ship is a member of */
  groups(): Promise<unknown[]>;

  /** Get a specific group by flag (~host/name) */
  group(flag: string): Promise<unknown | null>;

  /** Get all contacts */
  contacts(): Promise<unknown[]>;

  /** Settings */
  settings(): Promise<unknown>;

  /** Channel posts (group channel or DM) */
  channelPosts(channelId: string, count?: number): Promise<unknown[]>;

  /** Activity feed */
  activity(): Promise<unknown>;

  /** Unreads */
  unreads(): Promise<unknown>;

  /** Raw scry */
  scry<T = unknown>(app: string, path: string): Promise<T>;

  /** Raw poke */
  poke(params: { app: string; mark: string; json: unknown }): Promise<void>;
}

let apiQueue: Promise<unknown> = Promise.resolve();

function runExclusive<T>(fn: () => Promise<T>): Promise<T> {
  const next = apiQueue.then(fn, fn);
  apiQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

/**
 * Create a state client for querying ship state.
 */
export function createStateClient(config: StateClientConfig): StateClient {
  const shipName = config.shipName.replace(/^~/, "");
  const urbit = new Urbit(config.shipUrl, config.code);
  urbit.ship = shipName;

  let connected = false;

  const withClient = async <T>(fn: () => Promise<T>) => {
    return runExclusive(async () => {
      if (!connected) {
        await urbit.connect();
        connected = true;
      }

      configureClient({
        shipName,
        shipUrl: config.shipUrl,
        getCode: async () => config.code,
        client: urbit,
      });

      return fn();
    });
  };

  return {
    async connect() {
      await withClient(async () => {});
    },

    async groups() {
      return withClient(async () => getGroups());
    },

    async group(flag: string) {
      return withClient(async () => {
        try {
          return await getGroup(flag);
        } catch {
          return null;
        }
      });
    },

    async contacts() {
      return withClient(async () => getContacts());
    },

    async settings() {
      return withClient(async () => getSettings());
    },

    async channelPosts(channelId: string, count = 20) {
      return withClient(async () => {
        const result = await getChannelPosts({ channelId, count, mode: "newest" });
        return result.posts ?? [];
      });
    },

    async activity() {
      return withClient(async () => getInitialActivity());
    },

    async unreads() {
      return withClient(async () => getGroupAndChannelUnreads());
    },

    async scry<T = unknown>(app: string, path: string): Promise<T> {
      return withClient(async () => scry<T>({ app, path }));
    },

    async poke(params: { app: string; mark: string; json: unknown }) {
      return withClient(async () => {
        await poke(params);
      });
    },
  };
}
