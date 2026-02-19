const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
export function renderProgressBarLine(params) {
    const barWidth = Math.max(10, params.barWidth ?? 24);
    const frame = Math.max(0, params.frame | 0);
    const spinner = SPINNER_FRAMES[frame % SPINNER_FRAMES.length] ?? "*";
    if (params.indeterminate || params.percent == null) {
        const seg = Math.max(3, Math.floor(barWidth / 4));
        const cycle = barWidth + seg;
        const pos = frame % cycle;
        const start = pos - seg;
        const cells = new Array(barWidth).fill("░");
        for (let i = 0; i < seg; i += 1) {
            const idx = start + i;
            if (idx >= 0 && idx < barWidth)
                cells[idx] = "█";
        }
        return `${spinner} ${params.label} [${cells.join("")}]`;
    }
    const percent = Math.max(0, Math.min(100, Math.round(params.percent)));
    const filled = Math.max(0, Math.min(barWidth, Math.round((percent / 100) * barWidth)));
    const cells = new Array(barWidth).fill("░");
    for (let i = 0; i < filled; i += 1)
        cells[i] = "█";
    if (filled >= 0 && filled < barWidth) {
        const headFrames = ["▏", "▎", "▍", "▌", "▋", "▊", "▉"];
        cells[filled] = headFrames[frame % headFrames.length] ?? "█";
    }
    return `${spinner} ${params.label} [${cells.join("")}] ${percent}%`;
}
