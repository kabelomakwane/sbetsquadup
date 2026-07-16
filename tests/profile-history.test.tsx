import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { POSITION_SLOTS, type Match, type Team } from "@/lib/types";
import { useSquadUpStore } from "@/store/useSquadUpStore";

const replace = vi.fn();
let currentHistoryId = "h1";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace }),
  useParams: () => ({ historyId: currentHistoryId }),
}));

import MatchHistoryDetailPage from "@/app/profile/history/[historyId]/page";

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
    finalScore: { home: 3, away: 1 },
    narrativeDescriptor: "a landslide victory",
    status: "finished",
    stats: {
      home: { shots: 5, shotsOnTarget: 3, possession: 60, passes: 200 },
      away: { shots: 2, shotsOnTarget: 1, possession: 40, passes: 150 },
    },
  };
}

const user = { id: "user-1", authProvider: "email" as const, signedInAt: 1, name: "Test Manager" };
const home = makeTeam("home", "home-1", "Home Squad");
const away = makeTeam("away", "away-1", "Away Squad");
const match = makeMatch("match-1", home, away);

describe("MatchHistoryDetailPage", () => {
  beforeEach(() => {
    replace.mockClear();
    currentHistoryId = "h1";
    useSquadUpStore.setState({
      user,
      matchHistory: [{ id: "h1", userId: user.id, match, playedAt: 1 }],
    });
  });

  it("renders the owning user's match", () => {
    render(<MatchHistoryDetailPage />);
    expect(screen.getByText(/a landslide victory/i)).toBeInTheDocument();
    expect(screen.getByText(/home squad/i)).toBeInTheDocument();
    expect(screen.getByText(/away squad/i)).toBeInTheDocument();
  });

  it("redirects to /profile when the history id belongs to another user", () => {
    useSquadUpStore.setState({
      matchHistory: [{ id: "h1", userId: "someone-else", match, playedAt: 1 }],
    });
    render(<MatchHistoryDetailPage />);
    expect(replace).toHaveBeenCalledWith("/profile");
  });

  it("redirects to /profile when the history id doesn't exist", () => {
    currentHistoryId = "does-not-exist";
    render(<MatchHistoryDetailPage />);
    expect(replace).toHaveBeenCalledWith("/profile");
  });
});
