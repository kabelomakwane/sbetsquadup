type AvatarSize = "small" | "regular" | "large";

interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  className?: string;
}

// Plain brand-blue initials circle — not tied to a squad side (no
// red/yellow), unlike PlayerBubble's filled state. Reused for the account
// icon on Landing/Team Picker and Profile's identity header (SPEC.md 5.12).
// Presentational only — callers wrap it in their own <button> for click
// affordance and an aria-label where it's interactive.
const circleSizeClass: Record<AvatarSize, string> = {
  small: "size-8",
  regular: "size-12",
  large: "size-20",
};

const initialsSizeClass: Record<AvatarSize, string> = {
  small: "text-[10px]",
  regular: "text-[15px]",
  large: "text-xl",
};

export function Avatar({ initials, size = "regular", className = "" }: AvatarProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-pill bg-brand-blue ${circleSizeClass[size]} ${className}`}
    >
      <span className={`font-label font-black not-italic text-white ${initialsSizeClass[size]}`}>{initials}</span>
    </div>
  );
}
