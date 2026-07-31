export const BAC_CI_2024_EXAM_ID = "bac-ci-2024-level-test";

export type BacExamChoiceId = "A" | "B" | "C" | "D" | "E";
export type BacExamAnswers = Record<string, BacExamChoiceId>;

export interface BacExamQuestion {
  id: number;
  prompt: string;
  choices: readonly [string, string, string, string];
  clueRows?: readonly { value: string; clue?: string }[];
}

export interface BacExamGroup {
  title?: string;
  instructions?: string;
  passageTitle?: string;
  passage?: string;
  questions: readonly BacExamQuestion[];
}

export interface BacExamSection {
  id: string;
  eyebrow: string;
  title: string;
  continuation?: boolean;
  groups: readonly BacExamGroup[];
}

interface BacExamDocument {
  id: string;
  institution: string;
  direction: string;
  country: string;
  motto: string;
  title: string;
  session: string;
  composition: string;
  durationMinutes: number;
  originalDate: string;
  instructions: readonly string[];
  sections: readonly BacExamSection[];
}

const printmakingPassage = `Printmaking is the generic term for a number of processes, of which woodcut and engraving are two prime examples. Prints are made by pressing a sheet of paper (or other material) against an image-bearing surface to which ink has been applied. When the paper is removed, the image adheres to it, but in reverse.

The woodcut had been used in China from the fifth century A.D. for applying patterns to textiles. The process was not introduced into Europe until the fourteenth century, first for textile decoration and then for printing on paper. Woodcuts are created by a relief process; first, the artist takes a block of wood, which has been sawed parallel to the grain, covers it with a white ground, and then draws the image in ink. The background is carved away, leaving the design area slightly raised. The woodblock is inked, and the ink adheres to the raised image. It is then transferred to damp paper either by hand or with a printing press.

Engraving, which grew out of the goldsmith's art, originated in Germany and northern Italy in the middle of the fifteenth century. It is an intaglio process (from Italian intagliare, "to carve"). The image is incised into a highly polished metal plate, usually copper, with a cutting instrument, or burin. The artist inks the plate and wipes it clean so that some ink remains in the incised grooves. An impression is made on damp paper in a printing press, with sufficient pressure being applied so that the paper picks up the ink.

Both woodcut and engraving have distinctive characteristics. Engraving lends itself to subtle modeling and shading through the use of fine lines. Hatching and cross-hatching determine the degree of light and shade in a print. Woodcuts tend to be more linear, with sharper contrasts between light and dark. Printmaking is well suited to the production of multiple images. A set of multiples is called an edition. Both methods can yield several hundred good-quality prints before the original block or plate begins to show signs of wear. Mass production of prints in the sixteenth century made images available, at a lower cost, to a much broader public than before.`;

const amazonPassage = `Amazon is one of the world's largest technological companies. It started (11.) _______ as an online bookstore in the middle of the 1990s and has grown (12.) _________ over the past decades.

Today, Amazon sells almost everything, from CDs and DVDs to sportswear and electrical (13.) _________. The company also produces its own tablets and e-readers and lets users upload their own photos and other files to the Amazon-based cloud.

Amazon.com was founded by Jeff Bezos in 1994. It first (14.) _________ out of a small garage in Washington state. (15.) _________ a year Amazon offered hundreds of thousands of books.`;

