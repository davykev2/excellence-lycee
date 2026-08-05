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
        timelineTitle: "Parcourir les espaces de production",
        timelineInstruction: "Compare les productions caractéristiques du sud forestier, du centre et du nord.",
        timeline: [
          { label: "Sud forestier", shortLabel: "Sud", detail: "Cultures arborées d’exportation, exploitation forestière et pêche littorale." },
          { label: "Centre", detail: "Cultures vivrières, café, hévéa et productions adaptées au climat de transition." },
          { label: "Nord soudanais", shortLabel: "Nord", detail: "Coton, anacarde, mangue, céréales et élevage occupent une place importante." },
        ],
        observation: "Les productions varient selon le climat, les sols, la végétation et les équipements disponibles.",
        check: { prompt: "Quelle activité domine le secteur primaire ivoirien ?", options: ["L’aéronautique", "L’agriculture", "La banque", "Les télécommunications"], correctIndex: 1, explanation: "Le cours présente l’agriculture comme le pilier du secteur primaire." },
        distractors: ["Le primaire regroupe uniquement les services marchands.", "Toutes les régions ivoiriennes ont les mêmes productions.", "Le secteur primaire ne fournit aucune matière première aux industries."],
      },
      {
        id: "secondary-sector",
        title: "Un secteur secondaire en essor",
        summary: "Comprendre les phases, les types et les foyers de l’industrialisation ivoirienne.",
        conceptTitle: "Transformer localement pour créer plus de valeur",
        explanation: "Le secteur secondaire transforme les matières premières. L’industrie ivoirienne s’appuie surtout sur l’agroalimentaire, le textile, le bois, l’énergie, les matériaux de construction et les premières transformations minières.",
        keyPoint: "L’industrialisation réduit la dépendance aux produits bruts lorsqu’elle transforme localement les ressources et se diffuse hors d’Abidjan.",
        example: "La transformation du cacao, du coton, du caoutchouc et de l’huile de palme permet de conserver davantage de valeur ajoutée dans le pays.",
        timelineTitle: "Les phases de l’industrialisation",
        timelineInstruction: "Déplace le curseur pour suivre les grandes phases proposées par le cours.",
        timeline: [
          { label: "1960-1970", detail: "Phase d’import-substitution : produire localement une partie des biens auparavant importés." },
          { label: "1970-1980", detail: "Diversification et régionalisation progressive des activités industrielles." },
          { label: "Depuis 1994", detail: "Reprise et diversification après une période de stagnation liée aux crises." },
        ],
        observation: "La transformation locale relie directement le secteur secondaire aux productions du secteur primaire.",
        check: { prompt: "Quel est le rôle principal du secteur secondaire ?", options: ["Transformer les matières premières", "Produire uniquement des services", "Fixer les frontières", "Organiser les élections"], correctIndex: 0, explanation: "Le secteur secondaire transforme les ressources issues du primaire." },
        distractors: ["L’industrie ivoirienne repose seulement sur l’aéronautique.", "Transformer localement diminue toujours la valeur ajoutée.", "Le secteur secondaire est indépendant de l’agriculture."],
      },
      {
        id: "tertiary-sector",
        title: "Un secteur tertiaire dynamique",
        summary: "Relier commerce, tourisme et transports à l’ouverture et à la circulation des richesses.",
        conceptTitle: "Les services connectent les producteurs, les marchés et les territoires",
        explanation: "Le tertiaire comprend notamment commerce, tourisme et transports. Le commerce intérieur distribue les produits, le commerce extérieur organise importations et exportations, tandis que les réseaux routier, ferroviaire, aérien, maritime et lagunaire assurent les flux.",
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
        summary: "Relier dépendance économique, croissance démographique et dégradation environnementale.",
        conceptTitle: "Des contraintes qui touchent toute l’économie",
        explanation: "L’économie reste exposée à la fluctuation des matières premières, à l’endettement, à la faiblesse de l’épargne et à l’insuffisance des recettes. La croissance démographique rapide augmente les besoins, tandis que déforestation, insalubrité et pollutions dégradent le cadre de vie.",
        keyPoint: "Les problèmes généraux se renforcent mutuellement : la dépendance économique limite les investissements nécessaires pour répondre aux besoins sociaux et environnementaux.",
        example: "Une économie qui exporte surtout des produits bruts perd des recettes lorsque leurs cours internationaux baissent.",
        timelineTitle: "Distinguer trois familles de problèmes",
        timelineInstruction: "Passe des contraintes économiques aux défis démographiques puis environnementaux.",
        timeline: [
          { label: "Économie", detail: "Dépendance aux matières premières, dette, faiblesse de l’épargne et recettes fiscales insuffisantes." },
          { label: "Population", detail: "Croissance rapide, besoins d’emplois, de logements, d’éducation, de santé et de nutrition." },
          { label: "Environnement", detail: "Déforestation, pollution, insalubrité, bidonvilles et effets du changement climatique." },
        ],
        observation: "Un problème économique peut produire des effets sociaux, puis rendre plus difficile la protection de l’environnement.",
        check: { prompt: "Pourquoi la dépendance aux matières premières est-elle risquée ?", options: ["Leurs cours mondiaux peuvent fluctuer", "Elles ne peuvent jamais être exportées", "Elles rendent toute agriculture impossible", "Elles suppriment automatiquement la dette"], correctIndex: 0, explanation: "La fluctuation des cours réduit les recettes et les capacités d’investissement." },
        distractors: ["La croissance démographique réduit toujours les besoins sociaux.", "La déforestation améliore durablement tous les sols.", "La dette ne peut jamais limiter l’investissement public."],
      },
      {
        id: "sector-challenges",
        title: "Les problèmes sectoriels",
        summary: "Comparer les difficultés du primaire, de l’industrie et des services.",
        conceptTitle: "Chaque secteur possède des fragilités particulières",
        explanation: "Le primaire souffre d’une agriculture extensive, d’aléas climatiques et de pertes après récolte. L’industrie reste concentrée, peu intégrée et dépendante de capitaux ou intrants extérieurs. Les transports, le tourisme et le commerce rencontrent problèmes d’infrastructures, d’organisation et de compétitivité.",
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
        distractors: ["Le tissu industriel ivoirien est dominé par les industries lourdes de pointe.", "Le primaire ne dépend jamais du climat.", "Les transports n’influencent pas la compétitivité."],
      },
      {
        id: "solutions",
        title: "Les tentatives de solutions",
        summary: "Situer les réformes économiques et proposer des solutions générales et sectorielles.",
        conceptTitle: "Des politiques successives pour transformer l’économie",
        explanation: "L’État a combiné ajustement, privatisation, diversification, civisme fiscal, restructuration du CEPICI, plans nationaux de développement, investissement agricole et construction d’infrastructures. Les solutions doivent aussi protéger l’environnement et développer le capital humain.",
        keyPoint: "Une solution durable associe réformes économiques, infrastructures, formation, transformation locale et protection des ressources.",
        example: "Les PND 2012-2015, 2016-2020 et 2021-2025 structurent les investissements publics récents présentés dans le cours.",
        timelineTitle: "Suivre les grandes phases de réponse",
        timelineInstruction: "Parcours les trois périodes d’action publique distinguées par le document.",
        timeline: [
          { label: "Avant les années 1990", shortLabel: "Avant 1990", detail: "Capitalisme d’État, croissance initiale puis programmes d’ajustement face à la crise des années 1980." },
          { label: "Années 2000", detail: "Libéralisation de filières, diversification, civisme fiscal et recherche d’allègement de la dette." },
          { label: "Depuis 2012", detail: "PND, réforme du CEPICI, code minier, PNIA et grands travaux d’infrastructures." },
        ],
        observation: "Les politiques sont plus efficaces lorsqu’elles traitent en même temps production, financement, compétences et environnement.",
        check: { prompt: "Quel outil planifie les investissements récents de l’État ivoirien ?", options: ["Les PND", "Le Pacte de Varsovie", "Le STABEX", "La Charte de l’Atlantique"], correctIndex: 0, explanation: "Les Plans nationaux de développement organisent les priorités d’investissement." },
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
