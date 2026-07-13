import type { Position, Side } from "./types";

interface PlayerBubbleEmptyProps {
  state: "empty";
  position: Position;
  side: Side;
}

interface PlayerBubbleFilledProps {
  state: "filled";
  side: Side;
  initials: string;
  playerName: string;
}

type PlayerBubbleProps = PlayerBubbleEmptyProps | PlayerBubbleFilledProps;

const bubbleColor: Record<Side, string> = {
  home: "bg-brand-red",
  away: "bg-brand-yellow",
};

const filledTextColor: Record<Side, string> = {
  home: "text-white",
  away: "text-brand-blue",
};

export function PlayerBubble(props: PlayerBubbleProps) {
  const { side } = props;

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`flex size-12 items-center justify-center rounded-pill ${bubbleColor[side]} ${
          props.state === "empty" ? "border-2 border-dashed border-white" : ""
        }`}
      >
        <span
          className={`font-label text-[15px] font-black not-italic ${
            props.state === "empty" ? "text-white" : filledTextColor[side]
          }`}
        >
          {props.state === "empty" ? props.position : props.initials}
        </span>
      </div>
      {props.state === "filled" && (
        <p className="font-display text-sm font-black italic text-white">{props.playerName}</p>
      )}
    </div>
  );
}
