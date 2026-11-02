import type { CourseEvaluationGroup } from "../../domain/courseDocument";

export const probabilityEvaluations: CourseEvaluationGroup[] = [
  { id: "prob-eval-total", title: "Utiliser un arbre et les probabilités totales", pages: [231],
    method: String.raw`1. Nomme les événements.
2. Traduis chaque proportion : est-elle donnée sur toute la population ou sachant un événement ?
3. Construis l’arbre et calcule les intersections par produit.
4. Additionne les chemins pour obtenir le dénominateur si on demande une probabilité conditionnelle.
5. Applique $P_B(A)=P(A\cap B)/P(B)$, avec $P(B)>0$.`,
    examples: [{ id: "prob-eval-urns-worked", title: "Quelle urne sachant une boule blanche ?", prompt: "U₁ contient 5 blanches et 3 vertes ; U₂ contient 1 blanche et 4 vertes. On choisit l’une des deux urnes avec la même probabilité, puis une boule au hasard. Quelle est la probabilité qu’elle vienne de U₁ sachant qu’elle est blanche ?", parts: [
      { id: "prob-eval-urns-data", label: "1.", prompt: "Traduire les données et calculer les intersections.", solution: String.raw`Notons $B$ : « la boule est blanche ». Le choix des urnes est équiprobable :
$$P(U_1)=P(U_2)=\frac12,\qquad P_{U_1}(B)=\frac58,\quad P_{U_2}(B)=\frac15.$$
Donc $P(U_1\cap B)=5/16$ et $P(U_2\cap B)=1/10$.` },
      { id: "prob-eval-urns-denominator", label: "2.", prompt: "Calculer P(B).", solution: String.raw`Les deux urnes couvrent tous les choix possibles. Par probabilités totales :
$$P(B)=\frac12\times\frac58+\frac12\times\frac15
=\frac{25}{80}+\frac8{80}=\frac{33}{80}.$$` },
      { id: "prob-eval-urns-result", label: "3.", prompt: String.raw`Calculer $P_B(U_1)$.`, solution: String.raw`On sait que la boule est blanche : le dénominateur est donc $P(B)$.
$$P_B(U_1)=\frac{P(U_1\cap B)}{P(B)}
=\frac{5/16}{33/80}=\frac5{16}\times\frac{80}{33}=\boxed{\frac{25}{33}}.$$
Ce n’est pas $5/8$ : ce dernier nombre décrit une boule blanche **sachant l’urne**, et non l’inverse.` },
    ], nativeFigure: { kind: "probability", preset: "urns" } }],
    questions: [],
    writtenTasks: [{ id: "prob-eval-test-application", topicId: "prob-total",
      prompt: String.raw`Dans un modèle de dépistage du paludisme, $P(M)=p$ avec $0<p<1$, $P_M(T)=0,99$ et $P_{\overline M}(\overline T)=0,99$. $M$ signifie « malade », $T$ « test positif ». Exprime $P_T(M)$ en fonction de $p$.`,
      model: String.raw`**1. Traduire les branches.** Parmi les non-malades, la probabilité d’un test positif est $1-0,99=0,01$.

**2. Calculer les intersections.**
$$P(M\cap T)=0,99p,\qquad
P(\overline M\cap T)=0,01(1-p).$$
**3. Calculer la probabilité totale d’un test positif.**
$$P(T)=0,99p+0,01(1-p)=0,98p+0,01.$$
Elle est strictement positive pour $0\le p\le1$.

**4. Conditionner par le résultat positif.**
$$\boxed{P_T(M)=\frac{0,99p}{0,98p+0,01}=\frac{99p}{98p+1}.}$$
La probabilité $0,99$ donnée au départ n’est pas la réponse : elle conditionne dans l’autre sens. Il s’agit des hypothèses d’un exercice, pas d’une interprétation médicale individuelle.`,
      criteria: ["Je distingue P_M(T) de P_T(M).", "Je compte aussi les tests positifs parmi les non-malades.", "Je justifie le dénominateur positif avant de diviser."] }],
  },
  { id: "prob-eval-binomial", title: "Déterminer une loi binomiale", pages: [231,232],
    method: String.raw`Vérifie les trois conditions : épreuves de Bernoulli de même probabilité $p$, répétées $n$ fois **indépendamment**. Si $X$ compte les succès :
$$P(X=k)=\binom nkp^k(1-p)^{n-k},\quad k=0,\ldots,n.$$
Garde les valeurs exactes avant tout arrondi.`,
    examples: [{ id: "prob-eval-family-worked", title: "Le nombre de garçons dans une famille", prompt: "Dans le modèle étudié, chaque naissance a une probabilité 0,49 de donner un garçon et les trois naissances sont indépendantes. Une famille a trois enfants sans jumeaux. X compte les garçons.", parts: [
      { id: "prob-eval-family-identification", label: "1.", prompt: "Justifier la loi et préciser ses paramètres.", solution: String.raw`Une naissance constitue une épreuve à deux issues du modèle, avec succès « garçon », de probabilité $p=0,49$. Les $3$ épreuves sont supposées identiques et indépendantes. $X$ compte les succès, donc $\boxed{X\sim\mathcal B(3;0,49)}$.` },
      { id: "prob-eval-family-law", label: "2.", prompt: "Déterminer la loi de X.", solution: String.raw`Pour $k=0,1,2,3$ :
$$P(X=k)=\binom3k(0,49)^k(0,51)^{3-k}.$$
On obtient :

| $k$ | $0$ | $1$ | $2$ | $3$ |
| --- | --- | --- | --- | --- |
| $P(X=k)$ | $0,132651$ | $0,382347$ | $0,367353$ | $0,117649$ |

Par exemple, $P(X=2)=3(0,49)^2(0,51)=0,367353$. La somme des quatre probabilités vaut **$1$**.` },
    ] }],
    questions: [],
    writtenTasks: [
      { id: "prob-eval-qcm-identification", topicId: "prob-bernoulli",
        prompt: "Un QCM comporte 10 questions à 3 choix, avec une seule bonne réponse par question. On choisit indépendamment et uniformément une réponse à chaque question. X compte les réponses justes. Justifie sa loi et donne les paramètres.",
        model: String.raw`À chaque question, le succès est « réponse juste » et sa probabilité vaut $1/3$ ; l’échec vaut $2/3$.

Il y a $10$ répétitions et les choix sont faits indépendamment, dans les mêmes conditions. $X$ compte les succès :
$$\boxed{X\sim\mathcal B(10;1/3).}$$
Les valeurs possibles sont tous les entiers de $0$ à $10$. La présence de trois propositions n’empêche pas d’avoir deux issues pour l’événement étudié : juste ou faux.`,
        criteria: ["Je définis le succès.", "Je justifie p=1/3 et les dix répétitions indépendantes.", "Je précise que X compte les succès."] },
      { id: "prob-eval-qcm-law", topicId: "prob-binomial",
        prompt: "Détermine la loi de probabilité de X pour ce QCM.",
        model: String.raw`Les valeurs sont $k=0,1,\ldots,10$. La formule de la loi binomiale donne :
$$\boxed{P(X=k)=\binom{10}{k}\left(\frac13\right)^k\left(\frac23\right)^{10-k}.}$$
Le coefficient compte les choix des questions réussies ; les puissances correspondent aux $k$ réponses justes et aux $10-k$ réponses fausses.

Par exemple, $P(X=0)=(2/3)^{10}$ et $P(X=10)=(1/3)^{10}$. Hors des entiers $0,\ldots,10$, la probabilité vaut $0$.`,
        criteria: ["Je donne l’ensemble des valeurs possibles.", "Je conserve le coefficient binomial.", "Je vérifie les exposants k et 10−k."] },
    ],
  },
  { id: "prob-eval-parameters", title: "Calculer l’espérance et la variance d’une loi binomiale", pages: [232],
    method: String.raw`Pour $X\sim\mathcal B(n,p)$, utilise $E(X)=np$ et $V(X)=np(1-p)$. Ne confonds pas $V(X)$ et $\sigma(X)=\sqrt{V(X)}$.`,
    examples: [{ id: "prob-eval-family-parameters", title: "Paramètres numériques de la famille précédente", prompt: String.raw`$X\sim\mathcal B(3;0,49)$. Calculer $E(X)$ et $V(X)$.`, parts: [
      { id: "prob-eval-family-mean", label: "1.", prompt: "Calculer l’espérance.", solution: String.raw`$n=3$ et $p=0,49$. Ainsi $\boxed{E(X)=3\times0,49=1,47}$. C’est un nombre moyen de garçons, pas le nombre d’enfants d’une famille particulière.` },
      { id: "prob-eval-family-var", label: "2.", prompt: "Calculer la variance.", solution: String.raw`$1-p=0,51$, donc $\boxed{V(X)=3\times0,49\times0,51=0,7497}$. Au centième, on obtiendrait $0,75$ ; gardons ici la valeur exacte.` },
    ] }],
    statement: "Pour le QCM de 10 questions avec trois choix indépendants, X suit la loi binomiale de paramètres 10 et 1/3.",
    questions: [
      { id: "prob-eval-qcm-mean", label: "1.", topicId: "prob-binomial-parameters", points: 1, prompt: "Calcule E(X).", expected: "$10/3$", answer: { kind: "short", accepted: ["10/3"] },
        correction: String.raw`La formule est $E(X)=np$. Avec $n=10$ et $p=1/3$ :
$$\boxed{E(X)=10\times\frac13=\frac{10}{3}.}$$
Une espérance n’a pas à être un entier, même si $X$ est entière.` },
      { id: "prob-eval-qcm-variance", label: "2.", topicId: "prob-binomial-parameters", points: 1, prompt: "Calcule V(X).", expected: "$20/9$", answer: { kind: "short", accepted: ["20/9"] },
        correction: String.raw`On calcule d’abord $1-p=2/3$, puis :
$$\boxed{V(X)=10\times\frac13\times\frac23=\frac{20}{9}.}$$
La racine carrée de ce résultat serait l’écart type, qui n’est pas demandé ici.` },
    ],
  },
];
