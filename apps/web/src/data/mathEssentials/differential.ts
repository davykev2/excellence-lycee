import { section, sheet } from "./types";

export default sheet("differential", "Équations différentielles", [118], [
  section("essential-ode-first", "I", "Équation du premier ordre", [118], String.raw`
Pour une constante réelle $m$, les solutions sur $\mathbb R$ de

$$y'+my=0$$

sont les fonctions

$$f(x)=ke^{-mx},\qquad k\in\mathbb R.$$

Le signe dans l’exponentielle est **l’opposé** du coefficient de $y$.

**Vérifier :** $f'(x)=-mke^{-mx}$, donc $f'(x)+mf(x)=0$.

Une condition $f(x_0)=y_0$ fixe la constante :

$$k=y_0e^{mx_0},\qquad f(x)=y_0e^{-m(x-x_0)}.$$

Si $m=0$, on retrouve les fonctions constantes.
`),
  section("essential-ode-second", "II", "Équation du second ordre : trois cas", [118], String.raw`
Pour résoudre

$$y''+my=0,$$

on distingue le signe de $m$.

| Cas | Forme de toutes les solutions |
| --- | --- |
| $m=0$ | $f(x)=Ax+B$ |
| $m<0$, en posant $\omega=\sqrt{-m}>0$ | $f(x)=Ae^{\omega x}+Be^{-\omega x}$ |
| $m>0$, en posant $\omega=\sqrt m>0$ | $f(x)=A\cos(\omega x)+B\sin(\omega x)$ |

Dans chaque ligne, $A$ et $B$ sont des constantes réelles.

**Pour ne pas confondre les signes :** $y''-\omega^2y=0$ donne des exponentielles ; $y''+\omega^2y=0$ donne des sinus et cosinus.
`),
  section("essential-ode-conditions", "III", "Utiliser les conditions et contrôler la réponse", [118], String.raw`
Deux conditions indépendantes, par exemple $f(x_0)$ et $f'(x_0)$, permettent de déterminer $A$ et $B$.

1. Écrire la solution générale correspondant au signe de $m$.
2. Dériver cette expression.
3. Remplacer $x$ par le point demandé dans les deux conditions.
4. Résoudre le système obtenu.
5. Vérifier l’équation **et** les conditions.

Au point $0$, les calculs se simplifient :

| Solution générale | $f(0)$ | $f'(0)$ |
| --- | --- | --- |
| $Ax+B$ | $B$ | $A$ |
| $Ae^{\omega x}+Be^{-\omega x}$ | $A+B$ | $\omega(A-B)$ |
| $A\cos(\omega x)+B\sin(\omega x)$ | $A$ | $\omega B$ |
`),
], [
  "Les trois familles de la page118 sont conservées ; ω choisi strictement positif pour éviter les divisions par zéro.",
  "Le tableau des conditions en0 explicite la méthode sans reprendre de nouveau sujet ni ajouter de notation.",
]);
