import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestConfig, skipIfNoShip } from './setup';
import { Urbit } from '../http-api';

describe.skipIf(skipIfNoShip())('Scry Operations', () => {
  let client: Urbit;

  beforeAll(async () => {
    const config = getTestConfig();
    client = new Urbit(config.shipUrl, config.shipCode);
    await client.connect();
  });

  afterAll(() => {
    client?.reset();
  });

  it('should scry for hood pikes', async () => {
    const result = await client.scry({
      app: 'hood',
      path: '/kiln/pikes',
    });
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('should scry for contacts', async () => {
    const result = await client.scry({
      app: 'contacts',
      path: '/all',
    });
    expect(result).toBeDefined();
  });
});
