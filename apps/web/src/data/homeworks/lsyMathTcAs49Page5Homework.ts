import type {
  HomeworkDefinition,
  HomeworkExercise,
  HomeworkQuestion,
  HomeworkRubricCriterion,
} from "../../domain/homework";

export const LSY_MATH_TC_AS49_PAGE_5_HOMEWORK_SLUG =
  "lycee-scientifique-yamoussoukro-mathematiques-tc-as49-page-5";

function criterion(id: string, label: string, pointsMax: number): HomeworkRubricCriterion {
  return { id, label, pointsMax };
}

function manualQuestion(input: {
  id: string;
  order: number;
  label: string;
  promptMarkdown: string;
  points: number;
  rubricCriteria: HomeworkRubricCriterion[];
}): HomeworkQuestion {
  return {
    ...input,
    type: "texte",
    answerKind: "essay",
    gradingMode: "manual",
    manualPoints: input.points,
  };
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
    questions,
    instructionsMarkdown,
  };
}

const originalStatement = String.raw`
**Lycée Scientifique Yamoussoukro**
**Durée : 2h**

# DEVOIR DE MATHÉMATIQUES

**Terminale C**
Cette épreuve comporte une page numérotée 1/1

## EXERCICE 1

On pose :

$$a=\sqrt2\left(\cos\frac{\pi}{6}+i\sin\frac{\pi}{6}\right),\quad b=\sqrt2\left(\cos\frac{\pi}{4}+i\sin\frac{\pi}{4}\right),\quad c=\sqrt2\left(\cos\frac{\pi}{3}+i\sin\frac{\pi}{3}\right).$$

**1)** Exprime $a^6$, $b^6$ et $c^6$ sous forme algébrique.

**2)** En déduire une solution de l’équation $(E): z\in\mathbb C,\ z^6=-8i$.

**3)** Soit

$$j=-\frac12+i\frac{\sqrt3}{2}.$$

a) Vérifie que $j^3=1$.

b) Démontre que $jb$ et $j^2b$ sont aussi des solutions de $(E)$.

c) En déduire toutes les solutions de $(E)$. Les écrire sous forme algébrique.

**4)** Résous dans $\mathbb Z$ le système :

$$\begin{cases}x\equiv0\ [6]\\x\equiv3\ [4]\end{cases}$$

~~5) Détermine tous les entiers naturels $n$ vérifiant à la fois les deux propositions suivantes :~~

- ~~$a^n$ est un nombre réel~~
- ~~$b^n$ est un imaginaire pur.~~

## EXERCICE 2

Soit $n$ un entier naturel supérieur ou égal à 2. On pose :

$$A=n^2-2n+2;\qquad B=n^2+2n+2\qquad\text{et}\qquad d=PGCD(A;B).$$

**1)** a) Démontre que tout diviseur commun à $A$ et $n$ divise 2.

b) Démontre que tout diviseur commun à $A$ et $B$ divise $4n$.

**2)** On suppose que $n$ est impair.

a) Démontre que $A$ et $B$ sont impairs.

b) En déduire que $d$ est impair.

c) Démontre que $d$ divise $n$.

d) En déduire que $d$ divise 2, puis que $A$ et $B$ sont premiers entre eux.

**3)** On suppose que $n$ est pair.

a) Démontre que 4 ne divise pas $A$.

b) Démontre que $d$ est égal à $2p$ où $p$ est un nombre entier impair.

c) Démontre que $p$ divise $n$. En déduire que $d$ est égal à 2.

**4)** Déduire de ce qui précède que 197 et 257 sont premiers entre eux.
`;

/**
 * Retranscription publique du second sujet complet du Recueil AS49.
 * Le corrigé et les critères détaillés restent dans le paquet privé importé côté API.
 */