export const bacCi2024Exam: BacExamDocument = {
  id: BAC_CI_2024_EXAM_ID,
  institution: "MINISTÈRE DE L’ENSEIGNEMENT SUPÉRIEUR ET DE LA RECHERCHE SCIENTIFIQUE",
  direction: "DIRECTION GÉNÉRALE DE L’ENSEIGNEMENT SUPÉRIEUR (DGES)",
  country: "RÉPUBLIQUE DE CÔTE D’IVOIRE",
  motto: "Union — Discipline — Travail",
  title: "Concours BAC & BT",
  session: "Session 2024",
  composition: "Test de niveau",
  durationMinutes: 180,
  originalDate: "Dimanche 11/08/2024 · 9.00–12.30",
  instructions: [
    "Pour chaque question de l’épreuve, une seule bonne réponse est possible.",
    "Sélectionne une réponse (A, B, C ou D) pour chacune des 69 questions.",
    "Ta copie sera figée dès que tu appuieras sur « Valider ma copie ».",
  ],
  sections: [
    {
      id: "english",
      eyebrow: "Partie I",
      title: "Épreuve d’anglais",
      groups: [
        {
          title: "Section 1",
          instructions: "Read the text and choose the best answer (A, B, C or D) for items 1–6.",
          passageTitle: "Printmaking",
          passage: printmakingPassage,
          questions: [
            {
              id: 1,
              prompt: "Which of the following, according to you best fits printmaking best definition?",
              choices: [
                "It is the process of creating artworks by transferring ink or other materials through a surface to produce multiple copies of a single image or other.",
                "It is exclusively the process by which newspapers and magazines are published.",
                "It is the process of printing texts.",
                "It is the fact of making paintings.",
              ],
            },
            {
              id: 2,
              prompt: "In paragraph 3 of the text, “originated” is a synonym of:",
              choices: ["derived from", "stemmed from", "arised", "was invented"],
            },
            {
              id: 3,
              prompt: "Which word from the text best suits the following definition: “produce especially in large quantities, by a mechanical process involving the transfer of texts or designs to paper”:",
              choices: ["produce massively", "edit", "print", "wipe"],
            },
            {
              id: 4,
              prompt: "“Engraving” has a link with:",
              choices: ["incise", "painting", "drawing", "writing"],
            },
            {
              id: 5,
              prompt: "According to the passage, woodcut appeared as a relief printing method in visual art in:",
              choices: ["China only", "Europe first", "Germany", "a chronological order in Asia and Europe"],
            },
            {
              id: 6,
              prompt: "Which of the following is not stressed about printmaking in the reading text?",
              choices: ["Favours mass-production", "Hinder a welfare state", "Produce at a larger scale", "Favours editions"],
            },
          ],
        },
        {
          title: "Section 2",
          instructions: "Choose the best answer (A, B, C or D) for items 07–10.",
          questions: [
            {
              id: 7,
              prompt: "There weren't ____ people in the stadium because of the heavy rain.",
              choices: ["many", "much", "plenty", "some"],
            },
            {
              id: 8,
              prompt: "I learnt to ________ a bicycle when I was six years old.",
              choices: ["conduct", "drive", "guide", "ride"],
            },
            {
              id: 9,
              prompt: "The car broke down but the ________ in the garage soon fixed it.",
              choices: ["mechanic", "machinist", "manufacturer", "driver"],
            },
            {
              id: 10,
              prompt: "____ you study, you will always fail.",
              choices: ["If", "As if", "Unless", "Lest"],
            },
          ],
        },
        {
          title: "Section 3",
          instructions: "Choose the best option (A, B, C or D) for each blank for items 11–15.",
          passageTitle: "Amazon",
          passage: amazonPassage,
          questions: [
            { id: 11, prompt: "Blank 11", choices: ["of", "out", "up", "in"] },
            { id: 12, prompt: "Blank 12", choices: ["steadily", "gradual", "firm", "solidly"] },
            { id: 13, prompt: "Blank 13", choices: ["machines", "equipments", "pieces", "appliances"] },
            { id: 14, prompt: "Blank 14", choices: ["ran", "functioned", "operated", "worked"] },
            { id: 15, prompt: "Blank 15", choices: ["Within", "During", "While", "Inside"] },
          ],
        },
        {
          title: "Section 4",
          instructions: "The following sentences are translated into French. Choose the right translation (A), (B), (C) or (D) for each.",
          questions: [
            {
              id: 16,
              prompt: "Colour television",
              choices: [
                "La télévision coloriée",
                "La télévision en noir et blanc",
                "La télévision en couleur",
                "La télévision avec des couleurs variées",
              ],
            },
            {
              id: 17,
              prompt: "PORO, leading innovation.",
              choices: [
                "PORO, dirigeant l’innovation.",
                "Le PORO, à la crête de l’innovation.",
                "PORO, à la pointe de l’innovation.",
                "PORO, tout en prônant l’innovation.",
              ],
            },
            {
              id: 18,
              prompt: "Because its cost is high the colour television has been put on the market more recently.",
              choices: [
                "Parce que son coût est haut, la télé couleur a été mise sur le marché récemment.",
                "A cause de son cou surélevé, la télévision en couleur a eu une récente apparition sur le marché.",
                "A cause de son coût élevé et de sa commercialisation plus récente, la télévision en couleur est arrivée sur le marché très récemment.",
                "En raison de son coût élevé, la télévision en couleur a été commercialisée plus récemment.",
              ],
            },
            {
              id: 19,
              prompt: "The wild river destroyed the whole village.",
              choices: [
                "La rivière sauvage détruisit le village.",
                "La village fut détruit par la rivière.",
                "La rivière en crue a anéantit tout le village.",
                "La rizière en furie a détruit le village tout entier.",
              ],
            },
            {
              id: 20,
              prompt: "There are no grounds for thinking that the situation will change much for some months.",
              choices: [
                "Il n’y a aucun motif de penser que la situation changera beaucoup pendant quelques mois.",
                "Il n’y a pas lieu de penser que la situation changerait considérablement pour quelques mois.",
                "Il n’y a aucune place pour penser que la situation qui prévaut changera dans quelques mois.",
                "Il n’y a aucune raison pour envisager un changement mensuel.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "general-knowledge",
      eyebrow: "Partie II",
      title: "Épreuve de culture générale",
      groups: [
        {
          questions: [
            {
              id: 21,
              prompt: "Indiquez la seule phrase correcte.",
              choices: [
                "Dépendant du prix des loyers, ils loueront ou non un appartement situé près de l’université",
                "Ces détenus vont recouvrir leur liberté dans quelques jours.",
                "Une nouvelle avocate a dû remplacer l’avocat de la défense au pied levé.",
                "Traoré a inscrit son numéro de téléphone personnel à l’endos de sa carte d’affaires.",
              ],
            },
            {
              id: 22,
              prompt: "Dans le texte suivant, les phrases ont été mises dans le désordre. On veut reconstituer le texte en mettant les phrases dans le bon ordre. Choisissez la bonne réponse.\n\n1 : Les artistes harcelés, par peur des représailles choisissent en effet le silence.\n2 : Victime d’harcèlement moral, il a décidé d’agir au nom de tous ceux qui se taisent.\n3 : Le chanteur AMAROU DJ poursuit en justice sa maison de disque.\n4 : Le verdict tombera dans un mois, nous vous tiendrons au courant.",
              choices: ["3-2-1-4", "1-3-2-4", "3-4-1-2", "2-3-1-4"],
            },
            {
              id: 23,
              prompt: "Que signifie le mot atypique ?",
              choices: [
                "Qui n’a pas de type précis.",
                "Un mot qui a un sens contraire à un autre.",
                "Un mot qui a le même sens qu’un autre.",
                "Qui diffère du type normal, inclassable.",
              ],
            },
            {
              id: 24,
              prompt: "Que signifie le mot édulcorer ?",
              choices: [
                "Rendre coloré ce qui ne l’est pas.",
                "Argumenter, prendre position.",
                "Adoucir, affaiblir.",
                "Laisser les choses aller.",
              ],
            },
            {
              id: 25,
              prompt: "Que signifie l’expression « Avoir le pain et le couteau » ?",
              choices: [
                "Avoir beaucoup plus que ce dont on a besoin.",
                "Ne rien posséder.",
                "Ne manquer de rien, avoir tout pour agir.",
                "Détenir le droit de vie et de mort.",
              ],
            },
            {
              id: 26,
              prompt: "Indiquez la phrase dans laquelle un mot ou un groupe de mots présente une erreur.",
              choices: [
                "Une immense banderole bleu lavande ornait la devanture de la boutique.",
                "La responsable du projet l’a clairement exposée, sa vision du problème.",
                "Les différentes tâches à accomplir, ils se les sont partagés lors de la dernière réunion.",
                "Karim et Goba étaient tout contents de leur admissibilité au Concours Bacheliers/BT 2024.",
              ],
            },
            {
              id: 27,
              prompt: "Dans le texte suivant, les phrases ont été mises dans le désordre. On veut reconstituer le texte en mettant les phrases dans le bon ordre. Choisissez la bonne réponse.\n\n1 : Je reconnus une vipère.\n2 : Mon attention fut tout à coup requise par quelque chose de brillant qui se glissait entre les herbes et soulevait, comme d’un vif éclair argenté, le feuillage bas de millepertuis.\n3 : Ayant longtemps marché, je me reposais au bord d’une clairière, le dos appuyé contre le tronc d’un hêtre.\n4 : Elle ne me voyait point et s’ébattait librement, paresseusement parmi les fleurs.",
              choices: ["1-4-2-3", "2-3-1-4", "3-2-1-4", "2-4-1-3"],
            },
            {
              id: 28,
              prompt: "Indiquez la phrase dans laquelle un mot ou un groupe de mots présente une erreur.",
              choices: [
                "L’équipe actuelle a adopté une tout autre stratégie que celle recommandée par les experts.",
                "François et Stéphanie se sont téléphonés pour fixer un lieu de rendez-vous.",
                "Nous nous sommes beaucoup plu à faire du bénévolat pour le marathon annuel.",
                "C’est une candidate tout éblouie qui a reçu le cadeau dont elle rêvait depuis des mois.",
              ],
            },
          ],
        },
        {
          instructions: "Indiquez la phrase qui comporte une erreur de syntaxe. Cette erreur peut porter, entre autres, sur l’emploi des pronoms, l’emploi de la préposition, l’emploi des modes et des temps. Questions Q29 à Q31.",
          questions: [
            {
              id: 29,
              prompt: "Indiquez la phrase qui comporte une erreur de syntaxe.",
              choices: [
                "Leurs anecdotes de voyage, ils vous en font encore le récit quand vous les rencontrez.",
                "Vous espérez que vous n’avez rien oublié, car vous voulez que la fête soit réussie.",
                "Vous vous fiez toujours à ce traiteur pour que vos réceptions soient réussies.",
                "Ce traiteur fournit les ustensiles que vous aurez besoin pour votre repas de fête.",
              ],
            },
            {
              id: 30,
              prompt: "Indiquez la phrase qui comporte une erreur de syntaxe.",
              choices: [
                "C’est certainement un concours dont nous nous rappellerons longtemps.",
                "Il nous a fallu aux moins une heure trente pour nous rendre au lieu de composition.",
                "L’école de ces vedettes correspond tout à fait à l’idée que je m’en faisais.",
                "Nous avons photographié les vedettes dont nous avons visité l’immense école.",
              ],
            },
            {
              id: 31,
              prompt: "Indiquez la phrase qui comporte une erreur de syntaxe.",
              choices: [
                "Des marqueurs, procure-t’en au moins trois : un jaune, un rose et un bleu.",
                "Je n’ai pas trouvé le manuel dont vous pensiez avoir noté le titre exact.",
                "Les remarques de votre enseignante à propos de vos erreurs, en avez-vous tenu compte ?",
                "Je souhaite que, cette année, mes résultats en mathématiques seront meilleurs que ceux de l’année dernière.",
              ],
            },
          ],
        },
        {
          questions: [
            {
              id: 32,
              prompt: "Que signifie le mot congruent ?",
              choices: [
                "Difficile à comprendre.",
                "Exagéré, démesuré.",
                "Qui affiche sa supériorité, souvent de manière arrogante.",
                "Qui convient, qui s’applique bien.",
              ],
            },
            {
              id: 33,
              prompt: "Combien d’écoles d’Ingénieurs sont-elles concernées par le concours Bacheliers 2024 ?",
              choices: ["4", "5", "6", "7"],
            },
            {
              id: 34,
              prompt: "Quelle est l’affirmation vraie concernant l’INP-HB ?",
              choices: [
                "Après les deux années passées à l’Ecole Préparatoire, j’obtiens un diplôme équivalent au BAC+3",
                "Après les deux années passées à l’Ecole Préparatoire, j’obtiens un diplôme équivalent au BAC+2",
                "DTS signifie Diplôme de Technicien Supérieur",
                "DTS signifie Diplôme de Technicien supérieur Spécialisé",
              ],
            },
            {
              id: 35,
              prompt: "Le pont « Alassane Ouattara » a été conçu par un",
              choices: ["ivoirien", "chinois", "français", "marocain"],
            },
            {
              id: 36,
              prompt: "La plus longue frontière terrestre de la République Française est avec :",
              choices: ["l’Italie", "le Brésil", "l’Allemagne", "l’Espagne"],
            },
            {
              id: 37,
              prompt: "Les deux pays possédant les plus longues frontières terrestres avec la Côte d’Ivoire sont",
              choices: [
                "le Burkina Faso et le Mali",
                "la Guinée et le Ghana",
                "le Libéria et Ghana",
                "le Mali et Guinée",
              ],
            },
            {
              id: 38,
              prompt: "L’actuel Directeur Général de l’INP-HB est un",
              choices: ["chimiste", "biologiste", "physicien", "économiste"],
            },
            {
              id: 39,
              prompt: "Quel est l’intrus",
              choices: ["ESI", "CPGE", "ESAS", "STIC"],
            },
            {
              id: 40,
              prompt: "Quelle est l’affirmation juste ?",
              choices: [
                "Simon Adingra a été désigné meilleur joueur de la CAN 2023.",
                "Simon Adingra a été élu Homme du match de la finale de la CAN 2023.",
                "Simon Adingra est né à Bondoukou.",
                "Simon Adingra a marqué son premier contre le Sénégal lors de la CAN 2023",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "scientific-culture",
      eyebrow: "Partie III",
      title: "Épreuve de culture scientifique",
      groups: [
        {
          questions: [
            {
              id: 41,
              prompt: "Le conseil municipal d'une ville comprend 5 commissions, qui obéissent aux règles suivantes :\n\nRègle 1 : tout conseiller municipal fait partie de deux commissions exactement.\nRègle 2 : deux commissions quelconques ont exactement un conseiller en commun.\n\nCombien y a-t-il de membres dans le conseil municipal ?",
              choices: ["10", "30", "40", "50"],
            },
            {
              id: 42,
              prompt: "Pour aller travailler, Tania doit emprunter le nouveau pont « HKB » sur la lagune Ebrié et régler le péage. S’il prend le pont « De Gaulle », plus éloigné et avec plus d’embouteillages, le tarif est deux fois plus élevé. Quel est le pourcentage d’augmentation de prix d’un aller-retour quotidien si Tania passe par le pont « De Gaulle » à chaque fois ?",
              choices: ["0 %", "100 %", "200 %", "400 %"],
            },
            {
              id: 43,
              prompt: "Le plus rapide des 4 concurrents Bari, Binaté, Cissé et Ben est :",
              choices: [
                "Bari, qui court à 10 km/h",
                "Binaté, qui parcourt 500 m en 1 minute",
                "Cissé, qui met 1 h pour faire 8 km",
                "Ben, qui réalise 300 m en 60 secondes",
              ],
            },
            {
              id: 44,
              prompt: "Le prix d'un litre d’essence est noté $p$. Une première augmentation de $t\\%$ lui est appliquée, puis une seconde de $r\\%$. Quel est le nouveau prix du litre d’essence ?",
              choices: [
                "$p \\times r \\times t$",
                "$(1+t)(1+r)$",
                "$p(r\\%+t\\%)$",
                "$p(1+t\\%)(1+r\\%)$",
              ],
            },
            {
              id: 45,
              prompt: "Trouvez la combinaison de lettre qui répond à toutes les lignes en sachant que 1BP signifie que la ligne a une lettre bien placée commune avec la combinaison cherchée, que 1MP signifie que la ligne a une lettre mal placée commune avec la combinaison cherchée.",
              clueRows: [
                { value: "I  B  E  L", clue: "1BP + 1MP" },
                { value: "L  A  I  E", clue: "1BP + 1MP" },
                { value: "L  I  E  N", clue: "1BP + 1MP" },
                { value: "E  B  I  L", clue: "2BP" },
              ],
              choices: ["BAIN", "ABIN", "IBAN", "ANIB"],
            },
            {
              id: 46,
              prompt: "Trouvez la combinaison de lettre qui répond à toutes les lignes en sachant que 1BP signifie que la ligne a une lettre bien placée commune avec la combinaison cherchée, que 1MP signifie que la ligne a une lettre mal placée commune avec la combinaison cherchée.",
              clueRows: [
                { value: "A  W  Z  U", clue: "2BP" },
                { value: "Q  U  A  C", clue: "2BP" },
                { value: "U  W  Z  A", clue: "2BP" },
              ],
              choices: ["AUZA", "UUZC", "AWZC", "QWZC"],
            },
            {
              id: 47,
              prompt: "Sur le site de l’INP-HB, on interroge un groupe de bacheliers dont les deux cinquièmes sont des garçons, dont cinq dixièmes proviennent d’un lycée de la ville de Yamoussoukro. Trois cinquièmes de ceux qui proviennent de la ville de Yamoussoukro sont du lycée X, un dixième du lycée Y et un dixième du lycée Z dont quatre cinquièmes sont de la série C. Quelle est la proportion des bacheliers de la série C du Lycée Z qui ont été interrogés sur le site de l’INP-HB ?",
              choices: ["0,2 %", "0,8 %", "1,6 %", "2 %"],
            },
            {
              id: 48,
              prompt: "Ali qui veut dormir dans une chambre violette arrive cinq minutes à l'hôtel avant Gossé qui veut une chambre rouge. Goro qui veut une chambre rose arrive deux minutes avant Gossé et Assemien qui veut une chambre bleue arrive huit minutes après Ali. Leurs compagnes respectives arrivent ensemble à l'hôtel deux heures après Ali. L'amie de Gossé, Nadia, souhaite dormir dans une chambre violette, celle d’Ali, Odile, dans une chambre bleue, celle de Goro, Emilie, dans une chambre rouge et celle de Assemien, Sophie, dans une chambre rose. Quel est l'ordre d'arrivée des garçons ?",
              choices: [
                "Goro, Ali, Assemien, Gossé",
                "Goro, Ali, Gossé, Assemien",
                "Ali, Goro, Assemien, Gossé",
                "Ali, Goro, Gossé, Asemien.",
              ],
            },
            {
              id: 49,
              prompt: "Soma vit à Bouaké et Antoinette à Bingerville. Ils se donnent rendez-vous à Yamoussoukro. Bingerville est à 240 km de Yamoussoukro et à 340 km de Bouaké. Soma, qui est à moto, roule à une vitesse moyenne de 50 km/h. Antoinette, elle, possède un véhicule ; mais, compte tenu de la circulation, elle roule à une vitesse moyenne de 100 km/h, au lieu des 120 km/h autorisés. S'ils partent tous les deux à la même heure, lequel des deux arrive le premier à Yamoussoukro et combien de temps doit-il attendre son ami ?",
              choices: [
                "Antoinette — 18 minutes d'attente",
                "Antoinette — 36 minutes d'attente",
                "Soma — 12 minutes d'attente",
                "Soma — 24 minutes d'attente",
              ],
            },
            {
              id: 50,
              prompt: "Dans le Système International, quelle est l’unité de mesure de l’énergie ?",
              choices: ["le watt", "la puissance", "le joule", "Aucune bonne réponse"],
            },
            {
              id: 51,
              prompt: "Quelle est la formule de la vitesse ?",
              choices: ["$v=d\\times t$", "$t=\\dfrac{d}{v}$", "$d=\\dfrac{t}{v}$", "$v=\\dfrac{t}{d}$"],
            },
            {
              id: 52,
              prompt: "Parmi les propositions suivantes laquelle est vraie ?",
              choices: [
                "$(7<3)$ et $(2\\text{ divise }8)$",
                "$\\exists x\\in\\mathbb{N}:x+1=8$",
                "$(8<5)$ ou $(4\\text{ divise }7)$",
                "$\\forall x\\in\\mathbb{R}^{+}:x+\\sqrt{x}\\ge 2$",
              ],
            },
            {
              id: 53,
              prompt: "Le secteur de la téléphonie cellulaire a vu le jour en Côte d’Ivoire en 1994 avec l’arrivée sur le marché de",
              choices: ["Ivoiris.", "Cora de COMSTAR", "LOTENY Telecom", "Koz"],
            },
            {
              id: 54,
              prompt: "Un homme du désert vient de mourir. Il avait 17 chameaux. Il désire, selon son testament, léguer la moitié de ses chameaux à son premier fils, le tiers à son deuxième fils, et le neuvième à son troisième fils. Dix-sept n'étant divisible ni par 2, ni par 3, ni par 9. Comment partager les chameaux ?",
              choices: ["8 – 6 – 3", "9 – 7 – 1", "9 – 6 – 2", "8 – 7 – 2"],
            },
            {
              id: 55,
              prompt: "Lors des jeux olympiques, un coureur de fond court un 10 000 m sur une piste de 400 m. Il réalise les 10 premiers tours en 13 min et 20 s. Il termine le 10 000 m en 31 min et 20 s. Quelle a été sa vitesse moyenne pendant les 15 derniers tours ?",
              choices: ["18 km/h", "18,6 km/h", "20 km/h", "Aucune bonne réponse"],
            },
            {
              id: 56,
              prompt: "Combien de mètres cubes de terre contient un trou de 6 m de diamètre et de 3 m de profondeur ?",
              choices: ["84,78", "339,12", "18", "Aucune bonne réponse"],
            },
            {
              id: 57,
              prompt: "Un paysan veut traverser une rivière à bord d'une barque. Il a avec lui un cageot de choux, une chèvre et un loup. L'embarcation n'est pas solide, et le paysan ne peut prendre avec lui que l'une des trois choses. De plus, il ne peut laisser sur une même berge et sans lui le loup et la chèvre ensemble, ni la chèvre et les choux, pour des raisons évidentes de gourmandise. Peut-il traverser la rivière, et si oui, combien de traversées fera-t-il ?",
              choices: ["5 traversées", "7 traversées", "9 traversées", "Non, impossible de réaliser cette tâche"],
            },
            {
              id: 58,
              prompt: "Quelle roue ne tourne pas quand une voiture tourne à droite :",
              choices: ["La roue arrière gauche", "La roue arrière droit", "la roue avant droit", "Aucune bonne réponse"],
            },
            {
              id: 59,
              prompt: "Trouver les deux dernières lettres.",
              clueRows: [
                { value: "F   H   K   ?   U" },
                { value: "B   D   G   ?   K" },
              ],
              choices: ["I et R", "L et M", "G et R", "L et G"],
            },
            {
              id: 60,
              prompt: "Une citerne est entièrement remplie en récupérant 50 mm de pluie tombée au m² sur une toiture de 120 m². Quel est le volume de la citerne ?",
              choices: ["5 m³", "600 litres", "6 000 dm³", "50 000 dm³"],
            },
          ],
        },
      ],
    },
    {
      id: "general-knowledge-extra",
      eyebrow: "Questions complémentaires",
      title: "Culture générale — suite",
      continuation: true,
      groups: [
        {
          instructions: "Ces neuf questions complémentaires portent le total de l’épreuve à 69 questions (Q1 à Q69). Pour chaque question, une seule bonne réponse est possible.",
          questions: [
            {
              id: 61,
              prompt: "Les sept nouvelles merveilles du monde ont été désignées en 2007. Parmi les listes suivantes, laquelle ne contient que des monuments figurant parmi ces sept nouvelles merveilles ?",
              choices: [
                "Chichén Itzá – Le Colisée de Rome – La statue de Zeus à Olympie",
                "Pétra – Le Machu Picchu – Le Taj Mahal",
                "La Grande Muraille de Chine – Le Christ Rédempteur – Le phare d'Alexandrie",
                "Le Colisée de Rome – Les jardins suspendus de Babylone – Chichén Itzá",
              ],
            },
            {
              id: 62,
              prompt: "Laquelle des propositions suivantes ne fait pas partie des sept merveilles du monde antique ?",
              choices: [
                "Les jardins suspendus de Babylone",
                "Le temple d'Artémis à Éphèse",
                "Le Colisée de Rome",
                "Le mausolée d'Halicarnasse",
              ],
            },
            {
              id: 63,
              prompt: "La Coupe d'Afrique des nations 2025 s'est déroulée du 21 décembre 2025 au 18 janvier 2026. Quelle affirmation est exacte ?",
              choices: [
                "Elle s'est tenue en Égypte et la finale a opposé le Maroc au Nigeria.",
                "Elle s'est tenue au Maroc et la finale a opposé le Maroc au Sénégal.",
                "Elle s'est tenue en Côte d'Ivoire et la finale a opposé le Sénégal à l'Égypte.",
                "Elle s'est tenue au Sénégal et la finale a opposé le Maroc à l'Algérie.",
              ],
            },
            {
              id: 64,
              prompt: "La finale de la Coupe du monde de football 2026 s'est jouée le 19 juillet 2026 au MetLife Stadium. Quelle est l'affirmation exacte ?",
              choices: [
                "L'Argentine a battu l'Espagne 1-0 après prolongation.",
                "L'Espagne a battu l'Argentine 1-0 après prolongation, sur un but de Ferran Torres.",
                "La France a battu l'Espagne aux tirs au but.",
                "L'Espagne a battu le Brésil 2-1 dans le temps réglementaire.",
              ],
            },
            {
              id: 65,
              prompt: "La Coupe du monde 2026 a marqué une rupture dans l'histoire de la compétition. Laquelle ?",
              choices: [
                "Elle a été organisée par trois pays et a réuni 48 sélections pour la première fois.",
                "Elle a été organisée par deux pays et a réuni 40 sélections pour la première fois.",
                "Elle a été organisée par un seul pays et a réuni 48 sélections pour la première fois.",
                "Elle a été organisée par trois pays et a réuni 32 sélections, comme en 2022.",
              ],
            },
          ],
        },
      ],
    },
    {
      id: "scientific-culture-extra",
      eyebrow: "Questions complémentaires",
      title: "Culture scientifique — suite",
      continuation: true,
      groups: [
        {
          questions: [
            {
              id: 66,
              prompt: "Un navire en détresse se signale à 40 km au large d'un port. Une vedette de sauvetage quitte aussitôt le port à la vitesse moyenne de 60 km/h. Un hélicoptère décolle du même port 10 minutes plus tard et rejoint le navire en ligne droite à 180 km/h. Lequel des deux moyens atteint le navire en premier, et avec quelle avance ?",
              choices: [
                "La vedette, avec 10 minutes d'avance",
                "L'hélicoptère, avec 6 minutes et 40 secondes d'avance",
                "L'hélicoptère, avec 16 minutes et 40 secondes d'avance",
                "Les deux moyens atteignent le navire au même moment",
              ],
            },
            {
              id: 67,
              prompt: "Quatre personnes doivent franchir de nuit une passerelle avec une seule lampe torche, indispensable à chaque traversée. La passerelle ne supporte que deux personnes à la fois. Elles mettent respectivement 1, 2, 5 et 10 minutes pour traverser ; lorsque deux personnes traversent ensemble, elles avancent à l'allure de la plus lente. Quel est le temps minimal pour que les quatre soient passées ?",
              choices: ["17 minutes", "19 minutes", "21 minutes", "23 minutes"],
            },
            {
              id: 68,
              prompt: "On lâche simultanément, de la même hauteur et sans vitesse initiale, deux billes de même volume mais de masses différentes. En négligeant la résistance de l'air :",
              choices: [
                "la bille la plus lourde touche le sol en premier",
                "la bille la plus légère touche le sol en premier",
                "les deux billes touchent le sol en même temps",
                "le résultat dépend de la hauteur de chute",
              ],
            },
            {
              id: 69,
              prompt: "Une solution de 200 g d'eau salée contient 5 % de sel en masse. Quelle masse d'eau faut-il évaporer pour porter la concentration en sel à 10 % ?",
              choices: ["10 g", "20 g", "50 g", "100 g"],
            },
          ],
        },
      ],
    },
  ],
};

export const bacCi2024Questions: BacExamQuestion[] = bacCi2024Exam.sections.flatMap((section) =>
  section.groups.flatMap((group) => group.questions),
);

export function bacExamQuestionKey(questionId: number) {
  return `q${String(questionId).padStart(2, "0")}`;
}
