import { choice, short, written } from "./builders";
import { exponentialExercise as ex } from "./terminalCExponentialPowerBuilders";

export const exponentialDeepeningC = [
  ex(32, "Choisir l’unique réponse juste", "Pour chaque ligne, choisis l’une des quatre propositions.", [
    choice("1.", String.raw`$\displaystyle\lim_{x\to+\infty}x^{\ln0,5}$`, [String.raw`$-\infty$`, "$0$", String.raw`$+\infty$`, "N’existe pas"], 1, String.raw`$\ln0{,}5<0$. Posons $a=-\ln0{,}5>0$ : $x^{\ln0,5}=1/x^a\to0$. **Réponse B.**`),
    choice("2.", String.raw`La fonction $x\mapsto(\ln x)^\pi$ est :`, ["Définie sur R", "Strictement croissante sur ]0 ; 1[", "Strictement croissante sur ]1 ; +∞[", "Dérivable en 0"], 2, String.raw`La puissance réelle exige $\ln x>0$, soit $x>1$. Sa dérivée $\pi(\ln x)^{\pi-1}/x$ est positive sur cet intervalle. **Réponse C.**`),
    choice("3.", String.raw`Quelle expression tend vers $1$ en $+\infty$ ?`, [String.raw`$x\ln\left|\frac{x+1}{x}\right|$`, String.raw`$(x+3)e^{1/x}-x$`, String.raw`$\sin(1/x)e^{\cos x}$`, String.raw`$e^{1-x}$`], 0, String.raw`Pour A, posons $t=1/x\to0^+$. L’expression vaut $\ln(1+t)/t\to1$. B vaut $x(e^{1/x}-1)+3e^{1/x}\to1+3=4$. C tend vers $0$ car son facteur exponentiel est borné, et D tend vers $0$. **Seule A convient.**`),
    choice("4.", String.raw`Une solution de $2e^{2x}-5e^x-3=0$ est :`, [String.raw`$\ln5$`, String.raw`$\ln3$`, "$0$", "$1$"], 1, String.raw`Avec $X=e^x>0$, $2X^2-5X-3=(2X+1)(X-3)=0$. Seule $X=3$ est positive, donc **$x=\ln3$, réponse B.**`),
  ]),
  ex(33, "Reconnaître une hyperbole", String.raw`Étudie et représente $f(x)=e^{-\ln x}$ sur $]0;+\infty[$.`, [
    written("Simplification", "Écris f sans exponentielle.", String.raw`Pour $x>0$, $e^{-\ln x}=1/e^{\ln x}=\boxed{1/x}$. Le domaine initial reste $]0;+\infty[$.`),
    written("Étude", "Donne la dérivée, les variations et les limites.", String.raw`$f'(x)=-1/x^2<0$ : f est strictement décroissante. **La limite en $0^+$ vaut $+\infty$, celle en $+\infty$ vaut $0$.** Les axes $x=0$ et $y=0$ sont asymptotes.`),
    written("Tracé", "Représente la courbe dans le repère orthonormal.", String.raw`La branche est dans le premier quadrant et passe par **$(1;1)$, $(2;1/2)$ et $(1/2;2)$**. Elle décroît entre les deux asymptotes. On ne dessine pas la branche $x<0$, absente du domaine.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(34, "Une primitive de type u′ sur u", String.raw`$f(x)=3\left(1-\dfrac1{e^x+1}\right)$ sur $\mathbb R$.`, [
    written("1.", String.raw`Vérifie $f(x)=3e^x/(e^x+1)$.`, String.raw`Mettons au même dénominateur : $1-1/(e^x+1)=(e^x+1-1)/(e^x+1)=e^x/(e^x+1)$. On multiplie par $3$, ce qui donne l’expression attendue.`),
    written("2.", "Déduis la primitive qui s’annule en 0.", String.raw`$u=e^x+1>0$, $u'=e^x$. Les primitives sont $3\ln(e^x+1)+C$. La condition en $0$ donne $3\ln2+C=0$.

$$\boxed{F(x)=3\ln(e^x+1)-3\ln2.}$$

On vérifie $F(0)=0$ et $F'=f$.`),
  ]),
  ex(35, "Résoudre avec une base positive", "Résous les deux équations dans R.", [
    written("a)", String.raw`$5^x-5^{-x}=6$`, String.raw`Posons $X=5^x>0$. $X-1/X=6$ donne $X^2-6X-1=0$, donc $X=3\pm\sqrt{10}$. On rejette $3-\sqrt{10}<0$. **$x=\ln(3+\sqrt{10})/\ln5$.**`),
    written("b)", String.raw`$4^x+6^x=9^x$`, String.raw`Divisons par $9^x>0$, puis posons $X=(2/3)^x>0$. Alors $(4/9)^x=X^2$ et $(6/9)^x=X$. L’équation devient $X^2+X-1=0$. La seule racine positive est $(\sqrt5-1)/2$. Ainsi

$$\boxed{x=\frac{\ln((\sqrt5-1)/2)}{\ln(2/3)}.}$$

Le dénominateur est non nul et la racine retenue appartient à $]0;1[$, donc x est positif.`),
  ]),
  ex(36, "Étudier trois courbes usuelles", "Dans un repère orthonormal, étudie et représente chaque fonction.", [
    written("1.", String.raw`$f(x)=x^{0,75}$`, String.raw`Sur $]0;+\infty[$, $0{,}75=3/4$ et $f'=3/(4x^{1/4})>0$. La fonction croît de $0$ vers $+\infty$, et $f(x)/x=x^{-1/4}\to0$ en $+\infty$ : branche parabolique de direction $(OI)$. Son prolongement $f(0)=0$ a une demi-tangente verticale car $f(x)/x\to+\infty$ en $0^+$. **On place $(1;1)$.**`),
    written("2.", String.raw`$f(x)=(0,5)^x$`, String.raw`La base $0{,}5$ est entre $0$ et $1$. La dérivée $(\ln0{,}5)(0{,}5)^x$ est négative : f décroît de $+\infty$ vers $0$. Elle passe par **$(0;1)$, $(1;1/2)$ et $(-1;2)$** ; $y=0$ est asymptote en $+\infty$.`),
    written("3.", String.raw`$f(x)=2^x-2$`, String.raw`La dérivée $(\ln2)2^x$ est positive. f croît de $-2$ à $+\infty$. **$y=-2$ est asymptote en $-\infty$**. Points utiles : $(0;-1)$, $(1;0)$, $(2;2)$. C’est la courbe de $2^x$ descendue de deux unités.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(37, "Un quotient de deux exponentielles affines", String.raw`$f(x)=\dfrac{e^x-3}{e^x-1}$. Repère orthonormal, unité 1 cm.`, [
    written("1.", "Détermine le domaine.", String.raw`$e^x-1=0$ exactement en $x=0$. **$D_f=\mathbb R\setminus\{0\}$.**`),
    written("2.a", "Calcule les limites en +∞ et −∞ et interprète.", String.raw`En $+\infty$, on divise par $e^x$ : $(1-3e^{-x})/(1-e^{-x})\to1$. En $-\infty$, on remplace $e^x$ par sa limite $0$ : $(-3)/(-1)=3$. **Les asymptotes horizontales sont $y=1$ à droite et $y=3$ à gauche.**`),
    written("2.b", "Calcule les limites à gauche et à droite en 0.", String.raw`Le numérateur tend vers $-2$. Le dénominateur est négatif pour $x<0$, positif pour $x>0$. **La limite en $0^-$ vaut $+\infty$, celle en $0^+$ vaut $-\infty$**. Ainsi $x=0$ est asymptote verticale.`),
    written("3.a", "Calcule la dérivée et son signe.", String.raw`Avec la règle du quotient,

$$f'(x)=\frac{e^x(e^x-1)-e^x(e^x-3)}{(e^x-1)^2}=\frac{2e^x}{(e^x-1)^2}>0.$$

**La fonction croît sur chacun des deux intervalles de son domaine**, pas à travers le point interdit $0$.`),
    written("3.b", "Dresse le tableau de variation.", String.raw`Sur $]-\infty;0[$, f croît de $3$ à $+\infty$. Sur $]0;+\infty[$, elle croît de $-\infty$ à $1$. Les valeurs $3$ et $1$ sont des limites, non des valeurs atteintes aux extrémités.`),
    written("4.", "Trace la courbe.", String.raw`On trace les trois asymptotes et le point **$(\ln3;0)$**. L’écriture $f=1-2/(e^x-1)$ place la branche droite sous $y=1$. À gauche, $f-3=2e^x/(1-e^x)>0$ : la branche est au-dessus de $y=3$.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(38, "Deux asymptotes obliques", String.raw`Partie A : $P(x)=2e^{2x}-5e^x+2$. Partie B : $f(x)=2x+1+\dfrac1{e^x-1}$. Repère orthonormal, unité 1 cm.`, [
    written("A.1", "Résous P(x)=0.", String.raw`Avec $X=e^x>0$, $2X^2-5X+2=(2X-1)(X-2)=0$. Donc $X=1/2$ ou $2$, soit **$S=\{-\ln2;\ln2\}$.**`),
    written("A.2", "Détermine le signe de P.", String.raw`Le polynôme en X est positif à l’extérieur de $[1/2;2]$ et négatif à l’intérieur. Comme $\exp$ est croissante : **P est positif pour $x<-\ln2$ ou $x>\ln2$, négatif entre les deux, et nul aux bornes.**`),
    written("B.1", "Détermine le domaine de f.", String.raw`Le dénominateur ne doit pas s’annuler : **$D_f=\mathbb R\setminus\{0\}$.**`),
    written("B.2.a", "Calcule les limites en +∞ et −∞.", String.raw`En $+\infty$, $1/(e^x-1)\to0$ et $2x+1\to+\infty$, donc **f tend vers $+\infty$**. En $-\infty$, la fraction tend vers $-1$, donc **f tend vers $-\infty$**.`),
    written("B.2.b", "Calcule les limites à gauche et à droite de 0.", String.raw`La fraction tend vers $-\infty$ en $0^-$ et $+\infty$ en $0^+$. Le terme $2x+1\to1$ ne change pas ces limites. **$x=0$ est asymptote verticale.**`),
    written("B.3.a", String.raw`Vérifie $f'(x)=P(x)/(e^x-1)^2$.`, String.raw`$f'=2-e^x/(e^x-1)^2$. Après mise au même dénominateur, le numérateur est $2(e^x-1)^2-e^x=2e^{2x}-5e^x+2=P(x)$.`),
    written("B.3.b", "Étudie le signe de f′.", String.raw`Le dénominateur est positif sur le domaine. Ainsi **f′ est positif avant −ln 2 et après ln 2 ; négatif sur ]−ln 2;0[ et ]0;ln 2[**. Il s’annule en $\pm\ln2$.`),
    written("B.3.c", "Dresse le tableau de variation.", String.raw`À gauche, f croît de $-\infty$ à **$f(-\ln2)=-2\ln2-1$**, puis décroît vers $-\infty$ en $0^-$. À droite, f décroît de $+\infty$ à **$f(\ln2)=2\ln2+2$**, puis croît vers $+\infty$.`),
    written("B.4.a", "Prouve que D : y = 2x + 1 est asymptote en +∞.", String.raw`$f-(2x+1)=1/(e^x-1)\to0$ en $+\infty$. **D est asymptote à droite.**`),
    written("B.4.b", "Précise la position par rapport à D pour x > 0.", String.raw`Pour $x>0$, $e^x-1>0$, donc $f-(2x+1)>0$. **Cf est strictement au-dessus de D.**`),
    written("B.5.a", "Prouve que D′ : y = 2x est asymptote en −∞.", String.raw`$f-2x=1+1/(e^x-1)=e^x/(e^x-1)\to0$ en $-\infty$. **D′ est asymptote à gauche.**`),
    written("B.5.b", "Précise la position par rapport à D′ pour x < 0.", String.raw`Pour $x<0$, $e^x>0$ mais $e^x-1<0$, donc $f-2x<0$. **Cf est strictement au-dessous de D′.**`),
    written("B.6", "Construis les droites et la courbe.", String.raw`On place les trois asymptotes et les deux extrema. Les branches sont séparées par $0$. On peut contrôler le dessin avec **$f(x)+f(-x)=1$** : la courbe a pour centre de symétrie $(0;1/2)$.`),
    written("B.7.a", String.raw`Détermine $a,b$ tels que $f(x)=ax+be^x/(e^x-1)$.`, String.raw`Puisque $1+1/(e^x-1)=e^x/(e^x-1)$, on obtient **$a=2,b=1$.**`),
    written("B.7.b", "Déduis les primitives sur ]−∞;0[.", String.raw`Sur $x<0$, $1-e^x>0$. La dérivée de $\ln(1-e^x)$ est $-e^x/(1-e^x)=e^x/(e^x-1)$. Les primitives sont donc **$F(x)=x^2+\ln(1-e^x)+C$.**`),
    written("B.7.c", "Donne celle qui prend la valeur 1 en −1.", String.raw`$F(-1)=1+\ln(1-e^{-1})+C$. Pour obtenir $1$, il faut $C=-\ln(1-e^{-1})$.

$$\boxed{F(x)=x^2+\ln(1-e^x)-\ln(1-e^{-1}),\quad x<0.}$$`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(39, "Une suite pour approcher une seconde intersection", String.raw`Soit $f(x)=x^2e^{-x}$ sur $\mathbb R$, puis $g(x)=-\dfrac2e e^{x/2}$ et $I=[-1;0]$. La suite est définie par $u_0=-1/2$ et $u_{n+1}=g(u_n)$.`, [
    written("1.", "Calcule f′.", String.raw`$f'=2xe^{-x}-x^2e^{-x}=\boxed{x(2-x)e^{-x}}$. Le facteur exponentiel est toujours positif.`),
    written("2.", "Dresse le tableau de variation et les limites.", String.raw`f′ est négative pour $x<0$, positive pour $0<x<2$, négative après $2$. **f décroît de +∞ à 0, croît jusqu’à $f(2)=4/e^2$, puis décroît vers 0.** À droite, on utilise $x^2e^{-x}\to0$ ; à gauche, le produit positif tend vers $+\infty$.`),
    written("3.", "Trace Cf dans un repère orthonormal, unité 4 cm.", String.raw`On place **$(0;0)$**, minimum avec tangente horizontale, et **$(2;4/e^2)$**, maximum local. L’axe $y=0$ est asymptote en $+\infty$. La droite $y=4/e^2$ coupe aussi la branche $x<0$ en une abscisse α.`),
    written("4.", String.raw`Pour $\alpha\in I$, montre $f(\alpha)=f(2)\iff g(\alpha)=\alpha$.`, String.raw`L’égalité est $\alpha^2e^{-\alpha}=4/e^2$, donc $\alpha^2=(4/e^2)e^\alpha$. Puisque $\alpha\le0$, la racine carrée donne **$\alpha=-(2/e)e^{\alpha/2}=g(\alpha)$**. Réciproquement, élever cette dernière égalité au carré redonne la première. Le signe négatif est imposé par $I$.`),
    written("5.a", "Démontre que g(I) est inclus dans I.", String.raw`$g'=-e^{x/2}/e<0$, donc g est décroissante. Ses valeurs de bord donnent **$g(I)=[-2/e;-2e^{-3/2}]\subset[-1;0]$**, car les deux bornes sont comprises entre $-1$ et $0$.`),
    written("5.b", String.raw`Montre $|g'(x)|\le1/e$ sur I.`, String.raw`Pour $x\in[-1;0]$, $e^{x/2}\le1$. Donc **$|g'(x)|=e^{x/2}/e\le1/e$.**`),
    written("5.c", String.raw`Déduis $|g(x)-\alpha|\le|x-\alpha|/e$.`, String.raw`f est continue et strictement décroissante sur I ; $f(-1)=e>4/e^2>f(0)=0$. Il existe donc une unique $\alpha\in]-1;0[$ avec $g(\alpha)=\alpha$. L’inégalité des accroissements finis sur I donne **$|g(x)-g(\alpha)|\le|x-\alpha|/e$**, soit le résultat.`),
    written("6.a", String.raw`Prouve $|u_n-\alpha|\le e^{-n}|u_0-\alpha|$.`, String.raw`Les termes restent dans I grâce à $g(I)\subset I$. Pour $n=0$, c’est une égalité. Si la borne est vraie au rang n, la contraction donne

$$|u_{n+1}-\alpha|\le\frac1e|u_n-\alpha|\le e^{-(n+1)}|u_0-\alpha|.$$

**La propriété est vraie pour tout n par récurrence.**`),
    written("6.b", String.raw`Déduis $|u_n-\alpha|\le1/(2e^n)$.`, String.raw`$u_0=-1/2$ est le milieu de $[-1;0]$ et $\alpha\in I$, donc $|u_0-\alpha|\le1/2$. La borne précédente devient **$|u_n-\alpha|\le1/(2e^n)$.**`),
    short("6.c", String.raw`Quel est le plus petit entier n garantissant une erreur au plus $10^{-6}$ par cette borne ?`, "$14$", ["14"], String.raw`Il faut $1/(2e^n)\le10^{-6}$, soit $e^n\ge500000$, puis $n\ge\ln500000\approx13{,}1224$. **Le premier entier garanti est 14.** Le calcul itératif donne alors $\alpha\approx-0{,}556929$ ; on ne confond pas une erreur observée avec la garantie théorique.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
];
