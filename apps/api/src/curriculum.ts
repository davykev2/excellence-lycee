import { terminalCMathLessonIds, terminalCMathRewardWeight } from "./terminalCMathRewards.js";
import { terminalDMathLessonIds } from "./terminalDMathRewards.js";

export const XP_PER_LESSON = 10_000;
const XP_ALLOCATION_UNIT = 10;

function normalizeLessonRewards(rewards: Map<string, number>) {
  const rewardsByPath = new Map<string, Array<{ key: string; lessonId: string; weight: number }>>();
  rewards.forEach((weight, key) => {
    const separatorIndex = key.indexOf(":");
    const pathId = key.slice(0, separatorIndex);
    const lessonId = key.slice(separatorIndex + 1);
    const pathRewards = rewardsByPath.get(pathId) ?? [];
    pathRewards.push({ key, lessonId, weight: Math.max(1, weight) });
    rewardsByPath.set(pathId, pathRewards);
  });

  rewardsByPath.forEach((pathRewards) => {
    const totalWeight = pathRewards.reduce((sum, reward) => sum + reward.weight, 0);
    const totalUnits = XP_PER_LESSON / XP_ALLOCATION_UNIT;
    const allocations = pathRewards.map((reward, index) => {
      const rawUnits = totalUnits * reward.weight / totalWeight;
      const baseUnits = Math.floor(rawUnits);
      return { ...reward, index, baseUnits, fractionalUnits: rawUnits - baseUnits };
    });
    const remainingUnits = totalUnits - allocations.reduce((sum, allocation) => sum + allocation.baseUnits, 0);
    const bonusIndexes = new Set(
      [...allocations]
        .sort((left, right) => (
          right.fractionalUnits - left.fractionalUnits
          || (left.lessonId < right.lessonId ? -1 : left.lessonId > right.lessonId ? 1 : 0)
          || left.index - right.index
        ))
        .slice(0, remainingUnits)
        .map((allocation) => allocation.index),
    );

    allocations.forEach((allocation) => {
      rewards.set(
        allocation.key,
        (allocation.baseUnits + (bonusIndexes.has(allocation.index) ? 1 : 0)) * XP_ALLOCATION_UNIT,
      );
    });
  });
}

