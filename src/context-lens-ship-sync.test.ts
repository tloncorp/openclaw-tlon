import type { OpenClawConfig } from "openclaw/plugin-sdk/core";
import { describe, expect, it } from "vitest";

import { createContextLensRegistry, type ContextLens } from "./context-lens.js";
import type { ContextLensEvent } from "./context-lens-events.js";
import {
  buildLensRunPayload,
  createContextLensShipSync,
  resolveLensOwners,
} from "./context-lens-ship-sync.js";
import type { SharedApiClientParams } from "./gateway-status.js";

function makeLens(overrides: Partial<ContextLens> = {}): ContextLens {
  const registry = createContextLensRegistry({ ttlMs: 60_000 });
  const lens = registry.create({
    messageId: "msg-1",
    chatType: "dm",
    trigger: "dm",
  });
  return { ...lens, ...overrides };
}

function makeEvent(lens: ContextLens): ContextLensEvent {
  return { seq: 1, at: Date.now(), phase: "status", lens };
}

type RecordedPoke = { app: string; mark: string; json: unknown };

function makeParams(pokes: RecordedPoke[]): SharedApiClientParams {
  return {
    poke: (params) => {
      pokes.push(params as RecordedPoke);
      return Promise.resolve(undefined);
    },
    shipName: "~zod",
    shipUrl: "http://localhost:8080",
  };
}

const silentLogger = { info: () => {}, warn: () => {} };

describe("resolveLensOwners", () => {
  function makeConfig(tlon: Record<string, unknown>): OpenClawConfig {
    return { channels: { tlon: { ship: "~zod", ...tlon } } } as OpenClawConfig;
  }

  it("normalizes and dedupes configured owners", () => {
    const owners = resolveLensOwners(
      makeConfig({ contextLens: { owners: ["bus", "~bus", "~dev"] } }),
    );
    expect(owners).toEqual(["~bus", "~dev"]);
  });

  it("falls back to ownerShip when owners is empty", () => {
    expect(
      resolveLensOwners(makeConfig({ ownerShip: "dev", contextLens: {} })),
    ).toEqual(["~dev"]);
    expect(resolveLensOwners(makeConfig({ contextLens: {} }))).toEqual([]);
  });
});

describe("buildLensRunPayload", () => {
  it("wraps the lens with a schemaVersion", () => {
    const lens = makeLens();
    const payload = buildLensRunPayload(lens);
    expect(payload.schemaVersion).toBe(1);
    expect((payload.lens as ContextLens).lensId).toBe(lens.lensId);
  });

  it("truncates oversized tool summaries", () => {
    const lens = makeLens();
    lens.tools.runs = [
      {
        id: "t-1",
        callIndex: 1,
        name: "browser",
        startedAt: Date.now(),
        completedAt: Date.now(),
        durationMs: 5,
        status: "completed",
        argumentSummary: "x".repeat(10_000),
        resultSummary: "ok",
      },
    ];
    const payload = buildLensRunPayload(lens);
    const run = (payload.lens as ContextLens).tools.runs[0];
    expect(run.argumentSummary?.length).toBeLessThan(5_000);
    expect(run.argumentSummary).toContain("[truncated]");
    expect(run.resultSummary).toBe("ok");
  });

  it("drops bulky arrays when the payload exceeds the total cap", () => {
    const lens = makeLens();
    lens.tools.runs = Array.from({ length: 100 }, (_, i) => ({
      id: `t-${i}`,
      callIndex: i + 1,
      name: "browser",
      startedAt: Date.now(),
      completedAt: Date.now(),
      durationMs: 5,
      status: "completed" as const,
      argumentSummary: "y".repeat(4_000),
    }));
    const payload = buildLensRunPayload(lens);
    expect(payload.truncated).toBe(true);
    expect((payload.lens as ContextLens).tools.runs).toEqual([]);
    expect((payload.lens as ContextLens).status).toBe(lens.status);
    expect(JSON.stringify(payload).length).toBeLessThan(50 * 1_024);
  });
});

