import type { ButtonHTMLAttributes, ReactNode } from "react";

type PillButtonStyle = "primary" | "secondary" | "tertiary" | "link";
type PillButtonSize = "regular" | "small";
type IconPosition = "none" | "leading" | "trailing" | "only";

interface PillButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  buttonStyle?: PillButtonStyle;
  size?: PillButtonSize;
  icon?: ReactNode;
  iconPosition?: IconPosition;
  children?: ReactNode;
}

const styleClasses: Record<
  PillButtonStyle,
  { bg: string; disabledBg: string; text: string; disabledText: string }
> = {
  primary: {
    bg: "bg-brand-red",
    disabledBg: "bg-brand-red-disabled",
    text: "text-white",
    disabledText: "text-white/50",
  },
  secondary: {
    bg: "bg-brand-yellow",
    disabledBg: "bg-brand-yellow-disabled",
    text: "text-brand-blue",
    disabledText: "text-brand-blue/50",
  },
  tertiary: {
    bg: "bg-brand-blue",
    disabledBg: "bg-brand-blue-disabled",
    text: "text-white",
    disabledText: "text-white/50",
  },
  link: {
    bg: "",
    disabledBg: "",
    text: "text-white",
    disabledText: "text-white/50",
  },
};

export function PillButton({
  buttonStyle = "primary",
  size = "regular",
  icon,
  iconPosition = "none",
  disabled,
  className = "",
  children,
  ...props
}: PillButtonProps) {
  const isLink = buttonStyle === "link";
  const isIconOnly = iconPosition === "only";
  const colors = styleClasses[buttonStyle];

  const bgClass = isLink ? "" : disabled ? colors.disabledBg : colors.bg;
  const textClass = disabled ? colors.disabledText : colors.text;
  const paddingClass = isLink
    ? ""
    : isIconOnly
      ? size === "small"
        ? "p-2"
        : "p-3"
      : size === "small"
        ? "px-5 py-2"
        : "px-6 py-3";
  const gapClass = isLink ? "gap-2" : "gap-3";

  const showLeadingIcon = icon && (iconPosition === "leading" || iconPosition === "only");
  const showTrailingIcon = icon && iconPosition === "trailing";
  const showText = iconPosition !== "only";

  return (
    <button
      type="button"
      disabled={disabled}
      className={`font-display inline-flex items-center justify-center whitespace-nowrap text-base font-black italic transition-opacity ${
        isLink ? "" : "rounded-pill"
      } ${bgClass} ${textClass} ${paddingClass} ${icon && !isIconOnly ? gapClass : ""} ${className}`}
      {...props}
    >
      {showLeadingIcon && icon}
      {showText && children}
      {showTrailingIcon && icon}
    </button>
  );
}
