/**
 * tlon_dm - DM management (accept/decline invites, club messaging)
 */

import { Type, type Static } from "@sinclair/typebox";
import type { PluginApi } from "openclaw";
import { markdownToStory } from "../urbit/story.js";
import { scot, da } from "@urbit/aura";
import { createToolClient, type TlonConfig } from "./urbit-client.js";

type ToolOptions = { optional: boolean };

const DmParams = Type.Object({
  action: Type.Union([
    Type.Literal("accept"),
    Type.Literal("decline"),
    Type.Literal("send"),
    Type.Literal("reply"),
  ]),
  ship: Type.Optional(Type.String({ description: "Ship for accept/decline" })),
  clubId: Type.Optional(Type.String({ description: "Club ID (0v...) for send/reply" })),
  postId: Type.Optional(Type.String({ description: "Post ID for reply" })),
  message: Type.Optional(Type.String({ description: "Message content" })),
});

type DmParamsType = Static<typeof DmParams>;

export function registerDmTools(api: PluginApi, opts: ToolOptions) {
  api.registerTool(
    {
      name: "tlon_dm",
      description:
        "Manage Tlon DMs: accept/decline invites, send to clubs (group DMs). Note: 1:1 DM send uses the regular message tool.",
      parameters: DmParams,

      async execute(_id, params: DmParamsType, ctx) {
        const config = ctx.config.channels?.tlon as TlonConfig | undefined;
        if (!config?.url || !config?.ship || !config?.code) {
          return { content: [{ type: "text", text: "Error: Tlon not configured" }] };
        }

        const client = await createToolClient(config);

        const author = client.ship;

        try {
          switch (params.action) {
            case "accept": {
              if (!params.ship) {
                return { content: [{ type: "text", text: "Error: ship required" }] };
              }
              const ship = params.ship.startsWith("~") ? params.ship : `~${params.ship}`;
              await client.poke({
                app: "chat",
                mark: "chat-dm-rsvp",
                json: { ship, ok: true },
              });
              return { content: [{ type: "text", text: `Accepted DM from ${ship}` }] };
            }

            case "decline": {
              if (!params.ship) {
                return { content: [{ type: "text", text: "Error: ship required" }] };
              }
              const ship = params.ship.startsWith("~") ? params.ship : `~${params.ship}`;
              await client.poke({
                app: "chat",
                mark: "chat-dm-rsvp",
                json: { ship, ok: false },
              });
              return { content: [{ type: "text", text: `Declined DM from ${ship}` }] };
            }

            case "send": {
              if (!params.clubId || !params.message) {
                return { content: [{ type: "text", text: "Error: clubId and message required" }] };
              }
              const sent = Date.now();
              const content = markdownToStory(params.message);
              const idUd = scot("ud", da.fromUnix(sent));
              const id = `${author}/${idUd}`;

              await client.poke({
                app: "chat",
                mark: "chat-club-action-0",
                json: {
                  id: params.clubId,
                  diff: {
                    uid: "0v3",
                    delta: {
                      writ: {
                        id,
                        delta: {
                          add: {
                            memo: { content, author, sent },
                            kind: null,
                            time: null,
                          },
                        },
                      },
                    },
                  },
                },
              });
              return { content: [{ type: "text", text: `Sent to club ${params.clubId}` }] };
            }

            case "reply": {
              if (!params.clubId || !params.postId || !params.message) {
                return {
                  content: [{ type: "text", text: "Error: clubId, postId, and message required" }],
                };
              }
              const sent = Date.now();
              const content = markdownToStory(params.message);
              const idUd = scot("ud", da.fromUnix(sent));
              const replyId = `${author}/${idUd}`;

              await client.poke({
                app: "chat",
                mark: "chat-club-action-0",
                json: {
                  id: params.clubId,
                  diff: {
                    uid: "0v3",
                    delta: {
                      writ: {
                        id: params.postId,
                        delta: {
                          reply: {
                            id: replyId,
                            meta: null,
                            delta: {
                              add: {
                                memo: { content, author, sent },
                                time: null,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              });
              return { content: [{ type: "text", text: `Replied in club ${params.clubId}` }] };
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
