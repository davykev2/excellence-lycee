import type { LessonQuestion } from "../domain/paths";

interface HumanitiesMissionSeed {
  title: string;
  scenario: string;
  modelAnswer: string;
  questions: [LessonQuestion, LessonQuestion, LessonQuestion];
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
      scenario: "Un officiel affirme que l’ONU est née de la volonté des vainqueurs de 1945 et qu’après plusieurs décennies, son bilan demeure mitigé.",
      modelAnswer: "L’ONU a favorisé la coopération, la décolonisation et plusieurs opérations de paix, mais le veto, les rivalités des puissances et certains conflits non résolus limitent son action.",
      questions: [
        question("Quel problème cette affirmation soulève-t-elle ?", "L’efficacité et le bilan de l’ONU dans le maintien de la paix", ["La production agricole mondiale", "La création de la Corée du Sud", "Le climat de Côte d’Ivoire"], "La situation invite à confronter les objectifs de l’ONU à ses résultats.", 1),
        question("Pourquoi dit-on que l’ONU reflète la volonté des vainqueurs de 1945 ?", "Les principales puissances victorieuses disposent d’un siège permanent et du veto", ["Elles sont les seules à siéger à l’Assemblée générale", "Elles contrôlent toutes les ONG", "Elles ont supprimé la Charte"], "La composition permanente du Conseil de sécurité traduit le rapport de forces de 1945.", 2),
        question("Quel jugement est le plus équilibré ?", "L’ONU a obtenu des succès réels, mais ses moyens et les rivalités limitent son efficacité", ["L’ONU n’a jamais rien accompli", "L’ONU a supprimé toutes les guerres", "Le veto garantit toujours une action rapide"], "Le bilan doit présenter à la fois les acquis et les échecs.", 0),
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
      questions: [
        question("Quel est le thème du débat ?", "Les mutations et les permanences de la civilisation négro-africaine", ["La création des blocs militaires", "Le déficit halieutique ivoirien", "Les accords de Cotonou uniquement"], "La situation confronte changement culturel et maintien de l’identité.", 1),
        question("Comment le contact occidental transforme-t-il les sociétés africaines ?", "Il diffuse école, monnaie, urbanisation, religions et institutions nouvelles", ["Il empêche tout changement social", "Il restaure partout les mêmes royaumes", "Il supprime toute économie de marché"], "Les transformations touchent les domaines politique, économique, social et culturel.", 2),
        question("Quelle position est la plus nuancée ?", "Les sociétés africaines adoptent certains apports tout en conservant et adaptant des valeurs propres", ["Elles sont devenues totalement identiques à l’Occident", "Elles n’ont connu aucune mutation", "Toute tradition empêche le développement"], "Mutation ne signifie ni copie totale ni immobilité complète.", 0),
      ],
    },
  },
};
