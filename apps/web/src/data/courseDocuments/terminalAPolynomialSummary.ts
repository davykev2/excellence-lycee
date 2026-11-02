import type {CourseDocumentSection,CourseDocumentTopic,CourseWorkedExample} from "../../domain/courseDocument";

const topic=(id:string,title:string,pages:number[],body:string,examples:CourseWorkedExample[]=[]):CourseDocumentTopic=>({id,title,pages,body,examples});
const application=(id:string,title:string,parts:[string,string,string][]):CourseWorkedExample=>({id,title,prompt:"",parts:parts.map(([label,prompt,solution],i)=>({id:id+"-"+(i+1),label,prompt,solution}))});
const r=String.raw;

/** Reading is authored separately from the nineteen historical mastery steps. */
export const terminalAPolynomialSections:CourseDocumentSection[]=[
 {id:"ta-functions-polynomials",numeral:"I",title:"Limites des fonctions polynômes",topics:[
  topic("ta-polynomial-finite","Une limite en un nombre réel",[2,3],r`### Comprendre la notation

Dire que $\lim_{x\to a}f(x)=L$, c’est dire que les valeurs de $f(x)$ se rapprochent de $L$ lorsque $x$ se rapproche de $a$ dans l’ensemble de définition. La valeur de la fonction en $a$ n’est pas toujours nécessaire pour étudier une limite.

### Propriété 1 · Une seule limite

Si une fonction possède une limite en un point ou à l’infini, cette limite est unique.

### Propriété 2 · Cas d’un polynôme

Pour une fonction polynôme $P$ et tout réel $a$ :

$$\lim_{x\to a}P(x)=P(a).$$

On remplace donc $x$ par $a$. En particulier, la limite d’une constante $k$ est $k$.`,[
   application("ta-finite-examples","Calculer trois limites",[
    ["a)",r`$\displaystyle\lim_{x\to4}(2x+1)$.`,r`La fonction $x\mapsto2x+1$ est un polynôme. **On remplace $x$ par $4$ :**
$$\lim_{x\to4}(2x+1)=2\times4+1=\boxed9.$$`],
    ["b)",r`$\displaystyle\lim_{x\to3}(x-3)(3x+8)$.`,r`L’expression est un produit de polynômes, donc un polynôme. Ainsi :
$$\lim_{x\to3}(x-3)(3x+8)=(3-3)(3\times3+8)=0\times17=\boxed0.$$`],
    ["c)",r`$\displaystyle\lim_{x\to-1}(-13)$.`,r`La fonction est constante. Sa valeur ne change pas quand $x$ se rapproche de $-1$ :
$$\lim_{x\to-1}(-13)=\boxed{-13}.$$`],
   ]),
  ]),
  topic("ta-polynomial-infinite","Le terme de plus haut degré",[3,4],r`### Propriété 1 · Limites d’un monôme

Soient $n\geq1$ un entier et $a\neq0$ un réel. Pour $ax^n$, on tient compte du **signe de $a$** et de la **parité de $n$**.

| Monôme | En $-\infty$ | En $+\infty$ |
|---|---|---|
| $a>0$, $n$ pair | $+\infty$ | $+\infty$ |
| $a<0$, $n$ pair | $-\infty$ | $-\infty$ |
| $a>0$, $n$ impair | $-\infty$ | $+\infty$ |
| $a<0$, $n$ impair | $+\infty$ | $-\infty$ |

Une puissance paire est positive des deux côtés ; une puissance impaire garde le signe de $x$. La limite d’une constante reste cette constante, même à l’infini.

### Propriété 2 · Limite d’un polynôme

À l’infini, un polynôme non constant a la même limite que son terme de plus haut degré. On n’utilise cette règle **qu’à l’infini**, pas pour une limite en un réel.`,[
   application("ta-dominant-examples","Repérer le terme qui décide de la limite",[
    ["a)",r`$\displaystyle\lim_{x\to-\infty}(-3x^3+2x)$.`,r`Le terme de plus haut degré est $-3x^3$. Quand $x\to-\infty$, $x^3\to-\infty$ ; le produit par $-3$ devient positif et augmente sans borne. Donc :
$$\lim_{x\to-\infty}(-3x^3+2x)=\lim_{x\to-\infty}(-3x^3)=\boxed{+\infty}.$$`],
    ["b)",r`$\displaystyle\lim_{x\to+\infty}(-3x^2+10)$.`,r`Le terme de plus haut degré est $-3x^2$. Or $x^2\to+\infty$, donc $-3x^2\to-\infty$ :
$$\lim_{x\to+\infty}(-3x^2+10)=\boxed{-\infty}.$$`],
   ]),
  ]),
 ]},
 {id:"ta-functions-rational",numeral:"II",title:"Limites des fonctions rationnelles",topics:[
  topic("ta-rational-finite","Commencer par le domaine de définition",[5],r`Une fonction rationnelle est un quotient de polynômes :
$$f(x)=\frac{P(x)}{Q(x)}.$$
Elle est définie exactement là où $Q(x)\neq0$.

### Propriété

Si $Q(a)\neq0$, on calcule directement :
$$\lim_{x\to a}\frac{P(x)}{Q(x)}=\frac{P(a)}{Q(a)}.$$
**Avant de remplacer $x$, vérifie toujours le dénominateur.**`,[
   application("ta-rational-finite-examples","Remplacer lorsque le dénominateur ne s’annule pas",[
    ["a)",r`$\displaystyle\lim_{x\to1}\frac{x}{x+2}$.`,r`En $1$, le dénominateur vaut $1+2=3\neq0$. Donc :
$$\lim_{x\to1}\frac{x}{x+2}=\frac{1}{1+2}=\boxed{\frac13}.$$`],
    ["b)",r`$\displaystyle\lim_{x\to-1}\frac{x^2}{x-2}$.`,r`En $-1$, le dénominateur vaut $-3$, donc il ne s’annule pas :
$$\lim_{x\to-1}\frac{x^2}{x-2}=\frac{(-1)^2}{-1-2}=\boxed{-\frac13}.$$`],
   ]),
  ]),
  topic("ta-rational-sided","À gauche et à droite d’une valeur interdite",[5,6,7],r`Les écritures $x\to a^-$ et $x\to a^+$ signifient que $x$ se rapproche de $a$ respectivement **par valeurs inférieures** et **par valeurs supérieures**.

### Limites de référence

$$\lim_{x\to a^-}\frac1{x-a}=-\infty,\qquad
\lim_{x\to a^+}\frac1{x-a}=+\infty.$$

**Car :** à gauche, $x-a$ est négatif et proche de zéro ; à droite, il est positif et proche de zéro. Dans les deux cas, l’inverse devient très grand en valeur absolue.

Si les deux limites latérales sont différentes, il n’existe pas de limite unique en $a$.`,[
   application("ta-sided-examples","Faire apparaître le signe du dénominateur",[
    ["a)",r`$\displaystyle\lim_{x\to7^+}\frac1{x-7}$.`,r`Quand $x\to7^+$, $x-7\to0$ en restant positif. On applique la limite de référence :
$$\lim_{x\to7^+}\frac1{x-7}=\boxed{+\infty}.$$`],
    ["b)",r`$\displaystyle\lim_{x\to-2^-}\frac1{x+2}$.`,r`On écrit $x+2=x-(-2)$. À gauche de $-2$, cette quantité est négative et se rapproche de zéro. Ainsi :
$$\lim_{x\to-2^-}\frac1{x+2}=\boxed{-\infty}.$$`],
   ]),
  ]),
  topic("ta-rational-infinite","Comparer les plus hauts degrés",[7],r`### Propriété

À l’infini, on remplace le numérateur et le dénominateur par leurs termes de plus haut degré, puis on simplifie le quotient obtenu.

Pour un numérateur de degré $p$, de coefficient dominant $a$, et un dénominateur de degré $q$, de coefficient dominant $b\neq0$ :

| Comparaison | Conclusion |
|---|---|
| $p<q$ | la limite est $0$ |
| $p=q$ | la limite est $a/b$ |
| $p>q$ | on étudie le signe et la limite de $(a/b)x^{p-q}$ |

La dernière ligne ne donne pas toujours $+\infty$ : le coefficient, la parité et le côté étudié comptent.`,[
   application("ta-rational-infinite-example","Simplifier avant de conclure",[
    ["a)",r`$\displaystyle\lim_{x\to-\infty}\frac{7x^3-x^2+5}{4x^2-2x+3}$.`,r`Les termes de plus haut degré sont $7x^3$ et $4x^2$. Leur quotient vaut $\frac74x$ :
$$\lim_{x\to-\infty}\frac{7x^3-x^2+5}{4x^2-2x+3}=\lim_{x\to-\infty}\frac74x=\boxed{-\infty}.$$`],
   ]),
  ]),
 ]},
 {id:"ta-functions-operations",numeral:"III",title:"Opérations sur les limites",topics:[
  topic("ta-limits-sum","Limite d’une somme",[7,8],r`On suppose que les limites de $f$ et de $g$ sont connues au point étudié, qui peut être un réel ou l’infini. Les lettres $\ell$ et $\ell'$ désignent des nombres réels.

| Limite de $f$ | Limite de $g$ | Limite de $f+g$ |
|---|---|---|
| $\ell$ | $\ell'$ | $\ell+\ell'$ |
| $\ell$ | $+\infty$ | $+\infty$ |
| $\ell$ | $-\infty$ | $-\infty$ |
| $+\infty$ | $+\infty$ | $+\infty$ |
| $-\infty$ | $-\infty$ | $-\infty$ |
| $+\infty$ | $-\infty$ | on ne peut pas conclure directement |

Les mêmes règles valent si on échange les deux fonctions. Une forme indéterminée n’est **pas** un résultat : il faut transformer l’expression.`,[
   application("ta-sum-example","Calculer séparément les deux limites",[
    ["a)",r`$\displaystyle\lim_{x\to-2}\left(\frac{2x+3}{x+1}+x-8\right)$.`,r`En $-2$, $x+1=-1\neq0$. Donc :
$$\lim_{x\to-2}\frac{2x+3}{x+1}=\frac{-4+3}{-2+1}=1.$$
De plus, $\lim_{x\to-2}(x-8)=-10$. Par la règle de la somme :
$$\lim_{x\to-2}\left(\frac{2x+3}{x+1}+x-8\right)=1-10=\boxed{-9}.$$`],
   ]),
  ]),
  topic("ta-limits-product","Limite d’un produit",[8,9],r`### Propriété

- Le produit de deux limites réelles est le produit des deux nombres.
- Une limite réelle **non nulle** multipliée par une limite infinie donne une limite infinie : on applique la règle des signes.
- Deux limites infinies se multiplient également avec la règle des signes.
- Une fonction qui tend vers $0$ multipliée par une fonction de limite réelle tend vers $0$.
- **$0\times\infty$ est une forme indéterminée.**

| Situation | Exemple de conclusion |
|---|---|
| $\ell>0$ et $g\to+\infty$ | $fg\to+\infty$ |
| $\ell<0$ et $g\to+\infty$ | $fg\to-\infty$ |
| $\ell>0$ et $g\to-\infty$ | $fg\to-\infty$ |
| $\ell<0$ et $g\to-\infty$ | $fg\to+\infty$ |
| $f\to0$ et $g\to\ell$ | $fg\to0$ |`,[
   application("ta-product-example","Multiplier seulement après avoir identifié chaque limite",[
    ["a)",r`$\displaystyle\lim_{x\to+\infty}\frac{x+6}{x-4}(6-x)$.`,r`Les deux polynômes du quotient ont le même degré. Le quotient tend donc vers $1$. Par ailleurs, $6-x\to-\infty$. Ainsi :
$$\lim_{x\to+\infty}\frac{x+6}{x-4}(6-x)=\boxed{-\infty}.$$`],
   ]),
  ]),
  topic("ta-limits-inverse-quotient","Inverse et quotient",[9,10],r`### Limite d’un inverse

| Limite de $g$ | Information de signe | Limite de $1/g$ |
|---|---|---|
| $\ell\neq0$ | — | $1/\ell$ |
| $+\infty$ ou $-\infty$ | — | $0$ |
| $0$ | $g>0$ près du point | $+\infty$ |
| $0$ | $g<0$ près du point | $-\infty$ |

### Méthode pour un quotient

Si le dénominateur tend vers une limite non nulle, on divise les limites. S’il tend vers zéro et si le numérateur tend vers un nombre **non nul**, on écrit :
$$\frac{f(x)}{g(x)}=f(x)\times\frac1{g(x)}.$$
On détermine ensuite le signe de $g(x)$ du côté demandé. Les formes $0/0$ et $\infty/\infty$ ne permettent pas de conclure directement.`,[
   application("ta-quotient-example","Un numérateur négatif et un dénominateur positif proche de zéro",[
    ["a)",r`$\displaystyle\lim_{x\to6^+}\frac{x-8}{x-6}$.`,r`Quand $x\to6^+$, $x-8\to-2$ et $x-6\to0$ par valeurs positives. Donc $1/(x-6)\to+\infty$. Par la règle du produit :
$$\lim_{x\to6^+}\frac{x-8}{x-6}=\boxed{-\infty}.$$`],
   ]),
  ]),
 ]},
 {id:"ta-functions-asymptotes",numeral:"IV",title:"Asymptotes et position de la courbe",topics:[
  topic("ta-asymptote-horizontal","Asymptote horizontale",[10,11],r`### Définition

Si $\lim_{x\to+\infty}f(x)=b$, la droite d’équation **$y=b$** est une asymptote horizontale à la courbe de $f$ au voisinage de $+\infty$.

On formule la même définition en $-\infty$. Une propriété vérifiée à une extrémité ne doit pas être affirmée automatiquement à l’autre.

**Repère :** pour une droite horizontale, on écrit $y=\dots$, pas $x=\dots$.`,[
   application("ta-horizontal-example","Interpréter une limite finie",[
    ["a)",r`Pour $f(x)=\dfrac{3x-2}{x-1}$, déterminer l’asymptote horizontale en $+\infty$.`,r`Le numérateur et le dénominateur sont du premier degré. Donc :
$$\lim_{x\to+\infty}f(x)=\frac31=3.$$
**La droite $y=3$ est donc une asymptote horizontale en $+\infty$.**`],
   ]),
  ]),
  topic("ta-asymptote-vertical","Asymptote verticale",[11,12],r`### Définition

Si la fonction tend vers $+\infty$ ou $-\infty$ quand $x$ se rapproche de $a$, au moins d’un côté, sa courbe admet une asymptote verticale d’équation **$x=a$**.

Une valeur interdite ne suffit pas à elle seule : il faut établir une limite infinie. Par exemple, $(x^2-x)/(2x-2)=x/2$ pour $x\neq1$ a une limite finie en $1$.`,[
   application("ta-vertical-example","Une asymptote et deux limites latérales",[
    ["a)",r`Étudier $f(x)=\dfrac{3x-4}{x-5}$ près de $5$.`,r`Le domaine est $\mathbb R\setminus\{5\}$. Le numérateur tend vers $3\times5-4=11>0$.

- À gauche, $x-5\to0^-$, donc $f(x)\to-\infty$.
- À droite, $x-5\to0^+$, donc $f(x)\to+\infty$.

Ainsi, **la droite $x=5$ est une asymptote verticale**.`],
   ]),
  ]),
  topic("ta-asymptote-oblique","Asymptote oblique et position relative",[12,13,27,28],r`### Propriété

La droite $y=ax+b$, avec $a\neq0$, est une asymptote oblique à la courbe en $+\infty$ si :
$$\lim_{x\to+\infty}\bigl[f(x)-(ax+b)\bigr]=0.$$
On utilise la même propriété en $-\infty$.

### Position de la courbe

On étudie le signe de **$f(x)-(ax+b)$** sur le domaine :

- différence positive : la courbe est au-dessus de la droite ;
- différence négative : elle est au-dessous ;
- différence nulle : les deux se rencontrent.

Une asymptote n’est donc pas une droite que la courbe n’a jamais le droit de couper.`,[
   application("ta-oblique-examples","Justifier l’asymptote, puis comparer les positions",[
    ["a)",r`Pour $f(x)=\dfrac{2x^2+3x-1}{x+2}$, justifier l’asymptote $y=2x-1$.`,r`Pour $x\neq-2$, on vérifie l’identité :
$$2x^2+3x-1=(x+2)(2x-1)+1.$$
Donc $f(x)=2x-1+1/(x+2)$, puis :
$$f(x)-(2x-1)=\frac1{x+2}.$$
Cette différence tend vers $0$ en $-\infty$ et en $+\infty$. **La droite $y=2x-1$ est asymptote aux deux extrémités.**`],
    ["b)",r`Pour $h(x)=x-8+\dfrac1{x-3}$, situer la courbe par rapport à $y=x-8$.`,r`On soustrait l’équation de la droite :
$$h(x)-(x-8)=\frac1{x-3}.$$
Pour $x<3$, $x-3<0$, donc la différence est négative : **la courbe est au-dessous**.

Pour $x>3$, la différence est positive : **la courbe est au-dessus**.`],
   ]),
  ]),
 ]},
 {id:"ta-functions-derivatives",numeral:"V",title:"Dérivation, variations et extrema",topics:[
  topic("ta-derivative-reference","Dérivées des fonctions usuelles",[13,14],r`Pour dériver, on conserve toujours le domaine sur lequel la formule est valable.

| Fonction | Dérivée | Domaine de dérivation |
|---|---|---|
| $x\mapsto k$ | $0$ | $\mathbb R$ |
| $x\mapsto ax$ | $a$ | $\mathbb R$ |
| $x\mapsto x^2$ | $2x$ | $\mathbb R$ |
| $x\mapsto x^n$, $n\geq1$ | $nx^{n-1}$ | $\mathbb R$ |
| $x\mapsto1/x$ | $-1/x^2$ | $\mathbb R\setminus\{0\}$ |
| $x\mapsto1/x^n$, $n\geq1$ | $-n/x^{n+1}$ | $\mathbb R\setminus\{0\}$ |

**Le signe moins dans la dérivée de l’inverse est indispensable.**`,[
   application("ta-reference-derivatives","Dériver terme par terme",[
    ["a)",r`$f(x)=-6$ et $g(x)=8x$.`,r`Une constante a pour dérivée zéro et la dérivée de $ax$ est $a$. Donc $\boxed{f'(x)=0}$ et $\boxed{g'(x)=8}$.`],
    ["b)",r`$h(x)=x^2$ et $l(x)=x^3$.`,r`On applique $(x^n)'=nx^{n-1}$ : $\boxed{h'(x)=2x}$ et $\boxed{l'(x)=3x^2}$.`],
    ["c)",r`$m(x)=1/x$ et $k(x)=1/x^3$, pour $x\neq0$.`,r`La règle de l’inverse donne $\boxed{m'(x)=-1/x^2}$. Pour la puissance $3$, $\boxed{k'(x)=-3/x^4}$.`],
   ]),
  ]),
  topic("ta-derivative-rules","Opérations sur les dérivées",[14,15],r`Soient $u$ et $v$ dérivables sur l’intervalle considéré, $k$ un réel et $n\geq1$ un entier.

| Expression | Dérivée | Condition supplémentaire |
|---|---|---|
| $u+v$ | $u'+v'$ | — |
| $ku$ | $ku'$ | — |
| $uv$ | $u'v+uv'$ | — |
| $u^n$ | $nu'u^{n-1}$ | — |
| $1/u$ | $-u'/u^2$ | $u\neq0$ |
| $u/v$ | $(u'v-uv')/v^2$ | $v\neq0$ |

**Un quotient ne se dérive pas en divisant les dérivées.** Pour éviter une erreur de signe, conserve les parenthèses au numérateur jusqu’au développement.`,[
   application("ta-derivative-operations-examples","Deux calculs de dérivées",[
    ["a)",r`$f(x)=-5x^3+7x^2-8$.`,r`Le polynôme est dérivable sur $\mathbb R$. On dérive chaque terme :
$$f'(x)=-5\times3x^2+7\times2x-0=\boxed{-15x^2+14x}.$$`],
    ["b)",r`$g(x)=\dfrac{x-4}{5x+3}$, pour $x\neq-3/5$.`,r`On pose $u(x)=x-4$ et $v(x)=5x+3$, donc $u'(x)=1$ et $v'(x)=5$.
$$g'(x)=\frac{1(5x+3)-5(x-4)}{(5x+3)^2}.$$
On développe le numérateur : $5x+3-5x+20=23$. Ainsi :
$$\boxed{g'(x)=\frac{23}{(5x+3)^2}}.$$`],
   ]),
  ]),
  topic("ta-derivative-variation","Passer du signe de la dérivée aux variations",[15,16,17],r`### Propriétés sur un intervalle

Soit $f$ dérivable sur un intervalle $I$.

- Si $f'(x)\geq0$ sur $I$, alors $f$ est croissante sur $I$.
- Si $f'(x)\leq0$ sur $I$, alors $f$ est décroissante sur $I$.
- Si $f'(x)=0$ pour tout $x\in I$, alors $f$ est constante sur $I$.
- En particulier, $f'>0$ sur $I$ garantit une croissance stricte ; $f'<0$ garantit une décroissance stricte.

Le tableau de signes doit être établi **sur le domaine**. Si une valeur est interdite, on sépare les deux intervalles : on ne décrit pas une variation en traversant un point où la fonction n’existe pas.

### Construire le tableau

1. Calculer $f'$ et la factoriser si cela simplifie le signe.
2. Placer les zéros de $f'$ et les valeurs interdites.
3. Étudier le signe de chaque facteur.
4. Reporter les variations et les valeurs ou limites aux bornes.`),
  topic("ta-relative-extrema","Reconnaître un maximum ou un minimum relatif",[16,17],r`Un **maximum relatif** est une valeur de $f$ plus grande que les valeurs voisines. Un **minimum relatif** est une valeur plus petite que les valeurs voisines.

Pour $a$ à l’intérieur d’un intervalle de dérivabilité :

| Signe de $f'$ de part et d’autre de $a$ | Conclusion |
|---|---|
| $+$ puis $-$ | maximum relatif $f(a)$ |
| $-$ puis $+$ | minimum relatif $f(a)$ |

**Attention : $f'(a)=0$ seul ne suffit pas.** Par exemple, pour $f(x)=x^3$, $f'(0)=0$, mais la fonction reste croissante : elle n’a pas d’extremum en $0$.

Un extremum **relatif** concerne un voisinage ; un maximum sur tout le domaine est une information plus forte.`,[
   application("ta-extrema-example","Étudier $f(x)=x-2+1/x$",[
    ["a)","Domaine et dérivée.",r`Il faut $x\neq0$. Pour un tel $x$ :
$$f'(x)=1-\frac1{x^2}=\frac{(x-1)(x+1)}{x^2}.$$
Le dénominateur est strictement positif : le signe dépend du produit $(x-1)(x+1)$.`],
    ["b)","Variations et extrema.",r`$f'$ est positive sur $]-\infty;-1[$ et $]1;+\infty[$ ; elle est négative sur $]-1;0[$ et $]0;1[$.

| $x$ | $-\infty$ | $-1$ | $0^-$ | $0^+$ | $1$ | $+\infty$ |
|---|---|---|---|---|---|---|
| $f$ | $-\infty\nearrow$ | $-4$ | $\searrow-\infty$ | $+\infty\searrow$ | $0$ | $\nearrow+\infty$ |

Au point $-1$, le signe passe de $+$ à $-$ : $f(-1)=-4$ est un maximum relatif. Au point $1$, il passe de $-$ à $+$ : $f(1)=0$ est un minimum relatif.`],
   ]),
  ]),
 ]},
 {id:"ta-functions-tangent-roots",numeral:"VI",title:"Tangentes et résolution approchée",topics:[
  topic("ta-tangent","Écrire l’équation d’une tangente",[17],r`Si $f$ est dérivable en $a$, la tangente à sa courbe au point $A(a;f(a))$ a pour coefficient directeur $f'(a)$.

### Formule

$$\boxed{y=f'(a)(x-a)+f(a)}.$$

On calcule d’abord **$f(a)$** et **$f'(a)$**, puis on remplace dans cette formule.`,[
   application("ta-tangent-example","Tangente à une parabole",[
    ["a)",r`Pour $f(x)=-x^2-2$, calculer $f(1)$ et $f'(1)$.`,r`$f(1)=-1-2=-3$. La dérivée est $f'(x)=-2x$, donc $f'(1)=-2$.`],
    ["b)","Donner l’équation de la tangente au point d’abscisse $1$.",r`On remplace $a$, $f(a)$ et $f'(a)$ :
$$y=-2(x-1)-3=-2x+2-3.$$
Ainsi $\boxed{y=-2x-1}$. Pour vérifier, à $x=1$ on obtient bien $y=-3$.`],
   ]),
  ]),
  topic("ta-intermediate-values","Prouver l’existence et l’unicité d’une solution",[17,18],r`### Théorème des valeurs intermédiaires · Existence

Si $f$ est continue sur $[a;b]$ et si $f(a)$ et $f(b)$ sont de signes contraires, alors l’équation $f(x)=0$ possède **au moins une solution** dans $]a;b[$.

### Unicité

Si, en plus, $f$ est **strictement monotone** sur $[a;b]$, cette solution est **unique**.

La continuité permet de ne pas « sauter » la valeur zéro. La monotonie stricte garantit qu’elle n’est pas atteinte deux fois. **On justifie les deux points séparément.**`,[
   application("ta-root-example","Une solution entre $0,8$ et $0,9$",[
    ["a)",r`Pour $f(x)=x^3-12x+10$, prouver qu’il existe une unique solution $\alpha$ de $f(x)=0$ sur $[0;1]$.`,r`$f$ est un polynôme, donc continue sur $[0;1]$. De plus, $f(0)=10>0$ et $f(1)=-1<0$ : le théorème donne l’existence d’une solution dans $]0;1[$.

Pour $0\leq x\leq1$, $f'(x)=3x^2-12\leq-9<0$. La fonction est donc strictement décroissante : **la solution est unique**.`],
    ["b)",r`Encadrer $\alpha$ au dixième.`,r`Calculons les valeurs aux deux bornes proposées :
$$f(0{,}8)=0{,}512-9{,}6+10=0{,}912>0,$$
$$f(0{,}9)=0{,}729-10{,}8+10=-0{,}071<0.$$
La solution unique est donc dans cet intervalle : $\boxed{0{,}8<\alpha<0{,}9}$.`],
   ]),
  ]),
  topic("ta-bisection","Encadrer par dichotomie",[18,19],r`On part d’un intervalle $[a;b]$ sur lequel $f$ est continue et dont les valeurs aux extrémités sont de signes contraires.

1. Calculer le milieu $m=(a+b)/2$.
2. Si $f(m)=0$, la solution a été trouvée.
3. Sinon, garder la moitié dont les deux extrémités ont des images de signes contraires.
4. Recommencer jusqu’à obtenir la largeur d’intervalle demandée.

Chaque étape divise la largeur par deux. Pour parler de **la** solution recherchée, on établit aussi son unicité sur l’intervalle de départ.`,[
   application("ta-bisection-example","Première étape de la dichotomie",[
    ["a)",r`Pour $f(x)=x^3-12x+10$, partir de $[0;1]$.`,r`Le milieu est $m=0,5$. On calcule :
$$f(0{,}5)=0{,}125-6+10=4{,}125>0.$$
Or $f(1)=-1<0$. On garde donc la moitié $[0,5;1]$ et l’on obtient $\boxed{0{,}5<\alpha<1}$.`],
   ]),
  ]),
  topic("ta-scanning","Encadrer par balayage",[19],r`Le balayage consiste à calculer les valeurs de $f$ à pas régulier : $a$, $a+h$, $a+2h$, etc.

Lorsqu’on rencontre deux valeurs consécutives de signes contraires, la continuité garantit une solution entre les deux abscisses. Si l’unicité est déjà établie, cet intervalle encadre la solution cherchée.`,[
   application("ta-scanning-example","Un balayage au pas de $0,1$",[
    ["a)",r`Encadrer la solution de $x^3-3x=0$ appartenant à $[1;2]$.`,r`La fonction $f(x)=x^3-3x$ est continue. Sur $[1;2]$, elle est strictement croissante ; de plus $f(1)=-2$ et $f(2)=2$ : il existe une unique solution.

Au pas de $0,1$, on obtient $f(1,7)=4,913-5,1=-0,187$ et $f(1,8)=5,832-5,4=0,432$. Donc :
$$\boxed{1{,}7<\alpha<1{,}8}.$$`],
   ]),
  ]),
 ]},
 {id:"ta-functions-study",numeral:"VII",title:"Conduire une étude complète",topics:[
  topic("ta-complete-study","Organiser une étude de fonction",[20,25,26,27,28],r`Pour une fonction rationnelle, cet ordre permet d’expliquer la courbe sans oublier une étape :

1. **Domaine** : résoudre la condition « dénominateur non nul ».
2. **Limites** : étudier chaque borne, avec deux limites latérales près d’une valeur interdite.
3. **Asymptotes** : interpréter les limites et calculer la différence avec une droite oblique si nécessaire.
4. **Dérivée et signe** : calculer $f'$ puis dresser son tableau de signes.
5. **Variations** : placer les images, extrema et limites dans un même tableau.
6. **Repères du tracé** : points, position par rapport aux asymptotes et éventuelles symétries.

### Reconnaître un centre de symétrie

Le point $A(a;b)$ est un centre de symétrie de la courbe si le domaine est symétrique par rapport à $a$ et si, pour tout $h$ admissible :
$$f(a+h)+f(a-h)=2b.$$
La vérification du domaine fait partie du raisonnement.`),
 ]},
];
