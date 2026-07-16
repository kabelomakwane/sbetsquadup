// Stub team-name suggestions for Randomise — SPEC.md 5.4. Curated, developer-
// controlled list, so it deliberately skips the profanity filter (that's for
// free text; see CLAUDE.md "Known gaps" for the real sourcing note pattern).

export const TEAM_NAME_SUGGESTIONS: string[] = [
  "Ballerz FC",
  "One Touch United",
  "Ironclad Athletic",
  "Thunder Rovers",
  "Crimson City",
  "Golden Boot FC",
  "Midnight Rangers",
  "Stormbreakers United",
  "Ridgeline Rovers",
  "Blackwood Athletic",
  "Riverside FC",
  "Iron Lions",
  "Nova Strikers",
  "Highland Rangers",
  "Coastal City FC",
  "Redline United",
  "Silverback Athletic",
  "Vanguard FC",
  "Northside Rovers",
  "Comet City",
  "Granite Athletic",
  "Wildfire United",
  "Fortress FC",
  "Skyline Rangers",
  "Last Minute United",
  "Sunday League Legends",
  "Boots & Banter FC",
  "Kop of the Morning",
];

export function randomTeamName(): string {
  return TEAM_NAME_SUGGESTIONS[Math.floor(Math.random() * TEAM_NAME_SUGGESTIONS.length)];
}
