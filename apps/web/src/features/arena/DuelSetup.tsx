import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle, PaperPlaneRight, Sword } from "@phosphor-icons/react";
import type { LearnerProfile, SchoolLevel, SubjectDefinition } from "../../domain/learning";
import { CompanionAvatar } from "../companion/CompanionAvatar";

export interface DuelOpponent {
  id: string;
  name: string;
}

export interface DuelChapter {
  id: string;
  title: string;
}

export type DuelDifficulty = "facile" | "moyen" | "difficile" | "tres-difficile" | "ultra";

interface DuelSetupProps {
  profile: LearnerProfile;
  level: SchoolLevel;
  subject: SubjectDefinition;
  /** Adversaires de la même classe. En attendant le branchement au catalogue, une liste d’exemple est utilisée. */
  opponents?: DuelOpponent[];
  /** Chapitres jouables de la matière. Idem : exemple tant que le catalogue n’est pas branché. */
  chapters?: DuelChapter[];
  /** Nombre de questions maximum autorisé (aligné sur la base : 20). */
  maxQuestions?: number;
  onBack: () => void;
  onCreate?: (config: DuelConfig) => void;
}

export interface DuelConfig {
  opponentId: string;
  chapterIds: string[];
  difficulty: DuelDifficulty;
  questionCount: number;
}

const DIFFICULTIES: { id: DuelDifficulty; label: string }[] = [
  { id: "facile", label: "Facile" },
  { id: "moyen", label: "Moyen" },
  { id: "difficile", label: "Difficile" },
  { id: "tres-difficile", label: "Très difficile" },
  { id: "ultra", label: "Ultra" },
];

const QUESTION_OPTIONS = [5, 10, 15, 20];
const MAX_CHAPTERS = 3;

const SAMPLE_OPPONENTS: DuelOpponent[] = [
  { id: "sample-awa", name: "Awa Koné" },
  { id: "sample-koffi", name: "Koffi Yao" },
  { id: "sample-bah", name: "Bah Sylla" },
];

