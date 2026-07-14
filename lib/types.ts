// Data model — SPEC.md section 7.

export type Side = "home" | "away";
export type Position = "GK" | "DEF" | "MID" | "ST";
export type Era = "current" | "legend";
export type PlayerSource = "database" | "custom";

export interface Player {
  id: string;
  name: string;
  position: Position;
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
}

export type MatchStatus = "loading" | "live" | "finished";

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  events: CommentaryEvent[];
  finalScore: { home: number; away: number };
  narrativeDescriptor: string;
  status: MatchStatus;
}

export type AuthProvider = "facebook" | "google" | "apple" | "email";

export interface User {
  id: string;
  authProvider: AuthProvider;
  signedInAt: number;
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
