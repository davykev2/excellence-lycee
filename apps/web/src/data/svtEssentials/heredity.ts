import { cd, section, sheet } from "./types";

export default sheet("human-heredity", "La transmission d’un caractère héréditaire", cd, [
  section("svt-genetics-vocabulary", "Du gène au phénotype", [671,672], String.raw`
Un **gène** est une région d’ADN dont l’expression contribue à une fonction. Ses différentes versions sont des **allèles**. Une mutation modifie l’ADN ; elle ne provoque pas toujours un changement visible.

| Terme | Définition |
| --- | --- |
| Génotype | Composition allélique pour les gènes étudiés |
| Phénotype | Caractères observables, y compris moléculaires, résultant du génotype et de son contexte |
| Homozygote | Deux allèles identiques au locus considéré |
| Hétérozygote | Deux allèles différents au locus considéré |
| Lignée pure | Lignée homozygote pour les gènes étudiés dans le modèle |

En **dominance complète**, le phénotype de l’hétérozygote correspond à celui de l’un des homozygotes. En **dominance incomplète**, il est intermédiaire. En **codominance**, les deux produits alléliques sont mis en évidence.

Un allèle de référence, parfois dit sauvage, n’est pas nécessairement dominant. Dominant ne signifie ni plus fréquent, ni meilleur, ni plus fort.`),
  section("svt-monohybrid-method", "Construire un croisement", [672,673], String.raw`
1. Décrire les phénotypes et proposer une relation de dominance compatible.
2. Choisir une notation des allèles.
3. Écrire les génotypes parentaux et les gamètes possibles.
4. Combiner les gamètes dans un échiquier.
5. Distinguer proportions génotypiques et phénotypiques.

| Croisement | Génotypes attendus | Phénotypes si A domine complètement a |
| --- | --- | --- |
| $AA\times aa$ | Tous $Aa$ | Tous dominants |
| $Aa\times Aa$ | $\frac14AA,\frac12Aa,\frac14aa$ | $\frac34$ dominants, $\frac14$ récessifs |
| $Aa\times aa$ | $\frac12Aa,\frac12aa$ | $\frac12$ dominants, $\frac12$ récessifs |

Le **test-cross** utilise un partenaire homozygote récessif pour renseigner sur les gamètes de l’autre parent. Le **back-cross** est un croisement avec un parent ou un individu de même génotype parental : les deux termes ne sont pas toujours synonymes.

Ce sont des probabilités théoriques. Dans une petite descendance, les effectifs ne sont pas nécessairement des multiples exacts de ces proportions.`, "punnett"),
  section("svt-pedigree", "Interpréter un arbre généalogique", [672,673], String.raw`
On repère les générations, les sexes et les phénotypes, puis on attribue des génotypes compatibles à **tous** les individus.

| Hypothèse | Indice à examiner |
| --- | --- |
| Autosomique récessive | Deux parents non atteints peuvent avoir un enfant atteint |
| Autosomique dominante | Transmission verticale souvent observée |
| Liée à X récessive | Pas de transmission père–fils par X ; des garçons expriment l’allèle reçu de leur mère |
| Liée à Y | Transmission père–fils pour le locus concerné |

Un indice isolé n’est pas une preuve. L’interprétation dépend notamment de la pénétrance, de l’absence supposée de nouvelle mutation et des informations disponibles.

Un caractère présent dans les deux sexes n’est pas nécessairement autosomique. Pour un locus de X hors des régions homologues X/Y, le garçon ne possède pas un second allèle de ce locus sur Y ; cela ne signifie pas que Y ne porte aucun gène.`),
  section("svt-sickle-cell", "Drépanocytose : molécule et maladie", [673,674], String.raw`
L’hémoglobine S présente une substitution de **l’acide glutamique par une valine**, à la position étudiée de la chaîne $\beta$ mature.

| Génotype du modèle | Hémoglobines détectables | Interprétation |
| --- | --- | --- |
| $AA$ | HbA | Pas d’allèle S dans ce modèle |
| $AS$ | HbA et HbS | Les deux produits sont présents |
| $SS$ | HbS | Forme de drépanocytose du modèle simplifié |

Au niveau moléculaire, l’hétérozygote produit HbA et HbS : c’est une **codominance d’expression**. Pour le phénotype de la maladie dans le modèle scolaire, S est traité comme récessif.

Pour $AS\times AS$, chaque grossesse comporte théoriquement $\frac14AA$, $\frac12AS$ et $\frac14SS$. Ces probabilités se renouvellent à chaque conception ; elles n’imposent pas une répartition par groupes de quatre naissances.

La maladie comporte plusieurs formes et une prise en charge adaptée. Un génotype ne fixe pas une durée de vie individuelle.`),
  section("svt-abo", "Le système ABO", [674], String.raw`
Le modèle utilise trois allèles principaux : $I^A$, $I^B$ et $i$. $I^A$ et $I^B$ sont codominants entre eux et dominent $i$.

| Groupe | Génotype(s) | Antigènes des hématies |
| --- | --- | --- |
| A | $I^AI^A$ ou $I^Ai$ | A |
| B | $I^BI^B$ ou $I^Bi$ | B |
| AB | $I^AI^B$ | A et B |
| O | $ii$ | Ni A ni B |

Les antigènes de surface ne sont pas les anticorps du plasma. Les allèles A et B permettent la formation d’antigènes différents par l’action d’enzymes.

**Exemple :** $I^Ai\times I^Bi$ peut donner A, B, AB ou O, chacun avec une probabilité de $\frac14$.

Un groupe peut exclure certaines filiations sous les hypothèses usuelles, mais ne suffit pas à prouver une paternité. Ce tableau génétique n’est pas un guide de transfusion.`, "abo"),
], [
  "Cours pages 671–674. Dominance incomplète/codominance, test-cross/back-cross et probabilités distingués.",
  "Drépanocytose : bêta Glu→Val ; codominance moléculaire distincte du phénotype scolaire récessif ; pas de pronostic individuel.",
  "ABO : antigènes/anticorps distingués, pas de guide transfusionnel ; pedigrees interprétés avec hypothèses.",
]);
