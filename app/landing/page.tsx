import ScreenStub from "@/components/ScreenStub";
import StubLink from "@/components/StubLink";

// SPEC.md 5.2 Landing Page — flow step 2.
export default function LandingPage() {
  return (
    <ScreenStub name="Landing Page">
      <StubLink href="/how-to-play">How to Play</StubLink>
      <StubLink href="/team-picker">New Game</StubLink>
    </ScreenStub>
  );
}
