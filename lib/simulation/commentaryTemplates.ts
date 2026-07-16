// Commentary template content — SPEC.md 8.1 step 6 / 5.7. Sourced verbatim
// from the product-owner-provided "Squad Up — Commentary Templates" doc
// (extracted from a real match transcript, genericized to what this engine
// can actually supply: max 2 named actors per line, only tracked stats,
// no stadium names, no stoppage-time math). Pure data, no logic — see
// events.ts for the fill/parse mechanism and selection logic that consumes
// these.
//
// Convention: a template may open with a **bold headline span** — anything
// before the closing `**` renders as the two-line "highlight" card's
// headline, the rest as its description. A token written in ALL CAPS
// (e.g. {SCORER}) is uppercased when filled; the same token in lowercase
// (e.g. {scorer}) is filled as-is. This mirrors the source doc's own
// authoring convention exactly — every uppercase token in the source sits
// inside a bold span, and vice versa, with no exceptions.

// 1. Kickoff — fires once, t=0. type: "commentary".
export const KICKOFF_TEMPLATES = [
  "Referee blows the whistle, we're underway!",
  "Here we go! {team} get us started.",
  "Kicked off, and {team} have first touch of the match.",
  "Underway! Two squads, one winner, let's find out who.",
  "And we're off. {team} to get the ball rolling.",
  "The whistle goes, {team} vs {opponent} is live.",
  "First whistle of the day, {team} setting the tempo early.",
  "Game on! Let's see what these two squads are made of.",
  "{team} get us started, and this one is finally underway.",
  "Whistle blown, ball's rolling, {team} against {opponent} begins.",
];

// 2. Early general buildup (no clear chance) — type: "commentary".
export const BUILDUP_TEMPLATES = [
  "{team} start brightly, working the ball patiently out from the back.",
  "Even start, both sides feeling each other out.",
  "{player} is showing well for {team}, always available for the ball.",
  "{team} are enjoying the better of the possession here, without carving out a clear chance yet.",
  "Scrappy passage of play, neither side able to find a rhythm.",
  "{opponent} sit deep, content to let {team} have the ball for now.",
  "Not much between these two sides so far, feels like a chess match.",
  "{team} probing patiently, looking for a way through.",
  "{player} pulling the strings for {team} in midfield right now.",
  "Cagey stuff early on, both sides happy to bide their time.",
];

// 3. Foul, no card — type: "commentary". {player} = fouled/victim (on
// {team}, awarded the free kick), {player2} = fouling player (on {opponent}).
export const FOUL_TEMPLATES = [
  "{player2} leaves one on {player}, nothing in it but a message sent.",
  "Free-kick to {team} after {player2} catches {player} late.",
  "{player} goes down under a challenge from {player2}. Free-kick given.",
  "Feisty coming-together there between {player} and {player2}, the referee lets it go with just a free-kick.",
  "Needless foul from {player2}, gives {team} a free-kick in a good area.",
  "{player} wins the free-kick after {player2} was a fraction late.",
  "That's a foul all day, {player2} penalized for the challenge on {player}.",
  "Cheap free-kick to give away there from {player2}.",
  "{player} tumbles under a challenge from {player2}, referee blows for the foul.",
  "{opponent} pick up a foul as {player2} loses patience with {player}.",
];

// 4. Yellow card — type: "card". {player2} = carded/offending player (on
// {team}, the punished side), {player} = their victim (on {opponent}).
export const YELLOW_CARD_TEMPLATES = [
  "{player2} is the first name in the book, a poorly timed challenge on {player}.",
  "Yellow card for {player2}. No complaints there.",
  "{player2} goes into the book after hauling back {player}.",
  "Booking for {player2}, {team} down to some cooler heads needed now.",
  "That's a booking for {player2}, and a deserved one.",
  "{player2} sees yellow for a late one on {player}.",
  "The referee reaches for his pocket, {player2} is cautioned.",
  "Card out for {player2}, {opponent} will need to be careful now.",
  "{player2} into the referee's book, no arguing with that one.",
  "Yellow shown to {player2} after that challenge on {player}.",
];

