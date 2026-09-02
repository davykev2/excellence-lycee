import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpenText,
  Brain,
  Calculator,
  ChartLine,
  CheckCircle,
  ClipboardText,
  Clock,
  Fire,
  GraduationCap,
  Lightning,
  Medal,
  PencilLine,
  Sparkle,
  Sword,
  Trophy,
  UsersThree,
} from "@phosphor-icons/react";
import type { LearnerProfile, SchoolLevel, SubjectDefinition, SubjectId } from "../../domain/learning";
import type { UserRole } from "../../domain/auth";
import { formatXp } from "../../data/xpRewards";
import { getBacExamBySlug, type BacExamSlug } from "../../data/bacExamCatalog";
import { canAccessBacExams } from "../../routing/routeAccess";
import { CompanionAvatar } from "../companion/CompanionAvatar";
import { ArenaExercisesPage } from "./ArenaExercisesPage";
import { MathCodexPage } from "../codex/MathCodexPage";
import { DuelPreviewPage } from "./DuelPreviewPage";
import { BacCi2024ExamPage } from "./BacCi2024ExamPage";
import { BacExamLibraryPage } from "./BacExamLibraryPage";
import { BacArchiveExamPage } from "./BacArchiveExamPage";

interface ArenaScreenProps {
  profile: LearnerProfile;
  level: SchoolLevel;
  subject: SubjectDefinition;
  subjects: SubjectDefinition[];
  totalXp: number;
  role: UserRole;
  exercisesOpen: boolean;
  codexOpen: boolean;
  duelOpen: boolean;
  bacExamOpen: boolean;
  bacExamSlug?: string;
  bacResultsOpen: boolean;
  exerciseEditorOpen: boolean;
  localOnly?: boolean;
  onSubjectChange: (subjectId: SubjectId) => void;
  onBackHome: () => void;
  onOpenExercises: () => void;
  onOpenCodex: () => void;
  onOpenDuel: () => void;
  onOpenBacExam: () => void;
  onSelectBacExam: (slug: BacExamSlug) => void;
  onOpenBacResults: () => void;
  onBackBacExam: () => void;
  onBackArena: () => void;
  onOpenExerciseEditor: () => void;
  onCloseExerciseEditor: () => void;
}

const arenaModes = [
  {
    id: "exercises",
    title: "Exercices",
    label: "Entraînement libre",
    description: "Travaille une notion précise avec des exercices progressifs et des corrections détaillées.",
    icon: PencilLine,
    tone: "green",
    metric: "12 séries",
    action: "Choisir une série",
    featured: "Série ciblée • Fonctions et vecteurs",
    featuredDescription: "8 exercices classés du niveau fondamental au niveau approfondi.",
    highlights: ["Difficulté progressive", "Correction expliquée", "Tentatives illimitées"],
  },
  {
    id: "codex",
    title: "Codex",
    label: "Laboratoire interactif",
    description: "Trace des fonctions et explore les constructions de géométrie, les similitudes et les nombres complexes.",
    icon: ChartLine,
    tone: "blue",
    metric: "4 outils",
    action: "Ouvrir le Codex",
    featured: "Codex Mathématiques",
    featuredDescription: "Manipule les objets mathématiques et observe immédiatement ce qui change.",
    highlights: ["Courbes et tangentes", "Constructions dynamiques", "Calculs expliqués"],
  },
  {
    id: "homework",
    title: "Devoirs",
    label: "Conditions de classe",
    description: "Compose sur plusieurs notions avec une durée limitée et une note finale sur 20.",
    icon: ClipboardText,
    tone: "navy",
    metric: "3 devoirs",
    action: "Voir les devoirs",
    featured: "Devoir surveillé n°1",
    featuredDescription: "Fonctions numériques • 45 minutes • Barème sur 20.",
    highlights: ["Chronomètre", "Barème par question", "Bilan des compétences"],
  },
  {
    id: "duel",
    title: "Duel",
    label: "Face-à-face",
    description: "Affronte un élève de ton niveau sur les mêmes questions, en temps réel.",
    icon: Sword,
    tone: "orange",
    metric: "1 contre 1",
    action: "Préparer un duel",
    featured: "Duel éclair",
    featuredDescription: "5 questions • 3 minutes • Adversaire de niveau similaire.",
    highlights: ["Adversaire équitable", "Questions synchronisées", "Bonus de victoire"],
  },
  {
    id: "bac",
    title: "Exos type BAC",
    label: "Objectif examen",
    description: "Résous des problèmes complets inspirés des attendus du baccalauréat ivoirien.",
    icon: GraduationCap,
    tone: "gold",
    metric: "6 sujets",
    action: "Explorer les sujets",
    featured: "Problème type BAC • Analyse",
    featuredDescription: "Raisonnement guidé, rédaction et grille de correction.",
    highlights: ["Sujets contextualisés", "Méthode de rédaction", "Corrigé type jury"],
  },
  {
    id: "competition",
    title: "Compétition",
    label: "Événement collectif",
    description: "Participe aux tournois hebdomadaires de ta classe et grimpe dans le classement.",
    icon: Trophy,
    tone: "purple",
    metric: "Chaque samedi",
    action: "Voir la compétition",
    featured: "Coupe Excellence • Semaine 1",
    featuredDescription: "Qualification individuelle puis finale entre les meilleurs élèves.",
    highlights: ["Classement par niveau", "Manches thématiques", "Récompenses et badges"],
  },
  {
    id: "quiz",
    title: "Quiz",
    label: "Défi rapide",
    description: "Teste tes réflexes en quelques minutes avec des questions courtes et variées.",
    icon: Lightning,
    tone: "blue",
    metric: "5 questions",
    action: "Lancer le quiz",
    featured: "Quiz du jour",
    featuredDescription: "Un mélange rapide adapté à ta progression actuelle.",
    highlights: ["Moins de 5 minutes", "Résultat immédiat", "Nouveau quiz chaque jour"],
  },
] as const;

