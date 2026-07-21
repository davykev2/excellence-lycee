import type { LearningPath, LessonQuestion } from "../domain/paths";

export const generalFunctionsPath: LearningPath = {
  id: "seconde-c-general-functions",
  subjectId: "mathematics",
  levelIds: ["seconde-c"],
  curriculumLabel: "Programme ivoirien • Seconde C",
  curriculumSourceUrl:
    "https://dpfc-ci.net/dpfc/programmes/maths/06.Prog%20Educt%20maths%202C%20CND%200923.pdf",
  theme: {
    number: 2,
    title: "Fonctions numériques",
  },
  chapterNumber: 1,
  title: "Généralités sur les fonctions",
  description:
    "Comprendre la notion de fonction, déterminer son domaine et lire ses informations essentielles sur un graphique.",
  estimatedMinutes: 82,
  outcomes: [
    "Déterminer l’ensemble de définition d’une fonction",
    "Trouver une image ou un antécédent",
    "Lire les variations, maxima et minima sur un graphique",
  ],
  modules: [
    {
      id: "language",
      title: "1. Comprendre le langage des fonctions",
      description: "Passer d’une situation concrète à une règle mathématique.",
      lessons: [
        {
          id: "function-machine",
          title: "Une fonction comme machine",
          summary: "Entrée, règle de calcul et résultat.",
          durationMinutes: 9,
          xp: 30,
          kind: "concept",
          concept: {
            eyebrow: "Idée essentielle",
            title: "Une entrée donne un seul résultat",
            explanation:
              "Une fonction associe à chaque nombre autorisé x un unique nombre, noté f(x). On peut l’imaginer comme une machine : x entre, la règle agit, puis f(x) sort.",
            notation: "x ↦ f(x)",
            example: "Si un cahier coûte 250 F CFA, le prix de n cahiers est P(n) = 250n.",
          },
          interaction: {
            eyebrow: "Manipule la machine",
            title: "Change le nombre de cahiers",
            instruction: "Déplace le curseur et observe comment la sortie évolue.",
            formula: "P(n) = 250n",
            inputSymbol: "n",
            outputSuffix: "F CFA",
            rule: { kind: "linear", coefficient: 250, constant: 0 },
            input: { min: 1, max: 10, step: 1, initial: 4 },
            observation: "Quand l’entrée augmente de 1, le prix augmente toujours de 250 F CFA.",
          },
          method: {
            eyebrow: "Méthode",
            title: "Calculer l’image d’un nombre",
            introduction: "Pour obtenir une image, on remplace la variable par la valeur demandée.",
            steps: [
              "Repère la valeur d’entrée.",
              "Remplace la variable par cette valeur dans la formule.",
              "Effectue le calcul et écris l’unité si nécessaire.",
            ],
            example: {
              prompt: "Calculer P(4).",
              work: "P(4) = 250 × 4",
              result: "P(4) = 1 000 F CFA",
            },
            tip: "L’écriture P(4) signifie : l’image de 4 par la fonction P.",
          },
          question: {
            prompt: "Avec P(n) = 250n, quel est le prix de 4 cahiers ?",
            options: ["254 F CFA", "750 F CFA", "1 000 F CFA", "4 000 F CFA"],
            correctIndex: 2,
            explanation: "On remplace n par 4 : P(4) = 250 × 4 = 1 000 F CFA.",
          },
        },
        {
          id: "function-domain",
          title: "Ensemble de définition",
          summary: "Reconnaître les valeurs autorisées et interdites.",
          durationMinutes: 12,
          xp: 40,
          kind: "practice",
          concept: {
            eyebrow: "Valeurs autorisées",
            title: "Une formule n’accepte pas toujours tous les réels",
            explanation:
              "L’ensemble de définition Df contient toutes les valeurs de x pour lesquelles le calcul de f(x) est possible. Une division par zéro est notamment interdite.",
            notation: "Df = {x ∈ ℝ | f(x) existe}",
            example: "Pour g(x) = 1/(x − 2), la valeur x = 2 est interdite.",
          },
          interaction: {
            eyebrow: "Teste le domaine",
            title: "Trouve la valeur interdite",
            instruction: "Fais varier x. La machine signale le calcul impossible.",
            formula: "g(x) = 1/(x − 2)",
            rule: { kind: "reciprocal", shift: 2 },
            input: { min: -3, max: 7, step: 1, initial: 1 },
            observation: "À x = 2, le dénominateur vaut zéro : cette valeur doit être exclue du domaine.",
          },
          method: {
            eyebrow: "Méthode",
            title: "Déterminer un ensemble de définition",
            introduction: "On cherche les opérations qui peuvent rendre la formule impossible.",
            steps: [
              "Repère le dénominateur de la fraction.",
              "Cherche la valeur qui annule ce dénominateur.",
              "Retire cette valeur de l’ensemble des réels.",
            ],
            example: {
              prompt: "Déterminer Dg pour g(x) = 1/(x − 2).",
              work: "x − 2 ≠ 0, donc x ≠ 2",
              result: "Dg = ℝ \\ {2}",
            },
            tip: "Une fraction existe seulement lorsque son dénominateur est différent de zéro.",
          },
          question: {
            prompt: "Quel est l’ensemble de définition de g(x) = 1/(x − 2) ?",
            options: ["ℝ", "ℝ \\ {2}", "[2 ; +∞[", "]−∞ ; 2]"],
            correctIndex: 1,
            explanation: "Le dénominateur x − 2 doit être différent de 0. On exclut donc seulement x = 2.",
          },
        },
      ],
    },
    {
      id: "reading",
      title: "2. Lire une fonction",
      description: "Extraire les bonnes informations d’une formule ou d’une courbe.",
      lessons: [
        {
          id: "images-antecedents",
          title: "Images et antécédents",
          summary: "Distinguer f(x), image et valeur de départ.",
          durationMinutes: 11,
          xp: 40,
          kind: "practice",
          concept: {
            eyebrow: "Deux lectures",
            title: "L’image est le résultat, l’antécédent est le départ",
            explanation:
              "Dans f(3) = 7, le nombre 7 est l’image de 3. Inversement, 3 est un antécédent de 7 par la fonction f.",
            notation: "f(antécédent) = image",
            example: "Pour f(x) = 2x + 1, on obtient f(3) = 7.",
          },
          interaction: {
            eyebrow: "Explore les couples",
            title: "Relie chaque entrée à son image",
            instruction: "Change x et lis immédiatement la valeur de f(x).",
            formula: "f(x) = 2x + 1",
            rule: { kind: "linear", coefficient: 2, constant: 1 },
            input: { min: -5, max: 5, step: 1, initial: 3 },
            observation: "Le nombre choisi est l’antécédent ; le résultat affiché est son image.",
          },
          method: {
            eyebrow: "Méthode",
            title: "Ne plus confondre image et antécédent",
            introduction: "Lis toujours une égalité de fonction de l’intérieur vers l’extérieur.",
            steps: [
              "Dans f(a) = b, repère a à l’intérieur des parenthèses.",
              "a est l’antécédent et b est l’image.",
              "Pour calculer b, remplace x par a dans la formule.",
            ],
            example: {
              prompt: "Pour f(x) = 2x + 1, déterminer l’image de 3.",
              work: "f(3) = 2 × 3 + 1",
              result: "f(3) = 7",
            },
          },
          question: {
            prompt: "Pour f(x) = 2x + 1, quelle est l’image de 3 ?",
            options: ["3", "5", "6", "7"],
            correctIndex: 3,
            explanation: "On remplace x par 3 : f(3) = 2 × 3 + 1 = 7.",
          },
        },
        {
          id: "graph-reading",
          title: "Lire une courbe",
          summary: "Repérer graphiquement une image, des zéros et un minimum.",
          durationMinutes: 14,
          xp: 50,
          kind: "graph",
          concept: {
            eyebrow: "Lecture graphique",
            title: "La courbe relie chaque x à son image",
            explanation:
              "Pour lire f(x), on part de x sur l’axe horizontal, on rejoint la courbe, puis on lit la hauteur obtenue sur l’axe vertical.",
            notation: "Point de la courbe : (x ; f(x))",
            example: "Sur la courbe de f(x) = 0,5x² − 2, le point le plus bas est (0 ; −2).",
          },
          interaction: {
            eyebrow: "Lecture dynamique",
            title: "Déplace le point sur la courbe",
            instruction: "Choisis une abscisse x et observe l’ordonnée correspondante.",
            formula: "f(x) = 0,5x² − 2",
            rule: { kind: "quadratic", coefficient: 0.5, constant: -2 },
            input: { min: -4, max: 4, step: 0.5, initial: 0 },
            observation: "À x = 0, la courbe atteint son minimum : f(0) = −2.",
          },
          method: {
            eyebrow: "Méthode graphique",
            title: "Lire l’image d’une abscisse",
            introduction: "Une lecture graphique se fait avec deux déplacements successifs.",
            steps: [
              "Pars de la valeur x sur l’axe horizontal.",
              "Monte ou descends verticalement jusqu’à la courbe.",
              "Rejoins horizontalement l’axe vertical pour lire f(x).",
            ],
            example: {
              prompt: "Lire l’image de 0 sur la courbe.",
              work: "Le point de la courbe d’abscisse 0 est (0 ; −2).",
              result: "f(0) = −2",
            },
            tip: "Un point de la courbe s’écrit toujours (antécédent ; image).",
          },
          question: {
            prompt: "Pour f(x) = 0,5x² − 2, quelle est l’image de 0 ?",
            options: ["−2", "−0,5", "0", "2"],
            correctIndex: 0,
            explanation: "f(0) = 0,5 × 0² − 2 = −2. C’est aussi le minimum visible de la courbe.",
          },
        },
      ],
    },
    {
      id: "variation",
      title: "3. Interpréter et raisonner",
      description: "Lire des intervalles, des variations et résoudre une situation.",
      lessons: [
        {
          id: "interval-images",
          title: "Images d’un intervalle",
          summary: "Suivre toutes les valeurs prises sur une portion du domaine.",
          durationMinutes: 10,
          xp: 40,
          kind: "practice",
          concept: {
            eyebrow: "Du domaine vers les images",
            title: "Un intervalle d’entrées produit un intervalle d’images",
            explanation:
              "L’image directe d’un intervalle rassemble toutes les valeurs f(x) obtenues lorsque x parcourt cet intervalle.",
            notation: "f([a ; b])",
            example: "Si f(x) = x + 1, alors f([0 ; 3]) = [1 ; 4].",
          },
          interaction: {
            eyebrow: "Parcours l’intervalle",
            title: "Observe les images de [0 ; 3]",
            instruction: "Fais parcourir à x toutes les valeurs comprises entre 0 et 3.",
            formula: "f(x) = x + 1",
            rule: { kind: "linear", coefficient: 1, constant: 1 },
            input: { min: 0, max: 3, step: 0.25, initial: 0 },
            observation: "Lorsque x va de 0 à 3, f(x) va de 1 à 4.",
          },
          method: {
            eyebrow: "Méthode",
            title: "Trouver l’image d’un intervalle",
            introduction: "Pour une fonction croissante, les images des bornes donnent les bornes de l’intervalle image.",
            steps: [
              "Calcule l’image de la borne gauche.",
              "Calcule l’image de la borne droite.",
              "Range les deux résultats dans un nouvel intervalle.",
            ],
            example: {
              prompt: "Déterminer f([0 ; 3]) pour f(x) = x + 1.",
              work: "f(0) = 1 et f(3) = 4",
              result: "f([0 ; 3]) = [1 ; 4]",
            },
          },
          question: {
            prompt: "Si f(x) = x + 1, quelle est l’image de [0 ; 3] ?",
            options: ["[0 ; 3]", "[0 ; 4]", "[1 ; 3]", "[1 ; 4]"],
            correctIndex: 3,
            explanation: "Les extrémités deviennent f(0) = 1 et f(3) = 4.",
          },
        },
        {
          id: "variations-extrema",
          title: "Variations, maximum et minimum",
          summary: "Reconnaître quand une fonction monte ou descend.",
          durationMinutes: 12,
          xp: 50,
          kind: "practice",
          concept: {
            eyebrow: "Comportement d’une fonction",
            title: "Croissante, décroissante ou constante",
            explanation:
              "Une fonction est croissante lorsque ses images augmentent avec x. Un maximum est la plus grande valeur atteinte, un minimum la plus petite.",
            notation: "x₁ < x₂ ⇒ f(x₁) ≤ f(x₂)",
            example: "La fonction x ↦ x² est croissante sur [0 ; +∞[.",
          },
          interaction: {
            eyebrow: "Observe la variation",
            title: "Fais avancer x sur [0 ; 5]",
            instruction: "Augmente x et surveille l’évolution de x².",
            formula: "f(x) = x²",
            rule: { kind: "quadratic", coefficient: 1, constant: 0 },
            input: { min: 0, max: 5, step: 0.25, initial: 2 },
            observation: "Sur les nombres positifs, lorsque x augmente, x² augmente aussi : la fonction est croissante.",
          },
          method: {
            eyebrow: "Méthode",
            title: "Décrire les variations",
            introduction: "On compare le sens de déplacement de x et celui de ses images.",
            steps: [
              "Choisis deux valeurs x₁ et x₂ avec x₁ < x₂.",
              "Compare f(x₁) et f(x₂).",
              "Conclue : les images montent, descendent ou restent constantes.",
            ],
            example: {
              prompt: "Étudier f(x) = x² sur [0 ; +∞[.",
              work: "Si 0 ≤ x₁ < x₂, alors x₁² < x₂².",
              result: "f est croissante sur [0 ; +∞[",
            },
          },
          question: {
            prompt: "Comment varie la fonction f(x) = x² sur [0 ; +∞[ ?",
            options: ["Elle est croissante", "Elle est décroissante", "Elle est constante", "Elle n’est pas définie"],
            correctIndex: 0,
            explanation: "Quand x est positif et augmente, x² augmente également.",
          },
        },
        {
          id: "functions-challenge",
          title: "Défi de synthèse",
          summary: "Mobiliser toutes les notions dans une même situation.",
          durationMinutes: 14,
          xp: 80,
          kind: "challenge",
          concept: {
            eyebrow: "Mission finale",
            title: "Relier formule, courbe et intervalle",
            explanation:
              "Pour résoudre une situation sur une fonction, identifie le domaine, les points remarquables, puis traduis la question avec les images et les antécédents.",
            notation: "f(x) ≤ 0 ⇔ la courbe est sous l’axe horizontal",
            example: "Pour f(x) = x² − 4, la courbe coupe l’axe en −2 et 2.",
          },
          interaction: {
            eyebrow: "Défi visuel",
            title: "Repère où la fonction change de signe",
            instruction: "Déplace x et observe quand le résultat devient nul, positif ou négatif.",
            formula: "f(x) = x² − 4",
            rule: { kind: "quadratic", coefficient: 1, constant: -4 },
            input: { min: -4, max: 4, step: 0.25, initial: 0 },
            observation: "La fonction est nulle en −2 et 2, puis négative entre ces deux valeurs.",
          },
          method: {
            eyebrow: "Stratégie de synthèse",
            title: "Résoudre une inéquation avec une courbe",
            introduction: "Le signe de f(x) se lit par rapport à l’axe horizontal.",
            steps: [
              "Cherche les abscisses où la courbe coupe l’axe horizontal.",
              "Repère les portions situées sous ou sur cet axe.",
              "Écris l’intervalle correspondant, bornes incluses pour ≤.",
            ],
            example: {
              prompt: "Résoudre x² − 4 ≤ 0.",
              work: "Les zéros sont −2 et 2 ; la courbe est sous l’axe entre eux.",
              result: "x ∈ [−2 ; 2]",
            },
            tip: "Pour f(x) ≤ 0, conserve toutes les zones où la courbe est sous ou sur l’axe des abscisses.",
          },
          question: {
            prompt: "Pour f(x) = x² − 4, quand a-t-on f(x) ≤ 0 ?",
            options: ["]−∞ ; −2]", "[−2 ; 2]", "[2 ; +∞[", "]−∞ ; +∞["],
            correctIndex: 1,
            explanation: "Entre ses deux zéros −2 et 2, la courbe est sous ou sur l’axe : f(x) ≤ 0 sur [−2 ; 2].",
          },
        },
      ],
    },
  ],
};

