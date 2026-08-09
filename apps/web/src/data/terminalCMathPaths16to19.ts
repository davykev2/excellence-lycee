import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";
import { terminalCDifferentialEquationsPath } from "./terminalCDifferentialEquationsPath";
import { terminalCDirectSimilaritiesPath } from "./terminalCDirectSimilaritiesPath";
import { terminalCProbabilityPath } from "./terminalCProbabilityPath";

export { terminalCDifferentialEquationsPath, terminalCProbabilityPath };

const levelIds = ["terminale-c"];

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
