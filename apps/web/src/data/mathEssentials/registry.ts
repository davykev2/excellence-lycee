import type { MathEssentialSheet } from "./types";
import { terminalCDMathPairs } from "../terminalCDMathSharing";

export const mathEssentialPairs = terminalCDMathPairs.map(pair => [pair.key, pair.c, pair.d] as const);

export type MathEssentialKey = typeof mathEssentialPairs[number][0];

/** Both aliases resolve to the very same payload, not two copies to maintain. */
export function getMathEssentialKey(pathId: string, levelId: string): MathEssentialKey | null {
  const column = levelId === "terminale-c" ? 1 : levelId === "terminale-d" ? 2 : null;
  if (column === null) return null;
  return mathEssentialPairs.find(pair => pair[column] === pathId)?.[0] ?? null;
}

const loaders: Record<MathEssentialKey, () => Promise<MathEssentialSheet>> = {
  limits: () => import("./limits").then(module => module.default),
  derivatives: () => import("./derivatives").then(module => module.default),
  primitives: () => import("./primitives").then(module => module.default),
  logarithms: () => import("./logarithms").then(module => module.default),
  complex: () => import("./complex").then(module => module.default),
  exponential: () => import("./exponential").then(module => module.default),
  sequences: () => import("./sequences").then(module => module.default),
  geometry: () => import("./geometry").then(module => module.default),
  integrals: () => import("./integrals").then(module => module.default),
  probability: () => import("./probability").then(module => module.default),
  differential: () => import("./differential").then(module => module.default),
  statistics: () => import("./statistics").then(module => module.default),
};

const cache = new Map<MathEssentialKey, Promise<MathEssentialSheet>>();
export function loadMathEssentialSheet(key: MathEssentialKey): Promise<MathEssentialSheet> {
  const previous = cache.get(key);
  if (previous) return previous;
  const pending = loaders[key]().catch(error => { cache.delete(key); throw error; });
  cache.set(key, pending);
  return pending;
}
