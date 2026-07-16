import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  POSITION_SLOTS,
  type Match,
  type MatchHistory,
  type Player,
  type SavedSquad,
  type Side,
  type Team,
  type User,
} from "@/lib/types";

function emptyTeam(side: Side): Team {
  return {
    id: crypto.randomUUID(),
    side,
    name: "",
    players: new Array(POSITION_SLOTS.length).fill(undefined),
  };
}

interface SquadUpState {
  // Age gate — SPEC.md 5.1, persists across visits.
  ageConfirmed: boolean;
  confirmAge: () => void;

  // Squad selections — SPEC.md 5.4.
  homeTeam: Team;
  awayTeam: Team;
  setTeamName: (side: Side, name: string) => void;
  setPlayer: (side: Side, index: number, player: Player) => void;
  clearTeam: (side: Side) => void;
  resetSquads: () => void;

  // Match state — SPEC.md 8.
  match: Match | null;
  setMatch: (match: Match | null) => void;

  // Live Commentary playback (SPEC.md 5.7/9): true once the paced reveal has
  // started for the current match, so a mid-match exit (or a finished match)
  // sends any re-entry straight to the result instead of replaying the feed.
  matchPlaybackStarted: boolean;
  markMatchPlaybackStarted: () => void;

  // Auth — SPEC.md 9, mocked.
  user: User | null;
  isSignedIn: () => boolean;
  signIn: (user: User) => void;
  signOut: () => void;

  // Saved squads / history — SPEC.md 7.
  savedSquads: SavedSquad[];
  addSavedSquad: (squad: SavedSquad) => void;

  matchHistory: MatchHistory[];
  addMatchHistory: (entry: MatchHistory) => void;

  // Match Summary "Rematch" — SPEC.md 4, step 7: back to Team Picker, squads reset.
  rematch: () => void;
}

export const useSquadUpStore = create<SquadUpState>()(
  persist(
    (set, get) => ({
      ageConfirmed: false,
      confirmAge: () => set({ ageConfirmed: true }),

      homeTeam: emptyTeam("home"),
      awayTeam: emptyTeam("away"),
      setTeamName: (side, name) =>
        set((state) => ({
          [side === "home" ? "homeTeam" : "awayTeam"]: {
            ...state[side === "home" ? "homeTeam" : "awayTeam"],
            name,
          },
        })),
      setPlayer: (side, index, player) =>
        set((state) => {
          const key = side === "home" ? "homeTeam" : "awayTeam";
          const players = [...state[key].players];
          players[index] = player;
          return { [key]: { ...state[key], players } };
        }),
      clearTeam: (side) =>
        set({ [side === "home" ? "homeTeam" : "awayTeam"]: emptyTeam(side) }),
      resetSquads: () =>
        set({ homeTeam: emptyTeam("home"), awayTeam: emptyTeam("away") }),

      match: null,
      setMatch: (match) => set({ match, matchPlaybackStarted: false }),

      matchPlaybackStarted: false,
      markMatchPlaybackStarted: () => set({ matchPlaybackStarted: true }),

      user: null,
      isSignedIn: () => get().user !== null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),

      savedSquads: [],
      addSavedSquad: (squad) =>
        set((state) => ({ savedSquads: [...state.savedSquads, squad] })),

      matchHistory: [],
      addMatchHistory: (entry) =>
        set((state) => ({ matchHistory: [...state.matchHistory, entry] })),

      rematch: () => {
        get().resetSquads();
        set({ match: null, matchPlaybackStarted: false });
      },
    }),
    {
      name: "squad-up-store",
      partialize: (state) => ({
        ageConfirmed: state.ageConfirmed,
        user: state.user,
      }),
    },
  ),
);
