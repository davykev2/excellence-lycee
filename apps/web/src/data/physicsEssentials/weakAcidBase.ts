import { section, sheet } from "./types";

const bronsted = section("pc-weak-bronsted", "I", "Acide, base et espèces conjuguées", [448], String.raw`
Selon Brønsted, un acide peut céder un proton $\mathrm{H^+}$ ; une base peut en capter un. Deux formes qui diffèrent d’un seul proton constituent un couple acide/base :
$$\mathrm{AH/A^-}\qquad\text{ou}\qquad\mathrm{BH^+/B}.$$
L’écriture formelle $\mathrm{AH\rightleftharpoons A^-+H^+}$ décrit le couple ; dans l’eau, le proton est transféré à une molécule d’eau et se retrouve dans $\mathrm{H_3O^+}$.
`);
const acidBase = section("pc-weak-reactions", "II", "Réactions limitées avec l’eau", [448], String.raw`
Un acide faible réagit partiellement avec l’eau :
$$\mathrm{AH+H_2O\rightleftharpoons A^-+H_3O^+},$$
$$\mathrm{BH^++H_2O\rightleftharpoons B+H_3O^+}.$$
Une base faible produit des ions hydroxyde par une réaction limitée :
$$\mathrm{B+H_2O\rightleftharpoons BH^++OH^-},$$
$$\mathrm{A^-+H_2O\rightleftharpoons AH+OH^-}.$$

Le coefficient d’ionisation $\alpha$ est la fraction de l’espèce initiale transformée :

| Solution initiale seule | Expression |
|---|---|
| Acide AH de concentration $C_a$ | $\alpha=[\mathrm{A^-}]/C_a\simeq10^{-pH}/C_a$ |
| Base B de concentration $C_b$ | $\alpha=[\mathrm{BH^+}]/C_b\simeq10^{pH-pK_e}/C_b$ |

Les approximations avec le pH supposent que les ions issus de l’eau sont négligeables devant ceux produits par la réaction. $\alpha$ est compris entre0 et1.
`);
const ka = section("pc-weak-ka", "III", "Constante d’acidité et pH", [448], String.raw`
Pour le couple acide/base, à température donnée et dans le modèle dilué :
$$K_a=\frac{[\mathrm{Base}][\mathrm{H_3O^+}]}{[\mathrm{Acide}]},
\qquad pK_a=-\log K_a,\qquad K_a=10^{-pK_a}.$$
En prenant le logarithme :
$$pH=pK_a+\log\frac{[\mathrm{Base}]}{[\mathrm{Acide}]}.$$
On utilise les concentrations **à l’équilibre**, pas automatiquement les concentrations initiales.

| Comparaison | Espèce prédominante |
|---|---|
| $pH<pK_a$ | Forme acide |
| $pH=pK_a$ | Deux formes en concentrations égales |
| $pH>pK_a$ | Forme basique |

L’écart $pH-pK_a$ donne directement le rapport base/acide par $10^{pH-pK_a}$.
`, "predominance");
const strength = section("pc-weak-strength", "IV", "Comparer les forces", [449], String.raw`
À même température et dans le même solvant :

- Plus $K_a$ est grand, ou $pK_a$ petit, plus l’acide du couple est fort.
- Plus l’acide est faible, plus sa base conjuguée est forte : pour comparer les bases, on compare donc les $pK_a$ de leurs **acides conjugués**.
- À même concentration, pour les solutions simples étudiées, l’acide le plus fort donne le pH le plus bas ; la base la plus forte donne le pH le plus haut.
- À même concentration, la forme qui réagit le plus avec l’eau présente le coefficient d’ionisation le plus élevé.

Sans concentrations égales, le seul pH ne permet pas de comparer directement les forces.
`);
export const indicatorSection = section("pc-weak-indicators", "V", "Indicateurs colorés", [449], String.raw`
Un indicateur possède une forme acide et une forme basique de couleurs différentes. Sa zone de virage est l’intervalle où la couleur change.

| Indicateur | Teinte acide | Zone de virage | Teinte basique |
|---|---|---|---|
| Hélianthine | Rouge | 3,1–4,4, orangé | Jaune |
| Rouge de méthyle | Rouge | 4,2–6,2, orangé | Jaune |
| Bleu de bromothymol | Jaune | 6,0–7,6, vert | Bleu |
| Phénolphtaléine | Incolore | 8,2–10, rose pâle | Rose |

Pour un titrage, la zone de virage doit se situer dans le saut de pH et permettre de repérer l’équivalence avec une petite erreur de volume.
`);
const conservation = section("pc-weak-matter", "VI", "Conserver la matière dans un couple", [449,450], String.raw`
Les formes conjuguées se transforment l’une en l’autre ; leur somme se conserve si aucune autre réaction n’intervient.

| Solution | Conservation |
|---|---|
| Acide éthanoïque apporté à $C_a$ | $C_a=[\mathrm{CH_3COOH}]+[\mathrm{CH_3COO^-}]$ |
| Chlorure d’ammonium apporté à $C_a$ | $C_a=[\mathrm{NH_4^+}]+[\mathrm{NH_3}]$ |
| Méthanoate de sodium apporté à $C_b$ | $C_b=[\mathrm{HCOOH}]+[\mathrm{HCOO^-}]$ |
| Ammoniac apporté à $C_b$ | $C_b=[\mathrm{NH_4^+}]+[\mathrm{NH_3}]$ |

Lors d’un mélange, on divise la quantité totale de matière du couple par le volume total $V=V_a+V_b$, si les volumes sont supposés additifs :

| Mélange | Somme des formes du couple après mélange |
|---|---|
| Acide faible $C_a,V_a$ + base forte $V_b$ | $[\mathrm{AH}]+[\mathrm{A^-}]=C_aV_a/V$ |
| Base faible $C_b,V_b$ + acide fort $V_a$ | $[\mathrm B]+[\mathrm{BH^+}]=C_bV_b/V$ |
| Acide et base conjugués, $C_a,V_a$ et $C_b,V_b$ | $[\mathrm{Acide}]+[\mathrm{Base}]=(C_aV_a+C_bV_b)/V$ |

Exemples : acide benzoïque/potasse ; méthylamine/acide bromhydrique ; acide éthanoïque/éthanoate de sodium. Ces relations donnent une **somme**, pas séparément chaque concentration.
`);
const notes = [
  "Fiches448–450, exercice451 exclu. Sections communes partagées entre les deux cartes faibles/couples.",
  "Coefficient de base10^(pH−pKe), non pH−pKa ; Ka=10^(−pKa). Réactions et charges BH+/A− uniformisées.",
  "Indicateur rouge de méthyle : couleur de transition orangée ; base forte via pKa de l’acide conjugué explicitée.",
];
export default sheet("weak-acid-base", "Acides faibles et bases faibles", [448,449,450], [bronsted,acidBase,ka,conservation], notes);
export const couplesSheet = sheet("acid-base-couples", "Couples acide/base et classification", [448,449,450], [bronsted,ka,strength,indicatorSection,conservation], notes);
