import type { ContextLens } from "./context-lens.js";

export type ContextLensEvent = {
  seq: number;
  at: number;
  phase: string;
  lens: ContextLens;
};

type ContextLensListener = (event: ContextLensEvent) => void;

const MAX_RECENT_EVENTS = 200;
const listeners = new Set<ContextLensListener>();
const recentEvents: ContextLensEvent[] = [];
let nextSeq = 1;

export function publishContextLensEvent(phase: string, lens: ContextLens) {
  const event: ContextLensEvent = {
    seq: nextSeq++,
    at: Date.now(),
    phase,
    lens,
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

export function subscribeToContextLensEvents(listener: ContextLensListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
