import { section, sheet } from "./types";
import { matterReminder, combustionReminder } from "./organicBasics";

const oxidation = section("pc-alcohol-oxidation", "VI", "Oxydation ménagée et nature du produit", [375,376], String.raw`
Une oxydation ménagée conserve le squelette carboné de la molécule.

| Classe de l’alcool | Produit de l’oxydation ménagée |
|---|---|
| Primaire | Aldéhyde, puis acide carboxylique si l’oxydation se poursuit |
| Secondaire | Cétone |
| Tertiaire | Pas d’oxydation ménagée dans les conditions étudiées |

**Éthanol :**
$$\mathrm{CH_3CH_2OH}+\frac12\mathrm{O_2}
\to\mathrm{CH_3CHO+H_2O},$$
$$\mathrm{CH_3CHO}+\frac12\mathrm{O_2}\to\mathrm{CH_3COOH}.$$
L’oxydation par le dioxygène peut être catalysée par le cuivre ou le platine.

En milieu aqueux acide, les oxydants usuels sont l’ion dichromate et l’ion permanganate :
$$\mathrm{Cr_2O_7^{2-}+14H^++6e^-\to2Cr^{3+}+7H_2O},$$
$$\mathrm{MnO_4^-+8H^++5e^-\to Mn^{2+}+4H_2O}.$$
Ils proviennent par exemple de la dissolution de $\mathrm{K_2Cr_2O_7}$ et de $\mathrm{KMnO_4}$ :
$$\mathrm{K_2Cr_2O_7\to2K^++Cr_2O_7^{2-}},\qquad
\mathrm{KMnO_4\to K^++MnO_4^-}.$$
Pour écrire une équation d’oxydoréduction, on équilibre les deux demi-équations puis on élimine les électrons.
`);

const carbonyl = section("pc-carbonyl-identify", "I", "Aldéhydes et cétones", [376], String.raw`
Ces deux familles possèdent un groupe **carbonyle** $\mathrm{C=O}$.

| Famille | Groupe caractéristique | Nomenclature et exemples |
|---|---|---|
| Aldéhyde | $\mathrm{R{-}CHO}$, carbonyle en bout de chaîne | Suffixe **-al** : méthanal $\mathrm{HCHO}$, éthanal $\mathrm{CH_3CHO}$ |
| Cétone | $\mathrm{R{-}CO{-}R'}$, carbonyle entre deux carbones | Suffixe **-one** : propanone $\mathrm{CH_3COCH_3}$ ; pentan-3-one $\mathrm{CH_3CH_2COCH_2CH_3}$ |

Pour un composé saturé, acyclique, à un seul groupe carbonyle, la formule brute est $\mathrm{C_nH_{2n}O}$. Un aldéhyde existe dès $n=1$, une cétone à partir de $n=3$.

On choisit la chaîne contenant le carbonyle et on la numérote pour donner le plus petit indice à ce groupe. Dans un aldéhyde, le carbone du groupe $\mathrm{-CHO}$ est le carbone 1.

**Exemple ramifié :**
$$\mathrm{CH_3CH_2CH(CH_3)CH(CH_2CH_3)CH_2CH_2CHO}$$
se nomme **4-éthyl-5-méthylheptanal** : la chaîne principale possède sept carbones ; les substituants sont en 4 et 5.
`);
const tests = section("pc-carbonyl-tests", "II", "Identifier la fonction par les tests", [376], String.raw`
| Réactif | Observation positive | Interprétation dans les cas étudiés |
|---|---|---|
| 2,4-DNPH | Précipité jaune à orangé | Présence d’un aldéhyde ou d’une cétone |
| Réactif de Schiff | Coloration rose | Aldéhyde |
| Liqueur de Fehling, à chaud | Précipité rouge brique | Aldéhyde réducteur |
| Réactif de Tollens | Dépôt ou miroir d’argent | Aldéhyde réducteur |

La DNPH seule ne distingue pas les deux familles. Pour les composés simples étudiés, DNPH positive et Schiff positive orientent vers un aldéhyde ; DNPH positive et tests d’aldéhyde négatifs orientent vers une cétone.
`, "carbonyl");

