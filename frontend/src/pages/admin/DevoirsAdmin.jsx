import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { normalizeMathMarkdown } from '../../lib/mathMarkdown'
import MathMarkdown from '../../components/content/MathMarkdown'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'

const STATUTS = [
  ['publie', 'Publiés'],
  ['brouillon', 'Brouillons'],
  ['archive', 'Archivés'],
]

const ERREURS = {
  admin_required: "Cette page est réservée à l'administration.",
  brouillon_introuvable: 'Ce brouillon est introuvable ou a déjà été publié.',
  version_devoir_immuable: 'Une version publiée ou déjà jouée ne peut plus être modifiée.',
  questions_devoir_immuables: 'Les questions de cette version sont désormais immuables.',
  question_requise: 'Ajoute au moins une question avant de continuer.',
  titre_requis: 'Le titre du devoir est obligatoire.',
  numero_invalide: 'Le numéro du devoir doit être un entier positif.',
  duree_invalide: 'La durée doit être un nombre de secondes positif.',
  points_invalides: 'Chaque question doit avoir un nombre de points positif.',
  numerotation_questions_invalide: 'La numérotation des questions doit être continue.',
  enonce_requis: 'Chaque question doit contenir un énoncé.',
  correction_requise: 'Chaque question doit contenir une correction complète.',
  qcm_choix_invalides: 'Chaque QCM doit proposer au moins deux choix remplis.',
  qcm_choix_dupliques: 'Les choix d’un QCM doivent être différents.',
  qcm_reponse_invalide: 'Sélectionne la bonne réponse de chaque QCM.',
  reponse_texte_requise: 'Ajoute au moins une réponse acceptée pour chaque question libre.',
  image_https_requise: 'Les images doivent utiliser une adresse HTTPS.',
  image_alt_requis: 'Ajoute une description accessible pour chaque image.',
  contenu_trop_volumineux: 'Le brouillon est trop volumineux pour une seule sauvegarde.',
  matiere_serie_invalide: 'Cette matière n’est pas disponible pour la série sélectionnée.',
  devoir_revision_conflit: 'Ce brouillon a changé dans un autre onglet. Recharge-le avant de poursuivre pour ne pas écraser ces modifications.',
}

const statutStyle = {
  publie: 'border-[var(--neon-green)]/50 text-[var(--neon-green)]',
  brouillon: 'border-[var(--neon-cyan)]/50 text-[var(--neon-cyan)]',
  archive: 'border-[var(--border)] text-[var(--text-muted)]',
}

function idLocal() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

function questionVide(numero = 1) {
  return {
    _key: idLocal(),
    base_question_id: null,
    ordre: numero,
    type: 'qcm',
    enonce: '',
    choix: ['', '', '', ''],
    correcte: 0,
    reponses_texte: '',
    points: 1,
    explication: '',
    image_url: '',
    image_alt: '',
  }
}

function erreurLisible(error) {
  const message = error?.message ?? String(error ?? '')
  const cle = Object.keys(ERREURS).find((item) => message.includes(item))
  return ERREURS[cle] ?? message ?? 'Une erreur inattendue est survenue.'
}

function depuisServeur(question) {
  const choix = Array.isArray(question.choix) && question.choix.length
    ? question.choix.map(String)
    : ['', '', '', '']
  const bonne = typeof question.bonnes_reponses === 'string'
    ? question.bonnes_reponses
    : ''

  return {
    _key: question.id ?? idLocal(),
    base_question_id: question.id ?? null,
    ordre: Number(question.ordre) || 1,
    type: question.type === 'texte' ? 'texte' : 'qcm',
    enonce: question.enonce ?? '',
    choix,
    correcte: Math.max(0, choix.indexOf(bonne)),
    reponses_texte: Array.isArray(question.bonnes_reponses)
      ? question.bonnes_reponses.join('\n')
      : '',
    points: Number(question.points) || 1,
    explication: question.explication ?? '',
    image_url: question.image_url ?? '',
    image_alt: question.image_alt ?? '',
  }
}

