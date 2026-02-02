/**
 * tlon_activity - Check activity, notifications, and unreads
 */

import { Type, type Static } from "@sinclair/typebox";
import type { PluginApi } from "openclaw";
import { createToolClient } from "./urbit-client.js";
import { getTlonConfig } from "./index.js";

type ToolOptions = { optional: boolean };

const ActivityParams = Type.Object({
  action: Type.Union([
    Type.Literal("unread"),
    Type.Literal("mentions"),
    Type.Literal("all"),
  ]),
  limit: Type.Optional(Type.Number({ default: 20, minimum: 1, maximum: 100 })),
});

type ActivityParamsType = Static<typeof ActivityParams>;

export function registerActivityTools(api: PluginApi, opts: ToolOptions) {
  api.registerTool(
    {
      name: "tlon_activity",
      description:
        "Check Tlon activity: 'unread' for unread counts, 'mentions' for recent mentions, 'all' for all activity.",
      parameters: ActivityParams,

      async execute(_id, params: ActivityParamsType) {
        const config = getTlonConfig();
        if (!config) {
          return { content: [{ type: "text", text: "Error: Tlon not configured" }] };
        }

        const client = await createToolClient(config);
        const limit = params.limit || 20;

        try {
          switch (params.action) {
            case "unread": {
              // Get unread summary from activity
              const result = await client.scry<ActivitySummary>({
                app: "activity",
                path: "/v4/activity/unreads",
              });
              return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
            }

            case "mentions": {
              // Get activity feed with mentions
              const result = await client.scry<ActivityFeedResponse>({
                app: "activity",
                path: `/v5/feed/init/${limit}`,
              });
              return { content: [{ type: "text", text: JSON.stringify(result?.mentions || [], null, 2) }] };
            }

            case "all": {
              // Get all activity feed
              const result = await client.scry<ActivityFeedResponse>({
                app: "activity",
                path: `/v5/feed/init/${limit}`,
              });
              return { content: [{ type: "text", text: JSON.stringify(result?.all || [], null, 2) }] };
            }

            default:
              return { content: [{ type: "text", text: `Unknown action: ${String(params.action)}` }] };
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          return { content: [{ type: "text", text: `Error: ${msg}` }] };
        }
      },
    },
    opts,
  );
}

interface ActivityFeedResponse {
  all: unknown[];
  mentions: unknown[];
  replies: unknown[];
  summaries: unknown;
}
