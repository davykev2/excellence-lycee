import type { CourseEssentialSheet } from "../../domain/courseDocument";

const cd = ["terminale-c", "terminale-d"] as const;
const d = ["terminale-d"] as const;

/** Existing catalogue IDs are authoritative, including the historical kinematics ID. */
export const physicsEssentialRoutes = [
  { key: "kinematics", pathId: "seconde-c-kinematics", levelIds: cd },
  { key: "inertia", pathId: "terminale-cd-inertia-motion", levelIds: cd },
  { key: "uniform-fields", pathId: "terminale-cd-uniform-fields", levelIds: cd },
  { key: "mechanical-oscillations", pathId: "terminale-cd-free-mechanical-oscillations", levelIds: cd },
  { key: "magnetic-field", pathId: "terminale-cd-magnetic-field", levelIds: cd },
  { key: "charged-particle", pathId: "terminale-cd-charged-particle-magnetic-field", levelIds: cd },
  { key: "laplace", pathId: "terminale-cd-laplace-law", levelIds: cd },
  { key: "auto-induction", pathId: "terminale-cd-auto-induction", levelIds: cd },
  { key: "operational-amplifier", pathId: "terminale-cd-derivator-integrator", levelIds: cd },
  { key: "free-electrical", pathId: "terminale-cd-free-electrical-oscillations", levelIds: cd },
  { key: "rlc-forced", pathId: "terminale-cd-rlc-forced-sinusoidal", levelIds: cd },
  { key: "rlc-resonance", pathId: "terminale-cd-rlc-intensity-resonance", levelIds: cd },
  { key: "ac-power", pathId: "terminale-cd-ac-power", levelIds: cd },
  { key: "spontaneous-nuclear", pathId: "terminale-cd-spontaneous-nuclear", levelIds: cd },
  { key: "provoked-nuclear", pathId: "terminale-cd-provoked-nuclear", levelIds: cd },
  { key: "alcohols", pathId: "terminale-cd-chemistry-alcohols", levelIds: cd },
  { key: "carbonyl", pathId: "terminale-cd-chemistry-carbonyl", levelIds: cd },
  { key: "amines", pathId: "terminale-d-chemistry-amines", levelIds: d },
  { key: "carboxylic-acids", pathId: "terminale-cd-chemistry-carboxylic-acids", levelIds: cd },
  { key: "soap", pathId: "terminale-cd-chemistry-soap", levelIds: cd },
  { key: "alpha-amino-acids", pathId: "terminale-d-chemistry-alpha-amino-acids", levelIds: d },
  { key: "ph", pathId: "terminale-cd-chemistry-ph", levelIds: cd },
  { key: "strong-acid-base", pathId: "terminale-cd-chemistry-strong-acid-base", levelIds: cd },
  { key: "weak-acid-base", pathId: "terminale-cd-chemistry-weak-acid-base", levelIds: cd },
  { key: "acid-base-couples", pathId: "terminale-cd-chemistry-acid-base-couples", levelIds: cd },
  { key: "acid-base-buffers", pathId: "terminale-cd-chemistry-acid-base-buffers", levelIds: cd },
  { key: "acid-base-titration", pathId: "terminale-cd-chemistry-acid-base-titration", levelIds: cd },
] as const;

export type PhysicsEssentialKey = typeof physicsEssentialRoutes[number]["key"];

export function getPhysicsEssentialKey(pathId: string, levelId: string): PhysicsEssentialKey | null {
  return physicsEssentialRoutes.find(route => route.pathId === pathId && (route.levelIds as readonly string[]).includes(levelId))?.key ?? null;
}

const loaders: Record<PhysicsEssentialKey, () => Promise<CourseEssentialSheet>> = {
  kinematics: () => import("./kinematics").then(module => module.default),
  inertia: () => import("./inertia").then(module => module.default),
  "uniform-fields": () => import("./uniformFields").then(module => module.default),
  "mechanical-oscillations": () => import("./mechanicalOscillations").then(module => module.default),
  "magnetic-field": () => import("./magneticField").then(module => module.default),
  "charged-particle": () => import("./chargedParticle").then(module => module.default),
  laplace: () => import("./laplace").then(module => module.default),
  "auto-induction": () => import("./autoInduction").then(module => module.default),
  "operational-amplifier": () => import("./operationalAmplifier").then(module => module.default),
  "free-electrical": () => import("./freeElectrical").then(module => module.default),
  "rlc-forced": () => import("./rlc").then(module => module.default),
  "rlc-resonance": () => import("./rlc").then(module => module.resonanceSheet),
  "ac-power": () => import("./rlc").then(module => module.powerSheet),
  "spontaneous-nuclear": () => import("./nuclear").then(module => module.default),
  "provoked-nuclear": () => import("./nuclear").then(module => module.provokedSheet),
  alcohols: () => import("./alcohols").then(module => module.default),
  carbonyl: () => import("./alcohols").then(module => module.carbonylSheet),
  amines: () => import("./amines").then(module => module.default),
  "carboxylic-acids": () => import("./carboxylicAcids").then(module => module.default),
  soap: () => import("./carboxylicAcids").then(module => module.soapSheet),
  "alpha-amino-acids": () => import("./aminoAcids").then(module => module.default),
  ph: () => import("./aqueousSolutions").then(module => module.default),
  "strong-acid-base": () => import("./strongAcidBase").then(module => module.default),
  "weak-acid-base": () => import("./weakAcidBase").then(module => module.default),
  "acid-base-couples": () => import("./weakAcidBase").then(module => module.couplesSheet),
  "acid-base-buffers": () => import("./acidBaseReactions").then(module => module.default),
  "acid-base-titration": () => import("./acidBaseReactions").then(module => module.titrationSheet),
};
const cache = new Map<PhysicsEssentialKey, Promise<CourseEssentialSheet>>();
export function loadPhysicsEssentialSheet(key: PhysicsEssentialKey): Promise<CourseEssentialSheet> {
  const previous = cache.get(key);
  if (previous) return previous;
  const pending = loaders[key]().catch(error => { cache.delete(key); throw error; });
  cache.set(key, pending);
  return pending;
}
