import type { CourseDocumentSection } from "../../domain/courseDocument";

/** Pyramide TC, tome Analyse et probabilité, folios 144–147. */
export const terminalCSequencesSummary: CourseDocumentSection[] = [
  { id: "seq-usual-section", numeral: "I", title: "Suites arithmétiques et géométriques", topics: [
    { id: "seq-usual-summary", title: "Reconnaître une suite et additionner ses termes", pages: [146], legacyLessonIds: ["sequence-induction"],
      body: String.raw`Une **suite arithmétique** ajoute toujours le même réel $r$. Une **suite géométrique** multiplie toujours par le même réel $q$.

| | Arithmétique, raison $r$ | Géométrique, raison $q$ |
| --- | --- | --- |
| Récurrence | $u_{n+1}=u_n+r$ | $u_{n+1}=qu_n$ |
| À partir du rang $k$ | $u_n=u_k+(n-k)r$ | $u_n=u_kq^{n-k}$ |
| Entre deux rangs $p\le n$ | $u_n=u_p+(n-p)r$ | $u_n=u_pq^{n-p}$ |

Les deux dernières formules géométriques s’utilisent directement pour $n>k$ ou $n>p$ ; au rang de départ, on garde le terme donné. Pour $q\ne0$, on peut aussi remonter les rangs en divisant par $q$.

### Sommes de termes consécutifs

Entre $u_p$ et $u_n$, **bornes comprises**, il y a $n-p+1$ termes.

- Suite arithmétique :

$$\boxed{u_p+\cdots+u_n=(n-p+1)\frac{u_p+u_n}{2}.}$$

- Suite géométrique de raison $q\ne1$ :

$$\boxed{u_p+\cdots+u_n=u_p\frac{1-q^{n-p+1}}{1-q}.}$$

Si $q=1$, tous les termes sont égaux à $u_p$ ; la somme vaut $(n-p+1)u_p$.

**Le rang du premier terme compte.** Quinze termes à partir de $u_1$ vont jusqu’à $u_{15}$ ; quinze termes à partir de $u_0$ vont jusqu’à $u_{14}$.`,
      examples: [{ id: "seq-sums-worked", title: "Deux sommes de termes consécutifs", prompt: "Calculons les deux sommes du support.", parts: [
        { id: "seq-arithmetic-worked", label: "1.", prompt: String.raw`Quinze premiers termes : $u_1=2{,}3$, $r=3{,}1$.`, solution: String.raw`Le dernier terme est $u_{15}$ et le nombre de termes est $15-1+1=15$.

$$u_{15}=u_1+14r=2{,}3+14\times3{,}1=45{,}7.$$
$$S=15\times\frac{2{,}3+45{,}7}{2}=15\times24=\boxed{360}.$$` },
        { id: "seq-geometric-worked", label: "2.", prompt: String.raw`Dix premiers termes : $u_1=9$, $q=4$.`, solution: String.raw`La somme va de $u_1$ à $u_{10}$, donc comprend $10$ termes. Puisque $4\ne1$ :

$$S=9\frac{1-4^{10}}{1-4}=9\frac{4^{10}-1}{3}.$$

Avec $4^{10}=1\,048\,576$, on obtient **$S=3\,145\,725$**.` },
      ] }],
    },
  ] },
  { id: "seq-bounds-section", numeral: "II", title: "Suites majorées, minorées et bornées", topics: [
    { id: "seq-bounds-summary", title: "Une borne doit fonctionner à tous les rangs", pages: [146], legacyLessonIds: ["sequence-limit-algebra"],
      body: String.raw`Pour une suite $(u_n)$ définie sur un ensemble de rangs $E$ :

- elle est **majorée** s’il existe un réel $M$ tel que $u_n\le M$ pour tout $n\in E$ ;
- elle est **minorée** s’il existe un réel $m$ tel que $m\le u_n$ pour tout $n\in E$ ;
- elle est **bornée** si elle est à la fois majorée et minorée : $m\le u_n\le M$ ;
- elle est **positive** si $u_n\ge0$ à chaque rang, et **négative** si $u_n\le0$.

Les bornes $m$ et $M$ sont **fixes** : elles ne dépendent pas de $n$. Un majorant n’est pas nécessairement atteint et n’est pas nécessairement le plus petit possible.`,
      examples: [{ id: "seq-inverse-bounded", title: "Encadrer un inverse", prompt: String.raw`Montrons que $u_n=1/n$, pour $n\ge1$, est bornée.`, solution: String.raw`Pour $n\ge1$, on a $n>0$, donc $1/n>0$. De plus $n\ge1$, donc $1/n\le1$.

$$\boxed{0<u_n\le1.}$$

$0$ est un minorant et $1$ est un majorant : **la suite est bornée**. Le minorant $0$ n’est jamais un terme de cette suite.` }],
    },
  ] },
  { id: "seq-monotonicity-section", numeral: "III", title: "Sens de variation d’une suite", topics: [
    { id: "seq-monotonicity-summary", title: "Comparer deux termes consécutifs", pages: [147], legacyLessonIds: ["sequence-monotonicity"],
      body: String.raw`Pour tous les rangs consécutifs où les termes existent :

| Signe de $u_{n+1}-u_n$ | Variation |
| --- | --- |
| $\ge0$ | croissante |
| $>0$ | strictement croissante |
| $\le0$ | décroissante |
| $<0$ | strictement décroissante |

Si tous les termes sont **strictement positifs**, on peut aussi comparer $u_{n+1}/u_n$ à $1$. On ne divise jamais par un terme nul.

Si $u_n=f(n)$ et que $f$ est monotone sur un intervalle contenant les rangs considérés, la suite a le même sens de variation. Attention : la réciproque n’est pas générale ; une suite peut être monotone même si la fonction associée ne l’est pas entre les entiers.

Pour une suite récurrente, une **récurrence** peut propager $u_{n+1}\ge u_n$. Si l’on utilise les variations de $f$, il faut d’abord savoir dans quel intervalle restent les termes.`,
    },
  ] },
  { id: "seq-limit-section", numeral: "IV", title: "Limite d’une suite numérique", topics: [
    { id: "seq-limit-summary", title: "Convergence, divergence et composition", pages: [147], legacyLessonIds: ["small-angle-sequence"],
      body: String.raw`Une suite est **convergente** si elle admet une limite **réelle finie**. Si elle ne converge pas, elle est **divergente**.

Une suite qui tend vers $+\infty$ ou $-\infty$ diverge ; une suite qui oscille sans limite diverge aussi. **Diverger ne signifie donc pas forcément tendre vers l’infini.**

Une limite, lorsqu’elle existe, est **unique**.

### Passer par une fonction

Si $u_n=f(n)$ pour les entiers assez grands et si $\lim_{x\to+\infty}f(x)=\ell$, alors $\lim_{n\to+\infty}u_n=\ell$. Ici, $\ell$ peut être réel, $+\infty$ ou $-\infty$.

### Composer avec une fonction

Si $u_n\to a$, si les termes sont dans le domaine de $f$ et si $f$ est **continue en $a$**, alors :

$$\boxed{f(u_n)\longrightarrow f(a).}$$

Plus généralement, si $f(x)\to L$ quand $x\to a$ et si $u_n\ne a$ à partir d’un certain rang, alors $f(u_n)\to L$. Pour une limite unilatérale, les termes doivent rester du côté considéré.`,
      examples: [{ id: "seq-limit-examples", title: "Une limite finie et une limite infinie", prompt: "Étudions les deux exemples du support.", parts: [
        { id: "seq-one-inverse", label: "1.", prompt: String.raw`$u_n=1+1/n$, $n\ge1$.`, solution: String.raw`Comme $1/n\to0$, la somme donne $u_n\to1+0=1$. **La suite converge vers $1$.**` },
        { id: "seq-quadratic-over-linear", label: "2.", prompt: String.raw`$u_n=n^2/(n+1)$, $n\ge1$.`, solution: String.raw`On divise le numérateur et le dénominateur par $n$ :

$$u_n=\frac{n}{1+1/n}.$$

Le dénominateur tend vers $1>0$ et le numérateur vers $+\infty$. **$u_n\to+\infty$ : cette suite diverge.**` },
      ] }],
    },
    { id: "seq-monotone-convergence-summary", title: "Convergence des suites monotones", pages: [147], legacyLessonIds: ["monotone-convergence"],
      body: String.raw`- Toute suite **croissante et majorée** converge vers une limite réelle.
- Toute suite **décroissante et minorée** converge vers une limite réelle.
- Une suite croissante **non majorée** tend vers $+\infty$.
- Une suite décroissante **non minorée** tend vers $-\infty$.

Il faut toujours vérifier **les deux conditions** du théorème utilisé. Une suite seulement bornée peut osciller, comme $(-1)^n$. Une suite seulement croissante peut tendre vers $+\infty$, comme $u_n=n$.

Ce théorème **prouve l’existence** d’une limite finie ; il ne donne pas automatiquement sa valeur.`,
    },
  ] },
  { id: "seq-recursion-section", numeral: "V", title: "Suites récurrentes et limites", topics: [
    { id: "seq-recursion-summary", title: "Le point fixe vient après la convergence", pages: [147], legacyLessonIds: ["recursive-sequence-limit"],
      body: String.raw`Considérons $u_{n+1}=f(u_n)$. Si $(u_n)$ **converge vers un réel $\ell$** et si $f$ est définie et **continue en $\ell$**, alors :

$$u_{n+1}\longrightarrow\ell,\qquad f(u_n)\longrightarrow f(\ell).$$
$$\boxed{f(\ell)=\ell.}$$

Il faut vérifier que la limite appartient bien au domaine où la continuité est utilisée. Par exemple, un intervalle **fermé** invariant permet de conserver la limite dans cet intervalle.

Un réel $x$ tel que $f(x)=x$ est un **point fixe** de $f$. Les points fixes sont des candidats ; ils ne prouvent pas à eux seuls que la suite converge ni qu’elle tend vers chacun d’eux.

**Ordre de rédaction :** établir que la suite est définie et reste dans un intervalle, prouver sa convergence, puis résoudre l’équation de point fixe et choisir le candidat compatible.`,
    },
  ] },
  { id: "seq-geometric-section", numeral: "VI", title: "Limite des puissances d’un réel", topics: [
    { id: "seq-geometric-summary", title: "Distinguer les quatre cas pour a puissance n", pages: [148], legacyLessonIds: ["reference-sequences"],
      body: String.raw`Pour la suite $(a^n)$ :

| Valeur de $a$ | Comportement |
| --- | --- |
| $a\le-1$ | pas de limite : les signes alternent, les deux parités ne se rejoignent pas |
| $-1<a<1$ | $a^n\to0$ |
| $a=1$ | $a^n=1$, donc limite $1$ |
| $a>1$ | $a^n\to+\infty$ |

Pour $a=0$, on considère les rangs $n\ge1$ : tous les termes sont nuls.

Une suite géométrique $u_n=u_0q^n$ s’étudie ensuite en multipliant par $u_0$. Si $u_0=0$, elle est constante nulle, **quelle que soit la raison**. Pour $q>1$, le signe de $u_0$ détermine le signe de la divergence.`,
      examples: [{ id: "seq-geometric-limits", title: "Identifier la base avant de conclure", prompt: "Calculons les deux limites.", parts: [
        { id: "seq-two-power", label: "a)", prompt: String.raw`$u_n=2^n$.`, solution: String.raw`La base vérifie $2>1$. Par la propriété des puissances, **$u_n\to+\infty$**.` },
        { id: "seq-negative-power", label: "b)", prompt: String.raw`$u_n=(-\sqrt2/2)^n$.`, solution: String.raw`La base est négative mais sa valeur absolue vaut $\sqrt2/2<1$. Ainsi $-1<-\sqrt2/2<1$, donc **$u_n\to0$**. Les signes alternent, mais l’amplitude devient nulle.` },
      ] }],
    },
  ] },
  { id: "seq-comparison-section", numeral: "VII", title: "Limites et comparaison", topics: [
    { id: "seq-comparison-summary", title: "Comparer à une suite qui tend vers l’infini", pages: [148],
      body: String.raw`Soient $(u_n)$ et $(v_n)$. Des inégalités vraies **à partir d’un certain rang** suffisent :

- si $u_n\le v_n$ et $u_n\to+\infty$, alors $v_n\to+\infty$ ;
- si $u_n\le v_n$ et $v_n\to-\infty$, alors $u_n\to-\infty$.

Pour prouver une limite $+\infty$, on cherche donc un **minorant** qui tend vers $+\infty$. Pour une limite $-\infty$, on cherche un **majorant** qui tend vers $-\infty$.`,
      examples: [{ id: "seq-cos-minus-linear", title: "Dominer une oscillation bornée", prompt: String.raw`Déterminons la limite de $u_n=\cos n-2n$.`, solution: String.raw`Pour tout $n$, $-1\le\cos n\le1$. En retirant $2n$ :

$$-1-2n\le u_n\le1-2n.$$

Or $1-2n\to-\infty$. Par comparaison avec ce **majorant**, **$u_n\to-\infty$**. Il n’est pas nécessaire que $\cos n$ ait une limite.` }],
    },
    { id: "seq-squeeze-summary", title: "Théorème des gendarmes et puissances de n", pages: [148, 149],
      body: String.raw`Si, à partir d’un certain rang,

$$u_n\le v_n\le w_n,\qquad u_n\to L,\quad w_n\to L,\quad L\in\mathbb R,$$

alors **$v_n\to L$**.

Une forme pratique est : si $|v_n-L|\le a_n$ et si $a_n\to0$, alors $v_n\to L$.

### Limites de référence

Pour $n\ge1$ et $\alpha\in\mathbb R$ :

$$\alpha<0\Rightarrow n^\alpha\to0,\qquad\alpha=0\Rightarrow n^\alpha=1,$$
$$\alpha>0\Rightarrow n^\alpha\to+\infty.$$`,
      examples: [{ id: "seq-squeeze-worked", title: "Une oscillation divisée par n", prompt: String.raw`Calculons $\lim_{n\to+\infty}(\cos n/n+3)$.`, solution: String.raw`Pour $n\ge1$, on peut diviser $-1\le\cos n\le1$ par le nombre positif $n$, puis ajouter $3$ :

$$3-\frac1n\le3+\frac{\cos n}{n}\le3+\frac1n.$$

Les deux bornes tendent vers $3$. Par le théorème des gendarmes, **la limite est $3$**.` }],
    },
  ] },
  { id: "seq-growth-section", numeral: "VIII", title: "Croissances comparées", topics: [
    { id: "seq-growth-summary", title: "Logarithme, puissance et exponentielle", pages: [149], legacyLessonIds: ["sequence-growth"],
      body: String.raw`Pour $\alpha>0$ :

$$\boxed{\frac{\ln n}{n^\alpha}\longrightarrow0.}$$

Pour $a>1$ et $\alpha>0$ :

$$\boxed{\frac{n^\alpha}{a^n}\longrightarrow0.}$$

Pour $0<a<1$ et $\alpha<0$ :

$$\boxed{\frac{n^\alpha}{a^n}\longrightarrow+\infty.}$$

L’exponentielle domine une puissance, qui domine le logarithme. Cela permet de lever les formes indéterminées, mais **ne dispense pas de vérifier la base et les exposants**.

La dernière propriété s’obtient aussi en prenant l’inverse de $n^{-\alpha}a^n$, qui tend vers $0$ par valeurs positives.`,
      examples: [{ id: "seq-growth-worked", title: "Trois comparaisons", prompt: "Déterminons les trois limites du support.", parts: [
        { id: "seq-ln-over-square", label: "a)", prompt: String.raw`$u_n=\ln n/n^2$.`, solution: String.raw`On reconnaît $\ln n/n^\alpha$ avec $\alpha=2>0$. **La limite est $0$.**` },
        { id: "seq-root-over-exp", label: "b)", prompt: String.raw`$u_n=\sqrt n/3^n$.`, solution: String.raw`$\sqrt n=n^{1/2}$, avec $\alpha=1/2>0$ et $a=3>1$. La croissance comparée donne **$u_n\to0$**.` },
        { id: "seq-inverse-exp", label: "c)", prompt: String.raw`$u_n=1/[n(\sqrt2/2)^n]$.`, solution: String.raw`On écrit $u_n=n^{-1}/a^n$, où $a=\sqrt2/2$. Ici $0<a<1$ et $\alpha=-1<0$. Par la troisième propriété, **$u_n\to+\infty$**.` },
      ] }],
    },
  ] },
];