const lessonRewards = new Map<string, number>([
  ["seconde-c-general-functions:function-machine", 30],
  ["seconde-c-general-functions:function-domain", 40],
  ["seconde-c-general-functions:images-antecedents", 40],
  ["seconde-c-general-functions:graph-reading", 50],
  ["seconde-c-general-functions:interval-images", 40],
  ["seconde-c-general-functions:variations-extrema", 50],
  ["seconde-c-general-functions:functions-challenge", 80],
  ["seconde-c-kinematics:kinematics-rappels", 40],
  ["seconde-c-kinematics:position-vector", 50],
  ["seconde-c-kinematics:velocity-vector", 60],
  ["seconde-c-kinematics:acceleration-vector", 65],
  ["seconde-c-kinematics:rectilinear-uniform-motion", 55],
  ["seconde-c-kinematics:rectilinear-varied-motion", 70],
  ["seconde-c-kinematics:circular-uniform-motion", 75],
  ["seconde-c-kinematics:pursuit-mission", 95],
  ["terminale-cd-inertia-motion:galilean-referentials", 45],
  ["terminale-cd-inertia-motion:center-inertia-theorem", 55],
  ["terminale-cd-inertia-motion:kinetic-energy-theorem", 60],
  ["terminale-cd-inertia-motion:mechanics-protocol", 65],
  ["terminale-cd-inertia-motion:inclined-plane", 70],
  ["terminale-cd-inertia-motion:free-fall-vertical", 80],
  ["terminale-cd-inertia-motion:vehicle-slope-mission", 95],
  ["terminale-c-gravitation:newton-law", 45],
  ["terminale-c-gravitation:gravitational-field", 55],
  ["terminale-c-gravitation:satellite-motion", 65],
  ["terminale-c-gravitation:geostationary-satellite", 70],
  ["terminale-c-gravitation:kepler-laws", 80],
  ["terminale-c-gravitation:earth-mass-mission", 95],
  ["terminale-cd-uniform-fields:uniform-field", 40],
  ["terminale-cd-uniform-fields:projectile-motion", 55],
  ["terminale-cd-uniform-fields:projectile-range-height", 65],
  ["terminale-cd-uniform-fields:charged-particle-motion", 70],
  ["terminale-cd-uniform-fields:electrostatic-deflection", 80],
  ["terminale-cd-uniform-fields:oscilloscope-mission", 95],
  ["terminale-cd-free-mechanical-oscillations:free-oscillation-basics", 45],
  ["terminale-cd-free-mechanical-oscillations:spring-mass-force-model", 55],
  ["terminale-cd-free-mechanical-oscillations:free-oscillation-equation", 65],
  ["terminale-cd-free-mechanical-oscillations:harmonic-solution-initial-conditions", 70],
  ["terminale-cd-free-mechanical-oscillations:oscillation-graphs-phase", 70],
  ["terminale-cd-free-mechanical-oscillations:mechanical-energy-conservation", 80],
  ["terminale-cd-free-mechanical-oscillations:official-fixation-exercises", 90],
  ["terminale-cd-free-mechanical-oscillations:suspension-oscillator-mission", 105],
  ["terminale-cd-chemistry-alcohols:alcohol-definition-nomenclature", 45],
  ["terminale-cd-chemistry-alcohols:alcohol-classes", 55],
  ["terminale-cd-chemistry-alcohols:alcohol-preparation", 60],
  ["terminale-cd-chemistry-alcohols:sodium-dehydration-combustion", 65],
  ["terminale-cd-chemistry-alcohols:mild-oxidation", 75],
  ["terminale-cd-chemistry-alcohols:redox-equations-polyols", 80],
  ["terminale-cd-chemistry-alcohols:unknown-alcohol-mission", 95],
  ["terminale-c-svt-l1-nervous-communication:neuron-structure", 45],
  ["terminale-c-svt-l1-nervous-communication:resting-potential", 55],
  ["terminale-c-svt-l1-nervous-communication:action-potential-phases", 70],
  ["terminale-c-svt-l1-nervous-communication:ionic-explanation", 70],
  ["terminale-c-svt-l1-nervous-communication:local-currents", 60],
  ["terminale-c-svt-l1-nervous-communication:synapse-types", 65],
  ["terminale-c-svt-l1-nervous-communication:synaptic-transmission", 75],
  ["terminale-c-svt-l1-nervous-communication:neuron-chain-mission", 95],
  ["terminale-a-polynomial-rational-functions:polynomial-limit-at-point", 50],
  ["terminale-a-polynomial-rational-functions:polynomial-limit-at-infinity", 55],
  ["terminale-a-polynomial-rational-functions:rational-limit-defined-point", 40],
  ["terminale-a-polynomial-rational-functions:one-sided-rational-limits", 60],
  ["terminale-a-polynomial-rational-functions:rational-limit-at-infinity", 55],
  ["terminale-a-polynomial-rational-functions:sum-of-limits", 45],
  ["terminale-a-polynomial-rational-functions:product-of-limits", 45],
  ["terminale-a-polynomial-rational-functions:inverse-and-quotient-limits", 60],
  ["terminale-a-polynomial-rational-functions:horizontal-asymptote", 45],
  ["terminale-a-polynomial-rational-functions:vertical-asymptote", 45],
  ["terminale-a-polynomial-rational-functions:oblique-asymptote", 65],
  ["terminale-a-polynomial-rational-functions:elementary-derivatives", 50],
  ["terminale-a-polynomial-rational-functions:derivative-operations", 60],
  ["terminale-a-polynomial-rational-functions:variations-and-relative-extrema", 75],
  ["terminale-a-polynomial-rational-functions:tangent-equation", 45],
  ["terminale-a-polynomial-rational-functions:intermediate-value-theorem", 60],
  ["terminale-a-polynomial-rational-functions:bisection-method", 55],
  ["terminale-a-polynomial-rational-functions:scanning-method", 50],
  ["terminale-a-polynomial-rational-functions:complete-function-study-mission", 100],
  ["terminale-a1-probability-random-variable:random-experiments-events", 45],
  ["terminale-a1-probability-random-variable:probability-events-subsets", 45],
  ["terminale-a1-probability-random-variable:event-operations", 55],
  ["terminale-a1-probability-random-variable:finite-probability", 60],
  ["terminale-a1-probability-random-variable:probability-event-properties", 60],
  ["terminale-a1-probability-random-variable:probability-equiprobability", 75],
  ["terminale-a1-probability-random-variable:random-variable-law", 85],
  ["terminale-a2-probability:random-experiments-events", 45],
  ["terminale-a2-probability:probability-events-subsets", 45],
  ["terminale-a2-probability:event-operations", 55],
  ["terminale-a2-probability:finite-probability", 60],
  ["terminale-a2-probability:probability-event-properties", 60],
  ["terminale-a2-probability:probability-equiprobability", 75],
  ["terminale-a-natural-logarithm:log-definition-properties", 50],
  ["terminale-a-natural-logarithm:log-algebraic-properties", 55],
  ["terminale-a-natural-logarithm:log-limits-variations", 60],
  ["terminale-a-natural-logarithm:log-derivative-variation", 65],
  ["terminale-a-natural-logarithm:log-equations-inequalities", 75],
  ["terminale-a-natural-logarithm:log-inequalities", 75],
  ["terminale-a-natural-logarithm:log-composite-derivatives", 70],
  ["terminale-a-natural-logarithm:log-primitives", 75],
  ["terminale-a-exponential:exp-definition-properties", 50],
  ["terminale-a-exponential:exp-algebraic-properties", 55],
  ["terminale-a-exponential:exp-limits-variations", 65],
  ["terminale-a-exponential:exp-derivative-variation", 65],
  ["terminale-a-exponential:exp-equations-inequalities", 75],
  ["terminale-a-exponential:exp-inequalities", 75],
  ["terminale-a-exponential:exp-composite-derivatives", 75],
  ["terminale-a-exponential:exp-primitives-a1", 80],
  ["terminale-a-sequences:arithmetic-sequences", 50],
  ["terminale-a-sequences:arithmetic-general-term", 55],
  ["terminale-a-sequences:arithmetic-variation", 45],
  ["terminale-a-sequences:arithmetic-sums", 65],
  ["terminale-a-sequences:geometric-sequences", 50],
  ["terminale-a-sequences:geometric-general-term", 55],
  ["terminale-a-sequences:geometric-variation", 45],
  ["terminale-a-sequences:geometric-sums-modeling", 70],
  ["terminale-a-sequences:savings-career-mission", 85],
  ["terminale-a-bivariate-statistics:statistical-series-scatterplot", 45],
  ["terminale-a-bivariate-statistics:mean-point-marginals", 50],
  ["terminale-a-bivariate-statistics:statistical-scatterplot", 50],
  ["terminale-a-bivariate-statistics:statistical-mean-point", 55],
  ["terminale-a-bivariate-statistics:mayer-adjustment", 60],
  ["terminale-a-bivariate-statistics:mayer-equation", 65],
  ["terminale-a-bivariate-statistics:covariance-correlation-regression", 65],
  ["terminale-a-bivariate-statistics:correlation-regression-a1", 80],
  ["terminale-a-bivariate-statistics:statistical-estimation", 75],
  ["terminale-a-bivariate-statistics:weather-correlation-mission", 90],
  ["terminale-a-linear-systems:substitution-elimination", 60],
  ["terminale-a-linear-systems:log-exp-systems", 70],
  ["terminale-a-linear-systems:linear-inequalities-halfplanes", 65],
  ["terminale-a-linear-systems:inequality-systems-modeling", 75],
  ["terminale-a-linear-systems:awale-mission", 80],
  ["terminale-a-linear-systems:cocktail-programming-mission", 90],
  ["terminale-a-primitives-integrals:primitive-definition-usual-functions", 50],
  ["terminale-a-primitives-integrals:primitive-initial-condition", 55],
  ["terminale-a-primitives-integrals:primitive-usual-functions", 60],
  ["terminale-a-primitives-integrals:primitive-sum", 60],
  ["terminale-a-primitives-integrals:primitive-scalar-multiple", 60],
  ["terminale-a-primitives-integrals:composite-primitives", 70],
  ["terminale-a-primitives-integrals:primitive-logarithmic-form", 75],
  ["terminale-a-primitives-integrals:primitive-exponential-form", 75],
  ["terminale-a-primitives-integrals:definite-integral", 70],
  ["terminale-a-primitives-integrals:integral-positive-area", 75],
  ["terminale-a-primitives-integrals:integral-area", 85],
  ["terminale-a-primitives-integrals:pool-terrace-mission", 90],
]);

