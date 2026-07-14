// Stub player database — SPEC.md section 7. Placeholder/curated data until the
// real sourcing workstream (CLAUDE.md "Known gaps") replaces it.
//
// Multi-position curation bar: a second position requires a documented run
// of competitive first-team appearances actually played there (club or
// country), not stylistic similarity or pundit consensus. Most players stay
// single-position; 2 is the common "flex" case; 3 should be rare-to-never.
// Loose tagging erodes the whole point of the natural-fit/non-fit
// distinction (SPEC.md 5.4/8.1), so keep this selective on future additions.
// The taxonomy has no "winger" bucket, so genuine wide/creative attacking
// careers (Ronaldo, Neymar, Ronaldinho, Messi) map to the closest available
// bucket (MID) — a real judgment call, not a literal "played as a #6" claim.

import type { Player, Position } from "@/lib/types";

export const STUB_PLAYERS: Player[] = [
  // Goalkeepers
  { id: "lev-yashin", name: "Lev Yashin", positions: ["GK"], club: "Dynamo Moscow", overallRating: 90, era: "legend", source: "database" },
  { id: "manuel-neuer", name: "Manuel Neuer", positions: ["GK"], club: "Bayern Munich", overallRating: 89, era: "current", source: "database" },
  { id: "iker-casillas", name: "Iker Casillas", positions: ["GK"], club: "Real Madrid", overallRating: 91, era: "legend", source: "database" },
  { id: "gianluigi-buffon", name: "Gianluigi Buffon", positions: ["GK"], club: "Juventus", overallRating: 91, era: "legend", source: "database" },
  { id: "alisson-becker", name: "Alisson Becker", positions: ["GK"], club: "Liverpool", overallRating: 89, era: "current", source: "database" },
  { id: "ederson-moraes", name: "Ederson Moraes", positions: ["GK"], club: "Manchester City", overallRating: 87, era: "current", source: "database" },
  { id: "petr-cech", name: "Petr Cech", positions: ["GK"], club: "Chelsea", overallRating: 88, era: "legend", source: "database" },
  { id: "oliver-kahn", name: "Oliver Kahn", positions: ["GK"], club: "Bayern Munich", overallRating: 90, era: "legend", source: "database" },

  // Defenders
  { id: "virgil-van-dijk", name: "Virgil van Dijk", positions: ["DEF"], club: "Liverpool", overallRating: 90, era: "current", source: "database" },
  { id: "sergio-ramos", name: "Sergio Ramos", positions: ["DEF", "MID"], club: "Real Madrid", overallRating: 90, era: "current", source: "database" },
  { id: "paolo-maldini", name: "Paolo Maldini", positions: ["DEF", "MID"], club: "AC Milan", overallRating: 93, era: "legend", source: "database" },
  { id: "rio-ferdinand", name: "Rio Ferdinand", positions: ["DEF"], club: "Manchester United", overallRating: 88, era: "legend", source: "database" },
  { id: "marcelo-vieira", name: "Marcelo Vieira", positions: ["DEF"], club: "Real Madrid", overallRating: 87, era: "legend", source: "database" },
  { id: "dani-alves", name: "Dani Alves", positions: ["DEF"], club: "Barcelona", overallRating: 87, era: "legend", source: "database" },
  { id: "kalidou-koulibaly", name: "Kalidou Koulibaly", positions: ["DEF"], club: "Napoli", overallRating: 86, era: "current", source: "database" },
  { id: "thiago-silva", name: "Thiago Silva", positions: ["DEF"], club: "Chelsea", overallRating: 87, era: "current", source: "database" },

  // Midfielders
  { id: "andres-iniesta", name: "Andrés Iniesta", positions: ["MID"], club: "Barcelona", overallRating: 92, era: "legend", source: "database" },
  { id: "xavi-hernandez", name: "Xavi Hernández", positions: ["MID"], club: "Barcelona", overallRating: 91, era: "legend", source: "database" },
  { id: "kevin-de-bruyne", name: "Kevin De Bruyne", positions: ["MID", "ST"], club: "Manchester City", overallRating: 91, era: "current", source: "database" },
  { id: "luka-modric", name: "Luka Modrić", positions: ["MID"], club: "Real Madrid", overallRating: 89, era: "current", source: "database" },
  { id: "zinedine-zidane", name: "Zinedine Zidane", positions: ["MID"], club: "Real Madrid", overallRating: 94, era: "legend", source: "database" },
  { id: "frank-lampard", name: "Frank Lampard", positions: ["MID"], club: "Chelsea", overallRating: 88, era: "legend", source: "database" },
  { id: "steven-gerrard", name: "Steven Gerrard", positions: ["MID", "ST"], club: "Liverpool", overallRating: 89, era: "legend", source: "database" },
  { id: "kaka", name: "Kaká", positions: ["MID"], club: "AC Milan", overallRating: 90, era: "legend", source: "database" },
  { id: "paul-scholes", name: "Paul Scholes", positions: ["MID"], club: "Manchester United", overallRating: 87, era: "legend", source: "database" },
  { id: "ngolo-kante", name: "N'Golo Kanté", positions: ["MID"], club: "Chelsea", overallRating: 87, era: "current", source: "database" },
  { id: "toni-kroos", name: "Toni Kroos", positions: ["MID"], club: "Real Madrid", overallRating: 88, era: "current", source: "database" },
  { id: "wayne-rooney", name: "Wayne Rooney", positions: ["MID", "ST"], club: "Manchester United", overallRating: 88, era: "legend", source: "database" },

  // Strikers
  { id: "thierry-henry", name: "Thierry Henry", positions: ["ST", "MID"], club: "Arsenal", overallRating: 92, era: "legend", source: "database" },
  { id: "erling-haaland", name: "Erling Haaland", positions: ["ST"], club: "Manchester City", overallRating: 93, era: "current", source: "database" },
  { id: "neymar-jr", name: "Neymar Jr", positions: ["ST", "MID"], club: "Santos", overallRating: 91, era: "current", source: "database" },
  { id: "lionel-messi", name: "Lionel Messi", positions: ["ST", "MID"], club: "Inter Miami", overallRating: 99, era: "current", source: "database" },
  { id: "cristiano-ronaldo", name: "Cristiano Ronaldo", positions: ["ST", "MID"], club: "Al Nassr", overallRating: 98, era: "current", source: "database" },
  { id: "ronaldinho-gaucho", name: "Ronaldinho Gaúcho", positions: ["ST", "MID"], club: "Barcelona", overallRating: 92, era: "legend", source: "database" },
  { id: "ronaldo-nazario", name: "Ronaldo Nazário", positions: ["ST"], club: "Real Madrid", overallRating: 94, era: "legend", source: "database" },
  { id: "zlatan-ibrahimovic", name: "Zlatan Ibrahimović", positions: ["ST"], club: "AC Milan", overallRating: 90, era: "legend", source: "database" },
  { id: "robert-lewandowski", name: "Robert Lewandowski", positions: ["ST"], club: "Barcelona", overallRating: 91, era: "current", source: "database" },
  { id: "ivan-toney", name: "Ivan Toney", positions: ["ST"], club: "Brentford", overallRating: 78, era: "current", source: "database" },
  { id: "didier-drogba", name: "Didier Drogba", positions: ["ST"], club: "Chelsea", overallRating: 89, era: "legend", source: "database" },
  { id: "alan-shearer", name: "Alan Shearer", positions: ["ST"], club: "Newcastle United", overallRating: 88, era: "legend", source: "database" },
  { id: "romario-de-souza", name: "Romário de Souza", positions: ["ST"], club: "Barcelona", overallRating: 91, era: "legend", source: "database" },
  { id: "ruud-van-nistelrooy", name: "Ruud van Nistelrooy", positions: ["ST"], club: "Manchester United", overallRating: 89, era: "legend", source: "database" },
];

