import fs from "node:fs/promises";
import path from "node:path";
import { resolveUserPath } from "../../utils.js";
const PROMPT_NAME_RE = /^[a-z0-9_-]+$/i;
export function parseSlashCommand(input) {
    const trimmed = input.trim();
    if (!trimmed.startsWith("/"))
        return null;
    const match = trimmed.match(/^\/([^\s]+)(?:\s+([\s\S]+))?$/);
    if (!match)
        return null;
    const name = match[1]?.trim();
    if (!name)
        return null;
    const args = match[2]?.trim();
    return { name, args: args || undefined };
}
export function stripFrontMatter(input) {
    if (!input.startsWith("---"))
        return input;
    const match = input.match(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/);
    return match ? input.slice(match[0].length) : input;
}
export async function resolveCodexPrompt(commandName, env = process.env) {
    const normalized = commandName.trim().toLowerCase();
    if (!PROMPT_NAME_RE.test(normalized))
        return null;
    const home = env.CODEX_HOME?.trim()
        ? resolveUserPath(env.CODEX_HOME.trim())
        : resolveUserPath("~/.codex");
    const promptsDir = path.join(home, "prompts");
    let entries = null;
    try {
        entries = await fs.readdir(promptsDir, { withFileTypes: true });
    }
    catch {
        return null;
    }
    const match = entries.find((entry) => {
        if (!entry.isFile())
            return false;
        const base = path.parse(entry.name).name.toLowerCase();
        return base === normalized;
    });
    if (!match)
        return null;
    const promptPath = path.join(promptsDir, match.name);
    try {
        const raw = await fs.readFile(promptPath, "utf-8");
        const body = stripFrontMatter(raw).trim();
        if (!body)
            return null;
        return { path: promptPath, body };
    }
    catch {
        return null;
    }
}
export function renderCodexPrompt(params) {
    const args = params.args?.trim() ?? "";
    const tokens = args ? args.split(/\s+/) : [];
    return params.body.replace(/\$(\d+|\*|@|0)/g, (match, token) => {
        if (token === "*" || token === "@")
            return args;
        if (token === "0")
            return params.commandName ?? "";
        const index = Number(token);
        if (!Number.isFinite(index) || index < 1)
            return match;
        return tokens[index - 1] ?? "";
    });
}
