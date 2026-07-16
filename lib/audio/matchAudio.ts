// Howler wrapper for Live Commentary playback audio — SPEC.md 8.4. Stub
// clips for now (see CLAUDE.md "Known gaps"); real CC0 assets get sourced
// in Phase 11 and can drop in at the same paths without touching callers.

import { Howl } from "howler";

const AMBIENT_SRC = "/audio/ambient-crowd.wav";
const WHISTLE_SRC = "/audio/whistle.wav";
const GOAL_CHEER_SRC = "/audio/goal-cheer.wav";

export interface MatchAudioController {
  playWhistle: () => void;
  playGoalCheer: () => void;
  startAmbient: () => void;
  pauseAmbient: () => void;
  resumeAmbient: () => void;
  stopAmbient: () => void;
  setMuted: (muted: boolean) => void;
  unload: () => void;
}

/** Only call from client-side effects — Howl touches window/Audio APIs. */
export function createMatchAudioController(initialMuted = false): MatchAudioController {
  const ambient = new Howl({ src: [AMBIENT_SRC], loop: true, volume: 0.5, mute: initialMuted });
  const whistle = new Howl({ src: [WHISTLE_SRC], volume: 0.9, mute: initialMuted });
  const goalCheer = new Howl({ src: [GOAL_CHEER_SRC], volume: 0.9, mute: initialMuted });

  let ambientId: number | null = null;

  return {
    playWhistle: () => whistle.play(),
    playGoalCheer: () => goalCheer.play(),
    startAmbient: () => {
      ambientId = ambient.play();
    },
    pauseAmbient: () => {
      if (ambientId !== null) ambient.pause(ambientId);
    },
    resumeAmbient: () => {
      if (ambientId !== null) ambient.play(ambientId);
    },
    stopAmbient: () => {
      ambient.stop();
      ambientId = null;
    },
    setMuted: (muted) => {
      ambient.mute(muted);
      whistle.mute(muted);
      goalCheer.mute(muted);
    },
    unload: () => {
      ambient.unload();
      whistle.unload();
      goalCheer.unload();
    },
  };
}
