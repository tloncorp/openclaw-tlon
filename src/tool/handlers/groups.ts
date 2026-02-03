/**
 * Groups management handlers for tlon_run
 */

import type { HandlerParams } from "../index.js";
import { getOption } from "../parser.js";
import { createToolClient, normalizeShip, getShipWithTilde } from "../urbit-client.js";

interface GroupMeta {
  title: string;
  description: string;
  image: string;
  cover: string;
}

interface GroupV7 {
  meta: GroupMeta;
  admissions: {
    privacy: "public" | "private" | "secret";
    banned?: { ships?: string[] };
    requests?: Record<string, unknown>;
    invited?: Record<string, unknown>;
  };
  seats?: Record<string, { roles: string[]; joined: number }>;
  roles?: Record<string, GroupMeta>;
  channels?: Record<string, unknown>;
  sections?: Record<string, unknown>;
  "section-order"?: string[];
  "flagged-content"?: unknown;
}

function generateGroupSlug(): string {
  return Math.random().toString(36).substring(2, 10);
}

export async function list({ accountId }: HandlerParams): Promise<string> {
  const client = await createToolClient(accountId);

  const groups = await client.scry<Record<string, GroupV7>>({
    app: "groups",
    path: "/v2/groups",
  });

  const lines: string[] = ["=== YOUR GROUPS ===", ""];

  for (const [groupId, group] of Object.entries(groups)) {
    const memberCount = Object.keys(group.seats || {}).length;
    const channelCount = Object.keys(group.channels || {}).length;
    const privacy = group.admissions?.privacy || "unknown";

    lines.push(`${group.meta.title || groupId}`);
    lines.push(`  ID: ${groupId}`);
    lines.push(`  Privacy: ${privacy}`);
    lines.push(`  Members: ${memberCount}, Channels: ${channelCount}`);
    if (group.meta.description) {
      lines.push(`  Description: ${group.meta.description}`);
    }
    lines.push("");
  }

  if (Object.keys(groups).length === 0) {
    return "No groups found.";
  }

  return lines.join("\n");
}

export async function info({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  if (!groupId) {
    throw new Error("Usage: groups info <group-id>");
  }

  const client = await createToolClient(accountId);

  const group = await client.scry<GroupV7>({
    app: "groups",
    path: `/v2/ui/groups/${groupId}`,
  });

  const lines: string[] = [
    `=== ${group.meta.title || groupId} ===`,
    "",
    `ID: ${groupId}`,
    `Privacy: ${group.admissions?.privacy || "unknown"}`,
    `Description: ${group.meta.description || "(none)"}`,
  ];

  if (group.meta.image) {
    lines.push(`Icon: ${group.meta.image}`);
  }

  lines.push("", "--- Members ---");
  for (const [ship, seat] of Object.entries(group.seats || {})) {
    const roles = seat.roles.length > 0 ? ` [${seat.roles.join(", ")}]` : "";
    lines.push(`  ${ship}${roles}`);
  }

  if (group.roles && Object.keys(group.roles).length > 0) {
    lines.push("", "--- Roles ---");
    for (const [roleId, role] of Object.entries(group.roles)) {
      lines.push(`  ${roleId}: ${role.title || "(untitled)"}`);
    }
  }

  if (group.channels && Object.keys(group.channels).length > 0) {
    lines.push("", "--- Channels ---");
    for (const [channelId, channel] of Object.entries(group.channels)) {
      const title = (channel as { meta?: { title?: string } }).meta?.title || channelId;
      lines.push(`  ${title} (${channelId})`);
    }
  }

  if (group.admissions?.invited && Object.keys(group.admissions.invited).length > 0) {
    lines.push("", "--- Pending Invites ---");
    for (const ship of Object.keys(group.admissions.invited)) {
      lines.push(`  ${ship}`);
    }
  }

  if (group.admissions?.requests && Object.keys(group.admissions.requests).length > 0) {
    lines.push("", "--- Join Requests ---");
    for (const ship of Object.keys(group.admissions.requests)) {
      lines.push(`  ${ship}`);
    }
  }

  if (group.admissions?.banned?.ships && group.admissions.banned.ships.length > 0) {
    lines.push("", "--- Banned Ships ---");
    for (const ship of group.admissions.banned.ships) {
      lines.push(`  ${ship}`);
    }
  }

  return lines.join("\n");
}

export async function create({ accountId, args }: HandlerParams): Promise<string> {
  const title = args[0];
  if (!title) {
    throw new Error('Usage: groups create "Group Name" [--description "..."]');
  }

  const description = getOption(args, "description") || "";
  const client = await createToolClient(accountId);
  const ship = getShipWithTilde(client);
  const slug = generateGroupSlug();
  const groupId = `${ship}/${slug}`;

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          add: {
            meta: {
              title,
              description,
              image: "",
              cover: "",
            },
            privacy: "private",
          },
        },
      },
    },
  });

  return `Group created.\n  ID: ${groupId}\n  Title: ${title}`;
}

