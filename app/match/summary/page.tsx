"use client";

import { useRouter } from "next/navigation";
import ScreenStub from "@/components/ScreenStub";
import StubLink, { StubButton } from "@/components/StubLink";
import { useSquadUpStore } from "@/store/useSquadUpStore";

// SPEC.md 5.9 Match Summary Page — flow step 6-7, Rematch loops back to Team Picker.
export default function MatchSummaryPage() {
  const router = useRouter();
  const rematch = useSquadUpStore((state) => state.rematch);

  const handleRematch = () => {
    rematch();
    router.push("/team-picker");
  };

  return (
    <ScreenStub name="Match Summary Page">
      <StubLink href="/share-sheet">Share Results</StubLink>
      <StubButton onClick={handleRematch}>Rematch</StubButton>
    </ScreenStub>
  );
}
