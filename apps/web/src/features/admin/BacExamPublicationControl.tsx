import { useState } from "react";
import {
  ArrowSquareOut,
  CheckCircle,
  FileText,
  LockKey,
  Student,
  WarningCircle,
} from "@phosphor-icons/react";
import { useBacExam } from "../arena/useBacExam";

export function BacExamPublicationControl({ preview = false }: { preview?: boolean }) {
  const exam = useBacExam({ preview });
  const [notice, setNotice] = useState<string | null>(null);
  const state = exam.state;

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
          <p className="admin-eyebrow">Épreuve nationale</p>
          <h2>Concours BAC & BT 2024</h2>
        </div>
        <span className={`admin-bac-status ${state?.resultsPublished ? "is-published" : "is-locked"}`}>
          {state?.resultsPublished ? <CheckCircle size={18} weight="fill" /> : <LockKey size={18} weight="duotone" />}
          {state?.resultsPublished ? "Résultats actifs" : "Résultats masqués"}
        </span>
      </header>

      {exam.loading ? (
        <p className="admin-bac-loading" role="status">Chargement de l’épreuve…</p>
      ) : (
        <>
          <div className="admin-bac-metrics">
            <div><FileText size={24} weight="duotone" /><span><strong>69</strong><small>questions publiées</small></span></div>
            <div><Student size={24} weight="duotone" /><span><strong>{state?.totalSubmissions ?? 0}</strong><small>copies reçues</small></span></div>
            <div className={state?.answerKeyReady ? "is-ready" : "is-waiting"}>
              {state?.answerKeyReady ? <CheckCircle size={24} weight="fill" /> : <WarningCircle size={24} weight="duotone" />}
              <span><strong>{state?.answerKeyReady ? "Prête" : "En attente"}</strong><small>correction officielle</small></span>
            </div>
          </div>

          {!state?.answerKeyReady && (
            <div className="admin-bac-warning">
              <WarningCircle size={23} weight="duotone" />
              <p><strong>Activation sécurisée.</strong><span>Le bouton sera disponible dès que la correction des 69 questions aura été chargée.</span></p>
            </div>
          )}

          <div className="admin-bac-actions">
            <a className="secondary-action" href="/arene/concours-bac-ci-2024">
              Ouvrir le sujet <ArrowSquareOut size={18} weight="bold" />
            </a>
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
