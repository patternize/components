/** Deterministic pseudo-random generator (mulberry32) for stable demo data. */
export const makeRng = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** A `rows × cols` matrix of standard-normal-ish values in roughly [-1, 1]. */
export const randomMatrix = (
  rows: number,
  cols: number,
  seed = 1
): number[][] => {
  const rng = makeRng(seed);
  const out: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      // Sum of uniforms approximates a normal distribution.
      row.push((rng() + rng() + rng() - 1.5) * 1.3);
    }
    out.push(row);
  }
  return out;
};
