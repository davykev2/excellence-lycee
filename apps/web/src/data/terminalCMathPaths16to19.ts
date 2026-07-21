import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";

const levelIds = ["terminale-c"];

export const terminalCDirectSimilaritiesPath = buildOfficialMathPath({
  id: "terminale-c-math-l16-direct-similarities", levelIds, chapterNumber: 16, themeNumber: 2,
  themeTitle: "Transformations du plan", title: "Similitudes directes",
  description: "Définition, invariants, écriture complexe, détermination, construction et applications des similitudes directes.",
  outcomes: ["Caractériser une similitude directe", "Déterminer ses éléments", "Construire son centre et ses images"],
  documentTitle: "TC Maths leçon 16 Similitudes directes.pdf",
  topics: [
    t("similarity-definition", "Rapport et angle d’une similitude directe", "1-3", "I. Définition", "Une similitude directe multiplie toutes les distances par un même rapport $k>0$ et conserve les angles orientés en ajoutant un angle constant $\\theta$.", "Le couple $(k,\\theta)$ décrit l’effet sur toute paire de vecteurs.", String.raw`A'B'=kAB,\quad\operatorname{Mes}(\overrightarrow{A'B'},\overrightarrow{AB})=\theta`, "Une similitude de rapport $3$ transforme une longueur $4$ en quelle longueur ?", "$12$.", 50),
    t("similarity-composition-inverse", "Composition et réciproque", "3-5", "II-1. Opérations", "Les rapports se multiplient et les angles s’additionnent lors d’une composition. La réciproque inverse le rapport et change le signe de l’angle.", "Travailler modulo $2\\pi$ pour les angles.", String.raw`k_{g\circ f}=k_gk_f,\quad\theta_{g\circ f}=\theta_g+\theta_f`, "Quel est le rapport de la réciproque d’une similitude de rapport $5$ ?", "$1/5$.", 55),
    t("similarity-invariants", "Propriétés géométriques conservées", "5-7", "II-2. Invariants", "Une similitude directe conserve l’alignement, les angles orientés, les rapports de longueurs, les barycentres et la forme des figures.", "Les aires sont multipliées par $k^2$.", String.raw`\mathcal A'=k^2\mathcal A`, "Par combien une aire est-elle multipliée si $k=3$ ?", "$9$.", 60),
    t("similarity-canonical", "Décomposition canonique", "7-10", "III. Décomposition", "Une similitude directe non translation possède un centre unique et se décompose en une rotation et une homothétie de ce même centre.", "Le rapport $1$ donne une rotation ; l’angle nul donne une homothétie positive.", String.raw`s=h_{\Omega,k}\circ r_{\Omega,\theta}`, "Quelle nature obtient-on si $k=1$ et $\\theta\\ne0$ ?", "Une rotation.", 65),
    t("similarity-complex-form", "Écriture complexe et reconnaissance", "10-13", "IV-1. Forme complexe", "Toute similitude directe s’écrit $z'=az+b$ avec $a\\ne0$ ; son rapport est $|a|$ et son angle est un argument de $a$.", "Le cas $a=1$ correspond à une translation.", String.raw`z'=az+b,\quad k=|a|,\quad\theta=\arg a`, "Pour $z'=(1+i)z-2$, quel est le rapport ?", "$\\sqrt2$.", 65),
    t("similarity-center-form", "Écriture à partir du centre", "13-16", "IV-2. Centre", "Si $\\Omega$ est le centre d’affixe $\\omega$, l’écriture $z'-\\omega=a(z-\\omega)$ fait apparaître directement le point fixe.", "Résoudre $\\omega=a\\omega+b$ lorsque $a\\ne1$.", String.raw`z'-\omega=ke^{i\theta}(z-\omega)`, "Quel point reste fixe dans cette écriture ?", "$\\Omega$.", 70),
    t("similarity-from-images", "Déterminer une similitude par deux images", "16-20", "V. Détermination", "Les images de deux points distincts fournissent deux équations linéaires qui déterminent $a$ et $b$.", "Soustraire les équations pour obtenir d’abord $a$.", String.raw`a=\frac{z_{B'}-z_{A'}}{z_B-z_A}`, "Si $0\\mapsto1$ et $1\\mapsto1+i$, quelle est l’écriture ?", "$z'=iz+1$.", 70),
    t("similarity-center-construction", "Construire le centre", "20-25", "VI. Construction", "Le centre se trouve en combinant les médiatrices liées au rapport et les arcs capables liés à l’angle, ou grâce à une construction par triangles directement semblables.", "Traiter séparément les cas $k=1$ et $\\theta=0$.", String.raw`\frac{\Omega A'}{\Omega A}=k,\quad\operatorname{Mes}(\overrightarrow{\Omega A},\overrightarrow{\Omega A'})=\theta`, "Que vérifie le centre par rapport à un point $A$ et son image $A'$ ?", "$\\Omega A'=k\\,\\Omega A$ et l’angle orienté vaut $\\theta$.", 75),
    t("similarity-applications", "Triangles directement semblables et applications", "25-32", "VII. Applications", "Deux triangles directement semblables sont reliés par une similitude directe unique lorsque les sommets homologues sont ordonnés. Cette transformation sert aux constructions et aux lieux géométriques.", "Identifier les sommets homologues avant de comparer rapports et angles.", String.raw`\frac{A'B'}{AB}=\frac{B'C'}{BC}=\frac{C'A'}{CA}=k`, "Que faut-il vérifier pour reconnaître deux triangles directement semblables ?", "L’égalité des rapports des côtés homologues et la conservation des angles orientés.", 90, "challenge"),
  ],
});

