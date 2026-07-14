"use client";

import { useState } from "react";
import { PlayerInput, type PlayerOption } from "@/components/PlayerInput";
import { TeamInput } from "@/components/TeamInput";
import { PillButton } from "@/components/PillButton";
import type { ErrorChipVariant } from "@/components/ErrorChip";
import { useSquadUpStore } from "@/store/useSquadUpStore";
import { POSITION_SLOTS, type Player, type Side, type Team } from "@/lib/types";
import { STUB_PLAYERS, normalizePlayerName, playersById, searchPlayers } from "@/lib/data/players";
import { containsProfanity } from "@/lib/data/profanity";

export interface PickError {
  variant: ErrorChipVariant;
  message: string;
}

// Duplicate check is global across both squads (SPEC.md 5.4) and keyed by
// normalized name so it also catches a custom-typed name colliding with a
// database player or another custom entry, not just a re-picked database id.
function isDuplicate(name: string, excludeSide: Side, excludeIndex: number, homeTeam: Team, awayTeam: Team): boolean {
  const normalized = normalizePlayerName(name);
  const takenBy = (team: Team, teamSide: Side) =>
    team.players.some((player, index) => {
      if (!player) return false;
      if (teamSide === excludeSide && index === excludeIndex) return false;
      return normalizePlayerName(player.name) === normalized;
    });
  return takenBy(homeTeam, "home") || takenBy(awayTeam, "away");
}

const randomiseStyle: Record<Side, "primary" | "secondary"> = {
  home: "primary",
  away: "secondary",
};

interface SquadColumnProps {
  side: Side;
  onError: (error: PickError | null) => void;
}

export function SquadColumn({ side, onError }: SquadColumnProps) {
  const homeTeam = useSquadUpStore((state) => state.homeTeam);
  const awayTeam = useSquadUpStore((state) => state.awayTeam);
  const setTeamName = useSquadUpStore((state) => state.setTeamName);
  const setPlayer = useSquadUpStore((state) => state.setPlayer);
  const clearTeam = useSquadUpStore((state) => state.clearTeam);

  const team = side === "home" ? homeTeam : awayTeam;
  const otherTeam = side === "home" ? awayTeam : homeTeam;

  // null = not editing, show the committed value; a string = live search text.
  const [drafts, setDrafts] = useState<(string | null)[]>(() => new Array(POSITION_SLOTS.length).fill(null));
  const [nameDraft, setNameDraft] = useState(team.name);

  function setDraft(index: number, value: string | null) {
    setDrafts((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleSelect(index: number, option: PlayerOption) {
    const player = playersById.get(option.id);
    if (!player) return;
    if (isDuplicate(player.name, side, index, homeTeam, awayTeam)) {
      onError({ variant: "foul", message: "Already picked" });
      return;
    }
    setPlayer(side, index, player);
    setDraft(index, null);
    onError(null);
  }

  function handleUseUnmatched(index: number, rawText: string) {
    const name = rawText.trim();
    if (!name) return;
    if (containsProfanity(name)) {
      onError({ variant: "redCard", message: "That one's not making the squad" });
      return;
    }
    if (isDuplicate(name, side, index, homeTeam, awayTeam)) {
      onError({ variant: "foul", message: "Already picked" });
      return;
    }
    const customPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      position: POSITION_SLOTS[index],
      club: "Free Agent",
      overallRating: 65,
      era: "current",
      source: "custom",
    };
    setPlayer(side, index, customPlayer);
    setDraft(index, null);
    onError(null);
  }

  function handleRandomise() {
    const excludedNames = new Set(
      otherTeam.players
        .filter((player): player is Player => Boolean(player))
        .map((player) => normalizePlayerName(player.name)),
    );
    const chosenNames = new Set<string>();

    POSITION_SLOTS.forEach((position, index) => {
      // Sampling without replacement (via chosenNames) is what stops the two
      // MID slots from ever landing on the same player within one Randomise.
      const candidates = STUB_PLAYERS.filter(
        (player) =>
          player.position === position &&
          !excludedNames.has(normalizePlayerName(player.name)) &&
          !chosenNames.has(normalizePlayerName(player.name)),
      );
      if (candidates.length === 0) return;
      const pick = candidates[Math.floor(Math.random() * candidates.length)];
      chosenNames.add(normalizePlayerName(pick.name));
      setPlayer(side, index, pick);
    });

    setDrafts(new Array(POSITION_SLOTS.length).fill(null));
    onError(null);
  }

  function handleClear() {
    clearTeam(side);
    setDrafts(new Array(POSITION_SLOTS.length).fill(null));
    setNameDraft("");
    onError(null);
  }

  function handleNameBlur() {
    const trimmed = nameDraft.trim();
    if (containsProfanity(trimmed)) {
      onError({ variant: "yellowCard", message: "Keep the team name clean" });
      return;
    }
    onError(null);
    setTeamName(side, trimmed);
  }

  return (
    <div className="flex h-full w-full flex-col justify-between gap-4">
      <div className="flex flex-col gap-1">
        <TeamInput
          side={side}
          value={nameDraft}
          onChange={(event) => {
            setNameDraft(event.target.value);
            onError(null);
          }}
          onBlur={handleNameBlur}
        />
      </div>

      <div className="flex flex-col gap-3">
        {POSITION_SLOTS.map((position, index) => {
          const committed = team.players[index];
          const draft = drafts[index];
          const value = draft ?? committed?.name ?? "";
          const options =
            draft !== null
              ? searchPlayers(draft, position).map((player) => ({
                  id: player.id,
                  name: player.name,
                  rating: player.overallRating,
                }))
              : [];

          return (
            <PlayerInput
              key={index}
              position={position}
              side={side}
              value={value}
              options={options}
              onValueChange={(text) => {
                setDraft(index, text);
                onError(null);
              }}
              onSelect={(option) => handleSelect(index, option)}
              // Only offer the fallback while actively editing (draft !== null) — once a
              // commit resets the draft, the field stays focused but should stop treating
              // the now-committed name as an unmatched query (it has no search options
              // either way, so without this gate the panel would silently reappear).
              onUseUnmatched={draft !== null ? (text) => handleUseUnmatched(index, text) : undefined}
              onBlur={() => setDraft(index, null)}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <PillButton buttonStyle={randomiseStyle[side]} size="small" onClick={handleRandomise}>
          Randomise
        </PillButton>
        <PillButton buttonStyle="tertiary" size="small" onClick={handleClear}>
          Clear
        </PillButton>
      </div>
    </div>
  );
}
