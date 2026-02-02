# Tlon Plugin Tools Design

This document outlines the agent tools to add to the Tlon plugin, consolidating functionality from the separate tlon-skill repo.

## Overview

Moving from: `exec npx ts-node scripts/X.ts` → direct plugin tools callable by the agent

## Tools to Implement

### 1. `tlon_contacts` - Contact Management

```ts
api.registerTool({
  name: "tlon_contacts",
  description: "Get or update Tlon contacts and profiles",
  parameters: Type.Object({
    action: Type.Union([
      Type.Literal("self"),      // Get own profile
      Type.Literal("get"),       // Get a ship's profile
      Type.Literal("list"),      // List all known contacts
      Type.Literal("update"),    // Update own profile
    ]),
    ship: Type.Optional(Type.String()),  // For "get" action
    profile: Type.Optional(Type.Object({
      nickname: Type.Optional(Type.String()),
      bio: Type.Optional(Type.String()),
      status: Type.Optional(Type.String()),
      avatar: Type.Optional(Type.String()),
      cover: Type.Optional(Type.String()),
    })),
  }),
  async execute(_id, params, ctx) {
    // Uses existing urbit HTTP client from plugin
  },
});
```

### 2. `tlon_channels` - Channel Discovery

```ts
api.registerTool({
  name: "tlon_channels",
  description: "List Tlon channels and groups",
  parameters: Type.Object({
    action: Type.Union([
      Type.Literal("list"),      // List all channels
      Type.Literal("groups"),    // List groups only
      Type.Literal("dms"),       // List DM conversations
      Type.Literal("info"),      // Get channel details
    ]),
    channel: Type.Optional(Type.String()),  // For "info" action (nest format)
  }),
  async execute(_id, params, ctx) {
    // Scry /v4/channels, /groups, etc.
  },
});
```

### 3. `tlon_history` - Message History

```ts
api.registerTool({
  name: "tlon_history",
  description: "Fetch message history from Tlon channels or DMs",
  parameters: Type.Object({
    target: Type.String(),  // Channel nest or ship for DM
    limit: Type.Optional(Type.Number({ default: 20 })),
    type: Type.Optional(Type.Union([
      Type.Literal("channel"),
      Type.Literal("dm"),
    ])),
  }),
  async execute(_id, params, ctx) {
    // Scry /v4/channels/{nest}/posts/newest/{limit}/outline
  },
});
```

### 4. `tlon_react` - Add/Remove Reactions

```ts
api.registerTool({
  name: "tlon_react",
  description: "Add or remove emoji reactions on Tlon posts",
  parameters: Type.Object({
    action: Type.Union([
      Type.Literal("add"),
      Type.Literal("remove"),
    ]),
    target: Type.String(),      // Channel nest or DM ship
    postId: Type.String(),      // Post ID (@ud format)
    emoji: Type.Optional(Type.String()),  // Required for "add"
  }),
  async execute(_id, params, ctx) {
    // Poke channels or chat app
  },
});
```

### 5. `tlon_post` - Edit/Delete Posts

```ts
api.registerTool({
  name: "tlon_post",
  description: "Edit or delete Tlon posts",
  parameters: Type.Object({
    action: Type.Union([
      Type.Literal("edit"),
      Type.Literal("delete"),
    ]),
    channel: Type.String(),     // Channel nest
    postId: Type.String(),      // Post ID
    content: Type.Optional(Type.String()),  // New content for edit
    title: Type.Optional(Type.String()),    // For notebook posts
  }),
  async execute(_id, params, ctx) {
    // Poke channel-action-1
  },
});
```

### 6. `tlon_notebook` - Post to Notebooks/Diaries

```ts
api.registerTool({
  name: "tlon_notebook",
  description: "Create posts in Tlon notebook/diary channels",
  parameters: Type.Object({
    channel: Type.String(),     // diary/~host/name format
    title: Type.String(),
    content: Type.String(),     // Markdown content
    image: Type.Optional(Type.String()),
  }),
  async execute(_id, params, ctx) {
    // Poke channel-action-1 with diary kind
  },
});
```

### 7. `tlon_dm` - DM Management

```ts
api.registerTool({
  name: "tlon_dm",
  description: "Manage Tlon DMs - accept/decline invites, send to clubs",
  parameters: Type.Object({
    action: Type.Union([
      Type.Literal("accept"),    // Accept DM invite
      Type.Literal("decline"),   // Decline DM invite
      Type.Literal("send"),      // Send to club (group DM)
      Type.Literal("reply"),     // Reply in club
    ]),
    ship: Type.Optional(Type.String()),     // For accept/decline
    clubId: Type.Optional(Type.String()),   // For send/reply (0v...)
    postId: Type.Optional(Type.String()),   // For reply
    message: Type.Optional(Type.String()),  // For send/reply
  }),
  async execute(_id, params, ctx) {
    // Poke chat-dm-rsvp, chat-club-action-0
  },
});
```

### 8. `tlon_groups` - Group Management

```ts
api.registerTool({
  name: "tlon_groups",
  description: "List and get info about Tlon groups",
  parameters: Type.Object({
    action: Type.Union([
      Type.Literal("list"),
      Type.Literal("info"),
    ]),
    group: Type.Optional(Type.String()),  // For info action
  }),
  async execute(_id, params, ctx) {
    // Scry /groups
  },
});
```

### 9. `tlon_activity` - Activity/Notifications

```ts
api.registerTool({
  name: "tlon_activity",
  description: "Check Tlon activity and notifications",
  parameters: Type.Object({
    action: Type.Union([
      Type.Literal("unread"),    // Get unread counts
      Type.Literal("mentions"),  // Get recent mentions
      Type.Literal("all"),       // Get all activity
    ]),
    limit: Type.Optional(Type.Number({ default: 20 })),
  }),
  async execute(_id, params, ctx) {
    // Scry /activity
  },
});
```

## Implementation Notes

### Shared Code (already in plugin)
- `src/urbit/http-api.ts` - Urbit HTTP client (poke, scry, subscribe)
- `src/urbit/story.ts` - Markdown → Story conversion
- `src/urbit/send.ts` - Message sending utilities

### New Files Needed
- `src/tools/index.ts` - Tool registration
- `src/tools/contacts.ts`
- `src/tools/channels.ts`
- `src/tools/history.ts`
- `src/tools/posts.ts`
- `src/tools/dms.ts`
- `src/tools/groups.ts`
- `src/tools/activity.ts`

### Tool Options
All tools should be registered as `optional: true` since they're supplementary to basic messaging:

```ts
api.registerTool(toolDef, { optional: true });
```

Users enable via config:
```json5
{
  agents: {
    list: [{
      id: "main",
      tools: { allow: ["tlon"] }  // Enables all tlon_* tools
    }]
  }
}
```

## Migration Path

1. Add tools to openclaw-tlon plugin
2. Test tools work correctly
3. Update plugin README with tool documentation
4. Deprecate tlon-skill repo (point to plugin)
5. Eventually archive tlon-skill

## What About SKILL.md?

The plugin can ship its own skill in `skills/tlon/SKILL.md` that documents:
- Tool names and usage patterns
- Example prompts
- When to use which tool

This replaces the separate tlon-skill repo entirely.