export const playersById: Map<string, Player> = new Map(
  STUB_PLAYERS.map((player) => [player.id, player]),
);

/** Trim + lowercase identity used to detect the same real person across sources (database or custom). */
export function normalizePlayerName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Search never hard-blocks by position (SPEC.md 5.4) — any player can be
 * selected into any slot. An empty query browses the top-rated natural
 * fits for the slot; a non-empty query searches every player by name, with
 * natural fits ranked above non-fits (then by rating within each group).
 */
export function searchPlayers(query: string, slotPosition: Position, limit = 6): Player[] {
  const trimmed = query.trim().toLowerCase();
  const fitsSlot = (player: Player) => player.positions.includes(slotPosition);

  if (!trimmed) {
    return STUB_PLAYERS.filter(fitsSlot)
      .sort((a, b) => b.overallRating - a.overallRating)
      .slice(0, limit);
  }

  const matches = STUB_PLAYERS.filter((player) => player.name.toLowerCase().includes(trimmed));
  return [...matches]
    .sort((a, b) => {
      const aFits = fitsSlot(a) ? 1 : 0;
      const bFits = fitsSlot(b) ? 1 : 0;
      if (aFits !== bFits) return bFits - aFits;
      return b.overallRating - a.overallRating;
    })
    .slice(0, limit);
}

/** "Virgil van Dijk" -> "VvD", "Neymar Jr" -> "NJ", "Erling Haaland" -> "EH" */
export function getPlayerInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 3);
}

/**
 * Pitch bubble caption format from the Figma-verified design-system samples:
 * "Erling Haaland" -> "E. Haaland", "Virgil van Dijk" -> "V. van Dijk".
 */
export function getShortPlayerName(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length <= 1) return name.trim();
  return `${words[0][0]}. ${words.slice(1).join(" ")}`;
}