const extraMathQuestions: Record<string, LessonQuestion> = {
  "function-machine": {
    prompt: "Avec P(n) = 250n, quel est le prix de 6 cahiers ?",
    options: ["1 000 F CFA", "1 250 F CFA", "1 500 F CFA", "2 500 F CFA"],
    correctIndex: 2,
    explanation: "P(6) = 250 × 6 = 1 500 F CFA.",
  },
  "function-domain": {
    prompt: "Quelle valeur faut-il exclure pour h(x) = 1/(x + 4) ?",
    options: ["−4", "0", "1", "4"],
    correctIndex: 0,
    explanation: "Le dénominateur x + 4 s’annule pour x = −4.",
  },
  "images-antecedents": {
    prompt: "Pour f(x) = 2x + 1, quelle est l’image de −2 ?",
    options: ["−5", "−3", "1", "3"],
    correctIndex: 1,
    explanation: "f(−2) = 2 × (−2) + 1 = −3.",
  },
  "graph-reading": {
    prompt: "Pour f(x) = 0,5x² − 2, quelle est l’image de 2 ?",
    options: ["−2", "0", "1", "2"],
    correctIndex: 1,
    explanation: "f(2) = 0,5 × 4 − 2 = 0.",
  },
  "interval-images": {
    prompt: "Si f(x) = x + 1, quelle est l’image de [−2 ; 1] ?",
    options: ["[−2 ; 1]", "[−1 ; 2]", "[0 ; 3]", "[1 ; 2]"],
    correctIndex: 1,
    explanation: "La fonction est croissante : f(−2)=−1 et f(1)=2.",
  },
  "variations-extrema": {
    prompt: "Comment varie f(x)=x² sur ]−∞ ; 0] ?",
    options: ["Elle décroît", "Elle croît", "Elle est constante", "Elle n’est pas définie"],
    correctIndex: 0,
    explanation: "Quand x se rapproche de 0 par valeurs négatives, x² diminue jusqu’à 0.",
  },
  "functions-challenge": {
    prompt: "Pour g(x)=x²−9, quand a-t-on g(x)≤0 ?",
    options: ["[−9 ; 9]", "[−3 ; 3]", "]−∞ ; −3]", "[3 ; +∞["],
    correctIndex: 1,
    explanation: "Les zéros sont −3 et 3 ; la fonction est négative ou nulle entre ces deux valeurs.",
  },
};

const generalFunctionsMasteryPath: LearningPath = {
  ...generalFunctionsPath,
  modules: generalFunctionsPath.modules.map((module) => ({
    ...module,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      questions: [lesson.question, extraMathQuestions[lesson.id]],
    })),
  })),
};

export const mathematicsPaths: LearningPath[] = [generalFunctionsMasteryPath];
