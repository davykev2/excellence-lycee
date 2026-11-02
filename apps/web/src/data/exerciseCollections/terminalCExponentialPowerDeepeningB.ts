import { short, tf, written } from "./builders";
import { exponentialExercise as ex } from "./terminalCExponentialPowerBuilders";

export const exponentialDeepeningB = [
  ex(24, "Une asymptote qui est une courbe", String.raw`Soit $f(x)=\dfrac{e^{2x}}{e^x-1}$ et $\Gamma:y=1+e^x$.`, [
    written("1.", "Détermine le domaine et les limites à ses bornes.", String.raw`$e^x-1=0\iff x=0$, donc **$D_f=\mathbb R\setminus\{0\}$**. En $-\infty$, le numérateur tend vers $0$ et le dénominateur vers $-1$ : $f\to0^-$.

En $0$, le numérateur tend vers $1$ ; le dénominateur tend vers $0$ avec le signe de $x$. Ainsi **$f\to-\infty$ en $0^-$ et $f\to+\infty$ en $0^+$**.

En $+\infty$, $f=e^x/(1-e^{-x})\to+\infty$. Les asymptotes droites sont $x=0$ et $y=0$ en $-\infty$.`),
    written("2.", String.raw`Montre que $\Gamma$ est asymptote à $C_f$ en $+\infty$ et précise leur position.`, String.raw`Posons $t=e^x>0$, $t\ne1$. La division $t^2=(t-1)(t+1)+1$ donne

$$f(x)=e^x+1+\frac1{e^x-1}.$$

La différence avec $1+e^x$ tend vers $0$ en $+\infty$ : **$\Gamma$ est une asymptote curviligne**. La différence est positive pour $x>0$ et négative pour $x<0$. $C_f$ est donc au-dessus de $\Gamma$ à droite, au-dessous à gauche.`),
    written("3.", "Étudie les variations et trace les courbes.", String.raw`La règle du quotient donne **$f'=e^{2x}(e^x-2)/(e^x-1)^2$**. Le signe est celui de $e^x-2$. $f$ décroît sur $]-\infty;0[$ puis sur $]0;\ln2]$, et croît sur $[\ln2;+\infty[$. À droite, le minimum est **$f(\ln2)=4$**. Le tracé respecte les deux branches séparées par $x=0$ et la position relative démontrée.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(25, "Une fonction, une racine et sa réciproque", String.raw`Unité du repère : 4 cm. Partie A : $g(x)=1-x^2e^x$. Partie B : $f(x)=\dfrac{x}{1+xe^x}$.`, [
    written("A.1", "Calcule les limites de g en −∞ et +∞.", String.raw`En $-\infty$, $x^2e^x\to0$ par croissance comparée, donc **$g\to1$**. En $+\infty$, $x^2e^x\to+\infty$, donc **$g\to-\infty$**.`),
    written("A.2", String.raw`Calcule $g'$ et montre que $g'(x)=-x(x+2)e^x$.`, String.raw`La règle du produit donne $(x^2e^x)'=2xe^x+x^2e^x$. En factorisant et en tenant compte du signe moins : **$g'=-x(x+2)e^x$.**`),
    written("A.3", "Dresse le tableau de variation de g.", String.raw`$e^x>0$. La dérivée est négative sur $]-\infty;-2[$, positive sur $]-2;0[$, puis négative sur $]0;+\infty[$. Ainsi g décroît de $1$ à $1-4/e^2>0$, croît jusqu’à $g(0)=1$, puis décroît vers $-\infty$.`),
    written("A.4", String.raw`Prouve que $g(x)=0$ possède une unique solution positive $\alpha$, avec $0,70<\alpha<0,71$.`, String.raw`Sur $]0;+\infty[$, g est continue et strictement décroissante, de $1$ vers $-\infty$. Le théorème des valeurs intermédiaires donne exactement une racine. $g(0{,}70)\approx0{,}0133>0$ et $g(0{,}71)\approx-0{,}0253<0$, donc **$0{,}70<\alpha<0{,}71$**. Numériquement, $\alpha\approx0{,}703467$.`),
    written("A.5", "Déduis le signe de g sur R.", String.raw`La partie négative de l’axe ne contient aucune racine : son minimum vaut $1-4/e^2>0$. Avec la variation sur $]0;+\infty[$, on conclut **$g>0$ avant $\alpha$, $g(\alpha)=0$, $g<0$ après $\alpha$.**`),
    written("B.1", String.raw`Étudie $h(x)=1+xe^x$ et démontre que f est définie sur R.`, String.raw`$h'=(x+1)e^x$ : h décroît jusqu’à $-1$, puis croît. Son minimum vaut **$h(-1)=1-1/e>0$**. Le dénominateur de f ne s’annule jamais ; **$D_f=\mathbb R$.**`),
    written("B.2", "Calcule les limites de f et interprète en +∞.", String.raw`En $-\infty$, $xe^x\to0$, donc $f=x/(1+xe^x)\to-\infty$. En $+\infty$, on écrit $f=1/(1/x+e^x)$, d’où **$f\to0$**. La droite $y=0$ est une asymptote horizontale en $+\infty$.`),
    written("B.3.a", String.raw`Montre que $f'(x)=g(x)/(1+xe^x)^2$.`, String.raw`Le quotient donne

$$f'(x)=\frac{1+xe^x-x(1+x)e^x}{(1+xe^x)^2}=\frac{1-x^2e^x}{(1+xe^x)^2}.$$

Le numérateur est précisément $g(x)$.`),
    written("B.3.b", "Déduis le signe de f′ et le tableau de variation.", String.raw`Le dénominateur de $f'$ est strictement positif. $f'$ a donc le signe de g : **f croît sur $]-\infty;\alpha]$ puis décroît sur $[\alpha;+\infty[$**. Son maximum est $f(\alpha)$ ; les limites sont $-\infty$ à gauche et $0$ à droite.`),
    written("B.4", "Démontre que y = x est asymptote en −∞.", String.raw`La différence est

$$f(x)-x=\frac{-x^2e^x}{1+xe^x}.$$

Le numérateur tend vers $0$, le dénominateur vers $1$ en $-\infty$. **La différence tend vers 0**, donc $y=x$ est asymptote. La différence est négative pour $x\ne0$ : la courbe est au-dessous de cette droite.`),
    written("B.5", String.raw`Prouve $f(\alpha)=\alpha^2/(\alpha+1)$ et encadre ce maximum à $10^{-2}$ près.`, String.raw`$g(\alpha)=0$ donne $e^\alpha=1/\alpha^2$. Donc

$$f(\alpha)=\frac{\alpha}{1+1/\alpha}=\frac{\alpha^2}{\alpha+1}.$$

La fonction $t^2/(t+1)$ est croissante pour $t>0$. Avec $0{,}70<\alpha<0{,}71$, on obtient $0{,}2882<f(\alpha)<0{,}2949$, ce qui ne choisit pas encore un unique intervalle centésimal. Un pas supplémentaire donne $0{,}7034<\alpha<0{,}7035$, puis **$0{,}29<f(\alpha)<0{,}30$**.`),
    written("B.6", "Trace Cf avec ses repères.", String.raw`On place $O(0;0)$, la tangente de pente $f'(0)=1$, le maximum $(\alpha;\alpha^2/(\alpha+1))$, puis les asymptotes $y=x$ à gauche et $y=0$ à droite. La courbe est positive pour $x>0$, négative pour $x<0$.`),
    written("C.1.a", String.raw`Pour $k=f_{|[\alpha;+\infty[}$, justifie la bijection.`, String.raw`Sur $[\alpha;+\infty[$, f est continue et strictement décroissante de $m=f(\alpha)$ vers $0$, sans atteindre $0$. **k est donc une bijection de $[\alpha;+\infty[$ sur $]0;m]$.**`),
    written("C.1.b", "Dresse le tableau de variation de k⁻¹.", String.raw`La réciproque est **strictement décroissante**. Lorsque $y$ va de $0^+$ à $m$, $k^{-1}(y)$ décroît de $+\infty$ à $\alpha$.`),
    written("C.2.a", String.raw`Justifie que $k^{-1}$ n’a pas de dérivée finie en $m=\alpha^2/(\alpha+1)$.`, String.raw`La tangente à Cf en $\alpha$ est horizontale : $k'(\alpha)=0$. Pour $x>\alpha$, le taux de la réciproque est $(x-\alpha)/(k(x)-k(\alpha))$, inverse d’un taux qui tend vers $0^-$ ; il tend donc vers $-\infty$. **Il n’existe pas de dérivée finie au bord y=m.** La courbe réciproque y a une demi-tangente verticale.`),
    written("C.2.b", String.raw`Calcule $k(1)$ et la dérivée de $k^{-1}$ en $1/(1+e)$.`, String.raw`Comme $1>\alpha$, $k(1)=1/(1+e)$. Puis $k'(1)=(1-e)/(1+e)^2\ne0$. La formule de la réciproque donne

$$\boxed{(k^{-1})'\left(\frac1{1+e}\right)=\frac{(1+e)^2}{1-e}.}$$`),
    written("C.2.c", "Trace la courbe réciproque.", String.raw`Dans un repère orthonormal, on prend la symétrique de la branche $x\ge\alpha$ par rapport à **$y=x$**. Le point $(\alpha;m)$ devient $(m;\alpha)$ et la tangente horizontale devient verticale.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(26, "Une fonction auxiliaire pour une étude complète", String.raw`$f(x)=(2x+4)e^{-x/2}-x$ et $h(x)=x+e^{x/2}$. Repère orthonormal, unité 2 cm.`, [
    written("A.1", "Étudie les variations de h.", String.raw`$h'=1+\frac12e^{x/2}>0$ sur $\mathbb R$. **h est continue et strictement croissante.**`),
    written("A.2", "Calcule les limites de h.", String.raw`En $-\infty$, $e^{x/2}\to0$ et $x\to-\infty$, donc **h tend vers $-\infty$**. En $+\infty$, les deux termes tendent vers $+\infty$, donc **h tend vers $+\infty$**.`),
    written("A.3", String.raw`Justifie l’unique racine $\alpha$ et $-0,71<\alpha<-0,70$.`, String.raw`Par continuité, stricte croissance et limites, h s’annule une fois. $h(-0{,}71)<0$ et $h(-0{,}70)>0$, donc **$-0{,}71<\alpha<-0{,}70$**. Un calcul plus fin donne $\alpha\approx-0{,}703467$.`),
    written("A.4", "Déduis le signe de h.", String.raw`La stricte croissance donne **$h<0$ sur $]-\infty;\alpha[$**, **$h(\alpha)=0$** et **$h>0$ sur $]\alpha;+\infty[$**.`),
    written("B.1.a", String.raw`Montre que $f(\alpha)=-2-\alpha-4/\alpha$.`, String.raw`$h(\alpha)=0$ donne $e^{\alpha/2}=-\alpha>0$, donc $e^{-\alpha/2}=-1/\alpha$. Remplaçons dans f : $(2\alpha+4)(-1/\alpha)-\alpha=\boxed{-2-\alpha-4/\alpha}$.`),
    written("B.1.b", "Encadre f(α) dans un intervalle d’amplitude 0,1.", String.raw`On affine d’abord la racine : $-0{,}7035<\alpha<-0{,}7034$. La fonction $q(t)=-2-t-4/t$ a pour dérivée $-1+4/t^2>0$ sur cet intervalle. Substituer les deux bornes donne **$4{,}3<f(\alpha)<4{,}4$**, un encadrement d’amplitude $0{,}1$.`),
    written("B.2.a", String.raw`Montre que $f'=-he^{-x/2}$.`, String.raw`$f'=2e^{-x/2}-\frac12(2x+4)e^{-x/2}-1=-xe^{-x/2}-1$. On factorise par $-e^{-x/2}$ : **$f'=-(x+e^{x/2})e^{-x/2}=-he^{-x/2}$.**`),
    written("B.2.b", "Déduis les variations.", String.raw`Comme $e^{-x/2}>0$, $f'$ est du signe opposé à h. **f croît jusqu’à α, puis décroît après α.** Le point d’abscisse α est son maximum.`),
    written("B.3.a", String.raw`Calcule les limites de $f$ et de $f(x)/x$ en $-\infty$.`, String.raw`Pour $x\ne0$, $f=x((2+4/x)e^{-x/2}-1)$. En $-\infty$, la parenthèse tend vers $+\infty$ et $x$ vers $-\infty$. Donc **$f\to-\infty$** et **$f(x)/x\to+\infty$** : branche parabolique de direction $(OJ)$.`),
    written("B.3.b", "Calcule la limite de f en +∞.", String.raw`Par croissance comparée, $(2x+4)e^{-x/2}\to0$. Ainsi **$f(x)\to-\infty$**, à cause du terme $-x$.`),
    written("B.3.c", "Justifie l’asymptote y = −x en +∞.", String.raw`$f(x)-(-x)=(2x+4)e^{-x/2}\to0$. **La droite y=−x est asymptote en +∞.** La différence est positive pour $x>-2$, donc Cf est au-dessus près de $+\infty$.`),
    written("B.4.a", "Dresse le tableau de variation complet.", String.raw`Les valeurs de bord sont $-\infty$ aux deux extrémités. La fonction croît sur $]-\infty;\alpha]$ jusqu’à $f(\alpha)\approx4{,}3896$, puis décroît sur $[\alpha;+\infty[$ vers $-\infty$.`),
    written("B.4.b", "Construis la droite et la courbe.", String.raw`On place $(-2;2)$, $(0;4)$, le maximum d’abscisse $\alpha$, puis la droite $y=-x$. La différence $(2x+4)e^{-x/2}$ est négative avant $-2$, nulle en $-2$, positive après : cela fixe la position relative.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(27, "Deux études liées par le logarithme", String.raw`Partie A : $f(x)=(x-1/2)e^{2x}-4(x-1)e^x-2$ et $H(x)=\dfrac{x-1}{2}e^{2x}+4(2-x)e^x$ sur $\mathbb R$. Partie B : $g(x)=(x^2-4x)\ln x-\frac12(x^2-8x+4)$ pour $x>0$, et $g(0)=-2$.`, [
    written("A.1.a", "Calcule la limite en −∞ et interprète.", String.raw`Par croissance comparée, $(x-1/2)e^{2x}\to0$ et $(x-1)e^x\to0$ en $-\infty$. **$f\to-2$**, donc la droite $y=-2$ est asymptote horizontale à gauche.`),
    written("A.1.b", "Factorise f par x e puissance 2x pour x ≠ 0.", String.raw`En divisant chaque terme par $xe^{2x}$, on obtient

$$f(x)=xe^{2x}\left(1-\frac1{2x}-\frac4{e^x}+\frac4{xe^x}-\frac2{xe^{2x}}\right).$$

La restriction $x\ne0$ concerne seulement cette écriture, pas le domaine de f.`),
    written("A.1.c", "Calcule f et f/x en +∞ et interprète.", String.raw`La parenthèse précédente tend vers $1$ en $+\infty$. Donc **$f\to+\infty$ et $f(x)/x\to+\infty$**. Il s’agit d’une branche parabolique de direction $(OJ)$.`),
    written("A.2.a", String.raw`Montre que $f'(x)=2xe^x(e^x-2)$.`, String.raw`La dérivée du premier terme est $e^{2x}+2(x-1/2)e^{2x}=2xe^{2x}$. Celle du deuxième est $-4e^x-4(x-1)e^x=-4xe^x$. D’où **$f'=2xe^x(e^x-2)$**.`),
    written("A.2.b", "Dresse le tableau de variation.", String.raw`$e^x>0$. Le signe de f′ est celui de $x(e^x-2)$ : positif avant $0$, négatif entre $0$ et $\ln2$, positif après $\ln2$.

**f croît de −2 à $f(0)=3/2$, décroît jusqu’à $f(\ln2)=4-4\ln2$, puis croît vers +∞.**`),
    written("A.3.a", "Prouve qu’il existe une unique racine α.", String.raw`Sur $]-\infty;0]$, f est continue et strictement croissante de $-2$ à $3/2$, donc elle s’annule exactement une fois. Sur $[0;+\infty[$, son minimum est $4-4\ln2>0$, donc elle ne s’y annule pas. **La racine est unique.**`),
    written("A.3.b", String.raw`Vérifie $-1,7<\alpha<-1,6$.`, String.raw`Le calcul donne $f(-1{,}7)<0$ et $f(-1{,}6)>0$. La continuité et l’unicité donnent **$-1{,}7<\alpha<-1{,}6$**.`),
    written("A.4.a", "Trace la courbe avec ln 2 ≈ 0,7.", String.raw`On place l’asymptote $y=-2$ à gauche, la racine négative, le maximum local $(0;3/2)$ et le minimum $(\ln2;4-4\ln2)$. Les deux valeurs extrémales sont positives ; le tracé ne doit pas inventer une deuxième racine.`),
    written("A.4.b", "Selon k, donne le nombre de solutions de f(x)=k.", String.raw`Notons $m=4-4\ln2$ et $M=3/2$, avec $-2<m<M$.

| Valeur de k | Nombre de solutions |
| --- | --- |
| $k\le-2$ | $0$ |
| $-2<k<m$ | $1$ |
| $k=m$ | $2$ |
| $m<k<M$ | $3$ |
| $k=M$ | $2$ |
| $k>M$ | $1$ |

Le niveau $-2$ n’est jamais atteint : c’est seulement la limite à gauche.`),
    written("A.5.a", "Montre que H est une primitive de f + 2.", String.raw`On dérive les deux produits séparément :

$$\left(\frac{x-1}{2}e^{2x}\right)'=\left(\frac12+x-1\right)e^{2x}=(x-1/2)e^{2x},$$
$$\bigl(4(2-x)e^x\bigr)'=4(-1+2-x)e^x=-4(x-1)e^x.$$

La somme est exactement $f(x)+2$. **Ainsi $H'=f+2$ sur $\mathbb R$.**`),
    written("A.5.b", "Déduis la primitive F de f vérifiant F(0)=−1.", String.raw`Les primitives de f sont $H(x)-2x+C$. Comme $H(0)=-1/2+8=15/2$, la condition donne $15/2+C=-1$, soit $C=-17/2$.

$$\boxed{F(x)=\frac{x-1}{2}e^{2x}+4(2-x)e^x-2x-\frac{17}{2}.}$$`),
    written("B.1.a", "Détermine le domaine de g.", String.raw`L’expression avec logarithme est définie pour $x>0$. La valeur $g(0)=-2$ fournit le prolongement en $0$. **$D_g=[0;+\infty[$.**`),
    written("B.1.b", String.raw`Montre que $g(x)=f(\ln x)$ pour $x>0$.`, String.raw`$e^{\ln x}=x$ et $e^{2\ln x}=x^2$. Donc

$$f(\ln x)=(\ln x-1/2)x^2-4(\ln x-1)x-2,$$

qui se regroupe en **$(x^2-4x)\ln x-\frac12(x^2-8x+4)=g(x)$.**`),
    written("B.2.a", "Étudie la continuité à droite en 0.", String.raw`Lorsque $x\to0^+$, $x\ln x\to0$ et $x^2\ln x\to0$. La partie polynomiale tend vers $-2$. Ainsi **$g(x)\to-2=g(0)$ : g est continue à droite en 0.**`),
    written("B.2.b", "Étudie la dérivabilité à droite en 0.", String.raw`Le taux vaut

$$\frac{g(x)-g(0)}x=(x-4)\ln x-\frac x2+4.$$

Le produit $(x-4)\ln x$ tend vers $+\infty$. **Le taux tend donc vers $+\infty$** : pas de dérivée droite finie, mais une demi-tangente verticale au point $(0;-2)$.`),
    written("B.2.c", "Calcule les limites de g et g/x en +∞.", String.raw`$g=x^2(\ln x-1/2)-4x\ln x+4x-2$. Les termes dominants donnent **$g\to+\infty$** et **$g/x\to+\infty$**, après factorisation par $x^2\ln x$ puis par $x\ln x$.`),
    written("B.3", "Étudie les variations.", String.raw`Pour $x>0$, $g'=f'(\ln x)/x=2\ln x(x-2)$. Le signe est positif sur $]0;1[$, négatif sur $]1;2[$, positif sur $]2;+\infty[$. Les valeurs sont **$g(0)=-2$, $g(1)=3/2$, $g(2)=4-4\ln2$.**`),
    written("B.4.a", "Encadre l’abscisse du point d’intersection avec l’axe.", String.raw`$g(x)=0\iff f(\ln x)=0\iff\ln x=\alpha$. L’unique abscisse est **$x=e^\alpha$**. Comme $-1{,}7<\alpha<-1{,}6$, on a **$e^{-1,7}<x<e^{-1,6}$**, soit environ $0{,}1827<x<0{,}2019$.`),
    written("B.4.b", "Trace Cg et la tangente au point d’abscisse 0.", String.raw`Le point initial est $(0;-2)$ avec une demi-tangente verticale **$x=0$**. On place la racine $e^\alpha$, le maximum local en $(1;3/2)$, puis le minimum en $(2;4-4\ln2)$, avant la branche croissante.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(28, "Deux puissances et une parabole auxiliaire", String.raw`$f(x)=2^{x+1}-4^x$, définie sur $\mathbb R$. Unité graphique : 2 cm.`, [
    written("A.1", "Calcule les limites en +∞ et −∞ et interprète.", String.raw`Posons $X=2^x>0$. Alors $f=2X-X^2$. En $+\infty$, $X\to+\infty$, donc **f tend vers −∞**. En $-\infty$, $X\to0^+$, donc **f tend vers 0**. $y=0$ est asymptote à gauche.`),
    written("A.2.a", String.raw`Justifie $f(x)=e^{x\ln2}(2-e^{x\ln2})$.`, String.raw`$2^x=e^{x\ln2}$ et $4^x=(2^x)^2$. On factorise $2X-X^2=X(2-X)$, d’où l’écriture demandée.`),
    written("A.2.b", "Calcule f′ et son signe.", String.raw`$X'=(\ln2)X$, donc $f'=2(\ln2)X(1-X)$. Les facteurs $2\ln2$ et $X$ sont positifs. **Le signe est celui de $1-2^x$** : positif si $x<0$, nul en $0$, négatif si $x>0$.`),
    written("A.2.c", "Dresse le tableau de variation.", String.raw`**f croît de 0 à f(0)=1 sur ]−∞;0], puis décroît de 1 à −∞ sur [0;+∞[.** Le maximum global est $1$.`),
    written("A.3", "Trace avec les abscisses −1, 0, 1 et 2.", String.raw`Les points sont **$(-1;3/4)$, $(0;1)$, $(1;0)$, $(2;-8)$**. On respecte le maximum en $0$ et l’asymptote horizontale à gauche.`),
    written("B.1.a", String.raw`Pour $f(x)=3/4$, pose $X=2^x$ et obtiens $4X^2-8X+3=0$.`, String.raw`$2X-X^2=3/4$. Multiplions par $4$ puis regroupons : **$4X^2-8X+3=0$**. Les racines sont $1/2$ et $3/2$, toutes deux positives.`),
    written("B.1.b", String.raw`Pour $f(x)=-2$, obtiens $X^2-2X-2=0$.`, String.raw`$2X-X^2=-2\iff X^2-2X-2=0$. Ses racines sont $1\pm\sqrt3$ ; **seule $1+\sqrt3$ est positive**.`),
    written("B.2", "Donne les solutions exactes et compare au graphique.", String.raw`Pour $f=3/4$, **$x=-1$ ou $x=\ln(3/2)/\ln2\approx0{,}585$**. Pour $f=-2$, **$x=\ln(1+\sqrt3)/\ln2\approx1{,}450$**. Ces abscisses correspondent aux intersections avec les deux droites horizontales.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(29, "Vrai ou faux : une tangente composée", String.raw`Soit $f(x)=e^{\tan(2x)}$. Indique Vrai ou Faux.`, [
    tf("1.", String.raw`$f'(\pi/6)=-4e^{\sqrt3}$.`, false, String.raw`$f'=2e^{\tan(2x)}/\cos^2(2x)$. En $\pi/6$, $\tan(\pi/3)=\sqrt3$ et $\cos^2(\pi/3)=1/4$. **La dérivée vaut $8e^{\sqrt3}>0$.**`),
    tf("2.", String.raw`$f'(\pi/6)=8e^{\sqrt3}$.`, true, String.raw`La chaîne de dérivations donne le facteur $2/\cos^2(2x)$, donc en $\pi/6$ : $2/(1/4)=8$. **L’égalité est vraie.**`),
    tf("3.", String.raw`$f'(\pi/6)=0$.`, false, String.raw`Le calcul précédent donne $8e^{\sqrt3}$, strictement positif. **Ce nombre n’est pas nul.**`),
    tf("4.", String.raw`f est dérivable en $\pi/4$.`, false, String.raw`À $x=\pi/4$, $2x=\pi/2$ et la tangente trigonométrique n’est pas définie. **f n’est même pas définie en ce point**, donc elle n’y est pas dérivable.`),
  ]),
  ex(30, "Systèmes : garder les inconnues positives", String.raw`Résous dans $\mathbb R\times\mathbb R$.`, [
    written("a)", String.raw`$\begin{cases}e^x-2e^y=1,\\e^x+e^y=4.\end{cases}$`, String.raw`Posons $X=e^x>0,Y=e^y>0$. La soustraction donne $3Y=3$, donc $Y=1$ puis $X=3$. **$(x;y)=(\ln3;0)$.**`),
    written("b)", String.raw`$\begin{cases}e^x+3e^y=1,\\e^x-5e^y=7.\end{cases}$`, String.raw`La différence donne $8e^y=-6$, ce qui est impossible car $e^y>0$. **Le système n’a aucune solution.**`),
    written("c)", String.raw`$\begin{cases}5e^x-3e^y=7,\\7e^x+6e^y=11.\end{cases}$`, String.raw`Avec $X=e^x,Y=e^y$, on multiplie la première ligne par $2$ et on additionne : $17X=25$, donc $X=25/17$. Puis $3Y=5X-7=6/17$, soit $Y=2/17$. Les deux sont positifs. **$(x;y)=(\ln(25/17);\ln(2/17))$.**`),
    written("d)", String.raw`$\begin{cases}e^x e^{2y-1}=7,\\e^{x+2}+e^{-y}=11.\end{cases}$`, String.raw`Posons $X=e^x>0$ et $Y=e^y>0$. La première égalité donne $XY^2=7e$, donc $X=7e/Y^2$. La seconde devient $e^2X+1/Y=11$ ; après multiplication par $Y^2>0$ :

$$11Y^2-Y-7e^3=0.$$

Le produit des racines est négatif, donc une seule est positive : **$Y=(1+\sqrt{1+308e^3})/22$**. Avec cette valeur, **$y=\ln Y$ et $x=\ln(7e/Y^2)$**. Ces deux réels vérifient le système.`),
    written("e)", String.raw`$\begin{cases}e^x\,2e^y=5,\\e^x+e^y=6.\end{cases}$`, String.raw`Avec $X=e^x,Y=e^y$, $XY=5/2$ et $X+Y=6$. X et Y sont les deux racines positives de $T^2-6T+5/2=0$, soit $a=3-\sqrt{26}/2$ et $b=3+\sqrt{26}/2$. **Les couples sont $(\ln a;\ln b)$ et $(\ln b;\ln a)$.**`),
  ]),
  ex(31, "Un polynôme du troisième degré", String.raw`$P(x)=2x^3-5x^2+x+2$.`, [
    short("1.a", "Calcule P(1).", "$0$", ["0"], String.raw`$P(1)=2-5+1+2=\boxed0$. Donc $1$ est une racine.`),
    written("1.b", "Résous P(x)=0.", String.raw`La division par $x-1$ donne $2x^2-3x-2=(2x+1)(x-2)$. Donc $P=(x-1)(2x+1)(x-2)$ et **$S=\{-1/2;1;2\}$.**`),
    written("2.a", String.raw`Résous $2e^{3x}-5e^{2x}+e^x+2=0$.`, String.raw`Avec $X=e^x>0$, on résout $P(X)=0$. On rejette $X=-1/2$ et garde $1,2$. **$S=\{0;\ln2\}$.**`),
    written("2.b", String.raw`Résous $2e^{3x}-5e^{2x}+e^x+2\le0$.`, String.raw`Avec $X=e^x>0$, le facteur $2X+1$ est positif. Il reste $(X-1)(X-2)\le0$, soit $1\le X\le2$. **$S=[0;\ln2]$.**`),
  ]),
];
