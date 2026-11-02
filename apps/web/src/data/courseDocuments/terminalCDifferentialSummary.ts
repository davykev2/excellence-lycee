import type { CourseDocumentSection } from "../../domain/courseDocument";

export const differentialSummary: CourseDocumentSection[] = [
  { id: "ode-generalities", numeral: "I", title: "Généralités", topics: [
    { id: "ode-definition", title: "Reconnaître une équation différentielle", pages: [198],
      body: String.raw`Une **équation différentielle** est une équation dont l’inconnue est une fonction et dans laquelle intervient au moins une de ses dérivées.

L’**ordre** est celui de la dérivée la plus élevée qui apparaît effectivement. Ainsi, pour des constantes $a,b,c$ et **$a\ne0$** :
$$ay''+by'+cy=0$$
est une équation **linéaire d’ordre 2, à coefficients constants, sans second membre**.

- Linéaire : $y$, $y'$ et $y''$ interviennent au premier degré, sans produit entre eux.
- À coefficients constants : $a,b,c$ ne dépendent pas de $x$.
- Sans second membre : le membre de droite est nul.

Résoudre l’équation, c’est trouver **toutes les fonctions** qui la vérifient sur l’intervalle considéré. Pour vérifier une solution proposée, on la dérive, puis on la remplace dans l’équation.`,
      examples: [{ id: "ode-order-examples", title: "Déterminer l’ordre", prompt: "Examiner les deux équations.", parts: [
        { id: "ode-order-two", label: "a)", prompt: String.raw`$3y''-2y'+4y=0$.`,
          solution: String.raw`La dérivée la plus élevée est $y''$ et son coefficient $3$ est non nul. L’équation est donc d’**ordre 2**, linéaire, à coefficients constants et sans second membre.` },
        { id: "ode-order-one", label: "b)", prompt: String.raw`$-5y'+7y=0$.`,
          solution: String.raw`Seules $y$ et $y'$ apparaissent. Le coefficient de $y'$ est non nul : l’équation est d’**ordre 1**, linéaire, à coefficients constants et sans second membre.` },
      ] }],
    },
  ] },
  { id: "ode-homogeneous", numeral: "II", title: String.raw`Équations du type $y'=ay$`, topics: [
    { id: "ode-first-general", title: "La famille des solutions", pages: [198], legacyLessonIds: ["first-order-homogeneous"],
      body: String.raw`Pour un réel $a$, les solutions définies sur $\mathbb R$ de $y'=ay$ sont exactement :
$$\boxed{y(x)=Ce^{ax},\qquad C\in\mathbb R.}$$
La constante $C$ est quelconque : il y a une famille de solutions. **La fonction nulle en fait partie** ($C=0$).

Pour appliquer cette propriété, isole d’abord $y'$. Si $a=0$, l’équation devient $y'=0$ et les solutions sont les fonctions constantes.`,
      examples: [{ id: "ode-minus-three", title: "Identifier le coefficient", prompt: String.raw`Résoudre $y'=-3y$ sur $\mathbb R$.`,
        solution: String.raw`On reconnaît $y'=ay$ avec $a=-3$. Les solutions sont donc :
$$\boxed{y(x)=Ce^{-3x},\quad C\in\mathbb R.}$$
Vérification : $y'(x)=-3Ce^{-3x}=-3y(x)$.` }],
      nativeFigure: { kind: "differential", preset: "first-order" },
    },
    { id: "ode-first-initial", title: "Utiliser une condition initiale", pages: [198], legacyLessonIds: ["first-order-initial-value"],
      body: String.raw`Pour tous réels $x_0,y_0$, il existe **une unique solution** de $y'=ay$ telle que $y(x_0)=y_0$.

Dans $y(x)=Ce^{ax}$, remplace $x$ par $x_0$ :
$$Ce^{ax_0}=y_0\quad\Longrightarrow\quad C=y_0e^{-ax_0}.$$
Ainsi, on peut aussi écrire :
$$\boxed{y(x)=y_0e^{a(x-x_0)}.}$$
On vérifie à la fin **l’équation et la condition**, pas seulement l’une des deux.`,
      examples: [{ id: "ode-first-initial-examples", title: "Trouver la constante", prompt: "Résoudre avec la condition donnée.", parts: [
        { id: "ode-initial-two", label: "1.", prompt: String.raw`$3y'-2y=0$ et $y(2)=e^2$.`,
          solution: String.raw`**1. Forme générale.** $3y'=2y$, donc $y'=\frac23y$ et $y(x)=Ce^{2x/3}$.

**2. Condition.** Pour $x=2$ :
$$Ce^{4/3}=e^2\quad\Longrightarrow\quad C=e^{2-4/3}=e^{2/3}.$$
**Conclusion :** $y(x)=\boxed{e^{\frac23(x+1)}}$. En $2$, l’exposant vaut $2$, comme demandé.` },
        { id: "ode-initial-minus-one", label: "2.", prompt: String.raw`$y'-2y=0$ et $y(-1)=-3$.`,
          solution: String.raw`La forme générale est $y(x)=Ce^{2x}$. La condition donne :
$$Ce^{-2}=-3\quad\Longrightarrow\quad C=-3e^2.$$
Donc $\boxed{y(x)=-3e^{2x+2}}$. Pour $x=-1$, l’exponentielle vaut $1$ : on retrouve $-3$.` },
      ] }],
    },
  ] },
  { id: "ode-affine", numeral: "III", title: String.raw`Équations du type $y'=ay+b$`, topics: [
    { id: "ode-affine-general", title: "Un second membre constant", pages: [199], legacyLessonIds: ["first-order-constant"],
      body: String.raw`Soient $a,b\in\mathbb R$ avec **$a\ne0$**. Les solutions sur $\mathbb R$ de $y'=ay+b$ sont :
$$\boxed{y(x)=Ce^{ax}-\frac ba,\qquad C\in\mathbb R.}$$
La fonction constante $-\frac ba$ est une solution : $a(-b/a)+b=0$. En posant $z=y+b/a$, on se ramène à $z'=az$.

Une condition $y(x_0)=y_0$ détermine une unique constante :
$$C=\left(y_0+\frac ba\right)e^{-ax_0}.$$
**Si $a=0$**, on résout directement $y'=b$ : $y(x)=bx+C$. On ne divise pas par $0$.`,
      examples: [{ id: "ode-affine-examples", title: "Isoler y′ avant d’appliquer la propriété", prompt: "Résoudre les deux équations.", parts: [
        { id: "ode-affine-four", label: "a)", prompt: String.raw`$y'=4y-\frac52$.`,
          solution: String.raw`Ici $a=4$ et $b=-5/2$. Attention au signe :
$$-\frac ba=-\frac{-5/2}{4}=\frac58.$$
Les solutions sont $\boxed{y(x)=Ce^{4x}+\frac58}$, $C\in\mathbb R$.

Vérification : $4y-5/2=4Ce^{4x}+5/2-5/2=4Ce^{4x}=y'$.` },
        { id: "ode-affine-seven", label: "b)", prompt: String.raw`$3y'=7y+9$.`,
          solution: String.raw`Divisons **toute l’équation** par $3$ :
$$y'=\frac73y+3.$$
Ainsi $a=7/3$, $b=3$ et $-b/a=-3/(7/3)=-9/7$.
$$\boxed{y(x)=Ce^{7x/3}-\frac97,\qquad C\in\mathbb R.}$$` },
      ] }],
    },
  ] },
  { id: "ode-positive-second", numeral: "IV", title: String.raw`Équations du type $y''=\omega^2y$`, topics: [
    { id: "ode-second-zero", title: String.raw`Le cas $y''=0$`, pages: [199],
      body: String.raw`Les solutions sur $\mathbb R$ de $y''=0$ sont les fonctions affines :
$$\boxed{y(x)=Ax+B,\qquad A,B\in\mathbb R.}$$
En effet, $y''=0$ signifie que $y'$ est constante ; puis $y$ est affine.

Deux valeurs $y(x_0)=y_0$ et $y(x_1)=y_1$ déterminent une unique solution **si $x_0\ne x_1$**. On résout le système $Ax_0+B=y_0$, $Ax_1+B=y_1$.`,
      examples: [{ id: "ode-zero-examples", title: "Vérifier puis déterminer une fonction affine", prompt: "Traiter les quatre cas.", parts: [
        { id: "ode-zero-f", label: "1.a)", prompt: String.raw`Vérifier que $f(x)=8x-7$ est solution de $y''=0$.`,
          solution: String.raw`$f'(x)=8$, puis $f''(x)=0$. La fonction $f$ vérifie donc l’équation sur $\mathbb R$.` },
        { id: "ode-zero-g", label: "1.b)", prompt: String.raw`Même question pour $g(x)=-x/2+5$.`,
          solution: String.raw`$g'(x)=-1/2$ et $g''(x)=0$. La fonction $g$ est elle aussi solution. Une fonction affine peut avoir une pente positive, négative ou nulle.` },
        { id: "ode-zero-two-points", label: "2.a)", prompt: String.raw`Déterminer $y$ avec $y(-1)=1$ et $y(1)=3$.`,
          solution: String.raw`Écrivons $y(x)=Ax+B$. Les conditions donnent $-A+B=1$ et $A+B=3$. En additionnant : $2B=4$, donc $B=2$, puis $A=1$.
$$\boxed{y(x)=x+2.}$$
Les deux valeurs imposées sont bien $1$ et $3$.` },
        { id: "ode-zero-origin", label: "2.b)", prompt: String.raw`Déterminer $y$ avec $y(0)=0$ et $y(1)=1$.`,
          solution: String.raw`Dans $y(x)=Ax+B$, $y(0)=B=0$, puis $y(1)=A=1$. Ainsi $\boxed{y(x)=x}$.` },
      ] }],
    },
    { id: "ode-second-positive", title: "Deux exponentielles et deux constantes", pages: [199,200], legacyLessonIds: ["second-order-hyperbolic"],
      body: String.raw`Pour un réel $\omega\ne0$, les solutions sur $\mathbb R$ de $y''=\omega^2y$ sont :
$$\boxed{y(x)=Ae^{\omega x}+Be^{-\omega x},\qquad A,B\in\mathbb R.}$$
Par exemple, pour $y''=9y$, on prend $\omega=3$ : $y(x)=Ae^{3x}+Be^{-3x}$.

Deux conditions **au même point**, $y(x_0)=y_0$ et $y'(x_0)=z_0$, déterminent une unique solution.
$$y'(x)=\omega Ae^{\omega x}-\omega Be^{-\omega x}.$$
Le signe **moins** dans la dérivée du second terme vient de $(e^{-\omega x})'=-\omega e^{-\omega x}$.`,
      examples: [{ id: "ode-hyperbolic-initial", title: "Résoudre un système de deux constantes", prompt: String.raw`Résoudre $4y''-y=0$ avec $y(0)=3$ et $y'(0)=-3$.`,
        solution: String.raw`**1. Reconnaître le type.** $y''=\frac14y$ et $\omega=1/2$ :
$$y(x)=Ae^{x/2}+Be^{-x/2},\qquad y'(x)=\frac A2e^{x/2}-\frac B2e^{-x/2}.$$
**2. Utiliser les conditions.** En $0$, les exponentielles valent $1$ :
$$A+B=3,\qquad \frac{A-B}{2}=-3.$$
La seconde égalité donne $A-B=-6$. En additionnant les deux équations, $2A=-3$, donc $A=-3/2$ et $B=9/2$.

**Conclusion :**
$$\boxed{y(x)=-\frac32e^{x/2}+\frac92e^{-x/2}.}$$
On vérifie $y(0)=3$ et $y'(0)=-3$.` }],
    },
  ] },
  { id: "ode-negative-second", numeral: "V", title: String.raw`Équations du type $y''=-\omega^2y$`, topics: [
    { id: "ode-second-oscillatory", title: "Une combinaison de sinus et de cosinus", pages: [200], legacyLessonIds: ["second-order-oscillatory"],
      body: String.raw`Pour un réel $\omega\ne0$, les solutions sur $\mathbb R$ de $y''=-\omega^2y$ sont :
$$\boxed{y(x)=A\cos(\omega x)+B\sin(\omega x),\qquad A,B\in\mathbb R.}$$
En dérivant deux fois, chaque terme redonne $-\omega^2$ fois lui-même.

**Pour choisir la bonne formule, isole d’abord $y''$ :**

| Équation obtenue | Forme des solutions |
| --- | --- |
| $y''=0$ | $Ax+B$ |
| $y''=my$, $m>0$, $\omega=\sqrt m$ | $Ae^{\omega x}+Be^{-\omega x}$ |
| $y''=my$, $m<0$, $\omega=\sqrt{-m}$ | $A\cos(\omega x)+B\sin(\omega x)$ |

Le signe de $m$ décide de la famille. Ce n’est pas le signe d’un terme avant de l’avoir déplacé.`,
      examples: [{ id: "ode-oscillatory-examples", title: "Identifier la pulsation", prompt: "Résoudre chaque équation.", parts: [
        { id: "ode-oscillatory-two", label: "a)", prompt: String.raw`$y''=-4y$.`,
          solution: String.raw`$4=2^2$, donc $\omega=2$. Les solutions sont $\boxed{y(x)=A\cos2x+B\sin2x}$, avec $A,B\in\mathbb R$.` },
        { id: "ode-oscillatory-pi", label: "b)", prompt: String.raw`$y''+\pi^2y=0$.`,
          solution: String.raw`On écrit $y''=-\pi^2y$, puis $\omega=\pi$. Les solutions sont $\boxed{y(x)=A\cos(\pi x)+B\sin(\pi x)}$, avec $A,B\in\mathbb R$.` },
      ] }],
      nativeFigure: { kind: "differential", preset: "oscillator" },
    },
    { id: "ode-second-initial", title: "Déterminer une solution particulière", pages: [200], legacyLessonIds: ["second-order-initial-values"],
      body: String.raw`Pour tous réels $x_0,y_0,z_0$, l’équation $y''=-\omega^2y$ admet une **unique solution** avec $y(x_0)=y_0$ et $y'(x_0)=z_0$.

On dérive la forme générale :
$$y'(x)=-\omega A\sin(\omega x)+\omega B\cos(\omega x).$$
Puis on remplace $x$ par $x_0$ dans **$y$ et $y'$** et on résout le système.

Si les deux conditions ne sont pas au même point, on écrit tout de même le système, mais l’unicité n’est pas garantie à l’avance.`,
      examples: [{ id: "ode-seven-halves", title: "Deux conditions en des points différents", prompt: String.raw`Résoudre $4y''+49y=0$, avec $f(\pi/2)=0$ et $f'(0)=-\sqrt2$.`,
        solution: String.raw`**1. Forme générale.** $y''=-\frac{49}{4}y$, donc $\omega=7/2$ :
$$f(x)=A\cos\frac{7x}{2}+B\sin\frac{7x}{2}.$$
**2. Première condition.** En $x=\pi/2$, l’angle est $7\pi/4$, dont le cosinus vaut $\sqrt2/2$ et le sinus $-\sqrt2/2$ :
$$f(\pi/2)=\frac{\sqrt2}{2}(A-B)=0\quad\Longrightarrow\quad A=B.$$
**3. Seconde condition.**
$$f'(x)=-\frac72A\sin\frac{7x}{2}+\frac72B\cos\frac{7x}{2}.$$
En $0$, $f'(0)=7B/2=-\sqrt2$, donc $B=-2\sqrt2/7$. On a la même valeur pour $A$.

**Conclusion :**
$$\boxed{f(x)=-\frac{2\sqrt2}{7}\left(\cos\frac{7x}{2}+\sin\frac{7x}{2}\right).}$$` }],
    },
  ] },
];
