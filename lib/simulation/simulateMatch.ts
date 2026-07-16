// Pure match simulation entry point — SPEC.md section 8. No UI/React imports;
// must stay independently testable and reusable (see SPEC.md 14 and
// CLAUDE.md "Architecture rules" for why: a future multiplayer server needs
// to run this same function).

import type { CommentaryEvent, Match, Player, Team } from "@/lib/types";
import { attackDefense, slotRatings } from "./rating";
import { buildNarrativeDescriptor } from "./narrative";
import { pickScorer, scorerPriority } from "./scorers";
import { deriveStats } from "./stats";
import { buildFillerEvents, buildGoalEvent, EVENT_COUNT_MAX, EVENT_COUNT_MIN, LAST_GASP_WINDOW, MATCH_MINUTES } from "./events";
import { createRng, randomInt, samplePoisson } from "./rng";

const BASE_RATE = 1.3;
const MAX_GOALS_PER_SIDE = 8;

export function simulateMatch(homeTeam: Team, awayTeam: Team, seed: number): Match {
  const rng = createRng(seed);

  const homeSlots = slotRatings(homeTeam);
  const awaySlots = slotRatings(awayTeam);

  const { attack: attackHome, defense: defenseHome } = attackDefense(homeSlots);
  const { attack: attackAway, defense: defenseAway } = attackDefense(awaySlots);

  const lambdaHome = BASE_RATE * (attackHome / defenseAway);
  const lambdaAway = BASE_RATE * (attackAway / defenseHome);

  const homeGoals = Math.min(samplePoisson(rng, lambdaHome), MAX_GOALS_PER_SIDE);
  const awayGoals = Math.min(samplePoisson(rng, lambdaAway), MAX_GOALS_PER_SIDE);

  const homeScorerPriority = scorerPriority(homeSlots);
  const awayScorerPriority = scorerPriority(awaySlots);

  const homeGoalTally = new Map<Player, number>();
  const awayGoalTally = new Map<Player, number>();
  const goalEvents: CommentaryEvent[] = [];

  for (let i = 0; i < homeGoals; i++) {
    const scorer = pickScorer(rng, homeScorerPriority);
    homeGoalTally.set(scorer.player, (homeGoalTally.get(scorer.player) ?? 0) + 1);
    goalEvents.push(buildGoalEvent(rng, randomInt(rng, 1, MATCH_MINUTES), "home", homeTeam, scorer.player));
  }
  for (let i = 0; i < awayGoals; i++) {
    const scorer = pickScorer(rng, awayScorerPriority);
    awayGoalTally.set(scorer.player, (awayGoalTally.get(scorer.player) ?? 0) + 1);
    goalEvents.push(buildGoalEvent(rng, randomInt(rng, 1, MATCH_MINUTES), "away", awayTeam, scorer.player));
  }

  const targetTotal = randomInt(rng, EVENT_COUNT_MIN, EVENT_COUNT_MAX);
  const fillerCount = Math.max(0, targetTotal - goalEvents.length);
  const fillerEvents = buildFillerEvents(rng, fillerCount, homeTeam, awayTeam, attackHome, attackAway);

  const events = [...goalEvents, ...fillerEvents].sort((a, b) => a.minute - b.minute);

  const hasLastGasp = goalEvents.some((event) => event.minute >= MATCH_MINUTES - LAST_GASP_WINDOW + 1);

  const narrativeDescriptor = buildNarrativeDescriptor(rng, {
    homeTeam,
    awayTeam,
    homeGoals,
    awayGoals,
    homeGoalTally,
    awayGoalTally,
    hasLastGasp,
  });

  const stats = deriveStats(lambdaHome, lambdaAway, attackHome, attackAway, homeGoals, awayGoals);

  return {
    id: crypto.randomUUID(),
    homeTeam,
    awayTeam,
    events,
    finalScore: { home: homeGoals, away: awayGoals },
    narrativeDescriptor,
    status: "finished",
    stats,
  };
}
