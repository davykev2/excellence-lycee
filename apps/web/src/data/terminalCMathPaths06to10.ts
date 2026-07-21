import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";

const levelIds = ["terminale-c"];

export const terminalCPrimitivesPath = buildOfficialMathPath({
  id: "terminale-c-math-l06-primitives", levelIds, chapterNumber: 6, themeNumber: 1,
  themeTitle: "Analyse", title: "Primitives",
  description: "Définition, existence, condition initiale et calcul des primitives usuelles ou composées.",
  outcomes: ["Reconnaître une primitive", "Déterminer une primitive avec condition initiale", "Calculer des primitives usuelles et composées"],
  documentTitle: "TC Maths leçon 06 PRIMITIVES.pdf",
  topics: [
    t("primitive-definition", "Reconnaître une primitive", "1-2", "I. Définition", "Une fonction $F$ est une primitive de $f$ sur un intervalle $I$ lorsque $F$ est dérivable sur $I$ et $F'=f$.", "Deux primitives d’une même fonction sur un intervalle diffèrent d’une constante.", String.raw`F'=f\quad\Longrightarrow\quad\{\text{primitives de }f\}=\{F+C\}`, "Parmi $G(x)=x^2+5x+1$ et $H(x)=x^2+5x-4$, lesquelles sont des primitives de $2x+5$ ?", "Les deux fonctions.", 55),
    t("primitive-existence", "Existence des primitives", "2-3", "II. Existence", "Toute fonction continue sur un intervalle admet des primitives sur cet intervalle.", "Avant de chercher une primitive, préciser un intervalle où la fonction est continue.", String.raw`f\text{ continue sur }I\Longrightarrow\exists F,\ F'=f`, "Les fonctions $x\\mapsto x^3-1$ et $x\\mapsto x/(x^2+1)$ admettent-elles des primitives sur $\\mathbb R$ ?", "Oui, elles sont continues sur $\\mathbb R$.", 55),
    t("primitive-initial-value", "Primitive avec condition initiale", "3-4", "III. Condition initiale", "La constante d’une primitive est déterminée par la valeur imposée en un point.", "Calculer d’abord la famille $F+C$, puis remplacer la condition initiale.", String.raw`G(x)=F(x)+C,\quad G(x_0)=y_0`, "Si $F(x)=x^2-x$ et $H(-1)=5$, quelle primitive $H$ obtient-on ?", "$H(x)=x^2-x+3$.", 65),
    t("usual-primitives", "Primitives usuelles", "4-6", "IV-1. Tableau des primitives", "Les puissances, l’inverse, les racines, le sinus, le cosinus et l’exponentielle possèdent des primitives de référence à connaître.", "Pour $x^\\alpha$, ajouter $1$ à l’exposant puis diviser par le nouvel exposant, sauf pour $\\alpha=-1$.", String.raw`\int x^\alpha\,dx=\frac{x^{\alpha+1}}{\alpha+1}+C\quad(\alpha\ne-1)`, "Quelle primitive de $x^3$ s’annule en $0$ ?", "$x^4/4$.", 65),
    t("primitive-linearity", "Sommes et combinaisons de primitives", "6-7", "IV-2. Opérations", "La dérivation étant linéaire, une combinaison linéaire de primitives est une primitive de la combinaison correspondante.", "Décomposer la fonction en termes simples, intégrer terme à terme, puis ajouter une seule constante.", String.raw`\int(af+bg)=a\int f+b\int g`, "Une primitive de $3x^2-4x+5$ est-elle $x^3-2x^2+5x$ ?", "Oui.", 65),
    t("composite-primitives", "Primitives de formes composées", "7-9", "IV-3. Formes composées", "Les formes $u'u^n$, $u'/u$, $u'e^u$ ou $u'/\\sqrt u$ se reconnaissent par la présence de la dérivée intérieure.", "Identifier $u$, vérifier son domaine, puis ajuster le coefficient manquant.", String.raw`\int u'(x)u(x)^n\,dx=\frac{u(x)^{n+1}}{n+1}+C`, "Quelle primitive convient à $2x(x^2+1)^3$ ?", "$(x^2+1)^4/4+C$.", 80, "challenge"),
  ],
});

