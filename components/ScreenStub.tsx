import type { ReactNode } from "react";
import { Heading } from "@/components/Heading";

interface ScreenStubProps {
  name: string;
  children?: ReactNode;
}

export default function ScreenStub({ name, children }: ScreenStubProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <Heading level={1}>{name}</Heading>
      <div className="flex flex-col items-center gap-3">{children}</div>
    </main>
  );
}
