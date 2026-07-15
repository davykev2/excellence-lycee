export function formatDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

// Chronomètre robuste au rechargement : calculé à partir de l'heure de fin théorique
// renvoyée par le serveur (start_tentative), pas d'un compte à rebours local naïf.
export function remainingSeconds(dateFinTheorique) {
  if (!dateFinTheorique) return null
  const fin = new Date(dateFinTheorique).getTime()
  return Math.max(0, Math.round((fin - Date.now()) / 1000))
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
