import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon } from '@phosphor-icons/react/dist/csr/ArrowLeft'
import { BookOpenIcon } from '@phosphor-icons/react/dist/csr/BookOpen'
import { CheckCircleIcon } from '@phosphor-icons/react/dist/csr/CheckCircle'
import { DiceFiveIcon } from '@phosphor-icons/react/dist/csr/DiceFive'
import { GhostIcon } from '@phosphor-icons/react/dist/csr/Ghost'
import { HandshakeIcon } from '@phosphor-icons/react/dist/csr/Handshake'
import { HeartBreakIcon } from '@phosphor-icons/react/dist/csr/HeartBreak'
import { HourglassIcon } from '@phosphor-icons/react/dist/csr/Hourglass'
import { HouseIcon } from '@phosphor-icons/react/dist/csr/House'
import { LockIcon } from '@phosphor-icons/react/dist/csr/Lock'
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/csr/MagnifyingGlass'
import { ShieldCheckeredIcon } from '@phosphor-icons/react/dist/csr/ShieldCheckered'
import { SwordIcon } from '@phosphor-icons/react/dist/csr/Sword'
import { TimerIcon } from '@phosphor-icons/react/dist/csr/Timer'
import { TrophyIcon } from '@phosphor-icons/react/dist/csr/Trophy'
import { UsersThreeIcon } from '@phosphor-icons/react/dist/csr/UsersThree'
import { XCircleIcon } from '@phosphor-icons/react/dist/csr/XCircle'
import { supabase } from '../lib/supabaseClient'
import { isAndroidDuelExperience, isAndroidDuelPreview } from '../lib/nativeApp'
import { useAuthStore } from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import Avatar, { PresenceLabel } from '../components/ui/Avatar'
import MathMarkdown from '../components/content/MathMarkdown'
import { useAudioFeedback } from '../store/useAudioFeedbackStore'
import './AndroidDuel.css'

const DUEL_DURATION_SECONDS = 90
const POLLING_DELAY_MS = 900
const FINISHED_STATUSES = new Set(['termine', 'terminee', 'terminé', 'expire', 'expiree', 'expiré', 'refuse', 'annule'])

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null)
}

function unwrapObject(data) {
  if (!Array.isArray(data)) return data ?? {}
  if (data.length !== 1 || !data[0] || typeof data[0] !== 'object') return data
  const row = data[0]
  const keys = Object.keys(row)
  if (keys.length === 1 && row[keys[0]] && typeof row[keys[0]] === 'object') return row[keys[0]]
  return row
}

function normalizeDefis(data) {
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []

  const buckets = [
    ['invitations', 'invitation'],
    ['recus', 'invitation'],
    ['a_jouer', 'a_jouer'],
    ['aJouer', 'a_jouer'],
    ['en_attente', 'attente'],
    ['attente', 'attente'],
    ['historique', 'historique'],
    ['termines', 'historique'],
  ]
  const seen = new Set()
  const rows = []
  buckets.forEach(([key, bucket]) => {
    asArray(data[key]).forEach((row) => {
      if (!row?.id || seen.has(row.id)) return
      seen.add(row.id)
      rows.push({ ...row, _bucket: bucket })
    })
  })
  return rows.length ? rows : asArray(data.defis)
}

function normalizeCatalogue(data) {
  const payload = unwrapObject(data)
  if (Array.isArray(payload)) return payload
  return asArray(payload.chapitres ?? payload.lecons ?? payload.catalogue)
}

function chapterQuestionCount(chapitre) {
  return Number(firstDefined(chapitre?.question_count, chapitre?.nb_questions, chapitre?.questions_count, 0))
}

function chapterIsAvailable(chapitre) {
  return chapitre?.available === true || (chapitre?.available !== false && chapterQuestionCount(chapitre) > 0)
}

function normalizeQuestions(data) {
  const payload = unwrapObject(data)
  if (Array.isArray(payload)) return { questions: payload }
  return { ...payload, questions: asArray(payload.questions) }
}

function normalizeStatus(value) {
  return String(value ?? '').toLocaleLowerCase('fr').replaceAll('-', '_')
}

function friendlyError(error) {
  const raw = String(error?.message ?? error ?? '')
  const code = raw.toLocaleLowerCase('fr')
  const messages = [
    ['auth_required', 'Reconnecte-toi pour accéder aux duels.'],
    ['compte_non_approuve', "Ton compte doit être approuvé avant d'entrer dans l'arène."],
    ['auto_defi_interdit', 'Tu ne peux pas te défier toi-même.'],
    ['adversaire_non_autorise', "Cet adversaire n'est pas disponible pour ce duel."],
    ['matiere_non_autorisee', "Cette matière n'est pas disponible pour ta série."],
    ['chapitre_non_autorise', "Une des leçons choisies n'est pas disponible."],
    ['trop_de_chapitres', 'Choisis au maximum 3 leçons.'],
    ['contenu_insuffisant', "Il n'y a pas encore assez de questions publiées pour ce choix."],
    ['defis_desactives', 'Les duels sont temporairement désactivés.'],
    ['defi_expire', 'Ce défi a expiré.'],
    ['defi_introuvable', "Ce défi n'est plus disponible."],
    ['defi_deja_joue', 'Tu as déjà terminé cette manche.'],
    ['reponse_deja_soumise', 'Cette réponse a déjà été enregistrée.'],
    ['temps_ecoule', 'Temps écoulé : ta manche vient de se terminer.'],
    ['recherche_trop_courte', 'Saisis au moins deux caractères pour rechercher un adversaire.'],
    ['recherche_trop_longue', 'La recherche est limitée à 50 caractères.'],
  ]
  return messages.find(([needle]) => code.includes(needle))?.[1] ?? raw ?? 'Une erreur est survenue.'
}

function getDefiId(data) {
  const value = unwrapObject(data)
  return typeof value === 'string' ? value : firstDefined(value.defi_id, value.id)
}

function sideProfile(source, role) {
  const nested = firstDefined(
    source?.[role],
    source?.[`${role}_profile`],
    source?.[`${role}_profil`],
    source?.participants?.[role],
  ) ?? {}
  return {
    id: firstDefined(nested.id, source?.[`${role}_id`]),
    username: firstDefined(nested.username, nested.nom, source?.[`${role}_username`], source?.[`${role}_nom`], role === 'challenger' ? 'Challenger' : 'Adversaire'),
    avatar_url: firstDefined(nested.avatar_url, source?.[`${role}_avatar_url`]),
  }
}

function sideStats(source, role) {
  const nested = firstDefined(
    source?.[role],
    source?.[`${role}_stats`],
    source?.stats?.[role],
    source?.participants?.[role]?.stats,
  ) ?? {}
  return {
    correct: Number(firstDefined(
      nested.correct,
      nested.correctes,
      nested.bonnes,
      nested.bonnes_reponses,
      source?.[`${role}_bonnes`],
      source?.[`${role}_bonnes_reponses`],
      source?.[`bonnes_reponses_${role}`],
      0,
    )),
    wrong: Number(firstDefined(
      nested.wrong,
      nested.incorrectes,
      nested.erreurs,
      nested.mauvaises_reponses,
      source?.[`${role}_erreurs`],
      source?.[`${role}_mauvaises_reponses`],
      source?.[`erreurs_${role}`],
      0,
    )),
    score: Number(firstDefined(nested.score, nested.points, source?.[`score_${role}`], source?.[`${role}_score`], 0)),
    finished: Boolean(firstDefined(
      nested.finished,
      nested.termine,
      nested.finished_at,
      source?.[`${role}_termine`],
      source?.[`${role}_finished`],
      source?.[`${role}_finished_at`],
      source?.[`finished_${role}`],
      source?.[`score_${role}`] !== null && source?.[`score_${role}`] !== undefined ? true : undefined,
      false,
    )),
  }
}