export const terminalCConicsPath = buildOfficialMathPath({
  id: "terminale-c-math-l07-conics", levelIds, chapterNumber: 7, themeNumber: 2,
  themeTitle: "Géométrie", title: "Coniques",
  description: "Définition foyer-directrice, excentricité, paraboles, ellipses, hyperboles et régions du plan.",
  outcomes: ["Caractériser une conique", "Déterminer ses éléments géométriques", "Reconnaître son équation réduite"],
  documentTitle: "TC Maths leçon 07 Coniques.pdf",
  topics: [
    t("conic-focus-directrix", "Définition foyer-directrice", "1-2", "I. Définition", "Une conique de foyer $F$, de directrice $(D)$ et d’excentricité $e>0$ est le lieu des points $M$ tels que $MF=e\\,d(M,(D))$.", "$e<1$ donne une ellipse, $e=1$ une parabole et $e>1$ une hyperbole.", String.raw`MF=e\,d(M,(D))`, "Quelle nature a une conique d’excentricité $1/3$ ?", "Une ellipse.", 55),
    t("conic-axis-vertices", "Axe focal et sommets", "2-4", "II. Éléments caractéristiques", "L’axe focal est la droite perpendiculaire à la directrice passant par le foyer. Ses intersections avec la conique donnent les sommets principaux.", "Projeter le foyer sur la directrice puis résoudre l’équation de la conique sur l’axe.", String.raw`MF=e\,MH`, "Pour $F(2,3)$, $(D):x=-4$ et $e=1/3$, quel est l’axe focal ?", "La droite $y=3$.", 65),
    t("conic-region", "Régions délimitées par une conique", "4-5", "III. Régions du plan", "Le signe de $MF-e\\,d(M,(D))$ distingue l’intérieur, la conique et l’extérieur.", "Tester un point simple permet de repérer le côté correspondant à chaque inégalité.", String.raw`MF\lesseqgtr e\,d(M,(D))`, "Quelle relation caractérise les points de la conique elle-même ?", "$MF=e\\,d(M,(D))$.", 60),
    t("parabola-reduced-equation", "Parabole et équation réduite", "5-7", "IV-1. Parabole", "Dans un repère adapté, une parabole s’écrit $y^2=2px$ ; son foyer et sa directrice sont symétriques par rapport au sommet.", "Le signe de $p$ indique le sens d’ouverture.", String.raw`y^2=2px,\quad F(p/2,0),\quad(D):x=-p/2`, "Pour $y^2=-4x$, quels sont le foyer et la directrice ?", "$F(-1,0)$ et $(D):x=1$.", 70),
    t("ellipse-reduced-equation", "Ellipse et équation réduite", "7-9", "IV-2. Ellipse", "Une ellipse centrée d’axes principaux s’écrit $x^2/a^2+y^2/b^2=1$ avec $a>b>0$ et $c^2=a^2-b^2$.", "Les foyers sont $(\\pm c,0)$ et l’excentricité vaut $c/a$.", String.raw`\frac{x^2}{a^2}+\frac{y^2}{b^2}=1,\quad c^2=a^2-b^2`, "Pour $x^2/25+y^2/9=1$, quelle est l’excentricité ?", "$4/5$.", 75),
    t("hyperbola-reduced-equation", "Hyperbole et équation réduite", "9-11", "IV-3. Hyperbole", "Une hyperbole centrée s’écrit $x^2/a^2-y^2/b^2=1$ et vérifie $c^2=a^2+b^2$.", "Ses asymptotes ont pour équations $y=\\pm(b/a)x$.", String.raw`\frac{x^2}{a^2}-\frac{y^2}{b^2}=1,\quad c^2=a^2+b^2`, "Pour $x^2/4-y^2=1$, quelles sont les asymptotes ?", "$y=x/2$ et $y=-x/2$.", 80, "challenge"),
  ],
});

