"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CommentaryEventRow } from "@/components/CommentaryEventRow";
import { Heading } from "@/components/Heading";
import { LineupPill } from "@/components/LineupPill";
import { PillButton } from "@/components/PillButton";
import { ScoreBug } from "@/components/ScoreBug";
import { ShareSheetModal } from "@/components/ShareSheetModal";
import { StatLine } from "@/components/StatLine";
import { TabPicker } from "@/components/TabPicker";
import { matchStatRows, playerGoalCounts, teamLineupRows } from "@/lib/simulation";
import { useSquadUpStore } from "@/store/useSquadUpStore";

const TABS = ["Stats", "Lineups", "Timeline"] as const;
type Tab = (typeof TABS)[number];

// SPEC.md 5.9 Match Summary Page (Figma 68:704) — flow step 6-7.
export default function MatchSummaryPage() {
  const router = useRouter();
  const match = useSquadUpStore((state) => state.match);
  const rematch = useSquadUpStore((state) => state.rematch);
  const [activeTab, setActiveTab] = useState<Tab>("Stats");
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (!match) router.replace("/team-picker");
  }, [match, router]);

  const goalCounts = useMemo(() => (match ? playerGoalCounts(match) : new Map<string, number>()), [match]);
  const homeRows = useMemo(() => (match ? teamLineupRows(match.homeTeam, goalCounts) : []), [match, goalCounts]);
  const awayRows = useMemo(() => (match ? teamLineupRows(match.awayTeam, goalCounts) : []), [match, goalCounts]);
  const stats = useMemo(() => (match ? matchStatRows(match) : []), [match]);

  // Timeline: the full match commentary feed, in chronological order with
  // minute markers — match.events is already minute-sorted by simulateMatch.
  const timelineEvents = useMemo(() => (match ? match.events : []), [match]);

  const handleRematch = () => {
    rematch();
    router.push("/team-picker");
  };

  if (!match) return null;

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

      <div className="flex w-full max-w-[800px] flex-col items-center gap-8">
        <TabPicker tabs={[...TABS]} defaultTab={activeTab} onChange={(tab) => setActiveTab(tab as Tab)} />

        {activeTab === "Stats" && (
          <div className="flex w-full max-w-[480px] flex-col gap-4">
            {stats.map((stat) => (
              <StatLine
                key={stat.label}
                stat={stat.label}
                homeValue={stat.homeDisplay}
                awayValue={stat.awayDisplay}
                leading={stat.leading}
              />
            ))}
          </div>
        )}

        {activeTab === "Lineups" && (
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-4">
              {homeRows.map((row) => (
                <LineupPill key={row.player.id} side="home" position={row.position} playerName={row.player.name} goals={row.goals} />
              ))}
            </div>
            <div className="flex flex-col gap-4">
              {awayRows.map((row) => (
                <LineupPill key={row.player.id} side="away" position={row.position} playerName={row.player.name} goals={row.goals} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "Timeline" && (
          <div className="flex w-full max-w-[500px] flex-col gap-6">
            {timelineEvents.map((event, index) =>
              event.headline ? (
                <CommentaryEventRow
                  key={index}
                  variant="keyMoment"
                  minute={event.minute}
                  side={event.side ?? "home"}
                  headline={event.headline}
                  text={event.text}
                />
              ) : (
                <CommentaryEventRow key={index} variant="default" minute={event.minute} text={event.text} />
              ),
            )}
          </div>
        )}
      </div>

      {isShareOpen && <ShareSheetModal match={match} onClose={() => setIsShareOpen(false)} />}
    </main>
  );
}
