import type {
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 12 Suites numériques.pdf";

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel: string,
  points = 1,
): LessonQuestion => ({ type: "choice", prompt, options, correctIndex, explanation, sourceLabel, points });

const short = (
  prompt: string,
  acceptedAnswers: string[],
  explanation: string,
  sourceLabel: string,
  points = 1,
): LessonQuestion => ({
  type: "short-answer",
  prompt,
  options: [],
  correctIndex: 0,
  acceptedAnswers,
  explanation,
  sourceLabel,
  points,
});

const truth = (
  prompt: string,
  isTrue: boolean,
  explanation: string,
  sourceLabel: string,
  points = 1,
): LessonQuestion => choice(prompt, ["Vrai", "Faux"], isTrue ? 0 : 1, explanation, sourceLabel, points);

interface OfficialLevelSeed {
  id: string;
  title: string;
  summary: string;
  pages: string;
  section: string;
  durationMinutes: number;
  kind?: LessonKind;
  body: string;
  keyPoint: string;
  example: string;
  methodSteps: string[];
  timeline: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
  questions: LessonQuestion[];
  corrections?: string[];
  tip?: string;
}

function progressionWeight(index: number) {
  return 50 + Math.min(index, 7) * 5;
}

function officialLevel(index: number, seed: OfficialLevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: progressionWeight(index),
    kind: seed.kind ?? "concept",
    source: {
      documentTitle: sourceDocument,
      pages: seed.pages,
      section: seed.section,
      fidelity: seed.corrections?.length ? "faithful-corrected" : "faithful",
      corrections: seed.corrections ?? [],
    },
    concept: {
      eyebrow: `Niveau ${index + 1} • Cours officiel`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Reconstruis la stratégie",
      instruction: "Sélectionne chaque étape pour revoir la logique avant les exercices.",
      observation: "Pour une suite, une bonne preuve sépare toujours ce qui est vrai pour tout rang de ce qui ne l’est qu’à partir d’un certain rang.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Identifie d’abord la famille de la suite et l’objectif demandé, puis choisis le théorème qui répond exactement à cet objectif.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: seed.tip ?? "Astuce mémoire de Davy : écris l’objectif avant les calculs ; tu verras aussitôt s’il faut une différence, une borne ou une limite.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const questionsByLevel: Record<string, LessonQuestion[]> = {
  "sequence-induction": [
    choice(
      String.raw`$(u_n)$ est arithmétique de raison $-3$. Quelle relation est correcte ?`,
      [String.raw`$u_{n+1}=u_n-3$`, String.raw`$u_{n+1}=-3u_n$`, String.raw`$u_{n+1}=u_n+3$`, String.raw`$u_{n+1}=3-u_n$`],
      0,
      String.raw`Dans une suite arithmétique de raison $r$, $u_{n+1}=u_n+r$. Ici $r=-3$, donc $u_{n+1}=u_n-3$.`,
      "Exercice de fixation 1.1 • page 2",
    ),
    choice(
      String.raw`$(v_n)$ est géométrique de raison $-3$. Quelle relation est correcte ?`,
      [String.raw`$v_{n+1}=v_n-3$`, String.raw`$v_{n+1}=-3v_n$`, String.raw`$v_{n+1}=3v_n$`, String.raw`$v_{n+1}=v_n+3$`],
      1,
      String.raw`Dans une suite géométrique de raison $q$, $v_{n+1}=qv_n$. Ici $q=-3$.`,
      "Exercice de fixation 1.2 • page 2",
    ),
    choice(
      String.raw`Une suite arithmétique vérifie $u_3=-5$ et a pour raison $2$. Exprime $u_n$.`,
      [String.raw`$u_n=2n-11$`, String.raw`$u_n=2n-5$`, String.raw`$u_n=-5(n-3)$`, String.raw`$u_n=2n+11$`],
      0,
      String.raw`$u_n=u_3+(n-3)r=-5+2(n-3)=2n-11$.`,
      "Exercice de fixation 2.1 • page 2",
      2,
    ),
    choice(
      String.raw`Une suite géométrique vérifie $v_4=16$ et a pour raison $-\dfrac32$. Exprime $v_n$.`,
      [String.raw`$v_n=16\left(-\dfrac32\right)^{n-4}$`, String.raw`$v_n=16\left(-\dfrac32\right)^n$`, String.raw`$v_n=16-\dfrac32(n-4)$`, String.raw`$v_n=-24^{\,n-4}$`],
      0,
      String.raw`La formule entre deux rangs est $v_n=v_pq^{n-p}$. Avec $p=4$, on obtient $v_n=16(-3/2)^{n-4}$.`,
      "Exercice de fixation 2.2 • page 2",
      2,
    ),
    short(
      String.raw`Pour la suite arithmétique de raison $-3$ telle que $u_2=7$, calcule $u_0$.`,
      ["13"],
      String.raw`$u_0=u_2+(0-2)(-3)=7+6=13$.`,
      "Exercice de fixation 3.1 • pages 2-3",
    ),
    short(
      String.raw`Calcule $u_0+u_1+\cdots+u_{20}$ pour cette même suite.`,
      ["-357", "−357"],
      String.raw`$u_{20}=-47$ et il y a $21$ termes. Ainsi $S=21\dfrac{13-47}{2}=-357$.`,
      "Exercice de fixation 3.1 • pages 2-3",
      2,
    ),
    short(
      String.raw`La suite $(v_n)$ est géométrique de raison $-2$ et $v_4=16$. Calcule $v_2$.`,
      ["4"],
      String.raw`$v_2=v_4(-2)^{2-4}=16(-2)^{-2}=16/4=4$.`,
      "Exercice de fixation 3.2 • pages 2-3",
    ),
    short(
      String.raw`Calcule $v_2+v_3+\cdots+v_{21}$ pour cette même suite.`,
      ["-1398100", "-1 398 100", "−1398100", "−1 398 100"],
      String.raw`Il y a $20$ termes : $S=4\dfrac{1-(-2)^{20}}{1-(-2)}=\dfrac{4(1-2^{20})}{3}=-1\,398\,100$.`,
      "Exercice de fixation 3.2 • pages 2-3",
      2,
    ),
    choice(
      String.raw`On suppose $u_k<6$ et $u_{k+1}=\dfrac12u_k+3$. Quelle ligne établit l’hérédité ?`,
      [
        String.raw`$u_{k+1}<\dfrac12\times6+3=6$`,
        String.raw`$u_{k+1}>\dfrac12\times6+3=6$`,
        String.raw`$u_{k+1}=u_k+3<9$`,
        String.raw`$u_{k+1}<u_k<6$ sans autre justification`,
      ],
      0,
      String.raw`Multiplier $u_k<6$ par $1/2>0$ conserve le sens de l’inégalité, puis ajouter $3$ donne $u_{k+1}<6$. Avec l’initialisation $u_0=-1<6$, la récurrence est complète.`,
      "Exercice de fixation sur la récurrence • page 3",
      2,
    ),
  ],

  "sequence-monotonicity": [
    short(
      String.raw`Pour $w_n=n^2+3n$, calcule $w_{n+1}-w_n$.`,
      ["2n+4", "2n + 4", "4+2n", "4 + 2n"],
      String.raw`$w_{n+1}-w_n=(n+1)^2+3(n+1)-(n^2+3n)=2n+4$.`,
      "Exercice de fixation 1 • page 4",
      2,
    ),
    choice(
      String.raw`Quel est le sens de variation de $w_n=n^2+3n$ sur $\mathbb N$ ?`,
      ["Strictement croissante", "Strictement décroissante", "Constante", "Non monotone"],
      0,
      String.raw`Pour tout $n\in\mathbb N$, $w_{n+1}-w_n=2n+4>0$. La suite est donc strictement croissante.`,
      "Exercice de fixation 1 • page 4",
    ),
    choice(
      String.raw`Pour $v_n=e^{-2n+1}$, que vaut $\dfrac{v_{n+1}}{v_n}$ ?`,
      [String.raw`$e^{-2}$`, String.raw`$e^2$`, String.raw`$-2$`, String.raw`$1$`],
      0,
      String.raw`$v_{n+1}=e^{-2(n+1)+1}=e^{-2n-1}$, donc $v_{n+1}/v_n=e^{-2}$.`,
      "Exercice de fixation 2 • page 4",
      2,
    ),
    choice(
      String.raw`Quel est le sens de variation de $v_n=e^{-2n+1}$ ?`,
      ["Strictement croissante", "Strictement décroissante", "Constante", "Impossible à déterminer"],
      1,
      String.raw`Les termes sont positifs et $v_{n+1}/v_n=e^{-2}<1$ : la suite est strictement décroissante.`,
      "Exercice de fixation 2 • page 4",
    ),
    choice(
      String.raw`Pour $u_n=\sqrt{\ln n}$, $n\ge2$, quel signe a la dérivée de $f(x)=\sqrt{\ln x}$ sur $[2,+\infty[$ ?`,
      ["Strictement positif", "Strictement négatif", "Nul", "Alterné"],
      0,
      String.raw`$f'(x)=1/(2x\sqrt{\ln x})>0$ pour $x\ge2$.`,
      "Exercice 3 • page 11",
      2,
    ),
    choice(
      String.raw`Déduis le sens de variation de $u_n=\sqrt{\ln n}$ pour $n\ge2$.`,
      ["Croissante", "Décroissante", "Constante", "Non monotone"],
      0,
      String.raw`Comme $u_n=f(n)$ et que $f$ est croissante sur $[2,+\infty[$, la suite $(u_n)_{n\ge2}$ est croissante.`,
      "Exercice 3 • page 11",
    ),
  ],

  "sequence-limit-algebra": [
    truth(
      String.raw`Si $u_n<-3$ pour tout $n$, alors $(u_n)$ est minorée par $-3$.`,
      false,
      String.raw`$u_n<-3$ signifie que $-3$ est un majorant, pas un minorant.`,
      "Exercice de fixation sur les bornes 1 • page 5",
    ),
    truth(
      String.raw`S’il existe un seul rang $n$ tel que $u_n\ge0$, alors $(u_n)$ est minorée par $0$.`,
      false,
      String.raw`Une minoration doit être vraie pour tous les rangs de l’ensemble de définition, pas pour un seul terme.`,
      "Exercice de fixation sur les bornes 2 • page 5",
    ),
    truth(
      String.raw`Si $u_n\ge2$ pour tout $n$, alors $(u_n)$ est majorée par $2$.`,
      false,
      String.raw`L’inégalité prouve que $2$ est un minorant. Pour être majorant, il faudrait $u_n\le2$.`,
      "Exercice de fixation sur les bornes 3 • page 5",
    ),
    truth(
      String.raw`Si $|u_n|<1$ pour tout $n$, alors $(u_n)$ est bornée.`,
      true,
      String.raw`$|u_n|<1$ équivaut à $-1<u_n<1$ : la suite est minorée par $-1$ et majorée par $1$.`,
      "Exercice de fixation sur les bornes 4 • page 5",
    ),
    truth(
      String.raw`La suite $(\sqrt n)$ est convergente.`,
      false,
      String.raw`$\sqrt n\to+\infty$ : la suite est divergente.`,
      "Exercice de fixation sur la convergence 1 • page 5",
    ),
    truth(
      String.raw`La suite $\left(\dfrac1{n^3}\right)_{n\ge1}$ est convergente.`,
      true,
      String.raw`$1/n^3\to0$, qui est une limite finie.`,
      "Exercice de fixation sur la convergence 2 • page 5",
    ),
    truth(
      String.raw`La suite $(\cos n)$ est convergente.`,
      false,
      String.raw`Les valeurs de $\cos n$ oscillent et ne se rapprochent d’aucun réel unique.`,
      "Exercice de fixation sur la convergence 3 • page 5",
    ),
    short(
      String.raw`Calcule $\displaystyle\lim_{n\to+\infty}\dfrac{3n^2-2n+1}{n^3}$.`,
      ["0"],
      String.raw`En divisant par $n^3$, on obtient $3/n-2/n^2+1/n^3$, dont chaque terme tend vers $0$.`,
      "Exercice de fixation 2 • pages 5-6",
      2,
    ),
    short(
      String.raw`Calcule $\displaystyle\lim_{n\to+\infty}\dfrac{\ln(n+1)}n$.`,
      ["0"],
      String.raw`$\dfrac{\ln(n+1)}n=\dfrac{\ln(n+1)}{n+1}\times\dfrac{n+1}{n}$. Le premier facteur tend vers $0$ et le second vers $1$.`,
      "Exercice de fixation sur les limites 1 • page 6",
      2,
    ),
    short(
      String.raw`Calcule $\displaystyle\lim_{n\to+\infty}\left(\sqrt{n^2+1}-n\right)$.`,
      ["0"],
      String.raw`La quantité conjuguée donne $\sqrt{n^2+1}-n=1/(\sqrt{n^2+1}+n)$, qui tend vers $0$.`,
      "Exercice de fixation sur les limites 2 • page 6",
      2,
    ),
    choice(
      String.raw`Pour $u_n=\dfrac{n+3n^2}{1+n^2}$, quelle factorisation de $u_n-2$ est correcte ?`,
      [
        String.raw`$\dfrac{(n-1)(n+2)}{1+n^2}$`,
        String.raw`$\dfrac{(n+1)(n+2)}{1+n^2}$`,
        String.raw`$\dfrac{n(n+2)}{1+n^2}$`,
        String.raw`$\dfrac{(n-2)(n+1)}{1+n^2}$`,
      ],
      0,
      String.raw`$u_n-2=(n+3n^2-2-2n^2)/(1+n^2)=(n^2+n-2)/(1+n^2)=(n-1)(n+2)/(1+n^2)$.`,
      "Exercice 5 • page 11",
      2,
    ),
    truth(
      String.raw`La suite $u_n=\dfrac{n+3n^2}{1+n^2}$, définie pour $n\ge1$, est minorée par $2$.`,
      true,
      String.raw`Pour $n\ge1$, $(n-1)(n+2)\ge0$ et $1+n^2>0$, donc $u_n-2\ge0$.`,
      "Exercice 5 • page 11",
    ),
    choice(
      String.raw`Pour $v_n=\sqrt{4-\dfrac2{1+n^2}}$, quel encadrement est valable pour tout $n\in\mathbb N$ ?`,
      [String.raw`$\sqrt2\le v_n<2$`, String.raw`$0\le v_n\le\sqrt2$`, String.raw`$2<v_n\le4$`, String.raw`$-2\le v_n\le2$`],
      0,
      String.raw`Comme $0<2/(1+n^2)\le2$, on a $2\le4-2/(1+n^2)<4$, puis $\sqrt2\le v_n<2$.`,
      "Exercice 6 • page 12",
      2,
    ),
    choice(
      String.raw`Que prouve l’encadrement $\sqrt2\le v_n<2$ ?`,
      ["La suite est bornée", "La suite est seulement majorée", "La suite est seulement minorée", "La suite est constante"],
      0,
      String.raw`$\sqrt2$ est un minorant et $2$ un majorant : la suite est donc bornée.`,
      "Exercice 6 • page 12",
    ),
  ],

  "monotone-convergence": [
    truth(
      "Toute suite décroissante et à termes positifs est convergente.",
      true,
      "Les termes positifs donnent le minorant 0 ; une suite décroissante et minorée converge.",
      "Exercice de fixation sur la convergence monotone 1 • page 6",
    ),
    truth(
      "Toute suite croissante et non majorée est convergente.",
      false,
      String.raw`Une suite croissante et non majorée diverge vers $+\infty$.`,
      "Exercice de fixation sur la convergence monotone 2 • page 6",
    ),
    truth(
      "Toute suite croissante est nécessairement convergente.",
      false,
      "Il faut aussi qu’elle soit majorée pour garantir une limite finie.",
      "Exercice de fixation sur la convergence monotone 3 • page 6",
    ),
    truth(
      String.raw`Toute suite décroissante et non minorée diverge vers $-\infty$.`,
      true,
      "C’est la version divergente du théorème de convergence monotone.",
      "Exercice de fixation sur la convergence monotone 4 • page 6",
    ),
    short(
      String.raw`Pour $u_n=\displaystyle\sum_{k=1}^{n}\dfrac1{k^2}$, calcule $u_{n+1}-u_n$.`,
      ["1/(n+1)^2", "1/(n + 1)^2", "1÷(n+1)^2"],
      String.raw`Tous les termes communs se simplifient ; il reste le nouveau terme $1/(n+1)^2>0$.`,
      "Exercice 7.a • page 12",
      2,
    ),
    choice(
      String.raw`À l’aide de $\dfrac1{k^2}\le\dfrac1{k-1}-\dfrac1k$ pour $k\ge2$, quel majorant intermédiaire obtient-on ?`,
      [String.raw`$u_n\le2-\dfrac1n<2$`, String.raw`$u_n\le1/n$`, String.raw`$u_n\le n$ uniquement`, String.raw`$u_n\le1$`],
      0,
      String.raw`La somme télescopique vaut $1+(1-1/2)+(1/2-1/3)+\cdots+(1/(n-1)-1/n)=2-1/n<2$.`,
      "Exercice 7.b • pages 12-13",
      2,
    ),
    choice(
      String.raw`Pourquoi la suite $u_n=\sum_{k=1}^{n}1/k^2$ converge-t-elle ?`,
      ["Elle est croissante et majorée", "Elle est décroissante et majorée", "Elle est croissante et minorée seulement", "Elle est constante"],
      0,
      String.raw`$u_{n+1}-u_n>0$ prouve la croissance, et $u_n<2$ fournit un majorant. Le théorème de convergence monotone s’applique.`,
      "Exercice 7.c • page 13",
      2,
    ),
    choice(
      String.raw`Quelle est en réalité la limite de $1+\dfrac1{2^2}+\cdots+\dfrac1{n^2}$, d’après la remarque d’Euler ?`,
      [String.raw`$\dfrac{\pi^2}{6}$`, String.raw`$2$`, String.raw`$\pi$`, String.raw`$+\infty$`],
      0,
      String.raw`Euler a démontré que la somme infinie des inverses des carrés vaut $\pi^2/6$. Le majorant $2$ suffit pour prouver la convergence, mais ne donne pas cette valeur exacte.`,
      "Remarque d’Euler • page 7",
      2,
    ),
  ],

  "reference-sequences": [
    choice(String.raw`Calcule $\lim n^{-3}$.`, [String.raw`$0$`, String.raw`$1$`, String.raw`$+\infty$`, "La limite n’existe pas"], 0, String.raw`$n^{-3}=1/n^3\to0$.`, "QCM de fixation 1 • page 7"),
    choice(String.raw`Calcule $\lim n^{2/3}$.`, [String.raw`$0$`, String.raw`$1$`, String.raw`$+\infty$`, "La limite n’existe pas"], 2, String.raw`L’exposant $2/3$ est positif, donc $n^{2/3}\to+\infty$.`, "QCM de fixation 2 • page 7"),
    choice(String.raw`Calcule $\lim(-3)^n$.`, [String.raw`$0$`, String.raw`$1$`, String.raw`$+\infty$`, "La limite n’existe pas"], 3, String.raw`Le module croît et le signe alterne : aucune limite n’existe.`, "QCM de fixation 3 • page 7"),
    choice(String.raw`Calcule $\lim\left(-\dfrac2e\right)^n$.`, [String.raw`$0$`, String.raw`$1$`, String.raw`$+\infty$`, "La limite n’existe pas"], 0, String.raw`$|-2/e|<1$, donc la suite géométrique tend vers $0$.`, "QCM de fixation 4 • page 7"),
    choice(String.raw`Calcule $\lim n^{-5/6}$.`, [String.raw`$0$`, String.raw`$1$`, String.raw`$+\infty$`, "La limite n’existe pas"], 0, String.raw`L’exposant est négatif : $n^{-5/6}=1/n^{5/6}\to0$.`, "QCM de fixation 5 • page 7"),
    choice(String.raw`Calcule $\lim 7^n$.`, [String.raw`$0$`, String.raw`$1$`, String.raw`$+\infty$`, "La limite n’existe pas"], 2, String.raw`La base $7$ est strictement supérieure à $1$.`, "QCM de fixation 6 • page 7"),
    choice(String.raw`Si $q>1$ et $u_0>0$, quelle est la limite de la suite géométrique $u_n=u_0q^n$ ?`, [String.raw`$+\infty$`, String.raw`$0$`, String.raw`$-\infty$`, "Elle n’existe pas"], 0, String.raw`$q^n\to+\infty$ et le coefficient $u_0$ est positif.`, "Exercice 1 • page 10"),
    choice(String.raw`Si $-1<q<1$, quelle est la limite de $u_n=u_0q^n$ ?`, [String.raw`$+\infty$`, String.raw`$0$`, String.raw`$-\infty$`, "Elle n’existe pas"], 1, String.raw`Lorsque $|q|<1$, $q^n\to0$, donc $u_0q^n\to0$.`, "Exercice 1 • page 10"),
    choice(String.raw`Si $u_0<0$ et $q>1$, quelle est la limite de $u_n=u_0q^n$ ?`, [String.raw`$+\infty$`, String.raw`$0$`, String.raw`$-\infty$`, "Elle n’existe pas"], 2, String.raw`$q^n\to+\infty$ et la multiplication par $u_0<0$ donne $-\infty$.`, "Exercice 1 • page 10"),
    choice(String.raw`Si $q<-1$, que peut-on dire de la suite géométrique $u_n=u_0q^n$ lorsque $u_0\ne0$ ?`, ["Elle n’a pas de limite", String.raw`Elle tend vers $0$`, String.raw`Elle tend vers $+\infty$`, "Elle est constante"], 0, String.raw`Le module augmente tandis que le signe alterne : la suite n’a pas de limite.`, "Exercice 1 • page 10"),
    truth(String.raw`Si une suite arithmétique a un premier terme $v_0>0$, alors elle diverge nécessairement vers $+\infty$.`, false, String.raw`Le premier terme ne suffit pas : c’est le signe de la raison $r$ qui commande la limite.`, "Exercice 2.1 • page 11"),
    truth(String.raw`Si une suite arithmétique a une raison $r<0$, alors elle diverge vers $-\infty$.`, true, String.raw`$v_n=v_0+nr$ et $nr\to-\infty$ lorsque $r<0$.`, "Exercice 2.2 • page 11"),
    truth(String.raw`Si une suite arithmétique a une raison $r=0$, alors elle converge vers son premier terme $v_0$.`, true, String.raw`La suite est alors constante : $v_n=v_0$ pour tout $n$.`, "Exercice 2.3 • page 11"),
    choice(String.raw`La suite $((-1)^n)$ est-elle convergente ?`, ["Non, elle alterne entre 1 et -1", "Oui, vers 0", "Oui, vers 1", String.raw`Elle tend vers $+\infty$`], 0, String.raw`Les termes pairs valent $1$ et les termes impairs $-1$ : deux sous-suites ont des limites différentes.`, "Exercice 4 • page 11", 2),
  ],

  "sequence-growth": [
    choice(
      String.raw`Calcule $\displaystyle\lim_{n\to+\infty}\dfrac{\sqrt n}{\ln n}$.`,
      [String.raw`$+\infty$`, String.raw`$0$`, String.raw`$1$`, "La limite n’existe pas"],
      0,
      String.raw`$\ln n/n^{1/2}\to0$, donc son inverse $\sqrt n/\ln n$ tend vers $+\infty$.`,
      "Exercice de fixation sur les croissances 1 • page 8",
      2,
    ),
    choice(
      String.raw`Calcule $\displaystyle\lim_{n\to+\infty}(n^2-2^{n+3})$.`,
      [String.raw`$-\infty$`, String.raw`$0$`, String.raw`$+\infty$`, "La limite n’existe pas"],
      0,
      String.raw`$n^2-2^{n+3}=2^n(n^2/2^n-8)$. Le premier facteur tend vers $+\infty$ et le second vers $-8$, donc le produit tend vers $-\infty$.`,
      "Exercice de fixation sur les croissances 2 • page 8",
      2,
    ),
    short(
      String.raw`Calcule $\displaystyle\lim_{n\to+\infty}\dfrac{n3^n}{4^n}$.`,
      ["0"],
      String.raw`$n3^n/4^n=n/(4/3)^n$. Une exponentielle de base $4/3>1$ domine la puissance $n$.`,
      "Exercice de fixation sur les croissances 3 • page 8",
      2,
    ),
    choice(
      String.raw`Soient $u_n=\dfrac{n^2}{2^n}-8$ et $v_n=\dfrac{n^2}{2^n}$. Quel couple de limites est correct ?`,
      [String.raw`$(\lim u_n,\lim v_n)=(-8,0)$`, String.raw`$(0,-8)$`, String.raw`(-\infty,+\infty)$`, String.raw`(8,0)`],
      0,
      String.raw`$n^2/2^n\to0$, donc $u_n\to-8$ et $v_n\to0$. Comme $u_n\le v_n$, le passage à la limite donne bien $-8\le0$.`,
      "Exercice de fixation sur la comparaison 1 • pages 8-9",
      2,
    ),
    choice(
      String.raw`Calcule $\displaystyle\lim_{n\to+\infty}(-n+\cos n)$.`,
      [String.raw`$-\infty$`, String.raw`$0$`, String.raw`$+\infty$`, "La limite n’existe pas"],
      0,
      String.raw`$\cos n\le1$, donc $-n+\cos n\le-n+1$, et $-n+1\to-\infty$.`,
      "Exercice de fixation sur la comparaison 2.1 • page 9",
      2,
    ),
    choice(
      String.raw`Calcule $\displaystyle\lim_{n\to+\infty}(n^2+(-1)^n)$.`,
      [String.raw`$+\infty$`, String.raw`$0$`, String.raw`$-\infty$`, "La limite n’existe pas"],
      0,
      String.raw`$(-1)^n\ge-1$, donc $n^2+(-1)^n\ge n^2-1$, et $n^2-1\to+\infty$.`,
      "Exercice de fixation sur la comparaison 2.2 • page 9",
      2,
    ),
    choice(
      String.raw`Si $|u_n-\ell|\le v_n$ à partir d’un certain rang et $v_n\to0$, quel théorème conclut que $u_n\to\ell$ ?`,
      ["Le théorème des gendarmes", "Le théorème de Pythagore", "La relation de Chasles", "Le théorème de Gauss"],
      0,
      String.raw`L’inégalité équivaut à $\ell-v_n\le u_n\le\ell+v_n$ ; les deux bornes tendent vers $\ell$.`,
      "Conséquence des propriétés de comparaison • page 8",
    ),
  ],

  "small-angle-sequence": [
    short(
      String.raw`Pour $u_n=\dfrac1n$, calcule $\displaystyle\lim_{n\to+\infty}u_n$.`,
      ["0"],
      String.raw`La suite de référence $1/n$ tend vers $0$.`,
      "Exercice de fixation sur la composition • page 9",
    ),
    short(
      String.raw`Calcule $\displaystyle\lim_{x\to0}\dfrac{\sin x}{x}$.`,
      ["1"],
      String.raw`C’est la limite trigonométrique de référence du petit angle.`,
      "Exercice de fixation sur la composition • page 9",
    ),
    short(
      String.raw`Calcule $\displaystyle\lim_{n\to+\infty}n\sin\left(\dfrac1n\right)$.`,
      ["1"],
      String.raw`$n\sin(1/n)=\sin(1/n)/(1/n)$. Comme $1/n\to0$, le quotient tend vers $1$.`,
      "Exercice de fixation sur la composition • page 9",
      2,
    ),
    choice(
      String.raw`Dans $v_n=f(u_n)$, quelles informations permettent de conclure $v_n\to\ell$ ?`,
      [
        String.raw`$u_n\to a$ et $f(x)\to\ell$ lorsque $x\to a$`,
        String.raw`$u_n$ est seulement positive`,
        String.raw`$f$ est seulement croissante`,
        String.raw`$u_n$ et $f$ sont bornées`,
      ],
      0,
      String.raw`On compose la limite de la suite intérieure avec la limite de la fonction au point atteint, en vérifiant que les termes restent dans le domaine.`,
      "Propriété de composition • page 9",
    ),
  ],

  "recursive-sequence-limit": [
    choice(
      String.raw`On suppose $(u_n)$ décroissante et $0\le u_n\le1$. Pourquoi $(u_n)$ converge-t-elle ?`,
      ["Elle est décroissante et minorée par 0", "Elle est décroissante et majorée par 1", "Elle est positive uniquement", "Toute suite récurrente converge"],
      0,
      String.raw`Une suite décroissante et minorée est convergente. Le seul majorant $1$ ne suffirait pas.`,
      "Exercice de fixation sur les suites récurrentes • pages 9-10",
    ),
    choice(
      String.raw`Pour $f(x)=\dfrac12x\left(1+\dfrac x2\right)$, quelles sont les solutions de $f(x)=x$ ?`,
      [String.raw`$0$ et $2$`, String.raw`$0$ et $1$`, String.raw`$-2$ et $0$`, String.raw`$1$ et $2$`],
      0,
      String.raw`$f(x)=x\iff x^2-2x=0\iff x(x-2)=0$.`,
      "Exercice de fixation sur les suites récurrentes • pages 9-10",
      2,
    ),
    short(
      String.raw`La suite précédente reste dans $[0,1]$. Quelle est sa limite ?`,
      ["0"],
      String.raw`Parmi les points fixes $0$ et $2$, seul $0$ appartient à l’intervalle invariant $[0,1]$.`,
      "Exercice de fixation sur les suites récurrentes • page 10",
      2,
    ),
    choice(
      "Un véhicule perd 20 % de sa valeur chaque année. Quel coefficient multiplicateur faut-il appliquer ?",
      ["0,8", "1,2", "0,2", "1,03"],
      0,
      "Conserver 80 % d’une valeur revient à la multiplier par 0,8.",
      "Situation complexe • page 10",
    ),
    short(
      String.raw`Calcule $30\,000\,000\times(0{,}8)^5$, la valeur de revente après cinq ans.`,
      ["9830400", "9 830 400", "9.830.400"],
      String.raw`$0{,}8^5=0{,}32768$, donc la valeur est $9\,830\,400$ F CFA.`,
      "Situation complexe • page 10",
      2,
    ),
    choice(
      String.raw`Les véhicules neufs augmentent de $3\%$ par an. Quelle récurrence correcte modélise leur prix ?`,
      [String.raw`$v_{n+1}=1{,}03v_n$`, String.raw`$v_{n+1}=0{,}97v_n$`, String.raw`$v_{n+1}=v_n+0{,}03u_n$`, String.raw`$v_{n+1}=1{,}3v_n$`],
      0,
      String.raw`Une hausse de $3\%$ multiplie le prix courant $v_n$ par $1+0{,}03=1{,}03$.`,
      "Situation complexe • page 10",
      2,
    ),
    short(
      String.raw`Calcule $30\,000\,000\times(1{,}03)^5$ à l’unité près.`,
      ["34778222", "34 778 222", "34778222,37", "34778222.37"],
      String.raw`$30\,000\,000(1{,}03)^5\approx34\,778\,222$ F CFA.`,
      "Situation complexe • page 10",
      2,
    ),
    short(
      "Calcule à l’unité près la différence entre le prix neuf après cinq ans et la valeur de l’ancien véhicule.",
      ["24947822", "24 947 822"],
      String.raw`$34\,778\,222-9\,830\,400=24\,947\,822$ F CFA.`,
      "Situation complexe • page 10",
      2,
    ),
    choice(
      "L’employé pourra-t-il acheter l’ancien véhicule dans les conditions annoncées ?",
      ["Oui : les deux seuils sont respectés", "Non : la différence dépasse 25 millions", "Non : le prix de revente dépasse 10 millions", "Impossible à décider"],
      0,
      "La différence 24 947 822 F est inférieure à 25 millions et le prix 9 830 400 F est inférieur à 10 millions.",
      "Situation complexe • page 10",
      2,
    ),
    choice(
      String.raw`Dans l’exercice 8, que vaut $v_{n+1}-u_{n+1}$ en fonction de $v_n-u_n$ ?`,
      [String.raw`$(2a-1)(v_n-u_n)$`, String.raw`$(1-a)(v_n-u_n)$`, String.raw`$a(v_n-u_n)$`, String.raw`$(2a+1)(v_n-u_n)$`],
      0,
      String.raw`En soustrayant les deux relations de récurrence, les coefficients se regroupent en $2a-1$. Comme $a\in]1/2,1[$, ce facteur est positif.`,
      "Exercice 8.1 • pages 13-14",
      2,
    ),
    choice(
      String.raw`Sachant $v_n-u_n>0$, pourquoi $(u_n)$ est-elle croissante ?`,
      [String.raw`$u_{n+1}-u_n=(1-a)(v_n-u_n)>0$`, String.raw`$u_{n+1}-u_n=(2a-1)(v_n-u_n)<0$`, String.raw`$u_{n+1}=u_n$`, String.raw`$u_n>v_n$`],
      0,
      String.raw`$1-a>0$ et $v_n-u_n>0$, donc la différence $u_{n+1}-u_n$ est positive.`,
      "Exercice 8.2.a • page 13",
      2,
    ),
    choice(
      String.raw`Sachant $v_n-u_n>0$, pourquoi $(v_n)$ est-elle décroissante ?`,
      [String.raw`$v_{n+1}-v_n=-(1-a)(v_n-u_n)<0$`, String.raw`$v_{n+1}-v_n=(1-a)(v_n-u_n)>0$`, String.raw`$v_{n+1}=v_n$`, String.raw`$v_n<u_n$`],
      0,
      String.raw`Le signe moins rend la différence strictement négative puisque $1-a>0$ et $v_n-u_n>0$.`,
      "Exercice 8.2.b • page 13",
      2,
    ),
    choice(
      String.raw`Quelle chaîne d’inégalités prouve que les deux suites de l’exercice 8 convergent ?`,
      [String.raw`$u_0\le u_n<v_n\le v_0$`, String.raw`$v_0\le v_n<u_n\le u_0$`, String.raw`$u_n\le u_0<v_0\le v_n$`, String.raw`$u_n=v_n$`],
      0,
      String.raw`$(u_n)$ est croissante et majorée par $v_0$, tandis que $(v_n)$ est décroissante et minorée par $u_0$.`,
      "Exercice 8.2.c • pages 13-14",
      2,
    ),
    choice(
      String.raw`Pour $w_n=v_n-u_n$, quelle est la nature de $(w_n)$ ?`,
      [String.raw`Géométrique de raison $2a-1$ et de premier terme $1$`, String.raw`Arithmétique de raison $2a-1$`, String.raw`Géométrique de raison $1-a$ et de premier terme $5$`, "Constante"],
      0,
      String.raw`$w_{n+1}=(2a-1)w_n$ et $w_0=v_0-u_0=1$.`,
      "Exercice 8.3.a • page 14",
      2,
    ),
    short(
      String.raw`Puisque $0<2a-1<1$, calcule $\lim(v_n-u_n)$.`,
      ["0"],
      String.raw`La suite géométrique $w_n=(2a-1)^n$ a une raison de module strictement inférieur à $1$, donc elle tend vers $0$. Les limites de $u_n$ et $v_n$ sont ainsi égales.`,
      "Exercice 8.3.b • page 14",
      2,
    ),
    short(
      String.raw`Pour $t_n=u_n+v_n$, quelle est la valeur constante de $t_n$ ?`,
      ["5"],
      String.raw`$t_{n+1}=u_{n+1}+v_{n+1}=u_n+v_n=t_n$ et $t_0=2+3=5$.`,
      "Exercice 8.4.a • page 14",
      2,
    ),
    short(
      String.raw`Déduis la limite commune de $(u_n)$ et $(v_n)$.`,
      ["5/2", "2,5", "2.5", "2 1/2"],
      String.raw`Si les deux limites valent $\ell$, alors $u_n+v_n\to2\ell$. Or $t_n=5$, donc $2\ell=5$ et $\ell=5/2$.`,
      "Exercice 8.4.b • page 14",
      2,
    ),
  ],
};

const levels: OfficialLevelSeed[] = [
  {
    id: "sequence-induction",
    title: "Suites usuelles et raisonnement par récurrence",
    summary: "Réactiver les formules arithmétiques et géométriques, puis démontrer une propriété vraie à tous les rangs.",
    pages: "1-3",
    section: "1. Rappels sur les suites arithmétiques et géométriques ; 2. Raisonnement par récurrence",
    durationMinutes: 34,
    body: String.raw`## 1. Deux familles à reconnaître immédiatement

| | Suite arithmétique | Suite géométrique |
|---|---|---|
| Relation de récurrence | $u_{n+1}=u_n+r$ | $v_{n+1}=qv_n$ |
| Raison | différence constante $r$ | quotient constant $q$ |
| Entre les rangs $p$ et $n$ | $u_n=u_p+(n-p)r$ | $v_n=v_pq^{n-p}$ |
| Depuis le rang $0$ | $u_n=u_0+nr$ | $v_n=v_0q^n$ |

### Sommes de termes consécutifs

Pour une suite arithmétique :

$$
u_p+u_{p+1}+\cdots+u_n=(n-p+1)\frac{u_p+u_n}{2}.
$$

Pour une suite géométrique de raison $q\ne1$ :

$$
v_p+v_{p+1}+\cdots+v_n=v_p\frac{1-q^{n-p+1}}{1-q}.
$$

> **Astuce mémoire.** Une somme arithmétique est « nombre de termes × moyenne des extrêmes ». Une somme géométrique est « premier terme × $(1-q^{\text{nombre de termes}})/(1-q)$ ».

## 2. Démontrer par récurrence

Une proposition $P(n)$ dépendant d’un entier ne peut pas être déclarée vraie pour tous les rangs à partir de quelques exemples. La récurrence construit une chaîne sans rupture :

1. **Initialisation** : vérifier $P(n_0)$ au premier rang concerné.
2. **Hypothèse de récurrence** : fixer $k\ge n_0$ et supposer $P(k)$ vraie.
3. **Hérédité** : partir de cette hypothèse pour démontrer $P(k+1)$.
4. **Conclusion** : affirmer que $P(n)$ est vraie pour tout $n\ge n_0$.

### Exemple officiel entièrement rédigé

Soit $u_0=-1$ et $u_{n+1}=\dfrac12u_n+3$. Montrons que $u_n<6$ pour tout $n\in\mathbb N$.

- Au rang $0$, $u_0=-1<6$.
- Supposons $u_k<6$. Comme $1/2>0$ :

$$
\frac12u_k<3
\quad\Longrightarrow\quad
\frac12u_k+3<6.
$$

Or $u_{k+1}=\dfrac12u_k+3$, donc $u_{k+1}<6$.
- La propriété est vraie pour tout $n\in\mathbb N$.

> **Point de vigilance.** Écrire seulement « supposons la propriété vraie » ne suffit pas : il faut écrire précisément ce que l’hypothèse autorise à utiliser, puis faire apparaître le terme de rang $k+1$.`,
    keyPoint: String.raw`$u_n=u_p+(n-p)r$, $v_n=v_pq^{n-p}$ ; récurrence = initialisation + hérédité + conclusion.`,
    example: String.raw`Si $u_3=-5$ et $r=2$, alors $u_n=-5+2(n-3)=2n-11$.`,
    methodSteps: [
      "Repère si l’on ajoute une constante (arithmétique) ou si l’on multiplie par une constante (géométrique).",
      "Compte exactement les termes d’une somme : de p à n, il y en a n − p + 1.",
      "Pour une récurrence, nomme P(n), vérifie le premier rang et annonce clairement l’hypothèse au rang k.",
      "Dans l’hérédité, transforme l’hypothèse jusqu’à faire apparaître le terme de rang k + 1, puis conclus.",
    ],
    timeline: [
      { label: "Reconnaître", detail: "Différence constante : arithmétique. Quotient constant : géométrique." },
      { label: "Exprimer", detail: "Relie le rang demandé à un rang connu avec n − p." },
      { label: "Additionner", detail: "Compte les termes avant d’appliquer la formule de somme." },
      { label: "Initialiser", detail: "Vérifie la propriété au premier rang annoncé." },
      { label: "Transmettre", detail: "Suppose P(k), démontre P(k+1), puis conclus pour tous les rangs." },
    ],
    questions: questionsByLevel["sequence-induction"],
    corrections: [
      "Page 1 : dans le tableau des suites géométriques, la formule imprimée vₙ₊₁ = qⁿv₀ est corrigée en vₙ = qⁿv₀.",
      "Page 3 : la phrase répétée et désordonnée dans l’initialisation de la récurrence est réécrite sans modifier le raisonnement mathématique.",
    ],
    tip: "Astuce mémoire de Davy : arithmétique = addition ; géométrique = multiplication ; récurrence = premier domino puis passage d’un domino au suivant.",
  },
  {
    id: "sequence-monotonicity",
    title: "Étudier le sens de variation d’une suite",
    summary: "Choisir entre différence, quotient, fonction associée et récurrence pour prouver qu’une suite monte ou descend.",
    pages: "3-4 et 11",
    section: "3. Suites croissantes, suites décroissantes ; exercices 1, 2 et 3",
    durationMinutes: 25,
    body: String.raw`## Définitions

Sur son ensemble de définition, une suite $(u_n)$ est :

- **croissante** si $u_{n+1}\ge u_n$ ;
- **décroissante** si $u_{n+1}\le u_n$ ;
- **strictement croissante** si $u_{n+1}>u_n$ ;
- **strictement décroissante** si $u_{n+1}<u_n$ ;
- **constante** si $u_{n+1}=u_n$ ;
- **monotone** si elle est croissante ou décroissante.

## Quatre méthodes possibles

### 1. Étudier une différence

$$
u_{n+1}-u_n\ge0\Longrightarrow(u_n)\text{ croissante}.
$$

Pour $w_n=n^2+3n$ :

$$
w_{n+1}-w_n=2n+4>0,
$$

donc $(w_n)$ est strictement croissante.

### 2. Comparer un quotient à 1

Cette méthode exige $u_n>0$. Alors :

$$
\frac{u_{n+1}}{u_n}\ge1\Longrightarrow(u_n)\text{ croissante},
\qquad
\frac{u_{n+1}}{u_n}\le1\Longrightarrow(u_n)\text{ décroissante}.
$$

Pour $v_n=e^{-2n+1}>0$, $v_{n+1}/v_n=e^{-2}<1$ : la suite décroît.

### 3. Utiliser une fonction associée

Si $u_n=f(n)$ et si $f$ est monotone sur un intervalle contenant tous les rangs étudiés, $(u_n)$ hérite du même sens de variation.

Pour $u_n=\sqrt{\ln n}$, $n\ge2$ :

$$
f'(x)=\frac1{2x\sqrt{\ln x}}>0,
$$

donc la suite est croissante.

### 4. Utiliser une récurrence

Cette méthode est utile quand la suite est définie par $u_{n+1}=f(u_n)$ et que l’on sait transmettre une inégalité d’un rang au suivant.

> **Choix rapide.** Formule explicite polynomiale : différence ou fonction. Termes positifs avec produits/exponentielles : quotient. Récurrence imbriquée : souvent récurrence et étude de $f$.`,
    keyPoint: String.raw`Le signe de $u_{n+1}-u_n$ est la méthode universelle ; le quotient exige $u_n>0$.`,
    example: String.raw`Pour $v_n=e^{-2n+1}$, $v_{n+1}/v_n=e^{-2}<1$, donc $(v_n)$ est strictement décroissante.`,
    methodSteps: [
      "Écris l’ensemble des rangs concernés et vérifie les conditions de définition.",
      "Teste d’abord la différence uₙ₊₁ − uₙ ; factorise si nécessaire.",
      "Si tous les termes sont positifs, le quotient peut simplifier fortement le calcul.",
      "Si uₙ = f(n), étudie f sur un intervalle qui contient les rangs, puis rédige la conclusion sur la suite.",
    ],
    timeline: [
      { label: "Domaine", detail: "Commence au bon rang, surtout avec ln n ou une racine." },
      { label: "Différence", detail: "Un signe positif fait monter la suite, un signe négatif la fait descendre." },
      { label: "Quotient", detail: "Compare à 1 uniquement après avoir prouvé la positivité des termes." },
      { label: "Fonction", detail: "Dérive f lorsque uₙ = f(n)." },
      { label: "Conclusion", detail: "Précise croissante, décroissante, stricte ou simplement monotone." },
    ],
    questions: questionsByLevel["sequence-monotonicity"],
    tip: "Astuce mémoire de Davy : différence → comparer à 0 ; quotient → comparer à 1.",
  },
  {
    id: "sequence-limit-algebra",
    title: "Bornes, convergence et calcul algébrique des limites",
    summary: "Distinguer majorant et minorant, reconnaître une suite convergente et lever les formes indéterminées.",
    pages: "4-6 et 11-12",
    section: "4. Suites majorées, minorées, bornées ; 5.a-b. Convergence et limites de référence ; exercices 5 et 6",
    durationMinutes: 38,
    body: String.raw`## 1. Majorant, minorant et suite bornée

Une suite $(u_n)$ est :

- **majorée** s’il existe $M\in\mathbb R$ tel que $u_n\le M$ pour tout rang ;
- **minorée** s’il existe $m\in\mathbb R$ tel que $u_n\ge m$ pour tout rang ;
- **bornée** si elle est à la fois majorée et minorée.

L’existence d’un seul terme au-dessus de $0$ ne prouve aucune minoration globale. Le mot important est **pour tout**.

$$
|u_n|<A\Longrightarrow -A<u_n<A,
$$

donc la valeur absolue fournit les deux bornes à la fois.

## 2. Convergence

Une suite est convergente lorsqu’elle admet une limite **finie**. Une suite qui tend vers $+\infty$ ou $-\infty$ est divergente, tout comme une suite oscillante telle que $((-1)^n)$.

Si $u_n=f(n)$ et si $f(x)\to\ell$ lorsque $x\to+\infty$, alors $u_n\to\ell$.

## 3. Règles algébriques utiles

Les opérations sur les limites de fonctions restent valables pour les suites. Face à une fraction rationnelle en $n$, divise par la plus grande puissance de $n$ du dénominateur.

$$
\frac{3n^2-2n+1}{n^3}
=\frac3n-\frac2{n^2}+\frac1{n^3}
\longrightarrow0.
$$

Face à une différence de racines, multiplie par la quantité conjuguée :

$$
\sqrt{n^2+1}-n
=\frac1{\sqrt{n^2+1}+n}
\longrightarrow0.
$$

## 4. Construire des bornes

Pour montrer que

$$
u_n=\frac{n+3n^2}{1+n^2}
$$

est minorée par $2$, on calcule la différence avec la borne proposée :

$$
u_n-2=\frac{(n-1)(n+2)}{1+n^2}\ge0\qquad(n\ge1).
$$

Pour

$$
v_n=\sqrt{4-\frac2{1+n^2}},
$$

on part de $1+n^2\ge1$, puis on enchaîne des opérations qui conservent ou inversent correctement les inégalités. On obtient

$$
\sqrt2\le v_n<2.
$$

> **Réflexe Bac.** Pour prouver qu’un nombre est un minorant, étudie $u_n-m$. Pour un majorant, étudie $M-u_n$.`,
    keyPoint: String.raw`Majorée : $u_n\le M$ ; minorée : $u_n\ge m$ ; bornée : $m\le u_n\le M$.`,
    example: String.raw`$\sqrt{n^2+1}-n=1/(\sqrt{n^2+1}+n)\to0$ après multiplication par la quantité conjuguée.`,
    methodSteps: [
      "Traduis mot à mot majorée, minorée ou bornée en une inégalité valable pour tous les rangs.",
      "Pour une fraction, divise par la puissance dominante de n ; pour deux racines soustraites, utilise la quantité conjuguée.",
      "Pour vérifier une borne proposée, soustrais cette borne au terme général et étudie le signe.",
      "Distingue toujours limite finie, limite infinie et absence de limite.",
    ],
    timeline: [
      { label: "Quantificateur", detail: "Une borne doit fonctionner pour tous les termes concernés." },
      { label: "Nature", detail: "Une limite finie signifie convergence ; une limite infinie signifie divergence." },
      { label: "Dominant", detail: "Dans une fraction, repère la puissance la plus forte." },
      { label: "Conjuguée", detail: "Elle transforme une différence de racines en quotient." },
      { label: "Signe", detail: "Étudie uₙ − m ou M − uₙ pour certifier la borne." },
    ],
    questions: questionsByLevel["sequence-limit-algebra"],
    corrections: [
      "Page 12 : la démonstration complète de l’encadrement de vₙ est imprimée deux fois ; elle n’est conservée qu’une seule fois.",
    ],
  },
  {
    id: "monotone-convergence",
    title: "Convergence des suites monotones",
    summary: "Assembler une monotonie et une borne du bon côté pour garantir l’existence d’une limite finie.",
    pages: "6-7 et 12-13",
    section: "5.c. Convergence des suites monotones ; exercice 7",
    durationMinutes: 28,
    body: String.raw`## Les quatre conclusions à connaître

| Monotonie | Borne | Conclusion |
|---|---|---|
| croissante | majorée | convergente |
| décroissante | minorée | convergente |
| croissante | non majorée | limite $+\infty$ |
| décroissante | non minorée | limite $-\infty$ |

> **Attention.** Le théorème garantit l’existence d’une limite, mais ne donne pas automatiquement sa valeur.

## Exemple officiel : la somme des inverses des carrés

Pour $n\ge1$, posons

$$
u_n=\sum_{k=1}^{n}\frac1{k^2}
=1+\frac1{2^2}+\cdots+\frac1{n^2}.
$$

### Étape 1 — monotonie

$$
u_{n+1}-u_n=\frac1{(n+1)^2}>0.
$$

La suite est strictement croissante.

### Étape 2 — majoration télescopique

Pour $k\ge2$ :

$$
\frac1{k^2}\le\frac1{k-1}-\frac1k.
$$

Alors

$$
u_n\le1+\left(1-\frac12\right)+\left(\frac12-\frac13\right)+\cdots+\left(\frac1{n-1}-\frac1n\right)
=2-\frac1n<2.
$$

La suite est croissante et majorée par $2$, donc elle converge.

### Ce que le théorème ne dit pas encore

Le raisonnement précédent ne prouve pas que la limite vaut $2$. Il prouve seulement qu’elle existe et qu’elle est au plus égale à $2$. La remarque du cours cite le résultat plus profond d’Euler :

$$
\lim_{n\to+\infty}u_n=\frac{\pi^2}{6}.
$$

> **Astuce mémoire.** Une suite monte ? Cherche un plafond. Elle descend ? Cherche un plancher.`,
    keyPoint: String.raw`Croissante + majorée, ou décroissante + minorée $\Longrightarrow$ convergente.`,
    example: String.raw`$u_n=\sum_{k=1}^n1/k^2$ est croissante et $u_n<2$, donc elle converge.`,
    methodSteps: [
      "Prouve la monotonie par une différence, un quotient, une fonction ou une récurrence.",
      "Cherche la borne du bon côté : majorant pour une suite croissante, minorant pour une suite décroissante.",
      "Cite exactement le théorème de convergence monotone.",
      "Ne confonds pas existence de la limite et calcul de sa valeur.",
    ],
    timeline: [
      { label: "Variation", detail: "Montre d’abord que tous les pas vont dans la même direction." },
      { label: "Obstacle", detail: "Un plafond bloque une montée ; un plancher bloque une descente." },
      { label: "Théorème", detail: "Monotonie et borne adaptée garantissent une limite finie." },
      { label: "Valeur", detail: "Un argument supplémentaire est souvent nécessaire pour identifier la limite." },
    ],
    questions: questionsByLevel["monotone-convergence"],
    corrections: [
      "Pages 12-13 : le corrigé répète les trois réponses a), b) et c) sous les lettres d), e) et f), alors que l’énoncé ne comporte que trois questions ; la répétition est supprimée.",
    ],
    tip: "Astuce mémoire de Davy : montée + plafond ; descente + plancher.",
  },
  {
    id: "reference-sequences",
    title: "Suites de référence et convergence des suites usuelles",
    summary: "Lire immédiatement les limites des puissances, logarithmes, suites arithmétiques et suites géométriques.",
    pages: "7 et 10-11",
    section: "6.a. Suites de référence ; exercices de fixation 1, 2 et 4",
    durationMinutes: 32,
    body: String.raw`## 1. Puissances et logarithme

Pour $\alpha\in\mathbb R$ :

$$
\alpha<0\Rightarrow n^\alpha\to0,
\qquad
\alpha=0\Rightarrow n^\alpha=1,
\qquad
\alpha>0\Rightarrow n^\alpha\to+\infty.
$$

Et

$$
\ln n\to+\infty.
$$

## 2. Suites géométriques

Pour $u_n=u_0q^n$ avec $u_0\ne0$ :

| Valeur de $q$ | Comportement de $q^n$ |
|---|---|
| $-1<q<1$ | tend vers $0$ |
| $q=1$ | vaut toujours $1$ |
| $q>1$ | tend vers $+\infty$ |
| $q\le-1$ | n’a pas de limite, sauf cas trivial $u_0=0$ |

Le signe de $u_0$ doit ensuite être pris en compte lorsque $q>1$ : un premier terme négatif conduit à $-\infty$.

## 3. Suites arithmétiques

Pour $v_n=v_0+nr$ :

- si $r>0$, $v_n\to+\infty$ ;
- si $r<0$, $v_n\to-\infty$ ;
- si $r=0$, $v_n=v_0$ et la suite converge vers $v_0$.

Le signe du premier terme n’impose donc pas la limite : une suite qui commence positive peut descendre vers $-\infty$ si sa raison est négative.

## 4. Reconnaître une oscillation

$$
(-1)^{2p}=1,
\qquad
(-1)^{2p+1}=-1.
$$

Les termes pairs et impairs ne se rapprochent pas du même nombre : $((-1)^n)$ diverge.

> **Tableau mental.** Pour $q^n$, regarde d’abord $|q|$. S’il est inférieur à $1$, la suite s’éteint ; s’il dépasse $1$, le module explose ; si $q$ est négatif, surveille l’alternance des signes.`,
    keyPoint: String.raw`$|q|<1\Rightarrow q^n\to0$ ; $n^\alpha\to0$ si $\alpha<0$ et $+\infty$ si $\alpha>0$.`,
    example: String.raw`$(-2/e)^n\to0$ car $|-2/e|<1$, tandis que $(-3)^n$ n’a pas de limite.`,
    methodSteps: [
      "Réécris la suite sous la forme standard qⁿ, nᵅ, ln n ou v₀ + nr.",
      "Pour qⁿ, compare |q| à 1 et note séparément le signe de q.",
      "Pour une suite arithmétique, regarde la raison r et non le seul premier terme.",
      "Si les termes pairs et impairs ont des comportements différents, utilise-les pour prouver l’absence de limite.",
    ],
    timeline: [
      { label: "Identifier", detail: "Géométrique, puissance, logarithme ou arithmétique ?" },
      { label: "Comparer", detail: "Base ou exposant se compare à 0 et à 1." },
      { label: "Signer", detail: "Un facteur négatif peut inverser une limite infinie ou créer une oscillation." },
      { label: "Conclure", detail: "Annonce 0, une limite finie, ±∞ ou absence de limite." },
    ],
    questions: questionsByLevel["reference-sequences"],
    tip: "Astuce mémoire de Davy : |q| < 1, la géométrique disparaît ; |q| > 1, son module grandit.",
  },
  {
    id: "sequence-growth",
    title: "Croissances comparées et théorèmes de comparaison",
    summary: "Hiérarchiser logarithme, puissances et exponentielles, puis encadrer une suite pour obtenir sa limite.",
    pages: "7-9",
    section: "6.a. Croissances comparées ; 6.b. Propriétés de comparaison",
    durationMinutes: 31,
    body: String.raw`## 1. La hiérarchie des croissances

Pour $\alpha>0$ et $a>1$ :

$$
\frac{\ln n}{n^\alpha}\longrightarrow0,
\qquad
\frac{n^\alpha}{a^n}\longrightarrow0.
$$

On retient :

$$
\ln n\ll n^\alpha\ll a^n.
$$

Ainsi :

- $\sqrt n/\ln n\to+\infty$ ;
- $n^2-2^{n+3}\to-\infty$ car l’exponentielle domine ;
- $n3^n/4^n=n/(4/3)^n\to0$.

## 2. Passage à la limite dans une inégalité

Si $u_n\le v_n$ à partir d’un certain rang et si les deux suites convergent, alors

$$
\lim u_n\le\lim v_n.
$$

## 3. Comparaison avec une limite infinie

$$
u_n\le v_n\ \text{et}\ v_n\to-\infty
\Longrightarrow u_n\to-\infty,
$$

$$
u_n\ge v_n\ \text{et}\ v_n\to+\infty
\Longrightarrow u_n\to+\infty.
$$

Exemples :

$$
-n+\cos n\le-n+1\to-\infty,
$$

$$
n^2+(-1)^n\ge n^2-1\to+\infty.
$$

## 4. Théorème des gendarmes

Si $v_n\le u_n\le w_n$ à partir d’un certain rang et si $v_n$ et $w_n$ tendent vers le même réel $\ell$, alors $u_n\to\ell$.

La forme

$$
|u_n-\ell|\le v_n,
\qquad v_n\to0,
$$

est un encadrement condensé, car elle équivaut à $\ell-v_n\le u_n\le\ell+v_n$.

> **Choisir le bon sens.** Pour obtenir $+\infty$, place sous la suite une quantité qui tend vers $+\infty$. Pour obtenir $-\infty$, place au-dessus une quantité qui tend vers $-\infty$.`,
    keyPoint: String.raw`$\ln n\ll n^\alpha\ll a^n$ pour $\alpha>0$ et $a>1$.`,
    example: String.raw`$n^2+(-1)^n\ge n^2-1\to+\infty$, donc $n^2+(-1)^n\to+\infty$.`,
    methodSteps: [
      "Mets l’expression sous la forme logarithme/puissance ou puissance/exponentielle.",
      "Dans une somme, factorise le terme qui domine pour identifier le signe final.",
      "Pour une comparaison, choisis une borne dont la limite est connue et vérifie le sens exact de l’inégalité.",
      "Pour une limite finie, cherche deux gendarmes de même limite ou une majoration de |uₙ − ℓ|.",
    ],
    timeline: [
      { label: "Hiérarchie", detail: "L’exponentielle domine les puissances, qui dominent le logarithme." },
      { label: "Factoriser", detail: "Fais apparaître le terme dominant et un facteur qui tend vers une constante." },
      { label: "Encadrer", detail: "Choisis la borne du bon côté selon la limite visée." },
      { label: "Transmettre", detail: "Applique comparaison, passage à la limite ou gendarmes." },
    ],
    questions: questionsByLevel["sequence-growth"],
    corrections: [
      "Page 8 : la mention résiduelle « Tapez une équation ici. » est supprimée ; le calcul est rétabli sous la forme n3ⁿ/4ⁿ = n/(4/3)ⁿ.",
    ],
    tip: "Astuce mémoire de Davy : logarithme marche, puissance court, exponentielle vole.",
  },
  {
    id: "small-angle-sequence",
    title: "Composer une limite et utiliser le petit angle",
    summary: "Traiter une suite de la forme vₙ = f(uₙ), notamment n sin(1/n), en suivant la variable intérieure.",
    pages: "9",
    section: "6.c. Limite d’une suite du type vₙ = f(uₙ)",
    durationMinutes: 18,
    body: String.raw`## La propriété de composition

Soit $(u_n)$ une suite dont les termes appartiennent au domaine d’une fonction $f$, et posons

$$
v_n=f(u_n).
$$

Si

$$
u_n\to a
\qquad\text{et}\qquad
f(x)\to\ell\ \text{lorsque}\ x\to a,
$$

alors

$$
v_n=f(u_n)\to\ell.
$$

Le point clé est de suivre deux mouvements : **le rang $n$ fait tendre $u_n$ vers $a$**, puis **la fonction transforme les valeurs proches de $a$ en valeurs proches de $\ell$**.

## Exemple officiel : le petit angle

Calculons

$$
v_n=n\sin\left(\frac1n\right).
$$

On fait apparaître le quotient de référence :

$$
v_n=\frac{\sin(1/n)}{1/n}.
$$

Posons $u_n=1/n$ et $f(x)=\sin x/x$ pour $x\ne0$. Alors

$$
u_n\to0
\qquad\text{et}\qquad
f(x)=\frac{\sin x}{x}\to1\quad(x\to0).
$$

Par composition :

$$
n\sin\left(\frac1n\right)\to1.
$$

> **Erreur fréquente.** On ne remplace pas directement $1/n$ par $0$ dans $\sin(1/n)/(1/n)$ : cela donnerait la forme indéterminée $0/0$. On utilise la limite de référence.`,
    keyPoint: String.raw`$u_n\to a$ et $f(x)\to\ell$ en $a$ $\Longrightarrow f(u_n)\to\ell$.`,
    example: String.raw`$n\sin(1/n)=\sin(1/n)/(1/n)\to1$.`,
    methodSteps: [
      "Repère l’expression intérieure uₙ et calcule sa limite a.",
      "Définis la fonction extérieure f et vérifie son domaine autour des valeurs uₙ.",
      "Calcule la limite de f(x) lorsque x tend vers a.",
      "Applique la composition et rédige la limite de f(uₙ).",
    ],
    timeline: [
      { label: "Intérieur", detail: "Ici uₙ = 1/n tend vers 0." },
      { label: "Extérieur", detail: "Ici f(x) = sin x / x." },
      { label: "Référence", detail: "La limite de f en 0 vaut 1." },
      { label: "Composition", detail: "Donc f(uₙ), c’est-à-dire n sin(1/n), tend vers 1." },
    ],
    questions: questionsByLevel["small-angle-sequence"],
    tip: "Astuce mémoire de Davy : repère le petit morceau qui tend vers 0, puis fais apparaître sin x / x.",
  },
  {
    id: "recursive-sequence-limit",
    title: "Suites récurrentes, suites adjacentes et mission véhicule",
    summary: "Prouver d’abord la convergence, sélectionner le bon point fixe et résoudre les problèmes de synthèse du cours.",
    pages: "9-14",
    section: "6.d. Suite récurrente ; situation complexe ; exercices 8",
    durationMinutes: 48,
    kind: "challenge",
    body: String.raw`## 1. Le théorème du point fixe

Soit $f$ continue sur un intervalle $K$ et une suite à valeurs dans $K$ telle que

$$
u_{n+1}=f(u_n).
$$

Si $(u_n)$ converge vers $\ell$, alors

$$
\ell=f(\ell),
\qquad \ell\in K.
$$

L’équation $f(x)=x$ fournit des **candidats**, mais elle ne prouve pas la convergence. L’ordre correct est :

1. prouver que les termes restent dans $K$ ;
2. prouver la convergence, souvent par monotonie et borne ;
3. résoudre $f(x)=x$ ;
4. garder la solution appartenant à $K$.

### Exemple officiel

$$
u_0=0{,}8,
\qquad
u_{n+1}=\frac12u_n\left(1+\frac{u_n}{2}\right),
\qquad
0\le u_n\le1.
$$

La suite est supposée décroissante ; elle est donc décroissante et minorée par $0$, donc convergente. Les points fixes vérifient

$$
\frac12x\left(1+\frac x2\right)=x
\iff x(x-2)=0.
$$

Les candidats sont $0$ et $2$, mais seul $0$ appartient à $[0,1]$. Ainsi $u_n\to0$.

## 2. Mission officielle : remplacer un véhicule

La valeur de l’ancien véhicule perd $20\%$ par an :

$$
u_{n+1}=0{,}8u_n,
\qquad
u_5=30\,000\,000(0{,}8)^5=9\,830\,400.
$$

Le prix du véhicule neuf augmente de $3\%$ par an :

$$
v_{n+1}=1{,}03v_n,
\qquad
v_5=30\,000\,000(1{,}03)^5\approx34\,778\,222.
$$

La différence vaut environ

$$
v_5-u_5=24\,947\,822<25\,000\,000.
$$

De plus, $u_5<10\,000\,000$. Les deux conditions sont remplies : l’employé peut acheter le véhicule après cinq ans.

## 3. Exercice de synthèse : deux suites qui se rapprochent

Soit $a\in]1/2,1[$, $u_0=2$, $v_0=3$ et

$$
u_{n+1}=au_n+(1-a)v_n,
\qquad
v_{n+1}=(1-a)u_n+av_n.
$$

En soustrayant :

$$
v_{n+1}-u_{n+1}=(2a-1)(v_n-u_n).
$$

Comme $0<2a-1<1$ et $v_0-u_0=1$, on obtient $v_n-u_n>0$ pour tout $n$ et

$$
v_n-u_n=(2a-1)^n\to0.
$$

Ensuite :

$$
u_{n+1}-u_n=(1-a)(v_n-u_n)>0,
$$

$$
v_{n+1}-v_n=-(1-a)(v_n-u_n)<0.
$$

Ainsi $(u_n)$ croît, $(v_n)$ décroît et

$$
u_0\le u_n<v_n\le v_0.
$$

Elles convergent. Leur différence tendant vers $0$, elles ont la même limite $\ell$. Enfin

$$
u_{n+1}+v_{n+1}=u_n+v_n=5,
$$

donc $2\ell=5$ et

$$
\ell=\frac52.
$$

> **Vision d’ensemble.** Une suite monte, l’autre descend, l’écart devient nul et leur somme reste fixe : elles se rejoignent exactement au milieu.`,
    keyPoint: String.raw`Convergence d’abord ; ensuite seulement $\ell=f(\ell)$. Pour deux suites adjacentes, l’écart tend vers $0$.`,
    example: String.raw`Si $v_n-u_n=(2a-1)^n\to0$ et $u_n+v_n=5$, leur limite commune vaut $5/2$.`,
    methodSteps: [
      "Pour une suite récurrente, trouve un intervalle invariant et prouve la convergence avant de résoudre l’équation de point fixe.",
      "Dans un problème de pourcentage, transforme chaque variation en coefficient multiplicateur avant de calculer le terme demandé.",
      "Pour deux suites couplées, calcule leur différence puis leurs variations ; cherche aussi une somme ou une combinaison constante.",
      "Termine par une phrase qui répond aux seuils et aux contraintes du problème, pas seulement par un nombre.",
    ],
    timeline: [
      { label: "Encadrer", detail: "Prouve que la suite reste dans un intervalle où f est continue." },
      { label: "Converger", detail: "Utilise monotonie et borne avant toute équation de limite." },
      { label: "Fixer", detail: "Résous f(ℓ) = ℓ et garde le candidat compatible avec l’intervalle." },
      { label: "Comparer", detail: "Pour deux suites, étudie différence, variations et éventuel invariant." },
      { label: "Décider", detail: "Dans la mission, vérifie séparément chacun des seuils financiers." },
    ],
    questions: questionsByLevel["recursive-sequence-limit"],
    corrections: [
      "Page 10 : la relation du prix neuf emploie par erreur uₙ ; elle est corrigée en vₙ₊₁ = vₙ + 0,03vₙ = 1,03vₙ.",
      "Page 13 : dans le calcul de vₙ₊₁ − vₙ, un « = vₙ₊₁ » parasite est supprimé ; l’égalité correcte est vₙ₊₁ − vₙ = −(1 − a)(vₙ − uₙ).",
      "Pages 13-14 : accords, indices et ordre des égalités sont harmonisés sans modifier les résultats de l’exercice 8.",
    ],
    tip: "Astuce mémoire de Davy : un point fixe est une destination possible, jamais une preuve de voyage.",
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCSequencesPath: LearningPath = {
  id: "terminale-c-math-l12-sequences",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 12,
  title: "Suites numériques",
  description: "Le cours officiel intégral, des suites arithmétiques et géométriques aux suites récurrentes, avec 79 questions fidèles, leurs corrections détaillées et une mission financière de synthèse.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Reconnaître et exploiter une suite arithmétique ou géométrique",
    "Démontrer une propriété par récurrence et étudier la monotonie d’une suite",
    "Établir des bornes puis appliquer le théorème de convergence monotone",
    "Calculer des limites par référence, croissance comparée, comparaison ou composition",
    "Étudier une suite récurrente et résoudre une situation de synthèse",
  ],
  modules: [
    {
      id: "terminale-c-math-l12-sequences-mastery",
      title: "Maîtriser les suites numériques",
      description: "Huit niveaux progressifs couvrant tout le contenu et tous les exercices du document officiel, sans reprendre la situation d’apprentissage introductive.",
      lessons: builtLevels,
    },
  ],
};
