import { describe, expect, it } from "vitest";
import {
  buildFillerEvents,
  buildFixedPointEvents,
  fillTemplate,
  HALF_MINUTES,
  MATCH_MINUTES,
} from "@/lib/simulation/events";
import { simulateMatch } from "@/lib/simulation";
import { createRng } from "@/lib/simulation/rng";
import {
  BUILDUP_TEMPLATES,
  CORNER_TEMPLATES,
  DEFENSIVE_PLAY_TEMPLATES,
  FOUL_TEMPLATES,
  GOAL_TEAM_MOVE_TEMPLATES,
  LATE_TENSION_TEMPLATES,
  OFF_THE_POST_TEMPLATES,
  SHOT_OFF_TARGET_TEMPLATES,
  SHOT_SAVED_TEMPLATES,
  STAT_FLAVOR_TEMPLATES,
  YELLOW_CARD_TEMPLATES,
} from "@/lib/simulation/commentaryTemplates";
import { POSITION_SLOTS, type CommentaryEvent, type Player, type Position, type Side, type Team } from "@/lib/types";

function makePlayer(id: string, rating: number, position: Position): Player {
  return { id, name: id, positions: [position], club: "Test FC", overallRating: rating, era: "current", source: "database" };
}

function makeTeam(side: Side, name: string, rating = 80): Team {
  return {
    id: `${side}-team`,
    side,
    name,
    players: POSITION_SLOTS.map((position, i) => makePlayer(`${side}-${position}-${i}`, rating, position)),
  };
}

const LEFTOVER_TOKEN_PATTERN = /\{[A-Za-z0-9]+\}/;

function eventStrings(event: CommentaryEvent): string[] {
  return event.headline ? [event.headline, event.text] : [event.text];
}

/** Builds a matcher regex from a raw source template, turning each {token} into a wildcard. */
function templateToRegex(template: string): RegExp {
  const escaped = template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const withWildcards = escaped.replace(/\\\{[A-Za-z0-9]+\\\}/g, "[\\s\\S]*?");
  return new RegExp(`^${withWildcards}$`);
}

function reconstruct(event: CommentaryEvent): string {
  return event.headline ? `**${event.headline}** ${event.text}` : event.text;
}

function matchesAnyTemplate(event: CommentaryEvent, templates: readonly string[]): boolean {
  const full = reconstruct(event);
  return templates.some((template) => templateToRegex(template).test(full));
}

describe("fillTemplate", () => {
  it("uppercases only the ALL-CAPS token spelling, leaves lowercase spelling as-is", () => {
    const home = makeTeam("home", "Home United");
    const away = makeTeam("away", "Away FC");
    const filled = fillTemplate("{TEAM} vs {team}, hosted by {opponent}", { team: home, opponent: away });
    expect(filled.text).toBe("HOME UNITED vs Home United, hosted by Away FC");
  });

  it("substitutes every occurrence of a repeated token, not just the first", () => {
    // GOAL_TEAM_MOVE_TEMPLATES[8] repeats {team} twice — the bug the design
    // review caught in the naive sequential-.replace() approach.
    const template = GOAL_TEAM_MOVE_TEMPLATES[8];
    expect(template.split("{team}").length - 1).toBeGreaterThanOrEqual(2);

    const home = makeTeam("home", "Home United");
    const away = makeTeam("away", "Away FC");
    const scorer = home.players[0]!;
    const assister = home.players[1]!;
    const filled = fillTemplate(template, {
      team: home,
      opponent: away,
      scorer,
      assister,
      teamScore: 2,
      opponentScore: 1,
    });
    const occurrences = (filled.text.match(/Home United/g) ?? []).length;
    expect(occurrences).toBeGreaterThanOrEqual(2);
    expect(filled.text).not.toMatch(LEFTOVER_TOKEN_PATTERN);
    expect(filled.headline).not.toMatch(LEFTOVER_TOKEN_PATTERN);
  });

  it("splits a leading **bold** span into headline/text", () => {
    const filled = fillTemplate("**BIG MOMENT!** the rest of the line.", {});
    expect(filled.headline).toBe("BIG MOMENT!");
    expect(filled.text).toBe("the rest of the line.");
  });

  it("leaves headline undefined when there's no bold span", () => {
    const filled = fillTemplate("Just a plain line.", {});
    expect(filled.headline).toBeUndefined();
    expect(filled.text).toBe("Just a plain line.");
  });
});

describe("buildFixedPointEvents", () => {
  it("always returns exactly one event at each of the four fixed minutes", () => {
    const home = makeTeam("home", "Home United");
    const away = makeTeam("away", "Away FC");

    for (let seed = 0; seed < 20; seed++) {
      const events = buildFixedPointEvents(createRng(seed), home, away, 0, 0, 2, 1);
      expect(events).toHaveLength(4);
      expect(events.map((e) => e.minute).sort((a, b) => a - b)).toEqual([1, HALF_MINUTES, HALF_MINUTES + 1, MATCH_MINUTES]);
      for (const event of events) {
        expect(event.type).toBe("commentary");
        expect(event.side).toBeNull();
        for (const str of eventStrings(event)) expect(str).not.toMatch(LEFTOVER_TOKEN_PATTERN);
      }
    }
  });
});

