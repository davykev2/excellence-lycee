import type { CourseDocumentSection } from "../../domain/courseDocument";

export const probabilitySummaryB: CourseDocumentSection[] = [
  { id: "prob-variables", numeral: "II", title: "Variable aléatoire", topics: [
    { id: "prob-variable", title: "Associer un nombre à chaque issue", pages: [226,227],
      body: String.raw`Une **variable aléatoire réelle** sur un univers $\Omega$ est une application $X:\Omega\to\mathbb R$. À chaque issue $\omega$, elle associe un nombre $X(\omega)$.

On note $X(\Omega)$ l’ensemble des valeurs possibles. Les écritures suivantes désignent des **événements** :
$$\{X=a\}=\{\omega\in\Omega:X(\omega)=a\},$$
$$\{X\le a\}=\{\omega\in\Omega:X(\omega)\le a\},\qquad
\{X>a\}=\{\omega\in\Omega:X(\omega)>a\}.$$
La variable est une fonction ; une valeur de $X$ est un nombre ; une égalité ou une inégalité sur $X$ définit un événement.`,
      examples: [{ id: "prob-orange-white-green", title: "Le gain de deux boules", prompt: "Une urne contient 2 boules oranges O, 3 blanches B et 4 vertes V. Une orange rapporte 100 F, une blanche fait perdre 100 F et une verte rapporte 200 F. On tire simultanément deux boules ; X est le gain total.", parts: [
        { id: "prob-urn-gains", label: "1.", prompt: "Associer le gain à chaque paire de couleurs.", solution: String.raw`Les six types de paires sont $OO,OB,OV,BB,BV,VV$. On additionne les gains des deux couleurs :

| Paire | $OO$ | $OB$ | $OV$ | $BB$ | $BV$ | $VV$ |
| --- | --- | --- | --- | --- | --- | --- |
| Gain $X$ en F | $200$ | $0$ | $300$ | $-200$ | $100$ | $400$ |

Ces six types ne sont **pas équiprobables** : il faut compter les paires de boules pour calculer leurs probabilités.` },
        { id: "prob-urn-events", label: "2.", prompt: String.raw`Décrire $\{X=-200\}$, $\{X\le200\}$ et $\{X>300\}$.`,
          solution: String.raw`À l’aide du tableau :

- $X=-200$ correspond seulement à $BB$.
- $X\le200$ correspond à **$BB,OB,BV,OO$** : $200$ est inclus.
- $X>300$ correspond seulement à $VV$ : $OV$ donne $300$, pas davantage.

On doit conserver la différence entre $<$ et $\le$.` },
      ] }],
    },
    { id: "prob-law", title: "Déterminer une loi de probabilité", pages: [227], legacyLessonIds: ["random-variable-law"],
      body: String.raw`Pour une variable aléatoire à un nombre fini de valeurs $x_1,\ldots,x_n$, sa **loi** associe à chaque valeur la probabilité correspondante $p_i=P(X=x_i)$.

| Valeur | $x_1$ | $x_2$ | $\ldots$ | $x_n$ |
| --- | --- | --- | --- | --- |
| Probabilité | $p_1$ | $p_2$ | $\ldots$ | $p_n$ |

On doit avoir **$p_i\ge0$ pour chaque $i$ et $\sum p_i=1$**. Les événements $\{X=x_i\}$ sont incompatibles et couvrent tous les cas.

**Méthode :** lister les valeurs distinctes, regrouper les issues qui donnent la même valeur, puis calculer leur probabilité. Un tableau dont les probabilités ne somment pas à $1$ n’est pas une loi complète.`,
      examples: [{ id: "prob-roulette-law", title: "Gain algébrique à la roulette", prompt: "Les 37 numéros de 0 à 36 sont équiprobables et 18 sont rouges. On paie une mise de 100 F. Un rouge rapporte un versement de 200 F ; sinon on ne reçoit rien. X est le gain après déduction de la mise.", parts: [
        { id: "prob-roulette-values", label: "1.", prompt: "Calculer les gains possibles.", solution: String.raw`Si le rouge sort : $X=200-100=100$ F. Sinon : $X=0-100=-100$ F.

Ainsi **$X(\Omega)=\{-100;100\}$**. Le versement de $200$ F n’est pas le gain net.` },
        { id: "prob-roulette-table", label: "2.", prompt: "Donner la loi de X.", solution: String.raw`Il y a $18$ numéros rouges et $19$ autres :

| $x_i$ en F | $-100$ | $100$ |
| --- | --- | --- |
| $P(X=x_i)$ | $19/37$ | $18/37$ |

Les deux probabilités sont positives et leur somme vaut $1$.` },
      ] }],
    },
    { id: "prob-expectation", title: "Espérance mathématique et gain moyen", pages: [227,228], legacyLessonIds: ["expectation-variance"],
      body: String.raw`L’**espérance mathématique** de $X$ est sa moyenne pondérée :
$$\boxed{E(X)=\sum_{i=1}^np_ix_i.}$$
Elle s’exprime dans la même unité que $X$. Dans un jeu, c’est le gain moyen théorique sur un grand nombre de parties, **pas une promesse pour une partie**.

- $E(X)>0$ : jeu favorable au joueur.
- $E(X)=0$ : jeu équitable.
- $E(X)<0$ : jeu défavorable.

Avant de calculer, vérifier que $X$ désigne bien le **gain algébrique**, mise déjà retranchée.`,
      examples: [{ id: "prob-roulette-expectation", title: "Interpréter une espérance négative", prompt: "Calculer l’espérance du gain de la roulette précédente et l’interpréter.", solution: String.raw`On multiplie chaque gain par sa probabilité :
$$E(X)=(-100)\frac{19}{37}+100\frac{18}{37}
=\frac{-1900+1800}{37}=\boxed{-\frac{100}{37}}.$$
Cela représente une perte moyenne théorique d’environ **$2,70$ F par partie**. Comme $E(X)<0$, le jeu est défavorable. Cela ne signifie pas qu’on perd exactement $2,70$ F à chaque partie.` }],
    },
    { id: "prob-variance", title: "Variance et écart type", pages: [228,229],
      body: String.raw`La **variance** mesure la dispersion des valeurs autour de l’espérance :
$$\boxed{V(X)=\sum_{i=1}^np_i(x_i-E(X))^2.}$$
Elle est positive ou nulle. Une formule de calcul équivalente est :
$$\boxed{V(X)=\sum_{i=1}^np_ix_i^2-[E(X)]^2=E(X^2)-[E(X)]^2.}$$
L’**écart type** est :
$$\boxed{\sigma(X)=\sqrt{V(X)}.}$$
L’écart type a la même unité que $X$, tandis que la variance s’exprime dans le carré de cette unité.

Garde les fractions ou toutes les décimales pendant le calcul. Arrondir l’espérance avant de l’élever au carré peut fausser la variance.`,
      examples: [{ id: "prob-variance-example", title: "Calculer sans arrondis prématurés", prompt: "On donne la loi de X suivante.", solution: String.raw`| $x_i$ | $-20$ | $-10$ | $10$ | $20$ | $30$ |
| --- | --- | --- | --- | --- | --- |
| $p_i$ | $1/5$ | $3/10$ | $1/6$ | $1/12$ | $1/4$ |

**1. Espérance.**
$$E(X)=-\frac{20}{5}-\frac{30}{10}+\frac{10}{6}+\frac{20}{12}+\frac{30}{4}=\frac{23}{6}.$$
**2. Moyenne des carrés.**
$$E(X^2)=\frac{400}{5}+\frac{300}{10}+\frac{100}{6}+\frac{400}{12}+\frac{900}{4}=385.$$
**3. Variance.**
$$V(X)=385-\left(\frac{23}{6}\right)^2=\boxed{\frac{13331}{36}}\simeq370,306.$$
**4. Écart type.**
$$\sigma(X)=\boxed{\frac{\sqrt{13331}}6}\simeq19,24.$$
On n’arrondit qu’à la dernière étape.` }],
    },
    { id: "prob-cdf", title: "Fonction de répartition", pages: [229], legacyLessonIds: ["cumulative-distribution"],
      body: String.raw`La **fonction de répartition** de $X$ est :
$$\boxed{F(t)=P(X\le t),\qquad t\in\mathbb R.}$$
Elle cumule les probabilités des valeurs **inférieures ou égales** à $t$.

- Pour tout $t$, $0\le F(t)\le1$.
- $F$ est **croissante au sens large** : elle peut rester constante.
- Pour une variable à un nombre fini de valeurs, elle est en escalier, constante entre deux valeurs successives.
- À chaque valeur $x_i$, le saut vaut $P(X=x_i)$. Le point en $x_i$ appartient au **palier supérieur** car l’égalité est incluse.

On obtient aussi $P(a<X\le b)=F(b)-F(a)$, pour $a\le b$.`,
      examples: [{ id: "prob-cdf-example", title: "Additionner les probabilités dans l’ordre", prompt: "X prend les valeurs 1, 2, 3, 4, 5 avec les probabilités respectives 2/21, 4/21, 1/21, 8/21, 6/21.", solution: String.raw`On classe les valeurs, puis on additionne progressivement :
$$F(t)=\begin{cases}
0&\text{si }t<1,\\
2/21&\text{si }1\le t<2,\\
6/21&\text{si }2\le t<3,\\
7/21&\text{si }3\le t<4,\\
15/21&\text{si }4\le t<5,\\
1&\text{si }t\ge5.
\end{cases}$$
Par exemple, $F(3)=P(X\le3)=(2+4+1)/21=1/3$, et non $P(X=3)=1/21$.

Sur le graphique, chaque palier commence par un point **plein**, et se termine, à droite, par un point **ouvert** avant le saut suivant.`, nativeFigure: { kind: "probability", preset: "cdf" } }],
    },
  ] },
  { id: "prob-bernoulli-section", numeral: "III", title: "Épreuve de Bernoulli et loi binomiale", topics: [
    { id: "prob-bernoulli", title: "Reconnaître un schéma de Bernoulli", pages: [230], legacyLessonIds: ["bernoulli-binomial"],
      body: String.raw`Une **épreuve de Bernoulli** est une expérience à deux issues : un **succès** de probabilité $p$ et un **échec** de probabilité $q=1-p$.

Un **schéma de Bernoulli** est la répétition de $n$ épreuves :

1. de même nature ;
2. **indépendantes** ;
3. avec la **même probabilité de succès $p$**.

Les paramètres sont $n$ et $p$. Choisir le mot « succès » sert seulement à nommer l’événement étudié ; il ne signifie pas forcément une bonne nouvelle.

Des tirages sans remise ne sont généralement pas indépendants. Le fait d’avoir deux issues à chaque étape ne suffit donc pas à prouver un schéma de Bernoulli.`,
    },
    { id: "prob-binomial", title: "Loi du nombre de succès", pages: [230],
      body: String.raw`Si $X$ compte les succès dans un schéma de Bernoulli de paramètres $n,p$, on dit qu’elle suit la **loi binomiale** $\mathcal B(n,p)$.

Ses valeurs sont $0,1,\ldots,n$ et, pour $k$ entier entre $0$ et $n$ :
$$\boxed{P(X=k)=\binom nk p^k(1-p)^{n-k}.}$$
Le coefficient $\binom nk$, aussi noté $C_n^k$, compte les positions possibles des $k$ succès.

Un chemin comportant $k$ succès et $n-k$ échecs a une probabilité $p^k(1-p)^{n-k}$. Les $\binom nk$ chemins correspondants sont incompatibles : on les additionne.

**Traductions utiles :**
$$P(X\ge1)=1-P(X=0),$$
$$P(X\ge2)=1-P(X=0)-P(X=1).$$
Pour $p=0$, $X=0$ avec certitude ; pour $p=1$, $X=n$ avec certitude.`,
      examples: [{ id: "prob-flu-binomial", title: "Décrire un modèle binomial", prompt: "Une ville compte 50 000 habitants, dont 1 000 cas de grippe. On modélise les états de santé de 35 enfants par des épreuves indépendantes, avec la même probabilité 1/50 d’être malade. X compte les enfants malades.", solution: String.raw`Une épreuve consiste ici à observer un enfant : « malade » est le succès, de probabilité $p=1000/50000=1/50$.

Dans **le modèle annoncé**, les $35$ épreuves sont identiques et indépendantes ; $X$ compte les succès. Donc :
$$\boxed{X\sim\mathcal B\left(35;\frac1{50}\right).}$$
Pour $k\in\{0,\ldots,35\}$ :
$$\boxed{P(X=k)=\binom{35}{k}\left(\frac1{50}\right)^k\left(\frac{49}{50}\right)^{35-k}.}$$
L’indépendance est une hypothèse de ce modèle, pas une conséquence automatique d’un décompte de population.` }],
      nativeFigure: { kind: "probability", preset: "binomial" },
    },
    { id: "prob-binomial-parameters", title: "Espérance et variance de la loi binomiale", pages: [230], legacyLessonIds: ["binomial-parameters"],
      body: String.raw`Si $X\sim\mathcal B(n,p)$, avec $q=1-p$, alors :
$$\boxed{E(X)=np,\qquad V(X)=npq=np(1-p),\qquad \sigma(X)=\sqrt{np(1-p)}.}$$
L’espérance est le nombre moyen de succès dans $n$ épreuves.

Pour retrouver les paramètres quand $E(X)>0$, on peut utiliser :
$$\frac{V(X)}{E(X)}=1-p.$$
On trouve ensuite $p$, puis $n=E(X)/p$. Il faut contrôler que $0\le p\le1$ et que $n$ est un entier naturel.`,
      examples: [{ id: "prob-flu-parameters", title: "Paramètres du modèle précédent", prompt: String.raw`Pour $X\sim\mathcal B(35;1/50)$, calculer $E(X)$ et $V(X)$.`, parts: [
        { id: "prob-flu-E", label: "1.", prompt: "Calculer l’espérance.", solution: String.raw`On applique $E(X)=np$ :
$$\boxed{E(X)=35\times\frac1{50}=\frac7{10}=0,7.}$$
Ce nombre est une moyenne ; il n’a pas besoin d’être entier, même si $X$ ne prend que des valeurs entières.` },
        { id: "prob-flu-V", label: "2.", prompt: "Calculer la variance.", solution: String.raw`On a $1-p=49/50$, donc :
$$\boxed{V(X)=35\times\frac1{50}\times\frac{49}{50}=\frac{343}{500}=0,686.}$$
Pour l’écart type, on prendrait la racine carrée de $343/500$, pas celle de l’espérance.` },
      ] }],
    },
  ] },
];
