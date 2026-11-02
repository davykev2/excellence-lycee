import type { CourseDocumentSection, CourseEssentialSheet } from "../../domain/courseDocument";

export const svtEssentialSource = {
  title: "Coefficient 12 · SVT · Édition 2022–2023",
  sha256: "59886C625771AD627E104FAB36C52927DCA046FE6083AAD9791927C7923F2362",
  pageCount: 740,
} as const;
export const cd = ["terminale-c", "terminale-d"] as const;
export const c = ["terminale-c"] as const;
export const d = ["terminale-d"] as const;

export function section(id: string, title: string, pages: number[], body: string, preset?: string): CourseDocumentSection {
  return { id, numeral: "", title, topics: [{ id: id + "-rules", title, pages, body,
    nativeFigure: preset ? { kind: "biology", preset } : undefined }] };
}
export function sheet(id: string, title: string, levelIds: readonly string[], sections: CourseDocumentSection[], editorialNotes: string[]): CourseEssentialSheet {
  const numerals = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV"];
  return { id: "svt-essential-" + id, title, levelIds,
    source: { ...svtEssentialSource, pages: [...new Set(sections.flatMap(item => item.topics.flatMap(topic => topic.pages)))].sort((a,b) => a-b), editorialNotes },
    sections: sections.map((item,index) => ({ ...item, numeral: numerals[index] ?? String(index+1) })) };
}
