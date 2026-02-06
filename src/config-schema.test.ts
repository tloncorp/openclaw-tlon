import { describe, expect, it } from "vitest";
import { TlonAuthorizationSchema, TlonConfigSchema } from "./config-schema.js";

describe("Tlon config schema", () => {
  it("accepts channelRules with string keys", () => {
    const parsed = TlonAuthorizationSchema.parse({
      channelRules: {
        "chat/~zod/test": {
          mode: "open",
          allowedShips: ["~zod"],
        },
      },
    });

    expect(parsed.channelRules?.["chat/~zod/test"]?.mode).toBe("open");
  });

  it("accepts accounts with string keys", () => {
    const parsed = TlonConfigSchema.parse({
      accounts: {
        primary: {
          ship: "~zod",
          url: "https://example.com",
          code: "code-123",
        },
      },
    });

    expect(parsed.accounts?.primary?.ship).toBe("~zod");
  });

  it("accepts group activity config", () => {
    const parsed = TlonConfigSchema.parse({
      groupActivity: {
        enabled: true,
        target: "~zod",
        events: {
          "group-join": true,
          "group-ask": true,
        },
        format: "emoji",
        batchWindowMs: 5000,
        rateLimitPerMinute: 10,
      },
    });

    expect(parsed.groupActivity?.enabled).toBe(true);
    expect(parsed.groupActivity?.events?.["group-join"]).toBe(true);
  });
});
