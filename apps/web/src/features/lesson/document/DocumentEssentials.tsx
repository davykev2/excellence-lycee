import { Lightning } from "@phosphor-icons/react";
import { useId } from "react";
import { MarkdownContent } from "../../../components/MarkdownContent";
import { MathText } from "../../../components/MathText";
import type { CourseEssentialCard } from "../../../domain/courseDocument";
import { getMathEssentialKey } from "../../../data/mathEssentials/registry";
import { MathEssentialsPanel } from "./MathEssentialsPanel";

export function DocumentEssentials({ cards, topicIds, onReview, pathId, levelId, active = true }: {
  cards?: CourseEssentialCard[];
  topicIds: string[];
  onReview: (id: string) => void;
  pathId?: string;
  levelId?: string;
  active?: boolean;
}) {
  const id = useId();
  const sheetKey = pathId && levelId ? getMathEssentialKey(pathId, levelId) : null;
  if (sheetKey) return <MathEssentialsPanel sheetKey={sheetKey} active={active}/>;
  if (!cards?.length) return <section className="document-essentials-empty">
    <Lightning size={32} weight="duotone" aria-hidden="true" />
    <h2>L’essentiel</h2>
    <p>Contenu à venir.</p>
  </section>;

  return <>
    <h2>L’essentiel</h2>
    <div className="document-essentials-grid">{cards.map(card => <article key={card.id} className="document-essential-card" aria-labelledby={`${id}-${card.id}`}>
      <h3 id={`${id}-${card.id}`}><MathText>{card.title}</MathText></h3>
      <MarkdownContent markdown={card.body} />
      {card.topicId && topicIds.includes(card.topicId) && <button type="button" className="document-rule-link" onClick={() => card.topicId && onReview(card.topicId)}>Revoir dans le résumé</button>}
    </article>)}</div>
  </>;
}
