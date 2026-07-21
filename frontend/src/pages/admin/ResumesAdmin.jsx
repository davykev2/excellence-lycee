import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { normalizeMathMarkdown } from '../../lib/mathMarkdown'
import { formatDateTime } from '../../utils/time'
import MathMarkdown from '../../components/content/MathMarkdown'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'
import Loader from '../../components/ui/Loader'

const STATUTS_COMMENTAIRE = [
  { value: 'nouveau', label: 'Nouveau', couleur: 'var(--neon-violet)' },
  { value: 'traite', label: 'Traité', couleur: 'var(--neon-green)' },
  { value: 'ignore', label: 'Ignoré', couleur: 'var(--text-muted)' },
]

const MESSAGE_ABANDON = 'Ce brouillon contient des modifications non enregistrées. Voulez-vous vraiment les perdre ?'

function messageErreur(error) {
  const message = error?.message ?? String(error ?? '')
  const traductions = [
    ['auth_required', 'Votre session a expiré. Reconnectez-vous avant de continuer.'],
    ['admin_required', 'Cet atelier est réservé aux administrateurs.'],
    ['chapitre_introuvable', 'Cette leçon est introuvable.'],
    ['resume_revision_conflit', 'Le résumé publié a changé dans un autre onglet. Rechargez la leçon avant de reprendre.'],
    ['brouillon_revision_conflit', 'Le brouillon a changé dans un autre onglet. Rechargez la leçon pour éviter d’écraser ces modifications.'],
    ['resume_vide', 'Le résumé est vide : ajoutez du contenu avant de le publier.'],
    ['contenu_trop_volumineux', 'Le résumé dépasse la taille technique autorisée.'],
    ['statut_commentaire_invalide', 'Le statut choisi pour ce commentaire est invalide.'],
    ['commentaire_introuvable', 'Ce commentaire n’existe plus.'],
  ]
  return traductions.find(([code]) => message.includes(code))?.[1] ?? message
}

async function recupererAtelier(chapitreId) {
  const { data, error } = await supabase.rpc('get_resume_admin', { p_chapitre_id: chapitreId })
  if (error) throw error
  return data
}

