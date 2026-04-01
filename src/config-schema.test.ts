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

  it("accepts opt-in telemetry configuration", () => {
    const parsed = TlonConfigSchema.parse({
      telemetry: {
        enabled: true,
        apiKey: "phc_base",
        host: "https://us.i.posthog.com",
      },
      accounts: {
        hosted: {
          ship: "~zod",
          url: "https://example.com",
          code: "code-123",
          telemetry: {
            enabled: true,
            apiKey: "phc_account",
          },
        },
      },
    });

    expect(parsed.telemetry?.enabled).toBe(true);
    expect(parsed.accounts?.hosted?.telemetry?.apiKey).toBe("phc_account");
  });
});
