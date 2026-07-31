import { useState } from "react";
import {
  ArrowSquareOut,
  CheckCircle,
  Eye,
  EyeSlash,
  FileText,
  LockKey,
  Student,
  WarningCircle,
} from "@phosphor-icons/react";
import { bacExamCatalog, type BacExamCatalogEntry } from "../../data/bacExamCatalog";
import { useBacExam } from "../arena/useBacExam";

function BacExamPublicationCard({ definition, preview }: { definition: BacExamCatalogEntry; preview: boolean }) {
  const exam = useBacExam({ preview, examId: definition.id });
  const [notice, setNotice] = useState<string | null>(null);
  const state = exam.state;

  const toggleSubject = async () => {
    if (!state) return;
    setNotice(null);
    try {
      await exam.setSubjectPublished(!state.subjectPublished);
      setNotice(state.subjectPublished
        ? "Le sujet est fermé : aucune nouvelle copie ne peut être envoyée."
        : "Le sujet est maintenant ouvert aux candidats.");
    } catch {
      // Le hook expose déjà le message détaillé renvoyé par le serveur.
    }
  };

  const togglePublication = async () => {
    if (!state) return;
    setNotice(null);
    try {
      await exam.setResultsPublished(!state.resultsPublished);
      setNotice(state.resultsPublished ? "Les résultats sont de nouveau masqués." : "Les résultats et la correction sont maintenant accessibles.");
    } catch {
      // Le hook expose déjà le message détaillé renvoyé par le serveur.
    }
  };

  return (
    <article className="admin-panel admin-bac-publication">
      <header className="admin-panel-header">
        <div>
          <p className="admin-eyebrow">Épreuve nationale · {definition.year}</p>
          <h2>{definition.title}</h2>
        </div>
        <div className="admin-bac-statuses">
          <span className={`admin-bac-status ${state?.subjectPublished ? "is-published" : "is-locked"}`}>
            {state?.subjectPublished ? <Eye size={18} weight="fill" /> : <EyeSlash size={18} weight="duotone" />}
            {state?.subjectPublished ? "Sujet ouvert" : "Sujet fermé"}
          </span>
          <span className={`admin-bac-status ${state?.resultsPublished ? "is-published" : "is-locked"}`}>
            {state?.resultsPublished ? <CheckCircle size={18} weight="fill" /> : <LockKey size={18} weight="duotone" />}
            {state?.resultsPublished ? "Résultats actifs" : "Résultats masqués"}
          </span>
        </div>
      </header>

      {exam.loading ? (
        <p className="admin-bac-loading" role="status">Chargement de l’épreuve…</p>
      ) : (
        <>
          <div className="admin-bac-metrics">
            <div><FileText size={24} weight="duotone" /><span><strong>{definition.questionCount}</strong><small>questions dans le sujet</small></span></div>
            <div><Student size={24} weight="duotone" /><span><strong>{state?.totalSubmissions ?? 0}</strong><small>copies reçues</small></span></div>
            <div className={state?.correctionReady ? "is-ready" : "is-waiting"}>
              {state?.correctionReady ? <CheckCircle size={24} weight="fill" /> : <WarningCircle size={24} weight="duotone" />}
              <span><strong>{state?.correctionReady ? "Prête" : "En attente"}</strong><small>{definition.questionCount} réponses expliquées</small></span>
            </div>
          </div>

          {!state?.correctionReady && (
            <div className="admin-bac-warning">
              <WarningCircle size={23} weight="duotone" />
              <p><strong>Correction séparée.</strong><span>Tu peux ouvrir le sujet maintenant. Les résultats resteront masqués jusqu’au chargement des {definition.questionCount} réponses expliquées.</span></p>
            </div>
          )}

          <div className="admin-bac-actions">
            <a className="secondary-action" href={`/arene/exos-types-bac/${definition.slug}`}>
              Prévisualiser le sujet <ArrowSquareOut size={18} weight="bold" />
            </a>
            <button
              className={`secondary-action ${state?.subjectPublished ? "is-danger" : ""}`}
              type="button"
              disabled={exam.submitting || !state}
              onClick={() => void toggleSubject()}
            >
              {exam.submitting
                ? "Mise à jour…"
                : state?.subjectPublished
                  ? <><EyeSlash size={18} weight="bold" />Fermer le sujet</>
                  : <><Eye size={18} weight="bold" />Ouvrir le sujet aux élèves</>}
            </button>
            <button
              className={`primary-action is-compact ${state?.resultsPublished ? "is-danger" : ""}`}
              type="button"
              disabled={exam.submitting || !state || (!state.resultsPublished && !state.canPublishResults)}
              onClick={() => void togglePublication()}
            >
              {exam.submitting
                ? "Mise à jour…"
                : state?.resultsPublished
                  ? "Masquer les résultats"
                  : "Activer les résultats et la correction"}
            </button>
          </div>
          {(notice || exam.error) && (
            <p className={`admin-bac-notice ${exam.error ? "is-error" : ""}`} role={exam.error ? "alert" : "status"}>
              {exam.error ?? notice}
            </p>
          )}
        </>
      )}
    </article>
  );
}

export function BacExamPublicationControl({ preview = false }: { preview?: boolean }) {
  return (
    <section className="admin-bac-publication-list" aria-labelledby="admin-bac-publication-title">
      <header>
        <div><p className="admin-eyebrow">Exos type BAC</p><h2 id="admin-bac-publication-title">Ouverture des sujets</h2></div>
        <span>{bacExamCatalog.length} sessions indépendantes</span>
      </header>
      <p>Ouvre ou ferme chaque année séparément. Un sujet fermé reste visible dans la bibliothèque avec un cadenas.</p>
      <div>
        {bacExamCatalog.map((definition) => (
          <BacExamPublicationCard key={definition.id} definition={definition} preview={preview} />
        ))}
      </div>
    </section>
  );
}
