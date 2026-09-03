import {
  Check,
  CheckCircle,
  ClipboardText,
  FileText,
  FileLock,
  LockKey,
  RocketLaunch,
  ShieldCheck,
  UploadSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";
import { formatHomeworkDuration } from "../../../domain/homework";
import { importHomeworkPackage, setHomeworkPublication } from "./homeworkReviewApi";
import { parseHomeworkImportText } from "./homeworkImportModel";
import type {
  HomeworkImportIssue,
  HomeworkImportResponse,
  HomeworkPublicationPayload,
} from "./homeworkReviewTypes";

const MAX_PACKAGE_BYTES = 4 * 1024 * 1024;

function serverIssueText(issue: string | HomeworkImportIssue) {
  return typeof issue === "string"
    ? issue
    : `${issue.path ? `${issue.path} — ` : ""}${issue.message}`;
}

function importedReference(response: HomeworkImportResponse) {
  return response.homework.stableId || response.homework.slug || response.homework.id;
}

function publicationLabel(homework: HomeworkImportResponse["homework"]) {
  if (homework.correctionsPublished) return "Sujet et corrigé publiés";
  if (homework.subjectPublished) return "Sujet publié · corrigé masqué";
  return "Brouillon fermé";
}

export function HomeworkPackageImporter({ onImported }: { onImported?: () => void }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imported, setImported] = useState<HomeworkImportResponse | null>(null);
  const [publicationIntent, setPublicationIntent] = useState<HomeworkPublicationPayload | null>(null);
  const [publishing, setPublishing] = useState(false);
  const inspection = useMemo(() => parseHomeworkImportText(source), [source]);
  const errors = inspection.issues.filter((issue) => issue.severity === "error");
  const warnings = inspection.issues.filter((issue) => issue.severity === "warning");

  const readFile = async (file?: File) => {
    setFileError(null);
    setSubmitError(null);
    setImported(null);
    if (!file) return;
    if (!file.name.toLocaleLowerCase("fr").endsWith(".json")) {
      setFileError("Choisis un fichier JSON.");
      return;
    }
    if (file.size > MAX_PACKAGE_BYTES) {
      setFileError("Ce paquet dépasse 4 Mo. Sépare les pièces jointes du JSON puis réessaie.");
      return;
    }
    try {
      const content = await file.text();
      setSource(content);
      setFileName(file.name);
    } catch {
      setFileError("Le fichier n’a pas pu être lu sur cet appareil.");
    }
  };

  const clearPackage = () => {
    setSource("");
    setFileName(null);
    setFileError(null);
    setSubmitError(null);
    setImported(null);
    setPublicationIntent(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  const importPackage = async () => {
    if (!inspection.valid || !inspection.package) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await importHomeworkPackage(inspection.package);
      setImported(response);
      setSource("");
      setFileName(null);
      if (fileInput.current) fileInput.current.value = "";
      onImported?.();
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : "Le paquet n’a pas pu être importé.");
    } finally {
      setSubmitting(false);
    }
  };

  const applyPublication = async () => {
    if (!imported || !publicationIntent) return;
    setPublishing(true);
    setSubmitError(null);
    try {
      const response = await setHomeworkPublication(importedReference(imported), publicationIntent);
      setImported((current) => current ? { ...current, homework: response.homework } : current);
      setPublicationIntent(null);
      onImported?.();
    } catch (reason) {
      setSubmitError(reason instanceof Error ? reason.message : "L’état de publication n’a pas pu être modifié.");
    } finally {
      setPublishing(false);
    }
  };

  if (imported) {
    const homework = imported.homework;
    const serverErrors = imported.validation?.errors?.map(serverIssueText) ?? [];
    const serverWarnings = imported.validation?.warnings?.map(serverIssueText) ?? [];
    return (
      <section className="homework-importer homework-importer-success" aria-labelledby="homework-import-success-title">
        <div className="homework-import-success-mark"><CheckCircle size={34} weight="fill" /></div>
        <div className="homework-import-success-copy">
          <p className="admin-eyebrow">Paquet privé importé</p>
          <h3 id="homework-import-success-title">{homework.title}</h3>
          <p>{homework.institution} · {homework.academicYear}</p>
          <div className="homework-import-success-badges">
            <span>{homework.level.name} {homework.series.name}</span>
            <span>{homework.subject.name}</span>
            <span>{homework.questionCount} question{homework.questionCount > 1 ? "s" : ""}</span>
            {imported.version != null && <span>Version {imported.version}</span>}
          </div>
        </div>

        <div className={`homework-import-publication-state${homework.subjectPublished ? " is-open" : ""}`}>
          {homework.subjectPublished ? <RocketLaunch size={22} weight="duotone" /> : <FileLock size={22} weight="duotone" />}
          <div>
            <strong>{publicationLabel(homework)}</strong>
            <span>{homework.subjectPublished ? "Les élèves autorisés peuvent ouvrir le sujet." : "Aucun élève ne voit encore ce devoir."}</span>
          </div>
        </div>

        {(serverErrors.length > 0 || serverWarnings.length > 0) && (
          <div className="homework-import-server-validation">
            {serverErrors.map((message) => <p className="is-error" key={message}><WarningCircle size={17} />{message}</p>)}
            {serverWarnings.map((message) => <p key={message}><WarningCircle size={17} />{message}</p>)}
          </div>
        )}

        <div className="homework-import-publication-actions">
          <button
            className={homework.subjectPublished ? "secondary-action" : "primary-action is-compact"}
            type="button"
            onClick={() => setPublicationIntent(homework.subjectPublished
              ? { subjectPublished: false, correctionsPublished: false }
              : { subjectPublished: true })}
          >
            {homework.subjectPublished ? "Fermer le sujet" : "Publier le sujet"}
          </button>
          <button
            className="secondary-action"
            type="button"
            disabled={publishing || Boolean(homework.subjectPublished && !homework.correctionsPublished)}
            onClick={() => setPublicationIntent({ correctionsPublished: !homework.correctionsPublished })}
          >
            {homework.correctionsPublished
              ? "Masquer le corrigé"
              : homework.subjectPublished
                ? "Fermer le sujet avant le corrigé"
                : "Publier les résultats et le corrigé"}
          </button>
          <button className="homework-import-new-button" type="button" onClick={clearPackage}>
            Importer un autre paquet
          </button>
        </div>

        {publicationIntent && (
          <div className="homework-import-confirmation" role="alertdialog" aria-modal="true" aria-labelledby="homework-import-confirmation-title">
            <div>
              <ShieldCheck size={27} weight="duotone" />
              <section>
                <h4 id="homework-import-confirmation-title">
                  {publicationIntent.subjectPublished === true
                    ? "Rendre ce sujet visible aux élèves ?"
                    : publicationIntent.subjectPublished === false
                      ? "Fermer ce sujet aux nouvelles tentatives ?"
                      : publicationIntent.correctionsPublished === true
                        ? "Publier les notes et les corrections ?"
                        : "Masquer de nouveau les corrections ?"}
                </h4>
                <p>
                  {publicationIntent.correctionsPublished === true
                    ? "Le serveur vérifiera que toutes les copies sont corrigées et que chaque explication est complète."
                    : "Cette action ne supprime ni le devoir, ni les copies déjà déposées."}
                </p>
              </section>
              <button type="button" aria-label="Annuler" onClick={() => setPublicationIntent(null)}><X size={18} /></button>
            </div>
            <footer>
              <button className="secondary-action" type="button" disabled={publishing} onClick={() => setPublicationIntent(null)}>Annuler</button>
              <button className="primary-action is-compact" type="button" disabled={publishing} onClick={() => void applyPublication()}>
                {publishing ? "Mise à jour…" : "Confirmer"}
              </button>
            </footer>
          </div>
        )}

        {submitError && <p className="homework-review-submit-error" role="alert"><WarningCircle size={18} />{submitError}</p>}
      </section>
    );
  }

  return (
    <section className="homework-importer" aria-labelledby="homework-import-title">
      <header className="homework-import-heading">
        <div>
          <p className="admin-eyebrow"><FileText size={16} weight="duotone" /> Banque privée</p>
          <h2 id="homework-import-title">Importer un devoir interactif</h2>
          <p>Colle le paquet préparé ou choisis son fichier JSON. Il est contrôlé ici, puis créé fermé par défaut.</p>
        </div>
        <span><LockKey size={18} weight="duotone" /> Corrigé confidentiel</span>
      </header>

      <div className="homework-import-privacy">
        <ShieldCheck size={21} weight="duotone" />
        <p><strong>Le fichier reste sur ton appareil jusqu’au clic sur « Importer ».</strong> Son corrigé n’est ni enregistré dans le navigateur, ni affiché dans l’aperçu.</p>
      </div>

      <div className="homework-import-grid">
        <section className="homework-import-source">
          <div className="homework-import-source-heading">
            <div>
              <strong>1. Ajouter le paquet</strong>
              <span>JSON privé · maximum 4 Mo</span>
            </div>
            {source && <button type="button" onClick={clearPackage}><X size={16} /> Effacer</button>}
          </div>

          <input
            ref={fileInput}
            className="sr-only"
            id="homework-import-file"
            type="file"
            accept="application/json,.json"
            onChange={(event) => void readFile(event.currentTarget.files?.[0])}
          />
          <label className="homework-import-file" htmlFor="homework-import-file">
            <UploadSimple size={24} weight="duotone" />
            <span><strong>{fileName ?? "Choisir un fichier JSON"}</strong><small>Le contenu remplacera le texte collé.</small></span>
          </label>

          <div className="homework-import-or"><span>ou</span></div>

          <label className="homework-import-textarea" htmlFor="homework-import-json">
            <span><ClipboardText size={17} weight="duotone" /> Coller le JSON</span>
            <textarea
              id="homework-import-json"
              rows={18}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              value={source}
              placeholder={'{\n  "importId": "…",\n  "title": "Devoir de Mathématiques",\n  "sections": [ … ]\n}'}
              onChange={(event) => {
                setSource(event.currentTarget.value);
                setFileName(null);
                setFileError(null);
                setSubmitError(null);
              }}
            />
          </label>
          {fileError && <p className="homework-import-inline-error" role="alert"><WarningCircle size={18} />{fileError}</p>}
        </section>

        <section className="homework-import-preview" aria-live="polite">
          <div className="homework-import-preview-heading">
            <div>
              <strong>2. Vérifier l’aperçu</strong>
              <span>Aucune réponse correcte n’est révélée.</span>
            </div>
            <span className={inspection.valid ? "is-valid" : "is-invalid"}>
              {inspection.valid ? <CheckCircle size={18} weight="fill" /> : <WarningCircle size={18} weight="fill" />}
              {inspection.valid ? "Prêt" : `${errors.length} erreur${errors.length > 1 ? "s" : ""}`}
            </span>
          </div>

          {inspection.package ? (
            <>
              <div className="homework-import-metadata">
                <div className="is-wide"><span>Titre</span><strong>{inspection.metadata.title || "Non renseigné"}</strong></div>
                <div><span>Établissement</span><strong>{inspection.metadata.institution || "Non renseigné"}</strong></div>
                <div><span>Année</span><strong>{inspection.metadata.academicYear || "Non renseignée"}</strong></div>
                <div><span>Classe</span><strong>{[inspection.metadata.level, inspection.metadata.series].filter(Boolean).join(" ") || "Non renseignée"}</strong></div>
                <div><span>Matière</span><strong>{inspection.metadata.subject || "Non renseignée"}</strong></div>
                <div><span>Durée</span><strong>{inspection.metadata.durationSeconds ? formatHomeworkDuration(inspection.metadata.durationSeconds) : "Non renseignée"}</strong></div>
              </div>

              <div className="homework-import-kpis">
                <div><strong>{inspection.counts.exercises}</strong><span>exercices</span></div>
                <div><strong>{inspection.counts.questions}</strong><span>questions</span></div>
                <div><strong>{inspection.totalPoints}</strong><span>points</span></div>
                <div><strong>{inspection.counts.detailedCorrections}/{inspection.counts.questions}</strong><span>corrections</span></div>
              </div>

              <div className="homework-import-grading-breakdown">
                <strong>Répartition de la correction</strong>
                <div>
                  <span><i className="is-auto" /> Automatique <b>{inspection.counts.auto}</b></span>
                  <span><i className="is-hybrid" /> Hybride <b>{inspection.counts.hybrid}</b></span>
                  <span><i className="is-manual" /> Humaine <b>{inspection.counts.manual}</b></span>
                </div>
                <small>{inspection.counts.rubricCriteria} critères de barème humain détectés.</small>
              </div>

              <div className="homework-import-issues">
                {errors.map((issue, index) => (
                  <p className="is-error" key={`${issue.path}-${index}`}><WarningCircle size={17} /><span><strong>{issue.path}</strong>{issue.message}</span></p>
                ))}
                {warnings.map((issue, index) => (
                  <p key={`${issue.path}-${index}`}><WarningCircle size={17} /><span><strong>{issue.path}</strong>{issue.message}</span></p>
                ))}
                {inspection.valid && warnings.length === 0 && (
                  <p className="is-valid"><CheckCircle size={17} /><span><strong>Contrôle terminé</strong>Aucune anomalie détectée.</span></p>
                )}
              </div>
            </>
          ) : (
            <div className="homework-import-empty">
              <FileLock size={42} weight="duotone" />
              <strong>L’aperçu apparaîtra ici</strong>
              <p>Métadonnées, exercices, questions, barème et anomalies seront contrôlés en temps réel.</p>
            </div>
          )}
        </section>
      </div>

      {submitError && <p className="homework-review-submit-error" role="alert"><WarningCircle size={18} />{submitError}</p>}

      <footer className="homework-import-submit-bar">
        <div>
          <FileLock size={20} weight="duotone" />
          <span><strong>Import sécurisé en brouillon</strong><small>Le sujet et le corrigé resteront fermés après l’import.</small></span>
        </div>
        <button className="primary-action is-compact" type="button" disabled={!inspection.valid || submitting} onClick={() => void importPackage()}>
          {submitting ? "Import en cours…" : <><Check size={18} weight="bold" />Importer le devoir</>}
        </button>
      </footer>
    </section>
  );
}
