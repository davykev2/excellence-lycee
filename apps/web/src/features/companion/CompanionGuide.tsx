import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { ArrowRight, BookOpenText, Lightbulb, SpeakerHigh, SpeakerSlash, Sparkle, Stop, X } from "@phosphor-icons/react";
import type { NavigationId, SchoolLevel } from "../../domain/learning";
import { CompanionAvatar, type CompanionMotion } from "./CompanionAvatar";
import { useDavyVoice } from "./useDavyVoice";

interface CompanionGuideProps {
  learnerName: string;
  level: SchoolLevel;
  activeNavigation: NavigationId;
  currentLessonTitle?: string;
  activeLessonTitle?: string;
  hasActivePath: boolean;
  celebrationKey: number;
  onNavigate: (id: NavigationId) => void;
  onResumeLesson: () => void;
  onAskHint: () => void;
}

type CompanionAction = "resume" | "hint" | "home" | "profile" | "dismiss";

interface CompanionContext {
  kicker: string;
  title: string;
  message: string;
  action: CompanionAction;
  actionLabel: string;
}

const introStorageKey = "excellence-davy-intro-seen-v1";
const positionStorageKey = "excellence-davy-position-v1";

interface CompanionOffset {
  x: number;
  y: number;
}

function readStoredOffset(): CompanionOffset {
  try {
    const stored = JSON.parse(window.localStorage.getItem(positionStorageKey) ?? "");
    if (typeof stored?.x === "number" && typeof stored?.y === "number") {
      return { x: stored.x, y: stored.y };
    }
  } catch {
    // Une ancienne valeur illisible ne doit jamais empêcher Davy de s'afficher.
  }
  return { x: 0, y: 0 };
}

