"use client";

import { useState, type InputHTMLAttributes } from "react";
import type { Position, Side } from "./types";

export interface PlayerOption {
  id: string;
  name: string;
  rating: number;
}

interface PlayerInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange" | "onSelect"> {
  position: Position;
  side: Side;
  value: string;
  options?: PlayerOption[];
  active?: boolean;
  onValueChange?: (value: string) => void;
  onSelect?: (option: PlayerOption) => void;
}

const tagColor: Record<Side, string> = {
  home: "text-brand-red",
  away: "text-brand-yellow",
};

export function PlayerInput({
  position,
  side,
  value,
  placeholder = "Select a player",
  options = [],
  active,
  onValueChange,
  onSelect,
  className = "",
  onFocus,
  onBlur,
  ...props
}: PlayerInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const filled = value.length > 0;
  const isOpen = (active ?? isFocused) && options.length > 0;

  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      <div className="flex h-12 w-full items-center rounded-pill bg-white">
        <span
          className={`font-label flex w-[52px] shrink-0 items-center justify-center px-3 text-base font-black not-italic ${tagColor[side]}`}
        >
          {position}
        </span>
        <input
          value={value}
          placeholder={placeholder}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onChange={(event) => onValueChange?.(event.target.value)}
          className={`font-body min-w-0 flex-1 bg-transparent px-3 text-base font-normal not-italic outline-none placeholder:text-black-60 ${
            filled ? "text-black" : "text-black-60"
          }`}
          {...props}
        />
      </div>
      {isOpen && (
        <ul className="flex w-full flex-col overflow-hidden rounded-3xl bg-white py-1">
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect?.(option)}
                className="flex w-full items-center hover:bg-black-60/10"
              >
                <span className="font-label flex w-[52px] shrink-0 items-center justify-center px-3 py-2 text-base font-black not-italic text-brand-blue">
                  {option.rating}
                </span>
                <span className="font-body flex-1 px-3 py-2 text-left text-base font-normal not-italic text-black">
                  {option.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
