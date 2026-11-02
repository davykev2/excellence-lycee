import { integralExercise as ex, tf, choice, written } from "./terminalCIntegralBuilders";

export const integralFixationC = [
  ex(30, "Choisir une formule d’aire", String.raw`On suppose $a<b$. Les fonctions utilisées sont continues sur $\mathbb R$.`, [
    choice("1.", String.raw`Si $g\le0$ sur $[a;b]$, l’aire entre sa courbe et l’axe vaut, en unités d’aire :`,
      [String.raw`$\int_b^ag$`, String.raw`$\int_a^bg$`, String.raw`$\int_b^a(-g)$`, String.raw`$\int_a^bg(-x)\,dx$`], 0,
      String.raw`L’aire est $-\int_a^bg$, puisque $g\le0$. Inverser les bornes change le signe : **$\int_b^ag$ est la réponse A**. Une aire ne peut pas être négative.`),
    choice("2.", String.raw`Si $g\le h$ sur $[a;b]$, l’aire entre leurs courbes vaut :`, [
      String.raw`$\int_a^b(-h+g)$`, String.raw`$\int_b^a(h-g)$`, String.raw`$-\int_a^b(g-h)$`, String.raw`$-\int_b^a(g-h)$`,
    ], 2, String.raw`On intègre le haut moins le bas : $\int_a^b(h-g)=-\int_a^b(g-h)$. **Réponse C.**`),
  ]),
  ex(31, "Aire sous une fonction rationnelle", String.raw`$f(x)=2x/(x^2+1)$. Le repère est orthonormé, d’unité $2$ cm.`, [
    written("1.", String.raw`Calcule l’aire entre la courbe, l’axe et $x=0$, $x=2$, en cm².`, String.raw`Sur $[0;2]$, $f\ge0$. Une primitive est $\ln(x^2+1)$ car $(x^2+1)'=2x$.
$$\mathcal A_{\text{unités}}=\int_0^2\frac{2x}{x^2+1}\,dx=\ln5-\ln1=\ln5.$$
Une unité d’aire vaut $2\times2=4$ cm². **L’aire demandée vaut $4\ln5$ cm².**`),
  ], { figureKey: "tc-l7-integrals" }),
  ex(32, "Deux aires d’une parabole", String.raw`$f(x)=x^2+2x$. Le repère est orthogonal avec $OI=2$ cm et $OJ=1$ cm.`, [
    written("1.", String.raw`Calcule l’aire entre la courbe, l’axe et les droites $x=0$, $x=2$.`, String.raw`Sur $[0;2]$, $x(x+2)\ge0$. L’aire en unités vaut :
$$\int_0^2(x^2+2x)\,dx=\left[\frac{x^3}3+x^2\right]_0^2=\frac83+4=\frac{20}3.$$
Une unité vaut $2$ cm² ; **l’aire est $40/3$ cm²**.`),
    written("2.", String.raw`Calcule l’aire du domaine délimité par la courbe, l’axe et $x=-1$, $x=1$.`, String.raw`Les zéros sont $-2$ et $0$. Sur $[-1;0]$, $f\le0$ ; sur $[0;1]$, $f\ge0$ :
$$\mathcal A_{\text{unités}}=-\int_{-1}^0(x^2+2x)\,dx+\int_0^1(x^2+2x)\,dx.$$
Avec $F=x^3/3+x^2$, le premier terme vaut $2/3$, le second $4/3$. Total : $2$ unités. **L’aire vaut $2\times2=4$ cm².**`),
  ], { figureKey: "tc-l7-integrals" }),
  ex(33, "Aire entre une courbe et son asymptote", String.raw`$f(x)=x-2-4/(x-1)^2$, $D:x=1$, $\Delta:y=x-2$. Unité graphique : $1$ cm.`, [
    written("1.", String.raw`Calcule l’aire entre $C_f$, $\Delta$ et les droites $x=2$, $x=4$.`, String.raw`Sur $[2;4]$, $\Delta$ est au-dessus de la courbe car $(x-2)-f(x)=4/(x-1)^2>0$. Donc :
$$\mathcal A=\int_2^4\frac4{(x-1)^2}\,dx=\left[-\frac4{x-1}\right]_2^4=-\frac43+4=\boxed{\frac83\ {\rm cm}^2}.$$`),
  ], { figureKey: "tc-l7-integrals" }),
  ex(34, "Aire et exponentielle", String.raw`$f(x)=2x+1-xe^{-x}$ et $D:y=2x+1$. Le repère est orthonormé d’unité $2$ cm.`, [
    written("1.", String.raw`Calcule l’aire entre $C_f$, $D$ et $x=-1$, $x=0$.`, String.raw`Sur $[-1;0]$, $-xe^{-x}\ge0$, donc $C_f$ est au-dessus de $D$.
$$\mathcal A_{\text{unités}}=\int_{-1}^0-xe^{-x}\,dx=[(x+1)e^{-x}]_{-1}^0=1.$$
Une unité d’aire vaut $4$ cm². **L’aire vaut $4$ cm².**`),
  ], { figureKey: "tc-l7-integrals" }),
  ex(35, "Reconnaître les sommes de rectangles", String.raw`$f$ est continue, positive et strictement décroissante sur $[a;b]$, $a<b$. Pour $n\ge1$, $h=(b-a)/n$ et $x_i=a+ih$. Réponds par Vrai ou Faux.`, [
    tf("1.", String.raw`$\int_a^bf\le h\sum_{i=0}^{n-1}f(x_i)$.`, true, "Une fonction décroissante reste sous la hauteur prise au bord gauche de chaque petit intervalle. La somme gauche majore donc l’intégrale."),
    tf("2.", String.raw`$\int_a^bf\ge h\sum_{i=0}^{n-1}f(x_i)$.`, false, "La fonction est strictement décroissante : sur chaque intervalle de largeur positive, le rectangle gauche est strictement au-dessus, sauf au point de départ. L’intégrale est strictement plus petite que cette somme."),
    tf("3.", String.raw`$\int_a^bf\ge h\sum_{i=0}^{n-1}f(x_{i+1})$.`, true, "Pour une fonction décroissante, les hauteurs prises à droite donnent des rectangles sous la courbe. Leur somme minore l’intégrale."),
    tf("4.", String.raw`$\frac1n\sum_{i=0}^{n-1}f(x_i)\le\frac1{b-a}\int_a^bf\le\frac1n\sum_{i=1}^nf(x_i)$.`, false, String.raw`Les sommes ont été placées à l’envers. L’encadrement correct est **somme droite $\le$ valeur moyenne $\le$ somme gauche**.`),
    tf("5.", String.raw`$\frac1n\sum_{i=0}^{n-1}f(x_i)\to\frac1{b-a}\int_a^bf$.`, true, "La somme multipliée par h converge vers l’intégrale. En divisant par b−a, on obtient le facteur 1/n et la valeur moyenne."),
    tf("6.", String.raw`Pour $[a;b]=[1;2]$, avec $f$ également continue et décroissante sur $[0;2]$, $\frac1n\sum_{i=1}^nf(i/n)$ approche toujours $\int_1^2f$.`, false, String.raw`Les points $i/n$ parcourent $[0;1]$, pas $[1;2]$. Il faut utiliser $1+i/n$. Par exemple, pour $f(x)=3-x$, la somme proposée tend vers $5/2$, alors que $\int_1^2f=3/2$.`),
  ]),
  ex(36, "Six rectangles", String.raw`$f(x)=-2/\ln x$ est continue, positive et croissante sur $[0,1;0,7]$. On partage cet intervalle en six morceaux égaux.`, [
    written("1.", String.raw`Donne un encadrement de $\int_{0,1}^{0,7}-2/\ln x\,dx$.`, String.raw`Le pas vaut $h=(0,7-0,1)/6=0,1$. La fonction est croissante : somme gauche $\le I\le$ somme droite.

| $x$ | 0,1 | 0,2 | 0,3 | 0,4 | 0,5 | 0,6 | 0,7 |
|---|---|---|---|---|---|---|---|
| $f(x)$, environ | 0,86859 | 1,24267 | 1,66117 | 2,18271 | 2,88539 | 3,91523 | 5,60735 |

La somme gauche utilise les six premières valeurs : $L_6\approx1,27557597$. La somme droite utilise les six dernières : $R_6\approx1,74945173$.

En arrondissant **vers l’extérieur**, **$1,27557<I<1,74946$**. Les valeurs du tableau ne doivent pas être réarrondies avant le calcul des sommes.`),
  ], { correctionFigureKey: "tc-l7-integrals" }),
  ex(37, "Dix rectangles et une incertitude", String.raw`$K=\int_{-1}^4e^x/(x^2+1)\,dx$.`, [
    written("1.", "Encadre K avec dix intervalles de même longueur.", String.raw`Posons $f(x)=e^x/(1+x^2)$. Sa dérivée vaut :
$$f'(x)=\frac{e^x(x^2-2x+1)}{(1+x^2)^2}=\frac{e^x(x-1)^2}{(1+x^2)^2}\ge0.$$
La fonction est croissante. Le pas vaut $(4-(-1))/10=0,5$.

La somme gauche utilise $-1;-0,5;0;\ldots;3,5$ et la somme droite $-0,5;0;\ldots;4$ :
$$L_{10}=0,5\sum_{i=0}^9\frac{e^{-1+0,5i}}{1+(-1+0,5i)^2}\approx6,69612587.$$
$$R_{10}=0,5\sum_{i=1}^{10}\frac{e^{-1+0,5i}}{1+(-1+0,5i)^2}\approx8,20998395.$$
**Encadrement sûr : $6,69612<K<8,20999$.**`),
    written("2.", "Donne une valeur approchée et précise son incertitude.", String.raw`Le milieu des deux sommes non arrondies est :
$$A=\frac{L_{10}+R_{10}}2\approx7,45305491.$$
La demi-différence vaut environ $0,75692904$. En tenant compte de l’arrondi, on peut annoncer **$K\approx7,45305$ avec une erreur inférieure à $0,75694$**. Dix rectangles donnent ici un encadrement assez large ; on ne prétend pas à une précision au centième.`),
  ], { correctionFigureKey: "tc-l7-integrals" }),
];
