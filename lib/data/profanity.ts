// Stub profanity filter — SPEC.md 5.4, "Known gaps" (CLAUDE.md). English-only
// placeholder list; real word list + language coverage (other SA languages)
// is a later sourcing decision, see SPEC.md section 12.

const BANNED_WORDS = new Set([
  "fuck",
  "shit",
  "bitch",
  "bastard",
  "cunt",
  "dick",
  "piss",
  "asshole",
  "whore",
  "slut",
  "nigger",
  "faggot",
  "retard",
]);

/**
 * Whole-word token match against the stub list — deliberately not a naive
 * substring check, so a word like "classic" (contains "ass") doesn't false-
 * positive (the "Scunthorpe problem").
 */
export function containsProfanity(text: string): boolean {
  const tokens = text.toLowerCase().match(/[a-z']+/g) ?? [];
  return tokens.some((token) => BANNED_WORDS.has(token));
}