export default sheet("alcohols", "Alcools", [372,373,374,375,376], [
  matterReminder, combustionReminder,
  section("pc-alcohol-identify", "III", "Reconnaître, classer et nommer un alcool", [374], String.raw`
Un alcool possède un groupe **hydroxyle** $\mathrm{-OH}$ lié à un carbone saturé. Pour un monoalcool saturé acyclique, la formule est $\mathrm{C_nH_{2n+1}OH}$, soit $\mathrm{C_nH_{2n+2}O}$.

| Classe | Carbone portant OH lié à… | Forme et exemple |
|---|---|---|
| Primaire | Un autre carbone ; le méthanol constitue le cas à zéro | $\mathrm{RCH_2OH}$ : éthanol $\mathrm{CH_3CH_2OH}$ |
| Secondaire | Deux carbones | $\mathrm{RCH(OH)R'}$ : butan-2-ol $\mathrm{CH_3CH(OH)CH_2CH_3}$ |
| Tertiaire | Trois carbones | $\mathrm{R_3COH}$ : 2-méthylpropan-2-ol $\mathrm{(CH_3)_3COH}$ |

Pour nommer : on choisit la plus longue chaîne contenant le carbone fonctionnel, on la numérote en donnant le plus petit indice à OH et on utilise le suffixe **-ol**.

**Exemple :** $\mathrm{CH_3CH_2CH(OH)CH(CH_3)CH_2CH_3}$ est le **4-méthylhexan-3-ol**.

Un polyol possède plusieurs groupes hydroxyles. Exemples :

- Éthane-1,2-diol, ou glycol : $\mathrm{HOCH_2CH_2OH}$.
- Propane-1,2,3-triol, ou glycérol : $\mathrm{HOCH_2CH(OH)CH_2OH}$.
`),
  section("pc-alcohol-preparation", "IV", "Obtenir un alcool", [374,375], String.raw`
**Fermentation alcoolique du glucose :**
$$\mathrm{C_6H_{12}O_6\to2C_2H_5OH+2CO_2}.$$

**Hydratation d’un alcène :** de l’eau s’ajoute sur la double liaison, sous catalyse acide.

- But-2-ène, symétrique :
$$\mathrm{CH_3CH{=}CHCH_3+H_2O\to CH_3CH(OH)CH_2CH_3}.$$
- Propène, dissymétrique : le produit majoritaire est le propan-2-ol $\mathrm{CH_3CH(OH)CH_3}$, plutôt que le propan-1-ol.

Dans les cas simples étudiés, la règle de Markovnikov place majoritairement H sur le carbone de la double liaison qui porte déjà le plus d’hydrogènes, et OH sur l’autre carbone.
`),
  section("pc-alcohol-reactions", "V", "Déshydratation, sodium et combustion", [375], String.raw`
**Déshydratation intramoléculaire :** sous l’action de l’alumine vers $350\,^\circ\mathrm C$, un alcool approprié peut perdre une molécule d’eau et donner un alcène :
$$\mathrm{CH_3CH_2OH\to CH_2{=}CH_2+H_2O}.$$

**Réaction avec le sodium :** formation d’un alcoolate et de dihydrogène :
$$\mathrm{2ROH+2Na\to2RO^-+2Na^++H_2}.$$
Pour l’éthanol, $\mathrm{R=CH_3CH_2}$. Cette écriture est un bilan chimique, pas une consigne de manipulation.

**Combustion complète d’un monoalcool saturé acyclique :**
$$\mathrm{C_nH_{2n+2}O}+\frac{3n}{2}\mathrm{O_2}
\to n\mathrm{CO_2}+(n+1)\mathrm{H_2O}.$$
Contrairement à l’oxydation ménagée, la combustion ne conserve pas la structure de la molécule organique.
`), oxidation,
], [
  "Rappels372–373 et cours374–376 ; exercice377 non importé. Les carbonyles de376 ont leur propre carte, à partir des mêmes sections.",
  "Rappel : %H au dénominateur de la relation de masse molaire, coefficient O2 x+y/4−z/2 et CO2 dans le bilan, rendement obtenu/théorique.",
  "Hydroxyle non hydroxyde ; glycol éthane-1,2-diol et alcool tertiaire (CH3)3COH rétablis, sans carbones pentavalents.",
  "Markovnikov énoncé en placement H/OH, pas comme règle universelle de classe la plus élevée ; oxydation tertiaire limitée aux conditions ménagées.",
]);
export const carbonylSheet = sheet("carbonyl", "Composés carbonylés", [375,376], [carbonyl,tests,oxidation], [
  "Les définitions et tests de376 ainsi que l’oxydation375–376 sont réutilisés depuis le chapitre Alcools.",
  "Nom ramifié corrigé en4-éthyl-5-méthylheptanal ; formule CnH2nO limitée aux familles saturées acycliques monocarbonylées.",
]);
