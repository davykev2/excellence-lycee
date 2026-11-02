import type {CourseDocument,CourseDocumentSection,CourseEssentialCard} from "../../domain/courseDocument";
import {probabilityCommonSections} from "./terminalAProbabilitySummary";
import {probabilityVariableSection} from "./terminalAProbabilityVariables";
import {probabilityCommonEvaluations,probabilityVariableEvaluations} from "./terminalAProbabilityEvaluations";
const r=String.raw;
const commonLegacy={
 "random-experiments-events":"ta-proba-universe",
 "probability-events-subsets":"ta-proba-events",
 "event-operations":"ta-proba-operations",
 "finite-probability":"ta-proba-weights",
 "probability-event-properties":"ta-proba-properties",
 "probability-equiprobability":"ta-proba-combinations",
};
const variableLegacy={"random-variable-law":"ta-proba-law"};
const withAnchors=(section:CourseDocumentSection,anchors:Record<string,string>):CourseDocumentSection=>({...section,topics:section.topics.map(topic=>({...topic,legacyLessonIds:Object.keys(anchors).filter(id=>anchors[id]===topic.id)}))});
const commonSections=probabilityCommonSections.map(section=>withAnchors(section,commonLegacy));
const commonEssentials:CourseEssentialCard[]=[
 {id:"ta-proba-essential-universe",title:"Issue, univers, événement",topicId:"ta-proba-events",body:r`Une issue est un résultat. L’univers $\Omega$ rassemble les résultats possibles. Un événement est une partie de $\Omega$. Il est réalisé si l’issue obtenue lui appartient.`},
 {id:"ta-proba-essential-operations",title:"Les mots qui choisissent l’opération",topicId:"ta-proba-operations",body:r`« Et » → $A\cap B$. « Au moins un des deux » → $A\cup B$. « Pas A » → $\overline A$. Pour des événements contraires, intersection vide **et** réunion égale à l’univers.`},
 {id:"ta-proba-essential-total",title:"La somme des probabilités vaut 1",topicId:"ta-proba-weights",body:r`Chaque probabilité est positive ou nulle. La somme sur toutes les issues est $1$. Une probabilité d’événement se calcule en additionnant celles de ses issues.`},
 {id:"ta-proba-essential-properties",title:"Réunion et contraire",topicId:"ta-proba-properties",body:r`$$P(A\cup B)=P(A)+P(B)-P(A\cap B).$$
Si les événements sont incompatibles, l’intersection est vide.
$$P(\overline A)=1-P(A).$$`},
 {id:"ta-proba-essential-equal",title:"Compter seulement sous équiprobabilité",topicId:"ta-proba-equal",body:r`$$P(A)=\frac{\text{cas favorables}}{\text{cas possibles}}.$$
Cette formule exige des issues équiprobables. Des couleurs ou des valeurs ne le sont pas forcément.`},
 {id:"ta-proba-essential-choose",title:"Tirage simultané, sans remise",topicId:"ta-proba-combinations",body:r`Choisir $k$ objets parmi $n$ sans ordre : $\binom nk$. Multiplier pour choisir dans plusieurs catégories ; additionner pour réunir des cas incompatibles. « Au moins un » se traite souvent par le contraire « aucun ».`},
];
const variableEssentials:CourseEssentialCard[]=[
 {id:"ta-proba-essential-law",title:"Construire la loi de X",topicId:"ta-proba-law",body:r`Lister les valeurs distinctes de $X$, puis associer à chacune $P(X=x_i)$. Regrouper les issues de même valeur et vérifier que les probabilités ont pour somme $1$.`},
 {id:"ta-proba-essential-expectation",title:"Espérance : une moyenne pondérée",topicId:"ta-proba-expectation",body:r`$$E(X)=p_1x_1+\cdots+p_mx_m.$$
Pour un gain net : espérance nulle → jeu équitable ; positive → favorable ; négative → défavorable. Ce n’est pas une garantie par partie.`},
 {id:"ta-proba-essential-variance",title:"Variance, puis écart type",topicId:"ta-proba-variance",body:r`$$V(X)=p_1x_1^2+\cdots+p_mx_m^2-[E(X)]^2.$$
$$\sigma(X)=\sqrt{V(X)}.$$
On élève les valeurs au carré, pas les probabilités.`},
 {id:"ta-proba-essential-gain",title:"Traduire un objectif moyen",topicId:"ta-proba-kermesse",body:r`« En moyenne au moins $a$ » se traduit par $E(X)\geq a$. Déterminer les gains et leurs probabilités, calculer l’espérance, résoudre l’inéquation, puis interpréter le seuil.`},
];
const sourceBase={title:"TA Maths leçon 02 · Probabilités",pageCount:13,sha256:"b8257b893e47ff3506cb12d5e61e24db05a265361e1572a6e9b9bb7a30d20f35"};
const editorialNotes=[
 "Support de 13 pages inspecté à l’image et au texte ; situation d’apprentissage initiale ignorée. Définitions, propriétés, exercices corrigés et renforcements sont reformulés ; les contenus documentaires restent indépendants des niveaux historiques.",
 "La page 7 réserve explicitement les variables aléatoires à A1. A2 conserve le tronc commun et les renforcements de dénombrement des pages 11–12, sans les exercices de variables aléatoires situés sur les mêmes pages.",
 "Inclusion corrigée dans son sens : un multiple de 6 implique un nombre pair, pas l’inverse. Réunion {2;3;4;6} distinguée de l’intersection {6}. Incompatible ne signifie pas contraire.",
 "Tirages uniformes d’objets physiques : les couleurs, valeurs et gains agrégés ne sont pas automatiquement équiprobables.",
 "Desserts : dénominateur 20 475 conservé partout, non 20 474 ni 20 457. Au moins une vanille : 387/455, équivalent à 1161/1365.",
 "Loi de X : valeurs distinctes et somme indexée par leur nombre ; en kermesse, regrouper les gains quand m vaut 20, 30 ou 100. Espérance par couleurs valable dans tous les cas.",
 "Aucune mise n’est inventée pour Mariam ; la somme reçue est distinguée d’un gain net. Espérance ≥45 ne garantit pas 45 F à chaque partie.",
 "Exercice de modèle : critère explicite f(x)≥0,95 cohérent avec la correction source ; le texte source supérieur à est harmonisé. Seuil exact19/117≈0,162393, soit16,2393%, arrondi16,24% ; 17% est seulement le minimum en pourcentages entiers. Ce seuil n’est pas un critère médical universel.",
];

/** Shared topic objects and evaluations, but distinct paths, draft keys and historical rewards. */
export const terminalA2ProbabilityDocument:CourseDocument={
 id:"ta-a2-probability-document",version:1,levelIds:["terminale-a"],
 source:{...sourceBase,summaryPages:[1,2,3,4,5,6,10,11,12],evaluationPages:[2,3,4,5,6,10,11,12],editorialNotes},
 sections:commonSections,evaluations:probabilityCommonEvaluations,essentials:commonEssentials,legacyAnchors:commonLegacy,
};
export const terminalA1ProbabilityDocument:CourseDocument={
 id:"ta-a1-probability-document",version:1,levelIds:["terminale-a"],
 source:{...sourceBase,summaryPages:Array.from({length:13},(_,index)=>index+1),evaluationPages:Array.from({length:12},(_,index)=>index+2),editorialNotes},
 sections:[...commonSections,withAnchors(probabilityVariableSection,variableLegacy)],
 evaluations:[...probabilityCommonEvaluations,...probabilityVariableEvaluations],
 essentials:[...commonEssentials,...variableEssentials],legacyAnchors:{...commonLegacy,...variableLegacy},
};
