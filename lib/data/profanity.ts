// Stub profanity filter — SPEC.md 5.4, "Known gaps" (CLAUDE.md). English-only
// placeholder list; real word list + language coverage (other SA languages)
// is a later sourcing decision, see SPEC.md section 12.

// Whole-word match means inflections need listing explicitly (no stemming in a stub).
const BANNED_WORDS = new Set([
  "fuck",
  "fucker",
  "fucking",
  "fucked",
  "motherfucker",
  "shit",
  "shitty",
  "shithead",
  "bitch",
  "bitches",
  "bitchy",
  "bastard",
  "bastards",
  "cunt",
  "cunts",
  "dick",
  "dickhead",
  "piss",
  "pissed",
  "pissing",
  "asshole",
  "assholes",
  "whore",
  "whores",
  "slut",
  "sluts",
  "nigger",
  "niggers",
  "faggot",
  "faggots",
  "retard",
  "retarded",
  "retards",
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
