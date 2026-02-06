import { normalizeShip, parseChannelNest } from "./targets.js";
import type { GroupActivityEventType, GroupActivityFormat, NormalizedGroupActivityEvent } from "./types.js";

const EMOJI: Record<GroupActivityEventType, string> = {
  "group-ask": "🙋",
  "group-join": "🚪",
  "group-kick": "👋",
  "group-invite": "📨",
  "group-role": "🔑",
  "chan-init": "📢",
};

export function formatGroupFlag(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "(unknown group)";
  }
  if (trimmed.startsWith("~")) {
    return trimmed;
  }
  const parts = trimmed.split("/");
  if (parts.length >= 2) {
    const host = normalizeShip(parts[0]);
    const rest = parts.slice(1).join("/");
    return `${host}/${rest}`;
  }
  return trimmed;
}

function formatChannelLabel(raw?: string | null): string | null {
  if (!raw) {
    return null;
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.startsWith("chat/")) {
    const parsed = parseChannelNest(trimmed);
    if (parsed) {
      return `#${parsed.channelName}`;
    }
  }
  if (trimmed.startsWith("#")) {
    return trimmed;
  }
  return `#${trimmed}`;
}

function formatShipList(ships: string[], max = 10): string {
  if (ships.length <= max) {
    return ships.join(", ");
  }
  const shown = ships.slice(0, max).join(", ");
  const remaining = ships.length - max;
  return `${shown} and ${remaining} more`;
}

function normalizeShipList(events: NormalizedGroupActivityEvent[]): string[] {
  return events
    .map((evt) => evt.ship)
    .filter((ship): ship is string => typeof ship === "string" && ship.trim().length > 0);
}

function formatRoleAssignments(events: NormalizedGroupActivityEvent[]): string {
  const parts: string[] = [];
  for (const evt of events) {
    const ship = evt.ship;
    const roles = evt.roles ?? [];
    if (!ship) {
      continue;
    }
    if (roles.length === 0) {
      parts.push(`${ship} (roles cleared)`);
      continue;
    }
    parts.push(`${ship} (${roles.join(", ")})`);
  }
  return parts.join(", ");
}

export function formatGroupActivityEvents(
  events: NormalizedGroupActivityEvent[],
  format: GroupActivityFormat = "emoji",
): string {
  if (events.length === 0) {
    return "";
  }

  const first = events[0];
  const count = events.length;
  const groupName = formatGroupFlag(first.group);
  const prefix = format === "emoji" ? `${EMOJI[first.type]} ` : "";

  if (count === 1) {
    const ship = first.ship ?? "(unknown ship)";
    const channelLabel = formatChannelLabel(first.channel);

    switch (first.type) {
      case "group-ask":
        return `${prefix}Action needed: ${ship} requested to join ${groupName}`;
      case "group-join":
        return `${prefix}${ship} joined ${groupName}`;
      case "group-kick":
        return `${prefix}${ship} was removed from ${groupName}`;
      case "group-invite":
        return `${prefix}${ship} invited to ${groupName}`;
      case "group-role":
        if (first.roles && first.roles.length > 0) {
          return `${prefix}${ship} roles in ${groupName}: ${first.roles.join(", ")}`;
        }
        return `${prefix}${ship} roles in ${groupName} updated`;
      case "chan-init":
        return `${prefix}New channel created in ${groupName}: ${channelLabel ?? "(unknown)"}`;
    }
  }

  const ships = normalizeShipList(events);
  const shipList = ships.length > 0 ? formatShipList(ships) : "(unknown ships)";
  const channelList = formatShipList(
    events
      .map((evt) => formatChannelLabel(evt.channel))
      .filter((label): label is string => Boolean(label)),
  );

  switch (first.type) {
    case "group-ask":
      return `${prefix}Action needed: ${count} join requests for ${groupName}: ${shipList}`;
    case "group-join":
      return `${prefix}${count} members joined ${groupName}: ${shipList}`;
    case "group-kick":
      return `${prefix}${count} members removed from ${groupName}: ${shipList}`;
    case "group-invite":
      return `${prefix}${count} invites sent for ${groupName}: ${shipList}`;
    case "group-role":
      return `${prefix}${count} role updates in ${groupName}: ${formatRoleAssignments(events)}`;
    case "chan-init":
      return `${prefix}${count} new channels in ${groupName}: ${channelList || "(unknown channels)"}`;
  }

  return "";
}
