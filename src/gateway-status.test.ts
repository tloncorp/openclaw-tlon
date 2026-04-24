import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@tloncorp/api", () => ({
  gatewayHeartbeat: vi.fn().mockResolvedValue(undefined),
}));

import { gatewayHeartbeat } from "@tloncorp/api";
import {
  createGatewayStatusManager,
  setGatewayStatusManager,
  getGatewayStatusManager,
  computeLeaseUntil,
  type GatewayStatusManager,
} from "./gateway-status.js";

describe("gateway-status: createGatewayStatusManager", () => {
  let manager: GatewayStatusManager;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(gatewayHeartbeat).mockClear();
    manager = createGatewayStatusManager({ logger: undefined });
  });

  afterEach(() => {
    manager.stopHeartbeat();
    vi.useRealTimers();
  });

  it("bootId is a valid UUID", () => {
    expect(manager.bootId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
  });

  it("each manager gets a unique bootId", () => {
    const other = createGatewayStatusManager({ logger: undefined });
    expect(manager.bootId).not.toBe(other.bootId);
  });

  describe("gateway_start coordination", () => {
    it("signalGatewayStarted resolves waitForGatewayStart", async () => {
      let resolved = false;
      const p = manager.waitForGatewayStart().then(() => {
        resolved = true;
      });
      expect(resolved).toBe(false);

      manager.signalGatewayStarted();
      await p;
      expect(resolved).toBe(true);
    });

    it("waitForGatewayStart resolves immediately if already signaled", async () => {
      manager.signalGatewayStarted();

      let resolved = false;
      await manager.waitForGatewayStart().then(() => {
        resolved = true;
      });
      expect(resolved).toBe(true);
    });
  });

  describe("heartbeat", () => {
    it("startHeartbeat is no-op when not activated", () => {
      manager.startHeartbeat();
      vi.advanceTimersByTime(60_000);
      expect(gatewayHeartbeat).not.toHaveBeenCalled();
    });

    it("startHeartbeat is no-op when stopped", () => {
      manager.markActivated();
      manager.markStopped();
      manager.startHeartbeat();
      vi.advanceTimersByTime(60_000);
      expect(gatewayHeartbeat).not.toHaveBeenCalled();
    });

    it("sends periodic heartbeats when activated", () => {
      manager.markActivated();
      manager.startHeartbeat();

      expect(gatewayHeartbeat).not.toHaveBeenCalled();

      vi.advanceTimersByTime(30_000);
      expect(gatewayHeartbeat).toHaveBeenCalledTimes(1);

      const call = vi.mocked(gatewayHeartbeat).mock.calls[0][0];
      expect(call.bootId).toBe(manager.bootId);
      expect(call.leaseUntil).toBeGreaterThan(Date.now());

      vi.advanceTimersByTime(30_000);
      expect(gatewayHeartbeat).toHaveBeenCalledTimes(2);
    });

    it("stopHeartbeat clears interval", () => {
      manager.markActivated();
      manager.startHeartbeat();

      vi.advanceTimersByTime(30_000);
      expect(gatewayHeartbeat).toHaveBeenCalledTimes(1);

      manager.stopHeartbeat();
      vi.advanceTimersByTime(60_000);
      expect(gatewayHeartbeat).toHaveBeenCalledTimes(1);
    });

    it("stopHeartbeat is idempotent", () => {
      manager.markActivated();
      manager.startHeartbeat();
      manager.stopHeartbeat();
      manager.stopHeartbeat(); // should not throw
    });

    it("heartbeat error does not crash", () => {
      vi.mocked(gatewayHeartbeat).mockRejectedValueOnce(new Error("poke failed"));
      manager.markActivated();
      manager.startHeartbeat();

      // First heartbeat fails
      vi.advanceTimersByTime(30_000);
      expect(gatewayHeartbeat).toHaveBeenCalledTimes(1);

      // Second heartbeat still fires
      vi.advanceTimersByTime(30_000);
      expect(gatewayHeartbeat).toHaveBeenCalledTimes(2);
    });

    it("startHeartbeat does not create duplicate intervals", () => {
      manager.markActivated();
      manager.startHeartbeat();
      manager.startHeartbeat(); // second call should be no-op

      vi.advanceTimersByTime(30_000);
      expect(gatewayHeartbeat).toHaveBeenCalledTimes(1); // not 2
    });
  });

  describe("lifecycle flags", () => {
    it("activated starts false", () => {
      expect(manager.activated).toBe(false);
    });

    it("markActivated sets activated", () => {
      manager.markActivated();
      expect(manager.activated).toBe(true);
    });

    it("stopped starts false", () => {
      expect(manager.stopped).toBe(false);
    });

    it("markStopped sets stopped", () => {
      manager.markStopped();
      expect(manager.stopped).toBe(true);
    });
  });
});

describe("gateway-status: module-level accessor", () => {
  beforeEach(() => {
    setGatewayStatusManager(null);
  });

  it("returns null when not set", () => {
    // Reset by setting to null via internal trick — in real code, null is the initial state
    expect(getGatewayStatusManager()).toBeNull();
  });

  it("stores and retrieves manager", () => {
    const manager = createGatewayStatusManager({ logger: undefined });
    setGatewayStatusManager(manager);
    expect(getGatewayStatusManager()).toBe(manager);
  });
});

describe("gateway-status: computeLeaseUntil", () => {
  it("returns a timestamp in the future", () => {
    const now = Date.now();
    const lease = computeLeaseUntil();
    expect(lease).toBeGreaterThan(now);
    // Should be ~90 seconds in the future
    expect(lease - now).toBeGreaterThanOrEqual(89_000);
    expect(lease - now).toBeLessThanOrEqual(91_000);
  });
});
