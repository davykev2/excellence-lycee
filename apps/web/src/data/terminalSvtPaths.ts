import type { LessonQuestion, LessonSourceMetadata } from "../domain/paths";
import { createSvtPath, type SvtCourseSeed } from "./svtPathFactory";

const q = (
  prompt: string,
  answer: string,
  wrong1: string,
  wrong2: string,
  wrong3: string,
  explanation = answer,
): LessonQuestion => ({
  prompt,
  options: [answer, wrong1, wrong2, wrong3],
  correctIndex: 0,
  explanation,
});

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel?: string,
): LessonQuestion => ({ prompt, options, correctIndex, explanation, sourceLabel });

const trueFalse = (
  prompt: string,
  answer: boolean,
  explanation: string,
  sourceLabel?: string,
): LessonQuestion => choice(prompt, ["Vrai", "Faux"], answer ? 0 : 1, explanation, sourceLabel);

const emotionalReactionsDocument = "SVT TA_L1_Les réactions émotionnelles chez lHomme.pdf";

const emotionalSource = (
  pages: string,
  section: string,
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle: emotionalReactionsDocument,
  pages,
  section,
  fidelity: corrections.length > 0 ? "faithful-corrected" : "faithful",
  corrections,
});

const brainActivityDocument = "SVT TA_L2_Lactivité cérébrale chez lHomme.pdf";

const brainActivitySource = (
  pages: string,
  section: string,
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle: brainActivityDocument,
  pages,
  section,
  fidelity: corrections.length > 0 ? "faithful-corrected" : "faithful",
  corrections,
});

const originOfLifeDocument = "SVT TA_L3_Lorigine de la vie.pdf";

const originOfLifeSource = (
  pages: string,
  section: string,
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle: originOfLifeDocument,
  pages,
  section,
  fidelity: corrections.length > 0 ? "faithful-corrected" : "faithful",
  corrections,
});

const humanLineageDocument = "SVT TA_L4_Lévolution de la lignée humaine.pdf";

const humanLineageSource = (
  pages: string,
  section: string,
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle: humanLineageDocument,
  pages,
  section,
  fidelity: corrections.length > 0 ? "faithful-corrected" : "faithful",
  corrections,
});

const sexBloodHeredityDocument = "SVT TA_L5_Lhérédité du sexe et du groupe sanguin chez lHomme.pdf";

const sexBloodHereditySource = (
  pages: string,
  section: string,
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle: sexBloodHeredityDocument,
  pages,
  section,
  fidelity: corrections.length > 0 ? "faithful-corrected" : "faithful",
  corrections,
});

const geneticPredictionsDocument = "SVT TA_L6_Les prévisions génétiques.pdf";

const geneticPredictionsSource = (
  pages: string,
  section: string,
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle: geneticPredictionsDocument,
  pages,
  section,
  fidelity: corrections.length > 0 ? "faithful-corrected" : "faithful",
  corrections,
});

const proteinBiosynthesisDocument = "SVT TA_L7_La biosynthèse des protéines.pdf";

const proteinBiosynthesisSource = (
  pages: string,
  section: string,
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle: proteinBiosynthesisDocument,
  pages,
  section,
  fidelity: corrections.length > 0 ? "faithful-corrected" : "faithful",
  corrections,
});

const courses: SvtCourseSeed[] = [
  {
    id: "terminale-svt-l1-emotional-reactions",
    chapterNumber: 1,
    themeNumber: 1,
    themeTitle: "Communication et régulation chez l’Homme",
    title: "Les réactions émotionnelles chez l’Homme",
    description: "Observer les manifestations d’une émotion, classer ses causes et expliquer l’intégration des réponses nerveuse et hormonale.",
    centralQuestion: "Comment un stimulus prend-il une valeur émotionnelle et mobilise-t-il tout l’organisme ?",
    memorySentence: "Stimulus → système limbique → hypothalamus → voie nerveuse rapide + voie hormonale durable → adaptation.",
    overviewBodyMarkdown: `
## Les trois idées directrices

Une **émotion** est une réaction affective transitoire, généralement intense, déclenchée par une stimulation à laquelle la personne attribue une signification. Le **stress** est une réponse biologique d’alarme, de défense puis d’adaptation face à une contrainte physique ou psychique.

| Question à résoudre | Ce qu’il faut savoir montrer |
|---|---|
| Comment l’émotion se manifeste-t-elle ? | Par des signes perceptibles et des modifications internes mesurables. |
| Qu’est-ce qui la déclenche ? | Une contrainte émotionnelle, une agression physique ou une modification brutale de l’environnement. |
| Comment est-elle régulée ? | Par l’action coordonnée du système nerveux et du système hormonal. |

> **Astuce mémoire — MCR :** **M**anifestations, **C**auses, **R**égulation. C’est aussi le plan complet de la leçon.

### Le fil biologique à retenir

Le cerveau ne répond pas mécaniquement à n’importe quel événement. Les informations sensorielles sont d’abord traitées ; le **système limbique** leur attribue une valeur affective, puis l’**hypothalamus** coordonne les réponses somatiques, végétatives et hormonales.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte interactive",
      title: "Du stimulus à l’adaptation",
      instruction: "Ouvre chaque carte pour comprendre la fonction de l’étape.",
      rootLabel: "Réaction émotionnelle",
      rootDetail: "Une réponse intégrée qui associe vécu affectif, comportement, organes et hormones.",
      nodes: [
        { id: "stimulus", label: "1. Stimulus", role: "Déclencheur", detail: "Événement perçu : annonce, danger, douleur, effort, chaleur, manque de dioxygène…", group: "Entrée" },
        { id: "limbic", label: "2. Système limbique", role: "Valeur affective", detail: "Il participe à l’évaluation émotionnelle du stimulus avec le cortex, l’amygdale et l’hippocampe.", group: "Intégration" },
        { id: "hypothalamus", label: "3. Hypothalamus", role: "Centre coordinateur", detail: "Il active les voies nerveuses autonomes et l’axe hypothalamo-hypophyso-surrénalien.", group: "Intégration" },
        { id: "responses", label: "4. Réponses", role: "Agir et s’adapter", detail: "Comportement, accélération cardiaque, ventilation, redistribution du sang, adrénaline et cortisol.", group: "Sorties" },
      ],
      observation: "Le système nerveux et le système hormonal ne travaillent pas séparément : l’hypothalamus assure leur coordination.",
    },
    overviewExtraQuestions: [
      choice(
        "Quel mot résume le plan de cette leçon ?",
        ["MCR : manifestations, causes, régulation", "ADN : aliment, digestion, nutriment", "ATP : absorption, transport, pression", "RLC : réaction, liaison, cellule"],
        0,
        "MCR permet de retrouver les trois problèmes biologiques étudiés.",
      ),
      choice(
        "Quel organe coordonne directement les sorties nerveuses autonomes et l’axe hormonal du stress ?",
        ["L’hippocampe", "L’hypothalamus", "Le cervelet", "Le pancréas"],
        1,
        "L’hypothalamus est l’intégrateur central des réponses neuro-hormonales.",
      ),
      trueFalse(
        "Une réaction émotionnelle ne concerne que les sentiments ressentis.",
        false,
        "Elle associe un vécu affectif à des manifestations comportementales, physiologiques et hormonales.",
      ),
    ],
    overviewSource: emotionalSource(
      "1 et 8-9",
      "Problématique, définitions et conclusion générale",
      ["La situation d’apprentissage introductive est volontairement retirée du cours ; la situation d’évaluation officielle est conservée dans la mission finale."],
    ),
    sections: [
      {
        id: "manifestations",
        title: "Reconnaître les manifestations",
        summary: "Distinguer les signes observables des modifications internes et relier chaque manifestation au fonctionnement d’un organe.",
        conceptTitle: "Une émotion mobilise le comportement, les organes et les hormones",
        explanation: "La réaction émotionnelle produit simultanément des manifestations perceptibles et des modifications internes mesurables. Leur diversité montre qu’elle engage plusieurs organes effecteurs.",
        keyPoint: "Manifestation observable ou mesurable → organe effecteur → commande nerveuse et/ou hormonale.",
        example: "La pâleur traduit une vasoconstriction cutanée ; l’accélération du cœur et la hausse hormonale sont mesurables même si elles ne se voient pas directement.",
        bodyMarkdown: `
## 1. Deux façons de repérer une réaction émotionnelle

Le document distingue des manifestations **perceptibles** et **imperceptibles**. Pour éviter l’ambiguïté du mot « visible », retiens plutôt :

| Manifestations observables ou ressenties | Modifications internes mesurables |
|---|---|
| pâleur du visage, transpiration, rire, larmes, mutisme ou flot de paroles | augmentation de l’adrénaline et des glucocorticoïdes dans le sang |
| raidissement musculaire, frissons, battement de la semelle, sautillements, claquements de mains | variation des fréquences cardiaque et respiratoire, de la pression artérielle et de la glycémie |

Le cours source classe l’accélération cardiaque parmi les manifestations « visibles ». Elle peut être **ressentie** ou mesurée, mais elle n’est pas directement visible comme une pâleur ou un geste.

## 2. Relier le signe à son mécanisme

- La **pâleur** résulte d’une diminution du diamètre des vaisseaux sanguins sous-cutanés : c’est une vasoconstriction.
- La **transpiration**, les variations cardiaques et respiratoires sont commandées par le système nerveux autonome et renforcées par les hormones du stress.
- Le **rire**, les **pleurs**, le mutisme ou le flot de paroles mettent en jeu des réseaux cérébraux et des effecteurs musculaires.
- L’augmentation du taux d’une hormone vient de sa libération par une glande endocrine ; le sang la transporte vers des cellules cibles.

> **Erreur fréquente :** « invisible » ne veut pas dire « imaginaire ». Une concentration hormonale est réelle, mais il faut un dosage pour la mesurer.

> **Astuce mémoire — CERVEAU :** **C**œur, **E**xpression du visage, **R**espiration, **V**aisseaux, **E**ffecteurs musculaires, **A**drénaline, s**U**eur.
`,
        processTitle: "Lire les signes d’une émotion",
        processInstruction: "Sélectionne une famille pour relier le signe à son mécanisme.",
        process: [
          { label: "Stimulus", detail: "Une annonce, un danger ou une attente prend une valeur affective pour la personne." },
          { label: "Signes visibles", detail: "Expression du visage, posture, tremblements, sueur, rire, pleurs ou fuite." },
          { label: "Signes internes", detail: "Fréquences cardiaque et respiratoire, pression artérielle, glycémie et sécrétions hormonales se modifient." },
        ],
        interaction: {
          kind: "diagram",
          eyebrow: "Classement interactif",
          title: "Ce que l’on observe et ce que l’on mesure",
          instruction: "Choisis une famille de manifestations.",
          rootLabel: "Émotion",
          rootDetail: "Elle s’exprime à plusieurs niveaux en même temps.",
          nodes: [
            { id: "behavior", label: "Comportement", role: "Agir ou s’exprimer", detail: "Fuite, attaque, immobilité, sautillements, rires, pleurs, cris, mutisme ou flot de paroles.", group: "Perceptible" },
            { id: "somatic", label: "Somatique", role: "Muscles squelettiques", detail: "Raidissement musculaire, tremblements, frissons et changements de posture.", group: "Perceptible" },
            { id: "vegetative", label: "Végétatif", role: "Organes internes", detail: "Fréquence cardiaque, ventilation, diamètre des vaisseaux et transpiration se modifient.", group: "Mesurable" },
            { id: "hormonal", label: "Hormonal", role: "Messagers sanguins", detail: "Adrénaline, noradrénaline et glucocorticoïdes augmentent selon la phase du stress.", group: "Mesurable" },
          ],
          observation: "Une même réaction peut réunir les quatre familles ; les catégories servent à organiser l’analyse, pas à isoler les phénomènes.",
        },
        observation: "Un même événement peut produire des manifestations différentes selon la personne et la signification qu’elle lui donne.",
        check: choice(
          "Quelle manifestation exige un dosage biologique pour être objectivée ?",
          ["La pâleur du visage", "La concentration sanguine de cortisol", "Le rire", "Le claquement des mains"],
          1,
          "Le cortisol sanguin est une manifestation interne mesurée par dosage.",
        ),
        extraQuestions: [
          trueFalse("Exercice officiel 1, affirmation 1 — « Le rire est une manifestation imperceptible des réactions émotionnelles. »", false, "Le rire est directement perceptible.", "Exercice 1, affirmation 1 • page 10"),
          trueFalse("Exercice officiel 1, affirmation 2 — « La variation de certaines hormones est une manifestation perceptible des réactions émotionnelles. »", false, "Une variation hormonale doit être mesurée par dosage ; elle n’est pas directement perceptible.", "Exercice 1, affirmation 2 • page 10"),
          choice(
            "Exercice officiel 1, affirmation 3 — le PDF écrit : « Le pleur est un état manifesté par les pleurs. » Comment faut-il traiter cette phrase ?",
            ["Elle prouve que les pleurs sont invisibles", "Elle comporte une coquille : il faut lire « les pleurs se manifestent par les larmes »", "Elle signifie que le cortisol produit les larmes", "Elle classe les larmes parmi les hormones"],
            1,
            "La formulation du PDF est circulaire. Le cours de la page 2 donne la version cohérente : les pleurs se manifestent par les larmes.",
            "Exercice 1, affirmation 3 • page 10",
          ),
          trueFalse("Exercice officiel 1, affirmation 4 — « L’accélération du rythme cardiaque est provoquée par la production d’hormones. »", true, "Selon le cours, les catécholamines renforcent l’accélération cardiaque ; la commande orthosympathique intervient également.", "Exercice 1, affirmation 4 • page 10"),
          choice("Quelle manifestation traduit une vasoconstriction des vaisseaux sous-cutanés ?", ["La pâleur", "Le rire", "La hausse du cortisol", "Le mutisme"], 0, "La réduction du débit sanguin cutané rend le visage plus pâle."),
          choice("Pourquoi une hausse d’adrénaline est-elle dite imperceptible ?", ["Parce qu’elle n’existe pas", "Parce qu’elle est seulement supposée", "Parce qu’elle doit être mesurée dans le sang", "Parce qu’elle reste dans le cerveau"], 2, "Une concentration hormonale est objective mais nécessite un dosage."),
        ],
        distractors: ["Une émotion ne produit que des gestes visibles.", "Les réactions émotionnelles n’affectent jamais le fonctionnement des organes.", "Toute émotion provoque exactement les mêmes signes chez tous."],
        source: emotionalSource(
          "1-2 et 10",
          "Manifestations visibles et invisibles ; exercice de consolidation 1",
          [
            "Le tableau source range l’accélération cardiaque parmi les manifestations visibles ; le cours distingue ici ce qui est directement observable de ce qui est ressenti ou mesuré.",
            "L’affirmation 3 de l’exercice 1 répète « pleur/pleurs » ; elle est rétablie en « les pleurs se manifestent par les larmes ».",
          ],
        ),
      },
      {
        id: "causes-stressors",
        title: "Identifier les causes",
        summary: "Classer fidèlement les agents stressants dans les trois catégories du document officiel.",
        conceptTitle: "Des agents stressants de plusieurs natures",
        explanation: "Le cours distingue les contraintes d’ordre émotionnel, les agressions physiques et les modifications brutales de l’environnement. Plusieurs causes peuvent se combiner dans une situation réelle.",
        keyPoint: "Un stress peut venir d’une contrainte psychique, d’une agression physique ou d’une modification brutale de l’environnement.",
        example: "L’approche du BAC est une contrainte émotionnelle ; une hémorragie est une agression physique ; une déshydratation est une modification du milieu.",
        bodyMarkdown: `
## Les trois catégories du cours

| Catégorie | Exemples fidèles au document |
|---|---|
| **Contraintes d’ordre émotionnel** | peur violente, entassement dans une foule, situation nouvelle, approche d’un examen, colère, menaces, attente d’une intervention, images violentes, joie, attente d’un résultat |
| **Agressions physiques** | accident, traumatisme, hémorragie, douleur, exercice intense et prolongé, maladie infectieuse, intoxication |
| **Modifications brutales de l’environnement** | forte variation de température, diminution de l’apport en dioxygène, déshydratation |

### Comment classer sans se tromper ?

1. Demande-toi si la cause est surtout **interprétée psychiquement** : contrainte émotionnelle.
2. Vérifie si elle **atteint directement le corps** : agression physique.
3. Cherche une **variation rapide du milieu** : modification de l’environnement.

Une joie intense appartient bien aux contraintes émotionnelles : le mot « stress » ne désigne pas uniquement une émotion désagréable.

> **Astuce mémoire — CAME :** **C**ontrainte affective, **A**gression du corps, **M**odification de l’**E**nvironnement.

> **Erreur fréquente :** confondre la cause avec la manifestation. L’accident est une **cause** ; l’accélération cardiaque qui suit est une **manifestation**.
`,
        processTitle: "Classer les agents stressants",
        processInstruction: "Compare les trois familles de causes présentées dans le cours.",
        process: [
          { label: "Contrainte émotionnelle", shortLabel: "Émotion", detail: "Peur violente, inquiétude, colère, joie, menace ou attente d’un résultat." },
          { label: "Agression physique", shortLabel: "Agression", detail: "Accident, traumatisme, douleur, intoxication ou exercice intense et prolongé." },
          { label: "Environnement", detail: "Variation thermique, baisse d’apport en dioxygène ou déshydratation." },
        ],
        interaction: {
          kind: "diagram",
          eyebrow: "Tri interactif",
          title: "Les trois portes d’entrée du stress",
          instruction: "Sélectionne une catégorie, puis compare les exemples.",
          rootLabel: "Agent stressant",
          rootDetail: "Une situation qui oblige l’organisme à mobiliser une réponse d’adaptation.",
          nodes: [
            { id: "emotional", label: "Contrainte émotionnelle", role: "Valeur affective", detail: "Peur, colère, joie, attente, inquiétude, foule ou images menaçantes.", group: "Psychique" },
            { id: "physical", label: "Agression physique", role: "Atteinte du corps", detail: "Accident, traumatisme, hémorragie, douleur, effort intense, infection ou intoxication.", group: "Corporel" },
            { id: "environment", label: "Milieu brutalement modifié", role: "Déséquilibre", detail: "Variation thermique, manque de dioxygène ou déshydratation.", group: "Environnement" },
          ],
          observation: "Une cause n’est pas toujours isolée : un accident peut associer douleur physique et peur intense.",
        },
        observation: "Des causes différentes convergent vers des mécanismes communs d’alerte et d’adaptation.",
        check: choice("À quelle famille appartient l’attente d’un résultat d’examen ?", ["Aux agressions physiques", "Aux contraintes d’ordre émotionnel", "Aux modifications génétiques", "Aux réflexes médullaires"], 1, "L’attente reçoit une valeur affective et constitue une contrainte émotionnelle."),
        extraQuestions: [
          choice("Exercice officiel 2 — À quelle catégorie faut-il associer la déshydratation ?", ["Agression physique", "Contrainte émotionnelle", "Modification brutale de l’environnement"], 2, "La déshydratation modifie brutalement le milieu de l’organisme.", "Exercice 2 • page 10"),
          choice("Exercice officiel 2 — À quelle catégorie faut-il associer un accident ?", ["Agression physique", "Contrainte émotionnelle", "Modification brutale de l’environnement"], 0, "L’accident atteint directement l’intégrité du corps.", "Exercice 2 • page 10"),
          choice("Exercice officiel 2 — À quelle catégorie faut-il associer la joie ?", ["Agression physique", "Contrainte émotionnelle", "Modification brutale de l’environnement"], 1, "La joie est une émotion et peut déclencher une forte mobilisation de l’organisme.", "Exercice 2 • page 10"),
          choice("Une baisse brutale de l’apport en dioxygène appartient à quelle catégorie ?", ["Modification de l’environnement", "Contrainte émotionnelle", "Agression génétique", "Manifestation visible"], 0, "Le document la range parmi les modifications brutales de l’environnement."),
          choice("Quelle proposition distingue correctement cause et manifestation ?", ["La pâleur est une cause et l’accident une manifestation", "L’accident est une cause et la pâleur une manifestation", "Le cortisol est une cause environnementale", "Le rire est une agression physique"], 1, "La cause déclenche la réaction ; la manifestation est un effet observable ou mesurable."),
          trueFalse("Une joie intense peut déclencher une réaction de stress au sens biologique.", true, "Le document cite explicitement la joie parmi les contraintes d’ordre émotionnel."),
        ],
        distractors: ["Seules les blessures provoquent un stress.", "La joie ne peut jamais déclencher de réaction émotionnelle.", "Une baisse de dioxygène n’est pas un agent stressant."],
        source: emotionalSource("2-3 et 10", "Causes des réactions émotionnelles ; exercice de consolidation 2"),
      },
      {
        id: "nervous-regulation",
        title: "Comprendre la régulation nerveuse",
        summary: "Situer les principales structures limbiques et suivre la voie nerveuse jusqu’aux organes effecteurs.",
        conceptTitle: "Le système limbique évalue, l’hypothalamus coordonne",
        explanation: "Les aires sensorielles traitent l’information, le réseau limbique lui attribue une valeur affective et l’hypothalamus active les centres orthosympathiques ainsi que les réponses somatiques.",
        keyPoint: "Aires sensorielles → système limbique → hypothalamus → centres orthosympathiques → organes effecteurs.",
        example: "Devant un chien menaçant, l’information visuelle est évaluée comme dangereuse ; l’hypothalamus accélère alors le cœur et prépare les muscles à la fuite.",
        bodyMarkdown: `
## 1. Les structures à connaître

Le **système limbique** n’est pas un organe isolé : c’est un ensemble de régions cérébrales connectées. Le document situe notamment le cortex préfrontal et cingulaire, le thalamus, l’amygdale, l’hippocampe, le septum, l’hypothalamus et la substance réticulée.

| Structure | Rôle utile dans cette leçon |
|---|---|
| Aires corticales sensorielles | traitent les informations reçues par les organes des sens |
| Amygdale | participe à la détection de la valeur émotionnelle et à l’alerte |
| Hippocampe | apporte le contexte et la mémoire de la situation |
| Cortex préfrontal/cingulaire | contribue à l’évaluation et à la modulation de la réponse |
| Hypothalamus | coordonne les sorties autonomes, somatiques et hormonales |
| Centres bulbomédullaires orthosympathiques | transmettent rapidement la commande vers les organes |

## 2. Le trajet de la réponse nerveuse

**Récepteurs sensoriels → aires corticales → système limbique → hypothalamus → centres orthosympathiques → nerfs → organes effecteurs.**

La voie nerveuse est rapide. Elle modifie notamment le cœur, les bronches, les vaisseaux, les glandes sudoripares et les muscles.

> **Précision scientifique :** le document ancien associe abusivement la schizophrénie à l’agressivité. Cette formulation stigmatisante n’est pas retenue. Les observations de lésions montrent seulement que les réseaux limbiques et corticaux participent à la modulation émotionnelle.

> **Astuce mémoire — ALHO :** **A**ires sensorielles, système **L**imbique, **H**ypothalamus, **O**rganes.
`,
        processTitle: "Le circuit nerveux de l’émotion",
        processInstruction: "Fais défiler le trajet du message jusqu’à la réponse rapide.",
        process: [
          { label: "Perception", detail: "Les récepteurs et les aires corticales sensorielles traitent les informations du milieu." },
          { label: "Valeur affective", shortLabel: "Limbique", detail: "Le système limbique associe le stimulus à une émotion et choisit une réponse adaptée." },
          { label: "Commande", detail: "L’hypothalamus active les centres orthosympathiques bulbomédullaires." },
          { label: "Réponse", detail: "Cœur, poumons, vaisseaux et muscles réagissent rapidement." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Anatomie interactive",
          title: "Repérer le réseau limbique",
          instruction: "Appuie sur un numéro pour situer la structure et lire son rôle.",
          viewBox: "0 0 720 380",
          caption: "Figure originale redessinée d’après le document officiel ; vue sagittale simplifiée, sans valeur anatomique d’échelle.",
          shapes: [
            { shape: "path", d: "M95 210 C80 120 155 55 285 55 C425 55 535 120 545 225 C550 285 505 320 445 315 C400 312 370 285 345 265 C315 240 270 232 225 250 C155 278 108 258 95 210 Z", tone: "soft" },
            { shape: "path", d: "M125 195 C125 120 200 85 300 92 C390 98 465 145 472 218", tone: "outline" },
            { shape: "ellipse", cx: 292, cy: 164, rx: 88, ry: 48, tone: "outline" },
            { shape: "path", d: "M232 202 C250 170 315 170 350 200 C320 222 275 226 232 202 Z", tone: "accent" },
            { shape: "circle", cx: 222, cy: 218, r: 16, tone: "accent" },
            { shape: "circle", cx: 306, cy: 210, r: 18, tone: "fill" },
            { shape: "ellipse", cx: 383, cy: 272, rx: 58, ry: 35, rotate: -12, tone: "muted" },
            { shape: "path", d: "M330 224 C350 242 358 275 352 330", tone: "outline" },
            { shape: "text", x: 286, y: 36, content: "Coupe sagittale simplifiée", anchor: "middle" },
            { shape: "text", x: 566, y: 84, content: "Cortex", anchor: "start" },
            { shape: "line", x1: 470, y1: 102, x2: 558, y2: 82, tone: "muted" },
          ],
          hotspots: [
            { id: "cortex", number: 1, label: "Cortex préfrontal et cingulaire", detail: "Il traite le contexte et module la réponse émotionnelle.", x: 455, y: 95, highlight: [{ shape: "path", d: "M125 195 C125 120 200 85 300 92 C390 98 465 145 472 218", tone: "accent" }] },
            { id: "thalamus", number: 2, label: "Thalamus", detail: "Relais important des informations sensorielles vers les régions corticales et limbiques.", x: 292, y: 164, highlight: [{ shape: "ellipse", cx: 292, cy: 164, rx: 42, ry: 25, tone: "accent" }] },
            { id: "amygdala", number: 3, label: "Amygdale", detail: "Elle participe à la détection de la valeur émotionnelle du stimulus et à l’alerte.", x: 222, y: 218, highlight: [{ shape: "circle", cx: 222, cy: 218, r: 20, tone: "accent" }] },
            { id: "hippocampus", number: 4, label: "Hippocampe", detail: "Il associe le contexte et les souvenirs à l’événement perçu.", x: 335, y: 202, highlight: [{ shape: "path", d: "M232 202 C250 170 315 170 350 200 C320 222 275 226 232 202 Z", tone: "accent" }] },
            { id: "hypothalamus", number: 5, label: "Hypothalamus", detail: "Centre coordinateur : il déclenche la voie orthosympathique et la voie hormonale.", x: 306, y: 210, highlight: [{ shape: "circle", cx: 306, cy: 210, r: 22, tone: "accent" }] },
            { id: "reticular", number: 6, label: "Substance réticulée", detail: "Elle participe à l’éveil et aux réponses autonomes avec les centres bulbomédullaires.", x: 410, y: 278, highlight: [{ shape: "ellipse", cx: 383, cy: 272, rx: 58, ry: 35, rotate: -12, tone: "accent" }] },
          ],
          observation: "Le système limbique est un réseau ; l’hypothalamus en convertit l’évaluation en commandes corporelles coordonnées.",
        },
        observation: "Les lésions du système limbique modifient fortement les émotions, ce qui montre son rôle central.",
        check: choice("Quelle structure est mise en alerte par le système limbique ?", ["Le pancréas", "La moelle osseuse", "L’hypothalamus", "Le rein"], 2, "L’hypothalamus transforme l’évaluation émotionnelle en commandes nerveuses et hormonales."),
        extraQuestions: [
          choice("Quel enchaînement nerveux respecte le document 2 ?", ["Effecteurs → cortex → récepteurs", "Aires sensorielles → système limbique → hypothalamus → centres orthosympathiques", "Hypophyse → rétine → muscle", "Cœur → hippocampe → ADN"], 1, "L’information est perçue, évaluée, coordonnée puis transmise aux effecteurs.", "Document 2 • pages 4-5"),
          choice("Quelle structure apporte le contexte et la mémoire d’une situation ?", ["L’hippocampe", "La corticosurrénale", "Le foie", "La moelle osseuse"], 0, "L’hippocampe contribue à contextualiser l’événement."),
          choice("Quel est le rôle majeur de l’amygdale dans ce niveau ?", ["Produire l’ACTH", "Détecter la valeur émotionnelle et participer à l’alerte", "Sécréter l’adrénaline", "Contracter le muscle cardiaque"], 1, "L’amygdale est une composante du réseau d’évaluation émotionnelle."),
          trueFalse("La réponse nerveuse émotionnelle débute directement dans les muscles, sans traitement sensoriel.", false, "Les informations passent par les voies sensorielles et les centres cérébraux avant la commande des effecteurs."),
          choice("Pourquoi le système limbique ne doit-il pas être présenté comme un organe unique ?", ["Parce qu’il est une hormone", "Parce qu’il s’agit d’un réseau de régions connectées", "Parce qu’il se situe dans le cœur", "Parce qu’il n’existe que chez l’enfant"], 1, "Il regroupe plusieurs structures corticales et sous-corticales."),
          choice("Quelle voie explique la rapidité initiale de la réaction ?", ["La voie nerveuse orthosympathique", "La digestion intestinale", "La synthèse de nouvelles protéines", "La croissance osseuse"], 0, "Les messages nerveux atteignent rapidement les organes effecteurs."),
        ],
        distractors: ["Le cortex ne peut jamais moduler une émotion.", "Le système limbique commande directement la synthèse des protéines.", "La réponse nerveuse débute dans les muscles sans perception sensorielle."],
        source: emotionalSource(
          "3-5 et 11",
          "Cas pathologiques, système limbique et schéma de la régulation nerveuse",
          [
            "L’association entre schizophrénie et agressivité du document 1 est stigmatisante et scientifiquement abusive ; elle n’est pas reproduite.",
            "Les affirmations absolues sur l’hippocampe et le cortex sont reformulées comme des rôles de contextualisation et de modulation au sein d’un réseau.",
          ],
        ),
      },
      {
        id: "hormonal-regulation",
        title: "Relier adrénaline et cortisol",
        summary: "Comparer l’alarme catécholaminergique et l’axe CRH–ACTH–cortisol, puis expliquer leur rétrocontrôle.",
        conceptTitle: "Une alarme rapide et une adaptation prolongée",
        explanation: "La médullosurrénale libère rapidement adrénaline et noradrénaline. L’axe hypothalamo-hypophyso-surrénalien mobilise ensuite le cortisol, qui soutient l’adaptation et freine sa propre production par rétrocontrôle négatif.",
        keyPoint: "Alarme : orthosympathique → médullosurrénale → adrénaline ; adaptation : CRH → ACTH → cortisol → rétrocontrôle négatif.",
        example: "Une frayeur mobilise immédiatement l’adrénaline ; si la contrainte persiste, le cortisol contribue à maintenir l’approvisionnement énergétique.",
        bodyMarkdown: `
## 1. La phase d’alarme : les catécholamines

La stimulation orthosympathique de la **médullosurrénale** libère surtout l’adrénaline et la noradrénaline. Ces catécholamines :

- augmentent la fréquence et la force des contractions cardiaques ;
- dilatent les bronches et améliorent les échanges gazeux ;
- stimulent la glycogénolyse hépatique et augmentent le glucose sanguin ;
- redistribuent le sang vers les muscles.

Cette réponse prépare à la **lutte ou à la fuite**.

## 2. La phase d’ajustement : les glucocorticoïdes

L’axe hormonal suit une chaîne précise :

**Hypothalamus — CRH → antéhypophyse — ACTH → corticosurrénale — cortisol → cellules cibles.**

Le cortisol favorise notamment le catabolisme des protéines, la néoglucogenèse hépatique et la mobilisation des réserves lipidiques. Il aide à maintenir l’apport énergétique et la pression artérielle lorsque la contrainte dure.

## 3. Le rétrocontrôle

Quand le cortisol devient suffisant, il freine l’hypothalamus et l’antéhypophyse : c’est un **rétrocontrôle négatif**. La source indique « feed-back + ou − », mais l’axe décrit ici repose sur le retour négatif du cortisol.

> **Précision :** le tissu adipeux ne « libère pas des triglycérides » dans ce mécanisme ; la lipolyse libère surtout des acides gras et du glycérol.

> **Astuce mémoire — CAC :** **C**RH, **A**CTH, **C**ortisol. Les trois lettres suivent les trois étages : hypothalamus, hypophyse, corticosurrénale.
`,
        processTitle: "L’axe hormonal du stress",
        processInstruction: "Suis l’activation des glandes puis le retour de contrôle.",
        process: [
          { label: "Hypothalamus", detail: "Le stimulus stressant active l’hypothalamus, qui libère la CRH." },
          { label: "Hypophyse", detail: "La CRH stimule l’antéhypophyse, qui libère l’ACTH." },
          { label: "Corticosurrénale", shortLabel: "Surrénale", detail: "L’ACTH stimule la production de glucocorticoïdes, notamment le cortisol." },
          { label: "Adaptation et rétrocontrôle", shortLabel: "Adaptation", detail: "Le cortisol mobilise les ressources et freine l’axe lorsqu’il devient suffisant." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Schéma interactif",
          title: "L’axe hypothalamo-hypophyso-surrénalien",
          instruction: "Sélectionne chaque étage pour reconstruire la chaîne hormonale.",
          viewBox: "0 0 720 400",
          caption: "Figure originale redessinée d’après le document officiel ; les flèches de retour représentent le rétrocontrôle négatif du cortisol.",
          shapes: [
            { shape: "path", d: "M245 35 L475 35 L475 95 L245 95 Z", tone: "soft" },
            { shape: "text", x: 360, y: 72, content: "Hypothalamus", anchor: "middle" },
            { shape: "line", x1: 360, y1: 96, x2: 360, y2: 140, tone: "accent" },
            { shape: "path", d: "M352 130 L360 145 L368 130 Z", tone: "accent" },
            { shape: "text", x: 390, y: 125, content: "CRH", anchor: "start" },
            { shape: "path", d: "M245 145 L475 145 L475 205 L245 205 Z", tone: "soft" },
            { shape: "text", x: 360, y: 182, content: "Antéhypophyse", anchor: "middle" },
            { shape: "line", x1: 360, y1: 206, x2: 360, y2: 250, tone: "accent" },
            { shape: "path", d: "M352 240 L360 255 L368 240 Z", tone: "accent" },
            { shape: "text", x: 390, y: 235, content: "ACTH", anchor: "start" },
            { shape: "path", d: "M225 255 L495 255 L495 315 L225 315 Z", tone: "soft" },
            { shape: "text", x: 360, y: 292, content: "Corticosurrénale", anchor: "middle" },
            { shape: "line", x1: 360, y1: 316, x2: 360, y2: 355, tone: "accent" },
            { shape: "path", d: "M352 345 L360 360 L368 345 Z", tone: "accent" },
            { shape: "text", x: 360, y: 385, content: "Cortisol → adaptation", anchor: "middle" },
            { shape: "path", d: "M500 370 C620 350 620 72 485 66", tone: "muted" },
            { shape: "text", x: 625, y: 210, content: "rétrocontrôle −", anchor: "middle" },
          ],
          hotspots: [
            { id: "crh", number: 1, label: "Hypothalamus et CRH", detail: "Le stimulus stressant active l’hypothalamus, qui libère la corticolibérine CRH.", x: 230, y: 66, highlight: [{ shape: "path", d: "M245 35 L475 35 L475 95 L245 95 Z", tone: "accent" }] },
            { id: "acth", number: 2, label: "Antéhypophyse et ACTH", detail: "La CRH stimule l’antéhypophyse ; celle-ci libère l’ACTH dans le sang.", x: 230, y: 175, highlight: [{ shape: "path", d: "M245 145 L475 145 L475 205 L245 205 Z", tone: "accent" }] },
            { id: "adrenal", number: 3, label: "Corticosurrénale", detail: "L’ACTH stimule la zone corticale de la glande surrénale.", x: 210, y: 285, highlight: [{ shape: "path", d: "M225 255 L495 255 L495 315 L225 315 Z", tone: "accent" }] },
            { id: "cortisol", number: 4, label: "Cortisol", detail: "Le cortisol mobilise les ressources nécessaires à l’adaptation prolongée.", x: 480, y: 365, highlight: [{ shape: "line", x1: 360, y1: 316, x2: 360, y2: 355, tone: "accent" }] },
            { id: "feedback", number: 5, label: "Rétrocontrôle négatif", detail: "Le cortisol freine la CRH et l’ACTH lorsqu’il est suffisamment élevé.", x: 610, y: 270, highlight: [{ shape: "path", d: "M500 370 C620 350 620 72 485 66", tone: "accent" }] },
          ],
          observation: "CRH, ACTH et cortisol ne sont ni produits par le même organe ni libérés au même étage.",
        },
        observation: "Les systèmes nerveux et hormonal sont intégrés : l’un lance rapidement l’alerte, l’autre prolonge et ajuste la réponse.",
        check: choice("Quelle hormone de l’hypophyse stimule la corticosurrénale ?", ["La CRH", "Le cortisol", "L’ACTH", "L’adrénaline"], 2, "L’ACTH est libérée par l’antéhypophyse et stimule la corticosurrénale."),
        extraQuestions: [
          choice("Quelle partie de la surrénale libère les catécholamines ?", ["La corticosurrénale", "La médullosurrénale", "L’antéhypophyse", "L’hippocampe"], 1, "La médullosurrénale libère l’adrénaline et la noradrénaline."),
          choice("Quel effet correspond à l’adrénaline pendant l’alarme ?", ["La diminution de la ventilation", "La redistribution du sang vers les muscles", "L’arrêt de la glycogénolyse", "La baisse de la force cardiaque"], 1, "L’adrénaline prépare rapidement l’organisme à l’action."),
          choice("Quel est l’ordre exact de l’axe hormonal ?", ["ACTH → CRH → cortisol", "Cortisol → adrénaline → CRH", "CRH → ACTH → cortisol", "Adrénaline → insuline → ACTH"], 2, "CRH vient de l’hypothalamus, ACTH de l’hypophyse et cortisol de la corticosurrénale."),
          trueFalse("Le cortisol exerce normalement un rétrocontrôle négatif sur l’hypothalamus et l’hypophyse.", true, "Il freine la production de CRH et d’ACTH lorsque sa concentration est suffisante."),
          choice("Quelle différence oppose médullosurrénale et corticosurrénale ?", ["Elles libèrent exactement les mêmes hormones", "La médulla libère les catécholamines ; le cortex libère les glucocorticoïdes", "La médulla produit la CRH ; le cortex produit l’ACTH", "Aucune des deux n’est endocrine"], 1, "Les deux zones de la surrénale ont des sécrétions distinctes."),
          choice("Quel mécanisme augmente le glucose sanguin pendant l’alarme ?", ["La glycogénolyse hépatique", "La mitose", "La filtration rénale", "La photosynthèse"], 0, "La glycogénolyse transforme le glycogène hépatique en glucose disponible."),
          choice("Que libère surtout la lipolyse du tissu adipeux ?", ["Des acides gras et du glycérol", "De l’ACTH", "Des globules rouges", "Du dioxygène"], 0, "Cette précision corrige la formulation « libération de triglycérides » du document."),
          choice("Quel mot permet de mémoriser l’ordre CRH–ACTH–cortisol ?", ["ALHO", "CAME", "CAC", "MCR"], 2, "CAC suit les trois étages de l’axe hormonal."),
        ],
        distractors: ["Le cortisol est libéré par la médullosurrénale pendant la seule phase d’alarme.", "La CRH est produite par les muscles.", "Le rétrocontrôle augmente sans limite la sécrétion hormonale."],
        source: emotionalSource(
          "5-8 et 12",
          "Expériences hormonales, catécholamines, glucocorticoïdes et axe CRH–ACTH–cortisol",
          [
            "« Effets orhosympathiques » est corrigé en « effets orthosympathiques ».",
            "« Coricotropin » est corrigé en « Corticotropin » et la CRH est nommée corticolibérine.",
            "Le retour du cortisol est précisé comme un rétrocontrôle négatif, et non « + ou − ».",
            "La lipolyse libère surtout des acides gras et du glycérol, pas des triglycérides circulants comme l’indique le texte.",
          ],
        ),
      },
    ],
    mission: {
      title: "Exploiter la situation d’évaluation officielle sur le stress",
      scenario: "Un texte décrit l’accélération du cœur, le malaise, l’élévation de la tension artérielle, la respiration plus importante, la vasoconstriction et la hausse du cortisol provoquées par une vexation ou une mauvaise nouvelle familiale.",
      problem: "Comment identifier les manifestations et leurs causes, puis expliquer la régulation neuro-hormonale décrite ?",
      bodyMarkdown: `
## Document d’évaluation

Le texte officiel explique que le stress peut être signalé par un cœur qui s’accélère ou un malaise. Une vexation professionnelle ou une mauvaise nouvelle familiale peut augmenter les hormones du stress et la tension artérielle. Quand le cortisol augmente, le rythme cardiaque s’élève, la respiration devient plus importante et les vaisseaux sanguins se resserrent.

## Méthode de réponse aux quatre consignes

### 1. Identifier les manifestations

Relève sans expliquer : accélération du cœur, malaise, hausse de la tension artérielle, respiration plus importante, vasoconstriction et augmentation du cortisol.

### 2. Déterminer les causes

La vexation et la mauvaise nouvelle sont des **contraintes d’ordre émotionnel**.

### 3. Expliquer la régulation nerveuse

Les informations sensorielles sont traitées par les aires corticales et le réseau limbique. Le système limbique alerte l’hypothalamus, qui active les centres orthosympathiques ; ceux-ci commandent rapidement le cœur, les bronches, les vaisseaux et la médullosurrénale.

### 4. Réaliser le schéma hormonal

**Stimulus → système limbique/hypothalamus — CRH → antéhypophyse — ACTH → corticosurrénale — cortisol → cellules cibles**, puis **rétrocontrôle négatif** vers l’hypothalamus et l’hypophyse.

## L’intégration neuro-hormonale démontrée par le cours

Les expériences sur le chat montrent qu’un stress augmente le cortisol, qu’une stimulation du système limbique ou de l’hypothalamus déclenche des effets orthosympathiques et une sécrétion d’adrénaline, et que le nerf splanchnique relie la commande nerveuse à la médullosurrénale. Les deux systèmes sont donc coordonnés, non indépendants.

> **Davy te conseille :** dans une situation d’évaluation, écris toujours quatre sous-titres correspondant aux quatre verbes de consigne. Tu évites ainsi d’oublier une partie de la réponse.
`,
      investigation: [
        { label: "Identifier", detail: "Relever les manifestations sans les mélanger avec leurs causes." },
        { label: "Classer", detail: "La vexation et la mauvaise nouvelle sont des contraintes émotionnelles." },
        { label: "Expliquer", detail: "Relier système limbique, hypothalamus, orthosympathique et organes." },
        { label: "Schématiser", detail: "Tracer CRH → ACTH → cortisol et le rétrocontrôle négatif." },
      ],
      modelAnswer: "La contrainte émotionnelle est évaluée par le cortex et le système limbique. L’hypothalamus déclenche la réponse orthosympathique rapide et l’axe CRH–ACTH–cortisol ; le cortisol entretient l’adaptation puis freine l’axe par rétrocontrôle négatif.",
      interaction: {
        kind: "diagram",
        eyebrow: "Synthèse interactive",
        title: "Une seule commande, deux voies coordonnées",
        instruction: "Explore les branches et reconstruis le bilan complet.",
        rootLabel: "Système limbique + hypothalamus",
        rootDetail: "Le couple intégrateur transforme l’évaluation du stimulus en réponses coordonnées.",
        nodes: [
          { id: "sympathetic", label: "Voie nerveuse", role: "Très rapide", detail: "Centres orthosympathiques → nerfs → cœur, bronches, vaisseaux, muscles et médullosurrénale.", group: "Alarme" },
          { id: "catecholamines", label: "Catécholamines", role: "Adrénaline/noradrénaline", detail: "Elles amplifient la mobilisation immédiate : fréquence cardiaque, ventilation, glucose et débit musculaire.", group: "Alarme" },
          { id: "hpa", label: "Axe CRH–ACTH–cortisol", role: "Plus lent et durable", detail: "Il maintient la disponibilité énergétique pendant l’ajustement.", group: "Adaptation" },
          { id: "feedback", label: "Rétrocontrôle", role: "Freiner l’axe", detail: "Le cortisol limite la CRH et l’ACTH quand la réponse devient suffisante.", group: "Retour à l’équilibre" },
          { id: "decision", label: "Décision adaptée", role: "Comportement", detail: "Identifier le problème, comparer les options, demander conseil, choisir et appliquer une décision évitant les conduites à risque.", group: "Retour à l’équilibre" },
        ],
        observation: "L’adrénaline et le cortisol n’ont ni la même origine ni la même dynamique, mais participent à une réponse cohérente.",
      },
      questions: [
        choice("Situation officielle — Quelle manifestation est explicitement évoquée ?", ["La baisse du rythme cardiaque", "L’accélération du rythme cardiaque", "La croissance osseuse", "La diminution du cortisol"], 1, "Le texte cite l’accélération des battements du cœur.", "Situation d’évaluation, consigne 1 • page 10"),
        choice("Situation officielle — Quelle est la nature de la vexation et de la mauvaise nouvelle familiale ?", ["Des modifications génétiques", "Des agressions infectieuses", "Des contraintes d’ordre émotionnel", "Des réflexes innés"], 2, "Ces événements reçoivent une valeur affective et constituent des contraintes émotionnelles.", "Situation d’évaluation, consigne 2 • page 10"),
        choice("Situation officielle — Quel enchaînement nerveux explique correctement la réponse ?", ["Muscles → cœur → cortex", "Aires sensorielles → système limbique → hypothalamus → centres orthosympathiques", "Hypophyse → rétine → moelle osseuse", "Cortisol → ADN → système limbique"], 1, "Le système limbique alerte l’hypothalamus, puis la voie orthosympathique commande les effecteurs.", "Situation d’évaluation, consigne 3 • page 10"),
      ],
      extraQuestions: [
        choice("Situation officielle — Quel schéma répond à la quatrième consigne ?", ["CRH → hypothalamus → ACTH → hypophyse", "Hypothalamus — CRH → hypophyse — ACTH → corticosurrénale → cortisol", "Cortisol → adrénaline → insuline", "Médullosurrénale → CRH → cortex"], 1, "C’est l’ordre exact de l’axe hormonal du stress.", "Situation d’évaluation, consigne 4 • page 10"),
        choice("Pourquoi parle-t-on d’intégration neuro-hormonale ?", ["Parce que les deux systèmes sont indépendants", "Parce que l’hypothalamus coordonne une voie nerveuse et une voie hormonale cohérentes", "Parce que toutes les hormones sont des neurones", "Parce que le cœur fabrique l’ACTH"], 1, "Le système limbique et l’hypothalamus assurent la cohérence des réponses."),
        choice("Que montre la stimulation du nerf splanchnique dans le document 4 ?", ["Une sécrétion médullosurrénalienne de catécholamines", "Une production de CRH par le foie", "Une disparition du système limbique", "Une baisse définitive de toute hormone"], 0, "Le nerf splanchnique établit le lien nerveux avec la médullosurrénale."),
        trueFalse("Chez les chats du document 4, le cortisol augmente en présence du stimulus stressant et baisse après sa disparition.", true, "Cette variation montre que la réponse hormonale dépend de la situation stressante."),
        choice("Quel élément assure le retour de l’axe hormonal vers l’équilibre ?", ["Le rétrocontrôle négatif du cortisol", "L’augmentation illimitée de l’ACTH", "La disparition du sang", "Le blocage permanent du cortex"], 0, "Le cortisol freine sa chaîne de commande lorsqu’il devient suffisant."),
        choice("Quelle réponse résume le mieux la mission ?", ["Une émotion est uniquement un sentiment", "Une contrainte est évaluée par le cerveau, puis des voies nerveuses et hormonales coordonnées mobilisent l’organisme avant le retour à l’équilibre", "Le cortisol agit avant toute perception", "Les organes répondent sans commande"], 1, "Cette réponse relie manifestation, cause, mécanisme et adaptation."),
      ],
      source: emotionalSource(
        "7-10",
        "Intégration neuro-hormonale, prise de décision, situation d’évaluation et consolidation",
        [
          "Dans le texte d’évaluation, « les hormones comme le cortisol inonde » est corrigé en « inondent ».",
          "Le schéma de synthèse conserve uniquement les voies utiles à la leçon ; la branche thyroïdienne du document 5 n’est pas nécessaire à la réponse demandée.",
        ],
      ),
    },
  },
  {
    id: "terminale-svt-l2-brain-activity",
    chapterNumber: 2,
    themeNumber: 1,
    themeTitle: "Communication et régulation chez l’Homme",
    title: "L’activité cérébrale chez l’Homme",
    description: "Localiser les principales aires cérébrales et expliquer la motricité volontaire ainsi que les mécanismes de la mémoire.",
    centralQuestion: "Comment les aires cérébrales produisent-elles un mouvement volontaire et un souvenir ?",
    memorySentence: "Aires spécialisées → préparation, programmation, exécution du mouvement ; acquisition, consolidation, restitution du souvenir.",
    overviewBodyMarkdown: `
## Le cerveau ne travaille pas en blocs isolés

Le cerveau influence le comportement grâce à des **aires spécialisées**, mais une fonction complexe résulte toujours de la coopération de plusieurs réseaux. Voir, reconnaître, décider, parler, bouger et se souvenir mobilisent des régions différentes qui échangent des messages nerveux.

| Problème biologique | Idée essentielle |
|---|---|
| Où sont les principales aires ? | Les quatre lobes portent des aires sensorielles, motrices et associatives. |
| Comment naît un mouvement volontaire ? | Le mouvement est préparé, programmé, décidé, exécuté puis ajusté. |
| Comment se forme un souvenir ? | L’information est acquise, consolidée et stockée, puis restituée. |

### Manifestations de l’activité cérébrale

Le langage, la mémoire, l’affectivité, la vigilance, la sensibilité, le désir, la conscience et la motricité volontaire sont des manifestations de l’activité cérébrale citées par le cours.

> **Astuce mémoire - APM :** **A**ires, **P**rogramme moteur, **M**émoire. Ces trois mots donnent le plan de la leçon.

> **Précision importante :** une aire n’agit jamais « toute seule ». Le vocabulaire scolaire aide à localiser les fonctions dominantes, mais les comportements reposent sur des réseaux distribués.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte de la leçon",
      title: "De l’information au comportement",
      instruction: "Ouvre chaque carte pour découvrir sa place dans l’activité cérébrale.",
      rootLabel: "Activité cérébrale",
      rootDetail: "Le cerveau reçoit des informations, les interprète, prépare une réponse et peut en garder une trace.",
      nodes: [
        { id: "sensory-input", label: "1. Percevoir", role: "Entrées sensorielles", detail: "Les récepteurs et les voies afférentes transmettent au cerveau les informations externes et internes.", group: "Entrées" },
        { id: "association", label: "2. Interpréter", role: "Aires associatives", detail: "Elles relient les sensations aux connaissances, à l’espace, à l’affectivité et aux buts du sujet.", group: "Intégration" },
        { id: "motor-plan", label: "3. Préparer l’action", role: "Réseaux moteurs", detail: "Ils sélectionnent le geste, sa direction, sa force, sa durée et la posture nécessaire.", group: "Intégration" },
        { id: "execution", label: "4. Exécuter", role: "Voie motrice", detail: "Le cortex moteur commande la moelle épinière et les motoneurones qui activent les muscles.", group: "Sorties" },
        { id: "memory", label: "5. Mémoriser", role: "Hippocampe et cortex", detail: "L’expérience peut être encodée, consolidée puis réactivée lors du rappel.", group: "Apprentissage" },
      ],
      observation: "Le même stimulus peut alimenter une décision motrice et une mémoire : perception, action et apprentissage sont liés.",
    },
    overviewExtraQuestions: [
      choice("Quel moyen mnémotechnique résume le parcours ?", ["MCR : manifestation, cause, régulation", "APM : aires, programme moteur, mémoire", "ADN : audition, décision, neurone", "IRM : intention, réaction, muscle"], 1, "APM rappelle les trois blocs de cette leçon."),
      choice("Quelle proposition décrit correctement une fonction complexe ?", ["Elle dépend toujours d’une seule aire isolée", "Elle résulte de la coopération de plusieurs réseaux spécialisés", "Elle est commandée uniquement par les muscles", "Elle ne dépend jamais des informations sensorielles"], 1, "Les aires ont des spécialisations dominantes, mais elles coopèrent en réseaux."),
      trueFalse("La mémoire et la motricité volontaire sont deux manifestations de l’activité cérébrale.", true, "Elles figurent explicitement dans la liste donnée par le cours, avec le langage, la sensibilité et la conscience."),
      choice("Quel ordre résume le traitement d’une information qui conduit à un geste ?", ["Muscle → récepteur → cortex", "Percevoir → interpréter → préparer → exécuter", "Exécuter → décider → percevoir", "Mémoriser → digérer → respirer"], 1, "Le cerveau traite d’abord l’information avant de préparer et d’exécuter une réponse."),
    ],
    overviewSource: brainActivitySource(
      "1-3 et 8",
      "Problématique, manifestations de l’activité cérébrale et conclusion générale",
      [
        "La situation d’apprentissage introductive est retirée du niveau ; la situation d’évaluation officielle est conservée dans la mission finale.",
        "La localisation scolaire par aires est conservée, mais présentée comme une organisation en réseaux coopérants plutôt que comme des centres totalement isolés.",
      ],
    ),
    sections: [
      {
        id: "cerebral-areas",
        title: "Localiser les aires cérébrales",
        summary: "Associer lobes frontal, pariétal, temporal et occipital aux fonctions motrices, sensitives, auditives et visuelles.",
        conceptTitle: "Le cortex est organisé en aires spécialisées et associées",
        explanation: "En avant du sillon de Rolando, le lobe frontal contient l’aire motrice et des aires prémotrices. En arrière se trouvent les aires de la sensibilité. Le lobe occipital porte les aires visuelles ; le temporal, les aires auditives. Des aires d’association permettent de reconnaître et de donner du sens aux sensations.",
        keyPoint: "Aire primaire = reçoit ou commande ; aire d’association = interprète et coordonne l’information.",
        example: "Voir un visage mobilise l’aire visuelle ; le reconnaître nécessite aussi l’aire psycho-visuelle.",
        bodyMarkdown: `
## 1. Les quatre lobes du cortex cérébral

| Lobe | Aires dominantes citées dans le document | Fonctions principales |
|---|---|---|
| **Frontal** | aire motrice, aire motrice supplémentaire, aire prémotrice, aire préfrontale, articulation du langage | commander, préparer et coordonner les mouvements ; initier l’action ; produire le langage articulé |
| **Pariétal** | sensibilité générale et aire psycho-sensorielle | recevoir les sensations du corps et les intégrer dans une représentation de l’espace |
| **Temporal** | aire auditive et aire psycho-auditive | entendre et reconnaître/interpréter les sons ; participer à la compréhension du langage |
| **Occipital** | aire visuelle et aire psycho-visuelle | recevoir l’information visuelle puis reconnaître les objets, les formes et les mots écrits |

Le **sillon de Rolando**, aujourd’hui appelé **sillon central**, sépare approximativement l’aire motrice primaire, en avant, de l’aire somesthésique primaire, en arrière.

## 2. Aire primaire et aire associative

- Une aire **primaire** reçoit une information sensorielle élémentaire ou émet une commande motrice.
- Une aire **associative** met cette information en relation avec d’autres données : mémoire, langage, position du corps, signification de l’objet ou but de l’action.

Voir n’est donc pas encore reconnaître. Entendre un son n’est pas encore comprendre un mot.

## 3. Les fonctions sont distribuées

Le schéma officiel est une carte simplifiée utile pour débuter. Le langage, la reconnaissance d’un visage ou un geste précis font intervenir des réseaux qui dépassent les limites d’une seule « aire ». Par exemple, la production du langage mobilise surtout un réseau frontal gauche, mais aussi des régions temporales et pariétales reliées entre elles.

> **Erreur fréquente :** placer l’aire auditive dans le lobe frontal. Elle se situe principalement dans le lobe temporal.

> **Astuce mémoire - FAPO :** **F**rontal = **A**ction et parole ; **P**ariétal = position du corps ; **O**ccipital = œil. Le **Temporal** traite notamment les sons.
`,
        processTitle: "Du lobe à la fonction",
        processInstruction: "Explore les principales régions représentées dans le schéma du cours.",
        process: [
          { label: "Frontal", detail: "Aire motrice, cortex prémoteur, langage articulé et fonctions de préparation." },
          { label: "Pariétal", detail: "Sensibilité générale et intégration de la position du corps dans l’espace." },
          { label: "Temporal", detail: "Audition, compréhension des sons et mémoire avec les structures temporales internes." },
          { label: "Occipital", detail: "Vision primaire et reconnaissance visuelle grâce aux aires associatives." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Schéma interactif",
          title: "Les lobes et les principales aires cérébrales",
          instruction: "Sélectionne un repère pour localiser le lobe et relier sa position à ses fonctions.",
          viewBox: "0 0 640 390",
          caption: "Figure originale redessinée d’après le document officiel ; vue latérale simplifiée de l’hémisphère gauche.",
          shapes: [
            { shape: "path", d: "M95 220 C72 142 128 67 238 48 C362 26 492 73 536 168 C564 230 522 292 427 318 C363 337 311 326 269 315 C211 345 124 311 95 220 Z", tone: "soft" },
            { shape: "path", d: "M292 55 C270 112 276 178 289 247", tone: "outline" },
            { shape: "path", d: "M408 75 C430 135 424 207 397 277", tone: "outline" },
            { shape: "path", d: "M175 225 C254 205 334 220 400 280", tone: "outline" },
            { shape: "ellipse", cx: 421, cy: 308, rx: 78, ry: 38, rotate: -9, tone: "muted" },
            { shape: "text", x: 286, y: 28, content: "avant", anchor: "middle" },
            { shape: "text", x: 525, y: 47, content: "arrière", anchor: "middle" },
            { shape: "text", x: 304, y: 369, content: "Vue latérale - le sillon central sépare motricité et sensibilité", anchor: "middle" },
          ],
          hotspots: [
            { id: "frontal", number: 1, label: "Lobe frontal", detail: "En avant du sillon central : cortex moteur, prémoteur, préfrontal et réseau frontal de l’articulation du langage.", x: 175, y: 126, highlight: [{ shape: "path", d: "M95 220 C72 142 128 67 238 48 C264 44 281 48 292 55 C270 112 276 178 289 247 C244 220 194 215 175 225 C132 240 105 239 95 220 Z", tone: "accent" }] },
            { id: "parietal", number: 2, label: "Lobe pariétal", detail: "En arrière du sillon central et au-dessus du temporal : sensibilité générale et intégration spatiale.", x: 342, y: 105, highlight: [{ shape: "path", d: "M292 55 C332 41 379 46 408 75 C430 135 424 207 397 277 C357 244 325 239 289 247 C276 178 270 112 292 55 Z", tone: "accent" }] },
            { id: "occipital", number: 3, label: "Lobe occipital", detail: "À l’arrière : aire visuelle primaire et régions associatives nécessaires à la reconnaissance visuelle.", x: 489, y: 176, highlight: [{ shape: "path", d: "M408 75 C474 89 519 125 536 168 C557 216 527 267 465 297 C443 283 420 275 397 277 C424 207 430 135 408 75 Z", tone: "accent" }] },
            { id: "temporal", number: 4, label: "Lobe temporal", detail: "Sous les régions frontale et pariétale : audition, compréhension des sons et structures temporales internes liées à la mémoire.", x: 307, y: 279, highlight: [{ shape: "path", d: "M175 225 C254 205 334 220 400 280 C420 294 440 300 465 297 C429 324 374 333 310 324 C269 317 233 326 202 317 C176 299 164 258 175 225 Z", tone: "accent" }] },
            { id: "central-sulcus", number: 5, label: "Sillon central", detail: "Repère anatomique : motricité primaire en avant, sensibilité générale en arrière.", x: 287, y: 178, highlight: [{ shape: "path", d: "M292 55 C270 112 276 178 289 247", tone: "accent" }] },
            { id: "cerebellum", number: 6, label: "Cervelet", detail: "Il ne constitue pas un lobe cérébral ; il ajuste la coordination, la précision et l’équilibre du mouvement.", x: 424, y: 309, highlight: [{ shape: "ellipse", cx: 421, cy: 308, rx: 78, ry: 38, rotate: -9, tone: "accent" }] },
          ],
          observation: "Le sillon central est le repère le plus utile : il sépare les territoires corticaux moteurs et somesthésiques primaires.",
        },
        observation: "Une lésion peut conserver la sensation brute tout en supprimant sa reconnaissance, si l’aire associative est atteinte.",
        check: q("Dans quel lobe se trouve principalement l’aire visuelle ?", "Le lobe occipital", "Le lobe frontal", "Le lobe temporal", "Le cervelet"),
        extraQuestions: [
          trueFalse("Activité officielle - Le langage humain est contrôlé uniquement par les aires auditives.", false, "L’audition participe à la compréhension, mais le langage mobilise notamment des réseaux frontaux, temporaux et pariétaux.", "Activité d’application 1, affirmation 1 • page 3"),
          trueFalse("Activité officielle - Chaque aire cérébrale peut commander n’importe quelle fonction de l’organisme.", false, "Les aires possèdent des spécialisations dominantes et coopèrent dans des réseaux.", "Activité d’application 1, affirmation 2 • page 3"),
          trueFalse("Activité officielle - La mémoire est une manifestation de l’activité cérébrale.", true, "La mémoire dépend notamment de l’hippocampe, du cortex et de leurs réseaux.", "Activité d’application 1, affirmation 3 • page 3"),
          choice("Activité officielle - À quel lobe associe-t-on l’aire motrice et l’aire prémotrice ?", ["Lobe temporal", "Lobe frontal", "Lobe occipital", "Lobe pariétal"], 1, "Les territoires moteurs cités sont situés dans le lobe frontal.", "Autres exercices, activité 1 • page 10"),
          choice("Activité officielle - Quel lobe porte principalement l’aire visuelle ?", ["Lobe pariétal", "Lobe temporal", "Lobe frontal", "Lobe occipital"], 3, "L’aire visuelle primaire occupe le lobe occipital.", "Autres exercices, activité 1 • page 10"),
          choice("Activité officielle - Quel lobe reçoit principalement la sensibilité générale ?", ["Lobe pariétal", "Lobe frontal", "Lobe occipital", "Cervelet"], 0, "L’aire somesthésique primaire se situe dans le lobe pariétal, en arrière du sillon central.", "Autres exercices, activité 1 • page 10"),
          choice("Dans le tableau officiel, quelle association doit être corrigée ?", ["Occipital - aire visuelle", "Pariétal - sensibilité générale", "Temporal - articulation du langage parlé", "Frontal - aire motrice"], 2, "L’articulation du langage est principalement frontale ; le temporal est surtout associé à l’audition et à la compréhension. L’exercice source ne propose donc pas une correspondance temporelle correcte.", "Autres exercices, activité 1 • page 10"),
          trueFalse("Activité officielle - L’aire auditive est localisée dans le lobe frontal.", false, "Elle se situe principalement dans le lobe temporal.", "Autres exercices, activité 2, affirmation 1 • page 10"),
          trueFalse("Activité officielle - L’aire motrice est localisée dans le lobe temporal.", false, "Elle est située dans le lobe frontal, en avant du sillon central.", "Autres exercices, activité 2, affirmation 2 • page 10"),
          trueFalse("Activité officielle - L’aire prémotrice est localisée dans le lobe frontal.", true, "Le cortex prémoteur est frontal et participe à la préparation du mouvement.", "Autres exercices, activité 2, affirmation 3 • page 10"),
          trueFalse("Activité officielle - L’aire visuelle se trouve en arrière du sillon central.", true, "Elle est située dans le lobe occipital, donc nettement en arrière du sillon central.", "Autres exercices, activité 2, affirmation 4 • page 10"),
          trueFalse("Activité officielle - L’aire de la sensibilité générale se trouve en avant du sillon central.", false, "Elle est située dans le lobe pariétal, juste en arrière du sillon central.", "Autres exercices, activité 2, affirmation 5 • page 10"),
        ],
        distractors: ["Toutes les fonctions cérébrales occupent une seule aire.", "L’aire psycho-visuelle commande directement les muscles.", "Le lobe temporal est le centre principal de la vision."],
        source: brainActivitySource(
          "1-3 et 9-10",
          "Lobes, principales aires cérébrales et activités d’application",
          [
            "Le sillon de Rolando est présenté avec son nom moderne, sillon central.",
            "Le corrigé de l’activité 1 associe le lobe temporal à l’aire du langage parlé, alors que le même cours place l’articulation et la psychomotricité dans le lobe frontal ; l’incohérence est signalée et corrigée.",
            "La liste des aires de sensibilité de la situation d’évaluation répète deux fois l’aire psycho-visuelle ; le doublon n’est pas reproduit.",
            "Les localisations classiques sont conservées comme repères scolaires tout en précisant que langage et reconnaissance reposent sur des réseaux distribués.",
          ],
        ),
      },
      {
        id: "movement-preparation",
        title: "Préparer et programmer le mouvement",
        summary: "Relier intention, informations sensorielles, posture et programme moteur avant l’action.",
        conceptTitle: "Un mouvement volontaire est planifié avant d’être exécuté",
        explanation: "Le cerveau utilise les stimuli internes et externes pour définir le but. L’aire motrice supplémentaire organise les actes complexes, le cortex prémoteur prépare la posture et le cortex pariétal postérieur situe l’objet dans l’espace. Les noyaux sous-corticaux et le cervelet participent à la coordination.",
        keyPoint: "Préparer = choisir le but ; programmer = préciser direction, distance, force et posture.",
        example: "Pour saisir un verre, le cerveau évalue sa position et sa distance, prépare l’épaule et la main, puis dose la force des doigts.",
        bodyMarkdown: `
## 1. Un geste volontaire commence avant la contraction

Saisir un objet est volontaire parce que le mouvement succède à une **intention**. Avant que la main ne bouge, plusieurs régions analysent la situation et construisent un programme moteur. Le cours distingue deux étapes préparatoires.

### Phase préparatoire

Le sujet localise l’objet grâce aux informations sensorielles, le plus souvent visuelles :

1. l’aire visuelle primaire reçoit l’information ;
2. les régions visuelles associatives l’interprètent ;
3. les aires d’association relient la position de l’objet au but du sujet ;
4. des régions sous-corticales, le système limbique et le cervelet contribuent à l’état motivationnel, à l’expérience acquise et à la coordination.

Un **potentiel de préparation** peut être enregistré avant le début du mouvement. Le document indique environ **0,8 seconde** avant le geste : l’activité cérébrale précède donc l’action visible.

### Phase de programmation

Le système nerveux central précise les paramètres du geste :

| Paramètre | Question résolue par le cerveau |
|---|---|
| latéralisation | quel bras ou quelle main utiliser ? |
| distance | jusqu’où étendre le membre ? |
| direction | quelle trajectoire suivre ? |
| force | quelle intensité appliquer à l’objet ? |
| posture | comment stabiliser le corps pendant l’action ? |

- L’**aire motrice supplémentaire** organise notamment les séquences complexes et souvent bilatérales.
- Le **cortex prémoteur** prépare la posture et les gestes guidés par les informations sensorielles.
- Le **cortex pariétal postérieur** traite la représentation de l’espace et la relation corps-objet.
- Les **noyaux gris centraux** participent à la sélection et à l’initiation du programme ; le **cervelet** contribue à sa coordination et à son ajustement.

> **Astuce mémoire - LDFP :** **L**atéralisation, **D**istance, **F**orce, **P**osture. Ajoute la direction entre distance et force lorsque tu rédiges.

> **Précision :** l’hypothalamus renseigne et régule surtout l’état interne et les comportements motivés ; ce n’est pas le centre qui dessine à lui seul le programme précis de la main.
`,
        processTitle: "Avant le mouvement",
        processInstruction: "Observe les décisions successives qui transforment une intention en programme moteur.",
        process: [
          { label: "Intention", detail: "Le sujet fixe un but à partir de ses besoins et des informations du milieu." },
          { label: "Repérage", detail: "Les aires sensitives et pariétales évaluent position, direction et distance." },
          { label: "Programme", detail: "Les aires supplémentaire et prémotrice préparent posture, force et succession des gestes." },
        ],
        interaction: {
          kind: "diagram",
          eyebrow: "Préparation interactive",
          title: "Qui prépare quoi avant le mouvement ?",
          instruction: "Sélectionne chaque structure pour distinguer information, intention et programme.",
          rootLabel: "Intention de saisir",
          rootDetail: "Le but du sujet est transformé en un programme moteur adapté à l’objet et au corps.",
          nodes: [
            { id: "visual", label: "Cortex visuel", role: "Localiser l’objet", detail: "Il reçoit puis analyse les caractéristiques visuelles avant que les aires associatives ne donnent sens et position à l’objet.", group: "Informations" },
            { id: "parietal", label: "Pariétal postérieur", role: "Corps dans l’espace", detail: "Il combine vision et informations corporelles afin d’estimer direction, distance et orientation.", group: "Informations" },
            { id: "limbic", label: "Système limbique", role: "Valeur et expérience", detail: "Il met la situation en relation avec l’affectivité, la motivation et certains apprentissages.", group: "But" },
            { id: "supplementary", label: "Aire motrice supplémentaire", role: "Séquence complexe", detail: "Elle participe à l’organisation interne des actes successifs ou bilatéraux.", group: "Programme" },
            { id: "premotor", label: "Cortex prémoteur", role: "Posture guidée", detail: "Il prépare les gestes orientés par les informations sensorielles et ajuste la posture de départ.", group: "Programme" },
            { id: "basal-cerebellum", label: "Noyaux gris et cervelet", role: "Sélection et coordination", detail: "Les noyaux gris participent au choix du programme ; le cervelet anticipe et ajuste sa coordination.", group: "Programme" },
          ],
          observation: "La préparation répond à « pourquoi et où agir ? » ; la programmation répond à « avec quel geste précis ? ».",
        },
        observation: "La programmation explique pourquoi un geste volontaire adapté n’est pas un simple réflexe.",
        check: q("Quelle aire participe à la préparation posturale du mouvement ?", "Le cortex prémoteur", "L’aire auditive", "La rétine", "L’hypophyse"),
        extraQuestions: [
          choice("Quel événement montre que le cerveau travaille avant le geste visible ?", ["La digestion après le repas", "Le potentiel de préparation enregistré environ 0,8 s avant le mouvement", "La contraction après le mouvement", "La disparition des sensations"], 1, "Le potentiel de préparation précède le début de l’action observée.", "Potentiel de préparation • page 4"),
          choice("Lors de la phase préparatoire, quelle information sert généralement à localiser l’objet ?", ["L’information visuelle", "Le taux de calcium osseux", "La digestion intestinale", "La filtration rénale"], 0, "Le document prend l’exemple d’une localisation d’abord visuelle.", "Phase préparatoire • page 4"),
          choice("Quel ordre décrit le traitement visuel cité dans le cours ?", ["Cortex secondaire → rétine → muscle", "Cortex visuel primaire → cortex visuel secondaire → aires d’association", "Muscle → aire auditive → cortex visuel", "Cervelet → œil → hypothalamus"], 1, "L’information est d’abord projetée, puis analysée et intégrée.", "Phase préparatoire • page 4"),
          choice("Quel groupe contient uniquement des paramètres programmés avant de saisir l’objet ?", ["Latéralisation, distance, direction, force", "Digestion, filtration, croissance, température", "Vision, audition, goût, odorat", "Mémoire, sommeil, faim, soif"], 0, "Le document énumère le bras, la distance, la direction et la force.", "Phase de programmation • page 5"),
          choice("Quelle structure établit surtout les programmes d’actes moteurs complexes ou bilatéraux ?", ["L’aire motrice supplémentaire", "La rétine", "L’aire auditive primaire", "La moelle osseuse"], 0, "C’est le rôle attribué à l’aire motrice supplémentaire dans le document.", "Phase de programmation • page 5"),
          choice("Quelle structure traite la représentation sensorielle de l’espace ?", ["Le cortex pariétal postérieur", "La corticosurrénale", "Le bulbe olfactif seul", "La thyroïde"], 0, "Le cortex pariétal postérieur met en relation le corps et la position de la cible.", "Phase de programmation • page 5"),
          choice("Activité officielle - À quoi correspond la phase de préparation ?", ["À la contraction finale du muscle", "À la localisation de l’objet dans l’espace à partir d’informations sensorielles", "À la mémorisation d’un visage", "À la sécrétion d’une hormone"], 1, "La préparation transforme les informations sensorielles en situation d’action.", "Autres exercices, activité 3 • pages 10-11"),
          choice("Situation officielle AVC - Quelle région peut être active pendant la seule représentation mentale du mouvement ?", ["L’aire psychomotrice", "L’aire gustative", "L’aire visuelle primaire uniquement", "La moelle épinière seule"], 0, "Le document montre une activité prémotrice même sans exécution musculaire.", "Situation d’évaluation 1 • pages 11-12"),
        ],
        distractors: ["La programmation vient après l’exécution.", "Un mouvement volontaire n’utilise aucune information sensorielle.", "Le cortex pariétal ne traite jamais la représentation de l’espace."],
        source: brainActivitySource(
          "3-5 et 10-12",
          "Phases préparatoire et de programmation, activité de correspondance et imagerie fonctionnelle",
          [
            "La virgule décimale française est rétablie dans « 0,8 s ».",
            "Le rôle de l’hypothalamus est précisé : il contribue à l’état interne et aux comportements motivés, sans être présenté comme le centre unique de programmation du geste.",
            "L’activité mesurée lors de la représentation mentale soutient la préparation corticale ; elle ne prouve pas à elle seule l’intégrité de tout l’organisme.",
          ],
        ),
      },
      {
        id: "movement-execution",
        title: "Exécuter et coordonner le mouvement",
        summary: "Suivre le message du cortex moteur à la moelle épinière puis aux muscles effecteurs.",
        conceptTitle: "Le message moteur descend vers les effecteurs",
        explanation: "Après la décision, le cortex moteur émet un message qui descend par les voies motrices vers la moelle épinière, puis les nerfs moteurs l’acheminent aux muscles. Le cervelet compare le mouvement prévu au mouvement réalisé et contribue à sa précision.",
        keyPoint: "Cortex moteur → voies descendantes → moelle épinière → nerfs moteurs → muscles, avec coordination cérébelleuse.",
        example: "Lors d’une prise d’objet, la contraction coordonnée du bras, de l’avant-bras et des doigts réalise le programme préparé.",
        bodyMarkdown: `
## 1. La décision devient une commande motrice

Après la préparation et la programmation, les centres corticaux sélectionnent la réponse à exécuter. Le **cortex moteur** produit alors des messages nerveux qui empruntent les voies descendantes.

### Trajet principal de la commande

**Cortex moteur → voies motrices descendantes → moelle épinière → motoneurones → nerfs moteurs → muscles effecteurs.**

Les motoneurones sont les neurones qui commandent directement les fibres musculaires. Selon les muscles concernés, leurs axones passent par des nerfs rachidiens ou des nerfs crâniens.

## 2. Le mouvement est continuellement ajusté

Un geste précis ne consiste pas à envoyer une commande unique puis à « laisser faire » le muscle.

- Les récepteurs sensoriels informent le système nerveux sur la position des segments du corps et sur le contact avec l’objet.
- Le **cervelet** compare le mouvement prévu au mouvement réellement en cours et contribue aux corrections rapides.
- Les **noyaux gris centraux** participent à l’initiation et à la sélection des programmes moteurs.
- Les muscles agonistes et antagonistes doivent être activés ou relâchés de manière coordonnée.

## 3. Distinguer volontaire et réflexe

Un réflexe peut emprunter un circuit médullaire court. Un mouvement volontaire met en jeu une intention, une préparation corticale, un programme et une commande descendante. Les deux systèmes peuvent cependant coopérer : les ajustements posturaux automatiques stabilisent le geste volontaire.

> **Astuce mémoire - CMM :** **C**ortex moteur, **M**oelle épinière, **M**uscle. Le cervelet contrôle la précision autour de cette chaîne.

> **Erreur fréquente :** dire que le cervelet « décide » le mouvement. Il participe surtout à la coordination, à la comparaison et à la correction.
`,
        processTitle: "Le trajet de la commande motrice",
        processInstruction: "Suis le message nerveux depuis le centre de décision jusqu’au geste.",
        process: [
          { label: "Décision", detail: "Les centres corticaux valident le programme moteur adapté au but." },
          { label: "Commande", detail: "Le cortex moteur génère les messages nerveux de la voie motrice." },
          { label: "Transmission", detail: "La moelle épinière relaie la commande vers les motoneurones." },
          { label: "Contraction", detail: "Les muscles effecteurs se contractent de façon coordonnée et produisent le mouvement." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Trajet interactif",
          title: "De la commande corticale au muscle",
          instruction: "Sélectionne chaque repère pour suivre la commande et sa boucle de correction.",
          viewBox: "0 0 700 390",
          caption: "Figure originale redessinée d’après les schémas de trajet et de synthèse du document officiel.",
          shapes: [
            { shape: "ellipse", cx: 150, cy: 96, rx: 92, ry: 58, rotate: -8, tone: "soft" },
            { shape: "circle", cx: 324, cy: 102, r: 50, tone: "muted" },
            { shape: "path", d: "M459 47 C438 91 444 162 458 215 C468 257 461 300 446 338", tone: "outline" },
            { shape: "path", d: "M530 295 C567 258 620 267 647 304 C617 333 565 341 526 316 Z", tone: "soft" },
            { shape: "line", x1: 232, y1: 96, x2: 274, y2: 101, tone: "accent" },
            { shape: "line", x1: 374, y1: 108, x2: 447, y2: 145, tone: "accent" },
            { shape: "line", x1: 454, y1: 214, x2: 545, y2: 293, tone: "accent" },
            { shape: "path", d: "M535 320 C450 370 325 330 274 144", tone: "muted" },
            { shape: "text", x: 150, y: 100, content: "Cortex moteur", anchor: "middle" },
            { shape: "text", x: 324, y: 106, content: "Cervelet", anchor: "middle" },
            { shape: "text", x: 475, y: 196, content: "Moelle", anchor: "start" },
            { shape: "text", x: 587, y: 307, content: "Muscle", anchor: "middle" },
            { shape: "text", x: 340, y: 374, content: "retour sensoriel et ajustement", anchor: "middle" },
          ],
          hotspots: [
            { id: "motor-cortex", number: 1, label: "Cortex moteur", detail: "Il transforme le programme retenu en commandes nerveuses descendantes.", x: 150, y: 72, highlight: [{ shape: "ellipse", cx: 150, cy: 96, rx: 92, ry: 58, rotate: -8, tone: "accent" }] },
            { id: "cerebellum", number: 2, label: "Cervelet", detail: "Il contribue à comparer le mouvement prévu avec les informations du mouvement réel et à corriger les écarts.", x: 324, y: 79, highlight: [{ shape: "circle", cx: 324, cy: 102, r: 50, tone: "accent" }] },
            { id: "spinal-cord", number: 3, label: "Moelle épinière", detail: "Elle relaie la commande descendante vers les motoneurones et reçoit aussi des informations sensorielles.", x: 455, y: 168, highlight: [{ shape: "path", d: "M459 47 C438 91 444 162 458 215 C468 257 461 300 446 338", tone: "accent" }] },
            { id: "motor-neuron", number: 4, label: "Motoneurone", detail: "Son axone quitte le système nerveux central par un nerf moteur et atteint les fibres musculaires.", x: 510, y: 247, highlight: [{ shape: "line", x1: 454, y1: 214, x2: 545, y2: 293, tone: "accent" }] },
            { id: "muscle", number: 5, label: "Muscle effecteur", detail: "La contraction coordonnée des unités motrices produit la pression, la trajectoire et la force programmées.", x: 587, y: 285, highlight: [{ shape: "path", d: "M530 295 C567 258 620 267 647 304 C617 333 565 341 526 316 Z", tone: "accent" }] },
            { id: "feedback", number: 6, label: "Retour sensoriel", detail: "La position du membre et le contact avec l’objet sont renvoyés aux centres nerveux pour ajuster le geste.", x: 334, y: 335, highlight: [{ shape: "path", d: "M535 320 C450 370 325 330 274 144", tone: "accent" }] },
          ],
          observation: "La commande descendante et le retour sensoriel forment une boucle : c’est cette boucle qui rend le geste précis et adaptable.",
        },
        observation: "Une atteinte de l’aire motrice ou de la voie descendante peut empêcher le geste malgré des muscles intacts.",
        check: q("Quelle structure relaie la commande vers les nerfs moteurs ?", "La moelle épinière", "La thyroïde", "Le cristallin", "Le pancréas"),
        extraQuestions: [
          choice("Quels neurones commandent directement la contraction des muscles ?", ["Les photorécepteurs", "Les motoneurones", "Les cellules hépatiques", "Les ostéocytes"], 1, "Les motoneurones établissent la sortie finale vers les fibres musculaires.", "Texte sur la saisie d’un objet • page 3"),
          choice("Quel trajet correspond à la phase d’exécution ?", ["Cortex moteur → moelle épinière → nerf moteur → muscle", "Muscle → rétine → cortex auditif", "Hypophyse → sang → os", "Oreille → cervelet → peau"], 0, "Le message cortical descend jusqu’aux motoneurones et aux effecteurs.", "Phase d’exécution • page 5"),
          choice("Activité officielle - Quelle description correspond à la phase d’exécution ?", ["Localiser l’objet grâce à la vision", "Déplacer le message du cortex moteur jusqu’à l’effecteur", "Consolider un souvenir", "Choisir le bras sans agir"], 1, "L’exécution est la transmission effective de la commande aux muscles.", "Autres exercices, activité 3 • pages 10-11"),
          trueFalse("Activité officielle - La programmation est la dernière phase de la motricité volontaire.", false, "L’exécution vient après la programmation.", "Activité d’application, affirmation a • page 8"),
          choice("Pourquoi le cervelet est-il indispensable à un geste précis ?", ["Il sécrète l’hormone de croissance", "Il participe à la coordination et à la correction des écarts", "Il remplace tous les muscles", "Il reçoit uniquement des sons"], 1, "Le cervelet ajuste la précision du geste grâce aux informations prévues et sensorielles."),
          choice("Que peut provoquer une lésion de la voie motrice descendante ?", ["Une difficulté à exécuter le mouvement malgré des muscles capables de se contracter", "Une augmentation automatique de la mémoire", "Une meilleure audition", "Une disparition des récepteurs visuels"], 0, "Le problème peut se situer dans la commande centrale ou son trajet, et non dans le muscle lui-même."),
        ],
        distractors: ["Le cortex moteur reçoit sa commande des muscles après le geste.", "Le cervelet sécrète les hormones de stress.", "La décision motrice est prise dans le nerf du bras."],
        source: brainActivitySource(
          "3-5 et 8-11",
          "Phase d’exécution, trajet de l’influx, schéma de synthèse et activités d’application",
          [
            "Le trajet source est conservé sous une forme lisible : commande descendante et retour sensoriel sont distingués.",
            "Le cervelet est présenté comme coordinateur et correcteur, non comme centre unique de décision.",
            "La formulation « message adressé au niveau médullaire » est explicitée en voies descendantes, motoneurones et nerfs moteurs.",
          ],
        ),
      },
      {
        id: "memory",
        title: "Construire et restituer un souvenir",
        summary: "Distinguer mémoires explicite et implicite, court et long terme, puis les phases du mécanisme mnésique.",
        conceptTitle: "La mémoire possède plusieurs formes et plusieurs étapes",
        explanation: "La mémoire explicite porte sur les souvenirs conscients ; la mémoire implicite permet notamment des habiletés. La mémoire à court terme conserve brièvement une information, tandis que la mémoire à long terme la stabilise. L’hippocampe intervient fortement dans la formation de nouveaux souvenirs explicites et le cortex dans leur stockage distribué.",
        keyPoint: "Acquisition → consolidation et stockage → restitution ; l’hippocampe est essentiel à la formation de nouveaux souvenirs explicites.",
        example: "Le patient H. M. améliorait une tâche motrice sans se rappeler l’avoir déjà réalisée : mémoire implicite préservée, mémoire explicite altérée.",
        bodyMarkdown: `
## 1. Le cas H. M. sépare plusieurs systèmes de mémoire

Le patient **H. M.**, connu aujourd’hui sous le nom de Henry Molaison, a subi une ablation bilatérale d’une partie des régions temporales internes comprenant l’hippocampe afin de traiter une épilepsie sévère.

Après l’intervention :

- ses capacités intellectuelles générales et sa mémoire immédiate restaient relativement préservées ;
- il conservait des souvenirs anciens, mais avait perdu une partie des souvenirs proches de l’opération ;
- il ne pouvait presque plus former de nouveaux souvenirs conscients durables : c’est une **amnésie antérograde** majeure ;
- il progressait pourtant dans une tâche motrice au miroir sans se souvenir de l’avoir déjà pratiquée.

Cette dissociation montre que la mémoire n’est pas unique.

| Classification | Définition | Exemple |
|---|---|---|
| mémoire **explicite** ou déclarative | souvenirs et connaissances accessibles consciemment | raconter un événement, reconnaître une personne |
| mémoire **implicite** | apprentissages exprimés par la performance sans rappel conscient nécessaire | améliorer un geste appris |
| mémoire **à court terme / de travail** | maintien bref et manipulation d’une petite quantité d’informations | garder le début d’une phrase pour comprendre sa fin |
| mémoire **à long terme** | conservation durable des connaissances, événements et habiletés | se souvenir d’un cours ou savoir faire du vélo |

## 2. Les trois grandes phases du mécanisme mnésique

### Acquisition ou encodage

L’information sensorielle est transformée en activité de réseaux neuronaux. L’attention et la répétition favorisent son maintien temporaire. Le document évoque des **circuits réverbérants**, c’est-à-dire une activité qui se maintient brièvement dans un réseau.

### Consolidation et stockage

Une partie de l’information est stabilisée par la **plasticité synaptique** : certaines connexions entre neurones sont durablement renforcées ou réorganisées. La synthèse de protéines participe à la consolidation de nombreux souvenirs. L’hippocampe est essentiel à la formation et à l’organisation initiale de nouveaux souvenirs explicites, tandis que leur représentation à long terme est distribuée dans le cortex.

### Restitution ou remémoration

Un indice - une odeur, une mélodie, une question - peut réactiver le réseau associé. Restituer n’est pas lire une copie intacte : le souvenir est reconstruit à partir de traces distribuées.

> **Correction scientifique :** un souvenir n’est pas stocké dans une seule « protéine spécifique », et sa restitution ne dépend pas de la décomposition de cette protéine. Les protéines participent à la plasticité ; le rappel correspond surtout à la réactivation coordonnée de réseaux neuronaux.

> **Astuce mémoire - ACR :** **A**cquisition, **C**onsolidation, **R**estitution.

La diminution ou la perte de mémoire est une **amnésie**. Elle peut toucher certaines périodes ou certaines formes de mémoire sans supprimer toutes les capacités d’apprentissage.
`,
        processTitle: "Les phases du mécanisme mnésique",
        processInstruction: "Suis le devenir d’une information depuis son entrée jusqu’au rappel.",
        process: [
          { label: "Acquisition", detail: "L’information sensorielle est encodée dans des réseaux neuronaux." },
          { label: "Consolidation", detail: "Des modifications durables stabilisent une partie de l’information." },
          { label: "Stockage", detail: "Le souvenir est maintenu dans des réseaux distribués, notamment corticaux." },
          { label: "Restitution", detail: "Un indice réactive le réseau et permet la remémoration." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Réseau interactif",
          title: "Hippocampe, cortex et devenir d’un souvenir",
          instruction: "Sélectionne chaque repère pour suivre une information de l’encodage au rappel.",
          viewBox: "0 0 690 390",
          caption: "Figure originale redessinée d’après le cas H. M. et les phases du mécanisme mnésique.",
          shapes: [
            { shape: "ellipse", cx: 128, cy: 190, rx: 75, ry: 115, tone: "soft" },
            { shape: "path", d: "M259 71 C337 34 447 49 506 111 C550 159 548 236 500 283 C448 333 348 337 275 299 C225 272 205 210 221 153 C228 120 239 93 259 71 Z", tone: "soft" },
            { shape: "path", d: "M336 194 C343 158 382 137 414 153 C448 169 447 213 418 232 C389 252 347 231 336 194 Z", tone: "muted" },
            { shape: "line", x1: 203, y1: 190, x2: 334, y2: 190, tone: "accent" },
            { shape: "line", x1: 419, y1: 154, x2: 557, y2: 99, tone: "muted" },
            { shape: "line", x1: 418, y1: 232, x2: 573, y2: 283, tone: "muted" },
            { shape: "path", d: "M568 280 C612 232 618 145 565 102", tone: "accent" },
            { shape: "text", x: 128, y: 184, content: "Information", anchor: "middle" },
            { shape: "text", x: 128, y: 207, content: "sensorielle", anchor: "middle" },
            { shape: "text", x: 377, y: 199, content: "Hippocampe", anchor: "middle" },
            { shape: "text", x: 468, y: 68, content: "Réseaux corticaux", anchor: "middle" },
            { shape: "text", x: 607, y: 194, content: "Rappel", anchor: "middle" },
          ],
          hotspots: [
            { id: "encoding", number: 1, label: "Acquisition", detail: "Attention et traitement sensoriel encodent l’information dans une activité neuronale temporaire.", x: 129, y: 121, highlight: [{ shape: "ellipse", cx: 128, cy: 190, rx: 75, ry: 115, tone: "accent" }] },
            { id: "hippocampus", number: 2, label: "Hippocampe", detail: "Il est essentiel à la formation de nouveaux souvenirs explicites et à leur organisation initiale.", x: 378, y: 170, highlight: [{ shape: "path", d: "M336 194 C343 158 382 137 414 153 C448 169 447 213 418 232 C389 252 347 231 336 194 Z", tone: "accent" }] },
            { id: "cortex", number: 3, label: "Cortex distribué", detail: "Des composantes visuelles, auditives, verbales et émotionnelles du souvenir sont représentées dans plusieurs réseaux corticaux.", x: 470, y: 104, highlight: [{ shape: "path", d: "M259 71 C337 34 447 49 506 111 C550 159 548 236 500 283 C448 333 348 337 275 299 C225 272 205 210 221 153 C228 120 239 93 259 71 Z", tone: "accent" }] },
            { id: "consolidation", number: 4, label: "Consolidation", detail: "La plasticité synaptique stabilise progressivement certaines traces ; sommeil, répétition et récupération espacée peuvent la favoriser.", x: 506, y: 260, highlight: [{ shape: "line", x1: 418, y1: 232, x2: 573, y2: 283, tone: "accent" }] },
            { id: "retrieval", number: 5, label: "Restitution", detail: "Un indice réactive un ensemble de réseaux ; le souvenir conscient est reconstruit à partir de ces traces.", x: 605, y: 166, highlight: [{ shape: "path", d: "M568 280 C612 232 618 145 565 102", tone: "accent" }] },
          ],
          observation: "Le cas H. M. montre surtout que l’hippocampe est crucial pour former de nouveaux souvenirs explicites, pas qu’il contient à lui seul tous les souvenirs.",
        },
        observation: "Une lésion de l’hippocampe peut empêcher de créer de nouveaux souvenirs conscients tout en laissant des apprentissages moteurs possibles.",
        check: q("Quelle phase permet de stabiliser une information en mémoire à long terme ?", "La consolidation", "La digestion", "La fécondation", "La transpiration"),
        extraQuestions: [
          choice("Quelle capacité de H. M. restait observable malgré l’oubli conscient de la tâche au miroir ?", ["L’amélioration progressive d’une habileté motrice", "La formation normale de nouveaux souvenirs autobiographiques", "La reconnaissance de tous les soignants", "La récupération complète des années précédant l’opération"], 0, "Sa performance motrice s’améliorait : la mémoire implicite était relativement préservée.", "Observations cliniques sur H. M. • page 6"),
          choice("Quelle mémoire était principalement et durablement altérée chez H. M. ?", ["La mémoire explicite de nouveaux événements", "Toutes les réponses réflexes", "La mémoire génétique", "La sensibilité de la peau"], 0, "Il ne pouvait plus former normalement de nouveaux souvenirs conscients durables.", "Observations cliniques sur H. M. • page 6"),
          choice("Quel rôle attribue-t-on à l’hippocampe ?", ["Commander directement tous les muscles", "Participer fortement à la formation de nouveaux souvenirs explicites", "Produire les sons entendus", "Stocker seul et définitivement tous les souvenirs"], 1, "L’hippocampe organise la formation initiale ; les représentations à long terme sont distribuées.", "Hippocampe et mémoire • pages 6-7"),
          choice("Quelle phase transforme une trace fragile en trace plus durable ?", ["La consolidation", "La sudation", "La programmation motrice", "La digestion"], 0, "La consolidation repose notamment sur la plasticité synaptique.", "Consolidation et stockage • page 7"),
          trueFalse("Activité officielle - La restitution est la dernière grande phase du mécanisme mnésique.", true, "Après acquisition et consolidation-stockage, un indice peut permettre la restitution.", "Activité d’application, affirmation b • page 8"),
          trueFalse("Activité officielle - Mnésie et amnésie ont la même signification.", false, "La mnésie désigne la mémoire ; l’amnésie en est une diminution ou une perte.", "Activité d’application, affirmation c • page 8"),
          trueFalse("Le cours établit clairement une mémoire à moyen terme comme troisième catégorie entre court et long terme.", false, "Le texte développe seulement court et long terme ; le corrigé officiel qui valide « moyen terme » est incohérent avec son propre cours et avec la classification simplifiée retenue ici.", "Activité d’application, affirmation d • page 8"),
          choice("Situation officielle - Quel phénomène permet de garder en tête une chanson que l’on vient d’entendre ?", ["L’acquisition et le maintien temporaire de l’information dans des réseaux actifs", "La destruction de l’hippocampe", "La phase d’exécution motrice", "La disparition de toute activité neuronale"], 0, "L’information auditive est encodée et peut persister temporairement dans l’activité de réseaux neuronaux.", "Situation d’évaluation 2, consigne 3 • page 12"),
          choice("Quelle formulation moderne décrit le mieux la restitution d’un souvenir ?", ["Décomposer une protéine unique contenant tout le souvenir", "Réactiver de façon coordonnée les réseaux neuronaux associés à la trace", "Faire circuler le souvenir dans le sang", "Créer un nouvel hippocampe"], 1, "Le rappel correspond à la réactivation d’un réseau distribué ; aucune protéine unique ne contient le souvenir."),
          choice("Quelle définition de l’amnésie correspond au document ?", ["L’augmentation permanente de tous les souvenirs", "La diminution ou la perte de mémoire", "La préparation d’un mouvement", "La capacité d’entendre un son"], 1, "L’amnésie peut être partielle et toucher certaines périodes ou certains systèmes de mémoire.", "Définition • page 7"),
        ],
        distractors: ["Il n’existe qu’une seule forme de mémoire.", "L’hippocampe commande directement la contraction des muscles.", "La restitution précède toujours l’acquisition."],
        source: brainActivitySource(
          "6-8 et 12",
          "Cas H. M., formes de mémoire, acquisition, consolidation, restitution et situation d’évaluation 2",
          [
            "Le patient H. M. est nommé Henry Molaison et l’atteinte est précisée comme une amnésie antérograde majeure avec dissociation explicite/implicite.",
            "L’affirmation « court, moyen et long terme », déclarée vraie par le corrigé alors que le cours ne définit pas le moyen terme, est signalée comme incohérente et n’est pas retenue.",
            "Le modèle de restitution par décomposition d’une protéine spécifique est remplacé par la réactivation de réseaux ; la synthèse protéique reste reliée à la plasticité et à la consolidation.",
            "Les trois phases sont clarifiées en acquisition, consolidation-stockage et restitution.",
          ],
        ),
      },
    ],
    mission: {
      title: "Diagnostiquer les troubles après une commotion cérébrale",
      scenario: "Au cours d’un match de football interclasses, un élève reçoit un choc violent à la tête et perd connaissance. Après sa réanimation, il voit des éclairs lumineux, ne reconnaît plus les membres de sa famille et n’arrive pas à articuler un mot qu’il entend, bien que les muscles de sa langue ne soient pas paralysés. Utilise la carte cérébrale pour relier chaque signe à une fonction perturbée.",
      problem: "Comment relier chaque trouble observé à la fonction d’une aire cérébrale ?",
      bodyMarkdown: `
## Document clinique simplifié

| Observation | Fonction à examiner | Réseau principalement concerné |
|---|---|---|
| éclairs lumineux | traitement visuel élémentaire | voies visuelles et cortex visuel occipital |
| voit ses proches mais ne les reconnaît pas | reconnaissance visuelle des visages | régions visuelles associatives occipito-temporales |
| entend le mot mais ne peut pas l’articuler ; langue non paralysée | programmation et production motrice de la parole | réseau frontal du langage et régions prémotrices |

Le fait que les muscles soient intacts oriente vers une atteinte de la **commande centrale** plutôt que vers une lésion musculaire. Il faut cependant rester prudent : un symptôme clinique ne permet pas, à lui seul, de localiser exactement une lésion. L’imagerie et l’examen médical sont indispensables.

### Méthode attendue

1. **Identifier** les aires motrices et sensorielles sur le schéma.
2. **Nommer** les fonctions correspondant aux symptômes.
3. **Expliquer** chaque trouble avec une phrase « fonction perturbée → conséquence observée ».
4. **Conclure** sur la spécialisation et la coopération des réseaux cérébraux.

> **Correction du document :** les éclairs lumineux ne doivent pas être attribués automatiquement à la seule aire psycho-visuelle. Ils évoquent d’abord une perturbation des voies ou du cortex visuels ; la non-reconnaissance, elle, concerne les régions visuelles associatives.
`,
      investigation: [
        { label: "Voir des éclairs", detail: "Rechercher une perturbation des voies visuelles ou du cortex visuel du lobe occipital." },
        { label: "Ne pas reconnaître", detail: "Distinguer perception visuelle préservée et reconnaissance par le réseau visuel associatif." },
        { label: "Ne pas articuler", detail: "Relier le trouble au réseau frontal de programmation du langage plutôt qu’aux muscles eux-mêmes." },
        { label: "Conclure", detail: "Montrer la spécialisation et la coopération des aires cérébrales." },
      ],
      interaction: {
        kind: "diagram",
        eyebrow: "Raisonnement clinique",
        title: "Du symptôme à l’hypothèse fonctionnelle",
        instruction: "Ouvre chaque symptôme et vérifie la fonction qu’il permet d’interroger.",
        rootLabel: "Commotion cérébrale",
        rootDetail: "Les symptômes suggèrent plusieurs fonctions perturbées ; ils ne remplacent jamais le diagnostic médical.",
        nodes: [
          { id: "flashes", label: "Éclairs lumineux", role: "Perception visuelle", detail: "Ils orientent vers les voies visuelles ou le cortex visuel primaire ; une origine rétinienne ou autre doit aussi être recherchée cliniquement.", group: "Vision" },
          { id: "faces", label: "Visages non reconnus", role: "Association visuelle", detail: "La personne voit mais n’identifie plus les proches : les régions occipito-temporales associatives sont à examiner.", group: "Vision" },
          { id: "speech", label: "Mot non articulé", role: "Production du langage", detail: "L’audition et les muscles sont préservés ; le réseau frontal de programmation de la parole peut être perturbé.", group: "Langage" },
          { id: "intact-muscles", label: "Langue non paralysée", role: "Indice de localisation", detail: "Cet indice distingue la capacité musculaire de la commande corticale nécessaire à l’articulation.", group: "Langage" },
          { id: "network", label: "Conclusion", role: "Réseaux spécialisés", detail: "Perception, reconnaissance et articulation reposent sur des réseaux différents mais connectés.", group: "Synthèse" },
        ],
        observation: "Une explication correcte relie un symptôme à une fonction perturbée sans transformer cette relation en diagnostic certain.",
      },
      modelAnswer: "Les éclairs signalent une perturbation du traitement visuel ; la vision sans reconnaissance oriente vers les régions visuelles associatives ; l’impossibilité d’articuler malgré des muscles et une audition fonctionnels oriente vers le réseau frontal moteur du langage. Ces troubles montrent que perception, reconnaissance et production de la parole mobilisent des réseaux spécialisés qui coopèrent.",
      questions: [
        choice("Situation officielle - Quelle aire fonctionnelle associer à l’impossibilité de reconnaître des visages pourtant vus ?", ["L’aire gustative", "Le réseau visuel associatif ou psycho-visuel", "La moelle épinière", "L’hypophyse"], 1, "La perception élémentaire peut être présente alors que la reconnaissance visuelle est perturbée.", "Situation d’évaluation, consignes 2-3 • pages 9-10"),
        choice("Situation officielle - Pourquoi des muscles de la langue intacts n’excluent-ils pas un trouble de la parole ?", ["La commande et la programmation corticales du langage peuvent être atteintes", "Les muscles parlent sans commande nerveuse", "Le langage dépend seulement de l’oreille", "La mémoire remplace l’aire motrice"], 0, "L’articulation exige une programmation centrale en plus de muscles fonctionnels.", "Situation d’évaluation, consignes 2-3 • pages 9-10"),
        choice("Quelle conclusion générale est justifiée ?", ["Chaque fonction dépend d’un seul muscle", "Toutes les aires ont exactement la même fonction", "Des réseaux spécialisés coopèrent pour produire perception, reconnaissance et action", "Le cortex ne participe pas au comportement"], 2, "La spécialisation n’empêche pas la coopération entre régions cérébrales.", "Situation d’évaluation, consigne 3 • pages 9-10"),
      ],
      extraQuestions: [
        choice("Situation officielle - Parmi ces structures, lesquelles sont motrices ?", ["Aire visuelle et aire psycho-visuelle", "Aire auditive et aire psycho-auditive", "Aire motrice, commande de la langue et articulation du langage", "Lobe occipital et rétine uniquement"], 2, "Le document oppose ici les territoires moteurs aux territoires sensoriels.", "Situation d’évaluation, consigne 1 • page 9"),
        choice("À quelle fonction faut-il d’abord relier la perception d’éclairs lumineux ?", ["Au traitement visuel primaire et aux voies visuelles", "À la mémoire implicite uniquement", "À la digestion", "À l’aire motrice de la jambe"], 0, "Les éclairs sont un phénomène visuel ; la reconnaissance des visages constitue un second trouble distinct."),
        choice("Situation officielle AVC - Que montre l’activation de l’aire psychomotrice pendant une représentation mentale du geste ?", ["La préparation motrice peut exister sans contraction visible", "Le muscle décide seul du mouvement", "Le cortex ne travaille qu’après le geste", "Toute activité cérébrale est visuelle"], 0, "Imaginer le geste recrute une partie du réseau de préparation.", "Situation d’évaluation 1 • pages 11-12"),
        choice("Quelle conclusion peut-on raisonnablement tirer de l’activation des aires motrices pendant les tâches testées ?", ["Tout l’état de santé physique est nécessairement parfait", "Les réseaux moteurs étudiés sont recrutés pendant ces tâches, sans conclure sur tout l’organisme", "L’AVC n’a jamais existé", "Le cervelet est inutile"], 1, "Une imagerie fonctionnelle renseigne sur les tâches observées ; elle ne suffit pas à déclarer toute la santé physique intacte.", "Situation d’évaluation 1, consigne 3 • page 12"),
        choice("Quelle différence sépare perception et reconnaissance ?", ["Percevoir reçoit les caractéristiques ; reconnaître leur attribue une identité ou un sens", "Reconnaître précède toujours tout signal sensoriel", "Les deux mots sont strictement synonymes", "La reconnaissance dépend uniquement du muscle"], 0, "Les aires primaires et associatives permettent de distinguer ces deux étapes."),
        trueFalse("Cette mission permet à elle seule de poser un diagnostic médical exact après un traumatisme crânien.", false, "Les relations fonctionnelles guident l’analyse pédagogique ; seul un examen clinique et paraclinique peut établir un diagnostic."),
      ],
      source: brainActivitySource(
        "9-12",
        "Situation d’évaluation de la commotion, exercices complémentaires et situation AVC",
        [
          "La répétition de l’aire psycho-visuelle dans la liste des aires sensorielles est supprimée.",
          "Les éclairs lumineux sont reliés d’abord aux voies ou au cortex visuels, tandis que la non-reconnaissance est reliée aux régions associatives ; le corrigé source attribuait les deux signes à la seule aire psycho-visuelle.",
          "Le réseau d’articulation est décrit comme frontal et distribué plutôt que comme un point isolé.",
          "La conclusion « l’état de santé physique n’est pas affecté » est restreinte : l’activation indique seulement le recrutement des réseaux moteurs testés.",
        ],
      ),
    },
  },
  {
    id: "terminale-svt-l3-origin-of-life",
    chapterNumber: 3,
    themeNumber: 2,
    themeTitle: "Origine et évolution du vivant",
    title: "L’origine de la vie",
    description: "Croiser les archives géologiques, l’étude des milieux extrêmes et les expériences de chimie prébiotique pour reconstruire un scénario scientifique prudent de l’apparition de la vie.",
    centralQuestion: "Comment des indices indirects et des expériences permettent-ils d’étudier une origine de la vie que personne n’a pu observer ?",
    memorySentence: "Archives de la Terre + analogues actuels + expériences → scénario testable, mais passage exact à la première cellule encore inconnu.",
    overviewBodyMarkdown: `
## Deux familles de faits, une même enquête

L’origine de la vie est un événement très ancien qui n’a laissé ni récit direct ni première cellule intacte. Le scientifique construit donc une explication en **croisant des indices indépendants**.

| Famille de faits | Documents étudiés | Ce qu’ils permettent d’établir |
|---|---|---|
| **Archives géologiques et géochimiques** | pechblende, fers rubanés, couches rouges, évolution de l’atmosphère | l’atmosphère primitive contenait très peu de dioxygène libre, puis elle s’est progressivement oxygénée |
| **Analogues biologiques actuels** | microorganismes de sources chaudes, acides ou hydrothermales | la vie peut fonctionner dans des milieux très contraignants |
| **Expériences prébiotiques** | Miller-Urey, coacervats, polymérisation, structures microscopiques | certaines briques organiques et certains compartiments peuvent apparaître sans cellule préexistante |
| **Apports extraterrestres** | molécules organiques de météorites et de comètes | une partie des constituants carbonés a pu être apportée depuis l’espace |

Le document officiel emploie souvent l’expression **« faits paléontologiques »**. Plusieurs indices étudiés sont surtout **géologiques** ou **géochimiques** : une roche oxydée n’est pas un fossile, mais elle renseigne sur le milieu ancien.

## Ce que la démarche scientifique autorise à conclure

Une expérience peut montrer qu’une étape est **possible**. Elle ne prouve pas que cette étape s’est déroulée exactement de cette façon sur la Terre primitive. De même, un extrêmophile actuel est un **analogue**, pas le premier être vivant conservé jusqu’à aujourd’hui.

> **Astuce mémoire - AAE :** **A**rchives, **A**nalogues, **E**xpériences. Les trois convergent vers un scénario, sans constituer une vidéo du passé.

> **Erreur fréquente :** confondre « molécule organique », « structure ressemblant à une cellule » et « cellule vivante ». Une cellule doit maintenir une organisation, utiliser de l’énergie, porter une information héréditaire et se reproduire avec variations.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte de preuves",
      title: "Quatre fenêtres sur l’origine de la vie",
      instruction: "Ouvre chaque famille pour distinguer observation, expérience et conclusion.",
      rootLabel: "Origine de la vie",
      rootDetail: "Une reconstruction scientifique fondée sur des indices convergents et des hypothèses testables.",
      nodes: [
        { id: "archives", label: "Roches anciennes", role: "Archives du milieu", detail: "Pechblende, fers rubanés et couches rouges renseignent sur la teneur ancienne en dioxygène.", group: "Passé" },
        { id: "timeline", label: "Traces du vivant", role: "Chronologie minimale", detail: "Les premières traces attribuées à des organismes procaryotes précèdent l’oxygénation massive de l’atmosphère.", group: "Passé" },
        { id: "analogues", label: "Extrêmophiles", role: "Analogues actuels", detail: "Ils montrent qu’un métabolisme cellulaire est possible dans des milieux chauds, acides ou riches en sulfures.", group: "Présent" },
        { id: "experiments", label: "Chimie prébiotique", role: "Tester une possibilité", detail: "Des expériences produisent des molécules organiques ou des compartiments, sans recréer une cellule vivante complète.", group: "Laboratoire" },
        { id: "space", label: "Météorites et comètes", role: "Apports possibles", detail: "Des molécules carbonées détectées dans certaines météorites montrent qu’une chimie organique existe aussi hors de la Terre.", group: "Espace" },
      ],
      observation: "La force du scénario vient de la convergence : aucune famille de faits ne suffit seule à raconter toutes les étapes.",
    },
    overviewExtraQuestions: [
      choice("Pourquoi ne peut-on pas observer directement l’apparition de la première cellule ?", ["Parce qu’aucune roche n’existe", "Parce que l’événement est très ancien et ses traces sont indirectes", "Parce que les cellules ne contiennent aucune molécule", "Parce que les expériences sont interdites"], 1, "L’enquête repose sur des archives transformées par le temps et sur des tests de possibilité."),
      choice("Quelle association décrit correctement les trois grandes approches de la leçon ?", ["Archives - analogues actuels - expériences", "Digestion - respiration - excrétion", "Méiose - fécondation - développement", "Réflexe - mémoire - hormone"], 0, "Les archives renseignent sur le passé, les analogues sur les limites du vivant et les expériences sur les étapes chimiquement possibles."),
      trueFalse("Une expérience qui produit des acides aminés a nécessairement recréé la vie.", false, "Un acide aminé est une brique chimique ; il ne possède ni organisation cellulaire ni reproduction autonome."),
      choice("Lequel est surtout un indice géochimique plutôt qu’un fossile ?", ["Une empreinte d’animal", "Un os minéralisé", "Une couche rouge riche en oxydes de fer", "Une coquille fossile"], 2, "La couleur et la minéralogie de la couche enregistrent des conditions d’oxydation."),
      choice("Quelle conclusion est la plus scientifique ?", ["Un seul document prouve toutes les étapes", "Le scénario est certain dans chaque détail", "Toute hypothèse se vaut", "Plusieurs indices convergent, mais certaines étapes restent discutées"], 3, "Une conclusion scientifique précise à la fois ce que les données soutiennent et leurs limites."),
    ],
    overviewSource: originOfLifeSource(
      "1-7",
      "Problématique générale, deux familles de faits et documents de synthèse",
      [
        "La situation d’apprentissage opposant scientifiques et religieux est retirée : le cours traite la méthode scientifique sans juger les convictions personnelles.",
        "L’expression générale « faits paléontologiques » est précisée en archives géologiques, géochimiques et paléontologiques selon la nature réelle de chaque document.",
      ],
    ),
    sections: [
      {
        id: "early-earth-evidence",
        title: "Lire les archives de la Terre primitive",
        summary: "Interpréter pechblende, fers rubanés et couches rouges sans confondre la roche observée avec l’atmosphère que l’on reconstitue.",
        conceptTitle: "Les roches enregistrent indirectement la présence de dioxygène",
        explanation: "La conservation de grains d’uraninite très oxydable indique une atmosphère ancienne pauvre en dioxygène. Les fers rubanés enregistrent l’oxydation du fer dissous dans les océans, puis les couches rouges continentales traduisent une oxygénation atmosphérique devenue plus durable.",
        keyPoint: "Uraninite détritique conservée → très peu d’O₂ ; fers rubanés → oxygénation des océans ; couches rouges → O₂ atmosphérique plus durable.",
        example: "On n’observe pas directement l’air vieux de 2,3 milliards d’années : on déduit sa pauvreté en dioxygène de la conservation d’un minéral qui s’oxyde facilement.",
        bodyMarkdown: `
## 1. La pechblende : un minéral fragile face au dioxygène

Le texte décrit des sables fluviatiles âgés d’environ **2,3 milliards d’années**, découverts notamment en Afrique et en Amérique, contenant des grains de pechblende ou **uraninite**. Ce minéral s’oxyde facilement. Sa conservation pendant le transport par les cours d’eau est donc compatible avec une atmosphère contenant très peu de dioxygène libre.

Le raisonnement est indirect :

1. l’uraninite s’altère en présence d’un milieu fortement oxydant ;
2. elle est retrouvée sous forme détritique dans une roche ancienne ;
3. on en déduit que le milieu de transport était beaucoup moins oxygéné qu’aujourd’hui.

## 2. Les fers rubanés : du dioxygène d’abord consommé dans l’océan

Les **formations de fer rubané** alternent surtout des niveaux riches en oxydes de fer et des niveaux riches en silice. Le dioxygène produit localement oxyde le fer ferreux dissous ; les oxydes insolubles précipitent et s’accumulent sur le fond marin.

| Observation | Déduction prudente |
|---|---|
| grandes quantités de fer dissous dans l’océan ancien | le milieu global reste pauvre en dioxygène libre |
| dépôts d’oxydes de fer | du dioxygène est produit et immédiatement consommé par l’oxydation du fer |
| répétition des niveaux | production et conditions de dépôt varient au cours du temps |

Le document parle de couches « blanches » et « rouges », puis de fer ferreux et d’oxydes. La lecture moderne retient surtout l’alternance **silice / oxydes de fer** ; elle ne permet pas à elle seule de reconstituer des « saisons atmosphériques » précises.

## 3. Les couches rouges : le dioxygène gagne les continents

Quand les principaux composés réduits consomment moins de dioxygène qu’il n’en est produit, le gaz commence à s’accumuler dans l’atmosphère. Les sédiments continentaux s’oxydent alors et prennent une teinte rouge due notamment à l’hématite.

Cette transition s’inscrit dans la **Grande Oxygénation**, vers 2,4 à 2,1 milliards d’années. Les dates et concentrations exactes restent discutées ; la valeur « environ 1 % de la teneur actuelle » du document est un ordre de grandeur historique, pas une mesure directe de chaque couche rouge.

> **Astuce mémoire - UFR :** **U**raninite conservée, **F**ers rubanés, **R**ed beds. C’est l’ordre des trois archives.

> **Erreur fréquente :** dire que les fers rubanés prouvent immédiatement une atmosphère riche en O₂. Ils montrent surtout que l’O₂ produit était d’abord capté par le fer océanique.
`,
        processTitle: "Trois archives de l’oxygénation",
        processInstruction: "Replace les indices géologiques dans leur ordre et ouvre chaque repère.",
        process: [
          { label: "Uraninite détritique", shortLabel: "Très peu d’O₂", detail: "Sa conservation indique un environnement de surface faiblement oxydant." },
          { label: "Fers rubanés", detail: "Le dioxygène oxyde le fer dissous et reste en grande partie consommé dans l’océan." },
          { label: "Grande Oxygénation", shortLabel: "Accumulation", detail: "La production dépasse progressivement les puits chimiques de dioxygène." },
          { label: "Couches rouges", detail: "L’oxydation durable des sédiments continentaux témoigne d’un O₂ atmosphérique plus présent." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Coupe temporelle interactive",
          title: "De l’océan riche en fer aux continents rouges",
          instruction: "Sélectionne chaque repère pour relier une roche au niveau d’oxygénation qu’elle révèle.",
          viewBox: "0 0 700 370",
          caption: "Figure originale redessinée d’après la frise et les archives géologiques du document officiel.",
          shapes: [
            { shape: "line", x1: 58, y1: 305, x2: 655, y2: 305, tone: "outline" },
            { shape: "path", d: "M82 253 L176 253 L176 181 L82 181 Z", tone: "soft" },
            { shape: "circle", cx: 106, cy: 211, r: 9, tone: "muted" },
            { shape: "circle", cx: 137, cy: 226, r: 8, tone: "muted" },
            { shape: "path", d: "M235 258 L348 258 L348 169 L235 169 Z", tone: "soft" },
            { shape: "line", x1: 239, y1: 184, x2: 344, y2: 184, tone: "accent" },
            { shape: "line", x1: 239, y1: 205, x2: 344, y2: 205, tone: "muted" },
            { shape: "line", x1: 239, y1: 226, x2: 344, y2: 226, tone: "accent" },
            { shape: "line", x1: 239, y1: 247, x2: 344, y2: 247, tone: "muted" },
            { shape: "path", d: "M459 257 L602 257 L584 165 L479 165 Z", tone: "accent" },
            { shape: "path", d: "M56 126 C192 105 320 126 437 101 C529 81 598 83 657 70", tone: "accent" },
            { shape: "text", x: 128, y: 280, content: "~2,7 à 2,4 Ga", anchor: "middle" },
            { shape: "text", x: 292, y: 280, content: "fers rubanés", anchor: "middle" },
            { shape: "text", x: 530, y: 280, content: "couches rouges", anchor: "middle" },
            { shape: "text", x: 350, y: 52, content: "dioxygène libre en augmentation", anchor: "middle" },
          ],
          hotspots: [
            { id: "uraninite", number: 1, label: "Uraninite conservée", detail: "Des grains très oxydables traversent le milieu de surface sans être détruits : le dioxygène libre est rare.", x: 128, y: 154, highlight: [{ shape: "path", d: "M82 253 L176 253 L176 181 L82 181 Z", tone: "accent" }] },
            { id: "bif", number: 2, label: "Fers rubanés", detail: "L’O₂ produit oxyde le fer ferreux dissous ; les oxydes précipitent tandis que l’atmosphère reste encore peu oxygénée.", x: 291, y: 146, highlight: [{ shape: "path", d: "M235 258 L348 258 L348 169 L235 169 Z", tone: "accent" }] },
            { id: "great-oxidation", number: 3, label: "Grande Oxygénation", detail: "Vers 2,4 à 2,1 Ga, le dioxygène commence à s’accumuler durablement au-delà des puits chimiques.", x: 418, y: 103, highlight: [{ shape: "path", d: "M56 126 C192 105 320 126 437 101 C529 81 598 83 657 70", tone: "accent" }] },
            { id: "redbeds", number: 4, label: "Couches rouges", detail: "L’hématite colore les dépôts continentaux : l’atmosphère est devenue suffisamment oxydante pour altérer les continents.", x: 532, y: 142, highlight: [{ shape: "path", d: "M459 257 L602 257 L584 165 L479 165 Z", tone: "accent" }] },
          ],
          observation: "Une même molécule, O₂, laisse des signatures différentes selon qu’elle est immédiatement consommée dans l’océan ou qu’elle s’accumule dans l’atmosphère.",
        },
        observation: "Une archive géologique ne montre pas directement l’atmosphère ; elle en révèle les propriétés par les réactions chimiques qu’elle a enregistrées.",
        check: choice("Que traduit l’apparition durable de couches rouges continentales ?", ["La disparition de tous les océans", "L’absence totale de fer", "La formation immédiate des animaux", "Une présence plus durable de dioxygène atmosphérique"], 3, "L’oxydation du fer des continents exige un milieu de surface devenu plus oxydant."),
        extraQuestions: [
          choice("Pourquoi la pechblende détritique est-elle un indice d’une atmosphère pauvre en O₂ ?", ["Parce qu’elle produit elle-même l’oxygène", "Parce qu’elle est un fossile de cyanobactérie", "Parce qu’elle se serait oxydée et altérée dans une atmosphère riche en O₂", "Parce qu’elle ne contient aucun uranium"], 2, "Sa conservation est compatible avec un faible pouvoir oxydant du milieu.", "Texte 1, pechblende • page 1"),
          choice("Que se passe-t-il lorsque le dioxygène rencontre le fer ferreux dissous dans l’océan ancien ?", ["Il l’oxyde et des composés ferriques précipitent", "Il transforme le fer en méthane", "Il détruit tous les sédiments", "Il forme directement une cellule"], 0, "L’oxydation du fer consomme l’O₂ et produit des dépôts riches en oxydes.", "Texte 1, fers rubanés • page 1"),
          trueFalse("Les fers rubanés prouvent que l’atmosphère était déjà aussi riche en dioxygène qu’aujourd’hui.", false, "Ils indiquent une production d’O₂, mais une grande part était encore consommée dans l’océan.", "Analyse du texte 1 • pages 1-2"),
          choice("Quelle alternance décrit le mieux une formation de fer rubané ?", ["Os et coquilles", "Niveaux riches en oxydes de fer et niveaux riches en silice", "Charbon et pétrole", "Granite et basalte uniquement"], 1, "La formulation simplifiée « blanc/rouge » du document est précisée par la minéralogie des niveaux.", "Texte 1 et document 1 • pages 1 et 3"),
          choice("Dans quel ordre apparaissent les trois archives étudiées ?", ["Couches rouges → uraninite → fers rubanés", "Fers rubanés → couches rouges → uraninite", "Uraninite conservée → fers rubanés → couches rouges", "Couches rouges → fers rubanés → uraninite"], 2, "Cet ordre accompagne l’augmentation progressive du dioxygène disponible.", "Résultats du texte 1 • page 2"),
          choice("Qu’est-ce que la Grande Oxygénation ?", ["La disparition de l’atmosphère", "Une accumulation importante et durable de dioxygène libre", "La naissance instantanée de tous les animaux", "La transformation de l’O₂ en azote"], 1, "Elle correspond à un changement global du cycle de l’oxygène, vers 2,4 à 2,1 Ga."),
          choice("Pourquoi parle-t-on d’une déduction indirecte ?", ["Parce que les roches n’existent pas", "Parce que l’on refuse toute mesure", "Parce qu’on mesure l’air ancien dans une bouteille intacte", "Parce qu’on reconstitue le milieu à partir des réactions conservées dans les minéraux"], 3, "La roche est l’archive ; l’atmosphère ancienne est l’objet reconstruit."),
          trueFalse("La valeur de 1 % de la teneur actuelle en O₂ doit être comprise comme une mesure exacte valable pour toutes les couches rouges.", false, "Le document donne un ordre de grandeur ; les archives et les modèles ne justifient pas une valeur unique pour chaque lieu et chaque date."),
        ],
        distractors: ["L’atmosphère primitive contenait autant de dioxygène qu’aujourd’hui.", "Les fers rubanés ne fournissent aucune information chimique.", "Les couches rouges se forment uniquement sans dioxygène."],
        source: originOfLifeSource(
          "1-3 et 7",
          "Texte 1, résultats, analyse et frise de l’évolution de l’atmosphère",
          [
            "Les faits dits « paléontologiques » sont ici distingués en indices géologiques et géochimiques.",
            "L’alternance des fers rubanés est précisée en niveaux riches en oxydes de fer et en silice ; elle ne démontre pas à elle seule une alternance saisonnière de toute l’atmosphère.",
            "La Grande Oxygénation est située approximativement vers 2,4 à 2,1 milliards d’années et la valeur de 1 % est présentée comme un ordre de grandeur historique.",
          ],
        ),
      },
      {
        id: "photosynthesis-oxygenation",
        title: "Relier photosynthèse et oxygénation",
        summary: "Suivre le dioxygène produit par les cyanobactéries, depuis les puits océaniques jusqu’à l’atmosphère et à la couche d’ozone.",
        conceptTitle: "La photosynthèse oxygénique transforme la planète",
        explanation: "Des microorganismes photosynthétiques, notamment les cyanobactéries, libèrent du dioxygène. D’abord consommé par le fer et d’autres composés réduits, ce gaz finit par s’accumuler dans l’atmosphère ; une partie forme alors de l’ozone qui filtre les ultraviolets.",
        keyPoint: "Photosynthèse oxygénique → O₂ consommé par les puits chimiques → O₂ atmosphérique → ozone → nouveaux milieux habitables.",
        example: "Une cyanobactérie utilise l’énergie lumineuse pour fabriquer de la matière organique et rejeter du dioxygène, même si ce dioxygène n’atteint pas immédiatement l’atmosphère.",
        bodyMarkdown: `
## 1. La source biologique du dioxygène

Les premiers grands producteurs de dioxygène ne sont pas des plantes terrestres, mais des **cyanobactéries**, procaryotes capables de photosynthèse oxygénique. Elles utilisent l’énergie lumineuse, l’eau et le dioxyde de carbone pour fabriquer de la matière organique et libérer du dioxygène.

Le document parle d’« algues ». Pour les temps très anciens étudiés ici, le terme le plus précis est **cyanobactéries**. Certaines construisent des tapis microbiens pouvant former des stromatolites.

## 2. Pourquoi l’atmosphère ne s’oxygène-t-elle pas immédiatement ?

Le dioxygène est très réactif. Avant de s’accumuler, il oxyde :

- le fer ferreux dissous dans l’océan ;
- des gaz volcaniques et des minéraux réduits ;
- de la matière organique.

Ces réactions constituent des **puits de dioxygène**. L’atmosphère s’oxygène durablement lorsque la production biologique devient supérieure à la consommation par ces puits.

## 3. Du dioxygène à l’ozone

Dans la haute atmosphère, les ultraviolets transforment une partie du dioxygène en **ozone O₃**. La couche d’ozone absorbe une partie importante des UV nocifs. Elle n’a pas « créé » la vie, mais elle a rendu la surface et les eaux peu profondes moins exposées aux rayonnements, facilitant ensuite la diversification et la conquête de nouveaux milieux.

| Repère approximatif | Événement à retenir |
|---|---|
| vers 3,5 milliards d’années ou avant | traces anciennes de vie procaryote discutées selon les indices |
| vers 2,4 à 2,1 milliards d’années | Grande Oxygénation |
| vers 1,8 milliard d’années | diversification d’eucaryotes anciens |
| fin du Précambrien | diversification d’organismes pluricellulaires |

Cette suite n’est pas une échelle où chaque groupe se transforme directement en suivant. Procaryotes, eucaryotes et pluricellulaires ont des histoires ramifiées, et les procaryotes existent toujours.

> **Correction importante :** le document affirme que les végétaux chlorophylliens rejettent l’O₂ « la nuit ». La photosynthèse libère de l’O₂ **en présence de lumière** ; la respiration, qui consomme de l’O₂, se poursuit de jour comme de nuit.

> **Astuce mémoire - PCO :** **P**roduction, **C**onsommation par les puits, **O**xygénation durable.
`,
        processTitle: "De la photosynthèse à l’ozone",
        processInstruction: "Suis le devenir du dioxygène produit par les premiers organismes.",
        process: [
          { label: "Cyanobactéries", shortLabel: "Production", detail: "La photosynthèse oxygénique libère du dioxygène dans l’eau." },
          { label: "Puits océaniques", shortLabel: "Consommation", detail: "Le fer et d’autres composés réduits captent d’abord l’O₂ produit." },
          { label: "Atmosphère", shortLabel: "Accumulation", detail: "Lorsque la production dépasse les puits, l’O₂ libre augmente." },
          { label: "Ozone", detail: "Une partie de l’O₂ forme O₃ et filtre une fraction des ultraviolets." },
          { label: "Diversification", detail: "L’oxygénation et la protection UV ouvrent de nouvelles possibilités métaboliques et écologiques." },
        ],
        interaction: {
          kind: "diagram",
          eyebrow: "Cycle interactif",
          title: "Le long trajet du dioxygène",
          instruction: "Sélectionne une étape pour comprendre pourquoi production ne signifie pas accumulation immédiate.",
          rootLabel: "O₂ biologique",
          rootDetail: "Produit par photosynthèse oxygénique, il transforme d’abord l’océan puis l’atmosphère.",
          nodes: [
            { id: "cyanobacteria", label: "Cyanobactéries", role: "Produire", detail: "Elles captent l’énergie lumineuse et libèrent du dioxygène dans l’eau.", group: "Source" },
            { id: "iron", label: "Fer océanique", role: "Premier puits", detail: "Le fer ferreux est oxydé ; les oxydes précipitent en formations rubanées.", group: "Consommation" },
            { id: "other-sinks", label: "Autres puits", role: "Retarder l’accumulation", detail: "Gaz volcaniques, roches réduites et matière organique consomment aussi du dioxygène.", group: "Consommation" },
            { id: "atmosphere", label: "Atmosphère", role: "S’accumuler", detail: "L’O₂ devient durable quand sa production dépasse la capacité des puits.", group: "Transformation" },
            { id: "ozone", label: "Couche d’ozone", role: "Filtrer les UV", detail: "Une partie de l’O₂ forme O₃ dans la haute atmosphère et réduit l’exposition aux UV.", group: "Conséquence" },
          ],
          observation: "La vie transforme son milieu, puis le milieu transformé modifie à son tour les possibilités d’évolution du vivant.",
        },
        observation: "L’apparition de la vie et l’évolution de l’atmosphère s’influencent mutuellement, sans former une progression simple et automatique.",
        check: choice("Quelle activité biologique a fortement contribué à l’oxygénation ancienne ?", ["La digestion", "La fermentation seule", "La photosynthèse oxygénique", "La mitose sans métabolisme"], 2, "Les cyanobactéries photosynthétiques ont constitué une source majeure de dioxygène."),
        extraQuestions: [
          choice("Quel groupe ancien est le plus précisément associé à la production d’O₂ étudiée ?", ["Les mammifères", "Les cyanobactéries", "Les champignons terrestres", "Les insectes"], 1, "Le mot « algues » du document est précisé par les cyanobactéries pour les temps anciens.", "Interprétation du document 3 • pages 2-3"),
          choice("Pourquoi l’O₂ produit ne s’est-il pas immédiatement accumulé dans l’atmosphère ?", ["Il était consommé par le fer et d’autres composés réduits", "Il n’existait aucune réaction chimique", "Il se transformait entièrement en azote", "Il quittait définitivement la Terre"], 0, "Les puits océaniques et géologiques ont d’abord capté une grande partie du dioxygène.", "Texte 1 et analyse • pages 1-2"),
          choice("Quel gaz est le précurseur direct de l’ozone atmosphérique ?", ["Le méthane", "Le diazote", "Le dioxyde de carbone", "Le dioxygène"], 3, "L’ozone O₃ se forme à partir du dioxygène O₂ sous l’action des UV.", "Texte 1 • pages 1-2"),
          trueFalse("Les végétaux chlorophylliens libèrent le dioxygène photosynthétique principalement la nuit.", false, "La libération photosynthétique d’O₂ exige la lumière ; la respiration continue jour et nuit.", "Interprétation du document 3 • page 2"),
          trueFalse("Les organismes photosynthétiques respirent également.", true, "La photosynthèse et la respiration sont deux processus distincts ; un organisme photosynthétique respire aussi."),
          choice("Quel ordre général est cohérent avec la frise du document ?", ["Procaryotes → eucaryotes → pluricellulaires", "Pluricellulaires → procaryotes → Terre", "Vertébrés terrestres → océans → procaryotes", "Ozone → naissance de la Terre → cyanobactéries"], 0, "L’ordre chronologique général est conservé, sans supposer une transformation linéaire de chaque groupe dans le suivant.", "Document 1 et documentation • pages 3 et 7"),
          choice("Quelle formulation évite une causalité excessive ?", ["L’O₂ a fabriqué directement tous les eucaryotes", "La couche d’ozone a créé la première cellule", "L’oxygénation a offert de nouvelles possibilités métaboliques et écologiques", "Tous les procaryotes ont disparu après l’oxygénation"], 2, "L’oxygénation est un facteur majeur parmi d’autres ; elle ne constitue pas à elle seule un programme d’évolution."),
          choice("Quel rôle protecteur joue la couche d’ozone ?", ["Elle bloque toute lumière visible", "Elle absorbe une partie importante des ultraviolets", "Elle produit le fer océanique", "Elle supprime la respiration"], 1, "La réduction du flux UV facilite la vie dans les eaux superficielles et sur les continents.", "Texte 1 • page 2"),
        ],
        distractors: ["L’ozone s’est formé avant toute présence de dioxygène.", "Le dioxygène n’a jamais réagi avec le fer océanique.", "La photosynthèse consomme le dioxygène pour produire du dioxyde de carbone."],
        source: originOfLifeSource(
          "1-3 et 7",
          "Photosynthèse, oxygénation, ozone et frise de diversification",
          [
            "Le terme général « algues » est précisé en cyanobactéries pour les premiers producteurs importants de dioxygène.",
            "La phrase affirmant que les végétaux rejettent l’O₂ la nuit est corrigée : la photosynthèse oxygénique dépend de la lumière, tandis que la respiration a lieu jour et nuit.",
            "La succession procaryotes, eucaryotes et pluricellulaires est présentée comme une chronologie ramifiée, non comme une chaîne où chaque groupe disparaît en devenant le suivant.",
          ],
        ),
      },
      {
        id: "extreme-environments",
        title: "Interpréter la vie en milieu extrême",
        summary: "Utiliser les archées thermoacidophiles et les sources hydrothermales comme analogues, sans transformer une ressemblance actuelle en preuve historique.",
        conceptTitle: "Les extrêmophiles repoussent les limites connues du vivant",
        explanation: "Des archées vivent dans des sources chaudes et acides, et des écosystèmes prospèrent autour des sources hydrothermales. Ces observations rendent plausibles certains scénarios d’origine, mais les fluides à 350 °C eux-mêmes ne sont pas un habitat cellulaire.",
        keyPoint: "Un extrêmophile montre qu’un milieu contraignant peut être habitable ; il ne prouve ni le lieu ni l’identité du premier vivant.",
        example: "Près d’un fumeur hydrothermal, les cellules occupent les zones de mélange refroidies et chimiquement riches, pas le fluide qui sort à environ 350 °C.",
        bodyMarkdown: `
## 1. Les organismes des sources chaudes et acides

Le document cite des microorganismes de **1 à 2 µm** vivant dans des eaux très chaudes et acides du parc de Yellowstone, jusqu’à environ 90 °C et pH 1. Le nom correct est **Sulfolobus**, et il s’agit d’une **archée** thermoacidophile, non d’une bactérie au sens moderne.

Ces organismes possèdent des membranes et des enzymes adaptées à la chaleur et à l’acidité. Ils montrent que les conditions compatibles avec une cellule sont plus larges que celles de notre environnement quotidien.

## 2. Les sources hydrothermales profondes

Les fumeurs des dorsales océaniques peuvent rejeter un fluide proche de **350 °C**, maintenu liquide par la forte pression. Cette valeur décrit le fluide à la sortie, pas la température interne des cellules voisines. Les microorganismes vivent dans les gradients où l’eau hydrothermale se mélange à l’eau océanique froide.

Ces milieux offrent :

- des minéraux pouvant catalyser des réactions ;
- des gradients de température, de pH et de composition chimique ;
- des molécules réduites comme le sulfure d’hydrogène, sources d’énergie pour certains métabolismes.

## 3. Comment raisonner par analogie ?

| Étape | Formulation correcte |
|---|---|
| observation | des cellules actuelles vivent dans des conditions chaudes, acides ou riches en sulfures |
| comparaison | certains caractères rappellent des environnements proposés pour la Terre primitive |
| hypothèse | une origine dans un milieu hydrothermal ou minéral est possible |
| limite | les organismes actuels ont eux-mêmes évolué pendant des milliards d’années |

Le schéma de synthèse du document ajoute les **sources chaudes** et les **argiles** parmi les lieux ou supports possibles de la chimie prébiotique. Les surfaces minérales peuvent concentrer des molécules et favoriser certaines réactions, mais elles ne constituent pas à elles seules une cellule.

> **Astuce mémoire - OHL :** **O**bserver, formuler une **H**ypothèse, annoncer la **L**imite.

> **Erreur fréquente :** « des organismes vivent près d’un fluide à 350 °C » ne signifie pas « des cellules vivent à 350 °C ».
`,
        processTitle: "Du milieu actuel à l’hypothèse ancienne",
        processInstruction: "Distingue l’observation actuelle, l’analogie et sa limite.",
        process: [
          { label: "Observer", detail: "Des archées et bactéries actuelles vivent dans des milieux chauds, acides ou riches en sulfures." },
          { label: "Situer", detail: "Près des fumeurs, elles occupent surtout les gradients de mélange compatibles avec la vie." },
          { label: "Comparer", detail: "Minéraux, gradients et molécules réduites rappellent certains scénarios de Terre primitive." },
          { label: "Inférer prudemment", detail: "Une origine hydrothermale est possible, mais ce lieu n’est pas démontré de façon unique." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Milieu interactif",
          title: "Un fumeur hydrothermal et ses gradients habitables",
          instruction: "Sélectionne chaque repère pour distinguer le fluide brûlant de l’habitat microbien.",
          viewBox: "0 0 700 390",
          caption: "Figure originale redessinée d’après le texte sur les fumeurs océaniques et le scénario des sources chaudes.",
          zones: [
            { label: "Océan froid", xStart: 0, xEnd: 238 },
            { label: "Zone de mélange", xStart: 238, xEnd: 476 },
            { label: "Cheminée minérale", xStart: 476, xEnd: 700 },
          ],
          shapes: [
            { shape: "path", d: "M455 346 L493 175 L565 175 L604 346 Z", tone: "outline" },
            { shape: "path", d: "M500 177 C480 135 488 101 523 69 C561 105 572 139 555 177 Z", tone: "accent" },
            { shape: "path", d: "M493 177 C426 183 393 220 365 264", tone: "muted" },
            { shape: "path", d: "M559 177 C623 184 647 225 655 264", tone: "muted" },
            { shape: "circle", cx: 420, cy: 223, r: 13, tone: "soft" },
            { shape: "circle", cx: 390, cy: 253, r: 10, tone: "soft" },
            { shape: "circle", cx: 619, cy: 223, r: 12, tone: "soft" },
            { shape: "line", x1: 523, y1: 342, x2: 523, y2: 188, tone: "accent" },
            { shape: "text", x: 523, y: 365, content: "chaleur + minéraux", anchor: "middle" },
            { shape: "text", x: 179, y: 89, content: "eau océanique froide", anchor: "middle" },
            { shape: "text", x: 198, y: 260, content: "cellules dans la zone de mélange", anchor: "middle" },
          ],
          hotspots: [
            { id: "hot-fluid", number: 1, label: "Fluide hydrothermal", detail: "Il peut atteindre environ 350 °C à la sortie profonde : cette température n’est pas celle des cellules voisines.", x: 525, y: 88, highlight: [{ shape: "path", d: "M500 177 C480 135 488 101 523 69 C561 105 572 139 555 177 Z", tone: "accent" }] },
            { id: "chimney", number: 2, label: "Cheminée minérale", detail: "Ses sulfures et autres minéraux fournissent surfaces catalytiques, micropores et gradients chimiques.", x: 550, y: 250, highlight: [{ shape: "path", d: "M455 346 L493 175 L565 175 L604 346 Z", tone: "accent" }] },
            { id: "mixing", number: 3, label: "Zone de mélange", detail: "L’eau chaude se refroidit au contact de l’océan ; des températures compatibles avec les cellules apparaissent.", x: 420, y: 195, highlight: [{ shape: "path", d: "M493 177 C426 183 393 220 365 264", tone: "accent" }] },
            { id: "microbes", number: 4, label: "Microorganismes", detail: "Ils exploitent des réactions chimiques dans les gradients. Leur existence soutient une possibilité, pas une preuve du premier habitat.", x: 391, y: 228, highlight: [{ shape: "circle", cx: 390, cy: 253, r: 10, tone: "accent" }] },
          ],
          observation: "La source d’énergie et les minéraux sont au cœur de l’hypothèse ; la zone réellement habitée se situe dans un gradient, pas dans le jet le plus chaud.",
        },
        observation: "Une analogie soutient une hypothèse, mais elle ne reconstitue pas directement l’événement ancien.",
        check: choice("Que montre principalement l’existence d’extrêmophiles actuels ?", ["Que tous les premiers êtres vivants étaient des animaux", "Que l’océan primitif était riche en O₂", "Que toute évolution s’est arrêtée", "Que la vie peut fonctionner dans des milieux très contraignants"], 3, "Les extrêmophiles élargissent les conditions connues de fonctionnement d’une cellule."),
        extraQuestions: [
          choice("Quel est le nom correct du microorganisme thermoacidophile cité dans le cours ?", ["Sulfolobus", "Sulfoborus", "Salmonella solaire", "Stromatolite"], 0, "Le document contient une coquille ; Sulfolobus est une archée thermoacidophile.", "Texte 2 • page 2"),
          choice("À quel domaine appartient Sulfolobus ?", ["Aux animaux", "Aux végétaux", "Aux archées", "Aux virus uniquement"], 2, "Sulfolobus est une archée adaptée à la chaleur et à l’acidité."),
          trueFalse("Des cellules vivent directement dans le fluide hydrothermal à 350 °C.", false, "Les organismes vivent dans des zones de mélange plus froides ; 350 °C décrit le fluide à la sortie.", "Texte 2 • page 2"),
          choice("Quel élément d’un système hydrothermal peut favoriser la chimie prébiotique ?", ["L’absence de toute énergie", "Les gradients et les surfaces minérales", "La disparition de l’eau", "Une atmosphère moderne riche en O₂"], 1, "Les gradients fournissent de l’énergie et les minéraux peuvent concentrer ou catalyser des molécules."),
          choice("Quelle conclusion dépasse les données ?", ["Les extrêmophiles vivent dans des milieux contraignants", "Une origine hydrothermale est une hypothèse possible", "Les organismes actuels ont eux-mêmes évolué", "Le premier être vivant était nécessairement un Sulfolobus actuel"], 3, "Une espèce actuelle n’est pas un fossile vivant identique au premier organisme."),
          choice("Pourquoi les argiles figurent-elles dans le scénario du document ?", ["Elles peuvent offrir des surfaces de concentration et de réaction", "Elles prouvent la présence de mammifères", "Elles produisent seules une cellule", "Elles empêchent toute polymérisation"], 0, "Les surfaces minérales sont étudiées comme supports possibles, non comme organismes.", "Document 3 • pages 5-6"),
          choice("Quel enchaînement correspond à un raisonnement scientifique par analogie ?", ["Croire → affirmer → ignorer", "Observer → comparer → proposer une hypothèse → annoncer la limite", "Conclure → supprimer les données", "Copier → généraliser sans condition"], 1, "La limite fait partie du raisonnement et empêche de transformer une possibilité en certitude."),
        ],
        distractors: ["Un extrêmophile actuel est nécessairement le premier être vivant.", "Aucune cellule ne peut vivre près d’une source hydrothermale.", "Les milieux extrêmes prouvent que l’atmosphère primitive était identique à l’actuelle."],
        source: originOfLifeSource(
          "2 et 5-7",
          "Texte 2, sources chaudes, fumeurs océaniques, argiles et scénario expérimental",
          [
            "« Sulfoborus/Sulforobus » est corrigé en Sulfolobus, archée thermoacidophile plutôt que bactérie au sens moderne.",
            "Les organismes vivent dans les gradients refroidis autour des fluides hydrothermaux ; le rejet à 350 °C n’est pas présenté comme une température cellulaire.",
            "L’analogie avec les milieux primitifs soutient une hypothèse d’origine, sans identifier définitivement le lieu ni le premier organisme.",
          ],
        ),
      },
      {
        id: "experimental-origin",
        title: "Comprendre les faits expérimentaux",
        summary: "Démonter le montage de Miller-Urey, distinguer coacervat, polymère et cellule, puis formuler exactement ce que l’expérience démontre.",
        conceptTitle: "La chimie prébiotique produit des briques, pas encore la vie",
        explanation: "Oparin et Haldane ont proposé une accumulation de molécules organiques dans l’océan primitif. Miller et Urey ont montré qu’un apport d’énergie à des gaz simples pouvait former des acides aminés. Coacervats, polymères et structures microscopiques testent ensuite des étapes d’assemblage, sans reproduire une cellule autonome.",
        keyPoint: "Molécules simples + énergie → molécules organiques → assemblages et compartiments possibles ; information, métabolisme et reproduction restent à expliquer.",
        example: "La glycine obtenue dans le piège du montage est un produit organique abiotique ; elle ne se nourrit pas, ne se régule pas et ne se reproduit pas.",
        bodyMarkdown: `
## 1. L’hypothèse d’Oparin et Haldane

Le document date de 1920 une proposition commune d’« Oparin et Aldane ». Plus précisément, **Alexandre Oparin** développe son hypothèse à partir de 1924 et **J. B. S. Haldane** publie une proposition voisine en 1929. Ils imaginent une accumulation progressive de molécules organiques dans les eaux primitives : la **soupe prébiotique**.

Leur idée essentielle reste féconde : avant les cellules, une évolution **chimique** aurait produit puis sélectionné des systèmes moléculaires de plus en plus organisés.

## 2. Le montage de Miller-Urey en 1953

Le montage forme un circuit fermé :

1. un ballon d’eau chauffée représente l’océan ;
2. la vapeur traverse un mélange gazeux supposé représenter l’atmosphère ;
3. des électrodes produisent des étincelles, analogues à une source d’énergie ;
4. un réfrigérant condense la vapeur ;
5. un piège permet de prélever les produits sans les exposer continuellement aux étincelles.

L’expérience historique utilise notamment méthane, ammoniac, hydrogène et vapeur d’eau dans une atmosphère très réductrice. Elle produit plusieurs composés organiques, dont des acides aminés comme la glycine et l’alanine.

> **Ce que l’expérience montre :** une synthèse **abiotique** de briques organiques est possible dans certaines conditions.

> **Ce qu’elle ne montre pas :** elle ne reproduit pas avec certitude l’atmosphère réelle de toute la Terre primitive et ne fabrique pas une cellule vivante.

## 3. Une atmosphère primitive moins réductrice

Les modèles ultérieurs donnent davantage de place au CO₂, au N₂ et à la vapeur d’eau, avec moins de méthane et d’ammoniac que dans le montage historique. Le document écrit qu’elle était « moins riche en méthane et en ammoniac qu’aujourd’hui » : c’est une formulation inversée, car l’atmosphère actuelle en contient très peu. Il faut lire : **moins riche que le mélange fortement réducteur supposé par l’expérience initiale**.

Des expériences adaptées continuent d’obtenir des molécules organiques, avec des rendements variables. La découverte de molécules carbonées et d’acides aminés dans certaines météorites montre aussi que cette chimie n’est pas limitée à la Terre.

## 4. Coacervats, polymères et structures ressemblant à des cellules

- Un **coacervat** est une gouttelette formée par séparation de phase entre molécules en solution. Ce n’est pas un simple « enchaînement d’acides aminés » et ce n’est pas une cellule.
- La **polymérisation** assemble des monomères en macromolécules : peptides, acides nucléiques ou autres polymères selon les conditions.
- Le document décrit une structure sphérique d’environ 2 µm obtenue à 250 °C et 130 atmosphères. Une ressemblance de forme avec un microorganisme ne démontre ni métabolisme, ni information héréditaire, ni reproduction.

## 5. Le seuil du vivant

Pour passer d’un assemblage chimique à une cellule, plusieurs fonctions doivent être coordonnées :

| Fonction | Rôle minimal |
|---|---|
| compartiment lipidique | séparer un milieu interne tout en permettant des échanges |
| information héréditaire | conserver et transmettre des instructions avec possibilité de variation |
| catalyse et métabolisme | accélérer des réactions et utiliser une source d’énergie |
| autorégulation | maintenir une organisation malgré les variations du milieu |
| reproduction | produire des descendants auxquels l’information est transmise |

Le document reconnaît correctement que le passage exact de la matière organique aux premières cellules reste **inconnu** et étudié par plusieurs hypothèses, dont le monde à ARN et les scénarios métabolisme d’abord.

> **Astuce mémoire - CAPRI :** **C**ompartiment, **A**utorégulation, **P**roduction d’énergie, **R**eproduction, **I**nformation.
`,
        processTitle: "De la matière minérale aux premières cellules",
        processInstruction: "Suis les étapes du scénario sans confondre molécule organique et être vivant.",
        process: [
          { label: "Molécules simples", detail: "Eau, CO₂, N₂, CH₄, NH₃ ou H₂ selon les scénarios reçoivent de l’énergie." },
          { label: "Briques organiques", detail: "Acides aminés, bases et autres composés peuvent apparaître puis s’accumuler." },
          { label: "Polymères", detail: "Des réactions d’assemblage peuvent produire des macromolécules." },
          { label: "Compartiments", detail: "Des lipides ou des phénomènes de séparation de phase isolent un milieu interne." },
          { label: "Système vivant", detail: "Information, catalyse, métabolisme, autorégulation et reproduction doivent fonctionner ensemble." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Montage interactif",
          title: "Le circuit fermé de Miller-Urey",
          instruction: "Sélectionne chaque pièce pour suivre l’eau, les gaz, l’énergie et les produits.",
          viewBox: "0 0 700 420",
          caption: "Figure originale redessinée d’après le montage de Miller-Urey présenté dans le document officiel.",
          shapes: [
            { shape: "circle", cx: 165, cy: 300, r: 66, tone: "soft" },
            { shape: "ellipse", cx: 446, cy: 119, rx: 100, ry: 72, tone: "soft" },
            { shape: "path", d: "M204 245 C245 187 289 135 346 119", tone: "outline" },
            { shape: "path", d: "M447 191 C456 234 462 265 447 301", tone: "outline" },
            { shape: "path", d: "M447 301 C410 346 296 357 226 330", tone: "outline" },
            { shape: "line", x1: 399, y1: 91, x2: 468, y2: 137, tone: "accent" },
            { shape: "line", x1: 489, y1: 90, x2: 423, y2: 138, tone: "accent" },
            { shape: "path", d: "M456 220 C498 218 527 239 531 273 C532 305 507 326 475 326", tone: "muted" },
            { shape: "ellipse", cx: 326, cy: 338, rx: 62, ry: 29, tone: "accent" },
            { shape: "text", x: 165, y: 297, content: "eau chauffée", anchor: "middle" },
            { shape: "text", x: 165, y: 320, content: "océan", anchor: "middle" },
            { shape: "text", x: 446, y: 65, content: "gaz + étincelles", anchor: "middle" },
            { shape: "text", x: 565, y: 274, content: "réfrigérant", anchor: "middle" },
            { shape: "text", x: 326, y: 343, content: "piège à produits", anchor: "middle" },
          ],
          hotspots: [
            { id: "ocean", number: 1, label: "Ballon d’eau", detail: "L’eau en ébullition représente l’océan et fournit une circulation continue de vapeur.", x: 163, y: 250, highlight: [{ shape: "circle", cx: 165, cy: 300, r: 66, tone: "accent" }] },
            { id: "atmosphere", number: 2, label: "Mélange gazeux", detail: "Le mélange historique est fortement réducteur ; il ne constitue qu’un modèle parmi plusieurs atmosphères primitives possibles.", x: 367, y: 71, highlight: [{ shape: "ellipse", cx: 446, cy: 119, rx: 100, ry: 72, tone: "accent" }] },
            { id: "energy", number: 3, label: "Étincelles", detail: "Les électrodes apportent de l’énergie et déclenchent des réactions entre les molécules simples.", x: 446, y: 119, highlight: [{ shape: "line", x1: 399, y1: 91, x2: 468, y2: 137, tone: "accent" }, { shape: "line", x1: 489, y1: 90, x2: 423, y2: 138, tone: "accent" }] },
            { id: "condenser", number: 4, label: "Réfrigérant", detail: "Il refroidit la vapeur et simule le retour de la pluie vers l’océan.", x: 531, y: 236, highlight: [{ shape: "path", d: "M456 220 C498 218 527 239 531 273 C532 305 507 326 475 326", tone: "accent" }] },
            { id: "trap", number: 5, label: "Piège", detail: "Il recueille les produits organiques, dont des acides aminés, et les protège d’une destruction continue par les étincelles.", x: 326, y: 309, highlight: [{ shape: "ellipse", cx: 326, cy: 338, rx: 62, ry: 29, tone: "accent" }] },
          ],
          observation: "Le montage teste une réaction chimique dans un modèle contrôlé : il ne reconstitue ni toute la planète ni une cellule complète.",
        },
        observation: "Une expérience valide la possibilité d’une étape ; elle ne démontre pas nécessairement tout le scénario historique.",
        check: choice("Qu’a montré l’expérience de Miller-Urey ?", ["La création complète d’un être vivant", "La formation possible de molécules organiques dans des conditions simulées", "L’impossibilité de la chimie prébiotique", "Une atmosphère primitive riche en O₂"], 1, "Des molécules organiques ont été obtenues abiotiquement, mais aucune cellule vivante n’a été créée."),
        extraQuestions: [
          choice("Quel élément du montage représente l’océan primitif ?", ["Les électrodes", "Le réfrigérant", "Le ballon d’eau chauffée", "Le robinet de prélèvement"], 2, "L’évaporation et la condensation font circuler l’eau dans le système.", "Figure 1, montage de Miller-Urey • pages 4 et 7"),
          choice("À quoi servent les étincelles ?", ["À fournir une source d’énergie aux réactions", "À fabriquer directement une membrane", "À supprimer tous les gaz", "À prouver la reproduction"], 0, "Elles simulent une source d’énergie comme les décharges électriques.", "Texte expérimental • page 3"),
          choice("Quels produits organiques sont explicitement cités dans le document ?", ["Amidon et cellulose uniquement", "ADN humain complet", "Cholestérol et hémoglobine", "Glycine et alanine"], 3, "Ces deux acides aminés figurent parmi les produits mentionnés.", "Texte expérimental • page 3"),
          choice("Qu’est-ce qu’un coacervat ?", ["Une cellule prouvée vieille de 4 milliards d’années", "Une gouttelette issue d’une séparation de phase entre molécules", "Un simple enchaînement d’acides aminés nécessairement enzymatique", "Un fossile de vertébré"], 1, "Un coacervat peut compartimenter des molécules, mais ne possède pas à lui seul toutes les fonctions du vivant.", "Texte expérimental • page 3"),
          trueFalse("La ressemblance d’une structure de 2 µm avec un microorganisme suffit à prouver qu’elle est vivante.", false, "Il faut démontrer métabolisme, autorégulation, information héréditaire et reproduction, pas seulement une forme.", "Figures 1-2 et texte • pages 3-4"),
          choice("Comment corriger la phrase « l’atmosphère primitive était moins riche en méthane et ammoniac qu’aujourd’hui » ?", ["Elle était probablement moins riche en CH₄ et NH₃ que le mélange très réducteur de Miller, pas que l’atmosphère actuelle", "Elle contenait exactement 100 % de méthane", "L’atmosphère actuelle est surtout composée d’ammoniac", "Aucune correction n’est nécessaire"], 0, "L’atmosphère moderne contient très peu de CH₄ et de NH₃ ; la comparaison pertinente porte sur le modèle historique fortement réducteur.", "Texte expérimental • pages 3-5"),
          choice("Que prouve la présence de molécules organiques dans certaines météorites ?", ["Que les météorites sont vivantes", "Que toute la vie terrestre vient obligatoirement de l’espace", "Qu’une chimie organique peut aussi se produire hors de la Terre", "Que l’eau est inutile"], 2, "C’est un apport possible de constituants, pas une preuve de panspermie cellulaire.", "Texte expérimental • page 3"),
          choice("Quelle propriété manque à une simple collection de macromolécules pour former un système vivant ?", ["Une couleur rouge", "Une organisation coordonnant information, métabolisme et reproduction", "Une masse supérieure à un kilogramme", "Un squelette"], 1, "La vie résulte d’un système organisé, pas de la seule présence de molécules.", "Interprétation • page 5"),
          trueFalse("Le document reconnaît que le passage exact de l’inanimé aux premières cellules reste inconnu.", true, "Il précise que les témoignages sont indirects et que les modalités exactes ne sont pas établies.", "Interprétation • page 5"),
          choice("Quel mot désigne l’assemblage de monomères en macromolécules ?", ["Respiration", "Oxydation", "Polymérisation", "Sédimentation"], 2, "La polymérisation relie des unités répétées pour former un polymère.", "Interprétation • page 5"),
        ],
        distractors: ["Un acide aminé isolé est déjà une cellule vivante.", "Les expériences prébiotiques ont reconstitué avec certitude toute l’histoire de la vie.", "Les molécules organiques ne peuvent provenir que d’un organisme vivant."],
        source: originOfLifeSource(
          "3-5 et 7",
          "Oparin-Haldane, Miller-Urey, coacervats, météorites, polymérisation et limites expérimentales",
          [
            "Oparin et Haldane sont nommés correctement et leurs propositions sont situées respectivement à partir de 1924 et en 1929 plutôt qu’en 1920 comme une hypothèse commune.",
            "Un coacervat est une gouttelette de séparation de phase, non un enchaînement d’acides aminés doté automatiquement de propriétés enzymatiques.",
            "La comparaison de l’atmosphère primitive est rétablie par rapport au mélange fortement réducteur de Miller, l’atmosphère actuelle étant très pauvre en méthane et en ammoniac.",
            "La structure de 2 µm obtenue à haute température et haute pression est décrite comme un objet d’apparence cellulaire, sans preuve de vie.",
          ],
        ),
      },
    ],
    mission: {
      title: "Reconstruire le passage des molécules à une protocellule",
      scenario: "Le document officiel associe énergie solaire, éclairs, atmosphère primitive, sources chaudes, argiles, comètes et météorites. Il fait converger ces apports vers des molécules organiques, puis vers protéines, lipides, acides nucléiques, membrane et vie. Exploite ce modèle sans présenter une simple association de molécules comme une cellule déjà vivante.",
      problem: "Comment l’espace, l’océan et la chimie prébiotique peuvent-ils fournir les constituants d’une protocellule, et quelle étape reste encore à expliquer ?",
      bodyMarkdown: `
## Document de mission redessiné sous forme de chaîne explicative

| Entrées du scénario | Action proposée | Produits ou fonctions possibles |
|---|---|---|
| atmosphère primitive, eau, CO₂, N₂ et autres gaz selon les hypothèses | énergie solaire, éclairs, chaleur et gradients chimiques | petites molécules organiques réactives |
| comètes et météorites | apport extraterrestre de molécules carbonées | enrichissement du stock organique |
| sources chaudes et surfaces d’argiles | concentration, catalyse et réactions d’assemblage | acides aminés, sucres, bases et phosphates puis polymères |
| lipides | auto-assemblage en bicouche | compartiment séparant intérieur et extérieur |
| acides nucléiques ou molécules apparentées | stockage, copie et variation d’information | hérédité possible |
| protéines ou autres catalyseurs | accélération des réactions | réseau métabolique possible |

## Réponse modèle aux trois consignes officielles

### 1. Éléments et matériaux venant de l’espace

Le schéma cite les **comètes** et les **météorites** comme matériaux pouvant apporter des molécules carbonées. L’énergie solaire et les éclairs sont des **sources d’énergie**, pas des matériaux.

### 2. Lieu proposé

Le document localise principalement la chimie prébiotique dans **l’océan primitif**, notamment près des sources chaudes et au contact de surfaces minérales comme les argiles. D’autres scénarios scientifiques existent ; le schéma présente une possibilité.

### 3. Association des constituants

Les lipides peuvent former une membrane qui compartimente le milieu. Des acides nucléiques portent une information transmissible ; des protéines ou d’autres catalyseurs accélèrent des réactions. Leur coordination peut former une **protocellule** capable d’échanges et d’une chimie interne.

Cependant, la flèche « protéines + lipides + acides nucléiques + membrane → vie » est trop rapide si elle laisse penser qu’un simple mélange suffit. Il faut encore expliquer l’apparition conjointe de la réplication, de l’hérédité avec variations, d’un métabolisme alimenté en énergie et de l’autorégulation.

> **Davy te souffle la méthode :** nomme d’abord les apports, localise le milieu, attribue un rôle à chaque famille de molécules, puis termine par la limite scientifique.
`,
      investigation: [
        { label: "Inventorier", detail: "Sépare les matériaux, les molécules simples et les sources d’énergie du schéma." },
        { label: "Localiser", detail: "Repère l’océan, les sources chaudes et les surfaces minérales." },
        { label: "Attribuer les rôles", detail: "Membrane, information héréditaire et catalyse ne remplissent pas la même fonction." },
        { label: "Assembler", detail: "Construis une protocellule comme système coordonné plutôt qu’une liste de molécules." },
        { label: "Limiter", detail: "Annonce que le passage historique exact à la première cellule reste inconnu." },
      ],
      interaction: {
        kind: "diagram",
        eyebrow: "Scénario interactif",
        title: "Des apports prébiotiques à une protocellule",
        instruction: "Ouvre chaque fonction puis vérifie ce qui manque encore pour parler de vie.",
        rootLabel: "Protocellule",
        rootDetail: "Un compartiment chimique organisé, modèle intermédiaire entre assemblage moléculaire et cellule vivante.",
        nodes: [
          { id: "inputs", label: "Apports", role: "Fournir les briques", detail: "Atmosphère, océan, sources chaudes, argiles, comètes et météorites alimentent une chimie organique possible.", group: "Avant le compartiment" },
          { id: "membrane", label: "Lipides", role: "Compartimenter", detail: "Une bicouche sépare un intérieur tout en autorisant des échanges sélectifs.", group: "Organisation" },
          { id: "information", label: "Acides nucléiques", role: "Informer et varier", detail: "Un support copiable permet hérédité et variations sur lesquelles une sélection peut agir.", group: "Organisation" },
          { id: "catalysis", label: "Catalyseurs", role: "Accélérer", detail: "Protéines, ARN catalytiques ou minéraux peuvent favoriser des réactions reliées en réseau.", group: "Fonctionnement" },
          { id: "energy", label: "Métabolisme", role: "Utiliser l’énergie", detail: "Le système doit entretenir son organisation en couplant réactions et source d’énergie.", group: "Fonctionnement" },
          { id: "reproduction", label: "Réplication", role: "Transmettre", detail: "La reproduction avec variation rend possible une évolution darwinienne durable.", group: "Seuil du vivant" },
        ],
        observation: "Aucune brique ne suffit seule : c’est le couplage durable entre compartiment, information, énergie et reproduction qui constitue le problème central.",
      },
      modelAnswer: "Comètes, météorites, atmosphère, sources d’énergie et surfaces minérales peuvent fournir ou concentrer des briques organiques dans l’océan primitif. Les lipides compartimentent, les acides nucléiques portent une information et des catalyseurs organisent les réactions. Ce scénario rend une protocellule plausible, mais le passage exact à un système autorégulé et reproducteur reste inconnu.",
      questions: [
        choice("Consigne officielle 1 - Quels matériaux de l’espace sont cités dans le scénario ?", ["Les nerfs et les muscles", "Les couches rouges et les os", "Les comètes et les météorites", "Les chromosomes sexuels"], 2, "Comètes et météorites peuvent transporter des molécules carbonées.", "Situation d’évaluation, consigne 1 • page 6"),
        choice("Consigne officielle 2 - Où le document localise-t-il principalement la chimie conduisant aux constituants du vivant ?", ["Dans le noyau d’une étoile", "Dans l’océan primitif, notamment près de sources chaudes et de surfaces minérales", "Dans un organisme pluricellulaire déjà formé", "Uniquement dans l’atmosphère moderne"], 1, "Le schéma fait converger les apports vers l’océan primitif.", "Situation d’évaluation, consigne 2 • page 6"),
        choice("Consigne officielle 3 - Quelle association décrit le mieux une protocellule plausible ?", ["Une roche rouge sans eau", "Un acide aminé isolé", "Une membrane vide sans chimie interne", "Un compartiment lipidique associant information héréditaire, catalyse et utilisation d’énergie"], 3, "La cellule exige une organisation fonctionnelle coordonnée.", "Situation d’évaluation, consigne 3 • page 6"),
      ],
      extraQuestions: [
        choice("Dans le schéma, quel élément est une source d’énergie plutôt qu’un matériau ?", ["Une météorite", "Une comète", "Un éclair", "Une molécule organique"], 2, "L’éclair apporte de l’énergie aux réactions ; il n’est pas incorporé comme constituant.", "Document 3 • pages 5-6"),
        choice("Quel est le rôle principal d’une membrane lipidique primitive ?", ["Compartimenter un milieu interne", "Créer à elle seule toute l’information", "Remplacer l’eau", "Prouver l’âge de la Terre"], 0, "La compartimentation rapproche et protège des réactions tout en permettant des échanges.", "Situation d’évaluation, consigne 3 • page 6"),
        choice("Quel constituant est le plus directement associé au stockage d’une information héréditaire ?", ["L’oxyde de fer", "Un acide nucléique ou polymère informationnel", "Une couche rouge", "Le dioxygène seul"], 1, "Une information copiable est nécessaire à l’hérédité et à l’évolution."),
        trueFalse("Mélanger protéines, lipides et acides nucléiques suffit automatiquement à créer une cellule vivante.", false, "Il faut une organisation couplant compartiment, information, métabolisme, autorégulation et reproduction.", "Document 3 et consigne 3 • pages 5-6"),
        choice("Pourquoi les expériences prébiotiques complètent-elles les archives rocheuses ?", ["Elles remplacent tous les faits historiques", "Elles suppriment l’incertitude", "Elles testent si certaines étapes chimiques sont possibles", "Elles prouvent que la Terre n’a jamais eu d’océan"], 2, "Les archives indiquent ce qui s’est passé dans le milieu ; les expériences testent des mécanismes possibles."),
        choice("Quelle conclusion finale respecte le mieux le cours ?", ["La première cellule historique a été recréée", "Les données soutiennent plusieurs étapes possibles, mais la transition exacte vers la première cellule reste inconnue", "Aucune molécule organique ne peut se former sans vie", "Les extrêmophiles sont nécessairement les ancêtres directs de tous les êtres vivants"], 1, "Une bonne conclusion associe les acquis et la limite.", "Conclusion générale • page 5"),
        choice("Comment appelle-t-on l’organisation cellulaire sans noyau individualisé attribuée aux premières formes connues ?", ["Organisation procaryote", "Organisation vertébrée", "Organisation florale", "Organisation placentaire"], 0, "Les procaryotes ne possèdent pas de noyau entouré d’une enveloppe.", "Conclusion générale • page 5"),
      ],
      source: originOfLifeSource(
        "5-7",
        "Document 3, situation d’évaluation officielle et documentation",
        [
          "La flèche directe « protéines + lipides + acides nucléiques + membrane → vie » est explicitée : une organisation coordonnant compartiment, information, énergie, autorégulation et reproduction est nécessaire.",
          "L’énergie solaire et les éclairs sont distingués des matériaux apportés par les comètes et météorites.",
          "Le document est traité comme un scénario possible centré sur l’océan primitif, non comme la preuve d’un lieu unique et définitivement établi.",
        ],
      ),
    },
  },
  {
    id: "terminale-svt-l4-human-lineage",
    chapterNumber: 4,
    themeNumber: 2,
    themeTitle: "Origine et évolution du vivant",
    title: "L’évolution de la lignée humaine",
    description: "Croiser fossiles, anatomie comparée et molécules homologues pour reconstituer une histoire humaine buissonnante, puis expliquer les mécanismes de l’évolution.",
    centralQuestion: "Quelles preuves permettent de reconstituer la lignée humaine et quels mécanismes font évoluer les populations ?",
    memorySentence: "Observer les caractères → comparer des homologues → établir une parenté → expliquer par variation, tri et temps.",
    overviewBodyMarkdown: `
## Une enquête fondée sur plusieurs preuves

La **lignée humaine** regroupe l’ensemble des espèces plus proches de *Homo sapiens* que des chimpanzés actuels depuis leur dernier ancêtre commun. Elle ne forme ni une échelle de progrès ni une file d’espèces se transformant l’une après l’autre : plusieurs lignées ont coexisté, se sont ramifiées et se sont éteintes.

| Indice étudié | Ce que l’on observe | Ce que l’on peut déduire |
|---|---|---|
| crânes et moulages endocrâniens | forme de la face, capacité crânienne, reliefs et vascularisation | transformations morphologiques au cours du temps |
| squelette et pied | colonne, bassin, proportions des membres, gros orteil, voûte plantaire | adaptation à une bipédie habituelle |
| molécules homologues | ressemblances et différences à des positions comparables | degré de parenté entre espèces |
| génétique des populations | mutations, recombinaisons et fréquences alléliques | mécanismes de l’évolution |

> **Davy te donne le fil rouge :** un seul caractère ne suffit jamais. Une conclusion solide fait **converger** plusieurs indices indépendants.

## Quatre confusions à éviter

1. L’être humain ne descend ni du chimpanzé ni du gorille actuels : ces espèces partagent des **ancêtres communs**.
2. Une grande capacité crânienne ne mesure pas, à elle seule, « l’intelligence ».
3. Une séquence identique sur 19 acides aminés ne rend pas deux espèces identiques.
4. Les mutations n’apparaissent pas parce qu’un organisme en a besoin ; la sélection trie des variations héréditaires déjà produites.

> **Astuce mémoire — FAMÉ :** **F**ossiles, **A**natomie, **M**olécules, **É**volution des populations.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte de l’enquête",
      title: "Quatre familles d’indices qui convergent",
      instruction: "Ouvre chaque carte et demande-toi ce qu’elle permet réellement de conclure.",
      rootLabel: "Lignée humaine",
      rootDetail: "Une histoire évolutive ramifiée reconstruite par confrontation de plusieurs documents.",
      nodes: [
        { id: "fossils", label: "Crânes fossiles", role: "Décrire le passé", detail: "La datation et les caractères morphologiques situent des espèces disparues et révèlent des transformations.", group: "Archives" },
        { id: "bipedalism", label: "Anatomie comparée", role: "Relier forme et fonction", detail: "Colonne, bassin, membres et pied renseignent sur le mode de locomotion.", group: "Archives" },
        { id: "molecules", label: "Molécules homologues", role: "Mesurer la proximité", detail: "Des séquences comparables accumulent des substitutions depuis un ancêtre commun.", group: "Parenté" },
        { id: "mechanisms", label: "Génétique des populations", role: "Expliquer l’évolution", detail: "Mutation, recombinaison, sélection, dérive et flux de gènes modifient les fréquences alléliques.", group: "Mécanismes" },
      ],
      observation: "La conclusion la plus robuste est celle qui reste compatible avec les fossiles, l’anatomie et les molécules.",
    },
    overviewExtraQuestions: [
      choice("Que désigne la lignée humaine ?", ["Les espèces plus proches de l’Homme que du chimpanzé depuis leur dernier ancêtre commun", "Tous les primates actuels sans distinction", "Seulement Homo sapiens", "Une suite obligatoire du gorille vers l’Homme"], 0, "La lignée humaine se définit par une parenté issue d’un ancêtre commun, pas par une échelle de perfection."),
      choice("Pourquoi dit-on que l’évolution humaine est buissonnante ?", ["Plusieurs lignées ont coexisté et se sont ramifiées", "Chaque espèce devient obligatoirement Homo sapiens", "Les fossiles sont tous du même âge", "Aucune lignée ne s’est éteinte"], 0, "Un buisson évolutif comporte des branches, des coexistences et des extinctions."),
      trueFalse("L’Homme descend du gorille actuel.", false, "L’Homme et le gorille actuels partagent des ancêtres communs ; l’un n’est pas l’ancêtre direct de l’autre."),
      choice("Quel ensemble correspond à FAMÉ ?", ["Force, alimentation, mémoire, énergie", "Face, animal, marche, espèce", "Fossiles, anatomie, molécules, évolution des populations", "Fossiles, âge, muscles, équilibre"], 2, "FAMÉ résume les quatre familles d’informations du parcours."),
      choice("Quelle démarche donne la conclusion la plus solide ?", ["Utiliser uniquement la taille du cerveau", "Choisir l’image la plus ressemblante", "Confondre ressemblance et filiation directe", "Croiser plusieurs indices indépendants"], 3, "La convergence des preuves réduit le risque d’une interprétation fondée sur un seul caractère."),
      trueFalse("Deux espèces peuvent être proches parentes sans que l’une soit l’ancêtre direct de l’autre.", true, "Deux branches actuelles peuvent descendre d’un ancêtre commun aujourd’hui disparu."),
      choice("Qu’apporte principalement une séquence moléculaire homologue ?", ["L’âge exact d’un fossile sans datation", "La preuve que deux espèces sont identiques", "Un indice quantifiable de parenté", "La longueur des membres"], 2, "On compare les substitutions à des positions homologues pour estimer une proximité."),
      choice("À quel niveau biologique observe-t-on l’évolution ?", ["Dans les populations au fil des générations", "Dans la volonté d’un individu", "Uniquement dans un muscle utilisé", "Dans un organisme qui change d’espèce pendant sa vie"], 0, "L’évolution correspond notamment à des changements de fréquences alléliques dans les populations."),
      trueFalse("La situation d’apprentissage introductive du PDF constitue une preuve scientifique.", false, "Elle sert de contexte pédagogique ; les preuves viennent des documents anatomiques, fossiles et moléculaires."),
    ],
    overviewSource: humanLineageSource(
      "1-7",
      "Problématique, organisation du cours et conclusion générale",
      [
        "La situation d’apprentissage introductive est volontairement retirée du cours ; ses questions biologiques sont conservées.",
        "La présentation linéaire « australopithèques → Homo habilis → Homo erectus → Néandertal → Homo sapiens » est remplacée par une évolution buissonnante.",
        "L’être humain n’est pas présenté comme descendant du gorille ou du chimpanzé actuels : les lignées partagent des ancêtres communs.",
      ],
    ),
    sections: [
      {
        id: "cranial-transformations",
        title: "Comparer le crâne et le cerveau",
        summary: "Décrire les transformations crâniennes visibles dans les fossiles tout en évitant une lecture linéaire ou une mesure simpliste de l’intelligence.",
        conceptTitle: "La boîte crânienne se transforme au cours de la lignée humaine",
        explanation: "Les documents comparent crânes et moulages endocrâniens attribués à plusieurs homininés. Ils montrent une transformation de la face et de la boîte crânienne ainsi qu’une augmentation globale de la capacité crânienne dans certaines branches. Ces tendances ne constituent ni une chaîne obligatoire ni une échelle d’intelligence.",
        keyPoint: "Décrire d’abord des caractères crâniens mesurables ; interpréter ensuite leur évolution dans un arbre ramifié.",
        example: "Un moulage endocrânien conserve la forme interne de la boîte crânienne et parfois l’empreinte de reliefs ou de vaisseaux, pas le cerveau lui-même.",
        bodyMarkdown: `
## 1. Ce que montrent les documents

Le PDF juxtapose des crânes et des représentations de cerveaux attribués à des australopithèques, à *Homo habilis*, à *Homo erectus*, à des Néandertaliens et à *Homo sapiens*. On peut relever :

- une **augmentation globale de la capacité crânienne** dans plusieurs branches du genre *Homo* ;
- une boîte crânienne plus développée relativement à la face ;
- des modifications du front, de la face et des reliefs osseux ;
- sur les moulages endocrâniens, des empreintes plus détaillées de circonvolutions et de vascularisation.

> **Précision :** un fossile ne conserve normalement pas le cerveau. Le **moulage endocrânien** reproduit l’intérieur de la boîte crânienne.

## 2. Décrire sans inventer une marche du progrès

| Bonne observation | Conclusion abusive |
|---|---|
| « la boîte crânienne de ce spécimen est plus volumineuse » | « cette espèce était forcément plus intelligente » |
| « ces deux fossiles présentent des caractères différents » | « le premier s’est obligatoirement transformé en second » |
| « plusieurs caractères changent globalement au cours du temps » | « toutes les espèces suivent une seule ligne vers l’Homme » |

Les Néandertaliens constituent une lignée proche ayant coexisté et échangé des gènes avec certains *Homo sapiens* ; ils ne sont pas un simple « stade inférieur » placé juste avant l’Homme actuel.

## 3. Capacité crânienne et intelligence

La capacité crânienne renseigne sur le volume disponible, mais les aptitudes cognitives dépendent aussi de l’organisation des réseaux, des connexions, du développement, du corps et de la culture. La phrase source « plus le cerveau est grand, plus l’intelligence est grande » est donc trop générale.

> **Astuce mémoire — FVC :** **F**orme, **V**olume, **C**irconvolutions. Décris ces trois indices avant de conclure.
`,
        processTitle: "Lire une série de crânes fossiles",
        processInstruction: "Observe les caractères pertinents sans classer les individus sur une simple échelle de valeur.",
        process: [
          { label: "Forme du crâne", shortLabel: "Crâne", detail: "La face, le front et la boîte crânienne présentent des modifications au fil des fossiles étudiés." },
          { label: "Volume cérébral", shortLabel: "Volume", detail: "La capacité crânienne augmente globalement dans plusieurs branches du genre Homo." },
          { label: "Organisation", detail: "Circonvolutions et vascularisation deviennent plus complexes dans les documents comparés." },
        ],
        observation: "Le volume cérébral est un indice parmi d’autres ; l’intelligence ne se réduit pas à une mesure unique.",
        interaction: {
          kind: "schema",
          eyebrow: "Morphologie interactive",
          title: "Comparer trois profils sans fabriquer une chaîne",
          instruction: "Sélectionne les repères pour apprendre à décrire les caractères visibles.",
          viewBox: "0 0 760 390",
          caption: "Schéma original de comparaison morphologique ; les profils sont volontairement simplifiés et ne représentent pas une filiation directe.",
          zones: [
            { label: "Homininé ancien", xStart: 0, xEnd: 250 },
            { label: "Genre Homo ancien", xStart: 250, xEnd: 510 },
            { label: "Homo sapiens", xStart: 510, xEnd: 760 },
          ],
          shapes: [
            { shape: "path", d: "M70 250 C55 185 84 116 151 99 C208 85 235 128 223 179 C214 216 183 239 177 284 C141 302 95 288 70 250", tone: "soft" },
            { shape: "path", d: "M117 188 C97 196 85 216 93 235 C101 254 125 257 146 249", tone: "outline" },
            { shape: "line", x1: 142, y1: 101, x2: 142, y2: 284, tone: "muted" },
            { shape: "path", d: "M302 257 C284 175 320 91 400 78 C469 67 498 120 480 185 C469 224 431 246 424 292 C383 313 327 297 302 257", tone: "soft" },
            { shape: "path", d: "M351 184 C331 194 319 215 327 236 C335 255 360 259 381 250", tone: "outline" },
            { shape: "line", x1: 394, y1: 79, x2: 394, y2: 292, tone: "muted" },
            { shape: "path", d: "M552 260 C537 164 579 72 666 66 C723 62 748 111 733 183 C724 226 690 248 686 296 C645 319 581 303 552 260", tone: "soft" },
            { shape: "path", d: "M603 181 C586 193 577 217 585 237 C594 256 618 260 640 250", tone: "outline" },
            { shape: "line", x1: 661, y1: 67, x2: 661, y2: 296, tone: "muted" },
            { shape: "text", x: 145, y: 330, content: "petite boîte / face projetée", anchor: "middle" },
            { shape: "text", x: 395, y: 330, content: "boîte plus développée", anchor: "middle" },
            { shape: "text", x: 650, y: 330, content: "front haut / face réduite", anchor: "middle" },
          ],
          hotspots: [
            { id: "vault", number: 1, label: "Boîte crânienne", detail: "Compare son développement relatif, sans transformer le schéma en échelle d’intelligence.", x: 650, y: 94, highlight: [{ shape: "ellipse", cx: 657, cy: 126, rx: 87, ry: 63, tone: "accent" }] },
            { id: "face", number: 2, label: "Projection de la face", detail: "La réduction globale du prognathisme est un caractère morphologique descriptible.", x: 597, y: 223, highlight: [{ shape: "path", d: "M603 181 C586 193 577 217 585 237 C594 256 618 260 640 250", tone: "accent" }] },
            { id: "mosaic", number: 3, label: "Évolution en mosaïque", detail: "Tous les caractères ne changent pas au même rythme et plusieurs espèces peuvent coexister.", x: 395, y: 170, highlight: [{ shape: "ellipse", cx: 395, cy: 180, rx: 102, ry: 118, tone: "accent" }] },
          ],
          observation: "Une série de profils permet de comparer des caractères ; elle ne démontre pas à elle seule une filiation directe.",
        },
        check: q("Quel caractère augmente globalement dans plusieurs branches allant des australopithèques au genre Homo ?", "La capacité de la boîte crânienne", "Le nombre de chromosomes", "La longueur de tous les bras", "Le nombre de groupes sanguins"),
        extraQuestions: [
          trueFalse("Exercice officiel 1, affirmation 1 — « Le passage des australopithèques à Homo sapiens se caractérise par une augmentation du volume de la boîte crânienne et du cerveau. »", true, "Le document met en évidence cette tendance globale, sans en faire une filiation linéaire.", "Exercice 1, affirmation 1 • pages 8-9"),
          trueFalse("Exercice officiel 1, affirmation 2 — « Il s’accompagne d’une augmentation des ramifications des vaisseaux sanguins. »", true, "Le document interprète les empreintes endocrâniennes comme une vascularisation plus ramifiée.", "Exercice 1, affirmation 2 • pages 8-9"),
          trueFalse("Exercice officiel 1, affirmation 3 — « Le passage s’accompagne de la disparition des circonvolutions cérébrales. »", false, "Le cours décrit au contraire une augmentation ou une complexification des circonvolutions.", "Exercice 1, affirmation 3 • pages 8-9"),
          trueFalse("Exercice officiel 1, affirmation 4 — « La morphologie du crâne se modifie. »", true, "Les profils montrent notamment des changements de la boîte crânienne et de la face.", "Exercice 1, affirmation 4 • pages 8-9"),
          choice("Que conserve directement un moulage endocrânien ?", ["Le cerveau vivant complet", "Les pensées de l’individu", "La forme de la cavité interne du crâne", "Son groupe sanguin"], 2, "Il reproduit la surface interne de la boîte crânienne."),
          choice("Pourquoi la capacité crânienne ne suffit-elle pas à mesurer l’intelligence ?", ["Le cerveau n’a aucun rôle", "Tous les cerveaux ont exactement le même volume", "Les fossiles conservent les souvenirs", "Les fonctions cognitives dépendent aussi de l’organisation des réseaux et du contexte"], 3, "Le volume est un indice anatomique, pas une mesure complète des capacités cognitives."),
          trueFalse("Homo neanderthalensis doit être présenté comme un simple stade inférieur directement transformé en Homo sapiens.", false, "Néandertaliens et Homo sapiens sont des lignées proches qui ont coexisté et se sont parfois hybridées."),
          choice("Quelle phrase est une observation et non une interprétation ?", ["L’espèce B était forcément plus intelligente", "A s’est nécessairement transformé en B", "La boîte crânienne du spécimen B est plus développée que celle du spécimen A", "B est plus évolué au sens absolu"], 2, "Une observation décrit un caractère visible ou mesurable."),
          choice("Que signifie une évolution en mosaïque ?", ["Les caractères peuvent évoluer à des rythmes différents", "Tous les caractères changent ensemble", "Une mosaïque crée les mutations", "Tous les fossiles sont contemporains"], 0, "Différentes parties de l’organisme ne se transforment pas nécessairement au même rythme."),
        ],
        source: humanLineageSource(
          "1-2 et 8-12",
          "Transformations de la boîte crânienne, exercice de consolidation 1 et situation d’évaluation",
          [
            "La série de crânes est expliquée comme un échantillon de branches et non comme une succession directe obligatoire.",
            "Homo neanderthalensis est replacé comme une lignée proche de Homo sapiens, et non comme un stade linéaire inférieur.",
            "La relation source « plus la taille du cerveau augmente, plus l’intelligence est grande » est nuancée : le volume cérébral ne mesure pas seul les capacités cognitives.",
          ],
        ),
        distractors: ["Toutes les espèces fossiles forment une seule ligne sans branchement.", "L’évolution humaine se résume au poids du cerveau.", "Les fossiles ne permettent aucune comparaison morphologique."],
      },
      {
        id: "bipedal-stature",
        title: "Reconnaître les caractères de la bipédie",
        summary: "Relier colonne, bassin, proportions des membres et pied à la bipédie habituelle en corrigeant les comparaisons ambiguës du document.",
        conceptTitle: "La stature humaine porte les marques de la bipédie",
        explanation: "La colonne vertébrale humaine présente plusieurs courbures qui équilibrent le tronc. Le bassin est court et large, les membres inférieurs sont longs, le gros orteil est aligné avec les autres et la voûte plantaire est développée. Ces caractères diffèrent de ceux des grands singes adaptés aussi à la grimpe.",
        keyPoint: "Colonne à plusieurs courbures, bassin court et large, membres inférieurs longs et pied voûté favorisent la bipédie permanente.",
        example: "Un gros orteil aligné et une voûte plantaire développée transforment le pied en appui et levier pendant la marche.",
        bodyMarkdown: `
## 1. Comparer des structures homologues

Le document utilise alternativement les mots **chimpanzé** et **gorille** pour une même colonne. Ce sont pourtant deux genres distincts. Lorsque l’image ne permet pas de trancher, on compare ici l’être humain à un **grand singe non humain**.

| Caractère | Grand singe non humain représenté | Être humain | Conséquence fonctionnelle chez l’être humain |
|---|---|---|---|
| colonne vertébrale | courbure générale moins marquée | plusieurs courbures, profil en S | équilibre du tronc au-dessus du bassin |
| bassin | relativement étroit et allongé | court et large | soutien des viscères et stabilisation en appui unipodal |
| proportions | bras relativement longs, jambes plus courtes | jambes relativement longues, bras plus courts | pas plus long et locomotion terrestre efficace |
| pied | gros orteil plus divergent, voûte moins marquée | gros orteil aligné, voûtes développées | propulsion, appui et amortissement |

> **Correction importante :** le tableau source inverse la tendance relative des membres supérieurs en présentant les bras humains comme plus longs. Comparativement au tronc et aux jambes, les humains ont des bras **plus courts** et des membres inférieurs **plus longs** que les grands singes africains.

## 2. Une fonction construite par un ensemble

La bipédie habituelle ne dépend pas d’un os isolé. Les courbures de la colonne placent la masse du tronc au-dessus du bassin ; le bassin stabilise le corps lorsque l’autre jambe avance ; les jambes assurent la progression ; le pied voûté amortit puis propulse.

> **Astuce mémoire — CoBaJaPi :** **Co**lonne, **Ba**ssin, **Ja**mbes, **Pi**ed.

## 3. Éviter un faux raisonnement

Dire qu’un caractère « favorise la bipédie » ne signifie pas qu’il est apparu parce qu’un individu voulait marcher. Des variations héréditaires ont été transmises et triées au fil des générations.
`,
        processTitle: "Du squelette à la fonction",
        processInstruction: "Relie chaque transformation à son avantage biomécanique.",
        process: [
          { label: "Colonne", detail: "Ses courbures répartissent les charges et maintiennent le centre de gravité." },
          { label: "Bassin", detail: "Court et large, il soutient les organes et stabilise le tronc en appui sur une jambe." },
          { label: "Membres inférieurs", shortLabel: "Jambes", detail: "Leur allongement améliore la longueur du pas et l’efficacité de la marche." },
          { label: "Pied", detail: "Orteils alignés et voûte plantaire assurent propulsion et amortissement." },
        ],
        observation: "Un caractère anatomique prend son sens lorsqu’on le relie à une fonction et à l’ensemble du squelette.",
        interaction: {
          kind: "schema",
          eyebrow: "Anatomie fonctionnelle",
          title: "Du tronc au pied : quatre appuis de la bipédie",
          instruction: "Sélectionne chaque repère pour relier la structure à sa fonction.",
          viewBox: "0 0 720 440",
          caption: "Schéma original et simplifié d’un squelette humain en station bipède.",
          shapes: [
            { shape: "circle", cx: 360, cy: 67, r: 38, tone: "soft" },
            { shape: "path", d: "M353 106 C321 145 389 166 351 211 C332 233 345 256 361 273", tone: "outline" },
            { shape: "path", d: "M302 231 C322 206 397 206 418 231 C402 264 324 264 302 231", tone: "soft" },
            { shape: "line", x1: 318, y1: 224, x2: 253, y2: 345, tone: "outline" },
            { shape: "line", x1: 402, y1: 224, x2: 467, y2: 345, tone: "outline" },
            { shape: "line", x1: 330, y1: 256, x2: 314, y2: 381, tone: "outline" },
            { shape: "line", x1: 390, y1: 256, x2: 406, y2: 381, tone: "outline" },
            { shape: "path", d: "M314 381 C303 399 279 406 260 395 C273 386 294 382 314 381", tone: "soft" },
            { shape: "path", d: "M406 381 C417 399 441 406 460 395 C447 386 426 382 406 381", tone: "soft" },
            { shape: "path", d: "M272 395 C282 380 302 380 314 395", tone: "accent" },
            { shape: "path", d: "M406 395 C418 380 438 380 448 395", tone: "accent" },
            { shape: "text", x: 360, y: 425, content: "appui stable • propulsion • amortissement", anchor: "middle" },
          ],
          hotspots: [
            { id: "spine", number: 1, label: "Colonne en S", detail: "Ses courbures replacent le centre de masse au-dessus des appuis et amortissent les contraintes.", x: 372, y: 155, highlight: [{ shape: "path", d: "M353 106 C321 145 389 166 351 211 C332 233 345 256 361 273", tone: "accent" }] },
            { id: "pelvis", number: 2, label: "Bassin court et large", detail: "Il soutient les viscères et offre des insertions musculaires stabilisant le bassin en appui sur une jambe.", x: 360, y: 231, highlight: [{ shape: "ellipse", cx: 360, cy: 232, rx: 61, ry: 29, tone: "accent" }] },
            { id: "legs", number: 3, label: "Jambes longues", detail: "Les membres inférieurs relativement longs augmentent l’amplitude et l’efficacité du pas.", x: 406, y: 321, highlight: [{ shape: "line", x1: 390, y1: 256, x2: 406, y2: 381, tone: "accent" }] },
            { id: "foot", number: 4, label: "Pied voûté", detail: "Le gros orteil aligné et les voûtes transforment le pied en appui, ressort et levier.", x: 448, y: 395, highlight: [{ shape: "path", d: "M406 381 C417 399 441 406 460 395 C447 386 426 382 406 381", tone: "accent" }] },
          ],
          observation: "La bipédie habituelle résulte de la coopération de plusieurs caractères anatomiques, pas d’un os isolé.",
        },
        check: q("Quel caractère du bassin humain favorise la bipédie ?", "Il est court et large", "Il est absent", "Il est très étroit et allongé", "Il porte un pouce opposable"),
        extraQuestions: [
          choice("Exercice officiel 2 — Combien de courbures le tableau attribue-t-il à la colonne humaine ?", ["Quatre", "Une", "Aucune", "Douze"], 0, "Le tableau source oppose une courbure générale chez le grand singe représenté à quatre courbures chez l’Homme.", "Exercice 2 • page 9"),
          choice("Exercice officiel 2 — Comment le bassin humain est-il décrit ?", ["Étroit et allongé", "Absent", "Large et court", "Long et cylindrique"], 2, "Le bassin humain est large et court.", "Exercice 2 • page 9"),
          choice("Exercice officiel 2 — Quelle paume faut-il associer à l’Homme dans la liste proposée ?", ["Une paume large", "Une paume absente", "Une paume à voûte", "Une paume mince"], 3, "La correction du tableau place « paume mince » dans la colonne Homme.", "Exercice 2 • page 9"),
          choice("Exercice officiel 2 — Quelle voûte plantaire faut-il associer à l’Homme ?", ["Une voûte plus développée", "Une voûte moins développée", "Aucune structure osseuse", "Une voûte située dans la main"], 0, "La voûte plantaire humaine est plus développée.", "Exercice 2 • page 9"),
          choice("Quelle comparaison des proportions des membres est correcte ?", ["Chez l’Homme, bras relativement plus longs que chez les grands singes", "Les proportions sont toujours identiques", "Chez l’Homme, jambes relativement longues et bras relativement courts", "La bipédie raccourcit tous les membres"], 2, "Les proportions relatives humaines favorisent la locomotion bipède."),
          choice("Quel rôle joue principalement la voûte plantaire ?", ["Amortir et restituer de l’énergie pendant le pas", "Saisir les branches avec un gros orteil opposable", "Augmenter le volume crânien", "Fabriquer des mutations"], 0, "La voûte fonctionne comme un ressort et répartit les charges."),
          trueFalse("Le gros orteil humain est fortement opposable aux autres orteils.", false, "Il est aligné avec les autres et participe à la propulsion."),
          choice("Pourquoi le bassin doit-il être stabilisé pendant la marche ?", ["Le corps passe alternativement en appui sur une seule jambe", "Les deux pieds restent toujours en l’air", "Le cerveau remplace les muscles", "La colonne n’a aucun rôle"], 0, "Les muscles attachés au bassin empêchent sa chute du côté du membre levé."),
          trueFalse("Le chimpanzé et le gorille sont deux noms interchangeables pour la même espèce.", false, "Ce sont deux genres distincts ; le document mélange leurs noms dans certaines légendes."),
        ],
        source: humanLineageSource(
          "3-4 et 9-12",
          "Comparaison de la stature et exercice de consolidation 2",
          [
            "Les mentions « chimpanzé » et « gorille » sont distinguées ; le terme « grand singe non humain » est employé lorsque la figure source reste ambiguë.",
            "L’inversion des proportions des membres supérieurs est corrigée : l’Homme possède des bras relativement plus courts et des jambes relativement plus longues que les grands singes africains.",
            "La colonne vertébrale n’est pas réduite à un décompte rigide : le profil humain en S est relié à sa fonction biomécanique.",
          ],
        ),
        distractors: ["Le pied humain possède un gros orteil fortement opposable pour saisir les branches.", "La bipédie dépend uniquement de la taille du cerveau.", "La colonne humaine ne présente aucune courbure."],
      },
      {
        id: "molecular-parentage",
        title: "Mesurer la parenté moléculaire",
        summary: "Aligner le même fragment de bêta-hémoglobine, compter les substitutions et formuler une parenté sans inventer un ancêtre direct.",
        conceptTitle: "Les ressemblances moléculaires témoignent d’ancêtres communs",
        explanation: "Dans le fragment de 19 acides aminés présenté, la séquence humaine est identique à celle du gorille, diffère par deux positions de celle du porc et par quatre de celle du cheval. Ces résultats indiquent une proximité relative pour cette molécule, sans prouver une identité génétique complète ni une descendance directe.",
        keyPoint: "Pour une même molécule homologue, peu de différences de séquence indiquent généralement une parenté évolutive plus proche.",
        example: "0 différence Homme-gorille, 2 avec le porc, 4 avec le cheval : le gorille est le plus proche parmi les espèces comparées, sans être l’ancêtre direct de l’Homme.",
        bodyMarkdown: `
## 1. L’alignement du document

Le cours compare les **19 premiers acides aminés** de la chaîne bêta de l’hémoglobine. Les positions doivent rester alignées : on compare la même molécule homologue au même rang.

| Position variable | Homme | Gorille | Porc | Cheval |
|---|---|---|---|---|
| 4 | THR | THR | SER | SER |
| 5 | PRO | PRO | ALA | GLY |
| 9 | SER | SER | SER | ALA |
| 12 | THR | THR | THR | LEU |

Toutes les autres positions du fragment sont identiques dans le tableau. Le document écrit **TRY** à la position 15 ; l’abréviation internationale de la tyrosine est **TYR**.

## 2. Compter sans se tromper

- Homme ↔ gorille : **0 différence** sur 19 ;
- Homme ↔ porc : **2 différences** ;
- Homme ↔ cheval : **4 différences** ;
- porc ↔ cheval : **3 différences**.

Plus le nombre de substitutions est faible pour une molécule homologue, plus le **dernier ancêtre commun** est généralement récent. Cette règle doit être appliquée à plusieurs molécules ou à de longues séquences pour obtenir une phylogénie robuste.

## 3. Ce que le document prouve — et ne prouve pas

| Conclusion permise | Conclusion interdite |
|---|---|
| le gorille est le plus proche de l’Homme parmi ces trois espèces comparées | le gorille actuel est l’ancêtre de l’Homme |
| les quatre mammifères partagent des caractères moléculaires hérités | les quatre espèces sont identiques |
| des substitutions se sont accumulées après des séparations de lignées | chaque différence donne automatiquement une date exacte |

> **Astuce mémoire — ACC :** **A**ligner, **C**ompter, **C**onclure avec prudence.
`,
        processTitle: "Comparer les séquences",
        processInstruction: "Passe de l’alignement des acides aminés à l’arbre de parenté.",
        process: [
          { label: "Aligner", detail: "Comparer la même protéine et les mêmes positions chez toutes les espèces." },
          { label: "Compter", detail: "Relever le nombre de substitutions d’acides aminés." },
          { label: "Classer", detail: "Le plus petit nombre de différences indique l’ancêtre commun le plus récent parmi les comparaisons." },
          { label: "Nuancer", detail: "Une espèce actuelle proche n’est pas l’ancêtre direct d’une autre espèce actuelle." },
        ],
        observation: "La parenté moléculaire complète les caractères anatomiques et les fossiles.",
        interaction: {
          kind: "diagram",
          eyebrow: "Distance moléculaire",
          title: "Du fragment d’hémoglobine à la parenté",
          instruction: "Sélectionne une espèce pour retrouver son nombre de différences avec l’Homme.",
          rootLabel: "Homme : 19 acides aminés",
          rootDetail: "Fragment de référence de la chaîne bêta de l’hémoglobine dans le document.",
          nodes: [
            { id: "gorilla", label: "Gorille", role: "0 différence", detail: "Le fragment est identique à celui de l’Homme. Cela indique la plus forte proximité parmi les espèces du tableau, pas une identité totale.", group: "Primates" },
            { id: "pig", label: "Porc", role: "2 différences", detail: "Substitutions aux positions 4 et 5 du fragment.", group: "Autres mammifères" },
            { id: "horse", label: "Cheval", role: "4 différences", detail: "Substitutions aux positions 4, 5, 9 et 12 du fragment.", group: "Autres mammifères" },
            { id: "method", label: "Limite du test", role: "19 positions seulement", detail: "Une courte séquence a un pouvoir de résolution limité ; une conclusion moderne mobilise beaucoup plus de données.", group: "Prudence" },
          ],
          observation: "La distance moléculaire relative aide à ordonner les parentés ; elle ne transforme jamais une espèce actuelle en ancêtre direct d’une autre.",
        },
        check: q("Dans le document du cours, quelle espèce a la séquence la plus proche de celle de l’Homme ?", "Le gorille", "Le cheval", "Le porc", "Aucune"),
        extraQuestions: [
          choice("Exercice officiel 3 — Combien de différences le fragment humain présente-t-il avec celui du gorille ?", ["2", "3", "0", "4"], 2, "Les 19 positions sont identiques dans le tableau.", "Exercice 3, consigne 1 • pages 10-11"),
          choice("Exercice officiel 3 — Combien de différences séparent l’Homme et le porc ?", ["2", "0", "3", "4"], 0, "Les positions 4 et 5 diffèrent.", "Exercice 3, consigne 1 • pages 10-11"),
          choice("Exercice officiel 3 — Combien de différences séparent l’Homme et le cheval ?", ["0", "2", "19", "4"], 3, "Les positions 4, 5, 9 et 12 diffèrent.", "Exercice 3, consigne 1 • pages 10-11"),
          choice("Exercice officiel 3 — Combien de différences séparent le porc et le cheval ?", ["3", "1", "2", "4"], 0, "Ils diffèrent aux positions 5, 9 et 12.", "Exercice 3, correction • page 11"),
          choice("Quelles positions diffèrent entre l’Homme et le porc ?", ["4 et 5", "9 et 12", "1 et 19", "15 et 16"], 0, "THR/PRO chez l’Homme deviennent SER/ALA chez le porc."),
          choice("Quelle est l’abréviation correcte de la tyrosine ?", ["TRY", "TYA", "TYR", "TRP"], 2, "Le tableau source contient « TRY » ; la norme à trois lettres est TYR."),
          trueFalse("Un fragment identique de 19 acides aminés prouve que les génomes humain et gorille sont entièrement identiques.", false, "L’identité ne porte que sur le fragment comparé."),
          choice("Pourquoi faut-il comparer des molécules homologues ?", ["Pour que les positions aient une origine commune et soient comparables", "Pour obtenir toujours zéro différence", "Pour remplacer toute datation", "Pour prouver qu’une espèce ne change jamais"], 0, "Une homologie permet d’interpréter les substitutions comme des modifications héritées depuis un ancêtre commun."),
          choice("Quelle conclusion respecte l’exercice et la science moderne ?", ["L’Homme et le gorille partagent un ancêtre commun plus récent que celui partagé avec le porc ou le cheval", "Le gorille s’est transformé en Homme", "Le cheval est le plus proche de l’Homme", "Le porc est l’ancêtre du gorille"], 0, "Le plus faible nombre de différences indique ici la parenté relative la plus proche."),
        ],
        source: humanLineageSource(
          "4-5 et 10-11",
          "Comparaison moléculaire de la chaîne bêta de l’hémoglobine et exercice de consolidation 3",
          [
            "L’abréviation « TRY » du tableau est normalisée en « TYR » pour la tyrosine.",
            "L’identité du fragment Homme-gorille est limitée aux 19 positions comparées ; elle ne vaut ni identité protéique globale ni identité génomique.",
            "La formulation « l’Homme proviendrait d’une lignée de singe » est rétablie : Homme et grands singes actuels partagent des ancêtres communs.",
            "Le nombre de différences est utilisé comme distance relative, pas comme horloge donnant automatiquement une date exacte.",
          ],
        ),
        distractors: ["Le gorille actuel est l’ancêtre direct de l’Homme actuel.", "Plus les séquences diffèrent, plus la parenté est proche.", "On peut comparer n’importe quelles protéines sans vérifier leur homologie."],
      },
      {
        id: "evolution-theories",
        title: "Comparer les théories de l’évolution",
        summary: "Distinguer les propositions historiques et construire l’explication moderne par variation héréditaire, forces évolutives et temps.",
        conceptTitle: "La théorie synthétique articule variation, sélection et temps",
        explanation: "Lamarck expliquait l’évolution par l’usage et la transmission de caractères acquis. Darwin a proposé la sélection naturelle agissant sur des variations héréditaires. La génétique a révélé mutations et recombinaisons ; la théorie synthétique décrit l’évolution comme un changement de fréquences alléliques sous l’effet de plusieurs forces, dont la sélection, dans les populations au cours du temps.",
        keyPoint: "Variations héréditaires produites notamment par mutations et recombinaisons + sélection et autres forces + temps = évolution des populations.",
        example: "Une mutation avantageuse dans un milieu peut devenir plus fréquente parce que ses porteurs la transmettent davantage, et non parce qu’ils en ont eu besoin.",
        bodyMarkdown: `
## 1. Quatre étapes dans l’histoire des idées

| Proposition | Idée centrale | Statut ou limite |
|---|---|---|
| Lamarck | l’usage et le non-usage modifieraient les organes ; les caractères acquis seraient transmis | explication historique, non retenue comme mécanisme général de l’hérédité |
| Darwin | les individus présentent des variations ; le milieu favorise ceux qui laissent davantage de descendants | mécanisme majeur : sélection naturelle |
| De Vries et Morgan | les mutations et les chromosomes participent à la variation héréditaire | la génétique précise l’origine et la transmission de variations |
| théorie synthétique | mutations, recombinaisons et plusieurs forces modifient les fréquences alléliques | cadre moderne de l’évolution des populations |

## 2. La chaîne causale moderne

1. Des **mutations** et la **recombinaison** créent ou réassortissent des variants héréditaires.
2. Dans un milieu donné, certains variants influencent le **succès reproducteur**.
3. La **sélection naturelle** peut augmenter la fréquence de variants avantageux.
4. La **dérive génétique**, les **flux de gènes** et les accouplements modifient aussi les fréquences.
5. L’isolement et l’accumulation de différences peuvent conduire à la **spéciation**.

> **Correction majeure :** les mutations ne sont pas « orientées par la sélection ». Elles apparaissent sans tenir compte du besoin adaptatif ; la sélection agit ensuite sur leurs effets héréditaires.

## 3. « Le plus apte » ne veut pas dire « le plus fort »

La valeur sélective mesure la contribution d’un individu à la génération suivante dans un environnement donné. Un caractère avantageux dans un milieu peut devenir neutre ou défavorable dans un autre.

> **Astuce mémoire — VaSTe :** **Va**riation, **S**élection, **Te**mps. Ajoute dérive et flux de gènes pour l’explication complète.
`,
        processTitle: "Une explication qui s’enrichit",
        processInstruction: "Compare l’idée centrale et la limite de chaque proposition historique.",
        process: [
          { label: "Lamarck", detail: "L’usage modifierait les organes et les caractères acquis seraient transmis ; ce mécanisme général n’est pas retenu par la génétique moderne." },
          { label: "Darwin", detail: "La sélection naturelle favorise les variations héréditaires qui améliorent le succès reproducteur." },
          { label: "Génétique", detail: "Mutations et recombinaisons produisent de la diversité héréditaire." },
          { label: "Synthèse moderne", detail: "L’évolution correspond aux changements génétiques des populations sous plusieurs forces au cours du temps." },
        ],
        observation: "La sélection naturelle ne crée pas les mutations dont un organisme aurait besoin ; elle trie des variations déjà présentes.",
        interaction: {
          kind: "diagram",
          eyebrow: "Synthèse évolutive",
          title: "Produire la diversité, modifier les fréquences",
          instruction: "Ouvre chaque force et distingue la production des variants de leur tri.",
          rootLabel: "Population au fil des générations",
          rootDetail: "L’évolution est un changement héréditaire mesurable dans une population.",
          nodes: [
            { id: "mutation", label: "Mutations", role: "Nouveaux allèles", detail: "Elles apparaissent sans être dirigées par les besoins futurs de l’organisme.", group: "Créer la diversité" },
            { id: "recombination", label: "Recombinaison", role: "Nouvelles associations", detail: "La méiose et la fécondation réassortissent les allèles existants.", group: "Créer la diversité" },
            { id: "selection", label: "Sélection naturelle", role: "Succès reproducteur différentiel", detail: "Dans un milieu donné, certains phénotypes transmettent davantage leurs allèles.", group: "Modifier les fréquences" },
            { id: "drift", label: "Dérive génétique", role: "Effet du hasard", detail: "Les fréquences peuvent varier aléatoirement, surtout dans les petites populations.", group: "Modifier les fréquences" },
            { id: "flow", label: "Flux de gènes", role: "Échanges entre populations", detail: "Les migrations d’individus ou de gamètes introduisent et retirent des allèles.", group: "Modifier les fréquences" },
            { id: "isolation", label: "Isolement", role: "Divergence", detail: "La réduction des échanges permet l’accumulation de différences et peut conduire à la spéciation.", group: "Conséquences" },
          ],
          observation: "La sélection n’est qu’une force parmi plusieurs, mais elle seule trie systématiquement selon l’effet des caractères sur la reproduction dans un milieu.",
        },
        check: q("Sur quoi agit la sélection naturelle ?", "Sur des variations héréditaires présentes dans une population", "Sur les besoins conscients des individus", "Sur des caractères acquis par exercice uniquement", "Sur aucune variation"),
        extraQuestions: [
          choice("Quelle proposition correspond à Lamarck dans le document ?", ["Les fréquences alléliques changent par dérive", "L’ADN est recombiné pendant la méiose", "L’usage et le non-usage modifieraient les organes et les caractères acquis seraient transmis", "Les espèces ne changent jamais"], 2, "C’est l’explication historique transformiste de Lamarck.", "Théories de l’évolution • page 5"),
          choice("Quel mécanisme Darwin met-il au centre de son explication ?", ["La transmission systématique des caractères acquis", "La création volontaire de mutations", "L’absence de compétition", "La sélection naturelle"], 3, "Darwin explique le tri des variations par le succès différentiel.", "Théories de l’évolution • pages 5-6"),
          trueFalse("Les mutations utiles apparaissent parce que la population en a besoin.", false, "L’apparition d’une mutation n’est pas orientée par son utilité future."),
          choice("Que mesure la valeur sélective ?", ["La contribution relative à la génération suivante", "La force musculaire absolue", "La taille du cerveau seulement", "Le nombre de fossiles trouvés"], 0, "La valeur sélective concerne survie et surtout reproduction dans un milieu donné."),
          choice("Quel mécanisme modifie les fréquences alléliques au hasard ?", ["La volonté", "L’usage d’un organe", "La dérive génétique", "La fossilisation"], 2, "L’échantillonnage aléatoire est particulièrement important dans de petites populations."),
          choice("Quel mécanisme apporte des allèles depuis une autre population ?", ["Le flux de gènes", "La circulation sanguine", "Le moulage endocrânien", "La bipédie"], 0, "La migration d’individus ou de gamètes réalise un flux de gènes."),
          trueFalse("Un individu évolue génétiquement parce qu’il s’entraîne pendant sa vie.", false, "Les populations évoluent lorsque la composition héréditaire change au fil des générations."),
          choice("Pourquoi « le plus fort survit » résume-t-il mal la sélection ?", ["L’aptitude dépend du succès reproducteur dans un milieu, pas de la seule force", "La sélection ne dépend jamais du milieu", "Tous les individus ont le même succès", "La reproduction n’a aucun rôle"], 0, "Un individu physiquement faible peut transmettre davantage ses allèles selon les conditions."),
          choice("Qu’ajoute la théorie synthétique au seul mécanisme de sélection ?", ["La génétique des variations et plusieurs forces agissant sur les populations", "L’idée que les espèces sont fixes", "L’idée que les mutations sont toujours favorables", "L’absence de temps géologique"], 0, "Elle associe génétique mendélienne, mutations, recombinaisons, sélection, dérive, flux et isolement."),
        ],
        source: humanLineageSource(
          "5-7 et 11",
          "Lamarck, Darwin, mutationnisme, génétique moderne et théorie synthétique",
          [
            "La sélection naturelle est décrite par le succès reproducteur différentiel, et non par l’élimination automatique des individus « fragiles » au profit des plus « forts ».",
            "Les mutations ne sont pas orientées par la sélection ni produites par le besoin ; elles apparaissent indépendamment de leur valeur adaptative.",
            "La théorie synthétique est complétée par la recombinaison, la dérive génétique, les flux de gènes et l’isolement.",
            "L’évolution est attribuée aux populations au fil des générations, et non à la transformation volontaire d’un individu.",
          ],
        ),
        distractors: ["Une mutation apparaît parce que l’organisme en a besoin.", "L’évolution transforme tous les individus de la même façon en une génération.", "La théorie synthétique exclut les données génétiques."],
      },
    ],
    mission: {
      title: "Expertiser un dossier sur l’évolution humaine",
      scenario: "Le dossier officiel rassemble une planche de crânes, une comparaison de statures et 19 positions de la chaîne bêta de l’hémoglobine chez quatre mammifères. Tu dois expliquer les transformations, établir les parentés permises et corriger les conclusions trop rapides.",
      problem: "Comment faire converger anatomie et molécules sans confondre évolution, intelligence, proximité et ancêtre direct ?",
      bodyMarkdown: `
## Dossier de mission

### Document A — Transformations crâniennes

La planche officielle permet de comparer la forme de la boîte crânienne et de la face chez plusieurs homininés. Elle suggère une augmentation globale de la capacité crânienne dans plusieurs branches et une modification de la morphologie. Elle ne montre pas une succession directe prouvée.

### Document B — Bipédie

L’être humain associe une colonne en S, un bassin court et large, des membres inférieurs relativement longs et un pied à gros orteil aligné doté de voûtes développées.

### Document C — Fragment de bêta-hémoglobine

| Comparaison avec l’Homme | Différences sur 19 positions |
|---|---:|
| gorille | 0 |
| porc | 2 |
| cheval | 4 |

## Réponse modèle aux consignes officielles

### 1. Identifier et décrire

Les images sont des crânes et des représentations endocrâniennes attribués à plusieurs homininés. On décrit une augmentation globale de la boîte crânienne dans certaines branches, une modification de la face et des reliefs endocrâniens. On ne dit pas que chaque forme est l’ancêtre direct de la suivante.

### 2. Relier cerveau et capacités cognitives

Une transformation du cerveau a accompagné l’histoire du genre *Homo*, mais la capacité crânienne ne suffit pas à mesurer l’intelligence. L’organisation des réseaux, le développement et la culture doivent aussi être considérés.

### 3. Exploiter les séquences

Le fragment humain est identique à celui du gorille, diffère de deux positions avec le porc et de quatre avec le cheval. Parmi les espèces comparées, le gorille est donc le plus proche parent de l’Homme pour ce fragment. Cela soutient un ancêtre commun plus récent, jamais une descendance de l’Homme à partir du gorille actuel.

### 4. Expliquer l’évolution

Des mutations et recombinaisons produisent des variations héréditaires. Sélection, dérive et flux de gènes modifient ensuite les fréquences alléliques au fil des générations. L’isolement peut faire diverger des lignées.

> **Davy te donne la phrase de copie :** « J’observe…, j’en déduis une parenté…, je vérifie avec un second indice…, puis je précise la limite du document. »
`,
      investigation: [
        { label: "Décrire les crânes", detail: "Relever forme, volume, circonvolutions et vascularisation sans interprétation immédiate." },
        { label: "Relier à la bipédie", detail: "Mobiliser bassin, colonne, membres inférieurs et pied." },
        { label: "Comparer les séquences", detail: "Compter les différences sur une protéine homologue." },
        { label: "Conclure", detail: "Proposer des liens de parenté et rappeler que l’évolution est buissonnante." },
      ],
      interaction: {
        kind: "schema",
        eyebrow: "Dossier à expertiser",
        title: "Trois preuves, une conclusion prudente",
        instruction: "Sélectionne chaque document avant d’ouvrir la conclusion.",
        viewBox: "0 0 760 430",
        caption: "Schéma original de convergence des preuves mobilisées dans la situation d’évaluation.",
        shapes: [
          { shape: "circle", cx: 130, cy: 108, r: 68, tone: "soft" },
          { shape: "path", d: "M94 128 C88 79 118 48 159 52 C198 55 214 93 192 128 C178 150 151 162 126 158", tone: "outline" },
          { shape: "path", d: "M320 52 C290 91 297 148 326 184 C353 151 359 92 336 52", tone: "soft" },
          { shape: "line", x1: 322, y1: 181, x2: 304, y2: 280, tone: "outline" },
          { shape: "line", x1: 330, y1: 181, x2: 350, y2: 280, tone: "outline" },
          { shape: "path", d: "M518 86 C548 58 597 58 627 86 C650 107 651 137 632 160 C604 192 548 190 522 158 C503 136 502 106 518 86", tone: "soft" },
          { shape: "text", x: 576, y: 116, content: "0 • 2 • 4", anchor: "middle" },
          { shape: "text", x: 576, y: 141, content: "différences", anchor: "middle" },
          { shape: "line", x1: 162, y1: 170, x2: 326, y2: 340, tone: "muted" },
          { shape: "line", x1: 326, y1: 285, x2: 326, y2: 340, tone: "muted" },
          { shape: "line", x1: 547, y1: 176, x2: 326, y2: 340, tone: "muted" },
          { shape: "ellipse", cx: 326, cy: 360, rx: 154, ry: 45, tone: "accent" },
          { shape: "text", x: 326, y: 354, content: "ancêtres communs + évolution", anchor: "middle" },
          { shape: "text", x: 326, y: 376, content: "buissonnante", anchor: "middle" },
        ],
        hotspots: [
          { id: "skulls", number: 1, label: "Crânes", detail: "Ils renseignent sur les transformations morphologiques et leurs variations dans le temps.", x: 130, y: 108, highlight: [{ shape: "circle", cx: 130, cy: 108, r: 68, tone: "accent" }] },
          { id: "posture", number: 2, label: "Stature", detail: "L’ensemble colonne-bassin-jambes-pied permet d’inférer une bipédie habituelle.", x: 326, y: 158, highlight: [{ shape: "path", d: "M320 52 C290 91 297 148 326 184 C353 151 359 92 336 52", tone: "accent" }] },
          { id: "sequence", number: 3, label: "Séquences", detail: "Les différences entre molécules homologues quantifient une proximité relative.", x: 576, y: 120, highlight: [{ shape: "ellipse", cx: 576, cy: 122, rx: 76, ry: 69, tone: "accent" }] },
          { id: "conclusion", number: 4, label: "Conclusion", detail: "La convergence soutient des ancêtres communs et un arbre ramifié ; elle ne prouve pas une chaîne linéaire.", x: 326, y: 360, highlight: [{ shape: "ellipse", cx: 326, cy: 360, rx: 154, ry: 45, tone: "accent" }] },
        ],
        observation: "Trois documents indépendants convergent vers une parenté et une évolution buissonnante, avec des limites explicitement annoncées.",
      },
      modelAnswer: "Les fossiles montrent des transformations crâniennes et l’anatomie révèle une bipédie habituelle. Le fragment d’hémoglobine place le gorille au plus près de l’Homme parmi les espèces comparées. La convergence de ces indices soutient des ancêtres communs et une évolution buissonnante. Elle ne prouve ni que le gorille actuel est notre ancêtre ni que le volume cérébral mesure seul l’intelligence.",
      questions: [
        q("Quel caractère est directement lié à la bipédie permanente ?", "Un bassin court et large", "Un gros orteil opposable", "Une colonne à une seule courbure", "Des membres inférieurs très courts"),
        q("Que signifie une séquence identique dans la portion comparée ?", "Une forte proximité moléculaire pour cette molécule", "Une identité complète des deux espèces", "L’absence d’ancêtre commun", "Une preuve d’ancêtre direct"),
        q("Quelle formulation est scientifiquement correcte ?", "L’Homme et les grands singes actuels partagent des ancêtres communs", "L’Homme descend du gorille actuel", "Toutes les espèces évoluent vers l’Homme", "La sélection crée volontairement les mutations utiles"),
      ],
      extraQuestions: [
        choice("Situation officielle, consigne 1 — Que représentent principalement les images ?", ["Des cellules sanguines", "Des chromosomes sexuels", "Des crânes et des moulages endocrâniens de plusieurs homininés", "Des feuilles fossiles"], 2, "La planche documente les transformations de la boîte crânienne et de sa cavité.", "Situation d’évaluation • pages 8, 10 et 12"),
        choice("Situation officielle, consigne 2 — Quelle transformation est décrite ?", ["Une augmentation globale de la capacité crânienne et une modification de la morphologie", "La disparition complète de la boîte crânienne", "Une diminution obligatoire des circonvolutions", "Un nombre croissant de chromosomes"], 0, "Ce sont les transformations mises en avant par la planche.", "Situation d’évaluation • pages 8 et 10"),
        choice("Situation officielle, consigne 3 — Quelle réponse corrige la conclusion du PDF ?", ["Le volume cérébral seul ne suffit pas à mesurer l’intelligence", "Un grand cerveau rend toujours toute espèce plus intelligente", "Les fossiles conservent les pensées", "La culture ne joue aucun rôle"], 0, "Les capacités cognitives reposent sur l’organisation des réseaux et de nombreux facteurs.", "Situation d’évaluation et correction • pages 8 et 10"),
        choice("Exercice officiel 3 — Quelle conformité observe-t-on entre les quatre espèces ?", ["Aucune position n’est commune", "Tous les génomes sont identiques", "Seuls les chevaux possèdent une hémoglobine", "La majorité des 19 positions sont identiques"], 3, "Seules quatre positions varient dans l’ensemble du tableau.", "Exercice 3, consigne 1 • page 10"),
        choice("Exercice officiel 3 — Comment expliquer les différences de séquence ?", ["Des substitutions se sont accumulées après la séparation des lignées", "Les espèces ont choisi leurs acides aminés", "Le gorille a donné son sang à l’Homme", "Les fossiles ont changé le tableau"], 0, "Les mutations héréditaires accumulées produisent des différences entre lignées.", "Exercice 3, consigne 2 • pages 10-11"),
        choice("Exercice officiel 3 — Que permet de justifier le fragment ?", ["Une parenté plus proche Homme-gorille parmi les espèces comparées", "Une descendance directe depuis le gorille actuel", "L’absence d’ancêtres communs", "Une date exacte de séparation"], 0, "Zéro différence sur le fragment indique la proximité relative la plus forte.", "Exercice 3, consigne 3 • pages 10-11"),
        choice("Quel raisonnement fait converger les documents ?", ["Anatomie et molécules soutiennent ensemble une histoire d’ancêtres communs", "La morphologie annule les molécules", "Une séquence remplace tous les fossiles", "La bipédie prouve une filiation gorille-Homme"], 0, "Les preuves indépendantes se renforcent lorsqu’elles aboutissent à une histoire compatible."),
        trueFalse("La sélection naturelle oriente à l’avance les mutations utiles à la bipédie.", false, "Les mutations apparaissent sans anticipation ; la sélection agit ensuite sur leurs effets."),
        choice("Quelle phrase conclut avec la bonne prudence ?", ["Les résultats soutiennent cette parenté dans le cadre et les données étudiés", "Le document prouve toute l’histoire humaine sans limite", "Une image suffit à classer l’intelligence", "Les espèces actuelles sont les ancêtres les unes des autres"], 0, "Une conclusion scientifique précise ce que les données autorisent et leur limite."),
        choice("Quel ordre convient à une réponse de SVT ?", ["Conclure → inventer → recopier", "Réciter → ignorer le document → conclure", "Observer → comparer → interpréter → conclure", "Classer par préférence personnelle"], 2, "La démarche part des faits et construit progressivement l’explication."),
      ],
      source: humanLineageSource(
        "8-12",
        "Situation d’évaluation, exercices de consolidation 1 à 3, corrections et documentation",
        [
          "La réponse à la consigne 3 est corrigée : la taille du cerveau seule n’établit pas un niveau d’intelligence.",
          "La conclusion de l’exercice 3 est reformulée en ancêtre commun et proximité relative plutôt qu’en origine de l’Homme depuis une « lignée de singe » actuelle.",
          "Les mutations ne sont pas décrites comme produisant des individus « fragiles » ou « solides » automatiquement ; leur effet dépend du contexte et la sélection agit par succès reproducteur différentiel.",
        ],
      ),
    },
  },
  {
    id: "terminale-svt-l5-sex-blood-heredity",
    chapterNumber: 5,
    themeNumber: 3,
    themeTitle: "Génétique humaine",
    title: "L’hérédité du sexe et du groupe sanguin chez l’Homme",
    description: "Lire un arbre généalogique, relier les génotypes ABO aux groupes sanguins et utiliser la méiose puis la fécondation pour expliquer le modèle chromosomique XX-XY.",
    centralQuestion: "Comment deux mécanismes héréditaires distincts transmettent-ils le groupe sanguin ABO et le sexe chromosomique ?",
    memorySentence: "ABO : phénotype → génotypes → gamètes → échiquier ; XX-XY : méiose → gamètes X ou Y → fécondation aléatoire.",
    overviewBodyMarkdown: `
## Deux caractères, deux modèles à ne pas mélanger

Cette leçon étudie deux caractères héréditaires. Ils sont tous deux transmis lors de la fécondation, mais ils ne reposent pas sur le même support chromosomique.

| Caractère étudié | Support principal | Ce que reçoit l’enfant |
|---|---|---|
| **Groupe sanguin ABO** | le gène **ABO**, situé sur un autosome | un allèle maternel et un allèle paternel parmi $I^A$, $I^B$ et $i$ |
| **Sexe chromosomique dans le modèle XX-XY** | les chromosomes sexuels X et Y | un X ovulaire et, le plus souvent, un X ou un Y spermatique |

Le système ABO produit **quatre phénotypes usuels** — A, B, AB et O — à partir de **six génotypes**. Le modèle XX-XY explique pourquoi l’ovule apporte presque toujours X alors que les spermatozoïdes se répartissent en deux catégories, X ou Y.

## Le vocabulaire indispensable

| Mot | Sens dans cette leçon |
|---|---|
| **gène** | portion d’ADN dont différentes versions participent ici au caractère ABO |
| **allèle** | version d’un gène : $I^A$, $I^B$ ou $i$ pour le modèle ABO scolaire |
| **génotype** | paire d’allèles portée par un individu, par exemple $I^A i$ |
| **phénotype** | caractère observable, par exemple le groupe A |
| **autosome** | chromosome qui n’est pas X ou Y ; le gène ABO est situé sur le chromosome 9 |
| **gamète** | cellule haploïde ne recevant qu’un chromosome de chaque paire et qu’un allèle du gène ABO |

> **Astuce mémoire — GPGÉ :** **G**ène, **P**hénotype, **G**amètes, **É**chiquier. On identifie d’abord le gène et les génotypes possibles, puis les gamètes, enfin l’échiquier.

## Deux précautions scientifiques et humaines

Le groupe ABO peut parfois **exclure** une filiation incompatible, mais il ne prouve pas à lui seul une paternité : une expertise de parenté repose aujourd’hui sur de nombreux marqueurs ADN. De même, dire que le spermatozoïde apporte X ou Y décrit une contribution chromosomique aléatoire ; cela n’attribue au père ni décision, ni faute, ni mérite.

Enfin, connaître le seul groupe ABO ne suffit pas à garantir une transfusion « sans danger ». Les professionnels vérifient aussi le RhD, recherchent d’autres anticorps et réalisent une épreuve de compatibilité.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte comparative",
      title: "Deux transmissions, une même fécondation",
      instruction: "Ouvre chaque carte pour distinguer ce qui est commun et ce qui change.",
      rootLabel: "Hérédité humaine",
      rootDetail: "Chaque parent transmet un lot haploïde de chromosomes, mais les deux caractères étudiés utilisent des règles différentes.",
      nodes: [
        { id: "abo-gene", label: "Gène ABO", role: "Support autosomal", detail: "Il se situe sur le chromosome 9 et possède plusieurs allèles dans la population.", group: "Groupe sanguin" },
        { id: "abo-expression", label: "A, B, AB ou O", role: "Phénotypes", detail: "Les allèles $I^A$ et $I^B$ sont codominants ; $i$ est récessif dans le modèle usuel.", group: "Groupe sanguin" },
        { id: "sex-chromosomes", label: "Chromosomes X et Y", role: "Support chromosomique", detail: "La paire sexuelle est typiquement XX ou XY dans le modèle étudié.", group: "Sexe chromosomique" },
        { id: "gametes", label: "Gamètes", role: "Méiose", detail: "L’ovule apporte presque toujours X ; un spermatozoïde apporte X ou Y.", group: "Sexe chromosomique" },
        { id: "fertilization", label: "Fécondation", role: "Rencontre aléatoire", detail: "Elle réunit un allèle ABO et un chromosome sexuel de chaque parent.", group: "Point commun" },
        { id: "probability", label: "Probabilités", role: "Prévoir sans promettre", detail: "Un échiquier donne les chances à chaque conception, jamais l’ordre certain des naissances.", group: "Point commun" },
      ],
      observation: "Un même enfant reçoit simultanément les deux patrimoines ; il faut pourtant construire un raisonnement séparé pour ABO et pour XX-XY.",
    },
    overviewExtraQuestions: [
      choice("Sur quel type de chromosome se situe le gène ABO ?", ["Un chromosome sexuel Y", "Un autosome", "L’ADN mitochondrial uniquement", "Aucun chromosome"], 1, "Le locus ABO est situé sur le chromosome 9, qui est un autosome."),
      choice("Quelle distinction est correcte ?", ["Le phénotype est la paire d’allèles et le génotype le groupe visible", "Phénotype et génotype sont toujours identiques", "Le génotype est la paire d’allèles ; le phénotype est le caractère exprimé", "Un génotype ne contient aucun allèle"], 2, "Le génotype $I^A i$ produit par exemple le phénotype A."),
      choice("Que transmet chaque parent pour le gène ABO ?", ["Deux groupes sanguins complets", "Seulement un antigène", "Aucun allèle", "Un allèle dans chaque gamète"], 3, "La méiose ne place qu’un des deux allèles parentaux dans chaque gamète."),
      choice("Pourquoi faut-il séparer les deux échiquiers de la leçon ?", ["Ils n’étudient pas le même caractère ni le même support chromosomique", "Le groupe ABO détermine toujours XX ou XY", "Le chromosome Y porte le gène ABO", "Les ovules ne contiennent pas d’autosomes"], 0, "ABO est autosomal, tandis que le second modèle porte sur X et Y."),
      trueFalse("Un groupe ABO compatible suffit à lui seul à garantir une transfusion sans risque.", false, "Le RhD, les autres anticorps, le dépistage infectieux et l’épreuve de compatibilité font aussi partie de la sécurité transfusionnelle."),
      trueFalse("Le groupe sanguin ABO d’un enfant peut prouver à lui seul l’identité de son père biologique.", false, "ABO peut exclure certains cas incompatibles, mais ne suffit pas à établir une paternité."),
      choice("Que signifie une probabilité de 1/2 à chaque fécondation dans le modèle XX-XY ?", ["Une famille doit avoir exactement autant de filles que de garçons", "Après une fille, un garçon devient obligatoire", "Chaque nouvelle fécondation conserve les deux possibilités", "Les parents choisissent la prochaine possibilité"], 2, "Les conceptions successives sont des événements indépendants dans ce modèle simple."),
    ],
    overviewSource: sexBloodHereditySource(
      "1-8",
      "Problématique, conclusion générale et documentation",
      [
        "La couverture interne classe le document comme « leçon 3 » ; le catalogue de la plateforme le conserve à sa position officielle actuelle de leçon 5.",
        "La situation d’apprentissage introductive et menaçante est retirée ; ses deux problèmes biologiques sont repris sans mettre en scène un conflit familial.",
        "La page 8 ne contient qu’un titre sans arbre généalogique supplémentaire ; aucun contenu absent n’est inventé.",
        "La transfusion est présentée avec ses contrôles ABO, RhD, anticorps et compatibilité ; le groupe ABO seul ne garantit pas l’absence de danger.",
        "Le groupe ABO peut contribuer à une exclusion de parenté, mais ne suffit pas à prouver une paternité.",
      ],
    ),
    sections: [
      {
        id: "abo-alleles",
        title: "Comprendre le système ABO",
        summary: "Lire l’arbre officiel, distinguer allèles, génotypes, antigènes et anticorps, puis expliquer codominance et récessivité.",
        conceptTitle: "Trois allèles principaux produisent quatre groupes ABO usuels",
        explanation: "Le gène ABO est polyallélique dans la population. Chaque personne n’en porte pourtant que deux copies : $I^A$ permet l’expression de l’antigène A, $I^B$ celle de l’antigène B et $i$ ne produit pas de transférase A ou B fonctionnelle dans le modèle courant.",
        keyPoint: "$I^A$ et $I^B$ sont codominants ; $i$ est récessif : six génotypes usuels correspondent à quatre phénotypes ABO.",
        example: "$I^A I^B$ donne AB ; $I^A i$ donne A ; $I^B i$ donne B ; $ii$ donne O.",
        bodyMarkdown: `
## 1. Ce que montre l’arbre généalogique officiel

Le document présente une mère de groupe A et un père de groupe B avec quatre enfants de groupes AB, O, A et B. Les cercles représentent les femmes, les carrés les hommes, la ligne horizontale un couple et la ligne de descendance leurs enfants.

La présence d’un enfant O montre que **chaque parent possède un allèle $i$ masqué**. La mère est donc $I^A i$ et le père $I^B i$. L’enfant AB a reçu $I^A$ de sa mère et $I^B$ de son père : les deux allèles s’expriment ensemble.

> **Correction de raisonnement :** le fait qu’une fille et son père aient le même groupe B ne prouve pas, à lui seul, que le gène est autosomal. La localisation du gène ABO sur le chromosome 9 est établie indépendamment ; l’arbre est compatible avec cette transmission.

## 2. Du gène aux antigènes

| Génotype | Phénotype | Antigène(s) des globules rouges | Anticorps ABO usuels du plasma |
|---|---|---|---|
| $I^A I^A$ ou $I^A i$ | A | A | anti-B |
| $I^B I^B$ ou $I^B i$ | B | B | anti-A |
| $I^A I^B$ | AB | A et B | ni anti-A ni anti-B |
| $ii$ | O | ni A ni B | anti-A et anti-B |

Le mot **codominance** signifie que $I^A$ et $I^B$ s’expriment simultanément chez l’hétérozygote $I^A I^B$. L’allèle $i$ est dit **récessif** parce qu’il ne détermine le phénotype O que chez l’homozygote $ii$.

Le gène est **polyallélique** parce qu’il existe au moins trois formes principales dans la population. Un individu diploïde n’en reçoit toutefois que **deux**, une de chaque parent.

> **Astuce mémoire — A fait A, B fait B, AB fait les deux, O n’ajoute ni A ni B.**

## 3. Ce que le modèle scolaire simplifie

La notation moderne $I^A$, $I^B$, $i$ évite de confondre l’allèle avec le phénotype. Il existe des sous-groupes et de rares phénotypes particuliers ; les exercices du document utilisent le modèle ABO usuel à trois allèles principaux.
`,
        processTitle: "Du génotype au groupe sanguin",
        processInstruction: "Associe génotype, antigènes et anticorps avant de conclure sur le phénotype.",
        process: [
          { label: "Groupe A", detail: "$I^A I^A$ ou $I^A i$ ; antigène A et anticorps anti-B." },
          { label: "Groupe B", detail: "$I^B I^B$ ou $I^B i$ ; antigène B et anticorps anti-A." },
          { label: "Groupe AB", detail: "$I^A I^B$ ; antigènes A et B exprimés ensemble par codominance." },
          { label: "Groupe O", detail: "$ii$ ; aucun antigène A/B et anticorps anti-A/anti-B." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Membranes interactives",
          title: "Quatre phénotypes, quatre signatures antigéniques",
          instruction: "Sélectionne un globule rouge pour relier surface, génotype et plasma.",
          viewBox: "0 0 760 420",
          caption: "Figure originale et simplifiée des antigènes ABO à la surface des globules rouges.",
          zones: [
            { label: "Groupe A", xStart: 0, xEnd: 190 },
            { label: "Groupe B", xStart: 190, xEnd: 380 },
            { label: "Groupe AB", xStart: 380, xEnd: 570 },
            { label: "Groupe O", xStart: 570, xEnd: 760 },
          ],
          shapes: [
            { shape: "circle", cx: 95, cy: 190, r: 70, tone: "soft" },
            { shape: "circle", cx: 285, cy: 190, r: 70, tone: "soft" },
            { shape: "circle", cx: 475, cy: 190, r: 70, tone: "soft" },
            { shape: "circle", cx: 665, cy: 190, r: 70, tone: "soft" },
            { shape: "text", x: 95, y: 196, content: "A", anchor: "middle" },
            { shape: "text", x: 285, y: 196, content: "B", anchor: "middle" },
            { shape: "text", x: 475, y: 196, content: "A + B", anchor: "middle" },
            { shape: "text", x: 665, y: 196, content: "aucun A/B", anchor: "middle" },
            { shape: "line", x1: 60, y1: 122, x2: 60, y2: 99, tone: "accent" },
            { shape: "line", x1: 95, y1: 116, x2: 95, y2: 91, tone: "accent" },
            { shape: "line", x1: 130, y1: 122, x2: 130, y2: 99, tone: "accent" },
            { shape: "line", x1: 250, y1: 122, x2: 238, y2: 101, tone: "outline" },
            { shape: "line", x1: 285, y1: 116, x2: 273, y2: 93, tone: "outline" },
            { shape: "line", x1: 320, y1: 122, x2: 308, y2: 101, tone: "outline" },
            { shape: "line", x1: 440, y1: 122, x2: 440, y2: 99, tone: "accent" },
            { shape: "line", x1: 470, y1: 116, x2: 458, y2: 93, tone: "outline" },
            { shape: "line", x1: 500, y1: 116, x2: 500, y2: 91, tone: "accent" },
            { shape: "line", x1: 530, y1: 122, x2: 518, y2: 101, tone: "outline" },
            { shape: "text", x: 95, y: 305, content: "IᴬIᴬ ou Iᴬi", anchor: "middle" },
            { shape: "text", x: 285, y: 305, content: "IᴮIᴮ ou Iᴮi", anchor: "middle" },
            { shape: "text", x: 475, y: 305, content: "IᴬIᴮ", anchor: "middle" },
            { shape: "text", x: 665, y: 305, content: "ii", anchor: "middle" },
          ],
          hotspots: [
            { id: "group-a", number: 1, label: "Groupe A", detail: "L’antigène A est présent ; le génotype peut être $I^A I^A$ ou $I^A i$.", x: 95, y: 190, highlight: [{ shape: "circle", cx: 95, cy: 190, r: 76, tone: "accent" }] },
            { id: "group-b", number: 2, label: "Groupe B", detail: "L’antigène B est présent ; le génotype peut être $I^B I^B$ ou $I^B i$.", x: 285, y: 190, highlight: [{ shape: "circle", cx: 285, cy: 190, r: 76, tone: "accent" }] },
            { id: "group-ab", number: 3, label: "Groupe AB", detail: "Les antigènes A et B sont présents : c’est l’expression de la codominance.", x: 475, y: 190, highlight: [{ shape: "circle", cx: 475, cy: 190, r: 76, tone: "accent" }] },
            { id: "group-o", number: 4, label: "Groupe O", detail: "Aucun antigène A/B n’est produit dans le modèle usuel ; le génotype est $ii$.", x: 665, y: 190, highlight: [{ shape: "circle", cx: 665, cy: 190, r: 76, tone: "accent" }] },
          ],
          observation: "Les phénotypes A et B ne révèlent pas toujours le génotype ; AB et O, eux, correspondent chacun à une seule combinaison usuelle.",
        },
        observation: "Un même phénotype A ou B peut cacher deux génotypes différents, alors que AB et O sont non ambigus dans le modèle étudié.",
        check: choice(
          "Quel génotype correspond obligatoirement au groupe O ?",
          ["$ii$", "$I^A I^B$", "$I^A I^A$", "$I^B I^B$"],
          0,
          "Le phénotype O n’apparaît que si les deux copies sont l’allèle récessif $i$ dans le modèle ABO usuel.",
        ),
        extraQuestions: [
          trueFalse("Activité officielle, affirmation 1 — « Un phénotype récessif n’apparaît jamais dans la descendance. »", false, "Deux parents porteurs peuvent transmettre chacun l’allèle récessif ; le phénotype O apparaît alors chez l’enfant $ii$.", "Activité d’application, affirmation 1 • page 3"),
          trueFalse("Activité officielle, affirmation 2 — « Dans le système ABO, les phénotypes A et B sont codominants. »", true, "Plus précisément, les allèles $I^A$ et $I^B$ sont codominants et s’expriment ensemble chez $I^A I^B$.", "Activité d’application, affirmation 2 • page 3"),
          trueFalse("Activité officielle, affirmation 3 — « Un gène polyallélique est un gène qui a plusieurs formes alléliques. »", true, "Le locus ABO possède plusieurs allèles dans la population.", "Activité d’application, affirmation 3 • page 3"),
          trueFalse("Activité officielle, affirmation 4 — « Dans le système ABO, un individu de groupe AB est hétérozygote. »", true, "Il porte deux allèles différents, $I^A$ et $I^B$.", "Activité d’application, affirmation 4 • page 3"),
          trueFalse("Activité officielle, affirmation 5 — « Dans le système ABO, l’allèle O est dominant. »", false, "L’allèle $i$ est récessif devant $I^A$ et $I^B$ dans le modèle usuel.", "Activité d’application, affirmation 5 • page 3"),
          choice("Combien d’allèles ABO un individu diploïde porte-t-il normalement ?", ["Trois, puisqu’il existe trois allèles dans la population", "Un seul dans toutes ses cellules", "Deux, un hérité de chaque parent", "Quatre, un par groupe"], 2, "Polyallélique décrit la population ; chaque individu diploïde possède deux copies du locus."),
          choice("Quel couple génotype-phénotype est correct ?", ["$I^A i$ → groupe O", "$I^B i$ → groupe B", "$ii$ → groupe AB", "$I^A I^B$ → groupe A uniquement"], 1, "$I^B$ s’exprime devant $i$, donc $I^B i$ donne le groupe B."),
          choice("Pourquoi un individu AB n’a-t-il habituellement ni anti-A ni anti-B dans son plasma ?", ["Il ne possède aucun antigène", "Ses globules rouges sont absents", "Il est toujours donneur universel de plasma et de globules rouges", "Son système immunitaire reconnaît ses antigènes A et B comme propres"], 3, "Il ne produit normalement pas d’anticorps ABO contre ses propres antigènes."),
        ],
        source: sexBloodHereditySource(
          "1-3 et 7-8",
          "Enquête familiale, arbre généalogique, interprétation ABO et activité d’application",
          [
            "L’allèle noté « O » dans le PDF est normalisé en $i$ ; les allèles fonctionnels sont notés $I^A$ et $I^B$.",
            "Le partage d’un même groupe sanguin entre un père et sa fille n’établit pas à lui seul la localisation autosomale ; le gène ABO est situé sur le chromosome 9.",
            "La codominance concerne rigoureusement les allèles $I^A$ et $I^B$, même si l’activité source parle des phénotypes A et B.",
          ],
        ),
        distractors: ["$I^A$ domine toujours $I^B$.", "Le groupe AB correspond au génotype $ii$.", "Le système ABO est porté par les chromosomes sexuels."],
      },
      {
        id: "abo-crosses",
        title: "Résoudre un croisement ABO",
        summary: "Déduire les génotypes parentaux à partir des enfants, construire l’échiquier $I^A i × I^B i$ et interpréter l’arbre officiel.",
        conceptTitle: "Les phénotypes des enfants révèlent les allèles masqués des parents",
        explanation: "Un parent de groupe A peut être $I^A I^A$ ou $I^A i$ et un parent B, $I^B I^B$ ou $I^B i$. Dans la famille officielle, l’enfant O a nécessairement reçu $i$ de chacun : les parents sont donc $I^A i$ et $I^B i$.",
        keyPoint: "Phénotypes → génotypes possibles → indices familiaux → gamètes → échiquier → probabilités.",
        example: "$I^A i × I^B i$ produit $I^A I^B$, $I^A i$, $I^B i$ ou $ii$, chacun avec une probabilité théorique de $1/4$.",
        bodyMarkdown: `
## 1. Ne pas choisir le génotype au hasard

Le phénotype A correspond à $I^A I^A$ **ou** $I^A i$. Le phénotype B correspond à $I^B I^B$ **ou** $I^B i$. Il faut donc exploiter les descendants avant de dresser l’échiquier.

Dans les deux arbres des pages 2 et 7, un couple A × B possède au moins un enfant O. Puisque cet enfant est $ii$, sa mère a transmis $i$ et son père aussi :

$$I^A i × I^B i$$

## 2. Construire l’échiquier complet

| Gamète maternel / Gamète paternel | $I^B$ | $i$ |
|---|---|---|
| $I^A$ | $I^A I^B$ → **AB** | $I^A i$ → **A** |
| $i$ | $I^B i$ → **B** | $ii$ → **O** |

Chaque case représente ici $1/2 × 1/2 = 1/4$. Le bilan théorique est donc 25 % A, 25 % B, 25 % AB et 25 % O **pour chaque conception**.

> **Erreur fréquente :** quatre enfants dans une famille ne doivent pas obligatoirement représenter une fois chaque case. L’échiquier donne des probabilités ; le hasard peut produire plusieurs enfants du même groupe.

## 3. Expliquer chaque enfant de l’exercice officiel

- La fille **AB** reçoit $I^A$ de sa mère et $I^B$ de son père.
- Le garçon **B** reçoit $i$ de sa mère et $I^B$ de son père ; son génotype est donc $I^B i$.
- Chacune des deux filles **O** reçoit $i$ de la mère et $i$ du père ; son génotype est $ii$.

L’arbre de la page 2 ajoute un enfant A, compatible avec $I^A i$.

## 4. Ce que l’arbre autorise — et ce qu’il n’autorise pas

Un groupe impossible dans un modèle bien établi peut **exclure** une hypothèse de parenté. En revanche, beaucoup de personnes partagent les mêmes groupes : un groupe compatible ne prouve jamais à lui seul une paternité. Une expertise moderne utilise plusieurs marqueurs ADN.

> **Astuce mémoire — PIGÉ :** **P**hénotypes, **I**ndices, **G**amètes, **É**chiquier.
`,
        processTitle: "Construire l’échiquier",
        processInstruction: "Pars des phénotypes, exploite l’enfant O, puis combine les gamètes.",
        process: [
          { label: "Génotypes possibles", shortLabel: "Génotypes", detail: "A peut cacher $I^A i$ et B peut cacher $I^B i$." },
          { label: "Indice O", shortLabel: "Indice", detail: "Un enfant $ii$ prouve que chacun des deux parents a transmis $i$." },
          { label: "Gamètes", detail: "La mère produit $I^A$ ou $i$ ; le père $I^B$ ou $i$." },
          { label: "Descendance", detail: "Les quatre combinaisons donnent AB, A, B et O avec $1/4$ chacune." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Échiquier interactif",
          title: "Le croisement $I^A i × I^B i$",
          instruction: "Ouvre chaque case pour identifier l’allèle maternel, l’allèle paternel et le groupe obtenu.",
          viewBox: "0 0 720 440",
          caption: "Figure originale de l’échiquier ABO reconstitué d’après la vérification chromosomique du document.",
          shapes: [
            { shape: "text", x: 365, y: 42, content: "gamètes du père", anchor: "middle" },
            { shape: "text", x: 74, y: 246, content: "gamètes", anchor: "middle" },
            { shape: "text", x: 74, y: 270, content: "de la mère", anchor: "middle" },
            { shape: "line", x1: 170, y1: 90, x2: 650, y2: 90, tone: "outline" },
            { shape: "line", x1: 170, y1: 200, x2: 650, y2: 200, tone: "outline" },
            { shape: "line", x1: 170, y1: 320, x2: 650, y2: 320, tone: "outline" },
            { shape: "line", x1: 170, y1: 420, x2: 650, y2: 420, tone: "outline" },
            { shape: "line", x1: 170, y1: 90, x2: 170, y2: 420, tone: "outline" },
            { shape: "line", x1: 410, y1: 90, x2: 410, y2: 420, tone: "outline" },
            { shape: "line", x1: 650, y1: 90, x2: 650, y2: 420, tone: "outline" },
            { shape: "text", x: 290, y: 150, content: "Iᴮ", anchor: "middle" },
            { shape: "text", x: 530, y: 150, content: "i", anchor: "middle" },
            { shape: "text", x: 135, y: 258, content: "Iᴬ", anchor: "middle" },
            { shape: "text", x: 135, y: 372, content: "i", anchor: "middle" },
            { shape: "text", x: 290, y: 252, content: "IᴬIᴮ → AB", anchor: "middle" },
            { shape: "text", x: 530, y: 252, content: "Iᴬi → A", anchor: "middle" },
            { shape: "text", x: 290, y: 372, content: "Iᴮi → B", anchor: "middle" },
            { shape: "text", x: 530, y: 372, content: "ii → O", anchor: "middle" },
          ],
          hotspots: [
            { id: "ab-cell", number: 1, label: "Groupe AB", detail: "$I^A$ maternel et $I^B$ paternel s’expriment ensemble : probabilité $1/4$.", x: 290, y: 252, highlight: [{ shape: "path", d: "M178 208 L402 208 L402 312 L178 312 Z", tone: "accent" }] },
            { id: "a-cell", number: 2, label: "Groupe A", detail: "$I^A$ maternel domine $i$ paternel : probabilité $1/4$.", x: 530, y: 252, highlight: [{ shape: "path", d: "M418 208 L642 208 L642 312 L418 312 Z", tone: "accent" }] },
            { id: "b-cell", number: 3, label: "Groupe B", detail: "$i$ maternel est masqué par $I^B$ paternel : probabilité $1/4$.", x: 290, y: 372, highlight: [{ shape: "path", d: "M178 328 L402 328 L402 412 L178 412 Z", tone: "accent" }] },
            { id: "o-cell", number: 4, label: "Groupe O", detail: "Chaque parent transmet $i$ ; le génotype $ii$ s’exprime : probabilité $1/4$.", x: 530, y: 372, highlight: [{ shape: "path", d: "M418 328 L642 328 L642 412 L418 412 Z", tone: "accent" }] },
          ],
          observation: "L’enfant O est l’indice qui révèle les allèles $i$ cachés chez les deux parents.",
        },
        observation: "Les probabilités s’appliquent à chaque conception indépendamment ; elles ne garantissent pas une répartition exacte dans une petite famille.",
        check: choice(
          "Deux parents A et B ont un enfant O. Quels génotypes doivent-ils porter dans le modèle usuel ?",
          ["$I^A i$ et $I^B i$", "$I^A I^A$ et $I^B I^B$", "$I^A I^B$ et $ii$", "$ii$ et $ii$"],
          0,
          "L’enfant $ii$ a nécessairement reçu un allèle $i$ de chacun ; les phénotypes parentaux imposent alors $I^A i$ et $I^B i$.",
        ),
        extraQuestions: [
          choice("Exercice officiel 1, consigne 1 — Quels groupes sanguins apparaissent dans la famille ?", ["A et B seulement", "AB et O seulement", "A, B, AB et O", "Aucun groupe n’est indiqué"], 2, "Le texte cite la mère A, le père B et des enfants AB, B et O.", "Exercice 1, consigne 1 • pages 6-7"),
          choice("Exercice officiel 1 — Quel indice impose le génotype $I^A i$ à la mère de groupe A ?", ["La présence d’un enfant O", "La forme circulaire de son symbole", "Le sexe de l’enfant AB", "Le nombre de filles"], 0, "L’enfant O a reçu $i$ de sa mère et $i$ de son père.", "Exercice 1, consignes 2-3 • pages 6-7"),
          choice("Exercice officiel 1 — Quel génotype doit avoir le père de groupe B ?", ["$I^B I^B$", "$I^A I^B$", "$ii$", "$I^B i$"], 3, "Il doit pouvoir transmettre $i$ aux enfants O.", "Exercice 1, consigne 3 • pages 6-7"),
          choice("Exercice officiel 1 — Quels allèles reçoit la fille AB ?", ["$i$ et $i$", "$I^A$ de la mère et $I^B$ du père", "$I^B$ des deux parents", "$I^A$ des deux parents"], 1, "Son génotype est $I^A I^B$.", "Exercice 1, consigne 3 • page 7"),
          choice("Exercice officiel 1 — Quel génotype explique le garçon de groupe B dans cette famille ?", ["$I^B I^B$", "$I^A i$", "$I^B i$", "$ii$"], 2, "La mère A ne possède pas $I^B$ ; elle transmet donc $i$, tandis que le père transmet $I^B$.", "Exercice 1, consigne 3 • page 7"),
          choice("Exercice officiel 1 — Que reçoivent les deux filles O ?", ["$I^A$ de la mère et $I^B$ du père", "$I^B$ des deux parents", "Un chromosome Y", "$i$ de chacun des deux parents"], 3, "Leur génotype est $ii$.", "Exercice 1, consigne 3 • page 7"),
          choice("Quelle est la probabilité théorique d’un enfant O pour $I^A i × I^B i$ ?", ["0 %", "25 %", "50 %", "100 %"], 1, "Une seule des quatre cases de l’échiquier est $ii$."),
          choice("Dans un pedigree, quel symbole représente traditionnellement un homme ?", ["Un carré", "Un cercle", "Une flèche", "Une lettre sans contour"], 0, "Le document utilise un carré pour les hommes et un cercle pour les femmes.", "Légende de l’arbre généalogique • page 2"),
        ],
        source: sexBloodHereditySource(
          "2-3 et 6-8",
          "Vérification chromosomique, arbre généalogique et exercice officiel 1",
          [
            "La notation manuscrite A/O et B/O est normalisée en $I^A i$ et $I^B i$.",
            "La probabilité de 25 % est rattachée à chaque conception et non à un quota obligatoire dans une fratrie.",
            "Le groupe ABO est présenté comme un outil d’exclusion limitée, jamais comme une preuve suffisante de paternité.",
          ],
        ),
        distractors: ["Le groupe sanguin suffit toujours à connaître un génotype unique.", "Deux parents A et B ne peuvent jamais avoir d’enfant O.", "Une probabilité de 25 % impose exactement un enfant sur quatre dans toute famille."],
      },
      {
        id: "sex-chromosomes",
        title: "Former les gamètes X et Y",
        summary: "Comparer X et Y, repérer leurs régions communes et expliquer comment la méiose répartit les chromosomes sexuels dans les gamètes.",
        conceptTitle: "La méiose sépare X et Y avant la fécondation",
        explanation: "Dans le modèle chromosomique usuel, une cellule XX forme des ovules portant X, tandis qu’une cellule XY forme des spermatozoïdes portant X ou Y. Chaque gamète est haploïde et ne contient qu’un chromosome sexuel.",
        keyPoint: "Par rapport aux chromosomes sexuels : ovules presque toujours X ; spermatozoïdes X ou Y en proportions voisines.",
        example: "Une cellule germinale XY sépare X et Y pendant la méiose ; les spermatozoïdes obtenus ne sont donc pas XY.",
        bodyMarkdown: `
## 1. Situer X et Y dans le caryotype

La plupart des cellules somatiques humaines possèdent **46 chromosomes** : 22 paires d’autosomes et une paire de chromosomes sexuels. Le document compare le modèle typique **XX** et le modèle typique **XY**.

Le chromosome X est nettement plus grand que Y. X et Y ne sont pas entièrement homologues : ils partagent seulement de petites **régions pseudoautosomales**, notamment à leurs extrémités, qui peuvent s’apparier pendant la méiose. Le reste de leurs séquences et de leurs gènes diffère fortement.

> **Précision :** X et Y jouent un rôle central dans le développement sexuel, mais ils ne constituent pas à eux seuls toute la biologie du sexe. D’autres gènes, les hormones et le développement interviennent, et il existe des variations chromosomiques ou du développement sexuel.

## 2. La méiose fabrique des gamètes haploïdes

| Cellule germinale de départ | Séparation pendant la méiose | Gamètes obtenus pour la paire sexuelle |
|---|---|---|
| XX | un chromosome X dans chaque gamète | ovules portant X |
| XY | X et Y se séparent | spermatozoïdes portant X ou spermatozoïdes portant Y |

Le PDF dit que la femme produit « un type de gamète ». Cette phrase signifie **un seul type relativement au chromosome sexuel** : X. Les ovules restent génétiquement différents pour de nombreux autosomes à cause de la répartition des chromosomes et des recombinaisons.

De même, les deux catégories X et Y sont produites en proportions **approximativement** voisines ; on ne doit pas exiger exactement 50 % dans chaque petit échantillon de spermatozoïdes.

## 3. Le réflexe de copie

1. Identifier la cellule diploïde : XX ou XY dans le modèle.
2. Faire séparer les deux chromosomes par méiose.
3. Écrire un seul chromosome sexuel dans chaque gamète.
4. Réserver l’association XX ou XY à la fécondation.

> **Astuce mémoire — XX : une seule lettre possible ; XY : deux lettres possibles.**
`,
        processTitle: "Des cellules parentales aux gamètes",
        processInstruction: "Observe la paire diploïde, puis le seul chromosome sexuel reçu par chaque gamète.",
        process: [
          { label: "Cellule XX", detail: "Les deux chromosomes sexuels sont X dans le modèle typique étudié." },
          { label: "Ovules", detail: "Après méiose, chaque ovule reçoit un X relativement à cette paire." },
          { label: "Cellule XY", detail: "X et Y possèdent de petites régions communes mais diffèrent largement." },
          { label: "Spermatozoïdes", detail: "Après méiose, une catégorie porte X et l’autre Y." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Chromosomes interactifs",
          title: "X et Y : ressemblances limitées, destins séparés",
          instruction: "Sélectionne les repères avant de suivre leur séparation méiotique.",
          viewBox: "0 0 740 430",
          caption: "Figure originale et simplifiée des chromosomes sexuels et de leur répartition dans les gamètes.",
          zones: [
            { label: "Cellule XX", xStart: 0, xEnd: 245 },
            { label: "Cellule XY", xStart: 245, xEnd: 500 },
            { label: "Après méiose", xStart: 500, xEnd: 740 },
          ],
          shapes: [
            { shape: "path", d: "M78 82 C55 118 64 155 100 190 C64 225 55 264 78 302", tone: "outline" },
            { shape: "path", d: "M146 82 C169 118 160 155 124 190 C160 225 169 264 146 302", tone: "outline" },
            { shape: "path", d: "M285 82 C262 118 271 155 307 190 C271 225 262 264 285 302", tone: "outline" },
            { shape: "path", d: "M353 82 C376 118 367 155 331 190 C367 225 376 264 353 302", tone: "outline" },
            { shape: "path", d: "M421 130 C405 152 411 176 435 198 C411 220 405 244 421 266", tone: "soft" },
            { shape: "path", d: "M467 130 C483 152 477 176 453 198 C477 220 483 244 467 266", tone: "soft" },
            { shape: "line", x1: 87, y1: 95, x2: 137, y2: 95, tone: "accent" },
            { shape: "line", x1: 294, y1: 95, x2: 344, y2: 95, tone: "accent" },
            { shape: "line", x1: 427, y1: 141, x2: 461, y2: 141, tone: "accent" },
            { shape: "line", x1: 486, y1: 190, x2: 545, y2: 145, tone: "muted" },
            { shape: "line", x1: 486, y1: 205, x2: 545, y2: 260, tone: "muted" },
            { shape: "circle", cx: 605, cy: 132, r: 47, tone: "soft" },
            { shape: "circle", cx: 605, cy: 276, r: 47, tone: "soft" },
            { shape: "text", x: 112, y: 343, content: "X + X", anchor: "middle" },
            { shape: "text", x: 365, y: 343, content: "X + Y", anchor: "middle" },
            { shape: "text", x: 605, y: 139, content: "X", anchor: "middle" },
            { shape: "text", x: 605, y: 283, content: "Y", anchor: "middle" },
            { shape: "text", x: 605, y: 360, content: "un chromosome par gamète", anchor: "middle" },
          ],
          hotspots: [
            { id: "x-size", number: 1, label: "Chromosome X", detail: "Il est plus grand que Y et porte de nombreux gènes qui ne sont pas présents sur Y.", x: 307, y: 190, highlight: [{ shape: "ellipse", cx: 319, cy: 192, rx: 64, ry: 127, tone: "accent" }] },
            { id: "y-size", number: 2, label: "Chromosome Y", detail: "Il est plus petit ; certaines régions et certains gènes lui sont propres.", x: 444, y: 198, highlight: [{ shape: "ellipse", cx: 444, cy: 198, rx: 52, ry: 84, tone: "accent" }] },
            { id: "par", number: 3, label: "Régions communes", detail: "De petites régions pseudoautosomales permettent l’appariement de X et Y pendant la méiose.", x: 446, y: 141, highlight: [{ shape: "line", x1: 427, y1: 141, x2: 461, y2: 141, tone: "accent" }] },
            { id: "separation", number: 4, label: "Séparation méiotique", detail: "X et Y gagnent des gamètes différents ; aucun spermatozoïde normal ne porte les deux à la fois.", x: 545, y: 205, highlight: [{ shape: "path", d: "M486 190 L545 145 M486 205 L545 260", tone: "accent" }] },
          ],
          observation: "Le document montre un petit segment commun ; il ne faut pas en conclure que X et Y sont homologues sur toute leur longueur.",
        },
        observation: "La séparation des chromosomes crée une probabilité biologique ; elle n’est ni un choix conscient ni une action dirigée par le parent.",
        check: choice(
          "Quels types de spermatozoïdes sont produits relativement aux chromosomes sexuels ?",
          ["Des spermatozoïdes X et des spermatozoïdes Y", "Uniquement des spermatozoïdes X", "Uniquement des spermatozoïdes Y", "Des spermatozoïdes XX"],
          0,
          "La méiose sépare X et Y : chaque spermatozoïde haploïde reçoit l’un ou l’autre, jamais les deux dans le cas normal.",
        ),
        extraQuestions: [
          choice("Combien de paires d’autosomes possède typiquement une cellule somatique humaine ?", ["Une", "Vingt-deux", "Vingt-trois chromosomes Y", "Quarante-six paires"], 1, "Les 22 premières paires sont des autosomes ; la 23e est la paire sexuelle."),
          trueFalse("Les chromosomes X et Y sont identiques sur toute leur longueur.", false, "Ils ne partagent que de petites régions pseudoautosomales et diffèrent largement ailleurs.", "Document 1 • pages 4 et 7"),
          choice("Quand le PDF dit que la femme XX produit « un type de gamète », que faut-il comprendre ?", ["Tous ses ovules sont génétiquement identiques", "Ses ovules ne contiennent aucun autosome", "Ses ovules portent X relativement à la paire sexuelle", "Elle produit des ovules Y"], 2, "La formule ne concerne que X/Y ; les autosomes recombinés rendent les ovules génétiquement variés."),
          choice("Quel chromosome sexuel un spermatozoïde haploïde porte-t-il normalement ?", ["Toujours X et Y ensemble", "Deux X", "Aucun", "X ou Y"], 3, "La méiose sépare X et Y dans des gamètes différents."),
          choice("Quel est le rôle général de la méiose ?", ["Doubler le nombre de chromosomes des gamètes", "Réduire de moitié le nombre de chromosomes et créer de la diversité", "Transformer tous les gamètes en cellules XX", "Supprimer les autosomes"], 1, "La méiose produit des gamètes haploïdes et remanie les combinaisons génétiques."),
          choice("À quoi servent les régions pseudoautosomales de X et Y pendant la méiose ?", ["À produire les antigènes ABO", "À choisir le sexe de l’enfant", "À permettre un appariement et une recombinaison limités", "À rendre X et Y entièrement identiques"], 2, "Ces petites régions homologues s’apparient ; le reste des chromosomes diffère."),
          trueFalse("Le modèle XX-XY décrit toutes les variations possibles du développement sexuel humain sans exception.", false, "C’est le modèle central du cours ; des variations chromosomiques, génétiques ou hormonales existent."),
        ],
        source: sexBloodHereditySource(
          "3-4 et 7",
          "Document 1 sur les chromosomes sexuels et interprétation de la méiose",
          [
            "La « partie inexistante sur Y » est explicitée en régions propres à X et en petites régions pseudoautosomales partagées.",
            "La formule « un type de gamète » chez la femme est limitée au chromosome sexuel X ; les ovules restent différents pour de nombreux autosomes.",
            "Le modèle XX-XY est présenté comme le modèle typique étudié et non comme la description exhaustive de toutes les variations du développement sexuel.",
          ],
        ),
        distractors: ["L’ovule porte normalement un chromosome Y.", "Une cellule XX produit des ovules X ou Y.", "Le sexe chromosomique est choisi consciemment avant la méiose."],
      },
      {
        id: "sex-cross",
        title: "Interpréter l’échiquier XX-XY",
        summary: "Construire l’échiquier XX-XY, relier chaque chromosome parental aux deux issues et interpréter correctement la probabilité de 1/2.",
        conceptTitle: "La fécondation réunit au hasard un ovule X et un spermatozoïde X ou Y",
        explanation: "L’ovule apporte presque toujours X ; le spermatozoïde fécondant apporte X ou Y. L’échiquier scolaire donne donc environ $1/2$ XX et $1/2$ XY à chaque conception, sans ordre obligatoire dans une famille.",
        keyPoint: "X ovulaire + X spermatique → XX ; X ovulaire + Y spermatique → XY, avec deux possibilités théoriquement équiprobables.",
        example: "Après trois naissances XX, une nouvelle fécondation conserve environ une chance sur deux de produire XX ou XY dans le modèle simple.",
        bodyMarkdown: `
## 1. Construire l’échiquier

Relativement aux chromosomes sexuels, les ovules portent X. Les spermatozoïdes portent X ou Y en proportions voisines.

| Ovule / Spermatozoïde | X | Y |
|---|---|---|
| X | XX — modèle chromosomique féminin | XY — modèle chromosomique masculin |

Le tableau du PDF duplique la ligne X pour matérialiser deux ovules possibles, mais ces deux lignes donnent le même résultat. Le bilan théorique reste **50 % XX et 50 % XY**.

## 2. Réussir l’activité de reliage

- Le chromosome **X du père** peut conduire à une descendance XX dans le modèle.
- Le chromosome **Y du père** conduit à une descendance XY dans le modèle.
- Le chromosome **X de la mère** intervient dans les deux issues : XX et XY.

La correction source relie donc le X maternel à la fille **et** au garçon. L’ovule n’est pas l’élément variable de cet échiquier.

## 3. Remplacer « responsabilité » par « contribution aléatoire »

La phrase du PDF « c’est au père qu’incombe la responsabilité » peut être mal comprise. Scientifiquement, **le spermatozoïde fécondant apporte le chromosome X ou Y qui différencie les deux cases**. Aucun parent ne choisit quel spermatozoïde féconde l’ovule ; il n’y a donc ni faute, ni volonté, ni mérite.

## 4. Probabilité n’est pas alternance

Les conceptions successives sont indépendantes dans ce modèle. La naissance précédente ne « consomme » pas une case de l’échiquier. Une famille peut avoir plusieurs enfants du même sexe chromosomique sans contredire la probabilité.

À l’échelle d’une petite famille, les proportions peuvent s’écarter fortement de 50/50. L’équiprobabilité est un **modèle de fécondation**, pas la promesse d’une égalité exacte dans chaque fratrie ni dans chaque échantillon biologique.

> **Astuce mémoire — Mère : X fixe ; père : X ou Y ; hasard : nouvelle rencontre à chaque fois.**
`,
        processTitle: "Rencontre aléatoire des gamètes",
        processInstruction: "Pars de l’ovule X puis ouvre les deux branches spermatiques possibles.",
        process: [
          { label: "Ovule X + spermatozoïde X", shortLabel: "X + X", detail: "Le zygote possède la combinaison XX." },
          { label: "Ovule X + spermatozoïde Y", shortLabel: "X + Y", detail: "Le zygote possède la combinaison XY." },
          { label: "Bilan théorique", shortLabel: "Bilan", detail: "Dans l’échiquier simple, les deux possibilités ont une probabilité voisine de $1/2$." },
          { label: "Interprétation", detail: "Le chromosome variable vient du spermatozoïde, sans décision consciente du père." },
        ],
        interaction: {
          kind: "diagram",
          eyebrow: "Échiquier raisonné",
          title: "Un X ovulaire, deux branches spermatiques",
          instruction: "Ouvre les branches dans l’ordre et formule le bilan sans parler de choix parental.",
          rootLabel: "Ovule X",
          rootDetail: "Relativement à la paire sexuelle, l’ovule fournit X aux deux issues du modèle.",
          nodes: [
            { id: "sperm-x", label: "Spermatozoïde X", role: "Première branche", detail: "Sa fusion avec l’ovule X forme un zygote XX.", group: "Fécondation" },
            { id: "zygote-xx", label: "Zygote XX", role: "Issue théorique", detail: "Il correspond au modèle chromosomique féminin présenté dans le document.", group: "Résultat" },
            { id: "sperm-y", label: "Spermatozoïde Y", role: "Deuxième branche", detail: "Sa fusion avec l’ovule X forme un zygote XY.", group: "Fécondation" },
            { id: "zygote-xy", label: "Zygote XY", role: "Issue théorique", detail: "Il correspond au modèle chromosomique masculin présenté dans le document.", group: "Résultat" },
            { id: "equal", label: "Environ 1/2 — 1/2", role: "Bilan", detail: "Les deux catégories spermatiques ont des chances voisines de participer à la fécondation.", group: "Probabilité" },
            { id: "independent", label: "Nouvelle conception", role: "Indépendance", detail: "Le résultat précédent ne modifie pas la probabilité de la rencontre suivante.", group: "Probabilité" },
          ],
          observation: "Le bon vocabulaire est « contribution chromosomique du spermatozoïde fécondant », pas « décision » ou « culpabilité du père ».",
        },
        observation: "Les naissances précédentes ne modifient pas la probabilité chromosomique de la fécondation suivante.",
        check: choice(
          "Quel gamète apporte le chromosome qui différencie XX de XY dans l’échiquier ?",
          ["Le spermatozoïde", "L’ovule", "Le globule rouge", "Le neurone"],
          0,
          "L’ovule apporte X dans les deux issues ; le spermatozoïde fécondant apporte X ou Y.",
        ),
        extraQuestions: [
          choice("Activité officielle — À quelle issue faut-il relier le chromosome X paternel ?", ["À XY uniquement", "À XX", "À aucun zygote", "Au groupe sanguin O"], 1, "X paternel + X maternel donne XX.", "Activité d’application • page 5"),
          choice("Activité officielle — À quelle issue faut-il relier le chromosome Y paternel ?", ["À XX", "Aux groupes A et B", "À XY", "À tous les ovules sans fécondation"], 2, "Y paternel + X maternel donne XY.", "Activité d’application • page 5"),
          choice("Activité officielle — À quelles issues le chromosome X maternel participe-t-il ?", ["À XX seulement", "À XY seulement", "À aucune", "À XX et à XY"], 3, "L’ovule X figure dans les deux rencontres de l’échiquier.", "Activité d’application et corrigé • page 5"),
          choice("Après la naissance de trois enfants XX, quelle est la probabilité théorique de XY à la conception suivante ?", ["Elle reste voisine de 1/2", "Elle devient 100 %", "Elle devient nulle", "Elle dépend du groupe ABO"], 0, "Chaque conception constitue une nouvelle rencontre aléatoire."),
          trueFalse("L’échiquier impose une alternance fille-garçon dans chaque famille.", false, "Il donne des probabilités pour chaque conception, pas un calendrier des naissances."),
          choice("Quelle reformulation scientifique remplace le mieux « le père est responsable du sexe » ?", ["Le père choisit X ou Y", "La mère décide après la fécondation", "Le spermatozoïde fécondant apporte X ou Y sans contrôle volontaire", "Le groupe sanguin du père impose XX ou XY"], 2, "La contribution chromosomique est aléatoire et ne justifie aucun blâme.", "Interprétation et conclusion • pages 4-5"),
          trueFalse("Une proportion proche de 50/50 dans un modèle signifie que chaque petit échantillon doit être exactement équilibré.", false, "Les fluctuations aléatoires sont normales dans une petite famille ou un petit échantillon."),
          choice("Quelle donnée n’intervient pas dans l’échiquier XX-XY étudié ?", ["Le chromosome X de l’ovule", "Le groupe sanguin ABO des parents", "Le chromosome X d’un spermatozoïde", "Le chromosome Y d’un spermatozoïde"], 1, "Le groupe ABO correspond à un autre gène et à un autre échiquier."),
        ],
        source: sexBloodHereditySource(
          "4-5 et 7",
          "Document 2, échiquier XX-XY, interprétation et activité de reliage",
          [
            "La phrase « c’est au père qu’incombe la responsabilité » est reformulée en contribution chromosomique aléatoire du spermatozoïde, sans choix, faute ni mérite.",
            "L’égalité 50/50 est présentée comme probabilité théorique par conception, non comme répartition obligatoire dans chaque famille.",
            "Le mot « garçon » mal orthographié « graçon » dans le tableau source est corrigé.",
          ],
        ),
        distractors: ["Le père décide volontairement du chromosome porté par un spermatozoïde.", "Après deux filles, un garçon devient certain.", "Une fécondation XX nécessite un ovule Y."],
      },
    ],
    mission: {
      title: "Expertiser deux dossiers : échiquier XX-XY et famille ABO",
      scenario: "Pour préparer son concours de sage-femme, une candidate doit expliquer l’échiquier XX-XY de la situation d’évaluation, puis l’arbre d’une famille où une mère A et un père B ont des enfants AB, B et O. Aide-la à produire deux raisonnements complets et prudents.",
      problem: "Comment identifier les gamètes et les génotypes, dresser les bilans puis formuler les limites de chacun des deux modèles ?",
      bodyMarkdown: `
## Dossier A — La situation d’évaluation officielle

Le document est un **échiquier de croisement**. Les colonnes représentent les spermatozoïdes X et Y ; les lignes, des ovules X. Il faut répondre aux quatre consignes dans l’ordre.

1. **Identifier :** un échiquier de croisement des chromosomes sexuels.
2. **Relever les gamètes :** spermatozoïdes X ou Y ; ovules X relativement à cette paire.
3. **Faire le bilan :** deux cases XX et deux cases XY, soit 50 % XX et 50 % XY dans le modèle.
4. **Expliquer :** l’ovule apporte X dans les deux cas ; le chromosome variable X ou Y est apporté par le spermatozoïde fécondant.

> **Correction de consigne :** le PDF demande le « bilan des femmes et des garçons ». Il faut lire le **bilan des filles et des garçons**, ou plus rigoureusement celui des zygotes XX et XY dans le modèle.

Une réponse respectueuse ajoute que cette contribution est aléatoire : aucun parent ne choisit le spermatozoïde fécondant.

## Dossier B — L’exercice familial ABO

La mère est A, le père B ; les enfants sont AB, B, O et O. La présence d’enfants O révèle immédiatement $i$ chez chaque parent :

$$I^A i × I^B i$$

| Enfant | Génotype expliqué | Origine des allèles |
|---|---|---|
| AB | $I^A I^B$ | $I^A$ maternel et $I^B$ paternel |
| B | $I^B i$ | $i$ maternel et $I^B$ paternel |
| O | $ii$ | $i$ maternel et $i$ paternel |

Le pedigree utilise un cercle pour une femme, un carré pour un homme, une ligne horizontale pour le couple et une ligne verticale puis horizontale pour la descendance.

## La conclusion de haut niveau

Les deux dossiers utilisent une méiose, des gamètes et une fécondation, mais ils répondent à des questions différentes. Le premier suit X et Y ; le second suit le locus ABO autosomal. Leurs probabilités ne prédisent jamais l’ordre exact des enfants.

Le groupe ABO ne suffit ni à certifier une transfusion complète ni à prouver une paternité. L’échiquier XX-XY, lui, explique une contribution chromosomique habituelle sans résumer toute la diversité du développement sexuel humain.

> **Davy te donne la phrase de copie :** « J’identifie le document, je relève les gamètes, je combine les allèles ou chromosomes, je fais le bilan, puis j’annonce la portée et la limite du modèle. »
`,
      investigation: [
        { label: "Identifier les documents", shortLabel: "Identifier", detail: "Reconnaître un échiquier XX-XY et un arbre généalogique portant les groupes ABO." },
        { label: "Relever les gamètes", shortLabel: "Gamètes", detail: "X pour l’ovule, X ou Y pour le spermatozoïde ; $I^A$ ou $i$ chez la mère, $I^B$ ou $i$ chez le père." },
        { label: "Combiner", detail: "Construire séparément l’échiquier chromosomique et l’échiquier ABO." },
        { label: "Faire les bilans", shortLabel: "Bilans", detail: "XX/XY à environ 1/2 ; A/B/AB/O à 1/4 dans le croisement familial." },
        { label: "Annoncer les limites", shortLabel: "Limites", detail: "Probabilités sans ordre certain, pas de choix parental, ABO insuffisant pour prouver une paternité ou garantir seul une transfusion." },
      ],
      interaction: {
        kind: "diagram",
        eyebrow: "Double enquête",
        title: "Un protocole commun, deux preuves distinctes",
        instruction: "Ouvre les cartes des deux dossiers puis termine par les limites.",
        rootLabel: "Fécondation",
        rootDetail: "Elle réunit les patrimoines maternel et paternel ; le caractère suivi détermine les symboles et le bilan.",
        nodes: [
          { id: "sex-document", label: "Échiquier XX-XY", role: "Identifier", detail: "Ovule X croisé avec spermatozoïde X ou Y.", group: "Dossier A" },
          { id: "sex-result", label: "1/2 XX — 1/2 XY", role: "Bilan théorique", detail: "Le chromosome variable est apporté aléatoirement par le spermatozoïde.", group: "Dossier A" },
          { id: "abo-document", label: "Pedigree A × B", role: "Identifier", detail: "Les enfants O révèlent $i$ chez les deux parents.", group: "Dossier B" },
          { id: "abo-result", label: "$I^A i × I^B i$", role: "Bilan génétique", detail: "Les quatre phénotypes A, B, AB et O sont possibles avec $1/4$ chacun.", group: "Dossier B" },
          { id: "probability-limit", label: "Hasard à chaque conception", role: "Limite", detail: "Aucune fratrie n’est tenue de reproduire exactement les pourcentages.", group: "Prudence" },
          { id: "social-limit", label: "Ni preuve ni faute", role: "Prudence", detail: "ABO ne prouve pas une paternité ; X/Y ne dépend pas d’un choix du père.", group: "Prudence" },
        ],
        observation: "Une excellente réponse sépare les deux caractères, montre les calculs et annonce explicitement ce que les documents ne permettent pas de conclure.",
      },
      modelAnswer: "Le document A est un échiquier XX-XY : les ovules portent X et les spermatozoïdes X ou Y, d’où environ 50 % XX et 50 % XY sans choix parental. Dans le dossier B, les enfants O imposent $I^A i$ chez la mère et $I^B i$ chez le père ; l’échiquier explique AB, A, B et O avec $1/4$ chacun. Ces probabilités ne fixent pas l’ordre des naissances et le groupe ABO ne prouve pas une paternité.",
      questions: [
        choice("Situation officielle, consigne 1 — Quel est le document présenté à la candidate ?", ["Un dosage hormonal", "Un arbre ABO", "Un échiquier de croisement XX-XY", "Une courbe de croissance"], 2, "Les lignes et colonnes combinent les gamètes X et Y.", "Situation d’évaluation, consigne 1 • pages 5-6"),
        choice("Situation officielle, consigne 2 — Quels gamètes faut-il relever ?", ["Ovules X ; spermatozoïdes X ou Y", "Ovules X ou Y ; spermatozoïdes X seulement", "Ovules et spermatozoïdes XX", "Globules rouges A ou B"], 0, "La méiose produit des ovules X et deux catégories spermatiques, X ou Y.", "Situation d’évaluation, consigne 2 • page 6"),
        choice("Situation officielle, consigne 3 — Quel bilan donne l’échiquier ?", ["100 % XX", "25 % XX et 75 % XY", "Un résultat dépendant du groupe ABO", "Environ 50 % XX et 50 % XY"], 3, "Deux cases sur quatre sont XX et deux sont XY.", "Situation d’évaluation, consigne 3 • page 6"),
      ],
      extraQuestions: [
        choice("Situation officielle, consigne 4 — Pourquoi le spermatozoïde différencie-t-il les deux issues ?", ["Il apporte X ou Y alors que l’ovule apporte X", "Il choisit consciemment le sexe", "Il transmet seul tous les chromosomes", "Il modifie le groupe ABO après la naissance"], 0, "Le chromosome variable de l’échiquier est celui du spermatozoïde fécondant.", "Situation d’évaluation, consigne 4 • page 6"),
        choice("Exercice officiel 1 — Quels sont les quatre groupes révélés par le texte ?", ["A et O seulement", "A, B, AB et O", "X, Y, XX et XY", "Rh+ et Rh− seulement"], 1, "Les quatre phénotypes ABO usuels sont présents dans la famille.", "Exercice 1, consigne 1 • pages 6-7"),
        choice("Quel génotype maternel explique les enfants O ?", ["$I^A I^A$", "$I^A I^B$", "$I^A i$", "$ii$"], 2, "La mère A doit porter $i$ pour le transmettre.", "Exercice 1, consigne 3 • page 7"),
        choice("Quel génotype paternel explique les enfants O ?", ["$I^A i$", "$I^B I^B$", "$ii$", "$I^B i$"], 3, "Le père B doit également porter et transmettre $i$.", "Exercice 1, consigne 3 • page 7"),
        choice("Quel génotype possède l’enfant B de cette famille ?", ["$I^B i$", "$I^B I^B$", "$I^A I^B$", "$ii$"], 0, "La mère A ne peut lui transmettre que $i$ pour obtenir le groupe B.", "Exercice 1, consigne 3 • page 7"),
        trueFalse("Des groupes ABO compatibles suffisent à établir avec certitude une paternité.", false, "Ils peuvent seulement exclure certains cas ; de nombreux marqueurs ADN sont nécessaires pour établir une parenté."),
        choice("Quelle précaution complète le typage ABO avant une transfusion ?", ["Regarder uniquement le sexe du donneur", "Vérifier notamment RhD, anticorps et compatibilité donneur-receveur", "Compter les enfants du donneur", "Construire l’échiquier XX-XY"], 1, "La sécurité transfusionnelle ne repose jamais sur la seule lettre ABO."),
        choice("Quelle conclusion relie correctement les deux dossiers ?", ["Les deux échiquiers donnent un ordre obligatoire des naissances", "Le chromosome Y porte les allèles ABO", "Chaque échiquier prévoit des probabilités pour un caractère distinct", "Le groupe O impose le modèle XX"], 2, "ABO et XX-XY sont des transmissions distinctes réunies lors de la même fécondation."),
      ],
      source: sexBloodHereditySource(
        "5-7",
        "Situation d’évaluation officielle, corrigé et exercice familial 1",
        [
          "La consigne « fait le bilan » est corrigée en « fais le bilan » et « bilan des femmes et des garçons » en « bilan des filles et des garçons », puis précisée en zygotes XX/XY.",
          "La responsabilité attribuée au père est reformulée en contribution chromosomique aléatoire du spermatozoïde.",
          "Les génotypes des parents et des enfants sont explicités avec la notation $I^A$, $I^B$, $i$ afin de compléter le corrigé source.",
        ],
      ),
    },
  },
  {
    id: "terminale-svt-l6-genetic-predictions",
    chapterNumber: 6,
    themeNumber: 3,
    themeTitle: "Génétique humaine",
    title: "Les prévisions génétiques",
    description: "Lire un pedigree, reconnaître une transmission autosomale ou liée à l’X et comprendre le rôle du conseil et du diagnostic prénatal.",
    centralQuestion: "Comment estimer le risque de transmission d’une maladie héréditaire et informer une famille ?",
    memorySentence: "Phénotypes familiaux → mode de transmission → génotypes probables → risque → conseil et dépistage éclairés.",
    overviewBodyMarkdown: `
## Prévoir n’est pas prédire avec certitude

Une **prévision génétique** estime la probabilité qu’un caractère ou une maladie héréditaire soit transmis. Elle s’appuie sur des données : arbre généalogique, phénotypes, analyses biologiques et, lorsque cela est indiqué, tests génétiques. Elle ne permet jamais d’annoncer l’ordre certain des naissances.

| Étape du raisonnement | Question utile | Exemple dans le document |
|---|---|---|
| **Observer** | Qui est atteint ? À quelle génération ? Quel sexe ? | pedigree de l’hémophilie |
| **Identifier** | Le gène paraît-il autosomal ou lié à X ? Dominant ou récessif ? | garçons atteints, parents parfois sains |
| **Écrire** | Quels génotypes sont compatibles avec tous les faits ? | $X^H X^h$, $X^hY$, $Hb^A/Hb^S$ |
| **Croiser** | Quels gamètes chaque parent peut-il produire ? | $Hb^A$ ou $Hb^S$ pour un parent hétérozygote |
| **Calculer** | Quelle probabilité vaut pour chaque grossesse ? | $1/4$ d’enfant $Hb^S/Hb^S$ dans le croisement étudié |
| **Informer** | Quelles limites et quelles options faut-il expliquer ? | conseil génétique et diagnostic prénatal |

## Deux modèles centraux

### Drépanocytose dans le modèle scolaire du PDF

Le gène **HBB** est autosomal. Un individu $Hb^A/Hb^S$ possède le **trait drépanocytaire** : l’électrophorèse révèle les deux hémoglobines. Lorsque deux parents $Hb^A/Hb^S$ ont un enfant, les probabilités théoriques sont :

$$
\frac14\,Hb^A/Hb^A \quad ; \quad \frac12\,Hb^A/Hb^S \quad ; \quad \frac14\,Hb^S/Hb^S
$$

La présence simultanée des hémoglobines A et S chez l’hétérozygote illustre une **codominance au niveau du phénotype moléculaire**. La drépanocytose $Hb^S/Hb^S$ suit cependant, dans ce croisement simplifié, un mode autosomal récessif au niveau clinique.

### Hémophilie liée au chromosome X

Dans le modèle étudié, l’allèle normal $H$ domine l’allèle $h$. Une femme $X^H X^h$ est hétérozygote ; un garçon $X^hY$ exprime l’hémophilie parce que son chromosome Y ne porte pas une seconde copie correspondante du gène. Le pedigree permet de **tester** cette hypothèse, pas de la décréter après avoir seulement compté les garçons.

> **Astuce mémoire — OICCI :** **O**bserver, **I**dentifier le mode, **C**hoisir les génotypes, **C**roiser, **I**nformer.

## Une règle éthique indispensable

Le conseil génétique explique le risque, la portée des tests, leurs limites et leurs éventuels risques. Il accompagne une décision **libre et éclairée** ; il ne promet pas un enfant « sans maladie » et ne décide pas à la place de la famille.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte de raisonnement",
      title: "Du document familial à une information responsable",
      instruction: "Ouvre les cartes dans l’ordre pour construire une prévision sans transformer un risque en certitude.",
      rootLabel: "Prévision génétique",
      rootDetail: "Une estimation fondée sur des données familiales et biologiques, assortie de limites clairement annoncées.",
      nodes: [
        { id: "observe", label: "1. Observer", role: "Faits", detail: "Relever générations, sexes, phénotypes et résultats biologiques sans interpréter trop tôt.", group: "Analyser" },
        { id: "model", label: "2. Tester un modèle", role: "Hypothèse", detail: "Comparer autosomal/lié à X et dominant/récessif, puis chercher les contradictions.", group: "Analyser" },
        { id: "genotypes", label: "3. Attribuer les génotypes", role: "Compatibilité", detail: "N’écrire que des génotypes compatibles avec toutes les branches et tous les résultats.", group: "Démontrer" },
        { id: "cross", label: "4. Faire l’échiquier", role: "Probabilités", detail: "Lister les gamètes puis calculer les issues possibles pour une conception.", group: "Démontrer" },
        { id: "counsel", label: "5. Informer", role: "Conseil", detail: "Expliquer risque, examens, bénéfices, limites et incertitudes sans pression ni coercition.", group: "Accompagner" },
        { id: "limits", label: "6. Annoncer les limites", role: "Prudence", detail: "Une probabilité ne fixe ni l’ordre des naissances ni le résultat d’une grossesse précise.", group: "Accompagner" },
      ],
      observation: "La qualité d’une prévision tient autant au calcul qu’à la prudence avec laquelle on communique ce qu’il signifie.",
    },
    overviewExtraQuestions: [
      choice("Que fournit principalement une prévision génétique ?", ["L’ordre certain des futures naissances", "Une probabilité fondée sur un modèle et des données", "Une garantie d’absence de maladie", "Une décision imposée à la famille"], 1, "Une prévision quantifie un risque et annonce ses limites."),
      choice("Quel ordre de travail évite les conclusions hâtives ?", ["Croiser → inventer les phénotypes → observer", "Conclure → choisir les faits utiles", "Observer → tester un mode → attribuer les génotypes → croiser", "Compter seulement les hommes atteints"], 2, "Les faits précèdent toujours l’hypothèse et le calcul."),
      trueFalse("Un risque de 25 % signifie que le quatrième enfant sera nécessairement atteint.", false, "Le même risque vaut à chaque grossesse ; les conceptions précédentes n’imposent pas l’issue suivante."),
      choice("Quel couple décrit correctement les deux maladies du document ?", ["Drépanocytose liée à Y ; hémophilie mitochondriale", "Deux maladies toujours dominantes", "Deux maladies dues au groupe ABO", "Drépanocytose autosomale ; hémophilie étudiée liée à X"], 3, "Le support chromosomique n’est pas le même dans les deux modèles."),
      choice("Que révèle directement l’électrophorèse de l’hémoglobine ?", ["Des fractions d’hémoglobine présentes dans l’échantillon", "Les allèles qui migrent hors du noyau", "Le sexe chromosomique", "La totalité du génome"], 0, "Les protéines HbA et HbS sont séparées ; le génotype est ensuite inféré du profil."),
      choice("Pourquoi faut-il vérifier un mode de transmission sur toutes les branches informatives ?", ["Parce qu’un seul individu suffit toujours", "Parce qu’un petit pedigree peut être compatible avec plusieurs hypothèses", "Parce que les génotypes sont visibles à l’œil nu", "Parce que la probabilité remplace les phénotypes"], 1, "La vérification cherche les contradictions et précise ce que les données autorisent."),
      choice("Quelle attitude correspond au conseil génétique ?", ["Présenter une seule décision acceptable", "Cacher les limites des tests", "Informer clairement puis respecter le choix éclairé", "Garantir le résultat d’une grossesse"], 2, "Le conseil aide la famille à comprendre et décider sans pression."),
    ],
    overviewSource: geneticPredictionsSource(
      "1-9",
      "Problématique, conclusions, situations d’évaluation, consolidation et documentation",
      [
        "La couverture interne annonce « leçon 4 » ; le catalogue officiel de la plateforme conserve ce document à sa position de leçon 6.",
        "La situation d’apprentissage est retirée ; ses problèmes biologiques sont repris sans dramatisation familiale.",
        "La prévision est formulée comme estimation d’un risque et accompagnement d’un choix éclairé, jamais comme garantie ou moyen d’« éviter d’avoir des enfants malades ».",
        "L’électrophorèse sépare des hémoglobines présentes dans le sang ; elle ne fait pas migrer les allèles eux-mêmes.",
      ],
    ),
    sections: [
      {
        id: "pedigree-method",
        title: "Lire un arbre généalogique",
        summary: "Repérer générations, sexe, personnes atteintes et transmissions avant de proposer un modèle génétique.",
        conceptTitle: "Le pedigree permet de tester des hypothèses de transmission",
        explanation: "Un arbre généalogique organise les individus par génération et indique leur sexe et leur phénotype. Une maladie qui apparaît chez un enfant de parents sains peut être récessive. Une différence nette entre les sexes peut orienter vers une liaison au chromosome X, mais l’hypothèse doit être vérifiée sur tous les croisements disponibles.",
        keyPoint: "Observer le pedigree → proposer autosomal ou lié au sexe, dominant ou récessif → vérifier chaque branche.",
        example: "Des parents non atteints ayant un fils atteint sont compatibles avec une mère conductrice d’un allèle récessif lié à X, mais il faut vérifier le reste de la famille.",
        bodyMarkdown: `
## 1. Décoder les symboles du pedigree

| Symbole | Signification habituelle |
|---|---|
| carré | homme dans le modèle XX-XY du document |
| cercle | femme dans le modèle XX-XY du document |
| symbole rempli | individu présentant le phénotype étudié |
| trait horizontal | union |
| trait vertical puis fratrie | descendance |
| chiffres romains | générations |
| nombres arabes | individus d’une génération |

Un symbole non rempli indique seulement que le phénotype étudié n’est pas observé. Il ne prouve pas que l’individu ne porte aucun allèle associé à la maladie.

## 2. Tester la dominance

Lorsque deux parents phénotypiquement sains ont un enfant atteint, l’hypothèse **récessive** devient plausible. Chacun des parents peut porter l’allèle sans exprimer la forme typique de la maladie. Une transmission dominante classique est au contraire généralement visible dans chaque génération, sauf pénétrance incomplète, mutation nouvelle ou données manquantes — notions qui dépassent le modèle simple du PDF.

## 3. Tester une liaison au chromosome X

Dans une transmission récessive liée à X :

- un père transmet son chromosome **Y** à ses fils : il ne leur transmet donc pas son allèle porté par X ;
- une mère hétérozygote peut transmettre $X^H$ ou $X^h$ à chacun de ses enfants ;
- un homme atteint transmet son $X^h$ à **toutes ses filles** ;
- la présence de plusieurs garçons atteints peut orienter l’hypothèse, mais le sexe seul ne constitue pas une preuve.

### Application au pedigree du document

Sous l’hypothèse récessive liée à X, la femme 2 doit être compatible avec $X^H X^h$ pour expliquer son fils 6 atteint. La femme 4 est également compatible avec un statut hétérozygote puisqu’elle a un fils 8 atteint avec un père sain. L’homme 6, atteint, ne transmet pas son X à ses fils 10 et 11 : ces deux garçons ont nécessairement reçu $X^h$ de leur mère 7, qui doit donc porter cet allèle dans le modèle. La fille 13 reçoit obligatoirement $X^h$ de son père atteint et est au moins hétérozygote si elle est phénotypiquement non atteinte.

> **Attention au document :** le numéro 5 apparaît isolé sur la ligne de fratrie sans symbole d’individu. Il n’est donc pas possible de lui attribuer un sexe, un phénotype ou un génotype.

> **Astuce mémoire — Père → fils : Y.** Une transmission directe père-fils d’un allèle porté par X est impossible dans le modèle XX-XY.
`,
        interaction: {
          kind: "schema",
          eyebrow: "Pedigree redessiné",
          title: "Lire les branches informatives de la famille",
          instruction: "Sélectionne chaque repère pour vérifier qui peut transmettre l’allèle h.",
          viewBox: "0 0 760 450",
          caption: "Figure originale redessinée d’après le pedigree officiel ; le numéro 5 sans symbole n’est pas représenté comme un individu.",
          shapes: [
            { shape: "text", x: 38, y: 74, content: "I", anchor: "middle" },
            { shape: "text", x: 38, y: 210, content: "II", anchor: "middle" },
            { shape: "text", x: 38, y: 380, content: "III", anchor: "middle" },
            { shape: "path", d: "M270 44 H320 V94 H270 Z", tone: "outline" },
            { shape: "circle", cx: 390, cy: 69, r: 25, tone: "outline" },
            { shape: "line", x1: 320, y1: 69, x2: 365, y2: 69, tone: "outline" },
            { shape: "line", x1: 343, y1: 69, x2: 343, y2: 128, tone: "outline" },
            { shape: "line", x1: 240, y1: 128, x2: 495, y2: 128, tone: "outline" },
            { shape: "line", x1: 275, y1: 128, x2: 275, y2: 174, tone: "outline" },
            { shape: "line", x1: 470, y1: 128, x2: 470, y2: 174, tone: "outline" },
            { shape: "path", d: "M135 174 H185 V224 H135 Z", tone: "outline" },
            { shape: "circle", cx: 275, cy: 199, r: 25, tone: "outline" },
            { shape: "line", x1: 185, y1: 199, x2: 250, y2: 199, tone: "outline" },
            { shape: "path", d: "M445 174 H495 V224 H445 Z", tone: "accent" },
            { shape: "circle", cx: 585, cy: 199, r: 25, tone: "outline" },
            { shape: "line", x1: 495, y1: 199, x2: 560, y2: 199, tone: "outline" },
            { shape: "line", x1: 217, y1: 199, x2: 217, y2: 270, tone: "outline" },
            { shape: "line", x1: 145, y1: 270, x2: 290, y2: 270, tone: "outline" },
            { shape: "line", x1: 160, y1: 270, x2: 160, y2: 320, tone: "outline" },
            { shape: "line", x1: 275, y1: 270, x2: 275, y2: 320, tone: "outline" },
            { shape: "path", d: "M135 320 H185 V370 H135 Z", tone: "accent" },
            { shape: "circle", cx: 275, cy: 345, r: 25, tone: "outline" },
            { shape: "line", x1: 527, y1: 199, x2: 527, y2: 270, tone: "outline" },
            { shape: "line", x1: 400, y1: 270, x2: 690, y2: 270, tone: "outline" },
            { shape: "line", x1: 415, y1: 270, x2: 415, y2: 320, tone: "outline" },
            { shape: "line", x1: 500, y1: 270, x2: 500, y2: 320, tone: "outline" },
            { shape: "line", x1: 585, y1: 270, x2: 585, y2: 320, tone: "outline" },
            { shape: "line", x1: 675, y1: 270, x2: 675, y2: 320, tone: "outline" },
            { shape: "path", d: "M390 320 H440 V370 H390 Z", tone: "accent" },
            { shape: "path", d: "M475 320 H525 V370 H475 Z", tone: "accent" },
            { shape: "path", d: "M560 320 H610 V370 H560 Z", tone: "outline" },
            { shape: "circle", cx: 675, cy: 345, r: 25, tone: "outline" },
            { shape: "text", x: 295, y: 38, content: "1", anchor: "middle" },
            { shape: "text", x: 390, y: 38, content: "2", anchor: "middle" },
            { shape: "text", x: 160, y: 166, content: "3", anchor: "middle" },
            { shape: "text", x: 275, y: 166, content: "4", anchor: "middle" },
            { shape: "text", x: 470, y: 166, content: "6", anchor: "middle" },
            { shape: "text", x: 585, y: 166, content: "7", anchor: "middle" },
            { shape: "text", x: 160, y: 310, content: "8", anchor: "middle" },
            { shape: "text", x: 275, y: 310, content: "9", anchor: "middle" },
            { shape: "text", x: 415, y: 310, content: "10", anchor: "middle" },
            { shape: "text", x: 500, y: 310, content: "11", anchor: "middle" },
            { shape: "text", x: 585, y: 310, content: "12", anchor: "middle" },
            { shape: "text", x: 675, y: 310, content: "13", anchor: "middle" },
          ],
          hotspots: [
            { id: "founders", number: 1, label: "Couple 1-2", detail: "Le fils 6 atteint avec un père 1 sain rend la mère 2 compatible avec un statut hétérozygote XH Xh.", x: 343, y: 69, highlight: [{ shape: "ellipse", cx: 343, cy: 69, rx: 94, ry: 43, tone: "accent" }] },
            { id: "left-branch", number: 2, label: "Branche 3-4", detail: "Le garçon 8 atteint reçoit son Y du père 3 et son Xh de la mère 4 : celle-ci est compatible avec XH Xh.", x: 217, y: 247, highlight: [{ shape: "ellipse", cx: 217, cy: 273, rx: 108, ry: 118, tone: "accent" }] },
            { id: "right-sons", number: 3, label: "Garçons 10-11", detail: "Le père 6 leur transmet Y, pas son Xh. Leur mère 7 doit donc transmettre Xh dans le modèle retenu.", x: 500, y: 295, highlight: [{ shape: "ellipse", cx: 458, cy: 345, rx: 92, ry: 52, tone: "accent" }] },
            { id: "daughter", number: 4, label: "Fille 13", detail: "Son père 6 atteint lui transmet nécessairement Xh ; si elle n’est pas atteinte, elle reçoit XH de sa mère et est hétérozygote.", x: 675, y: 295, highlight: [{ shape: "circle", cx: 675, cy: 345, r: 34, tone: "accent" }] },
          ],
          observation: "Chaque branche vérifie une transmission récessive liée à X ; la simple présence de garçons atteints n’aurait pas suffi.",
        },
        processTitle: "Une lecture sans raccourci",
        processInstruction: "Suis les contrôles qui évitent de conclure trop vite.",
        process: [
          { label: "Repérer", detail: "Numéroter générations et individus, puis relever sexes et phénotypes." },
          { label: "Tester la dominance", shortLabel: "Dominance", detail: "Chercher si des parents sains peuvent avoir un enfant atteint et si le caractère saute des générations." },
          { label: "Tester le support", shortLabel: "Support", detail: "Comparer femmes et hommes et rechercher les transmissions père-fils ou père-fille." },
          { label: "Vérifier", detail: "Attribuer des génotypes compatibles à toutes les personnes informatives." },
        ],
        observation: "Un petit pedigree peut être compatible avec plusieurs modèles : la conclusion doit rester fondée sur les données disponibles.",
        check: q("Quel fait peut orienter vers un caractère récessif ?", "Deux parents phénotypiquement sains ont un enfant atteint", "Tous les individus sont atteints", "La maladie apparaît après un accident", "Le pedigree ne contient qu’une personne"),
        distractors: ["Un seul homme atteint prouve toujours une transmission liée à X.", "On choisit les génotypes avant d’observer les phénotypes.", "Un pedigree donne une certitude sans aucune vérification."],
        extraQuestions: [
          choice("Dans un pedigree conventionnel, que représente un symbole rempli ?", ["Une personne décédée", "Un individu présentant le phénotype étudié", "Un porteur obligatoire non atteint", "Une génération entière"], 1, "Le remplissage code le phénotype étudié.", "Document 2 • pages 1-3 et 9"),
          choice("Quel fait exclut une transmission directe d’un allèle lié à X du père vers son fils ?", ["Le fils reçoit le chromosome Y paternel", "Le fils reçoit deux X paternels", "Le père ne possède aucun chromosome", "La mère transmet toujours Y"], 0, "Dans le modèle XX-XY, le père transmet Y à ses fils.", "Document 2 • pages 2-4"),
          choice("Sous l’hypothèse liée à X, quel statut explique le fils 6 atteint du couple 1-2 ?", ["Le père 1 transmet Xh à son fils", "La mère 2 est compatible avec XH Xh", "Les deux parents sont XhY", "L’individu 5 impose le résultat"], 1, "Le fils reçoit son X de sa mère ; le numéro 5 n’a pas de symbole exploitable.", "Document 2 • pages 2-3 et 9"),
          choice("Pourquoi la femme 4 est-elle compatible avec un statut hétérozygote ?", ["Elle a un fils 8 atteint avec un père sain", "Elle est représentée par un carré rempli", "Son père lui transmet Y", "Toutes les femmes sont obligatoirement porteuses"], 0, "Le fils 8 reçoit Y de son père et l’X porteur de sa mère.", "Document 2 • pages 2-3 et 9"),
          choice("Qui transmet l’allèle h aux garçons 10 et 11 dans le modèle retenu ?", ["Le père 6 par son chromosome X", "L’individu 5", "La mère 7 par un chromosome Xh", "Leur sœur 13"], 2, "Le père transmet Y à ses fils ; l’X vient de la mère.", "Document 2 • pages 2-4 et 9"),
          choice("Quel statut minimal peut-on attribuer à la fille 13 si son père 6 est atteint et si elle ne l’est pas ?", ["XhY", "XH XH avec certitude", "Aucun chromosome X", "XH Xh dans le modèle simple"], 3, "Elle reçoit Xh de son père et un XH maternel si elle est phénotypiquement non atteinte.", "Document 2 • pages 2-4 et 9"),
          trueFalse("Le fait que seuls des hommes soient atteints dans un petit pedigree prouve à lui seul une transmission liée à X.", false, "Cela oriente l’hypothèse, qui doit ensuite être vérifiée sur les transmissions disponibles."),
          choice("Que peut-on conclure au sujet de l’individu numéroté 5 dans le PDF ?", ["Il est un homme sain", "Il est une femme atteinte", "Aucun symbole ne permet de lui attribuer un phénotype ou un génotype", "Il est le père de 10"], 2, "Le nombre 5 apparaît seul sur une ligne : aucune information individuelle fiable ne l’accompagne."),
        ],
        source: geneticPredictionsSource(
          "1-4 et 9",
          "Document 2 : pedigree familial de l’hémophilie, analyse, vérification chromosomique et conclusion",
          [
            "Le seul déséquilibre entre les sexes est présenté comme un indice, non comme une preuve suffisante d’une liaison à X.",
            "Le numéro 5 apparaît sans symbole d’individu dans le pedigree ; aucun génotype n’est inventé pour lui.",
            "La branche 6-7 est complétée : les fils 10 et 11 reçoivent Xh de leur mère, tandis que la fille 13 reçoit obligatoirement Xh de son père atteint.",
          ],
        ),
      },
      {
        id: "sickle-cell",
        title: "Prévoir la drépanocytose",
        summary: "Relier électrophorèse, allèles HbA et HbS et probabilités d’un croisement entre deux hétérozygotes.",
        conceptTitle: "La drépanocytose étudiée est une transmission autosomale",
        explanation: "L’électrophorèse distingue les hémoglobines A et S. Les deux allèles sont détectables chez l’hétérozygote HbA/HbS : ils sont codominants au niveau moléculaire. Deux parents HbA/HbS peuvent produire HbA/HbA, HbA/HbS ou HbS/HbS ; la forme grave correspond dans le modèle scolaire à HbS/HbS.",
        keyPoint: "HbA/HbS × HbA/HbS donne 1/4 HbA/HbA, 1/2 HbA/HbS et 1/4 HbS/HbS à chaque grossesse.",
        example: "Des parents apparemment en bonne santé peuvent chacun transmettre HbS et avoir un enfant HbS/HbS.",
        bodyMarkdown: `
## 1. Ce que mesure réellement l’électrophorèse

L’électrophorèse soumet les molécules d’un échantillon à un champ électrique. Les différentes **fractions d’hémoglobine** ne migrent pas exactement de la même manière ; leurs bandes permettent d’identifier HbA, HbS ou leur présence simultanée.

> **Correction de vocabulaire :** l’examen ne « sépare pas les allèles ». Les allèles sont des versions du gène **HBB** dans l’ADN. L’électrophorèse sépare les protéines d’hémoglobine et permet d’en **inférer** le génotype dans le cadre du document.

| Profil observé | Génotype scolaire | Interprétation dans l’exercice |
|---|---|---|
| bande HbA seule | $Hb^A/Hb^A$ | profil normal pour ce caractère |
| bandes HbA et HbS | $Hb^A/Hb^S$ | trait drépanocytaire, hétérozygote |
| bande HbS seule | $Hb^S/Hb^S$ | drépanocytose dans le modèle étudié |

La notation $Hb^A/Hb^S$ est conservée parce qu’elle est celle du cours. Rigoureusement, elle abrège les variantes du gène de la bêta-globine dont les produits sont HbA et HbS.

## 2. Interpréter le document officiel

Le père et la mère possèdent chacun les bandes HbA et HbS : ils sont $Hb^A/Hb^S$. Le premier enfant ne présente que HbA : le document l’interprète comme $Hb^A/Hb^A$. Le fœtus ne présente que HbS : il est interprété comme $Hb^S/Hb^S$.

La coexistence de HbA et HbS chez les parents signifie que les deux variantes sont détectables chez l’hétérozygote. Cette **codominance moléculaire** ne doit pas être confondue avec le mode clinique : les parents AS ont généralement le trait drépanocytaire et ne présentent pas la forme SS typique.

## 3. Construire l’échiquier

Chaque parent $Hb^A/Hb^S$ produit deux catégories de gamètes : $Hb^A$ ou $Hb^S$.

|  | $Hb^A$ paternel | $Hb^S$ paternel |
|---|---|---|
| $Hb^A$ maternel | $Hb^A/Hb^A$ | $Hb^A/Hb^S$ |
| $Hb^S$ maternel | $Hb^A/Hb^S$ | $Hb^S/Hb^S$ |

Donc, à **chaque grossesse** :

- $25\\%$ de probabilité $Hb^A/Hb^A$ ;
- $50\\%$ de probabilité $Hb^A/Hb^S$ ;
- $25\\%$ de probabilité $Hb^S/Hb^S$.

## 4. Lire le pedigree de l’exercice 2 sans inventer

Sylvie et Charles, phénotypiquement non atteints, ont des enfants Franck et Odette atteints : ils doivent être compatibles avec $Hb^A/Hb^S$ dans ce modèle. Franck et Odette sont $Hb^S/Hb^S$. En revanche, Marthe et Romaric, non atteints, peuvent être $Hb^A/Hb^A$ **ou** $Hb^A/Hb^S$ : le pedigree seul ne permet pas de trancher.

> **Astuce mémoire — AS × AS : 1–2–1.** Un AA, deux AS, un SS dans les quatre cases théoriques.
`,
        interaction: {
          kind: "schema",
          eyebrow: "Électrophorèse redessinée",
          title: "Lire les bandes de la famille C1-C2-F",
          instruction: "Sélectionne chaque piste puis ouvre la conclusion génétique.",
          viewBox: "0 0 760 420",
          caption: "Schéma original inspiré des électrophorèses des pages 1, 7 et 8 ; aucune image du PDF n’est republiée.",
          shapes: [
            { shape: "text", x: 105, y: 85, content: "HbA", anchor: "middle" },
            { shape: "text", x: 105, y: 245, content: "HbS", anchor: "middle" },
            { shape: "line", x1: 135, y1: 80, x2: 690, y2: 80, tone: "muted" },
            { shape: "line", x1: 135, y1: 240, x2: 690, y2: 240, tone: "muted" },
            { shape: "line", x1: 210, y1: 45, x2: 210, y2: 300, tone: "outline" },
            { shape: "line", x1: 380, y1: 45, x2: 380, y2: 300, tone: "outline" },
            { shape: "line", x1: 550, y1: 45, x2: 550, y2: 300, tone: "outline" },
            { shape: "ellipse", cx: 210, cy: 80, rx: 52, ry: 13, tone: "accent" },
            { shape: "ellipse", cx: 210, cy: 240, rx: 52, ry: 13, tone: "soft" },
            { shape: "ellipse", cx: 380, cy: 240, rx: 52, ry: 13, tone: "accent" },
            { shape: "ellipse", cx: 550, cy: 80, rx: 52, ry: 13, tone: "accent" },
            { shape: "ellipse", cx: 550, cy: 240, rx: 52, ry: 13, tone: "soft" },
            { shape: "text", x: 210, y: 330, content: "Parent C1", anchor: "middle" },
            { shape: "text", x: 380, y: 330, content: "Fœtus F", anchor: "middle" },
            { shape: "text", x: 550, y: 330, content: "Parent C2", anchor: "middle" },
            { shape: "path", d: "M665 275 L690 240 L640 240 Z", tone: "muted" },
            { shape: "line", x1: 665, y1: 275, x2: 665, y2: 350, tone: "muted" },
            { shape: "text", x: 665, y: 376, content: "sens de lecture", anchor: "middle" },
          ],
          hotspots: [
            { id: "c1", number: 1, label: "Parent C1", detail: "Deux bandes, HbA et HbS : profil hétérozygote HbA/HbS.", x: 210, y: 176, highlight: [{ shape: "ellipse", cx: 210, cy: 160, rx: 78, ry: 122, tone: "accent" }] },
            { id: "fetus", number: 2, label: "Fœtus F", detail: "Bande HbS seule dans le document : profil interprété comme HbS/HbS.", x: 380, y: 176, highlight: [{ shape: "ellipse", cx: 380, cy: 240, rx: 73, ry: 32, tone: "accent" }] },
            { id: "c2", number: 3, label: "Parent C2", detail: "Deux bandes, HbA et HbS : profil hétérozygote HbA/HbS.", x: 550, y: 176, highlight: [{ shape: "ellipse", cx: 550, cy: 160, rx: 78, ry: 122, tone: "accent" }] },
            { id: "risk", number: 4, label: "Croisement AS × AS", detail: "Les deux parents produisent A ou S : 1/4 AA, 1/2 AS et 1/4 SS à chaque grossesse.", x: 665, y: 176, highlight: [{ shape: "ellipse", cx: 665, cy: 175, rx: 68, ry: 103, tone: "accent" }] },
          ],
          observation: "La bande renseigne sur l’hémoglobine présente ; l’échiquier explique ensuite pourquoi un profil SS est possible avec deux parents AS.",
        },
        processTitle: "Du test au risque",
        processInstruction: "Transforme le profil d’hémoglobine en génotype puis en probabilité.",
        process: [
          { label: "Électrophorèse", detail: "Une bande HbA et une bande HbS révèlent un individu HbA/HbS." },
          { label: "Gamètes", detail: "Chaque parent hétérozygote produit des gamètes HbA ou HbS." },
          { label: "Échiquier", detail: "Les quatre rencontres donnent AA, AS, AS et SS." },
          { label: "Risque", detail: "La probabilité de HbS/HbS est de 1/4 pour chaque grossesse." },
        ],
        observation: "Être hétérozygote HbA/HbS n’est pas équivalent à présenter la forme grave HbS/HbS.",
        check: q("Quel est le risque HbS/HbS pour deux parents HbA/HbS ?", "1/4 à chaque grossesse", "1/2 après deux enfants", "100 %", "0 %"),
        distractors: ["L’allèle HbS est porté uniquement par le chromosome X.", "Deux parents HbA/HbS ne peuvent produire que des enfants HbA/HbS.", "La probabilité cumulée impose qu’un quatrième enfant soit HbS/HbS."],
        extraQuestions: [
          choice("Document 1 — Quel profil possèdent le père et la mère ?", ["HbA seule", "HbS seule", "HbA et HbS", "Aucune hémoglobine"], 2, "Les deux bandes sont visibles chez chacun des parents.", "Document 1 • pages 1-2"),
          choice("Document 1 — Quel profil possède le premier enfant ?", ["HbA seule", "HbA et HbS", "HbS seule", "HbF uniquement"], 0, "Le document montre seulement la bande HbA.", "Document 1 • pages 1-2"),
          choice("Document 1 — Quel profil possède le fœtus ?", ["HbA seule", "HbA et HbS", "HbS seule", "Aucune bande"], 2, "La bande HbS est la seule indiquée pour le fœtus.", "Document 1 • pages 1-2"),
          choice("Que sépare directement l’électrophorèse utilisée dans le document ?", ["Les individus d’une famille", "Des fractions d’hémoglobine", "Les chromosomes X et Y", "Les grossesses successives"], 1, "Le génotype est inféré à partir des protéines séparées.", "Exercice 3 • pages 7-8"),
          choice("Pourquoi les deux hémoglobines sont-elles dites codominantes dans l’hétérozygote ?", ["HbS supprime totalement HbA", "Aucune protéine n’est produite", "Les deux formes sont détectées simultanément", "Elles se situent sur le chromosome X"], 2, "Les bandes HbA et HbS sont toutes deux visibles.", "Document 1 • pages 1-2"),
          choice("Exercice 2 — Quels génotypes doit-on attribuer à Sylvie et Charles pour expliquer des enfants SS ?", ["AA et AA", "AS et AS", "SS et SS", "AA et SS seulement"], 1, "Chacun doit pouvoir transmettre S tout en étant phénotypiquement non atteint.", "Exercice 2 • page 6"),
          choice("Exercice 2 — Quels génotypes ont Franck et Odette, représentés atteints ?", ["AA", "AS", "SS", "XhY"], 2, "Dans le modèle de l’exercice, le phénotype drépanocytaire correspond à SS.", "Exercice 2 • page 6"),
          choice("Exercice 2 — Que peut-on conclure pour Marthe et Romaric, non atteints ?", ["Ils sont nécessairement AA", "Ils sont nécessairement SS", "Ils sont forcément liés à X", "Ils peuvent être AA ou AS sans test complémentaire"], 3, "Le pedigree seul ne distingue pas un homozygote AA d’un hétérozygote AS non atteint.", "Exercice 2 • page 6"),
          choice("Exercice 3 — Quels génotypes résument correctement C1, C2 et F ?", ["C1 AA ; C2 SS ; F AS", "C1 AS ; C2 AS ; F SS", "C1 SS ; C2 SS ; F AA", "C1 XHY ; C2 XHXh ; F XhY"], 1, "Les parents ont deux bandes et le fœtus la bande HbS seule.", "Exercice 3 • pages 7-8"),
          trueFalse("La naissance préalable d’un enfant AA réduit à zéro le risque SS de la grossesse suivante.", false, "Chaque conception conserve théoriquement la répartition 1/4, 1/2, 1/4."),
        ],
        source: geneticPredictionsSource(
          "1-2 et 6-8",
          "Document 1, exercice familial 2, exercice 3, échiquier et corrections",
          [
            "L’électrophorèse est décrite comme séparation des hémoglobines ; l’expression « séparer les allèles » de l’exercice 3 est corrigée.",
            "La codominance des produits HbA/HbS est distinguée du caractère autosomal récessif de la maladie clinique dans le modèle AS × AS.",
            "Les génotypes de Marthe et Romaric ne sont pas déterminables avec certitude : un individu non atteint peut être AA ou AS.",
            "La coquille « les deux parents C1 et C1 » est rétablie en C1 et C2.",
          ],
        ),
      },
      {
        id: "hemophilia-x-linked",
        title: "Prévoir l’hémophilie liée à l’X",
        summary: "Expliquer une transmission récessive liée à l’X en écrivant correctement les génotypes féminins et masculins.",
        conceptTitle: "Chez un garçon, l’allèle porté par l’unique chromosome X s’exprime",
        explanation: "Dans le modèle du cours, l’allèle normal H domine l’allèle h de l’hémophilie et le gène est porté par X. Une femme XH Xh peut être conductrice sans être atteinte ; un garçon XhY est atteint car il ne possède pas un second allèle sur Y pour masquer h.",
        keyPoint: "Mère XH Xh × père XH Y : 1/2 des fils reçoivent Xh ; les filles reçoivent nécessairement XH du père dans ce croisement.",
        example: "Le père transmet son chromosome Y à ses fils : un fils ne reçoit donc jamais l’X paternel dans le modèle XX-XY.",
        bodyMarkdown: `
## 1. Une maladie de la coagulation

L’hémophilie est une maladie héréditaire dans laquelle la coagulation du sang fonctionne mal en raison d’un déficit en facteur de coagulation. L’hémophilie A concerne principalement le facteur VIII et l’hémophilie B le facteur IX. Dire simplement que le sang est « incoagulable » est donc trop absolu : la coagulation est **insuffisante ou anormalement lente**.

Dans le modèle du document, l’allèle normal est noté $H$ et l’allèle associé à l’hémophilie $h$. Le gène est porté par le chromosome X.

| Individu | Génotype scolaire | Interprétation simplifiée |
|---|---|---|
| femme non porteuse | $X^H X^H$ | ne transmet pas $h$ |
| femme hétérozygote | $X^H X^h$ | peut transmettre $X^h$ ; des symptômes sont possibles |
| homme non atteint | $X^H Y$ | transmet $X^H$ à ses filles, Y à ses fils |
| homme atteint | $X^hY$ | transmet $X^h$ à toutes ses filles, jamais à ses fils |

## 2. Vérifier le croisement du document

Le couple étudié est :

$$
X^H X^h \times X^H Y
$$

La mère produit des ovules $X^H$ ou $X^h$. Le père produit des spermatozoïdes $X^H$ ou $Y$.

|  | $X^H$ paternel | $Y$ paternel |
|---|---|---|
| $X^H$ maternel | $X^H X^H$ : fille sans $h$ | $X^H Y$ : garçon non atteint |
| $X^h$ maternel | $X^H X^h$ : fille hétérozygote | $X^hY$ : garçon atteint |

### Deux façons correctes d’annoncer le risque

- parmi **tous les enfants** : $1/4$ de garçon atteint dans ce croisement théorique ;
- parmi les **garçons seulement** : $1/2$ atteint et $1/2$ non atteint ;
- parmi les **filles seulement** : aucune n’est homozygote atteinte dans ce croisement, mais $1/2$ est hétérozygote.

Ne mélange pas une probabilité conditionnelle « parmi les garçons » avec une probabilité portant sur toutes les grossesses.

## 3. Ce que la conclusion du PDF doit préciser

La phrase « aucune fille n’est hémophile » est vraie uniquement pour le **croisement particulier** $X^H X^h \times X^H Y$ si l’on retient le modèle scolaire simplifié. Elle ne doit pas devenir une règle générale : certaines femmes hétérozygotes présentent des saignements, et des femmes peuvent plus rarement être atteintes selon leur génotype ou le fonctionnement de leurs chromosomes X.

> **Astuce mémoire — X aux filles, Y aux fils :** regarde d’abord ce que transmet le père, puis complète avec l’X maternel.
`,
        interaction: {
          kind: "schema",
          eyebrow: "Échiquier redessiné",
          title: "Croisement XH Xh × XH Y",
          instruction: "Sélectionne chaque case pour distinguer sexe chromosomique, phénotype et statut hétérozygote.",
          viewBox: "0 0 760 430",
          caption: "Échiquier original redessiné d’après la vérification chromosomique des pages 3-4.",
          shapes: [
            { shape: "path", d: "M155 90 H650 V350 H155 Z", tone: "outline" },
            { shape: "line", x1: 320, y1: 90, x2: 320, y2: 350, tone: "outline" },
            { shape: "line", x1: 485, y1: 90, x2: 485, y2: 350, tone: "outline" },
            { shape: "line", x1: 155, y1: 175, x2: 650, y2: 175, tone: "outline" },
            { shape: "line", x1: 155, y1: 262, x2: 650, y2: 262, tone: "outline" },
            { shape: "text", x: 235, y: 137, content: "Gamètes", anchor: "middle" },
            { shape: "text", x: 402, y: 137, content: "XH", anchor: "middle" },
            { shape: "text", x: 567, y: 137, content: "Y", anchor: "middle" },
            { shape: "text", x: 235, y: 222, content: "XH", anchor: "middle" },
            { shape: "text", x: 235, y: 308, content: "Xh", anchor: "middle" },
            { shape: "text", x: 402, y: 213, content: "XH XH", anchor: "middle" },
            { shape: "text", x: 402, y: 238, content: "fille", anchor: "middle" },
            { shape: "text", x: 567, y: 213, content: "XH Y", anchor: "middle" },
            { shape: "text", x: 567, y: 238, content: "garçon", anchor: "middle" },
            { shape: "text", x: 402, y: 299, content: "XH Xh", anchor: "middle" },
            { shape: "text", x: 402, y: 324, content: "fille hétérozygote", anchor: "middle" },
            { shape: "text", x: 567, y: 299, content: "Xh Y", anchor: "middle" },
            { shape: "text", x: 567, y: 324, content: "garçon atteint", anchor: "middle" },
          ],
          hotspots: [
            { id: "daughter-clear", number: 1, label: "Fille XH XH", detail: "Elle reçoit XH de chacun des parents et ne porte pas l’allèle h.", x: 402, y: 215, highlight: [{ shape: "ellipse", cx: 402, cy: 218, rx: 73, ry: 37, tone: "accent" }] },
            { id: "son-clear", number: 2, label: "Garçon XH Y", detail: "Il reçoit XH de sa mère et Y de son père ; il n’est pas atteint dans ce modèle.", x: 567, y: 215, highlight: [{ shape: "ellipse", cx: 567, cy: 218, rx: 73, ry: 37, tone: "accent" }] },
            { id: "daughter-carrier", number: 3, label: "Fille XH Xh", detail: "Elle reçoit XH du père et Xh de la mère : elle est hétérozygote et peut transmettre h.", x: 402, y: 304, highlight: [{ shape: "ellipse", cx: 402, cy: 308, rx: 92, ry: 40, tone: "accent" }] },
            { id: "son-affected", number: 4, label: "Garçon Xh Y", detail: "Il reçoit Xh de sa mère et Y de son père : l’allèle h s’exprime sur son unique X.", x: 567, y: 304, highlight: [{ shape: "ellipse", cx: 567, cy: 308, rx: 86, ry: 40, tone: "accent" }] },
          ],
          observation: "Le même tableau donne 1/4 de garçon atteint parmi toutes les grossesses, mais 1/2 parmi les garçons seulement.",
        },
        processTitle: "Suivre l’allèle h",
        processInstruction: "Observe séparément les gamètes maternels et paternels.",
        process: [
          { label: "Mère conductrice", shortLabel: "Mère", detail: "Elle produit des ovules XH ou Xh." },
          { label: "Père sain", shortLabel: "Père", detail: "Il produit des spermatozoïdes XH ou Y." },
          { label: "Filles", detail: "Elles reçoivent XH du père : XH XH ou XH Xh dans ce croisement." },
          { label: "Garçons", detail: "Ils reçoivent Y du père : XH Y ou XhY selon l’ovule." },
        ],
        observation: "On doit préciser « la moitié des garçons » et non « la moitié de tous les enfants » lorsque l’on conditionne la probabilité au sexe.",
        check: q("Quel génotype correspond à un garçon hémophile dans ce modèle ?", "XhY", "XHXH", "XHY", "XHXh"),
        distractors: ["Un père transmet son chromosome X à tous ses fils.", "Une femme conductrice porte obligatoirement deux allèles h.", "Une transmission liée à X donne toujours exactement le même nombre d’individus atteints."],
        extraQuestions: [
          choice("Quel chromosome un père transmet-il à chacun de ses fils dans le modèle XX-XY ?", ["Son chromosome X", "Ses deux X", "Son chromosome Y", "Aucun chromosome sexuel"], 2, "Le fils reçoit Y du père et X de la mère."),
          choice("Quels gamètes produit une mère XH Xh ?", ["XH seulement", "XH ou Xh", "Y seulement", "Xh ou Y"], 1, "Chacun de ses ovules porte l’un de ses deux chromosomes X.", "Vérification chromosomique • pages 3-4"),
          choice("Quels gamètes produit un père XH Y ?", ["XH ou Y", "XH ou Xh", "Deux Y", "Xh seulement"], 0, "Ses spermatozoïdes portent XH ou Y.", "Vérification chromosomique • pages 3-4"),
          choice("Dans ce croisement, quelle fraction de toutes les grossesses correspond à un garçon atteint ?", ["1/2", "3/4", "1", "1/4"], 3, "Une case sur quatre est XhY.", "Bilan • page 4"),
          choice("Parmi les garçons issus de ce croisement, quel est le risque d’être atteint ?", ["1/2", "1/4", "0", "1"], 0, "Les deux issues masculines sont XHY et XhY.", "Conclusion • page 4"),
          choice("Parmi les filles issues de ce croisement, quelle fraction est hétérozygote ?", ["Toutes", "La moitié", "Aucune", "Un quart parmi les filles"], 1, "Les deux issues féminines sont XHXH et XHXh.", "Bilan • page 4"),
          trueFalse("Une femme hétérozygote pour l’hémophilie est toujours totalement dépourvue de symptômes.", false, "Certaines femmes hétérozygotes peuvent présenter des saignements ; le terme porteuse ne signifie pas forcément absence totale d’expression."),
          choice("Quelle formulation corrige la conclusion « aucune fille n’est hémophile » ?", ["Aucune femme ne peut jamais être atteinte", "Toutes les filles sont atteintes", "Dans ce croisement scolaire, aucune fille n’est homozygote atteinte, mais la moitié est hétérozygote", "Le sexe ne dépend d’aucun chromosome"], 2, "La conclusion doit être limitée au croisement analysé."),
        ],
        source: geneticPredictionsSource(
          "1-4 et 9",
          "Document 2 : hémophilie, pedigree, vérification chromosomique, bilan et conclusion",
          [
            "Le sang n’est pas décrit comme absolument « incoagulable » : l’hémophilie est un déficit de coagulation, notamment lié aux facteurs VIII ou IX.",
            "La conclusion « aucune fille n’est hémophile » est limitée au croisement XH Xh × XH Y ; elle n’est pas généralisée à toutes les femmes.",
            "Les femmes hétérozygotes peuvent présenter des symptômes et les formes féminines sont possibles, quoique moins fréquentes.",
            "Les probabilités 1/4 parmi toutes les grossesses et 1/2 parmi les garçons sont explicitement distinguées.",
          ],
        ),
      },
      {
        id: "screening-counseling",
        title: "Conseiller et dépister de façon responsable",
        summary: "Distinguer consultation génétique, dépistage parental et examens prénataux, avec leurs rôles et leurs limites.",
        conceptTitle: "Prévoir signifie informer, pas décider à la place de la famille",
        explanation: "La consultation et le conseil génétiques reconstituent l’histoire familiale, proposent des tests et calculent un risque. L’électrophorèse peut rechercher des variants d’hémoglobine. Pendant la grossesse, l’échographie observe sans prélèvement ; la biopsie de villosités choriales et l’amniocentèse permettent des analyses fœtales mais sont des actes médicaux invasifs encadrés.",
        keyPoint: "Le conseil génétique fournit une information fiable, explique bénéfices et risques des examens et respecte le choix éclairé des parents.",
        example: "Un risque de 25 % ne prédit pas le résultat d’une grossesse précise ; il aide le couple à comprendre les possibilités et les options médicales.",
        bodyMarkdown: `
## 1. Avant une grossesse : connaître sans imposer

Le PDF parle de consultation « prénuptiale ». Le terme plus large **consultation préconceptionnelle** convient aussi à un couple qui souhaite comprendre un risque avant une grossesse, qu’il soit marié ou non. Le professionnel peut :

- reconstituer l’histoire familiale et le pedigree ;
- proposer un test de statut drépanocytaire ou une analyse ciblée selon la maladie ;
- expliquer le mode de transmission et calculer un risque de récurrence ;
- présenter les options médicales et accompagner la réflexion.

Pour la drépanocytose, l’électrophorèse de l’hémoglobine, la chromatographie ou des analyses moléculaires peuvent contribuer à identifier le statut. Pour l’hémophilie, on ne mesure pas un vague « taux sanguin » : le diagnostic mobilise notamment les facteurs VIII ou IX et, selon le contexte, une analyse génétique.

## 2. Pendant la grossesse : dépistage ou diagnostic ?

| Examen | Prélèvement ? | Ce qu’il apporte | Limite essentielle |
|---|---:|---|---|
| **échographie** | non | observe l’anatomie et le développement | ne détermine pas à elle seule un génotype $Hb^S/Hb^S$ |
| **dépistage prénatal** | variable | estime un risque pour certaines anomalies | un résultat de dépistage n’est pas un diagnostic |
| **prélèvement de villosités choriales** | oui, placenta | cellules permettant une analyse diagnostique ciblée | acte invasif, réalisé sous indication médicale |
| **amniocentèse** | oui, liquide amniotique | cellules fœtales pour analyses chromosomiques ou moléculaires | acte invasif avec un risque faible mais non nul |

Les repères temporels actuels diffèrent légèrement du document de 2022 : le prélèvement de villosités choriales est généralement réalisé vers **10 à 13 semaines**, tandis que l’amniocentèse l’est habituellement vers **15 à 20 semaines**. Le moment exact dépend de l’indication et du protocole médical.

> **Correction de classement :** les villosités choriales et l’amniocentèse sont des **tests diagnostiques invasifs**, pas de simples techniques de dépistage. L’échographie ne remplace pas l’analyse moléculaire ciblée.

## 3. Comprendre un résultat

Un résultat positif concerne seulement la maladie ou l’anomalie recherchée ; un résultat négatif n’exclut pas toutes les maladies génétiques. La portée, la précision et les risques doivent être expliqués avant le consentement.

Le document mentionne aussi l’embryoscopie. Ce n’est pas une méthode courante de dépistage génétique de routine dans la démarche présentée ici ; aucune place équivalente à l’échographie, au prélèvement de villosités choriales ou à l’amniocentèse ne lui est attribuée.

## 4. Le conseil génétique est non directif

Informer ne signifie ni sélectionner des personnes ni contraindre une décision reproductive. Le professionnel présente les données de façon équilibrée, aide à interpréter l’incertitude et respecte les valeurs et le choix de la famille.

> **Astuce mémoire — EDI :** **É**chographie = observer ; **D**iagnostic invasif = prélever et analyser ; **I**nformer = respecter le choix.
`,
        interaction: {
          kind: "diagram",
          eyebrow: "Parcours de décision",
          title: "Du conseil au diagnostic prénatal",
          instruction: "Ouvre chaque branche pour distinguer information, dépistage et diagnostic.",
          rootLabel: "Famille informée",
          rootDetail: "Le point de départ est une question ou un risque familial ; le point d’arrivée est une décision éclairée, jamais imposée.",
          nodes: [
            { id: "history", label: "Histoire familiale", role: "Évaluer", detail: "Pedigree, antécédents et résultats existants permettent d’identifier une hypothèse de transmission.", group: "Avant la grossesse" },
            { id: "parent-tests", label: "Tests parentaux", role: "Préciser", detail: "Électrophorèse, dosage de facteurs ou analyse ciblée selon la maladie recherchée.", group: "Avant la grossesse" },
            { id: "counseling", label: "Conseil génétique", role: "Expliquer", detail: "Mode de transmission, risque, options, incertitudes et soutien psychologique.", group: "À chaque étape" },
            { id: "ultrasound", label: "Échographie", role: "Observer", detail: "Imagerie non invasive de l’anatomie ; elle ne diagnostique pas seule le génotype drépanocytaire.", group: "Pendant la grossesse" },
            { id: "cvs", label: "Villosités choriales", role: "Diagnostiquer", detail: "Prélèvement placentaire généralement vers 10-13 semaines pour une analyse ciblée.", group: "Pendant la grossesse" },
            { id: "amnio", label: "Amniocentèse", role: "Diagnostiquer", detail: "Prélèvement de liquide amniotique habituellement vers 15-20 semaines.", group: "Pendant la grossesse" },
            { id: "choice", label: "Choix éclairé", role: "Respecter", detail: "La famille choisit d’accepter ou de refuser les examens après une information équilibrée.", group: "Décision" },
          ],
          observation: "Dépister estime un risque ; diagnostiquer recherche précisément une anomalie ; conseiller aide à comprendre sans imposer.",
        },
        processTitle: "Du conseil à l’examen",
        processInstruction: "Distingue les objectifs des différentes démarches médicales.",
        process: [
          { label: "Conseil génétique", shortLabel: "Conseil", detail: "Analyser l’histoire familiale, expliquer la transmission et respecter les décisions." },
          { label: "Dépistage parental", shortLabel: "Parents", detail: "Groupage, électrophorèse ou analyse ciblée selon l’anomalie recherchée." },
          { label: "Échographie", detail: "Imagerie non invasive du développement fœtal, sans déterminer toutes les anomalies génétiques." },
          { label: "Prélèvement prénatal", shortLabel: "Prélèvement", detail: "Villosités choriales ou liquide amniotique peuvent être analysés sous indication médicale." },
        ],
        observation: "Un examen n’est pertinent que si son indication, sa précision, ses limites et ses risques sont expliqués.",
        check: q("Quel est le rôle principal du conseil génétique ?", "Informer sur la transmission et les options en respectant le choix", "Garantir un enfant sans aucune anomalie", "Imposer une décision familiale", "Remplacer tous les examens médicaux"),
        distractors: ["L’amniocentèse est un test sans prélèvement.", "Un risque génétique est une certitude individuelle.", "Le conseil génétique doit décider à la place des parents."],
        extraQuestions: [
          choice("Quel examen du document permet d’identifier des fractions HbA et HbS chez les parents ?", ["L’échographie", "L’électrophorèse de l’hémoglobine", "La radiographie du squelette", "Le pedigree seul"], 1, "L’électrophorèse sépare les fractions d’hémoglobine.", "Analyse des résultats • page 5"),
          choice("Quelle proposition distingue correctement dépistage et diagnostic ?", ["Ils donnent toujours la même certitude", "Le dépistage estime un risque ; le diagnostic recherche précisément l’anomalie", "Le diagnostic ne nécessite jamais de prélèvement", "L’échographie détermine tous les génotypes"], 1, "Un test de dépistage n’est pas équivalent à un test diagnostique."),
          choice("Quel examen prélève des cellules du placenta ?", ["Le prélèvement de villosités choriales", "L’électrophorèse parentale", "L’échographie", "Le groupage ABO"], 0, "Les villosités choriales appartiennent au placenta.", "Document 2 • pages 4-5 et 8"),
          choice("Quel examen prélève du liquide amniotique sous guidage échographique ?", ["Le pedigree", "L’amniocentèse", "Le conseil génétique", "Le dosage du facteur VIII"], 1, "L’amniocentèse recueille une petite quantité de liquide amniotique.", "Document 2 • pages 4-5 et 8"),
          choice("Quels repères temporels sont les plus justes aujourd’hui ?", ["Villosités choriales 10-13 semaines ; amniocentèse 15-20 semaines", "Les deux examens uniquement après la naissance", "Amniocentèse avant 5 semaines", "Échographie obligatoire à 40 semaines seulement"], 0, "Ces plages usuelles actualisent les repères 9e et 17e semaines du PDF."),
          trueFalse("Une échographie normale exclut toutes les maladies génétiques.", false, "L’échographie observe surtout l’anatomie ; elle ne détecte pas tous les variants génétiques."),
          choice("Pourquoi les examens invasifs exigent-ils une information et un consentement ?", ["Parce qu’ils garantissent un résultat parfait", "Parce qu’ils comportent des limites et un risque faible mais réel", "Parce que la famille n’a aucun choix", "Parce qu’ils ne prélèvent rien"], 1, "Le bénéfice attendu doit être mis en balance avec les limites et risques."),
          choice("Quelle phrase correspond à un conseil génétique non directif ?", ["Voici les données et les options ; nous allons vous aider à décider selon vos valeurs", "Vous devez choisir l’option que je préfère", "Le risque est une certitude", "Un test décide à votre place"], 0, "Le professionnel informe et accompagne sans pression."),
        ],
        source: geneticPredictionsSource(
          "4-6 et 8",
          "Conseil génétique, moyens de diagnostic prénatal, analyse, conclusion et situation d’évaluation",
          [
            "La consultation dite « prénuptiale » est élargie à la consultation préconceptionnelle et au conseil génétique.",
            "Le dépistage est distingué du diagnostic : villosités choriales et amniocentèse sont des examens diagnostiques invasifs.",
            "Les fenêtres temporelles sont actualisées : villosités choriales généralement 10-13 semaines, amniocentèse 15-20 semaines.",
            "L’échographie ne diagnostique pas à elle seule un génotype drépanocytaire ; l’embryoscopie n’est pas présentée comme dépistage génétique courant.",
            "Le diagnostic de l’hémophilie est relié aux facteurs VIII/IX et à l’analyse ciblée, plutôt qu’à un vague « taux sanguin ».",
          ],
        ),
      },
    ],
    mission: {
      title: "Conseiller un couple après des examens d’hémoglobine",
      scenario: "Deux parents ont chacun les hémoglobines A et S. Pendant la grossesse, on leur parle d’échographie, de biopsie des villosités choriales et d’amniocentèse. Explique la maladie recherchée, le risque et le rôle des examens.",
      problem: "Comment communiquer un risque de drépanocytose sans le présenter comme une certitude ni supprimer le choix des parents ?",
      bodyMarkdown: `
## Situation d’évaluation officielle

Le père et la mère réalisent des examens portant sur l’hémoglobine. Pendant la grossesse, la mère se rend à la PMI et reçoit des informations sur l’échographie, le prélèvement de villosités choriales, l’amniocentèse et, dans le texte source, l’embryoscopie.

La consigne demande :

1. d’identifier la maladie recherchée par l’étude des hémoglobines ;
2. de qualifier les examens réalisés chez les parents et ceux concernant l’enfant à naître ;
3. d’expliquer leur intérêt.

## 1. Identifier la maladie et le statut parental

La présence d’HbA et d’HbS chez chacun des parents correspond au profil $Hb^A/Hb^S$. La maladie recherchée est la **drépanocytose**. L’électrophorèse observe les hémoglobines présentes ; elle permet ici d’inférer le statut hétérozygote des parents.

## 2. Calculer le risque

$$
Hb^A/Hb^S \times Hb^A/Hb^S
$$

Chaque parent produit des gamètes $Hb^A$ ou $Hb^S$. L’échiquier donne :

| Issue théorique | Probabilité par grossesse | Signification dans le modèle |
|---|---:|---|
| $Hb^A/Hb^A$ | $25\\%$ | ni maladie ni trait S |
| $Hb^A/Hb^S$ | $50\\%$ | trait drépanocytaire |
| $Hb^S/Hb^S$ | $25\\%$ | drépanocytose SS |

Le risque de $25\\%$ est **réinitialisé à chaque grossesse**. Il ne désigne ni un rang de naissance ni un résultat déjà connu.

## 3. Qualifier les examens

- Les examens des parents relèvent du **dépistage du statut** et de la consultation préconceptionnelle ou prénatale.
- L’échographie est une imagerie non invasive du développement et de l’anatomie.
- Le prélèvement de villosités choriales et l’amniocentèse sont des **examens diagnostiques prénataux invasifs** pouvant fournir des cellules pour une analyse ciblée.

## 4. Expliquer leur bien-fondé

Ces démarches permettent de connaître un statut parental, d’estimer un risque, de rechercher précisément une anomalie lorsqu’un diagnostic est indiqué, de préparer une prise en charge et d’accompagner la famille. Elles ne garantissent pas l’absence de toute maladie et ne « suppriment » pas les maladies héréditaires.

> **Réponse modèle :** « Les profils HbA/HbS des deux parents indiquent un trait drépanocytaire. Le croisement AS × AS donne, à chaque grossesse, un risque de 25 % d’enfant SS. Le conseil génétique explique ce risque. L’échographie observe le développement, tandis que les villosités choriales ou l’amniocentèse peuvent permettre un diagnostic ciblé après consentement. Les résultats éclairent la décision et la préparation des soins sans imposer un choix. »

> **Davy te rappelle :** maladie → génotypes → gamètes → risque → type d’examen → limite → choix éclairé.
`,
      investigation: [
        { label: "Identifier", detail: "Les profils HbA/HbS orientent vers la drépanocytose et un statut hétérozygote parental." },
        { label: "Calculer", detail: "Le croisement donne 1/4 AA, 1/2 AS et 1/4 SS à chaque grossesse." },
        { label: "Distinguer", detail: "Échographie, biopsie de villosités choriales et amniocentèse n’apportent pas la même information ni les mêmes risques." },
        { label: "Informer", detail: "Le professionnel explique les résultats et accompagne une décision libre et éclairée." },
      ],
      interaction: {
        kind: "diagram",
        eyebrow: "Dossier de synthèse",
        title: "Relier calcul, examens et décision",
        instruction: "Ouvre les cartes de gauche à droite puis termine par la limite.",
        rootLabel: "Couple HbA/HbS × HbA/HbS",
        rootDetail: "Deux parents hétérozygotes demandent ce que les examens permettent réellement de connaître.",
        nodes: [
          { id: "profiles", label: "Profils parentaux AS", role: "Donnée", detail: "Deux bandes d’hémoglobine permettent d’inférer HbA/HbS chez chaque parent.", group: "Parents" },
          { id: "cross", label: "Échiquier 1–2–1", role: "Calcul", detail: "1/4 AA, 1/2 AS, 1/4 SS pour chaque nouvelle grossesse.", group: "Risque" },
          { id: "ultrasound", label: "Échographie", role: "Imagerie", detail: "Elle observe l’anatomie et le développement, mais ne détermine pas seule le génotype SS.", group: "Examens" },
          { id: "diagnosis", label: "Villosités / amniocentèse", role: "Diagnostic", detail: "Des cellules sont prélevées pour une analyse ciblée sous indication médicale et après consentement.", group: "Examens" },
          { id: "counsel", label: "Conseil génétique", role: "Accompagnement", detail: "Les données, limites, risques et options sont expliqués dans un langage compréhensible.", group: "Décision" },
          { id: "boundary", label: "Aucune garantie totale", role: "Limite", detail: "Un résultat porte sur ce qui a été recherché et ne décide pas à la place de la famille.", group: "Décision" },
        ],
        observation: "Une réponse excellente associe le calcul du risque à la nature exacte des examens et à une communication non directive.",
      },
      modelAnswer: "Les parents HbA/HbS ont, à chaque grossesse, un risque de 25 % d’enfant HbS/HbS. Les examens parentaux établissent les génotypes ; un diagnostic prénatal ciblé peut renseigner le génotype fœtal, sous indication et avec consentement éclairé.",
      questions: [
        choice("Situation officielle, consigne 1 — Quelle maladie recherche l’étude des hémoglobines A et S ?", ["L’hémophilie", "La drépanocytose", "Le paludisme", "La trisomie 21"], 1, "HbS est la variante étudiée dans la drépanocytose.", "Situation d’évaluation • pages 5-6"),
        choice("Situation officielle, consigne 2 — Comment qualifier les deux groupes d’examens ?", ["Examens parentaux de statut/conseil et examens prénataux chez le fœtus", "Deux radiographies parentales", "Uniquement des traitements", "Deux examens postnataux"], 0, "Les parents recherchent leur statut ; les examens prénataux concernent la grossesse et le fœtus.", "Situation d’évaluation • pages 5-6"),
        choice("Situation officielle, consigne 3 — Quel est leur bien-fondé ?", ["Garantir l’absence de toute maladie", "Imposer une décision", "Identifier un risque ou une anomalie ciblée, préparer les soins et éclairer le choix", "Remplacer le médecin"], 2, "La formulation source « éviter les maladies graves » est remplacée par une explication exacte et non directive.", "Situation d’évaluation et corrigé • pages 5-6"),
      ],
      extraQuestions: [
        choice("Deux parents AS ont quel risque théorique d’enfant SS à chaque grossesse ?", ["0 %", "50 %", "100 %", "25 %"], 3, "Une case SS apparaît dans l’échiquier à quatre cases."),
        choice("Que signifie le profil HbA/HbS d’un parent ?", ["Deux fractions d’hémoglobine sont détectées", "Le parent est nécessairement HbSS", "Le gène est lié à Y", "Le parent ne peut pas transmettre S"], 0, "Le profil hétérozygote contient HbA et HbS."),
        trueFalse("Exercice 1-a — Un allèle est dit hétérosomal lorsqu’il est porté par un autosome.", false, "Un allèle hétérosomal est porté par un hétérochromosome, c’est-à-dire un chromosome sexuel.", "Exercice 1-a et corrigé • page 6"),
        trueFalse("Exercice 1-b — La prévision des anomalies héréditaires se fait uniquement par un dépistage chez les parents.", false, "Le raisonnement familial, les tests parentaux et, selon l’indication, les examens prénataux peuvent être associés.", "Exercice 1-b et corrigé • page 6"),
        trueFalse("Exercice 1-c — L’être humain peut estimer le risque d’apparition de certaines maladies héréditaires.", true, "Il s’agit d’une prévision probabiliste, pas d’une certitude individuelle.", "Exercice 1-c et corrigé • page 6"),
        choice("Quel examen ne peut pas, à lui seul, déterminer un génotype HbSS ?", ["Une analyse moléculaire ciblée sur cellules fœtales", "L’électrophorèse postnatale", "L’échographie anatomique", "Une analyse diagnostique adaptée"], 2, "L’échographie montre des structures, pas directement les variants HBB."),
        choice("Pourquoi le professionnel doit-il annoncer la limite d’un résultat négatif ?", ["Parce qu’il exclut toutes les maladies", "Parce qu’il ne concerne que les anomalies recherchées par le test", "Parce qu’il rend le pedigree inutile", "Parce qu’il fixe le sexe de tous les enfants"], 1, "Un test ciblé n’explore pas l’intégralité des maladies possibles."),
        choice("Quelle phrase conclut correctement la mission ?", ["Les résultats éclairent le couple, qui conserve son choix", "Le médecin choisit obligatoirement à la place du couple", "Le quatrième enfant sera nécessairement SS", "L’échographie remplace tous les tests"], 0, "La décision reste informée et volontaire."),
        choice("Quel enchaînement mérite tous les points au devoir ?", ["Nommer la maladie sans calcul", "Donner seulement 25 %", "Recopier la conclusion source", "Identifier → écrire les génotypes → croiser → qualifier les examens → expliquer limites et choix"], 3, "La réponse complète relie la génétique à la démarche médicale et éthique."),
      ],
      source: geneticPredictionsSource(
        "5-8",
        "Situation d’évaluation officielle, exercices 1 à 3, corrigés, échiquier et documentation prénatale",
        [
          "La coquille « consolidation prénuptiale » est corrigée en consultation préconceptionnelle/prénuptiale ; les examens fœtaux sont qualifiés de prénataux.",
          "Le bien-fondé des examens est reformulé : informer, diagnostiquer une anomalie ciblée, préparer les soins et éclairer le choix, sans promettre d’« éviter » toute maladie.",
          "L’exercice 3 parle de séparation des allèles ; il est corrigé en séparation des fractions d’hémoglobine avec inférence du génotype.",
          "La situation et les exercices sont conservés après « J’ai compris cette partie » ; l’introduction d’apprentissage reste exclue.",
        ],
      ),
    },
  },
  {
    id: "terminale-svt-l7-protein-biosynthesis",
    chapterNumber: 7,
    themeNumber: 4,
    themeTitle: "Expression de l’information génétique",
    title: "La biosynthèse des protéines",
    description: "Identifier les acteurs, lire le code génétique et suivre transcription puis traduction jusqu’à la chaîne polypeptidique.",
    centralQuestion: "Comment l’information portée par l’ADN détermine-t-elle l’ordre des acides aminés d’une protéine ?",
    memorySentence: "ADN — transcription → ARNm — traduction au ribosome avec ARNt → chaîne polypeptidique.",
    overviewBodyMarkdown: `
## Une protéine n’est jamais assemblée au hasard

Une **protéine** est une molécule constituée d’une ou plusieurs chaînes d’**acides aminés**. L’ordre de ces acides aminés dépend d’une information portée par un gène de l’ADN. Dans une cellule eucaryote, l’ADN reste principalement dans le noyau : une copie temporaire, l’**ARN messager** ou ARNm, transporte l’information vers les ribosomes du cytoplasme.

Le passage de l’information à la protéine se fait en deux grandes étapes :

$$
\\mathrm{ADN} \\xrightarrow[\\mathrm{noyau}]{\\mathrm{transcription}} \\mathrm{ARNm}
\\xrightarrow[\\mathrm{ribosome}]{\\mathrm{traduction}} \\mathrm{polypeptide}
$$

| Étape | Lieu simplifié | Molécule lue | Produit obtenu | Acteur central |
|---|---|---|---|---|
| **Transcription** | noyau | un brin matrice d’ADN | un ARNm complémentaire | ARN polymérase |
| **Traduction** | cytoplasme, sur un ribosome | l’ARNm par groupes de trois nucléotides | une chaîne d’acides aminés | ribosome et ARNt |

## Les quatre questions du cours

1. **Quels sont les acteurs ?** ADN, trois catégories d’ARN, ribosome et acides aminés.
2. **Comment lire le message ?** Le code génétique associe chaque codon de l’ARNm à un acide aminé ou à un signal d’arrêt.
3. **Comment copier un gène ?** L’ARN polymérase synthétise un ARNm complémentaire du brin matrice.
4. **Comment assembler la protéine ?** Le ribosome lit l’ARNm de 5′ vers 3′ ; les ARNt apportent les acides aminés dans l’ordre des codons.

## Le vocabulaire qui évite les confusions

| Mot | Définition précise |
|---|---|
| **gène** | portion d’ADN dont l’information contribue à la production d’un ARN fonctionnel et, pour un gène codant, d’une protéine |
| **codon** | triplet de **nucléotides de l’ARNm** |
| **anticodon** | triplet de l’ARNt complémentaire d’un codon |
| **polypeptide** | chaîne d’acides aminés reliés par des liaisons peptidiques |
| **protéine** | molécule fonctionnelle issue d’une ou plusieurs chaînes polypeptidiques repliées et parfois modifiées |

> **Astuce mémoire — CCT :** **C**opier le gène, **C**ouper le message en codons, **T**raduire en acides aminés.

La situation d’apprentissage introductive du PDF n’est pas reproduite. Ses objectifs sont transformés ici en une carte claire, tandis que les activités d’application et les situations d’évaluation sont conservées après les parties de cours.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte interactive",
      title: "De l’information génétique à la protéine",
      instruction: "Ouvre les cartes dans l’ordre pour suivre le trajet de l’information.",
      rootLabel: "Expression d’un gène",
      rootDetail: "Une information de l’ADN est copiée en ARNm puis traduite en une séquence précise d’acides aminés.",
      nodes: [
        { id: "gene", label: "1. Gène dans l’ADN", role: "Information", detail: "Une portion d’ADN contient une séquence de nucléotides dont l’ordre porte l’information.", group: "Noyau" },
        { id: "rna-polymerase", label: "2. ARN polymérase", role: "Copier", detail: "Elle lit le brin matrice et assemble un ARN complémentaire dans le sens 5’ vers 3’.", group: "Noyau" },
        { id: "mrna", label: "3. ARNm", role: "Message", detail: "Il transporte une copie lisible de l’information vers le cytoplasme.", group: "Passage" },
        { id: "ribosome", label: "4. Ribosome", role: "Lire", detail: "Il avance sur l’ARNm codon après codon et organise l’assemblage.", group: "Cytoplasme" },
        { id: "trna", label: "5. ARNt", role: "Adapter", detail: "Son anticodon reconnaît un codon et il apporte l’acide aminé correspondant.", group: "Cytoplasme" },
        { id: "protein", label: "6. Polypeptide", role: "Produit", detail: "Les acides aminés sont reliés dans un ordre déterminé par la séquence de l’ARNm.", group: "Cytoplasme" },
      ],
      observation: "L’ADN ne se transforme pas en protéine : l’information change de support, d’abord vers l’ARNm puis vers l’ordre des acides aminés.",
    },
    overviewExtraQuestions: [
      choice("Quel enchaînement résume l’expression d’un gène codant ?", ["ARNm → ADN → protéine", "ADN → ARNm → chaîne polypeptidique", "Protéine → ARNt → ADN", "Ribosome → ADN → ARNm"], 1, "La transcription produit l’ARNm, puis la traduction produit la chaîne polypeptidique."),
      choice("Où se déroule la transcription dans le modèle de cellule eucaryote du cours ?", ["Dans le noyau", "Dans le site A du ribosome", "Dans la membrane plasmique", "Dans les globules rouges uniquement"], 0, "L’ADN nucléaire sert de matrice à l’ARN polymérase."),
      choice("Où se déroule la traduction ?", ["Sur l’ADN dans le noyau", "Dans le nucléole uniquement", "Sur les ribosomes du cytoplasme", "Dans les chromosomes"], 2, "Les ribosomes lisent l’ARNm dans le cytoplasme, libres ou associés au réticulum endoplasmique rugueux."),
      choice("Quelle molécule sert d’intermédiaire entre l’ADN et le ribosome ?", ["Le glucose", "L’ARNm", "Le glycogène", "Le cholestérol"], 1, "L’ARNm porte la copie du message génétique utilisable par le ribosome."),
      trueFalse("Un codon est un triplet de nucléotides de l’ARNm.", true, "Le PDF parle à tort de trois « acides nucléiques » ; un codon réunit trois nucléotides."),
      choice("Qu’est-ce qui détermine directement l’ordre des acides aminés ?", ["La taille du noyau", "La couleur du ribosome", "Le nombre de chromosomes seulement", "L’ordre des codons dans le cadre de lecture de l’ARNm"], 3, "Chaque codon lu dans le bon cadre correspond à un acide aminé ou à un signal stop."),
      choice("Quelle formule mémoire permet de retrouver le raisonnement ?", ["CCT : copier, couper en codons, traduire", "RAT : respirer, absorber, transpirer", "MCR : muscle, cœur, rein", "ABO : ADN, base, organe"], 0, "CCT résume les trois opérations à appliquer à une séquence."),
    ],
    overviewSource: proteinBiosynthesisSource(
      "1-8",
      "Problématique, acteurs, code génétique, mécanisme et conclusion générale",
      [
        "La situation d’apprentissage introductive est retirée ; ses objectifs deviennent la carte de la leçon.",
        "La formule « associations de 3 acides nucléiques » est corrigée en triplets de nucléotides de l’ARNm.",
        "Le code génétique est présenté comme quasi universel, car quelques exceptions existent notamment dans certains génomes mitochondriaux.",
        "Le passage ADN → ARNm → polypeptide est distingué d’une transformation matérielle de l’ADN en protéine.",
      ],
    ),
    sections: [
      {
        id: "molecular-actors",
        title: "Identifier les acteurs",
        summary: "Distinguer ADN, ARNm, ARNt, ARNr, ribosome et acides aminés par leur rôle.",
        conceptTitle: "Chaque acteur transporte une partie de l’information ou réalise une étape",
        explanation: "L’ADN bicaténaire conserve l’information dans le noyau. L’ARNm en porte une copie vers le cytoplasme. L’ARNt associe un anticodon à un acide aminé. L’ARNr, avec des protéines, constitue le ribosome, machine qui lit l’ARNm et assemble les acides aminés.",
        keyPoint: "ADN = information ; ARNm = message ; ARNt = adaptateur ; ribosome = lecture et assemblage ; acides aminés = unités de la protéine.",
        example: "Un ARNt portant l’anticodon complémentaire du codon AUG apporte la méthionine au début de la traduction.",
        bodyMarkdown: `
## 1. L’ADN conserve l’information

L’**acide désoxyribonucléique** est constitué de deux brins complémentaires et antiparallèles. Dans la cellule eucaryote étudiée, il est contenu principalement dans le noyau. Ses nucléotides portent les bases A, T, C et G.

Un **gène** est une portion d’ADN. Pour fabriquer une protéine, la cellule n’envoie pas la molécule d’ADN entière au ribosome : elle en produit une copie sous forme d’ARN messager.

## 2. Trois ARN, trois fonctions complémentaires

| Molécule | Structure utile | Fonction dans la synthèse |
|---|---|---|
| **ARNm** | brin portant des codons | transporte la copie du message et sert de matrice au ribosome |
| **ARNt** | ARN replié avec un anticodon et un site de fixation | reconnaît un codon et apporte l’acide aminé correspondant |
| **ARNr** | ARN associé à des protéines | forme l’essentiel de la structure et du centre catalytique du ribosome |

Les ARN contiennent A, U, C et G : l’**uracile U** remplace la thymine T de l’ADN. Dire que tout ARN est toujours un simple fil rectiligne serait trompeur : il est monocaténaire au sens où il ne forme pas une double hélice régulière comme l’ADN, mais il peut se replier sur lui-même, en particulier l’ARNt et l’ARNr.

## 3. Le ribosome organise la traduction

Le ribosome possède une **petite sous-unité** et une **grande sous-unité**. Il maintient ensemble l’ARNm et les ARNt, vérifie la reconnaissance codon-anticodon et facilite la formation des liaisons peptidiques.

Le ribosome n’est donc ni un entrepôt de gènes ni le transporteur des acides aminés. Ces rôles appartiennent respectivement à l’ADN et aux ARNt.

## 4. Les acides aminés deviennent un polypeptide

Les acides aminés sont les unités assemblées. Une **liaison peptidique** se forme entre deux acides aminés successifs. La chaîne ainsi obtenue est un polypeptide ; elle doit ensuite se replier et peut subir des modifications pour devenir une protéine fonctionnelle.

| Compartiment | Événement majeur du modèle scolaire |
|---|---|
| noyau | conservation de l’ADN et transcription du gène |
| pore nucléaire | passage de l’ARNm vers le cytoplasme |
| cytoplasme | traduction par les ribosomes avec les ARNt |

> **Astuce mémoire — MTR :** **M**essager = message ; **T**ransfert = transport de l’acide aminé ; **R**ibosomal = ribosome.

> **Point de précision :** le schéma du PDF représente l’ARNm sortant directement après sa synthèse. Dans une cellule eucaryote, le transcrit subit normalement une maturation avant d’être exporté ; ce détail n’est pas exigé par l’activité, mais il évite de confondre transcrit initial et ARNm utilisable.
`,
        interaction: {
          kind: "schema",
          eyebrow: "Cellule redessinée",
          title: "Situer les acteurs de la biosynthèse",
          instruction: "Sélectionne les repères pour suivre le message du noyau jusqu’au polypeptide.",
          viewBox: "0 0 760 440",
          caption: "Figure originale inspirée du schéma des acteurs de la page 2 ; aucune image du PDF n’est republiée.",
          shapes: [
            { shape: "ellipse", cx: 380, cy: 230, rx: 330, ry: 175, tone: "outline" },
            { shape: "ellipse", cx: 235, cy: 220, rx: 120, ry: 105, tone: "soft" },
            { shape: "path", d: "M155 220 C175 150 205 290 225 220 C245 150 275 290 300 220", tone: "accent" },
            { shape: "path", d: "M275 245 C330 245 340 180 405 180 C455 180 470 225 515 225", tone: "outline" },
            { shape: "ellipse", cx: 545, cy: 225, rx: 76, ry: 43, tone: "soft" },
            { shape: "ellipse", cx: 545, cy: 215, rx: 52, ry: 28, tone: "accent" },
            { shape: "path", d: "M430 315 C448 280 465 350 482 315 C500 280 518 350 535 315", tone: "outline" },
            { shape: "circle", cx: 580, cy: 320, r: 15, tone: "accent" },
            { shape: "circle", cx: 615, cy: 335, r: 15, tone: "soft" },
            { shape: "circle", cx: 647, cy: 314, r: 15, tone: "accent" },
            { shape: "line", x1: 590, y1: 327, x2: 604, y2: 333, tone: "outline" },
            { shape: "line", x1: 630, y1: 329, x2: 637, y2: 319, tone: "outline" },
            { shape: "text", x: 235, y: 105, content: "NOYAU", anchor: "middle" },
            { shape: "text", x: 515, y: 105, content: "CYTOPLASME", anchor: "middle" },
            { shape: "text", x: 225, y: 345, content: "ADN", anchor: "middle" },
            { shape: "text", x: 400, y: 160, content: "ARNm", anchor: "middle" },
            { shape: "text", x: 545, y: 175, content: "ribosome", anchor: "middle" },
            { shape: "text", x: 478, y: 375, content: "ARNt", anchor: "middle" },
            { shape: "text", x: 615, y: 375, content: "polypeptide", anchor: "middle" },
          ],
          hotspots: [
            { id: "dna", number: 1, label: "ADN", detail: "Deux brins complémentaires conservent les gènes dans le noyau.", x: 225, y: 220, highlight: [{ shape: "ellipse", cx: 225, cy: 220, rx: 88, ry: 82, tone: "accent" }] },
            { id: "mrna", number: 2, label: "ARN messager", detail: "Copie transitoire du gène, il sort du noyau et présente ses codons au ribosome.", x: 390, y: 180, highlight: [{ shape: "ellipse", cx: 394, cy: 204, rx: 108, ry: 48, tone: "accent" }] },
            { id: "ribosome", number: 3, label: "Ribosome", detail: "Ses deux sous-unités maintiennent l’ARNm et les ARNt pendant l’assemblage.", x: 545, y: 225, highlight: [{ shape: "ellipse", cx: 545, cy: 225, rx: 86, ry: 55, tone: "accent" }] },
            { id: "trna", number: 4, label: "ARN de transfert", detail: "Il porte un acide aminé et reconnaît un codon grâce à son anticodon.", x: 480, y: 315, highlight: [{ shape: "ellipse", cx: 480, cy: 315, rx: 68, ry: 48, tone: "accent" }] },
            { id: "chain", number: 5, label: "Chaîne polypeptidique", detail: "Les acides aminés sont reliés dans l’ordre imposé par les codons de l’ARNm.", x: 615, y: 320, highlight: [{ shape: "ellipse", cx: 615, cy: 323, rx: 75, ry: 42, tone: "accent" }] },
          ],
          observation: "Chaque acteur a un rôle distinct : conserver, copier, transporter, lire ou assembler.",
        },
        processTitle: "Qui fait quoi ?",
        processInstruction: "Associe chaque molécule à sa fonction principale.",
        process: [
          { label: "ADN", detail: "Support stable des gènes ; deux brins complémentaires dans le noyau." },
          { label: "ARN messager", shortLabel: "ARNm", detail: "Copie temporaire d’un gène, lue par codons." },
          { label: "ARN de transfert", shortLabel: "ARNt", detail: "Porte un acide aminé et reconnaît un codon grâce à son anticodon." },
          { label: "Ribosome", detail: "Associe ARNr et protéines, positionne ARNm et ARNt et catalyse l’assemblage." },
        ],
        observation: "L’information ne passe pas directement de l’ADN à la protéine : l’ARNm sert d’intermédiaire.",
        check: q("Quel ARN porte un anticodon et un acide aminé ?", "L’ARNt", "L’ARNm", "L’ARNr seul", "L’ADN"),
        extraQuestions: [
          choice("Quel acteur conserve durablement les gènes dans le noyau ?", ["L’ARNt", "Le ribosome", "L’ADN", "Un acide aminé"], 2, "L’ADN est le support stable de l’information génétique.", "Acteurs • pages 1-2"),
          choice("Quel est le rôle principal de l’ARNm ?", ["Transporter une copie du message vers le ribosome", "Apporter directement l’énergie lumineuse", "Constituer la membrane", "Répliquer tout le chromosome"], 0, "L’ARNm sert de matrice à la traduction.", "Acteurs • page 2"),
          choice("À quoi participe directement l’ARNr ?", ["À la formation du glucose", "À la constitution et à l’activité du ribosome", "Au stockage des lipides", "À la duplication des centrioles"], 1, "L’ARN ribosomal, associé à des protéines, constitue le ribosome.", "Acteurs • page 2"),
          choice("De combien de sous-unités le ribosome du schéma est-il formé ?", ["Une seule", "Trois identiques", "Quatre membranes", "Une grande et une petite"], 3, "Le cours distingue une grande et une petite sous-unité.", "Acteurs • page 2"),
          choice("Quelles sont les unités d’une chaîne polypeptidique ?", ["Les nucléotides", "Les acides aminés", "Les acides gras", "Les oses"], 1, "Les acides aminés sont reliés par des liaisons peptidiques.", "Exercice 2, item 2 • page 10"),
          choice("Quelles bases trouve-t-on dans l’ARN ?", ["A, U, C et G", "A, T, C et G uniquement", "A, U, T et G", "U, T, C et G"], 0, "L’ARN contient de l’uracile à la place de la thymine.", "Exercice 3, item 1 • page 11"),
          choice("Quelle association est incorrecte ?", ["ARNm — message", "ARNt — adaptateur", "ARNr — composant du ribosome", "ADN — transporteur de chaque acide aminé"], 3, "Ce sont les ARNt qui apportent les acides aminés ; l’ADN conserve l’information."),
          trueFalse("L’ARNt peut se replier même s’il est constitué d’un seul brin.", true, "Monocaténaire ne signifie pas rectiligne : des portions complémentaires peuvent s’apparier dans la même molécule."),
        ],
        source: proteinBiosynthesisSource(
          "1-2 et 10-11",
          "Acteurs de la biosynthèse, exercices 2 et 3",
          [
            "Les indices m, t et r, mal détachés dans le PDF, sont rétablis dans ARNm, ARNt et ARNr.",
            "Le caractère monocaténaire des ARN est distingué de leur repliement tridimensionnel.",
            "Le rôle catalytique et structural de l’ARNr dans le ribosome est explicité.",
          ],
        ),
        distractors: ["Le ribosome stocke durablement les gènes.", "L’ARNm apporte directement tous les acides aminés.", "L’ADN quitte normalement le noyau pour être lu par chaque ribosome."],
      },
      {
        id: "genetic-code",
        title: "Décoder le code génétique",
        summary: "Lire un codon de l’ARNm, reconnaître AUG et les codons stop, puis expliquer redondance et universalité.",
        conceptTitle: "Un codon est un triplet de nucléotides de l’ARNm",
        explanation: "Avec quatre nucléotides pris par groupes de trois, il existe 64 codons. Parmi eux, 61 correspondent à des acides aminés et UAA, UAG, UGA sont des signaux stop. AUG code la méthionine et sert généralement de codon initiateur. Plusieurs codons peuvent coder le même acide aminé : le code est redondant, mais chaque codon a une seule signification dans le tableau.",
        keyPoint: "64 codons : 61 codants, 3 stop ; AUG initie généralement ; le code est redondant, non ambigu et quasi universel.",
        example: "UUU et UUC codent tous deux la phénylalanine : redondance ; UUU ne code cependant qu’un seul acide aminé : non-ambiguïté.",
        bodyMarkdown: `
## 1. Le codon est l’unité de lecture

Le ribosome lit l’ARNm par groupes de **trois nucléotides consécutifs** appelés **codons**. Avec quatre nucléotides possibles à chacune des trois positions, le nombre de combinaisons est :

$$
4^3 = 64\\ \\text{codons}
$$

Le PDF parle de « trois acides nucléiques » : c’est une coquille. L’ARNm est un acide nucléique ; ses unités sont les **nucléotides** A, U, C et G.

## 2. Lire correctement le tableau du code génétique

Le tableau se lit toujours à partir d’un **codon d’ARNm écrit de 5′ vers 3′**.

1. repérer la première base ;
2. croiser avec la deuxième base ;
3. choisir la ligne correspondant à la troisième base ;
4. relever l’acide aminé ou le signal stop.

| Codon d’ARNm | Signification |
|---|---|
| UUU ou UUC | phénylalanine |
| UGC | cystéine |
| AUG | méthionine ; codon initiateur habituel |
| UAA, UAG ou UGA | arrêt de la traduction |

Un triplet d’ADN contient T et ne se lit pas directement dans ce tableau. Il faut d’abord écrire l’ARNm correspondant, donc remplacer T par U si l’on part du brin codant, ou appliquer la complémentarité si l’on part du brin matrice.

## 3. Quatre propriétés à maîtriser

| Propriété | Signification | Exemple |
|---|---|---|
| **redondant** ou dégénéré | plusieurs codons peuvent désigner le même acide aminé | UUU et UUC → phénylalanine |
| **non ambigu** | un codon donné ne désigne qu’un seul acide aminé ou un seul signal | UGC → cystéine uniquement |
| **quasi universel** | la grande majorité des organismes utilisent les mêmes correspondances | quelques exceptions existent, notamment dans des mitochondries |
| **ponctué** | un codon initiateur fixe le départ et un codon stop marque la fin | AUG … UGA |

La redondance explique qu’une substitution puisse parfois produire un autre codon donnant **le même acide aminé** : on parle alors de mutation synonyme ou silencieuse.

## 4. Codon et anticodon ne sont pas synonymes

- le **codon** appartient à l’ARNm et est lu de 5′ vers 3′ ;
- l’**anticodon** appartient à un ARNt et s’apparie de façon complémentaire et antiparallèle ;
- par exemple, le codon $5^{\\prime}\\text{-AUG-}3^{\\prime}$ peut être reconnu par l’anticodon $3^{\\prime}\\text{-UAC-}5^{\\prime}$.

## 5. Départ et arrêt

Dans le modèle scolaire, la traduction commence habituellement à **AUG**, qui code la méthionine et place le ribosome dans le bon cadre de lecture. Un AUG situé au milieu d’une séquence peut simplement coder une méthionine : ce n’est pas automatiquement le départ d’une nouvelle protéine.

Les codons **UAA, UAG et UGA** ne correspondent à aucun acide aminé dans le code standard. Ils sont reconnus par des facteurs de libération et déclenchent l’arrêt.

> **Astuce mémoire — AUG allume ; UAA, UAG, UGA arrêtent.** Pour les trois stops, retiens qu’ils commencent tous par U et contiennent A ou G.
`,
        interaction: {
          kind: "diagram",
          eyebrow: "Décodeur interactif",
          title: "Lire un codon sans se tromper de support",
          instruction: "Ouvre les cartes dans l’ordre, du support jusqu’à la propriété du code.",
          rootLabel: "Codon d’ARNm : 5’-AUG-3’",
          rootDetail: "Le tableau du code génétique reçoit un triplet d’ARNm orienté 5’ vers 3’.",
          nodes: [
            { id: "first", label: "1re base : A", role: "Entrée 1", detail: "Choisir le secteur ou la ligne A correspondant à la première position.", group: "Lecture" },
            { id: "second", label: "2e base : U", role: "Entrée 2", detail: "Croiser avec la deuxième position U.", group: "Lecture" },
            { id: "third", label: "3e base : G", role: "Entrée 3", detail: "La troisième base G précise le codon AUG.", group: "Lecture" },
            { id: "meaning", label: "Méthionine", role: "Résultat", detail: "AUG code la méthionine et sert habituellement de codon initiateur.", group: "Sens" },
            { id: "anticodon", label: "Anticodon 3’-UAC-5’", role: "Complément", detail: "Il appartient à l’ARNt et s’apparie de façon antiparallèle avec AUG.", group: "Sens" },
            { id: "stop", label: "UAA · UAG · UGA", role: "Arrêt", detail: "Ces codons sont des signaux de terminaison ; aucun acide aminé « stop » n’est ajouté.", group: "Ponctuation" },
          ],
          observation: "Le support et le sens comptent autant que les lettres : un codon est un triplet d’ARNm lu de 5’ vers 3’.",
        },
        processTitle: "Lire un codon dans le tableau",
        processInstruction: "Utilise toujours l’ARNm dans le sens 5’ vers 3’.",
        process: [
          { label: "Première base", detail: "Choisir la ligne correspondant au premier nucléotide du codon." },
          { label: "Deuxième base", detail: "Choisir la colonne correspondant au deuxième nucléotide." },
          { label: "Troisième base", detail: "Affiner avec le troisième nucléotide pour trouver l’acide aminé." },
          { label: "Signal", detail: "Vérifier si le codon est AUG, un codon d’acide aminé courant ou un codon stop." },
        ],
        observation: "Le tableau se lit avec des codons d’ARNm contenant U ; une séquence d’ADN contenant T doit d’abord être transcrite.",
        check: q("Quels sont les trois codons stop de l’ARNm ?", "UAA, UAG et UGA", "AUG, UGG et UUU", "TAA, TAG et TGA", "AAA, CCC et GGG"),
        extraQuestions: [
          choice("Activité d’application — Quelle définition correspond à un codon ?", ["Un triplet de l’ARNt", "Un acide aminé du ribosome", "Un triplet de bases de l’ARNm", "Une paire de chromosomes"], 2, "Le codon est un triplet de nucléotides de l’ARNm.", "Activité d’application • page 9"),
          choice("Activité d’application — Qu’est-ce qu’un anticodon ?", ["Un triplet complémentaire porté par un ARNt", "Un codon stop de l’ADN", "Une protéine du noyau", "Un triplet de glucose"], 0, "L’anticodon de l’ARNt reconnaît un codon de l’ARNm.", "Activité d’application • page 9"),
          choice("Que signifie « code génétique redondant » ?", ["Un codon possède plusieurs sens", "Plusieurs codons peuvent coder le même acide aminé", "Tous les codons sont stop", "Les protéines contiennent trois bases"], 1, "La redondance porte sur plusieurs codons synonymes pour un même acide aminé.", "Activité d’application • page 9"),
          choice("Pourquoi le code est-il dit non ambigu ?", ["Chaque acide aminé a un seul codon", "Il ne contient aucun signal stop", "Un codon donné a une seule signification", "Il change dans chaque cellule"], 2, "Un codon code un acide aminé précis ou un signal stop, jamais plusieurs sens simultanés.", "Exercice 1, blanc 7 • page 10"),
          choice("Combien de codons du code standard désignent un acide aminé ?", ["20", "61", "3", "64 acides aminés différents"], 1, "Sur 64 codons, 61 sont des codons de sens et 3 sont des codons stop.", "Code génétique • page 3"),
          choice("Quel codon sert habituellement de signal d’initiation dans le modèle étudié ?", ["UAA", "UGA", "AUG", "UAG"], 2, "AUG code la méthionine et fixe habituellement le départ de la traduction.", "Code génétique • pages 3 et 10"),
          choice("Exercice 3 — Dans quelle molécule trouve-t-on un codon ?", ["L’ARNm", "L’ARNt uniquement", "Le brin matrice d’ADN par définition", "Une protéine"], 0, "Le codon est une séquence de trois nucléotides de l’ARN messager.", "Exercice 3, item 2 • page 11"),
          choice("Exercice 3 — Dans quelle molécule trouve-t-on un anticodon ?", ["L’ARNr", "L’ADN", "L’ARNm", "L’ARNt"], 3, "L’anticodon est porté par l’ARN de transfert.", "Exercice 3, item 3 • page 11"),
          choice("Pendant la traduction, quelles propositions du PDF sont justes si l’on parle des codons de sens ?", ["a uniquement", "b uniquement", "a et c", "b et c"], 2, "Un codon de sens a une seule signification et plusieurs codons peuvent être synonymes ; chaque acide aminé n’a pas forcément un seul codon.", "Exercice 2, item 4 • pages 10-11"),
          trueFalse("Le code génétique est absolument identique sans aucune exception dans tous les systèmes vivants.", false, "Il est quasi universel : de rares variantes existent, notamment dans certains génomes mitochondriaux."),
        ],
        source: proteinBiosynthesisSource(
          "3, 9-11",
          "Code génétique, activité d’association et exercices 1 à 3",
          [
            "Les « associations de 3 acides nucléiques » sont corrigées en triplets de nucléotides.",
            "La propriété « universel » est précisée en quasi universel afin de signaler les rares variantes du code.",
            "La phrase « un seul codon peut correspondre à un seul acide aminé (méthionine) » est reformulée : tout codon de sens est non ambigu, tandis que certains acides aminés ont plusieurs codons.",
            "La règle « toutes les synthèses commencent par AUG » est ramenée au modèle canonique : AUG est le codon initiateur habituel et peut aussi coder une méthionine interne.",
          ],
        ),
        distractors: ["Chaque acide aminé possède obligatoirement un seul codon.", "Un même codon code plusieurs acides aminés différents.", "Le code génétique se lit directement sur n’importe quel brin d’ADN sans transcription."],
      },
      {
        id: "transcription",
        title: "Transcrire l’ADN en ARNm",
        summary: "Choisir le brin matrice, appliquer la complémentarité et produire un ARNm orienté.",
        conceptTitle: "L’ARN polymérase copie un gène dans le noyau",
        explanation: "L’ARN polymérase ouvre localement l’ADN et utilise un brin matrice. Elle assemble un ARNm complémentaire et antiparallèle : A de l’ADN appelle U dans l’ARN, T appelle A, C appelle G et G appelle C. L’ARNm obtenu quitte ensuite le noyau vers le cytoplasme.",
        keyPoint: "Brin matrice d’ADN — ARN polymérase et complémentarité → ARNm synthétisé dans le sens 5’ vers 3’.",
        example: "Pour le brin matrice 3’-TAC CCG ATT-5’, l’ARNm est 5’-AUG GGC UAA-3’.",
        bodyMarkdown: `
## 1. La transcription copie une portion d’ADN

Dans le noyau, l’**ARN polymérase** reconnaît une région du gène, ouvre localement la double hélice et utilise un seul brin comme matrice. Elle ne copie pas le chromosome entier pour fabriquer chaque ARNm.

> **Correction essentielle du PDF :** la page 6 cite d’abord l’« ADN polymérase ». Cette enzyme assure principalement la réplication de l’ADN. La transcription est catalysée par une **ARN polymérase**, comme le PDF l’écrit d’ailleurs dans la phrase suivante.

## 2. Brin matrice et brin codant

Les deux brins d’ADN ont des rôles et des orientations différentes.

| Brin | Autres noms utiles | Relation avec l’ARNm |
|---|---|---|
| **brin matrice** | brin transcrit, brin antisens, brin non codant | complémentaire et antiparallèle à l’ARNm |
| **brin codant** | brin non transcrit, brin sens | même séquence que l’ARNm dans le sens 5′ → 3′, avec T à la place de U |

Le PDF appelle le brin matrice « brin codant ou brin transcrit ». Cette juxtaposition est contradictoire dans la nomenclature moderne. Ici, on emploie systématiquement **brin matrice/transcrit** et **brin codant/non transcrit**.

## 3. Les règles de complémentarité

Pendant la transcription :

| Base du brin matrice d’ADN | Base ajoutée dans l’ARN |
|---|---|
| A | U |
| T | A |
| C | G |
| G | C |

L’ARN polymérase lit le brin matrice de 3′ vers 5′ et synthétise l’ARN dans le sens 5′ vers 3′.

### Exemple complet

$$
\\begin{aligned}
\\text{brin codant} &: 5^{\\prime}\\text{-ATG\\ GGC\\ TAA-}3^{\\prime} \\\\
\\text{brin matrice} &: 3^{\\prime}\\text{-TAC\\ CCG\\ ATT-}5^{\\prime} \\\\
\\text{ARNm} &: 5^{\\prime}\\text{-AUG\\ GGC\\ UAA-}3^{\\prime}
\\end{aligned}
$$

Deux chemins donnent le même ARNm :

- depuis le brin matrice, appliquer la complémentarité ;
- depuis le brin codant écrit de 5′ vers 3′, conserver les lettres et remplacer T par U.

## 4. Les étapes du mécanisme

1. **initiation :** l’ARN polymérase se fixe et ouvre localement l’ADN ;
2. **élongation :** elle ajoute les ribonucléotides complémentaires ;
3. **terminaison :** elle libère le transcrit à la fin de la région copiée ;
4. **maturation et export, chez les eucaryotes :** le transcrit est préparé puis l’ARNm rejoint le cytoplasme.

Le cours représente directement l’ARNm exporté. Cette simplification suffit pour les exercices, mais la maturation explique pourquoi le produit immédiatement synthétisé n’est pas toujours encore l’ARNm final.

## 5. Contrôle rapide d’une réponse

Avant de valider une séquence, vérifie :

- les deux extrémités 5′ et 3′ sont écrites ;
- les deux molécules sont antiparallèles lorsqu’elles s’apparient ;
- aucun T ne subsiste dans l’ARNm ;
- l’ARNm ressemble au brin codant, pas au brin matrice ;
- les triplets restent séparés dans le même cadre de lecture.

> **Astuce mémoire — MaCo :** **Ma**trice = **Co**mplémentaire ; **Co**dant = **Co**pie de l’ARNm avec T au lieu de U.
`,
        interaction: {
          kind: "schema",
          eyebrow: "Transcription redessinée",
          title: "Suivre les deux brins et l’ARNm",
          instruction: "Sélectionne les repères pour contrôler support, orientation et enzyme.",
          viewBox: "0 0 760 430",
          caption: "Figure originale inspirée du mécanisme des pages 5-6 ; la nomenclature des brins est corrigée.",
          shapes: [
            { shape: "path", d: "M80 145 C150 95 220 195 290 145 C360 95 430 195 500 145 C570 95 640 195 700 145", tone: "accent" },
            { shape: "path", d: "M80 235 C150 285 220 185 290 235 C360 285 430 185 500 235 C570 285 640 185 700 235", tone: "outline" },
            { shape: "line", x1: 120, y1: 128, x2: 120, y2: 252, tone: "muted" },
            { shape: "line", x1: 205, y1: 153, x2: 205, y2: 227, tone: "muted" },
            { shape: "line", x1: 550, y1: 132, x2: 550, y2: 248, tone: "muted" },
            { shape: "line", x1: 635, y1: 158, x2: 635, y2: 222, tone: "muted" },
            { shape: "ellipse", cx: 380, cy: 190, rx: 112, ry: 84, tone: "soft" },
            { shape: "path", d: "M360 210 C410 255 465 275 535 300 C585 318 625 325 682 330", tone: "accent" },
            { shape: "path", d: "M438 280 L466 278 L450 302 Z", tone: "accent" },
            { shape: "text", x: 180, y: 95, content: "brin codant 5’ → 3’", anchor: "middle" },
            { shape: "text", x: 180, y: 300, content: "brin matrice 3’ → 5’", anchor: "middle" },
            { shape: "text", x: 380, y: 190, content: "ARN polymérase", anchor: "middle" },
            { shape: "text", x: 590, y: 365, content: "ARNm 5’ → 3’", anchor: "middle" },
          ],
          zones: [
            { label: "ADN fermé", xStart: 45, xEnd: 250 },
            { label: "bulle de transcription", xStart: 250, xEnd: 515 },
            { label: "ADN refermé", xStart: 515, xEnd: 720 },
          ],
          hotspots: [
            { id: "coding", number: 1, label: "Brin codant", detail: "Il n’est pas lu par l’enzyme dans ce modèle et possède la séquence de l’ARNm, T remplaçant U.", x: 185, y: 145, highlight: [{ shape: "path", d: "M80 145 C150 95 220 195 290 145", tone: "accent" }] },
            { id: "template", number: 2, label: "Brin matrice", detail: "L’ARN polymérase le lit de 3’ vers 5’ ; il est complémentaire de l’ARNm.", x: 185, y: 235, highlight: [{ shape: "path", d: "M80 235 C150 285 220 185 290 235", tone: "accent" }] },
            { id: "polymerase", number: 3, label: "ARN polymérase", detail: "Elle ouvre localement l’ADN et assemble les ribonucléotides complémentaires.", x: 380, y: 190, highlight: [{ shape: "ellipse", cx: 380, cy: 190, rx: 122, ry: 92, tone: "accent" }] },
            { id: "mrna", number: 4, label: "ARNm naissant", detail: "Il s’allonge dans le sens 5’ vers 3’ et contient U à la place de T.", x: 535, y: 300, highlight: [{ shape: "ellipse", cx: 555, cy: 308, rx: 115, ry: 44, tone: "accent" }] },
          ],
          observation: "Écrire les orientations suffit souvent à éviter l’erreur la plus fréquente : recopier le brin matrice comme s’il était codant.",
        },
        processTitle: "Fabriquer le message",
        processInstruction: "Suis l’ouverture du gène puis la complémentarité des nucléotides.",
        process: [
          { label: "Ouverture", detail: "L’ARN polymérase ouvre localement la portion d’ADN correspondant au gène." },
          { label: "Lecture", detail: "Elle progresse sur le brin matrice dans le sens 3’ vers 5’." },
          { label: "Élongation", detail: "Elle ajoute les ribonucléotides complémentaires et synthétise l’ARNm 5’ vers 3’." },
          { label: "Sortie", detail: "L’ARNm mature rejoint le cytoplasme où les ribosomes pourront le lire." },
        ],
        observation: "L’enzyme correcte de la transcription est l’ARN polymérase ; l’ADN polymérase sert principalement à répliquer l’ADN.",
        check: q("Quelle enzyme synthétise l’ARNm à partir de l’ADN ?", "L’ARN polymérase", "L’ADN ligase seule", "Le ribosome", "L’amylase"),
        extraQuestions: [
          choice("Dans quel sens l’ARN polymérase synthétise-t-elle l’ARN ?", ["3’ vers 5’", "5’ vers 3’", "Dans les deux sens à la fois", "Sans orientation"], 1, "Toute chaîne d’ARN est allongée dans le sens 5’ vers 3’."),
          choice("Quel brin d’ADN est directement lu pendant la transcription ?", ["Le brin matrice", "Le brin codant uniquement", "Les deux brins simultanément pour le même ARNm", "Aucun brin"], 0, "L’ARNm est complémentaire du brin matrice.", "Mécanisme • page 6"),
          choice("Quelle relation unit le brin codant et l’ARNm ?", ["Ils sont complémentaires base à base", "Ils sont antiparallèles et différents partout", "Ils ont la même séquence 5’→3’, sauf T remplacé par U", "L’ARNm contient T à la place de U"], 2, "Le brin codant a la même succession de bases que l’ARNm, avec T dans l’ADN et U dans l’ARN."),
          choice("Quel ARNm correspond au brin matrice 3’-TAC CCG ATT-5’ ?", ["5’-UAC CCG AUU-3’", "3’-AUG GGC UAA-5’", "5’-TAC CCG ATT-3’", "5’-AUG GGC UAA-3’"], 3, "La complémentarité et l’antiparallélisme donnent AUG GGC UAA."),
          choice("Quel est le brin codant correspondant à cet ARNm 5’-AUG GGC UAA-3’ ?", ["5’-ATG GGC TAA-3’", "3’-TAC CCG ATT-5’", "5’-TAC CCG ATT-3’", "3’-AUG GGC UAA-5’"], 0, "Le brin codant reprend la séquence de l’ARNm avec T à la place de U."),
          choice("Quel appariement est correct pendant la transcription ?", ["A de l’ADN avec T de l’ARN", "A de l’ADN avec U de l’ARN", "C de l’ADN avec U de l’ARN", "G de l’ADN avec T de l’ARN"], 1, "Dans l’ARN, U s’apparie avec A du brin matrice."),
          trueFalse("L’ADN polymérase est l’enzyme responsable de la transcription de l’ARNm.", false, "La transcription utilise une ARN polymérase ; l’ADN polymérase intervient principalement dans la réplication.", "Interprétation corrigée • page 6"),
          choice("Pourquoi l’ADN s’ouvre-t-il localement ?", ["Pour quitter le noyau", "Pour devenir une protéine", "Pour rendre accessible la portion matrice du gène", "Pour supprimer tous les nucléotides"], 2, "L’ouverture locale permet à l’ARN polymérase de lire le brin matrice.", "Interprétation • page 6"),
          choice("Quelle molécule quitte le noyau dans le schéma du cours ?", ["Le chromosome entier", "L’ARNm", "Le ribosome complet avec l’ADN", "La membrane nucléaire"], 1, "L’ARNm exporté apporte le message au cytoplasme.", "Résultats • pages 5-6"),
          choice("Quelle affirmation distingue correctement matrice et codant ?", ["Le brin matrice est aussi appelé non transcrit", "Le brin codant est complémentaire de l’ARNm", "Le brin matrice contient de l’uracile", "Le brin matrice est transcrit ; le brin codant est non transcrit"], 3, "Cette nomenclature corrige la confusion présente à la page 6."),
          choice("Quel contrôle révèle immédiatement qu’une séquence n’est pas un ARNm ?", ["Elle contient la base T", "Elle contient la base A", "Elle est écrite en triplets", "Elle possède une extrémité 5’"], 0, "L’ARN utilise U et non T."),
        ],
        source: proteinBiosynthesisSource(
          "4-6 et 11-12",
          "Transcription, orientation des brins et exercices de séquences",
          [
            "L’« ADN polymérase » citée au début de l’interprétation est corrigée en ARN polymérase.",
            "Le « brin codant ou brin transcrit » est corrigé : le brin transcrit est le brin matrice/non codant ; le brin codant est non transcrit.",
            "Les orientations 3’→5’ du brin matrice et 5’→3’ de l’ARN synthétisé sont ajoutées aux séquences pour lever les ambiguïtés.",
            "La maturation de l’ARNm eucaryote est signalée comme précision, sans remplacer le mécanisme simplifié demandé par le PDF.",
          ],
        ),
        distractors: ["La transcription se déroule sur le ribosome dans le cytoplasme.", "L’uracile de l’ARN s’apparie avec la guanine de l’ADN.", "L’ARNm est identique au brin matrice et orienté dans le même sens."],
      },
      {
        id: "translation",
        title: "Traduire l’ARNm en protéine",
        summary: "Suivre initiation, élongation et terminaison au niveau du ribosome.",
        conceptTitle: "Le ribosome transforme une suite de codons en suite d’acides aminés",
        explanation: "À l’initiation, le ribosome se place sur l’ARNm et un ARNt chargé de méthionine reconnaît AUG. Pendant l’élongation, des ARNt successifs apportent les acides aminés correspondant aux codons et des liaisons peptidiques se forment. À un codon stop, aucun ARNt chargé ne correspond : la chaîne est libérée et le complexe se dissocie.",
        keyPoint: "Initiation sur AUG → élongation codon par codon avec les ARNt → terminaison sur UAA, UAG ou UGA.",
        example: "L’ARNm 5’-AUG GGC UAA-3’ produit une chaîne méthionine-glycine, puis la traduction s’arrête.",
        bodyMarkdown: `
## 1. Traduire, c’est changer de langage

La **traduction** convertit l’ordre des nucléotides de l’ARNm en ordre des acides aminés d’un polypeptide. Le ribosome lit l’ARNm dans le sens 5′ → 3′ et la chaîne s’allonge de son extrémité N-terminale vers son extrémité C-terminale.

Trois éléments travaillent ensemble :

- l’**ARNm** présente les codons ;
- les **ARNt chargés** apportent chacun un acide aminé et portent un anticodon ;
- le **ribosome** aligne les partenaires et catalyse les liaisons peptidiques.

Avant la traduction, une enzyme spécifique appelée aminoacyl-ARNt synthétase fixe le bon acide aminé sur son ARNt. Cette étape assure que l’anticodon et l’acide aminé transporté correspondent au code.

## 2. Initiation : placer le cadre de lecture

Dans le modèle canonique du cours :

1. la petite sous-unité du ribosome s’associe à l’ARNm ;
2. l’ARNt initiateur reconnaît le codon AUG et apporte une méthionine ;
3. cet ARNt occupe le **site P** ;
4. la grande sous-unité complète le ribosome.

Le départ fixe le **cadre de lecture**. Décaler le découpage d’un seul nucléotide change tous les codons situés après ce décalage.

## 3. Élongation : répéter trois opérations

| Opération | Ce qui se produit |
|---|---|
| **reconnaissance** | un ARNt chargé entre au site A et son anticodon s’apparie au codon |
| **liaison peptidique** | la chaîne portée au site P est reliée à l’acide aminé du site A |
| **translocation** | le ribosome avance d’un codon ; l’ARNt vide sort et le site A se libère |

Le PDF décrit principalement les sites P et A. On peut aussi nommer le **site E**, par lequel l’ARNt déchargé quitte le ribosome.

## 4. Terminaison : aucun acide aminé « stop »

Quand UAA, UAG ou UGA arrive au site A, aucun ARNt chargé ne possède l’anticodon destiné à y ajouter un acide aminé. Un **facteur de libération** reconnaît le signal, libère la chaîne puis permet la dissociation des sous-unités ribosomiques et de l’ARNm.

> **Correction de précision :** le PDF indique seulement une dissociation entre l’ARNm et la chaîne. La chaîne est en réalité libérée de l’ARNt qui la porte, sous l’action d’un facteur de libération ; le complexe est ensuite recyclé.

## 5. Exemple guidé

Pour l’ARNm :

$$
5^{\\prime}\\text{-AUG\\ GGC\\ UAA-}3^{\\prime}
$$

| Codon | Rôle | Résultat |
|---|---|---|
| AUG | initiation et codon de sens | méthionine |
| GGC | codon de sens | glycine |
| UAA | terminaison | aucun acide aminé ajouté |

La chaîne obtenue est donc **méthionine–glycine**, puis arrêt.

## 6. Lire une séquence plus longue sans dépasser le stop

La séquence corrigée de l’exercice 2 de la page 12 est interprétée comme un ARNm :

$$
5^{\\prime}\\text{-AUG\\ UGC\\ GCU\\ AAA\\ AUA\\ CAU\\ CCG\\ ACG\\ UGA\\ UGC\\ AUG\\ UCA-}3^{\\prime}
$$

La traduction donne : **Met–Cys–Ala–Lys–Ile–His–Pro–Thr**, puis s’arrête à UGA. Les codons placés après ce stop ne sont pas traduits dans ce cadre.

> **Astuce mémoire — RLT :** **R**econnaître, former la **L**iaison, **T**ransloquer. Cette boucle se répète pendant l’élongation.
`,
        interaction: {
          kind: "schema",
          eyebrow: "Ribosome redessiné",
          title: "Observer initiation, élongation et terminaison",
          instruction: "Sélectionne les repères du ribosome puis ouvre le signal d’arrêt.",
          viewBox: "0 0 760 460",
          caption: "Figure originale inspirée des schémas des pages 5 et 7 ; aucun scan n’est intégré.",
          shapes: [
            { shape: "path", d: "M80 330 C190 300 285 352 390 325 C500 295 600 350 690 320", tone: "outline" },
            { shape: "ellipse", cx: 380, cy: 265, rx: 235, ry: 110, tone: "soft" },
            { shape: "ellipse", cx: 380, cy: 315, rx: 185, ry: 65, tone: "accent" },
            { shape: "line", x1: 300, y1: 205, x2: 300, y2: 335, tone: "muted" },
            { shape: "line", x1: 390, y1: 195, x2: 390, y2: 335, tone: "muted" },
            { shape: "line", x1: 480, y1: 205, x2: 480, y2: 335, tone: "muted" },
            { shape: "path", d: "M390 235 C365 180 330 150 320 95", tone: "accent" },
            { shape: "path", d: "M480 235 C500 180 535 150 548 95", tone: "outline" },
            { shape: "circle", cx: 320, cy: 82, r: 17, tone: "accent" },
            { shape: "circle", cx: 548, cy: 82, r: 17, tone: "soft" },
            { shape: "path", d: "M320 82 C350 35 380 58 405 35 C430 12 465 58 495 35", tone: "accent" },
            { shape: "text", x: 300, y: 245, content: "E", anchor: "middle" },
            { shape: "text", x: 390, y: 245, content: "P", anchor: "middle" },
            { shape: "text", x: 480, y: 245, content: "A", anchor: "middle" },
            { shape: "text", x: 205, y: 390, content: "5’", anchor: "middle" },
            { shape: "text", x: 555, y: 390, content: "3’", anchor: "middle" },
            { shape: "text", x: 390, y: 362, content: "ARNm : AUG  GGC  UAA", anchor: "middle" },
            { shape: "text", x: 405, y: 30, content: "chaîne polypeptidique", anchor: "middle" },
          ],
          hotspots: [
            { id: "mrna", number: 1, label: "ARNm", detail: "Le ribosome le parcourt de 5’ vers 3’, trois nucléotides à la fois.", x: 205, y: 330, highlight: [{ shape: "ellipse", cx: 380, cy: 330, rx: 310, ry: 36, tone: "accent" }] },
            { id: "p-site", number: 2, label: "Site P", detail: "Il porte l’ARNt lié à la chaîne en cours d’allongement ; l’ARNt initiateur y débute.", x: 390, y: 265, highlight: [{ shape: "ellipse", cx: 390, cy: 260, rx: 45, ry: 72, tone: "accent" }] },
            { id: "a-site", number: 3, label: "Site A", detail: "Il reçoit le prochain ARNt chargé dont l’anticodon correspond au codon exposé.", x: 480, y: 265, highlight: [{ shape: "ellipse", cx: 480, cy: 260, rx: 45, ry: 72, tone: "accent" }] },
            { id: "trna", number: 4, label: "ARNt chargé", detail: "L’anticodon reconnaît le codon et l’extrémité opposée porte l’acide aminé.", x: 548, y: 145, highlight: [{ shape: "ellipse", cx: 530, cy: 150, rx: 62, ry: 83, tone: "accent" }] },
            { id: "peptide", number: 5, label: "Polypeptide", detail: "Les liaisons peptidiques relient les acides aminés dans l’ordre imposé par les codons.", x: 405, y: 62, highlight: [{ shape: "ellipse", cx: 405, cy: 55, rx: 118, ry: 42, tone: "accent" }] },
            { id: "stop", number: 6, label: "Codon stop", detail: "Un facteur de libération reconnaît UAA, UAG ou UGA ; aucun acide aminé stop n’existe.", x: 600, y: 330, highlight: [{ shape: "ellipse", cx: 590, cy: 330, rx: 72, ry: 40, tone: "accent" }] },
          ],
          observation: "La répétition entrée au site A → liaison → déplacement explique comment l’ordre des codons devient l’ordre des acides aminés.",
        },
        processTitle: "Les trois phases de la traduction",
        processInstruction: "Observe comment le ribosome avance sur l’ARNm dans le sens 5’ vers 3’.",
        process: [
          { label: "Initiation", detail: "Assemblage du ribosome et reconnaissance du codon AUG par l’ARNt initiateur." },
          { label: "Élongation", detail: "Entrée d’un ARNt complémentaire, liaison peptidique puis translocation du ribosome." },
          { label: "Terminaison", detail: "Un codon stop recrute un facteur de libération et la chaîne polypeptidique est libérée." },
        ],
        observation: "La complémentarité codon-anticodon garantit l’ordre des acides aminés, tandis que le code génétique donne leur identité.",
        check: q("Que se passe-t-il lorsqu’un codon stop entre dans le site de lecture ?", "La chaîne polypeptidique est libérée et le ribosome se dissocie", "Un nouvel acide aminé stop est ajouté", "L’ADN quitte le noyau", "La transcription recommence"),
        extraQuestions: [
          choice("Dans quel sens le ribosome lit-il l’ARNm ?", ["3’ vers 5’", "Dans les deux sens", "5’ vers 3’", "Du stop vers AUG"], 2, "La lecture progresse dans le sens 5’ vers 3’."),
          choice("Quel ARNt occupe d’abord le site P dans le modèle canonique ?", ["L’ARNt initiateur chargé de méthionine", "Un ARNt portant un acide aminé stop", "L’ARNr libre", "Un fragment d’ADN"], 0, "L’ARNt initiateur reconnaît AUG et s’installe au site P.", "Initiation • page 6"),
          choice("Que se place-t-il au site A pendant l’élongation ?", ["Le chromosome", "Un nouvel ARNt chargé complémentaire du codon", "La membrane nucléaire", "L’ARN polymérase"], 1, "L’ARNt entrant apporte l’acide aminé suivant.", "Élongation • pages 6-7"),
          choice("Quelle liaison unit deux acides aminés successifs ?", ["Une liaison glycosidique", "Une liaison phosphodiester", "Une liaison hydrogène uniquement", "Une liaison peptidique"], 3, "Le ribosome catalyse la formation de la liaison peptidique.", "Élongation • page 6"),
          choice("Qu’est-ce que la translocation ?", ["La sortie de l’ADN du noyau", "La copie de l’ARNm", "L’avancée du ribosome d’un codon", "La destruction immédiate de la protéine"], 2, "Après la liaison peptidique, le ribosome avance et libère le site A.", "Élongation • page 7"),
          choice("Qui reconnaît directement un codon stop ?", ["Un facteur de libération", "Un ARNt chargé d’un acide aminé stop", "L’ADN polymérase", "Un glucose"], 0, "Les codons stop sont reconnus par des facteurs protéiques de libération."),
          choice("Quelle chaîne donne 5’-AUG GGC UAA-3’ ?", ["Met–Gly–Stop comme troisième acide aminé", "Met–Gly puis arrêt", "Tyr–Pro–Leu", "Aucune chaîne"], 1, "UAA arrête la traduction sans être incorporé à la chaîne."),
          choice("Dans la séquence corrigée de l’exercice 2, quel codon arrête la traduction ?", ["AUG", "UGC", "ACG", "UGA"], 3, "UGA est le neuvième codon et termine la lecture.", "Situation d’évaluation 2 corrigée • page 12"),
          choice("Quelle chaîne précède ce stop ?", ["Met–Cys–Ala–Lys–Ile–His–Pro–Thr", "Met–Cys–Ala–Lys–Ile–His–Pro–Thr–Stop–Cys", "Tyr–Thr–Arg uniquement", "Cys–Tyr–Phe–Gln"], 0, "La lecture s’arrête avant les codons placés après UGA.", "Situation d’évaluation 2 corrigée • page 12"),
          trueFalse("Un AUG situé dans n’importe quelle position déclenche forcément une nouvelle traduction.", false, "AUG sert de départ dans un contexte d’initiation ; à l’intérieur du cadre déjà lu, il code simplement une méthionine."),
          choice("Quelle proposition remet les phases dans l’ordre ?", ["Terminaison → initiation → élongation", "Initiation → élongation → terminaison", "Élongation → transcription → initiation", "Transcription → terminaison → réplication"], 1, "La traduction commence, allonge la chaîne puis s’arrête.", "Analyse • pages 6-7"),
        ],
        source: proteinBiosynthesisSource(
          "5-7 et 10-12",
          "Traduction, initiation, élongation, terminaison et exercices",
          [
            "L’expression « le premier codon est toujours AUG » est précisée : AUG est le codon initiateur habituel du modèle canonique, mais un AUG interne code une méthionine.",
            "La terminaison est complétée par le rôle du facteur de libération ; aucun ARNt ne porte un acide aminé stop.",
            "La séquence de l’exercice 2 page 12, qui mélange T et U, est normalisée en ARNm et la lecture s’arrête au premier UGA du cadre.",
            "L’expression « acide animé » est corrigée en acide aminé et le site de sortie E est ajouté comme précision.",
          ],
        ),
        distractors: ["La traduction se déroule dans le noyau sur l’ADN.", "Le ribosome lit l’ARNm dans les deux sens simultanément.", "Un codon stop code un acide aminé nommé stop."],
      },
    ],
    mission: {
      title: "Comparer deux hormones à partir de leurs séquences d’ADN",
      scenario: "Un groupe compare des portions de gènes de l’ocytocine et de la vasopressine. Il doit construire l’ARNm, utiliser le code génétique et expliquer pourquoi quelques changements de nucléotides modifient certains acides aminés.",
      problem: "Comment passer rigoureusement d’un brin d’ADN à une chaîne polypeptidique et comparer deux protéines ?",
      bodyMarkdown: `
## Dossier A — Ocytocine et vasopressine

Le PDF fournit les deux séquences suivantes sans orientation et les appelle « brins non codants » :

$$
\\begin{aligned}
\\text{Ocytocine} &: \\text{TGC TAC ATC CAG AAC TGC CCC CTG GGC} \\\\
\\text{Vasopressine} &: \\text{TGC TAC TTC CAG AAC TGC CCA AGA GGA}
\\end{aligned}
$$

Or, lues comme des **brins codants de 5′ vers 3′**, ces séquences donnent exactement les deux nonapeptides annoncés. Le mot « non codant » est donc corrigé en **codant**. Il suffit alors de remplacer T par U pour écrire les ARNm.

| Molécule | ARNm 5′ → 3′ | Chaîne obtenue |
|---|---|---|
| ocytocine | UGC UAC AUC CAG AAC UGC CCC CUG GGC | Cys–Tyr–Ile–Gln–Asn–Cys–Pro–Leu–Gly |
| vasopressine | UGC UAC UUC CAG AAC UGC CCA AGA GGA | Cys–Tyr–Phe–Gln–Asn–Cys–Pro–Arg–Gly |

Les deux chaînes diffèrent aux positions **3** et **8** : isoleucine/phénylalanine, puis leucine/arginine. Les codons diffèrent aussi parfois sans changer l’acide aminé : CCC et CCA codent tous deux la proline, GGC et GGA la glycine.

> **Méthode :** identifier le brin → orienter 5′/3′ → écrire l’ARNm → séparer en codons → traduire → comparer position par position.

## Dossier B — Séquence associée à l’albinisme dans l’exercice

L’énoncé page 11 appelle « brin codant 5′→3′ » la séquence TAC ACG CGA TTT TAT GTA, mais les questions attendent manifestement un ARNm commençant par AUG. Pour rendre l’exercice cohérent, on la traite comme le **brin matrice écrit de 3′ vers 5′** :

$$
\\begin{aligned}
\\text{matrice} &: 3^{\\prime}\\text{-TAC\\ ACG\\ CGA\\ TTT\\ TAT\\ GTA-}5^{\\prime} \\\\
\\text{codant} &: 5^{\\prime}\\text{-ATG\\ TGC\\ GCT\\ AAA\\ ATA\\ CAT-}3^{\\prime} \\\\
\\text{ARNm} &: 5^{\\prime}\\text{-AUG\\ UGC\\ GCU\\ AAA\\ AUA\\ CAU-}3^{\\prime} \\\\
\\text{polypeptide} &: \\text{Met–Cys–Ala–Lys–Ile–His}
\\end{aligned}
$$

Deux substitutions du deuxième triplet permettent d’étudier la redondance :

- matrice ACG → ACA, donc ARNm UGC → UGU : cystéine dans les deux cas, mutation **silencieuse** ;
- matrice ACG → ACC, donc ARNm UGC → UGG : cystéine → tryptophane, mutation **faux-sens**.

Ce petit fragment illustre l’effet d’une substitution, mais ne suffit pas à diagnostiquer à lui seul une cause d’albinisme : le contexte clinique et le gène réellement étudié seraient nécessaires.

## Dossier C — La séquence mixte de la page 12

Le document mélange T et U dans une même séquence, ce qui ne correspond ni à un ADN ni à un ARN. On la normalise comme un ARNm :

$$
5^{\\prime}\\text{-AUG\\ UGC\\ GCU\\ AAA\\ AUA\\ CAU\\ CCG\\ ACG\\ UGA\\ UGC\\ AUG\\ UCA-}3^{\\prime}
$$

Le brin codant d’ADN est :

$$
5^{\\prime}\\text{-ATG\\ TGC\\ GCT\\ AAA\\ ATA\\ CAT\\ CCG\\ ACG\\ TGA\\ TGC\\ ATG\\ TCA-}3^{\\prime}
$$

La chaîne traduite avant UGA est **Met–Cys–Ala–Lys–Ile–His–Pro–Thr**. Une mutation TGC → TAC change Cys en Tyr ; une mutation CCG → CCC reste Pro et est silencieuse.

## La réponse parfaite au devoir

Une excellente copie ne donne pas seulement la chaîne finale. Elle annonce le type de brin, écrit les orientations, montre l’ARNm, encadre AUG et le premier codon stop, puis explique chaque différence par les codons concernés.

> **Davy te rappelle :** une lettre peut changer, mais la protéine ne change que si le nouveau codon n’est pas synonyme — ou s’il modifie le départ, l’arrêt ou le cadre de lecture.
`,
      investigation: [
        { label: "Orienter", detail: "Identifier le brin fourni et écrire clairement ses extrémités 5’ et 3’." },
        { label: "Transcrire", detail: "Construire l’ARNm par complémentarité avec le brin matrice ou par remplacement T → U depuis le brin codant." },
        { label: "Découper", detail: "Repérer AUG puis séparer l’ARNm en codons dans le bon cadre de lecture." },
        { label: "Traduire et comparer", shortLabel: "Comparer", detail: "Associer chaque codon à un acide aminé, s’arrêter au codon stop puis relever les substitutions." },
      ],
      interaction: {
        kind: "diagram",
        eyebrow: "Mission comparative",
        title: "Deux séquences proches, deux hormones différentes",
        instruction: "Ouvre les cartes de la méthode puis compare les positions 3 et 8.",
        rootLabel: "Deux brins codants d’ADN",
        rootDetail: "Les séquences officielles sont réinterprétées comme codantes, car elles produisent exactement les nonapeptides annoncés.",
        nodes: [
          { id: "orient", label: "1. Orienter 5’→3’", role: "Préparer", detail: "Le brin fourni est identifié comme codant et écrit dans le même sens que l’ARNm.", group: "Méthode" },
          { id: "transcribe", label: "2. Remplacer T par U", role: "Transcrire", detail: "Depuis un brin codant, l’ARNm conserve les lettres et remplace simplement T par U.", group: "Méthode" },
          { id: "frame", label: "3. Garder les triplets", role: "Cadrer", detail: "Les neuf codons doivent rester alignés position par position.", group: "Méthode" },
          { id: "position3", label: "Position 3", role: "Ile ↔ Phe", detail: "AUC donne isoleucine dans l’ocytocine ; UUC donne phénylalanine dans la vasopressine.", group: "Différences" },
          { id: "position8", label: "Position 8", role: "Leu ↔ Arg", detail: "CUG donne leucine ; AGA donne arginine.", group: "Différences" },
          { id: "synonyms", label: "Positions 7 et 9", role: "Codons synonymes", detail: "CCC/CCA donnent proline et GGC/GGA donnent glycine : les lettres diffèrent sans changer ces acides aminés.", group: "Ressemblances" },
        ],
        observation: "Comparer codon par codon distingue une substitution qui change l’acide aminé d’une substitution synonyme.",
      },
      modelAnswer: "L’ARN polymérase produit un ARNm complémentaire du brin matrice. Le ribosome le lit par codons ; les ARNt apportent les acides aminés correspondants. Des différences de nucléotides peuvent donc changer certains codons et la séquence de la protéine.",
      questions: [
        choice("Situation officielle — Comment faut-il interpréter les séquences TGC TAC… pour retrouver les hormones annoncées ?", ["Comme des brins matrices 5’→3’", "Comme des brins codants 5’→3’", "Comme des ARNt", "Comme des protéines"], 1, "Le remplacement T→U donne directement les ARNm des nonapeptides ; l’étiquette « non codant » du PDF est donc corrigée.", "Situation d’évaluation • page 9"),
        choice("Situation officielle — Quelle chaîne correspond à l’ocytocine ?", ["Cys–Tyr–Ile–Gln–Asn–Cys–Pro–Leu–Gly", "Cys–Tyr–Phe–Gln–Asn–Cys–Pro–Arg–Gly", "Met–Cys–Ala–Lys–Ile–His", "Tyr–Thr–Arg–Phe–Tyr–Val"], 0, "UGC UAC AUC CAG AAC UGC CCC CUG GGC se traduit dans cet ordre.", "Situation d’évaluation, consigne 2 • page 9"),
        choice("Situation officielle — À quelles positions les deux hormones diffèrent-elles ?", ["1 et 2", "4 et 6", "3 et 8", "7 et 9"], 2, "Ile/Phe diffèrent en position 3 et Leu/Arg en position 8.", "Situation d’évaluation, consigne 3 • page 9"),
      ],
      extraQuestions: [
        choice("Quel ARNm correspond au brin codant de l’ocytocine ?", ["ACG AUG UAG GUC UUG ACG GGG GAC CCG", "UGC UAC AUC CAG AAC UGC CCC CUG GGC", "TGC TAC ATC CAG AAC TGC CCC CTG GGC", "UGC UAC UUC CAG AAC UGC CCA AGA GGA"], 1, "Depuis le brin codant, on remplace T par U sans inverser l’ordre.", "Situation d’évaluation • page 9"),
        choice("Quels codons expliquent la différence en position 8 ?", ["AUC et UUC", "CCC et CCA", "GGC et GGA", "CUG et AGA"], 3, "CUG code la leucine et AGA l’arginine.", "Situation d’évaluation • page 9"),
        choice("Pourquoi CCC et CCA ne créent-ils pas de différence à la position 7 ?", ["Ils codent tous deux la proline", "Ils sont tous deux des stops", "Ils appartiennent à l’ADN uniquement", "Ils codent tous deux la glycine"], 0, "La redondance du code rend ces deux codons synonymes.", "Situation d’évaluation • page 9"),
        choice("Activité d’application — Quelle association est juste ?", ["Codon stop — anticodon porté par l’ARNt", "Anticodon — triplet complémentaire porté par l’ARNt", "Code redondant — un codon a plusieurs acides aminés", "Codon initiateur — UAA"], 1, "L’anticodon est le triplet de l’ARNt complémentaire du codon.", "Activité d’application • page 9"),
        choice("Situation albinisme corrigée — Quel ARNm vient de 3’-TAC ACG CGA TTT TAT GTA-5’ ?", ["5’-TAC ACG CGA TTT TAT GTA-3’", "3’-AUG UGC GCU AAA AUA CAU-5’", "5’-AUG UGC GCU AAA AUA CAU-3’", "5’-UAC ACG CGA UUU UAU GUA-3’"], 2, "La complémentarité avec le brin matrice donne AUG UGC GCU AAA AUA CAU.", "Situation d’évaluation 1, consignes 1-2 • pages 11-12"),
        choice("Quelle chaîne donne cet ARNm ?", ["Met–Cys–Ala–Lys–Ile–His", "Tyr–Thr–Arg–Phe–Tyr–Val", "Met–Gly puis arrêt", "Cys–Tyr–Ile–Gln–Asn–Cys"], 0, "Chaque codon est traduit dans l’ordre à partir d’AUG.", "Situation d’évaluation 1, consigne 3 • page 12"),
        choice("Dans le brin matrice, ACG devient ACA. Quel est l’effet ?", ["Un stop prématuré", "Cys devient Trp", "Le cadre est décalé", "UGC devient UGU, mais les deux codent Cys"], 3, "La substitution est silencieuse grâce à la redondance.", "Situation d’évaluation 1, consigne 4 • page 12"),
        choice("Dans le brin matrice, ACG devient ACC. Quel est l’effet ?", ["Aucun changement", "L’ARNm UGC devient UGG : Cys devient Trp", "Met devient stop", "Le ribosome disparaît"], 1, "Le nouveau codon UGG code le tryptophane : c’est une mutation faux-sens.", "Situation d’évaluation 1, consigne 5 • page 12"),
        choice("Situation 2 corrigée — Quel brin codant correspond à l’ARNm AUG UGC GCU ?", ["ATG TGC GCT", "TAC ACG CGA", "AUG UGC GCU", "UAC ACG CGA"], 0, "Le brin codant d’ADN reprend la séquence avec T à la place de U.", "Situation d’évaluation 2, consigne 1 • page 12"),
        choice("Dans l’ARNm de la situation 2, CCG devient CCC. Quel est l’effet ?", ["Pro devient stop", "Cys devient Tyr", "Pro reste Pro : mutation silencieuse", "Le cadre change"], 2, "CCG et CCC codent tous deux la proline.", "Situation d’évaluation 2, consigne 4 • page 12"),
        choice("Quelle présentation mérite tous les points pour une traduction ?", ["Écrire seulement le nom de la protéine", "Donner uniquement le nombre de codons", "Recopier l’ADN sans orientation", "Identifier le brin, orienter, écrire l’ARNm, cadrer, traduire et s’arrêter au stop"], 3, "Cette chaîne d’étapes rend le raisonnement vérifiable."),
      ],
      source: proteinBiosynthesisSource(
        "9-12",
        "Activité d’application et situations d’évaluation sur les hormones, l’albinisme et les substitutions",
        [
          "Les portions d’ocytocine et de vasopressine étiquetées « brin non codant » sont rétablies comme brins codants 5’→3’, seule lecture donnant les nonapeptides annoncés.",
          "La séquence TAC ACG… de l’exercice sur l’albinisme est réorientée comme brin matrice 3’→5’ afin de produire l’ARNm AUG UGC… attendu par les substitutions proposées.",
          "La séquence de l’exercice 2, qui mélange thymine et uracile, est normalisée en ARNm ; la traduction s’arrête au premier UGA.",
          "Les substitutions sont qualifiées : UGC→UGU silencieuse, UGC→UGG faux-sens, TGC→TAC faux-sens et CCG→CCC silencieuse.",
          "Le lien entre une courte séquence et l’albinisme est présenté comme modèle pédagogique, non comme diagnostic clinique complet.",
        ],
      ),
    },
  },
];

export const terminalSvtPaths = courses.map(createSvtPath);
