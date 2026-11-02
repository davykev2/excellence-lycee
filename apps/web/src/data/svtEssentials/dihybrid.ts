import { d, section, sheet } from "./types";

export default sheet("two-trait-heredity", "La transmission de deux caractères héréditaires", d, [
  section("svt-dihybrid-method", "Analyser séparément, puis réunir", [691], String.raw`
Le **dihybridisme** étudie deux caractères simultanément. On analyse d’abord chacun séparément, puis on recherche si les associations observées correspondent à une ségrégation indépendante.

Pour les loci $A/a$ et $B/b$, un double hétérozygote est noté $AaBb$. Sous indépendance, il forme $AB$, $Ab$, $aB$ et $ab$ avec une probabilité de $\frac14$ chacun.

L’indépendance peut résulter de localisations sur des chromosomes différents. Des loci éloignés sur un même chromosome peuvent aussi présenter une fréquence de recombinaison proche de $\frac12$.

**On multiplie les probabilités seulement lorsque l’hypothèse d’indépendance est justifiée.**`),
  section("svt-independent-proportions", "Le système branché", [691,692], String.raw`
| Proportions pour A/a | Proportions pour B/b | Associations AB / Ab / aB / ab |
| --- | --- | --- |
| $\frac34:\frac14$ | $\frac34:\frac14$ | $\frac9{16}:\frac3{16}:\frac3{16}:\frac1{16}$ |
| $\frac12:\frac12$ | $\frac12:\frac12$ | $\frac14:\frac14:\frac14:\frac14$ |
| $\frac34:\frac14$ | $\frac12:\frac12$ | $\frac38:\frac38:\frac18:\frac18$ |

La première ligne correspond notamment à $AaBb\times AaBb$ avec dominance complète aux deux loci. La deuxième correspond au test-cross $AaBb\times aabb$ sous indépendance.

$$P([AB])=\frac34\times\frac34=\frac9{16}.$$

Pour un effectif total $N$, l’effectif théorique de cette classe est $N\times\frac9{16}$. Une égalité exacte entre nombres observés et théoriques n’est pas exigée : les fluctuations d’échantillonnage doivent être prises en compte.`),
  section("svt-linked-genes", "Liaison, cis et trans", [692], String.raw`
Deux loci sur un même chromosome sont liés. Pour un double hétérozygote :

| Disposition | Chromosomes homologues | Gamètes parentaux |
| --- | --- | --- |
| Cis | $AB/ab$ | $AB$ et $ab$ |
| Trans | $Ab/aB$ | $Ab$ et $aB$ |

Un crossing-over entre chromatides non sœurs de chromosomes homologues en prophase I peut produire des associations recombinées.

Les gamètes parentaux se définissent par l’association initiale des allèles, pas par la présence de deux majuscules : en trans, $Ab$ et $aB$ sont parentaux.`, "linkage"),
  section("svt-recombination", "La fréquence de recombinaison", [692], String.raw`
Dans un test-cross informatif :

$$r=\frac{\text{descendants recombinés}}{\text{descendants totaux}},\qquad 0\leq r\leq\frac12.$$

Pour un parent cis $AB/ab$, avec classes symétriques :

| Gamètes | Probabilité de chaque gamète |
| --- | --- |
| Parentaux $AB$ et $ab$ | $\dfrac{1-r}{2}$ |
| Recombinés $Ab$ et $aB$ | $\dfrac r2$ |

Pour $r=0{,}20$, chaque parental représente $40\%$ et chaque recombiné $10\%$. La somme vaut $100\%$.

Pour des loci proches, $100r$ estime une distance en centimorgans. Pour de grandes distances, plusieurs crossing-over peuvent masquer une partie des recombinaisons : la conversion simple n’est plus suffisante.`),
], [
  "Cours pages 691–692 ; proportions 9:3:3:1, 1:1:1:1 et 3:3:1:1 conservées avec hypothèses.",
  "Effectifs observés non exigés identiques aux attendus ; loci liés sur la même paire homologue. r borné à 0,5 ; conversion en distance limitée aux petits intervalles.",
]);
