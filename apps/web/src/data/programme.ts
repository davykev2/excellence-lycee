import type {
  DashboardContent,
  SchoolLevel,
  SubjectDefinition,
  SubjectId,
} from "../domain/learning";

export const schoolLevels: SchoolLevel[] = [
  { id: "seconde-a", label: "Seconde A", stage: "seconde", series: "A" },
  { id: "seconde-c", label: "Seconde C", stage: "seconde", series: "C" },
  { id: "premiere-a", label: "Première A", stage: "premiere", series: "A" },
  { id: "premiere-c", label: "Première C", stage: "premiere", series: "C" },
  { id: "premiere-d", label: "Première D", stage: "premiere", series: "D" },
  { id: "terminale-a", label: "Terminale A", stage: "terminale", series: "A" },
  { id: "terminale-c", label: "Terminale C", stage: "terminale", series: "C" },
  { id: "terminale-d", label: "Terminale D", stage: "terminale", series: "D" },
];

export const subjects: Record<SubjectId, SubjectDefinition> = {
  mathematics: {
    id: "mathematics",
    label: "Mathématiques",
    shortLabel: "Maths",
    enabled: true,
    theme: { accent: "#49ad3f", accentSoft: "#e8f4e5" },
  },
  "physics-chemistry": {
    id: "physics-chemistry",
    label: "Physique-Chimie",
    shortLabel: "P-C",
    enabled: true,
    levelIds: ["seconde-a", "seconde-c", "premiere-a", "premiere-c", "premiere-d", "terminale-c", "terminale-d"],
    theme: { accent: "#2878c8", accentSoft: "#e8f2fb" },
  },
  french: {
    id: "french",
    label: "Français",
    shortLabel: "Français",
    enabled: false,
    theme: { accent: "#a8497e", accentSoft: "#f7eaf2" },
  },
  english: {
    id: "english",
    label: "Anglais",
    shortLabel: "Anglais",
    enabled: false,
    theme: { accent: "#d85c2f", accentSoft: "#fbece6" },
  },
  svt: {
    id: "svt",
    label: "SVT",
    shortLabel: "SVT",
    enabled: true,
    theme: { accent: "#2f8b67", accentSoft: "#e4f2ec" },
  },
  philosophy: {
    id: "philosophy",
    label: "Philosophie",
    shortLabel: "Philo",
    enabled: true,
    levelIds: ["premiere-a", "premiere-c", "premiere-d", "terminale-a", "terminale-c", "terminale-d"],
    theme: { accent: "#7253a4", accentSoft: "#f0ebf8" },
  },
  "history-geography": {
    id: "history-geography",
    label: "Histoire-Géographie",
    shortLabel: "H-G",
    enabled: false,
    theme: { accent: "#a36a25", accentSoft: "#f7efe4" },
  },
};

export function isSubjectAvailableForLevel(subject: SubjectDefinition, levelId: string) {
  return !subject.levelIds || subject.levelIds.includes(levelId);
}

export const initialDashboard: DashboardContent = {
  learnerName: "Aïcha",
  levelId: "seconde-c",
  subjectId: "mathematics",
  lesson: {
    id: "math-2nd-degree-functions",
    eyebrow: "Continuer :",
    title: "Fonctions du second degré",
    progress: 68,
    remainingMinutes: 12,
    ctaLabel: "Reprendre la leçon",
    hintLabel: "Demander un indice",
  },
  dailyGoal: {
    title: "Objectif du jour",
    description: "Terminer une étape et résoudre 3 exercices.",
    completed: 2,
    target: 3,
  },
  arena: {
    title: "Entre dans l’Arène",
    description: "6 modes pour t’entraîner et te dépasser",
  },
};
