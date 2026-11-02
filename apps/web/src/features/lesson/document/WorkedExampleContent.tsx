import { MarkdownContent } from "../../../components/MarkdownContent";
import { MathText } from "../../../components/MathText";
import type { CourseWorkedExample } from "../../../domain/courseDocument";
import { DocumentNativeFigure } from "./DocumentNativeFigure";

/** Keep every sub-question beside its own reasoning, never in a shared answer paragraph. */
export function WorkedExampleContent({ example, showPrompt = true }: { example: CourseWorkedExample; showPrompt?: boolean }) {
  return <div className="document-worked-content" data-worked-example={example.id}>
    {showPrompt && example.prompt && <p className="document-example-prompt"><MathText>{example.prompt}</MathText></p>}
    {example.parts?.length ? <ol className="document-example-parts" aria-label="Questions corrigées de cet exemple">
      {example.parts.map(part => <li key={part.id} data-example-part={part.id}>
        <div className="document-example-part-heading">
          <span className="document-example-part-label">{part.label}</span>
          <p><MathText>{part.prompt}</MathText></p>
        </div>
        <div className="document-example-part-solution"><MarkdownContent markdown={part.solution} /></div>
      </li>)}
    </ol> : example.solution && <div className="document-example-solution"><MarkdownContent markdown={example.solution} /></div>}
    {example.nativeFigure && <DocumentNativeFigure figure={example.nativeFigure}/>}
  </div>;
}
