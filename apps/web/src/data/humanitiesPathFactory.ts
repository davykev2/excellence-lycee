import type { LearningLesson, LearningPath, LessonInteraction, LessonKind, LessonQuestion, TimelineInteractionItem } from "../domain/paths";
import { humanitiesAssessmentBlueprints } from "./humanitiesAssessmentBlueprints";

export interface HumanitiesSectionSeed {
  id: string;
  title: string;
  summary: string;
  conceptTitle: string;
  explanation: string;
  /** Cours rédigé : tableaux du document, encadrés et exemples développés. */
  bodyMarkdown?: string;
  /** Remplace la frise par une autre interaction, par exemple un organigramme. */
  interaction?: LessonInteraction;
  /** Exercices supplémentaires tirés du document, en plus du contrôle `check`. */
  extraQuestions?: LessonQuestion[];
  /**
   * Contenus propres à chaque moitié lorsque cette section est celle que le
   * plan d'évaluation découpe en deux niveaux. Sans ces surcharges, le cours
   * rédigé et l'interaction ne seraient pas dupliqués mais simplement absents.
   */
  parts?: [Partial<HumanitiesSectionSeed>, Partial<HumanitiesSectionSeed>];
  keyPoint: string;
  example: string;
  timelineTitle: string;
  timelineInstruction: string;
  timeline: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
  observation: string;
  check: LessonQuestion;
  distractors: [string, string, string];
  durationMinutes?: number;
  xp?: number;
  kind?: LessonKind;
}

export interface HumanitiesCourseSeed {
  id: string;
  strand: "Histoire" | "Géographie";
  chapterNumber: number;
  themeNumber: number;
  themeTitle: string;
  title: string;
  description: string;
  sections: [HumanitiesSectionSeed, HumanitiesSectionSeed, HumanitiesSectionSeed];
}

const asTimeline = (items: TimelineInteractionItem[]) => {
  if (items.length < 2) throw new Error("Une interaction Histoire-Géographie doit contenir au moins deux repères.");
  return items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
};

const methodFor = (section: HumanitiesSectionSeed) => ({
  eyebrow: "Méthode",
  title: "Transformer le cours en réponse claire",
  introduction: "Une réponse solide ne récite pas une liste : elle explique le lien entre une idée, un exemple et son effet.",
  steps: [
    "Nomme précisément l’idée étudiée.",
    "Explique-la avec « parce que » ou « cela signifie que ».",
    "Ajoute un exemple précis tiré du cours.",
    "Relie l’exemple à la question avec une courte conclusion.",
  ],
  example: {
    prompt: `Expliquer l’idée essentielle du niveau « ${section.title} ».`,
    work: `Je présente l’idée, puis je m’appuie sur ce repère : ${section.timeline[0].label} — ${section.timeline[0].detail}`,
    result: section.keyPoint,
  },
  tip: "Utilise les connecteurs « en effet », « par exemple », « cependant » et « donc ».",
});

const sectionToLesson = (
  course: HumanitiesCourseSeed,
  section: HumanitiesSectionSeed,
  lessonIndex: number,
): LearningLesson => ({
  id: `${course.id}-guided-${section.id}`,
  title: section.title,
  summary: section.summary,
  durationMinutes: section.durationMinutes ?? 12,
  xp: section.xp ?? 50 + lessonIndex * 5,
  kind: section.kind ?? (lessonIndex <= 1 ? "concept" : lessonIndex <= 3 ? "practice" : "challenge"),
  concept: {
    eyebrow: `Niveau ${lessonIndex + 1} • ${course.strand}`,
    title: section.conceptTitle,
    explanation: section.explanation,
    bodyMarkdown: section.bodyMarkdown,
    notation: section.keyPoint,
    example: section.example,
  },
  interaction: section.interaction ?? {
    kind: "timeline",
    eyebrow: "Explorer",
    title: section.timelineTitle,
    instruction: section.timelineInstruction,
    items: section.timeline,
    observation: section.observation,
  },
  method: methodFor(section),
  question: section.check,
  questions: [
    section.check,
    ...(section.extraQuestions ?? []),
    {
      prompt: "Quel énoncé résume correctement cette partie du cours ?",
      options: [section.distractors[0], section.keyPoint, section.distractors[1], section.distractors[2]],
      correctIndex: 1,
      explanation: section.keyPoint,
    },
  ],
});

