import { normalizeShip } from "./targets.js";
import {
  GROUP_ACTIVITY_EVENT_TYPES,
  type GroupActivityEventType,
  type NormalizedGroupActivityEvent,
} from "./types.js";

export type ActivityEnvelope = {
  "time-id"?: string;
  event?: {
    "incoming-event"?: unknown;
  };
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  return value as Record<string, unknown>;
}

function getString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function getStringFromRecord(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const raw = record[key];
    const str = getString(raw);
    if (str) {
      return str;
    }
  }
  return null;
}

function getStringArray(value: unknown): string[] | null {
  if (Array.isArray(value)) {
    const filtered = value.filter((item): item is string => typeof item === "string");
    return filtered.length > 0 ? filtered : [];
  }
  if (typeof value === "string") {
    return [value];
  }
  return null;
}

function normalizeGroupFlag(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return trimmed;
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

export function isGroupActivityEventType(value: string): value is GroupActivityEventType {
  return (GROUP_ACTIVITY_EVENT_TYPES as readonly string[]).includes(value);
}

export function extractActivityEnvelope(data: unknown): {
  timeId?: string;
  incomingEvent?: unknown;
} {
  const record = asRecord(data);
  if (!record) {
    return {};
  }

  const timeId = getString(record["time-id"] ?? record.timeId ?? record["time_id"]) ?? undefined;
  const event = asRecord(record.event);
  const incomingEvent = event ? event["incoming-event"] ?? event.incomingEvent : undefined;
  return { timeId, incomingEvent };
}

export function normalizeGroupActivityEvent(
  incoming: unknown,
): NormalizedGroupActivityEvent | null {
  const record = asRecord(incoming);
  if (!record) {
    return null;
  }

  const type = getString(record.type);
  if (!type || !isGroupActivityEventType(type)) {
    return null;
  }

  const groupCandidate =
    getStringFromRecord(record, ["group", "flag", "group-flag", "groupFlag", "resource"]) ??
    (() => {
      const groupObj = asRecord(record.group);
      return groupObj ? getStringFromRecord(groupObj, ["flag", "group"]) : null;
    })();

  if (!groupCandidate) {
    return null;
  }

  const group = normalizeGroupFlag(groupCandidate);

  const shipCandidate = getStringFromRecord(record, [
    "ship",
    "who",
    "from",
    "inviter",
    "invited",
    "member",
    "by",
    "user",
  ]);

  const ship = shipCandidate ? normalizeShip(shipCandidate) : undefined;

  const rolesCandidate =
    getStringArray(record.roles) ??
    getStringArray(record.role) ??
    getStringArray(record["new-roles"]) ??
    getStringArray(record.newRoles);

  const channelCandidate =
    getStringFromRecord(record, ["channel", "nest", "chan", "graph", "channelName"]) ??
    (() => {
      const channelObj = asRecord(record.channel);
      return channelObj ? getStringFromRecord(channelObj, ["name", "nest"]) : null;
    })();

  return {
    type,
    group,
    ship,
    roles: rolesCandidate ?? undefined,
    channel: channelCandidate ?? undefined,
  };
}