const humanitiesMasteryRewards = [40, 55, 60, 65, 70, 80] as const;

const humanitiesLessonSuffixes = [
  ["terminale-hg-g1-cote-ivoire-development-foundations", [
    "overview", "guided-natural-assets", "guided-human-assets",
    "guided-economic-policy-part-1", "guided-economic-policy-part-2", "mission-finale",
  ]],
  ["terminale-hg-g2-cote-ivoire-economic-sectors", [
    "overview", "guided-primary-sector-part-1", "guided-primary-sector-part-2",
    "guided-secondary-sector", "guided-tertiary-sector", "mission-finale",
  ]],
  ["terminale-hg-g3-cote-ivoire-development-challenges", [
    "overview", "guided-general-challenges-part-1", "guided-general-challenges-part-2",
    "guided-sector-challenges", "guided-solutions", "mission-finale",
  ]],
  ["terminale-hg-g4-south-korea-development-foundations", [
    "overview", "guided-territory", "guided-human-capital",
    "guided-development-state-part-1", "guided-development-state-part-2", "mission-finale",
  ]],
  ["terminale-hg-g6-ecowas", [
    "overview", "guided-creation-objectives", "guided-institutions",
    "guided-achievements-limits-part-1", "guided-achievements-limits-part-2", "mission-finale",
  ]],
  ["terminale-hg-g7-eu-acp-cooperation", [
    "overview", "guided-partners", "guided-agreements-part-1",
    "guided-agreements-part-2", "guided-assessment", "mission-finale",
  ]],
  ["terminale-hg-h1-united-nations", [
    "overview", "guided-creation-principles", "guided-organs",
    "guided-assessment-part-1", "guided-assessment-part-2", "mission-finale",
  ]],
  ["terminale-hg-h2-bipolar-world", [
    "overview", "guided-formation-blocs", "guided-crises-coexistence-part-1",
    "guided-crises-coexistence-part-2", "guided-collapse-ussr", "mission-finale",
  ]],
  ["terminale-hg-h3-multipolar-world", [
    "overview", "guided-american-hyperpower-part-1", "guided-american-hyperpower-part-2",
    "guided-world-policeman", "guided-multipolarity", "mission-finale",
  ]],
  ["terminale-hg-h4-african-nationalism", [
    "overview", "guided-factors", "guided-movements-part-1",
    "guided-movements-part-2", "guided-consequences", "mission-finale",
  ]],
  ["terminale-hg-h5-cote-ivoire-independence", [
    "overview", "guided-hope-phase", "guided-struggle-phase",
    "guided-collaboration-independence-part-1", "guided-collaboration-independence-part-2", "mission-finale",
  ]],
  ["terminale-hg-h6-algeria-independence", [
    "overview", "guided-french-algeria", "guided-insurrection",
    "guided-evian-independence-part-1", "guided-evian-independence-part-2", "mission-finale",
  ]],
  ["terminale-hg-h7-african-union", [
    "overview", "guided-birth-objectives", "guided-institutions",
    "guided-assessment-part-1", "guided-assessment-part-2", "mission-finale",
  ]],
  ["terminale-hg-h8-western-values", [
    "overview", "guided-historical-foundations", "guided-politics-economy-part-1",
    "guided-politics-economy-part-2", "guided-social-cultural", "mission-finale",
  ]],
  ["terminale-hg-h9-negro-african-civilization-mutations", [
    "overview", "guided-politics-economy-before-colonization", "guided-society-culture-beliefs",
    "guided-contemporary-mutations-part-1", "guided-contemporary-mutations-part-2", "mission-finale",
  ]],
] as const;

