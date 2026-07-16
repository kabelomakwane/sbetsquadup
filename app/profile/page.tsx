"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Heading } from "@/components/Heading";
import { PillButton } from "@/components/PillButton";
import { PlayerBubble } from "@/components/PlayerBubble";
import { ScoreBug } from "@/components/ScoreBug";
import { TabPicker } from "@/components/TabPicker";
import { Text } from "@/components/Text";
import { logout } from "@/lib/auth";
import { getPlayerInitials } from "@/lib/data/players";
import { computeCareerStats } from "@/lib/profileStats";
import { POSITION_SLOTS, type MatchHistory, type SavedSquad, type Team } from "@/lib/types";
import { useHasHydrated, useSquadUpStore } from "@/store/useSquadUpStore";

const TABS = ["Squads", "History", "Stats"] as const;
type Tab = (typeof TABS)[number];

function isTab(value: string | null): value is Tab {
  return TABS.includes(value as Tab);
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

const squadNameColor: Record<Team["side"], string> = {
  home: "text-brand-red",
  away: "text-brand-yellow",
};

function ProfileEmptyState({
  message,
  ctaLabel,
  onCta,
}: {
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <Text muted>{message}</Text>
      {ctaLabel && onCta && (
        <PillButton buttonStyle="primary" onClick={onCta}>
          {ctaLabel}
        </PillButton>
      )}
    </div>
  );
}

function SquadCard({
  squad,
  onPlay,
  onDelete,
}: {
  squad: SavedSquad;
  onPlay: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <li className="flex flex-col gap-4 rounded-3xl bg-white/10 p-6 text-left">
      <div className="flex flex-col gap-1">
        <Text weight="bold" size="medium" className={squadNameColor[squad.team.side]}>
          {squad.team.name || "Unnamed Team"}
        </Text>
        <Text size="tiny" muted>
          Saved {formatDate(squad.createdAt)}
        </Text>
      </div>

      <div className="flex items-center gap-3">
        {POSITION_SLOTS.map((position, index) => {
          // Persisted squads round-trip through JSON (localStorage), which
          // turns empty `undefined` slots into `null` — a truthy check
          // (not `!== undefined`) handles both, and narrows the type too.
          const player = squad.team.players[index];
          return player ? (
            <PlayerBubble
              key={index}
              state="filled"
              side={squad.team.side}
              size="small"
              initials={getPlayerInitials(player.name)}
              playerName={player.name}
            />
          ) : (
            <PlayerBubble key={index} state="empty" position={position} size="small" />
          );
        })}
      </div>

      {confirming ? (
        <div className="flex items-center gap-3">
          <Text size="small">Delete this squad?</Text>
          <PillButton buttonStyle="primary" size="small" onClick={onDelete}>
            Yes
          </PillButton>
          <PillButton buttonStyle="tertiary" size="small" onClick={() => setConfirming(false)}>
            No
          </PillButton>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <PillButton buttonStyle="primary" onClick={onPlay}>
            Play
          </PillButton>
          <PillButton buttonStyle="link" size="small" onClick={() => setConfirming(true)}>
            Delete
          </PillButton>
        </div>
      )}
    </li>
  );
}

function HistoryRow({
  entry,
  onView,
  onRematch,
}: {
  entry: MatchHistory;
  onView: () => void;
  onRematch: () => void;
}) {
  const { match } = entry;
  return (
    <li className="flex flex-col items-center gap-4 rounded-3xl bg-white/10 p-6 text-center">
      <ScoreBug
        homeTeamName={match.homeTeam.name}
        awayTeamName={match.awayTeam.name}
        homeScore={match.finalScore.home}
        awayScore={match.finalScore.away}
        showTimer={false}
      />
      <Text size="small" muted>
        {match.narrativeDescriptor}
      </Text>
      <Text size="tiny" muted>
        Played {formatDate(entry.playedAt)}
      </Text>
      <div className="flex items-center gap-4">
        <PillButton buttonStyle="tertiary" onClick={onView}>
          View
        </PillButton>
        <PillButton buttonStyle="primary" onClick={onRematch}>
          Rematch
        </PillButton>
      </div>
    </li>
  );
}

function StatsPanel({ matchHistory }: { matchHistory: MatchHistory[] }) {
  if (matchHistory.length === 0) {
    return <ProfileEmptyState message="Play a match to see your stats here." />;
  }

  const stats = computeCareerStats(matchHistory);

  const rows: { label: string; value: string | number }[] = [
    { label: "Played", value: stats.played },
    { label: "Won", value: stats.won },
    { label: "Drawn", value: stats.drawn },
    { label: "Lost", value: stats.lost },
    { label: "Goals For", value: stats.goalsFor },
    { label: "Goals Against", value: stats.goalsAgainst },
    { label: "Win Percentage", value: `${stats.winPercentage}%` },
  ];

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between rounded-full bg-white/10 px-6 py-3">
          <Text muted>{row.label}</Text>
          <Text weight="bold">{row.value}</Text>
        </div>
      ))}
    </div>
  );
}

function ProfilePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasHydrated = useHasHydrated();
  const user = useSquadUpStore((state) => state.user);
  const savedSquads = useSquadUpStore((state) => state.savedSquads);
  const matchHistory = useSquadUpStore((state) => state.matchHistory);
  const deleteSavedSquad = useSquadUpStore((state) => state.deleteSavedSquad);
  const loadSavedSquad = useSquadUpStore((state) => state.loadSavedSquad);
  const loadMatchTeams = useSquadUpStore((state) => state.loadMatchTeams);

  const initialTab = isTab(searchParams.get("tab")) ? (searchParams.get("tab") as Tab) : "Squads";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Tab);
    router.replace(`/profile?tab=${tab}`, { scroll: false });
  };

  if (!hasHydrated) return null;

  if (!user) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16 text-center">
        <Heading level={1}>Profile</Heading>
        <Text muted>Sign in to see your saved squads and match history.</Text>
        <PillButton buttonStyle="primary" onClick={() => router.push("/sign-in")}>
          Sign In
        </PillButton>
      </main>
    );
  }

  const mySquads = savedSquads
    .filter((squad) => squad.userId === user.id)
    .sort((a, b) => b.createdAt - a.createdAt);
  const myHistory = matchHistory
    .filter((entry) => entry.userId === user.id)
    .sort((a, b) => b.playedAt - a.playedAt);

  const handleSignOut = () => {
    logout();
    router.push("/landing");
  };

  return (
    <main className="flex flex-1 flex-col items-center gap-10 px-6 py-16">
      <div className="flex flex-col items-center gap-3">
        <Avatar initials={getPlayerInitials(user.name)} size="large" />
        <Heading level={2}>{user.name}</Heading>
        <Text muted>{myHistory.length} games played</Text>
        <PillButton buttonStyle="link" size="small" onClick={handleSignOut}>
          Sign Out
        </PillButton>
      </div>

      <TabPicker tabs={[...TABS]} defaultTab={activeTab} onChange={handleTabChange} />

      {activeTab === "Squads" &&
        (mySquads.length === 0 ? (
          <ProfileEmptyState
            message="You haven't built a squad yet."
            ctaLabel="Build a Squad"
            onCta={() => router.push("/team-picker")}
          />
        ) : (
          <ul className="flex w-full max-w-[600px] flex-col gap-4">
            {mySquads.map((squad) => (
              <SquadCard
                key={squad.id}
                squad={squad}
                onPlay={() => {
                  loadSavedSquad(squad.team);
                  router.push("/team-picker");
                }}
                onDelete={() => deleteSavedSquad(squad.id)}
              />
            ))}
          </ul>
        ))}

      {activeTab === "History" &&
        (myHistory.length === 0 ? (
          <ProfileEmptyState
            message="You haven't played a match yet."
            ctaLabel="Kick Off"
            onCta={() => router.push("/team-picker")}
          />
        ) : (
          <ul className="flex w-full max-w-[600px] flex-col gap-4">
            {myHistory.map((entry) => (
              <HistoryRow
                key={entry.id}
                entry={entry}
                onView={() => router.push(`/profile/history/${entry.id}`)}
                onRematch={() => {
                  loadMatchTeams(entry.match);
                  router.push("/team-picker");
                }}
              />
            ))}
          </ul>
        ))}

      {activeTab === "Stats" && <StatsPanel matchHistory={myHistory} />}

      <PillButton buttonStyle="tertiary" onClick={() => router.push("/landing")}>
        Back to Home
      </PillButton>
    </main>
  );
}

// Profile/History — SPEC.md 5.12. No Figma frame for this screen, built to
// the written design doc, functional over polished (CLAUDE.md "Known gaps").
export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePageInner />
    </Suspense>
  );
}