export default function ResumesAdmin() {
  const { chapitreId: chapitreRouteId } = useParams()
  const routeInitialisee = useRef('')
  const [niveaux, setNiveaux] = useState([])
  const [series, setSeries] = useState([])
  const [matieres, setMatieres] = useState([])
  const [chapitres, setChapitres] = useState([])
  const [niveauId, setNiveauId] = useState('')
  const [serieId, setSerieId] = useState('')
  const [matiereId, setMatiereId] = useState('')
  const [chapitreId, setChapitreId] = useState('')

  const [atelier, setAtelier] = useState(null)
  const [texte, setTexte] = useState('')
  const [brouillonEnregistre, setBrouillonEnregistre] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [commentaireBusy, setCommentaireBusy] = useState('')
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')

  const apercu = useDeferredValue(texte)
  const dirty = atelier !== null && texte !== brouillonEnregistre
  const aPublier = atelier !== null && (!atelier.resume_published || texte !== (atelier.contenu_publie ?? ''))

  const compteursCommentaires = useMemo(() => {
    const compteurs = { nouveau: 0, traite: 0, ignore: 0 }
    for (const commentaire of atelier?.commentaires ?? []) {
      compteurs[commentaire.statut] = (compteurs[commentaire.statut] ?? 0) + 1
    }
    return compteurs
  }, [atelier?.commentaires])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      supabase.from('niveaux').select('*').order('ordre'),
      supabase.from('matieres').select('*').order('ordre'),
    ]).then(([niveauxResult, matieresResult]) => {
      if (cancelled) return
      setNiveaux(niveauxResult.data ?? [])
      setMatieres(matieresResult.data ?? [])
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    if (!chapitreRouteId || routeInitialisee.current === chapitreRouteId) return undefined
    routeInitialisee.current = chapitreRouteId

    supabase
      .from('chapitres')
      .select('id, matiere_id, serie_id, series(niveau_id)')
      .eq('id', chapitreRouteId)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data) {
          setErreur('La leçon demandée est introuvable.')
          return
        }
        setNiveauId(data.series?.niveau_id ?? '')
        setSerieId(data.serie_id ?? '')
        setMatiereId(data.matiere_id ?? '')
        setChapitreId(data.id)
      })

    return () => { cancelled = true }
  }, [chapitreRouteId])

  useEffect(() => {
    let cancelled = false
    if (!niveauId) {
      setSeries([])
      return undefined
    }
    supabase
      .from('series')
      .select('*')
      .eq('niveau_id', niveauId)
      .order('nom')
      .then(({ data }) => {
        if (!cancelled) setSeries(data ?? [])
      })
    return () => { cancelled = true }
  }, [niveauId])

  useEffect(() => {
    let cancelled = false
    if (!serieId || !matiereId) {
      setChapitres([])
      return undefined
    }
    supabase
      .from('chapitres')
      .select('id, titre, ordre, published, resume_published, resume_revision')
      .eq('serie_id', serieId)
      .eq('matiere_id', matiereId)
      .order('ordre')
      .then(({ data }) => {
        if (!cancelled) setChapitres(data ?? [])
      })
    return () => { cancelled = true }
  }, [serieId, matiereId])

  useEffect(() => {
    let cancelled = false
    if (!chapitreId) {
      setAtelier(null)
      setTexte('')
      setBrouillonEnregistre('')
      return undefined
    }

    setLoading(true)
    setErreur('')
    setSucces('')
    recupererAtelier(chapitreId)
      .then((data) => {
        if (cancelled) return
        const contenu = data?.brouillon?.contenu ?? data?.contenu_publie ?? ''
        setAtelier(data)
        setTexte(contenu)
        setBrouillonEnregistre(contenu)
      })
      .catch((error) => {
        if (!cancelled) setErreur(messageErreur(error))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [chapitreId])

  useEffect(() => {
    if (!dirty) return undefined

    const protegerRechargement = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }
    const protegerLiens = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const lien = event.target.closest?.('a[href]')
      if (!lien || lien.target === '_blank') return
      if (!window.confirm(MESSAGE_ABANDON)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener('beforeunload', protegerRechargement)
    document.addEventListener('click', protegerLiens, true)
    return () => {
      window.removeEventListener('beforeunload', protegerRechargement)
      document.removeEventListener('click', protegerLiens, true)
    }
  }, [dirty])

  function autoriserChangement() {
    return !dirty || window.confirm(MESSAGE_ABANDON)
  }

  function viderEditeur() {
    setAtelier(null)
    setTexte('')
    setBrouillonEnregistre('')
    setErreur('')
    setSucces('')
  }

  function changerNiveau(value) {
    if (!autoriserChangement()) return
    setNiveauId(value)
    setSerieId('')
    setMatiereId('')
    setChapitreId('')
    setSeries([])
    setChapitres([])
    viderEditeur()
  }

  function changerSerie(value) {
    if (!autoriserChangement()) return
    setSerieId(value)
    setMatiereId('')
    setChapitreId('')
    setChapitres([])
    viderEditeur()
  }

  function changerMatiere(value) {
    if (!autoriserChangement()) return
    setMatiereId(value)
    setChapitreId('')
    setChapitres([])
    viderEditeur()
  }

  function changerChapitre(value) {
    if (!autoriserChangement()) return
    setChapitreId(value)
    viderEditeur()
  }

  async function sauvegarder() {
    if (!atelier || saving || publishing) return
    setSaving(true)
    setErreur('')
    setSucces('')
    const { data, error } = await supabase.rpc('sauvegarder_brouillon_resume_admin', {
      p_chapitre_id: atelier.chapitre_id,
      p_contenu: texte,
      p_revision_attendue: atelier.revision,
      p_brouillon_revision_attendue: atelier.brouillon.revision,
    })
    if (error) {
      setErreur(messageErreur(error))
    } else {
      setAtelier((courant) => ({
        ...courant,
        brouillon: {
          ...courant.brouillon,
          contenu: texte,
          base_revision: data.base_revision,
          revision: data.brouillon_revision,
          updated_at: data.updated_at,
        },
      }))
      setBrouillonEnregistre(texte)
      setSucces('Brouillon enregistré. Les élèves voient toujours la dernière version publiée.')
    }
    setSaving(false)
  }

  async function publier() {
    if (!atelier || publishing || saving || !texte.trim()) return
    if (!window.confirm('Publier cette version du résumé pour les élèves ?')) return
    setPublishing(true)
    setErreur('')
    setSucces('')

    const { error } = await supabase.rpc('publier_resume_admin', {
      p_chapitre_id: atelier.chapitre_id,
      p_contenu: texte,
      p_revision_attendue: atelier.revision,
      p_brouillon_revision_attendue: atelier.brouillon.revision,
    })

    if (error) {
      setErreur(messageErreur(error))
    } else {
      try {
        const data = await recupererAtelier(atelier.chapitre_id)
        const contenu = data?.brouillon?.contenu ?? texte
        setAtelier(data)
        setTexte(contenu)
        setBrouillonEnregistre(contenu)
        setChapitres((liste) => liste.map((chapitre) => (
          chapitre.id === atelier.chapitre_id
            ? { ...chapitre, resume_published: true, resume_revision: data.revision }
            : chapitre
        )))
        setSucces(`Résumé publié avec succès — révision ${data.revision}.`)
      } catch (reloadError) {
        setErreur(`La publication a réussi, mais le rechargement a échoué : ${messageErreur(reloadError)}`)
      }
    }
    setPublishing(false)
  }

  function normaliser() {
    const normalise = normalizeMathMarkdown(texte)
    setTexte(normalise)
    setSucces(normalise === texte ? 'Le contenu est déjà normalisé.' : 'La mise en forme Markdown/LaTeX a été normalisée. Vérifiez l’aperçu avant de publier.')
    setErreur('')
  }

  async function changerStatutCommentaire(commentaireId, statut) {
    if (commentaireBusy) return
    setCommentaireBusy(commentaireId)
    setErreur('')
    const { data, error } = await supabase.rpc('changer_statut_commentaire_resume_admin', {
      p_commentaire_id: commentaireId,
      p_statut: statut,
    })
    if (error) {
      setErreur(messageErreur(error))
    } else {
      setAtelier((courant) => ({
        ...courant,
        commentaires: courant.commentaires.map((commentaire) => (
          commentaire.id === commentaireId
            ? { ...commentaire, statut: data.statut, statut_updated_at: data.updated_at }
            : commentaire
        )),
      }))
    }
    setCommentaireBusy('')
  }

  return (
    <div>
      <div className="mb-2">
        <h2 className="text-xl font-black">📖 Atelier des résumés</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Corrigez progressivement un brouillon privé, consultez les retours des élèves, puis publiez une version complète.
        </p>
      </div>

      <Card className="mb-5">
        <p className="mb-3 text-sm font-bold">1. Choisir la leçon</p>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          <select className="input w-full" value={niveauId} onChange={(event) => changerNiveau(event.target.value)}>
            <option value="">Niveau…</option>
            {niveaux.map((niveau) => <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>)}
          </select>
          <select className="input w-full" value={serieId} onChange={(event) => changerSerie(event.target.value)} disabled={!niveauId}>
            <option value="">Série…</option>
            {series.map((serie) => <option key={serie.id} value={serie.id}>{serie.nom}</option>)}
          </select>
          <select className="input w-full" value={matiereId} onChange={(event) => changerMatiere(event.target.value)} disabled={!serieId}>
            <option value="">Matière…</option>
            {matieres.map((matiere) => <option key={matiere.id} value={matiere.id}>{matiere.icone} {matiere.nom}</option>)}
          </select>
          <select className="input w-full" value={chapitreId} onChange={(event) => changerChapitre(event.target.value)} disabled={!serieId || !matiereId}>
            <option value="">Leçon…</option>
            {chapitres.map((chapitre) => (
              <option key={chapitre.id} value={chapitre.id}>
                {chapitre.ordre}. {chapitre.titre}{chapitre.resume_published ? ` · v${chapitre.resume_revision}` : ' · brouillon'}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {erreur && (
        <div className="mb-4 rounded-xl border border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/10 p-3 text-sm" role="alert">
          {erreur}
        </div>
      )}
      {succes && (
        <div className="mb-4 rounded-xl border border-[var(--neon-green)] bg-[var(--neon-green)]/10 p-3 text-sm text-[var(--success-text)]" role="status">
          {succes}
        </div>
      )}

      {!chapitreId ? (
        <Card className="py-10 text-center text-sm text-[var(--text-muted)]">
          Sélectionnez un niveau, une série, une matière et une leçon pour commencer.
        </Card>
      ) : loading ? (
        <Loader label="Chargement du résumé et des commentaires…" />
      ) : atelier ? (
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,0.85fr)]">
          <div className="min-w-0 space-y-5">
            <Card>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="game-eyebrow">Leçon {String(atelier.ordre).padStart(2, '0')}</p>
                  <h3 className="mt-1 text-lg font-black">{atelier.titre}</h3>
                  {atelier.description && <p className="mt-1 text-xs text-[var(--text-muted)]">{atelier.description}</p>}
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className={`rounded-full border px-2 py-1 ${atelier.resume_published ? 'border-[var(--neon-green)] text-[var(--success-text)]' : 'border-[var(--neon-violet)] text-[var(--neon-violet)]'}`}>
                    {atelier.resume_published ? `Publié · v${atelier.revision}` : 'Non publié'}
                  </span>
                  {dirty && <span className="rounded-full border border-[var(--neon-magenta)] px-2 py-1 text-[var(--neon-magenta)]">Modifications non enregistrées</span>}
                </div>
              </div>

              {!atelier.chapitre_published && (
                <p className="mb-4 rounded-lg border border-[var(--neon-violet)]/50 bg-[var(--neon-violet)]/10 p-3 text-xs">
                  La leçon elle-même n’est pas publiée. Le résumé restera invisible aux élèves jusqu’à sa publication dans les contenus.
                </p>
              )}

              <label className="text-sm font-bold" htmlFor="resume-editor">2. Rédiger le brouillon</label>
              <textarea
                id="resume-editor"
                className="input mt-2 min-h-[32rem] w-full resize-y font-mono text-sm leading-relaxed"
                value={texte}
                onChange={(event) => {
                  setTexte(event.target.value)
                  setSucces('')
                }}
                placeholder={'## L’essentiel\n\nRédigez le résumé en Markdown. Les formules peuvent utiliser $...$, \\(...\\) ou \\[...\\].'}
                spellCheck="true"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[var(--text-muted)]">
                  {texte.length.toLocaleString('fr-FR')} caractères
                  {atelier.brouillon?.updated_at && ` · brouillon enregistré ${formatDateTime(atelier.brouillon.updated_at)}`}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="ghost" onClick={normaliser} disabled={saving || publishing}>Normaliser LaTeX</Button>
                  <Button type="button" variant="secondary" onClick={sauvegarder} disabled={!dirty || saving || publishing}>
                    {saving ? 'Enregistrement…' : 'Enregistrer le brouillon'}
                  </Button>
                  <Button type="button" onClick={publier} disabled={!texte.trim() || !aPublier || saving || publishing}>
                    {publishing ? 'Publication…' : 'Publier cette version'}
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-black">3. Aperçu élève</h3>
                <span className="text-xs text-[var(--text-muted)]">Même moteur Markdown + KaTeX que la page de cours</span>
              </div>
              {apercu.trim() ? (
                <MathMarkdown className="rounded-xl border border-[var(--border)] bg-[var(--bg)]/40 p-4 sm:p-6">{apercu}</MathMarkdown>
              ) : (
                <p className="py-8 text-center text-sm text-[var(--text-muted)]">Le résumé est vide.</p>
              )}
            </Card>

            <Card>
              <details>
                <summary className="cursor-pointer font-black">Historique des publications ({atelier.versions?.length ?? 0})</summary>
                <div className="mt-3 space-y-2">
                  {(atelier.versions ?? []).map((version) => (
                    <div key={version.revision} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--border)] p-3 text-sm">
                      <span className="font-bold">Révision {version.revision}</span>
                      <span className="text-xs text-[var(--text-muted)]">
                        {formatDateTime(version.published_at)}{version.published_by_username ? ` · ${version.published_by_username}` : ''}
                      </span>
                    </div>
                  ))}
                  {(atelier.versions ?? []).length === 0 && <p className="text-sm text-[var(--text-muted)]">Aucune version publiée pour le moment.</p>}
                </div>
              </details>
            </Card>
          </div>

          <Card className="min-w-0 xl:sticky xl:top-20">
            <div className="mb-3">
              <h3 className="font-black">💬 Retours des élèves</h3>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Le commentaire original est conservé. Seul son statut de suivi change.</p>
            </div>
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              {STATUTS_COMMENTAIRE.map((statut) => (
                <span key={statut.value} className="rounded-full border px-2 py-1" style={{ borderColor: statut.couleur, color: statut.couleur }}>
                  {statut.label} · {compteursCommentaires[statut.value] ?? 0}
                </span>
              ))}
            </div>

            {(atelier.commentaires ?? []).length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--text-muted)]">Aucun commentaire sur cette leçon.</p>
            ) : (
              <ul className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
                {atelier.commentaires.map((commentaire) => (
                  <li key={commentaire.id} className="rounded-xl border border-[var(--border)] p-3">
                    <div className="flex items-start gap-2">
                      <Avatar
                        userId={commentaire.user_id}
                        avatarUrl={commentaire.avatar_url}
                        username={commentaire.username}
                        size="h-8 w-8"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-[var(--text-muted)]">
                          <span className="font-bold text-[var(--text)]">{commentaire.username || 'Élève'}</span>
                          {' · '}{formatDateTime(commentaire.created_at)}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm">{commentaire.contenu}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {STATUTS_COMMENTAIRE.map((statut) => {
                        const actif = commentaire.statut === statut.value
                        return (
                          <button
                            key={statut.value}
                            type="button"
                            disabled={commentaireBusy === commentaire.id}
                            onClick={() => changerStatutCommentaire(commentaire.id, statut.value)}
                            className={`rounded-full border px-2.5 py-1 text-[11px] transition disabled:opacity-40 ${actif ? 'bg-[var(--border)] font-bold' : 'text-[var(--text-muted)] hover:text-[var(--text)]'}`}
                            style={actif ? { borderColor: statut.couleur, color: statut.couleur } : undefined}
                            aria-pressed={actif}
                          >
                            {statut.label}
                          </button>
                        )
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      ) : null}
    </div>
  )
}
