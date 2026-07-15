// Système de niveaux dérivé des points de carrière.
// Palier cumulatif pour atteindre le niveau n : chaque niveau coûte 100 + 50*(n-1) points.
// => seuils : Nv1=0, Nv2=100, Nv3=250, Nv4=450, Nv5=700, Nv6=1000, ...

const TITRES = [
  'Recrue', // 1
  'Apprenti', // 2
  'Initié', // 3
  'Assidu', // 4
  'Confirmé', // 5
  'Vétéran', // 6
  'Expert', // 7
  'Maître', // 8
  'Champion', // 9
  'Légende', // 10+
]

// Seuil cumulatif pour ATTEINDRE le niveau `level` (level >= 1)
function seuil(level) {
  const n = level - 1
  return 100 * n + 25 * n * (n - 1)
}

export function computeLevel(points = 0) {
  const p = Math.max(0, Math.floor(points || 0))

  let level = 1
  while (seuil(level + 1) <= p) level++

  const base = seuil(level)
  const next = seuil(level + 1)
  const dansLeNiveau = p - base
  const requisNiveau = next - base
  const pct = Math.max(0, Math.min(100, Math.round((dansLeNiveau / requisNiveau) * 100)))

  return {
    level,
    titre: TITRES[Math.min(level - 1, TITRES.length - 1)],
    points: p,
    dansLeNiveau, // XP acquise dans le niveau courant
    requisNiveau, // XP nécessaire pour passer au niveau suivant
    restant: requisNiveau - dansLeNiveau, // XP restante avant le prochain niveau
    pct, // progression 0-100 dans le niveau courant
  }
}
