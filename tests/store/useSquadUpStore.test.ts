import { beforeEach, describe, expect, it } from "vitest";
import { useSquadUpStore } from "@/store/useSquadUpStore";
import { POSITION_SLOTS, type Match, type Team } from "@/lib/types";

function makeTeam(side: "home" | "away", id: string): Team {
  return {
    id,
    side,
    name: `${side} team`,
    players: new Array(POSITION_SLOTS.length).fill(undefined),
  };
}

function makeMatch(id: string, home: Team, away: Team): Match {
  return {
    id,
    homeTeam: home,
    awayTeam: away,
    events: [],
    finalScore: { home: 1, away: 0 },
    narrativeDescriptor: "a tense affair",
    status: "finished",
    stats: {
      home: { shots: 1, shotsOnTarget: 1, possession: 50, passes: 100 },
      away: { shots: 0, shotsOnTarget: 0, possession: 50, passes: 100 },
    },
  };
}

// Regression: a `user` persisted before User.name existed (v0) must be
// backfilled with a name on load, not crash getPlayerInitials(undefined)
// downstream (the Netlify deploy-preview bug this migration fixes).
describe("useSquadUpStore persist migration", () => {
  it("backfills a missing User.name on old (v0) persisted state", () => {
    const migrate = useSquadUpStore.persist.getOptions().migrate;
    expect(migrate).toBeDefined();

    const oldState = {
      ageConfirmed: true,
      user: { id: "user-1", authProvider: "email", signedInAt: 1 },
      match: null,
      matchPlaybackStarted: false,
      savedSquads: [],
      matchHistory: [],
    };

    const migrated = migrate!(oldState, 0) as typeof oldState & { user: { name?: string } };
    expect(migrated.user?.name).toBeTruthy();
    expect(typeof migrated.user?.name).toBe("string");
  });

  it("leaves a user that already has a name untouched", () => {
    const migrate = useSquadUpStore.persist.getOptions().migrate;
    const oldState = {
      ageConfirmed: true,
      user: { id: "user-1", authProvider: "email", signedInAt: 1, name: "Existing Name" },
      match: null,
      matchPlaybackStarted: false,
      savedSquads: [],
      matchHistory: [],
    };

    const migrated = migrate!(oldState, 1) as typeof oldState;
    expect(migrated.user?.name).toBe("Existing Name");
  });
});

// SPEC.md 9: SavedSquad/MatchHistory persistence tied to the mocked User.
describe("useSquadUpStore persistence", () => {
  beforeEach(() => {
    useSquadUpStore.setState({
      savedSquads: [],
      matchHistory: [],
      match: null,
      matchPlaybackStarted: false,
      user: null,
    });
  });

  it("addSavedSquad dedupes by team id (React StrictMode double-invoke safety)", () => {
    const team = makeTeam("home", "team-1");
    const squad = { id: "squad-1", userId: "user-1", team, createdAt: 1 };

    useSquadUpStore.getState().addSavedSquad(squad);
    useSquadUpStore.getState().addSavedSquad(squad);

    expect(useSquadUpStore.getState().savedSquads).toHaveLength(1);
  });

  it("addMatchHistory dedupes by match id (React StrictMode double-invoke safety)", () => {
    const home = makeTeam("home", "team-home");
    const away = makeTeam("away", "team-away");
    const match = makeMatch("match-1", home, away);
    const entry = { id: "history-1", userId: "user-1", match, playedAt: 1 };

    useSquadUpStore.getState().addMatchHistory(entry);
    useSquadUpStore.getState().addMatchHistory(entry);

    expect(useSquadUpStore.getState().matchHistory).toHaveLength(1);
  });

  it("keeps distinct squads/matches when ids differ", () => {
    const home = makeTeam("home", "team-home");
    const away = makeTeam("away", "team-away");

    useSquadUpStore.getState().addSavedSquad({ id: "s1", userId: "user-1", team: home, createdAt: 1 });
    useSquadUpStore.getState().addSavedSquad({ id: "s2", userId: "user-1", team: away, createdAt: 2 });
    expect(useSquadUpStore.getState().savedSquads).toHaveLength(2);

    useSquadUpStore.getState().addMatchHistory({
      id: "h1",
      userId: "user-1",
      match: makeMatch("match-1", home, away),
      playedAt: 1,
    });
    useSquadUpStore.getState().addMatchHistory({
      id: "h2",
      userId: "user-1",
      match: makeMatch("match-2", home, away),
      playedAt: 2,
    });
    expect(useSquadUpStore.getState().matchHistory).toHaveLength(2);
  });

  it("rematch clears match state but leaves saved squads and history intact", () => {
    const home = makeTeam("home", "team-home");
    const away = makeTeam("away", "team-away");
    useSquadUpStore.getState().addSavedSquad({ id: "s1", userId: "user-1", team: home, createdAt: 1 });
    useSquadUpStore.getState().addMatchHistory({
      id: "h1",
      userId: "user-1",
      match: makeMatch("match-1", home, away),
      playedAt: 1,
    });
    useSquadUpStore.getState().setMatch(makeMatch("match-1", home, away));
    useSquadUpStore.getState().markMatchPlaybackStarted();

    useSquadUpStore.getState().rematch();

    const state = useSquadUpStore.getState();
    expect(state.match).toBeNull();
    expect(state.matchPlaybackStarted).toBe(false);
    expect(state.savedSquads).toHaveLength(1);
    expect(state.matchHistory).toHaveLength(1);
  });
});

