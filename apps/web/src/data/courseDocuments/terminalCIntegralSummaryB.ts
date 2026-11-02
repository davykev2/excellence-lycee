import type { CourseDocumentSection } from "../../domain/courseDocument";

export const integralSummaryB: CourseDocumentSection[] = [
  { id: "int-symmetries", numeral: "V", title: "Parité et périodicité", topics: [
    { id: "int-parity", title: "Intégrer sur un intervalle symétrique", pages: [174], legacyLessonIds: ["integral-symmetry-function"],
      body: String.raw`Soit $a\ge0$, et $f$ continue sur $[-a;a]$.

| Parité de $f$ | Propriété |
|---|---|
| Paire : $f(-x)=f(x)$ | $\int_{-a}^a f=2\int_0^a f$ et $\int_{-a}^0f=\int_0^af$ |
| Impaire : $f(-x)=-f(x)$ | $\int_{-a}^a f=0$ |

Vérifie le **domaine**, puis la parité de toute l’expression avant d’appliquer ces formules.`,
      examples: [{ id: "int-parity-examples", title: "Reconnaître une fonction paire ou impaire", prompt: "Calculer en utilisant la symétrie.", parts: [
        { id: "int-parity-log", label: "a)", prompt: String.raw`$\displaystyle\int_{-2}^2\ln\left(\frac{3-x}{3+x}\right)dx$.`, solution: String.raw`Pour $-2\le x\le2$, $3-x$ et $3+x$ sont positifs. La fonction est continue et :
$$f(-x)=\ln\left(\frac{3+x}{3-x}\right)=-\ln\left(\frac{3-x}{3+x}\right)=-f(x).$$
Elle est impaire ; les contributions de part et d’autre de $0$ se compensent. **L’intégrale vaut $0$.**` },
        { id: "int-parity-cos", label: "b)", prompt: String.raw`$\displaystyle\int_{-\pi/12}^{\pi/12}\cos2t\,dt$.`, solution: String.raw`Le cosinus est pair, donc $\cos(2(-t))=\cos2t$. Ainsi :
$$I=2\int_0^{\pi/12}\cos2t\,dt=2\left[\frac12\sin2t\right]_0^{\pi/12}=\sin\frac\pi6=\boxed{\frac12}.$$` },
      ] }],
    },
    { id: "int-period", title: "Intégrer une fonction périodique", pages: [174,175],
      body: String.raw`Si $f$ est continue sur $\mathbb R$ et de période $T>0$, alors :

$$\int_a^{a+T}f(x)\,dx=\int_0^Tf(x)\,dx.$$

L’intégrale sur une période entière ne dépend pas du point de départ. On peut aussi décaler **les deux bornes** d’un même multiple entier de $T$ :
$$\int_{a+T}^{b+T}f=\int_a^bf.$$

Être périodique ne signifie pas avoir une intégrale nulle : la fonction constante $1$ a une intégrale égale à $T$ sur une période.`,
      examples: [{ id: "int-period-example", title: "Une période complète", prompt: String.raw`Calculer $\int_{-\pi/4}^{7\pi/4}(\cos x+\sin x)\,dx$.`, solution: String.raw`La fonction est de période $2\pi$ et les bornes sont séparées de $2\pi$. On peut remplacer l’intervalle par $[-\pi;\pi]$ :

$$I=\int_{-\pi}^{\pi}\cos x\,dx+\int_{-\pi}^{\pi}\sin x\,dx.$$
Le sinus est impair, donc sa contribution est nulle. Pour le cosinus :
$$\int_{-\pi}^{\pi}\cos x\,dx=2[\sin x]_0^\pi=0.$$
Ainsi **$I=0$**.` }],
    },
  ] },
  { id: "int-variable-bound", numeral: "VI", title: "Une fonction définie par une intégrale", topics: [
    { id: "int-variable", title: "Dériver et reconnaître la primitive particulière", pages: [175],
      body: String.raw`Si $f$ est continue sur un intervalle $I$ et $a\in I$, alors :

$$G(x)=\int_a^x f(t)\,dt$$

est **l’unique primitive de $f$ sur $I$ qui s’annule en $a$**. En particulier, $G'(x)=f(x)$ et $G(a)=0$.

La borne $x$ varie ; la lettre $t$ reste la variable d’intégration. On n’a pas besoin de connaître une expression élémentaire de $G$ pour la dériver.`,
      examples: [{ id: "int-variable-example", title: "Dérivée et valeurs particulières", prompt: String.raw`Soit $G(x)=\int_{-1}^x\frac{dt}{1+t^2}$.`, parts: [
        { id: "int-variable-derivative", label: "1.", prompt: String.raw`Déterminer $G'(x)$ et $G(-1)$.`, solution: String.raw`La fonction $t\mapsto1/(1+t^2)$ est continue sur $\mathbb R$, car $1+t^2>0$. Le théorème donne directement :

$$\boxed{G'(x)=\frac1{1+x^2},\qquad G(-1)=0.}$$` },
        { id: "int-variable-zero", label: "2.", prompt: String.raw`Calculer $G(0)$.`, solution: String.raw`Pour $s\in[-\pi/4;0]$, posons $H(s)=G(\tan s)$. Par dérivation d’une composée :
$$H'(s)=\frac1{1+\tan^2s}\,(1+\tan^2s)=1.$$
Donc $H(s)=s+C$. Or $H(-\pi/4)=G(-1)=0$, d’où $C=\pi/4$. Ainsi **$G(0)=H(0)=\pi/4$**.` },
      ] }],
    },
  ] },
  { id: "int-areas", numeral: "VII", title: "Calcul d’aires", topics: [
    { id: "int-area-sign", title: "Entre une courbe et l’axe des abscisses", pages: [175,176], legacyLessonIds: ["integral-area"],
      body: String.raw`Pour $a<b$, l’aire entre la courbe de $f$, l’axe des abscisses et les droites $x=a$, $x=b$ est :

$$\mathcal A=\int_a^b|f(x)|\,dx\quad\text{en unités d’aire.}$$

- Si $f\ge0$, $\mathcal A=\int_a^bf$.
- Si $f\le0$, $\mathcal A=-\int_a^bf$.
- Si $f$ change de signe, coupe l’intervalle aux zéros, puis additionne les aires positives.

Une unité d’aire est le rectangle de côtés $OI$ et $OJ$. Si $OI=p$ cm et $OJ=q$ cm, **multiplie l’aire en unités par $pq$ pour obtenir des cm²**.`,
      examples: [{ id: "int-negative-area", title: "Une courbe sous l’axe", prompt: String.raw`Le repère est orthonormé d’unité $1$ cm. Pour $f(x)=(x-1)(4-x^2)$, calculer l’aire sur $[-1;1]$.`, solution: String.raw`Sur $[-1;1]$, $x-1\le0$ et $4-x^2>0$, donc $f\le0$. L’aire est l’opposé de l’intégrale.

$$f(x)=-x^3+x^2+4x-4.$$
Une primitive est $F(x)=-x^4/4+x^3/3+2x^2-4x$. On trouve $F(1)=-23/12$ et $F(-1)=65/12$.
$$\mathcal A=-\bigl(F(1)-F(-1)\bigr)=\frac{88}{12}=\boxed{\frac{22}3\ \text{cm}^2}.$$` }],
    },
    { id: "int-area-between", title: "Entre deux courbes", pages: [176],
      body: String.raw`Si $f,g$ sont continues sur $[a;b]$, $a<b$, l’aire entre leurs courbes est :

$$\mathcal A=\int_a^b|g(x)-f(x)|\,dx.$$

Sur chaque morceau, on intègre **fonction du haut moins fonction du bas**. Les points d’intersection se trouvent en résolvant $f(x)=g(x)$.`,
      nativeFigure: { kind: "integral", preset: "between-curves" },
      examples: [{ id: "int-between-example", title: "Deux courbes qui se croisent", prompt: String.raw`$f(x)=-x^2-x+2$, $g(x)=2x+2$. Calculer l’aire entre les courbes sur $[-1;1]$, avec $OI=2$ cm et $OJ=1$ cm.`, parts: [
        { id: "int-between-sign", label: "1.", prompt: "Identifier la courbe située au-dessus.", solution: String.raw`$f-g=-x^2-3x=-x(x+3)$. Sur $[-1;1]$, $x+3>0$ : $f-g\ge0$ pour $x\le0$, puis $f-g\le0$ pour $x\ge0$. **On coupe en $0$**.` },
        { id: "int-between-sum", label: "2.", prompt: "Calculer les deux aires puis convertir.", solution: String.raw`À gauche, on intègre $f-g$ ; à droite, $g-f$ :

$$\mathcal A_1=\int_{-1}^0(-x^2-3x)\,dx=\left[-\frac{x^3}3-\frac{3x^2}2\right]_{-1}^0=\frac76.$$
$$\mathcal A_2=\int_0^1(x^2+3x)\,dx=\left[\frac{x^3}3+\frac{3x^2}2\right]_0^1=\frac{11}6.$$

Au total, $\mathcal A=3$ unités d’aire. Une unité vaut $2\times1=2$ cm², donc **$\mathcal A=6$ cm²**.` },
      ] }],
    },
  ] },
  { id: "int-numerical", numeral: "VIII", title: "Calcul approché par les rectangles", topics: [
    { id: "int-rectangles", title: "Encadrer l’intégrale avec n rectangles", pages: [177,178],
      body: String.raw`On partage $[a;b]$ en $n$ intervalles de même longueur $h=(b-a)/n$ et on pose $x_i=a+ih$.

$$L_n=h\sum_{i=0}^{n-1}f(x_i),\qquad R_n=h\sum_{i=1}^nf(x_i).$$

Si $f$ est croissante, $L_n\le\int_a^bf\le R_n$ ; si elle est décroissante, $R_n\le\int_a^bf\le L_n$.

Le milieu $A_n=(L_n+R_n)/2$ donne une approximation avec :
$$\left|\int_a^bf-A_n\right|\le\frac{|R_n-L_n|}2.$$

**n rectangles utilisent n hauteurs.** La somme de $i=0$ à $n$ contient une hauteur supplémentaire ; elle n’a donc pas exactement le même encadrement.`,
      nativeFigure: { kind: "integral", preset: "rectangles" },
      examples: [{ id: "int-rect-example", title: "Une approximation et sa précision", prompt: String.raw`Approcher $I=\int_{0,4}^{0,6}\sqrt{4-x^2}\,dx$ avec $n=10$.`, solution: String.raw`La fonction est décroissante sur cet intervalle et $h=(0,6-0,4)/10=0,02$.

On calcule $R_{10}=0,02\sum_{i=1}^{10}\sqrt{4-(0,4+0,02i)^2}$ et $L_{10}$ avec les rangs de $0$ à $9$.

Les sommes donnent environ $R_{10}=0,3865938$ et $L_{10}=0,3876281$. Un encadrement arrondi vers l’extérieur est :
$$0,38659<I<0,38764.$$
Le milieu des **sommes non arrondies** est environ $0,3871109$. La demi-différence est environ $0,0005171$.

On peut donc annoncer **$I\approx0,38711$ avec une erreur inférieure à $0,00053$**. La précision annoncée doit toujours être au moins aussi large que la borne d’erreur calculée.` }],
    },
    { id: "int-riemann", title: "Passer d’une somme à une intégrale", pages: [178],
      body: String.raw`Si $f$ est continue sur $[a;b]$, $a<b$, les sommes de rectangles convergent :
$$\frac{b-a}{n}\sum_{k=0}^{n-1}f\left(a+\frac{k(b-a)}n\right)\longrightarrow\int_a^bf(x)\,dx.$$

La somme prise aux bords droits, avec $k=1,\ldots,n$, converge vers la même intégrale.

Avec un facteur $1/n$ seulement, les deux limites sont donc **la valeur moyenne** $(b-a)^{-1}\int_a^bf$. La somme allant de $0$ à $n$ a aussi la même limite car son terme supplémentaire est $(b-a)f(b)/n\to0$.`,
      examples: [{ id: "int-riemann-sin", title: "Limite d’une somme de sinus", prompt: String.raw`Déterminer la limite de $u_n=\frac1n\sum_{k=0}^{n-1}\sin(k\pi/n)$.`, solution: String.raw`Prenons $f(x)=\sin x$ sur $[0;\pi]$. Elle est continue, et les points sont $x_k=k\pi/n$.

$$\frac\pi n\sum_{k=0}^{n-1}\sin(k\pi/n)\longrightarrow\int_0^\pi\sin x\,dx=2.$$
Comme $u_n$ est cette somme divisée par $\pi$, **$\lim u_n=2/\pi$**.` }],
    },
  ] },
];
