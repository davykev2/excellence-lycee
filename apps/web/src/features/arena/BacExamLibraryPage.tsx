import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  LockKey,
  SealCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { bacExamCatalog, type BacExamCatalogEntry, type BacExamSlug } from "../../data/bacExamCatalog";
import { useBacExam } from "./useBacExam";
import type { KeyboardEvent } from "react";
import { INP_HB_COLLECTION_LOCKED } from "../../config/examCollections";
import { getOfficialBacPaper } from "../../data/officialBacCatalog";
import { OfficialBacLibrary, type OfficialBacSelectionProps } from "./OfficialBacLibrary";
import { OfficialBacReader } from "./OfficialBacReader";

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
  const sourceVerified = exam.sourceVerified !== false;
  const accessible = sourceVerified && Boolean(state?.subjectPublished || state?.canManageSubject || preview);
  const isEsatic = exam.collection === "esatic";
  const paperCount = exam.papers?.length ?? exam.sections.length;

  return (
    <article className={`bac-library-card ${isEsatic ? "is-esatic" : ""} ${sourceVerified && state?.subjectPublished ? "is-open" : "is-closed"}`}>
      <header>
        <span>{exam.year}</span>
        <div>
          <small>{isEsatic ? "Concours ESATIC" : exam.responseSheetAvailable ? (exam.format === "interactive" ? "Sujet interactif" : "Archive officielle") : "Sujet à consulter"}</small>
          <h2>{exam.shortTitle}</h2>
        </div>
        <span className="bac-library-status">
          {!sourceVerified
            ? <><WarningCircle size={17} weight="duotone" />Source à remplacer</>
            : remote.loading
            ? "Vérification…"
            : state?.subjectPublished
              ? <><CheckCircle size={17} weight="fill" />Ouvert</>
              : <><LockKey size={17} weight="duotone" />Fermé</>}
        </span>
      </header>
      <p>{exam.sourceNotice ?? exam.description}</p>
      <div className="bac-library-metadata">
        <span><FileText size={18} weight="duotone" /><strong>{exam.questionCount}</strong> questions</span>
        <span><Clock size={18} weight="duotone" />{exam.responseSheetAvailable ? <><strong>{exam.durationMinutes / 60} h</strong> indicatives</> : <><strong>Libre</strong> consultation</>}</span>
        <span><SealCheck size={18} weight="duotone" /><strong>{paperCount}</strong> {isEsatic ? "épreuves" : "matières"}</span>
      </div>
      {remote.error && <p className="bac-library-error" role="alert">{remote.error}</p>}
      <button
        className={accessible ? "primary-action is-compact" : "secondary-action"}
        type="button"
        disabled={!accessible || remote.loading}
        onClick={() => onOpen(exam.slug)}
      >
        {!sourceVerified
          ? "Sujet indisponible"
          : state?.subjectPublished
          ? exam.responseSheetAvailable ? "Commencer le sujet" : "Consulter le sujet"
          : state?.canManageSubject || preview
            ? exam.responseSheetAvailable ? "Prévisualiser en administrateur" : "Consulter en administrateur"
            : "Sujet fermé par Davy"}
        {accessible ? <ArrowRight size={19} weight="bold" /> : <LockKey size={18} weight="duotone" />}
      </button>
    </article>
  );
}

