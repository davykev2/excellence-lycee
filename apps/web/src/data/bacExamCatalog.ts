import { BAC_CI_2024_EXAM_ID } from "./bacCi2024Exam";

export const BAC_CI_2017_EXAM_ID = "bac-ci-2017-archive";
export const BAC_CI_2018_EXAM_ID = "bac-ci-2018-archive";
export const BAC_CI_2019_EXAM_ID = "bac-ci-2019-archive";
export const BAC_CI_2020_EXAM_ID = "bac-ci-2020-archive";
export const BAC_CI_2022_EXAM_ID = "bac-ci-2022-archive";
export const BAC_CI_2023_EXAM_ID = "bac-ci-2023-archive";

export type BacExamSlug = "2017" | "2018" | "2019" | "2020" | "2022" | "2023" | "2024";

export interface BacExamCatalogEntry {
  id: string;
  slug: BacExamSlug;
  year: number;
  title: string;
  shortTitle: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
  choiceIds: readonly ("A" | "B" | "C" | "D" | "E")[];
  format: "facsimile" | "interactive";
  responseSheetAvailable: boolean;
  pageUrls: readonly string[];
  pageCount: number;
  sections: readonly {
    label: string;
    firstQuestion: number;
    lastQuestion: number;
    questionLabels?: readonly string[];
  }[];
}

const bac2017EnglishLabels = [
  "A1", "A2", "A3", "A4", "A5",
  "B1", "B2", "B3", "B4", "B5", "B6", "B7",
  "C1", "C2", "C3", "C4", "C5", "C6",
  "2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "2.10", "2.11",
] as const;

const bac2017GeneralKnowledgeLabels = [
  ...Array.from({ length: 20 }, (_, index) => String(index + 1)),
  "21a", "21b", "21c", "21d", "21e", "21f", "21g", "21h", "21i",
  "22a", "22b", "22c", "22d", "22e",
] as const;

function archivePages(year: number, pageCount: number) {
  return Array.from(
    { length: pageCount },
    (_, index) => `/exams/bac-archives/${year}/page-${String(index + 1).padStart(2, "0")}.webp`,
  );
}

