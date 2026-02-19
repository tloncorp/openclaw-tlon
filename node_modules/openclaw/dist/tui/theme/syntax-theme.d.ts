type HighlightTheme = Record<string, (text: string) => string>;
/**
 * Syntax highlighting theme for code blocks.
 * Uses chalk functions to style different token types.
 */
export declare function createSyntaxTheme(fallback: (text: string) => string): HighlightTheme;
export {};
