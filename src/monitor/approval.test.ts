import { describe, expect, it, test } from "vitest";
import {
  type DisplayContext,
  type PendingApproval,
  APPROVAL_ALIASES,
  parseApprovalResponse,
  isApprovalResponse,
  generateApprovalId,
  createPendingApproval,
  findPendingApproval,
  formatApprovalRequest,
  formatApprovalConfirmation,
  formatBlockedList,
  formatPendingList,
  formatHelpText,
  parseAdminCommand,
  isAdminCommand,
  removePendingApproval,
  hasDuplicatePending,
} from "./approval.js";

// ---------------------------------------------------------------------------
// Command Alias Parsing
// ---------------------------------------------------------------------------

describe("parseApprovalResponse", () => {
  const approveCmds = ["approve", "yes", "y", "ok", "accept", "allow"];
  const denyCmds = ["deny", "no", "n", "reject", "decline"];
  const blockCmds = ["block", "ban"];

  test.each(approveCmds)('"%s" parses to approve', (cmd) => {
    expect(parseApprovalResponse(cmd)?.action).toBe("approve");
  });

  test.each(denyCmds)('"%s" parses to deny', (cmd) => {
    expect(parseApprovalResponse(cmd)?.action).toBe("deny");
  });

  test.each(blockCmds)('"%s" parses to block', (cmd) => {
    expect(parseApprovalResponse(cmd)?.action).toBe("block");
  });

  it("handles mixed case", () => {
    expect(parseApprovalResponse("YES")?.action).toBe("approve");
    expect(parseApprovalResponse("Block")?.action).toBe("block");
    expect(parseApprovalResponse("No")?.action).toBe("deny");
    expect(parseApprovalResponse("  OK  ")?.action).toBe("approve");
  });

  it("extracts ID after command", () => {
    expect(parseApprovalResponse("yes da1b2")).toEqual({ action: "approve", id: "da1b2" });
    expect(parseApprovalResponse("no cc3d4")).toEqual({ action: "deny", id: "cc3d4" });
  });

  it("strips leading # from IDs", () => {
    expect(parseApprovalResponse("yes #da1b2")).toEqual({ action: "approve", id: "da1b2" });
    expect(parseApprovalResponse("block #g5f6e")).toEqual({ action: "block", id: "g5f6e" });
  });

  it("accepts old-format long IDs (backwards compat)", () => {
    const result = parseApprovalResponse("approve dm-1234567890-abc12345");
    expect(result).toEqual({ action: "approve", id: "dm-1234567890-abc12345" });
  });

  it("ignores multi-word remainder (not an ID)", () => {
    expect(parseApprovalResponse("yes I agree")).toEqual({ action: "approve", id: undefined });
    expect(parseApprovalResponse("no thanks buddy")).toEqual({ action: "deny", id: undefined });
    expect(parseApprovalResponse("ok sounds good")).toEqual({ action: "approve", id: undefined });
  });

  it("returns null for non-commands", () => {
    expect(parseApprovalResponse("hello")).toBeNull();
    expect(parseApprovalResponse("")).toBeNull();
    expect(parseApprovalResponse("   ")).toBeNull();
    expect(parseApprovalResponse("yesterday")).toBeNull();
    expect(parseApprovalResponse("nothing")).toBeNull();
    expect(parseApprovalResponse("okay")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// isApprovalResponse
// ---------------------------------------------------------------------------

describe("isApprovalResponse", () => {
  it("recognizes all aliases", () => {
    for (const alias of Object.keys(APPROVAL_ALIASES)) {
      expect(isApprovalResponse(alias)).toBe(true);
    }
  });

  it("recognizes aliases with trailing text", () => {
    expect(isApprovalResponse("yes da1b2")).toBe(true);
    expect(isApprovalResponse("block #g5f6e")).toBe(true);
  });

  it("rejects non-commands", () => {
    expect(isApprovalResponse("hello")).toBe(false);
    expect(isApprovalResponse("")).toBe(false);
    expect(isApprovalResponse("   ")).toBe(false);
  });

  it("uses word boundary (not prefix)", () => {
    expect(isApprovalResponse("yesterday")).toBe(false);
    expect(isApprovalResponse("nothing")).toBe(false);
    expect(isApprovalResponse("okayish")).toBe(false);
    expect(isApprovalResponse("approval needed")).toBe(false);
    expect(isApprovalResponse("blocks of code")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Short ID Generation
// ---------------------------------------------------------------------------

describe("generateApprovalId", () => {
  it("generates IDs with type prefix", () => {
    expect(generateApprovalId("dm")).toMatch(/^d[0-9a-f]{4}$/);
    expect(generateApprovalId("channel")).toMatch(/^c[0-9a-f]{4}$/);
    expect(generateApprovalId("group")).toMatch(/^g[0-9a-f]{4}$/);
  });

  it("avoids collisions with existing IDs", () => {
    // Generate many IDs to verify uniqueness
    const existing: string[] = [];
    for (let i = 0; i < 20; i++) {
      const id = generateApprovalId("dm", existing);
      expect(existing).not.toContain(id);
      existing.push(id);
    }
  });
});

describe("createPendingApproval", () => {
  it("passes existing IDs for collision avoidance", () => {
    const first = createPendingApproval({ type: "dm", requestingShip: "~zod" });
    const second = createPendingApproval(
      { type: "dm", requestingShip: "~bus" },
      [first.id],
    );
    expect(second.id).not.toBe(first.id);
  });

  it("stores groupTitle when provided", () => {
    const approval = createPendingApproval({
      type: "group",
      requestingShip: "~zod",
      groupFlag: "~host/my-group",
      groupTitle: "My Cool Group",
    });
    expect(approval.groupTitle).toBe("My Cool Group");
  });
});

// ---------------------------------------------------------------------------
// findPendingApproval
// ---------------------------------------------------------------------------

describe("findPendingApproval", () => {
  const approvals: PendingApproval[] = [
    { id: "da1b2", type: "dm", requestingShip: "~zod", timestamp: 1 },
    { id: "cc3d4", type: "channel", requestingShip: "~bus", channelNest: "chat/~host/general", timestamp: 2 },
  ];

  it("finds by exact match", () => {
    expect(findPendingApproval(approvals, "da1b2")?.id).toBe("da1b2");
    expect(findPendingApproval(approvals, "cc3d4")?.id).toBe("cc3d4");
  });

  it("finds by prefix match when unambiguous", () => {
    expect(findPendingApproval(approvals, "d")?.id).toBe("da1b2");
    expect(findPendingApproval(approvals, "c")?.id).toBe("cc3d4");
  });

  it("returns undefined for ambiguous prefix", () => {
    const dupes: PendingApproval[] = [
      { id: "da1b2", type: "dm", requestingShip: "~zod", timestamp: 1 },
      { id: "da1b3", type: "dm", requestingShip: "~bus", timestamp: 2 },
    ];
    expect(findPendingApproval(dupes, "da1b")).toBeUndefined();
  });

  it("returns most recent when no ID given", () => {
    expect(findPendingApproval(approvals)?.id).toBe("cc3d4");
  });

  it("returns undefined for empty list", () => {
    expect(findPendingApproval([])).toBeUndefined();
    expect(findPendingApproval([], "da1b2")).toBeUndefined();
  });

  it("matches old-format long IDs", () => {
    const old: PendingApproval[] = [
      { id: "dm-1234567890-abc12345", type: "dm", requestingShip: "~zod", timestamp: 1 },
    ];
    expect(findPendingApproval(old, "dm-1234567890-abc12345")?.id).toBe("dm-1234567890-abc12345");
  });
});

// ---------------------------------------------------------------------------
// Display Context Formatting
// ---------------------------------------------------------------------------

const ctx: DisplayContext = {
  shipNames: new Map([["~sampel-palnet", "Sam"], ["~zod", "Zod"]]),
  channelNames: new Map([["chat/~host/general", "general"]]),
  groupNames: new Map([["~host/cool-group", "Cool Group"]]),
};

describe("formatApprovalRequest", () => {
  it("DM request shows nickname and action hints", () => {
    const approval = createPendingApproval({
      type: "dm",
      requestingShip: "~sampel-palnet",
      messagePreview: "Hello there",
    });
    const text = formatApprovalRequest(approval, ctx);
    expect(text).toContain("~sampel-palnet (Sam)");
    expect(text).toContain('"Hello there"');
    expect(text).toContain("yes - allow this ship to DM the bot");
    expect(text).toContain("no - decline");
    expect(text).toContain("block - permanently block");
    expect(text).toContain(`(#${approval.id})`);
  });

  it("channel request shows channel name and nickname", () => {
    const approval = createPendingApproval({
      type: "channel",
      requestingShip: "~sampel-palnet",
      channelNest: "chat/~host/general",
      messagePreview: "Hey @bot",
    });
    const text = formatApprovalRequest(approval, ctx);
    expect(text).toContain("~sampel-palnet (Sam)");
    expect(text).toContain("general (chat/~host/general)");
    expect(text).toContain("yes - allow this ship in this channel");
  });

  it("group request shows group title", () => {
    const approval = createPendingApproval({
      type: "group",
      requestingShip: "~sampel-palnet",
      groupFlag: "~host/cool-group",
    });
    const text = formatApprovalRequest(approval, ctx);
    expect(text).toContain("Cool Group (~host/cool-group)");
    expect(text).toContain("yes - join this group");
  });

  it("group request uses groupTitle field over context", () => {
    const approval = createPendingApproval({
      type: "group",
      requestingShip: "~zod",
      groupFlag: "~host/other-group",
      groupTitle: "Other Title",
    });
    const text = formatApprovalRequest(approval, ctx);
    expect(text).toContain("Other Title (~host/other-group)");
  });

  it("works without context (backwards compatible)", () => {
    const approval = createPendingApproval({
      type: "dm",
      requestingShip: "~zod",
    });
    const text = formatApprovalRequest(approval);
    expect(text).toContain("~zod");
    expect(text).not.toContain("(Zod)");
  });
});

describe("formatApprovalConfirmation", () => {
  it("shows nickname in confirmation", () => {
    const approval: PendingApproval = {
      id: "da1b2", type: "dm", requestingShip: "~sampel-palnet", timestamp: 1,
    };
    expect(formatApprovalConfirmation(approval, "approve", ctx)).toContain("~sampel-palnet (Sam)");
    expect(formatApprovalConfirmation(approval, "deny", ctx)).toContain("~sampel-palnet (Sam)");
    expect(formatApprovalConfirmation(approval, "block", ctx)).toContain("~sampel-palnet (Sam)");
  });

  it("channel confirmation shows channel name", () => {
    const approval: PendingApproval = {
      id: "cc3d4", type: "channel", requestingShip: "~zod",
      channelNest: "chat/~host/general", timestamp: 1,
    };
    expect(formatApprovalConfirmation(approval, "approve", ctx)).toContain("general (chat/~host/general)");
  });

  it("group confirmation shows group name", () => {
    const approval: PendingApproval = {
      id: "g5f6e", type: "group", requestingShip: "~zod",
      groupFlag: "~host/cool-group", timestamp: 1,
    };
    expect(formatApprovalConfirmation(approval, "approve", ctx)).toContain("Cool Group (~host/cool-group)");
  });

  it("works without context", () => {
    const approval: PendingApproval = {
      id: "da1b2", type: "dm", requestingShip: "~zod", timestamp: 1,
    };
    const text = formatApprovalConfirmation(approval, "approve");
    expect(text).toContain("~zod");
  });
});

// ---------------------------------------------------------------------------
// Admin Commands
// ---------------------------------------------------------------------------

describe("parseAdminCommand", () => {
  it("recognizes help aliases", () => {
    expect(parseAdminCommand("help")).toEqual({ type: "help" });
    expect(parseAdminCommand("commands")).toEqual({ type: "help" });
    expect(parseAdminCommand("?")).toEqual({ type: "help" });
    expect(parseAdminCommand("  HELP  ")).toEqual({ type: "help" });
  });

  it("recognizes blocked", () => {
    expect(parseAdminCommand("blocked")).toEqual({ type: "blocked" });
  });

  it("recognizes pending", () => {
    expect(parseAdminCommand("pending")).toEqual({ type: "pending" });
  });

  it("recognizes unblock with ship", () => {
    expect(parseAdminCommand("unblock ~sampel-palnet")).toEqual({
      type: "unblock",
      ship: "~sampel-palnet",
    });
  });

  it("returns null for non-commands", () => {
    expect(parseAdminCommand("hello")).toBeNull();
    expect(parseAdminCommand("approve")).toBeNull();
    expect(parseAdminCommand("unblock invalid")).toBeNull();
  });
});

describe("isAdminCommand", () => {
  it("recognizes all admin commands", () => {
    expect(isAdminCommand("help")).toBe(true);
    expect(isAdminCommand("commands")).toBe(true);
    expect(isAdminCommand("?")).toBe(true);
    expect(isAdminCommand("blocked")).toBe(true);
    expect(isAdminCommand("pending")).toBe(true);
    expect(isAdminCommand("unblock ~zod")).toBe(true);
  });

  it("rejects non-commands", () => {
    expect(isAdminCommand("hello")).toBe(false);
    expect(isAdminCommand("yes")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Blocked & Pending List Formatting
// ---------------------------------------------------------------------------

describe("formatBlockedList", () => {
  it("shows empty state", () => {
    expect(formatBlockedList([])).toBe("No ships are currently blocked.");
  });

  it("shows ships with nicknames", () => {
    const text = formatBlockedList(["~sampel-palnet", "~zod"], ctx);
    expect(text).toContain("~sampel-palnet (Sam)");
    expect(text).toContain("~zod (Zod)");
    expect(text).toContain("Blocked ships (2):");
    expect(text).toContain('unblock ~ship-name');
  });

  it("works without context", () => {
    const text = formatBlockedList(["~zod"]);
    expect(text).toContain("~zod");
    expect(text).not.toContain("(Zod)");
  });
});

describe("formatPendingList", () => {
  it("shows empty state", () => {
    expect(formatPendingList([])).toBe("No pending approval requests.");
  });

  it("shows short IDs with # prefix", () => {
    const approvals: PendingApproval[] = [
      { id: "da1b2", type: "dm", requestingShip: "~zod", timestamp: 1 },
    ];
    const text = formatPendingList(approvals);
    expect(text).toContain("#da1b2");
  });

  it("shows message previews", () => {
    const approvals: PendingApproval[] = [
      { id: "da1b2", type: "dm", requestingShip: "~zod", messagePreview: "Hello there", timestamp: 1 },
    ];
    const text = formatPendingList(approvals);
    expect(text).toContain('"Hello there"');
  });

  it("shows nicknames from context", () => {
    const approvals: PendingApproval[] = [
      { id: "da1b2", type: "dm", requestingShip: "~zod", timestamp: 1 },
    ];
    const text = formatPendingList(approvals, ctx);
    expect(text).toContain("~zod (Zod)");
  });

  it("shows channel names for channel approvals", () => {
    const approvals: PendingApproval[] = [
      { id: "cc3d4", type: "channel", requestingShip: "~zod", channelNest: "chat/~host/general", timestamp: 1 },
    ];
    const text = formatPendingList(approvals, ctx);
    expect(text).toContain("general (chat/~host/general)");
  });

  it("shows group names for group approvals", () => {
    const approvals: PendingApproval[] = [
      { id: "g5f6e", type: "group", requestingShip: "~zod", groupFlag: "~host/cool-group", timestamp: 1 },
    ];
    const text = formatPendingList(approvals, ctx);
    expect(text).toContain("Cool Group (~host/cool-group)");
  });

  it("includes usage hint", () => {
    const approvals: PendingApproval[] = [
      { id: "da1b2", type: "dm", requestingShip: "~zod", timestamp: 1 },
    ];
    const text = formatPendingList(approvals);
    expect(text).toContain("yes/no/block");
  });
});

// ---------------------------------------------------------------------------
// Help Text
// ---------------------------------------------------------------------------

describe("formatHelpText", () => {
  it("includes all command categories", () => {
    const text = formatHelpText();
    expect(text).toContain("yes");
    expect(text).toContain("no");
    expect(text).toContain("block");
    expect(text).toContain("ban");
    expect(text).toContain("pending");
    expect(text).toContain("blocked");
    expect(text).toContain("unblock");
    expect(text).toContain("help");
  });
});

// ---------------------------------------------------------------------------
// Utility Functions
// ---------------------------------------------------------------------------

describe("removePendingApproval", () => {
  it("removes by ID", () => {
    const approvals: PendingApproval[] = [
      { id: "da1b2", type: "dm", requestingShip: "~zod", timestamp: 1 },
      { id: "cc3d4", type: "channel", requestingShip: "~bus", timestamp: 2 },
    ];
    const result = removePendingApproval(approvals, "da1b2");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("cc3d4");
  });
});

describe("hasDuplicatePending", () => {
  const approvals: PendingApproval[] = [
    { id: "da1b2", type: "dm", requestingShip: "~zod", timestamp: 1 },
    { id: "cc3d4", type: "channel", requestingShip: "~bus", channelNest: "chat/~host/general", timestamp: 2 },
  ];

  it("detects DM duplicates", () => {
    expect(hasDuplicatePending(approvals, "dm", "~zod")).toBe(true);
    expect(hasDuplicatePending(approvals, "dm", "~bus")).toBe(false);
  });

  it("detects channel duplicates by nest", () => {
    expect(hasDuplicatePending(approvals, "channel", "~bus", "chat/~host/general")).toBe(true);
    expect(hasDuplicatePending(approvals, "channel", "~bus", "chat/~host/other")).toBe(false);
  });
});
