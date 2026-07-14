import Image from "next/image";

export type ErrorChipVariant = "foul" | "yellowCard" | "redCard";

interface ErrorChipProps {
  variant: ErrorChipVariant;
  message: string;
}

const variantStyles: Record<ErrorChipVariant, { bg: string; text: string; headline: string }> = {
  foul: { bg: "bg-white", text: "text-brand-blue", headline: "Foul!" },
  yellowCard: { bg: "bg-brand-yellow", text: "text-brand-blue", headline: "Yellow Card!" },
  redCard: { bg: "bg-brand-red", text: "text-white", headline: "Red Card!" },
};

function CardIcon() {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
      <path
        d="M7.00004 0H3.00004C2.73483 0 2.48047 0.105357 2.29294 0.292893C2.1054 0.48043 2.00004 0.734784 2.00004 1V5.785L0.655043 7.14C0.44591 7.34629 0.280207 7.59238 0.167712 7.86374C0.0552164 8.1351 -0.00179427 8.42625 4.30351e-05 8.72C0.000845587 8.9596 0.0396613 9.19756 0.115043 9.425L0.750043 11.325C0.915581 11.8267 0.999975 12.3517 1.00004 12.88V13.5C1.00004 13.6326 1.05272 13.7598 1.14649 13.8536C1.24026 13.9473 1.36743 14 1.50004 14H4.50004C4.63265 14 4.75983 13.9473 4.8536 13.8536C4.94736 13.7598 5.00004 13.6326 5.00004 13.5V12.705C4.99948 12.5468 5.0306 12.3901 5.09157 12.2441C5.15254 12.0981 5.24213 11.9658 5.35504 11.855C5.55997 11.6502 5.72243 11.407 5.83312 11.1393C5.94381 10.8716 6.00053 10.5847 6.00004 10.295V9H7.00004C7.26526 9 7.51961 8.89464 7.70715 8.70711C7.89469 8.51957 8.00004 8.26522 8.00004 8V1C8.00004 0.734784 7.89469 0.48043 7.70715 0.292893C7.51961 0.105357 7.26526 0 7.00004 0ZM5.00004 10.295C5.00061 10.4532 4.96949 10.6099 4.90852 10.7559C4.84755 10.9019 4.75796 11.0342 4.64504 11.145C4.44012 11.3498 4.27765 11.593 4.16696 11.8607C4.05628 12.1284 3.99955 12.4153 4.00004 12.705V13H2.00004V12.88C2.00322 12.2408 1.90015 11.6054 1.69504 11L1.06504 9.1C1.02122 8.97468 0.999232 8.84276 1.00004 8.71C1.00022 8.38232 1.12957 8.06793 1.36004 7.835L2.00004 7.205V8C2.00004 8.26522 2.1054 8.51957 2.29294 8.70711C2.48047 8.89464 2.73483 9 3.00004 9H3.50004V9.5C3.50004 9.63261 3.55272 9.75979 3.64649 9.85355C3.74026 9.94732 3.86743 10 4.00004 10C4.13265 10 4.25983 9.94732 4.3536 9.85355C4.44736 9.75979 4.50004 9.63261 4.50004 9.5V6.75C4.50004 6.6837 4.52638 6.62011 4.57327 6.57322C4.62015 6.52634 4.68374 6.5 4.75004 6.5C4.81635 6.5 4.87994 6.52634 4.92682 6.57322C4.9737 6.62011 5.00004 6.6837 5.00004 6.75V10.295ZM7.00004 8H6.00004V6.75C6.00004 6.41848 5.86835 6.10054 5.63393 5.86612C5.39951 5.6317 5.08156 5.5 4.75004 5.5C4.41852 5.5 4.10058 5.6317 3.86616 5.86612C3.63174 6.10054 3.50004 6.41848 3.50004 6.75V8H3.00004V1H7.00004V8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ErrorChip({ variant, message }: ErrorChipProps) {
  const { bg, text, headline } = variantStyles[variant];

  return (
    <div className={`flex items-start gap-2 rounded-lg px-4 py-1 ${bg} ${text}`}>
      {variant === "foul" ? (
        <Image src="/images/icon-whistle.svg" alt="" width={16} height={16} className="shrink-0" />
      ) : (
        <CardIcon />
      )}
      <div className="flex flex-col items-start">
        <p className="font-tag text-sm font-bold not-italic">{headline}</p>
        <p className="font-body text-xs font-normal not-italic">{message}</p>
      </div>
    </div>
  );
}
