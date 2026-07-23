import { buildOfficialMathPath, officialMathTopic as t } from "./officialMathPathBuilder";
import { terminalCBarycenterPath } from "./terminalCBarycenterPath";
import { terminalCDivisibilityPath } from "./terminalCDivisibilityPath";
import { terminalCDerivativesPath } from "./terminalCDerivativesPath";
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
export { terminalCDerivativesPath };

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
