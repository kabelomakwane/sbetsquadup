import { describe, expect, it } from "vitest";
import {
  HALF_SECONDS,
  SECOND_HALF_START_SECONDS,
  TOTAL_SECONDS,
  gameClockLabel,
  minuteToRealSeconds,
  phaseAtElapsed,
  scheduleEvents,
} from "@/lib/playback/commentaryTimeline";
import type { CommentaryEvent } from "@/lib/types";

describe("minuteToRealSeconds", () => {
  it("maps first-half minutes into the first 43 real seconds", () => {
    expect(minuteToRealSeconds(1)).toBeCloseTo(2.15);
    expect(minuteToRealSeconds(20)).toBeCloseTo(43);
  });

  it("maps second-half minutes into the 47-90 real second window", () => {
    expect(minuteToRealSeconds(21)).toBeCloseTo(SECOND_HALF_START_SECONDS + 43 / 20);
    expect(minuteToRealSeconds(40)).toBeCloseTo(TOTAL_SECONDS);
  });
});

describe("scheduleEvents", () => {
  it("sorts events by their real-time position regardless of input order", () => {
    const events: CommentaryEvent[] = [
      { minute: 35, type: "commentary", text: "b", side: null },
      { minute: 5, type: "goal", text: "a", side: "home" },
      { minute: 20, type: "chance", text: "c", side: "away" },
    ];

    const scheduled = scheduleEvents(events);

    expect(scheduled.map((s) => s.event.text)).toEqual(["a", "c", "b"]);
    expect(scheduled.every((s, i) => i === 0 || s.realSeconds >= scheduled[i - 1].realSeconds)).toBe(true);
  });
});

describe("phaseAtElapsed", () => {
  it("resolves the four playback phases at their boundaries", () => {
    expect(phaseAtElapsed(0)).toBe("first-half");
    expect(phaseAtElapsed(HALF_SECONDS - 0.01)).toBe("first-half");
    expect(phaseAtElapsed(HALF_SECONDS)).toBe("half-time");
    expect(phaseAtElapsed(SECOND_HALF_START_SECONDS - 0.01)).toBe("half-time");
    expect(phaseAtElapsed(SECOND_HALF_START_SECONDS)).toBe("second-half");
    expect(phaseAtElapsed(TOTAL_SECONDS - 0.01)).toBe("second-half");
    expect(phaseAtElapsed(TOTAL_SECONDS)).toBe("full-time");
  });
});

describe("gameClockLabel", () => {
  it("reads 00:00 at kickoff and 20:00 at halftime", () => {
    expect(gameClockLabel(0)).toBe("00:00");
    expect(gameClockLabel(HALF_SECONDS)).toBe("20:00");
  });

  it("holds at 20:00 through the halftime break", () => {
    expect(gameClockLabel(HALF_SECONDS + 1)).toBe("20:00");
    expect(gameClockLabel(SECOND_HALF_START_SECONDS - 0.01)).toBe("20:00");
  });

  it("reads 40:00 at full-time", () => {
    expect(gameClockLabel(TOTAL_SECONDS)).toBe("40:00");
  });

  it("clamps to the 0-90s window", () => {
    expect(gameClockLabel(-5)).toBe("00:00");
    expect(gameClockLabel(1000)).toBe("40:00");
  });
});
