import { createSvtPath, type SvtCourseSeed } from "./svtPathFactory";
import { choice, trueFalse, createSvtSource } from "./terminalSvtPathHelpers";

const originOfLifeSource = createSvtSource("SVT TA_L3_Lorigine de la vie.pdf");

const course: SvtCourseSeed = {
    id: "terminale-svt-l3-origin-of-life",
    chapterNumber: 3,
    themeNumber: 2,
    themeTitle: "Origine et évolution du vivant",
    title: "L’origine de la vie",
    description: "Croiser les archives géologiques, l’étude des milieux extrêmes et les expériences de chimie prébiotique pour reconstruire un scénario scientifique prudent de l’apparition de la vie.",
    centralQuestion: "Comment des indices indirects et des expériences permettent-ils d’étudier une origine de la vie que personne n’a pu observer ?",
    memorySentence: "Archives de la Terre + analogues actuels + expériences → scénario testable, mais passage exact à la première cellule encore inconnu.",
    overviewBodyMarkdown: `
## Deux familles de faits, une même enquête

L’origine de la vie est un événement très ancien qui n’a laissé ni récit direct ni première cellule intacte. Le scientifique construit donc une explication en **croisant des indices indépendants**.

| Famille de faits | Documents étudiés | Ce qu’ils permettent d’établir |
|---|---|---|
| **Archives géologiques et géochimiques** | pechblende, fers rubanés, couches rouges, évolution de l’atmosphère | l’atmosphère primitive contenait très peu de dioxygène libre, puis elle s’est progressivement oxygénée |
| **Analogues biologiques actuels** | microorganismes de sources chaudes, acides ou hydrothermales | la vie peut fonctionner dans des milieux très contraignants |
| **Expériences prébiotiques** | Miller-Urey, coacervats, polymérisation, structures microscopiques | certaines briques organiques et certains compartiments peuvent apparaître sans cellule préexistante |
| **Apports extraterrestres** | molécules organiques de météorites et de comètes | une partie des constituants carbonés a pu être apportée depuis l’espace |

Le document officiel emploie souvent l’expression **« faits paléontologiques »**. Plusieurs indices étudiés sont surtout **géologiques** ou **géochimiques** : une roche oxydée n’est pas un fossile, mais elle renseigne sur le milieu ancien.

## Ce que la démarche scientifique autorise à conclure

Une expérience peut montrer qu’une étape est **possible**. Elle ne prouve pas que cette étape s’est déroulée exactement de cette façon sur la Terre primitive. De même, un extrêmophile actuel est un **analogue**, pas le premier être vivant conservé jusqu’à aujourd’hui.

> **Astuce mémoire - AAE :** **A**rchives, **A**nalogues, **E**xpériences. Les trois convergent vers un scénario, sans constituer une vidéo du passé.

> **Erreur fréquente :** confondre « molécule organique », « structure ressemblant à une cellule » et « cellule vivante ». Une cellule doit maintenir une organisation, utiliser de l’énergie, porter une information héréditaire et se reproduire avec variations.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte de preuves",
      title: "Quatre fenêtres sur l’origine de la vie",
      instruction: "Ouvre chaque famille pour distinguer observation, expérience et conclusion.",
      rootLabel: "Origine de la vie",
      rootDetail: "Une reconstruction scientifique fondée sur des indices convergents et des hypothèses testables.",
      nodes: [
        { id: "archives", label: "Roches anciennes", role: "Archives du milieu", detail: "Pechblende, fers rubanés et couches rouges renseignent sur la teneur ancienne en dioxygène.", group: "Passé" },
        { id: "timeline", label: "Traces du vivant", role: "Chronologie minimale", detail: "Les premières traces attribuées à des organismes procaryotes précèdent l’oxygénation massive de l’atmosphère.", group: "Passé" },
        { id: "analogues", label: "Extrêmophiles", role: "Analogues actuels", detail: "Ils montrent qu’un métabolisme cellulaire est possible dans des milieux chauds, acides ou riches en sulfures.", group: "Présent" },
        { id: "experiments", label: "Chimie prébiotique", role: "Tester une possibilité", detail: "Des expériences produisent des molécules organiques ou des compartiments, sans recréer une cellule vivante complète.", group: "Laboratoire" },
        { id: "space", label: "Météorites et comètes", role: "Apports possibles", detail: "Des molécules carbonées détectées dans certaines météorites montrent qu’une chimie organique existe aussi hors de la Terre.", group: "Espace" },
      ],
      observation: "La force du scénario vient de la convergence : aucune famille de faits ne suffit seule à raconter toutes les étapes.",
    },
    overviewExtraQuestions: [
      choice("Pourquoi ne peut-on pas observer directement l’apparition de la première cellule ?", ["Parce qu’aucune roche n’existe", "Parce que l’événement est très ancien et ses traces sont indirectes", "Parce que les cellules ne contiennent aucune molécule", "Parce que les expériences sont interdites"], 1, "L’enquête repose sur des archives transformées par le temps et sur des tests de possibilité."),
      choice("Quelle association décrit correctement les trois grandes approches de la leçon ?", ["Archives - analogues actuels - expériences", "Digestion - respiration - excrétion", "Méiose - fécondation - développement", "Réflexe - mémoire - hormone"], 0, "Les archives renseignent sur le passé, les analogues sur les limites du vivant et les expériences sur les étapes chimiquement possibles."),
      trueFalse("Une expérience qui produit des acides aminés a nécessairement recréé la vie.", false, "Un acide aminé est une brique chimique ; il ne possède ni organisation cellulaire ni reproduction autonome."),
      choice("Lequel est surtout un indice géochimique plutôt qu’un fossile ?", ["Une empreinte d’animal", "Un os minéralisé", "Une couche rouge riche en oxydes de fer", "Une coquille fossile"], 2, "La couleur et la minéralogie de la couche enregistrent des conditions d’oxydation."),
      choice("Quelle conclusion est la plus scientifique ?", ["Un seul document prouve toutes les étapes", "Le scénario est certain dans chaque détail", "Toute hypothèse se vaut", "Plusieurs indices convergent, mais certaines étapes restent discutées"], 3, "Une conclusion scientifique précise à la fois ce que les données soutiennent et leurs limites."),
    ],
    overviewSource: originOfLifeSource(
      "1-7",
      "Problématique générale, deux familles de faits et documents de synthèse",
      [
        "La situation d’apprentissage opposant scientifiques et religieux est retirée : le cours traite la méthode scientifique sans juger les convictions personnelles.",
        "L’expression générale « faits paléontologiques » est précisée en archives géologiques, géochimiques et paléontologiques selon la nature réelle de chaque document.",
      ],
    ),
    sections: [
      {
        id: "early-earth-evidence",
        title: "Lire les archives de la Terre primitive",
        summary: "Interpréter pechblende, fers rubanés et couches rouges sans confondre la roche observée avec l’atmosphère que l’on reconstitue.",
        conceptTitle: "Les roches enregistrent indirectement la présence de dioxygène",
        explanation: "La conservation de grains d’uraninite très oxydable indique une atmosphère ancienne pauvre en dioxygène. Les fers rubanés enregistrent l’oxydation du fer dissous dans les océans, puis les couches rouges continentales traduisent une oxygénation atmosphérique devenue plus durable.",
        keyPoint: "Uraninite détritique conservée → très peu d’O₂ ; fers rubanés → oxygénation des océans ; couches rouges → O₂ atmosphérique plus durable.",
        example: "On n’observe pas directement l’air vieux de 2,3 milliards d’années : on déduit sa pauvreté en dioxygène de la conservation d’un minéral qui s’oxyde facilement.",
        bodyMarkdown: `
## 1. La pechblende : un minéral fragile face au dioxygène

Le texte décrit des sables fluviatiles âgés d’environ **2,3 milliards d’années**, découverts notamment en Afrique et en Amérique, contenant des grains de pechblende ou **uraninite**. Ce minéral s’oxyde facilement. Sa conservation pendant le transport par les cours d’eau est donc compatible avec une atmosphère contenant très peu de dioxygène libre.

Le raisonnement est indirect :

1. l’uraninite s’altère en présence d’un milieu fortement oxydant ;
2. elle est retrouvée sous forme détritique dans une roche ancienne ;
3. on en déduit que le milieu de transport était beaucoup moins oxygéné qu’aujourd’hui.

## 2. Les fers rubanés : du dioxygène d’abord consommé dans l’océan

Les **formations de fer rubané** alternent surtout des niveaux riches en oxydes de fer et des niveaux riches en silice. Le dioxygène produit localement oxyde le fer ferreux dissous ; les oxydes insolubles précipitent et s’accumulent sur le fond marin.

| Observation | Déduction prudente |
|---|---|
| grandes quantités de fer dissous dans l’océan ancien | le milieu global reste pauvre en dioxygène libre |
| dépôts d’oxydes de fer | du dioxygène est produit et immédiatement consommé par l’oxydation du fer |
| répétition des niveaux | production et conditions de dépôt varient au cours du temps |

Le document parle de couches « blanches » et « rouges », puis de fer ferreux et d’oxydes. La lecture moderne retient surtout l’alternance **silice / oxydes de fer** ; elle ne permet pas à elle seule de reconstituer des « saisons atmosphériques » précises.

## 3. Les couches rouges : le dioxygène gagne les continents

Quand les principaux composés réduits consomment moins de dioxygène qu’il n’en est produit, le gaz commence à s’accumuler dans l’atmosphère. Les sédiments continentaux s’oxydent alors et prennent une teinte rouge due notamment à l’hématite.

Cette transition s’inscrit dans la **Grande Oxygénation**, vers 2,4 à 2,1 milliards d’années. Les dates et concentrations exactes restent discutées ; la valeur « environ 1 % de la teneur actuelle » du document est un ordre de grandeur historique, pas une mesure directe de chaque couche rouge.

> **Astuce mémoire - UFR :** **U**raninite conservée, **F**ers rubanés, **R**ed beds. C’est l’ordre des trois archives.

> **Erreur fréquente :** dire que les fers rubanés prouvent immédiatement une atmosphère riche en O₂. Ils montrent surtout que l’O₂ produit était d’abord capté par le fer océanique.
`,
        processTitle: "Trois archives de l’oxygénation",
        processInstruction: "Replace les indices géologiques dans leur ordre et ouvre chaque repère.",
        process: [
          { label: "Uraninite détritique", shortLabel: "Très peu d’O₂", detail: "Sa conservation indique un environnement de surface faiblement oxydant." },
          { label: "Fers rubanés", detail: "Le dioxygène oxyde le fer dissous et reste en grande partie consommé dans l’océan." },
          { label: "Grande Oxygénation", shortLabel: "Accumulation", detail: "La production dépasse progressivement les puits chimiques de dioxygène." },
          { label: "Couches rouges", detail: "L’oxydation durable des sédiments continentaux témoigne d’un O₂ atmosphérique plus présent." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Coupe temporelle interactive",
          title: "De l’océan riche en fer aux continents rouges",
          instruction: "Sélectionne chaque repère pour relier une roche au niveau d’oxygénation qu’elle révèle.",
          viewBox: "0 0 700 370",
          caption: "Figure originale redessinée d’après la frise et les archives géologiques du document officiel.",
          shapes: [
            { shape: "line", x1: 58, y1: 305, x2: 655, y2: 305, tone: "outline" },
            { shape: "path", d: "M82 253 L176 253 L176 181 L82 181 Z", tone: "soft" },
            { shape: "circle", cx: 106, cy: 211, r: 9, tone: "muted" },
            { shape: "circle", cx: 137, cy: 226, r: 8, tone: "muted" },
            { shape: "path", d: "M235 258 L348 258 L348 169 L235 169 Z", tone: "soft" },
            { shape: "line", x1: 239, y1: 184, x2: 344, y2: 184, tone: "accent" },
            { shape: "line", x1: 239, y1: 205, x2: 344, y2: 205, tone: "muted" },
            { shape: "line", x1: 239, y1: 226, x2: 344, y2: 226, tone: "accent" },
            { shape: "line", x1: 239, y1: 247, x2: 344, y2: 247, tone: "muted" },
            { shape: "path", d: "M459 257 L602 257 L584 165 L479 165 Z", tone: "accent" },
            { shape: "path", d: "M56 126 C192 105 320 126 437 101 C529 81 598 83 657 70", tone: "accent" },
            { shape: "text", x: 128, y: 280, content: "~2,7 à 2,4 Ga", anchor: "middle" },
            { shape: "text", x: 292, y: 280, content: "fers rubanés", anchor: "middle" },
            { shape: "text", x: 530, y: 280, content: "couches rouges", anchor: "middle" },
            { shape: "text", x: 350, y: 52, content: "dioxygène libre en augmentation", anchor: "middle" },
          ],
          hotspots: [
            { id: "uraninite", number: 1, label: "Uraninite conservée", detail: "Des grains très oxydables traversent le milieu de surface sans être détruits : le dioxygène libre est rare.", x: 128, y: 154, highlight: [{ shape: "path", d: "M82 253 L176 253 L176 181 L82 181 Z", tone: "accent" }] },
            { id: "bif", number: 2, label: "Fers rubanés", detail: "L’O₂ produit oxyde le fer ferreux dissous ; les oxydes précipitent tandis que l’atmosphère reste encore peu oxygénée.", x: 291, y: 146, highlight: [{ shape: "path", d: "M235 258 L348 258 L348 169 L235 169 Z", tone: "accent" }] },
            { id: "great-oxidation", number: 3, label: "Grande Oxygénation", detail: "Vers 2,4 à 2,1 Ga, le dioxygène commence à s’accumuler durablement au-delà des puits chimiques.", x: 418, y: 103, highlight: [{ shape: "path", d: "M56 126 C192 105 320 126 437 101 C529 81 598 83 657 70", tone: "accent" }] },
            { id: "redbeds", number: 4, label: "Couches rouges", detail: "L’hématite colore les dépôts continentaux : l’atmosphère est devenue suffisamment oxydante pour altérer les continents.", x: 532, y: 142, highlight: [{ shape: "path", d: "M459 257 L602 257 L584 165 L479 165 Z", tone: "accent" }] },
          ],
          observation: "Une même molécule, O₂, laisse des signatures différentes selon qu’elle est immédiatement consommée dans l’océan ou qu’elle s’accumule dans l’atmosphère.",
        },
        observation: "Une archive géologique ne montre pas directement l’atmosphère ; elle en révèle les propriétés par les réactions chimiques qu’elle a enregistrées.",
        check: choice("Que traduit l’apparition durable de couches rouges continentales ?", ["La disparition de tous les océans", "L’absence totale de fer", "La formation immédiate des animaux", "Une présence plus durable de dioxygène atmosphérique"], 3, "L’oxydation du fer des continents exige un milieu de surface devenu plus oxydant."),
        extraQuestions: [
          choice("Pourquoi la pechblende détritique est-elle un indice d’une atmosphère pauvre en O₂ ?", ["Parce qu’elle produit elle-même l’oxygène", "Parce qu’elle est un fossile de cyanobactérie", "Parce qu’elle se serait oxydée et altérée dans une atmosphère riche en O₂", "Parce qu’elle ne contient aucun uranium"], 2, "Sa conservation est compatible avec un faible pouvoir oxydant du milieu.", "Texte 1, pechblende • page 1"),
          choice("Que se passe-t-il lorsque le dioxygène rencontre le fer ferreux dissous dans l’océan ancien ?", ["Il l’oxyde et des composés ferriques précipitent", "Il transforme le fer en méthane", "Il détruit tous les sédiments", "Il forme directement une cellule"], 0, "L’oxydation du fer consomme l’O₂ et produit des dépôts riches en oxydes.", "Texte 1, fers rubanés • page 1"),
          trueFalse("Les fers rubanés prouvent que l’atmosphère était déjà aussi riche en dioxygène qu’aujourd’hui.", false, "Ils indiquent une production d’O₂, mais une grande part était encore consommée dans l’océan.", "Analyse du texte 1 • pages 1-2"),
          choice("Quelle alternance décrit le mieux une formation de fer rubané ?", ["Os et coquilles", "Niveaux riches en oxydes de fer et niveaux riches en silice", "Charbon et pétrole", "Granite et basalte uniquement"], 1, "La formulation simplifiée « blanc/rouge » du document est précisée par la minéralogie des niveaux.", "Texte 1 et document 1 • pages 1 et 3"),
          choice("Dans quel ordre apparaissent les trois archives étudiées ?", ["Couches rouges → uraninite → fers rubanés", "Fers rubanés → couches rouges → uraninite", "Uraninite conservée → fers rubanés → couches rouges", "Couches rouges → fers rubanés → uraninite"], 2, "Cet ordre accompagne l’augmentation progressive du dioxygène disponible.", "Résultats du texte 1 • page 2"),
          choice("Qu’est-ce que la Grande Oxygénation ?", ["La disparition de l’atmosphère", "Une accumulation importante et durable de dioxygène libre", "La naissance instantanée de tous les animaux", "La transformation de l’O₂ en azote"], 1, "Elle correspond à un changement global du cycle de l’oxygène, vers 2,4 à 2,1 Ga."),
          choice("Pourquoi parle-t-on d’une déduction indirecte ?", ["Parce que les roches n’existent pas", "Parce que l’on refuse toute mesure", "Parce qu’on mesure l’air ancien dans une bouteille intacte", "Parce qu’on reconstitue le milieu à partir des réactions conservées dans les minéraux"], 3, "La roche est l’archive ; l’atmosphère ancienne est l’objet reconstruit."),
          trueFalse("La valeur de 1 % de la teneur actuelle en O₂ doit être comprise comme une mesure exacte valable pour toutes les couches rouges.", false, "Le document donne un ordre de grandeur ; les archives et les modèles ne justifient pas une valeur unique pour chaque lieu et chaque date."),
        ],
        distractors: ["L’atmosphère primitive contenait autant de dioxygène qu’aujourd’hui.", "Les fers rubanés ne fournissent aucune information chimique.", "Les couches rouges se forment uniquement sans dioxygène."],
        source: originOfLifeSource(
          "1-3 et 7",
          "Texte 1, résultats, analyse et frise de l’évolution de l’atmosphère",
          [
            "Les faits dits « paléontologiques » sont ici distingués en indices géologiques et géochimiques.",
            "L’alternance des fers rubanés est précisée en niveaux riches en oxydes de fer et en silice ; elle ne démontre pas à elle seule une alternance saisonnière de toute l’atmosphère.",
            "La Grande Oxygénation est située approximativement vers 2,4 à 2,1 milliards d’années et la valeur de 1 % est présentée comme un ordre de grandeur historique.",
          ],
        ),
      },
      {
        id: "photosynthesis-oxygenation",
        title: "Relier photosynthèse et oxygénation",
        summary: "Suivre le dioxygène produit par les cyanobactéries, depuis les puits océaniques jusqu’à l’atmosphère et à la couche d’ozone.",
        conceptTitle: "La photosynthèse oxygénique transforme la planète",
        explanation: "Des microorganismes photosynthétiques, notamment les cyanobactéries, libèrent du dioxygène. D’abord consommé par le fer et d’autres composés réduits, ce gaz finit par s’accumuler dans l’atmosphère ; une partie forme alors de l’ozone qui filtre les ultraviolets.",
        keyPoint: "Photosynthèse oxygénique → O₂ consommé par les puits chimiques → O₂ atmosphérique → ozone → nouveaux milieux habitables.",
        example: "Une cyanobactérie utilise l’énergie lumineuse pour fabriquer de la matière organique et rejeter du dioxygène, même si ce dioxygène n’atteint pas immédiatement l’atmosphère.",
        bodyMarkdown: `
## 1. La source biologique du dioxygène

Les premiers grands producteurs de dioxygène ne sont pas des plantes terrestres, mais des **cyanobactéries**, procaryotes capables de photosynthèse oxygénique. Elles utilisent l’énergie lumineuse, l’eau et le dioxyde de carbone pour fabriquer de la matière organique et libérer du dioxygène.

Le document parle d’« algues ». Pour les temps très anciens étudiés ici, le terme le plus précis est **cyanobactéries**. Certaines construisent des tapis microbiens pouvant former des stromatolites.

## 2. Pourquoi l’atmosphère ne s’oxygène-t-elle pas immédiatement ?

Le dioxygène est très réactif. Avant de s’accumuler, il oxyde :

- le fer ferreux dissous dans l’océan ;
- des gaz volcaniques et des minéraux réduits ;
- de la matière organique.

Ces réactions constituent des **puits de dioxygène**. L’atmosphère s’oxygène durablement lorsque la production biologique devient supérieure à la consommation par ces puits.

## 3. Du dioxygène à l’ozone

Dans la haute atmosphère, les ultraviolets transforment une partie du dioxygène en **ozone O₃**. La couche d’ozone absorbe une partie importante des UV nocifs. Elle n’a pas « créé » la vie, mais elle a rendu la surface et les eaux peu profondes moins exposées aux rayonnements, facilitant ensuite la diversification et la conquête de nouveaux milieux.

| Repère approximatif | Événement à retenir |
|---|---|
| vers 3,5 milliards d’années ou avant | traces anciennes de vie procaryote discutées selon les indices |
| vers 2,4 à 2,1 milliards d’années | Grande Oxygénation |
| vers 1,8 milliard d’années | diversification d’eucaryotes anciens |
| fin du Précambrien | diversification d’organismes pluricellulaires |

Cette suite n’est pas une échelle où chaque groupe se transforme directement en suivant. Procaryotes, eucaryotes et pluricellulaires ont des histoires ramifiées, et les procaryotes existent toujours.

> **Correction importante :** le document affirme que les végétaux chlorophylliens rejettent l’O₂ « la nuit ». La photosynthèse libère de l’O₂ **en présence de lumière** ; la respiration, qui consomme de l’O₂, se poursuit de jour comme de nuit.

> **Astuce mémoire - PCO :** **P**roduction, **C**onsommation par les puits, **O**xygénation durable.
`,
        processTitle: "De la photosynthèse à l’ozone",
        processInstruction: "Suis le devenir du dioxygène produit par les premiers organismes.",
        process: [
          { label: "Cyanobactéries", shortLabel: "Production", detail: "La photosynthèse oxygénique libère du dioxygène dans l’eau." },
          { label: "Puits océaniques", shortLabel: "Consommation", detail: "Le fer et d’autres composés réduits captent d’abord l’O₂ produit." },
          { label: "Atmosphère", shortLabel: "Accumulation", detail: "Lorsque la production dépasse les puits, l’O₂ libre augmente." },
          { label: "Ozone", detail: "Une partie de l’O₂ forme O₃ et filtre une fraction des ultraviolets." },
          { label: "Diversification", detail: "L’oxygénation et la protection UV ouvrent de nouvelles possibilités métaboliques et écologiques." },
        ],
        interaction: {
          kind: "diagram",
          eyebrow: "Cycle interactif",
          title: "Le long trajet du dioxygène",
          instruction: "Sélectionne une étape pour comprendre pourquoi production ne signifie pas accumulation immédiate.",
          rootLabel: "O₂ biologique",
          rootDetail: "Produit par photosynthèse oxygénique, il transforme d’abord l’océan puis l’atmosphère.",
          nodes: [
            { id: "cyanobacteria", label: "Cyanobactéries", role: "Produire", detail: "Elles captent l’énergie lumineuse et libèrent du dioxygène dans l’eau.", group: "Source" },
            { id: "iron", label: "Fer océanique", role: "Premier puits", detail: "Le fer ferreux est oxydé ; les oxydes précipitent en formations rubanées.", group: "Consommation" },
            { id: "other-sinks", label: "Autres puits", role: "Retarder l’accumulation", detail: "Gaz volcaniques, roches réduites et matière organique consomment aussi du dioxygène.", group: "Consommation" },
            { id: "atmosphere", label: "Atmosphère", role: "S’accumuler", detail: "L’O₂ devient durable quand sa production dépasse la capacité des puits.", group: "Transformation" },
            { id: "ozone", label: "Couche d’ozone", role: "Filtrer les UV", detail: "Une partie de l’O₂ forme O₃ dans la haute atmosphère et réduit l’exposition aux UV.", group: "Conséquence" },
          ],
          observation: "La vie transforme son milieu, puis le milieu transformé modifie à son tour les possibilités d’évolution du vivant.",
        },
        observation: "L’apparition de la vie et l’évolution de l’atmosphère s’influencent mutuellement, sans former une progression simple et automatique.",
        check: choice("Quelle activité biologique a fortement contribué à l’oxygénation ancienne ?", ["La digestion", "La fermentation seule", "La photosynthèse oxygénique", "La mitose sans métabolisme"], 2, "Les cyanobactéries photosynthétiques ont constitué une source majeure de dioxygène."),
        extraQuestions: [
          choice("Quel groupe ancien est le plus précisément associé à la production d’O₂ étudiée ?", ["Les mammifères", "Les cyanobactéries", "Les champignons terrestres", "Les insectes"], 1, "Le mot « algues » du document est précisé par les cyanobactéries pour les temps anciens.", "Interprétation du document 3 • pages 2-3"),
          choice("Pourquoi l’O₂ produit ne s’est-il pas immédiatement accumulé dans l’atmosphère ?", ["Il était consommé par le fer et d’autres composés réduits", "Il n’existait aucune réaction chimique", "Il se transformait entièrement en azote", "Il quittait définitivement la Terre"], 0, "Les puits océaniques et géologiques ont d’abord capté une grande partie du dioxygène.", "Texte 1 et analyse • pages 1-2"),
          choice("Quel gaz est le précurseur direct de l’ozone atmosphérique ?", ["Le méthane", "Le diazote", "Le dioxyde de carbone", "Le dioxygène"], 3, "L’ozone O₃ se forme à partir du dioxygène O₂ sous l’action des UV.", "Texte 1 • pages 1-2"),
          trueFalse("Les végétaux chlorophylliens libèrent le dioxygène photosynthétique principalement la nuit.", false, "La libération photosynthétique d’O₂ exige la lumière ; la respiration continue jour et nuit.", "Interprétation du document 3 • page 2"),
          trueFalse("Les organismes photosynthétiques respirent également.", true, "La photosynthèse et la respiration sont deux processus distincts ; un organisme photosynthétique respire aussi."),
          choice("Quel ordre général est cohérent avec la frise du document ?", ["Procaryotes → eucaryotes → pluricellulaires", "Pluricellulaires → procaryotes → Terre", "Vertébrés terrestres → océans → procaryotes", "Ozone → naissance de la Terre → cyanobactéries"], 0, "L’ordre chronologique général est conservé, sans supposer une transformation linéaire de chaque groupe dans le suivant.", "Document 1 et documentation • pages 3 et 7"),
          choice("Quelle formulation évite une causalité excessive ?", ["L’O₂ a fabriqué directement tous les eucaryotes", "La couche d’ozone a créé la première cellule", "L’oxygénation a offert de nouvelles possibilités métaboliques et écologiques", "Tous les procaryotes ont disparu après l’oxygénation"], 2, "L’oxygénation est un facteur majeur parmi d’autres ; elle ne constitue pas à elle seule un programme d’évolution."),
          choice("Quel rôle protecteur joue la couche d’ozone ?", ["Elle bloque toute lumière visible", "Elle absorbe une partie importante des ultraviolets", "Elle produit le fer océanique", "Elle supprime la respiration"], 1, "La réduction du flux UV facilite la vie dans les eaux superficielles et sur les continents.", "Texte 1 • page 2"),
        ],
        distractors: ["L’ozone s’est formé avant toute présence de dioxygène.", "Le dioxygène n’a jamais réagi avec le fer océanique.", "La photosynthèse consomme le dioxygène pour produire du dioxyde de carbone."],
        source: originOfLifeSource(
          "1-3 et 7",
          "Photosynthèse, oxygénation, ozone et frise de diversification",
          [
            "Le terme général « algues » est précisé en cyanobactéries pour les premiers producteurs importants de dioxygène.",
            "La phrase affirmant que les végétaux rejettent l’O₂ la nuit est corrigée : la photosynthèse oxygénique dépend de la lumière, tandis que la respiration a lieu jour et nuit.",
            "La succession procaryotes, eucaryotes et pluricellulaires est présentée comme une chronologie ramifiée, non comme une chaîne où chaque groupe disparaît en devenant le suivant.",
          ],
        ),
      },
      {
        id: "extreme-environments",
        title: "Interpréter la vie en milieu extrême",
        summary: "Utiliser les archées thermoacidophiles et les sources hydrothermales comme analogues, sans transformer une ressemblance actuelle en preuve historique.",
        conceptTitle: "Les extrêmophiles repoussent les limites connues du vivant",
        explanation: "Des archées vivent dans des sources chaudes et acides, et des écosystèmes prospèrent autour des sources hydrothermales. Ces observations rendent plausibles certains scénarios d’origine, mais les fluides à 350 °C eux-mêmes ne sont pas un habitat cellulaire.",
        keyPoint: "Un extrêmophile montre qu’un milieu contraignant peut être habitable ; il ne prouve ni le lieu ni l’identité du premier vivant.",
        example: "Près d’un fumeur hydrothermal, les cellules occupent les zones de mélange refroidies et chimiquement riches, pas le fluide qui sort à environ 350 °C.",
        bodyMarkdown: `
## 1. Les organismes des sources chaudes et acides

Le document cite des microorganismes de **1 à 2 µm** vivant dans des eaux très chaudes et acides du parc de Yellowstone, jusqu’à environ 90 °C et pH 1. Le nom correct est **Sulfolobus**, et il s’agit d’une **archée** thermoacidophile, non d’une bactérie au sens moderne.

Ces organismes possèdent des membranes et des enzymes adaptées à la chaleur et à l’acidité. Ils montrent que les conditions compatibles avec une cellule sont plus larges que celles de notre environnement quotidien.

## 2. Les sources hydrothermales profondes

Les fumeurs des dorsales océaniques peuvent rejeter un fluide proche de **350 °C**, maintenu liquide par la forte pression. Cette valeur décrit le fluide à la sortie, pas la température interne des cellules voisines. Les microorganismes vivent dans les gradients où l’eau hydrothermale se mélange à l’eau océanique froide.

Ces milieux offrent :

- des minéraux pouvant catalyser des réactions ;
- des gradients de température, de pH et de composition chimique ;
- des molécules réduites comme le sulfure d’hydrogène, sources d’énergie pour certains métabolismes.

## 3. Comment raisonner par analogie ?

| Étape | Formulation correcte |
|---|---|
| observation | des cellules actuelles vivent dans des conditions chaudes, acides ou riches en sulfures |
| comparaison | certains caractères rappellent des environnements proposés pour la Terre primitive |
| hypothèse | une origine dans un milieu hydrothermal ou minéral est possible |
| limite | les organismes actuels ont eux-mêmes évolué pendant des milliards d’années |

Le schéma de synthèse du document ajoute les **sources chaudes** et les **argiles** parmi les lieux ou supports possibles de la chimie prébiotique. Les surfaces minérales peuvent concentrer des molécules et favoriser certaines réactions, mais elles ne constituent pas à elles seules une cellule.

> **Astuce mémoire - OHL :** **O**bserver, formuler une **H**ypothèse, annoncer la **L**imite.

> **Erreur fréquente :** « des organismes vivent près d’un fluide à 350 °C » ne signifie pas « des cellules vivent à 350 °C ».
`,
        processTitle: "Du milieu actuel à l’hypothèse ancienne",
        processInstruction: "Distingue l’observation actuelle, l’analogie et sa limite.",
        process: [
          { label: "Observer", detail: "Des archées et bactéries actuelles vivent dans des milieux chauds, acides ou riches en sulfures." },
          { label: "Situer", detail: "Près des fumeurs, elles occupent surtout les gradients de mélange compatibles avec la vie." },
          { label: "Comparer", detail: "Minéraux, gradients et molécules réduites rappellent certains scénarios de Terre primitive." },
          { label: "Inférer prudemment", detail: "Une origine hydrothermale est possible, mais ce lieu n’est pas démontré de façon unique." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Milieu interactif",
          title: "Un fumeur hydrothermal et ses gradients habitables",
          instruction: "Sélectionne chaque repère pour distinguer le fluide brûlant de l’habitat microbien.",
          viewBox: "0 0 700 390",
          caption: "Figure originale redessinée d’après le texte sur les fumeurs océaniques et le scénario des sources chaudes.",
          zones: [
            { label: "Océan froid", xStart: 0, xEnd: 238 },
            { label: "Zone de mélange", xStart: 238, xEnd: 476 },
            { label: "Cheminée minérale", xStart: 476, xEnd: 700 },
          ],
          shapes: [
            { shape: "path", d: "M455 346 L493 175 L565 175 L604 346 Z", tone: "outline" },
            { shape: "path", d: "M500 177 C480 135 488 101 523 69 C561 105 572 139 555 177 Z", tone: "accent" },
            { shape: "path", d: "M493 177 C426 183 393 220 365 264", tone: "muted" },
            { shape: "path", d: "M559 177 C623 184 647 225 655 264", tone: "muted" },
            { shape: "circle", cx: 420, cy: 223, r: 13, tone: "soft" },
            { shape: "circle", cx: 390, cy: 253, r: 10, tone: "soft" },
            { shape: "circle", cx: 619, cy: 223, r: 12, tone: "soft" },
            { shape: "line", x1: 523, y1: 342, x2: 523, y2: 188, tone: "accent" },
            { shape: "text", x: 523, y: 365, content: "chaleur + minéraux", anchor: "middle" },
            { shape: "text", x: 179, y: 89, content: "eau océanique froide", anchor: "middle" },
            { shape: "text", x: 198, y: 260, content: "cellules dans la zone de mélange", anchor: "middle" },
          ],
          hotspots: [
            { id: "hot-fluid", number: 1, label: "Fluide hydrothermal", detail: "Il peut atteindre environ 350 °C à la sortie profonde : cette température n’est pas celle des cellules voisines.", x: 525, y: 88, highlight: [{ shape: "path", d: "M500 177 C480 135 488 101 523 69 C561 105 572 139 555 177 Z", tone: "accent" }] },
            { id: "chimney", number: 2, label: "Cheminée minérale", detail: "Ses sulfures et autres minéraux fournissent surfaces catalytiques, micropores et gradients chimiques.", x: 550, y: 250, highlight: [{ shape: "path", d: "M455 346 L493 175 L565 175 L604 346 Z", tone: "accent" }] },
            { id: "mixing", number: 3, label: "Zone de mélange", detail: "L’eau chaude se refroidit au contact de l’océan ; des températures compatibles avec les cellules apparaissent.", x: 420, y: 195, highlight: [{ shape: "path", d: "M493 177 C426 183 393 220 365 264", tone: "accent" }] },
            { id: "microbes", number: 4, label: "Microorganismes", detail: "Ils exploitent des réactions chimiques dans les gradients. Leur existence soutient une possibilité, pas une preuve du premier habitat.", x: 391, y: 228, highlight: [{ shape: "circle", cx: 390, cy: 253, r: 10, tone: "accent" }] },
          ],
          observation: "La source d’énergie et les minéraux sont au cœur de l’hypothèse ; la zone réellement habitée se situe dans un gradient, pas dans le jet le plus chaud.",
        },
        observation: "Une analogie soutient une hypothèse, mais elle ne reconstitue pas directement l’événement ancien.",
        check: choice("Que montre principalement l’existence d’extrêmophiles actuels ?", ["Que tous les premiers êtres vivants étaient des animaux", "Que l’océan primitif était riche en O₂", "Que toute évolution s’est arrêtée", "Que la vie peut fonctionner dans des milieux très contraignants"], 3, "Les extrêmophiles élargissent les conditions connues de fonctionnement d’une cellule."),
        extraQuestions: [
          choice("Quel est le nom correct du microorganisme thermoacidophile cité dans le cours ?", ["Sulfolobus", "Sulfoborus", "Salmonella solaire", "Stromatolite"], 0, "Le document contient une coquille ; Sulfolobus est une archée thermoacidophile.", "Texte 2 • page 2"),
          choice("À quel domaine appartient Sulfolobus ?", ["Aux animaux", "Aux végétaux", "Aux archées", "Aux virus uniquement"], 2, "Sulfolobus est une archée adaptée à la chaleur et à l’acidité."),
          trueFalse("Des cellules vivent directement dans le fluide hydrothermal à 350 °C.", false, "Les organismes vivent dans des zones de mélange plus froides ; 350 °C décrit le fluide à la sortie.", "Texte 2 • page 2"),
          choice("Quel élément d’un système hydrothermal peut favoriser la chimie prébiotique ?", ["L’absence de toute énergie", "Les gradients et les surfaces minérales", "La disparition de l’eau", "Une atmosphère moderne riche en O₂"], 1, "Les gradients fournissent de l’énergie et les minéraux peuvent concentrer ou catalyser des molécules."),
          choice("Quelle conclusion dépasse les données ?", ["Les extrêmophiles vivent dans des milieux contraignants", "Une origine hydrothermale est une hypothèse possible", "Les organismes actuels ont eux-mêmes évolué", "Le premier être vivant était nécessairement un Sulfolobus actuel"], 3, "Une espèce actuelle n’est pas un fossile vivant identique au premier organisme."),
          choice("Pourquoi les argiles figurent-elles dans le scénario du document ?", ["Elles peuvent offrir des surfaces de concentration et de réaction", "Elles prouvent la présence de mammifères", "Elles produisent seules une cellule", "Elles empêchent toute polymérisation"], 0, "Les surfaces minérales sont étudiées comme supports possibles, non comme organismes.", "Document 3 • pages 5-6"),
          choice("Quel enchaînement correspond à un raisonnement scientifique par analogie ?", ["Croire → affirmer → ignorer", "Observer → comparer → proposer une hypothèse → annoncer la limite", "Conclure → supprimer les données", "Copier → généraliser sans condition"], 1, "La limite fait partie du raisonnement et empêche de transformer une possibilité en certitude."),
        ],
        distractors: ["Un extrêmophile actuel est nécessairement le premier être vivant.", "Aucune cellule ne peut vivre près d’une source hydrothermale.", "Les milieux extrêmes prouvent que l’atmosphère primitive était identique à l’actuelle."],
        source: originOfLifeSource(
          "2 et 5-7",
          "Texte 2, sources chaudes, fumeurs océaniques, argiles et scénario expérimental",
          [
            "« Sulfoborus/Sulforobus » est corrigé en Sulfolobus, archée thermoacidophile plutôt que bactérie au sens moderne.",
            "Les organismes vivent dans les gradients refroidis autour des fluides hydrothermaux ; le rejet à 350 °C n’est pas présenté comme une température cellulaire.",
            "L’analogie avec les milieux primitifs soutient une hypothèse d’origine, sans identifier définitivement le lieu ni le premier organisme.",
          ],
        ),
      },
      {
        id: "experimental-origin",
        title: "Comprendre les faits expérimentaux",
        summary: "Démonter le montage de Miller-Urey, distinguer coacervat, polymère et cellule, puis formuler exactement ce que l’expérience démontre.",
        conceptTitle: "La chimie prébiotique produit des briques, pas encore la vie",
        explanation: "Oparin et Haldane ont proposé une accumulation de molécules organiques dans l’océan primitif. Miller et Urey ont montré qu’un apport d’énergie à des gaz simples pouvait former des acides aminés. Coacervats, polymères et structures microscopiques testent ensuite des étapes d’assemblage, sans reproduire une cellule autonome.",
        keyPoint: "Molécules simples + énergie → molécules organiques → assemblages et compartiments possibles ; information, métabolisme et reproduction restent à expliquer.",
        example: "La glycine obtenue dans le piège du montage est un produit organique abiotique ; elle ne se nourrit pas, ne se régule pas et ne se reproduit pas.",
        bodyMarkdown: `
## 1. L’hypothèse d’Oparin et Haldane

Le document date de 1920 une proposition commune d’« Oparin et Aldane ». Plus précisément, **Alexandre Oparin** développe son hypothèse à partir de 1924 et **J. B. S. Haldane** publie une proposition voisine en 1929. Ils imaginent une accumulation progressive de molécules organiques dans les eaux primitives : la **soupe prébiotique**.

Leur idée essentielle reste féconde : avant les cellules, une évolution **chimique** aurait produit puis sélectionné des systèmes moléculaires de plus en plus organisés.

## 2. Le montage de Miller-Urey en 1953

Le montage forme un circuit fermé :

1. un ballon d’eau chauffée représente l’océan ;
2. la vapeur traverse un mélange gazeux supposé représenter l’atmosphère ;
3. des électrodes produisent des étincelles, analogues à une source d’énergie ;
4. un réfrigérant condense la vapeur ;
5. un piège permet de prélever les produits sans les exposer continuellement aux étincelles.

L’expérience historique utilise notamment méthane, ammoniac, hydrogène et vapeur d’eau dans une atmosphère très réductrice. Elle produit plusieurs composés organiques, dont des acides aminés comme la glycine et l’alanine.

> **Ce que l’expérience montre :** une synthèse **abiotique** de briques organiques est possible dans certaines conditions.

> **Ce qu’elle ne montre pas :** elle ne reproduit pas avec certitude l’atmosphère réelle de toute la Terre primitive et ne fabrique pas une cellule vivante.

## 3. Une atmosphère primitive moins réductrice

Les modèles ultérieurs donnent davantage de place au CO₂, au N₂ et à la vapeur d’eau, avec moins de méthane et d’ammoniac que dans le montage historique. Le document écrit qu’elle était « moins riche en méthane et en ammoniac qu’aujourd’hui » : c’est une formulation inversée, car l’atmosphère actuelle en contient très peu. Il faut lire : **moins riche que le mélange fortement réducteur supposé par l’expérience initiale**.

Des expériences adaptées continuent d’obtenir des molécules organiques, avec des rendements variables. La découverte de molécules carbonées et d’acides aminés dans certaines météorites montre aussi que cette chimie n’est pas limitée à la Terre.

## 4. Coacervats, polymères et structures ressemblant à des cellules

- Un **coacervat** est une gouttelette formée par séparation de phase entre molécules en solution. Ce n’est pas un simple « enchaînement d’acides aminés » et ce n’est pas une cellule.
- La **polymérisation** assemble des monomères en macromolécules : peptides, acides nucléiques ou autres polymères selon les conditions.
- Le document décrit une structure sphérique d’environ 2 µm obtenue à 250 °C et 130 atmosphères. Une ressemblance de forme avec un microorganisme ne démontre ni métabolisme, ni information héréditaire, ni reproduction.

## 5. Le seuil du vivant

Pour passer d’un assemblage chimique à une cellule, plusieurs fonctions doivent être coordonnées :

| Fonction | Rôle minimal |
|---|---|
| compartiment lipidique | séparer un milieu interne tout en permettant des échanges |
| information héréditaire | conserver et transmettre des instructions avec possibilité de variation |
| catalyse et métabolisme | accélérer des réactions et utiliser une source d’énergie |
| autorégulation | maintenir une organisation malgré les variations du milieu |
| reproduction | produire des descendants auxquels l’information est transmise |

Le document reconnaît correctement que le passage exact de la matière organique aux premières cellules reste **inconnu** et étudié par plusieurs hypothèses, dont le monde à ARN et les scénarios métabolisme d’abord.

> **Astuce mémoire - CAPRI :** **C**ompartiment, **A**utorégulation, **P**roduction d’énergie, **R**eproduction, **I**nformation.
`,
        processTitle: "De la matière minérale aux premières cellules",
        processInstruction: "Suis les étapes du scénario sans confondre molécule organique et être vivant.",
        process: [
          { label: "Molécules simples", detail: "Eau, CO₂, N₂, CH₄, NH₃ ou H₂ selon les scénarios reçoivent de l’énergie." },
          { label: "Briques organiques", detail: "Acides aminés, bases et autres composés peuvent apparaître puis s’accumuler." },
          { label: "Polymères", detail: "Des réactions d’assemblage peuvent produire des macromolécules." },
          { label: "Compartiments", detail: "Des lipides ou des phénomènes de séparation de phase isolent un milieu interne." },
          { label: "Système vivant", detail: "Information, catalyse, métabolisme, autorégulation et reproduction doivent fonctionner ensemble." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Montage interactif",
          title: "Le circuit fermé de Miller-Urey",
          instruction: "Sélectionne chaque pièce pour suivre l’eau, les gaz, l’énergie et les produits.",
          viewBox: "0 0 700 420",
          caption: "Figure originale redessinée d’après le montage de Miller-Urey présenté dans le document officiel.",
          shapes: [
            { shape: "circle", cx: 165, cy: 300, r: 66, tone: "soft" },
            { shape: "ellipse", cx: 446, cy: 119, rx: 100, ry: 72, tone: "soft" },
            { shape: "path", d: "M204 245 C245 187 289 135 346 119", tone: "outline" },
            { shape: "path", d: "M447 191 C456 234 462 265 447 301", tone: "outline" },
            { shape: "path", d: "M447 301 C410 346 296 357 226 330", tone: "outline" },
            { shape: "line", x1: 399, y1: 91, x2: 468, y2: 137, tone: "accent" },
            { shape: "line", x1: 489, y1: 90, x2: 423, y2: 138, tone: "accent" },
            { shape: "path", d: "M456 220 C498 218 527 239 531 273 C532 305 507 326 475 326", tone: "muted" },
            { shape: "ellipse", cx: 326, cy: 338, rx: 62, ry: 29, tone: "accent" },
            { shape: "text", x: 165, y: 297, content: "eau chauffée", anchor: "middle" },
            { shape: "text", x: 165, y: 320, content: "océan", anchor: "middle" },
            { shape: "text", x: 446, y: 65, content: "gaz + étincelles", anchor: "middle" },
            { shape: "text", x: 565, y: 274, content: "réfrigérant", anchor: "middle" },
            { shape: "text", x: 326, y: 343, content: "piège à produits", anchor: "middle" },
          ],
          hotspots: [
            { id: "ocean", number: 1, label: "Ballon d’eau", detail: "L’eau en ébullition représente l’océan et fournit une circulation continue de vapeur.", x: 163, y: 250, highlight: [{ shape: "circle", cx: 165, cy: 300, r: 66, tone: "accent" }] },
            { id: "atmosphere", number: 2, label: "Mélange gazeux", detail: "Le mélange historique est fortement réducteur ; il ne constitue qu’un modèle parmi plusieurs atmosphères primitives possibles.", x: 367, y: 71, highlight: [{ shape: "ellipse", cx: 446, cy: 119, rx: 100, ry: 72, tone: "accent" }] },
            { id: "energy", number: 3, label: "Étincelles", detail: "Les électrodes apportent de l’énergie et déclenchent des réactions entre les molécules simples.", x: 446, y: 119, highlight: [{ shape: "line", x1: 399, y1: 91, x2: 468, y2: 137, tone: "accent" }, { shape: "line", x1: 489, y1: 90, x2: 423, y2: 138, tone: "accent" }] },
            { id: "condenser", number: 4, label: "Réfrigérant", detail: "Il refroidit la vapeur et simule le retour de la pluie vers l’océan.", x: 531, y: 236, highlight: [{ shape: "path", d: "M456 220 C498 218 527 239 531 273 C532 305 507 326 475 326", tone: "accent" }] },
            { id: "trap", number: 5, label: "Piège", detail: "Il recueille les produits organiques, dont des acides aminés, et les protège d’une destruction continue par les étincelles.", x: 326, y: 309, highlight: [{ shape: "ellipse", cx: 326, cy: 338, rx: 62, ry: 29, tone: "accent" }] },
          ],
          observation: "Le montage teste une réaction chimique dans un modèle contrôlé : il ne reconstitue ni toute la planète ni une cellule complète.",
        },
        observation: "Une expérience valide la possibilité d’une étape ; elle ne démontre pas nécessairement tout le scénario historique.",
        check: choice("Qu’a montré l’expérience de Miller-Urey ?", ["La création complète d’un être vivant", "La formation possible de molécules organiques dans des conditions simulées", "L’impossibilité de la chimie prébiotique", "Une atmosphère primitive riche en O₂"], 1, "Des molécules organiques ont été obtenues abiotiquement, mais aucune cellule vivante n’a été créée."),
        extraQuestions: [
          choice("Quel élément du montage représente l’océan primitif ?", ["Les électrodes", "Le réfrigérant", "Le ballon d’eau chauffée", "Le robinet de prélèvement"], 2, "L’évaporation et la condensation font circuler l’eau dans le système.", "Figure 1, montage de Miller-Urey • pages 4 et 7"),
          choice("À quoi servent les étincelles ?", ["À fournir une source d’énergie aux réactions", "À fabriquer directement une membrane", "À supprimer tous les gaz", "À prouver la reproduction"], 0, "Elles simulent une source d’énergie comme les décharges électriques.", "Texte expérimental • page 3"),
          choice("Quels produits organiques sont explicitement cités dans le document ?", ["Amidon et cellulose uniquement", "ADN humain complet", "Cholestérol et hémoglobine", "Glycine et alanine"], 3, "Ces deux acides aminés figurent parmi les produits mentionnés.", "Texte expérimental • page 3"),
          choice("Qu’est-ce qu’un coacervat ?", ["Une cellule prouvée vieille de 4 milliards d’années", "Une gouttelette issue d’une séparation de phase entre molécules", "Un simple enchaînement d’acides aminés nécessairement enzymatique", "Un fossile de vertébré"], 1, "Un coacervat peut compartimenter des molécules, mais ne possède pas à lui seul toutes les fonctions du vivant.", "Texte expérimental • page 3"),
          trueFalse("La ressemblance d’une structure de 2 µm avec un microorganisme suffit à prouver qu’elle est vivante.", false, "Il faut démontrer métabolisme, autorégulation, information héréditaire et reproduction, pas seulement une forme.", "Figures 1-2 et texte • pages 3-4"),
          choice("Comment corriger la phrase « l’atmosphère primitive était moins riche en méthane et ammoniac qu’aujourd’hui » ?", ["Elle était probablement moins riche en CH₄ et NH₃ que le mélange très réducteur de Miller, pas que l’atmosphère actuelle", "Elle contenait exactement 100 % de méthane", "L’atmosphère actuelle est surtout composée d’ammoniac", "Aucune correction n’est nécessaire"], 0, "L’atmosphère moderne contient très peu de CH₄ et de NH₃ ; la comparaison pertinente porte sur le modèle historique fortement réducteur.", "Texte expérimental • pages 3-5"),
          choice("Que prouve la présence de molécules organiques dans certaines météorites ?", ["Que les météorites sont vivantes", "Que toute la vie terrestre vient obligatoirement de l’espace", "Qu’une chimie organique peut aussi se produire hors de la Terre", "Que l’eau est inutile"], 2, "C’est un apport possible de constituants, pas une preuve de panspermie cellulaire.", "Texte expérimental • page 3"),
          choice("Quelle propriété manque à une simple collection de macromolécules pour former un système vivant ?", ["Une couleur rouge", "Une organisation coordonnant information, métabolisme et reproduction", "Une masse supérieure à un kilogramme", "Un squelette"], 1, "La vie résulte d’un système organisé, pas de la seule présence de molécules.", "Interprétation • page 5"),
          trueFalse("Le document reconnaît que le passage exact de l’inanimé aux premières cellules reste inconnu.", true, "Il précise que les témoignages sont indirects et que les modalités exactes ne sont pas établies.", "Interprétation • page 5"),
          choice("Quel mot désigne l’assemblage de monomères en macromolécules ?", ["Respiration", "Oxydation", "Polymérisation", "Sédimentation"], 2, "La polymérisation relie des unités répétées pour former un polymère.", "Interprétation • page 5"),
        ],
        distractors: ["Un acide aminé isolé est déjà une cellule vivante.", "Les expériences prébiotiques ont reconstitué avec certitude toute l’histoire de la vie.", "Les molécules organiques ne peuvent provenir que d’un organisme vivant."],
        source: originOfLifeSource(
          "3-5 et 7",
          "Oparin-Haldane, Miller-Urey, coacervats, météorites, polymérisation et limites expérimentales",
          [
            "Oparin et Haldane sont nommés correctement et leurs propositions sont situées respectivement à partir de 1924 et en 1929 plutôt qu’en 1920 comme une hypothèse commune.",
            "Un coacervat est une gouttelette de séparation de phase, non un enchaînement d’acides aminés doté automatiquement de propriétés enzymatiques.",
            "La comparaison de l’atmosphère primitive est rétablie par rapport au mélange fortement réducteur de Miller, l’atmosphère actuelle étant très pauvre en méthane et en ammoniac.",
            "La structure de 2 µm obtenue à haute température et haute pression est décrite comme un objet d’apparence cellulaire, sans preuve de vie.",
          ],
        ),
      },
    ],
    mission: {
      title: "Reconstruire le passage des molécules à une protocellule",
      scenario: "Le document officiel associe énergie solaire, éclairs, atmosphère primitive, sources chaudes, argiles, comètes et météorites. Il fait converger ces apports vers des molécules organiques, puis vers protéines, lipides, acides nucléiques, membrane et vie. Exploite ce modèle sans présenter une simple association de molécules comme une cellule déjà vivante.",
      problem: "Comment l’espace, l’océan et la chimie prébiotique peuvent-ils fournir les constituants d’une protocellule, et quelle étape reste encore à expliquer ?",
      bodyMarkdown: `
## Document de mission redessiné sous forme de chaîne explicative

| Entrées du scénario | Action proposée | Produits ou fonctions possibles |
|---|---|---|
| atmosphère primitive, eau, CO₂, N₂ et autres gaz selon les hypothèses | énergie solaire, éclairs, chaleur et gradients chimiques | petites molécules organiques réactives |
| comètes et météorites | apport extraterrestre de molécules carbonées | enrichissement du stock organique |
| sources chaudes et surfaces d’argiles | concentration, catalyse et réactions d’assemblage | acides aminés, sucres, bases et phosphates puis polymères |
| lipides | auto-assemblage en bicouche | compartiment séparant intérieur et extérieur |
| acides nucléiques ou molécules apparentées | stockage, copie et variation d’information | hérédité possible |
| protéines ou autres catalyseurs | accélération des réactions | réseau métabolique possible |

## Réponse modèle aux trois consignes officielles

### 1. Éléments et matériaux venant de l’espace

Le schéma cite les **comètes** et les **météorites** comme matériaux pouvant apporter des molécules carbonées. L’énergie solaire et les éclairs sont des **sources d’énergie**, pas des matériaux.

### 2. Lieu proposé

Le document localise principalement la chimie prébiotique dans **l’océan primitif**, notamment près des sources chaudes et au contact de surfaces minérales comme les argiles. D’autres scénarios scientifiques existent ; le schéma présente une possibilité.

### 3. Association des constituants

Les lipides peuvent former une membrane qui compartimente le milieu. Des acides nucléiques portent une information transmissible ; des protéines ou d’autres catalyseurs accélèrent des réactions. Leur coordination peut former une **protocellule** capable d’échanges et d’une chimie interne.

Cependant, la flèche « protéines + lipides + acides nucléiques + membrane → vie » est trop rapide si elle laisse penser qu’un simple mélange suffit. Il faut encore expliquer l’apparition conjointe de la réplication, de l’hérédité avec variations, d’un métabolisme alimenté en énergie et de l’autorégulation.

> **Davy te souffle la méthode :** nomme d’abord les apports, localise le milieu, attribue un rôle à chaque famille de molécules, puis termine par la limite scientifique.
`,
      investigation: [
        { label: "Inventorier", detail: "Sépare les matériaux, les molécules simples et les sources d’énergie du schéma." },
        { label: "Localiser", detail: "Repère l’océan, les sources chaudes et les surfaces minérales." },
        { label: "Attribuer les rôles", detail: "Membrane, information héréditaire et catalyse ne remplissent pas la même fonction." },
        { label: "Assembler", detail: "Construis une protocellule comme système coordonné plutôt qu’une liste de molécules." },
        { label: "Limiter", detail: "Annonce que le passage historique exact à la première cellule reste inconnu." },
      ],
      interaction: {
        kind: "diagram",
        eyebrow: "Scénario interactif",
        title: "Des apports prébiotiques à une protocellule",
        instruction: "Ouvre chaque fonction puis vérifie ce qui manque encore pour parler de vie.",
        rootLabel: "Protocellule",
        rootDetail: "Un compartiment chimique organisé, modèle intermédiaire entre assemblage moléculaire et cellule vivante.",
        nodes: [
          { id: "inputs", label: "Apports", role: "Fournir les briques", detail: "Atmosphère, océan, sources chaudes, argiles, comètes et météorites alimentent une chimie organique possible.", group: "Avant le compartiment" },
          { id: "membrane", label: "Lipides", role: "Compartimenter", detail: "Une bicouche sépare un intérieur tout en autorisant des échanges sélectifs.", group: "Organisation" },
          { id: "information", label: "Acides nucléiques", role: "Informer et varier", detail: "Un support copiable permet hérédité et variations sur lesquelles une sélection peut agir.", group: "Organisation" },
          { id: "catalysis", label: "Catalyseurs", role: "Accélérer", detail: "Protéines, ARN catalytiques ou minéraux peuvent favoriser des réactions reliées en réseau.", group: "Fonctionnement" },
          { id: "energy", label: "Métabolisme", role: "Utiliser l’énergie", detail: "Le système doit entretenir son organisation en couplant réactions et source d’énergie.", group: "Fonctionnement" },
          { id: "reproduction", label: "Réplication", role: "Transmettre", detail: "La reproduction avec variation rend possible une évolution darwinienne durable.", group: "Seuil du vivant" },
        ],
        observation: "Aucune brique ne suffit seule : c’est le couplage durable entre compartiment, information, énergie et reproduction qui constitue le problème central.",
      },
      modelAnswer: "Comètes, météorites, atmosphère, sources d’énergie et surfaces minérales peuvent fournir ou concentrer des briques organiques dans l’océan primitif. Les lipides compartimentent, les acides nucléiques portent une information et des catalyseurs organisent les réactions. Ce scénario rend une protocellule plausible, mais le passage exact à un système autorégulé et reproducteur reste inconnu.",
      questions: [
        choice("Consigne officielle 1 - Quels matériaux de l’espace sont cités dans le scénario ?", ["Les nerfs et les muscles", "Les couches rouges et les os", "Les comètes et les météorites", "Les chromosomes sexuels"], 2, "Comètes et météorites peuvent transporter des molécules carbonées.", "Situation d’évaluation, consigne 1 • page 6"),
        choice("Consigne officielle 2 - Où le document localise-t-il principalement la chimie conduisant aux constituants du vivant ?", ["Dans le noyau d’une étoile", "Dans l’océan primitif, notamment près de sources chaudes et de surfaces minérales", "Dans un organisme pluricellulaire déjà formé", "Uniquement dans l’atmosphère moderne"], 1, "Le schéma fait converger les apports vers l’océan primitif.", "Situation d’évaluation, consigne 2 • page 6"),
        choice("Consigne officielle 3 - Quelle association décrit le mieux une protocellule plausible ?", ["Une roche rouge sans eau", "Un acide aminé isolé", "Une membrane vide sans chimie interne", "Un compartiment lipidique associant information héréditaire, catalyse et utilisation d’énergie"], 3, "La cellule exige une organisation fonctionnelle coordonnée.", "Situation d’évaluation, consigne 3 • page 6"),
      ],
      extraQuestions: [
        choice("Dans le schéma, quel élément est une source d’énergie plutôt qu’un matériau ?", ["Une météorite", "Une comète", "Un éclair", "Une molécule organique"], 2, "L’éclair apporte de l’énergie aux réactions ; il n’est pas incorporé comme constituant.", "Document 3 • pages 5-6"),
        choice("Quel est le rôle principal d’une membrane lipidique primitive ?", ["Compartimenter un milieu interne", "Créer à elle seule toute l’information", "Remplacer l’eau", "Prouver l’âge de la Terre"], 0, "La compartimentation rapproche et protège des réactions tout en permettant des échanges.", "Situation d’évaluation, consigne 3 • page 6"),
        choice("Quel constituant est le plus directement associé au stockage d’une information héréditaire ?", ["L’oxyde de fer", "Un acide nucléique ou polymère informationnel", "Une couche rouge", "Le dioxygène seul"], 1, "Une information copiable est nécessaire à l’hérédité et à l’évolution."),
        trueFalse("Mélanger protéines, lipides et acides nucléiques suffit automatiquement à créer une cellule vivante.", false, "Il faut une organisation couplant compartiment, information, métabolisme, autorégulation et reproduction.", "Document 3 et consigne 3 • pages 5-6"),
        choice("Pourquoi les expériences prébiotiques complètent-elles les archives rocheuses ?", ["Elles remplacent tous les faits historiques", "Elles suppriment l’incertitude", "Elles testent si certaines étapes chimiques sont possibles", "Elles prouvent que la Terre n’a jamais eu d’océan"], 2, "Les archives indiquent ce qui s’est passé dans le milieu ; les expériences testent des mécanismes possibles."),
        choice("Quelle conclusion finale respecte le mieux le cours ?", ["La première cellule historique a été recréée", "Les données soutiennent plusieurs étapes possibles, mais la transition exacte vers la première cellule reste inconnue", "Aucune molécule organique ne peut se former sans vie", "Les extrêmophiles sont nécessairement les ancêtres directs de tous les êtres vivants"], 1, "Une bonne conclusion associe les acquis et la limite.", "Conclusion générale • page 5"),
        choice("Comment appelle-t-on l’organisation cellulaire sans noyau individualisé attribuée aux premières formes connues ?", ["Organisation procaryote", "Organisation vertébrée", "Organisation florale", "Organisation placentaire"], 0, "Les procaryotes ne possèdent pas de noyau entouré d’une enveloppe.", "Conclusion générale • page 5"),
      ],
      source: originOfLifeSource(
        "5-7",
        "Document 3, situation d’évaluation officielle et documentation",
        [
          "La flèche directe « protéines + lipides + acides nucléiques + membrane → vie » est explicitée : une organisation coordonnant compartiment, information, énergie, autorégulation et reproduction est nécessaire.",
          "L’énergie solaire et les éclairs sont distingués des matériaux apportés par les comètes et météorites.",
          "Le document est traité comme un scénario possible centré sur l’océan primitif, non comme la preuve d’un lieu unique et définitivement établi.",
        ],
      ),
    },
  };

export const terminalASvtOriginOfLifePath = createSvtPath(course);
