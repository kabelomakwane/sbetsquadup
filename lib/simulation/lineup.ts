// Per-player goal tallies derived from a simulated Match's event list —
// SPEC.md 5.9/5.10 (Lineups tab, Share Image ball icons) and section 7's
// LineupEntry.goals. Not tracked as separate state: the goal events already
// carry `scorerId` (SPEC.md 8.1 step 4), so this just re-derives counts from
// the single source of truth rather than duplicating it.

import { POSITION_SLOTS, type Match, type Player, type Position, type Team } from "@/lib/types";

/** Maps playerId -> goals scored, counted from the match's goal events. */
export function playerGoalCounts(match: Match): Map<string, number> {
  const counts = new Map<string, number>();
  for (const event of match.events) {
    if (event.type !== "goal" || !event.scorerId) continue;
    counts.set(event.scorerId, (counts.get(event.scorerId) ?? 0) + 1);
  }
  return counts;
}

export interface LineupRow {
  position: Position;
  player: Player;
  goals: number;
}

/** A team's 5 picked players in slot order, paired with each one's goal tally. */
export function teamLineupRows(team: Team, goalCounts: Map<string, number>): LineupRow[] {
  return POSITION_SLOTS.map((position, index) => {
    const player = team.players[index];
    if (!player) return null;
    return { position, player, goals: goalCounts.get(player.id) ?? 0 };
  }).filter((row): row is LineupRow => row !== null);
}
