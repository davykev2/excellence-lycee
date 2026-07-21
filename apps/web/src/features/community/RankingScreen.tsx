import { useMemo, useState } from "react";
import { ArrowClockwise, Crown, Fire, GraduationCap, Lightning, Medal, Sparkle, Trophy } from "@phosphor-icons/react";
import type { LearnerProfile, SchoolLevel } from "../../domain/learning";
import type { LeaderboardEntry, RankingPeriod } from "../../domain/community";
import { rankingPeriodLabels } from "../../data/community";
import { ProfileAvatar } from "../../ui/ProfileAvatar";
import { useClassLeaderboard } from "./useClassLeaderboard";

interface RankingScreenProps {
  profile: LearnerProfile;
  level: SchoolLevel;
  totalXp: number;
  localOnly?: boolean;
}

const podiumOrder = [1, 0, 2];

function RankingAvatar({ entry, small = false }: { entry: LeaderboardEntry; small?: boolean }) {
  return (
    <span className={`ranking-avatar${small ? " is-small" : ""}`} style={{ background: entry.avatarTone }}>
      {entry.photoUrl ? <img src={entry.photoUrl} alt="" /> : entry.name.slice(0, 1).toLocaleUpperCase("fr")}
    </span>
  );
}

export function RankingScreen({ profile, level, totalXp, localOnly = false }: RankingScreenProps) {
  const [period, setPeriod] = useState<RankingPeriod>("week");
  const localLearner = useMemo(() => localOnly ? {
    name: profile.name,
    photoUrl: profile.photoUrl,
    levelId: level.id,
    totalXp,
  } : undefined, [level.id, localOnly, profile.name, profile.photoUrl, totalXp]);
  const { entries: leaderboard, updatedAt, loading, error, reload } = useClassLeaderboard(period, localLearner);
  const learner = leaderboard.find((entry) => entry.isCurrentLearner);
  const topThree = leaderboard.slice(0, 3);
  const updatedLabel = updatedAt
    ? `Mis à jour à ${new Date(updatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`
    : "Données synchronisées avec la progression";

  return (
    <main className="community-page ranking-page">
      <header className="community-header">
        <div>
          <p className="header-kicker">Communauté Excellence</p>
          <h1>Classement</h1>
          <p>Progresse avec ta classe, sans perdre de vue ton propre rythme.</p>
        </div>
        <div className="community-level-pill"><GraduationCap size={23} weight="duotone" /><span>Ma classe</span><strong>{level.label}</strong></div>
      </header>

      <section className="ranking-summary" aria-label="Ta position actuelle">
        <div className="ranking-summary-icon"><Trophy size={31} weight="duotone" /></div>
        <div><span>Ta position cette période</span><strong>{learner ? `#${learner.rank}` : "—"}</strong></div>
        <div className="ranking-summary-stat"><Lightning size={20} weight="fill" /><span><strong>{(learner?.score ?? 0).toLocaleString("fr-FR")}</strong> XP</span></div>
        <div className="ranking-summary-stat"><Fire size={20} weight="fill" /><span><strong>{learner?.streakDays ?? 0}</strong> jours de série</span></div>
      </section>

      <div className="ranking-periods" role="group" aria-label="Période du classement">
        {(Object.keys(rankingPeriodLabels) as RankingPeriod[]).map((item) => (
          <button key={item} className={period === item ? "is-active" : ""} type="button" aria-pressed={period === item} onClick={() => setPeriod(item)}>{rankingPeriodLabels[item]}</button>
        ))}
      </div>

      {loading ? (
        <section className="leaderboard-state" role="status">Synchronisation du classement de {level.label}…</section>
      ) : error ? (
        <section className="leaderboard-state is-error" role="alert">
          <strong>Le classement n’a pas pu être actualisé.</strong>
          <span>{error}</span>
          <button className="secondary-action" type="button" onClick={reload}><ArrowClockwise size={18} weight="bold" /> Réessayer</button>
        </section>
      ) : leaderboard.length === 0 ? (
        <section className="leaderboard-state">
          <strong>Le classement de {level.label} est encore vide.</strong>
          <span>Les premiers XP enregistrés feront apparaître les élèves ici.</span>
        </section>
      ) : <>
      <section className={`ranking-podium${topThree.length === 1 ? " is-solo" : topThree.length === 2 ? " is-duo" : ""}`} aria-label="Podium">
        {podiumOrder.filter((index) => index < topThree.length).map((index) => {
          const entry = topThree[index];
          return (
            <article className={`podium-card podium-card--${entry.rank}`} key={entry.id}>
              {entry.rank === 1 && <Crown className="podium-crown" size={30} weight="fill" />}
              <RankingAvatar entry={entry} />
              <span className="podium-rank"><Medal size={19} weight="fill" /> {entry.rank}</span>
              <strong>{entry.name}</strong>
              <span>{entry.score.toLocaleString("fr-FR")} XP</span>
              <div className="podium-step"><Sparkle size={19} weight="fill" /></div>
            </article>
          );
        })}
      </section>

      <section className="leaderboard-card">
        <header><div><p className="path-kicker">Classe complète</p><h2>Continue sur ta lancée</h2></div><span>{updatedLabel}</span></header>
        <ol className="leaderboard-list">
          {leaderboard.map((entry) => (
            <li className={entry.isCurrentLearner ? "is-current" : ""} key={entry.id}>
              <span className="leaderboard-rank">{entry.rank}</span>
              {entry.isCurrentLearner ? <ProfileAvatar name={profile.name} photoUrl={profile.photoUrl} /> : <RankingAvatar entry={entry} small />}
              <span className="leaderboard-name"><strong>{entry.name}{entry.isCurrentLearner ? " (toi)" : ""}</strong><small>{entry.completedLessons} leçons terminées</small></span>
              <span className="leaderboard-streak"><Fire size={17} weight="fill" /> {entry.streakDays} j</span>
              <strong className="leaderboard-score">{entry.score.toLocaleString("fr-FR")} XP</strong>
            </li>
          ))}
        </ol>
      </section>
      </>}
    </main>
  );
}
