"use client";

import { useMemo, useState } from "react";
import { CommentaryEventRow } from "@/components/CommentaryEventRow";
import { LineupPill } from "@/components/LineupPill";
import { StatLine } from "@/components/StatLine";
import { TabPicker } from "@/components/TabPicker";
import { matchStatRows, playerGoalCounts, teamLineupRows } from "@/lib/simulation";
import type { Match } from "@/lib/types";

const TABS = ["Stats", "Lineups", "Timeline"] as const;
type Tab = (typeof TABS)[number];

// Stats/Lineups/Timeline tab group, shared by the live Match Summary page
// and Profile's read-only match View (SPEC.md 5.9/5.12) — both just supply
// a Match, the tab content itself doesn't care whether it's the current
// match or a past MatchHistory entry.
export function MatchSummaryTabs({ match }: { match: Match }) {
  const [activeTab, setActiveTab] = useState<Tab>("Stats");

  const goalCounts = useMemo(() => playerGoalCounts(match), [match]);
  const homeRows = useMemo(() => teamLineupRows(match.homeTeam, goalCounts), [match, goalCounts]);
  const awayRows = useMemo(() => teamLineupRows(match.awayTeam, goalCounts), [match, goalCounts]);
  const stats = useMemo(() => matchStatRows(match), [match]);

  // Timeline: the full match commentary feed, in chronological order with
  // minute markers — match.events is already minute-sorted by simulateMatch.
  const timelineEvents = match.events;

  return (
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
  );
}
