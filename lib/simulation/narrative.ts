// Result narrative library and selection logic — SPEC.md 8.2.

import type { Player, Team } from "@/lib/types";
import type { Rng } from "./rng";
import { pick } from "./rng";

export const NARROW_WIN_PHRASES = [
  "IN A NAIL-BITER",
  "BY THE SLIMMEST OF MARGINS",
  "IN A CAGEY AFFAIR",
  "AFTER A TENSE BATTLE",
  "IN A TIGHT ONE",
  "ON A KNIFE'S EDGE",
];

export const COMFORTABLE_WIN_PHRASES = [
  "IN CONVINCING FASHION",
  "WITH ROOM TO SPARE",
  "IN STYLE",
  "COMFORTABLY",
  "WITH AUTHORITY",
  "IN CONTROL FROM START TO FINISH",
];

export const LANDSLIDE_PHRASES = [
  "IN A LANDSLIDE",
  "IN A ROUT",
  "IN A MASTERCLASS",
  "WITHOUT BREAKING A SWEAT",
  "IN EMPHATIC FASHION",
  "IN A ONE-SIDED THRILLER",
];

const HIGH_SCORING_STATIC_PHRASES = [
  "IN A HIGH-SCORING THRILLER",
  "IN A GOAL FEST",
  "IN AN ATTACKING SHOWCASE",
  "IN A SHOOTOUT",
];

export const LOW_SCORING_PHRASES = [
  "IN A DEFENSIVE MASTERCLASS",
  "IN A GRIND",
  "IN A LOW-SCORING AFFAIR",
  "ON THE BACK OF A SOLID DEFENSE",
];

export const DRAW_PHRASES = [
  "SHARE THE SPOILS",
  "PLAY OUT A DRAW",
  "CAN'T BE SEPARATED",
  "BATTLE TO A STALEMATE",
  "SPLIT THE POINTS",
  "END IT ALL SQUARE",
];

const HAT_TRICK_PHRASE_TEMPLATES = [
  "AS {Player} BAGS A HAT-TRICK!",
  "BEHIND A {Player} HAT-TRICK MASTERCLASS!",
  "AS {Player} STEALS THE SHOW WITH THREE!",
];

export const LAST_GASP_PHRASES = [
  "WITH A LATE, LATE WINNER!",
  "AT THE DEATH!",
  "WITH A DRAMATIC LAST-MINUTE STRIKE!",
];

function pickHighScoringPhrase(rng: Rng, totalGoals: number): string {
  const options = [...HIGH_SCORING_STATIC_PHRASES, `IN A ${totalGoals}-GOAL SPECTACLE`];
  return pick(rng, options);
}

export interface HatTrickScorer {
  player: Player;
  goals: number;
}

/** Highest tally of 3+ across both squads; ties break toward home, then slot order. */
export function findHatTrickScorer(
  homeTally: Map<Player, number>,
  awayTally: Map<Player, number>,
): HatTrickScorer | null {
  let best: HatTrickScorer | null = null;
  for (const tally of [homeTally, awayTally]) {
    for (const [player, goals] of tally) {
      if (goals >= 3 && (!best || goals > best.goals)) {
        best = { player, goals };
      }
    }
  }
  return best;
}

export interface NarrativeInput {
  homeTeam: Team;
  awayTeam: Team;
  homeGoals: number;
  awayGoals: number;
  homeGoalTally: Map<Player, number>;
  awayGoalTally: Map<Player, number>;
  hasLastGasp: boolean;
}

export function buildNarrativeDescriptor(rng: Rng, input: NarrativeInput): string {
  const { homeTeam, awayTeam, homeGoals, awayGoals, homeGoalTally, awayGoalTally, hasLastGasp } = input;

  if (homeGoals === awayGoals) {
    return `${homeTeam.name} AND ${awayTeam.name} ${pick(rng, DRAW_PHRASES)}!`;
  }

  const winner = homeGoals > awayGoals ? homeTeam : awayTeam;
  const margin = Math.abs(homeGoals - awayGoals);
  const totalGoals = homeGoals + awayGoals;
  const hatTrick = findHatTrickScorer(homeGoalTally, awayGoalTally);

  let phrase: string;
  if (hatTrick) {
    phrase = pick(rng, HAT_TRICK_PHRASE_TEMPLATES).replace("{Player}", hatTrick.player.name);
  } else if (hasLastGasp) {
    phrase = pick(rng, LAST_GASP_PHRASES);
  } else if (totalGoals >= 5) {
    phrase = pickHighScoringPhrase(rng, totalGoals);
  } else if (totalGoals <= 2) {
    phrase = pick(rng, LOW_SCORING_PHRASES);
  } else if (margin === 1) {
    phrase = pick(rng, NARROW_WIN_PHRASES);
  } else if (margin <= 3) {
    phrase = pick(rng, COMFORTABLE_WIN_PHRASES);
  } else {
    phrase = pick(rng, LANDSLIDE_PHRASES);
  }

  return `${winner.name} WINS ${phrase}!`;
}
