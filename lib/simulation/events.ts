// Commentary event construction and pacing target — SPEC.md 8.1 steps 4/6,
// 8.3, and 5.7's full 17-category commentary library (see
// commentaryTemplates.ts for the raw content this file selects from and
// fills in).

import { POSITION_SLOTS } from "@/lib/types";
import type { CommentaryEvent, CommentaryEventType, Player, Side, Team, TeamMatchStats } from "@/lib/types";
import type { Rng } from "./rng";
import { pick, randomInt, weightedPick } from "./rng";
import type { SlotRating } from "./rating";
import {
  BUILDUP_TEMPLATES,
  CORNER_TEMPLATES,
  DEFENSIVE_PLAY_TEMPLATES,
  FOUL_TEMPLATES,
  FULL_TIME_TEMPLATES,
  GOAL_HEADED_TEMPLATES,
  GOAL_INDIVIDUAL_TEMPLATES,
  GOAL_TEAM_MOVE_TEMPLATES,
  HALFTIME_TEMPLATES,
  KICKOFF_TEMPLATES,
  LATE_TENSION_TEMPLATES,
  OFF_THE_POST_TEMPLATES,
  SECOND_HALF_KICKOFF_TEMPLATES,
  SHOT_OFF_TARGET_TEMPLATES,
  SHOT_SAVED_TEMPLATES,
  STAT_FLAVOR_TEMPLATES,
  YELLOW_CARD_TEMPLATES,
} from "./commentaryTemplates";

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

// Reserved for the 4 guaranteed fixed-point events (kickoff/halftime/
// second-half-kickoff/full-time) — never assigned to a goal or filler event.
const FIXED_MINUTES: readonly number[] = [1, HALF_MINUTES, HALF_MINUTES + 1, MATCH_MINUTES];

export function randomNonFixedMinute(rng: Rng): number {
  let minute: number;
  do {
    minute = randomInt(rng, 1, MATCH_MINUTES);
  } while (FIXED_MINUTES.includes(minute));
  return minute;
}

// --- Fill/parse mechanism ---------------------------------------------

export interface FillContext {
  team?: Team;
  opponent?: Team;
  player?: Player;
  player2?: Player;
  keeper?: Player;
  scorer?: Player;
  assister?: Player;
  teamScore?: number;
  opponentScore?: number;
  possession?: number;
  shotsOnTarget?: number;
  minute?: number;
}

interface FilledTemplate {
  headline?: string;
  text: string;
}

const TOKEN_PATTERN = /\{([A-Za-z0-9]+)\}/g;
// Templates are single-line strings, so no dotAll flag is needed here.
const HEADLINE_PATTERN = /^\*\*(.+?)\*\*\s*(.*)$/;

function tokenValue(key: string, ctx: FillContext): string {
  switch (key) {
    case "team":
      return ctx.team?.name ?? "";
    case "opponent":
      return ctx.opponent?.name ?? "";
    case "player":
      return ctx.player?.name ?? "";
    case "player2":
      return ctx.player2?.name ?? "";
    case "keeper":
      return ctx.keeper?.name ?? "";
    case "scorer":
      return ctx.scorer?.name ?? "";
    case "assister":
      return ctx.assister?.name ?? "";
    case "teamscore":
      return ctx.teamScore !== undefined ? String(ctx.teamScore) : "";
    case "opponentscore":
      return ctx.opponentScore !== undefined ? String(ctx.opponentScore) : "";
    case "possession":
      return ctx.possession !== undefined ? String(ctx.possession) : "";
    case "shotsontarget":
      return ctx.shotsOnTarget !== undefined ? String(ctx.shotsOnTarget) : "";
    case "minute":
      return ctx.minute !== undefined ? String(ctx.minute) : "";
    default:
      return "";
  }
}

/**
 * Single regex pass, not one .replace() per token name — a template can
 * repeat a token (e.g. {team} twice in one line), and each occurrence's own
 * casing decides whether that occurrence gets uppercased.
 */
