import type { HumanitiesCourseSeed } from "./humanitiesPathFactory";
import { createHumanitiesPath } from "./humanitiesPathFactory";

const geographyCourses = [
  {
    id: "terminale-hg-g1-cote-ivoire-development-foundations",
    strand: "Géographie",
    chapterNumber: 1,
    themeNumber: 1,
    themeTitle: "La Côte d’Ivoire : étude économique",
    title: "Les fondements du développement économique de la Côte d’Ivoire",
    description: "Comprendre les atouts naturels et humains du pays, puis l’évolution de sa politique économique.",
    sections: [
      {
        id: "natural-assets",
        title: "Les atouts naturels",
        summary: "Relier relief, climats, eaux et sous-sol aux activités économiques ivoiriennes.",
        conceptTitle: "Un milieu naturel riche et diversifié",
        explanation: "Le relief généralement plat facilite l’agriculture, l’installation humaine et les infrastructures. Les trois grands ensembles climatiques permettent des productions variées, tandis que le réseau hydrographique, la façade maritime et le sous-sol soutiennent l’énergie, les échanges, la pêche et les industries.",
        bodyMarkdown: String.raw`## Un milieu physique au service de l’économie

Située entre **4°30 et 10°30 de latitude nord**, la Côte d’Ivoire couvre **322 462 km²** (environ 1 % du continent africain). Son milieu naturel constitue le premier atout de son développement économique.

## Un relief plat et favorable

Le relief ivoirien est **peu accidenté** : il se caractérise par sa **monotonie** et sa **platitude générale**. On distingue trois ensembles :

- les **plaines** occupent le sud du pays ;
- les **plateaux** dominent la majeure partie du territoire ;
- les **montagnes** se situent à l’ouest.

Ce relief plat favorise l’installation des hommes, offre de grandes surfaces pour l’agriculture et facilite les aménagements (routes, autoroutes, chemin de fer).

## Trois domaines climatiques, trois agricultures

À sa situation en latitude, la Côte d’Ivoire doit un climat chaud et humide. Les nuances de pluviométrie dessinent **trois zones climatiques**, chacune liée à des sols, une végétation et des productions particulières.

| Domaine climatique | Localisation | Pluies (mm/an) | Sols et végétation | Productions |
|---|---|---|---|---|
| Subéquatorial (attiéen) | Sud et ouest montagneux | 1500 à 2300 | Sols ferralitiques fertiles, forêt dense (acajou, iroko, bété, makoré, sipo) | Cacao, café, hévéa, palmier à huile, ananas, banane ; vivriers |
| Tropical humide (baouléen) | Centre | 1100 à 1500 | Sols moins fertiles, savanes arborées et forêts claires | Café, hévéa, teck ; vivriers ; élevage (bovins, ovins, caprins, porcins) |
| Soudanais | Nord | ≤ 1000 | Sols ferrugineux cuirassés, savane arbustive | Anacarde, coton, canne à sucre, mangue, karité ; élevage ; écotourisme (parcs) |

> **Astuce mémoire de Davy.** Du **sud vers le nord**, les pluies **diminuent** et la forêt cède la place à la savane : « plus on monte vers le nord, moins il pleut ». Retiens un couple climat → culture-phare : subéquatorial → **cacao**, soudanais → **anacarde/coton**.

## Un réseau hydrographique dense

Les ressources en eau sont importantes : **quatre grands fleuves**, des fleuves côtiers, des affluents du Volta et du Niger, et un **système lagunaire** sur la côte Est. Le pays compte **6 lacs de barrages hydroélectriques** :

| Barrage | Fleuve |
|---|---|
| Taabo, Kossou | Bandama |
| Buyo, Soubré | Sassandra |
| Ayamé 1 et 2 | Bia |

Les réserves souterraines atteignent **87,6 milliards de m³** (dont 37,7 renouvelables). Avec **520 km de côte** et deux grands ports (**Abidjan**, **San-Pédro**), le littoral ouvre le pays sur le monde et permet pêche, tourisme balnéaire et échanges.

## Un sous-sol riche mais sous-exploité

Le sous-sol regorge de ressources **minières** et **énergétiques** encore insuffisamment exploitées.

| Ressource | Principaux gisements |
|---|---|
| Or | Ity, Tongon, Bonikro, Aboisso, Toumodi, Bouaflé |
| Nickel | Sipilou, Biankouma, Touba, Odienné |
| Diamant | Séguéla, Tortiya, Man |
| Manganèse | Grand-Lahou, Odienné, Bondoukou |
| Fer | Man, San-Pédro |
| Bauxite / aluminium | Divo, Bongouanou, Toumodi, Sinfra |

Sur le littoral, des gisements de **pétrole et de gaz naturel** sont exploités au large de **Jacqueville**. Le gaz alimente les centrales thermiques d’**Azito** et de **Vridi** : en 2019, la Côte d’Ivoire a produit **2230 mégawatts**, dont 75 % assurés par Azito (35 %) et Ciprel (40 %).

> **À retenir.** Le pétrole et le gaz sont des ressources **énergétiques**, pas minières : c’est un piège fréquent. L’or, le nickel ou le diamant, eux, sont des ressources **minières**.`,
        keyPoint: "Les ressources naturelles deviennent des atouts lorsqu’elles sont aménagées et mises au service des activités économiques.",
        example: "Les ports d’Abidjan et de San-Pédro ouvrent le pays sur le commerce mondial ; les barrages de Taabo, Kossou, Buyo, Soubré et Ayamé produisent de l’hydroélectricité.",
        timelineTitle: "Explorer les grandes familles d’atouts",
        timelineInstruction: "Déplace le curseur pour passer du relief aux climats, puis aux ressources en eau et du sous-sol.",
        timeline: [
          { label: "Relief", detail: "Plaines au sud, plateaux dominants et montagnes à l’ouest : un ensemble globalement favorable aux aménagements." },
          { label: "Climats et végétation", shortLabel: "Climats", detail: "Les domaines subéquatorial, tropical humide et soudanais expliquent la diversité des cultures et des paysages." },
          { label: "Eaux, littoral et sous-sol", shortLabel: "Ressources", detail: "Fleuves, lagunes, océan, minerais, pétrole et gaz soutiennent transport, énergie, pêche et industrie." },
        ],
        observation: "Un même atout peut soutenir plusieurs secteurs : l’eau sert à l’irrigation, à la pêche, au transport et à l’électricité.",
        check: { prompt: "Quel caractère du relief ivoirien facilite particulièrement les aménagements ?", options: ["Son altitude très élevée", "Sa platitude générale", "Son caractère désertique", "Son instabilité volcanique"], correctIndex: 1, explanation: "Le relief ivoirien est peu accidenté et globalement plat." },
        extraQuestions: [
          { prompt: "« Système lagunaire » est un atout…", options: ["naturel", "humain"], correctIndex: 0, explanation: "Le système lagunaire fait partie du milieu physique : c’est un atout naturel.", sourceLabel: "Activité d’application n°1", points: 1 },
          { prompt: "En Côte d’Ivoire, le climat dominant est de type…", options: ["tropical", "polaire", "désertique", "tempéré"], correctIndex: 0, explanation: "Le pays connaît un climat chaud et humide de type tropical, avec des nuances du sud au nord.", sourceLabel: "Exercice 2", points: 1 },
          { prompt: "L’or est une ressource…", options: ["minière", "énergétique", "agricole", "halieutique"], correctIndex: 0, explanation: "L’or fait partie des ressources minières du sous-sol ivoirien.", sourceLabel: "Exercice 2", points: 1 },
          { prompt: "Le climat subéquatorial (attiéen) se rencontre notamment à…", options: ["Danané (ouest)", "Bouaké (centre)", "Touba (nord-ouest)", "Odienné (nord)"], correctIndex: 0, explanation: "Le subéquatorial couvre le sud et l’ouest montagneux (Danané). Bouaké relève du baouléen, Touba et Odienné du soudanais.", sourceLabel: "Exercice 2", points: 2 },
          { prompt: "Le pétrole et le gaz naturel sont des ressources minières de la Côte d’Ivoire.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Ce sont des ressources énergétiques, et non minières.", sourceLabel: "Exercice 3", points: 2 },
          { prompt: "Le réseau hydrographique ivoirien comprend aussi des lacs.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Il compte notamment 6 lacs de barrages hydroélectriques (Taabo, Kossou, Buyo, Soubré, Ayamé 1 et 2).", sourceLabel: "Exercice 3", points: 1 },
          { prompt: "La monotonie du relief signifie que la Côte d’Ivoire a un sous-sol riche.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "La monotonie décrit la platitude du relief ; elle ne dit rien du sous-sol.", sourceLabel: "Exercice 3", points: 1 },
        ],
        distractors: ["Le développement ivoirien repose uniquement sur les ressources minières.", "Le climat soudanais couvre tout le territoire ivoirien.", "La façade maritime n’a aucun rôle économique."],
      },
      {
        id: "human-assets",
        title: "Les atouts humains",
        summary: "Expliquer comment une population jeune alimente travail, consommation et entrepreneuriat.",
        conceptTitle: "Une population nombreuse, jeune et dynamique",
        explanation: "La croissance de la population ivoirienne élargit le marché intérieur et fournit une main-d’œuvre abondante. La jeunesse représente un potentiel de renouvellement et d’entrepreneuriat, même si elle accroît aussi les besoins de scolarisation, d’emploi, de santé et de logement.",
        bodyMarkdown: String.raw`## Une population nombreuse et en forte croissance

La population ivoirienne a été multipliée par près de **sept** depuis l’indépendance.

| Année | Population |
|---|---|
| 1960 | 3,8 millions |
| 2014 (RGPH) | 22,7 millions |
| 2020 (estimation) | plus de 26 millions |

Cette croissance, **enrichie par l’apport étranger**, procure au pays un vaste **marché de consommation** et une **main-d’œuvre abondante et bon marché**, facteur qui stimule l’investissement.

## Une population jeune et diverse

La structure par âge révèle une population **très jeune** : les **moins de 15 ans représentent environ 45 %** des habitants. Cette jeunesse est un atout — renouvellement, dynamisme, esprit d’entreprise — mais aussi un défi, car elle accroît les besoins de **scolarisation, d’emploi, de santé et de logement**.

La population se compose enfin d’une **grande variété de groupes ethniques**, source de **diversité culturelle** et donc de **richesse touristique**.

> **Astuce mémoire de Davy.** La jeunesse ivoirienne est à **double tranchant** : c’est une **main-d’œuvre** et un **marché** (atout), mais aussi une **charge** en services publics (défi). À l’examen, présente toujours les **deux faces** pour une réponse nuancée. Aujourd’hui, encouragés par l’État, les jeunes diplômés se regroupent pour créer des **PME et des PMI**.`,
        keyPoint: "La population est un moteur économique si la formation et l’emploi transforment son dynamisme en capital humain.",
        example: "Les moins de 15 ans représentent environ 45 % de la population mentionnée dans le cours ; cette jeunesse est à la fois une ressource et un défi social.",
        timelineTitle: "Observer la croissance démographique",
        timelineInstruction: "Parcours trois repères donnés par le cours pour mesurer l’augmentation de la population.",
        timeline: [
          { label: "1960", detail: "Environ 3,8 millions d’habitants au moment de l’indépendance." },
          { label: "2014", detail: "Le RGPH recense environ 22,7 millions d’habitants." },
          { label: "2020", detail: "La population est estimée à plus de 26 millions d’habitants." },
        ],
        observation: "L’augmentation de la population agrandit le marché, mais oblige aussi l’État à développer les services sociaux et les emplois.",
        check: { prompt: "Pourquoi une population jeune peut-elle favoriser le développement ?", options: ["Elle supprime automatiquement le chômage", "Elle fournit une main-d’œuvre et un marché de consommation", "Elle réduit tous les besoins sociaux", "Elle remplace les ressources naturelles"], correctIndex: 1, explanation: "La jeunesse peut fournir travail, consommation et initiative économique lorsqu’elle est formée." },
        extraQuestions: [
          { prompt: "« Population dynamique » est un atout…", options: ["humain", "naturel"], correctIndex: 0, explanation: "Le dynamisme de la population relève des atouts humains.", sourceLabel: "Activité d’application n°1", points: 1 },
          { prompt: "« Main-d’œuvre bon marché » est un atout…", options: ["humain", "naturel"], correctIndex: 0, explanation: "Elle stimule l’investissement : c’est un atout humain.", sourceLabel: "Activité d’application n°1", points: 1 },
          { prompt: "« Diversité ethnique » est un atout…", options: ["humain", "naturel"], correctIndex: 0, explanation: "La variété des groupes ethniques nourrit la diversité culturelle et touristique : atout humain.", sourceLabel: "Activité d’application n°1", points: 1 },
          { prompt: "Les moins de 15 ans représentent environ 45 % de la population ivoirienne.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "La structure par âge indique bien une population très jeune.", sourceLabel: "Exercice 3", points: 1 },
          { prompt: "En quelle année la population ivoirienne était-elle estimée à environ 3,8 millions d’habitants ?", options: ["1960", "1980", "2014", "2020"], correctIndex: 0, explanation: "3,8 millions en 1960 (indépendance), contre plus de 26 millions en 2020.", sourceLabel: "Introduction / Exercice 1", points: 1 },
          { prompt: "Pourquoi la jeunesse ivoirienne est-elle aussi un défi pour l’État ?", options: ["Elle accroît les besoins de scolarisation, d’emploi et de logement", "Elle fait disparaître le marché intérieur", "Elle supprime la main-d’œuvre disponible", "Elle réduit la diversité culturelle"], correctIndex: 0, explanation: "La jeunesse est une charge en services publics autant qu’une ressource.", sourceLabel: "I-2", points: 2 },
        ],
        distractors: ["La croissance démographique ne crée aucun besoin nouveau.", "La population ivoirienne a diminué depuis 1960.", "Le capital humain dépend seulement du nombre d’habitants."],
      },
      {
        id: "economic-policy",
        title: "Les fondements historiques et politiques",
        summary: "Distinguer capitalisme d’État, ajustement structurel, privatisation et rôle d’arbitre de l’État.",
        conceptTitle: "Une politique libérale qui évolue avec les crises",
        explanation: "Après 1960, la Côte d’Ivoire choisit le libéralisme avec une forte intervention publique et des plans de développement. La crise des années 1980 conduit aux programmes d’ajustement structurel, puis la privatisation et le désengagement de l’État renforcent le rôle du secteur privé.",
        keyPoint: "La politique économique ivoirienne combine ouverture extérieure, initiative privée et adaptation du rôle de l’État.",
        example: "L’État a d’abord été entrepreneur dans de nombreuses sociétés, puis il s’est recentré sur la régulation, les infrastructures et les services sociaux de base.",
        timelineTitle: "Suivre l’évolution de la politique économique",
        timelineInstruction: "Fais défiler les trois moments qui structurent l’évolution présentée dans le cours.",
        timeline: [
          { label: "À partir de 1960", shortLabel: "1960", detail: "Libéralisme, plans de développement et forte intervention de l’État : un capitalisme dirigé." },
          { label: "À partir de 1981", shortLabel: "1981", detail: "Adoption de programmes d’ajustement structurel avec le FMI et la Banque mondiale." },
          { label: "À partir de 1990", shortLabel: "1990", detail: "Privatisation, désengagement de l’État et rôle croissant du secteur privé." },
        ],
        observation: "Le choix libéral reste constant, mais la place concrète de l’État change selon le contexte économique.",
        check: { prompt: "Quel choix économique la Côte d’Ivoire fait-elle dès 1960 ?", options: ["L’autarcie", "Le libéralisme économique", "La suppression du secteur privé", "La collectivisation intégrale"], correctIndex: 1, explanation: "Le cours présente le libéralisme économique comme le choix effectué dès l’indépendance." },
        distractors: ["L’État cesse toute intervention économique dès 1960.", "Les programmes d’ajustement structurel commencent avant l’indépendance.", "La privatisation signifie la disparition des infrastructures publiques."],
        parts: [
          {
            summary: "Comprendre le libéralisme dirigé choisi dès 1960 : intervention de l’État, libre entreprise et ouverture.",
            bodyMarkdown: String.raw`## Un choix : le libéralisme économique (dès 1960)

Dès l’indépendance, la Côte d’Ivoire fait le choix du **libéralisme économique**. Mais c’est un libéralisme **dirigé** par l’État, qui repose sur trois piliers.

## 1. Une forte intervention de l’État

L’État **planifie** l’économie : il choisit les secteurs à développer et oriente les investisseurs par des **lois-plans**.

| Type de plan | Durée | Exemples |
|---|---|---|
| Plans décennaux | 10 ans | 1960-1970 ; 1970-1980 |
| Plans quinquennaux | 5 ans | 1971-1975 ; 1976-1980 ; 1981-1986 |

C’est un **capitalisme d’État** (ou capitalisme dirigé) : l’État est lui-même **entrepreneur** (SOTRA, SIR, PALMINDUSTRIE, SODESUCRE, SODEMI, CAISTAB…).

## 2. La libre entreprise

L’État encourage l’**initiative privée**, nationale et surtout étrangère, par des mesures attractives :

- exonérations et **allègements fiscaux** ;
- un **code des investissements souple** ;
- la **liberté de transfert des fonds** vers l’extérieur ;
- l’**engagement à ne jamais nationaliser** les entreprises.

## 3. L’ouverture sur l’extérieur

Cette ouverture attire les **capitaux** et la **main-d’œuvre qualifiée** étrangers, et ouvre les produits ivoiriens aux **meilleurs marchés mondiaux**.

> **À retenir.** Ce choix a permis, entre **1960 et 1980**, de bâtir des infrastructures, de développer l’agriculture et de diversifier l’industrie. Mais la **crise des années 1980** obligera l’État à réformer sa politique.`,
            extraQuestions: [
              { prompt: "La politique économique de la Côte d’Ivoire est le libéralisme.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Le pays a choisi le libéralisme économique dès 1960.", sourceLabel: "Activité d’application n°2", points: 1 },
              { prompt: "Dès 1960, le libéralisme ivoirien s’accompagne d’une forte intervention de l’État.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "C’est un capitalisme dirigé : l’État planifie et est lui-même entrepreneur.", sourceLabel: "Activité d’application n°2", points: 2 },
              { prompt: "Le système économique ivoirien repose sur le capitalisme.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Il s’agit d’un capitalisme d’État, puis de plus en plus libéral.", sourceLabel: "Exercice 3", points: 1 },
              { prompt: "L’ouverture sur l’extérieur sert seulement à attirer la main-d’œuvre étrangère.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle attire aussi les capitaux et ouvre les produits ivoiriens aux marchés mondiaux.", sourceLabel: "Activité d’application n°2", points: 2 },
              { prompt: "Quelle mesure ne fait pas partie de la libre entreprise encouragée par l’État ?", options: ["La nationalisation des entreprises privées", "L’allègement fiscal", "Un code des investissements souple", "La liberté de transfert des fonds"], correctIndex: 0, explanation: "Au contraire, l’État s’engage à ne jamais nationaliser.", sourceLabel: "II-1", points: 2 },
            ],
          },
          {
            summary: "Relier les réformes libérales : PAS de 1981, privatisation de 1990 et nouveau rôle d’arbitre de l’État.",
            bodyMarkdown: String.raw`## Réformer face à la crise (à partir de 1981)

La crise des années 1980 conduit l’État à **réorienter** sa politique économique en deux temps.

## 1. Les programmes d’ajustement structurel — PAS (1981)

Dès **1981**, la Côte d’Ivoire signe des **PAS** avec le **FMI** et la **Banque mondiale** pour créer les conditions d’une relance et d’une croissance « saine et durable ».

> **Nuance importante.** Les PAS n’ont **pas** produit immédiatement la croissance espérée : ils fixent des conditions, souvent au prix d’un effort social important. Ne réponds jamais qu’ils ont « aussitôt » assaini l’économie.

## 2. La privatisation et le désengagement de l’État (1990)

Le programme de **privatisation** commence en **1990** : il concerne les entreprises où l’État détient une part importante du capital. Ses objectifs :

- accroître la **participation du secteur privé** au financement de l’économie ;
- **susciter davantage d’investissements** ;
- permettre à un nombre croissant d’**Ivoiriens** de prendre part au développement ;
- financer les **programmes d’investissement public**.

## Un État désormais arbitre

L’État **se désengage** de la production et se recentre sur ses missions : il organise l’espace économique, garantit la **libre concurrence**, mobilise les capitaux (trésor public, emprunt obligataire) et attire les investisseurs via le **CEPICI**. Il joue le rôle d’**arbitre** entre les acteurs et finance les secteurs régaliens (routes, écoles, hôpitaux) grâce à une fiscalité souple.`,
            extraQuestions: [
              { prompt: "La Côte d’Ivoire a signé des programmes d’ajustement structurel (PAS) avec le FMI et la Banque mondiale.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Ces PAS sont signés à partir de 1981 pour relancer l’économie.", sourceLabel: "Activité d’application n°2", points: 1 },
              { prompt: "Dès leur adoption, les PAS ont assuré à la Côte d’Ivoire une croissance saine et durable.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Ils visaient à créer les conditions de la relance, sans résultat immédiat.", sourceLabel: "Activité d’application n°2", points: 2 },
              { prompt: "En quelle année débute le programme de privatisation ?", options: ["1990", "1960", "1981", "2000"], correctIndex: 0, explanation: "La privatisation commence en 1990 et concerne les entreprises à forte participation de l’État.", sourceLabel: "Exercice 3", points: 1 },
              { prompt: "Un objectif de la privatisation est de permettre aux Ivoiriens de participer activement au développement.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "C’est l’un des quatre objectifs affichés du programme.", sourceLabel: "Activité d’application n°2", points: 1 },
              { prompt: "Désormais, quel rôle l’État joue-t-il principalement dans l’économie ?", options: ["Un rôle d’arbitre entre les acteurs économiques", "Le rôle d’unique entrepreneur du pays", "Aucun rôle économique", "Le rôle de seul importateur"], correctIndex: 0, explanation: "L’État régule, mobilise les capitaux (CEPICI) et arbitre entre les acteurs.", sourceLabel: "Activité d’application n°2", points: 2 },
              { prompt: "L’impôt est la seule source de financement des secteurs régaliens de l’État.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "L’État mobilise aussi d’autres ressources (emprunt obligataire, trésor public, investisseurs).", sourceLabel: "Activité d’application n°2", points: 1 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "terminale-hg-g2-cote-ivoire-economic-sectors",
    strand: "Géographie",
    chapterNumber: 2,
    themeNumber: 1,
    themeTitle: "La Côte d’Ivoire : étude économique",
    title: "Les secteurs d’activités économiques de la Côte d’Ivoire",
    description: "Caractériser les secteurs primaire, secondaire et tertiaire et mesurer leur complémentarité.",
    sections: [
      {
        id: "primary-sector",
        title: "Un secteur primaire prépondérant",
        summary: "Identifier agriculture, élevage, pêche et exploitation forestière selon les régions.",
        conceptTitle: "Le primaire fournit les matières premières",
        explanation: "Le secteur primaire regroupe les activités qui exploitent directement les ressources naturelles. En Côte d’Ivoire, il est dominé par l’agriculture, mais comprend aussi l’élevage, la pêche et l’exploitation forestière.",
        keyPoint: "Le secteur primaire reste central parce qu’il emploie une grande partie de la population et alimente les exportations ainsi que l’agro-industrie.",
        example: "La région forestière du sud produit notamment cacao, café, hévéa et palmier à huile, tandis que le nord développe coton, anacarde, céréales et élevage.",
        timelineTitle: "Distinguer les activités du primaire",
        timelineInstruction: "Passe de l’agriculture aux productions animales et halieutiques, puis à la forêt.",
        timeline: [
          { label: "L’agriculture ivoirienne", shortLabel: "Agriculture", detail: "Cultures vivrières et cultures d’exportation se répartissent selon les milieux du sud forestier au nord soudanais." },
          { label: "L’élevage et la pêche", shortLabel: "Élevage, pêche", detail: "Les productions animales et halieutiques progressent, mais ne couvrent pas encore tous les besoins nationaux." },
          { label: "L’exploitation forestière", shortLabel: "forêt", detail: "Le bois alimente scieries et exportations, tandis que la diminution du couvert forestier impose une gestion durable." },
        ],
        observation: "Les productions varient selon le climat, les sols, la végétation et les équipements disponibles.",
        check: { prompt: "Quelle activité domine le secteur primaire ivoirien ?", options: ["L’aéronautique", "L’agriculture", "La banque", "Les télécommunications"], correctIndex: 1, explanation: "Le cours présente l’agriculture comme le pilier du secteur primaire." },
        distractors: ["Le primaire regroupe uniquement les services marchands.", "Toutes les régions ivoiriennes ont les mêmes productions.", "Le secteur primaire ne fournit aucune matière première aux industries."],
        parts: [
          {
            summary: "Expliquer la diversité, la répartition et le poids économique de l’agriculture ivoirienne.",
            bodyMarkdown: String.raw`## L’agriculture, pilier du secteur primaire

Le **secteur primaire** rassemble les activités qui prélèvent ou produisent directement des ressources naturelles : agriculture, élevage, pêche et exploitation forestière. En Côte d’Ivoire, l’**agriculture** occupe une place dominante.

## Des conditions généralement favorables

Plusieurs facteurs se combinent :

- un relief globalement **plat**, qui facilite les travaux et les transports ;
- des climats chauds, des pluies et des sols variés ;
- une main-d’œuvre abondante et un marché intérieur important ;
- la recherche agronomique, la sélection des plants et l’appui des structures d’encadrement ;
- des moyens de transport et de commercialisation qui relient les bassins de production aux villes et aux ports.

Ces avantages ne rendent pas toutes les régions identiques : les cultures suivent les nuances du milieu.

| Grand espace | Productions caractéristiques citées dans le document |
|---|---|
| Sud forestier | Cacao, café, hévéa, palmier à huile, banane, ananas, noix de coco et vivriers |
| Centre et zone de transition | Vivriers, café, hévéa et productions adaptées à une pluviométrie plus faible |
| Nord soudanais | Coton, anacarde, mangue, karité, maïs, riz, arachide, soja, mil, sorgho et haricot |

> **Astuce mémoire de Davy.** **Forêt au sud = cultures arborées** ; **savane au nord = coton, anacarde, céréales et élevage**.

## Deux grandes familles de cultures

Les **cultures vivrières** servent d’abord à nourrir la population et alimentent surtout le marché intérieur : igname, manioc, banane plantain, riz, maïs, mil, sorgho, légumes ou fruits.

Les **cultures d’exportation ou industrielles** alimentent le commerce extérieur et les usines de transformation : cacao, café, coton, hévéa, palmier à huile, anacarde, canne à sucre, banane dessert ou ananas.

Une culture n’est toutefois pas enfermée dans une seule fonction : une partie d’une production peut être consommée localement, transformée ou exportée.

## Un poids économique majeur

Le document s’appuie sur des données datées de **2015 à 2018**. Il attribue alors à l’agriculture environ **66 % de la population active** et près de **70 % des recettes d’exportation**. Il souligne aussi le rang mondial du pays pour le cacao, ainsi que le rôle important de l’anacarde, du caoutchouc naturel, de la banane et du café.

Ces chiffres servent à comprendre la structure de l’économie au moment étudié ; ils ne doivent pas être présentés comme des statistiques actuelles sans nouvelle source.

> **Correction de source.** Le document affiche **1 230 000 tonnes de café** tout en classant la Côte d’Ivoire au **15e rang mondial** en 2018. Ces deux indications sont incompatibles. On retient ici le rang et le rôle économique du café, pas ce volume manifestement erroné.

L’agriculture fournit enfin des matières premières à l’industrie, des emplois, des revenus aux producteurs et des devises grâce aux exportations. Elle relie donc directement le **primaire**, le **secondaire** et le **tertiaire**.`,
            check: {
              prompt: "Quelles sont les deux grandes familles de cultures présentées dans le cours ?",
              options: ["Les cultures vivrières et les cultures d’exportation ou industrielles", "Les cultures urbaines et maritimes", "Les cultures minières et énergétiques", "Les cultures artisanales et bancaires"],
              correctIndex: 0,
              explanation: "Le cours distingue les productions vivrières, surtout destinées à l’alimentation, et les cultures d’exportation ou industrielles.",
            },
            extraQuestions: [
              { prompt: "Le relief généralement plat de la Côte d’Ivoire constitue un facteur favorable à l’agriculture.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Il facilite les travaux agricoles, l’installation des exploitations et les transports.", sourceLabel: "I-A-1", points: 1 },
              { prompt: "Toutes les régions ivoiriennes produisent exactement les mêmes cultures.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Les productions varient selon le climat, les sols, la végétation et les équipements.", sourceLabel: "I-A-1", points: 1 },
              { prompt: "Quelle association géographique est correcte ?", options: ["Sud forestier : cacao et hévéa", "Nord soudanais : cocotier dominant", "Sud forestier : coton dominant", "Nord soudanais : forêt dense sempervirente"], correctIndex: 0, explanation: "Les cultures arborées comme le cacao et l’hévéa caractérisent surtout le sud forestier.", sourceLabel: "I-A-1", points: 2 },
              { prompt: "Laquelle de ces productions est principalement classée parmi les cultures vivrières ?", options: ["L’igname", "L’hévéa", "Le coton", "Le cacao"], correctIndex: 0, explanation: "L’igname nourrit principalement le marché intérieur ; les autres sont surtout des cultures d’exportation ou industrielles.", sourceLabel: "I-A-1", points: 1 },
              { prompt: "Pourquoi l’agriculture soutient-elle aussi le secteur secondaire ?", options: ["Elle fournit des matières premières aux usines", "Elle supprime les transports", "Elle remplace tous les services", "Elle interdit les exportations"], correctIndex: 0, explanation: "Cacao, coton, hévéa ou palmier à huile peuvent être transformés par l’industrie.", sourceLabel: "I-A-2", points: 2 },
              { prompt: "Les parts de population active et de recettes d’exportation données par le document doivent être comprises comme…", options: ["des indicateurs historiques datés de 2015 à 2018", "des valeurs garanties pour toutes les années futures", "des prévisions pour 2050", "des chiffres sans lien avec l’agriculture"], correctIndex: 0, explanation: "Le cours utilise des statistiques anciennes : elles éclairent la période étudiée, mais ne constituent pas des données actuelles.", sourceLabel: "I-A-2", points: 2 },
              { prompt: "Pourquoi le volume de café affiché dans le PDF ne doit-il pas être mémorisé ?", options: ["Il contredit le rang mondial donné dans le même passage", "Le café ne pousse pas en Côte d’Ivoire", "Le document ne cite jamais le café", "Il s’agit d’une donnée sur le coton"], correctIndex: 0, explanation: "Le volume de 1 230 000 tonnes est incompatible avec le 15e rang indiqué : le document comporte une coquille.", sourceLabel: "Correction de source", points: 2 },
              { prompt: "Quel enchaînement décrit le mieux le rôle économique de l’agriculture ?", options: ["Production → transformation → transport et vente", "Transport → disparition des cultures → importation", "Banque → extraction minière → pêche", "Tourisme → élections → industrie lourde"], correctIndex: 0, explanation: "La production primaire alimente l’industrie, puis les services assurent transport et commercialisation.", sourceLabel: "Synthèse", points: 2 },
            ],
          },
          {
            summary: "Comparer élevage, pêche et forêt, puis expliquer leurs apports et leurs fragilités.",
            bodyMarkdown: String.raw`## L’élevage : surtout au nord, sous deux formes

Le nord et le centre-nord offrent des conditions favorables à l’élevage : espaces de savane, pâturages et savoir-faire des populations. On distingue :

- l’**élevage traditionnel**, souvent extensif et familial ;
- l’**élevage moderne**, mieux encadré, qui utilise des races sélectionnées, des soins vétérinaires et des aliments contrôlés.

Les principales productions concernent les **bovins**, les **ovins**, les **caprins**, les **porcins** et la **volaille**. Malgré les progrès, la production nationale reste insuffisante pour couvrir toute la consommation.

## La pêche : artisanale et industrielle

La Côte d’Ivoire dispose d’un golfe, d’un littoral, de lagunes, de fleuves, de lacs et de ports. Deux formes de pêche coexistent :

| Forme | Caractéristiques |
|---|---|
| Pêche artisanale | Pratiquée près des côtes, en lagune et dans les eaux continentales, avec de petites embarcations |
| Pêche industrielle | Réalisée avec des navires équipés, surtout à partir des ports d’Abidjan et de San-Pédro |

Le cours donne pour **2019** une production totale de **101 000 tonnes**, composée de **59 590 tonnes** de pêche artisanale et de **41 410 tonnes** de pêche industrielle. Même avec cette production, le pays recourt aux importations pour satisfaire la demande.

> **Correction / précision.** La situation d’évaluation du même PDF utilise un autre total pour 2019 : **52 000 tonnes**, présentées comme 30 % des besoins. Ces valeurs sont incompatibles. On emploiera **52 000 tonnes uniquement comme donnée de la mission**, sans la confondre avec le total du cours.

## La forêt : ressource et patrimoine à protéger

Le bois alimente des scieries installées notamment à **Abidjan, Agboville, Daloa, Gagnoa, Man** et **San-Pédro**. Les essences citées — acajou, iroko, sipo ou samba — sont transformées en sciages, placages et contreplaqués, puis vendues localement ou exportées.

Cette exploitation procure emplois, matières premières et recettes, mais la surexploitation agricole et forestière a fortement réduit le couvert forestier. L’exercice du document compare environ **16 millions d’hectares en 1960** à **moins de 3 millions d’hectares** au moment de sa rédaction.

Les réponses attendues combinent :

1. le respect des forêts classées et des aires protégées ;
2. la lutte contre les coupes illégales et les feux ;
3. le **reboisement** et l’agroforesterie ;
4. une transformation du bois plus efficace, qui limite les pertes.

> **À retenir.** Produire davantage ne suffit pas : élevage, pêche et forêt doivent aussi préserver la ressource pour rester durables.`,
            extraQuestions: [
              { prompt: "Les conditions de l’élevage sont également favorables sur toute l’étendue du territoire ivoirien.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Le nord et le centre-nord sont particulièrement favorables grâce aux savanes et aux pâturages.", sourceLabel: "Activité d’application n°1", points: 1 },
              { prompt: "L’élevage et la pêche demeurent encore largement pratiqués de manière traditionnelle.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Des formes modernes existent, mais les pratiques traditionnelles restent importantes.", sourceLabel: "Activité d’application n°1", points: 1 },
              { prompt: "La pêche industrielle se pratique traditionnellement en haute mer.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "La pêche industrielle utilise des navires équipés ; le mot « traditionnellement » rend la proposition fausse.", sourceLabel: "Activité d’application n°1", points: 2 },
              { prompt: "Les productions animales ivoiriennes suffisent à couvrir tous les besoins nationaux.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Le cours insiste au contraire sur une production encore insuffisante.", sourceLabel: "Exercice 1", points: 1 },
              { prompt: "La Côte d’Ivoire est-elle présentée comme un grand pays de pêche ?", options: ["Non, malgré des milieux aquatiques variés", "Oui, et elle n’importe aucun poisson", "Oui, uniquement grâce aux lacs", "Le pays ne possède aucune façade maritime"], correctIndex: 0, explanation: "La pêche existe sous plusieurs formes, mais sa production ne satisfait pas la forte consommation.", sourceLabel: "Exercice 1", points: 2 },
              { prompt: "Quel port est associé à la pêche industrielle dans le cours ?", options: ["Abidjan", "Korhogo", "Bondoukou", "Ferkessédougou"], correctIndex: 0, explanation: "Abidjan, avec San-Pédro, accueille les activités de pêche industrielle.", sourceLabel: "I-C", points: 1 },
              { prompt: "La forêt ivoirienne est en progression continue depuis 1960.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Le document décrit au contraire un recul très important du couvert forestier.", sourceLabel: "Activité d’application n°1", points: 1 },
              { prompt: "L’exploitation abusive de la forêt a contribué à sa dégradation avancée.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Les coupes excessives et l’extension agricole figurent parmi les causes majeures du recul forestier.", sourceLabel: "Activité d’application n°1", points: 1 },
              { prompt: "Quelle réponse associe production et protection de la forêt ?", options: ["Reboiser et contrôler les coupes", "Supprimer toutes les aires protégées", "Multiplier les feux de brousse", "Exporter les grumes sans contrôle"], correctIndex: 0, explanation: "Le reboisement, le contrôle et l’agroforesterie rendent l’exploitation plus durable.", sourceLabel: "Situation d’évaluation n°2", points: 2 },
              { prompt: "Comment faut-il utiliser les deux chiffres de pêche de 2019 présents dans le PDF ?", options: ["Distinguer le total du cours et la donnée conventionnelle de la mission", "Les additionner pour créer un troisième total", "Considérer les deux comme strictement identiques", "Supprimer toute référence à la pêche"], correctIndex: 0, explanation: "Le document se contredit : 52 000 tonnes ne vaut que dans le cadre du calcul demandé par la mission.", sourceLabel: "Correction de source", points: 2 },
            ],
          },
        ],
      },
      {
        id: "secondary-sector",
        title: "Un secteur secondaire en essor",
        summary: "Comprendre les phases, les types et les foyers de l’industrialisation ivoirienne.",
        conceptTitle: "Transformer localement pour créer plus de valeur",
        explanation: "Le secteur secondaire transforme les matières premières. L’industrie ivoirienne s’appuie surtout sur l’agroalimentaire, le textile, le bois, l’énergie, les matériaux de construction et les premières transformations minières.",
        bodyMarkdown: String.raw`## Quatre phases d’industrialisation

L’industrialisation ivoirienne ne suit pas une progression régulière. Le document distingue **quatre phases** :

| Période | Orientation dominante | Idée essentielle |
|---|---|---|
| 1960-1970 | Import-substitution | Produire sur place une partie des biens auparavant importés |
| 1970-1980 | Régionalisation industrielle | Diversifier les activités et implanter des unités hors du seul pôle abidjanais |
| 1980-1994 | Stagnation | Les crises économiques freinent l’investissement et la production |
| Depuis 1994 | Reprise et diversification | Relance des investissements et multiplication des branches industrielles |

> **Précision chronologique.** La dévaluation du franc CFA intervient en **janvier 1994**. Elle marque la charnière entre la phase de stagnation et la reprise ; elle ne s’étend pas sur toute la période 1980-1994 comme pourrait le laisser croire la formulation du PDF.

## Des industries variées, dominées par l’agro-industrie

Le tissu industriel comprend :

- les **industries agroalimentaires** : brasseries, huileries, sucreries, conserveries de poisson, transformation du cacao ou de l’anacarde ;
- les industries **textiles et du bois** : filature, tissage, confection, sacherie, sciage et placage ;
- les industries **chimiques, métallurgiques et du bâtiment** : engrais, produits phytosanitaires, peinture, métallurgie, ciment et matériaux ;
- les industries **extractives** : exploitation et première transformation des ressources minières et énergétiques.

L’industrie est surtout **légère**, fortement liée aux produits agricoles et inégalement répartie.

## Des foyers industriels très concentrés

| Espace | Centres cités |
|---|---|
| Sud lagunaire et Sud-Comoé | Abidjan, Grand-Bassam, Bonoua |
| Centre | Yamoussoukro, Bouaké |
| Nord | Korhogo |
| Sud-Ouest | San-Pédro |

Selon le document, environ **70 %** des industries se concentrent dans le district d’**Abidjan**. Cette concentration offre un grand marché, un port, de l’énergie, des capitaux et des services, mais elle renforce les déséquilibres territoriaux.

## Transformer pour créer emplois et valeur ajoutée

Le document, fondé sur des indicateurs de **2014 à 2018**, attribue au secondaire environ **14 % de la population active** et une valeur ajoutée équivalant à **30,8 % du PIB**. Ces ordres de grandeur sont datés : ils servent à analyser la période du cours, pas à décrire automatiquement la situation actuelle.

La transformation locale évite d’exporter uniquement une matière brute. Le document donne plusieurs exemples :

- **35 % du cacao** était transformé localement en 2015 ;
- environ la moitié du **coton-graine** était égrenée localement en 2014-2015 ;
- le **caoutchouc** et la quasi-totalité de l’**huile de palme** subissaient une première transformation ;
- seulement **5 % de l’anacarde** était alors transformée.

Transformer localement peut créer des emplois urbains et ruraux, augmenter la valeur ajoutée, fournir des recettes fiscales et réduire la dépendance aux cours des produits bruts.

## Méthode : analyser un discours économique

L’évaluation finale du document s’appuie sur un discours d’investiture du **3 novembre 2015**. Pour l’expliquer :

1. présente la nature, l’auteur, la date et le thème du document ;
2. reformule l’objectif : réformer l’économie et mieux partager les fruits de la croissance ;
3. relie le moyen proposé — transformer les produits agricoles — aux effets attendus : emplois, valeur ajoutée et développement territorial ;
4. apprécie le projet en indiquant ses conditions de réussite : énergie, capitaux, compétences, débouchés et implantation dans plusieurs régions.

> **Astuce mémoire de Davy.** **Primaire = produire**, **secondaire = transformer**, **tertiaire = transporter et vendre**. Une fève de cacao suit les trois secteurs avant de devenir un produit consommé.`,
        keyPoint: "L’industrialisation réduit la dépendance aux produits bruts lorsqu’elle transforme localement les ressources et se diffuse hors d’Abidjan.",
        example: "La transformation du cacao, du coton, du caoutchouc et de l’huile de palme permet de conserver davantage de valeur ajoutée dans le pays.",
        timelineTitle: "Les phases de l’industrialisation",
        timelineInstruction: "Déplace le curseur pour suivre les grandes phases proposées par le cours.",
        timeline: [
          { label: "1960-1970", detail: "Phase d’import-substitution : produire localement une partie des biens auparavant importés." },
          { label: "1970-1980", detail: "Diversification et régionalisation progressive des activités industrielles." },
          { label: "1980-1994", detail: "Stagnation de l’industrie dans un contexte de crises économiques." },
          { label: "Depuis 1994", detail: "Reprise et diversification après la dévaluation de janvier 1994." },
        ],
        observation: "La transformation locale relie directement le secteur secondaire aux productions du secteur primaire.",
        check: { prompt: "Quel est le rôle principal du secteur secondaire ?", options: ["Transformer les matières premières", "Produire uniquement des services", "Fixer les frontières", "Organiser les élections"], correctIndex: 0, explanation: "Le secteur secondaire transforme les ressources issues du primaire." },
        extraQuestions: [
          { prompt: "Quelle phase industrielle correspond à la période 1960-1970 ?", options: ["L’import-substitution", "La stagnation", "La reprise après dévaluation", "La désindustrialisation totale"], correctIndex: 0, explanation: "La première phase vise à produire localement une partie des biens importés.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Quel ordre chronologique est correct ?", options: ["Import-substitution → régionalisation → stagnation → reprise", "Stagnation → import-substitution → reprise → régionalisation", "Régionalisation → reprise → import-substitution → stagnation", "Reprise → stagnation → régionalisation → import-substitution"], correctIndex: 0, explanation: "Les quatre phases se succèdent en 1960, 1970, 1980 et 1994.", sourceLabel: "Activité d’application n°2", points: 2 },
          { prompt: "La dévaluation du franc CFA a duré de 1980 à 1994.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle intervient en janvier 1994 ; la période 1980-1994 correspond à la stagnation.", sourceLabel: "Précision chronologique", points: 2 },
          { prompt: "Quelle branche est présentée comme le poumon de l’industrie ivoirienne ?", options: ["L’agroalimentaire", "L’aéronautique", "La construction navale militaire", "L’industrie spatiale"], correctIndex: 0, explanation: "L’agro-industrie domine grâce à l’importance des matières premières agricoles.", sourceLabel: "II-1-b", points: 1 },
          { prompt: "Quel caractère décrit correctement l’industrie ivoirienne ?", options: ["Une forte concentration à Abidjan", "Une répartition parfaitement équilibrée", "Une domination exclusive des industries lourdes", "Une absence de lien avec l’agriculture"], correctIndex: 0, explanation: "Le cours souligne la concentration abidjanaise, la prédominance des industries légères et le poids de l’agro-industrie.", sourceLabel: "II-2-b", points: 1 },
          { prompt: "Pourquoi transformer le cacao localement peut-il être avantageux ?", options: ["Cela crée davantage de valeur ajoutée et d’emplois", "Cela supprime toute recette fiscale", "Cela empêche toute vente", "Cela transforme le cacao en minerai"], correctIndex: 0, explanation: "La transformation conserve une part plus importante de la valeur dans le pays.", sourceLabel: "Situation d’évaluation n°1", points: 2 },
          { prompt: "Selon les données 2014-2015 du document, quelle production était très peu transformée localement ?", options: ["L’anacarde, à hauteur de 5 %", "L’huile de palme, à hauteur de 100 %", "Le caoutchouc, à hauteur de 0 %", "Le coton, à hauteur de 5 %"], correctIndex: 0, explanation: "Le PDF indique seulement 5 % pour les noix de cajou, contre une première transformation bien plus importante pour les autres produits.", sourceLabel: "II-3", points: 2 },
          { prompt: "Dans l’analyse du discours de 2015, quel est le socle annoncé de l’industrialisation ?", options: ["La transformation des produits agricoles", "L’abandon de l’agriculture", "L’importation de tous les produits finis", "La fermeture des régions rurales"], correctIndex: 0, explanation: "Le projet relie transformation agricole, emplois et partage de la croissance.", sourceLabel: "Situation d’évaluation n°1", points: 1 },
          { prompt: "Quelle condition aide la régionalisation industrielle à réussir ?", options: ["Des infrastructures et de l’énergie dans plusieurs régions", "La concentration de toutes les usines dans une seule ville", "L’absence de main-d’œuvre formée", "La suppression des débouchés"], correctIndex: 0, explanation: "Les usines ont besoin d’énergie, de routes, de compétences, de capitaux et de marchés.", sourceLabel: "Appréciation", points: 2 },
          { prompt: "Les indicateurs industriels de 2014 à 2018 peuvent-ils être présentés sans précaution comme des chiffres actuels ?", options: ["Non, ils doivent être datés et attribués au document", "Oui, ils sont valables pour toujours", "Oui, car aucune économie ne change", "Non, parce qu’ils concernent le tourisme"], correctIndex: 0, explanation: "Une statistique ancienne éclaire une période précise ; elle doit rester datée.", sourceLabel: "Précision documentaire", points: 2 },
        ],
        distractors: ["L’industrie ivoirienne repose seulement sur l’aéronautique.", "Transformer localement diminue toujours la valeur ajoutée.", "Le secteur secondaire est indépendant de l’agriculture."],
      },
      {
        id: "tertiary-sector",
        title: "Un secteur tertiaire dynamique",
        summary: "Relier commerce, tourisme et transports à l’ouverture et à la circulation des richesses.",
        conceptTitle: "Les services connectent les producteurs, les marchés et les territoires",
        explanation: "Le tertiaire comprend notamment commerce, tourisme et transports. Le commerce intérieur distribue les produits, le commerce extérieur organise importations et exportations, tandis que les réseaux routier, ferroviaire, aérien, maritime et lagunaire assurent les flux.",
        bodyMarkdown: String.raw`## Le commerce intérieur et extérieur

Le **commerce intérieur** distribue les produits dans le pays. Il mobilise grandes entreprises commerciales, grossistes, demi-grossistes et détaillants.

Le **commerce extérieur** regroupe :

- les **exportations**, c’est-à-dire les biens vendus à l’étranger : cacao, café, coton, bois, pétrole et autres produits ;
- les **importations**, c’est-à-dire les biens achetés à l’étranger : produits manufacturés, équipements, véhicules, produits pétroliers ou pharmaceutiques.

Le document cite notamment la France, les États-Unis, les Pays-Bas ainsi que les espaces de l’Union européenne, de l’UEMOA et de la CEDEAO parmi les partenaires.

## Calculer une balance commerciale

La **balance commerciale** compare la valeur des exportations et celle des importations :

**Balance commerciale = exportations − importations**

- si le résultat est **positif**, la balance est excédentaire ;
- s’il est **négatif**, elle est déficitaire ;
- s’il est nul, elle est équilibrée.

À partir du tableau du document, exprimé en **milliards de francs CFA** :

| Année | Exportations | Importations | Balance |
|---|---:|---:|---:|
| 2010 | 5 063,15 | 3 881,17 | +1 181,98 |
| 2011 | 5 232,21 | 3 173,95 | +2 058,26 |
| 2012 | 5 538,24 | 4 987,06 | +551,18 |
| 2013 | 6 782,30 | 6 275,57 | +506,73 |
| 2014 | 6 254,24 | 5 530,93 | +723,31 |
| 2015 | 7 423,76 | 6 167,73 | +1 256,03 |
| 2016 | 6 404,41 | 5 088,75 | +1 315,66 |
| 2017 | 7 302,31 | 5 594,01 | +1 708,30 |

La balance est donc **excédentaire chaque année** du tableau, mais son montant varie fortement. Il ne faut pas confondre la **valeur** des échanges et leur **poids en tonnes** : un volume plus lourd ne vaut pas nécessairement plus cher.

## Le tourisme : des atouts à valoriser

La Côte d’Ivoire dispose de ressources touristiques variées :

| Catégorie | Exemples du document |
|---|---|
| Nature | Plages, lagunes, parc de Taï, forêt du Banco, Azagny, mont Péko |
| Culture | Diversité des peuples, fêtes de génération, initiations, arts culinaires |
| Patrimoine | Basilique de Yamoussoukro, anciennes mosquées de Kong, Bondoukou et Mankono |
| Équipements | Hôtels, routes, autoroutes et aéroports |

Pour **2016**, le PDF attribue au tourisme **7,5 % du PIB** et **1 543,9 milliards de francs CFA**. Ces indicateurs sont historiques et doivent rester datés.

> **Précision de source.** La phrase selon laquelle le tourisme représenterait « 62 % de l’économie en matière de services » ne définit pas son dénominateur et ne peut donc pas être interprétée comme une part statistique fiable. On retient l’idée du poids du tourisme, pas ce pourcentage ambigu.

Le tourisme apporte recettes, emplois et taxes, mais son développement dépend de la sécurité, des investissements, de la formation, de la promotion de la destination et de l’accès aux sites.

## Les transports : faire circuler personnes et richesses

Le document décrit un réseau multimodal :

- environ **68 000 km de routes**, dont **6 000 km** bitumés ou autoroutiers ;
- une ligne ferroviaire **Abidjan-Ouagadougou** de **1 156 km**, dont **638 km** en Côte d’Ivoire ;
- les aéroports cités d’Abidjan, Bouaké et Yamoussoukro ;
- les ports d’**Abidjan** et de **San-Pédro** ;
- des liaisons lagunaires par bateaux-bus et pinasses.

Ces chiffres décrivent le réseau à la date du document. Les transports relient les lieux de production aux usines, aux marchés intérieurs, aux ports et aux frontières.

> **Astuce mémoire de Davy.** **Commerce = échanger**, **tourisme = accueillir**, **transport = relier**. Les trois fonctions se renforcent : un site ou un produit mal relié reste difficile à vendre.`,
        keyPoint: "Le dynamisme du tertiaire dépend de réseaux performants et permet aux autres secteurs d’accéder aux marchés.",
        example: "Le Port autonome d’Abidjan assure l’essentiel du trafic maritime national, tandis que le port de San-Pédro dessert notamment l’ouest du pays.",
        timelineTitle: "Suivre la circulation des richesses",
        timelineInstruction: "Explore les trois fonctions majeures du secteur tertiaire ivoirien.",
        timeline: [
          { label: "Commerce", detail: "Distribution intérieure, exportation des produits et importation de biens d’équipement ou manufacturés." },
          { label: "Tourisme", detail: "Plages, parcs, diversité culturelle, monuments et infrastructures attirent visiteurs et recettes." },
          { label: "Transports", detail: "Routes, chemin de fer, ports, aéroports et lagunes relient régions ivoiriennes et marchés extérieurs." },
        ],
        observation: "Sans transport ni commerce, les produits agricoles et industriels atteignent difficilement les consommateurs.",
        check: { prompt: "Quel réseau relie Abidjan à Ouagadougou selon le cours ?", options: ["Une voie ferrée", "Un canal maritime", "Un métro souterrain", "Une ligne de téléphérique"], correctIndex: 0, explanation: "La ligne ferroviaire Abidjan-Ouagadougou traverse la Côte d’Ivoire et le Burkina Faso." },
        extraQuestions: [
          { prompt: "Que sont les exportations ?", options: ["Les produits vendus à l’étranger", "Les produits reçus gratuitement", "Les biens achetés à l’étranger", "Les marchandises détruites"], correctIndex: 0, explanation: "Exporter signifie vendre des biens ou des services au reste du monde.", sourceLabel: "Exercice 2", points: 1 },
          { prompt: "Les performances du commerce ivoirien reposent seulement sur le commerce intérieur.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Le commerce extérieur, avec exportations et importations, joue aussi un rôle majeur.", sourceLabel: "Exercice 2", points: 1 },
          { prompt: "Le commerce extérieur ivoirien présenté dans le document est dominé à l’exportation par les matières premières agricoles.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Le cacao, le café et le coton figurent parmi les principaux produits exportés cités.", sourceLabel: "Exercice 2", points: 1 },
          { prompt: "Quelle est la balance commerciale de 2015 d’après le tableau, en milliards de F CFA ?", options: ["+1 256,03", "−1 256,03", "+551,18", "+7 423,76"], correctIndex: 0, explanation: "7 423,76 − 6 167,73 = +1 256,03 milliards de F CFA.", sourceLabel: "Activité d’application n°3", points: 2 },
          { prompt: "Quelle année du tableau présente le plus fort excédent commercial ?", options: ["2011", "2013", "2014", "2017"], correctIndex: 0, explanation: "L’excédent de 2011 atteint +2 058,26 milliards de F CFA, le maximum de la série.", sourceLabel: "Activité d’application n°3", points: 2 },
          { prompt: "Un poids d’importations supérieur au poids des exportations signifie nécessairement une balance commerciale déficitaire.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "La balance se calcule avec les valeurs monétaires, pas avec les tonnages.", sourceLabel: "Activité d’application n°3", points: 2 },
          { prompt: "Les atouts touristiques sont abondants mais restent insuffisamment valorisés en Côte d’Ivoire.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Le document distingue de nombreux atouts naturels, culturels et patrimoniaux, tout en soulignant les obstacles à leur exploitation.", sourceLabel: "Exercice 2", points: 1 },
          { prompt: "Quel élément est un problème du tourisme ivoirien ?", options: ["La faiblesse des investissements", "La promotion de la destination", "La formation des agents", "La revalorisation de l’activité"], correctIndex: 0, explanation: "Les trois autres propositions sont des solutions ; le manque d’investissement est un problème.", sourceLabel: "Exercice 3", points: 1 },
          { prompt: "Quelle mesure constitue une solution au développement touristique ?", options: ["Former les agents du secteur", "Accroître l’insécurité", "Multiplier les crises sociopolitiques", "Réduire l’accès aux sites"], correctIndex: 0, explanation: "La formation améliore l’accueil et la qualité des services.", sourceLabel: "Exercice 3", points: 1 },
          { prompt: "Les infrastructures de transport constituent uniquement un frein au développement économique.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Routes, rail, ports, aéroports et lagunes soutiennent les échanges, même si le réseau peut encore être amélioré.", sourceLabel: "Exercice 2", points: 2 },
          { prompt: "Quel port dessert notamment l’ouest et le sud-ouest du pays ?", options: ["San-Pédro", "Korhogo", "Bouaké", "Yamoussoukro"], correctIndex: 0, explanation: "Le port de San-Pédro complète celui d’Abidjan et ouvre l’ouest ivoirien sur le commerce maritime.", sourceLabel: "III-3", points: 1 },
          { prompt: "Pourquoi faut-il dater les chiffres de 2016 sur le tourisme ?", options: ["Parce qu’une statistique décrit une période précise", "Parce que le tourisme n’existe plus", "Parce qu’ils concernent le secteur primaire", "Parce qu’un pourcentage ne change jamais"], correctIndex: 0, explanation: "Les indicateurs économiques évoluent ; leur date et leur source font partie de l’information.", sourceLabel: "Précision documentaire", points: 2 },
        ],
        distractors: ["Le tertiaire produit uniquement des matières premières.", "Les transports n’ont aucun effet sur le commerce.", "Le tourisme ivoirien ne possède aucun atout culturel."],
      },
    ],
  },
  {
    id: "terminale-hg-g3-cote-ivoire-development-challenges",
    strand: "Géographie",
    chapterNumber: 3,
    themeNumber: 1,
    themeTitle: "La Côte d’Ivoire : étude économique",
    title: "Les problèmes de développement économique de la Côte d’Ivoire",
    description: "Analyser les problèmes généraux et sectoriels, puis évaluer les politiques de solution.",
    sections: [
      {
        id: "general-challenges",
        title: "Les problèmes généraux",
        summary: "Relier dépendances économiques, dynamique démographique, capital humain et dégradation environnementale.",
        conceptTitle: "Des contraintes structurelles qui se renforcent",
        explanation: "L’économie reste exposée à la fluctuation des produits bruts, au coût de la dette et aux difficultés de financement. La croissance de la population accroît les besoins d’emplois et de services, tandis que déforestation, urbanisation mal maîtrisée et pollutions fragilisent les milieux.",
        keyPoint: "Un diagnostic solide relie économie, population et environnement sans transformer une ressource, une catégorie de personnes ou la croissance elle-même en cause unique.",
        example: "Une baisse des cours d’un produit exporté réduit les recettes, limite l’investissement et peut retarder les équipements sociaux ou environnementaux.",
        timelineTitle: "Distinguer les trois familles de fragilités",
        timelineInstruction: "Passe des contraintes économiques aux besoins démographiques, puis aux pressions sur les milieux.",
        timeline: [
          { label: "Dépendances économiques et financement", shortLabel: "Économie", detail: "Exportation de produits peu transformés, fluctuations des cours, service de la dette, épargne limitée et recettes fiscales insuffisantes." },
          { label: "Dynamique démographique et capital humain", shortLabel: "Population", detail: "Une population jeune peut être un atout si éducation, santé, formation, logements et emplois progressent au même rythme." },
          { label: "Dégradation des milieux", shortLabel: "environnement", detail: "Déforestation, pollutions, assainissement insuffisant, urbanisation précaire et changement climatique détériorent les conditions de vie et de production." },
        ],
        observation: "Une même difficulté peut se propager : faibles recettes, investissements retardés, services sous pression et milieux moins bien protégés.",
        check: { prompt: "Pourquoi l’exportation de produits peu transformés rend-elle l’économie vulnérable ?", options: ["Les cours mondiaux peuvent fluctuer et peu de valeur est créée localement", "Ces produits ne peuvent jamais être vendus", "L’agriculture interdit toute industrie", "La transformation locale supprime les emplois"], correctIndex: 0, explanation: "La fluctuation des cours agit sur les recettes, tandis que l’absence de transformation limite la valeur ajoutée locale." },
        distractors: ["La croissance démographique réduit toujours les besoins sociaux.", "La déforestation améliore durablement tous les sols.", "La dette ne peut jamais limiter l’investissement public."],
        parts: [
          {
            summary: "Analyser la dépendance aux produits bruts, le financement et les inégalités territoriales à partir de données datées.",
            bodyMarkdown: String.raw`## Une économie ouverte, mais vulnérable aux chocs

Le PDF qualifie l’économie ivoirienne d’**extravertie** : une grande partie de la production agricole est destinée aux marchés extérieurs, parfois avec peu de transformation locale. L’ouverture n’est pas un problème en elle-même. La fragilité apparaît lorsque :

- quelques produits fournissent une part importante des recettes ;
- leurs cours sont fixés sur des marchés internationaux instables ;
- les produits sont exportés bruts, donc avec une valeur ajoutée limitée ;
- les équipements ou financements dépendent fortement de l’extérieur.

> **Réflexe d’analyse.** Une matière première est une **ressource**. Le problème est la dépendance excessive à son cours, l’insuffisance de transformation et le manque de diversification.

## Dette, épargne et recettes publiques

Le document présente la dette comme une contrainte de financement. Il donne les valeurs suivantes, en **milliards de francs CFA** :

| Année | Dette publique indiquée |
|---|---:|
| 2018 | 11 607,8 |
| 2019 | 13 300,2 |
| Septembre 2020 | 16 133,3 |

Entre 2018 et septembre 2020, l’augmentation donnée est de **4 525,5 milliards**, soit environ **39 %** :

**(16 133,3 - 11 607,8) / 11 607,8 x 100 ≈ 39 %**

Pour septembre 2020, le total se décompose en **10 587,3 milliards de dette extérieure** et **5 546 milliards de dette intérieure**. Le PDF annonce aussi un **service de la dette** prévu à 2 132 milliards en 2020. Il faut distinguer :

- le **stock**, montant total dû à une date donnée ;
- le **service**, remboursements de principal et intérêts à payer pendant une période.

Ces chiffres décrivent la situation connue lors de la rédaction en **2021**. Ils ne sont pas des statistiques actuelles.

## Mobiliser des ressources sans simplifier à l’excès

Le cours relie la faiblesse de l’épargne à la pauvreté et l’insuffisance des recettes fiscales à la fraude ou à l’incivisme. Il faut compléter ce diagnostic : le financement dépend aussi des revenus disponibles, de l’accès aux banques et à la microfinance, de la confiance, de la qualité des services publics et de l’efficacité de la collecte.

Les investissements étrangers peuvent financer des équipements et des entreprises. Ils deviennent toutefois une dépendance s’ils remplacent durablement l’épargne, le crédit et l’entrepreneuriat locaux au lieu de les renforcer.

## Croissance et développement inclusif

Le **Document 1**, consulté en avril 2021, affirme que l’activité économique reste très concentrée à Abidjan et que l’emploi informel occupe une place dominante. Il appelle à une croissance plus **inclusive**, c’est-à-dire capable d’améliorer les revenus, les services et les possibilités d’emploi dans plusieurs régions.

> **Précision documentaire.** Les parts « 80 % de l’activité à Abidjan », « 30 à 40 % du PIB informel » et « plus de 90 % de la force de travail informelle » sont des estimations citées par le document. Leur date et leur source font partie de l’information ; elles ne doivent pas être récitées comme des constantes.` ,
            interaction: {
              kind: "diagram",
              eyebrow: "Relier",
              title: "La chaîne des fragilités économiques",
              instruction: "Sélectionne un nœud pour comprendre comment une difficulté économique agit sur l’investissement et le niveau de vie.",
              observation: "Le diagnostic ne s’arrête pas au constat : il suit la cause, le mécanisme et l’effet.",
              rootLabel: "Financement du développement",
              rootDetail: "Créer des recettes, investir et mieux répartir les possibilités",
              nodes: [
                { id: "raw-exports", group: "Structure productive", label: "Produits peu transformés", role: "Valeur ajoutée limitée", detail: "Exporter surtout des matières premières expose aux cours mondiaux et conserve moins d’étapes de transformation dans le pays." },
                { id: "prices", group: "Structure productive", label: "Cours fluctuants", role: "Recettes instables", detail: "Une baisse des prix internationaux peut réduire devises, revenus des producteurs, impôts et investissements." },
                { id: "debt-stock", group: "Financement", label: "Stock de dette", role: "Montant dû", detail: "Le stock mesure l’encours total à une date donnée ; il ne se confond pas avec les remboursements annuels." },
                { id: "debt-service", group: "Financement", label: "Service de la dette", role: "Paiements de la période", detail: "Principal et intérêts mobilisent une partie du budget qui ne peut pas être utilisée simultanément ailleurs." },
                { id: "savings-tax", group: "Financement", label: "Épargne et fiscalité", role: "Ressources intérieures", detail: "Revenus, inclusion financière, confiance et efficacité de la collecte conditionnent l’épargne et les recettes publiques." },
                { id: "territories", group: "Répartition", label: "Inégalités territoriales", role: "Croissance peu inclusive", detail: "La concentration des activités, infrastructures et emplois dans un petit nombre d’espaces limite la diffusion des bénéfices." },
              ],
            },
            check: {
              prompt: "Quelle distinction est correcte ?",
              options: ["Le stock est le total dû ; le service correspond aux paiements d’une période", "Le stock et le service sont toujours identiques", "Le service désigne uniquement les exportations", "Le stock mesure le nombre d’entreprises"],
              correctIndex: 0,
              explanation: "Le stock est un encours à une date ; le service regroupe principal et intérêts payés pendant une période.",
            },
            extraQuestions: [
              { prompt: "Pourquoi une économie dépendante de quelques produits bruts est-elle exposée ?", options: ["Leurs cours peuvent varier et peu de valeur est transformée localement", "Ces produits ne sont jamais demandés", "Ils empêchent toute recette fiscale", "Ils rendent les routes inutiles"], correctIndex: 0, explanation: "Concentration des exportations et faible transformation amplifient les effets d’un choc de prix.", sourceLabel: "I-1", points: 2 },
              { prompt: "Quel total de dette le PDF indique-t-il pour septembre 2020 ?", options: ["16 133,3 milliards de F CFA", "10 587,3 milliards de F CFA", "5 546 milliards de F CFA", "2 132 milliards de F CFA"], correctIndex: 0, explanation: "10 587,3 milliards de dette extérieure plus 5 546 milliards de dette intérieure donnent 16 133,3 milliards.", sourceLabel: "Document 2", points: 1 },
              { prompt: "De combien le stock indiqué augmente-t-il entre 2018 et septembre 2020 ?", options: ["4 525,5 milliards de F CFA", "2 525,5 milliards de F CFA", "16 133,3 milliards de F CFA", "39 milliards de F CFA"], correctIndex: 0, explanation: "16 133,3 - 11 607,8 = 4 525,5 milliards de F CFA.", sourceLabel: "Document 2", points: 2 },
              { prompt: "L’augmentation donnée entre 2018 et septembre 2020 représente environ…", options: ["39 %", "9 %", "139 %", "4 %"], correctIndex: 0, explanation: "4 525,5 / 11 607,8 x 100 ≈ 39 %.", sourceLabel: "Exploitation du document 2", points: 2 },
              { prompt: "Le service de la dette prévu à 2 132 milliards en 2020 désigne…", options: ["les paiements de principal et d’intérêts de la période", "le stock total de dette", "les recettes d’exportation", "le nombre de créanciers"], correctIndex: 0, explanation: "Le service correspond aux sommes à payer pendant la période, pas à tout l’encours.", sourceLabel: "I-1", points: 2 },
              { prompt: "Laquelle de ces propositions favorise les ressources intérieures ?", options: ["Améliorer l’inclusion financière et l’efficacité fiscale", "Réduire la confiance dans les institutions", "Supprimer toute épargne", "Exporter sans transformer"], correctIndex: 0, explanation: "L’accès aux services financiers et une collecte efficace renforcent épargne, crédit et recettes publiques.", sourceLabel: "I-1", points: 1 },
              { prompt: "Les investissements étrangers sont-ils nécessairement nuisibles ?", options: ["Non, ils peuvent financer le développement mais doivent aussi renforcer les capacités locales", "Oui, dans tous les cas", "Oui, car aucun pays ne reçoit d’investissement", "Non, parce qu’ils remplacent toujours l’épargne"], correctIndex: 0, explanation: "L’enjeu porte sur leurs conditions, leurs retombées locales et la réduction d’une dépendance durable.", sourceLabel: "I-1", points: 2 },
              { prompt: "Que signifie une croissance plus inclusive ?", options: ["Des bénéfices mieux diffusés entre populations et territoires", "Une croissance limitée à une seule ville", "La disparition des services publics", "L’exclusion du secteur privé local"], correctIndex: 0, explanation: "Le développement inclusif associe croissance, emplois, services, réduction des inégalités et équilibre territorial.", sourceLabel: "Document 1", points: 2 },
              { prompt: "Comment faut-il utiliser les estimations du Document 1 ?", options: ["En les datant et en les attribuant au document consulté en 2021", "Comme des chiffres valables pour toujours", "Sans préciser leur unité", "Comme des données de 1960"], correctIndex: 0, explanation: "Une statistique n’a de sens qu’avec sa période, sa définition et sa source.", sourceLabel: "Précision documentaire", points: 2 },
              { prompt: "Quel enchaînement est le plus rigoureux ?", options: ["Baisse d’un cours → recettes moindres → investissements plus difficiles", "Baisse d’un cours → dette automatiquement supprimée", "Dette → disparition immédiate de toute production", "Épargne → suppression des emplois"], correctIndex: 0, explanation: "La réponse relie le choc économique à son mécanisme budgétaire et à son effet sur l’investissement.", sourceLabel: "Synthèse", points: 2 },
            ],
          },
          {
            summary: "Comprendre les besoins d’une population croissante et corriger les données contradictoires sur le couvert forestier.",
            bodyMarkdown: String.raw`## Une population jeune : potentiel et besoins à satisfaire

Le PDF estime la population à **plus de 26 millions d’habitants en 2020** et un taux d’accroissement naturel supérieur à 2,5 % par an. Le recensement officiel **RGPH 2021**, publié après la rédaction, a dénombré **29 389 150 habitants** et mesure une croissance annuelle moyenne de **2,9 % entre 1998 et 2021**.

> **Mise à jour de source.** Le chiffre de 2020 doit être lu comme une estimation antérieure au recensement. Le RGPH 2021 devient le repère statistique vérifié pour la population dénombrée.

Le document emploie le mot **« fardeau »**. Cette formulation est à nuancer : une population nombreuse et jeune constitue aussi un capital humain. La difficulté apparaît lorsque la création d’emplois, les logements, l’école, la santé, la nutrition, l’eau et l’assainissement ne progressent pas assez vite.

Une réponse responsable propose : éducation des filles et des garçons, santé reproductive, planification familiale **volontaire**, formation, emplois productifs, urbanisme et accès équitable aux services. Elle ne rend ni une naissance ni l’immigration responsables à elles seules des difficultés économiques.

## Déforestation : quatre chiffres qu’il ne faut pas confondre

Le PDF se contredit : le cours annonce **plus de 16 millions d’hectares en 1960**, puis **moins de 2 millions** « aujourd’hui », tandis que l’exercice lacunaire attend **3 millions d’hectares**.

Les données institutionnelles permettent de corriger et d’expliquer l’écart :

| Repère | Superficie indiquée | Précision |
|---|---:|---|
| 1900 | plus de 16 millions ha | début de la série historique officielle |
| 1960 | environ 12 millions ha | et non 16 millions selon la série la plus récente du Ministère |
| 2015 | 3,4 millions ha | estimation du couvert forestier |
| 2020 | 2,97 millions ha | définition nationale du Code forestier |
| 2020 | 5,4 millions ha | terres forestières selon la définition FAO |

> **Correction de source.** Les nombres **moins de 2 millions**, **3 millions**, **2,97 millions** et **5,4 millions** ne sont pas interchangeables : ils peuvent viser une date, une définition ou seulement la forêt naturelle. On retient la tendance de forte diminution et on indique toujours le repère choisi.

## Des pressions environnementales multiples

Le défrichement agricole extensif, l’exploitation forestière illégale, les feux, l’urbanisation, les activités minières et la demande de bois-énergie contribuent à la perte forestière. D’autres difficultés concernent :

- les déchets et l’assainissement insuffisant dans certains quartiers ;
- la pollution de l’air, des sols, des eaux de surface et des nappes ;
- l’habitat précaire et l’exposition aux inondations ;
- la dégradation des sols et de la biodiversité ;
- les sécheresses, fortes pluies et chaleurs accentuées par le changement climatique.

La déforestation locale perturbe les sols, l’eau et les microclimats, mais elle n’explique pas à elle seule le changement climatique mondial. Une réponse rigoureuse distingue causes locales, phénomène global et vulnérabilités du territoire.` ,
            interaction: {
              kind: "diagram",
              eyebrow: "Comparer",
              title: "Population, services et environnement",
              instruction: "Sélectionne un repère pour relier un besoin à une politique publique ou à une protection du milieu.",
              observation: "La population devient un moteur de développement lorsque les capacités humaines et les services progressent avec elle.",
              rootLabel: "Développement humain durable",
              rootDetail: "Transformer une dynamique démographique en capacités, emplois et milieux habitables",
              nodes: [
                { id: "education", group: "Capital humain", label: "Éducation et formation", role: "Développer les compétences", detail: "L’école, l’alphabétisation et la formation professionnelle permettent de participer à une économie plus productive." },
                { id: "health", group: "Capital humain", label: "Santé et nutrition", role: "Renforcer les capacités", detail: "Prévention, soins, alimentation et santé reproductive améliorent l’autonomie et la qualité de vie." },
                { id: "jobs", group: "Capital humain", label: "Emplois et logements", role: "Accueillir la croissance", detail: "Les villes et territoires ont besoin d’activités productives, de logements planifiés, d’eau, d’assainissement et de mobilité." },
                { id: "forests", group: "Milieux", label: "Forêts", role: "Protéger et restaurer", detail: "Contrôle des coupes, aires protégées, reboisement et agroforesterie doivent ralentir les pertes et restaurer les fonctions écologiques." },
                { id: "pollution", group: "Milieux", label: "Pollutions et déchets", role: "Prévenir les risques", detail: "Collecte, traitement, assainissement et contrôle des rejets réduisent maladies et contamination des eaux et des sols." },
                { id: "climate", group: "Milieux", label: "Climat et résilience", role: "S’adapter", detail: "Protection des bassins versants, agriculture adaptée, alertes et urbanisme réduisent la vulnérabilité aux sécheresses et inondations." },
              ],
            },
            extraQuestions: [
              { prompt: "Combien d’habitants le RGPH 2021 a-t-il dénombrés ?", options: ["29 389 150", "26 000 000", "16 133 300", "3 400 000"], correctIndex: 0, explanation: "Le recensement officiel de 2021 dénombre 29 389 150 résidents.", sourceLabel: "Mise à jour RGPH 2021", points: 2 },
              { prompt: "Quel taux moyen de croissance annuelle le RGPH mesure-t-il entre 1998 et 2021 ?", options: ["2,9 %", "0,9 %", "9,2 %", "29 %"], correctIndex: 0, explanation: "Le taux annuel moyen officiel est de 2,9 % entre les deux recensements.", sourceLabel: "Mise à jour RGPH 2021", points: 2 },
              { prompt: "Pourquoi le mot « fardeau » doit-il être nuancé ?", options: ["Une population jeune peut devenir un capital humain si les services et emplois progressent", "Toute population empêche le développement", "Les jeunes ne peuvent jamais travailler", "Les besoins sociaux disparaissent avec la croissance"], correctIndex: 0, explanation: "La relation dépend des capacités, des politiques publiques et des possibilités économiques.", sourceLabel: "I-2", points: 2 },
              { prompt: "Quelle réponse démographique respecte les droits des personnes ?", options: ["Éducation et planification familiale volontaire", "Contrainte des familles", "Exclusion des migrants", "Suppression de la santé reproductive"], correctIndex: 0, explanation: "Information, autonomie, santé et éducation permettent des choix libres et responsables.", sourceLabel: "Précision pédagogique", points: 2 },
              { prompt: "Quel repère forestier officiel corrige la série du PDF pour 1960 ?", options: ["Environ 12 millions d’hectares", "Moins de 2 millions d’hectares", "29 millions d’hectares", "5 546 hectares"], correctIndex: 0, explanation: "La série institutionnelle récente indique plus de 16 millions en 1900, puis environ 12 millions en 1960.", sourceLabel: "Correction de source", points: 2 },
              { prompt: "Quelle estimation correspond au couvert forestier selon la définition nationale en 2020 ?", options: ["2,97 millions d’hectares", "16 millions d’hectares", "12 millions d’hectares", "29,4 millions d’hectares"], correctIndex: 0, explanation: "L’Inventaire forestier et faunique national retient 2,97 millions d’hectares selon la définition nationale.", sourceLabel: "Correction de source", points: 2 },
              { prompt: "Pourquoi le chiffre FAO de 5,4 millions d’hectares diffère-t-il de 2,97 millions ?", options: ["La définition des terres forestières n’est pas la même", "L’un est une dette", "Les deux chiffres ont la même définition", "La FAO mesure la population"], correctIndex: 0, explanation: "La date est la même, mais le périmètre statistique change avec la définition utilisée.", sourceLabel: "Lecture critique", points: 2 },
              { prompt: "La déforestation massive est un problème de développement.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Elle fragilise sols, eau, biodiversité, agriculture et conditions de vie.", sourceLabel: "Activité d’application n°1", points: 1 },
              { prompt: "La déforestation ivoirienne explique à elle seule tout le changement climatique mondial.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle a des effets locaux et contribue aux émissions, mais le changement climatique est un phénomène mondial multicausal.", sourceLabel: "Précision scientifique", points: 2 },
              { prompt: "Quel ensemble répond aux pressions environnementales ?", options: ["Reboisement, assainissement, contrôle des rejets et urbanisme résilient", "Coupes illégales, dépôts sauvages et habitat en zone inondable", "Suppression des aires protégées", "Extension des feux de brousse"], correctIndex: 0, explanation: "La réponse combine protection des forêts, gestion des déchets, lutte contre les pollutions et adaptation.", sourceLabel: "I-3", points: 2 },
              { prompt: "Comment traiter les chiffres « moins de 2 millions » et « 3 millions » du PDF ?", options: ["Signaler leur contradiction et utiliser un repère institutionnel défini", "Les considérer comme exactement identiques", "Les additionner", "Supprimer toute analyse de la forêt"], correctIndex: 0, explanation: "Les chiffres du fascicule se contredisent ; date et définition doivent être explicitées.", sourceLabel: "Correction de source", points: 2 },
            ],
          },
        ],
      },
      {
        id: "sector-challenges",
        title: "Les problèmes sectoriels",
        summary: "Comparer les difficultés du primaire, de l’industrie et des services.",
        conceptTitle: "Chaque secteur possède des fragilités particulières",
        explanation: "Le primaire souffre d’une agriculture extensive, d’aléas climatiques et de pertes après récolte. L’industrie reste concentrée, peu intégrée et dépendante de capitaux ou intrants extérieurs. Les transports, le tourisme et le commerce rencontrent problèmes d’infrastructures, d’organisation et de compétitivité.",
        bodyMarkdown: String.raw`## Primaire : produire sans épuiser les ressources

Le document associe l’agriculture extensive au recul forestier, à la dégradation des sols et à la pollution des eaux par certains intrants. Il ajoute plusieurs fragilités :

- dépendance d’une grande partie des exploitations à la pluie ;
- sécheresses, inondations et irrégularité des saisons ;
- vieillissement des vergers et d’une partie des actifs agricoles ;
- stockage et conservation insuffisants ;
- pertes après récolte et déséquilibres saisonniers entre offre et demande ;
- déficit de certaines productions vivrières, illustré par les importations de riz.

L’agriculture ne doit donc pas seulement produire davantage : elle doit améliorer les rendements, conserver les récoltes, protéger sols, eaux et forêts, et mieux relier producteurs et marchés.

## Secondaire : transformer davantage et mieux répartir les usines

Le PDF décrit un tissu industriel dominé par l’**agro-industrie**, le textile, le bâtiment et l’extraction. Ses principaux problèmes sont :

| Fragilité interne | Conséquence possible |
|---|---|
| Entreprises souvent petites et peu intégrées | chaînes de valeur incomplètes et capacités limitées |
| Plus de 75 % des capacités indiquées dans le sud, surtout à Abidjan | déséquilibre territorial et congestion |
| Transformation locale insuffisante | perte de valeur ajoutée et d’emplois |
| Accès difficile au financement, à l’énergie ou aux compétences | investissements et productivité freinés |

Le document affirme aussi que plus de **60 % des capitaux** et près de **50 % des matières premières industrielles** seraient importés. Ces parts ne sont ni datées ni précisément sourcées dans le fascicule : elles doivent être comprises comme des affirmations du cours, pas comme des statistiques actuelles vérifiées.

> **Précision.** Les industries lourdes ou de pointe ne sont pas l’unique base possible du développement. La transformation agroalimentaire, les PME, l’énergie fiable, le numérique, la logistique, les compétences et l’innovation peuvent également créer valeur et emplois.

## Tertiaire : organiser les réseaux et les marchés

| Branche | Difficultés citées | Effets |
|---|---|---|
| Transports | routes dégradées, accidents, désorganisation, insécurité et tracasseries | coûts, délais et compétitivité dégradés |
| Tourisme | accès aux sites, sécurité, insalubrité, formation et choc de la Covid-19 | fréquentation et emplois fragilisés |
| Commerce | enclavement, stockage insuffisant, offre irrégulière, fraude et concurrence déloyale | pénuries locales, pertes et prix instables |

La pandémie de Covid-19 et la crise politique des années 2000 sont des **contextes historiques datés**. Elles expliquent une partie du diagnostic du fascicule, mais ne décrivent pas automatiquement la situation présente.

> **Correction de formulation.** Le PDF présente « l’hégémonie des étrangers dans la distribution » comme un problème. La nationalité d’un commerçant n’est pas un diagnostic économique. Les enjeux analysables sont l’accès équitable au financement et au marché, l’informalité, la concentration, le respect des règles, la fraude et la concurrence loyale.

## Des secteurs interdépendants

Une route dégradée augmente les pertes agricoles ; un stockage insuffisant réduit les revenus ; une transformation limitée oblige à exporter brut ; une énergie instable ralentit les usines. Le problème n’est donc jamais enfermé dans un seul secteur.` ,
        interaction: {
          kind: "diagram",
          eyebrow: "Diagnostiquer",
          title: "Les blocages d’une chaîne de valeur",
          instruction: "Sélectionne un maillon pour voir comment primaire, secondaire et tertiaire se répondent.",
          observation: "Résoudre un seul maillon sans traiter les autres déplace souvent le problème au lieu de le supprimer.",
          rootLabel: "Du champ au consommateur",
          rootDetail: "Produire, conserver, transformer, transporter et vendre",
          nodes: [
            { id: "produce", group: "Secteur primaire", label: "Produire", role: "Rendements et durabilité", detail: "Climat, sols, plants, équipements et renouvellement des vergers déterminent quantité et régularité." },
            { id: "store", group: "Secteur primaire", label: "Conserver", role: "Limiter les pertes", detail: "Entrepôts, chaîne du froid et organisation de la collecte évitent la perte des produits bord champ." },
            { id: "transform", group: "Secteur secondaire", label: "Transformer", role: "Créer de la valeur", detail: "Des usines accessibles, financées et alimentées en énergie convertissent la matière brute en produits vendables." },
            { id: "regionalize", group: "Secteur secondaire", label: "Déconcentrer", role: "Équilibrer le territoire", detail: "Installer des capacités dans plusieurs régions rapproche l’usine des bassins de production et diffuse les emplois." },
            { id: "transport", group: "Secteur tertiaire", label: "Transporter", role: "Réduire coûts et délais", detail: "Routes sûres et entretenues, rail, ports et logistique relient producteurs, usines et marchés." },
            { id: "sell", group: "Secteur tertiaire", label: "Commercialiser", role: "Organiser les débouchés", detail: "Information sur les prix, stockage, financement et concurrence loyale rapprochent offre et demande." },
          ],
        },
        keyPoint: "Le développement sectoriel exige transformation locale, modernisation, diversification et meilleur équilibre territorial.",
        example: "Plus des trois quarts des capacités industrielles évoquées dans le cours se concentrent dans le sud, notamment autour d’Abidjan.",
        timelineTitle: "Comparer les difficultés par secteur",
        timelineInstruction: "Explore les obstacles caractéristiques du primaire, du secondaire et du tertiaire.",
        timeline: [
          { label: "Primaire", detail: "Vieillissement des vergers, agriculture extensive, aléas climatiques, stockage insuffisant et pertes de récoltes." },
          { label: "Secondaire", detail: "Faible industrialisation, concentration à Abidjan, dépendance extérieure et concurrence internationale." },
          { label: "Tertiaire", detail: "Routes dégradées, transport désorganisé, sites touristiques difficiles d’accès et échanges mal structurés." },
        ],
        observation: "Les faiblesses d’un secteur peuvent bloquer les autres : une route dégradée accroît par exemple les pertes agricoles.",
        check: { prompt: "Où se concentre l’essentiel du parc industriel ivoirien selon le cours ?", options: ["Dans le district d’Abidjan et le sud", "Uniquement dans le nord", "Dans les zones désertiques", "Hors du territoire national"], correctIndex: 0, explanation: "Le cours souligne le fort déséquilibre au profit du sud et d’Abidjan." },
        extraQuestions: [
          { prompt: "La population active agricole est présentée dans le PDF comme…", options: ["vieillissante", "exclusivement adolescente", "absente du nord", "entièrement urbaine"], correctIndex: 0, explanation: "Le vieillissement des actifs et des vergers figure parmi les fragilités du primaire.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Selon l’activité, les aléas climatiques favorisent surtout…", options: ["la baisse et l’irrégularité des productions", "une hausse garantie chaque année", "la disparition des besoins de stockage", "une industrialisation automatique"], correctIndex: 0, explanation: "Sécheresses, inondations et pluies irrégulières peuvent réduire les rendements.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Quelle branche domine le tissu industriel décrit ?", options: ["Les industries agroalimentaires", "Les industries spatiales", "La construction aéronautique", "Les industries lourdes uniquement"], correctIndex: 0, explanation: "L’agro-industrie transforme les nombreuses matières premières agricoles du pays.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Où le PDF localise-t-il plus de 75 % des capacités industrielles ?", options: ["Dans le sud, notamment le district d’Abidjan", "Dans le nord uniquement", "À l’étranger", "Dans les parcs nationaux"], correctIndex: 0, explanation: "Cette concentration crée un déséquilibre régional.", sourceLabel: "II-2", points: 1 },
          { prompt: "Le secteur des transports est caractérisé dans l’activité par…", options: ["la désorganisation et l’insécurité sur certaines routes", "une organisation parfaite", "l’absence totale de route", "la gratuité de tous les déplacements"], correctIndex: 0, explanation: "Le fascicule cite désorganisation, accidents, routes dégradées, tracasseries et insécurité.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Comment corriger la formule « hégémonie des étrangers » ?", options: ["Analyser plutôt accès au marché, financement, informalité et concurrence loyale", "Désigner une nationalité comme cause du sous-développement", "Interdire toute distribution", "Ignorer les règles commerciales"], correctIndex: 0, explanation: "La nationalité ne remplace pas l’analyse des structures, des règles et des pratiques économiques.", sourceLabel: "Correction de formulation", points: 2 },
          { prompt: "Quel aménagement réduit directement les pertes après récolte ?", options: ["Des entrepôts et une chaîne du froid", "La suppression des marchés", "La dégradation des routes", "L’absence de collecte"], correctIndex: 0, explanation: "Stockage, conservation et collecte limitent les pertes et stabilisent l’offre.", sourceLabel: "II-1", points: 2 },
          { prompt: "Pourquoi les importations de riz apparaissent-elles dans le diagnostic ?", options: ["Elles illustrent un déficit de certaines productions vivrières", "Elles prouvent l’absence d’agriculture", "Elles remplacent toute culture d’exportation", "Elles mesurent la dette publique"], correctIndex: 0, explanation: "Un pays agricole peut rester importateur lorsqu’une production vivrière ne couvre pas la demande.", sourceLabel: "II-1", points: 2 },
          { prompt: "Comment faut-il traiter les parts de capitaux et d’intrants importés indiquées par le PDF ?", options: ["Comme des affirmations non datées à ne pas actualiser sans source", "Comme des constantes éternelles", "Comme des données démographiques", "Comme des superficies forestières"], correctIndex: 0, explanation: "Le fascicule ne donne ni millésime ni source précise pour ces pourcentages.", sourceLabel: "Précision documentaire", points: 2 },
          { prompt: "Le choc de la Covid-19 sur le tourisme doit être présenté comme…", options: ["un contexte daté autour de 2020", "une situation permanente", "une cause du recul forestier en 1960", "une industrie lourde"], correctIndex: 0, explanation: "La pandémie explique une rupture historique, pas automatiquement l’état actuel du secteur.", sourceLabel: "II-3", points: 2 },
          { prompt: "Quelle difficulté du commerce relie primaire et tertiaire ?", options: ["L’enclavement des régions productrices", "La présence de matières premières", "La formation hôtelière", "La création de parcs nationaux"], correctIndex: 0, explanation: "Sans routes et logistique, les denrées atteignent difficilement les marchés.", sourceLabel: "II-3", points: 1 },
          { prompt: "Quel enchaînement montre l’interdépendance des secteurs ?", options: ["Récolte → stockage → transformation → transport → vente", "Dette → forêt → disparition des marchés", "Tourisme → absence de route → production", "Importation → suppression de toute usine"], correctIndex: 0, explanation: "Une chaîne de valeur mobilise successivement production, conservation, industrie et services.", sourceLabel: "Synthèse", points: 2 },
        ],
        distractors: ["Le tissu industriel ivoirien est dominé par les industries lourdes de pointe.", "Le primaire ne dépend jamais du climat.", "Les transports n’influencent pas la compétitivité."],
      },
      {
        id: "solutions",
        title: "Les tentatives de solutions",
        summary: "Situer les réformes, en mesurer les limites et associer chaque problème à une réponse durable.",
        conceptTitle: "Des politiques successives, à évaluer dans leur contexte",
        explanation: "L’État a combiné libéralisme encadré, ajustement, diversification, allègement de dette, promotion de l’investissement, plans nationaux et infrastructures. Les solutions durables associent aussi capital humain, équilibre territorial, transformation locale et protection des milieux.",
        bodyMarkdown: String.raw`## Des politiques économiques en quatre temps

| Période | Actions présentées | Lecture critique |
|---|---|---|
| 1960-début des années 1980 | Libéralisme économique associé à un capitalisme d’État | Croissance forte, mais dépendance aux exportations agricoles |
| Années 1980-1990 | Programmes d’ajustement structurel, privatisations et ouverture | Réformes de crise aux effets économiques et sociaux à apprécier, pas un succès automatique |
| Années 2000-2012 | Libéralisation de filières, diversification, civisme fiscal et processus PPTE | Recherche d’assainissement financier et de nouvelles productions |
| 2012-2025 | CEPICI, code minier, PNIA, trois PND et grands travaux | Investissement, infrastructures et attractivité, avec enjeu d’inclusion |

> **Correction chronologique.** La dévaluation du franc CFA a lieu le **12 janvier 1994**. Elle ne doit pas être rangée sans précision dans les seules « années 1980 ».

La Côte d’Ivoire atteint le **point d’achèvement PPTE le 26 juin 2012**. Le FMI et la Banque mondiale annoncent alors plus de 4 milliards de dollars d’allègements PPTE et multilatéraux. Cela réduit une charge héritée, sans supprimer le besoin d’une gestion prudente des nouveaux emprunts.

## Des PND datés, puis un nouveau cycle

Le fascicule cite les PND **2012-2015**, **2016-2020** et **2021-2025**. Ils forment bien les trois cycles exécutés depuis 2012.

> **Mise à jour institutionnelle.** Depuis la rédaction du PDF, le **PND 2026-2030** a été adopté en 2026. Il devient le cadre de référence actuel et s’organise autour de six piliers : stabilité ; agriculture et agro-industrie ; secteur privé et industrialisation ; capital humain ; infrastructures ; gouvernance. Cette mise à jour complète la chronologie sans réécrire les données anciennes du cours.

## Répondre aux problèmes généraux

- **Financement** : améliorer la collecte fiscale, lutter contre la fraude, développer épargne, microfinance et accès au crédit ;
- **Structure économique** : diversifier et transformer davantage cacao, anacarde, caoutchouc ou riz ;
- **Capital humain** : investir dans l’école, la santé, la formation, l’emploi et la planification familiale volontaire ;
- **Environnement** : protéger les forêts, restaurer les sols, assainir les villes, traiter les déchets et adapter les territoires au climat.

## Répondre secteur par secteur

| Secteur | Réponses cohérentes |
|---|---|
| Primaire | irrigation, mécanisation adaptée, plants sélectionnés, agriculture responsable, jeunes agriculteurs, stockage, coopératives et riziculture |
| Secondaire | transformation locale, énergie et financement, compétitivité, entrepreneurs nationaux et déconcentration industrielle |
| Tertiaire | routes et sécurité, organisation des transports, hébergements, formation touristique, promotion nationale, lutte contre fraude et concurrence déloyale |

Le PDF cite l’**ADERIZ**, le **CEPICI**, le **PNIA** et l’opération **Sublime Côte d’Ivoire**. Il faut savoir relier chaque instrument au problème auquel il répond au lieu d’apprendre une liste isolée.

## Corriger la documentation finale

Le dernier texte du fascicule est intitulé une seconde fois **« Document n° 3 »** : il s’agit logiquement du **Document 4**. Il présente 12 projets prioritaires du PND 2016-2020, évalués à **2 700 milliards de F CFA**, dans sept secteurs. Sa dernière phrase imprime **« PND 20216-2020 »** : il faut lire **PND 2016-2020**.` ,
        keyPoint: "Une politique durable relie financement, production, compétences, territoires et environnement, puis mesure ses résultats au lieu d’aligner des annonces.",
        example: "La transformation locale ne réussit que si les usines disposent aussi d’énergie, de financement, de main-d’œuvre formée, de routes et de débouchés.",
        timelineTitle: "Suivre les grandes phases de réponse",
        timelineInstruction: "Parcours les réponses publiques de l’indépendance au PND actuel.",
        timeline: [
          { label: "1960-début 1980", shortLabel: "Croissance initiale", detail: "Libéralisme économique, intervention de l’État et croissance portée par les exportations agricoles." },
          { label: "Années 1980-1990", shortLabel: "Ajustements", detail: "Crise, programmes d’ajustement, privatisations et dévaluation du 12 janvier 1994." },
          { label: "Années 2000-2012", shortLabel: "Restructuration", detail: "Diversification, civisme fiscal, libéralisation et processus PPTE achevé en juin 2012." },
          { label: "2012-2030", shortLabel: "Plans nationaux", detail: "Trois PND exécutés jusqu’en 2025, puis PND 2026-2030, infrastructures, capital humain et transformation." },
        ],
        observation: "Une politique se juge par sa cohérence, son financement, son exécution et ses effets économiques, sociaux, territoriaux et environnementaux.",
        check: { prompt: "Quel cadre succède au PND 2021-2025 ?", options: ["Le PND 2026-2030", "Le Pacte de Varsovie", "Le STABEX", "La Charte de l’Atlantique"], correctIndex: 0, explanation: "Le PND 2026-2030 est le cadre national de référence adopté en 2026." },
        extraQuestions: [
          { prompt: "Quel programme accompagne les réformes de crise des années 1980-1990 ?", options: ["Les programmes d’ajustement structurel", "Le plan Marshall", "Le Pacte de Varsovie", "La CECA"], correctIndex: 0, explanation: "Les PAS associent réduction de certaines dépenses, privatisations et ouverture économique.", sourceLabel: "III-1", points: 1 },
          { prompt: "À quelle date la dévaluation du franc CFA intervient-elle ?", options: ["12 janvier 1994", "12 janvier 1980", "26 juin 2012", "1er janvier 2000"], correctIndex: 0, explanation: "La BCEAO situe la dévaluation le 12 janvier 1994.", sourceLabel: "Correction chronologique", points: 2 },
          { prompt: "Quand la Côte d’Ivoire atteint-elle le point d’achèvement PPTE ?", options: ["26 juin 2012", "26 juin 1994", "30 avril 2021", "4 février 2026"], correctIndex: 0, explanation: "Le point d’achèvement rend l’allègement PPTE irrévocable en juin 2012.", sourceLabel: "Mise à jour institutionnelle", points: 2 },
          { prompt: "Quels sont les trois PND cités par le PDF ?", options: ["2012-2015, 2016-2020 et 2021-2025", "1960-1970, 1970-1980 et 1980-1990", "2026-2030 uniquement", "1990-1995, 1995-2000 et 2000-2005"], correctIndex: 0, explanation: "Le fascicule énumère les trois cycles exécutés entre 2012 et 2025.", sourceLabel: "III-1", points: 1 },
          { prompt: "Quel PND constitue le cadre de référence actuel après la période du fascicule ?", options: ["Le PND 2026-2030", "Le PND 2012-2015", "Le PND 2016-2020", "Aucun plan"], correctIndex: 0, explanation: "Le nouveau cycle a été adopté en 2026 et succède au PND 2021-2025.", sourceLabel: "Mise à jour institutionnelle", points: 2 },
          { prompt: "Quel est le rôle du CEPICI dans le cours ?", options: ["Promouvoir l’investissement en Côte d’Ivoire", "Gérer les parcs nationaux", "Organiser le recensement", "Exploiter les ports"], correctIndex: 0, explanation: "La réforme du CEPICI cherche à attirer et faciliter les investissements.", sourceLabel: "III-1", points: 1 },
          { prompt: "Quel programme vise l’investissement agricole ?", options: ["Le PNIA", "L’OMS", "Le FMI", "L’OACI"], correctIndex: 0, explanation: "Le Programme national d’investissement agricole soutient la relance et la modernisation du secteur.", sourceLabel: "III-1", points: 1 },
          { prompt: "Quelle réponse remplace une politique démographique coercitive ?", options: ["Éducation, santé reproductive et planification familiale volontaire", "Exclusion et contrainte", "Suppression des services de santé", "Interdiction de la formation"], correctIndex: 0, explanation: "Une politique durable renforce les capacités et les choix libres des personnes.", sourceLabel: "III-2", points: 2 },
          { prompt: "Quelle solution répond à la concentration industrielle à Abidjan ?", options: ["Déconcentrer les activités vers plusieurs régions", "Fermer toutes les usines régionales", "Concentrer 100 % des capacités", "Supprimer les routes intérieures"], correctIndex: 0, explanation: "La déconcentration rapproche les usines des ressources et diffuse emplois et infrastructures.", sourceLabel: "Activité d’application n°3", points: 1 },
          { prompt: "Quelle solution répond au déficit vivrier cité ?", options: ["Développer une riziculture productive et durable", "Réduire le stockage", "Détruire les récoltes", "Abandonner l’irrigation"], correctIndex: 0, explanation: "Le document cite l’ADERIZ et l’objectif de renforcer la production de riz.", sourceLabel: "Activité d’application n°3", points: 1 },
          { prompt: "Quelle combinaison soutient le tourisme ?", options: ["Accès aux sites, sécurité, formation et hébergements", "Insalubrité et enclavement", "Absence de promotion", "Dégradation des routes"], correctIndex: 0, explanation: "La qualité des accès, de l’accueil, des équipements et de la promotion conditionne le secteur.", sourceLabel: "III-3", points: 1 },
          { prompt: "Quelles corrections faut-il apporter au dernier document ?", options: ["Le renommer Document 4 et lire PND 2016-2020", "Le supprimer sans explication", "Lire PND 20216-2020", "Le renommer Document 2"], correctIndex: 0, explanation: "La numérotation répète Document 3 et le millésime contient un chiffre supplémentaire.", sourceLabel: "Correction de source", points: 2 },
        ],
        distractors: ["La diversification consiste à dépendre d’un seul produit d’exportation.", "Les infrastructures n’ont aucun rôle dans le développement.", "Le civisme fiscal diminue les ressources publiques."],
      },
    ],
  },
  {
    id: "terminale-hg-g4-south-korea-development-foundations",
    strand: "Géographie",
    chapterNumber: 4,
    themeNumber: 2,
    themeTitle: "La Corée du Sud : un exemple de pays émergent",
    title: "Les fondements du développement économique de la Corée du Sud",
    description: "Retracer comment territoire aménagé, capital humain et État-développeur ont transformé un ancien pays pauvre en économie avancée.",
    sections: [
      {
        id: "territory",
        title: "Un territoire aux potentialités contrastées",
        summary: "Évaluer les contraintes du relief et des ressources ainsi que les atouts maritimes et hydrauliques.",
        conceptTitle: "Un territoire restreint, montagneux et ouvert sur les mers",
        explanation: "La Corée du Sud est montagneuse sur environ 70 % de son territoire et dispose de peu de ressources minières ou énergétiques exploitables. Ses plaines, ses fleuves, ses forêts restaurées et son ouverture maritime deviennent toutefois des atouts lorsqu’ils sont aménagés.",
        bodyMarkdown: String.raw`## Situer avant d’expliquer

La République de Corée occupe le sud de la péninsule coréenne. Le fascicule lui attribue **98 480 km²**, une population de **plus de 51 millions d’habitants en 2017** et **Séoul** pour capitale. Ces nombres servent de repères datés : des sources gouvernementales récentes donnent une superficie proche de **100 000 km²**, selon le périmètre retenu.

Le thème officiel parle d’un « pays émergent » parce qu’il étudie une **trajectoire d’émergence**. Aujourd’hui, la Corée du Sud est classée parmi les **économies avancées** par le FMI et dans le groupe des pays à **revenu élevé** par la Banque mondiale.

La mer Jaune borde l’ouest. À l’est s’étend la mer appelée **mer de l’Est** en Corée et **mer du Japon** dans une grande partie de la cartographie internationale. Nommer les deux appellations évite de transformer une question de géographie en prise de position.

## Un relief qui concentre les hommes et les activités

Environ **70 % du territoire** est montagneux. La chaîne du **Taebaek** longe la côte orientale ; le mont Seorak en est un site majeur. Les chaînes du **Sobaek** et de **Gwangju** prolongent cet ensemble vers le sud. Sur l’île volcanique de **Jeju**, le Hallasan atteint près de **1 950 m**.

Les plaines occupent moins d’un cinquième du pays et se concentrent surtout à l’ouest et au sud. Elles accueillent donc de fortes densités, l’agriculture, les villes et les grands axes. La montagne constitue une contrainte d’espace, mais aussi une ressource paysagère, forestière et touristique.

| Composante | Contrainte | Potentialité mise en valeur |
|---|---|---|
| Montagnes dominantes | peu de plaines, fortes pentes | forêts, tourisme, châteaux d’eau |
| Plaines occidentales et méridionales | espace rare et très occupé | cultures, villes, transports |
| Île volcanique de Jeju | insularité et relief | tourisme, patrimoine naturel |

## Quatre saisons et des risques

Le climat tempéré combine influences continentales, influences océaniques et mousson d’Asie orientale. La convention météorologique distingue généralement **printemps de mars à mai**, **été de juin à août**, **automne de septembre à novembre** et **hiver de décembre à février** ; les transitions réelles varient :

- l’**hiver** est froid et plutôt sec ;
- l’**été** est chaud, humide et pluvieux ;
- le **printemps** et l’**automne** sont plus modérés et favorables au tourisme ;
- sécheresses, pluies intenses et **typhons** peuvent perturber les activités.

Le fascicule parle simplement de « climat continental ». Cette formule est utile pour le contraste thermique, mais elle doit être complétée par le rôle de la mousson et des façades maritimes.

## De la dégradation à la restauration forestière

Les forêts tempérées associent conifères et feuillus caducs ; le sud possède aussi bambous, lauriers et chênes verts. Leur recul résulte de plusieurs périodes : exploitation sous la colonisation japonaise, pauvreté, prélèvements de bois et guerre de Corée.

L’État lance ensuite de vastes programmes de restauration, notamment le **premier plan national décennal de reboisement en 1973**. Plantations, contrôle de l’érosion et participation des communautés permettent une forte reconstitution du couvert.

> **Précision.** Le PDF attribue la dégradation à la seule occupation japonaise. Celle-ci a bien pesé, mais la guerre et les usages d’après-guerre ont aussi dévasté les sols. La restauration est, elle aussi, une œuvre collective et pas seulement une plantation administrative.

> **Correction botanique.** Le « châtaignier d’Amérique » cité parmi les plantations commerciales est une mauvaise identification. L’espèce cultivée documentée est le **châtaignier japonais ou coréen (Castanea crenata)**.

## Peu de minerais, mais beaucoup d’eau et trois façades

Houille, argent, zinc, tungstène, fer ou kaolin existent, mais leur poids économique est présenté comme faible. Cette insuffisance pousse le pays à importer énergie et matières premières, puis à créer davantage de valeur par l’industrie et la technologie.

Les fleuves prennent naissance dans les reliefs :

| Fleuve du fascicule | Longueur indiquée | Repère spatial |
|---|---:|---|
| Nakdong | 521 km | traverse le sud-est |
| Han | 514 km | coupe Séoul en deux |
| Geum | 401 km | dessert l’ouest |
| Yeongsan | 115 km | dessert le sud-ouest |

Fleuves, barrages et littoraux soutiennent **eau potable, irrigation, hydroélectricité, pêche, ports, navigation, loisirs et commerce**. Les **2 413 km de côte** cités par le cours utilisent un ancien périmètre non explicité ; KOSTAT compte aujourd’hui près de **15 000 km, îles comprises**. Toute longueur de côte doit donc indiquer sa méthode de mesure.

> **Astuce mémoire de Davy.** Retenir la chaîne **contrainte → aménagement → activité** : montagne → barrages et forêts ; peu de plaines → concentration et productivité ; peu de minerais → importations puis transformation ; mers → ports et exportations.` ,
        interaction: {
          kind: "diagram",
          eyebrow: "Relier",
          title: "Transformer un territoire contraignant",
          instruction: "Sélectionne une composante pour suivre le passage de la contrainte à la potentialité.",
          observation: "Un milieu ne produit pas automatiquement du développement : les infrastructures, les techniques et les choix collectifs le transforment en ressource.",
          rootLabel: "Territoire sud-coréen",
          rootDetail: "Un espace restreint que l’aménagement connecte aux activités",
          nodes: [
            { id: "mountains", group: "Relief", label: "Montagnes", role: "70 % du territoire", detail: "Elles limitent les plaines, mais alimentent les cours d’eau et offrent forêts, paysages et sites touristiques." },
            { id: "plains", group: "Relief", label: "Plaines", role: "Espaces rares", detail: "Concentrées à l’ouest et au sud, elles accueillent une grande partie de la population, des cultures et des réseaux." },
            { id: "monsoon", group: "Climat", label: "Mousson et saisons", role: "Eau et risques", detail: "L’été humide alimente les ressources en eau, tandis que typhons, sécheresses et fortes pluies exigent prévention et aménagement." },
            { id: "forests", group: "Milieux", label: "Forêts restaurées", role: "Protection des sols", detail: "Les programmes lancés notamment en 1973 restaurent des espaces dégradés par la colonisation, la guerre et les prélèvements." },
            { id: "rivers", group: "Eaux", label: "Fleuves", role: "Irriguer et produire", detail: "Nakdong, Han, Geum et Yeongsan servent à l’eau, à l’irrigation, aux barrages, aux loisirs et à certains transports." },
            { id: "coasts", group: "Eaux", label: "Mers et ports", role: "Ouvrir le pays", detail: "Les façades maritimes favorisent pêche, construction portuaire, importation de matières premières et commerce mondial." },
          ],
        },
        keyPoint: "La Corée du Sud a compensé des ressources naturelles limitées par l’aménagement, l’ouverture maritime et la valorisation de ses eaux.",
        example: "Le Nakdong et le Han structurent le territoire ; les ports importent des matières premières et exportent les productions industrielles.",
        timelineTitle: "Lire les composantes du territoire",
        timelineInstruction: "Compare relief, climat et ressources pour évaluer contraintes et potentialités.",
        timeline: [
          { label: "Relief", detail: "Montagnes dominantes, plaines surtout occidentales et méridionales, fortes densités sur les espaces disponibles." },
          { label: "Climat", detail: "Hiver froid et plutôt sec, été chaud et humide sous l’effet de la mousson, avec sécheresses et typhons possibles." },
          { label: "Eaux et littoraux", shortLabel: "Eaux", detail: "Fleuves et vaste littoral insulaire favorisent ports, pêche, énergie, irrigation et loisirs." },
        ],
        observation: "Le développement ne dépend pas seulement de l’abondance des matières premières, mais de la manière dont le territoire est aménagé.",
        check: { prompt: "Quelle part approximative du territoire sud-coréen est montagneuse ?", options: ["10 %", "30 %", "70 %", "100 %"], correctIndex: 2, explanation: "Le cours indique qu’environ 70 % du territoire est montagneux." },
        extraQuestions: [
          { prompt: "Le relief sud-coréen est très peu accidenté.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Environ 70 % du territoire est montagneux : le relief est donc largement accidenté.", sourceLabel: "Activité d’application n°1, affirmation 1", points: 1 },
          { prompt: "Le contraste saisonnier sud-coréen s’explique notamment par…", options: ["des influences continentales et la mousson", "un climat polaire permanent", "l’absence de toute mer", "une saison unique"], correctIndex: 0, explanation: "L’hiver est froid et plutôt sec, tandis que l’été est chaud, humide et soumis à la mousson.", sourceLabel: "Activité d’application n°1, affirmation 2", points: 1 },
          { prompt: "Pourquoi printemps et automne sont-ils mis en valeur dans le cours ?", options: ["Ils sont plus modérés et favorables au tourisme", "Ils sont toujours sans pluie", "Ils durent chacun six mois", "Ils empêchent tout déplacement"], correctIndex: 0, explanation: "Leur relative douceur les rend propices aux activités touristiques.", sourceLabel: "Activité d’application n°1, affirmation 3", points: 1 },
          { prompt: "L’occupation japonaise a favorisé la conservation du couvert forestier.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Le fascicule relie au contraire cette période à une forte dégradation, complétée ensuite par les effets de la guerre et des prélèvements.", sourceLabel: "Activité d’application n°1, affirmation 4", points: 1 },
          { prompt: "Quel repère précise le vaste programme de reforestation évoqué par le PDF ?", options: ["Le premier plan décennal lancé en 1973", "La fermeture de toutes les forêts en 1945", "La disparition des montagnes en 1960", "L’abandon du contrôle de l’érosion"], correctIndex: 0, explanation: "Le premier grand plan décennal national commence en 1973 et mobilise État et population.", sourceLabel: "Activité d’application n°1, affirmation 5", points: 2 },
          { prompt: "Quelle affirmation décrit les ressources du sous-sol ?", options: ["Quelques gisements existent, mais leur poids économique est faible", "Le pays possède toutes les énergies fossiles nécessaires", "Aucun minerai n’existe", "Le sous-sol remplace le capital humain"], correctIndex: 0, explanation: "Le cours cite plusieurs minerais, tout en soulignant leur importance économique limitée.", sourceLabel: "Activité d’application n°1, affirmation 6", points: 1 },
          { prompt: "La Corée du Sud ne possède pas de façade maritime.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle est bordée par plusieurs mers ; ports, pêche et commerce sont des potentialités majeures.", sourceLabel: "Activité d’application n°1, affirmation 7", points: 1 },
          { prompt: "Quel fleuve traverse la capitale Séoul ?", options: ["Le Han", "Le Nakdong", "Le Geum", "Le Yeongsan"], correctIndex: 0, explanation: "Le Han traverse Séoul, tandis que le Nakdong structure surtout le sud-est.", sourceLabel: "I-5", points: 1 },
          { prompt: "Quelle activité n’est pas directement une mise en valeur des ressources en eau citée par le cours ?", options: ["L’extraction d’uranium", "L’irrigation", "L’hydroélectricité", "La pêche"], correctIndex: 0, explanation: "Le PDF relie l’eau aux ports, à l’énergie, à la pêche, à l’irrigation, aux loisirs et à la navigation, pas à l’uranium.", sourceLabel: "I-5", points: 1 },
          { prompt: "Pourquoi une faible dotation minière n’interdit-elle pas le développement ?", options: ["Le pays peut importer, transformer, innover et exporter", "Les matières premières sont inutiles partout", "La montagne fabrique automatiquement des usines", "Les ports empêchent les échanges"], correctIndex: 0, explanation: "L’aménagement, les compétences, les importations et la transformation industrielle peuvent compenser une partie des limites naturelles.", sourceLabel: "Synthèse I", points: 2 },
        ],
        distractors: ["La Corée du Sud possède d’immenses réserves minières faciles à exploiter.", "Le pays n’a aucune façade maritime.", "Le climat coréen ne présente aucune saison contrastée."],
      },
      {
        id: "human-capital",
        title: "Le capital humain",
        summary: "Expliquer le rôle de l’éducation, de la formation et des valeurs sociales dans la croissance.",
        conceptTitle: "L’éducation comme investissement productif",
        explanation: "Face à la faiblesse des ressources naturelles, la Corée du Sud a étendu l’enseignement et la formation après 1945. L’alphabétisation, les compétences techniques, la santé et la recherche ont accru la productivité et la capacité d’innovation, sans que la population puisse être réduite à des traits culturels figés.",
        bodyMarkdown: String.raw`## D’une population à un capital humain

Le **capital humain** désigne les connaissances, compétences, expériences et capacités de santé qui permettent aux personnes d’agir et de produire. Une population nombreuse ne devient donc pas automatiquement un atout : il faut école, formation, soins, emplois et possibilité d’innover.

Le PDF compte plus de **51 millions d’habitants en 2017** et insiste déjà sur le vieillissement. Le recensement officiel de **2024** dénombre **51,81 millions de résidents** :

| Groupe d’âge | Part en 2024 | Évolution |
|---|---:|---|
| 0-14 ans | 10,5 % | en baisse |
| 15-64 ans | 70,0 % | baisse continue depuis 2018 |
| 65 ans ou plus | 19,5 % | en hausse |

Le nombre de citoyens coréens résidents recule, mais l’ensemble de la population augmente légèrement de **0,1 %** en 2024 grâce notamment aux résidents étrangers. Il faut donc distinguer **solde naturel**, **migrations**, **population totale** et **vieillissement**.

## Lire avec prudence le Document 5

Le tableau documentaire, attribué à un site secondaire et composé autour de 2020, donne : croissance **-0,24 %**, natalité **0,59 %**, mortalité **0,57 %**, espérance de vie **82 ans**, alphabétisation **100 %** et chômage **4,9 %**.

Or **0,59 - 0,57 = +0,02 point** : ces deux taux produisent un accroissement naturel légèrement positif, pas -0,24 %. Pour expliquer l’écart, il faudrait connaître la même année de référence, les arrondis, le solde migratoire et la méthode de chaque série. On ne mélange donc pas ces valeurs comme si elles formaient un bilan parfaitement cohérent.

Le **100 % d’alphabétisation** n’est pas davantage une mesure exacte. L’enquête nationale de littératie des adultes distingue plusieurs niveaux : en 2020, **4,5 %** des adultes se situent au niveau 1, sans maîtrise suffisante des compétences élémentaires, tandis que **79,8 %** atteignent le niveau fonctionnel 4 ou plus. Le résultat dépend donc du seuil mesuré.

## L’expansion scolaire après 1945

Le cours décrit une « révolution éducative » : le taux d’alphabétisation passe, dans sa série, d’environ **22 % en 1945** à près de **88 % en 1970**, tandis qu’environ **4,5 % du PIB** est consacré à l’éducation. Ce dernier ratio n’est accompagné ni d’une année ni d’un périmètre public/privé : il illustre la priorité annoncée, mais ne doit pas être comparé directement à une statistique actuelle. L’accès au secondaire et au supérieur forme cadres, enseignants, ingénieurs et techniciens utiles à l’industrialisation.

| Investissement | Capacité développée | Effet économique possible |
|---|---|---|
| enseignement primaire | lire, compter, apprendre | productivité et mobilité sociale |
| secondaire technique | maîtriser procédés et machines | industrie et contrôle de qualité |
| universités et recherche | concevoir, expérimenter, gérer | innovation et montée en gamme |
| formation continue | adapter les compétences | réponse aux changements technologiques |

> **Correction chronologique.** Park Chung-hee n’a pas dirigé de **1963 à 1679**, comme l’imprime le PDF, mais a été président de **1963 à 1979**. La coquille de trois siècles doit être corrigée.

## Éviter une explication culturelle automatique

Le fascicule attribue des parts religieuses de 46 % au bouddhisme, 39 % au protestantisme et 13 % au catholicisme, puis relie confucianisme, hiérarchie et travail à la croissance. Ces nombres ne décrivent pas la population totale : le recensement KOSTAT de **2015** comptait **56,1 % de personnes sans religion**, **19,7 % de protestants**, **15,5 % de bouddhistes** et **7,9 % de catholiques**.

Les héritages confucéens peuvent éclairer le prestige accordé aux études ou certaines relations sociales, mais ils n’expliquent jamais seuls la croissance. Politiques scolaires, investissements, travail des femmes et des hommes, urbanisation, institutions, commerce mondial et progrès techniques ont agi ensemble.

> **Précision historique.** L’école ne doit pas être présentée comme un simple « acquis positif » de la colonisation japonaise. La domination coloniale fut coercitive et inégalitaire ; l’éducation de masse et l’élévation rapide des niveaux scolaires s’accélèrent surtout après la libération, sous l’action de la société et des politiques sud-coréennes.

> **Astuce mémoire de Davy.** La chaîne à restituer est **éduquer → qualifier → produire mieux → rechercher → innover**. Elle explique un mécanisme ; elle ne transforme pas tous les Coréens en un portrait identique.` ,
        interaction: {
          kind: "diagram",
          eyebrow: "Comprendre",
          title: "La chaîne du capital humain",
          instruction: "Sélectionne un levier pour voir comment une capacité humaine peut soutenir la transformation économique.",
          observation: "L’éducation devient productive lorsqu’elle rencontre santé, emplois, investissements, recherche et débouchés.",
          rootLabel: "Capital humain",
          rootDetail: "Développer des capacités, pas seulement compter des habitants",
          nodes: [
            { id: "mass-school", group: "Éducation", label: "École de masse", role: "Alphabétiser", detail: "Lire, écrire et compter donnent accès à la formation, à l’information et à des emplois plus qualifiés." },
            { id: "technical", group: "Éducation", label: "Formation technique", role: "Maîtriser les procédés", detail: "Techniciens et ouvriers qualifiés font fonctionner, entretenir et améliorer les équipements industriels." },
            { id: "higher", group: "Éducation", label: "Enseignement supérieur", role: "Former cadres et ingénieurs", detail: "Universités et instituts alimentent la gestion, la recherche scientifique et la conception technologique." },
            { id: "health", group: "Capacités", label: "Santé", role: "Préserver l’autonomie", detail: "Une meilleure santé augmente les possibilités d’apprendre, de travailler et de participer à la vie sociale." },
            { id: "jobs", group: "Économie", label: "Emplois productifs", role: "Utiliser les compétences", detail: "Sans emplois, investissement et mobilité professionnelle, les qualifications peuvent rester sous-utilisées." },
            { id: "innovation", group: "Économie", label: "Recherche et innovation", role: "Monter en gamme", detail: "Compétences scientifiques et apprentissage industriel permettent de passer de l’imitation à la conception de produits complexes." },
          ],
        },
        keyPoint: "Le modèle coréen transforme l’éducation, la santé, les compétences et la recherche en capacités productives et innovantes.",
        example: "Le taux d’alphabétisation mentionné dans le cours passe d’environ 22 % en 1945 à près de 88 % en 1970.",
        timelineTitle: "Suivre la révolution éducative",
        timelineInstruction: "Parcours les repères qui montrent la montée en puissance du capital humain.",
        timeline: [
          { label: "1945", detail: "Libération du pays et début d’une politique d’éducation de masse ; alphabétisation encore faible." },
          { label: "Années 1960", detail: "Investissement éducatif soutenu et formation d’une main-d’œuvre adaptée à l’industrialisation." },
          { label: "1970", detail: "Le taux d’alphabétisation approche 88 % selon les données du cours." },
        ],
        observation: "Une population nombreuse ne devient un capital humain que grâce à l’éducation, à la santé et aux compétences.",
        check: { prompt: "Quel choix compense la faiblesse des ressources naturelles sud-coréennes ?", options: ["L’abandon de l’éducation", "L’optimisation du capital humain", "La fermeture des ports", "La suppression de la recherche"], correctIndex: 1, explanation: "La Corée du Sud place l’éducation et la formation au cœur de son développement." },
        extraQuestions: [
          { prompt: "Complète le début de l’activité : « Dépourvue de …, la Corée du Sud a fait le choix d’optimiser son … »", options: ["ressources naturelles / capital humain", "capital humain / relief", "ports / climat", "écoles / sous-sol"], correctIndex: 0, explanation: "Le texte oppose faibles ressources naturelles et optimisation du capital humain.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Dans le texte à trous, l’éducation est au centre du … et améliore la qualité des …", options: ["modèle coréen / ressources humaines", "littoral / minerais", "climat / moussons", "relief / chaebols"], correctIndex: 0, explanation: "Les expressions attendues sont « modèle coréen » et « ressources humaines ».", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "À quoi l’amélioration des ressources humaines contribue-t-elle selon l’activité ?", options: ["Au développement économique", "À la disparition des études", "À l’enclavement maritime", "À la baisse des compétences"], correctIndex: 0, explanation: "La formation élève la qualité du travail, la productivité et la capacité d’innovation.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Quel trio complète la fin du texte à trous ?", options: ["compétents et forts / renaissance de la nation / hiérarchie", "isolés / recul de la nation / littoral", "sans formation / fermeture / mousson", "miniers / désertification / exportation"], correctIndex: 0, explanation: "Ce sont les trois groupes de mots laissés par la liste du fascicule ; leur portée culturelle doit ensuite être nuancée.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Quel effet du vieillissement est explicitement étudié ?", options: ["La diminution progressive de la population d’âge actif", "La multiplication des ressources minières", "La disparition immédiate des villes", "L’augmentation automatique des exportations"], correctIndex: 0, explanation: "Le vieillissement réduit la part et, progressivement, le nombre de personnes d’âge actif.", sourceLabel: "II-1", points: 1 },
          { prompt: "Combien de résidents le recensement officiel dénombre-t-il en 2024 ?", options: ["51,81 millions", "9,61 millions", "36,26 millions", "2,04 millions"], correctIndex: 0, explanation: "KOSTAT recense 51,81 millions de résidents au 1er novembre 2024.", sourceLabel: "Mise à jour KOSTAT 2024", points: 2 },
          { prompt: "Quelle part de la population a 65 ans ou plus en 2024 ?", options: ["19,5 %", "70,0 %", "10,5 %", "51,8 %"], correctIndex: 0, explanation: "Les 65 ans ou plus représentent 19,5 %, contre 18,6 % en 2023.", sourceLabel: "Mise à jour KOSTAT 2024", points: 2 },
          { prompt: "Pourquoi les parts religieuses du PDF ne peuvent-elles pas décrire toute la population ?", options: ["Le recensement 2015 compte 56,1 % de personnes sans religion", "Elles totalisent exactement tous les habitants avec les non-croyants", "La Corée interdit les recensements", "Le confucianisme est un minerai"], correctIndex: 0, explanation: "Les parts bouddhiste, protestante et catholique du PDF omettent la majorité déclarée sans religion en 2015.", sourceLabel: "Correction statistique KOSTAT 2015", points: 2 },
          { prompt: "Quelle période corrige la coquille « Park Chung-hee (1963-1679) » ?", options: ["1963-1979", "1948-1960", "1679-1979", "1971-1981"], correctIndex: 0, explanation: "Park Chung-hee a été président de 1963 à 1979.", sourceLabel: "Correction de source, page 5", points: 2 },
          { prompt: "Avec 0,59 % de natalité et 0,57 % de mortalité, quel solde naturel obtient-on ?", options: ["+0,02 point", "-0,24 point", "+1,16 point", "-0,57 point"], correctIndex: 0, explanation: "0,59 - 0,57 = +0,02. Le -0,24 % du document nécessite d’autres données ou une autre date pour être expliqué.", sourceLabel: "Exploitation critique du Document 5", points: 2 },
        ],
        distractors: ["Le développement coréen repose uniquement sur le vieillissement de la population.", "L’éducation n’a aucun lien avec l’industrialisation.", "La Corée du Sud interdit l’enseignement supérieur."],
      },
      {
        id: "development-state",
        title: "L’État-développeur et les phases industrielles",
        summary: "Relier aide extérieure, planification, chaebols, exportations et industries lourdes.",
        conceptTitle: "Un État stratège orienté vers les exportations",
        explanation: "Après la colonisation et la guerre, l’aide américaine soutient la reconstruction. L’État sud-coréen planifie, dirige le crédit, coopère avec les chaebols et pousse les entreprises vers l’exportation, puis vers les industries lourdes et technologiques.",
        parts: [
          {
            bodyMarkdown: String.raw`## Des influences extérieures réelles, mais non suffisantes

La Corée subit la colonisation japonaise de **1910 à août 1945**, puis la péninsule est divisée et ravagée par la guerre de **1950-1953**. Dans la Guerre froide, les États-Unis assurent protection militaire, subventions, prêts et importations nécessaires à la reconstruction.

Pour **1953-1961**, le fascicule annonce **8 % du PNB**, **64 % des investissements** et **70 % des importations**. Les deux premiers ratios ne sont ni définis ni correctement sourcés. Une synthèse du KDI retient plutôt les ordres de grandeur suivants :

| Indicateur documenté | Part financée par l’aide étrangère |
|---|---:|
| importations | environ 70 % |
| formation brute de capital fixe | environ 75 % |

Ces chiffres montrent une dépendance initiale forte. Ils ne prouvent pourtant pas que l’aide aurait produit mécaniquement le développement : encore fallait-il sélectionner les investissements, former les travailleurs, organiser les entreprises et conquérir des marchés.

> **Précision historique.** Une influence japonaise ne se résume ni à un « don » ni à un bénéfice colonial. La domination de 1910-1945 fut coercitive. Les apports de capitaux et de technologies japonais deviennent surtout importants dans un autre contexte, après la normalisation de 1965.

## Un État-développeur

À partir de **1961**, l’État organise des plans quinquennaux et crée un **Bureau de planification économique**. Il oriente le crédit vers des secteurs jugés prioritaires, soutient les exportateurs, investit dans les infrastructures et mobilise l’épargne intérieure.

| Instrument | Fonction |
|---|---|
| plans quinquennaux | fixer priorités, objectifs et équipements |
| crédit dirigé et prêts bonifiés | financer les entreprises choisies |
| avantages fiscaux à l’exportation | rendre les ventes extérieures plus compétitives |
| infrastructures | fournir ports, routes, énergie et zones industrielles |
| épargne intérieure | alimenter l’investissement national |
| instituts scientifiques | former chercheurs et ingénieurs |

Le PDF appelle déjà l’établissement créé en 1971 « KAIST ». Plus précisément, le **Korea Advanced Institute of Science (KAIS)** est fondé en **1971** ; le nom **KAIST** naît en **1981** après sa fusion avec le KIST. La correction ne diminue pas son rôle : former des scientifiques de haut niveau était bien un choix industriel majeur.

## État et chaebols : une alliance sous conditions

Les **chaebols** sont de grands groupes privés diversifiés, contrôlés par des familles et organisés autour de nombreuses filiales. Samsung, Hyundai ou LG deviennent des moteurs d’investissement et d’exportation ; POSCO, créé comme entreprise publique, porte la sidérurgie.

L’alliance permet vitesse, taille et coordination. Elle comporte aussi des risques : concentration du pouvoir économique, endettement, dépendance au crédit public, faible concurrence et coûts sociaux. L’État-développeur de Park Chung-hee est en outre **autoritaire** : la croissance ne doit pas faire oublier répression politique et restrictions des droits du travail.

> **Méthode.** Pour évaluer ce modèle, formule toujours deux colonnes : **levier** (planifier, financer, exporter) et **limite** (concentration, autoritarisme, vulnérabilité).` ,
            interaction: {
              kind: "diagram",
              eyebrow: "Organiser",
              title: "Les leviers de l’État-développeur",
              instruction: "Sélectionne un levier pour comprendre son rôle dans le décollage et sa limite possible.",
              observation: "L’aide extérieure apporte des moyens ; les institutions nationales décident comment les convertir en capacités productives.",
              rootLabel: "Décollage industriel",
              rootDetail: "Coordonner ressources extérieures, État, travail et entreprises",
              nodes: [
                { id: "us-aid", group: "Extérieur", label: "Aide américaine", role: "Reconstruire et importer", detail: "Subventions, prêts et biens importés soutiennent la reconstruction des années 1950, sans expliquer seuls la trajectoire ultérieure." },
                { id: "planning", group: "État", label: "Planification", role: "Fixer des priorités", detail: "Le Bureau créé en 1961 coordonne plans, infrastructures et filières stratégiques." },
                { id: "credit", group: "État", label: "Crédit et fiscalité", role: "Orienter l’investissement", detail: "Prêts bonifiés et avantages fiscaux récompensent notamment les performances à l’exportation." },
                { id: "savings", group: "Financement", label: "Épargne intérieure", role: "Mobiliser du capital", detail: "La politique monétaire cherche à transformer l’épargne nationale en investissements productifs." },
                { id: "science", group: "Capacités", label: "KAIS et recherche", role: "Former des scientifiques", detail: "L’institut créé en 1971 renforce recherche et formation technologique ; il prend le nom KAIST en 1981." },
                { id: "chaebols", group: "Entreprises", label: "Chaebols", role: "Produire à grande échelle", detail: "De grands groupes réalisent les projets et exportent, mais leur poids crée aussi concentration et risques de dépendance." },
              ],
            },
            check: { prompt: "Pourquoi l’aide extérieure ne suffit-elle pas à expliquer le décollage ?", options: ["Elle doit être transformée par des politiques, des compétences et des entreprises", "Elle interdit toute décision nationale", "Elle remplace automatiquement l’éducation", "Elle supprime le besoin de marchés"], correctIndex: 0, explanation: "Les apports extérieurs comptent, mais leurs effets dépendent des institutions et de la stratégie nationale." },
            extraQuestions: [
              { prompt: "Quelle période correspond à la colonisation japonaise de la Corée ?", options: ["1910-1945", "1953-1961", "1961-1973", "1973-1980"], correctIndex: 0, explanation: "La domination japonaise s’étend de 1910 à la libération d’août 1945.", sourceLabel: "III-1", points: 1 },
              { prompt: "Pourquoi le ratio « 8 % du PNB » du fascicule ne doit-il pas être mémorisé comme un fait établi ?", options: ["Son périmètre et sa source ne sont pas précisés", "Le PNB n’existe dans aucun pays", "Toute aide est impossible", "Il mesure en réalité le relief"], correctIndex: 0, explanation: "Sans définition, année détaillée et source, ce ratio reste une affirmation du fascicule.", sourceLabel: "Correction documentaire, III-1", points: 2 },
              { prompt: "Quel ordre de grandeur le KDI retient-il pour les importations financées par l’aide étrangère ?", options: ["Environ 70 %", "Environ 7 %", "Environ 100 %", "Moins de 1 %"], correctIndex: 0, explanation: "La synthèse KDI confirme une très forte dépendance des importations à l’aide durant la reconstruction.", sourceLabel: "Mise en perspective KDI", points: 2 },
              { prompt: "Quel ordre de grandeur concerne la formation brute de capital fixe ?", options: ["Environ 75 %", "Environ 5 %", "Environ 25 %", "Environ 150 %"], correctIndex: 0, explanation: "Le KDI estime qu’environ trois quarts de la formation de capital fixe sont alors financés par l’aide étrangère.", sourceLabel: "Mise en perspective KDI", points: 2 },
              { prompt: "Quel organisme de planification est créé en 1961 ?", options: ["Le Bureau de planification économique", "La CEDEAO", "L’Union africaine", "La Banque centrale européenne"], correctIndex: 0, explanation: "Il conçoit les grandes orientations du développement et de l’industrialisation.", sourceLabel: "III-2", points: 1 },
              { prompt: "Quelle correction historique faut-il apporter à la fondation scientifique de 1971 ?", options: ["KAIS est créé en 1971 ; le nom KAIST date de 1981", "KAIST disparaît en 1971", "L’institut est fondé en 1679", "Aucune formation scientifique n’existe"], correctIndex: 0, explanation: "L’institut initial est le KAIS ; la fusion de 1981 crée le KAIST sous ce nom.", sourceLabel: "Correction institutionnelle", points: 2 },
              { prompt: "Quelle mesure soutient directement les entreprises exportatrices ?", options: ["Prêts à taux réduit et avantages fiscaux", "Fermeture de tous les ports", "Interdiction d’importer des matières premières", "Suppression des infrastructures"], correctIndex: 0, explanation: "Le gouvernement réduit certains coûts de financement et de fiscalité liés aux exportations.", sourceLabel: "III-2", points: 1 },
              { prompt: "Quel rôle joue la mobilisation de l’épargne intérieure ?", options: ["Financer davantage l’investissement", "Réduire toutes les compétences", "Supprimer le crédit", "Remplacer les entreprises par des fleuves"], correctIndex: 0, explanation: "L’épargne fournit une partie du capital nécessaire aux équipements et aux entreprises.", sourceLabel: "III-2", points: 1 },
              { prompt: "Qu’est-ce qu’un chaebol ?", options: ["Un grand groupe privé diversifié organisé en nombreuses filiales", "Un fleuve de Séoul", "Une saison de mousson", "Un minerai énergétique"], correctIndex: 0, explanation: "Samsung, Hyundai ou LG illustrent ces conglomérats familiaux de grande taille.", sourceLabel: "III-2", points: 1 },
              { prompt: "Quelle évaluation de l’État-développeur est équilibrée ?", options: ["Il a coordonné le décollage, mais aussi concentré le pouvoir et limité des droits", "Il n’a joué aucun rôle", "Il n’a produit que des avantages sans coût", "Il a supprimé toute entreprise privée"], correctIndex: 0, explanation: "Une analyse complète relie efficacité économique, concentration et contexte autoritaire.", sourceLabel: "Précision critique", points: 2 },
            ],
          },
          {
            bodyMarkdown: String.raw`## Une montée en gamme en trois grandes phases

Le PDF organise le décollage entre **1953 et 1980**. Ce découpage est un outil : dans la réalité, certaines politiques se chevauchent et la promotion des exportations commence avant que toute substitution aux importations soit abandonnée.

| Phase | Productions et moyens | Logique dominante |
|---|---|---|
| 1953-1961 | agriculture, pêche, agroalimentaire, confection, fils ; « trois blancs » : coton, sucre, farine | produire localement des biens auparavant importés |
| 1961-1973 | textiles, vêtements, chaussures ; prêts et avantages aux exportateurs | vendre massivement des produits légers à l’extérieur |
| 1973-1980 | acier, construction navale, chimie, machines ; ports, énergie, parcs industriels | investir dans les industries lourdes et chimiques |
| après 1980-1990 | automobile, électronique puis technologies avancées | monter en qualité, en technologie et en marque |

## 1. Reconstruire par la substitution aux importations

Après l’armistice de 1953, le pays fabrique davantage de biens de consommation courante. Les activités sont intensives en travail et demandent encore peu de capital ou de haute technologie. Les « **trois blancs** » désignent **coton, sucre et farine**, pas trois minerais.

> **Correction de nom.** Le président de cette première période est **Syngman Rhee**, et non « Syngnam Rhee » comme l’imprime le fascicule.

Cette politique reconstitue une base productive et limite certaines importations. Sa demande intérieure reste cependant trop petite pour soutenir seule une croissance durable.

## 2. Se tourner vers les exportations

À partir de 1961, puis plus nettement après la dévaluation du won et les réformes de **1964**, les entreprises reçoivent des incitations liées aux ventes extérieures. Les industries légères exportent textiles, vêtements et chaussures.

Le KDI mesure entre **1962 et 1973** une croissance annuelle moyenne des exportations supérieure à **40 %** ; la part des produits manufacturés dans les exportations passe d’environ **27 % à près de 90 %**. Ces séries contemporaines confirment le mécanisme général, même si elles ne sont pas identiques aux ratios du PDF.

> **Correction statistique majeure.** Le fascicule transforme **48,2 %** en part des exportations dans le PNB et mélange aussi la composition des ventes manufacturières. Dans le tableau de la Banque mondiale dont proviennent ces valeurs, **48,2 % est un taux annuel moyen de croissance des exportations manufacturières**. Pour 1977, les exportations de marchandises représentent environ **25 % du PIB** et les produits manufacturés environ **85 % des exportations**. L’idée de changement d’échelle reste juste ; les colonnes, elles, doivent être rétablies.

## 3. Développer les industries lourdes et chimiques

À partir de 1973, l’État finance acier, chantiers navals, chimie, machines, énergie et grands complexes portuaires. **POSCO** fournit l’acier ; les chaebols investissent dans l’électronique, la construction navale et l’automobile. Écoles techniques et instituts de recherche forment ingénieurs et ouvriers qualifiés.

Selon le PDF, la part de l’industrie lourde dans l’industrie manufacturière passe de **25 % en 1962** à **55 % en 1979**. Cette montée en gamme rend possibles, après 1990, la puissance automobile, l’électronique grand public puis les semi-conducteurs et le numérique.

## Lire la trajectoire sans raconter un miracle automatique

Le décollage associe **continuité** et **rupture** : chaque phase conserve des acquis de la précédente, tandis que crises pétrolières, concurrence, endettement et crise asiatique de 1997 obligent ensuite le modèle à évoluer. « Miracle » désigne la rapidité du changement ; il ne supprime ni le travail, ni les choix, ni les conflits, ni les vulnérabilités.

> **Astuce mémoire de Davy.** Retenir **remplacer → exporter → alourdir → innover** : remplacer des importations ; exporter du léger ; construire du lourd ; monter vers la technologie.` ,
            interaction: {
              kind: "diagram",
              eyebrow: "Classer",
              title: "La montée en gamme industrielle",
              instruction: "Sélectionne un maillon pour rattacher une action à sa phase principale.",
              observation: "Les phases s’enchaînent et se chevauchent : elles montrent une direction dominante, pas des frontières parfaitement étanches.",
              rootLabel: "1953 → technologies avancées",
              rootDetail: "Produire localement, exporter, s’équiper puis innover",
              nodes: [
                { id: "reconstruction", group: "1953-1961", label: "Reconstruction", role: "Relancer la production", detail: "Après la guerre, agriculture, pêche et biens courants répondent aux besoins immédiats." },
                { id: "three-whites", group: "1953-1961", label: "Trois blancs", role: "Substituer aux importations", detail: "Coton, sucre et farine illustrent les premières productions locales soutenues." },
                { id: "light-exports", group: "1961-1973", label: "Textiles et chaussures", role: "Exporter du léger", detail: "Une main-d’œuvre de mieux en mieux formée produit pour des marchés extérieurs." },
                { id: "heavy", group: "1973-1980", label: "Acier et navires", role: "Construire du lourd", detail: "POSCO, chantiers navals, chimie et parcs industriels augmentent l’intensité capitalistique." },
                { id: "electronics", group: "Après 1980", label: "Automobile et électronique", role: "Monter en gamme", detail: "Les capacités accumulées servent des biens plus complexes, des marques et des chaînes mondiales." },
                { id: "innovation", group: "Après 1990", label: "Recherche et numérique", role: "Innover", detail: "R&D, universités et entreprises soutiennent semi-conducteurs, télécommunications et services technologiques." },
              ],
            },
            extraQuestions: [
              { prompt: "À quelle phase rattacher la production locale de biens de consommation courante ?", options: ["Substitution aux importations", "Industries lourdes", "Technologies numériques", "Union monétaire"], correctIndex: 0, explanation: "Entre 1953 et 1961, le pays reconstruit une base locale de biens auparavant importés.", sourceLabel: "Activité d’application n°3", points: 1 },
              { prompt: "Que désignent les « trois blancs » ?", options: ["Coton, sucre et farine", "Argent, zinc et fer", "Riz, thé et café", "Acier, navires et automobiles"], correctIndex: 0, explanation: "Cette politique de première phase concerne coton, sucre et farine.", sourceLabel: "Activité d’application n°3", points: 1 },
              { prompt: "Le développement de l’agroalimentaire appartient principalement à…", options: ["la phase de substitution aux importations", "la phase des semi-conducteurs", "la seule période après 1990", "la disparition de l’État"], correctIndex: 0, explanation: "Il contribue d’abord à satisfaire localement les besoins de la reconstruction.", sourceLabel: "Exercice 2", points: 1 },
              { prompt: "Quelle phase domine entre 1961 et 1973 ?", options: ["La promotion audacieuse des exportations", "La fermeture commerciale", "La désindustrialisation", "La reforestation uniquement"], correctIndex: 0, explanation: "L’État pousse les industries légères vers les marchés extérieurs.", sourceLabel: "III-3", points: 1 },
              { prompt: "Quels produits symbolisent les exportations légères ?", options: ["Textiles, vêtements et chaussures", "Pétrole brut et uranium", "Avions et satellites dès 1953", "Seulement du blé"], correctIndex: 0, explanation: "Les industries légères intensives en travail ouvrent la phase exportatrice.", sourceLabel: "III-3", points: 1 },
              { prompt: "Quel repère le KDI donne-t-il pour les exportations entre 1962 et 1973 ?", options: ["Plus de 40 % de croissance annuelle moyenne", "Une baisse annuelle de 40 %", "Aucune exportation manufacturée", "Une part toujours limitée à 1 %"], correctIndex: 0, explanation: "Cette croissance très rapide accompagne le passage à une stratégie tournée vers l’extérieur.", sourceLabel: "Mise en perspective KDI", points: 2 },
              { prompt: "Que mesure correctement la valeur de 48,2 % dans le tableau d’origine ?", options: ["La croissance annuelle moyenne des exportations manufacturières", "La part des exportations dans le PNB", "La part de l’industrie lourde en 1979", "Le taux d’alphabétisation"], correctIndex: 0, explanation: "Le PDF a confondu la colonne de croissance annuelle avec une part du PNB.", sourceLabel: "Correction Banque mondiale, III-3", points: 2 },
              { prompt: "Quelle phase commence en 1973 ?", options: ["Les industries lourdes et chimiques", "La substitution primaire uniquement", "La colonisation japonaise", "La suppression de POSCO"], correctIndex: 0, explanation: "Acier, chimie, construction navale et grands complexes deviennent prioritaires.", sourceLabel: "Activité d’application n°3", points: 1 },
              { prompt: "Quelle entreprise illustre la sidérurgie ?", options: ["POSCO", "KOSTAT", "KAIS", "Nakdong"], correctIndex: 0, explanation: "La Pohang Iron and Steel Company, devenue POSCO, porte la production d’acier.", sourceLabel: "III-3", points: 1 },
              { prompt: "Quelle évolution de l’industrie lourde le PDF annonce-t-il ?", options: ["25 % en 1962 à 55 % en 1979", "55 % en 1962 à 25 % en 1979", "3,3 % en 1962 à 4,9 % en 1979", "88 % en 1945 à 22 % en 1970"], correctIndex: 0, explanation: "La part de l’industrie lourde augmente nettement dans la valeur manufacturière.", sourceLabel: "III-3", points: 1 },
              { prompt: "Quels secteurs se renforcent particulièrement après 1990 selon le cours ?", options: ["Automobile et électronique grand public", "Coton et farine seulement", "Pêche artisanale uniquement", "Extraction massive de pétrole"], correctIndex: 0, explanation: "Ils prolongent la montée en gamme industrielle sud-coréenne.", sourceLabel: "III-3", points: 1 },
              { prompt: "Quelle phrase classe correctement deux actions ?", options: ["Produits légers exportés : phase 2 ; coopération État-chaebols pour le lourd : phase 3", "Trois blancs : phase 3 ; acier : phase 1", "Substitution : après 1990 uniquement ; exportation : avant 1945", "Automobile : phase de reconstruction ; farine : haute technologie"], correctIndex: 0, explanation: "L’exportation de produits légers précède l’effort coordonné dans l’industrie lourde.", sourceLabel: "Exercice 2", points: 2 },
            ],
          },
        ],
        keyPoint: "La réussite sud-coréenne associe planification publique, entreprises puissantes, recherche, épargne et conquête des marchés extérieurs.",
        example: "Samsung, chaebol privé, et POSCO, entreprise sidérurgique alors publique, illustrent deux formes distinctes de coopération avec l’État.",
        timelineTitle: "Les trois phases du décollage industriel",
        timelineInstruction: "Fais défiler les étapes de la stratégie économique sud-coréenne entre 1953 et 1980.",
        timeline: [
          { label: "1953-1971 : influences extérieures et État-développeur", shortLabel: "Aides et État stratège", detail: "L’aide américaine soutient la reconstruction ; à partir de 1961, planification, crédit, épargne, science et chaebols organisent l’investissement." },
          { label: "1953-1973 : substitution puis exportation", shortLabel: "Substitution-exportation", detail: "Le pays produit d’abord des biens courants, puis exporte massivement textiles, vêtements et chaussures." },
          { label: "1973-1990 : industrie lourde puis montée technologique", shortLabel: "Industries lourdes-technologie", detail: "Sidérurgie, construction navale et chimie préparent automobile, électronique et innovation." },
        ],
        observation: "Chaque phase s’appuie sur les acquis de la précédente et augmente progressivement la valeur technologique des productions.",
        check: { prompt: "Comment appelle-t-on les grands conglomérats sud-coréens ?", options: ["Les sovkhozes", "Les chaebols", "Les ACP", "Les EAMA"], correctIndex: 1, explanation: "Les chaebols regroupent de grandes entreprises de secteurs variés." },
        distractors: ["L’État sud-coréen reste totalement absent de l’économie.", "La stratégie coréenne refuse les exportations.", "Les industries lourdes précèdent la reconstruction de 1953."],
      },
    ],
  },
  {
    id: "terminale-hg-g6-ecowas",
    strand: "Géographie",
    chapterNumber: 6,
    themeNumber: 3,
    themeTitle: "Regroupements et coopération économique",
    title: "La CEDEAO : une organisation régionale à caractère économique",
    description: "Présenter l’espace CEDEAO dans son évolution, comprendre ses institutions et apprécier avec nuance ses réalisations et ses limites.",
    sections: [
      {
        id: "creation-objectives",
        title: "Naissance, espace et objectifs",
        summary: "Retracer la formation de la CEDEAO, identifier ses membres actuels et expliquer son projet d’intégration.",
        conceptTitle: "Une communauté ouest-africaine dont le périmètre a évolué",
        explanation: "Quinze États signent le traité de Lagos le 28 mai 1975. Le Cabo Verde rejoint la Communauté en 1977, la Mauritanie se retire en décembre 2000, puis le Burkina Faso, le Mali et le Niger cessent officiellement d’en être membres le 29 janvier 2025. La CEDEAO compte donc douze États membres en 2026.",
        bodyMarkdown: String.raw`## D’une idée régionale au traité de Lagos

*Mise à jour institutionnelle : 18 août 2026.*

Le projet d’unir les économies ouest-africaines ne naît pas en une seule réunion. En **1964**, le président libérien **William Tubman** propose une union économique ; un accord est signé en 1965 par la Côte d’Ivoire, la Guinée, le Liberia et la Sierra Leone. En **1972**, le Nigérian **Yakubu Gowon** et le Togolais **Gnassingbé Eyadéma** relancent le projet à l’échelle régionale.

Le **28 mai 1975**, quinze États signent à Lagos le traité instituant la Communauté économique des États de l’Afrique de l’Ouest. Le Sénégal est représenté par son ministre des Affaires étrangères.

| Repère | Configuration de la Communauté |
|---|---|
| 28 mai 1975 | 15 États signataires du traité de Lagos |
| 1977 | le Cabo Verde adhère : 16 membres |
| 1993 | le traité révisé élargit le projet économique aux enjeux politiques, juridiques et sécuritaires |
| décembre 2000 | la Mauritanie se retire : 15 membres |
| 29 janvier 2025 | retrait effectif du Burkina Faso, du Mali et du Niger : 12 membres |

> **Corrections de chronologie.** Le fascicule attribue l’idée de 1968 à « Williams Tolbert », annonce **seize États dès la signature** et place le retrait mauritanien en **1999**. L’histoire officielle de la CEDEAO retient la proposition de William **Tubman** en 1964, quinze signataires en 1975, l’adhésion du Cabo Verde en 1977 et le retrait de la Mauritanie en décembre 2000.

## Douze États membres en 2026

La carte imprimée dans le PDF restitue la configuration à quinze membres qui existait lors de sa rédaction. Depuis le 29 janvier 2025, la liste institutionnelle est la suivante :

| Langue officielle héritée de l’administration | États membres actuels |
|---|---|
| français | Bénin, Côte d’Ivoire, Guinée, Sénégal, Togo |
| anglais | Gambie, Ghana, Liberia, Nigeria, Sierra Leone |
| portugais | Cabo Verde, Guinée-Bissau |

Ces trois catégories ne résument pas les peuples : la région compte de très nombreuses langues africaines transfrontalières. Elles peuvent faciliter les échanges au-delà des frontières et ne doivent pas être réduites à des « barrières » fixes.

Le retrait du Burkina Faso, du Mali et du Niger est **juridiquement effectif**. La période formelle de transition du 29 janvier au **29 juillet 2025** est achevée. Pour éviter une rupture brutale dans la vie des populations, la CEDEAO demande néanmoins, jusqu’à nouvel ordre, la reconnaissance de leurs passeports et cartes d’identité portant son logo, le maintien de la circulation sans visa et le traitement de leurs biens selon le Schéma de libéralisation des échanges. Des négociations post-retrait se poursuivent avec l’Alliance des États du Sahel. **Appartenance institutionnelle, période de transition et mesures pratiques intérimaires ne sont donc pas la même chose.**

> **Donnée datée.** Les quelque **5,1 millions de km²** et « plus de 300 millions d’habitants » du cours décrivaient l’ancienne configuration régionale. Le retrait de trois grands États sahéliens change mécaniquement ces totaux : ils ne doivent pas être présentés comme les dimensions actuelles des douze membres.

## Un objectif : transformer la coopération en union économique

Le traité révisé définit un enchaînement : **coopérer → coordonner les politiques → intégrer les marchés → améliorer les conditions de vie**.

Les objectifs du fascicule restent pertinents :

- supprimer progressivement les obstacles douaniers et faciliter le commerce régional ;
- assurer la libre circulation des personnes, des biens, des services et des capitaux ;
- coordonner agriculture, industrie, énergie, transports et télécommunications ;
- progresser vers une union économique et monétaire ;
- élever le niveau de vie, renforcer la stabilité et contribuer au développement du continent.

Ils s’appuient sur l’égalité et l’interdépendance des États, la solidarité, la non-agression, le règlement pacifique des différends, la démocratie, l’État de droit et le respect des droits fondamentaux.

> **Astuce mémoire de Davy.** Retenir **CIRCULER – COORDONNER – STABILISER – PROSPÉRER** : la mobilité et les échanges nécessitent des politiques communes ; celles-ci doivent servir la paix et l’amélioration des conditions de vie.` ,
        interaction: {
          kind: "diagram",
          eyebrow: "Actualiser",
          title: "Une communauté au périmètre évolutif",
          instruction: "Sélectionne un repère pour distinguer fondation, adhésion, retraits et continuité de l’intégration.",
          observation: "Le nombre d’États membres dépend d’une date précise ; une carte ancienne ne décrit pas automatiquement la situation actuelle.",
          rootLabel: "CEDEAO",
          rootDetail: "Coopérer et intégrer les économies ouest-africaines",
          nodes: [
            { id: "proposal", group: "Genèse", label: "1964-1972", role: "Préparer l’union", detail: "William Tubman propose une union en 1964 ; Yakubu Gowon et Gnassingbé Eyadéma portent un projet régional en 1972." },
            { id: "lagos", group: "Fondation", label: "Lagos 1975", role: "15 signataires", detail: "Le traité du 28 mai crée la Communauté avec un mandat d’intégration économique." },
            { id: "cabo-verde", group: "Élargissement", label: "Cabo Verde 1977", role: "16 membres", detail: "L’adhésion du Cabo Verde ajoute le second État lusophone de la Communauté." },
            { id: "revised-treaty", group: "Réforme", label: "Traité révisé 1993", role: "Élargir le mandat", detail: "L’intégration économique est reliée à la paix, au droit, aux institutions et à la sécurité régionale." },
            { id: "mauritania", group: "Retrait", label: "Mauritanie 2000", role: "15 membres", detail: "La Mauritanie se retire en décembre 2000, puis conclut un accord d’association en 2017." },
            { id: "withdrawals", group: "Retraits", label: "29 janvier 2025", role: "12 membres", detail: "Burkina Faso, Mali et Niger se retirent ; des arrangements pratiques protègent encore la mobilité et les échanges jusqu’à nouvel ordre." },
          ],
        },
        keyPoint: "La CEDEAO vise une union économique au service des populations, mais son périmètre institutionnel est passé de quinze signataires en 1975 à douze membres en 2026.",
        example: "La libre circulation et le Schéma de libéralisation des échanges donnent une traduction concrète au projet d’intégration.",
        timelineTitle: "De l’idée d’union à la configuration actuelle",
        timelineInstruction: "Parcours les étapes qui transforment une initiative politique en communauté régionale.",
        timeline: [
          { label: "1964-1972", detail: "La proposition de William Tubman, puis la tournée de Yakubu Gowon et Gnassingbé Eyadéma, préparent le traité." },
          { label: "28 mai 1975", shortLabel: "Lagos 1975", detail: "Quinze États signent le traité de Lagos et créent la CEDEAO." },
          { label: "1993", detail: "Le traité révisé élargit le mandat et renforce l’architecture institutionnelle." },
          { label: "1977-2000", shortLabel: "Adhésion et retrait", detail: "Le Cabo Verde adhère en 1977 ; la Mauritanie se retire en décembre 2000." },
          { label: "29 janvier 2025", shortLabel: "12 membres", detail: "Le retrait du Burkina Faso, du Mali et du Niger devient effectif." },
        ],
        observation: "L’intégration régionale cherche à dépasser l’étroitesse des marchés nationaux tout en respectant les choix souverains prévus par le traité.",
        check: { prompt: "Où et quand la CEDEAO est-elle créée ?", options: ["À Lagos en 1975", "À Addis-Abeba en 1963", "À Rome en 1957", "À Lomé en 2000"], correctIndex: 0, explanation: "La CEDEAO est créée le 28 mai 1975 à Lagos." },
        extraQuestions: [
          { prompt: "La CEDEAO a été créée en 1957.", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Elle naît le 28 mai 1975 ; 1957 renvoie notamment au traité de Rome, pas au traité de Lagos.", sourceLabel: "Activité d’application n°1, affirmation 1", points: 1 },
          { prompt: "Combien d’États signent le traité de Lagos en 1975 ?", options: ["12", "16", "15", "27"], correctIndex: 2, explanation: "Quinze États sont signataires ; le Cabo Verde adhère ensuite.", sourceLabel: "Correction historique CEDEAO", points: 2 },
          { prompt: "Quel événement porte la Communauté à seize membres ?", options: ["Le retrait de la Mauritanie", "Le traité de Rome", "La création de l’Union africaine", "L’adhésion du Cabo Verde en 1977"], correctIndex: 3, explanation: "Le Cabo Verde rejoint les quinze signataires initiaux en 1977.", sourceLabel: "Mise à jour historique", points: 2 },
          { prompt: "Quand la Mauritanie se retire-t-elle officiellement ?", options: ["En mai 1975", "En décembre 2000", "En janvier 2025", "En juillet 1993"], correctIndex: 1, explanation: "Le retrait intervient en décembre 2000, et non en 1999 comme l’indique le PDF.", sourceLabel: "Correction de source", points: 2 },
          { prompt: "Combien d’États la CEDEAO compte-t-elle depuis le 29 janvier 2025 ?", options: ["15", "16", "12", "5"], correctIndex: 2, explanation: "Burkina Faso, Mali et Niger se sont retirés de la Communauté.", sourceLabel: "Mise à jour CEDEAO 2025", points: 2 },
          { prompt: "Quels trois États ont cessé d’être membres à cette date ?", options: ["Ghana, Nigeria et Togo", "Cabo Verde, Gambie et Guinée-Bissau", "Bénin, Sénégal et Côte d’Ivoire", "Burkina Faso, Mali et Niger"], correctIndex: 3, explanation: "Leur préavis d’un an a abouti au retrait effectif du 29 janvier 2025.", sourceLabel: "Mise à jour CEDEAO 2025", points: 2 },
          { prompt: "La superficie actuelle des douze membres est exactement de 5 900 162 km².", options: ["Vrai", "Faux"], correctIndex: 1, explanation: "Le PDF fournit deux chiffres incompatibles — 5 900 162 km² dans l’activité et environ 5,1 millions de km² dans le cours — calculés sur l’ancien périmètre. Aucun ne décrit les douze membres actuels.", sourceLabel: "Activité d’application n°1, affirmation 2", points: 1 },
          { prompt: "Comment traiter l’affirmation du PDF selon laquelle la CEDEAO compte quinze États ?", options: ["Comme une vérité intemporelle", "Comme la liste de tous les pays africains", "Comme un repère historique valable avant le retrait effectif de 2025", "Comme le nombre de langues locales"], correctIndex: 2, explanation: "Une donnée institutionnelle doit toujours être rattachée à une date.", sourceLabel: "Activité d’application n°1, affirmation 3", points: 2 },
          { prompt: "Contribuer au développement du continent africain fait partie des objectifs de la CEDEAO.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Le traité relie intégration ouest-africaine, amélioration du niveau de vie et progrès continental.", sourceLabel: "Activité d’application n°1, affirmation 4", points: 1 },
          { prompt: "La non-agression entre les États membres est un principe communautaire.", options: ["Vrai", "Faux"], correctIndex: 0, explanation: "Elle accompagne le règlement pacifique des différends, la solidarité et la stabilité régionale.", sourceLabel: "Activité d’application n°1, affirmation 5", points: 1 },
          { prompt: "Quel objectif traduit le mieux l’intégration régionale ?", options: ["Fermer chaque marché national", "Supprimer toute institution commune", "Interdire les infrastructures transfrontalières", "Faciliter la circulation et coordonner les politiques"], correctIndex: 3, explanation: "La Communauté veut relier les marchés, les réseaux et les politiques publiques.", sourceLabel: "I-2, objectifs spécifiques", points: 1 },
        ],
        distractors: ["La CEDEAO conserve exactement le même périmètre depuis 1975.", "Son objectif principal est de fermer les frontières régionales.", "Elle interdit toute coopération économique entre ses membres."],
      },
      {
        id: "institutions",
        title: "Structure et fonctionnement",
        summary: "Classer les organes de décision, d’exécution, de représentation, de justice et de financement.",
        conceptTitle: "Décider, exécuter, représenter, juger et financer",
        explanation: "La Conférence des chefs d’État et de gouvernement fixe les orientations ; le Conseil des ministres prépare les politiques ; la Commission les exécute. Le Parlement, la Cour de justice, la BIDC et les agences spécialisées complètent cette architecture sans exercer les mêmes pouvoirs.",
        bodyMarkdown: String.raw`## Une architecture, plusieurs fonctions

Une institution régionale n’agit pas comme un gouvernement unique. Les États décident ensemble, puis des organes communautaires préparent, exécutent, contrôlent, représentent ou financent.

| Institution | Fonction essentielle | Repère à retenir |
|---|---|---|
| Conférence des chefs d’État et de gouvernement | fixe les orientations et prend les décisions majeures | organe suprême de la Communauté |
| Conseil des ministres | formule des recommandations, adopte des règlements et prépare les dossiers | réunit les ministres compétents pour les affaires de la CEDEAO |
| Commission | exécute les décisions, prépare programmes et budgets, administre la Communauté | siège à Abuja |
| Parlement de la Communauté | débat, représente les peuples et rend des avis | première législature inaugurée le 16 novembre 2000 |
| Cour de justice | interprète le droit communautaire et juge notamment des violations des droits humains | cinq juges ; accès direct des particuliers élargi en 2005 |
| BIDC | finance des projets publics et privés ainsi que le commerce régional | siège à Lomé |

## La chaîne de décision

1. La **Conférence** fixe une orientation commune.
2. Le **Conseil** examine les politiques et les textes nécessaires.
3. La **Commission** prépare et met en œuvre programmes, budget et suivi.
4. Le **Parlement** débat et formule des avis ; il n’est pas encore un législateur supranational comparable à un parlement national.
5. La **Cour** vérifie le respect du droit dans les affaires dont elle est saisie.
6. La **BIDC** peut financer les infrastructures, l’énergie, les télécommunications, l’agriculture ou le secteur privé.

> **Corrections institutionnelles.** Le fascicule date la création du Parlement de **2006** et lui attribue le pouvoir de « légiférer sur des lois uniformes ». Le traité révisé l’institue en 1993 et sa première législature est inaugurée en **2000** ; sa fonction demeure surtout consultative et représentative. Les noms d’Issoufou Mahamadou et de Jean-Claude Brou décrivaient les responsables de **2019-2021** : une fonction doit être apprise avant son titulaire, qui change.

## Des institutions et agences spécialisées

- l’**Organisation ouest-africaine de la santé (OOAS/WAHO)** coordonne les questions sanitaires ;
- le **Système d’échanges d’énergie électrique ouest-africain (WAPP)** relie progressivement les réseaux électriques ;
- le **Centre de coordination des ressources en eau** soutient la gestion régionale ;
- l’**Agence monétaire de l’Afrique de l’Ouest (AMAO/WAMA)** contribue à la coopération monétaire ;
- l’**Institut monétaire de l’Afrique de l’Ouest (IMAO/WAMI)** prépare les travaux de la zone monétaire ouest-africaine : AMAO et IMAO ne sont pas deux noms du même organisme ;
- la **BIDC** finance le développement et le commerce intrarégional.

> **Correction de vocabulaire.** Le PDF écrit « système d’échange d’énergie **électronique** ». Il s’agit d’énergie **électrique** et d’interconnexion des réseaux.

Il faut aussi distinguer les ensembles : la **BOAD** relève de l’UEMOA, pas de la CEDEAO ; **Ecobank** est une banque commerciale privée, même si son histoire est régionale. Les citer comme acteurs de l’Afrique de l’Ouest ne les transforme pas en organes communautaires.

> **Astuce mémoire de Davy.** **C-C-C-P-C-B** : Conférence décide ; Conseil prépare ; Commission exécute ; Parlement représente ; Cour juge ; Banque finance.` ,
        interaction: {
          kind: "diagram",
          eyebrow: "Organiser",
          title: "Du choix politique au résultat régional",
          instruction: "Sélectionne une institution pour identifier son pouvoir propre et éviter de confondre les rôles.",
          observation: "L’efficacité dépend de la continuité entre décision commune, mise en œuvre nationale, contrôle juridique et financement.",
          rootLabel: "Action communautaire",
          rootDetail: "Une décision ne produit d’effet que si plusieurs institutions coopèrent",
          nodes: [
            { id: "authority", group: "Direction", label: "Conférence", role: "Décider", detail: "Les chefs d’État et de gouvernement fixent les orientations et arbitrent les grandes questions." },
            { id: "council", group: "Direction", label: "Conseil des ministres", role: "Préparer et réglementer", detail: "Les ministres examinent les dossiers, adoptent des règlements et préparent les sessions de la Conférence." },
            { id: "commission", group: "Exécution", label: "Commission", role: "Mettre en œuvre", detail: "Elle administre la Communauté, prépare programmes et budgets, puis suit leur exécution." },
            { id: "parliament", group: "Représentation", label: "Parlement", role: "Débattre et conseiller", detail: "Il représente les peuples et formule des avis, sans disposer encore de tous les pouvoirs d’un parlement national." },
            { id: "court", group: "Justice", label: "Cour de justice", role: "Dire le droit", detail: "Elle interprète le droit communautaire et peut être saisie dans des affaires de droits humains." },
            { id: "ebid", group: "Financement", label: "BIDC", role: "Financer", detail: "Basée à Lomé, elle soutient projets publics, entreprises privées et échanges intrarégionaux." },
          ],
        },
        keyPoint: "La CEDEAO répartit l’action entre décision politique, préparation, exécution, représentation, justice, expertise et financement.",
        example: "La BIDC finance des projets, tandis que la Cour de justice veille à l’interprétation et à l’application du droit communautaire.",
        timelineTitle: "Suivre une politique communautaire",
        timelineInstruction: "Suis le chemin d’une orientation depuis la Conférence jusqu’à sa mise en œuvre et son contrôle.",
        timeline: [
          { label: "Conférence", detail: "Les chefs d’État et de gouvernement définissent les orientations de la Communauté." },
          { label: "Conseil et Commission", shortLabel: "Préparation et exécution", detail: "Les ministres préparent et réglementent ; la Commission administre et met en œuvre." },
          { label: "Parlement, Cour et BIDC", shortLabel: "Représentation, droit et financement", detail: "Débat, contrôle juridique et financement complètent la chaîne d’action." },
        ],
        observation: "Une décision régionale n’est utile que si les États l’appliquent effectivement dans leurs politiques nationales.",
        check: { prompt: "Quel organe réunit les chefs d’État et fixe les grandes orientations ?", options: ["La Conférence", "La Cour internationale de justice", "Le STABEX", "L’UNESCO"], correctIndex: 0, explanation: "La Conférence des chefs d’État et de gouvernement est l’organe politique majeur." },
        extraQuestions: [
          { prompt: "Dans l’activité de classement, où placer le Conseil des ministres ?", options: ["Organes politiques et administratifs", "Organes judiciaires", "Organes miniers", "Organes sportifs"], correctIndex: 0, explanation: "Il prépare les politiques et participe à la direction de la Communauté.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Dans quelle catégorie placer la Commission ?", options: ["Judiciaire", "Économique privée", "Politique et administrative", "Militaire nationale"], correctIndex: 2, explanation: "La Commission assure l’administration et l’exécution quotidiennes.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Le Parlement communautaire appartient surtout à quelle fonction ?", options: ["Financement bancaire", "Commandement militaire", "Extraction minière", "Représentation et débat politique"], correctIndex: 3, explanation: "Il représente les peuples, débat et rend des avis.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Où classer le Conseil économique et social mentionné par le fascicule ?", options: ["Organes judiciaires", "Organes militaires", "Organes économiques et sociaux", "Entreprises privées"], correctIndex: 2, explanation: "Sa fonction annoncée est consultative sur les questions économiques et sociales.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Où classer la Banque d’investissement et de développement de la CEDEAO ?", options: ["Organes judiciaires", "Chefferies d’État", "Associations sportives", "Organes économiques et financiers"], correctIndex: 3, explanation: "La BIDC finance des projets et des activités économiques.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Quel élément de la liste est l’organe judiciaire ?", options: ["La Cour de justice de la Communauté", "La Commission", "La BIDC", "Le Conseil des ministres"], correctIndex: 0, explanation: "La Cour interprète le droit communautaire et tranche les affaires relevant de sa compétence.", sourceLabel: "Activité d’application n°2", points: 1 },
          { prompt: "Pourquoi vaut-il mieux mémoriser la fonction d’un organe que le nom de son titulaire ?", options: ["Les fonctions disparaissent à chaque sommet", "Tous les titulaires sont élus à vie", "Les titulaires changent, tandis que le rôle institutionnel reste le repère durable", "Les institutions n’ont aucun mandat"], correctIndex: 2, explanation: "Les noms cités par le PDF décrivaient la période 2019-2021, alors que les fonctions demeurent les repères stables.", sourceLabel: "Précision institutionnelle", points: 2 },
          { prompt: "Quel repère corrige la date 2006 donnée par le PDF pour le Parlement ?", options: ["Création en 1957", "Suppression en 1993", "Transfert à Lomé en 2025", "Institué en 1993 ; première législature inaugurée en novembre 2000"], correctIndex: 3, explanation: "Le traité révisé l’institue en 1993 et la première législature s’ouvre en 2000.", sourceLabel: "Correction de source", points: 2 },
          { prompt: "Quelle association concernant la BIDC est exacte ?", options: ["Siège à Lomé et financement de projets publics ou privés", "Siège à Rome et contrôle des élections", "Siège à Bamako et commandement des armées", "Siège à Paris et impression de l’euro"], correctIndex: 0, explanation: "La BIDC est l’institution financière de développement de la Communauté.", sourceLabel: "II-2", points: 1 },
          { prompt: "Quelle distinction monétaire est correcte ?", options: ["L’AMAO et l’IMAO sont deux noms d’une même banque privée", "L’IMAO dirige la Cour de justice", "L’AMAO/WAMA coordonne la coopération monétaire ; l’IMAO/WAMI prépare la zone monétaire ouest-africaine", "L’AMAO imprime déjà l’ECO"], correctIndex: 2, explanation: "Les deux organismes ont des mandats liés mais distincts et ne doivent pas être confondus.", sourceLabel: "Commissions techniques", points: 2 },
          { prompt: "Quelle institution ne doit pas être confondue avec un organe de la CEDEAO ?", options: ["La Commission", "La Cour de justice", "La Conférence", "La BOAD, institution de l’UEMOA"], correctIndex: 3, explanation: "La BOAD intervient en Afrique de l’Ouest, mais relève de l’UEMOA.", sourceLabel: "Précision institutionnelle", points: 2 },
        ],
        distractors: ["Toutes les institutions de la CEDEAO exercent le même pouvoir.", "La Cour de justice dirige les armées nationales.", "La Commission n’intervient jamais dans l’exécution des décisions."],
      },
      {
        id: "achievements-limits",
        title: "Forces, réalisations et limites",
        summary: "Évaluer libre circulation, interventions de paix, infrastructures et obstacles à l’intégration.",
        conceptTitle: "Mettre les acquis en regard des obstacles",
        explanation: "L’espace ouest-africain associe ressources, population, littoraux et institutions régionales. Libre circulation, commerce, énergie, santé, infrastructures et médiations traduisent cette coopération, mais crises politiques, insécurité, faible transformation locale, obstacles frontaliers et retraits d’États maintiennent l’intégration inachevée.",
        parts: [
          {
            keyPoint: "Ressources, population et position deviennent des atouts lorsque des règles communes, des réseaux et des institutions les transforment en bénéfices partagés.",
            example: "Le WAPP transforme des capacités électriques nationales en échanges régionaux grâce aux interconnexions.",
            bodyMarkdown: String.raw`## Des potentialités, pas un développement automatique

Le fascicule rassemble trois familles d’atouts. Elles doivent être reliées à des **aménagements**, des compétences et des règles communes :

| Potentialité | Exemples du cours | Condition de valorisation |
|---|---|---|
| minerais et énergie | or, bauxite, fer, manganèse, uranium, pétrole, gaz | transformer localement, sécuriser les sites, partager les revenus et protéger l’environnement |
| agriculture et eau | cacao, café, riz, maïs, arachide, palmier, hydrographie et pêche | irrigation, stockage, recherche, chaînes de valeur et accès au marché |
| façades maritimes | ports du golfe de Guinée et ouverture atlantique | corridors, douanes efficaces et sécurité maritime |
| population et villes | main-d’œuvre, consommateurs, entrepreneuriat et mobilités | éducation, santé, emplois, inclusion et infrastructures |
| institutions financières | BIDC, agences monétaires et banques régionales | projets viables, transparence et financement de long terme |

Les pourcentages miniers, pétroliers ou agricoles du PDF ne sont pas datés et changent selon le périmètre. Il faut retenir la **diversité des ressources**, non des parts mondiales présentées comme permanentes.

## Des réalisations politiques et humaines

Le Protocole de 1979 organise la **libre circulation, la résidence et l’établissement**. Il prévoit notamment une entrée sans visa pouvant aller jusqu’à **90 jours**. Passeport et carte d’identité biométrique rendent l’appartenance régionale concrète, même si tous les contrôles ne sont pas fluides. En avril 2026, sept membres avaient effectivement déployé la carte biométrique : l’outil commun reste donc en cours d’harmonisation.

La CEDEAO intervient aussi dans la prévention et la gestion des crises :

- médiations, sommets et sanctions contre certaines ruptures anticonstitutionnelles ;
- opérations historiques de l’**ECOMOG**, notamment au Liberia et en Sierra Leone ;
- mécanismes d’alerte, coopération sécuritaire et communiqués de solidarité ;
- coordination sanitaire, illustrée par l’OOAS lors des épidémies.

Une sanction n’est cependant ni une preuve de succès automatique ni une réponse sans coût : il faut examiner son objectif, sa légalité, ses effets sur les dirigeants et ses conséquences pour les populations.

## Des réalisations économiques et techniques

- le **Schéma de libéralisation des échanges de la CEDEAO (SLE/ETLS)** accorde un traitement préférentiel aux produits originaires ;
- le **tarif extérieur commun** rapproche les politiques douanières ;
- **SIGMAT** interconnecte progressivement les systèmes douaniers pour suivre le transit ;
- le **WAPP** relie les réseaux électriques et favorise les échanges d’énergie ;
- routes, télécommunications, corridors, santé, agriculture et financement de la BIDC soutiennent des projets régionaux.

> **Corrections d’attribution.** La **BOAD** finance les pays de l’UEMOA, pas la CEDEAO entière. **Ecobank** est une entreprise bancaire privée. L’ADRAO, aujourd’hui AfricaRice, est un centre régional de recherche : le réduire à un simple « projet de riz de la CEDEAO » est imprécis.

La « ceinture verte » du fascicule doit elle aussi être attribuée avec prudence : la **Grande Muraille verte** est une initiative portée à l’échelle de l’Union africaine avec plusieurs États et partenaires, non une création exclusive de la CEDEAO.

> **Astuce mémoire de Davy.** Un acquis régional se vérifie avec trois questions : **quelle règle ? quel outil ? quel effet concret pour les populations ?**` ,
            interaction: {
              kind: "diagram",
              eyebrow: "Relier",
              title: "Transformer les potentialités en réalisations",
              instruction: "Sélectionne un levier pour suivre le passage de la ressource à l’intégration.",
              observation: "Une ressource naturelle ou humaine devient un atout seulement si des institutions, des réseaux et des règles communes la valorisent.",
              rootLabel: "Potentialités régionales",
              rootDetail: "Ressources, population et position ne produisent des résultats qu’après coopération",
              nodes: [
                { id: "mobility", group: "Population", label: "Libre circulation", role: "Relier les personnes", detail: "L’entrée sans visa jusqu’à 90 jours, puis la résidence et l’établissement organisés progressivement, facilitent les mobilités régionales." },
                { id: "trade", group: "Marché", label: "ETLS et tarif commun", role: "Relier les marchés", detail: "Le traitement préférentiel des produits originaires et des règles douanières communes réduisent certains obstacles." },
                { id: "transit", group: "Marché", label: "SIGMAT", role: "Sécuriser le transit", detail: "L’échange numérique d’informations douanières suit les marchandises et peut réduire délais et détournements." },
                { id: "energy", group: "Réseaux", label: "WAPP", role: "Échanger l’électricité", detail: "Les interconnexions permettent de partager des capacités électriques entre systèmes nationaux." },
                { id: "health", group: "Services", label: "OOAS", role: "Coordonner la santé", detail: "La coopération sanitaire et la surveillance régionale répondent aux épidémies transfrontalières." },
                { id: "peace", group: "Sécurité", label: "Médiation et ECOMOG", role: "Protéger la stabilité", detail: "La Communauté combine diplomatie, décisions politiques et, historiquement, opérations de paix." },
              ],
            },
            extraQuestions: [
              { prompt: "Pourquoi les minerais sont-ils seulement des potentialités ?", options: ["Ils doivent être transformés, gérés et reliés à l’économie locale", "Ils créent automatiquement des emplois décents", "Ils suppriment tous les conflits", "Ils remplacent l’éducation"], correctIndex: 0, explanation: "La ressource brute ne garantit ni valeur ajoutée locale ni développement partagé.", sourceLabel: "III-1, atouts naturels", points: 2 },
              { prompt: "Quel atout la diversité climatique soutient-elle ?", options: ["Une monnaie déjà unique", "La disparition de toutes les sécheresses", "Une variété de cultures agricoles", "Un seul produit exporté"], correctIndex: 2, explanation: "Les zones subéquatoriales, tropicales et sahéliennes permettent des productions différentes.", sourceLabel: "III-1", points: 1 },
              { prompt: "En quoi une population nombreuse peut-elle soutenir l’intégration ?", options: ["Elle garantit seule la prospérité", "Elle empêche tout commerce", "Elle uniformise toutes les langues", "Elle forme un marché, une main-d’œuvre et des réseaux de mobilité"], correctIndex: 3, explanation: "Cet atout suppose éducation, santé, emplois, infrastructures et inclusion.", sourceLabel: "III-1, plan humain", points: 1 },
              { prompt: "Quel droit régional facilite déplacements, résidence et activités économiques ?", options: ["Le traité de Rome", "Le pacte de Varsovie", "Le Protocole de libre circulation", "Le STABEX"], correctIndex: 2, explanation: "Le protocole de 1979 organise circulation, résidence et établissement.", sourceLabel: "III-2, réalisations politiques", points: 1 },
              { prompt: "Quel organisme illustre la coordination sanitaire régionale ?", options: ["L’OTAN", "La BOAD", "Le COMECON", "L’OOAS/WAHO"], correctIndex: 3, explanation: "L’Organisation ouest-africaine de la santé coordonne les réponses sanitaires et la surveillance régionale.", sourceLabel: "III-2, réalisations sanitaires", points: 1 },
              { prompt: "À quoi sert l’ETLS ?", options: ["À faciliter le commerce de produits originaires de la Communauté", "À fermer tous les corridors", "À imprimer l’ECO", "À remplacer les élections"], correctIndex: 0, explanation: "Le schéma de libéralisation réduit certains obstacles au commerce communautaire.", sourceLabel: "Mise à jour commerciale", points: 2 },
              { prompt: "Quel outil interconnecte des systèmes douaniers de transit ?", options: ["ECOMOG", "OOAS", "SIGMAT", "BIDC"], correctIndex: 2, explanation: "SIGMAT permet l’échange de messages électroniques sur les marchandises en transit.", sourceLabel: "Mise à jour CEDEAO 2024-2025", points: 2 },
              { prompt: "Quel réseau favorise les échanges d’électricité ?", options: ["Le Parlement", "Le Conseil de sécurité de l’ONU", "La Cour pénale internationale", "Le WAPP"], correctIndex: 3, explanation: "Le West African Power Pool développe les interconnexions électriques.", sourceLabel: "Commissions techniques", points: 1 },
              { prompt: "À quelle échelle faut-il attribuer la Grande Muraille verte ?", options: ["À une initiative de l’Union africaine mise en œuvre avec les États et des partenaires", "À une banque commerciale privée", "À une création exclusive du Parlement de la CEDEAO", "À un programme monétaire de l’UEMOA"], correctIndex: 0, explanation: "La Grande Muraille verte est portée à l’échelle de l’Union africaine et ne doit pas être présentée comme une création exclusive de la CEDEAO.", sourceLabel: "Correction III-2", points: 2 },
              { prompt: "Dans l’activité à trous, quel exemple représente un succès industriel cité par le cours ?", options: ["La fermeture de tous les ports", "La suppression du riz", "La construction d’une cimenterie au Togo", "L’abandon des télécommunications"], correctIndex: 2, explanation: "Le texte propose « la construction d’une cimenterie » parmi les réalisations.", sourceLabel: "Activité d’application n°3", points: 1 },
              { prompt: "Quel couple complète correctement deux autres réussites de l’activité ?", options: ["Dans le domaine des échanges : fermeture ; sur le plan politique : absence de protocole", "Dans la santé : cimenterie ; dans l’énergie : Parlement", "Dans la justice : monnaie ; dans le sport : Cour", "Dans le domaine des échanges : libre circulation ; sur le plan politique : protocole de non-agression de 1978"], correctIndex: 3, explanation: "L’activité associe la libre circulation aux échanges et le protocole de non-agression de 1978 au domaine politique.", sourceLabel: "Activité d’application n°3", points: 2 },
            ],
          },
          {
            keyPoint: "Crises politiques, insécurité, obstacles commerciaux, faible transformation et inégalités limitent encore les effets quotidiens de l’intégration.",
            example: "Les retraits de 2025 réduisent le bloc institutionnel sans supprimer les échanges, les familles ni les risques transfrontaliers.",
            bodyMarkdown: String.raw`## Des crises qui éprouvent le projet régional

Le fascicule cite coups d’État, contentieux électoraux, conflits armés, terrorisme et insuffisance de l’anticipation. Ces difficultés sont réelles, mais une analyse évite les jugements globaux comme « faible gouvernance » ou « corruption généralisée ». Elle nomme plutôt les mécanismes :

- rupture de l’ordre constitutionnel ou institutions fragilisées ;
- contestation d’une élection et absence de médiation crédible ;
- groupes armés, trafic transfrontalier et insécurité des populations ;
- sanctions qui cherchent à rétablir une règle, mais peuvent aussi perturber mobilité, finance et approvisionnement ;
- intérêts nationaux divergents et application inégale des décisions communes.

Le retrait effectif du Burkina Faso, du Mali et du Niger en 2025 constitue une limite majeure : il réduit le périmètre institutionnel alors que les échanges, les familles, les écosystèmes et les risques sécuritaires restent transfrontaliers.

## Des freins économiques et commerciaux

Le cours identifie plusieurs obstacles durables : dépendance aux matières premières, transformation industrielle insuffisante, infrastructures incomplètes, écarts de développement, coûts de transport et faiblesse relative du commerce intrarégional.

La CEDEAO dispose de règles communes, mais leur application reste imparfaite. En 2024, sa propre Task Force relevait encore sur les corridors : contrôles et prélèvements irréguliers, listes d’interdiction, difficultés de reconnaissance des certificats d’origine et coopération douanière incomplète.

| Ambition | Outil | Limite observée |
|---|---|---|
| libre circulation | protocole, passeport, carte biométrique | contrôles, tracasseries et application inégale |
| marché régional | ETLS, tarif extérieur commun, SIGMAT | obstacles non tarifaires et faible transformation locale |
| énergie régionale | WAPP et interconnexions | financement, maintenance et accès encore inégal |
| monnaie unique | feuille de route de l’ECO | convergence macroéconomique et choix politiques non achevés |

Au sommet de juillet 2026, la CEDEAO visait encore **2027** pour un lancement de l’**ECO**, d’abord avec les États prêts et respectant les critères retenus. L’ECO n’est donc **pas en circulation** : une cible politique ne doit jamais être présentée comme un résultat déjà acquis. Parmi les douze membres, cinq utilisent le franc CFA ouest-africain, six appartiennent à la Zone monétaire de l’Afrique de l’Ouest et le Cabo Verde utilise l’escudo. Le retrait de trois pays de la CEDEAO ne vaut pas retrait automatique de l’UMOA.

## Des défis sociaux à formuler sans stigmatiser

Pauvreté, accès insuffisant à l’eau, aux soins, à l’école ou au numérique, sous-emploi des jeunes et migrations dangereuses limitent l’intégration vécue. Les langues officielles française, anglaise et portugaise compliquent parfois l’administration, mais de nombreuses langues africaines traversent les frontières et soutiennent déjà marchés, familles et mobilités.

Le développement régional suppose donc :

1. des institutions prévisibles et responsables ;
2. une sécurité centrée sur les personnes ;
3. davantage de transformation locale et de commerce régional ;
4. des corridors réellement fluides ;
5. l’éducation, la santé, l’emploi et la participation des jeunes et des femmes ;
6. un dialogue durable avec les pays de l’Alliance des États du Sahel.

> **Correction de l’activité 3.** La liste fournit **neuf groupes de mots pour dix blancs**. La phrase « de nombreux conflits entre les pays mettent en mal… » exige un complément absent, par exemple **la construction de l’intégration**. Il faut signaler ce défaut au lieu de forcer une réponse impossible.

> **Astuce mémoire de Davy.** Pour apprécier le bilan : **ACQUIS → OBSTACLE → EFFET SUR LES POPULATIONS → PISTE D’ACTION**.` ,
            interaction: {
              kind: "diagram",
              eyebrow: "Diagnostiquer",
              title: "Pourquoi l’intégration reste-t-elle inachevée ?",
              instruction: "Sélectionne un frein pour relier sa cause à son effet régional.",
              observation: "Les difficultés se renforcent : l’insécurité ralentit l’investissement, les obstacles économiques nourrissent les frustrations et le manque de confiance affaiblit les décisions communes.",
              rootLabel: "Intégration inachevée",
              rootDetail: "Des obstacles politiques, sécuritaires, économiques et sociaux se combinent",
              nodes: [
                { id: "political", group: "Politique", label: "Ruptures institutionnelles", role: "Fragiliser la confiance", detail: "Coups d’État, crises électorales et désaccords sur les sanctions compliquent les décisions communes." },
                { id: "security", group: "Sécurité", label: "Conflits et terrorisme", role: "Fermer et détourner", detail: "Insécurité, déplacements et dépenses d’urgence perturbent corridors, services et investissements." },
                { id: "withdrawals", group: "Institution", label: "Retraits de 2025", role: "Réduire le bloc", detail: "Trois États quittent la Communauté alors que les interdépendances sociales et économiques persistent." },
                { id: "trade-barriers", group: "Économie", label: "Obstacles aux échanges", role: "Renforcer les coûts", detail: "Contrôles, interdictions, lenteurs et certificats mal reconnus limitent encore la circulation des biens." },
                { id: "structure", group: "Économie", label: "Faible transformation", role: "Exporter peu de valeur", detail: "La dépendance à des produits bruts expose aux prix mondiaux et limite les chaînes de valeur régionales." },
                { id: "social", group: "Société", label: "Inégalités d’accès", role: "Éloigner les populations", detail: "Quand école, santé, eau, numérique et emploi manquent, l’intégration paraît lointaine dans la vie quotidienne." },
              ],
            },
            extraQuestions: [
              { prompt: "Quel couple ouvre correctement l’activité à trous ?", options: ["Sur le plan politique / la non-application des décisions", "Dans l’agriculture / la monnaie unique", "Sur le plan judiciaire / la cimenterie", "Dans le sport / le Parlement"], correctIndex: 0, explanation: "Le texte commence par les difficultés politiques et l’application incomplète des décisions.", sourceLabel: "Activité d’application n°3", points: 1 },
              { prompt: "Pourquoi l’activité à trous ne peut-elle pas être complétée exactement avec sa liste ?", options: ["Elle ne contient aucun blanc", "Toutes les réponses sont des dates", "Elle propose neuf réponses pour dix blancs", "Elle demande une carte"], correctIndex: 2, explanation: "Le complément après « mettent en mal » manque dans la liste fournie.", sourceLabel: "Correction de source, activité n°3", points: 2 },
              { prompt: "Quel groupe de mots décrit les rivalités d’influence entre certains États ?", options: ["La force d’interposition", "La cimenterie", "Le domaine des échanges", "Le problème de leadership"], correctIndex: 3, explanation: "Le leadership régional peut faire l’objet de négociations ou de rivalités politiques.", sourceLabel: "Activité d’application n°3", points: 1 },
              { prompt: "Quel mot introduit le bilan positif après les problèmes ?", options: ["Conflits", "Non-application", "Succès", "Retrait"], correctIndex: 2, explanation: "La phrase attend « de nombreux succès sont à enregistrer ».", sourceLabel: "Activité d’application n°3", points: 1 },
              { prompt: "Comment l’activité qualifie-t-elle l’ECOMOG ?", options: ["Une banque privée", "Une monnaie commune", "Une université", "Une force d’interposition"], correctIndex: 3, explanation: "L’ECOMOG est associée au règlement de plusieurs conflits ouest-africains.", sourceLabel: "Activité d’application n°3", points: 1 },
              { prompt: "Quel statut décrit l’ECO en 2026 ?", options: ["Une monnaie commune projetée, non encore en circulation", "La monnaie déjà utilisée par les douze membres", "Le nom du Parlement", "Un corridor routier"], correctIndex: 0, explanation: "La feuille de route reste discutée ; la cible de 2027 n’est pas un lancement déjà réalisé.", sourceLabel: "Sommet de la CEDEAO, juillet 2026", points: 2 },
              { prompt: "Quelle limite aux échanges la CEDEAO relevait-elle encore en 2024 ?", options: ["L’absence de toute route dans la région", "Une monnaie unique trop ancienne", "Des obstacles et contrôles irréguliers sur les corridors", "La disparition du commerce mondial"], correctIndex: 2, explanation: "Le cadre existe, mais l’application nationale reste incomplète.", sourceLabel: "Task Force ETLS, 2024", points: 2 },
              { prompt: "Pourquoi les retraits de 2025 constituent-ils un défi d’intégration ?", options: ["Les frontières effacent toutes les familles", "Ils créent immédiatement une monnaie unique", "Ils suppriment les risques sécuritaires", "Les interdépendances demeurent malgré la séparation institutionnelle"], correctIndex: 3, explanation: "Commerce, mobilité, ressources et sécurité continuent de relier les populations.", sourceLabel: "Mise à jour CEDEAO 2025", points: 2 },
              { prompt: "Quelle formulation évite une généralisation abusive ?", options: ["Des mécanismes de transparence et d’application des règles restent à renforcer", "Tous les milieux d’affaires sont corrompus", "Toutes les élections sont contestées", "Aucun État n’applique jamais une décision"], correctIndex: 0, explanation: "Une analyse identifie les mécanismes et les écarts sans juger indistinctement tous les acteurs.", sourceLabel: "Précision critique, III-3", points: 2 },
              { prompt: "Quel effet économique peut produire une crise sécuritaire durable ?", options: ["Créer automatiquement une industrie", "Supprimer tous les coûts", "Ralentir corridors, investissement et services publics", "Garantir la convergence monétaire"], correctIndex: 2, explanation: "Insécurité, déplacements et dépenses d’urgence détournent des ressources de l’intégration.", sourceLabel: "III-3 et document OCDE", points: 1 },
              { prompt: "Quelle priorité répond le mieux aux faiblesses structurelles ?", options: ["Exporter seulement des produits bruts", "Multiplier les obstacles douaniers", "Retarder toutes les infrastructures", "Transformer davantage sur place et fluidifier le commerce régional"], correctIndex: 3, explanation: "Chaînes de valeur, corridors, énergie et compétences peuvent accroître la valeur créée dans la région.", sourceLabel: "Synthèse III", points: 2 },
            ],
          },
        ],
        keyPoint: "La CEDEAO possède des potentialités et des acquis réels, mais l’intégration reste inachevée tant que décisions, corridors, sécurité et transformation économique ne produisent pas des effets partagés.",
        example: "La libre circulation et l’ETLS facilitent des mobilités et des échanges, tandis que les contrôles irréguliers et les retraits de 2025 montrent la fragilité de l’acquis.",
        timelineTitle: "Comparer réalisations et freins",
        timelineInstruction: "Explore d’abord les potentialités et acquis, puis les limites politiques, sécuritaires, économiques et sociales.",
        timeline: [
          { label: "Potentialités, libre circulation, commerce, réseaux et médiations", shortLabel: "Potentialités et réalisations", detail: "Ressources, population et position deviennent utiles grâce aux règles de mobilité, à l’ETLS, aux infrastructures, aux agences et aux actions de paix." },
          { label: "Crises politiques, conflits, terrorisme et retraits", shortLabel: "Crises", detail: "Les ruptures institutionnelles, l’insécurité et le départ de trois États fragilisent la confiance et la coopération." },
          { label: "Faible transformation, obstacles commerciaux et inégalités d’accès", shortLabel: "freins structurels", detail: "Coûts, infrastructures, dépendances et services insuffisants limitent les effets quotidiens de l’intégration." },
        ],
        observation: "Le bilan doit toujours mettre en regard les réalisations et les obstacles qui empêchent leur généralisation.",
        check: { prompt: "Quelle condition transforme le mieux une potentialité régionale en réalisation ?", options: ["Des règles communes, des réseaux et une mise en œuvre effective", "La seule présence d’une ressource brute", "La fermeture durable des corridors", "L’absence de coopération entre États"], correctIndex: 0, explanation: "Une ressource ou une population devient un atout partagé grâce aux institutions, aux infrastructures et à l’application des décisions." },
        distractors: ["La libre circulation est déjà parfaite à toutes les frontières.", "La CEDEAO ne mène aucune action politique, économique ou sanitaire.", "Les douze États utilisent déjà une monnaie unique."],
      },
    ],
  },
  {
    id: "terminale-hg-g7-eu-acp-cooperation",
    strand: "Géographie",
    chapterNumber: 7,
    themeNumber: 3,
    themeTitle: "Regroupements et coopération économique",
    title: "Les relations UE-ACP : un exemple de coopération Nord-Sud",
    description: "Présenter les partenaires, suivre l’évolution des accords et discuter le bilan de la coopération.",
    sections: [
      {
        id: "partners",
        title: "Les partenaires UE et ACP",
        summary: "Comparer une puissance économique intégrée et un groupe de pays riches en matières premières.",
        conceptTitle: "Deux ensembles complémentaires mais inégaux",
        explanation: "L’Union européenne regroupe vingt-sept États depuis la sortie du Royaume-Uni et constitue une grande puissance agricole, industrielle, commerciale et financière. Le groupe ACP rassemble soixante-dix-neuf États d’Afrique, des Caraïbes et du Pacifique disposant d’importantes ressources agricoles, minières et énergétiques.",
        keyPoint: "La coopération UE-ACP relie des économies transformatrices du Nord à des pays du Sud souvent producteurs de matières premières.",
        example: "Les ACP regroupent 48 pays africains, 16 caribéens et 15 du Pacifique selon le cours.",
        timelineTitle: "La constitution des partenaires",
        timelineInstruction: "Parcours les repères qui structurent l’association entre l’Europe et les pays ACP.",
        timeline: [
          { label: "1957", detail: "Le traité de Rome pose les premières bases des relations entre la CEE et les territoires associés." },
          { label: "1975", detail: "L’accord de Georgetown institue officiellement le groupe ACP." },
          { label: "Depuis 2019", shortLabel: "27 États UE", detail: "Après le retrait britannique, l’Union européenne compte vingt-sept États membres." },
        ],
        observation: "La complémentarité des ressources ne supprime pas l’inégalité de puissance économique et de négociation.",
        check: { prompt: "Que signifie le sigle ACP ?", options: ["Afrique, Caraïbes et Pacifique", "Asie, Canada et Pérou", "Agriculture, Commerce et Ports", "Alliance des Capitales Pétrolières"], correctIndex: 0, explanation: "ACP désigne les pays d’Afrique, des Caraïbes et du Pacifique." },
        distractors: ["Les ACP sont uniquement des pays européens.", "L’UE ne possède aucune activité industrielle.", "La coopération commence seulement après 2000."],
      },
      {
        id: "agreements",
        title: "L’évolution des accords de coopération",
        summary: "Situer association, conventions de Yaoundé, de Lomé et accord de Cotonou.",
        conceptTitle: "Des accords qui évoluent avec le contexte mondial",
        explanation: "Les relations passent de l’association CEE-PTOM aux conventions de Yaoundé, puis de Lomé. Le STABEX et le SYSMIN cherchent à stabiliser les recettes d’exportation. L’accord de Cotonou élargit ensuite les dimensions politique, commerciale et de développement.",
        keyPoint: "Les accords UE-ACP évoluent d’un régime préférentiel d’aide et de commerce vers un partenariat plus politique et soumis aux règles du commerce mondial.",
        example: "Lomé I crée le STABEX pour compenser certaines pertes de recettes agricoles ; Lomé II ajoute le SYSMIN pour les produits miniers.",
        timelineTitle: "De Yaoundé à Cotonou",
        timelineInstruction: "Fais défiler les grandes familles d’accords et leurs innovations.",
        timeline: [
          { label: "Yaoundé, 1963-1975", shortLabel: "Yaoundé", detail: "Aide financière et technique, suppression de droits de douane et élargissement du FED." },
          { label: "Lomé, 1975-2000", shortLabel: "Lomé", detail: "Libre accès de produits ACP, STABEX, SYSMIN et coopération dans de nouveaux domaines." },
          { label: "Cotonou, 2000-2020", shortLabel: "Cotonou", detail: "Dialogue politique, développement, commerce et préparation d’accords de partenariat économique." },
        ],
        observation: "Chaque nouvel accord tente de corriger les limites du précédent tout en s’adaptant aux règles internationales.",
        check: { prompt: "Quel mécanisme stabilise les recettes d’exportation agricoles des ACP ?", options: ["Le STABEX", "L’ECOMOG", "Le Pacte de Varsovie", "L’OAS"], correctIndex: 0, explanation: "Le STABEX est créé pour compenser certaines pertes de recettes agricoles." },
        distractors: ["Les conventions de Lomé précèdent le traité de Rome.", "Le SYSMIN concerne uniquement les élections.", "Cotonou supprime toute dimension politique du partenariat."],
      },
      {
        id: "assessment",
        title: "Le bilan de la coopération",
        summary: "Mettre en balance aides, débouchés et projets avec dépendance, dette et résultats limités.",
        conceptTitle: "Des acquis importants, mais une relation déséquilibrée",
        explanation: "La coopération finance infrastructures, éducation, santé, agriculture et aide humanitaire, tout en offrant des débouchés à certains produits ACP. Ses limites tiennent à la dépendance aux matières premières, à l’endettement, à la faible transformation locale et à l’inégalité entre partenaires.",
        keyPoint: "Le bilan UE-ACP est mitigé : les aides et préférences produisent des acquis, sans suffire à transformer durablement les économies ACP.",
        example: "Le FED et la BEI financent des projets, mais les pays ACP demeurent souvent spécialisés dans l’exportation de produits primaires.",
        timelineTitle: "Évaluer la coopération",
        timelineInstruction: "Compare les apports, les limites puis les conditions d’un partenariat plus équilibré.",
        timeline: [
          { label: "Acquis", detail: "Aides, infrastructures, débouchés, coopération technique, humanitaire et agricole." },
          { label: "Limites", detail: "Dépendance, dette, faible industrialisation, termes de l’échange défavorables et efficacité inégale." },
          { label: "Rééquilibrage", detail: "Transformation locale, diversification, intégration régionale et meilleure capacité de négociation des ACP." },
        ],
        observation: "Un bon bilan ne se limite pas aux montants d’aide : il mesure aussi l’autonomie et la transformation économiques obtenues.",
        check: { prompt: "Pourquoi le bilan de la coopération UE-ACP est-il qualifié de mitigé ?", options: ["Parce qu’il combine acquis et dépendances persistantes", "Parce qu’aucun accord n’a jamais été signé", "Parce que les ACP sont devenus membres de l’UE", "Parce que toutes les matières premières sont transformées localement"], correctIndex: 0, explanation: "Les réalisations existent, mais elles n’ont pas supprimé les déséquilibres structurels." },
        distractors: ["La coopération a supprimé toute dépendance économique des ACP.", "Les projets financés ne concernent jamais les infrastructures.", "Une relation équilibrée exige de réduire la transformation locale."],
      },
    ],
  },
] satisfies HumanitiesCourseSeed[];

export const terminalGeographyPaths = geographyCourses.map(createHumanitiesPath);
