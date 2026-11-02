import { useState } from "react";
import { ArrowLeft, ArrowSquareOut, DownloadSimple, MagnifyingGlassMinus, MagnifyingGlassPlus } from "@phosphor-icons/react";
import type { OfficialBacPaper } from "../../data/officialBacCatalog";

function DocumentPage({ paper, index }: { paper: OfficialBacPaper; index: number }) {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const page = paper.pages[index];
  return <figure className="official-bac-page" id={`pdf-page-${index + 1}`}>
    {failed ? <div className="official-bac-page-error" role="status"><p>Cette page n’a pas pu se charger.</p><button type="button" className="secondary-action" onClick={() => { setFailed(false); setAttempt(value => value + 1); }}>Réessayer</button><a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">Ouvrir le PDF</a></div> :
      <img key={attempt} src={page.url} width={page.width} height={page.height}
        loading={index === 0 ? "eager" : "lazy"} decoding="async"
        alt={`${paper.subject} · BAC ${paper.year} · ${paper.series} · Page ${index + 1} sur ${paper.pageCount}`}
        onError={() => setFailed(true)} />}
    <figcaption>Page {index + 1} / {paper.pageCount}</figcaption>
  </figure>;
}

/** Read-only facsimile: original order, no grading, form, timer or exam API. */
export function OfficialBacReader({ paper, onBack }: { paper: OfficialBacPaper; onBack: () => void }) {
  const [zoom, setZoom] = useState(1);
  return <main className="official-bac-reader">
    <header className="official-bac-reader-heading">
      <button className="path-back-button" type="button" onClick={onBack}><ArrowLeft size={20} weight="bold" />BAC {paper.year} · Matières</button>
      <div><p className="path-kicker">BAC {paper.year} · {paper.series.includes("et") || paper.series.includes(",") ? "Séries" : "Série"} {paper.series}</p><h1>{paper.subject}</h1></div>
      <div className="official-bac-downloads">
        <a className="secondary-action" href={paper.pdfUrl} download={`BAC-${paper.id}.pdf`}><DownloadSimple size={19} />Télécharger le PDF</a>
        <a className="secondary-action" href={paper.pdfUrl} target="_blank" rel="noopener noreferrer"><ArrowSquareOut size={19} />Ouvrir le PDF</a>
      </div>
    </header>
    <div className="official-bac-toolbar" aria-label="Affichage du document">
      <span>{paper.pageCount} pages</span>
      <div className="official-bac-zoom" role="group" aria-label="Zoom des pages">
        <button type="button" aria-label="Réduire les pages" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .5))}><MagnifyingGlassMinus size={23} /></button>
        <span aria-live="polite">{Math.round(zoom * 100)} %</span>
        <button type="button" aria-label="Agrandir les pages" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .5))}><MagnifyingGlassPlus size={23} /></button>
        {zoom > 1 && <button type="button" onClick={() => setZoom(1)}>Ajuster</button>}
      </div>
    </div>
    <div className="official-bac-pages-viewport" tabIndex={0} role="region" aria-label="Pages du PDF, défilement horizontal si agrandies">
      <div className="official-bac-pages" style={{ width: `${zoom * 100}%` }}>
        {paper.pages.map((page, index) => <DocumentPage key={page.url} paper={paper} index={index} />)}
      </div>
    </div>
  </main>;
}
