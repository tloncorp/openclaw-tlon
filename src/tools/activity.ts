/**
 * tlon_activity - Check activity, notifications, and unreads
 */

import { Type, type Static } from "@sinclair/typebox";
import type { PluginApi } from "openclaw";
import { createToolClient, type TlonConfig } from "./urbit-client.js";

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

      async execute(_id, params: ActivityParamsType, ctx) {
        const config = ctx.config.channels?.tlon as TlonConfig | undefined;
        if (!config?.url || !config?.ship || !config?.code) {
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
              // Get recent mentions
              const result = await client.scry<ActivityStream>({
                app: "activity",
                path: `/v4/activity/mentions/newest/${limit}`,
              });
              const mentions = formatActivityStream(result);
              return { content: [{ type: "text", text: JSON.stringify(mentions, null, 2) }] };
            }

            case "all": {
              // Get all recent activity
              const result = await client.scry<ActivityStream>({
                app: "activity",
                path: `/v4/activity/all/newest/${limit}`,
              });
              const activity = formatActivityStream(result);
              return { content: [{ type: "text", text: JSON.stringify(activity, null, 2) }] };
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

function formatActivityStream(stream: ActivityStream) {
  const items = stream?.stream || [];
  return items.map((item) => ({
    type: item.type,
    source: item.source,
    time: item.time ? new Date(item.time).toISOString() : null,
    content: item.content,
  }));
}

interface ActivitySummary {
  [source: string]: { count: number; latest?: number };
}

interface ActivityStream {
  stream: Array<{
    type: string;
    source: string;
    time: number;
    content: unknown;
  }>;
}
