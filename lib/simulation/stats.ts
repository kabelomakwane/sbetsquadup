// Match stats derived from the same attack/defense ratios rather than
// simulated event by event — SPEC.md 8.1 step 5.

import type { Match, TeamMatchStats } from "@/lib/types";

const SHOTS_PER_EXPECTED_GOAL = 8;
const ON_TARGET_RATIO = 0.4;
const TOTAL_PASSES = 850;

export interface MatchStatRow {
  label: string;
  homeValue: number;
  awayValue: number;
  homeDisplay: string;
  awayDisplay: string;
  leading: "home" | "away" | "none";
}

/**
 * The four stats in Figma's fixed display order (SPEC.md 5.9/5.10) — shared
 * by the Match Summary Stats tab and the Share Image's condensed stats block
 * so both read from the same source of truth.
 */
export function matchStatRows(match: Match): MatchStatRow[] {
  const { home, away } = match.stats;
  const rows: Omit<MatchStatRow, "leading">[] = [
    { label: "Shots", homeValue: home.shots, awayValue: away.shots, homeDisplay: String(home.shots), awayDisplay: String(away.shots) },
    {
      label: "Shots On Target",
      homeValue: home.shotsOnTarget,
      awayValue: away.shotsOnTarget,
      homeDisplay: String(home.shotsOnTarget),
      awayDisplay: String(away.shotsOnTarget),
    },
    {
      label: "Possession",
      homeValue: home.possession,
      awayValue: away.possession,
      homeDisplay: `${home.possession}%`,
      awayDisplay: `${away.possession}%`,
    },
    { label: "Passes", homeValue: home.passes, awayValue: away.passes, homeDisplay: String(home.passes), awayDisplay: String(away.passes) },
  ];
  return rows.map((row) => ({ ...row, leading: statLeadingSide(row.homeValue, row.awayValue) }));
}

/** Which side's raw stat value leads, for the Stats tab / Share Image's colored-pill pattern (SPEC.md 5.9/5.10). */
export function statLeadingSide(homeValue: number, awayValue: number): "home" | "away" | "none" {
  if (homeValue === awayValue) return "none";
  return homeValue > awayValue ? "home" : "away";
}

export function deriveStats(
  lambdaHome: number,
  lambdaAway: number,
  attackHome: number,
  attackAway: number,
  homeGoals: number,
  awayGoals: number,
): { home: TeamMatchStats; away: TeamMatchStats } {
  const possessionHome = Math.round((attackHome / (attackHome + attackAway)) * 100);
  const possessionAway = 100 - possessionHome;

  const shotsHome = Math.max(Math.round(lambdaHome * SHOTS_PER_EXPECTED_GOAL), homeGoals);
  const shotsAway = Math.max(Math.round(lambdaAway * SHOTS_PER_EXPECTED_GOAL), awayGoals);

  const shotsOnTargetHome = Math.min(Math.max(Math.round(shotsHome * ON_TARGET_RATIO), homeGoals), shotsHome);
  const shotsOnTargetAway = Math.min(Math.max(Math.round(shotsAway * ON_TARGET_RATIO), awayGoals), shotsAway);

  const passesHome = Math.round((possessionHome / 100) * TOTAL_PASSES);
  const passesAway = TOTAL_PASSES - passesHome;

  return {
    home: { shots: shotsHome, shotsOnTarget: shotsOnTargetHome, possession: possessionHome, passes: passesHome },
    away: { shots: shotsAway, shotsOnTarget: shotsOnTargetAway, possession: possessionAway, passes: passesAway },
  };
}