export const terminalCProbabilityPath = buildOfficialMathPath({
  id: "terminale-c-math-l17-probability", levelIds, chapterNumber: 17, themeNumber: 5,
  themeTitle: "Probabilités", title: "Probabilité conditionnelle et variable aléatoire",
  description: "Conditionnement, indépendance, probabilités totales, variables aléatoires, lois de Bernoulli et binomiales.",
  outcomes: ["Calculer une probabilité conditionnelle", "Utiliser un arbre ou une partition", "Étudier une variable aléatoire discrète"],
  documentTitle: "TC Maths leçon 17 Probabilité.pdf",
  topics: [
    t("conditional-probability", "Probabilité conditionnelle", "1-2", "I-1. Conditionnement", "La probabilité de $B$ sachant $A$ mesure la fréquence de $B$ dans l’univers restreint à $A$.", "Le conditionnement exige $P(A)>0$.", String.raw`P_A(B)=\frac{P(A\cap B)}{P(A)}`, "Si $P(F)=0{,}75$ et $P_F(I)=0{,}45$, combien vaut $P(F\\cap I)$ ?", "$0{,}3375$.", 55),
    t("product-independence", "Formule du produit et indépendance", "2-3", "I-2. Indépendance", "La formule du produit reconstruit l’intersection. Deux événements sont indépendants lorsque le conditionnement ne modifie pas la probabilité.", "Ne pas confondre indépendance et incompatibilité.", String.raw`P(A\cap B)=P(A)P_A(B),\quad A\perp B\Longleftrightarrow P(A\cap B)=P(A)P(B)`, "Pour deux lancers indépendants d’une pièce équilibrée, combien vaut la probabilité d’obtenir deux piles ?", "$1/4$.", 60),
    t("partition-total-probability", "Partition, arbre et probabilités totales", "3-4", "I-3. Probabilités totales", "Une partition découpe l’univers en événements incompatibles couvrant tous les cas. Un arbre pondéré organise les probabilités conditionnelles.", "Multiplier le long d’une branche puis additionner les branches conduisant à l’événement.", String.raw`P(B)=\sum_iP(A_i)P_{A_i}(B)`, "Quelle opération combine les probabilités des branches menant toutes à $B$ ?", "On les additionne.", 65),
    t("random-variable-law", "Loi d’une variable aléatoire", "4-6", "II-1. Variable aléatoire", "Une variable aléatoire associe un nombre réel à chaque issue. Sa loi donne la probabilité de chacune de ses valeurs.", "La somme des probabilités de la loi doit valoir $1$.", String.raw`\sum_iP(X=x_i)=1`, "Dans une urne de $2$ boules blanches et $4$ rouges, que doit vérifier toute loi de gain construite ?", "La somme de ses probabilités vaut $1$.", 60),
    t("expectation-variance", "Espérance, variance et écart-type", "6-7", "II-2. Paramètres", "L’espérance est la moyenne théorique ; la variance mesure la dispersion quadratique et l’écart-type est sa racine carrée.", "Utiliser $V(X)=E(X^2)-E(X)^2$ pour simplifier les calculs.", String.raw`E(X)=\sum x_ip_i,\quad V(X)=E(X^2)-E(X)^2`, "Que vaut l’écart-type en fonction de la variance ?", "$\\sigma(X)=\\sqrt{V(X)}$.", 65),
    t("bernoulli-binomial", "Épreuve de Bernoulli et loi binomiale", "7-9", "III. Loi binomiale", "La répétition indépendante de $n$ épreuves de Bernoulli de probabilité de succès $p$ donne une variable $X\\sim\\mathcal B(n,p)$.", "Pour exactement $k$ succès, choisir leurs positions puis multiplier les probabilités.", String.raw`P(X=k)=\binom nkp^k(1-p)^{n-k}`, "Dans $5$ lancers d’un dé, quelle est la probabilité d’obtenir exactement quatre fois le six ?", "$\\binom54(1/6)^4(5/6)$.", 70),
    t("binomial-parameters", "Espérance et variance binomiales", "9-10", "III-2. Paramètres binomiaux", "Pour $X\\sim\\mathcal B(n,p)$, l’espérance vaut $np$ et la variance $np(1-p)$.", "L’espérance s’interprète comme le nombre moyen de succès sur de nombreuses répétitions.", String.raw`E(X)=np,\quad V(X)=np(1-p)`, "Pour $X\\sim\\mathcal B(5,3/4)$, combien vaut $E(X)$ ?", "$15/4$.", 65),
    t("cumulative-distribution", "Fonction de répartition", "10-12", "IV. Fonction de répartition", "La fonction de répartition $F(x)=P(X\\le x)$ cumule les probabilités et forme une fonction en escalier croissante de $0$ à $1$.", "À chaque valeur possible, ajouter sa probabilité à la somme précédente.", String.raw`F(x)=P(X\le x)`, "Pour la loi de probabilités $1/8,3/8,3/8,1/8$, quelle est la valeur cumulée après les deux premières issues ?", "$1/2$.", 80, "challenge"),
  ],
});

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
