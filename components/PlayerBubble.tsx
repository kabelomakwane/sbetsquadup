"use client";

import type { Position, Side } from "./types";

interface PlayerBubbleEmptyProps {
  state: "empty";
  position: Position;
  onClick?: () => void;
}

interface PlayerBubbleFilledProps {
  state: "filled";
  side: Side;
  initials: string;
  playerName: string;
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

export function PlayerBubble(props: PlayerBubbleProps) {
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
        className={`flex size-12 items-center justify-center rounded-pill transition-opacity hover:opacity-80 ${
          props.state === "empty"
            ? "border-2 border-dashed border-white bg-brand-blue"
            : filledBubbleColor[props.side]
        }`}
      >
        <span
          className={`font-label text-[15px] font-black not-italic ${
            props.state === "empty" ? "text-white" : filledTextColor[props.side]
          }`}
        >
          {props.state === "empty" ? props.position : props.initials}
        </span>
      </div>
      {props.state === "filled" && (
        <p className="font-display text-sm font-black italic text-white">{props.playerName}</p>
      )}
    </button>
  );
}
