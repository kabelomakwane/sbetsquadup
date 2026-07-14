import { describe, expect, it } from "vitest";
import {
  STUB_PLAYERS,
  getPlayerInitials,
  getShortPlayerName,
  normalizePlayerName,
  searchPlayers,
} from "@/lib/data/players";

describe("getPlayerInitials", () => {
  it("matches the Figma/design-system examples", () => {
    expect(getPlayerInitials("Virgil van Dijk")).toBe("VvD");
    expect(getPlayerInitials("Neymar Jr")).toBe("NJ");
    expect(getPlayerInitials("Erling Haaland")).toBe("EH");
  });

  it("caps at 3 characters for longer names", () => {
    expect(getPlayerInitials("Ruud van Nistelrooy")).toBe("RvN");
  });

  it("handles a single-word name", () => {
    expect(getPlayerInitials("Kaká")).toBe("K");
  });
});

describe("getShortPlayerName", () => {
  it("matches the Figma/design-system pitch-caption examples", () => {
    expect(getShortPlayerName("Erling Haaland")).toBe("E. Haaland");
    expect(getShortPlayerName("Virgil van Dijk")).toBe("V. van Dijk");
    expect(getShortPlayerName("Thierry Henry")).toBe("T. Henry");
  });

  it("leaves a single-word name unchanged", () => {
    expect(getShortPlayerName("Kaká")).toBe("Kaká");
  });
});

describe("searchPlayers", () => {
  it("browses only natural fits for an empty query", () => {
    const results = searchPlayers("", "GK");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((player) => player.positions.includes("GK"))).toBe(true);
  });

  it("browses top-rated players for an empty query", () => {
    const results = searchPlayers("", "ST", 3);
    expect(results).toHaveLength(3);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].overallRating).toBeGreaterThanOrEqual(results[i].overallRating);
    }
  });

  it("filters by a case-insensitive substring match", () => {
    const results = searchPlayers("haaland", "ST");
    expect(results.some((player) => player.name === "Erling Haaland")).toBe(true);
  });

  it("never hard-blocks by position — a non-empty query still finds an out-of-position player", () => {
    // Erling Haaland is ST-only, but searching for him against a GK slot
    // should still surface him (SPEC.md 5.4: search is never blocked).
    const results = searchPlayers("haaland", "GK");
    expect(results.some((player) => player.name === "Erling Haaland")).toBe(true);
  });

  it("ranks natural fits above out-of-position matches for the same query", () => {
    // Cristiano Ronaldo (ST, MID) fits a MID slot; Ronaldo Nazário (ST only) doesn't.
    const results = searchPlayers("Ronaldo", "MID");
    const fitIndex = results.findIndex((player) => player.name === "Cristiano Ronaldo");
    const nonFitIndex = results.findIndex((player) => player.name === "Ronaldo Nazário");
    expect(fitIndex).toBeGreaterThanOrEqual(0);
    expect(nonFitIndex).toBeGreaterThanOrEqual(0);
    expect(fitIndex).toBeLessThan(nonFitIndex);
  });

  it("respects the limit", () => {
    const results = searchPlayers("", "MID", 2);
    expect(results).toHaveLength(2);
  });
});

describe("normalizePlayerName", () => {
  it("trims and lowercases for identity comparison", () => {
    expect(normalizePlayerName("  Erling Haaland ")).toBe(normalizePlayerName("erling haaland"));
  });
});

describe("STUB_PLAYERS", () => {
  it("has no duplicate names (duplicate-check invariant relies on name identity)", () => {
    const names = STUB_PLAYERS.map((player) => normalizePlayerName(player.name));
    expect(new Set(names).size).toBe(names.length);
  });

  it("has enough natural fits per position for two full squads plus Randomise headroom", () => {
    const byPosition = { GK: 0, DEF: 0, MID: 0, ST: 0 } as Record<string, number>;
    for (const player of STUB_PLAYERS) {
      for (const position of player.positions) byPosition[position]++;
    }
    expect(byPosition.GK).toBeGreaterThanOrEqual(4);
    expect(byPosition.DEF).toBeGreaterThanOrEqual(4);
    expect(byPosition.MID).toBeGreaterThanOrEqual(8);
    expect(byPosition.ST).toBeGreaterThanOrEqual(4);
  });

  it("keeps multi-position curation selective (1-3 positions per player, per the curation bar)", () => {
    for (const player of STUB_PLAYERS) {
      expect(player.positions.length).toBeGreaterThanOrEqual(1);
      expect(player.positions.length).toBeLessThanOrEqual(3);
    }
    // Majority should stay single-position, or the natural-fit/non-fit
    // distinction the whole feature depends on erodes into "everything flexible."
    const multiPosition = STUB_PLAYERS.filter((player) => player.positions.length > 1);
    expect(multiPosition.length).toBeLessThan(STUB_PLAYERS.length / 2);
  });
});