export function CompanionGuide({
  learnerName,
  level,
  activeNavigation,
  currentLessonTitle,
  activeLessonTitle,
  hasActivePath,
  celebrationKey,
  onNavigate,
  onResumeLesson,
  onAskHint,
}: CompanionGuideProps) {
  const [open, setOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(() => window.localStorage.getItem(introStorageKey) !== "yes");
  const [motion, setMotion] = useState<CompanionMotion>("idle");
  const [reduceMotion, setReduceMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [offset, setOffset] = useState<CompanionOffset>(readStoredOffset);
  const previousCelebrationKey = useRef(celebrationKey);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const offsetRef = useRef(offset);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startOffset: CompanionOffset;
    originLeft: number;
    originTop: number;
    width: number;
    height: number;
  } | null>(null);
  const movedDuringDragRef = useRef(false);
  const firstName = learnerName.trim().split(/\s+/)[0] || "toi";
  const voice = useDavyVoice();

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  useEffect(() => {
    const keepDavyOnScreen = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const originLeft = rect.left - offsetRef.current.x;
      const originTop = rect.top - offsetRef.current.y;
      const margin = 8;
      const next = {
        x: Math.min(window.innerWidth - margin - rect.width - originLeft, Math.max(margin - originLeft, offsetRef.current.x)),
        y: Math.min(window.innerHeight - margin - rect.height - originTop, Math.max(margin - originTop, offsetRef.current.y)),
      };
      if (next.x === offsetRef.current.x && next.y === offsetRef.current.y) return;
      offsetRef.current = next;
      setOffset(next);
      window.localStorage.setItem(positionStorageKey, JSON.stringify(next));
    };

    keepDavyOnScreen();
    window.addEventListener("resize", keepDavyOnScreen);
    return () => window.removeEventListener("resize", keepDavyOnScreen);
  }, [activeNavigation]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(media.matches);
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const closeForTour = () => {
      voice.stop();
      setOpen(false);
    };
    window.addEventListener("excellence:davy-guide-close", closeForTour);
    return () => window.removeEventListener("excellence:davy-guide-close", closeForTour);
  }, [voice.stop]);

  useEffect(() => {
    if (reduceMotion) {
      setMotion("idle");
      return;
    }

    let blinkTimer = 0;
    let resetTimer = 0;
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        setMotion((current) => current === "idle" ? "blink" : current);
        resetTimer = window.setTimeout(() => {
          setMotion((current) => current === "blink" ? "idle" : current);
          scheduleBlink();
        }, 190);
      }, 4200 + Math.round(Math.random() * 2800));
    };
    scheduleBlink();
    return () => {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(resetTimer);
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (!open || reduceMotion) {
      setMotion((current) => current === "wave" ? "idle" : current);
      return;
    }
    setMotion("wave");
    const timer = window.setTimeout(() => setMotion((current) => current === "wave" ? "idle" : current), 1050);
    return () => window.clearTimeout(timer);
  }, [open, reduceMotion]);

  useEffect(() => {
    if (celebrationKey <= previousCelebrationKey.current) {
      previousCelebrationKey.current = celebrationKey;
      return;
    }
    previousCelebrationKey.current = celebrationKey;
    if (reduceMotion) return;
    setMotion("celebrate");
    const timer = window.setTimeout(() => setMotion((current) => current === "celebrate" ? "idle" : current), 1500);
    return () => window.clearTimeout(timer);
  }, [celebrationKey, reduceMotion]);

  const context = useMemo<CompanionContext>(() => {
    if (activeLessonTitle) {
      return {
        kicker: "Pendant ta leçon",
        title: "Je reste à tes côtés",
        message: `Essaie d’abord par toi-même sur « ${activeLessonTitle} ». Si tu bloques, je te donnerai une étape, jamais la réponse entière.`,
        action: "hint",
        actionLabel: "Demander un indice",
      };
    }

    if (!hasActivePath && (activeNavigation === "home" || activeNavigation === "paths")) {
      return {
        kicker: `Programme · ${level.label}`,
        title: "Ton parcours se prépare",
        message: "Je veille à ce qu’aucun cours d’une autre classe ne te soit proposé. Tu peux vérifier ton profil ou revenir voir les nouveautés plus tard.",
        action: "profile",
        actionLabel: "Vérifier mon profil",
      };
    }

    const contexts: Partial<Record<NavigationId, CompanionContext>> = {
      home: {
        kicker: "Ta prochaine étape",
        title: currentLessonTitle ?? "Continuons ensemble",
        message: `Salut ${firstName} ! Une petite étape aujourd’hui vaut mieux qu’une longue révision repoussée à demain.`,
        action: "resume",
        actionLabel: "Continuer ma leçon",
      },
      paths: {
        kicker: "Ton parcours",
        title: "Avance dans l’ordre conseillé",
        message: "Chaque leçon débloque la suivante. Les étapes déjà réussies restent disponibles si tu veux les revoir.",
        action: "resume",
        actionLabel: "Ouvrir la prochaine leçon",
      },
      arena: {
        kicker: "Place au défi",
        title: "Choisis ton combat",
        message: "Exercices, quiz, devoirs ou duels : commence par le mode qui correspond à ton objectif du jour.",
        action: "dismiss",
        actionLabel: "Je choisis mon défi",
      },
      ranking: {
        kicker: "Ton rythme d’abord",
        title: "Le classement reste un jeu",
        message: "Compare-toi surtout à ta progression d’hier. Les XP encouragent l’effort, mais comprendre reste la vraie victoire.",
        action: "dismiss",
        actionLabel: "Compris, Davy",
      },
      messages: {
        kicker: "Besoin d’aide humaine",
        title: "Explique clairement ton blocage",
        message: "Indique la leçon, ce que tu as essayé et l’étape qui te pose problème : ton enseignant pourra mieux t’aider.",
        action: "dismiss",
        actionLabel: "Je vais préciser ma demande",
      },
      profile: {
        kicker: "Ton contexte scolaire",
        title: `Je m’adapte à ${level.label}`,
        message: "Vérifie ici ta classe et ta série. Pour les modifier à la fin de l’année, adresse-toi à un administrateur : tes progrès resteront conservés.",
        action: "home",
        actionLabel: "Retourner à l’accueil",
      },
    };

    return contexts[activeNavigation] ?? contexts.home!;
  }, [activeLessonTitle, activeNavigation, currentLessonTitle, firstName, hasActivePath, level.label]);

  const rememberIntro = () => {
    setShowIntro(false);
    window.localStorage.setItem(introStorageKey, "yes");
  };

  const openGuide = () => {
    rememberIntro();
    setOpen(true);
  };

  const startDragging = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startOffset: offsetRef.current,
      originLeft: rect.left - offsetRef.current.x,
      originTop: rect.top - offsetRef.current.y,
      width: rect.width,
      height: rect.height,
    };
    movedDuringDragRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDavy = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (!movedDuringDragRef.current && Math.hypot(deltaX, deltaY) < 6) return;

    movedDuringDragRef.current = true;
    const margin = 8;
    const next = {
      x: Math.min(
        window.innerWidth - margin - drag.width - drag.originLeft,
        Math.max(margin - drag.originLeft, drag.startOffset.x + deltaX),
      ),
      y: Math.min(
        window.innerHeight - margin - drag.height - drag.originTop,
        Math.max(margin - drag.originTop, drag.startOffset.y + deltaY),
      ),
    };
    offsetRef.current = next;
    setOffset(next);
  };

  const stopDragging = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!movedDuringDragRef.current) return;
    rememberIntro();
    window.localStorage.setItem(positionStorageKey, JSON.stringify(offsetRef.current));
    window.setTimeout(() => {
      movedDuringDragRef.current = false;
    }, 0);
  };

  const runAction = () => {
    voice.stop();
    setOpen(false);
    if (context.action === "resume") onResumeLesson();
    if (context.action === "hint") onAskHint();
    if (context.action === "home") onNavigate("home");
    if (context.action === "profile") onNavigate("profile");
  };

  return (
    <aside
      className={`companion-shell companion-shell--${activeNavigation} ${open ? "is-open" : ""}`}
      aria-label="Davy, guide virtuel Excellence"
    >
      {showIntro && !open && !activeLessonTitle && activeNavigation !== "paths" && (
        <div className="companion-intro" role="status">
          <button type="button" aria-label="Masquer la présentation de Davy" onClick={rememberIntro}><X size={15} weight="bold" /></button>
          <strong>Moi, c’est Davy !</strong>
          <span>Je peux te guider sur chaque écran.</span>
        </div>
      )}

      {open && (
        <section className="companion-panel" role="dialog" aria-modal="false" aria-labelledby="companion-title">
          <header>
            <CompanionAvatar motion={motion} />
            <div><span>Guide Excellence</span><strong id="companion-title">Davy</strong></div>
            <button type="button" aria-label="Fermer Davy" onClick={() => { voice.stop(); setOpen(false); }}><X size={20} weight="bold" /></button>
          </header>
          <div className="companion-panel-body">
            <p className="companion-kicker"><Sparkle size={16} weight="fill" /> {context.kicker}</p>
            <h2>{context.title}</h2>
            <p>{context.message}</p>
            <div className="companion-voice-actions">
              <button
                type="button"
                onClick={() => voice.speaking ? voice.stop() : voice.speak(`${context.title}. ${context.message}`)}
                disabled={!voice.supported || voice.muted}
              >
                {voice.speaking ? <Stop size={17} weight="fill" /> : <SpeakerHigh size={18} weight="duotone" />}
                {voice.speaking ? "Arrêter" : "Écouter Davy"}
              </button>
              <button type="button" onClick={voice.toggleMuted} disabled={!voice.supported} aria-label={voice.muted ? "Activer la voix de Davy" : "Couper la voix de Davy"}>
                {voice.muted ? <SpeakerSlash size={18} weight="fill" /> : <SpeakerHigh size={18} weight="duotone" />}
              </button>
            </div>
            <button className="companion-primary-action" type="button" onClick={runAction}>
              {context.action === "hint" ? <Lightbulb size={20} weight="duotone" /> : <ArrowRight size={20} weight="bold" />}
              <span>{context.actionLabel}</span>
            </button>
            {activeNavigation !== "paths" && !activeLessonTitle && hasActivePath && (
              <button className="companion-secondary-action" type="button" onClick={() => { voice.stop(); setOpen(false); onNavigate("paths"); }}>
                <BookOpenText size={19} weight="duotone" /> Voir mon parcours
              </button>
            )}
          </div>
          <footer><span className="companion-presence" /> Conseils adaptés à {level.label}</footer>
        </section>
      )}

      <button
        ref={triggerRef}
        className={`companion-trigger ${dragRef.current ? "is-dragging" : ""}`}
        type="button"
        data-tour-id="davy"
        aria-label={open ? "Fermer Davy" : "Ouvrir Davy, mon guide. Maintenir et faire glisser pour le déplacer."}
        aria-expanded={open}
        title="Maintiens et fais glisser pour déplacer Davy"
        style={{
          "--davy-drag-x": `${offset.x}px`,
          "--davy-drag-y": `${offset.y}px`,
        } as CSSProperties}
        onPointerDown={startDragging}
        onPointerMove={moveDavy}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onClick={(event) => {
          if (movedDuringDragRef.current) {
            event.preventDefault();
            return;
          }
          if (open) {
            voice.stop();
            setOpen(false);
          } else {
            openGuide();
          }
        }}
      >
        <span className="companion-trigger-glow" />
        <CompanionAvatar motion={motion} decorative />
        <span className="companion-online-dot" />
      </button>
    </aside>
  );
}
