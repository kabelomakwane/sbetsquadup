// Career stats for Profile's Stats tab — SPEC.md 5.12. Pure, client-side
// derivation from a user's MatchHistory, no new persisted fields.
//
// Won/Drawn/Lost convention: the user builds BOTH the home and away squad
// every match (SPEC.md 5.4), so there's no persistent "my team" to score a
// personal record against. This computes from a fixed home-side
// perspective (a "win" is the home squad winning that match) — an
// arbitrary but deterministic convention, not a true personal record.

import type { MatchHistory } from "@/lib/types";

export interface CareerStats {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  winPercentage: number;
}

export function computeCareerStats(history: MatchHistory[]): CareerStats {
  let won = 0;
  let drawn = 0;
  let lost = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  for (const entry of history) {
    const { home, away } = entry.match.finalScore;
    goalsFor += home;
    goalsAgainst += away;
    if (home > away) won++;
    else if (home < away) lost++;
    else drawn++;
  }

  const played = history.length;
  const winPercentage = played > 0 ? Math.round((won / played) * 100) : 0;

  return { played, won, drawn, lost, goalsFor, goalsAgainst, winPercentage };
}
