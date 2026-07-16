# Squad Up — Product Requirements Document

Version 0.7 (draft, ready to phase into a Claude Code build)
Source materials: user flow diagram (Section 1), Figma file "Squad Up" (node 68:462, page "Page 2")
Change since v0.6: resolved the Skip button behavior (jumps to final result, consistent with mid-match exit logic). No open decisions left in the spec itself, remaining work is execution: phasing this into a build order, deciding on Figma MCP access for the build session, and the section 12 sourcing/tuning tasks.

---

## 1. Overview

Squad Up is a browser-based, 5-a-side dream-team match simulator built for SuperSportBet (SBET). A user picks a Home and Away squad of 5 players each, kicks off, watches a simulated match play out through live commentary, and lands on a result and stats summary they can share.

This document translates the attached flow and Figma screens into a build-ready spec. It assumes the person building from this (Claude Code, or a dev) has no prior context on the project.

## 2. Assumed goals (confirm or edit)

I don't have stated business goals for this build, so these are working assumptions based on what the flow and screens imply. Please correct any of these before this gets used as a build brief:

- Drive engagement and return visits for SBET users around match days
- Low-friction team building (search/select, or one-tap randomise)
- Shareable results as an organic distribution loop
- Soft account creation: browsing and team-building don't require sign-in, but playing a match does

**Confirmed design principle:** simple, short learning curve, high replayability. This isn't an assumption, you've stated it directly, and it's the standard everything else (including future multiplayer ideas like a points-budget draft) should get weighed against.

## 3. Scope

**In scope:** the 10 states in the flow (Age Check, Landing Page, Team Picker, How to Play, Sign In/Up, Game Loading Screen, Live Commentary Page, End of Match Page, Match Summary Page, Share Sheet), plus a user profile/history view. That last one isn't in the Figma flow or file at all, and won't be designed by you until later, so Claude Code should scaffold it functionally now (a plain list of saved squads and past match results, no polish) so the persistence requirement (section 9) actually works end to end, then swap in real visual design once those frames exist.

**Out of scope (unless you say otherwise):** real-money betting integration, multiplayer/head-to-head against another user, admin/CMS tooling, push notifications, native apps.

## 4. User flow

1. **Confirm you're over 18** → Landing Page
2. **Landing Page**: two buttons, 'How to Play' and 'New Game' (this is the first-time entry into team building, distinct from the post-match 'Rematch' action in step 7)
   - 'How to Play' → How to Play → back into Team Picker
   - 'New Game' → Team Picker
3. **Team Picker**: build Home and Away squads → Kick Off → **Signed in?**
   - Yes → Game Loading Screen
   - No → Sign In/Up → Game Loading Screen
4. **Game Loading Screen** → **Live Commentary Page**
5. **Live Commentary Page** → **End of Match Page**
6. **End of Match Page** → **Match Summary Page**
7. **Match Summary Page** → Buttons: 'Share Results' or 'Rematch'
   - 'Share Results' → Share Sheet
   - 'Rematch' → back to Team Picker (re-enters the flow at step 3, so the signed-in check runs again on the next Kick Off, it just resolves instantly if the session is still authenticated)

**How to Play** still has no Figma frame, but now has a full draft script (section 5.3) and is no longer a blocking gap, just a voice/visual pass (see section 12). Share Sheet was undesigned at an earlier review but now has a frame (5.10 and 5.11).

## 5. Screens

Each screen below references its Figma node id for traceability back to the file.

### 5.1 Age Check (`68:463`)

- **Purpose:** legal age gate, gambling-adjacent brand compliance.
- **Layout:** centered H1, two buttons (confirm / decline), a disclaimer line beneath, responsible-gambling footer (SBET logo + footer text) pinned to the bottom of the page.
- **Interactions:** confirming over-18 proceeds to Landing Page. Declining redirects off-platform to supersport.com.
- **State:** should persist for the session (or longer) so returning users aren't re-gated every visit.

### 5.2 Landing Page (`68:476`)

- **Layout:** full-bleed background graphic, large "SBET Squad Up" logo/wordmark centered top half, tagline, two pill buttons ('How to Play', 'New Game') in the lower half.
- **Interactions:** as described in the flow above.

### 5.3 How to Play — no Figma frame, script drafted below

Still no visual frame in Figma, but the format (a tooltip-driven walkthrough over the Team Picker, not a static screen) is settled, and here's a first draft of the actual script for Claude Code to build against. Six steps, each anchored to a real element, with Next/Back and a Skip Tour option available throughout:

1. **Welcome** (anchored to the page, no specific element)
   "Welcome to Squad Up. Build two 5-a-side dream teams, current stars or all-time legends, then kick off and see who comes out on top."
2. **Position slots** (anchored to the first Home slot)
   "Every squad needs five: a Striker, two Midfielders, a Defender, and a Keeper. Tap a slot and search for any player to fill it."
