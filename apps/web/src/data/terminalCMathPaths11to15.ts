import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";
import { terminalCLcmGcdPath } from "./terminalCLcmGcdPath";
import { terminalCSequencesPath } from "./terminalCSequencesPath";
import { terminalCComplexGeometryPath } from "./terminalCComplexGeometryPath";

export { terminalCLcmGcdPath, terminalCSequencesPath, terminalCComplexGeometryPath };

const levelIds = ["terminale-c"];

export const terminalCIsometriesPath = buildOfficialMathPath({
  id: "terminale-c-math-l14-plane-isometries", levelIds, chapterNumber: 14, themeNumber: 2,
  themeTitle: "Transformations du plan", title: "Isométries du plan",
  description: "Déplacements, antidéplacements, compositions de symétries, translations, rotations et symétries glissées.",
  outcomes: ["Classer une isométrie", "Composer des transformations", "Utiliser les points fixes pour identifier une isométrie"],
  documentTitle: "TC Maths leçon 14 isometrie du plan.pdf",
  topics: [
    t("isometry-invariants", "Définition et invariants d’une isométrie", "1-3", "I. Isométries", "Une isométrie conserve les distances, donc aussi l’alignement, les angles géométriques, les milieux, les périmètres et les aires.", "Une isométrie est entièrement déterminée par l’image de trois points non alignés.", String.raw`A'B'=AB`, "Que devient le milieu d’un segment par une isométrie ?", "Le milieu du segment image.", 50),
    t("reflection-compositions", "Compositions de symétries axiales", "3-6", "II-1. Symétries", "Deux symétries d’axes sécants composées donnent une rotation ; avec des axes parallèles, elles donnent une translation.", "L’ordre de composition fixe le signe de l’angle ou du vecteur.", String.raw`s_{D_2}\circ s_{D_1}=r_{O,2\operatorname{Mes}(D_1,D_2)}`, "Quelle transformation obtient-on avec deux axes parallèles distincts ?", "Une translation.", 60),
    t("reflection-translation-rotation", "Composer symétrie, translation et rotation", "6-9", "II-2. Autres compositions", "La composition avec une symétrie axiale peut produire une nouvelle symétrie ou une symétrie glissée selon la direction du déplacement.", "Décomposer translations et rotations en produits de symétries bien choisies.", String.raw`t_{\vec u}=s_{D_2}\circ s_{D_1}`, "Une translation composée avec une symétrie d’axe parallèle au vecteur donne quoi ?", "Une symétrie glissée.", 65),
    t("direct-isometries", "Déplacements : translations et rotations", "9-12", "III-1. Déplacements", "Une isométrie qui conserve les angles orientés est un déplacement. Sans point fixe, c’est une translation ; avec un point fixe unique, c’est une rotation.", "Deux points fixes distincts imposent l’identité.", String.raw`f\text{ déplacement}\Rightarrow f\in\{\text{translation, rotation}\}`, "Quel déplacement possède un unique point fixe ?", "Une rotation non triviale.", 65),
    t("opposite-isometries", "Antidéplacements", "12-15", "III-2. Antidéplacements", "Une isométrie qui renverse les angles orientés est une symétrie axiale ou une symétrie glissée.", "Une infinité de points fixes alignés caractérise la symétrie axiale.", String.raw`f\text{ antidéplacement}\Rightarrow f\in\{\text{symétrie, symétrie glissée}\}`, "Quel antidéplacement n’a aucun point fixe ?", "Une symétrie glissée non triviale.", 65),
    t("glide-reflection", "Symétrie glissée", "15-18", "IV. Symétrie glissée", "Une symétrie glissée est la composition commutative d’une symétrie axiale et d’une translation dont le vecteur est parallèle à l’axe.", "Son carré est la translation de vecteur double.", String.raw`g=t_{\vec u}\circ s_D,\quad g^2=t_{2\vec u}`, "Que vaut le carré d’une symétrie glissée de vecteur $\\vec u$ ?", "$t_{2\\vec u}$.", 70),
    t("isometry-fixed-points", "Identifier une isométrie par ses points fixes", "18-20", "V. Classification", "Le nombre et la disposition des points fixes permettent de distinguer identité, rotation, symétrie et symétrie glissée.", "Commencer par résoudre $f(M)=M$.", String.raw`\operatorname{Fix}(f)=\{M\mid f(M)=M\}`, "Une isométrie directe ayant deux points fixes distincts est quoi ?", "L’identité.", 75),
    t("isometry-applications", "Applications aux configurations", "20-23", "VI. Applications", "Les isométries transportent une configuration connue vers une autre et permettent de démontrer égalités de longueurs, perpendicularités, alignements ou concours.", "Nommer précisément la transformation puis exploiter ses invariants.", String.raw`f(A)=A',\ f(B)=B'\Longrightarrow AB=A'B'`, "Pourquoi l’image d’un triangle rectangle par une isométrie reste-t-elle rectangle ?", "Parce que les angles sont conservés.", 85, "challenge"),
  ],
});

