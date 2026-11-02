import type { ArenaExerciseItem } from "../../domain/arenaExercises";
import { short, tf, written } from "./builders";
import { primitiveExercise as ex, primitivePart as part } from "./terminalCPrimitivesBuilders";

export const primitivesFixation: ArenaExerciseItem[] = [
  ex(1, "Vérifier une primitive", String.raw`Soient $f(x)=x^4+2x^3-x^2+7x-2$ et $g(x)=4x^3+6x^2-2x+7$, définies sur $\mathbb R$.`, [
    written("1", String.raw`Justifie que $f$ est une primitive de $g$ sur $\mathbb R$.`, String.raw`$f$ est polynomiale, donc dérivable sur $\mathbb R$. On dérive terme à terme :

$$f'(x)=4x^3+6x^2-2x+7-0=g(x).$$

**Ainsi $f$ est une primitive de $g$ sur $\mathbb R$.** On a bien dérivé la fonction proposée $f$, et non $g$.`),
  ]),
  ex(2, "Reconnaître les bonnes primitives", String.raw`Soit $f(x)=3x-7$ sur $\mathbb R$. Parmi les cinq fonctions dérivables proposées, indique celles qui sont des primitives de $f$ sur $\mathbb R$.`, [
    tf("F", String.raw`$F(x)=\dfrac32x^2$ est une primitive de $f$.`, false, String.raw`$F'(x)=3x$. Le terme $-7$ manque : $F'\ne f$. **Faux.**`),
    tf("G", String.raw`$G(x)=\dfrac32x^2-7x+10$ est une primitive de $f$.`, true, String.raw`$G'(x)=3x-7+0=f(x)$. La constante $10$ ne change pas la dérivée. **Vrai.**`),
    tf("H", String.raw`$H(x)=x^3-7x$ est une primitive de $f$.`, false, String.raw`$H'(x)=3x^2-7$, et non $3x-7$. **Faux.**`),
    tf("P", String.raw`$P(x)=\dfrac{3x^2-14x}{2}$ est une primitive de $f$.`, true, String.raw`On écrit $P(x)=\frac32x^2-7x$. Alors $P'(x)=3x-7=f(x)$. **Vrai.** Les deux réponses à retenir sont $G$ et $P$.`),
    tf("Q", String.raw`$Q(x)=x^2-7$ est une primitive de $f$.`, false, String.raw`$Q'(x)=2x$, qui n’est pas $f(x)=3x-7$. **Faux.**`),
  ]),
  ex(3, "Une fonction avec une valeur absolue", String.raw`Soit $f(x)=|x|+1$ sur $\mathbb R$.`, [
    written("1", String.raw`Justifie que $f$ admet des primitives sur $\mathbb R$.`, String.raw`La fonction valeur absolue et la fonction constante $1$ sont continues sur $\mathbb R$. Leur somme $f$ est donc continue sur cet intervalle.

**Toute fonction continue sur un intervalle admet des primitives : $f$ en admet sur $\mathbb R$.** Il n’est pas demandé de les calculer.`),
  ]),
  ex(4, "Continuité et domaines de définition", String.raw`On considère $f(x)=x^4-10$, $g(x)=1/x^3$, $h(x)=\sqrt{2x-1}$ et $u(x)=x/(x^2+2)$ sur leurs domaines naturels. Identifie celles qui admettent des primitives, en précisant les intervalles.`, [
    written("f", String.raw`Étudie $f(x)=x^4-10$.`, String.raw`$D_f=\mathbb R$. Cette fonction polynomiale est continue sur $\mathbb R$ et y admet des primitives. Par exemple, $x^5/5-10x$, dont la dérivée est $x^4-10$.`),
    written("g", String.raw`Étudie $g(x)=1/x^3$.`, String.raw`Il faut $x\ne0$, donc $D_g=]-\infty;0[\cup]0;+\infty[$. La fonction est continue sur chacun de ces deux intervalles. Elle y admet des primitives :

$$G(x)=-\frac1{2x^2}+C_-\quad(x<0),$$
$$G(x)=-\frac1{2x^2}+C_+\quad(x>0).$$

Les constantes $C_-$ et $C_+$ sont indépendantes, car le domaine est séparé en deux intervalles. On ne prétend pas que $g$ est définie en $0$.`),
    written("h", String.raw`Étudie $h(x)=\sqrt{2x-1}$.`, String.raw`Il faut $2x-1\ge0$, soit $x\ge1/2$. Sur $[1/2;+\infty[$, $h$ est continue, donc admet des primitives. L’une d’elles est :

$$H(x)=\frac{(2x-1)^{3/2}}3.$$

Pour $x>1/2$, $H'(x)=\frac13\times\frac32(2x-1)^{1/2}\times2=h(x)$. À l’extrémité $1/2$, le taux à droite est proportionnel à $\sqrt{x-1/2}$ et tend vers $0=h(1/2)$.`),
    written("u", String.raw`Étudie $u(x)=x/(x^2+2)$.`, String.raw`Pour tout réel $x$, $x^2+2\ge2>0$. Donc $D_u=\mathbb R$ et le quotient de ces polynômes y est continu. **$u$ admet des primitives sur $\mathbb R$.**

Les quatre fonctions admettent ainsi des primitives sur leurs intervalles de définition ; pour $g$, on distingue les deux côtés de $0$.`),
  ]),
  ex(5, "Trois autres primitives", String.raw`Soit $g(x)=x^3-2x$ sur $\mathbb R$. On donne la primitive $G(x)=x^4/4-x^2$.`, [
    written("1", String.raw`Trouve trois autres primitives de $g$ sur $\mathbb R$.`, String.raw`Ajouter une constante à $G$ ne change pas sa dérivée. Toutes les primitives sont $x^4/4-x^2+C$.

On peut choisir trois constantes différentes et non nulles :

$$G_1(x)=\frac{x^4}4-x^2+1,$$
$$G_2(x)=\frac{x^4}4-x^2-2,$$
$$G_3(x)=\frac{x^4}4-x^2+5.$$

Chacune a pour dérivée $x^3-2x$. D’autres choix de trois constantes conviennent aussi.`),
  ]),
  ex(6, "Vérifier puis donner une famille", String.raw`Soient $F(x)=x^5+2$ et $f(x)=5x^4$ sur $\mathbb R$.`, [
    written("1", String.raw`Justifie que $F$ est une primitive de $f$.`, String.raw`$F$ est un polynôme dérivable sur $\mathbb R$. On obtient $F'(x)=5x^4+0=f(x)$. **$F$ est donc une primitive de $f$.**`),
    written("2", String.raw`Déduis-en quatre autres primitives de $f$.`, String.raw`Toutes les primitives sont $x^5+C$, avec $C\in\mathbb R$. Pour en donner quatre différentes de $F$, on choisit quatre constantes distinctes de $2$ :

$$x^5-1,\qquad x^5,\qquad x^5+1,\qquad x^5+3.$$

Leur dérivée vaut toujours $5x^4$.`),
  ]),
  ex(7, "Une primitive nulle en zéro", String.raw`Soit $f(x)=3x^2-2x+5$ sur $\mathbb R$. Détermine la primitive $F$ qui s’annule en $0$.`, [
    short("1.a", String.raw`On écrit $F(x)=x^3-x^2+5x+C$. Calcule $C$.`, "$0$", ["0"], String.raw`En $0$, les termes contenant $x$ sont nuls : $F(0)=C$. La condition $F(0)=0$ donne **$C=0$**.`),
    written("1.b", "Rédige la détermination et la vérification de F.", String.raw`$f$ est continue sur $\mathbb R$. Les primitives de $3x^2$, $-2x$ et $5$ sont respectivement $x^3$, $-x^2$ et $5x$. Donc :

$$F(x)=x^3-x^2+5x+C.$$

Comme $F(0)=0$, on a $C=0$. **La primitive cherchée est $F(x)=x^3-x^2+5x$.** Sa dérivée est $3x^2-2x+5$ et $F(0)=0$.`),
  ]),
  ex(8, "Une primitive nulle en un", String.raw`Soit $f(x)=3x-1+2/x^3$ sur $]0;+\infty[$. Détermine la primitive $F$ qui s’annule en $1$.`, [
    short("1.a", String.raw`On écrit $F(x)=3x^2/2-x-1/x^2+C$. Calcule $C$.`, String.raw`$\dfrac12$`, ["1/2", "0,5"], String.raw`$F(1)=3/2-1-1+C=-1/2+C$. La condition $F(1)=0$ donne **$C=1/2$**.`),
    written("1.b", "Rédige la détermination et la vérification de F.", String.raw`Sur $]0;+\infty[$, $f$ est continue. Pour le dernier terme, $2/x^3=2x^{-3}$ et une primitive est $2x^{-2}/(-2)=-1/x^2$.

Ainsi $F(x)=3x^2/2-x-1/x^2+C$. En $1$, on obtient $-1/2+C=0$, donc $C=1/2$.

$$\boxed{F(x)=\frac32x^2-x-\frac1{x^2}+\frac12.}$$

Vérifions : $F'(x)=3x-1+2/x^3$ et $F(1)=3/2-1-1+1/2=0$.`),
  ]),
  ex(9, "Utiliser le tableau usuel", "Dans chaque cas, détermine une primitive de f sur un intervalle de son domaine.", [
    part("1", String.raw`$f(x)=2x+1$.`, "x^2+x", String.raw`Une primitive de $2x$ est $x^2$ et une primitive de $1$ est $x$. En dérivant leur somme, on retrouve $2x+1$.`, String.raw`\mathbb R`),
    part("2", String.raw`$f(x)=-4/(3x^5)$.`, String.raw`\frac1{3x^4}`, String.raw`Pour $x\ne0$, $f(x)=-(4/3)x^{-5}$. On augmente l’exposant puis on divise par $-4$ : $-(4/3)\times x^{-4}/(-4)=x^{-4}/3$. Sa dérivée vaut $-(4/3)x^{-5}$.`, String.raw`]-\infty;0[\ \text{ou}\ ]0;+\infty[`),
    part("3", String.raw`$f(x)=x+1/\sqrt x$.`, String.raw`\frac{x^2}2+2\sqrt x`, String.raw`Il faut $x>0$. Une primitive de $x$ est $x^2/2$ et une primitive de $1/\sqrt x$ est $2\sqrt x$. La dérivée de la somme est $x+1/\sqrt x$.`, String.raw`]0;+\infty[`),
    part("4", String.raw`$f(x)=\sin x-2\cos x$.`, String.raw`-\cos x-2\sin x`, String.raw`On utilise $(-\cos x)'=\sin x$ et $(-2\sin x)'=-2\cos x$. La somme a donc la dérivée demandée.`, String.raw`\mathbb R`),
  ]),
  ex(10, "Donner toutes les primitives", String.raw`Dans chaque cas, détermine toutes les primitives de $f$ sur $]0;+\infty[$.`, [
    part("1", String.raw`$f(x)=x^3$.`, String.raw`\frac{x^4}4`, String.raw`On augmente l’exposant $3$ de $1$ et on divise par $4$. En effet $(x^4/4)'=x^3$.`, String.raw`]0;+\infty[`, true),
    part("2", String.raw`$f(x)=1/x^5$.`, String.raw`-\frac1{4x^4}`, String.raw`$1/x^5=x^{-5}$, dont une primitive est $x^{-4}/(-4)$. Vérification : $(-x^{-4}/4)'=x^{-5}$.`, String.raw`]0;+\infty[`, true),
    part("3", String.raw`$f(x)=\sin x$.`, String.raw`-\cos x`, String.raw`La dérivée du cosinus est l’opposé du sinus : on prend donc $-\cos x$, dont la dérivée vaut $\sin x$.`, String.raw`]0;+\infty[`, true),
    part("4", String.raw`$f(x)=\cos x$.`, String.raw`\sin x`, String.raw`La dérivée de $\sin x$ est exactement $\cos x$.`, String.raw`]0;+\infty[`, true),
    part("5", String.raw`$f(x)=1/\sqrt x+2$.`, String.raw`2\sqrt x+2x`, String.raw`On primitive séparément : $(2\sqrt x)'=1/\sqrt x$ et $(2x)'=2$.`, String.raw`]0;+\infty[`, true),
    part("6", String.raw`$f(x)=(x+1)(x-2)$.`, String.raw`\frac{x^3}3-\frac{x^2}2-2x`, String.raw`On développe d’abord : $(x+1)(x-2)=x^2-x-2$. On primitive terme à terme : $x^3/3-x^2/2-2x$. Sa dérivée est $x^2-x-2$.`, String.raw`]0;+\infty[`, true),
  ]),
  ex(11, "Reconnaître la dérivée intérieure", String.raw`Détermine une primitive sur $]0;+\infty[$ dans les cas a), b), d), et sur chacun des intervalles $]0;5/2[$ et $]5/2;+\infty[$ dans le cas c).`, [
    part("a", String.raw`$f(x)=3\sin(-3x)$.`, String.raw`\cos(-3x)`, String.raw`Posons $u=-3x$, donc $u'=-3$. En dérivant $\cos u$, on obtient $-u'\sin u=3\sin(-3x)$. Le signe et le facteur $3$ sont ainsi vérifiés.`, String.raw`]0;+\infty[`),
    part("b", String.raw`$f(x)=2/\sqrt{2x+1}$.`, String.raw`2\sqrt{2x+1}`, String.raw`Posons $u=2x+1>0$ ; $u'=2$. On reconnaît $u'/\sqrt u$, de primitive $2\sqrt u$. Vérification : $(2\sqrt{2x+1})'=2\times2/(2\sqrt{2x+1})$.`, String.raw`]0;+\infty[`),
    part("c", String.raw`$f(x)=-2/(2x-5)^2$.`, String.raw`\frac1{2x-5}`, String.raw`$2x-5$ s’annule en $5/2$, donc on sépare les intervalles. Avec $u=2x-5$, $u'=2$, la dérivée de $1/u$ vaut $-u'/u^2=-2/(2x-5)^2$.`, String.raw`]0;5/2[\ \text{ou}\ ]5/2;+\infty[`),
    part("d", String.raw`$f(x)=2x(x^2+7)^2$.`, String.raw`\frac{(x^2+7)^3}3`, String.raw`Posons $u=x^2+7$, donc $u'=2x$. Une primitive de $u'u^2$ est $u^3/3$. En dérivant, le facteur $3$ se simplifie et on retrouve $2x(x^2+7)^2$.`, String.raw`]0;+\infty[`),
  ]),
  ex(12, "Primitives de fonctions composées", String.raw`Dans chaque cas, détermine une primitive de $f$ sur $]0;+\infty[$.`, [
    part("a", String.raw`$f(x)=(2x-1)(x^2-x+6)^3$.`, String.raw`\frac{(x^2-x+6)^4}4`, String.raw`Posons $u=x^2-x+6$, donc $u'=2x-1$. La fonction est $u'u^3$, de primitive $u^4/4$. La dérivée de la formule proposée redonne $(2x-1)(x^2-x+6)^3$.`, String.raw`]0;+\infty[`),
    part("b", String.raw`$f(x)=\dfrac{2x+3}{(x^2+3x+2)^3}$.`, String.raw`-\frac1{2(x^2+3x+2)^2}`, String.raw`Posons $u=x^2+3x+2=(x+1)(x+2)>0$ pour $x>0$, et $u'=2x+3$. On reconnaît $u'/u^3$, de primitive $-1/(2u^2)$. En dérivant $-u^{-2}/2$, on retrouve $u'u^{-3}$.`, String.raw`]0;+\infty[`),
    part("c", String.raw`$f(x)=\dfrac{2x+1}{\sqrt{x^2+x+1}}$.`, String.raw`2\sqrt{x^2+x+1}`, String.raw`Posons $u=x^2+x+1=(x+1/2)^2+3/4>0$. Sa dérivée est $u'=2x+1$. On applique la formule $u'/\sqrt u\longmapsto2\sqrt u$.`, String.raw`]0;+\infty[`),
    part("d", String.raw`$f(x)=\sin x\cos^2x$.`, String.raw`-\frac{\cos^3x}3`, String.raw`Posons $u=\cos x$, donc $u'=-\sin x$. La fonction vaut $-u'u^2$, de primitive $-u^3/3$. Vérifions : $(-\cos^3x/3)'=-\cos^2x\times(-\sin x)=f(x)$.`, String.raw`]0;+\infty[`),
  ]),
];
