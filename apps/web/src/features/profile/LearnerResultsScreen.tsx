import { useEffect, useMemo, useState } from "react";
import { ArrowClockwise, ArrowLeft, ArrowRight, BookOpenText, ChartBar, ClipboardText, GraduationCap } from "@phosphor-icons/react";
import type { SchoolLevel, SubjectId } from "../../domain/learning";
import type { LearningPath } from "../../domain/paths";
import type { ProgressLesson } from "../progress/useLearningProgress";
import { loadLearningPathsForLevel } from "../../data/learningPathLoader";
import { subjects } from "../../data/programme";
import { MathText } from "../../components/MathText";
import { recordedCourseResults } from "./resultsModel";

interface LearnerResultsScreenProps {
  level: SchoolLevel;
  progressByPath: Record<string, Record<string, ProgressLesson>>;
  progressError: string | null;
  onRetryProgress: () => void;
  onBack: () => void;
  onOpenCourse: (pathId: string, lessonId: string, subjectId: SubjectId) => void;
  onOpenHomeworks?: () => void;
  onOpenExams?: () => void;
}

export function LearnerResultsScreen({ level, progressByPath, progressError, onRetryProgress, onBack, onOpenCourse, onOpenHomeworks, onOpenExams }: LearnerResultsScreenProps) {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);
    loadLearningPathsForLevel(level.id).then(value => { if (active) setPaths(value); }).catch(() => { if (active) setLoadError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [level.id, reloadKey]);
  const results = useMemo(() => recordedCourseResults(paths, progressByPath, level.id), [level.id, paths, progressByPath]);

  return (
    <main className="personal-space-page results-page">
      <button className="path-back-button" type="button" onClick={onBack}><ArrowLeft size={20} /> Mon espace</button>
      <header className="personal-space-heading"><p className="path-kicker">{level.label}</p><h1>Mes résultats</h1></header>
      {(onOpenHomeworks || onOpenExams) && <section className="results-destinations" aria-label="Copies et corrections">
        {onOpenHomeworks && <button type="button" onClick={onOpenHomeworks}><ClipboardText size={25} weight="duotone" /><span><strong>Mes devoirs et leurs corrections</strong></span><ArrowRight size={20} /></button>}
        {onOpenExams && <button type="button" onClick={onOpenExams}><GraduationCap size={25} weight="duotone" /><span><strong>Mes sujets d’examen</strong></span><ArrowRight size={20} /></button>}
      </section>}
      <section className="results-history" aria-labelledby="results-history-title">
        <div className="results-section-heading"><ChartBar size={25} weight="duotone" /><div><h2 id="results-history-title">Mes vérifications enregistrées</h2><p>La meilleure note obtenue pour chaque partie travaillée.</p></div></div>
        {progressError || loadError ? <div className="results-empty" role="alert"><p>{progressError || "Tes résultats n’ont pas pu être chargés."}</p><button type="button" onClick={() => { onRetryProgress(); setReloadKey(value => value + 1); }}><ArrowClockwise size={18} /> Réessayer</button></div>
          : loading ? <p role="status">Chargement de tes résultats…</p>
          : results.length === 0 ? <div className="results-empty"><BookOpenText size={32} weight="duotone" /><h3>Aucun résultat enregistré</h3></div>
          : <div className="results-list">{results.map(result => <button type="button" className="results-row" key={`${result.pathId}:${result.lessonId}`} onClick={() => onOpenCourse(result.pathId, result.lessonId, result.subjectId)}>
            <span><small>{subjects[result.subjectId].label} · <MathText>{result.pathTitle}</MathText></small><strong><MathText>{result.lessonTitle}</MathText></strong><small>{result.attemptCount} tentative{result.attemptCount > 1 ? "s" : ""}</small></span>
            <b aria-label={`Meilleure note : ${result.bestScore} sur 20`}>{result.bestScore.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}<small>/20</small></b><ArrowRight size={18} />
          </button>)}</div>}
      </section>
    </main>
  );
}
