import type { SubjectId } from "../../domain/learning";
import { isSubjectAvailableForLevel, schoolLevels, subjects } from "../../data/programme";

export interface HomeTip { id: string; subjectId?: SubjectId; text: string; }
/** Original short learning reminders, not quotations or automatically generated advice. */
export const homeTips: readonly HomeTip[] = [
  { id: "method-recall", text: "Ferme ton cours et reformule l’idée essentielle avec tes propres mots." },
  { id: "method-error", text: "Après une erreur, repère l’étape qui t’a bloqué avant de refaire l’exercice sans regarder la solution." },
  { id: "method-spaced", text: "Reviens sur une notion plusieurs fois, à quelques jours d’intervalle, plutôt que de tout revoir d’un seul coup." },
  { id: "method-instruction", text: "Avant de répondre, repère le verbe de la consigne : définir, expliquer et justifier ne demandent pas le même travail." },
  { id: "method-example", text: "Pour vérifier que tu comprends une règle, invente un exemple simple et applique-la." },
  { id: "method-plan", text: "Face à un exercice long, note ce que tu connais et ce que tu cherches avant de commencer." },
  { id: "math-domain", subjectId: "mathematics", text: "Avant de transformer une expression, vérifie son domaine de définition : un dénominateur ne peut pas être nul." },
  { id: "math-inequality", subjectId: "mathematics", text: "Quand tu multiplies ou divises une inégalité par un nombre strictement négatif, inverse le sens de l’inégalité." },
  { id: "math-conclusion", subjectId: "mathematics", text: "Après tes calculs, conclus par une phrase qui répond exactement à la question posée." },
  { id: "math-sign", subjectId: "mathematics", text: "Pour déterminer le signe d’un produit, étudie chaque facteur puis rassemble les résultats dans un tableau de signes." },
  { id: "math-check", subjectId: "mathematics", text: "Une solution trouvée doit encore être vérifiée dans l’énoncé et dans le domaine autorisé." },
  { id: "french-argument", subjectId: "french", text: "Un exemple illustre un argument : explique ce qu’il montre au lieu de le laisser parler tout seul." },
  { id: "french-connectors", subjectId: "french", text: "Choisis tes connecteurs selon le lien entre les idées : opposition, cause, conséquence ou ajout." },
  { id: "french-analysis", subjectId: "french", text: "Dans une analyse, relie le procédé d’écriture à son effet et au sens du texte." },
  { id: "french-summary", subjectId: "french", text: "Dans un résumé, reformule les idées essentielles sans ajouter ton avis personnel." },
  { id: "french-reread", subjectId: "french", text: "À la relecture, vérifie d’abord le sens de tes phrases, puis les accords et la ponctuation." },
  { id: "philo-quote", subjectId: "philosophy", text: "Une citation ne suffit pas : explique toujours son lien avec ton argument." },
  { id: "philo-define", subjectId: "philosophy", text: "Définis les mots du sujet dans leur contexte avant de chercher un plan." },
  { id: "philo-problem", subjectId: "philosophy", text: "Une problématique met au jour une difficulté du sujet : elle ne se limite pas à répéter la question." },
  { id: "philo-objection", subjectId: "philosophy", text: "Pour éprouver une idée, cherche une objection et demande-toi comment y répondre." },
  { id: "philo-source", subjectId: "philosophy", text: "N’attribue pas une phrase à un auteur si tu n’en connais pas la source : mieux vaut expliquer l’idée avec tes propres mots." },
  { id: "hg-document", subjectId: "history-geography", text: "Avant d’expliquer un document, identifie sa nature, son auteur, sa date et son contexte." },
  { id: "hg-cause", subjectId: "history-geography", text: "Distingue les causes d’un événement, son déroulement et ses conséquences pour construire une réponse claire." },
  { id: "hg-values", subjectId: "history-geography", text: "Avant de comparer deux chiffres, vérifie leur unité, leur date et ce qu’ils mesurent." },
  { id: "hg-map", subjectId: "history-geography", text: "Une carte se lit avec son titre, sa légende, son orientation et son échelle." },
  { id: "svt-observation", subjectId: "svt", text: "Distingue l’observation de son interprétation : décris d’abord le résultat, puis explique ce qu’il signifie." },
  { id: "svt-control", subjectId: "svt", text: "Pour interpréter une expérience, compare le résultat au témoin et repère le facteur étudié." },
  { id: "svt-process", subjectId: "svt", text: "Pour retenir un mécanisme biologique, replace ses étapes dans l’ordre et explique le lien entre elles." },
  { id: "svt-graph", subjectId: "svt", text: "Sur un graphique, lis les axes et les unités avant de décrire l’évolution des valeurs." },
  { id: "pc-units", subjectId: "physics-chemistry", text: "Avant une application numérique, vérifie les unités et effectue les conversions nécessaires." },
  { id: "pc-vector", subjectId: "physics-chemistry", text: "Pour décrire une force, précise son point d’application, sa direction, son sens et son intensité." },
  { id: "pc-equation", subjectId: "physics-chemistry", text: "Une équation chimique équilibrée conserve le nombre d’atomes de chaque élément et la charge électrique totale." },
  { id: "pc-model", subjectId: "physics-chemistry", text: "Avant d’utiliser une loi physique, vérifie que les conditions de son application sont réunies." },
];

