import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowCounterClockwise,
  ArrowRight,
  Check,
  Pause,
  Play,
  SpeakerHigh,
  SpeakerSlash,
  X,
} from "@phosphor-icons/react";
import { CompanionAvatar } from "./CompanionAvatar";
import { useDavyVoice } from "./useDavyVoice";
import { showDocumentHome, showOriginalHome } from "../../config/homeLayout";

interface TourStep {
  id: string;
  targetId?: string;
  eyebrow: string;
  title: string;
  text: string;
  spokenText: string;
}

interface FirstVisitTourProps {
  userId: string;
  learnerName: string;
  replayKey?: number;
  forceOpen?: boolean;
}

interface TargetRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

function tourSteps(learnerName: string): TourStep[] {
  const firstName = learnerName.trim().split(/\s+/)[0] || "toi";
  return [
    {
      id: "welcome",
      eyebrow: "Bienvenue chez Excellence Lycée",
      title: `Salut ${firstName}, moi c’est Davy !`,
      text: "Je suis ton compagnon. Je vais te montrer rapidement les endroits importants pour que tu saches toujours où aller.",
      spokenText: `Salut ${firstName}, moi c’est Davy ! Je suis ton compagnon. Je vais te montrer rapidement les endroits importants pour que tu saches toujours où aller.`,
    },
    {
      id: "home",
      targetId: "nav-home",
      eyebrow: "Ton point de départ",
      title: "L’Accueil",
      text: showDocumentHome ? "Retrouve ton cours et ouvre directement son résumé, ses questions ou sa fiche essentielle. Mes cours et M’entraîner restent accessibles juste en dessous." : showOriginalHome ? "Tu y retrouves ton cours à reprendre et les raccourcis pour choisir une leçon ou faire des exercices." : "Tu y retrouves une astuce à retenir et ton cours à reprendre. Tu peux aussi choisir un autre cours.",
      spokenText: showDocumentHome ? "Voici l’Accueil. Retrouve ton cours et ouvre directement son résumé, ses questions ou sa fiche essentielle. Mes cours et M’entraîner restent accessibles juste en dessous." : showOriginalHome ? "Voici l’Accueil. Tu y retrouves ton cours à reprendre et les raccourcis pour choisir une leçon ou faire des exercices." : "Voici l’Accueil. Tu y retrouves une astuce à retenir et ton cours à reprendre. Tu peux aussi choisir un autre cours.",
    },
    {
      id: "paths",
      targetId: "nav-paths",
      eyebrow: "Trouver une leçon",
      title: "Mes cours",
      text: "Choisis ta matière, cherche une leçon et ouvre son cours complet. Le sommaire t’aide à retrouver chaque partie.",
      spokenText: "Dans Mes cours, choisis ta matière, cherche une leçon et ouvre son cours complet. Le sommaire t’aide à retrouver chaque partie.",
    },
    {
      id: "arena",
      targetId: "nav-arena",
      eyebrow: "Passer à la pratique",
      title: "M’entraîner",
      text: "Ouvre directement des exercices, un devoir ou un sujet d’examen. Les outils de courbes et de géométrie sont aussi ici.",
      spokenText: "Dans M’entraîner, ouvre directement des exercices, un devoir ou un sujet d’examen. Les outils de courbes et de géométrie sont aussi ici.",
    },
    {
      id: "space",
      targetId: "nav-space",
      eyebrow: "Ton espace personnel",
      title: "Mon espace",
      text: "Tes résultats, tes messages, ton profil, le classement et la boutique sont réunis ici. Pour modifier ta classe, contacte l’administration.",
      spokenText: "Mon espace réunit tes résultats, tes messages, ton profil, le classement et la boutique. Pour modifier ta classe, contacte l’administration.",
    },
    {
      id: "davy",
      targetId: "davy",
      eyebrow: "Je reste avec toi",
      title: "Appelle-moi quand tu veux",
      text: "Clique sur mon portrait pour recevoir un conseil adapté à la page ou demander un indice pendant une leçon.",
      spokenText: "Et moi, je reste avec toi. Clique sur mon portrait pour recevoir un conseil adapté à la page ou demander un indice pendant une leçon. On commence ?",
    },
  ];
}

