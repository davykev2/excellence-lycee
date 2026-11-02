import type { CourseEvaluationGroup, CourseWrittenTask } from "../../domain/courseDocument";
const task = (id: string, topicId: string, prompt: string, model: string): CourseWrittenTask => ({
  id, topicId, prompt, model,
  criteria: ["Je mets l’équation sous une forme connue.", "Je détaille le calcul des constantes.", "Je vérifie l’équation et les conditions demandées."],
});

export const differentialEvaluations: CourseEvaluationGroup[] = [
  { id: "ode-eval-homogeneous", title: String.raw`Résoudre $y'=ay$`, pages: [201],
    method: String.raw`1. Isole $y'$ pour identifier $a$.
2. Écris toutes les solutions $y(x)=Ce^{ax}$, avec $C\in\mathbb R$.
3. Vérifie le signe de l’exposant en dérivant.`,
    examples: [{ id: "ode-eval-hom-worked", title: "Deux équations sans condition initiale", prompt: "Résoudre sur ℝ.", parts: [
      { id: "ode-eval-five", label: "1.", prompt: String.raw`$y'=5y$.`, solution: String.raw`Le coefficient est $a=5$. Les solutions sont $\boxed{y(x)=Ce^{5x}}$, $C\in\mathbb R$. En dérivant : $y'=5Ce^{5x}=5y$.` },
      { id: "ode-eval-minus-three-halves", label: "2.", prompt: String.raw`$2y'+3y=0$.`, solution: String.raw`Déplaçons $3y$, puis divisons par $2$ :
$$2y'=-3y\quad\Longleftrightarrow\quad y'=-\frac32y.$$
Ainsi $\boxed{y(x)=Ce^{-3x/2}}$, $C\in\mathbb R$.` },
    ] }], questions: [],
    writtenTasks: [task("ode-app-hom", "ode-first-general", String.raw`Résoudre $3y'+2y=0$ sur $\mathbb R$.`,
      String.raw`$3y'=-2y$, donc $y'=-\frac23y$. La propriété de $y'=ay$, avec $a=-2/3$, donne :
$$\boxed{y(x)=Ce^{-2x/3},\quad C\in\mathbb R.}$$
Pour vérifier : $3y'+2y=3(-2/3)Ce^{-2x/3}+2Ce^{-2x/3}=0$. Aucune condition ne fixe $C$.`)],
  },
  { id: "ode-eval-first-initial", title: String.raw`Déterminer la solution de $y'=ay$ avec une valeur imposée`, pages: [201,202],
    method: String.raw`1. Trouve la famille $y(x)=Ce^{ax}$.
2. Écris $Ce^{ax_0}=y_0$ et isole $C$.
3. Remplace $C$ dans la formule et contrôle $y(x_0)$.`,
    examples: [{ id: "ode-eval-first-init-worked", title: "Une condition en 1", prompt: String.raw`$y'=-3y$ et $y(1)=1/e^2$.`,
      solution: String.raw`La famille est $y(x)=Ce^{-3x}$. La condition donne :
$$Ce^{-3}=e^{-2}\quad\Longrightarrow\quad C=e^{-2+3}=e.$$
La solution est donc $\boxed{y(x)=e^{1-3x}}$. En $1$, elle vaut $e^{-2}=1/e^2$.` }],
    questions: [], writtenTasks: [task("ode-app-first-init", "ode-first-initial", String.raw`Déterminer la solution de $y'=4y$ qui prend la valeur $3$ en $-2$.`,
      String.raw`La forme générale est $y(x)=Ce^{4x}$. Avec $y(-2)=3$ :
$$Ce^{-8}=3\quad\Longrightarrow\quad C=3e^8.$$
Donc $\boxed{y(x)=3e^{4x+8}}$. Sa dérivée vaut $4y(x)$ et $y(-2)=3$.`)],
  },
  { id: "ode-eval-affine", title: String.raw`Résoudre $y'=ay+b$`, pages: [202],
    method: String.raw`Pour $a\ne0$, identifie $a,b$, puis écris $y(x)=Ce^{ax}-b/a$. Fais séparément le calcul du quotient et de son signe. Si $a=0$, intègre la constante $b$.`,
    examples: [{ id: "ode-eval-affine-worked", title: "Un second membre constant", prompt: String.raw`Résoudre $y'=2y+7$.`,
      solution: String.raw`Ici $a=2$, $b=7$, donc $-b/a=-7/2$. Les solutions sont :
$$\boxed{y(x)=Ce^{2x}-\frac72,\quad C\in\mathbb R.}$$
En remplaçant, $2y+7=2Ce^{2x}-7+7=y'$.` }],
    questions: [], writtenTasks: [task("ode-app-affine-source", "ode-affine-general", String.raw`Déterminer la solution de $y'=4y$ telle que $y(-2)=3$.`,
      String.raw`C’est le cas $a=4$, $b=0$. La famille est $Ce^{4x}$ et $Ce^{-8}=3$ impose $C=3e^8$. La solution est $\boxed{y(x)=3e^{4x+8}}$. On vérifie la condition en remplaçant $x$ par $-2$.`)],
  },
  { id: "ode-eval-affine-initial", title: String.raw`Utiliser une condition pour $y'=ay+b$`, pages: [202,203],
    method: String.raw`1. Écris $y(x)=Ce^{ax}-b/a$.
2. Remplace $x$ par $x_0$ et $y(x_0)$ par la valeur imposée.
3. Résous l’équation en $C$, puis vérifie la solution.`,
    examples: [{ id: "ode-eval-aff-init-worked", title: "Condition en 0", prompt: String.raw`$y'=2y+3$ et $y(0)=2$.`,
      solution: String.raw`La famille des solutions est $y(x)=Ce^{2x}-3/2$. Comme $e^0=1$ :
$$y(0)=2\quad\Longleftrightarrow\quad C-\frac32=2\quad\Longleftrightarrow\quad C=\frac72.$$
Donc $\boxed{y(x)=\frac72e^{2x}-\frac32}$.

**Vérification :** $y'=7e^{2x}$ et $2y+3=7e^{2x}-3+3=7e^{2x}$ ; en $0$, $y(0)=7/2-3/2=2$.` }],
    questions: [], writtenTasks: [task("ode-app-aff-init", "ode-affine-general", String.raw`Déterminer la solution de $y'=5y-3$ qui prend la valeur $e-\frac32$ en $-\frac15$.`,
      String.raw`**Forme générale.** $a=5$, $b=-3$, donc $y(x)=Ce^{5x}+3/5$.

**Condition.** Pour $x=-1/5$ :
$$Ce^{-1}+\frac35=e-\frac32.$$
$$\frac Ce=e-\frac32-\frac35=e-\frac{21}{10},\qquad C=e\left(e-\frac{21}{10}\right).$$
**Conclusion :**
$$\boxed{y(x)=\left(e-\frac{21}{10}\right)e^{5x+1}+\frac35.}$$
À $x=-1/5$, l’exponentielle vaut $1$ et la valeur est $e-21/10+6/10=e-3/2$.`)],
  },
  { id: "ode-eval-zero", title: String.raw`Résoudre $y''=0$ avec deux valeurs`, pages: [203],
    method: String.raw`La solution est affine : $y(x)=Ax+B$. Avec deux abscisses différentes, remplace $x$ par chacune d’elles et résous le système de deux équations en $A,B$.`,
    examples: [{ id: "ode-eval-zero-worked", title: "Deux points imposés", prompt: String.raw`$y''=0$, $f(1)=-1$ et $f(2)=1$.`,
      solution: String.raw`Écrivons $f(x)=Ax+B$. Les conditions donnent :
$$A+B=-1,\qquad 2A+B=1.$$
En soustrayant la première égalité de la seconde : $A=2$. Puis $B=-1-2=-3$.
$$\boxed{f(x)=2x-3.}$$
On vérifie $f''=0$, $f(1)=-1$ et $f(2)=1$.` }],
    questions: [], writtenTasks: [task("ode-app-zero", "ode-second-zero", String.raw`Déterminer la solution de $y''=0$ telle que $f(1/3)=1$ et $f(2)=-4$.`,
      String.raw`La forme générale est $f(x)=Ax+B$. Le système est :
$$\frac A3+B=1,\qquad 2A+B=-4.$$
En soustrayant : $(2-1/3)A=-5$, donc $(5/3)A=-5$ et $A=-3$. Alors $B=1-A/3=2$.
$$\boxed{f(x)=-3x+2.}$$
Les deux valeurs sont $-1+2=1$ et $-6+2=-4$.`)],
  },
  { id: "ode-eval-second", title: String.raw`Résoudre $y''=my$ selon le signe de $m$`, pages: [203,204],
    method: String.raw`1. Isole $y''$ et lis le signe de $m$.
2. Si $m>0$, pose $\omega=\sqrt m$ et utilise les deux exponentielles.
3. Si $m<0$, pose $\omega=\sqrt{-m}$ et utilise sinus/cosinus.
4. Si $m=0$, les solutions sont affines.`,
    examples: [{ id: "ode-eval-second-worked", title: "Les deux signes", prompt: "Résoudre sur ℝ.", parts: [
      { id: "ode-eval-positive-two", label: "1.", prompt: String.raw`$y''=2y$.`, solution: String.raw`$2>0$, donc $\omega=\sqrt2$. Les solutions sont $\boxed{y(x)=Ae^{\sqrt2x}+Be^{-\sqrt2x}}$, $A,B\in\mathbb R$.` },
      { id: "ode-eval-negative-nine", label: "2.", prompt: String.raw`$y''=-9y$.`, solution: String.raw`$-9=-3^2$, donc $\omega=3$. Les solutions sont $\boxed{y(x)=A\cos3x+B\sin3x}$, $A,B\in\mathbb R$.` },
    ] }], questions: [], writtenTasks: [
      task("ode-app-positive-four", "ode-second-positive", String.raw`Résoudre $y''=4y$.`,
        String.raw`$4=2^2$ est positif : $\omega=2$. On obtient $\boxed{y(x)=Ae^{2x}+Be^{-2x}}$, $A,B\in\mathbb R$. Les dérivées secondes des deux termes sont respectivement $4Ae^{2x}$ et $4Be^{-2x}$ : leur somme est $4y$.`),
      task("ode-app-negative-five", "ode-second-oscillatory", String.raw`Résoudre $y''=-5y$.`,
        String.raw`$-5=-(\sqrt5)^2$, donc $\omega=\sqrt5$. Les solutions sont $\boxed{y(x)=A\cos(\sqrt5x)+B\sin(\sqrt5x)}$, $A,B\in\mathbb R$. Dériver deux fois multiplie chaque terme par $-5$.`),
    ],
  },
  { id: "ode-eval-second-initial", title: "Déterminer les deux constantes", pages: [204,205],
    method: String.raw`1. Écris la famille adaptée au signe de $m$ dans $y''=my$.
2. Calcule $y'$ en tenant compte des facteurs $\omega$.
3. Traduis $y(x_0)=y_0$ et $y'(x_0)=z_0$ en un système.
4. Résous-le puis vérifie les deux conditions.`,
    examples: [{ id: "ode-eval-second-init-worked", title: "Un cas oscillatoire et un cas exponentiel", prompt: "Déterminer la solution demandée.", parts: [
      { id: "ode-eval-trig-init", label: "1.", prompt: String.raw`$y''=-4y$, $f(\pi/8)=5/2$, $f'(\pi/8)=-3$.`,
        solution: String.raw`La forme générale est $f(x)=A\cos2x+B\sin2x$, et $f'(x)=-2A\sin2x+2B\cos2x$.

En $x=\pi/8$, l’angle est $\pi/4$, avec sinus et cosinus égaux à $\sqrt2/2$ :
$$\frac{\sqrt2}{2}(A+B)=\frac52,\qquad \sqrt2(-A+B)=-3.$$
Donc $A+B=5\sqrt2/2$ et $-A+B=-3\sqrt2/2$. En additionnant, $2B=\sqrt2$, donc $B=\sqrt2/2$ ; puis $A=2\sqrt2$.
$$\boxed{f(x)=2\sqrt2\cos2x+\frac{\sqrt2}{2}\sin2x.}$$` },
      { id: "ode-eval-hyper-init", label: "2.", prompt: String.raw`$y''=3y$, $g(0)=2$, $g'(0)=-\sqrt3$.`,
        solution: String.raw`Avec $\omega=\sqrt3$, $g(x)=Ae^{\sqrt3x}+Be^{-\sqrt3x}$ et $g'(x)=\sqrt3Ae^{\sqrt3x}-\sqrt3Be^{-\sqrt3x}$.

En $0$ :
$$A+B=2,\qquad \sqrt3(A-B)=-\sqrt3.$$
Donc $A-B=-1$. En additionnant, $2A=1$, puis $B=3/2$.
$$\boxed{g(x)=\frac12e^{\sqrt3x}+\frac32e^{-\sqrt3x}.}$$` },
    ] }], questions: [], writtenTasks: [
      task("ode-app-osc-init", "ode-second-initial", String.raw`Déterminer la solution de $y''=-25y$ telle que $f(\pi/3)=2$ et $f'(\pi/3)=1$.`,
        String.raw`**1. Forme générale et dérivée.**
$$f(x)=A\cos5x+B\sin5x,\qquad f'(x)=-5A\sin5x+5B\cos5x.$$
**2. Conditions.** En $\pi/3$, l’angle est $5\pi/3$, dont le cosinus vaut $1/2$ et le sinus $-\sqrt3/2$ :
$$A-\sqrt3B=4,\qquad \sqrt3A+B=\frac25.$$
La seconde égalité donne $B=2/5-\sqrt3A$. Dans la première :
$$4A-\frac{2\sqrt3}{5}=4\quad\Longrightarrow\quad A=1+\frac{\sqrt3}{10}.$$
Alors $B=1/10-\sqrt3$.
$$\boxed{f(x)=\left(1+\frac{\sqrt3}{10}\right)\cos5x+\left(\frac1{10}-\sqrt3\right)\sin5x.}$$
Une écriture équivalente, facile à vérifier au point initial, est :
$$f(x)=2\cos\left(5(x-\pi/3)\right)+\frac15\sin\left(5(x-\pi/3)\right).$$`),
      task("ode-app-hyper-init", "ode-second-positive", String.raw`Déterminer la solution de $y''=y$ telle que $g(1)=e$ et $g'(1)=2e$.`,
        String.raw`La forme générale est $g(x)=Ae^x+Be^{-x}$, et $g'(x)=Ae^x-Be^{-x}$.
$$Ae+\frac Be=e,\qquad Ae-\frac Be=2e.$$
En additionnant, $2Ae=3e$, donc $A=3/2$. Puis $B/e=e-3e/2=-e/2$, donc $B=-e^2/2$.
$$\boxed{g(x)=\frac32e^x-\frac12e^{2-x}.}$$
En $1$, $g(1)=3e/2-e/2=e$ et $g'(1)=3e/2+e/2=2e$.`),
    ],
  },
];
