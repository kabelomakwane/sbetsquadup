"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/Heading";
import { MatchSummaryTabs } from "@/components/MatchSummaryTabs";
import { PillButton } from "@/components/PillButton";
import { ScoreBug } from "@/components/ScoreBug";
import { ShareSheetModal } from "@/components/ShareSheetModal";
import { useHasHydrated, useSquadUpStore } from "@/store/useSquadUpStore";

// SPEC.md 5.9 Match Summary Page (Figma 68:704) — flow step 6-7.
export default function MatchSummaryPage() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const match = useSquadUpStore((state) => state.match);
  const rematch = useSquadUpStore((state) => state.rematch);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Waits for hasHydrated for the same reason as Match Result: persisted
  // `match` (SPEC.md 9) loads after the first render, so checking it at
  // mount before hydration finishes would wrongly redirect a returning user.
  useEffect(() => {
    if (!hasHydrated) return;
    if (!match) router.replace("/team-picker");
  }, [hasHydrated, match, router]);

  const handleRematch = () => {
    rematch();
    router.push("/team-picker");
  };

  if (!hasHydrated || !match) return null;

  return (
    <main className="flex flex-1 flex-col items-center gap-16 px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-8">
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
        <div className="flex flex-wrap items-center justify-center gap-6">
          <PillButton buttonStyle="primary" onClick={() => setIsShareOpen(true)}>
            Share Results
          </PillButton>
          {/* "Rematch", not "New Game" — SPEC.md 5.9/5.11 resolved copy: "New
              Game" only labels the separate first-entry button on the Landing
              Page (section 4, step 2). */}
          <PillButton buttonStyle="tertiary" onClick={handleRematch}>
            Rematch
          </PillButton>
        </div>
      </div>

      <ScoreBug
        homeTeamName={match.homeTeam.name}
        awayTeamName={match.awayTeam.name}
        homeScore={match.finalScore.home}
        awayScore={match.finalScore.away}
        showTimer={false}
      />

      <MatchSummaryTabs match={match} />

      {isShareOpen && <ShareSheetModal match={match} onClose={() => setIsShareOpen(false)} />}
    </main>
  );
}
