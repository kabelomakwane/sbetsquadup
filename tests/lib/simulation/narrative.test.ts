import { describe, expect, it } from "vitest";
import { buildNarrativeDescriptor } from "@/lib/simulation/narrative";
import { createRng } from "@/lib/simulation/rng";
import type { Player, Side, Team } from "@/lib/types";

function makeTeam(side: Side, name: string): Team {
  return { id: side, side, name, players: [] };
}

const home = makeTeam("home", "Home United");
const away = makeTeam("away", "Away FC");

describe("buildNarrativeDescriptor", () => {
  it("uses the draw template when scores are level (SPEC.md 8.2)", () => {
    const descriptor = buildNarrativeDescriptor(createRng(1), {
      homeTeam: home,
      awayTeam: away,
      homeGoals: 1,
      awayGoals: 1,
      homeGoalTally: new Map(),
      awayGoalTally: new Map(),
      hasLastGasp: false,
    });
    expect(descriptor).toMatch(/^Home United AND Away FC .+!$/);
  });

  it("uses the decisive-result template when the home side wins", () => {
    const descriptor = buildNarrativeDescriptor(createRng(1), {
      homeTeam: home,
      awayTeam: away,
      homeGoals: 2,
      awayGoals: 1,
      homeGoalTally: new Map(),
      awayGoalTally: new Map(),
      hasLastGasp: false,
    });
    expect(descriptor).toMatch(/^Home United WINS .+!$/);
  });

  it("names the away side as winner when it scores more", () => {
    const descriptor = buildNarrativeDescriptor(createRng(1), {
      homeTeam: home,
      awayTeam: away,
      homeGoals: 0,
      awayGoals: 3,
      homeGoalTally: new Map(),
      awayGoalTally: new Map(),
      hasLastGasp: false,
    });
    expect(descriptor).toMatch(/^Away FC WINS .+!$/);
  });

  it("overrides the generic margin bucket with a hat-trick headline naming the scorer", () => {
    const scorer: Player = {
      id: "p1",
      name: "Striker One",
      positions: ["ST"],
      club: "Home United",
      overallRating: 90,
      era: "current",
      source: "database",
    };
    const descriptor = buildNarrativeDescriptor(createRng(1), {
      homeTeam: home,
      awayTeam: away,
      homeGoals: 3,
      awayGoals: 1,
      homeGoalTally: new Map([[scorer, 3]]),
      awayGoalTally: new Map(),
      hasLastGasp: false,
    });
    expect(descriptor).toContain("Striker One");
    expect(descriptor).toMatch(/^Home United WINS .+!$/);
  });

  it("uses a last-gasp headline when no hat-trick occurred but the winner scored late", () => {
    const descriptor = buildNarrativeDescriptor(createRng(1), {
      homeTeam: home,
      awayTeam: away,
      homeGoals: 2,
      awayGoals: 1,
      homeGoalTally: new Map(),
      awayGoalTally: new Map(),
      hasLastGasp: true,
    });
    const lastGaspPhrases = ["LATE, LATE WINNER", "AT THE DEATH", "DRAMATIC LAST-MINUTE STRIKE"];
    expect(lastGaspPhrases.some((phrase) => descriptor.includes(phrase))).toBe(true);
  });
});
