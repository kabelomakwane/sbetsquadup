import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Background } from "@/components/Background";
import { superSportExtra, superSportHD, superSportSD } from "./fonts";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Squad Up",
  description: "A browser-based, 5-a-side dream-team match simulator for SuperSportBet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${superSportExtra.variable} ${superSportHD.variable} ${superSportSD.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <Background />
        {children}
      </body>
    </html>
  );
}
