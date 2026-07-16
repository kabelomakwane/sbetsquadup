// Commentary event construction and pacing target — SPEC.md 8.1 steps 4/6, 8.3.

import type { CommentaryEvent, CommentaryEventType, Player, Side, Team } from "@/lib/types";
import type { Rng } from "./rng";
import { pick, randomInt, weightedPick } from "./rng";

// Two 20-minute simulated halves (SPEC.md 5.7), not a real 90-minute match.
export const HALF_MINUTES = 20;
export const MATCH_MINUTES = HALF_MINUTES * 2;
export const LAST_GASP_WINDOW = 2;
// Denser than the original 8-14 tuning target (SPEC.md 8.3 flags this range
// as a tuning target, not a hard requirement) — playtesting found 8-14 left
// too much dead air across the fixed 90s run. 20-28 events cuts average
// dwell from ~6-11s down to ~3-4.5s.
export const EVENT_COUNT_MIN = 20;
export const EVENT_COUNT_MAX = 28;

const GOAL_TEMPLATES = [
  "GOAL! {player} finds the net for {team}!",
  "GOAL! {player} slots it home for {team}!",
  "{player} beats the keeper — {team} on the scoresheet!",
  "GOAL! {player} makes no mistake for {team}!",
];

const CHANCE_TEMPLATES = [
  "{team} go close, but it's off target.",
  "A great chance for {team}, well saved!",
  "{team} break forward but can't find the finish.",
  "Off the post! So close for {team}.",
];

const CARD_TEMPLATES = [
  "Yellow card shown after a late challenge from {team}.",
  "Booking for {team} following a mistimed tackle.",
];

const GENERAL_COMMENTARY = [
  "Both sides probing for an opening.",
  "The pace of the match picks up.",
  "A scrappy passage of play in midfield.",
  "The crowd roars as the action swings end to end.",
];

function fillTemplate(template: string, team: Team, player?: Player): string {
  return template.replace("{team}", team.name).replace("{player}", player?.name ?? "");
}

export function buildGoalEvent(rng: Rng, minute: number, side: Side, team: Team, scorer: Player): CommentaryEvent {
  return {
    minute,
    type: "goal",
    text: fillTemplate(pick(rng, GOAL_TEMPLATES), team, scorer),
    side,
  };
}

const FILLER_TYPES: CommentaryEventType[] = ["chance", "card", "commentary"];
const FILLER_TYPE_WEIGHTS = [35, 15, 50];

export function buildFillerEvents(
  rng: Rng,
  count: number,
  homeTeam: Team,
  awayTeam: Team,
  attackHome: number,
  attackAway: number,
): CommentaryEvent[] {
  const homeBias = attackHome / (attackHome + attackAway);
  const events: CommentaryEvent[] = [];

  for (let i = 0; i < count; i++) {
    const minute = randomInt(rng, 1, MATCH_MINUTES);
    const type = weightedPick(rng, FILLER_TYPES, FILLER_TYPE_WEIGHTS);

    if (type === "commentary" && rng() < 0.5) {
      events.push({ minute, type, text: pick(rng, GENERAL_COMMENTARY), side: null });
      continue;
    }

    const side: Side = rng() < homeBias ? "home" : "away";
    const team = side === "home" ? homeTeam : awayTeam;
    const templates = type === "chance" ? CHANCE_TEMPLATES : type === "card" ? CARD_TEMPLATES : GENERAL_COMMENTARY;
    events.push({ minute, type, text: fillTemplate(pick(rng, templates), team), side });
  }

  return events;
}