// 5. Corner won, no immediate shot — type: "commentary".
export const CORNER_TEMPLATES = [
  "{team} force a corner after good pressure from {player}.",
  "Corner to {team}, {player} did well to win it.",
  "{opponent} scramble it behind for a corner, {team} sensing an opportunity.",
  "{player} wins another corner for {team}, they're starting to turn the screw.",
  "Deflected behind, corner to {team}.",
  "{team} win a corner, {player} to deliver.",
  "{opponent} concede a corner under pressure from {player}.",
  "Set-piece opportunity for {team} as {player} forces a corner.",
  "{player} charges down the flank and wins a corner for his side.",
  "Corner kick coming up for {team}, good work from {player} in the buildup.",
];

// 6. Shot off target / wide — type: "chance". Favors the shooter's team.
export const SHOT_OFF_TARGET_TEMPLATES = [
  "**{PLAYER} GOES CLOSE!** {player} tries his luck from distance, and it arrows just wide of the post!",
  "Effort from {player}, but it drifts well off target.",
  "{player} pulls the trigger, straight into the side netting, no goal.",
  "{player} shoots! Wide of the mark, but a warning shot from {team}.",
  "Ambitious effort from {player}, never really troubling {keeper}.",
  "{player} lets fly, but it sails harmlessly over the bar.",
  "Half-chance for {player}, but the finish lets him down.",
  "{player} drags his shot wide when he might have done better.",
  "Good ball, poor finish, {player}'s effort flashes just past the far post.",
  "{player} has a go from range, but it's never troubling the target.",
];

// 7. Shot saved — type: "chance". Shooter from one side, {keeper} from the other.
export const SHOT_SAVED_TEMPLATES = [
  "**{KEEPER} MAKES THE STOP!** {player} forces a smart save out of {keeper}, low to his right.",
  "{player} tests {keeper}, who does well to tip it away.",
  "Good effort from {player}, but {keeper} is equal to it.",
  "**ANOTHER SAVE FROM {KEEPER}!** {player} tries again, and again {keeper} says no.",
  "{keeper} is alert, palming away a firm effort from {player}.",
  "Big save! {keeper} denies {player} at the near post.",
  "{player} thought he had that one, but {keeper} gets down well to save.",
  "Fine stop from {keeper}, keeping out {player}'s goalbound effort.",
  "{keeper} isn't going to be beaten there, comfortable save from {player}'s strike.",
  "{player} goes for goal, {keeper} says not today.",
];

// 8. Off the post / crossbar — type: "chance". Favors the shooter's team.
export const OFF_THE_POST_TEMPLATES = [
  "**OFF THE POST!** {player}'s header cannons back off the frame of the goal, agonisingly close for {team}.",
  "**SO CLOSE!** {player} strikes it true, but it comes back off the crossbar!",
  "{player} will wonder how that stayed out, ringing the post and away to safety.",
  "**INCHES AWAY!** {player}'s effort cracks the woodwork, {opponent} breathe a sigh of relief.",
  "That's the width of the post between {team} and the lead, {player} denied by the frame of the goal.",
  "{player} strikes the bar! Millimetres from a goal there.",
  "Unlucky for {player}, that one comes back off the post.",
  "{player} will be gutted, off the crossbar and away.",
  "So nearly there, {player}'s shot kisses the post on its way past.",
  "{player} can't believe it, cannons off the bar with the goal at his mercy.",
];

// 9. Last-ditch defensive play — type: "chance". Favors the DEFENDING team
// (a deliberate flip from the other "chance" categories above).
export const DEFENSIVE_PLAY_TEMPLATES = [
  "**WHAT A TACKLE FROM {PLAYER}!** {opponent} looked certain to break through, until {player} produced a perfectly timed challenge!",
  "**HUGE BLOCK!** {player} throws himself in front of the shot, {team} survive.",
  "Last-ditch stuff from {player}, snuffing out what looked a certain chance for {opponent}.",
  "**CRUCIAL INTERVENTION!** {player} reads it perfectly and clears the danger.",
  "{player} slides in at the perfect moment, {opponent}'s chance is gone.",
  "Superb defending from {player}, {team} live to fight on.",
  "{player} gets across just in time to deny {opponent} a clear sight of goal.",
  "That's a goal-saving challenge from {player} right there.",
  "{opponent} thought they were through, but {player} has other ideas.",
  "Brilliant recovery run from {player}, snuffing out the danger.",
];

