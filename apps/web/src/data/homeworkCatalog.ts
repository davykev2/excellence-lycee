import type {
  HomeworkChoice,
  HomeworkDefinition,
  HomeworkExercise,
  HomeworkQuestion,
  HomeworkRubricCriterion,
} from "../domain/homework";

export const LSY_MATH_TC_2025_HOMEWORK_SLUG =
  "lycee-scientifique-yamoussoukro-mathematiques-tc-2025-2026-devoir-1";

function choices(values: string[]): HomeworkChoice[] {
  return values.map((contentMarkdown, index) => {
    const label = String.fromCharCode(65 + index);
    return { id: label, label, contentMarkdown };
  });
}

function criterion(id: string, label: string, pointsMax: number): HomeworkRubricCriterion {
  return { id, label, pointsMax };
}

function question(input: Omit<HomeworkQuestion, "order"> & { order: number }): HomeworkQuestion {
  return input;
}

function exercise(
  order: number,
  points: number,
  questions: HomeworkQuestion[],
  instructionsMarkdown?: string,
): HomeworkExercise {
  return {
    id: `exercise-${order}`,
    title: `Exercice ${order}`,
    order,
    points,
    instructionsMarkdown,
    questions,
  };
}

/**
 * Public statement used only for the local preview and as the canonical UI fixture.
 * The answer key, detailed corrections and grading rules intentionally live on the server.
 */
