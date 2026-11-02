import { ArrowRight, BookOpenText, ChartBar, ChatCircleDots, Coins, GraduationCap, ShieldCheck, SpeakerHigh, Trophy, UserCircle } from "@phosphor-icons/react";
import type { LearnerProfile, NavigationId, SchoolLevel } from "../../domain/learning";
import { ProfileAvatar } from "../../ui/ProfileAvatar";

interface PersonalSpaceScreenProps {
  profile: LearnerProfile;
  level: SchoolLevel;
  roleLabel: string;
  unreadMessages: number;
  goldBalance: number | null;
  isAdmin: boolean;
  onNavigate: (id: NavigationId) => void;
  onOpenResults: () => void;
  onReplayTour: () => void;
}

export function PersonalSpaceScreen({ profile, level, roleLabel, unreadMessages, goldBalance, isAdmin, onNavigate, onOpenResults, onReplayTour }: PersonalSpaceScreenProps) {
  return (
    <main className="personal-space-page">
      <header className="personal-space-heading">
        <h1>Mon espace</h1>
      </header>

      <section className="personal-space-identity" aria-label="Mon compte">
        <ProfileAvatar name={profile.name} photoUrl={profile.photoUrl} />
        <div><h2>{profile.name}</h2><span>{roleLabel} · {level.label}</span></div>
        <button type="button" onClick={() => onNavigate("profile")}><UserCircle size={20} /> Mon profil <ArrowRight size={18} /></button>
      </section>

      <section className="personal-space-grid" aria-label="Mes raccourcis">
        <button type="button" className="personal-space-card is-results" onClick={onOpenResults}>
          <span className="personal-space-icon"><ChartBar size={28} weight="duotone" /></span>
          <span><strong>Mes résultats</strong></span>
          <ArrowRight size={21} aria-hidden="true" />
        </button>
        <button type="button" className="personal-space-card" onClick={() => onNavigate("messages")}>
          <span className="personal-space-icon"><ChatCircleDots size={28} weight="duotone" /></span>
          <span><strong>Mes messages {unreadMessages > 0 && <b className="space-unread-count">{unreadMessages}</b>}</strong>{unreadMessages > 0 && <small>{`${unreadMessages} message${unreadMessages > 1 ? "s" : ""} non lu${unreadMessages > 1 ? "s" : ""}`}</small>}</span>
          <ArrowRight size={21} aria-hidden="true" />
        </button>
        <button type="button" className="personal-space-card" onClick={() => onNavigate("ranking")}>
          <span className="personal-space-icon"><Trophy size={28} weight="duotone" /></span>
          <span><strong>Le classement de ma classe</strong></span>
          <ArrowRight size={21} aria-hidden="true" />
        </button>
        <button type="button" className="personal-space-card" onClick={() => onNavigate("store")}>
          <span className="personal-space-icon"><Coins size={28} weight="duotone" /></span>
          <span><strong>Ma boutique</strong><small>{goldBalance === null ? "Solde indisponible" : `${goldBalance.toLocaleString("fr-FR")} or`}</small></span>
          <ArrowRight size={21} aria-hidden="true" />
        </button>
      </section>

      <section className="personal-space-help">
        <span className="personal-space-icon"><BookOpenText size={25} weight="duotone" /></span>
        <div><h2>Visite avec Davy</h2></div>
        <button type="button" onClick={onReplayTour}><SpeakerHigh size={19} /> Faire la visite</button>
      </section>

      {isAdmin && (
        <button className="personal-space-admin" type="button" onClick={() => onNavigate("admin")}>
          <ShieldCheck size={23} weight="duotone" /><span><strong>Administration</strong><small>Contenus, utilisateurs et suivi des évaluations.</small></span><ArrowRight size={20} />
        </button>
      )}
      <p className="personal-space-school"><GraduationCap size={19} />Classe enregistrée : {level.label}. Pour une modification, contacte l’administration.</p>
    </main>
  );
}
