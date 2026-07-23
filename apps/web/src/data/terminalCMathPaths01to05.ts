import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";
import { terminalCBarycenterPath } from "./terminalCBarycenterPath";
import { terminalCLimitsContinuityPath } from "./terminalCLimitsContinuityPath";

const levelIds = ["terminale-c"];

// La leçon 01 est rédigée en toutes lettres dans son propre fichier, sur le modèle
// de la leçon 01 de Terminale A : contenu fidèle enrichi, exercices multiples et
// courbes interactives. Les identifiants et les poids de progression y sont
// conservés à l'identique, afin que la répartition des 10 000 XP et le registre
// XP de l'API restent inchangés.
export { terminalCLimitsContinuityPath };
export { terminalCBarycenterPath };

export const terminalCDivisibilityPath = buildOfficialMathPath({
  id: "terminale-c-math-l03-divisibility", levelIds, chapterNumber: 3, themeNumber: 3,
  themeTitle: "Arithmétique", title: "Divisibilité dans ℤ",
  description: "Diviseurs, division euclidienne, congruences, numération et nombres premiers.",
  outcomes: ["Raisonner par divisibilité", "Calculer avec les congruences", "Décomposer un entier en facteurs premiers"],
  documentTitle: "TC Maths leçon 03 Divisibilité dans  Z.pdf",
  topics: [
    t("integer-divisibility", "Diviseurs et combinaisons linéaires", "1-2", "I-1. Diviseurs", "$a$ divise $b$ s’il existe un entier $k$ tel que $b=ak$. Un diviseur commun divise toute combinaison linéaire des nombres.", "Pour prouver que deux entiers sont premiers entre eux, ramener tout diviseur commun à un diviseur de $1$.", String.raw`d\mid a,\ d\mid b\Rightarrow d\mid(ua+vb)`, "Quelle conclusion donne le calcul du cours pour les deux termes de la fraction en $n$ ?", "Leur PGCD vaut $1$, donc la fraction est irréductible.", 60),
    t("euclidean-division-z", "Division euclidienne dans ℤ", "2-4", "I-2. Division euclidienne", "Pour $a\\in\\mathbb Z$ et $b\\ne0$, il existe un unique couple $(q,r)$ tel que $a=bq+r$ et $0\\le r<|b|$.", "Le reste est toujours positif ou nul et strictement inférieur à la valeur absolue du diviseur.", String.raw`a=bq+r,\qquad0\le r<|b|`, "Quel quotient et quel reste obtient-on pour $-361$ par $23$ ?", "$q=-16$ et $r=7$.", 60),
    t("remainders-operations", "Calculs de restes", "4", "I-2. Applications", "On remplace les entiers par leurs restes, puis on réduit à nouveau le résultat modulo le diviseur.", "Somme, produit et puissances peuvent être calculés sur les restes.", String.raw`a\equiv r\ [n],\ b\equiv s\ [n]\Rightarrow ab\equiv rs\ [n]`, "Si $m\\equiv8[17]$ et $n\\equiv12[17]$, quel est le reste de $mn$ par $17$ ?", "$11$", 65),
    t("congruences", "Congruences modulo n", "4-6", "I-3. Congruences", "$a\\equiv b[n]$ signifie que $n$ divise $a-b$, ou encore que $a$ et $b$ ont le même reste modulo $n$.", "Les congruences sont compatibles avec addition, multiplication et puissances entières.", String.raw`a\equiv b\pmod n\Longleftrightarrow n\mid(a-b)`, "Pour $a=51$, quel est le reste de $a^4$ modulo $8$ ?", "$1$", 65),
    t("numeration-divisibility-tests", "Bases de numération et critères de divisibilité", "6-9", "I-4. Numération", "L’écriture d’un entier en base $b$ repose sur les puissances successives de $b$. Les critères de divisibilité traduisent ensuite des congruences simples sur les chiffres.", "En base $b$, les chiffres sont compris entre $0$ et $b-1$.", String.raw`N=\sum_{k=0}^{p}a_kb^k`, "Quelle est l’écriture binaire de $222$ ?", "$11011110_2$", 70),
    t("prime-numbers", "Reconnaître un nombre premier", "9", "II-1. Nombres premiers", "Un entier $p>1$ est premier s’il n’a que deux diviseurs positifs. Pour le tester, il suffit d’essayer les nombres premiers inférieurs ou égaux à $\\sqrt p$.", "Un entier composé possède au moins un diviseur premier au plus égal à sa racine carrée.", String.raw`p\text{ premier}\Longleftrightarrow \forall q\le\sqrt p,\ q\nmid p`, "Le nombre $983$ est-il premier ?", "Oui.", 70),
    t("prime-factorization", "Décomposition en facteurs premiers", "9-10", "II-2. Décomposition", "Tout entier naturel supérieur à $1$ admet une décomposition unique en produit de puissances de nombres premiers, à l’ordre près.", "Diviser successivement par les plus petits facteurs premiers.", String.raw`n=p_1^{\alpha_1}\cdots p_k^{\alpha_k}`, "Quelle est la décomposition de $1092$ ?", "$2^2\\times3\\times7\\times13$.", 75),
    t("number-of-divisors", "Nombre de diviseurs positifs", "10", "II-2. Diviseurs", "Si $n=\\prod p_i^{\\alpha_i}$, chaque diviseur choisit indépendamment un exposant entre $0$ et $\\alpha_i$.", "Multiplier le nombre de choix possibles pour chaque exposant.", String.raw`\tau(n)=\prod_i(\alpha_i+1)`, "Combien de diviseurs positifs possède $1092=2^2\\times3\\times7\\times13$ ?", "$24$", 75, "challenge"),
  ],
});

