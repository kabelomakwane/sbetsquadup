import { useEffect, useState } from "react";
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
  deleteSavedSquad: (id: string) => void;

  matchHistory: MatchHistory[];
  addMatchHistory: (entry: MatchHistory) => void;

  // Profile "Play"/"Rematch" pre-fill (SPEC.md 5.12) — distinct from
  // `rematch()` below, which wipes both squads for Match Summary's own
  // "Rematch" button. These load *specific* teams instead.
  loadSavedSquad: (team: Team) => void;
  loadMatchTeams: (match: Match) => void;

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
      // Keyed on team.id: React StrictMode double-invokes the Loading
      // screen's effect (SPEC.md 9), so this has to tolerate being called
      // twice with the same squad rather than relying on the caller to
      // guard it.
      addSavedSquad: (squad) =>
        set((state) =>
          state.savedSquads.some((saved) => saved.team.id === squad.team.id)
            ? state
            : { savedSquads: [...state.savedSquads, squad] },
        ),
      deleteSavedSquad: (id) =>
        set((state) => ({ savedSquads: state.savedSquads.filter((squad) => squad.id !== id) })),

      matchHistory: [],
      // Keyed on match.id, same StrictMode double-invoke reasoning as above.
      addMatchHistory: (entry) =>
        set((state) =>
          state.matchHistory.some((saved) => saved.match.id === entry.match.id)
            ? state
            : { matchHistory: [...state.matchHistory, entry] },
        ),

      // Loads `team` into its own side, clears the OTHER side to empty
      // (SPEC.md 5.12) — fresh ids on both so Kick Off's dedupe-by-team.id
      // treats a replayed/edited squad as its own new SavedSquad snapshot.
      loadSavedSquad: (team) => {
        const otherSide: Side = team.side === "home" ? "away" : "home";
        set({
          [team.side === "home" ? "homeTeam" : "awayTeam"]: { ...team, id: crypto.randomUUID() },
          [otherSide === "home" ? "homeTeam" : "awayTeam"]: emptyTeam(otherSide),
        });
      },
      loadMatchTeams: (match) =>
        set({
          homeTeam: { ...match.homeTeam, id: crypto.randomUUID() },
          awayTeam: { ...match.awayTeam, id: crypto.randomUUID() },
        }),

      rematch: () => {
        get().resetSquads();
        set({ match: null, matchPlaybackStarted: false });
      },
    }),
    {
      name: "squad-up-store",
      // match/matchPlaybackStarted must survive a hard tab close, not just
      // in-session navigation: SPEC.md 9's mid-match exit rule is that a
      // generated Match is persisted the instant it exists, so re-opening
      // mid-playback (or after finishing) skips straight to the result
      // instead of replaying. savedSquads/matchHistory are the profile
      // persistence the same section requires.
      partialize: (state) => ({
        ageConfirmed: state.ageConfirmed,
        user: state.user,
        match: state.match,
        matchPlaybackStarted: state.matchPlaybackStarted,
        savedSquads: state.savedSquads,
        matchHistory: state.matchHistory,
      }),
    },
  ),
);

// Next server-renders these client components without localStorage, using
// each field's default (match: null, etc.); the client's first render must
// match that exactly or React discards the mismatched output and falls back
// to the server's stale values for a beat, which is what actually causes a
// "no match" check to misfire on a hard reload — not an async delay in
// zustand's own hydration (persist's localStorage read resolves
// synchronously, before any component ever renders). The fix is the
// standard one for this: report "not hydrated" through the first render,
// then flip true in an effect, since effects only run once React's own
// hydration pass has settled.
export function useHasHydrated(): boolean {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    // Deliberate: this is the standard "only true after mount" flag for
    // avoiding an SSR/client hydration mismatch, not state derived from a
    // prop — it can only ever run in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasHydrated(true);
  }, []);
  return hasHydrated;
}
