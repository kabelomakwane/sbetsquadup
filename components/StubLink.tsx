import Link from "next/link";
import type { ComponentProps } from "react";

const PILL_CLASSES =
  "rounded-full bg-white px-6 py-3 font-button text-sm uppercase tracking-wide text-brand-blue transition hover:opacity-90";

export default function StubLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} className={PILL_CLASSES} />;
}

export function StubButton(props: ComponentProps<"button">) {
  return <button type="button" {...props} className={PILL_CLASSES} />;
}
