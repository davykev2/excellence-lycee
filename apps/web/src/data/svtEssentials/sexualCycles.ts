import { c, d, section, sheet } from "./types";

export const femaleCycleSections = [
  section("svt-cycle-landmarks", "Les repères du cycle féminin", [642,643], String.raw`
Le premier jour des règles marque le **jour 1** du cycle. Le cycle de 28 jours est un modèle pratique : la durée réelle varie, et l’ovulation n’a pas obligatoirement lieu au jour 14.

| Cycle ovarien | Événement essentiel |
| --- | --- |
| Phase folliculaire | Croissance et sélection d’un follicule |
| Ovulation | Libération de l’ovocyte II par le follicule mûr |
| Phase lutéale | Formation et activité du corps jaune |

Les follicules évoluent de stades précoces vers le follicule mûr. Après l’ovulation, des cellules folliculaires se transforment pour constituer le corps jaune.

En l’absence de grossesse, le corps jaune régresse. En début de grossesse, l’hCG participe à son maintien. L’ovulation n’alterne pas nécessairement de façon régulière entre les deux ovaires.

La phase folliculaire est particulièrement variable ; la phase lutéale est souvent voisine de deux semaines, sans être une durée absolument fixe.`),
  section("svt-uterine-cycle", "Le cycle utérin et les modifications associées", [643,644,645], String.raw`
Les hormones ovariennes coordonnent l’état de la muqueuse utérine avec le fonctionnement ovarien.

| Phase endométriale | Transformation dominante |
| --- | --- |
| Menstruelle | Élimination d’une partie de la muqueuse après la baisse des hormones ovariennes |
| Proliférative | Reconstruction et épaississement sous l’influence des œstrogènes |
| Sécrétoire | Glandes actives, vascularisation et préparation à l’implantation sous l’action notamment de la progestérone |

Autour de l’ovulation, la glaire cervicale devient généralement plus favorable au passage des spermatozoïdes. Après l’ovulation, elle est habituellement plus épaisse. La température basale peut présenter une hausse liée à l’action de la progestérone.

**À retenir :** les règles sont un événement utérin ; l’ovulation est un événement ovarien. Ils appartiennent au même fonctionnement coordonné, mais ne sont pas synonymes.`),
  section("svt-ovarian-hormones", "Lire les courbes hormonales", [645,646], String.raw`
Les follicules en croissance sécrètent des œstrogènes, en particulier l’œstradiol. Le corps jaune sécrète notamment de la progestérone et aussi des œstrogènes.

| Hormone | Repère de lecture dans un cycle ovulatoire |
| --- | --- |
| Œstradiol | Forte augmentation avant l’ovulation ; seconde élévation possible pendant la phase lutéale |
| Progestérone | Faible avant l’ovulation, plus élevée pendant l’activité du corps jaune |
| LH | Pic préovulatoire participant au déclenchement de l’ovulation |
| FSH | Participe à la croissance et au fonctionnement folliculaires |

La diminution des hormones ovariennes en fin de phase lutéale, en l’absence de grossesse, participe au déclenchement des règles.

Pour lire une courbe, on relève **l’axe du temps, la grandeur mesurée, ses unités, puis la position des pics**. Deux courbes hormonales d’unités différentes ne se comparent pas seulement par leur hauteur sur le dessin.`, "female-cycle"),
  section("svt-female-axis", "L’axe hypothalamo-hypophyso-ovarien", [646,647,648], String.raw`
L’hypothalamus libère de la **GnRH de façon pulsatile**. Elle stimule les cellules gonadotropes de l’antéhypophyse, qui sécrètent FSH et LH. Ces hormones agissent sur les cellules ovariennes.

**Hypothalamus → GnRH → antéhypophyse → FSH/LH → ovaires → hormones ovariennes.**

| Observation expérimentale | Interprétation |
| --- | --- |
| L’ablation de l’hypophyse perturbe l’activité ovarienne | L’hypophyse fournit une commande nécessaire |
| Des gonadotropines restaurent certaines fonctions | La commande passe par des hormones |
| L’ablation des ovaires augmente habituellement FSH/LH | Les hormones ovariennes exercent normalement un frein sur cet axe |
| Un taux élevé et durable d’œstradiol précède le pic de LH | Un rétrocontrôle positif est possible dans des conditions précises |

La plus grande partie du cycle, les hormones ovariennes exercent un **rétrocontrôle négatif**. Avant l’ovulation, une élévation suffisante et durable de l’œstradiol peut favoriser un **rétrocontrôle positif**, conduisant au pic de LH. L’inhibine participe notamment au freinage de FSH.

Le même axe comporte donc des effets différents selon le moment du cycle et le contexte hormonal.`, "female-axis"),
];

