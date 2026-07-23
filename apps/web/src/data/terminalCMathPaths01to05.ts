import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";
import { terminalCBarycenterPath } from "./terminalCBarycenterPath";
import { terminalCDivisibilityPath } from "./terminalCDivisibilityPath";
import { terminalCLimitsContinuityPath } from "./terminalCLimitsContinuityPath";

const levelIds = ["terminale-c"];

// La leçon 01 est rédigée en toutes lettres dans son propre fichier, sur le modèle
// de la leçon 01 de Terminale A : contenu fidèle enrichi, exercices multiples et
// courbes interactives. Les identifiants et les poids de progression y sont
// conservés à l'identique, afin que la répartition des 10 000 XP et le registre
// XP de l'API restent inchangés.
export { terminalCLimitsContinuityPath };
export { terminalCBarycenterPath };
export { terminalCDivisibilityPath };

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
