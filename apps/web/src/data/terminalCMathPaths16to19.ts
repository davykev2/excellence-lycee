import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";
import { terminalCDirectSimilaritiesPath } from "./terminalCDirectSimilaritiesPath";
import { terminalCProbabilityPath } from "./terminalCProbabilityPath";

export { terminalCProbabilityPath };

const levelIds = ["terminale-c"];

export const terminalCDifferentialEquationsPath = buildOfficialMathPath({
  id: "terminale-c-math-l18-differential-equations", levelIds, chapterNumber: 18, themeNumber: 1,
  themeTitle: "Analyse", title: "Équations différentielles",
  description: "Équations linéaires du premier ordre et équations homogènes du second ordre à coefficients constants.",
  outcomes: ["Résoudre une équation du premier ordre", "Déterminer une solution avec condition initiale", "Résoudre les équations du second ordre du cours"],
  documentTitle: "TC Maths leçon 18 Equations différentielles.pdf",
  topics: [
    t("first-order-homogeneous", "Équation $y'+ay=0$", "1-2", "I-1-a. Premier ordre homogène", "Les solutions de $y'+ay=0$ sont les multiples de $e^{-ax}$.", "Isoler d’abord le coefficient $a$ sous la forme normalisée.", String.raw`y'+ay=0\Longrightarrow y(x)=ke^{-ax}`, "Quelles sont les solutions de $y'+2y=0$ ?", "$y(x)=ke^{-2x}$, $k\\in\\mathbb R$.", 55),
    t("first-order-constant", "Équation $y'+ay=b$", "2", "I-1-b. Second membre constant", "Une solution constante $b/a$ s’ajoute à la solution de l’équation homogène lorsque $a\\ne0$.", "Vérifier la solution particulière constante avant d’ajouter $ke^{-ax}$.", String.raw`y(x)=ke^{-ax}+\frac ba`, "Quelles sont les solutions de $y'+2y=6$ ?", "$y(x)=ke^{-2x}+3$.", 60),
    t("first-order-initial-value", "Condition initiale au premier ordre", "2-3", "I-1-c. Condition initiale", "Une condition $y(x_0)=y_0$ détermine l’unique constante de la solution générale.", "Remplacer $x_0$ et $y_0$, puis résoudre l’équation en $k$.", String.raw`y(x_0)=y_0`, "Pour $y'-3y=7$ et $y(0)=1$, quelle solution obtient-on ?", "$y(x)=\\frac{10}{3}e^{3x}-\\frac73$.", 70),
    t("second-order-hyperbolic", "Équation $y''-\\omega^2y=0$", "3", "I-2-a. Second ordre, signe négatif", "Lorsque l’équation caractéristique possède deux racines réelles opposées, les solutions combinent deux exponentielles.", "Associer les racines $\\pm\\omega$ aux exponentielles correspondantes.", String.raw`y''-\omega^2y=0\Longrightarrow y=ae^{-\omega x}+be^{\omega x}`, "Quelles sont les solutions de $y''-4y=0$ ?", "$y(x)=ae^{-2x}+be^{2x}$.", 65),
    t("second-order-oscillatory", "Équation $y''+\\omega^2y=0$", "3-4", "I-2-b. Oscillations", "Lorsque le coefficient est positif, les solutions sont des combinaisons de cosinus et sinus de pulsation $\\omega$.", "Lire $\\omega$ comme la racine carrée du coefficient de $y$.", String.raw`y''+\omega^2y=0\Longrightarrow y=a\cos(\omega x)+b\sin(\omega x)`, "Quelles sont les solutions de $y''+4y=0$ ?", "$y(x)=a\\cos(2x)+b\\sin(2x)$.", 65),
    t("second-order-initial-values", "Conditions initiales au second ordre", "4-5", "I-2-c. Conditions initiales", "Deux conditions indépendantes déterminent les deux constantes d’une équation du second ordre.", "Calculer $y'$ avant de remplacer les deux conditions.", String.raw`y(x_0)=y_0,\quad y'(x_1)=y_1`, "Pour $y''+25y=0$, $y(0)=1$ et $y'(\\pi/5)=-2$, quelle solution donne le cours ?", "$y(x)=\\cos(5x)+\\frac25\\sin(5x)$.", 85, "challenge"),
  ],
});

