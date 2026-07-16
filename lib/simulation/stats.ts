// Match stats derived from the same attack/defense ratios rather than
// simulated event by event — SPEC.md 8.1 step 5.

import type { TeamMatchStats } from "@/lib/types";

const SHOTS_PER_EXPECTED_GOAL = 8;
const ON_TARGET_RATIO = 0.4;
const TOTAL_PASSES = 850;

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
