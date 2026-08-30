import type { LessonQuestion, LessonSourceMetadata } from "../domain/paths";
import type { HumanitiesCourseSeed } from "./humanitiesPathFactory";
import { createHumanitiesPath } from "./humanitiesPathFactory";

const q = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel?: string,
  points = 1,
): LessonQuestion => ({ prompt, options, correctIndex, explanation, sourceLabel, points });

const unitedNationsCourse = {
  id: "terminale-hg-h1-united-nations",
  strand: "Histoire",
  chapterNumber: 1,
  themeNumber: 1,
  themeTitle: "Les relations internationales de 1945 à nos jours",
  title: "L’Organisation des Nations Unies (ONU)",
  description: "Retracer la création de l’ONU, comprendre son fonctionnement et apprécier avec méthode le bilan de ses actions.",
  sections: [
    {
      id: "creation-principles",
      title: "Création, objectifs et principes",
      summary: "Reconstituer la naissance de l’ONU et distinguer les buts de l’organisation des règles qui guident ses membres.",
      conceptTitle: "De la coalition de guerre à une organisation universelle",
      explanation: "Entre 1941 et 1945, déclarations, conférences diplomatiques et négociations transforment progressivement une alliance de guerre en une organisation chargée de la paix et de la coopération.",
      bodyMarkdown: String.raw`## Une construction progressive, corrigée et datée

La Seconde Guerre mondiale consacre l’échec de la **Société des Nations (SDN)**. Les Alliés cherchent alors un système plus universel et plus opérant. Le tableau du document donne la bonne trame générale, mais il mélange plusieurs participants et plusieurs dates : voici la chronologie rétablie.

| Date | Rencontre ou texte | Acteurs essentiels | Portée pour la future ONU |
|---|---|---|---|
| 14 août 1941 | Charte de l’Atlantique | Franklin D. Roosevelt et Winston Churchill | Énonce des principes communs et envisage un système général de sécurité ; elle ne crée pas encore l’ONU. |
| 1er janvier 1942 | Déclaration des Nations Unies, Washington | 26 États en guerre contre l’Axe, dont États-Unis, Royaume-Uni, URSS et Chine | Emploie officiellement l’expression « Nations Unies » et reprend les principes de la Charte de l’Atlantique. |
| 18 octobre-1er novembre 1943 | Conférence de Moscou | Gouvernements des États-Unis, du Royaume-Uni, de l’URSS et de la Chine | Affirme explicitement la nécessité d’une organisation internationale fondée sur l’égalité souveraine. |
| 28 novembre-1er décembre 1943 | Conférence de Téhéran | Roosevelt, Churchill et Staline | Confirme la volonté politique de construire une paix durable après la guerre. |
| 21 août-7 octobre 1944 | Dumbarton Oaks | Délégations américaine, britannique, soviétique puis chinoise | Prépare les propositions sur les organes et le fonctionnement de la future organisation. |
| 4-11 février 1945 | Yalta | Roosevelt, Churchill et Staline | Arrête la formule de vote du futur Conseil de sécurité et convoque la conférence de San Francisco. |
| 25 avril-26 juin 1945 | Conférence de San Francisco | Délégués de 50 États | Adopte et signe la Charte le 26 juin ; la Pologne signe ensuite et rejoint les **51 membres originels**. |
| 24 octobre 1945 | Entrée en vigueur de la Charte | Ratification, notamment, par les cinq futurs permanents | Naissance juridique et début officiel de l’ONU. |

> **Correction du document — conférences de 1943 à 1945.** Moscou associe quatre gouvernements ; Mao Zedong ne participe pas à Téhéran ; Yalta réunit encore **Roosevelt**, mort seulement le 12 avril 1945. Truman participe ensuite à **Potsdam** (17 juillet-2 août 1945), conférence importante pour l’après-guerre mais postérieure à la signature de la Charte : elle n’est pas une étape constitutive équivalente à San Francisco.

> **Deux dates à ne plus confondre.** Le 26 juin 1945 est la date de **signature** de la Charte ; le 24 octobre 1945 est celle de son **entrée en vigueur**. Le siège principal est établi à New York, mais ce lieu ne définit pas la date de création.

Les quatre États africains présents à San Francisco sont l’Afrique du Sud, l’Égypte, l’Éthiopie et le Liberia. Leur faible nombre rappelle qu’en 1945 la majeure partie du continent est encore colonisée.

## Les quatre buts de la Charte

1. Maintenir la **paix et la sécurité internationales**.
2. Développer entre les nations des relations amicales fondées sur l’égalité de droits et le **droit des peuples à disposer d’eux-mêmes**.
3. Réaliser la **coopération internationale** dans les domaines économique, social, culturel et humanitaire, et promouvoir les droits humains.
4. Être un centre où s’harmonisent les efforts des nations vers ces fins communes.

## Les principes qui encadrent l’action

- égalité souveraine des États membres ;
- exécution de bonne foi des obligations de la Charte ;
- règlement pacifique des différends ;
- interdiction de la menace ou de l’emploi de la force contraire à la Charte ;
- assistance apportée à l’ONU dans les actions conformes à la Charte ;
- principe de non-intervention dans les affaires relevant essentiellement de la compétence nationale, **sans neutraliser les mesures coercitives du chapitre VII**.

> **Astuce mémoire.** Un **but** répond à « pour quoi faire ? » ; un **principe** répond à « selon quelle règle agir ? ». La paix est un but ; l’égalité souveraine est un principe.`,
      keyPoint: "L’ONU naît juridiquement le 24 octobre 1945 ; ses buts indiquent ce qu’elle cherche à accomplir et ses principes encadrent la conduite des États.",
      example: "Yalta fixe la formule de vote du Conseil de sécurité ; San Francisco adopte la Charte ; la ratification permet son entrée en vigueur.",
      timelineTitle: "Les jalons de la création de l’ONU",
      timelineInstruction: "Sélectionne chaque repère pour distinguer déclaration d’intention, négociation institutionnelle, signature et entrée en vigueur.",
      timeline: [
        { label: "14 août 1941 — Charte de l’Atlantique", shortLabel: "1941", detail: "Roosevelt et Churchill publient des principes communs et envisagent un système général de sécurité." },
        { label: "1er janvier 1942 — Déclaration des Nations Unies", shortLabel: "1942", detail: "Vingt-six États alliés adoptent l’expression « Nations Unies » et s’engagent contre l’Axe." },
        { label: "1943 — Moscou puis Téhéran", shortLabel: "1943", detail: "Moscou formule la nécessité d’une organisation universelle ; Téhéran confirme l’engagement politique des trois grands Alliés." },
        { label: "1944 — Dumbarton Oaks", shortLabel: "1944", detail: "Des délégations préparent l’architecture et les règles de la future organisation." },
        { label: "4-11 février 1945 — Yalta", shortLabel: "Yalta", detail: "Roosevelt, Churchill et Staline s’accordent sur la formule de vote et la conférence fondatrice." },
        { label: "25 avril-26 juin 1945 — San Francisco", shortLabel: "Charte", detail: "Cinquante États élaborent puis signent la Charte ; la Pologne devient ensuite le 51e membre originel." },
        { label: "24 octobre 1945 — Entrée en vigueur", shortLabel: "ONU", detail: "La Charte ratifiée entre en vigueur : l’Organisation des Nations Unies existe juridiquement." },
      ],
      observation: "La création n’est pas un événement unique : elle va des principes de 1941 à l’entrée en vigueur de la Charte en octobre 1945.",
      check: q(
        "L’ONU est-elle une initiative française ?",
        ["Non : elle résulte d’un processus multilatéral conduit d’abord par les Alliés", "Oui : la France la décide seule en 1941", "Oui : elle est créée à Paris", "Oui : elle succède à une organisation française"],
        0,
        "La France fait partie des membres originels, mais l’ONU résulte d’une construction multilatérale amorcée notamment par Roosevelt et Churchill.",
      ),
      extraQuestions: [
        q("La Déclaration des Nations Unies est adoptée le 1er janvier 1942.", ["Vrai", "Faux"], 0, "Vingt-six États la signent à Washington.", "Activité d’application n°1, p. 3 — affirmation 2"),
        q("L’ONU est créée juridiquement le 26 juin 1945.", ["Vrai", "Faux"], 1, "La Charte est signée le 26 juin ; elle entre en vigueur le 24 octobre 1945.", "Activité d’application n°1, p. 3 — affirmation 3", 2),
        q("Le principal but de l’ONU est de maintenir la paix et la sécurité internationales.", ["Vrai", "Faux"], 0, "C’est le premier but énoncé par la Charte.", "Activité d’application n°1, p. 3 — affirmation 4"),
        q("L’égalité souveraine de tous les États membres est un objectif de l’ONU.", ["Vrai", "Faux"], 1, "Il s’agit d’un principe de fonctionnement, non d’un but.", "Activité d’application n°1, p. 3 — affirmation 5", 2),
        q("La non-intervention dans les affaires intérieures est un principe de la Charte.", ["Vrai", "Faux"], 0, "L’article 2 § 7 l’énonce, avec l’exception des mesures du chapitre VII.", "Activité d’application n°1, p. 3 — affirmation 6", 2),
        q("L’ONU est une initiative exclusivement française.", ["Vrai", "Faux"], 1, "Son origine est multilatérale et liée aux Alliés ; la France fait partie des membres originels sans être l’unique initiatrice.", "Activité d’application n°1, p. 3 — affirmation 1"),
        q("La Charte de l’Atlantique est signée le 14 août 1942.", ["Vrai", "Faux"], 1, "Elle date du 14 août **1941**.", "Exercice d’application 1, p. 10 — affirmation 1"),
        q("« L’ONU a été créée le 26 juin 1945 et son siège est New York » est une affirmation entièrement juste.", ["Vrai", "Faux"], 1, "Le siège est à New York, mais le 26 juin est la signature de la Charte ; son entrée en vigueur date du 24 octobre.", "Exercice d’application 1, p. 10 — affirmation 2", 2),
        q("L’ONU existe juridiquement depuis le 24 octobre 1945.", ["Vrai", "Faux"], 0, "La Charte entre alors en vigueur.", "Exercice d’application 1, p. 10 — affirmation 3"),
        q("La protection des droits humains est l’unique but principal de la création de l’ONU.", ["Vrai", "Faux"], 1, "La paix et la sécurité constituent le premier but ; droits humains et coopération font partie d’un ensemble de quatre buts.", "Exercice d’application 1, p. 10 — affirmation 4", 2),
        q("Assister l’ONU dans les actions conformes à la Charte fait partie des principes applicables aux membres.", ["Vrai", "Faux"], 0, "Cette formulation précise l’idée ambiguë de « participer aux actions » présente dans l’exercice.", "Exercice d’application 1, p. 10 — affirmation 5", 2),
      ],
      distractors: [
        "L’ONU est créée par la conférence de Potsdam après la guerre.",
        "Ses objectifs et ses principes sont deux listes synonymes.",
        "La Charte entre en vigueur dès la Charte de l’Atlantique.",
      ],
    },
    {
      id: "organs",
      title: "Le fonctionnement des organes",
      summary: "Relier chacun des six organes principaux à sa composition, à ses compétences et à son mode de décision.",
      conceptTitle: "Six organes, des compétences complémentaires",
      explanation: "L’ONU ne forme ni un État mondial ni une armée permanente : ses organes délibèrent, décident, coordonnent, jugent ou exécutent selon les pouvoirs que leur attribue la Charte.",
      bodyMarkdown: String.raw`## Les six organes principaux

| Organe | Composition ou direction | Fonction essentielle | Précision à retenir |
|---|---|---|---|
| Assemblée générale | Les 193 États membres, une voix chacun | Délibération, budget, élections et recommandations | Ses recommandations ne sont généralement pas contraignantes, mais ses décisions budgétaires et internes ont des effets propres. |
| Conseil de sécurité | 5 permanents + 10 non-permanents élus pour deux ans | Responsabilité principale de la paix et de la sécurité | Une décision requiert **neuf voix** ; sur le fond, le vote négatif d’un permanent constitue un veto. |
| Secrétariat | Secrétaire général et personnel international | Travail quotidien, administration, diplomatie et mise en œuvre des mandats | Le secrétaire général est **nommé** par l’Assemblée générale sur recommandation du Conseil pour cinq ans renouvelables. |
| Conseil économique et social (ECOSOC) | 54 États élus pour trois ans | Coordination économique, sociale et environnementale | Il travaille avec commissions, experts et institutions spécialisées. |
| Cour internationale de Justice (CIJ) | 15 juges élus séparément par l’Assemblée et le Conseil pour neuf ans | Différends juridiques entre États et avis consultatifs | Elle siège à La Haye ; les individus ne la saisissent pas comme une juridiction pénale. |
| Conseil de tutelle | Les cinq membres permanents du Conseil de sécurité | Supervisait onze territoires sous tutelle vers l’autonomie | Il suspend ses opérations le 1er novembre 1994 après l’indépendance des Palaos. |

> **Correction du document — vote du Conseil.** Il ne décide pas à la « majorité simple ». Les questions de procédure exigent neuf voix ; les autres exigent neuf voix et l’absence de veto d’un permanent. L’abstention d’un permanent ne bloque pas automatiquement le texte.

> **Correction du document — moyens d’action.** Recommandation d’un règlement pacifique, sanctions sans emploi de la force, autorisation de recourir à la force et opération de maintien de la paix sont des mécanismes distincts. Les **casques bleus** ne sont pas une armée mondiale ni le dernier degré automatique d’une intervention armée.

> **Correction du document — tutelle.** Le Kosovo et le Timor-Leste ont connu des **administrations transitoires** de l’ONU, mais n’étaient pas des territoires du Conseil de tutelle.

## Les secrétaires généraux

| Secrétaire général | État d’origine | Mandat |
|---|---|---|
| Trygve Lie | Norvège | 1946-1952 |
| Dag Hammarskjöld | Suède | 1953-1961 |
| **U Thant** | Birmanie, aujourd’hui Myanmar | 1961-1971 |
| Kurt Waldheim | Autriche | 1972-1981 |
| Javier Pérez de Cuéllar | Pérou | 1982-1991 |
| Boutros Boutros-Ghali | Égypte | 1992-1996 |
| Kofi Annan | Ghana | 1997-2006 |
| Ban Ki-moon | République de Corée | 2007-2016 |
| António Guterres | Portugal | 2017-2026, deux mandats |

Le document écrit « Sithu U Than » : le nom public officiel est **U Thant**. Kofi Annan et l’ONU reçoivent conjointement le prix Nobel de la paix en 2001.

## Ne pas confondre les familles du système des Nations Unies

- **Institutions spécialisées autonomes liées à l’ONU :** OIT, FAO, UNESCO, OACI, UPU, OMS, FMI, Banque mondiale…
- **Fonds, programmes, offices ou autres entités onusiennes :** PNUD, UNICEF, PAM, HCR, HCDH…
- **Organisation apparentée :** AIEA.
- **Organes distincts du commerce mondial :** la CNUCED est créée par l’Assemblée générale en **1964** et appartient au Secrétariat de l’ONU ; le GATT de 1947 n’est pas devenu la CNUCED. Le système du GATT est remplacé institutionnellement par l’**OMC en 1995**.

> **Méthode.** Dans une copie, présente toujours un organe avec trois informations : sa **composition**, sa **fonction** et une **règle de décision** ou un exemple.`,
      interaction: {
        kind: "diagram",
        eyebrow: "Explorer",
        title: "L’architecture institutionnelle de l’ONU",
        instruction: "Sélectionne un organe ou une famille pour comparer composition, compétence et limites.",
        observation: "L’Assemblée représente tous les États ; le Conseil porte la responsabilité principale de la paix ; le Secrétariat met en œuvre les mandats.",
        rootLabel: "Organisation des Nations Unies",
        rootDetail: "Six organes principaux, complétés par un système de fonds, programmes et institutions spécialisées",
        nodes: [
          { id: "ag", group: "Organes principaux", label: "Assemblée générale", role: "Délibérer et représenter", detail: "193 États, une voix chacun. Elle adopte le budget, élit des membres d’organes, nomme le secrétaire général sur recommandation du Conseil et formule des recommandations." },
          { id: "cs", group: "Organes principaux", label: "Conseil de sécurité", role: "Paix et sécurité", detail: "Quinze membres. Il faut neuf voix ; sur le fond, un vote négatif de l’un des cinq permanents constitue un veto." },
          { id: "secretariat", group: "Organes principaux", label: "Secrétariat", role: "Administrer et alerter", detail: "Le secrétaire général et le personnel exécutent les mandats, préparent les travaux et peuvent attirer l’attention du Conseil sur une menace à la paix." },
          { id: "ecosoc", group: "Organes principaux", label: "ECOSOC", role: "Coordonner", detail: "Cinquante-quatre États coordonnent les questions économiques, sociales et environnementales avec les entités du système." },
          { id: "icj", group: "Organes principaux", label: "CIJ", role: "Dire le droit entre États", detail: "Quinze juges élus par l’Assemblée et le Conseil règlent les différends soumis par les États et rendent des avis consultatifs." },
          { id: "trusteeship", group: "Organes principaux", label: "Conseil de tutelle", role: "Mission historique achevée", detail: "Il a supervisé onze territoires sous tutelle et suspend ses opérations en 1994 après les Palaos ; il n’administrait ni le Kosovo ni le Timor-Leste." },
          { id: "specialized", group: "Système onusien", label: "FAO · OMS · UNESCO", role: "Institutions spécialisées", detail: "Organisations autonomes reliées à l’ONU par accord : alimentation, santé, éducation, culture, travail, transports et finances." },
          { id: "programmes", group: "Système onusien", label: "PNUD · UNICEF · PAM · HCR", role: "Fonds, programmes et entités", detail: "Ils interviennent dans le développement, l’enfance, l’aide alimentaire ou la protection des réfugiés, sans être tous des institutions spécialisées." },
          { id: "trade", group: "Système onusien", label: "CNUCED · GATT/OMC", role: "Deux histoires distinctes", detail: "La CNUCED naît au sein de l’ONU en 1964 ; l’OMC succède en 1995 au cadre institutionnel du GATT." },
        ],
      },
      keyPoint: "Les six organes principaux ont des compétences complémentaires ; leurs décisions et leurs membres obéissent à des règles différentes.",
      example: "Une crise peut mobiliser la diplomatie du secrétaire général, les décisions du Conseil, l’aide des programmes et le débat de l’Assemblée sans confondre leurs pouvoirs.",
      timelineTitle: "De la délibération à la mise en œuvre",
      timelineInstruction: "Suis la circulation simplifiée d’une question dans le système onusien.",
      timeline: [
        { label: "Délibérer", shortLabel: "Assemblée", detail: "Tous les États discutent, recommandent, votent le budget et élisent ou nomment selon la Charte." },
        { label: "Décider pour la paix", shortLabel: "Conseil", detail: "Le Conseil de sécurité peut adopter des décisions obligatoires, imposer des sanctions ou autoriser la force." },
        { label: "Mettre en œuvre", shortLabel: "Secrétariat", detail: "Le personnel, les missions et les entités du système appliquent les mandats avec les États." },
      ],
      observation: "Une réponse exacte ne dit pas seulement « l’ONU agit » : elle nomme l’organe compétent et son instrument.",
      check: q("Où se trouve le droit de veto ?", ["Au Conseil de sécurité, pour les cinq membres permanents", "À l’Assemblée générale, pour tous les États", "À la CIJ, pour ses juges", "Au Secrétariat, pour son personnel"], 0, "Le veto concerne le vote de fond au Conseil de sécurité."),
      extraQuestions: [
        q("Quel organe vote le budget de l’ONU ?", ["Le Conseil de sécurité", "L’Assemblée générale", "La CIJ", "Le HCR"], 1, "L’Assemblée générale adopte le budget.", "Activité d’application n°2, p. 6 — Assemblée générale"),
        q("Quel organe adopte des résolutions et peut imposer des sanctions pour la paix ?", ["L’UNESCO", "Le Conseil de tutelle", "Le Conseil de sécurité", "La FAO"], 2, "Le Conseil de sécurité a la responsabilité principale du maintien de la paix.", "Activité d’application n°2, p. 6 — Conseil de sécurité"),
        q("Quel organe assure le travail administratif quotidien de l’ONU ?", ["La CIJ", "Le Secrétariat", "L’OMS", "L’OACI"], 1, "Le Secrétariat accomplit le travail quotidien prévu par les mandats.", "Activité d’application n°2, p. 6 — Secrétariat général"),
        q("Quelle institution coordonne la lutte internationale contre les épidémies et pandémies ?", ["La FAO", "L’OMS", "L’UPU", "La CNUCED"], 1, "L’Organisation mondiale de la Santé est l’institution spécialisée compétente.", "Activité d’application n°2, p. 6 — OMS"),
        q("Quelle institution mène les efforts internationaux contre la faim et la malnutrition ?", ["La FAO", "La CIJ", "L’AIEA", "L’OACI"], 0, "La FAO agit dans l’alimentation et l’agriculture.", "Activité d’application n°2, p. 6 — FAO"),
        q("Combien de voix faut-il au Conseil de sécurité pour adopter une décision ?", ["Cinq", "Huit", "Neuf", "Quinze obligatoirement"], 2, "Il faut au moins neuf voix ; pour le fond, aucun permanent ne doit voter contre."),
        q("Qui élit les quinze juges de la CIJ ?", ["L’Assemblée générale seule", "Le Conseil de sécurité seul", "Le Secrétaire général", "L’Assemblée générale et le Conseil de sécurité, séparément"], 3, "Les deux organes procèdent séparément à l’élection."),
        q("Pourquoi le Conseil de tutelle ne gère-t-il plus de territoire ?", ["Tous les territoires sous tutelle ont atteint l’autonomie ou l’indépendance", "Il a été remplacé par l’OTAN", "Le siège de New York a fermé", "La CIJ a absorbé ses pouvoirs"], 0, "Après l’indépendance des Palaos, il suspend ses opérations le 1er novembre 1994."),
        q("Quelle affirmation corrige l’erreur « le GATT est devenu la CNUCED » ?", ["La CNUCED précède la SDN", "La CNUCED est créée séparément en 1964 et l’OMC succède au système du GATT en 1995", "Le GATT devient l’OMS", "Le GATT et la CNUCED sont le même texte"], 1, "Les deux institutions ont des origines et des statuts distincts."),
        q("Le HCR et le HCDH sont-ils simplement deux institutions spécialisées comparables à l’OMS ?", ["Oui, sans nuance", "Non : ce sont des entités onusiennes d’une autre catégorie", "Oui, et ils siègent à la CIJ", "Non, ils n’appartiennent pas au système onusien"], 1, "Le système distingue institutions spécialisées, fonds, programmes, offices et autres entités."),
        q("Quel énoncé décrit correctement la CNUCED ?", ["Un organe permanent créé par l’Assemblée générale en 1964 et rattaché au Secrétariat", "Le nouveau nom de l’OMC", "Une cour pénale", "Une opération de maintien de la paix"], 0, "La CNUCED traite commerce et développement au sein du système des Nations Unies."),
      ],
      distractors: [
        "Tous les organes disposent des mêmes membres et des mêmes pouvoirs.",
        "L’Assemblée générale peut seule imposer une intervention armée.",
        "Le Secrétaire général commande une armée permanente de l’ONU.",
      ],
    },
    {
      id: "assessment",
      title: "Un bilan mitigé",
      summary: "Évaluer les acquis de l’ONU, ses limites et les réformes proposées sans réduire son histoire à un succès ou à un échec total.",
      conceptTitle: "Succès, limites et réformes",
      explanation: "L’ONU a construit des normes, organisé la coopération et soutenu des opérations de paix, mais son efficacité dépend des mandats, des moyens et de la volonté politique des États.",
      keyPoint: "Le bilan est mitigé : les acquis sont réels, tandis que veto, rivalités, moyens limités et conflits persistants justifient des réformes.",
      example: "Les forces de maintien de la paix reçoivent le Nobel en 1988, mais les échecs du Rwanda ou de Srebrenica montrent les limites d’un mandat insuffisant.",
      timelineTitle: "Construire un bilan argumenté",
      timelineInstruction: "Passe des acquis aux limites, puis formule une réforme reliée à la cause étudiée.",
      timeline: [
        { label: "Des succès vérifiables", shortLabel: "Succès", detail: "Paix, normes internationales, décolonisation, aide humanitaire, santé, éducation et développement." },
        { label: "Des limites persistantes", shortLabel: "Limites", detail: "Veto, intérêts des puissances, budgets et mandats contraints, violations des droits et conflits non résolus." },
        { label: "Des réformes débattues", shortLabel: "Réformes", detail: "Représentativité, encadrement du veto, prévention, protection des civils et financement prévisible." },
      ],
      observation: "Pour chaque succès ou limite, précise le domaine, le mécanisme et un exemple daté.",
      check: q("Pourquoi le droit de veto peut-il limiter l’action de l’ONU ?", ["Il peut bloquer une décision de fond du Conseil de sécurité", "Il supprime automatiquement l’Assemblée", "Il interdit toute aide humanitaire", "Il ferme la CIJ"], 0, "Un vote négatif d’un permanent peut empêcher l’adoption d’un projet de résolution sur le fond."),
      distractors: [
        "L’ONU a supprimé tous les conflits depuis 1945.",
        "Aucune action de l’ONU n’a produit de résultat durable.",
        "Une seule institution explique à elle seule tout le bilan mondial.",
      ],
      parts: [
        {
          summary: "Identifier les principaux acquis de l’ONU en matière de paix, de droits, de coopération et d’aide.",
          bodyMarkdown: String.raw`## Paix et sécurité : distinguer les instruments

L’ONU agit par la **diplomatie**, la médiation du secrétaire général, les décisions du Conseil, les sanctions, les missions politiques et les opérations de maintien de la paix. La première opération de maintien de la paix, l’**ONUST/UNTSO**, débute en 1948 au Moyen-Orient. On peut ensuite citer la FUNU en Égypte (1956), l’ONUC au Congo (1960), la MINUL au Liberia (2003) et l’ONUCI en Côte d’Ivoire (**2004-2017**).

> **Correction du document — casques bleus.** La Corée en 1950 et le Koweït en 1990-1991 relèvent de forces multinationales autorisées par le Conseil, non d’opérations classiques de casques bleus ; la crise de Cuba en 1962 illustre surtout la médiation diplomatique. La mission ivoirienne de 2003 est la **MINUCI**, remplacée par l’ONUCI en 2004.

Les **Forces de maintien de la paix des Nations Unies** reçoivent le prix Nobel de la paix en 1988.

## Droits humains, décolonisation et justice

- Déclaration universelle des droits de l’homme, **10 décembre 1948** ;
- accompagnement de la décolonisation et affirmation du droit des peuples à disposer d’eux-mêmes ;
- conventions internationales, assistance électorale et observation ;
- juridictions créées ou soutenues selon des cadres différents.

> **Correction du document — quatre juridictions.** Le **TPIR** concerne le génocide au Rwanda, non un « TPI Rwanda-Burundi ». Milošević et Karadžić relèvent du **TPIY** ; Charles Taylor du **Tribunal spécial pour la Sierra Leone** ; Jean-Pierre Bemba de la **CPI**, juridiction indépendante liée à l’ONU mais non organe principal. Sa condamnation pour crimes de guerre et crimes contre l’humanité a été annulée en appel en 2018.

## Développement et action humanitaire

PNUD, Banque mondiale et autres partenaires soutiennent le développement ; OMS, UNICEF, UNESCO, FAO, PAM et HCR interviennent dans la santé, l’éducation, l’alimentation et les déplacements forcés. La conférence de Rio de 1992 marque aussi la montée de la coopération environnementale.

> **Réflexe BAC.** Un succès s’écrit en trois temps : **domaine → action → exemple daté**.`,
          interaction: {
            kind: "diagram",
            eyebrow: "Explorer",
            title: "Les acquis de l’ONU",
            instruction: "Sélectionne un domaine pour relier une action à un exemple vérifiable.",
            observation: "Un même résultat associe souvent décision politique, mise en œuvre technique et coopération des États.",
            rootLabel: "Succès et contributions",
            rootDetail: "Des résultats inégaux, mais observables dans plusieurs domaines",
            nodes: [
              { id: "peace", group: "Paix", label: "Diplomatie et médiation", role: "Prévenir ou désamorcer", detail: "Bons offices du secrétaire général, missions politiques, négociations et assistance électorale cherchent à prévenir l’escalade." },
              { id: "pk", group: "Paix", label: "Maintien de la paix", role: "Observer et protéger selon un mandat", detail: "ONUST 1948, FUNU 1956, ONUC 1960, MINUL 2003 et ONUCI 2004 sont des repères plus exacts que les coalitions de Corée ou du Koweït." },
              { id: "rights", group: "Droits", label: "Normes universelles", role: "Protéger les droits", detail: "La Déclaration universelle de 1948 ouvre un ensemble de conventions, mécanismes et institutions." },
              { id: "justice", group: "Droits", label: "Justice internationale", role: "Poursuivre des crimes graves", detail: "TPIR, TPIY, Tribunal spécial pour la Sierra Leone et CPI ont des bases juridiques distinctes qu’il faut nommer correctement." },
              { id: "development", group: "Développement", label: "Coopération technique", role: "Réduire les vulnérabilités", detail: "Programmes de développement, santé, éducation, alimentation et environnement mobilisent de nombreuses entités." },
              { id: "humanitarian", group: "Humanitaire", label: "Secours et protection", role: "Aider les populations", detail: "PAM, HCR, UNICEF et partenaires interviennent lors de conflits, déplacements, famines et catastrophes." },
            ],
          },
          extraQuestions: [
            q("La diffusion du droit international humanitaire relève-t-elle d’un succès ou d’un échec ?", ["Succès", "Échec"], 0, "Elle participe à l’établissement et à la diffusion de règles protectrices.", "Activité d’application n°3, pp. 8-9 — item 2"),
            q("L’octroi d’aides aux pays touchés par la COVID-19 relève-t-il d’un succès ou d’un échec ?", ["Échec", "Succès"], 1, "Il illustre la coopération et l’assistance internationale, même si elles restent incomplètes.", "Activité d’application n°3, pp. 8-9 — item 3"),
            q("Le soutien aux réfugiés dans le monde relève-t-il d’un succès ou d’un échec ?", ["Succès", "Échec"], 0, "La protection et l’assistance portées notamment par le HCR constituent un acquis.", "Activité d’application n°3, pp. 8-9 — item 5"),
            q("L’appui du PAM aux cantines scolaires en Côte d’Ivoire relève-t-il d’un succès ou d’un échec ?", ["Échec", "Succès"], 1, "Il s’agit d’une action sociale et alimentaire concrète.", "Activité d’application n°3, pp. 8-9 — item 6"),
            q("Quelle est la première opération de maintien de la paix de l’ONU ?", ["ONUST/UNTSO en 1948", "La coalition de Corée en 1950", "La coalition du Koweït en 1990", "L’ONUCI en 2003"], 0, "L’ONUST commence à observer la trêve au Moyen-Orient en 1948."),
            q("Qui reçoit le prix Nobel de la paix en 1988 ?", ["La CIJ seule", "Les Forces de maintien de la paix des Nations Unies", "Le Conseil de tutelle", "La CNUCED"], 1, "Le Nobel récompense les forces de maintien de la paix."),
            q("Quand l’ONUCI commence-t-elle en Côte d’Ivoire ?", ["2001", "2002", "2003", "2004"], 3, "La MINUCI date de 2003 ; l’ONUCI est créée en 2004."),
            q("Quand la Déclaration universelle des droits de l’homme est-elle adoptée ?", ["26 juin 1945", "10 décembre 1948", "24 octobre 1945", "1er janvier 1942"], 1, "L’Assemblée générale l’adopte le 10 décembre 1948."),
            q("Quel tribunal est compétent pour les crimes liés au génocide rwandais de 1994 ?", ["Le TPIR", "Le TPIY", "La CIJ", "Le Conseil de tutelle"], 0, "Le Tribunal pénal international pour le Rwanda est créé par le Conseil de sécurité."),
            q("À quelle juridiction associer Milošević et Karadžić ?", ["La CPI", "Le TPIY", "Le TPIR", "La CIJ"], 1, "Le Tribunal pénal international pour l’ex-Yougoslavie les a poursuivis."),
            q("Quelle association est exacte ?", ["Charles Taylor — Tribunal spécial pour la Sierra Leone", "Charles Taylor — Conseil de tutelle", "Jean-Pierre Bemba — TPIY", "Karadžić — TPIR"], 0, "Les affaires citées par le document relèvent de juridictions différentes."),
          ],
        },
        {
          summary: "Expliquer pourquoi les résultats restent limités et relier chaque faiblesse à une réforme possible.",
          bodyMarkdown: String.raw`## Des limites politiques et institutionnelles

L’ONU dépend de la volonté et des contributions de ses membres. Le **veto** peut bloquer le Conseil ; les rivalités géopolitiques produisent des actions sélectives ; les retards de contribution réduisent les moyens ; le secrétaire général ne peut contraindre seul les gouvernements.

Les recommandations de l’Assemblée ne remplacent pas les décisions du Conseil. Inversement, une résolution ne garantit pas son exécution : elle doit disposer d’un mandat, de ressources et d’une coopération politique suffisants.

## Des crises qui dépassent les mandats

La persistance des conflits, du terrorisme, de la pauvreté, de la faim et des violations des droits révèle l’écart entre les objectifs et les résultats. Les tragédies du **Rwanda en 1994** et de **Srebrenica en 1995** illustrent des mandats et des moyens dramatiquement insuffisants. La Somalie et le conflit israélo-palestinien montrent aussi combien une opération ou une médiation dépend des parties et des puissances engagées.

## Des réformes débattues

- améliorer la représentativité du Conseil de sécurité ;
- encadrer ou retenir l’usage du veto face aux atrocités de masse ;
- renforcer la prévention, la médiation et le financement prévisible ;
- protéger les civils par des décisions **conformes à la Charte**, et non par une « ingérence » unilatérale ;
- donner une place plus cohérente aux pays du Sud dans les décisions ;
- soutenir des politiques durables contre pauvreté, faim et crise climatique.

## Lire les documents de 1991-1992 comme des points de vue datés

Ignacio Ramonet écrit en **octobre 1992**, au début du mandat de Boutros Boutros-Ghali. Richard Falk critique en **février 1991** l’autorisation de la force contre l’Irak par la résolution 678. Ces textes éclairent les débats sur le veto, la représentation et la domination américaine ; ils ne doivent pas être récités comme une photographie actuelle.

> **Correction du document.** L’affirmation de 1992 selon laquelle « les vetos ont pris fin » après la guerre froide ne s’est pas vérifiée. L’entrée annoncée de l’Allemagne et du Japon au Conseil permanent n’a pas eu lieu. L’élève doit dater, attribuer et confronter le point de vue aux faits ultérieurs.

> **Conclusion attendue.** Dire « bilan mitigé » ne signifie ni neutralité vague ni égalité mécanique : il faut peser des acquis précis face à des limites expliquées, puis proposer une réforme reliée à la cause.`,
          interaction: {
            kind: "diagram",
            eyebrow: "Mettre en relation",
            title: "Limite → effet → réforme",
            instruction: "Sélectionne une limite pour découvrir son effet et la réforme qui lui répond.",
            observation: "Une proposition est convaincante seulement si elle répond à une cause identifiée.",
            rootLabel: "Pourquoi réformer l’ONU ?",
            rootDetail: "Relier les difficultés institutionnelles, opérationnelles et sociales à des réponses réalistes",
            nodes: [
              { id: "veto", group: "Institutionnel", label: "Veto", role: "Décision bloquée", detail: "La retenue du veto face aux atrocités de masse et une réforme de la représentation cherchent à réduire les blocages." },
              { id: "representation", group: "Institutionnel", label: "Représentation de 1945", role: "Légitimité contestée", detail: "L’élargissement ou la transformation du Conseil vise à mieux représenter les régions et puissances contemporaines." },
              { id: "mandate", group: "Opérationnel", label: "Mandat et moyens", role: "Protection insuffisante", detail: "Mandats clairs, ressources adaptées, alerte précoce et coopération des parties renforcent l’action sur le terrain." },
              { id: "finance", group: "Opérationnel", label: "Financement", role: "Action retardée", detail: "Des contributions versées à temps et des financements prévisibles permettent de planifier aide et prévention." },
              { id: "poverty", group: "Social", label: "Pauvreté et faim", role: "Objectifs inachevés", detail: "Développement durable, sécurité alimentaire et réduction des inégalités exigent des politiques nationales et une coopération internationale continue." },
              { id: "documents", group: "Méthode", label: "Sources datées", role: "Point de vue à contextualiser", detail: "Ramonet 1992 et Falk 1991 critiquent l’ordre d’après-guerre froide ; leurs affirmations doivent être attribuées et vérifiées." },
            ],
          },
          extraQuestions: [
            q("La persistance de la pauvreté dans le monde relève-t-elle d’un succès ou d’un échec ?", ["Succès", "Échec"], 1, "Elle montre que les objectifs de développement restent inachevés.", "Activité d’application n°3, pp. 8-9 — item 1"),
            q("La persistance de la faim dans le monde relève-t-elle d’un succès ou d’un échec ?", ["Échec", "Succès"], 0, "Elle demeure une limite malgré l’action de la FAO et du PAM.", "Activité d’application n°3, pp. 8-9 — item 4"),
            q("L’utilisation abusive du droit de veto relève-t-elle d’un succès ou d’un échec ?", ["Succès", "Échec"], 1, "Elle peut bloquer le Conseil et constitue une limite institutionnelle.", "Activité d’application n°3, pp. 8-9 — item 7"),
            q("Créée pour garantir ___, l’ONU agit dans le monde.", ["la paix et la sécurité internationales", "la disparition des États", "une monnaie unique", "la souveraineté d’un seul pays"], 0, "C’est le premier groupe de mots attendu.", "Exercice d’application 2, p. 10 — blanc 1"),
            q("Elle initie ___ lorsque la diplomatie ne suffit pas et qu’un mandat l’autorise.", ["son bilan", "des opérations militaires", "les crises", "le droit de veto"], 1, "Le texte source attend « des opérations militaires » ; le cours précise qu’elles exigent un cadre juridique et ne se confondent pas avec les casques bleus.", "Exercice d’application 2, p. 10 — blanc 2", 2),
            q("Ces opérations peuvent intervenir quand ___ ont échoué.", ["les actions de bons offices", "les crises", "les organismes spécialisés", "les budgets"], 0, "Les bons offices désignent les démarches diplomatiques et de médiation.", "Exercice d’application 2, p. 10 — blanc 3"),
            q("Dans la critique institutionnelle, ___ « est passé par là » et a pu bloquer l’action.", ["la paix", "le droit de veto", "le Secrétariat", "l’UNESCO"], 1, "Le veto est la limite visée par le texte.", "Exercice d’application 2, p. 10 — blanc 4"),
            q("Dans le texte à compléter, que voit-on « pousser comme des champignons » ?", ["Les crises", "Les secrétariats", "Les Chartes", "Les CIJ"], 0, "L’expression insiste sur la multiplication des crises.", "Exercice d’application 2, p. 10 — blanc 5"),
            q("Quelle expression achève correctement le texte : « ___ est donc fortement mitigé » ?", ["Le droit de veto", "Son bilan", "La paix", "Des opérations militaires"], 1, "Le bilan combine succès et limites.", "Exercice d’application 2, p. 10 — blanc 6"),
            q("Quelle réforme répond directement au défaut de représentativité du Conseil ?", ["Supprimer tous les États membres", "Mieux représenter les régions et puissances contemporaines", "Fermer l’Assemblée générale", "Confier le veto à une seule puissance"], 1, "La composition permanente reflète encore le rapport de forces de 1945."),
            q("Comment utiliser correctement les textes de Ramonet (1992) et Falk (1991) ?", ["Comme des points de vue datés à confronter aux faits", "Comme des règlements actuels de l’ONU", "Comme des arrêts de la CIJ", "Comme des statistiques intemporelles"], 0, "Une source d’opinion doit être datée, attribuée et contextualisée."),
          ],
        },
      ],
    },
  ],
} satisfies HumanitiesCourseSeed;