describe("createContextLensShipSync", () => {
  it("configures owners once, then pokes run milestones and finals", async () => {
    const pokes: RecordedPoke[] = [];
    const params = makeParams(pokes);
    const sync = createContextLensShipSync({
      owners: ["~bus"],
      logger: silentLogger,
      getParams: () => params,
    });

    const lens = makeLens({ status: "dispatching" });
    sync.handleEvent(makeEvent(lens));
    sync.handleEvent(makeEvent({ ...lens, status: "tool_running" }));
    sync.handleEvent(makeEvent({ ...lens, status: "completed" }));
    await sync.flush();

    expect(pokes.map((p) => Object.keys(p.json as object)[0])).toEqual([
      "configure",
      "run-event",
      "run-event",
      "run-final",
    ]);
    expect(pokes.every((p) => p.app === "lens" && p.mark === "lens-action-1")).toBe(true);
    expect(pokes[0].json).toEqual({ configure: { owners: ["~bus"] } });
    const final = pokes[3].json as { "run-final": { id: string; payload: unknown } };
    expect(final["run-final"].id).toBe(lens.lensId);
  });

  it("skips repeat events with an unchanged status", async () => {
    const pokes: RecordedPoke[] = [];
    const params = makeParams(pokes);
    const sync = createContextLensShipSync({
      owners: ["~bus"],
      logger: silentLogger,
      getParams: () => params,
    });

    const lens = makeLens({ status: "tool_running" });
    sync.handleEvent(makeEvent(lens));
    sync.handleEvent(makeEvent(lens));
    sync.handleEvent(makeEvent(lens));
    await sync.flush();

    expect(pokes).toHaveLength(2); // configure + one run-event
  });

  it("ignores internal-visibility runs", async () => {
    const pokes: RecordedPoke[] = [];
    const params = makeParams(pokes);
    const sync = createContextLensShipSync({
      owners: ["~bus"],
      logger: silentLogger,
      getParams: () => params,
    });

    sync.handleEvent(makeEvent(makeLens({ visibility: "internal", status: "completed" })));
    await sync.flush();

    expect(pokes).toHaveLength(0);
  });

  it("drops events while no api params are published, without buffering", async () => {
    const pokes: RecordedPoke[] = [];
    const params = makeParams(pokes);
    let connected = false;
    const sync = createContextLensShipSync({
      owners: ["~bus"],
      logger: silentLogger,
      getParams: () => (connected ? params : null),
    });

    sync.handleEvent(makeEvent(makeLens({ status: "completed" })));
    await sync.flush();
    expect(pokes).toHaveLength(0);

    connected = true;
    sync.handleEvent(makeEvent(makeLens({ status: "completed" })));
    await sync.flush();
    expect(pokes.map((p) => Object.keys(p.json as object)[0])).toEqual([
      "configure",
      "run-final",
    ]);
  });

  it("re-configures after a poke failure and on params instance change", async () => {
    const pokes: RecordedPoke[] = [];
    let fail = true;
    const flaky: SharedApiClientParams = {
      poke: (params) => {
        if (fail) {
          fail = false;
          return Promise.reject(new Error("ship offline"));
        }
        pokes.push(params as RecordedPoke);
        return Promise.resolve(undefined);
      },
      shipName: "~zod",
      shipUrl: "http://localhost:8080",
    };
    let current = flaky;
    const warnings: string[] = [];
    const sync = createContextLensShipSync({
      owners: ["~bus"],
      logger: { info: () => {}, warn: (m) => warnings.push(m) },
      getParams: () => current,
    });

    // First final: configure poke rejects, run poke never sent.
    sync.handleEvent(makeEvent(makeLens({ status: "completed" })));
    await sync.flush();
    expect(warnings.join("\n")).toContain("poke failed");
    expect(pokes).toHaveLength(0);

    // Second final: configure retried (now succeeding), then the run poke.
    sync.handleEvent(makeEvent(makeLens({ status: "completed" })));
    await sync.flush();
    expect(pokes.map((p) => Object.keys(p.json as object)[0])).toEqual([
      "configure",
      "run-final",
    ]);

    // New params instance (monitor restart): configure re-asserted.
    current = makeParams(pokes);
    sync.handleEvent(makeEvent(makeLens({ status: "completed" })));
    await sync.flush();
    expect(pokes.map((p) => Object.keys(p.json as object)[0])).toEqual([
      "configure",
      "run-final",
      "configure",
      "run-final",
    ]);
  });
});
