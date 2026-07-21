import { X } from "@phosphor-icons/react";
import type { DashboardContent } from "../../domain/learning";

interface DetailsDialogProps {
  content: DashboardContent;
  onClose: () => void;
}

export function DetailsDialog({ content, onClose }: DetailsDialogProps) {
  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="details-dialog" role="dialog" aria-modal="true" aria-labelledby="details-title">
        <header>
          <div>
            <span>Plan de travail</span>
            <h2 id="details-title">{content.dailyGoal.title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fermer"><X size={22} /></button>
        </header>
        <div className="goal-detail">
          <strong>{content.dailyGoal.completed}/{content.dailyGoal.target} étapes</strong>
          <p>{content.dailyGoal.description}</p>
        </div>
      </section>
    </div>
  );
}
