/** Reusing the displayed seed makes a fresh run; entering another seed reproduces that run. */
export function seedForNextRun(displayedSeed: string, lastUsedSeed: string | null, nonce: string): string {
  const seed = displayedSeed.trim();
  if (seed !== lastUsedSeed) return seed;
  return `${seed.slice(0, 91)}-${nonce.slice(0, 8)}`;
}
