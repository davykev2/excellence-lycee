import { createSvtPath, type SvtCourseSeed } from "./svtPathFactory";
import { q, choice, trueFalse, createSvtSource } from "./terminalSvtPathHelpers";

const humanLineageSource = createSvtSource("SVT TA_L4_Lévolution de la lignée humaine.pdf");

const course: SvtCourseSeed = {
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
  };

export const terminalASvtHumanLineagePath = createSvtPath(course);
