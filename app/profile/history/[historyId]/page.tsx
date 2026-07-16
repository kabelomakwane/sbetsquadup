"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heading } from "@/components/Heading";
import { MatchSummaryTabs } from "@/components/MatchSummaryTabs";
import { PillButton } from "@/components/PillButton";
import { ScoreBug } from "@/components/ScoreBug";
import { useHasHydrated, useSquadUpStore } from "@/store/useSquadUpStore";

// Read-only past-match view, reached from Profile's History tab "View"
// action — SPEC.md 5.12. Deliberately doesn't touch the shared `match`
// store slot (that's the "current" match, tied to SPEC.md 9's mid-match-
// exit resume logic); this looks a specific MatchHistory entry up directly.
export default function MatchHistoryDetailPage() {
  const router = useRouter();
  const { historyId } = useParams<{ historyId: string }>();
  const hasHydrated = useHasHydrated();
  const user = useSquadUpStore((state) => state.user);
  const matchHistory = useSquadUpStore((state) => state.matchHistory);

  // Scoped to the signed-in user's own id, not just the history id, so one
  // user can't view another's match by guessing/typing a different id.
  const entry = matchHistory.find((item) => item.id === historyId && item.userId === user?.id);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user || !entry) router.replace("/profile");
  }, [hasHydrated, user, entry, router]);

  if (!hasHydrated || !user || !entry) return null;

  return (
    <main className="flex flex-1 flex-col items-center gap-10 px-6 py-16 text-center">
      <Heading level={2} className="max-w-[700px]">
        {entry.match.narrativeDescriptor}
      </Heading>

      <ScoreBug
        homeTeamName={entry.match.homeTeam.name}
        awayTeamName={entry.match.awayTeam.name}
        homeScore={entry.match.finalScore.home}
        awayScore={entry.match.finalScore.away}
        showTimer={false}
      />

      <MatchSummaryTabs match={entry.match} />

      <PillButton buttonStyle="tertiary" onClick={() => router.push("/profile?tab=History")}>
        Back
      </PillButton>
    </main>
  );
}
