/**
 * tlon_channels - List and discover channels/groups
 */

import { Type, type Static } from "@sinclair/typebox";
import type { PluginApi } from "openclaw";
import { createToolClient } from "./urbit-client.js";
import { getTlonConfig } from "./index.js";

type ToolOptions = { optional: boolean };

const ChannelsParams = Type.Object({
  action: Type.Union([
    Type.Literal("list"),
    Type.Literal("groups"),
    Type.Literal("dms"),
    Type.Literal("info"),
  ]),
  channel: Type.Optional(Type.String({ description: "Channel nest for 'info' action" })),
});

type ChannelsParamsType = Static<typeof ChannelsParams>;

export function registerChannelsTools(api: PluginApi, opts: ToolOptions) {
  api.registerTool(
    {
      name: "tlon_channels",
      description:
        "List Tlon channels, groups, or DMs. Use 'list' for all channels, 'groups' for groups only, 'dms' for DM conversations, 'info' for channel details.",
      parameters: ChannelsParams,

      async execute(_id, params: ChannelsParamsType) {
        const config = getTlonConfig();
        if (!config) {
          return { content: [{ type: "text", text: "Error: Tlon not configured" }] };
        }

        const client = await createToolClient(config);

        try {
          switch (params.action) {
            case "list": {
              // v2/channels returns channels directly as keys, not under a channels property
              const result = await client.scry<Record<string, unknown>>({
                app: "channels",
                path: "/v2/channels",
              });
              const channels = Object.keys(result || {}).map((nest) => ({
                nest,
                kind: nest.split("/")[0],
              }));
              return { content: [{ type: "text", text: JSON.stringify(channels, null, 2) }] };
            }

            case "groups": {
              const result = await client.scry<GroupsResponse>({
                app: "groups",
                path: "/groups",
              });
              const groups = Object.keys(result || {}).map((flag) => ({ flag }));
              return { content: [{ type: "text", text: JSON.stringify(groups, null, 2) }] };
            }

            case "dms": {
              const result = await client.scry<string[]>({
                app: "chat",
                path: "/dm",
              });
              // Result is an array of ship names
              const dms = (result || []).map((ship: string) => ({ ship }));
              return { content: [{ type: "text", text: JSON.stringify(dms, null, 2) }] };
            }

            case "info": {
              if (!params.channel) {
                return { content: [{ type: "text", text: "Error: channel required for 'info'" }] };
              }
              const result = await client.scry<ChannelInfo>({
                app: "channels",
                path: `/v2/channels/${params.channel}`,
              });
              return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
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

interface GroupsResponse {
  [flag: string]: unknown;
}
interface ChannelInfo {
  nest: string;
  meta?: { title?: string; description?: string };
}
