import {
  ArrowClockwise,
  CheckCircle,
  FileLock,
  FileText,
  RocketLaunch,
  ShieldCheck,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { useState } from "react";
import { formatHomeworkDuration } from "../../../domain/homework";
import { setHomeworkPublication, useAdminHomeworkCatalog } from "./homeworkReviewApi";
import type { HomeworkPublicationPayload, HomeworkSummary } from "./homeworkReviewTypes";

interface PublicationIntent {
  homework: HomeworkSummary;
  payload: HomeworkPublicationPayload;
  title: string;
  message: string;
}

function publicationState(homework: HomeworkSummary) {
  if (homework.correctionsPublished) return "Résultats et corrigé publiés";
  if (homework.editorialStatus === "archived") return "Version archivée · résultats masqués";
  if (homework.subjectPublished) return "Sujet ouvert · résultats masqués";
  return "Sujet fermé · résultats masqués";
}

export function HomeworkPublicationManager() {
  const catalog = useAdminHomeworkCatalog();
  const [intent, setIntent] = useState<PublicationIntent | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const apply = async () => {
    if (!intent) return;
    setUpdating(intent.homework.id);
    setError(null);
    setSuccess(null);
    try {
      // L’UUID cible exactement cette version, y compris lorsqu’elle est archivée.
      await setHomeworkPublication(intent.homework.id, intent.payload);
      setSuccess(`${intent.homework.title} : état de publication mis à jour.`);
      setIntent(null);
      catalog.reload();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "L’état de publication n’a pas pu être modifié.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <section className="homework-publication-manager" aria-labelledby="homework-publication-title">
      <header className="homework-import-heading">
        <div>
          <p className="admin-eyebrow"><ShieldCheck size={16} weight="duotone" /> Publication durable</p>
          <h2 id="homework-publication-title">Gérer les devoirs déjà importés</h2>
          <p>Cette liste revient après un F5. Ferme d’abord le sujet, termine les corrections, puis publie ensemble les notes et le corrigé.</p>
        </div>
        <button className="secondary-action" type="button" disabled={catalog.loading} onClick={catalog.reload}>
          <ArrowClockwise size={17} weight="bold" />Actualiser
        </button>
      </header>

      {catalog.loading && <div className="homework-publication-loading" role="status"><span />Chargement des devoirs…</div>}
      {catalog.error && <p className="homework-review-submit-error" role="alert"><WarningCircle size={18} />{catalog.error}</p>}
      {error && <p className="homework-review-submit-error" role="alert"><WarningCircle size={18} />{error}</p>}
      {success && <p className="homework-publication-success" role="status"><CheckCircle size={18} weight="fill" />{success}</p>}

      {!catalog.loading && !catalog.error && catalog.items.length === 0 && (
        <div className="homework-publication-empty"><FileText size={38} weight="duotone" /><strong>Aucun devoir importé</strong><span>Utilise l’onglet Importer un devoir pour créer le premier sujet.</span></div>
      )}

      <div className="homework-publication-list">
        {catalog.items.map((homework) => {
          const correctionActionBlocked = Boolean(homework.subjectPublished && !homework.correctionsPublished);
          const subjectActionBlocked = Boolean(homework.correctionsPublished || homework.editorialStatus === "archived");
          return (
            <article key={homework.id} className={homework.subjectPublished ? "is-open" : homework.correctionsPublished ? "is-results" : ""}>
              <div className="homework-publication-card-icon">
                {homework.subjectPublished ? <RocketLaunch size={24} weight="duotone" /> : <FileLock size={24} weight="duotone" />}
              </div>
              <div className="homework-publication-card-copy">
                <p>{homework.institution} · {homework.academicYear}{homework.version ? ` · version ${homework.version}` : ""}</p>
                <h3>{homework.title}</h3>
                <span>{homework.level.name} {homework.series.name} · {homework.subject.name}</span>
                <div><b>{homework.exerciseCount ?? "—"} exercices</b><b>{homework.questionCount} questions</b><b>{formatHomeworkDuration(homework.durationSeconds)}</b></div>
              </div>
              <div className="homework-publication-card-state">
                <strong>{publicationState(homework)}</strong>
                <span>Publication du sujet et du corrigé séparée</span>
              </div>
              <div className="homework-publication-card-actions">
                <button
                  className="secondary-action"
                  type="button"
                  disabled={updating === homework.id || subjectActionBlocked}
                  title={homework.editorialStatus === "archived"
                    ? "Une version archivée ne peut pas redevenir le sujet actif."
                    : subjectActionBlocked
                      ? "Masque d’abord les résultats et le corrigé."
                      : undefined}
                  onClick={() => setIntent({
                    homework,
                    payload: homework.subjectPublished
                      ? { subjectPublished: false, correctionsPublished: false }
                      : { subjectPublished: true },
                    title: homework.subjectPublished ? "Fermer ce sujet ?" : "Ouvrir ce sujet aux élèves ?",
                    message: homework.subjectPublished
                      ? "Les tentatives en cours restent enregistrées, mais aucune nouvelle copie ne pourra commencer."
                      : "Le sujet complet ne sera transmis à chaque élève qu’au démarrage de son chronomètre.",
                  })}
                >
                  {homework.subjectPublished
                    ? "Fermer le sujet"
                    : homework.editorialStatus === "archived"
                      ? "Version archivée"
                      : subjectActionBlocked
                        ? "Masquer d’abord le corrigé"
                        : "Ouvrir le sujet"}
                </button>
                <button
                  className="primary-action is-compact"
                  type="button"
                  disabled={updating === homework.id || correctionActionBlocked}
                  title={correctionActionBlocked ? "Ferme d’abord le sujet avant de publier les résultats." : undefined}
                  onClick={() => setIntent({
                    homework,
                    payload: { correctionsPublished: !homework.correctionsPublished },
                    title: homework.correctionsPublished ? "Masquer les résultats ?" : "Publier les notes et le corrigé ?",
                    message: homework.correctionsPublished
                      ? "Les copies restent corrigées, mais les élèves ne verront plus les notes ni les explications."
                      : "Le serveur refusera cette action si une copie attend encore sa correction humaine.",
                  })}
                >
                  {homework.correctionsPublished
                    ? "Masquer les résultats"
                    : correctionActionBlocked
                      ? "Fermer avant de publier"
                      : "Publier résultats + corrigé"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {intent && (
        <div className="homework-import-confirmation" role="alertdialog" aria-modal="true" aria-labelledby="homework-publication-confirm-title">
          <div>
            <ShieldCheck size={27} weight="duotone" />
            <section><h4 id="homework-publication-confirm-title">{intent.title}</h4><p>{intent.message}</p></section>
            <button type="button" aria-label="Annuler" onClick={() => setIntent(null)}><X size={18} /></button>
          </div>
          <footer>
            <button className="secondary-action" type="button" disabled={Boolean(updating)} onClick={() => setIntent(null)}>Annuler</button>
            <button className="primary-action is-compact" type="button" disabled={Boolean(updating)} onClick={() => void apply()}>{updating ? "Mise à jour…" : "Confirmer"}</button>
          </footer>
        </div>
      )}
    </section>
  );
}
