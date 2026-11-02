import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { sequencesFixationA } from "./terminalCSequencesFixationA";
import { sequencesFixationB } from "./terminalCSequencesFixationB";
import { sequencesDeepeningA } from "./terminalCSequencesDeepeningA";
import { sequencesDeepeningB } from "./terminalCSequencesDeepeningB";
import { sequencesDeepeningC } from "./terminalCSequencesDeepeningC";
import { sequencesComplex } from "./terminalCSequencesComplex";

const fixation = [...sequencesFixationA, ...sequencesFixationB];
const groups: Array<[string, string, number, number, string]> = [
  ["axis", "Représenter les termes d’une suite sur un axe", 1, 2, "seq-usual-summary"],
  ["induction", "Démontrer par récurrence", 3, 6, "seq-recursion-summary"],
  ["bounds", "Suites minorées, majorées ou bornées", 7, 10, "seq-bounds-summary"],
  ["variation", "Étudier le sens de variation d’une suite", 11, 13, "seq-monotonicity-summary"],
  ["convergence", "Reconnaître et étudier la convergence", 14, 16, "seq-limit-summary"],
  ["comparison", "Utiliser les propriétés de comparaison", 17, 18, "seq-comparison-summary"],
  ["usual", "Suites arithmétiques et géométriques", 19, 27, "seq-usual-summary"],
];
export const terminalCSequencesExercises: ArenaExerciseCollection = {
  id: "tc-l6-exercises-20261019", version: 1, levelId: "terminale-c", subjectId: "mathematics", lessonKey: "terminale-c-math-l12-sequences",
  source: {
    title: "Pyramide Maths Tle C · Tome 1 · Leçon 6 · Suites numériques", pages: [151, 152, 153, 154, 155, 156],
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "55 exercices des folios 151–156 / pages PDF153–158, tous inspectés visuellement ; agrandissements des folios153/154. 27 fixation dans 7 rubriques, 25 approfondissement, 3 situations complexes ; numéros et sous-questions conservés. Solutions originales Excellence, sans scans.",
      "Leçon 6 du tome Analyse et probabilité, raccord au path historique L12 C. Les 8 IDs/poids/79 questions/10 000 XP et le compteur canonique 10 294 restent inchangés ; banque locale sans XP. Rédactions à grille, pas de fausse note automatique.",
      "Ex.4 : u0=0 conservé, encadrement 2<=u_n<4 demandé pour n>=1, pas n>=0. Ex.5 : u0=2 conduit à la suite constante2, encadrement 0<=U<=2 pour la définition. Ex.8 : preuve par blocs de trois pour le cycle2,1/2,-1, et non fausse hérédité basée sur la seule majoration2.",
      "Ex.13 : domaines n>=1 pour les inverses. Ex.14.3 : contre-exemple à la convergence, on n’infère pas une limite d’une seule borne supérieure. Ex.15.c : limite de 2^n/n! démontrée par majoration géométrique, pas par une règle de croissance hors programme ; 15.d logarithme et limite ln(1+h)/h.",
      "Ex.18 : dénominateur n*sqrt(n)+1 conservé, et non n*sqrt(n+1). Ex.25 : 11 termes de rang0 à10, somme2047/3. Ex.28 : les deux raisons2 et1/2 et les deux ordres admis ; ex.35 idem pour les raisons4 et-4.",
      "Ex.32 : U0=2/3 et terme (n+2)/(2sqrt2) conservés. V0=2sqrt2/3 ; U_n=n/sqrt2+(2/3)2^-n ; somme n(n+1)/(2sqrt2)+(4/3)(1-2^(-n-1)). Ex.34 : récurrence à deux rangs initialisée aux rangs0 et1.",
      "Ex.39.3.b : facteur parasite1/2 imprimé retiré : U_n+6=(U0+6)(1/2)^n. Ex.40 : V=-2^n ln2, T=(2/3)^n2^(1-2^n). Ex.41 : U_next=exp(-S_n) implique S_n=-ln U_next→+infini ; termes tendant vers0 insuffisants sans cette identité.",
      "Ex.43 : premier terme 1*2 (et non 1*2*3), cohérent avec somme k(k+1) et n(n+1)(n+2)/3. Ex.48 : différence de raison5/12 et limite38/7, pas moyenne simple5. Ex.49 : invariant [2;3[, formule v=-(1/3)^n et limite3.",
      "Ex.51 : phénotype noir distinct de génotype pur ; limite1 ne prouve pas élimination de l’allèle récessif. u0=0,5 fixé pour tout l’exercice afin de préciser le premier terme inverse -2. Ex.52 : f définie pour x>=-6 et non R entier ; contraction1/3 démontrée sur[0;3].",
      "Ex.53 : neuf années de rang0 à8, première augmentation en deuxième année. Total4%=7937096,4829 contre7830000 F CFA. Ex.54 : total cumulé(n+1)(60n+1), seuil strict10000 franchi au jour13 (9373 au12,10934 au13). Ex.55 : huit coefficients sur durées3/2/1/1/1, inflation74,1446176%, pas addition des taux.",
      "Les figures de réponse apparaissent uniquement dans les corrections : axes, points discrets, itérations en escalier, deux suites adjacentes, salaires et cumul. Fonctions fixes auditées, pas de code utilisateur évalué. Les notices de source restent internes.",
    ],
  },
  sections: [
    ...groups.map(([id, title, start, end, courseTopicId]) => ({ id: "tc-l6-" + id, title, category: "fixation" as const, courseTopicId, exercises: fixation.filter(item => item.sourceNumber! >= start && item.sourceNumber! <= end) })),
    { id: "tc-l6-deepening", title: "Exercices d’approfondissement", category: "deepening", courseTopicId: "seq-recursion-summary", exercises: [...sequencesDeepeningA, ...sequencesDeepeningB, ...sequencesDeepeningC] },
    { id: "tc-l6-complex", title: "Situations complexes", category: "complex", courseTopicId: "seq-usual-summary", exercises: sequencesComplex },
  ],
};
