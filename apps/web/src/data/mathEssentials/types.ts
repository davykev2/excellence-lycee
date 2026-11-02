import type { CourseDocumentSection, CourseEssentialSheet } from "../../domain/courseDocument";

/** A shared reference sheet. It never participates in mastery, scoring or XP. */
export interface MathEssentialSheet extends CourseEssentialSheet {
  id: string;
  title: string;
  levelIds: readonly ["terminale-c", "terminale-d"];
  source: {
    title: string;
    sha256: string;
    pageCount: number;
    pages: number[];
    editorialNotes: string[];
  };
  sections: CourseDocumentSection[];
  visuals?: Record<string, "unit-circle">;
}

export function sheet(
  id: string,
  title: string,
  pages: number[],
  sections: CourseDocumentSection[],
  editorialNotes: string[] = [],
): MathEssentialSheet {
  return {
    id: `cd-essential-${id}`,
    title,
    levelIds: ["terminale-c", "terminale-d"],
    source: {
      title: "Coefficient 12 · Mathématiques · Édition 2022–2023",
      sha256: "59886C625771AD627E104FAB36C52927DCA046FE6083AAD9791927C7923F2362",
      pageCount: 740,
      pages,
      editorialNotes,
    },
    sections,
  };
}

export function section(id: string, numeral: string, title: string, pages: number[], body: string): CourseDocumentSection {
  return { id, numeral, title, topics: [{ id: `${id}-rules`, title, pages, body }] };
}
