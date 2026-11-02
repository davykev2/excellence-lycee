import type { CourseEvaluationGroup } from "../../domain/courseDocument";

export const terminalCIntegralEvaluations: CourseEvaluationGroup[] = [
  { id: "int-eval-trig", title: "Intégrer des puissances de sinus et de cosinus", pages: [179,180],
    method: String.raw`Pour $\int_a^b\cos^m x\sin^n x\,dx$ :

1. Si les deux exposants sont pairs, linéarise avec $\cos^2x=(1+\cos2x)/2$ et $\sin^2x=(1-\cos2x)/2$.
2. Si **au moins l’un est impair**, garde un facteur $\cos x$ ou $\sin x$ et transforme le reste avec $\sin^2x+\cos^2x=1$.
3. Reconnais une dérivée composée, puis évalue le crochet aux bornes.`,
    examples: [{ id: "int-trig-worked", title: "Les deux cas", prompt: "Calculer les intégrales.", parts: [
      { id: "int-trig-even", label: "a)", prompt: String.raw`$\displaystyle\int_0^{\pi/12}\cos^2x\sin^4x\,dx$.`,
        solution: String.raw`**Linéarisation.** Les deux exposants sont pairs. Les identités d’angle double et produit-somme donnent :
$$\cos^2x\sin^4x=\frac1{16}\left(1-\frac12\cos2x-\cos4x+\frac12\cos6x\right).$$
**Primitive et bornes.**
$$I=\frac1{16}\left[x-\frac{\sin2x}4-\frac{\sin4x}4+\frac{\sin6x}{12}\right]_0^{\pi/12}.$$
À la borne supérieure : $\sin(\pi/6)=1/2$, $\sin(\pi/3)=\sqrt3/2$ et $\sin(\pi/2)=1$. À la borne $0$, tout s’annule.
$$I=\frac1{16}\left(\frac\pi{12}-\frac18-\frac{\sqrt3}8+\frac1{12}\right)=\boxed{\frac{2\pi-3\sqrt3-1}{384}}.$$` },
      { id: "int-trig-odd", label: "b)", prompt: String.raw`$\displaystyle\int_0^{\pi/2}\cos^5x\sin^2x\,dx$.`,
        solution: String.raw`L’exposant $5$ est impair. Gardons un facteur $\cos x$ :
$$\cos^5x\sin^2x=\cos x(1-\sin^2x)^2\sin^2x=\cos x(\sin^2x-2\sin^4x+\sin^6x).$$
Une primitive est donc $\sin^3x/3-2\sin^5x/5+\sin^7x/7$.

Entre $0$ et $\pi/2$, le sinus passe de $0$ à $1$ :
$$I=\frac13-\frac25+\frac17=\boxed{\frac8{105}}.$$` },
    ] }],
    statement: "Calcule les deux intégrales d’application.",
    questions: [
      { id: "int-trig-application-a", label: "a)", topicId: "int-parts", points: 1,
        prompt: String.raw`$\displaystyle\int_{-\pi/4}^{\pi/2}\sin^3(2x)\cos^2(2x)\,dx$.`,
        expected: "$1/15$", answer: { kind: "short", accepted: ["1/15"] },
        correction: String.raw`Gardons un facteur $\sin2x$ et utilisons $\sin^22x=1-\cos^22x$ :
$$\sin^32x\cos^22x=\sin2x(\cos^22x-\cos^42x).$$
Comme $(\cos2x)'=-2\sin2x$, une primitive est :
$$F(x)=-\frac{\cos^32x}6+\frac{\cos^52x}{10}.$$
Pour $x=-\pi/4$, $\cos2x=0$, donc $F(-\pi/4)=0$. Pour $x=\pi/2$, $\cos2x=-1$, donc $F(\pi/2)=1/6-1/10$.

**L’intégrale vaut $1/15$.**` },
      { id: "int-trig-application-b", label: "b)", topicId: "int-linearity", points: 1,
        prompt: String.raw`$\displaystyle\int_{-\pi/2}^{\pi/4}\cos^4x\,dx$.`,
        expected: String.raw`$9\pi/32+1/4$`, answer: { kind: "short", accepted: ["9*pi/32+1/4","(9*pi+8)/32","9π/32+1/4","(9π+8)/32"] },
        correction: String.raw`En élevant $(1+\cos2x)/2$ au carré puis en linéarisant $\cos^22x$ :
$$\cos^4x=\frac38+\frac12\cos2x+\frac18\cos4x.$$
Une primitive est $F(x)=3x/8+\sin2x/4+\sin4x/32$.

$F(\pi/4)=3\pi/32+1/4$ et $F(-\pi/2)=-3\pi/16$. En soustrayant :
$$\boxed{\int_{-\pi/2}^{\pi/4}\cos^4x\,dx=\frac{9\pi}{32}+\frac14.}$$` },
    ],
  },
  { id: "int-eval-log", title: "Intégrer le logarithme d’une expression affine", pages: [181],
    method: String.raw`Sur un intervalle où $kx+p>0$, pose $u=\ln(kx+p)$ et $v'=1$. Pour $k\ne0$, $u'=k/(kx+p)$ et $v=x$.

L’intégration par parties ramène à $\int kx/(kx+p)\,dx$ ; écris $kx=(kx+p)-p$ pour simplifier. Si $k=0$, la fonction est constante.`,
    examples: [{ id: "int-log-worked", title: "Exemple corrigé", prompt: String.raw`Calculer $I=\int_{-1}^2\ln(3x+4)\,dx$.`, solution: String.raw`Sur $[-1;2]$, $3x+4\ge1>0$ : le logarithme est défini.

Avec $u=\ln(3x+4)$, $u'=3/(3x+4)$, $v'=1$, $v=x$ :
$$I=[x\ln(3x+4)]_{-1}^2-\int_{-1}^2\frac{3x}{3x+4}\,dx.$$
Puisque $3x/(3x+4)=1-4/(3x+4)$ :
$$I=[x\ln(3x+4)]_{-1}^2-3+\frac43[\ln(3x+4)]_{-1}^2.$$
Les crochets valent $2\ln10$ et $\ln10$. Donc **$I=(10/3)\ln10-3$**.` }],
    questions: [{ id: "int-log-application", label: "Application", topicId: "int-parts", points: 1,
      prompt: String.raw`Calculer $\displaystyle\int_{-1}^1\ln(2-x)\,dx$.`, expected: "$3\\ln3-2$",
      answer: { kind: "short", accepted: ["3ln3-2","3*ln(3)-2","3ln(3)-2"] },
      correction: String.raw`Sur $[-1;1]$, $2-x\ge1>0$. Avec $u=\ln(2-x)$, $u'=-1/(2-x)$, $v=x$ :
$$I=[x\ln(2-x)]_{-1}^1+\int_{-1}^1\frac{x}{2-x}\,dx.$$
Or $x/(2-x)=-1+2/(2-x)$, d’où :
$$I=[x\ln(2-x)]_{-1}^1-2-2[\ln(2-x)]_{-1}^1.$$
Les crochets valent $\ln3$ et $-\ln3$. Donc **$I=3\ln3-2$**.` }],
  },
  { id: "int-eval-primitive", title: "Déterminer une primitive avec une condition", pages: [181,182],
    method: String.raw`Pour obtenir la primitive de $f$ nulle en $a$, pars de $F(x)=\int_a^xf(t)\,dt$. Une intégration par parties peut donner son expression.

Pour $F(a)=c$, trouve une primitive $H$, puis ajoute la constante $c-H(a)$.`,
    examples: [{ id: "int-primitive-worked", title: "Une primitive qui s’annule en π/2", prompt: String.raw`Pour $h(x)=(x-1)\cos x$, déterminer la primitive nulle en $\pi/2$, puis toutes les primitives.`, parts: [
      { id: "int-primitive-particular", label: "1.", prompt: "Déterminer la primitive particulière.", solution: String.raw`Posons $H(x)=\int_{\pi/2}^x(t-1)\cos t\,dt$. Par intégration par parties :
$$H(x)=[(t-1)\sin t]_{\pi/2}^x-\int_{\pi/2}^x\sin t\,dt.$$
$$H(x)=(x-1)\sin x-\left(\frac\pi2-1\right)+\cos x.$$
Donc **$H(x)=(x-1)\sin x+\cos x-\pi/2+1$** ; on vérifie $H(\pi/2)=0$.` },
      { id: "int-primitive-general", label: "2.", prompt: "En déduire toutes les primitives.", solution: String.raw`Toutes les primitives diffèrent d’une constante :
$$\boxed{x\mapsto(x-1)\sin x+\cos x+C,\quad C\in\mathbb R.}$$` },
    ] }],
    questions: [],
    writtenTasks: [{ id: "int-primitive-application", topicId: "int-parts",
      prompt: String.raw`Sur $]0;+\infty[$, déterminer la primitive de $f(x)=\ln x/x^2$ qui s’annule en $e$.`,
      model: String.raw`**1. Une primitive.** Prenons $u=\ln x$, $u'=1/x$, $v'=1/x^2$ et $v=-1/x$ :
$$\int\frac{\ln x}{x^2}\,dx=-\frac{\ln x}x+\int\frac1{x^2}\,dx=-\frac{\ln x+1}x+C.$$
**2. La condition.** Pour $x=e$, $\ln e=1$ :
$$0=F(e)=-\frac2e+C\quad\Longrightarrow\quad C=\frac2e.$$
**Conclusion :**
$$\boxed{F(x)=-\frac{\ln x+1}x+\frac2e,\quad x>0.}$$
En dérivant, on retrouve $\ln x/x^2$ ; pour $x=e$, on obtient bien $0$.`,
      criteria: ["Je travaille sur x > 0.", "Je précise u, u′, v′ et v.", "Je calcule la constante avec F(e) = 0 et vérifie."] }],
  },
];