const documentTitle = "Tle H1-LOrganisation des Nations Unies(ONU).pdf";

const sourceByLessonId: Record<string, LessonSourceMetadata> = {
  "terminale-hg-h1-united-nations-overview": {
    documentTitle,
    pages: "1-13",
    section: "Vue d’ensemble du cours, activités, exercices et situations d’évaluation",
    fidelity: "faithful-corrected",
    corrections: [
      "La chronologie de fondation, le statut des organes et le classement des organismes ont été vérifiés et rectifiés.",
      "Les exemples de paix, de justice et de tutelle ont été requalifiés selon les mécanismes réellement mobilisés.",
    ],
  },
  "terminale-hg-h1-united-nations-guided-creation-principles": {
    documentTitle,
    pages: "1-3",
    section: "Introduction, création, objectifs et principes",
    fidelity: "faithful-corrected",
    corrections: [
      "À Moscou, la déclaration associe quatre gouvernements, dont la Chine ; à Téhéran, Mao n’est pas participant.",
      "Yalta réunit Roosevelt, Churchill et Staline : Truman ne devient président qu’en avril 1945.",
      "La conférence de San Francisco commence le 25 avril 1945 ; cinquante États signent la Charte le 26 juin, puis la Pologne rejoint les 51 membres originels.",
    ],
  },
  "terminale-hg-h1-united-nations-guided-organs": {
    documentTitle,
    pages: "3-6",
    section: "Les six organes principaux et le système des Nations Unies",
    fidelity: "faithful-corrected",
    corrections: [
      "Le vote substantiel du Conseil exige neuf voix et l’absence de vote négatif d’un permanent ; une abstention n’est pas un veto.",
      "Le Conseil de tutelle a suspendu ses activités en 1994 après Palaos : Kosovo et Timor oriental relèvent d’administrations transitoires, non de la tutelle.",
      "Le GATT n’est pas devenu la CNUCED : la CNUCED naît en 1964 et l’OMC succède au cadre institutionnel du GATT en 1995.",
    ],
  },
  "terminale-hg-h1-united-nations-guided-assessment-part-1": {
    documentTitle,
    pages: "6-8",
    section: "Réalisations et succès de l’ONU",
    fidelity: "faithful-corrected",
    corrections: [
      "UNTSO en 1948 est la première opération de maintien de la paix ; les coalitions de Corée et du Koweït ne sont pas des opérations classiques de Casques bleus.",
      "L’ONUCI débute en 2004, après la MINUCI de 2003 ; le prix Nobel de 1988 est attribué aux Forces de maintien de la paix des Nations Unies.",
      "Le TPIR concerne le Rwanda, tandis que les procédures visant Milošević, Karadžić, Taylor et Bemba relèvent de juridictions différentes.",
    ],
  },
  "terminale-hg-h1-united-nations-guided-assessment-part-2": {
    documentTitle,
    pages: "7-10",
    section: "Limites, effets et réformes ; activités d’application",
    fidelity: "faithful-corrected",
    corrections: [
      "Le veto, les mandats, les moyens et la coopération des parties sont distingués au lieu d’attribuer chaque échec à une cause unique.",
      "La protection collective est formulée dans le cadre de la Charte et d’une autorisation multilatérale, sans ériger un droit unilatéral d’ingérence en principe général.",
    ],
  },
  "terminale-hg-h1-united-nations-mission-finale": {
    documentTitle,
    pages: "9-13",
    section: "Trois situations d’évaluation et documents critiques",
    fidelity: "faithful-corrected",
    corrections: [
      "Les textes de Richard Falk (1991) et d’Ignacio Ramonet (1992) sont présentés comme des points de vue datés, non comme des faits actuels.",
      "Le veto n’a pas disparu après la guerre froide et les candidatures évoquées en 1992 n’ont pas modifié la composition permanente du Conseil.",
    ],
  },
};

const baseUnitedNationsPath = createHumanitiesPath(unitedNationsCourse);

export const terminalHistoryUnitedNationsPath = {
  ...baseUnitedNationsPath,
  modules: baseUnitedNationsPath.modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      source: sourceByLessonId[lesson.id],
    })),
  })),
};
