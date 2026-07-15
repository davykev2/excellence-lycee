import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis.')
}

const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const [niveauxRes, seriesRes, matieresRes, chapitresRes, quizRes] = await Promise.all([
  supabase.from('niveaux').select('id, nom, ordre').order('ordre'),
  supabase.from('series').select('id, nom, niveau_id').order('nom'),
  supabase.from('matieres').select('id, nom, slug').order('ordre'),
  supabase
    .from('chapitres')
    .select('id, titre, ordre, serie_id, matiere_id, published, resume_published')
    .order('ordre'),
  supabase
    .from('quiz')
    .select('id, titre, type, chapitre_id, matiere_id, serie_id, published'),
])

const errors = [niveauxRes, seriesRes, matieresRes, chapitresRes, quizRes]
  .map((result) => result.error?.message)
  .filter(Boolean)

if (errors.length) {
  throw new Error(errors.join(' | '))
}

const niveaux = niveauxRes.data ?? []
const series = seriesRes.data ?? []
const matieres = matieresRes.data ?? []
const chapitres = chapitresRes.data ?? []
const quiz = quizRes.data ?? []
const terminaleId = niveaux.find((niveau) => niveau.nom === 'Terminale')?.id

const terminales = series
  .filter((serie) => serie.niveau_id === terminaleId)
  .map((serie) => {
    const chapitresSerie = chapitres.filter((chapitre) => chapitre.serie_id === serie.id)
    const chapitreIds = new Set(chapitresSerie.map((chapitre) => chapitre.id))
    return {
      id: serie.id,
      nom: serie.nom,
      chapitres: chapitresSerie.length,
      resumes: chapitresSerie.filter((chapitre) => chapitre.resume_published).length,
      quiz: quiz.filter((item) => item.serie_id === serie.id || chapitreIds.has(item.chapitre_id)).length,
      par_matiere: matieres.map((matiere) => ({
        matiere: matiere.nom,
        slug: matiere.slug,
        chapitres: chapitresSerie
          .filter((chapitre) => chapitre.matiere_id === matiere.id)
          .map((chapitre) => ({
            id: chapitre.id,
            ordre: chapitre.ordre,
            titre: chapitre.titre,
            resume_published: chapitre.resume_published,
            quiz: quiz.filter((item) => item.chapitre_id === chapitre.id).length,
          })),
      })).filter((groupe) => groupe.chapitres.length > 0),
    }
  })

console.log(JSON.stringify({
  projet: url.match(/^https:\/\/([^.]+)/)?.[1] ?? url,
  totaux: {
    niveaux: niveaux.length,
    series: series.length,
    matieres: matieres.length,
    chapitres: chapitres.length,
    quiz: quiz.length,
  },
  terminales,
}, null, 2))