type ArenaModeId = typeof arenaModes[number]["id"];

const subjectIcons: Partial<Record<SubjectId, typeof Calculator>> = {
  mathematics: Calculator,
  "physics-chemistry": Atom,
};

export function ArenaScreen({
  profile,
  level,
  subject,
  subjects,
  totalXp,
  role,
  exercisesOpen,
  codexOpen,
  duelOpen,
  bacExamOpen,
  bacExamSlug,
  bacResultsOpen,
  exerciseEditorOpen,
  localOnly = false,
  onSubjectChange,
  onBackHome,
  onOpenExercises,
  onOpenCodex,
  onOpenDuel,
  onOpenBacExam,
  onSelectBacExam,
  onOpenBacResults,
  onBackBacExam,
  onBackArena,
  onOpenExerciseEditor,
  onCloseExerciseEditor,
}: ArenaScreenProps) {
  const [selectedModeId, setSelectedModeId] = useState<ArenaModeId>("exercises");
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);
  const availableArenaModes = useMemo(
    () => arenaModes.filter((mode) => mode.id !== "bac" || canAccessBacExams({ levelId: level.id, role })),
    [level.id, role],
  );
  const selectedMode = useMemo(
    () => availableArenaModes.find((mode) => mode.id === selectedModeId) ?? availableArenaModes[0],
    [availableArenaModes, selectedModeId],
  );
  const SelectedIcon = selectedMode.icon;

  const selectMode = (modeId: ArenaModeId) => {
    if (modeId === "exercises") {
      onOpenExercises();
      return;
    }
    if (modeId === "codex") {
      onOpenCodex();
      return;
    }
    if (modeId === "duel") {
      onOpenDuel();
      return;
    }
    if (modeId === "bac") {
      onOpenBacExam();
      return;
    }
    setSelectedModeId(modeId);
    setSelectionMessage(null);
    window.setTimeout(() => document.getElementById("arena-selected-mode")?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 0);
  };

  const confirmMode = () => {
    if (selectedMode.id === "exercises") {
      onOpenExercises();
      return;
    }
    if (selectedMode.id === "codex") {
      onOpenCodex();
      return;
    }
    if (selectedMode.id === "duel") {
      onOpenDuel();
      return;
    }
    if (selectedMode.id === "bac") {
      onOpenBacExam();
      return;
    }
    setSelectionMessage(`Mode « ${selectedMode.title} » sélectionné pour ${subject.label}. La prochaine étape sera de connecter sa banque d’épreuves.`);
  };

  if (exercisesOpen) {
    return (
      <ArenaExercisesPage
        profile={profile}
        level={level}
        subject={subject}
        canEdit={role === "admin" || role === "content_editor"}
        canPublish={role === "admin"}
        editorOpen={exerciseEditorOpen}
        localOnly={localOnly}
        onBackArena={onBackArena}
        onOpenEditor={onOpenExerciseEditor}
        onCloseEditor={onCloseExerciseEditor}
      />
    );
  }

  if (codexOpen) return <MathCodexPage onBackArena={onBackArena} />;

  if (duelOpen) {
    return <DuelPreviewPage profile={profile} level={level} subject={subject} subjects={subjects} onBackArena={onBackArena} />;
  }

  if (bacExamOpen) {
    const selectedBacExam = getBacExamBySlug(bacExamSlug);
    if (!selectedBacExam) {
      return (
        <BacExamLibraryPage
          preview={localOnly}
          onBackArena={onBackArena}
          onOpenExam={onSelectBacExam}
        />
      );
    }
    if (selectedBacExam.format === "facsimile") {
      return (
        <BacArchiveExamPage
          exam={selectedBacExam}
          preview={localOnly}
          onBackLibrary={onOpenBacExam}
        />
      );
    }
    return (
      <BacCi2024ExamPage
        profile={profile}
        resultsOpen={bacResultsOpen}
        localOnly={localOnly}
        onBackArena={onOpenBacExam}
        onOpenResults={onOpenBacResults}
        onBackExam={onBackBacExam}
      />
    );
  }

  return (
    <main className="arena-page">
      <header className="arena-page-header">
        <button className="path-back-button" type="button" onClick={onBackHome}><ArrowLeft size={20} weight="bold" />Accueil</button>
        <div className="arena-school-context"><span>{level.label}</span><strong>{subject.label}</strong></div>
      </header>

      <section className="arena-hero" aria-labelledby="arena-title">
        <div className="arena-hero-copy">
          <p className="arena-kicker"><Fire size={18} weight="fill" /> Zone d’entraînement Excellence</p>
          <h1 id="arena-title">Bienvenue dans l’Arène</h1>
          <p>Choisis ton défi, mesure tes progrès et deviens meilleur à chaque tentative.</p>
          <div className="arena-hero-stats">
            <span><Medal size={20} weight="duotone" /><strong>{formatXp(totalXp)}</strong> XP gagnés</span>
            <span><Sparkle size={20} weight="duotone" /><strong>{availableArenaModes.length}</strong> modes</span>
            <span><UsersThree size={20} weight="duotone" /><strong>{level.label}</strong></span>
          </div>
        </div>
        <div className="arena-davy">
          <CompanionAvatar motion="celebrate" className="arena-davy-avatar" decorative />
          <div><strong>Prêt, {profile.name.split(" ")[0]} ?</strong><span>Choisis ton premier défi !</span></div>
        </div>
      </section>

      <section className="arena-subject-section" aria-labelledby="arena-subject-title">
        <div><p className="path-kicker">Étape 1</p><h2 id="arena-subject-title">Choisis la matière</h2></div>
        <div className="arena-subjects" role="group" aria-label="Matière de l’Arène">
          {subjects.map((item) => {
            const Icon = subjectIcons[item.id] ?? BookOpenText;
            return (
              <button className={item.id === subject.id ? "is-active" : ""} type="button" key={item.id} disabled={!item.enabled} onClick={() => onSubjectChange(item.id)}>
                <Icon size={20} weight="duotone" /><span>{item.shortLabel}</span>{!item.enabled && <small>Bientôt</small>}
              </button>
            );
          })}
        </div>
      </section>

      <section className="arena-modes-section" aria-labelledby="arena-modes-title">
        <div className="arena-section-heading"><div><p className="path-kicker">Étape 2</p><h2 id="arena-modes-title">Choisis ton mode</h2></div><span>Solo, examen ou multijoueur</span></div>
        <div className="arena-mode-grid">
          {availableArenaModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = mode.id === selectedModeId;
            return (
              <button className={`arena-mode-card is-${mode.tone} ${isActive ? "is-active" : ""}`} type="button" key={mode.id} aria-pressed={isActive} onClick={() => selectMode(mode.id)}>
                <span className="arena-mode-icon"><Icon size={31} weight="duotone" /></span>
                <span className="arena-mode-copy"><small>{mode.label}</small><strong>{mode.title}</strong><span>{mode.description}</span></span>
                <span className="arena-mode-metric">{mode.metric}</span>
                <ArrowRight className="arena-mode-arrow" size={20} weight="bold" />
              </button>
            );
          })}
        </div>
      </section>

      <section id="arena-selected-mode" className={`arena-selected-mode is-${selectedMode.tone}`} aria-live="polite">
        <div className="arena-selected-visual"><SelectedIcon size={62} weight="duotone" /><span>{selectedMode.metric}</span></div>
        <div className="arena-selected-copy">
          <p className="path-kicker">{selectedMode.label}</p>
          <h2>{selectedMode.featured}</h2>
          <p>{selectedMode.featuredDescription}</p>
          <ul>{selectedMode.highlights.map((highlight) => <li key={highlight}><CheckCircle size={19} weight="fill" /><span>{highlight}</span></li>)}</ul>
        </div>
        <div className="arena-selected-action">
          <span><Clock size={19} weight="duotone" />Adapté à {level.label}</span>
          <button className="primary-action is-compact" type="button" onClick={confirmMode}>{selectedMode.action}<ArrowRight size={20} weight="bold" /></button>
        </div>
      </section>

      {selectionMessage && <div className="arena-selection-message" role="status"><Brain size={22} weight="duotone" /><span>{selectionMessage}</span></div>}
    </main>
  );
}