const splitSection = (section: HumanitiesSectionSeed): [HumanitiesSectionSeed, HumanitiesSectionSeed] => {
  // Les contenus longs ne sont jamais recopiés tels quels dans les deux moitiés :
  // chaque partie reçoit les siens via `section.parts`.
  const { bodyMarkdown: _body, interaction: _interaction, extraQuestions: _extra, parts, ...shared } = section;
  const base = shared as HumanitiesSectionSeed;
  const [first, ...remaining] = section.timeline;
  const secondPartItems = remaining.length >= 2
    ? remaining
    : [remaining[0], { label: "Idée essentielle", detail: section.keyPoint }];
  const firstTitle = first.shortLabel ?? first.label;
  const secondTitle = secondPartItems.map((item) => item.shortLabel ?? item.label).join(" et ");

  return [
    {
      ...base,
      ...(parts?.[0] ?? {}),
      id: `${section.id}-part-1`,
      title: firstTitle,
      summary: `Comprendre le repère « ${first.label} » et son rôle dans la leçon.`,
      conceptTitle: first.label,
      explanation: first.detail,
      timelineTitle: `Du repère à son effet`,
      timelineInstruction: "Observe d’abord le fait, puis l’exemple qui montre son importance.",
      timeline: [first, { label: "Application", detail: section.example }],
      observation: section.keyPoint,
    },
    {
      ...base,
      ...(parts?.[1] ?? {}),
      id: `${section.id}-part-2`,
      title: secondTitle,
      summary: `Relier ${secondTitle} pour compléter cette partie du cours.`,
      conceptTitle: secondTitle,
      explanation: secondPartItems.map((item) => item.detail).join(" "),
      timelineTitle: section.timelineTitle,
      timelineInstruction: "Compare les repères pour comprendre leur enchaînement.",
      timeline: asTimeline(secondPartItems),
      check: {
        prompt: "Quel repère appartient à cette partie du cours ?",
        options: [first.label, secondPartItems[0].label, section.distractors[0], section.distractors[1]],
        correctIndex: 1,
        explanation: `${secondPartItems[0].label} fait partie des repères étudiés dans ce niveau.`,
      },
    },
  ];
};

const overviewLesson = (course: HumanitiesCourseSeed): LearningLesson => {
  const blueprint = humanitiesAssessmentBlueprints[course.id];
  const axes = course.sections.map((section) => section.title);
  return {
    id: `${course.id}-overview`,
    title: "Les repères essentiels",
    summary: "Voir toute la leçon en une carte simple avant d’étudier chaque partie.",
    durationMinutes: 10,
    xp: 40,
    kind: "concept",
    concept: {
      eyebrow: `Niveau 1 • ${course.strand}`,
      title: course.title,
      explanation: `Cette leçon s’organise autour de trois axes : ${axes.join(" ; ")}. Commence par comprendre leurs liens avant de mémoriser les détails.`,
      notation: blueprint.memorySentence,
      example: course.description,
    },
    interaction: {
      kind: "timeline",
      eyebrow: "Vue d’ensemble",
      title: "Les trois axes de la leçon",
      instruction: "Sélectionne chaque axe pour découvrir la question à laquelle il répond.",
      items: course.sections.map((section) => ({ label: section.title, detail: section.summary })) as [TimelineInteractionItem, TimelineInteractionItem, TimelineInteractionItem],
      observation: "À l’évaluation, ces axes doivent être reliés pour expliquer et justifier une réponse.",
    },
    method: {
      eyebrow: "Réflexe BAC",
      title: "Reconnaître les trois types de consignes",
      introduction: "Les situations d’évaluation utilisent presque toujours la même progression.",
      steps: [
        "Identifier : nommer clairement le thème ou le problème.",
        "Expliquer : reformuler l’idée et montrer pourquoi elle est vraie.",
        "Prendre position ou proposer : annoncer un avis et le justifier.",
        "Conclure : répondre directement à la consigne en une phrase.",
      ],
      example: {
        prompt: "Comment aborder une situation d’évaluation ?",
        work: "Je repère le thème, le passage à expliquer et la position que je dois défendre.",
        result: "Identifier → expliquer → argumenter → conclure.",
      },
      tip: "Avant d’écrire, souligne le verbe de chaque consigne.",
    },
    question: {
      prompt: "Quel est le meilleur réflexe avant d’apprendre les détails ?",
      options: ["Mémoriser toutes les dates sans plan", "Repérer les grandes parties et leurs liens", "Ignorer la situation d’évaluation", "Commencer directement par la conclusion"],
      correctIndex: 1,
      explanation: "Le plan donne du sens aux informations et facilite ensuite la mémorisation.",
    },
    questions: [
      {
        prompt: "Quel est le meilleur réflexe avant d’apprendre les détails ?",
        options: ["Mémoriser toutes les dates sans plan", "Repérer les grandes parties et leurs liens", "Ignorer la situation d’évaluation", "Commencer directement par la conclusion"],
        correctIndex: 1,
        explanation: "Le plan donne du sens aux informations et facilite ensuite la mémorisation.",
      },
      {
        prompt: "Quelle suite correspond aux consignes les plus fréquentes ?",
        options: ["Copier → réciter → arrêter", "Identifier → expliquer → argumenter", "Calculer → tracer → mesurer", "Décrire → oublier → recommencer"],
        correctIndex: 1,
        explanation: "Les sujets analysés demandent généralement d’identifier, d’expliquer puis de prendre position ou proposer.",
      },
    ],
  };
};

