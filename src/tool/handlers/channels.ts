/**
 * Channel listing and management handlers for tlon_run
 */

import type { HandlerParams } from "../index.js";
import { getOption } from "../parser.js";
import { createToolClient, getShipWithTilde } from "../urbit-client.js";

interface Club {
  team: string[];
  hive: string[];
  meta: {
    title?: string;
    description?: string;
    image?: string;
    cover?: string;
  };
}

type Clubs = Record<string, Club>;

interface GroupChannel {
  meta: {
    title: string;
    description: string;
    image: string;
    cover: string;
  };
  added: number;
  readers: string[];
  zone: string;
  join: boolean;
}

interface Group {
  meta: {
    title: string;
    description: string;
    image: string;
    cover: string;
  };
  fleet: Record<string, { sects: string[]; joined: number }>;
  cabals: Record<string, { meta: unknown }>;
  zones: Record<string, { meta: { title: string; description: string }; idx: string[] }>;
  "zone-ord": string[];
  channels: Record<string, GroupChannel>;
  bloc: string[];
  secret: boolean;
  cordon: unknown;
  flagged: unknown;
}

type Groups = Record<string, Group>;

export async function dms({ accountId }: HandlerParams): Promise<string> {
  const client = await createToolClient(accountId);

  const dmList = await client.scry<string[]>({
    app: "chat",
    path: "/dm",
  });

  if (!dmList || dmList.length === 0) {
    return "No DMs found.";
  }

  const result = dmList.map((ship) => ({
    type: "dm",
    id: ship,
    contact: ship,
  }));

  return JSON.stringify(result, null, 2);
}

export async function groupDms({ accountId }: HandlerParams): Promise<string> {
  const client = await createToolClient(accountId);
  const currentShip = getShipWithTilde(client);

  const clubs = await client.scry<Clubs>({
    app: "chat",
    path: "/clubs",
  });

  const result = Object.entries(clubs).map(([id, club]) => {
    const isJoined = club.team.includes(currentShip);
    const isInvited = club.hive.includes(currentShip);

    return {
      type: "groupDm",
      id,
      title: club.meta.title || "Untitled",
      description: club.meta.description || "",
      members: club.team,
      invited: club.hive,
      status: isJoined ? "joined" : isInvited ? "invited" : "unknown",
    };
  });

  if (result.length === 0) {
    return "No group DMs found.";
  }

  return JSON.stringify(result, null, 2);
}

export async function groups({ accountId }: HandlerParams): Promise<string> {
  const client = await createToolClient(accountId);

  const groupsData = await client.scry<Groups>({
    app: "groups",
    path: "/groups",
  });

  const result = Object.entries(groupsData).map(([flag, group]) => {
    const channelList = Object.entries(group.channels).map(([nest, channel]) => ({
      nest,
      title: channel.meta.title,
      zone: channel.zone,
    }));

    return {
      type: "group",
      id: flag,
      title: group.meta.title,
      description: group.meta.description,
      image: group.meta.image,
      secret: group.secret,
      memberCount: Object.keys(group.fleet).length,
      channels: channelList,
    };
  });

  if (result.length === 0) {
    return "No groups found.";
  }

  return JSON.stringify(result, null, 2);
}

export async function all({ accountId }: HandlerParams): Promise<string> {
  const client = await createToolClient(accountId);
  const currentShip = getShipWithTilde(client);

  const [dmList, clubs, groupsData] = await Promise.all([
    client.scry<string[]>({ app: "chat", path: "/dm" }),
    client.scry<Clubs>({ app: "chat", path: "/clubs" }),
    client.scry<Groups>({ app: "groups", path: "/groups" }),
  ]);

  const dmsResult = dmList.map((ship) => ({
    type: "dm",
    id: ship,
    contact: ship,
  }));

  const groupDmsResult = Object.entries(clubs).map(([id, club]) => {
    const isJoined = club.team.includes(currentShip);
    const isInvited = club.hive.includes(currentShip);
    return {
      type: "groupDm",
      id,
      title: club.meta.title || "Untitled",
      description: club.meta.description || "",
      members: club.team,
      invited: club.hive,
      status: isJoined ? "joined" : isInvited ? "invited" : "unknown",
    };
  });

  const groupsResult = Object.entries(groupsData).map(([flag, group]) => ({
    type: "group",
    id: flag,
    title: group.meta.title,
    description: group.meta.description,
    secret: group.secret,
    memberCount: Object.keys(group.fleet).length,
    channels: Object.entries(group.channels).map(([nest, ch]) => ({
      nest,
      title: ch.meta.title,
    })),
  }));

  return JSON.stringify(
    {
      dms: dmsResult,
      groupDms: groupDmsResult,
      groups: groupsResult,
    },
    null,
    2,
  );
}

