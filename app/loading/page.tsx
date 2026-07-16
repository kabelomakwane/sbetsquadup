"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ScoreBug } from "@/components/ScoreBug";
import { simulateMatch } from "@/lib/simulation";
import { useSquadUpStore } from "@/store/useSquadUpStore";

// SPEC.md 5.6 Game Loading Screen (Figma 68:621) — flow step 4, transitional.
export default function LoadingPage() {
  const router = useRouter();
  const homeTeam = useSquadUpStore((state) => state.homeTeam);
  const awayTeam = useSquadUpStore((state) => state.awayTeam);
  const setMatch = useSquadUpStore((state) => state.setMatch);

  // A Match is generated once, in full, before the Live Commentary Page
  // starts playing it back (SPEC.md 9) — this transitional screen is where
  // that happens. Re-generating on React StrictMode's double-invoke is
  // harmless (setMatch just gets called twice, last one wins); a "run
  // once" ref guard here would instead swallow the re-armed setTimeout
  // StrictMode's remount expects, leaving the redirect never firing.
  useEffect(() => {
    setMatch(simulateMatch(homeTeam, awayTeam, Date.now()));

    const timeout = setTimeout(() => router.push("/match/live"), 1800);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