function getSides(source, userId) {
  if (source?.me && source?.opponent) {
    const myRole = firstDefined(source.role, source.me.role, 'challenger')
    const opponentRole = myRole === 'challenger' ? 'adversaire' : 'challenger'
    return {
      myRole,
      opponentRole,
      me: {
        id: source.me.id,
        username: firstDefined(source.me.username, source.me.nom, 'Joueur'),
        avatar_url: source.me.avatar_url,
      },
      opponent: {
        id: source.opponent.id,
        username: firstDefined(source.opponent.username, source.opponent.nom, 'Adversaire'),
        avatar_url: source.opponent.avatar_url,
      },
      myStats: {
        correct: Number(firstDefined(source.me.correctes, source.me.correct, 0)),
        wrong: Number(firstDefined(source.me.incorrectes, source.me.wrong, 0)),
        score: Number(firstDefined(source.me.score, 0)),
        finished: Boolean(source.me.finished_at),
      },
      opponentStats: {
        correct: Number(firstDefined(source.opponent.correctes, source.opponent.correct, 0)),
        wrong: Number(firstDefined(source.opponent.incorrectes, source.opponent.wrong, 0)),
        score: Number(firstDefined(source.opponent.score, 0)),
        finished: Boolean(source.opponent.finished_at),
      },
    }
  }
  const challenger = sideProfile(source, 'challenger')
  const adversaire = sideProfile(source, 'adversaire')
  const isChallenger = challenger.id === userId || source?.challenger_id === userId
  const myRole = isChallenger ? 'challenger' : 'adversaire'
  const opponentRole = isChallenger ? 'adversaire' : 'challenger'
  return {
    myRole,
    opponentRole,
    me: isChallenger ? challenger : adversaire,
    opponent: isChallenger ? adversaire : challenger,
    myStats: sideStats(source, myRole),
    opponentStats: sideStats(source, opponentRole),
  }
}

function remainingFromState(source, now = Date.now()) {
  const direct = firstDefined(source?.remaining_seconds, source?.temps_restant, source?.secondes_restantes)
  if (direct !== undefined) return Math.max(0, Math.ceil(Number(direct)))
  const deadline = firstDefined(source?.ends_at, source?.end_at, source?.deadline_at, source?.manche_fin_at)
  if (deadline) return Math.max(0, Math.ceil((new Date(deadline).getTime() - now) / 1000))
  return DUEL_DURATION_SECONDS
}

function choiceValue(choice) {
  if (choice && typeof choice === 'object') return firstDefined(choice.value, choice.id, choice.texte, choice.label)
  return choice
}

function choiceLabel(choice) {
  if (choice && typeof choice === 'object') return String(firstDefined(choice.label, choice.texte, choice.value, choice.id, ''))
  return String(choice ?? '')
}

function questionChoices(question) {
  const choices = asArray(firstDefined(question?.choix, question?.options, question?.propositions))
  return choices
}

function getServerCorrect(payload) {
  const value = firstDefined(payload?.correcte, payload?.correct, payload?.est_correcte)
  return typeof value === 'boolean' ? value : null
}

function replayGhostStats(state, sides, now) {
  const timeline = asArray(firstDefined(state?.opponent?.timeline, state?.ghost_timeline, state?.fantome_timeline))
  const startedAt = firstDefined(state?.me?.start_at, state?.start_at, state?.common_start_at)
  if (!timeline.length || !startedAt) return sides
  const elapsedMs = Math.max(0, now - new Date(startedAt).getTime())
  const visibleEvents = timeline.filter((event) => Number(firstDefined(event.offset_ms, event.elapsed_ms, event.delai_ms, 0)) <= elapsedMs)
  return {
    ...sides,
    opponentStats: {
      ...sides.opponentStats,
      correct: visibleEvents.filter((event) => event.correcte === true).length,
      wrong: visibleEvents.filter((event) => event.correcte === false).length,
    },
  }
}

export default function Defis() {
  if (isAndroidDuelPreview()) return <AndroidDuelPreview />
  return <DefisLive />
}

