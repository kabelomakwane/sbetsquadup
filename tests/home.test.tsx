import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

import AgeCheckPage from "@/app/page";

describe("AgeCheckPage", () => {
  it("renders the Age Check heading", () => {
    render(<AgeCheckPage />);
    expect(
      screen.getByRole("heading", { name: /confirm you are over 18/i }),
    ).toBeInTheDocument();
  });
});
