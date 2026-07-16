"use client";

import type { Position, Side } from "./types";

type PlayerBubbleSize = "regular" | "small";

interface PlayerBubbleEmptyProps {
  state: "empty";
  position: Position;
  size?: PlayerBubbleSize;
  onClick?: () => void;
}

interface PlayerBubbleFilledProps {
  state: "filled";
  side: Side;
  initials: string;
  playerName: string;
  size?: PlayerBubbleSize;
  onClick?: () => void;
}

type PlayerBubbleProps = PlayerBubbleEmptyProps | PlayerBubbleFilledProps;

const filledBubbleColor: Record<Side, string> = {
  home: "bg-brand-red",
  away: "bg-brand-yellow",
};

const filledTextColor: Record<Side, string> = {
  home: "text-white",
  away: "text-brand-blue",
};

// "small" is a compact icon-only scale for dense lists (e.g. Profile's
// squad-card roster row, SPEC.md 5.12) — no caption, since a player name
// at 32px would be illegible.
const circleSizeClass: Record<PlayerBubbleSize, string> = {
  regular: "size-12",
  small: "size-8",
};

const initialsSizeClass: Record<PlayerBubbleSize, string> = {
  regular: "text-[15px]",
  small: "text-[10px]",
};

export function PlayerBubble(props: PlayerBubbleProps) {
  const size = props.size ?? "regular";
  const label =
    props.state === "empty" ? `Select ${props.position} player` : `Change ${props.playerName}`;

  return (
    <button
      type="button"
      onMouseDown={(event) => event.preventDefault()}
      onClick={props.onClick}
      aria-label={label}
      className="flex cursor-pointer flex-col items-center gap-1"
    >
      <div
        className={`flex items-center justify-center rounded-pill transition-opacity hover:opacity-80 ${circleSizeClass[size]} ${
          props.state === "empty"
            ? "border-2 border-dashed border-white bg-brand-blue"
            : filledBubbleColor[props.side]
        }`}
      >
        <span
          className={`font-label font-black not-italic ${initialsSizeClass[size]} ${
            props.state === "empty" ? "text-white" : filledTextColor[props.side]
          }`}
        >
          {props.state === "empty" ? props.position : props.initials}
        </span>
      </div>
      {props.state === "filled" && size === "regular" && (
        <p className="font-display text-sm font-black italic text-white">{props.playerName}</p>
      )}
    </button>
  );
}
