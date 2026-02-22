export type TlonTarget =
  | { kind: "dm"; ship: string }
  | { kind: "group"; nest: string; hostShip: string; channelName: string }
  | { kind: "heap"; nest: string; hostShip: string; channelName: string };

const SHIP_RE = /^~?[a-z-]+$/i;
const NEST_RE = /^(chat|heap)\/([^/]+)\/([^/]+)$/i;

export function normalizeShip(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return trimmed;
  }
  return trimmed.startsWith("~") ? trimmed : `~${trimmed}`;
}

export function parseNest(
  raw: string,
): { nestPrefix: string; hostShip: string; channelName: string } | null {
  const match = NEST_RE.exec(raw.trim());
  if (!match) {
    return null;
  }
  return {
    nestPrefix: match[1].toLowerCase(),
    hostShip: normalizeShip(match[2]),
    channelName: match[3],
  };
}

export function parseChannelNest(raw: string): { hostShip: string; channelName: string } | null {
  const result = parseNest(raw);
  if (!result) {
    return null;
  }
  return { hostShip: result.hostShip, channelName: result.channelName };
}

export function parseTlonTarget(raw?: string | null): TlonTarget | null {
  const trimmed = raw?.trim();
  if (!trimmed) {
    return null;
  }
  const withoutPrefix = trimmed.replace(/^tlon:/i, "");

  const dmPrefix = withoutPrefix.match(/^dm[/:](.+)$/i);
  if (dmPrefix) {
    return { kind: "dm", ship: normalizeShip(dmPrefix[1]) };
  }

  const groupPrefix = withoutPrefix.match(/^(group|room)[/:](.+)$/i);
  if (groupPrefix) {
    const groupTarget = groupPrefix[2].trim();
    const parsedNest = parseNest(groupTarget);
    if (parsedNest) {
      const kind = parsedNest.nestPrefix === "heap" ? "heap" as const : "group" as const;
      return {
        kind,
        nest: `${parsedNest.nestPrefix}/${parsedNest.hostShip}/${parsedNest.channelName}`,
        hostShip: parsedNest.hostShip,
        channelName: parsedNest.channelName,
      };
    }
    const parts = groupTarget.split("/");
    if (parts.length === 2) {
      const hostShip = normalizeShip(parts[0]);
      const channelName = parts[1];
      return {
        kind: "group",
        nest: `chat/${hostShip}/${channelName}`,
        hostShip,
        channelName,
      };
    }
    return null;
  }

  if (withoutPrefix.startsWith("heap/")) {
    const parsed = parseNest(withoutPrefix);
    if (!parsed) {
      return null;
    }
    return {
      kind: "heap",
      nest: `heap/${parsed.hostShip}/${parsed.channelName}`,
      hostShip: parsed.hostShip,
      channelName: parsed.channelName,
    };
  }

  if (withoutPrefix.startsWith("chat/")) {
    const parsed = parseChannelNest(withoutPrefix);
    if (!parsed) {
      return null;
    }
    return {
      kind: "group",
      nest: `chat/${parsed.hostShip}/${parsed.channelName}`,
      hostShip: parsed.hostShip,
      channelName: parsed.channelName,
    };
  }

  if (SHIP_RE.test(withoutPrefix)) {
    return { kind: "dm", ship: normalizeShip(withoutPrefix) };
  }

  return null;
}

export function formatTargetHint(): string {
  return "dm/~sampel-palnet | ~sampel-palnet | chat/~host-ship/channel | heap/~host-ship/channel | group:~host-ship/channel";
}
