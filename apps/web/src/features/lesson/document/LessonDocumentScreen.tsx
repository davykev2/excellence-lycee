import { ArrowLeft, BookOpenText, CaretDown, ChatCircleDots, Lightning, ListBullets, PencilLine } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { MarkdownContent } from "../../../components/MarkdownContent";
import { MathText } from "../../../components/MathText";
import type { AuthUser } from "../../../domain/auth";
import type { CourseDocument, CourseSummary, CourseDocumentTab, CourseDocumentTopic, CourseLibraryReference } from "../../../domain/courseDocument";
import type { SchoolLevel, SubjectDefinition } from "../../../domain/learning";
import { LessonFeedbackPanel } from "../LessonFeedbackPanel";
import { LessonInteractionPanel } from "../LessonWorkspace";
import { DocumentEvaluation } from "./DocumentEvaluation";
import { DocumentEssentials } from "./DocumentEssentials";
import { WorkedExampleContent } from "./WorkedExampleContent";
import { DocumentNativeFigure } from "./DocumentNativeFigure";

interface Props {
  path: CourseLibraryReference; document: CourseDocument | CourseSummary; level: SchoolLevel; subject: SubjectDefinition;
  currentUser: Pick<AuthUser, "id" | "name" | "photoUrl" | "role">;
  localOnly?: boolean; focusedSectionId?: string;
  tab: CourseDocumentTab; onTabChange: (tab: CourseDocumentTab) => void;
  onBackToLibrary: () => void;
  readingOnly?: boolean;
  assessmentContent?: ReactNode;
  essentialsContent?: ReactNode;
  className?: string;
}

const topicDomId = (id: string) => `document-topic-${id}`;
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function SummaryTopic({ topic, number }: { topic: CourseDocumentTopic; number: number }) {
  return <section className="document-topic" id={topicDomId(topic.id)} data-document-topic={topic.id} aria-labelledby={`title-${topic.id}`}>
    <h3 id={`title-${topic.id}`}><span>{number}.</span> <MathText>{topic.title}</MathText></h3>
    <MarkdownContent markdown={topic.body} />
    {topic.examples?.map(example => <section className="document-summary-example" key={example.id} aria-labelledby={`example-${example.id}`}>
      <p className="document-example-eyebrow">Exemple d’application</p>
      <h4 id={`example-${example.id}`}><MathText>{example.title}</MathText></h4>
      <WorkedExampleContent example={example} />
    </section>)}
    {topic.detail && <details className="document-understand"><summary>Comprendre cette étape</summary><MarkdownContent markdown={topic.detail} /></details>}
    {topic.nativeFigure && <details className="document-native-graph"><summary>{topic.nativeFigure.kind==="arithmetic"?"Explorer les calculs":"Explorer la figure"}</summary><DocumentNativeFigure figure={topic.nativeFigure}/></details>}
    {topic.interaction && <details className="document-native-graph">
      <summary>{topic.interaction.kind === "curve" ? "Explorer la courbe" : topic.interaction.kind === "timeline" ? "Explorer les repères" : "Explorer la figure"} · <MathText>{topic.interaction.title}</MathText></summary>
      <p><MathText>{topic.interaction.instruction}</MathText></p>
      <LessonInteractionPanel lesson={{ id: topic.id, interaction: topic.interaction }} />
      <p className="document-muted"><MathText>{topic.interaction.observation}</MathText></p>
    </details>}
  </section>;
}