export const lsyMathTcAs49Page5Homework: HomeworkDefinition = {
  id: "homework-lsy-tc-math-as49-page-5",
  stableId: "homework-lsy-tc-math-as49-page-5",
  slug: LSY_MATH_TC_AS49_PAGE_5_HOMEWORK_SLUG,
  title: "Devoir de Mathématiques",
  number: 2,
  institution: "Lycée Scientifique de Yamoussoukro",
  academicYear: "2025-2026",
  subject: { id: "mathematics", name: "Mathématiques", icon: "∑" },
  level: { id: "terminale-c", name: "Terminale" },
  series: { id: "c", name: "C" },
  durationSeconds: 2 * 60 * 60,
  gradingMode: "manual",
  subjectPublished: true,
  correctionsPublished: false,
  correctionAfterSubmission: true,
  questionCount: 16,
  totalPoints: 20,
  pointsScale: 1,
  scoreMax: 20,
  attemptsUsed: 0,
  maxAttempts: 1,
  status: "available",
  statementMarkdown: originalStatement,
  sourceNotice:
    "Retranscription fidèle de la page 5 du Recueil AS49. Le scan n’imprime ni année scolaire, ni numéro de devoir, ni barème : « devoir 2 », « 2025-2026 » et la répartition sur 20 sont des repères éditoriaux Excellence, placés hors du sujet original. La question 5 de l’exercice 1 est barrée dans la source ; elle reste visible mais n’est ni répondue ni notée.",
  instructionsMarkdown:
    "Lis d’abord le sujet original sans annotations. Rédige ensuite tes réponses dans la copie numérique. Une seule remise est autorisée : après **J’ai fini**, la copie devient définitive et le bouton **Voir la correction** donne accès au corrigé détaillé.",
  sections: [{
    id: "mathematics",
    title: "Mathématiques",
    order: 1,
    exercises: [
      exercise(1, 10, [
        manualQuestion({
          id: "ex1-q1",
          order: 1,
          label: "1",
          promptMarkdown: "Exprime $a^6$, $b^6$ et $c^6$ sous forme algébrique.",
          points: 1.5,
          rubricCriteria: [
            criterion("moivre", "Appliquer correctement la formule de Moivre aux trois nombres.", 0.75),
            criterion("values", "Obtenir les trois formes algébriques exactes.", 0.75),
          ],
        }),
        manualQuestion({
          id: "ex1-q2",
          order: 2,
          label: "2",
          promptMarkdown: String.raw`En déduire une solution de l’équation $(E): z\in\mathbb C,\ z^6=-8i$.`,
          points: 0.5,
          rubricCriteria: [criterion("solution", "Identifier une solution et la relier au calcul précédent.", 0.5)],
        }),
        manualQuestion({
          id: "ex1-q3a",
          order: 3,
          label: "3.a",
          promptMarkdown: "Vérifie que $j^3=1$.",
          points: 1,
          rubricCriteria: [criterion("cube-root", "Identifier l’argument de $j$ puis calculer son cube.", 1)],
        }),
        manualQuestion({
          id: "ex1-q3b",
          order: 4,
          label: "3.b",
          promptMarkdown: "Démontre que $jb$ et $j^2b$ sont aussi des solutions de $(E)$.",
          points: 1.5,
          rubricCriteria: [
            criterion("jb", "Vérifier $(jb)^6=-8i$.", 0.75),
            criterion("j2b", "Vérifier $(j^2b)^6=-8i$.", 0.75),
          ],
        }),
        manualQuestion({
          id: "ex1-q3c",
          order: 5,
          label: "3.c",
          promptMarkdown: "En déduire toutes les solutions de $(E)$. Les écrire sous forme algébrique.",
          points: 3.5,
          rubricCriteria: [
            criterion("six-roots", "Justifier que les trois racines et leurs opposées donnent les six solutions.", 1),
            criterion("algebraic-forms", "Calculer sans erreur les six formes algébriques.", 2),
            criterion("completeness", "Conclure que la liste est complète.", 0.5),
          ],
        }),
        manualQuestion({
          id: "ex1-q4",
          order: 6,
          label: "4",
          promptMarkdown: String.raw`Résous dans $\mathbb Z$ le système $x\equiv0\ [6]$ et $x\equiv3\ [4]$.`,
          points: 2,
          rubricCriteria: [
            criterion("compatibility", "Étudier correctement la compatibilité des deux congruences.", 1.25),
            criterion("conclusion", "Conclure clairement sur l’ensemble des solutions.", 0.75),
          ],
        }),
      ], "La question 5 barrée dans le sujet original est annulée : aucune réponse et aucun point ne sont demandés."),

      exercise(2, 10, [
        manualQuestion({
          id: "ex2-q1a",
          order: 1,
          label: "1.a",
          promptMarkdown: "Démontre que tout diviseur commun à $A$ et $n$ divise 2.",
          points: 1,
          rubricCriteria: [criterion("linear-combination", "Construire la combinaison $A-n(n-2)=2$.", 1)],
        }),
        manualQuestion({
          id: "ex2-q1b",
          order: 2,
          label: "1.b",
          promptMarkdown: "Démontre que tout diviseur commun à $A$ et $B$ divise $4n$.",
          points: 1,
          rubricCriteria: [criterion("difference", "Utiliser exactement la différence $B-A=4n$.", 1)],
        }),
        manualQuestion({
          id: "ex2-q2a",
          order: 3,
          label: "2.a",
          promptMarkdown: "On suppose que $n$ est impair. Démontre que $A$ et $B$ sont impairs.",
          points: 0.75,
          rubricCriteria: [criterion("parity-ab", "Raisonner modulo 2 sur les deux expressions.", 0.75)],
        }),
        manualQuestion({
          id: "ex2-q2b",
          order: 4,
          label: "2.b",
          promptMarkdown: "En déduire que $d$ est impair.",
          points: 0.5,
          rubricCriteria: [criterion("parity-d", "Déduire la parité du PGCD de celle de $A$ et $B$.", 0.5)],
        }),
        manualQuestion({
          id: "ex2-q2c",
          order: 5,
          label: "2.c",
          promptMarkdown: "Démontre que $d$ divise $n$.",
          points: 1.25,
          rubricCriteria: [criterion("gauss-odd", "Combiner $d\mid4n$ et $\gcd(d,4)=1$.", 1.25)],
        }),
        manualQuestion({
          id: "ex2-q2d",
          order: 6,
          label: "2.d",
          promptMarkdown: "En déduire que $d$ divise 2, puis que $A$ et $B$ sont premiers entre eux.",
          points: 1.5,
          rubricCriteria: [
            criterion("divides-two", "Réutiliser la question 1.a pour obtenir $d\mid2$.", 0.75),
            criterion("coprime", "Conclure $d=1$ grâce à son imparité.", 0.75),
          ],
        }),
        manualQuestion({
          id: "ex2-q3a",
          order: 7,
          label: "3.a",
          promptMarkdown: "On suppose que $n$ est pair. Démontre que 4 ne divise pas $A$.",
          points: 1,
          rubricCriteria: [criterion("mod-four", "Écrire $n=2k$ et établir $A\equiv2\pmod4$.", 1)],
        }),
        manualQuestion({
          id: "ex2-q3b",
          order: 8,
          label: "3.b",
          promptMarkdown: "Démontre que $d$ est égal à $2p$ où $p$ est un nombre entier impair.",
          points: 1,
          rubricCriteria: [
            criterion("even-gcd", "Montrer que $A$ et $B$ sont pairs.", 0.4),
            criterion("odd-p", "Exclure $p$ pair grâce à $4\nmid A$.", 0.6),
          ],
        }),
        manualQuestion({
          id: "ex2-q3c",
          order: 9,
          label: "3.c",
          promptMarkdown: "Démontre que $p$ divise $n$. En déduire que $d$ est égal à 2.",
          points: 1.25,
          rubricCriteria: [
            criterion("p-divides-n", "Déduire $p\mid n$ de $2p\mid4n$ et de l’imparité de $p$.", 0.65),
            criterion("d-equals-two", "Appliquer la question 1.a pour conclure $p=1$, puis $d=2$.", 0.6),
          ],
        }),
        manualQuestion({
          id: "ex2-q4",
          order: 10,
          label: "4",
          promptMarkdown: "Déduire de ce qui précède que 197 et 257 sont premiers entre eux.",
          points: 0.75,
          rubricCriteria: [
            criterion("identify-n", "Identifier $n=15$ et vérifier les deux expressions.", 0.4),
            criterion("apply-odd-case", "Appliquer correctement le résultat du cas impair.", 0.35),
          ],
        }),
      ]),
    ],
  }],
};
