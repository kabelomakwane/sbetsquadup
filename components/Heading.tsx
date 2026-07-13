import type { JSX, ReactNode } from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  level: HeadingLevel;
  children: ReactNode;
  className?: string;
}

const sizeClasses: Record<HeadingLevel, string> = {
  1: "text-[40px] leading-[1.2] md:text-[56px] md:leading-[1.2]",
  2: "text-[36px] leading-[1.2] md:text-[48px] md:leading-[1.2]",
  3: "text-[32px] leading-[1.2] md:text-[40px] md:leading-[1.2]",
  4: "text-[24px] leading-[1.4] md:text-[32px] md:leading-[1.3]",
  5: "text-[20px] leading-[1.4] md:text-[24px] md:leading-[1.4]",
  6: "text-[18px] leading-[1.4] md:text-[20px] md:leading-[1.4]",
};

export function Heading({ level, children, className = "" }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={`font-display italic font-black uppercase text-white ${sizeClasses[level]} ${className}`}
    >
      {children}
    </Tag>
  );
}