const SAMPLE_CHAPTERS: DuelChapter[] = [
  { id: "sample-derivation", title: "Dérivation" },
  { id: "sample-probabilites", title: "Probabilités" },
  { id: "sample-suites", title: "Suites numériques" },
  { id: "sample-integrales", title: "Intégrales" },
];

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function DuelSetup({
  profile,
  level,
  subject,
  opponents = SAMPLE_OPPONENTS,
  chapters = SAMPLE_CHAPTERS,
  maxQuestions = 20,
  onBack,
  onCreate,
}: DuelSetupProps) {
  const questionChoices = useMemo(
    () => QUESTION_OPTIONS.filter((value) => value <= maxQuestions),
    [maxQuestions],
  );
  const [opponentId, setOpponentId] = useState(opponents[0]?.id ?? "");
  const [chapterIds, setChapterIds] = useState<string[]>(() => chapters.slice(0, 2).map((chapter) => chapter.id));
  const [difficulty, setDifficulty] = useState<DuelDifficulty>("moyen");
  const [questionCount, setQuestionCount] = useState<number>(() => questionChoices.at(-1) ?? maxQuestions);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const opponent = opponents.find((item) => item.id === opponentId) ?? opponents[0];
  const difficultyLabel = DIFFICULTIES.find((item) => item.id === difficulty)?.label ?? "";

  const toggleChapter = (id: string) => {
    setChapterIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      if (current.length >= MAX_CHAPTERS) return current;
      return [...current, id];
    });
  };

  const canSend = Boolean(opponent) && chapterIds.length > 0;

  const send = () => {
    if (!canSend || !opponent) return;
    onCreate?.({ opponentId: opponent.id, chapterIds, difficulty, questionCount });
    setSentTo(opponent.name);
  };

  if (sentTo) {
    return (
      <main className="duel-setup">
        <header className="duel-setup-header">
          <button className="path-back-button" type="button" onClick={onBack}>
            <ArrowLeft size={20} weight="bold" />Arène
          </button>
        </header>
        <section className="duel-sent" role="status">
          <CompanionAvatar motion="celebrate" className="duel-sent-avatar" decorative />
          <h1>Défi envoyé à {sentTo} !</h1>
          <p>
            {difficultyLabel} · {questionCount} questions · 90 s. L’invitation reste valable 48 h : {sentTo.split(" ")[0]} la
            recevra par notification et dans sa boîte de réception.
          </p>
          <button className="primary-action is-compact" type="button" onClick={onBack}>Retour à l’Arène</button>
        </section>
      </main>
    );
  }

  return (
    <main className="duel-setup">
      <header className="duel-setup-header">
        <button className="path-back-button" type="button" onClick={onBack}>
          <ArrowLeft size={20} weight="bold" />Arène
        </button>
        <div className="arena-school-context"><span>{level.label}</span><strong>{subject.label}</strong></div>
      </header>

      <section className="duel-setup-intro">
        <CompanionAvatar motion="wave" className="duel-setup-avatar" decorative />
        <div>
          <p className="path-kicker"><Sword size={16} weight="fill" /> Nouveau duel</p>
          <h1>Prépare ton défi, {profile.name.split(" ")[0]}</h1>
          <p>Choisis ton adversaire, les chapitres, la difficulté et le nombre de questions.</p>
        </div>
      </section>

      <section className="duel-field">
        <label>Adversaire</label>
        <div className="duel-opponents" role="group" aria-label="Adversaire du duel">
          {opponents.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`duel-opponent ${item.id === opponentId ? "is-active" : ""}`}
              aria-pressed={item.id === opponentId}
              onClick={() => setOpponentId(item.id)}
            >
              <span className="duel-avatar" aria-hidden="true">{initials(item.name)}</span>
              <span className="duel-opponent-name">{item.name}</span>
              {item.id === opponentId && <CheckCircle size={18} weight="fill" />}
            </button>
          ))}
        </div>
      </section>

      <section className="duel-field">
        <label>Matière</label>
        <div className="duel-chips"><span className="duel-chip is-on">{subject.label}</span></div>
      </section>

      <section className="duel-field">
        <label>Chapitres · {chapterIds.length} / {MAX_CHAPTERS}</label>
        <div className="duel-chips" role="group" aria-label="Chapitres du duel">
          {chapters.map((chapter) => {
            const active = chapterIds.includes(chapter.id);
            const disabled = !active && chapterIds.length >= MAX_CHAPTERS;
            return (
              <button
                key={chapter.id}
                type="button"
                className={`duel-chip ${active ? "is-on" : ""}`}
                aria-pressed={active}
                disabled={disabled}
                onClick={() => toggleChapter(chapter.id)}
              >
                {chapter.title}
              </button>
            );
          })}
        </div>
      </section>

      <section className="duel-field">
        <label>Difficulté</label>
        <div className="duel-chips" role="group" aria-label="Difficulté du duel">
          {DIFFICULTIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`duel-chip ${item.id === difficulty ? "is-pick" : ""}`}
              aria-pressed={item.id === difficulty}
              onClick={() => setDifficulty(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="duel-field">
        <label>Nombre de questions</label>
        <div className="duel-chips" role="group" aria-label="Nombre de questions">
          {questionChoices.map((value) => (
            <button
              key={value}
              type="button"
              className={`duel-chip ${value === questionCount ? "is-pick" : ""}`}
              aria-pressed={value === questionCount}
              onClick={() => setQuestionCount(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </section>

      <p className="duel-recap">{difficultyLabel} · {questionCount} questions · 90 s · valable 48 h</p>

      <button className="primary-action duel-send" type="button" onClick={send} disabled={!canSend}>
        <PaperPlaneRight size={20} weight="fill" />
        Envoyer le défi{opponent ? ` à ${opponent.name.split(" ")[0]}` : ""}
      </button>
    </main>
  );
}
