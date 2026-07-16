import { describe, expect, it } from "vitest";
import { simulateMatch } from "@/lib/simulation";
import { POSITION_SLOTS, type Player, type Position, type Side, type Team } from "@/lib/types";

function makePlayer(id: string, rating: number, position: Position): Player {
  return {
    id,
    name: id,
    positions: [position],
    club: "Test FC",
    overallRating: rating,
    era: "current",
    source: "database",
  };
}

function makeTeam(side: Side, name: string, rating: number): Team {
  return {
    id: `${side}-team`,
    side,
    name,
    players: POSITION_SLOTS.map((position, i) => makePlayer(`${side}-${position}-${i}`, rating, position)),
  };
}

describe("simulateMatch", () => {
  it("is deterministic for the same seed", () => {
    const home = makeTeam("home", "Home United", 80);
    const away = makeTeam("away", "Away FC", 75);

    const first = simulateMatch(home, away, 42);
    const second = simulateMatch(home, away, 42);

    expect(second.finalScore).toEqual(first.finalScore);
    expect(second.events).toEqual(first.events);
    expect(second.narrativeDescriptor).toBe(first.narrativeDescriptor);
    expect(second.stats).toEqual(first.stats);
  });

  it("produces different outcomes for different seeds", () => {
    const home = makeTeam("home", "Home United", 80);
    const away = makeTeam("away", "Away FC", 75);

    const results = new Set(
      Array.from({ length: 20 }, (_, seed) => JSON.stringify(simulateMatch(home, away, seed).finalScore)),
    );
    expect(results.size).toBeGreaterThan(1);
  });

  it("lets the stronger squad win clearly more often, but not always (SPEC.md 8.1)", () => {
    const strong = makeTeam("home", "Strong FC", 90);
    const weak = makeTeam("away", "Weak FC", 50);

    let strongWins = 0;
    let weakWins = 0;
    let draws = 0;

    for (let seed = 0; seed < 500; seed++) {
      const { home, away } = simulateMatch(strong, weak, seed).finalScore;
      if (home > away) strongWins++;
      else if (away > home) weakWins++;
      else draws++;
    }

    expect(strongWins + weakWins + draws).toBe(500);
    // Clearly more often for the stronger squad...
    expect(strongWins).toBeGreaterThan(weakWins * 3);
    // ...but never guaranteed — the weaker squad must still win a non-zero share.
    expect(weakWins).toBeGreaterThan(0);
  });

  it("lands total event count in the 20-28 pacing range (SPEC.md 5.7/8.3)", () => {
    const home = makeTeam("home", "Home United", 80);
    const away = makeTeam("away", "Away FC", 78);

    for (let seed = 0; seed < 50; seed++) {
      const match = simulateMatch(home, away, seed);
      expect(match.events.length).toBeGreaterThanOrEqual(20);
      expect(match.events.length).toBeLessThanOrEqual(28);
    }
  });

  it("keeps events ordered by minute within the two 20-minute halves", () => {
    const home = makeTeam("home", "Home United", 85);
    const away = makeTeam("away", "Away FC", 60);
    const match = simulateMatch(home, away, 7);

    for (let i = 1; i < match.events.length; i++) {
      expect(match.events[i].minute).toBeGreaterThanOrEqual(match.events[i - 1].minute);
    }
    for (const event of match.events) {
      expect(event.minute).toBeGreaterThanOrEqual(1);
      expect(event.minute).toBeLessThanOrEqual(40);
    }
  });

  it("derives stats consistent with the scoreline", () => {
    const home = makeTeam("home", "Home United", 85);
    const away = makeTeam("away", "Away FC", 60);
    const match = simulateMatch(home, away, 3);

    expect(match.stats.home.possession + match.stats.away.possession).toBe(100);
    expect(match.stats.home.shotsOnTarget).toBeGreaterThanOrEqual(match.finalScore.home);
    expect(match.stats.away.shotsOnTarget).toBeGreaterThanOrEqual(match.finalScore.away);
    expect(match.stats.home.shots).toBeGreaterThanOrEqual(match.stats.home.shotsOnTarget);
    expect(match.stats.away.shots).toBeGreaterThanOrEqual(match.stats.away.shotsOnTarget);
  });

  it("applies the out-of-position penalty so a misplayed GK slot hurts defense", () => {
    // Same rating everywhere, except the home GK slot is filled by an ST-only
    // player (SPEC.md 8.1 step 0) — home's defense score should drop relative
    // to an otherwise-identical team with a natural GK.
    const naturalGk = makeTeam("home", "Home United", 80);

    const outOfPositionGk = makeTeam("home", "Home United", 80);
    const gkIndex = POSITION_SLOTS.indexOf("GK");
    outOfPositionGk.players[gkIndex] = makePlayer("home-out-of-position-gk", 80, "ST");

    const away = makeTeam("away", "Away FC", 80);

    // Run a large batch and compare average goals conceded (proxy for defense strength).
    let concededNatural = 0;
    let concededOutOfPosition = 0;
    const trials = 300;
    for (let seed = 0; seed < trials; seed++) {
      concededNatural += simulateMatch(naturalGk, away, seed).finalScore.away;
      concededOutOfPosition += simulateMatch(outOfPositionGk, away, seed).finalScore.away;
    }

    expect(concededOutOfPosition).toBeGreaterThan(concededNatural);
  });

  it("throws if a slot is empty", () => {
    const incomplete = makeTeam("home", "Incomplete FC", 80);
    incomplete.players[0] = undefined;
    const away = makeTeam("away", "Away FC", 80);
    expect(() => simulateMatch(incomplete, away, 1)).toThrow();
  });
});
