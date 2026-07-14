"use client";

import { useRouter } from "next/navigation";
import ScreenStub from "@/components/ScreenStub";
import { StubButton } from "@/components/StubLink";
import { useSquadUpStore } from "@/store/useSquadUpStore";

// SPEC.md 5.4 Team Picker — flow step 3, Kick Off branches on Signed in?
export default function TeamPickerPage() {
  const router = useRouter();
  const isSignedIn = useSquadUpStore((state) => state.isSignedIn);

  const handleKickOff = () => {
    router.push(isSignedIn() ? "/loading" : "/sign-in");
  };

  return (
    <ScreenStub name="Team Picker">
      <StubButton onClick={handleKickOff}>Kick Off</StubButton>
    </ScreenStub>
  );
}
