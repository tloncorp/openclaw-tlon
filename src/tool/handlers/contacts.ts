/**
 * Contacts management handlers for tlon_run
 */

import type { HandlerParams } from "../index.js";
import { getOption } from "../parser.js";
import { createToolClient, normalizeShip, getShipWithTilde } from "../urbit-client.js";

interface ContactFieldText {
  type: "text";
  value: string;
}

interface ContactImageField {
  type: "look";
  value: string;
}

interface ContactFieldColor {
  type: "tint";
  value: string;
}

interface ContactBookProfile {
  nickname?: ContactFieldText;
  bio?: ContactFieldText;
  avatar?: ContactImageField;
  cover?: ContactImageField;
  color?: ContactFieldColor;
  status?: ContactFieldText;
}

type ContactRolodex = Record<string, ContactBookProfile | null>;
type ContactBookScryResult = Record<string, [ContactBookProfile, ContactBookProfile | null]>;

function extractProfile(profile: ContactBookProfile | null) {
  if (!profile) {return null;}
  return {
    nickname: profile.nickname?.value || null,
    bio: profile.bio?.value || null,
    status: profile.status?.value || null,
    avatar: profile.avatar?.value || null,
    cover: profile.cover?.value || null,
    color: profile.color?.value || null,
  };
}

export async function list({ accountId }: HandlerParams): Promise<string> {
  const client = await createToolClient(accountId);

  const [peers, contacts] = await Promise.all([
    client.scry<ContactRolodex>({ app: "contacts", path: "/all" }),
    client.scry<ContactBookScryResult>({ app: "contacts", path: "/v1/book" }),
  ]);

  const result: {
    ship: string;
    isContact: boolean;
    profile: ReturnType<typeof extractProfile>;
    overrides?: ReturnType<typeof extractProfile>;
  }[] = [];

  for (const [ship, entry] of Object.entries(contacts)) {
    if (!entry) {continue;}
    const [base, overrides] = entry;
    result.push({
      ship,
      isContact: true,
      profile: extractProfile(base),
      overrides: extractProfile(overrides),
    });
  }

  const contactShips = new Set(Object.keys(contacts));
  for (const [ship, profile] of Object.entries(peers)) {
    if (contactShips.has(ship)) {continue;}
    if (!profile) {continue;}
    result.push({
      ship,
      isContact: false,
      profile: extractProfile(profile),
    });
  }

  if (result.length === 0) {
    return "No contacts found.";
  }

  return JSON.stringify(result, null, 2);
}

export async function self({ accountId }: HandlerParams): Promise<string> {
  const client = await createToolClient(accountId);

  const profile = await client.scry<ContactBookProfile>({
    app: "contacts",
    path: "/v1/self",
  });

  return JSON.stringify(
    {
      ship: getShipWithTilde(client),
      profile: extractProfile(profile),
    },
    null,
    2,
  );
}

export async function get({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  if (!ship) {
    throw new Error("Usage: contacts get <~ship>");
  }

  const client = await createToolClient(accountId);
  const normalizedShip = normalizeShip(ship);

  const contacts = await client.scry<ContactBookScryResult>({
    app: "contacts",
    path: "/v1/book",
  });

  if (contacts[normalizedShip]) {
    const [base, overrides] = contacts[normalizedShip];
    return JSON.stringify(
      {
        ship: normalizedShip,
        isContact: true,
        profile: extractProfile(base),
        overrides: extractProfile(overrides),
      },
      null,
      2,
    );
  }

  const peers = await client.scry<ContactRolodex>({
    app: "contacts",
    path: "/all",
  });

  const peerProfile = peers[normalizedShip];
  if (peerProfile) {
    return JSON.stringify(
      {
        ship: normalizedShip,
        isContact: false,
        profile: extractProfile(peerProfile),
      },
      null,
      2,
    );
  }

  return JSON.stringify(
    {
      ship: normalizedShip,
      isContact: false,
      profile: null,
      note: "Ship not in local contacts. Use 'sync' to fetch their profile.",
    },
    null,
    2,
  );
}

export async function sync({ accountId, args }: HandlerParams): Promise<string> {
  if (args.length === 0) {
    throw new Error("Usage: contacts sync <~ship> [~ship2 ...]");
  }

  const client = await createToolClient(accountId);
  const normalizedShips = args.map(normalizeShip);

  await client.poke({
    app: "contacts",
    mark: "contact-action-1",
    json: { meet: normalizedShips },
  });

  return JSON.stringify({ synced: normalizedShips }, null, 2);
}

export async function add({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  if (!ship) {
    throw new Error("Usage: contacts add <~ship>");
  }

  const client = await createToolClient(accountId);
  const normalizedShip = normalizeShip(ship);

  await client.poke({
    app: "contacts",
    mark: "contact-action-1",
    json: { page: { kip: normalizedShip, contact: {} } },
  });

  return JSON.stringify({ added: normalizedShip }, null, 2);
}

export async function remove({ accountId, args }: HandlerParams): Promise<string> {
  const ship = args[0];
  if (!ship) {
    throw new Error("Usage: contacts remove <~ship>");
  }

  const client = await createToolClient(accountId);
  const normalizedShip = normalizeShip(ship);

  await client.poke({
    app: "contacts",
    mark: "contact-action-1",
    json: { wipe: [normalizedShip] },
  });

  return JSON.stringify({ removed: normalizedShip }, null, 2);
}

export async function updateProfile({ accountId, args }: HandlerParams): Promise<string> {
  const client = await createToolClient(accountId);

  const nickname = getOption(args, "nickname");
  const bio = getOption(args, "bio");
  const status = getOption(args, "status");
  const avatar = getOption(args, "avatar");
  const cover = getOption(args, "cover");

  interface ContactEditField {
    nickname?: string;
    bio?: string;
    status?: string;
    avatar?: string;
    cover?: string;
  }

  const editFields: ContactEditField[] = [];

  if (nickname !== undefined) {
    editFields.push({ nickname: nickname === "null" ? "" : nickname });
  }
  if (bio !== undefined) {
    editFields.push({ bio });
  }
  if (status !== undefined) {
    editFields.push({ status });
  }
  if (avatar !== undefined) {
    editFields.push({ avatar: avatar === "null" ? "" : avatar });
  }
  if (cover !== undefined) {
    editFields.push({ cover });
  }

  if (editFields.length === 0) {
    throw new Error(
      "Usage: contacts update-profile --nickname <name> [--bio <text>] [--status <text>] [--avatar <url>] [--cover <url>]",
    );
  }

  await client.poke({
    app: "contacts",
    mark: "contact-action",
    json: { edit: editFields },
  });

  const updatedFields = editFields.map((f) => Object.keys(f)[0]);
  return JSON.stringify({ updated: updatedFields, ship: getShipWithTilde(client) }, null, 2);
}
