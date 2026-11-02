import { section, sheet } from "./types";

export default sheet("strong-acid-base", "Acides forts et bases fortes", [441], [
  section("pc-strong-acid", "I", "Monoacide fort", [441], String.raw`
Un monoacide fort réagit pratiquement totalement avec l’eau et fournit un ion oxonium par molécule introduite :
$$\mathrm{HCl+H_2O\to H_3O^++Cl^-}.$$
On écrit de même les réactions de $\mathrm{HBr}$ et $\mathrm{HI}$, qui donnent respectivement $\mathrm{Br^-}$ et $\mathrm{I^-}$.

Pour une concentration apportée $C_a$, si l’autoprotolyse de l’eau est négligeable et si le modèle dilué convient :
$$[\mathrm{H_3O^+}]\simeq C_a,\qquad
pH\simeq-\log C_a,\qquad C_a\simeq10^{-pH}.$$
Le domaine scolaire indicatif est $10^{-6}\le C_a\le10^{-1}\ \mathrm{mol\,L^{-1}}$. À très faible concentration, il faut tenir compte de l’eau : la dilution ne permet pas de rendre basique une solution contenant seulement un acide et de l’eau.
`),
  section("pc-strong-base", "II", "Monobase forte", [441], String.raw`
Une monobase forte apporte pratiquement un ion hydroxyde par formule dissoute. Exemples :
$$\mathrm{NaOH\to Na^++OH^-},\qquad
\mathrm{KOH\to K^++OH^-}.$$
L’ion **éthanolate** réagit aussi avec l’eau :
$$\mathrm{C_2H_5O^-+H_2O\to C_2H_5OH+OH^-}.$$
Il peut être obtenu selon le bilan :
$$\mathrm{2C_2H_5OH+2Na\to2C_2H_5O^-+2Na^++H_2}.$$

Si l’eau est négligeable et la dissolution complète :
$$[\mathrm{OH^-}]\simeq C_b,\qquad pH\simeq pK_e+\log C_b.$$
À25°C, $pH\simeq14+\log C_b$, dans le domaine scolaire indicatif $10^{-6}\le C_b\le10^{-1}\ \mathrm{mol\,L^{-1}}$.
`),
  section("pc-strong-multiple", "III", "Bien compter les protons et les ions hydroxyde", [441], String.raw`
Pour une espèce fournissant **totalement deux protons**, avec les mêmes hypothèses :
$$[\mathrm{H_3O^+}]\simeq2C_a,\qquad pH\simeq-\log(2C_a).$$
Cette formule exige que les **deux** acidités soient considérées totales. Pour l’acide sulfurique, la première réaction est totale mais la seconde dépend des conditions :
$$\mathrm{H_2SO_4+H_2O\to H_3O^++HSO_4^-},$$
$$\mathrm{HSO_4^-+H_2O\rightleftharpoons H_3O^++SO_4^{2-}}.$$
On n’utilise donc pas automatiquement $2C_a$ pour toute solution de $\mathrm{H_2SO_4}$.

Pour l’hydroxyde de calcium effectivement dissous :
$$\mathrm{Ca(OH)_2\to Ca^{2+}+2OH^-}.$$
Si $C_b$ est la concentration dissoute et que l’eau est négligeable :
$$[\mathrm{OH^-}]\simeq2C_b,\qquad pH\simeq pK_e+\log(2C_b).$$
On distingue toujours concentration du composé et concentration de l’ion qui fixe le pH.
`),
], [
  "Fiche441 uniquement ; exercices442 non importés.",
  "Éthanolate C2H5O− et non éthanoate ; charges Na+/K+ rétablies.",
  "Double acidité H2SO4 non déclarée universellement totale ; formules conditionnées aux concentrations et aux approximations.",
]);
