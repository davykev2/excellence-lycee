import type { HomeworkGradingMode, HomeworkImportPackage } from "./homeworkReviewTypes";

export type HomeworkImportIssueSeverity = "error" | "warning";

export interface HomeworkImportInspectionIssue {
  severity: HomeworkImportIssueSeverity;
  path: string;
  message: string;
}

export interface HomeworkImportInspection {
  package: HomeworkImportPackage | null;
  valid: boolean;
  metadata: {
    title: string;
    institution: string;
    academicYear: string;
    subject: string;
    level: string;
    series: string;
    durationSeconds: number;
  };
  counts: {
    sections: number;
    exercises: number;
    questions: number;
    auto: number;
    manual: number;
    hybrid: number;
    rubricCriteria: number;
    detailedCorrections: number;
  };
  totalPoints: number;
  issues: HomeworkImportInspectionIssue[];
}

type UnknownRecord = Record<string, unknown>;

const identifierPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{2,119}$/;
const canonicalSubjects = new Set([
  "mathematics", "physics-chemistry", "french", "english", "svt", "philosophy", "history-geography",
]);
const canonicalLevels = new Set([
  "seconde-a", "seconde-c", "premiere-a", "premiere-c", "premiere-d",
  "terminale-a", "terminale-c", "terminale-d",
]);
const allowedRootKeys = new Set([
  "importId", "stableId", "slug", "title", "number", "institution", "academicYear",
  "subject", "level", "series", "durationSeconds", "gradingMode", "instructionsMarkdown", "sourceNotice",
  "maxAttempts", "subjectPublished", "correctionsPublished", "sections",
]);

const emptyMetadata = {
  title: "",
  institution: "",
  academicYear: "",
  subject: "",
  level: "",
  series: "",
  durationSeconds: 0,
};

