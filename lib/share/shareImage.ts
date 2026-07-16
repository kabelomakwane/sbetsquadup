// Browser-only helpers for exporting/sharing the Share Image card (SPEC.md
// 5.10/5.11). Not part of lib/simulation — this touches the DOM and window,
// it isn't pure match-outcome logic.

import { toPng } from "html-to-image";

export const SHARE_IMAGE_WIDTH = 1080;
export const SHARE_IMAGE_HEIGHT = 1350;

const SHARE_URL = "https://squadup.supersportbet.co.za";

/** Rasterizes the given card node to a PNG data URL at its true 1080x1350 resolution. */
export async function shareImageToDataUrl(node: HTMLElement): Promise<string> {
  return toPng(node, {
    width: SHARE_IMAGE_WIDTH,
    height: SHARE_IMAGE_HEIGHT,
    pixelRatio: 1,
    cacheBust: true,
  });
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function buildShareText(narrativeDescriptor: string): string {
  return `${narrativeDescriptor} Think you can beat this?`;
}

// X (Twitter) and WhatsApp share intents — functional, but the icons on
// these two buttons are generic placeholders. SPEC.md section 12 item 4
// flags that the actual X/WhatsApp brand marks need a guideline check
// before shipping, so don't swap in official logo assets without that.
export function openXShare(text: string): void {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SHARE_URL)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function openWhatsAppShare(text: string): void {
  const url = `https://wa.me/?text=${encodeURIComponent(`${text} ${SHARE_URL}`)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
