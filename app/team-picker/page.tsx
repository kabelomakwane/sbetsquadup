"use client";

import { useRouter } from "next/navigation";
import ScreenStub from "@/components/ScreenStub";
import { StubButton } from "@/components/StubLink";
import { getSession } from "@/lib/auth";

// SPEC.md 5.4 Team Picker — flow step 3, Kick Off branches on Signed in?
export default function TeamPickerPage() {
  const router = useRouter();

  const handleKickOff = () => {
    router.push(getSession() ? "/loading" : "/sign-in");
  };

  return (
    <ScreenStub name="Team Picker">
      <StubButton onClick={handleKickOff}>Kick Off</StubButton>
    </ScreenStub>
  );
}
