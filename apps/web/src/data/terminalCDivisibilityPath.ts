import type {
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 03 Divisibilité dans  Z.pdf";

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
}

/**
 * Même formule que le générateur historique et le registre de l'API.
 * Les huit identifiants historiques restent dans leur ordre relatif.
 */
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
      title: "Construire le raisonnement",
      instruction: "Parcours les étapes dans l'ordre avant de passer à la méthode.",
      observation: "Chaque repère reprend le cours officiel et prépare les exercices du niveau.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Identifie d'abord la propriété utile, puis justifie chaque transformation avec une égalité ou une congruence.",
      steps: seed.methodSteps,
      example: {
        prompt: "Mini-exemple guidé",
        work: seed.example,
        result: seed.keyPoint,
      },
      tip: "Astuce de Davy : en arithmétique, une petite égalité bien choisie vaut mieux qu'une longue suite de calculs.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: OfficialLevelSeed[] = [
  {
    id: "integer-divisibility",
    title: "Diviseurs et combinaisons linéaires",
    summary: "Comprendre la divisibilité dans ℤ et exploiter les diviseurs communs pour démontrer une irréductibilité.",
    pages: "1-2",
    section: "I-1. Diviseurs d'un nombre entier relatif",
    durationMinutes: 32,
    body: String.raw`## Définition

Soient $a$ et $b$ deux entiers relatifs avec $b\ne0$. On dit que **$b$ divise $a$** s'il existe $k\in\mathbb Z$ tel que

$$a=kb.$$

On note $b\mid a$. On dit aussi que $b$ est un diviseur de $a$ ou que $a$ est un multiple de $b$.

### Exemples et remarques

- $28=7\times4$, donc $7\mid28$ et $4\mid28$ ;
- $1$ et $-1$ divisent tout entier ;
- $0$ est multiple de tout entier ;
- tout entier non nul divise $0$ ;
- $0$ ne divise aucun entier.

L'ensemble des diviseurs de $a$ se note $\mathcal D(a)$.

## Propriétés

Pour des entiers non nuls $a,b,c$ :

1. si $b\mid a$, alors $|b|\le |a|$ ;
2. $a\mid a$ ;
3. si $a\mid b$ et $b\mid a$, alors $a=b$ ou $a=-b$ ;
4. si $a\mid b$ et $b\mid c$, alors $a\mid c$ ;
5. si $a\mid b$ et $a\mid c$, alors, pour tous $p,q\in\mathbb Z$,

$$a\mid(pb+qc).$$

La dernière propriété est celle des **combinaisons linéaires**.

## Démontrer qu'une fraction est irréductible

Pour

$$A=30n^2+21n+13,\qquad B=15n^2+8n+6,$$

soit $d$ un diviseur commun à $A$ et $B$. Alors

$$d\mid(A-2B)=5n+1.$$

Or

$$B=(5n+1)(3n+1)+5,$$

donc $d\mid5$. Comme $d\mid(5n+1)$, on obtient aussi

$$d\mid[(5n+1)-5n]=1.$$

Ainsi $d=1$ : $A$ et $B$ sont premiers entre eux, donc $\dfrac BA$ est irréductible.

> **Astuce mémoire de Davy.** Si $d$ divise deux nombres, fabrique une combinaison qui **simplifie** les expressions. Ton objectif est souvent d'arriver à $d\mid1$.

> **Point de vigilance.** « $a$ divise $b$ » signifie que le quotient $b/a$ est entier ; l'ordre des mots compte.`,
    keyPoint: "d | a et d | b ⟹ d | (ua + vb), pour tous u,v ∈ ℤ.",
    example: "Comme $6\\mid18$ et $6\\mid30$, on a $6\\mid(2\\times30-3\\times18)=6$.",
    methodSteps: [
      "Nomme d un diviseur commun des deux expressions.",
      "Cherche une combinaison linéaire qui élimine le terme de plus haut degré.",
      "Répète jusqu'à obtenir un petit entier constant.",
      "Si d divise 1, conclus que le PGCD vaut 1.",
    ],
    timeline: [
      { label: "Traduire", detail: "Écrire a=kb pour rendre la divisibilité concrète." },
      { label: "Combiner", detail: "Tout diviseur commun divise chaque combinaison linéaire." },
      { label: "Réduire", detail: "Choisir les coefficients qui simplifient les expressions." },
      { label: "Conclure", detail: "Obtenir d|1 prouve que les deux entiers sont premiers entre eux." },
    ],
    corrections: [
      "La couverture du PDF porte « Leçon 4 » alors que le fichier et le catalogue de la plateforme classent ce contenu comme leçon 03 de Terminale C.",
    ],
    questions: [
      choice("Quelle égalité traduit $7\\mid28$ ?", ["$28=7\\times4$", "$7=28\\times4$", "$28=7+4$"], 0, "Un diviseur multiplie un entier pour donner le multiple.", "I-1-a • page 1"),
      choice("Lequel de ces énoncés est vrai ?", ["Tout entier non nul divise 0", "0 divise tout entier", "0 n'a aucun multiple"], 0, "$0=k\\times b$ avec $k=0$ pour tout $b\\ne0$.", "Remarques • page 1"),
      choice("Si $a\\mid b$ et $b\\mid c$, que peut-on conclure ?", ["$a\\mid c$", "$c\\mid a$", "$a=c$"], 0, "La divisibilité est transitive.", "I-1-b • page 2"),
      choice("Si $d\\mid a$ et $d\\mid b$, quelle expression est forcément divisible par $d$ ?", ["$5a-3b$", "$a/b$", "$a+1$"], 0, "$5a-3b$ est une combinaison linéaire entière.", "I-1-b • page 2"),
      short("Pour $A=30n^2+21n+13$ et $B=15n^2+8n+6$, simplifie $A-2B$.", ["5n+1", "5 n + 1"], "$A-2B=5n+1$.", "Exercice de fixation • page 2", 2),
      short("Quel reste constant apparaît dans $B=(5n+1)(3n+1)+\\dots$ ?", ["5"], "Le développement donne $B=(5n+1)(3n+1)+5$.", "Exercice de fixation • page 2"),
      choice("Si un diviseur commun $d$ vérifie finalement $d\\mid1$, combien vaut le PGCD ?", ["1", "5", "$d$ dépend de $n$"], 0, "Les seuls diviseurs positifs de 1 donnent un PGCD égal à 1.", "Exercice de fixation • page 2"),
      choice("Quelle conclusion porte sur la fraction officielle ?", ["Elle est irréductible", "Elle est toujours entière", "Son numérateur vaut son dénominateur"], 0, "Le numérateur et le dénominateur sont premiers entre eux.", "Exercice de fixation • page 2", 2),
    ],
  },
  {
    id: "euclidean-division-z",
    title: "Division euclidienne dans ℕ et dans ℤ",
    summary: "Déterminer l'unique quotient entier et le reste toujours positif d'une division euclidienne.",
    pages: "2-4",
    section: "I-2. Division euclidienne",
    durationMinutes: 34,
    body: String.raw`## Dans $\mathbb N$

Pour $a\in\mathbb N$ et $b\in\mathbb N^*$, il existe un unique couple $(q,r)\in\mathbb N^2$ tel que

$$a=bq+r,\qquad 0\le r<b.$$

Pour $72$ divisé par $5$ :

$$72=5\times14+2.$$

Le quotient est $14$ et le reste est $2$.

## Dans $\mathbb Z$

Pour $a,b\in\mathbb Z$ avec $b\ne0$, il existe un unique couple

$$(q,r)\in\mathbb Z\times\mathbb N$$

tel que

$$a=bq+r,\qquad 0\le r<|b|.$$

Le reste est donc toujours **positif ou nul**, même si le dividende ou le diviseur est négatif.

### Exemple : $-17$ par $3$

On encadre :

$$3\times(-6)\le-17<3\times(-5).$$

Puis

$$-17=3\times(-6)+1.$$

Ainsi $q=-6$ et $r=1$.

### Signes du diviseur

Changer le signe du diviseur change généralement le quotient, mais le reste reste dans l'intervalle

$$0\le r<|b|.$$

> **Astuce mémoire de Davy.** Le reste ne porte jamais le signe « moins ». Si ton reste est négatif, décale le quotient d'une unité et recommence.

> **Test immédiat.** Une écriture $a=bq+r$ n'est une division euclidienne que si $q$ est entier et $0\le r<|b|$.`,
    keyPoint: "a = bq + r avec 0 ≤ r < |b| ; le couple (q,r) est unique.",
    example: "$-17=3\\times(-6)+1$ : quotient $-6$, reste $1$.",
    methodSteps: [
      "Écris l'encadrement entre deux multiples consécutifs de |b|.",
      "Choisis q pour que le reste a-bq soit positif.",
      "Calcule r=a-bq.",
      "Vérifie simultanément l'égalité et 0≤r<|b|.",
    ],
    timeline: [
      { label: "Encadrer", detail: "Placer a entre deux multiples consécutifs du diviseur positif." },
      { label: "Choisir q", detail: "Le multiple inférieur fournit le quotient pour un diviseur positif." },
      { label: "Calculer r", detail: "Utiliser r=a-bq sans oublier le signe de b." },
      { label: "Vérifier", detail: "Le reste doit appartenir à [0;|b|[." },
    ],
    corrections: [
      "Page 4, question 2-c : après avoir écrit correctement -361=-16×23+7, le PDF annonce par erreur « q=-16 et r=16 ». Le reste correct est 7.",
    ],
    questions: [
      short("Dans $72=5\\times14+2$, quel est le quotient ?", ["14"], "Le nombre qui multiplie le diviseur est le quotient.", "Exemple • pages 2-3"),
      short("Dans cette même division, quel est le reste ?", ["2"], "$0\\le2<5$.", "Exemple • pages 2-3"),
      choice("$71=7\\times9+8$ traduit-elle une division euclidienne de 71 par 7 ?", ["Non", "Oui"], 0, "Le reste 8 n'est pas strictement inférieur à 7.", "Exercice de fixation 1 • page 3"),
      choice("$27=4\\times5+7$ traduit-elle une division euclidienne de 27 par 4 ?", ["Non", "Oui"], 0, "Le reste 7 dépasse |4|.", "Exercice de fixation 1 • pages 3-4"),
      choice("$-161=-12\\times13-5$ est-elle une écriture euclidienne ?", ["Non", "Oui"], 0, "Le reste -5 est négatif.", "Exercice de fixation 1 • pages 3-4"),
      choice("$-127=(-15)\\times9+8$ est-elle une écriture euclidienne ?", ["Oui", "Non"], 0, "$0\\le8<9$.", "Exercice de fixation 1 • pages 3-4"),
      short("Quel est le quotient de 361 par 23 ?", ["15"], "$361=15\\times23+16$.", "Exercice de fixation 1 • page 4"),
      short("Quel est le quotient de 361 par $-23$ ?", ["-15"], "$361=(-15)\\times(-23)+16$.", "Exercice de fixation 1 • page 4"),
      short("Quel est le reste corrigé de la division de $-361$ par 23 ?", ["7"], "$-361=(-16)\\times23+7$.", "Exercice de fixation 1 corrigé • page 4", 2),
      choice("Quelle division de $-361$ par $-23$ est correcte ?", ["$-361=16\\times(-23)+7$", "$-361=15\\times(-23)-16$", "$-361=17\\times(-23)+30$"], 0, "Le reste 7 vérifie $0\\le7<23$.", "Exercice de fixation 1 • page 4", 2),
    ],
  },
  {
    id: "remainders-operations",
    title: "Calculer avec les restes",
    summary: "Remplacer les entiers par leurs restes pour obtenir rapidement le reste d'une somme, d'un produit ou d'une puissance.",
    pages: "4",
    section: "I-2. Exercice de fixation 2",
    durationMinutes: 24,
    body: String.raw`## Le principe

Supposons que le reste de $m$ par $17$ soit $8$ et celui de $n$ par $17$ soit $12$. Il existe donc $q,q'\in\mathbb Z$ tels que

$$m=17q+8,\qquad n=17q'+12.$$

### Reste d'une somme

$$m+n=17(q+q'+1)+3.$$

Le reste est $3$.

### Reste d'un produit

On peut remplacer $m$ et $n$ par leurs restes :

$$mn\equiv8\times12\equiv96\equiv11\pmod{17}.$$

Le reste est $11$.

### Reste d'une puissance

$$m^2\equiv8^2\equiv64\equiv13\pmod{17}.$$

Le reste est $13$.

| Opération | Calcul réduit modulo 17 | Reste |
|---|---:|---:|
| $m+n$ | $8+12=20$ | $3$ |
| $mn$ | $8\times12=96$ | $11$ |
| $m^2$ | $8^2=64$ | $13$ |

> **Astuce mémoire de Davy.** Réduis tôt, réduis souvent : dès qu'un nombre devient grand, remplace-le par son reste.`,
    keyPoint: "Si m≡r [n] et p≡s [n], on calcule les restes avec r+s, rs et rᵏ.",
    example: "$8\\times12=96=17\\times5+11$, donc le reste est $11$.",
    methodSteps: [
      "Remplace chaque entier par son reste.",
      "Effectue l'opération demandée sur les petits nombres.",
      "Réduis encore le résultat modulo le diviseur.",
      "Donne un reste compris entre 0 et n-1.",
    ],
    timeline: [
      { label: "Remplacer", detail: "Écrire m≡8 et n≡12 modulo 17." },
      { label: "Opérer", detail: "Additionner, multiplier ou élever les restes à la puissance." },
      { label: "Réduire", detail: "Effectuer une nouvelle division par 17." },
      { label: "Contrôler", detail: "Le résultat final doit être entre 0 et 16." },
    ],
    questions: [
      choice("Si $m\\equiv8[17]$ et $n\\equiv12[17]$, à quoi est congru $m+n$ ?", ["$20[17]$", "$96[17]$", "$64[17]$"], 0, "On additionne les deux restes.", "Exercice de fixation 2 • page 4"),
      short("Quel est le reste de $m+n$ par 17 ?", ["3"], "$20=17+3$.", "Exercice de fixation 2 • page 4"),
      short("Quel est le reste de $mn$ par 17 ?", ["11"], "$96=17\\times5+11$.", "Exercice de fixation 2 • page 4", 2),
      short("Quel est le reste de $m^2$ par 17 ?", ["13"], "$64=17\\times3+13$.", "Exercice de fixation 2 • page 4", 2),
      choice("Pourquoi peut-on calculer avec 8 et 12 plutôt qu'avec $m$ et $n$ ?", ["Ils ont les mêmes restes modulo 17", "Ils sont égaux à $m$ et $n$", "17 divise 8 et 12"], 0, "Les opérations sont compatibles avec l'égalité des restes.", "Méthode • page 4"),
    ],
  },
  {
    id: "congruences",
    title: "Congruences modulo n",
    summary: "Traduire l'égalité des restes et calculer avec les congruences en toute sécurité.",
    pages: "4-6",
    section: "I-3. Congruence modulo n",
    durationMinutes: 32,
    body: String.raw`## Définition

Pour $a,b\in\mathbb Z$ et $n\in\mathbb N^*$ :

$$a\equiv b\pmod n\quad\Longleftrightarrow\quad n\mid(a-b).$$

Exemples :

$$23\equiv3\pmod5,\qquad39\equiv-1\pmod8.$$

Si $0\le b<n$, alors $b$ est le reste de la division euclidienne de $a$ par $n$.

## Propriétés

La congruence est réflexive, symétrique et transitive. Elle est aussi compatible avec :

$$a\equiv b,\ c\equiv d\pmod n
\Longrightarrow
\begin{cases}
a+c\equiv b+d\pmod n,\\
ac\equiv bd\pmod n,\\
a^k\equiv b^k\pmod n.
\end{cases}$$

Deux entiers sont congrus modulo $n$ si et seulement s'ils ont le même reste modulo $n$.

## Exercice officiel : $a=51$, $b=126$, modulo 8

On a $a\equiv3[8]$ et $b\equiv6[8]$.

$$ab\equiv3\times6\equiv18\equiv2[8],$$

$$6a-5b\equiv6\times3-5\times6\equiv-12\equiv4[8],$$

$$a^4\equiv3^4=81\equiv1[8].$$

Enfin, $2020\equiv5[13]$. Si $x\equiv2020[13]$, son reste modulo 13 est donc $5$.

> **Astuce mémoire de Davy.** Une congruence n'est pas une égalité ordinaire : on peut additionner et multiplier, mais une division exige des conditions supplémentaires.`,
    keyPoint: "a ≡ b [n] ⟺ n | (a-b) ⟺ a et b ont le même reste modulo n.",
    example: "$39-(-1)=40$ est divisible par $8$, donc $39\\equiv-1[8]$.",
    methodSteps: [
      "Réduis chaque nombre modulo n.",
      "Effectue l'addition, le produit ou la puissance.",
      "Réduis de nouveau jusqu'à obtenir un représentant entre 0 et n-1.",
      "Si une division apparaît, vérifie d'abord que le facteur simplifié est inversible modulo n.",
    ],
    timeline: [
      { label: "Comparer", detail: "Calculer a-b et vérifier qu'il est multiple de n." },
      { label: "Remplacer", detail: "Choisir de petits représentants de chaque classe." },
      { label: "Calculer", detail: "Utiliser la compatibilité avec somme, produit et puissances." },
      { label: "Normaliser", detail: "Présenter le reste final entre 0 et n-1." },
    ],
    questions: [
      choice("Pourquoi $23\\equiv3[5]$ ?", ["Parce que $5\\mid(23-3)$", "Parce que $23/3$ est entier", "Parce que $23+3=26$"], 0, "$23-3=20$ est multiple de 5.", "I-3-a • page 4"),
      choice("$39\\equiv-1[8]$ signifie que…", ["$8\\mid40$", "$8\\mid38$", "$39=-1$"], 0, "$39-(-1)=40$.", "I-3-a • page 4"),
      short("Quel est le reste de $51$ par 8 ?", ["3"], "$51=8\\times6+3$.", "Exercice de fixation • page 5"),
      short("Quel est le reste de $126$ par 8 ?", ["6"], "$126=8\\times15+6$.", "Exercice de fixation • page 5"),
      short("Quel est le reste de $51\\times126$ par 8 ?", ["2"], "$3\\times6=18\\equiv2[8]$.", "Exercice de fixation • page 5", 2),
      short("Quel est le reste de $6\\times51-5\\times126$ par 8 ?", ["4"], "$18-30=-12\\equiv4[8]$.", "Exercice de fixation • page 5", 2),
      short("Quel est le reste de $51^4$ par 8 ?", ["1"], "$3^4=81\\equiv1[8]$.", "Exercice de fixation • page 5", 2),
      short("Si $x\\equiv2020[13]$, quel est le reste de $x$ par 13 ?", ["5"], "$2020=13\\times155+5$.", "Exercice • pages 5-6"),
    ],
  },
  {
    id: "numeration-divisibility-tests",
    title: "Écrire un entier dans une base",
    summary: "Passer entre les systèmes décimal, binaire, octal et hexadécimal grâce aux puissances de la base.",
    pages: "6-7",
    section: "I-4-a-b. Numération et bases",
    durationMinutes: 30,
    body: String.raw`## Écriture en base $b$

Pour tout entier $b\ge2$, tout entier naturel non nul $x$ s'écrit de manière unique

$$x=\sum_{k=0}^{n}a_kb^k
=a_0+a_1b+a_2b^2+\cdots+a_nb^n,$$

avec

$$0\le a_k<b,\qquad a_n\ne0.$$

On note cette écriture

$$x=\overline{a_na_{n-1}\ldots a_1a_0}^{\,b}.$$

| Base | Nom | Chiffres autorisés |
|---:|---|---|
| 2 | binaire | 0, 1 |
| 8 | octale | 0 à 7 |
| 10 | décimale | 0 à 9 |
| 16 | hexadécimale | 0 à 9 puis A, B, C, D, E, F |

En base 16 : $A=10$, $B=11$, …, $F=15$.

## Passer de la base 10 à la base 2

On effectue des divisions successives par 2 et on lit les restes du dernier au premier.

Pour $222$ :

$$222=\overline{11011110}^{\,2}.$$

Vérification :

$$128+64+16+8+4+2=222.$$

## Passer d'une base $b$ à la base 10

Pour $\overline{10254}^{\,8}$ :

$$1\times8^4+0\times8^3+2\times8^2+5\times8+4=4268.$$

> **Astuce mémoire de Davy.** Vers la base 10 : développe avec les puissances. Depuis la base 10 : divise successivement et lis les restes à l'envers.`,
    keyPoint: "x = a₀ + a₁b + … + aₙbⁿ, avec 0 ≤ aₖ < b.",
    example: "$\\overline{10254}^{\,8}=4096+128+40+4=4268$.",
    methodSteps: [
      "Vérifie que chaque chiffre est autorisé dans la base.",
      "Vers la base 10, multiplie chaque chiffre par la bonne puissance.",
      "Depuis la base 10, effectue des divisions successives par la base.",
      "Contrôle en reconstruisant le nombre avec les puissances.",
    ],
    timeline: [
      { label: "Choisir la base", detail: "La base fixe les chiffres utilisables et les puissances." },
      { label: "Positionner", detail: "Le chiffre des unités multiplie b⁰, le suivant b¹, etc." },
      { label: "Convertir", detail: "Développer ou effectuer des divisions successives." },
      { label: "Vérifier", detail: "Recalculer la valeur décimale de l'écriture obtenue." },
    ],
    questions: [
      choice("Quels chiffres sont autorisés en base 2 ?", ["0 et 1", "0, 1 et 2", "1 et 2"], 0, "Chaque chiffre est strictement inférieur à la base.", "I-4-a-b • pages 6-7"),
      choice("Quel symbole hexadécimal représente 15 ?", ["F", "E", "A"], 0, "A=10, B=11, …, F=15.", "I-4-b • page 7"),
      choice("Quelle écriture binaire le PDF obtient-il pour 222 ?", ["$11011110_2$", "$11101110_2$", "$11011101_2$"], 0, "$128+64+16+8+4+2=222$.", "Exercice de fixation • pages 6-7", 2),
      short("Combien vaut $\\overline{10254}^{\,8}$ en base 10 ?", ["4268"], "$8^4+2\\times8^2+5\\times8+4=4268$.", "Exercice • page 7", 2),
      choice("Dans $\\overline{10254}^{\,8}$, quelle puissance multiplie le chiffre 2 ?", ["$8^2$", "$8^3$", "$8^1$"], 0, "Le 2 occupe le rang des $8^2$.", "Exercice • page 7"),
      choice("Pour convertir un entier décimal en base 2, on lit les restes…", ["du dernier au premier", "du premier au dernier", "dans n'importe quel ordre"], 0, "Le dernier quotient donne le chiffre de plus fort poids.", "Méthode • pages 6-7"),
    ],
  },
  {
    id: "divisibility-tests",
    title: "Critères de divisibilité",
    summary: "Justifier les critères usuels de divisibilité à partir des puissances de 10 modulo n.",
    pages: "7-9",
    section: "I-4-c. Quelques critères de divisibilité",
    durationMinutes: 34,
    body: String.raw`## Pourquoi les critères fonctionnent-ils ?

Pour un entier décimal

$$x=\gamma_0+10\gamma_1+10^2\gamma_2+\cdots+10^p\gamma_p,$$

on réduit les puissances de $10$ modulo le diviseur.

### Derniers chiffres

- modulo 2 ou 5, $10\equiv0$ : seul le chiffre des unités compte ;
- modulo 4 ou 25, $10^2\equiv0$ : seuls les deux derniers chiffres comptent ;
- modulo 8, $10^3\equiv0$ : seuls les trois derniers chiffres comptent.

### Somme des chiffres

Comme $10\equiv1[3]$ et $10\equiv1[9]$ :

$$x\equiv\sum_{k=0}^{p}\gamma_k\pmod3,$$

et de même modulo 9.

### Alternance des chiffres pour 11

Comme $10\equiv-1[11]$, les puissances alternent entre $1$ et $-1$. Un entier est divisible par 11 si la différence entre la somme des chiffres de rang pair et celle des chiffres de rang impair est divisible par 11.

Pour $6485958017$ :

$$(6+8+9+8+1)-(4+5+5+0+7)=32-21=11.$$

Donc $6485958017$ est divisible par $11$.

### Tableau pratique

| Diviseur | Critère |
|---:|---|
| 2 | chiffre des unités pair |
| 3 | somme des chiffres divisible par 3 |
| 4 | nombre formé par les deux derniers chiffres divisible par 4 |
| 5 | dernier chiffre 0 ou 5 |
| 8 | nombre formé par les trois derniers chiffres divisible par 8 |
| 9 | somme des chiffres divisible par 9 |
| 10 | dernier chiffre 0 |
| 11 | différence alternée divisible par 11 |
| 25 | deux derniers chiffres divisibles par 25 |

> **Astuce mémoire de Davy.** Les critères viennent tous d'une même idée : regarde ce que deviennent $10,10^2,10^3,\ldots$ modulo le nombre étudié.`,
    keyPoint: "Réduire les puissances de 10 modulo n transforme l'écriture décimale en un test simple.",
    example: "$10\\equiv-1[11]$ explique l'alternance des sommes de chiffres.",
    methodSteps: [
      "Écris le nombre comme somme de chiffres multipliés par des puissances de 10.",
      "Réduis les puissances de 10 modulo le diviseur.",
      "Conserve seulement les chiffres ou les sommes qui restent.",
      "Vérifie que l'expression obtenue est divisible par le diviseur.",
    ],
    timeline: [
      { label: "Décomposer", detail: "Écrire x=γ₀+10γ₁+10²γ₂+…." },
      { label: "Réduire 10", detail: "Calculer les premières puissances de 10 modulo n." },
      { label: "Simplifier", detail: "Éliminer les termes congrus à zéro." },
      { label: "Tester", detail: "Appliquer le critère aux chiffres restants." },
    ],
    corrections: [
      "Page 8, justification du critère de divisibilité par 25 : le PDF écrit par erreur 10^k≡0 [8] pour k≥2. Le module correct est 25.",
    ],
    questions: [
      choice("Quel chiffre suffit pour tester la divisibilité par 2 ?", ["Le chiffre des unités", "Le chiffre des centaines", "Le premier chiffre"], 0, "$10\\equiv0[2]$.", "Critère par 2 • page 8"),
      choice("Quel test convient pour 3 ?", ["La somme des chiffres", "Les deux derniers chiffres", "La différence alternée"], 0, "$10\\equiv1[3]$.", "Critère par 3 • pages 7-8"),
      choice("Pour tester la divisibilité par 4, on regarde…", ["les deux derniers chiffres", "les trois derniers chiffres", "la somme des chiffres"], 0, "$100\\equiv0[4]$.", "Congruence modulo 4 • pages 7-8"),
      choice("Un entier est divisible par 5 si son dernier chiffre est…", ["0 ou 5", "pair", "5 uniquement"], 0, "Ce sont les chiffres congrus à 0 modulo 5.", "Critère par 5 • page 8"),
      choice("Pour tester la divisibilité par 8, on regarde…", ["les trois derniers chiffres", "les deux derniers chiffres", "le dernier chiffre"], 0, "$1000\\equiv0[8]$.", "Congruence modulo 8 • page 8"),
      choice("Quel critère partagent 3 et 9 ?", ["La somme des chiffres", "Les deux derniers chiffres", "La parité"], 0, "$10\\equiv1$ dans les deux modules.", "Critères par 3 et 9 • pages 7-8"),
      choice("Quel est le critère de divisibilité par 10 ?", ["Le chiffre des unités vaut 0", "La somme des chiffres vaut 10", "Le nombre est pair"], 0, "Un multiple de 10 se termine par 0.", "Critère par 10 • page 8"),
      choice("Pourquoi le test de 11 utilise-t-il une alternance ?", ["Parce que $10\\equiv-1[11]$", "Parce que $10\\equiv0[11]$", "Parce que $11\\equiv1[10]$"], 0, "Les puissances de -1 alternent.", "Critère par 11 • page 8", 2),
      short("Calcule $(6+8+9+8+1)-(4+5+5+0+7)$.", ["11"], "$32-21=11$.", "Exercice de fixation • pages 8-9"),
      choice("Que conclure pour 6485958017 ?", ["Il est divisible par 11", "Il n'est pas divisible par 11", "Il est premier"], 0, "La différence alternée vaut 11, multiple de 11.", "Exercice de fixation • pages 8-9", 2),
      choice("Pour tester la divisibilité par 25, quelle congruence correcte utilise-t-on pour $k\\ge2$ ?", ["$10^k\\equiv0[25]$", "$10^k\\equiv0[8]$", "$10^k\\equiv1[25]$"], 0, "Le PDF contient ici une coquille de module.", "Critère corrigé • page 8", 2),
    ],
  },
  {
    id: "prime-numbers",
    title: "Reconnaître un nombre premier",
    summary: "Utiliser les diviseurs premiers inférieurs à la racine carrée pour décider si un entier est premier.",
    pages: "9",
    section: "II-1. Les nombres premiers",
    durationMinutes: 28,
    body: String.raw`## Définition

Un entier naturel $p$ est **premier** lorsqu'il possède exactement deux diviseurs positifs :

$$1\quad\text{et}\quad p.$$

Ainsi $7$ est premier. En revanche :

- $0$ et $1$ ne sont pas premiers ;
- $2$ est le seul nombre premier pair.

## Propriétés

1. Tout entier $n>1$ possède au moins un diviseur premier.
2. Si $n>1$ n'est pas premier, alors il possède un diviseur premier $p$ tel que

$$2\le p\le\sqrt n.$$

3. Il existe une infinité de nombres premiers.

## Tester un entier

Pour décider si $n$ est premier, il suffit d'essayer les diviseurs premiers inférieurs ou égaux à $\sqrt n$.

### Le nombre 983

$$\sqrt{983}\approx31{,}35.$$

On teste $2,3,5,7,11,13,17,19,23,29,31$. Aucun ne divise $983$, donc $983$ est premier.

### Le nombre 2419

$$\sqrt{2419}\approx49{,}18.$$

Or

$$2419=41\times59.$$

Donc $2419$ n'est pas premier.

> **Astuce mémoire de Davy.** Arrête les essais à la racine carrée : si $n=ab$, au moins l'un des deux facteurs est inférieur ou égal à $\sqrt n$.

> **Erreur fréquente.** Ne teste pas tous les entiers : seuls les nombres premiers jusqu'à $\sqrt n$ sont nécessaires.`,
    keyPoint: "Si n est composé, il possède un diviseur premier p ≤ √n.",
    example: "$2419=41\\times59$, donc $2419$ est composé.",
    methodSteps: [
      "Calcule ou encadre √n.",
      "Liste les nombres premiers inférieurs ou égaux à √n.",
      "Teste leur divisibilité avec les critères ou une division.",
      "Un diviseur trouvé suffit ; sinon n est premier.",
    ],
    timeline: [
      { label: "Écarter", detail: "Vérifier d'abord la parité et les critères de 3 et 5." },
      { label: "Borner", detail: "Calculer la racine carrée de l'entier." },
      { label: "Tester", detail: "Essayer uniquement les nombres premiers sous la borne." },
      { label: "Décider", detail: "Un facteur suffit pour prouver que le nombre est composé." },
    ],
    corrections: [
      "Page 9 : l'énoncé demande d'étudier 983 et 2419, mais la correction remplace 2419 par 2232. Le calcul correct est 2419=41×59, donc 2419 n'est pas premier.",
    ],
    questions: [
      choice("Combien de diviseurs positifs possède un nombre premier ?", ["Exactement 2", "Exactement 1", "Une infinité"], 0, "Ce sont 1 et le nombre lui-même.", "II-1 • page 9"),
      choice("Le nombre 1 est-il premier ?", ["Non", "Oui"], 0, "Il ne possède qu'un seul diviseur positif.", "Remarque • page 9"),
      choice("Quel est le seul nombre premier pair ?", ["2", "0", "4"], 0, "Tout autre entier pair supérieur à 2 est divisible par 2.", "Remarque • page 9"),
      short("Jusqu'à quel entier premier faut-il tester 983, sachant que $\\sqrt{983}\\approx31{,}35$ ?", ["31"], "On teste les nombres premiers inférieurs ou égaux à la racine.", "Exercice de fixation • page 9"),
      choice("Que conclut le cours pour 983 ?", ["983 est premier", "983 est divisible par 31", "983 est pair"], 0, "Aucun nombre premier inférieur ou égal à 31 ne le divise.", "Exercice de fixation • page 9", 2),
      short("Quel facteur premier corrigé de 2419 est inférieur à sa racine carrée ?", ["41"], "$2419=41\\times59$.", "Exercice de fixation corrigé • page 9", 2),
      choice("Quelle conclusion correcte porte sur 2419 ?", ["Il est composé", "Il est premier", "Il est divisible par 2"], 0, "$41$ est un diviseur non trivial.", "Exercice de fixation corrigé • page 9", 2),
    ],
  },
  {
    id: "prime-factorization",
    title: "Décomposer en facteurs premiers",
    summary: "Écrire de manière unique un entier supérieur à 1 comme produit de puissances de nombres premiers.",
    pages: "9-10",
    section: "II-2. Décomposition en produit de facteurs premiers",
    durationMinutes: 28,
    body: String.raw`## Théorème de décomposition

Tout entier naturel $n>1$ s'écrit sous la forme

$$n=p_1^{\alpha_1}p_2^{\alpha_2}\cdots p_k^{\alpha_k},$$

où

$$p_1<p_2<\cdots<p_k$$

sont des nombres premiers et les exposants $\alpha_i$ sont des entiers naturels non nuls.

Cette décomposition est **unique**, à l'ordre des facteurs près.

## Méthode des divisions successives

On essaie les nombres premiers dans l'ordre :

$$2,\ 3,\ 5,\ 7,\ 11,\ 13,\ldots$$

On divise tant que le quotient reste entier, puis on passe au nombre premier suivant.

### Exemple officiel

$$1092=2\times546=2^2\times273.$$

Puis

$$273=3\times91=3\times7\times13.$$

Donc

$$\boxed{1092=2^2\times3\times7\times13}.$$

> **Astuce mémoire de Davy.** Commence toujours par le plus petit nombre premier. Chaque répétition du même diviseur augmente son exposant.`,
    keyPoint: "n = p₁^α₁ × … × pₖ^αₖ, avec des nombres premiers distincts.",
    example: "$1092=2^2\\times3\\times7\\times13$.",
    methodSteps: [
      "Teste la divisibilité par 2, puis 3, puis les nombres premiers suivants.",
      "Divise autant de fois que possible par un même nombre premier.",
      "Compte les répétitions pour former l'exposant.",
      "Multiplie les facteurs obtenus pour vérifier le nombre initial.",
    ],
    timeline: [
      { label: "Commencer par 2", detail: "Extraire tous les facteurs 2." },
      { label: "Continuer par 3", detail: "Utiliser la somme des chiffres pour tester rapidement." },
      { label: "Poursuivre", detail: "Essayer les nombres premiers croissants." },
      { label: "Vérifier", detail: "Recomposer le produit complet." },
    ],
    questions: [
      choice("La décomposition en facteurs premiers est-elle unique ?", ["Oui, à l'ordre près", "Non", "Seulement pour les nombres pairs"], 0, "C'est une propriété fondamentale.", "II-2 • pages 9-10"),
      short("Quel est l'exposant de 2 dans la décomposition de 1092 ?", ["2"], "$1092$ est divisible deux fois par 2.", "Exercice de fixation • page 10"),
      choice("Après avoir extrait $2^2\\times3$, quel quotient reste-t-il ?", ["91", "273", "13"], 0, "$1092/(4\\times3)=91$.", "Exercice de fixation • page 10", 2),
      short("Quels sont les deux derniers facteurs premiers de 1092, dans l'ordre ?", ["7 et 13", "7,13", "7 × 13", "7x13"], "$91=7\\times13$.", "Exercice de fixation • page 10"),
      choice("Quelle décomposition est correcte ?", ["$2^2\\times3\\times7\\times13$", "$2\\times3^2\\times7\\times13$", "$4\\times273$ uniquement"], 0, "Tous les facteurs doivent être premiers et les répétitions regroupées.", "Exercice de fixation • page 10", 2),
    ],
  },
  {
    id: "number-of-divisors",
    title: "Construire et compter les diviseurs",
    summary: "Déduire tous les diviseurs positifs et leur nombre à partir des exposants de la décomposition première.",
    pages: "10",
    section: "II-2. Diviseurs positifs",
    durationMinutes: 26,
    body: String.raw`## Former les diviseurs

Si

$$n=p_1^{\alpha_1}p_2^{\alpha_2}\cdots p_k^{\alpha_k},$$

alors tout diviseur positif $d$ de $n$ est de la forme

$$d=p_1^{\beta_1}p_2^{\beta_2}\cdots p_k^{\beta_k},$$

avec

$$0\le\beta_i\le\alpha_i.$$

Pour chaque facteur premier $p_i$, l'exposant $\beta_i$ possède $\alpha_i+1$ choix.

## Nombre de diviseurs positifs

Par indépendance des choix :

$$\tau(n)=(\alpha_1+1)(\alpha_2+1)\cdots(\alpha_k+1).$$

### Exemple officiel

$$1092=2^2\times3^1\times7^1\times13^1.$$

Donc

$$\tau(1092)=(2+1)(1+1)(1+1)(1+1)=3\times2^3=24.$$

> **Astuce mémoire de Davy.** Ajoute 1 à chaque exposant, puis multiplie. Le « +1 » compte aussi le choix de l'exposant zéro.`,
    keyPoint: "Si n=∏pᵢ^αᵢ, alors τ(n)=∏(αᵢ+1).",
    example: "$\\tau(1092)=3\\times2\\times2\\times2=24$.",
    methodSteps: [
      "Décompose n en facteurs premiers.",
      "Relève chaque exposant αᵢ.",
      "Ajoute 1 à chacun de ces exposants.",
      "Multiplie les nombres de choix.",
    ],
    timeline: [
      { label: "Décomposer", detail: "La formule exige la décomposition première." },
      { label: "Choisir les exposants", detail: "Chaque βᵢ varie de 0 à αᵢ." },
      { label: "Compter", detail: "Il y a αᵢ+1 possibilités pour chaque facteur." },
      { label: "Multiplier", detail: "Les choix étant indépendants, on multiplie." },
    ],
    questions: [
      choice("Dans un diviseur de $p^\\alpha$, combien de valeurs l'exposant peut-il prendre ?", ["$\\alpha+1$", "$\\alpha$", "$2\\alpha$"], 0, "Les valeurs vont de 0 à α inclus.", "II-2 • page 10"),
      choice("Quel ensemble de valeurs convient à l'exposant de 2 dans un diviseur de 1092 ?", ["$\\{0,1,2\\}$", "$\\{1,2\\}$", "$\\{0,1,2,3\\}$"], 0, "L'exposant de 2 dans 1092 est 2.", "II-2 • page 10"),
      choice("Quelle formule calcule $\\tau(1092)$ ?", ["$(2+1)(1+1)^3$", "$2+1+1+1$", "$2\\times1\\times1\\times1$"], 0, "On multiplie les exposants augmentés de 1.", "Exercice de fixation • page 10"),
      short("Combien de diviseurs positifs possède 1092 ?", ["24"], "$3\\times2\\times2\\times2=24$.", "Exercice de fixation • page 10", 2),
      choice("Pourquoi ajoute-t-on 1 à chaque exposant ?", ["Pour inclure l'exposant 0", "Parce que 1 est premier", "Pour compter les diviseurs négatifs"], 0, "Un facteur premier peut être absent du diviseur.", "Méthode • page 10"),
    ],
  },
  {
    id: "modular-strategy-mission",
    title: "Mission : stratégies et raisonnements modulaires",
    summary: "Mobiliser toute l'arithmétique pour gagner au jeu des bâtonnets et résoudre les huit premiers exercices de synthèse.",
    pages: "10-15",
    section: "C. Situation complexe et D. Exercices 1 à 8",
    durationMinutes: 48,
    kind: "challenge",
    body: String.raw`## Situation complexe : les 20 bâtonnets

Deux joueurs retirent à tour de rôle $1$, $2$ ou $3$ bâtonnets. Celui qui prend le dernier perd.

La stratégie gagnante consiste à toujours laisser à l'adversaire un nombre de bâtonnets congru à $1$ modulo $4$ :

$$17,\ 13,\ 9,\ 5,\ 1.$$

Au premier tour, le joueur qui commence retire $3$ bâtonnets et en laisse $17$. Ensuite, si l'adversaire retire $t\in\{1,2,3\}$ bâtonnets, il en retire $4-t$. Les deux retraits totalisent toujours $4$.

Finalement l'adversaire reçoit un seul bâtonnet et doit prendre le dernier : il perd.

## Les idées des exercices de synthèse

### Produits d'entiers consécutifs

- $n(n+1)$ est toujours divisible par $2$ ;
- $n(n-1)(n+1)$ est toujours divisible par $3$.

### Cycle des puissances de 5 modulo 13

$$5^0\equiv1,\quad5^1\equiv5,\quad5^2\equiv-1,\quad5^3\equiv-5,\quad5^4\equiv1\pmod{13}.$$

Ainsi

$$5^n\equiv-1[13]\Longleftrightarrow n=4p+2.$$

La même condition résout $13\mid(5^n+5^{2n})$.

### Puissances et bases

- $11\mid(174277^{2625}-1)$ ;
- en base 16, pour $a=17=\overline{11}^{\,16}$ :

$$a^2=\overline{121}^{\,16},\quad
a^3=\overline{1331}^{\,16},\quad
a^4=\overline{14641}^{\,16};$$

- $2^n-1$ s'écrit avec $n$ chiffres $1$ en base 2 ;
- le nombre formé de $n$ chiffres $1$ en base $a$ vaut

$$\frac{a^n-1}{a-1}.$$

### Parité et primalité

Pour tout entier naturel $q$ :

$$q\text{ impair}\Longleftrightarrow q^2\text{ impair},$$

et, si $q$ est impair,

$$q^2\equiv1[8].$$

Si $n$ est premier, $n+7$ n'est pas premier : pour $n=2$, il vaut $9$ ; pour $n>2$, il est pair et supérieur à $2$.

Enfin :

$$a^4+a^2+1=(a^2-a+1)(a^2+a+1).$$

Cette expression est première seulement pour $a=\pm1$, où elle vaut $3$.

> **Astuce mémoire de Davy.** Cherche le cycle modulo $n$, la factorisation cachée ou l'invariant du jeu. Ce sont trois versions d'une même stratégie : remplacer un problème long par une structure qui se répète.`,
    keyPoint: "Un invariant modulaire transforme une stratégie ou une grande puissance en un cycle court.",
    example: "Avec 20 bâtonnets, retirer 3 puis compléter chaque tour adverse à 4 force les positions 17,13,9,5,1.",
    methodSteps: [
      "Repère le module naturel du problème : 4 pour le jeu, 13 pour les puissances.",
      "Calcule quelques cas pour découvrir un cycle ou une factorisation.",
      "Démontre que la structure se conserve à chaque étape.",
      "Reviens à la question et formule clairement toutes les solutions.",
    ],
    timeline: [
      { label: "Observer", detail: "Calculer quelques valeurs ou positions gagnantes." },
      { label: "Conjecturer", detail: "Identifier un cycle, un invariant ou une factorisation." },
      { label: "Prouver", detail: "Utiliser congruences, récurrence ou divisibilité." },
      { label: "Exploiter", detail: "Décrire la stratégie ou l'ensemble exact des solutions." },
    ],
    corrections: [
      "Page 12, exercice 3 : la conclusion « 11|174277 » ne répond pas à l'énoncé. La conclusion correcte est 11|(174277^2625-1).",
      "Pages 14-15, exercice 8 : certains développements d'inégalités sont typographiquement brouillés. La factorisation suffit : pour a≠-1,0,1, les deux facteurs sont strictement supérieurs à 1.",
    ],
    questions: [
      short("Au premier tour du jeu des 20 bâtonnets, combien le joueur qui commence doit-il en retirer ?", ["3"], "Il doit laisser 17, qui est congru à 1 modulo 4.", "Situation complexe • pages 10-11", 2),
      choice("Quelles positions faut-il laisser à l'adversaire ?", ["$17,13,9,5,1$", "$16,12,8,4,0$", "$18,14,10,6,2$"], 0, "Elles sont toutes congrues à 1 modulo 4.", "Situation complexe • page 11", 2),
      short("Si l'adversaire retire 2 bâtonnets, combien faut-il en retirer ensuite ?", ["2"], "Les deux retraits doivent totaliser 4.", "Situation complexe • page 11"),
      choice("Pourquoi l'adversaire finit-il par perdre ?", ["Il reçoit un seul bâtonnet et doit prendre le dernier", "Il ne peut jamais jouer", "Il prend toujours trois bâtonnets"], 0, "La règle déclare perdant celui qui prend le dernier.", "Situation complexe • page 11", 2),
      choice("Exercice 1 : $n(n+1)$ est toujours un multiple de…", ["2", "3", "6"], 0, "Deux entiers consécutifs contiennent toujours un entier pair.", "Exercice 1 • page 11"),
      choice("Exercice 1 : $n(n-1)(n+1)$ est toujours divisible par…", ["3", "5", "7"], 0, "Parmi trois entiers consécutifs, l'un est multiple de 3.", "Exercice 1 • page 11"),
      short("Quel est le reste de la division euclidienne de 23 par $-3$ ?", ["2"], "$23=(-3)(-7)+2$.", "Exercice 1 • page 11"),
      choice("Quel est le cycle de $5^n$ modulo 13 ?", ["$1,5,-1,-5$", "$1,5,1,5$", "$1,-1$"], 0, "$5^4\\equiv1[13]$ relance le cycle.", "Exercice 2 • pages 11-12", 2),
      choice("Quelles valeurs de $n$ vérifient $5^n\\equiv-1[13]$ ?", ["$n=4p+2$", "$n=4p$", "$n=2p+1$"], 0, "Le terme -1 occupe la position 2 du cycle de longueur 4.", "Exercice 2 • pages 11-12", 2),
      choice("Quelles valeurs résolvent $13\\mid(5^n+5^{2n})$ ?", ["$n=4p+2$", "$n=4p+1$", "Tous les entiers"], 0, "$5^n+5^{2n}=5^n(1+5^n)$ et 5 est premier avec 13.", "Exercice 2 • pages 11-12", 3),
      short("À quoi est congru 174277 modulo 11 ?", ["4"], "Le critère de 11 donne $7-7+2-4+7-1=4$.", "Exercice 3 • page 12"),
      choice("Pourquoi $4^{2625}\\equiv1[11]$ ?", ["Parce que $4^5=1024\\equiv1[11]$ et $2625=5\\times525$", "Parce que 4 divise 11", "Parce que 2625 est pair"], 0, "On regroupe la puissance par blocs de 5.", "Exercice 3 • page 12", 3),
      choice("Quelle conclusion corrigée répond à l'exercice 3 ?", ["$11\\mid(174277^{2625}-1)$", "$11\\mid174277$", "$174277\\mid11$"], 0, "La grande puissance est congrue à 1 modulo 11.", "Exercice 3 corrigé • page 12", 2),
      choice("Quelle est l'écriture hexadécimale de 17 ?", ["$11_{16}$", "$17_{16}$", "$10_{16}$"], 0, "$17=1\\times16+1$.", "Exercice 4 • pages 12-13"),
      choice("Quelle est l'écriture hexadécimale de $17^2$ ?", ["$121_{16}$", "$289_{16}$", "$111_{16}$"], 0, "$(16+1)^2=16^2+2\\times16+1$.", "Exercice 4 • page 12", 2),
      choice("Quelle est l'écriture hexadécimale de $17^4$ ?", ["$14641_{16}$", "$83521_{16}$", "$1331_{16}$"], 0, "Le développement ou le carré de $121_{16}$ donne $14641_{16}$.", "Exercice 4 • pages 12-13", 2),
      choice("Comment s'écrit $2^n-1$ en base 2 ?", ["Avec $n$ chiffres 1", "Avec $n$ chiffres 0", "Comme $10\\ldots01$"], 0, "$2^n-1=2^{n-1}+\\cdots+2+1$.", "Exercice 5 • page 13", 2),
      short("Quelle est la valeur décimale de $11111_2$ ?", ["31"], "$2^5-1=31$.", "Exercice 5 • page 13"),
      choice("Pourquoi $11111_2$ divise-t-il $1111111111_2$ ?", ["$2^{10}-1=(2^5-1)(2^5+1)$", "Parce que les deux nombres ont des 1", "Parce que 10 divise 5"], 0, "On utilise une différence de deux carrés.", "Exercice 5 • page 13", 3),
      choice("Quelle formule donne un nombre de $n$ chiffres 1 en base $a$ ?", ["$\\frac{a^n-1}{a-1}$", "$a^n-1$", "$\\frac{a^{n-1}}{a}$"], 0, "C'est la somme géométrique $1+a+\\cdots+a^{n-1}$.", "Exercice 6 • page 13", 2),
      choice("Si $q$ est impair, que vaut $q^2$ modulo 8 ?", ["1", "0", "4"], 0, "Le carré de tout impair est congru à 1 modulo 8.", "Exercice 7 • page 14", 2),
      choice("La réciproque « $q^2$ impair implique $q$ impair » est-elle vraie ?", ["Oui", "Non"], 0, "Si q était pair, son carré serait pair.", "Exercice 7 • page 14"),
      choice("Si $n$ est premier, pourquoi $n+7$ est-il composé pour $n>2$ ?", ["Il est pair et supérieur à 2", "Il est multiple de 7", "Il est toujours égal à 9"], 0, "Un premier supérieur à 2 est impair et 7 est impair.", "Exercice 8 • page 14", 2),
      choice("Quelle factorisation est correcte ?", ["$a^4+a^2+1=(a^2-a+1)(a^2+a+1)$", "$a^4+a^2+1=(a^2+1)^2$", "$a^4+a^2+1=(a+1)^4$"], 0, "C'est une différence de carrés après avoir écrit $(a^2+1)^2-a^2$.", "Exercice 8 • pages 14-15", 2),
      choice("Pour quelles valeurs entières $a^4+a^2+1$ est-il premier ?", ["$a=-1$ ou $a=1$", "$a=0$ uniquement", "Pour tout $a$"], 0, "Il vaut 3 pour ±1 et se factorise non trivialement dans les autres cas non nuls.", "Exercice 8 corrigé • pages 14-15", 3),
      choice("Résous $x+5\\equiv3[8]$.", ["$x\\equiv6[8]$", "$x\\equiv2[8]$", "$x\\equiv0[8]$"], 0, "$x\\equiv-2\\equiv6[8]$.", "Exercice 8 • page 15", 2),
      choice("Résous $3x\\equiv5[8]$.", ["$x\\equiv7[8]$", "$x\\equiv5[8]$", "$x\\equiv3[8]$"], 0, "$3\\times7=21\\equiv5[8]$.", "Exercice 8 • page 15", 2),
      choice("Si $2\\mid(a^2+b^2)$, quelle conclusion officielle obtient-on ?", ["$2\\mid(a+b)^2$", "$2\\mid ab$ dans tous les cas", "$a=b$"], 0, "$(a+b)^2=a^2+b^2+2ab$.", "Exercice 8 • page 15", 2),
    ],
  },
  {
    id: "affine-coding-mission",
    title: "Mission : codage affine modulo 26",
    summary: "Coder, prouver la bijectivité et décoder des mots avec un décalage de dix lettres.",
    pages: "15-16",
    section: "D. Exercice 9 - Codage affine",
    durationMinutes: 32,
    kind: "challenge",
    body: String.raw`## Alphabet numérique

On associe à chaque lettre un entier de $0$ à $25$ :

$$A=0,\ B=1,\ldots,Z=25.$$

Le codage est défini par

$$f(x)\equiv x+10\pmod{26},\qquad0\le f(x)<26.$$

Il s'agit d'un décalage de dix positions.

## Coder MATHS

| Lettre | $x$ | $x+10$ modulo 26 | Lettre codée |
|---|---:|---:|---|
| M | 12 | 22 | W |
| A | 0 | 10 | K |
| T | 19 | 3 | D |
| H | 7 | 17 | R |
| S | 18 | 2 | C |

Ainsi :

$$\boxed{\text{MATHS}\longmapsto\text{WKDRC}}.$$

## Pourquoi chaque lettre possède-t-elle un unique antécédent ?

Résoudre $f(x)=a$ revient à écrire

$$x+10\equiv a[26],$$

donc

$$x\equiv a-10\equiv a+16[26].$$

Il existe exactement un représentant de cette classe entre $0$ et $25$. Le codage est donc bijectif.

## Décoder

Pour décoder, on ajoute $16$ modulo 26. Ainsi :

$$\boxed{\text{VIWK}\longmapsto\text{LYMA}}.$$

> **Astuce mémoire de Davy.** Coder : $+10$. Décoder : $-10$, soit $+16$ modulo 26.`,
    keyPoint: "f(x)=x+10 [26] et f⁻¹(y)=y+16 [26].",
    example: "$M=12\\mapsto22=W$ ; $V=21\\mapsto11=L$ au décodage.",
    methodSteps: [
      "Remplace chaque lettre par son rang entre 0 et 25.",
      "Pour coder, ajoute 10 et réduis modulo 26.",
      "Pour décoder, ajoute 16 et réduis modulo 26.",
      "Reconvertis chaque entier en lettre.",
    ],
    timeline: [
      { label: "Numériser", detail: "Associer A à 0, B à 1, …, Z à 25." },
      { label: "Décaler", detail: "Ajouter 10 pour le codage." },
      { label: "Réduire", detail: "Prendre le reste entre 0 et 25." },
      { label: "Inverser", detail: "Ajouter 16 pour revenir au texte initial." },
    ],
    corrections: [
      "Page 16 : l'énoncé demande de décoder VIWK, mais la conclusion de la correction écrit VIWIK. Le mot étudié est bien VIWK et il se décode en LYMA.",
    ],
    questions: [
      short("Quel entier représente la lettre M ?", ["12"], "Avec A=0, M occupe le rang 12.", "Exercice 9 • page 16"),
      short("Quel est le code numérique de M après ajout de 10 modulo 26 ?", ["22"], "$12+10=22$.", "Exercice 9 • page 16"),
      choice("Quelle lettre code M ?", ["W", "V", "X"], 0, "$W$ correspond à 22.", "Exercice 9 • page 16"),
      choice("Quel est le mot codé à partir de MATHS ?", ["WKDRC", "WKDCR", "VIWK"], 0, "Les cinq images sont 22,10,3,17,2.", "Exercice 9 • page 16", 2),
      choice("Quelle congruence permet de décoder une valeur $a$ ?", ["$x\\equiv a+16[26]$", "$x\\equiv a+10[26]$", "$x\\equiv16a[26]$"], 0, "$-10\\equiv16[26]$.", "Exercice 9 • page 16", 2),
      choice("Pourquoi l'antécédent est-il unique dans l'alphabet ?", ["Chaque classe modulo 26 possède un seul représentant entre 0 et 25", "26 est premier", "10 divise 26"], 0, "L'unicité vient du choix du représentant, pas de la primalité.", "Exercice 9 • page 16", 2),
      short("Quelle lettre obtient-on en décodant V ?", ["L"], "$21+16=37\\equiv11[26]$ et 11 représente L.", "Exercice 9 • page 16"),
      choice("Quel mot obtient-on en décodant VIWK ?", ["LYMA", "LYMIA", "MATHS"], 0, "Les antécédents sont 11,24,12,0.", "Exercice 9 corrigé • page 16", 3),
    ],
  },
  {
    id: "exponential-coding-mission",
    title: "Mission finale : codage exponentiel modulo 29",
    summary: "Utiliser Fermat et un exposant inverse pour coder et décoder avec la fonction cube modulo 29.",
    pages: "16-19",
    section: "D. Exercice 10 - Codage exponentiel",
    durationMinutes: 48,
    kind: "challenge",
    body: String.raw`## Alphabet étendu

On utilise les 29 symboles :

$$A=0,\ldots,Z=25,\quad\alpha=26,\quad\beta=27,\quad\gamma=28.$$

Le codage est

$$f(x)\equiv x^3\pmod{29},\qquad0\le f(x)<29.$$

## Exemples de codage

Pour MER :

$$12^3\equiv17,\qquad4^3\equiv6,\qquad17^3\equiv12\pmod{29},$$

donc

$$\boxed{\text{MER}\longmapsto\text{RGM}}.$$

Pour LYCEE :

$$11^3\equiv26,\quad24^3\equiv20,\quad2^3\equiv8,\quad4^3\equiv6,$$

donc

$$\boxed{\text{LYCEE}\longmapsto\alpha\text{UIGG}}.$$

## Trouver l'exposant de décodage

Le petit théorème de Fermat donne, pour $x\not\equiv0[29]$ :

$$x^{28}\equiv1[29].$$

Or

$$3\times19-28\times2=1.$$

Ainsi

$$3\times19=56+1.$$

Si $y\equiv x^3[29]$, alors

$$y^{19}\equiv x^{57}=x(x^{28})^2\equiv x[29].$$

Pour $x=0$, la relation est également vraie directement. L'exposant $19$ permet donc de décoder :

$$\boxed{x\equiv y^{19}[29]}.$$

Cette relation prouve aussi que $f$ est injective, donc bijective sur l'ensemble fini des 29 symboles.

## Décodages officiels

En appliquant $y^{19}$ modulo 29 :

$$\boxed{\text{TW}\beta\text{TIG}\longmapsto\text{INDICE}},$$

$$\boxed{\text{ZM}\alpha\text{R}\longmapsto\text{URLM}}.$$

> **Astuce mémoire de Davy.** Pour inverser la puissance 3, cherche un exposant $e$ tel que $3e\equiv1[28]$. Ici $e=19$.

> **Point de vigilance.** Le petit théorème de Fermat s'applique aux valeurs non nulles modulo 29 ; le cas $0$ se traite séparément en une ligne.`,
    keyPoint: "y≡x³ [29] ⟹ x≡y¹⁹ [29], car 3×19≡1 [28].",
    example: "$12^3=1728\\equiv17[29]$, donc M se code R.",
    methodSteps: [
      "Transforme chaque symbole en un entier de 0 à 28.",
      "Pour coder, calcule x³ puis réduis modulo 29.",
      "Pour décoder, calcule y¹⁹ par réductions successives.",
      "Traite 0 séparément et reconvertis le reste en symbole.",
    ],
    timeline: [
      { label: "Coder", detail: "Élever le rang au cube modulo 29." },
      { label: "Chercher l'inverse", detail: "Résoudre 3e≡1 modulo 28." },
      { label: "Appliquer Fermat", detail: "Utiliser x²⁸≡1 pour les rangs non nuls." },
      { label: "Décoder", detail: "Calculer y¹⁹ modulo 29 puis lire le symbole." },
    ],
    corrections: [
      "Pages 17-19 : l'énoncé donne TWβTIG, mais la table de correction inverse les deux dernières lettres en TWβTGI tout en annonçant INDICE. L'ordre cohérent est TWβTIG.",
      "Page 18 : la preuve affirme que 29 ne divise pas x parce que x<29, ce qui oublie x=0. Pour x=0, l'identité y^19≡x est immédiate ; Fermat s'applique ensuite aux valeurs de 1 à 28.",
      "Page 18 : le repérage des sous-questions glisse après la question b ; la preuve d'injectivité correspond aux questions c et d, et l'identité y^19≡x à la question e.",
    ],
    questions: [
      choice("Combien de symboles contient l'alphabet étendu ?", ["29", "26", "28"], 0, "On ajoute α, β et γ aux 26 lettres.", "Exercice 10 • pages 16-17"),
      short("Quel entier représente $\\alpha$ ?", ["26"], "$\\alpha$ vient après Z=25.", "Exercice 10 • page 17"),
      short("Quel est le reste de $12^3$ par 29 ?", ["17"], "$1728=29\\times59+17$.", "Exercice 10 • page 17", 2),
      choice("Quel mot code MER ?", ["RGM", "MER", "URL"], 0, "Les cubes des rangs donnent 17,6,12.", "Exercice 10 • page 17", 2),
      choice("Quel mot code LYCEE ?", ["$\\alpha$UIGG", "$\\beta$UIGG", "LYCEE"], 0, "Les images sont 26,20,8,6,6.", "Exercice 10 • page 17", 3),
      short("Calcule $3\\times19-28\\times2$.", ["1"], "$57-56=1$.", "Exercice 10-b • page 17"),
      choice("Que prouve cette relation sur 3 et 28 ?", ["Ils sont premiers entre eux", "3 divise 28", "28 est premier"], 0, "C'est une relation de Bézout.", "Exercice 10-b • pages 17-18", 2),
      choice("Quel exposant inverse le cube modulo 29 ?", ["19", "3", "28"], 0, "$3\\times19\\equiv1[28]$.", "Exercice 10-e • page 18", 2),
      choice("Pourquoi traite-t-on $x=0$ séparément ?", ["Fermat exige que x ne soit pas divisible par 29", "0 n'appartient pas à l'alphabet", "0 n'a pas de cube"], 0, "Pour x=0, l'identité est vraie directement.", "Exercice 10 corrigé • page 18", 2),
      choice("Si $f(x)=f(x')$, quelle conclusion obtient-on après avoir élevé à la puissance 19 ?", ["$x\\equiv x'[29]$", "$x+x'\\equiv0[29]$", "$x^3=x'$"], 0, "L'exposant 19 annule l'effet du cube modulo 29.", "Exercice 10-c-d • page 18", 3),
      choice("Pourquoi cette congruence implique-t-elle $x=x'$ dans l'alphabet ?", ["Les deux nombres sont entre 0 et 28", "29 divise tous les entiers", "Ils sont tous les deux premiers"], 0, "Deux représentants de la même classe dans cet intervalle sont égaux.", "Exercice 10-c-d • page 18", 2),
      choice("Quel mot cohérent décode TW$\\beta$TIG ?", ["INDICE", "INDIEC", "URLM"], 0, "Les antécédents sont 8,13,3,8,2,4.", "Exercice 10 corrigé • pages 18-19", 3),
      choice("Quel mot décode ZM$\\alpha$R ?", ["URLM", "INDICE", "MER"], 0, "Les antécédents sont 20,17,11,12.", "Exercice 10 • page 19", 3),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCDivisibilityPath: LearningPath = {
  id: "terminale-c-math-l03-divisibility",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 3, title: "Arithmétique" },
  chapterNumber: 3,
  title: "Divisibilité dans ℤ",
  description: "Le cours officiel intégral, sans la situation d'apprentissage, enrichi de méthodes, exercices expliqués et missions de codage.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Raisonner avec la divisibilité, les restes et les congruences",
    "Convertir des écritures entre plusieurs bases de numération",
    "Reconnaître les nombres premiers et exploiter leur décomposition",
    "Résoudre des stratégies et des problèmes de codage par l'arithmétique modulaire",
  ],
  modules: [{
    id: "official-course",
    title: "Leçon officielle",
    description: "Douze niveaux progressifs, des bases de la divisibilité aux missions de codage.",
    lessons: builtLevels,
  }],
};
