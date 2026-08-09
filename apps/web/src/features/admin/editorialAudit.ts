import type { LearningPath } from "../../domain/paths";
import type { SubjectId } from "../../domain/learning";
import type { CurriculumLessonTitle } from "../../data/curriculumCatalog";
import { schoolLevels } from "../../data/programme";

// Une frise ou un compteur seul ne suffit pas à transformer une fiche compacte
// en véritable leçon. Ces interactions demandent, elles, une exploitation active.
const richInteractionKinds = new Set(["diagram", "curve", "orbit", "schema"]);
const seriesByLevelId = new Map(schoolLevels.map((level) => [level.id, level.series] as const));
const stageByLevelId = new Map(schoolLevels.map((level) => [level.id, level.stage] as const));

export interface EditorialAudit {
  id: string;
  subjectId: SubjectId;
  title: string;
  chapterNumber: number;
  themeTitle: string;
  levelIds: string[];
  series: string[];
  levels: number;
  enrichedLevels: number;
  bodyLevels: number;
  richLevels: number;
  questions: number;
  xp: number;
  published: boolean;
  catalogEntries: number;
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function auditPublishedPath(path: LearningPath): EditorialAudit {
  const lessons = path.modules.flatMap((module) => module.lessons);
  let enrichedLevels = 0;
  let bodyLevels = 0;
  let richLevels = 0;
  let questions = 0;
  let xp = 0;

  for (const lesson of lessons) {
    const bodyLength = lesson.concept.bodyMarkdown?.trim().length ?? 0;
    const hasBody = bodyLength > 0;
    const hasRich = richInteractionKinds.has(lesson.interaction.kind ?? "");
    const questionCount = lesson.questions?.length ?? 0;
    // La carte de synthèse des Humanités est produite par la fabrique et ne
    // correspond pas à un ancien résumé automatique en attente de rédaction.
    const isSynthesis = lesson.id.endsWith("-overview");
    // Maths et Physique-Chimie ont longtemps disposé de petits blocs générés.
    // Ils ne deviennent complets qu'avec un développement substantiel, une vraie
    // série d'exercices ou une interaction riche accompagnée de pratique.
    const needsSubstantiveScienceContent = path.subjectId === "mathematics"
      || path.subjectId === "physics-chemistry";
    const isSubstantiveScienceLevel = bodyLength >= 600
      || questionCount >= 3
      || (hasRich && questionCount >= 2);
    const isEnriched = needsSubstantiveScienceContent
      ? isSubstantiveScienceLevel
      : hasBody || hasRich || isSynthesis;

    if (hasBody) bodyLevels += 1;
    if (hasRich) richLevels += 1;
    if (isEnriched) enrichedLevels += 1;
    questions += questionCount;
    xp += lesson.xp;
  }

  return {
    id: path.id,
    subjectId: path.subjectId,
    title: path.title,
    chapterNumber: path.chapterNumber,
    themeTitle: path.theme.title,
    levelIds: path.levelIds,
    series: unique(path.levelIds.map((id) => seriesByLevelId.get(id) ?? id)),
    levels: lessons.length,
    enrichedLevels,
    bodyLevels,
    richLevels,
    questions,
    xp,
    published: true,
    catalogEntries: 0,
  };
}

function normalizedTitle(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("fr")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function catalogGroupKey(lesson: CurriculumLessonTitle) {
  if (lesson.pathId) return `path:${lesson.pathId}`;
  const stage = stageByLevelId.get(lesson.levelId) ?? lesson.levelId;
  return ["catalog", stage, lesson.subjectId, normalizedTitle(lesson.strand ?? ""), normalizedTitle(lesson.title)].join(":");
}

/**
 * Construit le référentiel éditorial à partir du programme officiel, puis y
 * rattache les parcours réellement publiés. Une leçon seulement titrée dans le
 * catalogue reste donc visible au lieu de disparaître du dénominateur.
 */
export function buildEditorialAudits(
  paths: readonly LearningPath[],
  curriculum: readonly CurriculumLessonTitle[],
): EditorialAudit[] {
  const publishedById = new Map(paths.map((path) => [path.id, auditPublishedPath(path)] as const));
  const groups = new Map<string, CurriculumLessonTitle[]>();

  for (const lesson of curriculum) {
    const key = catalogGroupKey(lesson);
    const entries = groups.get(key) ?? [];
    entries.push(lesson);
    groups.set(key, entries);
  }

  const audits: EditorialAudit[] = [];
  const attachedPathIds = new Set<string>();

  for (const [key, entries] of groups) {
    const first = entries[0];
    const pathId = entries.find((entry) => entry.pathId)?.pathId;
    const published = pathId ? publishedById.get(pathId) : undefined;
    const levelIds = unique(entries.map((entry) => entry.levelId));
    const series = unique(levelIds.map((id) => seriesByLevelId.get(id) ?? id));

    if (published && pathId) {
      attachedPathIds.add(pathId);
      audits.push({
        ...published,
        levelIds: unique([...published.levelIds, ...levelIds]),
        series: unique([...published.series, ...series]),
        catalogEntries: entries.length,
      });
      continue;
    }

    audits.push({
      id: key,
      subjectId: first.subjectId,
      title: first.title,
      chapterNumber: Math.min(...entries.map((entry) => entry.sequence)),
      themeTitle: first.strand ?? "Programme officiel",
      levelIds,
      series,
      levels: 0,
      enrichedLevels: 0,
      bodyLevels: 0,
      richLevels: 0,
      questions: 0,
      xp: 0,
      published: false,
      catalogEntries: entries.length,
    });
  }

  // Les parcours spéciaux ou expérimentaux qui ne figurent pas encore dans le
  // catalogue restent contrôlables par l'équipe éditoriale.
  for (const [pathId, audit] of publishedById) {
    if (!attachedPathIds.has(pathId)) audits.push(audit);
  }

  return audits;
}

export type EditorialStatus = "complete" | "partial" | "todo";

export function editorialStatusOf(audit: EditorialAudit): EditorialStatus {
  if (!audit.published || audit.enrichedLevels === 0) return "todo";
  if (audit.levels > 0 && audit.enrichedLevels >= audit.levels) return "complete";
  return "partial";
}
