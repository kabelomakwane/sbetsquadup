interface ErrorChipProps {
  message: string;
}

export function ErrorChip({ message }: ErrorChipProps) {
  return (
    <span className="font-body inline-flex items-center rounded-pill bg-white px-3 py-1 text-xs text-brand-red shadow-sm">
      {message}
    </span>
  );
}
