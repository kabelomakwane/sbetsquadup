// Pure match simulation entry point — SPEC.md section 8. No UI/React imports;
// must stay independently testable and reusable (see SPEC.md 14 and
// CLAUDE.md "Architecture rules" for why: a future multiplayer server needs
// to run this same function).

import type { CommentaryEvent, Match, Player, Side, Team } from "@/lib/types";
import { attackDefense, slotRatings } from "./rating";
import type { SlotRating } from "./rating";
import { buildNarrativeDescriptor } from "./narrative";
import { pickScorer, scorerPriority } from "./scorers";
import { deriveStats } from "./stats";
import {
  buildFillerEvents,
  buildFixedPointEvents,
  buildGoalEvent,
  EVENT_COUNT_MAX,
  EVENT_COUNT_MIN,
  HALF_MINUTES,
  LAST_GASP_WINDOW,
  MATCH_MINUTES,
  randomNonFixedMinute,
} from "./events";
import { createRng, randomInt, samplePoisson } from "./rng";

const BASE_RATE = 1.3;
const MAX_GOALS_PER_SIDE = 8;

interface PendingGoal {
  minute: number;
  side: Side;
  scorer: SlotRating;
}

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
  const pendingGoals: PendingGoal[] = [];

  for (let i = 0; i < homeGoals; i++) {
    const scorer = pickScorer(rng, homeScorerPriority);
    homeGoalTally.set(scorer.player, (homeGoalTally.get(scorer.player) ?? 0) + 1);
    pendingGoals.push({ minute: randomNonFixedMinute(rng), side: "home", scorer });
  }
  for (let i = 0; i < awayGoals; i++) {
    const scorer = pickScorer(rng, awayScorerPriority);
    awayGoalTally.set(scorer.player, (awayGoalTally.get(scorer.player) ?? 0) + 1);
    pendingGoals.push({ minute: randomNonFixedMinute(rng), side: "away", scorer });
  }
  // Chronological order so each goal's on-screen scoreline reflects the
  // running tally at that point in the match, not the final score.
  pendingGoals.sort((a, b) => a.minute - b.minute);

  let runningHome = 0;
  let runningAway = 0;
  const goalEvents: CommentaryEvent[] = pendingGoals.map((goal) => {
    if (goal.side === "home") runningHome++;
    else runningAway++;

    const team = goal.side === "home" ? homeTeam : awayTeam;
    const opponent = goal.side === "home" ? awayTeam : homeTeam;
    const teamScore = goal.side === "home" ? runningHome : runningAway;
    const opponentScore = goal.side === "home" ? runningAway : runningHome;

    return buildGoalEvent(rng, goal.minute, goal.side, team, opponent, goal.scorer, teamScore, opponentScore);
  });

  const halftimeHomeGoals = pendingGoals.filter((goal) => goal.side === "home" && goal.minute < HALF_MINUTES).length;
  const halftimeAwayGoals = pendingGoals.filter((goal) => goal.side === "away" && goal.minute < HALF_MINUTES).length;

  const stats = deriveStats(lambdaHome, lambdaAway, attackHome, attackAway, homeGoals, awayGoals);

  const fixedPointEvents: CommentaryEvent[] = buildFixedPointEvents(
    rng,
    homeTeam,
    awayTeam,
    halftimeHomeGoals,
    halftimeAwayGoals,
    homeGoals,
    awayGoals,
  );

  const targetTotal = randomInt(rng, EVENT_COUNT_MIN, EVENT_COUNT_MAX);
  const fillerCount = Math.max(0, targetTotal - goalEvents.length - fixedPointEvents.length);
  const fillerEvents: CommentaryEvent[] = buildFillerEvents(rng, fillerCount, attackHome, attackAway, {
    homeTeam,
    awayTeam,
    stats,
    homeStandout: homeScorerPriority[0].player,
    awayStandout: awayScorerPriority[0].player,
    homeGoals,
    awayGoals,
  });

  const events = [...goalEvents, ...fixedPointEvents, ...fillerEvents].sort((a, b) => a.minute - b.minute);

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
