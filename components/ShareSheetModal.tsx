"use client";

import { useEffect, useRef, useState } from "react";
import { PillButton } from "@/components/PillButton";
import { ShareImageCard, SHARE_IMAGE_HEIGHT, SHARE_IMAGE_WIDTH } from "@/components/ShareImageCard";
import { buildShareText, downloadDataUrl, openWhatsAppShare, openXShare, shareImageToDataUrl } from "@/lib/share/shareImage";
import type { Match } from "@/lib/types";

const PREVIEW_WIDTH = 450;
const PREVIEW_HEIGHT = 563;
const PREVIEW_SCALE = PREVIEW_WIDTH / SHARE_IMAGE_WIDTH;

interface ShareSheetModalProps {
  match: Match;
  onClose: () => void;
}

function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v12m0 0-4-4m4 4 4-4M5 20h14"
        stroke="#111FA3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Generic placeholder glyphs, not the official X/WhatsApp brand marks — see
// the SPEC.md 12 note below on why those can't ship yet.
function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4l16 16M20 4L4 20" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3a9 9 0 0 0-7.75 13.55L3 21l4.6-1.21A9 9 0 1 0 12 3Z"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.8 8.4c.2-.45.4-.46.6-.47h.5c.16 0 .38-.06.6.46s.72 1.77.78 1.9.1.28 0 .45a5.6 5.6 0 0 1-.5.65c-.15.2-.32.35-.14.68.19.33.83 1.37 1.78 2.22 1.22 1.1 2.25 1.44 2.58 1.6s.52.14.72-.08.83-.97 1.05-1.3.44-.28.74-.17 1.9.9 2.22 1.06.54.25.62.4a2.6 2.6 0 0 1-.18 1.5c-.24.5-1.4 1.13-1.94 1.16-.5.03-1 .22-3.44-.72-2.9-1.13-4.73-4.1-4.87-4.3s-1.15-1.53-1.15-2.92A3.1 3.1 0 0 1 8.8 8.4Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

// SPEC.md 5.11: the black button reads as an X (Twitter) share, the
// #25D366-green button as WhatsApp, but section 12 item 4 flags both icons
// as pending an actual brand-guideline check before shipping the real
// platform marks. The glyphs above are generic placeholders standing in for
// that; the click handlers below (X intent / wa.me deep link) are already
// fully functional and don't need to change once the icons are swapped.
export function ShareSheetModal({ match, onClose }: ShareSheetModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDownload = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const dataUrl = await shareImageToDataUrl(cardRef.current);
      downloadDataUrl(dataUrl, `squad-up-${match.id}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  const shareText = buildShareText(match.narrativeDescriptor);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share your result"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-[9px]"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="flex w-full max-w-[450px] flex-col items-center gap-8">
        <div
          className="relative overflow-hidden rounded-[32px]"
          style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: SHARE_IMAGE_WIDTH, height: SHARE_IMAGE_HEIGHT, transform: `scale(${PREVIEW_SCALE})` }}
          >
            <ShareImageCard ref={cardRef} match={match} />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full gap-4">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isExporting}
              aria-label="Download Share Image"
              className="flex flex-1 items-center justify-center rounded-pill bg-white px-6 py-4 transition-opacity disabled:opacity-60"
            >
              <DownloadIcon />
            </button>
            <button
              type="button"
              onClick={() => openXShare(shareText)}
              aria-label="Share on X"
              className="flex flex-1 items-center justify-center rounded-pill bg-black px-6 py-4"
            >
              <XIcon />
            </button>
            <button
              type="button"
              onClick={() => openWhatsAppShare(shareText)}
              aria-label="Share on WhatsApp"
              className="flex flex-1 items-center justify-center rounded-pill bg-[#25D366] px-6 py-4"
            >
              <WhatsAppIcon />
            </button>
          </div>
          <PillButton buttonStyle="tertiary" onClick={onClose} className="w-full">
            Close
          </PillButton>
        </div>
      </div>
    </div>
  );
}
