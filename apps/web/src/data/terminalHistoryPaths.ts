import type { HumanitiesCourseSeed } from "./humanitiesPathFactory";
import { createHumanitiesPath } from "./humanitiesPathFactory";

const historyCourses = [
  {
    id: "terminale-hg-h1-united-nations",
    strand: "Histoire",
    chapterNumber: 1,
    themeNumber: 1,
    themeTitle: "Les relations internationales de 1945 à nos jours",
    title: "L’Organisation des Nations Unies (ONU)",
    description: "Suivre la création de l’ONU, comprendre ses organes et apprécier le bilan de ses actions.",
    sections: [
      {
        id: "creation-principles",
        title: "Création, objectifs et principes",
        summary: "Situer la construction progressive de l’ONU et distinguer objectifs et principes.",
        conceptTitle: "Une organisation née de l’échec de la SDN",
        explanation: "La Seconde Guerre mondiale consacre l’échec de la SDN. Les Alliés jettent alors les bases d’une nouvelle organisation destinée au maintien de la paix et de la sécurité internationale.",
        bodyMarkdown: String.raw`## Pourquoi une nouvelle organisation ?

La Seconde Guerre mondiale consacre l’**échec de la SDN** (Société des Nations), incapable d’empêcher le conflit. Dès 1941, les Alliés jettent les bases d’une organisation nouvelle destinée au maintien de la paix et de la sécurité internationale : l’**ONU**.

## Une construction progressive (1941-1945)

L’ONU est l’aboutissement d’une série de conférences entre les Alliés. Chaque rencontre constitue un pas vers sa création.

| N° | Date | Lieu | Signataires | Décisions importantes |
|---|---|---|---|---|
| 1 | 14 août 1941 | Terre-Neuve | Roosevelt (USA), Churchill (RU) | **Charte de l’Atlantique** : idée de création de l’ONU, principes de démocratie et de liberté |
| 2 | 1er janvier 1942 | Washington | Roosevelt, Churchill, 26 nations antifascistes | **Déclaration des Nations Unies** |
| 3 | 19-30 octobre 1943 | Moscou | Roosevelt, Churchill | Idée de création de l’ONU **réaffirmée** |
| 4 | Nov.-déc. 1943 | Téhéran | Staline (URSS), Chine | Principe d’**égalité souveraine**, objectif de sécurité |
| 5 | Sept.-oct. 1944 | Dumbarton Oaks | Roosevelt, Churchill, Staline | Définition des **organes** et du fonctionnement |
| 6 | 4-11 février 1945 | Yalta | Truman, Churchill, Staline | Résolution de la question du **droit de veto** |
| 7 | 26 avril-26 juin 1945 | San Francisco | 50 États, dont 4 africains | Signature de la **Charte de l’ONU** |

L’organisation commence à fonctionner officiellement le **24 octobre 1945**.

> **Erreur fréquente.** Deux dates coexistent et se confondent souvent : la Charte est **signée** le 26 juin 1945 à San Francisco, mais l’ONU n’**entre en fonction** que le 24 octobre 1945, après ratification. À l’examen, précise toujours de quelle date tu parles.

> **À noter.** Les 4 pays africains présents à San Francisco sont l’Afrique du Sud, l’Égypte, le Liberia et l’Éthiopie — les seuls États africains alors indépendants. C’est un bon exemple pour montrer que l’Afrique était très peu représentée à la naissance de l’ONU.

## Les objectifs

- Maintenir la **paix et la sécurité internationale** ;
- promouvoir la **souveraineté** et l’autodétermination des peuples ;
- promouvoir les **droits de l’homme** et les libertés fondamentales ;
- promouvoir la **coopération internationale** dans tous les domaines.

## Les principes

- **Égalité souveraine** de tous les États membres ;
- remplir de **bonne foi** ses obligations vis-à-vis de l’ONU ;
- **règlement pacifique** des différends internationaux ;
- s’abstenir de recourir à la **menace ou à la force** ;
- **non-ingérence** dans les affaires intérieures des États membres.

> **Astuce mémoire — ne confonds pas objectif et principe.** Un **objectif** est un **but à atteindre** (« maintenir la paix ») ; un **principe** est une **règle de conduite** que les États s’engagent à respecter (« égalité souveraine »). C’est le piège le plus classique de cette leçon.`,
        keyPoint: "L’ONU naît de l’échec de la SDN : ses objectifs sont des buts à atteindre, ses principes des règles de conduite.",
        example: "La Charte de l’Atlantique (14 août 1941) lance l’idée ; la Charte de l’ONU est signée le 26 juin 1945 à San Francisco.",
        timelineTitle: "Les étapes de la création de l’ONU",
        timelineInstruction: "Parcours les conférences de 1941 à 1945 pour suivre la construction progressive de l’organisation.",
        timeline: [
          { label: "14 août 1941 — Terre-Neuve", shortLabel: "1941", detail: "Charte de l’Atlantique : Roosevelt et Churchill lancent l’idée d’une organisation internationale." },
          { label: "1er janvier 1942 — Washington", shortLabel: "1942", detail: "Déclaration des Nations Unies, signée par 26 nations antifascistes." },
          { label: "Octobre-décembre 1943", shortLabel: "1943", detail: "Moscou puis Téhéran : l’idée est réaffirmée, le principe d’égalité souveraine évoqué." },
          { label: "Septembre-octobre 1944 — Dumbarton Oaks", shortLabel: "1944", detail: "Définition des organes et du fonctionnement de la future organisation." },
          { label: "Février 1945 — Yalta", shortLabel: "Yalta", detail: "Résolution de la question du droit de veto entre les grandes puissances." },
          { label: "26 juin 1945 — San Francisco", shortLabel: "Juin 1945", detail: "50 États signent la Charte des Nations Unies." },
          { label: "24 octobre 1945", shortLabel: "Oct. 1945", detail: "L’ONU commence officiellement à fonctionner après ratification de la Charte." },
        ],
        observation: "Chaque conférence ajoute une pierre : l’idée, la déclaration, les organes, le veto, puis la Charte.",
        check: { prompt: "L’ONU est-elle une initiative française ?", options: ["Non : l’idée naît de Roosevelt et Churchill", "Oui, dès 1941", "Oui, décidée à Yalta", "Oui, lors de la conférence de Moscou"], correctIndex: 0, explanation: "La Charte de l’Atlantique de 1941 est signée par Roosevelt (USA) et Churchill (RU)." },
        extraQuestions: [
          { prompt: "La Déclaration des Nations Unies a été adoptée le 1er janvier 1942.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Elle est signée à Washington par 26 nations antifascistes.", sourceLabel: "Activité d’application n°1", points: 1 },
          { prompt: "L’ONU a commencé à fonctionner officiellement le 26 juin 1945.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Le 26 juin 1945, la Charte est signée. L’ONU entre en fonction le 24 octobre 1945.", sourceLabel: "Activité d’application n°1", points: 2 },
          { prompt: "« L’égalité souveraine de tous les États membres » est un objectif de l’ONU.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "C’est un principe, c’est-à-dire une règle de conduite, et non un but à atteindre.", sourceLabel: "Activité d’application n°1", points: 2 },
          { prompt: "Quel est le principal objectif de l’ONU ?", options: ["Maintenir la paix et la sécurité internationale", "Développer le commerce mondial", "Créer une armée mondiale unique", "Remplacer les États souverains"], correctIndex: 0, explanation: "C’est le premier objectif inscrit dans la Charte.", sourceLabel: "Exercice d’application 1", points: 1 },
          { prompt: "Combien d’États africains ont signé la Charte à San Francisco ?", options: ["4", "0", "12", "26"], correctIndex: 0, explanation: "L’Afrique du Sud, l’Égypte, le Liberia et l’Éthiopie : les seuls indépendants à l’époque.", sourceLabel: "Tableau des conférences", points: 2 },
        ],
        distractors: ["L’ONU a été créée avant la Seconde Guerre mondiale.", "La SDN a parfaitement rempli son rôle en 1939.", "La Charte a été signée par un seul État."],
      },
      {
        id: "organs",
        title: "Le fonctionnement des organes",
        summary: "Distinguer Assemblée générale, Conseil de sécurité, Secrétariat, CIJ et organismes spécialisés.",
        conceptTitle: "Six organes principaux et des organismes spécialisés",
        explanation: "L’ONU fonctionne grâce à six organes principaux aux rôles distincts, complétés par des organismes spécialisés répartis dans le monde entier.",
        bodyMarkdown: String.raw`## Les six organes principaux

Chaque organe a un **rôle distinct**. Explore l’organigramme ci-dessous pour découvrir leur composition et leur mode de décision.

> **Le piège classique.** L’Assemblée générale **délibère** mais ses décisions **n’ont aucun caractère contraignant** ; le Conseil de sécurité **décide** et ses résolutions, elles, s’imposent. Confondre les deux coûte cher à l’examen.

## Les secrétaires généraux successifs

| Nom | Pays | Mandat |
|---|---|---|
| Trygve Lie | Norvège | 1946-1952 |
| Dag Hammarskjöld | Suède | 1953-1961 |
| Sithu U Thant | Birmanie | 1961-1971 |
| Kurt Waldheim | Autriche | 1972-1981 |
| Javier Pérez de Cuéllar | Pérou | 1982-1991 |
| Boutros Boutros-Ghali | Égypte | 1992-1996 |
| Kofi Annan | Ghana | 1997-2006 |
| Ban Ki-moon | Corée du Sud | 2007-2016 |
| António Guterres | Portugal | depuis 2017 |

> **Repère utile.** Deux Africains ont dirigé l’ONU : l’Égyptien Boutros Boutros-Ghali et le Ghanéen Kofi Annan, ce dernier ayant reçu le prix Nobel de la paix en 2001.

## Les organismes spécialisés

**À caractère social, culturel et humanitaire :** UNESCO (Paris, 1946), FAO (Rome, 1945), OMS (Genève, 1948), OIT (Genève, 1946), HCR (Genève, 1950), HCDH (Genève, 1993).

**À caractère technique :** AIEA (Vienne, 1957), OACI (Montréal, 1947), UPU (Berne, 1874).

**À caractère économique :** FMI et Banque mondiale (Washington, 1944), GATT (Genève, 1947), devenu la CNUCED en 1964.

> **La réaction graduée du Conseil de sécurité.** Face à une menace, il procède par étapes : d’abord des **résolutions** pour un règlement pacifique ; en cas d’échec, des **sanctions** économiques ou militaires (embargo) ; en dernier recours, l’**intervention armée** avec les casques bleus. Retenir cet ordre permet de structurer toute réponse sur le maintien de la paix.`,
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "L’organigramme de l’ONU",
          instruction: "Sélectionne un organe pour découvrir sa composition, son rôle et son mode de décision.",
          observation: "Retiens surtout l’opposition entre l’Assemblée générale qui délibère et le Conseil de sécurité qui décide.",
          rootLabel: "Organisation des Nations Unies",
          rootDetail: "Siège : New York — 193 États membres",
          nodes: [
            { id: "ag", group: "Organes principaux", label: "Assemblée générale", role: "Organe de délibération", detail: "Réunit les 193 États membres, chacun disposant d’une voix. Elle se réunit une fois par an en session ordinaire, et en session extraordinaire à la demande du Conseil de sécurité, du Secrétariat ou des membres. Elle vote le budget, élit le secrétaire général et se prononce sur l’adhésion de nouveaux membres. Ses décisions n’ont aucun caractère contraignant." },
            { id: "cs", group: "Organes principaux", label: "Conseil de sécurité", role: "Organe exécutif", detail: "Composé de 5 membres permanents disposant du droit de veto (États-Unis, France, Grande-Bretagne, Russie, Chine) et de 10 membres non permanents élus pour 2 ans. Il peut se réunir à tout moment et intervient sur les questions de paix et de sécurité, par une réaction graduée : résolutions, sanctions, puis intervention armée." },
            { id: "sg", group: "Organes principaux", label: "Secrétariat général", role: "Organe administratif", detail: "Dirigé par un secrétaire général élu par l’Assemblée générale sur recommandation du Conseil de sécurité, pour un mandat de 5 ans renouvelable. Il assure l’administration de l’ONU, convoque les assemblées et attire l’attention sur les situations nécessitant une intervention." },
            { id: "ecosoc", group: "Organes principaux", label: "Conseil économique et social", role: "Organe de coordination", detail: "Composé de 54 États élus par l’Assemblée générale pour 3 ans, renouvelé par tiers chaque année. Il coordonne les activités économiques et sociales et se divise en commissions : droits de l’homme, lutte contre la drogue, statistiques…" },
            { id: "cij", group: "Organes principaux", label: "Cour internationale de justice", role: "Organe judiciaire", detail: "Composée de 15 juges élus par l’Assemblée générale pour un mandat de 9 ans, renouvelée par tiers tous les 3 ans. Elle règle les différends d’ordre juridique entre les États. Son siège est à La Haye, aux Pays-Bas." },
            { id: "tutelle", group: "Organes principaux", label: "Conseil de tutelle", role: "Territoires sous mandat", detail: "Composé de membres élus par l’Assemblée générale, il contrôlait l’administration des territoires placés sous mandat des Nations Unies : anciens territoires de la SDN, le Kosovo en 1999, le Timor oriental en 2002." },
            { id: "unesco", group: "Organismes spécialisés", label: "UNESCO · OMS · FAO", role: "Social, culturel, humanitaire", detail: "UNESCO (Paris, 1946) pour l’éducation, la science et la culture ; OMS (Genève, 1948) pour la santé ; FAO (Rome, 1945) contre la faim et la malnutrition ; OIT, HCR et HCDH complètent ce volet." },
            { id: "aiea", group: "Organismes spécialisés", label: "AIEA · OACI · UPU", role: "Technique", detail: "AIEA (Vienne, 1957) contrôle le nucléaire civil ; OACI (Montréal, 1947) encadre l’aviation civile ; UPU (Berne, 1874) organise les échanges postaux — c’est la plus ancienne, antérieure à l’ONU elle-même." },
            { id: "fmi", group: "Organismes spécialisés", label: "FMI · Banque mondiale", role: "Économique", detail: "Créés à Washington en 1944, ils financent le développement et la stabilité monétaire. Le GATT (Genève, 1947) est devenu la CNUCED en 1964, Conférence des Nations Unies pour le commerce et le développement." },
          ],
        },
        keyPoint: "L’Assemblée générale délibère sans contraindre ; le Conseil de sécurité décide et peut sanctionner grâce au droit de veto de ses cinq membres permanents.",
        example: "Face à une menace, le Conseil de sécurité procède par étapes : résolution, puis sanctions ou embargo, puis envoi des casques bleus.",
        timelineTitle: "Du débat à la décision",
        timelineInstruction: "Suis le chemin d’une question de paix à travers les organes de l’ONU.",
        timeline: [
          { label: "Assemblée générale", detail: "Elle délibère, vote le budget et élit les responsables, mais ses décisions ne contraignent pas les États." },
          { label: "Conseil de sécurité", detail: "Il décide et peut contraindre ; ses cinq membres permanents disposent du droit de veto." },
          { label: "Secrétariat et agences", detail: "Ils exécutent : administration, médiations, action humanitaire par les organismes spécialisés." },
        ],
        observation: "Un organe délibère, un autre décide, un troisième exécute : c’est cette répartition qu’il faut savoir expliquer.",
        check: { prompt: "Quel organe dispose du droit de veto ?", options: ["Les cinq membres permanents du Conseil de sécurité", "L’Assemblée générale", "La Cour internationale de justice", "Le Secrétariat général"], correctIndex: 0, explanation: "États-Unis, France, Grande-Bretagne, Russie et Chine disposent du droit de veto." },
        extraQuestions: [
          { prompt: "Quel organe vote le budget de l’ONU ?", options: ["L’Assemblée générale", "Le Conseil de sécurité", "Le Secrétariat général", "La CIJ"], correctIndex: 0, explanation: "L’Assemblée générale vote le budget et élit le secrétaire général.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Quel organisme lutte contre la faim et la malnutrition ?", options: ["La FAO", "L’OMS", "L’UNESCO", "L’AIEA"], correctIndex: 0, explanation: "La FAO (Rome, 1945), Food and Agriculture Organization.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Quel organisme lutte contre les épidémies et les pandémies ?", options: ["L’OMS", "La FAO", "L’OIT", "L’UPU"], correctIndex: 0, explanation: "L’OMS (Genève, 1948), Organisation mondiale de la santé.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Combien de juges composent la Cour internationale de justice ?", options: ["15", "5", "54", "193"], correctIndex: 0, explanation: "15 juges élus pour 9 ans, siégeant à La Haye.", sourceLabel: "II-1-e", points: 2 },
          { prompt: "Quelle est la durée du mandat du secrétaire général ?", options: ["5 ans renouvelable", "2 ans", "9 ans", "3 ans"], correctIndex: 0, explanation: "Il est élu par l’Assemblée générale sur recommandation du Conseil de sécurité.", sourceLabel: "II-1-c", points: 1 },
          { prompt: "Dans la réaction graduée du Conseil de sécurité, qu’est-ce qui vient en dernier recours ?", options: ["L’intervention armée avec les casques bleus", "Une résolution de règlement pacifique", "Un embargo économique", "Une session de l’Assemblée générale"], correctIndex: 0, explanation: "L’ordre est : résolutions, puis sanctions, puis intervention armée.", sourceLabel: "II-1-b", points: 2 },
        ],
        distractors: ["Tous les États membres disposent du droit de veto.", "Le Secrétariat général vote les résolutions contraignantes.", "La CIJ commande les casques bleus."],
      },
      {
        id: "assessment",
        title: "Un bilan mitigé",
        summary: "Comparer succès de l’ONU et limites politiques, financières ou institutionnelles.",
        conceptTitle: "Des succès réels, des limites persistantes",
        explanation: "Le bilan de l’ONU comprend des succès dans plusieurs domaines, mais aussi des échecs et des limites qui nourrissent les demandes de réforme.",
        keyPoint: "Le bilan de l’ONU est mitigé : des succès réels en matière de paix, de droits et de développement, mais des limites institutionnelles persistantes.",
        example: "L’ONU reçoit le prix Nobel de la paix en 1988, mais son impuissance en Somalie et au Proche-Orient reste critiquée.",
        timelineTitle: "Évaluer les actions de l’ONU",
        timelineInstruction: "Passe des actions de paix aux progrès humains, puis aux limites de l’organisation.",
        timeline: [
          { label: "Les succès", shortLabel: "Succès", detail: "Prévention et règlement des conflits, droits de l’homme, progrès économique, social et humanitaire." },
          { label: "Les limites", shortLabel: "Limites", detail: "Précarité de la paix, usage abusif du veto, retard des cotisations, échecs des casques bleus." },
          { label: "Les réformes souhaitables", shortLabel: "Réformes", detail: "Réformer le Conseil de sécurité et le veto, démocratiser le fonctionnement, renforcer la prévention." },
        ],
        observation: "Un bilan historique doit présenter à la fois les résultats obtenus et les causes des échecs.",
        check: { prompt: "Pourquoi le droit de veto peut-il limiter l’ONU ?", options: ["Il peut bloquer une décision du Conseil de sécurité", "Il supprime toutes les agences", "Il ferme automatiquement l’Assemblée générale", "Il interdit les opérations humanitaires"], correctIndex: 0, explanation: "Un membre permanent peut empêcher l’adoption d’une résolution importante." },
        distractors: ["L’ONU n’a jamais mené d’action humanitaire.", "Toutes les résolutions sont toujours appliquées immédiatement.", "Le bilan de l’ONU ne comporte que des succès."],
        parts: [
          {
            summary: "Recenser les réussites de l’ONU en matière de paix, de droits humains et de développement.",
            bodyMarkdown: String.raw`## Le maintien de la paix et de la sécurité

**La prévention des conflits :** parrainage d’accords sur le désarmement et la dénucléarisation, contrôle du nucléaire avec l’**AIEA**, médiations du secrétaire général, **supervision des processus électoraux**.

**Le règlement des conflits :** pressions du Conseil de sécurité sur les belligérants (résolutions contraignantes, menaces de sanctions), comme en **Côte d’Ivoire (2002)** ou au **Liberia (2001)**. Envoi de forces d’interposition, les **casques bleus** : Corée (1950), Égypte (1956), Congo (1961), Cuba (1962), Koweït (1990), Côte d’Ivoire (2003).

> L’ONU reçoit le **prix Nobel de la paix en 1988** pour ses opérations de maintien de la paix.

## Les actions relatives aux droits de l’homme

- La **Déclaration universelle des droits de l’homme**, le 10 décembre 1948 ;
- les actions pour l’**indépendance des États africains** ;
- la lutte contre la torture et l’esclavage ;
- la création du **TPI** pour le Rwanda et le Burundi, puis de la **CPI**, qui a jugé Slobodan Milošević, Radovan Karadžić, Charles Taylor et Jean-Pierre Bemba ;
- la **promotion de la démocratie** : assistance technique et observateurs électoraux, en Guinée (2010) et en Côte d’Ivoire (2010).

## Le progrès économique, social et humanitaire

- Lutte contre la **pauvreté** via le FMI, la Banque mondiale, le PNUD et l’ONUDI ;
- **progrès social** : UNICEF et UNESCO pour l’éducation, OMS pour la santé, lutte contre le réchauffement climatique (conférence de **Rio, 1992**) ;
- **action humanitaire** en cas de guerre, de catastrophe naturelle ou de famine.

> **Réflexe de rédaction.** Un succès ne se cite jamais seul : donne le **domaine**, l’**action** et un **exemple daté**. « En matière de règlement des conflits, l’ONU envoie des casques bleus, par exemple en Côte d’Ivoire en 2003. »`,
            extraQuestions: [
              { prompt: "En quelle année l’ONU reçoit-elle le prix Nobel de la paix ?", options: ["1988", "1945", "1948", "2001"], correctIndex: 0, explanation: "Le prix récompense ses opérations de maintien de la paix.", sourceLabel: "III-1", points: 1 },
              { prompt: "Quand la Déclaration universelle des droits de l’homme est-elle adoptée ?", options: ["Le 10 décembre 1948", "Le 26 juin 1945", "Le 24 octobre 1945", "Le 1er janvier 1942"], correctIndex: 0, explanation: "Elle est l’un des textes fondateurs de l’action de l’ONU.", sourceLabel: "III-1", points: 2 },
              { prompt: "« Soutien aux réfugiés dans le monde » relève des…", options: ["succès de l’ONU", "échecs de l’ONU"], correctIndex: 0, explanation: "C’est une réussite de l’action humanitaire, portée notamment par le HCR.", sourceLabel: "Activité d’application 3", points: 1 },
              { prompt: "« Appui aux cantines scolaires (PAM) en Côte d’Ivoire » relève des…", options: ["succès de l’ONU", "échecs de l’ONU"], correctIndex: 0, explanation: "C’est une action de progrès social menée par le Programme alimentaire mondial.", sourceLabel: "Activité d’application 3", points: 1 },
            ],
          },
          {
            summary: "Analyser les limites de l’ONU et les réformes réclamées pour y remédier.",
            bodyMarkdown: String.raw`## La précarité de la paix et de la sécurité

**Le non-respect des décisions :** attaques contre l’ONU et contestation des résolutions en Irak, en Côte d’Ivoire, au Kosovo.

**Les problèmes institutionnels :**

- l’**usage abusif du droit de veto** par les membres permanents ;
- le **retard des cotisations** des États ;
- l’**absence de pouvoir réel** du secrétaire général ;
- la lenteur et la passivité de l’organisation, son impuissance pendant la guerre froide ;
- la **prépondérance des États-Unis**, accusés d’utiliser l’ONU à leur avantage ;
- l’ampleur et le coût des opérations dans le monde.

**L’échec des casques bleus :** la Somalie, la crise israélo-palestinienne. La persistance des conflits et du terrorisme international le confirme : Afghanistan, Afrique de l’Ouest.

## Les insuffisances en matière de droits de l’homme

Le non-respect des droits humains reste fréquent : oppression des libertés, notamment d’expression, et déficit démocratique dans de nombreux pays.

## Les insuffisances économiques, sociales et humanitaires

| Domaine | Limite constatée |
|---|---|
| Économique | Écart croissant entre pays riches et pays pauvres |
| Social | Pauvreté grandissante |
| Humanitaire | Secours insuffisants face aux catastrophes, à la famine, au réchauffement climatique, au SIDA et à la COVID-19 |

## Les réformes souhaitables

- Une **réforme du Conseil de sécurité**, notamment de l’usage du droit de veto ;
- **démocratiser** le fonctionnement : renforcer les pouvoirs d’une Assemblée générale plus représentative et un Secrétariat plus présent ;
- mettre l’accent sur la **prévention des conflits** et la protection des populations civiles ;
- initier de **grands projets de développement** pour les pays pauvres.

> **Réflexe de rédaction.** Ne conclus jamais par « l’ONU est un échec ». La formule attendue est **« un bilan mitigé »** : des succès certains, mais des problèmes qui demeurent et appellent des réformes structurelles.`,
            extraQuestions: [
              { prompt: "« Utilisation abusive du droit de veto » relève des…", options: ["échecs de l’ONU", "succès de l’ONU"], correctIndex: 0, explanation: "C’est le problème institutionnel le plus souvent dénoncé.", sourceLabel: "Activité d’application 3", points: 1 },
              { prompt: "« Persistance de la faim dans le monde » relève des…", options: ["échecs de l’ONU", "succès de l’ONU"], correctIndex: 0, explanation: "Malgré la FAO et le PAM, la faim persiste : c’est une limite.", sourceLabel: "Activité d’application 3", points: 1 },
              { prompt: "Dans quels pays l’échec des casques bleus est-il cité par le cours ?", options: ["La Somalie et la crise israélo-palestinienne", "La Corée et le Koweït", "Le Liberia et la Côte d’Ivoire", "Le Rwanda et le Burundi"], correctIndex: 0, explanation: "Ce sont les deux exemples d’échec retenus par le document.", sourceLabel: "III-2", points: 2 },
              { prompt: "Quelle réforme le cours juge-t-il indispensable en priorité ?", options: ["La réforme du Conseil de sécurité et du droit de veto", "La suppression de l’Assemblée générale", "La dissolution des organismes spécialisés", "Le transfert du siège hors de New York"], correctIndex: 0, explanation: "Le document la présente comme indispensable.", sourceLabel: "III-3", points: 2 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "terminale-hg-h2-bipolar-world",
    strand: "Histoire",
    chapterNumber: 2,
    themeNumber: 1,
    themeTitle: "Les relations internationales de 1945 à nos jours",
    title: "L’ère de la bipolarisation de 1947 à 1991",
    description: "Comprendre la formation des blocs, les crises de la guerre froide et la disparition de l’URSS.",
    sections: [
      {
        id: "formation-blocs",
        title: "La formation de deux blocs antagonistes",
        summary: "Relier rupture de 1947, doctrines, alliances militaires et organisations économiques.",
        conceptTitle: "Deux modèles idéologiques s’organisent",
        explanation: "Les tensions sur l’Europe libérée et l’Allemagne rompent la Grande Alliance. Les États-Unis répondent par la doctrine Truman et le plan Marshall ; l’URSS par la doctrine Jdanov. Chaque camp construit ensuite ses alliances militaires et économiques.",
        bodyMarkdown: String.raw`## Pourquoi la Grande Alliance se brise-t-elle ?

Unis contre l’Axe jusqu’en 1945, les Alliés se divisent très vite. Deux dossiers cristallisent la rupture.

**La question polonaise.** Le glissement de la frontière polonaise vers l’ouest — la **ligne Oder-Neisse** — n’est pas reconnu par les Anglais et les Américains. Après des irrégularités électorales, les prosoviétiques évincent les modérés : la Pologne bascule dans l’orbite de Moscou.

**La question allemande.** Le sort du vaincu divise les vainqueurs. Les Occidentaux arrêtent le démantèlement des industries et la dénazification, redoutant une révolution sociale ; les Soviétiques, eux, continuent de démonter les usines de leur zone et amorcent la collectivisation. Dès les élections régionales de 1946, chaque zone vote pour son camp : **la coupure de l’Allemagne est déjà un fait accompli**.

## Les démocraties populaires

Dans les pays libérés par l’Armée rouge, les communistes — pourtant minoritaires — accaparent les **ministères clés** (défense, sécurité, intérieur), noyautent l’armée et l’administration, absorbent les partis socialistes et éliminent les autres.

Entre **1947 et 1949**, la Bulgarie, la Tchécoslovaquie, la Roumanie, la Pologne, la Hongrie et l’Allemagne de l’Est deviennent des **démocraties populaires** alignées sur l’URSS. Churchill dénonce alors, dans son discours de Fulton, « le rideau de fer descendu à travers le continent ».

> **Précision.** Le document source écrit « Wilson Churchill » : il faut lire **Winston Churchill**, Premier ministre britannique. Son discours de Fulton (Missouri) date de **mars 1946**.

## La riposte américaine : la politique du « containment »

| | Doctrine Truman | Plan Marshall |
|---|---|---|
| **Date** | 12 mars 1947 | 5 juin 1947 |
| **Auteur** | Harry Truman, président | George C. Marshall, secrétaire d’État |
| **Lieu** | devant le Congrès | université Harvard |
| **Nature** | politique de **fermeté** | aide **économique et financière** |
| **Objectif** | empêcher l’expansion soviétique au-delà de 1947 | « endiguer » le communisme en combattant la pauvreté |
| **Application** | Grèce et Turquie | 16 pays européens |

Staline **refuse** le plan Marshall et l’interdit aux pays occupés par l’Armée rouge. Les 16 pays qui l’acceptent créent l’**O.E.C.E.** le 16 avril 1948 pour répartir l’aide : c’est la naissance de l’Europe occidentale.

## La riposte soviétique : la doctrine Jdanov

Andreï Jdanov, bras droit de Staline, présente sa doctrine du **22 au 27 septembre 1947** à Szklarska Poreba (Pologne), devant les délégués de **9 partis communistes**. Pour lui, la division du monde en deux camps est **irréversible** : il appelle à mobiliser les pays anti-impérialistes derrière l’URSS.

> **La définition à retenir.** La **bipolarisation** est la division du monde en deux blocs opposés **idéologiquement, politiquement, économiquement et militairement** : le bloc capitaliste (occidental) et le bloc socialiste (oriental).

## La structuration des deux blocs

| | Bloc occidental | Bloc oriental |
|---|---|---|
| **Alliance militaire** | **OTAN** — traité de Washington, 4 avril 1949 | **Pacte de Varsovie** — 14 mai 1955 |
| **Autres alliances** | OTASE, CENTO, ANZUS | alliances bilatérales remplacées par le Pacte |
| **Organisation économique** | O.E.C.E. (1948) puis **OCDE** (1961, Paris) | **CAEM / COMECON** — 25 janvier 1949, Moscou |
| **Commandement** | parapluie nucléaire des États-Unis | confié à l’URSS |

L’**article 5** de la charte de l’OTAN pose le principe de sécurité collective : une attaque contre l’un des membres « sera considérée comme une attaque dirigée contre toutes les parties ». L’alliance s’élargit ensuite à la Grèce et la Turquie (1952), à l’Allemagne de l’Ouest (1955) et à l’Espagne (1982).

Le **CAEM** organise la « division socialiste du travail » et impose le rouble transférable — renforçant surtout la dépendance des satellites envers Moscou.

> **Précision.** Le document annonce « 13 pays » fondateurs de l’OTAN mais n’en cite que neuf. L’Alliance atlantique compte en réalité **12 membres fondateurs** en 1949.

> **Erreur fréquente.** Ne confonds pas les couples : **doctrine Truman → bloc de l’Ouest → USA** ; **doctrine Jdanov → bloc de l’Est → URSS**. De même, l’**OTAN** est occidentale et le **CAEM** oriental — l’activité d’application 1 du cours porte exactement sur cette distinction.`,
        keyPoint: "La bipolarisation organise le monde autour d’un bloc occidental dirigé par les États-Unis et d’un bloc oriental dirigé par l’URSS.",
        example: "L’OTAN structure militairement l’Ouest ; le Pacte de Varsovie répond à l’Est. L’OECE puis l’OCDE et le CAEM organisent les coopérations économiques.",
        timelineTitle: "La structuration des blocs",
        timelineInstruction: "Suis trois repères qui transforment les anciens alliés en adversaires.",
        timeline: [
          { label: "1947", detail: "Doctrine Truman, plan Marshall et doctrine Jdanov officialisent la rupture idéologique." },
          { label: "1949", detail: "Création de l’OTAN à l’Ouest et du CAEM dans le bloc oriental." },
          { label: "1955", detail: "Le Pacte de Varsovie organise l’alliance militaire du bloc soviétique." },
        ],
        observation: "La guerre froide oppose deux systèmes sans affrontement militaire direct entre les deux superpuissances.",
        check: { prompt: "Quelle doctrine américaine cherche à contenir l’expansion du communisme ?", options: ["La doctrine Truman", "La doctrine Jdanov", "La perestroïka", "La doctrine de Bandung"], correctIndex: 0, explanation: "La doctrine Truman de mars 1947 fonde la politique de containment." },
        extraQuestions: [
          { prompt: "À quel bloc et à quel leader appartient la doctrine Jdanov ?", options: ["Bloc de l’Est — URSS", "Bloc de l’Ouest — USA", "Bloc de l’Est — USA", "Bloc de l’Ouest — URSS"], correctIndex: 0, explanation: "Jdanov est le bras droit de Staline : sa doctrine est la riposte soviétique.", sourceLabel: "Activité d’application 1", points: 1 },
          { prompt: "Le plan Marshall a été annoncé le 5 juin 1947 à l’université Harvard.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "C’est le discours du secrétaire d’État George C. Marshall.", sourceLabel: "Cours I-1-c", points: 1 },
          { prompt: "Combien de pays européens ont accepté l’aide du plan Marshall ?", options: ["16", "9", "26", "50"], correctIndex: 0, explanation: "Staline l’ayant refusé pour son bloc, 16 pays l’acceptent et créent l’O.E.C.E. en 1948.", sourceLabel: "Cours I-1-c", points: 2 },
          { prompt: "La doctrine Truman et le plan Marshall ont permis de freiner la propagation du communisme en Europe.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "C’est précisément l’objectif de la politique de « containment ».", sourceLabel: "Activité d’application 2, affirmation 2", points: 1 },
          { prompt: "L’OTAN et le COMECON visent tous deux à sécuriser les pays de l’Atlantique Nord.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "L’OTAN est occidentale ; le COMECON (CAEM) est l’organisation économique du bloc oriental.", sourceLabel: "Activité d’application 2, affirmation 3", points: 2 },
          { prompt: "La bipolarisation est la division du monde entre un bloc capitaliste et un bloc libéral.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "L’opposition est entre le bloc capitaliste (occidental) et le bloc socialiste (oriental) — « capitaliste » et « libéral » désignent le même camp.", sourceLabel: "Activité d’application 2, affirmation 4", points: 2 },
          { prompt: "Quelle organisation militaire structure le bloc oriental à partir de 1955 ?", options: ["Le Pacte de Varsovie", "L’OTAN", "Le CAEM", "L’OECE"], correctIndex: 0, explanation: "Signé le 14 mai 1955, il répond à l’entrée de la RFA dans l’OTAN.", sourceLabel: "Cours I-2-b", points: 1 },
          { prompt: "En quelle année le Pacte de Varsovie est-il dissous ?", options: ["1991", "1989", "1985", "1968"], correctIndex: 0, explanation: "L’alliance militaire est dissoute le 25 février 1991.", sourceLabel: "Cours I-2-b", points: 2 },
        ],
        distractors: ["Le Pacte de Varsovie appartient au bloc occidental.", "Le plan Marshall est imposé par l’URSS à l’Europe de l’Est.", "La bipolarisation supprime toutes les alliances militaires."],
      },
      {
        id: "crises-coexistence",
        title: "Crises et coexistence pacifique",
        summary: "Caractériser Berlin, Cuba, le Vietnam et les périodes de détente.",
        conceptTitle: "Une confrontation indirecte faite de crises et de dégels",
        explanation: "Berlin devient un premier foyer de crise, puis Cuba porte le monde au bord de la guerre nucléaire. La coexistence pacifique limite certains risques grâce au dialogue, sans mettre fin à la rivalité, comme le montre la guerre du Vietnam.",
        keyPoint: "La coexistence pacifique réduit le risque d’affrontement direct, mais ne met pas fin aux conflits périphériques ni à la course aux armements.",
        example: "La crise des missiles de Cuba en 1962 débouche sur un compromis et favorise la mise en place d’un téléphone rouge entre Washington et Moscou.",
        timelineTitle: "Les grandes crises de la guerre froide",
        timelineInstruction: "Parcours trois moments où la rivalité des blocs atteint une forte intensité.",
        timeline: [
          { label: "1948-1949 — Le blocus de Berlin", shortLabel: "La première crise de Berlin", detail: "Blocus de Berlin par l’URSS et pont aérien organisé par les Occidentaux." },
          { label: "1961 — Le mur de Berlin", shortLabel: "Le mur de Berlin", detail: "Construction du mur de Berlin, symbole de la division de l’Europe et du monde." },
          { label: "1962 — La crise de Cuba", shortLabel: "la crise de Cuba", detail: "Crise des missiles de Cuba : confrontation nucléaire évitée par un compromis." },
        ],
        observation: "Les crises montrent la puissance des blocs ; les compromis montrent aussi leur volonté d’éviter une guerre nucléaire.",
        check: { prompt: "Quelle crise de 1962 place le monde au bord d’une guerre nucléaire ?", options: ["La crise de Cuba", "La crise de Suez", "La guerre du Golfe", "La conférence de Bandung"], correctIndex: 0, explanation: "L’installation de missiles soviétiques à Cuba provoque une confrontation avec les États-Unis." },
        parts: [
          {
            bodyMarkdown: String.raw`## Berlin, premier terrain de la guerre froide

L’Allemagne vaincue est divisée en **quatre zones d’occupation** (USA, Grande-Bretagne, France à l’Ouest ; URSS à l’Est), et Berlin — pourtant située en zone soviétique — l’est également. Cette enclave occidentale au cœur du bloc de l’Est devient le premier foyer de crise.

## La cause : la conférence de Londres (février 1948)

Les trois Occidentaux se réunissent à Londres et décident de :

- convoquer une **assemblée constituante** pour le 1ᵉʳ septembre 1948 ;
- créer une autorité internationale **sans l’URSS** pour contrôler la Ruhr ;
- **fusionner leurs zones** et les doter d’une monnaie commune, le *Deutschemark*.

Pour Staline, ces décisions violent les accords de Yalta et Potsdam. La riposte sera le blocus.

## Le blocus et le pont aérien

Le **23 juin 1948**, Staline fait couper toutes les communications routières et ferroviaires vers Berlin-Ouest et interrompt l’approvisionnement en électricité. Son espoir : asphyxier la ville pour la faire tomber dans sa zone.

Les États-Unis refusent l’épreuve de force armée et choisissent le **pont aérien** :

| Le pont aérien en chiffres | |
|---|---|
| Durée | **318 jours** |
| Vols | **275 000** |
| Tonnage | **2 323 000 tonnes** de vivres et non-vivres |
| Avions | une centaine |

Le **12 mai 1949**, Staline prend acte de son échec et lève le blocus.

## Les conséquences : deux Allemagnes

| | RFA | RDA |
|---|---|---|
| **Date de naissance** | 23 mai 1949 | 7 octobre 1949 |
| **Zones** | les 3 zones occidentales | zone soviétique |
| **Dirigeant** | Konrad Adenauer, chancelier | Otto Grotewohl, président du conseil |
| **Capitale** | Bonn | Pankow (Berlin-Est) |
| **Monnaie** | Deutschemark | Ost mark |

> **La leçon de la crise.** Elle démontre la **puissance logistique** des États-Unis et resserre les liens entre les Allemands de l’Ouest et les Occidentaux. Surtout, elle **accélère la division de l’Allemagne** — une division qui durera quarante ans.

> **Erreur fréquente.** La première crise de Berlin **précède** la création des deux États allemands : c’est elle qui les provoque, et non l’inverse. Retiens l’ordre : blocus (juin 1948) → levée (mai 1949) → RFA (mai 1949) → RDA (octobre 1949).`,
            extraQuestions: [
              { prompt: "Combien de jours a duré le pont aérien de Berlin ?", options: ["318 jours", "100 jours", "30 jours", "2 ans"], correctIndex: 0, explanation: "275 000 vols ont transporté 2 323 000 tonnes en 318 jours.", sourceLabel: "Cours II-1-a", points: 2 },
              { prompt: "Quelle décision de la conférence de Londres a provoqué la riposte soviétique ?", options: ["La fusion des zones occidentales et la création du Deutschemark", "La création de l’ONU", "Le retrait des troupes américaines", "La reconnaissance de la RDA"], correctIndex: 0, explanation: "Staline y voit une violation des accords de Yalta et Potsdam.", sourceLabel: "Cours II-1-a", points: 2 },
              { prompt: "Quelle est la capitale de la RFA créée en 1949 ?", options: ["Bonn", "Berlin", "Pankow", "Francfort"], correctIndex: 0, explanation: "La RFA, née le 23 mai 1949, a Bonn pour capitale.", sourceLabel: "Cours II-1-a", points: 1 },
              { prompt: "Les conférences de Yalta et de Potsdam ont divisé l’Allemagne en zones d’occupation.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Quatre zones : américaine, britannique, française et soviétique.", sourceLabel: "Activité d’application 2, affirmation 1", points: 1 },
            ],
          },
          {
            bodyMarkdown: String.raw`## La deuxième crise de Berlin : le mur

**La cause.** Berlin-Ouest est une vitrine prospère au cœur de la RDA. De **1952 à 1961**, **2 245 000 réfugiés** en âge de travailler quittent l’Est — une saignée démographique qui prive l’industrie est-allemande de main-d’œuvre.

Khrouchtchev exige un changement de statut, qualifiant Berlin-Ouest de « tumeur cancérigène » nécessitant une « opération chirurgicale ». L’échec de la conférence de Paris — provoqué par l’affaire de l’avion espion **U2** abattu le 1ᵉʳ mai 1960 — relance la tension.

**La solution soviétique.** Dans la nuit du **12 au 13 août 1961**, un mur est construit en plein Berlin. « Mur de la honte » pour l’Ouest, « mur de protection antifasciste » pour le gouvernement est-allemand, il séparera la ville pendant plus de **vingt-huit ans**.

> **La conséquence paradoxale.** Les Occidentaux n’ont rien cédé, mais la crise consacre l’URSS comme **grande puissance capable de discuter d’égal à égal** avec les États-Unis. Le statu quo enracine définitivement la RFA à l’Ouest et la RDA à l’Est.

## La crise de Cuba (1962) : le paroxysme

**L’enchaînement des causes**

| Étape | Date | Fait |
|---|---|---|
| 1 | 1ᵉʳ janvier 1959 | **Fidel Castro** renverse Batista et nationalise les entreprises américaines |
| 2 | 1960 | Riposte américaine : rupture diplomatique, **embargo**, refus d’acheter le sucre |
| 3 | 13 février 1960 | L’URSS achète **5 millions de tonnes** de sucre cubain sur 5 ans |
| 4 | 17 avril 1961 | Échec du débarquement de la **baie des Cochons** (1500 exilés soutenus par la CIA) |
| 5 | 1962 | Castro obtient de Khrouchtchev l’installation de **missiles offensifs** |

**Le bras de fer.** Le **22 octobre 1962**, preuves photographiques en main (avions U2), Kennedy décrète un **blocus** de Cuba et prévient que tout tir depuis l’île sera considéré comme une attaque de l’URSS.

**Le dénouement.** Le 26 octobre, Khrouchtchev propose un compromis : retrait des missiles soviétiques sous contrôle de l’ONU, contre l’engagement américain de ne pas envahir Cuba et de retirer les fusées « Jupiter » de Turquie. Kennedy accepte. Le **28 octobre**, Khrouchtchev ordonne le démantèlement des **42 rampes de lancement**. Le secrétaire général **U Thant** a joué un rôle efficace de médiateur.

**Les conséquences**

- **Baisse du prestige de l’URSS**, humiliée ; Cuba, déçu, se rapproche de la Chine.
- **Validation de la « dissuasion graduée »** américaine (Robert McNamara, 1961), qui remplace les « représailles massives ».
- **Nécessité du dialogue** : installation du « téléphone rouge » le 23 juin 1963 et signature des accords de Moscou sur l’arrêt des essais nucléaires.

## La coexistence pacifique

Élaborée au **XX·e congrès du PCUS (février 1956)**, la coexistence pacifique signifie que **chaque camp accepte l’existence de l’autre**. Elle intègre la *détente*, période d’apaisement du début des années 1960 à la fin des années 1970.

**Ses facteurs**

1. **De nouveaux hommes** : après la mort de Staline, Khrouchtchev assouplit les positions soviétiques ; puis Brejnev/Nixon, Carter, Gorbatchev/Reagan poursuivent cette ligne.
2. **L’équilibre de la terreur** : le missile intercontinental (août 1957) puis le *Spoutnik* (octobre 1957) montrent que l’URSS a rattrapé son retard. Chacun peut désormais anéantir l’autre.
3. **Les fissures dans les blocs** : à l’Ouest, la France de De Gaulle quitte le commandement de l’OTAN et reconnaît la Chine (1964) ; à l’Est, le **schisme sino-soviétique**, la révolte hongroise (1956) et le **printemps de Prague** brisent l’unité.
4. **L’intérêt économique** : les États-Unis visent les marchés de l’Est, l’URSS a besoin de technologie et de blé américains.

**Ses manifestations : les grands accords de désarmement**

| Accord | Date | Contenu |
|---|---|---|
| Traité de Moscou | août 1963 | interdit les essais nucléaires dans l’atmosphère |
| Non-prolifération (TNP) | juillet 1968 | 115 nations ; distingue États dotés et non dotés |
| **SALT 1** | 1972 | limite ICBM, ABM et sous-marins lanceurs d’engins |
| **SALT 2** | juin 1979 | limite les missiles à longue portée (non ratifié par le Sénat) |
| Traité de Washington | 1987 | détruit les missiles de courte et moyenne portée en Europe |
| **START** | 31 juillet 1991 | réduit d’un tiers les missiles stratégiques |

> **Précision.** Le document date la mort de Staline du « 5 mars 1955 » : il faut lire **5 mars 1953**. De même, le printemps de Prague d’Alexandre Dubček date de **1968** (et non 1958), et les accords de Paris sur le Viêtnam ont été signés le **27 janvier 1973** — le document donne aussi, par erreur, la date du 23 juin.

> **Erreur fréquente.** La coexistence pacifique **ne met pas fin à la guerre froide**. Elle en change les formes : le dialogue remplace l’épreuve de force directe, mais la rivalité se poursuit par conflits périphériques interposés — le Viêtnam en est la démonstration.`,
            extraQuestions: [
              { prompt: "Combien d’Allemands de l’Est ont fui vers l’Ouest entre 1952 et 1961 ?", options: ["2 245 000", "500 000", "56 000", "42 000"], correctIndex: 0, explanation: "Cette saignée démographique motive la construction du mur.", sourceLabel: "Cours II-1-b", points: 2 },
              { prompt: "Dans quelle nuit le mur de Berlin a-t-il été construit ?", options: ["Du 12 au 13 août 1961", "Le 9 novembre 1989", "Le 23 juin 1948", "Le 22 octobre 1962"], correctIndex: 0, explanation: "Le 9 novembre 1989 est au contraire la date de sa chute.", sourceLabel: "Cours II-1-b", points: 1 },
              { prompt: "Quel événement de 1961 a renforcé les liens entre Cuba et l’URSS ?", options: ["L’échec du débarquement de la baie des Cochons", "La construction du mur de Berlin", "Le blocus américain", "Le lancement du Spoutnik"], correctIndex: 0, explanation: "Ce fiasco de la CIA pousse Castro vers Moscou.", sourceLabel: "Cours II-1-c", points: 2 },
              { prompt: "Que propose Khrouchtchev le 26 octobre 1962 pour dénouer la crise ?", options: ["Retirer ses missiles contre l’engagement américain de ne pas envahir Cuba", "Déclarer la guerre aux États-Unis", "Annexer Berlin-Ouest", "Quitter le Pacte de Varsovie"], correctIndex: 0, explanation: "Kennedy accepte et retire aussi les fusées « Jupiter » de Turquie.", sourceLabel: "Cours II-1-c", points: 2 },
              { prompt: "Classe : « le téléphone rouge entre le Kremlin et la Maison-Blanche » est…", options: ["une conséquence de la crise de Cuba", "une cause de la crise de Cuba", "une cause de la crise de Berlin", "sans rapport avec la guerre froide"], correctIndex: 0, explanation: "Installé le 23 juin 1963, il naît de la prise de conscience du risque nucléaire.", sourceLabel: "Activité d’application 2", points: 2 },
              { prompt: "En quelle année la coexistence pacifique est-elle élaborée, et par qui ?", options: ["1956, au XXᵉ congrès du PCUS", "1947, par la doctrine Truman", "1962, par Kennedy", "1985, par Gorbatchev"], correctIndex: 0, explanation: "Le XXᵉ congrès du PCUS de février 1956 en pose le principe.", sourceLabel: "Cours II-2", points: 2 },
              { prompt: "L’équilibre de la terreur seul justifie la coexistence pacifique.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Il s’y ajoute l’arrivée de nouveaux dirigeants, les fissures dans les blocs et l’intérêt économique.", sourceLabel: "Activité d’application 2, affirmation 8", points: 2 },
              { prompt: "La seconde guerre du Viêtnam a montré l’échec de la coexistence pacifique.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "La détente n’empêche pas les conflits périphériques : c’est la « détente contrariée ».", sourceLabel: "Activité d’application 2, affirmation 9", points: 2 },
            ],
          },
        ],
        distractors: ["La coexistence pacifique supprime immédiatement les deux blocs.", "Berlin n’a aucun rôle dans la guerre froide.", "La guerre du Vietnam est un affrontement direct entre armées américaine et soviétique."],
      },
      {
        id: "collapse-ussr",
        title: "La désagrégation de l’URSS",
        summary: "Expliquer réformes de Gorbatchev, chute du rideau de fer et fin du monde bipolaire.",
        conceptTitle: "Les réformes accélèrent l’effondrement du bloc de l’Est",
        explanation: "Mikhaïl Gorbatchev lance la perestroïka et la glasnost pour réformer un système en crise. La libéralisation affaiblit le contrôle soviétique, favorise les révolutions d’Europe de l’Est, la chute du mur de Berlin et les indépendances des républiques soviétiques.",
        bodyMarkdown: String.raw`## L’expérience Gorbatchev

Au **XXVIIᵉ congrès du PCUS, en février 1986**, Gorbatchev dénonce les blocages de l’économie soviétique. Il engage une réforme radicale — non pour abattre le communisme, mais pour **le sauver** de la stagnation.

| | **Perestroïka** | **Glasnost** |
|---|---|---|
| **Traduction** | restructuration | transparence |
| **Domaine** | **économique** | **politique** |
| **Objectif** | ranimer l’innovation et l’esprit d’entreprise | lever les blocages du système politique |
| **Mesures** | travail individuel autorisé (1986) ; autonomie des entreprises d’État ; terre louée aux paysans pour 50 ans ; sociétés mixtes et commerce extérieur libéralisé (1988) | suppression de la censure ; rétablissement de la vérité historique ; démocratisation et réforme des institutions |

> **Erreur fréquente.** C’est le piège numéro un de la leçon : la **perestroïka est économique**, la **glasnost est politique**. L’activité d’application 4 du cours inverse volontairement les deux définitions pour vérifier que tu ne les confonds pas.

## L’effondrement du rideau de fer

Dès **1987**, Gorbatchev abandonne la **doctrine de la souveraineté limitée** énoncée par Brejnev en 1968. Conséquence décisive : l’Armée rouge **ne sortira pas de ses casernes** pendant les bouleversements d’Europe de l’Est.

Les démocraties populaires basculent alors les unes après les autres — Pologne, Tchécoslovaquie, Roumanie, Hongrie, RDA :

- abandon du système économique de l’Est au profit du libéralisme ;
- abolition du rôle dirigeant du parti communiste ;
- introduction du pluralisme politique.

Le **9 novembre 1989**, le mur de Berlin est démantelé ; la **réunification allemande** est acquise en **octobre 1990**. Un demi-siècle après sa constitution, le rideau de fer s’effondre.

## La fin de l’URSS (1991)

**Les difficultés.** Privés des appuis financiers occidentaux espérés, les réformateurs sont submergés : déficit budgétaire, flambée des prix, pénuries, paupérisation, grèves massives. S’y ajoute le **réveil des nationalismes** au Kazakhstan, en Azerbaïdjan, en Arménie, en Géorgie et dans les pays baltes.

**Le putsch manqué.** Du **18 au 23 août 1991**, alors que Gorbatchev est en vacances en Crimée, les conservateurs tentent un coup d’État. Il échoue grâce à la mobilisation populaire conduite par **Boris Eltsine**, président de la Fédération de Russie. Eltsine en profite pour **interdire le PCUS** et reconnaître l’indépendance des républiques baltes.

**La dislocation.** Les républiques proclament leur indépendance les unes après les autres au cours de 1991. Le **21 décembre 1991**, Eltsine crée la **Communauté des États indépendants (CEI)**, regroupant 11 anciennes républiques. L’URSS ayant disparu, Gorbatchev démissionne.

> **Précision.** Le document indique que Gorbatchev démissionne « le 25 août 1911 » : il faut lire le **25 décembre 1991**, après la création de la CEI.

> **Le paradoxe à retenir.** Lancées **pour sauver** le communisme soviétique, la perestroïka et la glasnost ont **provoqué** la disparition du bloc soviétique et de l’URSS. Les réformes destinées à consolider le système ont libéré les forces qui l’ont désagrégé.

## Un monde unipolaire

La disparition de l’URSS consacre l’avènement d’une **« hyperpuissance »** : les États-Unis. Ils se considèrent désormais comme les « gendarmes du monde » — guerres du Golfe (1991, 2003), interventions en Somalie (1992), en Haïti (1994), en Afghanistan (2001).

> **Attention au vocabulaire.** La désagrégation de l’URSS fait naître un monde **unipolaire** (un seul pôle dominant), et non *multipolaire*. Le passage au multipolaire viendra plus tard — c’est l’objet de la leçon suivante.`,
        keyPoint: "L’effondrement du bloc de l’Est et la disparition de l’URSS en 1991 mettent fin à la bipolarisation.",
        example: "La chute du mur de Berlin le 9 novembre 1989 ouvre la voie à la réunification allemande et symbolise la fin du rideau de fer.",
        timelineTitle: "De la réforme à la disparition de l’URSS",
        timelineInstruction: "Suis les étapes qui conduisent à la fin de la guerre froide.",
        timeline: [
          { label: "1985", detail: "Gorbatchev arrive au pouvoir et engage perestroïka et glasnost." },
          { label: "9 novembre 1989", shortLabel: "1989", detail: "Chute du mur de Berlin et accélération des changements en Europe de l’Est." },
          { label: "1991", detail: "Dissolution du Pacte de Varsovie, éclatement de l’URSS et fin du monde bipolaire." },
        ],
        observation: "Les réformes destinées à sauver le système contribuent finalement à libérer les forces qui le désagrègent.",
        check: { prompt: "Que signifie la glasnost ?", options: ["Une politique de transparence", "Une alliance militaire", "Un plan d’aide américain", "Une monnaie commune"], correctIndex: 0, explanation: "La glasnost vise l’ouverture et la transparence de la vie publique soviétique." },
        extraQuestions: [
          { prompt: "La glasnost est une politique de restructuration économique.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "La glasnost est politique (transparence) ; c’est la perestroïka qui est économique.", sourceLabel: "Activité d’application 4, affirmation 4", points: 2 },
          { prompt: "La perestroïka, ou transparence, est destinée à lutter contre les blocages du système politique.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Les deux termes sont inversés : la perestroïka est la restructuration économique.", sourceLabel: "Activité d’application 4, affirmation 5", points: 2 },
          { prompt: "Quelle doctrine Gorbatchev abandonne-t-il en 1987, permettant les révolutions à l’Est ?", options: ["La doctrine de la souveraineté limitée de Brejnev", "La doctrine Truman", "La doctrine Jdanov", "La doctrine de dissuasion graduée"], correctIndex: 0, explanation: "Sans elle, l’Armée rouge n’intervient plus : les démocraties populaires basculent librement.", sourceLabel: "Cours III-1-b", points: 2 },
          { prompt: "Le 9 novembre 1989, le mur de Berlin est démantelé et la réunification allemande est faite en octobre 1990.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Les deux dates sont exactes.", sourceLabel: "Activité d’application 4, affirmation 3", points: 1 },
          { prompt: "Qui conduit la mobilisation qui fait échouer le putsch d’août 1991 ?", options: ["Boris Eltsine", "Mikhaïl Gorbatchev", "Léonid Brejnev", "Walter Ulbricht"], correctIndex: 0, explanation: "Président de la Fédération de Russie, il en profite pour interdire le PCUS.", sourceLabel: "Cours III-1-c", points: 2 },
          { prompt: "Que crée Boris Eltsine le 21 décembre 1991 ?", options: ["La Communauté des États indépendants (CEI)", "Le Pacte de Varsovie", "La CEDEAO", "L’Union européenne"], correctIndex: 0, explanation: "La CEI regroupe 11 des anciennes républiques soviétiques.", sourceLabel: "Cours III-1-c", points: 2 },
          { prompt: "Les réformes de Gorbatchev avaient pour objectif l’éclatement de l’URSS.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elles visaient au contraire à sauver le communisme soviétique : l’éclatement est un effet non voulu.", sourceLabel: "Activité d’application 2, affirmation 10", points: 2 },
          { prompt: "La désagrégation de l’URSS consacre la naissance d’un monde multipolaire.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle fait naître un monde **unipolaire** dominé par les États-Unis.", sourceLabel: "Activité d’application 2, affirmation 12", points: 2 },
        ],
        distractors: ["L’URSS disparaît en 1947.", "La chute du mur de Berlin renforce définitivement le bloc soviétique.", "La perestroïka est la doctrine de politique étrangère de Truman."],
      },
    ],
  },
  {
    id: "terminale-hg-h3-multipolar-world",
    strand: "Histoire",
    chapterNumber: 3,
    themeNumber: 1,
    themeTitle: "Les relations internationales de 1945 à nos jours",
    title: "De la fin de la guerre froide vers un monde multipolaire",
    description: "Analyser l’hyperpuissance américaine puis l’émergence de nouveaux pôles d’influence.",
    sections: [
      {
        id: "american-hyperpower",
        title: "L’hyperpuissance américaine",
        summary: "Identifier les dimensions militaire, économique, technologique, culturelle et politique de la puissance américaine.",
        conceptTitle: "Une seule superpuissance après 1991",
        explanation: "La disparition de l’URSS laisse les États-Unis sans rival global. Leur supériorité combine armée, dollar, grandes entreprises, technologies, diplomatie, institutions internationales et diffusion mondiale de l’American way of life.",
        keyPoint: "L’hyperpuissance désigne une domination qui s’exerce simultanément dans presque tous les domaines.",
        example: "Hollywood, les firmes numériques, Wall Street, le Pentagone et le rôle dans l’OTAN illustrent différentes dimensions du hard power et du soft power.",
        timelineTitle: "Les dimensions de l’hyperpuissance",
        timelineInstruction: "Compare trois leviers complémentaires de l’influence américaine.",
        timeline: [
          { label: "Le hard power militaire", shortLabel: "Le hard power militaire", detail: "Première puissance nucléaire, armée la mieux équipée, réseau mondial de bases et commandement de l’OTAN." },
          { label: "La puissance économique et technologique", shortLabel: "L’économie", detail: "Dollar, Wall Street, institutions financières, firmes multinationales et technologies de pointe." },
          { label: "Le soft power culturel et politique", shortLabel: "le soft power", detail: "Hollywood, american way of life, siège permanent au Conseil de sécurité et suprématie diplomatique." },
        ],
        observation: "Une puissance mondiale combine contrainte, richesse, innovation et capacité d’attraction.",
        check: { prompt: "Quel terme décrit l’influence culturelle et l’attraction d’un pays ?", options: ["Soft power", "Blocus", "Apartheid", "Collectivisation"], correctIndex: 0, explanation: "Le soft power agit par l’attraction culturelle, les valeurs et l’image." },
        parts: [
          {
            bodyMarkdown: String.raw`## Pourquoi parle-t-on d’« hyperpuissance » ?

La disparition de l’URSS en 1991, en tant que **modèle idéologique conquérant**, laisse les États-Unis seule superpuissance sur la scène internationale. Mais ils vont plus loin : ils renforcent ce statut **dans tous les domaines à la fois**, à l’échelle planétaire. D’où le terme d’**hyperpuissance**.

Leur objectif déclaré est de « **façonner et déterminer les structures de la politique économique globale** », donc de « choisir et modeler les structures au sein desquelles les autres pays, leurs institutions politiques, leurs entreprises et leurs professionnels doivent opérer ».

> **Superpuissance ou hyperpuissance ?** Une **superpuissance** domine un ou deux domaines et a un rival — c’était le cas des USA et de l’URSS pendant la guerre froide. Une **hyperpuissance** domine **simultanément** le militaire, l’économique, le technologique, le culturel et le politique, **sans rival**. C’est la nuance que le cours te demande de maîtriser.

## Le hard power militaire

| Domaine | Éléments de puissance |
|---|---|
| **Nucléaire** | première puissance nucléaire mondiale |
| **Équipement** | armée la mieux équipée au monde |
| **Budget** | Pentagone : **740 milliards de dollars** en 2021 |
| **Déploiement** | présence militaire, maritime et terrestre mondiale |
| **Renseignement** | surveillance militaire globale |
| **Alliances** | **commandement de l’OTAN** |
| **Interventions** | engagement dans l’essentiel des grands conflits du monde |

Ce réseau de bases réparties sur tous les continents, appuyé par une flotte imposante et une aviation très performante, fait des États-Unis **le seul État capable d’intervenir n’importe où et n’importe quand**.

> **Erreur fréquente.** Le hard power **ne se réduit pas au nombre de soldats** : il combine l’arme nucléaire, la capacité de projection (bases, flotte, aviation) et le commandement d’alliances. C’est cette combinaison qui rend la puissance américaine unique.`,
            extraQuestions: [
              { prompt: "Quel était le budget du Pentagone en 2021 ?", options: ["740 milliards de dollars", "74 milliards de dollars", "295 millions de dollars", "23 milliards de dollars"], correctIndex: 0, explanation: "Ce budget, sans équivalent au monde, illustre le hard power américain.", sourceLabel: "Cours I-1, plan militaire", points: 2 },
              { prompt: "Classe : « Armée la mieux équipée au monde » relève de quelle puissance ?", options: ["Puissance militaire", "Puissance économique", "Puissance politique", "Puissance culturelle"], correctIndex: 0, explanation: "Avec le budget du Pentagone et la présence mondiale, c’est un marqueur militaire.", sourceLabel: "Activité d’application 3", points: 1 },
              { prompt: "Quelle alliance militaire les États-Unis commandent-ils ?", options: ["L’OTAN", "Le Pacte de Varsovie", "Les BRICS", "L’OCS"], correctIndex: 0, explanation: "Le commandement de l’OTAN prolonge leur influence militaire en Europe.", sourceLabel: "Cours I-1, plan militaire", points: 1 },
              { prompt: "Les États-Unis sont le seul État au monde capable d’intervenir n’importe où et n’importe quand.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Bases mondiales, flotte imposante et aviation performante rendent cette projection possible.", sourceLabel: "Activité d’application 1 — texte à trous", points: 2 },
            ],
          },
          {
            bodyMarkdown: String.raw`## La puissance économique

| Domaine | Éléments de puissance |
|---|---|
| **Rang** | première puissance économique mondiale |
| **Mondialisation** | premier pôle des échanges internationaux |
| **Monnaie** | **suprématie du dollar** |
| **Finance** | puissance de **Wall Street**, la place boursière de la planète |
| **Institutions** | siège du **FMI** et de la **Banque mondiale** |
| **Entreprises** | domination des firmes multinationales du numérique |

Le marché intérieur américain compte environ **295 millions de consommateurs** au pouvoir d’achat élevé, tout en restant largement ouvert sur l’extérieur. Sur les **500 premières multinationales** du monde, **239 sont américaines**.

## La puissance technologique

Première puissance en technologies de pointe — informatique, télécommunications, aérospatiale, biochimie, robotique — les États-Unis pratiquent aussi un **cyberespionnage à l’échelle planétaire** via leurs services de renseignement, dont la **NSA** (National Security Agency).

## Le soft power culturel et politique

Le **soft power** est la capacité d’un pays à obtenir ce qu’il veut par **l’attraction et la séduction**, plutôt que par la contrainte.

- **Culturel** : Hollywood diffuse l’« **american way of life** » par le cinéma, la musique, la télévision, la mode et le fast-food (Coca-Cola, McDonald’s, Pepsi).
- **Politique** : membre permanent du Conseil de sécurité de l’ONU, suprématie diplomatique, fortes pressions dans les relations internationales, capacité à orienter la politique mondiale selon leurs intérêts.

## Le regard d’un analyste

> « Des décombres de la guerre froide, les États-Unis émergent seuls vainqueurs. Plus rien ne s’oppose à la diffusion universelle du modèle américain, désormais sans rival. **Cette expansion revêt les formes douces de l’hégémonie et non celles brutales de l’expédition. La séduction des esprits remplace efficacement le contrôle des territoires.** […] Nul n’est dupe de cette forme d’**impérialisme doux**, que la présidence de Bill Clinton (1993-2001) […] a incarné avec brio. »
>
> — Jean Musitelli, « 1991-2001 : permanences et changements », *Revue internationale et stratégique*, 2001

> **Précision.** La décennie unipolaire 1991-2001 correspond très majoritairement à la présidence de **Bill Clinton (1993-2001)**, comme l’indique ce document. George W. Bush n’entre en fonction qu’en **janvier 2001** : attribuer toute la période à sa présidence est une erreur que l’activité d’application 2 du cours cherche justement à faire repérer.

> **Astuce mémoire de Davy.** Retiens les **cinq plans** de l’hyperpuissance dans l’ordre : **M-É-T-C-P** — Militaire, Économique, Technologique, Culturel, Politique. Et associe à chacun un symbole : le Pentagone, le dollar, la NSA, Hollywood, le Conseil de sécurité.`,
            extraQuestions: [
              { prompt: "Sur les 500 premières multinationales du monde, combien sont américaines ?", options: ["239", "27", "500", "115"], correctIndex: 0, explanation: "Près de la moitié : c’est un marqueur fort de la domination économique.", sourceLabel: "Activité d’application 1 — texte à trous", points: 2 },
              { prompt: "Quelle place boursière domine la finance mondiale ?", options: ["Wall Street", "La City", "La Bourse de Shanghai", "Le Nikkei"], correctIndex: 0, explanation: "Wall Street est présentée par le cours comme « la place boursière de la planète ».", sourceLabel: "Cours I-1, plan économique", points: 1 },
              { prompt: "Quel service de renseignement américain pratique le cyberespionnage à l’échelle planétaire ?", options: ["La NSA", "Le FMI", "L’OCS", "La CIA uniquement"], correctIndex: 0, explanation: "La National Security Agency est citée par le cours au titre du plan technologique.", sourceLabel: "Cours I-1, plan technologique", points: 1 },
              { prompt: "Classe : « Suprématie du dollar dans l’économie mondiale » relève de quelle puissance ?", options: ["Puissance économique", "Puissance militaire", "Puissance politique", "Puissance technologique"], correctIndex: 0, explanation: "Avec Wall Street et les multinationales, c’est un marqueur économique.", sourceLabel: "Activité d’application 3", points: 1 },
              { prompt: "Classe : « Membre permanent du Conseil de sécurité de l’ONU » relève de quelle puissance ?", options: ["Puissance politique", "Puissance économique", "Puissance militaire", "Puissance culturelle"], correctIndex: 0, explanation: "Le siège permanent et le droit de veto sont des leviers politiques.", sourceLabel: "Activité d’application 3", points: 1 },
              { prompt: "Que désigne l’expression « american way of life » ?", options: ["Le mode de vie américain diffusé par le cinéma, la musique et la consommation", "Une doctrine militaire", "Un accord commercial", "Une alliance politique"], correctIndex: 0, explanation: "C’est le cœur du soft power culturel : Hollywood, la mode, le fast-food.", sourceLabel: "Cours I-1, plan culturel", points: 2 },
              { prompt: "Selon Jean Musitelli, l’expansion du modèle américain prend surtout la forme :", options: ["D’un « impérialisme doux » fondé sur la séduction des esprits", "D’une conquête militaire des territoires", "D’un repli isolationniste", "D’une alliance avec la Russie"], correctIndex: 0, explanation: "« La séduction des esprits remplace efficacement le contrôle des territoires. »", sourceLabel: "Document 2 — Jean Musitelli", points: 2 },
            ],
          },
        ],
        distractors: ["Après 1991, les États-Unis perdent toute influence mondiale.", "L’hyperpuissance est uniquement une puissance militaire.", "Le dollar n’a aucun rôle international."],
      },
      {
        id: "world-policeman",
        title: "Les États-Unis, gendarme du monde",
        summary: "Situer les interventions américaines des années 1990 et discuter l’unilatéralisme.",
        conceptTitle: "Intervenir pour façonner l’ordre international",
        explanation: "Dans les années 1990, les États-Unis conduisent ou soutiennent des interventions au Koweït, en Somalie, en Haïti, en Bosnie et au Kosovo. Certaines reçoivent l’appui de l’ONU ou de l’OTAN, d’autres alimentent l’antiaméricanisme.",
        bodyMarkdown: String.raw`## Le « nation-building »

À partir de **1991**, les États-Unis renforcent leur présence militaire sur le globe. Face à l’instabilité sociopolitique de plusieurs régions, ils s’engagent — sous une couverture présentée comme **humanitaire** — dans des opérations de **nation-building** (construction des nations).

Ils s’érigent ainsi en **gendarme du monde**, avec des interventions tantôt **unilatérales**, tantôt menées avec l’accord de l’**ONU** ou sous la bannière de l’**OTAN**. Les motifs invoqués sont le rétablissement des principes démocratiques bafoués, l’assistance humanitaire ou la stabilité géopolitique régionale.

## Les cinq interventions à connaître

| Année | Opération | Lieu | Objectif affiché |
|---|---|---|---|
| **1991** | *Tempête du désert* | **Koweït** occupé par l’Irak | conduite de la guerre du Golfe, à la suite d’une requête du Koweït à l’ONU |
| **1993-1994** | *Restore Hope* | **Somalie** | soutenir les opérations humanitaires de l’ONU et éliminer le général Mohamed Aïdid |
| **1994** | *Uphold Democracy* | **Haïti** | installer le président élu Jean-Bertrand Aristide |
| **1995** | intervention de l’**OTAN** | **Bosnie-Herzégovine** (ex-Yougoslavie) | met fin au conflit par les **accords de Dayton**, le 21 novembre 1995 |
| **1999** | intervention de l’**OTAN** | **Kosovo**, contre la Serbie | guerre du Kosovo |

## La contrepartie : l’antiaméricanisme

Ces interventions répétées nourrissent un **sentiment d’antiaméricanisme** qui se crée et se renforce à travers le monde, **surtout dans les États arabes du Proche et du Moyen-Orient**. C’est ce ressentiment qui prépare le terrain du chapitre suivant : les attentats du 11 septembre 2001.

> **Erreur fréquente.** Toutes les interventions ne se valent pas juridiquement. Certaines s’appuient sur une **requête et un mandat de l’ONU** (Koweït, Somalie), d’autres passent par l’**OTAN** (Bosnie, Kosovo), d’autres encore seront purement **unilatérales** (Afghanistan 2001, Irak 2003). À l’examen, précise toujours **sous quel mandat** l’intervention a eu lieu : c’est ce qui fonde ou fragilise sa légitimité.

> **Astuce mémoire de Davy.** Retiens les cinq opérations par leur ordre chronologique et leur continent : **Golfe (1991, Asie) → Somalie (1993, Afrique) → Haïti (1994, Amérique) → Bosnie (1995, Europe) → Kosovo (1999, Europe)**. Quatre continents en huit ans : c’est cela, être « gendarme du monde ».`,
        keyPoint: "Le rôle de gendarme du monde repose sur la capacité américaine d’intervenir loin de son territoire et d’orienter le règlement des crises.",
        example: "L’opération Tempête du désert de 1991 libère le Koweït occupé par l’Irak dans le cadre d’une coalition autorisée par l’ONU.",
        timelineTitle: "Les interventions des années 1990",
        timelineInstruction: "Parcours trois opérations emblématiques citées dans le cours.",
        timeline: [
          { label: "1991", detail: "Guerre du Golfe et opération Tempête du désert contre l’occupation du Koweït." },
          { label: "1993-1994", detail: "Opération Restore Hope en Somalie sous couverture humanitaire." },
          { label: "1995-1999", detail: "Interventions de l’OTAN en Bosnie-Herzégovine puis au Kosovo." },
        ],
        observation: "La légitimité d’une intervention dépend notamment de son mandat, de ses objectifs et de ses conséquences.",
        check: { prompt: "Quelle opération est liée à la guerre du Golfe de 1991 ?", options: ["Tempête du désert", "Restore Hope", "Uphold Democracy", "Perestroïka"], correctIndex: 0, explanation: "Tempête du désert est l’opération militaire menée pour libérer le Koweït." },
        extraQuestions: [
          { prompt: "À quelle année correspond l’opération Restore Hope ?", options: ["1993-1994", "1991", "1994", "1999"], correctIndex: 0, explanation: "Intervention en Somalie pour soutenir l’action humanitaire de l’ONU.", sourceLabel: "Activité d’application 1", points: 1 },
          { prompt: "Quelle opération de 1994 visait à installer le président élu Jean-Bertrand Aristide ?", options: ["Uphold Democracy, en Haïti", "Restore Hope, en Somalie", "Tempête du désert, au Koweït", "L’intervention au Kosovo"], correctIndex: 0, explanation: "Haïti, 1994 : rétablir le président démocratiquement élu.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "Quels accords mettent fin au conflit de Bosnie-Herzégovine le 21 novembre 1995 ?", options: ["Les accords de Dayton", "Les accords de Genève", "Les accords de Paris", "Les accords de Moscou"], correctIndex: 0, explanation: "Signés aux États-Unis, ils closent l’intervention de l’OTAN en Bosnie.", sourceLabel: "Cours I-2", points: 2 },
          { prompt: "Contre quel pays l’OTAN intervient-elle en 1999 dans la guerre du Kosovo ?", options: ["La Serbie", "L’Irak", "La Somalie", "La Russie"], correctIndex: 0, explanation: "L’intervention de 1999 vise la Serbie.", sourceLabel: "Activité d’application 1", points: 1 },
          { prompt: "Que signifie l’expression « nation-building » ?", options: ["Des opérations de construction des nations", "Un accord commercial", "Une doctrine nucléaire", "Une alliance militaire"], correctIndex: 0, explanation: "C’est le cadre présenté comme humanitaire des interventions américaines.", sourceLabel: "Cours I-2", points: 2 },
          { prompt: "Le rôle de gendarme du monde signifie que les USA ont décidé de régler les problèmes du monde en s’appuyant sur leur hyperpuissance.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "C’est exactement la définition retenue par le cours.", sourceLabel: "Activité d’application 2, affirmation 5", points: 1 },
          { prompt: "Dans quelle région le sentiment d’antiaméricanisme se renforce-t-il surtout ?", options: ["Les États arabes du Proche et du Moyen-Orient", "L’Amérique du Nord", "L’Europe du Nord", "L’Océanie"], correctIndex: 0, explanation: "Ce ressentiment prépare le contexte des attentats du 11 septembre 2001.", sourceLabel: "Cours I-2", points: 2 },
        ],
        distractors: ["Les États-Unis n’interviennent jamais hors de leur territoire après 1991.", "Toutes les interventions des années 1990 se déroulent en Amérique du Nord.", "Le rôle de gendarme ne comporte aucune dimension militaire."],
      },
      {
        id: "multipolarity",
        title: "L’avènement d’un monde multipolaire",
        summary: "Relier le 11 septembre 2001, l’affaiblissement américain et l’affirmation de nouveaux pôles.",
        conceptTitle: "La puissance se redistribue entre plusieurs centres",
        explanation: "Les attentats du 11 septembre et les guerres d’Afghanistan et d’Irak révèlent les limites du leadership américain. L’Union européenne, la Chine, la Russie, l’Inde, le Brésil et des puissances régionales affirment davantage leurs intérêts.",
        bodyMarkdown: String.raw`## Le 11 septembre 2001

Les attentats sont orchestrés par **Oussama Ben Laden**, dirigeant de l’organisation **Al-Qaïda**. Quatre avions sont détournés peu après leur décollage :

| Cible | Fait |
|---|---|
| **World Trade Center** (New York) | deux avions percutent les tours jumelles, qui s’effondrent en quelques heures — **plus de 3 000 morts** |
| **Pentagone** (Washington) | un avion s’abat sur le siège du ministère de la Défense |
| **Pennsylvanie** | un quatrième avion s’écrase dans une forêt |

> **Précision.** L’activité d’application 2 du document écrit « le 11 septembre **2011** » : il faut évidemment lire **2001**.

## La riposte américaine

En représailles, les États-Unis redéfinissent leur politique de *nation-building* et s’engagent dans la **guerre contre le terrorisme international** :

- **2001 — Afghanistan** : intervention militaire massive contre le régime des **Talibans**, où serait réfugié le chef d’Al-Qaïda. Elle est déclenchée **sans l’aval de l’ONU**.
- Ils mènent une « croisade » démocratique contre les « **États voyous** » (*Rogue States*) formant l’« **axe du mal** » : Iran, Irak, Syrie, Corée du Nord.
- **2003 — Irak** : **guerre préventive** contre le régime de Saddam Hussein, soupçonné de fabriquer des **armes de destruction massive**.

## Pourquoi le leadership s’affaiblit-il ?

Six facteurs convergent :

1. les attentats du 11 septembre eux-mêmes, qui brisent le sentiment d’invulnérabilité ;
2. le **contrôle des libertés civiles** sous menace terroriste permanente — alors qu’elles fondent la démocratie américaine ;
3. l’**enlisement** des guerres d’Afghanistan et d’Irak ;
4. les **mensonges** ayant justifié la guerre d’Irak (les armes de destruction massive n’ont jamais été trouvées) ;
5. les **crises financières** récurrentes ;
6. le **refus de l’unilatéralisme** américain par certains alliés.

## Les nouveaux pôles d’influence

### L’Union européenne

Mise en place en **1992 par le traité de Maastricht**, elle compte aujourd’hui **27 États**. Premier espace économique mondial, elle pèse par son *soft power* sur les questions économiques, environnementales, les droits de l’homme et les principes démocratiques.

**Sa limite** : malgré la **PESD** (Politique européenne de sécurité et de défense), sa défense extérieure reste **fortement dépendante de l’OTAN**, largement contrôlée par les États-Unis. Sur le continent africain, les pays de l’UE n’ont pas toujours d’approche commune.

> **Précision.** Le document parle de la « sortie de l’Angleterre en 2020 » : c’est le **Royaume-Uni** dans son ensemble qui a quitté l’UE (*Brexit*), et non la seule Angleterre.

### Les BRICS

| Pays | Atouts principaux |
|---|---|
| **Russie** | héritière de l’URSS ; **2ᵉ exportateur mondial d’armement** (23 % du marché) ; **1ᵉʳ exportateur d’énergie** (~30 % des réserves mondiales de gaz) ; priorités : intérêts économiques et maintien des ex-républiques soviétiques dans son orbite (Géorgie 2008, Ukraine 2014) |
| **Chine** | **2ᵉ puissance économique mondiale** ; puissance par le contrôle stratégique des mers proches et la pénétration de nouveaux marchés, notamment africain (*soft power*) ; à l’origine de l’**ASEAN Plus Trois** en 1997 |
| **Inde** | taille démographique, dynamisme économique et technologique, investissements militaires et spatiaux croissants |
| **Brésil** | puissance **diplomatique** plutôt que militaire (voisinage américain) : commandement de la **MINUSTAH** en 2004, prédominance du **MERCOSUR** créé en 1991 |

Russie et Chine coopèrent depuis **2001** au sein de l’**Organisation de coopération de Shanghai (OCS)**, avec le Kazakhstan, le Kirghizistan, le Tadjikistan et l’Ouzbékistan.

### Les puissances émergentes du Moyen-Orient

**Israël, l’Iran, la Turquie et l’Arabie Saoudite** aspirent à un leadership régional. Les oppositions religieuses (judaïsme, islam chiite iranien, islam sunnite saoudien), la montée de l’intégrisme et les enjeux territoriaux, sécuritaires et pétroliers font du Moyen-Orient **la région la plus instable de la planète**.

> **Erreur fréquente.** Multipolaire **ne veut pas dire bipolaire**. Le monde bipolaire (1947-1991) opposait **deux** blocs ; le monde multipolaire compte **plusieurs centres de domination**, aux moyens et à l’influence inégaux. Et attention : un monde multipolaire n’est **pas** un monde équilibré.

> **Astuce mémoire de Davy.** Trois dates structurent toute la leçon : **1991** (fin de l’URSS → monde unipolaire), **2001** (11 septembre → contestation), **depuis 2001** (émergence des pôles → monde multipolaire). Si tu retiens ces trois bornes, tu tiens le plan complet.`,
        keyPoint: "Un monde multipolaire se caractérise par plusieurs pôles capables d’influencer l’économie, la sécurité et les décisions internationales.",
        example: "Les BRICS contestent l’ancien ordre par leur poids démographique, économique, énergétique, technologique ou diplomatique.",
        timelineTitle: "Du choc de 2001 à la multipolarité",
        timelineInstruction: "Suis le passage d’un leadership américain incontesté à une influence plus partagée.",
        timeline: [
          { label: "11 septembre 2001", shortLabel: "2001", detail: "Les attentats d’Al-Qaïda frappent New York et Washington et redéfinissent la politique américaine." },
          { label: "2001-2003", detail: "Guerres d’Afghanistan puis d’Irak, enlisement et contestation de l’unilatéralisme." },
          { label: "Depuis les années 2000", shortLabel: "Multipolarité", detail: "Montée de la Chine, retour de la Russie, poids des BRICS, de l’UE et de puissances régionales." },
        ],
        observation: "Multipolaire ne signifie pas équilibré : les pôles n’ont ni les mêmes moyens ni la même influence.",
        check: { prompt: "Quel événement fragilise fortement le sentiment d’invulnérabilité américain en 2001 ?", options: ["Les attentats du 11 septembre", "La conférence de Yalta", "La création de l’ONU", "La chute de Rome"], correctIndex: 0, explanation: "Les attentats du 11 septembre 2001 ouvrent une nouvelle phase des relations internationales." },
        extraQuestions: [
          { prompt: "Le 11 septembre 2001 marque :", options: ["Les attaques terroristes subies par les États-Unis", "L’intervention américaine en Somalie", "La chute d’Al-Qaïda", "La fin de la guerre froide"], correctIndex: 0, explanation: "Quatre avions détournés frappent le World Trade Center, le Pentagone et s’écrasent en Pennsylvanie.", sourceLabel: "Activité d’application 2", points: 1 },
          { prompt: "Qui dirige l’organisation Al-Qaïda, commanditaire des attentats ?", options: ["Oussama Ben Laden", "Saddam Hussein", "Mohamed Aïdid", "Jean-Bertrand Aristide"], correctIndex: 0, explanation: "Les États-Unis interviennent en Afghanistan en 2001, où il serait réfugié.", sourceLabel: "Cours II-1", points: 1 },
          { prompt: "Quels pays forment l’« axe du mal » selon les États-Unis ?", options: ["Iran, Irak, Syrie, Corée du Nord", "Chine, Russie, Inde, Brésil", "France, Allemagne, Italie, Espagne", "Somalie, Haïti, Bosnie, Kosovo"], correctIndex: 0, explanation: "Ces « États voyous » sont soupçonnés de soutenir le terrorisme international.", sourceLabel: "Cours II-1", points: 2 },
          { prompt: "Quel motif est invoqué pour la guerre préventive contre l’Irak en 2003 ?", options: ["La fabrication supposée d’armes de destruction massive", "L’occupation du Koweït", "Une requête de l’ONU", "Un conflit frontalier avec l’Iran"], correctIndex: 0, explanation: "Ces armes n’ont jamais été trouvées : ces mensonges affaibliront le leadership américain.", sourceLabel: "Cours II-1", points: 2 },
          { prompt: "L’intervention américaine de 2001 en Afghanistan a-t-elle reçu l’aval de l’ONU ?", options: ["Non, elle est déclenchée sans son aval", "Oui, sur mandat du Conseil de sécurité", "Oui, sous bannière de l’OTAN", "Elle n’a pas eu lieu"], correctIndex: 0, explanation: "Cet unilatéralisme sera contesté par plusieurs alliés des États-Unis.", sourceLabel: "Cours II-1", points: 2 },
          { prompt: "Quel traité de 1992 met en place l’Union européenne ?", options: ["Le traité de Maastricht", "Le traité de Rome", "Le traité de Washington", "Les accords de Dayton"], correctIndex: 0, explanation: "L’UE compte aujourd’hui 27 États après le Brexit.", sourceLabel: "Cours II-2", points: 1 },
          { prompt: "Le groupe des BRICS comprend :", options: ["Le Brésil, la Russie, l’Inde, la Chine et l’Afrique du Sud", "La Belgique, la Russie, l’Inde, le Canada et la Suède", "Le Brésil, la Russie, l’Indonésie, le Canada et la Slovénie", "Les États-Unis, la Chine, le Japon et l’UE"], correctIndex: 0, explanation: "L’acronyme reprend les initiales des cinq pays émergents.", sourceLabel: "Activité d’application 2", points: 2 },
          { prompt: "Dans l’ordre mondial multipolaire, quels sont les deux principaux rivaux des États-Unis ?", options: ["La Chine et la Russie", "L’UE et la Russie", "L’Inde et l’UE", "Le Brésil et l’Inde"], correctIndex: 0, explanation: "Ils coopèrent notamment au sein de l’Organisation de coopération de Shanghai depuis 2001.", sourceLabel: "Activité d’application 2", points: 2 },
          { prompt: "Le monde multipolaire est dominé par :", options: ["Plusieurs centres de domination, et non plus un seul ou deux", "Les pays de la triade", "Les grandes puissances militaires uniquement", "Un seul pôle hégémonique"], correctIndex: 0, explanation: "C’est la définition même de la multipolarité.", sourceLabel: "Activité d’application 2", points: 2 },
          { prompt: "Quelle est la principale limite de la puissance européenne ?", options: ["Sa défense extérieure dépend fortement de l’OTAN", "Elle n’a aucun poids économique", "Elle ne compte que 5 États", "Elle refuse tout soft power"], correctIndex: 0, explanation: "Malgré la PESD, les interventions européennes restent dans le sillage américain.", sourceLabel: "Cours II-2, Union européenne", points: 2 },
          { prompt: "Pourquoi le Brésil exprime-t-il sa puissance surtout par la diplomatie ?", options: ["Son voisinage avec la superpuissance américaine limite ses prétentions", "Il n’a pas d’armée", "Il est membre de l’OTAN", "Il est trop petit"], correctIndex: 0, explanation: "D’où la MINUSTAH en 2004 et sa prédominance dans le MERCOSUR.", sourceLabel: "Cours II-2, Brésil", points: 2 },
          { prompt: "L’unipolarité du monde de la décennie 1990 est née des décombres de la guerre du Vietnam.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle naît des décombres de la **guerre froide**, avec l’effondrement de l’URSS en 1991.", sourceLabel: "Activité d’application 2, affirmation 4", points: 2 },
        ],
        distractors: ["La multipolarité signifie qu’un seul pays dirige le monde.", "Les BRICS sont une alliance militaire créée en 1949.", "La Chine, l’Inde et le Brésil n’ont aucune influence internationale."],
      },
    ],
  },
  {
    id: "terminale-hg-h4-african-nationalism",
    strand: "Histoire",
    chapterNumber: 4,
    themeNumber: 2,
    themeTitle: "De la décolonisation aux efforts d’organisation de l’Afrique",
    title: "La montée des nationalismes en Afrique",
    description: "Identifier les facteurs, les formes et les acquis des mouvements nationalistes africains.",
    sections: [
      {
        id: "factors",
        title: "Les facteurs de la montée des nationalismes",
        summary: "Distinguer facteurs externes et facteurs internes de l’éveil nationaliste.",
        conceptTitle: "Un contexte international et colonial favorable à l’émancipation",
        explanation: "L’affaiblissement de l’Europe, l’anticolonialisme américain et soviétique, l’ONU et Bandung soutiennent les revendications. À l’intérieur, école, élites, bourgeoisies locales, anciens combattants et contraintes coloniales développent la conscience nationale.",
        keyPoint: "La montée des nationalismes résulte de la rencontre entre un contexte international favorable et des transformations internes aux colonies.",
        example: "Les promesses non tenues après les guerres et les travaux forcés renforcent la radicalisation des anciens combattants et des populations.",
        timelineTitle: "Classer les facteurs",
        timelineInstruction: "Explore les facteurs internationaux, sociaux puis coloniaux.",
        timeline: [
          { label: "Facteurs externes", detail: "Affaiblissement des métropoles, anticolonialisme des deux Grands, ONU et solidarité des non-alignés." },
          { label: "Élites et société", detail: "École, bourgeoisies locales, urbanisation, presse et anciens combattants diffusent les idées de liberté." },
          { label: "Contraintes coloniales", detail: "Travaux forcés, impôts, discriminations, expropriations et aliénation culturelle nourrissent la contestation." },
        ],
        observation: "Un facteur exogène vient de l’extérieur de la colonie ; un facteur endogène naît de sa propre société.",
        check: { prompt: "Quel facteur est endogène ?", options: ["L’émergence des élites africaines", "La doctrine Truman", "La création de l’OTAN", "Le plan Marshall"], correctIndex: 0, explanation: "Les élites formées dans les colonies constituent un facteur interne." },
        distractors: ["La Seconde Guerre mondiale renforce définitivement toutes les métropoles.", "L’ONU défend explicitement les travaux forcés.", "Les contraintes coloniales diminuent toujours la contestation."],
      },
      {
        id: "movements",
        title: "Les formes des mouvements nationalistes",
        summary: "Comparer organisations politiques, syndicats, mouvements religieux et culturels.",
        conceptTitle: "Des luttes diverses au service de l’émancipation",
        explanation: "Partis et syndicats utilisent meetings, grèves, marches, boycotts, élections et négociations. Les mouvements religieux annoncent la délivrance, tandis que la Négritude, la presse et les associations étudiantes réhabilitent l’identité noire.",
        keyPoint: "Les mouvements nationalistes africains sont pluriels : politiques, syndicaux, religieux et culturels.",
        example: "Le PDCI-RDA, le CPP, le FLN, le SAA, le kimbanguisme et la Négritude illustrent cette diversité.",
        timelineTitle: "Les moyens de la mobilisation",
        timelineInstruction: "Parcours les principales formes d’organisation et d’action.",
        timeline: [
          { label: "Politique et syndical", shortLabel: "Politique", detail: "Partis, syndicats, élections, grèves, marches, boycotts, désobéissance civile et négociations." },
          { label: "Religieux", detail: "Harrisme et kimbanguisme portent des messages de dignité, délivrance et affirmation noire." },
          { label: "Culturel", detail: "Négritude, presse africaine et mouvements étudiants valorisent l’histoire, la culture et l’identité." },
        ],
        observation: "La lutte ne se réduit pas à la violence : elle utilise aussi culture, droit, négociation, vote et action collective.",
        check: { prompt: "Quel courant culturel valorise l’identité noire ?", options: ["La Négritude", "Le containment", "Le mercantilisme", "La perestroïka"], correctIndex: 0, explanation: "La Négritude est portée notamment par Césaire, Senghor et Damas." },
        distractors: ["Tous les nationalismes africains utilisent une méthode unique.", "Les syndicats refusent toute forme de grève.", "Les mouvements culturels ne participent pas à la prise de conscience."],
      },
      {
        id: "consequences",
        title: "Les acquis sociaux et politiques",
        summary: "Relier réformes coloniales, libertés nouvelles, autonomie et indépendances.",
        conceptTitle: "Des réformes qui ouvrent la voie à la souveraineté",
        explanation: "Les mobilisations obtiennent suppression du travail forcé et du code de l’indigénat, libertés d’association et de réunion, représentation politique, suffrage élargi et autonomie. Ces acquis accélèrent finalement l’accession à l’indépendance.",
        keyPoint: "Le principal résultat des nationalismes est d’avoir rendu irréversible le processus de décolonisation.",
        example: "La loi Houphouët-Boigny abolit le travail forcé le 5 avril 1946 ; la Loi-Cadre de 1956 élargit le suffrage et l’autonomie.",
        timelineTitle: "Des réformes à l’indépendance",
        timelineInstruction: "Suis quelques acquis majeurs obtenus sous la pression des mouvements.",
        timeline: [
          { label: "Avril 1946", detail: "Abolition du travail forcé, liberté de réunion et liberté d’association dans les colonies françaises." },
          { label: "23 juin 1956", shortLabel: "Loi-Cadre", detail: "Généralisation du suffrage et autonomie financière accrue des territoires." },
          { label: "1958-1960", detail: "Communauté franco-africaine puis vague des indépendances africaines." },
        ],
        observation: "Les indépendances résultent d’un processus cumulatif de mobilisations et de réformes, pas d’un événement isolé.",
        check: { prompt: "Quelle loi abolit le travail forcé dans les colonies françaises en 1946 ?", options: ["La loi Houphouët-Boigny", "La loi Marshall", "La loi de Yalta", "La loi Jdanov"], correctIndex: 0, explanation: "La loi Houphouët-Boigny du 5 avril 1946 supprime le travail forcé." },
        distractors: ["Les mouvements nationalistes renforcent durablement le système colonial.", "La Loi-Cadre supprime le suffrage dans les colonies.", "Aucune réforme sociale n’est obtenue avant les indépendances."],
      },
    ],
  },
  {
    id: "terminale-hg-h5-cote-ivoire-independence",
    strand: "Histoire",
    chapterNumber: 5,
    themeNumber: 2,
    themeTitle: "De la décolonisation aux efforts d’organisation de l’Afrique",
    title: "L’accession de la Côte d’Ivoire à l’indépendance",
    description: "Suivre les phases de l’espoir, de la lutte puis de la collaboration entre 1944 et 1960.",
    sections: [
      {
        id: "hope-phase",
        title: "La phase de l’espoir (1944-1947)",
        summary: "Relier Brazzaville, SAA, PDCI-RDA et premières réformes politiques.",
        conceptTitle: "Les réformes ouvrent un espace politique africain",
        explanation: "La Conférence de Brazzaville recommande d’assouplir l’administration coloniale. En Côte d’Ivoire, le SAA puis le PDCI structurent les revendications, tandis que Félix Houphouët-Boigny entre dans la représentation politique française.",
        keyPoint: "Entre 1944 et 1947, réformes et organisations africaines font naître l’espoir d’une émancipation progressive.",
        example: "Le SAA est créé le 8 août 1944 ; le PDCI en avril 1946 et le RDA en octobre 1946.",
        timelineTitle: "Les débuts de l’organisation politique",
        timelineInstruction: "Parcours les repères qui structurent la phase de l’espoir.",
        timeline: [
          { label: "30 janvier-8 février 1944", shortLabel: "Brazzaville", detail: "La conférence recommande plusieurs réformes sociales et politiques, sans inviter d’élites africaines." },
          { label: "8 août 1944", shortLabel: "SAA", detail: "Création du Syndicat agricole africain sous la présidence de Félix Houphouët-Boigny." },
          { label: "1946", detail: "Naissance du PDCI, du RDA et adoption de réformes importantes contre le système colonial." },
        ],
        observation: "Les réformes coloniales restent limitées, mais elles donnent aux organisations africaines de nouveaux moyens d’action.",
        check: { prompt: "Quelle organisation est créée le 8 août 1944 ?", options: ["Le Syndicat agricole africain", "L’ONU", "La CEDEAO", "Le FLN"], correctIndex: 0, explanation: "Le SAA défend notamment les planteurs africains." },
        distractors: ["La phase de l’espoir commence après 1960.", "Brazzaville proclame immédiatement l’indépendance de toutes les colonies.", "Le PDCI est créé avant le SAA."],
      },
      {
        id: "struggle-phase",
        title: "La phase de la lutte (1947-1950)",
        summary: "Expliquer apparentement communiste, répression coloniale et changement de stratégie du PDCI.",
        conceptTitle: "La confrontation entre le PDCI-RDA et l’administration",
        explanation: "L’apparentement du RDA au Parti communiste français inquiète les autorités. Meetings, boycotts et marches sont réprimés sous Laurent Péchoux ; arrestations, incidents et morts poussent le PDCI dans la clandestinité puis vers une nouvelle stratégie.",
        keyPoint: "La répression de 1947-1950 transforme la lutte et conduit le PDCI à abandonner l’apparentement communiste.",
        example: "Après les arrestations de février 1949, les femmes marchent sur la prison de Grand-Bassam pour réclamer la libération des militants.",
        timelineTitle: "L’escalade de la confrontation",
        timelineInstruction: "Suis les étapes qui mènent de l’apparentement à la répression.",
        timeline: [
          { label: "1947", detail: "Le RDA confirme son apparentement au groupe parlementaire communiste." },
          { label: "6 février 1949", shortLabel: "1949", detail: "Arrestations de dirigeants après les incidents de Treichville et mobilisation des femmes." },
          { label: "Janvier 1950", shortLabel: "1950", detail: "Nouveaux affrontements, lourd bilan humain et interdiction des réunions du PDCI." },
        ],
        observation: "La répression peut radicaliser un mouvement, mais elle peut aussi provoquer un changement tactique.",
        check: { prompt: "Quel gouverneur est associé à la forte répression du PDCI-RDA ?", options: ["Laurent Péchoux", "André Latrille", "Pierre Mendès France", "Dag Hammarskjöld"], correctIndex: 0, explanation: "Laurent Péchoux remplace André Latrille et réprime le militantisme du PDCI-RDA." },
        distractors: ["Le PDCI cesse toute activité politique dès 1944.", "L’apparentement unit le RDA au parti gaulliste.", "La phase de lutte ne connaît aucune arrestation."],
      },
      {
        id: "collaboration-independence",
        title: "De la collaboration à l’indépendance (1950-1960)",
        summary: "Situer désapparentement, Loi-Cadre, Communauté et indépendance du 7 août 1960.",
        conceptTitle: "La stratégie parlementaire accélère l’autonomie",
        explanation: "En 1950, Houphouët-Boigny rompt avec le PCF et ouvre une phase de collaboration. La Loi-Cadre de 1956 accroît l’autonomie, la Communauté franco-africaine de 1958 prépare de nouvelles relations, puis la Côte d’Ivoire devient indépendante.",
        keyPoint: "La Côte d’Ivoire accède à l’indépendance par une évolution surtout politique et négociée après la rupture de 1950.",
        example: "La Loi-Cadre instaure le suffrage universel, le collège unique et un Conseil de gouvernement dans les territoires.",
        timelineTitle: "La marche vers l’indépendance",
        timelineInstruction: "Parcours les trois repères qui conduisent de la collaboration à la souveraineté.",
        timeline: [
          { label: "7 octobre 1950", shortLabel: "Désapparentement", detail: "Houphouët-Boigny rompt avec le PCF et engage le PDCI dans une stratégie de collaboration." },
          { label: "23 juin 1956", shortLabel: "Loi-Cadre", detail: "Autonomie politique et administrative accrue, suffrage universel et collège unique." },
          { label: "7 août 1960", shortLabel: "Indépendance", detail: "La Côte d’Ivoire devient un État souverain." },
        ],
        observation: "L’indépendance ivoirienne résulte d’une succession de rapports de force, de réformes et de négociations.",
        check: { prompt: "Quelle réforme de 1956 accroît l’autonomie des colonies ?", options: ["La Loi-Cadre", "Le plan Marshall", "Le Pacte de Varsovie", "La Charte de l’Atlantique"], correctIndex: 0, explanation: "La Loi-Cadre Defferre constitue une étape majeure vers l’autonomie." },
        distractors: ["La Côte d’Ivoire devient indépendante en 1944.", "Le désapparentement renforce l’alliance avec le PCF.", "La Communauté franco-africaine précède la Conférence de Brazzaville."],
      },
    ],
  },
  {
    id: "terminale-hg-h6-algeria-independence",
    strand: "Histoire",
    chapterNumber: 6,
    themeNumber: 2,
    themeTitle: "De la décolonisation aux efforts d’organisation de l’Afrique",
    title: "L’accession de l’Algérie à l’indépendance",
    description: "Comprendre le statut colonial, la guerre de libération et les accords d’Évian.",
    sections: [
      {
        id: "french-algeria",
        title: "L’Algérie française de 1830 à 1954",
        summary: "Relier colonie de peuplement, inégalités et affirmation des nationalismes algériens.",
        conceptTitle: "Une colonie de peuplement profondément inégalitaire",
        explanation: "Conquise en 1830 et divisée en départements, l’Algérie est considérée comme partie intégrante de la France. La minorité européenne domine administration, villes et meilleures terres, tandis que la majorité musulmane subit précarité et faibles droits politiques.",
        keyPoint: "Les inégalités politiques, économiques et sociales alimentent la formation puis la radicalisation du nationalisme algérien.",
        example: "Ben Badis porte une tendance traditionnelle, Messali Hadj une tendance révolutionnaire et Ferhat Abbas une tendance d’abord réformiste.",
        timelineTitle: "De la conquête à la radicalisation",
        timelineInstruction: "Suis les repères qui transforment la contestation politique en projet d’insurrection.",
        timeline: [
          { label: "1830-1848", detail: "Conquête française puis départementalisation d’Alger, Oran et Constantine." },
          { label: "8 mai 1945", shortLabel: "Sétif", detail: "Les massacres de Sétif et la répression accélèrent la radicalisation nationaliste." },
          { label: "Mars 1954", shortLabel: "CRUA", detail: "Création du Comité révolutionnaire d’unité et d’action, favorable à la lutte armée." },
        ],
        observation: "La colonie de peuplement se distingue par l’installation durable d’une forte population européenne privilégiée.",
        check: { prompt: "Pourquoi l’Algérie est-elle qualifiée de colonie de peuplement ?", options: ["Une importante population européenne s’y installe durablement", "Elle n’est jamais occupée", "Elle ne possède aucune administration française", "Tous ses habitants ont immédiatement les mêmes droits"], correctIndex: 0, explanation: "Environ un million d’Européens y vivent et disposent de nombreux privilèges." },
        distractors: ["La société coloniale algérienne garantit une égalité complète entre Européens et musulmans.", "Le nationalisme algérien ne comporte qu’une seule tendance.", "L’Algérie cesse d’être française en 1848."],
      },
      {
        id: "insurrection",
        title: "De l’insurrection à la guerre",
        summary: "Caractériser le FLN, la Toussaint rouge, la répression et l’internationalisation du conflit.",
        conceptTitle: "Une guerre de libération armée",
        explanation: "Le CRUA devient le FLN et crée l’ALN. Dans la nuit du 31 octobre au 1er novembre 1954, une série d’attentats déclenche l’insurrection. La France répond par un engagement militaire massif, tandis que le conflit s’étend et se durcit.",
        keyPoint: "La guerre d’Algérie oppose le FLN-ALN à la puissance coloniale française et internationalise progressivement la question algérienne.",
        example: "Le FLN organise maquis et actions urbaines ; la France emploie quadrillage, regroupements de population et torture.",
        timelineTitle: "L’escalade de la guerre",
        timelineInstruction: "Parcours trois moments qui transforment l’insurrection en crise majeure.",
        timeline: [
          { label: "1er novembre 1954", shortLabel: "Toussaint rouge", detail: "Début coordonné de l’insurrection du FLN contre des cibles militaires et administratives." },
          { label: "1956", detail: "Intensification de la lutte armée et du terrorisme urbain ; répression française accrue." },
          { label: "13 mai 1958", shortLabel: "Crise de 1958", detail: "Émeutes à Alger et retour de De Gaulle au pouvoir pour résoudre la crise." },
        ],
        observation: "La violence, l’impasse politique et la pression internationale rendent progressivement le maintien de l’Algérie française impossible.",
        check: { prompt: "Quel mouvement dirige principalement la lutte armée pour l’indépendance ?", options: ["Le FLN", "La CEDEAO", "L’OTAN", "Le PDCI"], correctIndex: 0, explanation: "Le Front de libération nationale organise la lutte avec sa branche militaire, l’ALN." },
        distractors: ["La Toussaint rouge a lieu en 1945.", "La France ne déploie aucun renfort en Algérie.", "Le conflit reste totalement ignoré par l’ONU et les non-alignés."],
      },
      {
        id: "evian-independence",
        title: "De Gaulle, Évian et l’indépendance",
        summary: "Expliquer le changement de politique française et le processus d’autodétermination.",
        conceptTitle: "La négociation met fin à la guerre",
        explanation: "De Gaulle comprend progressivement que l’indépendance est inéluctable. Malgré l’opposition de l’OAS, les négociations avec le FLN aboutissent aux accords d’Évian, au cessez-le-feu et au référendum d’autodétermination.",
        keyPoint: "Les accords d’Évian et le référendum de 1962 consacrent l’indépendance de l’Algérie après près de huit années de guerre.",
        example: "Le référendum du 1er juillet 1962 donne une très large majorité au oui à l’indépendance.",
        timelineTitle: "Vers la souveraineté algérienne",
        timelineInstruction: "Suis les étapes politiques qui mettent fin au conflit.",
        timeline: [
          { label: "1958-1961", detail: "De Gaulle propose autodétermination et solutions politiques tandis que FLN et OAS poursuivent la confrontation." },
          { label: "18 mars 1962", shortLabel: "Évian", detail: "Signature des accords d’Évian entre la France et les représentants algériens." },
          { label: "1er-5 juillet 1962", shortLabel: "Indépendance", detail: "Référendum d’autodétermination puis proclamation de l’indépendance algérienne." },
        ],
        observation: "La négociation n’efface pas les violences, mais elle crée le cadre juridique de la fin de la guerre.",
        check: { prompt: "Quels accords ouvrent directement la voie à l’indépendance algérienne ?", options: ["Les accords d’Évian", "Les accords de Yalta", "Les conventions de Lomé", "Les accords de Dayton"], correctIndex: 0, explanation: "Les accords d’Évian de mars 1962 organisent cessez-le-feu et autodétermination." },
        distractors: ["L’OAS soutient l’indépendance négociée par le FLN.", "Le référendum d’autodétermination rejette massivement l’indépendance.", "La guerre se termine sans aucune négociation."],
      },
    ],
  },
  {
    id: "terminale-hg-h7-african-union",
    strand: "Histoire",
    chapterNumber: 7,
    themeNumber: 2,
    themeTitle: "De la décolonisation aux efforts d’organisation de l’Afrique",
    title: "L’Union Africaine (UA)",
    description: "Comprendre le passage de l’OUA à l’UA, ses institutions et le bilan de ses actions.",
    sections: [
      {
        id: "birth-objectives",
        title: "Naissance, objectifs et principes",
        summary: "Expliquer le remplacement de l’OUA et les ambitions d’intégration de l’UA.",
        conceptTitle: "Une organisation rénovée pour une Afrique plus intégrée",
        explanation: "Créée en 1963, l’OUA ne parvient pas à résoudre plusieurs crises ni la marginalisation du continent. Les États la remplacent par l’UA, officiellement créée en 2002, avec des objectifs plus larges de paix, démocratie, développement et intégration.",
        keyPoint: "L’UA remplace l’OUA pour disposer d’institutions et de moyens mieux adaptés aux défis contemporains de l’Afrique.",
        example: "Contrairement au principe strict de non-ingérence, l’UA reconnaît un droit d’intervention en cas de génocide, de guerre ou de crise grave.",
        timelineTitle: "Les sommets fondateurs de l’UA",
        timelineInstruction: "Parcours les étapes qui transforment le projet en organisation officielle.",
        timeline: [
          { label: "Septembre 1999", shortLabel: "Syrte", detail: "Le sommet extraordinaire de Syrte décide la création d’une Union africaine." },
          { label: "Juillet 2000-2001", shortLabel: "Lomé-Lusaka", detail: "Adoption de l’acte constitutif puis du programme de mise en place." },
          { label: "9 juillet 2002", shortLabel: "Durban", detail: "Création officielle de l’Union africaine, qui conserve son siège à Addis-Abeba." },
        ],
        observation: "Le passage de l’OUA à l’UA marque une volonté de dépasser la seule défense de la souveraineté pour agir davantage sur les crises.",
        check: { prompt: "En quelle année l’Union africaine est-elle officiellement créée ?", options: ["2002", "1963", "1975", "1945"], correctIndex: 0, explanation: "Le sommet de Durban officialise l’UA le 9 juillet 2002." },
        distractors: ["L’UA remplace l’ONU.", "L’UA rejette tout objectif de développement.", "L’OUA est créée après l’UA."],
      },
      {
        id: "institutions",
        title: "Structures et fonctionnement",
        summary: "Distinguer organes de direction, de paix, de représentation, de justice et de financement.",
        conceptTitle: "Une architecture institutionnelle diversifiée",
        explanation: "La Conférence de l’Union est l’organe suprême. Le Conseil exécutif, la Commission, le Comité des représentants permanents et le Parlement panafricain assurent direction et administration. Le CPS, les juridictions et les institutions financières complètent l’ensemble.",
        keyPoint: "L’UA répartit ses fonctions entre décision politique, administration, représentation, sécurité, justice et financement.",
        example: "Le Conseil de paix et de sécurité, composé de quinze membres, est l’organe permanent de prévention et de gestion des conflits.",
        timelineTitle: "Du sommet à l’action spécialisée",
        timelineInstruction: "Explore les principales familles d’organes de l’Union africaine.",
        timeline: [
          { label: "Direction", detail: "Conférence, Conseil exécutif, Commission et Comité des représentants permanents." },
          { label: "Paix et représentation", shortLabel: "Paix", detail: "Conseil de paix et de sécurité, Parlement panafricain et comités techniques." },
          { label: "Justice et finance", shortLabel: "Appui", detail: "Cour africaine, commissions juridiques, Banque centrale, Fonds monétaire et Banque d’investissement." },
        ],
        observation: "La présence d’un organe ne garantit pas son efficacité : il faut aussi des ressources, une autorité et l’application des décisions.",
        check: { prompt: "Quel organe de l’UA est chargé de la prévention et du règlement des conflits ?", options: ["Le Conseil de paix et de sécurité", "Le STABEX", "La Cour de La Haye", "Le CAEM"], correctIndex: 0, explanation: "Le CPS est l’organe décisionnel permanent pour la paix et la sécurité." },
        distractors: ["L’UA ne possède aucun parlement.", "La Commission est une alliance militaire.", "Les institutions financières dirigent seules la Conférence de l’Union."],
      },
      {
        id: "assessment",
        title: "Le bilan des actions de l’UA",
        summary: "Comparer interventions, projets de développement et obstacles politiques ou financiers.",
        conceptTitle: "Des succès, mais une dépendance persistante",
        explanation: "L’UA intervient dans des crises, condamne les changements anticonstitutionnels, déploie des missions et soutient des projets. Elle reste limitée par instabilité, terrorisme, faiblesse démocratique, manque de moyens autonomes, retards de cotisation et dépendance financière extérieure.",
        keyPoint: "Le bilan de l’UA est mitigé : son champ d’action s’élargit, mais ses moyens et l’engagement des États restent insuffisants.",
        example: "Des missions sont déployées au Darfour et en Somalie, mais une grande part du financement de l’organisation provient de partenaires extérieurs.",
        timelineTitle: "Mettre en balance résultats et limites",
        timelineInstruction: "Compare les actions de paix, les projets de développement et les obstacles.",
        timeline: [
          { label: "Paix et démocratie", detail: "Médiations, missions, condamnation des coups d’État et soutien au retour à l’ordre constitutionnel." },
          { label: "Développement", detail: "NEPAD, aide humanitaire, projets d’infrastructures et coordination continentale." },
          { label: "Limites", detail: "Conflits persistants, terrorisme, cotisations impayées, dépendance extérieure et décisions peu appliquées." },
        ],
        observation: "Pour juger l’UA, il faut comparer l’ambition continentale aux ressources réellement disponibles.",
        check: { prompt: "Quelle faiblesse réduit l’autonomie de l’UA ?", options: ["Sa forte dépendance aux financements extérieurs", "L’absence totale d’États membres", "L’interdiction de toute réunion", "La disparition de tous les conflits africains"], correctIndex: 0, explanation: "Le financement extérieur important limite l’autonomie de l’organisation." },
        distractors: ["L’UA dispose de moyens illimités.", "Elle ne condamne jamais les changements anticonstitutionnels.", "Son bilan ne comporte aucune réalisation."],
      },
    ],
  },
  {
    id: "terminale-hg-h8-western-values",
    strand: "Histoire",
    chapterNumber: 8,
    themeNumber: 3,
    themeTitle: "Croyances et valeurs dans le monde d’aujourd’hui",
    title: "Croyances et valeurs dominantes dans le monde occidental",
    description: "Identifier les héritages historiques et les grands traits politiques, économiques et socioculturels occidentaux.",
    sections: [
      {
        id: "historical-foundations",
        title: "Les fondements historiques",
        summary: "Relier héritages grec, romain, judéo-chrétien et révolutions modernes.",
        conceptTitle: "Une civilisation faite d’héritages successifs",
        explanation: "La démocratie grecque, le droit romain, le christianisme et les langues gréco-latines structurent un héritage ancien. Les révolutions anglaise, américaine et française renforcent ensuite parlementarisme, souveraineté populaire, libertés et droits humains.",
        keyPoint: "Les valeurs occidentales contemporaines résultent d’un long héritage antique, religieux et révolutionnaire.",
        example: "La Déclaration des droits de l’homme et du citoyen de 1789 diffuse des principes de liberté et d’égalité politique.",
        timelineTitle: "Les couches de l’héritage occidental",
        timelineInstruction: "Parcours les apports antiques, religieux puis modernes.",
        timeline: [
          { label: "Grèce et Rome", detail: "Démocratie, philosophie politique, droit civil, État souverain et langues latines." },
          { label: "Héritage judéo-chrétien", shortLabel: "Christianisme", detail: "Monothéisme, morale chrétienne et influence durable des Églises." },
          { label: "XVIIe-XIXe siècles", shortLabel: "Révolutions", detail: "Parlementarisme anglais, indépendance américaine et Révolution française." },
        ],
        observation: "Une valeur actuelle peut avoir plusieurs sources historiques qui se sont combinées au fil du temps.",
        check: { prompt: "Quel héritage antique est associé à Athènes ?", options: ["La démocratie", "Le STABEX", "Le communisme soviétique", "La CEDEAO"], correctIndex: 0, explanation: "Athènes est présentée comme un foyer majeur de la démocratie antique." },
        distractors: ["Le droit européen ne doit rien à Rome.", "Le christianisme apparaît au XXe siècle.", "Les révolutions américaine et française rejettent toute idée de liberté."],
      },
      {
        id: "politics-economy",
        title: "Les valeurs politiques et économiques",
        summary: "Caractériser démocratie libérale, pluralisme, propriété privée et économie de marché.",
        conceptTitle: "Libertés politiques et capitalisme libéral",
        explanation: "Le modèle politique valorise libertés individuelles, élections, pluralisme, séparation des pouvoirs et État de droit. Le modèle économique repose sur propriété privée, initiative individuelle, concurrence, profit et loi de l’offre et de la demande.",
        keyPoint: "Le monde occidental associe généralement démocratie libérale et économie capitaliste, malgré des limites et des inégalités.",
        example: "Les régimes peuvent être présidentiels, parlementaires ou des monarchies parlementaires tout en partageant des principes démocratiques.",
        timelineTitle: "Les piliers du modèle libéral",
        timelineInstruction: "Explore les institutions politiques, les règles économiques et leurs limites.",
        timeline: [
          { label: "Démocratie", detail: "Élections, pluralisme des partis, libertés publiques, Constitution et séparation des pouvoirs." },
          { label: "Capitalisme", detail: "Propriété privée, libre entreprise, concurrence, profit et marché." },
          { label: "Limites", detail: "Inégalités, exclusions, lobbying, dérives de certaines libertés et montée d’idéologies extrémistes." },
        ],
        observation: "Présenter un modèle ne signifie pas ignorer l’écart entre ses principes et son fonctionnement réel.",
        check: { prompt: "Quel principe caractérise l’économie capitaliste libérale ?", options: ["La propriété privée des moyens de production", "La suppression de toute monnaie", "L’interdiction de la concurrence", "La collectivisation obligatoire"], correctIndex: 0, explanation: "Propriété privée et libre entreprise sont des principes centraux du capitalisme libéral." },
        distractors: ["La démocratie libérale concentre tous les pouvoirs sans contrôle.", "Le pluralisme interdit plusieurs partis politiques.", "L’économie de marché ignore l’offre et la demande."],
      },
      {
        id: "social-cultural",
        title: "Les traits socioculturels et leur diffusion",
        summary: "Analyser urbanisation, consommation, loisirs, arts, christianisme et diffusion médiatique.",
        conceptTitle: "Une société urbaine, mobile et médiatisée",
        explanation: "La croissance d’après-guerre accentue urbanisation, consommation de masse, éducation, loisirs et sport. Arts, musique et cinéma occupent une place majeure ; le christianisme reste influent, tandis que médias et internet diffusent les modes de vie occidentaux.",
        keyPoint: "Les valeurs occidentales se diffusent mondialement par la puissance économique, culturelle, éducative et médiatique.",
        example: "Cinéma, publicité, télévision et internet font circuler vêtements, loisirs, pratiques de consommation et conceptions de la liberté.",
        timelineTitle: "Les vecteurs de diffusion",
        timelineInstruction: "Compare société de consommation, productions culturelles et médias.",
        timeline: [
          { label: "Vie sociale", detail: "Urbanisation, individualisme, émancipation, consommation de masse, sport et loisirs." },
          { label: "Arts et culture", detail: "Cinéma, musique, littérature et création artistique renouvellent les représentations." },
          { label: "Médias et réseaux", shortLabel: "Diffusion", detail: "Radio, télévision, publicité, internet et échanges mondiaux diffusent les valeurs et modes de vie." },
        ],
        observation: "La diffusion culturelle produit des emprunts, mais aussi des résistances, adaptations et métissages.",
        check: { prompt: "Quel ensemble diffuse fortement les modes de vie occidentaux ?", options: ["Les médias et les réseaux numériques", "Uniquement les frontières fermées", "La disparition de l’éducation", "L’interdiction du cinéma"], correctIndex: 0, explanation: "Médias classiques et numériques diffusent largement croyances, valeurs et pratiques." },
        distractors: ["Les sociétés occidentales restent entièrement rurales.", "Le christianisme n’a aucune influence historique en Occident.", "La diffusion culturelle entraîne partout une copie identique sans adaptation."],
      },
    ],
  },
  {
    id: "terminale-hg-h9-negro-african-civilization-mutations",
    strand: "Histoire",
    chapterNumber: 9,
    themeNumber: 3,
    themeTitle: "Croyances et valeurs dans le monde d’aujourd’hui",
    title: "Les mutations contemporaines de la civilisation négro-africaine",
    description: "Caractériser les sociétés précoloniales puis analyser leurs transformations politiques, économiques et sociales.",
    sections: [
      {
        id: "politics-economy-before-colonization",
        title: "Structures politiques et économie précoloniales",
        summary: "Comparer sociétés étatiques, chefferies et économie de subsistance.",
        conceptTitle: "Des organisations politiques et économiques variées",
        explanation: "Royaumes et empires possèdent un pouvoir centralisé, tandis que des sociétés sans État s’organisent autour de chefferies, conseils de notables, lignages et classes d’âge. L’économie vise surtout la subsistance par agriculture, élevage, artisanat et commerce.",
        keyPoint: "L’Afrique précoloniale connaît des formes politiques diverses et une économie principalement communautaire et de subsistance.",
        example: "Les empires du Mali et du Ghana illustrent les sociétés étatiques ; les peuples krou illustrent des chefferies et sociétés sans État centralisé.",
        timelineTitle: "Comparer les formes d’organisation",
        timelineInstruction: "Explore le pouvoir centralisé, les chefferies puis les activités économiques.",
        timeline: [
          { label: "Royaumes et empires", shortLabel: "États", detail: "Pouvoir du roi ou de l’empereur, conseils politiques, armée, religion et administration." },
          { label: "Chefferies", detail: "Chef assisté de notables, lignages, villages, classes d’âge et décisions communautaires." },
          { label: "Économie", detail: "Agriculture sur brûlis, élevage, pêche, artisanat, troc et commerce de produits de valeur." },
        ],
        observation: "L’absence d’État centralisé ne signifie pas l’absence d’organisation ou de règles politiques.",
        check: { prompt: "Quelle caractéristique domine l’économie précoloniale décrite dans le cours ?", options: ["La subsistance", "L’industrie automobile", "La finance numérique", "La production aéronautique"], correctIndex: 0, explanation: "La production vise d’abord à satisfaire les besoins de la communauté." },
        distractors: ["Toutes les sociétés africaines précoloniales possèdent un empire centralisé.", "L’artisanat est absent des économies précoloniales.", "Le commerce utilise uniquement des billets modernes."],
      },
      {
        id: "society-culture-beliefs",
        title: "Société, culture et croyances précoloniales",
        summary: "Comprendre solidarité communautaire, hiérarchies, oralité, arts et croyances.",
        conceptTitle: "Une vie communautaire fortement structurée",
        explanation: "La famille élargie et la communauté organisent éducation, mariage et solidarité. La société est hiérarchisée selon âge, sexe, statut ou métier. Oralité, musique, danse et arts transmettent les valeurs, tandis qu’un Dieu suprême, les ancêtres et les génies structurent les croyances.",
        keyPoint: "La civilisation négro-africaine précoloniale associe solidarité communautaire, hiérarchies sociales, traditions orales et croyances ancestrales.",
        example: "Le Poro chez les Sénoufo forme les jeunes à l’entrée dans le monde adulte ; griots, contes et proverbes transmettent l’histoire et les normes.",
        timelineTitle: "Les dimensions de la vie communautaire",
        timelineInstruction: "Passe de l’organisation sociale aux expressions culturelles puis aux croyances.",
        timeline: [
          { label: "Communauté", detail: "Famille élargie, lignage, mariage collectif, solidarité et éducation partagée des enfants." },
          { label: "Culture", detail: "Oralité, contes, proverbes, griots, musique, danse, masques, sculptures et initiations." },
          { label: "Croyances", detail: "Dieu suprême, ancêtres, génies de la nature, sacrifices et recherche de la force vitale." },
        ],
        observation: "Les arts et croyances ont des fonctions sociales, éducatives et religieuses, pas seulement esthétiques.",
        check: { prompt: "Qui transmet traditionnellement récits et mémoire dans plusieurs sociétés ouest-africaines ?", options: ["Les griots", "Les chaebols", "Les Casques bleus", "Les commissaires européens"], correctIndex: 0, explanation: "Les griots ou traditionnalistes jouent un rôle majeur de transmission orale." },
        distractors: ["L’éducation des enfants est uniquement individuelle.", "Les sociétés précoloniales ne produisent aucune littérature.", "Les croyances excluent toujours l’idée d’un Dieu suprême."],
      },
      {
        id: "contemporary-mutations",
        title: "Les mutations contemporaines",
        summary: "Relier école, monnaie, urbanisation, religions et colonisation aux transformations actuelles.",
        conceptTitle: "Des sociétés transformées par les contacts et la modernité",
        explanation: "École occidentale, économie monétaire, villes, christianisme, islam et colonisation modifient l’autorité des anciens, le travail, les frontières et les institutions. Apparaissent États modernes, salariat, propriété privée, nouvelles classes sociales et formes familiales renouvelées.",
        keyPoint: "La société négro-africaine contemporaine combine transformations extérieures, innovations modernes et permanences culturelles.",
        example: "La monétarisation et les cultures d’exportation intègrent l’Afrique à une économie de marché, tandis que les États adoptent des institutions inspirées des anciennes métropoles.",
        timelineTitle: "Des facteurs aux transformations",
        timelineInstruction: "Explore les facteurs de mutation, puis leurs effets politiques, économiques et sociaux.",
        timeline: [
          { label: "Facteurs", detail: "Colonisation, école, économie monétaire, urbanisation, communications, christianisme et islam." },
          { label: "Mutations politiques", shortLabel: "Politique", detail: "États et frontières modernes, administrations, élections et recul relatif des autorités traditionnelles." },
          { label: "Mutations économiques et sociales", shortLabel: "Société", detail: "Salariat, marché, cultures commerciales, classes professionnelles, mariage civil et mobilité sociale." },
        ],
        observation: "Mutation ne signifie pas disparition totale : les sociétés sélectionnent, adaptent et recomposent les apports extérieurs.",
        check: { prompt: "Quel facteur favorise directement la monétarisation de l’économie africaine ?", options: ["Les cultures d’exportation et le paiement des impôts", "La disparition de tous les échanges", "L’interdiction du travail salarié", "Le retour exclusif au troc"], correctIndex: 0, explanation: "Cultures commerciales et fiscalité coloniale diffusent l’usage de la monnaie." },
        distractors: ["Les mutations contemporaines effacent toute permanence culturelle.", "L’urbanisation réduit toujours les brassages de population.", "Les États modernes renforcent partout sans changement l’autorité traditionnelle."],
      },
    ],
  },
] satisfies HumanitiesCourseSeed[];

export const terminalHistoryPaths = historyCourses.map(createHumanitiesPath);
