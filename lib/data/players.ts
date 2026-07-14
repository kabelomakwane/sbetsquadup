// Stub player database — SPEC.md section 7. Placeholder/curated data until the
// real sourcing workstream (CLAUDE.md "Known gaps") replaces it.

import type { Player, Position } from "@/lib/types";

export const STUB_PLAYERS: Player[] = [
  // Goalkeepers
  { id: "lev-yashin", name: "Lev Yashin", position: "GK", club: "Dynamo Moscow", overallRating: 90, era: "legend", source: "database" },
  { id: "manuel-neuer", name: "Manuel Neuer", position: "GK", club: "Bayern Munich", overallRating: 89, era: "current", source: "database" },
  { id: "iker-casillas", name: "Iker Casillas", position: "GK", club: "Real Madrid", overallRating: 91, era: "legend", source: "database" },
  { id: "gianluigi-buffon", name: "Gianluigi Buffon", position: "GK", club: "Juventus", overallRating: 91, era: "legend", source: "database" },
  { id: "alisson-becker", name: "Alisson Becker", position: "GK", club: "Liverpool", overallRating: 89, era: "current", source: "database" },
  { id: "ederson-moraes", name: "Ederson Moraes", position: "GK", club: "Manchester City", overallRating: 87, era: "current", source: "database" },
  { id: "petr-cech", name: "Petr Cech", position: "GK", club: "Chelsea", overallRating: 88, era: "legend", source: "database" },
  { id: "oliver-kahn", name: "Oliver Kahn", position: "GK", club: "Bayern Munich", overallRating: 90, era: "legend", source: "database" },

  // Defenders
  { id: "virgil-van-dijk", name: "Virgil van Dijk", position: "DEF", club: "Liverpool", overallRating: 90, era: "current", source: "database" },
  { id: "sergio-ramos", name: "Sergio Ramos", position: "DEF", club: "Real Madrid", overallRating: 90, era: "current", source: "database" },
  { id: "paolo-maldini", name: "Paolo Maldini", position: "DEF", club: "AC Milan", overallRating: 93, era: "legend", source: "database" },
  { id: "rio-ferdinand", name: "Rio Ferdinand", position: "DEF", club: "Manchester United", overallRating: 88, era: "legend", source: "database" },
  { id: "marcelo-vieira", name: "Marcelo Vieira", position: "DEF", club: "Real Madrid", overallRating: 87, era: "legend", source: "database" },
  { id: "dani-alves", name: "Dani Alves", position: "DEF", club: "Barcelona", overallRating: 87, era: "legend", source: "database" },
  { id: "kalidou-koulibaly", name: "Kalidou Koulibaly", position: "DEF", club: "Napoli", overallRating: 86, era: "current", source: "database" },
  { id: "thiago-silva", name: "Thiago Silva", position: "DEF", club: "Chelsea", overallRating: 87, era: "current", source: "database" },

  // Midfielders
  { id: "andres-iniesta", name: "Andrés Iniesta", position: "MID", club: "Barcelona", overallRating: 92, era: "legend", source: "database" },
  { id: "xavi-hernandez", name: "Xavi Hernández", position: "MID", club: "Barcelona", overallRating: 91, era: "legend", source: "database" },
  { id: "kevin-de-bruyne", name: "Kevin De Bruyne", position: "MID", club: "Manchester City", overallRating: 91, era: "current", source: "database" },
  { id: "luka-modric", name: "Luka Modrić", position: "MID", club: "Real Madrid", overallRating: 89, era: "current", source: "database" },
  { id: "zinedine-zidane", name: "Zinedine Zidane", position: "MID", club: "Real Madrid", overallRating: 94, era: "legend", source: "database" },
  { id: "frank-lampard", name: "Frank Lampard", position: "MID", club: "Chelsea", overallRating: 88, era: "legend", source: "database" },
  { id: "steven-gerrard", name: "Steven Gerrard", position: "MID", club: "Liverpool", overallRating: 89, era: "legend", source: "database" },
  { id: "kaka", name: "Kaká", position: "MID", club: "AC Milan", overallRating: 90, era: "legend", source: "database" },
  { id: "paul-scholes", name: "Paul Scholes", position: "MID", club: "Manchester United", overallRating: 87, era: "legend", source: "database" },
  { id: "ngolo-kante", name: "N'Golo Kanté", position: "MID", club: "Chelsea", overallRating: 87, era: "current", source: "database" },
  { id: "toni-kroos", name: "Toni Kroos", position: "MID", club: "Real Madrid", overallRating: 88, era: "current", source: "database" },
  { id: "wayne-rooney", name: "Wayne Rooney", position: "MID", club: "Manchester United", overallRating: 88, era: "legend", source: "database" },

  // Strikers
  { id: "thierry-henry", name: "Thierry Henry", position: "ST", club: "Arsenal", overallRating: 92, era: "legend", source: "database" },
  { id: "erling-haaland", name: "Erling Haaland", position: "ST", club: "Manchester City", overallRating: 93, era: "current", source: "database" },
  { id: "neymar-jr", name: "Neymar Jr", position: "ST", club: "Santos", overallRating: 91, era: "current", source: "database" },
  { id: "lionel-messi", name: "Lionel Messi", position: "ST", club: "Inter Miami", overallRating: 99, era: "current", source: "database" },
  { id: "cristiano-ronaldo", name: "Cristiano Ronaldo", position: "ST", club: "Al Nassr", overallRating: 98, era: "current", source: "database" },
  { id: "ronaldinho-gaucho", name: "Ronaldinho Gaúcho", position: "ST", club: "Barcelona", overallRating: 92, era: "legend", source: "database" },
  { id: "ronaldo-nazario", name: "Ronaldo Nazário", position: "ST", club: "Real Madrid", overallRating: 94, era: "legend", source: "database" },
  { id: "zlatan-ibrahimovic", name: "Zlatan Ibrahimović", position: "ST", club: "AC Milan", overallRating: 90, era: "legend", source: "database" },
  { id: "robert-lewandowski", name: "Robert Lewandowski", position: "ST", club: "Barcelona", overallRating: 91, era: "current", source: "database" },
  { id: "ivan-toney", name: "Ivan Toney", position: "ST", club: "Brentford", overallRating: 78, era: "current", source: "database" },
  { id: "didier-drogba", name: "Didier Drogba", position: "ST", club: "Chelsea", overallRating: 89, era: "legend", source: "database" },
  { id: "alan-shearer", name: "Alan Shearer", position: "ST", club: "Newcastle United", overallRating: 88, era: "legend", source: "database" },
  { id: "romario-de-souza", name: "Romário de Souza", position: "ST", club: "Barcelona", overallRating: 91, era: "legend", source: "database" },
  { id: "ruud-van-nistelrooy", name: "Ruud van Nistelrooy", position: "ST", club: "Manchester United", overallRating: 89, era: "legend", source: "database" },
];

export const playersById: Map<string, Player> = new Map(
  STUB_PLAYERS.map((player) => [player.id, player]),
);

/** Trim + lowercase identity used to detect the same real person across sources (database or custom). */
export function normalizePlayerName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Empty query returns a browse list of the top-rated players for that position;
 * a non-empty query does a case-insensitive substring match, sorted by rating.
 */
export function searchPlayers(query: string, position: Position, limit = 6): Player[] {
  const trimmed = query.trim().toLowerCase();
  const pool = STUB_PLAYERS.filter((player) => player.position === position);
  const matches = trimmed
    ? pool.filter((player) => player.name.toLowerCase().includes(trimmed))
    : pool;

  return [...matches].sort((a, b) => b.overallRating - a.overallRating).slice(0, limit);
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
