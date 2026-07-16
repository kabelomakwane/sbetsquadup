import { forwardRef } from "react";
import Image from "next/image";
import { LineupPill } from "@/components/LineupPill";
import { ScoreBug } from "@/components/ScoreBug";
import { matchStatRows, playerGoalCounts, teamLineupRows } from "@/lib/simulation";
import type { Match } from "@/lib/types";

export const SHARE_IMAGE_WIDTH = 1080;
export const SHARE_IMAGE_HEIGHT = 1350;

interface ShareImageCardProps {
  match: Match;
}

/**
 * The shareable result card — SPEC.md 5.10, Figma 73:1629. Always rendered
 * at its true 1080x1350 size; callers that need to display it smaller (the
 * Share Sheet preview) scale the wrapper with CSS transform rather than
 * shrinking this component, so html-to-image still captures full resolution.
 */
export const ShareImageCard = forwardRef<HTMLDivElement, ShareImageCardProps>(function ShareImageCard(
  { match },
  ref,
) {
  const goalCounts = playerGoalCounts(match);
  const homeRows = teamLineupRows(match.homeTeam, goalCounts);
  const awayRows = teamLineupRows(match.awayTeam, goalCounts);
  const stats = matchStatRows(match);

  return (
    <div
      ref={ref}
      style={{ width: SHARE_IMAGE_WIDTH, height: SHARE_IMAGE_HEIGHT }}
      className="flex flex-col items-center justify-between bg-gradient-to-r from-brand-blue to-brand-blue-end px-[32px] py-[64px]"
    >
      <div className="flex flex-col items-center gap-[32px]">
        <Image src="/images/sbet-squad-up-logo.svg" alt="SBET Squad Up" width={300} height={80} />
        {/* A <p>, not <Heading>, so the card's headline doesn't add a second
            <h1> when this renders inside the Share Sheet modal over a page
            that already has its own — visual size still matches Figma's
            56px H1 exactly, this card has no responsive breakpoints. */}
        <p className="font-display max-w-[700px] text-center text-[56px] font-black uppercase italic leading-[1.2] text-white">
          {match.narrativeDescriptor}
        </p>
        <ScoreBug
          homeTeamName={match.homeTeam.name}
          awayTeamName={match.awayTeam.name}
          homeScore={match.finalScore.home}
          awayScore={match.finalScore.away}
          showTimer={false}
        />
      </div>

      <div className="flex w-[800px] gap-[96px]">
        <div className="flex flex-1 flex-col gap-[16px]">
          {homeRows.map((row) => (
            <LineupPill key={row.player.id} side="home" position={row.position} playerName={row.player.name} goals={row.goals} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-[16px]">
          {awayRows.map((row) => (
            <LineupPill key={row.player.id} side="away" position={row.position} playerName={row.player.name} goals={row.goals} />
          ))}
        </div>
      </div>

      <div className="flex w-[800px] flex-col items-center gap-[32px]">
        <div className="rounded-pill bg-brand-blue px-[24px] py-[16px]">
          <p className="font-display text-[18px] font-black italic uppercase text-white">Match Stats</p>
        </div>
        <div className="flex w-full items-start justify-between px-[160px]">
          <div className="flex flex-col items-center gap-[16px]">
            {stats.map((stat) => (
              <span
                key={stat.label}
                className={`font-label flex h-[30px] items-center justify-center rounded-pill px-2 text-base font-black not-italic text-white ${
                  stat.leading === "home" ? "bg-brand-red" : ""
                }`}
              >
                {stat.homeDisplay}
              </span>
            ))}
          </div>
          <div className="font-display flex flex-col items-center gap-[16px] text-center text-base font-black uppercase italic text-white">
            {stats.map((stat) => (
              <p key={stat.label} className="flex h-[30px] items-center">
                {stat.label}
              </p>
            ))}
          </div>
          <div className="flex flex-col items-center gap-[16px]">
            {stats.map((stat) => (
              <span
                key={stat.label}
                className={`font-label flex h-[30px] items-center justify-center rounded-pill px-2 text-base font-black not-italic ${
                  stat.leading === "away" ? "bg-brand-yellow text-brand-blue" : "text-white"
                }`}
              >
                {stat.awayDisplay}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-display text-[24px] font-black uppercase italic text-white">Think you can beat this?</p>
        <p className="font-display text-[48px] font-black uppercase italic text-brand-yellow">
          squadup.supersportbet.co.za
        </p>
      </div>
    </div>
  );
});
