import type { ReactNode } from "react";

interface ScreenStubProps {
  name: string;
  children?: ReactNode;
}

export default function ScreenStub({ name, children }: ScreenStubProps) {
  return (
    <main
      className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center"
      style={{
        background:
          "linear-gradient(180deg, var(--color-brand-blue), var(--color-brand-blue-end))",
      }}
    >
      <h1 className="font-display text-3xl uppercase italic text-white">
        {name}
      </h1>
      <div className="flex flex-col items-center gap-3">{children}</div>
    </main>
  );
}
