import type { CourseEssentialSheet } from "../../domain/courseDocument";

export const svtEssentialRoutes = [
  { key: "conditioned-reflex", pathId: "terminale-d-svt-l1-conditioned-reflex", levelId: "terminale-d" },
  { key: "nervous-communication", pathId: "terminale-c-svt-l1-nervous-communication", levelId: "terminale-c" },
  { key: "nervous-communication", pathId: "terminale-d-svt-l2-nervous-tissue", levelId: "terminale-d" },
  { key: "drugs", pathId: "terminale-c-svt-l2-drugs-nervous-system", levelId: "terminale-c" },
  { key: "cell-energy", pathId: "terminale-c-svt-l3-cell-energy-production", levelId: "terminale-c" },
  { key: "muscle", pathId: "terminale-c-svt-l4-muscle-energy-use", levelId: "terminale-c" },
  { key: "muscle", pathId: "terminale-d-svt-l3-skeletal-muscle", levelId: "terminale-d" },
  { key: "internal-environment", pathId: "terminale-d-svt-l10-internal-environment", levelId: "terminale-d" },
  { key: "heart", pathId: "terminale-d-svt-l4-heart", levelId: "terminale-d" },
  { key: "immune-defense", pathId: "terminale-c-svt-l5-immune-defense", levelId: "terminale-c" },
  { key: "immune-defense", pathId: "terminale-d-svt-l11-immune-defense", levelId: "terminale-d" },
  { key: "hiv-infection", pathId: "terminale-c-svt-l6-hiv-infection", levelId: "terminale-c" },
  { key: "hiv-infection", pathId: "terminale-d-svt-l12-hiv-infection", levelId: "terminale-d" },
  { key: "gamete-fate", pathId: "terminale-d-svt-l5-gamete-fate", levelId: "terminale-d" },
  { key: "female-cycles", pathId: "terminale-c-svt-l7-female-sexual-cycles", levelId: "terminale-c" },
  { key: "sexual-organs", pathId: "terminale-d-svt-l6-human-sexual-organs", levelId: "terminale-d" },
  { key: "spermaphytes", pathId: "terminale-d-svt-l7-spermaphyte-reproduction", levelId: "terminale-d" },
  { key: "human-heredity", pathId: "terminale-c-svt-l8-human-heredity", levelId: "terminale-c" },
  { key: "human-heredity", pathId: "terminale-d-svt-l8-single-trait-heredity", levelId: "terminale-d" },
  { key: "two-trait-heredity", pathId: "terminale-d-svt-l9-two-trait-heredity", levelId: "terminale-d" },
  { key: "soil-fertility", pathId: "terminale-c-svt-l11-soil-fertility", levelId: "terminale-c" },
  { key: "soil-fertility", pathId: "terminale-d-svt-l15-soil-protection", levelId: "terminale-d" },
  { key: "mining-formation", pathId: "terminale-d-svt-l13-mining-formation", levelId: "terminale-d" },
  { key: "mining-exploitation", pathId: "terminale-d-svt-l14-mining-exploitation", levelId: "terminale-d" },
] as const;

export type SvtEssentialKey = typeof svtEssentialRoutes[number]["key"];
export function getSvtEssentialKey(pathId: string, levelId: string): SvtEssentialKey | null {
  return svtEssentialRoutes.find(route => route.pathId === pathId && route.levelId === levelId)?.key ?? null;
}
const loaders: Record<SvtEssentialKey, () => Promise<CourseEssentialSheet>> = {
  "conditioned-reflex": () => import("./reflexes").then(m => m.default),
  "nervous-communication": () => import("./nervousSystem").then(m => m.default),
  drugs: () => import("./synapses").then(m => m.default),
  "cell-energy": () => import("./cellEnergy").then(m => m.default),
  muscle: () => import("./muscle").then(m => m.default),
  "internal-environment": () => import("./internalEnvironment").then(m => m.default),
  heart: () => import("./heart").then(m => m.default),
  "immune-defense": () => import("./immunity").then(m => m.default),
  "hiv-infection": () => import("./hiv").then(m => m.default),
  "gamete-fate": () => import("./gameteFate").then(m => m.default),
  "female-cycles": () => import("./sexualCycles").then(m => m.femaleCyclesSheet),
  "sexual-organs": () => import("./sexualCycles").then(m => m.sexualOrgansSheet),
  spermaphytes: () => import("./floweringPlants").then(m => m.default),
  "human-heredity": () => import("./heredity").then(m => m.default),
  "two-trait-heredity": () => import("./dihybrid").then(m => m.default),
  "soil-fertility": () => import("./soil").then(m => m.default),
  "mining-formation": () => import("./mining").then(m => m.formationSheet),
  "mining-exploitation": () => import("./mining").then(m => m.exploitationSheet),
};
const cache = new Map<SvtEssentialKey, Promise<CourseEssentialSheet>>();
export function loadSvtEssentialSheet(key: SvtEssentialKey): Promise<CourseEssentialSheet> {
  const existing = cache.get(key);
  if (existing) return existing;
  const pending = loaders[key]().catch(error => { cache.delete(key); throw error; });
  cache.set(key, pending);
  return pending;
}
