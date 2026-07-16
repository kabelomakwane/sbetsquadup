"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CommentaryEventRow } from "@/components/CommentaryEventRow";
import { PillButton } from "@/components/PillButton";
import { ScoreBug } from "@/components/ScoreBug";
import { HALF_MINUTES } from "@/lib/simulation";
import type { CommentaryEvent } from "@/lib/types";
import { useSquadUpStore } from "@/store/useSquadUpStore";
import { useMatchPlayback } from "./useMatchPlayback";

function CommentaryRow({ event }: { event: CommentaryEvent }) {
  if (event.type === "goal") {
    return (
      <CommentaryEventRow
        variant="keyMoment"
        minute={event.minute}
        side={event.side ?? "home"}
        headline="GOAL!"
        text={event.text.replace(/^GOAL!\s*/i, "")}
      />
    );
  }
  return <CommentaryEventRow variant="default" minute={event.minute} text={event.text} />;
}

// SPEC.md 5.7 Live Commentary Page (Figma 68:634) — flow step 4-5.
export default function LiveCommentaryPage() {
  const router = useRouter();
  const match = useSquadUpStore((state) => state.match);
  const matchPlaybackStarted = useSquadUpStore((state) => state.matchPlaybackStarted);
  const markMatchPlaybackStarted = useSquadUpStore((state) => state.markMatchPlaybackStarted);

  // Snapshot at mount, not the live store value: markMatchPlaybackStarted()
  // below flips the store flag true right after mount, and re-deriving from
  // the live value would immediately tear the just-started hook back down.
  const [wasAlreadyStarted] = useState(matchPlaybackStarted);

  // Mid-match exit (SPEC.md 5.7/9): the Match is generated in full before this
  // page ever plays a frame, so re-entering after having left mid-playback
  // (or after it finished) has nothing to resume — drop straight on the
  // result. This covers in-session navigation (SPA back/forward, or typing
  // the URL again); it doesn't survive a hard tab close/reopen, since match
  // state isn't persisted to localStorage.
  useEffect(() => {
    if (!match) {
      router.replace("/team-picker");
      return;
    }
    if (wasAlreadyStarted) {
      router.replace("/match/result");
      return;
    }
    markMatchPlaybackStarted();
  }, [match, wasAlreadyStarted, markMatchPlaybackStarted, router]);

  const playback = useMatchPlayback(wasAlreadyStarted ? null : match);

  useEffect(() => {
    if (playback.phase === "full-time") {
      router.push("/match/result");
    }
  }, [playback.phase, router]);

  const feedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [playback.revealedEvents]);

  if (!match || wasAlreadyStarted) return null;

  const timerState = playback.isPaused
    ? "paused"
    : playback.phase === "half-time"
      ? "half-time"
      : playback.phase === "full-time"
        ? "full-time"
        : "default";

  const firstHalfEvents = playback.revealedEvents.filter((event) => event.minute <= HALF_MINUTES);
  const secondHalfEvents = playback.revealedEvents.filter((event) => event.minute > HALF_MINUTES);
  const showHalfTimeMarker = playback.phase !== "first-half";

  const handleSkip = () => router.push("/match/result");

  return (
    <main className="flex flex-1 flex-col items-center gap-8 overflow-hidden px-6 py-8">
      <div className="flex flex-col items-center gap-8">
        <Image
          src="/images/sbet-squad-up-logo.svg"
          alt="SBET Squad Up"
          width={300}
          height={80}
          priority
          className="h-auto w-[180px] sm:w-[220px] md:w-[280px]"
        />

        <ScoreBug
          homeTeamName={match.homeTeam.name}
          awayTeamName={match.awayTeam.name}
          homeScore={playback.homeScore}
          awayScore={playback.awayScore}
          timerState={timerState}
          time={playback.clockLabel}
        />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <PillButton
            buttonStyle="tertiary"
            onClick={playback.toggleMute}
            icon={
              <Image
                src={playback.isMuted ? "/images/icon-volume-mute.svg" : "/images/icon-volume-up.svg"}
                alt=""
                width={16}
                height={16}
              />
            }
            iconPosition="leading"
          >
            {playback.isMuted ? "Unmute" : "Mute"}
          </PillButton>
          <PillButton
            buttonStyle="tertiary"
            onClick={playback.togglePause}
            icon={
              <Image
                src={playback.isPaused ? "/images/icon-play.svg" : "/images/icon-pause.svg"}
                alt=""
                width={16}
                height={16}
              />
            }
            iconPosition="leading"
          >
            {playback.isPaused ? "Resume" : "Pause"}
          </PillButton>
          <PillButton
            buttonStyle="tertiary"
            onClick={handleSkip}
            icon={<Image src="/images/icon-fast-forward.svg" alt="" width={16} height={16} />}
            iconPosition="leading"
          >
            Skip
          </PillButton>
        </div>
      </div>

      <div
        ref={feedRef}
        className="flex w-full max-w-[500px] flex-1 flex-col gap-6 overflow-y-auto scroll-smooth"
      >
        {firstHalfEvents.map((event, index) => (
          <CommentaryRow key={`first-${index}`} event={event} />
        ))}
        {showHalfTimeMarker && <CommentaryEventRow variant="halfTime" />}
        {secondHalfEvents.map((event, index) => (
          <CommentaryRow key={`second-${index}`} event={event} />
        ))}
      </div>
    </main>
  );
}
