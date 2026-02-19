export function mdEscape(text) {
    return text.replace(/[|`]/g, "\\$&");
}
export function mdTable(rows, columns) {
    const header = `| ${columns.join(" | ")} |`;
    const sep = `| ${columns.map(() => "---").join(" | ")} |`;
    const body = rows
        .map((row) => `| ${columns.map((c) => row[c] ?? "").join(" | ")} |`)
        .join("\n");
    return [header, sep, body].filter(Boolean).join("\n");
}
export function mdIndentedCodeBlock(lines, indent = "  ") {
    const indented = (value) => `${indent}${value}`;
    return [indented("```"), ...lines.map(indented), indented("```")];
}