export const terminalCLogarithmsPath = buildOfficialMathPath({
  id: "terminale-c-math-l08-logarithms", levelIds, chapterNumber: 8, themeNumber: 1,
  themeTitle: "Analyse", title: "Fonctions logarithmes",
  description: "Logarithme népérien, calcul algébrique, équations, limites, dérivation, primitives et logarithmes de base quelconque.",
  outcomes: ["Calculer avec le logarithme", "Résoudre des équations logarithmiques", "Dériver et intégrer des formes logarithmiques"],
  documentTitle: "TC Maths leçon 08 FONCTIONS LOGARITHMES.pdf",
  topics: [
    t("natural-log-definition", "Définition et propriétés de $\\ln$", "1-2", "I. Fonction logarithme népérien", "La fonction $\\ln$ est la primitive de $1/x$ sur $]0,+\\infty[$ qui s’annule en $1$. Elle est strictement croissante.", "Toujours imposer la stricte positivité de l’argument.", String.raw`(\ln x)'=\frac1x,\quad \ln 1=0`, "Quel est l’ensemble de définition de $\\ln(2x-3)$ ?", "$]3/2,+\\infty[$.", 55),
    t("log-algebra", "Calcul algébrique avec les logarithmes", "2-3", "II-1. Propriétés algébriques", "Le logarithme transforme les produits en sommes, les quotients en différences et les puissances en facteurs.", "Simplifier seulement après avoir vérifié que tous les arguments sont positifs.", String.raw`\ln(ab)=\ln a+\ln b,\quad\ln(a^r)=r\ln a`, "Simplifie $\\ln 8-\\ln 2$.", "$\\ln4$.", 60),
    t("log-equations", "Équations et inéquations logarithmiques", "3-5", "II-2. Équations", "L’injectivité et la croissance de $\\ln$ permettent de comparer les arguments après avoir posé les conditions d’existence.", "Écrire le domaine avant toute transformation.", String.raw`\ln u=\ln v\Longleftrightarrow u=v>0`, "Résous $\\ln(x-1)=\\ln3$.", "$x=4$.", 65),
    t("log-limits", "Limites logarithmiques", "5-6", "III. Limites", "$\\ln x$ tend vers $-\\infty$ en $0^+$ et vers $+\\infty$ en $+\\infty$. Les limites de référence permettent de lever les formes indéterminées.", "Reconnaître notamment $\\ln(1+u)/u$ lorsque $u\\to0$.", String.raw`\lim_{u\to0}\frac{\ln(1+u)}u=1`, "Quelle est la limite de $\\ln x/x$ en $+\\infty$ ?", "$0$.", 65),
    t("log-derivative", "Dérivée de $\\ln|u|$", "6-7", "IV-1. Dérivation", "Si $u$ est dérivable et ne s’annule pas, $\\ln|u|$ est dérivable avec pour dérivée $u'/u$.", "Sur un intervalle où $u>0$, on peut écrire simplement $\\ln u$.", String.raw`(\ln|u|)'=\frac{u'}u`, "Quelle est la dérivée de $\\ln(x^2+1)$ ?", "$2x/(x^2+1)$.", 70),
    t("log-primitives", "Primitives de la forme $u'/u$", "7-8", "IV-2. Primitives", "Une quotient contenant exactement la dérivée du dénominateur se primitive par un logarithme de valeur absolue.", "Ajuster le coefficient puis ajouter la constante.", String.raw`\int\frac{u'}u=\ln|u|+C`, "Une primitive de $2x/(x^2+1)$ est-elle $\\ln(x^2+1)$ ?", "Oui.", 70),
    t("other-log-bases", "Logarithmes de base $a$", "8-9", "V. Autres bases", "Pour $a>0$, $a\\ne1$, le logarithme de base $a$ est défini par changement de base.", "La base $10$ donne le logarithme décimal.", String.raw`\log_a x=\frac{\ln x}{\ln a}`, "Combien vaut $\\log_2 8$ ?", "$3$.", 75, "challenge"),
  ],
});

