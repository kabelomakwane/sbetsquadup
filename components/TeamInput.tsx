import type { InputHTMLAttributes } from "react";
import type { Side } from "./types";

interface TeamInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value"> {
  side: Side;
  value: string;
}

const labelColor: Record<Side, string> = {
  home: "text-brand-red",
  away: "text-brand-yellow",
};

const labelText: Record<Side, string> = {
  home: "Home",
  away: "Away",
};

export function TeamInput({ side, value, placeholder = "Pick A Team Name", className = "", ...props }: TeamInputProps) {
  const filled = value.length > 0;

  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      <span className={`font-display text-[20px] font-black not-italic uppercase ${labelColor[side]}`}>
        {labelText[side]}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        className={`font-display w-full min-w-0 bg-transparent text-[24px] font-black italic uppercase leading-[1.4] outline-none placeholder:text-white-75 ${
          filled ? "text-white" : "text-white-75"
        }`}
        {...props}
      />
    </div>
  );
}
