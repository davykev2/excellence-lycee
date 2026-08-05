import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";
import { terminalCComplexNumbersPath } from "./terminalCComplexNumbersPath";
import { terminalCConicsPath } from "./terminalCConicsPath";
import { terminalCLogarithmsPath } from "./terminalCLogarithmsPath";
import { terminalCPrimitivesPath } from "./terminalCPrimitivesPath";

const levelIds = ["terminale-c"];

export { terminalCComplexNumbersPath, terminalCConicsPath, terminalCLogarithmsPath, terminalCPrimitivesPath };

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