function parseNest(nest: string): { kind: string; host: string; name: string } {
  const parts = nest.split("/");
  if (parts.length !== 3) {
    throw new Error(`Invalid nest format: ${nest}. Expected: kind/~host/name`);
  }
  return {
    kind: parts[0],
    host: parts[1].startsWith("~") ? parts[1] : `~${parts[1]}`,
    name: parts[2],
  };
}

async function findChannelGroup(
  client: Awaited<ReturnType<typeof createToolClient>>,
  nest: string,
): Promise<string | null> {
  const groupsData = await client.scry<Groups>({
    app: "groups",
    path: "/groups",
  });

  for (const [flag, group] of Object.entries(groupsData)) {
    if (group.channels && group.channels[nest]) {
      return flag;
    }
  }
  return null;
}

export async function info({ accountId, args }: HandlerParams): Promise<string> {
  const nest = args[0];
  if (!nest) {
    throw new Error("Usage: channels info <nest>\nExample: channels info chat/~ship/channel-name");
  }

  const client = await createToolClient(accountId);
  const { kind, name } = parseNest(nest);

  const groupFlag = await findChannelGroup(client, nest);
  if (!groupFlag) {
    throw new Error(`Channel ${nest} not found in any group`);
  }

  const groupsData = await client.scry<Groups>({
    app: "groups",
    path: "/groups",
  });

  const group = groupsData[groupFlag];
  const channel = group.channels[nest];

  const lines: string[] = [
    `=== ${channel.meta.title || name} ===`,
    "",
    `Nest: ${nest}`,
    `Kind: ${kind}`,
    `Group: ${group.meta.title} (${groupFlag})`,
    `Zone: ${channel.zone}`,
    `Description: ${channel.meta.description || "(none)"}`,
    `Readers: ${channel.readers.length > 0 ? channel.readers.join(", ") : "(all members)"}`,
  ];

  return lines.join("\n");
}

export async function update({ accountId, args }: HandlerParams): Promise<string> {
  const nest = args[0];
  if (!nest) {
    throw new Error(
      'Usage: channels update <nest> --title "..." [--description "..."]\nExample: channels update chat/~ship/channel-name --title "New Title"',
    );
  }

  const title = getOption(args, "title");
  const description = getOption(args, "description");

  if (!title && !description) {
    throw new Error("At least one option required: --title or --description");
  }

  const client = await createToolClient(accountId);
  parseNest(nest);

  const groupFlag = await findChannelGroup(client, nest);
  if (!groupFlag) {
    throw new Error(`Channel ${nest} not found in any group`);
  }

  const groupsData = await client.scry<Groups>({
    app: "groups",
    path: "/groups",
  });

  const group = groupsData[groupFlag];
  const channel = group.channels[nest];

  const channelUpdate = {
    added: channel.added,
    meta: {
      title: title ?? channel.meta.title,
      description: description ?? channel.meta.description,
      image: channel.meta.image || "",
      cover: channel.meta.cover || "",
    },
    section: channel.zone || "default",
    readers: channel.readers || [],
    join: channel.join ?? true,
  };

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupFlag,
        "a-group": {
          channel: {
            nest,
            "a-channel": {
              edit: channelUpdate,
            },
          },
        },
      },
    },
  });

  return `Channel updated.\n  Title: ${channelUpdate.meta.title}\n  Description: ${channelUpdate.meta.description || "(none)"}`;
}

export async function deleteChannel({ accountId, args }: HandlerParams): Promise<string> {
  const nest = args[0];
  if (!nest) {
    throw new Error(
      "Usage: channels delete <nest>\nExample: channels delete chat/~ship/channel-name",
    );
  }

  const client = await createToolClient(accountId);
  parseNest(nest);

  const groupFlag = await findChannelGroup(client, nest);
  if (!groupFlag) {
    throw new Error(`Channel ${nest} not found in any group`);
  }

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupFlag,
        "a-group": {
          channel: {
            nest,
            "a-channel": {
              del: null,
            },
          },
        },
      },
    },
  });

  return `Channel ${nest} deleted.`;
}
