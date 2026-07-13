import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  it("renders the Squad Up heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /squad up/i })).toBeInTheDocument();
  });
});
