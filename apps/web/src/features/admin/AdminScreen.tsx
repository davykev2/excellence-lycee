import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  Bell,
  BookOpenText,
  ChartBar,
  Check,
  CheckCircle,
  Cloud,
  Database,
  Gear,
  GraduationCap,
  MagnifyingGlass,
  Plus,
  ShieldCheck,
  Student,
  UserCircle,
  Users,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import type {
  AdminContentItem,
  AdminSection,
  AdminSettings,
  AdminUser,
  NewAdminContent,
  PublicationStatus,
  UserRole,
  UserStatus,
} from "../../domain/admin";
import type { SubjectId } from "../../domain/learning";
import { schoolLevels, subjects } from "../../data/programme";
import { adminActivity } from "../../data/admin";
import { formatXp } from "../../data/xpRewards";
import { useAuth } from "../auth/AuthProvider";
import { useAdminUsers } from "./useAdminUsers";
import { useAdminWorkspace } from "./useAdminWorkspace";
import { useAdminLessonContents } from "./useAdminLessonContents";
import { LessonContentStudio } from "./LessonContentStudio";

const sections: Array<{ id: AdminSection; label: string }> = [
  { id: "overview", label: "Pilotage" },
  { id: "content", label: "Contenus" },
  { id: "users", label: "Utilisateurs" },
  { id: "operations", label: "Opérations" },
  { id: "settings", label: "Réglages" },
];

const publicationLabels: Record<PublicationStatus, string> = {
  published: "Publié",
  review: "À valider",
  draft: "Brouillon",
};

const roleLabels: Record<UserRole, string> = {
  student: "Élève",
  teacher: "Enseignant",
  content_editor: "Éditeur de contenus",
  admin: "Administrateur",
};

const kindLabels: Record<AdminContentItem["kind"], string> = {
  path: "Parcours",
  chapter: "Chapitre",
  lesson: "Leçon",
};

interface CreateContentDialogProps {
  onClose: () => void;
  onCreate: (content: NewAdminContent) => void;
}

