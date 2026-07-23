import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";
import { terminalCConicsPath } from "./terminalCConicsPath";
import { terminalCPrimitivesPath } from "./terminalCPrimitivesPath";

const levelIds = ["terminale-c"];

export { terminalCConicsPath, terminalCPrimitivesPath };

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