function record(value: unknown): UnknownRecord | null {
  return value != null && typeof value === "object" && !Array.isArray(value)
    ? value as UnknownRecord
    : null;
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function finitePositive(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : 0;
}

function finiteNonNegative(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function displayEntity(value: unknown, fallback = "") {
  if (typeof value === "string") return value.trim();
  const entity = record(value);
  return textValue(entity?.name) || textValue(entity?.label) || textValue(entity?.id) || fallback;
}

function gradingMode(value: unknown): HomeworkGradingMode | null {
  return value === "auto" || value === "manual" || value === "hybrid" ? value : null;
}

function hasPrivateAnswer(question: UnknownRecord) {
  const answerValues = [
    question.correctAnswer,
    question.expectedAnswer,
    question.answerKey,
    question.acceptedAnswers,
  ];
  if (answerValues.some((value) => (
    (typeof value === "string" && value.trim().length > 0)
    || (Array.isArray(value) && value.length > 0)
    || (record(value) != null && Object.keys(record(value)!).length > 0)
  ))) return true;

  const correction = record(question.correction);
  if (correction && (
    textValue(correction.expectedAnswer)
    || textValue(correction.correctAnswer)
    || list(correction.acceptedAnswers).length > 0
  )) return true;

  return list(question.choices).some((choice) => record(choice)?.isCorrect === true);
}

function hasDetailedCorrection(question: UnknownRecord) {
  const correction = record(question.correction);
  return Boolean(
    textValue(question.explanationMarkdown)
    || textValue(question.correctionMarkdown)
    || textValue(correction?.explanationMarkdown)
    || textValue(correction?.markdown),
  );
}

function rubricFor(question: UnknownRecord) {
  const correction = record(question.correction);
  const raw = list(question.rubricCriteria).length > 0
    ? list(question.rubricCriteria)
    : list(question.rubric).length > 0
      ? list(question.rubric)
      : list(correction?.rubricCriteria);
  return raw.map(record).filter((criterion): criterion is UnknownRecord => criterion != null);
}

function questionCollections(root: UnknownRecord) {
  const sections = list(root.sections).map(record).filter((section): section is UnknownRecord => section != null);
  const directExercises = list(root.exercises).map(record).filter((exercise): exercise is UnknownRecord => exercise != null);
  const exercises = sections.flatMap((section) => (
    list(section.exercises).map(record).filter((exercise): exercise is UnknownRecord => exercise != null)
  ));
  const effectiveExercises = exercises.length > 0 ? exercises : directExercises;
  const directQuestions = list(root.questions).map(record).filter((question): question is UnknownRecord => question != null);
  const questions = effectiveExercises.flatMap((exercise) => (
    list(exercise.questions).map(record).filter((question): question is UnknownRecord => question != null)
  ));
  return {
    sections,
    exercises: effectiveExercises,
    questions: questions.length > 0 ? questions : directQuestions,
  };
}

function requiredText(
  issues: HomeworkImportInspectionIssue[],
  value: unknown,
  path: string,
  label: string,
) {
  const result = textValue(value);
  if (!result) issues.push({ severity: "error", path, message: `${label} est obligatoire.` });
  return result;
}

export function inspectHomeworkImportPackage(value: unknown): HomeworkImportInspection {
  const issues: HomeworkImportInspectionIssue[] = [];
  const root = record(value);
  if (!root) {
    return {
      package: null,
      valid: false,
      metadata: emptyMetadata,
      counts: {
        sections: 0, exercises: 0, questions: 0, auto: 0, manual: 0, hybrid: 0,
        rubricCriteria: 0, detailedCorrections: 0,
      },
      totalPoints: 0,
      issues: [{ severity: "error", path: "$", message: "Le paquet doit être un objet JSON." }],
    };
  }

  for (const key of Object.keys(root)) {
    if (!allowedRootKeys.has(key)) {
      issues.push({ severity: "error", path: key, message: `Le champ « ${key} » n’est pas reconnu par le format d’import.` });
    }
  }

  const metadataRoot = record(root.metadata) ?? root;
  const importId = textValue(root.importId);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(importId)) {
    issues.push({ severity: "error", path: "importId", message: "importId doit être un UUID stable pour rendre l’import idempotent." });
  }
  if (!identifierPattern.test(textValue(root.stableId))) {
    issues.push({ severity: "error", path: "stableId", message: "L’identifiant stable doit contenir 3 à 120 lettres, chiffres ou tirets." });
  }
  if (!identifierPattern.test(textValue(root.slug))) {
    issues.push({ severity: "error", path: "slug", message: "Le slug doit contenir 3 à 120 lettres, chiffres ou tirets." });
  }
  if (!Number.isInteger(root.number) || (root.number as number) < 1) {
    issues.push({ severity: "error", path: "number", message: "Le numéro du devoir doit être un entier positif." });
  }
  const title = requiredText(issues, metadataRoot.title, "title", "Le titre");
  const institution = requiredText(issues, metadataRoot.institution, "institution", "L’établissement");
  const academicYear = requiredText(
    issues,
    metadataRoot.academicYear ?? metadataRoot.schoolYear,
    "academicYear",
    "L’année scolaire",
  );
  if (academicYear && !/^20\d{2}[–-]20\d{2}$/.test(academicYear)) {
    issues.push({ severity: "error", path: "academicYear", message: "L’année scolaire doit suivre le format 2025-2026." });
  }
  const subject = displayEntity(metadataRoot.subject) || requiredText(
    issues,
    metadataRoot.subjectId,
    "subjectId",
    "La matière",
  );
  const level = displayEntity(metadataRoot.level) || requiredText(
    issues,
    metadataRoot.levelId,
    "levelId",
    "Le niveau",
  );
  const series = displayEntity(metadataRoot.series) || requiredText(
    issues,
    metadataRoot.seriesId,
    "seriesId",
    "La série",
  );
  const subjectEntity = record(root.subject);
  const levelEntity = record(root.level);
  const seriesEntity = record(root.series);
  if (!subjectEntity || !canonicalSubjects.has(textValue(subjectEntity.id)) || !textValue(subjectEntity.name)) {
    issues.push({ severity: "error", path: "subject", message: "La matière doit contenir un id canonique et un nom lisible." });
  }
  if (!levelEntity || !canonicalLevels.has(textValue(levelEntity.id)) || !textValue(levelEntity.name)) {
    issues.push({ severity: "error", path: "level", message: "Le niveau doit contenir un id canonique et un nom lisible." });
  }
  if (!seriesEntity || !textValue(seriesEntity.id) || !textValue(seriesEntity.name)) {
    issues.push({ severity: "error", path: "series", message: "La série doit contenir un id et un nom lisible." });
  }
  const durationSeconds = finitePositive(metadataRoot.durationSeconds);
  if (!Number.isInteger(durationSeconds) || durationSeconds < 60 || durationSeconds > 8 * 60 * 60) {
    issues.push({ severity: "error", path: "durationSeconds", message: "La durée doit être un nombre entier compris entre 60 secondes et 8 heures." });
  }
  if (!gradingMode(metadataRoot.gradingMode)) {
    issues.push({ severity: "error", path: "gradingMode", message: "Le mode global doit être auto, manual ou hybrid." });
  }
  if (!Number.isInteger(metadataRoot.maxAttempts) || (metadataRoot.maxAttempts as number) < 1 || (metadataRoot.maxAttempts as number) > 10) {
    issues.push({ severity: "error", path: "maxAttempts", message: "Le nombre maximal de tentatives doit être un entier compris entre 1 et 10." });
  }
  if (root.subjectPublished === true || root.correctionsPublished === true) {
    issues.push({
      severity: "warning",
      path: "subjectPublished",
      message: "L’import administrateur créera malgré tout un brouillon fermé ; l’ouverture se fait ensuite séparément.",
    });
  }

  const { sections, exercises, questions } = questionCollections(root);
  if (sections.length === 0) {
    issues.push({ severity: "error", path: "sections", message: "Ajoute au moins une section contenant les exercices." });
  }
  if (exercises.length === 0) {
    issues.push({ severity: "error", path: "sections[].exercises", message: "Ajoute au moins un exercice." });
  }
  if (questions.length === 0) {
    issues.push({ severity: "error", path: "questions", message: "Ajoute au moins une question évaluable." });
  }

  const counts = {
    sections: sections.length,
    exercises: exercises.length,
    questions: questions.length,
    auto: 0,
    manual: 0,
    hybrid: 0,
    rubricCriteria: 0,
    detailedCorrections: 0,
  };
  let totalPoints = 0;
  const ids = new Set<string>();

  const sectionOrders = sections.map((section) => Number(section.order)).sort((left, right) => left - right);
  if (sectionOrders.some((order, index) => order !== index + 1)) {
    issues.push({ severity: "error", path: "sections[].order", message: "Les sections doivent être numérotées sans interruption à partir de 1." });
  }
  sections.forEach((section, sectionIndex) => {
    const sectionPath = `sections[${sectionIndex}]`;
    if (!identifierPattern.test(textValue(section.id))) {
      issues.push({ severity: "error", path: `${sectionPath}.id`, message: `L’identifiant de la section ${sectionIndex + 1} est invalide.` });
    }
    if (textValue(section.title).length < 2) {
      issues.push({ severity: "error", path: `${sectionPath}.title`, message: `Le titre de la section ${sectionIndex + 1} est obligatoire.` });
    }
    const sectionExercises = list(section.exercises).map(record).filter((exercise): exercise is UnknownRecord => exercise != null);
    const orders = sectionExercises.map((exercise) => Number(exercise.order)).sort((left, right) => left - right);
    if (orders.some((order, index) => order !== index + 1)) {
      issues.push({ severity: "error", path: `${sectionPath}.exercises[].order`, message: "Les exercices doivent être numérotés sans interruption à partir de 1." });
    }
    sectionExercises.forEach((exercise, exerciseIndex) => {
      const exercisePath = `${sectionPath}.exercises[${exerciseIndex}]`;
      if (!identifierPattern.test(textValue(exercise.id))) {
        issues.push({ severity: "error", path: `${exercisePath}.id`, message: `L’identifiant de l’exercice ${exerciseIndex + 1} est invalide.` });
      }
      if (textValue(exercise.title).length < 2) {
        issues.push({ severity: "error", path: `${exercisePath}.title`, message: `Le titre de l’exercice ${exerciseIndex + 1} est obligatoire.` });
      }
      if (list(exercise.questions).length === 0) {
        issues.push({ severity: "error", path: `${exercisePath}.questions`, message: `L’exercice ${exerciseIndex + 1} ne contient aucune question.` });
      }
    });
  });

  questions.forEach((question, index) => {
    const path = `questions[${index}]`;
    const id = textValue(question.id);
    if (!identifierPattern.test(id)) {
      issues.push({ severity: "error", path: `${path}.id`, message: `L’identifiant de la question ${index + 1} est invalide.` });
    } else if (ids.has(id)) {
      issues.push({ severity: "error", path: `${path}.id`, message: `L’identifiant « ${id} » est utilisé plusieurs fois.` });
    } else {
      ids.add(id);
    }

    if (!textValue(question.promptMarkdown) && !textValue(question.prompt)) {
      issues.push({ severity: "error", path: `${path}.promptMarkdown`, message: `La question ${index + 1} n’a pas d’énoncé.` });
    }
    if (!textValue(question.label)) {
      issues.push({ severity: "error", path: `${path}.label`, message: `Le libellé de la question ${index + 1} est obligatoire.` });
    }
    if (question.type !== "qcm" && question.type !== "texte") {
      issues.push({ severity: "error", path: `${path}.type`, message: `Le type de la question ${index + 1} doit être qcm ou texte.` });
    }
    if (!["single-choice", "true-false", "short-text", "number", "formula", "essay"].includes(textValue(question.answerKind))) {
      issues.push({ severity: "error", path: `${path}.answerKind`, message: `Le type de réponse de la question ${index + 1} est invalide.` });
    }

    const points = finitePositive(question.points);
    totalPoints += points;
    if (!points) {
      issues.push({ severity: "error", path: `${path}.points`, message: `Le barème de la question ${index + 1} doit être positif.` });
    }

    const mode = gradingMode(question.gradingMode);
    const neutralized = question.isNeutralized === true;
    if (!mode) {
      issues.push({ severity: "error", path: `${path}.gradingMode`, message: `Choisis auto, manual ou hybrid pour la question ${index + 1}.` });
      return;
    }
    counts[mode] += 1;

    const declaredManualMaximum = finiteNonNegative(question.manualPoints);
    const declaredAutoMaximum = finiteNonNegative(question.autoPoints);
    if (declaredManualMaximum == null) {
      issues.push({ severity: "error", path: `${path}.manualPoints`, message: "manualPoints doit être un nombre positif ou nul." });
    }
    if (declaredAutoMaximum == null) {
      issues.push({ severity: "error", path: `${path}.autoPoints`, message: "autoPoints doit être un nombre positif ou nul." });
    }
    const manualMaximum = declaredManualMaximum ?? 0;
    const autoMaximum = declaredAutoMaximum ?? 0;
    if (Math.abs(manualMaximum + autoMaximum - points) > 0.0001) {
      issues.push({
        severity: "error",
        path: `${path}.manualPoints`,
        message: `autoPoints + manualPoints doit être égal au barème total (${points || "?"}).`,
      });
    }
    if (mode === "hybrid" && (autoMaximum <= 0 || manualMaximum <= 0)) {
      issues.push({ severity: "error", path: `${path}.gradingMode`, message: "Une question hybride doit réserver des points aux deux corrections." });
    }
    if (mode === "hybrid" && question.type !== "texte") {
      issues.push({ severity: "error", path: `${path}.type`, message: "Une question hybride doit être une réponse texte structurée." });
    }
    if (mode === "auto" && (manualMaximum !== 0 || Math.abs(autoMaximum - points) > 0.0001)) {
      issues.push({ severity: "error", path: `${path}.gradingMode`, message: "Une question automatique attribue tous ses points automatiquement." });
    }
    if (mode === "manual" && (autoMaximum !== 0 || Math.abs(manualMaximum - points) > 0.0001)) {
      issues.push({ severity: "error", path: `${path}.gradingMode`, message: "Une question manuelle réserve tous ses points à la correction humaine." });
    }

    const rubric = rubricFor(question);
    counts.rubricCriteria += rubric.length;
    if (mode !== "auto") {
      if (rubric.length === 0) {
        issues.push({
          severity: "error",
          path: `${path}.rubricCriteria`,
          message: `La question ${index + 1} exige un barème humain détaillé.`,
        });
      } else {
        const rubricTotal = rubric.reduce((sum, criterion) => sum + finitePositive(criterion.pointsMax), 0);
        if (rubric.some((criterion) => !textValue(criterion.id) || !textValue(criterion.label))) {
          issues.push({ severity: "error", path: `${path}.rubricCriteria`, message: `Chaque critère de la question ${index + 1} doit avoir un id et un libellé.` });
        }
        if (Math.abs(rubricTotal - manualMaximum) > 0.0001) {
          issues.push({
            severity: "error",
            path: `${path}.rubricCriteria`,
            message: `Les critères totalisent ${rubricTotal} point(s), au lieu des ${manualMaximum} point(s) réservés à la correction humaine.`,
          });
        }
        const rubricIds = rubric.map((criterion) => textValue(criterion.id)).filter(Boolean);
        if (new Set(rubricIds).size !== rubricIds.length) {
          issues.push({ severity: "error", path: `${path}.rubricCriteria`, message: `Les identifiants des critères de la question ${index + 1} doivent être uniques.` });
        }
      }
    } else if (rubric.length > 0) {
      issues.push({ severity: "error", path: `${path}.rubricCriteria`, message: `La question ${index + 1} n’a pas de points humains : retire son barème manuel.` });
    }

    if (mode !== "manual" && !neutralized && !hasPrivateAnswer(question)) {
      issues.push({ severity: "error", path: `${path}.correctAnswer`, message: `La partie automatique de la question ${index + 1} n’a pas de réponse de référence.` });
    }

    if (hasDetailedCorrection(question)) {
      counts.detailedCorrections += 1;
      const explanation = textValue(question.explanationMarkdown)
        || textValue(question.correctionMarkdown)
        || textValue(record(question.correction)?.explanationMarkdown)
        || textValue(record(question.correction)?.markdown);
      if (explanation.length < 20) {
        issues.push({ severity: "error", path: `${path}.explanationMarkdown`, message: `La correction détaillée de la question ${index + 1} doit contenir au moins 20 caractères.` });
      }
    } else {
      issues.push({ severity: "warning", path: `${path}.explanationMarkdown`, message: `La correction détaillée de la question ${index + 1} est vide.` });
    }

    const choices = list(question.choices);
    const answerKind = textValue(question.answerKind);
    if ((answerKind === "single-choice" || answerKind === "true-false" || question.type === "qcm") && choices.length < 2) {
      issues.push({ severity: "error", path: `${path}.choices`, message: `La question ${index + 1} doit proposer au moins deux choix.` });
    }
    if (question.type === "qcm") {
      if (answerKind !== "single-choice" && answerKind !== "true-false") {
        issues.push({ severity: "error", path: `${path}.answerKind`, message: `Le type de réponse du QCM ${index + 1} doit être single-choice ou true-false.` });
      }
      if (mode === "hybrid") {
        issues.push({ severity: "error", path: `${path}.gradingMode`, message: "Une correction hybride utilise une question texte, pas un QCM." });
      }
      const choiceIds = choices.map((choice) => textValue(record(choice)?.id)).filter(Boolean);
      if (choices.some((choice) => {
        const item = record(choice);
        return !item || !textValue(item.id) || !textValue(item.label) || !textValue(item.contentMarkdown);
      })) {
        issues.push({ severity: "error", path: `${path}.choices`, message: `Chaque choix de la question ${index + 1} doit avoir un id, un libellé et un contenu.` });
      }
      if (new Set(choiceIds).size !== choiceIds.length) {
        issues.push({ severity: "error", path: `${path}.choices`, message: `Les identifiants des choix de la question ${index + 1} doivent être uniques.` });
      }
      const expectedAnswer = textValue(question.expectedAnswer);
      if (mode !== "manual" && !neutralized && (!expectedAnswer || !choiceIds.includes(expectedAnswer))) {
        issues.push({ severity: "error", path: `${path}.expectedAnswer`, message: `La bonne réponse du QCM ${index + 1} doit être l’identifiant d’un choix.` });
      }
    } else {
      if (choices.length > 0) {
        issues.push({ severity: "error", path: `${path}.choices`, message: `La question rédigée ${index + 1} ne doit pas contenir de choix.` });
      }
      if (mode !== "manual" && !neutralized) {
        const acceptedAnswers = Array.isArray(question.expectedAnswer) ? question.expectedAnswer : [question.expectedAnswer];
        if (acceptedAnswers.length === 0 || acceptedAnswers.some((answer) => !textValue(answer))) {
          issues.push({ severity: "error", path: `${path}.expectedAnswer`, message: `La question ${index + 1} doit déclarer au moins une réponse finale acceptée.` });
        }
      }
    }
  });

  const declaredTotal = finitePositive(metadataRoot.totalPoints ?? root.totalPoints);
  if (declaredTotal && Math.abs(declaredTotal - totalPoints) > 0.0001) {
    issues.push({
      severity: "error",
      path: "totalPoints",
      message: `Le total annoncé (${declaredTotal}) ne correspond pas à la somme des questions (${totalPoints}).`,
    });
  }

  const expectedGlobalMode = counts.manual === 0 && counts.hybrid === 0
    ? "auto"
    : counts.auto === 0 && counts.hybrid === 0 ? "manual" : "hybrid";
  const declaredGlobalMode = gradingMode(metadataRoot.gradingMode);
  if (declaredGlobalMode && questions.length > 0 && declaredGlobalMode !== expectedGlobalMode) {
    issues.push({
      severity: "error",
      path: "gradingMode",
      message: `Le mode global attendu pour ce barème est ${expectedGlobalMode}.`,
    });
  }

  return {
    package: root,
    valid: !issues.some((issue) => issue.severity === "error"),
    metadata: { title, institution, academicYear, subject, level, series, durationSeconds },
    counts,
    totalPoints,
    issues,
  };
}

export function parseHomeworkImportText(source: string): HomeworkImportInspection {
  if (!source.trim()) {
    return {
      package: null,
      valid: false,
      metadata: emptyMetadata,
      counts: {
        sections: 0, exercises: 0, questions: 0, auto: 0, manual: 0, hybrid: 0,
        rubricCriteria: 0, detailedCorrections: 0,
      },
      totalPoints: 0,
      issues: [{ severity: "error", path: "$", message: "Colle un paquet JSON ou choisis un fichier local." }],
    };
  }
  try {
    return inspectHomeworkImportPackage(JSON.parse(source));
  } catch (reason) {
    const detail = reason instanceof Error ? reason.message : "syntaxe inconnue";
    return {
      package: null,
      valid: false,
      metadata: emptyMetadata,
      counts: {
        sections: 0, exercises: 0, questions: 0, auto: 0, manual: 0, hybrid: 0,
        rubricCriteria: 0, detailedCorrections: 0,
      },
      totalPoints: 0,
      issues: [{ severity: "error", path: "$", message: `JSON invalide : ${detail}` }],
    };
  }
}
