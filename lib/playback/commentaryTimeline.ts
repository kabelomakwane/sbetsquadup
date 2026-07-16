// Pure playback-pacing helpers for the Live Commentary Page — SPEC.md 5.7 /
// 8.3. Maps the simulated match's game-minute events onto the fixed
// 43s/43s/4s real-time run. Framework-agnostic so it can be unit tested
// without mounting the page.

import type { CommentaryEvent } from "@/lib/types";
import { HALF_MINUTES } from "@/lib/simulation";

export const HALF_SECONDS = 43;
export const HALFTIME_SECONDS = 4;
export const SECOND_HALF_START_SECONDS = HALF_SECONDS + HALFTIME_SECONDS; // 47
export const TOTAL_SECONDS = SECOND_HALF_START_SECONDS + HALF_SECONDS; // 90

export type PlaybackPhase = "first-half" | "half-time" | "second-half" | "full-time";

export interface ScheduledEvent {
  event: CommentaryEvent;
  realSeconds: number;
}

/**
 * Maps a simulated game minute (1..HALF_MINUTES*2, two HALF_MINUTES-minute
 * halves) onto its real-time position within the fixed playback window.
 */
export function minuteToRealSeconds(minute: number): number {
  if (minute <= HALF_MINUTES) {
    return (minute / HALF_MINUTES) * HALF_SECONDS;
  }
  return SECOND_HALF_START_SECONDS + ((minute - HALF_MINUTES) / HALF_MINUTES) * HALF_SECONDS;
}

/** Events in scheduled real-time order, ready for a paced reveal. */
export function scheduleEvents(events: CommentaryEvent[]): ScheduledEvent[] {
  return events
    .map((event) => ({ event, realSeconds: minuteToRealSeconds(event.minute) }))
    .sort((a, b) => a.realSeconds - b.realSeconds);
}

export function phaseAtElapsed(elapsedSeconds: number): PlaybackPhase {
  if (elapsedSeconds >= TOTAL_SECONDS) return "full-time";
  if (elapsedSeconds >= SECOND_HALF_START_SECONDS) return "second-half";
  if (elapsedSeconds >= HALF_SECONDS) return "half-time";
  return "first-half";
}

/** Simulated match clock (mm:ss of in-game time) for the header Timer. */
export function gameClockLabel(elapsedSeconds: number): string {
  const clamped = Math.min(Math.max(elapsedSeconds, 0), TOTAL_SECONDS);
  let gameMinutes: number;
  if (clamped <= HALF_SECONDS) {
    gameMinutes = (clamped / HALF_SECONDS) * HALF_MINUTES;
  } else if (clamped < SECOND_HALF_START_SECONDS) {
    gameMinutes = HALF_MINUTES;
  } else {
    gameMinutes = HALF_MINUTES + ((clamped - SECOND_HALF_START_SECONDS) / HALF_SECONDS) * HALF_MINUTES;
  }
  const mm = Math.floor(gameMinutes);
  const ss = Math.floor((gameMinutes - mm) * 60);
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}