3. **Randomise / Clear** (anchored to the Home side's button row)
   "In a hurry? Randomise fills the whole side for you. Clear wipes it if you want to start over."
4. **The pitch** (anchored to the pitch graphic)
   "Watch your picks land on the pitch as you build, that's your starting XI taking shape."
5. **Away side** (anchored to the Away side's team name field)
   "Now build your Away side the same way. Give both teams a name to make it personal."
6. **Kick Off** (anchored to the Kick Off button)
   "Once both squads are full, hit Kick Off. First time playing? We'll ask you to sign in so your results are saved."

This is a starting draft, worth a pass to match your voice more precisely, but it's build-ready as-is if you want to move on it now. One separate thing worth flagging: this six-step list is a content/interaction spec (what gets said, in what order), not a visual design. What the tooltip cards actually look like (card shape, pointer/arrow style, Next/Back/Skip button treatment) still needs a pass, whether from you or as a first-cut default from Claude Code using the existing design system (section 6).

### 5.4 Team Picker / Team Selection (`68:487`)

This is the most complex screen and the core of the product.

- **Layout:** H1 "Select your dream team". Three-column layout: Home side (left), pitch (center), Away side (right).
- **Each side (Home/Away):**
  - Team label ("Home" in red `#DB1D15`, "Away" in yellow `#F1C730`) + "Pick a team name" input
  - 5 player-selection rows, each a pill-shaped input: a colored position tag (ST, MID, MID, DEF, GK, in that fixed order) on the left, a text field ("Select Player") on the right. This is a search/autocomplete field, not a free text field, since it needs to resolve to a real player. **Search is never position-restricted:** any player can be picked into any slot (e.g. Cristiano Ronaldo, a natural ST/MID, can still be picked into a DEF or GK row), since real players are versatile and the user should be free to build unconventional squads. The dropdown opens the instant a field becomes active (click, tab, or a pitch-bubble click, see below) — not only after typing — showing the top-rated natural fits for that slot as a browse default; a non-empty query searches every player by name, natural fits ranked above non-fits. Each dropdown row (node `105:791`) shows the rating, the player's name, and a small subtitle line of their natural position(s) underneath (e.g. "ST" or "ST • MID"), shown on every row so an out-of-position pick reads as intentional rather than arbitrary. Playing someone out of position has a real (documented, see section 8.1) cost in the match simulation, not just cosmetic freedom. The dropdown scrolls if results exceed its max height.
  - Two buttons per side: "Randomise" (fills only the still-empty slots and, if it's empty, the team name — so a deliberately-made pick is never overwritten; if every slot and the name are already filled, it regenerates the whole side instead, since there's nothing left to "top up." Draws only from each slot's natural-fit players — unlike manual search, Randomise never produces an out-of-position squad on its own) and "Clear" (empties the side, including the name)
- **Pitch (center):** a mini 5-a-side pitch graphic showing both squads mirrored, with a circular "bubble" per player (colored by side, dashed white border) labeled by position. Bubbles should reflect what's been picked in the form on either side, live. Bubbles are also clickable — clicking one (filled or empty) jump-focuses its corresponding "Select Player" field, opening its dropdown immediately, so the pitch doubles as quick navigation into the form.
- **Primary CTA:** "Kick Off" pill button, centered below the three columns, disabled/50% opacity until both squads are complete (5/5 valid players each, per the Figma state) — see Validation below for the full gating condition, which also requires both team names.
- **Validation:** Kick Off should stay disabled until both teams have all 5 fixed slots filled per side (1 GK, 1 DEF, 2 MID, 1 ST — this is about slot completeness, not the occupant's own natural position, since any player can fill any slot per the search behavior above) **and both team names are non-empty**. Team names commit to state live, per keystroke (profanity-checked the same way on every keystroke, not just on blur — see the Profanity filter bullet below), so Kick Off enables the instant both conditions are true rather than requiring the user to click away from the name field first. Each player can only be picked once across the whole match, not just within a squad, since they're meant to represent a real person, so a player already picked (on either side) can't be picked again. If a user tries, show a small inline nudge error at that field ("Already picked") rather than a blocking modal.
- **Complete state (now designed, `70:952`, "Team Selection/Complete"):** once a slot is filled, the pill input swaps from the grey "Select Player" placeholder to the resolved player's full name, set in brand blue on white. The pitch bubble for that slot swaps from a position-code label to a 2-3 letter player-initials monogram (e.g. "EH" for Erling Haaland), still colored by side. The team name field also resolves from "Pick a team name" to the entered name (e.g. "Ballerz FC"). Once all 10 slots are filled, Kick Off drops out of its disabled/50%-opacity state into a solid, active button.
- **Data need:** the "Select Player" fields imply a searchable player database (name, position(s), club, rating) to pull from. The example roster in the "Complete" state mixes eras (Lev Yashin, Thierry Henry, Andrés Iniesta, alongside Erling Haaland and Neymar), which means this isn't just a current-season dataset, it's an all-time/legends pool, sourced without licensing anything (see the sourcing note in section 7).
- **Unmatched search fallback:** if a typed name doesn't match anything in the database, don't just block it, offer a "Use '{name}' anyway" confirmation. Confirming creates that player as a custom entry at a default rating of 65 (see section 7), so the squad-building flow never dead-ends on a missing player.
- **Profanity filter:** applies to every free-text field on this screen, both team name inputs and custom/unlisted player names (the autocomplete-matched player names don't need it, those come from the database). Team names are checked live, on every keystroke, not just on blur — a profane draft is never written to state, so the field always reflects "the last known-clean value" even mid-edit. On a blocked entry, don't use a generic error, show a small pill-shaped chip with a football-themed message, e.g. "🟨 Yellow card, keep the team name clean" or "🟥 Red card, that one's not making the squad" (shown in a single shared spot below Kick Off, not per-field — see the Team Picker implementation notes). The field doesn't submit until corrected. Needs an actual word list to check against, see the sourcing note in section 12, this is a much smaller lift than the player database (open-source profanity-filter packages exist) but still needs sourcing and a decision on language coverage (English only, or other SA languages too, given SBET's audience).

### 5.5 Sign In / Sign Up (`68:605`)

- **Layout:** centered H1, tagline, three social buttons (Continue with Facebook / Google / Apple), plus a text link "Sign In With Email".
- **Interactions:** on successful auth, return the user to the Game Loading Screen and carry the squads they already built into the match (don't make them rebuild teams after signing in).

### 5.6 Game Loading Screen (`68:621`)

- **Layout:** logo, a "Score Bug" component showing the two picked teams, a loading tagline underneath.
- **Purpose:** a transitional/loading state while the match simulation is prepared, before commentary starts.

### 5.7 Live Commentary Page (`68:634`)

- **Layout:** logo + Score Bug pinned in the header, with Mute / Pause / Skip playback controls beneath it. Below that, a scrolling commentary feed: a sequence of event rows, most are a single line, some are two-line "highlight" events (bigger moments, e.g. goals) with a headline + description.
- **Interactions:** the match plays out as a paced feed over a fixed 90-second run: two 43-second halves representing 20 in-game minutes each, plus a 4-second halftime break (43 + 43 + 4 = 90). Event density needs to be low enough that a two-line highlight card can be comfortably read at an average reading pace before the next event lands, while still feeling "action-packed" rather than sparse. That's a tuning target (see section 8), not a fixed event count yet.
- **Data:** each commentary row is a `CommentaryEvent` (minute, event type, text, optional two-line `headline`, which team it favors) generated by the match simulation, not authored by hand. Full 17-category content library and selection logic in section 8.1 step 6.
- **Sound:** the Mute button implies audio that isn't otherwise specified in Figma. Confirmed scope: an ambient crowd noise bed looping for the full 90 seconds, plus whistle stings at kickoff, halftime, second-half kickoff, and full-time, plus a crowd-cheer sting on goal events. Full cue list and timing in section 8.4.
- **Playback controls:** Mute toggles all audio (ambient bed + stings) off/on without affecting the visual feed. Pause stops the whole match progression, feed and audio both. Skip jumps straight to the final result, consistent with the mid-match exit logic below, there's no reason to fast-forward through a fixed replay when the outcome already exists.
- **Mid-match exit:** because the whole `Match` (score, scorers, every event) is generated upfront in one call and the Live Commentary Page is just a paced reveal of it, not a live simulation, closing the tab or navigating away mid-playback doesn't lose anything. Full handling in section 9.

### 5.8 End of Match Page / Match Result Screen (`68:691`)

- **Layout:** logo, large H1 (final result headline, e.g. team name + "Wins" or similar), Score Bug showing the final score.
- **Purpose:** a short beat between the live feed ending and the full summary, confirming the result.

### 5.9 Match Summary Page (`68:704`)

- **Layout:** logo, H1, two buttons ('Share Results' / 'Rematch'), Score Bug, and a tabbed panel below with three tabs: **Stats**, **Lineups**, **Timeline**.
  - Stats tab (the one built out in Figma): a row of paired stat comparisons (label center, home value left, away value right) for four stats.
  - Lineups and Timeline tabs exist as tab targets but their content isn't detailed in the file yet, likely: Lineups shows each side's 5 picked players, Timeline shows the commentary feed condensed to key events with minute markers.
- **Interactions:** 'Share Results' → Share Sheet. 'Rematch' → Team Picker (squads reset).

### 5.10 Share Image (`73:1629`) — the shareable result card

This is now designed: a portrait 1080x1350 (roughly 4:5, Instagram-post shaped) graphic, on the same brand blue gradient background, containing:
- Logo, and a dynamic result headline, e.g. "Ballerz FC Wins in a high scoring thriller!". The phrasing implies a small library of narrative descriptors ("high scoring thriller", presumably others for a narrow win, a landslide, a draw, etc.) chosen based on the final scoreline, not a single fixed template.
- The Score Bug (both team names + final score).
- Both lineups side by side, each player's pill row showing their name, and a small ball icon repeated once per goal that player scored in the simulation (a player with 3 goals shows 3 icons next to their name). Goalkeepers in the example have none.
- A condensed match stats block (shots, shots on target, possession, passes), same visual pattern as the Summary page's Stats tab.
- A footer CTA: "Think you can beat this?" plus a URL, `squadup.supersportbet.co.za`, confirming this card is meant to drive people back into the app, not just be a static trophy image.

This card is what gets generated after a match and is what the Share Sheet modal (below) previews and lets the user send out.

### 5.11 Share Sheet (`73:1779`) — now designed, implemented as a modal

There's no separate full-page route for this. The frame is effectively the Match Summary Page with a **Share Modal** (`73:1927`) overlaid on top, triggered by 'Share Results'.

- **Backdrop:** black at 50% opacity with a blur, over the Summary page content.
- **Modal contents:** a preview of the Share Image (rendered at 450x563 in the modal, smaller/cropped relative to the 1080x1350 full card, worth confirming that's intentional and not just a placeholder frame size in Figma), then a row of three icon buttons and one full-width text button:
  - White button, download icon: saves the card locally.
  - Black button: by color this reads as an X (Twitter) share action, worth confirming before wiring it up given platform icon/brand guideline requirements.
  - Green (`#25D366`) button: by color this reads as WhatsApp, same caveat as above.
  - Full-width "Close" button: dismisses the modal back to the Summary page.

Note on labeling: resolved, "Rematch" is the confirmed label for this action everywhere it appears (this modal, and the plain Match Summary Page in section 5.9, updated above). The flow diagram's original 'New Game' wording only applies to the separate first-entry button on the Landing Page (section 4, step 2).

## 6. Design system (extracted from Figma)

**Colors**
| Token | Value | Usage |
|---|---|---|
| Brand blue | `#111FA3` | primary background, "Clear" buttons, Home player bubbles |
| Brand blue gradient end | `#2F39FC` | background gradient |
| Brand red | `#DB1D15` | Home side accent, "Randomise" (home), primary CTAs |
| Brand yellow | `#F1C730` | Away side accent, "Randomise" (away) |
| White | `#FFFFFF` | input backgrounds, primary text on dark |
| White 75% | `rgba(255,255,255,0.75)` | secondary text on dark ("Pick a team name") |
| Black 60% | `rgba(0,0,0,0.6)` | placeholder text on white inputs |

**Typography**
- Display/headings: SuperSport Extra Black Italic, uppercase
- Buttons: SuperSport SD Italic, uppercase
- Position tags (ST/MID/DEF/GK): SuperSport HD Bold
- Body/input text: Inter Regular, except the Player/Pill Input field (node `105:791`) — its placeholder, typed/committed value, and dropdown row text all use SuperSport SD Regular instead, confirmed against that node directly (not italic, despite the "Pill input" bullet below having said so previously — that was stale)

**Components**
- Pill button: fully rounded (`border-radius: 999px`), `px-20 py-12`, solid fill, uppercase italic label
- Pill input: fully rounded (`~64px radius`), white fill, 48px height, colored position-tag prefix + field. Empty state shows grey placeholder text ("Select Player"), filled state shows the resolved player name in brand blue, SuperSport SD Regular. On the Share Image variant, a filled row can also carry 0-3+ small ball icons after the name (one per goal scored). The active/dropdown state (node `105:791`) shows each match as rating + name + a small natural-position subtitle underneath, divided by hairline borders, scrollable if results exceed its max height.
- Player bubble: 48px circle, dashed white 2px border, filled with team accent color. Empty state shows a position-code label (ST/MID/DEF/GK); filled state shows a 2-3 letter player-initials monogram, with a player-name caption underneath in white.
- Score Bug: reused across Loading, Live Match, Result, Summary, and the Share Image/Share Sheet, shows both team names, both scores, and the SBET logo between them.
- Tab group: pill-style segmented control (Stats / Lineups / Timeline), active tab on white, inactive on transparent
- Stat value pill: small rounded pill per stat row, colored red (home) or yellow (away) for the leading side, transparent for the trailing side, white numeral/percentage text
- Error chip (new, not in Figma yet): small pill, appears near a blocked text input on profanity-filter rejection, football-themed copy (see 5.4). Needs a visual pass, but functionally should sit close to its field and clear once the input is corrected.

**Result headline pattern**

Both the Match Result Screen and the Share Image/Share Sheet use a dynamic headline: `{Winning team name} WINS {phrase}!` for a decisive result, or a different draw-specific template when scores are level. Full phrase library and selection logic in section 8.2.

## 7. Data model (proposed)

```
Team
  id
  side: "home" | "away"
  name: string
  players: Player[5]

Player
  id
  name: string
  positions: ("GK" | "DEF" | "MID" | "ST")[] (ordered, first entry is the primary/natural position; a player is still selectable into a slot outside this list, see 5.4/8.1 — a custom/unlisted player's only entry is the slot they were created for)
  club: string
  overallRating: number (defaults to 65 for a custom/unlisted player, see the sourcing note below)
  era: "current" | "legend" (the Figma examples mix Haaland and Neymar with Yashin and Henry, so the player pool spans eras)
  source: "database" | "custom" (custom = a name typed in that didn't match the database, still playable, just at the default rating)

LineupEntry
  player: Player
  goals: number (drives both the Live Commentary events and the goal-icon count on the Share Image)

Match
  id
  homeTeam: Team
  awayTeam: Team
  events: CommentaryEvent[]
  finalScore: { home: number, away: number }
  narrativeDescriptor: string (e.g. "a high scoring thriller", drives the result headline on the Result screen and Share Image)
  status: "loading" | "live" | "finished"

CommentaryEvent
  minute: number
  type: "goal" | "chance" | "card" | "commentary"
  text: string
  side: "home" | "away" | null
  headline?: string (present only for two-line "highlight" events — goals, saves, posts, last-ditch defensive plays — see 5.7/8.1 step 6)

User
  id
  authProvider: "facebook" | "google" | "apple" | "email" (mocked for this build phase, see section 9)
  signedInAt: timestamp

SavedSquad
  id
  userId
  team: Team
  createdAt: timestamp

MatchHistory
  id
  userId
  match: Match
  playedAt: timestamp
```

**Player database sourcing:** confirmed as expansive but bounded, as many recognisable top players from the last 20 years (current and recently-retired) as reasonably achievable, plus room for a smaller set of older legends like the Figma examples (Yashin, Henry). Not a full 18k+ SoFIFA-scale export, that's more than this needs and brings the licensing problem back in. Two directions worth weighing for actually sourcing it:
- Build a simplified in-house rating (position, a small set of attributes, an overall score) from openly-licensed factual data such as Wikidata or Wikipedia player pages (career stats, honours), which are CC-BY/CC0 and don't carry the licensing risk a scraped ratings database would.
- Curate a hand-picked list (a few thousand current and legendary players) rather than attempting full league-by-league coverage, trading exhaustiveness for a clean, low-effort data source.

**Fallback rule:** the "Select Player" field isn't strictly limited to database matches. If someone types a name that doesn't resolve to an entry, they can still confirm and play with it, that player is created as a `source: "custom"` entry with a default `overallRating` of 65. This needs a small UX addition on the Team Picker (5.4): when a search comes back empty, offer a "Use '{typed name}' anyway" confirmation rather than just blocking the field.

This is still real research/build work, the schema and fallback logic above are ready for Claude Code, but actually populating the database is closer to its own content workstream than a quick data import.

## 8. Match simulation logic

The core mechanic that doesn't exist in the Figma file at all. Here's a concrete first version for Claude Code to build and then tune.

### 8.1 Outcome model

A standard expected-goals (Poisson) model. It's the same approach real football analytics and betting models use, it's simple to implement, and it naturally produces varied, believable scorelines (mostly 0-3 goals a side, occasional high-scoring outliers) without any hand-scripted logic.

**Explicit requirement:** the better squad should win more often, but never be guaranteed to win. This falls out of the model below automatically (a higher λ means more expected goals, not a fixed outcome, so a weaker squad can still upset a stronger one on a lucky roll), but it's worth stating outright as a requirement, not just an implementation detail, so it doesn't get "simplified" into a deterministic highest-rating-wins comparison later. A quick sanity check once this is built: simulate the same lopsided matchup a few hundred times and confirm the weaker squad wins a small but non-zero share.

0. **Out-of-position penalty (SPEC.md 5.4/7):** since a slot's occupant doesn't have to have that slot's position in their `positions` list, compute an *effective rating* for each of the 5 slots before anything else: `effectiveRating = occupant.overallRating - (occupant.positions.includes(slotPosition) ? 0 : 10)`. Flat 10 points, binary (in-position vs. not) rather than graduated by "how far" the position is — the 4-bucket taxonomy (GK/DEF/MID/ST) has no clean notion of positional distance to graduate against, so this is a deliberate simplification, not a lost-quality shortcut. Applies uniformly to all 5 slots, GK included (no special-casing) — a MID or ST played at GK is legal (search is never blocked, section 5.4) but genuinely costly: `10 * 1.2 / 2.2 ≈ 5.5` defense points against the current stub's natural-GK rating spread of only ~4 points. Every `.rating` reference in steps 1-5 below means this effective rating, not the raw `overallRating` — including step 4's scorer-priority hierarchy and step 5's stats derivation, so a striker who's rated down for playing out of position doesn't still get prioritized as top scorer off their raw rating.
1. **Squad ratings → attack/defense scores**, weighting the positions that matter most for each:
   - `attack = (ST.rating * 1.5 + MID1.rating + MID2.rating) / 3.5`
   - `defense = (GK.rating * 1.2 + DEF.rating) / 2.2`
2. **Expected goals (λ) for each side**, attack vs. the opponent's defense, scaled by a tunable base rate (start at `1.3`, roughly a real-world average goals-per-team-per-match, and adjust from playtesting):
   - `λ_home = baseRate * (attack_home / defense_away)`
   - `λ_away = baseRate * (attack_away / defense_home)`
3. **Sample actual goals** for each side from a Poisson distribution using that λ. This is the step that gives natural variety, sometimes a 0-0, sometimes a 4-3, weighted realistically by how strong each squad actually is. Cap goals at a sane maximum per side (e.g. 8) to avoid absurd outliers.
4. **Assign each goal a minute** (1-90, mapped onto the 43s/43s/4s real-time structure from section 5.7) and a **scorer**, using the previously agreed likelihood hierarchy: the squad's single highest-rated player first, then remaining Strikers, then Midfielders, then Defenders, then the Goalkeeper (rare, still possible). "Strikers"/"Midfielders"/etc. here means **whoever occupies that slot**, not the occupant's own `positions` list — the attack/defense formula above is already slot-driven, so the scorer hierarchy has to be pinned the same way or it stops matching the score it's describing.
5. **Derive match stats** (shots, shots on target, possession%, passes) from the same attack/defense ratios rather than simulating them event by event, e.g. `possession% ≈ attack_home / (attack_home + attack_away)`, scaled shots proportional to λ. Keeps the Stats tab and Share Image consistent with the scoreline without extra simulation work.
6. **Fill remaining commentary slots** with the full 17-category commentary library (raw template content lives in `lib/simulation/commentaryTemplates.ts`, selection/fill logic in `lib/simulation/events.ts` — not duplicated here):
   - **Four guaranteed fixed-point events** — kickoff (minute 1), halftime (minute `HALF_MINUTES`=20), second-half kickoff (minute 21), full-time (minute `MATCH_MINUTES`=40) — always present exactly once each, at minutes reserved so no goal or filler event can land on them. Halftime/second-half-kickoff reference the scoreline as it stood at the break, full-time the final scoreline.
   - **Two-level weighted selection** for every other slot: an outer roll between `chance` (35%) / `card` (15%) / `commentary` (50%, unchanged from the original 35/15/50 split), then an inner weighted pick among that type's sub-categories — `chance`: shot off target (40%) / shot saved (30%) / off the post (15%) / last-ditch defensive play (15%, favors the *defending* side, a deliberate flip from the other three which favor the shooter's side); `commentary`: early buildup (40%) / foul, no card (20%) / corner won (15%) / stat-form flavor (15%), plus late-game tension (10%) when eligible.
   - **Late-game tension** only enters the `commentary` pool when the scoreline is within 1 goal of level *and* the slot's minute falls in the last 8 of the 40 simulated minutes ("closing stages").
   - **Goal variant selection:** ~70% of goals are assisted (a team-move or headed/set-piece strike, weighted by the scorer's slot position from step 0/4 above — DEF/GK scorers skew toward the headed/set-piece variant, ST/MID scorers skew toward the team-move variant), the remaining ~30% are a solo individual-strike goal with no assister.
   - Every category can open with a `**bold** headline` span, rendered as a two-line highlight card (5.7) — saves, posts, and last-ditch defensive plays get this treatment now too, not just goals.
   - Fill at random minutes (goals and filler both avoid the four reserved minutes above), slightly biased toward the side with higher attack, until the total event count lands in the 20-28 range from section 5.7/8.3's pacing target.

### 8.2 Result narrative library

The headline needs two different templates, since a draw has no "winner":

- **Decisive result:** `{Winning team} WINS {phrase}!`
- **Draw:** `{Team A} AND {Team B} {phrase}!`

Selection logic: check for a draw first. Otherwise pick a bucket from goal margin (Narrow = 1, Comfortable = 2-3, Landslide = 4+), then check for a special-moment override (hat-trick, or a goal in the last 2 game-minutes of the match) which takes priority over the generic bucket when true. Within whichever bucket applies, pick a phrase at random from its bank. With this many phrases split across margin/volume buckets, repeating the same headline twice in 10 plays is unlikely, expand any bank further if playtesting shows repeats.

**Narrow win** (margin = 1): "IN A NAIL-BITER" / "BY THE SLIMMEST OF MARGINS" / "IN A CAGEY AFFAIR" / "AFTER A TENSE BATTLE" / "IN A TIGHT ONE" / "ON A KNIFE'S EDGE"

**Comfortable win** (margin 2-3): "IN CONVINCING FASHION" / "WITH ROOM TO SPARE" / "IN STYLE" / "COMFORTABLY" / "WITH AUTHORITY" / "IN CONTROL FROM START TO FINISH"

**Landslide** (margin 4+): "IN A LANDSLIDE" / "IN A ROUT" / "IN A MASTERCLASS" / "WITHOUT BREAKING A SWEAT" / "IN EMPHATIC FASHION" / "IN A ONE-SIDED THRILLER"

**High-scoring flavor** (total goals ≥ 5, can substitute into any margin bucket): "IN A HIGH-SCORING THRILLER" / "IN A GOAL FEST" / "IN AN ATTACKING SHOWCASE" / "IN A SEVEN-GOAL SPECTACLE" (swap the number for the actual total) / "IN A SHOOTOUT"

**Low-scoring flavor** (total goals ≤ 2): "IN A DEFENSIVE MASTERCLASS" / "IN A GRIND" / "IN A LOW-SCORING AFFAIR" / "ON THE BACK OF A SOLID DEFENSE"

**Draw:** "SHARE THE SPOILS" / "PLAY OUT A DRAW" / "CAN'T BE SEPARATED" / "BATTLE TO A STALEMATE" / "SPLIT THE POINTS" / "END IT ALL SQUARE"

**Special overlay, hat-trick** (overrides the generic bucket when a player scores 3+): "AS {Player} BAGS A HAT-TRICK!" / "BEHIND A {Player} HAT-TRICK MASTERCLASS!" / "AS {Player} STEALS THE SHOW WITH THREE!"

**Special overlay, last-gasp winner** (goal in the final 2 game-minutes): "WITH A LATE, LATE WINNER!" / "AT THE DEATH!" / "WITH A DRAMATIC LAST-MINUTE STRIKE!"

### 8.3 Pacing and output

- **Match structure:** two simulated 20-minute halves, run in 43 real seconds each, with a 4-second halftime break (90 seconds total, fixed).
- **Pacing:** roughly 20-28 total commentary events across the 90 seconds (mix of single-line and two-line cards), giving an average dwell of ~3-4.5 seconds per event. Retuned up from an initial 8-14/6-11s pass after playtesting found that range left too much dead air; still a tuning target to keep adjusting, not a hard requirement.
- **Output:** a `Match` object (score, narrative descriptor, and ordered `CommentaryEvent[]`) that the Live Commentary Page, the Timeline tab, and the Share Image all consume from the same source of truth.

### 8.4 Audio cues

Confirmed scope: ambient crowd noise plus sound effects, toggled together by Mute (section 5.7).

- **Ambient bed:** a looping crowd-noise track, playing continuously from kickoff to full-time (pauses during the 4-second halftime break along with everything else).
- **Whistle stings:** kickoff (t=0s), halftime (t=43s), second-half kickoff (t=47s, after the 4-second break), full-time (t=90s). These line up exactly with the match structure in section 8.3.
- **Goal sting:** a crowd cheer/roar layered in on top of the ambient bed whenever a `CommentaryEvent` of type `"goal"` fires.
- **Sourcing:** same constraint as the player database, free to use without licensing cost. Royalty-free/CC0 sound-effect libraries (e.g. Pixabay Audio, Mixkit Sound Effects, Freesound.org filtered to CC0) cover all of the above without needing anything paid or attributed. This is a much smaller sourcing task than the player database, maybe half a dozen short clips total, but still needs doing before it can be wired in (see section 12).

## 9. Auth

- Team building (Team Picker) is accessible without sign-in.
- Kick Off triggers the signed-in check. If not signed in, the user is sent to Sign In/Up and, on success, continues to the Game Loading Screen with the squads they already built intact.
- Once signed in for the session, subsequent 'Rematch' loops shouldn't re-prompt for sign-in.
- **For this build phase, auth is mocked** (enough to demo the full flow, not real Facebook/Google/Apple/Email OAuth). Build it behind a simple auth interface (a `login(provider)` / `getSession()` abstraction) so the mock implementation can be swapped for real OAuth providers later without touching the screens that call it.
- **Persistence:** built squads and match results save to a user profile/history. There's no design for this view yet, you'll design those frames later, so Claude Code should scaffold it functionally now (plain list UI is fine for v1) so the feature actually works end to end. At minimum this implies `SavedSquad` and `MatchHistory` records tied to a `User`, both listed in the data model below.
- **Mid-match exit:** since the `Match` object (full score, scorer, and event list) is generated in one shot before playback starts (section 8.3), persist it the moment it's created, not when playback finishes. If the user closes the tab or navigates away mid-commentary and comes back, skip re-playing the feed and drop them straight on the result (End of Match Page or Summary), since the outcome already exists and re-watching a fixed replay adds nothing. No separate "abandoned match" state needed, a match is either generated (and therefore has a real result to show) or it doesn't exist yet.

## 10. Non-functional requirements

- **Responsive:** confirmed as a requirement, but the Figma file is 1440px desktop-only with no mobile frames, so the mobile/tablet layout is a design decision Claude Code needs to make, not something to lift from the file. A few screens will need real rethinking rather than a simple reflow:
  - Team Picker (5.4): the three-column Home / Pitch / Away layout doesn't fit a phone width. Likely needs to stack (e.g. Home squad, then pitch, then Away squad, or a tabbed Home/Away view with the pitch as a shared visual anchor).
  - Score Bug: appears at a fixed width (708-806px) across four screens, needs a compact variant.
  - Match Summary / Share Image: the two-column lineup and stats block will likely need to stack to one column.
  Treat these as the mobile layout needing its own lightweight design pass, not a pure CSS breakpoint exercise.
- Accessibility: pill inputs and tab controls should be keyboard-navigable and screen-reader labeled, since none of that is specified visually in Figma.

## 11. Suggested tech stack for Claude Code

The Figma export for this file resolves naturally to React + Tailwind (component structure, utility classes, and design tokens all map cleanly). Suggested starting point:

- Next.js (or plain Vite + React) with Tailwind CSS, so design tokens above become the Tailwind theme, and Tailwind's responsive breakpoints handle the mobile layout work above
- Client-side state (Context or a small store like Zustand) to carry squad selections and match state across the Team Picker → Loading → Live → Result → Summary chain
- A dedicated module for the match simulation logic (section 8), kept separate from UI so it can be tested and tuned independently
- An auth interface/abstraction (section 9) so the current mock auth can be swapped for real OAuth providers later without reworking the screens
- An audio layer (native Web Audio API, or a thin wrapper like Howler.js) for the ambient bed and whistle/goal stings in section 8.4, with a single mute flag gating all of it

## 12. Remaining action items

Everything that was an open decision is now answered. What's left is execution work, not questions:

1. **How to Play voice pass:** the six-step script (5.3) is a first draft, worth a pass to match your voice before it's final, and the tooltip cards themselves still need a visual design (yours, or a first-cut default from Claude Code).
2. **Player database build-out:** the schema and fallback rule are ready (section 7), but actually sourcing and populating an expansive, license-free player list (last 20 years of top players, plus legends) is a real content workstream to plan separately from the app build.
3. **Profile/history frames:** Claude Code scaffolds this functionally now; swap in your visual design once those frames exist.
4. **Share icon brand compliance:** pull the current X and WhatsApp brand guidelines before shipping those two buttons.
5. **Playtest and tune:** the outcome model's base rate constant (`1.3`), the commentary event count (20-28) and category weights (8.1 step 6), and the narrative phrase banks (8.2) are all starting points, expect to adjust each once there's a working build to actually play.
6. **Profanity filter word list:** needs sourcing (open-source profanity-filter packages exist, this is a small lift), plus a decision on language coverage beyond English given SBET's audience (see 5.4).
7. **Sound effects:** needs sourcing from a royalty-free/CC0 library, roughly half a dozen short clips (ambient crowd bed, kickoff/halftime/full-time whistles, goal cheer), see section 8.4.

## 13. Screen reference map

| Screen | Figma node | Flow step |
|---|---|---|
| Age Check | `68:463` | Confirm you're over 18 |
| Landing Page | `68:476` | Landing Page |
| Team Selection | `68:487` | Team Picker |
| Sign In/Sign Up | `68:605` | Sign In/Up |
| Loading Screen | `68:621` | Game Loading Screen |
| Live Match Page | `68:634` | Live Commentary Page |
| Match Result Screen | `68:691` | End of Match Page |
| Match Summary Page | `68:704` | Match Summary Page |
| Team Selection/Complete (filled state) | `70:952` | Team Picker, complete state |
| Share Image (result card) | `73:1629` | generated on match end, previewed in Share Sheet |
| Share Sheet (modal over Summary page) | `73:1779` (modal at `73:1927`) | Share Sheet |
| How to Play | not in file | How to Play |

Figma file: https://www.figma.com/design/HNoSCSlGQpPsSJheVrkojZ/Squad-Up?node-id=68-462

## 14. Future: multiplayer considerations

Out of scope for this build. Recorded here so decisions made now don't box in live head-to-head or league modes later.

- **Determinism:** the outcome model in section 8.1 should be a pure function, `simulateMatch(homeSquad, awaySquad, seed) → Match`, even though solo mode doesn't need reproducibility. That's what lets a future server run one simulation that multiple clients can watch identically, without rebuilding the engine. No cost to build it this way now.
- **Snake draft, confirmed direction for all multiplayer modes:** live head-to-head and leagues should use a snake draft (players pick one at a time, pick order reverses each round), not simultaneous free selection. That's what stops both drafts converging on the same "best" squad, and it's a natural fit for the position-slot structure that already exists in the Team Picker.
- **Points budget / squad constraint:** still just an idea, needs more thought before it's a requirement. The real tension to resolve: any cost curve or salary cap adds a layer of strategy that cuts against the confirmed "simple, short learning curve" principle in section 2. Worth prototyping against actual playtesting once multiplayer is in scope, rather than deciding in the abstract now.
- **Auth becomes a hard prerequisite, not a nice-to-have.** Mocked auth is fine for this build. A live draft, a leaderboard, or league standings all assume a signed-in user is a real, persistent identity, so real OAuth needs to land before any multiplayer feature starts, not alongside it.