function findVisibleTarget(targetId: string): TargetRect | null {
  const targets = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour-id="${targetId}"]`));
  const target = targets.find((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
  });
  if (!target) return null;
  const rect = target.getBoundingClientRect();
  const padding = 10;
  return {
    top: Math.max(8, rect.top - padding),
    left: Math.max(8, rect.left - padding),
    right: Math.min(window.innerWidth - 8, rect.right + padding),
    bottom: Math.min(window.innerHeight - 8, rect.bottom + padding),
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

export function FirstVisitTour({ userId, learnerName, replayKey = 0, forceOpen = false }: FirstVisitTourProps) {
  const storageKey = `excellence-davy-tour-complete-v1:${userId}`;
  const steps = useMemo(() => tourSteps(learnerName), [learnerName]);
  const [open, setOpen] = useState(() => forceOpen || window.localStorage.getItem(storageKey) !== "yes");
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const voice = useDavyVoice();
  const step = steps[stepIndex];
  const lastStep = stepIndex === steps.length - 1;

  useEffect(() => {
    setOpen(forceOpen || window.localStorage.getItem(storageKey) !== "yes");
    setStarted(false);
    setStepIndex(0);
    voice.stop();
  }, [forceOpen, storageKey]);

  useEffect(() => {
    if (replayKey <= 0) return;
    setOpen(true);
    setStarted(false);
    setStepIndex(0);
    voice.stop();
  }, [replayKey]);

  const updateTarget = useCallback(() => {
    setTargetRect(open && started && step.targetId ? findVisibleTarget(step.targetId) : null);
  }, [open, started, step.targetId]);

  useEffect(() => {
    updateTarget();
    if (!open) return;
    const frame = window.requestAnimationFrame(updateTarget);
    window.addEventListener("resize", updateTarget);
    window.addEventListener("scroll", updateTarget, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateTarget);
      window.removeEventListener("scroll", updateTarget, true);
    };
  }, [open, stepIndex, updateTarget]);

  useEffect(() => {
    if (!open) voice.stop();
    else window.dispatchEvent(new Event("excellence:davy-guide-close"));
  }, [open, voice.stop]);

  if (!open) return null;

  const complete = () => {
    voice.stop();
    if (!forceOpen) window.localStorage.setItem(storageKey, "yes");
    setOpen(false);
  };

  const start = () => {
    setStarted(true);
    voice.speak(step.spokenText);
  };

  const next = () => {
    if (lastStep) {
      complete();
      return;
    }
    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    voice.speak(steps[nextIndex].spokenText);
  };

  const previous = () => {
    const previousIndex = Math.max(0, stepIndex - 1);
    setStepIndex(previousIndex);
    voice.speak(steps[previousIndex].spokenText);
  };

  if (!started) return (
    <aside className="davy-tour-invite" aria-label="Visite facultative avec Davy">
      <button type="button" onClick={start}><SpeakerHigh size={18} /> Découvrir le site</button>
      <button type="button" onClick={complete}>Plus tard</button>
    </aside>
  );

  const cardStyle: CSSProperties = !started || !targetRect
    ? { left: "50%", top: "50%", transform: "translate(-50%, -50%)" }
    : window.innerWidth <= 760
      ? { left: 12, right: 12, bottom: 96 }
      : targetRect.left < window.innerWidth / 2
        ? { left: Math.min(targetRect.right + 28, window.innerWidth - 430), top: Math.max(24, Math.min(targetRect.top - 16, window.innerHeight - 510)) }
        : { left: Math.max(24, targetRect.left - 418), top: Math.max(24, Math.min(targetRect.top - 16, window.innerHeight - 510)) };

  return (
    <div className={`davy-tour ${!started || !targetRect ? "is-centered" : ""}`} role="dialog" aria-modal="true" aria-labelledby="davy-tour-title">
      {started && targetRect && (
        <span
          className="davy-tour-spotlight"
          style={{ top: targetRect.top, left: targetRect.left, width: targetRect.width, height: targetRect.height }}
          aria-hidden="true"
        />
      )}

      <section className="davy-tour-card" style={cardStyle}>
        <header className="davy-tour-header">
          <CompanionAvatar
            className={`davy-tour-avatar ${voice.speaking && !voice.paused ? "is-speaking" : ""}`}
            motion={lastStep && started ? "celebrate" : voice.speaking ? "wave" : "idle"}
          />
          <div>
            <span>Davy te guide</span>
            <strong>{started ? `${stepIndex + 1} / ${steps.length}` : "Première visite"}</strong>
          </div>
          <button type="button" aria-label="Passer la visite" onClick={complete}><X size={20} weight="bold" /></button>
        </header>

        <div className="davy-tour-body" aria-live="polite">
          <p className="davy-tour-eyebrow">{step.eyebrow}</p>
          <h2 id="davy-tour-title">{step.title}</h2>
          <p>{step.text}</p>

          <div className="davy-tour-voice-status">
            <span className={voice.speaking && !voice.paused ? "is-speaking" : ""} aria-hidden="true"><i /><i /><i /><i /></span>
            <small>{!voice.supported ? "Voix indisponible sur ce navigateur · texte affiché" : voice.muted ? "Voix coupée · texte affiché" : voice.paused ? "Voix en pause" : voice.loading ? "Davy prépare sa voix…" : voice.speaking ? "Davy parle…" : "Voix de Davy prête"}</small>
          </div>

          <div className="davy-tour-audio-controls" aria-label="Commandes vocales de Davy">
            <button type="button" onClick={voice.toggleMuted} disabled={!voice.supported} aria-label={voice.muted ? "Activer la voix" : "Couper la voix"} aria-pressed={voice.muted}>
              {voice.muted ? <SpeakerSlash size={19} weight="fill" /> : <SpeakerHigh size={19} weight="duotone" />}
            </button>
            <button type="button" onClick={voice.togglePause} disabled={!voice.supported || (!voice.speaking && !voice.paused)} aria-label={voice.paused ? "Reprendre la voix" : "Mettre la voix en pause"}>
              {voice.paused ? <Play size={19} weight="fill" /> : <Pause size={19} weight="fill" />}
            </button>
            <button type="button" onClick={() => voice.speak(step.spokenText)} disabled={!voice.supported || voice.muted} aria-label="Répéter ce message">
              <ArrowCounterClockwise size={19} weight="bold" />
            </button>
            <span>Sous-titres toujours affichés</span>
          </div>
        </div>

        <footer className="davy-tour-footer">
          <div className="davy-tour-progress" aria-label={`Étape ${stepIndex + 1} sur ${steps.length}`}>
            {steps.map((item, index) => <span key={item.id} className={index <= stepIndex && started ? "is-active" : ""} />)}
          </div>
          {!started ? (
            <button className="davy-tour-next" type="button" onClick={start}>
              <SpeakerHigh size={20} weight="duotone" /> Commencer la visite
            </button>
          ) : (
            <div className="davy-tour-navigation">
              <button type="button" onClick={previous} disabled={stepIndex === 0}>Précédent</button>
              <button className="davy-tour-next" type="button" onClick={next}>
                {lastStep ? <><Check size={20} weight="bold" /> C’est parti !</> : <>Suivant <ArrowRight size={20} weight="bold" /></>}
              </button>
            </div>
          )}
        </footer>
      </section>
    </div>
  );
}
