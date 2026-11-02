import { ArrowLeft, ArrowRight, FileText } from "@phosphor-icons/react";
import {
  isOfficialBacLevel, officialBacPapersFor, officialBacSeriesLabel, officialBacYears,
} from "../../data/officialBacCatalog";

export interface OfficialBacSelectionProps {
  levelId: string;
  archiveYear?: number;
  archivePaperId?: string;
  onArchiveSelection: (year?: number, paperId?: string) => void;
}

export function OfficialBacLibrary({ levelId, archiveYear, archivePaperId, onArchiveSelection }: OfficialBacSelectionProps) {
  const year = officialBacYears.find(value => value === archiveYear);
  const papers = year ? officialBacPapersFor(year, levelId) : [];
  return (
    <section className="official-bac-library" aria-labelledby="official-bac-title">
      <header className="official-bac-heading">
        <div>
          {year && <button className="path-back-button" type="button" onClick={() => onArchiveSelection()}><ArrowLeft size={18} />Les années</button>}
          <h2 id="official-bac-title">{year ? `BAC ${year}` : "Choisis une année"}</h2>
        </div>
        <span className="official-bac-series">{officialBacSeriesLabel(levelId)}</span>
      </header>
      {!isOfficialBacLevel(levelId) ? <p>Ces documents sont disponibles en Terminale A, C et D.</p> : !year ? (
        <div className="official-bac-years">
          {officialBacYears.map(value => <button key={value} type="button" onClick={() => onArchiveSelection(value)}>
            <FileText size={30} weight="duotone" aria-hidden="true" /><span>BAC <strong>{value}</strong></span><ArrowRight size={24} aria-hidden="true" />
          </button>)}
        </div>
      ) : <>
        {archivePaperId && <p className="official-bac-unavailable" role="status">Ce document n’est pas disponible pour ta série.</p>}
        <div className="official-bac-subjects">
          {papers.map(paper => <button className="official-bac-subject" type="button" key={paper.id} onClick={() => onArchiveSelection(year, paper.id)}>
            <img src={paper.coverUrl} alt="" width={90} height={122} loading="lazy" />
            <span className="official-bac-subject-info"><strong>{paper.subject}</strong><span>{paper.series.includes("et") || paper.series.includes(",") ? "Séries" : "Série"} {paper.series}</span><small>{paper.pageCount} page{paper.pageCount > 1 ? "s" : ""} · PDF</small></span>
            <ArrowRight size={23} aria-hidden="true" />
          </button>)}
        </div>
      </>}
    </section>
  );
}
