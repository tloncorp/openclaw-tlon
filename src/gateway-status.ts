import { randomUUID } from "node:crypto";
import { gatewayHeartbeat } from "@tloncorp/api";

// ── Constants (matching design doc recommendations) ─────────
const HEARTBEAT_INTERVAL_MS = 30_000; // 30s
const LEASE_DURATION_MS = 90_000; // 90s
export const ACTIVE_WINDOW_SECS = 300; // 5 min
export const OFFLINE_REPLY_COOLDOWN_SECS = 300; // 5 min

export function computeLeaseUntil(): number {
  return Date.now() + LEASE_DURATION_MS;
}

// ── Manager interface ───────────────────────────────────────
export interface GatewayStatusManager {
  readonly bootId: string;

  /** Resolve the "gateway started" Promise. Called by gateway_start hook. */
  signalGatewayStarted(): void;

  /** Returns a Promise that resolves when gateway_start has fired. */
  waitForGatewayStart(): Promise<void>;

  /** True after monitor has successfully sent %configure + %gateway-start. */
  readonly activated: boolean;
  markActivated(): void;

  /** True after gateway_stop hook has sent %gateway-stop. */
  readonly stopped: boolean;
  markStopped(): void;

  /** Start heartbeat interval. No-op if not activated or already stopped. */
  startHeartbeat(): void;

  /** Stop heartbeat interval. Idempotent. */
  stopHeartbeat(): void;
}

// ── Factory ─────────────────────────────────────────────────
export function createGatewayStatusManager(opts: {
  logger?: { log?: (msg: string) => void; error?: (msg: string) => void };
}): GatewayStatusManager {
  const bootId = randomUUID();
  let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
  let activated = false;
  let stopped = false;

  let resolveStarted: () => void;
  const startedPromise = new Promise<void>((r) => {
    resolveStarted = r;
  });

  return {
    bootId,

    signalGatewayStarted() {
      resolveStarted();
    },
    waitForGatewayStart() {
      return startedPromise;
    },

    get activated() {
      return activated;
    },
    markActivated() {
      activated = true;
    },

    get stopped() {
      return stopped;
    },
    markStopped() {
      stopped = true;
    },

    startHeartbeat() {
      if (stopped || !activated || heartbeatInterval) {
        return;
      }
      heartbeatInterval = setInterval(async () => {
        try {
          await gatewayHeartbeat({ bootId, leaseUntil: computeLeaseUntil() });
        } catch (err) {
          opts.logger?.error?.(`[gateway-status] heartbeat failed: ${String(err)}`);
        }
      }, HEARTBEAT_INTERVAL_MS);
      opts.logger?.log?.(`[gateway-status] heartbeat started (interval=${HEARTBEAT_INTERVAL_MS}ms)`);
    },

    stopHeartbeat() {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
        opts.logger?.log?.("[gateway-status] heartbeat stopped");
      }
    },
  };
}

// ── Module-level accessor (same pattern as setTlonRuntime) ──
let _manager: GatewayStatusManager | null = null;

export function setGatewayStatusManager(m: GatewayStatusManager | null): void {
  _manager = m;
}

export function getGatewayStatusManager(): GatewayStatusManager | null {
  return _manager;
}
