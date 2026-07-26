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
        bodyMarkdown: String.raw`## Qu’est-ce qu’un mouvement nationaliste ?

Un **mouvement nationaliste** est la manifestation de la **prise de conscience des peuples colonisés** contre la domination des puissances impérialistes européennes. À la fin de la Seconde Guerre mondiale, ces mouvements naissent et se **radicalisent** progressivement, particulièrement en Afrique.

Leurs facteurs se répartissent en deux familles : **exogènes** (venus de l’extérieur de la colonie) et **endogènes** (nés de sa propre société).

## Les facteurs externes (exogènes)

| Facteur | Explication |
|---|---|
| **Anticolonialisme des États-Unis** | anciens colonisés hostiles au colonialisme ; l’impérialisme européen freine leur propre expansion |
| **Anticolonialisme de l’URSS** | le marxisme prône l’égalité des hommes et refuse l’asservissement d’un peuple par un autre |
| **Affaiblissement des métropoles** | l’Europe est en ruine après 1945 : les colonisés saisissent l’occasion |
| **La charte de l’ONU** | son article 1ᵉʳ proclame le droit des peuples à **disposer d’eux-mêmes** — une contradiction flagrante avec la colonisation |
| **Le mouvement des non-alignés** | depuis la **conférence de Bandung (avril 1955)**, les pays indépendants condamnent la politique coloniale |

## Les facteurs internes (endogènes)

| Facteur | Explication |
|---|---|
| **L’école et les élites** | instruites dans l’idéologie occidentale, les nouvelles élites cultivent justice, liberté et égalité, et revendiquent l’autonomie |
| **Les bourgeoisies locales** | les cultures d’exportation (café, cacao) créent une bourgeoisie agricole ; s’y ajoutent les bourgeoisies administrative et commerciale |
| **Les bouleversements sociaux** | croissance démographique, exode rural, urbanisation et chômage urbain radicalisent les sentiments |
| **Les contraintes coloniales** | travaux forcés, corvées, portage, impôts, recrutements militaires, discriminations, expropriations, aliénation culturelle |
| **L’impact des deux guerres** | les colonies ont fourni troupes et vivres ; les promesses de liberté non tenues, et le retour des anciens combattants, **démystifient l’homme blanc** |

> **La formule à retenir.** « Le système colonial portait en lui-même les germes de sa propre destruction. » En instruisant des élites et en imposant des injustices, la colonisation a **elle-même** créé les conditions de la contestation. C’est le cœur de plusieurs situations d’évaluation du cours.

> **Erreur fréquente.** Ne confonds pas exogène et endogène. L’**anticolonialisme américain**, l’**ONU** et la **Seconde Guerre mondiale** sont **externes** ; les **élites**, la **bourgeoisie agricole** et les **frustrations coloniales** sont **internes**. L’activité d’application 1 du cours porte exactement sur ce tri.

> **Astuce mémoire de Davy.** Pour les facteurs externes, retiens le sigle **A-A-O-B** : **A**mérique et URSS anticolonialistes, **A**ffaiblissement de l’Europe, **O**NU, **B**andung. Tout le reste — école, bourgeoisie, guerres, frustrations — vient de l’intérieur.`,
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
        extraQuestions: [
          { prompt: "Classe : « l’anticolonialisme américain » est un facteur…", options: ["Exogène", "Endogène", "Culturel", "Religieux"], correctIndex: 0, explanation: "Il vient de l’extérieur de la colonie : c’est un facteur externe.", sourceLabel: "Activité d’application 1", points: 1 },
          { prompt: "Classe : « la bourgeoisie agricole africaine » est un facteur…", options: ["Endogène", "Exogène", "International", "Religieux"], correctIndex: 0, explanation: "Née des cultures d’exportation locales, elle est interne à la colonie.", sourceLabel: "Activité d’application 1", points: 1 },
          { prompt: "Quelle conférence de 1955 marque la solidarité des non-alignés envers les peuples colonisés ?", options: ["La conférence de Bandung", "La conférence de Yalta", "La conférence de Berlin", "La conférence de Brazzaville"], correctIndex: 0, explanation: "Bandung (avril 1955) condamne régulièrement la politique coloniale.", sourceLabel: "Cours I-1-d", points: 2 },
          { prompt: "Quel article de la charte de l’ONU contredit la colonisation ?", options: ["L’article 1ᵉʳ, sur le droit des peuples à disposer d’eux-mêmes", "L’article 5 sur la défense collective", "L’article sur le droit de veto", "Aucun"], correctIndex: 0, explanation: "L’ONU devient une tribune d’expression de la souveraineté nationale.", sourceLabel: "Cours I-1-c", points: 2 },
          { prompt: "Pourquoi les anciens combattants radicalisent-ils le nationalisme après 1945 ?", options: ["L’homme blanc est démystifié à leurs yeux et les promesses de liberté ne sont pas tenues", "Ils reçoivent des terres", "Ils obtiennent la nationalité française", "Ils refusent toute contestation"], correctIndex: 0, explanation: "Le mythe de l’invincibilité du Blanc s’effondre.", sourceLabel: "Cours I-2-d", points: 2 },
          { prompt: "La montée des nationalismes en Afrique désigne la révolte des Africains contre l’occupation étrangère.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "C’est la prise de conscience des peuples colonisés contre la domination impérialiste.", sourceLabel: "Exercice 1, affirmation 1", points: 1 },
          { prompt: "La Seconde Guerre mondiale est le seul et véritable facteur de l’éveil nationaliste en Afrique.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle n’est qu’un facteur parmi d’autres, externes et internes.", sourceLabel: "Exercice 1, affirmation 4", points: 2 },
        ],
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
          { label: "Les mouvements politiques et syndicaux", shortLabel: "Les mouvements politiques et syndicaux", detail: "Partis, syndicats, élections, grèves, marches, boycotts, désobéissance civile et négociations." },
          { label: "Les mouvements religieux", shortLabel: "Les mouvements religieux", detail: "Harrisme et kimbanguisme portent des messages de dignité, délivrance et affirmation noire." },
          { label: "Les mouvements culturels", shortLabel: "les mouvements culturels", detail: "Négritude, presse africaine et mouvements étudiants valorisent l’histoire, la culture et l’identité." },
        ],
        observation: "La lutte ne se réduit pas à la violence : elle utilise aussi culture, droit, négociation, vote et action collective.",
        check: { prompt: "Quel courant culturel valorise l’identité noire ?", options: ["La Négritude", "Le containment", "Le mercantilisme", "La perestroïka"], correctIndex: 0, explanation: "La Négritude est portée notamment par Césaire, Senghor et Damas." },
        parts: [
          {
            bodyMarkdown: String.raw`## Les mouvements politiques et syndicaux

Les partis et les syndicats sont les organisations **les plus déterminantes** de l’éveil nationaliste.

### Les partis politiques

| Parti | Leader | Territoire |
|---|---|---|
| **CPP** (Convention People’s Party) | Kwame Nkrumah | Ghana (Côte-de-l’Or) |
| **PDCI-RDA** | Félix Houphouët-Boigny | Côte d’Ivoire |
| **FLN** (Front de libération nationale) | — | Algérie |

Leurs modes d’action : sensibilisation des populations (meetings, marches, **désobéissance civile**), collaboration avec les partis métropolitains (le RDA est apparenté au **PCF**), compétitions électorales et négociations de réformes.

### Les syndicats

| Syndicat | Leader |
|---|---|
| **SAA** (Syndicat agricole africain), 1944 | Félix Houphouët-Boigny |
| **UGTAN** (Union générale des travailleurs d’Afrique noire) | Sékou Touré |
| **FCA** (Fédération des cheminots africains) | — |

Leurs armes : **grèves, marches, boycotts** et soutiens financiers et politiques aux leaders africains.

> **Erreur fréquente.** Les mouvements nationalistes africains n’utilisent **pas principalement la violence**. Leurs méthodes dominantes sont la sensibilisation, la grève, le boycott, le vote et la négociation. La lutte armée (comme celle du FLN algérien) reste minoritaire à l’échelle du continent.

> **Astuce mémoire de Davy.** Associe chaque leader à son outil : **Houphouët-Boigny** au SAA (syndicat) **et** au PDCI (parti) ; **Nkrumah** au CPP ; **Sékou Touré** à l’UGTAN. Ces noms reviennent dans presque toutes les questions.`,
            extraQuestions: [
              { prompt: "Qui dirige le CPP au Ghana ?", options: ["Kwame Nkrumah", "Félix Houphouët-Boigny", "Sékou Touré", "Léopold Sédar Senghor"], correctIndex: 0, explanation: "La Convention People’s Party mène le Ghana vers l’indépendance.", sourceLabel: "Cours II-1", points: 1 },
              { prompt: "Quel syndicat Félix Houphouët-Boigny fonde-t-il en 1944 ?", options: ["Le Syndicat agricole africain (SAA)", "L’UGTAN", "La FCA", "Le FLN"], correctIndex: 0, explanation: "Le SAA est un instrument majeur de l’éveil nationaliste en Côte d’Ivoire.", sourceLabel: "Cours II-1", points: 2 },
              { prompt: "Quelles étaient les actions des élites politiques et syndicales ?", options: ["La sensibilisation par meetings, les grèves et les boycotts", "Les déportations de populations", "La recolonisation", "La répression armée des colons"], correctIndex: 0, explanation: "Elles mobilisent par des moyens politiques et syndicaux, non par la violence.", sourceLabel: "Exercice 3, question 4", points: 2 },
              { prompt: "La plupart des mouvements nationalistes africains utilisaient la violence.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Ils privilégient meetings, grèves, boycotts, élections et négociations.", sourceLabel: "Exercice 1, affirmation 6", points: 1 },
            ],
          },
          {
            bodyMarkdown: String.raw`## Les mouvements religieux

Les **mouvements messianiques noirs** sont étroitement associés à l’éveil nationaliste. Leurs prophètes annoncent la **fin des aliénations** subies par l’homme noir et sa victoire sur le colonisateur.

| Mouvement | Prophète | Lieu |
|---|---|---|
| **Le harrisme** | William Wade Harris | originaire du Libéria |
| **Le kimbanguisme** | Simon Kimbangu | Congo belge (actuelle RDC) |

## Les mouvements culturels

Ils réhabilitent l’**identité et l’histoire noires**.

- **La Négritude** : portée par **Léon Gontran Damas, Léopold Sédar Senghor et Aimé Césaire**, elle revendique une identité noire assumée et fière.
- **La presse africaine** : la revue **Présence Africaine** diffuse la pensée anticoloniale.
- **Les mouvements étudiants** : l’Union des étudiants de l’Afrique de l’Ouest, la **FEANF** (Fédération des étudiants d’Afrique noire francophone) mobilisent par meetings, conférences, expositions et productions littéraires.

## La synthèse à retenir

| Forme de lutte | Acteurs / moyens |
|---|---|
| **Politique** | CPP, PDCI-RDA, FLN — meetings, élections, négociations |
| **Syndicale** | SAA, UGTAN, FCA — grèves, boycotts |
| **Religieuse** | harrisme, kimbanguisme — messages de délivrance |
| **Culturelle** | Négritude, Présence Africaine, FEANF — valorisation de l’identité noire |

> **Le point clé.** Ce qui caractérise le nationalisme africain, c’est sa **grande diversité** : quatre registres de lutte se complètent. À l’examen, ne réduis jamais le mouvement à un seul plan — cite au moins deux ou trois formes différentes.

> **Astuce mémoire de Davy.** Retiens les **trois noms de la Négritude** — **Damas, Senghor, Césaire** — et associe-les à la revue **Présence Africaine**. Pour le religieux, deux prophètes suffisent : **Harris** (harrisme) et **Kimbangu** (kimbanguisme).`,
            extraQuestions: [
              { prompt: "Qui sont les principaux auteurs de la Négritude ?", options: ["Damas, Senghor et Césaire", "Nkrumah, Sékou Touré et Houphouët-Boigny", "Harris, Kimbangu et Dulles", "Clinton, Bush et Musitelli"], correctIndex: 0, explanation: "Léon Gontran Damas, Léopold Sédar Senghor et Aimé Césaire.", sourceLabel: "Cours II-3", points: 2 },
              { prompt: "Le kimbanguisme est fondé par quel prophète, et où ?", options: ["Simon Kimbangu, au Congo belge", "William Wade Harris, au Libéria", "Kwame Nkrumah, au Ghana", "Sékou Touré, en Guinée"], correctIndex: 0, explanation: "Le harrisme, lui, est fondé par William Wade Harris.", sourceLabel: "Cours II-2", points: 2 },
              { prompt: "Quelle revue illustre la naissance d’une presse africaine anticoloniale ?", options: ["Présence Africaine", "Le Monde diplomatique", "Afrique Magazine", "Jeune Afrique"], correctIndex: 0, explanation: "Présence Africaine est un catalyseur culturel de l’éveil nationaliste.", sourceLabel: "Cours II-3", points: 1 },
              { prompt: "Les mouvements nationalistes africains étaient caractérisés par leur grande diversité.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Politiques, syndicaux, religieux et culturels : quatre registres complémentaires.", sourceLabel: "Exercice 1, affirmation 3", points: 1 },
              { prompt: "Les actions des mouvements estudiantins ont porté sur :", options: ["La valorisation de la culture et de l’homme noir et la production littéraire", "Le verbiage sans effet", "La recolonisation", "La répression des populations"], correctIndex: 0, explanation: "Meetings, conférences, expositions et productions littéraires.", sourceLabel: "Exercice 3, question 2", points: 2 },
            ],
          },
        ],
        distractors: ["Tous les nationalismes africains utilisent une méthode unique.", "Les syndicats refusent toute forme de grève.", "Les mouvements culturels ne participent pas à la prise de conscience."],
      },
      {
        id: "consequences",
        title: "Les acquis sociaux et politiques",
        summary: "Relier réformes coloniales, libertés nouvelles, autonomie et indépendances.",
        conceptTitle: "Des réformes qui ouvrent la voie à la souveraineté",
        explanation: "Les mobilisations obtiennent suppression du travail forcé et du code de l’indigénat, libertés d’association et de réunion, représentation politique, suffrage élargi et autonomie. Ces acquis accélèrent finalement l’accession à l’indépendance.",
        bodyMarkdown: String.raw`## Les acquis sociaux

Les mouvements nationalistes amorcent un processus de décolonisation **irréversible**, en arrachant d’abord des réformes sociales — presque toutes concentrées en **1946** :

| Date | Réforme |
|---|---|
| **20 février 1946** | abolition du **code de l’indigénat** |
| **5 avril 1946** | **loi Houphouët-Boigny** : suppression des **travaux forcés** dans les colonies françaises |
| **11 avril 1946** | liberté de **réunion** |
| **16 avril 1946** | liberté d’**association** |

Ces réformes améliorent les conditions de vie, font baisser la mortalité et renforcent l’aspiration à la souveraineté.

## Les acquis politiques

Face à la pression, les métropoles engagent des réformes politiques successives :

| Date | Réforme |
|---|---|
| **13 octobre 1946** | nouvelle Constitution française : institue l’**Union française** et supprime l’expression « empire colonial » |
| **23 juin 1956** | **Loi-Cadre** (Defferre) : suffrage universel généralisé et autonomie financière des colonies |
| **28 septembre 1958** | **Communauté franco-africaine** adoptée par référendum en AOF et AEF — sauf en **Guinée**, qui vote « non » et accède aussitôt à l’indépendance |

## Le plus grand acquis

Dans leur synergie, tous ces mouvements ont rendu possible l’**accession progressive des colonies à l’indépendance** — certes difficile, mais désormais inéluctable. **1960** sera « l’année de toutes les indépendances » : **dix-sept pays** africains deviennent souverains.

> **Erreur fréquente.** Les mouvements nationalistes **ont bel et bien obtenu** des réformes des pays colonisateurs dès 1946 : dire qu’ils « n’ont rien obtenu » est faux. Et l’indépendance était revendiquée **avant** 1946, contrairement à ce que suggère une affirmation piège du cours.

> **Astuce mémoire de Davy.** Trois dates-clés pour les acquis politiques : **1946** (Union française), **1956** (Loi-Cadre, autonomie), **1958** (Communauté franco-africaine). Et une exception à ne jamais oublier : la **Guinée de Sékou Touré**, seule à dire « non » en 1958.`,
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
        extraQuestions: [
          { prompt: "Quel code, symbole de la discrimination coloniale, est aboli le 20 février 1946 ?", options: ["Le code de l’indigénat", "Le code Napoléon", "Le code du travail", "Le code civil"], correctIndex: 0, explanation: "Son abolition est un acquis social majeur des mouvements nationalistes.", sourceLabel: "Cours III-1", points: 2 },
          { prompt: "Que met en place la Loi-Cadre du 23 juin 1956 ?", options: ["Le suffrage généralisé et l’autonomie financière des colonies", "L’indépendance immédiate", "La suppression du suffrage", "Le rétablissement du travail forcé"], correctIndex: 0, explanation: "Elle prépare l’autonomie des territoires africains.", sourceLabel: "Cours III-2", points: 2 },
          { prompt: "Quelle colonie vote « non » au référendum de 1958 et accède aussitôt à l’indépendance ?", options: ["La Guinée", "La Côte d’Ivoire", "Le Sénégal", "Le Ghana"], correctIndex: 0, explanation: "Toutes les autres colonies d’AOF et d’AEF acceptent la Communauté franco-africaine.", sourceLabel: "Cours III-2", points: 2 },
          { prompt: "Combien de pays africains deviennent souverains en 1960, « année de toutes les indépendances » ?", options: ["Dix-sept", "Cinq", "Trente", "Deux"], correctIndex: 0, explanation: "Chiffre cité par la situation d’apprentissage (Afrique Magazine).", sourceLabel: "Situation d’apprentissage", points: 1 },
          { prompt: "Les premiers mouvements nationalistes africains n’ont rien obtenu des pays colonisateurs.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Ils obtiennent dès 1946 l’abolition du travail forcé et de nombreuses libertés.", sourceLabel: "Exercice 1, affirmation 7", points: 2 },
          { prompt: "Les mouvements nationalistes ont permis d’amorcer le processus devant aboutir aux indépendances.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "C’est leur principal résultat : rendre la décolonisation irréversible.", sourceLabel: "Exercice 3, question 1", points: 1 },
        ],
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
        bodyMarkdown: String.raw`## Le cadre général

Après la Seconde Guerre mondiale (1939-1945), la décolonisation devient en Afrique un phénomène **irréversible**. L’émancipation de la Côte d’Ivoire s’inscrit dans celle de l’**Afrique noire française**, mais elle est marquée sur le plan interne par la personnalité de **Félix Houphouët-Boigny (FHB)**. Le processus se déroule en **trois phases** : l’espoir (1944-1947), la lutte (1947-1950), la collaboration (1950-1960).

## La Conférence de Brazzaville (30 janvier – 8 février 1944)

**Le contexte.** La France est affaiblie ; les nationalismes montent en Afrique du Nord. Pour renforcer le Comité français de libération nationale (CFLN) et **préserver les colonies**, le général **de Gaulle** convoque la conférence. Elle réunit surtout des hauts fonctionnaires — **21 gouverneurs, 9 députés, 6 observateurs** — mais **aucune élite africaine n’y est invitée**.

**Les recommandations** visent à assouplir l’administration directe :

- suppression **progressive** du travail forcé et du code de l’indigénat ;
- possibilité pour les indigènes de créer des assemblées élues (associations, syndicats, partis) ;
- plus large représentation dans les assemblées françaises ;
- accès des indigènes à tous les emplois.

> **Correction importante.** Brazzaville **n’envisage pas** l’indépendance. Le document de Ki-Zerbo le dit clairement : « la constitution de self-government » n’est pas envisagée et « la notion d’Empire reste préférée ». Ne jamais écrire que Brazzaville promet l’indépendance.

## L’application en Côte d’Ivoire

Le gouverneur **André Latrille** (en poste depuis le 26 août 1943) applique honnêtement l’esprit de Brazzaville, ce qui lui vaudra d’être traité de « communiste » par l’administration. Il facilite :

| Date | Fait |
|---|---|
| **8 août 1944** | création du **Syndicat agricole africain (SAA)**, présidé par Houphouët-Boigny |
| **21 octobre 1945** | FHB élu **député** à l’Assemblée constituante française |
| **9 avril 1946** | création du **PDCI** |
| 1946 | amélioration des prix agricoles, suppression des intermédiaires |

> **Astuce mémoire de Davy.** Trois sigles à ne jamais confondre : **SAA** (syndicat, 1944), **PDCI** (parti ivoirien, 9 avril 1946), **RDA** (rassemblement panafricain, 18 octobre 1946 à Bamako). Le PDCI **s’affilie** au RDA — il n’est pas le RDA.`,
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
        extraQuestions: [
          { prompt: "Qui convoque la Conférence de Brazzaville et dans quel but ?", options: ["Le général de Gaulle, pour préserver les colonies françaises", "Sékou Touré, pour proclamer l’indépendance", "Houphouët-Boigny, pour créer le RDA", "L’ONU, pour décoloniser l’Afrique"], correctIndex: 0, explanation: "Il s’agit de renforcer le CFLN et de moderniser l’administration coloniale.", sourceLabel: "Cours I-1", points: 2 },
          { prompt: "Quelle élite africaine participe à la Conférence de Brazzaville ?", options: ["Aucune : seuls des fonctionnaires coloniaux y siègent", "Houphouët-Boigny et Senghor", "Tous les députés africains", "Les syndicats agricoles"], correctIndex: 0, explanation: "21 gouverneurs, 9 députés, 6 observateurs — mais aucune élite africaine.", sourceLabel: "Cours I-1", points: 2 },
          { prompt: "Relie : la création du PDCI a lieu le…", options: ["9 avril 1946", "8 août 1944", "18 octobre 1946", "11 avril 1946"], correctIndex: 0, explanation: "Le SAA date du 8 août 1944, le RDA du 18 octobre 1946.", sourceLabel: "Activité d’application 1", points: 1 },
          { prompt: "Quel gouverneur applique l’esprit de Brazzaville en Côte d’Ivoire ?", options: ["André Latrille", "Laurent Péchoux", "Pierre Pélieu", "René Pleven"], correctIndex: 0, explanation: "Jugé trop favorable aux Noirs, il sera plus tard remplacé par Péchoux.", sourceLabel: "Cours I-1", points: 1 },
          { prompt: "La Conférence de Brazzaville envisageait dès 1944 l’indépendance des colonies.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle refuse le self-government : « la notion d’Empire reste préférée » (Ki-Zerbo).", sourceLabel: "Document — Ki-Zerbo", points: 2 },
        ],
        distractors: ["La phase de l’espoir commence après 1960.", "Brazzaville proclame immédiatement l’indépendance de toutes les colonies.", "Le PDCI est créé avant le SAA."],
      },
      {
        id: "struggle-phase",
        title: "La phase de la lutte (1947-1950)",
        summary: "Expliquer apparentement communiste, répression coloniale et changement de stratégie du PDCI.",
        conceptTitle: "La confrontation entre le PDCI-RDA et l’administration",
        explanation: "L’apparentement du RDA au Parti communiste français inquiète les autorités. Meetings, boycotts et marches sont réprimés sous Laurent Péchoux ; arrestations, incidents et morts poussent le PDCI dans la clandestinité puis vers une nouvelle stratégie.",
        bodyMarkdown: String.raw`## L’apparentement au PCF

La Constitution de 1946, jugée trop **assimilationniste**, déçoit les attentes d’indépendance. Les leaders africains engagent alors la lutte. À l’Assemblée, Houphouët-Boigny fait créer le **Rassemblement démocratique africain (RDA)** au congrès de **Bamako, le 18 octobre 1946** ; il en devient le premier président, le siège est fixé à Abidjan, et le PDCI s’y affilie.

Pour renforcer son action, le RDA **s’apparente au Parti communiste français (PCF)**, qui lui apporte financement, formation et soutien au vote des lois. Mais en pleine **Guerre froide**, cet apparentement fait apparaître le RDA comme un **danger** aux yeux de la France : les députés du **MRP** et de la **SFIO** se déchaînent contre le PDCI.

## La répression de Laurent Péchoux

La résistance du PDCI prend des formes **pacifiques** : journaux, meetings, marches, et surtout **boycotts** (du travail chez les colons, de leurs magasins, de leurs réunions).

Comme les colons perdent leurs privilèges, l’administration passe à l’offensive. Profitant des incidents d’**Abengourou**, elle remplace Latrille par **Laurent Péchoux**, chargé de réprimer le PDCI-RDA « communiste ». Le pouvoir suscite des partis rivaux, tel le **BDE** d’Étienne Djaument (30 décembre 1948).

| Date | Événement |
|---|---|
| **6 février 1949** | incidents de **Treichville** : 30 arrestations dont 8 du comité directeur (Ekra, Mockey, Dadié…) |
| — | **marche des femmes** sur la prison de **Grand-Bassam** |
| **Janvier 1950** | affrontements de **Bouaflé, Séguéla, Dimbokro** |

**Bilan de 1950 : 52 morts et environ 3 000 blessés.** Le PDCI, interdit de réunion et poussé à la **clandestinité**, va changer de stratégie et passer à la collaboration.

> **Le point clé.** L’apparentement au PCF a d’abord donné des moyens au RDA, puis est devenu un **handicap** : après le départ des communistes du gouvernement français (1947), il expose le parti à la répression. C’est ce qui explique le futur désapparentement de 1950.

> **Astuce mémoire de Davy.** Oppose les **deux gouverneurs** : **Latrille** (favorable aux Africains, « l’ennemi n°1 » des colons) et **Péchoux** (le répresseur). Si une question parle de répression, la réponse est Péchoux.`,
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
        extraQuestions: [
          { prompt: "À quel parti français le RDA s’apparente-t-il, et pourquoi cela devient-il un problème ?", options: ["Au PCF ; en pleine Guerre froide, il est vu comme un danger pour la France", "À la SFIO ; elle refuse toute réforme", "Au MRP ; il est trop conservateur", "À l’UDSR ; elle est communiste"], correctIndex: 0, explanation: "Le communisme est combattu en Europe occidentale : l’apparentement inquiète.", sourceLabel: "Cours II-1", points: 2 },
          { prompt: "Quelles formes prend la résistance du PDCI ?", options: ["Journaux, meetings, marches et boycotts", "Uniquement la lutte armée", "La recolonisation", "Aucune action"], correctIndex: 0, explanation: "Une résistance essentiellement pacifique et organisée.", sourceLabel: "Cours II-2", points: 1 },
          { prompt: "Quel est le lourd bilan humain de la répression de janvier 1950 ?", options: ["52 morts et environ 3 000 blessés", "5 morts", "Aucune victime", "300 morts"], correctIndex: 0, explanation: "Le PDCI est ensuite interdit de réunion et poussé à la clandestinité.", sourceLabel: "Cours II-2", points: 2 },
          { prompt: "Complète (activité 2) : « L’exclusion des … du gouvernement français laissa les mains libres pour réprimer les mouvements. »", options: ["communistes", "gaullistes", "socialistes", "planteurs"], correctIndex: 0, explanation: "Le départ des communistes de 1947 fragilise le RDA apparenté.", sourceLabel: "Activité d’application 2", points: 2 },
          { prompt: "La marche des femmes de 1949 se dirige vers la prison de…", options: ["Grand-Bassam", "Treichville", "Bouaflé", "Dimbokro"], correctIndex: 0, explanation: "Elle réclame la libération des militants arrêtés.", sourceLabel: "Cours II-2", points: 1 },
        ],
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
          { label: "Le désapparentement et la stratégie parlementaire (1950-1956)", shortLabel: "Le désapparentement et la stratégie parlementaire", detail: "Houphouët-Boigny rompt avec le PCF, s’allie à l’UDSR de Mitterrand et fait de la lutte une action parlementaire jusqu’à la Loi-Cadre de 1956." },
          { label: "La Communauté franco-africaine (1958)", shortLabel: "La Communauté franco-africaine", detail: "De Gaulle met en place une Communauté de républiques autonomes ; toutes les colonies l’acceptent par référendum, sauf la Guinée." },
          { label: "L’indépendance du 7 août 1960", shortLabel: "l’indépendance du 7 août 1960", detail: "Après la désagrégation de la Communauté, la Côte d’Ivoire devient souveraine, avec Houphouët-Boigny pour premier président." },
        ],
        observation: "L’indépendance ivoirienne résulte d’une succession de rapports de force, de réformes et de négociations.",
        check: { prompt: "Quelle réforme de 1956 accroît l’autonomie des colonies ?", options: ["La Loi-Cadre", "Le plan Marshall", "Le Pacte de Varsovie", "La Charte de l’Atlantique"], correctIndex: 0, explanation: "La Loi-Cadre Defferre constitue une étape majeure vers l’autonomie." },
        parts: [
          {
            bodyMarkdown: String.raw`## Le désapparentement (7 octobre 1950)

Le **12 juin 1950**, René **Pleven** arrive au pouvoir en France et nomme François **Mitterrand** ministre de la France d’Outre-Mer. Ce dernier convainc Houphouët-Boigny de **rompre avec le PCF** pour rejoindre l’**UDSR** (Union démocratique et socialiste de la Résistance). La rupture est officialisée dans le **discours du 7 octobre 1950 au stade Géo André** : c’est le **désapparentement**, qui ouvre l’**ère de la collaboration**.

FHB lance alors un appel à l’union des forces politiques dans un parti unique pour bâtir la Côte d’Ivoire.

## La lutte devient parlementaire

Laurent Péchoux est remplacé par **Pierre Pélieu en 1952** : la lutte devient surtout **parlementaire**. Aux **élections législatives de 1956**, le PDCI (Côte d’Ivoire) et le RDA (Afrique) obtiennent la majorité des sièges africains. FHB devient **ministre d’État** dans le gouvernement de **Guy Mollet**.

## La Loi-Cadre (23 juin 1956)

Rédigée par **Gaston Defferre**, elle associe davantage les Africains à la gestion de leurs affaires :

- **suffrage universel** et **collège unique** dans les colonies ;
- pouvoir élargi des **assemblées territoriales** (justice, finances) ;
- création d’un **Conseil de gouvernement** (présidé par le gouverneur, vice-présidé par le chef du parti majoritaire).

La Loi-Cadre dote ainsi les colonies d’une réelle **autonomie politique et administrative** : un pas décisif vers l’émancipation.

> **Astuce mémoire de Davy.** Le désapparentement, c’est un triangle d’hommes : **Pleven** (chef du gouvernement) → **Mitterrand** (le ministre qui négocie) → **Houphouët-Boigny** (qui quitte le PCF pour l’UDSR). Date-repère unique : **7 octobre 1950, stade Géo André**.`,
            extraQuestions: [
              { prompt: "Qui convainc Houphouët-Boigny de rompre avec le PCF ?", options: ["François Mitterrand, ministre de la France d’Outre-Mer", "Charles de Gaulle", "Guy Mollet", "Gaston Defferre"], correctIndex: 0, explanation: "Nommé par Pleven, Mitterrand négocie le ralliement à l’UDSR.", sourceLabel: "Cours III-1", points: 2 },
              { prompt: "Où et quand le désapparentement est-il officialisé ?", options: ["Au stade Géo André, le 7 octobre 1950", "À Bamako, le 18 octobre 1946", "À Brazzaville, en février 1944", "À Abidjan, en 1960"], correctIndex: 0, explanation: "Ce discours ouvre l’ère de la collaboration.", sourceLabel: "Cours III-1", points: 2 },
              { prompt: "Qui rédige la Loi-Cadre de 1956 ?", options: ["Gaston Defferre", "François Mitterrand", "René Pleven", "André Latrille"], correctIndex: 0, explanation: "La Loi-Cadre Defferre du 23 juin 1956.", sourceLabel: "Cours III-2", points: 1 },
              { prompt: "Que met en place la Loi-Cadre de 1956 ?", options: ["Suffrage universel, collège unique et Conseil de gouvernement", "L’indépendance immédiate", "Le rétablissement du travail forcé", "La suppression des assemblées"], correctIndex: 0, explanation: "Elle donne aux colonies une autonomie politique et administrative.", sourceLabel: "Cours III-2", points: 2 },
              { prompt: "Range (activité 3) : « Houphouët-Boigny se rallie à l’UDSR de Mitterrand » appartient à…", options: ["Le désapparentement", "La Loi-Cadre de 1956", "La Communauté franco-africaine", "L’indépendance"], correctIndex: 0, explanation: "C’est l’acte fondateur de la phase de collaboration.", sourceLabel: "Activité d’application 3", points: 1 },
            ],
          },
          {
            bodyMarkdown: String.raw`## La Communauté franco-africaine (1958)

Revenu au pouvoir à la suite de la **guerre d’Algérie**, **de Gaulle** élabore une nouvelle constitution qui met en place, en **1958**, la **Communauté franco-africaine** : la France et ses anciennes colonies, devenues des **républiques autonomes**.

Ces États gèrent leurs propres affaires, **sauf** les **domaines stratégiques** réservés à la métropole :

> justice, défense, **monnaie**, politique extérieure, communication, enseignement supérieur.

Présentée par **référendum en septembre 1958**, la Communauté est **acceptée par toutes les colonies sauf la Guinée** de **Sékou Touré**, qui vote « non » et obtient aussitôt l’indépendance (**28 septembre 1958**), au prix d’une rupture de toute aide française.

## De la désagrégation à l’indépendance (1960)

La Communauté divise les leaders en deux camps :

| Camp | Chef de file | Idée |
|---|---|---|
| **Fédéralistes** | Léopold Sédar **Senghor** | regrouper les États en grands ensembles |
| **Territorialistes** | **Houphouët-Boigny** | indépendance territoire par territoire |

En **janvier 1959**, le Soudan français et le Sénégal créent la **Fédération du Mali** : la Communauté se désagrège. Entre janvier et août 1960, c’est la **vague des indépendances**. La **Côte d’Ivoire devient indépendante le 7 août 1960**, avec pour premier président **Félix Houphouët-Boigny**, rentré au pays en 1959 comme Premier ministre. Après l’indépendance, le pays maintient des relations d’amitié et de coopération avec la France.

> **Astuce mémoire de Davy.** Deux visions à opposer : **Senghor le fédéraliste** (« restons unis ») contre **Houphouët le territorialiste** (« chacun son État »). C’est la victoire des territorialistes qui explique la « balkanisation » évoquée par Deschamps et les 17 indépendances de 1960.`,
            extraQuestions: [
              { prompt: "Quels domaines la métropole conserve-t-elle dans la Communauté franco-africaine ?", options: ["Justice, défense, monnaie, politique extérieure, communication, enseignement supérieur", "Uniquement l’agriculture", "Aucun domaine", "La santé et le sport"], correctIndex: 0, explanation: "Les États gèrent le reste ; ces domaines restent des compétences communes.", sourceLabel: "Cours III-3", points: 2 },
              { prompt: "Quelle colonie refuse la Communauté en 1958 ?", options: ["La Guinée de Sékou Touré", "Le Sénégal de Senghor", "La Côte d’Ivoire d’Houphouët-Boigny", "Le Soudan français"], correctIndex: 0, explanation: "Elle accède aussitôt à l’indépendance, avec rupture de l’aide française.", sourceLabel: "Cours III-3", points: 2 },
              { prompt: "Qui dirige le camp des « fédéralistes » face aux « territorialistes » d’Houphouët-Boigny ?", options: ["Léopold Sédar Senghor", "Sékou Touré", "Gaston Defferre", "René Pleven"], correctIndex: 0, explanation: "L’opposition fédéralistes / territorialistes désagrège la Communauté.", sourceLabel: "Cours III-3", points: 2 },
              { prompt: "Quand la Côte d’Ivoire devient-elle indépendante, et avec quel premier président ?", options: ["Le 7 août 1960, avec Houphouët-Boigny", "Le 28 septembre 1958, avec Sékou Touré", "Le 27 octobre 1946, avec Latrille", "En 1959, avec Senghor"], correctIndex: 0, explanation: "FHB, rentré en 1959 comme Premier ministre, devient le premier président.", sourceLabel: "Cours III-3", points: 1 },
              { prompt: "La création de la Fédération du Mali (janvier 1959) réunit :", options: ["Le Soudan français et le Sénégal", "La Côte d’Ivoire et la Guinée", "Le Togo et le Cameroun", "L’Algérie et la Tunisie"], correctIndex: 0, explanation: "Cet événement précipite la désagrégation de la Communauté.", sourceLabel: "Cours III-3", points: 1 },
            ],
          },
        ],
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
        bodyMarkdown: String.raw`## Un statut à part : l’Algérie « française »

L’occupation française commence en **1830**. Jusqu’au **9 décembre 1848**, l’Algérie est une **colonie de peuplement** ; à cette date, elle devient une **partie intégrante de la France** (application des lois françaises). Elle est découpée en **trois départements — Alger, Oran, Constantine —** placés sous un gouverneur général relevant du **ministère de l’Intérieur**.

> **Correction importante.** L’Algérie n’est **pas** une colonie d’exploitation : c’est une **colonie de peuplement**. C’est le piège n°1 de l’activité d’application du cours.

## Une société à deux vitesses

| | Européens d’Algérie | Musulmans autochtones |
|---|---|---|
| **Nombre** | ~ **1 000 000** (80 % nés en Algérie) | ~ **8 000 000** |
| **Statut** | citoyens, privilèges, pouvoir | sous tutelle, sans partage réel de l’autorité |
| **Économie** | fonctions administratives, industrie, **meilleures terres** | agriculture traditionnelle, sous-emploi, misère |

Malgré leur participation à l’**effort de guerre de 1914-1918**, aucune amélioration n’est accordée aux musulmans, et la minorité française **refuse toute réforme** qui donnerait l’égalité.

## Trois tendances nationalistes

| Tendance | Leader | Organisation | Revendication |
|---|---|---|---|
| **Traditionnelle** | Abdelhamid **Ben Badis** | Association des Ouléma (1931) | rejet de l’assimilation, restauration de l’**Islam** |
| **Révolutionnaire / populiste** | **Messali Hadj** | Étoile nord-africaine (1927) → **PPA** (1939) | **indépendance** de l’Algérie |
| **Modérée / réformiste** | **Ferhat Abbas** | Fédération des élus indigènes (1927) | d’abord **assimilation** et égalité |

> Devise des Ouléma de Ben Badis : « L’Islam est ma religion, l’Arabe est ma langue et l’Algérie est ma patrie. »

## La radicalisation (1945-1954)

- **8 mai 1945 — massacres de Sétif** : émeutes puis répression très violente (~100 Français tués ; **8 000 Algériens** selon l’administration, **15 000** selon les nationalistes).
- **1946** : Ferhat Abbas fonde l’**UDMA** (république algérienne autonome associée à la France) ; Messali Hadj crée le **MTLD** (indépendance d’une Algérie musulmane et arabe).
- **20 septembre 1947** : statut érigeant l’Algérie en département d’outre-mer (assemblée de 120 députés, deux collèges) — **jamais appliqué**, rejeté par les deux camps.
- **Mars 1954** : naissance du **CRUA** (Belkacem Krim, Ben Boulaïd, Larbi Ben M’Hidi), décidé à la **lutte armée**.

> **Astuce mémoire de Davy.** Trois leaders, trois lignes : **Ben Badis** = religion (Ouléma), **Messali Hadj** = indépendance (PPA/MTLD), **Ferhat Abbas** = réforme puis autonomie (UDMA). Sétif 1945, c’est l’étincelle ; le CRUA de 1954, c’est le détonateur.`,
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
        extraQuestions: [
          { prompt: "L’Algérie est une colonie d’exploitation.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "C’est une colonie de peuplement, intégrée à la France en 1848.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "Les Français d’Algérie bénéficiaient de privilèges.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Un million d’Européens dominent l’administration, les villes et les meilleures terres.", sourceLabel: "Activité d’application 1", points: 1 },
          { prompt: "Les autochtones musulmans cultivaient les terres pauvres.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Ils pratiquent une agriculture traditionnelle ; les meilleures terres reviennent aux colons.", sourceLabel: "Activité d’application 1", points: 1 },
          { prompt: "Quel leader fonde l’Association des Ouléma en 1931 ?", options: ["Abdelhamid Ben Badis", "Messali Hadj", "Ferhat Abbas", "Ahmed Ben Bella"], correctIndex: 0, explanation: "La tendance traditionnelle rejette l’assimilation et prône la restauration de l’Islam.", sourceLabel: "Cours I-3", points: 2 },
          { prompt: "Que réclame Messali Hadj à travers l’Étoile nord-africaine puis le PPA ?", options: ["L’indépendance de l’Algérie", "L’assimilation complète", "Le maintien de la colonisation", "Une monarchie"], correctIndex: 0, explanation: "C’est la tendance révolutionnaire et populiste.", sourceLabel: "Cours I-3", points: 2 },
          { prompt: "En 1946, l’UDMA de Ferhat Abbas préconise…", options: ["Une République algérienne autonome associée à la France", "L’indépendance immédiate et armée", "Le rattachement à l’Espagne", "La fin de tout parti"], correctIndex: 0, explanation: "Ferhat Abbas évolue vers l’autonomie associée, quand le MTLD vise l’indépendance.", sourceLabel: "Cours I-3-b", points: 2 },
          { prompt: "Quelle date correspond aux émeutes de Sétif ?", options: ["8 mai 1945", "20 septembre 1947", "1er novembre 1954", "18 mars 1962"], correctIndex: 0, explanation: "La répression de Sétif accélère la radicalisation nationaliste.", sourceLabel: "Activité d’application 2", points: 1 },
        ],
        distractors: ["La société coloniale algérienne garantit une égalité complète entre Européens et musulmans.", "Le nationalisme algérien ne comporte qu’une seule tendance.", "L’Algérie cesse d’être française en 1848."],
      },
      {
        id: "insurrection",
        title: "De l’insurrection à la guerre",
        summary: "Caractériser le FLN, la Toussaint rouge, la répression et l’internationalisation du conflit.",
        conceptTitle: "Une guerre de libération armée",
        explanation: "Le CRUA devient le FLN et crée l’ALN. Dans la nuit du 31 octobre au 1er novembre 1954, une série d’attentats déclenche l’insurrection. La France répond par un engagement militaire massif, tandis que le conflit s’étend et se durcit.",
        bodyMarkdown: String.raw`## Le FLN déclenche l’insurrection

Le **CRUA** devient le **FLN** (Front de libération nationale), doté d’une branche militaire, l’**ALN** (Armée de libération nationale). Ses objectifs :

- **restaurer un État algérien souverain** fondé sur des principes islamiques ;
- déclencher une **insurrection armée** le 1ᵉʳ novembre 1954.

Dans la nuit du **31 octobre au 1ᵉʳ novembre 1954**, une série d’attentats vise installations militaires, communications et bâtiments publics : c’est la **Toussaint rouge** (« complot de la Toussaint »), avec au moins 10 morts côté français. La métropole, qui vient de perdre l’**Indochine**, réagit violemment et qualifie l’insurrection de « sédition ».

## L’escalade (1956-1958)

- **1956** : le FLN intensifie le **terrorisme urbain** ; les maquisards sont ravitaillés depuis le **Maroc, la Tunisie et l’Égypte**.
- **Riposte française** : **quadrillage** des quartiers, **regroupement** des populations et **torture**.
- Paris **refuse d’internationaliser** le conflit (« l’Algérie, c’est la France »), mais l’**ONU** et les **non-alignés** réclament la décolonisation.

## La crise de mai 1958

Le **13 mai 1958**, des émeutes éclatent à Alger. L’armée, favorable à l’Algérie française, installe un **Comité de salut public**. À Paris, les crises ministérielles s’enchaînent. Le général **Salan** fait appel à **De Gaulle** pour former un gouvernement capable de résoudre la crise : c’est la fin de la IVᵉ République.

> **Le point clé.** L’Algérie est une **guerre**, pas une simple négociation. Deux camps s’affrontent — **FLN-ALN** contre l’armée française — et la violence (attentats, torture, regroupements) est au cœur du processus.

> **Astuce mémoire de Davy.** Une seule date à ne jamais rater : **1ᵉʳ novembre 1954, la Toussaint rouge** = le début de la guerre d’Algérie. Et retiens l’enchaînement : **Sétif (1945) → CRUA (1954) → FLN/ALN → Toussaint rouge → crise de 1958 → De Gaulle**.`,
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
        extraQuestions: [
          { prompt: "Comment appelle-t-on le déclenchement de l’insurrection dans la nuit du 31 octobre au 1er novembre 1954 ?", options: ["La Toussaint rouge", "La semaine des barricades", "La nuit de cristal", "La marche verte"], correctIndex: 0, explanation: "Une série d’attentats coordonnés du FLN, aussi appelée « complot de la Toussaint ».", sourceLabel: "Cours II-1", points: 2 },
          { prompt: "Quelle est la branche militaire du FLN ?", options: ["L’ALN (Armée de libération nationale)", "L’OAS", "Le CRUA", "Le GPRA"], correctIndex: 0, explanation: "Le FLN mène le combat politique, l’ALN le combat armé.", sourceLabel: "Cours II-1", points: 1 },
          { prompt: "Quelles méthodes la France emploie-t-elle en riposte au FLN ?", options: ["Quadrillage, regroupement des populations et torture", "Le désarmement volontaire", "L’octroi immédiat de l’indépendance", "Le retrait total de l’armée"], correctIndex: 0, explanation: "Une répression dure qui alimente la condamnation internationale.", sourceLabel: "Cours II-1", points: 2 },
          { prompt: "Depuis quels pays les maquisards du FLN sont-ils ravitaillés en armes ?", options: ["Le Maroc, la Tunisie et l’Égypte", "La France et l’Espagne", "Les États-Unis et l’URSS", "Aucun pays voisin"], correctIndex: 0, explanation: "Les frontières voisines servent de bases arrière au FLN.", sourceLabel: "Cours II-1", points: 1 },
          { prompt: "Que provoque la crise du 13 mai 1958 ?", options: ["Le retour de De Gaulle au pouvoir", "L’indépendance immédiate", "La victoire de l’OAS", "La fin du FLN"], correctIndex: 0, explanation: "L’armée met en place un Comité de salut public et le général Salan appelle De Gaulle.", sourceLabel: "Cours II-1", points: 2 },
          { prompt: "Quelle date marque le début de la guerre d’Algérie ?", options: ["1er novembre 1954", "8 mai 1945", "4 juin 1958", "3 juillet 1962"], correctIndex: 0, explanation: "La Toussaint rouge ouvre huit années de guerre.", sourceLabel: "Activité d’application 2", points: 1 },
        ],
        distractors: ["La Toussaint rouge a lieu en 1945.", "La France ne déploie aucun renfort en Algérie.", "Le conflit reste totalement ignoré par l’ONU et les non-alignés."],
      },
      {
        id: "evian-independence",
        title: "De Gaulle, Évian et l’indépendance",
        summary: "Expliquer le changement de politique française et le processus d’autodétermination.",
        conceptTitle: "La négociation met fin à la guerre",
        explanation: "De Gaulle comprend progressivement que l’indépendance est inéluctable. Malgré l’opposition de l’OAS, les négociations avec le FLN aboutissent aux accords d’Évian, au cessez-le-feu et au référendum d’autodétermination.",
        keyPoint: "Les accords d’Évian et le référendum de 1962 consacrent l’indépendance de l’Algérie après près de huit années de guerre.",
        example: "« Je vous ai compris ! » : le 4 juin 1958 à Alger, De Gaulle reste volontairement ambigu sur le statut de l’Algérie.",
        timelineTitle: "Vers la souveraineté algérienne",
        timelineInstruction: "Suis les étapes politiques qui mettent fin au conflit.",
        timeline: [
          { label: "La politique algérienne de De Gaulle (1958-1961)", shortLabel: "La politique algérienne de De Gaulle", detail: "De Gaulle renonce à l’Algérie française, propose l’autodétermination et affronte l’OAS jusqu’au putsch d’avril 1961." },
          { label: "Les accords d’Évian (18 mars 1962)", shortLabel: "Les accords d’Évian", detail: "Négociés à partir de juillet 1961, ils reconnaissent l’indépendance et l’intégrité du territoire algérien." },
          { label: "L’indépendance du 3 juillet 1962", shortLabel: "l’indépendance du 3 juillet 1962", detail: "Après les référendums, l’indépendance est proclamée avec Ahmed Ben Bella pour premier président." },
        ],
        observation: "La négociation n’efface pas les violences, mais elle crée le cadre juridique de la fin de la guerre.",
        check: { prompt: "Quels accords ouvrent directement la voie à l’indépendance algérienne ?", options: ["Les accords d’Évian", "Les accords de Yalta", "Les conventions de Lomé", "Les accords de Dayton"], correctIndex: 0, explanation: "Les accords d’Évian de mars 1962 organisent cessez-le-feu et autodétermination." },
        parts: [
          {
            bodyMarkdown: String.raw`## De Gaulle change de cap

Le **1ᵉʳ juin 1958**, De Gaulle accède au pouvoir. Le **4 juin 1958**, à Alger, il prononce un discours volontairement ambigu resté célèbre : **« Algériens, je vous ai compris ! »**. Réaliste, il renonce en fait à l’Algérie française : faute de pouvoir donner l’**égalité**, il faudra donner la **liberté**. Il propose **trois solutions** :

| Solution | Contenu |
|---|---|
| **Indépendance totale** | une Algérie souveraine |
| **Assimilation** | une Algérie pleinement française |
| **Autonomie / association** | une Algérie associée à la France |

## Le blocage entre deux extrêmes

- Le **FLN**, qui a formé en **octobre 1958** un gouvernement provisoire (**GPRA**), exige la **seule indépendance** et rejette tout compromis fédéral.
- La **minorité française d’Algérie** refuse toute indépendance : c’est le dilemme de **« la valise ou le cercueil »** (partir ou mourir).

Persuadant l’opinion que l’indépendance est **inéluctable**, De Gaulle provoque la colère des partisans de l’Algérie française : **semaine des barricades** (24-31 janvier 1960), puis création de l’**OAS** (Organisation de l’armée secrète), qui multiplie les attentats et va jusqu’à un **putsch avorté** en avril 1961.

> **Précision.** Le putsch des généraux d’avril 1961 éclate à **Alger** (et non à Paris comme l’indique parfois le support) : c’est une tentative de l’armée d’Algérie contre la politique de De Gaulle.

> **Astuce mémoire de Davy.** Retiens la phrase-piège **« Je vous ai compris »** (4 juin 1958) et les **trois solutions** de De Gaulle. Face à lui, deux refus symétriques : le **FLN** veut tout (l’indépendance), l’**OAS** ne veut rien lâcher (l’Algérie française).`,
            extraQuestions: [
              { prompt: "Quelle phrase célèbre De Gaulle prononce-t-il à Alger le 4 juin 1958 ?", options: ["« Algériens, je vous ai compris ! »", "« L’Algérie, c’est la France »", "« Partir ou mourir »", "« Vive le Québec libre »"], correctIndex: 0, explanation: "Un discours volontairement ambigu sur le statut de l’Algérie.", sourceLabel: "Cours II-2", points: 2 },
              { prompt: "Quelles trois solutions De Gaulle propose-t-il pour l’Algérie ?", options: ["Indépendance totale, assimilation, autonomie associée", "Guerre, paix, neutralité", "Monarchie, république, empire", "Aucune : il refuse tout changement"], correctIndex: 0, explanation: "Le FLN choisit la première ; la minorité française les rejette toutes.", sourceLabel: "Cours II-2", points: 2 },
              { prompt: "Que désigne le dilemme de « la valise ou le cercueil » ?", options: ["Le choix des Français d’Algérie : partir ou mourir", "Une tactique du FLN", "Un accord commercial", "Le nom d’un référendum"], correctIndex: 0, explanation: "La minorité européenne redoute un État dirigé par le FLN.", sourceLabel: "Cours II-2", points: 2 },
              { prompt: "Quelle organisation les partisans de l’Algérie française créent-ils pour combattre le FLN par des attentats ?", options: ["L’OAS (Organisation de l’armée secrète)", "Le GPRA", "L’ALN", "L’UDMA"], correctIndex: 0, explanation: "L’OAS va jusqu’au putsch avorté d’avril 1961.", sourceLabel: "Cours II-2", points: 1 },
              { prompt: "À quelle date De Gaulle prononce-t-il son discours d’Alger ?", options: ["4 juin 1958", "13 mai 1958", "18 mars 1962", "1er novembre 1954"], correctIndex: 0, explanation: "Il accède au pouvoir le 1er juin 1958 et parle à Alger le 4 juin.", sourceLabel: "Activité d’application 2", points: 1 },
            ],
          },
          {
            bodyMarkdown: String.raw`## Les accords d’Évian (18 mars 1962)

À partir de **juillet 1961**, des pourparlers s’ouvrent entre la France et le FLN :

| Côté français | Côté algérien (FLN) |
|---|---|
| Louis **Joxe**, R. Buron, J. de Broglie | Belkacem **Krim**, Ben Tobbal, Dahleb, Yazid |

Signés le **18 mars 1962**, les **accords d’Évian** prévoient que la France :

- **reconnaît l’indépendance** de l’Algérie ;
- reconnaît l’**intégrité de son territoire** (Sahara compris) et de son peuple ;
- évacue progressivement ses troupes et maintient trois ans son aide de 1961 ;
- obtient des assurances sur la **coopération** (notamment le **pétrole**).

## Les référendums et l’indépendance

- **8 avril 1962** : un référendum en France **approuve** les accords d’Évian.
- **1ᵉʳ juillet 1962** : le **référendum d’autodétermination** en Algérie donne **90 % de « oui »**.
- **3 juillet 1962** : l’**indépendance** de l’Algérie est proclamée, avec **Ahmed Ben Bella** pour premier président.

**Bilan.** Après **huit années** de guerre, l’Algérie accède à la souveraineté au prix d’environ **un million de morts** de tous bords.

> **Correction.** Le premier président algérien est **Ahmed** Ben Bella (le support écrit parfois « Hamed »).

> **Astuce mémoire de Davy.** Trois dates de la fin : **18 mars 1962** (Évian, signature) → **1ᵉʳ juillet 1962** (référendum, 90 % oui) → **3 juillet 1962** (indépendance, Ben Bella). Ne confonds pas Évian (les accords) et le 3 juillet (la proclamation).`,
            extraQuestions: [
              { prompt: "Quand les accords d’Évian sont-ils signés ?", options: ["18 mars 1962", "8 mai 1945", "4 juin 1958", "3 juillet 1962"], correctIndex: 0, explanation: "Ils reconnaissent l’indépendance et l’intégrité du territoire algérien.", sourceLabel: "Activité d’application 2", points: 2 },
              { prompt: "Que reconnaît la France dans les accords d’Évian ?", options: ["L’indépendance de l’Algérie et l’intégrité de son territoire (Sahara compris)", "Le maintien de l’Algérie française", "L’annexion du Sahara par la France", "La partition de l’Algérie"], correctIndex: 0, explanation: "La France obtient en échange des assurances sur la coopération et le pétrole.", sourceLabel: "Cours II-2", points: 2 },
              { prompt: "Quel résultat donne le référendum d’autodétermination du 1er juillet 1962 ?", options: ["Environ 90 % de « oui » à l’indépendance", "Un rejet de l’indépendance", "Une égalité parfaite", "Le maintien du statut colonial"], correctIndex: 0, explanation: "Un plébiscite en faveur de la souveraineté.", sourceLabel: "Cours II-2", points: 1 },
              { prompt: "Qui devient le premier président de l’Algérie indépendante ?", options: ["Ahmed Ben Bella", "Ferhat Abbas", "Messali Hadj", "Belkacem Krim"], correctIndex: 0, explanation: "L’indépendance est proclamée le 3 juillet 1962.", sourceLabel: "Cours II-2", points: 2 },
              { prompt: "Relie : la proclamation de l’indépendance de l’Algérie a lieu le…", options: ["3 juillet 1962", "18 mars 1962", "20 septembre 1947", "8 mai 1945"], correctIndex: 0, explanation: "Après près de huit années de guerre et environ un million de morts.", sourceLabel: "Activité d’application 2", points: 1 },
            ],
          },
        ],
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
        bodyMarkdown: String.raw`## De l’OUA à l’UA

Au lendemain des indépendances, une Afrique **morcelée, fragile et pauvre** cherche à s’unir. L’**OUA** (Organisation de l’unité africaine) naît le **25 mai 1963 à Addis-Abeba** (Éthiopie). Mais elle échoue à remplir ses missions, pour trois raisons :

- l’**inadaptation de ses structures** ;
- la **marginalisation économique et politique** de l’Afrique à l’ère de la mondialisation ;
- l’**insécurité et l’instabilité** du continent.

Pour y remédier, les chefs d’État décident de la remplacer par l’**Union africaine (UA)**.

## Quatre sommets fondateurs

| Date | Sommet | Décision |
|---|---|---|
| **Septembre 1999** | **Syrte** (Libye) | **décide** la création de l’UA |
| **Juillet 2000** | **Lomé** (Togo) | adopte l’**acte constitutif** (charte) |
| **Juillet 2001** | **Lusaka** (Zambie) | établit le programme de mise en place |
| **9 juillet 2002** | **Durban** (Afrique du Sud) | signe la charte : l’UA est **officiellement créée** |

L’UA compte **55 pays membres** (tous les pays d’Afrique) et conserve le **siège d’Addis-Abeba**.

> **Correction.** Ne confonds pas **Syrte 1999** (qui *décide*) et **Durban 2002** (qui *crée officiellement*). Et l’UA remplace l’OUA pour cause d’**inefficacité**, non à cause de « rivalités entre chefs d’État ».

## Objectifs et principes

**Objectifs** : réaliser l’**unité** africaine, défendre la **souveraineté** des États, promouvoir la **paix et la sécurité**, la **démocratie** et les **droits de l’homme**, le **développement durable** et la recherche. L’ambition centrale est d’**accélérer l’intégration** économique et politique du continent.

**Principes** : règlement pacifique des conflits, égalité et souveraineté des États, **non-ingérence**, rejet des **changements anticonstitutionnels**, respect des **frontières héritées de la colonisation** — mais aussi un **droit d’intervention** en cas de **génocide, de crise grave ou de guerre**.

> **Astuce mémoire de Davy.** Retiens le grand renversement : l’OUA sacralisait la **non-ingérence** ; l’UA garde ce principe **mais** s’autorise à **intervenir** en cas de génocide ou de guerre. C’est la principale nouveauté de 2002.`,
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
        extraQuestions: [
          { prompt: "Où et quand l’OUA a-t-elle été créée ?", options: ["Le 25 mai 1963 à Addis-Abeba", "En 2002 à Durban", "En 1999 à Syrte", "En 1975 à Lomé"], correctIndex: 0, explanation: "L’UA conserve d’ailleurs ce siège d’Addis-Abeba.", sourceLabel: "Cours — Introduction", points: 1 },
          { prompt: "Quel sommet crée officiellement l’Union africaine ?", options: ["Le sommet de Durban (9 juillet 2002)", "Le sommet de Syrte (1999)", "Le sommet de Lomé (2000)", "Le sommet de Lusaka (2001)"], correctIndex: 0, explanation: "Syrte décide la création ; Durban la rend officielle.", sourceLabel: "Cours I-1-b", points: 2 },
          { prompt: "Le sommet de Syrte, en Libye, crée officiellement l’UA.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Syrte (1999) décide seulement la création ; c’est Durban (2002) qui la crée.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "Combien de pays membres compte l’UA ?", options: ["55, soit tous les pays d’Afrique", "27", "15", "8"], correctIndex: 0, explanation: "L’Union rassemble l’ensemble du continent.", sourceLabel: "Cours I-1-b", points: 1 },
          { prompt: "Quelle nouveauté distingue l’UA de l’OUA en matière d’ingérence ?", options: ["Un droit d’intervention en cas de génocide, de crise grave ou de guerre", "L’interdiction absolue de toute intervention", "La suppression des frontières", "L’adhésion à l’OTAN"], correctIndex: 0, explanation: "L’OUA sacralisait la non-ingérence ; l’UA l’assouplit.", sourceLabel: "Cours I-2-b", points: 2 },
          { prompt: "L’UA remplace l’OUA à cause des rivalités politiques entre chefs d’État.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "C’est l’inefficacité de l’OUA (structures, marginalisation, insécurité) qui motive le changement.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "L’UA veille au respect des droits de l’homme en Afrique.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "C’est l’un de ses objectifs affichés.", sourceLabel: "Activité d’application 1", points: 1 },
        ],
        distractors: ["L’UA remplace l’ONU.", "L’UA rejette tout objectif de développement.", "L’OUA est créée après l’UA."],
      },
      {
        id: "institutions",
        title: "Structures et fonctionnement",
        summary: "Distinguer organes de direction, de paix, de représentation, de justice et de financement.",
        conceptTitle: "Une architecture institutionnelle diversifiée",
        explanation: "La Conférence de l’Union est l’organe suprême. Le Conseil exécutif, la Commission, le Comité des représentants permanents et le Parlement panafricain assurent direction et administration. Le CPS, les juridictions et les institutions financières complètent l’ensemble.",
        bodyMarkdown: String.raw`## Les organes de direction

| Organe | Rôle |
|---|---|
| **La Conférence de l’Union** | organe **suprême** : chefs d’État et de gouvernement, réunion ≥ 1 fois/an, définit les politiques communes, adopte le budget. Présidence tournante d’**un an** |
| **Le Conseil exécutif** | ministres (ou délégués) des États : contrôle la **mise en œuvre** des politiques |
| **La Commission** | le **secrétariat général** : administration quotidienne. Président : **Moussa Faki Mahamat** (Tchad) |
| **Le Comité des représentants permanents** | ambassadeurs résidant à Addis-Abeba : prépare les travaux du Conseil exécutif |
| **Le Parlement panafricain (PAP)** | représentants des parlements nationaux (5 par pays), siège en **Afrique du Sud** |

## Les autres organes

- **Conseil de paix et de sécurité (CPS)** : **15 membres** (et un comité des sages de 9) — l’organe **décisionnel permanent** pour prévenir, gérer et régler les conflits.
- **Comités techniques spécialisés** : préparent projets et programmes (rôle de conseil-appui).
- **Institutions financières (3)** : la **Banque centrale africaine (BCA)**, le **Fonds monétaire africain (FMA)**, la **Banque africaine d’investissement (BAI)**.
- **Organe judiciaire** : la **CADHP** (Commission des droits de l’homme et des peuples), la **CAfDHP** (Cour africaine), la **CUADI** (droit international).

## Trois familles d’organes

| Nature | Exemples |
|---|---|
| **Politiques** | Conférence de l’Union, Commission, Comité des représentants permanents |
| **Économiques** | BCA, FMA, BAI |
| **Judiciaires** | CADHP, CAfDHP, CUADI |

> **Le point clé.** L’organe **suprême**, c’est la **Conférence** (les chefs d’État) ; l’organe **de la paix**, c’est le **CPS** ; le **bras administratif**, c’est la **Commission** (Moussa Faki). Ces trois-là reviennent tout le temps.

> **Astuce mémoire de Davy.** Pour classer un organe (activité 2), pose-toi une question : décide-t-il de la **politique** (Conférence, Commission), gère-t-il l’**argent** (BCA, FMA, BAI) ou dit-il le **droit** (CADHP, CAfDHP, CUADI) ?`,
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
        extraQuestions: [
          { prompt: "Quel est l’organe suprême de l’Union africaine ?", options: ["La Conférence de l’Union", "La Commission", "Le Parlement panafricain", "Le CPS"], correctIndex: 0, explanation: "Elle réunit les chefs d’État et de gouvernement au moins une fois par an.", sourceLabel: "Cours II-1", points: 2 },
          { prompt: "Qui préside la Commission de l’UA (secrétariat général) ?", options: ["Moussa Faki Mahamat", "Paul Kagame", "Cyril Ramaphosa", "Idriss Déby Itno"], correctIndex: 0, explanation: "La Commission assure l’administration quotidienne de l’organisation.", sourceLabel: "Cours II-1", points: 2 },
          { prompt: "Combien de membres compte le Conseil de paix et de sécurité (CPS) ?", options: ["15 membres", "5 membres", "27 membres", "55 membres"], correctIndex: 0, explanation: "Il s’appuie aussi sur un comité des sages de 9 membres.", sourceLabel: "Cours II-2", points: 1 },
          { prompt: "Où siège le Parlement panafricain ?", options: ["En Afrique du Sud", "À Addis-Abeba", "À Lomé", "En Libye"], correctIndex: 0, explanation: "Il réunit cinq représentants par parlement national.", sourceLabel: "Cours II-1", points: 1 },
          { prompt: "Classe (activité 2) : la Banque africaine d’investissement (BAI) est un organe…", options: ["Économique", "Politique", "Judiciaire", "Militaire"], correctIndex: 0, explanation: "Avec la BCA et le FMA, elle relève des institutions financières.", sourceLabel: "Activité d’application 2", points: 1 },
          { prompt: "Classe (activité 2) : la Cour africaine des droits de l’homme et des peuples (CAfDHP) est un organe…", options: ["Judiciaire", "Politique", "Économique", "Consultatif"], correctIndex: 0, explanation: "Elle relève de l’organe judiciaire, avec la CADHP et la CUADI.", sourceLabel: "Activité d’application 2", points: 2 },
        ],
        distractors: ["L’UA ne possède aucun parlement.", "La Commission est une alliance militaire.", "Les institutions financières dirigent seules la Conférence de l’Union."],
      },
      {
        id: "assessment",
        title: "Le bilan des actions de l’UA",
        summary: "Comparer interventions, projets de développement et obstacles politiques ou financiers.",
        conceptTitle: "Des succès, mais une dépendance persistante",
        explanation: "L’UA intervient dans des crises, condamne les changements anticonstitutionnels, déploie des missions et soutient des projets. Elle reste limitée par instabilité, terrorisme, faiblesse démocratique, manque de moyens autonomes, retards de cotisation et dépendance financière extérieure.",
        keyPoint: "Le bilan de l’UA est mitigé : son champ d’action s’élargit, mais ses moyens et l’engagement des États restent insuffisants.",
        example: "L’UA intervient dans la crise ivoirienne, déploie des forces au Darfour et en Somalie, et rétablit la légalité constitutionnelle aux Comores en 2008.",
        timelineTitle: "Mettre en balance résultats et limites",
        timelineInstruction: "Compare les actions de paix, les projets de développement et les obstacles.",
        timeline: [
          { label: "Les succès de l’UA", shortLabel: "Les succès de l’UA", detail: "Médiations et missions de paix (Darfour, Somalie, Comores), condamnation des coups d’État et hausse du budget." },
          { label: "Les limites de l’UA", shortLabel: "Les limites de l’UA", detail: "Instabilité, terrorisme, dépendance financière (95 % de l’extérieur) et faible intégration économique." },
          { label: "Les défis à relever", shortLabel: "les défis à relever", detail: "Autonomie financière (réforme Kagame), passer des réunions à l’action, libre circulation et solidarité." },
        ],
        observation: "Pour juger l’UA, il faut comparer l’ambition continentale aux ressources réellement disponibles.",
        check: { prompt: "Quelle faiblesse réduit l’autonomie de l’UA ?", options: ["Sa forte dépendance aux financements extérieurs", "L’absence totale d’États membres", "L’interdiction de toute réunion", "La disparition de tous les conflits africains"], correctIndex: 0, explanation: "Le financement extérieur important limite l’autonomie de l’organisation." },
        parts: [
          {
            bodyMarkdown: String.raw`## Les succès politiques et militaires

Grâce au **Conseil de paix et de sécurité (CPS)**, l’UA prévient et règle des crises :

- **intervention** dans la crise politico-militaire **ivoirienne** ;
- déploiement de forces au **Darfour** et en **Somalie** ;
- **désarmement** des ex-Interahamwe au Congo ;
- intervention aux **Comores (mars 2008)** : rétablissement de la **légalité constitutionnelle** ;
- **condamnation** des coups d’État (capitaine **Sanogo** au Mali en 2012, général **Diendéré** au Burkina en 2015) et des crimes de guerre (Darfour).

## Les succès économiques et sociaux

- **Budget en forte hausse** : de **150 millions $ (2011)** à **1,2 milliard $ (2017)** — signe d’un rôle grandissant.
- **Aide humanitaire** aux pays en guerre ou frappés par des catastrophes (Darfour, Éthiopie, Mozambique).
- **Appropriation du NEPAD** (Nouveau partenariat pour le développement).
- Projets d’**infrastructures** (écoles, routes) via la **BAD**.

> **Le point clé.** Les succès de l’UA sont **réels mais surtout dans la médiation et la paix** (CPS). Sur le terrain économique, ce sont plutôt des **amorces** (budget, NEPAD, infrastructures) que des résultats massifs.

> **Astuce mémoire de Davy.** Pour les succès politiques, retiens le trio **Comores 2008 – Darfour/Somalie – condamnation des coups d’État**. Et une image forte : le budget qui passe de **150 millions à 1,2 milliard** de dollars.`,
            extraQuestions: [
              { prompt: "Quel organe permet à l’UA d’intervenir dans les crises ?", options: ["Le Conseil de paix et de sécurité (CPS)", "Le Fonds monétaire africain", "Le Parlement panafricain", "La CADHP"], correctIndex: 0, explanation: "Le CPS prévient, gère et règle les conflits.", sourceLabel: "Cours III-1", points: 1 },
              { prompt: "Où l’UA rétablit-elle la légalité constitutionnelle en mars 2008 ?", options: ["Aux Comores", "Au Mali", "En Somalie", "Au Burkina Faso"], correctIndex: 0, explanation: "Une intervention souvent citée comme un succès de l’UA.", sourceLabel: "Cours III-1", points: 2 },
              { prompt: "Comment évolue le budget de l’UA entre 2011 et 2017 ?", options: ["De 150 millions à 1,2 milliard de dollars", "Il reste stable", "Il diminue de moitié", "Il devient nul"], correctIndex: 0, explanation: "Une hausse qui traduit un rôle grandissant.", sourceLabel: "Cours III-1", points: 2 },
              { prompt: "L’UA a déployé des soldats au Darfour.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Avec la Somalie, c’est l’un de ses grands déploiements.", sourceLabel: "Exercice — Activité 3", points: 1 },
              { prompt: "L’UA est intervenue dans le règlement du conflit post-électoral de la Côte d’Ivoire.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "C’est cité parmi ses succès politico-militaires.", sourceLabel: "Exercice — Activité 3", points: 1 },
            ],
          },
          {
            bodyMarkdown: String.raw`## Les limites politiques et militaires

- **Instabilité** et faiblesse démocratique : coups d’État (Égypte, Soudan, Zimbabwe, Libye), **crises post-électorales** (Côte d’Ivoire, Burundi, Gabon…), et **souveraineté** brandie contre les recommandations de l’UA.
- **Insécurité** : guerres civiles (Sierra Leone, RCA, Somalie) et **terrorisme** (Mali, Burkina, Niger, Nigéria, Tchad, Cameroun).
- **Impuissance** à prévenir les conflits, à maintenir la paix et à **financer** seule ses missions ; **manque d’autorité** du président de la Commission ; **influences extérieures** (blocs francophone, anglophone, arabophone).

## Les limites économiques et sociales

- **95 % du budget de fonctionnement** vient de l’**extérieur** (le siège lui-même a été construit par la **Chine**).
- **Retards de cotisation** : en 2012, seulement **17 pays** à jour.
- **Faiblesse des échanges** intra-africains (**12 %**), surendettement, **multiplicité des monnaies**, retard de la **monnaie unique**.
- Persistance de la **pauvreté, de la corruption et de la mauvaise gouvernance**.

## Les défis à relever

L’enjeu est l’**autonomie financière** (réforme de **Paul Kagame** : taxe sur les importations pour financer l’UA) et le passage **des réunions à l’action** — comme l’exhorte le président tchadien **Idriss Déby Itno** : libre circulation des biens et des personnes, passeport commun, solidarité face au terrorisme, « prendre son destin en main ».

> **Correction.** L’UA **n’est pas** systématiquement opposée à *tous* les coups d’État avec la même fermeté, et le NEPAD **n’est pas encore** pleinement une réalité : reste prudent sur ces affirmations (exercice « vrai/faux »).

> **Astuce mémoire de Davy.** Deux chiffres résument la fragilité : **95 %** du budget vient de l’extérieur, et seulement **12 %** d’échanges entre pays africains. Le grand défi tient en une phrase de Kagame : « on ne peut pas financer des idées africaines avec un fonds qui ne vient pas d’Afrique ».`,
            extraQuestions: [
              { prompt: "Quelle part du budget de fonctionnement de l’UA provient de l’extérieur ?", options: ["Environ 95 %", "Environ 10 %", "0 %", "50 %"], correctIndex: 0, explanation: "Une dépendance qui limite fortement l’autonomie de l’UA.", sourceLabel: "Cours III-2", points: 2 },
              { prompt: "Quel pays a financé la construction du siège de l’UA ?", options: ["La Chine", "La France", "Les États-Unis", "Le Royaume-Uni"], correctIndex: 0, explanation: "Un symbole de la dépendance extérieure de l’organisation.", sourceLabel: "Exercice — Activité 3", points: 2 },
              { prompt: "Quelle est la part des échanges commerciaux entre les États de l’Union ?", options: ["Environ 12 %", "Environ 60 %", "Environ 90 %", "0 %"], correctIndex: 0, explanation: "La faiblesse des échanges intra-africains freine l’intégration.", sourceLabel: "Cours III-2", points: 1 },
              { prompt: "Quelle réforme Paul Kagame propose-t-il pour l’autonomie financière de l’UA ?", options: ["Une taxe sur les importations de chaque pays", "La suppression du budget", "La vente du siège", "L’adhésion à l’Union européenne"], correctIndex: 0, explanation: "« On ne peut pas financer des idées africaines avec un fonds venu d’ailleurs. »", sourceLabel: "Document 1 — RFI", points: 2 },
              { prompt: "Qu’exhorte le président Idriss Déby Itno à faire ?", options: ["Passer des réunions interminables à l’action et prendre son destin en main", "Multiplier les réunions", "Dépendre davantage de l’extérieur", "Dissoudre l’UA"], correctIndex: 0, explanation: "Libre circulation, passeport commun, solidarité contre le terrorisme.", sourceLabel: "Document 3 — Fraternité Matin", points: 1 },
            ],
          },
        ],
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
        bodyMarkdown: String.raw`## Qu’est-ce que le « monde occidental » ?

Le monde occidental se caractérise par un **haut niveau de vie**, un fort développement **industriel** et un système **capitaliste** (longtemps opposé au monde socialiste), organisé autour d’**institutions démocratiques**. Géographiquement, il regroupe l’**Amérique du Nord**, l’**Europe de l’Ouest**, le **Japon** et l’**Australie** — un espace pénétré d’**idées libérales**.

> **Correction.** Le monde occidental **ne se limite pas** à l’Europe de l’Ouest, et il **inclut le Japon**. En revanche, le **Brésil** n’en fait pas partie (piège de l’activité 1).

## Un héritage lointain

| Source | Apport majeur |
|---|---|
| **Grèce antique** (Athènes) | la **démocratie** — instaurée par **Clisthène** à la fin du VIᵉ s. av. J.-C. : égalité devant la loi et libertés |
| **Rome antique** | le **droit civil**, base du droit européen, et l’idée d’**État souverain** |
| **Influence judéo-chrétienne** | le **monothéisme** hébraïque puis le **christianisme**, greffé sur le tronc gréco-latin |
| **Apports gréco-latins** | les **langues** (français, italien, espagnol…) et la pensée politique de **Platon** et **Aristote** |

## L’héritage moderne et contemporain

- **Régimes parlementaires** : au XVIIᵉ siècle, les **révolutions anglaises** limitent le pouvoir royal ; **John Locke** (*Traité du gouvernement civil*) place la souveraineté dans le **peuple**, non dans le monarque.
- **Régimes démocratiques et droits de l’homme** : la **révolution américaine de 1776** (liberté, droit des peuples) et la **Révolution française de 1789** (**Déclaration des droits de l’homme et du citoyen**). À la fin du XIXᵉ siècle se réalise la **synthèse du libéralisme et de la démocratie**.

> **Astuce mémoire de Davy.** Retiens les **quatre couches** de l’héritage : **Grèce** (démocratie) + **Rome** (droit) + **judéo-christianisme** (religion) + **révolutions** (1776, 1789 → droits de l’homme). Les mots mêmes — *démocratie, monarchie, aristocratie* — sont grecs.`,
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
        extraQuestions: [
          { prompt: "Le monde occidental désigne seulement l’ensemble des pays de l’Europe de l’Ouest.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Il inclut aussi l’Amérique du Nord, le Japon et l’Australie.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "L’Australie et le Brésil sont comptés parmi les pays du monde occidental.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "L’Australie oui, mais pas le Brésil.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "Qui instaure la démocratie à Athènes en remplaçant la tyrannie ?", options: ["Clisthène", "Platon", "John Locke", "Aristote"], correctIndex: 0, explanation: "À la fin du VIᵉ siècle av. J.-C., après l’époque des tyrans.", sourceLabel: "Cours I-1-a", points: 2 },
          { prompt: "Quel héritage antique est à la base du droit européen ?", options: ["Le droit civil romain", "Le droit coutumier japonais", "La common law américaine", "Le droit canonique seul"], correctIndex: 0, explanation: "Rome lègue le droit et l’idée d’État souverain.", sourceLabel: "Cours I-1-b", points: 1 },
          { prompt: "Quelle révolution proclame la Déclaration des droits de l’homme et du citoyen ?", options: ["La Révolution française de 1789", "La révolution américaine de 1776", "Les révolutions anglaises du XVIIᵉ siècle", "La révolution russe de 1917"], correctIndex: 0, explanation: "1789 est un laboratoire du libéralisme et de la démocratie.", sourceLabel: "Cours I-2-b", points: 2 },
          { prompt: "Selon John Locke, où réside la souveraineté ?", options: ["Dans le peuple", "Dans le monarque", "Dans l’Église", "Dans l’armée"], correctIndex: 0, explanation: "Le parlement devient le centre de la décision politique.", sourceLabel: "Cours I-2-a", points: 1 },
          { prompt: "Le mot « démocratie » désigne le pouvoir du peuple.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Comme monarchie ou aristocratie, le terme est d’origine grecque.", sourceLabel: "Activité d’application 1", points: 1 },
        ],
        distractors: ["Le droit européen ne doit rien à Rome.", "Le christianisme apparaît au XXe siècle.", "Les révolutions américaine et française rejettent toute idée de liberté."],
      },
      {
        id: "politics-economy",
        title: "Les valeurs politiques et économiques",
        summary: "Caractériser démocratie libérale, pluralisme, propriété privée et économie de marché.",
        conceptTitle: "Libertés politiques et capitalisme libéral",
        explanation: "Le modèle politique valorise libertés individuelles, élections, pluralisme, séparation des pouvoirs et État de droit. Le modèle économique repose sur propriété privée, initiative individuelle, concurrence, profit et loi de l’offre et de la demande.",
        keyPoint: "Le monde occidental associe généralement démocratie libérale et économie capitaliste, malgré des limites et des inégalités.",
        example: "Les régimes peuvent être présidentiels (États-Unis), parlementaires ou des monarchies parlementaires (Royaume-Uni, Japon), tout en partageant des principes démocratiques.",
        timelineTitle: "Les piliers du modèle libéral",
        timelineInstruction: "Explore les institutions politiques, les règles économiques et leurs limites.",
        timeline: [
          { label: "Le domaine politique", shortLabel: "Le domaine politique", detail: "Liberté, suffrage universel, pluralisme des partis, assemblées parlementaires et séparation des pouvoirs." },
          { label: "Le domaine économique", shortLabel: "Le domaine économique", detail: "Libéralisme : propriété privée, libre concurrence, recherche du profit et loi de l’offre et de la demande." },
          { label: "Les limites du modèle", shortLabel: "les limites du modèle", detail: "Inégalités et exclusions, lobbying, dérives de certaines libertés et montée d’idéologies extrémistes." },
        ],
        observation: "Présenter un modèle ne signifie pas ignorer l’écart entre ses principes et son fonctionnement réel.",
        check: { prompt: "Quel principe caractérise l’économie capitaliste libérale ?", options: ["La propriété privée des moyens de production", "La suppression de toute monnaie", "L’interdiction de la concurrence", "La collectivisation obligatoire"], correctIndex: 0, explanation: "Propriété privée et libre entreprise sont des principes centraux du capitalisme libéral." },
        parts: [
          {
            bodyMarkdown: String.raw`## Le modèle politique occidental

Il repose sur cinq grands principes :

| Principe | Contenu |
|---|---|
| **La liberté** | primauté de l’individu et **droits naturels** (pensée, opinion, presse, association, réunion). Le pouvoir tire sa légitimité du **contrat social** (**Rousseau**) |
| **Le suffrage universel** | participation au pouvoir par le vote : **direct** en France, **indirect** aux États-Unis, à **scrutin secret** |
| **Les partis politiques** | le **pluralisme** naît de la liberté de pensée ; les partis portent des **clivages idéologiques** |
| **Les assemblées parlementaires** | elles votent le **budget** et les **lois**, et **contrôlent l’exécutif** (responsable devant le parlement) |
| **La séparation des pouvoirs** | **exécutif, législatif et judiciaire** confiés à des personnes différentes, garantie par la **Constitution** |

La **presse** y joue le rôle de **quatrième pouvoir**.

## Trois grands types de régimes

| Régime | Exemples |
|---|---|
| **Présidentiel** | États-Unis |
| **Parlementaire** | Italie, Portugal, France, Allemagne, Israël, Turquie |
| **Monarchie parlementaire** | Royaume-Uni, Japon, Espagne |

> **Astuce mémoire de Davy.** Ne confonds pas **régime présidentiel** (le président élu gouverne, ex. USA) et **monarchie parlementaire** (un roi qui règne mais ne gouverne pas, ex. Royaume-Uni, Japon, Espagne). Et une définition à connaître : la **Constitution** = la **loi fondamentale** qui fixe l’organisation de l’État.`,
            extraQuestions: [
              { prompt: "Sur quel penseur repose l’idée que le pouvoir naît d’un « contrat social » ?", options: ["Jean-Jacques Rousseau", "Karl Marx", "Adam Smith", "Platon"], correctIndex: 0, explanation: "La légitimité du pouvoir vient du consentement des individus.", sourceLabel: "Cours II-1", points: 2 },
              { prompt: "Quelle forme de suffrage universel est utilisée aux États-Unis ?", options: ["Le suffrage universel indirect", "Le suffrage universel direct", "Le tirage au sort", "Aucune élection"], correctIndex: 0, explanation: "En France, il est direct ; aux États-Unis, indirect.", sourceLabel: "Cours II-1", points: 2 },
              { prompt: "Que garantit le principe de séparation des pouvoirs ?", options: ["Que l’exécutif, le législatif et le judiciaire sont confiés à des personnes différentes", "Que le président détient tous les pouvoirs", "Qu’il n’existe qu’un seul parti", "Que la presse est interdite"], correctIndex: 0, explanation: "Il évite l’abus de pouvoir ; la presse est le « quatrième pouvoir ».", sourceLabel: "Cours II-1", points: 2 },
              { prompt: "Classe : les États-Unis relèvent d’un régime…", options: ["Présidentiel", "Parlementaire", "Monarchie parlementaire", "Théocratique"], correctIndex: 0, explanation: "Leur Constitution institue un régime présidentiel.", sourceLabel: "Exercice — Activité 1", points: 1 },
              { prompt: "Classe : le Japon relève d’…", options: ["Une monarchie parlementaire", "Un régime présidentiel", "Une république socialiste", "Une dictature militaire"], correctIndex: 0, explanation: "Comme le Royaume-Uni et l’Espagne.", sourceLabel: "Exercice — Activité 1", points: 1 },
            ],
          },
          {
            bodyMarkdown: String.raw`## Le modèle économique : le capitalisme libéral

Le système repose sur le **libéralisme économique** : la **liberté** laissée aux producteurs et aux consommateurs d’agir selon leurs intérêts.

Ses principes :

- la **libre concurrence** ;
- la **recherche du profit maximum** ;
- la **loi de l’offre et de la demande** (loi du marché).

Le **capitaliste** est **propriétaire des moyens de production** ; il verse à l’ouvrier un **salaire** fixé par le marché. Ce capitalisme est très efficace pour la **production de masse** et a **enrichi** les pays occidentaux.

## Les limites du modèle

La démocratie libérale n’est pas parfaite :

- **exclusion** de catégories raciales ou sociales (pauvres, immigrés laissés pour compte) ;
- **dérives** de certaines libertés (grèves excessives, **liberté du port d’arme** aux États-Unis) ;
- **alternance** parfois factice, le pouvoir étant capté par des **lobbies** (groupes de pression) ;
- persistance de **partis d’extrême droite** et d’**idéologies racistes**.

> **Le point clé.** Économie = **capitalisme libéral** (concurrence, profit, marché). Mais garde en tête la nuance : ce modèle **enrichit** ET **exclut** ; la liberté qu’il célèbre connaît aussi des **dérives**.

> **Astuce mémoire de Davy.** Trois mots pour l’économie : **concurrence**, **profit**, **marché** (offre/demande). Trois mots pour les limites : **inégalités**, **lobbying**, **extrémismes**.`,
            extraQuestions: [
              { prompt: "Sur quoi repose le système économique du monde occidental ?", options: ["Le libéralisme économique (capitalisme)", "Le communisme", "L’économie planifiée", "L’autarcie"], correctIndex: 0, explanation: "Concurrence, profit et loi du marché en sont les principes.", sourceLabel: "Cours II-2", points: 1 },
              { prompt: "Qui est propriétaire des moyens de production dans le capitalisme libéral ?", options: ["Le capitaliste (l’entrepreneur)", "L’État seul", "Les ouvriers collectivement", "Personne"], correctIndex: 0, explanation: "Il verse à l’ouvrier un salaire fixé par le marché.", sourceLabel: "Cours II-2", points: 2 },
              { prompt: "Le communisme est une politique du monde occidental.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Le monde occidental est capitaliste, longtemps opposé au monde socialiste.", sourceLabel: "Activité d’application 1", points: 2 },
              { prompt: "Quelle est une limite de la démocratie libérale citée dans le cours ?", options: ["Le pouvoir capté par des lobbies et l’exclusion des plus pauvres", "L’absence totale de partis", "L’interdiction du profit", "La disparition de la presse"], correctIndex: 0, explanation: "S’y ajoutent les dérives des libertés et les extrémismes.", sourceLabel: "Cours I-2-b", points: 2 },
              { prompt: "La loi de l’offre et de la demande est aussi appelée…", options: ["La loi du marché", "La loi de Locke", "La loi salique", "La loi martiale"], correctIndex: 0, explanation: "Elle fixe notamment le niveau des salaires.", sourceLabel: "Cours II-2", points: 1 },
            ],
          },
        ],
        distractors: ["La démocratie libérale concentre tous les pouvoirs sans contrôle.", "Le pluralisme interdit plusieurs partis politiques.", "L’économie de marché ignore l’offre et la demande."],
      },
      {
        id: "social-cultural",
        title: "Les traits socioculturels et leur diffusion",
        summary: "Analyser urbanisation, consommation, loisirs, arts, christianisme et diffusion médiatique.",
        conceptTitle: "Une société urbaine, mobile et médiatisée",
        explanation: "La croissance d’après-guerre accentue urbanisation, consommation de masse, éducation, loisirs et sport. Arts, musique et cinéma occupent une place majeure ; le christianisme reste influent, tandis que médias et internet diffusent les modes de vie occidentaux.",
        bodyMarkdown: String.raw`## Une vie sociale en mutation

La **croissance économique d’après-guerre** a transformé les sociétés occidentales :

- forte **urbanisation** et **consommation de masse** ;
- l’**éducation**, les **loisirs** et le **sport** deviennent des besoins prioritaires ;
- mais aussi une modification des rapports entre générations et une **montée de la délinquance et de la violence**.

## Un art en renouveau

Les **lettres**, la **création artistique** et la **musique** connaissent un renouveau ; la **chanson** et surtout le **cinéma** deviennent un refuge pour une société en crise. Les nouvelles générations prônent la **paix, la fraternité** et le **refus du racisme**.

## Une société chrétienne et médiatisée

Le **christianisme** reste la religion majoritaire ; les Églises tentent de s’adapter. Ces croyances et valeurs se diffusent mondialement par les **multimédias** (internet, autoroutes de l’information) et les **médias classiques** (radio, télévision, cinéma, publicité), au point de tendre vers l’**universel**.

> **Nuance de conclusion.** Le monde occidental reste dominé par les valeurs de **liberté** et de **démocratie**. **Toutefois**, avec l’**émergence d’autres sociétés**, la civilisation occidentale influence **de moins en moins** le reste du monde — un point essentiel pour la mission finale.

> **Astuce mémoire de Davy.** Pour classer un trait (activité 2) : est-il **économique** (libre-échange, loi du marché, concurrence) ou **socioculturel** (individualisme, société de consommation, pluralité de la presse, émancipation de la femme, De Vinci et Picasso) ?`,
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
        extraQuestions: [
          { prompt: "Qu’est-ce qui explique les mutations sociales de l’Occident d’après-guerre ?", options: ["La croissance économique (urbanisation, consommation de masse)", "Un retour à la ruralité", "La fin de l’éducation", "L’interdiction des loisirs"], correctIndex: 0, explanation: "Éducation, loisirs et sport deviennent prioritaires.", sourceLabel: "Cours III-3-a", points: 1 },
          { prompt: "Quelle religion est majoritaire dans les sociétés occidentales ?", options: ["Le christianisme", "L’islam", "Le bouddhisme", "L’hindouisme"], correctIndex: 0, explanation: "Les Églises chrétiennes tentent de s’adapter aux mutations de la société.", sourceLabel: "Cours III-3-c", points: 1 },
          { prompt: "Classe (activité 2) : la « société de consommation » est une caractéristique…", options: ["Socioculturelle", "Économique", "Militaire", "Religieuse"], correctIndex: 0, explanation: "Avec l’individualisme, la presse plurielle ou l’émancipation de la femme.", sourceLabel: "Activité d’application 2", points: 2 },
          { prompt: "Classe (activité 2) : la « loi du marché » est une caractéristique…", options: ["Économique", "Socioculturelle", "Politique", "Religieuse"], correctIndex: 0, explanation: "Comme la libre concurrence et le libre-échange.", sourceLabel: "Activité d’application 2", points: 2 },
          { prompt: "Comment les valeurs occidentales se diffusent-elles dans le monde ?", options: ["Par les multimédias et les médias classiques (internet, TV, cinéma, publicité)", "Par la fermeture des frontières", "Uniquement par l’armée", "Elles ne se diffusent pas"], correctIndex: 0, explanation: "Elles tendent ainsi à devenir universelles.", sourceLabel: "Cours III-3-c", points: 1 },
          { prompt: "Aujourd’hui, la civilisation occidentale influence le reste du monde…", options: ["De moins en moins, avec l’émergence d’autres sociétés", "De plus en plus, sans concurrence", "Plus du tout", "Uniquement en Afrique"], correctIndex: 0, explanation: "C’est la nuance de la conclusion du cours.", sourceLabel: "Cours — Conclusion", points: 2 },
        ],
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
        bodyMarkdown: String.raw`## Qu’est-ce que la civilisation négro-africaine ?

C’est l’ensemble des **caractères propres aux peuples d’Afrique noire** (institutions politiques, techniques, économie, croyances). De la préhistoire au Moyen Âge, l’Afrique a produit de **brillantes civilisations**. Les contacts avec le reste du monde (surtout aux XVIIIᵉ-XIXᵉ siècles) en transforment ensuite les structures.

> **Correction.** La civilisation **négro-africaine** ne concerne pas *toute* l’Afrique, mais l’**Afrique noire (subsaharienne)**.

## Des structures politiques variées

| Type | Organisation | Exemples |
|---|---|---|
| **Sociétés étatiques** (royaumes, empires) | pouvoir **centralisé** et **sacré** du roi ou de l’empereur (aristocratie héréditaire) | Mossi, Ashanti, Dahomey, empires du **Mali** et du **Ghana**, émirat de Kano |
| **Sociétés sans État** (chefferies) | un **chef** assisté d’un **conseil des notables**, sur la base des lignages, clans et villages | peuples **Krou**, Akan lagunaires (Ébrié, Attié, Adjoukrou) |

Le pouvoir « absolu » du roi est en réalité **tempéré** par l’**arbre à palabres**, les **griots**, les **chefs de terre** et, chez les Akan, la **Reine-Mère**.

## Une économie de subsistance

L’économie vise d’abord à **nourrir la communauté** :

- **agriculture** (céréales, tubercules ; terre **collective** ; culture sur brûlis ; houe et machette ; faibles rendements) ;
- **élevage** (savanes et steppes : Peuls, Masaï), **cueillette, pêche, chasse** (dozos) ;
- **artisanat** (poteries, sculptures, bijoux) ;
- **commerce** peu développé : **troc**, monnaies anciennes (**cauris**, poudre d’or), grandes cités sahéliennes (**Tombouctou, Gao, Djenné**).

> **Astuce mémoire de Davy.** Deux familles politiques : **avec État** (royaumes/empires, pouvoir centralisé) et **sans État** (chefferies, conseil des notables). Et un mot pour l’économie : **subsistance** (pas de marché, mais du troc).`,
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
        extraQuestions: [
          { prompt: "La civilisation négro-africaine concerne les peuples de l’ensemble de l’Afrique.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle concerne l’Afrique noire (subsaharienne).", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "Comment nomme-t-on les sociétés précoloniales dotées d’un pouvoir centralisé (roi ou empereur) ?", options: ["Les sociétés étatiques (royaumes et empires)", "Les chefferies", "Les républiques", "Les cités-États grecques"], correctIndex: 0, explanation: "Le souverain, personnage sacré, y détient des pouvoirs politiques, militaires et religieux.", sourceLabel: "Cours I-1-a", points: 2 },
          { prompt: "Quel dispositif tempère le pouvoir « absolu » du roi ?", options: ["L’arbre à palabres, les griots et les chefs de terre", "Un parlement bicaméral", "Une cour constitutionnelle", "Un référendum annuel"], correctIndex: 0, explanation: "Chez les Akan s’y ajoute la Reine-Mère.", sourceLabel: "Cours I-1", points: 2 },
          { prompt: "L’économie des sociétés négro-africaines précoloniales est une économie de marché.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "C’est une économie de subsistance, fondée sur le troc.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "Quelle forme d’échange est la plus courante dans le commerce précolonial ?", options: ["Le troc", "La carte bancaire", "Le crédit international", "La Bourse"], correctIndex: 0, explanation: "On utilise aussi des monnaies anciennes comme les cauris.", sourceLabel: "Cours I-2-d", points: 1 },
          { prompt: "Quelles grandes cités sahéliennes servaient de lieux d’échange entre Afrique noire et Afrique blanche ?", options: ["Tombouctou, Gao et Djenné", "Le Caire, Alger et Tunis", "Lagos, Accra et Dakar", "Kano, Sokoto et Zaria"], correctIndex: 0, explanation: "Elles concentraient les grandes transactions transsahariennes.", sourceLabel: "Cours I-2-d", points: 1 },
        ],
        distractors: ["Toutes les sociétés africaines précoloniales possèdent un empire centralisé.", "L’artisanat est absent des économies précoloniales.", "Le commerce utilise uniquement des billets modernes."],
      },
      {
        id: "society-culture-beliefs",
        title: "Société, culture et croyances précoloniales",
        summary: "Comprendre solidarité communautaire, hiérarchies, oralité, arts et croyances.",
        conceptTitle: "Une vie communautaire fortement structurée",
        explanation: "La famille élargie et la communauté organisent éducation, mariage et solidarité. La société est hiérarchisée selon âge, sexe, statut ou métier. Oralité, musique, danse et arts transmettent les valeurs, tandis qu’un Dieu suprême, les ancêtres et les génies structurent les croyances.",
        bodyMarkdown: String.raw`## Une société communautaire

En Afrique noire, **l’individu n’est jamais isolé** : l’éducation des enfants est l’affaire de **toute la communauté**. Le **mariage** a un caractère **collectif** (il unit deux familles ou clans) et se scelle par la **dot**.

## Une société hiérarchisée

| Critère | Hiérarchie |
|---|---|
| **Statut** | nobles (rois, notables) → hommes libres (paysans, artisans) → esclaves (captifs de guerre) |
| **Âge et sexe** | l’aîné avant le cadet, l’homme avant la femme ; les **initiés** (adultes) dominent — c’est la **gérontocratie** |
| **Métier** | des **castes** héréditaires (forgerons, cordonniers, griots) |

L’**initiation** fait passer les jeunes au monde adulte (le **Poro** chez les Sénoufo). Des règles structurent la vie : **solidarité**, **polygamie**, modes d’**héritage**.

## Culture et croyances

- **Productions culturelles** : la **littérature orale** (contes, légendes, proverbes), la **musique** et la **danse** (tam-tam, balafon, flûte), un **art sacré** (masques et statues représentant des divinités).
- **Croyances** : les Africains reconnaissent un **Dieu suprême** (Gnamien en baoulé, Lagô en bété, Kolotchôlô en sénoufo) ; les **ancêtres** et les **génies** servent d’**intermédiaires**. L’**animisme** est la religion par excellence, fondée sur l’idée d’une **force vitale**.

> **Correction.** Ne confonds pas **Dieu** (l’être suprême unique) et les **divinités** (génies de la nature : génie de l’eau, de la montagne…). Et la littérature africaine **existe bel et bien** — orale, mais riche.

> **Astuce mémoire de Davy.** Trois mots-clés pour cette société : **communautaire** (l’individu dans le groupe), **hiérarchisée** (âge, statut, castes, gérontocratie) et **animiste** (Dieu suprême + ancêtres + génies).`,
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
        extraQuestions: [
          { prompt: "L’éducation des enfants concerne toute la communauté dans la société négro-africaine précoloniale.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "L’individu n’y est jamais isolé.", sourceLabel: "Activité d’application 1", points: 1 },
          { prompt: "Comment appelle-t-on le pouvoir détenu par les anciens (les initiés adultes) ?", options: ["La gérontocratie", "La démocratie", "La ploutocratie", "La théocratie"], correctIndex: 0, explanation: "Les vieux détiennent la connaissance et le pouvoir.", sourceLabel: "Cours I-3-b", points: 2 },
          { prompt: "Quel rite fait passer les jeunes Sénoufo au monde adulte ?", options: ["Le Poro", "Le harrisme", "Le kimbanguisme", "Le baptême civil"], correctIndex: 0, explanation: "Une initiation par des épreuves physiques et mystiques.", sourceLabel: "Cours I-3-b", points: 2 },
          { prompt: "La production littéraire est inexistante dans l’Afrique noire précoloniale.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Il existe une riche littérature orale : contes, légendes, proverbes.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "Quelle est la religion « par excellence » de l’Afrique noire traditionnelle ?", options: ["L’animisme", "Le catholicisme", "Le protestantisme", "Le bouddhisme"], correctIndex: 0, explanation: "Elle repose sur la notion de force vitale et le culte des ancêtres.", sourceLabel: "Cours I-3-d", points: 1 },
          { prompt: "Les croyances négro-africaines reposent notamment sur l’existence d’un Dieu suprême.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Ancêtres et génies servent d’intermédiaires vers ce Dieu unique.", sourceLabel: "Activité d’application 1", points: 1 },
        ],
        distractors: ["L’éducation des enfants est uniquement individuelle.", "Les sociétés précoloniales ne produisent aucune littérature.", "Les croyances excluent toujours l’idée d’un Dieu suprême."],
      },
      {
        id: "contemporary-mutations",
        title: "Les mutations contemporaines",
        summary: "Relier école, monnaie, urbanisation, religions et colonisation aux transformations actuelles.",
        conceptTitle: "Des sociétés transformées par les contacts et la modernité",
        explanation: "École occidentale, économie monétaire, villes, christianisme, islam et colonisation modifient l’autorité des anciens, le travail, les frontières et les institutions. Apparaissent États modernes, salariat, propriété privée, nouvelles classes sociales et formes familiales renouvelées.",
        keyPoint: "La société négro-africaine contemporaine combine transformations extérieures, innovations modernes et permanences culturelles.",
        example: "L’école occidentale valorise le savoir des jeunes et ébranle la sacralisation du savoir des anciens.",
        timelineTitle: "Des facteurs aux transformations",
        timelineInstruction: "Explore les facteurs de mutation, puis la nouvelle société et ce qui résiste.",
        timeline: [
          { label: "Les facteurs des mutations", shortLabel: "Les facteurs des mutations", detail: "École occidentale, économie monétaire, urbanisation, christianisme et islam, sous l’effet de la colonisation." },
          { label: "La nouvelle société africaine", shortLabel: "La nouvelle société africaine", detail: "États modernes, salariat et marché, classes socio-professionnelles, mariage civil et nouveaux modes culturels." },
          { label: "Les permanences culturelles", shortLabel: "les permanences", detail: "Chefferies, animisme, solidarité (funérailles, mariages), polygamie et modes de succession résistent." },
        ],
        observation: "Mutation ne signifie pas disparition totale : les sociétés sélectionnent, adaptent et recomposent les apports extérieurs.",
        check: { prompt: "Quel facteur favorise directement la monétarisation de l’économie africaine ?", options: ["Les cultures d’exportation et le paiement des impôts", "La disparition de tous les échanges", "L’interdiction du travail salarié", "Le retour exclusif au troc"], correctIndex: 0, explanation: "Cultures commerciales et fiscalité coloniale diffusent l’usage de la monnaie." },
        parts: [
          {
            bodyMarkdown: String.raw`## La colonisation, cause principale

La **colonisation** est le moteur des mutations, à travers quatre grands facteurs.

## L’école

Autrefois, le savoir était l’**apanage des vieux**. L’**école occidentale** valorise le savoir des **jeunes** et impose la **prééminence du savoir occidental** : la sacralisation du savoir des anciens (désormais vus comme « ignorants ») est **ébranlée**. Mais l’école n’a **pas promu** les sources culturelles traditionnelles.

## L’économie monétaire

Elle naît avec les **cultures d’exportation**, nécessaires au **paiement de l’impôt**. L’argent **déstabilise la hiérarchie** et fait naître des **classes sociales** (riches / pauvres). La monnaie ouvre l’Afrique sur une **économie extravertie**.

## L’urbanisation et les nouvelles religions

Les populations, jadis isolées, deviennent **mobiles** ; la **ville** devient le symbole de l’**émancipation**, de la **détribalisation** et du **métissage**. Le **christianisme** apporte des valeurs nouvelles (**monogamie**, œuvres sanitaires) ; l’**islam**, par sa morale accommodante (polygamie, respect de l’aîné, solidarité), gagne de nombreux adeptes.

> **Astuce mémoire de Davy.** Quatre facteurs à retenir, tous liés à la **colonisation** : **l’école**, **la monnaie**, **la ville**, **les religions** (christianisme et islam). C’est le sigle É-M-V-R.`,
            extraQuestions: [
              { prompt: "Quelle est la cause principale des mutations de la société négro-africaine ?", options: ["La colonisation", "La sécheresse", "L’animisme", "Le troc"], correctIndex: 0, explanation: "Elle agit par l’école, la monnaie, la ville et les religions.", sourceLabel: "Cours II-1", points: 1 },
              { prompt: "Comment l’école occidentale bouleverse-t-elle la transmission du savoir ?", options: ["Elle valorise le savoir des jeunes et ébranle celui des anciens", "Elle renforce l’autorité des vieux", "Elle supprime toute connaissance", "Elle n’a aucun effet"], correctIndex: 0, explanation: "Le savoir occidental prend le pas sur le savoir traditionnel.", sourceLabel: "Cours II-1-a", points: 2 },
              { prompt: "Comment débute l’introduction de l’économie monétaire ?", options: ["Avec les cultures d’exportation, nécessaires au paiement de l’impôt", "Avec le retour au troc", "Avec l’interdiction de la monnaie", "Avec la fin du commerce"], correctIndex: 0, explanation: "L’argent fait naître des classes sociales et une économie extravertie.", sourceLabel: "Cours II-1-b", points: 2 },
              { prompt: "Que symbolise la ville dans la nouvelle société africaine ?", options: ["L’émancipation individuelle, la détribalisation et le métissage", "Le retour aux traditions", "La fin des échanges", "L’isolement des populations"], correctIndex: 0, explanation: "Le brassage ethnique, linguistique et culturel s’y développe.", sourceLabel: "Cours II-1-c", points: 2 },
            ],
          },
          {
            bodyMarkdown: String.raw`## La nouvelle société africaine

| Domaine | Mutations |
|---|---|
| **Politique** | **États modernes** aux **frontières artificielles** (source de conflits), institutions calquées sur la métropole, **multipartisme**, **affaiblissement des chefs traditionnels** |
| **Économique** | **monétarisation** (FCFA, naira), **industrie** au détriment de l’artisanat, cultures commerciales, **propriété privée** des terres, **salariat**, **économie de marché** |
| **Social** | disparition des **castes** au profit de **classes socio-professionnelles**, **mariage civil**, **émancipation de la femme**, interdiction de la **polygamie** et de l’**excision**, **famille nucléaire** |
| **Culturel** | habillement occidental, nouveaux médias, expansion du **christianisme**, **syncrétisme** (kimbanguisme, harrisme), nouvelle **langue** (celle du colonisateur) |

## Ce qui résiste : les permanences

Malgré tout, des **valeurs traditionnelles résistent** :

- l’existence des **chefferies** ;
- la pratique de l’**animisme** ;
- la **solidarité africaine** (funérailles, mariages, baptêmes) ;
- la **polygamie** et certains **modes de succession**.

> **Le point clé.** La civilisation négro-africaine actuelle n’est **ni une copie de l’Occident, ni figée** : c’est une **recomposition** — elle adopte, adapte et conserve. Ce « ni-ni » est la clé de la mission finale.

> **Astuce mémoire de Davy.** Quatre domaines de mutation (**PESC** : Politique, Économique, Social, Culturel) — mais garde en tête les **permanences** : chefferies, animisme, solidarité, polygamie. Mutation **n’est pas** disparition.`,
            extraQuestions: [
              { prompt: "Classe (activité 2) : l’« Assemblée nationale » est une mutation…", options: ["Politique", "Économique", "Sociale", "Culturelle"], correctIndex: 0, explanation: "Comme l’influence de la démocratie libérale.", sourceLabel: "Activité d’application 2", points: 1 },
              { prompt: "Classe (activité 2) : la « propriété privée » et l’« économie de marché » sont des mutations…", options: ["Économiques", "Politiques", "Sociales", "Culturelles"], correctIndex: 0, explanation: "Avec la production industrielle et la disparition du troc.", sourceLabel: "Activité d’application 2", points: 2 },
              { prompt: "Classe (activité 2) : le « syncrétisme religieux » (kimbanguisme, harrisme) est une mutation…", options: ["Culturelle", "Politique", "Économique", "Sociale"], correctIndex: 0, explanation: "Il mêle christianisme et croyances africaines.", sourceLabel: "Activité d’application 2", points: 2 },
              { prompt: "Quelle valeur traditionnelle résiste encore aux mutations ?", options: ["La solidarité africaine (funérailles, mariages, baptêmes)", "Le troc généralisé", "L’absence totale de villes", "La disparition des chefferies"], correctIndex: 0, explanation: "Chefferies, animisme et polygamie résistent aussi.", sourceLabel: "Cours II-2", points: 2 },
              { prompt: "La société négro-africaine a toujours été moderne, à l’image de l’Occident.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle avait ses propres structures ; la modernité vient des contacts et de la colonisation.", sourceLabel: "Exercice — Activité 2", points: 1 },
            ],
          },
        ],
        distractors: ["Les mutations contemporaines effacent toute permanence culturelle.", "L’urbanisation réduit toujours les brassages de population.", "Les États modernes renforcent partout sans changement l’autorité traditionnelle."],
      },
    ],
  },
] satisfies HumanitiesCourseSeed[];

export const terminalHistoryPaths = historyCourses.map(createHumanitiesPath);
