import type { InputHTMLAttributes } from "react";
import type { Position, Side } from "./types";

interface PillInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value"> {
  position: Position;
  side: Side;
  value: string;
}

const tagColor: Record<Side, string> = {
  home: "text-brand-red",
  away: "text-brand-yellow",
};

export function PillInput({
  position,
  side,
  value,
  placeholder = "Select Player",
  className = "",
  ...props
}: PillInputProps) {
  const filled = value.length > 0;

  return (
    <div className={`flex h-12 w-full items-center rounded-pill-input bg-white ${className}`}>
      <span
        className={`font-tag flex w-[52px] shrink-0 items-center justify-center text-base ${tagColor[side]}`}
      >
        {position}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        className={`font-button min-w-0 flex-1 bg-transparent px-3 text-base italic outline-none placeholder:text-black-60 ${
          filled ? "text-brand-blue" : "text-black-60"
        }`}
        {...props}
      />
    </div>
  );
}
