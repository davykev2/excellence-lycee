import { createSvtPath, type SvtCourseSeed } from "./svtPathFactory";
import { q, choice, trueFalse, createSvtSource } from "./terminalSvtPathHelpers";

const geneticPredictionsSource = createSvtSource("SVT TA_L6_Les prévisions génétiques.pdf");

const course: SvtCourseSeed = {
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
  };

export const terminalASvtGeneticPredictionsPath = createSvtPath(course);
