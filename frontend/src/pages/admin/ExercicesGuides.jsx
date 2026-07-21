import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { normalizeMathMarkdown } from '../../lib/mathMarkdown'
import MathMarkdown from '../../components/content/MathMarkdown'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'

const PALIERS = [
  { palier: 'entrainement', libelle: 'Facile', icon: '🌱', titre: 'Fondations' },
  { palier: 'maitrise', libelle: 'Moyen', icon: '⚡', titre: 'Mise en pratique' },
  { palier: 'concours', libelle: 'Difficile', icon: '🏆', titre: 'Défi avancé' },
]

const creerQuestionVide = (ordre) => ({
  ordre,
  enonce_md: '',
  correction_md: '',
  image_url: '',
  image_alt: '',
})

const creerExerciceVide = (numero) => ({
  base_exercice_id: null,
  numero,
  titre: '',
  consigne: 'Traite toutes les questions sur ton cahier avant de consulter la correction.',
  questions: [creerQuestionVide(1), creerQuestionVide(2)],
})

function creerNiveauxVides() {
  return Object.fromEntries(PALIERS.map((niveau) => [
    niveau.palier,
    {
      palier: niveau.palier,
      libelle: niveau.libelle,
      titre: niveau.titre,
      exercises: [1, 2, 3].map(creerExerciceVide),
    },
  ]))
}

function creerPacksDeBaseVides() {
  return Object.fromEntries(PALIERS.map((niveau) => [niveau.palier, {
    palier: niveau.palier,
    id: null,
    version: 0,
  }]))
}

function messageErreur(error) {
  const message = error?.message ?? String(error ?? '')
  const traductions = [
    ['admin_required', 'Cette publication est réservée aux administrateurs.'],
    ['trois_niveaux_requis', 'Les trois niveaux Facile, Moyen et Difficile sont obligatoires.'],
    ['exercice_requis', 'Chaque niveau doit contenir au moins un exercice.'],
    ['deux_questions_minimum', 'Chaque exercice doit contenir au moins deux questions.'],
    ['question_ou_correction_invalide', 'Chaque question doit avoir un énoncé et une correction complète.'],
    ['contenu_trop_volumineux', 'Le contenu dépasse la taille autorisée.'],
    ['contenu_modifie_ailleurs', 'Ce contenu a été modifié dans un autre onglet ou par un autre administrateur. Recharge la version publiée avant de recommencer.'],
    ['note_modification_requise', 'Ajoute une courte note expliquant la modification.'],
    ['note_modification_trop_longue', 'La note de modification ne doit pas dépasser 1 000 caractères.'],
    ['exercice_base_invalide', 'La version de départ d’un exercice a changé. Recharge le contenu publié.'],
    ['pack_immuable_apres_validation', 'Cette version a déjà été utilisée. Recharge la page pour créer une nouvelle publication.'],
  ]
  return traductions.find(([code]) => message.includes(code))?.[1] ?? message
}

