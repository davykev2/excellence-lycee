import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";
import { terminalCLcmGcdPath } from "./terminalCLcmGcdPath";

export { terminalCLcmGcdPath };

const levelIds = ["terminale-c"];

export const terminalCSequencesPath = buildOfficialMathPath({
  id: "terminale-c-math-l12-sequences", levelIds, chapterNumber: 12, themeNumber: 1,
  themeTitle: "Analyse", title: "Suites numériques",
  description: "Raisonnement par récurrence, monotonie, bornes, convergence, limites et suites récurrentes.",
  outcomes: ["Démontrer une propriété par récurrence", "Étudier la monotonie et la convergence", "Déterminer la limite d’une suite récurrente"],
  documentTitle: "TC Maths leçon 12 Suites numériques.pdf",
  topics: [
    t("sequence-induction", "Raisonnement par récurrence", "1-2", "I. Récurrence", "Une preuve par récurrence comporte une initialisation, une hypothèse au rang $n$, puis l’hérédité au rang $n+1$.", "Ne jamais oublier de préciser le premier rang concerné.", String.raw`P(n_0),\quad P(n)\Rightarrow P(n+1)`, "Quelles sont les trois étapes d’une récurrence ?", "Initialisation, hérédité et conclusion.", 55),
    t("sequence-monotonicity", "Monotonie et bornes", "2-4", "II. Monotonie", "On étudie le signe de $u_{n+1}-u_n$, le quotient lorsque les termes sont positifs, ou les variations d’une fonction associée.", "Une suite croissante et majorée, ou décroissante et minorée, converge.", String.raw`u_{n+1}-u_n\ge0\Longrightarrow(u_n)\text{ croissante}`, "Si $u_{n+1}-u_n=1/(n+1)>0$, quel est le sens de variation ?", "La suite est strictement croissante.", 60),
    t("sequence-limit-algebra", "Calcul algébrique des limites", "4-6", "III-1. Opérations", "Les règles sur les sommes, produits et quotients s’appliquent aux suites, avec prudence en présence de formes indéterminées.", "Factoriser par la plus grande puissance de $n$ dans une fraction rationnelle.", String.raw`\frac{a_pn^p+\cdots}{b_qn^q+\cdots}\sim\frac{a_p}{b_q}n^{p-q}`, "Quelle est la limite de $(3n^2-n)/(n^2+1)$ ?", "$3$.", 60),
    t("monotone-convergence", "Théorème de convergence monotone", "6-7", "III-2. Convergence", "La monotonie accompagnée d’une borne du bon côté garantit une limite finie.", "Établir séparément la monotonie et la borne avant de conclure.", String.raw`u_n\nearrow,\ u_n\le M\Longrightarrow u_n\to\ell`, "Une suite croissante non majorée peut-elle converger vers un réel ?", "Non.", 65),
    t("reference-sequences", "Suites de référence", "7-9", "IV. Limites usuelles", "Les suites géométriques, puissances, racines et logarithmes fournissent des limites de référence à reconnaître.", "Pour $q^n$, distinguer $|q|<1$, $q=1$ et $|q|>1$.", String.raw`|q|<1\Longrightarrow q^n\to0`, "Quelle est la limite de $(2/3)^n$ ?", "$0$.", 60),
    t("sequence-growth", "Croissances comparées", "9-10", "IV-2. Croissances comparées", "Les exponentielles de base supérieure à $1$ dominent les puissances de $n$, qui dominent les logarithmes.", "Transformer une racine n-ième avec l’exponentielle et le logarithme si nécessaire.", String.raw`\ln n\ll n^\alpha\ll a^n\quad(a>1)`, "Quelle est la limite de $n^4/2^n$ ?", "$0$.", 65),
    t("small-angle-sequence", "Suites trigonométriques et petit angle", "10-11", "IV-3. Limites trigonométriques", "Lorsque $u_n\\to0$, le quotient $\\sin u_n/u_n$ tend vers $1$.", "Faire apparaître explicitement le quotient de référence.", String.raw`\lim_{u\to0}\frac{\sin u}{u}=1`, "Quelle est la limite de $n\\sin(1/n)$ ?", "$1$.", 70),
    t("recursive-sequence-limit", "Suites définies par récurrence", "11-13", "V. Suites récurrentes", "Après avoir prouvé qu’une suite récurrente converge, sa limite vérifie l’équation de point fixe $\\ell=f(\\ell)$ si $f$ est continue.", "L’équation de point fixe donne des candidats ; la convergence et les bornes sélectionnent la bonne limite.", String.raw`u_{n+1}=f(u_n),\ u_n\to\ell\Longrightarrow\ell=f(\ell)`, "Si $u_{n+1}=\\sqrt{2+u_n}$ et $u_n\\to\\ell\\ge0$, quelle limite convient ?", "$\\ell=2$.", 85, "challenge"),
  ],
});

