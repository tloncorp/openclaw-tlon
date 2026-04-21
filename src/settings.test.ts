import { describe, expect, it } from "vitest";
import { applySettingsUpdate, createSettingsManager, parseSettingsResponse } from "./settings.js";

describe("Settings: parseSettingsResponse", () => {
  it("parses lastOwnerMessageAt as number", () => {
    const result = parseSettingsResponse({
      tlon: { lastOwnerMessageAt: 1700000000000 },
    });
    expect(result.lastOwnerMessageAt).toBe(1700000000000);
  });

  it("ignores lastOwnerMessageAt when not a number", () => {
    expect(
      parseSettingsResponse({ tlon: { lastOwnerMessageAt: "not-a-number" } }).lastOwnerMessageAt,
    ).toBeUndefined();
    expect(
      parseSettingsResponse({ tlon: { lastOwnerMessageAt: true } }).lastOwnerMessageAt,
    ).toBeUndefined();
    expect(
      parseSettingsResponse({ tlon: { lastOwnerMessageAt: null } }).lastOwnerMessageAt,
    ).toBeUndefined();
    expect(
      parseSettingsResponse({ tlon: { lastOwnerMessageAt: { nested: 1 } } }).lastOwnerMessageAt,
    ).toBeUndefined();
  });

  it("handles missing lastOwnerMessageAt gracefully", () => {
    const result = parseSettingsResponse({ tlon: {} });
    expect(result.lastOwnerMessageAt).toBeUndefined();
  });

  it("returns empty object for empty/missing input", () => {
    expect(parseSettingsResponse(null)).toEqual({});
    expect(parseSettingsResponse(undefined)).toEqual({});
    expect(parseSettingsResponse({})).toEqual({});
  });

  it("parses lastOwnerMessageAt alongside other fields", () => {
    const result = parseSettingsResponse({
      tlon: {
        dmAllowlist: ["~zod"],
        ownerShip: "~sampel-palnet",
        lastOwnerMessageAt: 1700000000000,
      },
    });
    expect(result.dmAllowlist).toEqual(["~zod"]);
    expect(result.ownerShip).toBe("~sampel-palnet");
    expect(result.lastOwnerMessageAt).toBe(1700000000000);
  });

  it("parses lastNudgeStage when it is 1, 2, or 3", () => {
    expect(parseSettingsResponse({ tlon: { lastNudgeStage: 1 } }).lastNudgeStage).toBe(1);
    expect(parseSettingsResponse({ tlon: { lastNudgeStage: "2" } }).lastNudgeStage).toBe(2);
    expect(parseSettingsResponse({ tlon: { lastNudgeStage: 3 } }).lastNudgeStage).toBe(3);
  });

  it("ignores invalid lastNudgeStage values", () => {
    expect(parseSettingsResponse({ tlon: { lastNudgeStage: 0 } }).lastNudgeStage).toBeUndefined();
    expect(parseSettingsResponse({ tlon: { lastNudgeStage: 4 } }).lastNudgeStage).toBeUndefined();
    expect(
      parseSettingsResponse({ tlon: { lastNudgeStage: "not-a-stage" } }).lastNudgeStage,
    ).toBeUndefined();
  });

  describe("parsePendingNudge", () => {
    it("parses the new shape without LLM fields", () => {
      const json = JSON.stringify({
        sentAt: 123,
        stage: 2,
        ownerShip: "~zod",
        accountId: "default",
        content: "hey",
      });
      const result = parseSettingsResponse({ tlon: { pendingNudge: json } });
      expect(result.pendingNudge).toEqual({
        sentAt: 123,
        stage: 2,
        ownerShip: "~zod",
        accountId: "default",
        content: "hey",
      });
    });

    it("tolerates legacy records with sessionKey/provider/model", () => {
      const json = JSON.stringify({
        sentAt: 123,
        stage: 1,
        ownerShip: "~zod",
        accountId: "default",
        sessionKey: "old-sess",
        provider: "anthropic",
        model: "claude-3",
      });
      const result = parseSettingsResponse({ tlon: { pendingNudge: json } });
      expect(result.pendingNudge).toEqual({
        sentAt: 123,
        stage: 1,
        ownerShip: "~zod",
        accountId: "default",
      });
      expect(result.pendingNudge).not.toHaveProperty("sessionKey");
      expect(result.pendingNudge).not.toHaveProperty("provider");
      expect(result.pendingNudge).not.toHaveProperty("model");
    });

    it("tolerates missing content field", () => {
      const json = JSON.stringify({
        sentAt: 123,
        stage: 1,
        ownerShip: "~zod",
        accountId: "default",
      });
      const result = parseSettingsResponse({ tlon: { pendingNudge: json } });
      expect(result.pendingNudge?.content).toBeUndefined();
    });
  });

  describe("nudgeActiveHours*", () => {
    it("parses all three keys as strings", () => {
      const result = parseSettingsResponse({
        tlon: {
          nudgeActiveHoursStart: "09:00",
          nudgeActiveHoursEnd: "21:00",
          nudgeActiveHoursTimezone: "America/New_York",
        },
      });
      expect(result.nudgeActiveHoursStart).toBe("09:00");
      expect(result.nudgeActiveHoursEnd).toBe("21:00");
      expect(result.nudgeActiveHoursTimezone).toBe("America/New_York");
    });

    it("ignores non-string values", () => {
      const result = parseSettingsResponse({
        tlon: { nudgeActiveHoursStart: 900, nudgeActiveHoursEnd: null },
      });
      expect(result.nudgeActiveHoursStart).toBeUndefined();
      expect(result.nudgeActiveHoursEnd).toBeUndefined();
    });
  });
});

