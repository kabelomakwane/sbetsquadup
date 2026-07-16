"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/Heading";
import { ScoreBug } from "@/components/ScoreBug";
import { useSquadUpStore } from "@/store/useSquadUpStore";

// A short beat between the live feed ending and the full summary (SPEC.md
// 5.8) — no button in Figma 68:691, so it auto-advances after a pause long
// enough to read the headline, same pattern as the Loading screen's timeout.
const RESULT_BEAT_MS = 3000;

// SPEC.md 5.8 End of Match Page / Match Result Screen (Figma 68:691) — flow step 5-6.
export default function MatchResultPage() {
  const router = useRouter();
  const match = useSquadUpStore((state) => state.match);

  useEffect(() => {
    if (!match) {
      router.replace("/team-picker");
      return;
    }
    const timeout = setTimeout(() => router.push("/match/summary"), RESULT_BEAT_MS);
    return () => clearTimeout(timeout);
  }, [match, router]);

  if (!match) return null;

  return (
    <main
      className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-8 px-6 py-16 text-center"
      onClick={() => router.push("/match/summary")}
    >
      <Image
        src="/images/sbet-squad-up-logo.svg"
        alt="SBET Squad Up"
        width={300}
        height={80}
        priority
        className="h-auto w-[180px] sm:w-[220px] md:w-[280px]"
      />
      <Heading level={1} className="max-w-[700px]">
        {match.narrativeDescriptor}
      </Heading>
      <ScoreBug
        homeTeamName={match.homeTeam.name}
        awayTeamName={match.awayTeam.name}
        homeScore={match.finalScore.home}
        awayScore={match.finalScore.away}
        timerState="full-time"
      />
    </main>
  );
}