for (const [pathId, suffixes] of humanitiesLessonSuffixes) {
  suffixes.forEach((suffix, index) => {
    lessonRewards.set(`${pathId}:${pathId}-${suffix}`, humanitiesMasteryRewards[index]);
  });
}

const philosophyLessonSuffixes = [
  ["terminale-philo-l1-dissertation", ["overview", "study-subject", "problematisation", "introduction", "development-conclusion", "mission-finale"]],
  ["terminale-philo-l2-text-commentary", ["overview", "problematics", "ordered-study", "philosophical-interest", "introduction-conclusion", "mission-finale"]],
  ["terminale-philo-l3-knowledge-of-man", ["overview", "consciousness-memory", "freedom", "unconscious", "determinism-responsibility", "mission-finale"]],
  ["terminale-philo-l4-social-life", ["overview", "social-human", "others", "state-nation", "social-violence", "mission-finale"]],
  ["terminale-philo-l5-god-religion", ["overview", "god-sacred", "criticism-god", "roles-religion", "religion-freedom", "mission-finale"]],
  ["terminale-philo-l6-history-humanity", ["overview", "humanity-culture", "historicity", "object-subject-history", "decolonize-diversity", "mission-finale"]],
  ["terminale-philo-l7-value-philosophy", ["overview", "philosophy-reason", "myth-reason-opposition", "myth-reason-complementarity", "usefulness-philosophy", "mission-finale"]],
  ["terminale-philo-l8-progress-happiness", ["overview", "desire-passion", "work-technique-art", "material-progress", "conditions-happiness", "mission-finale"]],
  ["terminale-philo-l9-language-truth", ["overview", "communication-language", "language-thought", "criteria-truth", "power-limits-language", "mission-finale"]],
  ["terminale-philo-l10-scientific-knowledge", ["overview", "forms-knowledge", "types-science", "scientific-process", "limits-bioethics", "mission-finale"]],
] as const;

