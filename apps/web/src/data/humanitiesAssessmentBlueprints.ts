import type { LessonQuestion } from "../domain/paths";

interface HumanitiesMissionSeed {
  title: string;
  scenario: string;
  modelAnswer: string;
  questions: [LessonQuestion, LessonQuestion, LessonQuestion];
  /** Document d'appui (extrait officiel, discours…) affiché avant les consignes. */
  bodyMarkdown?: string;
  /** Consignes supplémentaires, par exemple une étude de document. */
  extraQuestions?: LessonQuestion[];
}

export interface HumanitiesAssessmentBlueprint {
  splitSectionIndex: 0 | 1 | 2;
  memorySentence: string;
  mission: HumanitiesMissionSeed;
}

const question = (
  prompt: string,
  correct: string,
  distractors: [string, string, string],
  explanation: string,
  correctIndex: 0 | 1 | 2 | 3,
): LessonQuestion => {
  const options = [...distractors];
  options.splice(correctIndex, 0, correct);
  return { prompt, options, correctIndex, explanation };
};

export const humanitiesAssessmentBlueprints: Record<string, HumanitiesAssessmentBlueprint> = {
  "terminale-hg-g1-cote-ivoire-development-foundations": {
    splitSectionIndex: 2,
    memorySentence: "Puissance économique ivoirienne = atouts naturels + atouts humains + choix économiques de l’État.",
    mission: {
      title: "Les véritables piliers de l’économie ivoirienne",
      scenario: "Deux élèves débattent : l’un attribue le développement ivoirien aux choix des premiers dirigeants et à l’ouverture extérieure ; l’autre affirme que cette ouverture n’a rien apporté au pays.",
      modelAnswer: "Je ne partage pas l’affirmation selon laquelle l’ouverture n’a rien apporté : elle a attiré capitaux et compétences et ouvert des marchés. Son bilan doit toutefois être nuancé par les dépendances et difficultés sociales.",
      questions: [
        question("Quel est le thème central du débat ?", "Le rôle des fondements naturels, humains et politiques dans le développement ivoirien", ["La disparition de l’agriculture ivoirienne", "Le fonctionnement de l’ONU", "La guerre froide en Afrique"], "La situation oppose plusieurs explications du développement économique de la Côte d’Ivoire.", 1),
        question("Pourquoi le choix économique des premiers dirigeants peut-il être qualifié de pertinent ?", "Il associait intervention de l’État, initiative privée et ouverture sur l’extérieur", ["Il supprimait toute entreprise privée", "Il isolait totalement le pays", "Il reposait uniquement sur les ressources minières"], "Le libéralisme ivoirien était encadré par un État planificateur et ouvert aux investissements.", 2),
        question("Quelle prise de position est la mieux justifiée ?", "L’ouverture a soutenu l’économie, même si elle a aussi créé des dépendances à corriger", ["L’ouverture n’a produit aucun effet", "Seul le relief explique le développement", "Toute intervention de l’État est inutile"], "Une bonne réponse prend position, cite les apports et apporte une nuance.", 0),
      ],
      bodyMarkdown: String.raw`## Document — Un débat entre deux élèves

> **Élève A :** « Le pays a atteint un niveau de développement envié dans la sous-région. Les premiers dirigeants ont fait un choix économique pertinent. La politique d’ouverture sur l’extérieur a contribué à enrichir les ressources humaines. »
>
> **Élève B :** « La politique d’ouverture n’a rien apporté à la Côte d’Ivoire. Au contraire, elle n’a fait qu’augmenter les problèmes socio-économiques. »

## Évolution de la population ivoirienne (1960-2020)

| Année | 1960 | 1980 | 1998 | 2014 | 2020 |
|---|---|---|---|---|---|
| Population (millions) | 3,8 | 8,1 | 15,4 | 22,7 | 26,5 |

*Source : d’après www.ins.ci*

> **Méthode.** Pour « expliquer » un passage, reformule-le, donne la **cause** (« parce que… ») et un **exemple précis** du cours (un climat, un barrage, une réforme). Pour « partager ou non un avis », prends position **nettement**, donne **deux arguments** puis une **nuance** avec « cependant ».`,
      extraQuestions: [
        { prompt: "D’après le tableau, en quelle année la population ivoirienne dépasse-t-elle 22 millions d’habitants ?", options: ["2014", "1980", "1998", "1960"], correctIndex: 0, explanation: "Le RGPH de 2014 recense environ 22,7 millions d’habitants.", sourceLabel: "Document — tableau", points: 1 },
        { prompt: "L’affirmation de l’élève B (« l’ouverture n’a rien apporté ») est-elle pleinement justifiée ?", options: ["Non : l’ouverture a apporté capitaux, compétences et marchés, malgré des limites", "Oui : l’ouverture a été totalement inutile", "Oui : elle n’a créé que des problèmes", "Non : l’ouverture n’a eu aucun effet"], correctIndex: 0, explanation: "Une bonne réponse nuance : des apports réels, mais aussi des dépendances à corriger.", sourceLabel: "Consigne 3", points: 2 },
        { prompt: "Quel argument soutient le mieux l’idée que « le milieu naturel est riche et varié » ?", options: ["Trois domaines climatiques permettent des cultures variées, du cacao au sud à l’anacarde au nord", "Le pays ne possède qu’un seul type de sol", "Le relief montagneux couvre tout le territoire", "Le sous-sol est totalement dépourvu de ressources"], correctIndex: 0, explanation: "La diversité des climats, des sols, des eaux et du sous-sol illustre la richesse du milieu naturel.", sourceLabel: "Consigne 2", points: 2 },
      ],
    },
  },
  "terminale-hg-g2-cote-ivoire-economic-sectors": {
    splitSectionIndex: 0,
    memorySentence: "L’économie ivoirienne fonctionne par complémentarité entre secteur primaire, secteur secondaire et secteur tertiaire.",
    mission: {
      title: "Le paradoxe de la pêche ivoirienne",
      scenario: "Le document d’évaluation affirme qu’en 2019 la Côte d’Ivoire a produit 52 000 tonnes de ressources halieutiques, soit 30 % de sa consommation. Malgré l’abondance des eaux, le pays doit donc importer massivement.",
      modelAnswer: "Avec les données de la mission, la consommation atteindrait environ 173 333 tonnes et le déficit environ 121 333 tonnes. Il s’explique par des techniques et équipements insuffisants, une aquaculture limitée et la pression sur les ressources. Moderniser durablement la filière, développer l’aquaculture et mieux conserver les prises permettrait de le réduire.",
      questions: [
        question("Quel problème cette situation met-elle en évidence ?", "Le déficit de production halieutique en Côte d’Ivoire", ["L’absence totale de cours d’eau", "La disparition du commerce extérieur", "Le manque de cultures industrielles"], "Les ressources en eau existent, mais la production de poissons reste insuffisante.", 1),
        question("Quelle explication est la plus complète ?", "Des techniques, équipements et capacités d’aquaculture insuffisants limitent la production", ["Les Ivoiriens ne consomment jamais de poisson", "Tous les fleuves sont asséchés", "La pêche est interdite sur tout le territoire"], "Le potentiel naturel ne suffit pas : il faut des moyens de production et une gestion durable.", 2),
        question("Quelle solution répond directement au problème ?", "Moderniser la pêche, développer l’aquaculture et lutter contre la surexploitation", ["Supprimer tous les ports", "Abandonner la formation des pêcheurs", "Réduire volontairement la production locale"], "Les solutions doivent agir à la fois sur la production, les compétences et la protection de la ressource.", 0),
      ],
      bodyMarkdown: String.raw`## Situation d’évaluation — Une production insuffisante

Lors de ses révisions du baccalauréat, un élève découvre l’affirmation suivante :

> En 2019, la Côte d’Ivoire aurait produit **52 000 tonnes** de ressources halieutiques, soit **30 %** de sa consommation nationale. Des importations seraient donc nécessaires pour couvrir le reste des besoins.

Cette situation paraît paradoxale : le pays dispose d’un littoral, de lagunes, de fleuves et de lacs, mais sa production ne répond pas à la demande.

## Exploiter les données

Dans le cadre de cette mission, on accepte la donnée de **52 000 tonnes** :

| Calcul | Opération | Résultat approché |
|---|---|---:|
| Consommation nationale | 52 000 ÷ 0,30 | 173 333 t |
| Déficit à couvrir | 173 333 − 52 000 | 121 333 t |
| Part non couverte | 100 % − 30 % | 70 % |

> **Correction / précision.** Le corps du même PDF annonce ailleurs **101 000 tonnes** en 2019, dont 59 590 tonnes de pêche artisanale et 41 410 tonnes de pêche industrielle. Les deux totaux sont incompatibles. Pour résoudre cette mission, utilise **52 000 tonnes comme hypothèse imposée**, sans prétendre qu’elle confirme le chiffre du cours.

## Consignes

1. Identifie précisément le problème posé.
2. Explique le déficit malgré l’importance des ressources en eau.
3. Propose des solutions réalistes et durables.

## Construire une réponse complète

Une bonne explication distingue :

- les **moyens de production** : embarcations, motorisation, équipements et formation ;
- la **conservation et la distribution** : glace, chaîne du froid, stockage et transport ;
- la **gestion de la ressource** : repos biologique, contrôle des captures et lutte contre les pratiques destructrices ;
- la **production complémentaire** : pisciculture et aquaculture.

Les solutions doivent augmenter l’offre sans épuiser les stocks : moderniser la flotte, former les pêcheurs, développer la chaîne du froid, soutenir l’aquaculture et protéger les zones de reproduction.

> **Méthode.** Présente d’abord le **constat chiffré**, explique ensuite au moins **deux causes**, puis propose des solutions qui répondent directement à ces causes.`,
      extraQuestions: [
        { prompt: "Si 52 000 tonnes représentent 30 % de la consommation, quelle est la consommation totale approchée ?", options: ["173 333 tonnes", "82 000 tonnes", "15 600 tonnes", "520 000 tonnes"], correctIndex: 0, explanation: "52 000 ÷ 0,30 ≈ 173 333 tonnes.", sourceLabel: "Exploitation des données", points: 2 },
        { prompt: "Quel déficit la donnée de la mission implique-t-elle environ ?", options: ["121 333 tonnes", "52 000 tonnes", "30 000 tonnes", "225 333 tonnes"], correctIndex: 0, explanation: "173 333 − 52 000 ≈ 121 333 tonnes, soit 70 % de la consommation.", sourceLabel: "Exploitation des données", points: 2 },
        { prompt: "Pourquoi la présence de nombreuses eaux ne garantit-elle pas une production suffisante ?", options: ["Il faut aussi des équipements, des compétences et une gestion durable", "L’eau empêche toute activité de pêche", "Tous les poissons sont nécessairement exportés", "Les lagunes ne contiennent jamais de ressources"], correctIndex: 0, explanation: "Une ressource naturelle ne devient production que si elle est aménagée et correctement gérée.", sourceLabel: "Consigne 2", points: 2 },
        { prompt: "Quelle solution augmente directement la production locale sans dépendre seulement des captures sauvages ?", options: ["Développer l’aquaculture", "Supprimer la chaîne du froid", "Réduire la formation", "Fermer les marchés"], correctIndex: 0, explanation: "La pisciculture et l’aquaculture complètent la pêche de capture.", sourceLabel: "Consigne 3", points: 1 },
        { prompt: "Quelle mesure protège la ressource sur le long terme ?", options: ["Respecter les périodes de repos biologique", "Capturer les juvéniles", "Détruire les mangroves", "Pêcher sans contrôle"], correctIndex: 0, explanation: "Le repos biologique permet la reproduction et le renouvellement des stocks.", sourceLabel: "Consigne 3", points: 2 },
        { prompt: "Comment traiter les totaux de 52 000 et 101 000 tonnes présents dans le PDF ?", options: ["Signaler la contradiction et réserver 52 000 tonnes au calcul de la mission", "Les déclarer égaux", "Les additionner", "Choisir au hasard l’un des deux"], correctIndex: 0, explanation: "La transparence documentaire impose de signaler l’incompatibilité au lieu de la masquer.", sourceLabel: "Correction de source", points: 2 },
      ],
    },
  },
  "terminale-hg-g3-cote-ivoire-development-challenges": {
    splitSectionIndex: 0,
    memorySentence: "Diagnostiquer le développement = dater les faits, relier les mécanismes, nuancer les jugements et proposer des réponses cohérentes.",
    mission: {
      title: "Croissance, fragilités et solutions durables",
      scenario: "Lors d’une conférence scolaire, un intervenant reconnaît les potentialités de la Côte d’Ivoire mais résume ses difficultés par l’endettement, la destruction de l’environnement, la faiblesse de l’industrialisation et une croissance démographique rapide. Il faut commenter ce diagnostic et proposer des réponses.",
      modelAnswer: "Le diagnostic est globalement pertinent à condition de le dater et de le nuancer. La dette peut réduire les marges budgétaires, tandis qu’une transformation locale insuffisante limite valeur ajoutée et emplois. Une population jeune n’est pas un fardeau en soi : elle exige éducation, santé, formation, logements et emplois. La déforestation et les pollutions fragilisent enfin la production et le cadre de vie. Une stratégie cohérente associe gestion prudente de la dette, fiscalité efficace, industrialisation régionale, capital humain, infrastructures et restauration des milieux.",
      questions: [
        question("Quel est le problème général posé par la conférence ?", "Les obstacles à un développement ivoirien inclusif et durable malgré les potentialités du pays", ["L’absence de toute activité économique", "La création de la CEDEAO", "La disparition de toutes les ressources naturelles"], "La situation confronte performances et potentialités aux fragilités économiques, humaines, territoriales et environnementales.", 1),
        question("Comment commenter correctement les quatre difficultés citées ?", "Montrer leurs mécanismes, leurs interactions et leurs limites sans transformer la population en cause unique", ["Réciter les quatre mots sans expliquer", "Accuser une catégorie de personnes", "Présenter chaque difficulté comme indépendante"], "Commenter signifie expliquer comment dette, industrie, services, capital humain et milieux agissent les uns sur les autres.", 2),
        question("Quel ensemble de solutions est le plus cohérent ?", "Gérer prudemment la dette, transformer localement, investir dans les capacités humaines et restaurer les milieux", ["Accroître uniquement les importations", "Abandonner les infrastructures", "Encourager la déforestation"], "Une réponse durable combine financement, économie productive, inclusion, territoires et environnement.", 0),
      ],
      bodyMarkdown: String.raw`## Situation d’évaluation - Quatre difficultés à commenter

Le club d’Histoire-Géographie organise une conférence sur l’économie ivoirienne. Après avoir rappelé les potentialités du pays, le conférencier insiste sur quatre difficultés :

1. l’endettement ;
2. la destruction de l’environnement ;
3. la faiblesse de l’industrialisation ;
4. la croissance démographique rapide.

La mission demande d’**identifier** le problème, de **commenter** ce diagnostic et de **proposer** des solutions.

## Construire le commentaire

| Difficulté | Mécanisme à expliquer | Réponse cohérente |
|---|---|---|
| Dette | le service mobilise des ressources budgétaires ; le risque dépend aussi de l’usage des emprunts et de la capacité de remboursement | dette soutenable, transparence, recettes intérieures et investissements productifs |
| Industrialisation limitée | matières premières peu transformées, valeur ajoutée et emplois réduits, forte concentration territoriale | agro-industrie, PME, énergie, financement, innovation et déconcentration |
| Dynamique démographique | besoins rapides en école, santé, logements et emplois ; potentiel d’une population jeune | éducation, santé reproductive, formation, emploi et urbanisme |
| Environnement dégradé | forêts, sols, eaux et villes fragilisés ; risques climatiques accrus | reboisement, agroforesterie, assainissement, contrôle des rejets et adaptation |

## Mobiliser les quatre documents

### Document 1 - Des performances inégalement partagées

Le texte consulté en **avril 2021** oppose bonnes performances macroéconomiques, pauvreté, concentration des activités à Abidjan, emploi informel, gouvernance, insécurité foncière et difficulté d’accès au financement. Il appelle à une croissance plus **inclusive**. Ses pourcentages sont des estimations datées, non des valeurs permanentes.

### Document 2 - Une dette en hausse sur la période étudiée

| Année | Dette indiquée, en milliards de F CFA |
|---|---:|
| 2018 | 11 607,8 |
| 2019 | 13 300,2 |
| Septembre 2020 | 16 133,3 |

L’augmentation entre 2018 et septembre 2020 atteint **4 525,5 milliards**, soit environ **39 %**. Ce calcul décrit la période du tableau ; il ne suffit pas, à lui seul, à juger la soutenabilité actuelle de la dette.

### Document 3 - Population et services

Le discours de **1997** relie croissance de la population, demande d’éducation et de santé, emploi, urbanisation et déboisement. Son vocabulaire de « fardeau » doit être contextualisé. Une politique actuelle raisonne en droits, capacités et planification familiale volontaire, sans rendre les familles ou les migrants responsables des difficultés.

### Document 4 - Financer le PND 2016-2020

Le dernier texte, mal numéroté une seconde fois « Document 3 », présente **12 projets prioritaires**, **2 700 milliards de F CFA** et **sept secteurs**. Il faut corriger la coquille finale **« PND 20216-2020 »** en **PND 2016-2020**.

## Modèle de réponse organisée

**Identifier.** Il s’agit des obstacles qui empêchent les performances économiques de devenir un développement inclusif, territorialement équilibré et durable.

**Expliquer.** La hausse de la dette peut limiter les marges si les remboursements absorbent une part importante des recettes. La transformation locale insuffisante réduit les emplois et la valeur ajoutée. La croissance démographique accroît les besoins, mais une population jeune devient un atout si ses capacités progressent. Enfin, la déforestation, les pollutions et l’urbanisation précaire fragilisent les activités et la santé.

**Proposer.** Il faut mieux mobiliser les ressources intérieures, financer des investissements productifs, développer des industries dans plusieurs régions, former les jeunes, améliorer les services et restaurer les forêts et les villes.

**Nuancer et conclure.** La Côte d’Ivoire peut être une puissance économique régionale tout en conservant des fragilités. L’expression **« géant aux pieds d’argile »** n’est défendable que si elle est argumentée et nuancée par les progrès, les écarts territoriaux et la date des données.

> **Méthode BAC.** Un bon commentaire suit toujours : **fait daté → mécanisme → effet → réponse → nuance**.` ,
      extraQuestions: [
        { prompt: "Quelle hausse de dette ressort du tableau entre 2018 et septembre 2020 ?", options: ["4 525,5 milliards de F CFA", "16 133,3 milliards de F CFA", "1 692,4 milliards de F CFA", "39 milliards de F CFA"], correctIndex: 0, explanation: "16 133,3 - 11 607,8 = 4 525,5 milliards de F CFA.", sourceLabel: "Document 2", points: 2 },
        { prompt: "Cette hausse représente environ quelle proportion du montant de 2018 ?", options: ["39 %", "3,9 %", "139 %", "9 %"], correctIndex: 0, explanation: "4 525,5 / 11 607,8 x 100 ≈ 39 %.", sourceLabel: "Exploitation du document 2", points: 2 },
        { prompt: "Quelle lecture du couvert forestier est correcte ?", options: ["La tendance est au recul, mais les valeurs varient selon date et définition", "Tous les chiffres du PDF sont exactement équivalents", "La forêt a toujours augmenté", "Le couvert forestier est une dette"], correctIndex: 0, explanation: "Le fascicule se contredit et les définitions institutionnelles donnent des périmètres différents.", sourceLabel: "Correction de source", points: 2 },
        { prompt: "Pourquoi la faiblesse de l’industrialisation freine-t-elle le développement ?", options: ["Elle limite transformation, valeur ajoutée, emplois et diffusion territoriale", "Elle augmente automatiquement tous les revenus", "Elle supprime le besoin d’énergie", "Elle remplace le secteur primaire"], correctIndex: 0, explanation: "Une chaîne de transformation incomplète conserve moins de valeur et d’emplois dans le pays.", sourceLabel: "Consigne 2", points: 2 },
        { prompt: "Quelle phrase traite correctement la dynamique démographique ?", options: ["Elle crée des besoins mais aussi un potentiel si les capacités humaines progressent", "Elle est toujours un fardeau", "Elle n’a aucun lien avec les services", "Elle interdit tout développement"], correctIndex: 0, explanation: "Le résultat dépend de l’éducation, de la santé, de la formation, des emplois et de l’urbanisme.", sourceLabel: "Consigne 2", points: 2 },
        { prompt: "Que signifie l’appel du Document 1 à une croissance inclusive ?", options: ["Diffuser davantage les emplois, revenus et services entre populations et territoires", "Concentrer toutes les activités à Abidjan", "Réduire l’accès au financement local", "Exclure l’emploi informel sans transition"], correctIndex: 0, explanation: "L’inclusion cherche à transformer la croissance en amélioration plus largement partagée.", sourceLabel: "Document 1", points: 2 },
        { prompt: "Quelle paire classe correctement un problème structurel et un problème conjoncturel ?", options: ["Agriculture peu modernisée / rationnement ponctuel de l’électricité", "Rationnement ponctuel / dégradation durable des sols", "Crise politique / concentration industrielle historique", "Vols ponctuels / faible transformation locale"], correctIndex: 0, explanation: "Le structurel est durable et lié à l’organisation de l’économie ; le conjoncturel dépend d’une circonstance plus temporaire.", sourceLabel: "Exercice 1", points: 2 },
        { prompt: "Peut-on affirmer à la fois que l’économie est solide et qu’elle connaît des fragilités ?", options: ["Oui, si l’on distingue performances macroéconomiques, vulnérabilités et inégalités", "Non, les deux idées s’excluent toujours", "Oui, sans donner aucun argument", "Non, car une économie solide n’a jamais de dette"], correctIndex: 0, explanation: "La prise de position attendue doit être nuancée et appuyée sur des indicateurs datés.", sourceLabel: "Situation d’évaluation, exercice 1", points: 2 },
        { prompt: "Comment utiliser l’expression « géant aux pieds d’argile » ?", options: ["Comme une thèse à justifier et à nuancer", "Comme un fait chiffré", "Comme une insulte sans argument", "Comme le titre du PND"], correctIndex: 0, explanation: "L’image oppose puissance apparente et fragilités ; elle demande des arguments dans les deux sens.", sourceLabel: "Situation d’évaluation, exercice 2", points: 2 },
      ],
    },
  },
  "terminale-hg-g4-south-korea-development-foundations": {
    splitSectionIndex: 2,
    memorySentence: "La trajectoire sud-coréenne relie territoire aménagé, capital humain, aide extérieure, État stratège et montée en gamme exportatrice.",
    mission: {
      title: "Expliquer le décollage sans raconter un miracle",
      scenario: "Un article présente la Corée du Sud comme une grande puissance industrielle, malgré des ressources naturelles limitées. Il insiste sur ses indicateurs sociaux, son vieillissement et les influences japonaise et américaine. Tu dois vérifier les documents puis construire une explication multifactorielle.",
      modelAnswer: "Les apports extérieurs ont soutenu la reconstruction, mais ils ne suffisent pas. L’éducation, les infrastructures, la planification, le crédit dirigé, le travail, les chaebols, l’entreprise publique POSCO, la recherche et les exportations ont construit la montée en gamme. Ce bilan doit aussi mentionner l’autoritarisme, la concentration économique et le vieillissement.",
      bodyMarkdown: String.raw`## Situation d’évaluation du fascicule

Le texte affirme trois idées : la Corée du Sud est devenue une puissance majeure ; ses indicateurs sociaux sont élevés alors que sa dynamique démographique ralentit ; ses performances viendraient surtout des influences japonaise et américaine.

Les trois consignes demandent de :

1. **dégager l’idée générale** ;
2. **expliquer** le lien entre qualité de vie et recul démographique ;
3. **prendre position** sur le poids des influences étrangères.

Une bonne réponse n’oppose pas brutalement « étranger » et « national ». Elle classe les facteurs, explique leur rôle et ajoute une limite.

## Documents cartographiques reconstruits

Le drapeau, la vue satellitaire et la carte régionale des pages 12-13 ne sont pas reproduits. Ils servent à retenir :

- une péninsule entre **Chine** et **Japon**, divisée entre Corée du Nord et Corée du Sud ;
- **Séoul** au nord-ouest, dans une vaste région-capitale ;
- des métropoles et ports industriels comme **Busan**, **Ulsan** et **Incheon** ;
- des façades maritimes qui relient le pays aux chaînes de valeur asiatiques et mondiales.

## Document 4 - Une courbe arrêtée en 2019

Le graphique de la Banque mondiale compare la croissance démographique annuelle :

| Territoire | Valeur affichée en 2019 |
|---|---:|
| Corée du Nord | +0,5 % |
| Corée du Sud | +0,2 % |
| Japon | -0,2 % |

Il montre un ralentissement de long terme, mais ne permet pas d’annoncer à lui seul un « recul inexorable ». Une courbe datée décrit une période ; elle ne prédit pas automatiquement tout l’avenir.

## Document 5 - Remplacer un tableau incohérent

Le PDF juxtapose, sans millésime commun, croissance **-0,24 %**, natalité **0,59 %**, mortalité **0,57 %**, espérance de vie **82 ans**, alphabétisation **100 %** et chômage **4,9 %**. Le calcul **0,59 - 0,57 = +0,02 point** ne produit pas -0,24 % : années, arrondis, migration ou définitions ont été mélangés.

Des données officielles récentes permettent une lecture plus rigoureuse :

| Indicateur officiel | Valeur et date | Interprétation |
|---|---:|---|
| population recensée | 51,81 millions en 2024 | total incluant 2,04 millions de résidents étrangers |
| 65 ans ou plus | 19,5 % en 2024 | vieillissement rapide |
| fécondité | 0,75 enfant par femme en 2024 | niveau très inférieur au remplacement |
| solde naturel | environ -120 000 en 2024 | plus de décès que de naissances |
| espérance de vie | 83,5 ans en 2023 | niveau social élevé, sans résumer toutes les inégalités |

La population totale peut augmenter légèrement avec les migrations alors que le **solde naturel** est négatif et que la population d’âge actif diminue. Ces phénomènes ne se confondent pas.

Le taux d’alphabétisation « 100 % » doit aussi être écarté comme faux précis : l’enquête nationale de 2020 mesure plusieurs niveaux de littératie et observe encore des adultes sans maîtrise suffisante des compétences élémentaires.

## Situation 1 - Capital humain et étapes du développement

Le premier exercice décrit la Corée du Sud comme l’un des **quatre dragons d’Asie**. Il demande d’expliquer pourquoi les insuffisances naturelles ont encouragé l’investissement dans le capital humain, puis de montrer que le modèle s’est construit par étapes.

**Réponse organisée :**

- **identifier** : les fondements du décollage sud-coréen ;
- **expliquer** : peu de minerais → former, importer, transformer et exporter ;
- **classer** : substitution aux importations → produits légers exportés → industries lourdes → technologies ;
- **nuancer** : ces phases se chevauchent et s’appuient aussi sur aide, réforme agraire, infrastructures et marchés mondiaux.

## Situation 2 - Nature et intervention de l’État

Le second exercice affirme que « la nature ne lui offre pas de réelles potentialités » et que l’intervention étatique a été décisive.

La première formule est **excessive** : relief et sous-sol sont contraignants, mais fleuves, forêts, littoraux et position en Asie orientale sont de vraies potentialités. La seconde est défendable si l’on cite plans, Bureau de 1961, crédit, ports, instituts scientifiques et coopération avec les entreprises.

Elle doit toutefois être nuancée : l’État de Park Chung-hee était autoritaire, les droits syndicaux ont été restreints et les soutiens ont favorisé une forte concentration économique.

## Corriger la thèse des influences étrangères

L’aide américaine, la protection stratégique, des technologies et capitaux étrangers ont compté. Mais la colonisation japonaise ne doit pas être présentée comme un simple avantage, et aucun apport n’aurait suffi sans décisions, compétences et travail en Corée.

**Conclusion modèle :** les influences extérieures fournissent des ressources et des contraintes ; l’État, la société, les travailleurs et les entreprises les transforment en industrialisation. La causalité est donc **multiple**, jamais étrangère seule, culturelle seule ou étatique seule.

> **Méthode BAC.** Utilise le plan **fait daté → mécanisme → résultat → limite**. Exemple : « En 1961, un Bureau de planification coordonne les priorités ; le crédit finance les secteurs exportateurs ; l’industrie monte en gamme ; cependant le pouvoir économique et politique se concentre. »` ,
      questions: [
        question("Quelle est l’idée générale de la situation ?", "Expliquer les facteurs naturels, humains, extérieurs et politiques de la trajectoire sud-coréenne", ["L’échec définitif de l’industrie coréenne", "La disparition immédiate de toute la population", "La création de l’Union africaine"], "Le sujet cherche à relier plusieurs fondements du passage à une économie avancée.", 1),
        question("Comment qualité de vie élevée et ralentissement démographique peuvent-ils coexister ?", "Longévité et éducation progressent tandis que faible fécondité et vieillissement réduisent le solde naturel", ["Une longue espérance de vie impose toujours beaucoup de naissances", "Le vieillissement crée des minerais", "Les deux phénomènes s’excluent nécessairement"], "Des indicateurs sociaux élevés n’empêchent ni la faible fécondité ni la diminution de la population d’âge actif.", 2),
        question("Quelle appréciation des influences étrangères est équilibrée ?", "Elles ont aidé ou contraint, mais les acteurs nationaux ont transformé ces apports par leurs propres choix", ["Elles expliquent seules tout le succès", "Elles n’ont joué aucun rôle", "La colonisation fut uniquement bénéfique"], "Il faut distinguer aide, domination, capitaux et technologies, puis expliquer leur transformation par les institutions et la société.", 0),
      ],
      extraQuestions: [
        { prompt: "Pourquoi le thème « pays émergent » doit-il être contextualisé aujourd’hui ?", options: ["La leçon étudie une trajectoire historique, mais la Corée du Sud est désormais une économie avancée et à revenu élevé", "La Corée du Sud n’a jamais eu d’économie", "Le mot signifie uniquement pays montagneux", "Le classement n’a aucune date"], correctIndex: 0, explanation: "Le thème scolaire porte sur le processus d’émergence, non sur le classement actuel du pays.", sourceLabel: "Mise à jour FMI / Banque mondiale", points: 2 },
        { prompt: "Quelle croissance démographique le Document 4 affiche-t-il pour la Corée du Sud en 2019 ?", options: ["+0,2 %", "+0,5 %", "-0,2 %", "-2,4 %"], correctIndex: 0, explanation: "La courbe place la Corée du Sud à +0,2 %, entre la Corée du Nord et le Japon.", sourceLabel: "Document 4", points: 1 },
        { prompt: "Quel territoire est à -0,2 % sur ce graphique ?", options: ["Le Japon", "La Corée du Sud", "La Corée du Nord", "La Côte d’Ivoire"], correctIndex: 0, explanation: "Le Japon est négatif dans la dernière année affichée, tandis que les deux Corées restent positives sur cette courbe datée.", sourceLabel: "Document 4", points: 1 },
        { prompt: "Quel solde naturel résulte des taux 0,59 % et 0,57 % du Document 5 ?", options: ["+0,02 point", "-0,24 point", "+1,16 point", "-0,57 point"], correctIndex: 0, explanation: "Natalité moins mortalité donne +0,02 point, ce qui révèle l’incohérence du tableau.", sourceLabel: "Document 5", points: 2 },
        { prompt: "Quelles informations manquent pour relier ce +0,02 au -0,24 % annoncé ?", options: ["Année commune, arrondis, migration et définitions", "Le nombre de montagnes uniquement", "La couleur du drapeau", "Le nom d’un chaebol"], correctIndex: 0, explanation: "Des séries de dates ou de périmètres différents ne peuvent pas être additionnées sans contrôle.", sourceLabel: "Critique documentaire", points: 2 },
        { prompt: "Comment la population totale peut-elle légèrement augmenter malgré un déficit naturel ?", options: ["Le solde migratoire peut compenser davantage de décès que de naissances", "Le vieillissement crée automatiquement des naissances", "Les migrations n’entrent jamais dans la population", "Le déficit naturel mesure les exportations"], correctIndex: 0, explanation: "Variation totale = solde naturel + solde migratoire, sous réserve des ajustements statistiques.", sourceLabel: "Mise à jour KOSTAT 2024", points: 2 },
        { prompt: "Pourquoi faut-il écarter « 100 % d’alphabétisation » comme mesure exacte ?", options: ["La littératie comporte plusieurs niveaux et l’enquête observe encore des difficultés élémentaires", "Personne ne sait lire en Corée", "L’alphabétisation ne peut jamais être mesurée", "Le chiffre mesure la mortalité"], correctIndex: 0, explanation: "Le résultat dépend du seuil ; l’enquête adulte de 2020 ne confirme pas une maîtrise parfaite de toute la population.", sourceLabel: "Correction KOSTAT, enquête de littératie", points: 2 },
        { prompt: "Quels territoires forment traditionnellement les quatre dragons d’Asie ?", options: ["Corée du Sud, Taïwan, Hong Kong et Singapour", "Chine, Japon, Inde et Russie", "Corée du Nord, Laos, Cambodge et Népal", "France, Allemagne, Italie et Espagne"], correctIndex: 0, explanation: "L’expression désigne quatre économies d’Asie orientale à industrialisation rapide.", sourceLabel: "Situation d’évaluation, exercice 1", points: 1 },
        { prompt: "Pourquoi « la nature n’offre pas de réelles potentialités » est-il excessif ?", options: ["Les eaux, littoraux, forêts et la position régionale sont des atouts aménageables", "Le pays possède toutes les réserves de pétrole du monde", "Le relief est entièrement plat", "Aucun typhon n’existe"], correctIndex: 0, explanation: "Le territoire est contraignant mais pas dépourvu de ressources et d’ouvertures.", sourceLabel: "Situation d’évaluation, exercice 2", points: 2 },
        { prompt: "Quel fait prouve concrètement l’intervention économique de l’État ?", options: ["Création du Bureau de planification en 1961 et orientation du crédit", "Absence de tout plan", "Suppression de toutes les infrastructures", "Refus de former des ingénieurs"], correctIndex: 0, explanation: "Plans, financement, ports, énergie et recherche matérialisent la stratégie publique.", sourceLabel: "Situation d’évaluation, exercice 2", points: 2 },
        { prompt: "Quel ordre restitue la montée en gamme ?", options: ["Substitution → exportations légères → industries lourdes → technologies", "Technologies → coton → colonisation → fermeture", "Industries lourdes → aucune exportation → farine", "Mousson → chaebol → relief → mortalité"], correctIndex: 0, explanation: "Chaque étape dominante réutilise une partie des capacités accumulées auparavant.", sourceLabel: "Situation d’évaluation, exercice 1", points: 1 },
        { prompt: "Quelle distinction entre Samsung et POSCO est correcte pour la période étudiée ?", options: ["Samsung est un chaebol privé ; POSCO est alors une entreprise sidérurgique publique", "POSCO est un fleuve et Samsung un climat", "Les deux sont des religions", "Les deux sont des programmes de reforestation"], correctIndex: 0, explanation: "Le PDF les associe trop vite : POSCO n’était pas un chaebol et sa privatisation s’achève seulement en 2000.", sourceLabel: "Correction institutionnelle", points: 2 },
      ],
    },
  },
  "terminale-hg-g6-ecowas": {
    splitSectionIndex: 2,
    memorySentence: "CEDEAO : un projet d’intégration à douze membres, porté par des institutions et des acquis concrets, mais fragilisé par les crises et l’application incomplète des décisions.",
    mission: {
      title: "La CEDEAO est-elle à la hauteur de ses ambitions ?",
      scenario: "Après avoir étudié la solidarité régionale pendant l’épidémie d’Ebola, les sanctions contre la junte malienne en 2020, un communiqué sur les attaques de 2021 et deux textes critiques datés de 2005, une classe doit apprécier le bilan de la CEDEAO sans confondre les documents historiques avec sa configuration actuelle à douze membres.",
      modelAnswer: "La CEDEAO a construit des droits de circulation, des règles commerciales, des réseaux et des mécanismes de médiation. Elle reste néanmoins confrontée à des obstacles frontaliers, aux crises politiques et sécuritaires, à une faible transformation régionale et au retrait de trois États en 2025. Le bilan est donc réel mais inachevé ; il doit être jugé par ses effets sur les populations.",
      questions: [
        { ...question("Quel problème principal relie les documents ?", "L’écart entre les ambitions, les actions et les résultats de l’intégration régionale", ["L’absence de tout État en Afrique de l’Ouest", "La disparition de toutes les frontières mondiales", "La création de l’ONU"], "Le dossier confronte solidarité, sanctions, potentialités, réalisations et obstacles.", 1), sourceLabel: "Dossiers A à D du fascicule", points: 1 },
        { ...question("Pourquoi la CEDEAO reste-t-elle importante malgré les retraits de 2025 ?", "Elle organise libre circulation, commerce, réseaux et coopération pour des populations interdépendantes", ["Elle interdit tout commerce entre ses membres", "Elle remplace tous les gouvernements nationaux", "Elle ne s’occupe que de sport"], "Les liens humains, économiques et sécuritaires ne disparaissent pas avec une modification institutionnelle.", 2), sourceLabel: "Configuration actualisée en 2025-2026", points: 2 },
        { ...question("Quelle appréciation finale est la mieux justifiée ?", "Des acquis existent, mais crises, obstacles et application inégale rendent l’intégration inachevée", ["La CEDEAO a déjà réalisé tous ses objectifs", "Aucune action régionale n’a jamais existé", "La monnaie ECO circule déjà dans les douze États"], "Une appréciation argumentée met en regard résultats, limites et effets sur les populations.", 0), sourceLabel: "Synthèse des situations d’évaluation", points: 2 },
      ],
      bodyMarkdown: String.raw`## Dossier A — La solidarité face à Ebola (2013-2014)

La situation d’évaluation du fascicule part de la mobilisation des chefs d’État pendant l’épidémie qui touche notamment la Guinée, le Liberia et la Sierra Leone. Deux groupes débattent :

- le premier juge que cette solidarité ne fait pas disparaître les obstacles à l’intégration ;
- le second rappelle les nombreuses actions menées depuis 1975.

Le problème à traiter n’est donc ni « succès » ni « échec » absolu, mais **la portée et les limites de l’intégration régionale**.

## Dossier B — Un commentaire critique publié en 2005

Un article de Didier Samson présente les ambitions de marché commun, de tarif extérieur, d’harmonisation et d’union monétaire, puis déplore la faiblesse des échanges intrarégionaux, annoncés autour de **11 %**.

> **Précision documentaire.** Ce 11 % est un chiffre de **2005**, pas une statistique actuelle. L’article affirme aussi que « la plupart » des pays utilisaient le franc CFA : à l’époque, huit des quinze membres appartenaient à l’UEMOA. Depuis le retrait de trois États sahéliens, seuls cinq des douze membres actuels utilisent ce franc. Il faut dater avant de généraliser.

Le passage sur les « langues coloniales » invite surtout à expliquer un choix politique : **privilégier une règle régionale commune lorsque des intérêts nationaux ou des administrations différentes compliquent la coopération**. Les langues africaines transfrontalières montrent en même temps que les sociétés sont déjà reliées.

## Dossier C — Gérer les crises : Mali 2020 et Côte d’Ivoire 2021

Le premier document relate la réponse de la CEDEAO au coup d’État malien d’août **2020** : suspension des organes de décision, fermeture de frontières, restrictions financières et commerciales, puis conditions pour une transition civile. Le texte résume ces mesures comme un arrêt de « tous » les flux ; le communiqué officiel exemptait pourtant les aliments essentiels, produits pharmaceutiques et médicaux, produits pétroliers et électricité.

Le second document est un communiqué du **30 mars 2021** condamnant les attaques de Kafolo et Kolobougou en Côte d’Ivoire et appelant à la solidarité contre le terrorisme.

| Moyen d’action | But recherché | Limite à discuter |
|---|---|---|
| sanctions et suspension | défendre l’ordre constitutionnel et obtenir une transition | effets économiques et sociaux sur une population enclavée |
| communiqué et solidarité | condamner une attaque et mobiliser les partenaires | une déclaration ne neutralise pas seule les groupes armés |
| médiation | négocier une sortie de crise | dépend de la confiance, du rapport de forces et de l’application des accords |

> **Correction de consigne.** La page 9 demande la thématique commune à « **trois documents** », mais le fascicule n’en fournit que **deux** : l’article sur le Mali et le communiqué sur les attaques en Côte d’Ivoire. La réponse doit donc s’appuyer sur ces deux pièces, sans inventer un troisième document.

Le Mali n’est plus membre depuis le 29 janvier 2025. Le texte reste utile pour comprendre une méthode de gestion de crise en 2020, pas pour décrire sa situation institutionnelle actuelle.

## Dossier D — Potentialités, candidature marocaine et conflits

La situation sur le Maroc rappelle sa candidature présentée en **2017**. En juin, la Conférence soutient en principe l’adhésion et demande une étude de ses implications ; en décembre, elle exige aussi un cadre juridique et institutionnel adapté. En 2026, le Maroc n’est pas membre.

> **Correction du corrigé.** Répondre simplement « impossible » parce que le Maroc serait un concurrent du Nigeria ou voudrait « conquérir » la finance est spéculatif. Une réponse rigoureuse distingue : localisation géographique définie par le traité, procédure d’adhésion, étude des effets économiques et décision souveraine des États membres. La demande n’a pas abouti, mais elle a bien été examinée.

Le texte de l’OCDE publié pour le trentième anniversaire en **2005** relie ressources, pauvreté, inégalités, coups d’État, rebellions, crises électorales et sécurité humaine. Il ne faut pas opposer caricaturalement « élites » et « masses » : on peut analyser plus précisément les écarts de revenus, d’accès aux services, de représentation et d’opportunités.

## Barème reconstruit de la situation complexe

| Critère | Points |
|---|---:|
| identifier correctement le problème | 1 |
| expliquer le passage demandé | 2,5 |
| apprécier de manière cohérente | 2,5 |
| mobiliser des informations justes et datées | 1 |
| **Total** | **7** |

> **Méthode BAC.** Pour apprécier : **constat daté → moyen d’action → résultat → limite → jugement**. Une réponse peut donc conclure : « La CEDEAO agit par règles, projets, médiations et sanctions ; ces outils produisent des acquis, mais leur efficacité dépend de leur application, de leur proportionnalité et de leurs effets sur les populations. »` ,
      extraQuestions: [
        { prompt: "Quels pays sont particulièrement touchés par Ebola dans la situation étudiée ?", options: ["Nigeria, Ghana et Togo", "Maroc, Algérie et Tunisie", "Burkina Faso, Mali et Niger", "Guinée, Liberia et Sierra Leone"], correctIndex: 3, explanation: "La situation cite ces trois pays au cœur de l’épidémie ouest-africaine de 2013-2014.", sourceLabel: "Situation d’évaluation, page 7", points: 1 },
        { prompt: "Que signifie l’affirmation selon laquelle la solidarité ne peut cacher les obstacles ?", options: ["La solidarité est toujours inutile", "Aucune épidémie n’a existé", "Une action commune ponctuelle n’efface pas les crises, les entraves et la faible application des décisions", "Tous les objectifs sont atteints"], correctIndex: 2, explanation: "Il faut distinguer une réussite précise du bilan général de l’intégration.", sourceLabel: "Situation d’évaluation, page 7", points: 2 },
        { prompt: "Combien des quinze membres utilisaient le franc CFA dans le document de 2005 ?", options: ["Les quinze", "Huit", "Cinq", "Aucun"], correctIndex: 1, explanation: "Huit États appartenaient alors à l’UEMOA ; le chiffre doit rester rattaché à la configuration de 2005.", sourceLabel: "Commentaire de texte RFI, 2005", points: 2 },
        { prompt: "Comment utiliser le chiffre de 11 % des échanges intrarégionaux ?", options: ["Comme une donnée de l’article publié en 2005, pas comme un taux actuel", "Comme un chiffre éternel", "Comme la part des États membres", "Comme le taux de création de monnaie"], correctIndex: 0, explanation: "Une statistique documentaire doit conserver son année et son périmètre.", sourceLabel: "Commentaire de texte RFI, 2005", points: 2 },
        { prompt: "Que traduit l’idée de dépasser les langues coloniales et les intérêts nationaux ?", options: ["Supprimer toutes les langues africaines", "Fermer les frontières", "Construire des règles régionales malgré des administrations et priorités différentes", "Interdire toute souveraineté"], correctIndex: 2, explanation: "L’intégration cherche un intérêt commun sans nier les langues ni les États.", sourceLabel: "Commentaire de texte, pages 7-8", points: 2 },
        { prompt: "Que signifient les restrictions de frontières et de flux décidées en août 2020 ?", options: ["Une adhésion du Mali à l’Union européenne", "La création de l’ECO", "Une opération agricole", "Une sanction politique, commerciale et financière visant la junte, assortie d’exemptions essentielles"], correctIndex: 3, explanation: "La CEDEAO voulait faire pression sur les auteurs du coup d’État tout en exemptant notamment aliments essentiels, médicaments, produits pétroliers et électricité.", sourceLabel: "Situation complexe, document 1", points: 2 },
        { prompt: "Combien de documents la situation complexe fournit-elle réellement ?", options: ["Trois", "Deux", "Un", "Quatre"], correctIndex: 1, explanation: "L’article sur le Mali et le communiqué sur la Côte d’Ivoire sont les deux pièces visibles ; « trois » est une coquille.", sourceLabel: "Correction de la consigne, page 9", points: 2 },
        { prompt: "Quelle appréciation de la gestion des crises est équilibrée ?", options: ["Sanctions, médiations et communiqués existent, mais ne suffisent pas toujours à prévenir de nouvelles crises", "Un communiqué règle toujours un conflit", "Les sanctions n’ont jamais d’effet sur les populations", "La CEDEAO ne prend aucune position"], correctIndex: 0, explanation: "Les documents montrent plusieurs moyens d’action et leurs limites.", sourceLabel: "Situation complexe, corrigé", points: 2 },
        { prompt: "Quel est le statut exact de la candidature marocaine de 2017 ?", options: ["Adhésion automatique dès février 2017", "Refus sans examen", "Retrait d’un ancien membre", "Soutien de principe puis étude juridique et économique, sans adhésion réalisée"], correctIndex: 3, explanation: "La Conférence a demandé d’étudier les implications et le cadre de décision ; le Maroc n’est pas membre en 2026.", sourceLabel: "Correction de la situation Maroc", points: 2 },
        { prompt: "Quelle idée générale ressort du texte de l’OCDE de 2005 ?", options: ["Les ressources suppriment automatiquement la pauvreté", "Tous les conflits ont disparu", "Les difficultés politiques et sociales éprouvent la paix, la démocratie et le potentiel économique régional", "L’intégration interdit les services publics"], correctIndex: 2, explanation: "Le texte relie transformations, inégalités, conflits et construction de la paix.", sourceLabel: "Exercice OCDE, pages 11-12", points: 2 },
      ],
    },
  },
  "terminale-hg-g7-eu-acp-cooperation": {
    splitSectionIndex: 1,
    memorySentence: "Rome et Yaoundé associent, Lomé préfère et stabilise, Cotonou réforme, Samoa régionalise ; le bilan oppose acquis réels et dépendances persistantes.",
    mission: {
      title: "De Cotonou à Samoa : le partenariat a-t-il produit le développement attendu ?",
      scenario: "Une classe confronte trois débats du fascicule et les analyses de Robert Dussey, Albert Tévoédjrè et Bernard Petit. Elle doit distinguer les acquis concrets de la coopération, ses déséquilibres structurels et les conditions d’un partenariat UE-OEACP plus équilibré dans le cadre actuel de Samoa.",
      modelAnswer: "Les accords ont financé des infrastructures, des services, des formations et un dialogue politique, tout en ouvrant des marchés. Ils n’ont pourtant pas supprimé la dépendance aux produits primaires, la faiblesse de l’investissement productif, la pauvreté ni l’asymétrie commerciale. Un partenariat plus équilibré doit soutenir la transformation locale, l’intégration régionale, les capacités publiques et une évaluation transparente des résultats.",
      bodyMarkdown: String.raw`## Dossier A — Trois situations, une même controverse

La première situation rapporte un débat tenu à **Cotonou** lors d’un sommet France-Afrique. Un camp insiste sur l’intérêt mutuel des accords ; l’autre estime que le développement promis reste insuffisant. La réponse attendue doit donc identifier **le bilan de la coopération**, expliquer l’expression « à bénéfice mutuel » et prendre une position justifiée.

Une deuxième situation, construite autour d’un entretien accordé en **octobre 2018** par le ministre togolais Robert Dussey, reconnaît l’apport de l’aide au développement tout en soulignant les résultats commerciaux et productifs insuffisants ainsi qu’un rapport jugé plus favorable à l’Europe.

La troisième situation oppose deux affirmations absolues : « l’UE développe les ACP » contre « l’UE retarde et ruine les ACP ». Aucune ne suffit. Il faut répondre avec des **faits datés**, distinguer bénéficiaires et domaines, puis ajouter une nuance.

## Dossier B — Réparer le texte lacunaire

Le texte à compléter des pages 14-15 comporte **douze blancs**, alors que sa banque ne fournit que **dix éléments**. Il date aussi le traité de Rome du « 25 mars 1975 ».

> **Corrections de source.** La date exacte est le **25 mars 1957**. Une reconstruction cohérente exige douze éléments : **Caraïbes ; Pacifique ; Communauté économique européenne ; puissances colonisatrices ; outre-mer ; union ; intérêts ; complémentarité ; accords ; espoirs ; ACP ; difficultés**. La banque originale étant incomplète, aucune copie à l’identique ne peut donner une solution unique.

## Dossier C — Transformer les vrai/faux en jugements rigoureux

Les six affirmations finales du fascicule portent sur infrastructures, débouchés, aide humanitaire, bénéficiaires, APE et concurrence européenne. Plusieurs sont trop générales.

| Affirmation | Réponse rigoureuse |
|---|---|
| des infrastructures ont été développées | **vrai dans de nombreux projets**, sans généraliser à tous les pays ni à tous les besoins |
| des produits ACP ont trouvé des débouchés européens | **vrai**, notamment sous les préférences de Lomé, mais avec des résultats variables |
| l’action humanitaire fait partie de la coopération | **vrai** |
| les ACP sont « les plus grands bénéficiaires » | **non démontré** : l’UE bénéficie aussi d’échanges, de marchés et d’approvisionnements |
| les APE sont « très profitables » | formulation trop absolue : accès européen, transitions et sauvegardes coexistent avec des risques pour les recettes et producteurs |
| les produits européens ont « envahi » les marchés ACP | remplacer le slogan par une analyse de la concurrence, des volumes, des secteurs et des périodes |

## Dossier D — Deux lectures opposées à confronter

Dans un texte publié en **2014**, Albert Tévoédjrè insiste sur l’héritage colonial, la dépendance et l’asymétrie. Dans un article publié en **2008**, Bernard Petit rappelle les aides, infrastructures et progrès en matière de droits, tout en reconnaissant que la pauvreté n’a pas été éradiquée.

Ces documents ne s’annulent pas : ils posent des questions différentes. Le premier interroge le **rapport de pouvoir** ; le second mesure des **réalisations**. Leur point commun est que des projets réels ne garantissent pas, à eux seuls, une transformation structurelle.

## Dossier E — Actualiser sans effacer l’histoire

Depuis le **1er janvier 2024**, l’accord de Samoa succède provisoirement à Cotonou. Il relie l’UE à **77 pays partenaires**, tandis que l’OEACP conserve **79 membres**. Il combine un socle commun et trois protocoles régionaux. La conclusion doit donc proposer des critères actuels : valeur ajoutée créée localement, emplois, diversification, accès aux services, droits, climat, mobilité, transparence et participation des populations.

## Barème reconstruit

| Critère | Points |
|---|---:|
| identifier le problème et dater les documents | 1 |
| expliquer le bénéfice mutuel avec un exemple pour chaque partenaire | 2 |
| présenter au moins deux acquis et deux limites | 2 |
| proposer deux conditions de rééquilibrage | 1 |
| conclure par un jugement nuancé | 1 |
| **Total** | **7** |

> **Méthode BAC.** Construis chaque paragraphe avec **fait daté → bénéficiaire → résultat → limite → condition d’amélioration**.` ,
      questions: [
        { ...question("Quel problème commun relie les trois situations d’évaluation ?", "L’écart entre les objectifs, les réalisations et les résultats durables de la coopération UE-ACP", ["La disparition de l’Union européenne", "La guerre d’Algérie", "Le fonctionnement des climats ivoiriens"], "Les débats demandent tous d’apprécier le bilan du partenariat sans réponse absolue.", 1), sourceLabel: "Situations d’évaluation, pages 13-18", points: 1 },
        { ...question("Que signifie ici une coopération « à bénéfice mutuel » ?", "Les partenaires peuvent tous deux gagner, mais pas nécessairement autant ni de la même manière", ["Les États ACP deviennent membres de l’UE", "Tout financement profite automatiquement à chaque habitant", "Les échanges sont identiques dans tous les secteurs"], "L’UE obtient notamment échanges et approvisionnements ; les partenaires ACP recherchent débouchés, financements et technologies, dans un rapport souvent asymétrique.", 2), sourceLabel: "Situation d’évaluation France-Afrique, consigne 2", points: 2 },
        { ...question("Quelle prise de position répond le mieux au débat final ?", "Des acquis existent, mais ils restent insuffisants sans transformation locale, diversification et meilleur équilibre commercial", ["L’UE a tout réussi", "L’UE a volontairement ruiné tous les États ACP", "Aucun partenariat n’a jamais existé"], "Une conclusion recevable mobilise des faits, reconnaît les résultats et expose les limites structurelles.", 0), sourceLabel: "Synthèse des trois situations, consigne 3", points: 2 },
      ],
      extraQuestions: [
        { prompt: "Quelle date doit remplacer « 25 mars 1975 » dans le texte lacunaire ?", options: ["25 mars 1957", "28 février 1975", "23 juin 2000", "15 novembre 2023"], correctIndex: 0, explanation: "Le traité instituant la CEE est signé à Rome le 25 mars 1957.", sourceLabel: "Exercice 2, correction de source", points: 2 },
        { prompt: "Pourquoi le texte lacunaire ne peut-il pas être corrigé avec sa banque telle quelle ?", options: ["Il contient douze blancs pour dix éléments proposés", "Il ne contient aucun blanc", "Toutes les réponses sont des nombres", "Il porte uniquement sur Samoa"], correctIndex: 0, explanation: "Deux éléments nécessaires manquent ; la correction doit signaler le défaut au lieu d’inventer une correspondance.", sourceLabel: "Exercice 2, pages 14-15", points: 2 },
        { prompt: "Quelle suite complète correctement les quatre premiers blancs reconstruits ?", options: ["Caraïbes ; Pacifique ; Communauté économique européenne ; puissances colonisatrices", "Europe ; Afrique ; CEDEAO ; pays enclavés", "Pacifique ; Rome ; STABEX ; Maastricht", "ACP ; Samoa ; FED ; APE"], correctIndex: 0, explanation: "Cette suite rétablit le périmètre géographique et le cadre historique de l’association.", sourceLabel: "Exercice 2, reconstruction corrigée", points: 2 },
        { prompt: "Comment répondre aux affirmations sur infrastructures, débouchés et aide humanitaire ?", options: ["Reconnaître des réalisations documentées tout en précisant leur période et leur portée", "Les déclarer toutes fausses", "Les appliquer sans preuve à chaque pays", "Les confondre avec des adhésions à l’UE"], correctIndex: 0, explanation: "Les trois domaines existent, mais une réalisation située ne prouve pas que tous les besoins sont satisfaits.", sourceLabel: "Exercice 3, affirmations 1 à 3", points: 2 },
        { prompt: "Pourquoi « les ACP sont les plus grands bénéficiaires » et « les APE sont très profitables » sont-ils de mauvais vrai/faux ?", options: ["Ils emploient des jugements absolus sans critère ni données suffisantes", "Ils contiennent trop de dates", "Ils décrivent uniquement la météo", "Ils sont des formules mathématiques"], correctIndex: 0, explanation: "Il faut définir bénéficiaire, profit, période et effets avant de conclure.", sourceLabel: "Exercice 3, affirmations 4 et 5", points: 2 },
        { prompt: "Comment reformuler l’idée que les produits européens ont « envahi » les marchés ACP ?", options: ["Étudier la pression concurrentielle par produit, pays, période, prix et emploi local", "Affirmer une invasion militaire", "Conclure que tout commerce est interdit", "Supposer que tous les consommateurs perdent"], correctIndex: 0, explanation: "Une analyse économique remplace le slogan par des indicateurs vérifiables.", sourceLabel: "Exercice 3, affirmation 6", points: 2 },
        { prompt: "Quel bilan Robert Dussey formule-t-il dans l’entretien de 2018 ?", options: ["L’aide a compté, mais commerce, investissement productif et progrès économique restent insuffisants et déséquilibrés", "Cotonou n’a jamais existé", "Tous les pays ACP sont industrialisés", "L’UE ne finance aucun projet"], correctIndex: 0, explanation: "Le document associe reconnaissance de l’aide et critique des promesses économiques non tenues.", sourceLabel: "Situation d’évaluation, document Robert Dussey, 2018", points: 2 },
        { prompt: "Comment confronter Tévoédjrè et Bernard Petit ?", options: ["Le premier insiste sur dépendance et asymétrie ; le second sur les réalisations, sans nier la pauvreté persistante", "Ils affirment exactement que tout a réussi", "Ils décrivent la création de la CECA", "Ils rejettent tous deux toute coopération"], correctIndex: 0, explanation: "Le croisement des deux points de vue produit un bilan plus complet que l’adoption d’un seul.", sourceLabel: "Documents 1 et 2, pages 17-18", points: 2 },
        { prompt: "Quelle distinction actuelle est exacte ?", options: ["L’OEACP compte 79 membres ; Samoa constitue le cadre juridique avec 77 pays partenaires", "L’UE compte 79 membres", "Samoa réunit uniquement les États européens", "Cotonou est signé en 1957"], correctIndex: 0, explanation: "Organisation et périmètre actuel de l’accord ne sont pas strictement identiques.", sourceLabel: "Actualisation 2024-2026", points: 2 },
        { prompt: "Quelle proposition renforcerait le mieux l’équilibre du partenariat ?", options: ["Soutenir transformation locale, intégration régionale, compétences et suivi transparent des résultats", "Maintenir uniquement l’exportation de matières brutes", "Supprimer toute évaluation", "Écarter les acteurs locaux"], correctIndex: 0, explanation: "Créer davantage de valeur et de capacités locales répond aux limites structurelles relevées par les documents.", sourceLabel: "Proposition argumentée — mission finale", points: 2 },
      ],
    },
  },
  "terminale-hg-h1-united-nations": {
    splitSectionIndex: 2,
    memorySentence: "Pour juger l’ONU, il faut relier ses objectifs, ses organes, ses succès et ses limites.",
    mission: {
      title: "L’ONU a-t-elle rempli sa mission ?",
      scenario: "Lors de la célébration du 74e anniversaire de l’ONU, un officiel affirme : « L’ONU est née de la volonté des vainqueurs de la seconde guerre mondiale. Après environ 75 ans d’existence, il faut avoir le courage de l’avouer, elle ne reflète plus la réalité du moment. Au-delà de cet aspect, le bilan de l’organisation est mitigé. De nombreux défis restent à relever. »",
      modelAnswer: "L’ONU a favorisé la coopération, la décolonisation et plusieurs opérations de paix, mais le veto, les rivalités des puissances et certains conflits non résolus limitent son action.",
      bodyMarkdown: String.raw`## Document d’appui — discours d’Emmanuel Macron (75e Assemblée générale, 21 septembre 2020)

> « Le 26 juin 1945 à San Francisco, alors que la guerre faisait encore rage dans le Pacifique, nos prédécesseurs se sont accordés sur une **triple promesse** : préserver les générations futures du fléau de la guerre ; affirmer les droits de l’homme et l’égalité des nations et favoriser le progrès social dans une liberté plus grande. En 75 ans d’existence, l’organisation des Nations Unies, notre maison commune, est restée fidèle à cette promesse. »
>
> Et il ajoute plus loin : « Notre maison commune est en désordre, à l’image de notre monde. Ses **fondations s’érodent** et ses **murs se lézardent**, parfois sous les coups de boutoir de ceux-là mêmes qui l’ont construite. »
>
> *Source : onu.delegfrance.org — commémoration du 75e anniversaire.*

## Comment lire ce document

Ce discours est **nuancé** : il reconnaît d’abord la fidélité de l’ONU à sa « triple promesse » (paix, droits, progrès social), puis en pointe les fragilités (« fondations s’érodent », « murs se lézardent »). L’image de la « maison commune en désordre » résume le **bilan mitigé** du cours.

> **Méthode — expliquer une citation.** Ne la paraphrase pas : cite le passage entre guillemets, puis explique-le avec une connaissance précise du cours. « Quand Macron dit que “ceux-là mêmes qui l’ont construite” affaiblissent l’ONU, il désigne les cinq membres permanents qui usent abusivement du droit de veto. »`,
      questions: [
        question("Quel problème cette affirmation soulève-t-elle ?", "L’efficacité et le bilan de l’ONU dans le maintien de la paix", ["La production agricole mondiale", "La création de la Corée du Sud", "Le climat de Côte d’Ivoire"], "La situation invite à confronter les objectifs de l’ONU à ses résultats.", 1),
        question("Pourquoi dit-on que l’ONU reflète la volonté des vainqueurs de 1945 ?", "Les principales puissances victorieuses disposent d’un siège permanent et du veto", ["Elles sont les seules à siéger à l’Assemblée générale", "Elles contrôlent toutes les ONG", "Elles ont supprimé la Charte"], "La composition permanente du Conseil de sécurité traduit le rapport de forces de 1945.", 2),
        question("Quel jugement est le plus équilibré ?", "L’ONU a obtenu des succès réels, mais ses moyens et les rivalités limitent son efficacité", ["L’ONU n’a jamais rien accompli", "L’ONU a supprimé toutes les guerres", "Le veto garantit toujours une action rapide"], "Le bilan doit présenter à la fois les acquis et les échecs.", 0),
      ],
      extraQuestions: [
        question("Dans le discours, quelle est la « triple promesse » de 1945 ?", "Préserver de la guerre, affirmer les droits de l’homme, favoriser le progrès social", ["Créer une armée, une monnaie et un drapeau communs", "Diviser le monde en trois blocs", "Supprimer les frontières, les États et les impôts"], "Macron reprend les trois grands objectifs inscrits dans la Charte.", 0),
        question("Que désigne l’image des « murs qui se lézardent, sous les coups de ceux qui l’ont construite » ?", "Les grandes puissances fondatrices qui affaiblissent l’ONU, notamment par le veto", ["Les nouveaux États membres africains", "Les organismes spécialisés comme l’OMS", "Les casques bleus sur le terrain"], "« Ceux qui l’ont construite » sont les membres permanents du Conseil de sécurité.", 0),
        question("Le point de vue « le bilan de l’ONU est mitigé » est-il défendable ?", "Oui : l’ONU a des succès réels mais aussi des limites persistantes", ["Non : l’ONU n’a que des succès", "Non : l’ONU n’a que des échecs", "Non : l’ONU n’a jamais agi"], "Un bilan mitigé combine acquis et échecs : c’est la conclusion attendue du cours.", 0),
      ],
    },
  },
  "terminale-hg-h2-bipolar-world": {
    splitSectionIndex: 1,
    memorySentence: "La guerre froide passe de la formation des blocs aux crises, puis à la détente avant l’effondrement du bloc soviétique.",
    mission: {
      title: "De l’affrontement à la fin de la bipolarisation",
      scenario: "Des élèves débattent des crises de la guerre froide et se demandent si la coexistence pacifique a réellement mis fin aux tensions entre les deux blocs.",
      modelAnswer: "La coexistence pacifique réduit le risque d’affrontement direct, mais les crises de Berlin, Cuba et les conflits périphériques montrent que la rivalité se poursuit jusqu’à l’affaiblissement de l’URSS.",
      bodyMarkdown: String.raw`## La situation d’évaluation

> Tu assistes à une conférence sur les conséquences de la Deuxième Guerre mondiale, organisée lors de la journée « porte ouverte » de la promotion Terminale.
>
> Le conférencier affirme : « **Le monde a été divisé en deux blocs antagonistes sans affrontement direct. Ils connaîtront des moments de crises et de détentes qui vont marquer les relations internationales. Aussi, cette situation de ni paix ni guerre résulte des intérêts idéologiques, politiques et économiques des Deux Grands issus du second conflit mondial.** »
>
> Il conclut : « **Mikhaïl Gorbatchev a sans aucun doute contribué à changer cette situation.** »

## Le document d’appui

*Extrait de Pierre Thibaut,* Le temps de la contestation (1947-1969), *Histoire Universelle, 1971 :*

> « La volonté déterminée de Washington de mettre un terme définitif à l’expansion du communisme international […] C’est pour se prémunir contre ce double danger que le président des États-Unis élabore la “doctrine Truman” qu’il définit devant le Congrès le **12 mars 1947**. […] Cette politique de “containment” aboutit dans l’immédiat à accorder une aide militaire à la Turquie et surtout à la Grèce […] elle entraîne l’élaboration du Plan Marshall d’aide à l’Europe, annoncé […] à l’Université Harvard le **5 juin 1947**. […] Le gouvernement de Moscou […] riposte d’abord en décidant de constituer dès le **5 octobre 1947** un bureau d’information, le **Kominform**. […] Passant ensuite à l’offensive, il engage avec les États-Unis une épreuve de force qui dure près d’un an, **du 24 juin 1948 au 12 mai 1949**. »

## Comment construire ta réponse

**Consigne 1 — Dégager le problème.** Une seule phrase suffit : « Il s’agit de… ». Ici, l’évolution des relations entre les deux blocs de 1947 à 1991.

**Consigne 2 — Expliquer la phrase soulignée.** Montre que l’opposition est **globale**, en traitant les trois plans annoncés :

| Plan | Bloc de l’Ouest | Bloc de l’Est |
|---|---|---|
| **Idéologique** | démocratie libérale, libertés individuelles | parti unique, marxisme-léninisme |
| **Politique** | doctrine Truman, alliances (OTAN) | doctrine Jdanov, Pacte de Varsovie |
| **Économique** | capitalisme, plan Marshall, OECE puis OCDE | économie planifiée, CAEM |

Puis explique pourquoi l’on parle de « ni paix ni guerre » : l’arme nucléaire rend l’affrontement direct **suicidaire**, d’où une confrontation par crises et conflits périphériques interposés.

**Consigne 3 — Prendre position sur Gorbatchev.** Annonce clairement ton avis, puis justifie-le par le cours, et nuance :

- *Ce qui va dans le sens du conférencier* : la perestroïka et la glasnost (1986), l’abandon de la doctrine de souveraineté limitée (1987), le non-recours à l’Armée rouge en 1989, le traité de Washington (1987) et START (1991).
- *La nuance indispensable* : Gorbatchev voulait **sauver** le communisme, pas le détruire. Et l’effondrement tient aussi à des causes profondes — échec économique, pénuries, réveil des nationalismes — qui le dépassent.

> **Astuce mémoire de Davy.** Une opinion sans connaissance du cours n’est pas une justification. Pour la consigne 3, la meilleure réponse **partage** le point de vue tout en le nuançant : « Je partage cet avis, car… Cependant, il faut préciser que… ».`,
      extraQuestions: [
        { prompt: "Selon le document 2, à quelle date la doctrine Truman est-elle définie devant le Congrès ?", options: ["Le 12 mars 1947", "Le 5 juin 1947", "Le 5 octobre 1947", "Le 12 mai 1949"], correctIndex: 0, explanation: "Le document distingue nettement cette date de celle du plan Marshall (5 juin 1947).", sourceLabel: "Document 2 — Pierre Thibaut", points: 2 },
        { prompt: "Quelle est la première riposte soviétique citée par le document 2 ?", options: ["La création du Kominform le 5 octobre 1947", "La construction du mur de Berlin", "Le Pacte de Varsovie", "La crise de Cuba"], correctIndex: 0, explanation: "Le bureau d’information communiste précède l’épreuve de force du blocus de Berlin.", sourceLabel: "Document 2 — Pierre Thibaut", points: 2 },
        { prompt: "À quelle « épreuve de force » du 24 juin 1948 au 12 mai 1949 le document fait-il allusion ?", options: ["Le blocus de Berlin", "La guerre de Corée", "La crise de Cuba", "La guerre du Viêtnam"], correctIndex: 0, explanation: "C’est la première crise de Berlin, contournée par le pont aérien américain.", sourceLabel: "Document 2 — Pierre Thibaut", points: 2 },
        { prompt: "Pour la consigne 3, quelle réponse est la mieux construite ?", options: ["Je partage cet avis car ses réformes ont libéré l’Est ; cependant l’effondrement a aussi des causes économiques profondes", "Je ne suis pas d’accord, sans donner d’argument", "Gorbatchev était un bon dirigeant, c’est mon opinion", "La question ne peut pas être tranchée"], correctIndex: 0, explanation: "Une position claire, justifiée par le cours, puis nuancée : c’est exactement la méthode attendue.", sourceLabel: "Méthode BAC — consigne 3", points: 2 },
      ],
      questions: [
        question("Quel est le problème historique posé ?", "L’évolution des relations entre les blocs américain et soviétique de 1947 à 1991", ["La naissance de l’Union africaine", "Le développement de la pêche ivoirienne", "La colonisation de l’Algérie au XIXe siècle"], "La situation porte sur les phases successives de la bipolarisation.", 1),
        question("Pourquoi la crise de Cuba est-elle un sommet de la guerre froide ?", "Elle place directement les deux superpuissances au bord d’un affrontement nucléaire", ["Elle provoque immédiatement la disparition de l’URSS", "Elle crée l’OTAN", "Elle met fin à toutes les rivalités"], "En octobre 1962, l’installation de missiles soviétiques à Cuba crée un risque nucléaire majeur.", 2),
        question("Quelle appréciation de la coexistence pacifique est juste ?", "Elle favorise le dialogue sans supprimer les rivalités ni les conflits indirects", ["Elle met définitivement fin à la guerre froide", "Elle supprime les deux blocs en 1956", "Elle interdit toute course aux armements"], "La détente modifie les formes de l’affrontement, sans effacer la compétition.", 0),
      ],
    },
  },
  "terminale-hg-h3-multipolar-world": {
    splitSectionIndex: 0,
    memorySentence: "Après 1991, l’hyperpuissance américaine domine d’abord, puis de nouveaux pôles rendent le monde plus multipolaire.",
    mission: {
      title: "Les États-Unis sont-ils encore l’unique hyperpuissance ?",
      scenario: "Un débat oppose ceux qui considèrent les États-Unis comme l’unique hyperpuissance depuis 1991 et ceux qui estiment que les attentats de 2001 et l’essor de nouveaux pôles ont changé l’ordre mondial.",
      modelAnswer: "Les États-Unis conservent une puissance majeure, mais la Chine, l’Union européenne, la Russie et d’autres acteurs limitent désormais leur capacité à organiser seuls le monde.",
      bodyMarkdown: String.raw`## La situation d’évaluation

> Tu assistes à un débat télévisé sur RTI 1 portant sur les attentats des tours jumelles du World Trade Center, perpétrés le 11 septembre 2001.
>
> L’un des débatteurs affirme : « **De 1991 à 2001, les États-Unis étaient la seule hyperpuissance mondiale. Avec ces attentats, les États-Unis voient leur hégémonie contestée et concurrencée, faisant du monde un monde multipolaire après 2001.** »

## Document 1 — L’hégémonie douce

*Jean Musitelli, « 1991-2001 : permanences et changements »,* Revue internationale et stratégique, *2001 :*

> « En 1991, on savait qui avait perdu la guerre froide, mais on ne savait pas encore qui l’avait gagnée. […] **La fin de la guerre froide n’a pas engendré le nouvel ordre mondial annoncé.** La décennie écoulée a consacré la suprématie d’un modèle unique. Des décombres de la guerre froide, les États-Unis émergent seuls vainqueurs. […] Cette expansion revêt les formes douces de l’hégémonie et non celles brutales de l’expédition. **La séduction des esprits remplace efficacement le contrôle des territoires.** […] Voici donc les États-Unis hissés en une décennie au rang d’**hyperpuissance**. »

## Document 2 — L’évolution des PIB cumulés (en milliards de dollars)

| Année | BRICS | États-Unis | Union européenne |
|---|---|---|---|
| 2000 | 2 736 | 10 285 | 9 365 |
| 2010 | 11 800 | 14 964 | 16 947 |
| 2017 | 18 640 | 19 360 | 17 110 |
| Prévision 2020 | **23 600** | 21 850 | 16 950 |

*Source : iveris.eu — « Bras de fer entre la coalition occidentale et les BRICS ».*

> **Ce que montre ce tableau.** En 2000, le PIB cumulé des BRICS ne représentait qu’un **quart** de celui des États-Unis. En 2020, il le **dépasse**. C’est l’argument chiffré le plus fort pour démontrer la multipolarité — pense à le citer.

## Comment construire ta réponse

**Consigne 1 — Identifier le problème.** Une phrase : « Il s’agit de… ». Ici, l’évolution de la place des États-Unis dans les relations internationales depuis 1991.

**Consigne 2 — Expliquer « la seule hyperpuissance mondiale ».** Ne te contente pas d’un domaine : montre que la domination est **simultanée sur cinq plans**.

| Plan | Preuve à citer |
|---|---|
| **Militaire** | budget du Pentagone, bases mondiales, commandement de l’OTAN |
| **Économique** | dollar, Wall Street, FMI et Banque mondiale, 239 des 500 premières multinationales |
| **Technologique** | technologies de pointe, NSA |
| **Culturel** | Hollywood, *american way of life* |
| **Politique** | siège permanent au Conseil de sécurité, suprématie diplomatique |

Ajoute la nuance de Musitelli : cette hégémonie est **douce**, elle repose sur la séduction plus que sur la conquête.

**Consigne 3 — Prendre position sur la multipolarité après 2001.** Annonce ton avis, justifie, nuance :

- *Ce qui appuie le débatteur* : le 11 septembre brise l’invulnérabilité américaine ; l’enlisement en Afghanistan et en Irak et les mensonges sur les armes de destruction massive fragilisent leur crédibilité ; les BRICS dépassent le PIB américain vers 2020 ; l’UE, la Chine, la Russie et les puissances du Moyen-Orient s’affirment.
- *La nuance indispensable* : **multipolaire ne signifie pas que les États-Unis ont disparu**. Ils restent la première puissance militaire, le dollar domine toujours, et la défense européenne dépend encore de l’OTAN. Les pôles sont **inégaux**.

> **Astuce mémoire de Davy.** La meilleure réponse à la consigne 3 est presque toujours **« oui, mais »** : je partage l’avis, car les faits le montrent ; **cependant**, la puissance américaine est relativisée, pas anéantie. Un avis tranché sans nuance perd des points.`,
      extraQuestions: [
        { prompt: "Selon le document de Jean Musitelli, quelle forme prend l’expansion du modèle américain ?", options: ["Les formes douces de l’hégémonie, par la séduction des esprits", "La conquête militaire de territoires", "Un repli isolationniste", "Une alliance avec les BRICS"], correctIndex: 0, explanation: "« La séduction des esprits remplace efficacement le contrôle des territoires. »", sourceLabel: "Document 2 — Jean Musitelli", points: 2 },
        { prompt: "D’après le tableau des PIB cumulés, que se passe-t-il vers 2020 ?", options: ["Le PIB cumulé des BRICS dépasse celui des États-Unis", "Les États-Unis doublent leur avance", "L’UE devient la première économie mondiale", "Les BRICS s’effondrent"], correctIndex: 0, explanation: "23 600 milliards contre 21 850 : c’est l’argument chiffré de la multipolarité.", sourceLabel: "Document 1 — évolution des PIB", points: 2 },
        { prompt: "En 2000, le PIB cumulé des BRICS représentait environ quelle part de celui des États-Unis ?", options: ["Un quart", "La moitié", "Le double", "Autant"], correctIndex: 0, explanation: "2 736 milliards contre 10 285 : le rattrapage sera spectaculaire en vingt ans.", sourceLabel: "Document 1 — évolution des PIB", points: 2 },
        { prompt: "Pour la consigne 3, quelle réponse est la mieux construite ?", options: ["Je partage cet avis car les BRICS et l’UE s’affirment ; cependant les États-Unis restent la première puissance militaire", "Je ne suis pas d’accord, sans donner d’argument", "Les États-Unis ont totalement disparu de la scène mondiale", "La question ne peut pas être tranchée"], correctIndex: 0, explanation: "Position claire, justifiée par le cours, puis nuancée : c’est la méthode attendue.", sourceLabel: "Méthode BAC — consigne 3", points: 2 },
      ],
      questions: [
        question("Quel problème est posé ?", "Le passage d’un monde dominé par les États-Unis à un ordre plus multipolaire", ["La disparition de toute puissance mondiale", "La création de la CEDEAO", "Le relief ivoirien"], "Le sujet interroge l’évolution du rapport de forces mondial depuis 1991.", 1),
        question("Pourquoi parle-t-on d’hyperpuissance américaine dans les années 1990 ?", "Les États-Unis cumulent des capacités économiques, militaires, politiques et culturelles exceptionnelles", ["Ils sont le seul pays membre de l’ONU", "Ils n’ont aucune présence extérieure", "Ils renoncent à toute technologie"], "L’hyperpuissance désigne la combinaison de plusieurs formes de domination.", 2),
        question("Quelle position correspond au monde actuel étudié ?", "Les États-Unis restent puissants, mais doivent compter avec plusieurs pôles et acteurs", ["Les États-Unis ont perdu toute influence", "Un seul État contrôle totalement la planète", "La multipolarité signifie l’absence de rivalités"], "La multipolarité ne supprime pas la puissance américaine ; elle la relativise.", 0),
      ],
    },
  },
  "terminale-hg-h4-african-nationalism": {
    splitSectionIndex: 1,
    memorySentence: "Les nationalismes africains naissent de facteurs internes et externes, s’expriment par diverses formes de lutte et conduisent aux indépendances.",
    mission: {
      title: "Pourquoi la colonisation portait-elle les germes de sa destruction ?",
      scenario: "Un auteur affirme que la colonisation a elle-même favorisé les conditions de la décolonisation, tandis que des élèves discutent du rôle des mouvements nationalistes et des facteurs extérieurs.",
      modelAnswer: "Les injustices coloniales éveillent les revendications ; l’école, les élites, les syndicats et partis structurent la lutte, renforcée par les guerres mondiales, l’ONU et l’anticolonialisme.",
      bodyMarkdown: String.raw`## La situation d’évaluation

> Au cours d’une lecture, tu découvres dans un ouvrage sur la décolonisation le passage suivant :
>
> « **La colonisation porte en son sein les germes de sa propre destruction. Au plan interne, les partis de masse ont accéléré la décolonisation de l’Afrique.** »

## Document 1 — Les « hommes nouveaux » révélés par la guerre

*S. Berstein et P. Milza,* Histoire du XXᵉ siècle, *1993 :*

> « Les vicissitudes de la guerre ont fait perdre à l’Europe le **capital de crainte** que sa force avait amassé auprès des peuples coloniaux. […] L’intégration de l’Afrique noire dans l’économie de guerre européenne se solde par d’importantes mutations économiques et sociales. […] Partout des **élites nouvelles** se constituent. […] Aussi la guerre révèle-t-elle des “hommes nouveaux” : **Nkrumah** en Côte-de-l’Or, **Senghor** au Sénégal, **Houphouët-Boigny** en Côte d’Ivoire. »

## Document 2 — La position américaine

*John Foster Dulles, secrétaire d’État américain, Cleveland, 16 novembre 1953 :*

> « Nous n’avons pas oublié que nous fûmes la **première colonie à arracher l’indépendance**. Et nous n’avons donné de chèque en blanc à aucune puissance coloniale. […] La transition normale du statut colonial à l’autonomie doit être menée à une complète réalisation. » *(Il précise toutefois craindre que « le communisme international ne détourne le nationalisme à ses propres fins ».)*

## Comment construire ta réponse

**Consigne 1 — Identifier le problème.** « Il s’agit de… » : les causes et les acteurs de la décolonisation de l’Afrique.

**Consigne 2 — Expliquer « la colonisation porte les germes de sa propre destruction ».** Montre que le système colonial a **lui-même** créé ses fossoyeurs :

| Ce que la colonisation a produit | L’effet retourné contre elle |
|---|---|
| des **écoles** et des **élites** instruites | elles réclament liberté et égalité |
| des **cultures d’exportation** | une bourgeoisie locale, moteur nationaliste |
| des **injustices** (travail forcé, impôts, discriminations) | l’unité dans la révolte |
| l’**enrôlement** dans les deux guerres | la démystification de l’homme blanc |

**Consigne 3 — Prendre position sur le rôle des partis de masse.** Annonce ton avis, justifie, nuance :

- *Ce qui appuie l’affirmation* : le PDCI-RDA, le CPP, le FLN mobilisent les foules par meetings, grèves, boycotts et négociations, et arrachent les réformes de 1946, la Loi-Cadre de 1956, puis les indépendances.
- *La nuance indispensable* : les partis de masse **ne sont pas seuls**. Les facteurs **externes** (affaiblissement de l’Europe, anticolonialisme des deux Grands, ONU, Bandung) et les autres formes de lutte (syndicats, mouvements religieux et culturels) ont aussi joué.

> **Astuce mémoire de Davy.** Pour la consigne 3, le meilleur réflexe est **« oui, mais pas seuls »** : les partis de masse ont bien accéléré la décolonisation, **cependant** ils s’inscrivent dans un faisceau de facteurs internes et externes. Un avis nuancé et documenté rapporte tous les points.`,
      extraQuestions: [
        { prompt: "Selon Berstein et Milza, qu’a fait perdre la guerre à l’Europe auprès des peuples coloniaux ?", options: ["Le « capital de crainte » que sa force avait amassé", "Ses colonies d’Asie uniquement", "Son avance technologique définitive", "Sa langue"], correctIndex: 0, explanation: "La démystification de la puissance européenne nourrit le nationalisme.", sourceLabel: "Document 1 — Berstein et Milza", points: 2 },
        { prompt: "Quels « hommes nouveaux » le document 1 cite-t-il ?", options: ["Nkrumah, Senghor et Houphouët-Boigny", "Truman, Staline et Churchill", "Harris, Kimbangu et Césaire", "Dulles, Clinton et Bush"], correctIndex: 0, explanation: "Trois grandes figures révélées par la période de guerre.", sourceLabel: "Document 1 — Berstein et Milza", points: 2 },
        { prompt: "Dans le document 2, quel argument Dulles avance-t-il en faveur de la décolonisation ?", options: ["Les États-Unis furent la première colonie à arracher l’indépendance", "L’Europe doit garder ses colonies", "Le communisme doit diriger l’Afrique", "La colonisation doit être éternelle"], correctIndex: 0, explanation: "Il invoque le passé colonial américain, tout en craignant le communisme.", sourceLabel: "Document 2 — John Foster Dulles", points: 2 },
        { prompt: "Pour la consigne 3, quelle réponse est la mieux construite ?", options: ["Oui, les partis de masse ont accéléré la décolonisation ; cependant les facteurs externes et les autres formes de lutte ont aussi joué", "Non, sans aucun argument", "Les partis n’ont eu aucun rôle", "La question ne peut pas être tranchée"], correctIndex: 0, explanation: "Position claire, justifiée, puis nuancée : c’est la méthode attendue.", sourceLabel: "Méthode BAC — consigne 3", points: 2 },
      ],
      questions: [
        question("Quel thème historique est abordé ?", "Les causes et les formes de la montée des nationalismes africains", ["La croissance sud-coréenne", "Les accords UE-ACP", "La crise de Cuba"], "La situation cherche à expliquer le réveil nationaliste et la décolonisation.", 1),
        question("Comment la colonisation favorise-t-elle paradoxalement le nationalisme ?", "Les discriminations et l’exploitation suscitent des revendications organisées", ["Elle accorde immédiatement toutes les indépendances", "Elle supprime toute élite instruite", "Elle interdit toute conscience collective"], "Les injustices du système colonial deviennent une cause majeure de contestation.", 2),
        question("Quelle réponse rend compte de la diversité des luttes ?", "Partis, syndicats, presse, négociations et parfois lutte armée sont utilisés selon les territoires", ["Une méthode unique est utilisée partout", "Les peuples ne participent jamais", "Seuls les facteurs extérieurs expliquent les indépendances"], "Les mouvements nationalistes adoptent des moyens variés selon le contexte colonial.", 0),
      ],
    },
  },
  "terminale-hg-h5-cote-ivoire-independence": {
    splitSectionIndex: 2,
    memorySentence: "L’indépendance ivoirienne résulte de trois phases : espoir, lutte puis collaboration et transfert progressif du pouvoir.",
    mission: {
      title: "Une indépendance obtenue sans résistance ?",
      scenario: "Deux personnes discutent de l’accession de la Côte d’Ivoire à l’indépendance : l’une évoque la résistance, l’autre affirme que le transfert du pouvoir s’est fait sans lutte grâce à l’action de l’élite nationale.",
      modelAnswer: "L’indépendance finale est négociée, mais elle est précédée de mobilisations, de répression et de luttes politiques. L’action du PDCI-RDA et d’Houphouët-Boigny est donc essentielle dans plusieurs phases.",
      bodyMarkdown: String.raw`## La situation d’évaluation

> Lors de la retransmission des festivités de l’indépendance à la télévision, tu entends un **journaliste** dire : « l’accession à l’indépendance de la Côte d’Ivoire a certes connu des résistances, mais elle a été le **point de départ de plusieurs réformes** ».
>
> Ton **ami** n’est pas d’accord : « notre pays s’est libéré du joug colonial à la suite d’une **lutte farouche de l’élite nationale** ».

## Document 1 — L’esprit de Brazzaville

*J. Ki-Zerbo,* Histoire de l’Afrique Noire d’hier à demain, *Hatier, 1978 :*

> « La conférence recommande une large représentation des indigènes […], la suppression du travail forcé, le développement de l’instruction […]. Certes la préscience des lendemains ne va pas jusqu’à envisager […] la constitution de **self-government**. La notion d’**Empire reste préférée**… Dès son retour à Abidjan, le gouverneur **Latrille** va s’attacher honnêtement à travailler dans l’esprit de Brazzaville. Les résistances […] lui vaudront d’être considéré par les colons comme l’**ennemi n°1**. »

## Document 2 — Houphouët et la « balkanisation »

*H. Deschamps,* Histoire de l’Afrique Noire, *PUF, 1975 :*

> « En janvier 1950, en basse Côte d’Ivoire, des troubles se déclenchèrent, qui furent **réprimés dans le sang**. […] Houphouët sentit que l’alliance communiste lui faisait perdre […] ses moyens d’action. […] Houphouët avait abandonné les communistes et fait alliance avec […] **Mitterrand** […]. Son influence sur la “loi-cadre” fut sans doute déterminante dans le sens de la “**balkanisation**”. »

## Comment construire ta réponse

**Consigne 1 — Le problème.** Il s’agit des **formes de lutte** et des **étapes** de l’accession de la Côte d’Ivoire à l’indépendance (1944-1960).

**Consigne 2 — Expliquer le journaliste.** Il a raison : l’indépendance fut le **point de départ de réformes** — Brazzaville (1944), suppression du travail forcé (1946), Loi-Cadre (1956), Communauté (1958) — mais elle « connut des résistances » (répression de 1949-1950, 52 morts).

**Consigne 3 — Partages-tu l’avis de l’ami ?** Réponse **nuancée** :

| Ce que l’ami a raison de dire | Ce qu’il oublie |
|---|---|
| L’élite (FHB, PDCI-RDA) a bien mené une lutte réelle | La lutte ne fut pas seulement « farouche » : elle fut **surtout politique et négociée** |
| Il y eut des morts et de la répression | L’indépendance vint aussi de **réformes** et d’un **contexte international** favorable |

> **Astuce mémoire de Davy.** Face à l’ami, le bon réflexe est **« oui, mais »** : oui, l’élite nationale a lutté ; **mais** l’indépendance ivoirienne fut globalement **pacifique et négociée** (désapparentement, Loi-Cadre, référendum de 1958), pas seulement une lutte armée. Ni tout-négociation, ni tout-résistance : les deux.`,
      extraQuestions: [
        { prompt: "Selon Ki-Zerbo (doc. 1), la Conférence de Brazzaville envisageait-elle le self-government ?", options: ["Non : « la notion d’Empire reste préférée »", "Oui, dès 1944", "Oui, mais seulement pour la Côte d’Ivoire", "Le texte ne le dit pas"], correctIndex: 0, explanation: "Brazzaville réforme sans envisager l’indépendance.", sourceLabel: "Document 1 — Ki-Zerbo", points: 2 },
        { prompt: "Comment les colons considèrent-ils le gouverneur Latrille (doc. 1) ?", options: ["Comme leur « ennemi n°1 »", "Comme un allié fidèle", "Comme un gouverneur absent", "Comme un communiste inoffensif"], correctIndex: 0, explanation: "Il applique honnêtement l’esprit de Brazzaville, au grand dam des colons.", sourceLabel: "Document 1 — Ki-Zerbo", points: 1 },
        { prompt: "Que désigne la « balkanisation » évoquée par Deschamps (doc. 2) ?", options: ["Le morcellement de l’Afrique en États séparés plutôt qu’en fédérations", "L’union de toutes les colonies en un seul État", "La guerre dans les Balkans", "Le retour au travail forcé"], correctIndex: 0, explanation: "Houphouët, territorialiste, refusait le leadership de Dakar.", sourceLabel: "Document 2 — Deschamps", points: 2 },
        { prompt: "Pour la consigne 3, quelle position est la mieux argumentée ?", options: ["Oui en partie : l’élite a lutté, mais l’indépendance fut surtout politique et négociée", "Non, l’élite n’a joué aucun rôle", "Oui, ce fut uniquement une lutte armée", "La question ne peut être tranchée"], correctIndex: 0, explanation: "Un avis nuancé, appuyé sur les deux documents, est attendu.", sourceLabel: "Méthode BAC — consigne 3", points: 2 },
      ],
      questions: [
        question("Quel problème est posé ?", "Les formes de lutte et les étapes de l’accession de la Côte d’Ivoire à l’indépendance", ["Le bilan de l’Union africaine", "L’économie de la Corée du Sud", "La formation de l’OTAN"], "La discussion oppose une lecture uniquement pacifique à une histoire faite de plusieurs phases.", 1),
        question("Pourquoi peut-on parler d’une lutte avant la collaboration ?", "Le mouvement nationaliste connaît mobilisations, répression et rupture avec l’administration coloniale", ["L’indépendance est offerte dès 1944", "Aucun parti politique n’existe", "La population reste totalement absente"], "La phase de lutte de 1947 à 1950 précède le rapprochement politique.", 2),
        question("Quel jugement est le plus juste ?", "L’indépendance combine résistance politique, négociation et action déterminante des élites nationales", ["Elle ne résulte d’aucune action ivoirienne", "Elle est uniquement militaire", "Elle est accordée en une seule étape"], "La chronologie montre une évolution des stratégies jusqu’au 7 août 1960.", 0),
      ],
    },
  },
  "terminale-hg-h6-algeria-independence": {
    splitSectionIndex: 2,
    memorySentence: "L’indépendance algérienne naît du rejet du système colonial, d’une guerre longue puis d’une négociation conclue par les accords d’Évian.",
    mission: {
      title: "Le rôle de De Gaulle dans l’indépendance algérienne",
      scenario: "Une élève affirme que l’action du général de Gaulle a été déterminante dans l’accession de l’Algérie à l’indépendance, après plusieurs années de guerre.",
      modelAnswer: "De Gaulle ne déclenche pas la lutte, menée par le FLN, mais il fait évoluer la position française vers l’autodétermination et les négociations qui aboutissent aux accords d’Évian.",
      bodyMarkdown: String.raw`## La situation d’évaluation

> Une élève révise la leçon sur l’Algérie. Son grand-frère, étudiant en histoire, lui dit : « Cette leçon est l’exemple type de la véritable accession à l’indépendance : des mouvements nationalistes courageux ont **arraché** l’indépendance de leur pays. » L’élève réplique : « Bien vrai, mais les Algériens ont eu **besoin de l’aide du général de Gaulle** pour y parvenir. » Le grand-frère conclut : « **En réalité, le général de Gaulle a été contraint par la détermination du peuple algérien.** »

## Document 1 — Le Manifeste du peuple algérien (1943)

*Ferhat Abbas, extrait du* Manifeste du peuple algérien, *10 février 1943 :*

> « Il suffit d’examiner le processus de la colonisation en Algérie pour se rendre compte comment la politique d’“**assimilation**”, appliquée automatiquement aux uns et refusée aux autres, a réduit la société musulmane à la **servitude la plus complète** […]. Le peuple algérien demande […] la condamnation de la colonisation, le **droit des peuples à disposer d’eux-mêmes**, une constitution garantissant l’**égalité absolue** de tous ses habitants, la reconnaissance de la **langue arabe**, la liberté de la presse et l’instruction pour tous. »

## Document 2 — De Gaulle et l’issue de la guerre

*Rappel du cours :*

> Revenu au pouvoir le 1ᵉʳ juin 1958, De Gaulle renonce à l’Algérie française (« Je vous ai compris », 4 juin 1958), propose l’**autodétermination**, affronte l’**OAS**, puis négocie avec le FLN les **accords d’Évian** (18 mars 1962). L’indépendance est proclamée le **3 juillet 1962**.

## Comment construire ta réponse

**Consigne 1 — Le problème.** Il s’agit du **rôle respectif** de la lutte nationaliste algérienne (FLN) et de l’action du **général de Gaulle** dans l’accession de l’Algérie à l’indépendance.

**Consigne 2 — Expliquer « De Gaulle a été contraint par la détermination du peuple algérien ».** Montre que l’initiative vient des **Algériens** : le FLN déclenche et mène la guerre (Toussaint rouge, maquis, GPRA), rend l’Algérie française **ingouvernable** et **intenable** internationalement. De Gaulle **subit** ce rapport de force : c’est parce que la lutte est victorieuse qu’il évolue vers l’indépendance.

**Consigne 3 — Apprécier le rôle de De Gaulle.** Réponse **nuancée** :

| Ce que De Gaulle a fait | Ce qui le relativise |
|---|---|
| Il fait **basculer** la position française vers l’autodétermination | Il **ne déclenche pas** la lutte : c’est le FLN |
| Il **négocie et signe** les accords d’Évian | Il agit **sous la contrainte** de huit ans de guerre |
| Il affronte l’OAS et impose l’indépendance à l’opinion | L’indépendance était déjà **inéluctable** |

> **Astuce mémoire de Davy.** Le bon réflexe pour la consigne 3, c’est **« oui, mais » (dans ce sens précis)** : oui, De Gaulle a joué un rôle **décisif dans le dénouement** (Évian) ; **mais** ce sont bien les nationalistes algériens qui ont **arraché** l’indépendance — De Gaulle a accompagné l’inévitable, il ne l’a pas offert.`,
      extraQuestions: [
        { prompt: "Selon Ferhat Abbas (doc. 1), qu’a produit la politique d’« assimilation » appliquée aux uns et refusée aux autres ?", options: ["Elle a réduit la société musulmane à la servitude la plus complète", "Elle a donné l’égalité à tous", "Elle a supprimé la colonisation", "Elle a enrichi les musulmans"], correctIndex: 0, explanation: "Le Manifeste dénonce une assimilation à sens unique.", sourceLabel: "Document 1 — Ferhat Abbas", points: 2 },
        { prompt: "Quel principe international le Manifeste de 1943 invoque-t-il ?", options: ["Le droit des peuples à disposer d’eux-mêmes", "Le libre-échange", "La doctrine Monroe", "L’équilibre européen"], correctIndex: 0, explanation: "Il s’appuie notamment sur la déclaration de Roosevelt.", sourceLabel: "Document 1 — Ferhat Abbas", points: 1 },
        { prompt: "Pour la consigne 2, quelle explication est la plus juste ?", options: ["De Gaulle subit le rapport de force créé par la lutte du FLN, qui rend l’Algérie française intenable", "De Gaulle agit librement, sans aucune pression", "Les Algériens n’ont joué aucun rôle", "L’ONU impose seule l’indépendance"], correctIndex: 0, explanation: "La détermination du peuple algérien contraint la France à négocier.", sourceLabel: "Méthode BAC — consigne 2", points: 2 },
        { prompt: "Pour la consigne 3, quelle appréciation est la mieux équilibrée ?", options: ["De Gaulle a un rôle décisif dans le dénouement (Évian), mais l’indépendance a été arrachée par les nationalistes", "De Gaulle est l’unique auteur de l’indépendance", "De Gaulle n’a joué strictement aucun rôle", "De Gaulle a proclamé l’indépendance avant la guerre"], correctIndex: 0, explanation: "Un avis nuancé, appuyé sur la lutte algérienne et l’action française.", sourceLabel: "Méthode BAC — consigne 3", points: 2 },
      ],
      questions: [
        question("Quel problème historique est posé ?", "Le processus et les acteurs de l’indépendance algérienne", ["La création de l’ONU", "Le secteur tertiaire ivoirien", "Les valeurs occidentales"], "La situation interroge la place respective de la lutte nationaliste et de la décision politique française.", 1),
        question("Pourquoi le système colonial nourrit-il la révolte ?", "Les inégalités politiques, économiques et sociales marginalisent la majorité musulmane", ["Il garantit une égalité complète dès 1830", "Il donne immédiatement l’autodétermination", "Il supprime toute présence européenne"], "Les discriminations et l’échec des réformes alimentent le nationalisme algérien.", 2),
        question("Quelle appréciation du rôle de De Gaulle est équilibrée ?", "Il rend possible la négociation finale, mais après une lutte décisive du peuple algérien et du FLN", ["Il est l’unique acteur de l’indépendance", "Il n’a aucun rôle dans les négociations", "Il proclame l’indépendance avant la guerre"], "La réponse doit articuler la lutte algérienne, l’évolution française et les accords d’Évian.", 0),
      ],
    },
  },
  "terminale-hg-h7-african-union": {
    splitSectionIndex: 2,
    memorySentence: "L’Union africaine prolonge le panafricanisme par des institutions communes, mais son bilan dépend de sa capacité à surmonter des difficultés internes et externes.",
    mission: {
      title: "L’Union africaine face à ses défis",
      scenario: "Des élèves discutent des crises africaines : certains jugent l’Union africaine inefficace, d’autres rappellent qu’elle est jeune et doit encore relever de nombreux défis.",
      modelAnswer: "L’UA obtient des résultats en médiation, observation électorale et coopération, mais manque parfois de moyens, d’autonomie financière et d’unité politique.",
      bodyMarkdown: String.raw`## La situation d’évaluation

> Après la mort du président tchadien **Idriss Déby Itno**, un débat télévisé porte sur le bilan de l’UA. Un invité affirme : « **Les difficultés de l’UA sont d’origines endogènes et exogènes.** » Les autres en conviennent, mais **imputent la plus grande responsabilité aux dirigeants africains.**

## Document 1 — L’enjeu de l’autonomie financière

*RFI, 2018 — la réforme de Paul Kagame, président en exercice de l’UA :*

> « Parmi les propositions, le prélèvement d’une **taxe sur les importations** de chaque pays, afin de financer le budget de l’organisation. […] “On ne peut pas vouloir **financer des idées africaines avec un fonds qui ne vient pas de l’Afrique**”. »

## Document 2 — « Nous n’agissons pas assez »

*Étienne Aboua,* Fraternité Matin, *1ᵉʳ février 2016 (propos rapportés d’Idriss Déby) :*

> « Notre organisation fonctionne toujours comme il y a 20 ou 30 ans. Nous nous réunissons souvent. Nous parlons toujours trop. […] Mais **nous n’agissons pas assez**. Nous **attendons tout de l’extérieur**. Cela doit impérativement changer si nous voulons faire changer le cours de l’histoire de l’Afrique. »

## Comment construire ta réponse

**Consigne 1 — Le problème.** Il s’agit d’**apprécier les difficultés de l’UA** et la **responsabilité** respective des dirigeants africains et des facteurs extérieurs.

**Consigne 2 — Expliquer « difficultés endogènes et exogènes ».**

| Endogènes (internes) | Exogènes (externes) |
|---|---|
| instabilité politique, coups d’État, crises post-électorales | **dépendance financière** (95 % du budget vient de l’extérieur) |
| **souveraineté** brandie contre les décisions de l’UA | influences des blocs (francophone, anglophone, arabophone) |
| retards de cotisation, corruption, mauvaise gouvernance | siège et projets financés par des partenaires (Chine) |

**Consigne 3 — La responsabilité incombe-t-elle surtout aux dirigeants ?** Réponse **nuancée** :

- *Ce qui appuie l’affirmation* : les blocages majeurs (instabilité, non-respect des décisions, cotisations impayées, réunions sans actes) viennent bien des **dirigeants**.
- *La nuance* : la **dépendance financière** et les influences extérieures **contraignent** aussi l’UA — d’où l’enjeu de l’autonomie proposé par Kagame.

> **Astuce mémoire de Davy.** Le bon réflexe : **« oui, surtout — mais pas seulement »**. Oui, la responsabilité première revient aux dirigeants africains (endogène) ; **mais** la dépendance envers l’extérieur (exogène) pèse aussi. Cite les **deux chiffres-chocs** : **95 %** du budget venu de l’extérieur, **12 %** d’échanges intra-africains.`,
      extraQuestions: [
        { prompt: "Que signifie « les difficultés de l’UA sont d’origines endogènes et exogènes » ?", options: ["Elles viennent à la fois des États africains (internes) et de contraintes extérieures", "Elles sont uniquement climatiques", "Elles ont toutes disparu", "Elles ne concernent que la langue"], correctIndex: 0, explanation: "Endogène = interne ; exogène = externe.", sourceLabel: "Situation d’évaluation 2, consigne 2", points: 2 },
        { prompt: "Selon Kagame (doc. 1), comment financer le budget de l’UA de façon autonome ?", options: ["Par une taxe sur les importations de chaque pays", "En vendant le siège", "En supprimant les cotisations", "En empruntant à la Chine"], correctIndex: 0, explanation: "« On ne peut pas financer des idées africaines avec un fonds qui ne vient pas d’Afrique. »", sourceLabel: "Document 1 — RFI", points: 2 },
        { prompt: "Que reproche Idriss Déby à l’UA (doc. 2) ?", options: ["De trop se réunir et de ne pas assez agir, en attendant tout de l’extérieur", "D’agir trop vite", "De refuser toute réunion", "D’être trop indépendante"], correctIndex: 0, explanation: "Il appelle à passer des paroles aux actes.", sourceLabel: "Document 2 — Fraternité Matin", points: 2 },
        { prompt: "Pour la consigne 3, quelle position est la mieux argumentée ?", options: ["La responsabilité première est aux dirigeants, mais la dépendance extérieure pèse aussi", "Les dirigeants n’ont aucune responsabilité", "Tout est la faute de l’extérieur uniquement", "L’UA n’a aucune difficulté"], correctIndex: 0, explanation: "Un avis nuancé qui reconnaît les acquis et propose des améliorations.", sourceLabel: "Méthode BAC — consigne 3", points: 2 },
      ],
      questions: [
        question("Quel est le problème central ?", "L’efficacité, les difficultés et l’avenir de l’Union africaine", ["La disparition du panafricanisme", "La croissance démographique coréenne", "Le commerce UE-ACP uniquement"], "La situation invite à évaluer l’organisation et non à la déclarer simplement utile ou inutile.", 1),
        question("Que signifie l’expression « difficultés endogènes et exogènes » ?", "Elles viennent à la fois des États africains et de contraintes ou influences extérieures", ["Elles sont uniquement climatiques", "Elles concernent seulement la langue", "Elles ont toutes disparu"], "Endogène signifie interne ; exogène signifie externe.", 2),
        question("Quelle position est la plus argumentée ?", "L’UA reste nécessaire, mais doit renforcer ses moyens, son unité et l’application de ses décisions", ["L’UA n’a aucun défi", "Il faut supprimer toute coopération africaine", "Les dirigeants n’ont aucune responsabilité"], "Une bonne appréciation reconnaît les acquis tout en proposant des améliorations.", 0),
      ],
    },
  },
  "terminale-hg-h8-western-values": {
    splitSectionIndex: 1,
    memorySentence: "Le monde occidental associe démocratie libérale, capitalisme et libertés individuelles, tout en connaissant contradictions et limites.",
    mission: {
      title: "La démocratie libérale est-elle un modèle parfait ?",
      scenario: "Deux élèves débattent : l’un présente la démocratie libérale occidentale comme un modèle de perfection ; l’autre insiste sur ses limites et ses contradictions.",
      modelAnswer: "La démocratie libérale protège des libertés, la représentation et la séparation des pouvoirs. Elle reste imparfaite face aux inégalités, aux crises de représentation et aux tensions sociales.",
      bodyMarkdown: String.raw`## La situation d’évaluation

> Après le cours, un reportage sur la civilisation occidentale déclenche un débat. **William Koffi** estime que « **la démocratie libérale est un modèle de perfection** ». **Christelle Aké** réplique : « **la démocratie libérale a des limites** ».

## Document 1 — Les principes de la démocratie libérale

*G. Bourel,* Histoire Terminales, *Belin, 1998 :*

> « Les démocraties libérales […] reposent sur un principe de **représentation** : le pouvoir législatif […] est détenu par un **parlement**, souvent bicaméral. […] La démocratie libérale repose sur les principes de la représentation […] et celui de la **liberté**, garantie par la **séparation des pouvoirs** […]. Le parlement a pour principale fonction le **vote des lois** […] et surtout le **budget de l’État**. […] Pour assurer un minimum de stabilité, le régime libéral peut **limiter** les prérogatives du parlement (dissolution, vote bloqué, décrets-lois). »

## Document 2 — Une manifestation dans « un vieux pays occidental »

*Rappel de la situation « Gilets jaunes » (France, 2019) :*

> Des amis, affligés par les violences entre manifestants et forces de l’ordre, réagissent : « Des violences effroyables ! Dans un vieux pays occidental ! » — « les pratiques liées à la **liberté d’expression** sont devenues insoutenables dans le cœur même du monde occidental. »

## Comment construire ta réponse

**Consigne 1 — Le problème.** Il s’agit d’apprécier les **qualités et les limites** de la démocratie libérale : est-elle un modèle **parfait** ?

**Consigne 2 — Expliquer « un modèle de perfection ».** Montre pourquoi elle peut servir de modèle : elle garantit les **libertés** (pensée, presse, réunion), le **pluralisme** des partis, la **représentation** (suffrage universel, parlement), la **séparation des pouvoirs** et l’**État de droit** — autant de garde-fous contre l’arbitraire.

**Consigne 3 — Partages-tu l’avis de Christelle (« elle a des limites ») ?** Réponse **nuancée** :

| Ses acquis réels | Ses limites |
|---|---|
| libertés, représentation, séparation des pouvoirs | **exclusion** des pauvres et des immigrés |
| alternance et contrôle de l’exécutif | **lobbying**, alternance parfois factice |
| État de droit garanti par la Constitution | **dérives** des libertés, violences (Gilets jaunes), montée des **extrémismes** |

> **Astuce mémoire de Davy.** Le bon réflexe : **« oui, mais »**. Oui, la démocratie libérale a de **vrais acquis** (elle n’est pas un modèle *de perfection* pour rien) ; **mais** non, elle n’est pas **parfaite** — Christelle a raison. Un modèle **précieux et perfectible**, pas un modèle idéal.`,
      extraQuestions: [
        { prompt: "Selon le document 1, sur quels principes repose la démocratie libérale ?", options: ["La représentation et la liberté garantie par la séparation des pouvoirs", "La concentration de tous les pouvoirs", "Le parti unique", "L’absence de parlement"], correctIndex: 0, explanation: "Le parlement, cœur du régime, vote les lois et le budget.", sourceLabel: "Document 1 — Bourel", points: 2 },
        { prompt: "D’après le document 1, comment le régime libéral assure-t-il sa stabilité ?", options: ["En pouvant limiter le parlement (dissolution, vote bloqué, décrets-lois)", "En supprimant les élections", "En interdisant les partis", "En abolissant la Constitution"], correctIndex: 0, explanation: "Ces outils montrent que le modèle n’est pas sans tensions internes.", sourceLabel: "Document 1 — Bourel", points: 2 },
        { prompt: "Que révèle l’épisode des « Gilets jaunes » (doc. 2) sur la démocratie libérale ?", options: ["Qu’elle connaît aussi des tensions et des dérives, même dans un vieux pays occidental", "Qu’elle est parfaite", "Qu’elle a disparu", "Qu’elle interdit toute manifestation"], correctIndex: 0, explanation: "Un exemple des limites du modèle dans son propre « cœur ».", sourceLabel: "Document 2 — Gilets jaunes", points: 2 },
        { prompt: "Pour la consigne 3, quelle position est la mieux argumentée ?", options: ["La démocratie libérale a de vrais acquis, mais elle n’est pas parfaite : Christelle a raison", "Elle est un modèle de perfection sans défaut", "Elle n’a aucun acquis", "La question ne peut être tranchée"], correctIndex: 0, explanation: "Un avis nuancé : un modèle précieux mais perfectible.", sourceLabel: "Méthode BAC — consigne 3", points: 2 },
      ],
      questions: [
        question("Quel problème est posé ?", "Les principes, les qualités et les limites de la démocratie libérale", ["La fin de la guerre froide", "Le développement agricole ivoirien", "La création de l’Union africaine"], "Le débat oppose idéal démocratique et fonctionnement réel.", 1),
        question("Pourquoi la démocratie libérale peut-elle servir de modèle ?", "Elle garantit pluralisme, libertés, représentation et séparation des pouvoirs", ["Elle interdit toute opposition", "Elle concentre tous les pouvoirs", "Elle supprime les élections"], "Ces principes limitent l’arbitraire et organisent la souveraineté populaire.", 2),
        question("Quelle critique est recevable ?", "Les principes démocratiques peuvent coexister avec inégalités, abstention et tensions sociales", ["La démocratie ne garantit aucune liberté", "Toutes les démocraties sont identiques", "La séparation des pouvoirs empêche toute loi"], "Reconnaître des limites ne revient pas à nier tous les acquis.", 0),
      ],
    },
  },
  "terminale-hg-h9-negro-african-civilization-mutations": {
    splitSectionIndex: 2,
    memorySentence: "Les sociétés négro-africaines se transforment par les contacts et la modernité tout en conservant et recomposant des valeurs ancestrales.",
    mission: {
      title: "Modernité occidentale ou permanence africaine ?",
      scenario: "Des élèves opposent les apports occidentaux, jugés favorables à la modernisation, au maintien des valeurs ancestrales nécessaire à un développement culturel endogène.",
      modelAnswer: "École, techniques, institutions et économie moderne transforment les sociétés africaines, mais les solidarités, croyances, arts et traditions sont souvent adaptés plutôt que totalement abandonnés.",
      bodyMarkdown: String.raw`## La situation d’évaluation

> Pendant la récréation, des amis débattent des mutations de la civilisation négro-africaine. Pour les uns, « la **civilisation occidentale a des apports qui enrichissent** les sociétés négro-africaines en vue de leur **insertion dans le monde moderne** ». Pour les autres, « les sociétés négro-africaines **maintiennent beaucoup de valeurs ancestrales** afin d’accéder à un **développement socioculturel endogène** ».

## Document 1 — Une démocratie réelle malgré l’absolutisme

*J. Ki-Zerbo,* Histoire de l’Afrique d’hier à demain, *Hatier, 1972 :*

> « La société africaine d’hier était une société **solidaire** […] qui avait atteint un certain **humanisme** […]. Bien sûr, tout n’était pas rose […] : il y a eu des cas de **tyrannies** […]. La division des tâches et la collégialité assuraient une **démocratie réelle**. Il peut paraître paradoxal de parler de démocratie dans l’Afrique d’hier où l’absolutisme semble avoir régné. Mais le mot et la réalité de la démocratie ne sont pas toujours logés à la même enseigne. »

## Document 2 — Des civilisations « harmonieuses et bien formées »

*Frobenius,* Histoire de la civilisation africaine, *Gallimard, 1936 :*

> « Lorsqu’ils arrivèrent dans la baie de Guinée […], les capitaines furent fort étonnés de trouver des **rues bien aménagées** […]. Plus au sud, dans le royaume du Congo, une foule habillée de soie et de velours, de **grands États bien ordonnés** […]. L’Afrique nègre […] était encore en plein épanouissement […]. Cette floraison, les conquistadors européens l’**anéantissaient** à mesure qu’ils progressaient. »

## Comment construire ta réponse

**Consigne 1 — Le problème.** Il s’agit du débat entre les **apports de la modernité occidentale** et le **maintien des valeurs ancestrales** africaines.

**Consigne 2 — Expliquer « la civilisation occidentale enrichit et éclaire ».** Montre les **apports** : l’**école** et un nouveau savoir, les **techniques** modernes, les **institutions** (État, élections), l’**économie de marché** et la **santé** — autant d’outils d’**insertion dans le monde moderne**.

**Consigne 3 — Les sociétés maintiennent-elles leurs valeurs ancestrales ? (Y es-tu favorable ?)** Réponse **nuancée** :

| Ce qui plaide pour les permanences | Les mutations réelles |
|---|---|
| chefferies, animisme, **solidarité** (funérailles, mariages) | États modernes, salariat, mariage civil |
| polygamie, modes de succession | émancipation de la femme, famille nucléaire |
| une identité et une **démocratie réelle** anciennes (Ki-Zerbo) | affaiblissement des solidarités |

> **Astuce mémoire de Davy.** Le bon réflexe, c’est le **« ni-ni »** : la civilisation négro-africaine actuelle n’est **ni une copie totale de l’Occident**, **ni figée** dans le passé. Elle **recompose** — elle garde des valeurs ancestrales (une force pour un développement **endogène**) tout en adoptant des apports modernes. Réfute donc l’idée qu’elle serait « devenue totalement la même que l’Occident ».`,
      extraQuestions: [
        { prompt: "Selon Ki-Zerbo (doc. 1), que peut-on dire de l’Afrique d’hier malgré l’apparent absolutisme ?", options: ["Elle connaissait une solidarité et une « démocratie réelle »", "Elle n’avait aucune organisation", "Elle était identique à l’Europe", "Elle ignorait toute hiérarchie"], correctIndex: 0, explanation: "Division des tâches et collégialité assuraient une démocratie réelle.", sourceLabel: "Document 1 — Ki-Zerbo", points: 2 },
        { prompt: "Que révèle le document 2 de Frobenius sur l’Afrique avant la colonisation ?", options: ["Des villes bien aménagées et de grands États ordonnés, ensuite anéantis", "Un continent vide et sans civilisation", "Une copie de l’Europe", "L’absence de tout État"], correctIndex: 0, explanation: "Il réfute l’image d’une Afrique « désolée » et « primitive ».", sourceLabel: "Document 2 — Frobenius", points: 2 },
        { prompt: "Pour la consigne 2, quel est un apport occidental qui « enrichit » les sociétés africaines ?", options: ["L’école, les techniques, les institutions et l’économie moderne", "Le retour au troc", "La suppression de l’école", "L’isolement du continent"], correctIndex: 0, explanation: "Des outils d’insertion dans le monde moderne.", sourceLabel: "Méthode BAC — consigne 2", points: 2 },
        { prompt: "Pour la consigne 3, quelle position est la plus juste ?", options: ["La civilisation africaine n’est ni une copie de l’Occident ni figée : elle recompose et garde des valeurs propres", "Elle est devenue totalement identique à l’Occident", "Elle n’a connu aucune mutation", "Toute tradition empêche le développement"], correctIndex: 0, explanation: "Un avis nuancé : mutations réelles mais permanences vivaces.", sourceLabel: "Méthode BAC — consigne 3", points: 2 },
      ],
      questions: [
        question("Quel est le thème du débat ?", "Les mutations et les permanences de la civilisation négro-africaine", ["La création des blocs militaires", "Le déficit halieutique ivoirien", "Les accords de Cotonou uniquement"], "La situation confronte changement culturel et maintien de l’identité.", 1),
        question("Comment le contact occidental transforme-t-il les sociétés africaines ?", "Il diffuse école, monnaie, urbanisation, religions et institutions nouvelles", ["Il empêche tout changement social", "Il restaure partout les mêmes royaumes", "Il supprime toute économie de marché"], "Les transformations touchent les domaines politique, économique, social et culturel.", 2),
        question("Quelle position est la plus nuancée ?", "Les sociétés africaines adoptent certains apports tout en conservant et adaptant des valeurs propres", ["Elles sont devenues totalement identiques à l’Occident", "Elles n’ont connu aucune mutation", "Toute tradition empêche le développement"], "Mutation ne signifie ni copie totale ni immobilité complète.", 0),
      ],
    },
  },
};
