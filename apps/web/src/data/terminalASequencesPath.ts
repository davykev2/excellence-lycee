import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TA Maths leçon 05 Suites numériques.pdf";

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
  xp: number;
  kind?: LessonKind;
  body: string;
  keyPoint: string;
  example: string;
  methodSteps: string[];
  timeline: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
  /** Quand une figure aide à comprendre, la courbe interactive remplace la frise de repères. */
  curve?: CurveLessonInteraction;
  questions: LessonQuestion[];
  corrections?: string[];
}

function officialLevel(index: number, seed: OfficialLevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: {
      documentTitle: sourceDocument,
      pages: seed.pages,
      section: seed.section,
      fidelity: seed.corrections?.length ? "faithful-corrected" : "faithful",
      corrections: seed.corrections ?? [],
    },
    concept: {
      eyebrow: `Niveau ${index} • Cours officiel`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.curve ?? {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Suivre le raisonnement",
      instruction: "Parcours les étapes essentielles de cette partie avant de passer à la méthode.",
      observation: "Chaque repère reprend le contenu du cours sans remplacer les définitions et propriétés.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Applique cette démarche aux exercices du document source.",
      steps: seed.methodSteps,
      example: {
        prompt: "Exemple du cours",
        work: seed.example,
        result: seed.keyPoint,
      },
      tip: "Écris toujours la propriété utilisée avant le calcul lorsque la consigne demande de justifier.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: OfficialLevelSeed[] = [
  {
    id: "arithmetic-sequences",
    title: "Définition d'une suite arithmétique",
    summary: "Reconnaître une relation de récurrence à différence constante.",
    pages: "1-2",
    section: "I-1. Définition",
    durationMinutes: 15,
    xp: 50,
    body: String.raw`## Définition

Une suite numérique $(u_n)$ est dite **arithmétique** lorsque son premier terme est donné et que chaque terme est la somme du terme qui le précède et d'une constante $r$ appelée la **raison** :

$$u_{n+1}=u_n+r$$

**Remarques.**

- Une suite arithmétique peut être définie à partir d'un rang $n_0>0$.
- $(u_n)$ est arithmétique de raison $r$ lorsque, pour tout entier $n$ : $u_{n+1}-u_n=r$.

### Exemple du cours

La suite définie par $u_0=125$ et $u_{n+1}=u_n+250$ est arithmétique de raison $250$ et de premier terme $125$.

### Exercice de fixation entièrement rédigé

Soit $(u_n)$ définie par $u_3=2$ et $u_{n+1}=u_n+7$ pour $n\ge3$.

**1)** $u_4=u_3+7=2+7=9$ puis $u_5=u_4+7=9+7=16$.

**2)** Comme $u_{n+1}=u_n+7$, la suite $(u_n)_{n\ge3}$ est **arithmétique**, de raison $7$ et de premier terme $u_3=2$.

### Exercice d'application rédigé (exercice 1)

| Affirmation | Réponse | Pourquoi |
|---|---|---|
| Si $u_{n+1}=2u_n+3$, la suite n'est ni arithmétique ni géométrique | **Vrai** | on multiplie **et** on ajoute |
| Si $u_{n+1}+u_n=r$ constant, la suite est arithmétique | **Faux** | la définition exige $u_{n+1}-u_n=r$ |
| Si $u_{n+1}\times u_n=q$ constant, la suite est géométrique | **Faux** | la définition exige $u_{n+1}=q\,u_n$ |
| Si $(u_n)$ est arithmétique, $\dfrac{u_{n-1}+u_{n+1}}{2}=u_n$ | **Vrai** | chaque terme est la moyenne de ses voisins |

> **Erreur fréquente.** C'est la **différence** $u_{n+1}-u_n$ qui doit être constante, pas la somme ni le produit. Une relation comme $u_{n+1}=2u_n+3$ mélange les deux mondes : elle n'est ni arithmétique ni géométrique.

> **Astuce mémoire de Davy.** « Arithmétique = on **ajoute** toujours le même nombre. » Pour la reconnaître, calcule $u_{n+1}-u_n$ : si le résultat ne dépend pas de $n$, c'est gagné.`,
    keyPoint: "Suite arithmétique : u_(n+1) = u_n + r.",
    example: "$u_3=2$ et $u_{n+1}=u_n+7$ donnent $u_4=9$ et $u_5=16$.",
    methodSteps: [
      "Repère le premier terme donné.",
      "Calcule les termes suivants avec la récurrence.",
      "Identifie la raison constante.",
    ],
    timeline: [
      { label: "Récurrence", detail: "Chaque terme = le précédent + la raison r." },
      { label: "Vérification", detail: "u(n+1) − u(n) doit être constant." },
      { label: "Identification", detail: "Annoncer premier terme et raison." },
    ],
    questions: [
      short("Avec $u_3=2$ et $u_{n+1}=u_n+7$, calcule $u_4$.", ["9"], "$2+7=9$.", "Exercice de fixation, question 1, page 1"),
      short("Calcule $u_5$.", ["16"], "$u_5=u_4+7=16$.", "Exercice de fixation, question 1, pages 1-2"),
      short("Quelle est la raison de cette suite ?", ["7"], "Le nombre ajouté à chaque étape est 7.", "Exercice de fixation, question 2, page 2"),
      choice("Si $u_{n+1}=2u_n+3$, alors $(u_n)$ n'est ni arithmétique ni géométrique.", ["Vrai", "Faux"], 0, "On multiplie et on ajoute : aucune des deux définitions ne s'applique.", "Exercice d'application 1, affirmation 1, page 6"),
      choice("Si $u_{n+1}+u_n=r$ avec $r$ constant, alors $(u_n)$ est arithmétique.", ["Vrai", "Faux"], 1, "La définition exige $u_{n+1}-u_n=r$, pas la somme.", "Exercice d'application 1, affirmation 2, page 6"),
      choice("Si $(u_n)$ est arithmétique, alors $\\frac{u_{n-1}+u_{n+1}}{2}=u_n$.", ["Vrai", "Faux"], 0, "Chaque terme est la moyenne arithmétique de ses deux voisins.", "Exercice d'application 1, affirmation 4, page 6", 2),
    ],
  },
  {
    id: "arithmetic-general-term",
    title: "Terme général d'une suite arithmétique",
    summary: "Exprimer un terme en fonction du rang à partir d'un terme connu.",
    pages: "2, 6",
    section: "I-2. Expression du terme général",
    durationMinutes: 18,
    xp: 55,
    body: String.raw`## Propriété

Si $(u_n)$ est arithmétique de premier terme $u_0$ et de raison $r$, alors pour tout entier naturel $n$ :

$$u_n=u_0+nr$$

**En général**, pour tous entiers naturels $n$ et $p$ :

$$u_n=u_p+(n-p)r$$

### Exercice de fixation entièrement rédigé

Soit $(v_n)_{n\ge1}$ arithmétique avec $v_1=1350$ et $v_{n+1}=v_n+200$.

$$v_n=v_1+(n-1)r=1350+(n-1)\times200=1150+200n$$

$$v_{21}=1150+200\times21=5350$$

### Exercice d'application rédigé (exercice 2)

Soit $u_n=5n-4$ pour tout entier naturel $n$.

**1)** $u_{n+1}-u_n=5(n+1)-4-(5n-4)=5$ : la suite est **arithmétique**.

**2)** Premier terme $u_0=-4$, raison $r=5$.

> **Erreur fréquente.** Quand la suite commence à $v_1$ (et non $v_0$), le terme général est $v_1+(n-1)r$ : il y a $n-1$ pas entre $v_1$ et $v_n$, pas $n$. Compte les **pas**, pas les termes.

> **Astuce mémoire de Davy.** « Pour aller du rang $p$ au rang $n$, on fait $n-p$ pas de raison $r$. » Cette lecture t'évite d'apprendre deux formules : celle en $u_0$ n'est que le cas $p=0$.`,
    keyPoint: "u_n = u_p + (n-p)r.",
    example: "$v_1=1350$, $r=200$ : $v_n=1350+(n-1)200=1150+200n$.",
    methodSteps: [
      "Choisis le terme connu u_p.",
      "Compte n − p pas de raison.",
      "Applique u_n = u_p + (n−p)r.",
    ],
    timeline: [
      { label: "Point de départ", detail: "Choisir le terme connu u(p)." },
      { label: "Nombre de pas", detail: "Il y a n − p pas entre les rangs p et n." },
      { label: "Formule", detail: "u(n) = u(p) + (n−p)·r." },
    ],
    questions: [
      choice("Pour $v_1=1350$ et $r=200$, quelle expression donne $v_n$ ?", ["$1350+200n$", "$1150+200n$", "$1550+200n$", "$1350n+200$"], 1, "$v_n=1350+(n-1)200$.", "Exercice de fixation, page 2"),
      short("Calcule $v_{21}$.", ["5350", "5 350"], "$1150+200\\times21=5350$.", "Exercice de fixation, page 2"),
      choice("La suite $u_n=5n-4$ est arithmétique car :", ["$u_{n+1}-u_n=5$ pour tout $n$", "$u_0=-4$", "$u_n$ contient $n$", "$u_{n+1}/u_n$ est constant"], 0, "La différence de deux termes consécutifs est constante.", "Exercice d'application 2, question 1, page 6"),
      short("Donne le premier terme de la suite $u_n=5n-4$.", ["-4", "−4"], "$u_0=5\\times0-4=-4$.", "Exercice d'application 2, question 2, page 6"),
      short("Donne sa raison.", ["5"], "$u_{n+1}-u_n=5$.", "Exercice d'application 2, question 2, page 6"),
    ],
  },
  {
    id: "arithmetic-variation",
    title: "Sens de variation d'une suite arithmétique",
    summary: "Déduire les variations du signe de la raison.",
    pages: "2",
    section: "I-3. Sens de variation",
    durationMinutes: 12,
    xp: 45,
    body: String.raw`## Propriété

| Raison | Sens de variation |
|---|---|
| $r>0$ | la suite est **croissante** |
| $r<0$ | la suite est **décroissante** |
| $r=0$ | la suite est **constante** |

Cette conclusion vient directement de $u_{n+1}-u_n=r$ : le signe de la différence est celui de la raison.

### Exercice de fixation entièrement rédigé

**a)** $r=-2<0$ : la suite est décroissante.

**b)** $r=0$ : la suite est constante.

**c)** $r=10>0$ : la suite est croissante.

> **Erreur fréquente.** Ne confonds pas avec les suites géométriques : pour une suite arithmétique, on compare la raison à **0** ; pour une suite géométrique à termes positifs, on la compare à **1**.

> **Astuce mémoire de Davy.** « Le signe de $r$, c'est la pente de l'escalier. » Raison positive : l'escalier monte ; négative : il descend ; nulle : c'est un palier.`,
    keyPoint: "Le signe de r détermine entièrement les variations.",
    example: "$r=-2$ : décroissante ; $r=0$ : constante ; $r=10$ : croissante.",
    methodSteps: [
      "Identifie la raison.",
      "Compare-la à zéro.",
      "Annonce le sens de variation.",
    ],
    timeline: [
      { label: "Raison", detail: "Lire r dans la récurrence." },
      { label: "Signe", detail: "Comparer r à 0." },
      { label: "Conclusion", detail: "Croissante, décroissante ou constante." },
    ],
    questions: [
      choice("Si $r=-2$, la suite est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 1, "Une raison négative donne une suite décroissante.", "Exercice de fixation a, page 2"),
      choice("Si $r=0$, la suite est :", ["Croissante", "Décroissante", "Constante", "Non définie"], 2, "Tous les termes sont égaux.", "Exercice de fixation b, page 2"),
      choice("Si $r=10$, la suite est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 0, "La raison est positive.", "Exercice de fixation c, page 2"),
      choice("La suite $u_n=5n-4$ est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 0, "Sa raison 5 est positive.", "Exercice d'application 2, question 3, page 6"),
    ],
  },
  {
    id: "arithmetic-sums",
    title: "Somme de termes arithmétiques consécutifs",
    summary: "Calculer une somme avec le nombre de termes et la moyenne du premier et du dernier.",
    pages: "2-3, 6-8",
    section: "I-4. Somme de termes consécutifs",
    durationMinutes: 22,
    xp: 65,
    body: String.raw`## Propriété

Pour tous entiers naturels $n\ge p$ :

$$u_p+u_{p+1}+\cdots+u_n=(n-p+1)\times\frac{u_p+u_n}{2}$$

**Remarque.** La somme de termes consécutifs d'une suite arithmétique se retient ainsi :

$$S=(\text{nombre de termes})\times\frac{\text{premier terme}+\text{dernier terme}}{2}$$

### Exercice de fixation entièrement rédigé

Soit $(u_n)$ arithmétique avec $u_1=-1$ et $r=3$. Calculons la somme des 26 premiers termes :

$$u_{26}=u_1+25r=-1+75=74$$

$$u_1+u_2+\cdots+u_{26}=26\times\frac{-1+74}{2}=26\times\frac{73}{2}=949$$

### Exercice d'application rédigé (exercice 2, question 4)

Pour $u_n=5n-4$ : $u_{15}=71$, donc

$$u_0+u_1+\cdots+u_{15}=16\times\frac{-4+71}{2}=8\times67=536$$

### Exercice de renforcement rédigé (exercice 4 — le salaire de M. Yao)

M. Yao est embauché au 1ᵉʳ janvier 2015 à $125\,000$ F par mois ; chaque année son salaire mensuel augmente de $12\,000$ F. La suite $(U_n)$ des salaires est arithmétique : $U_{n+1}=U_n+12\,000$.

**1)** $U_1=137\,000$, $U_2=149\,000$, $U_3=161\,000$.

**2)** Au 1ᵉʳ janvier 2020 : $U_5=125\,000+5\times12\,000=185\,000$ F.

**4)** Sur les cinq premières années, l'entreprise verse $12(U_0+U_1+U_2+U_3+U_4)$ :

$$U_0+\cdots+U_4=5\times\frac{125\,000+173\,000}{2}=745\,000\qquad\text{soit}\qquad 12\times745\,000=8\,940\,000\ \text{F}$$

> **Erreur fréquente.** Le nombre de termes de $u_p+\cdots+u_n$ est $n-p+1$, pas $n-p$ : de $u_0$ à $u_{15}$, il y a **16** termes. L'oubli du « $+1$ » est l'erreur classique de ce chapitre.

> **Astuce mémoire de Davy.** « Nombre de termes × moyenne des extrêmes. » Trois ingrédients à préparer avant la formule : le premier terme, le dernier terme, et le compte exact des termes.`,
    keyPoint: "Somme = nombre de termes × (premier + dernier)/2.",
    example: "$u_1=-1$, $r=3$ donnent $u_{26}=74$ et $u_1+\\cdots+u_{26}=949$.",
    methodSteps: [
      "Calcule le dernier terme.",
      "Compte les termes avec n − p + 1.",
      "Multiplie par la demi-somme des extrêmes.",
    ],
    timeline: [
      { label: "Dernier terme", detail: "Le calculer avec le terme général." },
      { label: "Compter", detail: "n − p + 1 termes de u(p) à u(n)." },
      { label: "Formule", detail: "Nombre de termes × (premier + dernier)/2." },
    ],
    questions: [
      short("Avec $u_1=-1$ et $r=3$, calcule $u_{26}$.", ["74"], "$-1+25\\times3=74$.", "Exercice de fixation, page 3"),
      short("Calcule $u_1+u_2+\\cdots+u_{26}$.", ["949"], "$26\\times(-1+74)/2=949$.", "Exercice de fixation, page 3", 2),
      short("Pour $u_n=5n-4$, calcule la somme des seize premiers termes.", ["536"], "$16\\times(-4+71)/2=536$.", "Exercice d'application 2, question 4, pages 6-7", 2),
      short("Salaire de M. Yao : calcule $U_5$, son salaire mensuel au 1ᵉʳ janvier 2020.", ["185000", "185 000"], "$125\\,000+5\\times12\\,000=185\\,000$.", "Exercice de renforcement 4, question 2, page 7"),
      short("Quelle somme totale l'entreprise verse-t-elle sur les cinq premières années ?", ["8940000", "8 940 000"], "$12\\times745\\,000=8\\,940\\,000$ F.", "Exercice de renforcement 4, question 4, pages 7-8", 2),
    ],
  },
  {
    id: "geometric-sequences",
    title: "Définition d'une suite géométrique",
    summary: "Reconnaître une relation de récurrence à quotient constant.",
    pages: "3",
    section: "II-1. Définition",
    durationMinutes: 15,
    xp: 50,
    body: String.raw`## Définition

Une suite numérique $(v_n)$ est dite **géométrique** lorsque son premier terme est donné et que chaque terme est le produit du terme qui le précède par une constante $q$ appelée la **raison** :

$$v_{n+1}=q\,v_n$$

**Remarques.**

- Une suite géométrique peut être définie à partir d'un rang $n_0>0$.
- Si les termes sont non nuls, on peut vérifier $\dfrac{v_{n+1}}{v_n}=q$.

### Exercice de fixation entièrement rédigé

On donne $t_0=1\,000\,000$ et $t_{n+1}=0{,}9\,t_n$.

**1)** $t_1=0{,}9\times1\,000\,000=900\,000$ puis $t_2=0{,}9\times900\,000=810\,000$.

**2)** Par définition, $(t_n)$ est la suite **géométrique** de premier terme $1\,000\,000$ et de raison $0{,}9$.

> **Erreur fréquente.** Pour prouver qu'une suite est géométrique, calcule le **quotient** $\dfrac{v_{n+1}}{v_n}$ et vérifie qu'il ne dépend pas de $n$ — le produit $v_{n+1}\times v_n$ constant ne prouve rien (voir l'exercice 1).

> **Astuce mémoire de Davy.** « Géométrique = on **multiplie** toujours par le même nombre. » Une baisse de 10 % chaque mois ? C'est une multiplication par 0,9 : les pourcentages répétés cachent presque toujours une suite géométrique.`,
    keyPoint: "Suite géométrique : v_(n+1) = q v_n.",
    example: "$t_0=1\\,000\\,000$ et $t_{n+1}=0,9t_n$ donnent $t_1=900\\,000$, $t_2=810\\,000$.",
    methodSteps: [
      "Repère le premier terme.",
      "Multiplie par q pour avancer d'un rang.",
      "Identifie la raison constante.",
    ],
    timeline: [
      { label: "Récurrence", detail: "Chaque terme = le précédent × la raison q." },
      { label: "Vérification", detail: "v(n+1)/v(n) doit être constant." },
      { label: "Identification", detail: "Annoncer premier terme et raison." },
    ],
    questions: [
      short("Avec $t_0=1\\,000\\,000$ et $q=0,9$, calcule $t_1$.", ["900000", "900 000"], "$0,9\\times1\\,000\\,000=900\\,000$.", "Exercice de fixation, question 1, page 3"),
      short("Calcule $t_2$.", ["810000", "810 000"], "$0,9\\times900\\,000=810\\,000$.", "Exercice de fixation, question 1, page 3"),
      short("Quelle est la raison de cette suite ?", ["0,9", "0.9"], "Chaque terme est multiplié par 0,9.", "Exercice de fixation, question 2, page 3"),
      choice("La suite $V_n=3^n$ est géométrique car :", ["$V_{n+1}/V_n=3$ pour tout $n$", "$V_0=1$", "$3^n$ grandit vite", "$V_{n+1}-V_n$ est constant"], 0, "$3^{n+1}/3^n=3$ : le quotient est constant.", "Exercice d'application 3, question 1, page 7"),
      short("Donne le premier terme de la suite $V_n=3^n$.", ["1"], "$V_0=3^0=1$.", "Exercice d'application 3, question 2, page 7"),
    ],
  },
  {
    id: "geometric-general-term",
    title: "Terme général d'une suite géométrique",
    summary: "Exprimer un terme à partir d'un terme connu et de la raison.",
    pages: "3-4",
    section: "II-2. Expression du terme général",
    durationMinutes: 18,
    xp: 55,
    body: String.raw`## Propriété

Si $(v_n)$ est géométrique de premier terme $v_0$ et de raison $q$ non nulle, alors pour tout entier naturel $n$ :

$$v_n=v_0\,q^n$$

**En général**, pour tous entiers naturels $p\le n$ :

$$v_n=v_p\times q^{n-p}$$

### Exercice de fixation entièrement rédigé

Soit $(v_n)$ géométrique de raison $q=\dfrac12$ avec $v_3=12$. Calculons $v_7$ :

$$v_7=v_3\times q^{7-3}=12\times\left(\frac12\right)^4=\frac{12}{16}=\frac34$$

> **Erreur fréquente.** L'exposant est $n-p$, le **nombre de pas** entre les deux rangs — pas $n$. De $v_3$ à $v_7$, on multiplie 4 fois par $q$, pas 7 fois.

> **Astuce mémoire de Davy.** « Chaque pas multiplie par $q$ ; $n-p$ pas multiplient par $q^{n-p}$. » Exactement la même logique que le $+(n-p)r$ des suites arithmétiques, avec × à la place de +.`,
    keyPoint: "v_n = v_p q^(n-p).",
    example: "Si $q=1/2$ et $v_3=12$, alors $v_7=12(1/2)^4=3/4$.",
    methodSteps: [
      "Repère v_p, q, p et n.",
      "Calcule l'exposant n − p.",
      "Applique puis simplifie.",
    ],
    timeline: [
      { label: "Point de départ", detail: "Choisir le terme connu v(p)." },
      { label: "Nombre de pas", detail: "n − p multiplications par q." },
      { label: "Formule", detail: "v(n) = v(p) × q^(n−p)." },
    ],
    questions: [
      short("Si $q=1/2$ et $v_3=12$, calcule $v_7$.", ["3/4", "0,75", "0.75"], "$12(1/2)^{7-3}=12/16=3/4$.", "Exercice de fixation, pages 3-4", 2),
      choice("Quelle formule générale est correcte ?", ["$v_n=v_p+q^{n-p}$", "$v_n=v_pq^{n-p}$", "$v_n=qv_p+n-p$", "$v_n=v_p(n-p)q$"], 1, "Chaque pas multiplie par $q$.", "Propriété, page 3"),
      choice("Le terme général de la suite géométrique de premier terme $2$ et de raison $\\frac13$ est :", ["$u_n=\\frac{2}{3^n}$", "$u_n=\\frac{2}{3n}$", "$u_n=2-\\frac{n}{3}$", "$u_n=\\frac{3}{2^n}$"], 0, "$u_n=2\\times(1/3)^n=2/3^n$.", "Exercice de renforcement 5, question 4, page 8", 2),
    ],
  },
  {
    id: "geometric-variation",
    title: "Sens de variation d'une suite géométrique positive",
    summary: "Étudier les variations selon la position de la raison positive par rapport à 1.",
    pages: "4",
    section: "II-3. Sens de variation",
    durationMinutes: 12,
    xp: 45,
    body: String.raw`## Propriété

Pour une suite géométrique **à termes positifs** de raison $q$ :

| Raison | Sens de variation |
|---|---|
| $0<q<1$ | la suite est **décroissante** |
| $q>1$ | la suite est **croissante** |
| $q=1$ | la suite est **constante** |

**Remarque.** Si la raison est **négative**, la suite n'est ni croissante, ni décroissante, ni constante : ses termes changent de signe à chaque rang.

### Exercice de fixation entièrement rédigé

**a)** $v_0=0{,}5$ et $q=7$ : termes positifs et $q>1$, la suite est **croissante**.

**b)** $v_0=21$ et $q=0{,}6$ : termes positifs et $0<q<1$, la suite est **décroissante**.

**c)** $v_0=0{,}5$ et $q=1$ : la suite est **constante**.

> **Erreur fréquente.** Le seuil des suites géométriques est $1$, pas $0$ : une raison de $0{,}6$ est **positive** mais fait **décroître** la suite. Compare toujours $q$ à $1$ (après avoir vérifié la positivité des termes).

> **Astuce mémoire de Davy.** « Multiplier par plus que 1, ça grossit ; par moins que 1, ça rétrécit. » Et une raison négative fait zigzaguer les signes : aucun sens de variation.`,
    keyPoint: "Pour des termes positifs, comparer q à 1.",
    example: "$q=7$ : croissante ; $q=0,6$ : décroissante ; $q=1$ : constante.",
    methodSteps: [
      "Vérifie que les termes sont positifs.",
      "Compare q à 0 et à 1.",
      "Conclus sans oublier le cas q < 0.",
    ],
    timeline: [
      { label: "Positivité", detail: "Premier terme et raison strictement positifs." },
      { label: "Seuil 1", detail: "Comparer la raison à 1, pas à 0." },
      { label: "Cas négatif", detail: "q < 0 : ni croissante ni décroissante." },
    ],
    questions: [
      choice("Avec $v_0=0,5$ et $q=7$, la suite est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 0, "$q>1$ et les termes sont positifs.", "Exercice de fixation a, page 4"),
      choice("Avec $v_0=21$ et $q=0,6$, la suite est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 1, "$0<q<1$.", "Exercice de fixation b, page 4"),
      choice("Avec $q=1$, la suite est :", ["Croissante", "Décroissante", "Constante", "Impossible"], 2, "Multiplier par 1 ne change pas les termes.", "Exercice de fixation c, page 4"),
      choice("La suite géométrique de premier terme $2$ et de raison $\\frac13$ est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 1, "$0<\\frac13<1$ avec des termes positifs.", "Exercice de renforcement 5, question 3, page 8"),
      choice("La suite $V_n=3^n$ est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 0, "Sa raison 3 est supérieure à 1.", "Exercice d'application 3, question 3, page 7"),
    ],
  },
  {
    id: "geometric-sums-modeling",
    title: "Somme de termes géométriques et tableau récapitulatif",
    summary: "Calculer une somme géométrique finie et retenir la synthèse des deux familles de suites.",
    pages: "4-5, 7",
    section: "II-4 et II-5. Somme et tableau récapitulatif",
    durationMinutes: 22,
    xp: 70,
    body: String.raw`## Propriété

Pour une suite géométrique de raison $q\neq1$ et pour $n\ge p$ :

$$v_p+v_{p+1}+\cdots+v_n=v_p\times\frac{1-q^{n-p+1}}{1-q}$$

**Remarque.** La somme se retient ainsi :

$$S=(\text{premier terme})\times\frac{1-q^{\text{nombre de termes}}}{1-q}$$

### Exercice de fixation entièrement rédigé

Soit $(v_n)$ géométrique de raison $q=\dfrac12$ et $v_3=12$.

**1)** $v_3=v_1\times q^2=v_1\times\dfrac14$, donc $v_1=4\times12=48$.

**2)** $S_n=v_1+v_2+\cdots+v_n=48\times\dfrac{1-\left(\frac12\right)^n}{1-\frac12}=96\left(1-\left(\frac12\right)^n\right)$

Quand $n$ grandit, $\left(\frac12\right)^n$ s'écrase vers $0$ : la somme **s'approche de 96 sans jamais l'atteindre** — c'est ce que montre la courbe ci-dessous.

### Exercice d'application rédigé (exercice 3, question 4)

Pour $V_n=3^n$, la somme des seize premiers termes vaut :

$$V_0+V_1+\cdots+V_{15}=1\times\frac{1-3^{16}}{1-3}=\frac{3^{16}-1}{2}=\frac{43\,046\,720}{2}=21\,523\,360$$

## Tableau récapitulatif du cours

| | Suite arithmétique | Suite géométrique |
|---|---|---|
| Récurrence | $u_{n+1}=u_n+r$ | $v_{n+1}=q\,v_n$ |
| Raison | $r$ | $q$ |
| Terme général | $u_n=u_p+(n-p)r$ | $v_n=v_p\,q^{n-p}$ |
| Somme | $(n-p+1)\dfrac{u_p+u_n}{2}$ | $v_p\dfrac{1-q^{n-p+1}}{1-q}$ (si $q\neq1$) |

> **Erreur fréquente.** L'exposant de la formule de somme est le **nombre de termes** $n-p+1$, pas $n$. Et la formule exige $q\neq1$ : si $q=1$, la somme vaut simplement (nombre de termes) × (premier terme).

> **Astuce mémoire de Davy.** « Arithmétique : moyenne des extrêmes ; géométrique : un moins q puissance le compte, sur un moins q. » Récite le tableau récapitulatif : il tient sur une carte et couvre toute la leçon.`,
    keyPoint: "Somme géométrique = premier terme × (1-q^nombre de termes)/(1-q).",
    example: "Avec $q=1/2$ et $v_3=12$, on obtient $v_1=48$ puis $S_n=96(1-(1/2)^n)$.",
    methodSteps: [
      "Détermine le premier terme de la somme.",
      "Compte les termes.",
      "Applique la formule et simplifie.",
    ],
    timeline: [
      { label: "Premier terme", detail: "Le terme qui ouvre la somme." },
      { label: "Compter", detail: "n − p + 1 termes dans la somme." },
      { label: "Formule", detail: "premier × (1 − q^compte)/(1 − q)." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La somme Sₙ = 96(1 − (1/2)ⁿ) sature vers 96",
      instruction: "Augmente n : la somme des termes s'approche-t-elle d'un plafond ?",
      observation: "Chaque nouveau terme ajoute moitié moins que le précédent : la somme grimpe vite puis se colle au plafond y = 96 sans jamais le toucher.",
      formula: "S(n) = 96(1 - (1/2)^n)",
      formulaTex: "S_n=96\\left(1-\\left(\\tfrac12\\right)^n\\right)",
      rule: { kind: "affine-plus-exp", slope: 0, intercept: 96, coefficient: -96, rate: -0.6931 },
      window: { xMin: -0.5, xMax: 12, yMin: -5, yMax: 110 },
      guides: [{ kind: "horizontal", value: 96, label: "y = 96" }],
      marker: { min: 0, max: 12, step: 0.25, initial: 1 },
    },
    questions: [
      short("Avec $q=1/2$ et $v_3=12$, calcule $v_1$.", ["48"], "$v_3=v_1(1/2)^2$, donc $v_1=48$.", "Exercice de fixation, question 1, page 5"),
      choice("Quelle expression donne $S_n=v_1+\\cdots+v_n$ ?", ["$48(1-(1/2)^n)$", "$96(1-(1/2)^n)$", "$96(1+(1/2)^n)$", "$48/(1-(1/2)^n)$"], 1, "$48\\,(1-(1/2)^n)/(1-1/2)=96(1-(1/2)^n)$.", "Exercice de fixation, question 2, page 5", 2),
      short("Pour $V_n=3^n$, calcule la somme des seize premiers termes.", ["21523360", "21 523 360"], "$(3^{16}-1)/2=21\\,523\\,360$.", "Exercice d'application 3, question 4, page 7", 2),
      choice("Vers quelle valeur la somme $96(1-(1/2)^n)$ se rapproche-t-elle quand $n$ grandit ?", ["$48$", "$96$", "$192$", "Elle grandit sans limite"], 1, "$(1/2)^n$ tend vers 0, donc la somme tend vers 96.", "Exercice de fixation, question 2, page 5"),
    ],
  },
  {
    id: "savings-career-mission",
    title: "Mission finale — épargne de Mme Koffi et plans de carrière",
    summary: "Mobiliser les deux familles de suites pour trancher des décisions financières réelles.",
    pages: "5-6, 8-10",
    section: "C-Situation complexe et exercices 5-6",
    durationMinutes: 35,
    xp: 85,
    kind: "challenge",
    body: String.raw`## Mission 1 — l'épargne de Madame Koffi (situation complexe)

Madame Koffi place un capital initial de 2 millions de francs CFA au taux de **10 % d'intérêt composé annuel**. Pourra-t-elle, au bout de 25 ans, construire une maison qui coûtera 20 millions ?

Soit $u_n$ le capital à la $n$-ième année : $u_0=2\,000\,000$ et $u_{n+1}=1{,}1\,u_n$. La suite $(u_n)$ est **géométrique** de raison $1{,}1$, donc :

$$u_n=2\,000\,000\times(1{,}1)^n$$

$$u_{25}=2\,000\,000\times(1{,}1)^{25}=21\,669\,411{,}9$$

Comme $21\,669\,411{,}9>20\,000\,000$ : **le souhait de Madame Koffi sera réalisé.**

## Mission 2 — les deux plans de carrière (exercice 6)

M. Nahoua est embauché à $92\,000$ F par mois. Plan A : $+5\,000$ F chaque année (suite **arithmétique**) ; plan B : $+4{,}5\,\%$ chaque année (suite **géométrique** de raison $1{,}045$).

$$U_n=92\,000+5\,000n\qquad V_n=92\,000\times(1{,}045)^n$$

**Après 20 ans :** $U_{20}=192\,000$ F et $V_{20}=92\,000\times(1{,}045)^{20}\approx221\,877{,}69$ F.

**Cumuls sur 30 années de service** (12 salaires mensuels par an) :

$$C_1=12(U_0+\cdots+U_{29})=12\times30\times\frac{92\,000+U_{29}}{2}=180\times(92\,000+237\,000)=59\,220\,000\ \text{F}$$

$$C_2=12(V_0+\cdots+V_{29})=12\times92\,000\times\frac{(1{,}045)^{30}-1}{0{,}045}\approx67\,351\,804{,}9\ \text{F}$$

Comme $C_2>C_1$ : **le plan B est le plus avantageux** sur 30 années de service — l'augmentation en pourcentage finit toujours par dépasser l'augmentation fixe.

## Pour aller plus loin — le pont vers le logarithme (exercice 5)

Soit $u_0=2$ et $u_{n+1}=\dfrac13u_n$, d'où $u_n=\dfrac{2}{3^n}$. Pour calculer $P_n=u_0u_1\cdots u_{n-1}$, on pose $w_n=\ln(u_n)$ :

$$w_{n+1}-w_n=\ln\left(\frac13u_n\right)-\ln(u_n)=\ln\frac13$$

$(w_n)$ est **arithmétique** de premier terme $\ln2$ et de raison $\ln\frac13$ : le logarithme transforme une suite géométrique en suite arithmétique ! On en déduit :

$$P_n=e^{w_0+w_1+\cdots+w_{n-1}}=e^{\frac n2(w_0+w_{n-1})}=\left(\frac{4}{3^{n-1}}\right)^{\frac n2}$$

> **Erreur fréquente.** Pour les cumuls de salaires, chaque année compte **12 mois** : $C_1=12\times$ (somme des 30 salaires mensuels annuels). Oublier le facteur 12 — ou le confondre avec autre chose — fausse toute la comparaison.

> **Astuce mémoire de Davy.** « Augmentation fixe = arithmétique ; augmentation en % = géométrique. Et sur la durée, le pourcentage gagne toujours. » Enfin, retiens le pont : $\ln$ change les produits en sommes, donc les suites géométriques en suites arithmétiques.`,
    keyPoint: "Intérêts composés = suite géométrique ; sur la durée, le % l'emporte sur l'augmentation fixe.",
    example: "$u_{25}=2\\,000\\,000\\times(1,1)^{25}=21\\,669\\,411,9>20\\,000\\,000$ : Mme Koffi réalisera son souhait.",
    methodSteps: [
      "Modélise : augmentation fixe → arithmétique ; pourcentage → géométrique.",
      "Écris le terme général et calcule le terme demandé.",
      "Compare les montants obtenus et conclus en une phrase.",
    ],
    timeline: [
      { label: "Modéliser", detail: "Traduire l'énoncé en suite arithmétique ou géométrique." },
      { label: "Calculer", detail: "Terme général, terme demandé, somme éventuelle." },
      { label: "Décider", detail: "Comparer les résultats et répondre au problème posé." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Le capital de Mme Koffi décolle avec les intérêts composés",
      instruction: "Déplace n, le nombre d'années : quand le capital (en millions) dépasse-t-il les 20 millions ?",
      observation: "Le capital u(n) = 2 × 1,1ⁿ millions grimpe de plus en plus vite : il franchit 20 millions vers n ≈ 24,2, donc u(25) ≈ 21,67 millions suffit pour la maison.",
      formula: "u(n) = 2 × 1,1^n (millions de F CFA)",
      formulaTex: "u_n=2\\times(1{,}1)^n\\ \\text{(millions)}",
      rule: { kind: "affine-plus-exp", slope: 0, intercept: 0, coefficient: 2, rate: 0.09531 },
      window: { xMin: -1, xMax: 30, yMin: -2, yMax: 32 },
      guides: [
        { kind: "horizontal", value: 20, label: "y = 20 millions" },
        { kind: "vertical", value: 24.16, label: "n ≈ 24,2" },
      ],
      marker: { min: 0, max: 30, step: 0.5, initial: 10 },
    },
    corrections: [
      "L'énoncé de la question 3-a de l'exercice 6 écrit Vₙ₊₁ = 1,05Vₙ ; le taux de 4,5 % donne Vₙ₊₁ = 1,045Vₙ, comme le confirme la solution.",
      "V₄ vaut 114 481,79 (le PDF affiche « 111 4481,79 » et un facteur « 0,045V₃ » au lieu de 1,045V₃).",
      "U₂₉ = 92 000 + 29 × 5 000 = 237 000 (le PDF utilise 290 000), et C₁ = 12 × 30 × (U₀+U₂₉)/2 = 59 220 000 F (le PDF affiche 36 × 191 000 = 6 876 000, avec un facteur erroné).",
      "Avec C₂ ≈ 67 351 804,9 > C₁ = 59 220 000, c'est le plan B qui est le plus avantageux sur 30 ans ; la conclusion « plan A » du PDF contredit ses propres calculs.",
      "L'énoncé de l'exercice 5 écrit Pₙ = u₀u₀…uₙ₋₁ ; il faut lire Pₙ = u₀u₁…uₙ₋₁, comme le traite la solution.",
    ],
    questions: [
      choice("Le placement de Mme Koffi (capital × 1,1 chaque année) se modélise par :", ["Une suite arithmétique de raison 1,1", "Une suite géométrique de raison 1,1", "Une suite arithmétique de raison 10", "Une suite géométrique de raison 10"], 1, "Multiplier par 1,1 chaque année : c'est une suite géométrique.", "C-Situation complexe, pages 5-6"),
      short("Calcule $u_{25}=2\\,000\\,000\\times(1,1)^{25}$ (arrondi à l'unité près accepté).", ["21669411,9", "21669411.9", "21669412", "21 669 411,9", "21 669 412"], "$2\\,000\\,000\\times10{,}83=21\\,669\\,411{,}9$.", "C-Situation complexe, page 6", 2),
      choice("Mme Koffi pourra-t-elle construire sa maison de 20 millions ?", ["Oui", "Non"], 0, "$21\\,669\\,411{,}9>20\\,000\\,000$.", "C-Situation complexe, page 6"),
      short("Plan A : calcule $U_{20}$, le salaire mensuel après 20 ans.", ["192000", "192 000"], "$92\\,000+5\\,000\\times20=192\\,000$ F.", "Exercice d'approfondissement 6, question 4, page 10"),
      short("Plan B : calcule $V_{20}$ (arrondi d'ordre 2).", ["221877,69", "221877.69", "221 877,69", "221878", "221 878"], "$92\\,000\\times(1{,}045)^{20}\\approx221\\,877{,}69$ F.", "Exercice d'approfondissement 6, question 4, page 10", 2),
      short("Calcule le cumul $C_1$ du plan A sur 30 années de service.", ["59220000", "59 220 000"], "$12\\times30\\times(92\\,000+237\\,000)/2=180\\times329\\,000=59\\,220\\,000$ F.", "Exercice d'approfondissement 6, question 5, page 10", 2),
      choice("Quel plan est le plus avantageux sur 30 années de service ?", ["Le plan A", "Le plan B", "Les deux se valent"], 1, "$C_2\\approx67{,}35$ millions dépasse $C_1=59{,}22$ millions.", "Exercice d'approfondissement 6, question 5, page 10", 2),
      choice("Pourquoi la suite $w_n=\\ln(u_n)$ de l'exercice 5 est-elle arithmétique ?", ["Car $\\ln$ transforme les produits en sommes", "Car $\\ln$ est croissante", "Car $u_n$ est positif", "Elle est en fait géométrique"], 0, "$w_{n+1}-w_n=\\ln(1/3)$ : la différence est constante.", "Exercice de renforcement 5, question 5, page 8", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index + 1, seed));

export const terminalASequencesPath: LearningPath = {
  id: "terminale-a-sequences",
  subjectId: "mathematics",
  levelIds: ["terminale-a"],
  curriculumLabel: "Programme ivoirien • Terminale A • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 5,
  title: "Suites numériques",
  description: "Le cours officiel intégral : suites arithmétiques et géométriques, termes généraux, variations, sommes, tableau récapitulatif et mission finale des placements financiers.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Reconnaître une suite arithmétique",
    "Reconnaître une suite géométrique",
    "Calculer un terme et une somme",
  ],
  modules: [{
    id: "terminale-a-sequences-mastery",
    title: "Maîtriser les suites numériques",
    description: "Progression fidèle au document source ; la situation d'apprentissage du placement n'apparaît que comme mission finale, en contexte d'évaluation.",
    lessons: builtLevels,
  }],
};
