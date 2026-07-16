// Effective rating and attack/defense scores — SPEC.md 8.1 steps 0-1.

import { POSITION_SLOTS, type Player, type Position, type Team } from "@/lib/types";

const OUT_OF_POSITION_PENALTY = 10;

/**
 * A slot's occupant doesn't have to have that slot's position in their
 * `positions` list (SPEC.md 5.4/7). Flat, binary penalty rather than graded
 * by "how far" the position is — see SPEC.md 8.1 step 0 for why. Applies
 * uniformly to all 5 slots, GK included.
 */
export function effectiveRating(player: Player, slotPosition: Position): number {
  return player.overallRating - (player.positions.includes(slotPosition) ? 0 : OUT_OF_POSITION_PENALTY);
}

export interface SlotRating {
  index: number;
  position: Position;
  player: Player;
  rating: number;
}

/** Requires a fully-populated team (all 5 slots filled) — enforced upstream by Kick Off. */
export function slotRatings(team: Team): SlotRating[] {
  return POSITION_SLOTS.map((position, index) => {
    const player = team.players[index];
    if (!player) {
      throw new Error(`simulateMatch: ${team.side} team slot ${index} (${position}) is empty`);
    }
    return { index, position, player, rating: effectiveRating(player, position) };
  });
}

export interface AttackDefense {
  attack: number;
  defense: number;
}

export function attackDefense(slots: SlotRating[]): AttackDefense {
  const st = slots.find((slot) => slot.position === "ST")!;
  const mids = slots.filter((slot) => slot.position === "MID");
  const def = slots.find((slot) => slot.position === "DEF")!;
  const gk = slots.find((slot) => slot.position === "GK")!;

  const attack = (st.rating * 1.5 + mids[0].rating + mids[1].rating) / 3.5;
  const defense = (gk.rating * 1.2 + def.rating) / 2.2;

  return { attack, defense };
}
