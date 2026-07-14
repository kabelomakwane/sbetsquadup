"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { PillButton } from "@/components/PillButton";
import { login } from "@/lib/auth";
import type { AuthProvider } from "@/lib/types";

interface SocialButtonProps {
  bg: string;
  textClass: string;
  shadow?: boolean;
  icon: ReactNode;
  onClick: () => void;
  children: ReactNode;
}

function SocialButton({ bg, textClass, shadow, icon, onClick, children }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-[54px] w-full items-center justify-center gap-4 rounded-[10px] transition-opacity hover:opacity-90 ${bg} ${
        shadow ? "shadow-[0_0_1.5px_rgba(0,0,0,0.08),0_2px_1.5px_rgba(0,0,0,0.17)]" : ""
      }`}
    >
      {icon}
      <span className={`font-body text-lg font-medium not-italic ${textClass}`}>{children}</span>
    </button>
  );
}

// SPEC.md 5.5 Sign In / Sign Up (Figma 68:605) — mocked auth, flow step 3 (No branch).
export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async (provider: AuthProvider) => {
    await login(provider);
    router.push("/loading");
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-16 px-6 py-16 text-center">
      <div className="flex flex-col items-center gap-3">
        <Heading level={1} className="!text-brand-yellow max-w-4xl">
          Wait! Before we kick off...
        </Heading>
        <Text size="large" className="max-w-xl">
          We noticed that you aren&apos;t signed in yet. Having an account allows you to save your
          best team and keep a record of your matches.
        </Text>
      </div>
      <div className="flex w-full max-w-[345px] flex-col items-center gap-6">
        <SocialButton
          bg="bg-[#1877F2]"
          textClass="text-white"
          icon={<Image src="/images/icon-facebook.svg" alt="" width={24} height={24} />}
          onClick={() => handleSignIn("facebook")}
        >
          Continue with Facebook
        </SocialButton>
        <SocialButton
          bg="bg-white"
          textClass="text-black/54"
          shadow
          icon={<Image src="/images/icon-google.svg" alt="" width={23} height={23} />}
          onClick={() => handleSignIn("google")}
        >
          Continue with Google
        </SocialButton>
        <SocialButton
          bg="bg-black"
          textClass="text-white"
          icon={<Image src="/images/icon-apple.svg" alt="" width={24} height={24} />}
          onClick={() => handleSignIn("apple")}
        >
          Continue with Apple
        </SocialButton>
        <PillButton buttonStyle="link" onClick={() => handleSignIn("email")}>
          Or Sign In With Email
        </PillButton>
      </div>
    </main>
  );
}
