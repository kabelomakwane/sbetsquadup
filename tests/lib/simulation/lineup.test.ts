import { describe, expect, it } from "vitest";
import { playerGoalCounts, teamLineupRows } from "@/lib/simulation";
import { POSITION_SLOTS, type CommentaryEvent, type Match, type Player, type Team } from "@/lib/types";

function makeMatch(events: CommentaryEvent[]): Match {
  return {
    id: "test-match",
    homeTeam: { id: "home", side: "home", name: "Home United", players: [] },
    awayTeam: { id: "away", side: "away", name: "Away FC", players: [] },
    events,
    finalScore: { home: 2, away: 1 },
    narrativeDescriptor: "HOME UNITED WINS IN A NAIL-BITER!",
    status: "finished",
    stats: {
      home: { shots: 10, shotsOnTarget: 5, possession: 55, passes: 400 },
      away: { shots: 8, shotsOnTarget: 3, possession: 45, passes: 350 },
    },
  };
}

describe("playerGoalCounts", () => {
  it("tallies goals per scorerId, ignoring non-goal and scorerless events", () => {
    const match = makeMatch([
      { minute: 5, type: "goal", side: "home", text: "GOAL!", scorerId: "haaland" },
      { minute: 12, type: "commentary", side: null, text: "Kickoff." },
      { minute: 30, type: "goal", side: "home", text: "GOAL!", scorerId: "haaland" },
      { minute: 40, type: "goal", side: "away", text: "GOAL!", scorerId: "neymar" },
      { minute: 60, type: "chance", side: "home", text: "Off target." },
    ]);

    const counts = playerGoalCounts(match);
    expect(counts.get("haaland")).toBe(2);
    expect(counts.get("neymar")).toBe(1);
    expect(counts.size).toBe(2);
  });

  it("returns an empty map for a scoreless match", () => {
    const match = makeMatch([{ minute: 1, type: "commentary", side: null, text: "Kickoff." }]);
    expect(playerGoalCounts(match).size).toBe(0);
  });
});

function makePlayer(id: string): Player {
  return { id, name: id, positions: ["ST"], club: "Test FC", overallRating: 80, era: "current", source: "database" };
}

describe("teamLineupRows", () => {
  it("zips POSITION_SLOTS order with each player's goal tally, skipping empty slots", () => {
    const team: Team = {
      id: "home",
      side: "home",
      name: "Home United",
      players: POSITION_SLOTS.map((_, i) => (i === 4 ? undefined : makePlayer(`p${i}`))),
    };
    const rows = teamLineupRows(team, new Map([["p0", 2]]));

    expect(rows).toHaveLength(4);
    expect(rows.map((row) => row.position)).toEqual(POSITION_SLOTS.slice(0, 4));
    expect(rows[0]).toEqual({ position: "ST", player: makePlayer("p0"), goals: 2 });
    expect(rows[1].goals).toBe(0);
  });
});
