// Data model — SPEC.md section 7.

export type Side = "home" | "away";
export type Position = "GK" | "DEF" | "MID" | "ST";
export type Era = "current" | "legend";
export type PlayerSource = "database" | "custom";

export interface Player {
  id: string;
  name: string;
  // Ordered, first entry is the primary/natural position. A slot elsewhere
  // (Team Picker) not in this list is still selectable, just "out of
  // position" — see SPEC.md 8.1 for the match-simulation rating penalty.
  positions: Position[];
  club: string;
  overallRating: number;
  era: Era;
  source: PlayerSource;
}

export interface LineupEntry {
  player: Player;
  goals: number;
}

// Fixed slot order for the 5 position-tagged rows on the Team Picker — SPEC.md 5.4.
export const POSITION_SLOTS: readonly Position[] = ["ST", "MID", "MID", "DEF", "GK"];

export interface Team {
  id: string;
  side: Side;
  name: string;
  // Sparse, fixed-length (POSITION_SLOTS.length) — index i holds the pick for POSITION_SLOTS[i].
  players: (Player | undefined)[];
}

export type CommentaryEventType = "goal" | "chance" | "card" | "commentary";

export interface CommentaryEvent {
  minute: number;
  type: CommentaryEventType;
  text: string;
  side: Side | null;
  // Present only for two-line "highlight" events (goals, saves, posts,
  // last-ditch defensive plays) — SPEC.md 5.7/8.1.
  headline?: string;
  // Present only on "goal" events — the scoring Player's id, so per-player
  // goal tallies (Lineups tab, Share Image ball icons — SPEC.md 5.9/5.10,
  // LineupEntry.goals in section 7) can be derived from the event list
  // without re-simulating anything.
  scorerId?: string;
}

export type MatchStatus = "loading" | "live" | "finished";

// Derived (not separately simulated) — SPEC.md 8.1 step 5.
export interface TeamMatchStats {
  shots: number;
  shotsOnTarget: number;
  possession: number; // 0-100, home + away sum to 100
  passes: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  events: CommentaryEvent[];
  finalScore: { home: number; away: number };
  narrativeDescriptor: string;
  status: MatchStatus;
  stats: { home: TeamMatchStats; away: TeamMatchStats };
}

export type AuthProvider = "facebook" | "google" | "apple" | "email";

export interface User {
  id: string;
  authProvider: AuthProvider;
  signedInAt: number;
  // Generated once at mock login() time — SPEC.md 5.12. A real OAuth
  // provider would supply this directly instead.
  name: string;
}

export interface SavedSquad {
  id: string;
  userId: string;
  team: Team;
  createdAt: number;
}

export interface MatchHistory {
  id: string;
  userId: string;
  match: Match;
  playedAt: number;
}
