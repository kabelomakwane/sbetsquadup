"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/Heading";
import { PillButton } from "@/components/PillButton";
import { ErrorChip } from "@/components/ErrorChip";
import { Field, type TeamSlots } from "@/components/Field";
import { getSession } from "@/lib/auth";
import { getPlayerInitials, getShortPlayerName } from "@/lib/data/players";
import { POSITION_SLOTS, type Team } from "@/lib/types";
import { useSquadUpStore } from "@/store/useSquadUpStore";
import { SquadColumn, playerInputId, type PickError } from "./SquadColumn";

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
  const [pickError, setPickError] = useState<PickError | null>(null);

  const isComplete =
    homeTeam.players.every(Boolean) &&
    awayTeam.players.every(Boolean) &&
    homeTeam.name.trim() !== "" &&
    awayTeam.name.trim() !== "";

  const handleKickOff = () => {
    router.push(getSession() ? "/loading" : "/sign-in");
  };

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-8 py-12">
      <Heading level={1} className="text-center">
        Select your dream team
      </Heading>

      {/*
        Figma 68:487: Home/Field/Away sit in one row at fixed 256px/800px/256px
        widths (gap-32px), with the side columns stretched to the pitch's full
        height. The xl: grid below reproduces that exact 256:800:256 ratio
        (as fr weights, so it scales fluidly instead of overflowing narrower
        desktop widths) capped at the design's own 1376px total content width.
        The 256px floor on the side columns is load-bearing, not decorative —
        it's the minimum "Pick A Team Name" needs before it starts clipping.
      */}
      <div className="grid w-full max-w-[1376px] grid-cols-1 gap-8 xl:grid-cols-[minmax(256px,256fr)_minmax(400px,800fr)_minmax(256px,256fr)]">
        <SquadColumn side="home" onError={setPickError} />
        <div className="flex h-full w-full items-center justify-center">
          <Field
            home={teamToSlots(homeTeam)}
            away={teamToSlots(awayTeam)}
            onSlotClick={(side, index) => document.getElementById(playerInputId(side, index))?.focus()}
          />
        </div>
        <SquadColumn side="away" onError={setPickError} />
      </div>

      <PillButton buttonStyle="primary" disabled={!isComplete} onClick={handleKickOff}>
        Kick Off
      </PillButton>
      {pickError && <ErrorChip variant={pickError.variant} message={pickError.message} />}
    </main>
  );
}
