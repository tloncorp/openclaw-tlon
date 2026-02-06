export type RateLimiterLogger = {
  log?: (msg: string) => void;
  error?: (msg: string) => void;
};

export type RateLimiterOptions = {
  maxPerMinute: number;
  throttleMs?: number;
  logger?: RateLimiterLogger;
  onThrottle?: (group: string, count: number) => void;
  onResume?: (group: string) => void;
};

export class RateLimiter {
  private eventCounts = new Map<string, number[]>();
  private throttledGroups = new Set<string>();
  private throttleTimers = new Map<string, NodeJS.Timeout>();
  private maxPerMinute: number;
  private throttleMs: number;
  private logger?: RateLimiterLogger;
  private onThrottle?: (group: string, count: number) => void;
  private onResume?: (group: string) => void;

  constructor(options: RateLimiterOptions) {
    this.maxPerMinute = options.maxPerMinute;
    this.throttleMs = options.throttleMs ?? 5 * 60 * 1000;
    this.logger = options.logger;
    this.onThrottle = options.onThrottle;
    this.onResume = options.onResume;
  }

  setMaxPerMinute(maxPerMinute: number) {
    this.maxPerMinute = maxPerMinute;
  }

  checkRateLimit(group: string): boolean {
    const key = group;
    if (this.throttledGroups.has(key)) {
      return false;
    }

    const now = Date.now();
    const timestamps = this.eventCounts.get(key) ?? [];
    const recent = timestamps.filter((ts) => now - ts < 60_000);
    this.eventCounts.set(key, recent);

    if (recent.length >= this.maxPerMinute) {
      if (!this.throttledGroups.has(key)) {
        this.throttledGroups.add(key);
        this.onThrottle?.(key, recent.length);

        const timer = setTimeout(() => {
          this.throttledGroups.delete(key);
          this.throttleTimers.delete(key);
          this.onResume?.(key);
        }, this.throttleMs);
        this.throttleTimers.set(key, timer);
      }
      return false;
    }

    recent.push(now);
    this.eventCounts.set(key, recent);
    return true;
  }

  clearGroup(group: string) {
    this.eventCounts.delete(group);
    this.throttledGroups.delete(group);
    const timer = this.throttleTimers.get(group);
    if (timer) {
      clearTimeout(timer);
      this.throttleTimers.delete(group);
    }
  }

  clearAll() {
    for (const group of this.throttleTimers.keys()) {
      this.clearGroup(group);
    }
  }
}