describe("buildFillerEvents", () => {
  const home = makeTeam("home", "Home United");
  const away = makeTeam("away", "Away FC");
  const stats = {
    home: { shots: 10, shotsOnTarget: 5, possession: 55, passes: 400 },
    away: { shots: 8, shotsOnTarget: 3, possession: 45, passes: 350 },
  };

  it("never leaves an unsubstituted {token} across many seeds", () => {
    for (let seed = 0; seed < 30; seed++) {
      const events = buildFillerEvents(createRng(seed), 200, 1.2, 1.0, {
        homeTeam: home,
        awayTeam: away,
        stats,
        homeStandout: home.players[0]!,
        awayStandout: away.players[0]!,
        homeGoals: 1,
        awayGoals: 1,
      });
      for (const event of events) {
        for (const str of eventStrings(event)) expect(str).not.toMatch(LEFTOVER_TOKEN_PATTERN);
      }
    }
  });

  it("reaches every chance, card, and commentary sub-category given enough draws", () => {
    const events = buildFillerEvents(createRng(99), 4000, 1.1, 1.0, {
      homeTeam: home,
      awayTeam: away,
      stats,
      homeStandout: home.players[0]!,
      awayStandout: away.players[0]!,
      // Close scoreline late-tension coverage is asserted separately below;
      // keep it eligible here too so the full category set is exercised.
      homeGoals: 1,
      awayGoals: 1,
    });

    const templateSets: [string, readonly string[]][] = [
      ["shot off target", SHOT_OFF_TARGET_TEMPLATES],
      ["shot saved", SHOT_SAVED_TEMPLATES],
      ["off the post", OFF_THE_POST_TEMPLATES],
      ["last-ditch defensive", DEFENSIVE_PLAY_TEMPLATES],
      ["yellow card", YELLOW_CARD_TEMPLATES],
      ["buildup", BUILDUP_TEMPLATES],
      ["foul", FOUL_TEMPLATES],
      ["corner", CORNER_TEMPLATES],
      ["stat/form flavor", STAT_FLAVOR_TEMPLATES],
    ];

    for (const [label, templates] of templateSets) {
      const reached = events.some((event) => matchesAnyTemplate(event, templates));
      expect(reached, `expected at least one "${label}" event across 4000 draws`).toBe(true);
    }
  });

  it("only produces late-game-tension lines when the scoreline is close and the minute is late", () => {
    const closeLate = buildFillerEvents(createRng(5), 3000, 1.0, 1.0, {
      homeTeam: home,
      awayTeam: away,
      stats,
      homeStandout: home.players[0]!,
      awayStandout: away.players[0]!,
      homeGoals: 2,
      awayGoals: 2,
    });
    expect(closeLate.some((event) => matchesAnyTemplate(event, LATE_TENSION_TEMPLATES))).toBe(true);

    const blowout = buildFillerEvents(createRng(5), 3000, 1.0, 1.0, {
      homeTeam: home,
      awayTeam: away,
      stats,
      homeStandout: home.players[0]!,
      awayStandout: away.players[0]!,
      homeGoals: 5,
      awayGoals: 0,
    });
    expect(blowout.some((event) => matchesAnyTemplate(event, LATE_TENSION_TEMPLATES))).toBe(false);
  });
});

describe("simulateMatch commentary integration", () => {
  it("never leaves an unsubstituted {token} anywhere in a full match's events", () => {
    const home = makeTeam("home", "Home United", 82);
    const away = makeTeam("away", "Away FC", 77);

    for (let seed = 0; seed < 25; seed++) {
      const match = simulateMatch(home, away, seed);
      for (const event of match.events) {
        for (const str of eventStrings(event)) expect(str).not.toMatch(LEFTOVER_TOKEN_PATTERN);
      }
    }
  });

  it("includes exactly one fixed-point commentary event at each reserved minute", () => {
    const home = makeTeam("home", "Home United", 82);
    const away = makeTeam("away", "Away FC", 77);

    for (let seed = 0; seed < 15; seed++) {
      const match = simulateMatch(home, away, seed);
      for (const minute of [1, HALF_MINUTES, HALF_MINUTES + 1, MATCH_MINUTES]) {
        const atMinute = match.events.filter((event) => event.minute === minute);
        expect(atMinute).toHaveLength(1);
        expect(atMinute[0].type).toBe("commentary");
        expect(atMinute[0].side).toBeNull();
      }
    }
  });
});
