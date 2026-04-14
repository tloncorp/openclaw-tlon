/**
 * Verbosity Scoring Utilities
 *
 * Pattern-based metrics for measuring inner monologue, filler, hedging,
 * and self-narration in bot responses. Used by the verbosity test harness
 * to compare before/after prompt changes.
 */

export interface VerbosityMetrics {
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  fillerHits: number;
  hedgingHits: number;
  narrationHits: number;
  fillerMatches: string[];
  hedgingMatches: string[];
  narrationMatches: string[];
}

/** Gratuitous openers and closers that add no information. */
export const FILLER_PATTERNS: RegExp[] = [
  /^(great|good|excellent|wonderful|fantastic)\s+(question|ask)/i,
  /^(sure|absolutely|of course|certainly)[!,]/i,
  /hope\s+th(at|is)\s+helps/i,
  /let\s+me\s+know\s+if/i,
  /feel\s+free\s+to/i,
  /happy\s+to\s+help/i,
];

/** Unnecessary hedging when the model isn't genuinely uncertain. */
export const HEDGING_PATTERNS: RegExp[] = [
  /\bi\s+think\b/i,
  /\bit\s+seems?\s+like\b/i,
  /\bbased\s+on\s+my\s+(understanding|analysis|knowledge)\b/i,
  /\bit'?s?\s+worth\s+noting\b/i,
  /\bif\s+i'?m\s+not\s+mistaken\b/i,
];

/** Self-narration and thinking-out-loud in the visible response. */
export const NARRATION_PATTERNS: RegExp[] = [
  /\blet\s+me\s+(look|check|search|find|see|think)\b/i,
  /\bhere'?s?\s+what\s+i\s+found\b/i,
  /\bafter\s+(checking|looking|searching|reviewing)\b/i,
  /\bi'?ll\s+(help|assist|look|search|check)\b/i,
  /\bbased\s+on\s+(what\s+i|my\s+search|the\s+results)\b/i,
  /\bhmm,?\s/i,
  /\blet\s+me\s+think\b/i,
  /\bi\s+need\s+to\s+consider\b/i,
  /\bso\s+if\s+(i|we)\s+(look|think|consider)\b/i,
  /\byeah,?\s+that\s+should\b/i,
];

function matchPatterns(text: string, patterns: RegExp[]): string[] {
  const matches: string[] = [];
  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match) {
      matches.push(match[0]);
    }
  }
  return matches;
}

function countSentences(text: string): number {
  // Split on sentence-ending punctuation followed by whitespace or end of string.
  const sentences = text.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().length > 0);
  return Math.max(sentences.length, 1);
}

export function scoreResponse(text: string): VerbosityMetrics {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);

  const fillerMatches = matchPatterns(trimmed, FILLER_PATTERNS);
  const hedgingMatches = matchPatterns(trimmed, HEDGING_PATTERNS);
  const narrationMatches = matchPatterns(trimmed, NARRATION_PATTERNS);

  return {
    wordCount: words.length,
    charCount: trimmed.length,
    sentenceCount: countSentences(trimmed),
    fillerHits: fillerMatches.length,
    hedgingHits: hedgingMatches.length,
    narrationHits: narrationMatches.length,
    fillerMatches,
    hedgingMatches,
    narrationMatches,
  };
}
