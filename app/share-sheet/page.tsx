"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// SPEC.md 5.11: "There's no separate full-page route for [the Share Sheet],
// the frame is effectively the Match Summary Page with a Share Modal
// overlaid on top." The real implementation is <ShareSheetModal>, rendered
// from app/match/summary/page.tsx. This route only exists as a leftover
// from the Phase 2 route skeleton — redirect to where Share Sheet actually lives.
export default function ShareSheetPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/match/summary");
  }, [router]);

  return null;
}