export const terminalCDerivativesPath = buildOfficialMathPath({
  id: "terminale-c-math-l04-derivatives-functions", levelIds, chapterNumber: 4, themeNumber: 1,
  themeTitle: "Fonctions numériques", title: "Dérivabilité et étude de fonctions",
  description: "Dérivabilité latérale, fonctions composées et réciproques, dérivées successives et accroissements finis.",
  outcomes: ["Étudier une dérivabilité", "Dériver une composée ou une réciproque", "Appliquer les accroissements finis"],
  documentTitle: "TC Maths leçon 04 DERIVABILITE ET ETUDE DE FONCTIONS.pdf",
  topics: [
    t("one-sided-derivatives", "Dérivées à gauche et à droite", "1-2", "I-1-a", "La dérivabilité en un point de raccord exige l’existence et l’égalité des taux d’accroissement à gauche et à droite.", "Deux dérivées latérales finies mais différentes donnent deux demi-tangentes distinctes.", String.raw`f'_g(a)=\lim_{x\to a^-}\frac{f(x)-f(a)}{x-a}`, "Dans l’exercice en $1$, quelles sont les dérivées latérales ?", "$f'_g(1)=-1$ et $f'_d(1)=1$.", 60),
    t("derivative-at-junction", "Dérivabilité en un point de raccord", "2-3", "I-1-b", "Pour une fonction définie par morceaux, on vérifie d’abord la continuité, puis on compare les deux dérivées latérales.", "La fonction est dérivable si les deux taux tendent vers le même réel.", String.raw`f'_g(a)=f'_d(a)\Longrightarrow f'(a)\text{ existe}`, "La fonction $x^2$ à gauche et $x^3$ à droite est-elle dérivable en $0$ ?", "Oui, et $f'(0)=0$.", 60),
    t("vertical-half-tangent", "Demi-tangente verticale", "3", "I-1-c", "Une limite infinie du taux d’accroissement signale une demi-tangente verticale du côté étudié.", "Une dérivée infinie n’est pas une dérivée réelle : la fonction n’est pas dérivable de ce côté.", String.raw`\frac{f(x)-f(a)}{x-a}\to\pm\infty`, "Quelle interprétation obtient-on pour $f(x)=\\sqrt x-x$ en $0$ ?", "Une demi-tangente verticale à droite.", 65),
    t("derivative-composition", "Dérivée d’une composée", "4-5", "I-3. Composition", "Si $g$ est dérivable en $a$ et $f$ dérivable en $g(a)$, alors $f\\circ g$ est dérivable en $a$.", "Multiplier la dérivée extérieure évaluée en $g(a)$ par la dérivée intérieure.", String.raw`(f\circ g)'(a)=g'(a)f'(g(a))`, "Quelle valeur donne le cours pour $(f\\circ g)'(3)$ ?", "$-5/32$", 70),
    t("inverse-function-derivative", "Dérivée d’une bijection réciproque", "5-6", "I-4", "Si $f$ est bijective, dérivable en $x_0$ et $f'(x_0)\\ne0$, alors $f^{-1}$ est dérivable en $y_0=f(x_0)$.", "La dérivée de la réciproque est l’inverse de la dérivée au bon antécédent.", String.raw`(f^{-1})'(y_0)=\frac1{f'(x_0)}`, "Pour $g(-1)=2$ et $g'(-1)=-3$, combien vaut $(g^{-1})'(2)$ ?", "$-1/3$", 70),
    t("successive-derivatives", "Dérivées successives", "6-7", "I-5", "On note $f^{(n)}$ la dérivée d’ordre $n$ et on la calcule en dérivant successivement tant que cela est possible.", "Un polynôme de degré $p$ a une dérivée d’ordre $p+1$ identiquement nulle.", String.raw`f^{(n+1)}=(f^{(n)})'`, "Pour $f(x)=x^3-2x^2+3$, quelle est la quatrième dérivée ?", "$f^{(4)}(x)=0$.", 60),
    t("finite-increments", "Inégalité des accroissements finis", "7", "I-6. Accroissements finis", "Un encadrement de $f'$ sur $[a;b]$ donne un encadrement de l’accroissement $f(b)-f(a)$.", "Intégrer mentalement les bornes de la dérivée sur la longueur $b-a$.", String.raw`m(b-a)\le f(b)-f(a)\le M(b-a)`, "Quelle fonction permet d’encadrer $\\sqrt{19}-\\sqrt{17}$ dans le cours ?", "$f(x)=\\sqrt x$.", 75),
    t("lipschitz-bound", "Majoration d’un accroissement", "7-8", "I-6. Propriété 2", "Si $|f'|\\le M$ sur un intervalle, alors $f$ est $M$-lipschitzienne : l’écart des images est contrôlé par celui des antécédents.", "Pour le cosinus, $|-\\sin t|\\le1$.", String.raw`|f(b)-f(a)|\le M|b-a|`, "Quelle inégalité en déduit-on pour le cosinus ?", "$|\\cos x-\\cos y|\\le|x-y|$.", 80, "challenge"),
  ],
});

