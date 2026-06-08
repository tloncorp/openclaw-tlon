import { createHash, randomUUID } from "node:crypto";

export type ContextLensTrigger =
  | "dm"
  | "mention"
  | "thread"
  | "reaction"
  | "owner-listen"
  | "owner-blob"
  | "summarization"
  | "unknown";

export type ContextLensStatus =
  | "assembling"
  | "queued"
  | "dispatching"
  | "tool_running"
  | "delivering"
  | "completed"
  | "no_reply"
  | "timed_out"
  | "error";

export type ContextLensTriggerDetails = {
  type: ContextLensTrigger;
  messageId: string;
  authorShip?: string;
  conversationId?: string;
  conversationKind: "dm" | "channel";
  receivedAt?: number;
  preview?: string;
};

export type ContextLensSourceKind =
  | "message"
  | "memory"
  | "identity"
  | "system"
  | "tool_result"
  | "other";

export type ContextLensSource = {
  kind: ContextLensSourceKind;
  label: string;
  sourceId?: string;
  included: boolean;
  reason?: string;
  tokenEstimate?: number;
  preview?: string;
};

export type ContextLensToolRun = {
  id: string;
  callIndex: number;
  name: string;
  phase?: string;
  startedAt: number;
  completedAt: number | null;
  durationMs: number | null;
  status: "running" | "completed" | "error";
  argumentSummary?: string;
  resultSummary?: string;
  error?: string;
};

export type ContextLensOutput = {
  messageId: string;
  conversationId: string;
  kind: "dm" | "channel";
  sentAt: number;
  preview?: string;
  chunkIndex?: number;
};

export type ContextLensPersistenceEvent = {
  kind: "memory" | "conversation_state" | "tool_cache" | "artifact" | "other";
  action: "read" | "created" | "updated" | "skipped" | "deleted";
  location: "openclaw" | "urbit" | "tlon-desk" | "external";
  status: "ok" | "failed" | "skipped";
  key?: string;
  reason?: string;
  at: number;
};

export type ContextLens = {
  lensId: string;
  messageId: string;
  sessionKeyHash: string | null;
  chatType: "dm" | "channel";
  trigger: ContextLensTrigger;
  triggerDetails: ContextLensTriggerDetails;
  model: string | null;
  provider: string | null;
  context: {
    currentMessage: boolean;
    threadMessages: number;
    channelMessages: number;
    citedPosts: number;
    attachments: number;
    pendingNudge: boolean;
    sources: ContextLensSource[];
  };
  persistence: {
    postsReply: boolean;
    updatesSettings: boolean;
    writesMedia: boolean;
    emitsTelemetry: boolean;
    cachesHistory: boolean;
    events: ContextLensPersistenceEvent[];
  };
  tools: {
    ownerOnlyAvailable: string[];
    called: string[];
    callCount: number;
    lastStartedAt: number | null;
    runs: ContextLensToolRun[];
  };
  outputs: ContextLensOutput[];
  lifecycle: {
    queuedAt: number | null;
    queuedMs: number;
    dispatchStartedAt: number | null;
    firstToolStartedAt: number | null;
    completedAt: number | null;
    durationMs: number | null;
    timeoutMs: number | null;
    timedOut: boolean;
    deliveredMessageCount: number;
    queuedFinal: boolean;
    queuedFinalCount: number;
    queuedBlockCount: number;
  };
  status: ContextLensStatus;
  error: string | null;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
};

export type CreateContextLensInput = {
  messageId: string;
  chatType: ContextLens["chatType"];
  trigger?: ContextLensTrigger;
  sessionKey?: string | null;
  senderShip?: string;
  conversationId?: string;
  receivedAt?: number;
  preview?: string;
  now?: number;
  ttlMs?: number;
};

export type ContextLensRegistry = ReturnType<typeof createContextLensRegistry>;

const DEFAULT_TTL_MS = 30 * 60 * 1000;
const MAX_LENSES = 200;

export function hashSessionKey(sessionKey: string): string {
  return createHash("sha256").update(sessionKey).digest("hex").slice(0, 16);
}

function cloneLens(lens: ContextLens): ContextLens {
  return {
    ...lens,
    context: {
      ...lens.context,
      sources: lens.context.sources.map((source) => ({ ...source })),
    },
    persistence: {
      ...lens.persistence,
      events: lens.persistence.events.map((event) => ({ ...event })),
    },
    tools: {
      ownerOnlyAvailable: [...lens.tools.ownerOnlyAvailable],
      called: [...lens.tools.called],
      callCount: lens.tools.callCount,
      lastStartedAt: lens.tools.lastStartedAt,
      runs: lens.tools.runs.map((run) => ({ ...run })),
    },
    outputs: lens.outputs.map((output) => ({ ...output })),
    lifecycle: { ...lens.lifecycle },
    triggerDetails: { ...lens.triggerDetails },
  };
}

function serializeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message || error.name;
  }
  return String(error);
}

export function createContextLensRegistry(opts: { ttlMs?: number; maxEntries?: number } = {}) {
  const ttlMs = opts.ttlMs ?? DEFAULT_TTL_MS;
  const maxEntries = opts.maxEntries ?? MAX_LENSES;
  const lenses = new Map<string, ContextLens>();

  const prune = (now = Date.now()) => {
    for (const [lensId, lens] of lenses) {
      if (lens.expiresAt <= now) {
        lenses.delete(lensId);
      }
    }

    while (lenses.size > maxEntries) {
      const oldest = lenses.keys().next().value;
      if (!oldest) { break; }
      lenses.delete(oldest);
    }
  };

  const create = (input: CreateContextLensInput): ContextLens => {
    const now = input.now ?? Date.now();
    prune(now);

    const lens: ContextLens = {
      lensId: randomUUID(),
      messageId: input.messageId,
      sessionKeyHash: input.sessionKey ? hashSessionKey(input.sessionKey) : null,
      chatType: input.chatType,
      trigger: input.trigger ?? "unknown",
      triggerDetails: {
        type: input.trigger ?? "unknown",
        messageId: input.messageId,
        ...(input.senderShip ? { authorShip: input.senderShip } : {}),
        ...(input.conversationId ? { conversationId: input.conversationId } : {}),
        conversationKind: input.chatType,
        ...(input.receivedAt ? { receivedAt: input.receivedAt } : {}),
        ...(input.preview ? { preview: input.preview } : {}),
      },
      model: null,
      provider: null,
      context: {
        currentMessage: true,
        threadMessages: 0,
        channelMessages: 0,
        citedPosts: 0,
        attachments: 0,
        pendingNudge: false,
        sources: [
          {
            kind: "message",
            label: "Current message",
            sourceId: input.messageId,
            included: true,
            reason: "trigger",
            ...(input.preview ? { preview: input.preview } : {}),
          },
        ],
      },
      persistence: {
        postsReply: false,
        updatesSettings: false,
        writesMedia: false,
        emitsTelemetry: false,
        cachesHistory: false,
        events: [],
      },
      tools: {
        ownerOnlyAvailable: [],
        called: [],
        callCount: 0,
        lastStartedAt: null,
        runs: [],
      },
      outputs: [],
      lifecycle: {
        queuedAt: null,
        queuedMs: 0,
        dispatchStartedAt: null,
        firstToolStartedAt: null,
        completedAt: null,
        durationMs: null,
        timeoutMs: null,
        timedOut: false,
        deliveredMessageCount: 0,
        queuedFinal: false,
        queuedFinalCount: 0,
        queuedBlockCount: 0,
      },
      status: "assembling",
      error: null,
      createdAt: now,
      updatedAt: now,
      expiresAt: now + (input.ttlMs ?? ttlMs),
    };

    lenses.set(lens.lensId, lens);
    prune(now);
    return cloneLens(lens);
  };

  const update = (lensId: string | null | undefined, patch: Partial<ContextLens>) => {
    if (!lensId) { return null; }
    const existing = lenses.get(lensId);
    if (!existing) { return null; }

    const next: ContextLens = {
      ...existing,
      ...patch,
      context: { ...existing.context, ...patch.context },
      persistence: { ...existing.persistence, ...patch.persistence },
      tools: { ...existing.tools, ...patch.tools },
      outputs: patch.outputs ?? existing.outputs,
      triggerDetails: { ...existing.triggerDetails, ...patch.triggerDetails },
      lifecycle: { ...existing.lifecycle, ...patch.lifecycle },
      updatedAt: patch.updatedAt ?? Date.now(),
    };
    lenses.set(lensId, next);
    return cloneLens(next);
  };

  const setStatus = (
    lensId: string | null | undefined,
    status: ContextLensStatus,
    error?: unknown,
  ) =>
    update(lensId, {
      status,
      ...(error === undefined ? {} : { error: serializeError(error) }),
    });

  const recordContext = (
    lensId: string | null | undefined,
    patch: Partial<ContextLens["context"]>,
  ) => update(lensId, { context: patch as ContextLens["context"] });

  const recordPersistence = (
    lensId: string | null | undefined,
    patch: Partial<ContextLens["persistence"]>,
  ) => update(lensId, { persistence: patch as ContextLens["persistence"] });

  const recordContextSource = (
    lensId: string | null | undefined,
    source: ContextLensSource,
  ) => {
    if (!lensId) { return null; }
    const existing = lenses.get(lensId);
    if (!existing) { return null; }
    const existingIndex = existing.context.sources.findIndex(
      (item) =>
        item.kind === source.kind &&
        item.label === source.label &&
        (item.sourceId ?? "") === (source.sourceId ?? ""),
    );
    const sources =
      existingIndex >= 0
        ? existing.context.sources.map((item, index) =>
          index === existingIndex ? { ...item, ...source } : item,
        )
        : [...existing.context.sources, source];
    return update(lensId, {
      context: {
        ...existing.context,
        sources,
      },
    });
  };

  const recordPersistenceEvent = (
    lensId: string | null | undefined,
    event: Omit<ContextLensPersistenceEvent, "at"> & { at?: number },
  ) => {
    if (!lensId) { return null; }
    const existing = lenses.get(lensId);
    if (!existing) { return null; }
    return update(lensId, {
      persistence: {
        ...existing.persistence,
        events: [...existing.persistence.events, { ...event, at: event.at ?? Date.now() }],
      },
    });
  };

  const recordLifecycle = (
    lensId: string | null | undefined,
    patch: Partial<ContextLens["lifecycle"]>,
  ) => update(lensId, { lifecycle: patch as ContextLens["lifecycle"] });

  const recordToolCall = (
    lensId: string | null | undefined,
    toolName: string,
    detail: { phase?: string; argumentSummary?: string } = {},
  ) => {
    if (!lensId || !toolName) { return null; }
    const existing = lenses.get(lensId);
    if (!existing) { return null; }
    const now = Date.now();
    const called = existing.tools.called.includes(toolName)
      ? existing.tools.called
      : [...existing.tools.called, toolName];
    const callIndex = existing.tools.callCount + 1;
    return update(lensId, {
      tools: {
        ...existing.tools,
        called,
        callCount: callIndex,
        lastStartedAt: now,
        runs: [
          ...existing.tools.runs,
          {
            id: `${toolName}-${callIndex}`,
            callIndex,
            name: toolName,
            ...(detail.phase ? { phase: detail.phase } : {}),
            startedAt: now,
            completedAt: null,
            durationMs: null,
            status: "running",
            ...(detail.argumentSummary ? { argumentSummary: detail.argumentSummary } : {}),
          },
        ],
      },
      lifecycle: {
        ...existing.lifecycle,
        firstToolStartedAt: existing.lifecycle.firstToolStartedAt ?? now,
      },
    });
  };

  const completeOpenToolRuns = (
    lensId: string | null | undefined,
    status: ContextLensToolRun["status"] = "completed",
    error?: unknown,
  ) => {
    if (!lensId) { return null; }
    const existing = lenses.get(lensId);
    if (!existing) { return null; }
    const now = Date.now();
    return update(lensId, {
      tools: {
        ...existing.tools,
        runs: existing.tools.runs.map((run) =>
          run.completedAt
            ? run
            : {
              ...run,
              completedAt: now,
              durationMs: now - run.startedAt,
              status,
              ...(error === undefined ? {} : { error: serializeError(error) }),
            },
        ),
      },
    });
  };

  const recordOutput = (
    lensId: string | null | undefined,
    output: ContextLensOutput,
  ) => {
    if (!lensId) { return null; }
    const existing = lenses.get(lensId);
    if (!existing) { return null; }
    return update(lensId, {
      outputs: [...existing.outputs, output],
    });
  };

  return {
    create,
    update,
    setStatus,
    recordContext,
    recordContextSource,
    recordPersistence,
    recordPersistenceEvent,
    recordLifecycle,
    recordToolCall,
    completeOpenToolRuns,
    recordOutput,
    get: (lensId: string) => {
      prune();
      const lens = lenses.get(lensId);
      return lens ? cloneLens(lens) : null;
    },
    listRecent: () => {
      prune();
      return [...lenses.values()].toSorted((a, b) => b.createdAt - a.createdAt).map(cloneLens);
    },
    destroy: (lensId: string) => lenses.delete(lensId),
    clear: () => lenses.clear(),
    prune,
  };
}
