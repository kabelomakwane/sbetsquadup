// Stub display-name suggestions for the mocked login() — SPEC.md 5.12.
// Curated, developer-controlled list, so it deliberately skips the
// profanity filter (that's for free text; see CLAUDE.md "Known gaps" for
// the real sourcing note pattern) — same reasoning as teamNames.ts.

export const DISPLAY_NAME_SUGGESTIONS: string[] = [
  "Boot Room Gaffer",
  "Tactics Board Tony",
  "The Armchair Gaffer",
  "Set-Piece Specialist",
  "Sunday League Legend",
  "Fourth Official",
  "Golden Boot Hopeful",
  "Dugout Dave",
  "Late Winner Larry",
  "Offside Trap Queen",
  "Clean Sheet Chaser",
  "Transfer Window Wizard",
  "Nutmeg Nancy",
  "Long Ball Larry",
  "Corner Flag Kev",
  "The Gegenpress Guru",
  "Halftime Team Talk",
  "Backpass Barry",
  "Woodwork Warrior",
  "Extra Time Ellie",
  "The Super Sub",
  "Formation Fanatic",
  "Byline Betty",
  "Deadball Danny",
  "Injury Time Idol",
  "The Cup Final Kid",
  "Press Box Pundit",
  "Free Kick Freddie",
];

export function randomDisplayName(): string {
  return DISPLAY_NAME_SUGGESTIONS[Math.floor(Math.random() * DISPLAY_NAME_SUGGESTIONS.length)];
}
