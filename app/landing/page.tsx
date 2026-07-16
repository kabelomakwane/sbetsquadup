"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/Text";
import { PillButton } from "@/components/PillButton";
import { getPlayerInitials } from "@/lib/data/players";
import { useHasHydrated, useSquadUpStore } from "@/store/useSquadUpStore";

// SPEC.md 5.2 Landing Page (Figma 68:476) — flow step 2.
export default function LandingPage() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const user = useSquadUpStore((state) => state.user);

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      {/* Account icon, top corner — SPEC.md 5.12. Signed-out users get
          nothing here, there's nothing to show them yet. hasHydrated gates
          the first read of persisted `user` state to avoid an SSR/client
          hydration mismatch (same pattern as Match Summary's guard). */}
      {hasHydrated && user && (
        <div className="absolute top-6 right-6">
          <button
            type="button"
            onClick={() => router.push("/profile")}
            aria-label="My Profile"
            className="cursor-pointer"
          >
            <Avatar initials={getPlayerInitials(user.name)} size="regular" />
          </button>
        </div>
      )}

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