export function LessonDocumentScreen({ path, document: course, level, subject, currentUser, localOnly, focusedSectionId, tab: requestedTab, onTabChange, onBackToLibrary, readingOnly = false, assessmentContent, essentialsContent, className = "" }: Props) {
  const fullDocument = "evaluations" in course ? course as CourseDocument : undefined;
  const hasEssentialsTab = subject.id === "mathematics" || course.essentials !== undefined || essentialsContent !== undefined;
  const tabs: CourseDocumentTab[] = readingOnly ? (hasEssentialsTab ? ["summary", "essentials"] : ["summary"])
    : hasEssentialsTab ? ["summary", "assessment", "essentials"] : ["summary", "assessment"];
  const tab = tabs.includes(requestedTab) ? requestedTab : "summary";
  const ids = useId();
  const tabsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLElement>(null);
  const [tocOpen, setTocOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState(course.sections[0].topics[0].id);
  const [pendingTopic, setPendingTopic] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const topics = course.sections.flatMap(section => section.topics);
  const feedbackTopics = topics.flatMap(topic => (topic.legacyLessonIds ?? []).map((id, index) => ({ id, label: `${topic.title}${index ? ` · Synthèse${index > 1 ? ` ${index}` : ""}` : ""}` })));
  const [feedbackId, setFeedbackId] = useState(feedbackTopics[0]?.id ?? "");
  const readingKey = `excellence-document-reading:${currentUser.id}:${fullDocument ? "" : level.id+":"}${path.id}:v${course.version}`;
  const chapter = path.chapterNumberByLevel?.[level.id] ?? path.chapterNumber;

  useEffect(() => {
    const target = focusedSectionId ? course.legacyAnchors[focusedSectionId] ?? focusedSectionId : null;
    if (target && topics.some(topic => topic.id === target)) setPendingTopic(target);
  }, [focusedSectionId, course]);

  useEffect(() => {
    if (fullDocument || focusedSectionId) return;
    try {
      const saved=window.localStorage.getItem(readingKey)
        ?? window.localStorage.getItem(`excellence-course-reading:${currentUser.id}:${path.id}`);
      const target=saved ? course.legacyAnchors[saved]??saved : null;
      if(target&&topics.some(topic=>topic.id===target))setPendingTopic(target);
    } catch { /* Reading remains available without local persistence. */ }
  }, [course,readingKey,focusedSectionId,currentUser.id,path.id]);

  useEffect(() => {
    if (tab !== "summary" || !pendingTopic) return;
    const timer = window.setTimeout(() => {
      const element = window.document.getElementById(topicDomId(pendingTopic));
      // An old deep link can target an optional extension.
      const optional = element?.closest("details");
      if (optional) optional.open = true;
      element?.scrollIntoView({ behavior: "auto", block: "start" });
      setActiveTopic(pendingTopic); setPendingTopic(null);
    }, 60);
    return () => window.clearTimeout(timer);
  }, [pendingTopic, tab]);

  useEffect(() => {
    if (tab !== "summary" || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const id = visible?.target.getAttribute("data-document-topic");
      if (!id) return;
      setActiveTopic(id);
      try { window.localStorage.setItem(readingKey, id); } catch { /* Reading stays available. */ }
    }, { rootMargin: "-15% 0px -60% 0px", threshold: [0, 0.2, 0.5] });
    window.document.querySelectorAll("[data-document-topic]").forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [tab, readingKey]);

  const goToTopic = (id: string) => {
    setPendingTopic(id); setTocOpen(false);
    if (tab !== "summary") onTabChange("summary");
  };
  const chooseTab = (next: CourseDocumentTab) => {
    if (next === tab) return;
    setTocOpen(false); onTabChange(next);
    window.setTimeout(() => headingRef.current?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" }), 80);
  };
  const keyTabs = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? tabs[0] : event.key === "End" ? tabs[tabs.length - 1]
      : tabs[(tabs.indexOf(tab) + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
    chooseTab(next);
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-tab="${next}"]`)?.focus();
  };

  return <main className={(readingOnly ? "lesson-document lesson-reference-document" : "lesson-document")+(className ? " "+className : "")}>
    <header className="document-topbar">
      <button type="button" className="path-back-button" onClick={onBackToLibrary}><ArrowLeft size={19} aria-hidden="true" />Mes cours</button>
      <span>{level.label} · {subject.label}</span>
    </header>
    <header ref={headingRef} className="document-heading">
      <p className="document-small-label">{path.theme.title} · {fullDocument?.source.lessonLabel ?? `Leçon ${chapter}`}</p>
      <h1><MathText>{path.title}</MathText></h1>
    </header>
    <div ref={tabsRef} className={`document-tabs${tabs.length === 3 ? " document-tabs-three" : ""}`} role="tablist" aria-label="Contenu de la leçon">
      <button id={`${ids}-summary-tab`} role="tab" data-tab="summary" aria-selected={tab === "summary"} aria-controls={`${ids}-summary`} tabIndex={tab === "summary" ? 0 : -1} onKeyDown={keyTabs} onClick={() => chooseTab("summary")}><BookOpenText size={22} aria-hidden="true" /><span>Résumé de la leçon</span></button>
      {!readingOnly && <button id={`${ids}-assessment-tab`} role="tab" data-tab="assessment" aria-selected={tab === "assessment"} aria-controls={`${ids}-assessment`} tabIndex={tab === "assessment" ? 0 : -1} onKeyDown={keyTabs} onClick={() => chooseTab("assessment")}><PencilLine size={22} aria-hidden="true" /><span>Questions d’évaluation</span></button>}
      {hasEssentialsTab && <button id={`${ids}-essentials-tab`} role="tab" data-tab="essentials" aria-selected={tab === "essentials"} aria-controls={`${ids}-essentials`} tabIndex={tab === "essentials" ? 0 : -1} onKeyDown={keyTabs} onClick={() => chooseTab("essentials")}><Lightning size={22} aria-hidden="true" /><span>L’essentiel</span></button>}
    </div>
    <div id={`${ids}-summary`} role="tabpanel" aria-labelledby={`${ids}-summary-tab`} hidden={tab !== "summary"} className="document-summary-panel">
      <div className="document-summary-layout">
        <aside className={`document-outline${tocOpen ? " is-open" : ""}`} aria-label="Sommaire du résumé">
          <button type="button" className="document-outline-toggle" aria-expanded={tocOpen} aria-controls={`${ids}-outline`} onClick={() => setTocOpen(open => !open)}><ListBullets size={20} />Sommaire du résumé<CaretDown size={18} /></button>
          <nav id={`${ids}-outline`}>
            <p className="document-small-label">Dans ce résumé</p>
            {course.sections.map(section => <div key={section.id}>
              <button type="button" className="document-outline-section" onClick={() => goToTopic(section.topics[0].id)}><span>{section.numeral}</span><MathText>{section.title}</MathText></button>
              {section.topics.map(topic => <button key={topic.id} type="button" className={`document-outline-topic${activeTopic === topic.id ? " is-active" : ""}`} aria-current={activeTopic === topic.id ? "location" : undefined} onClick={() => goToTopic(topic.id)}><MathText>{topic.title}</MathText></button>)}
            </div>)}
          </nav>
        </aside>
        <div className="document-summary-content">
          {course.sections.map(section => <article key={section.id} className="document-summary-section" aria-labelledby={`section-${section.id}`}>
            <header><span>{section.numeral}</span><h2 id={`section-${section.id}`}><MathText>{section.title}</MathText></h2></header>
            {section.topics.map((topic, index) => topic.optional
              ? <details key={topic.id} className="document-extension"><summary><MathText>{topic.title}</MathText></summary><SummaryTopic topic={topic} number={index + 1} /></details>
              : <SummaryTopic key={topic.id} topic={topic} number={index + 1} />)}
          </article>)}
          {!readingOnly && <div className="document-summary-end"><button className="document-primary-button" type="button" onClick={() => chooseTab("assessment")}>Passer aux questions</button></div>}
        </div>
      </div>
    </div>
    {!readingOnly && <div id={`${ids}-assessment`} role="tabpanel" aria-labelledby={`${ids}-assessment-tab`} hidden={tab !== "assessment"}>
      {assessmentContent ?? (fullDocument && <DocumentEvaluation key={`${currentUser.id}:${path.id}:${course.id}:${course.version}`} document={fullDocument} userId={currentUser.id} pathId={path.id} onReview={goToTopic} />)}
    </div>}
    {hasEssentialsTab && <div id={`${ids}-essentials`} role="tabpanel" aria-labelledby={`${ids}-essentials-tab`} hidden={tab !== "essentials"} className="document-essentials-panel">
      {essentialsContent ?? <DocumentEssentials pathId={path.id} levelId={level.id} active={tab === "essentials"} cards={course.essentials} topicIds={topics.map(topic => topic.id)} onReview={goToTopic} />}
    </div>}
    {!readingOnly && <footer className="document-feedback">
      <div><ChatCircleDots size={23} aria-hidden="true" /><strong>Commentaires</strong></div>
      <button type="button" aria-expanded={feedbackOpen} onClick={() => setFeedbackOpen(open => !open)}>{feedbackOpen ? "Fermer les avis" : "Donner mon avis"}</button>
      {feedbackOpen && <section>
        <label htmlFor={`${ids}-feedback`}>Sur quelle partie porte ton avis ?</label>
        <select id={`${ids}-feedback`} value={feedbackId} onChange={event => setFeedbackId(event.target.value)}>
          {feedbackTopics.map(topic => <option key={topic.id} value={topic.id}>{topic.label}</option>)}
        </select>
        <LessonFeedbackPanel key={`${feedbackId}:${tab}`} pathId={path.id} lessonId={feedbackId} currentUser={currentUser} localOnly={localOnly} context={tab === "assessment" ? "correction" : "lesson"} />
      </section>}
    </footer>}
  </main>;
}
