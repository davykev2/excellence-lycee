import { tf } from "./builders";
import { sequenceExercise as ex, seqWritten as w, seqValue as s, seqLimit as lim } from "./terminalCSequencesBuilders";

export const sequencesFixationB = [
  ex(14, "Reconnaître une condition de convergence", "Dans chaque cas, l’affirmation est : « La suite admet une limite réelle finie ». Réponds Vrai ou Faux.", [
    tf("1.", String.raw`Pour $n>1$, $0<u_n<1/\sqrt n$.`, true, String.raw`Les deux bornes $0$ et $1/\sqrt n$ tendent vers $0$. Par les gendarmes, **$u_n\to0$**. L’affirmation est vraie.`),
    tf("2.", String.raw`Pour $n\ge0$, $|u_n|\le e^{-n}$.`, true, String.raw`$-e^{-n}\le u_n\le e^{-n}$ et les deux bornes tendent vers $0$. Donc **$u_n\to0$** : vrai.`),
    tf("3.", String.raw`Pour $n\ge1$, $u_n<1/n$.`, false, String.raw`Une seule borne supérieure ne suffit pas. Prenons $u_n=0$ aux rangs pairs et $u_n=-n$ aux rangs impairs. Tous les termes vérifient $u_n<1/n$, mais les termes pairs restent à $0$ et les termes impairs tendent vers $-\infty$. La suite n’a même pas de limite infinie. **Faux.**`),
    tf("4.", String.raw`Pour $n\ge1$, $|u_n|\le\ln n/n$.`, true, String.raw`$\ln n/n\to0$ par croissance comparée. L’encadrement de la valeur absolue donne **$u_n\to0$**. Vrai.`),
  ]),
  ex(15, "Quatre convergences", String.raw`Étudie la convergence des suites, pour $n\ge1$.`, [
    lim("a)", String.raw`$u_n=\sqrt{n^4+n^3}/(n+1)^2$.`, "1", String.raw`Puisque $n>0$, $\sqrt{n^4+n^3}=n^2\sqrt{1+1/n}$ et $(n+1)^2=n^2(1+1/n)^2$. Ainsi :

$$u_n=\frac{\sqrt{1+1/n}}{(1+1/n)^2}\longrightarrow\frac1{1}=1.$$

**La suite converge vers $1$.**`),
    lim("b)", String.raw`$u_n=(\sqrt n-5)/(\sqrt n+3)$.`, "1", String.raw`Divisons les deux membres par $\sqrt n>0$ :

$$u_n=\frac{1-5/\sqrt n}{1+3/\sqrt n}\longrightarrow1.$$

**La suite converge vers $1$.**`),
    lim("c)", String.raw`$u_n=2^n/n!$.`, "0", String.raw`Pour $n\ge3$, les termes sont positifs et :

$$\frac{u_{n+1}}{u_n}=\frac2{n+1}\le\frac12.$$

Par récurrence, $0<u_n\le u_3(1/2)^{n-3}$. Le majorant géométrique tend vers $0$. Par les gendarmes, **$u_n\to0$**. Le quotient qui tend vers $0$ ne doit pas remplacer cette justification.`),
    s("d)", String.raw`$u_n=(1+2/n)^n$ : donne sa limite.`, "$e^2$", ["e^2", "e²", "exp(2)"], String.raw`Tous les termes sont positifs. Prenons le logarithme, puis posons $h=2/n$ :

$$\ln u_n=n\ln(1+2/n)=2\frac{\ln(1+h)}h.$$

Quand $n\to+\infty$, $h\to0^+$ et $\ln(1+h)/h\to1$. Donc $\ln u_n\to2$ ; par continuité de l’exponentielle, **$u_n\to e^2$**.`),
  ], { sourcePage: 152 }),
  ex(16, "Croissances comparées", String.raw`Calcule les limites quand $n\to+\infty$ ; les expressions sont prises pour $n\ge2$.`, [
    lim("a)", String.raw`$u_n=\sqrt n/\ln n$.`, "+infini", String.raw`La croissance comparée donne $\ln n/\sqrt n\to0$. Pour $n\ge2$, ce quotient est positif. Son inverse tend donc vers **$+\infty$**.`),
    lim("b)", String.raw`$v_n=n^2-3^{n+1}$.`, "-infini", String.raw`Factorisons :

$$v_n=3^{n+1}\left(\frac{n^2}{3^{n+1}}-1\right).$$

La croissance comparée donne $n^2/3^{n+1}\to0$ ; la parenthèse tend vers $-1$, tandis que $3^{n+1}\to+\infty$. **$v_n\to-\infty$.**`),
    lim("c)", String.raw`$w_n=n2^n/3^n$.`, "0", String.raw`$$w_n=n\left(\frac23\right)^n=\frac n{(3/2)^n}.$$

Comme $3/2>1$, l’exponentielle domine $n$. **La limite est $0$.**`),
  ]),
  ex(17, "Comparer malgré les oscillations", "Calcule les limites des deux suites.", [
    lim("a)", String.raw`$u_n=-n+\sin n$.`, "-infini", String.raw`$\sin n\le1$, donc $u_n\le1-n$. Le majorant tend vers $-\infty$. Par comparaison, **$u_n\to-\infty$**.`),
    lim("b)", String.raw`$v_n=(-1)^n+n^2$.`, "+infini", String.raw`$(-1)^n\ge-1$, donc $v_n\ge n^2-1$. Le minorant tend vers $+\infty$. Par comparaison, **$v_n\to+\infty$**.`),
  ]),
  ex(18, "Un encadrement de valeur absolue", String.raw`Pour $n\ge1$, $u_n=[2-(-1)^n]/(n\sqrt n+1)$.`, [
    w("1.", String.raw`Démontre que $|u_n|\le3/(n\sqrt n)$.`, String.raw`$(-1)^n$ vaut $1$ ou $-1$, donc $2-(-1)^n$ vaut $1$ ou $3$. Le numérateur est positif, inférieur ou égal à $3$.

Comme $n\sqrt n+1>n\sqrt n>0$ :

$$|u_n|=\frac{2-(-1)^n}{n\sqrt n+1}\le\frac3{n\sqrt n+1}\le\frac3{n\sqrt n}.$$`),
    lim("2.", "Déduis-en la limite de la suite.", "0", String.raw`$3/(n\sqrt n)=3/n^{3/2}\to0$. L’encadrement $-|3/n^{3/2}|\le u_n\le3/n^{3/2}$ donne par les gendarmes **$u_n\to0$**.`),
  ]),
  ex(19, "Reconnaître une suite arithmétique", String.raw`$u_0=-5$ et $u_{n+1}=u_n+1$.`, [
    w("1.", "Détermine la nature de la suite.", String.raw`La différence de deux termes consécutifs est constante :

$$u_{n+1}-u_n=1.$$

**La suite est arithmétique de raison $1$ et de premier terme $u_0=-5$.** Sa formule est $u_n=-5+n$.`),
  ]),
  ex(20, "Reconnaître une suite géométrique", String.raw`$u_1=\sqrt3$ et $u_{n+1}=\frac23u_n$ pour $n\ge1$.`, [
    w("1.", "Détermine la nature de la suite.", String.raw`Chaque terme s’obtient en multipliant le précédent par le même nombre $2/3$. **La suite est géométrique de raison $2/3$ et de premier terme $u_1=\sqrt3$.**

Comme le premier rang est $1$, sa formule est $u_n=\sqrt3(2/3)^{n-1}$.`),
  ]),
  ex(21, "Retrouver premier terme et raison", String.raw`La suite $(U_n)_{n\ge1}$ est arithmétique. On sait que $U_7+U_8+U_9=12$ et $U_4+U_8=-4$.`, [
    s("a)", "Calcule la raison r.", "$3$", ["3"], String.raw`Trois termes arithmétiques consécutifs ont pour somme trois fois le terme du milieu. Donc $3U_8=12$, soit $U_8=4$. Alors $U_4=-4-4=-8$.

$$U_8-U_4=(8-4)r\iff4-(-8)=4r.$$

Ainsi **$r=3$**.`),
    s("b)", "Calcule U₁.", "$-17$", ["-17"], String.raw`Il y a sept accroissements de $U_1$ à $U_8$ :

$$U_1=U_8-7r=4-7\times3=\boxed{-17}.$$`),
  ]),
  ex(22, "Une somme de seize termes", String.raw`La suite $(U_n)$ est arithmétique, $U_4=8$ et $U_7=-1$.`, [
    s("1.", String.raw`Calcule $S_{15}=U_0+\cdots+U_{15}$.`, "$-40$", ["-40"], String.raw`La raison est $r=(U_7-U_4)/(7-4)=(-1-8)/3=-3$.

$$U_0=U_4-4r=8+12=20,\qquad U_{15}=20-45=-25.$$

De $0$ à $15$, il y a **$16$ termes**. Ainsi :

$$S_{15}=16\frac{20-25}{2}=\boxed{-40}.$$`),
  ]),
  ex(23, "Retrouver un rang à partir d’une somme", String.raw`La suite est arithmétique : $U_0=5$, $U_n=-28$ et $S_n=U_0+\cdots+U_n=-138$.`, [
    s("1.", "Détermine n.", "$11$", ["11"], String.raw`La somme comprend $n+1$ termes, de premier terme $5$ et de dernier terme $-28$ :

$$-138=(n+1)\frac{5-28}{2}=-\frac{23}2(n+1).$$

Donc $n+1=276/23=12$, d’où **$n=11$**. Une raison $r=(-28-5)/11=-3$ vérifie bien les données.`),
  ]),
  ex(24, "Une puissance de un demi", String.raw`La suite est géométrique de raison $1/2$, avec $U_0=4$.`, [
    s("1.", String.raw`Détermine le rang $n$ tel que $U_n=1/4$.`, "$4$", ["4"], String.raw`$$U_n=4(1/2)^n=1/4\iff(1/2)^n=1/16=(1/2)^4.$$

Les puissances de $1/2$ sont strictement décroissantes : **l’unique rang est $n=4$**.`),
  ]),
  ex(25, "Une somme géométrique de onze termes", String.raw`$U_n=2^n/3$, pour $n\ge0$.`, [
    s("1.", String.raw`Calcule $S_{10}=U_0+\cdots+U_{10}$.`, "$2047/3$", ["2047/3"], String.raw`Le premier terme est $1/3$, la raison $2$, et la somme contient $11$ termes.

$$S_{10}=\frac13\frac{1-2^{11}}{1-2}=\frac{2048-1}{3}=\boxed{\frac{2047}{3}}.$$`),
  ]),
  ex(26, "Repérer le dernier exposant", "Calcule les deux sommes.", [
    s("a)", String.raw`$S=1+1/3+1/9+\cdots+1/59049$.`, "$88573/59049$", ["88573/59049", "177146/118098"], String.raw`$59049=3^{10}$. La somme va donc de $(1/3)^0$ à $(1/3)^{10}$ et contient $11$ termes.

$$S=\frac{1-3^{-11}}{1-1/3}=\frac32(1-3^{-11})=\boxed{\frac{88573}{59049}}.$$`),
    s("b)", String.raw`$R=1+2+4+\cdots+16384$.`, "$32767$", ["32767"], String.raw`$16384=2^{14}$, donc il y a $15$ termes.

$$R=\frac{1-2^{15}}{1-2}=2^{15}-1=\boxed{32767}.$$`),
  ]),
  ex(27, "Trois termes consécutifs", "Trois termes arithmétiques consécutifs ont pour somme 51 et pour produit 4301. Détermine-les.", [
    w("1.", "Détermine les triplets possibles, dans leur ordre.", String.raw`Écrivons ces termes $a-r$, $a$, $a+r$. Leur somme vaut $3a=51$, donc **$a=17$**.

Le produit donne :

$$17(17-r)(17+r)=4301.$$
$$17(289-r^2)=4301\iff289-r^2=253\iff r^2=36.$$

Ainsi $r=6$ ou $r=-6$. Les deux triplets ordonnés sont **$(11;17;23)$ et $(23;17;11)$**. Leur produit vaut bien $11\times17\times23=4301$.`),
  ]),
];
