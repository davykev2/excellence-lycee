import { ArrowUpRight, BookOpenText, ChartBar, ChatCircleDots, ClipboardText, Coffee, GraduationCap, PencilLine, PlayCircle } from "@phosphor-icons/react";
import { useId } from "react";
import { MathText } from "../../components/MathText";

export interface HomeActionGridProps {
  onOpenCourses: () => void;
  onOpenExercises: () => void;
  onOpenHomeworks?: () => void;
  onOpenExams?: () => void;
  onOpenResults: () => void;
  onOpenMessages: () => void;
  onOpenSupport: () => void;
  resume?: { label: string; title: string; onOpen: () => void };
  unreadMessages?: number;
}

/** Home shortcuts use the existing destinations and access rules, not a second menu. */
export function HomeActionGrid({
  onOpenCourses, onOpenExercises, onOpenHomeworks, onOpenExams,
  onOpenResults, onOpenMessages, onOpenSupport, resume, unreadMessages = 0,
}: HomeActionGridProps) {
  const id = useId();
  const unreadCount = Number.isFinite(unreadMessages) ? Math.max(0, Math.floor(unreadMessages)) : 0;
  const cards = [
    ...(resume ? [{ id: "resume", title: resume.label, detail: resume.title, icon: PlayCircle, tone: "navy", onOpen: resume.onOpen }] : []),
    { id: "courses", title: "Cours", detail: "Comprendre", icon: BookOpenText, tone: "green", onOpen: onOpenCourses },
    { id: "exercises", title: "Exercices", detail: "M’exercer", icon: PencilLine, tone: "orange", onOpen: onOpenExercises },
    ...(onOpenHomeworks ? [{ id: "homeworks", title: "Devoirs", detail: "M’évaluer", icon: ClipboardText, tone: "blue", onOpen: onOpenHomeworks }] : []),
    ...(onOpenExams ? [{ id: "exams", title: "Sujets d’examen", detail: "Me préparer", icon: GraduationCap, tone: "gold", onOpen: onOpenExams }] : []),
    { id: "results", title: "Mes résultats", detail: "Notes et corrections", icon: ChartBar, tone: "purple", onOpen: onOpenResults },
    { id: "messages", title: "Messages", detail: "Échanger", icon: ChatCircleDots, tone: "teal", onOpen: onOpenMessages },
    { id: "support", title: "Offrir un café", detail: "Soutenir le projet", icon: Coffee, tone: "coffee", onOpen: onOpenSupport },
  ];

  return <section className="home-action-grid" aria-label="Accès rapides">
    {cards.map(({ id: cardId, title, detail, icon: Icon, tone, onOpen }) => {
      const hasUnread = cardId === "messages" && unreadCount > 0;
      return <button key={cardId} type="button" className={`home-action-card is-${tone}`} data-home-card={cardId}
        aria-label={hasUnread ? `${title}, ${unreadCount} message${unreadCount > 1 ? "s" : ""} non lu${unreadCount > 1 ? "s" : ""}` : title}
        aria-describedby={`${id}-${cardId}-detail`} onClick={onOpen}>
        <span className="home-action-card-top">
          <span className="home-action-card-icon"><Icon size={42} weight="duotone" aria-hidden="true" /></span>
          {hasUnread && <span className="home-action-card-badge" aria-hidden="true">{unreadCount > 99 ? "99+" : unreadCount}</span>}
          <ArrowUpRight className="home-action-card-arrow" size={20} weight="bold" aria-hidden="true" />
        </span>
        <span className="home-action-card-copy"><strong>{title}</strong><small id={`${id}-${cardId}-detail`}>{cardId === "resume" ? <MathText>{detail}</MathText> : detail}</small></span>
      </button>;
    })}
  </section>;
}