export function fillTemplate(template: string, ctx: FillContext): FilledTemplate {
  const filled = template.replace(TOKEN_PATTERN, (_match, token: string) => {
    const value = tokenValue(token.toLowerCase(), ctx);
    return token === token.toUpperCase() ? value.toUpperCase() : value;
  });

  const headlineMatch = filled.match(HEADLINE_PATTERN);
  if (headlineMatch) {
    return { headline: headlineMatch[1], text: headlineMatch[2] };
  }
  return { text: filled };
}

// --- Shared player helpers ---------------------------------------------

function randomPlayer(rng: Rng, team: Team): Player {
  const players = team.players.filter((player): player is Player => player !== undefined);
  return pick(rng, players);
}

function randomAssister(rng: Rng, team: Team, scorer: Player): Player {
  const candidates = team.players.filter((player): player is Player => player !== undefined && player !== scorer);
  return pick(rng, candidates);
}

const GK_INDEX = POSITION_SLOTS.indexOf("GK");

function teamKeeper(team: Team): Player {
  const keeper = team.players[GK_INDEX];
  if (!keeper) throw new Error(`events: ${team.side} team has no goalkeeper assigned`);
  return keeper;
}

// --- Fixed-point events (kickoff / halftime / 2nd-half kickoff / full-time) ---

export function buildFixedPointEvents(
  rng: Rng,
  homeTeam: Team,
  awayTeam: Team,
  halftimeHomeGoals: number,
  halftimeAwayGoals: number,
  finalHomeGoals: number,
  finalAwayGoals: number,
): CommentaryEvent[] {
  const kickoff = fillTemplate(pick(rng, KICKOFF_TEMPLATES), { team: homeTeam, opponent: awayTeam });
  const halftime = fillTemplate(pick(rng, HALFTIME_TEMPLATES), {
    team: homeTeam,
    opponent: awayTeam,
    teamScore: halftimeHomeGoals,
    opponentScore: halftimeAwayGoals,
  });
  const secondHalfKickoff = fillTemplate(pick(rng, SECOND_HALF_KICKOFF_TEMPLATES), {
    team: homeTeam,
    opponent: awayTeam,
    teamScore: halftimeHomeGoals,
    opponentScore: halftimeAwayGoals,
  });
  const fullTime = fillTemplate(pick(rng, FULL_TIME_TEMPLATES), {
    team: homeTeam,
    opponent: awayTeam,
    teamScore: finalHomeGoals,
    opponentScore: finalAwayGoals,
  });

  return [
    { minute: 1, type: "commentary" as const, side: null, ...kickoff },
    { minute: HALF_MINUTES, type: "commentary" as const, side: null, ...halftime },
    { minute: HALF_MINUTES + 1, type: "commentary" as const, side: null, ...secondHalfKickoff },
    { minute: MATCH_MINUTES, type: "commentary" as const, side: null, ...fullTime },
  ];
}

// --- Goal events ---------------------------------------------------------

const SOLO_GOAL_CHANCE = 0.3;
// [headed, teamMove] weights — DEF/GK scorers skew headed/set-piece,
// ST/MID scorers skew team-move, rather than an even coin flip.
const GOAL_VARIANT_WEIGHTS_DEFENSIVE = [70, 30];
const GOAL_VARIANT_WEIGHTS_ATTACKING = [20, 80];
const GOAL_VARIANTS = ["headed", "teamMove"] as const;

export function buildGoalEvent(
  rng: Rng,
  minute: number,
  side: Side,
  team: Team,
  opponent: Team,
  scorer: SlotRating,
  teamScore: number,
  opponentScore: number,
): CommentaryEvent {
  if (rng() < SOLO_GOAL_CHANCE) {
    const filled = fillTemplate(pick(rng, GOAL_INDIVIDUAL_TEMPLATES), {
      team,
      opponent,
      scorer: scorer.player,
      teamScore,
      opponentScore,
    });
    return { minute, type: "goal" as const, side, scorerId: scorer.player.id, ...filled };
  }

  const variantWeights =
    scorer.position === "DEF" || scorer.position === "GK"
      ? GOAL_VARIANT_WEIGHTS_DEFENSIVE
      : GOAL_VARIANT_WEIGHTS_ATTACKING;
  const variant = weightedPick(rng, GOAL_VARIANTS, variantWeights);
  const templates = variant === "headed" ? GOAL_HEADED_TEMPLATES : GOAL_TEAM_MOVE_TEMPLATES;
  const assister = randomAssister(rng, team, scorer.player);

  const filled = fillTemplate(pick(rng, templates), {
    team,
    opponent,
    scorer: scorer.player,
    assister,
    teamScore,
    opponentScore,
  });
  return { minute, type: "goal" as const, side, scorerId: scorer.player.id, ...filled };
}

