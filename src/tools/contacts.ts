/**
 * tlon_contacts - Contact and profile management
 */

import { Type, type Static } from "@sinclair/typebox";
import type { PluginApi } from "openclaw";
import { createToolClient } from "./urbit-client.js";
import { getTlonConfig } from "./index.js";

type ToolOptions = { optional: boolean };

const ContactsParams = Type.Object({
  action: Type.Union([
    Type.Literal("self"),
    Type.Literal("get"),
    Type.Literal("list"),
    Type.Literal("update"),
  ]),
  ship: Type.Optional(Type.String({ description: "Ship to get profile for (with ~)" })),
  profile: Type.Optional(
    Type.Object({
      nickname: Type.Optional(Type.String()),
      bio: Type.Optional(Type.String()),
      status: Type.Optional(Type.String()),
      avatar: Type.Optional(Type.String()),
      cover: Type.Optional(Type.String()),
    }),
  ),
});

type ContactsParamsType = Static<typeof ContactsParams>;

export function registerContactsTools(api: PluginApi, opts: ToolOptions) {
  api.registerTool(
    {
      name: "tlon_contacts",
      description:
        "Get or update Tlon contacts and profiles. Use 'self' for own profile, 'get' for another ship, 'list' for all contacts, 'update' to change own profile.",
      parameters: ContactsParams,

      async execute(_id, params: ContactsParamsType) {
        const config = getTlonConfig();
        if (!config) {
          return {
            content: [{ type: "text", text: "Error: Tlon not configured (need url, ship, code)" }],
          };
        }

        const client = await createToolClient(config);

        try {
          switch (params.action) {
            case "self": {
              const result = await client.scry<ContactProfile>({
                app: "contacts",
                path: "/v1/self",
              });
              return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
              };
            }

            case "get": {
              if (!params.ship) {
                return { content: [{ type: "text", text: "Error: ship required for 'get' action" }] };
              }
              const ship = params.ship.startsWith("~") ? params.ship : `~${params.ship}`;
              const result = await client.scry<ContactProfile>({
                app: "contacts",
                path: `/v1/contact/${ship}`,
              });
              return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
              };
            }

            case "list": {
              const result = await client.scry<Record<string, ContactProfile>>({
                app: "contacts",
                path: "/v1/all",
              });
              const contacts = Object.entries(result || {}).map(([ship, profile]) => ({
                ship,
                nickname: profile.nickname || null,
                status: profile.status || null,
              }));
              return {
                content: [{ type: "text", text: JSON.stringify(contacts, null, 2) }],
              };
            }

            case "update": {
              if (!params.profile) {
                return {
                  content: [{ type: "text", text: "Error: profile object required for 'update' action" }],
                };
              }

              // Build the edit poke
              const edits: Array<{ "edit-field": { field: string; value: string } }> = [];
              if (params.profile.nickname !== undefined) {
                edits.push({ "edit-field": { field: "nickname", value: params.profile.nickname } });
              }
              if (params.profile.bio !== undefined) {
                edits.push({ "edit-field": { field: "bio", value: params.profile.bio } });
              }
              if (params.profile.status !== undefined) {
                edits.push({ "edit-field": { field: "status", value: params.profile.status } });
              }
              if (params.profile.avatar !== undefined) {
                edits.push({ "edit-field": { field: "avatar", value: params.profile.avatar } });
              }
              if (params.profile.cover !== undefined) {
                edits.push({ "edit-field": { field: "cover", value: params.profile.cover } });
              }

              for (const edit of edits) {
                await client.poke({
                  app: "contacts",
                  mark: "contact-action",
                  json: edit,
                });
              }

              return {
                content: [{ type: "text", text: `Updated ${edits.length} profile field(s)` }],
              };
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

interface ContactProfile {
  nickname?: string;
  bio?: string;
  status?: string;
  avatar?: string;
  cover?: string;
}
