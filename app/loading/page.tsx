"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ScoreBug } from "@/components/ScoreBug";
import { useSquadUpStore } from "@/store/useSquadUpStore";

// SPEC.md 5.6 Game Loading Screen (Figma 68:621) — flow step 4, transitional.
export default function LoadingPage() {
  const router = useRouter();
  const homeTeam = useSquadUpStore((state) => state.homeTeam);
  const awayTeam = useSquadUpStore((state) => state.awayTeam);

  useEffect(() => {
    const timeout = setTimeout(() => router.push("/match/live"), 1800);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <Image
        src="/images/sbet-squad-up-logo.svg"
        alt="SBET Squad Up"
        width={600}
        height={160}
        priority
        className="h-auto w-[280px] sm:w-[380px] md:w-[480px]"
      />
      <ScoreBug
        homeTeamName={homeTeam.name || "Pick A Team Name"}
        awayTeamName={awayTeam.name || "Pick A Team Name"}
        showScores={false}
        showTimer={false}
      />
      <p className="font-button text-2xl italic text-white">Team buses arriving...</p>
    </main>
  );
}