// 10. Stat/form flavor — type: "commentary". {player} = the team's standout (highest-rated slot).
export const STAT_FLAVOR_TEMPLATES = [
  "{team} lead the possession stakes so far, {possession}% of the ball to {opponent}'s share.",
  "{player} has been at the heart of everything for {team} today.",
  "{team} have had the better of the chances, {shotsOnTarget} shots on target to {opponent}'s tally.",
  "Discipline could be an issue for {team}, already into the book once this half.",
  "{player} is enjoying one of his better performances in a {team} shirt today.",
  "{team} are dominating territory, controlling the game so far.",
  "{opponent} have barely had a sniff, {team} in complete control of proceedings.",
  "{player} has been a constant threat for {team} all match.",
  "{team} will be pleased with how they've matched up against {opponent} so far.",
  "{opponent} need to find another gear if they're going to get anything from this one.",
];

// 11. Halftime — fires once at the HALF_MINUTES boundary. type: "commentary".
export const HALFTIME_TEMPLATES = [
  "That's halftime. {teamScore}-{opponentScore}, can either side find a winner in the second period?",
  "We go in at the break, {teamScore}-{opponentScore}.",
  "Halftime whistle. {team} will have things to think about at {teamScore}-{opponentScore}.",
  "That's the break. {teamScore}-{opponentScore}, plenty still to play for.",
  "Halftime, and it's {teamScore}-{opponentScore}. Time for the managers to make their adjustments.",
  "We're at the midway point, {teamScore}-{opponentScore}.",
  "Referee blows for halftime, {teamScore}-{opponentScore} on the board.",
  "That's the first half done, {teamScore}-{opponentScore} at the break.",
  "Halftime. {team} will want more from the second half at {teamScore}-{opponentScore}.",
  "The teams head in at {teamScore}-{opponentScore}, all to play for after the restart.",
];

// 12. Second-half kickoff — fires once right after halftime. type: "commentary".
export const SECOND_HALF_KICKOFF_TEMPLATES = [
  "We're back underway, {team} getting the second half started.",
  "Second half is here. Everything to play for.",
  "Restart! {teamScore}-{opponentScore}, and we go again.",
  "Here we go again, second half underway at {teamScore}-{opponentScore}.",
  "{team} get the second half started, {teamScore}-{opponentScore} on the scoreboard.",
  "Back underway, and it's still {teamScore}-{opponentScore}.",
  "Second period begins, plenty of time left to change this {teamScore}-{opponentScore} scoreline.",
  "And we're back, {team} restarting proceedings.",
  "Whistle goes, second half is live, {teamScore}-{opponentScore}.",
  "Right, second half. Let's see who wants it more.",
];

// 13. Late-game tension — only eligible late in the match if the scoreline is close. type: "commentary".
export const LATE_TENSION_TEMPLATES = [
  "Into the closing stages now, and {team} are hanging on to {teamScore}-{opponentScore}.",
  "Can {team} see this out? Not long left now.",
  "Tense finish here, every touch matters at {teamScore}-{opponentScore}.",
  "Time is running out for {opponent} to find an equalizer.",
  "{team} just need to see this out now, nerves jangling at {teamScore}-{opponentScore}.",
  "The closing stages, and it's still all to play for.",
  "{opponent} are throwing everything forward in search of a leveller.",
  "Squeaky bum time for {team} fans, holding on to {teamScore}-{opponentScore}.",
  "Not long left on the clock, can anything change at {teamScore}-{opponentScore}?",
  "{team} look to be seeing this one out, but {opponent} won't give up without a fight.",
];

// 14. Goal, team-move variant — built-up play, an assist involved. type: "goal".
export const GOAL_TEAM_MOVE_TEMPLATES = [
  "**GGGOOOAAALLL! {SCORER} GIVES {TEAM} THE LEAD!** Lovely build-up play, {assister} finds {scorer} in space, and he makes no mistake! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} SCORES!** A slick move finished off by {scorer}, picked out by {assister}! {team} {teamScore}-{opponentScore} {opponent}!",
  "**GOAL FOR {TEAM}!** {assister} squares it across, and {scorer} slots it home! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} MAKES IT COUNT!** Excellent team play, {assister} does the hard work, {scorer} finishes it off! {team} {teamScore}-{opponentScore} {opponent}!",
  "**THERE IT IS!** {assister} slips the ball through, and {scorer} finishes with real composure! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{TEAM} TAKE THE LEAD!** {scorer} is in the right place at the right time after a lovely pass from {assister}! {team} {teamScore}-{opponentScore} {opponent}!",
  "**BEAUTIFUL GOAL!** {assister} threads it through, {scorer} times his run perfectly! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} NETS IT!** Great vision from {assister}, and {scorer} finishes with ease! {team} {teamScore}-{opponentScore} {opponent}!",
  "**GOAL!** {team} work it beautifully, {assister} to {scorer}, and it's in! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} DOES IT AGAIN!** {assister} lays it on a plate and {scorer} can't miss! {team} {teamScore}-{opponentScore} {opponent}!",
];

