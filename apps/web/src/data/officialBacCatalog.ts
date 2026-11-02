import catalog from "./officialBacCatalog.generated.json";

export const officialBacYears = [2026, 2025] as const;
export type OfficialBacYear = typeof officialBacYears[number];
export type OfficialBacLevel = "terminale-a" | "terminale-c" | "terminale-d";
export interface OfficialBacPaper {
  id: string;
  year: number;
  subject: string;
  series: string;
  levelIds: string[];
  sourceName: string;
  pageCount: number;
  sha256: string;
  pdfBytes: number;
  pdfUrl: string;
  coverUrl: string;
  pages: { url: string; width: number; height: number }[];
}

/** A/C/D only. A query parameter never changes the learner's stored series. */
export function isOfficialBacLevel(levelId: string): levelId is OfficialBacLevel {
  return levelId === "terminale-a" || levelId === "terminale-c" || levelId === "terminale-d";
}
export const officialBacCatalog: readonly OfficialBacPaper[] = catalog;
export function officialBacPapersFor(year: number, levelId: string) {
  if (!isOfficialBacLevel(levelId)) return [];
  return officialBacCatalog.filter(paper => paper.year === year && paper.levelIds.includes(levelId));
}
export function getOfficialBacPaper(year: number | undefined, id: string | undefined, levelId: string) {
  if (!year || !id) return undefined;
  return officialBacPapersFor(year, levelId).find(paper => paper.id === id);
}
export function officialBacSeriesLabel(levelId: string) {
  return isOfficialBacLevel(levelId) ? `Série ${levelId.slice(-1).toUpperCase()}` : "Série non disponible";
}
