"use client";

import { useState, type InputHTMLAttributes } from "react";
import type { Position, Side } from "./types";

export interface PillInputOption {
  id: string;
  label: string;
}

interface PillInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange" | "onSelect"> {
  position: Position;
  side: Side;
  value: string;
  options?: PillInputOption[];
  active?: boolean;
  onValueChange?: (value: string) => void;
  onSelect?: (option: PillInputOption) => void;
}

const tagColor: Record<Side, string> = {
  home: "text-brand-red",
  away: "text-brand-yellow",
};

const activeBorderColor: Record<Side, string> = {
  home: "border-brand-red",
  away: "border-brand-yellow",
};

export function PillInput({
  position,
  side,
  value,
  placeholder = "Select Player",
  options = [],
  active,
  onValueChange,
  onSelect,
  className = "",
  onFocus,
  onBlur,
  ...props
}: PillInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const filled = value.length > 0;
  const isOpen = (active ?? isFocused) && options.length > 0;

  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`flex h-12 w-full items-center border bg-white ${
          isOpen
            ? `rounded-t-[64px] rounded-b-none ${activeBorderColor[side]}`
            : "rounded-pill-input border-white"
        }`}
      >
        <span
          className={`font-tag flex w-[52px] shrink-0 items-center justify-center text-base font-bold not-italic ${tagColor[side]}`}
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
          className={`font-button min-w-0 flex-1 bg-transparent px-3 text-base not-italic outline-none placeholder:text-black-60 ${
            filled ? "text-brand-blue" : "text-black-60"
          }`}
          {...props}
        />
      </div>
      {isOpen && (
        <ul
          className={`absolute inset-x-0 top-full z-10 max-h-60 overflow-y-auto rounded-b-2xl border border-t-0 bg-white py-2 shadow-lg ${activeBorderColor[side]}`}
        >
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect?.(option)}
                className="font-button block w-full px-4 py-2 text-left text-base not-italic text-brand-blue hover:bg-black-60/10"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