export function homeTipsForLevel(levelId: string) {
  const known = schoolLevels.some(level => level.id === levelId);
  return homeTips.filter(tip => !tip.subjectId || (known && subjects[tip.subjectId].enabled && isSubjectAvailableForLevel(subjects[tip.subjectId], levelId)));
}

export interface HomeTipRotation { version: 1; lastId: string; remainingIds: string[]; }
export interface TipStorage { getItem(key: string): string | null; setItem(key: string, value: string): void; }
const memory = new Map<string, HomeTipRotation>();
export const homeTipStorageKey = (userId: string, levelId: string) => `excellence:home-tips:v1:${encodeURIComponent(userId)}:${encodeURIComponent(levelId)}`;

export function readHomeTipRotation(storage: TipStorage | undefined, key: string): HomeTipRotation | undefined {
  try {
    const raw = storage?.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<HomeTipRotation>;
      if (parsed.version === 1 && typeof parsed.lastId === "string" && Array.isArray(parsed.remainingIds)) {
        return { version: 1, lastId: parsed.lastId, remainingIds: parsed.remainingIds.filter((id): id is string => typeof id === "string").slice(0, homeTips.length) };
      }
    }
  } catch { /* The reminder works without optional browser storage. */ }
  return memory.get(key);
}

export function nextHomeTip(levelId: string, previous?: HomeTipRotation, random = Math.random) {
  const allowed = homeTipsForLevel(levelId);
  const ids = new Set(allowed.map(tip => tip.id));
  let remaining = [...new Set(previous?.remainingIds ?? [])].filter(id => ids.has(id) && id !== previous?.lastId);
  if (!remaining.length) {
    remaining = allowed.map(tip => tip.id);
    for (let i = remaining.length - 1; i > 0; i--) {
      const value = random();
      const j = Math.floor((Number.isFinite(value) ? Math.min(.999999999, Math.max(0, value)) : 0) * (i + 1));
      [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
    }
    if (remaining.length > 1 && remaining[0] === previous?.lastId) [remaining[0], remaining[1]] = [remaining[1], remaining[0]];
  }
  const [id, ...rest] = remaining;
  return { tip: allowed.find(tip => tip.id === id)!, rotation: { version: 1, lastId: id, remainingIds: rest } satisfies HomeTipRotation };
}

export function saveHomeTipRotation(storage: TipStorage | undefined, key: string, rotation: HomeTipRotation) {
  memory.set(key, rotation);
  try { storage?.setItem(key, JSON.stringify(rotation)); } catch { /* Keep the in-memory rotation for this tab. */ }
}