for (const [pathId, suffixes] of philosophyLessonSuffixes) {
  suffixes.forEach((suffix, index) => {
    lessonRewards.set(`${pathId}:${pathId}-${suffix}`, humanitiesMasteryRewards[index]);
  });
}

const svtLessonSuffixes = [
  ["terminale-svt-l1-emotional-reactions", ["overview", "manifestations", "causes-stressors", "nervous-regulation", "hormonal-regulation", "mission-finale"]],
  ["terminale-svt-l2-brain-activity", ["overview", "cerebral-areas", "movement-preparation", "movement-execution", "memory", "mission-finale"]],
  ["terminale-svt-l3-origin-of-life", ["overview", "early-earth-evidence", "photosynthesis-oxygenation", "extreme-environments", "experimental-origin", "mission-finale"]],
  ["terminale-svt-l4-human-lineage", ["overview", "cranial-transformations", "bipedal-stature", "molecular-parentage", "evolution-theories", "mission-finale"]],
  ["terminale-svt-l5-sex-blood-heredity", ["overview", "abo-alleles", "abo-crosses", "sex-chromosomes", "sex-cross", "mission-finale"]],
  ["terminale-svt-l6-genetic-predictions", ["overview", "pedigree-method", "sickle-cell", "hemophilia-x-linked", "screening-counseling", "mission-finale"]],
  ["terminale-svt-l7-protein-biosynthesis", ["overview", "molecular-actors", "genetic-code", "transcription", "translation", "mission-finale"]],
] as const;

for (const [pathId, suffixes] of svtLessonSuffixes) {
  suffixes.forEach((suffix, index) => {
    lessonRewards.set(`${pathId}:${pathId}-${suffix}`, humanitiesMasteryRewards[index]);
  });
}

for (const [pathId, lessonIds] of terminalCMathLessonIds) {
  lessonIds.forEach((lessonId, index) => {
    lessonRewards.set(`${pathId}:${lessonId}`, terminalCMathRewardWeight(index));
  });
}

for (const [pathId, lessonIds] of terminalDMathLessonIds) {
  lessonIds.forEach((lessonId, index) => {
    lessonRewards.set(`${pathId}:${lessonId}`, terminalCMathRewardWeight(index));
  });
}

normalizeLessonRewards(lessonRewards);

export function getLessonReward(pathId: string, lessonId: string) {
  return lessonRewards.get(`${pathId}:${lessonId}`);
}

export function getPathRewardTotal(pathId: string) {
  let total = 0;
  lessonRewards.forEach((reward, key) => {
    if (key.startsWith(`${pathId}:`)) total += reward;
  });
  return total;
}
