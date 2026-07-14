"use client";

import { useRouter } from "next/navigation";
import { Heading } from "@/components/Heading";
import { PillButton } from "@/components/PillButton";
import { Field, type TeamSlots } from "@/components/Field";
import { getSession } from "@/lib/auth";
import { getPlayerInitials, getShortPlayerName } from "@/lib/data/players";
import { POSITION_SLOTS, type Team } from "@/lib/types";
import { useSquadUpStore } from "@/store/useSquadUpStore";
import { SquadColumn } from "./SquadColumn";

// index 0..4 of POSITION_SLOTS (ST, MID, MID, DEF, GK) maps onto Field's named slots.
function teamToSlots(team: Team): TeamSlots {
  const [st, mid1, mid2, def, gk] = POSITION_SLOTS.map((_, index) => {
    const player = team.players[index];
    return player
      ? { initials: getPlayerInitials(player.name), playerName: getShortPlayerName(player.name) }
      : undefined;
  });
  return { st, mid1, mid2, def, gk };
}

// SPEC.md 5.4 Team Picker (Figma 68:487 empty / 70:952 complete) — flow step 3.
export default function TeamPickerPage() {
  const router = useRouter();
  const homeTeam = useSquadUpStore((state) => state.homeTeam);
  const awayTeam = useSquadUpStore((state) => state.awayTeam);

  const isComplete =
    homeTeam.players.every(Boolean) && awayTeam.players.every(Boolean);

  const handleKickOff = () => {
    router.push(getSession() ? "/loading" : "/sign-in");
  };

  return (
    <main className="flex flex-1 flex-col items-center gap-10 px-6 py-12">
      <Heading level={1} className="text-center">
        Select your dream team
      </Heading>

      <div className="grid w-full max-w-6xl grid-cols-1 items-start gap-10 md:grid-cols-[1fr_minmax(280px,1.2fr)_1fr]">
        <SquadColumn side="home" />
        <div className="w-full md:pt-6">
          <Field home={teamToSlots(homeTeam)} away={teamToSlots(awayTeam)} />
        </div>
        <SquadColumn side="away" />
      </div>

      <PillButton buttonStyle="primary" disabled={!isComplete} onClick={handleKickOff}>
        Kick Off
      </PillButton>
    </main>
  );
}
