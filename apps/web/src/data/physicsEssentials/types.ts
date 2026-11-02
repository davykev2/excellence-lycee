import type { CourseDocumentSection, CourseEssentialSheet, CourseNativeFigure } from "../../domain/courseDocument";

export const physicsEssentialSource = {
  title: "Coefficient 12 · Physique-Chimie · Édition 2022–2023",
  sha256: "59886C625771AD627E104FAB36C52927DCA046FE6083AAD9791927C7923F2362",
  pageCount: 740,
} as const;

export function sheet(id: string, title: string, pages: number[], sections: CourseDocumentSection[], editorialNotes: string[] = [], levelIds: readonly string[] = ["terminale-c", "terminale-d"]): CourseEssentialSheet {
  const numerals = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];
  return { id: `cd-physics-essential-${id}`, title, levelIds, source: { ...physicsEssentialSource, pages, editorialNotes },
    sections: sections.map((section, index) => ({ ...section, numeral: numerals[index] ?? String(index + 1) })) };
}

export function section(id: string, numeral: string, title: string, pages: number[], body: string, preset?: string): CourseDocumentSection {
  const nativeFigure: CourseNativeFigure | undefined = preset ? { kind: "physics", preset } : undefined;
  return { id, numeral, title, topics: [{ id: `${id}-rules`, title, pages, body, nativeFigure }] };
}
