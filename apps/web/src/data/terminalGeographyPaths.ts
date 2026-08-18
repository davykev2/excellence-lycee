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
    description: "Comprendre comment territoire, capital humain et État-développeur ont construit une puissance émergente.",
    sections: [
      {
        id: "territory",
        title: "Un territoire aux potentialités contrastées",
        summary: "Évaluer les contraintes du relief et des ressources ainsi que les atouts maritimes et hydrauliques.",
        conceptTitle: "Un territoire restreint, montagneux et ouvert sur les mers",
        explanation: "La Corée du Sud est montagneuse sur environ 70 % de son territoire et dispose de peu de ressources minières ou énergétiques. Ses fleuves, ses littoraux et ses ports soutiennent toutefois pêche, hydroélectricité, irrigation, navigation et commerce.",
        keyPoint: "La Corée du Sud a compensé des ressources naturelles limitées par l’aménagement, l’ouverture maritime et la valorisation de ses eaux.",
        example: "Le Nakdong et le Han structurent le territoire ; la mer Jaune et la mer du Japon ouvrent le pays sur les échanges asiatiques et mondiaux.",
        timelineTitle: "Lire les composantes du territoire",
        timelineInstruction: "Compare relief, climat et ressources pour évaluer contraintes et potentialités.",
        timeline: [
          { label: "Relief", detail: "Montagnes dominantes, plaines surtout occidentales et méridionales, fortes densités sur les espaces disponibles." },
          { label: "Climat", detail: "Climat continental, hiver froid et sec, été chaud et humide sous l’effet de la mousson." },
          { label: "Eaux et littoraux", shortLabel: "Eaux", detail: "Fleuves et 2 413 km de littoral favorisent ports, pêche, énergie, irrigation et loisirs." },
        ],
        observation: "Le développement ne dépend pas seulement de l’abondance des matières premières, mais de la manière dont le territoire est aménagé.",
        check: { prompt: "Quelle part approximative du territoire sud-coréen est montagneuse ?", options: ["10 %", "30 %", "70 %", "100 %"], correctIndex: 2, explanation: "Le cours indique qu’environ 70 % du territoire est montagneux." },
        distractors: ["La Corée du Sud possède d’immenses réserves minières faciles à exploiter.", "Le pays n’a aucune façade maritime.", "Le climat coréen ne présente aucune saison contrastée."],
      },
      {
        id: "human-capital",
        title: "Le capital humain",
        summary: "Expliquer le rôle de l’éducation, de la formation et des valeurs sociales dans la croissance.",
        conceptTitle: "L’éducation comme investissement productif",
        explanation: "Face à la faiblesse des ressources naturelles, les dirigeants sud-coréens ont investi massivement dans l’enseignement et la formation. La révolution éducative engagée après 1945 améliore l’alphabétisation, forme cadres, ingénieurs et techniciens et renforce la productivité.",
        keyPoint: "Le modèle coréen transforme l’éducation et la discipline du travail en avantage économique durable.",
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
        distractors: ["Le développement coréen repose uniquement sur le vieillissement de la population.", "L’éducation n’a aucun lien avec l’industrialisation.", "La Corée du Sud interdit l’enseignement supérieur."],
      },
      {
        id: "development-state",
        title: "L’État-développeur et les phases industrielles",
        summary: "Relier aide extérieure, planification, chaebols, exportations et industries lourdes.",
        conceptTitle: "Un État stratège orienté vers les exportations",
        explanation: "Avec le soutien initial des États-Unis, l’État sud-coréen planifie, finance les secteurs prioritaires et coopère avec les chaebols. Le pays passe de la substitution aux importations à la promotion des exportations, puis aux industries lourdes et technologiques.",
        keyPoint: "La réussite sud-coréenne associe planification publique, entreprises puissantes, recherche, épargne et conquête des marchés extérieurs.",
        example: "Samsung dans l’électronique et POSCO dans la sidérurgie illustrent la coopération entre l’État et les grands conglomérats.",
        timelineTitle: "Les trois phases du décollage industriel",
        timelineInstruction: "Fais défiler les étapes de la stratégie économique sud-coréenne entre 1953 et 1980.",
        timeline: [
          { label: "1953-1961", detail: "Substitution aux importations et développement d’industries légères à forte intensité de main-d’œuvre." },
          { label: "1961-1973", detail: "Promotion audacieuse des exportations de textiles, vêtements, chaussures et autres produits manufacturés." },
          { label: "1973-1980", detail: "Investissements massifs dans la sidérurgie, la construction navale, la chimie et les industries lourdes." },
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
    description: "Présenter l’espace CEDEAO, comprendre ses institutions et apprécier ses réalisations et limites.",
    sections: [
      {
        id: "creation-objectives",
        title: "Création, espace et objectifs",
        summary: "Situer la naissance de la CEDEAO et ses objectifs d’intégration ouest-africaine.",
        conceptTitle: "Une organisation pour unir les économies ouest-africaines",
        explanation: "La CEDEAO naît le 28 mai 1975 à Lagos à l’initiative de seize États ; après le retrait de la Mauritanie, elle compte quinze membres. Elle cherche à élever le niveau de vie, renforcer la stabilité et créer une union économique régionale.",
        keyPoint: "L’objectif central de la CEDEAO est l’intégration par la libre circulation, la coopération et l’harmonisation des politiques.",
        example: "La carte d’identité CEDEAO et le projet de monnaie commune traduisent la volonté de faciliter la mobilité et les échanges.",
        timelineTitle: "Les repères fondateurs",
        timelineInstruction: "Parcours les étapes qui conduisent à la création et à la configuration actuelle de la CEDEAO.",
        timeline: [
          { label: "1968", detail: "L’idée d’une union ouest-africaine est portée au Ghana par le président libérien William Tolbert." },
          { label: "28 mai 1975", shortLabel: "1975", detail: "Signature du traité de Lagos et naissance de la CEDEAO avec seize États." },
          { label: "1999", detail: "Le retrait de la Mauritanie ramène l’organisation à quinze États membres." },
        ],
        observation: "L’intégration régionale cherche à dépasser l’étroitesse des marchés nationaux et les frontières héritées de la colonisation.",
        check: { prompt: "Où et quand la CEDEAO est-elle créée ?", options: ["À Lagos en 1975", "À Addis-Abeba en 1963", "À Rome en 1957", "À Lomé en 2000"], correctIndex: 0, explanation: "La CEDEAO est créée le 28 mai 1975 à Lagos." },
        distractors: ["La CEDEAO regroupe tous les États du continent africain.", "Son objectif principal est de fermer les frontières régionales.", "Elle interdit toute coopération économique entre ses membres."],
      },
      {
        id: "institutions",
        title: "Structure et fonctionnement",
        summary: "Distinguer les organes de décision, d’exécution, de justice et de financement.",
        conceptTitle: "Des institutions pour décider et appliquer",
        explanation: "La Conférence des chefs d’État fixe les grandes orientations. Le Conseil des ministres, la Commission, le Parlement communautaire, la Cour de justice et les institutions financières assurent préparation, exécution, contrôle et financement.",
        keyPoint: "L’efficacité de la CEDEAO dépend de la coordination entre décision politique, administration, justice et financement régional.",
        example: "La Banque d’investissement et de développement de la CEDEAO finance des projets, tandis que la Cour de justice veille au respect du droit communautaire.",
        timelineTitle: "Du choix politique à l’action",
        timelineInstruction: "Suis le chemin d’une décision depuis les dirigeants jusqu’aux institutions spécialisées.",
        timeline: [
          { label: "Conférence", detail: "Les chefs d’État et de gouvernement définissent les grandes orientations de la communauté." },
          { label: "Conseil et Commission", shortLabel: "Exécution", detail: "Les ministres et la Commission préparent et mettent en œuvre les politiques communes." },
          { label: "Cour, Parlement et banques", shortLabel: "Contrôle", detail: "Justice, représentation et financement complètent le fonctionnement régional." },
        ],
        observation: "Une décision régionale n’est utile que si les États l’appliquent effectivement dans leurs politiques nationales.",
        check: { prompt: "Quel organe réunit les chefs d’État et fixe les grandes orientations ?", options: ["La Conférence", "La Cour internationale de justice", "Le STABEX", "L’UNESCO"], correctIndex: 0, explanation: "La Conférence des chefs d’État et de gouvernement est l’organe politique majeur." },
        distractors: ["La CEDEAO ne possède aucune institution financière.", "La Cour de justice dirige les armées nationales.", "La Commission n’intervient jamais dans l’exécution des décisions."],
      },
      {
        id: "achievements-limits",
        title: "Forces, réalisations et limites",
        summary: "Évaluer libre circulation, interventions de paix, infrastructures et obstacles à l’intégration.",
        conceptTitle: "Des avancées réelles mais une intégration inachevée",
        explanation: "La CEDEAO facilite la circulation, soutient des infrastructures et intervient dans les crises grâce à l’ECOMOG. Elle reste freinée par instabilité politique, terrorisme, faible industrialisation, monnaies multiples, dépendance extérieure et faibles échanges intrarégionaux.",
        keyPoint: "Le potentiel de la CEDEAO est important, mais les crises politiques, les écarts de développement et l’application incomplète des décisions limitent ses résultats.",
        example: "L’ECOMOG est intervenue notamment au Liberia et en Sierra Leone, tandis que des entraves persistent encore aux frontières.",
        timelineTitle: "Comparer acquis et difficultés",
        timelineInstruction: "Explore les actions politiques, économiques puis les limites structurelles de la CEDEAO.",
        timeline: [
          { label: "Paix et mobilité", detail: "ECOMOG, condamnation des coups d’État, carte d’identité régionale et libre circulation." },
          { label: "Économie et société", detail: "Routes, télécommunications, projets agricoles, institutions financières, sports et culture." },
          { label: "Limites", detail: "Terrorisme, instabilité, faiblesse industrielle, monnaies multiples, pauvreté et retards de cotisation." },
        ],
        observation: "Le bilan doit toujours mettre en regard les réalisations et les obstacles qui empêchent leur généralisation.",
        check: { prompt: "Quelle force régionale est associée aux interventions de paix de la CEDEAO ?", options: ["L’ECOMOG", "L’OTAN", "Le FLN", "Le COMECON"], correctIndex: 0, explanation: "L’ECOMOG est la force d’intervention liée à la CEDEAO." },
        distractors: ["La libre circulation est déjà parfaite à toutes les frontières.", "La CEDEAO ne mène aucune action politique ou militaire.", "Les quinze États utilisent tous une monnaie unique."],
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