export const terminalCComplexNumbersPath = buildOfficialMathPath({
  id: "terminale-c-math-l09-complex-numbers", levelIds, chapterNumber: 9, themeNumber: 4,
  themeTitle: "Nombres complexes", title: "Nombres complexes",
  description: "Forme algébrique, conjugué, module, argument, formes trigonométrique et exponentielle, racines et équations.",
  outcomes: ["Calculer dans $\\mathbb C$", "Passer entre les formes d’un complexe", "Résoudre des équations complexes"],
  documentTitle: "TC Maths leçon 09 Nombres complexes.pdf",
  topics: [
    t("complex-algebra", "Forme algébrique et opérations", "1-3", "I. Calculs dans $\\mathbb C$", "Tout complexe s’écrit de façon unique $a+ib$. Les opérations suivent les règles usuelles avec $i^2=-1$.", "Regrouper séparément les parties réelle et imaginaire.", String.raw`(a+ib)+(c+id)=(a+c)+i(b+d)`, "Calcule $(2+3i)+(1-5i)$.", "$3-2i$.", 50),
    t("complex-powers", "Puissances de $i$ et binôme", "3-4", "I-2. Puissances", "Les puissances de $i$ sont périodiques de période $4$ ; le binôme de Newton s’applique ensuite comme dans $\\mathbb R$.", "Réduire l’exposant modulo $4$.", String.raw`i^{4q+r}=i^r`, "Combien vaut $i^{2026}$ ?", "$-1$.", 55),
    t("complex-conjugate", "Conjugué et quotient", "4-6", "II. Conjugué", "Le conjugué de $a+ib$ est $a-ib$. Multiplier par le conjugué rend réel le dénominateur d’un quotient.", "$z\\bar z=|z|^2$ est réel positif.", String.raw`\frac zw=\frac{z\bar w}{|w|^2}`, "Quel est le conjugué de $3-4i$ ?", "$3+4i$.", 60),
    t("complex-modulus", "Module et distances", "6-8", "III. Module", "Le module de $a+ib$ vaut $\\sqrt{a^2+b^2}$ et représente la distance à l’origine dans le plan complexe.", "Le module d’un produit est le produit des modules.", String.raw`|a+ib|=\sqrt{a^2+b^2}`, "Quel est le module de $3-4i$ ?", "$5$.", 60),
    t("complex-arguments", "Arguments d’un complexe", "8-10", "IV. Arguments", "Un argument de $z\\ne0$ est une mesure de l’angle orienté entre l’axe réel et le vecteur image de $z$.", "Les arguments sont définis modulo $2\\pi$.", String.raw`z=|z|(\cos\theta+i\sin\theta)`, "Un argument de $-i$ est-il $-\\pi/2$ ?", "Oui.", 65),
    t("trigonometric-form", "Forme trigonométrique", "10-12", "V-1. Forme trigonométrique", "La forme trigonométrique associe module et argument et rend simples les produits et quotients.", "Multiplier les modules et additionner les arguments.", String.raw`z=r(\cos\theta+i\sin\theta)`, "Quelle est la forme trigonométrique de $1+i$ ?", "$\\sqrt2(\\cos(\\pi/4)+i\\sin(\\pi/4))$.", 65),
    t("exponential-form", "Forme exponentielle", "12-14", "V-2. Forme exponentielle", "La notation $re^{i\\theta}$ condense la forme trigonométrique et respecte les règles des puissances.", "Un quotient divise les modules et soustrait les arguments.", String.raw`z=re^{i\theta}`, "Calcule $e^{i\\pi}$.", "$-1$.", 65),
    t("moivre-linearization", "Formule de Moivre et linéarisation", "14-17", "VI. Puissances", "La formule de Moivre calcule les puissances d’un complexe trigonométrique et permet de linéariser les puissances de sinus ou cosinus.", "Développer aussi $(e^{ix}+e^{-ix})/2$ pour les linéarisations.", String.raw`(\cos\theta+i\sin\theta)^n=\cos(n\theta)+i\sin(n\theta)`, "La formule de Moivre transforme $(\\cos x+i\\sin x)^4$ en quoi ?", "$\\cos4x+i\\sin4x$.", 70),
    t("complex-equations", "Racines carrées et équations du second degré", "17-20", "VII. Équations", "La recherche des racines carrées de $a+ib$ ramène à un système réel ; les équations quadratiques utilisent ensuite le discriminant complexe.", "Vérifier les solutions par substitution.", String.raw`(x+iy)^2=(x^2-y^2)+2xyi`, "Quelles sont les racines carrées de $-4$ ?", "$2i$ et $-2i$.", 75),
    t("roots-of-unity", "Racines n-ièmes et racines de l’unité", "20-23", "VIII. Racines n-ièmes", "Les racines n-ièmes d’un complexe sont régulièrement réparties sur un cercle. Celles de l’unité forment un polygone régulier.", "Diviser l’argument augmenté de $2k\\pi$ par $n$ pour $k=0,\\ldots,n-1$.", String.raw`z_k=r^{1/n}e^{i(\theta+2k\pi)/n}`, "Combien l’équation $z^5=1$ possède-t-elle de solutions distinctes ?", "$5$.", 85, "challenge"),
  ],
});

