import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getTestConfig, skipIfNoShip } from './setup';
import { Urbit } from '../http-api';

describe.skipIf(skipIfNoShip())('Urbit Connection', () => {
  let client: Urbit;

  beforeAll(async () => {
    const config = getTestConfig();
    client = new Urbit(config.shipUrl, config.shipCode);
    await client.connect();
  });

  afterAll(() => {
    client?.reset();
  });

  it('should connect to ship', async () => {
    expect(client).toBeDefined();
    expect(client.nodeId).toBeTruthy();
  });

  it('should scry for pikes', async () => {
    const result = await client.scry({ app: 'hood', path: '/kiln/pikes' });
    expect(result).toBeDefined();
  });
});