// --- Filler events ---------------------------------------------------------

const FILLER_TYPES: CommentaryEventType[] = ["chance", "card", "commentary"];
const FILLER_TYPE_WEIGHTS = [35, 15, 50];

type ChanceCategory = "offTarget" | "saved" | "post" | "lastDitch";
const CHANCE_CATEGORIES: ChanceCategory[] = ["offTarget", "saved", "post", "lastDitch"];
const CHANCE_CATEGORY_WEIGHTS = [40, 30, 15, 15];

type CommentaryCategory = "buildup" | "foul" | "corner" | "statFlavor" | "lateTension";
const COMMENTARY_CATEGORIES: CommentaryCategory[] = ["buildup", "foul", "corner", "statFlavor", "lateTension"];
const COMMENTARY_CATEGORY_WEIGHTS = [40, 20, 15, 15, 10];

// "Closing stages" — last 8 of the 40 simulated minutes.
const LATE_TENSION_MINUTE_THRESHOLD = MATCH_MINUTES - 8;
const LATE_TENSION_SCORE_MARGIN = 1;

export interface FillerContext {
  homeTeam: Team;
  awayTeam: Team;
  stats: { home: TeamMatchStats; away: TeamMatchStats };
  homeStandout: Player;
  awayStandout: Player;
  homeGoals: number;
  awayGoals: number;
}

function buildChanceEvent(
  rng: Rng,
  minute: number,
  category: ChanceCategory,
  attackingSide: Side,
  defendingSide: Side,
  attackingTeam: Team,
  defendingTeam: Team,
): CommentaryEvent {
  if (category === "lastDitch") {
    const player = randomPlayer(rng, defendingTeam);
    const filled = fillTemplate(pick(rng, DEFENSIVE_PLAY_TEMPLATES), {
      team: defendingTeam,
      opponent: attackingTeam,
      player,
    });
    return { minute, type: "chance" as const, side: defendingSide, ...filled };
  }

  const player = randomPlayer(rng, attackingTeam);
  const keeper = teamKeeper(defendingTeam);
  const templates =
    category === "offTarget"
      ? SHOT_OFF_TARGET_TEMPLATES
      : category === "saved"
        ? SHOT_SAVED_TEMPLATES
        : OFF_THE_POST_TEMPLATES;
  const filled = fillTemplate(pick(rng, templates), { team: attackingTeam, opponent: defendingTeam, player, keeper });
  return { minute, type: "chance" as const, side: attackingSide, ...filled };
}

function buildCardEvent(
  rng: Rng,
  minute: number,
  defendingSide: Side,
  attackingTeam: Team,
  defendingTeam: Team,
): CommentaryEvent {
  // Offending/punished side is the defending team (the tactical foul that
  // stops the attack) — {team}/{player2} = offender, {opponent}/{player} = victim.
  const player2 = randomPlayer(rng, defendingTeam);
  const player = randomPlayer(rng, attackingTeam);
  const filled = fillTemplate(pick(rng, YELLOW_CARD_TEMPLATES), {
    team: defendingTeam,
    opponent: attackingTeam,
    player,
    player2,
  });
  return { minute, type: "card" as const, side: defendingSide, ...filled };
}