export const terminalCExponentialPowerPath = buildOfficialMathPath({
  id: "terminale-c-math-l10-exponential-power", levelIds, chapterNumber: 10, themeNumber: 1,
  themeTitle: "Analyse", title: "Fonction exponentielle et fonction puissance",
  description: "Propriétés de l’exponentielle, équations, limites, dérivation, primitives et puissances réelles.",
  outcomes: ["Calculer avec l’exponentielle", "Résoudre des équations exponentielles", "Étudier les fonctions puissances"],
  documentTitle: "TC Maths leçon 10 Fonction exponentielle et fonction puissance.pdf",
  topics: [
    t("exp-properties", "Propriétés algébriques de l’exponentielle", "1-2", "I-1. Propriétés", "La fonction exponentielle transforme les sommes en produits et ne s’annule jamais.", "Regrouper les exposants avant de calculer.", String.raw`e^{a+b}=e^ae^b,\quad e^{-a}=1/e^a`, "Simplifie $e^{2x}e^{-x}$.", "$e^x$.", 55),
    t("exp-equations", "Équations et inéquations exponentielles", "2-4", "I-2. Équations", "L’exponentielle est strictement croissante et bijective de $\\mathbb R$ sur $]0,+\\infty[$.", "Mettre les deux membres sous forme exponentielle ou appliquer $\\ln$.", String.raw`e^u=e^v\Longleftrightarrow u=v`, "Résous $e^{2x}=e^6$.", "$x=3$.", 60),
    t("exp-limits", "Limites de l’exponentielle", "4-6", "II. Limites", "$e^x$ domine toute puissance de $x$ en $+\\infty$, tandis que $e^x$ tend vers $0$ en $-\\infty$.", "Transformer $e^{-x}$ en $1/e^x$ lorsque cela simplifie la limite.", String.raw`\lim_{x\to+\infty}\frac{x^n}{e^x}=0`, "Quelle est la limite de $x^3/e^x$ en $+\\infty$ ?", "$0$.", 65),
    t("exp-derivative", "Dérivée d’une exponentielle composée", "6-7", "III-1. Dérivation", "La dérivée de $e^{u(x)}$ est le produit de $u'(x)$ par $e^{u(x)}$.", "L’exponentielle reste toujours strictement positive : le signe vient de $u'$.", String.raw`(e^u)'=u'e^u`, "Quelle est la dérivée de $e^{x^2}$ ?", "$2xe^{x^2}$.", 65),
    t("exp-primitives", "Primitives exponentielles", "7-8", "III-2. Primitives", "La présence de $u'$ devant $e^u$ permet de reconnaître directement une primitive.", "Ajuster le coefficient de la dérivée intérieure.", String.raw`\int u'e^u=e^u+C`, "Une primitive de $3e^{3x}$ est-elle $e^{3x}$ ?", "Oui.", 65),
    t("real-powers", "Fonctions puissances réelles", "8-10", "IV-1. Définition", "Pour $a>0$, la puissance réelle $a^x$ est définie par $e^{x\\ln a}$.", "Le sens de variation dépend du signe de $\\ln a$.", String.raw`a^x=e^{x\ln a}`, "La fonction $(1/2)^x$ est-elle croissante ?", "Non, elle est strictement décroissante.", 65),
    t("power-equations", "Équations avec des puissances", "10-11", "IV-2. Équations", "Une base positive distincte de $1$ définit une fonction injective ; on peut donc identifier les exposants.", "Si les bases diffèrent, appliquer le logarithme.", String.raw`a^u=a^v\Longleftrightarrow u=v\quad(a>0,a\ne1)`, "Résous $3^{x+1}=27$.", "$x=2$.", 70),
    t("growth-comparison", "Croissances comparées", "11-13", "V. Croissances comparées", "L’exponentielle domine les puissances et les puissances positives dominent le logarithme à l’infini.", "Réécrire les expressions pour faire apparaître une limite de référence.", String.raw`\ln x\ll x^\alpha\ll e^x\quad(x\to+\infty,\ \alpha>0)`, "Quelle est la limite de $\\ln x/\\sqrt x$ en $+\\infty$ ?", "$0$.", 80, "challenge"),
  ],
});

export const terminalCMathPaths06to10 = [
  terminalCPrimitivesPath,
  terminalCConicsPath,
  terminalCLogarithmsPath,
  terminalCComplexNumbersPath,
  terminalCExponentialPowerPath,
];
