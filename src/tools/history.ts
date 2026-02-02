/**
 * tlon_history - Fetch message history from channels/DMs
 */

import { Type, type Static } from "@sinclair/typebox";
import type { PluginApi } from "openclaw";
import { extractMessageText } from "../monitor/utils.js";
import { createToolClient } from "./urbit-client.js";
import { getTlonConfig } from "./index.js";

type ToolOptions = { optional: boolean };

const HistoryParams = Type.Object({
  target: Type.String({
    description: "Channel nest (chat/~host/name) or ship for DM (~ship)",
  }),
  limit: Type.Optional(
    Type.Number({
      default: 20,
      minimum: 1,
      maximum: 100,
      description: "Number of messages to fetch",
    }),
  ),
});

type HistoryParamsType = Static<typeof HistoryParams>;

export function registerHistoryTools(api: PluginApi, opts: ToolOptions) {
  api.registerTool(
    {
      name: "tlon_history",
      description:
        "Fetch message history from a Tlon channel or DM. Provide channel nest (chat/~host/name) or ship (~ship) for DM.",
      parameters: HistoryParams,

      async execute(_id, params: HistoryParamsType) {
        const config = getTlonConfig();
        if (!config) {
          return {
            content: [{ type: "text", text: "Error: Tlon not configured (need url, ship, code)" }],
          };
        }

        const client = await createToolClient(config);

        const limit = params.limit || 20;
        const target = params.target;

        try {
          // Detect if target is a DM (starts with ~) or channel
          const isDm = target.startsWith("~") && !target.includes("/");

          if (isDm) {
            // DM history
            const ship = target.startsWith("~") ? target : `~${target}`;
            const result = await client.scry<DmHistoryResponse>({
              app: "chat",
              path: `/dm/${ship}/writs/newest/${limit}/outline`,
            });

            const messages = formatDmMessages(result, ship);
            return {
              content: [{ type: "text", text: JSON.stringify(messages, null, 2) }],
            };
          } else {
            // Channel history
            const result = await client.scry<ChannelHistoryResponse>({
              app: "channels",
              path: `/v4/channels/${target}/posts/newest/${limit}/outline`,
            });

            const messages = formatChannelMessages(result, target);
            return {
              content: [{ type: "text", text: JSON.stringify(messages, null, 2) }],
            };
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          return { content: [{ type: "text", text: `Error fetching history: ${msg}` }] };
        }
      },
    },
    opts,
  );
}

function formatChannelMessages(response: ChannelHistoryResponse, nest: string) {
  const posts = response?.posts || [];
  return posts.map((post) => {
    const seal = post.seal;
    const essay = post.essay;
    return {
      id: seal?.id,
      author: essay?.author,
      time: essay?.sent ? new Date(essay.sent).toISOString() : null,
      content: extractMessageText(essay?.content || []),
      replyCount: seal?.meta?.replyCount || 0,
      channel: nest,
    };
  });
}

function formatDmMessages(response: DmHistoryResponse, ship: string) {
  const writs = response?.writs || [];
  return writs.map((writ) => {
    const seal = writ.seal;
    const memo = writ.memo;
    return {
      id: seal?.id,
      author: memo?.author,
      time: memo?.sent ? new Date(memo.sent).toISOString() : null,
      content: extractMessageText(memo?.content || []),
      dm: ship,
    };
  });
}

interface ChannelHistoryResponse {
  posts: Array<{
    seal: { id: string; meta?: { replyCount?: number } };
    essay: { author: string; sent: number; content: unknown[] };
  }>;
}

interface DmHistoryResponse {
  writs: Array<{
    seal: { id: string };
    memo: { author: string; sent: number; content: unknown[] };
  }>;
}