const missionLesson = (course: HumanitiesCourseSeed): LearningLesson => {
  const blueprint = humanitiesAssessmentBlueprints[course.id];
  const { mission } = blueprint;
  return {
    id: `${course.id}-mission-finale`,
    title: "Mission finale",
    summary: mission.title,
    durationMinutes: 18,
    xp: 80,
    kind: "challenge",
    concept: {
      eyebrow: `Niveau 6 • Mission ${course.strand}`,
      title: mission.title,
      explanation: mission.scenario,
      bodyMarkdown: mission.bodyMarkdown,
      notation: "Identifier le problème → expliquer avec le cours → prendre position ou proposer → justifier.",
      example: "Lis les trois consignes avant de répondre : elles indiquent quelles parties de la leçon mobiliser.",
    },
    interaction: {
      kind: "timeline",
      eyebrow: "Préparer",
      title: "Construire ta réponse en trois mouvements",
      instruction: "Parcours les trois consignes de la mission avant de lancer l’évaluation.",
      items: [
        { label: "1. Identifier", shortLabel: "Identifier", detail: mission.questions[0].prompt },
        { label: "2. Expliquer", shortLabel: "Expliquer", detail: mission.questions[1].prompt },
        { label: "3. Argumenter", shortLabel: "Argumenter", detail: mission.questions[2].prompt },
      ],
      observation: "Chaque réponse doit reprendre des mots de la consigne et au moins un exemple précis du cours.",
    },
    method: {
      eyebrow: "Méthode BAC",
      title: "Réussir une situation d’évaluation",
      introduction: "Traite chaque consigne séparément, puis vérifie que toutes tes réponses restent liées au problème central.",
      steps: [
        "Écris : « Il s’agit de… » pour identifier précisément le problème.",
        "Écris : « Cela signifie que… En effet… Par exemple… » pour expliquer.",
        "Écris : « Je partage / je ne partage pas cet avis… » puis donne deux arguments.",
        "Ajoute une nuance avec « cependant » avant de conclure.",
      ],
      example: {
        prompt: mission.title,
        work: "Je formule ma position, je sélectionne deux connaissances du cours et je les relie au sujet.",
        result: mission.modelAnswer,
      },
      tip: "Une opinion sans connaissance du cours n’est pas une justification.",
    },
    question: mission.questions[0],
    questions: [...mission.questions, ...(mission.extraQuestions ?? [])],
  };
};

export const createHumanitiesPath = (course: HumanitiesCourseSeed): LearningPath => {
  const blueprint = humanitiesAssessmentBlueprints[course.id];
  if (!blueprint) throw new Error(`Plan d’évaluation manquant pour ${course.id}`);

  const contentLessons: LearningLesson[] = [];
  let lessonIndex = 1;
  course.sections.forEach((section, sectionIndex) => {
    if (sectionIndex === blueprint.splitSectionIndex) {
      splitSection(section).forEach((part) => {
        contentLessons.push(sectionToLesson(course, part, lessonIndex));
        lessonIndex += 1;
      });
      return;
    }
    contentLessons.push(sectionToLesson(course, section, lessonIndex));
    lessonIndex += 1;
  });

  const lessons = [overviewLesson(course), ...contentLessons, missionLesson(course)];
  return {
    id: course.id,
    subjectId: "history-geography",
    levelIds: ["terminale-a", "terminale-c", "terminale-d"],
    curriculumLabel: "Programme ivoirien • Terminale • Côte d’Ivoire École Numérique",
    curriculumSourceUrl: "https://www.ecole-ci.online/",
    theme: { number: course.themeNumber, title: course.themeTitle },
    chapterNumber: course.chapterNumber,
    title: course.title,
    description: course.description,
    estimatedMinutes: lessons.reduce((total, lesson) => total + lesson.durationMinutes, 0),
    outcomes: [
      ...course.sections.map((section) => section.summary),
      "Traiter une situation d’évaluation en identifiant, expliquant et argumentant.",
    ],
    modules: [{
      id: `${course.id}-mastery`,
      title: `Maîtriser la leçon de ${course.strand.toLocaleLowerCase("fr")}`,
      description: "Cinq niveaux courts pour comprendre, puis une mission finale inspirée des évaluations du cours officiel.",
      lessons,
    }],
  };
};
