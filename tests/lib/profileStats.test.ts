import { describe, expect, it } from "vitest";
import { computeCareerStats } from "@/lib/profileStats";
import { POSITION_SLOTS, type Match, type MatchHistory, type Team } from "@/lib/types";

function makeTeam(side: "home" | "away", id: string): Team {
  return { id, side, name: `${side} team`, players: new Array(POSITION_SLOTS.length).fill(undefined) };
}

function makeEntry(id: string, homeScore: number, awayScore: number): MatchHistory {
  const home = makeTeam("home", `${id}-home`);
  const away = makeTeam("away", `${id}-away`);
  const match: Match = {
    id,
    homeTeam: home,
    awayTeam: away,
    events: [],
    finalScore: { home: homeScore, away: awayScore },
    narrativeDescriptor: "a match",
    status: "finished",
    stats: {
      home: { shots: 1, shotsOnTarget: 1, possession: 50, passes: 100 },
      away: { shots: 1, shotsOnTarget: 1, possession: 50, passes: 100 },
    },
  };
  return { id, userId: "user-1", match, playedAt: 1 };
}

describe("computeCareerStats", () => {
  it("returns all zeros for no history", () => {
    expect(computeCareerStats([])).toEqual({
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      winPercentage: 0,
    });
  });

  it("computes from a fixed home-side perspective across wins, draws, losses", () => {
    const history = [
      makeEntry("m1", 2, 0), // home win
      makeEntry("m2", 1, 1), // draw
      makeEntry("m3", 0, 3), // home loss
      makeEntry("m4", 4, 1), // home win
    ];

    const stats = computeCareerStats(history);

    expect(stats.played).toBe(4);
    expect(stats.won).toBe(2);
    expect(stats.drawn).toBe(1);
    expect(stats.lost).toBe(1);
    expect(stats.goalsFor).toBe(7); // 2+1+0+4
    expect(stats.goalsAgainst).toBe(5); // 0+1+3+1
    expect(stats.winPercentage).toBe(50); // 2/4
  });

  it("rounds win percentage to the nearest whole number", () => {
    const history = [makeEntry("m1", 1, 0), makeEntry("m2", 0, 1), makeEntry("m3", 0, 1)];
    const stats = computeCareerStats(history);
    expect(stats.winPercentage).toBe(33); // 1/3 -> 33.33 -> 33
  });
});
