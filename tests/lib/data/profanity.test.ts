import { describe, expect, it } from "vitest";
import { containsProfanity } from "@/lib/data/profanity";

describe("containsProfanity", () => {
  it("flags a banned word", () => {
    expect(containsProfanity("you total bastard")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(containsProfanity("BASTARD FC")).toBe(true);
  });

  it("passes clean text", () => {
    expect(containsProfanity("Ballerz FC")).toBe(false);
  });

  it("does not false-positive on a word that merely contains a banned substring (Scunthorpe problem)", () => {
    expect(containsProfanity("Classic FC")).toBe(false);
    expect(containsProfanity("Scunthorpe Strikers")).toBe(false);
  });
});
