import { ArrowRight, PlayCircle } from "@phosphor-icons/react";
import type { DashboardContent } from "../../domain/learning";
import { MathText } from "../../components/MathText";
import { HomeWelcome } from "./HomeWelcome";
import { HomeBookArtwork } from "./HomeBookArtwork";
import { HomeSyncNotice, type DashboardSyncIssue } from "./HomeSyncNotice";
export type { DashboardSyncIssue } from "./HomeSyncNotice";

export type DashboardDailyGoal = DashboardContent["dailyGoal"];

interface DashboardProps {
  userId: string;
  visitKey?: number;
  content: DashboardContent;
  onResumeLesson: () => void;
  onOpenCourses: () => void;
  onOpenSpace: () => void;
  syncIssue?: DashboardSyncIssue | null;
}

export function Dashboard({ userId, visitKey, content, onResumeLesson, onOpenCourses, onOpenSpace, syncIssue = null }: DashboardProps) {
  return (
    <HomeWelcome userId={userId} levelId={content.levelId} visitKey={visitKey} name={content.learnerName} photoUrl={content.learnerPhotoUrl} onOpenSpace={onOpenSpace}>
      <HomeSyncNotice issue={syncIssue} />
      <section className="home-resume-card" aria-labelledby="home-resume-title">
        <div className="home-resume-copy">
          <p className="path-kicker">{content.lesson.eyebrow}</p>
          <h2 id="home-resume-title"><MathText>{content.lesson.title}</MathText></h2>
          <div className="home-resume-actions">
            <button className="primary-action" type="button" onClick={onResumeLesson}><PlayCircle size={26} weight="fill" aria-hidden="true" />{content.lesson.ctaLabel}</button>
            <button className="home-other-course" type="button" onClick={onOpenCourses}>Choisir un autre cours <ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        </div>
        <HomeBookArtwork />
      </section>
    </HomeWelcome>
  );
}
