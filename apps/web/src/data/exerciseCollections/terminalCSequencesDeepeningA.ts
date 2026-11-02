import { sequenceExercise as ex, seqWritten as w, seqValue as s, seqLimit as lim } from "./terminalCSequencesBuilders";

export const sequencesDeepeningA = [
  ex(28, "Cinq termes géométriques", String.raw`$u_1,u_2,u_3,u_4,u_5$ sont cinq termes consécutifs d’une suite géométrique de raison $q$.`, [
    w("a)", String.raw`Montre que $u_1u_5=u_3^2$.`, String.raw`Par définition, $u_3=u_1q^2$ et $u_5=u_1q^4$. Donc :

$$u_1u_5=u_1^2q^4=(u_1q^2)^2=\boxed{u_3^2}.$$

Cette identité ne nécessite pas de diviser par un terme.`),
    w("b)", String.raw`Détermine les termes sachant que $u_1u_5=25$, $u_2+u_3+u_4=35/2$ et $u_3>0$.`, String.raw`D’après a), $u_3^2=25$. Puisque $u_3>0$, **$u_3=5$**. Aucun terme n’est nul, donc $q\ne0$.

$$u_2+u_3+u_4=\frac5q+5+5q=\frac{35}2.$$

En divisant par $5$, puis en multipliant par $2q$ :

$$q+1+\frac1q=\frac72\iff2q^2-5q+2=0.$$

Or $2q^2-5q+2=(2q-1)(q-2)$, donc $q=2$ ou $q=1/2$.

Les deux listes ordonnées sont **$(5/4;5/2;5;10;20)$** et **$(20;10;5;5/2;5/4)$**.`),
  ]),
  ex(29, "Une suite arithmétique décroissante", String.raw`$u_0=3$ et $u_{n+1}=u_n-4$.`, [
    w("1.", "Quelle est la nature de la suite ?", String.raw`$u_{n+1}-u_n=-4$ est constant. **La suite est arithmétique, de raison $-4$ et de premier terme $u_0=3$.**`),
    s("2.a", "Calcule u₁.", "$-1$", ["-1"], String.raw`$u_1=3-4=\boxed{-1}$.`),
    s("2.b", "Calcule u₂.", "$-5$", ["-5"], String.raw`$u_2=u_1-4=-1-4=\boxed{-5}$.`),
    w("3.", "Étudie le sens de variation.", String.raw`La différence $u_{n+1}-u_n=-4$ est strictement négative. **La suite est strictement décroissante.**`),
    w("4.", "Exprime uₙ en fonction de n.", String.raw`Une suite arithmétique de premier rang $0$ vérifie $u_n=u_0+nr$. Donc **$u_n=3-4n$**.`),
    w("5.a", String.raw`Calcule $S=u_0+u_1+\cdots+u_n$.`, String.raw`Il y a $n+1$ termes :

$$S=(n+1)\frac{u_0+u_n}{2}=(n+1)\frac{3+(3-4n)}2.$$

Ainsi **$S=(n+1)(3-2n)$**.`),
    w("5.b", String.raw`Pour $n\ge2$, calcule $S'=u_2+u_3+\cdots+u_n$.`, String.raw`Il y a $n-1$ termes, de premier terme $u_2=-5$ et de dernier terme $3-4n$.

$$S'=(n-1)\frac{-5+3-4n}{2}=\boxed{-(n-1)(2n+1)}.$$

Au rang $n=2$, la formule donne $-5$, comme le terme unique $u_2$.`),
  ]),
  ex(30, "Somme, logarithme et produit", String.raw`$u_1=3$ et $u_{n+1}=\frac12u_n$ pour $n\ge1$.`, [
    w("1.", "Quelle est la nature de la suite ?", String.raw`Chaque terme est multiplié par $1/2$. **La suite est géométrique de raison $1/2$, de premier terme $u_1=3$.**`),
    s("2.a", "Calcule u₂.", "$3/2$", ["3/2", "1.5"], String.raw`$u_2=u_1/2=\boxed{3/2}$.`),
    s("2.b", "Calcule u₃.", "$3/4$", ["3/4", "0.75"], String.raw`$u_3=u_2/2=\boxed{3/4}$.`),
    w("3.", "Étudie le sens de variation.", String.raw`Tous les termes sont positifs et $u_{n+1}=u_n/2<u_n$. **La suite est strictement décroissante.**`),
    w("4.", "Exprime uₙ en fonction de n.", String.raw`Le premier rang est $1$, donc **$u_n=3(1/2)^{n-1}$**. L’exposant $n-1$ permet bien de retrouver $u_1=3$.`),
    w("5.", String.raw`Calcule $S=u_1+\cdots+u_n$.`, String.raw`Il y a $n$ termes de raison $1/2$ :

$$S=3\frac{1-(1/2)^n}{1-1/2}=\boxed{6(1-2^{-n})}.$$`),
    w("6.a", String.raw`On pose $v_n=\ln u_n$. Démontre que $(v_n)$ est arithmétique ; précise sa raison et son premier terme.`, String.raw`Les termes $u_n$ sont positifs, donc leur logarithme existe.

$$v_{n+1}=\ln(u_n/2)=\ln u_n-\ln2=v_n-\ln2.$$

La suite $(v_n)$ est **arithmétique de raison $-\ln2$**, et **$v_1=\ln3$**. On a $v_n=\ln3-(n-1)\ln2$.`),
    w("6.b", String.raw`Calcule $P=u_1u_2\cdots u_n$.`, String.raw`En prenant le logarithme du produit :

$$\ln P=v_1+\cdots+v_n=n\ln3-\left(0+1+\cdots+(n-1)\right)\ln2.$$

La somme des entiers de $0$ à $n-1$ vaut $n(n-1)/2$. En exponentiant :

$$\boxed{P=3^n\,2^{-n(n-1)/2}.}$$

On retrouve aussi cette formule en multipliant directement les $n$ expressions de $u_k$.`),
  ]),
  ex(31, "Une récurrence affine et son point fixe", String.raw`$U_0=0$ et $U_{n+1}=\frac35U_n+1$.`, [
    w("1.", "Représente U₀, U₁, U₂ et U₃ sur l’axe des abscisses d’un repère orthonormé (unité 2 cm).", String.raw`$$U_0=0,\quad U_1=1,\quad U_2=\frac35+1=\frac85.$$
$$U_3=\frac35\times\frac85+1=\frac{49}{25}.$$

Place **$0$ ; $1$ ; $1{,}6$ ; $1{,}96$** sur l’axe avec les indices correspondants. Sur papier, une unité de l’axe représente $2$ cm ; l’écran représente les mêmes abscisses sans imposer une longueur physique.`),
    w("2.a", String.raw`Démontre par récurrence que $U_n\le5/2$.`, String.raw`**Initialisation.** $U_0=0\le5/2$.

**Hérédité.** Si $U_k\le5/2$, alors $U_{k+1}\le(3/5)(5/2)+1=5/2$.

Donc **$U_n\le5/2$ pour tout $n\ge0$**. On peut en même temps prouver $U_n\ge0$, car la récurrence conserve la positivité.`),
    w("2.b", "Démontre que la suite converge.", String.raw`Calculons :

$$U_{n+1}-U_n=1-\frac25U_n=\frac25\left(\frac52-U_n\right)\ge0.$$

La suite est croissante et majorée par $5/2$. **Elle converge** par le théorème de convergence monotone.`),
    w("3.a", String.raw`On pose $V_n=U_n-5/2$. Démontre que $(V_n)$ est géométrique ; précise sa raison et $V_0$.`, String.raw`$$V_{n+1}=\frac35U_n+1-\frac52=\frac35\left(U_n-\frac52\right)=\frac35V_n.$$

Donc $(V_n)$ est géométrique de **raison $3/5$** et de premier terme **$V_0=-5/2$**.`),
    w("3.b", "Exprime Vₙ puis Uₙ en fonction de n.", String.raw`$$V_n=-\frac52\left(\frac35\right)^n.$$

Comme $U_n=V_n+5/2$ :

$$\boxed{U_n=\frac52\left(1-\left(\frac35\right)^n\right).}$$`),
    s("3.c", "Détermine la limite de Uₙ.", "$5/2$", ["5/2", "2.5"], String.raw`$0<3/5<1$, donc $(3/5)^n\to0$. La formule précédente donne **$U_n\to5/2$**.`),
  ], { sourcePage: 152, correctionFigureKey: "tc-l6-sequences" }),
  ex(32, "Un terme affine en n dans la récurrence", String.raw`$U_0=2/3$ et $U_{n+1}=\frac12U_n+\frac{n+2}{2\sqrt2}$.`, [
    w("1.", "Calcule U₁ et U₂.", String.raw`$$U_1=\frac13+\frac1{\sqrt2}.$$
$$U_2=\frac12\left(\frac13+\frac1{\sqrt2}\right)+\frac3{2\sqrt2}
=\frac16+\frac2{\sqrt2}=\boxed{\frac16+\sqrt2}.$$`),
    w("2.", String.raw`On pose $V_n=\sqrt2U_n-n$. Démontre qu’elle est géométrique, puis précise sa raison et $V_0$.`, String.raw`Remplaçons $n$ par $n+1$ dans toute la définition :

$$V_{n+1}=\sqrt2U_{n+1}-(n+1).$$
$$V_{n+1}=\frac{\sqrt2}2U_n+\frac{n+2}2-n-1
=\frac12(\sqrt2U_n-n)=\frac12V_n.$$

La raison est **$1/2$** et **$V_0=2\sqrt2/3$**.`),
    w("3.a", "Calcule Vₙ puis Uₙ en fonction de n.", String.raw`$$V_n=\frac{2\sqrt2}3\,2^{-n}.$$

De $\sqrt2U_n=V_n+n$, on tire :

$$\boxed{U_n=\frac n{\sqrt2}+\frac23\,2^{-n}.}$$`),
    lim("3.b", "Étudie la convergence de Uₙ.", "+infini", String.raw`Dans la formule explicite, $n/\sqrt2\to+\infty$ et $(2/3)2^{-n}\to0$. Donc **$U_n\to+\infty$** : la suite n’est pas convergente vers un réel.`),
    w("4.a", String.raw`Exprime $S_{0,n}=U_0+\cdots+U_n$ en fonction de n.`, String.raw`Additionnons séparément les deux termes de la formule explicite :

$$S_{0,n}=\frac1{\sqrt2}\sum_{k=0}^n k+\frac23\sum_{k=0}^n2^{-k}.$$

La première somme vaut $n(n+1)/2$ et la seconde $2(1-2^{-(n+1)})$. Ainsi :

$$\boxed{S_{0,n}=\frac{n(n+1)}{2\sqrt2}+\frac43(1-2^{-(n+1)}).}$$`),
    lim("4.b", "Calcule la limite de S₀,ₙ.", "+infini", String.raw`Le terme $n(n+1)/(2\sqrt2)$ tend vers $+\infty$, tandis que l’autre terme tend vers $4/3$. **$S_{0,n}\to+\infty$.**`),
  ]),
  ex(33, "Somme des carrés", String.raw`Pour $n\ge1$, $S_n=1^2+2^2+\cdots+n^2$.`, [
    s("a.1", "Calcule S₁.", "$1$", ["1"], String.raw`Il n’y a que le premier carré : $S_1=1^2=\boxed1$.`),
    s("a.2", "Calcule S₂.", "$5$", ["5"], String.raw`On ajoute le deuxième carré : $S_2=1^2+2^2=1+4=\boxed5$.`),
    s("a.3", "Calcule S₃.", "$14$", ["14"], String.raw`On ajoute $3^2=9$ à $S_2$ : $S_3=5+9=\boxed{14}$.`),
    s("a.4", "Calcule S₄.", "$30$", ["30"], String.raw`On ajoute $4^2=16$ à $S_3$ : $S_4=14+16=\boxed{30}$.`),
    w("b)", String.raw`Exprime $S_{n+1}$ en fonction de $S_n$.`, String.raw`La nouvelle somme contient tous les termes de $S_n$, puis le carré du rang suivant :

$$\boxed{S_{n+1}=S_n+(n+1)^2.}$$`),
    w("c)", String.raw`Démontre que $S_n=n(n+1)(2n+1)/6$.`, String.raw`**Initialisation.** Pour $n=1$, la formule donne $1\times2\times3/6=1=S_1$.

**Hérédité.** Supposons $S_k=k(k+1)(2k+1)/6$. Avec b) :

$$S_{k+1}=\frac{k(k+1)(2k+1)}6+(k+1)^2.$$

Factorisons par $(k+1)/6$ :

$$S_{k+1}=\frac{k+1}6\left(k(2k+1)+6(k+1)\right).$$

La parenthèse vaut $2k^2+7k+6=(k+2)(2k+3)$. Donc :

$$S_{k+1}=\frac{(k+1)(k+2)(2(k+1)+1)}6.$$

La formule est vraie au rang suivant. **Elle est donc vraie pour tout $n\ge1$.**`),
  ]),
  ex(34, "Une récurrence à deux termes", String.raw`$U_0=1$, $U_1=2$ et $U_{n+2}=5U_{n+1}-6U_n$ pour $n\ge0$.`, [
    w("1.", String.raw`Démontre que $U_n=2^n$ pour tout $n\ge0$.`, String.raw`La récurrence utilise **deux termes précédents** ; il faut donc initialiser deux rangs.

**Initialisation.** $U_0=1=2^0$ et $U_1=2=2^1$.

**Hérédité.** Supposons $U_k=2^k$ et $U_{k+1}=2^{k+1}$. Alors :

$$U_{k+2}=5\times2^{k+1}-6\times2^k
=(10-6)2^k=4\times2^k=2^{k+2}.$$

La paire de propriétés se transmet. **$U_n=2^n$ à tout rang.**`),
  ]),
  ex(35, "Somme et somme des carrés", String.raw`$x,y,z$ sont, dans cet ordre, trois termes arithmétiques consécutifs. Leur somme vaut $9$ et la somme de leurs carrés vaut $59$.`, [
    w("1.", "Calcule les trois nombres, dans leur ordre.", String.raw`Écrivons $x=y-r$ et $z=y+r$. La somme donne $3y=9$, donc $y=3$.

$$x^2+y^2+z^2=(3-r)^2+9+(3+r)^2=27+2r^2.$$

Ainsi $27+2r^2=59$, d’où $r^2=16$ et $r=\pm4$. Les deux triplets ordonnés sont **$(-1;3;7)$** et **$(7;3;-1)$**. Dans les deux cas : $1+9+49=59$.`),
  ]),
  ex(36, "Une suite auxiliaire de raison négative", String.raw`$U_0=3$ et $U_{n+1}=2/(1+U_n)$. On pose $V_n=(U_n-1)/(U_n+2)$.`, [
    w("1.", String.raw`Démontre par récurrence que $0\le U_n\le3$.`, String.raw`**Initialisation.** $U_0=3$ appartient à $[0;3]$.

**Hérédité.** Si $0\le U_k\le3$, alors $1\le1+U_k\le4$. En inversant des nombres positifs :

$$\frac14\le\frac1{1+U_k}\le1,\qquad \frac12\le U_{k+1}\le2.$$

Cet intervalle est inclus dans $[0;3]$. La récurrence est définie et **$0\le U_n\le3$ pour tout $n$**.`),
    w("2.", "Démontre que Vₙ est géométrique.", String.raw`Le dénominateur $U_n+2$ est positif. En remplaçant $U_{n+1}$ :

$$V_{n+1}=\frac{2/(1+U_n)-1}{2/(1+U_n)+2}=\frac{1-U_n}{4+2U_n}
=-\frac12\frac{U_n-1}{U_n+2}.$$

Donc **$V_{n+1}=-V_n/2$** : la suite est géométrique de raison $-1/2$.`),
    w("3.a", "Exprime Vₙ en fonction de n.", String.raw`$V_0=(3-1)/(3+2)=2/5$. Donc **$V_n=(2/5)(-1/2)^n$**.`),
    lim("3.b", "Déduis-en la limite de Vₙ.", "0", String.raw`La raison vérifie $|-1/2|<1$, donc $(-1/2)^n\to0$. Ainsi **$V_n\to0$**.`),
    lim("4.", "Détermine la limite de Uₙ.", "1", String.raw`Partons de $V_n(U_n+2)=U_n-1$. On obtient $U_n(1-V_n)=1+2V_n$, donc :

$$U_n=\frac{1+2V_n}{1-V_n}.$$

Comme $V_n\to0$, le dénominateur tend vers $1\ne0$. **$U_n\to1$.** La suite oscille autour de $1$ ; on n’a pas besoin de lui attribuer une monotonie inexistante.`),
  ], { correctionFigureKey: "tc-l6-sequences" }),
  ex(37, "Transformer une racine par le logarithme", String.raw`$U_0=9e$, $U_{n+1}=3\sqrt{U_n}$ et $V_n=\ln(U_n/9)$.`, [
    w("1.", "Démontre que Vₙ est géométrique ; précise sa raison et V₀.", String.raw`$U_0>0$, et la récurrence conserve la stricte positivité : tous les logarithmes existent.

$$V_{n+1}=\ln\left(\frac{3\sqrt{U_n}}9\right)
=\ln\sqrt{\frac{U_n}9}=\frac12V_n.$$

La raison est **$1/2$**, et $V_0=\ln(9e/9)=\boxed1$.`),
    w("2.a", "Exprime Vₙ en fonction de n.", String.raw`Le premier rang est $0$, donc **$V_n=(1/2)^n$**.`),
    lim("2.b", "Détermine la limite de Vₙ.", "0", String.raw`$0<1/2<1$, donc **$V_n=(1/2)^n\to0$**.`),
    s("3.", "Détermine la limite de Uₙ.", "$9$", ["9"], String.raw`De $\ln(U_n/9)=V_n$, on tire $U_n=9e^{V_n}$. Puisque $V_n\to0$, la continuité de l’exponentielle donne **$U_n\to9e^0=9$**.`),
  ]),
  ex(38, "Une suite auxiliaire arithmétique", String.raw`$U_0=0$, $U_{n+1}=-4/(4+U_n)$ et $V_n=1/(2+U_n)$.`, [
    w("1.", String.raw`Démontre que $(V_n)$ est arithmétique de raison $1/2$.`, String.raw`Vérifions d’abord que $-2<U_n\le0$. C’est vrai au rang $0$. Si $-2<U_n\le0$, alors $2<4+U_n\le4$, d’où $-2<-4/(4+U_n)\le-1$. L’encadrement se transmet ; tous les dénominateurs sont non nuls.

$$V_{n+1}=\frac1{2-4/(4+U_n)}
=\frac{4+U_n}{2(U_n+2)}
=\frac12+\frac1{U_n+2}.$$

Donc **$V_{n+1}=V_n+1/2$**.`),
    w("2.", "Exprime Vₙ puis Uₙ en fonction de n.", String.raw`$V_0=1/2$, donc **$V_n=(n+1)/2$**. Comme $2+U_n=1/V_n$, on obtient :

$$\boxed{U_n=\frac2{n+1}-2.}$$`),
    s("3.a", "Calcule la limite de Uₙ.", "$-2$", ["-2"], String.raw`$2/(n+1)\to0$, donc **$U_n\to-2$**. Aucun terme n’atteint pourtant $-2$.`),
    lim("3.b", "Calcule la limite de Vₙ.", "+infini", String.raw`$V_n=(n+1)/2$ est une suite arithmétique de raison positive. **$V_n\to+\infty$.**`),
  ]),
];
