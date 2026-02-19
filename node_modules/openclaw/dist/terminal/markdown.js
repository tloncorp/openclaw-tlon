import { hasBinary } from "../agents/skills.js";
import { runCommandWithTimeout } from "../process/exec.js";
const DEFAULT_RENDER_TIMEOUT_MS = 10_000;
function resolveNodeRunner() {
    if (hasBinary("pnpm"))
        return { cmd: "pnpm", args: ["dlx"] };
    if (hasBinary("npx"))
        return { cmd: "npx", args: ["-y"] };
    throw new Error("Missing pnpm or npx; install a Node package runner.");
}
async function runNodeTool(tool, toolArgs, options) {
    const runner = resolveNodeRunner();
    const argv = [runner.cmd, ...runner.args, tool, ...toolArgs];
    return await runCommandWithTimeout(argv, {
        timeoutMs: options.timeoutMs ?? DEFAULT_RENDER_TIMEOUT_MS,
        input: options.input,
    });
}
async function runTool(tool, toolArgs, options) {
    if (hasBinary(tool)) {
        return await runCommandWithTimeout([tool, ...toolArgs], {
            timeoutMs: options.timeoutMs ?? DEFAULT_RENDER_TIMEOUT_MS,
            input: options.input,
        });
    }
    return await runNodeTool(tool, toolArgs, options);
}
export async function renderMarkdownWithMarkdansi(markdown, opts) {
    const input = markdown.trimEnd();
    const width = process.stdout.columns ?? 0;
    const args = width > 0 ? ["--width", String(width)] : [];
    try {
        const res = await runTool("markdansi", args, {
            timeoutMs: opts?.timeoutMs ?? DEFAULT_RENDER_TIMEOUT_MS,
            input,
        });
        if (res.code === 0 && res.stdout.trim()) {
            return res.stdout.trimEnd();
        }
    }
    catch {
        // ignore
    }
    return input;
}
