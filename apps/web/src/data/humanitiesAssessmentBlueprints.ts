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
      scenario: "Malgré un réseau hydrographique important, la production halieutique ivoirienne ne couvre qu’une partie de la consommation nationale et le pays doit importer du poisson.",
      modelAnswer: "Le déficit vient notamment de techniques peu modernes, d’équipements insuffisants, de la surexploitation et d’une aquaculture encore limitée. Moderniser la flotte, développer l’aquaculture et protéger les ressources permettrait de le réduire.",
      questions: [
        question("Quel problème cette situation met-elle en évidence ?", "Le déficit de production halieutique en Côte d’Ivoire", ["L’absence totale de cours d’eau", "La disparition du commerce extérieur", "Le manque de cultures industrielles"], "Les ressources en eau existent, mais la production de poissons reste insuffisante.", 1),
        question("Quelle explication est la plus complète ?", "Des techniques, équipements et capacités d’aquaculture insuffisants limitent la production", ["Les Ivoiriens ne consomment jamais de poisson", "Tous les fleuves sont asséchés", "La pêche est interdite sur tout le territoire"], "Le potentiel naturel ne suffit pas : il faut des moyens de production et une gestion durable.", 2),
        question("Quelle solution répond directement au problème ?", "Moderniser la pêche, développer l’aquaculture et lutter contre la surexploitation", ["Supprimer tous les ports", "Abandonner la formation des pêcheurs", "Réduire volontairement la production locale"], "Les solutions doivent agir à la fois sur la production, les compétences et la protection de la ressource.", 0),
      ],
    },
  },
  "terminale-hg-g3-cote-ivoire-development-challenges": {
    splitSectionIndex: 0,
    memorySentence: "Diagnostiquer le développement = distinguer problèmes structurels, difficultés sectorielles et solutions durables.",
    mission: {
      title: "Comprendre les fragilités de l’économie ivoirienne",
      scenario: "Un conférencier résume les difficultés ivoiriennes par l’endettement, la dégradation de l’environnement, la faiblesse de l’industrialisation et la forte croissance démographique.",
      modelAnswer: "Ces problèmes se renforcent mutuellement : la dette limite les investissements, la faible industrialisation réduit la valeur ajoutée et l’emploi, tandis que la pression démographique et environnementale augmente les besoins.",
      questions: [
        question("Quel est le problème général posé ?", "Les obstacles au développement économique durable de la Côte d’Ivoire", ["L’absence de toute activité économique", "La création de la CEDEAO", "La fin de la bipolarisation"], "La situation rassemble plusieurs freins structurels et sectoriels au développement.", 1),
        question("Pourquoi la faible industrialisation constitue-t-elle un frein ?", "Elle limite la transformation locale, la valeur ajoutée et les emplois", ["Elle augmente automatiquement les exportations industrielles", "Elle supprime toute dette publique", "Elle rend les matières premières plus rentables sans transformation"], "Transformer davantage les productions permet de conserver plus de richesse et de créer des emplois.", 2),
        question("Quel ensemble de solutions est cohérent ?", "Diversifier l’économie, transformer localement, mieux former et protéger l’environnement", ["Accroître uniquement les importations", "Abandonner les infrastructures", "Encourager la déforestation"], "Une réponse durable combine économie, capital humain, gouvernance et environnement.", 0),
      ],
    },
  },
  "terminale-hg-g4-south-korea-development-foundations": {
    splitSectionIndex: 2,
    memorySentence: "Le décollage sud-coréen associe capital humain, État stratège, industrie exportatrice et influences extérieures adaptées.",
    mission: {
      title: "Expliquer le miracle sud-coréen",
      scenario: "Un article présente la Corée du Sud comme une grande puissance industrielle, malgré ses faibles ressources naturelles, et insiste sur le rôle du capital humain et des influences japonaise et américaine.",
      modelAnswer: "Les aides et modèles étrangers ont compté, mais le succès repose aussi sur l’éducation, l’épargne, l’action de l’État, les chaebols et une stratégie industrielle tournée vers l’exportation.",
      questions: [
        question("Quelle est l’idée générale de la situation ?", "Les fondements du développement économique rapide de la Corée du Sud", ["L’échec définitif de l’industrie coréenne", "La disparition de la population coréenne", "La création de l’Union africaine"], "Le sujet cherche à expliquer la construction de la puissance sud-coréenne.", 1),
        question("Pourquoi le capital humain est-il décisif ?", "Une population éduquée, disciplinée et qualifiée soutient l’innovation et l’industrie", ["Il remplace totalement les investissements", "Il rend inutiles les exportations", "Il repose sur l’analphabétisme"], "L’investissement dans l’éducation et la qualification compense en partie les limites naturelles.", 2),
        question("Quelle appréciation des influences étrangères est équilibrée ?", "Elles ont aidé, mais la stratégie nationale a transformé ces apports en développement", ["Elles expliquent seules tout le succès", "Elles n’ont joué aucun rôle", "Elles ont empêché toute industrialisation"], "Il faut distinguer les apports extérieurs de la capacité interne à les utiliser.", 0),
      ],
    },
  },
  "terminale-hg-g6-ecowas": {
    splitSectionIndex: 2,
    memorySentence: "La CEDEAO transforme des potentialités communes en intégration grâce à ses institutions, mais reste freinée par des obstacles politiques et économiques.",
    mission: {
      title: "La CEDEAO est-elle à la hauteur de ses ambitions ?",
      scenario: "Des élèves soulignent les potentialités de la CEDEAO, mais constatent la persistance d’obstacles à l’intégration économique et au projet de monnaie commune.",
      modelAnswer: "La CEDEAO facilite la libre circulation, des projets communs et la coopération régionale. Son efficacité reste limitée par les écarts de développement, l’instabilité, les intérêts nationaux et l’application incomplète des décisions.",
      questions: [
        question("Quel problème principal est posé ?", "L’écart entre les ambitions d’intégration de la CEDEAO et leurs résultats", ["L’absence d’États en Afrique de l’Ouest", "La disparition de toutes les frontières mondiales", "La création de l’ONU"], "Le débat porte sur les potentialités, les réalisations et les obstacles de l’organisation.", 1),
        question("Pourquoi la CEDEAO est-elle importante ?", "Elle organise un vaste marché, la libre circulation et des coopérations régionales", ["Elle interdit tout commerce entre ses membres", "Elle remplace tous les gouvernements nationaux", "Elle ne s’occupe que de sport"], "L’intégration permet de mutualiser marchés, ressources et infrastructures.", 2),
        question("Quelle difficulté freine réellement l’intégration ?", "Les écarts économiques, l’instabilité et le non-respect de certaines décisions", ["La trop grande uniformité économique", "L’absence de toute population", "L’excès de monnaie commune déjà en circulation"], "Les obstacles sont à la fois économiques, politiques et institutionnels.", 0),
      ],
    },
  },
  "terminale-hg-g7-eu-acp-cooperation": {
    splitSectionIndex: 1,
    memorySentence: "La coopération UE-ACP combine accords, aides et débouchés, mais son bilan dépend de la réduction des déséquilibres et de la dépendance.",
    mission: {
      title: "Les accords UE-ACP ont-ils produit le développement attendu ?",
      scenario: "Un débat porte sur l’accord de Cotonou : certains mettent en avant les aides et les échanges, d’autres constatent que plusieurs pays ACP restent en retard de développement.",
      modelAnswer: "Les accords ont financé des projets et ouvert des marchés, mais ils n’ont pas supprimé la dépendance aux matières premières, la dette ni la faible transformation locale.",
      questions: [
        question("Quel est le cœur du débat ?", "Le bilan et les limites de la coopération entre l’UE et les pays ACP", ["La disparition de l’Union européenne", "La guerre d’Algérie", "Le fonctionnement des climats ivoiriens"], "Le sujet demande de confronter les acquis du partenariat à ses résultats insuffisants.", 1),
        question("Quel apport de l’accord de Cotonou peut être retenu ?", "Il associe dialogue politique, développement et coopération commerciale", ["Il supprime toute coopération financière", "Il transforme les ACP en États membres de l’UE", "Il interdit les échanges agricoles"], "Cotonou élargit le partenariat au-delà de la seule aide commerciale.", 2),
        question("Pourquoi le bilan reste-t-il mitigé ?", "Les aides existent, mais les dépendances et la faible transformation locale persistent", ["Aucun accord n’a jamais été signé", "Tous les ACP sont devenus industrialisés", "Le commerce a totalement disparu"], "Un bilan sérieux distingue réalisations concrètes et transformations structurelles inachevées.", 0),
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
