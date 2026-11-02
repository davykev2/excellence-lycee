import { sequenceExercise as ex, seqWritten as w, seqValue as s, seqLimit as lim } from "./terminalCSequencesBuilders";

export const sequencesDeepeningB = [
  ex(39, "Différences successives et convergence", String.raw`$U_0=4$ et $U_{n+1}=\frac12U_n-3$. Le repère est orthonormé.`, [
    w("1.", "Construis les cinq premiers termes sur l’axe des abscisses.", String.raw`Calculons successivement :

$$U_0=4,\quad U_1=2-3=-1,\quad U_2=-\frac12-3=-\frac72.$$
$$U_3=-\frac74-3=-\frac{19}4,\quad U_4=-\frac{19}8-3=-\frac{43}8.$$

Place les abscisses **$4$ ; $-1$ ; $-3{,}5$ ; $-4{,}75$ ; $-5{,}375$**, avec leurs indices. Les termes se déplacent vers $-6$.`),
    w("2.a", String.raw`Démontre que, pour $n\ge1$, $U_{n+1}-U_n=\frac12(U_n-U_{n-1})$.`, String.raw`Écrivons la récurrence à deux rangs consécutifs :

$$U_{n+1}=\frac12U_n-3,\qquad U_n=\frac12U_{n-1}-3.$$

Soustrayons membre à membre. Les constantes s’annulent, d’où **$U_{n+1}-U_n=(U_n-U_{n-1})/2$**.`),
    w("2.b", String.raw`Déduis-en $U_{n+1}-U_n=-5(1/2)^n$ pour $n\ge0$.`, String.raw`Posons $d_n=U_{n+1}-U_n$. La question précédente donne $d_n=d_{n-1}/2$ pour $n\ge1$. La suite des différences est donc géométrique de raison $1/2$.

Son premier terme est $d_0=U_1-U_0=-1-4=-5$. Donc **$d_n=-5(1/2)^n$**.`),
    w("2.c", "Quel est le sens de variation de Uₙ ?", String.raw`$(1/2)^n>0$ à tout rang, donc $U_{n+1}-U_n=-5(1/2)^n<0$. **La suite est strictement décroissante.**`),
    w("3.a", String.raw`Démontre que, pour $n\ge1$, $U_n+6=\frac12(U_{n-1}+6)$.`, String.raw`La récurrence au rang $n-1$ donne $U_n=U_{n-1}/2-3$. En ajoutant $6$ :

$$U_n+6=\frac12U_{n-1}+3=\boxed{\frac12(U_{n-1}+6)}.$$`),
    w("3.b", String.raw`Déduis-en $U_n+6=(U_0+6)(1/2)^n$.`, String.raw`La suite $W_n=U_n+6$ est géométrique de raison $1/2$, avec $W_0=U_0+6=10$. Ainsi :

$$W_n=W_0(1/2)^n=10(1/2)^n.$$

Donc **$U_n+6=(U_0+6)(1/2)^n$**, puis $U_n=-6+10(1/2)^n$. Au rang $0$, cette formule redonne bien $U_0=4$.`),
    s("3.c", "Calcule la limite de Uₙ.", "$-6$", ["-6"], String.raw`$(1/2)^n\to0$. Dans la formule $U_n=-6+10(1/2)^n$, le second terme tend vers $0$. **La limite vaut $-6$.**`),
  ], { sourcePage: 153, correctionFigureKey: "tc-l6-sequences" }),
  ex(40, "Une récurrence quadratique", String.raw`$U_0=1/3$, $U_{n+1}=\frac32U_n^2$ et $V_n=\ln(\frac32U_n)$.`, [
    s("1.", "Calcule V₀.", String.raw`$-\ln2$`, ["-ln2", "-ln(2)", "ln(1/2)"], String.raw`$V_0=\ln((3/2)(1/3))=\ln(1/2)=\boxed{-\ln2}$.`),
    w("2.", String.raw`Démontre que $(V_n)$ est géométrique de raison $2$.`, String.raw`$U_0>0$ et la récurrence conserve la positivité, donc les logarithmes existent.

$$V_{n+1}=\ln\left(\frac32\times\frac32U_n^2\right)
=\ln\left[\left(\frac32U_n\right)^2\right]=2V_n.$$

**La raison géométrique est $2$.**`),
    w("3.", "Exprime Vₙ en fonction de n.", String.raw`La formule d’une suite géométrique donne $V_n=V_0\,2^n$, donc **$V_n=-2^n\ln2$**.`),
    lim("4.", "Calcule la limite de Vₙ.", "-infini", String.raw`$2^n\to+\infty$ et $-\ln2<0$. Donc **$V_n=-2^n\ln2\to-\infty$**.`),
    w("5.a", "Exprime Uₙ en fonction de Vₙ.", String.raw`En exponentiant $V_n=\ln((3/2)U_n)$, on obtient $(3/2)U_n=e^{V_n}$. Ainsi **$U_n=(2/3)e^{V_n}=(2/3)2^{-2^n}$**.`),
    lim("5.b", "Déduis-en la limite de Uₙ.", "0", String.raw`$V_n\to-\infty$, donc $e^{V_n}\to0$. **$U_n=(2/3)e^{V_n}\to0$.**`),
    w("6.a", String.raw`Pour $n\ge1$, $S_n=V_0+\cdots+V_{n-1}$. Démontre que $S_n=(1-2^n)\ln2$.`, String.raw`Il y a $n$ termes de raison $2$, à partir de $V_0=-\ln2$ :

$$S_n=-\ln2\,\frac{1-2^n}{1-2}=\boxed{(1-2^n)\ln2}.$$`),
    w("6.b", String.raw`Pour $T_n=U_0U_1\cdots U_{n-1}$, justifie $T_n=(2/3)^ne^{S_n}$.`, String.raw`Chaque facteur est $U_k=(2/3)e^{V_k}$. Le produit de $n$ facteurs donne :

$$T_n=\left(\frac23\right)^n e^{V_0+\cdots+V_{n-1}}
=\boxed{\left(\frac23\right)^ne^{S_n}}.$$`),
    w("6.c", "Exprime Tₙ uniquement en fonction de n.", String.raw`D’après a), $e^{S_n}=e^{(1-2^n)\ln2}=2^{1-2^n}$. Donc :

$$\boxed{T_n=\left(\frac23\right)^n2^{\,1-2^n}.}$$

Pour $n=1$, cela donne $(2/3)2^{-1}=1/3=U_0$, ce qui vérifie le décalage d’indice.`),
  ]),
  ex(41, "Termes vers zéro, sommes vers l’infini", String.raw`$U_0=1$, $U_{n+1}=U_ne^{-U_n}$ et $S_n=\sum_{p=0}^nU_p$.`, [
    w("1.a", String.raw`Démontre que $U_n>0$ à tout rang.`, String.raw`**Initialisation.** $U_0=1>0$. **Hérédité.** Si $U_k>0$, alors $e^{-U_k}>0$ et $U_{k+1}=U_ke^{-U_k}>0$. Par récurrence, **tous les termes sont strictement positifs**.`),
    w("1.b", "Démontre que la suite décroît.", String.raw`Puisque $U_n>0$, on a $-U_n<0$, donc $0<e^{-U_n}<1$. En multipliant par $U_n>0$, **$0<U_{n+1}<U_n$**. La suite est strictement décroissante.`),
    lim("1.c", "Prouve la convergence et donne sa limite.", "0", String.raw`La suite est décroissante et minorée par $0$, donc converge vers un réel $\ell\ge0$.

La fonction $x\mapsto xe^{-x}$ est continue. On passe à la limite :

$$\ell=\ell e^{-\ell}\iff\ell(1-e^{-\ell})=0.$$

Si $\ell>0$, on pourrait diviser et obtenir $e^{-\ell}=1$, donc $\ell=0$, contradiction. L’unique possibilité est **$\ell=0$**.`),
    w("2.a", String.raw`Démontre que $U_{n+1}=e^{-S_n}$.`, String.raw`On peut démontrer l’égalité par récurrence.

**Au rang $0$ :** $U_1=e^{-1}=e^{-S_0}$.

**Hérédité :** si $U_{k+1}=e^{-S_k}$, alors :

$$U_{k+2}=U_{k+1}e^{-U_{k+1}}
=e^{-(S_k+U_{k+1})}=e^{-S_{k+1}}.$$

Donc **$U_{n+1}=e^{-S_n}$ pour tout $n\ge0$**.`),
    lim("2.b", "Déduis-en la limite de Sₙ.", "+infini", String.raw`Les termes $U_{n+1}$ sont positifs et tendent vers $0$. En prenant le logarithme de l’identité précédente :

$$S_n=-\ln U_{n+1}.$$

Comme $\ln U_{n+1}\to-\infty$, **$S_n\to+\infty$**. Cette identité est essentielle : le seul fait que $U_n\to0$ ne suffit pas à déterminer la limite des sommes.`),
  ]),
  ex(42, "Somme des cubes", String.raw`Pour $n\ge1$, pose $C_n=1^3+2^3+\cdots+n^3$.`, [
    w("1.", String.raw`Démontre que $C_n=n^2(n+1)^2/4$.`, String.raw`**Initialisation.** Pour $n=1$, $C_1=1=1^2\times2^2/4$.

**Hérédité.** Supposons $C_k=k^2(k+1)^2/4$. Alors :

$$C_{k+1}=C_k+(k+1)^3
=\frac{(k+1)^2}{4}\left(k^2+4(k+1)\right).$$

Or $k^2+4k+4=(k+2)^2$. Ainsi :

$$C_{k+1}=\frac{(k+1)^2(k+2)^2}{4}.$$

La formule est donc vraie **pour tout entier $n\ge1$**.`),
  ]),
  ex(43, "Somme de produits consécutifs", String.raw`Pour $n\ge1$, $A_n=1\times2+2\times3+\cdots+n(n+1)$.`, [
    w("1.", String.raw`Démontre que $A_n=n(n+1)(n+2)/3$.`, String.raw`**Initialisation.** $A_1=1\times2=2=1\times2\times3/3$.

**Hérédité.** Si $A_k=k(k+1)(k+2)/3$, alors :

$$A_{k+1}=A_k+(k+1)(k+2).$$
$$A_{k+1}=\frac{(k+1)(k+2)}3(k+3)
=\frac{(k+1)(k+2)(k+3)}3.$$

On retrouve la formule au rang $k+1$. **Elle est vraie pour tout $n\ge1$.**`),
  ]),
  ex(44, "Divisibilité par huit", String.raw`Pour tout entier $n\ge0$, considère $3^{2n}-1$.`, [
    w("1.", "Démontre par récurrence que ce nombre est un multiple de 8.", String.raw`**Initialisation.** Pour $n=0$, $3^0-1=0=8\times0$ est un multiple de $8$.

**Hérédité.** Supposons $3^{2k}-1=8a$ avec $a$ entier. Alors :

$$3^{2(k+1)}-1=9\cdot3^{2k}-1
=9(3^{2k}-1)+8.$$
$$3^{2(k+1)}-1=9\times8a+8=8(9a+1).$$

$9a+1$ est entier. Par récurrence, **$3^{2n}-1$ est divisible par $8$ pour tout $n\ge0$**.`),
  ]),
  ex(45, "Centrer une récurrence affine", String.raw`$u_0=2$, $u_{n+1}=u_n/3+2$ et $v_n=u_n-3$.`, [
    w("1.", "Démontre que V est une suite géométrique.", String.raw`$$v_{n+1}=\frac13u_n+2-3=\frac13(u_n-3)=\frac13v_n.$$

La suite est géométrique de **raison $1/3$** et de premier terme **$v_0=2-3=-1$**. Donc $v_n=-(1/3)^n$.`),
    lim("2.a", "Détermine la limite de vₙ.", "0", String.raw`$0<1/3<1$, donc $(1/3)^n\to0$. Ainsi **$v_n\to0$**.`),
    s("2.b", "Détermine la limite de uₙ.", "$3$", ["3"], String.raw`$u_n=v_n+3$. Par somme de limites, **$u_n\to3$**.`),
  ]),
  ex(46, "Termes et somme d’une progression", String.raw`$u_0=-5$ et $u_{n+1}=u_n+3/2$. Le repère est orthonormé.`, [
    w("1.", "Exprime uₙ en fonction de n.", String.raw`La suite est arithmétique de raison $3/2$ et de premier rang $0$. Donc **$u_n=-5+3n/2$**.`),
    w("2.", "Représente les cinq premiers termes sur (OI).", String.raw`Pour $n=0,1,2,3,4$, on obtient **$-5$ ; $-7/2$ ; $-2$ ; $-1/2$ ; $1$**. Place-les dans cet ordre croissant sur l’axe, avec les noms $u_0$ à $u_4$.`),
    s("3.", String.raw`Calcule $u_0+u_1+\cdots+u_{20}$.`, "$210$", ["210"], String.raw`Le dernier terme est $u_{20}=-5+30=25$. La somme contient $20-0+1=21$ termes.

$$S=21\frac{-5+25}{2}=\boxed{210}.$$`),
  ], { correctionFigureKey: "tc-l6-sequences" }),
  ex(47, "Caractérisation d’une suite arithmétique", String.raw`Pour tout $n\ge1$, $u_{n-1}+u_{n+1}=2u_n$.`, [
    w("1.", "Démontre que la suite est arithmétique.", String.raw`Réarrangeons la relation :

$$u_{n+1}-u_n=u_n-u_{n-1}.$$

Si l’on pose $d_n=u_{n+1}-u_n$, cette égalité devient $d_n=d_{n-1}$ pour $n\ge1$. Toutes les différences sont donc égales à $d_0=u_1-u_0$.

Ainsi **$u_{n+1}-u_n$ est constant**, ce qui caractérise une suite arithmétique. Sa raison est $u_1-u_0$.`),
  ]),
];