export const lsyMathTc2025Homework: HomeworkDefinition = {
  id: "homework-lsy-tc-math-2025-2026-1",
  stableId: "homework-lsy-tc-math-2025-2026-1",
  slug: LSY_MATH_TC_2025_HOMEWORK_SLUG,
  title: "Devoir de Mathématiques",
  number: 1,
  institution: "Lycée Scientifique de Yamoussoukro",
  academicYear: "2025-2026",
  subject: { id: "mathematics", name: "Mathématiques", icon: "∑" },
  level: { id: "terminale-c", name: "Terminale" },
  series: { id: "terminale-c", name: "C" },
  durationSeconds: 3 * 60 * 60,
  gradingMode: "hybrid",
  subjectPublished: true,
  correctionsPublished: false,
  questionCount: 23,
  totalPoints: 20,
  pointsScale: 1,
  scoreMax: 20,
  attemptsUsed: 0,
  maxAttempts: 3,
  status: "available",
  sourceNotice:
    "Sujet retranscrit fidèlement depuis les pages 3 et 4 du Recueil AS49. Le document n’imprime aucun barème : la répartition 2 / 2 / 6 / 6 / 4 sur 20 est un barème pédagogique proposé par Excellence.",
  instructionsMarkdown:
    "Réponds directement dans la copie numérique. Pour une démonstration, indique d’abord ton résultat final, puis rédige les étapes qui le justifient. Les résultats courts sont vérifiés automatiquement ; le raisonnement est relu avec le barème affiché.",
  sections: [{
    id: "mathematics",
    title: "Mathématiques",
    order: 1,
    exercises: [
      exercise(1, 2, [
        question({
          id: "ex1-q1",
          order: 1,
          label: "1",
          promptMarkdown:
            "Soit $A$ et $B$ deux points distincts du plan. L’ensemble des points $M$ du plan tels que $\\operatorname{Mes}(\\overrightarrow{MA},\\overrightarrow{MB})=\\dfrac{\\pi}{2}+k\\pi$ $(k\\in\\mathbb Z)$ est le cercle de diamètre $[AB]$ privé de $A$ et $B$.",
          type: "qcm",
          answerKind: "true-false",
          gradingMode: "auto",
          choices: choices(["Vrai", "Faux"]),
          points: 0.5,
          autoPoints: 0.5,
        }),
        question({
          id: "ex1-q2",
          order: 2,
          label: "2",
          promptMarkdown:
            "$f$ est une fonction continue et strictement monotone sur un intervalle $[a;b]$. On suppose que $f(a)\\times f(b)<0$. Alors, pour tout réel $k$, l’équation $f(x)=k$ admet une unique solution dans $[a;b]$.",
          type: "qcm",
          answerKind: "true-false",
          gradingMode: "auto",
          choices: choices(["Vrai", "Faux"]),
          points: 0.5,
          autoPoints: 0.5,
        }),
        question({
          id: "ex1-q3",
          order: 3,
          label: "3",
          promptMarkdown:
            "Soit $E$ et $F$ deux points distincts du plan. La ligne de niveau $\\dfrac{\\sqrt2}{2}$ de l’application $M\\mapsto\\dfrac{ME}{MF}$ est le cercle de diamètre $[IJ]$, où $I=\\operatorname{bar}\\{(E,2);(F,\\sqrt2)\\}$ et $J=\\operatorname{bar}\\{(E,2);(F,-\\sqrt2)\\}$.",
          type: "qcm",
          answerKind: "true-false",
          gradingMode: "auto",
          choices: choices(["Vrai", "Faux"]),
          points: 0.5,
          autoPoints: 0.5,
        }),
        question({
          id: "ex1-q4",
          order: 4,
          label: "4",
          promptMarkdown: "Toute fonction strictement croissante sur $\\mathbb R$ a pour limite $+\\infty$ en $+\\infty$.",
          type: "qcm",
          answerKind: "true-false",
          gradingMode: "auto",
          choices: choices(["Vrai", "Faux"]),
          points: 0.5,
          autoPoints: 0.5,
        }),
      ], "Écris le numéro de chaque affirmation suivi de **Vrai** si elle est vraie ou de **Faux** si elle est fausse."),

      exercise(2, 2, [
        question({
          id: "ex2-q1",
          order: 1,
          label: "1",
          promptMarkdown:
            "Soit $PQRS$ un rectangle tel que $PQ=2$ et $QR=1$. L’ensemble des points $M$ du plan tels que $MP^2-MQ^2+MR^2-MS^2=0$ est :",
          type: "qcm",
          answerKind: "single-choice",
          gradingMode: "auto",
          choices: choices(["un cercle", "l’ensemble vide", "une droite", "le plan $\\mathcal P$"]),
          points: 0.5,
          autoPoints: 0.5,
        }),
        question({
          id: "ex2-q2",
          order: 2,
          label: "2",
          promptMarkdown:
            "Soit $x$ un nombre réel positif ; $m$, $n$ et $p$ trois nombres entiers naturels supérieurs ou égaux à 2. $\\left(\\sqrt[mn]{x^{pm}}\\right)^n$ est égal à :",
          type: "qcm",
          answerKind: "single-choice",
          gradingMode: "auto",
          choices: choices(["$\\sqrt[mn]{x}$", "$\\sqrt[n]{x}$", "$\\sqrt[p]{x}$", "$x^p$"]),
          points: 0.5,
          autoPoints: 0.5,
        }),
        question({
          id: "ex2-q3",
          order: 3,
          label: "3",
          promptMarkdown: "$\\displaystyle\\lim_{x\\to0}\\dfrac{1-\\cos(3x)}{x^2}$ est égal à :",
          type: "qcm",
          answerKind: "single-choice",
          gradingMode: "auto",
          choices: choices(["$0$", "$1$", "$\\dfrac32$", "$+\\infty$"]),
          points: 1,
          autoPoints: 1,
          isNeutralized: true,
          sourceNotice: "Question neutralisée : aucune proposition du sujet ne correspond à la valeur exacte.",
        }),
      ], "Pour chaque énoncé, une seule information parmi A, B, C et D est annoncée vraie dans le document source."),

      exercise(3, 6, [
        question({
          id: "ex3-a1a",
          order: 1,
          label: "Partie A · 1.a",
          promptMarkdown: "Soit $g(x)=2x-\\sqrt{x^2+4}$. Justifie que l’ensemble de définition de $g$ est $\\mathbb R$.",
          type: "texte",
          answerKind: "formula",
          gradingMode: "hybrid",
          points: 0.5,
          autoPoints: 0.25,
          manualPoints: 0.25,
          rubricCriteria: [criterion("domain-proof", "Vérifier que $x^2+4>0$ pour tout réel $x$.", 0.25)],
        }),
        question({
          id: "ex3-a1b",
          order: 2,
          label: "Partie A · 1.b",
          promptMarkdown: "Calcule les limites de $g$ en $-\\infty$ et en $+\\infty$.",
          type: "texte",
          answerKind: "formula",
          gradingMode: "hybrid",
          points: 0.75,
          autoPoints: 0.25,
          manualPoints: 0.5,
          rubricCriteria: [
            criterion("minus-infinity", "Justifier le comportement en $-\\infty$ sans réattribuer les points du résultat final.", 0.25),
            criterion("plus-infinity", "Justifier la rationalisation en $+\\infty$ sans réattribuer les points du résultat final.", 0.25),
          ],
        }),
        question({
          id: "ex3-a2a",
          order: 3,
          label: "Partie A · 2.a",
          promptMarkdown: "Justifie que la droite $(D)$ d’équation $y=x$ est une asymptote à $\\mathcal C_g$ au voisinage de $+\\infty$.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "manual",
          points: 0.75,
          manualPoints: 0.75,
          sourceNotice: "Le document imprime $\\mathcal C_f$ ; Excellence rétablit $\\mathcal C_g$, puisque cette partie étudie la fonction $g$.",
          rubricCriteria: [
            criterion("difference", "Étudier explicitement $g(x)-x$.", 0.35),
            criterion("limit", "Conclure avec la limite nulle en $+\\infty$.", 0.4),
          ],
        }),
        question({
          id: "ex3-a2b",
          order: 4,
          label: "Partie A · 2.b",
          promptMarkdown: "Justifie que la courbe $\\mathcal C_g$ est au-dessous de la droite $(D)$.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "manual",
          points: 0.5,
          manualPoints: 0.5,
          sourceNotice: "Le document imprime $\\mathcal C_f$ ; Excellence rétablit $\\mathcal C_g$, puisque cette partie étudie la fonction $g$.",
          rubricCriteria: [criterion("sign", "Établir le signe de $g(x)-x$ sur $\\mathbb R$.", 0.5)],
        }),
        question({
          id: "ex3-a3a",
          order: 5,
          label: "Partie A · 3.a",
          promptMarkdown: "Démontre que l’équation $g(x)=0$ admet une unique solution $\\alpha$ telle que $1<\\alpha<2$.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "manual",
          points: 0.75,
          manualPoints: 0.75,
          rubricCriteria: [
            criterion("existence", "Justifier l’existence dans $]1;2[$.", 0.35),
            criterion("uniqueness", "Utiliser la stricte croissance pour l’unicité.", 0.4),
          ],
        }),
        question({
          id: "ex3-a3b",
          order: 6,
          label: "Partie A · 3.b",
          promptMarkdown: "Détermine un encadrement de $\\alpha$ d’amplitude $10^{-1}$ par la méthode de balayage.",
          type: "texte",
          answerKind: "formula",
          gradingMode: "hybrid",
          points: 0.5,
          autoPoints: 0.25,
          manualPoints: 0.25,
          rubricCriteria: [criterion("sweep", "Présenter les deux valeurs testées et le changement de signe.", 0.25)],
        }),
        question({
          id: "ex3-b1",
          order: 7,
          label: "Partie B · 1",
          promptMarkdown: "On considère $f(x)=\\sqrt{x^2+4}-\\dfrac12x$. On admet que $f$ est strictement décroissante sur $]-\\infty;\\alpha[$. Démontre que $f(\\alpha)=\\dfrac32\\alpha$.",
          type: "texte",
          answerKind: "formula",
          gradingMode: "hybrid",
          points: 0.5,
          autoPoints: 0.25,
          manualPoints: 0.25,
          rubricCriteria: [criterion("reuse-root", "Réutiliser correctement la relation $g(\\alpha)=0$.", 0.25)],
        }),
        question({
          id: "ex3-b2a",
          order: 8,
          label: "Partie B · 2.a",
          promptMarkdown: "Soit $h$ la restriction de $f$ à $]-\\infty;\\alpha[$. Démontre que $h$ réalise une bijection de $]-\\infty;\\alpha[$ sur un intervalle $J$ à préciser.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "manual",
          points: 1,
          manualPoints: 1,
          rubricCriteria: [
            criterion("continuity-monotony", "Mobiliser continuité et stricte monotonie sur le bon intervalle.", 0.4),
            criterion("endpoint-limits", "Calculer les images aux bornes.", 0.3),
            criterion("range", "Identifier exactement $J$ et conclure à la bijection.", 0.3),
          ],
        }),
        question({
          id: "ex3-b2b",
          order: 9,
          label: "Partie B · 2.b",
          promptMarkdown: "Donne le tableau de variation de la bijection réciproque $h^{-1}$ de $h$.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "manual",
          points: 0.75,
          manualPoints: 0.75,
          rubricCriteria: [
            criterion("inverse-domain", "Placer le domaine $J$ et ses bornes.", 0.25),
            criterion("inverse-variation", "Donner le bon sens de variation et les limites de $h^{-1}$.", 0.5),
          ],
        }),
      ], "On admet que $g$ est strictement croissante sur $\\mathbb R$."),

      exercise(4, 6, [
        question({
          id: "ex4-q1a",
          order: 1,
          label: "1.a",
          promptMarkdown:
            "$ABCD$ est un rectangle de centre $O$, dont les diagonales ont pour longueur $l$. $m$ est un réel non nul et $G_m$, s’il existe, le barycentre de $(A,1)$, $(B,-m)$ et $(C,1)$. Détermine l’ensemble des réels $m$ pour lesquels $G_m$ existe.",
          type: "texte",
          answerKind: "formula",
          gradingMode: "hybrid",
          points: 0.5,
          autoPoints: 0.25,
          manualPoints: 0.25,
          sourceNotice: "La condition d’existence du barycentre est $m\\neq2$ ; dans le domaine fixé par le préambule, on retient $m\\in\\mathbb R\\setminus\\{0,2\\}$.",
          rubricCriteria: [criterion("mass-sum", "Étudier la somme des coefficients du barycentre.", 0.25)],
        }),
        question({
          id: "ex4-q1b",
          order: 2,
          label: "1.b",
          promptMarkdown: "Précise la position du point $G_{-1}$ puis place-le sur une figure.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "manual",
          points: 0.75,
          manualPoints: 0.75,
          rubricCriteria: [
            criterion("position", "Déterminer exactement la position de $G_{-1}$.", 0.45),
            criterion("construction", "Décrire une construction ou un placement cohérent.", 0.3),
          ],
        }),
        question({
          id: "ex4-q2",
          order: 3,
          label: "2",
          promptMarkdown: "Détermine l’ensemble $(E)$ des points $G_m$ lorsque $m$ décrit $\\mathbb R^*$ et que $G_m$ existe.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "manual",
          points: 1,
          manualPoints: 1,
          rubricCriteria: [
            criterion("vector-expression", "Exprimer $G_m$ dans un repère adapté.", 0.5),
            criterion("locus", "Identifier le lieu et les éventuels points exclus.", 0.5),
          ],
        }),
        question({
          id: "ex4-q3a",
          order: 4,
          label: "3.a",
          promptMarkdown:
            "Pour $m=1$, détermine puis construis l’ensemble $(E_1)$ des points $M$ tels que $MA^2-MB^2+MC^2=\\dfrac{l^2}{4}$.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "manual",
          points: 1.25,
          manualPoints: 1.25,
          sourceNotice: "Dans la copie numérique, décris les étapes exactes de construction si tu ne peux pas joindre de figure.",
          rubricCriteria: [
            criterion("identity-e1", "Réduire correctement la somme de carrés.", 0.65),
            criterion("construction-e1", "Identifier le lieu et décrire une construction exacte.", 0.6),
          ],
        }),
        question({
          id: "ex4-q3b",
          order: 5,
          label: "3.b",
          promptMarkdown:
            "Pour $m=2$, détermine puis construis l’ensemble $(E_2)$ des points $M$ tels que $MA^2-2MB^2+MC^2=l^2$.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "manual",
          points: 1.25,
          manualPoints: 1.25,
          sourceNotice: "Dans la copie numérique, décris les étapes exactes de construction si tu ne peux pas joindre de figure.",
          rubricCriteria: [
            criterion("identity-e2", "Transformer l’égalité sans utiliser un barycentre inexistant.", 0.65),
            criterion("construction-e2", "Identifier le lieu et décrire une construction exacte.", 0.6),
          ],
        }),
        question({
          id: "ex4-q3c",
          order: 6,
          label: "3.c",
          promptMarkdown:
            "Détermine puis construis l’ensemble $(\\Gamma)$ des points $M$ du plan tels que $\\operatorname{Mes}(\\overrightarrow{MA},\\overrightarrow{MD})=-\\dfrac{2\\pi}{3}$.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "manual",
          points: 1.25,
          manualPoints: 1.25,
          sourceNotice: "Dans la copie numérique, décris les étapes exactes de construction si tu ne peux pas joindre de figure.",
          rubricCriteria: [
            criterion("angle-locus", "Identifier le bon arc capable avec son orientation.", 0.65),
            criterion("construction-gamma", "Décrire une construction géométrique complète et exacte.", 0.6),
          ],
        }),
      ], "On note $(E_m)$ l’ensemble des points $M$ du plan tels que $MA^2-mMB^2+MC^2=\\dfrac{(ml)^2}{4}$."),

      exercise(5, 4, [
        question({
          id: "ex5-q1",
          order: 1,
          label: "Situation complexe",
          promptMarkdown:
            "En vue de préparer le prochain devoir de niveau, deux élèves du Lycée Scientifique de Yamoussoukro font des recherches à la bibliothèque du lycée. Ils découvrent dans un livre de mathématiques que l’équation $\\left|x\\sqrt{1-x}\\right|=\\dfrac{\\sqrt5}{3\\sqrt3}$ admet une unique solution $\\alpha$. Ils veulent vérifier cette information mais éprouvent des difficultés. Propose-leur une solution argumentée basée sur tes connaissances mathématiques au programme.",
          type: "texte",
          answerKind: "essay",
          gradingMode: "hybrid",
          points: 4,
          autoPoints: 0.5,
          manualPoints: 3.5,
          rubricCriteria: [
            criterion("domain", "Déterminer le domaine et transformer l’équation sans perdre de conditions.", 0.75),
            criterion("positive-part", "Étudier correctement la partie $[0;1]$.", 0.75),
            criterion("negative-part", "Établir existence et unicité sur $]-\\infty;0[$.", 1.25),
            criterion("conclusion", "Conclure clairement sur l’unicité à partir des deux études, sans réattribuer les points de la valeur finale.", 0.75),
          ],
        }),
      ]),
    ],
  }],
};

export const homeworkPreviewCatalog = [lsyMathTc2025Homework] as const;

export function previewHomeworkByReference(reference: string) {
  return homeworkPreviewCatalog.find((homework) => homework.id === reference || homework.slug === reference);
}
