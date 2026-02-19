import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestConfig, skipIfNoShip } from './setup';
import { Urbit } from '../http-api';

describe.skipIf(skipIfNoShip())('Poke Operations', () => {
  let client: Urbit;

  beforeAll(async () => {
    const config = getTestConfig();
    client = new Urbit(config.shipUrl, config.shipCode);
    await client.connect();
  });

  afterAll(() => {
    client?.reset();
  });

  it('should poke hood with noop', async () => {
    // This is a safe poke that doesn't change state
    await expect(
      client.poke({
        app: 'hood',
        mark: 'helm-hi',
        json: 'test from @tloncorp/api',
      })
    ).resolves.not.toThrow();
  });
});
