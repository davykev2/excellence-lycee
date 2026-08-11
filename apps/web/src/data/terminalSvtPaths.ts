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
    sections: [
      {
        id: "cerebral-areas",
        title: "Localiser les aires cérébrales",
        summary: "Associer lobes frontal, pariétal, temporal et occipital aux fonctions motrices, sensitives, auditives et visuelles.",
        conceptTitle: "Le cortex est organisé en aires spécialisées et associées",
        explanation: "En avant du sillon de Rolando, le lobe frontal contient l’aire motrice et des aires prémotrices. En arrière se trouvent les aires de la sensibilité. Le lobe occipital porte les aires visuelles ; le temporal, les aires auditives. Des aires d’association permettent de reconnaître et de donner du sens aux sensations.",
        keyPoint: "Aire primaire = reçoit ou commande ; aire d’association = interprète et coordonne l’information.",
        example: "Voir un visage mobilise l’aire visuelle ; le reconnaître nécessite aussi l’aire psycho-visuelle.",
        processTitle: "Du lobe à la fonction",
        processInstruction: "Explore les principales régions représentées dans le schéma du cours.",
        process: [
          { label: "Frontal", detail: "Aire motrice, cortex prémoteur, langage articulé et fonctions de préparation." },
          { label: "Pariétal", detail: "Sensibilité générale et intégration de la position du corps dans l’espace." },
          { label: "Temporal", detail: "Audition, compréhension des sons et mémoire avec les structures temporales internes." },
          { label: "Occipital", detail: "Vision primaire et reconnaissance visuelle grâce aux aires associatives." },
        ],
        observation: "Une lésion peut conserver la sensation brute tout en supprimant sa reconnaissance, si l’aire associative est atteinte.",
        check: q("Dans quel lobe se trouve principalement l’aire visuelle ?", "Le lobe occipital", "Le lobe frontal", "Le lobe temporal", "Le cervelet"),
        distractors: ["Toutes les fonctions cérébrales occupent une seule aire.", "L’aire psycho-visuelle commande directement les muscles.", "Le lobe temporal est le centre principal de la vision."],
      },
      {
        id: "movement-preparation",
        title: "Préparer et programmer le mouvement",
        summary: "Relier intention, informations sensorielles, posture et programme moteur avant l’action.",
        conceptTitle: "Un mouvement volontaire est planifié avant d’être exécuté",
        explanation: "Le cerveau utilise les stimuli internes et externes pour définir le but. L’aire motrice supplémentaire organise les actes complexes, le cortex prémoteur prépare la posture et le cortex pariétal postérieur situe l’objet dans l’espace. Les noyaux sous-corticaux et le cervelet participent à la coordination.",
        keyPoint: "Préparer = choisir le but ; programmer = préciser direction, distance, force et posture.",
        example: "Pour saisir un verre, le cerveau évalue sa position et sa distance, prépare l’épaule et la main, puis dose la force des doigts.",
        processTitle: "Avant le mouvement",
        processInstruction: "Observe les décisions successives qui transforment une intention en programme moteur.",
        process: [
          { label: "Intention", detail: "Le sujet fixe un but à partir de ses besoins et des informations du milieu." },
          { label: "Repérage", detail: "Les aires sensitives et pariétales évaluent position, direction et distance." },
          { label: "Programme", detail: "Les aires supplémentaire et prémotrice préparent posture, force et succession des gestes." },
        ],
        observation: "La programmation explique pourquoi un geste volontaire adapté n’est pas un simple réflexe.",
        check: q("Quelle aire participe à la préparation posturale du mouvement ?", "Le cortex prémoteur", "L’aire auditive", "La rétine", "L’hypophyse"),
        distractors: ["La programmation vient après l’exécution.", "Un mouvement volontaire n’utilise aucune information sensorielle.", "Le cortex pariétal ne traite jamais la représentation de l’espace."],
      },
      {
        id: "movement-execution",
        title: "Exécuter et coordonner le mouvement",
        summary: "Suivre le message du cortex moteur à la moelle épinière puis aux muscles effecteurs.",
        conceptTitle: "Le message moteur descend vers les effecteurs",
        explanation: "Après la décision, le cortex moteur émet un message qui descend par les voies motrices vers la moelle épinière, puis les nerfs moteurs l’acheminent aux muscles. Le cervelet compare le mouvement prévu au mouvement réalisé et contribue à sa précision.",
        keyPoint: "Cortex moteur → voies descendantes → moelle épinière → nerfs moteurs → muscles, avec coordination cérébelleuse.",
        example: "Lors d’une prise d’objet, la contraction coordonnée du bras, de l’avant-bras et des doigts réalise le programme préparé.",
        processTitle: "Le trajet de la commande motrice",
        processInstruction: "Suis le message nerveux depuis le centre de décision jusqu’au geste.",
        process: [
          { label: "Décision", detail: "Les centres corticaux valident le programme moteur adapté au but." },
          { label: "Commande", detail: "Le cortex moteur génère les messages nerveux de la voie motrice." },
          { label: "Transmission", detail: "La moelle épinière relaie la commande vers les motoneurones." },
          { label: "Contraction", detail: "Les muscles effecteurs se contractent de façon coordonnée et produisent le mouvement." },
        ],
        observation: "Une atteinte de l’aire motrice ou de la voie descendante peut empêcher le geste malgré des muscles intacts.",
        check: q("Quelle structure relaie la commande vers les nerfs moteurs ?", "La moelle épinière", "La thyroïde", "Le cristallin", "Le pancréas"),
        distractors: ["Le cortex moteur reçoit sa commande des muscles après le geste.", "Le cervelet sécrète les hormones de stress.", "La décision motrice est prise dans le nerf du bras."],
      },
      {
        id: "memory",
        title: "Construire et restituer un souvenir",
        summary: "Distinguer mémoires explicite et implicite, court et long terme, puis les phases du mécanisme mnésique.",
        conceptTitle: "La mémoire possède plusieurs formes et plusieurs étapes",
        explanation: "La mémoire explicite porte sur les souvenirs conscients ; la mémoire implicite permet notamment des habiletés. La mémoire à court terme conserve brièvement une information, tandis que la mémoire à long terme la stabilise. L’hippocampe intervient fortement dans la formation de nouveaux souvenirs explicites et le cortex dans leur stockage distribué.",
        keyPoint: "Acquisition → consolidation et stockage → restitution ; l’hippocampe est essentiel à la formation de nouveaux souvenirs explicites.",
        example: "Le patient H. M. améliorait une tâche motrice sans se rappeler l’avoir déjà réalisée : mémoire implicite préservée, mémoire explicite altérée.",
        processTitle: "Les phases du mécanisme mnésique",
        processInstruction: "Suis le devenir d’une information depuis son entrée jusqu’au rappel.",
        process: [
          { label: "Acquisition", detail: "L’information sensorielle est encodée dans des réseaux neuronaux." },
          { label: "Consolidation", detail: "Des modifications durables stabilisent une partie de l’information." },
          { label: "Stockage", detail: "Le souvenir est maintenu dans des réseaux distribués, notamment corticaux." },
          { label: "Restitution", detail: "Un indice réactive le réseau et permet la remémoration." },
        ],
        observation: "Une lésion de l’hippocampe peut empêcher de créer de nouveaux souvenirs conscients tout en laissant des apprentissages moteurs possibles.",
        check: q("Quelle phase permet de stabiliser une information en mémoire à long terme ?", "La consolidation", "La digestion", "La fécondation", "La transpiration"),
        distractors: ["Il n’existe qu’une seule forme de mémoire.", "L’hippocampe commande directement la contraction des muscles.", "La restitution précède toujours l’acquisition."],
      },
    ],
    mission: {
      title: "Diagnostiquer les troubles après une commotion cérébrale",
      scenario: "Après un choc à la tête, un élève voit des éclairs, ne reconnaît plus ses proches et n’arrive pas à articuler un mot malgré des muscles de la langue non paralysés. Localise les aires probablement perturbées.",
      problem: "Comment relier chaque trouble observé à la fonction d’une aire cérébrale ?",
      investigation: [
        { label: "Voir des éclairs", detail: "Rechercher une perturbation de l’aire visuelle du lobe occipital." },
        { label: "Ne pas reconnaître", detail: "Distinguer perception visuelle et reconnaissance par l’aire psycho-visuelle." },
        { label: "Ne pas articuler", detail: "Relier le trouble à l’aire motrice du langage plutôt qu’aux muscles eux-mêmes." },
        { label: "Conclure", detail: "Montrer la spécialisation et la coopération des aires cérébrales." },
      ],
      modelAnswer: "Les éclairs indiquent une perturbation visuelle, l’impossibilité de reconnaître malgré la vision oriente vers l’aire psycho-visuelle, et l’impossibilité d’articuler avec des muscles intacts vers l’aire motrice du langage.",
      questions: [
        q("Quelle aire associer à l’impossibilité de reconnaître les visages vus ?", "L’aire psycho-visuelle", "L’aire gustative", "La moelle épinière", "L’hypophyse"),
        q("Pourquoi les muscles intacts n’excluent-ils pas un trouble de la parole ?", "La commande corticale du langage peut être atteinte", "Les muscles parlent sans commande nerveuse", "Le langage dépend seulement de l’oreille", "La mémoire remplace l’aire motrice"),
        q("Quelle conclusion générale est justifiée ?", "Des aires spécialisées coopèrent pour produire perception, reconnaissance et action", "Chaque fonction dépend d’un seul muscle", "Toutes les aires ont exactement la même fonction", "Le cortex ne participe pas au comportement"),
      ],
    },
  },
  {
    id: "terminale-svt-l3-origin-of-life",
    chapterNumber: 3,
    themeNumber: 2,
    themeTitle: "Origine et évolution du vivant",
    title: "L’origine de la vie",
    description: "Mobiliser les indices géologiques, paléontologiques et expérimentaux pour reconstruire les grandes étapes possibles de l’apparition de la vie.",
    centralQuestion: "Quels faits permettent d’expliquer scientifiquement l’origine et les premières étapes de la vie ?",
    memorySentence: "Terre primitive → molécules organiques → premières cellules → photosynthèse → oxygénation et diversification.",
    sections: [
      {
        id: "early-earth-evidence",
        title: "Lire les archives de la Terre primitive",
        summary: "Utiliser pechblende, fers rubanés et couches rouges pour reconstituer l’évolution du dioxygène.",
        conceptTitle: "Les roches gardent la trace de l’atmosphère ancienne",
        explanation: "L’uranium peu oxydé et les fers rubanés très anciens témoignent d’une atmosphère d’abord pauvre en dioxygène. L’alternance de dépôts ferreux et oxydés traduit une oxygénation irrégulière. Après environ deux milliards d’années, les couches rouges continentales indiquent une présence plus constante de dioxygène.",
        keyPoint: "Fers rubanés anciens puis couches rouges plus récentes montrent une augmentation progressive du dioxygène atmosphérique.",
        example: "Le dépôt d’oxydes de fer rouges exige du dioxygène : leur apparition durable constitue donc un indice d’oxygénation.",
        processTitle: "Une atmosphère qui se transforme",
        processInstruction: "Replace les indices géologiques dans leur ordre logique.",
        process: [
          { label: "Atmosphère réductrice", shortLabel: "Peu d’O₂", detail: "Les minéraux facilement oxydables peuvent se conserver : le dioxygène libre est rare." },
          { label: "Fers rubanés", detail: "Des périodes d’activité photosynthétique provoquent l’oxydation et le dépôt du fer dans les océans." },
          { label: "Couches rouges", detail: "Une fois les puits d’oxydation saturés, le dioxygène devient plus permanent dans l’atmosphère." },
        ],
        observation: "Une archive géologique ne montre pas directement l’atmosphère ; elle en révèle les propriétés par les réactions chimiques enregistrées.",
        check: q("Que traduit l’apparition abondante des couches rouges continentales ?", "Une présence plus constante de dioxygène atmosphérique", "La disparition de tous les océans", "L’absence totale de fer", "La formation immédiate des mammifères"),
        distractors: ["L’atmosphère primitive contenait autant de dioxygène qu’aujourd’hui.", "Les fers rubanés ne fournissent aucune information chimique.", "Les couches rouges se forment uniquement sans dioxygène."],
      },
      {
        id: "photosynthesis-oxygenation",
        title: "Relier photosynthèse et oxygénation",
        summary: "Expliquer comment les premiers organismes photosynthétiques ont enrichi les océans puis l’atmosphère en dioxygène.",
        conceptTitle: "La vie transforme son propre milieu",
        explanation: "Des procaryotes photosynthétiques ont libéré du dioxygène. Celui-ci a d’abord réagi avec les substances réduites, notamment le fer océanique. Quand ces réactions ont consommé moins de dioxygène qu’il n’en était produit, le gaz s’est accumulé dans l’atmosphère et a permis la formation d’une couche d’ozone protectrice contre les ultraviolets.",
        keyPoint: "La photosynthèse a oxygéné progressivement la planète et la couche d’ozone a favorisé la diversification du vivant.",
        example: "Les stromatolites et les traces de cyanobactéries sont associés à une production ancienne de dioxygène par photosynthèse.",
        processTitle: "De la photosynthèse à l’ozone",
        processInstruction: "Suis le devenir du dioxygène produit par les premiers organismes.",
        process: [
          { label: "Production", detail: "Les microorganismes photosynthétiques libèrent du dioxygène." },
          { label: "Oxydation des océans", shortLabel: "Océans", detail: "Le dioxygène réagit avec le fer dissous et forme des oxydes sédimentaires." },
          { label: "Accumulation atmosphérique", shortLabel: "Atmosphère", detail: "La production dépasse progressivement la consommation chimique." },
          { label: "Couche d’ozone", shortLabel: "Ozone", detail: "Une partie du dioxygène forme l’ozone qui filtre une partie des UV." },
        ],
        observation: "L’apparition de la vie et l’évolution de l’atmosphère s’influencent mutuellement.",
        check: q("Quelle activité biologique a fortement contribué à l’oxygénation ?", "La photosynthèse", "La fermentation alcoolique seule", "La digestion", "La mitose sans métabolisme"),
        distractors: ["L’ozone s’est formé avant toute présence de dioxygène.", "Le dioxygène n’a jamais réagi avec le fer océanique.", "La photosynthèse consomme le dioxygène pour produire du dioxyde de carbone."],
      },
      {
        id: "extreme-environments",
        title: "Interpréter la vie en milieu extrême",
        summary: "Utiliser les microorganismes thermophiles comme modèles possibles des conditions de la Terre primitive.",
        conceptTitle: "Des êtres vivants supportent des conditions réputées hostiles",
        explanation: "Des microorganismes vivent dans des eaux très chaudes, acides ou riches en sulfures, comme celles des geysers et des sources hydrothermales. Ils ne sont pas forcément identiques aux premiers êtres vivants, mais démontrent que la vie peut fonctionner dans des conditions comparables à certains milieux primitifs.",
        keyPoint: "Les extrêmophiles rendent plausible une origine dans des milieux chauds et chimiquement riches, sans constituer à eux seuls une preuve définitive.",
        example: "Des microorganismes proches de certains procaryotes vivent près des fumeurs hydrothermaux, malgré une température et une chimie extrêmes.",
        processTitle: "Du milieu actuel à l’hypothèse ancienne",
        processInstruction: "Distingue observation actuelle, comparaison et conclusion prudente.",
        process: [
          { label: "Observer", detail: "Des microorganismes actuels vivent à température élevée, en milieu acide ou riche en sulfures." },
          { label: "Comparer", detail: "Ces milieux possèdent certains caractères supposés de l’océan primitif." },
          { label: "Inférer", detail: "La vie a pu apparaître dans un environnement que nous jugeons aujourd’hui hostile." },
        ],
        observation: "Une analogie soutient une hypothèse, mais elle ne reconstitue pas directement l’événement ancien.",
        check: q("Que montre principalement l’existence d’extrêmophiles actuels ?", "Que la vie peut fonctionner dans des milieux très contraignants", "Que tous les premiers êtres vivants étaient des animaux", "Que l’océan primitif était froid et riche en oxygène", "Que toute évolution s’est arrêtée"),
        distractors: ["Un extrêmophile actuel est nécessairement le premier être vivant.", "Aucune cellule ne peut vivre près d’une source hydrothermale.", "Les milieux extrêmes prouvent que l’atmosphère primitive était identique à l’actuelle."],
      },
      {
        id: "experimental-origin",
        title: "Comprendre les faits expérimentaux",
        summary: "Relier l’hypothèse de la soupe primitive, l’expérience de Miller-Urey et la formation de molécules organiques.",
        conceptTitle: "Des molécules du vivant peuvent se former sans cellule préexistante",
        explanation: "Oparin et Haldane ont proposé qu’une chimie prébiotique ait produit une « soupe primitive ». Miller et Urey ont soumis un mélange de gaz et d’eau à des décharges électriques et obtenu des acides aminés. Ces expériences montrent une synthèse abiotique possible, mais elles ne créent pas une cellule vivante et ne reconstituent qu’un scénario parmi d’autres.",
        keyPoint: "Les expériences prébiotiques expliquent la formation possible de briques organiques, pas encore le passage complet à une cellule capable de se reproduire.",
        example: "Obtenir glycine et alanine à partir de molécules simples prouve une étape chimique possible, mais pas l’apparition immédiate de la vie.",
        processTitle: "De la matière minérale aux premières cellules",
        processInstruction: "Suis les étapes du scénario sans confondre molécule organique et être vivant.",
        process: [
          { label: "Molécules simples", detail: "Eau, dioxyde de carbone, azote et autres composés sont soumis à des sources d’énergie." },
          { label: "Molécules organiques", detail: "Des acides aminés et d’autres briques peuvent se former et s’accumuler." },
          { label: "Macromolécules et compartiments", shortLabel: "Assemblage", detail: "Polymérisation et membranes primitives constituent des étapes hypothétiques supplémentaires." },
          { label: "Premières cellules", detail: "Il faut encore acquérir métabolisme, autorégulation, information héréditaire et reproduction." },
        ],
        observation: "Une expérience valide la possibilité d’une étape ; elle ne démontre pas nécessairement tout le scénario historique.",
        check: q("Qu’a montré l’expérience de Miller-Urey ?", "La formation possible de molécules organiques dans des conditions simulées", "La création complète d’un humain", "L’impossibilité de toute chimie prébiotique", "La présence d’oxygène abondant dans l’atmosphère primitive"),
        distractors: ["Un acide aminé isolé est déjà une cellule vivante.", "Les expériences prébiotiques ont reconstitué avec certitude toute l’histoire de la vie.", "Les molécules organiques ne peuvent provenir que d’un organisme vivant."],
      },
    ],
    mission: {
      title: "Évaluer un scénario scientifique sur l’origine de la vie",
      scenario: "Un document associe fers rubanés, cyanobactéries, atmosphère qui s’oxygène et expérience de Miller-Urey. Construis une explication qui distingue les indices historiques des simulations expérimentales.",
      problem: "Comment plusieurs types de preuves se complètent-ils sans fournir une certitude absolue sur chaque étape ?",
      investigation: [
        { label: "Archives", detail: "Les roches indiquent l’état chimique de l’océan et de l’atmosphère anciens." },
        { label: "Action du vivant", detail: "La photosynthèse explique l’augmentation progressive du dioxygène." },
        { label: "Expérience", detail: "La synthèse abiotique montre que des briques organiques peuvent apparaître sans cellule." },
        { label: "Limite", detail: "Le passage exact des molécules aux premières cellules reste reconstruit par hypothèses testables." },
      ],
      modelAnswer: "Les roches et fossiles apportent des traces historiques, tandis que les expériences testent la possibilité de réactions prébiotiques. Ensemble, ils construisent un scénario cohérent mais encore incomplet du passage de la matière minérale aux premières cellules.",
      questions: [
        q("Quel indice traduit une oxygénation ancienne irrégulière ?", "Les fers rubanés", "Les chromosomes sexuels", "Les nerfs moteurs", "Les groupes sanguins"),
        q("Quelle conséquence suit l’accumulation de dioxygène atmosphérique ?", "La formation d’une couche d’ozone protectrice", "La disparition de toute molécule organique", "L’arrêt de la photosynthèse", "La suppression des océans"),
        q("Quelle conclusion respecte les limites des expériences prébiotiques ?", "Elles rendent certaines étapes chimiques possibles sans recréer toute l’origine de la vie", "Elles ont produit avec certitude la première cellule historique", "Elles prouvent que les roches sont inutiles", "Elles montrent que la vie ne nécessite aucune organisation"),
      ],
    },
  },
  {
    id: "terminale-svt-l4-human-lineage",
    chapterNumber: 4,
    themeNumber: 2,
    themeTitle: "Origine et évolution du vivant",
    title: "L’évolution de la lignée humaine",
    description: "Comparer caractères anatomiques, séquences moléculaires et théories pour expliquer la parenté et l’évolution de la lignée humaine.",
    centralQuestion: "Quels caractères et quels mécanismes expliquent l’évolution de la lignée humaine ?",
    memorySentence: "Transformations du crâne et de la stature + parentés moléculaires + mutations triées par la sélection au cours du temps.",
    sections: [
      {
        id: "cranial-transformations",
        title: "Comparer le crâne et le cerveau",
        summary: "Suivre l’augmentation de la capacité crânienne, des circonvolutions et de la vascularisation.",
        conceptTitle: "La boîte crânienne se transforme au cours de la lignée humaine",
        explanation: "Des australopithèques à Homo sapiens, les documents du cours montrent une modification de la forme du crâne, une augmentation globale du volume cérébral, davantage de circonvolutions et une vascularisation plus ramifiée. Ces tendances ne signifient pas une marche linéaire de toutes les espèces vers l’Homme actuel.",
        keyPoint: "L’évolution humaine est buissonnante, mais plusieurs fossiles montrent une augmentation globale du volume cérébral et une transformation du crâne.",
        example: "La comparaison des moulages endocrâniens permet d’observer volume, reliefs cérébraux et traces de vascularisation sans disposer du cerveau fossilisé.",
        processTitle: "Lire une série de crânes fossiles",
        processInstruction: "Observe les caractères pertinents sans classer les individus sur une simple échelle de valeur.",
        process: [
          { label: "Forme du crâne", shortLabel: "Crâne", detail: "La face, le front et la boîte crânienne présentent des modifications au fil des fossiles étudiés." },
          { label: "Volume cérébral", shortLabel: "Volume", detail: "La capacité crânienne augmente globalement dans plusieurs branches du genre Homo." },
          { label: "Organisation", detail: "Circonvolutions et vascularisation deviennent plus complexes dans les documents comparés." },
        ],
        observation: "Le volume cérébral est un indice parmi d’autres ; l’intelligence ne se réduit pas à une mesure unique.",
        check: q("Quel caractère augmente globalement dans les documents allant des australopithèques à Homo sapiens ?", "Le volume de la boîte crânienne", "Le nombre de chromosomes", "La longueur de tous les bras", "Le nombre de groupes sanguins"),
        distractors: ["Toutes les espèces fossiles forment une seule ligne sans branchement.", "L’évolution humaine se résume au poids du cerveau.", "Les fossiles ne permettent aucune comparaison morphologique."],
      },
      {
        id: "bipedal-stature",
        title: "Reconnaître les caractères de la bipédie",
        summary: "Relier colonne vertébrale, bassin, membres inférieurs et pied à une marche bipède efficace.",
        conceptTitle: "La stature humaine porte les marques de la bipédie",
        explanation: "La colonne vertébrale humaine présente plusieurs courbures qui équilibrent le tronc. Le bassin est court et large, les membres inférieurs sont longs, le gros orteil est aligné avec les autres et la voûte plantaire est développée. Ces caractères diffèrent de ceux des grands singes adaptés aussi à la grimpe.",
        keyPoint: "Colonne à plusieurs courbures, bassin court et large, membres inférieurs longs et pied voûté favorisent la bipédie permanente.",
        example: "Un gros orteil aligné et une voûte plantaire développée transforment le pied en appui et levier pendant la marche.",
        processTitle: "Du squelette à la fonction",
        processInstruction: "Relie chaque transformation à son avantage biomécanique.",
        process: [
          { label: "Colonne", detail: "Ses courbures répartissent les charges et maintiennent le centre de gravité." },
          { label: "Bassin", detail: "Court et large, il soutient les organes et stabilise le tronc en appui sur une jambe." },
          { label: "Membres inférieurs", shortLabel: "Jambes", detail: "Leur allongement améliore la longueur du pas et l’efficacité de la marche." },
          { label: "Pied", detail: "Orteils alignés et voûte plantaire assurent propulsion et amortissement." },
        ],
        observation: "Un caractère anatomique prend son sens lorsqu’on le relie à une fonction et à l’ensemble du squelette.",
        check: q("Quel caractère du bassin humain favorise la bipédie ?", "Il est court et large", "Il est absent", "Il est très étroit et allongé", "Il porte un pouce opposable"),
        distractors: ["Le pied humain possède un gros orteil fortement opposable pour saisir les branches.", "La bipédie dépend uniquement de la taille du cerveau.", "La colonne humaine ne présente aucune courbure."],
      },
      {
        id: "molecular-parentage",
        title: "Mesurer la parenté moléculaire",
        summary: "Comparer des séquences d’acides aminés pour estimer la proximité entre espèces.",
        conceptTitle: "Les ressemblances moléculaires témoignent d’ancêtres communs",
        explanation: "Une séquence protéique accumule des différences au cours du temps. Dans le document, les 19 premiers acides aminés de la chaîne bêta de l’hémoglobine sont identiques chez l’Homme et le gorille, diffèrent par deux positions avec le porc et quatre avec le cheval. Moins il y a de différences homologues, plus la parenté est proche.",
        keyPoint: "Pour une même molécule homologue, peu de différences de séquence indiquent généralement une parenté évolutive plus proche.",
        example: "0 différence Homme-gorille, 2 avec le porc, 4 avec le cheval : le gorille est le plus proche parmi les espèces comparées, sans être l’ancêtre direct de l’Homme.",
        processTitle: "Comparer les séquences",
        processInstruction: "Passe de l’alignement des acides aminés à l’arbre de parenté.",
        process: [
          { label: "Aligner", detail: "Comparer la même protéine et les mêmes positions chez toutes les espèces." },
          { label: "Compter", detail: "Relever le nombre de substitutions d’acides aminés." },
          { label: "Classer", detail: "Le plus petit nombre de différences indique l’ancêtre commun le plus récent parmi les comparaisons." },
          { label: "Nuancer", detail: "Une espèce actuelle proche n’est pas l’ancêtre direct d’une autre espèce actuelle." },
        ],
        observation: "La parenté moléculaire complète les caractères anatomiques et les fossiles.",
        check: q("Dans le document du cours, quelle espèce a la séquence la plus proche de celle de l’Homme ?", "Le gorille", "Le cheval", "Le porc", "Aucune"),
        distractors: ["Le gorille actuel est l’ancêtre direct de l’Homme actuel.", "Plus les séquences diffèrent, plus la parenté est proche.", "On peut comparer n’importe quelles protéines sans vérifier leur homologie."],
      },
      {
        id: "evolution-theories",
        title: "Comparer les théories de l’évolution",
        summary: "Distinguer Lamarck, Darwin, mutationnisme et théorie synthétique de l’évolution.",
        conceptTitle: "La théorie synthétique articule variation, sélection et temps",
        explanation: "Lamarck expliquait l’évolution par l’usage et la transmission de caractères acquis. Darwin a proposé la sélection naturelle agissant sur des variations héréditaires. La génétique a révélé mutations et recombinaisons ; la théorie synthétique décrit l’évolution comme un changement de fréquences alléliques sous l’effet de plusieurs forces, dont la sélection, dans les populations au cours du temps.",
        keyPoint: "Variations héréditaires produites notamment par mutations et recombinaisons + sélection et autres forces + temps = évolution des populations.",
        example: "Une mutation avantageuse dans un milieu peut devenir plus fréquente parce que ses porteurs la transmettent davantage, et non parce qu’ils en ont eu besoin.",
        processTitle: "Une explication qui s’enrichit",
        processInstruction: "Compare l’idée centrale et la limite de chaque proposition historique.",
        process: [
          { label: "Lamarck", detail: "L’usage modifierait les organes et les caractères acquis seraient transmis ; ce mécanisme général n’est pas retenu par la génétique moderne." },
          { label: "Darwin", detail: "La sélection naturelle favorise les variations héréditaires qui améliorent le succès reproducteur." },
          { label: "Génétique", detail: "Mutations et recombinaisons produisent de la diversité héréditaire." },
          { label: "Synthèse moderne", detail: "L’évolution correspond aux changements génétiques des populations sous plusieurs forces au cours du temps." },
        ],
        observation: "La sélection naturelle ne crée pas les mutations dont un organisme aurait besoin ; elle trie des variations déjà présentes.",
        check: q("Sur quoi agit la sélection naturelle ?", "Sur des variations héréditaires présentes dans une population", "Sur les besoins conscients des individus", "Sur des caractères acquis par exercice uniquement", "Sur aucune variation"),
        distractors: ["Une mutation apparaît parce que l’organisme en a besoin.", "L’évolution transforme tous les individus de la même façon en une génération.", "La théorie synthétique exclut les données génétiques."],
      },
    ],
    mission: {
      title: "Exploiter des crânes et des séquences pour établir une parenté",
      scenario: "Une diapositive compare plusieurs crânes de la lignée humaine et des séquences d’hémoglobine chez quatre mammifères. Décris les transformations et construis une conclusion prudente sur la parenté.",
      problem: "Comment combiner données anatomiques et moléculaires sans confondre ressemblance, parenté et ancêtre direct ?",
      investigation: [
        { label: "Décrire les crânes", detail: "Relever forme, volume, circonvolutions et vascularisation sans interprétation immédiate." },
        { label: "Relier à la bipédie", detail: "Mobiliser bassin, colonne, membres inférieurs et pied." },
        { label: "Comparer les séquences", detail: "Compter les différences sur une protéine homologue." },
        { label: "Conclure", detail: "Proposer des liens de parenté et rappeler que l’évolution est buissonnante." },
      ],
      modelAnswer: "Les fossiles révèlent des transformations anatomiques, tandis que les séquences mesurent des proximités moléculaires. Leur convergence soutient l’existence d’ancêtres communs et une évolution buissonnante de la lignée humaine.",
      questions: [
        q("Quel caractère est directement lié à la bipédie permanente ?", "Un bassin court et large", "Un gros orteil opposable", "Une colonne à une seule courbure", "Des membres inférieurs très courts"),
        q("Que signifie une séquence identique dans la portion comparée ?", "Une forte proximité moléculaire pour cette molécule", "Une identité complète des deux espèces", "L’absence d’ancêtre commun", "Une preuve d’ancêtre direct"),
        q("Quelle formulation est scientifiquement correcte ?", "L’Homme et les grands singes actuels partagent des ancêtres communs", "L’Homme descend du gorille actuel", "Toutes les espèces évoluent vers l’Homme", "La sélection crée volontairement les mutations utiles"),
      ],
    },
  },
  {
    id: "terminale-svt-l5-sex-blood-heredity",
    chapterNumber: 5,
    themeNumber: 3,
    themeTitle: "Génétique humaine",
    title: "L’hérédité du sexe et du groupe sanguin chez l’Homme",
    description: "Utiliser les allèles du système ABO et les chromosomes X et Y pour prévoir des phénotypes sans confondre probabilité et certitude.",
    centralQuestion: "Comment les allèles et les chromosomes sexuels déterminent-ils groupe sanguin et sexe chromosomique ?",
    memorySentence: "ABO : IA et IB codominants, i récessif ; sexe chromosomique : ovule X + spermatozoïde X ou Y.",
    sections: [
      {
        id: "abo-alleles",
        title: "Comprendre le système ABO",
        summary: "Distinguer les allèles IA, IB et i, leur dominance et les antigènes portés par les globules rouges.",
        conceptTitle: "Un gène autosomal possède trois allèles dans la population",
        explanation: "Le système ABO dépend de trois allèles : IA produit l’antigène A, IB l’antigène B et i ne produit ni A ni B. IA et IB s’expriment ensemble : ils sont codominants. L’allèle i est récessif face à chacun d’eux.",
        keyPoint: "IA et IB sont codominants ; i est récessif : quatre phénotypes résultent de six génotypes possibles.",
        example: "IAIB donne le groupe AB ; IAi donne A ; IBi donne B ; ii donne O.",
        processTitle: "Du génotype au groupe sanguin",
        processInstruction: "Associe chaque combinaison d’allèles à son phénotype.",
        process: [
          { label: "Groupe A", detail: "Génotype IAIA ou IAi ; antigène A sur les globules rouges." },
          { label: "Groupe B", detail: "Génotype IBIB ou IBi ; antigène B." },
          { label: "Groupe AB", detail: "Génotype IAIB ; antigènes A et B exprimés ensemble." },
          { label: "Groupe O", detail: "Génotype ii ; absence d’antigènes A et B." },
        ],
        observation: "Un même phénotype A ou B peut cacher deux génotypes différents.",
        check: q("Quel génotype correspond obligatoirement au groupe O ?", "ii", "IAIB", "IAIA", "IBIB"),
        distractors: ["IA domine toujours IB.", "Le groupe AB correspond au génotype ii.", "Le système ABO est porté par les chromosomes sexuels."],
      },
      {
        id: "abo-crosses",
        title: "Résoudre un croisement ABO",
        summary: "Déduire les génotypes possibles des parents puis calculer les groupes possibles chez les enfants.",
        conceptTitle: "Un phénotype parental ne suffit pas toujours à connaître le génotype",
        explanation: "Avant de construire l’échiquier, il faut lister les génotypes compatibles avec chaque groupe. La présence d’un enfant O impose que chacun des deux parents ait transmis i. Ainsi, des parents de groupes A et B ayant un enfant O sont nécessairement IAi et IBi.",
        keyPoint: "Phénotype → génotypes possibles → gamètes → échiquier → probabilités des enfants.",
        example: "IAi × IBi peut donner IAIB (AB), IAi (A), IBi (B) ou ii (O), chacun avec une probabilité de 1/4.",
        processTitle: "Construire l’échiquier",
        processInstruction: "Suis les étapes sans choisir arbitrairement le génotype parental.",
        process: [
          { label: "Génotypes possibles", shortLabel: "Génotypes", detail: "Traduire chaque phénotype parental en une ou deux combinaisons d’allèles." },
          { label: "Indices familiaux", shortLabel: "Indices", detail: "Utiliser les groupes des enfants pour éliminer les génotypes impossibles." },
          { label: "Gamètes", detail: "Chaque gamète reçoit un seul allèle du gène ABO." },
          { label: "Descendance", detail: "Combiner les gamètes puis convertir génotypes en phénotypes." },
        ],
        observation: "Les probabilités s’appliquent à chaque grossesse indépendamment ; elles ne garantissent pas une répartition exacte dans une petite famille.",
        check: q("Deux parents A et B ont un enfant O. Quels génotypes doivent-ils porter ?", "IAi et IBi", "IAIA et IBIB", "IAIB et ii", "ii et ii"),
        distractors: ["Le groupe sanguin suffit toujours à connaître un génotype unique.", "Deux parents A et B ne peuvent jamais avoir d’enfant O.", "Une probabilité de 25 % impose exactement un enfant sur quatre dans toute famille."],
      },
      {
        id: "sex-chromosomes",
        title: "Former les gamètes X et Y",
        summary: "Relier méiose, chromosomes XX ou XY et types de gamètes produits.",
        conceptTitle: "La méiose sépare les chromosomes sexuels",
        explanation: "Dans le modèle chromosomique étudié, une femme XX produit des ovules qui portent tous un chromosome X. Un homme XY produit deux catégories de spermatozoïdes en proportions approximativement égales : les uns portent X, les autres Y.",
        keyPoint: "Ovules : X ; spermatozoïdes : X ou Y ; la méiose explique les deux catégories de gamètes mâles.",
        example: "Un spermatozoïde X fécondant un ovule X donne XX ; un spermatozoïde Y fécondant ce même type d’ovule donne XY.",
        processTitle: "Des cellules parentales aux gamètes",
        processInstruction: "Observe la séparation des chromosomes pendant la formation des gamètes.",
        process: [
          { label: "Cellule XX", detail: "Les deux chromosomes sexuels sont X." },
          { label: "Ovules", detail: "Après méiose, chaque ovule reçoit un chromosome X." },
          { label: "Cellule XY", detail: "Les deux chromosomes sexuels sont différents." },
          { label: "Spermatozoïdes", detail: "Après méiose, une catégorie porte X et l’autre Y." },
        ],
        observation: "La séparation aléatoire des chromosomes produit une probabilité, pas un choix volontaire du parent.",
        check: q("Quels types de spermatozoïdes sont produits pour les chromosomes sexuels ?", "Des spermatozoïdes X et des spermatozoïdes Y", "Uniquement des spermatozoïdes X", "Uniquement des spermatozoïdes Y", "Des spermatozoïdes XX"),
        distractors: ["L’ovule porte normalement un chromosome Y.", "La femme XX produit des ovules X ou Y.", "Le sexe chromosomique est choisi consciemment avant la méiose."],
      },
      {
        id: "sex-cross",
        title: "Interpréter l’échiquier XX-XY",
        summary: "Calculer les probabilités XX et XY et expliquer le rôle du spermatozoïde fécondant.",
        conceptTitle: "La fécondation associe au hasard un ovule X et un spermatozoïde X ou Y",
        explanation: "Comme tous les ovules portent X, le chromosome sexuel variable vient du spermatozoïde. L’échiquier donne environ 1/2 XX et 1/2 XY à chaque fécondation. Dire que le spermatozoïde détermine le sexe chromosomique ne signifie ni faute, ni mérite, ni contrôle du père.",
        keyPoint: "X ovulaire + X spermatique = XX ; X ovulaire + Y spermatique = XY, avec environ 50 % pour chaque possibilité.",
        example: "Après trois filles, la probabilité XX ou XY pour une nouvelle fécondation reste proche de 1/2 dans le modèle simple.",
        processTitle: "Rencontre aléatoire des gamètes",
        processInstruction: "Construis mentalement les deux rencontres possibles.",
        process: [
          { label: "Ovule X + spermatozoïde X", shortLabel: "X + X", detail: "Le zygote possède la combinaison XX." },
          { label: "Ovule X + spermatozoïde Y", shortLabel: "X + Y", detail: "Le zygote possède la combinaison XY." },
          { label: "Bilan", detail: "Dans l’échiquier théorique, les deux possibilités ont la même probabilité." },
        ],
        observation: "Les naissances précédentes ne modifient pas la probabilité chromosomique de la fécondation suivante.",
        check: q("Quel gamète apporte le chromosome qui différencie XX de XY ?", "Le spermatozoïde", "L’ovule", "Le globule rouge", "Le neurone"),
        distractors: ["Le père décide volontairement du chromosome porté par un spermatozoïde.", "Après deux filles, un garçon devient certain.", "Une fécondation XX nécessite un ovule Y."],
      },
    ],
    mission: {
      title: "Expliquer les groupes sanguins d’une famille et le sexe chromosomique",
      scenario: "Une mère de groupe A et un père de groupe B ont des enfants de groupes AB, B et O. Une autre question porte sur l’échiquier XX-XY. Utilise les deux modèles sans les confondre.",
      problem: "Comment deux échiquiers de croisement expliquent-ils des phénotypes différents avec des probabilités ?",
      investigation: [
        { label: "ABO", detail: "L’enfant O révèle l’allèle i chez chacun des parents : IAi × IBi." },
        { label: "Gamètes ABO", detail: "La mère produit IA ou i ; le père IB ou i." },
        { label: "Chromosomes sexuels", detail: "Les ovules portent X ; les spermatozoïdes portent X ou Y." },
        { label: "Probabilités", detail: "Chaque échiquier donne des possibilités pour une fécondation, pas un ordre obligatoire des naissances." },
      ],
      modelAnswer: "Le croisement IAi × IBi explique les quatre groupes possibles. Pour le sexe chromosomique, l’ovule apporte X et le spermatozoïde X ou Y, ce qui donne environ autant de combinaisons XX que XY.",
      questions: [
        q("Pourquoi l’enfant O est-il un indice décisif ?", "Il a reçu i de chacun des deux parents", "Il a reçu IA et IB", "Son groupe impose un chromosome Y", "Il prouve que les parents sont tous les deux O"),
        q("Quel groupe est associé au génotype IAIB ?", "AB", "O", "A uniquement", "B uniquement"),
        q("Quel bilan de l’échiquier XX-XY est correct ?", "Environ 50 % XX et 50 % XY à chaque fécondation", "100 % XX après une première fille", "L’ovule décide entre X et Y", "Le résultat est choisi par les parents"),
      ],
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
    sections: [
      {
        id: "pedigree-method",
        title: "Lire un arbre généalogique",
        summary: "Repérer générations, sexe, personnes atteintes et transmissions avant de proposer un modèle génétique.",
        conceptTitle: "Le pedigree permet de tester des hypothèses de transmission",
        explanation: "Un arbre généalogique organise les individus par génération et indique leur sexe et leur phénotype. Une maladie qui apparaît chez un enfant de parents sains peut être récessive. Une différence nette entre les sexes peut orienter vers une liaison au chromosome X, mais l’hypothèse doit être vérifiée sur tous les croisements disponibles.",
        keyPoint: "Observer le pedigree → proposer autosomal ou lié au sexe, dominant ou récessif → vérifier chaque branche.",
        example: "Des parents non atteints ayant un fils atteint sont compatibles avec une mère conductrice d’un allèle récessif lié à X, mais il faut vérifier le reste de la famille.",
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
      },
      {
        id: "sickle-cell",
        title: "Prévoir la drépanocytose",
        summary: "Relier électrophorèse, allèles HbA et HbS et probabilités d’un croisement entre deux hétérozygotes.",
        conceptTitle: "La drépanocytose étudiée est une transmission autosomale",
        explanation: "L’électrophorèse distingue les hémoglobines A et S. Les deux allèles sont détectables chez l’hétérozygote HbA/HbS : ils sont codominants au niveau moléculaire. Deux parents HbA/HbS peuvent produire HbA/HbA, HbA/HbS ou HbS/HbS ; la forme grave correspond dans le modèle scolaire à HbS/HbS.",
        keyPoint: "HbA/HbS × HbA/HbS donne 1/4 HbA/HbA, 1/2 HbA/HbS et 1/4 HbS/HbS à chaque grossesse.",
        example: "Des parents apparemment en bonne santé peuvent chacun transmettre HbS et avoir un enfant HbS/HbS.",
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
      },
      {
        id: "hemophilia-x-linked",
        title: "Prévoir l’hémophilie liée à l’X",
        summary: "Expliquer une transmission récessive liée à l’X en écrivant correctement les génotypes féminins et masculins.",
        conceptTitle: "Chez un garçon, l’allèle porté par l’unique chromosome X s’exprime",
        explanation: "Dans le modèle du cours, l’allèle normal H domine l’allèle h de l’hémophilie et le gène est porté par X. Une femme XH Xh peut être conductrice sans être atteinte ; un garçon XhY est atteint car il ne possède pas un second allèle sur Y pour masquer h.",
        keyPoint: "Mère XH Xh × père XH Y : 1/2 des fils reçoivent Xh ; les filles reçoivent nécessairement XH du père dans ce croisement.",
        example: "Le père transmet son chromosome Y à ses fils : un fils ne reçoit donc jamais l’X paternel dans le modèle XX-XY.",
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
      },
      {
        id: "screening-counseling",
        title: "Conseiller et dépister de façon responsable",
        summary: "Distinguer consultation génétique, dépistage parental et examens prénataux, avec leurs rôles et leurs limites.",
        conceptTitle: "Prévoir signifie informer, pas décider à la place de la famille",
        explanation: "La consultation et le conseil génétiques reconstituent l’histoire familiale, proposent des tests et calculent un risque. L’électrophorèse peut rechercher des variants d’hémoglobine. Pendant la grossesse, l’échographie observe sans prélèvement ; la biopsie de villosités choriales et l’amniocentèse permettent des analyses fœtales mais sont des actes médicaux invasifs encadrés.",
        keyPoint: "Le conseil génétique fournit une information fiable, explique bénéfices et risques des examens et respecte le choix éclairé des parents.",
        example: "Un risque de 25 % ne prédit pas le résultat d’une grossesse précise ; il aide le couple à comprendre les possibilités et les options médicales.",
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
      },
    ],
    mission: {
      title: "Conseiller un couple après des examens d’hémoglobine",
      scenario: "Deux parents ont chacun les hémoglobines A et S. Pendant la grossesse, on leur parle d’échographie, de biopsie des villosités choriales et d’amniocentèse. Explique la maladie recherchée, le risque et le rôle des examens.",
      problem: "Comment communiquer un risque de drépanocytose sans le présenter comme une certitude ni supprimer le choix des parents ?",
      investigation: [
        { label: "Identifier", detail: "Les profils HbA/HbS orientent vers la drépanocytose et un statut hétérozygote parental." },
        { label: "Calculer", detail: "Le croisement donne 1/4 AA, 1/2 AS et 1/4 SS à chaque grossesse." },
        { label: "Distinguer", detail: "Échographie, biopsie de villosités choriales et amniocentèse n’apportent pas la même information ni les mêmes risques." },
        { label: "Informer", detail: "Le professionnel explique les résultats et accompagne une décision libre et éclairée." },
      ],
      modelAnswer: "Les parents HbA/HbS ont, à chaque grossesse, un risque de 25 % d’enfant HbS/HbS. Les examens parentaux établissent les génotypes ; un diagnostic prénatal ciblé peut renseigner le génotype fœtal, sous indication et avec consentement éclairé.",
      questions: [
        q("Quelle maladie recherche un examen des hémoglobines A et S ?", "La drépanocytose", "Le paludisme", "La myopie", "L’appendicite"),
        q("Comment qualifier 25 % dans ce croisement ?", "Une probabilité indépendante pour chaque grossesse", "Une certitude pour le quatrième enfant", "La moitié de tous les enfants", "Un résultat déterminé par l’ordre des naissances"),
        q("Quelle attitude respecte l’éthique du conseil génétique ?", "Expliquer les bénéfices, limites et risques puis respecter le choix éclairé", "Cacher l’incertitude", "Imposer un examen invasif", "Promettre un résultat garanti"),
      ],
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
    sections: [
      {
        id: "molecular-actors",
        title: "Identifier les acteurs",
        summary: "Distinguer ADN, ARNm, ARNt, ARNr, ribosome et acides aminés par leur rôle.",
        conceptTitle: "Chaque acteur transporte une partie de l’information ou réalise une étape",
        explanation: "L’ADN bicaténaire conserve l’information dans le noyau. L’ARNm en porte une copie vers le cytoplasme. L’ARNt associe un anticodon à un acide aminé. L’ARNr, avec des protéines, constitue le ribosome, machine qui lit l’ARNm et assemble les acides aminés.",
        keyPoint: "ADN = information ; ARNm = message ; ARNt = adaptateur ; ribosome = lecture et assemblage ; acides aminés = unités de la protéine.",
        example: "Un ARNt portant l’anticodon complémentaire du codon AUG apporte la méthionine au début de la traduction.",
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
        processTitle: "Les trois phases de la traduction",
        processInstruction: "Observe comment le ribosome avance sur l’ARNm dans le sens 5’ vers 3’.",
        process: [
          { label: "Initiation", detail: "Assemblage du ribosome et reconnaissance du codon AUG par l’ARNt initiateur." },
          { label: "Élongation", detail: "Entrée d’un ARNt complémentaire, liaison peptidique puis translocation du ribosome." },
          { label: "Terminaison", detail: "Un codon stop recrute un facteur de libération et la chaîne polypeptidique est libérée." },
        ],
        observation: "La complémentarité codon-anticodon garantit l’ordre des acides aminés, tandis que le code génétique donne leur identité.",
        check: q("Que se passe-t-il lorsqu’un codon stop entre dans le site de lecture ?", "La chaîne polypeptidique est libérée et le ribosome se dissocie", "Un nouvel acide aminé stop est ajouté", "L’ADN quitte le noyau", "La transcription recommence"),
        distractors: ["La traduction se déroule dans le noyau sur l’ADN.", "Le ribosome lit l’ARNm dans les deux sens simultanément.", "Un codon stop code un acide aminé nommé stop."],
      },
    ],
    mission: {
      title: "Comparer deux hormones à partir de leurs séquences d’ADN",
      scenario: "Un groupe compare des portions de gènes de l’ocytocine et de la vasopressine. Il doit construire l’ARNm, utiliser le code génétique et expliquer pourquoi quelques changements de nucléotides modifient certains acides aminés.",
      problem: "Comment passer rigoureusement d’un brin d’ADN à une chaîne polypeptidique et comparer deux protéines ?",
      investigation: [
        { label: "Orienter", detail: "Identifier le brin fourni et écrire clairement ses extrémités 5’ et 3’." },
        { label: "Transcrire", detail: "Construire l’ARNm par complémentarité avec le brin matrice ou par remplacement T → U depuis le brin codant." },
        { label: "Découper", detail: "Repérer AUG puis séparer l’ARNm en codons dans le bon cadre de lecture." },
        { label: "Traduire et comparer", shortLabel: "Comparer", detail: "Associer chaque codon à un acide aminé, s’arrêter au codon stop puis relever les substitutions." },
      ],
      modelAnswer: "L’ARN polymérase produit un ARNm complémentaire du brin matrice. Le ribosome le lit par codons ; les ARNt apportent les acides aminés correspondants. Des différences de nucléotides peuvent donc changer certains codons et la séquence de la protéine.",
      questions: [
        q("Quel est l’ARNm du brin matrice 3’-TAC CCG ATT-5’ ?", "5’-AUG GGC UAA-3’", "3’-AUG GGC UAA-5’", "5’-TAC CCG ATT-3’", "5’-UAC CCG AUU-3’"),
        q("Quelle chaîne correspond à AUG GGC UAA ?", "Méthionine – glycine, puis arrêt", "Tyrosine – proline – leucine", "Méthionine – glycine – stop comme acide aminé", "Aucune traduction possible"),
        q("Pourquoi une substitution d’ADN peut-elle ne pas changer la protéine ?", "Plusieurs codons peuvent coder le même acide aminé", "Tous les codons ont exactement la même signification", "Le ribosome ignore toujours les mutations", "L’ADN ne détermine pas l’ARNm"),
      ],
    },
  },
];

export const terminalSvtPaths = courses.map(createSvtPath);
