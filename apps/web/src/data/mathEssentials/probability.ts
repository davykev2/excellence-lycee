import { section, sheet } from "./types";

export default sheet("probability", "Probabilité", [122, 123, 124], [
  section("essential-probability-counting", "I", "Choisir le bon dénombrement", [122], String.raw`
Dénombrer, c’est compter les possibilités. Pour un choix de $p$ objets parmi $n$, demander d’abord si l’ordre et les répétitions interviennent.

| Ordre ? | Répétition ? | Nombre de possibilités |
| --- | --- | --- |
| Oui | Oui, $p$ choix parmi les mêmes $n$ possibilités | $n^p$ |
| Oui | Non, $0\le p\le n$ | $A_n^p=\frac{n!}{(n-p)!}$ |
| Oui, tous les $n$ objets | Non | $n!$ |
| Non | Non, $0\le p\le n$ | $\binom np=\frac{n!}{p!(n-p)!}$ |

La dernière ligne concerne une sélection sans répétition. Si l’ordre ne compte pas **mais que les répétitions sont permises**, ce n’est pas le même modèle.

On utilise $0!=1$ et $n!=1\times2\times\cdots\times n$ pour $n\ge1$.
`),
  section("essential-probability-events", "II", "Événements et probabilités", [122, 123], String.raw`
L’univers $\Omega$ rassemble les issues possibles. Dans un univers **fini équiprobable** :

$$P(A)=\frac{\operatorname{card}(A)}{\operatorname{card}(\Omega)}.$$

| Propriété | Formule |
| --- | --- |
| Probabilité bornée | $0\le P(A)\le1$ |
| Événement impossible | $P(\varnothing)=0$ |
| Événement certain | $P(\Omega)=1$ |
| Événement contraire | $P(\overline A)=1-P(A)$ |
| Réunion | $P(A\cup B)=P(A)+P(B)-P(A\cap B)$ |

Pour les effectifs, $\operatorname{card}(A\cup B)=\operatorname{card}(A)+\operatorname{card}(B)-\operatorname{card}(A\cap B)$.

- $A\cap B$ signifie **A et B** ; $A\cup B$ signifie **A ou B**, éventuellement les deux.
- Deux événements sont **incompatibles** si $A\cap B=\varnothing$.
- Ils sont **contraires** s’ils sont incompatibles et si $A\cup B=\Omega$.

Le contraire de « au moins $p$ » est « au plus $p-1$ ». La somme des probabilités de toutes les issues élémentaires vaut $1$.
`),
  section("essential-probability-conditional", "III", "Conditionnement, arbre et indépendance", [122, 123], String.raw`
Si $P(A)>0$, la probabilité de $B$ sachant $A$ est

$$P_A(B)=\frac{P(A\cap B)}{P(A)}.$$

Dans un arbre, **on multiplie les probabilités le long d’un chemin**, et **on additionne celles des chemins incompatibles qui donnent l’événement recherché**.

Pour les quatre chemins ci-dessous, on suppose $0<P(A)<1$, afin que les deux conditionnements soient définis.

| Chemin | Probabilité |
| --- | --- |
| $A$ puis $B$ | $P(A)P_A(B)$ |
| $A$ puis $\overline B$ | $P(A)P_A(\overline B)$ |
| $\overline A$ puis $B$ | $P(\overline A)P_{\overline A}(B)$ |
| $\overline A$ puis $\overline B$ | $P(\overline A)P_{\overline A}(\overline B)$ |

Les branches qui partent d’un même nœud ont une somme de probabilités égale à $1$.

Si $0<P(A)<1$, la formule des probabilités totales donne

$$P(B)=P(A)P_A(B)+P(\overline A)P_{\overline A}(B).$$

**Indépendance :**

$$A\text{ et }B\text{ indépendants}\iff P(A\cap B)=P(A)P(B).$$

Lorsque les probabilités conditionnelles sont définies, cela revient à $P_A(B)=P(B)$ ou à $P_B(A)=P(A)$. Indépendants ne signifie pas incompatibles.
`),
  section("essential-probability-variable", "IV", "Loi d’une variable aléatoire", [123, 124], String.raw`
Une variable aléatoire réelle $X$ associe un nombre réel à chaque issue de $\Omega$.

Si ses valeurs possibles sont $x_1,\ldots,x_r$, sa loi peut s’écrire :

| Valeur $x_i$ | $x_1$ | $x_2$ | $\cdots$ | $x_r$ |
| --- | --- | --- | --- | --- |
| $P(X=x_i)$ | $p_1$ | $p_2$ | $\cdots$ | $p_r$ |

Chaque $p_i$ est positif ou nul, et $\sum_{i=1}^r p_i=1$.

**Espérance :**

$$E(X)=\sum_{i=1}^r x_ip_i.$$

Si $X$ est le **gain net** d’un jeu, $E(X)<0$ signifie qu’il est défavorable au joueur ; $E(X)=0$, équitable ; $E(X)>0$, favorable.

**Variance et écart-type :**

$$V(X)=\sum_{i=1}^r x_i^2p_i-\big(E(X)\big)^2\ge0,$$

$$\sigma(X)=\sqrt{V(X)}.$$

La variance peut être nulle : c’est le cas d’une variable constante.

**Fonction de répartition :** $F(t)=P(X\le t)$. Pour une variable à valeurs finies, elle est croissante au sens large, en escalier, avec des valeurs dans $[0;1]$ ; le saut à $x_i$ vaut $p_i$ et la valeur au saut inclut $X=x_i$.
`),
  section("essential-probability-binomial", "V", "Reconnaître une loi binomiale", [124], String.raw`
Une épreuve de Bernoulli possède deux résultats : succès, de probabilité $p$, et échec, de probabilité $q=1-p$.

Si l’on répète **indépendamment** $n$ fois la même épreuve, avec la même probabilité $p$, le nombre $X$ de succès suit la loi binomiale $\mathcal B(n,p)$.

Pour $k=0,1,\ldots,n$ :

$$P(X=k)=\binom nk p^k(1-p)^{n-k}.$$

Le coefficient $\binom nk$ compte les choix des $k$ positions de succès.

| Quantité | Formule |
| --- | --- |
| Espérance | $E(X)=np$ |
| Variance | $V(X)=np(1-p)$ |
| Écart-type | $\sigma(X)=\sqrt{np(1-p)}$ |
| Au moins un succès | $P(X\ge1)=1-(1-p)^n$ |

Pour la dernière ligne, on utilise le contraire : **aucun succès** a pour probabilité $(1-p)^n$.
`),
], [
  "P122 : équiprobabilité et dénominateur card(Ω) rétablis ; combinaison sans répétition seulement.",
  "P123 : variance ≥0, et non >0 ; conditionnelles sous probabilités non nulles.",
  "P124 : indépendance du schéma de Bernoulli explicitée et coefficient binomial C_n^k, pas C_n^1.",
]);