export async function invite({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const ships = args.slice(1);

  if (!groupId || ships.length === 0) {
    throw new Error("Usage: groups invite <group-id> <~ship> [~ship2 ...]");
  }

  const client = await createToolClient(accountId);
  const normalizedShips = ships.map(normalizeShip);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      invite: {
        flag: groupId,
        ships: normalizedShips,
        "a-invite": {
          token: null,
          note: null,
        },
      },
    },
  });

  return `Invitations sent to ${normalizedShips.join(", ")}`;
}

export async function join({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  if (!groupId) {
    throw new Error("Usage: groups join <group-id>");
  }

  const client = await createToolClient(accountId);

  await client.poke({
    app: "groups",
    mark: "group-join",
    json: {
      flag: groupId,
      "join-all": true,
    },
  });

  return `Join request sent for ${groupId}. May need approval if group is private.`;
}

export async function leave({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  if (!groupId) {
    throw new Error("Usage: groups leave <group-id>");
  }

  const client = await createToolClient(accountId);

  await client.poke({
    app: "groups",
    mark: "group-leave",
    json: groupId,
  });

  return `Left group ${groupId}.`;
}

export async function deleteGroup({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  if (!groupId) {
    throw new Error("Usage: groups delete <group-id>");
  }

  const client = await createToolClient(accountId);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          delete: null,
        },
      },
    },
  });

  return `Group ${groupId} deleted.`;
}

export async function update({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  if (!groupId) {
    throw new Error(
      'Usage: groups update <group-id> --title "..." [--description "..."] [--image "..."] [--cover "..."]',
    );
  }

  const title = getOption(args, "title");
  const description = getOption(args, "description");
  const image = getOption(args, "image");
  const cover = getOption(args, "cover");

  if (!title && !description && !image && !cover) {
    throw new Error("At least one option required: --title, --description, --image, --cover");
  }

  const client = await createToolClient(accountId);

  const group = await client.scry<GroupV7>({
    app: "groups",
    path: `/v2/ui/groups/${groupId}`,
  });

  const meta: GroupMeta = {
    title: title ?? group.meta.title,
    description: description ?? group.meta.description,
    image: image ?? group.meta.image,
    cover: cover ?? group.meta.cover,
  };

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          meta,
        },
      },
    },
  });

  return `Group updated.\n  Title: ${meta.title}\n  Description: ${meta.description || "(none)"}`;
}

export async function kick({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const ships = args.slice(1);

  if (!groupId || ships.length === 0) {
    throw new Error("Usage: groups kick <group-id> <~ship> [~ship2 ...]");
  }

  const client = await createToolClient(accountId);
  const normalizedShips = ships.map(normalizeShip);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          seat: {
            ships: normalizedShips,
            "a-seat": {
              del: null,
            },
          },
        },
      },
    },
  });

  return `Kicked ${normalizedShips.join(", ")} from ${groupId}.`;
}

export async function ban({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const ships = args.slice(1);

  if (!groupId || ships.length === 0) {
    throw new Error("Usage: groups ban <group-id> <~ship> [~ship2 ...]");
  }

  const client = await createToolClient(accountId);
  const normalizedShips = ships.map(normalizeShip);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          entry: {
            ban: {
              "add-ships": normalizedShips,
            },
          },
        },
      },
    },
  });

  return `Banned ${normalizedShips.join(", ")} from ${groupId}.`;
}

export async function unban({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const ships = args.slice(1);

  if (!groupId || ships.length === 0) {
    throw new Error("Usage: groups unban <group-id> <~ship> [~ship2 ...]");
  }

  const client = await createToolClient(accountId);
  const normalizedShips = ships.map(normalizeShip);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          entry: {
            ban: {
              "del-ships": normalizedShips,
            },
          },
        },
      },
    },
  });

  return `Unbanned ${normalizedShips.join(", ")} from ${groupId}.`;
}

export async function addRole({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const roleId = args[1];

  if (!groupId || !roleId) {
    throw new Error(
      'Usage: groups add-role <group-id> <role-id> --title "..." [--description "..."]',
    );
  }

  const title = getOption(args, "title") || roleId;
  const description = getOption(args, "description") || "";

  const client = await createToolClient(accountId);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          role: {
            roles: [roleId],
            "a-role": {
              add: {
                title,
                description,
                image: "",
                cover: "",
              },
            },
          },
        },
      },
    },
  });

  return `Role "${roleId}" added.\n  Title: ${title}`;
}

export async function deleteRole({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const roleId = args[1];

  if (!groupId || !roleId) {
    throw new Error("Usage: groups delete-role <group-id> <role-id>");
  }

  const client = await createToolClient(accountId);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          role: {
            roles: [roleId],
            "a-role": {
              del: null,
            },
          },
        },
      },
    },
  });

  return `Role "${roleId}" deleted.`;
}

