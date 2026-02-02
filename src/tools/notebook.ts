/**
 * tlon_notebook - Create posts in notebook/diary channels
 */

import { Type, type Static } from "@sinclair/typebox";
import type { PluginApi } from "openclaw";
import { markdownToStory } from "../urbit/story.js";
import { scot, da } from "@urbit/aura";
import { createToolClient } from "./urbit-client.js";
import { getTlonConfig } from "./index.js";

type ToolOptions = { optional: boolean };

const NotebookParams = Type.Object({
  channel: Type.String({ description: "Diary channel (diary/~host/name)" }),
  title: Type.String({ description: "Post title" }),
  content: Type.String({ description: "Post content (markdown)" }),
  image: Type.Optional(Type.String({ description: "Cover image URL" })),
});

type NotebookParamsType = Static<typeof NotebookParams>;

export function registerNotebookTools(api: PluginApi, opts: ToolOptions) {
  api.registerTool(
    {
      name: "tlon_notebook",
      description:
        "Create a post in a Tlon notebook/diary channel. Requires channel (diary/~host/name), title, and content.",
      parameters: NotebookParams,

      async execute(_id, params: NotebookParamsType) {
        const config = getTlonConfig();
        if (!config) {
          return { content: [{ type: "text", text: "Error: Tlon not configured" }] };
        }

        const client = await createToolClient(config);

        // Validate it's a diary channel
        if (!params.channel.startsWith("diary/")) {
          return {
            content: [{ type: "text", text: "Error: channel must be a diary (diary/~host/name)" }],
          };
        }

        try {
          const sent = Date.now();
          const story = markdownToStory(params.content);
          const idUd = scot("ud", da.fromUnix(sent));
          const id = `${client.ship}/${idUd}`;

          // Essay goes directly in add, not wrapped
          await client.poke({
            app: "channels",
            mark: "channel-action-1",
            json: {
              channel: {
                nest: params.channel,
                action: {
                  post: {
                    add: {
                      content: story,
                      author: client.ship,
                      sent,
                      kind: "/diary",
                      blob: null,
                      meta: {
                        title: params.title,
                        description: "",
                        image: params.image || "",
                        cover: "",
                      },
                    },
                  },
                },
              },
            },
          });

          return {
            content: [
              {
                type: "text",
                text: `Created notebook post "${params.title}" in ${params.channel} (id: ${id})`,
              },
            ],
          };
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          return { content: [{ type: "text", text: `Error: ${msg}` }] };
        }
      },
    },
    opts,
  );
}
