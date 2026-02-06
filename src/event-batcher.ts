export type BatchedEvent<T> = {
  event: T;
  timeId?: string;
  receivedAt: number;
};

export type EventBatcherLogger = {
  log?: (msg: string) => void;
  error?: (msg: string) => void;
};

export type EventBatcherOptions<T> = {
  windowMs: number;
  buildKey: (event: T) => string;
  onFlush: (key: string, events: BatchedEvent<T>[]) => void | Promise<void>;
  logger?: EventBatcherLogger;
};

export class EventBatcher<T> {
  private batches = new Map<string, BatchedEvent<T>[]>();
  private timers = new Map<string, NodeJS.Timeout>();
  private windowMs: number;
  private readonly buildKey: (event: T) => string;
  private readonly onFlush: (key: string, events: BatchedEvent<T>[]) => void | Promise<void>;
  private readonly logger?: EventBatcherLogger;

  constructor(options: EventBatcherOptions<T>) {
    this.windowMs = options.windowMs;
    this.buildKey = options.buildKey;
    this.onFlush = options.onFlush;
    this.logger = options.logger;
  }

  setWindowMs(windowMs: number) {
    this.windowMs = windowMs;
  }

  queueEvent(event: T, timeId?: string) {
    if (this.windowMs <= 0) {
      void this.flushImmediate(event, timeId);
      return;
    }

    const key = this.buildKey(event);
    if (!this.batches.has(key)) {
      this.batches.set(key, []);
      const timer = setTimeout(() => {
        void this.flushBatch(key);
      }, this.windowMs);
      this.timers.set(key, timer);
    }

    const batch = this.batches.get(key);
    if (!batch) {
      return;
    }
    batch.push({ event, timeId, receivedAt: Date.now() });
  }

  async flushBatch(key: string): Promise<void> {
    const events = this.batches.get(key);
    if (!events || events.length === 0) {
      this.cleanup(key);
      return;
    }

    this.cleanup(key);
    try {
      await this.onFlush(key, events);
    } catch (error) {
      this.logger?.error?.(`[batcher] Flush failed for ${key}: ${String(error)}`);
    }
  }

  async flushAll(): Promise<void> {
    const keys = Array.from(this.batches.keys());
    for (const key of keys) {
      await this.flushBatch(key);
    }
  }

  private cleanup(key: string) {
    this.batches.delete(key);
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }

  private async flushImmediate(event: T, timeId?: string): Promise<void> {
    const key = this.buildKey(event);
    const payload: BatchedEvent<T>[] = [{ event, timeId, receivedAt: Date.now() }];
    try {
      await this.onFlush(key, payload);
    } catch (error) {
      this.logger?.error?.(`[batcher] Immediate flush failed for ${key}: ${String(error)}`);
    }
  }
}
