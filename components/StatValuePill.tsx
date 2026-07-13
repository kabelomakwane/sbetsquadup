type StatValueSide = "home" | "away" | "none";

interface StatValuePillProps {
  value: string;
  side: StatValueSide;
}

const sideColor: Record<StatValueSide, string> = {
  home: "bg-brand-red",
  away: "bg-brand-yellow",
  none: "bg-transparent",
};

export function StatValuePill({ value, side }: StatValuePillProps) {
  return (
    <span
      className={`inline-flex min-w-12 items-center justify-center rounded-pill px-3 py-1 font-tag text-sm font-bold not-italic text-white ${sideColor[side]}`}
    >
      {value}
    </span>
  );
}
