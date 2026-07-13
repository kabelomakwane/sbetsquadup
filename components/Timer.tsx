export type TimerState = "default" | "half-time" | "full-time" | "paused";

interface TimerProps {
  state?: TimerState;
  time?: string;
}

const stateLabel: Partial<Record<TimerState, string>> = {
  "half-time": "Half Time",
  "full-time": "Full Time",
  paused: "Paused",
};

export function Timer({ state = "default", time = "00:00" }: TimerProps) {
  const isPaused = state === "paused";
  const label = stateLabel[state] ?? time;

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-bl-[24px] rounded-br-[24px] px-6 py-3 ${
        isPaused ? "bg-brand-blue" : "bg-white"
      }`}
    >
      <p
        className={`font-tag text-cap-trim text-2xl font-bold not-italic uppercase ${
          isPaused ? "text-white" : "text-brand-blue"
        }`}
      >
        {label}
      </p>
    </div>
  );
}
