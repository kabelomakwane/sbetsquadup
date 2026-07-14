"use client";

import { useRouter } from "next/navigation";
import ScreenStub from "@/components/ScreenStub";
import { StubButton } from "@/components/StubLink";
import { useSquadUpStore } from "@/store/useSquadUpStore";
import type { AuthProvider } from "@/lib/types";

// SPEC.md 5.5 Sign In / Sign Up — mocked auth, flow step 3 (No branch).
export default function SignInPage() {
  const router = useRouter();
  const signIn = useSquadUpStore((state) => state.signIn);

  const handleSignIn = (provider: AuthProvider) => {
    signIn({
      id: crypto.randomUUID(),
      authProvider: provider,
      signedInAt: Date.now(),
    });
    router.push("/loading");
  };

  return (
    <ScreenStub name="Sign In / Sign Up">
      <StubButton onClick={() => handleSignIn("facebook")}>
        Continue with Facebook
      </StubButton>
      <StubButton onClick={() => handleSignIn("google")}>
        Continue with Google
      </StubButton>
      <StubButton onClick={() => handleSignIn("apple")}>
        Continue with Apple
      </StubButton>
      <button
        type="button"
        className="font-button text-sm text-white-75 underline"
        onClick={() => handleSignIn("email")}
      >
        Sign In With Email
      </button>
    </ScreenStub>
  );
}