function DefisLive() {
  const profile = useAuthStore((state) => state.profile)
  const { play } = useAudioFeedback()
  const [suggestions, setSuggestions] = useState([])
  const [opponentQuery, setOpponentQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [matieres, setMatieres] = useState([])
  const [defis, setDefis] = useState([])
  const [catalogue, setCatalogue] = useState([])
  const [matiereId, setMatiereId] = useState('')
  const [chapitreIds, setChapitreIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [catalogueLoading, setCatalogueLoading] = useState(false)
  const [busy, setBusy] = useState('')
  const [erreur, setErreur] = useState('')
  const [notice, setNotice] = useState('')
  const [screen, setScreen] = useState('list')
  const [activeDefi, setActiveDefi] = useState(null)
  const [duelState, setDuelState] = useState(null)
  const [game, setGame] = useState(null)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [answerFeedback, setAnswerFeedback] = useState(null)
  const [clockNow, setClockNow] = useState(Date.now())
  const finishingRef = useRef(false)
  const autoStartingRef = useRef(false)
  const androidDuel = isAndroidDuelExperience()

  useEffect(() => {
    if (!androidDuel) return undefined
    document.documentElement.classList.add('is-android-duel')
    return () => document.documentElement.classList.remove('is-android-duel')
  }, [androidDuel])

  const chargerListes = useCallback(async ({ silent = false } = {}) => {
    if (!profile?.id) return
    if (!silent) setLoading(true)
    const [{ data: mat, error: matError }, { data: dfs, error: defisError }] = await Promise.all([
      supabase.from('matieres_series').select('matieres(id, nom, icone)').eq('serie_id', profile.serie_id),
      supabase.rpc('get_mes_defis_v2'),
    ])
    const firstError = matError ?? defisError
    if (firstError) setErreur(friendlyError(firstError))
    const nextMatieres = (mat ?? []).map((row) => row.matieres).filter(Boolean)
    setMatieres(nextMatieres)
    setMatiereId((current) => current || nextMatieres[0]?.id || '')
    setDefis(normalizeDefis(dfs))
    if (!silent) setLoading(false)
  }, [profile?.id, profile?.serie_id])

  useEffect(() => {
    chargerListes()
  }, [chargerListes])

  useEffect(() => {
    let cancelled = false
    setChapitreIds([])
    setCatalogue([])
    setSuggestions([])
    setOpponentQuery('')
    setSearchResults([])
    setSearchError('')
    if (!matiereId) {
      return () => { cancelled = true }
    }
    async function loadCatalogue() {
      setCatalogueLoading(true)
      const { data, error } = await supabase.rpc('get_duel_catalogue_v2', { p_matiere_id: matiereId })
      if (cancelled) return
      setCatalogueLoading(false)
      if (error) {
        setCatalogue([])
        setSuggestions([])
        setErreur(friendlyError(error))
        return
      }
      const payload = unwrapObject(data)
      setCatalogue(normalizeCatalogue(payload))
      setSuggestions(asArray(payload.suggestions))
    }
    loadCatalogue()
    return () => { cancelled = true }
  }, [matiereId])

  useEffect(() => {
    const query = opponentQuery.trim()
    let cancelled = false
    if (!matiereId || query.length < 2) {
      setSearchResults([])
      setSearchLoading(false)
      setSearchError('')
      return () => { cancelled = true }
    }

    setSearchLoading(true)
    setSearchResults([])
    setSearchError('')
    const debounce = window.setTimeout(async () => {
      const { data, error } = await supabase.rpc('search_duel_opponents_v2', {
        p_query: query,
        p_limit: 12,
      })
      if (cancelled) return
      setSearchLoading(false)
      if (error) {
        setSearchResults([])
        setSearchError(friendlyError(error))
        return
      }
      const payload = unwrapObject(data)
      setSearchResults(asArray(payload.resultats))
    }, 350)

    return () => {
      cancelled = true
      window.clearTimeout(debounce)
    }
  }, [matiereId, opponentQuery])

  const refreshState = useCallback(async ({ silent = true } = {}) => {
    if (!activeDefi?.id) return null
    const { data, error } = await supabase.rpc('get_defi_state_v2', { p_defi_id: activeDefi.id })
    if (error) {
      if (!silent) setErreur(friendlyError(error))
      return null
    }
    const next = unwrapObject(data)
    setDuelState((current) => ({ ...(current ?? {}), ...(next ?? {}) }))
    setActiveDefi((current) => current ? { ...current, ...(next ?? {}) } : current)
    return next
  }, [activeDefi?.id])

  const loadQuestions = useCallback(async (defiId) => {
    if (!defiId || autoStartingRef.current) return
    autoStartingRef.current = true
    setBusy('questions')
    setErreur('')
    const { data, error } = await supabase.rpc('get_defi_questions_v2', { p_defi_id: defiId })
    autoStartingRef.current = false
    setBusy('')
    if (error) {
      setErreur(friendlyError(error))
      play('error')
      return
    }
    const payload = normalizeQuestions(data)
    if (!payload.questions.length) {
      setErreur("Aucune question n'est disponible pour cette manche.")
      return
    }
    const answeredIds = new Set(asArray(payload.answered_question_ids))
    const firstUnansweredIndex = payload.questions.findIndex((question) => !answeredIds.has(question.id))
    if (firstUnansweredIndex < 0) {
      setDuelState((current) => ({ ...(current ?? {}), ...payload }))
      setActiveDefi((current) => current ? { ...current, ...payload } : current)
      setScreen('waiting')
      setBusy('')
      return
    }
    setDuelState((current) => ({ ...(current ?? {}), ...payload }))
    setGame({ questions: payload.questions, index: firstUnansweredIndex, answered: answeredIds.size })
    setSelectedChoice(null)
    setAnswerFeedback(null)
    setClockNow(Date.now())
    setScreen('game')
  }, [play])

  useEffect(() => {
    if (!activeDefi?.id || !['lobby', 'game', 'waiting'].includes(screen)) return undefined
    const poll = window.setInterval(() => {
      refreshState().then((next) => {
        if (!next) return
        const status = normalizeStatus(next.statut)
        if (FINISHED_STATUSES.has(status) || next.resultat_final || next.finished === true) {
          setScreen('result')
          chargerListes({ silent: true })
          return
        }
        const canEnter = firstDefined(next.peut_jouer, next.can_play, next.manche_demaree, next.run_started)
        const commonStart = firstDefined(next.common_start_at, next.start_at)
        const directStarted = normalizeStatus(next.statut) === 'en_cours' && commonStart && new Date(commonStart).getTime() <= Date.now()
        if (screen === 'lobby' && (canEnter === true || directStarted)) loadQuestions(activeDefi.id)
      })
    }, POLLING_DELAY_MS)
    return () => window.clearInterval(poll)
  }, [activeDefi?.id, chargerListes, loadQuestions, refreshState, screen])

  useEffect(() => {
    if (screen !== 'game') return undefined
    const interval = window.setInterval(() => setClockNow(Date.now()), 250)
    return () => window.clearInterval(interval)
  }, [screen])

  const combinedState = useMemo(
    () => ({ ...(activeDefi ?? {}), ...(duelState ?? {}) }),
    [activeDefi, duelState],
  )
  const sides = useMemo(() => getSides(combinedState, profile?.id), [combinedState, profile?.id])
  const chrono = remainingFromState(combinedState, clockNow)

  const terminerManche = useCallback(async ({ timedOut = false } = {}) => {
    if (!activeDefi?.id || finishingRef.current) return
    finishingRef.current = true
    setBusy('finish')
    const { data, error } = await supabase.rpc('finish_defi_v2', { p_defi_id: activeDefi.id })
    finishingRef.current = false
    setBusy('')
    if (error) {
      setErreur(friendlyError(error))
      play('error')
      return
    }
    const state = unwrapObject(data)
    setDuelState((current) => ({ ...(current ?? {}), ...(state ?? {}) }))
    const status = normalizeStatus(state?.statut)
    if (FINISHED_STATUSES.has(status) || state?.resultat_final || state?.finished === true) {
      play('levelUp')
      setScreen('result')
    } else {
      if (timedOut) play('notification')
      setScreen('waiting')
    }
    await chargerListes({ silent: true })
  }, [activeDefi?.id, chargerListes, play])

  useEffect(() => {
    if (screen === 'game' && chrono <= 0) terminerManche({ timedOut: true })
  }, [chrono, screen, terminerManche])

  function toggleChapitre(id) {
    setErreur('')
    const chapitre = catalogue.find((item) => firstDefined(item.id, item.chapitre_id) === id)
    if (!chapterIsAvailable(chapitre)) return
    setChapitreIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id)
      if (current.length >= 3) {
        setErreur('Choisis au maximum 3 leçons pour un duel.')
        play('error')
        return current
      }
      return [...current, id]
    })
  }

  async function creerDefi(adversaireId) {
    if (!matiereId || busy) return
    if (!catalogue.some(chapterIsAvailable)) {
      setErreur("Aucune leçon de cette matière ne possède encore de QCM compatible avec les duels.")
      play('error')
      return
    }
    setBusy(`create:${adversaireId}`)
    setErreur('')
    setNotice('')
    const { data, error } = await supabase.rpc('create_defi_v2', {
      p_adversaire_id: adversaireId,
      p_matiere_id: matiereId,
      p_chapitre_ids: chapitreIds,
    })
    setBusy('')
    if (error) {
      setErreur(friendlyError(error))
      play('error')
      return
    }
    const created = unwrapObject(data)
    const id = getDefiId(created)
    play('notification')
    await chargerListes({ silent: true })
    if (id) ouvrirDefi({ id, challenger_id: profile.id, adversaire_id: adversaireId, ...created, ...(created.state ?? {}) })
  }

  async function accepter(defi) {
    setBusy(`accept:${defi.id}`)
    setErreur('')
    const { data, error } = await supabase.rpc('accept_defi_v2', { p_defi_id: defi.id })
    setBusy('')
    if (error) {
      setErreur(friendlyError(error))
      play('error')
      return
    }
    play('success')
    ouvrirDefi({ ...defi, ...unwrapObject(data) })
  }

  async function ouvrirDefi(defi) {
    setActiveDefi(defi)
    setDuelState(defi)
    setErreur('')
    setNotice('')
    setScreen('lobby')
  }

  async function seDeclarerPret(playNow) {
    if (!activeDefi?.id || busy) return
    setBusy(playNow ? 'play-now' : 'ready')
    setErreur('')
    const { data, error } = await supabase.rpc('set_defi_ready_v2', {
      p_defi_id: activeDefi.id,
      p_play_now: playNow,
    })
    setBusy('')
    if (error) {
      setErreur(friendlyError(error))
      play('error')
      return
    }
    const next = unwrapObject(data)
    setDuelState((current) => ({ ...(current ?? {}), ...(next ?? {}) }))
    play(playNow ? 'notification' : 'success')
    const canPlay = firstDefined(next?.peut_jouer, next?.can_play, next?.run_started) === true
    const startsAt = firstDefined(next?.common_start_at, next?.start_at)
    if (canPlay && (!startsAt || new Date(startsAt).getTime() <= Date.now())) {
      await loadQuestions(activeDefi.id)
    }
  }

  async function validerReponse() {
    const question = game?.questions?.[game.index]
    if (!question || selectedChoice === null || busy || answerFeedback) return
    setBusy('answer')
    setErreur('')
    const { data, error } = await supabase.rpc('submit_defi_answer_v2', {
      p_defi_id: activeDefi.id,
      p_question_id: question.id,
      p_choix: selectedChoice,
    })
    setBusy('')
    if (error) {
      setErreur(friendlyError(error))
      play('error')
      return
    }
    const payload = unwrapObject(data)
    if (payload.accepted === false) {
      if (payload.reason === 'temps_ecoule') {
        await terminerManche({ timedOut: true })
        return
      }
      if (payload.reason === 'deja_repondue') {
        setErreur('Cette réponse avait déjà été enregistrée. Passe à la question suivante.')
        return
      }
    }
    const correct = getServerCorrect(payload)
    setAnswerFeedback({ correct, payload })
    setDuelState((current) => {
      const serverState = payload?.state ?? payload?.etat
      if (serverState) return { ...(current ?? {}), ...serverState }
      return {
        ...(current ?? {}),
        me: {
          ...(current?.me ?? {}),
          score: payload.score,
          correctes: payload.correctes,
          incorrectes: payload.incorrectes,
          finished_at: payload.finished ? new Date().toISOString() : current?.me?.finished_at,
        },
      }
    })
    setGame((current) => ({ ...current, answered: current.answered + 1 }))
    if (correct === true) play('success')
    if (correct === false) play('error')
  }

  function questionSuivante() {
    if (!game) return
    if (game.index >= game.questions.length - 1) {
      terminerManche()
      return
    }
    setGame((current) => ({ ...current, index: current.index + 1 }))
    setSelectedChoice(null)
    setAnswerFeedback(null)
  }

  function retourListe() {
    setScreen('list')
    setActiveDefi(null)
    setDuelState(null)
    setGame(null)
    setSelectedChoice(null)
    setAnswerFeedback(null)
    setBusy('')
    chargerListes({ silent: true })
  }

  if (loading) return <Loader />
  if (screen === 'lobby') {
    return (
      <LobbyScreen
        state={combinedState}
        sides={sides}
        busy={busy}
        erreur={erreur}
        onReady={() => seDeclarerPret(false)}
        onPlayNow={() => seDeclarerPret(true)}
        onBack={retourListe}
      />
    )
  }
  if (screen === 'game' && game) {
    return (
      <GameScreen
        state={combinedState}
        sides={sides}
        game={game}
        remaining={chrono}
        now={clockNow}
        selectedChoice={selectedChoice}
        answerFeedback={answerFeedback}
        busy={busy}
        erreur={erreur}
        onChoose={setSelectedChoice}
        onValidate={validerReponse}
        onNext={questionSuivante}
      />
    )
  }
  if (screen === 'waiting') {
    return <WaitingScreen sides={sides} state={combinedState} onBack={retourListe} />
  }
  if (screen === 'result') {
    return <ResultScreen state={combinedState} sides={sides} userId={profile?.id} onBack={retourListe} />
  }

  const categorized = categorizeDefis(defis, profile?.id)
  const termines = categorized.historique.filter((defi) => normalizeStatus(defi.statut).startsWith('term'))
  const victoires = termines.filter((defi) => getResult(defi, profile?.id) === 'victoire').length

  return (
    <main className="game-page duel-home mx-auto max-w-5xl px-4 py-6 pb-28 sm:py-8 lg:pb-10">
      {androidDuel && <AndroidDuelTopbar title="Arène des savoirs" />}
      <section className="game-hero duel-hero mb-7 rounded-3xl p-5 sm:p-8">
        <div>
          <p className="game-eyebrow">{androidDuel ? <SwordIcon size={16} weight="fill" /> : '⚔️'} Arène 1 contre 1</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Entre dans l'arène</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)] sm:text-base">
            Choisis ton terrain, défie un camarade et fais grimper les compteurs avant la fin des 90 secondes.
          </p>
        </div>
        <div className="duel-hero__stats mt-5">
          <span className="game-kicker">{androidDuel && <SwordIcon size={14} weight="fill" />} {termines.length} joué{termines.length > 1 ? 's' : ''}</span>
          <span className="game-kicker">{androidDuel ? <TrophyIcon size={14} weight="fill" /> : '🏆'} {victoires} victoire{victoires > 1 ? 's' : ''}</span>
          <span className="game-kicker">{termines.length ? Math.round((victoires / termines.length) * 100) : 0}% de réussite</span>
        </div>
      </section>

      <MessageBar erreur={erreur} notice={notice} />

      <div className="duel-dashboard">
        <div className="min-w-0">
          {categorized.invitations.length > 0 && (
            <DuelSection title={androidDuel ? <><UsersThreeIcon size={18} weight="fill" /> Invitations reçues</> : '📨 Invitations reçues'} subtitle="Un adversaire t'attend dans l'arène.">
              {categorized.invitations.map((defi) => (
                <DuelListCard
                  key={defi.id}
                  defi={defi}
                  userId={profile.id}
                  actionLabel="Accepter"
                  busy={busy === `accept:${defi.id}`}
                  onAction={() => accepter(defi)}
                />
              ))}
            </DuelSection>
          )}

          {categorized.aJouer.length > 0 && (
            <DuelSection title={androidDuel ? <><SwordIcon size={18} weight="fill" /> À jouer</> : '🎮 À jouer'} subtitle="En direct ou maintenant contre la manche fantôme.">
              {categorized.aJouer.map((defi) => (
                <DuelListCard key={defi.id} defi={defi} userId={profile.id} actionLabel="Entrer" onAction={() => ouvrirDefi(defi)} />
              ))}
            </DuelSection>
          )}

          {categorized.attente.length > 0 && (
            <DuelSection title={androidDuel ? <><HourglassIcon size={18} weight="fill" /> En attente</> : '⏳ En attente'} subtitle="Le résultat sera calculé dès que l'autre manche sera terminée.">
              {categorized.attente.map((defi) => (
                <DuelListCard key={defi.id} defi={defi} userId={profile.id} waiting onAction={() => ouvrirDefi(defi)} />
              ))}
            </DuelSection>
          )}

          <ChallengeBuilder
            suggestions={suggestions}
            opponentQuery={opponentQuery}
            onOpponentQueryChange={setOpponentQuery}
            searchResults={searchResults}
            searchLoading={searchLoading}
            searchError={searchError}
            matieres={matieres}
            matiereId={matiereId}
            onMatiereChange={setMatiereId}
            catalogue={catalogue}
            catalogueLoading={catalogueLoading}
            chapitreIds={chapitreIds}
            onToggleChapitre={toggleChapitre}
            onClearChapitres={() => setChapitreIds([])}
            busy={busy}
            onChallenge={creerDefi}
          />
        </div>

        <aside className="min-w-0">
          <DuelSection title={androidDuel ? <><TrophyIcon size={18} weight="fill" /> Historique</> : '📜 Historique'} subtitle="Tes derniers résultats.">
            {categorized.historique.length === 0 ? (
              <EmptyState icon={androidDuel ? <ShieldCheckeredIcon size={28} weight="duotone" /> : '🏟️'} title="L'arène t'attend" text="Ton premier résultat apparaîtra ici." />
            ) : (
              categorized.historique.slice(0, 12).map((defi) => (
                <HistoryCard key={defi.id} defi={defi} userId={profile.id} onOpen={() => {
                  setActiveDefi(defi)
                  setDuelState(defi)
                  setScreen('result')
                }} />
              ))
            )}
          </DuelSection>
        </aside>
      </div>
    </main>
  )
}

