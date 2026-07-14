import ScreenStub from "@/components/ScreenStub";
import StubLink from "@/components/StubLink";

// SPEC.md 5.6 Game Loading Screen — flow step 4.
export default function LoadingPage() {
  return (
    <ScreenStub name="Game Loading Screen">
      <StubLink href="/match/live">Continue</StubLink>
    </ScreenStub>
  );
}
