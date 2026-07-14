"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Text } from "@/components/Text";
import { PillButton } from "@/components/PillButton";

// SPEC.md 5.2 Landing Page (Figma 68:476) — flow step 2.
export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <Image
        src="/images/sbet-squad-up-logo.svg"
        alt="SBET Squad Up"
        width={600}
        height={160}
        priority
        className="h-auto w-[280px] sm:w-[380px] md:w-[480px]"
      />
      <Text size="regular" weight="bold" className="uppercase">
        The Ultimate Fantasy 5-A-Side Game
      </Text>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <PillButton buttonStyle="primary" onClick={() => router.push("/team-picker")}>
          New Game
        </PillButton>
        <PillButton buttonStyle="tertiary" onClick={() => router.push("/how-to-play")}>
          How To Play
        </PillButton>
      </div>
    </main>
  );
}
