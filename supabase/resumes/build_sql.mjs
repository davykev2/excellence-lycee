// Générateur SQL des résumés de cours.
// Usage : node build_sql.mjs <dossier-manifest>
// Lit <dossier>/manifest.json + les .md listés, produit un SQL idempotent
// (création des chapitres + injection des résumés) à coller dans le SQL Editor Supabase.

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'

const dir = resolve(process.argv[2] ?? '.')
const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8'))
const { matiere_slug, niveau, series, lecons, output } = manifest

const sqlEscape = (s) => s.replaceAll("'", "''")
const seriesList = series.map((s) => `'${sqlEscape(s)}'`).join(', ')

let sql = `-- ============================================================================
-- EXCELLENCE LYCÉE — résumés ${matiere_slug} / ${niveau} (séries ${series.join(', ')})
-- Généré par supabase/resumes/build_sql.mjs — idempotent, rejouable sans risque.
-- À coller intégralement dans Supabase SQL Editor > New query.
-- ============================================================================

-- 1) Création des chapitres (ignorés s'ils existent déjà au même ordre)
insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
select m.id, s.id, x.ordre, x.titre, x.description, true
from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
join (values
${lecons.map((l) => `  (${l.ordre}, '${sqlEscape(l.titre)}', '${sqlEscape(l.description)}')`).join(',\n')}
) as x(ordre, titre, description) on true
where m.slug = '${matiere_slug}' and n.nom = '${sqlEscape(niveau)}' and s.nom in (${seriesList})
on conflict (matiere_id, serie_id, ordre) do nothing;

-- 2) Injection des résumés (titre et description resynchronisés au passage)
`

for (const l of lecons) {
  const md = readFileSync(join(dir, l.file), 'utf8').trim()
  if (md.includes('$md$')) throw new Error(`${l.file} contient le délimiteur $md$`)
  sql += `
-- ---- ${l.titre} ----
update public.chapitres c set
  titre = '${sqlEscape(l.titre)}',
  description = '${sqlEscape(l.description)}',
  resume = $md$${md}$md$,
  resume_published = true,
  published = true
from public.matieres m, public.series s, public.niveaux n
where c.matiere_id = m.id and c.serie_id = s.id and s.niveau_id = n.id
  and m.slug = '${matiere_slug}' and n.nom = '${sqlEscape(niveau)}' and s.nom in (${seriesList})
  and c.ordre = ${l.ordre};
`
}

sql += `
-- Contrôle : liste des résumés publiés pour la matière
select s.nom as serie, c.ordre, c.titre, length(c.resume) as taille_resume, c.resume_published
from public.chapitres c
join public.matieres m on m.id = c.matiere_id
join public.series s on s.id = c.serie_id
join public.niveaux n on n.id = s.niveau_id
where m.slug = '${matiere_slug}' and n.nom = '${sqlEscape(niveau)}'
order by s.nom, c.ordre;
`

const outPath = resolve(dir, output)
writeFileSync(outPath, sql, 'utf8')
console.log(`OK -> ${outPath} (${lecons.length} leçons x ${series.length} séries)`)
