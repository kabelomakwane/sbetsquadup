import Image from "next/image";
import { PlayerBubble } from "./PlayerBubble";
import type { Position, Side } from "./types";

export interface PlayerSlot {
  initials: string;
  playerName: string;
}

export interface TeamSlots {
  st?: PlayerSlot;
  mid1?: PlayerSlot;
  mid2?: PlayerSlot;
  def?: PlayerSlot;
  gk?: PlayerSlot;
}

interface FieldProps {
  home?: TeamSlots;
  away?: TeamSlots;
  /** index is the POSITION_SLOTS index (0=ST, 1=MID1, 2=MID2, 3=DEF, 4=GK), same order for both sides. */
  onSlotClick?: (side: Side, index: number) => void;
}

function Slot({
  position,
  side,
  index,
  slot,
  onSlotClick,
}: {
  position: Position;
  side: Side;
  index: number;
  slot?: PlayerSlot;
  onSlotClick?: (side: Side, index: number) => void;
}) {
  const onClick = onSlotClick ? () => onSlotClick(side, index) : undefined;
  return slot ? (
    <PlayerBubble state="filled" side={side} initials={slot.initials} playerName={slot.playerName} onClick={onClick} />
  ) : (
    <PlayerBubble state="empty" position={position} onClick={onClick} />
  );
}

export function Field({ home = {}, away = {}, onSlotClick }: FieldProps) {
  return (
    <div className="relative aspect-[8/5] w-full">
      <Image src="/images/pitch.svg" alt="" fill className="object-contain" />
      <div className="absolute inset-y-0 right-0 flex w-1/2 items-center">
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="ST" side="away" index={0} slot={away.st} onSlotClick={onSlotClick} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-[40%]">
          <Slot position="MID" side="away" index={1} slot={away.mid1} onSlotClick={onSlotClick} />
          <Slot position="MID" side="away" index={2} slot={away.mid2} onSlotClick={onSlotClick} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="DEF" side="away" index={3} slot={away.def} onSlotClick={onSlotClick} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="GK" side="away" index={4} slot={away.gk} onSlotClick={onSlotClick} />
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 flex w-1/2 items-center">
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="GK" side="home" index={4} slot={home.gk} onSlotClick={onSlotClick} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="DEF" side="home" index={3} slot={home.def} onSlotClick={onSlotClick} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-[40%]">
          <Slot position="MID" side="home" index={1} slot={home.mid1} onSlotClick={onSlotClick} />
          <Slot position="MID" side="home" index={2} slot={home.mid2} onSlotClick={onSlotClick} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="ST" side="home" index={0} slot={home.st} onSlotClick={onSlotClick} />
        </div>
      </div>
    </div>
  );
}
