/**
 * Command parsing utilities for the tlon_run tool
 */

/**
 * Shell-like argument splitter: respects double and single quotes so that
 * `posts reply chat/~host/slug 12345 "Hello, this is my reply"` produces
 * ["posts", "reply", "chat/~host/slug", "12345", "Hello, this is my reply"]
 * instead of shattering the quoted string on whitespace.
 */
export function shellSplit(str: string): string[] {
  const args: string[] = [];
  let cur = "";
  let inDouble = false;
  let inSingle = false;
  let escape = false;

  for (const ch of str) {
    if (escape) {
      cur += ch;
      escape = false;
      continue;
    }
    if (ch === "\\" && !inSingle) {
      escape = true;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (/\s/.test(ch) && !inDouble && !inSingle) {
      if (cur) {
        args.push(cur);
        cur = "";
      }
      continue;
    }
    cur += ch;
  }
  if (cur) {args.push(cur);}
  return args;
}

/**
 * Parse a named option from args (e.g., --limit 10)
 * Returns the value if found, undefined otherwise
 */
export function getOption(args: string[], name: string): string | undefined {
  const flag = `--${name}`;
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1] && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return undefined;
}

/**
 * Check if a flag is present in args (e.g., --resolve-cites)
 */
export function hasFlag(args: string[], name: string): boolean {
  return args.includes(`--${name}`);
}

/**
 * Parse limit option from args, with a default value
 */
export function parseLimit(args: string[], defaultLimit = 20): number {
  const limitStr = getOption(args, "limit");
  if (limitStr) {
    const parsed = parseInt(limitStr, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return defaultLimit;
}

/**
 * Remove option and its value from args array
 * Returns a new array without the option
 */
export function removeOption(args: string[], name: string): string[] {
  const flag = `--${name}`;
  const result: string[] = [];
  let skipNext = false;

  for (const arg of args) {
    if (skipNext) {
      skipNext = false;
      continue;
    }
    if (arg === flag) {
      skipNext = true;
      continue;
    }
    result.push(arg);
  }
  return result;
}

/**
 * Remove a flag (no value) from args array
 */
export function removeFlag(args: string[], name: string): string[] {
  const flag = `--${name}`;
  return args.filter((arg) => arg !== flag);
}

/**
 * Get remaining args after removing known options
 */
export function getRemainingArgs(
  args: string[],
  optionNames: string[],
  flagNames: string[] = [],
): string[] {
  let result = [...args];
  for (const opt of optionNames) {
    result = removeOption(result, opt);
  }
  for (const flag of flagNames) {
    result = removeFlag(result, flag);
  }
  return result;
}
