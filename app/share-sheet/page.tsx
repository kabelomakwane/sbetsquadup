import ScreenStub from "@/components/ScreenStub";
import StubLink from "@/components/StubLink";

// SPEC.md 5.11 Share Sheet — modal over Match Summary Page, triggered by Share Results.
export default function ShareSheetPage() {
  return (
    <ScreenStub name="Share Sheet">
      <StubLink href="/share-image">Preview Share Image</StubLink>
      <StubLink href="/match/summary">Close</StubLink>
    </ScreenStub>
  );
}
