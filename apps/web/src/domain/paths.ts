import type { SubjectId } from "./learning";

export type LessonKind = "concept" | "graph" | "practice" | "challenge";

export interface LessonQuestion {
  type?: "choice" | "short-answer";
  prompt: string;
  options: string[];
  correctIndex: number;
  acceptedAnswers?: string[];
  points?: number;
  sourceLabel?: string;
  explanation: string;
}

export interface LessonSourceMetadata {
  documentTitle: string;
  pages: string;
  section: string;
  fidelity: "faithful" | "faithful-corrected" | "adapted";
  corrections: string[];
}

export type FunctionRule =
  | { kind: "linear"; coefficient: number; constant: number }
  | { kind: "quadratic"; coefficient: number; constant: number }
  | { kind: "reciprocal"; shift: number };

interface LessonInteractionBase {
  eyebrow: string;
  title: string;
  instruction: string;
  observation: string;
}

export interface NumericLessonInteraction extends LessonInteractionBase {
  kind?: "numeric";
  formula: string;
  formulaTex?: string;
  inputSymbol?: string;
  outputSuffix?: string;
  rule: FunctionRule;
  input: {
    min: number;
    max: number;
    step: number;
    initial: number;
  };
}

export interface TimelineInteractionItem {
  label: string;
  shortLabel?: string;
  detail: string;
}

export interface TimelineLessonInteraction extends LessonInteractionBase {
  kind: "timeline";
  items: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
}

export type CurveRule =
  | FunctionRule
  /** Coefficients ordonnés par degré croissant : [a0, a1, a2, …] représente a0 + a1·x + a2·x² + … */
  | { kind: "polynomial"; coefficients: number[] }
  /** (a·x + b) / (c·x + d), écrit numerator: [a, b] et denominator: [c, d]. */
  | { kind: "rational-linear"; numerator: [number, number]; denominator: [number, number] }
  /** slope·x + intercept + coefficient / (x − shift) : forme canonique des asymptotes obliques. */
  | { kind: "affine-plus-reciprocal"; slope: number; intercept: number; coefficient: number; shift: number }
  /** slope·x + intercept + coefficient·ln(x), définie pour x > 0 : couvre ln x et les études type Bac de Terminale A. */
  | { kind: "affine-plus-log"; slope: number; intercept: number; coefficient: number }
  /** slope·x + intercept + coefficient·e^(rate·x) : couvre e^x, 1 − e^(−kt) et les études affines-exponentielles. */
  | { kind: "affine-plus-exp"; slope: number; intercept: number; coefficient: number; rate: number };

export interface CurveGuide {
  kind: "vertical" | "horizontal" | "oblique";
  /** vertical : abscisse x=a ; horizontal : ordonnée y=b ; ignoré pour oblique. */
  value?: number;
  slope?: number;
  intercept?: number;
  label: string;
}

export interface CurveLessonInteraction extends LessonInteractionBase {
  kind: "curve";
  formula: string;
  formulaTex?: string;
  rule: CurveRule;
  window: { xMin: number; xMax: number; yMin: number; yMax: number };
  /** Droites remarquables tracées en pointillés : asymptotes, tangentes, seuils. */
  guides?: CurveGuide[];
  /** Point mobile déplacé par l'élève le long de la courbe. */
  marker: { min: number; max: number; step: number; initial: number };
}

export interface DiagramNodeItem {
  id: string;
  label: string;
  /** Rôle court affiché sur la carte, avant sélection. */
  role: string;
  /** Détail complet affiché dans le panneau lorsque la carte est sélectionnée. */
  detail: string;
  /** Regroupe les cartes par famille (organes principaux, organismes spécialisés…). */
  group?: string;
}

/**
 * Schéma explorable : une entité racine et des cartes que l'élève sélectionne pour
 * révéler leur rôle détaillé. Pensé pour les organigrammes d'institutions en
 * Histoire-Géographie, là où la courbe interactive sert les mathématiques.
 */
export interface DiagramLessonInteraction extends LessonInteractionBase {
  kind: "diagram";
  rootLabel: string;
  rootDetail?: string;
  nodes: [DiagramNodeItem, DiagramNodeItem, ...DiagramNodeItem[]];
}

export type LessonInteraction =
  | NumericLessonInteraction
  | TimelineLessonInteraction
  | CurveLessonInteraction
  | DiagramLessonInteraction;

export interface LessonMethod {
  eyebrow: string;
  title: string;
  introduction: string;
  steps: string[];
  example: {
    prompt: string;
    work: string;
    result: string;
  };
  tip?: string;
}

export interface LearningLesson {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  xp: number;
  kind: LessonKind;
  concept: {
    eyebrow: string;
    title: string;
    explanation: string;
    bodyMarkdown?: string;
    notation: string;
    notationTex?: string;
    example: string;
  };
  interaction: LessonInteraction;
  method: LessonMethod;
  question: LessonQuestion;
  /** Multiple questions make partial (10/20) and perfect (20/20) mastery possible. */
  questions?: LessonQuestion[];
  source?: LessonSourceMetadata;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: LearningLesson[];
}

export interface LearningPath {
  id: string;
  subjectId: SubjectId;
  levelIds: string[];
  curriculumLabel: string;
  curriculumSourceUrl: string;
  theme: {
    number: number;
    title: string;
  };
  chapterNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
  outcomes: string[];
  modules: LearningModule[];
}
