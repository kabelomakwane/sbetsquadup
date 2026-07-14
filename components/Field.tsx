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
}

function Slot({ position, side, slot }: { position: Position; side: Side; slot?: PlayerSlot }) {
  return slot ? (
    <PlayerBubble state="filled" side={side} initials={slot.initials} playerName={slot.playerName} />
  ) : (
    <PlayerBubble state="empty" position={position} />
  );
}

export function Field({ home = {}, away = {} }: FieldProps) {
  return (
    <div className="relative aspect-[8/5] w-full">
      <Image src="/images/pitch.svg" alt="" fill className="object-contain" />
      <div className="absolute inset-y-0 right-0 flex w-1/2 items-center">
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="ST" side="away" slot={away.st} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-[40%]">
          <Slot position="MID" side="away" slot={away.mid1} />
          <Slot position="MID" side="away" slot={away.mid2} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="DEF" side="away" slot={away.def} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="GK" side="away" slot={away.gk} />
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 flex w-1/2 items-center">
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="GK" side="home" slot={home.gk} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="DEF" side="home" slot={home.def} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-[40%]">
          <Slot position="MID" side="home" slot={home.mid1} />
          <Slot position="MID" side="home" slot={home.mid2} />
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center">
          <Slot position="ST" side="home" slot={home.st} />
        </div>
      </div>
    </div>
  );
}
