import { section, sheet } from "./types";

export default sheet("amines", "Amines", [386,387], [
  section("pc-amines-families", "I", "Définition et classes", [386], String.raw`
Une amine dérive formellement de l’ammoniac $\mathrm{NH_3}$ : un, deux ou trois hydrogènes sont remplacés par des groupes carbonés, alkyles ou aryles.

| Classe | Groupes carbonés sur N | Hydrogènes sur N | Exemple |
|---|---|---|---|
| Primaire | 1 | 2 | $\mathrm{CH_3NH_2}$, méthylamine |
| Secondaire | 2 | 1 | $\mathrm{CH_3CH_2NHCH_3}$ |
| Tertiaire | 3 | 0 | $\mathrm{CH_3CH_2N(CH_3)_2}$ |

La formule $\mathrm{C_nH_{2n+3}N}$ concerne les monoamines saturées acycliques. Elle ne s’applique pas à la phénylamine, ou aniline, $\mathrm{C_6H_5NH_2}$.
`),
  section("pc-amines-names", "II", "Nomenclature", [386], String.raw`
Pour une amine primaire, on choisit la chaîne principale et on donne au groupe amine le plus petit indice : par exemple **butan-2-amine**, $\mathrm{CH_3CH(NH_2)CH_2CH_3}$.

Pour les autres classes, on peut utiliser les noms des groupes alkyles suivis d’« amine ». Les préfixes di- et tri- indiquent des groupes identiques : diméthylamine $\mathrm{(CH_3)_2NH}$, triéthylamine $\mathrm{(C_2H_5)_3N}$.

Dans la nomenclature avec une chaîne principale, les autres substituants portés par l’azote sont précédés de **N-** :

- $\mathrm{CH_3CH_2NHCH_3}$ : N-méthyléthanamine.
- $\mathrm{CH_3CH_2N(CH_3)_2}$ : N,N-diméthyléthanamine.

Le préfixe N- indique une substitution sur l’azote, pas sur un carbone.
`),
  section("pc-amines-reactivity", "III", "Basicité et caractère nucléophile", [386,387], String.raw`
L’azote d’une amine porte un doublet **non liant** qui peut capter un proton :
$$\mathrm{RNH_2+H_3O^+\to RNH_3^++H_2O}.$$
En solution aqueuse, une amine est une base faible :
$$\mathrm{RNH_2+H_2O\rightleftharpoons RNH_3^++OH^-}.$$

Un **nucléophile** peut donner un doublet électronique à un centre pauvre en électrons, dit **électrophile**. Dans $\mathrm{CH_3I}$, le carbone lié à l’iode est un tel centre.

Une amine tertiaire peut fixer un groupe alkyle et former un ion ammonium quaternaire. L’exemple avec l’iodure d’éthyle est :
$$\mathrm{(C_2H_5)_3N+C_2H_5I
\to(C_2H_5)_4N^++I^-}.$$
Les quatre groupes éthyles sont désormais liés à l’azote, qui porte une charge positive.
`),
], [
  "Pages386–387 uniquement ; exercice388 exclu. Carte réservée à D conformément au catalogue, sans ajout en C.",
  "Doublet non liant rétabli ; formule brute limitée aux amines saturées acycliques.",
  "Réaction de quaternisation écrite avec l’iodure d’éthyle comme dans l’équation source, malgré le titre annonçant méthyle.",
], ["terminale-d"]);