export function BacExamLibraryPage({
  preview = false,
  collection = "inp-hb",
  levelId,
  archiveYear,
  archivePaperId,
  onArchiveSelection,
  onCollectionChange,
  onBackArena,
  onOpenExam,
}: OfficialBacSelectionProps & {
  preview?: boolean;
  collection?: "inp-hb" | "bac";
  onCollectionChange: (collection: "inp-hb" | "bac") => void;
  onBackArena: () => void;
  onOpenExam: (slug: BacExamSlug) => void;
}) {
  const verifiedSessionCount = bacExamCatalog.filter((exam) => exam.sourceVerified !== false).length;
  const bacSessions = bacExamCatalog.filter((exam) => exam.collection !== "esatic");
  const esaticSessions = bacExamCatalog.filter((exam) => exam.collection === "esatic");
  const paper = collection === "bac" ? getOfficialBacPaper(archiveYear, archivePaperId, levelId) : undefined;
  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
    const index = event.key === "Home" ? 0 : event.key === "End" ? 1
      : event.key === "ArrowRight" ? (current + 1) % 2 : event.key === "ArrowLeft" ? (current + 1) % 2 : -1;
    if (index < 0) return;
    event.preventDefault(); tabs[index]?.focus(); onCollectionChange(index === 0 ? "inp-hb" : "bac");
  };

  if (paper) return <OfficialBacReader key={paper.id} paper={paper} onBack={() => onArchiveSelection(paper.year)} />;

  return (
    <main className="bac-library-page">
      <header className="bac-library-topbar">
        <button className="path-back-button" type="button" onClick={onBackArena}>
          <ArrowLeft size={20} weight="bold" />M’entraîner
        </button>
        <span><GraduationCap size={20} weight="duotone" />Annales et concours</span>
      </header>

      <section className="bac-library-hero">
        <div>
          <p className="path-kicker">Annales Excellence</p>
          <h1>Sujets d’examen</h1>
          {collection === "inp-hb" && !INP_HB_COLLECTION_LOCKED && <div>
            <span><strong>{verifiedSessionCount}</strong> sessions disponibles</span>
            <span><strong>4</strong> zones de participation</span>
            <span><strong>{esaticSessions.length}</strong> sujets ESATIC</span>
          </div>}
        </div>
      </section>

      <div className="exam-collection-tabs" role="tablist" aria-label="Catégorie de sujets" onKeyDown={onTabKeyDown}>
        <button id="exam-tab-inp-hb" role="tab" type="button" aria-controls="exam-collection-panel" aria-selected={collection === "inp-hb"} tabIndex={collection === "inp-hb" ? 0 : -1} onClick={() => onCollectionChange("inp-hb")}>
          {INP_HB_COLLECTION_LOCKED && <LockKey size={20} weight="fill" aria-hidden="true" />}<span>INP-HB</span>
          {INP_HB_COLLECTION_LOCKED && <small>Verrouillé</small>}
        </button>
        <button id="exam-tab-bac" role="tab" type="button" aria-controls="exam-collection-panel" aria-selected={collection === "bac"} tabIndex={collection === "bac" ? 0 : -1} onClick={() => onCollectionChange("bac")}>Anciens sujets de BAC</button>
      </div>

      {collection === "inp-hb" ? <div id="exam-collection-panel" role="tabpanel" aria-labelledby="exam-tab-inp-hb">
      {INP_HB_COLLECTION_LOCKED ? <section className="exam-collection-empty exam-collection-locked" aria-labelledby="exam-lock-title">
        <div className="exam-lock-symbol"><LockKey size={38} weight="duotone" aria-hidden="true" /></div>
        <h2 id="exam-lock-title">Contenu INP-HB verrouillé</h2>
        <p>Ces sujets ne sont pas accessibles pour le moment.</p>
      </section> : <>
      <section className="bac-library-collection" aria-labelledby="bac-library-bac-title">
        <header>
          <div><p className="path-kicker">Concours d’entrée</p><h2 id="bac-library-bac-title">Sujets INP-HB</h2></div>
          <span>{bacSessions.length} sessions</span>
        </header>
        <div className="bac-library-grid">
          {bacSessions.map((exam) => (
            <BacExamLibraryCard key={exam.id} exam={exam} preview={preview} onOpen={onOpenExam} />
          ))}
        </div>
      </section>

      <section className="bac-library-collection is-esatic" aria-labelledby="bac-library-esatic-title">
        <header>
          <div><p className="path-kicker">Concours d’entrée</p><h2 id="bac-library-esatic-title">Annales ESATIC</h2></div>
          <span>{esaticSessions.length} sujets</span>
        </header>
        <div className="bac-library-grid">
          {esaticSessions.map((exam) => (
            <BacExamLibraryCard key={exam.id} exam={exam} preview={preview} onOpen={onOpenExam} />
          ))}
        </div>
      </section>
      </>}
      </div> : <div id="exam-collection-panel" role="tabpanel" aria-labelledby="exam-tab-bac">
        <OfficialBacLibrary levelId={levelId} archiveYear={archiveYear} archivePaperId={archivePaperId} onArchiveSelection={onArchiveSelection} />
      </div>}
    </main>
  );
}
