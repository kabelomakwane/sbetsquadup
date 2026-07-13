interface ScoreBugProps {
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
}

export function ScoreBug({ homeTeamName, awayTeamName, homeScore, awayScore }: ScoreBugProps) {
  return (
    <div className="flex items-center gap-4 rounded-pill bg-white/10 px-6 py-3">
      <div className="flex flex-1 items-center justify-end gap-3">
        <span className="font-display text-sm font-black italic uppercase text-white">{homeTeamName}</span>
        <span className="font-display text-2xl font-black italic text-white">{homeScore}</span>
      </div>
      <span className="font-display text-xs font-black italic uppercase text-white-75">SBET</span>
      <div className="flex flex-1 items-center justify-start gap-3">
        <span className="font-display text-2xl font-black italic text-white">{awayScore}</span>
        <span className="font-display text-sm font-black italic uppercase text-white">{awayTeamName}</span>
      </div>
    </div>
  );
}
