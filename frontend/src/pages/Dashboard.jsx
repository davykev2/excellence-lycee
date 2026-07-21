import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import { computeLevel } from '../lib/level'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import Avatar from '../components/ui/Avatar'
import CountUp from '../components/ui/CountUp'
import WelcomeModal from '../components/gamification/WelcomeModal'
import DailyMissions from '../components/gamification/DailyMissions'

export default function Dashboard() {
  const navigate = useNavigate()
  const profile = useAuthStore((s) => s.profile)
  const profileId = profile?.id
  const profileSerieId = profile?.serie_id
  const profileNiveauId = profile?.niveau_id
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profileId) return
    let cancelled = false

    async function load() {
      setLoading(true)
      const uid = profileId
      const serieId = profileSerieId
      const niveauId = profileNiveauId
      const empty = Promise.resolve({ data: [] })

      // Requêtes indépendantes
      const [statsRes, matieresRes, badgesTotalRes, myBadgesRes, tentativesRes, chapitresRes, classeRes, rapideRes, streakRes] =
        await Promise.all([
          supabase.rpc('get_stats_globales'),
          serieId
            ? supabase.from('matieres_series').select('matieres(id, nom, icone, ordre)').eq('serie_id', serieId)
            : empty,
          supabase.from('badges').select('id', { count: 'exact', head: true }),
          supabase.from('user_badges').select('id', { count: 'exact', head: true }).eq('user_id', uid),
          supabase.from('tentatives').select('quiz_id, note').eq('user_id', uid).eq('statut', 'terminee'),
          serieId ? supabase.from('chapitres').select('id').eq('serie_id', serieId).eq('published', true) : empty,
          niveauId && serieId
            ? supabase.rpc('get_classement_classe', { p_niveau_id: niveauId, p_serie_id: serieId })
            : empty,
          supabase.rpc('get_classement_quiz_rapide'),
          supabase.from('quiz_scores').select('streak_max').eq('user_id', uid),
        ])

      // Sujets disponibles pour la série (quiz publiés : chapitres + devoirs)
      const chapIds = (chapitresRes.data ?? []).map((c) => c.id)
      const [chapQuizRes, devoirQuizRes] = await Promise.all([
        chapIds.length
          ? supabase.from('quiz').select('id').in('chapitre_id', chapIds).eq('published', true)
          : empty,
        serieId
          ? supabase.from('quiz').select('id').eq('serie_id', serieId).eq('type', 'devoir').eq('published', true)
          : empty,
      ])
      const totalSujets = (chapQuizRes.data?.length ?? 0) + (devoirQuizRes.data?.length ?? 0)

      // Sujets traités + meilleure note par quiz (comme le classement)
      const bestByQuiz = {}
      for (const t of tentativesRes.data ?? []) {
        if (t.note == null) continue
        bestByQuiz[t.quiz_id] = Math.max(bestByQuiz[t.quiz_id] ?? 0, Number(t.note))
      }
      const completedQuizIds = Object.keys(bestByQuiz)
      const notesValidees = Object.values(bestByQuiz).filter((note) => note >= 12).length

      // Points par matière (somme des meilleures notes × 2)
      const matieresList = (matieresRes.data ?? []).map((r) => r.matieres).filter(Boolean)
      let pointsParMatiere = []
      if (completedQuizIds.length) {
        const { data: qmap } = await supabase
          .from('quiz')
          .select('id, matiere_id, chapitre_id, chapitres(matiere_id)')
          .in('id', completedQuizIds)
        const pointsByMat = {}
        for (const q of qmap ?? []) {
          const matId = q.matiere_id ?? q.chapitres?.matiere_id
          if (!matId) continue
          pointsByMat[matId] = (pointsByMat[matId] ?? 0) + bestByQuiz[q.id] * 2
        }
        pointsParMatiere = matieresList
          .map((m) => ({ id: m.id, nom: m.nom, icone: m.icone, points: Math.round(pointsByMat[m.id] ?? 0) }))
          .filter((m) => m.points > 0)
          .sort((a, b) => b.points - a.points)
      }

      // Rang dans la classe + meilleure série (streak)
      const classe = classeRes.data ?? []
      const monRang = classe.findIndex((r) => r.user_id === uid)
      const streakMax = (streakRes.data ?? []).reduce((m, r) => Math.max(m, r.streak_max ?? 0), 0)

      if (cancelled) return
      setData({
        stats: statsRes.data ?? {},
        totalSujets,
        sujetsTraites: Math.min(completedQuizIds.length, totalSujets || completedQuizIds.length),
        totalBadges: badgesTotalRes.count ?? 0,
        myBadges: myBadgesRes.count ?? 0,
        pointsParMatiere,
        classeTop: classe.slice(0, 3),
        rapide: (rapideRes.data ?? []).slice(0, 3),
        rang: monRang >= 0 ? monRang + 1 : null,
        nbClasse: classe.length,
        streakMax,
        notesValidees,
      })
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [profileId, profileSerieId, profileNiveauId])

  if (!profile) return <Loader />

  const lvl = computeLevel(profile.points_carriere)
  const missions = data ? [
    {
      id: 'sujets',
      title: 'Maîtriser les sujets disponibles',
      description: 'Atteins au moins 12/20 pour valider chaque étape.',
      icon: '🎯',
      current: data.notesValidees,
      target: Math.max(1, data.totalSujets),
      completed: data.totalSujets > 0 && data.notesValidees >= data.totalSujets,
      href: '/exercices',
    },
    {
      id: 'badges',
      title: 'Faire grandir ta collection',
      description: 'Chaque badge raconte une étape de ta progression.',
      icon: '🎖️',
      current: data.myBadges,
      target: Math.max(1, data.totalBadges),
      completed: data.totalBadges > 0 && data.myBadges >= data.totalBadges,
      href: '/badges',
    },
    {
      id: 'combo',
      title: 'Atteindre un combo de 5',
      description: 'Enchaîne les bonnes réponses au quiz éclair.',
      icon: '🔥',
      current: Math.min(5, data.streakMax),
      target: 5,
      completed: data.streakMax >= 5,
      href: '/quiz-rapide',
    },
  ] : []

  return (
    <div className="game-page mx-auto max-w-5xl px-4 py-8">
      <WelcomeModal userId={profile.id} username={profile.username} />

      {/* Hero gamifié : niveau, XP, rang, série */}
      <section className="anim-rise relative mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
        <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-[var(--neon-violet)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-[var(--neon-cyan)]/10 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar profile={profile} size="h-16 w-16" forceOnline ring />

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold sm:text-2xl">
              Bonjour <span className="neon-text">{profile.username}</span> 👋
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span
                className="rounded-full border border-[var(--neon-violet)] bg-[var(--neon-violet)]/15 px-2.5 py-1 font-semibold text-[var(--neon-violet)]"
                title={`${lvl.dansLeNiveau} / ${lvl.requisNiveau} XP`}
              >
                Niveau {lvl.level} · {lvl.titre}
              </span>
              {data?.rang && (
                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--text-muted)]">
                  🏆 #{data.rang} <span className="opacity-70">/ {data.nbClasse}</span>
                </span>
              )}
              <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--text-muted)]">
                🔥 Combo max {data?.streakMax ?? 0}
              </span>
            </div>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <p className="text-2xl font-extrabold text-[var(--neon-cyan)]" style={{ textShadow: 'var(--glow-cyan)' }}>
              <CountUp value={profile.points_carriere} />
            </p>
            <p className="text-xs text-[var(--text-muted)]">points carrière</p>
          </div>
        </div>

        {/* Barre d'XP vers le niveau suivant */}
        <div className="relative mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-medium text-[var(--text)]">Niveau {lvl.level}</span>
            <span>
              {lvl.restant > 0 ? `Encore ${lvl.restant} XP → Niveau ${lvl.level + 1}` : 'Niveau max atteint 🎉'}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${lvl.pct}%`,
                background: 'linear-gradient(90deg, var(--neon-violet), var(--neon-cyan))',
                boxShadow: '0 0 10px var(--neon-cyan)',
              }}
            />
          </div>
        </div>
      </section>

      {!profile.approuve && (
        <Card className="mb-6 border-[var(--neon-violet)]">
          <p className="text-sm">
            🔒 Ton compte a été désapprouvé par l’administration. Certaines fonctions restent indisponibles ;
            contacte un administrateur si tu penses qu’il s’agit d’une erreur.
          </p>
        </Card>
      )}

      {loading || !data ? (
        <Loader />
      ) : (
        <>
          <section className="mb-6 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
            <Card variant="reward" className="flex min-h-52 flex-col justify-between p-5 sm:p-6">
              <div>
                <p className="game-eyebrow">⚡ Prochaine mission</p>
                <h2 className="mt-3 max-w-lg text-2xl font-black sm:text-3xl">
                  {data.sujetsTraites > 0 ? 'Pousse ton score encore plus haut' : 'Décroche tes premiers points'}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-[var(--text-muted)]">
                  {data.sujetsTraites > 0
                    ? 'Un quiz éclair suffit pour relancer ton rythme et travailler ton combo.'
                    : 'Commence par une session courte : une matière, quelques questions, un premier objectif.'}
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/quiz-rapide" className="game-button inline-flex min-h-11 items-center rounded-xl bg-[var(--neon-cyan)] px-5 py-2.5 text-sm font-black text-black shadow-[var(--glow-cyan)]">
                  Lancer le quiz éclair ⚡
                </Link>
                <Link to="/resumes" className="game-button inline-flex min-h-11 items-center rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold hover:border-[var(--neon-violet)]">
                  Réviser un résumé
                </Link>
              </div>
            </Card>

            <DailyMissions
              missions={missions}
              title="Objectifs de progression"
              subtitle="Des jalons réels calculés à partir de ton parcours."
              onMissionClick={(mission) => navigate(mission.href)}
              className="h-full"
            />
          </section>

          {/* Statistiques globales */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard icon="📄" value={data.totalSujets} label="Sujets disponibles" color="var(--neon-cyan)" />
            <StatCard icon="❓" value={data.stats?.nb_questions} label="Questions" color="var(--neon-violet)" />
            <StatCard icon="👥" value={data.stats?.nb_eleves} label="Utilisateurs" color="var(--neon-green)" />
            <StatCard icon="🏅" value={data.stats?.nb_quiz_joues} label="Tentatives réalisées" color="var(--neon-magenta)" />
          </div>

          {/* Ma progression */}
          <h2 className="mb-3 mt-10 text-xl font-bold">Ma progression</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="flex flex-col">
              <ProgressRow label="Sujets traités" value={data.sujetsTraites} total={data.totalSujets} color="var(--neon-cyan)" />
              <ProgressRow label="Badges obtenus" value={data.myBadges} total={data.totalBadges} color="var(--neon-magenta)" />
              <Link to="/badges" className="mt-auto pt-2 text-sm font-medium text-[var(--neon-cyan)] hover:underline">
                Voir mes badges →
              </Link>
            </Card>

            <Card className="flex flex-col">
              <h3 className="mb-3 text-sm font-semibold text-[var(--text-muted)]">Points par matière</h3>
              {data.pointsParMatiere.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">
                  Commence un quiz pour accumuler tes premiers points.
                </p>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {data.pointsParMatiere.map((m) => (
                    <li key={m.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{m.icone}</span>
                        {m.nom}
                      </span>
                      <span className="font-mono font-semibold text-[var(--neon-cyan)]">{m.points} pts</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link to="/classement" className="mt-auto pt-3 text-sm font-medium text-[var(--neon-cyan)] hover:underline">
                Voir le classement →
              </Link>
            </Card>
          </div>

          {/* Classements */}
          <h2 className="mb-3 mt-10 text-xl font-bold">Classements</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <LeaderboardCard title="Ma classe" icon="🏆" rows={data.classeTop} unit="pts" />
            <LeaderboardCard title="Quiz rapide" icon="⚡" rows={data.rapide} unit="pts" />
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="anim-rise flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 transition hover:-translate-y-0.5">
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
        style={{ background: `color-mix(in srgb, ${color} 15%, transparent)`, boxShadow: `0 0 12px ${color}33` }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xl font-extrabold leading-none" style={{ color, textShadow: `0 0 12px ${color}66` }}>
          <CountUp value={value ?? 0} />
        </p>
        <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  )
}

function ProgressRow({ label, value, total, color }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="font-mono font-semibold" style={{ color }}>
          {value} / {total}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  )
}

function LeaderboardCard({ title, icon, rows, unit }) {
  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-semibold text-[var(--neon-violet)]">
          <span>{icon}</span>
          {title}
        </h3>
        <Link to="/classement" className="text-xs text-[var(--text-muted)] hover:text-[var(--neon-cyan)]">
          Voir tout
        </Link>
      </div>
      {rows.length === 0 ? (
        <p className="py-3 text-sm text-[var(--text-muted)]">Aucune donnée pour l'instant.</p>
      ) : (
        <ol className="flex flex-col gap-2.5">
          {rows.map((r, i) => (
            <li key={r.user_id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-6 text-center">{['🥇', '🥈', '🥉'][i] ?? i + 1}</span>
                <Link to={`/profil/${r.user_id}`} className="flex items-center gap-2 hover:text-[var(--neon-cyan)]">
                  <Avatar userId={r.user_id} avatarUrl={r.avatar_url} username={r.username} size="h-7 w-7" />
                  <span className="max-w-[8rem] truncate">{r.username}</span>
                </Link>
              </span>
              <span className="font-mono font-semibold text-[var(--neon-cyan)]">
                {Math.round(Number(r.points))} {unit}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}
