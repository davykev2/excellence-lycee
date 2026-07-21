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
      text: "Tu y retrouves ta prochaine leçon, ta progression et les objectifs utiles pour continuer sans te perdre.",
      spokenText: "Voici l’Accueil. Tu y retrouves ta prochaine leçon, ta progression et les objectifs utiles pour continuer sans te perdre.",
    },
    {
      id: "paths",
      targetId: "nav-paths",
      eyebrow: "Apprendre dans le bon ordre",
      title: "Les Parcours",
      text: "Choisis une matière, ouvre une leçon puis avance niveau après niveau. Tes résultats et tes XP y sont conservés.",
      spokenText: "Dans les Parcours, tu choisis une matière, tu ouvres une leçon, puis tu avances niveau après niveau. Tes résultats et tes X P y sont conservés.",
    },
    {
      id: "arena",
      targetId: "nav-arena",
      eyebrow: "T’entraîner et te dépasser",
      title: "L’Arène",
      text: "Tu peux y faire des exercices, des devoirs, des quiz, des duels, des compétitions et des sujets type BAC.",
      spokenText: "Voici l’Arène. Tu peux y faire des exercices, des devoirs, des quiz, des duels, des compétitions et des sujets type bac.",
    },
    {
      id: "ranking",
      targetId: "nav-ranking",
      eyebrow: "Mesurer tes efforts",
      title: "Le Classement",
      text: "Il te permet de suivre ta position dans ta classe. Mais rappelle-toi : ta vraie victoire, c’est de mieux comprendre qu’hier.",
      spokenText: "Le Classement te permet de suivre ta position dans ta classe. Mais rappelle-toi : ta vraie victoire, c’est de mieux comprendre qu’hier.",
    },
    {
      id: "messages",
      targetId: "nav-messages",
      eyebrow: "Ne jamais rester bloqué",
      title: "Les Messages",
      text: "C’est ici que tu échanges avec les personnes qui t’accompagnent lorsque tu as besoin d’une aide humaine.",
      spokenText: "Dans les Messages, tu échanges avec les personnes qui t’accompagnent lorsque tu as besoin d’une aide humaine.",
    },
    {
      id: "profile",
      targetId: "nav-profile",
      eyebrow: "Ton espace personnel",
      title: "Le Profil",
      text: "Tu y vérifies ton compte, ton niveau et ta série. Pour changer de classe, il faudra contacter un administrateur.",
      spokenText: "Dans ton Profil, tu vérifies ton compte, ton niveau et ta série. Pour changer de classe, il faudra contacter un administrateur.",
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
