// Goal-scorer likelihood hierarchy — SPEC.md 8.1 step 4: the squad's single
// highest-rated player first, then remaining Strikers, Midfielders,
// Defenders, then the Goalkeeper (rare, still possible). "Strikers" etc.
// means whoever occupies that slot, not the occupant's own `positions` list.

import type { Rng } from "./rng";
import { weightedPick } from "./rng";
import type { SlotRating } from "./rating";

const SLOT_PRIORITY: Record<string, number> = { ST: 0, MID: 1, DEF: 2, GK: 3 };

// Rank-based weights for the 5 slots in priority order — front-loaded so the
// top-priority slot scores most often, while the last (usually GK) stays a
// rare but non-zero possibility.
const SCORER_WEIGHTS = [5, 4, 3, 2, 1];

/** Returns the team's 5 slots ordered from most to least likely goal-scorer. */
export function scorerPriority(slots: SlotRating[]): SlotRating[] {
  const highestRated = slots.reduce((best, slot) => (slot.rating > best.rating ? slot : best));
  const rest = slots
    .filter((slot) => slot !== highestRated)
    .sort((a, b) => {
      const priorityDiff = SLOT_PRIORITY[a.position] - SLOT_PRIORITY[b.position];
      return priorityDiff !== 0 ? priorityDiff : b.rating - a.rating;
    });
  return [highestRated, ...rest];
}

export function pickScorer(rng: Rng, priority: SlotRating[]): SlotRating {
  return weightedPick(rng, priority, SCORER_WEIGHTS);
}
