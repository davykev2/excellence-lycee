import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  LockKey,
  SealCheck,
} from "@phosphor-icons/react";
import { bacExamCatalog, type BacExamCatalogEntry, type BacExamSlug } from "../../data/bacExamCatalog";
import { CompanionAvatar } from "../companion/CompanionAvatar";
import { useBacExam } from "./useBacExam";

function BacExamLibraryCard({
  exam,
  preview,
  onOpen,
}: {
  exam: BacExamCatalogEntry;
  preview: boolean;
  onOpen: (slug: BacExamSlug) => void;
}) {
  const remote = useBacExam({ examId: exam.id, preview });
  const state = remote.state;
  const accessible = Boolean(state?.subjectPublished || state?.canManageSubject || preview);

  return (
    <article className={`bac-library-card ${state?.subjectPublished ? "is-open" : "is-closed"}`}>
      <header>
        <span>{exam.year}</span>
        <div>
          <small>{exam.format === "interactive" ? "Sujet interactif" : "Archive officielle"}</small>
          <h2>{exam.shortTitle}</h2>
        </div>
        <span className="bac-library-status">
          {remote.loading
            ? "Vérification…"
            : state?.subjectPublished
              ? <><CheckCircle size={17} weight="fill" />Ouvert</>
              : <><LockKey size={17} weight="duotone" />Fermé</>}
        </span>
      </header>
      <p>{exam.description}</p>
      <div className="bac-library-metadata">
        <span><FileText size={18} weight="duotone" /><strong>{exam.questionCount}</strong> questions</span>
        <span><Clock size={18} weight="duotone" /><strong>{exam.durationMinutes / 60} h</strong> indicatives</span>
        <span><SealCheck size={18} weight="duotone" /><strong>3</strong> matières</span>
      </div>
      {remote.error && <p className="bac-library-error" role="alert">{remote.error}</p>}
      <button
        className={accessible ? "primary-action is-compact" : "secondary-action"}
        type="button"
        disabled={!accessible || remote.loading}
        onClick={() => onOpen(exam.slug)}
      >
        {state?.subjectPublished
          ? "Commencer le sujet"
          : state?.canManageSubject || preview
            ? "Prévisualiser en administrateur"
            : "Sujet fermé par Davy"}
        {accessible ? <ArrowRight size={19} weight="bold" /> : <LockKey size={18} weight="duotone" />}
      </button>
    </article>
  );
}

export function BacExamLibraryPage({
  preview = false,
  onBackArena,
  onOpenExam,
}: {
  preview?: boolean;
  onBackArena: () => void;
  onOpenExam: (slug: BacExamSlug) => void;
}) {
  return (
    <main className="bac-library-page">
      <header className="bac-library-topbar">
        <button className="path-back-button" type="button" onClick={onBackArena}>
          <ArrowLeft size={20} weight="bold" />Arène
        </button>
        <span><GraduationCap size={20} weight="duotone" />Exos type BAC</span>
      </header>

      <section className="bac-library-hero">
        <div>
          <p className="path-kicker">Annales Excellence</p>
          <h1>Choisis ton sujet</h1>
          <p>Entraîne-toi sur une session complète : anglais, culture générale et culture scientifique.</p>
          <div>
            <span><strong>5</strong> sessions</span>
            <span><strong>4</strong> zones de participation</span>
            <span><strong>1</strong> seule copie par sujet</span>
          </div>
        </div>
        <div className="bac-library-davy">
          <CompanionAvatar motion="wave" decorative />
          <p><strong>Davy te conseille</strong><span>Commence par une année, puis compare tes progrès à la suivante.</span></p>
        </div>
      </section>

      <section className="bac-library-grid" aria-label="Sujets type BAC disponibles">
        {bacExamCatalog.map((exam) => (
          <BacExamLibraryCard key={exam.id} exam={exam} preview={preview} onOpen={onOpenExam} />
        ))}
      </section>
    </main>
  );
}
