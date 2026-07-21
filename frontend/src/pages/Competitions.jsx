import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Competitions() {
  return (
    <div className="game-page mx-auto max-w-2xl px-4 py-16 text-center">
      <Card variant="reward" className="py-12">
        <p className="mb-4 text-5xl">🏁</p>
        <h1 className="mb-2 text-2xl font-bold neon-text">Compétitions</h1>
        <p className="mx-auto mb-2 max-w-md text-[var(--text-muted)]">
          Bientôt, les élèves pourront s'affronter ici dans de grandes compétitions :
          tournois par classe, épreuves chronométrées en direct et podiums de saison.
        </p>
        <p className="mb-6 inline-block rounded-full border border-[var(--neon-violet)] px-3 py-1 text-xs font-semibold text-[var(--neon-violet)]">
          En construction 🚧
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/defis"><Button variant="secondary">⚔️ En attendant : les duels 1c1</Button></Link>
          <Link to="/classement"><Button variant="ghost">🏆 Voir les classements</Button></Link>
        </div>
      </Card>
    </div>
  )
}
