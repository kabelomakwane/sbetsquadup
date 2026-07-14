"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ScreenStub from "@/components/ScreenStub";
import { StubButton } from "@/components/StubLink";
import { useSquadUpStore } from "@/store/useSquadUpStore";

// SPEC.md 5.1 Age Check — flow step 1.
export default function AgeCheckPage() {
  const router = useRouter();
  const ageConfirmed = useSquadUpStore((state) => state.ageConfirmed);
  const confirmAge = useSquadUpStore((state) => state.confirmAge);

  useEffect(() => {
    if (ageConfirmed) {
      router.replace("/landing");
    }
  }, [ageConfirmed, router]);

  return (
    <ScreenStub name="Age Check">
      <StubButton
        onClick={() => {
          confirmAge();
          router.push("/landing");
        }}
      >
        I&apos;m 18 or over
      </StubButton>
      <a
        className="font-button text-sm text-white-75 underline"
        href="https://supersport.com"
        rel="noopener noreferrer"
      >
        I&apos;m not 18
      </a>
    </ScreenStub>
  );
}
