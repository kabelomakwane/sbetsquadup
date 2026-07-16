import { describe, expect, it } from "vitest";
import { matchStatRows, statLeadingSide } from "@/lib/simulation";
import type { Match } from "@/lib/types";

describe("statLeadingSide", () => {
  it("returns the side with the higher value, or none when tied", () => {
    expect(statLeadingSide(5, 3)).toBe("home");
    expect(statLeadingSide(3, 5)).toBe("away");
    expect(statLeadingSide(4, 4)).toBe("none");
  });
});

describe("matchStatRows", () => {
  it("returns the four stats in SPEC.md order with formatted displays and leading side", () => {
    const match = {
      stats: {
        home: { shots: 10, shotsOnTarget: 6, possession: 60, passes: 400 },
        away: { shots: 8, shotsOnTarget: 6, possession: 40, passes: 420 },
      },
    } as Match;

    const rows = matchStatRows(match);
    expect(rows.map((row) => row.label)).toEqual(["Shots", "Shots On Target", "Possession", "Passes"]);

    expect(rows[0]).toMatchObject({ homeDisplay: "10", awayDisplay: "8", leading: "home" });
    expect(rows[1]).toMatchObject({ homeDisplay: "6", awayDisplay: "6", leading: "none" });
    expect(rows[2]).toMatchObject({ homeDisplay: "60%", awayDisplay: "40%", leading: "home" });
    expect(rows[3]).toMatchObject({ homeDisplay: "400", awayDisplay: "420", leading: "away" });
  });
});
