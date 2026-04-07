import {
  createComputingStatus,
  getComputingStatusText,
  serializeComputingStatus,
  setConversationPresence,
} from "@tloncorp/api";
import type { RuntimeEnv } from "openclaw/plugin-sdk";

type RunState = {
  disclose: Set<string>;
  toolNames: string[];
};

type PublishParams = {
  conversationId: string;
  disclose: string[];
  thinking: boolean;
  toolNames: string[];
};

type PublishedState = Omit<PublishParams, "conversationId">;

export type ComputingPresenceReporter = {
  publish: (params: PublishParams) => Promise<void>;
};

function normalizeDisclose(disclose: Iterable<string>) {
  return [...new Set([...disclose].map((ship) => ship.trim()).filter(Boolean))];
}

function normalizeToolName(toolName?: string | null) {
  const trimmed = toolName?.trim();
  return trimmed ? trimmed : null;
}

export function createComputingPresenceReporter(): ComputingPresenceReporter {
  return {
    publish: async ({ conversationId, disclose, thinking, toolNames }) => {
      const toolCalls = toolNames.map((toolName) => ({ toolName }));
      const status = createComputingStatus({ thinking, toolCalls });

      await setConversationPresence({
        conversationId,
        topic: "computing",
        disclose,
        display: {
          text: getComputingStatusText(status),
          blob: serializeComputingStatus({ thinking, toolCalls }),
        },
      });
    },
  };
}

