import type { LearningPath } from "../domain/paths";
import {
  terminalCLimitsContinuityPath,
  terminalCDerivativesPath,
} from "./terminalCMathPaths01to05";
import {
  terminalCPrimitivesPath,
  terminalCLogarithmsPath,
  terminalCComplexNumbersPath,
  terminalCExponentialPowerPath,
} from "./terminalCMathPaths06to10";
import {
  terminalCSequencesPath,
  terminalCComplexGeometryPath,
  terminalCIntegralCalculusPath,
} from "./terminalCMathPaths11to15";
import {
  terminalCProbabilityPath,
  terminalCDifferentialEquationsPath,
  terminalCStatisticsPath,
} from "./terminalCMathPaths16to19";

interface TerminalDPathSeed {
  id: string;
  chapterNumber: number;
  documentTitle: string;
  source: LearningPath;
}

function adaptTerminalDPath({ id, chapterNumber, documentTitle, source }: TerminalDPathSeed): LearningPath {
  return {
    ...source,
    id,
    levelIds: ["terminale-d"],
    curriculumLabel: "Programme ivoirien • Terminale D • Cours officiel fourni",
    chapterNumber,
    modules: source.modules.map((module) => ({
      ...module,
      id: `${id}-mastery`,
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        source: lesson.source ? { ...lesson.source, documentTitle } : undefined,
      })),
    })),
  };
}

export const terminalDMathematicsPaths: LearningPath[] = [
  adaptTerminalDPath({
    id: "terminale-d-math-l01-limits-continuity",
    chapterNumber: 1,
    documentTitle: "TD Maths leçon 01 LIMITES ET CONTINUITE.pdf",
    source: terminalCLimitsContinuityPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l02-probability",
    chapterNumber: 2,
    documentTitle: "TD Maths leçon 02 Probabilité_1.pdf",
    source: terminalCProbabilityPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l03-derivatives-functions",
    chapterNumber: 3,
    documentTitle: "TD Maths leçon 03 DERIVABILITE ET ETUDE DE FONCTIONS.pdf",
    source: terminalCDerivativesPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l04-primitives",
    chapterNumber: 4,
    documentTitle: "TD Maths leçon 04 PRIMITIVES.pdf",
    source: terminalCPrimitivesPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l05-logarithms",
    chapterNumber: 5,
    documentTitle: "TD Maths leçon 05 FONCTIONS LOGARITHMES.pdf",
    source: terminalCLogarithmsPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l06-complex-numbers",
    chapterNumber: 6,
    documentTitle: "TD Maths leçon 06 Nombres complexes.pdf",
    source: terminalCComplexNumbersPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l07-exponential-power",
    chapterNumber: 7,
    documentTitle: "TD Maths leçon 07 Fonction exponentielle et fonction puissance.pdf",
    source: terminalCExponentialPowerPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l08-complex-geometry",
    chapterNumber: 8,
    documentTitle: "TD Maths lecon 08 Nombres complexes et géometrie du plan.pdf",
    source: terminalCComplexGeometryPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l09-sequences",
    chapterNumber: 9,
    documentTitle: "TD Maths leçon 09 suites numériques.pdf",
    source: terminalCSequencesPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l10-integral-calculus",
    chapterNumber: 10,
    documentTitle: "TD Maths leçon 10 Calcul intégral.pdf",
    source: terminalCIntegralCalculusPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l11-statistics",
    chapterNumber: 11,
    documentTitle: "TD Maths leçon 11 Statistiques.pdf",
    source: terminalCStatisticsPath,
  }),
  adaptTerminalDPath({
    id: "terminale-d-math-l12-differential-equations",
    chapterNumber: 12,
    documentTitle: "TD Maths leçon 12 Equations différentielles.pdf",
    source: terminalCDifferentialEquationsPath,
  }),
];
