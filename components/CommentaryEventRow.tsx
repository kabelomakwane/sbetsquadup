import type { Side } from "./types";

interface DefaultEventProps {
  variant: "default";
  minute: number;
  text: string;
}

interface KeyMomentEventProps {
  variant: "keyMoment";
  minute: number;
  side: Side;
  headline: string;
  text: string;
}

interface HalfTimeEventProps {
  variant: "halfTime";
}

type CommentaryEventRowProps = DefaultEventProps | KeyMomentEventProps | HalfTimeEventProps;

const keyMomentColor: Record<Side, string> = {
  home: "bg-brand-red text-white",
  away: "bg-brand-yellow text-brand-blue",
};

export function CommentaryEventRow(props: CommentaryEventRowProps) {
  if (props.variant === "halfTime") {
    return (
      <div className="flex w-full items-center justify-center py-8">
        <span className="font-display text-xl font-black italic text-white">Half Time</span>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-4">
      <span className="font-display flex w-10 shrink-0 items-center justify-center text-base font-black italic text-white">
        {props.minute}&rsquo;
      </span>
      {props.variant === "default" ? (
        <div className="flex flex-1 items-center rounded-3xl bg-brand-blue px-4 py-3">
          <p className="font-tag text-base font-bold not-italic text-white">{props.text}</p>
        </div>
      ) : (
        <div
          className={`flex flex-1 flex-col items-start justify-center gap-3 rounded-3xl px-4 py-3 ${keyMomentColor[props.side]}`}
        >
          <p className="font-display text-xl font-black italic">{props.headline}</p>
          <p className="font-tag text-base font-bold not-italic">{props.text}</p>
        </div>
      )}
    </div>
  );
}