describe("Settings: applySettingsUpdate", () => {
  it("updates lastOwnerMessageAt with number value", () => {
    const result = applySettingsUpdate({}, "lastOwnerMessageAt", 1700000000000);
    expect(result.lastOwnerMessageAt).toBe(1700000000000);
  });

  it("clears lastOwnerMessageAt with non-number value", () => {
    const base = { lastOwnerMessageAt: 1700000000000 };
    expect(
      applySettingsUpdate(base, "lastOwnerMessageAt", "string").lastOwnerMessageAt,
    ).toBeUndefined();
    expect(
      applySettingsUpdate(base, "lastOwnerMessageAt", null).lastOwnerMessageAt,
    ).toBeUndefined();
    expect(
      applySettingsUpdate(base, "lastOwnerMessageAt", undefined).lastOwnerMessageAt,
    ).toBeUndefined();
  });

  it("preserves other fields when updating lastOwnerMessageAt", () => {
    const base = { dmAllowlist: ["~zod"], ownerShip: "~sampel-palnet" };
    const result = applySettingsUpdate(base, "lastOwnerMessageAt", 1700000000000);
    expect(result.dmAllowlist).toEqual(["~zod"]);
    expect(result.ownerShip).toBe("~sampel-palnet");
    expect(result.lastOwnerMessageAt).toBe(1700000000000);
  });

  it("does not modify original object", () => {
    const base = { lastOwnerMessageAt: 1700000000000 };
    const result = applySettingsUpdate(base, "lastOwnerMessageAt", 1800000000000);
    expect(base.lastOwnerMessageAt).toBe(1700000000000);
    expect(result.lastOwnerMessageAt).toBe(1800000000000);
  });

  it("updates lastNudgeStage with valid values only", () => {
    expect(applySettingsUpdate({}, "lastNudgeStage", 1).lastNudgeStage).toBe(1);
    expect(applySettingsUpdate({}, "lastNudgeStage", "2").lastNudgeStage).toBe(2);
    expect(applySettingsUpdate({}, "lastNudgeStage", 4).lastNudgeStage).toBeUndefined();
  });

  it("updates nudgeActiveHours* keys with string values", () => {
    expect(applySettingsUpdate({}, "nudgeActiveHoursStart", "09:00").nudgeActiveHoursStart).toBe(
      "09:00",
    );
    expect(applySettingsUpdate({}, "nudgeActiveHoursEnd", "21:00").nudgeActiveHoursEnd).toBe(
      "21:00",
    );
    expect(
      applySettingsUpdate({}, "nudgeActiveHoursTimezone", "UTC").nudgeActiveHoursTimezone,
    ).toBe("UTC");
  });

  it("clears nudgeActiveHours* keys when value is not a string", () => {
    const base = { nudgeActiveHoursStart: "09:00" };
    expect(
      applySettingsUpdate(base, "nudgeActiveHoursStart", 42).nudgeActiveHoursStart,
    ).toBeUndefined();
  });
});

describe("Settings: createSettingsManager.load", () => {
  it("preserves the last good snapshot when a later load fails", async () => {
    let callCount = 0;
    const manager = createSettingsManager(
      {
        scry: async () => {
          callCount += 1;
          if (callCount === 1) {
            return {
              all: {
                moltbot: {
                  tlon: {
                    ownerShip: "~zod",
                    dmAllowlist: ["~nec"],
                  },
                },
              },
            };
          }
          throw new Error("temporary outage");
        },
      } as never,
      { log: () => undefined },
    );

    await expect(manager.load()).resolves.toEqual({
      settings: { ownerShip: "~zod", dmAllowlist: ["~nec"] },
      fresh: true,
    });
    await expect(manager.load()).resolves.toEqual({
      settings: { ownerShip: "~zod", dmAllowlist: ["~nec"] },
      fresh: false,
    });
    expect(manager.current).toEqual({
      ownerShip: "~zod",
      dmAllowlist: ["~nec"],
    });
  });

  it("returns an empty snapshot on the first load failure", async () => {
    const manager = createSettingsManager(
      {
        scry: async () => {
          throw new Error("desk unavailable");
        },
      } as never,
      { log: () => undefined },
    );

    await expect(manager.load()).resolves.toEqual({
      settings: {},
      fresh: false,
    });
    expect(manager.current).toEqual({});
  });
});
