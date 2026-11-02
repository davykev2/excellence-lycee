import type {CourseWorkedExample} from "../../domain/courseDocument";
const r=String.raw;
// Independent of the summary helpers: no circular import when the studies are shared with assessment.
const e=(id:string,title:string,parts:[string,string,string][]):CourseWorkedExample=>({id,title,prompt:"",parts:parts.map(([label,prompt,solution],i)=>({id:id+"-"+(i+1),label,prompt,solution}))});
export const exponentialFirstStudy=e("ta-exp-first-study-example","Une courbe et son asymptote oblique",[
 ["1.","Préciser le domaine.",r`Les fonctions $x\mapsto1-x$ et $x\mapsto e^x$ existent pour tout réel. Leur somme est donc définie sur $\boxed{\mathbb R}$.`],
 ["2.",r`Calculer la limite en $-\infty$.`,r`Quand $x\to-\infty$, $1-x\to+\infty$ et $e^x\to0$. Leur somme tend donc vers $\boxed{+\infty}$.`],
 ["3.a)",r`Factoriser par $x$ pour $x\neq0$.`,r`Chaque terme peut s’écrire avec un facteur $x$ : $1=x(1/x)$, $-x=x(-1)$ et $e^x=x(e^x/x)$. Donc :
$$\boxed{f(x)=x\left(\frac1x-1+\frac{e^x}{x}\right)}.$$
Cette réécriture ne s’utilise pas en $0$ ; la fonction initiale y reste définie.`],
 ["3.b)",r`En déduire la limite en $+\infty$.`,r`À droite, $e^x/x\to+\infty$ et $1/x-1\to-1$. La parenthèse tend donc vers $+\infty$. Comme $x\to+\infty$, on obtient $\boxed{\lim_{x\to+\infty}f(x)=+\infty}$.`],
 ["4.a)","Justifier l’asymptote oblique en −∞.",r`On calcule l’écart entre la courbe et la droite :
$$f(x)-(-x+1)=e^x.$$
Comme cet écart tend vers $0$ lorsque $x\to-\infty$, la droite $\boxed{y=-x+1}$ est asymptote à $\mathcal C$ en $-\infty$.`],
 ["4.b)","Préciser la position relative.",r`Pour tout réel $x$, l’écart $f(x)-(-x+1)=e^x$ est **strictement positif**. La courbe $\mathcal C$ est donc strictement au-dessus de $\Delta$ sur $\mathbb R$.`],
 ["5.a)","Calculer la dérivée.",r`On dérive chaque terme : $(1)'=0$, $(-x)'=-1$ et $(e^x)'=e^x$. Ainsi $\boxed{f'(x)=e^x-1}$.`],
 ["5.b)",r`Résoudre $f'(x)=0$.`,r`$f'(x)=0\iff e^x=1\iff e^x=e^0\iff x=0$. La dérivée s’annule donc uniquement en $\boxed0$.`],
 ["5.c)",r`Résoudre $f'(x)>0$.`,r`$e^x-1>0\iff e^x>e^0$. L’exponentielle étant strictement croissante, cela équivaut à $\boxed{x>0}$. Pour $x<0$, la dérivée est négative.`],
 ["5.d)","Dresser le tableau de variations.",r`On a $f(0)=1+1=2$.

| $x$ | $-\infty$ | $0$ | $+\infty$ |
|---|---|---|---|
| $f'(x)$ | $-$ | $0$ | $+$ |
| $f(x)$ | $+\infty\;\searrow$ | $2$ | $\nearrow\;+\infty$ |

La fonction est strictement décroissante sur $]-\infty;0]$, puis strictement croissante sur $[0;+\infty[$. Son minimum est $\boxed2$, atteint en $0$.`],
 ["6.","Compléter les valeurs au centième.",r`On remplace $x$ dans $1-x+e^x$ sans arrondir $e^x$ avant la fin. Par exemple, $f(-2)=3+e^{-2}\approx3,1353$, soit $3,14$.

| $x$ | $-3$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
|---|---|---|---|---|---|---|
| $f(x)$ au centième | $4,05$ | $3,14$ | $2,37$ | $2,00$ | $2,72$ | $6,39$ |`],
 ["7.","Tracer la courbe et la droite sur [−3 ; 2].",r`Tracer $\Delta:y=-x+1$, placer le minimum $(0;2)$ et les points du tableau. La courbe descend puis remonte, reste au-dessus de la droite et s’en rapproche vers la gauche. L’asymptote décrit le comportement en $-\infty$, pas seulement celui du segment dessiné.`],
]);
export const exponentialSecondStudy=e("ta-exp-second-study-example","Une fonction produit sur un intervalle donné",[
 ["1.",r`Justifier la limite en $-\infty$ et l’interpréter.`,r`On développe : $g(x)=-2xe^x+3e^x$. Quand $x\to-\infty$, $xe^x\to0$ et $e^x\to0$. Donc $\boxed{g(x)\to0}$.

La droite $\boxed{y=0}$ est une asymptote horizontale à la courbe en $-\infty$.`],
 ["2.a)","Calculer la dérivée.",r`On dérive le produit de $-2x+3$ par $e^x$ :
$$g'(x)=-2e^x+(-2x+3)e^x.$$
En regroupant, $\boxed{g'(x)=(1-2x)e^x}$. Cette formule s’utilise sur l’intérieur de l’intervalle et donne aussi la dérivée à gauche en $2$.`],
 ["2.b)","Étudier le signe de la dérivée sur l’intervalle demandé.",r`Le facteur $e^x$ est toujours positif. La dérivée a donc le signe de $1-2x$ : positif pour $x<1/2$, nul en $1/2$, négatif pour $1/2<x\leq2$. L’étude reste bien limitée à $]-\infty;2]$.`],
 ["2.c)","Dresser le tableau de variations.",r`Au sommet, $g(1/2)=2e^{1/2}=2\sqrt e$. À l’extrémité droite, $g(2)=-e^2$.

| $x$ | $-\infty$ | $1/2$ | $2$ |
|---|---|---|---|
| $g'(x)$ | $+$ | $0$ | $-$ |
| $g(x)$ | $0\;\nearrow$ | $2\sqrt e$ | $\searrow\;-e^2$ |

La fonction croît jusqu’à $1/2$, puis décroît jusqu’à $2$. Son maximum vaut $\boxed{2\sqrt e\approx3,30}$.`],
 ["3.a)","Trouver le point A de la courbe sur l’axe des abscisses.",r`Sur cet axe, l’ordonnée est nulle. L’équation $(-2x+3)e^x=0$ impose $-2x+3=0$ car $e^x\neq0$. Donc $x=3/2$, qui appartient à l’intervalle étudié : $\boxed{A(3/2;0)}$.`],
 ["3.b)","Trouver le point B de la courbe sur l’axe des ordonnées.",r`Sur l’axe des ordonnées, $x=0$. On calcule $g(0)=3e^0=3$, d’où $\boxed{B(0;3)}$.`],
 ["4.","Compléter le tableau au dixième.",r`On calcule chaque produit $(-2x+3)e^x$, puis on arrondit.

| $x$ | $-4$ | $-3$ | $-2$ | $-1$ | $0$ | $0,5$ | $1$ | $1,5$ | $2$ |
|---|---|---|---|---|---|---|---|---|---|
| $g(x)$ au dixième | $0,2$ | $0,4$ | $0,9$ | $1,8$ | $3,0$ | $3,3$ | $2,7$ | $0,0$ | $-7,4$ |`],
 ["5.","Construire la courbe sur ]−∞ ; 2].",r`Placer $A$, $B$ et le sommet $(1/2;2\sqrt e)$, puis les autres points. Vers la gauche, la branche se rapproche de l’axe des abscisses par-dessus. Elle croît jusqu’au sommet, décroît ensuite, coupe l’axe en $A$, puis arrive au point d’abscisse $2$ et d’ordonnée $-e^2$. On ne prolonge pas la courbe au-delà de $2$ dans cette étude.`],
]);
