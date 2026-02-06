import { buildChannelConfigSchema } from "openclaw/plugin-sdk";
import { z } from "zod";

const ShipSchema = z.string().min(1);
const ChannelNestSchema = z.string().min(1);

const GroupActivityEventsSchema = z.object({
  "group-join": z.boolean().optional(),
  "group-kick": z.boolean().optional(),
  "group-ask": z.boolean().optional(),
  "group-invite": z.boolean().optional(),
  "group-role": z.boolean().optional(),
  "chan-init": z.boolean().optional(),
});

const GroupActivitySchema = z.object({
  enabled: z.boolean().optional(),
  target: z.string().optional(),
  events: GroupActivityEventsSchema.optional(),
  format: z.enum(["emoji", "plain"]).optional(),
  batchWindowMs: z.number().int().nonnegative().optional(),
  rateLimitPerMinute: z.number().int().positive().optional(),
});

export const TlonChannelRuleSchema = z.object({
  mode: z.enum(["restricted", "open"]).optional(),
  allowedShips: z.array(ShipSchema).optional(),
});

export const TlonAuthorizationSchema = z.object({
  channelRules: z.record(z.string(), TlonChannelRuleSchema).optional(),
});

export const TlonAccountSchema = z.object({
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  ship: ShipSchema.optional(),
  url: z.string().optional(),
  code: z.string().optional(),
  groupChannels: z.array(ChannelNestSchema).optional(),
  dmAllowlist: z.array(ShipSchema).optional(),
  autoDiscoverChannels: z.boolean().optional(),
  showModelSignature: z.boolean().optional(),
  // Auto-accept settings
  autoAcceptDmInvites: z.boolean().optional(), // Auto-accept DMs from ships in dmAllowlist
  autoAcceptGroupInvites: z.boolean().optional(), // Auto-accept all group invites
  groupActivity: GroupActivitySchema.optional(),
});

export const TlonConfigSchema = z.object({
  name: z.string().optional(),
  enabled: z.boolean().optional(),
  ship: ShipSchema.optional(),
  url: z.string().optional(),
  code: z.string().optional(),
  groupChannels: z.array(ChannelNestSchema).optional(),
  dmAllowlist: z.array(ShipSchema).optional(),
  autoDiscoverChannels: z.boolean().optional(),
  showModelSignature: z.boolean().optional(),
  authorization: TlonAuthorizationSchema.optional(),
  defaultAuthorizedShips: z.array(ShipSchema).optional(),
  accounts: z.record(z.string(), TlonAccountSchema).optional(),
  // Auto-accept settings
  autoAcceptDmInvites: z.boolean().optional(), // Auto-accept DMs from ships in dmAllowlist
  autoAcceptGroupInvites: z.boolean().optional(), // Auto-accept all group invites
  groupActivity: GroupActivitySchema.optional(),
});

export const tlonChannelConfigSchema = buildChannelConfigSchema(TlonConfigSchema);