function buildCommentaryEvent(
  rng: Rng,
  minute: number,
  category: CommentaryCategory,
  attackingSide: Side,
  attackingTeam: Team,
  defendingTeam: Team,
  ctx: FillerContext,
): CommentaryEvent {
  switch (category) {
    case "buildup": {
      const player = randomPlayer(rng, attackingTeam);
      const filled = fillTemplate(pick(rng, BUILDUP_TEMPLATES), {
        team: attackingTeam,
        opponent: defendingTeam,
        player,
      });
      return { minute, type: "commentary" as const, side: attackingSide, ...filled };
    }
    case "foul": {
      const player = randomPlayer(rng, attackingTeam);
      const player2 = randomPlayer(rng, defendingTeam);
      const filled = fillTemplate(pick(rng, FOUL_TEMPLATES), {
        team: attackingTeam,
        opponent: defendingTeam,
        player,
        player2,
      });
      return { minute, type: "commentary" as const, side: attackingSide, ...filled };
    }
    case "corner": {
      const player = randomPlayer(rng, attackingTeam);
      const filled = fillTemplate(pick(rng, CORNER_TEMPLATES), {
        team: attackingTeam,
        opponent: defendingTeam,
        player,
      });
      return { minute, type: "commentary" as const, side: attackingSide, ...filled };
    }
    case "statFlavor": {
      const teamStats = attackingSide === "home" ? ctx.stats.home : ctx.stats.away;
      const player = attackingSide === "home" ? ctx.homeStandout : ctx.awayStandout;
      const filled = fillTemplate(pick(rng, STAT_FLAVOR_TEMPLATES), {
        team: attackingTeam,
        opponent: defendingTeam,
        player,
        possession: teamStats.possession,
        shotsOnTarget: teamStats.shotsOnTarget,
      });
      return { minute, type: "commentary" as const, side: attackingSide, ...filled };
    }
    case "lateTension": {
      const filled = fillTemplate(pick(rng, LATE_TENSION_TEMPLATES), {
        team: ctx.homeTeam,
        opponent: ctx.awayTeam,
        teamScore: ctx.homeGoals,
        opponentScore: ctx.awayGoals,
      });
      return { minute, type: "commentary" as const, side: null, ...filled };
    }
  }
}

export function buildFillerEvents(
  rng: Rng,
  count: number,
  attackHome: number,
  attackAway: number,
  ctx: FillerContext,
): CommentaryEvent[] {
  const homeBias = attackHome / (attackHome + attackAway);
  const scoreIsClose = Math.abs(ctx.homeGoals - ctx.awayGoals) <= LATE_TENSION_SCORE_MARGIN;
  const events: CommentaryEvent[] = [];

  for (let i = 0; i < count; i++) {
    const minute = randomNonFixedMinute(rng);
    const type = weightedPick(rng, FILLER_TYPES, FILLER_TYPE_WEIGHTS);

    const attackingSide: Side = rng() < homeBias ? "home" : "away";
    const defendingSide: Side = attackingSide === "home" ? "away" : "home";
    const attackingTeam = attackingSide === "home" ? ctx.homeTeam : ctx.awayTeam;
    const defendingTeam = attackingSide === "home" ? ctx.awayTeam : ctx.homeTeam;

    if (type === "card") {
      events.push(buildCardEvent(rng, minute, defendingSide, attackingTeam, defendingTeam));
      continue;
    }

    if (type === "chance") {
      const category = weightedPick(rng, CHANCE_CATEGORIES, CHANCE_CATEGORY_WEIGHTS);
      events.push(buildChanceEvent(rng, minute, category, attackingSide, defendingSide, attackingTeam, defendingTeam));
      continue;
    }

    const lateTensionEligible = scoreIsClose && minute >= LATE_TENSION_MINUTE_THRESHOLD;
    const categoryCount = lateTensionEligible ? COMMENTARY_CATEGORIES.length : COMMENTARY_CATEGORIES.length - 1;
    const categories = COMMENTARY_CATEGORIES.slice(0, categoryCount);
    const weights = COMMENTARY_CATEGORY_WEIGHTS.slice(0, categoryCount);
    const category = weightedPick(rng, categories, weights);
    events.push(buildCommentaryEvent(rng, minute, category, attackingSide, attackingTeam, defendingTeam, ctx));
  }

  return events;
}
