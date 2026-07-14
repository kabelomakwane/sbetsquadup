import type { ReactNode } from "react";

type TextSize = "large" | "medium" | "regular" | "small" | "tiny";
type SuperSportWeight = "extrabold" | "bold" | "normal";
type InterWeight = "extrabold" | "bold" | "semibold" | "medium" | "normal" | "light";

interface TextProps {
  size?: TextSize;
  weight?: SuperSportWeight | InterWeight;
  as?: "p" | "span";
  muted?: boolean;
  children: ReactNode;
  className?: string;
}

const sizeClasses: Record<TextSize, string> = {
  large: "text-[20px] leading-[1.5]",
  medium: "text-[18px] leading-[1.5]",
  regular: "text-[16px] leading-[1.5]",
  small: "text-[14px] leading-[1.5]",
  tiny: "text-[12px] leading-[1.5]",
};

const superSportWeightClasses: Record<SuperSportWeight, string> = {
  extrabold: "font-label font-black not-italic",
  bold: "font-tag font-bold not-italic",
  normal: "font-button font-normal not-italic",
};

const interWeightClasses: Record<InterWeight, string> = {
  extrabold: "font-body font-extrabold",
  bold: "font-body font-bold",
  semibold: "font-body font-semibold",
  medium: "font-body font-medium",
  normal: "font-body font-normal",
  light: "font-body font-light",
};

export function Text({
  size = "regular",
  weight = "normal",
  as = "p",
  muted = false,
  children,
  className = "",
}: TextProps) {
  const Tag = as;
  const weightClass =
    size === "tiny"
      ? interWeightClasses[weight as InterWeight]
      : superSportWeightClasses[weight as SuperSportWeight];

  return (
    <Tag
      className={`${weightClass} ${sizeClasses[size]} ${muted ? "text-white-75" : "text-white"} ${className}`}
    >
      {children}
    </Tag>
  );
}
