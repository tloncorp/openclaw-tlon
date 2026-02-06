import { describe, expect, it, vi } from "vitest";
import { RateLimiter } from "./rate-limiter.js";

describe("RateLimiter", () => {
  it("blocks after max-per-minute threshold", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));

    const limiter = new RateLimiter({ maxPerMinute: 2, throttleMs: 1000 });

    expect(limiter.checkRateLimit("group-a")).toBe(true);
    expect(limiter.checkRateLimit("group-a")).toBe(true);
    expect(limiter.checkRateLimit("group-a")).toBe(false);

    vi.useRealTimers();
  });

  it("allows again after window expires", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));

    const limiter = new RateLimiter({ maxPerMinute: 1, throttleMs: 1000 });

    expect(limiter.checkRateLimit("group-b")).toBe(true);
    expect(limiter.checkRateLimit("group-b")).toBe(false);

    vi.advanceTimersByTime(60_000);
    vi.setSystemTime(new Date("2025-01-01T00:01:00Z"));

    expect(limiter.checkRateLimit("group-b")).toBe(true);

    vi.useRealTimers();
  });
});
