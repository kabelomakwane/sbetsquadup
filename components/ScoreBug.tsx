import Image from "next/image";
import { Timer, type TimerState } from "./Timer";

interface ScoreBugProps {
  homeTeamName: string;
  awayTeamName: string;
  homeScore?: number;
  awayScore?: number;
  showScores?: boolean;
  showTimer?: boolean;
  timerState?: TimerState;
  time?: string;
}

export function ScoreBug({
  homeTeamName,
  awayTeamName,
  homeScore = 0,
  awayScore = 0,
  showScores = true,
  showTimer = true,
  timerState = "default",
  time,
}: ScoreBugProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-3 rounded-[40px] bg-brand-blue p-2">
        <div className="flex items-center overflow-hidden rounded-tl-[32px] rounded-tr-[32px] rounded-bl-[32px]">
          <div className="flex w-[300px] items-center justify-center bg-brand-red px-3 py-4">
            <p className="font-display truncate text-2xl italic uppercase text-white">
              {homeTeamName}
            </p>
          </div>
          {showScores && (
            <div className="flex min-w-[61px] flex-col items-center justify-center bg-white p-4">
              <p className="font-label text-2xl font-black not-italic text-brand-blue">
                {homeScore}
              </p>
            </div>
          )}
        </div>
        <Image src="/images/sbet-logo.svg" alt="SBET" width={68} height={32} />
        <div className="flex items-center overflow-hidden rounded-tl-[32px] rounded-tr-[32px] rounded-br-[32px]">
          {showScores && (
            <div className="flex min-w-[61px] flex-col items-center justify-center bg-white p-4">
              <p className="font-label text-2xl font-black not-italic text-brand-blue">
                {awayScore}
              </p>
            </div>
          )}
          <div className="flex w-[300px] items-center justify-center bg-brand-yellow px-3 py-4">
            <p className="font-display truncate text-2xl italic uppercase text-brand-blue">
              {awayTeamName}
            </p>
          </div>
        </div>
      </div>
      {showTimer && <Timer state={timerState} time={time} />}
    </div>
  );
}
