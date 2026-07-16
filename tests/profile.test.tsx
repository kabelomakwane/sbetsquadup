import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { POSITION_SLOTS, type Match, type Team } from "@/lib/types";
import { useSquadUpStore } from "@/store/useSquadUpStore";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

import ProfilePage from "@/app/profile/page";

function makeTeam(side: "home" | "away", id: string, name: string): Team {
  return {
    id,
    side,
    name,
    players: new Array(POSITION_SLOTS.length).fill(undefined),
  };
}

function makeMatch(id: string, home: Team, away: Team): Match {
  return {
    id,
    homeTeam: home,
    awayTeam: away,
    events: [],
    finalScore: { home: 2, away: 1 },
    narrativeDescriptor: "a tense affair",
    status: "finished",
    stats: {
      home: { shots: 1, shotsOnTarget: 1, possession: 50, passes: 100 },
      away: { shots: 0, shotsOnTarget: 0, possession: 50, passes: 100 },
    },
  };
}

describe("ProfilePage", () => {
  beforeEach(() => {
    useSquadUpStore.setState({ user: null, savedSquads: [], matchHistory: [] });
  });

  it("prompts sign-in when there is no session", () => {
    render(<ProfilePage />);
    expect(screen.getByText(/sign in to see your saved squads/i)).toBeInTheDocument();
  });

  it("lists only the signed-in user's saved squads and match history", () => {
    const user = { id: "user-1", authProvider: "email" as const, signedInAt: 1 };
    const otherUsersTeam = makeTeam("home", "other-team", "Not Mine FC");
    const myTeam = makeTeam("home", "my-team", "My Dream Team");
    const myAway = makeTeam("away", "my-away", "Rivals FC");

    useSquadUpStore.setState({
      user,
      savedSquads: [
        { id: "s1", userId: "someone-else", team: otherUsersTeam, createdAt: 1 },
        { id: "s2", userId: user.id, team: myTeam, createdAt: 2 },
      ],
      matchHistory: [
        {
          id: "h1",
          userId: user.id,
          match: makeMatch("match-1", myTeam, myAway),
          playedAt: 3,
        },
      ],
    });

    render(<ProfilePage />);

    expect(screen.getAllByText(/my dream team/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/not mine fc/i)).not.toBeInTheDocument();
    expect(screen.getByText(/my dream team 2 - 1 rivals fc/i)).toBeInTheDocument();
  });
});