export const terminalCComplexGeometryPath = buildOfficialMathPath({
  id: "terminale-c-math-l13-complex-geometry", levelIds, chapterNumber: 13, themeNumber: 2,
  themeTitle: "Géométrie complexe", title: "Nombres complexes et géométrie du plan",
  description: "Angles, distances, configurations géométriques et transformations écrites avec les nombres complexes.",
  outcomes: ["Traduire une propriété géométrique en complexes", "Reconnaître une transformation", "Déterminer et construire une similitude"],
  documentTitle: "TC Maths lecon 13 Nombres complexes et géometrie du plan.pdf",
  topics: [
    t("complex-angle", "Quotient complexe et angle orienté", "1-3", "I-1. Angles", "Pour des points $A,B,C,D$, l’argument d’un quotient de différences d’affixes représente un angle orienté.", "Écrire les vecteurs dans le même ordre que l’angle demandé.", String.raw`\arg\frac{z_D-z_C}{z_B-z_A}=\operatorname{Mes}(\overrightarrow{AB},\overrightarrow{CD})`, "Que représente $\\arg((z_C-z_A)/(z_B-z_A))$ ?", "$\\operatorname{Mes}(\\overrightarrow{AB},\\overrightarrow{AC})$.", 55),
    t("complex-distance-ratio", "Module d’un quotient et rapport de distances", "3-4", "I-2. Distances", "Le module d’un quotient de différences d’affixes donne le rapport des longueurs correspondantes.", "Associer chaque différence d’affixes au segment qu’elle représente.", String.raw`\left|\frac{z_C-z_A}{z_B-z_A}\right|=\frac{AC}{AB}`, "Si le module du quotient vaut $1$, que peut-on conclure ?", "$AC=AB$.", 55),
    t("complex-loci", "Lieux géométriques complexes", "4-6", "II. Ensembles de points", "Une condition sur un module donne souvent une droite, un cercle ou un cercle d’Apollonius ; une condition sur un argument donne une droite ou un arc capable.", "Traduire d’abord module et argument en distances et angles.", String.raw`|z-a|=r\Longleftrightarrow M\in\mathcal C(A,r)`, "Quel lieu vérifie $|z-(2+i)|=3$ ?", "Le cercle de centre d’affixe $2+i$ et de rayon $3$.", 65),
    t("complex-align-orthogonal", "Alignement, parallélisme et orthogonalité", "6-8", "III-1. Configurations", "Un quotient réel traduit des directions parallèles ; un quotient imaginaire pur traduit des directions orthogonales.", "Exclure les cas où un dénominateur est nul.", String.raw`\frac{z_C-z_A}{z_B-z_A}\in\mathbb R\Longleftrightarrow A,B,C\text{ alignés}`, "Si le quotient est imaginaire pur non nul, quelle configuration obtient-on ?", "Les directions correspondantes sont perpendiculaires.", 65),
    t("complex-cyclic-triangles", "Cocyclicité et triangles particuliers", "8-10", "III-2. Figures", "Les arguments permettent d’établir qu’un angle est droit ou que quatre points sont cocycliques ; modules et arguments caractérisent aussi les triangles isocèles, rectangles ou équilatéraux.", "Combiner une condition de longueur et une condition d’angle.", String.raw`\arg\frac{z_D-z_A}{z_C-z_A}\equiv\arg\frac{z_D-z_B}{z_C-z_B}\ [\pi]`, "Quelle propriété suffit pour montrer qu’un triangle est équilatéral ?", "Deux côtés égaux et un angle de mesure $\\pi/3$.", 70),
    t("complex-transformation", "Écriture complexe d’une transformation", "10-13", "IV-1. Transformations", "Une application $z'=az+b$ avec $a\\ne0$ représente une similitude directe ; sa nature précise dépend du module et de l’argument de $a$.", "$|a|=1$ donne une isométrie directe.", String.raw`z'=az+b`, "Quelle transformation représente $z'=z+2-i$ ?", "La translation de vecteur d’affixe $2-i$.", 65),
    t("similarity-elements", "Éléments caractéristiques d’une similitude", "13-16", "IV-2. Similitudes", "Pour $a\\ne1$, le centre est l’unique point fixe ; le rapport vaut $|a|$ et l’angle vaut $\\arg a$.", "Résoudre $z=az+b$ pour trouver le centre.", String.raw`\omega=\frac b{1-a},\quad k=|a|,\quad\theta=\arg a`, "Quel est le rapport de $z'=2iz+1$ ?", "$2$.", 70),
    t("similarity-from-data", "Déterminer une similitude à partir d’images", "16-19", "V-1. Détermination", "Les images de deux points distincts déterminent une unique similitude directe, obtenue en résolvant les deux équations complexes.", "Soustraire les équations élimine immédiatement $b$.", String.raw`a=\frac{z_{B'}-z_{A'}}{z_B-z_A},\quad b=z_{A'}-az_A`, "Combien d’images de points distincts faut-il pour déterminer $z'=az+b$ ?", "Deux.", 75),
    t("similarity-decomposition", "Décomposition et construction", "19-23", "V-2. Décomposition", "Une similitude directe de centre $\\Omega$ se décompose en une homothétie de même centre et une rotation de même centre, dans n’importe quel ordre.", "Construire d’abord l’angle puis appliquer le rapport, ou inversement.", String.raw`s=h_{\Omega,k}\circ r_{\Omega,\theta}=r_{\Omega,\theta}\circ h_{\Omega,k}`, "Quelles transformations composent une similitude directe de rapport $2$ et d’angle $\\pi/3$ ?", "Une homothétie de rapport $2$ et une rotation d’angle $\\pi/3$ de même centre.", 80),
    t("similarity-images", "Images de droites, cercles et figures", "23-26", "VI. Applications", "Une similitude directe conserve les angles orientés, l’alignement et les formes, et multiplie toutes les longueurs par son rapport.", "L’image d’un cercle est un cercle dont le rayon est multiplié par $k$.", String.raw`A'B'=k\,AB`, "Quelle est l’image d’un cercle de rayon $3$ par une similitude de rapport $2$ ?", "Un cercle de rayon $6$.", 85, "challenge"),
  ],
});

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
