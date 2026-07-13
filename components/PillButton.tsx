import type { ButtonHTMLAttributes } from "react";

type PillButtonColor = "red" | "blue" | "yellow";
type PillButtonSize = "md" | "lg";

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: PillButtonColor;
  size?: PillButtonSize;
}

const colorStyles: Record<PillButtonColor, string> = {
  red: "bg-brand-red text-white",
  blue: "bg-brand-blue text-white",
  yellow: "bg-brand-yellow text-brand-blue",
};

const sizeStyles: Record<PillButtonSize, string> = {
  md: "px-5 py-3 text-base",
  lg: "px-6 py-4 text-lg",
};

export function PillButton({
  color = "blue",
  size = "md",
  className = "",
  disabled,
  ...props
}: PillButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`font-button rounded-pill uppercase italic transition-opacity ${colorStyles[color]} ${sizeStyles[size]} ${disabled ? "opacity-50" : ""} ${className}`}
      {...props}
    />
  );
}
