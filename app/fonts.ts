import localFont from "next/font/local";

export const superSportExtra = localFont({
  src: [
    { path: "./fonts/SuperSport-Black.ttf", weight: "900", style: "normal" },
    { path: "./fonts/SuperSport-BlackItalic.ttf", weight: "900", style: "italic" },
  ],
  variable: "--font-supersport-extra",
  display: "swap",
});

export const superSportHD = localFont({
  src: [
    { path: "./fonts/SuperSport-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/SuperSport-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
  variable: "--font-supersport-hd",
  display: "swap",
});

export const superSportSD = localFont({
  src: [
    { path: "./fonts/SuperSport-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SuperSport-Italic.ttf", weight: "400", style: "italic" },
  ],
  variable: "--font-supersport-sd",
  display: "swap",
});
