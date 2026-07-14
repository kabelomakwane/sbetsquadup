import Link from "next/link";
import type { ComponentProps } from "react";
import { PillButton } from "@/components/PillButton";

const LINK_PILL_CLASSES =
  "font-display inline-flex items-center justify-center whitespace-nowrap text-base font-black italic transition-opacity rounded-pill bg-brand-red text-white px-6 py-3 hover:opacity-90";

export default function StubLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} className={LINK_PILL_CLASSES} />;
}

export function StubButton(props: ComponentProps<typeof PillButton>) {
  return <PillButton {...props} />;
}
