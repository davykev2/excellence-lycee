import { sequenceExercise as ex, seqWritten as w, seqValue as s, seqLimit as lim } from "./terminalCSequencesBuilders";

export const sequencesDeepeningC = [
  ex(48, "Deux suites qui se rapprochent", String.raw`$u_0=2$, $v_0=8$,
$u_{n+1}=(2u_n+v_n)/3$, $v_{n+1}=(u_n+3v_n)/4$. On pose $d_n=v_n-u_n$.`, [
    s("1.a", "Calcule u₁.", "$4$", ["4"], String.raw`$u_1=(2\times2+8)/3=12/3=\boxed4$.`),
    s("1.b", "Calcule v₁.", "$13/2$", ["13/2", "6.5"], String.raw`$v_1=(2+3\times8)/4=26/4=\boxed{13/2}$.`),
    w("2.a", "Démontre que dₙ est géométrique ; précise d₀ et sa raison.", String.raw`$$d_{n+1}=\frac{u_n+3v_n}{4}-\frac{2u_n+v_n}{3}
=\frac{3u_n+9v_n-8u_n-4v_n}{12}.$$

Donc **$d_{n+1}=(5/12)d_n$**. Le premier terme est **$d_0=8-2=6$** et la raison **$5/12$**.`),
    w("2.b", "Exprime dₙ en fonction de n.", String.raw`La formule géométrique donne **$d_n=6(5/12)^n$**.`),
    w("2.c", String.raw`Démontre que $d_n>0$.`, String.raw`$6>0$ et $5/12>0$, donc $6(5/12)^n>0$ à tout rang. **$d_n>0$, donc $u_n<v_n$.**`),
    lim("2.d", "Calcule la limite de dₙ.", "0", String.raw`$0<5/12<1$, donc $(5/12)^n\to0$. Ainsi **$d_n\to0$**.`),
    w("3.a", String.raw`Démontre que $u_{n+1}-u_n=d_n/3$ et $v_{n+1}-v_n=-d_n/4$.`, String.raw`$$u_{n+1}-u_n=\frac{2u_n+v_n-3u_n}{3}=\frac{v_n-u_n}{3}=\frac{d_n}{3}.$$
$$v_{n+1}-v_n=\frac{u_n+3v_n-4v_n}{4}=\frac{u_n-v_n}{4}=-\frac{d_n}{4}.$$`),
    w("3.b", "Déduis-en les variations des deux suites.", String.raw`Comme $d_n>0$, on a $u_{n+1}-u_n>0$ et $v_{n+1}-v_n<0$. **$(u_n)$ est strictement croissante et $(v_n)$ strictement décroissante.**`),
    w("3.c", String.raw`Démontre que, pour $n\ge1$, $u_0<u_n<v_n<v_0$.`, String.raw`La stricte croissance donne $u_0<u_n$ pour $n\ge1$. La positivité de $d_n=v_n-u_n$ donne $u_n<v_n$. La stricte décroissance donne $v_n<v_0$. En réunissant :

$$\boxed{2<u_n<v_n<8\qquad(n\ge1).}$$`),
    w("3.d", "Déduis-en que les deux suites convergent.", String.raw`$(u_n)$ est croissante et majorée par $8$ ; $(v_n)$ est décroissante et minorée par $2$. **Les deux suites convergent** par convergence monotone. Leurs limites sont égales, puisque $v_n-u_n=d_n\to0$.`),
    w("4.a", "Exprime uₙ en fonction de n en utilisant les différences de 3.a.", String.raw`D’après 3.a, $u_{k+1}-u_k=d_k/3=2(5/12)^k$. Sommons de $k=0$ à $n-1$ : les termes intermédiaires se compensent.

$$u_n-u_0=2\sum_{k=0}^{n-1}(5/12)^k
=2\frac{1-(5/12)^n}{1-5/12}.$$

Donc **$u_n=38/7-(24/7)(5/12)^n$**. Cette formule est aussi vraie pour $n=0$.`),
    s("4.b.1", "Calcule la limite de uₙ.", "$38/7$", ["38/7"], String.raw`Comme $(5/12)^n\to0$, **$u_n\to38/7$**.`),
    s("4.b.2", "Calcule la limite de vₙ.", "$38/7$", ["38/7"], String.raw`$v_n=u_n+d_n$ et $d_n\to0$. Donc **$v_n\to38/7$** également.

Vérification : $3u_{n+1}+4v_{n+1}=3u_n+4v_n=38$ ; si les deux limites valent $\ell$, alors $7\ell=38$.`),
  ], { correctionFigureKey: "tc-l6-sequences" }),
  ex(49, "Une fonction pour construire une suite", String.raw`$u_0=2$, $u_{n+1}=(4u_n-3)/u_n$. Sur $]0;+\infty[$, pose $f(x)=(4x-3)/x$. Sa courbe est $(C)$ ; $(D)$ est la droite $y=x$. Le repère est orthonormé, d’unité graphique 2 cm sur papier.`, [
    w("1.a", "Étudie les variations de f et donne son tableau de variation.", String.raw`Pour $x>0$, $f(x)=4-3/x$ et $f'(x)=3/x^2>0$. Donc **$f$ est strictement croissante**.

De plus, $f(x)\to-\infty$ quand $x\to0^+$ et $f(x)\to4$ quand $x\to+\infty$.

| $x$ | $0^+$ | | $+\infty$ |
| --- | --- | --- | --- |
| $f'(x)$ | | $+$ | |
| $f(x)$ | $-\infty$ | $\nearrow$ | $4$ |

La valeur $4$ n’est pas atteinte ; $x=0$ et $y=4$ sont les asymptotes.`),
    w("1.b", "Trace (C) et (D).", String.raw`Trace les asymptotes $x=0$ et $y=4$. La courbe est croissante, en dessous de $y=4$, et passe par $(1;1)$, $(2;5/2)$ et $(3;3)$. Trace aussi $(D):y=x$.

Les intersections vérifient $4-3/x=x$, donc $(x-1)(x-3)=0$ : elles sont **$(1;1)$ et $(3;3)$**. Le repère doit avoir la même unité sur les deux axes.`),
    w("1.c", "Construis u₀, u₁, u₂ et u₃ à l’aide des deux courbes.", String.raw`À partir de $u_0=2$ sur l’axe, monte jusqu’à $(C)$ : l’ordonnée obtenue est $u_1$. Va horizontalement jusqu’à $y=x$ : cette même valeur devient l’abscisse suivante. Recommence.

$$u_1=4-\frac32=\frac52,\quad
u_2=4-\frac3{5/2}=\frac{14}5,$$
$$u_3=4-\frac3{14/5}=\frac{41}{14}.$$

Les abscisses sont **$2$ ; $2{,}5$ ; $2{,}8$ ; environ $2{,}929$**. La construction suggère la limite $3$ ; il reste à la démontrer.`),
    w("2.a", String.raw`Démontre que $f([2;3[)\subset[2;3[$.`, String.raw`$f$ est croissante, $f(2)=5/2$ et $f(3)=3$. Donc, pour $2\le x<3$ :

$$\frac52\le f(x)<3.$$

Ainsi $f([2;3[)=[5/2;3[$, intervalle inclus dans $[2;3[$.`),
    w("2.b", String.raw`Déduis-en par récurrence que $2\le u_n<3$.`, String.raw`**Initialisation.** $u_0=2$ appartient à $[2;3[$.

**Hérédité.** Si $u_k$ appartient à cet intervalle, 2.a donne $u_{k+1}=f(u_k)\in[2;3[$.

La récurrence est toujours définie, car $u_k\ge2>0$. **$2\le u_n<3$ à tout rang.**`),
    w("2.c", "Démontre que la suite est strictement croissante.", String.raw`$$u_{n+1}-u_n=\frac{4u_n-3-u_n^2}{u_n}
=\frac{(u_n-1)(3-u_n)}{u_n}.$$

Comme $2\le u_n<3$, les trois facteurs utiles sont strictement positifs. **La différence est positive**, donc la suite est strictement croissante.`),
    w("2.d", "Déduis-en la convergence.", String.raw`La suite est croissante et majorée par $3$. **Elle converge** vers un réel $\ell\in[2;3]$ par le théorème de convergence monotone.`),
    w("3.a", String.raw`Pour $v_n=(u_n-3)/(u_n-1)$, démontre que $(v_n)$ est géométrique de raison $1/3$.`, String.raw`$u_n\ge2$, donc tous les dénominateurs sont non nuls.

$$v_{n+1}=\frac{4-3/u_n-3}{4-3/u_n-1}
=\frac{(u_n-3)/u_n}{3(u_n-1)/u_n}
=\frac13v_n.$$

La raison est **$1/3$** ; $v_0=(2-3)/(2-1)=-1$.`),
    lim("3.b", "Déduis-en la limite de vₙ.", "0", String.raw`$v_n=-(1/3)^n$. Comme $0<1/3<1$, **$v_n\to0$**.`),
    s("3.c", "Détermine la limite de uₙ.", "$3$", ["3"], String.raw`De $v_n(u_n-1)=u_n-3$, on tire :

$$u_n=\frac{3-v_n}{1-v_n}.$$

Le numérateur tend vers $3$ et le dénominateur vers $1$. **$u_n\to3$**. La limite respecte bien l’encadrement établi.`),
  ], { correctionFigureKey: "tc-l6-sequences" }),
  ex(50, "Une récurrence avec un terme en n", String.raw`$u_0=0$ et $u_{n+1}=3u_n-2n+3$.`, [
    s("1.a", "Calcule u₁.", "$3$", ["3"], String.raw`Au rang $n=0$, $u_1=3u_0-2\times0+3=\boxed3$.`),
    s("1.b", "Calcule u₂.", "$10$", ["10"], String.raw`Au rang $n=1$, $u_2=3u_1-2+3=9+1=\boxed{10}$.`),
    w("2.a", String.raw`Démontre par récurrence que $u_n\ge n$.`, String.raw`**Initialisation.** $u_0=0\ge0$.

**Hérédité.** Si $u_k\ge k$, alors :

$$u_{k+1}=3u_k-2k+3\ge3k-2k+3=k+3\ge k+1.$$

Donc **$u_n\ge n$ pour tout $n\ge0$**.`),
    lim("2.b", "Déduis-en la limite de uₙ.", "+infini", String.raw`Le minorant $n$ tend vers $+\infty$. Par comparaison, **$u_n\to+\infty$**.`),
    w("3.", "Démontre que la suite est croissante.", String.raw`$$u_{n+1}-u_n=2u_n-2n+3=2(u_n-n)+3.$$

D’après 2.a, $u_n-n\ge0$, donc la différence est au moins $3>0$. **La suite est même strictement croissante.**`),
    w("4.a", String.raw`On pose $v_n=u_n-n+1$. Démontre que $(v_n)$ est géométrique.`, String.raw`$$v_{n+1}=u_{n+1}-(n+1)+1
=3u_n-2n+3-n=3(u_n-n+1).$$

Donc **$v_{n+1}=3v_n$**, et $v_0=0-0+1=1$ : raison $3$, premier terme $1$.`),
    w("4.b", String.raw`Déduis-en $u_n=3^n+n-1$.`, String.raw`Comme $v_0=1$ et la raison vaut $3$, on a $v_n=3^n$. Or $u_n=v_n+n-1$. Donc **$u_n=3^n+n-1$**.`),
  ]),
  ex(51, "Un modèle de proportion", String.raw`Dans un modèle de sélection de souris de phénotype noir, on retire les souris blanches après chaque reproduction. La proportion modélisée de souris noires est $u_n$, avec $u_0=0{,}5$ et $u_{n+1}=(1+u_n)/(3-u_n)$.`, [
    s("1.", "Calcule u₁.", "$3/5$", ["3/5", "0.6"], String.raw`$$u_1=\frac{1+0{,}5}{3-0{,}5}=\frac{1{,}5}{2{,}5}=\boxed{\frac35}.$$

La proportion modélisée est donc **$60\,\%$** après cette étape.`),
    w("2.", String.raw`Pose $v_n=u_n-1$. Démontre que $(1/v_n)$ est arithmétique ; précise sa raison et son premier terme.`, String.raw`Pour $0<u_n<1$, on a $0<(1+u_n)/(3-u_n)<1$ ; par récurrence, tous les termes restent dans $]0;1[$. Ainsi $v_n<0$ et son inverse existe.

$$v_{n+1}=\frac{1+u_n}{3-u_n}-1=\frac{2(u_n-1)}{3-u_n}
=\frac{2v_n}{2-v_n}.$$

En inversant :

$$\frac1{v_{n+1}}=\frac{2-v_n}{2v_n}=\frac1{v_n}-\frac12.$$

La suite des inverses est **arithmétique de raison $-1/2$**, avec premier terme $1/v_0=1/(-1/2)=\boxed{-2}$.`),
    lim("3.", "Démontre la convergence de uₙ et donne sa limite.", "1", String.raw`D’après 2), $1/v_n=-2-n/2=-(n+4)/2$. Donc :

$$v_n=-\frac2{n+4},\qquad u_n=1-\frac2{n+4}.$$

Comme $2/(n+4)\to0$, **$u_n\to1$**.`),
    w("4.", "Interprète ce résultat du point de vue génétique, dans les limites du modèle.", String.raw`Dans ce modèle, la proportion de souris de **phénotype noir** tend vers $1$, soit $100\,\%$. Pour chaque rang fini, elle reste cependant inférieure à $1$.

**On ne peut pas conclure à une lignée génétiquement pure à partir de cette seule proportion.** Le modèle ne décrit ni les génotypes ni la disparition d’un allèle récessif : un animal noir peut encore porter cet allèle. La conclusion démontrée concerne uniquement la proportion de phénotypes noirs.`),
  ]),
  ex(52, "Convergence et erreur géométrique", String.raw`$u_0=0$ et $u_{n+1}=\sqrt{u_n+6}$. On utilise $f(x)=\sqrt{x+6}$, définie pour $x\ge-6$.`, [
    w("1.", "Démontre que tous les termes sont positifs ou nuls et majorés par 3.", String.raw`**Initialisation.** $u_0=0\in[0;3]$.

**Hérédité.** Si $0\le u_k\le3$, alors $6\le u_k+6\le9$. En prenant la racine :

$$0<\sqrt6\le u_{k+1}\le3.$$

Ainsi **$0\le u_n\le3$ à tout rang**. Les racines sont toujours définies ; les termes de rang au moins $1$ sont strictement positifs.`),
    w("2.a", "Étudie le sens de variation.", String.raw`La fonction $f$ est strictement croissante sur $[0;3]$. De plus, $u_1=\sqrt6>u_0=0$.

Si $u_{k+1}>u_k$, alors $u_{k+2}=f(u_{k+1})>f(u_k)=u_{k+1}$. Par récurrence, **la suite est strictement croissante**.`),
    s("2.b", "Prouve la convergence puis donne la limite.", "$3$", ["3"], String.raw`La suite est croissante et majorée par $3$, donc converge vers $\ell\in[0;3]$. La fonction $f$ est continue :

$$\ell=\sqrt{\ell+6}\iff\ell^2-\ell-6=0\iff(\ell-3)(\ell+2)=0.$$

Puisque $\ell\ge0$, la solution $-2$ est exclue. **La limite est $3$.**`),
    w("3.a", String.raw`Démontre que, sur $[0;3]$, $|f'(x)|\le1/3$.`, String.raw`Pour $x\in[0;3]$ :

$$f'(x)=\frac1{2\sqrt{x+6}}>0,\qquad
|f'(x)|\le\frac1{2\sqrt6}<\frac13.$$

La dernière inégalité vient de $2\sqrt6>3$, car $24>9$ après élévation au carré de nombres positifs. **La borne $1/3$ convient.**`),
    w("3.b", String.raw`Déduis-en $|u_{n+1}-3|\le\frac13|u_n-3|$.`, String.raw`Les deux nombres $u_n$ et $3$ appartiennent à $[0;3]$. La fonction $f$ y est continue et dérivable, avec $|f'|\le1/3$. L’inégalité des accroissements finis donne :

$$|f(u_n)-f(3)|\le\frac13|u_n-3|.$$

Puisque $f(u_n)=u_{n+1}$ et $f(3)=3$, on obtient exactement **$|u_{n+1}-3|\le|u_n-3|/3$**.`),
    w("4.a", String.raw`Démontre que $|u_n-3|\le3(1/3)^n$.`, String.raw`**Initialisation.** $|u_0-3|=3=3(1/3)^0$.

**Hérédité.** Si $|u_k-3|\le3(1/3)^k$, alors, par 3.b :

$$|u_{k+1}-3|\le\frac13|u_k-3|
\le\frac13\times3(1/3)^k=3(1/3)^{k+1}.$$

L’inégalité est vraie **pour tout $n\ge0$**.`),
    s("4.b", "Retrouve la limite avec cet encadrement.", "$3$", ["3"], String.raw`$3(1/3)^n\to0$ et $0\le|u_n-3|\le3(1/3)^n$. Les gendarmes donnent $|u_n-3|\to0$, donc **$u_n\to3$**. On dispose en plus d’une borne explicite de l’erreur.`),
  ], { correctionFigureKey: "tc-l6-sequences" }),
];
