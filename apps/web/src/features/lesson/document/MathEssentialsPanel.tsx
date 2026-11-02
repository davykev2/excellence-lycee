import { CaretDown, ListBullets } from "@phosphor-icons/react";
import { useEffect, useId, useState } from "react";
import { MarkdownContent } from "../../../components/MarkdownContent";
import { MathText } from "../../../components/MathText";
import { loadMathEssentialSheet, type MathEssentialKey } from "../../../data/mathEssentials/registry";
import type { MathEssentialSheet } from "../../../data/mathEssentials/types";
import type { CourseEssentialSheet } from "../../../domain/courseDocument";
import { DocumentNativeFigure } from "./DocumentNativeFigure";
import { EssentialUnitCircle } from "./EssentialUnitCircle";
import { WorkedExampleContent } from "./WorkedExampleContent";

export function MathEssentialsContent({ sheet }: { sheet: CourseEssentialSheet }) {
  const id = useId();
  const [tocOpen, setTocOpen] = useState(false);
  const [selected, setSelected] = useState(sheet.sections[0]?.id);
  const targetId = (sectionId: string) => `${id}-${sectionId}`;
  function goTo(sectionId: string) {
    setSelected(sectionId); setTocOpen(false);
    const element = window.document.getElementById(targetId(sectionId));
    element?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  return <div className="math-essentials-sheet" data-essential-sheet={sheet.id}>
    <h2 className="essential-sheet-title">L’essentiel</h2>
    <div className="document-summary-layout">
      <aside className={`document-outline${tocOpen ? " is-open" : ""}`} aria-label="Sommaire de l’essentiel">
        <button className="document-outline-toggle" type="button" aria-expanded={tocOpen} aria-controls={`${id}-outline`} onClick={() => setTocOpen(open => !open)}><ListBullets size={20}/>Sommaire<CaretDown size={18}/></button>
        <nav id={`${id}-outline`}>
          <p className="document-small-label">L’essentiel</p>
          {sheet.sections.map(section => <button key={section.id} type="button" className={`document-outline-topic${selected === section.id ? " is-active" : ""}`} aria-current={selected === section.id ? "location" : undefined} onClick={() => goTo(section.id)}><span>{section.numeral}. </span><MathText>{section.title}</MathText></button>)}
        </nav>
      </aside>
      <div className="document-summary-content">
        {sheet.sections.map(section => <article id={targetId(section.id)} className="document-summary-section essential-sheet-section" key={section.id} aria-labelledby={`${targetId(section.id)}-heading`}>
          <header><span>{section.numeral}</span><h2 id={`${targetId(section.id)}-heading`}><MathText>{section.title}</MathText></h2></header>
          {section.topics.map(topic => <section className="document-topic" key={topic.id}>
            {(section.topics.length > 1 || topic.title !== section.title) && <h3><MathText>{topic.title}</MathText></h3>}
            <MarkdownContent markdown={topic.body}/>
            {topic.nativeFigure && <DocumentNativeFigure figure={topic.nativeFigure}/>}
            {topic.examples?.map(example => <section className="document-summary-example" key={example.id}><h4><MathText>{example.title}</MathText></h4><WorkedExampleContent example={example}/></section>)}
            {sheet.visuals?.[topic.id] === "unit-circle" && <EssentialUnitCircle/>}
          </section>)}
        </article>)}
      </div>
    </div>
  </div>;
}

export function MathEssentialsPanel({ sheetKey, active = true }: { sheetKey: MathEssentialKey; active?: boolean }) {
  const [loaded, setLoaded] = useState<{ key: MathEssentialKey; sheet: MathEssentialSheet } | null>(null);
  const [error, setError] = useState<MathEssentialKey | null>(null);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    setError(null);
    loadMathEssentialSheet(sheetKey).then(sheet => {
      if (!cancelled) setLoaded({ key: sheetKey, sheet });
    }).catch(() => { if (!cancelled) setError(sheetKey); });
    return () => { cancelled = true; };
  }, [sheetKey, active]);
  if (loaded?.key === sheetKey) return <MathEssentialsContent key={sheetKey} sheet={loaded.sheet}/>;
  if (error === sheetKey) return <section className="essential-load-state" role="alert"><p>Impossible de charger cette fiche.</p><button type="button" className="document-primary-button" onClick={() => window.location.reload()}>Réessayer</button></section>;
  return <p className="essential-load-state" role="status">Chargement de l’essentiel…</p>;
}
