import { PillButton } from "@/components/PillButton";
import { PillInput } from "@/components/PillInput";
import { PlayerBubble } from "@/components/PlayerBubble";
import { ScoreBug } from "@/components/ScoreBug";
import { TabGroup } from "@/components/TabGroup";
import { StatValuePill } from "@/components/StatValuePill";
import { ErrorChip } from "@/components/ErrorChip";
import type { Position, Side } from "@/components/types";

const positions: Position[] = ["ST", "MID", "DEF", "GK"];
const sides: Side[] = ["home", "away"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex w-full max-w-4xl flex-col gap-4">
      <h2 className="font-display text-xl font-black uppercase italic text-white">{title}</h2>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-black/10 p-6">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main
      className="flex flex-1 flex-col items-center gap-12 px-8 py-16"
      style={{
        background:
          "linear-gradient(180deg, var(--color-brand-blue), var(--color-brand-blue-end))",
      }}
    >
      <h1 className="font-display text-3xl font-black uppercase italic text-white">Design System</h1>

      <Section title="Pill button">
        <PillButton color="red">Randomise</PillButton>
        <PillButton color="blue">Clear</PillButton>
        <PillButton color="yellow">Randomise</PillButton>
        <PillButton color="red" size="lg">
          Kick Off
        </PillButton>
        <PillButton color="red" size="lg" disabled>
          Kick Off
        </PillButton>
      </Section>

      <Section title="Pill input — empty state">
        <div className="flex w-full max-w-sm flex-col gap-3">
          {positions.map((position) => (
            <PillInput
              key={`empty-home-${position}`}
              position={position}
              side="home"
              value=""
              readOnly
            />
          ))}
        </div>
        <div className="flex w-full max-w-sm flex-col gap-3">
          {positions.map((position) => (
            <PillInput
              key={`empty-away-${position}`}
              position={position}
              side="away"
              value=""
              readOnly
            />
          ))}
        </div>
      </Section>

      <Section title="Pill input — filled state">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <PillInput position="ST" side="home" value="Erling Haaland" readOnly />
          <PillInput position="MID" side="home" value="Thierry Henry" readOnly />
          <PillInput position="DEF" side="home" value="Virgil van Dijk" readOnly />
          <PillInput position="GK" side="home" value="Manuel Neuer" readOnly />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <PillInput position="ST" side="away" value="Neymar" readOnly />
          <PillInput position="MID" side="away" value="Wayne Rooney" readOnly />
          <PillInput position="DEF" side="away" value="Sergio Ramos" readOnly />
          <PillInput position="GK" side="away" value="Lev Yashin" readOnly />
        </div>
      </Section>

      <Section title="Player bubble — position-code state">
        {sides.map((side) =>
          positions.map((position) => (
            <PlayerBubble key={`bubble-empty-${side}-${position}`} state="empty" side={side} position={position} />
          )),
        )}
      </Section>

      <Section title="Player bubble — initials-monogram state">
        <PlayerBubble state="filled" side="home" initials="EH" playerName="E. Haaland" />
        <PlayerBubble state="filled" side="home" initials="VvD" playerName="V. van Dijk" />
        <PlayerBubble state="filled" side="away" initials="N" playerName="Neymar" />
        <PlayerBubble state="filled" side="away" initials="LY" playerName="L. Yashin" />
      </Section>

      <Section title="Score bug">
        <ScoreBug homeTeamName="Ballerz FC" awayTeamName="One Touch United" homeScore={2} awayScore={1} />
      </Section>

      <Section title="Tab group">
        <TabGroup tabs={["Stats", "Lineups", "Timeline"]} />
      </Section>

      <Section title="Stat value pill">
        <div className="flex items-center gap-3">
          <StatValuePill value="14" side="home" />
          <span className="font-body text-sm text-white-75">Shots</span>
          <StatValuePill value="9" side="away" />
        </div>
        <div className="flex items-center gap-3">
          <StatValuePill value="58%" side="home" />
          <span className="font-body text-sm text-white-75">Possession</span>
          <StatValuePill value="42%" side="none" />
        </div>
      </Section>

      <Section title="Error chip">
        <ErrorChip message="🟨 Yellow card, keep the team name clean" />
        <ErrorChip message="🟥 Red card, that one's not making the squad" />
        <ErrorChip message="Already picked" />
      </Section>
    </main>
  );
}
