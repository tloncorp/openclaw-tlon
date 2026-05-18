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
  | "dispatching"
  | "delivering"
  | "done"
  | "error";

export type ContextLens = {
  lensId: string;
  messageId: string;
  sessionKeyHash: string | null;
  chatType: "dm" | "channel";
  trigger: ContextLensTrigger;
  model: string | null;
  provider: string | null;
  context: {
    currentMessage: boolean;
    threadMessages: number;
    channelMessages: number;
    citedPosts: number;
    attachments: number;
    pendingNudge: boolean;
  };
  persistence: {
    postsReply: boolean;
    updatesSettings: boolean;
    writesMedia: boolean;
    emitsTelemetry: boolean;
    cachesHistory: boolean;
  };
  tools: {
    ownerOnlyAvailable: string[];
    called: string[];
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
    context: { ...lens.context },
    persistence: { ...lens.persistence },
    tools: {
      ownerOnlyAvailable: [...lens.tools.ownerOnlyAvailable],
      called: [...lens.tools.called],
    },
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
      const oldest = lenses.keys().next().value as string | undefined;
      if (!oldest) break;
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
      model: null,
      provider: null,
      context: {
        currentMessage: true,
        threadMessages: 0,
        channelMessages: 0,
        citedPosts: 0,
        attachments: 0,
        pendingNudge: false,
      },
      persistence: {
        postsReply: false,
        updatesSettings: false,
        writesMedia: false,
        emitsTelemetry: false,
        cachesHistory: false,
      },
      tools: {
        ownerOnlyAvailable: [],
        called: [],
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
    if (!lensId) return null;
    const existing = lenses.get(lensId);
    if (!existing) return null;

    const next: ContextLens = {
      ...existing,
      ...patch,
      context: { ...existing.context, ...patch.context },
      persistence: { ...existing.persistence, ...patch.persistence },
      tools: { ...existing.tools, ...patch.tools },
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

  const recordToolCall = (lensId: string | null | undefined, toolName: string) => {
    if (!lensId || !toolName) return null;
    const existing = lenses.get(lensId);
    if (!existing) return null;
    const called = existing.tools.called.includes(toolName)
      ? existing.tools.called
      : [...existing.tools.called, toolName];
    return update(lensId, { tools: { ...existing.tools, called } });
  };

  return {
    create,
    update,
    setStatus,
    recordContext,
    recordPersistence,
    recordToolCall,
    get: (lensId: string) => {
      prune();
      const lens = lenses.get(lensId);
      return lens ? cloneLens(lens) : null;
    },
    listRecent: () => {
      prune();
      return [...lenses.values()]
        .sort((a, b) => b.createdAt - a.createdAt)
        .map(cloneLens);
    },
    destroy: (lensId: string) => lenses.delete(lensId),
    clear: () => lenses.clear(),
    prune,
  };
}
