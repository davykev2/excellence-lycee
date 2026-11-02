import type { CourseDocumentSection } from "../../domain/courseDocument";

export const integralSummaryA: CourseDocumentSection[] = [
  { id: "int-notion", numeral: "I", title: "Notion d’intégrale", topics: [
    { id: "int-definition", title: "Calculer une intégrale à l’aide d’une primitive", pages: [170], legacyLessonIds: ["definite-integral"],
      body: String.raw`Soit $f$ continue sur un intervalle $I$, et $a,b\in I$. Si $F$ est une primitive de $f$ sur $I$, on définit :

$$\boxed{\int_a^b f(x)\,dx=F(b)-F(a).}$$

On note aussi $[F(x)]_a^b$. Le résultat est un **nombre**, indépendant de la primitive choisie : ajouter une constante à $F$ ne change pas la différence.

La lettre d’intégration est muette : $\int_a^b f(x)\,dx=\int_a^b f(t)\,dt$. Les bornes restent les mêmes.

$$\int_a^a f(x)\,dx=0,\qquad \int_b^a f(x)\,dx=-\int_a^b f(x)\,dx.$$

**Méthode :** cherche une primitive, calcule sa valeur à la borne du haut, puis soustrais sa valeur à la borne du bas.`,
      examples: [{ id: "int-root-example", title: "Une intégrale et ses bornes inversées", prompt: "Calculer les deux intégrales.", parts: [
        { id: "int-root-forward", label: "a)", prompt: String.raw`$\displaystyle\int_4^9\frac{dx}{\sqrt x}$.`, solution: String.raw`Sur $]0;+\infty[$, une primitive de $x\mapsto1/\sqrt x$ est $F(x)=2\sqrt x$, car $F'(x)=1/\sqrt x$.

$$\int_4^9\frac{dx}{\sqrt x}=[2\sqrt x]_4^9=2\sqrt9-2\sqrt4=6-4=\boxed2.$$` },
        { id: "int-root-reverse", label: "b)", prompt: String.raw`$\displaystyle\int_9^4\frac{dt}{\sqrt t}$.`, solution: String.raw`On inverse les bornes, donc on change le signe :

$$\int_9^4\frac{dt}{\sqrt t}=-\int_4^9\frac{dt}{\sqrt t}=\boxed{-2}.$$` },
      ] }],
    },
  ] },
  { id: "int-properties", numeral: "II", title: "Propriétés de l’intégrale", topics: [
    { id: "int-linearity", title: "Linéarité", pages: [170,171], legacyLessonIds: ["chasles-linearity"],
      body: String.raw`Si $f,g$ sont continues sur $I$, $a,b\in I$ et $\alpha,\beta\in\mathbb R$, alors :

$$\int_a^b(\alpha f+\beta g)(x)\,dx=\alpha\int_a^b f(x)\,dx+\beta\int_a^b g(x)\,dx.$$

On peut donc séparer une somme et sortir une constante. **On ne sépare pas un produit ou un quotient de cette façon.**`,
      examples: [{ id: "int-linear-examples", title: "Utiliser une somme ou une combinaison", prompt: "Traiter chaque cas séparément.", parts: [
        { id: "int-linear-given", label: "a)", prompt: String.raw`$\int_{-1}^2f=-7$, $\int_{-1}^2g=4$. Calculer $\int_{-1}^2(3f-g/2)$.`, solution: String.raw`La linéarité donne :

$$3\int_{-1}^2f-\frac12\int_{-1}^2g=3(-7)-\frac12(4)=-21-2=\boxed{-23}.$$` },
        { id: "int-linear-trig", label: "b)", prompt: String.raw`$\displaystyle\int_0^{\pi/4}(-5\cos2x+4\sin2x)\,dx$.`, solution: String.raw`Une primitive est $-\frac52\sin2x-2\cos2x$. En évaluant aux deux bornes :

$$\left[-\frac52\sin2x-2\cos2x\right]_0^{\pi/4}=-\frac52-(-2)=\boxed{-\frac12}.$$` },
        { id: "int-linear-combine", label: "c)", prompt: String.raw`$\displaystyle\int_{-2}^1\frac{dx}{x^2+1}+\int_{-2}^1\frac{x^2}{x^2+1}\,dx$.`, solution: String.raw`Les deux intégrales ont les mêmes bornes. Additionnons leurs intégrandes :

$$\frac1{x^2+1}+\frac{x^2}{x^2+1}=1.$$
La somme vaut donc $\int_{-2}^1 1\,dx=1-(-2)=\boxed3$.` },
      ] }],
    },
    { id: "int-chasles", title: "Relation de Chasles", pages: [171],
      body: String.raw`Pour $a,b,c$ dans un même intervalle où $f$ est continue :

$$\boxed{\int_a^b f=\int_a^c f+\int_c^b f.}$$

Cette égalité reste vraie même si $c$ n’est pas entre $a$ et $b$. On l’utilise notamment pour couper l’intervalle à un changement de signe ou de formule.`,
      examples: [{ id: "int-abs-cos", title: "Retirer une valeur absolue", prompt: String.raw`Calculer $\int_0^\pi|\cos x|\,dx$.`, parts: [
        { id: "int-abs-cos-sign", label: "1.", prompt: "Déterminer les deux expressions de l’intégrande.", solution: String.raw`Sur $[0;\pi/2]$, $\cos x\ge0$, donc $|\cos x|=\cos x$. Sur $[\pi/2;\pi]$, $\cos x\le0$, donc $|\cos x|=-\cos x$.` },
        { id: "int-abs-cos-value", label: "2.", prompt: "Calculer l’intégrale.", solution: String.raw`Par Chasles :

$$I=\int_0^{\pi/2}\cos x\,dx-\int_{\pi/2}^{\pi}\cos x\,dx.$$
$$I=[\sin x]_0^{\pi/2}-[\sin x]_{\pi/2}^{\pi}=1-(0-1)=\boxed2.$$` },
      ] }],
    },
    { id: "int-order", title: "Positivité et comparaison", pages: [171,172], legacyLessonIds: ["integral-order"],
      body: String.raw`Dans ces propriétés, **$a\le b$** et les fonctions sont continues sur $[a;b]$.

- Si $f(x)\ge0$ partout, alors $\int_a^b f\ge0$. Si $f(x)\le0$ partout, alors $\int_a^b f\le0$.
- Si $f(x)\le g(x)$ partout, alors $\int_a^b f\le\int_a^b g$.

Le sens change si l’on inverse les bornes.

**Attention à la réciproque :** une intégrale positive ne prouve pas que $f$ est positive partout. Par exemple, $\int_0^2(x^2-1)\,dx=2/3>0$, pourtant $x^2-1<0$ sur $[0;1[$.`,
      examples: [{ id: "int-order-examples", title: "Déterminer un signe et obtenir une minoration", prompt: "Justifier sans chercher toutes les primitives.", parts: [
        { id: "int-positive-root", label: "a)", prompt: String.raw`Signe de $\displaystyle\int_{-5}^{-2}\frac7{\sqrt{x^2+1}}\,dx$.`, solution: String.raw`Sur $[-5;-2]$, $x^2+1>0$, donc $7/\sqrt{x^2+1}>0$. Les bornes sont dans l’ordre croissant : **l’intégrale est positive**. L’intégrande étant continue et strictement positive, elle est même strictement positive.` },
        { id: "int-log-bound", label: "b)", prompt: String.raw`Sachant que $0\le\ln x\le x-1$ sur $[1;3]$, minorer $\int_1^3(1-\ln^2x)\,dx$.`, solution: String.raw`Les deux membres sont positifs ; on peut les élever au carré : $(\ln x)^2\le(x-1)^2$. Ainsi :

$$1-\ln^2x\ge1-(x-1)^2=2x-x^2.$$

Par comparaison des intégrales :
$$\int_1^3(1-\ln^2x)\,dx\ge\left[x^2-\frac{x^3}3\right]_1^3=0-\frac23=\boxed{-\frac23}.$$` },
      ] }],
    },
    { id: "int-bounds", title: "Inégalité de la moyenne et valeur absolue", pages: [172],
      body: String.raw`Pour $a\le b$, si $m\le f(x)\le M$ sur $[a;b]$, alors :

$$\boxed{m(b-a)\le\int_a^b f(x)\,dx\le M(b-a).}$$

Si $|f(x)|\le M$, alors $|\int_a^b f|\le M(b-a)$. Plus généralement :
$$\left|\int_a^b f(x)\,dx\right|\le\int_a^b|f(x)|\,dx.$$

Pour encadrer une intégrale, encadre d’abord l’intégrande puis multiplie par la longueur de l’intervalle. Cette propriété revient à appliquer l’inégalité des accroissements finis à une primitive $F$, puisque $\int_a^bf=F(b)-F(a)$.`,
      examples: [{ id: "int-sine-bounds", title: "Encadrer sans calculer exactement", prompt: String.raw`Encadrer $I=\int_{\pi/8}^{\pi/6}\frac{dx}{\sin2x}$.`, solution: String.raw`Pour $x\in[\pi/8;\pi/6]$, $2x\in[\pi/4;\pi/3]$. Le sinus est croissant et positif :

$$\frac{\sqrt2}2\le\sin2x\le\frac{\sqrt3}2.$$
En prenant les inverses, on renverse les inégalités :
$$\frac2{\sqrt3}\le\frac1{\sin2x}\le\frac2{\sqrt2}.$$
L’intervalle a pour longueur $\pi/6-\pi/8=\pi/24$. Donc :
$$\boxed{\frac{\pi}{12\sqrt3}\le I\le\frac{\pi}{12\sqrt2}.}$$` }],
    },
    { id: "int-average", title: "Valeur moyenne d’une fonction", pages: [172], legacyLessonIds: ["integral-bounds-mean"],
      body: String.raw`Pour $f$ continue sur $[a;b]$, **$a<b$**, la valeur moyenne est :

$$\boxed{\mu=\frac1{b-a}\int_a^b f(x)\,dx.}$$

C’est la hauteur constante qui donne la même intégrale sur cet intervalle. Si $m\le f\le M$, alors $m\le\mu\le M$.`,
      examples: [{ id: "int-exp-average", title: "Moyenne de l’exponentielle", prompt: String.raw`Calculer la valeur moyenne de $e^x$ sur $[-1;1]$.`, solution: String.raw`La longueur de l’intervalle est $1-(-1)=2$.

$$\mu=\frac12\int_{-1}^1e^x\,dx=\frac12[e^x]_{-1}^1=\frac{e-e^{-1}}2.$$
En mettant au même dénominateur : $\boxed{\mu=(e^2-1)/(2e)}$.` }],
    },
  ] },
  { id: "int-ipp", numeral: "III", title: "Intégration par parties", topics: [
    { id: "int-parts", title: "Choisir les deux fonctions", pages: [173], legacyLessonIds: ["integration-by-parts"],
      body: String.raw`Si $u,v$ sont dérivables sur un intervalle contenant $[a;b]$ et leurs dérivées sont continues :

$$\boxed{\int_a^b u(x)v'(x)\,dx=[u(x)v(x)]_a^b-\int_a^b u'(x)v(x)\,dx.}$$

Écris clairement **$u$, $u'$, $v'$ et $v$**. Le choix est utile si la nouvelle intégrale est plus simple. Une puissance de $x$ ou de $\ln x$ placée dans $u$ diminue souvent après dérivation.`,
      examples: [{ id: "int-parts-examples", title: "Une puis deux intégrations par parties", prompt: "Calculer les intégrales.", parts: [
        { id: "int-parts-linear-cos", label: "a)", prompt: String.raw`$\displaystyle I=\int_0^{\pi/2}(x-1)\cos x\,dx$.`, solution: String.raw`Prenons $u=x-1$, $u'=1$, $v'=\cos x$ et $v=\sin x$.

$$I=[(x-1)\sin x]_0^{\pi/2}-\int_0^{\pi/2}\sin x\,dx.$$
Le crochet vaut $\pi/2-1$ ; la dernière intégrale vaut $[-\cos x]_0^{\pi/2}=1$. Ainsi **$I=\pi/2-2$**.` },
        { id: "int-parts-log-square", label: "b)", prompt: String.raw`$\displaystyle J=\int_1^e t(\ln t)^2\,dt$.`, solution: String.raw`**Première intégration.** $u=(\ln t)^2$, $u'=2\ln t/t$, $v'=t$, $v=t^2/2$ :

$$J=\left[\frac{t^2}2(\ln t)^2\right]_1^e-\int_1^e t\ln t\,dt=\frac{e^2}2-K.$$
**Deuxième intégration.** Pour $K$, prenons $u=\ln t$, $u'=1/t$, $v'=t$, $v=t^2/2$ :
$$K=\left[\frac{t^2}2\ln t\right]_1^e-\frac12\int_1^e t\,dt=\frac{e^2}2-\frac{e^2-1}4=\frac{e^2+1}4.$$
On remplace dans la première égalité :
$$\boxed{J=\frac{e^2}2-\frac{e^2+1}4=\frac{e^2-1}4.}$$` },
      ] }],
    },
  ] },
  { id: "int-substitution", numeral: "IV", title: "Changement de variable affine", topics: [
    { id: "int-affine", title: "Changer l’expression, le différentiel et les bornes", pages: [173,174], legacyLessonIds: ["integral-substitution"],
      body: String.raw`Pour $u=\alpha t+\beta$, avec $\alpha\ne0$, on a $du=\alpha\,dt$ :

$$\int_a^b f(\alpha t+\beta)\,dt=\frac1\alpha\int_{\alpha a+\beta}^{\alpha b+\beta}f(u)\,du.$$

1. Exprime $t$ et $dt$ avec la nouvelle variable.
2. Calcule les **deux nouvelles bornes**.
3. Remplace toute l’ancienne variable avant de calculer.

Si $\alpha<0$, les nouvelles bornes sont inversées : garde le signe $1/\alpha$, sans le remplacer par une valeur absolue.`,
      examples: [{ id: "int-affine-example", title: "Transformer un quotient", prompt: String.raw`Calculer $I=\int_{2/3}^1\frac{t^2}{(3t-1)^3}\,dt$.`, parts: [
        { id: "int-affine-transform", label: "1.", prompt: "Effectuer le changement de variable.", solution: String.raw`Posons $u=3t-1$. Alors $t=(u+1)/3$ et $dt=du/3$. Pour $t=2/3$, $u=1$ ; pour $t=1$, $u=2$.

$$I=\frac1{27}\int_1^2\frac{(u+1)^2}{u^3}\,du=\frac1{27}\int_1^2\left(\frac1u+\frac2{u^2}+\frac1{u^3}\right)du.$$` },
        { id: "int-affine-calculate", label: "2.", prompt: "Calculer l’intégrale obtenue.", solution: String.raw`Sur $[1;2]$, une primitive de l’intégrande entre parenthèses est $\ln u-2/u-1/(2u^2)$.

$$I=\frac1{27}\left[\ln u-\frac2u-\frac1{2u^2}\right]_1^2.$$
$$I=\frac1{27}\left(\ln2-1-\frac18+2+\frac12\right)=\boxed{\frac{\ln2+11/8}{27}}.$$` },
      ] }],
    },
  ] },
];