export const bacExamCatalog: readonly BacExamCatalogEntry[] = [
  {
    id: BAC_CI_2017_EXAM_ID,
    slug: "2017",
    year: 2017,
    title: "Sujet type BAC — Session 2017",
    shortTitle: "Session 2017",
    description: "Anglais, culture générale et culture scientifique, reproduits fidèlement sur 10 pages.",
    durationMinutes: 180,
    questionCount: 86,
    choiceIds: ["A", "B", "C", "D"],
    format: "facsimile",
    responseSheetAvailable: true,
    pageUrls: archivePages(2017, 10),
    pageCount: 10,
    sections: [
      { label: "Anglais", firstQuestion: 1, lastQuestion: 29, questionLabels: bac2017EnglishLabels },
      { label: "Culture générale", firstQuestion: 30, lastQuestion: 63, questionLabels: bac2017GeneralKnowledgeLabels },
      { label: "Culture scientifique", firstQuestion: 64, lastQuestion: 86 },
    ],
  },
  {
    id: BAC_CI_2018_EXAM_ID,
    slug: "2018",
    year: 2018,
    title: "Sujet type BAC — Session 2018",
    shortTitle: "Session 2018",
    description: "60 QCM d’anglais, de culture générale et de culture scientifique sur 10 pages.",
    durationMinutes: 180,
    questionCount: 60,
    choiceIds: ["A", "B", "C", "D", "E"],
    format: "facsimile",
    responseSheetAvailable: true,
    pageUrls: archivePages(2018, 10),
    pageCount: 10,
    sections: [
      { label: "Anglais", firstQuestion: 1, lastQuestion: 20 },
      { label: "Culture générale", firstQuestion: 21, lastQuestion: 40 },
      { label: "Culture scientifique", firstQuestion: 41, lastQuestion: 60 },
    ],
  },
  {
    id: BAC_CI_2019_EXAM_ID,
    slug: "2019",
    year: 2019,
    title: "Sujet type BAC — Session 2019",
    shortTitle: "Session 2019",
    description: "60 QCM d’anglais, de culture générale et de culture scientifique sur 12 pages.",
    durationMinutes: 180,
    questionCount: 60,
    choiceIds: ["A", "B", "C", "D", "E"],
    format: "facsimile",
    responseSheetAvailable: true,
    pageUrls: archivePages(2019, 12),
    pageCount: 12,
    sections: [
      { label: "Anglais", firstQuestion: 1, lastQuestion: 20 },
      { label: "Culture générale", firstQuestion: 21, lastQuestion: 40 },
      { label: "Culture scientifique", firstQuestion: 41, lastQuestion: 60 },
    ],
  },
  {
    id: BAC_CI_2020_EXAM_ID,
    slug: "2020",
    year: 2020,
    title: "Sujet type BAC — Session 2020",
    shortTitle: "Session 2020",
    description: "60 QCM d’anglais, de culture générale et de culture scientifique sur 10 pages.",
    durationMinutes: 180,
    questionCount: 60,
    choiceIds: ["A", "B", "C", "D"],
    format: "facsimile",
    responseSheetAvailable: true,
    pageUrls: archivePages(2020, 10),
    pageCount: 10,
    sections: [
      { label: "Anglais", firstQuestion: 1, lastQuestion: 20 },
      { label: "Culture générale", firstQuestion: 21, lastQuestion: 40 },
      { label: "Culture scientifique", firstQuestion: 41, lastQuestion: 60 },
    ],
  },
  {
    id: BAC_CI_2022_EXAM_ID,
    slug: "2022",
    year: 2022,
    title: "Sujet type BAC — Session 2022",
    shortTitle: "Session 2022",
    description: "Annale de 41 questions visibles : culture générale, culture scientifique et anglais, reproduite sur 8 pages.",
    durationMinutes: 180,
    questionCount: 41,
    choiceIds: ["A", "B", "C", "D"],
    format: "facsimile",
    responseSheetAvailable: false,
    pageUrls: archivePages(2022, 8),
    pageCount: 8,
    sections: [
      { label: "Culture scientifique", firstQuestion: 1, lastQuestion: 17 },
      { label: "Culture générale", firstQuestion: 18, lastQuestion: 26 },
      { label: "Anglais", firstQuestion: 27, lastQuestion: 41 },
    ],
  },
  {
    id: BAC_CI_2023_EXAM_ID,
    slug: "2023",
    year: 2023,
    title: "Sujet type BAC — Session 2023",
    shortTitle: "Session 2023",
    description: "Extrait officiel de 43 questions visibles en anglais, culture générale et culture scientifique, sur 7 pages.",
    durationMinutes: 180,
    questionCount: 43,
    choiceIds: ["A", "B", "C", "D"],
    format: "facsimile",
    responseSheetAvailable: false,
    pageUrls: archivePages(2023, 7),
    pageCount: 7,
    sections: [
      { label: "Anglais", firstQuestion: 1, lastQuestion: 20 },
      { label: "Culture générale", firstQuestion: 21, lastQuestion: 40 },
      { label: "Culture scientifique", firstQuestion: 41, lastQuestion: 43 },
    ],
  },
  {
    id: BAC_CI_2024_EXAM_ID,
    slug: "2024",
    year: 2024,
    title: "Concours BAC & BT — Session 2024",
    shortTitle: "Session 2024",
    description: "Le sujet interactif de 69 questions, avec correction détaillée et résultats par matière.",
    durationMinutes: 180,
    questionCount: 69,
    choiceIds: ["A", "B", "C", "D"],
    format: "interactive",
    responseSheetAvailable: true,
    pageUrls: [],
    pageCount: 0,
    // La session 2024 possède des sections non contiguës (Q61-Q69 complètent
    // les deux blocs de culture). Son écran interactif porte donc son propre
    // découpage afin de ne pas exposer ici des plages qui se chevauchent.
    sections: [],
  },
] as const;

export const bacExamBySlug = new Map(bacExamCatalog.map((exam) => [exam.slug, exam]));
export const bacExamById = new Map(bacExamCatalog.map((exam) => [exam.id, exam]));

export function getBacExamBySlug(slug?: string) {
  return slug ? bacExamBySlug.get(slug as BacExamSlug) : undefined;
}