const ANDROID_DUEL_PREVIEW_STATE = {
  id: 'preview-duel',
  statut: 'termine',
  matiere_nom: 'Mathématiques',
  duration_seconds: 90,
  my_result: 'victoire',
  role: 'challenger',
  me: { id: 'preview-me', username: 'Aïcha', correctes: 4, incorrectes: 1, score: 420 },
  opponent: { id: 'preview-opponent', username: 'Moussa', correctes: 3, incorrectes: 2, score: 310 },
}

const ANDROID_DUEL_PREVIEW_QUESTION = {
  id: 'preview-question',
  enonce: 'Une fonction continue sur [a,b] telle que f(a) et f(b) sont de signes opposés admet…',
  choix: [
    'Aucune racine sur ]a,b[',
    'Au moins une racine sur ]a,b[',
    'Exactement une racine',
    'Une infinité de racines',
  ],
}

function AndroidDuelPreview() {
  const mode = new URLSearchParams(window.location.search).get('android-duel-preview') || 'game'
  const [chapitreIds, setChapitreIds] = useState([])
  const [query, setQuery] = useState('')
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [answerFeedback, setAnswerFeedback] = useState(null)
  const sides = getSides(ANDROID_DUEL_PREVIEW_STATE, 'preview-me')
  const matieres = [{ id: 'maths', nom: 'Mathématiques', icone: '∑' }]
  const catalogue = [
    { id: 'limites', titre: 'Limites et continuité', question_count: 18, available: true },
    { id: 'probabilites', titre: 'Probabilités', question_count: 15, available: true },
    { id: 'derivabilite', titre: 'Dérivabilité', question_count: 12, available: true },
    { id: 'logarithmes', titre: 'Fonctions logarithmes', question_count: 9, available: true },
  ]
  const suggestions = [
    { id: 'preview-opponent', username: 'Moussa' },
    { id: 'preview-opponent-2', username: 'Davy' },
  ]

  useEffect(() => {
    document.documentElement.classList.add('is-android-duel')
    return () => document.documentElement.classList.remove('is-android-duel')
  }, [])

  if (mode === 'lobby') {
    return <LobbyScreen state={ANDROID_DUEL_PREVIEW_STATE} sides={sides} busy="" erreur="" onReady={() => {}} onPlayNow={() => {}} onBack={() => {}} />
  }

  if (mode === 'result') {
    return <ResultScreen state={ANDROID_DUEL_PREVIEW_STATE} sides={sides} userId="preview-me" onBack={() => {}} />
  }

  if (mode === 'home') {
    return (
      <main className="game-page duel-home mx-auto max-w-5xl px-4 py-6 pb-28">
        <AndroidDuelTopbar title="Arène des savoirs" />
        <section className="game-hero duel-hero mb-7 rounded-3xl p-5">
          <div>
            <p className="game-eyebrow"><SwordIcon size={16} weight="fill" /> Arène 1 contre 1</p>
            <h1 className="mt-2 text-3xl font-black">Entre dans l'arène</h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">Choisis ton terrain, défie un camarade et domine le chrono.</p>
          </div>
          <div className="duel-hero__stats mt-5">
            <span className="game-kicker">8 joués</span><span className="game-kicker">5 victoires</span><span className="game-kicker">63% de réussite</span>
          </div>
        </section>
        <ChallengeBuilder
          suggestions={suggestions}
          opponentQuery={query}
          onOpponentQueryChange={setQuery}
          searchResults={suggestions.filter((item) => item.username.toLowerCase().includes(query.toLowerCase()))}
          searchLoading={false}
          searchError=""
          matieres={matieres}
          matiereId="maths"
          onMatiereChange={() => {}}
          catalogue={catalogue}
          catalogueLoading={false}
          chapitreIds={chapitreIds}
          onToggleChapitre={(id) => setChapitreIds((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length < 3 ? [...current, id] : current)}
          onClearChapitres={() => setChapitreIds([])}
          busy=""
          onChallenge={() => {}}
        />
      </main>
    )
  }

  return (
    <GameScreen
      state={ANDROID_DUEL_PREVIEW_STATE}
      sides={sides}
      game={{ questions: [ANDROID_DUEL_PREVIEW_QUESTION, ANDROID_DUEL_PREVIEW_QUESTION, ANDROID_DUEL_PREVIEW_QUESTION], index: 0 }}
      remaining={48}
      now={Date.now()}
      selectedChoice={selectedChoice}
      answerFeedback={answerFeedback}
      busy=""
      erreur=""
      onChoose={setSelectedChoice}
      onValidate={() => setAnswerFeedback({ correct: selectedChoice === 'Au moins une racine sur ]a,b[' })}
      onNext={() => { setSelectedChoice(null); setAnswerFeedback(null) }}
    />
  )
}

function AndroidDuelTopbar({ title }) {
  const target = isAndroidDuelPreview() ? '/dashboard?android-preview=1' : '/dashboard'
  return (
    <header className="android-duel-topbar">
      <Link to={target} className="android-duel-topbar__home" aria-label="Retour au campus">
        <HouseIcon size={22} weight="fill" />
      </Link>
      <span><ShieldCheckeredIcon size={18} weight="fill" /> {title}</span>
      <span className="android-duel-topbar__rank">Ligue I</span>
    </header>
  )
}

function categorizeDefis(defis, userId) {
  const result = { invitations: [], aJouer: [], attente: [], historique: [] }
  defis.forEach((defi) => {
    const status = normalizeStatus(defi.statut)
    const sides = getSides(defi, userId)
    const isRecipient = firstDefined(defi.adversaire_id, sideProfile(defi, 'adversaire').id) === userId
    const accepted = Boolean(firstDefined(defi.accepted_at, defi.accepte_at, defi.accepte, status !== 'en_attente' ? true : undefined, false))
    if (defi._bucket === 'historique' || FINISHED_STATUSES.has(status)) result.historique.push(defi)
    else if (defi._bucket === 'invitation' || (isRecipient && !accepted && !sides.myStats.finished)) result.invitations.push(defi)
    else if (defi._bucket === 'attente' || sides.myStats.finished) result.attente.push(defi)
    else result.aJouer.push(defi)
  })
  return result
}

function ChallengeBuilder({ suggestions, opponentQuery, onOpponentQueryChange, searchResults, searchLoading, searchError, matieres, matiereId, onMatiereChange, catalogue, catalogueLoading, chapitreIds, onToggleChapitre, onClearChapitres, busy, onChallenge }) {
  const androidMode = isAndroidDuelExperience()
  const selectedMatiere = matieres.find((matiere) => matiere.id === matiereId)
  const availableCount = catalogue.filter(chapterIsAvailable).length
  const normalizedQuery = opponentQuery.trim()
  const isSearching = normalizedQuery.length >= 2
  const opponents = isSearching ? searchResults : suggestions
  return (
    <section className="duel-builder mb-7 rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="game-eyebrow">Nouvelle partie</p>
          <h2 className="mt-1 text-xl font-black">Choisis ton terrain</h2>
        </div>
        <span className="duel-builder__step">1 → 2 → Duel</span>
      </div>

      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]" htmlFor="duel-matiere">1. Matière</label>
      <select id="duel-matiere" value={matiereId} onChange={(event) => onMatiereChange(event.target.value)} className="input mb-5">
        {matieres.map((matiere) => <option key={matiere.id} value={matiere.id}>{matiere.icone} {matiere.nom}</option>)}
      </select>

      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">2. Leçons</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">0 à 3 leçons · {chapitreIds.length}/3 sélectionnée{chapitreIds.length > 1 ? 's' : ''} · {availableCount}/{catalogue.length} disponible{availableCount > 1 ? 's' : ''}</p>
        </div>
        <span className="game-kicker">{selectedMatiere?.icone} {selectedMatiere?.nom}</span>
      </div>

      <div className="duel-lesson-grid" aria-label="Leçons du duel">
        <button
          type="button"
          className={`duel-lesson-chip ${chapitreIds.length === 0 && availableCount > 0 ? 'is-selected' : ''} ${availableCount === 0 && !catalogueLoading ? 'is-unavailable' : ''}`}
          disabled={catalogueLoading || availableCount === 0}
          onClick={onClearChapitres}
        >
          <span className="duel-lesson-chip__icon">{androidMode ? (availableCount > 0 ? <DiceFiveIcon size={22} weight="fill" /> : <LockIcon size={22} weight="fill" />) : availableCount > 0 ? '🎲' : '🔒'}</span>
          <span><strong>Aléatoire</strong><small>{availableCount > 0 ? "Jusqu'à 3 leçons disponibles tirées au sort" : 'Aucune leçon jouable actuellement'}</small></span>
        </button>
        {catalogueLoading ? (
          <span className="duel-inline-loader">Chargement des leçons…</span>
        ) : catalogue.map((chapitre) => {
          const id = firstDefined(chapitre.id, chapitre.chapitre_id)
          const selected = chapitreIds.includes(id)
          const title = firstDefined(chapitre.titre, chapitre.nom, chapitre.chapitre_nom, 'Leçon')
          const count = chapterQuestionCount(chapitre)
          const available = chapterIsAvailable(chapitre)
          const unavailableReason = firstDefined(chapitre.unavailable_reason, 'Aucun QCM compatible publié pour cette leçon')
          return (
            <button
              type="button"
              key={id}
              className={`duel-lesson-chip ${selected ? 'is-selected' : ''} ${available ? '' : 'is-unavailable'}`}
              aria-pressed={selected}
              aria-disabled={!available}
              disabled={!available}
              title={!available ? unavailableReason : undefined}
              onClick={() => onToggleChapitre(id)}
            >
              <span className="duel-lesson-chip__icon">{androidMode ? (selected ? <CheckCircleIcon size={22} weight="fill" /> : available ? <BookOpenIcon size={22} weight="fill" /> : <LockIcon size={22} weight="fill" />) : selected ? '✓' : available ? '📖' : '🔒'}</span>
              <span>
                <strong>{title}</strong>
                <small className={!available ? 'duel-lesson-chip__reason' : ''}>
                  {available ? `${count} question${count > 1 ? 's' : ''}` : unavailableReason}
                </small>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">3. Adversaire</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Suggestions limitées ou recherche dans ta classe.</p>
          </div>
          {!isSearching && suggestions.length > 0 && <span className="game-kicker">{suggestions.length} suggestion{suggestions.length > 1 ? 's' : ''}</span>}
        </div>
        <label className="duel-opponent-search" htmlFor="duel-opponent-query">
          <span aria-hidden="true">{androidMode ? <MagnifyingGlassIcon size={20} weight="bold" /> : '⌕'}</span>
          <input
            id="duel-opponent-query"
            type="search"
            value={opponentQuery}
            onChange={(event) => onOpponentQueryChange(event.target.value)}
            maxLength={50}
            autoComplete="off"
            placeholder="Rechercher un nom d'utilisateur…"
            aria-describedby="duel-opponent-search-help"
          />
          {searchLoading && <i aria-label="Recherche en cours" />}
        </label>
        <p id="duel-opponent-search-help" className="mb-3 mt-1 text-[.68rem] text-[var(--text-muted)]">
          {normalizedQuery.length === 1 ? 'Ajoute encore un caractère pour lancer la recherche.' : isSearching ? 'Résultats correspondant à ta recherche.' : 'Aucune liste complète de la classe n’est chargée.'}
        </p>
        {searchError && <p role="alert" className="mb-3 text-xs text-[var(--danger-text)]">{searchError}</p>}
        <div className="duel-opponents">
          {opponents.map((camarade) => (
            <div key={camarade.id} className="duel-opponent-card">
              <span className="flex min-w-0 items-center gap-3">
                <Avatar userId={camarade.id} avatarUrl={camarade.avatar_url} username={camarade.username} size="h-10 w-10" ring />
                <span className="min-w-0">
                  <strong className="block truncate text-sm">{camarade.username}</strong>
                  <PresenceLabel userId={camarade.id} />
                </span>
              </span>
              <Button
                variant="secondary"
                className="shrink-0"
                disabled={!matiereId || availableCount === 0 || Boolean(busy)}
                onClick={() => onChallenge(camarade.id)}
              >
                {busy === `create:${camarade.id}` ? 'Création…' : androidMode ? <><SwordIcon size={18} weight="fill" /> Défier</> : 'Défier ⚔️'}
              </Button>
            </div>
          ))}
          {!searchLoading && opponents.length === 0 && (
            <EmptyState
              icon={androidMode ? (isSearching ? <MagnifyingGlassIcon size={28} weight="duotone" /> : <UsersThreeIcon size={28} weight="duotone" />) : isSearching ? '🔎' : '👥'}
              title={isSearching ? 'Aucun résultat' : 'Aucune suggestion disponible'}
              text={isSearching ? 'Essaie une autre partie du nom.' : "Utilise la recherche pour trouver un élève approuvé de ta classe."}
            />
          )}
        </div>
      </div>
    </section>
  )
}

function DuelSection({ title, subtitle, children }) {
  return (
    <section className="mb-7">
      <div className="mb-3">
        <h2 className="text-base font-black">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{subtitle}</p>}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}

function DuelListCard({ defi, userId, actionLabel, busy = false, waiting = false, onAction }) {
  const androidMode = isAndroidDuelExperience()
  const sides = getSides(defi, userId)
  const matiere = firstDefined(defi.matiere_nom, defi.matiere?.nom, 'Duel')
  const lessonCount = Number(firstDefined(defi.chapitre_count, defi.nb_chapitres, asArray(defi.chapitres).length, 0))
  return (
    <Card variant="interactive" className="duel-list-card flex items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-3">
        <Avatar {...sides.opponent} userId={sides.opponent.id} avatarUrl={sides.opponent.avatar_url} size="h-10 w-10" />
        <span className="min-w-0">
          <strong className="block truncate text-sm">{sides.opponent.username}</strong>
          <span className="block truncate text-xs text-[var(--text-muted)]">{matiere} · {lessonCount ? `${lessonCount} leçon${lessonCount > 1 ? 's' : ''}` : 'sélection aléatoire'}</span>
        </span>
      </span>
      {waiting ? (
        <button type="button" onClick={onAction} className="duel-waiting-pill">{androidMode ? <GhostIcon size={16} weight="fill" /> : '👻'} Manche envoyée</button>
      ) : (
        <Button className="shrink-0" variant="secondary" disabled={busy} onClick={onAction}>{busy ? 'Ouverture…' : actionLabel}</Button>
      )}
    </Card>
  )
}

function HistoryCard({ defi, userId, onOpen }) {
  const androidMode = isAndroidDuelExperience()
  const result = getResult(defi, userId)
  const sides = getSides(defi, userId)
  const label = {
    victoire: 'Victoire',
    defaite: 'Défaite',
    egalite: 'Égalité',
    refuse: 'Refusé',
    annule: 'Annulé',
    expire: 'Expiré',
  }[result] ?? 'Clos'
  const scored = ['victoire', 'defaite', 'egalite'].includes(result)
  return (
    <button type="button" className={`duel-history-card is-${result}`} onClick={onOpen}>
      <span>
        <strong>{androidMode ? result === 'victoire' ? <TrophyIcon size={17} weight="fill" /> : result === 'defaite' ? <HeartBreakIcon size={17} weight="fill" /> : result === 'egalite' ? <HandshakeIcon size={17} weight="fill" /> : <HourglassIcon size={17} weight="fill" /> : result === 'victoire' ? '🏆' : result === 'defaite' ? '💔' : result === 'egalite' ? '🤝' : '⌛'} {label}</strong>
        <small>contre {sides.opponent.username}</small>
      </span>
      <span className="font-mono text-sm">{scored ? `${sides.myStats.score} – ${sides.opponentStats.score}` : 'Sans points'}</span>
    </button>
  )
}

function LobbyScreen({ state, sides, busy, erreur, onReady, onPlayNow, onBack }) {
  const androidMode = isAndroidDuelExperience()
  const myReady = Boolean(firstDefined(state?.me?.ready_at, state?.moi_pret, state?.my_ready, state?.[`${sides.myRole}_ready`], false))
  const opponentReady = Boolean(firstDefined(state?.opponent?.ready_at, state?.adversaire_pret, state?.opponent_ready, state?.[`${sides.opponentRole}_ready`], false))
  const startsAt = firstDefined(state?.common_start_at, state?.start_at, state?.starts_at)
  const countdownSeconds = Number(firstDefined(
    state?.countdown_seconds,
    startsAt ? Math.max(0, Math.ceil((new Date(startsAt).getTime() - Date.now()) / 1000)) : 0,
  ))
  return (
    <main className="game-page duel-lobby mx-auto max-w-3xl px-4 py-6 pb-28 sm:py-10">
      {androidMode && <AndroidDuelTopbar title="Salon du duel" />}
      <button type="button" className="duel-back-button mb-5 text-sm text-[var(--text-muted)] hover:text-[var(--text)]" onClick={onBack}>{androidMode && <ArrowLeftIcon size={18} weight="bold" />} Retour aux duels</button>
      <Card className="duel-lobby-card overflow-hidden rounded-3xl p-5 sm:p-8" glow>
        <p className="game-eyebrow">Salon du duel</p>
        <h1 className="mt-2 text-center text-3xl font-black">Face-à-face</h1>
        <p className="mt-2 text-center text-sm text-[var(--text-muted)]">Jouez ensemble, ou lance ta manche maintenant : elle deviendra le fantôme de ton adversaire.</p>
        <div className="duel-versus mt-8">
          <LobbyPlayer player={sides.me} label="Toi" ready={myReady} accent="player" />
          <span className="duel-versus__mark">VS</span>
          <LobbyPlayer player={sides.opponent} label="Adversaire" ready={opponentReady} accent="opponent" />
        </div>
        {countdownSeconds > 0 && (
          <div className="duel-countdown" role="timer" aria-live="assertive">
            <small>Le duel commence dans</small>
            <strong key={countdownSeconds}>{countdownSeconds}</strong>
          </div>
        )}
        {erreur && <MessageBar erreur={erreur} />}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button className="w-full" disabled={Boolean(busy) || myReady} onClick={onReady}>{myReady ? <><CheckCircleIcon size={19} weight="fill" /> Prêt — attente adversaire</> : busy === 'ready' ? 'Connexion…' : 'Je suis prêt'}</Button>
          <Button variant="secondary" className="w-full" disabled={Boolean(busy)} onClick={onPlayNow}>{busy === 'play-now' ? 'Lancement…' : androidMode ? <><GhostIcon size={19} weight="fill" /> Jouer sans attendre</> : 'Jouer sans attendre 👻'}</Button>
        </div>
        <div className="duel-ghost-note mt-5">
          <span>{androidMode ? <GhostIcon size={26} weight="duotone" /> : '👻'}</span>
          <p><strong>Mode fantôme</strong><br />Si l'autre joueur est absent, ses compteurs reproduiront ta manche lorsqu'il jouera plus tard. Le défi expire après 48 h.</p>
        </div>
      </Card>
    </main>
  )
}

function LobbyPlayer({ player, label, ready, accent }) {
  const androidMode = isAndroidDuelExperience()
  return (
    <div className={`duel-lobby-player is-${accent}`}>
      <Avatar userId={player.id} username={player.username} avatarUrl={player.avatar_url} size="h-20 w-20" ring />
      <strong className="mt-3 block truncate">{player.username}</strong>
      <small>{label}</small>
      <span className={`duel-ready-badge ${ready ? 'is-ready' : ''}`}>{ready && androidMode && <CheckCircleIcon size={14} weight="fill" />}{ready ? ' Prêt' : 'En attente'}</span>
    </div>
  )
}

function GameScreen({ state, sides, game, remaining, now, selectedChoice, answerFeedback, busy, erreur, onChoose, onValidate, onNext }) {
  const androidMode = isAndroidDuelExperience()
  const question = game.questions[game.index]
  const duration = Number(firstDefined(state.duration_seconds, state.duree_secondes, state.duree_sec, DUEL_DURATION_SECONDS))
  const progress = Math.max(0, Math.min(1, remaining / Math.max(1, duration)))
  const answered = Boolean(answerFeedback)
  const replayedSides = replayGhostStats(state, sides, now)
  return (
    <main className="game-page duel-game mx-auto max-w-3xl px-3 py-3 pb-28 sm:px-5 sm:py-6">
      {androidMode && <AndroidDuelTopbar title="Combat en cours" />}
      <Scoreboard sides={replayedSides} remaining={remaining} progress={progress} />

      <div className="mb-3 flex items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
        <span>Question {game.index + 1} / {game.questions.length}</span>
        <span>{firstDefined(state.matiere_nom, state.matiere?.nom, 'Duel')}</span>
      </div>
      <div className="game-progress mb-4 h-1.5"><span style={{ width: `${((game.index + (answered ? 1 : 0)) / game.questions.length) * 100}%` }} /></div>

      <Card className="duel-question-card rounded-3xl p-4 sm:p-6">
        <MathMarkdown className="duel-question-text text-lg font-semibold sm:text-xl">{firstDefined(question.enonce, question.question, '')}</MathMarkdown>
        {question.image_url && <img className="duel-question-image" src={question.image_url} alt="Illustration de la question" />}
        <div className="mt-6 flex flex-col gap-3">
          {questionChoices(question).map((choice, index) => {
            const value = choiceValue(choice)
            const selected = selectedChoice === value
            const resultClass = selected && answered
              ? answerFeedback.correct === true ? 'is-correct' : answerFeedback.correct === false ? 'is-wrong' : 'is-recorded'
              : selected ? 'is-selected' : ''
            return (
              <button
                type="button"
                key={`${String(value)}-${index}`}
                className={`duel-answer ${resultClass}`}
                disabled={answered || Boolean(busy)}
                onClick={() => onChoose(value)}
              >
                <span className="duel-answer__letter">{String.fromCharCode(65 + index)}</span>
                <MathMarkdown className="duel-answer__text">{choiceLabel(choice)}</MathMarkdown>
                {selected && answered && <span className="duel-answer__result">{androidMode ? (answerFeedback.correct === true ? <CheckCircleIcon size={22} weight="fill" /> : answerFeedback.correct === false ? <XCircleIcon size={22} weight="fill" /> : '•') : answerFeedback.correct === true ? '✓' : answerFeedback.correct === false ? '✕' : '•'}</span>}
              </button>
            )
          })}
        </div>
      </Card>

      <div aria-live="polite" className="mt-4 min-h-6 text-center text-sm font-bold">
        {answerFeedback?.correct === true && <span className="text-[var(--success-text)]">Bonne réponse ! Le compteur grimpe ⚡</span>}
        {answerFeedback?.correct === false && <span className="text-[var(--danger-text)]">Raté cette fois. Reste concentré !</span>}
        {answerFeedback && answerFeedback.correct === null && <span className="text-[var(--accent-text)]">Réponse enregistrée par l'arbitre.</span>}
        {erreur && <span className="text-[var(--danger-text)]">{erreur}</span>}
      </div>

      <div className="mt-3 flex justify-end">
        {!answered ? (
          <Button className="min-w-40" disabled={selectedChoice === null || Boolean(busy)} onClick={onValidate}>{busy === 'answer' ? 'Arbitrage…' : 'Valider'}</Button>
        ) : (
          <Button className="min-w-40" disabled={Boolean(busy)} onClick={onNext}>{game.index === game.questions.length - 1 ? 'Terminer la manche' : 'Suivant →'}</Button>
        )}
      </div>
    </main>
  )
}

function Scoreboard({ sides, remaining, progress }) {
  return (
    <section className="duel-scoreboard mb-5" aria-label="Tableau des scores">
      <Fighter player={sides.me} stats={sides.myStats} label="Joueur" accent="player" />
      <div className={`duel-timer ${remaining <= 10 ? 'is-urgent' : ''}`} style={{ '--duel-time-progress': `${progress * 360}deg` }} aria-live="polite" aria-label={`${remaining} secondes restantes`}>
        {isAndroidDuelExperience() && <TimerIcon size={15} weight="fill" />}<span>{remaining}</span><small>SEC</small>
      </div>
      <Fighter player={sides.opponent} stats={sides.opponentStats} label="Adversaire" accent="opponent" reverse />
    </section>
  )
}

function Fighter({ player, stats, label, accent, reverse = false }) {
  const androidMode = isAndroidDuelExperience()
  return (
    <div className={`duel-fighter is-${accent} ${reverse ? 'is-reverse' : ''}`}>
      <Avatar userId={player.id} username={player.username} avatarUrl={player.avatar_url} size="h-10 w-10" showPresence={false} ring />
      <div className="duel-fighter__body">
        <small>{label}</small>
        <strong>{player.username}</strong>
        <div className="duel-fighter__track"><span /></div>
        <div className="duel-fighter__scores">
          <span title="Bonnes réponses">{androidMode ? <CheckCircleIcon size={15} weight="fill" /> : '✓'} <b>{stats.correct}</b></span>
          <span title="Mauvaises réponses">{androidMode ? <XCircleIcon size={15} weight="fill" /> : '✕'} <b>{stats.wrong}</b></span>
        </div>
      </div>
    </div>
  )
}

function WaitingScreen({ sides, state, onBack }) {
  const androidMode = isAndroidDuelExperience()
  return (
    <main className="game-page android-duel-waiting mx-auto max-w-xl px-4 py-10 pb-28 text-center">
      {androidMode && <AndroidDuelTopbar title="Manche terminée" />}
      <div className="duel-ghost-orbit mx-auto"><Avatar userId={sides.opponent.id} username={sides.opponent.username} avatarUrl={sides.opponent.avatar_url} size="h-20 w-20" ring /><span>{androidMode ? <GhostIcon size={34} weight="duotone" /> : '👻'}</span></div>
      <p className="game-eyebrow mt-7">Manche enregistrée</p>
      <h1 className="mt-2 text-3xl font-black">En attente de {sides.opponent.username}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">Ton adversaire dispose de 48 heures pour jouer. Tes compteurs formeront son fantôme, puis le résultat apparaîtra automatiquement.</p>
      <div className="mx-auto mt-7 grid max-w-sm grid-cols-3 gap-2">
        <StatTile icon={androidMode ? <CheckCircleIcon size={20} weight="fill" /> : '✓'} value={sides.myStats.correct} label="Bonnes" tone="good" />
        <StatTile icon={androidMode ? <XCircleIcon size={20} weight="fill" /> : '✕'} value={sides.myStats.wrong} label="Erreurs" tone="bad" />
        <StatTile icon={androidMode ? <TrophyIcon size={20} weight="fill" /> : '⚡'} value={sides.myStats.score} label="Points" />
      </div>
      {state.expires_at && <p className="mt-5 text-xs text-[var(--text-muted)]">Expiration : {new Date(state.expires_at).toLocaleString('fr-FR')}</p>}
      <Button className="mt-8" variant="secondary" onClick={onBack}>Retour aux duels</Button>
    </main>
  )
}

function getResult(state, userId) {
  const explicit = normalizeStatus(firstDefined(state?.resultat?.issue, state?.resultat_final?.issue, state?.resultat_final, state?.my_result))
  if (explicit.includes('victoire') || explicit === 'gagne') return 'victoire'
  if (explicit.includes('defaite') || explicit === 'perdu') return 'defaite'
  if (explicit.includes('egalite') || explicit === 'nul') return 'egalite'
  const status = normalizeStatus(state?.statut)
  if (status.startsWith('expire')) return 'expire'
  if (status.startsWith('refuse')) return 'refuse'
  if (status.startsWith('annule')) return 'annule'
  if (state?.gagnant_id === userId) return 'victoire'
  if (state?.gagnant_id) return 'defaite'
  if (status.startsWith('term')) return 'egalite'
  return 'attente'
}

function ResultScreen({ state, sides, userId, onBack }) {
  const androidMode = isAndroidDuelExperience()
  const result = getResult(state, userId)
  const contents = {
    victoire: { icon: '🏆', title: 'Victoire !', text: "Tu remportes l'affrontement.", tone: 'victory' },
    defaite: { icon: '💥', title: 'Défaite', text: "L'adversaire remporte cette manche.", tone: 'defeat' },
    egalite: { icon: '🤝', title: 'Égalité', text: 'Vous avez livré un duel parfaitement équilibré.', tone: 'draw' },
    expire: { icon: '⌛', title: 'Défi expiré', text: "L'adversaire n'a pas joué dans les 48 heures. Aucun point n'est attribué.", tone: 'closed' },
    refuse: { icon: '🛡️', title: 'Défi refusé', text: 'Ce duel est clos sans modifier les scores.', tone: 'closed' },
    annule: { icon: '🚫', title: 'Défi annulé', text: 'Ce duel est clos sans modifier les scores.', tone: 'closed' },
  }
  const content = contents[result] ?? contents.expire
  const androidResultIcon = {
    victoire: <TrophyIcon size={58} weight="duotone" />,
    defaite: <HeartBreakIcon size={58} weight="duotone" />,
    egalite: <HandshakeIcon size={58} weight="duotone" />,
    expire: <HourglassIcon size={58} weight="duotone" />,
    refuse: <ShieldCheckeredIcon size={58} weight="duotone" />,
    annule: <XCircleIcon size={58} weight="duotone" />,
  }[result]
  const scored = ['victoire', 'defaite', 'egalite'].includes(result)
  return (
    <main className="game-page android-duel-result mx-auto max-w-2xl px-4 py-8 pb-28 sm:py-12">
      {androidMode && <AndroidDuelTopbar title="Résultat du duel" />}
      <Card className={`duel-result is-${content.tone} overflow-hidden rounded-3xl p-5 text-center sm:p-9`}>
        <span className="duel-result__icon">{androidMode ? androidResultIcon : content.icon}</span>
        <p className="game-eyebrow mt-4">Résultat final</p>
        <h1 className="mt-2 text-4xl font-black">{content.title}</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">{content.text}</p>
        {scored && <div className="duel-final-score mt-7">
          <span><Avatar userId={sides.me.id} username={sides.me.username} avatarUrl={sides.me.avatar_url} size="h-10 w-10" showPresence={false} /><strong>{sides.myStats.score}</strong><small>Toi</small></span>
          <b>–</b>
          <span><Avatar userId={sides.opponent.id} username={sides.opponent.username} avatarUrl={sides.opponent.avatar_url} size="h-10 w-10" showPresence={false} /><strong>{sides.opponentStats.score}</strong><small>{sides.opponent.username}</small></span>
        </div>}
        {scored && <div className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile icon={androidMode ? <CheckCircleIcon size={20} weight="fill" /> : '✓'} value={sides.myStats.correct} label="Tes bonnes" tone="good" />
          <StatTile icon={androidMode ? <XCircleIcon size={20} weight="fill" /> : '✕'} value={sides.myStats.wrong} label="Tes erreurs" tone="bad" />
          <StatTile icon={androidMode ? <CheckCircleIcon size={20} weight="fill" /> : '✓'} value={sides.opponentStats.correct} label="Ses bonnes" tone="good" />
          <StatTile icon={androidMode ? <XCircleIcon size={20} weight="fill" /> : '✕'} value={sides.opponentStats.wrong} label="Ses erreurs" tone="bad" />
        </div>}
        <Button className="mt-8 w-full sm:w-auto" onClick={onBack}>Retour à l'arène</Button>
      </Card>
    </main>
  )
}

function StatTile({ icon, value, label, tone = '' }) {
  return <span className={`duel-stat-tile ${tone ? `is-${tone}` : ''}`}><i>{icon}</i><strong>{value}</strong><small>{label}</small></span>
}

function EmptyState({ icon, title, text }) {
  return <div className="duel-empty"><span>{icon}</span><strong>{title}</strong><p>{text}</p></div>
}

function MessageBar({ erreur, notice }) {
  if (!erreur && !notice) return null
  const androidMode = isAndroidDuelExperience()
  return <div role={erreur ? 'alert' : 'status'} className={`duel-message mb-5 ${erreur ? 'is-error' : 'is-notice'}`}>{androidMode ? erreur ? <XCircleIcon size={18} weight="fill" /> : <CheckCircleIcon size={18} weight="fill" /> : erreur ? '⚠️' : '✨'} {erreur || notice}</div>
}