// 15. Goal, individual strike variant — solo effort, often from distance. type: "goal".
export const GOAL_INDIVIDUAL_TEMPLATES = [
  "**GGGOOOAAALLL! {SCORER} WITH A STUNNER!** A moment of magic, {scorer} curls it into the corner from distance! {team} {teamScore}-{opponentScore} {opponent}!",
  "**WHAT A STRIKE FROM {SCORER}!** Nobody else is scoring that. {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} FROM NOWHERE!** A moment of individual brilliance! {team} {teamScore}-{opponentScore} {opponent}!",
  "**UNSTOPPABLE!** {scorer} takes it upon himself and buries it! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} WITH A WORLDIE!** That's a goal of the season contender! {team} {teamScore}-{opponentScore} {opponent}!",
  "**SPECTACULAR FROM {SCORER}!** Pure quality, right in the top corner! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} SAYS ENOUGH IS ENOUGH!** Takes the game by the scruff of the neck and scores himself! {team} {teamScore}-{opponentScore} {opponent}!",
  "**WOW!** {scorer} absolutely leathers that one into the net! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} FOR THE HIGHLIGHT REEL!** That's one to remember! {team} {teamScore}-{opponentScore} {opponent}!",
  "**BRILLIANT FROM {SCORER}!** Beats his man and finishes clinically! {team} {teamScore}-{opponentScore} {opponent}!",
];

// 16. Goal, headed/set-piece variant. type: "goal".
export const GOAL_HEADED_TEMPLATES = [
  "**GGGOOOAAALLL! {SCORER} HEADS {TEAM} IN FRONT!** {assister} delivers, {scorer} rises highest and makes no mistake! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} FINDS THE NET!** A dangerous delivery from {assister}, and {scorer} is there to finish it off! {team} {teamScore}-{opponentScore} {opponent}!",
  "**UP AND AWAY!** {scorer} climbs above everyone to head home {assister}'s delivery! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} GETS ON THE END OF IT!** Great delivery from {assister}, powerful header from {scorer}! {team} {teamScore}-{opponentScore} {opponent}!",
  "**SET-PIECE GOLD!** {assister}'s delivery is inch-perfect, and {scorer} makes no mistake! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} TOWERS ABOVE THE REST!** Bullet header from {assister}'s cross! {team} {teamScore}-{opponentScore} {opponent}!",
  "**GOAL FROM THE SET-PIECE!** {assister} whips it in, {scorer} does the rest! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} MEETS IT PERFECTLY!** Textbook header from {assister}'s cross! {team} {teamScore}-{opponentScore} {opponent}!",
  "**DEAD-BALL DANGER PAYS OFF!** {assister} delivers, {scorer} converts! {team} {teamScore}-{opponentScore} {opponent}!",
  "**{SCORER} RISES HIGHEST!** Unstoppable header from {assister}'s cross! {team} {teamScore}-{opponentScore} {opponent}!",
];

// 17. Full-time / closing line — fires once at t=90s. Kept scoreline-neutral
// on purpose (a match can end level; "who won" framing belongs to the
// Result screen's narrative headline library, SPEC.md 8.2, not this feed).
// type: "commentary".
export const FULL_TIME_TEMPLATES = [
  "Full time! {team} {teamScore}-{opponentScore} {opponent}.",
  "That's it, full time. {team} {teamScore}-{opponentScore} {opponent}.",
  "The whistle goes. {team} {teamScore}-{opponentScore} {opponent}, and that's how it finishes.",
  "Full time in this one, {team} {teamScore}-{opponentScore} {opponent}.",
  "And that's the final whistle. {team} {teamScore}-{opponentScore} {opponent}.",
  "Full time, {teamScore}-{opponentScore}. That's how it ends.",
  "That's full time, {team} {teamScore}-{opponentScore} {opponent}.",
  "Referee brings it to a close. {team} {teamScore}-{opponentScore} {opponent}.",
  "Full time! Final score, {team} {teamScore}-{opponentScore} {opponent}.",
  "That's the match. {team} {teamScore}-{opponentScore} {opponent}, full time.",
];
