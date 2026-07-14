import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { PillButton } from "@/components/PillButton";
import { TextInput } from "@/components/TextInput";
import { TeamInput } from "@/components/TeamInput";
import { PlayerInput, type PlayerOption } from "@/components/PlayerInput";
import { PlayerBubble } from "@/components/PlayerBubble";
import { Field } from "@/components/Field";
import { CommentaryEventRow } from "@/components/CommentaryEventRow";
import { ScoreBug } from "@/components/ScoreBug";
import { Timer, type TimerState } from "@/components/Timer";
import { TabPicker } from "@/components/TabPicker";
import { StatLine } from "@/components/StatLine";
import { ErrorChip } from "@/components/ErrorChip";
import type { Position } from "@/components/types";

const positions: Position[] = ["ST", "MID", "DEF", "GK"];
const timerStates: TimerState[] = ["default", "half-time", "full-time", "paused"];
const headingLevels = [1, 2, 3, 4, 5, 6] as const;
const bodyTextSizes = ["large", "medium", "regular", "small"] as const;
const superSportWeights = ["extrabold", "bold", "normal"] as const;
const interWeights = ["extrabold", "bold", "semibold", "medium", "normal", "light"] as const;
const buttonStyles = ["primary", "secondary", "tertiary", "link"] as const;
const buttonVariants = [
  { size: "regular", disabled: false },
  { size: "regular", disabled: true },
  { size: "small", disabled: false },
  { size: "small", disabled: true },
] as const;
const samplePlayerOptions: PlayerOption[] = [
  { id: "1", name: "Erling Haaland", rating: 93, positions: ["ST"] },
  { id: "2", name: "Thierry Henry", rating: 91, positions: ["ST", "MID"] },
  { id: "3", name: "Lionel Messi", rating: 99, positions: ["ST", "MID"] },
  { id: "4", name: "Cristiano Ronaldo", rating: 98, positions: ["ST", "MID"] },
  { id: "5", name: "Ivan Toney", rating: 78, positions: ["ST"] },
];

function DemoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12l4 4L19 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex w-full max-w-4xl flex-col gap-4">
      <Heading level={5}>{title}</Heading>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-black/10 p-6">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="flex flex-1 flex-col items-center gap-12 px-8 py-16">
      <Heading level={1}>Design System</Heading>

      <Section title="Typography — headings">
        <div className="flex w-full flex-col gap-6">
          {headingLevels.map((level) => (
            <Heading key={level} level={level}>
              Heading {level}
            </Heading>
          ))}
        </div>
      </Section>

      <Section title="Typography — text">
        <div className="flex w-full flex-col gap-8">
          {bodyTextSizes.map((size) => (
            <div key={size} className="flex flex-col gap-2">
              {superSportWeights.map((weight) => (
                <Text key={weight} size={size} weight={weight}>
                  {`Text ${size} — ${weight}`}
                </Text>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-2">
            {interWeights.map((weight) => (
              <Text key={weight} size="tiny" weight={weight}>
                {`Text tiny — ${weight}`}
              </Text>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Pill button">
        <div className="flex w-full flex-col gap-10">
          {buttonStyles.map((buttonStyle) => (
            <div key={buttonStyle} className="flex flex-col gap-3">
              <Text size="small" weight="bold" className="capitalize">
                {buttonStyle}
              </Text>
              <div className="flex flex-col gap-3">
                {buttonVariants.map(({ size, disabled }) => (
                  <div key={`${size}-${disabled}`} className="flex flex-wrap items-center gap-3">
                    <PillButton buttonStyle={buttonStyle} size={size} disabled={disabled}>
                      Button
                    </PillButton>
                    <PillButton
                      buttonStyle={buttonStyle}
                      size={size}
                      disabled={disabled}
                      icon={<DemoIcon />}
                      iconPosition="leading"
                    >
                      Button
                    </PillButton>
                    <PillButton
                      buttonStyle={buttonStyle}
                      size={size}
                      disabled={disabled}
                      icon={<DemoIcon />}
                      iconPosition="trailing"
                    >
                      Button
                    </PillButton>
                    <PillButton
                      buttonStyle={buttonStyle}
                      size={size}
                      disabled={disabled}
                      icon={<DemoIcon />}
                      iconPosition="only"
                      aria-label="Button"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Text input">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <TextInput placeholder="Placeholder" readOnly />
          <TextInput value="Filled value" readOnly />
          <TextInput placeholder="Placeholder" leftIcon={<DemoIcon />} rightIcon={<DemoIcon />} readOnly />
        </div>
      </Section>

      <Section title="Team input">
        <div className="flex w-full max-w-xs flex-col gap-3 rounded-2xl bg-brand-blue p-6">
          <TeamInput side="home" value="" readOnly />
          <TeamInput side="home" value="Ballerz FC" readOnly />
        </div>
        <div className="flex w-full max-w-xs flex-col gap-3 rounded-2xl bg-brand-blue p-6">
          <TeamInput side="away" value="" readOnly />
          <TeamInput side="away" value="One Touch United" readOnly />
        </div>
      </Section>

      <Section title="Player input — empty state">
        <div className="flex w-full max-w-sm flex-col gap-3">
          {positions.map((position) => (
            <PlayerInput
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
            <PlayerInput
              key={`empty-away-${position}`}
              position={position}
              side="away"
              value=""
              readOnly
            />
          ))}
        </div>
      </Section>

      <Section title="Player input — filled state">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <PlayerInput position="ST" side="home" value="Erling Haaland" readOnly />
          <PlayerInput position="MID" side="home" value="Thierry Henry" readOnly />
          <PlayerInput position="DEF" side="home" value="Virgil van Dijk" readOnly />
          <PlayerInput position="GK" side="home" value="Manuel Neuer" readOnly />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-3">
          <PlayerInput position="ST" side="away" value="Neymar" readOnly />
          <PlayerInput position="MID" side="away" value="Wayne Rooney" readOnly />
          <PlayerInput position="DEF" side="away" value="Sergio Ramos" readOnly />
          <PlayerInput position="GK" side="away" value="Lev Yashin" readOnly />
        </div>
      </Section>

      <Section title="Player input — active state (dropdown)">
        <div className="flex w-full max-w-sm flex-col gap-3 pb-64">
          <PlayerInput
            position="ST"
            side="home"
            value=""
            active
            options={samplePlayerOptions}
            readOnly
          />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-3 pb-64">
          <PlayerInput
            position="ST"
            side="away"
            value=""
            active
            options={samplePlayerOptions}
            readOnly
          />
        </div>
      </Section>

      <Section title="Player bubble — position-code state">
        {positions.map((position) => (
          <PlayerBubble key={`bubble-empty-${position}`} state="empty" position={position} />
        ))}
      </Section>

      <Section title="Player bubble — initials-monogram state">
        <PlayerBubble state="filled" side="home" initials="EH" playerName="E. Haaland" />
        <PlayerBubble state="filled" side="home" initials="VvD" playerName="V. van Dijk" />
        <PlayerBubble state="filled" side="away" initials="N" playerName="Neymar" />
        <PlayerBubble state="filled" side="away" initials="LY" playerName="L. Yashin" />
      </Section>

      <Section title="Field — empty">
        <div className="w-full max-w-3xl">
          <Field />
        </div>
      </Section>

      <Section title="Field — filled">
        <div className="w-full max-w-3xl">
          <Field
            home={{
              gk: { initials: "MN", playerName: "M. Neuer" },
              def: { initials: "VvD", playerName: "V. van Dijk" },
              mid1: { initials: "AI", playerName: "A. Iniesta" },
              mid2: { initials: "TH", playerName: "T. Henry" },
              st: { initials: "EH", playerName: "E. Haaland" },
            }}
            away={{
              st: { initials: "N", playerName: "Neymar" },
              mid1: { initials: "RvP", playerName: "R. van Persie" },
              mid2: { initials: "WR", playerName: "W. Rooney" },
              def: { initials: "SR", playerName: "S. Ramos" },
              gk: { initials: "LY", playerName: "L. Yashin" },
            }}
          />
        </div>
      </Section>

      <Section title="Score bug">
        <ScoreBug
          homeTeamName="Ballerz FC"
          awayTeamName="One Touch United"
          homeScore={2}
          awayScore={1}
          time="12:34"
        />
        <ScoreBug
          homeTeamName="Pick A Team Name"
          awayTeamName="Pick A Team Name"
          showScores={false}
          showTimer={false}
        />
      </Section>

      <Section title="Timer">
        {timerStates.map((state) => (
          <Timer key={state} state={state} time="12:34" />
        ))}
      </Section>

      <Section title="Commentary event row">
        <div className="flex w-full max-w-xl flex-col gap-4">
          <CommentaryEventRow variant="default" minute={12} text="Insert game commentary here." />
          <CommentaryEventRow
            variant="keyMoment"
            minute={21}
            side="home"
            headline="Key Moment"
            text="Insert game commentary here."
          />
          <CommentaryEventRow
            variant="keyMoment"
            minute={34}
            side="away"
            headline="Key Moment"
            text="Insert game commentary here."
          />
          <CommentaryEventRow variant="halfTime" />
          <CommentaryEventRow variant="default" minute={46} text="Insert game commentary here." />
        </div>
      </Section>

      <Section title="Tab picker">
        <div className="flex w-full flex-col items-start gap-3">
          <TabPicker tabs={["Stats", "Lineups", "Timeline"]} defaultTab="Stats" />
          <TabPicker tabs={["Stats", "Lineups", "Timeline"]} defaultTab="Lineups" />
          <TabPicker tabs={["Stats", "Lineups", "Timeline"]} defaultTab="Timeline" />
        </div>
      </Section>

      <Section title="Stat line">
        <div className="flex w-full max-w-md flex-col gap-3">
          <StatLine stat="Shots" homeValue={0} awayValue={0} />
          <StatLine stat="Shots On Target" homeValue={5} awayValue={4} leading="home" />
          <StatLine stat="Possession" homeValue={4} awayValue={5} leading="away" />
        </div>
      </Section>

      <Section title="Error chip">
        <ErrorChip variant="foul" message="Already picked" />
        <ErrorChip variant="yellowCard" message="Keep the team name clean" />
        <ErrorChip variant="redCard" message="That one's not making the squad" />
      </Section>
    </main>
  );
}
