import Image from "next/image";

export function Background() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-r from-brand-blue to-brand-blue-end"
    >
      <Image
        src="/images/background-vector.svg"
        alt=""
        width={1748}
        height={1739}
        className="absolute left-1/2 top-[-177px] max-w-none -translate-x-1/2 mix-blend-soft-light"
      />
    </div>
  );
}
