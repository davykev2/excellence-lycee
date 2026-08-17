import { createSvtPath, type SvtCourseSeed } from "./svtPathFactory";
import { choice, trueFalse, createSvtSource } from "./terminalSvtPathHelpers";

const emotionalSource = createSvtSource("SVT TA_L1_Les réactions émotionnelles chez lHomme.pdf");

const course: SvtCourseSeed = {
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
  };

export const terminalASvtEmotionalReactionsPath = createSvtPath(course);
