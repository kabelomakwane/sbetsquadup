"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { PillButton } from "@/components/PillButton";
import { useSquadUpStore } from "@/store/useSquadUpStore";

// SPEC.md 5.1 Age Check (Figma 68:463) — flow step 1.
export default function AgeCheckPage() {
  const router = useRouter();
  const ageConfirmed = useSquadUpStore((state) => state.ageConfirmed);
  const confirmAge = useSquadUpStore((state) => state.confirmAge);

  useEffect(() => {
    if (ageConfirmed) {
      router.replace("/landing");
    }
  }, [ageConfirmed, router]);

  const handleConfirm = () => {
    confirmAge();
    router.push("/landing");
  };

  const handleDecline = () => {
    window.location.href = "https://supersport.com";
  };

  return (
    <main className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <Heading level={1} className="!text-brand-yellow max-w-3xl">
          Confirm you are over 18
        </Heading>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <PillButton buttonStyle="primary" onClick={handleConfirm}>
            Yes, I&apos;m Over 18
          </PillButton>
          <PillButton buttonStyle="tertiary" onClick={handleDecline}>
            No, Take Me back
          </PillButton>
        </div>
        <Text size="small" muted className="max-w-xl">
          By clicking the &ldquo;yes, I&apos;m over 18&rdquo; button, you confirm that you are the
          required age of your country/region to visit our website, you accept{" "}
          <span className="underline">Terms and Conditions</span> and you declare that you have
          read our <span className="underline">Privacy &amp; Cookies Notice</span>.
        </Text>
      </div>
      <footer className="flex flex-col items-center gap-3 px-6 py-6 text-center">
        <Image src="/images/sbet-responsibly-logo.svg" alt="Bet Responsibly" width={191} height={30} />
        <Text size="tiny" muted className="max-w-3xl">
          SuperSportBet is licensed by the Western Cape Gambling and Racing Board. Bookmaker
          licence: 1019097. No persons under the age of 18 are permitted to gamble. Winners know
          when to stop. National Responsible Gambling Programme toll free counselling line 0800
          006 008 or WHATSAPP HHELP to 076 675 0710. T&amp;C&apos;s Apply.
        </Text>
      </footer>
    </main>
  );
}