export const terminalCSpaceGeometryPath = buildOfficialMathPath({
  id: "terminale-c-math-l05-space-analytic-geometry", levelIds, chapterNumber: 5, themeNumber: 2,
  themeTitle: "Géométrie", title: "Géométrie analytique de l’espace",
  description: "Plans, droites et positions relatives dans un repère orthonormé de l’espace.",
  outcomes: ["Écrire les équations d’un plan et d’une droite", "Étudier les positions relatives", "Calculer intersections et distances"],
  documentTitle: "TC Maths leçon 05 Géometrie analytique de lespace.pdf",
  topics: [
    t("plane-normal-vector", "Vecteur normal à un plan", "1-2", "I-1. Plans", "Un vecteur non nul est normal à un plan s’il est orthogonal à deux directions non colinéaires de ce plan.", "Le plan passant par $A$ et de normal $\\vec n$ est l’ensemble des $M$ tels que $\\overrightarrow{AM}\\cdot\\vec n=0$.", String.raw`M\in(P)\Longleftrightarrow\overrightarrow{AM}\cdot\vec n=0`, "Dans le cube officiel, quel plan passe par $H$ et a $\\overrightarrow{AB}$ pour normal ?", "Le plan $(ADE)$.", 55),
    t("plane-cartesian-equation", "Équation cartésienne d’un plan", "2-3", "II-2. Équations cartésiennes", "Dans un repère orthonormé, un plan de normal $(a,b,c)$ possède une équation $ax+by+cz+d=0$.", "Remplacer les coordonnées d’un point du plan permet de calculer $d$.", String.raw`(P):ax+by+cz+d=0`, "Quelle équation a le plan passant par $O$ et de normal $(1,-2,-3)$ ?", "$x-2y-3z=0$.", 60),
    t("line-parametric-form", "Représentation paramétrique d’une droite", "3-4", "II. Droites", "Une droite passant par $A(x_0,y_0,z_0)$ et dirigée par $(a,b,c)$ se paramètre avec un réel $\\lambda$.", "Chaque coordonnée est affine en un même paramètre.", String.raw`x=x_0+a\lambda,\ y=y_0+b\lambda,\ z=z_0+c\lambda`, "Quelle représentation convient à la droite passant par $(2,3,0)$ et dirigée par $(-1,-1,1)$ ?", "$x=2-\\lambda,\\ y=3-\\lambda,\\ z=\\lambda$.", 60),
    t("relative-lines-space", "Positions relatives de deux droites", "4-7", "III-1", "Deux droites sont parallèles lorsque leurs directions sont colinéaires. Sinon, elles sont sécantes si leurs systèmes ont une solution commune, et non coplanaires dans le cas contraire.", "L’orthogonalité des directions n’impose pas l’intersection dans l’espace.", String.raw`\vec u\parallel\vec v\Longleftrightarrow \vec u=k\vec v`, "Pourquoi les droites $(D)$ et $(D'')$ du cours sont-elles strictement parallèles ?", "Leurs vecteurs directeurs sont colinéaires et leurs abscisses constantes diffèrent.", 70),
    t("line-plane-position", "Position d’une droite et d’un plan", "7-9", "III-2", "On compare le vecteur directeur $\\vec u$ de la droite au vecteur normal $\\vec n$ du plan. Un produit scalaire non nul impose une intersection unique.", "Si $\\vec u\\cdot\\vec n=0$, tester un point pour distinguer inclusion et parallélisme strict.", String.raw`\vec u\cdot\vec n\ne0\Longrightarrow(D)\cap(P)=\{A\}`, "Quel point d’intersection donne l’exercice officiel entre $(D)$ et $(P)$ ?", "$A(1;1;1/2)$.", 75),
    t("relative-planes", "Positions relatives de deux plans", "9-10", "III-3", "Deux plans sont parallèles si leurs normales sont colinéaires. Sinon ils sont sécants suivant une droite, obtenue en résolvant les deux équations avec un paramètre libre.", "Deux plans sont perpendiculaires lorsque leurs vecteurs normaux sont orthogonaux.", String.raw`(P)\perp(P')\Longleftrightarrow\vec n\cdot\vec n'=0`, "Les plans de normales $(2,1,2)$ et $(2,-2,-1)$ sont-ils perpendiculaires ?", "Oui, car leur produit scalaire vaut $0$.", 80, "challenge"),
  ],
});

export const terminalCMathPaths01to05 = [
  terminalCLimitsContinuityPath,
  terminalCBarycenterPath,
  terminalCDivisibilityPath,
  terminalCDerivativesPath,
  terminalCSpaceGeometryPath,
];
