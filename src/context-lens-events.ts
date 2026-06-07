import type { ContextLens } from "./context-lens.js";
import { sharedSlot } from "./shared-state.js";

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

type ContextLensEventState = {
  listeners: Set<ContextLensListener>;
  recentEvents: ContextLensEvent[];
  nextSeq: number;
};

const MAX_RECENT_EVENTS = 200;
const CONTEXT_LENS_EVENTS_SLOT = "@tloncorp/openclaw.context-lens-events";
const stateSlot = sharedSlot<ContextLensEventState>(CONTEXT_LENS_EVENTS_SLOT);
const state = stateSlot.get() ?? {
  listeners: new Set<ContextLensListener>(),
  recentEvents: [],
  nextSeq: 1,
};

stateSlot.set(state);

export function publishContextLensEvent(
  phase: string,
  lens: ContextLens,
  detail?: ContextLensEvent["detail"],
) {
  const event: ContextLensEvent = {
    seq: state.nextSeq++,
    at: Date.now(),
    phase,
    lens,
    ...(detail ? { detail } : {}),
  };

  state.recentEvents.push(event);
  if (state.recentEvents.length > MAX_RECENT_EVENTS) {
    state.recentEvents.splice(0, state.recentEvents.length - MAX_RECENT_EVENTS);
  }

  for (const listener of state.listeners) {
    listener(event);
  }
}

export function listRecentContextLensEvents() {
  return [...state.recentEvents];
}

export function findRecentContextLensById(lensId: string) {
  for (const event of [...state.recentEvents].reverse()) {
    if (event.lens.lensId === lensId) {
      return event.lens;
    }
  }
  return null;
}

export function subscribeToContextLensEvents(listener: ContextLensListener) {
  state.listeners.add(listener);
  return () => {
    state.listeners.delete(listener);
  };
}
