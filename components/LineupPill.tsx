import Image from "next/image";
import type { Position, Side } from "./types";

interface LineupPillProps {
  side: Side;
  position: Position;
  playerName: string;
  /** Goals scored in this match — one ball icon per goal (SPEC.md 5.10). */
  goals: number;
}

const tagColor: Record<Side, string> = {
  home: "text-brand-red",
  away: "text-brand-yellow",
};

/** Filled pill row shared by the Lineups tab and the Share Image (SPEC.md 5.9/5.10, Figma 73:1629). */
export function LineupPill({ side, position, playerName, goals }: LineupPillProps) {
  return (
    <div className="flex h-12 w-full items-center rounded-pill-input border border-white bg-white">
      <span
        className={`font-tag flex w-[52px] shrink-0 items-center justify-center px-4 text-base font-bold not-italic ${tagColor[side]}`}
      >
        {position}
      </span>
      <p className="font-button min-w-0 flex-1 truncate px-3 text-base not-italic text-brand-blue">{playerName}</p>
      {goals > 0 && (
        <div
          className="flex shrink-0 items-center gap-1 px-4"
          aria-label={`${goals} goal${goals === 1 ? "" : "s"}`}
        >
          {Array.from({ length: goals }, (_, index) => (
            <Image key={index} src="/images/icon-ball.svg" alt="" width={18} height={18} />
          ))}
        </div>
      )}
    </div>
  );
}
