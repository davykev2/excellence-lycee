import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { integralFixationA } from "./terminalCIntegralFixationA";
import { integralFixationB } from "./terminalCIntegralFixationB";
import { integralFixationC } from "./terminalCIntegralFixationC";
import { integralDeepeningA } from "./terminalCIntegralDeepeningA";
import { integralDeepeningB } from "./terminalCIntegralDeepeningB";
import { integralDeepeningC } from "./terminalCIntegralDeepeningC";
import { integralComplex } from "./terminalCIntegralComplex";

const fixation = [...integralFixationA, ...integralFixationB, ...integralFixationC];
const groups: Array<[string,string,number,number,string]> = [
  ["definition","Définition de l’intégrale",1,3,"int-definition"],
  ["linearity","Linéarité de l’intégrale",4,5,"int-linearity"],
  ["chasles","Relation de Chasles",6,9,"int-chasles"],
  ["order","Intégrale et inégalités",10,12,"int-order"],
  ["bounds","Inégalité de la moyenne",13,14,"int-bounds"],
  ["average","Valeur moyenne d’une fonction",15,16,"int-average"],
  ["parts","Intégration par parties",17,20,"int-parts"],
  ["affine","Changement de variable affine",21,22,"int-affine"],
  ["parity","Fonctions paires ou impaires",23,25,"int-parity"],
  ["period","Fonctions périodiques",26,27,"int-period"],
  ["variable","Fonctions définies par une intégrale",28,29,"int-variable"],
  ["areas","Calculs d’aires",30,34,"int-area-between"],
  ["rectangles","Méthode des rectangles",35,37,"int-rectangles"],
];
export const terminalCIntegralExercises: ArenaExerciseCollection = {
  id: "tc-l7-exercises-20261019", version: 1, levelId: "terminale-c", subjectId: "mathematics", lessonKey: "terminale-c-math-l15-integral-calculus",
  source: {
    title: "Pyramide Maths Tle C · Tome 1 · Leçon 7 · Calcul intégral", pages: [181,182,183,184,185,186,187,188,189,190],
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "67 exercices, folios181–190/PDF183–192, inspection visuelle intégrale et agrandissements183/184/185/188/189/192. Fixation37 dans13 rubriques, approfondissement27, situations3. SourceNumber et sous-questions conservés ; corrections originales Excellence, sans scans.",
      "Path historique L15 C ; 8 IDs/poids/153 questions,10 000 XP, huit fils et compteur10 294 inchangés. Banque locale sans XP, modèles rédigés non notés artificiellement. Aucune migration.",
      "Ex3.1 domaine de f étendu à[-3;3] afin que f(3x) soit défini. Ex3.4 bornes ln3 versln2, résultat-5/2. Ex10.1 conserve l’intégrale de b vers a et le signe <=0 : faux. Ex10.2 est vraie précisément parce que l’intégrale de g est inversée.",
      "Ex15 : les bornes d vers c dans la proposition2 sont conservées ; unique bonne réponse3. Pas de suppression ou modification d’une prétendue réponse double après lecture agrandie.",
      "Ex19.2 et39.15 bornes décroissantes conservées ; ex21.2=3133/21. Ex24.5 dénominateur1+e²ˣ, parité impaire. Ex27 premier déplacement de pi/2 vers[-pi/3;pi/6].",
      "Ex30 g continue surR pour que le distracteur g(-x) soit défini ; a<b explicité. Ex32 conserve les deux aires :40/3 et4cm², échelles2cm/1cm. Ex31 unité2cm donc4ln5cm² ; ex33=8/3 ; ex34=4cm².",
      "Ex35.6 f également définie sur[0;2] afin de discuter f(i/n), puis contre-exemple3-x ; les points corrects sur[1;2] sont1+i/n. Ex36 et37 arrondis des bornes vers l’extérieur, incertitudes non sous-estimées.",
      "Ex39.4 angle écrit explicitement x(x+1), cohérent avec2x+1 ; ex48 domaineR* et nonR. Ex52.4a renforce la borne imprimée e^t>t*e^(1/2) en e^t>t*e^(t/2), vraie et suffisante pour F(x)/x→infini. L’ancienne borne constante ne démontrait pas cette conclusion.",
      "Ex53 paramétrages theta etAH précisés, moyenne2R² dans les deux cas. Ex57 M=max|f'|+1 justifie le signe strict, puis maximum exactsqrt(2/e) autorisé dans la borne large de l’application ; n4289 est une garantie suffisante, pas un minimum de l’erreur réelle.",
      "Ex58 repère orthogonal OI2/OJ3cm respecté. Ex63 I2=(5e³-2)/27. Ex64 B.1b rétablit fn/x et nonf1/x ; tangente au point d’abscisse0 (0,1), pas enO ; sous-numérotation B4a–d normalisée, tous les points conservés.",
      "Situations : ex65 aire et non longueur d’arc,65598,9583m² ; ex66 maïs inchangé, total e²-e hm²,1hm²=1ha,arrondi5ha ; ex67 exponentielle positive e^(x/30) conservée,moyenne900e-1800. Les modèles n’affirment pas des faits médicaux ou techniques réels.",
      "Figures redessinées : courbes données dans les énoncés31–34,53,65,66 ; figures de réponse réservées aux corrections36,37,52,58,64,67. Fonctions fixes et quadrature bornée, aucun eval ni code utilisateur.",
    ],
  },
  sections: [
    ...groups.map(([id,title,start,end,courseTopicId]) => ({ id: "tc-l7-" + id, title, category: "fixation" as const, courseTopicId, exercises: fixation.filter(item => item.sourceNumber! >= start && item.sourceNumber! <= end) })),
    { id: "tc-l7-deepening", title: "Exercices d’approfondissement", category: "deepening", courseTopicId: "int-parts", exercises: [...integralDeepeningA,...integralDeepeningB,...integralDeepeningC] },
    { id: "tc-l7-complex", title: "Situations complexes", category: "complex", courseTopicId: "int-area-between", exercises: integralComplex },
  ],
};
