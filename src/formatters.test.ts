import { describe, expect, it } from "vitest";
import { formatGroupActivityEvents, formatGroupFlag } from "./formatters.js";
import type { NormalizedGroupActivityEvent } from "./types.js";

describe("formatters", () => {
  it("formats group flags consistently", () => {
    expect(formatGroupFlag("zod/test")).toBe("~zod/test");
    expect(formatGroupFlag("~nec/test")).toBe("~nec/test");
  });

  it("formats single group-ask with action needed", () => {
    const events: NormalizedGroupActivityEvent[] = [
      { type: "group-ask", group: "~zod/test", ship: "~bus" },
    ];
    const msg = formatGroupActivityEvents(events, "plain");
    expect(msg).toContain("Action needed");
    expect(msg).toContain("~bus");
    expect(msg).toContain("~zod/test");
  });

  it("formats batched group-join", () => {
    const events: NormalizedGroupActivityEvent[] = [
      { type: "group-join", group: "~zod/test", ship: "~bus" },
      { type: "group-join", group: "~zod/test", ship: "~nec" },
    ];
    const msg = formatGroupActivityEvents(events, "plain");
    expect(msg).toContain("2 members joined");
    expect(msg).toContain("~bus");
    expect(msg).toContain("~nec");
  });
});
