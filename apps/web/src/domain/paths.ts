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
  /**
   * Points de mesure d'une courbe expérimentale, ordonnés par abscisse croissante.
   * Le tracé relie les points ; la valeur intermédiaire est interpolée linéairement.
   * Indispensable pour les enregistrements de laboratoire (potentiel d'action…),
   * qu'aucune formule ne décrit fidèlement.
   */
  | { kind: "samples"; points: Array<[number, number]> }
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

/**
 * Animation d'un mouvement circulaire : un point parcourt un cercle sous le
 * contrôle d'un curseur d'angle, avec ses vecteurs vitesse (tangent) et
 * accélération (centripète). Pensé pour la cinématique, là où la courbe sert
 * les graphes horaires.
 */
export interface OrbitLessonInteraction extends LessonInteractionBase {
  kind: "orbit";
  formula: string;
  formulaTex?: string;
  /** Étiquette du rayon affichée sur la figure, par exemple « R = 20 cm ». */
  radiusLabel?: string;
  showVelocity?: boolean;
  showAcceleration?: boolean;
  /** Angle du point mobile, en degrés, piloté au curseur. */
  marker: { min: number; max: number; step: number; initial: number };
}

/** Primitives de dessin, volontairement sérialisables (aucun JSX dans les données). */
export type SchemaShape =
  | { shape: "path"; d: string; tone?: SchemaTone }
  | { shape: "line"; x1: number; y1: number; x2: number; y2: number; tone?: SchemaTone }
  | { shape: "circle"; cx: number; cy: number; r: number; tone?: SchemaTone }
  | { shape: "ellipse"; cx: number; cy: number; rx: number; ry: number; rotate?: number; tone?: SchemaTone }
  | { shape: "text"; x: number; y: number; content: string; anchor?: "start" | "middle" | "end" };

export type SchemaTone = "outline" | "fill" | "soft" | "accent" | "muted";

export interface SchemaHotspot {
  id: string;
  /** Numéro du repère, affiché dans la pastille cliquable. */
  number: number;
  label: string;
  detail: string;
  x: number;
  y: number;
  /** Éléments du dessin mis en évidence quand ce repère est sélectionné. */
  highlight?: SchemaShape[];
}

export interface SchemaZone {
  label: string;
  xStart: number;
  xEnd: number;
}

/**
 * Figure annotée : un dessin original en SVG et des repères numérotés que l'élève
 * sélectionne pour éclairer la partie correspondante et lire sa définition.
 * Pensée pour les schémas de SVT, où savoir situer une structure fait partie du programme.
 */
export interface SchemaLessonInteraction extends LessonInteractionBase {
  kind: "schema";
  viewBox: string;
  caption?: string;
  shapes: SchemaShape[];
  /** Bandeaux de territoires affichés au-dessus du dessin (substance grise, blanche…). */
  zones?: SchemaZone[];
  hotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]];
}

export type LessonInteraction =
  | NumericLessonInteraction
  | TimelineLessonInteraction
  | CurveLessonInteraction
  | DiagramLessonInteraction
  | OrbitLessonInteraction
  | SchemaLessonInteraction;

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
  /**
   * Présentation élève du contenu. Les anciens parcours restent des routes de
   * maîtrise par défaut ; les cours migrés s'ouvrent comme un document continu.
   * Les identifiants de LearningLesson restent alors conservés en arrière-plan
   * pour ne pas invalider les progressions et retours déjà enregistrés.
   */
  presentation?: "mastery-road" | "continuous-course";
  curriculumLabel: string;
  curriculumSourceUrl: string;
  theme: {
    number: number;
    title: string;
  };
  chapterNumber: number;
  /** Numéro propre à chaque classe lorsqu'un même contenu est partagé entre plusieurs progressions. */
  chapterNumberByLevel?: Record<string, number>;
  title: string;
  description: string;
  estimatedMinutes: number;
  outcomes: string[];
  modules: LearningModule[];
}