function erreursContenu(niveaux) {
  const erreurs = []
  for (const meta of PALIERS) {
    const niveau = niveaux[meta.palier]
    if (!niveau?.titre?.trim()) erreurs.push(`${meta.libelle} : titre du niveau manquant`)
    if (!niveau?.exercises?.length) erreurs.push(`${meta.libelle} : ajoute au moins un exercice`)
    for (const exercice of niveau?.exercises ?? []) {
      const prefixe = `${meta.libelle}, exercice ${exercice.numero}`
      if (!exercice.titre.trim()) erreurs.push(`${prefixe} : titre manquant`)
      if (!exercice.consigne.trim()) erreurs.push(`${prefixe} : consigne manquante`)
      if (exercice.questions.length < 2) erreurs.push(`${prefixe} : deux questions minimum`)
      if (exercice.questions.length > 12) erreurs.push(`${prefixe} : douze questions maximum`)
      for (const question of exercice.questions) {
        if (!question.enonce_md.trim()) erreurs.push(`${prefixe}, question ${question.ordre} : énoncé manquant`)
        if (!question.correction_md.trim()) erreurs.push(`${prefixe}, question ${question.ordre} : correction manquante`)
        if (question.image_url.trim() && !/^https:\/\//i.test(question.image_url.trim())) erreurs.push(`${prefixe}, question ${question.ordre} : l’image doit utiliser une URL HTTPS`)
        if (question.image_url.trim() && !question.image_alt.trim()) erreurs.push(`${prefixe}, question ${question.ordre} : ajoute une description de l’image`)
      }
    }
  }
  return erreurs
}

function convertirPacks(data) {
  const niveaux = creerNiveauxVides()
  for (const pack of data ?? []) {
    if (!niveaux[pack.palier]) continue
    const exercices = [...(pack.exercices_entrainement ?? [])]
      .sort((a, b) => a.numero - b.numero)
      .map((exercice) => ({
        base_exercice_id: exercice.id,
        numero: exercice.numero,
        titre: exercice.titre ?? '',
        consigne: exercice.consigne ?? '',
        questions: [...(exercice.questions_exercice ?? [])]
          .sort((a, b) => a.ordre - b.ordre)
          .map((question) => ({
            ordre: question.ordre,
            enonce_md: question.enonce_md ?? '',
            correction_md: question.correction_md ?? '',
            image_url: question.image_url ?? '',
            image_alt: question.image_alt ?? '',
          })),
      }))

    niveaux[pack.palier] = {
      ...niveaux[pack.palier],
      titre: pack.titre,
      exercises: exercices.length > 0 ? exercices : niveaux[pack.palier].exercises,
    }
  }
  return niveaux
}

function convertirPacksDeBase(data) {
  const packs = creerPacksDeBaseVides()
  for (const pack of data ?? []) {
    if (!packs[pack.palier]) continue
    packs[pack.palier] = {
      palier: pack.palier,
      id: pack.id,
      version: pack.version,
      content_hash: pack.content_hash,
    }
  }
  return packs
}

function clonerNiveaux(niveaux) {
  return JSON.parse(JSON.stringify(niveaux))
}

function contenuComparable(niveau) {
  return {
    titre: niveau?.titre ?? '',
    exercises: (niveau?.exercises ?? []).map((exercice, exerciceIndex) => ({
      numero: exerciceIndex + 1,
      titre: exercice.titre,
      consigne: exercice.consigne,
      questions: exercice.questions.map((question, questionIndex) => ({
        ordre: questionIndex + 1,
        enonce_md: question.enonce_md,
        correction_md: question.correction_md,
        image_url: question.image_url || '',
        image_alt: question.image_alt || '',
      })),
    })),
  }
}

export default function ExercicesGuides() {
  const { chapitreId: chapitreRouteId } = useParams()
  const [niveauxRef, setNiveauxRef] = useState([])
  const [series, setSeries] = useState([])
  const [matieres, setMatieres] = useState([])
  const [chapitres, setChapitres] = useState([])
  const [niveauId, setNiveauId] = useState('')
  const [serieId, setSerieId] = useState('')
  const [matiereId, setMatiereId] = useState('')
  const [chapitreId, setChapitreId] = useState('')
  const [chapitreDirect, setChapitreDirect] = useState(null)
  const [niveaux, setNiveaux] = useState(creerNiveauxVides)
  const [niveauxCharges, setNiveauxCharges] = useState(creerNiveauxVides)
  const [packsDeBase, setPacksDeBase] = useState(creerPacksDeBaseVides)
  const [palierActif, setPalierActif] = useState('entrainement')
  const [loading, setLoading] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [loadNonce, setLoadNonce] = useState(0)
  const [publishing, setPublishing] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [relu, setRelu] = useState(false)
  const [publicationId, setPublicationId] = useState(() => crypto.randomUUID())
  const [noteModification, setNoteModification] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const succesApresRechargeRef = useRef('')

  const selectedChapitreId = chapitreRouteId || chapitreId
  const erreurs = useMemo(() => erreursContenu(niveaux), [niveaux])
  const totalExercices = useMemo(
    () => PALIERS.reduce((total, meta) => total + (niveaux[meta.palier]?.exercises.length ?? 0), 0),
    [niveaux],
  )
  const paliersModifies = useMemo(
    () => PALIERS.filter((meta) => (
      JSON.stringify(contenuComparable(niveaux[meta.palier]))
      !== JSON.stringify(contenuComparable(niveauxCharges[meta.palier]))
    )),
    [niveaux, niveauxCharges],
  )

  useEffect(() => {
    Promise.all([
      supabase.from('niveaux').select('*').order('ordre'),
      supabase.from('matieres').select('*').order('ordre'),
    ]).then(([niveauxResult, matieresResult]) => {
      setNiveauxRef(niveauxResult.data ?? [])
      setMatieres(matieresResult.data ?? [])
    })
  }, [])

  useEffect(() => {
    if (chapitreRouteId) {
      supabase
        .from('chapitres')
        .select('id, titre, ordre, matieres(nom, icone), series(nom, niveaux(nom))')
        .eq('id', chapitreRouteId)
        .single()
        .then(({ data }) => setChapitreDirect(data))
    }
  }, [chapitreRouteId])

  useEffect(() => {
    if (chapitreRouteId || !niveauId) { setSeries([]); return }
    supabase.from('series').select('*').eq('niveau_id', niveauId).order('nom').then(({ data }) => setSeries(data ?? []))
  }, [chapitreRouteId, niveauId])

  useEffect(() => {
    if (chapitreRouteId || !serieId || !matiereId) { setChapitres([]); return }
    supabase
      .from('chapitres')
      .select('id, titre, ordre')
      .eq('serie_id', serieId)
      .eq('matiere_id', matiereId)
      .order('ordre')
      .then(({ data }) => setChapitres(data ?? []))
  }, [chapitreRouteId, serieId, matiereId])

  useEffect(() => {
    if (!selectedChapitreId) {
      const niveauxVides = creerNiveauxVides()
      setNiveaux(niveauxVides)
      setNiveauxCharges(clonerNiveaux(niveauxVides))
      setPacksDeBase(creerPacksDeBaseVides())
      setNoteModification('')
      return
    }

    let cancelled = false
    async function charger() {
      setLoading(true)
      setLoadFailed(false)
      setErreur('')
      setSucces('')
      setNiveaux(creerNiveauxVides())
      const { data, error } = await supabase
        .from('packs_entrainement')
        .select(`
          id, palier, titre, version, content_hash, source_id, source_locator, published,
          exercices_entrainement (
            id, numero, titre, consigne, progress_hash,
            questions_exercice (ordre, enonce_md, correction_md, image_url, image_alt)
          )
        `)
        .eq('chapitre_id', selectedChapitreId)
        .eq('published', true)

      if (cancelled) return
      if (error) {
        setErreur(messageErreur(error))
        setLoadFailed(true)
        setLoading(false)
        return
      }
      const niveauxPublies = convertirPacks(data)
      setNiveaux(niveauxPublies)
      setNiveauxCharges(clonerNiveaux(niveauxPublies))
      setPacksDeBase(convertirPacksDeBase(data))
      setPublicationId(crypto.randomUUID())
      setNoteModification('')
      setDirty(false)
      setRelu(false)
      if (succesApresRechargeRef.current) {
        setSucces(succesApresRechargeRef.current)
        succesApresRechargeRef.current = ''
      }
      setLoading(false)
    }
    charger()
    return () => { cancelled = true }
  }, [selectedChapitreId, loadNonce])

  useEffect(() => {
    if (!dirty) return undefined
    const prevenir = (event) => { event.preventDefault(); event.returnValue = '' }
    const protegerLiens = (event) => {
      const lien = event.target.closest?.('a[href]')
      if (!lien) return
      if (!confirm('Des modifications d’exercices ne sont pas enregistrées. Quitter quand même ?')) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    window.addEventListener('beforeunload', prevenir)
    document.addEventListener('click', protegerLiens, true)
    return () => {
      window.removeEventListener('beforeunload', prevenir)
      document.removeEventListener('click', protegerLiens, true)
    }
  }, [dirty])

  function modifierNiveau(palier, transformation) {
    setNiveaux((actuels) => ({ ...actuels, [palier]: transformation(actuels[palier]) }))
    setDirty(true)
    setRelu(false)
    setSucces('')
  }

  function changerFiltres(changement) {
    if (dirty && !confirm('Abandonner les modifications non publiées ?')) return
    changement()
  }

  function modifierExercice(palier, index, patch) {
    modifierNiveau(palier, (niveau) => ({
      ...niveau,
      exercises: niveau.exercises.map((exercice, i) => (i === index ? { ...exercice, ...patch } : exercice)),
    }))
  }

  function modifierQuestion(palier, exerciceIndex, questionIndex, patch) {
    modifierNiveau(palier, (niveau) => ({
      ...niveau,
      exercises: niveau.exercises.map((exercice, i) => i !== exerciceIndex ? exercice : ({
        ...exercice,
        questions: exercice.questions.map((question, q) => q === questionIndex ? { ...question, ...patch } : question),
      })),
    }))
  }

  function ajouterQuestion(palier, exerciceIndex) {
    const exercice = niveaux[palier].exercises[exerciceIndex]
    modifierExercice(palier, exerciceIndex, {
      questions: [...exercice.questions, creerQuestionVide(exercice.questions.length + 1)],
    })
  }

  function ajouterExercice(palier) {
    modifierNiveau(palier, (niveau) => ({
      ...niveau,
      exercises: [...niveau.exercises, creerExerciceVide(niveau.exercises.length + 1)],
    }))
  }

  function retirerExercice(palier, exerciceIndex) {
    const niveau = niveaux[palier]
    if (niveau.exercises.length <= 1) return
    if (!confirm(`Retirer l’exercice ${exerciceIndex + 1} de ce niveau ?`)) return
    modifierNiveau(palier, (actuel) => ({
      ...actuel,
      exercises: actuel.exercises
        .filter((_, index) => index !== exerciceIndex)
        .map((exercice, index) => ({ ...exercice, numero: index + 1 })),
    }))
  }

  function retirerQuestion(palier, exerciceIndex, questionIndex) {
    const exercice = niveaux[palier].exercises[exerciceIndex]
    if (exercice.questions.length <= 2) return
    modifierExercice(palier, exerciceIndex, {
      questions: exercice.questions
        .filter((_, index) => index !== questionIndex)
        .map((question, index) => ({ ...question, ordre: index + 1 })),
    })
  }

  async function publier() {
    setErreur('')
    setSucces('')
    if (erreurs.length > 0) {
      setErreur(`Publication impossible : ${erreurs[0]}.`)
      return
    }
    if (!relu) {
      setErreur(`Confirme d’abord que les ${totalExercices} exercices et toutes leurs corrections ont été relus.`)
      return
    }
    if (!noteModification.trim()) {
      setErreur('Ajoute une courte note expliquant la modification.')
      return
    }
    if (paliersModifies.length === 0) {
      setErreur('Aucune modification de contenu à enregistrer.')
      return
    }
    if (!confirm(
      `${paliersModifies.length} difficulté(s) seront republiées. `
      + 'Les validations seront conservées exercice par exercice lorsque le titre, la consigne, les énoncés et leurs figures sont restés identiques. Continuer ?',
    )) return

    const levels = PALIERS.map((meta) => {
      const niveau = niveaux[meta.palier]
      const modifie = paliersModifies.some((palier) => palier.palier === meta.palier)
      return {
        palier: meta.palier,
        libelle: meta.libelle,
        titre: modifie ? niveau.titre.trim() : niveau.titre,
        exercises: niveau.exercises.map((exercice) => ({
          base_exercice_id: exercice.base_exercice_id,
          numero: exercice.numero,
          code: `ADMIN-${publicationId}-${meta.palier}-E${exercice.numero}`,
          titre: modifie ? exercice.titre.trim() : exercice.titre,
          consigne: modifie ? normalizeMathMarkdown(exercice.consigne) : exercice.consigne,
          questions: exercice.questions.map((question, index) => ({
            ordre: index + 1,
            enonce_md: modifie ? normalizeMathMarkdown(question.enonce_md) : question.enonce_md,
            correction_md: modifie
              ? normalizeMathMarkdown(question.correction_md, { numberedHeadings: true })
              : question.correction_md,
            image_url: question.image_url.trim() || null,
            image_alt: question.image_alt.trim() || null,
          })),
        })),
      }
    })

    const basePacks = PALIERS.map((meta) => ({
      palier: meta.palier,
      id: packsDeBase[meta.palier]?.id ?? null,
      version: packsDeBase[meta.palier]?.version ?? 0,
      content_hash: packsDeBase[meta.palier]?.content_hash ?? null,
    }))

    setPublishing(true)
    const { data, error } = await supabase.rpc('publier_exercices_admin_v3', {
      p_chapitre_id: selectedChapitreId,
      p_publication_id: publicationId,
      p_base_packs: basePacks,
      p_levels: levels,
      p_note_modification: noteModification.trim(),
    })
    setPublishing(false)

    if (error) {
      setErreur(messageErreur(error))
      return
    }

    const modifies = data?.changed_pack_count ?? paliersModifies.length
    const inchanges = data?.unchanged_pack_count ?? Math.max(3 - modifies, 0)
    const conservees = data?.progressions_conservees ?? 0
    const reinitialisees = data?.progressions_reinitialisees ?? 0
    succesApresRechargeRef.current = `${modifies} difficulté(s) mise(s) à jour, ${inchanges} conservée(s). ${conservees} validation(s) élève conservée(s), ${reinitialisees} réinitialisée(s).`
    setDirty(false)
    setRelu(false)
    setLoadNonce((value) => value + 1)
  }

  const niveauActif = niveaux[palierActif]
  const titreContexte = chapitreDirect
    ? `${chapitreDirect.series?.niveaux?.nom ?? ''} ${chapitreDirect.series?.nom ?? ''} · ${chapitreDirect.matieres?.nom ?? ''} · ${chapitreDirect.titre}`
    : chapitres.find((chapitre) => chapitre.id === chapitreId)?.titre

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="game-eyebrow">Atelier de publication</p>
          <h2 className="mt-1 text-xl font-black">Exercices guidés</h2>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Écris en texte simple, Markdown ou LaTeX : l’aperçu montre exactement le rendu élève.</p>
        </div>
        {chapitreRouteId && <Link to="/admin/contenus"><Button variant="ghost">← Contenus</Button></Link>}
      </div>

      {!chapitreRouteId && (
        <Card className="mb-5">
          <p className="mb-3 text-sm font-bold">1. Choisir la leçon</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <select className="input" value={niveauId} onChange={(event) => changerFiltres(() => { setNiveauId(event.target.value); setSerieId(''); setChapitreId('') })}>
              <option value="">Niveau…</option>
              {niveauxRef.map((niveau) => <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>)}
            </select>
            <select className="input" value={serieId} disabled={!niveauId} onChange={(event) => changerFiltres(() => { setSerieId(event.target.value); setChapitreId('') })}>
              <option value="">Série…</option>
              {series.map((serie) => <option key={serie.id} value={serie.id}>{serie.nom}</option>)}
            </select>
            <select className="input" value={matiereId} onChange={(event) => changerFiltres(() => { setMatiereId(event.target.value); setChapitreId('') })}>
              <option value="">Matière…</option>
              {matieres.map((matiere) => <option key={matiere.id} value={matiere.id}>{matiere.icone} {matiere.nom}</option>)}
            </select>
            <select className="input" value={chapitreId} disabled={!serieId || !matiereId} onChange={(event) => {
              if (dirty && !confirm('Abandonner les modifications non publiées ?')) return
              setChapitreId(event.target.value)
            }}>
              <option value="">Leçon…</option>
              {chapitres.map((chapitre) => <option key={chapitre.id} value={chapitre.id}>#{chapitre.ordre} · {chapitre.titre}</option>)}
            </select>
          </div>
        </Card>
      )}

      {titreContexte && <p className="mb-4 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 px-4 py-3 text-sm font-bold text-[var(--neon-cyan)]">📘 {titreContexte}</p>}

      {selectedChapitreId && !loading && !loadFailed && (
        <Card className="mb-4 py-3">
          <p className="text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">Versions publiées chargées</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {PALIERS.map((meta) => (
              <span key={meta.palier} className="rounded-full border border-[var(--border)] px-3 py-1">
                {meta.libelle} · {packsDeBase[meta.palier]?.id ? `version ${packsDeBase[meta.palier].version}` : 'nouveau contenu'}
              </span>
            ))}
          </div>
        </Card>
      )}

      {!selectedChapitreId ? (
        <Card className="py-8 text-center text-sm text-[var(--text-muted)]">Choisis une leçon pour commencer.</Card>
      ) : loading ? (
        <Loader label="Chargement des exercices…" />
      ) : loadFailed ? (
        <Card className="py-8 text-center">
          <p className="font-bold">Impossible de charger le contenu existant.</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Aucun formulaire vide ne sera publié par erreur.</p>
          <Button className="mt-4" variant="secondary" onClick={() => setLoadNonce((value) => value + 1)}>Réessayer</Button>
        </Card>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-2" role="tablist" aria-label="Difficulté">
            {PALIERS.map((meta) => {
              const niveau = niveaux[meta.palier]
              const complets = niveau.exercises.filter((exercice) => exercice.titre.trim() && exercice.questions.every((question) => question.enonce_md.trim() && question.correction_md.trim())).length
              return (
                <button
                  key={meta.palier}
                  type="button"
                  role="tab"
                  aria-selected={palierActif === meta.palier}
                  onClick={() => setPalierActif(meta.palier)}
                  className={`rounded-2xl border p-3 text-center transition ${palierActif === meta.palier ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]' : 'border-[var(--border)] text-[var(--text-muted)]'}`}
                >
                  <span className="block text-xl">{meta.icon}</span>
                  <span className="block text-xs font-black">{meta.libelle} · {complets}/{niveau.exercises.length}</span>
                  <span className="mt-1 block text-[10px]">{packsDeBase[meta.palier]?.id ? `v${packsDeBase[meta.palier].version}` : 'nouveau'}</span>
                </button>
              )
            })}
          </div>

          <label className="mb-4 flex flex-col gap-1 text-xs font-bold text-[var(--text-muted)]">
            Titre du niveau {PALIERS.find((meta) => meta.palier === palierActif)?.libelle}
            <input className="input" maxLength={160} value={niveauActif.titre} onChange={(event) => modifierNiveau(palierActif, (niveau) => ({ ...niveau, titre: event.target.value }))} />
          </label>

          <div className="flex flex-col gap-4">
            {niveauActif.exercises.map((exercice, exerciceIndex) => (
              <Card key={exercice.numero} className="p-0 overflow-hidden">
                <details open={exerciceIndex === 0}>
                  <summary className="cursor-pointer border-b border-[var(--border)] p-4 font-black">
                    Exercice {exercice.numero} · {exercice.titre || 'Sans titre'}
                  </summary>
                  <div className="flex flex-col gap-4 p-4 sm:p-5">
                    <div className="flex justify-end">
                      <Button type="button" variant="danger" disabled={niveauActif.exercises.length <= 1} onClick={() => retirerExercice(palierActif, exerciceIndex)}>
                        Supprimer cet exercice
                      </Button>
                    </div>
                    <label className="flex flex-col gap-1 text-xs font-bold text-[var(--text-muted)]">
                      Titre de l’exercice
                      <input className="input" maxLength={200} value={exercice.titre} onChange={(event) => modifierExercice(palierActif, exerciceIndex, { titre: event.target.value })} />
                    </label>
                    <ChampMarkdown
                      label="Consigne générale"
                      value={exercice.consigne}
                      rows={3}
                      onChange={(value) => modifierExercice(palierActif, exerciceIndex, { consigne: value })}
                    />

                    {exercice.questions.map((question, questionIndex) => (
                      <section key={questionIndex} className="rounded-2xl border border-[var(--border)] bg-[var(--bg)]/30 p-3 sm:p-4">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <h3 className="font-black">Question {questionIndex + 1}</h3>
                          <Button type="button" variant="danger" disabled={exercice.questions.length <= 2} onClick={() => retirerQuestion(palierActif, exerciceIndex, questionIndex)}>Retirer</Button>
                        </div>
                        <div className="grid gap-4 xl:grid-cols-2">
                          <ChampMarkdown
                            label="Énoncé"
                            value={question.enonce_md}
                            rows={7}
                            onChange={(value) => modifierQuestion(palierActif, exerciceIndex, questionIndex, { enonce_md: value })}
                          />
                          <ChampMarkdown
                            label="Correction complète"
                            value={question.correction_md}
                            rows={7}
                            numberedHeadings
                            onChange={(value) => modifierQuestion(palierActif, exerciceIndex, questionIndex, { correction_md: value })}
                          />
                        </div>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          <input className="input" placeholder="URL de l’image (optionnel)" value={question.image_url} onChange={(event) => modifierQuestion(palierActif, exerciceIndex, questionIndex, { image_url: event.target.value })} />
                          <input className="input" placeholder="Description de l’image" value={question.image_alt} onChange={(event) => modifierQuestion(palierActif, exerciceIndex, questionIndex, { image_alt: event.target.value })} />
                        </div>
                      </section>
                    ))}

                    <Button type="button" variant="ghost" disabled={exercice.questions.length >= 12} onClick={() => ajouterQuestion(palierActif, exerciceIndex)}>+ Ajouter une question</Button>
                  </div>
                </details>
              </Card>
            ))}
            <Button type="button" variant="secondary" onClick={() => ajouterExercice(palierActif)}>
              + Ajouter un exercice {PALIERS.find((meta) => meta.palier === palierActif)?.libelle.toLowerCase()}
            </Button>
          </div>

          <Card className="relative z-10 mt-6 border-[var(--neon-magenta)]/35 bg-[var(--bg)]/95 backdrop-blur lg:sticky lg:bottom-3 lg:z-20">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-black">{erreurs.length === 0 ? `✓ Les ${totalExercices} exercices sont complets` : `${erreurs.length} élément(s) à compléter`}</p>
                {erreurs[0] && <p className="mt-1 text-xs text-[var(--neon-magenta)]">{erreurs[0]}</p>}
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {paliersModifies.length > 0
                    ? `${paliersModifies.length} difficulté(s) modifiée(s) : ${paliersModifies.map((meta) => meta.libelle).join(', ')}.`
                    : 'Aucune différence avec les versions chargées.'}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Seules les difficultés modifiées recevront une nouvelle version. Une correction seule conserve la progression si le titre, la consigne, les énoncés et leurs figures ne changent pas.</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex flex-col gap-1 text-xs font-bold text-[var(--text-muted)]">
                  Note de modification
                  <textarea
                    className="input min-h-20 w-full lg:min-w-80"
                    maxLength={1000}
                    value={noteModification}
                    onChange={(event) => setNoteModification(event.target.value)}
                    placeholder="Ex. Correction précisée après le commentaire d’un élève."
                  />
                </label>
                <label className="flex items-start gap-2 text-xs">
                  <input type="checkbox" checked={relu} onChange={(event) => setRelu(event.target.checked)} />
                  J’ai relu les {totalExercices} exercices et toutes les corrections.
                </label>
                <Button onClick={publier} disabled={publishing || erreurs.length > 0 || !relu || !noteModification.trim() || paliersModifies.length === 0}>
                  {publishing ? 'Enregistrement…' : 'Enregistrer les modifications'}
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}

      {erreur && <Card className="mt-4 border-[var(--neon-magenta)]/45 text-sm text-[var(--neon-magenta)]" role="alert">{erreur}</Card>}
      {succes && <Card className="mt-4 border-[var(--neon-green)]/45 text-sm text-[var(--neon-green)]" role="status">✓ {succes}</Card>}
    </div>
  )
}

function ChampMarkdown({ label, value, onChange, rows = 6, numberedHeadings = false }) {
  const preview = useDeferredValue(value)
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="text-xs font-bold text-[var(--text-muted)]">{label}</label>
        <button
          type="button"
          className="text-[10px] font-bold text-[var(--neon-cyan)] hover:underline"
          onClick={() => onChange(normalizeMathMarkdown(value, { numberedHeadings }))}
        >
          Mettre en forme
        </button>
      </div>
      <textarea
        className="input w-full font-mono text-sm"
        rows={rows}
        maxLength={30000}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Colle ici ton texte, par exemple \\(x+2\\) ou \\[\\frac{1}{x}\\]"
      />
      <div className="mt-2 min-h-24 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)]/45 p-3">
        <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-[var(--text-muted)]">Aperçu élève</p>
        {preview.trim() ? (
          <MathMarkdown numberedHeadings={numberedHeadings}>{preview}</MathMarkdown>
        ) : (
          <p className="text-xs italic text-[var(--text-muted)]">Le rendu mathématique apparaîtra ici.</p>
        )}
      </div>
    </div>
  )
}
