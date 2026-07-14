type StatLeading = "home" | "away" | "none";

interface StatLineProps {
  stat: string;
  homeValue: string | number;
  awayValue: string | number;
  leading?: StatLeading;
}

export function StatLine({ stat, homeValue, awayValue, leading = "none" }: StatLineProps) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-[62px] items-center justify-center">
        <span
          className={`font-label flex h-[30px] items-center justify-center rounded-pill px-2 text-base font-black not-italic text-white ${
            leading === "home" ? "bg-brand-red" : ""
          }`}
        >
          {homeValue}
        </span>
      </div>
      <p className="font-display h-[30px] flex-1 text-center text-xl font-black italic text-white">
        {stat}
      </p>
      <div className="flex w-[62px] items-center justify-center">
        <span
          className={`font-label flex h-[30px] items-center justify-center rounded-pill px-2 text-base font-black not-italic ${
            leading === "away" ? "bg-brand-yellow text-brand-blue" : "text-white"
          }`}
        >
          {awayValue}
        </span>
      </div>
    </div>
  );
}
