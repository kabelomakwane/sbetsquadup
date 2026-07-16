"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PillButton } from "@/components/PillButton";
import { SHARE_IMAGE_HEIGHT, SHARE_IMAGE_WIDTH, ShareImageCard } from "@/components/ShareImageCard";
import { downloadDataUrl, shareImageToDataUrl } from "@/lib/share/shareImage";
import { useHasHydrated, useSquadUpStore } from "@/store/useSquadUpStore";

// SPEC.md 5.10 Share Image (Figma 73:1629) — the shareable result card,
// generated on match end. The product flow reaches it through the Share
// Sheet modal over the Match Summary Page (5.11); this route is a
// standalone full-resolution preview/download, useful for QA against Figma.
export default function ShareImagePage() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const match = useSquadUpStore((state) => state.match);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Persisted `match` (SPEC.md 9) loads after the first render — wait for
  // hasHydrated so a hard reload here doesn't bounce a returning user away
  // before it loads.
  useEffect(() => {
    if (!hasHydrated) return;
    if (!match) router.replace("/team-picker");
  }, [hasHydrated, match, router]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(Math.min(1, entry.contentRect.width / SHARE_IMAGE_WIDTH));
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current || !match || isExporting) return;
    setIsExporting(true);
    try {
      const dataUrl = await shareImageToDataUrl(cardRef.current);
      downloadDataUrl(dataUrl, `squad-up-${match.id}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  if (!hasHydrated || !match) return null;

  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-6 py-12">
      <div ref={containerRef} className="w-full max-w-[1080px]" style={{ height: SHARE_IMAGE_HEIGHT * scale }}>
        <div
          className="origin-top-left"
          style={{ width: SHARE_IMAGE_WIDTH, height: SHARE_IMAGE_HEIGHT, transform: `scale(${scale})` }}
        >
          <ShareImageCard ref={cardRef} match={match} />
        </div>
      </div>
      <PillButton buttonStyle="primary" onClick={handleDownload} disabled={isExporting}>
        {isExporting ? "Preparing..." : "Download Share Image"}
      </PillButton>
    </main>
  );
}
