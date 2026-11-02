import { section, sheet } from "./types";

export default sheet("exponential", "Fonctions exponentielles et puissances", [61, 62, 94], [
  section("essential-exp-definition", "I", "L’exponentielle et le logarithme", [61], String.raw`
La fonction exponentielle, notée $\exp$ ou $x\mapsto e^x$, est la réciproque de $\ln$. Elle est définie sur $\mathbb R$, à valeurs dans $]0;+\infty[$ et strictement croissante.

$$\ln(e^x)=x\quad(x\in\mathbb R),\qquad e^{\ln x}=x\quad(x>0).$$

$$e^0=1,\qquad e^x>0\quad\text{pour tout réel }x.$$

| Comparaison | Condition équivalente |
| --- | --- |
| $e^a=e^b$ | $a=b$ |
| $e^a<e^b$ | $a<b$ |
| $0<e^a<1$ | $a<0$ |
| $e^a>1$ | $a>0$ |

**À distinguer :** $e^{-3}$ existe et est positif, mais l’équation $e^x=-3$ n’a aucune solution réelle.

Pour $a>0$, $e^{-\ln a}=1/a$. De même, $e^{1/2}=\sqrt e$ et $e^{-1/2}=1/\sqrt e=\sqrt e/e$.
`),
  section("essential-exp-laws", "II", "Calculer avec les exponentielles", [61], String.raw`
Pour tous réels $a,b$ et tout entier $n$ :

$$e^ae^b=e^{a+b},\qquad \frac{e^a}{e^b}=e^{a-b},\qquad
(e^a)^n=e^{na}.$$

En particulier, $e^{-a}=1/e^a$.

**Domaine d’une composée.** L’expression $e^{u(x)}$ est définie partout où $u(x)$ est définie. L’exponentielle n’ajoute aucune condition de positivité à $u$.
`),
  section("essential-exp-limits", "III", "Limites et croissances comparées", [61], String.raw`
$$\lim_{x\to-\infty}e^x=0,\qquad \lim_{x\to+\infty}e^x=+\infty.$$

$$\lim_{x\to-\infty}xe^x=0,\qquad
\lim_{x\to+\infty}\frac{e^x}{x}=+\infty.$$

Pour tous $\alpha>0$ et $\beta>0$ :

$$\lim_{x\to+\infty}x^\alpha e^{-\beta x}=0,\qquad
\lim_{x\to+\infty}\frac{e^{\beta x}}{x^\alpha}=+\infty.$$

$$\lim_{x\to-\infty}\lvert x\rvert^\alpha e^{\beta x}=0.$$

La valeur absolue permet d’utiliser un exposant réel même lorsque $x$ est négatif.

Deux autres références utiles :

$$\lim_{x\to0}\frac{e^x-1}{x}=1,\qquad
\lim_{x\to+\infty}\frac{\ln x}{e^x}=0.$$

À l’infini positif, l’exponentielle domine les puissances, et les puissances positives dominent le logarithme.
`),
  section("essential-exp-calculus", "IV", "Dérivées et primitives", [61, 62], String.raw`
| Fonction | Dérivée |
| --- | --- |
| $e^x$ | $e^x$ |
| $e^{u(x)}$ | $u'(x)e^{u(x)}$ |

| Fonction à intégrer | Une primitive |
| --- | --- |
| $e^x$ | $e^x$ |
| $u'e^u$ | $e^u$ |
| $ke^{ax+b}$, $a\ne0$ | $\frac ka e^{ax+b}$ |

Le coefficient $1/a$ est nécessaire car la dérivée de $ax+b$ vaut $a$. Si $a=0$, l’expression $ke^b$ est constante : une primitive est $ke^b x$.
`),
  section("essential-exp-powers", "V", "Puissances réelles et exponentielles de base $a$", [62, 94], String.raw`
Pour $a>0$, on définit

$$a^x=e^{x\ln a}.$$

Si $a>1$, cette fonction est croissante ; si $0<a<1$, elle est décroissante. Pour $a=1$, elle est constante égale à $1$.

Pour $x>0$ et $\alpha\in\mathbb R$ :

$$x^\alpha=e^{\alpha\ln x}.$$

| Calcul, avec $x,y>0$ | Propriété |
| --- | --- |
| $x^\alpha x^\beta$ | $x^{\alpha+\beta}$ |
| $\frac{x^\alpha}{x^\beta}$ | $x^{\alpha-\beta}$ |
| $(x^\alpha)^\beta$ | $x^{\alpha\beta}$ |
| $(xy)^\alpha$ | $x^\alpha y^\alpha$ |
| $(x/y)^\alpha$ | $x^\alpha/y^\alpha$ |

On retrouve $x^0=1$ et $x^1=x$. Les puissances entières comme $x^3$ et $x^5$ gardent aussi leur définition habituelle sur tout $\mathbb R$.

**Racines.** Pour un entier $n\ge1$, $x\mapsto x^n$ est une bijection de $]0;+\infty[$ sur lui-même. Sa réciproque est

$$x\mapsto\sqrt[n]x=x^{1/n}.$$

Ainsi, $\sqrt[3]x=x^{1/3}$, $\sqrt[5]x=x^{1/5}$ et $\sqrt x=x^{1/2}$ pour $x>0$.
`),
  section("essential-exp-power-calculus", "VI", "Dériver ou intégrer une puissance composée", [62, 94], String.raw`
Pour $u>0$ dérivable et $\alpha\in\mathbb R$ :

$$\left(u^\alpha\right)'=\alpha u'u^{\alpha-1}.$$

En particulier, $(x^\alpha)'=\alpha x^{\alpha-1}$ sur $]0;+\infty[$.

Si $\alpha\ne-1$, une primitive de $u'u^\alpha$ est

$$\frac{u^{\alpha+1}}{\alpha+1}.$$

Pour $\alpha=-1$, utiliser plutôt $\frac{u'}u\longmapsto\ln u$.

Pour une exponentielle de base $a>0$, avec $a\ne1$ :

$$\left(a^x\right)'=(\ln a)a^x,\qquad
a^x\longmapsto\frac{a^x}{\ln a}.$$
`),
], [
  "P61 : e^a>1 correspond à a>0 ; puissances en −∞ formulées avec |x| pour exposants réels.",
  "P62 : x^α=exp(α ln x), pas exp(α ln α). P94 : bijection réservée à n≥1, cas n=0 constant.",
  "Chapitres 6 et 7 fusionnés conformément à la leçon exponentielle/puissance du catalogue C/D.",
]);
