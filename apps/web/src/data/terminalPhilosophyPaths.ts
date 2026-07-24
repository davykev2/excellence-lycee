import type { LessonQuestion } from "../domain/paths";
import { createPhilosophyPath, type PhilosophyCourseSeed } from "./philosophyPathFactory";

const q = (prompt: string, answer: string, wrong1: string, wrong2: string, wrong3: string, explanation = answer): LessonQuestion => ({
  prompt,
  options: [answer, wrong1, wrong2, wrong3],
  correctIndex: 0,
  explanation,
});

const courses: PhilosophyCourseSeed[] = [
  {
    id: "terminale-philo-l1-dissertation",
    chapterNumber: 1,
    themeNumber: 1,
    themeTitle: "La méthodologie",
    title: "La dissertation philosophique",
    description: "Comprendre un sujet, en dégager le problème, puis construire une introduction, une argumentation et une conclusion.",
    centralQuestion: "Comment passer d’un sujet donné à une copie argumentée qui résout un problème ?",
    memorySentence: "Étudier les mots, reformuler, problématiser, argumenter avec des références, puis conclure.",
    sections: [
      {
        id: "study-subject",
        title: "Comprendre le sujet",
        summary: "Mener l’étude parcellaire puis reformuler le sujet sans en altérer le sens.",
        conceptTitle: "La phase préparatoire : deux étapes avant d’écrire",
        explanation: "La compréhension du sujet passe par une phase préparatoire en deux étapes : l’étude parcellaire, qui définit les mots essentiels, et la reformulation, qui restitue le sens d’ensemble.",
        bodyMarkdown: String.raw`## Pourquoi ne jamais écrire tout de suite

La dissertation philosophique est un exercice écrit portant sur un sujet, **à partir duquel on dégage le problème central** en vue de son analyse. Cette analyse doit se faire à travers une argumentation cohérente. Pour parvenir à un bon devoir, il est donc nécessaire de **bien comprendre le sujet** avant toute rédaction.

## A. L’étude parcellaire

Elle consiste à **identifier les mots ou expressions essentiels** — ceux sans lesquels le sujet ne se comprend pas — et à **les définir selon le contexte**.

### Exemple entièrement traité

Sujet : **« Doit-on condamner le progrès technique ? »**

| Mot ou expression | Définition contextuelle |
|---|---|
| **Doit-on** | a-t-on le droit, est-il normal, faut-il… |
| **condamner** | blâmer, rejeter, désapprouver |
| **le progrès technique** | les avancées, les exploits réalisés par la technique |

> **Le mot « selon le contexte » est décisif.** « Condamner » n’a pas le même sens en droit et en morale. On ne recopie pas une définition de dictionnaire : on choisit celle qu’appelle le sujet.

## B. La reformulation du sujet

Reformuler, c’est **donner la signification d’ensemble** du sujet : le réécrire pour le rendre **plus explicite sans en altérer le sens initial**.

En remplaçant chaque terme par sa définition, le sujet devient :

> **« Faut-il blâmer les avancées réalisées par la technique ? »**

> **Erreur fréquente.** Reformuler n’est ni résumer, ni répondre, ni recopier. Une reformulation qui change le sens — par exemple « La technique est-elle dangereuse ? » — trahit le sujet : elle en oriente déjà la réponse.

### Reconnaître une bonne reformulation

Parmi ces trois propositions pour « Doit-on condamner le progrès technique ? » :

- « L’essor de la technique doit-il susciter la crainte ? » — **oriente** vers la crainte, donc infidèle ;
- « A-t-on des raisons de se féliciter des prouesses de la technique ? » — **inverse** le sens ;
- « Est-il nécessaire de craindre les avancées réalisées par l’ensemble des procédés scientifiques employés dans l’investigation et la transformation de la nature ? » — **développe chaque terme** sans trancher : c’est la bonne.`,
        keyPoint: "Comprendre un sujet, c’est définir ses mots essentiels dans leur contexte, puis le réécrire plus clairement sans en changer le sens.",
        example: "« Doit-on condamner le progrès technique ? » devient « Faut-il blâmer les avancées réalisées par la technique ? »",
        mapTitle: "Les deux étapes de la phase préparatoire",
        mapInstruction: "Parcours les deux opérations à mener avant même de chercher le problème.",
        map: [
          { label: "Étude parcellaire", shortLabel: "Définir", detail: "Repérer les mots essentiels du sujet et les définir selon le contexte, jamais au sens du dictionnaire." },
          { label: "Reformulation", shortLabel: "Reformuler", detail: "Réécrire le sujet en remplaçant chaque terme par sa définition, pour le rendre explicite sans en altérer le sens." },
        ],
        observation: "Un sujet mal compris conduit à un hors-sujet, quelles que soient la qualité de l’écriture et la richesse des références.",
        check: { prompt: "En quoi consiste l’étude parcellaire ?", options: ["Identifier les mots essentiels et les définir selon le contexte", "Rédiger l’introduction", "Chercher des citations d’auteurs", "Annoncer le plan du devoir"], correctIndex: 0, explanation: "C’est la première étape de la phase préparatoire." },
        extraQuestions: [
          { prompt: "Reformuler un sujet, c’est…", options: ["le réécrire plus clairement sans en altérer le sens", "y répondre brièvement", "le résumer en trois mots", "le recopier tel quel"], correctIndex: 0, explanation: "La reformulation rend explicite sans trahir.", sourceLabel: "I-B La reformulation", points: 2 },
          { prompt: "Dans « Doit-on condamner le progrès technique ? », que signifie « condamner » ?", options: ["blâmer, rejeter, désapprouver", "emprisonner", "mesurer", "encourager"], correctIndex: 0, explanation: "C’est la définition contextuelle donnée par le corrigé.", sourceLabel: "Activité d’application 1", points: 1 },
          { prompt: "Quelle formulation reformule fidèlement « Doit-on condamner le progrès technique ? »", options: ["Est-il nécessaire de craindre les avancées réalisées par les procédés de transformation de la nature ?", "L’essor de la technique doit-il susciter la crainte ?", "A-t-on des raisons de se féliciter des prouesses de la technique ?", "La technique est-elle utile ?"], correctIndex: 0, explanation: "Les autres orientent ou inversent le sens du sujet.", sourceLabel: "Activité d’application 3", points: 3 },
          { prompt: "Pourquoi définir les mots « selon le contexte » ?", options: ["parce qu’un même mot change de sens selon le sujet posé", "pour allonger la copie", "pour éviter les citations", "parce que le dictionnaire est interdit"], correctIndex: 0, explanation: "« Condamner » n’a pas le même sens en droit et en morale.", sourceLabel: "I-A L’étude parcellaire", points: 2 },
        ],
        distractors: ["L’étude parcellaire consiste à recopier le sujet.", "La reformulation sert à donner immédiatement sa réponse.", "On peut rédiger sans définir les termes du sujet."],
      },
      {
        id: "problematisation",
        title: "Faire naître le problème",
        summary: "Dégager la difficulté centrale du sujet et la décliner en aspects qui annoncent les axes.",
        conceptTitle: "Du sujet au problème, puis aux aspects",
        explanation: "Le problème est la difficulté centrale que soulève le sujet ; il apparaît à partir d’une contradiction ou d’un paradoxe. Les aspects sont les questions que suscite ce problème et annoncent les axes du développement.",
        bodyMarkdown: String.raw`## Le problème

Le **problème** est la **difficulté centrale** que soulève le sujet. Il apparaît à partir d’une **contradiction** ou d’un **paradoxe** situé au cœur du sujet.

> **Où le trouver ?** Cherche la tension : le sujet oppose deux réponses également défendables. S’il n’y a pas de tension, il n’y a pas de problème — donc pas de dissertation, mais un exposé.

## Les aspects du problème

Les **aspects** sont les **diverses questions que suscite le problème**. Ils **annoncent les axes du développement** : à chaque aspect correspondra une partie.

## Exemple entièrement traité

Sujet : **« Doit-on condamner le progrès technique ? »**

| Étape | Résultat |
|---|---|
| Reformulation | Faut-il blâmer les avancées réalisées par la technique ? |
| **Problème** | **La technique est-elle nuisible ?** |
| **Aspect 1** | En quoi le progrès technique est-il facteur de développement ? |
| **Aspect 2** | Le progrès technique ne suscite-t-il pas des inquiétudes ? |

## Deuxième exemple

Sujet : **« Il faut plaindre celui qui vit en société. »**

| Étape | Résultat |
|---|---|
| Reformulation | Il est impératif d’avoir de la compassion pour celui qui vit en société. |
| **Problème** | **Faut-il avoir un sentiment de pitié pour celui qui vit en société ?** |
| **Aspect 1** | En quel sens peut-on dire qu’il faut plaindre celui qui vit en société ? |
| **Aspect 2** | Toutefois, ne doit-on pas envier celui qui vit en société ? |

> **Astuce d’écriture.** Le second aspect commence presque toujours par un mot d’opposition : « toutefois », « cependant », « ne… pas au contraire ». C’est cette bascule qui prouve que tu as vu la tension.

> **Erreur fréquente.** Recopier le sujet sous forme de question n’est pas problématiser. « Doit-on condamner le progrès technique ? » n’est pas un problème : c’est encore le sujet.`,
        keyPoint: "Le problème est la difficulté centrale née d’une contradiction ; les aspects sont les questions qu’il soulève et annoncent les axes.",
        example: "Pour « Doit-on condamner le progrès technique ? », le problème est : la technique est-elle nuisible ?",
        mapTitle: "De la reformulation aux axes",
        mapInstruction: "Suis l’enchaînement qui mène du sujet reformulé jusqu’aux axes du développement.",
        map: [
          { label: "Repérer la tension", shortLabel: "Tension", detail: "Chercher la contradiction ou le paradoxe au cœur du sujet : deux réponses opposées semblent également défendables." },
          { label: "Formuler le problème", shortLabel: "Problème", detail: "Écrire la difficulté centrale sous forme de question, sans recopier le sujet." },
          { label: "Décliner les aspects", shortLabel: "Aspects", detail: "Poser les questions que soulève le problème : elles annoncent directement les axes du développement." },
        ],
        observation: "Sans problème, il n’y a pas de dissertation : seulement un exposé qui juxtapose des connaissances.",
        check: { prompt: "Qu’est-ce que le problème d’un sujet ?", options: ["La difficulté centrale née d’une contradiction ou d’un paradoxe", "Le premier argument du devoir", "La citation la plus célèbre", "Le plan en deux parties"], correctIndex: 0, explanation: "Le problème est la difficulté intellectuelle à surmonter." },
        extraQuestions: [
          { prompt: "À quoi servent les aspects du problème ?", options: ["ils annoncent les axes du développement", "ils remplacent la conclusion", "ils donnent la réponse finale", "ils listent les auteurs à citer"], correctIndex: 0, explanation: "Chaque aspect deviendra une partie du développement.", sourceLabel: "II La problématisation", points: 2 },
          { prompt: "Pour « Doit-on condamner le progrès technique ? », quel est le problème dégagé par le corrigé ?", options: ["La technique est-elle nuisible ?", "La technique est-elle moderne ?", "Qui a inventé la technique ?", "La technique coûte-t-elle cher ?"], correctIndex: 0, explanation: "C’est la difficulté centrale du sujet.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "Pour « Il faut plaindre celui qui vit en société », quel est le problème ?", options: ["Faut-il avoir un sentiment de pitié pour celui qui vit en société ?", "La société est-elle ancienne ?", "Comment fonder une société ?", "Qui dirige la société ?"], correctIndex: 0, explanation: "C’est la troisième opération du travail au brouillon.", sourceLabel: "Situation d’évaluation", points: 2 },
          { prompt: "Recopier le sujet sous forme de question, est-ce problématiser ?", options: ["Non, il faut faire apparaître la difficulté", "Oui, cela suffit", "Oui, si la question est longue", "Non, il faut y répondre d’abord"], correctIndex: 0, explanation: "Le problème doit révéler la tension, pas répéter l’énoncé.", sourceLabel: "II La problématisation", points: 2 },
        ],
        distractors: ["Le problème est la conclusion du devoir.", "Les aspects servent à remplir la copie.", "Un sujet sans contradiction donne une bonne dissertation."],
      },
      {
        id: "introduction",
        title: "Rédiger l’introduction",
        summary: "Construire les trois composantes de l’introduction et les enchaîner en un paragraphe.",
        conceptTitle: "Amorce, problème, aspects",
        explanation: "L’introduction pose clairement le problème du sujet, qui est la difficulté intellectuelle à surmonter. Il est précédé par une amorce et s’achève par ses aspects.",
        bodyMarkdown: String.raw`## Les trois composantes

L’introduction consiste à **poser clairement le problème** du sujet, c’est-à-dire la difficulté intellectuelle à surmonter. Ce problème est **précédé d’une amorce** et **s’achève par ses aspects**.

| Composante | Rôle |
|---|---|
| **L’amorce** | entrer dans le sujet à partir d’un constat, d’une observation ou d’un fait |
| **Le problème** | énoncer la difficulté centrale |
| **Les aspects** | annoncer les questions, donc les axes à venir |

## Un modèle rédigé, décortiqué

Sujet : **« Doit-on condamner le progrès technique ? »**

> « **L’expérience quotidienne nous révèle le progrès vertigineux des sciences et techniques dans presque toutes les sphères de la vie. Et cela semble confirmer l’idée selon laquelle l’avenir appartient à la science et à la technique.** *(amorce)* **Malheureusement, cette évolution de la technoscience s’accompagne souvent d’une réelle menace pour l’humanité entière. Dès lors, doit-on souscrire à l’idée selon laquelle la technique est nuisible ?** *(problème)* **Dans quelle mesure la puissance technique constitue-t-elle une menace ? N’est-elle pas au contraire un facteur de développement ?** *(aspects)* »

> **Ce qu’il faut observer.** L’amorce part d’un constat partagé, jamais d’une généralité creuse du type « Depuis la nuit des temps ». Le mot « **Malheureusement** » fait basculer vers la difficulté : c’est la charnière qui fait naître le problème. Enfin, « **N’est-elle pas au contraire** » ouvre le second axe.

> **Erreur fréquente.** Annoncer le plan (« Nous verrons d’abord… puis… ») n’est **pas** annoncer les aspects. Les aspects sont des **questions**, pas un sommaire.`,
        keyPoint: "L’introduction enchaîne trois composantes : une amorce, le problème, puis les aspects formulés en questions.",
        example: "« Malheureusement… Dès lors, doit-on souscrire à l’idée selon laquelle la technique est nuisible ? » : la charnière fait naître le problème.",
        mapTitle: "Les trois composantes de l’introduction",
        mapInstruction: "Sélectionne chaque composante pour comprendre son rôle et sa place dans le paragraphe.",
        map: [
          { label: "L’amorce", shortLabel: "Amorce", detail: "Entrer dans le sujet par un constat concret et partagé, jamais par une généralité vague." },
          { label: "Le problème", shortLabel: "Problème", detail: "Énoncer la difficulté centrale, souvent introduite par une charnière : « Malheureusement », « Pourtant », « Dès lors »." },
          { label: "Les aspects", shortLabel: "Aspects", detail: "Poser les questions qui annoncent les axes, la seconde marquant l’opposition : « N’est-elle pas au contraire… ? »" },
        ],
        observation: "Une introduction réussie donne au correcteur le problème et le chemin, en un seul paragraphe.",
        check: { prompt: "Quelles sont les trois composantes de l’introduction ?", options: ["L’amorce, le problème et les aspects", "La thèse, l’antithèse et la synthèse", "La définition, la citation et l’exemple", "Le bilan, la réponse et l’ouverture"], correctIndex: 0, explanation: "C’est la réponse exacte du corrigé de l’activité d’application." },
        extraQuestions: [
          { prompt: "Par quoi le problème est-il précédé dans l’introduction ?", options: ["une amorce", "une citation", "le plan détaillé", "la conclusion"], correctIndex: 0, explanation: "L’amorce ouvre l’introduction.", sourceLabel: "III-A L’introduction", points: 1 },
          { prompt: "Par quoi l’introduction s’achève-t-elle ?", options: ["les aspects du problème", "la réponse au problème", "une citation d’auteur", "le bilan de la réflexion"], correctIndex: 0, explanation: "Les aspects annoncent les axes du développement.", sourceLabel: "III-A L’introduction", points: 2 },
          { prompt: "« Nous verrons d’abord… puis… » : est-ce une annonce des aspects ?", options: ["Non, les aspects sont des questions", "Oui, c’est équivalent", "Oui, si la phrase est longue", "Non, c’est l’amorce"], correctIndex: 0, explanation: "Un sommaire n’est pas une problématisation.", sourceLabel: "III-A L’introduction", points: 3 },
          { prompt: "Dans l’introduction modèle, quel mot fait basculer vers la difficulté ?", options: ["Malheureusement", "L’expérience", "Toujours", "Enfin"], correctIndex: 0, explanation: "La charnière « Malheureusement » introduit la menace, donc le problème.", sourceLabel: "Activité d’application - corrigé", points: 2 },
        ],
        distractors: ["L’introduction doit donner la réponse finale.", "L’amorce se place après le problème.", "Les aspects sont des affirmations, pas des questions."],
      },
      {
        id: "development-conclusion",
        title: "Développer et conclure",
        summary: "Structurer les axes, argumenter avec des références, puis rédiger une conclusion complète.",
        conceptTitle: "Argumenter, référencer, conclure",
        explanation: "Le développement résout le problème en structurant les axes, en les argumentant avec des références et des illustrations, reliés par des transitions. La conclusion répond au problème après un bilan, et peut s’ouvrir.",
        bodyMarkdown: String.raw`## B. Le développement

Le développement consiste à **résoudre le problème**. Cette résolution revient à :

1. **structurer les axes** d’analyse du sujet ;
2. **les argumenter** en s’appuyant sur des **références** et des **illustrations** ;
3. relier les arguments et les axes par des **transitions** (mots de liaison, connecteurs logiques).

> **La règle d’or de l’argument complet.** Un argument seul ne vaut rien. La chaîne attendue est : **Axe → Argument → Référence**. L’axe annonce la thèse, l’argument la justifie, la référence l’autorise.

## Un développement entièrement construit

Sujet : **« Il faut plaindre celui qui vit en société. »**

### Axe 1 — Il faut plaindre celui qui vit en société

| Argument | Références |
|---|---|
| La vie en société est le lieu où la sécurité n’est pas toujours garantie, à cause de l’agressivité injustifiée d’autrui et de son hypocrisie. | **SARTRE**, *Huis clos* : « L’enfer c’est les autres. » — **HOBBES**, *Léviathan* : « L’homme est un loup pour l’homme. » |
| Le bonheur de l’homme en société est constamment menacé, car il doit obéissance stricte aux lois et soumission à l’autorité étatique. | **BAKOUNINE**, *Étatisme et anarchisme* : « L’État est un immense cimetière où viennent s’enterrer toutes les manifestations de la vie individuelle. » |

### Axe 2 — Il faut envier celui qui vit en société

| Argument | Références |
|---|---|
| Celui qui mène une existence communautaire profite de la société pour combler ses déficiences naturelles, par l’assistance et la coopération. | **GARAUDY**, *Testament philosophique* : « L’enfer, c’est l’absence des autres. » — **MALSON**, *Les enfants sauvages* : « Les hommes ne sont pas des hommes hors de l’ambiance sociale. » |
| La société moderne, par l’État et les lois issues de la volonté générale, assure la sécurité, l’épanouissement et la liberté du citoyen. | **SPINOZA**, *Traité théologico-politique* : « La fin de l’État est donc en réalité la liberté. » |

> **Regarde le duel.** Sartre écrit « L’enfer c’est les autres » ; Garaudy répond « L’enfer, c’est l’absence des autres ». Les deux citations se répondent **terme à terme**. C’est exactement ce qu’on attend : montrer qu’une thèse appelle son contraire, et non aligner des citations sans lien.

## C. La conclusion

La conclusion consiste à **répondre de façon claire et précise au problème posé dans l’introduction**. Cette réponse est **précédée du bilan** de la réflexion et **peut s’achever par une ouverture**.

| Composante | Rôle |
|---|---|
| **Le bilan** | rappeler le chemin parcouru dans les axes |
| **La réponse** | trancher clairement le problème de l’introduction |
| **L’ouverture** | facultative : élargir vers une question voisine |

> **Erreur fréquente.** Une conclusion qui ne répond pas au problème posé en introduction, ou qui introduit un argument nouveau, invalide tout le devoir. Le problème ouvert en introduction doit être **refermé** ici.`,
        keyPoint: "Un développement enchaîne axe, argument et référence, relié par des transitions ; la conclusion fait le bilan, répond au problème, puis peut ouvrir.",
        example: "Sartre « L’enfer c’est les autres » et Garaudy « L’enfer, c’est l’absence des autres » se répondent terme à terme.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "L’architecture d’une dissertation",
          instruction: "Sélectionne une partie pour découvrir ce qu’elle doit contenir.",
          observation: "Chaque partie a un rôle unique : l’introduction ouvre le problème, le développement le résout, la conclusion le referme.",
          rootLabel: "La dissertation philosophique",
          rootDetail: "Trois parties, chacune avec ses composantes obligatoires",
          nodes: [
            { id: "amorce", group: "Introduction", label: "L’amorce", role: "Entrer dans le sujet", detail: "Un constat concret et partagé qui conduit naturellement au sujet. Jamais une généralité creuse du type « Depuis la nuit des temps ». Dans le modèle : « L’expérience quotidienne nous révèle le progrès vertigineux des sciences et techniques. »" },
            { id: "probleme-intro", group: "Introduction", label: "Le problème", role: "Poser la difficulté", detail: "La difficulté intellectuelle à surmonter, née d’une contradiction. Souvent introduite par une charnière : « Malheureusement », « Pourtant », « Dès lors ». C’est le cœur de l’introduction." },
            { id: "aspects-intro", group: "Introduction", label: "Les aspects", role: "Annoncer les axes", detail: "Les questions que soulève le problème, formulées comme telles. La seconde marque l’opposition : « N’est-elle pas au contraire un facteur de développement ? » Ce ne sont pas des annonces de plan." },
            { id: "axes", group: "Développement", label: "Les axes", role: "Structurer la réponse", detail: "Chaque aspect annoncé en introduction devient un axe. L’axe énonce une thèse : « Il faut plaindre celui qui vit en société », puis « Il faut envier celui qui vit en société »." },
            { id: "arguments", group: "Développement", label: "Les arguments", role: "Justifier chaque axe", detail: "Deux arguments par axe en général. Chacun explique pourquoi la thèse tient : « La vie en société est le lieu où la sécurité n’est pas toujours garantie à cause de l’agressivité d’autrui. »" },
            { id: "references", group: "Développement", label: "Les références", role: "Autoriser l’argument", detail: "Une citation avec son auteur et son œuvre, choisie parce qu’elle dit exactement l’argument. Hobbes dans le Léviathan : « L’homme est un loup pour l’homme. » Une citation plaquée sans lien ne compte pas." },
            { id: "transitions", group: "Développement", label: "Les transitions", role: "Relier les parties", detail: "Mots de liaison et connecteurs logiques qui font passer d’un argument à un autre et d’un axe à un autre. Sans eux, la copie juxtapose au lieu de raisonner." },
            { id: "bilan", group: "Conclusion", label: "Le bilan", role: "Rappeler le chemin", detail: "Un résumé bref du parcours des axes, sans reprendre les développements. Il prépare la réponse." },
            { id: "reponse", group: "Conclusion", label: "La réponse", role: "Trancher le problème", detail: "Une réponse claire et précise au problème posé en introduction. C’est l’élément obligatoire : sans elle, le devoir reste ouvert et perd sa cohérence." },
            { id: "ouverture", group: "Conclusion", label: "L’ouverture", role: "Élargir (facultatif)", detail: "Une question voisine qui prolonge la réflexion. Facultative : mieux vaut pas d’ouverture qu’une ouverture artificielle." },
          ],
        },
        mapTitle: "De l’axe à la référence",
        mapInstruction: "Suis la chaîne qui rend un argument recevable.",
        map: [
          { label: "L’axe", shortLabel: "Axe", detail: "La thèse défendue dans cette partie, issue directement d’un aspect annoncé en introduction." },
          { label: "L’argument", shortLabel: "Argument", detail: "La justification qui explique pourquoi la thèse tient." },
          { label: "La référence", shortLabel: "Référence", detail: "Une citation avec auteur et œuvre, choisie parce qu’elle dit exactement l’argument." },
          { label: "La transition", shortLabel: "Transition", detail: "Le connecteur logique qui fait passer à l’argument ou à l’axe suivant." },
        ],
        observation: "Une citation sans argument ne prouve rien ; un argument sans référence reste une opinion.",
        check: { prompt: "Que doit contenir la conclusion ?", options: ["Un bilan, une réponse au problème, et éventuellement une ouverture", "Un nouvel argument et une citation", "Le rappel des définitions du sujet", "L’annonce du plan"], correctIndex: 0, explanation: "La réponse au problème est précédée du bilan et peut s’achever par une ouverture." },
        extraQuestions: [
          { prompt: "En quoi consiste le développement ?", options: ["à résoudre le problème en structurant et argumentant les axes", "à définir les mots du sujet", "à recopier des citations", "à poser le problème"], correctIndex: 0, explanation: "C’est la résolution du problème posé en introduction.", sourceLabel: "III-B Le développement", points: 2 },
          { prompt: "Qui écrit « L’homme est un loup pour l’homme » ?", options: ["Hobbes, dans le Léviathan", "Sartre, dans Huis clos", "Spinoza, dans le Traité théologico-politique", "Bakounine"], correctIndex: 0, explanation: "Référence de l’axe 1, argument 1.", sourceLabel: "Situation d’évaluation - références", points: 2 },
          { prompt: "Quelle citation répond terme à terme au « L’enfer c’est les autres » de Sartre ?", options: ["« L’enfer, c’est l’absence des autres » de Garaudy", "« L’homme est un loup pour l’homme » de Hobbes", "« La fin de l’État est la liberté » de Spinoza", "« L’État est un immense cimetière » de Bakounine"], correctIndex: 0, explanation: "Garaudy, dans son Testament philosophique, inverse exactement la formule de Sartre.", sourceLabel: "Situation d’évaluation - références", points: 3 },
          { prompt: "Qui écrit « La fin de l’État est donc en réalité la liberté » ?", options: ["Spinoza, Traité théologico-politique", "Bakounine, Étatisme et anarchisme", "Malson, Les enfants sauvages", "Hobbes, Léviathan"], correctIndex: 0, explanation: "Référence de l’axe 2, argument 2.", sourceLabel: "Situation d’évaluation - références", points: 2 },
          { prompt: "À quoi servent les transitions ?", options: ["à relier les arguments et les axes entre eux", "à allonger la copie", "à remplacer les références", "à conclure le devoir"], correctIndex: 0, explanation: "Elles font passer d’un argument à un autre et d’un axe à un autre.", sourceLabel: "III-B Le développement", points: 2 },
        ],
        distractors: ["Une citation suffit à prouver un argument.", "La conclusion doit introduire un argument nouveau.", "Les transitions sont facultatives dans une dissertation."],
      },
    ],
    mission: {
      title: "La pluralité des cultures est-elle un obstacle au rapprochement des peuples ?",
      scenario: "Dans le cadre d’une réflexion sur l’impact des diversités culturelles, les élèves de Terminale sont soumis à ce sujet. Dans une production argumentée, tu dois donner ton point de vue.",
      problem: "L’égalité entre les hommes est-elle une illusion ?",
      modelAnswer: "La diversité des cultures nourrit d’abord la méfiance et l’ethnocentrisme, mais elle constitue aussi la richesse du genre humain : le brassage culturel et l’exigence morale du respect font de la pluralité un facteur de rapprochement plutôt qu’un obstacle.",
      bodyMarkdown: String.raw`## Le corrigé, opération par opération

### I. Définition des termes et expressions essentiels

| Terme | Définition |
|---|---|
| **La pluralité des cultures** | la diversité culturelle, la différence entre les cultures |
| **Être un obstacle à** | constituer une entrave à, s’opposer à, compromettre |
| **Rapprochement des peuples** | l’unité du genre humain, l’égalité entre les hommes |

### II. Problème à analyser

> **L’égalité entre les hommes est-elle une illusion ?**

### III. Axes d’analyse et références

#### Axe 1 — La diversité culturelle ne favorise pas l’unité du genre humain

**Argument 1.** Les différences culturelles sont sources de conflits entre les hommes.

> **Claude LÉVI-STRAUSS**, *Race et culture* : « L’attitude la plus ancienne, et qui repose sans doute sur des fondements psychologiques solides, consiste à répudier purement et simplement les formes culturelles — morales, religieuses, sociales, esthétiques — qui sont les plus éloignées de celles auxquelles nous nous identifions. »

**Argument 2.** La multiplicité des cultures engendre l’ethnocentrisme et le complexe de supériorité des peuples dits évolués.

> **HEGEL**, *La Raison dans l’histoire*. — **Jules FERRY**, discours sur l’expansion coloniale, 28 juillet 1885 : « Il faut dire ouvertement que les races supérieures ont un droit vis-à-vis des races inférieures. »

#### Axe 2 — La pluralité culturelle peut être facteur de rapprochement

**Argument 1.** L’humanité se définit comme l’ensemble de tous les hommes malgré leurs différences : la multiplicité des cultures est la richesse du genre humain.

> **Auguste COMTE**, *Catéchisme positiviste* : « Vous devez d’abord définir l’humanité comme l’ensemble des êtres humains, passés, futurs et présents. »

**Argument 2.** Le brassage culturel est source d’enrichissement mutuel et permet à l’humanité de progresser.

> **Aimé CÉSAIRE**, *Discours sur le colonialisme* : « J’admets que mettre les civilisations différentes en contact les unes avec les autres est bien ; que marier des mondes différents est excellent. » — **SAINT-EXUPÉRY**, *Terre des hommes* : « Si tu diffères de moi, loin de me léser, tu m’enrichis. »

**Argument 3.** Le respect des autres malgré nos différences est une exigence morale.

> **Emmanuel KANT**, *Fondements de la métaphysique des mœurs* : « Agis de telle sorte que tu traites l’humanité, aussi bien dans ta personne que dans la personne de tout autre, toujours en même temps comme une fin, et jamais simplement comme un moyen. »

> **Ce que ce corrigé enseigne.** L’axe 1 n’est pas une erreur qu’on corrige ensuite : c’est une thèse **sérieusement défendue**, avec ses auteurs. La force d’une dissertation vient de ce que l’on donne à l’adversaire ses meilleures armes avant de lui répondre.`,
      plan: [
        { label: "Définir les termes", shortLabel: "Définir", detail: "Pluralité des cultures, être un obstacle à, rapprochement des peuples : chaque expression est définie dans le contexte du sujet." },
        { label: "Formuler le problème", shortLabel: "Problème", detail: "L’égalité entre les hommes est-elle une illusion ?" },
        { label: "Axe 1 : la diversité divise", shortLabel: "Axe 1", detail: "Conflits et ethnocentrisme, avec Lévi-Strauss, Hegel et Jules Ferry." },
        { label: "Axe 2 : la diversité rapproche", shortLabel: "Axe 2", detail: "Richesse du genre humain, brassage et exigence morale, avec Comte, Césaire, Saint-Exupéry et Kant." },
        { label: "Conclure", shortLabel: "Conclure", detail: "Bilan des deux axes, réponse claire au problème, puis ouverture possible." },
      ],
      questions: [
        { prompt: "Quel problème le corrigé dégage-t-il de ce sujet ?", options: ["L’égalité entre les hommes est-elle une illusion ?", "Combien de cultures existe-t-il ?", "La culture est-elle utile ?", "Faut-il voyager ?"], correctIndex: 0, explanation: "C’est la difficulté centrale, formulée à la deuxième opération.", sourceLabel: "Situation d’évaluation 1 - II", points: 2 },
        { prompt: "Quelle citation soutient l’argument du repli sur sa propre culture ?", options: ["Lévi-Strauss : « répudier les formes culturelles les plus éloignées des nôtres »", "Kant : « traiter l’humanité toujours comme une fin »", "Saint-Exupéry : « Si tu diffères de moi, tu m’enrichis »", "Comte : « l’ensemble des êtres humains »"], correctIndex: 0, explanation: "Lévi-Strauss, dans Race et culture, décrit ce réflexe de répudiation.", sourceLabel: "Situation d’évaluation 1 - Axe 1", points: 3 },
        { prompt: "Quelle position le corrigé défend-il finalement ?", options: ["La pluralité est un facteur de rapprochement, malgré les tensions qu’elle crée", "La pluralité est un obstacle définitif", "Les cultures doivent disparaître", "La question n’a pas de réponse"], correctIndex: 0, explanation: "L’axe 2 répond à l’axe 1 : la diversité enrichit et le respect est une exigence morale.", sourceLabel: "Situation d’évaluation 1 - Axe 2", points: 2 },
      ],
      extraQuestions: [
        { prompt: "Qui écrit « Si tu diffères de moi, loin de me léser, tu m’enrichis » ?", options: ["Saint-Exupéry, Terre des hommes", "Aimé Césaire, Discours sur le colonialisme", "Auguste Comte, Catéchisme positiviste", "Kant, Fondements de la métaphysique des mœurs"], correctIndex: 0, explanation: "Référence de l’axe 2, argument 2.", sourceLabel: "Situation d’évaluation 1 - références", points: 2 },
        { prompt: "Quelle citation de Kant fonde l’exigence morale du respect ?", options: ["« Traite l’humanité toujours en même temps comme une fin, et jamais simplement comme un moyen »", "« L’enfer c’est les autres »", "« L’homme est un loup pour l’homme »", "« La fin de l’État est la liberté »"], correctIndex: 0, explanation: "C’est la formule des Fondements de la métaphysique des mœurs.", sourceLabel: "Situation d’évaluation 1 - Axe 2", points: 3 },
        { prompt: "Pourquoi défendre sérieusement l’axe 1 avant de le réfuter ?", options: ["parce qu’une thèse ne se réfute bien qu’après avoir été présentée avec ses meilleures raisons", "pour allonger la copie", "parce que le correcteur compte les citations", "pour éviter de conclure"], correctIndex: 0, explanation: "C’est le geste philosophique attendu : faire dialoguer les positions.", sourceLabel: "Méthode - développement", points: 3 },
      ],
    },
  },
  {
    id: "terminale-philo-l2-text-commentary",
    chapterNumber: 2,
    themeNumber: 1,
    themeTitle: "La méthodologie",
    title: "Le commentaire de texte philosophique",
    description: "Expliquer le raisonnement d’un auteur, puis évaluer sa thèse dans une discussion philosophique organisée.",
    centralQuestion: "Comment expliquer un texte sans le paraphraser et discuter sa valeur ?",
    memorySentence: "Problématique → étude ordonnée → critique interne et externe → conclusion.",
    sections: [
      {
        id: "problematics",
        title: "Dégager la problématique",
        summary: "Identifier thème, problème, thèse, intention, enjeu et structure logique.",
        conceptTitle: "Présenter précisément le texte",
        explanation: "Le thème indique le domaine du texte, le problème sa question centrale et la thèse la réponse de l’auteur. L’intention précise ce qu’il veut accomplir, l’enjeu ce que la discussion permet de gagner ou de préserver.",
        keyPoint: "Thème = sujet ; problème = question ; thèse = réponse ; intention = but ; enjeu = intérêt.",
        example: "Dans le texte de Hountondji : thème, définition de la philosophie ; problème, est-elle un système ? ; thèse, elle est un débat toujours ouvert.",
        mapTitle: "La fiche d’identité du texte",
        mapInstruction: "Distingue les éléments qui ne doivent pas être confondus.",
        map: [
          { label: "Thème", detail: "De quoi est-il question ?" },
          { label: "Problème", detail: "Quelle difficulté l’auteur cherche-t-il à résoudre ?" },
          { label: "Thèse", detail: "Quelle réponse défend-il ?" },
          { label: "Intention et enjeu", detail: "Pourquoi l’écrit-il et qu’y a-t-il à gagner dans cette réflexion ?" },
        ],
        observation: "La thèse doit être formulée comme la réponse exacte de l’auteur au problème.",
        check: q("À quelle question répond la thèse ?", "Quelle réponse l’auteur apporte-t-il au problème ?", "Combien de lignes compte le texte ?", "Qui a imprimé le livre ?", "Quel est le sujet du prochain devoir ?"),
        distractors: ["Le thème et la thèse désignent la même chose.", "L’enjeu est le nombre de mouvements.", "La problématique consiste à résumer chaque phrase."],
      },
      {
        id: "ordered-study",
        title: "Faire l’étude ordonnée",
        summary: "Découper les mouvements et expliquer la démarche argumentative sans répéter le texte.",
        conceptTitle: "Suivre le mouvement de la pensée",
        explanation: "L’étude ordonnée explique chaque mouvement du texte, ses idées principales, arguments, concepts et exemples. Elle montre comment l’auteur progresse vers sa thèse et ménage des transitions entre les parties.",
        keyPoint: "Expliquer, c’est montrer ce que l’auteur affirme, pourquoi il l’affirme et comment l’argument conduit à la thèse.",
        example: "Hountondji nie d’abord que la philosophie soit un système clos, puis la définit positivement comme débat collectif et responsable.",
        mapTitle: "Du découpage à l’explication",
        mapInstruction: "Repère la fonction de chaque mouvement.",
        map: [
          { label: "Mouvement 1", detail: "Formuler l’idée principale et expliquer les arguments qui la soutiennent." },
          { label: "Transition", detail: "Montrer pourquoi la pensée doit passer à une nouvelle étape." },
          { label: "Mouvement 2", detail: "Expliquer la nouvelle idée et son apport à la thèse générale." },
        ],
        observation: "La paraphrase répète ; l’explication révèle la fonction logique des idées.",
        check: q("Comment éviter la paraphrase ?", "Expliquer la fonction des arguments et leurs liens", "Remplacer chaque mot par un synonyme", "Recopier les phrases les plus longues", "Donner son opinion à chaque ligne"),
        distractors: ["L’étude ordonnée ignore la structure logique.", "Expliquer signifie seulement reformuler.", "Les transitions sont inutiles dans un commentaire."],
      },
      {
        id: "philosophical-interest",
        title: "Dégager l’intérêt philosophique",
        summary: "Évaluer la cohérence du texte puis confronter sa thèse à d’autres positions.",
        conceptTitle: "Critique interne et critique externe",
        explanation: "La critique interne évalue la forme du raisonnement : cohérence, pertinence, forces et limites des arguments. La critique externe discute le fond : elle justifie la thèse par d’autres références puis la dépasse par des positions opposées.",
        keyPoint: "Interne = valeur du raisonnement ; externe = discussion de la thèse.",
        example: "On peut soutenir Hountondji avec Jaspers ou Kant, puis lui opposer Hegel pour qui une philosophie doit former un système.",
        mapTitle: "Évaluer sans juger trop vite",
        mapInstruction: "Passe de la forme du texte au débat sur le fond.",
        map: [
          { label: "Critique interne", detail: "La démarche choisie réalise-t-elle l’intention de l’auteur ?" },
          { label: "Justification", detail: "Quelles idées ou références renforcent la thèse ?" },
          { label: "Dépassement", detail: "Quelles limites ou positions contraires permettent de la nuancer ?" },
        ],
        observation: "Critiquer ne signifie pas attaquer : il faut apprécier avec des raisons précises.",
        check: q("Que juge principalement la critique interne ?", "La cohérence et la pertinence de l’argumentation", "La vie privée de l’auteur", "La longueur de l’ouvrage", "La popularité de la thèse"),
        distractors: ["La critique externe résume seulement le texte.", "Toute critique doit rejeter la thèse.", "La critique interne mobilise uniquement des auteurs opposés."],
      },
      {
        id: "introduction-conclusion",
        title: "Encadrer le commentaire",
        summary: "Construire une introduction complète et une conclusion qui prend position après le débat.",
        conceptTitle: "Introduction et conclusion du commentaire",
        explanation: "L’introduction présente la problématique du texte et peut annoncer sa structure logique. La conclusion fait le bilan de la critique externe puis formule une position personnelle justifiée sur l’intérêt du texte.",
        keyPoint: "L’introduction ouvre le problème ; la conclusion répond après l’explication et la discussion.",
        example: "Conclusion sur Épictète : la décence renforce la crédibilité du philosophe, mais la valeur de sa pensée ne se réduit pas à son apparence.",
        mapTitle: "Le devoir complet",
        mapInstruction: "Visualise la place de chaque grande partie.",
        map: [
          { label: "Introduction", detail: "Thème, problème, thèse et structure logique." },
          { label: "Étude ordonnée", detail: "Explication progressive des mouvements." },
          { label: "Intérêt", detail: "Critiques interne puis externe." },
          { label: "Conclusion", detail: "Bilan du débat et position personnelle justifiée." },
        ],
        observation: "On ne peut conclure sérieusement qu’après avoir expliqué puis évalué le texte.",
        check: q("Que doit contenir la conclusion du commentaire ?", "Le bilan du débat et une position justifiée", "Un nouveau mouvement du texte", "Une simple copie de la thèse", "Une liste de tous les auteurs connus"),
        distractors: ["L’introduction contient déjà la critique externe.", "La conclusion n’a aucun lien avec l’intérêt du texte.", "Le commentaire se limite à une étude ordonnée."],
      },
    ],
    mission: {
      title: "Atelier BAC : Hountondji et la philosophie comme débat",
      scenario: "À partir de la situation officielle, reconstruis la problématique, la structure logique et l’intérêt philosophique d’un texte qui refuse de réduire la philosophie à un système clos.",
      problem: "La philosophie est-elle un savoir achevé ou un débat sans cesse repris ?",
      plan: [
        { label: "Problématique", detail: "Thème : définition de la philosophie ; thèse : elle est un débat ouvert et responsable." },
        { label: "Mouvement 1", detail: "Rejet de la philosophie comme ensemble de vérités définitives." },
        { label: "Mouvement 2", detail: "Définition positive comme recherche collective et discussion continue." },
        { label: "Discussion", detail: "Jaspers et Kant renforcent l’ouverture ; Hegel défend l’exigence d’un système." },
      ],
      modelAnswer: "Le texte progresse par opposition : il ferme d’abord la fausse piste du système achevé, puis montre que philosopher exige discussion, justification et responsabilité.",
      questions: [
        q("Quelle est la thèse de Hountondji ?", "La philosophie est un débat ouvert plutôt qu’un système clos", "La philosophie possède toutes les vérités définitives", "La philosophie interdit la discussion", "La vérité appartient à un seul penseur"),
        q("Quel découpage suit le raisonnement ?", "Rejet du système clos puis définition de la philosophie comme débat", "Biographie puis bibliographie", "Science puis religion", "Opinion puis absence de conclusion"),
        q("Quelle référence permet de nuancer la thèse ?", "Hegel : une philosophie scientifique doit être un système", "Jaspers : philosopher, c’est être en route", "Kant : on apprend à philosopher", "Socrate : reconnaître son ignorance"),
      ],
    },
  },
  {
    id: "terminale-philo-l3-knowledge-of-man",
    chapterNumber: 3,
    themeNumber: 2,
    themeTitle: "Les conditions de la liberté",
    title: "La connaissance de l’homme",
    description: "Comprendre l’être humain comme conscience et liberté, sans ignorer le poids de l’inconscient.",
    centralQuestion: "L’homme est-il toujours conscient, libre et responsable de ses actes ?",
    memorySentence: "L’homme est conscient et libre, mais l’inconscient révèle sa complexité sans supprimer toute responsabilité.",
    sections: [
      {
        id: "consciousness-memory",
        title: "Conscience et mémoire",
        summary: "Distinguer conscience psychologique, conscience morale et mémoire.",
        conceptTitle: "Ce qui permet à l’homme de se connaître et de juger",
        explanation: "La conscience psychologique permet de se connaître et de connaître le monde ; la conscience morale juge le bien et le mal. La mémoire conserve le passé et permet à la conscience d’éclairer l’action présente.",
        keyPoint: "La conscience connaît et juge ; la mémoire maintient l’unité de la personne dans le temps.",
        example: "Descartes fonde la certitude du sujet sur le cogito ; Rousseau présente la conscience morale comme juge du bien et du mal ; Bergson relie conscience et mémoire.",
        mapTitle: "Trois fonctions du sujet",
        mapInstruction: "Compare ce que chacune apporte à la connaissance de soi.",
        map: [
          { label: "Conscience psychologique", detail: "Savoir que l’on pense, agit et perçoit le monde." },
          { label: "Conscience morale", detail: "Évaluer ses actes comme bons ou mauvais." },
          { label: "Mémoire", detail: "Conserver et restituer les expériences qui donnent une continuité au moi." },
        ],
        observation: "Être conscient ne signifie pas seulement percevoir : c’est aussi pouvoir juger et se reconnaître dans son histoire.",
        check: q("Quel philosophe relie explicitement conscience et mémoire ?", "Henri Bergson", "Thomas Hobbes", "Karl Marx", "Auguste Comte"),
        distractors: ["La conscience morale sert uniquement à percevoir les objets.", "La mémoire détruit l’identité personnelle.", "La conscience ne joue aucun rôle dans le jugement."],
      },
      {
        id: "freedom",
        title: "La liberté humaine",
        summary: "Comprendre l’autodétermination et le lien entre choix conscient et responsabilité.",
        conceptTitle: "Agir par sa propre volonté",
        explanation: "La liberté est la capacité de s’autodéterminer plutôt que de subir une contrainte. Pour un sujet conscient, choisir implique d’assumer ses actes et d’exercer son jugement.",
        keyPoint: "La conscience de choisir fonde l’autonomie, mais rend également l’homme responsable.",
        example: "Bergson soutient que l’expérience de la conscience nous avertit de notre liberté.",
        mapTitle: "De la conscience à la responsabilité",
        mapInstruction: "Observe l’enchaînement logique.",
        map: [
          { label: "Délibérer", detail: "Comparer plusieurs possibilités d’action." },
          { label: "Choisir", detail: "Se déterminer selon une volonté consciente." },
          { label: "Assumer", detail: "Répondre des conséquences de l’acte choisi." },
        ],
        observation: "La liberté n’est pas l’absence de toute règle : elle suppose une décision que le sujet peut reconnaître comme sienne.",
        check: q("Pourquoi liberté et responsabilité sont-elles liées ?", "Parce qu’assumer un acte suppose qu’on puisse le reconnaître comme son choix", "Parce qu’un acte libre n’a aucune conséquence", "Parce que la liberté supprime la conscience", "Parce que choisir signifie obéir à toute contrainte"),
        distractors: ["Être libre signifie n’avoir aucune conséquence à assumer.", "La liberté exclut tout jugement moral.", "La conscience empêche l’autodétermination."],
      },
      {
        id: "unconscious",
        title: "La découverte de l’inconscient",
        summary: "Identifier les désirs refoulés et leurs manifestations dans les rêves, oublis ou conduites involontaires.",
        conceptTitle: "Une vie psychique qui échappe au moi",
        explanation: "Freud nomme inconscient l’instance dynamique où demeurent pulsions et désirs refoulés. Rêves, lapsus, phobies, oublis et agressivité montrent que la conscience ne maîtrise pas toute la vie psychique.",
        keyPoint: "L’inconscient limite la connaissance immédiate de soi : le moi n’est pas maître de toute sa vie psychique.",
        example: "Un lapsus peut révéler une intention ou un désir que le sujet n’avait pas consciemment décidé d’exprimer.",
        mapTitle: "Du refoulement à la manifestation",
        mapInstruction: "Suis le trajet d’un contenu psychique inconscient.",
        map: [
          { label: "Désir refoulé", detail: "Un contenu jugé inacceptable est écarté de la conscience." },
          { label: "Inconscient", detail: "Le contenu demeure actif sans être directement connu du sujet." },
          { label: "Manifestation", detail: "Rêve, lapsus, phobie ou agressivité en révèle indirectement l’existence." },
        ],
        observation: "L’inconscient n’est pas une simple absence de conscience : Freud lui attribue une activité propre.",
        check: q("Quel exemple constitue une manifestation possible de l’inconscient ?", "Un lapsus révélateur", "Une définition apprise", "Un calcul volontaire", "Une loi juridique"),
        distractors: ["L’inconscient est seulement ce que l’on n’a pas encore appris.", "Freud affirme que toute la vie psychique est consciente.", "Le refoulement supprime définitivement les désirs."],
      },
      {
        id: "determinism-responsibility",
        title: "Déterminisme et responsabilité",
        summary: "Confronter l’explication freudienne aux critiques d’Alain et de Sartre.",
        conceptTitle: "Sommes-nous encore responsables ?",
        explanation: "Si l’inconscient détermine une partie de nos actes, la maîtrise consciente paraît limitée. Pourtant Alain refuse d’en faire un animal caché et Sartre dénonce l’usage de l’inconscient comme alibi de mauvaise foi.",
        keyPoint: "Le déterminisme psychique limite la maîtrise de soi, mais ne suffit pas à abolir toute responsabilité.",
        example: "Paul Valéry résume la limite du moi : la conscience règne mais ne gouverne pas ; Sartre rappelle néanmoins que l’homme doit assumer ce qu’il fait.",
        mapTitle: "Un débat sur la responsabilité",
        mapInstruction: "Compare la thèse déterministe et sa contestation.",
        map: [
          { label: "Freud", detail: "Des forces inconscientes déterminent des conduites que le moi ne contrôle pas entièrement." },
          { label: "Conséquence", detail: "La liberté et la responsabilité semblent devenir partielles ou fragiles." },
          { label: "Alain et Sartre", detail: "Ils refusent que l’inconscient serve d’excuse générale et maintiennent l’exigence de responsabilité." },
        ],
        observation: "La bonne réponse évite les deux excès : nier l’inconscient ou excuser automatiquement toute conduite.",
        check: q("Quelle position est la plus nuancée ?", "L’inconscient influence l’homme sans supprimer nécessairement toute responsabilité", "L’inconscient n’existe jamais", "L’homme n’est responsable d’aucun acte", "La conscience contrôle absolument tout"),
        distractors: ["L’inconscient abolit toujours la responsabilité.", "Sartre utilise l’inconscient pour excuser les actes.", "Alain considère l’hypothèse freudienne comme indiscutable."],
      },
    ],
    mission: {
      title: "Sujet BAC : « L’inconscient abolit-il la responsabilité humaine ? »",
      scenario: "Analyse le sujet officiel en confrontant le déterminisme psychique à l’exigence de liberté et de responsabilité.",
      problem: "L’existence de forces psychiques inconscientes rend-elle impossible le fait de répondre de ses actes ?",
      plan: [
        { label: "Axe 1", detail: "Freud : l’inconscient produit des actes dont le sujet ne peut rendre pleinement compte." },
        { label: "Limite", detail: "La conscience ne gouverne donc pas absolument la vie psychique." },
        { label: "Axe 2", detail: "Alain et Sartre : l’inconscient ne doit pas devenir un alibi qui annule la responsabilité." },
        { label: "Réponse", detail: "Reconnaître l’influence sans confondre détermination partielle et abolition totale." },
      ],
      modelAnswer: "L’inconscient complique l’attribution de responsabilité, mais il ne l’abolit pas automatiquement : le sujet peut reconnaître ses déterminations et travailler à les maîtriser.",
      questions: [
        q("Quel problème le sujet pose-t-il ?", "L’inconscient rend-il illusoire le fait d’assumer ses actes ?", "La mémoire est-elle une science ?", "La société précède-t-elle l’État ?", "Le progrès supprime-t-il le travail ?"),
        q("Quel auteur soutient que l’inconscient peut devenir un alibi de mauvaise foi ?", "Jean-Paul Sartre", "Sigmund Freud", "Henri Bergson", "Aristote"),
        q("Quelle synthèse est défendable ?", "L’inconscient limite la maîtrise consciente sans excuser nécessairement tous les actes", "Tout acte est totalement involontaire", "L’inconscient n’a aucun effet", "La responsabilité suppose de nier la psychologie"),
      ],
    },
  },
  {
    id: "terminale-philo-l4-social-life",
    chapterNumber: 4,
    themeNumber: 2,
    themeTitle: "Les conditions de la liberté",
    title: "La vie en société",
    description: "Étudier la sociabilité, le rôle d’autrui, l’État, la nation et la violence qui traverse les relations sociales.",
    centralQuestion: "La vie en société garantit-elle la liberté ou menace-t-elle l’individu ?",
    memorySentence: "Autrui humanise et l’État protège, mais les relations sociales et le pouvoir peuvent aussi devenir violents.",
    sections: [
      {
        id: "social-human",
        title: "L’homme, être social",
        summary: "Comparer la sociabilité naturelle d’Aristote au contrat social de Hobbes, Locke et Rousseau.",
        conceptTitle: "Nature ou convention ?",
        explanation: "Pour Aristote, l’homme est naturellement un animal politique et la cité accomplit sa nature. Pour les théoriciens du contrat, la société organisée résulte plutôt d’un accord destiné à sortir d’une condition initiale dangereuse ou incertaine.",
        keyPoint: "La société peut être pensée comme naturelle ou construite, mais l’existence humaine se développe toujours avec les autres.",
        example: "Même si Hobbes conteste une sociabilité spontanée, son contrat montre pourquoi les individus choisissent une organisation commune.",
        mapTitle: "Deux origines possibles",
        mapInstruction: "Compare les thèses avant de dégager leur point commun.",
        map: [
          { label: "Aristote", detail: "La cité appartient aux choses naturelles et l’homme est social par nature." },
          { label: "Contractualistes", detail: "Les hommes instituent la société par un accord qui protège leurs intérêts et leurs droits." },
          { label: "Point commun", detail: "L’individu isolé ne suffit pas à réaliser toutes les possibilités humaines." },
        ],
        observation: "Le désaccord porte sur l’origine, non sur l’importance concrète de la vie commune.",
        check: q("Quelle thèse Aristote défend-il ?", "L’homme est par nature un animal politique", "La société est toujours un accident", "L’État doit disparaître", "La nation se réduit au territoire"),
        distractors: ["Tous les philosophes expliquent la société par un contrat.", "L’homme se réalise entièrement dans l’isolement.", "La sociabilité naturelle et le contrat sont identiques."],
      },
      {
        id: "others",
        title: "Le rôle d’autrui",
        summary: "Comprendre comment le prochain révèle la conscience de soi et rend possible l’humanisation.",
        conceptTitle: "Se construire par la relation",
        explanation: "Autrui est mon semblable et une autre conscience. Sartre souligne que je passe par l’autre pour obtenir une vérité sur moi ; Malson montre que l’enfant privé du milieu social ne développe pas pleinement son humanité.",
        keyPoint: "Autrui peut me limiter par son regard, mais il est aussi indispensable à la connaissance de soi et à l’humanisation.",
        example: "Le regard d’un camarade peut me gêner, mais ses remarques me révèlent aussi une facette de moi que je ne percevais pas.",
        mapTitle: "Une relation ambivalente",
        mapInstruction: "Observe les deux effets possibles de la présence d’autrui.",
        map: [
          { label: "Révélation", detail: "Autrui me renvoie une image de moi et contribue à ma conscience de soi." },
          { label: "Humanisation", detail: "Langage, normes et coopération se développent dans la relation sociale." },
          { label: "Conflit", detail: "Son regard ou ses intérêts peuvent aussi limiter mes possibilités." },
        ],
        observation: "Autrui n’est ni absolument bienfaisant ni absolument hostile.",
        check: q("Pourquoi autrui est-il indispensable selon Malson ?", "Parce que l’humanisation dépend du milieu social", "Parce qu’il supprime toute liberté", "Parce qu’il remplace l’État", "Parce qu’il rend la mémoire inutile"),
        distractors: ["Autrui est toujours mon ennemi.", "La relation sociale empêche toute connaissance de soi.", "L’humanité se développe sans aucun apprentissage social."],
      },
      {
        id: "state-nation",
        title: "État, droit et nation",
        summary: "Distinguer l’organisation politique de l’unité historique et spirituelle d’un peuple.",
        conceptTitle: "Organiser et unir la société",
        explanation: "L’État exerce une autorité juridique et politique sur un territoire ; par le droit et la justice, il doit protéger sécurité et liberté. La nation repose aussi sur des souvenirs partagés et la volonté actuelle de continuer à vivre ensemble.",
        keyPoint: "L’État organise par les institutions ; la nation unit par une histoire, une conscience et un projet communs.",
        example: "Spinoza fait de la liberté la fin de l’État ; Renan décrit la nation comme un héritage partagé et un consentement présent.",
        mapTitle: "De la règle à l’unité",
        mapInstruction: "Distingue les concepts et leurs fonctions.",
        map: [
          { label: "État", detail: "Institutions politiques, administratives et juridiques exerçant l’autorité." },
          { label: "Droit et justice", detail: "Règles et institutions destinées à garantir les droits et réparer les torts." },
          { label: "Nation", detail: "Mémoire commune, liens objectifs et volonté de poursuivre une vie collective." },
        ],
        observation: "Un État peut comprendre plusieurs nations, et une nation peut exister au-delà d’un seul État.",
        check: q("Quelle formule résume la nation selon Renan ?", "Un héritage commun et le désir actuel de vivre ensemble", "Une administration sans mémoire", "Un territoire sans population", "Une autorité sans consentement"),
        distractors: ["État et nation sont toujours exactement identiques.", "Le droit a pour but de supprimer toute liberté.", "La nation dépend seulement de la géographie."],
      },
      {
        id: "social-violence",
        title: "La violence sociale",
        summary: "Analyser les conflits avec autrui et la violence légitime ou abusive de l’État.",
        conceptTitle: "Protéger sans opprimer",
        explanation: "Les intérêts, le désir de domination et l’agressivité rendent les relations sociales conflictuelles. L’État utilise une contrainte légale pour protéger les citoyens, mais ce pouvoir peut devenir arbitraire et aliéner ceux qu’il devait servir.",
        keyPoint: "La force publique n’est légitime que si elle est réglée par le droit et orientée vers la liberté et la justice.",
        example: "Une sanction judiciaire respecte une procédure commune ; une violence arbitraire détourne la puissance de l’État de sa finalité.",
        mapTitle: "Quand la force devient-elle légitime ?",
        mapInstruction: "Compare conflit privé, contrainte légale et oppression.",
        map: [
          { label: "Conflit", detail: "Les individus peuvent se nuire en poursuivant leurs intérêts." },
          { label: "Contrainte légale", detail: "L’État limite certains actes afin de protéger les droits de tous." },
          { label: "Abus de pouvoir", detail: "La force devient oppression lorsqu’elle n’obéit plus au droit ni à l’intérêt commun." },
        ],
        observation: "Une loi n’est pas juste par le seul fait qu’elle existe ; elle doit pouvoir être évaluée au regard des droits.",
        check: q("À quelle condition la contrainte de l’État peut-elle être légitime ?", "Lorsqu’elle est réglée par le droit et protège les libertés", "Lorsqu’elle sert les intérêts d’un seul groupe", "Lorsqu’elle échappe à toute règle", "Lorsqu’elle interdit toute critique"),
        distractors: ["Toute violence de l’État est automatiquement juste.", "Les relations sociales sont toujours pacifiques.", "La justice consiste à obéir à la force la plus grande."],
      },
    ],
    mission: {
      title: "Sujet BAC : « Autrui est-il absolument mon ennemi ? »",
      scenario: "Traite la situation officielle en examinant le conflit possible avec autrui puis son rôle indispensable dans la construction de soi.",
      problem: "Mon semblable est-il nécessairement nuisible ?",
      plan: [
        { label: "Axe 1", detail: "Le regard, l’égoïsme et l’agressivité d’autrui peuvent aliéner ou menacer." },
        { label: "Références", detail: "Sartre, Nietzsche et Freud éclairent le conflit et la violence." },
        { label: "Axe 2", detail: "Aristote, Malson et Saint-Exupéry montrent la sociabilité et l’enrichissement mutuel." },
        { label: "Réponse", detail: "Autrui peut être rival, mais il n’est pas absolument ennemi puisqu’il conditionne mon humanité." },
      ],
      modelAnswer: "Autrui devient parfois un adversaire par le conflit des intérêts, mais sa présence est indispensable à la conscience de soi, à l’éducation et à la coopération.",
      questions: [
        q("Que signifie « absolument » dans le sujet ?", "Nécessairement et dans tous les cas", "Parfois seulement", "Juridiquement", "Naturellement heureux"),
        q("Quelle référence défend le rôle positif d’autrui ?", "Malson : l’homme ne devient humain que dans le milieu social", "Sartre : l’enfer, c’est les autres", "Freud : l’agressivité appartient à l’homme", "Nietzsche : vivre implique de violenter"),
        q("Quelle réponse évite le faux choix ?", "Autrui peut être conflictuel tout en restant indispensable à mon humanisation", "Autrui est toujours ennemi", "Autrui est toujours bienveillant", "La relation à autrui ne concerne pas la liberté"),
      ],
    },
  },
  {
    id: "terminale-philo-l5-god-religion",
    chapterNumber: 5,
    themeNumber: 2,
    themeTitle: "Les conditions de la liberté",
    title: "Dieu et la religion",
    description: "Comprendre la croyance en Dieu, les fonctions sociales et morales de la religion, ainsi que ses rapports ambivalents à la liberté.",
    centralQuestion: "La religion libère-t-elle l’homme ou l’aliène-t-elle ?",
    memorySentence: "La religion peut donner sens, cohésion et morale, mais elle devient aliénante lorsqu’elle soumet la raison et la liberté.",
    sections: [
      {
        id: "god-sacred",
        title: "Dieu et le sacré",
        summary: "Définir Dieu comme fondement de la religion et distinguer sacré et profane.",
        conceptTitle: "Le principe supérieur de la croyance",
        explanation: "Dieu désigne l’être suprême, absolu et sacré auquel la foi attribue la création ou le sens ultime du monde. La religion organise les croyances et rites qui relient une communauté à ce sacré.",
        keyPoint: "Dieu est l’objet central de la foi ; la religion est l’ensemble organisé de croyances, rites et obligations liés au sacré.",
        example: "Un rite n’est pas un simple geste habituel : pour le croyant, il met en relation le monde profane et une réalité sacrée.",
        mapTitle: "Du sacré à la pratique",
        mapInstruction: "Distingue les notions essentielles.",
        map: [
          { label: "Dieu", detail: "Être suprême ou principe absolu reconnu par la croyance." },
          { label: "Sacré", detail: "Ce qui est séparé du profane et reçoit une valeur religieuse particulière." },
          { label: "Religion", detail: "Croyances, rites et règles qui unissent les fidèles au sacré et entre eux." },
        ],
        observation: "Définir la religion uniquement comme croyance individuelle ferait oublier sa dimension collective et pratique.",
        check: q("Que comprend une religion au-delà de la foi personnelle ?", "Des rites, des règles et une communauté liés au sacré", "Uniquement une théorie scientifique", "Seulement des émotions privées", "Une absence totale d’obligations"),
        distractors: ["Dieu et religion sont strictement synonymes.", "Le sacré ne se distingue jamais du profane.", "Toute religion est dépourvue de pratiques collectives."],
      },
      {
        id: "criticism-god",
        title: "Les critiques de Dieu",
        summary: "Comprendre les objections qui voient dans l’idée de Dieu une projection ou une aliénation.",
        conceptTitle: "Quand la croyance est mise en question",
        explanation: "La raison ne peut pas vérifier Dieu comme un fait observable. Feuerbach interprète Dieu comme projection des qualités humaines ; Marx critique une religion qui console de la misère au lieu d’en supprimer les causes.",
        keyPoint: "La critique ne réfute pas seulement une croyance : elle demande si l’homme transfère à Dieu sa propre puissance et sa liberté.",
        example: "Qualifier la religion d’« opium du peuple » signifie qu’elle peut apaiser la souffrance tout en détournant de la transformation sociale.",
        mapTitle: "La logique de l’aliénation",
        mapInstruction: "Suis le transfert dénoncé par les critiques.",
        map: [
          { label: "Projection", detail: "L’homme attribue à Dieu des qualités idéales qu’il possède ou désire." },
          { label: "Soumission", detail: "Il traite ensuite cette création comme une puissance extérieure supérieure." },
          { label: "Aliénation", detail: "Il perd la maîtrise de sa raison ou de son action au profit de cette puissance." },
        ],
        observation: "La critique de la religion porte ici sur ses effets humains et politiques, pas seulement sur la preuve de Dieu.",
        check: q("Que signifie l’aliénation religieuse chez Feuerbach ?", "L’homme projette ses qualités en Dieu puis se soumet à cette projection", "La religion augmente toujours la liberté", "Dieu est une expérience scientifique", "Le rite remplace toute société"),
        distractors: ["Marx voit dans la religion une transformation politique immédiate.", "Critiquer la religion consiste seulement à interdire les rites.", "La projection rend l’homme plus autonome."],
      },
      {
        id: "roles-religion",
        title: "Les fonctions de la religion",
        summary: "Étudier la cohésion sociale, la consolation existentielle et l’éducation morale.",
        conceptTitle: "Relier, rassurer et moraliser",
        explanation: "La religion unit les fidèles par des croyances et rites communs, donne une réponse à l’angoisse de la mort et propose des règles morales. Durkheim insiste sur la cohésion sociale ; Bergson sur la réponse religieuse à la peur de la mort.",
        keyPoint: "La religion peut soutenir l’individu psychologiquement et la société moralement, sans que ces fonctions prouvent à elles seules la vérité de ses croyances.",
        example: "Une cérémonie collective console une famille tout en renforçant les liens et les obligations d’entraide du groupe.",
        mapTitle: "Trois fonctions concrètes",
        mapInstruction: "Compare les effets individuels et collectifs.",
        map: [
          { label: "Psychologique", detail: "Apaiser l’angoisse et donner une espérance face à la souffrance ou la mort." },
          { label: "Sociale", detail: "Créer une appartenance et des pratiques communes." },
          { label: "Morale", detail: "Encourager des devoirs, vertus et conduites jugées bonnes." },
        ],
        observation: "Une fonction utile ne suffit pas à établir la vérité philosophique d’une croyance, mais elle explique sa force humaine.",
        check: q("Quelle fonction Bergson associe-t-il à la religion ?", "Opposer à la mort l’image d’une continuation de la vie", "Supprimer toute morale", "Prouver Dieu expérimentalement", "Isoler tous les croyants"),
        distractors: ["La religion ne joue aucun rôle social.", "La cohésion prouve automatiquement toute croyance.", "La religion augmente nécessairement les conflits."],
      },
      {
        id: "religion-freedom",
        title: "Religion et liberté",
        summary: "Distinguer obligation morale libre, soumission aveugle et fanatisme.",
        conceptTitle: "Croire sans renoncer à soi",
        explanation: "La foi peut orienter librement une conduite morale et donner un sens à l’existence. Elle devient cependant aliénante lorsqu’une autorité interdit l’examen rationnel, impose la peur ou justifie le fanatisme et la violence.",
        keyPoint: "La pratique religieuse est compatible avec la liberté lorsqu’elle engage la conscience plutôt qu’une obéissance aveugle.",
        example: "Respecter une règle par conviction réfléchie n’a pas le même sens que l’appliquer sous la menace ou contre la dignité d’autrui.",
        mapTitle: "De l’obligation à l’aliénation",
        mapInstruction: "Repère le critère qui fait changer la valeur de la pratique.",
        map: [
          { label: "Foi réfléchie", detail: "Le sujet comprend et assume librement son engagement." },
          { label: "Obligation morale", detail: "La règle oriente l’action vers le respect d’autrui et la maîtrise de soi." },
          { label: "Fanatisme", detail: "La croyance refuse toute critique et peut justifier domination ou violence." },
        ],
        observation: "Le problème n’est pas seulement d’obéir, mais de savoir si l’obligation peut être reconnue par une conscience libre.",
        check: q("Quand une pratique religieuse menace-t-elle clairement la liberté ?", "Lorsqu’elle impose une obéissance aveugle et justifie la violence", "Lorsqu’elle invite à réfléchir", "Lorsqu’elle soutient l’entraide", "Lorsqu’elle respecte la dignité"),
        distractors: ["Toute obligation morale est une aliénation.", "La foi exclut nécessairement la réflexion.", "Le fanatisme garantit la liberté de conscience."],
      },
    ],
    mission: {
      title: "Sujet BAC : « Doit-on redouter la croyance religieuse ? »",
      scenario: "Traite la situation officielle en confrontant les risques d’aliénation et de fanatisme aux fonctions morales, sociales et existentielles de la religion.",
      problem: "Quel regard faut-il porter sur la foi religieuse et ses effets sur l’homme ?",
      plan: [
        { label: "Axe 1", detail: "Feuerbach et Marx : la religion peut aliéner la liberté et détourner de l’action." },
        { label: "Risque", detail: "Une croyance fermée à la critique peut nourrir le fanatisme et la violence." },
        { label: "Axe 2", detail: "Bergson, Proudhon ou Hegel : elle apaise, moralise et renforce les liens sociaux." },
        { label: "Réponse", detail: "Il faut redouter ses dérives, non condamner indistinctement toute croyance réfléchie." },
      ],
      modelAnswer: "La croyance mérite une vigilance critique lorsqu’elle aliène ou rend violent ; mais vécue dans le respect de la raison et d’autrui, elle peut donner sens, cohésion et exigence morale.",
      questions: [
        q("Quel problème le sujet pose-t-il ?", "La croyance religieuse est-elle nuisible ou peut-elle édifier l’homme ?", "Dieu est-il un objet mathématique ?", "La nation est-elle un rite ?", "La mémoire est-elle sacrée ?"),
        q("Quelle référence soutient la fonction consolatrice ?", "Bergson : la religion oppose à la mort l’image d’une continuation", "Marx : la religion est l’opium du peuple", "Feuerbach : Dieu est une aliénation", "Sartre : l’enfer, c’est les autres"),
        q("Quelle conclusion est la plus équilibrée ?", "Craindre les dérives aliénantes sans nier les fonctions morales et existentielles de la foi", "Condamner toute religion sans distinction", "Accepter toute croyance sans examen", "Éviter toute position argumentée"),
      ],
    },
  },
];

export const terminalPhilosophyPaths = courses.map(createPhilosophyPath);
