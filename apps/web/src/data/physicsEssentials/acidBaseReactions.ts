import { section, sheet } from "./types";
import { indicatorSection } from "./weakAcidBase";
import { acidBaseMeasurements } from "../../domain/physicsEssentialModels";

export const acidBaseMeasurementData = acidBaseMeasurements;

const reaction = section("pc-acidbase-reaction", "I", "Réaction acido-basique et neutralisation", [464,467,468], String.raw`
Une réaction acido-basique est un transfert de proton d’un acide vers une base.

| Réactifs | Bilan ionique |
|---|---|
| Acide fort et base forte | $\mathrm{H_3O^++OH^-\to2H_2O}$ |
| Acide faible et base forte | $\mathrm{AH+OH^-\to A^-+H_2O}$ ou $\mathrm{BH^++OH^-\to B+H_2O}$ |
| Base faible et acide fort | $\mathrm{A^-+H_3O^+\to AH+H_2O}$ ou $\mathrm{B+H_3O^+\to BH^++H_2O}$ |

Dans le mélange acide chlorhydrique/soude, $\mathrm{Na^+}$ et $\mathrm{Cl^-}$ sont spectateurs. Le mélange peut s’échauffer : cette neutralisation est exothermique. L’illustration expérimentale passe de 25 °C pour les deux solutions à 35 °C pour le mélange ; cet écart dépend des quantités et des conditions.
`);
const equivalence = section("pc-acidbase-equivalence", "II", "Équivalence et bilan de matière", [465,466,468], String.raw`
L’équivalence correspond aux quantités introduites dans les proportions stœchiométriques de la réaction.

Pour un monoacide titré par une monobase, de coefficients1:1 :
$$C_aV_a=C_bV_{bE}.$$
Si une base de volume $V_b$ est titrée par un acide :
$$C_aV_{aE}=C_bV_b.$$
Les volumes doivent être exprimés dans une même unité ; pour calculer des quantités en moles, on les convertit en litres si $C$ est en $\mathrm{mol\,L^{-1}}$.

À l’équivalence HCl/NaOH, avec $V=V_a+V_{bE}$ :
$$[\mathrm{Na^+}]=\frac{C_bV_{bE}}V
=[\mathrm{Cl^-}]=\frac{C_aV_a}V.$$
L’électroneutralité impose alors $[\mathrm{H_3O^+}]=[\mathrm{OH^-}]$ ; à 25 °C, $pH_E=7$.

Cette neutralité n’est **pas générale** :

| Titrage à 25 °C | pH à l’équivalence, dans les cas usuels |
|---|---|
| Acide fort/base forte | $pH_E=7$ |
| Acide faible/base forte | $pH_E>7$ : la base conjuguée réagit avec l’eau |
| Base faible/acide fort | $pH_E<7$ : l’acide conjugué réagit avec l’eau |
`);
const curve = section("pc-acidbase-curves", "III", "Lire une courbe de titrage", [464,465,466,467], String.raw`
Le titrage suit le pH après chaque ajout de solution de concentration connue, sous agitation. Une burette mesure le volume ajouté ; une électrode reliée au pH-mètre suit la solution dans le bécher.

**Base forte ajoutée à un acide fort.** Le pH augmente : domaine acide avant l’équivalence, saut de pH autour de l’équivalence, puis domaine basique. Dans les mesures, le saut se situe autour de 21 mL.

| $V_b$ en mL | 0 | 2 | 4,1 | 6 | 8,1 | 10 | 12,4 | 14,1 |
|---|---|---|---|---|---|---|---|---|
| pH | 1,94 | 2,02 | 2,11 | 2,19 | 2,29 | 2,39 | 2,53 | 2,66 |

| $V_b$ en mL | 16 | 18 | 18,5 | 19 | 19,5 | 20 | 20,5 | 21 |
|---|---|---|---|---|---|---|---|---|
| pH | 2,84 | 3,12 | 3,24 | 3,40 | 3,60 | 4,01 | 5,57 | 7,14 |

| $V_b$ en mL | 21,5 | 22 | 22,5 | 23 | 24 | 25 | 30 |
|---|---|---|---|---|---|---|---|
| pH | 9,48 | 9,79 | 10,03 | 10,18 | 10,37 | 10,52 | 10,60 |

**Acide fort ajouté à une base forte.** La courbe est décroissante :

| $V_a$ en mL | 0 | 10 | 20 | 30 | 40 | 45 | 48 |
|---|---|---|---|---|---|---|---|
| pH | 11,70 | 11,40 | 11,10 | 10,80 | 10,50 | 10,20 | 9,80 |

| $V_a$ en mL | 49 | 52 | 55 | 60 | 70 | 80 |
|---|---|---|---|---|---|---|
| pH | 9,40 | 4,40 | 3,60 | 3,40 | 3,20 | 3,00 |

La méthode des tangentes parallèles permet de repérer le point d’inflexion voisin de l’équivalence. La courbe ou sa dérivée peut aussi aider à estimer le volume équivalent. Quand les solutions sont plus diluées, le saut de pH est moins marqué ; loin après l’équivalence, le pH tend vers celui du titrant.
`, "titration");
const half = section("pc-acidbase-half", "IV", "Demi-équivalence", [468], String.raw`
Lorsqu’un acide faible est titré par une base forte, à $V_b=V_{bE}/2$, la moitié de l’acide a été transformée en sa base conjuguée.

Dans le domaine où les effets de l’eau et de la dissociation résiduelle sont négligeables :
$$[\mathrm{A^-}]\simeq[\mathrm{AH}]
\quad\Longrightarrow\quad pH\simeq pK_a.$$
Le même principe vaut pour une base faible titrée par un acide fort à $V_a=V_{aE}/2$.

La demi-équivalence est donc utile pour lire le $pK_a$ du couple sur la courbe. Elle ne doit pas être confondue avec l’équivalence.
`);
const buffer = section("pc-acidbase-buffer", "V", "Solution tampon", [469], String.raw`
Une solution tampon contient un acide faible et sa base conjuguée en quantités appréciables, dans des proportions comparables :
$$pH=pK_a+\log\frac{[\mathrm{Base}]}{[\mathrm{Acide}]}.$$
Le cas équimolaire donne $pH\simeq pK_a$.

- Un ajout **modéré** d’acide ou de base fait peu varier son pH.
- Une dilution modérée conserve approximativement le rapport base/acide, donc le pH.
- La capacité tampon est limitée ; une très forte dilution ou un ajout trop important supprime cet effet.

**Trois préparations équimolaires :**

| Méthode | Quantités à choisir |
|---|---|
| Mélanger acide faible et base conjuguée | $n_{\mathrm{acide}}=n_{\mathrm{base}}$, donc $C_aV_a=C_bV_b$ |
| Neutraliser à moitié un acide faible | $n_{\mathrm{OH^-}}=n_{\mathrm{acide\ initial}}/2$ |
| Protoner à moitié une base faible | $n_{\mathrm{H_3O^+}}=n_{\mathrm{base\ initiale}}/2$ |

On effectue le bilan de réaction avant d’appliquer la relation de pH.
`);
const notes = [
  "Fiches464–469 uniquement ; exercice470 exclu. Deux cartes : réactions/tampons et titrage, à partir de sections partagées.",
  "Table467 à30 mL :10,80 rétabli, cohérent avec courbe décroissante/sourcegraphique, au lieu de11,80. Mesure21 mL pH 7,14 conservée ; théorie pHE7 distinguée de la mesure.",
  "Tampon non nécessairement équimolaire et dilution non infinie. Demi-équivalence pH≈pKa conditionnée aux hypothèses.",
  "Définition d’un sel non restreinte à un cation métallique ; équivalence n’impose pas toujours neutralité.",
];
export default sheet("acid-base-buffers", "Réactions acido-basiques et solutions tampons", [464,465,466,467,468,469], [reaction,equivalence,half,buffer], notes);
export const titrationSheet = sheet("acid-base-titration", "Titrages acido-basiques", [464,465,466,467,468,449], [reaction,equivalence,curve,half,indicatorSection], notes);