// SPEC.md 5.12: Profile "Play"/"Rematch" pre-fill and squad deletion.
describe("useSquadUpStore Profile actions", () => {
  beforeEach(() => {
    useSquadUpStore.setState({
      savedSquads: [],
      matchHistory: [],
      homeTeam: makeTeam("home", "initial-home"),
      awayTeam: makeTeam("away", "initial-away"),
    });
  });

  it("deleteSavedSquad removes only the matching squad by id", () => {
    const home1 = makeTeam("home", "team-home-1");
    const home2 = makeTeam("home", "team-home-2");
    useSquadUpStore.getState().addSavedSquad({ id: "s1", userId: "user-1", team: home1, createdAt: 1 });
    useSquadUpStore.getState().addSavedSquad({ id: "s2", userId: "user-1", team: home2, createdAt: 2 });

    useSquadUpStore.getState().deleteSavedSquad("s1");

    const state = useSquadUpStore.getState();
    expect(state.savedSquads.map((s) => s.id)).toEqual(["s2"]);
  });

  it("loadSavedSquad writes a home squad into homeTeam and clears awayTeam", () => {
    const home = makeTeam("home", "saved-home");
    home.name = "Saved Home Squad";

    useSquadUpStore.getState().loadSavedSquad(home);

    const state = useSquadUpStore.getState();
    expect(state.homeTeam.name).toBe("Saved Home Squad");
    expect(state.homeTeam.id).not.toBe(home.id);
    expect(state.awayTeam.name).toBe("");
    expect(state.awayTeam.players.every((p) => p === undefined)).toBe(true);
  });

  it("loadSavedSquad writes an away squad into awayTeam and clears homeTeam", () => {
    const away = makeTeam("away", "saved-away");
    away.name = "Saved Away Squad";

    useSquadUpStore.getState().loadSavedSquad(away);

    const state = useSquadUpStore.getState();
    expect(state.awayTeam.name).toBe("Saved Away Squad");
    expect(state.awayTeam.id).not.toBe(away.id);
    expect(state.homeTeam.name).toBe("");
  });

  it("loadMatchTeams writes both sides from the match with fresh ids", () => {
    const home = makeTeam("home", "match-home");
    home.name = "Match Home";
    const away = makeTeam("away", "match-away");
    away.name = "Match Away";
    const match = makeMatch("match-1", home, away);

    useSquadUpStore.getState().loadMatchTeams(match);

    const state = useSquadUpStore.getState();
    expect(state.homeTeam.name).toBe("Match Home");
    expect(state.homeTeam.id).not.toBe(home.id);
    expect(state.awayTeam.name).toBe("Match Away");
    expect(state.awayTeam.id).not.toBe(away.id);
  });
});
