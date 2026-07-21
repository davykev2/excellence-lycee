import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { CompanionAvatar } from "../companion/CompanionAvatar";

interface TutorPanelProps {
  onClose: () => void;
  lessonTitle?: string;
}

function getLessonHint(lessonTitle?: string) {
  const title = lessonTitle?.toLocaleLowerCase("fr") ?? "";

  if (title.includes("définition")) return {
    hint: "Repère d’abord l’opération qui peut être interdite. Ici, demande-toi pour quelle valeur le dénominateur devient nul.",
    step: "Écris la condition x − 2 ≠ 0, puis isole x. La valeur obtenue sera exclue de l’ensemble de définition.",
  };
  if (title.includes("machine") || title.includes("langage")) return {
    hint: "Lis la fonction comme une machine : choisis une entrée x, applique la règle dans l’ordre, puis observe la sortie f(x).",
    step: "Remplace x par la valeur donnée sans modifier le reste de la formule, puis effectue les opérations dans l’ordre de priorité.",
  };
  if (title.includes("image") || title.includes("antécédent")) return {
    hint: "Dans f(x) = y, x est l’antécédent et y est l’image. Commence par identifier lequel des deux l’énoncé te demande.",
    step: "Pour chercher une image, pars de x et calcule f(x). Pour chercher un antécédent, pars de y et retrouve le ou les x correspondants.",
  };
  if (title.includes("courbe")) return {
    hint: "Pars de la valeur x sur l’axe horizontal, monte jusqu’à la courbe, puis lis la hauteur obtenue sur l’axe vertical.",
    step: "Trace mentalement une verticale depuis x jusqu’à la courbe, puis une horizontale vers l’axe des ordonnées : cette valeur est f(x).",
  };
  if (title.includes("intervalle")) return {
    hint: "Ne regarde pas une seule valeur : suis toute la portion de courbe correspondant à l’intervalle donné.",
    step: "Repère la plus petite et la plus grande hauteur atteintes sur cette portion ; elles bornent l’intervalle des images.",
  };
  if (title.includes("variation") || title.includes("maximum") || title.includes("minimum")) return {
    hint: "Lis la courbe de gauche à droite et observe si ses hauteurs montent, descendent ou restent constantes.",
    step: "Découpe la lecture aux changements de sens, puis nomme chaque intervalle croissant ou décroissant.",
  };

  return {
    hint: "Relis la question et repère les données déjà connues avant de choisir la propriété à utiliser.",
    step: "Écris une étape intermédiaire avec tes propres mots, puis vérifie qu’elle répond exactement à ce qui est demandé.",
  };
}

export function TutorPanel({ onClose, lessonTitle }: TutorPanelProps) {
  const [showStep, setShowStep] = useState(false);
  const hint = getLessonHint(lessonTitle);

  return (
    <aside className="tutor-panel" role="dialog" aria-modal="true" aria-labelledby="tutor-title">
      <header>
        <span className="tutor-icon tutor-icon--davy"><CompanionAvatar decorative /></span>
        <div>
          <span>Davy · Guide Excellence</span>
          <h2 id="tutor-title">Un indice, pas la réponse</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Fermer le tuteur"><X size={22} /></button>
      </header>
      <p>{hint.hint}</p>
      {showStep ? (
        <div className="tutor-step">
          <strong>Étape suivante</strong>
          <p>{hint.step}</p>
        </div>
      ) : (
        <button className="secondary-action" type="button" onClick={() => setShowStep(true)}>Voir l’étape suivante</button>
      )}
    </aside>
  );
}