export const terminalCIntegralCalculusPath = buildOfficialMathPath({
  id: "terminale-c-math-l15-integral-calculus", levelIds, chapterNumber: 15, themeNumber: 1,
  themeTitle: "Analyse", title: "Calcul intégral",
  description: "Intégrale définie, aire, propriétés, valeur moyenne, intégration par parties et changement de variable.",
  outcomes: ["Calculer et interpréter une intégrale", "Utiliser les propriétés de comparaison", "Appliquer les techniques d’intégration"],
  documentTitle: "TC Maths leçon 15 Calcul intégral.pdf",
  topics: [
    t("definite-integral", "Intégrale définie", "1-2", "I-1. Définition", "Pour une fonction continue $f$ et une primitive $F$, l’intégrale de $a$ à $b$ vaut $F(b)-F(a)$ et ne dépend pas de la primitive choisie.", "La variable d’intégration est muette.", String.raw`\int_a^b f(x)\,dx=F(b)-F(a)`, "Combien vaut $\\int_0^1 2x\\,dx$ ?", "$1$.", 50),
    t("integral-area", "Interprétation en aire", "2-4", "I-2. Aire", "Si $f$ est positive, l’intégrale mesure l’aire algébrique sous sa courbe entre les deux bornes.", "Une partie sous l’axe des abscisses contribue négativement à l’intégrale.", String.raw`f\ge0\Longrightarrow\mathcal A=\int_a^b f(x)\,dx`, "Quelle aire représente $\\int_0^2 x\\,dx$ ?", "L’aire du triangle sous $y=x$, soit $2$.", 55),
    t("chasles-linearity", "Relation de Chasles et linéarité", "4-6", "II-1. Propriétés algébriques", "Une intégrale se découpe en intervalles adjacents et distribue les combinaisons linéaires.", "Inverser les bornes change le signe.", String.raw`\int_a^c f=\int_a^b f+\int_b^c f`, "Que vaut $\\int_b^a f$ en fonction de $\\int_a^b f$ ?", "$-\\int_a^b f$.", 60),
    t("integral-order", "Positivité et comparaison", "6-7", "II-2. Ordre", "L’intégration conserve l’ordre sur un intervalle orienté de gauche à droite.", "Comparer les fonctions point par point avant d’intégrer.", String.raw`f\le g\Longrightarrow\int_a^b f\le\int_a^b g`, "Si $0\\le f\\le2$ sur $[0,3]$, comment encadrer son intégrale ?", "$0\\le\\int_0^3 f\\le6$.", 60),
    t("integral-bounds-mean", "Encadrement et valeur moyenne", "7-9", "II-3. Valeur moyenne", "Si $m\\le f\\le M$, l’intégrale est comprise entre $m(b-a)$ et $M(b-a)$. La valeur moyenne divise l’intégrale par la longueur de l’intervalle.", "La valeur moyenne appartient à $[m,M]$.", String.raw`\mu=\frac1{b-a}\int_a^b f(x)\,dx`, "Quelle est la valeur moyenne de $f(x)=x$ sur $[0,2]$ ?", "$1$.", 65),
    t("integration-by-parts", "Intégration par parties", "9-11", "III-1. Intégration par parties", "La formule transfère une dérivée d’un facteur vers l’autre et convient notamment aux produits polynôme-exponentielle ou polynôme-logarithme.", "Choisir le facteur à dériver pour simplifier l’intégrande.", String.raw`\int_a^b u'v=[uv]_a^b-\int_a^b uv'`, "Quelle formule faut-il employer pour $\\int_0^1 xe^x\\,dx$ ?", "L’intégration par parties.", 70),
    t("integral-substitution", "Changement de variable", "11-13", "III-2. Changement de variable", "Une substitution transforme simultanément l’intégrande, la différentielle et les bornes.", "Calculer les nouvelles bornes avant d’intégrer.", String.raw`\int_a^b f(\varphi(x))\varphi'(x)dx=\int_{\varphi(a)}^{\varphi(b)}f(u)du`, "Quel changement convient à $\\int_0^1 2x\\cos(x^2)\\,dx$ ?", "$u=x^2$.", 75),
    t("integral-symmetry-function", "Parité, périodicité et fonction définie par une intégrale", "13-16", "IV. Propriétés complémentaires", "La symétrie réduit les intégrales de fonctions paires ou impaires ; une intégrale à borne variable définit une primitive de l’intégrande.", "Sur $[-a,a]$, une fonction impaire a une intégrale nulle.", String.raw`F(x)=\int_a^x f(t)dt\Longrightarrow F'(x)=f(x)`, "Que vaut $\\int_{-2}^{2}x^3\\,dx$ ?", "$0$.", 85, "challenge"),
  ],
});

export const terminalCMathPaths11to15 = [
  terminalCLcmGcdPath,
  terminalCSequencesPath,
  terminalCComplexGeometryPath,
  terminalCIsometriesPath,
  terminalCIntegralCalculusPath,
];