export const femaleCyclesSheet = sheet("female-cycles", "Le fonctionnement cyclique des organes sexuels féminins", c, femaleCycleSections, [
  "Cours féminin pages 642–648, partagé par référence avec la fiche D6 ; le cycle de 28 jours reste un modèle, pas une prédiction individuelle.",
  "Ovariectomie : FSH/LH augmentées ; pic de progestérone en phase lutéale, non au seul dernier jour ; sécrétion pulsatile de GnRH et inhibine précisées.",
]);

export const sexualOrgansSheet = sheet("sexual-organs", "Le fonctionnement des organes sexuels", d, [
  ...femaleCycleSections,
  section("svt-male-axis", "La régulation du fonctionnement testiculaire", [648], String.raw`
Le testicule assure une production de spermatozoïdes et une fonction endocrine.

| Commande hypophysaire | Cellules cibles | Contribution |
| --- | --- | --- |
| LH | Cellules de Leydig | Sécrétion de testostérone |
| FSH | Cellules de Sertoli | Soutien de la spermatogenèse et sécrétion d’inhibine |

La testostérone participe au fonctionnement reproducteur et à l’expression de caractères sexuels. Avec les cellules de Sertoli et les autres signaux locaux, elle contribue au maintien de la spermatogenèse.

La testostérone freine l’axe hypothalamo-hypophysaire ; l’inhibine freine notamment FSH. Ce rétrocontrôle négatif ajuste l’activité de l’axe.

**GnRH → FSH/LH → testicule → testostérone/inhibine → retour inhibiteur.** La commande masculine n’est pas organisée en cycles menstruels.`, "male-axis"),
  section("svt-contraception", "Comprendre les mécanismes de contraception", [648,649], String.raw`
Les méthodes contraceptives agissent à différentes étapes. Leur efficacité dépend de la méthode et, pour certaines, de la régularité de son utilisation.

| Mécanisme | Exemple de principe |
| --- | --- |
| Empêcher la rencontre des gamètes | Barrière mécanique, notamment préservatif |
| Empêcher ou limiter l’ovulation | Certaines contraceptions hormonales |
| Épaissir la glaire cervicale | Effet important de contraceptions progestatives |
| Rendre la fécondation très improbable | Effets de dispositifs intra-utérins selon leur type |

Une contraception hormonale combinée utilise notamment le rétrocontrôle sur l’axe pour supprimer le pic ovulatoire de LH. Toutes les méthodes hormonales n’ont pas exactement le même mécanisme.

**Contraception et protection contre les infections sont deux objectifs différents.** Les pilules ne protègent pas des infections sexuellement transmissibles ; les préservatifs contribuent à cette protection.

Le choix d’une méthode relève d’une information adaptée et, selon la méthode, d’un accompagnement professionnel. Le suivi tient compte de la santé, des préférences et des conditions d’utilisation de la personne.`),
], [
  "Pages 642–649 ; mêmes objets de sections féminines que C7, complétés uniquement en D par le testicule et la contraception.",
  "Le tableau de taux d’échec ancien n’est pas transformé en estimation clinique actuelle ; les mécanismes sont reformulés selon la fiche OMS Oral contraceptives.",
  "Pas d’affirmation d’une action principale abortive ni de protection anti-IST par la pilule ; aucun conseil médical individuel.",
]);
