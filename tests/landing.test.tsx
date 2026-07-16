import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useSquadUpStore } from "@/store/useSquadUpStore";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

import LandingPage from "@/app/landing/page";

// SPEC.md 5.12: the account icon is the only entry point into Profile from
// Landing, and only shows once signed in — nothing to show a signed-out user.
describe("LandingPage account icon", () => {
  beforeEach(() => {
    useSquadUpStore.setState({ user: null });
  });

  it("hides the account icon when signed out", () => {
    render(<LandingPage />);
    expect(screen.queryByRole("button", { name: /my profile/i })).not.toBeInTheDocument();
  });

  it("shows the account icon once signed in", () => {
    useSquadUpStore.setState({
      user: { id: "user-1", authProvider: "email", signedInAt: 1, name: "Test Manager" },
    });
    render(<LandingPage />);
    expect(screen.getByRole("button", { name: /my profile/i })).toBeInTheDocument();
  });
});
