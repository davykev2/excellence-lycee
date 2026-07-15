import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'

export default function Users() {
  const [users, setUsers] = useState([])
  const [niveaux, setNiveaux] = useState([])
  const [series, setSeries] = useState([])
  const [filtre, setFiltre] = useState('en_attente')
  const [recherche, setRecherche] = useState('')
  const [niveauFiltre, setNiveauFiltre] = useState('')
  const [serieFiltre, setSerieFiltre] = useState('')
  const [loading, setLoading] = useState(true)
  const [editionId, setEditionId] = useState(null)
  const [bulkDialog, setBulkDialog] = useState(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkError, setBulkError] = useState('')
  const [bulkFeedback, setBulkFeedback] = useState('')

  async function charger(showLoader = true) {
    if (showLoader) setLoading(true)
    const [{ data: us }, { data: nv }, { data: sr }] = await Promise.all([
      supabase.from('profiles').select('*, niveaux(nom), series(nom)').order('created_at', { ascending: false }),
      supabase.from('niveaux').select('*').order('ordre'),
      supabase.from('series').select('*').order('nom'),
    ])
    setUsers(us ?? [])
    setNiveaux(nv ?? [])
    setSeries(sr ?? [])
    setLoading(false)
  }

  useEffect(() => { charger() }, [])

  async function toggleApprouve(u) {
    await supabase.from('profiles').update({ approuve: !u.approuve }).eq('id', u.id)
    charger()
  }

  async function toggleAdmin(u) {
    await supabase.from('profiles').update({ is_admin: !u.is_admin }).eq('id', u.id)
    charger()
  }

  function demanderActionGroupee(approuve) {
    const count = users.filter((user) => !user.is_admin && user.approuve !== approuve).length
    setBulkError('')
    setBulkFeedback('')
    setBulkDialog({ approuve, count })
  }

  async function confirmerActionGroupee() {
    if (!bulkDialog || bulkLoading) return

    setBulkLoading(true)
    setBulkError('')
    const { data, error } = await supabase.rpc('set_approbation_utilisateurs_admin_v1', {
      p_approuve: bulkDialog.approuve,
    })

    if (error) {
      setBulkError(error.message || "L'action groupée n'a pas pu être appliquée.")
      setBulkLoading(false)
      return
    }

    const updatedCount = Number(data?.updated_count ?? 0)
    setBulkDialog(null)
    setBulkFeedback(
      bulkDialog.approuve
        ? `${updatedCount} compte${updatedCount > 1 ? 's' : ''} approuvé${updatedCount > 1 ? 's' : ''}.`
        : `${updatedCount} compte${updatedCount > 1 ? 's' : ''} désapprouvé${updatedCount > 1 ? 's' : ''}. Les administrateurs sont restés actifs.`,
    )
    await charger(false)
    setBulkLoading(false)
  }

  const filtres = users
    .filter((u) => (filtre === 'en_attente' ? !u.approuve : filtre === 'admins' ? u.is_admin : true))
    .filter((u) => !niveauFiltre || u.niveau_id === niveauFiltre)
    .filter((u) => !serieFiltre || u.serie_id === serieFiltre)
    .filter((u) => {
      const terme = recherche.trim().toLowerCase()
      if (!terme) return true
      return [u.username, u.etablissement, u.niveaux?.nom, u.series?.nom]
        .filter(Boolean)
        .some((valeur) => valeur.toLowerCase().includes(terme))
    })

  const niveauxIds = new Set(niveaux.map((niveau) => niveau.id))
  const seriesIds = new Set(series.map((serie) => serie.id))
  const groupes = niveaux.map((niveau) => {
    const seriesDuNiveau = series.filter((serie) => serie.niveau_id === niveau.id)
    const seriesGroupes = seriesDuNiveau
      .map((serie) => ({ serie, users: filtres.filter((user) => user.niveau_id === niveau.id && user.serie_id === serie.id) }))
      .filter((groupe) => groupe.users.length > 0)
    const sansSerie = filtres.filter((user) => (
      user.niveau_id === niveau.id && (!user.serie_id || !seriesIds.has(user.serie_id) || !seriesDuNiveau.some((serie) => serie.id === user.serie_id))
    ))
    return { niveau, seriesGroupes, sansSerie, total: seriesGroupes.reduce((total, groupe) => total + groupe.users.length, 0) + sansSerie.length }
  }).filter((groupe) => groupe.total > 0)

  const sansNiveau = filtres.filter((user) => !user.niveau_id || !niveauxIds.has(user.niveau_id))
  const seriesDuFiltre = niveauFiltre ? series.filter((serie) => serie.niveau_id === niveauFiltre) : series
  const aApprouverCount = users.filter((user) => !user.is_admin && !user.approuve).length
  const aDesapprouverCount = users.filter((user) => !user.is_admin && user.approuve).length

  if (loading) return <Loader />

  return (
    <div>
      <section className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatAdmin label="Utilisateurs" value={users.length} color="var(--neon-cyan)" />
        <StatAdmin label="En attente" value={users.filter((user) => !user.approuve).length} color="var(--neon-magenta)" />
        <StatAdmin label="Approuvés" value={users.filter((user) => user.approuve).length} color="var(--neon-green)" />
        <StatAdmin label="Non classés" value={users.filter((user) => !user.niveau_id || !user.serie_id).length} color="var(--neon-violet)" />
      </section>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
        {[['en_attente', 'En attente'], ['tous', 'Tous'], ['admins', 'Admins']].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFiltre(k)}
            className={`rounded-full border px-3 py-1.5 text-sm cursor-pointer transition ${
              filtre === k ? 'border-[var(--neon-magenta)] text-[var(--neon-magenta)] bg-[var(--neon-magenta)]/10' : 'border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            {l}
          </button>
        ))}
        <select
          value={niveauFiltre}
          onChange={(e) => { setNiveauFiltre(e.target.value); setSerieFiltre('') }}
          className="input w-auto min-w-36"
          aria-label="Filtrer par niveau"
        >
          <option value="">Tous les niveaux</option>
          {niveaux.map((niveau) => <option key={niveau.id} value={niveau.id}>{niveau.nom}</option>)}
        </select>
        <select
          value={serieFiltre}
          onChange={(e) => setSerieFiltre(e.target.value)}
          className="input w-auto min-w-32"
          aria-label="Filtrer par série"
        >
          <option value="">Toutes les séries</option>
          {seriesDuFiltre.map((serie) => (
            <option key={serie.id} value={serie.id}>
              {niveauFiltre ? serie.nom : `${niveaux.find((niveau) => niveau.id === serie.niveau_id)?.nom ?? 'Niveau ?'} · ${serie.nom}`}
            </option>
          ))}
        </select>
        <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Nom, série, établissement…" className="input min-w-56 flex-1" />
        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3 sm:ml-auto sm:border-l sm:border-t-0 sm:pl-3 sm:pt-0">
          <Button
            type="button"
            variant="secondary"
            disabled={bulkLoading || aApprouverCount === 0}
            onClick={() => demanderActionGroupee(true)}
          >
            ✓ Tout approuver ({aApprouverCount})
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={bulkLoading || aDesapprouverCount === 0}
            onClick={() => demanderActionGroupee(false)}
          >
            Tout désapprouver ({aDesapprouverCount})
          </Button>
        </div>
      </div>

      <div aria-live="polite" className="mb-4">
        {bulkFeedback && (
          <p className="rounded-xl border border-[var(--neon-green)]/40 bg-[var(--neon-green)]/10 px-4 py-3 text-sm text-[var(--neon-green)]">
            {bulkFeedback}
          </p>
        )}
        {bulkError && !bulkDialog && (
          <p role="alert" className="rounded-xl border border-[var(--neon-magenta)]/50 bg-[var(--neon-magenta)]/10 px-4 py-3 text-sm text-[var(--neon-magenta)]">
            {bulkError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {groupes.map(({ niveau, seriesGroupes, sansSerie, total }) => (
          <section key={niveau.id} className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)]">
            <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--neon-violet)]/8 px-4 py-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-violet)]">Niveau</p>
                <h2 className="text-lg font-black">{niveau.nom}</h2>
              </div>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-bold">{total} élève{total > 1 ? 's' : ''}</span>
            </header>

            <div className="flex flex-col gap-4 p-3 sm:p-4">
              {seriesGroupes.map(({ serie, users: usersSerie }) => (
                <GroupeSerie
                  key={serie.id}
                  titre={serie.nom}
                  users={usersSerie}
                  editionId={editionId}
                  setEditionId={setEditionId}
                  niveaux={niveaux}
                  series={series}
                  charger={charger}
                  toggleApprouve={toggleApprouve}
                  toggleAdmin={toggleAdmin}
                />
              ))}
              {sansSerie.length > 0 && (
                <GroupeSerie
                  titre="Série à vérifier"
                  users={sansSerie}
                  attention
                  editionId={editionId}
                  setEditionId={setEditionId}
                  niveaux={niveaux}
                  series={series}
                  charger={charger}
                  toggleApprouve={toggleApprouve}
                  toggleAdmin={toggleAdmin}
                />
              )}
            </div>
          </section>
        ))}

        {sansNiveau.length > 0 && (
          <section className="rounded-2xl border border-[var(--neon-magenta)]/50 bg-[var(--neon-magenta)]/5 p-3 sm:p-4">
            <GroupeSerie
              titre="Profils sans niveau"
              users={sansNiveau}
              attention
              editionId={editionId}
              setEditionId={setEditionId}
              niveaux={niveaux}
              series={series}
              charger={charger}
              toggleApprouve={toggleApprouve}
              toggleAdmin={toggleAdmin}
            />
          </section>
        )}

        {filtres.length === 0 && <Card><p className="py-5 text-center text-sm text-[var(--text-muted)]">Aucun utilisateur ne correspond à ces filtres.</p></Card>}
      </div>

      {bulkDialog && (
        <BulkApprovalDialog
          action={bulkDialog}
          loading={bulkLoading}
          error={bulkError}
          onCancel={() => { if (!bulkLoading) setBulkDialog(null) }}
          onConfirm={confirmerActionGroupee}
        />
      )}
    </div>
  )
}

function BulkApprovalDialog({ action, loading, error, onCancel, onConfirm }) {
  const verb = action.approuve ? 'approuver' : 'désapprouver'

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4" role="presentation">
      <Card
        className="w-full max-w-lg border border-[var(--neon-violet)]/50 p-5 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-approval-title"
        aria-describedby="bulk-approval-description"
      >
        <p className="mb-1 text-xs font-black uppercase tracking-[0.2em] text-[var(--neon-violet)]">Confirmation requise</p>
        <h2 id="bulk-approval-title" className="text-xl font-black">
          {action.approuve ? 'Tout approuver' : 'Tout désapprouver'}
        </h2>
        <p id="bulk-approval-description" className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Cette action va {verb} <strong className="text-[var(--text)]">{action.count} compte{action.count > 1 ? 's' : ''}</strong>.
          {!action.approuve && ' Les comptes administrateurs et votre propre compte sont protégés.'}
        </p>
        {error && <p role="alert" className="mt-3 text-sm text-[var(--neon-magenta)]">{error}</p>}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="ghost" disabled={loading} onClick={onCancel}>Annuler</Button>
          <Button type="button" variant={action.approuve ? 'primary' : 'danger'} disabled={loading} onClick={onConfirm}>
            {loading ? 'Application en cours…' : `Confirmer et ${verb}`}
          </Button>
        </div>
      </Card>
    </div>
  )
}

function StatAdmin({ label, value, color }) {
  return (
    <Card className="p-4">
      <p className="text-2xl font-black" style={{ color }}>{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </Card>
  )
}

function GroupeSerie({ titre, users, attention = false, editionId, setEditionId, niveaux, series, charger, toggleApprouve, toggleAdmin }) {
  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <h3 className={`text-sm font-bold ${attention ? 'text-[var(--neon-magenta)]' : 'text-[var(--neon-cyan)]'}`}>
          {attention ? '⚠️' : '🎓'} {titre}
        </h3>
        <span className="rounded-full bg-[var(--border)]/60 px-2 py-0.5 text-[10px] font-bold">{users.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {[...users].sort((a, b) => (a.username ?? '').localeCompare(b.username ?? '', 'fr')).map((user) => (
          <UserCard
            key={user.id}
            user={user}
            ouvert={editionId === user.id}
            onToggleEdition={() => setEditionId(editionId === user.id ? null : user.id)}
            niveaux={niveaux}
            series={series}
            onDone={() => { setEditionId(null); charger() }}
            onToggleApprouve={() => toggleApprouve(user)}
            onToggleAdmin={() => toggleAdmin(user)}
          />
        ))}
      </div>
    </section>
  )
}

function UserCard({ user, ouvert, onToggleEdition, niveaux, series, onDone, onToggleApprouve, onToggleAdmin }) {
  return (
    <Card className="p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--neon-violet)]/30 text-sm">{user.username?.[0]?.toUpperCase() ?? '?'}</span>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium">
              {user.username || 'Sans nom'} {user.is_admin && <span className="text-xs text-[var(--neon-magenta)]">(admin)</span>}
            </p>
            <p className="truncate text-xs text-[var(--text-muted)]">
              {user.etablissement ?? 'Établissement non renseigné'} · {user.approuve ? 'Approuvé' : 'En attente'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" onClick={onToggleEdition}>{ouvert ? 'Fermer' : '✏️ Modifier'}</Button>
          <Button variant={user.approuve ? 'secondary' : 'primary'} onClick={onToggleApprouve}>
            {user.approuve ? 'Bloquer' : 'Approuver'}
          </Button>
          <Button variant="ghost" onClick={onToggleAdmin}>{user.is_admin ? 'Retirer admin' : 'Passer admin'}</Button>
        </div>
      </div>
      {ouvert && <EditionClasse user={user} niveaux={niveaux} series={series} onDone={onDone} />}
    </Card>
  )
}

function EditionClasse({ user, niveaux, series, onDone }) {
  const [niveauId, setNiveauId] = useState(user.niveau_id ?? '')
  const [serieId, setSerieId] = useState(user.serie_id ?? '')
  const [etablissement, setEtablissement] = useState(user.etablissement ?? '')
  const [saving, setSaving] = useState(false)
  const [erreur, setErreur] = useState('')

  const seriesDuNiveau = series.filter((s) => s.niveau_id === niveauId)
  // Si la série sélectionnée n'appartient pas au niveau choisi, elle n'est plus valide
  const serieValide = seriesDuNiveau.some((s) => s.id === serieId)

  async function enregistrer(e) {
    e.preventDefault()
    setErreur('')
    if (!niveauId || !serieValide) {
      setErreur('Choisis un niveau et une série valides.')
      return
    }
    setSaving(true)
    const { data, error } = await supabase
      .from('profiles')
      .update({ niveau_id: niveauId, serie_id: serieId, etablissement: etablissement.trim() || null })
      .eq('id', user.id)
      .select('id')
    setSaving(false)
    if (error) {
      setErreur(error.message)
      return
    }
    if (!data?.length) {
      setErreur("La modification n'a pas été appliquée (droits insuffisants côté base — vérifie la policy profiles_update_admin).")
      return
    }
    onDone()
  }

  return (
    <form onSubmit={enregistrer} className="mt-3 flex flex-wrap items-end gap-2 border-t border-[var(--border)] pt-3">
      <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
        Niveau
        <select
          className="input w-36"
          value={niveauId}
          onChange={(e) => { setNiveauId(e.target.value); setSerieId('') }}
        >
          <option value="">Choisir…</option>
          {niveaux.map((n) => <option key={n.id} value={n.id}>{n.nom}</option>)}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
        Série
        <select
          className="input w-28"
          value={serieValide ? serieId : ''}
          onChange={(e) => setSerieId(e.target.value)}
          disabled={!niveauId}
        >
          <option value="">Choisir…</option>
          {seriesDuNiveau.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
        </select>
      </label>
      <label className="flex min-w-40 flex-1 flex-col gap-1 text-xs text-[var(--text-muted)]">
        Établissement
        <input
          className="input"
          value={etablissement}
          onChange={(e) => setEtablissement(e.target.value)}
          placeholder="Lycée…"
        />
      </label>
      <Button type="submit" disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
      {erreur && <p className="w-full text-xs text-[var(--neon-magenta)]">{erreur}</p>}
    </form>
  )
}
