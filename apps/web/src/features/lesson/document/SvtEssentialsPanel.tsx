import { useEffect, useState } from "react";
import { loadSvtEssentialSheet, type SvtEssentialKey } from "../../../data/svtEssentials/registry";
import type { CourseEssentialSheet } from "../../../domain/courseDocument";
import { MathEssentialsContent } from "./MathEssentialsPanel";

export function SvtEssentialsPanel({ sheetKey, active }: { sheetKey: SvtEssentialKey | null; active: boolean }) {
  const [loaded, setLoaded] = useState<{ key: SvtEssentialKey; sheet: CourseEssentialSheet } | null>(null);
  const [error, setError] = useState<SvtEssentialKey | null>(null);
  useEffect(() => {
    if (!active || !sheetKey) return;
    let cancelled = false;
    setError(null);
    loadSvtEssentialSheet(sheetKey).then(sheet => {
      if (!cancelled) setLoaded({ key: sheetKey, sheet });
    }).catch(() => { if (!cancelled) setError(sheetKey); });
    return () => { cancelled = true; };
  }, [sheetKey, active]);
  if (!sheetKey) return <p className="essential-load-state">Contenu à venir.</p>;
  if (loaded?.key === sheetKey) return <MathEssentialsContent key={sheetKey} sheet={loaded.sheet}/>;
  if (error === sheetKey) return <section className="essential-load-state" role="alert"><p>Impossible de charger cette fiche.</p><button type="button" className="document-primary-button" onClick={() => window.location.reload()}>Réessayer</button></section>;
  return <p className="essential-load-state" role="status">Chargement de l’essentiel…</p>;
}
