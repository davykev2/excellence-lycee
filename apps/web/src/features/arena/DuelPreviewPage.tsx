import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Backspace,
  BellRinging,
  BookOpenText,
  CheckCircle,
  ChatCircleDots,
  Clock,
  Crown,
  EnvelopeSimple,
  Fire,
  HourglassHigh,
  Keyboard,
  Lightning,
  Medal,
  PaperPlaneTilt,
  Play,
  ShieldCheck,
  Sparkle,
  Sword,
  Target,
  Trophy,
  UsersThree,
  XCircle,
} from "@phosphor-icons/react";
import { getCurriculumLessonTitles, type CurriculumLessonTitle } from "../../data/curriculumCatalog";
import type { LearnerProfile, SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import { CompanionAvatar } from "../companion/CompanionAvatar";
import "./DuelPreviewPage.css";

type DuelScreenId = "lobby" | "setup" | "inbox" | "liveInvite" | "battle";
type DuelDifficultyId = "easy" | "medium" | "hard" | "very-hard" | "ultra";
type DuelFormatId = "qcm" | "compound";
type InvitationDecision = "pending" | "accepted" | "declined";
type DuelPhase = "playing" | "waiting" | "review";

interface DuelPreviewPageProps {
  profile: LearnerProfile;
  level: SchoolLevel;
  subject: SubjectDefinition;
  subjects: SubjectDefinition[];
  onBackArena: () => void;
}

type DuelDifficulty = {
  id: DuelDifficultyId;
  label: string;
  description: string;
  reward: string;
};

type DuelFormat = {
  id: DuelFormatId;
  label: string;
  description: string;
  helper: string;
};

const difficulties: DuelDifficulty[] = [
  { id: "easy", label: "Facile", description: "Installer les bases", reward: "XP ×1" },
  { id: "medium", label: "Moyen", description: "Combiner les notions", reward: "XP ×1,2" },
  { id: "hard", label: "Difficile", description: "Raisonner comme au BAC", reward: "XP ×1,5" },
  { id: "very-hard", label: "Très difficile", description: "Déjouer les pièges", reward: "XP ×1,8" },
  { id: "ultra", label: "Ultra", description: "Défi d’excellence", reward: "XP ×2,2" },
];

const duelFormats: DuelFormat[] = [
  {
    id: "qcm",
    label: "QCM",
    description: "Une question, quatre propositions",
    helper: "Idéal pour tester rapidement les réflexes et les connaissances.",
  },
  {
    id: "compound",
    label: "Exercice composé",
    description: "Un même énoncé, plusieurs sous-questions",
    helper: "Une réponse finale suffit pour valider chaque sous-question.",
  },
];

const qcmQuestionCounts = [5, 10, 15, 20] as const;
const compoundQuestionCounts = [3, 4, 5, 6] as const;
const formulaKeyboardKeys = [
  "+∞",
  "−∞",
  "√(",
  "π",
  "²",
  "³",
  "≤",
  "≥",
  "≠",
  "≈",
  "∈",
  "∉",
  "ℝ",
  "ℕ",
  "ℤ",
  "∅",
  "∪",
  "∩",
  "×",
  "÷",
  "→",
  "|x|",
  "(",
  ")",
] as const;

type DuelSubjectPreview = {
  topic: string;
  question: string;
  answers: [string, string, string, string];
  reviewLabel: string;
  learnerAnswer: string;
  correctAnswer: string;
  correction: string;
  memoryTip: string;
};

const duelSubjectPreviews: Record<SubjectDefinition["id"], DuelSubjectPreview> = {
  mathematics: {
    topic: "Limites et continuité",
    question: "Quelle est la limite de f(x) = (3x − 1) / (x + 2) lorsque x tend vers +∞ ?",
    answers: ["0", "3/2", "+∞", "3"],
    reviewLabel: "Limite d’un quotient",
    learnerAnswer: "3/2",
    correctAnswer: "3",
    correction: "Le numérateur et le dénominateur sont de même degré. La limite est donc le quotient de leurs coefficients dominants : 3 ÷ 1 = 3.",
    memoryTip: "Même degré : compare directement les coefficients des termes de plus haut degré.",
  },
  "physics-chemistry": {
    topic: "Cinématique",
    question: "Une vitesse constante de 5 m·s⁻¹ signifie que le mobile…",
    answers: ["s’arrête après 5 m", "parcourt 5 m chaque seconde", "accélère de 5 m·s⁻²", "change de direction"],
    reviewLabel: "Interprétation de la vitesse",
    learnerAnswer: "accélère de 5 m·s⁻²",
    correctAnswer: "parcourt 5 m chaque seconde",
    correction: "Une vitesse de 5 m·s⁻¹ exprime une distance de 5 mètres parcourue pendant chaque seconde, tant que la vitesse reste constante.",
    memoryTip: "Lis toujours l’unité : m·s⁻¹ signifie « mètres par seconde ».",
  },
  french: {
    topic: "Argumentation",
    question: "Dans un texte argumentatif, quelle est la fonction principale d’un exemple ?",
    answers: ["Décorer le texte", "Illustrer et appuyer l’argument", "Remplacer la conclusion", "Éviter d’expliquer"],
    reviewLabel: "Construire une argumentation",
    learnerAnswer: "Décorer le texte",
    correctAnswer: "Illustrer et appuyer l’argument",
    correction: "L’exemple rend l’argument concret et crédible. Il ne remplace ni l’explication ni la conclusion.",
    memoryTip: "Argument = idée défendue ; exemple = preuve ou illustration concrète.",
  },
  english: {
    topic: "Present perfect",
    question: "Choose the sentence that uses the present perfect correctly.",
    answers: ["I have went to school.", "She has lived here for two years.", "They has finished yesterday.", "We live here since 2022."],
    reviewLabel: "Present perfect",
    learnerAnswer: "I have went to school.",
    correctAnswer: "She has lived here for two years.",
    correction: "The present perfect uses have or has followed by the past participle. With she, use has; lived is the correct past participle.",
    memoryTip: "Subject + have/has + past participle.",
  },
  svt: {
    topic: "Biosynthèse des protéines",
    question: "Quel rôle joue l’ARN messager dans la synthèse des protéines ?",
    answers: ["Il détruit l’ADN", "Il transporte l’information génétique", "Il fabrique les cellules", "Il remplace le ribosome"],
    reviewLabel: "Rôle de l’ARN messager",
    learnerAnswer: "Il fabrique les cellules",
    correctAnswer: "Il transporte l’information génétique",
    correction: "L’ARN messager copie l’information d’un gène et la transporte jusqu’au ribosome, où cette information est traduite en protéine.",
    memoryTip: "ARNm : le « message » quitte le noyau pour rejoindre le ribosome.",
  },
  philosophy: {
    topic: "Dissertation philosophique",
    question: "Quelle étape permet de faire émerger le problème philosophique d’un sujet ?",
    answers: ["Recopier le sujet", "Analyser les termes et leurs tensions", "Choisir une citation", "Rédiger la conclusion"],
    reviewLabel: "Problématiser un sujet",
    learnerAnswer: "Choisir une citation",
    correctAnswer: "Analyser les termes et leurs tensions",
    correction: "La problématisation naît de l’analyse précise des mots du sujet, de leurs rapports et de la difficulté intellectuelle qu’ils font apparaître.",
    memoryTip: "Définir, opposer, questionner : c’est le chemin vers la problématique.",
  },
  "history-geography": {
    topic: "Développement économique",
    question: "Quel indicateur aide le mieux à comparer la richesse produite par habitant ?",
    answers: ["La superficie", "Le PIB par habitant", "Le nombre de régions", "La température moyenne"],
    reviewLabel: "Lire un indicateur économique",
    learnerAnswer: "La superficie",
    correctAnswer: "Le PIB par habitant",
    correction: "Le PIB par habitant rapporte la richesse produite au nombre d’habitants. Il permet une comparaison plus pertinente entre des pays de tailles différentes.",
    memoryTip: "Pour comparer des populations différentes, rapporte la valeur totale au nombre d’habitants.",
  },
};

function getDuelSubjectPreview(subject: SubjectDefinition) {
  return duelSubjectPreviews[subject.id];
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "EL";
}

function duelDuration(questionCount: number, formatId: DuelFormatId) {
  if (formatId === "compound") {
    return Math.max(8, Math.round(questionCount * 2.5));
  }
  return Math.max(3, Math.round(questionCount * 0.6));
}

function duelQuestionUnit(formatId: DuelFormatId, questionCount: number) {
  if (formatId === "compound") {
    return `${questionCount} sous-question${questionCount > 1 ? "s" : ""}`;
  }
  return `${questionCount} questions`;
}

function duelLessonSummary(lessonTitles: string[]) {
  if (lessonTitles.length === 0) return "Aucune leçon sélectionnée";
  if (lessonTitles.length === 1) return lessonTitles[0];
  if (lessonTitles.length === 2) return lessonTitles.join(" + ");
  return `${lessonTitles[0]} + ${lessonTitles.length - 1} autres leçons`;
}

function getDuelLessons(levelId: string, subjectId: SubjectId) {
  return getCurriculumLessonTitles(levelId, subjectId).filter((lesson) => Boolean(lesson.pathId));
}

function MiniAvatar({ name, tone = "navy" }: { name: string; tone?: "navy" | "orange" }) {
  return <span className={`duel-mini-avatar is-${tone}`}>{initials(name)}</span>;
}

function DuelLobbyMockup({
  profile,
  level,
  subject,
  onSelect,
}: Pick<DuelPreviewPageProps, "profile" | "level" | "subject"> & { onSelect: () => void }) {
  return (
    <section className="duel-ui-frame duel-lobby-mockup" aria-label="Maquette du hall des duels">
      <header className="duel-ui-topbar">
        <span className="duel-ui-brand"><Sword size={18} weight="fill" /> Les Duels de Davy</span>
        <span className="duel-ui-pill"><Fire size={14} weight="fill" /> 3 victoires</span>
      </header>
      <div className="duel-lobby-hero">
        <div>
          <p>ARÈNE EXCELLENCE</p>
          <h2>Défends ce que tu as appris.</h2>
          <span>Des défis justes, adaptés à {level.label}.</span>
          <button type="button" onClick={onSelect}>Créer un duel <ArrowRight size={17} weight="bold" /></button>
        </div>
        <div className="duel-lobby-davy">
          <CompanionAvatar motion="wave" decorative />
          <span>Je veille à l’équilibre du duel.</span>
        </div>
      </div>
      <div className="duel-lobby-choices">
        <article className="is-featured"><span><Lightning size={24} weight="fill" /></span><div><small>LE PLUS RAPIDE</small><strong>Duel éclair</strong><p>5 à 10 questions</p></div><Play size={20} weight="fill" /></article>
        <article><span><UsersThree size={24} weight="duotone" /></span><div><small>ENTRE AMIS</small><strong>Défier un ami</strong><p>Invitation privée dans Messages</p></div></article>
        <article><span><ShieldCheck size={24} weight="duotone" /></span><div><small>À TON RYTHME</small><strong>Duel différé</strong><p>Ton adversaire répond plus tard</p></div></article>
      </div>
      <footer className="duel-lobby-footer"><MiniAvatar name={profile.name} /><span>{profile.name.split(" ")[0]} · {level.label}</span><i /> <span>{subject.label}</span><b>Classement : 12e</b></footer>
    </section>
  );
}

function DuelSetupMockup({
  level,
  subject,
  subjectOptions,
  lessonOptions,
  selectedLessonIds,
  format,
  difficulty,
  questionCount,
  onSubjectChange,
  onLessonToggle,
  onSelectAllLessons,
  onFormatChange,
  onDifficultyChange,
  onQuestionCountChange,
  onBack,
  onSelect,
}: Pick<DuelPreviewPageProps, "level" | "subject"> & {
  subjectOptions: SubjectDefinition[];
  lessonOptions: CurriculumLessonTitle[];
  selectedLessonIds: string[];
  format: DuelFormat;
  difficulty: DuelDifficulty;
  questionCount: number;
  onSubjectChange: (subjectId: SubjectId) => void;
  onLessonToggle: (lessonId: string) => void;
  onSelectAllLessons: () => void;
  onFormatChange: (format: DuelFormatId) => void;
  onDifficultyChange: (difficulty: DuelDifficultyId) => void;
  onQuestionCountChange: (count: number) => void;
  onBack: () => void;
  onSelect: () => void;
}) {
  const duration = duelDuration(questionCount, format.id);
  const questionCounts = format.id === "compound" ? compoundQuestionCounts : qcmQuestionCounts;
  const selectedLessons = lessonOptions.filter((lesson) => selectedLessonIds.includes(lesson.id));
  const lessonTitles = selectedLessons.map((lesson) => lesson.title);
  const allLessonsSelected = lessonOptions.length > 0 && selectedLessons.length === lessonOptions.length;

  return (
    <section className="duel-ui-frame duel-setup-mockup" aria-label="Maquette de la préparation d’un duel">
      <header className="duel-ui-topbar">
        <button type="button" aria-label="Retour au hall" onClick={onBack}><ArrowLeft size={18} weight="bold" /></button>
        <span className="duel-ui-brand"><Target size={18} weight="fill" /> Préparer mon duel</span>
      </header>
      <div className="duel-setup-layout">
        <div className="duel-setup-form">
          <p>UN DÉFI À TA MESURE</p>
          <h2>Choisis les règles du match.</h2>
          <div className="duel-choice-grid">
            <div className="duel-choice-field"><span>NIVEAU ET SÉRIE</span><strong>{level.label}</strong></div>
            <label className="duel-choice-field is-select">
              <span>MATIÈRE DU DUEL</span>
              <select value={subject.id} onChange={(event) => onSubjectChange(event.target.value as SubjectId)}>
                {subjectOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
              </select>
            </label>
          </div>

          <fieldset className="duel-option-group duel-lesson-choice">
            <legend>LEÇON OU LEÇONS DU DUEL</legend>
            <div className="duel-lesson-choice-heading">
              <span>{selectedLessons.length} sélectionnée{selectedLessons.length > 1 ? "s" : ""}</span>
              <button type="button" onClick={onSelectAllLessons}>
                {allLessonsSelected ? "Garder la première" : "Tout sélectionner"}
              </button>
            </div>
            <div className="duel-lesson-options">
              {lessonOptions.map((lesson) => {
                const isSelected = selectedLessonIds.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    type="button"
                    className={isSelected ? "is-active" : ""}
                    onClick={() => onLessonToggle(lesson.id)}
                    aria-pressed={isSelected}
                  >
                    <span>{isSelected ? <CheckCircle size={18} weight="fill" /> : <BookOpenText size={18} weight="duotone" />}</span>
                    <strong>{String(lesson.sequence).padStart(2, "0")} — {lesson.title}</strong>
                    {lesson.strand ? <small>{lesson.strand}</small> : null}
                  </button>
                );
              })}
            </div>
            <small>Choisis au moins une leçon. Les questions seront mélangées lorsque plusieurs leçons sont sélectionnées.</small>
          </fieldset>

          <fieldset className="duel-option-group duel-format-choice">
            <legend>FORMAT DU DUEL</legend>
            <div>
              {duelFormats.map((option) => (
                <button
                  key={option.id}
                  className={format.id === option.id ? "is-active" : ""}
                  type="button"
                  onClick={() => onFormatChange(option.id)}
                  aria-pressed={format.id === option.id}
                >
                  <span>{option.id === "qcm" ? <CheckCircle size={20} weight="duotone" /> : <ChatCircleDots size={20} weight="duotone" />}</span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                  <em>{option.helper}</em>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="duel-option-group">
            <legend>NIVEAU DE DIFFICULTÉ</legend>
            <div className="duel-difficulty-row">
              {difficulties.map((option) => (
                <button
                  key={option.id}
                  className={difficulty.id === option.id ? `is-active is-${option.id}` : `is-${option.id}`}
                  type="button"
                  onClick={() => onDifficultyChange(option.id)}
                  aria-pressed={difficulty.id === option.id}
                >
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                  <em>{option.reward}</em>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="duel-option-group duel-question-count">
            <legend>{format.id === "compound" ? "NOMBRE DE SOUS-QUESTIONS" : "NOMBRE DE QUESTIONS"}</legend>
            <div>
              {questionCounts.map((count) => (
                <button
                  key={count}
                  type="button"
                  className={questionCount === count ? "is-active" : ""}
                  onClick={() => onQuestionCountChange(count)}
                  aria-pressed={questionCount === count}
                >
                  <strong>{count}</strong>
                  <small>{duelDuration(count, format.id)} min</small>
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <aside className="duel-match-card">
          <span className="duel-match-ring"><Sword size={29} weight="fill" /></span>
          <p>TON MATCH</p>
          <strong>{format.label} · {difficulty.label}</strong>
          <div><BookOpenText size={17} weight="duotone" /> {duelLessonSummary(lessonTitles)}</div>
          <div><Target size={17} weight="duotone" /> {duelQuestionUnit(format.id, questionCount)}</div>
          <div><Clock size={17} weight="duotone" /> Environ {duration} minutes</div>
          <div><ShieldCheck size={17} weight="duotone" /> Même niveau et même temps</div>
          <div><EnvelopeSimple size={17} weight="duotone" /> Invitation privée, valable 15 min</div>
          <button type="button" onClick={onSelect}>Envoyer l’invitation <PaperPlaneTilt size={17} weight="fill" /></button>
          <small>Aucun vrai message ne part dans cette maquette.</small>
        </aside>
      </div>
    </section>
  );
}

function DuelInboxMockup({
  profile,
  subject,
  lessonTitles,
  format,
  difficulty,
  questionCount,
  decision,
  onAccept,
  onDecline,
  onShowLive,
}: Pick<DuelPreviewPageProps, "profile" | "subject"> & {
  lessonTitles: string[];
  format: DuelFormat;
  difficulty: DuelDifficulty;
  questionCount: number;
  decision: InvitationDecision;
  onAccept: () => void;
  onDecline: () => void;
  onShowLive: () => void;
}) {
  const isPending = decision === "pending";

  return (
    <section className="duel-ui-frame duel-inbox-mockup" aria-label="Maquette de l’invitation reçue dans Messages">
      <header className="duel-ui-topbar">
        <span className="duel-ui-brand"><ChatCircleDots size={18} weight="fill" /> Messages</span>
        <span className="duel-ui-pill is-message"><EnvelopeSimple size={14} weight="fill" /> 1 nouveau défi</span>
      </header>
      <div className="duel-inbox-layout">
        <aside className="duel-inbox-list" aria-label="Conversations">
          <div className="duel-inbox-list-heading"><strong>Boîte de réception</strong><span>3</span></div>
          <button className="is-active" type="button">
            <MiniAvatar name={profile.name} />
            <span><strong>{profile.name.split(" ")[0]}</strong><small>t’a envoyé un duel</small></span>
            <em>maintenant</em>
          </button>
          <button type="button">
            <MiniAvatar name="Groupe Terminale" tone="orange" />
            <span><strong>Ma classe</strong><small>Nouvelle annonce</small></span>
            <em>12 min</em>
          </button>
          <button type="button">
            <MiniAvatar name="Davy" />
            <span><strong>Davy</strong><small>Continue comme ça !</small></span>
            <em>hier</em>
          </button>
        </aside>
        <div className="duel-inbox-thread">
          <header>
            <MiniAvatar name={profile.name} />
            <div><strong>{profile.name}</strong><small>En ligne · invitation privée</small></div>
            <span><ShieldCheck size={15} weight="fill" /> Lien sécurisé</span>
          </header>
          <div className="duel-thread-content">
            <div className="duel-message-note"><span>Aujourd’hui</span></div>
            <article className={`duel-invitation-card is-${decision}`}>
              <div className="duel-invitation-card-heading">
                <span><Sword size={24} weight="fill" /></span>
                <div><small>DÉFI DE {profile.name.split(" ")[0].toUpperCase()}</small><strong>Prête à défendre tes acquis ?</strong></div>
                <em><HourglassHigh size={14} weight="fill" /> 14:52</em>
              </div>
              <p>Un duel de {subject.label.toLowerCase()} t’attend. L’invitation restera ici jusqu’à son expiration.</p>
              <div className="duel-invite-config">
                <span><small>LEÇON{lessonTitles.length > 1 ? "S" : ""}</small><strong>{duelLessonSummary(lessonTitles)}</strong></span>
                <span><small>DIFFICULTÉ</small><strong>{difficulty.label}</strong></span>
                <span><small>FORMAT</small><strong>{format.label}</strong></span>
                <span><small>CONTENU</small><strong>{duelQuestionUnit(format.id, questionCount)} · {duelDuration(questionCount, format.id)} min</strong></span>
              </div>
              {isPending ? (
                <div className="duel-invite-actions">
                  <button type="button" onClick={onAccept}><CheckCircle size={17} weight="fill" /> Accepter</button>
                  <button type="button" className="is-secondary" onClick={onDecline}><XCircle size={17} weight="bold" /> Refuser</button>
                </div>
              ) : (
                <div className={`duel-invite-decision is-${decision}`} role="status">
                  {decision === "accepted" ? <CheckCircle size={18} weight="fill" /> : <XCircle size={18} weight="fill" />}
                  <span>{decision === "accepted" ? "Défi accepté. Le duel peut commencer." : "Défi refusé sans pénalité. L’expéditeur sera informé."}</span>
                </div>
              )}
            </article>
          </div>
          <footer>
            <span><BellRinging size={16} weight="duotone" /> Si Aïcha est en ligne, elle voit aussi une alerte en haut de l’écran.</span>
            <button type="button" onClick={onShowLive}>Voir l’alerte en direct <ArrowRight size={15} weight="bold" /></button>
          </footer>
        </div>
      </div>
    </section>
  );
}

function DuelLiveInviteMockup({
  profile,
  subject,
  lessonTitles,
  format,
  difficulty,
  questionCount,
  decision,
  onAccept,
  onDecline,
  onReset,
}: Pick<DuelPreviewPageProps, "profile" | "subject"> & {
  lessonTitles: string[];
  format: DuelFormat;
  difficulty: DuelDifficulty;
  questionCount: number;
  decision: InvitationDecision;
  onAccept: () => void;
  onDecline: () => void;
  onReset: () => void;
}) {
  return (
    <section className="duel-ui-frame duel-live-invite-mockup" aria-label="Maquette de l’alerte de duel en direct">
      <div className="duel-live-underlay" aria-hidden="true">
        <header>
          <strong>Excellence Lycée</strong>
          <nav><span>Accueil</span><span>Parcours</span><span>Arène</span></nav>
        </header>
        <div className="duel-live-fake-layout">
          <aside><small>MENU</small><strong>Accueil</strong><span>Parcours</span><span>Arène</span><span>Messages</span></aside>
          <main>
            <small>BONJOUR AÏCHA</small>
            <h2>Continue ton parcours.</h2>
            <p>Deux activités sont prêtes pour toi aujourd’hui.</p>
            <div>
              <article><Target size={24} weight="duotone" /><strong>Mon parcours</strong><span>Reprendre la leçon</span></article>
              <article><Trophy size={24} weight="duotone" /><strong>Classement</strong><span>Voir ma position</span></article>
              <article><ChatCircleDots size={24} weight="duotone" /><strong>Messages</strong><span>1 nouveau défi</span></article>
            </div>
          </main>
        </div>
      </div>
      <div className={`duel-live-banner is-${decision}`} role="dialog" aria-label="Invitation à un duel">
        <div className="duel-live-avatar-stack">
          <MiniAvatar name={profile.name} />
          <span><Sword size={20} weight="fill" /></span>
        </div>
        <div className="duel-live-copy">
          <small>DÉFI EN DIRECT · EXPIRE DANS 01:48</small>
          <strong>{profile.name.split(" ")[0]} te défie en {subject.label}</strong>
          <p>{duelLessonSummary(lessonTitles)} · {format.label} · {difficulty.label} · {duelQuestionUnit(format.id, questionCount)} · {duelDuration(questionCount, format.id)} min</p>
          <span><EnvelopeSimple size={13} weight="fill" /> Le défi reste disponible dans Messages.</span>
        </div>
        {decision === "pending" ? (
          <div className="duel-live-actions">
            <button type="button" onClick={onAccept}><CheckCircle size={18} weight="fill" /> Accepter</button>
            <button type="button" className="is-secondary" onClick={onDecline}><XCircle size={18} weight="bold" /> Refuser</button>
          </div>
        ) : (
          <div className="duel-live-feedback" role="status">
            {decision === "accepted" ? <CheckCircle size={24} weight="fill" /> : <XCircle size={24} weight="fill" />}
            <strong>{decision === "accepted" ? "Défi accepté" : "Défi refusé"}</strong>
            <button type="button" onClick={onReset}>Rejouer la démo</button>
          </div>
        )}
      </div>
      <div className="duel-live-davy"><CompanionAvatar motion="blink" decorative /><span>Davy ne coupe jamais ton activité : l’alerte reste claire et rapide.</span></div>
    </section>
  );
}

function DuelBattleMockup({
  profile,
  subject,
  lessonTitles,
  format,
  difficulty,
  questionCount,
  onRematch,
}: Pick<DuelPreviewPageProps, "profile" | "subject"> & {
  lessonTitles: string[];
  format: DuelFormat;
  difficulty: DuelDifficulty;
  questionCount: number;
  onRematch: () => void;
}) {
  const preview = getDuelSubjectPreview(subject);
  const lessonLabel = duelLessonSummary(lessonTitles);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [writtenAnswer, setWrittenAnswer] = useState("");
  const [formulaKeyboardOpen, setFormulaKeyboardOpen] = useState(false);
  const [phase, setPhase] = useState<DuelPhase>("playing");
  const answerInputRef = useRef<HTMLTextAreaElement | null>(null);
  const learnerScore = Math.max(3, Math.round(questionCount * 0.6));
  const rivalScore = Math.max(2, learnerScore - 1);
  const isCompound = format.id === "compound";

  const replayCurrentDuel = () => {
    setSelectedAnswer(null);
    setWrittenAnswer("");
    setFormulaKeyboardOpen(false);
    setPhase("playing");
  };

  const insertFormulaSymbol = (symbol: string) => {
    const input = answerInputRef.current;
    const selectionStart = input?.selectionStart ?? writtenAnswer.length;
    const selectionEnd = input?.selectionEnd ?? selectionStart;
    const nextAnswer = `${writtenAnswer.slice(0, selectionStart)}${symbol}${writtenAnswer.slice(selectionEnd)}`;
    const nextCursorPosition = selectionStart + symbol.length;

    setWrittenAnswer(nextAnswer);
    window.requestAnimationFrame(() => {
      answerInputRef.current?.focus();
      answerInputRef.current?.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
  };

  const removeLastFormulaCharacter = () => {
    const input = answerInputRef.current;
    const selectionStart = input?.selectionStart ?? writtenAnswer.length;
    const selectionEnd = input?.selectionEnd ?? selectionStart;
    const removeFrom = selectionStart === selectionEnd ? Math.max(0, selectionStart - 1) : selectionStart;
    const nextAnswer = `${writtenAnswer.slice(0, removeFrom)}${writtenAnswer.slice(selectionEnd)}`;

    setWrittenAnswer(nextAnswer);
    window.requestAnimationFrame(() => {
      answerInputRef.current?.focus();
      answerInputRef.current?.setSelectionRange(removeFrom, removeFrom);
    });
  };

  if (phase === "review") {
    return (
      <section className="duel-ui-frame duel-review-mockup" aria-label="Maquette du duel terminé et de sa correction">
        <header className="duel-ui-topbar">
          <span className="duel-ui-brand"><Trophy size={18} weight="fill" /> Duel terminé</span>
          <span className="duel-ui-pill is-gold"><Medal size={14} weight="fill" /> Correction débloquée</span>
        </header>
        <div className="duel-review-ready">
          <CheckCircle size={19} weight="fill" />
          <span><strong>Les deux joueurs ont terminé.</strong> Le bilan remplace automatiquement le questionnaire sur cette même page.</span>
        </div>
        <div className="duel-review-layout">
          <aside className="duel-result-summary">
            <div className="duel-result-trophy"><Crown size={46} weight="fill" /><span>VICTOIRE</span></div>
            <p>BRAVO, {profile.name.split(" ")[0].toUpperCase()} !</p>
            <h2>{learnerScore} <i>—</i> {rivalScore}</h2>
            <span>{format.label} · {difficulty.label} · {duelQuestionUnit(format.id, questionCount)}</span>
            <div className="duel-review-reward"><Sparkle size={19} weight="fill" /><span><small>RÉCOMPENSE</small><strong>+ 140 XP</strong></span></div>
          </aside>
          <article className="duel-correction-card">
            <div className="duel-correction-heading">
              <span><Target size={20} weight="duotone" /></span>
              <div><small>{format.id === "compound" ? "PARTIE À REVOIR" : "QUESTION À REVOIR"}</small><strong>{preview.reviewLabel}</strong></div>
              <em>1 erreur</em>
            </div>
            <p className="duel-correction-question">{preview.question}</p>
            <div className="duel-correction-answer is-wrong"><small>TA RÉPONSE</small><strong>{format.id === "compound" ? writtenAnswer || "Réponse non rédigée" : preview.learnerAnswer}</strong><XCircle size={18} weight="fill" /></div>
            <div className="duel-correction-answer is-correct"><small>BONNE RÉPONSE</small><strong>{preview.correctAnswer}</strong><CheckCircle size={18} weight="fill" /></div>
            <div className="duel-correction-explanation"><strong>Pourquoi ?</strong><p>{preview.correction}</p></div>
            <div className="duel-correction-tip"><Sparkle size={17} weight="fill" /><span><strong>L’astuce de Davy</strong>{preview.memoryTip}</span></div>
          </article>
          <div className="duel-review-final-actions">
            <button type="button" onClick={onRematch}><Sword size={17} weight="fill" /> Préparer une revanche</button>
            <button className="is-secondary" type="button" onClick={replayCurrentDuel}><ArrowRight size={17} weight="bold" /> Rejouer cette partie</button>
          </div>
        </div>
      </section>
    );
  }

  if (phase === "waiting") {
    return (
      <section className="duel-ui-frame duel-battle-mockup duel-waiting-mockup" aria-label="Maquette d’un duel en attente de l’adversaire">
        <header className="duel-battle-header">
          <div className="duel-player is-you"><MiniAvatar name={profile.name} /><div><small>TOI</small><strong>{profile.name.split(" ")[0]}</strong></div><b><CheckCircle size={14} weight="fill" /></b></div>
          <div className="duel-battle-round"><span>{format.label.toUpperCase()} · {difficulty.label.toUpperCase()}</span><strong>00:42</strong><i><em className="is-waiting" /></i></div>
          <div className="duel-player is-rival"><b>{questionCount - 2}</b><div><small>ADVERSAIRE</small><strong>Aïcha</strong></div><MiniAvatar name="Aïcha Koné" tone="orange" /></div>
        </header>
        <div className="duel-waiting-stage" role="status" aria-live="polite">
          <CompanionAvatar motion="blink" decorative />
          <span className="duel-waiting-icon"><HourglassHigh size={27} weight="duotone" /></span>
          <p>{format.id === "compound" ? "TON EXERCICE EST ENREGISTRÉ" : "TES RÉPONSES SONT ENREGISTRÉES"}</p>
          <h2>En attente d’Aïcha Koné…</h2>
          <span>{format.id === "compound" ? "Aïcha rédige encore la dernière partie de son exercice." : "Aïcha répond encore à ses deux dernières questions."} Tu peux rester ici : le bilan apparaîtra automatiquement dès qu’elle termine ou lorsque le temps sera écoulé.</span>
          <div className="duel-waiting-players">
            <article><MiniAvatar name={profile.name} /><div><small>{profile.name.split(" ")[0]}</small><strong>Terminé · {duelQuestionUnit(format.id, questionCount)}</strong></div><CheckCircle size={20} weight="fill" /></article>
            <article><MiniAvatar name="Aïcha Koné" tone="orange" /><div><small>Aïcha Koné</small><strong>{format.id === "compound" ? "Encore 1 partie" : "Encore 2 questions"}</strong></div><HourglassHigh size={20} weight="fill" /></article>
          </div>
          <div className="duel-waiting-demo-actions">
            <span>DÉMO DU PASSAGE AUTOMATIQUE</span>
            <button type="button" onClick={() => setPhase("review")}><CheckCircle size={16} weight="fill" /> Aïcha a terminé</button>
            <button type="button" className="is-secondary" onClick={() => setPhase("review")}><Clock size={16} weight="fill" /> Temps écoulé</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="duel-ui-frame duel-battle-mockup" aria-label="Maquette d’un duel en cours">
      <header className="duel-battle-header">
        <div className="duel-player is-you"><MiniAvatar name={profile.name} /><div><small>TOI</small><strong>{profile.name.split(" ")[0]}</strong></div><b>2</b></div>
        <div className="duel-battle-round"><span>{isCompound ? `PARTIE ${questionCount} / ${questionCount}` : `QUESTION ${questionCount} / ${questionCount}`} · {difficulty.label.toUpperCase()}</span><strong>{isCompound ? "01:24" : "00:18"}</strong><i><em /></i></div>
        <div className="duel-player is-rival"><b>1</b><div><small>ADVERSAIRE</small><strong>Aïcha</strong></div><MiniAvatar name="Aïcha Koné" tone="orange" /></div>
      </header>
      <div className="duel-referee"><CompanionAvatar motion="blink" decorative /><span>{isCompound ? "Dernière partie de l’exercice" : "Dernière question"} · Le bilan restera masqué tant qu’Aïcha joue encore.</span></div>
      {isCompound ? (
        <article className="duel-question-card duel-compound-card">
          <span>EXERCICE COMPOSÉ · {lessonLabel.toUpperCase()}</span>
          <h2>Un seul énoncé, plusieurs étapes de raisonnement.</h2>
          <div className="duel-compound-statement">
            <strong>Énoncé commun</strong>
            <p>On étudie une situation liée à « {preview.reviewLabel} ». Pour chaque partie, saisis uniquement la réponse finale attendue.</p>
          </div>
          <ol className="duel-compound-progress">
            <li className="is-complete"><span>1</span><p>Repérer les données utiles et la notion principale.</p><CheckCircle size={18} weight="fill" /></li>
            <li className="is-complete"><span>2</span><p>Choisir puis appliquer la méthode adaptée.</p><CheckCircle size={18} weight="fill" /></li>
            {questionCount > 3 ? <li className="is-complete"><span>{questionCount - 1}</span><p>Calculer le résultat intermédiaire demandé.</p><CheckCircle size={18} weight="fill" /></li> : null}
            <li className="is-current"><span>{questionCount}</span><p>{preview.question}</p><em>À rédiger</em></li>
          </ol>
          <label className="duel-written-answer">
            <span>TA RÉPONSE FINALE</span>
            <textarea
              ref={answerInputRef}
              value={writtenAnswer}
              onChange={(event) => setWrittenAnswer(event.target.value)}
              placeholder="Ex. 3, +∞, x = 2…"
              rows={2}
            />
          </label>
          <div className="duel-formula-tools">
            <button
              className="duel-formula-toggle"
              type="button"
              onClick={() => setFormulaKeyboardOpen((isOpen) => !isOpen)}
              aria-expanded={formulaKeyboardOpen}
              aria-controls="duel-formula-keyboard"
            >
              <Keyboard size={18} weight="duotone" />
              {formulaKeyboardOpen ? "Réduire le clavier de formules" : "Afficher le clavier de formules"}
            </button>
            {formulaKeyboardOpen ? (
              <div id="duel-formula-keyboard" className="duel-formula-keyboard" role="group" aria-label="Clavier de symboles mathématiques">
                {formulaKeyboardKeys.map((symbol) => (
                  <button key={symbol} type="button" onClick={() => insertFormulaSymbol(symbol)} aria-label={`Insérer ${symbol}`}>{symbol}</button>
                ))}
                <button className="is-control" type="button" onClick={removeLastFormulaCharacter} aria-label="Effacer le dernier caractère"><Backspace size={18} weight="duotone" /></button>
                <button className="is-control is-clear" type="button" onClick={() => setWrittenAnswer("")}>Tout effacer</button>
              </div>
            ) : null}
          </div>
          <button className="duel-lock-answer" type="button" onClick={() => setPhase("waiting")} disabled={!writtenAnswer.trim()}>Valider ma réponse <ShieldCheck size={18} weight="fill" /></button>
        </article>
      ) : (
        <article className="duel-question-card">
          <span>QCM · {lessonLabel.toUpperCase()}</span>
          <h2>{preview.question}</h2>
          <div className="duel-answer-grid">
            {preview.answers.map((answer, index) => {
              const isSelected = index === selectedAnswer;
              return (
                <button
                  key={answer}
                  className={isSelected ? "is-selected" : ""}
                  type="button"
                  onClick={() => setSelectedAnswer(index)}
                  aria-pressed={isSelected}
                >
                  {String.fromCharCode(65 + index)}
                  <strong>{answer}</strong>
                  {isSelected ? <CheckCircle size={20} weight="fill" /> : null}
                </button>
              );
            })}
          </div>
          <button className="duel-lock-answer" type="button" onClick={() => setPhase("waiting")} disabled={selectedAnswer === null}>Valider ma dernière réponse <ShieldCheck size={18} weight="fill" /></button>
        </article>
      )}
      <footer className="duel-battle-footer"><span><Lightning size={17} weight="fill" /> {isCompound ? "Le barème compare uniquement la réponse finale attendue." : "Bonus de vitesse uniquement si la réponse est juste."}</span><span>Équité : aucune correction avant la fin des deux joueurs.</span></footer>
    </section>
  );
}

export function DuelPreviewPage({ profile, level, subject: initialSubject, subjects, onBackArena }: DuelPreviewPageProps) {
  const availableDuelSubjects = useMemo(() => {
    const withPublishedLessons = subjects.filter((option) => getDuelLessons(level.id, option.id).length > 0);
    return withPublishedLessons.length > 0 ? withPublishedLessons : [initialSubject];
  }, [initialSubject, level.id, subjects]);
  const initialDuelSubject = availableDuelSubjects.find((option) => option.id === initialSubject.id) ?? availableDuelSubjects[0];
  const [activeScreen, setActiveScreen] = useState<DuelScreenId>("lobby");
  const [isMobileLayout, setIsMobileLayout] = useState(() => (
    typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches
  ));
  const [duelSubjectId, setDuelSubjectId] = useState<SubjectId>(initialDuelSubject.id);
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>(() => {
    const firstLesson = getDuelLessons(level.id, initialDuelSubject.id)[0];
    return firstLesson ? [firstLesson.id] : [];
  });
  const [formatId, setFormatId] = useState<DuelFormatId>("qcm");
  const [difficultyId, setDifficultyId] = useState<DuelDifficultyId>("medium");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [invitationDecision, setInvitationDecision] = useState<InvitationDecision>("pending");
  const subject = availableDuelSubjects.find((option) => option.id === duelSubjectId) ?? initialDuelSubject;
  const lessonOptions = useMemo(() => getDuelLessons(level.id, subject.id), [level.id, subject.id]);
  const selectedLessons = useMemo(
    () => lessonOptions.filter((lesson) => selectedLessonIds.includes(lesson.id)),
    [lessonOptions, selectedLessonIds],
  );
  const lessonTitles = selectedLessons.map((lesson) => lesson.title);
  const format = duelFormats.find((option) => option.id === formatId) ?? duelFormats[0];
  const difficulty = difficulties.find((option) => option.id === difficultyId) ?? difficulties[1];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 760px)");
    const updateLayout = () => setIsMobileLayout(mediaQuery.matches);
    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  const goTo = (id: DuelScreenId) => setActiveScreen(id);
  const changeDuelSubject = (nextSubjectId: SubjectId) => {
    const nextLessons = getDuelLessons(level.id, nextSubjectId);
    setDuelSubjectId(nextSubjectId);
    setSelectedLessonIds(nextLessons[0] ? [nextLessons[0].id] : []);
  };
  const toggleDuelLesson = (lessonId: string) => {
    setSelectedLessonIds((current) => {
      if (!current.includes(lessonId)) return [...current, lessonId];
      return current.length > 1 ? current.filter((id) => id !== lessonId) : current;
    });
  };
  const toggleAllDuelLessons = () => {
    setSelectedLessonIds((current) => {
      if (lessonOptions.length === 0) return [];
      return current.length === lessonOptions.length ? [lessonOptions[0].id] : lessonOptions.map((lesson) => lesson.id);
    });
  };
  const changeFormat = (nextFormatId: DuelFormatId) => {
    setFormatId(nextFormatId);
    setQuestionCount(nextFormatId === "compound" ? 4 : 10);
  };
  const acceptInvitation = () => {
    setInvitationDecision("accepted");
    goTo("battle");
  };
  const declineInvitation = () => setInvitationDecision("declined");
  const resetInvitation = () => setInvitationDecision("pending");

  const renderScreen = () => {
    if (activeScreen === "setup") {
      return (
        <DuelSetupMockup
          level={level}
          subject={subject}
          subjectOptions={availableDuelSubjects}
          lessonOptions={lessonOptions}
          selectedLessonIds={selectedLessonIds}
          format={format}
          difficulty={difficulty}
          questionCount={questionCount}
          onSubjectChange={changeDuelSubject}
          onLessonToggle={toggleDuelLesson}
          onSelectAllLessons={toggleAllDuelLessons}
          onFormatChange={changeFormat}
          onDifficultyChange={setDifficultyId}
          onQuestionCountChange={setQuestionCount}
          onBack={() => goTo("lobby")}
          onSelect={() => {
            resetInvitation();
            goTo("inbox");
          }}
        />
      );
    }
    if (activeScreen === "inbox") {
      return (
        <DuelInboxMockup
          profile={profile}
          subject={subject}
          lessonTitles={lessonTitles}
          format={format}
          difficulty={difficulty}
          questionCount={questionCount}
          decision={invitationDecision}
          onAccept={acceptInvitation}
          onDecline={declineInvitation}
          onShowLive={() => {
            resetInvitation();
            goTo("liveInvite");
          }}
        />
      );
    }
    if (activeScreen === "liveInvite") {
      return (
        <DuelLiveInviteMockup
          profile={profile}
          subject={subject}
          lessonTitles={lessonTitles}
          format={format}
          difficulty={difficulty}
          questionCount={questionCount}
          decision={invitationDecision}
          onAccept={acceptInvitation}
          onDecline={declineInvitation}
          onReset={resetInvitation}
        />
      );
    }
    if (activeScreen === "battle") {
      return (
        <DuelBattleMockup
          profile={profile}
          subject={subject}
          lessonTitles={lessonTitles}
          format={format}
          difficulty={difficulty}
          questionCount={questionCount}
          onRematch={() => {
            resetInvitation();
            goTo("setup");
          }}
        />
      );
    }
    return <DuelLobbyMockup profile={profile} level={level} subject={subject} onSelect={() => goTo("setup")} />;
  };

  return (
    <main className="duel-preview-page">
      <header className="duel-preview-header">
        <button className="path-back-button" type="button" onClick={onBackArena}><ArrowLeft size={20} weight="bold" />Arène</button>
        <div><p>PROTOTYPE VISUEL · AUCUN DUEL RÉEL N’EST LANCÉ</p><h1>Les Duels de Davy</h1></div>
      </header>

      <section className="duel-preview-intro">
        <div><span><Sword size={25} weight="duotone" /></span><p>UNE EXPÉRIENCE À VALIDER</p><h2>Du défi à la correction, sans changer de page.</h2><p>Teste les réglages, l’invitation, l’attente de l’adversaire et le bilan intégré avant que nous connections les vrais joueurs.</p></div>
        <CompanionAvatar motion="celebrate" className="duel-preview-davy" decorative />
      </section>

      <section className="duel-preview-stage" aria-live="polite">
        <div className={`duel-preview-browser${isMobileLayout ? " is-mobile" : ""}`}>
          {renderScreen()}
        </div>
      </section>

      <footer className="duel-preview-feedback">
        <span><Sparkle size={23} weight="duotone" /></span>
        <div><strong>Une seule page pour jouer, patienter et comprendre.</strong><p>La maquette conserve les invitations fictives : aucun vrai duel n’est envoyé tant que ce parcours n’est pas validé.</p></div>
        <button type="button" onClick={() => goTo("lobby")}>Revoir depuis le début</button>
      </footer>
    </main>
  );
}
