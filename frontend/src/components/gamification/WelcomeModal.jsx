import { useEffect, useState } from 'react'

// Modale de bienvenue affichée UNE seule fois (par utilisateur, via localStorage)
// à la première connexion. But : accrocher l'utilisateur avec les mécaniques de jeu.

const ETAPES = [
  {
    emoji: '🎯',
    titre: 'Bienvenue dans l’arène',
    texte: 'Chaque quiz réussi te rapporte des points de carrière et te fait grimper de niveau. Plus tu t’entraînes, plus tu montes.',
    accent: 'var(--neon-cyan)',
  },
  {
    emoji: '🔥',
    titre: 'Garde ta série',
    texte: 'Enchaîne les bonnes réponses en Quiz rapide pour faire exploser ton streak et décrocher des badges rares.',
    accent: 'var(--neon-magenta)',
  },
  {
    emoji: '⚔️',
    titre: 'Défie les autres',
    texte: 'Grimpe au classement de ta classe, provoque tes camarades en duel 1v1 et prouve qui est le meilleur.',
    accent: 'var(--neon-violet)',
  },
  {
    emoji: '🏅',
    titre: 'Collectionne les badges',
    texte: '17 badges à débloquer : performance, assiduité, compétition… Combien vas-tu en obtenir cette saison ?',
    accent: 'var(--neon-green)',
  },
]

export default function WelcomeModal({ userId, username }) {
  const [open, setOpen] = useState(false)
  const [etape, setEtape] = useState(0)

  useEffect(() => {
    if (!userId) return
    const cle = `welcome_seen_${userId}`
    if (!localStorage.getItem(cle)) {
      // petit délai pour laisser le dashboard se peindre derrière
      const t = setTimeout(() => setOpen(true), 350)
      return () => clearTimeout(t)
    }
  }, [userId])

  function fermer() {
    if (userId) localStorage.setItem(`welcome_seen_${userId}`, '1')
    setOpen(false)
  }

  if (!open) return null

  const e = ETAPES[etape]
  const derniere = etape === ETAPES.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm anim-fade-in" onClick={fermer}>
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 text-center anim-pop"
        style={{ boxShadow: `0 0 40px ${e.accent}55` }}
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 blur-3xl" style={{ background: `radial-gradient(circle, ${e.accent}44, transparent 70%)` }} />

        <div className="relative">
          <div key={etape} className="anim-pop mx-auto mb-4 grid h-20 w-20 place-items-center rounded-2xl text-5xl"
            style={{ background: `color-mix(in srgb, ${e.accent} 15%, transparent)`, boxShadow: `0 0 24px ${e.accent}66` }}>
            {e.emoji}
          </div>

          {etape === 0 && (
            <p className="mb-1 text-sm font-semibold tracking-widest" style={{ color: e.accent }}>
              SALUT {username?.toUpperCase()} 👋
            </p>
          )}
          <h2 className="mb-2 text-xl font-extrabold">{e.titre}</h2>
          <p className="mx-auto mb-6 max-w-xs text-sm text-[var(--text-muted)]">{e.texte}</p>

          <div className="mb-5 flex justify-center gap-1.5">
            {ETAPES.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === etape ? '1.5rem' : '0.375rem',
                  background: i === etape ? e.accent : 'var(--border)',
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button onClick={fermer} className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer">
              Passer
            </button>
            <button
              onClick={() => (derniere ? fermer() : setEtape((s) => s + 1))}
              className="rounded-full px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110 cursor-pointer"
              style={{ background: e.accent, boxShadow: `0 0 16px ${e.accent}88` }}
            >
              {derniere ? "C'est parti 🚀" : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
