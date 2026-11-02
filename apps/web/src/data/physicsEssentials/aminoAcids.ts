import { section, sheet } from "./types";

export default sheet("alpha-amino-acids", "Acides α-aminés et peptides", [426,427], [
  section("pc-amino-definition", "I", "Structure et nomenclature", [426], String.raw`
Dans un acide α-aminé, le groupe amine est porté par le carbone voisin du groupe carboxyle, appelé carbone α. Pour les exemples usuels :
$$\mathrm{NH_2{-}CH(R){-}COOH}.$$
Le groupe $\mathrm{-COOH}$ est acide et le groupe amine peut accepter un proton.

| Formule | Nom systématique | Nom usuel |
|---|---|---|
| $\mathrm{NH_2CH_2COOH}$ | Acide2-aminoéthanoïque | Glycine, Gly |
| $\mathrm{NH_2CH(CH_3)COOH}$ | Acide2-aminopropanoïque | Alanine, Ala |
| $\mathrm{NH_2CH(CH_2C_6H_5)COOH}$ | Acide2-amino-3-phénylpropanoïque | Phénylalanine, Phe |

Les protéines courantes utilisent vingt acides aminés principaux. Certains, comme la glycine et l’alanine, peuvent être synthétisés par l’organisme ; d’autres, comme la phénylalanine, doivent être apportés par l’alimentation et sont dits essentiels.
`),
  section("pc-amino-forms", "II", "Ampholyte et formes selon le milieu", [426,427], String.raw`
Un acide aminé peut agir comme un acide ou comme une base : c’est un **ampholyte**. Pour une chaîne latérale R sans fonction ionisable, on distingue :

| Forme | Écriture | Charge totale |
|---|---|---|
| Cationique | $\mathrm{NH_3^+{-}CH(R){-}COOH}$ | $+1$ |
| Zwitterion, ou amphion | $\mathrm{NH_3^+{-}CH(R){-}COO^-}$ | $0$ |
| Anionique | $\mathrm{NH_2{-}CH(R){-}COO^-}$ | $-1$ |

Le zwitterion porte deux charges opposées, même si sa charge totale est nulle. Il est important en solution aqueuse ; la forme prédominante dépend du pH et des deux acidités du composé.

**En milieu suffisamment acide**, l’amphion capte un proton :
$$\mathrm{NH_3^+CH(R)COO^-+H_3O^+
\rightleftharpoons NH_3^+CH(R)COOH+H_2O}.$$

**En milieu suffisamment basique**, il cède un proton :
$$\mathrm{NH_3^+CH(R)COO^-+OH^-
\rightleftharpoons NH_2CH(R)COO^-+H_2O}.$$
On rencontre donc les couples cation/amphion et amphion/anion.
`, "amino-forms"),
  section("pc-amino-peptide", "III", "Liaison peptidique et sens de lecture", [427], String.raw`
La condensation de deux acides aminés peut former une liaison amide $\mathrm{-CO-NH-}$ avec élimination d’une molécule d’eau. La liaison C–N de ce groupe est la **liaison peptidique**.
$$\mathrm{NH_2CH(R)COOH+NH_2CH(R')COOH}$$
$$\mathrm{\longrightarrow NH_2CH(R)CONHCH(R')COOH+H_2O}.$$
Cette équation est un bilan de condensation ; elle ne signifie pas qu’un mélange dans l’eau réalise spontanément une synthèse sélective.

Un peptide contient plusieurs résidus d’acides aminés ; une longue chaîne est un polypeptide. Une protéine comporte une ou plusieurs chaînes organisées dans l’espace. Le seuil d’environ50résidus est un repère usuel, pas une frontière chimique stricte.

On lit une séquence de l’extrémité amine, **N-terminale**, vers l’extrémité carboxyle, **C-terminale**.

**Exemple Gly–Ala :**
$$\mathrm{NH_2CH_2COOH+NH_2CH(CH_3)COOH}$$
$$\mathrm{\longrightarrow NH_2CH_2CONHCH(CH_3)COOH+H_2O}.$$
Gly–Ala et Ala–Gly ne désignent pas le même dipeptide : l’ordre compte.
`),
  section("pc-amino-hydrolysis", "IV", "Hydrolyse d’un peptide", [427], String.raw`
L’hydrolyse rompt la liaison peptidique en consommant de l’eau. Le bilan de Gly–Ala vers ses deux acides aminés est :
$$\mathrm{NH_2CH_2CONHCH(CH_3)COOH+H_2O}$$
$$\mathrm{\longrightarrow NH_2CH_2COOH+NH_2CH(CH_3)COOH}.$$
Une hydrolyse complète d’un peptide linéaire de $n$ résidus rompt $n-1$ liaisons peptidiques et consomme $n-1$ molécules d’eau. Les formes ioniques finales dépendent du milieu.
`),
], [
  "Pages426–427 seulement, exercice428 exclu ; carte D uniquement conformément au programme existant.",
  "Phénylalanine et groupe NH2 corrigés ; définition par carbone α voisin du carboxyle.",
  "Prédominance liée au pH/pKa et chaîne R non ionisable, pas tout milieu acide/basique arbitraire. Seuil protéine50 indicatif.",
], ["terminale-d"]);