export const terminalCStatisticsPath = buildOfficialMathPath({
  id: "terminale-c-math-l19-statistics", levelIds, chapterNumber: 19, themeNumber: 6,
  themeTitle: "Statistiques", title: "Statistique à deux variables",
  description: "Nuage de points, point moyen, covariance, corrélation, régression linéaire et estimation.",
  outcomes: ["Représenter une série double", "Mesurer sa corrélation", "Calculer une droite de régression et estimer"],
  documentTitle: "TC Maths leçon 19 Statistiques.pdf",
  topics: [
    t("scatter-plot", "Nuage de points", "1-3", "I. Série statistique double", "Une série double associe deux caractères quantitatifs. Chaque couple $(x_i,y_i)$ est représenté par un point du plan.", "Choisir des échelles lisibles et nommer les deux axes.", String.raw`M_i(x_i,y_i)`, "Combien de points contient le nuage de la série officielle comportant huit couples ?", "$8$.", 50),
    t("mean-point", "Point moyen du nuage", "3-4", "I-4. Point moyen", "Le point moyen a pour coordonnées les moyennes arithmétiques des deux séries marginales.", "Calculer séparément $\\bar x$ et $\\bar y$.", String.raw`G(\bar x,\bar y),\quad\bar x=\frac1n\sum x_i`, "Pour la série officielle, quelles sont les coordonnées du point moyen ?", "$G(4{,}575;36)$.", 55),
    t("covariance", "Covariance", "4-5", "II-1. Covariance", "La covariance mesure le sens de variation conjointe des deux caractères ; son signe indique une tendance croissante ou décroissante.", "Utiliser la formule développée pour éviter de recalculer tous les écarts à la moyenne.", String.raw`\operatorname{Cov}(X,Y)=\frac1n\sum x_iy_i-\bar x\bar y`, "Quelle covariance donne la série officielle ?", "$23{,}675$.", 60),
    t("correlation", "Coefficient de corrélation linéaire", "5", "II-2. Corrélation", "Le coefficient $r$ normalise la covariance entre $-1$ et $1$. Une valeur absolue proche de $1$ indique un bon ajustement linéaire.", "Le signe de $r$ est celui de la covariance.", String.raw`r=\frac{\operatorname{Cov}(X,Y)}{\sqrt{V(X)V(Y)}}`, "Quelle valeur approchée de $r$ obtient le cours ?", "$0{,}92$.", 65),
    t("regression-lines", "Droites de régression", "5-7", "II-3. Moindres carrés", "La droite de régression de $Y$ en $X$ passe par le point moyen et a pour pente $\\operatorname{Cov}(X,Y)/V(X)$.", "Ne pas confondre la régression de $Y$ en $X$ avec celle de $X$ en $Y$.", String.raw`y=ax+b,\quad a=\frac{\operatorname{Cov}(X,Y)}{V(X)},\quad b=\bar y-a\bar x`, "Quelle droite de régression de $Y$ en $X$ donne le cours ?", "$y=5{,}69x+9{,}97$.", 70),
    t("statistical-estimation", "Estimation par ajustement linéaire", "7-8", "II-4. Estimation", "Lorsque la corrélation est suffisante et que la tendance reste plausible, la droite de régression estime une valeur inconnue par substitution.", "Préciser qu’une extrapolation loin des données reste incertaine.", String.raw`\widehat y=a x_0+b`, "Pour une superficie de $9$ ha, combien d’exploitations le cours estime-t-il ?", "$62$ exploitations.", 85, "challenge"),
  ],
});

export const terminalCMathPaths16to19 = [
  terminalCDirectSimilaritiesPath,
  terminalCProbabilityPath,
  terminalCDifferentialEquationsPath,
  terminalCStatisticsPath,
];
