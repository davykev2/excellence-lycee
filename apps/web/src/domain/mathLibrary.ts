import type { CurriculumLessonTitle } from "../data/curriculumCatalog";

export const mathDomains = [
  { id: "analyse", label: "Analyse et probabilité" },
  { id: "algebre", label: "Algèbre et géométrie" },
] as const;

export type MathDomain = typeof mathDomains[number]["id"];

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr").trim();
const titles = (values: string[]) => new Set(values.map(normalize));

const analysisTitles = titles([
  "Dénombrement", "Généralités sur les fonctions", "Étude de fonctions élémentaires",
  "Fonctions polynômes et fractions rationnelles", "Statistique", "Statistique à une variable",
  "Dérivabilité et étude de fonctions", "Suites numériques", "Limites et continuité",
  "Extension de la notion de limite", "Dérivation", "Étude et représentation graphique d’une fonction",
  "Probabilité", "Étude de fonctions polynômes et de fonctions rationnelles",
  "Probabilité et variable aléatoire", "Fonction logarithme népérien", "Fonction exponentielle népérienne",
  "Statistique à deux variables", "Primitives et calcul intégral", "Primitives", "Fonctions logarithmes",
  "Fonction exponentielle et fonction puissance", "Calcul intégral",
  "Probabilité conditionnelle et variable aléatoire", "Équations différentielles",
]);
const algebraTitles = titles([
  "Calcul numérique", "Calcul littéral", "Équations et inéquations dans ℝ", "Équations et inéquations",
  "Systèmes d’équations linéaires dans ℝ × ℝ", "Vecteurs et points du plan", "Ensemble des nombres réels",
  "Utilisation des symétries et translations", "Droites et plans de l’espace", "Angles inscrits",
  "Angles orientés et trigonométrie", "Produit scalaire", "Homothéties", "Rotations", "Inéquations dans ℝ × ℝ",
  "Équations et inéquations du second degré dans ℝ", "Barycentre", "Composées de transformations du plan",
  "Orthogonalité dans l’espace", "Systèmes d’équations linéaires dans ℝ² et dans ℝ³", "Géométrie analytique du plan",
  "Vecteurs de l’espace", "Barycentre et lignes de niveau", "Divisibilité dans ℤ",
  "Géométrie analytique de l’espace", "Coniques", "Nombres complexes", "PPCM et PGCD de deux entiers relatifs",
  "Nombres complexes et géométrie du plan", "Isométries du plan", "Similitudes directes du plan",
]);

/** Presentation only: never changes catalogue order, ids, progression or XP. */
export function mathDomainForLesson(lesson: Pick<CurriculumLessonTitle, "subjectId" | "title" | "strand">): MathDomain | undefined {
  if (lesson.subjectId !== "mathematics") return undefined;
  const strand = mathDomains.find(domain => normalize(domain.label) === normalize(lesson.strand ?? ""));
  if (strand) return strand.id;
  const title = normalize(lesson.title);
  if (analysisTitles.has(title)) return "analyse";
  if (algebraTitles.has(title)) return "algebre";
  return undefined;
}

export function isMathDomain(value: unknown): value is MathDomain {
  return mathDomains.some(domain => domain.id === value);
}
