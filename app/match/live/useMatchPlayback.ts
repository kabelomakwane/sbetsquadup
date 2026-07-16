"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CommentaryEvent, Match } from "@/lib/types";
import { createMatchAudioController, type MatchAudioController } from "@/lib/audio/matchAudio";
import {
  TOTAL_SECONDS,
  gameClockLabel,
  phaseAtElapsed,
  scheduleEvents,
  type PlaybackPhase,
  type ScheduledEvent,
} from "@/lib/playback/commentaryTimeline";

const TICK_MS = 100;
const TOTAL_MS = TOTAL_SECONDS * 1000;

export interface MatchPlaybackState {
  revealedEvents: CommentaryEvent[];
  phase: PlaybackPhase;
  clockLabel: string;
  isPaused: boolean;
  isMuted: boolean;
  homeScore: number;
  awayScore: number;
  togglePause: () => void;
  toggleMute: () => void;
}

/** Paced reveal of an already-generated Match — SPEC.md 5.7/8.3/8.4. */
export function useMatchPlayback(match: Match | null): MatchPlaybackState {
  const scheduledRef = useRef<ScheduledEvent[]>([]);
  const accumulatedMsRef = useRef(0);
  const runStartRef = useRef<number | null>(null);
  const revealedCountRef = useRef(0);
  const firedPhasesRef = useRef<Set<PlaybackPhase>>(new Set());
  const audioRef = useRef<MatchAudioController | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [revealedEvents, setRevealedEvents] = useState<CommentaryEvent[]>([]);

  // (Re)start playback whenever the match itself changes.
  useEffect(() => {
    if (!match) return;

    scheduledRef.current = scheduleEvents(match.events);
    accumulatedMsRef.current = 0;
    runStartRef.current = performance.now();
    revealedCountRef.current = 0;
    firedPhasesRef.current = new Set();
    // No setElapsedSeconds/setRevealedEvents/setIsPaused reset here: this
    // effect only ever runs once per real mount (a fresh match always means
    // a fresh page mount, see the live page's mid-match-exit redirect), so
    // the useState defaults above already hold.

    const audio = createMatchAudioController(isMuted);
    audioRef.current = audio;
    audio.playWhistle();
    audio.startAmbient();

    return () => {
      audio.unload();
      audioRef.current = null;
    };
    // isMuted intentionally excluded: toggleMute drives the live controller directly,
    // it shouldn't tear down and recreate playback state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match]);

  useEffect(() => {
    if (!match || isPaused) return;

    const interval = setInterval(() => {
      const now = performance.now();
      const runStart = runStartRef.current ?? now;
      const elapsedMs = Math.min(accumulatedMsRef.current + (now - runStart), TOTAL_MS);
      const seconds = elapsedMs / 1000;
      setElapsedSeconds(seconds);

      const phase = phaseAtElapsed(seconds);
      const audio = audioRef.current;
      const fired = firedPhasesRef.current;

      if (phase === "half-time" && !fired.has("half-time")) {
        fired.add("half-time");
        audio?.playWhistle();
        audio?.pauseAmbient();
      }
      if (phase === "second-half" && !fired.has("second-half")) {
        fired.add("second-half");
        audio?.playWhistle();
        audio?.resumeAmbient();
      }
      if (phase === "full-time" && !fired.has("full-time")) {
        fired.add("full-time");
        audio?.playWhistle();
        audio?.stopAmbient();
      }

      const scheduled = scheduledRef.current;
      let revealedCount = revealedCountRef.current;
      while (revealedCount < scheduled.length && scheduled[revealedCount].realSeconds <= seconds) {
        revealedCount++;
      }
      if (revealedCount !== revealedCountRef.current) {
        const newlyRevealed = scheduled.slice(revealedCountRef.current, revealedCount);
        revealedCountRef.current = revealedCount;
        setRevealedEvents(scheduled.slice(0, revealedCount).map((s) => s.event));
        if (newlyRevealed.some((s) => s.event.type === "goal")) {
          audio?.playGoalCheer();
        }
      }
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [match, isPaused]);

  // Side effects (audio calls, ref bookkeeping) live in the handler body, not
  // in a setState updater function — React (StrictMode) can invoke updaters
  // twice to check purity, which would double-apply them.
  const togglePause = () => {
    const now = performance.now();
    if (!isPaused) {
      // Pausing: bank the elapsed time and freeze the clock.
      const runStart = runStartRef.current ?? now;
      accumulatedMsRef.current = Math.min(accumulatedMsRef.current + (now - runStart), TOTAL_MS);
      audioRef.current?.pauseAmbient();
    } else {
      runStartRef.current = now;
      if (phaseAtElapsed(accumulatedMsRef.current / 1000) !== "half-time") {
        audioRef.current?.resumeAmbient();
      }
    }
    setIsPaused(!isPaused);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    audioRef.current?.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const { homeScore, awayScore } = useMemo(() => {
    let home = 0;
    let away = 0;
    for (const event of revealedEvents) {
      if (event.type !== "goal") continue;
      if (event.side === "home") home++;
      if (event.side === "away") away++;
    }
    return { homeScore: home, awayScore: away };
  }, [revealedEvents]);

  return {
    revealedEvents,
    phase: phaseAtElapsed(elapsedSeconds),
    clockLabel: gameClockLabel(elapsedSeconds),
    isPaused,
    isMuted,
    homeScore,
    awayScore,
    togglePause,
    toggleMute,
  };
}