export async function updateRole({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const roleId = args[1];

  if (!groupId || !roleId) {
    throw new Error(
      'Usage: groups update-role <group-id> <role-id> --title "..." [--description "..."]',
    );
  }

  const title = getOption(args, "title");
  const description = getOption(args, "description");

  if (!title && !description) {
    throw new Error("At least one option required: --title or --description");
  }

  const client = await createToolClient(accountId);

  const group = await client.scry<GroupV7>({
    app: "groups",
    path: `/v2/ui/groups/${groupId}`,
  });

  const currentRole = group.roles?.[roleId];
  if (!currentRole) {
    throw new Error(`Role "${roleId}" not found in group ${groupId}`);
  }

  const meta = {
    title: title ?? currentRole.title,
    description: description ?? currentRole.description,
    image: currentRole.image || "",
    cover: currentRole.cover || "",
  };

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          role: {
            roles: [roleId],
            "a-role": {
              edit: meta,
            },
          },
        },
      },
    },
  });

  return `Role "${roleId}" updated.\n  Title: ${meta.title}`;
}

export async function assignRole({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const roleId = args[1];
  const ships = args.slice(2).filter((s) => !s.startsWith("--"));

  if (!groupId || !roleId || ships.length === 0) {
    throw new Error("Usage: groups assign-role <group-id> <role-id> <~ship> [~ship2 ...]");
  }

  const client = await createToolClient(accountId);
  const normalizedShips = ships.map(normalizeShip);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          seat: {
            ships: normalizedShips,
            "a-seat": {
              "add-roles": [roleId],
            },
          },
        },
      },
    },
  });

  return `Assigned role "${roleId}" to ${normalizedShips.join(", ")}.`;
}

export async function removeRole({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const roleId = args[1];
  const ships = args.slice(2).filter((s) => !s.startsWith("--"));

  if (!groupId || !roleId || ships.length === 0) {
    throw new Error("Usage: groups remove-role <group-id> <role-id> <~ship> [~ship2 ...]");
  }

  const client = await createToolClient(accountId);
  const normalizedShips = ships.map(normalizeShip);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          seat: {
            ships: normalizedShips,
            "a-seat": {
              "del-roles": [roleId],
            },
          },
        },
      },
    },
  });

  return `Removed role "${roleId}" from ${normalizedShips.join(", ")}.`;
}

export async function setPrivacy({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const privacy = args[1] as "public" | "private" | "secret";

  if (!groupId || !privacy || !["public", "private", "secret"].includes(privacy)) {
    throw new Error("Usage: groups set-privacy <group-id> <public|private|secret>");
  }

  const client = await createToolClient(accountId);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          entry: {
            privacy,
          },
        },
      },
    },
  });

  return `Privacy set to "${privacy}".`;
}

export async function acceptJoin({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const ships = args.slice(1);

  if (!groupId || ships.length === 0) {
    throw new Error("Usage: groups accept-join <group-id> <~ship> [~ship2 ...]");
  }

  const client = await createToolClient(accountId);
  const normalizedShips = ships.map(normalizeShip);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          entry: {
            ask: {
              ships: normalizedShips,
              "a-ask": "approve",
            },
          },
        },
      },
    },
  });

  return `Accepted join requests from ${normalizedShips.join(", ")}.`;
}

export async function rejectJoin({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const ships = args.slice(1);

  if (!groupId || ships.length === 0) {
    throw new Error("Usage: groups reject-join <group-id> <~ship> [~ship2 ...]");
  }

  const client = await createToolClient(accountId);
  const normalizedShips = ships.map(normalizeShip);

  await client.poke({
    app: "groups",
    mark: "group-action-4",
    json: {
      group: {
        flag: groupId,
        "a-group": {
          entry: {
            ask: {
              ships: normalizedShips,
              "a-ask": "deny",
            },
          },
        },
      },
    },
  });

  return `Rejected join requests from ${normalizedShips.join(", ")}.`;
}

export async function addChannel({ accountId, args }: HandlerParams): Promise<string> {
  const groupId = args[0];
  const title = args[1];

  if (!groupId || !title) {
    throw new Error(
      'Usage: groups add-channel <group-id> "Channel Name" [--kind chat|diary|heap] [--description "..."]',
    );
  }

  const kindOpt = getOption(args, "kind");
  const kind: "chat" | "diary" | "heap" =
    kindOpt && ["chat", "diary", "heap"].includes(kindOpt)
      ? (kindOpt as "chat" | "diary" | "heap")
      : "chat";
  const description = getOption(args, "description") || "";

  const client = await createToolClient(accountId);
  const ship = getShipWithTilde(client);
  const slug = generateGroupSlug();
  const nest = `${kind}/${ship}/${slug}`;

  await client.poke({
    app: "channels",
    mark: "channel-action-1",
    json: {
      create: {
        kind,
        group: groupId,
        name: slug,
        title,
        description,
        meta: null,
        readers: [],
        writers: [],
      },
    },
  });

  return `Channel created.\n  Nest: ${nest}\n  Title: ${title}\n  Group: ${groupId}`;
}
