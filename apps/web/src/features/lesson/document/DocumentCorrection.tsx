import { BookOpenText } from "@phosphor-icons/react";
import * as React from "react";

/** A correction belongs to one item; validation and other items never open it. */
export function DocumentCorrection({ children }: { children: React.ReactNode }) {
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  return <div className="document-correction">
    <button id={`toggle-${id}`} type="button" className="document-correction-button" aria-expanded={open} aria-controls={`solution-${id}`} onClick={() => setOpen(current => !current)}>
      <BookOpenText size={19} aria-hidden="true" />{open ? "Masquer la correction" : "Voir la correction"}
    </button>
    {open && <section id={`solution-${id}`} className="document-correction-panel" aria-labelledby={`solution-title-${id}`}>
      <h4 id={`solution-title-${id}`}>Solution</h4>
      {children}
    </section>}
  </div>;
}
