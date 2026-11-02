import { d, section, sheet } from "./types";

export default sheet("internal-environment", "Le maintien de la constance du milieu intérieur", d, [
  section("svt-internal-compartments", "Milieu intérieur et homéostasie", [562,563], String.raw`
Le **milieu intérieur** regroupe les liquides extracellulaires avec lesquels les cellules échangent : plasma sanguin, liquide interstitiel et lymphe. Le sang transporte les substances ; le liquide interstitiel baigne directement les cellules.

L’**homéostasie** est le maintien de paramètres dans des plages compatibles avec le fonctionnement de l’organisme. Il s’agit d’un équilibre dynamique : les apports et les productions compensent les pertes et les utilisations.

| Paramètre | Ce que l’organisme ajuste |
| --- | --- |
| Eau et ions | Volume et composition des liquides |
| Glucose | Disponibilité d’un combustible pour les cellules |
| pH | Équilibre entre acides, bases et systèmes tampons |
| Déchets azotés | Élimination rénale après leur production par le métabolisme |

**À distinguer :** une concentration est une quantité par volume ; un débit est un volume par unité de temps. Une variation d’eau peut modifier la concentration sans modifier initialement la quantité de soluté.`),
  section("svt-nephron", "Le rein et le trajet du filtrat", [563,564,565], String.raw`
Le rein possède une zone corticale périphérique et une zone médullaire profonde. Son unité fonctionnelle est le **néphron**, associé à des vaisseaux sanguins.

**Sang → glomérule → sang sortant ; filtrat → capsule → tubule proximal → anse de Henlé → tubule distal → système collecteur.** L’urine définitive rejoint les calices, le bassinet puis l’uretère.

Les corpuscules rénaux sont dans le cortex. Certaines portions tubulaires descendent dans la médulla. Il ne faut donc pas placer tout le néphron dans une seule zone.

| Étape | Sens du transfert | Idée essentielle |
| --- | --- | --- |
| Filtration glomérulaire | Sang → capsule | Une partie de l’eau et des petites molécules traverse le filtre |
| Réabsorption | Tubule → sang | L’organisme récupère de l’eau et des substances utiles |
| Sécrétion | Sang/cellules tubulaires → tubule | Certaines substances sont ajoutées au liquide tubulaire |
| Excrétion | Urine → extérieur | La quantité éliminée résulte des trois mécanismes précédents |

$$\text{Quantité excrétée}=\text{quantité filtrée}-\text{quantité réabsorbée}+\text{quantité sécrétée}.$$

Les cellules sanguines et l’essentiel des protéines plasmatiques restent normalement dans le sang. Le glucose, lui, **est filtré**, puis normalement réabsorbé.`, "nephron"),
  section("svt-urine-comparison", "Comparer plasma, filtrat et urine", [564,565,566], String.raw`
Voici les données du modèle expérimental, exprimées en **g/L** :

| Substance | Plasma | Filtrat glomérulaire | Urine définitive |
| --- | ---: | ---: | ---: |
| Glucose | 1 | 1 | 0 |
| Protéines | 80 | 0 | 0 |
| Lipides | 2,35 | 0 | 0 |
| Sodium | 3,30 | 3,30 | 3,33 |
| Chlorures | 3,65 | 3,65 | 6 |
| Calcium | 0,10 | 0,10 | 0,13 |
| Urée | 0,30 | 0,30 | 20 |
| Créatinine | 0,01 | 0,01 | 2 |
| Acide urique | 0,03 | 0,03 | 0,06 |
| Acide hippurique | 0 | 0 | 0,66 |
| Sels ammoniacaux | 0 | 0 | 0,80 |

**Lecture :** le glucose présent dans le filtrat mais non détecté dans l’urine a été réabsorbé. Une concentration élevée d’urée dans l’urine traduit notamment la récupération d’une grande partie de l’eau filtrée. L’apparition ou l’enrichissement d’une substance peut aussi dépendre de la sécrétion tubulaire : une seule comparaison de concentrations ne suffit pas à calculer tous les transferts.

Dans le même modèle, environ **170 L de filtrat sont formés par jour**, pour environ **1,5 L d’urine définitive**. Ces volumes journaliers ne sont pas des concentrations. Les valeurs dépendent de l’état de l’organisme et du protocole.

Le zéro du tableau signifie « non mis en évidence dans cette mesure », pas « jamais présent chez aucun individu ». L’urée est principalement produite par le foie ; le rein l’élimine.`),
  section("svt-water-adh", "L’équilibre hydrique et l’ADH", [566,567,568], String.raw`
Une perte d’eau sans perte proportionnelle de solutés augmente l’**osmolarité** du plasma. Des osmorécepteurs hypothalamiques participent alors au déclenchement de la soif et à la libération d’ADH.

L’**ADH**, synthétisée dans l’hypothalamus puis libérée par la neurohypophyse, augmente la perméabilité à l’eau de portions terminales du néphron et du système collecteur.

**Manque d’eau → davantage d’ADH → davantage d’eau réabsorbée → urine moins abondante et plus concentrée.**

Après un apport d’eau important, l’osmolarité tend à diminuer : la libération d’ADH diminue, ce qui favorise une urine plus abondante et plus diluée.

Une baisse importante du volume circulant peut également stimuler l’ADH. **Volume sanguin et osmolarité sont deux informations différentes** : une hémorragie n’est pas simplement un manque d’eau pure.

Un défaut de production ou d’action de l’ADH peut entraîner des pertes urinaires d’eau importantes. Cela ne correspond pas au mécanisme du diabète sucré.`, "water-balance"),
  section("svt-sodium-raas", "Sodium, volume et aldostérone", [568,569], String.raw`
Les ions sodium jouent un rôle majeur dans la répartition de l’eau extracellulaire. Leur quantité totale contribue au volume de ce compartiment ; leur concentration dépend aussi de la quantité d’eau.

Une baisse de la perfusion rénale, une baisse de l’arrivée de NaCl à la macula densa ou une stimulation sympathique peuvent favoriser la libération de **rénine** :

**Angiotensinogène → angiotensine I → angiotensine II → stimulation de l’aldostérone.**

L’angiotensine II participe à la vasoconstriction et aux réponses de conservation du volume. L’**aldostérone**, produite par le cortex surrénalien, favorise la réabsorption rénale de sodium et la sécrétion de potassium. L’eau suit le sodium lorsque les conditions de perméabilité le permettent.

**ADH : conserver surtout l’eau. Aldostérone : ajuster notamment sodium et potassium.** Leurs effets peuvent se compléter, mais leurs signaux de commande et leurs mécanismes ne sont pas identiques.`),
  section("svt-acid-base", "L’équilibre acido-basique", [569,570], String.raw`
Le pH du sang artériel est normalement maintenu autour de **7,35 à 7,45**. Plusieurs systèmes coopèrent :

| Système | Action |
| --- | --- |
| Tampons chimiques | Limitent rapidement les variations du pH |
| Poumons | Ajustent l’élimination du dioxyde de carbone |
| Reins | Ajustent l’excrétion d’acides et la récupération/production de bicarbonate |

$$CO_2+H_2O\rightleftharpoons H_2CO_3\rightleftharpoons H^++HCO_3^-.$$

Une diminution de l’élimination de $CO_2$ tend à acidifier le sang ; une élimination excessive tend à l’alcaliniser. Les poumons éliminent du **$CO_2$**, pas directement des ions $H^+$ libres.

Les protéines et les phosphates constituent aussi des systèmes tampons. Les reins peuvent notamment excréter des ions $H^+$ sous des formes tamponnées et de l’ammonium. Une régulation normale ramène le paramètre vers sa plage habituelle par **rétrocontrôle négatif**.`),
  section("svt-glycemia", "La régulation de la glycémie", [570,571], String.raw`
La glycémie est la concentration sanguine en glucose. La valeur scolaire voisine de **1 g/L** est un repère ; elle varie avec les conditions de mesure et les repas.

| Situation | Cellules pancréatiques | Hormone | Effets principaux |
| --- | --- | --- | --- |
| Glycémie qui augmente | Cellules $\beta$ des îlots | Insuline | Favorise l’utilisation et le stockage du glucose ; freine sa production hépatique |
| Glycémie qui baisse | Cellules $\alpha$ des îlots | Glucagon | Favorise la libération hépatique de glucose |

Le foie peut stocker du glucose sous forme de glycogène, dégrader ce glycogène et produire du glucose à partir de précurseurs non glucidiques. Le muscle utilise son glycogène pour son propre fonctionnement ; il ne le libère pas directement sous forme de glucose sanguin comme le foie.

**Après un repas : insuline → stockage/utilisation → baisse vers la plage de référence.**

**À jeun : glucagon → production hépatique → remontée vers la plage de référence.**

L’adrénaline et le cortisol participent également à l’adaptation énergétique. Le cortex surrénalien produit le cortisol ; la médullosurrénale produit les catécholamines. Le diabète sucré met en jeu un défaut de sécrétion ou d’action de l’insuline : il ne doit pas être confondu avec un trouble de l’ADH.`, "glycemia"),
], [
  "Cours uniquement, pages 562–571. Le tableau sépare g/L et volumes journaliers ; créatinine rétablie pour la ligne à 0,01/0,01/2.",
  "Filtration du glucose, production hépatique de l’urée, anatomie cortico-médullaire, synthèse/libération de l’ADH et mécanismes RAAS clarifiés ; aucune valeur de sodium/NaCl ambiguë transformée en seuil clinique.",
  "Sens des effets ventilatoires corrigé ; cellules bêta/insuline et alpha/glucagon rétablies. Référence scientifique de vérification : NIDDK, Your Kidneys & How They Work.",
]);
