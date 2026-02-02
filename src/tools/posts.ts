/**
 * tlon_react / tlon_post - Post interactions (react, edit, delete)
 */

import { Type, type Static } from "@sinclair/typebox";
import type { PluginApi } from "openclaw";
import { markdownToStory } from "../urbit/story.js";
import { createToolClient, type TlonConfig } from "./urbit-client.js";

type ToolOptions = { optional: boolean };

// --- tlon_react ---

const ReactParams = Type.Object({
  action: Type.Union([Type.Literal("add"), Type.Literal("remove")]),
  channel: Type.String({ description: "Channel nest (chat/~host/name)" }),
  postId: Type.String({ description: "Post ID (@ud format with dots)" }),
  emoji: Type.Optional(Type.String({ description: "Emoji for 'add' action" })),
});

type ReactParamsType = Static<typeof ReactParams>;

// --- tlon_post ---

const PostParams = Type.Object({
  action: Type.Union([Type.Literal("edit"), Type.Literal("delete")]),
  channel: Type.String({ description: "Channel nest" }),
  postId: Type.String({ description: "Post ID" }),
  content: Type.Optional(Type.String({ description: "New content for edit (markdown)" })),
  title: Type.Optional(Type.String({ description: "New title for notebook posts" })),
});

type PostParamsType = Static<typeof PostParams>;

export function registerPostTools(api: PluginApi, opts: ToolOptions) {
  // tlon_react
  api.registerTool(
    {
      name: "tlon_react",
      description: "Add or remove emoji reactions on Tlon posts",
      parameters: ReactParams,

      async execute(_id, params: ReactParamsType, ctx) {
        const config = ctx.config.channels?.tlon as TlonConfig | undefined;
        if (!config?.url || !config?.ship || !config?.code) {
          return { content: [{ type: "text", text: "Error: Tlon not configured" }] };
        }

        const client = await createToolClient(config);

        const formattedId = formatUd(extractNumericId(params.postId));
        const ship = client.ship;

        try {
          if (params.action === "add") {
            if (!params.emoji) {
              return { content: [{ type: "text", text: "Error: emoji required for 'add'" }] };
            }
            await client.poke({
              app: "channels",
              mark: "channel-action-1",
              json: {
                channel: {
                  nest: params.channel,
                  action: {
                    post: {
                      "add-react": {
                        id: formattedId,
                        react: params.emoji,
                        ship,
                      },
                    },
                  },
                },
              },
            });
            return { content: [{ type: "text", text: `Added ${params.emoji} reaction` }] };
          } else {
            await client.poke({
              app: "channels",
              mark: "channel-action-1",
              json: {
                channel: {
                  nest: params.channel,
                  action: {
                    post: {
                      "del-react": {
                        id: formattedId,
                        ship,
                      },
                    },
                  },
                },
              },
            });
            return { content: [{ type: "text", text: "Removed reaction" }] };
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          return { content: [{ type: "text", text: `Error: ${msg}` }] };
        }
      },
    },
    opts,
  );

  // tlon_post
  api.registerTool(
    {
      name: "tlon_post",
      description: "Edit or delete Tlon posts",
      parameters: PostParams,

      async execute(_id, params: PostParamsType, ctx) {
        const config = ctx.config.channels?.tlon as TlonConfig | undefined;
        if (!config?.url || !config?.ship || !config?.code) {
          return { content: [{ type: "text", text: "Error: Tlon not configured" }] };
        }

        const client = await createToolClient(config);

        const formattedId = formatUd(extractNumericId(params.postId));

        try {
          if (params.action === "delete") {
            await client.poke({
              app: "channels",
              mark: "channel-action-1",
              json: {
                channel: {
                  nest: params.channel,
                  action: {
                    post: {
                      del: formattedId,
                    },
                  },
                },
              },
            });
            return { content: [{ type: "text", text: "Post deleted" }] };
          } else {
            if (!params.content) {
              return { content: [{ type: "text", text: "Error: content required for edit" }] };
            }

            const story = markdownToStory(params.content);
            const kind = params.channel.startsWith("diary/")
              ? "/diary"
              : params.channel.startsWith("heap/")
                ? "/heap"
                : "/chat";

            await client.poke({
              app: "channels",
              mark: "channel-action-1",
              json: {
                channel: {
                  nest: params.channel,
                  action: {
                    post: {
                      edit: {
                        id: formattedId,
                        essay: {
                          content: story,
                          author: client.ship,
                          sent: Date.now(),
                          kind,
                          blob: null,
                          meta: params.title
                            ? { title: params.title, description: "", image: "", cover: "" }
                            : null,
                        },
                      },
                    },
                  },
                },
              },
            });
            return { content: [{ type: "text", text: "Post edited" }] };
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

// Helper: Extract numeric part from post ID
function extractNumericId(id: string): string {
  const slash = id.indexOf("/");
  return slash >= 0 ? id.slice(slash + 1) : id;
}

// Helper: Format as @ud (dots every 3 digits)
function formatUd(id: string): string {
  const clean = id.replace(/\./g, "");
  const parts: string[] = [];
  for (let i = clean.length; i > 0; i -= 3) {
    parts.unshift(clean.slice(Math.max(0, i - 3), i));
  }
  return parts.join(".");
}