function CreateContentDialog({ onClose, onCreate }: CreateContentDialogProps) {
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState<SubjectId>("mathematics");
  const [levelLabel, setLevelLabel] = useState("Seconde C");
  const [kind, setKind] = useState<AdminContentItem["kind"]>("chapter");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onCreate({ title: title.trim(), subjectId, levelLabel, kind });
    onClose();
  };

  return (
    <div className="overlay admin-dialog-overlay" role="presentation">
      <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title">
        <header>
          <div>
            <span>Nouveau contenu</span>
            <h2 id="admin-dialog-title">Préparer la prochaine ressource</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fermer">
            <X size={21} weight="bold" />
          </button>
        </header>
        <form onSubmit={submit}>
          <label className="admin-field is-wide">
            <span>Titre</span>
            <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex. Fonctions affines" />
          </label>
          <label className="admin-field">
            <span>Type de contenu</span>
            <select value={kind} onChange={(event) => setKind(event.target.value as AdminContentItem["kind"])}>
              <option value="path">Parcours</option>
              <option value="chapter">Chapitre</option>
              <option value="lesson">Leçon</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Matière</span>
            <select value={subjectId} onChange={(event) => setSubjectId(event.target.value as SubjectId)}>
              {Object.values(subjects).map((subject) => <option key={subject.id} value={subject.id}>{subject.label}</option>)}
            </select>
          </label>
          <label className="admin-field is-wide">
            <span>Niveau et série</span>
            <select value={levelLabel} onChange={(event) => setLevelLabel(event.target.value)}>
              <option>Seconde A</option>
              <option>Seconde C</option>
              <option>Première A</option>
              <option>Première C</option>
              <option>Première D</option>
              <option>Terminale A</option>
              <option>Terminale C</option>
              <option>Terminale D</option>
            </select>
          </label>
          <div className="admin-dialog-actions">
            <button className="secondary-action" type="button" onClick={onClose}>Annuler</button>
            <button className="primary-action is-compact" type="submit" disabled={!title.trim()}>
              <Plus size={19} weight="bold" />
              Créer le brouillon
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function EditUserLevelDialog({
  user,
  onClose,
  onSave,
}: {
  user: AdminUser;
  onClose: () => void;
  onSave: (userId: string, levelId: string) => Promise<void>;
}) {
  const [levelId, setLevelId] = useState(user.levelId ?? "seconde-c");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(user.id, levelId);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "La modification n’a pas pu être enregistrée.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay admin-dialog-overlay" role="presentation">
      <section className="admin-dialog admin-level-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-level-dialog-title">
        <header>
          <div>
            <span>Profil scolaire</span>
            <h2 id="admin-level-dialog-title">Modifier le niveau de {user.name}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Fermer" disabled={saving}>
            <X size={21} weight="bold" />
          </button>
        </header>
        <form onSubmit={submit}>
          <div className="admin-level-user is-wide">
            <UserCircle size={30} weight="duotone" />
            <span><strong>{user.name}</strong><small>{user.email}</small></span>
          </div>
          <label className="admin-field is-wide">
            <span>Niveau et série</span>
            <select value={levelId} onChange={(event) => setLevelId(event.target.value)} disabled={saving}>
              {schoolLevels.map((level) => <option key={level.id} value={level.id}>{level.label}</option>)}
            </select>
          </label>
          <p className="admin-level-note is-wide">Les parcours, l’Arène et les classements de cet utilisateur suivront désormais ce niveau et cette série. Sa progression déjà acquise reste conservée.</p>
          {error && <p className="admin-dialog-error is-wide" role="alert">{error}</p>}
          <div className="admin-dialog-actions">
            <button className="secondary-action" type="button" onClick={onClose} disabled={saving}>Annuler</button>
            <button className="primary-action is-compact" type="submit" disabled={saving || levelId === user.levelId}>
              {saving ? "Enregistrement…" : "Enregistrer le niveau"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function SettingToggle({
  label,
  description,
  checked,
  onChange,
  danger = false,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  danger?: boolean;
}) {
  return (
    <label className={`admin-setting-toggle ${danger ? "is-danger" : ""}`}>
      <span><strong>{label}</strong><small>{description}</small></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}

interface AdminScreenProps {
  preview?: boolean;
  activeSection?: AdminSection;
  contentStudioOpen?: boolean;
  onNavigate?: (section: AdminSection, studioOpen?: boolean) => void;
}

export function AdminScreen({
  preview = false,
  activeSection: controlledActiveSection,
  contentStudioOpen: controlledContentStudioOpen,
  onNavigate,
}: AdminScreenProps) {
  const { user: currentAdmin } = useAuth();
  const {
    workspace,
    resolveTask,
    updateContentStatus,
    createContent,
    updateSettings,
  } = useAdminWorkspace();
  const {
    users: adminUsers,
    loading: usersLoading,
    error: usersError,
    updatingUserId,
    reload: reloadUsers,
    updateUserLevel,
  } = useAdminUsers();
  const lessonContents = useAdminLessonContents({ disabled: preview });
  const [internalActiveSection, setInternalActiveSection] = useState<AdminSection>("overview");
  const [contentQuery, setContentQuery] = useState("");
  const [contentStatus, setContentStatus] = useState<PublicationStatus | "all">("all");
  const [userQuery, setUserQuery] = useState("");
  const [userStatus, setUserStatus] = useState<UserStatus | "all">("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [internalContentStudioOpen, setInternalContentStudioOpen] = useState(preview);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const activeSection = controlledActiveSection ?? internalActiveSection;
  const showContentStudio = controlledContentStudioOpen ?? internalContentStudioOpen;

  const selectSection = (section: AdminSection) => {
    if (onNavigate) onNavigate(section, false);
    else {
      setInternalActiveSection(section);
      setInternalContentStudioOpen(false);
    }
  };

  const setContentStudioOpen = (open: boolean) => {
    if (onNavigate) onNavigate("content", open);
    else {
      setInternalActiveSection("content");
      setInternalContentStudioOpen(open);
    }
  };

  const currentAdminName = currentAdmin?.name ?? "Administrateur";
  const currentAdminInitials = currentAdminName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "AD";

  const openTasks = workspace.tasks.filter((task) => !task.resolved);
  const activeUsers = adminUsers.filter((user) => user.status === "active").length;
  const publishedContents = workspace.contents.filter((content) => content.status === "published").length;
  const filteredContents = useMemo(() => {
    const query = contentQuery.trim().toLocaleLowerCase("fr");
    return workspace.contents.filter((content) => {
      const matchesQuery = !query || `${content.title} ${subjects[content.subjectId].label} ${content.levelLabel}`.toLocaleLowerCase("fr").includes(query);
      return matchesQuery && (contentStatus === "all" || content.status === contentStatus);
    });
  }, [contentQuery, contentStatus, workspace.contents]);
  const filteredUsers = useMemo(() => {
    const query = userQuery.trim().toLocaleLowerCase("fr");
    return adminUsers.filter((user) => {
      const matchesQuery = !query || `${user.name} ${user.email} ${user.levelLabel ?? ""}`.toLocaleLowerCase("fr").includes(query);
      return matchesQuery && (userStatus === "all" || user.status === userStatus);
    });
  }, [adminUsers, userQuery, userStatus]);

  const notify = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2300);
  };

  const changeContentStatus = (contentId: string, status: PublicationStatus) => {
    updateContentStatus(contentId, status);
    notify(status === "published" ? "Contenu publié." : status === "review" ? "Contenu envoyé en validation." : "Contenu replacé en brouillon.");
  };

  const saveUserLevel = async (userId: string, levelId: string) => {
    await updateUserLevel(userId, levelId);
    notify("Niveau et série mis à jour.");
  };

  if (showContentStudio) {
    return (
      <LessonContentStudio
        contents={lessonContents.contents}
        loading={lessonContents.loading}
        error={lessonContents.error}
        onReload={lessonContents.reload}
        onSave={lessonContents.save}
        onSetStatus={lessonContents.setStatus}
        onLoadRevisions={lessonContents.loadRevisions}
        onRestoreRevision={lessonContents.restoreRevision}
        onClose={() => setContentStudioOpen(false)}
        onNotify={notify}
      />
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow"><ShieldCheck size={18} weight="duotone" /> Accès sécurisé</p>
          <h1>Centre d’administration</h1>
          <p>Pilote les contenus, les utilisateurs et les opérations d’Excellence Lycée.</p>
        </div>
        <div className="admin-header-actions">
          <button className="admin-notification-button" type="button" onClick={() => selectSection("operations")} aria-label={`${openTasks.length} actions à traiter`}>
            <Bell size={23} weight="duotone" />
            {openTasks.length > 0 && <span>{openTasks.length}</span>}
          </button>
          <div className="admin-account">
            <span>{currentAdminInitials}</span>
            <div><strong>{currentAdminName}</strong><small>Administrateur</small></div>
          </div>
        </div>
      </header>

      <nav className="admin-section-tabs" aria-label="Sections de l’administration">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={activeSection === section.id ? "is-active" : ""}
            aria-current={activeSection === section.id ? "page" : undefined}
            onClick={() => selectSection(section.id)}
          >
            {section.label}
            {section.id === "operations" && openTasks.length > 0 && <span>{openTasks.length}</span>}
          </button>
        ))}
      </nav>

      {activeSection === "overview" && (
        <div className="admin-section" data-testid="admin-overview">
          <section className="admin-kpi-grid" aria-label="Indicateurs principaux">
            <article className="admin-kpi-card is-navy">
              <span><Student size={25} weight="duotone" /></span>
              <div><strong>1 248</strong><p>apprenants inscrits</p><small>+84 ce mois-ci</small></div>
            </article>
            <article className="admin-kpi-card">
              <span><ChartBar size={25} weight="duotone" /></span>
              <div><strong>68%</strong><p>taux d’assiduité</p><small>+6 points cette semaine</small></div>
            </article>
            <article className="admin-kpi-card">
              <span><BookOpenText size={25} weight="duotone" /></span>
              <div><strong>{publishedContents}</strong><p>parcours publié</p><small>{workspace.contents.filter((item) => item.status !== "published").length} contenus en préparation</small></div>
            </article>
            <article className="admin-kpi-card is-orange">
              <span><WarningCircle size={25} weight="duotone" /></span>
              <div><strong>{openTasks.length}</strong><p>actions à traiter</p><small>{openTasks.filter((task) => task.priority === "urgent").length} urgente</small></div>
            </article>
          </section>

          <section className="admin-overview-grid">
            <article className="admin-panel admin-activity-panel">
              <header className="admin-panel-header">
                <div><p className="admin-eyebrow">Activité pédagogique</p><h2>Engagement sur 7 jours</h2></div>
                <span className="admin-live-pill"><i /> Données à jour</span>
              </header>
              <div className="admin-chart-legend"><span><i className="is-sessions" /> Sessions</span><span><i className="is-completed" /> Leçons terminées</span></div>
              <div className="admin-activity-chart" aria-label="Graphique de l’activité des sept derniers jours">
                {adminActivity.map((item) => (
                  <div className="admin-activity-day" key={item.day}>
                    <div className="admin-activity-bars">
                      <i className="is-sessions" style={{ "--admin-bar-height": `${item.sessions}%` } as CSSProperties} title={`${item.sessions} sessions`} />
                      <i className="is-completed" style={{ "--admin-bar-height": `${item.completed}%` } as CSSProperties} title={`${item.completed} leçons terminées`} />
                    </div>
                    <span>{item.day}</span>
                  </div>
                ))}
              </div>
            </article>

            <article className="admin-panel admin-priority-panel">
              <header className="admin-panel-header">
                <div><p className="admin-eyebrow">File opérationnelle</p><h2>À traiter maintenant</h2></div>
                <button type="button" onClick={() => selectSection("operations")}>Tout voir</button>
              </header>
              <div className="admin-priority-list">
                {openTasks.slice(0, 3).map((task) => (
                  <div className="admin-priority-item" key={task.id}>
                    <span className={`admin-priority-dot is-${task.priority}`} />
                    <div><strong>{task.title}</strong><small>{task.createdAt}</small></div>
                    <button type="button" onClick={() => { resolveTask(task.id); notify("Action marquée comme traitée."); }} aria-label={`Traiter : ${task.title}`}><Check size={18} weight="bold" /></button>
                  </div>
                ))}
                {openTasks.length === 0 && <p className="admin-empty-state">Toutes les actions ont été traitées.</p>}
              </div>
            </article>
          </section>

          <section className="admin-panel admin-subject-panel">
            <header className="admin-panel-header"><div><p className="admin-eyebrow">Couverture du programme</p><h2>Déploiement par matière</h2></div><button type="button" onClick={() => selectSection("content")}>Gérer les contenus</button></header>
            <div className="admin-subject-grid">
              {Object.values(subjects).map((subject) => {
                const subjectContents = workspace.contents.filter((item) => item.subjectId === subject.id);
                const published = subjectContents.filter((item) => item.status === "published").length;
                const coverage = subject.id === "mathematics" ? 14 : 0;
                return (
                  <article key={subject.id} style={{ "--admin-subject-accent": subject.theme.accent } as CSSProperties}>
                    <span>{subject.shortLabel.slice(0, 2).toUpperCase()}</span>
                    <div><strong>{subject.label}</strong><small>{published} publié • {subjectContents.length} en préparation</small></div>
                    <div className="admin-subject-progress" aria-label={`${coverage} % du programme`}><i style={{ width: `${coverage}%` }} /></div>
                    <b>{coverage}%</b>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {activeSection === "content" && (
        <section className="admin-section" data-testid="admin-content">
          <div className="admin-section-heading">
            <div><p className="admin-eyebrow">Bibliothèque pédagogique</p><h2>Contenus et publication</h2><p>Prépare, prévisualise, relis et publie les niveaux du programme ivoirien.</p></div>
            <button className="primary-action is-compact" type="button" onClick={() => setContentStudioOpen(true)}><BookOpenText size={19} weight="bold" /> Ouvrir le studio</button>
          </div>
          <article className="admin-content-studio-callout">
            <span><BookOpenText size={31} weight="duotone" /></span>
            <div><p className="admin-eyebrow">Nouveau</p><h3>Studio de création avec aperçu instantané</h3><p>Choisis une leçon, colle ton texte, structure-le, prépare les exercices et observe exactement le résultat côté élève avant de publier.</p><ul><li>Autosauvegarde des brouillons</li><li>Version publiée protégée</li><li>Historique restaurable</li><li>Contrôle qualité avant publication</li></ul></div>
            <button type="button" onClick={() => setContentStudioOpen(true)}>Créer ou modifier une leçon</button>
          </article>
          <div className="admin-toolbar">
            <label className="admin-search"><MagnifyingGlass size={20} /><input value={contentQuery} onChange={(event) => setContentQuery(event.target.value)} placeholder="Rechercher un parcours, une matière…" /></label>
            <label className="admin-filter"><span>Statut</span><select value={contentStatus} onChange={(event) => setContentStatus(event.target.value as PublicationStatus | "all")}><option value="all">Tous</option><option value="published">Publiés</option><option value="review">À valider</option><option value="draft">Brouillons</option></select></label>
          </div>
          <div className="admin-content-list">
            {filteredContents.map((content) => (
              <article className="admin-content-row" key={content.id}>
                <span className="admin-content-icon"><BookOpenText size={23} weight="duotone" /></span>
                <div className="admin-content-main"><span>{subjects[content.subjectId].label} • {content.levelLabel}</span><strong>{content.title}</strong><small>{kindLabels[content.kind]} • {content.lessonCount} leçons • par {content.author}</small></div>
                <div className="admin-content-update"><small>Dernière modification</small><strong>{content.updatedAt}</strong></div>
                <span className={`admin-status is-${content.status}`}>{publicationLabels[content.status]}</span>
                <div className="admin-row-actions">
                  {content.status === "draft" && <button type="button" onClick={() => changeContentStatus(content.id, "review")}>Envoyer en validation</button>}
                  {content.status === "review" && <button className="is-primary" type="button" onClick={() => changeContentStatus(content.id, "published")}>Publier</button>}
                  {content.status === "published" && <button type="button" onClick={() => changeContentStatus(content.id, "draft")}>Dépublier</button>}
                </div>
              </article>
            ))}
            {filteredContents.length === 0 && <div className="admin-empty-state">Aucun contenu ne correspond à ces filtres.</div>}
          </div>
        </section>
      )}

      {activeSection === "users" && (
        <section className="admin-section" data-testid="admin-users">
          <div className="admin-section-heading">
            <div><p className="admin-eyebrow">Communauté</p><h2>Utilisateurs et accès</h2><p>Contrôle les élèves, enseignants et comptes administrateurs.</p></div>
            <div className="admin-section-summary"><Users size={23} weight="duotone" /><strong>{activeUsers}</strong><span>comptes actifs dans cet aperçu</span></div>
          </div>
          <div className="admin-toolbar">
            <label className="admin-search"><MagnifyingGlass size={20} /><input value={userQuery} onChange={(event) => setUserQuery(event.target.value)} placeholder="Nom, adresse e-mail ou classe…" /></label>
            <label className="admin-filter"><span>État</span><select value={userStatus} onChange={(event) => setUserStatus(event.target.value as UserStatus | "all")}><option value="all">Tous</option><option value="active">Actifs</option><option value="suspended">Suspendus</option></select></label>
          </div>
          <div className="admin-user-table" role="table" aria-label="Liste des utilisateurs">
            <div className="admin-user-row is-header" role="row"><span>Utilisateur</span><span>Rôle</span><span>Progression</span><span>Dernière activité</span><span>État et action</span></div>
            {usersLoading && <div className="admin-users-feedback" role="status">Chargement des profils Supabase…</div>}
            {usersError && (
              <div className="admin-users-feedback is-error" role="alert">
                <span>{usersError}</span>
                <button type="button" onClick={() => void reloadUsers()}>Réessayer</button>
              </div>
            )}
            {!usersLoading && !usersError && filteredUsers.map((user) => (
              <div className="admin-user-row" role="row" key={user.id}>
                <div className="admin-user-identity"><span><UserCircle size={25} weight="duotone" /></span><div><strong>{user.name}</strong><small>{user.email}</small></div></div>
                <span className={`admin-role is-${user.role}`}>{roleLabels[user.role]}{user.levelLabel && <small>{user.levelLabel}</small>}</span>
                <div className="admin-user-progress"><div><i style={{ width: `${user.role === "student" ? user.progress : 100}%` }} /></div><span>{user.role === "student" ? `${user.completedLessons ?? 0} leç. · ${formatXp(user.totalXp ?? 0)} XP` : "—"}</span></div>
                <span className="admin-last-active">{user.lastActive}</span>
                <div className="admin-user-action">
                  <span className={`admin-user-state is-${user.status}`}>{user.status === "active" ? "Actif" : "Suspendu"}</span>
                  <button type="button" disabled={updatingUserId === user.id} onClick={() => setEditingUser(user)}>
                    Modifier le niveau
                  </button>
                </div>
              </div>
            ))}
            {!usersLoading && !usersError && filteredUsers.length === 0 && <div className="admin-users-feedback">Aucun utilisateur ne correspond à ces filtres.</div>}
          </div>
        </section>
      )}

      {activeSection === "operations" && (
        <section className="admin-section" data-testid="admin-operations">
          <div className="admin-section-heading"><div><p className="admin-eyebrow">Supervision</p><h2>Opérations et qualité</h2><p>Traite les validations, signalements et contrôles indispensables.</p></div><span className="admin-live-pill"><i /> Surveillance active</span></div>
          <div className="admin-operations-grid">
            <article className="admin-panel admin-task-board">
              <header className="admin-panel-header"><div><p className="admin-eyebrow">File de travail</p><h2>{openTasks.length} actions ouvertes</h2></div></header>
              <div className="admin-task-list">
                {workspace.tasks.map((task) => (
                  <article className={`admin-task ${task.resolved ? "is-resolved" : ""}`} key={task.id}>
                    <span className={`admin-task-category is-${task.category}`}>{task.category}</span>
                    <div><strong>{task.title}</strong><p>{task.detail}</p><small>{task.createdAt} • priorité {task.priority}</small></div>
                    <button type="button" disabled={task.resolved} onClick={() => { resolveTask(task.id); notify("Action terminée."); }}>{task.resolved ? <><CheckCircle size={18} weight="fill" /> Traitée</> : "Marquer comme traitée"}</button>
                  </article>
                ))}
              </div>
            </article>
            <aside className="admin-infrastructure">
              <article className="admin-panel">
                <header className="admin-panel-header"><div><p className="admin-eyebrow">État technique</p><h2>Infrastructure</h2></div></header>
                <div className="admin-system-list">
                  <div><span><CheckCircle size={22} weight="fill" /></span><p><strong>Application web</strong><small>Interface locale opérationnelle</small></p><b className="is-ready">Prête</b></div>
                  <div><span><Database size={22} weight="duotone" /></span><p><strong>Base de données</strong><small>Connecteur serveur à brancher</small></p><b className="is-pending">À connecter</b></div>
                  <div><span><ShieldCheck size={22} weight="duotone" /></span><p><strong>Authentification et rôles</strong><small>Protection serveur requise</small></p><b className="is-pending">À sécuriser</b></div>
                  <div><span><Cloud size={22} weight="duotone" /></span><p><strong>Stockage des médias</strong><small>Images et vidéos de cours</small></p><b className="is-pending">À connecter</b></div>
                </div>
              </article>
              <article className="admin-panel admin-backup-card"><span><CheckCircle size={26} weight="duotone" /></span><div><strong>Sauvegarde locale active</strong><p>Les actions de cette console sont conservées dans le navigateur pendant la phase prototype.</p></div></article>
            </aside>
          </div>
        </section>
      )}

      {activeSection === "settings" && (
        <section className="admin-section" data-testid="admin-settings">
          <div className="admin-section-heading"><div><p className="admin-eyebrow">Configuration globale</p><h2>Réglages de la plateforme</h2><p>Définis les règles générales appliquées à tous les utilisateurs.</p></div><span className="admin-save-state"><CheckCircle size={19} weight="fill" /> Sauvegarde automatique</span></div>
          <div className="admin-settings-grid">
            <article className="admin-panel admin-settings-card">
              <header className="admin-panel-header"><div><p className="admin-eyebrow">Accès et services</p><h2>Fonctionnalités</h2></div><Gear size={24} weight="duotone" /></header>
              <SettingToggle label="Inscriptions ouvertes" description="Autoriser la création de nouveaux comptes élèves." checked={workspace.settings.registrationsOpen} onChange={(value) => updateSettings({ registrationsOpen: value })} />
              <SettingToggle label="Tuteur pédagogique" description="Afficher les indices et explications guidées." checked={workspace.settings.tutorEnabled} onChange={(value) => updateSettings({ tutorEnabled: value })} />
              <SettingToggle label="Validation obligatoire" description="Un contenu doit être relu avant publication." checked={workspace.settings.contentRequiresReview} onChange={(value) => updateSettings({ contentRequiresReview: value })} />
              <SettingToggle danger label="Mode maintenance" description="Bloquer temporairement l’accès des élèves." checked={workspace.settings.maintenanceMode} onChange={(value) => updateSettings({ maintenanceMode: value })} />
            </article>
            <article className="admin-panel admin-settings-card">
              <header className="admin-panel-header"><div><p className="admin-eyebrow">Pédagogie et sécurité</p><h2>Valeurs par défaut</h2></div><GraduationCap size={24} weight="duotone" /></header>
              <label className="admin-number-setting"><span><strong>Objectif quotidien</strong><small>Nombre d’exercices conseillé à chaque élève.</small></span><input type="number" min="1" max="20" value={workspace.settings.dailyExerciseGoal} onChange={(event) => updateSettings({ dailyExerciseGoal: Number(event.target.value) })} /><b>exercices</b></label>
              <label className="admin-number-setting"><span><strong>Expiration de session</strong><small>Déconnexion après une période d’inactivité.</small></span><input type="number" min="10" max="240" step="5" value={workspace.settings.sessionTimeoutMinutes} onChange={(event) => updateSettings({ sessionTimeoutMinutes: Number(event.target.value) })} /><b>minutes</b></label>
              <div className="admin-security-note"><ShieldCheck size={24} weight="duotone" /><div><strong>Règle importante</strong><p>Ces réglages devront être appliqués et contrôlés côté serveur lors du branchement du backend.</p></div></div>
            </article>
          </div>
        </section>
      )}

      {showCreateDialog && <CreateContentDialog onClose={() => setShowCreateDialog(false)} onCreate={(content) => { createContent(content); notify("Nouveau brouillon créé."); }} />}
      {editingUser && <EditUserLevelDialog user={editingUser} onClose={() => setEditingUser(null)} onSave={saveUserLevel} />}
      {notice && <div className="toast" role="status">{notice}</div>}
    </main>
  );
}