export function createComputingPresenceTracker(params?: {
  reporter?: ComputingPresenceReporter;
  runtime?: RuntimeEnv;
  minUpdateIntervalMs?: number;
}) {
  const reporter = params?.reporter ?? createComputingPresenceReporter();
  const runtime = params?.runtime;
  const minUpdateIntervalMs = Math.max(0, params?.minUpdateIntervalMs ?? 1_000);
  const conversations = new Map<string, Map<string, RunState>>();
  const publishedDisclose = new Map<string, Set<string>>();
  const lastPublishedState = new Map<string, PublishedState>();
  const lastPublishedAt = new Map<string, number>();
  const pendingState = new Map<string, PublishedState>();
  const pendingTimers = new Map<string, ReturnType<typeof setTimeout>>();

  const clonePublishedState = (state: PublishedState): PublishedState => ({
    disclose: [...state.disclose],
    thinking: state.thinking,
    toolNames: [...state.toolNames],
  });

  const statesEqual = (left?: PublishedState, right?: PublishedState) => {
    if (!left || !right) {
      return false;
    }

    if (left.thinking !== right.thinking) {
      return false;
    }

    if (left.disclose.length !== right.disclose.length || left.toolNames.length !== right.toolNames.length) {
      return false;
    }

    for (let index = 0; index < left.disclose.length; index += 1) {
      if (left.disclose[index] !== right.disclose[index]) {
        return false;
      }
    }

    for (let index = 0; index < left.toolNames.length; index += 1) {
      if (left.toolNames[index] !== right.toolNames[index]) {
        return false;
      }
    }

    return true;
  };

  const clearPending = (conversationId: string) => {
    const timer = pendingTimers.get(conversationId);
    if (timer) {
      clearTimeout(timer);
      pendingTimers.delete(conversationId);
    }

    pendingState.delete(conversationId);
  };

  const publishNow = async (conversationId: string, state: PublishedState) => {
    clearPending(conversationId);
    await reporter.publish({
      conversationId,
      ...state,
    });
    lastPublishedState.set(conversationId, clonePublishedState(state));
    lastPublishedAt.set(conversationId, Date.now());
  };

  const flushPending = async (conversationId: string) => {
    const nextState = pendingState.get(conversationId);
    clearPending(conversationId);

    if (!nextState) {
      return;
    }

    if (statesEqual(lastPublishedState.get(conversationId), nextState)) {
      return;
    }

    await publishNow(conversationId, nextState);
  };

  const publishThrottled = async (conversationId: string, state: PublishedState) => {
    if (statesEqual(lastPublishedState.get(conversationId), state)) {
      clearPending(conversationId);
      return;
    }

    if (minUpdateIntervalMs === 0) {
      await publishNow(conversationId, state);
      return;
    }

    const now = Date.now();
    const nextAllowedAt = (lastPublishedAt.get(conversationId) ?? 0) + minUpdateIntervalMs;
    if (now >= nextAllowedAt) {
      await publishNow(conversationId, state);
      return;
    }

    pendingState.set(conversationId, clonePublishedState(state));
    if (pendingTimers.has(conversationId)) {
      return;
    }

    const timer = setTimeout(() => {
      pendingTimers.delete(conversationId);
      void safelySync(conversationId, "flush", async () => {
        await flushPending(conversationId);
      });
    }, nextAllowedAt - now);
    pendingTimers.set(conversationId, timer);
  };

  const syncConversation = async (conversationId: string) => {
    const runs = conversations.get(conversationId);
    const previousDisclose = new Set(publishedDisclose.get(conversationId) ?? []);
    const previousState = lastPublishedState.get(conversationId);

    if (!runs || runs.size === 0) {
      conversations.delete(conversationId);
      publishedDisclose.delete(conversationId);

      const removedDisclose = normalizeDisclose(previousDisclose);
      if (removedDisclose.length > 0) {
        await publishNow(conversationId, {
          disclose: removedDisclose,
          thinking: false,
          toolNames: [],
        });
      }

      return;
    }

    const disclose = new Set<string>();
    const seenToolNames = new Set<string>();
    const toolNames: string[] = [];

    for (const run of runs.values()) {
      for (const ship of run.disclose) {
        disclose.add(ship);
      }

      for (const toolName of run.toolNames) {
        if (seenToolNames.has(toolName)) {
          continue;
        }

        seenToolNames.add(toolName);
        toolNames.push(toolName);
      }
    }

    const currentDisclose = normalizeDisclose(disclose);
    const removedDisclose = normalizeDisclose(
      [...previousDisclose].filter((ship) => !disclose.has(ship)),
    );

    if (removedDisclose.length > 0) {
      await reporter.publish({
        conversationId,
        disclose: removedDisclose,
        thinking: false,
        toolNames: [],
      });
    }

    const currentState: PublishedState = {
      disclose: currentDisclose,
      thinking: true,
      toolNames,
    };
    const addedDisclose = currentDisclose.filter(
      (ship) => !previousState?.disclose.includes(ship),
    );

    if (!previousState || !previousState.thinking || addedDisclose.length > 0) {
      await publishNow(conversationId, currentState);
    } else {
      await publishThrottled(conversationId, currentState);
    }
    publishedDisclose.set(conversationId, new Set(currentDisclose));
  };

  const getRun = (conversationId: string, runId: string) =>
    conversations.get(conversationId)?.get(runId);

  const ensureRun = (conversationId: string, runId: string) => {
    let runs = conversations.get(conversationId);
    if (!runs) {
      runs = new Map();
      conversations.set(conversationId, runs);
    }

    let run = runs.get(runId);
    if (!run) {
      run = {
        disclose: new Set<string>(),
        toolNames: [],
      };
      runs.set(runId, run);
    }

    return run;
  };

  const safelySync = async (conversationId: string, action: string, fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (error) {
      runtime?.error?.(
        `[tlon] Failed to ${action} computing presence for ${conversationId}: ${
          error instanceof Error ? error.stack ?? error.message : String(error)
        }`,
      );
    }
  };

  return {
    refreshRun: async (params: {
      conversationId: string;
      runId: string;
      disclose: string[];
    }) => {
      await safelySync(params.conversationId, "refresh", async () => {
        const run = ensureRun(params.conversationId, params.runId);
        run.disclose = new Set(normalizeDisclose(params.disclose));
        await syncConversation(params.conversationId);
      });
    },

    addToolCall: async (params: {
      conversationId: string;
      runId: string;
      disclose: string[];
      toolName?: string | null;
    }) => {
      const toolName = normalizeToolName(params.toolName);
      if (!toolName) {
        return;
      }

      await safelySync(params.conversationId, "update", async () => {
        const run = ensureRun(params.conversationId, params.runId);
        run.disclose = new Set(normalizeDisclose(params.disclose));
        if (!run.toolNames.includes(toolName)) {
          run.toolNames.push(toolName);
        }
        await syncConversation(params.conversationId);
      });
    },

    clearToolCalls: async (params: { conversationId: string; runId: string }) => {
      await safelySync(params.conversationId, "clear tools for", async () => {
        const run = getRun(params.conversationId, params.runId);
        if (!run || run.toolNames.length === 0) {
          return;
        }

        run.toolNames = [];
        await syncConversation(params.conversationId);
      });
    },

    stopRun: async (params: { conversationId: string; runId: string }) => {
      await safelySync(params.conversationId, "clear", async () => {
        const runs = conversations.get(params.conversationId);
        if (!runs) {
          const previousDisclose = normalizeDisclose(
            publishedDisclose.get(params.conversationId) ?? [],
          );
          publishedDisclose.delete(params.conversationId);
          if (previousDisclose.length > 0) {
            await publishNow(params.conversationId, {
              disclose: previousDisclose,
              thinking: false,
              toolNames: [],
            });
          }
          return;
        }

        runs.delete(params.runId);
        if (runs.size === 0) {
          conversations.delete(params.conversationId);
        }

        await syncConversation(params.conversationId);
      });
    },
  };
}
