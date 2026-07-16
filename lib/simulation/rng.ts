// Deterministic seeded PRNG — SPEC.md section 14: simulateMatch must be a pure
// function of (homeSquad, awaySquad, seed) so a future server can run one
// simulation that multiple clients replay identically. mulberry32 is a small,
// fast, well-distributed 32-bit generator, good enough for this and easy to
// port to any future server runtime.

export type Rng = () => number;

export function createRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Inclusive of both min and max. */
export function randomInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[randomInt(rng, 0, items.length - 1)];
}

/** Knuth's algorithm: draw uniforms until their product crosses e^-lambda. */
export function samplePoisson(rng: Rng, lambda: number): number {
  const limit = Math.exp(-lambda);
  let count = 0;
  let product = 1;
  do {
    count++;
    product *= rng();
  } while (product > limit);
  return count - 1;
}

/** Picks an item with probability proportional to its weight. */
export function weightedPick<T>(rng: Rng, items: readonly T[], weights: readonly number[]): T {
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let roll = rng() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}