export default function DevoirsAdmin() {
  const { devoirId } = useParams()
  const [niveaux, setNiveaux] = useState([])
  const [series, setSeries] = useState([])
  const [matieres, setMatieres] = useState([])
  const [niveauId, setNiveauId] = useState('')
  const [serieId, setSerieId] = useState('')
  const [matiereId, setMatiereId] = useState('')
  const [onglet, setOnglet] = useState('publie')
  const [recherche, setRecherche] = useState('')

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingEditor, setLoadingEditor] = useState(false)
  const [busy, setBusy] = useState(false)
  const [erreur, setErreur] = useState('')
  const [message, setMessage] = useState('')

  const [selection, setSelection] = useState(null)
  const [meta, setMeta] = useState({ titre: '', numero: 1, duree_sec: 2700 })
  const [questions, setQuestions] = useState([])
  const [versions, setVersions] = useState([])
  const [dirty, setDirty] = useState(false)
  const [creation, setCreation] = useState({ titre: '', numero: 1, duree_sec: 2700 })
  const publicationIdRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      supabase.from('niveaux').select('*').order('ordre'),
      supabase.from('series').select('*').order('nom'),
      supabase.from('matieres').select('*').order('ordre'),
    ]).then(([niveauxRes, seriesRes, matieresRes]) => {
      if (cancelled) return
      setNiveaux(niveauxRes.data ?? [])
      setSeries(seriesRes.data ?? [])
      setMatieres(matieresRes.data ?? [])
    })
    return () => { cancelled = true }
  }, [])

  const chargerListe = useCallback(async () => {
    setLoading(true)
    setErreur('')
    const { data, error } = await supabase.rpc('lister_devoirs_admin_v1', {
      p_niveau_id: niveauId || null,
      p_serie_id: serieId || null,
      p_matiere_id: matiereId || null,
    })
    if (error) setErreur(erreurLisible(error))
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [niveauId, serieId, matiereId])

  useEffect(() => { chargerListe() }, [chargerListe])

  const seriesFiltrees = useMemo(
    () => series.filter((serie) => !niveauId || serie.niveau_id === niveauId),
    [series, niveauId],
  )

  const itemsVisibles = useMemo(() => {
    const terme = recherche.trim().toLocaleLowerCase('fr')
    return items.filter((item) => (
      item.statut === onglet
      && (!terme || `${item.titre} ${item.matiere_nom} ${item.serie_nom}`.toLocaleLowerCase('fr').includes(terme))
    ))
  }, [items, onglet, recherche])

  const compteurs = useMemo(() => Object.fromEntries(
    STATUTS.map(([statut]) => [statut, items.filter((item) => item.statut === statut).length]),
  ), [items])

  const editable = selection?.version?.statut === 'brouillon'

  const appliquerDonnees = useCallback((data) => {
    setSelection({ devoir: data.devoir, version: data.version })
    setMeta({
      titre: data.version.titre ?? '',
      numero: Number(data.version.numero ?? data.devoir.numero) || 1,
      duree_sec: Number(data.version.duree_sec) || 2700,
    })
    setQuestions((data.questions ?? []).map(depuisServeur))
    setVersions(data.versions ?? [])
    setDirty(false)
    publicationIdRef.current = null
  }, [])

  useEffect(() => {
    if (!dirty) return undefined
    const protegerSortie = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    const protegerLiens = (event) => {
      const lien = event.target.closest?.('a[href]')
      if (!lien) return
      if (!confirm('Ce brouillon contient des modifications non enregistrées. Quitter quand même ?')) {
        event.preventDefault()
        event.stopPropagation()
      }
    }
    window.addEventListener('beforeunload', protegerSortie)
    document.addEventListener('click', protegerLiens, true)
    return () => {
      window.removeEventListener('beforeunload', protegerSortie)
      document.removeEventListener('click', protegerLiens, true)
    }
  }, [dirty])

  useEffect(() => {
    if (!devoirId || selection?.devoir?.id === devoirId) return
    let cancelled = false
    async function ouvrirLienDirect() {
      if (dirty && !confirm('Ce brouillon contient des modifications non enregistrées. Les abandonner ?')) return
      setLoadingEditor(true)
      const { data, error } = await supabase.rpc('charger_devoir_admin_v1', {
        p_devoir_id: devoirId,
        p_quiz_id: null,
      })
      if (cancelled) return
      if (error) setErreur(erreurLisible(error))
      else appliquerDonnees(data)
      setLoadingEditor(false)
    }
    ouvrirLienDirect()
    return () => { cancelled = true }
  }, [devoirId, selection?.devoir?.id, dirty, appliquerDonnees])

  function marquerSale() {
    setDirty(true)
    publicationIdRef.current = null
  }

  async function ouvrir(item) {
    if (selection?.version?.id === item.quiz_id) return
    if (dirty && !confirm('Ce brouillon contient des modifications non enregistrées. Les abandonner ?')) return
    setLoadingEditor(true)
    setErreur('')
    setMessage('')
    const { data, error } = await supabase.rpc('charger_devoir_admin_v1', {
      p_devoir_id: item.devoir_id,
      p_quiz_id: item.quiz_id,
    })
    if (error) setErreur(erreurLisible(error))
    else appliquerDonnees(data)
    setLoadingEditor(false)
  }

  async function preparerModification() {
    if (!selection?.devoir?.id) return
    setBusy(true)
    setErreur('')
    const { data, error } = await supabase.rpc('preparer_brouillon_devoir_admin_v1', {
      p_devoir_id: selection.devoir.id,
      p_matiere_id: null,
      p_serie_id: null,
      p_numero: null,
      p_titre: null,
      p_duree_sec: null,
    })
    if (error) setErreur(erreurLisible(error))
    else {
      appliquerDonnees(data)
      setOnglet('brouillon')
      setMessage('Brouillon créé. La version publiée reste intacte jusqu’à la prochaine publication.')
      await chargerListe()
    }
    setBusy(false)
  }

  async function creerDevoir(event) {
    event.preventDefault()
    if (dirty && !confirm('Ce brouillon contient des modifications non enregistrées. Les abandonner pour créer un autre devoir ?')) return
    if (!serieId || !matiereId) {
      setErreur('Choisis un niveau, une série et une matière avant de créer un devoir.')
      return
    }
    setBusy(true)
    setErreur('')
    setMessage('')
    const { data, error } = await supabase.rpc('preparer_brouillon_devoir_admin_v1', {
      p_devoir_id: null,
      p_matiere_id: matiereId,
      p_serie_id: serieId,
      p_numero: Number(creation.numero),
      p_titre: creation.titre,
      p_duree_sec: Number(creation.duree_sec),
    })
    if (error) setErreur(erreurLisible(error))
    else {
      appliquerDonnees(data)
      setQuestions([questionVide(1)])
      setDirty(true)
      setCreation((value) => ({ ...value, titre: '', numero: Number(value.numero) + 1 }))
      setOnglet('brouillon')
      setMessage('Nouveau brouillon créé. Ajoute son contenu puis enregistre-le.')
      await chargerListe()
    }
    setBusy(false)
  }

  function modifierQuestion(index, patch) {
    setQuestions((liste) => liste.map((question, i) => (
      i === index ? { ...question, ...patch } : question
    )))
    marquerSale()
  }

  function ajouterQuestion() {
    setQuestions((liste) => [...liste, questionVide(liste.length + 1)])
    marquerSale()
  }

  function supprimerQuestion(index) {
    if (questions.length <= 1) {
      setErreur('Un devoir doit conserver au moins une question.')
      return
    }
    if (!confirm(`Supprimer la question ${index + 1} du brouillon ?`)) return
    setQuestions((liste) => liste
      .filter((_, i) => i !== index)
      .map((question, i) => ({ ...question, ordre: i + 1 })))
    marquerSale()
  }

  function deplacerQuestion(index, direction) {
    const cible = index + direction
    if (cible < 0 || cible >= questions.length) return
    setQuestions((liste) => {
      const copie = [...liste]
      ;[copie[index], copie[cible]] = [copie[cible], copie[index]]
      return copie.map((question, i) => ({ ...question, ordre: i + 1 }))
    })
    marquerSale()
  }

  function construirePayload() {
    if (!meta.titre.trim()) throw new Error('titre_requis')
    if (!Number.isInteger(Number(meta.numero)) || Number(meta.numero) <= 0) throw new Error('numero_invalide')
    if (!Number.isInteger(Number(meta.duree_sec)) || Number(meta.duree_sec) <= 0) throw new Error('duree_invalide')
    if (!questions.length) throw new Error('question_requise')

    return {
      titre: meta.titre.trim(),
      numero: Number(meta.numero),
      duree_sec: Number(meta.duree_sec),
      questions: questions.map((question, index) => {
        const enonce = normalizeMathMarkdown(question.enonce)
        const explication = normalizeMathMarkdown(question.explication, { numberedHeadings: true })
        if (!enonce) throw new Error('enonce_requis')
        if (!explication) throw new Error('correction_requise')
        if (!Number.isInteger(Number(question.points)) || Number(question.points) <= 0) throw new Error('points_invalides')
        const imageUrl = question.image_url.trim()
        const imageAlt = question.image_alt.trim()
        if (imageUrl && !/^https:\/\/\S+$/i.test(imageUrl)) throw new Error('image_https_requise')
        if (imageUrl && !imageAlt) throw new Error('image_alt_requis')

        if (question.type === 'qcm') {
          const choix = question.choix.map((item) => item.trim()).filter(Boolean)
          if (choix.length < 2) throw new Error('qcm_choix_invalides')
          if (new Set(choix).size !== choix.length) throw new Error('qcm_choix_dupliques')
          const bonne = question.choix[question.correcte]?.trim()
          if (!bonne || !choix.includes(bonne)) throw new Error('qcm_reponse_invalide')
          return {
            base_question_id: question.base_question_id,
            ordre: index + 1,
            type: 'qcm',
            enonce,
            choix,
            bonnes_reponses: bonne,
            points: Number(question.points),
            explication,
            image_url: imageUrl || null,
            image_alt: imageAlt || null,
          }
        }

        const reponses = question.reponses_texte.split('\n').map((item) => item.trim()).filter(Boolean)
        if (!reponses.length) throw new Error('reponse_texte_requise')
        return {
          base_question_id: question.base_question_id,
          ordre: index + 1,
          type: 'texte',
          enonce,
          choix: null,
          bonnes_reponses: reponses,
          points: Number(question.points),
          explication,
          image_url: imageUrl || null,
          image_alt: imageAlt || null,
        }
      }),
    }
  }

  async function sauvegarder({ silencieux = false } = {}) {
    if (!editable) return null
    let payload
    try {
      payload = construirePayload()
    } catch (error) {
      setErreur(erreurLisible(error))
      return null
    }

    setBusy(true)
    setErreur('')
    if (!silencieux) setMessage('')
    const { data, error } = await supabase.rpc('enregistrer_brouillon_devoir_admin_v1', {
      p_devoir_id: selection.devoir.id,
      p_quiz_id: selection.version.id,
      p_payload: payload,
      p_revision_attendue: selection.version.revision_editoriale ?? 0,
    })
    if (error) {
      setErreur(erreurLisible(error))
      setBusy(false)
      return null
    }
    appliquerDonnees(data)
    if (!silencieux) setMessage('Brouillon enregistré. La version actuellement publiée n’a pas été modifiée.')
    await chargerListe()
    setBusy(false)
    return data
  }

  async function publier() {
    if (!editable) return
    let sauvegarde
    if (publicationIdRef.current) {
      // Une publication dont la reponse reseau a ete perdue est rejouee avec
      // le meme identifiant, sans tenter de resauvegarder la version devenue
      // publiee cote serveur.
      sauvegarde = { devoir: selection.devoir, version: selection.version }
    } else {
      sauvegarde = await sauvegarder({ silencieux: true })
      if (!sauvegarde) return
    }
    if (!confirm(`Publier la version ${sauvegarde.version.version} de « ${sauvegarde.version.titre} » ?`)) return

    setBusy(true)
    setErreur('')
    const publicationId = publicationIdRef.current ?? idLocal()
    publicationIdRef.current = publicationId
    const { data, error } = await supabase.rpc('publier_devoir_admin_v1', {
      p_devoir_id: sauvegarde.devoir.id,
      p_quiz_id: sauvegarde.version.id,
      p_publication_id: publicationId,
      p_revision_attendue: sauvegarde.version.revision_editoriale ?? 0,
    })
    if (error) setErreur(erreurLisible(error))
    else {
      appliquerDonnees(data)
      publicationIdRef.current = null
      setOnglet('publie')
      setMessage(`Version ${data.version.version} publiée. Les anciennes tentatives restent consultables.`)
      await chargerListe()
    }
    setBusy(false)
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="game-eyebrow">Atelier éditorial</p>
        <h2 className="mt-1 text-2xl font-black">📝 Devoirs versionnés</h2>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Modifie un brouillon puis publie-le quand il est prêt. Une version déjà jouée reste figée afin de préserver les notes et corrections des élèves.
        </p>
      </header>

      <Card>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select
            className="input"
            value={niveauId}
            onChange={(event) => { setNiveauId(event.target.value); setSerieId('') }}
          >
            <option value="">Tous les niveaux</option>
            {niveaux.map((niveau) => <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>)}
          </select>
          <select className="input" value={serieId} onChange={(event) => setSerieId(event.target.value)}>
            <option value="">Toutes les séries</option>
            {seriesFiltrees.map((serie) => <option key={serie.id} value={serie.id}>{serie.nom}</option>)}
          </select>
          <select className="input" value={matiereId} onChange={(event) => setMatiereId(event.target.value)}>
            <option value="">Toutes les matières</option>
            {matieres.map((matiere) => <option key={matiere.id} value={matiere.id}>{matiere.icone} {matiere.nom}</option>)}
          </select>
          <input
            className="input"
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
            placeholder="Rechercher un devoir…"
          />
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {STATUTS.map(([statut, label]) => (
          <button
            key={statut}
            type="button"
            onClick={() => setOnglet(statut)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              onglet === statut
                ? statutStyle[statut]
                : 'border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            {label} · {compteurs[statut] ?? 0}
          </button>
        ))}
      </div>

      {erreur && <div className="rounded-xl border border-[var(--neon-magenta)]/50 bg-[var(--neon-magenta)]/10 p-3 text-sm text-[var(--neon-magenta)]">{erreur}</div>}
      {message && <div className="rounded-xl border border-[var(--neon-green)]/50 bg-[var(--neon-green)]/10 p-3 text-sm text-[var(--neon-green)]">{message}</div>}

      <section className="grid gap-5 lg:grid-cols-[minmax(16rem,0.8fr)_minmax(0,2fr)]">
        <div className="space-y-3">
          {loading ? <Loader /> : itemsVisibles.map((item) => (
            <button key={item.quiz_id} type="button" onClick={() => ouvrir(item)} className="block w-full text-left">
              <Card
                variant="interactive"
                className={selection?.version?.id === item.quiz_id ? 'border-[var(--neon-cyan)]' : ''}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-bold">#{item.numero} · {item.titre}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">{item.matiere_icone} {item.matiere_nom} · {item.serie_nom}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase ${statutStyle[item.statut]}`}>
                    v{item.version}
                  </span>
                </div>
                <p className="mt-3 text-xs text-[var(--text-muted)]">
                  {item.questions_count} question(s) · {Math.round((item.duree_sec ?? 0) / 60)} min · {item.tentatives_count} tentative(s)
                </p>
              </Card>
            </button>
          ))}
          {!loading && itemsVisibles.length === 0 && (
            <Card><p className="text-sm text-[var(--text-muted)]">Aucune version dans cette catégorie.</p></Card>
          )}

          <Card>
            <h3 className="mb-3 text-sm font-black">Créer un devoir</h3>
            <form className="space-y-3" onSubmit={creerDevoir}>
              <input
                className="input w-full"
                placeholder="Titre du devoir"
                value={creation.titre}
                onChange={(event) => setCreation((value) => ({ ...value, titre: event.target.value }))}
              />
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-[var(--text-muted)]">N°
                  <input type="number" min="1" className="input mt-1 w-full" value={creation.numero} onChange={(event) => setCreation((value) => ({ ...value, numero: event.target.value }))} />
                </label>
                <label className="text-xs text-[var(--text-muted)]">Durée (s)
                  <input type="number" min="1" className="input mt-1 w-full" value={creation.duree_sec} onChange={(event) => setCreation((value) => ({ ...value, duree_sec: event.target.value }))} />
                </label>
              </div>
              <Button type="submit" disabled={busy || !serieId || !matiereId || !creation.titre.trim()} className="w-full">+ Créer le brouillon</Button>
            </form>
          </Card>
        </div>

        <div className="min-w-0">
          {loadingEditor ? <Loader /> : !selection ? (
            <Card className="grid min-h-56 place-items-center text-center">
              <div>
                <p className="text-3xl">📝</p>
                <p className="mt-2 font-bold">Choisis un devoir</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">Son contenu et son historique apparaîtront ici.</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase ${statutStyle[selection.version.statut]}`}>
                      {selection.version.statut} · version {selection.version.version}
                    </span>
                    {dirty && <span className="ml-2 text-xs font-bold text-[var(--neon-magenta)]">● Non enregistré</span>}
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      {selection.devoir.niveau_nom} · {selection.devoir.serie_nom} · {selection.devoir.matiere_nom}
                    </p>
                  </div>
                  {!editable && ['publie', 'archive'].includes(selection.version.statut) && (
                    <Button type="button" onClick={preparerModification} disabled={busy}>Modifier dans un brouillon</Button>
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_7rem_9rem]">
                  <label className="text-xs text-[var(--text-muted)]">Titre
                    <input className="input mt-1 w-full" value={meta.titre} disabled={!editable} onChange={(event) => { setMeta((value) => ({ ...value, titre: event.target.value })); marquerSale() }} />
                  </label>
                  <label className="text-xs text-[var(--text-muted)]">Numéro
                    <input type="number" min="1" className="input mt-1 w-full" value={meta.numero} disabled={!editable} onChange={(event) => { setMeta((value) => ({ ...value, numero: event.target.value })); marquerSale() }} />
                  </label>
                  <label className="text-xs text-[var(--text-muted)]">Durée (secondes)
                    <input type="number" min="1" className="input mt-1 w-full" value={meta.duree_sec} disabled={!editable} onChange={(event) => { setMeta((value) => ({ ...value, duree_sec: event.target.value })); marquerSale() }} />
                  </label>
                </div>
              </Card>

              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black">Questions</h3>
                  <p className="text-xs text-[var(--text-muted)]">Toutes les questions restent sur cette page, sans nombre maximum prédéfini.</p>
                </div>
                {editable && <Button type="button" variant="secondary" onClick={ajouterQuestion}>+ Question</Button>}
              </div>

              {questions.map((question, index) => (
                <QuestionEditor
                  key={question._key}
                  question={question}
                  index={index}
                  total={questions.length}
                  editable={editable}
                  onChange={(patch) => modifierQuestion(index, patch)}
                  onDelete={() => supprimerQuestion(index)}
                  onMove={(direction) => deplacerQuestion(index, direction)}
                />
              ))}
              {questions.length === 0 && <Card><p className="text-sm text-[var(--text-muted)]">Cette version ne contient aucune question.</p></Card>}

              {versions.length > 0 && (
                <Card>
                  <h3 className="mb-3 text-sm font-black">Historique immuable</h3>
                  <div className="flex flex-wrap gap-2">
                    {versions.map((version) => (
                      <button
                        key={version.quiz_id}
                        type="button"
                        onClick={() => ouvrir({ devoir_id: selection.devoir.id, quiz_id: version.quiz_id })}
                        className={`rounded-xl border px-3 py-2 text-left text-xs ${statutStyle[version.statut]}`}
                      >
                        <strong>v{version.version}</strong> · {version.statut}<br />
                        <span className="text-[var(--text-muted)]">{version.tentatives_count} tentative(s)</span>
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {editable && (
                <div className="relative z-10 flex flex-wrap justify-end gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]/95 p-3 backdrop-blur lg:sticky lg:bottom-3">
                  <Button type="button" variant="secondary" onClick={() => sauvegarder()} disabled={busy}>
                    {busy ? 'Enregistrement…' : 'Enregistrer le brouillon'}
                  </Button>
                  <Button type="button" onClick={publier} disabled={busy}>
                    Publier la version {selection.version.version}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function QuestionEditor({ question, index, total, editable, onChange, onDelete, onMove }) {
  function changerChoix(choixIndex, valeur) {
    const anciens = question.choix
    onChange({ choix: anciens.map((item, i) => (i === choixIndex ? valeur : item)) })
  }

  function supprimerChoix(choixIndex) {
    if (question.choix.length <= 2) return
    const nouveaux = question.choix.filter((_, i) => i !== choixIndex)
    let correcte = question.correcte
    if (choixIndex < correcte) correcte -= 1
    else if (choixIndex === correcte) correcte = 0
    onChange({ choix: nouveaux, correcte })
  }

  return (
    <Card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--border)] text-xs font-black">{index + 1}</span>
          <select className="input" value={question.type} disabled={!editable} onChange={(event) => onChange({ type: event.target.value })}>
            <option value="qcm">QCM</option>
            <option value="texte">Réponse libre</option>
          </select>
        </div>
        {editable && (
          <div className="flex gap-1">
            <Button type="button" variant="ghost" className="min-h-9 px-2" disabled={index === 0} onClick={() => onMove(-1)} aria-label="Monter la question">↑</Button>
            <Button type="button" variant="ghost" className="min-h-9 px-2" disabled={index === total - 1} onClick={() => onMove(1)} aria-label="Descendre la question">↓</Button>
            <Button type="button" variant="danger" className="min-h-9 px-3" onClick={onDelete}>Supprimer</Button>
          </div>
        )}
      </div>

      <MarkdownField
        label="Énoncé"
        value={question.enonce}
        disabled={!editable}
        onChange={(enonce) => onChange({ enonce })}
      />

      {question.type === 'qcm' ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Choix et bonne réponse</p>
          {question.choix.map((choix, choixIndex) => (
            <div key={choixIndex} className="flex items-center gap-2">
              <input type="radio" name={`correcte-${question._key}`} checked={question.correcte === choixIndex} disabled={!editable} onChange={() => onChange({ correcte: choixIndex })} />
              <input className="input flex-1" value={choix} disabled={!editable} onChange={(event) => changerChoix(choixIndex, event.target.value)} placeholder={`Choix ${choixIndex + 1}`} />
              {editable && question.choix.length > 2 && (
                <button type="button" className="px-2 text-[var(--neon-magenta)]" onClick={() => supprimerChoix(choixIndex)} aria-label={`Supprimer le choix ${choixIndex + 1}`}>×</button>
              )}
            </div>
          ))}
          {editable && <Button type="button" variant="ghost" onClick={() => onChange({ choix: [...question.choix, ''] })}>+ Ajouter un choix</Button>}
        </div>
      ) : (
        <label className="mt-4 flex flex-col gap-1 text-xs text-[var(--text-muted)]">
          Réponses acceptées — une par ligne
          <textarea className="input" rows={3} value={question.reponses_texte} disabled={!editable} onChange={(event) => onChange({ reponses_texte: event.target.value })} />
        </label>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-[7rem_1fr_1fr]">
        <label className="text-xs text-[var(--text-muted)]">Points
          <input type="number" min="1" className="input mt-1 w-full" value={question.points} disabled={!editable} onChange={(event) => onChange({ points: event.target.value })} />
        </label>
        <label className="text-xs text-[var(--text-muted)]">Image HTTPS (optionnelle)
          <input className="input mt-1 w-full" value={question.image_url} disabled={!editable} onChange={(event) => onChange({ image_url: event.target.value })} placeholder="https://…" />
        </label>
        <label className="text-xs text-[var(--text-muted)]">Description de l’image
          <input className="input mt-1 w-full" value={question.image_alt} disabled={!editable} onChange={(event) => onChange({ image_alt: event.target.value })} placeholder="Ce que montre l’image…" />
        </label>
      </div>

      <div className="mt-4">
        <MarkdownField
          label="Correction complète"
          value={question.explication}
          disabled={!editable}
          numberedHeadings
          onChange={(explication) => onChange({ explication })}
        />
      </div>
    </Card>
  )
}

function MarkdownField({ label, value, onChange, disabled, numberedHeadings = false }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">{label}</label>
        {!disabled && (
          <button
            type="button"
            className="text-[10px] font-bold text-[var(--neon-cyan)] hover:underline"
            onClick={() => onChange(normalizeMathMarkdown(value, { numberedHeadings }))}
          >
            Mettre en forme
          </button>
        )}
      </div>
      <textarea className="input w-full" rows={4} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
      <div className="mt-2 min-h-20 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg)]/45 p-3">
        <p className="mb-2 text-[10px] font-black uppercase tracking-wide text-[var(--text-muted)]">Aperçu élève</p>
        {value.trim() ? (
          <MathMarkdown numberedHeadings={numberedHeadings}>{value}</MathMarkdown>
        ) : (
          <p className="text-xs italic text-[var(--text-muted)]">Le rendu Markdown et LaTeX apparaîtra ici.</p>
        )}
      </div>
    </div>
  )
}
