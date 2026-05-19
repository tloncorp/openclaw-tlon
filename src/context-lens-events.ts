import type { ContextLens } from "./context-lens.js";

export type ContextLensEvent = {
  seq: number;
  at: number;
  phase: string;
  lens: ContextLens;
  detail?: {
    toolName?: string;
    toolPhase?: string;
    toolCallCount?: number;
  };
};

type ContextLensListener = (event: ContextLensEvent) => void;

const MAX_RECENT_EVENTS = 200;
const listeners = new Set<ContextLensListener>();
const recentEvents: ContextLensEvent[] = [];
let nextSeq = 1;

export function publishContextLensEvent(
  phase: string,
  lens: ContextLens,
  detail?: ContextLensEvent["detail"],
) {
  const event: ContextLensEvent = {
    seq: nextSeq++,
    at: Date.now(),
    phase,
    lens,
    ...(detail ? { detail } : {}),
  };

  recentEvents.push(event);
  if (recentEvents.length > MAX_RECENT_EVENTS) {
    recentEvents.splice(0, recentEvents.length - MAX_RECENT_EVENTS);
  }

  for (const listener of listeners) {
    listener(event);
  }
}

export function listRecentContextLensEvents() {
  return [...recentEvents];
}

export function findRecentContextLensById(lensId: string) {
  for (const event of [...recentEvents].reverse()) {
    if (event.lens.lensId === lensId) {
      return event.lens;
    }
  }
  return null;
}

export function subscribeToContextLensEvents(listener: ContextLensListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
