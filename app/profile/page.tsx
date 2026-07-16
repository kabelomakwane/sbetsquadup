"use client";

import { useRouter } from "next/navigation";
import { Heading } from "@/components/Heading";
import { PillButton } from "@/components/PillButton";
import { Text } from "@/components/Text";
import type { MatchHistory, Player, SavedSquad, Team } from "@/lib/types";
import { useSquadUpStore } from "@/store/useSquadUpStore";

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

function squadRoster(team: Team): string {
  // Team.players is sparse (SPEC.md 7) — filter with a truthy check, not
  // `!== undefined`: persisted squads round-trip through JSON (localStorage),
  // which turns empty `undefined` slots into `null`.
  const names = team.players.filter((player): player is Player => Boolean(player)).map((player) => player.name);
  return names.length > 0 ? names.join(", ") : "No players picked";
}

function SavedSquadRow({ squad }: { squad: SavedSquad }) {
  return (
    <li className="flex flex-col gap-1 rounded-lg bg-white/10 p-4 text-left">
      <Text weight="bold">
        {squad.team.name || "Unnamed Team"} ({squad.team.side})
      </Text>
      <Text size="small" muted>
        {squadRoster(squad.team)}
      </Text>
      <Text size="tiny" muted>
        Saved {formatDate(squad.createdAt)}
      </Text>
    </li>
  );
}

function MatchHistoryRow({ entry }: { entry: MatchHistory }) {
  const { match } = entry;
  return (
    <li className="flex flex-col gap-1 rounded-lg bg-white/10 p-4 text-left">
      <Text weight="bold">
        {match.homeTeam.name} {match.finalScore.home} - {match.finalScore.away} {match.awayTeam.name}
      </Text>
      <Text size="small" muted>
        {match.narrativeDescriptor}
      </Text>
      <Text size="tiny" muted>
        Played {formatDate(entry.playedAt)}
      </Text>
    </li>
  );
}

// Profile/History — SPEC.md 3/9. No Figma frame for this screen yet, so this
// is a plain functional list (saved squads + past match results) tied to the
// mocked User from lib/auth, swap in real visual design once frames exist.
export default function ProfilePage() {
  const router = useRouter();
  const user = useSquadUpStore((state) => state.user);
  const savedSquads = useSquadUpStore((state) => state.savedSquads);
  const matchHistory = useSquadUpStore((state) => state.matchHistory);

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

  return (
    <main className="flex flex-1 flex-col items-center gap-16 px-6 py-16">
      <Heading level={1}>Profile</Heading>

      <section className="flex w-full max-w-[600px] flex-col gap-4">
        <Heading level={3}>Saved Squads</Heading>
        {mySquads.length === 0 ? (
          <Text muted>No saved squads yet — build a team and kick off to save one.</Text>
        ) : (
          <ul className="flex flex-col gap-3">
            {mySquads.map((squad) => (
              <SavedSquadRow key={squad.id} squad={squad} />
            ))}
          </ul>
        )}
      </section>

      <section className="flex w-full max-w-[600px] flex-col gap-4">
        <Heading level={3}>Match History</Heading>
        {myHistory.length === 0 ? (
          <Text muted>No matches played yet.</Text>
        ) : (
          <ul className="flex flex-col gap-3">
            {myHistory.map((entry) => (
              <MatchHistoryRow key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
      </section>

      <PillButton buttonStyle="tertiary" onClick={() => router.push("/landing")}>
        Back to Home
      </PillButton>
    </main>
  );
}
