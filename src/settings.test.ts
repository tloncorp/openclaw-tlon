import { describe, expect, it } from "vitest";
import { parseSettingsResponse, applySettingsUpdate } from "./settings.js";

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
});
