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
    presentation: "continuous-course",
    chapterNumber: 1,
    themeNumber: 1,
    themeTitle: "La méthodologie",
    title: "La dissertation philosophique",
    description: "Comprendre un sujet, en dégager le problème, puis construire une introduction, une argumentation et une conclusion.",
    centralQuestion: "Comment passer d’un sujet donné à une copie argumentée qui résout un problème ?",
    memorySentence: "Étudier les mots, reformuler, problématiser, argumenter avec des références, puis conclure.",
    overviewBodyMarkdown: String.raw`## La dissertation, du sujet à la réponse

La dissertation philosophique n’est ni une récitation de cours ni une suite d’opinions. Elle part d’un **sujet**, en fait apparaître une **difficulté centrale**, puis construit une réponse argumentée.

| Au brouillon | Dans la copie |
|---|---|
| Étudier les termes essentiels | Rédiger une introduction qui fait apparaître le problème |
| Reformuler sans changer le sens | Développer des axes soutenus par des arguments et des références |
| Formuler le problème et ses aspects | Conclure par un bilan et une réponse claire |

## Le fil directeur

1. **Étude parcellaire** : définir les mots importants selon le contexte.
2. **Reformulation** : expliciter le sujet sans le trahir.
3. **Problématisation** : faire apparaître la tension, puis les aspects.
4. **Introduction** : amorce, problème, aspects.
5. **Développement** : axes, arguments, références et transitions.
6. **Conclusion** : bilan, réponse et, si elle est pertinente, ouverture.

> **Principe essentiel.** Chaque étape prépare la suivante. Si la reformulation déforme le sujet, le problème, le plan et la conclusion seront eux aussi hors sujet.`,
    overviewActivities: [
      {
        id: "dissertation-complete-sequence",
        kind: "ordering",
        title: "Reconstruis le chemin complet d’une dissertation",
        instruction: "Les six opérations sont mélangées. Replace-les dans l’ordre logique à l’aide des flèches.",
        sourceLabel: "Pages 1–2 · synthèse du cours",
        items: [
          { id: "conclusion", label: "Conclusion", detail: "Faire le bilan et répondre clairement au problème." },
          { id: "study", label: "Étude parcellaire", detail: "Définir les mots et expressions essentiels selon le contexte." },
          { id: "development", label: "Développement", detail: "Défendre les axes par des arguments, références et transitions." },
          { id: "problematisation", label: "Problématisation", detail: "Dégager la difficulté centrale et les aspects qu’elle soulève." },
          { id: "reformulation", label: "Reformulation", detail: "Réécrire le sujet plus explicitement sans en altérer le sens." },
          { id: "introduction", label: "Introduction", detail: "Enchaîner amorce, problème et aspects dans un même mouvement." },
        ],
        correctOrder: ["study", "reformulation", "problematisation", "introduction", "development", "conclusion"],
        explanation: "Le brouillon sécurise le sens avant la rédaction : comprendre, problématiser, introduire, argumenter, puis répondre.",
      },
    ],
    overviewSource: {
      documentTitle: "Tle Philosophie — Leçon 1 : La dissertation philosophique",
      pages: "1–2",
      section: "Présentation et architecture générale",
      fidelity: "faithful-corrected",
      corrections: ["La situation d’apprentissage de la page 1 est volontairement ignorée conformément au format du cours continu."],
    },
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

- « L’essor de la technique doit-il susciter la crainte ? » — conserve une orientation négative, mais remplace **condamner** par **craindre** ;
- « A-t-on des raisons de se féliciter des prouesses de la technique ? » — **inverse** le sens ;
- « Est-il nécessaire de craindre les avancées réalisées par l’ensemble des procédés scientifiques employés dans l’investigation et la transformation de la nature ? » — explicite mieux **la technique**, mais remplace encore **condamner** par **craindre**.

> **Proposition pédagogique Excellence.** La page 4 ne donne pas de corrigé séparé pour cette activité. La reformulation la plus strictement fidèle reste celle du premier corrigé : **« Faut-il blâmer les avancées réalisées par la technique ? »**`,
        courseActivities: [
          {
            id: "technical-progress-context-sort",
            kind: "categorize",
            title: "Définition, reformulation fidèle ou déplacement du sujet ?",
            instruction: "Classe chaque formulation selon sa fonction. Lis ensuite la justification : les nuances de vocabulaire comptent.",
            sourceLabel: "Pages 1 et 4 · activité 3 — analyse pédagogique Excellence",
            groups: [
              { id: "definition", label: "Définition contextuelle", description: "Explique un terme du sujet." },
              { id: "faithful", label: "Reformulation fidèle", description: "Explicite l’ensemble sans orienter la réponse." },
              { id: "shift", label: "Déplacement ou inversion", description: "Change la question initiale." },
            ],
            items: [
              { id: "must", label: "« Doit-on » : a-t-on le droit, est-il normal, faut-il…", correctGroupId: "definition", explanation: "Cette expression précise la modalité normative du sujet." },
              { id: "condemn", label: "« Condamner » : blâmer, rejeter, désapprouver.", correctGroupId: "definition", explanation: "Le sens moral est retenu ici, pas le sens judiciaire." },
              { id: "progress", label: "« Progrès technique » : avancées et exploits réalisés par la technique.", correctGroupId: "definition", explanation: "La définition dépend du contexte précis du sujet." },
              { id: "faithful-rewrite", label: "« Faut-il blâmer les avancées réalisées par la technique ? »", correctGroupId: "faithful", explanation: "Chaque terme est remplacé par une expression équivalente, sans réponse anticipée." },
              { id: "fear-rewrite", label: "« L’essor de la technique doit-il susciter la crainte ? »", correctGroupId: "shift", explanation: "Craindre une conséquence n’est pas exactement condamner moralement un progrès." },
              { id: "celebrate-rewrite", label: "« A-t-on des raisons de se féliciter des prouesses de la technique ? »", correctGroupId: "shift", explanation: "La formulation inverse l’orientation du verbe « condamner »." },
            ],
          },
        ],
        source: {
          documentTitle: "Tle Philosophie — Leçon 1 : La dissertation philosophique",
          pages: "1 et 4",
          section: "Compréhension du sujet et activités d’application 1 à 3",
          fidelity: "faithful-corrected",
          corrections: [
            "L’activité 2 ne comporte pas de corrigé imprimé.",
            "L’activité 3 ne fournit pas de corrigé séparé ; son analyse interactive est explicitement présentée comme une proposition pédagogique Excellence.",
          ],
        },
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
        courseActivities: [
          {
            id: "technical-progress-problem-builder",
            kind: "guided-writing",
            title: "Fais apparaître la tension du sujet",
            instruction: "À partir de « Doit-on condamner le progrès technique ? », écris le problème puis deux aspects réellement opposés.",
            sourceLabel: "Pages 1, 2 et 4 · problématisation du progrès technique",
            prompts: [
              {
                id: "problem",
                label: "Le problème central",
                hint: "Ne recopie pas le sujet : révèle la difficulté.",
                placeholder: "Exemple de départ : La technique est-elle… ?",
                rows: 3,
              },
              {
                id: "aspect-one",
                label: "Aspect 1",
                hint: "Interroge les bienfaits ou la puissance de la technique.",
                placeholder: "En quoi le progrès technique… ?",
                rows: 3,
              },
              {
                id: "aspect-two",
                label: "Aspect 2",
                hint: "Fais apparaître la thèse opposée avec une charnière.",
                placeholder: "Toutefois, le progrès technique ne… ?",
                rows: 3,
              },
            ],
            criteria: [
              { id: "central-difficulty", label: "J’ai formulé une difficulté centrale", hint: "Le problème dépasse le simple recopiage du sujet." },
              { id: "two-sides", label: "Mes deux aspects s’opposent réellement", hint: "L’un ouvre la défense, l’autre l’objection." },
              { id: "question-form", label: "Mes aspects sont des questions", hint: "Ils annoncent les axes sans donner déjà la conclusion." },
              { id: "same-topic", label: "Je reste fidèle au progrès technique", hint: "Je n’ai pas remplacé le sujet par une autre question." },
            ],
            modelTitle: "Une problématisation cohérente",
            modelMarkdown: String.raw`**Problème :** La technique est-elle nuisible ?

**Aspect 1 :** En quoi le progrès technique est-il un facteur de développement ?

**Aspect 2 :** Toutefois, le progrès technique ne suscite-t-il pas des inquiétudes ?

Les pages 2 et 4 inversent l’ordre de ces deux aspects. Les deux ordres sont recevables si l’introduction et le développement restent cohérents du début à la fin.`,
          },
        ],
        source: {
          documentTitle: "Tle Philosophie — Leçon 1 : La dissertation philosophique",
          pages: "1–4",
          section: "Problématisation et applications sur le progrès technique et la vie en société",
          fidelity: "faithful-corrected",
          corrections: ["Les pages 2 et 4 présentent les deux aspects du progrès technique dans un ordre inverse ; aucun ordre unique n’est imposé si la copie reste cohérente."],
        },
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
        courseActivities: [
          {
            id: "technical-progress-introduction-order",
            kind: "ordering",
            title: "Remets l’introduction modèle dans l’ordre",
            instruction: "Déplace les quatre fragments pour reconstruire le mouvement du paragraphe, de l’entrée dans le sujet jusqu’aux aspects.",
            sourceLabel: "Page 2 · activité d’application corrigée",
            items: [
              { id: "aspects", label: "Les aspects", detail: "« Dans quelle mesure la puissance technique constitue-t-elle une menace ? N’est-elle pas au contraire un facteur de développement ? »" },
              { id: "amorce", label: "L’amorce", detail: "« L’expérience quotidienne nous révèle le progrès vertigineux des sciences et techniques… »" },
              { id: "problem", label: "Le problème", detail: "« Dès lors, doit-on souscrire à l’idée selon laquelle la technique est nuisible ? »" },
              { id: "hinge", label: "La charnière", detail: "« Malheureusement, cette évolution de la technoscience s’accompagne souvent d’une réelle menace… »" },
            ],
            correctOrder: ["amorce", "hinge", "problem", "aspects"],
            explanation: "L’amorce installe le thème, la charnière révèle la difficulté, le problème la formule et les aspects ouvrent les axes.",
          },
          {
            id: "technical-progress-introduction-draft",
            kind: "guided-writing",
            title: "Rédige ta propre introduction",
            instruction: "Écris un seul paragraphe pour le sujet « Doit-on condamner le progrès technique ? », puis compare sa structure au modèle.",
            sourceLabel: "Page 2 · corrigé de l’activité d’application",
            prompts: [
              {
                id: "introduction",
                label: "Mon introduction complète",
                hint: "Amorce concrète → charnière → problème → deux aspects interrogatifs.",
                placeholder: "Pars d’un constat précis sur la technique, fais apparaître la difficulté, puis pose le problème et ses deux aspects…",
                rows: 8,
              },
            ],
            criteria: [
              { id: "grounded-opening", label: "Mon amorce est concrète", hint: "Elle entre dans le sujet sans formule vague du type « depuis la nuit des temps »." },
              { id: "hinge", label: "Une charnière fait apparaître la difficulté", hint: "Par exemple : pourtant, cependant, malheureusement." },
              { id: "problem", label: "Le problème est explicitement posé", hint: "Le correcteur comprend immédiatement la tension." },
              { id: "aspects", label: "Deux aspects opposés terminent le paragraphe", hint: "Ils sont formulés comme des questions, pas comme un sommaire." },
            ],
            modelTitle: "Introduction modèle annotée",
            modelMarkdown: String.raw`**Amorce.** L’expérience quotidienne nous révèle le progrès vertigineux des sciences et techniques dans presque toutes les sphères de la vie. Et cela semble confirmer l’idée selon laquelle l’avenir appartient à la science et à la technique.

**Charnière et problème.** Malheureusement, cette évolution de la technoscience s’accompagne souvent d’une réelle menace pour l’humanité entière. Dès lors, doit-on souscrire à l’idée selon laquelle la technique est nuisible ?

**Aspects.** Dans quelle mesure la puissance technique constitue-t-elle une menace ? N’est-elle pas au contraire un facteur de développement ?`,
          },
        ],
        source: {
          documentTitle: "Tle Philosophie — Leçon 1 : La dissertation philosophique",
          pages: "2",
          section: "Introduction et activité d’application corrigée",
          fidelity: "faithful",
          corrections: [],
        },
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
        courseActivities: [
          {
            id: "development-conclusion-sort",
            kind: "categorize",
            title: "Que faut-il placer dans le développement et dans la conclusion ?",
            instruction: "Classe chaque élément. La troisième catégorie repère ce qui affaiblit une copie.",
            sourceLabel: "Pages 2–3 · développement corrigé sur la vie en société",
            groups: [
              { id: "development", label: "Développement", description: "Résout le problème par des axes argumentés." },
              { id: "conclusion", label: "Conclusion", description: "Ferme le problème sans relancer le devoir." },
              { id: "mistake", label: "Erreur de méthode", description: "Élément à éviter ou à corriger." },
            ],
            items: [
              { id: "axis", label: "Une thèse partielle qui répond à un aspect du problème.", correctGroupId: "development", explanation: "C’est l’axe : il structure une partie entière." },
              { id: "argument", label: "Une raison précise qui justifie l’axe.", correctGroupId: "development", explanation: "L’argument explique pourquoi la thèse tient." },
              { id: "reference", label: "Une référence expliquée et reliée à l’argument.", correctGroupId: "development", explanation: "La citation sert le raisonnement ; elle ne le remplace pas." },
              { id: "transition", label: "Un passage logique vers l’argument ou l’axe suivant.", correctGroupId: "development", explanation: "La transition empêche la simple juxtaposition." },
              { id: "summary", label: "Un bref bilan du chemin parcouru.", correctGroupId: "conclusion", explanation: "Le bilan prépare la réponse finale." },
              { id: "answer", label: "Une réponse claire au problème posé en introduction.", correctGroupId: "conclusion", explanation: "C’est l’élément obligatoire de la conclusion." },
              { id: "opening", label: "Une question voisine, seulement si elle prolonge réellement la réflexion.", correctGroupId: "conclusion", explanation: "L’ouverture est possible, mais jamais obligatoire." },
              { id: "new-argument", label: "Un nouvel argument important qui n’a jamais été développé.", correctGroupId: "mistake", explanation: "La conclusion ne doit pas introduire une preuve nouvelle." },
              { id: "floating-quote", label: "Une citation célèbre posée sans expliquer ce qu’elle prouve.", correctGroupId: "mistake", explanation: "Une référence plaquée ne remplace pas l’argument." },
            ],
          },
        ],
        source: {
          documentTitle: "Tle Philosophie — Leçon 1 : La dissertation philosophique",
          pages: "2–3",
          section: "Développement, conclusion et évaluation sur la vie en société",
          fidelity: "faithful",
          corrections: [],
        },
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

> **Formulation du document :** L’égalité entre les hommes est-elle une illusion ?

Cette formulation déplace légèrement le sujet vers l’égalité. Pour rester au plus près de la question posée, on peut aussi écrire :

> **Formulation directe proposée par Excellence :** La diversité culturelle empêche-t-elle l’unité entre les peuples ?

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

> **Ce que ce corrigé enseigne.** L’axe 1 n’est pas une erreur qu’on corrige ensuite : c’est une thèse **sérieusement défendue**, avec ses auteurs. La force d’une dissertation vient de ce que l’on donne à l’adversaire ses meilleures armes avant de lui répondre.

---

## Deuxième dossier corrigé — « Le travail humanise-t-il ? »

### I. Définition des termes essentiels

| Terme | Définition dans le sujet |
|---|---|
| **Travail** | activité consciente de transformation de la nature et de l’homme, et activité de production de biens utiles |
| **Humanise** | rend humain, confère dignité et valeur, soustrait l’homme à certaines tendances primaires |

### II. Problème à analyser

> Le travail, activité consciente de production de biens utiles, soustrait-il l’homme à l’animalité ?

### III. Axes et références possibles

#### Axe 1 — Le travail est un facteur d’humanisation

**Argument 1.** Parce qu’il est une activité consciente, le travail transforme la nature et permet à l’être humain de développer ses propres facultés.

> **Karl MARX**, *Le Capital* : « En même temps qu’il agit par ce mouvement sur la nature extérieure et la modifie, il modifie sa propre nature et développe les facultés qui y sommeillent. »

**Argument 2.** Le travail produit les biens nécessaires, satisfait les besoins et éloigne l’être humain de l’oisiveté.

> **VOLTAIRE**, *Candide* : « Le travail éloigne de nous trois grands maux : l’ennui, le vice et le besoin. »

#### Axe 2 — Dans certaines formes, le travail aliène et déshumanise

**Argument 1.** Le machinisme et la division du travail peuvent réduire le travailleur à une fonction et lui faire perdre sa dignité.

> **Karl MARX**, *Manuscrits de 1844* : « Le travail produit l’ouvrier en tant que marchandise. »

**Argument 2.** Le travail peut être pénible et dégrader le corps aussi bien que l’esprit.

> **PLATON**, *La République* : « Tout ce qui est artisanal et manœuvrier porte honte et déforme l’âme en même temps que le corps. »

#### Synthèse possible — Le travail reste une activité majeure de formation

Malgré ses formes aliénantes, le travail peut socialiser l’individu et le former physiquement, intellectuellement et moralement. Cette troisième partie est une **possibilité de synthèse**, non une obligation mécanique.

> **Emmanuel MOUNIER**, *Le Personnalisme* : « Tout travail travaille à faire l’homme. »`,
      courseActivities: [
        {
          id: "cultural-plurality-guided-plan",
          kind: "guided-writing",
          title: "Construis le plan du sujet sur la pluralité des cultures",
          instruction: "Rédige les quatre éléments du raisonnement avant de comparer avec le corrigé du document.",
          sourceLabel: "Pages 5–6 · situation d’évaluation 1",
          prompts: [
            { id: "problem", label: "Problème", hint: "Fais apparaître l’opposition entre diversité et unité.", placeholder: "La diversité culturelle… ?", rows: 3 },
            { id: "axis-one", label: "Axe 1", hint: "Explique comment les différences peuvent diviser.", placeholder: "Thèse, un argument et une référence pertinente…", rows: 5 },
            { id: "axis-two", label: "Axe 2", hint: "Montre comment la pluralité peut aussi rapprocher.", placeholder: "Thèse, un argument et une référence pertinente…", rows: 5 },
            { id: "answer", label: "Réponse finale", hint: "Réponds sans effacer la difficulté étudiée.", placeholder: "En définitive, la diversité culturelle…", rows: 4 },
          ],
          criteria: [
            { id: "faithful-problem", label: "Mon problème reste fidèle au rapprochement des peuples", hint: "Je n’ai pas remplacé le sujet par une question voisine." },
            { id: "opposed-axes", label: "Mes axes défendent deux positions opposées", hint: "Le second ne répète pas le premier." },
            { id: "explained-reference", label: "Chaque référence est expliquée", hint: "Je dis précisément ce qu’elle prouve." },
            { id: "nuanced-answer", label: "Ma réponse tranche tout en restant nuancée", hint: "Elle tient compte des tensions analysées." },
          ],
          modelTitle: "Plan guidé — pluralité des cultures",
          modelMarkdown: String.raw`**Problème direct :** La diversité culturelle empêche-t-elle l’unité entre les peuples ?

**Axe 1 — Elle peut diviser.** Les différences nourrissent parfois le rejet et l’ethnocentrisme. Lévi-Strauss décrit le réflexe qui consiste à répudier les formes culturelles éloignées des nôtres.

**Axe 2 — Elle peut rapprocher.** Le brassage enrichit les peuples et le respect de chaque personne est une exigence morale. Saint-Exupéry écrit : « Si tu diffères de moi, loin de me léser, tu m’enrichis. »

**Réponse :** La pluralité n’assure pas automatiquement l’unité, mais elle devient une force de rapprochement lorsqu’elle est accompagnée de dialogue et de respect.`,
        },
        {
          id: "work-humanization-guided-plan",
          kind: "guided-writing",
          title: "Traite le second sujet : « Le travail humanise-t-il ? »",
          instruction: "Le document fournit deux axes et une synthèse possible. Construis ton propre chemin avant d’ouvrir le corrigé.",
          sourceLabel: "Pages 6–7 · situation d’évaluation 2",
          prompts: [
            { id: "problem", label: "Problème", hint: "Interroge la capacité du travail à former l’être humain.", placeholder: "Le travail, activité consciente… ?", rows: 3 },
            { id: "axis-one", label: "Axe 1", hint: "Montre ce que le travail développe ou produit.", placeholder: "Thèse, argument, référence…", rows: 5 },
            { id: "axis-two", label: "Axe 2", hint: "Montre comment certaines formes de travail peuvent aliéner.", placeholder: "Thèse, argument, référence…", rows: 5 },
            { id: "answer", label: "Réponse ou synthèse", hint: "Distingue le travail de ses formes dégradantes.", placeholder: "Le travail peut humaniser à condition que…", rows: 4 },
          ],
          criteria: [
            { id: "defined-work", label: "J’ai défini le travail dans le contexte", hint: "Activité consciente, transformation et production." },
            { id: "conditions", label: "Je distingue le travail de ses conditions d’exercice", hint: "Le problème ne reçoit pas une réponse simplement oui/non." },
            { id: "author-links", label: "Marx, Voltaire ou Mounier soutiennent un argument précis", hint: "Les auteurs ne sont pas seulement cités." },
            { id: "optional-synthesis", label: "Ma synthèse reste justifiée", hint: "Une troisième partie n’est jamais obligatoire par principe." },
          ],
          modelTitle: "Plan guidé — travail et humanisation",
          modelMarkdown: String.raw`**Problème :** Le travail, activité consciente de production de biens utiles, soustrait-il l’homme à l’animalité ?

**Axe 1 — Le travail humanise.** Il transforme la nature, développe les facultés et répond aux besoins. Marx l’explique dans *Le Capital* ; Voltaire ajoute que le travail éloigne « l’ennui, le vice et le besoin ».

**Axe 2 — Certaines formes déshumanisent.** Le machinisme, la division du travail ou la pénibilité peuvent transformer le travailleur en marchandise. C’est la critique de Marx dans les *Manuscrits de 1844*.

**Synthèse possible :** Le travail n’humanise pas par sa seule existence ; il le fait lorsqu’il demeure une activité consciente, digne et formatrice. Mounier résume cette possibilité : « Tout travail travaille à faire l’homme. »`,
        },
      ],
      source: {
        documentTitle: "Tle Philosophie — Leçon 1 : La dissertation philosophique",
        pages: "5–7",
        section: "Situations d’évaluation sur la pluralité culturelle et le travail",
        fidelity: "faithful-corrected",
        corrections: [
          "Le problème proposé pour la pluralité déplace légèrement le sujet vers l’égalité ; une formulation directe est ajoutée et clairement attribuée à Excellence.",
          "Le troisième axe sur le travail est présenté comme une synthèse possible, jamais comme une obligation de plan en trois parties.",
        ],
      },
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
        bodyMarkdown: String.raw`## Qu’est-ce que commenter un texte ?

Le commentaire de texte philosophique est un exercice écrit qui consiste à **dégager l’intérêt philosophique d’un texte à partir de son étude ordonnée**. Commenter un texte, c’est **d’abord l’expliquer** — mettre en évidence son sens — **et ensuite l’évaluer**.

Comme la dissertation, le devoir comprend **trois parties** : l’introduction, le développement, la conclusion.

| Partie | Rôle |
|---|---|
| **Introduction** | présenter le texte par son thème, son problème et sa thèse |
| **Développement** | l’étude ordonnée (expliquer) puis l’intérêt philosophique (évaluer) |
| **Conclusion** | prendre position après le bilan du débat |

## La fiche d’identité du texte

L’introduction présente le texte à partir de **trois éléments essentiels** — le thème, le problème et la thèse — auxquels s’ajoutent l’intention, l’enjeu et la structure logique. Chaque élément répond à une question précise :

| Élément | Question à se poser |
|---|---|
| **Thème** | De quoi est-il question dans le texte ? |
| **Problème** | Quelle difficulté l’auteur cherche-t-il à résoudre ? |
| **Thèse** | Quelle est la position de l’auteur ? |
| **Intention** | Quel est l’objectif immédiat de l’auteur ? |
| **Enjeu** | Qu’y a-t-il à gagner dans la résolution du problème ? |
| **Structure logique** | Quelles sont les étapes, les mouvements de l’argumentation ? |
| **Démarche argumentative** | De quelle manière le problème est-il traité ? |

> **On peut placer la structure logique** à la fin de l’introduction **ou** au début du développement.

## Exemple entièrement traité — Hountondji

Texte : *Sur « la philosophie africaine »*, où l’auteur refuse de réduire la philosophie à un système.

| Élément | Résultat |
|---|---|
| **Thème** | La définition de la philosophie |
| **Problème** | La philosophie est-elle un système ? |
| **Thèse** | La philosophie n’est pas un système mais un débat sans cesse rebondissant |
| **Intention** | Rejeter l’opinion qui fait de la philosophie un savoir achevé |
| **Enjeu** | La connaissance |
| **Structure logique** | Deux mouvements (L1–L6 : elle n’est pas un système ; L6–L15 : elle est un débat) |

> **Erreur fréquente.** Confondre le **thème** (le sujet dont on parle) et la **thèse** (ce que l’auteur en dit). Le thème se dit en un mot ; la thèse est une phrase complète qui répond au problème.`,
        keyPoint: "Thème = sujet ; problème = question ; thèse = réponse ; intention = but ; enjeu = intérêt.",
        example: "Dans le texte de Hountondji : thème, définition de la philosophie ; problème, est-elle un système ? ; thèse, elle est un débat toujours ouvert.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "La fiche d’identité du texte",
          instruction: "Sélectionne un élément pour voir la question qui le révèle et l’exemple de Hountondji.",
          observation: "Ces éléments ne se confondent pas : chacun répond à une question différente et se rédige autrement.",
          rootLabel: "Présenter le texte",
          rootDetail: "Sept repères pour ne rien confondre avant d’expliquer",
          nodes: [
            { id: "theme", group: "Ce que dit le texte", label: "Thème", role: "De quoi est-il question ?", detail: "Le domaine, le sujet général du texte, dit en un mot ou une expression. Chez Hountondji : la définition de la philosophie." },
            { id: "probleme", group: "Ce que dit le texte", label: "Problème", role: "Quelle difficulté résoudre ?", detail: "La question centrale à laquelle le texte répond. Chez Hountondji : la philosophie est-elle un système ?" },
            { id: "these", group: "Ce que dit le texte", label: "Thèse", role: "Quelle position de l’auteur ?", detail: "La réponse que l’auteur défend, formulée en une phrase complète. Chez Hountondji : la philosophie n’est pas un système mais un débat sans cesse rebondissant." },
            { id: "intention", group: "Ce que vise l’auteur", label: "Intention", role: "Quel objectif immédiat ?", detail: "Ce que l’auteur cherche à faire en écrivant. Chez Hountondji : rejeter l’opinion qui fait de la philosophie un savoir achevé." },
            { id: "enjeu", group: "Ce que vise l’auteur", label: "Enjeu", role: "Qu’y a-t-il à gagner ?", detail: "L’intérêt plus large de la discussion, ce qu’elle permet de préserver. Chez Hountondji : la connaissance." },
            { id: "structure", group: "Comment il argumente", label: "Structure logique", role: "Quels mouvements ?", detail: "Le découpage du texte en parties. Chez Hountondji : deux mouvements — d’abord ce que la philosophie n’est pas, puis ce qu’elle est. Se place en fin d’introduction ou en début de développement." },
            { id: "demarche", group: "Comment il argumente", label: "Démarche argumentative", role: "De quelle manière ?", detail: "La façon dont l’auteur conduit sa preuve : ici une démarche polémique, qui nie une thèse pour en affirmer une autre." },
          ],
        },
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
        extraQuestions: [
          { prompt: "À quelle question correspond l’« intention » de l’auteur ?", options: ["Quel est l’objectif immédiat de l’auteur ?", "Combien de mouvements compte le texte ?", "Quelle est la date de l’œuvre ?", "Qui est l’éditeur ?"], correctIndex: 0, explanation: "L’intention désigne ce que l’auteur cherche à accomplir.", sourceLabel: "Activité d’application 3", points: 2 },
          { prompt: "À quelle question correspond l’« enjeu » du texte ?", options: ["Qu’y a-t-il à gagner dans la résolution du problème ?", "De quoi est-il question dans le texte ?", "Quelle est la position de l’auteur ?", "Quelles sont les étapes de l’argumentation ?"], correctIndex: 0, explanation: "L’enjeu, c’est l’intérêt de la discussion — ce qu’elle permet de gagner ou de préserver.", sourceLabel: "Activité d’application 3", points: 2 },
          { prompt: "Chez Hountondji, quelle est la thèse ?", options: ["La philosophie n’est pas un système mais un débat sans cesse rebondissant", "La philosophie est un ensemble de vérités définitives", "La philosophie est réservée aux savants", "La philosophie n’a pas d’histoire"], correctIndex: 0, explanation: "La thèse répond au problème « la philosophie est-elle un système ? ».", sourceLabel: "Situation d’évaluation 1", points: 2 },
          { prompt: "Où peut-on placer la structure logique ?", options: ["À la fin de l’introduction ou au début du développement", "Uniquement dans la conclusion", "Nulle part, elle est facultative", "Au milieu de la critique externe"], correctIndex: 0, explanation: "Le document laisse le choix entre ces deux emplacements.", sourceLabel: "I – L’introduction", points: 1 },
        ],
        distractors: ["Le thème et la thèse désignent la même chose.", "L’enjeu est le nombre de mouvements.", "La problématique consiste à résumer chaque phrase."],
      },
      {
        id: "ordered-study",
        title: "Faire l’étude ordonnée",
        summary: "Découper les mouvements et expliquer la démarche argumentative sans répéter le texte.",
        conceptTitle: "Suivre le mouvement de la pensée",
        explanation: "L’étude ordonnée explique chaque mouvement du texte, ses idées principales, arguments, concepts et exemples. Elle montre comment l’auteur progresse vers sa thèse et ménage des transitions entre les parties.",
        bodyMarkdown: String.raw`## Expliquer, ce n’est pas répéter

L’étude ordonnée explique le texte **à partir de sa structure logique**, c’est-à-dire de ses différents **mouvements**. Elle met en évidence :

- la **démarche argumentative** de l’auteur,
- les **arguments**, les **concepts**, les **allusions**, les **exemples**,
- les éventuelles **figures de style**.

Entre les mouvements, il faut élaborer des **transitions** qui montrent pourquoi la pensée passe d’une étape à la suivante.

## Les trois pièges à éviter

| Piège | Ce que c’est |
|---|---|
| **La paraphrase** | répéter le texte en le reformulant, sans rien expliquer |
| **Le contre-sens** | attribuer à l’auteur le contraire de ce qu’il dit |
| **Le non-sens** | prêter au texte une idée absurde ou étrangère |

> **La règle.** La paraphrase **répète** ; l’explication **révèle la fonction logique** des idées — ce que l’auteur affirme, *pourquoi* il l’affirme, et *comment* l’argument conduit à la thèse.

## Exemple entièrement traité — Épictète

Texte : Épictète, *Maximes et Pensées*, sur la tenue du philosophe et de son disciple. Le texte s’articule en **deux mouvements**.

### 1ᵉʳ mouvement (L1 à L7) — « Si un philosophe malpropre… gras et mal peignés. »

**Idée principale :** la nécessité de la décence chez le philosophe et son disciple.

- *Idée secondaire 1* : identifié à un criminel, le philosophe malpropre inspire la répugnance.
- *Idée secondaire 2* : exhortation à la propreté et à la décence.

### 2ᵉ mouvement (L7 à L12) — « Car par là je juge… n’est que laideur. »

**Idée principale :** la primauté de la beauté intérieure sur la beauté du corps.

- *Idée secondaire 1* : la beauté du corps présuppose la beauté intérieure.
- *Idée secondaire 2* : la beauté intérieure, qui consiste à faire usage de la raison, surpasse la beauté du corps.

> **Astuce.** Une idée principale par mouvement, deux idées secondaires qui la soutiennent : ce squelette suffit à structurer toute l’étude ordonnée.`,
        keyPoint: "Expliquer, c’est montrer ce que l’auteur affirme, pourquoi il l’affirme et comment l’argument conduit à la thèse.",
        example: "Chez Épictète : mouvement 1, la nécessité de la décence ; mouvement 2, la primauté de la beauté intérieure sur celle du corps.",
        mapTitle: "Les deux mouvements du texte d’Épictète",
        mapInstruction: "Repère l’idée principale et les idées secondaires de chaque mouvement.",
        map: [
          { label: "Mouvement 1 (L1–L7)", shortLabel: "Mvt 1", detail: "Idée principale : la nécessité de la décence. Secondaires : le philosophe malpropre inspire la répugnance ; exhortation à la propreté." },
          { label: "Transition", shortLabel: "Transition", detail: "Montrer pourquoi l’on passe de l’apparence extérieure à la beauté intérieure." },
          { label: "Mouvement 2 (L7–L12)", shortLabel: "Mvt 2", detail: "Idée principale : la primauté de la beauté intérieure. Secondaires : le corps présuppose l’âme ; la raison surpasse le corps." },
        ],
        observation: "La paraphrase répète ; l’explication révèle la fonction logique des idées.",
        check: q("Comment éviter la paraphrase ?", "Expliquer la fonction des arguments et leurs liens", "Remplacer chaque mot par un synonyme", "Recopier les phrases les plus longues", "Donner son opinion à chaque ligne"),
        extraQuestions: [
          { prompt: "Qu’est-ce qu’un contre-sens ?", options: ["Attribuer à l’auteur le contraire de ce qu’il dit", "Reformuler le texte avec des synonymes", "Citer un autre auteur", "Découper le texte en mouvements"], correctIndex: 0, explanation: "Le contre-sens inverse la pensée de l’auteur ; le non-sens lui prête une idée absurde.", sourceLabel: "II-A L’étude ordonnée", points: 2 },
          { prompt: "Chez Épictète, quelle est l’idée principale du 1ᵉʳ mouvement ?", options: ["La nécessité de la décence chez le philosophe et son disciple", "La primauté de la beauté intérieure", "L’inutilité de la philosophie", "La supériorité du corps sur l’âme"], correctIndex: 0, explanation: "Le premier mouvement (L1–L7) porte sur la décence.", sourceLabel: "Situation d’évaluation – étude ordonnée", points: 2 },
          { prompt: "À quoi servent les transitions dans l’étude ordonnée ?", options: ["Montrer pourquoi la pensée passe d’un mouvement au suivant", "Résumer tout le texte", "Introduire la conclusion", "Citer des auteurs"], correctIndex: 0, explanation: "Elles relient les articulations du texte.", sourceLabel: "II-A L’étude ordonnée", points: 1 },
        ],
        distractors: ["L’étude ordonnée ignore la structure logique.", "Expliquer signifie seulement reformuler.", "Les transitions sont inutiles dans un commentaire."],
      },
      {
        id: "philosophical-interest",
        title: "Dégager l’intérêt philosophique",
        summary: "Évaluer la cohérence du texte puis confronter sa thèse à d’autres positions.",
        conceptTitle: "Critique interne et critique externe",
        explanation: "La critique interne évalue la forme du raisonnement : cohérence, pertinence, forces et limites des arguments. La critique externe discute le fond : elle justifie la thèse par d’autres références puis la dépasse par des positions opposées.",
        bodyMarkdown: String.raw`## Évaluer le texte : les deux critiques

L’intérêt philosophique consiste à **évaluer le texte dans la forme et dans le fond**. C’est la partie critique du devoir, qui comporte deux aspects.

### A. La critique interne — la forme

Elle évalue le texte **dans la forme**, en montrant :

- la **cohérence** de l’argumentation ;
- l’**adéquation** (ou l’inadéquation) entre la démarche argumentative et l’intention de l’auteur ;
- les **forces et les faiblesses** des arguments ;
- la **pertinence** de la démarche argumentative.

### B. La critique externe — le fond

Elle évalue le texte **dans le fond**, c’est-à-dire qu’elle apprécie la position de l’auteur en deux temps :

1. on **justifie la thèse** en s’appuyant sur d’autres auteurs ;
2. on la **dépasse** à l’aide d’autres positions.

## Exemple traité — critique interne d’Épictète

> En usant d’expressions excessives — *malpropre, négligé, horrible* —, l’auteur compare le philosophe à un criminel pour mettre en évidence son caractère répugnant… Le **ton ironique** dont use l’auteur est **en conformité avec son intention**, qui est d’amener le philosophe à améliorer son statut social.

On voit ici la critique interne : elle relie un procédé (l’ironie, l’hyperbole) à l’intention, et **juge l’adéquation** de l’un à l’autre.

## Exemple traité — critique externe d’Épictète

**Axe 1 — Le philosophe doit observer la propreté et la décence.**

| Argument | Référence |
|---|---|
| Un esprit sain a besoin d’un corps sain. | La maxime « un esprit sain dans un corps sain »¹ |
| L’aspect extérieur importe pour la crédibilité du philosophe. | **PLATON**, *Le Banquet* : l’amour des beaux corps conduit à la culture des belles âmes. |

**Axe 2 — La beauté corporelle est inessentielle pour le philosophe.**

| Argument | Référence |
|---|---|
| L’avilissement du corps conduit à l’élévation de l’esprit. | **DIOGÈNE** le cynique. |
| L’âme a plus de valeur que le corps. | Les **stoïciens** ; **SAINT AUGUSTIN**, *Confessions*. |

> ¹ **Annotation.** Le document présente cette maxime comme « grecque ». Elle est en réalité **latine** : *mens sana in corpore sano*, tirée des *Satires* du poète **Juvénal**. L’idée est juste, l’origine est à corriger.

> **Garde en tête.** La critique externe **n’attaque pas** : elle soutient d’abord la thèse avec de vraies références, puis lui oppose d’autres positions tout aussi argumentées.`,
        keyPoint: "Interne = valeur du raisonnement ; externe = discussion de la thèse.",
        example: "Sur Épictète : Axe 1, la propreté est nécessaire (Platon, Le Banquet) ; Axe 2, elle est inessentielle (Diogène, les stoïciens, saint Augustin).",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "L’intérêt philosophique",
          instruction: "Sélectionne un critère pour voir ce qu’il évalue, avec l’exemple d’Épictète.",
          observation: "La critique interne juge la forme ; la critique externe discute le fond en deux temps : justifier puis dépasser.",
          rootLabel: "Évaluer le texte",
          rootDetail: "Deux critiques : la forme, puis le fond",
          nodes: [
            { id: "coherence", group: "Critique interne (la forme)", label: "Cohérence", role: "L’argumentation se tient-elle ?", detail: "Vérifier que les idées s’enchaînent sans se contredire. Chez Épictète, le passage de l’apparence à la beauté intérieure est cohérent." },
            { id: "adequation", group: "Critique interne (la forme)", label: "Adéquation", role: "La démarche sert-elle l’intention ?", detail: "Mesurer si la façon d’argumenter réalise le but de l’auteur. Le ton ironique d’Épictète est en adéquation avec son intention d’améliorer le statut du philosophe." },
            { id: "forces", group: "Critique interne (la forme)", label: "Forces et faiblesses", role: "Les arguments tiennent-ils ?", detail: "Peser ce qui rend les arguments convaincants et ce qui les fragilise." },
            { id: "pertinence", group: "Critique interne (la forme)", label: "Pertinence", role: "La démarche est-elle bien choisie ?", detail: "Juger si la manière d’argumenter était la mieux adaptée au problème posé." },
            { id: "justifier", group: "Critique externe (le fond)", label: "Justifier (Axe 1)", role: "Qui soutient la thèse ?", detail: "Appuyer la thèse de l’auteur sur d’autres références. Pour Épictète : Platon (Le Banquet), la maxime d’un esprit sain dans un corps sain." },
            { id: "depasser", group: "Critique externe (le fond)", label: "Dépasser (Axe 2)", role: "Qui la conteste ?", detail: "Opposer d’autres positions pour nuancer. Pour Épictète : Diogène le cynique, les stoïciens, saint Augustin, pour qui la beauté corporelle est inessentielle." },
          ],
        },
        mapTitle: "Évaluer sans juger trop vite",
        mapInstruction: "Passe de la forme du texte au débat sur le fond.",
        map: [
          { label: "Critique interne", detail: "La démarche choisie réalise-t-elle l’intention de l’auteur ?" },
          { label: "Justification", detail: "Quelles idées ou références renforcent la thèse ?" },
          { label: "Dépassement", detail: "Quelles limites ou positions contraires permettent de la nuancer ?" },
        ],
        observation: "Critiquer ne signifie pas attaquer : il faut apprécier avec des raisons précises.",
        check: q("Que juge principalement la critique interne ?", "La cohérence et la pertinence de l’argumentation", "La vie privée de l’auteur", "La longueur de l’ouvrage", "La popularité de la thèse"),
        extraQuestions: [
          { prompt: "Que fait la critique externe dans son premier temps ?", options: ["Elle justifie la thèse en s’appuyant sur d’autres auteurs", "Elle résume le texte", "Elle attaque immédiatement l’auteur", "Elle recopie l’introduction"], correctIndex: 0, explanation: "On soutient d’abord la thèse, puis on la dépasse.", sourceLabel: "II-B La critique externe", points: 2 },
          { prompt: "Quelle référence soutient l’Axe 1 sur Épictète (la décence est nécessaire) ?", options: ["Platon, Le Banquet : l’amour des beaux corps conduit aux belles âmes", "Diogène le cynique", "Les stoïciens", "Saint Augustin, Confessions"], correctIndex: 0, explanation: "Platon est mobilisé pour justifier la thèse ; les trois autres servent à la dépasser.", sourceLabel: "Activité d’application 2 – critique externe", points: 3 },
          { prompt: "Sur quel critère porte l’« adéquation » en critique interne ?", options: ["Entre la démarche argumentative et l’intention de l’auteur", "Entre la longueur du texte et sa date", "Entre l’auteur et son éditeur", "Entre le lecteur et le correcteur"], correctIndex: 0, explanation: "La critique interne mesure si la démarche réalise l’intention.", sourceLabel: "II-B 1 La critique interne", points: 2 },
        ],
        distractors: ["La critique externe résume seulement le texte.", "Toute critique doit rejeter la thèse.", "La critique interne mobilise uniquement des auteurs opposés."],
      },
      {
        id: "introduction-conclusion",
        title: "Encadrer le commentaire",
        summary: "Construire une introduction complète et une conclusion qui prend position après le débat.",
        conceptTitle: "Introduction et conclusion du commentaire",
        explanation: "L’introduction présente la problématique du texte et peut annoncer sa structure logique. La conclusion fait le bilan de la critique externe puis formule une position personnelle justifiée sur l’intérêt du texte.",
        bodyMarkdown: String.raw`## L’introduction : présenter le texte

L’introduction agence les **trois éléments essentiels** — thème, problème, thèse — et peut annoncer la **structure logique** en fin de paragraphe.

### Modèle rédigé — introduction d’Épictète

> « **Ce texte d’Épictète, extrait de son œuvre *Maximes et Pensées*, parle de la tenue du philosophe et de son disciple.** *(thème)* **À la question : le philosophe et son disciple doivent-ils négliger leur tenue ?** *(problème)* **l’auteur répond que ceux-ci doivent prendre soin de leur corps et de leur âme.** *(thèse)* **Ce texte s’articule autour de deux mouvements : de la L1 à la L7… ; de la L7 à la L12…** *(structure logique)* »

> **Ce qu’il faut observer.** Le problème est posé **comme une vraie question**, et la thèse y **répond directement**. La structure logique vient clore l’introduction.

## La conclusion : prendre position

La conclusion est la dernière partie du devoir. Elle consiste en une **prise de position** par rapport à l’intérêt du texte. Cette prise de position doit être **précédée du bilan** du débat engagé dans la critique externe.

### Modèle rédigé — conclusion d’Épictète

> « **En définitive, si pour Épictète et certains moralistes de l’Antiquité le philosophe et son disciple doivent observer la propreté et la décence en vue d’améliorer leur statut social, pour d’autres penseurs tels que les cyniques, la beauté corporelle est inessentielle pour le philosophe.** *(bilan)* **Au demeurant, à notre sens, la propreté du corps va de pair avec celle de l’esprit.** *(position personnelle)* »

> **Erreur fréquente.** Conclure **avant** d’avoir expliqué puis évalué le texte. On ne prend position qu’**après** l’étude ordonnée et les deux critiques — jamais dès l’introduction.`,
        keyPoint: "L’introduction ouvre le problème ; la conclusion répond après l’explication et la discussion.",
        example: "Conclusion sur Épictète : la décence renforce la crédibilité du philosophe, mais la valeur de sa pensée ne se réduit pas à son apparence.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "L’architecture du commentaire",
          instruction: "Sélectionne une partie pour découvrir ce qu’elle doit contenir.",
          observation: "L’introduction présente, le développement explique puis évalue, la conclusion tranche : chaque partie a un rôle unique.",
          rootLabel: "Le commentaire de texte",
          rootDetail: "Trois parties, dans un ordre qui ne se bouscule pas",
          nodes: [
            { id: "i-theme", group: "Introduction", label: "Thème", role: "Présenter", detail: "Le sujet du texte, dit en une expression. Chez Épictète : la tenue du philosophe et de son disciple." },
            { id: "i-probleme", group: "Introduction", label: "Problème", role: "Poser la question", detail: "La question centrale du texte : le philosophe et son disciple doivent-ils négliger leur tenue ?" },
            { id: "i-these", group: "Introduction", label: "Thèse", role: "Donner la réponse de l’auteur", detail: "Ce que soutient l’auteur : ils doivent prendre soin de leur corps et de leur âme." },
            { id: "i-structure", group: "Introduction", label: "Structure logique", role: "Annoncer les mouvements", detail: "Le découpage du texte, placé en fin d’introduction ou en début de développement : ici deux mouvements." },
            { id: "d-etude", group: "Développement", label: "Étude ordonnée", role: "Expliquer", detail: "Suivre les mouvements du texte, révéler la démarche argumentative sans paraphraser, ménager des transitions." },
            { id: "d-interne", group: "Développement", label: "Critique interne", role: "Évaluer la forme", detail: "Juger la cohérence, l’adéquation de la démarche à l’intention, les forces et faiblesses, la pertinence." },
            { id: "d-externe", group: "Développement", label: "Critique externe", role: "Discuter le fond", detail: "Justifier la thèse avec d’autres auteurs (Axe 1), puis la dépasser par des positions opposées (Axe 2)." },
            { id: "c-bilan", group: "Conclusion", label: "Bilan", role: "Récapituler le débat", detail: "Résumer l’opposition dégagée dans la critique externe : ce que dit l’auteur, ce que d’autres objectent." },
            { id: "c-position", group: "Conclusion", label: "Prise de position", role: "Trancher", detail: "Donner un avis personnel justifié sur l’intérêt du texte. Il vient après le bilan, jamais avant l’explication." },
          ],
        },
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
        extraQuestions: [
          { prompt: "Quels sont les trois éléments essentiels de l’introduction ?", options: ["Le thème, le problème et la thèse", "L’amorce, l’exemple et la citation", "La critique interne, externe et le bilan", "Le titre, l’auteur et la date"], correctIndex: 0, explanation: "L’introduction du commentaire agence thème, problème et thèse.", sourceLabel: "I – L’introduction", points: 2 },
          { prompt: "La prise de position en conclusion doit être précédée de…", options: ["du bilan du débat de la critique externe", "d’un nouvel argument", "de la biographie de l’auteur", "d’une seconde étude ordonnée"], correctIndex: 0, explanation: "On récapitule le débat avant de trancher.", sourceLabel: "III – La conclusion", points: 2 },
          { prompt: "Dans le modèle d’Épictète, quelle est la thèse annoncée en introduction ?", options: ["Le philosophe et son disciple doivent prendre soin de leur corps et de leur âme", "Le philosophe doit rester malpropre", "La philosophie est un système clos", "La beauté du corps n’a aucune importance"], correctIndex: 0, explanation: "La thèse répond à la question posée par le problème.", sourceLabel: "Corrigé – introduction d’Épictète", points: 2 },
        ],
        distractors: ["L’introduction contient déjà la critique externe.", "La conclusion n’a aucun lien avec l’intérêt du texte.", "Le commentaire se limite à une étude ordonnée."],
      },
    ],
    mission: {
      title: "Atelier BAC : Hume et le rôle de la religion",
      scenario: "Un camarade en difficulté te sollicite. À partir du texte de David Hume (Dialogues sur la religion naturelle), dégage l’intérêt philosophique à partir de son étude ordonnée : problématique, mouvements, critique interne, critique externe et conclusion.",
      problem: "Quel est le rôle de la religion dans la vie de l’homme ?",
      bodyMarkdown: String.raw`## Le corrigé complet du texte de Hume

### I. Problématique du texte

| Élément | Résultat |
|---|---|
| **Thème** | Le rôle de la religion |
| **Problème** | Quel est le rôle de la religion dans la vie de l’homme ? |
| **Thèse** | La religion apaise les souffrances de l’homme et calme ses douleurs terrestres |
| **Antithèse** | La religion aliène l’homme |
| **Intention** | Montrer l’importance de la religion dans la société |
| **Enjeu** | Le bonheur |

**Structure logique — deux mouvements :**

- **1ᵉʳ mouvement (L1–L4)** « Mon opinion… toute la nature. » — Idée principale : *les fondements de la religion*.
- **2ᵉ mouvement (L4–L12)** « Les plus brillantes scènes… sans cesse ? » — Idée principale : *la fonction psychologique de la religion*.

### II. Intérêt philosophique

**Critique interne.** L’auteur, par une démarche explicative, présente d’abord les fondements de la religion, puis en précise les fonctions, spécifiquement psychologiques. Son intention — montrer l’importance de la religion — est **en parfaite adéquation** avec sa démarche ; l’auteur fait preuve de rigueur.

**Critique externe.**

**Axe 1 — La religion concourt à l’épanouissement de l’homme.**

| Argument | Référence |
|---|---|
| Fonction **pédagogique** : elle renseigne sur des phénomènes métaphysiques. | **FREUD**, *L’avenir d’une illusion* : « elle les éclaire sur l’origine et la formation de l’univers… » |
| Rôle **éthique et moral** : elle règle les opinions antagonistes par ses prescriptions. | **R. GIRARD**, *La violence et le sacré*. |
| Rôle **social** : elle sème l’amour entre les hommes. | **SAINT AUGUSTIN**, *La Cité de Dieu* : s’aimer, c’est vouloir être heureux, et cette fin, c’est s’attacher à Dieu. |

**Axe 2 — La religion est un fait illusoire et un facteur d’aliénation.**

| Argument | Référence |
|---|---|
| Les faits religieux ne sont que de **pures illusions**. | **FREUD**, *L’avenir d’une illusion* : « les doctrines religieuses sont toutes des illusions… » |
| La religion est source d’**affabulations et d’aberrations**. | **BERGSON**, *Les deux sources de la morale et de la religion* : « Quel tissu d’aberrations ! » |
| Le **fanatisme** religieux conduit à l’immoralité et aux crimes. | **François JACOB**, *Le jeu des possibles* : « Rien n’est aussi dangereux que la certitude d’avoir raison. » |

> **Le duel des références.** Freud apparaît **dans les deux axes** : d’abord pour décrire ce que la religion prétend apporter, ensuite pour la dénoncer comme illusion. C’est un bon réflexe de commentaire : un même auteur peut servir la thèse *et* son dépassement, selon la citation retenue.

### III. Conclusion

> Même si la religion nous assujettit à des rites rigoureux, il n’y a rien de plus utile à l’humanité que la religion, vu son rôle psychologique. Bien qu’illusoire, la religion est un véritable catalyseur de nos élans, en permettant à l’homme d’espérer et de supporter les vicissitudes de l’existence.`,
      plan: [
        { label: "Problématique", shortLabel: "Problématique", detail: "Thème : le rôle de la religion ; thèse : elle apaise les souffrances de l’homme ; antithèse : elle l’aliène ; enjeu : le bonheur." },
        { label: "Mouvement 1 (L1–L4)", shortLabel: "Mvt 1", detail: "Les fondements de la religion : c’est le sentiment de sa faiblesse, plus qu’un raisonnement, qui conduit l’homme à Dieu." },
        { label: "Mouvement 2 (L4–L12)", shortLabel: "Mvt 2", detail: "La fonction psychologique de la religion : elle apaise les craintes et les tourments de l’existence." },
        { label: "Critique interne", shortLabel: "Interne", detail: "Démarche explicative en adéquation avec l’intention ; l’auteur fait preuve de rigueur." },
        { label: "Critique externe", shortLabel: "Externe", detail: "Axe 1 : la religion épanouit (Freud, Girard, saint Augustin). Axe 2 : elle aliène (Freud, Bergson, François Jacob)." },
      ],
      modelAnswer: "Le texte explique d’abord les fondements de la religion, puis sa fonction psychologique ; la discussion oppose ceux pour qui elle épanouit l’homme à ceux pour qui elle l’aliène, avant de reconnaître son utilité comme soutien de l’espérance.",
      questions: [
        q("Quelle est la thèse de Hume dans ce texte ?", "La religion apaise les souffrances de l’homme et calme ses douleurs terrestres", "La religion est inutile à l’homme", "La religion est une science exacte", "La religion interdit tout bonheur"),
        q("Quel est le découpage du texte ?", "Les fondements de la religion, puis sa fonction psychologique", "Une biographie, puis une bibliographie", "Une définition, puis un poème", "Deux exemples sans idée directrice"),
        q("Quelle référence permet de dépasser la thèse (Axe 2) ?", "Bergson : « Quel tissu d’aberrations ! »", "Saint Augustin : s’attacher à Dieu rend heureux", "Girard : la religion règle les opinions antagonistes", "Freud : la religion éclaire sur l’origine de l’univers"),
      ],
      extraQuestions: [
        { prompt: "Quel est l’enjeu du texte de Hume ?", options: ["Le bonheur", "La connaissance scientifique", "Le pouvoir politique", "La richesse"], correctIndex: 0, explanation: "L’enjeu, c’est ce qui se joue dans la discussion : ici, le bonheur de l’homme.", sourceLabel: "Corrigé – problématique", points: 2 },
        { prompt: "En critique interne, comment juge-t-on la démarche de Hume ?", options: ["Explicative et en parfaite adéquation avec son intention", "Incohérente et contradictoire", "Purement poétique et sans argument", "Uniquement polémique"], correctIndex: 0, explanation: "La démarche explicative sert bien l’intention de montrer l’importance de la religion.", sourceLabel: "Corrigé – critique interne", points: 2 },
        { prompt: "Quel auteur soutient le rôle social de la religion (semer l’amour entre les hommes) ?", options: ["Saint Augustin, La Cité de Dieu", "François Jacob, Le jeu des possibles", "Bergson, Les deux sources", "Karl Jaspers"], correctIndex: 0, explanation: "Saint Augustin fonde l’amour de soi et des autres sur l’attachement à Dieu.", sourceLabel: "Corrigé – critique externe, Axe 1", points: 3 },
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
        bodyMarkdown: String.raw`## Ce qui distingue l’homme

Comme tous les êtres vivants, l’homme a une dimension biologique. Mais il possède une **faculté spécifique** qui le distingue : la **conscience**.

> **Définition.** La conscience est la **faculté psychique qui permet de se connaître, de connaître le monde et de juger**.

De cette définition ressortent **deux dimensions** de la conscience.

## A. La conscience psychologique

C’est la faculté qu’a l’homme de **se connaître et de connaître le monde extérieur**. C’est ce que découvre **René DESCARTES** (1596–1650) à travers l’expérience du *Cogito*.

> **DESCARTES**, *Discours de la méthode* : « **Cogito ergo sum** » — « Je pense donc je suis ».

En soumettant toutes ses certitudes au doute, Descartes découvre que la seule chose dont il ne peut douter, c’est qu’il *pense*. Pour lui, **l’homme est essentiellement conscient**.

## B. La conscience morale

C’est la capacité qu’a l’homme de **juger ses actes**. C’est ce qu’affirme **Jean-Jacques ROUSSEAU** (1712–1778).

> **ROUSSEAU**, *Émile ou de l’éducation*, Livre IV : « **Conscience ! Conscience ! Instinct divin, immortelle et céleste voix (…), juge infaillible du bien et du mal (…), c’est toi qui fais l’excellence de sa nature et la moralité de ses actions.** »

## La mémoire

Au-delà de ces deux dimensions, la conscience a une fonction de **rétention et de restitution** : elle renvoie à la **mémoire**, faculté de conservation des idées et des pensées antérieurement acquises. Pour **Henri BERGSON** (1859–1949) :

> **BERGSON**, *L’énergie spirituelle* : « **Toute conscience est donc mémoire.** »

Pour agir, la conscience **choisit dans les souvenirs ce qui est utile**. Et si elle opère des choix, alors elle fait déjà de l’homme un **être de liberté** — ce sera l’objet du niveau suivant.

> **Astuce mémoire.** Trois noms, trois rôles : **Descartes** (je pense, donc je me connais), **Rousseau** (je juge le bien et le mal), **Bergson** (je me souviens, donc je choisis).`,
        keyPoint: "La conscience connaît et juge ; la mémoire maintient l’unité de la personne dans le temps.",
        example: "Descartes fonde la certitude du sujet sur le cogito ; Rousseau présente la conscience morale comme juge du bien et du mal ; Bergson relie conscience et mémoire.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "Conscience et mémoire",
          instruction: "Sélectionne une fonction pour découvrir sa définition et l’auteur qui l’éclaire.",
          observation: "La conscience connaît et juge ; la mémoire relie le passé au présent et prépare le choix libre.",
          rootLabel: "La conscience",
          rootDetail: "La faculté qui distingue l’homme : se connaître, connaître le monde, juger",
          nodes: [
            { id: "psychologique", group: "Deux dimensions de la conscience", label: "Conscience psychologique", role: "Se connaître et connaître le monde", detail: "La faculté de se savoir pensant et de percevoir le monde extérieur. Descartes, par le doute, découvre le Cogito : « Je pense donc je suis » (Discours de la méthode). L’homme est essentiellement conscient." },
            { id: "morale", group: "Deux dimensions de la conscience", label: "Conscience morale", role: "Juger ses actes", detail: "La capacité de juger le bien et le mal de ses actions. Rousseau : « Conscience ! Instinct divin (…), juge infaillible du bien et du mal » (Émile, Livre IV)." },
            { id: "memoire", group: "Une troisième fonction", label: "La mémoire", role: "Conserver et restituer", detail: "La faculté de conservation des idées acquises. Bergson : « Toute conscience est mémoire » (L’énergie spirituelle). Pour agir, la conscience choisit dans les souvenirs ce qui est utile." },
          ],
        },
        mapTitle: "Trois fonctions du sujet",
        mapInstruction: "Compare ce que chacune apporte à la connaissance de soi.",
        map: [
          { label: "Conscience psychologique", detail: "Savoir que l’on pense, agit et perçoit le monde." },
          { label: "Conscience morale", detail: "Évaluer ses actes comme bons ou mauvais." },
          { label: "Mémoire", detail: "Conserver et restituer les expériences qui donnent une continuité au moi." },
        ],
        observation: "Être conscient ne signifie pas seulement percevoir : c’est aussi pouvoir juger et se reconnaître dans son histoire.",
        check: q("Quel philosophe relie explicitement conscience et mémoire ?", "Henri Bergson", "Thomas Hobbes", "Karl Marx", "Auguste Comte"),
        extraQuestions: [
          { prompt: "Que découvre Descartes à travers le doute ?", options: ["Qu’il ne peut douter qu’il pense : « Je pense donc je suis »", "Que la conscience est une illusion", "Que l’homme est d’abord un corps", "Que la mémoire précède la pensée"], correctIndex: 0, explanation: "Le Cogito fonde la certitude du sujet conscient.", sourceLabel: "I-A La conscience psychologique", points: 2 },
          { prompt: "À quoi renvoie la conscience morale selon Rousseau ?", options: ["À la capacité de juger le bien et le mal de ses actes", "À la mémoire des souvenirs", "À la perception des objets", "Au doute méthodique"], correctIndex: 0, explanation: "Rousseau en fait le « juge infaillible du bien et du mal ».", sourceLabel: "I-A La conscience morale", points: 2 },
          { prompt: "« La conscience définit l’homme » : cette proposition est…", options: ["Vraie : la conscience est la faculté qui le distingue", "Fausse : l’homme et l’animal la partagent", "Fausse : seule la mémoire le définit", "Vraie : parce qu’il ignore ses actes"], correctIndex: 0, explanation: "La conscience est propre à l’homme et le distingue des autres vivants.", sourceLabel: "Activité d’application 3", points: 2 },
          { prompt: "« La conscience est une faculté que l’homme et l’animal ont en commun » : cette proposition est…", options: ["Fausse : la conscience est propre à l’homme", "Vraie", "Vraie pour la mémoire seulement", "Fausse car l’animal n’a pas de corps"], correctIndex: 0, explanation: "C’est justement la conscience qui distingue l’homme de l’animal.", sourceLabel: "Activité d’application 3", points: 1 },
        ],
        distractors: ["La conscience morale sert uniquement à percevoir les objets.", "La mémoire détruit l’identité personnelle.", "La conscience ne joue aucun rôle dans le jugement."],
      },
      {
        id: "freedom",
        title: "La liberté humaine",
        summary: "Comprendre l’autodétermination et le lien entre choix conscient et responsabilité.",
        conceptTitle: "Agir par sa propre volonté",
        explanation: "La liberté est la capacité de s’autodéterminer plutôt que de subir une contrainte. Pour un sujet conscient, choisir implique d’assumer ses actes et d’exercer son jugement.",
        bodyMarkdown: String.raw`## Qu’est-ce qu’être libre ?

> **Définition.** La liberté est la capacité qu’a l’homme de **s’autodéterminer**, d’**agir sans contrainte**, c’est-à-dire de **n’obéir qu’à sa volonté**.

Être libre, pour un être conscient, c’est **agir de façon responsable**, loin de l’emprise de toute force extérieure. C’est ce que dit l’expression courante : *« agir en toute conscience »*. À ce titre, il revient à l’homme d’**assumer ses actes** et de **maîtriser ses opinions**.

> **BERGSON**, *Leçons clermontoises* : « Notre conscience nous avertit (…) que nous sommes des êtres libres (…). Donc, un fait est indiscutable : c’est que **notre conscience témoigne de notre liberté**. »

## Le lien conscience → liberté → responsabilité

La conscience et la mémoire permettent donc à l’homme de s’assumer comme un **être libre, lucide et autonome**.

| Étape | Ce qu’elle engage |
|---|---|
| **Délibérer** | comparer plusieurs possibilités d’action |
| **Choisir** | se déterminer selon une volonté consciente |
| **Assumer** | répondre des conséquences de l’acte choisi |

## Mais sommes-nous toujours maîtres de nous-mêmes ?

Est-il réaliste de dire que nous sommes **toujours** maîtres de nous ? La conscience est-elle **toujours** présente en nous ? L’homme n’a-t-il pas une autre réalité insoupçonnée qui le détermine ?

> **Transition.** Déjà **LEIBNIZ**, avec sa théorie des *petites perceptions* sans aperception, remettait en cause la surestimation de la conscience. Mais c’est véritablement avec **FREUD** qu’on parvient à la découverte de l’inconscient — le niveau suivant.`,
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
        extraQuestions: [
          { prompt: "Quelle est la bonne définition de la liberté ?", options: ["L’état de l’être qui n’obéit qu’à sa volonté, indépendamment de toute contrainte extérieure", "Faire ce que l’on veut, sain ou malade, sans limite", "Accepter d’être guidé par un directeur de conscience", "Suivre toujours ses pulsions"], correctIndex: 0, explanation: "C’est la seule définition vraie de l’activité 2 : l’autodétermination.", sourceLabel: "Activité d’application 2", points: 2 },
          { prompt: "Selon Bergson, de quoi notre conscience témoigne-t-elle ?", options: ["De notre liberté", "De notre faiblesse", "De notre inconscient", "De notre mémoire seule"], correctIndex: 0, explanation: "« Notre conscience témoigne de notre liberté » (Leçons clermontoises).", sourceLabel: "I-B L’homme, un être de liberté", points: 2 },
          { prompt: "Quel penseur, avant Freud, remettait en cause la surestimation de la conscience ?", options: ["Leibniz, avec les petites perceptions", "Descartes, avec le Cogito", "Rousseau, avec la conscience morale", "Valéry, avec la conscience qui règne"], correctIndex: 0, explanation: "Leibniz annonce la critique de la toute-puissance de la conscience.", sourceLabel: "Transition vers l’inconscient", points: 2 },
        ],
        distractors: ["Être libre signifie n’avoir aucune conséquence à assumer.", "La liberté exclut tout jugement moral.", "La conscience empêche l’autodétermination."],
      },
      {
        id: "unconscious",
        title: "La découverte de l’inconscient",
        summary: "Identifier les désirs refoulés et leurs manifestations dans les rêves, oublis ou conduites involontaires.",
        conceptTitle: "Une vie psychique qui échappe au moi",
        explanation: "Freud nomme inconscient l’instance dynamique où demeurent pulsions et désirs refoulés. Rêves, lapsus, phobies, oublis et agressivité montrent que la conscience ne maîtrise pas toute la vie psychique.",
        bodyMarkdown: String.raw`## Les limites de la conscience

L’homme est un être de conscience et de mémoire, mais il existe **beaucoup de faits psychiques qu’il ignore** et qu’il ne peut ni expliquer ni justifier : les **oublis**, les **motivations cachées**, les **phobies**, les **perceptions insensibles**, les **rêves**… Tout cela révèle les limites de la conscience et présuppose l’existence d’un **inconscient psychique**.

> **Définition (FREUD, 1856–1939).** L’inconscient est l’**ensemble des désirs refoulés qui échappent à la conscience** — l’instance psychique dynamique où sont emmagasinés les instincts, les pulsions et les désirs refoulés.

> **FREUD**, *L’Interprétation des rêves* : « Pour bien comprendre la vie psychique, il est indispensable de **cesser de surestimer la conscience**. »

Notre vie psychique est donc faite d’une **petite partie** d’actes conscients et d’une **grande partie** de faits inconnus de la conscience.

> **FREUD**, *Métapsychologie* : « Nous possédons de multiples preuves de l’existence de l’inconscient. »

## La violence, manifestation de l’inconscient

Parmi ces manifestations, la leçon retient la **violence**. Selon la psychanalyse freudienne, l’inconscient est le **siège de la violence** — agressivité, barbarie — qui se manifeste dans nos relations.

> **FREUD**, *Malaise dans la civilisation* : « L’homme n’est point cet être débonnaire, au cœur assoiffé d’amour (…), mais un être au contraire qui doit porter au compte de ses données instinctives une **bonne somme d’agressivité**. »

L’inconscient se présente ainsi comme un **élément déterminant** de la nature humaine. Mais ne révèle-t-il pas un déterminisme qui remet en cause la responsabilité de l’homme ?`,
        keyPoint: "L’inconscient limite la connaissance immédiate de soi : le moi n’est pas maître de toute sa vie psychique.",
        example: "Un lapsus peut révéler une intention ou un désir que le sujet n’avait pas consciemment décidé d’exprimer.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "L’inconscient selon Freud",
          instruction: "Sélectionne un élément pour comprendre ce que la conscience ne maîtrise pas.",
          observation: "L’inconscient n’est pas une simple absence de conscience : Freud lui attribue une activité propre.",
          rootLabel: "L’inconscient",
          rootDetail: "L’ensemble des désirs refoulés qui échappent à la conscience",
          nodes: [
            { id: "definition", group: "La découverte", label: "Les désirs refoulés", role: "La définition", detail: "L’instance psychique dynamique où sont emmagasinés instincts, pulsions et désirs refoulés. Freud invite à « cesser de surestimer la conscience » (L’Interprétation des rêves)." },
            { id: "oublis", group: "Les manifestations", label: "Oublis et lapsus", role: "Des actes involontaires", detail: "Des faits psychiques que le sujet ne peut expliquer et qui trahissent un contenu inconscient." },
            { id: "phobies", group: "Les manifestations", label: "Phobies et rêves", role: "Des symptômes révélateurs", detail: "Phobies, perceptions insensibles et rêves montrent que la vie psychique dépasse ce dont on est conscient." },
            { id: "violence", group: "Les manifestations", label: "La violence", role: "L’agressivité en nous", detail: "L’inconscient est le siège de la violence. Freud : l’homme « doit porter au compte de ses données instinctives une bonne somme d’agressivité » (Malaise dans la civilisation)." },
          ],
        },
        mapTitle: "Du refoulement à la manifestation",
        mapInstruction: "Suis le trajet d’un contenu psychique inconscient.",
        map: [
          { label: "Désir refoulé", detail: "Un contenu jugé inacceptable est écarté de la conscience." },
          { label: "Inconscient", detail: "Le contenu demeure actif sans être directement connu du sujet." },
          { label: "Manifestation", detail: "Rêve, lapsus, phobie ou agressivité en révèle indirectement l’existence." },
        ],
        observation: "L’inconscient n’est pas une simple absence de conscience : Freud lui attribue une activité propre.",
        check: q("Quel exemple constitue une manifestation possible de l’inconscient ?", "Un lapsus révélateur", "Une définition apprise", "Un calcul volontaire", "Une loi juridique"),
        extraQuestions: [
          { prompt: "Comment Freud définit-il l’inconscient ?", options: ["L’ensemble des désirs refoulés qui échappent à la conscience", "La partie la mieux connue de l’esprit", "Une simple absence de pensée", "La mémoire volontaire"], correctIndex: 0, explanation: "L’inconscient est l’instance des pulsions et désirs refoulés.", sourceLabel: "II-A La découverte de l’inconscient", points: 2 },
          { prompt: "Quelle citation justifie que l’homme est violent ?", options: ["« …un être qui doit porter au compte de ses données instinctives une bonne somme d’agressivité »", "« La violence est dans la société et non ailleurs »", "« La violence engendre la violence »", "« La conscience règne mais ne gouverne pas »"], correctIndex: 0, explanation: "C’est la formule de Freud dans Malaise dans la civilisation.", sourceLabel: "Activité d’application", points: 3 },
          { prompt: "Selon Freud, pour comprendre la vie psychique, il faut…", options: ["Cesser de surestimer la conscience", "Ignorer les rêves", "N’étudier que les actes volontaires", "Nier l’existence des pulsions"], correctIndex: 0, explanation: "« Il est indispensable de cesser de surestimer la conscience » (L’Interprétation des rêves).", sourceLabel: "II-A La découverte de l’inconscient", points: 2 },
        ],
        distractors: ["L’inconscient est seulement ce que l’on n’a pas encore appris.", "Freud affirme que toute la vie psychique est consciente.", "Le refoulement supprime définitivement les désirs."],
      },
      {
        id: "determinism-responsibility",
        title: "Déterminisme et responsabilité",
        summary: "Confronter l’explication freudienne aux critiques d’Alain et de Sartre.",
        conceptTitle: "Sommes-nous encore responsables ?",
        explanation: "Si l’inconscient détermine une partie de nos actes, la maîtrise consciente paraît limitée. Pourtant Alain refuse d’en faire un animal caché et Sartre dénonce l’usage de l’inconscient comme alibi de mauvaise foi.",
        bodyMarkdown: String.raw`## A. Le déterminisme psychologique

> **Définition.** Par le déterminisme psychologique, nos actes psychiques **ne sont pas le fruit de nos choix** : ils sont produits par des **forces indépendantes de l’homme**.

Le moi conscient serait alors si manipulé que sa responsabilité et sa liberté sembleraient **illusoires**. Subissant le déterminisme de l’inconscient, l’homme ne pourrait se prévaloir d’aucune volonté.

> **Paul VALÉRY** (1871–1945), *Mauvaises pensées et autres* : « **La conscience règne mais ne gouverne pas.** »

## B. L’homme, un être responsable

Quoique déterminé par l’inconscient, l’homme **reste un sujet libre qui assume ses actes**. Les philosophes moralistes et existentialistes font le procès de la théorie freudienne.

**ALAIN** fait de l’hypothèse de l’inconscient une irréalité :

> **ALAIN**, *Éléments de philosophie* : « Le freudisme si fameux est un **art d’inventer en chaque homme un animal redoutable**. »

**Jean-Paul SARTRE** (1905–1980) affirme que l’homme est *« condamné à être libre »*. Au nom de cette liberté, l’inconscient relève de la **mauvaise foi** : c’est un prétexte pour justifier nos inconduites.

## Conclusion de la leçon

Connaître l’homme est une **entreprise difficile** : il est tantôt un être conscient et libre, tantôt déterminé par l’inconscient. Au demeurant, l’homme est un **être pluridimensionnel et complexe**.

> **Le bon équilibre.** Éviter les deux excès : **nier l’inconscient** (comme si tout était choix) ou **excuser automatiquement toute conduite** (comme si rien n’était choix).`,
        keyPoint: "Le déterminisme psychique limite la maîtrise de soi, mais ne suffit pas à abolir toute responsabilité.",
        example: "Paul Valéry résume la limite du moi : la conscience règne mais ne gouverne pas ; Sartre rappelle néanmoins que l’homme doit assumer ce qu’il fait.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "Le débat sur la responsabilité",
          instruction: "Sélectionne une position pour voir son argument et son auteur.",
          observation: "La bonne réponse évite les deux excès : nier l’inconscient, ou en faire une excuse qui annule toute responsabilité.",
          rootLabel: "L’homme est-il responsable de ses actes ?",
          rootDetail: "Un débat entre le déterminisme psychique et l’exigence de liberté",
          nodes: [
            { id: "determinisme", group: "Le déterminisme (la liberté paraît illusoire)", label: "Nos actes nous échappent", role: "Des forces indépendantes", detail: "Nos faits psychiques ne sont pas nos choix : ils sont produits par des forces inconscientes. Le moi manipulé perd sa maîtrise." },
            { id: "valery", group: "Le déterminisme (la liberté paraît illusoire)", label: "Paul Valéry", role: "« La conscience règne mais ne gouverne pas »", detail: "Valéry résume la limite du moi conscient : il assiste à sa vie psychique sans la commander (Mauvaises pensées et autres)." },
            { id: "alain", group: "La responsabilité demeure", label: "Alain", role: "L’inconscient est une irréalité", detail: "Alain refuse d’inventer un « animal redoutable » caché dans l’homme : « Le freudisme si fameux est un art d’inventer en chaque homme un animal redoutable » (Éléments de philosophie)." },
            { id: "sartre", group: "La responsabilité demeure", label: "Sartre", role: "L’homme est « condamné à être libre »", detail: "Pour Sartre, invoquer l’inconscient relève de la mauvaise foi : c’est un prétexte pour ne pas assumer ses actes. L’homme reste responsable." },
          ],
        },
        mapTitle: "Un débat sur la responsabilité",
        mapInstruction: "Compare la thèse déterministe et sa contestation.",
        map: [
          { label: "Freud", detail: "Des forces inconscientes déterminent des conduites que le moi ne contrôle pas entièrement." },
          { label: "Conséquence", detail: "La liberté et la responsabilité semblent devenir partielles ou fragiles." },
          { label: "Alain et Sartre", detail: "Ils refusent que l’inconscient serve d’excuse générale et maintiennent l’exigence de responsabilité." },
        ],
        observation: "La bonne réponse évite les deux excès : nier l’inconscient ou excuser automatiquement toute conduite.",
        check: q("Quelle position est la plus nuancée ?", "L’inconscient influence l’homme sans supprimer nécessairement toute responsabilité", "L’inconscient n’existe jamais", "L’homme n’est responsable d’aucun acte", "La conscience contrôle absolument tout"),
        extraQuestions: [
          { prompt: "Qui affirme que « la conscience règne mais ne gouverne pas » ?", options: ["Paul Valéry", "Sigmund Freud", "Alain", "Jean-Paul Sartre"], correctIndex: 0, explanation: "Valéry résume la limite du moi conscient.", sourceLabel: "III-A Le déterminisme psychologique", points: 2 },
          { prompt: "Pour Sartre, invoquer l’inconscient pour excuser ses actes, c’est…", options: ["De la mauvaise foi", "Une preuve scientifique", "Une nécessité biologique", "Un acte de liberté"], correctIndex: 0, explanation: "L’homme étant « condamné à être libre », l’alibi de l’inconscient est de la mauvaise foi.", sourceLabel: "III-B L’homme, un être responsable", points: 2 },
          { prompt: "Quelle citation NE justifie PAS que l’homme n’est pas totalement libre ?", options: ["« L’inconscient est de la mauvaise foi »", "« La conscience règne mais ne gouverne pas »", "« Le moi n’est pas maître dans sa propre maison »", "« L’homme subit le déterminisme psychologique »"], correctIndex: 0, explanation: "La formule sur la mauvaise foi défend au contraire la liberté et la responsabilité.", sourceLabel: "Activité d’application 1", points: 3 },
        ],
        distractors: ["L’inconscient abolit toujours la responsabilité.", "Sartre utilise l’inconscient pour excuser les actes.", "Alain considère l’hypothèse freudienne comme indiscutable."],
      },
    ],
    mission: {
      title: "Sujet BAC : « L’inconscient abolit-il la responsabilité humaine ? »",
      scenario: "Analyse le sujet officiel en confrontant le déterminisme psychique à l’exigence de liberté et de responsabilité.",
      problem: "L’existence de forces psychiques inconscientes rend-elle impossible le fait de répondre de ses actes ?",
      bodyMarkdown: String.raw`## Le corrigé du sujet

### I. Définition des termes essentiels

| Terme | Définition |
|---|---|
| **L’inconscient** | l’ensemble des actes qui échappent à la conscience ; l’instance psychique siège des pulsions et désirs refoulés |
| **Abolir** | supprimer, rendre caduc, rendre illusoire |
| **La responsabilité de l’homme** | le fait que l’homme réponde de ses actes, les assume |

### II. Problème à analyser

> **L’inconscient rend-il illusoire la responsabilité humaine ?** L’avènement de l’inconscient excuse-t-il l’homme de tous ses actes ?

### III. Axes d’analyse et références

**Axe 1 — La présence de l’inconscient agit sur la responsabilité humaine.**

- L’inconscient détermine les actes de l’homme au détriment de la conscience. *Cf.* **FREUD** : « la conscience n’est pas toujours maître dans sa propre maison ».
- Avec l’inconscient, l’homme pose des actes involontaires dont il ne peut rendre compte. *Cf.* **Paul VALÉRY** : « la conscience règne mais ne gouverne pas ».

**Axe 2 — La responsabilité de l’homme demeure malgré l’inconscient.**

- L’inconscient étant une partie de l’homme, celui-ci doit en assumer les manifestations. *Cf.* **SARTRE**, pour qui l’alibi de l’inconscient conduit à la mauvaise foi.
- La présence de l’inconscient ne supprime pas la conscience. *Cf.* **ALAIN** : « Il n’y a pas d’inconvénient à employer couramment le terme d’inconscient (…), mais si on le grossit, alors commence l’erreur, et bien pis, c’est une faute » (Éléments de philosophie).

> **Le geste attendu.** Défendre sérieusement l’Axe 1 (l’inconscient nous détermine) avant de le dépasser par l’Axe 2 (nous restons responsables). La réponse nuancée refuse de confondre **détermination partielle** et **abolition totale** de la responsabilité.`,
      plan: [
        { label: "Définir", shortLabel: "Définir", detail: "Inconscient : ce qui échappe à la conscience ; abolir : rendre illusoire ; responsabilité : répondre de ses actes." },
        { label: "Axe 1", shortLabel: "Axe 1", detail: "L’inconscient détermine l’homme : Freud (« pas maître dans sa propre maison ») et Valéry (« la conscience règne mais ne gouverne pas »)." },
        { label: "Axe 2", shortLabel: "Axe 2", detail: "La responsabilité demeure : Sartre (l’alibi de l’inconscient = mauvaise foi) et Alain (ne pas « grossir » l’inconscient)." },
        { label: "Réponse", shortLabel: "Réponse", detail: "Reconnaître l’influence sans confondre détermination partielle et abolition totale de la responsabilité." },
      ],
      modelAnswer: "L’inconscient complique l’attribution de responsabilité, mais il ne l’abolit pas automatiquement : le sujet peut reconnaître ses déterminations et travailler à les maîtriser.",
      questions: [
        q("Quel problème le sujet pose-t-il ?", "L’inconscient rend-il illusoire le fait d’assumer ses actes ?", "La mémoire est-elle une science ?", "La société précède-t-elle l’État ?", "Le progrès supprime-t-il le travail ?"),
        q("Quel auteur soutient que l’inconscient peut devenir un alibi de mauvaise foi ?", "Jean-Paul Sartre", "Sigmund Freud", "Henri Bergson", "Aristote"),
        q("Quelle synthèse est défendable ?", "L’inconscient limite la maîtrise consciente sans excuser nécessairement tous les actes", "Tout acte est totalement involontaire", "L’inconscient n’a aucun effet", "La responsabilité suppose de nier la psychologie"),
      ],
      extraQuestions: [
        { prompt: "Quelle référence soutient l’Axe 1 (l’inconscient nous détermine) ?", options: ["Valéry : « la conscience règne mais ne gouverne pas »", "Sartre : l’inconscient est de la mauvaise foi", "Alain : ne pas grossir l’inconscient", "Descartes : « je pense donc je suis »"], correctIndex: 0, explanation: "Valéry illustre la perte de maîtrise du moi conscient.", sourceLabel: "Situation d’évaluation – Axe 1", points: 3 },
        { prompt: "Que signifie « abolir » dans ce sujet ?", options: ["Supprimer, rendre caduc, rendre illusoire", "Renforcer, consolider", "Mesurer avec précision", "Interroger sans répondre"], correctIndex: 0, explanation: "C’est la définition donnée par le corrigé.", sourceLabel: "Situation d’évaluation – définitions", points: 2 },
        { prompt: "Comment Alain nuance-t-il l’usage du mot « inconscient » ?", options: ["On peut l’employer, mais le « grossir » devient une erreur et une faute", "Il faut le nier entièrement", "Il faut en faire la seule réalité psychique", "Il faut y voir une preuve scientifique"], correctIndex: 0, explanation: "Alain accepte le terme mais refuse d’en faire une force qui excuserait tout.", sourceLabel: "Situation d’évaluation – Axe 2", points: 3 },
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
        bodyMarkdown: String.raw`## Qu’est-ce que la société ?

> **Définition.** La société est une **communauté d’individus ayant des rapports organisés et des échanges de services** — des rapports durables, le plus souvent établis en institutions et garantis par des sanctions.

Sur son **origine**, deux thèses s’opposent.

## A. La thèse naturaliste — Aristote

La société est un **fait naturel** ; l’homme est un être **naturellement social**.

> **ARISTOTE**, *La Politique* : « À l’évidence la cité fait partie des choses naturelles, et **l’homme est par nature un animal politique**. »

## B. La thèse culturaliste — le contrat social

La société est le **produit d’un contrat**, c’est-à-dire d’un accord passé entre les hommes. C’est la position des **philosophes du contrat** : **Hobbes, Locke, Rousseau**.

> **HOBBES**, *Du citoyen* : « Si l’on considère de plus près les causes pour lesquelles les hommes s’assemblent (…), il apparaîtra bientôt que cela n’arrive que **par accident et non pas par une disposition nécessaire de la nature**. »

> **Le point commun.** Les deux thèses s’opposent sur l’**origine** de la société, jamais sur son **importance** : dans les deux cas, l’individu isolé ne suffit pas à réaliser toutes les possibilités humaines.`,
        keyPoint: "La société peut être pensée comme naturelle ou construite, mais l’existence humaine se développe toujours avec les autres.",
        example: "Même si Hobbes conteste une sociabilité spontanée, son contrat montre pourquoi les individus choisissent une organisation commune.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "L’origine de la société",
          instruction: "Sélectionne une thèse pour voir sa position et son auteur.",
          observation: "Deux thèses opposées sur l’origine, mais un même constat : l’homme ne se réalise pas seul.",
          rootLabel: "D’où vient la société ?",
          rootDetail: "Une communauté aux rapports organisés — mais naturelle ou construite ?",
          nodes: [
            { id: "naturaliste", group: "La société est naturelle", label: "Aristote", role: "La thèse naturaliste", detail: "La cité fait partie des choses naturelles : « L’homme est par nature un animal politique » (La Politique). La société accomplit la nature humaine." },
            { id: "hobbes", group: "La société est un contrat", label: "Hobbes", role: "La thèse culturaliste", detail: "Les hommes s’assemblent « par accident et non par une disposition nécessaire de la nature » (Du citoyen). La société résulte d’un accord." },
            { id: "contrat", group: "La société est un contrat", label: "Locke et Rousseau", role: "Les philosophes du contrat", detail: "Comme Hobbes, ils font de la société le produit d’un contrat social : un accord institué entre les hommes pour protéger leurs droits." },
            { id: "commun", group: "Leur point commun", label: "L’homme ne se réalise pas seul", role: "Ce qui les réunit", detail: "Naturelle ou construite, la vie commune reste indispensable : l’individu isolé ne réalise pas toutes les possibilités humaines." },
          ],
        },
        mapTitle: "Deux origines possibles",
        mapInstruction: "Compare les thèses avant de dégager leur point commun.",
        map: [
          { label: "Aristote", detail: "La cité appartient aux choses naturelles et l’homme est social par nature." },
          { label: "Contractualistes", detail: "Les hommes instituent la société par un accord qui protège leurs intérêts et leurs droits." },
          { label: "Point commun", detail: "L’individu isolé ne suffit pas à réaliser toutes les possibilités humaines." },
        ],
        observation: "Le désaccord porte sur l’origine, non sur l’importance concrète de la vie commune.",
        check: q("Quelle thèse Aristote défend-il ?", "L’homme est par nature un animal politique", "La société est toujours un accident", "L’État doit disparaître", "La nation se réduit au territoire"),
        extraQuestions: [
          { prompt: "Quelle est la définition exacte de la société ?", options: ["Un ensemble d’individus entre lesquels existent des rapports durables et organisés, établis en institutions et garantis par des sanctions", "L’ensemble des infrastructures économiques d’un État", "L’ensemble des hommes et des animaux d’un État", "Un ensemble structuré de valeurs morales"], correctIndex: 0, explanation: "La société suppose des rapports organisés garantis par des institutions.", sourceLabel: "Activité d’application 3", points: 2 },
          { prompt: "Complète : « L’homme est par nature un animal … »", options: ["politique", "solitaire", "raisonnable", "économique"], correctIndex: 0, explanation: "C’est la formule d’Aristote dans La Politique.", sourceLabel: "Activité d’application 2", points: 1 },
          { prompt: "Pour Hobbes, pourquoi les hommes s’assemblent-ils ?", options: ["Par accident, non par une disposition nécessaire de la nature", "Parce que la nature les y pousse spontanément", "Parce qu’un dieu l’ordonne", "Parce qu’ils sont incapables de vivre seuls physiquement"], correctIndex: 0, explanation: "Hobbes est culturaliste : la société vient d’un contrat, non de la nature.", sourceLabel: "I-A L’origine sociale", points: 2 },
        ],
        distractors: ["Tous les philosophes expliquent la société par un contrat.", "L’homme se réalise entièrement dans l’isolement.", "La sociabilité naturelle et le contrat sont identiques."],
      },
      {
        id: "others",
        title: "Le rôle d’autrui",
        summary: "Comprendre comment le prochain révèle la conscience de soi et rend possible l’humanisation.",
        conceptTitle: "Se construire par la relation",
        explanation: "Autrui est mon semblable et une autre conscience. Sartre souligne que je passe par l’autre pour obtenir une vérité sur moi ; Malson montre que l’enfant privé du milieu social ne développe pas pleinement son humanité.",
        bodyMarkdown: String.raw`## La relation nécessaire à autrui

Que la sociabilité soit naturelle ou contractuelle, l’homme vit toujours **avec les autres**. Cette évidence a conduit **HEGEL** et **SARTRE** à rejeter le **solipsisme** — l’idée d’une conscience solitaire — défendu par les essentialistes et rationalistes comme **DESCARTES** ou **LEIBNIZ**.

## Autrui me révèle à moi-même

La connaissance de ma conscience m’est révélée **par autrui**, mon semblable, mon prochain.

> **SARTRE**, *L’existentialisme est un humanisme* : « Pour obtenir une vérité quelconque sur moi, **il faut que je passe par l’autre**. »

La présence d’autrui me constitue chaque fois comme un être nouveau : elle contribue à ma prise de conscience, source de liberté et d’épanouissement.

## Autrui m’humanise

Ma liberté et mon humanisation dépendent essentiellement du **respect** que les autres m’accordent.

> **Lucien MALSON**, *Les enfants sauvages* : « Avant la rencontre d’autrui et du groupe, l’homme n’est rien d’autre que **des virtualités aussi légères qu’une transparente vapeur**. »

> **À retenir.** Autrui n’est ni absolument bienfaisant ni absolument hostile : son regard peut me limiter, mais sans lui je ne me connaîtrais pas et ne deviendrais pas pleinement humain. Cette ambivalence prépare la question de la violence sociale.`,
        keyPoint: "Autrui peut me limiter par son regard, mais il est aussi indispensable à la connaissance de soi et à l’humanisation.",
        example: "Le regard d’un camarade peut me gêner, mais ses remarques me révèlent aussi une facette de moi que je ne percevais pas.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "Autrui, mon semblable",
          instruction: "Sélectionne un aspect pour comprendre ce qu’autrui m’apporte.",
          observation: "Autrui me révèle à moi-même et m’humanise, avant même de pouvoir entrer en conflit avec moi.",
          rootLabel: "Autrui, mon prochain",
          rootDetail: "Une autre conscience, sans laquelle je ne me connaîtrais pas",
          nodes: [
            { id: "solipsisme", group: "Le rejet du solipsisme", label: "Contre la conscience solitaire", role: "Hegel et Sartre", detail: "Ils rejettent le solipsisme — l’existence solitaire de la conscience — défendu par Descartes et Leibniz. On ne se pense pas seul, mais parmi les autres." },
            { id: "revelation", group: "Autrui me révèle à moi-même", label: "Passer par l’autre", role: "Sartre", detail: "« Pour obtenir une vérité quelconque sur moi, il faut que je passe par l’autre » (L’existentialisme est un humanisme). Autrui me constitue comme un être nouveau." },
            { id: "humanisation", group: "Autrui m’humanise", label: "La transparente vapeur", role: "Malson", detail: "« Avant la rencontre d’autrui et du groupe, l’homme n’est rien d’autre que des virtualités aussi légères qu’une transparente vapeur » (Les enfants sauvages). Coupé du milieu social, l’homme reste un simple animal." },
          ],
        },
        mapTitle: "Une relation ambivalente",
        mapInstruction: "Observe les deux effets possibles de la présence d’autrui.",
        map: [
          { label: "Révélation", detail: "Autrui me renvoie une image de moi et contribue à ma conscience de soi." },
          { label: "Humanisation", detail: "Langage, normes et coopération se développent dans la relation sociale." },
          { label: "Conflit", detail: "Son regard ou ses intérêts peuvent aussi limiter mes possibilités." },
        ],
        observation: "Autrui n’est ni absolument bienfaisant ni absolument hostile.",
        check: q("Pourquoi autrui est-il indispensable selon Malson ?", "Parce que l’humanisation dépend du milieu social", "Parce qu’il supprime toute liberté", "Parce qu’il remplace l’État", "Parce qu’il rend la mémoire inutile"),
        extraQuestions: [
          { prompt: "Selon Sartre, comment obtenir une vérité sur soi ?", options: ["En passant par l’autre", "En restant seul avec sa conscience", "En consultant l’État", "En refusant tout regard extérieur"], correctIndex: 0, explanation: "« Pour obtenir une vérité quelconque sur moi, il faut que je passe par l’autre. »", sourceLabel: "I-B La relation à autrui", points: 2 },
          { prompt: "Complète Malson : « l’homme n’est rien d’autre que … aussi légères qu’une transparente vapeur »", options: ["des virtualités", "des certitudes", "des lois", "des passions"], correctIndex: 0, explanation: "Sans le groupe, l’homme n’est que virtualités, un simple animal.", sourceLabel: "Activité d’application 2", points: 1 },
          { prompt: "Quel courant Hegel et Sartre rejettent-ils ?", options: ["Le solipsisme, l’existence solitaire de la conscience", "Le contrat social", "La thèse naturaliste", "Le monopole de la violence"], correctIndex: 0, explanation: "Ils refusent l’idée d’une conscience isolée défendue par Descartes et Leibniz.", sourceLabel: "I-B La relation à autrui", points: 2 },
        ],
        distractors: ["Autrui est toujours mon ennemi.", "La relation sociale empêche toute connaissance de soi.", "L’humanité se développe sans aucun apprentissage social."],
      },
      {
        id: "state-nation",
        title: "État, droit et nation",
        summary: "Distinguer l’organisation politique de l’unité historique et spirituelle d’un peuple.",
        conceptTitle: "Organiser et unir la société",
        explanation: "L’État exerce une autorité juridique et politique sur un territoire ; par le droit et la justice, il doit protéger sécurité et liberté. La nation repose aussi sur des souvenirs partagés et la volonté actuelle de continuer à vivre ensemble.",
        bodyMarkdown: String.raw`## A. La nécessité de l’État

> **Définition.** L’État est une **forme d’organisation politico-administrative et juridique** exerçant une autorité sur un territoire défini.

Avec son avènement, les hommes **sortent de l’état de nature** en aliénant une part de leur liberté individuelle pour obtenir l’**assurance de leur droit** et de la **justice**. Par le respect des lois — le droit positif —, l’État garantit la liberté et la sécurité.

> **SPINOZA**, *Traité théologico-politique* : « (…) La fin de l’État n’est pas de faire passer les hommes de la condition d’êtres raisonnables à celle de bêtes brutes (…). **La fin de l’État est donc en réalité la liberté.** »

Le **droit** vise la **justice** — l’équité, l’égalité, « attribuer à chacun ce qui lui revient ». Pour **ROUSSEAU** (*Du Contrat social*), les lois sont l’**émanation de la volonté générale**, édictées par l’ensemble des citoyens.

## B. La nation, garante de l’unité sociale

La **Nation** se distingue de l’État : elle implique une **unité spontanée**, là où l’État relève d’une organisation plus ou moins artificielle. *Une nation peut survivre partagée entre plusieurs États ; un État peut comprendre plusieurs nations.*

Deux conditions la réalisent :

| Conditions | Contenu |
|---|---|
| **Objectives** | liens géographiques, ethniques, linguistiques, politiques, religieux |
| **Subjectives** | la formation d’une **conscience nationale** |

> **Ernest RENAN** (1823–1892), *Qu’est-ce qu’une nation ?* : une nation est « **une âme, un principe spirituel** » — d’un côté « la possession en commun d’un riche legs de souvenirs », de l’autre « **le désir de vivre ensemble**, la volonté de continuer à faire valoir l’héritage qu’on a reçu indivis ».

> **À retenir.** L’État **organise** par les institutions ; la nation **unit** par une histoire, une conscience et un projet communs. Les deux sont étroitement liés.`,
        keyPoint: "L’État organise par les institutions ; la nation unit par une histoire, une conscience et un projet communs.",
        example: "Spinoza fait de la liberté la fin de l’État ; Renan décrit la nation comme un héritage partagé et un consentement présent.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "État et nation",
          instruction: "Sélectionne un élément pour distinguer l’organisation politique de l’unité d’un peuple.",
          observation: "Un État peut comprendre plusieurs nations, et une nation peut exister au-delà d’un seul État.",
          rootLabel: "Organiser et unir la société",
          rootDetail: "L’État organise par le droit ; la nation unit par une conscience commune",
          nodes: [
            { id: "etat", group: "L’État (organiser)", label: "Le rôle de l’État", role: "Garantir la liberté", detail: "Organisation politico-administrative et juridique. Spinoza : « La fin de l’État est donc en réalité la liberté » (Traité théologico-politique). L’État protège par le droit contre les injustices." },
            { id: "droit", group: "L’État (organiser)", label: "Le droit et la justice", role: "La volonté générale", detail: "Le droit vise la justice — attribuer à chacun son dû. Rousseau : les lois sont l’émanation de la volonté générale, édictées par l’ensemble des citoyens (Du Contrat social)." },
            { id: "objectives", group: "La Nation (unir)", label: "Les conditions objectives", role: "Les liens concrets", detail: "La nation est une unité organique aux liens multiples : géographiques, ethniques, linguistiques, politiques, religieux." },
            { id: "subjectives", group: "La Nation (unir)", label: "Les conditions subjectives", role: "La conscience nationale", detail: "Renan : la nation est « une âme, un principe spirituel » — la possession commune de souvenirs et « le désir de vivre ensemble » (Qu’est-ce qu’une nation ?)." },
          ],
        },
        mapTitle: "De la règle à l’unité",
        mapInstruction: "Distingue les concepts et leurs fonctions.",
        map: [
          { label: "État", detail: "Institutions politiques, administratives et juridiques exerçant l’autorité." },
          { label: "Droit et justice", detail: "Règles et institutions destinées à garantir les droits et réparer les torts." },
          { label: "Nation", detail: "Mémoire commune, liens objectifs et volonté de poursuivre une vie collective." },
        ],
        observation: "Un État peut comprendre plusieurs nations, et une nation peut exister au-delà d’un seul État.",
        check: q("Quelle formule résume la nation selon Renan ?", "Un héritage commun et le désir actuel de vivre ensemble", "Une administration sans mémoire", "Un territoire sans population", "Une autorité sans consentement"),
        extraQuestions: [
          { prompt: "Selon Spinoza, quelle est la fin de l’État ?", options: ["La liberté", "La richesse", "La guerre", "L’obéissance aveugle"], correctIndex: 0, explanation: "« La fin de l’État est donc en réalité la liberté » (Traité théologico-politique).", sourceLabel: "Activité d’application 2", points: 2 },
          { prompt: "Quelle est la bonne définition du droit ?", options: ["L’ensemble des droits et devoirs régissant la vie sociale", "L’ensemble des droits de l’homme uniquement", "Tout ce qui est juste et honnête", "Ce à quoi j’ai droit personnellement"], correctIndex: 0, explanation: "Le droit régit droits et devoirs dans la vie sociale.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "Pour Rousseau, les lois sont l’émanation de…", options: ["la volonté générale", "la volonté d’un seul homme", "la nature", "la religion"], correctIndex: 0, explanation: "Les lois sont édictées par l’ensemble des citoyens (Du Contrat social).", sourceLabel: "II-A La nécessité de l’État", points: 2 },
        ],
        distractors: ["État et nation sont toujours exactement identiques.", "Le droit a pour but de supprimer toute liberté.", "La nation dépend seulement de la géographie."],
      },
      {
        id: "social-violence",
        title: "La violence sociale",
        summary: "Analyser les conflits avec autrui et la violence légitime ou abusive de l’État.",
        conceptTitle: "Protéger sans opprimer",
        explanation: "Les intérêts, le désir de domination et l’agressivité rendent les relations sociales conflictuelles. L’État utilise une contrainte légale pour protéger les citoyens, mais ce pouvoir peut devenir arbitraire et aliéner ceux qu’il devait servir.",
        bodyMarkdown: String.raw`## A. Les relations conflictuelles avec autrui

> **Définition.** La violence est l’**usage abusif de la force** : asservir, faire souffrir, aliéner ou anéantir un individu ou un groupe.

Selon **HEGEL** et **SARTRE**, autrui se révèle à moi dans un **conflit originel**.

- Chez **HEGEL**, ce conflit débouche sur la **reconnaissance mutuelle** : c’est la *dialectique du maître et de l’esclave* (*La Phénoménologie de l’esprit*). Chaque conscience y acquiert un statut — dominant ou dominé.
- Chez **SARTRE**, autrui « est un autre moi, c’est le moi qui n’est pas moi ». Le conflit se vit jusque dans la **honte** : « La honte est toujours honte devant quelqu’un (…). J’ai honte de moi tel que j’apparais à autrui » (*L’être et le néant*). Autrui me **chosifie** et me prive de ma liberté.

C’est pourquoi la force de l’État se révèle nécessaire à l’harmonie sociale.

## B. La violence nécessaire de l’État

**MACHIAVEL** (1469–1527) souligne que, en politique, ce qui compte d’abord, c’est l’**efficacité** : la violence est un moyen de maintenir l’ordre. Elle est un **mal nécessaire**.

> **MACHIAVEL**, *Le Prince* : « Qui veut faire entièrement profession d’homme de bien ne peut éviter sa perte parmi tant d’autres qui ne sont pas bons. »

| Penseur | Ce qu’il apporte |
|---|---|
| **Max WEBER** | L’État a le **monopole de la violence légitime**, exercé par trois pouvoirs : **législatif, exécutif, judiciaire**. |
| **Louis ALTHUSSER** | L’État agit par des **appareils idéologiques** (A.I.E. : médias, école, religion, culture) et des **appareils répressifs** (A.R.E. : police, armée, justice). |

> **À retenir.** La force publique n’est **légitime** que réglée par le droit et orientée vers la liberté et la justice. Une loi n’est pas juste par le seul fait d’exister : elle doit pouvoir être évaluée au regard des droits.`,
        keyPoint: "La force publique n’est légitime que si elle est réglée par le droit et orientée vers la liberté et la justice.",
        example: "Une sanction judiciaire respecte une procédure commune ; une violence arbitraire détourne la puissance de l’État de sa finalité.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "La violence dans l’espace social",
          instruction: "Sélectionne un élément pour distinguer le conflit privé et la violence de l’État.",
          observation: "La violence traverse les relations privées ; l’État en revendique le monopole, qui n’est légitime que réglé par le droit.",
          rootLabel: "La violence sociale",
          rootDetail: "Du conflit avec autrui au monopole de l’État",
          nodes: [
            { id: "hegel", group: "Le conflit avec autrui", label: "Hegel", role: "Maître et esclave", detail: "Autrui se révèle dans un conflit originel qui débouche sur la reconnaissance mutuelle : la dialectique du maître et de l’esclave (La Phénoménologie de l’esprit)." },
            { id: "sartre-conflit", group: "Le conflit avec autrui", label: "Sartre", role: "La honte et la chosification", detail: "« La honte est toujours honte devant quelqu’un » : sous le regard d’autrui, je deviens un objet. Autrui me chosifie et me prive de ma liberté (L’être et le néant)." },
            { id: "machiavel", group: "La violence de l’État", label: "Machiavel", role: "Le mal nécessaire", detail: "En politique, l’efficacité prime : la violence maintient l’ordre. « Qui veut faire entièrement profession d’homme de bien ne peut éviter sa perte » (Le Prince)." },
            { id: "weber", group: "La violence de l’État", label: "Max Weber", role: "Le monopole légitime", detail: "L’État détient le monopole de la violence légitime, exercé par trois pouvoirs : législatif, exécutif et judiciaire." },
            { id: "althusser", group: "La violence de l’État", label: "Althusser", role: "A.I.E. et A.R.E.", detail: "L’État agit par des appareils idéologiques (médias, école, religion) et des appareils répressifs (police, armée, justice)." },
          ],
        },
        mapTitle: "Quand la force devient-elle légitime ?",
        mapInstruction: "Compare conflit privé, contrainte légale et oppression.",
        map: [
          { label: "Conflit", detail: "Les individus peuvent se nuire en poursuivant leurs intérêts." },
          { label: "Contrainte légale", detail: "L’État limite certains actes afin de protéger les droits de tous." },
          { label: "Abus de pouvoir", detail: "La force devient oppression lorsqu’elle n’obéit plus au droit ni à l’intérêt commun." },
        ],
        observation: "Une loi n’est pas juste par le seul fait qu’elle existe ; elle doit pouvoir être évaluée au regard des droits.",
        check: q("À quelle condition la contrainte de l’État peut-elle être légitime ?", "Lorsqu’elle est réglée par le droit et protège les libertés", "Lorsqu’elle sert les intérêts d’un seul groupe", "Lorsqu’elle échappe à toute règle", "Lorsqu’elle interdit toute critique"),
        extraQuestions: [
          { prompt: "Selon Max Weber, que détient l’État ?", options: ["Le monopole de la violence légitime", "Le monopole du commerce", "Le refus de toute contrainte", "La suppression des lois"], correctIndex: 0, explanation: "Ce monopole s’exerce par les pouvoirs législatif, exécutif et judiciaire.", sourceLabel: "III-B La violence nécessaire de l’État", points: 2 },
          { prompt: "Chez Sartre, que fait le regard d’autrui ?", options: ["Il me chosifie et me fait honte devant quelqu’un", "Il me rend invisible", "Il supprime la société", "Il garantit ma richesse"], correctIndex: 0, explanation: "« J’ai honte de moi tel que j’apparais à autrui » (L’être et le néant).", sourceLabel: "III-A Les relations conflictuelles", points: 2 },
          { prompt: "Que distingue Althusser dans les moyens de l’État ?", options: ["Les appareils idéologiques (école, médias) et répressifs (police, armée)", "Le pouvoir spirituel et le pouvoir divin", "La nation et le territoire", "Le droit naturel et le droit positif"], correctIndex: 0, explanation: "Par les A.I.E. l’État impose sa doctrine, par les A.R.E. il exerce la coercition.", sourceLabel: "III-B La violence nécessaire de l’État", points: 3 },
        ],
        distractors: ["Toute violence de l’État est automatiquement juste.", "Les relations sociales sont toujours pacifiques.", "La justice consiste à obéir à la force la plus grande."],
      },
    ],
    mission: {
      title: "Sujet BAC : « Autrui est-il absolument mon ennemi ? »",
      scenario: "Traite la situation officielle en examinant le conflit possible avec autrui puis son rôle indispensable dans la construction de soi.",
      problem: "Mon semblable est-il nécessairement nuisible ?",
      bodyMarkdown: String.raw`## Le corrigé du sujet

### I. Définition des termes essentiels

| Terme | Définition |
|---|---|
| **Autrui** | mon semblable, mon prochain |
| **Absolument** | forcément, toujours |
| **Ennemi** | celui qui cherche à me nuire, à me détruire |

### II. Problème à analyser

> **Autrui est-il nécessairement nuisible ?**

### III. Axes d’analyse et références

**Axe 1 — Autrui se présente comme mon ennemi.**

- Autrui est source de gêne et d’angoisse : son regard, ses actes me dépouillent de mes possibilités. *Cf.* **SARTRE**, *L’être et le néant* : « Je saisis le regard de l’autre (…) comme solidification et aliénation de mes propres possibilités » ; *Huis clos* : « **L’enfer, c’est les autres.** »
- Autrui est un être égoïste qui vise à m’instrumentaliser. *Cf.* **NIETZSCHE**, *Par-delà le bien et le mal* : « Vivre, c’est essentiellement dépouiller, blesser, violenter le faible » ; **FREUD**, *Malaise dans la civilisation* : l’homme « est tenté de satisfaire son besoin d’agression aux dépens de son prochain ».

**Axe 2 — Autrui est indispensable.**

- L’homme est naturellement porté à vivre en société. *Cf.* **ARISTOTE**, *La Politique* : « L’homme est par nature un animal politique. »
- Le prochain est indispensable à mon humanisation : coupé du milieu social, je reste un simple animal. *Cf.* **Seydou BADIAN**, *Sous l’orage* : « L’homme n’est rien sans les autres. »
- Autrui est une source d’enrichissement. *Cf.* **SAINT-EXUPÉRY**, *Terre des hommes* : « Si tu diffères de moi, mon frère, loin de me léser, **tu m’enrichis**. »

> **Le geste attendu.** Défendre sérieusement le conflit (Axe 1) avant de montrer qu’autrui **conditionne mon humanité** (Axe 2). La réponse nuancée : autrui peut être un rival, mais non un ennemi *absolu*, puisque sans lui je ne deviendrais pas moi-même.`,
      plan: [
        { label: "Définir", shortLabel: "Définir", detail: "Autrui : mon prochain ; absolument : toujours ; ennemi : celui qui cherche à me nuire." },
        { label: "Axe 1", shortLabel: "Axe 1", detail: "Autrui comme ennemi : le regard aliénant (Sartre, « l’enfer c’est les autres »), l’égoïsme (Nietzsche) et l’agressivité (Freud)." },
        { label: "Axe 2", shortLabel: "Axe 2", detail: "Autrui indispensable : la sociabilité (Aristote), l’humanisation (Seydou Badian) et l’enrichissement (Saint-Exupéry)." },
        { label: "Réponse", shortLabel: "Réponse", detail: "Autrui peut être rival, mais non ennemi absolu : il conditionne ma conscience de soi et mon humanité." },
      ],
      modelAnswer: "Autrui devient parfois un adversaire par le conflit des intérêts, mais sa présence est indispensable à la conscience de soi, à l’éducation et à la coopération.",
      questions: [
        q("Que signifie « absolument » dans le sujet ?", "Nécessairement et dans tous les cas", "Parfois seulement", "Juridiquement", "Naturellement heureux"),
        q("Quelle référence défend le rôle positif d’autrui ?", "Malson : l’homme ne devient humain que dans le milieu social", "Sartre : l’enfer, c’est les autres", "Freud : l’agressivité appartient à l’homme", "Nietzsche : vivre implique de violenter"),
        q("Quelle réponse évite le faux choix ?", "Autrui peut être conflictuel tout en restant indispensable à mon humanisation", "Autrui est toujours ennemi", "Autrui est toujours bienveillant", "La relation à autrui ne concerne pas la liberté"),
      ],
      extraQuestions: [
        { prompt: "Quelle citation de Sartre illustre le conflit avec autrui ?", options: ["« L’enfer, c’est les autres » (Huis clos)", "« L’homme est par nature un animal politique »", "« Si tu diffères de moi, tu m’enrichis »", "« L’homme n’est rien sans les autres »"], correctIndex: 0, explanation: "C’est la formule de Huis clos, mobilisée à l’Axe 1.", sourceLabel: "Situation d’évaluation – Axe 1", points: 2 },
        { prompt: "Quel auteur ivoirien illustre l’humanisation par autrui ?", options: ["Seydou Badian : « L’homme n’est rien sans les autres » (Sous l’orage)", "Nietzsche : « Vivre, c’est violenter »", "Freud : « une bonne somme d’agressivité »", "Machiavel : le mal nécessaire"], correctIndex: 0, explanation: "Seydou Badian soutient l’Axe 2 : autrui est indispensable.", sourceLabel: "Situation d’évaluation – Axe 2", points: 3 },
        { prompt: "Que soutient Saint-Exupéry sur la différence d’autrui ?", options: ["« Si tu diffères de moi, loin de me léser, tu m’enrichis »", "La différence est une menace mortelle", "Autrui doit être supprimé", "La solitude vaut mieux que la société"], correctIndex: 0, explanation: "La différence enrichit : autrui n’est pas un ennemi absolu (Terre des hommes).", sourceLabel: "Situation d’évaluation – Axe 2", points: 2 },
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
        bodyMarkdown: String.raw`## Dieu, être sacré

Dans la religion, **Dieu est un être surnaturel, sacré, objet de déférence** : admiration, respect, vénération. Ses qualités — **omnipotence, omniscience, omniprésence, bonté, perfection** — font de lui un être **transcendant** qui peut se révéler aux hommes.

## Deux définitions de la religion

> **André LALANDE** : la religion est « une **institution sociale** caractérisée par l’existence d’une communauté d’individus unis par la croyance en une **valeur absolue : Dieu**. »

> **Émile DURKHEIM**, *Les formes élémentaires de la vie religieuse* : « une religion est un **système solidaire de croyances et de pratiques** relatives à des **choses sacrées**, c’est-à-dire séparées, interdites (…), qui unissent en une même communauté morale tous ceux qui y adhèrent. »

## Le sacré et le profane

Ces définitions montrent que la religion ne se réduit pas à une croyance individuelle : elle **relie** (lien vertical à Dieu, lien horizontal entre les hommes) et distingue le **sacré** du **profane**.

> **Astuce mémoire.** Lalande insiste sur la **valeur absolue** (Dieu) ; Durkheim insiste sur le **système collectif** (croyances + pratiques + communauté). Deux angles, une même réalité.`,
        keyPoint: "Dieu est l’objet central de la foi ; la religion est l’ensemble organisé de croyances, rites et obligations liés au sacré.",
        example: "Un rite n’est pas un simple geste habituel : pour le croyant, il met en relation le monde profane et une réalité sacrée.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "Dieu et la religion",
          instruction: "Sélectionne un élément pour voir comment le document définit Dieu et la religion.",
          observation: "La religion ne se réduit pas à une croyance privée : elle relie une communauté au sacré.",
          rootLabel: "Dieu, fondement de la religion",
          rootDetail: "Un être sacré, et deux façons de définir la religion",
          nodes: [
            { id: "qualites", group: "Dieu, être sacré", label: "Les qualités de Dieu", role: "Un être transcendant", detail: "Omnipotence, omniscience, omniprésence, bonté, perfection : ces qualités font de Dieu un être surnaturel et transcendant, objet de déférence, qui peut se révéler aux hommes." },
            { id: "sacre", group: "Dieu, être sacré", label: "Le sacré et le profane", role: "Une réalité séparée", detail: "Le sacré est ce qui est séparé, interdit, doté d’une valeur religieuse particulière, par opposition au profane." },
            { id: "lalande", group: "Deux définitions de la religion", label: "Lalande", role: "La valeur absolue", detail: "« Une institution sociale caractérisée par l’existence d’une communauté d’individus unis par la croyance en une valeur absolue : Dieu. »" },
            { id: "durkheim", group: "Deux définitions de la religion", label: "Durkheim", role: "Le système collectif", detail: "« Un système solidaire de croyances et de pratiques relatives à des choses sacrées (…) qui unissent en une même communauté morale tous ceux qui y adhèrent » (Les formes élémentaires de la vie religieuse)." },
          ],
        },
        mapTitle: "Du sacré à la pratique",
        mapInstruction: "Distingue les notions essentielles.",
        map: [
          { label: "Dieu", detail: "Être suprême ou principe absolu reconnu par la croyance." },
          { label: "Sacré", detail: "Ce qui est séparé du profane et reçoit une valeur religieuse particulière." },
          { label: "Religion", detail: "Croyances, rites et règles qui unissent les fidèles au sacré et entre eux." },
        ],
        observation: "Définir la religion uniquement comme croyance individuelle ferait oublier sa dimension collective et pratique.",
        check: q("Que comprend une religion au-delà de la foi personnelle ?", "Des rites, des règles et une communauté liés au sacré", "Uniquement une théorie scientifique", "Seulement des émotions privées", "Une absence totale d’obligations"),
        extraQuestions: [
          { prompt: "« La religion est une institution sociale basée sur la croyance en Dieu » : vrai ou faux ?", options: ["Vrai", "Faux : elle a l’homme pour objet", "Faux : elle est purement individuelle", "Faux : elle exclut toute communauté"], correctIndex: 0, explanation: "C’est la définition de Lalande.", sourceLabel: "Activité d’application", points: 1 },
          { prompt: "« La religion se rapporte à des croyances et pratiques ayant l’homme pour objet » : vrai ou faux ?", options: ["Faux : elle a Dieu pour objet", "Vrai", "Vrai selon Durkheim", "Faux : elle n’a aucun objet"], correctIndex: 0, explanation: "La religion a Dieu, non l’homme, pour objet.", sourceLabel: "Activité d’application", points: 2 },
          { prompt: "Comment Durkheim définit-il la religion ?", options: ["Un système solidaire de croyances et de pratiques relatives à des choses sacrées", "Une simple émotion privée", "Une théorie scientifique du monde", "Une morale sans communauté"], correctIndex: 0, explanation: "Durkheim insiste sur le système collectif et les choses sacrées.", sourceLabel: "I-A Dieu, être sacré", points: 2 },
        ],
        distractors: ["Dieu et religion sont strictement synonymes.", "Le sacré ne se distingue jamais du profane.", "Toute religion est dépourvue de pratiques collectives."],
      },
      {
        id: "criticism-god",
        title: "Les critiques de Dieu",
        summary: "Comprendre les objections qui voient dans l’idée de Dieu une projection ou une aliénation.",
        conceptTitle: "Quand la croyance est mise en question",
        explanation: "La raison ne peut pas vérifier Dieu comme un fait observable. Feuerbach interprète Dieu comme projection des qualités humaines ; Marx critique une religion qui console de la misère au lieu d’en supprimer les causes.",
        bodyMarkdown: String.raw`## Concept de Dieu ≠ existence de Dieu

Il faut distinguer « **le concept ou l’idée de Dieu** » de « **l’existence de Dieu** ». Pour **KANT** (1724–1804), que Dieu soit conçu comme un être parfait **ne prouve pas** qu’il existe : *l’existence d’un être ne dérive pas de son essence*.

> **KANT**, *Critique de la raison pure* : « Quand je conçois une chose (…), en ajoutant de plus que cette chose existe, **je n’ajoute rien à cette chose** (…). Il nous faut cependant **sortir de ce concept** pour attribuer à l’objet son existence. »

En conséquence, pour Kant, **toute preuve de l’existence de Dieu est une spéculation, une illusion de la raison**.

## Le problème du mal

On comprend difficilement que Dieu soit **parfait**, qu’il ait créé le monde, et que le **mal** s’y trouve pourtant inscrit. **L’existence du mal semble contredire la perfection de Dieu** — argument des **athées** qui nient son existence.

## Feuerbach : la théologie est une anthropologie

Pour **FEUERBACH**, Dieu est une **projection** : l’homme prête à Dieu ses propres qualités idéales, puis s’incline devant sa création.

> **FEUERBACH**, *L’essence du christianisme* : « Ce qui est le propre de l’esprit humain (…), c’est cela son Dieu : Dieu est (…) le soi exprimé de l’homme. »

> **À retenir.** Ces critiques ne visent pas seulement la *preuve* de Dieu : elles demandent si l’homme ne **transfère pas à Dieu sa propre puissance**, au risque de perdre sa liberté.`,
        keyPoint: "La critique ne réfute pas seulement une croyance : elle demande si l’homme transfère à Dieu sa propre puissance et sa liberté.",
        example: "Pour Kant, ajouter « cette chose existe » n’ajoute rien au concept : il faut sortir du concept pour atteindre l’existence.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "Peut-on prouver Dieu ?",
          instruction: "Sélectionne une objection pour comprendre ce qu’elle conteste.",
          observation: "Les critiques portent tantôt sur la preuve de Dieu, tantôt sur ses effets sur la liberté humaine.",
          rootLabel: "Les critiques de l’existence de Dieu",
          rootDetail: "Du concept à l’existence, et de l’existence à la projection",
          nodes: [
            { id: "kant-preuve", group: "L’objection de Kant", label: "Concept n’est pas existence", role: "L’existence ne dérive pas de l’essence", detail: "Concevoir Dieu parfait ne prouve pas qu’il existe. « Il nous faut sortir de ce concept pour attribuer à l’objet son existence » (Critique de la raison pure). Toute preuve est une illusion de la raison." },
            { id: "mal", group: "Le problème du mal", label: "L’existence du mal", role: "Une contradiction", detail: "Si Dieu est parfait et créateur, comment le mal peut-il exister dans le monde ? Le mal semble contredire la perfection divine — argument des athées." },
            { id: "feuerbach", group: "La projection", label: "Feuerbach", role: "La théologie est une anthropologie", detail: "Dieu est une projection des qualités humaines : « Dieu est (…) le soi exprimé de l’homme » (L’essence du christianisme). L’homme s’incline devant sa propre création." },
            { id: "athees", group: "La projection", label: "L’athéisme", role: "Nier l’existence de Dieu", detail: "Faute de preuve et devant le problème du mal, les athées nient l’existence de Dieu, qu’ils tiennent pour un produit de l’imagination humaine." },
          ],
        },
        mapTitle: "La logique de l’aliénation",
        mapInstruction: "Suis le transfert dénoncé par les critiques.",
        map: [
          { label: "Projection", detail: "L’homme attribue à Dieu des qualités idéales qu’il possède ou désire." },
          { label: "Soumission", detail: "Il traite ensuite cette création comme une puissance extérieure supérieure." },
          { label: "Aliénation", detail: "Il perd la maîtrise de sa raison ou de son action au profit de cette puissance." },
        ],
        observation: "La critique de la religion porte ici sur ses effets humains et politiques, pas seulement sur la preuve de Dieu.",
        check: q("Que signifie l’aliénation religieuse chez Feuerbach ?", "L’homme projette ses qualités en Dieu puis se soumet à cette projection", "La religion augmente toujours la liberté", "Dieu est une expérience scientifique", "Le rite remplace toute société"),
        extraQuestions: [
          { prompt: "« Pour Kant, l’idée ou le concept de Dieu coïncide avec son existence » : vrai ou faux ?", options: ["Faux", "Vrai", "Vrai selon la Critique de la raison pure", "Vrai pour les athées"], correctIndex: 0, explanation: "Kant sépare précisément le concept de l’existence.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "« Pour Feuerbach, la théologie est une anthropologie » : vrai ou faux ?", options: ["Vrai : Dieu est le soi exprimé de l’homme", "Faux", "Faux : Feuerbach défend l’existence de Dieu", "Vrai selon Kant"], correctIndex: 0, explanation: "Pour Feuerbach, parler de Dieu, c’est parler de l’homme projeté.", sourceLabel: "Activité d’application 1", points: 2 },
          { prompt: "Quel argument les athées opposent-ils à la perfection de Dieu ?", options: ["L’existence du mal dans le monde", "L’absence de fidèles", "La diversité des religions", "La beauté de la nature"], correctIndex: 0, explanation: "Le mal semble incompatible avec un créateur parfait.", sourceLabel: "I-B Les critiques de l’existence de Dieu", points: 2 },
        ],
        distractors: ["Marx voit dans la religion une transformation politique immédiate.", "Critiquer la religion consiste seulement à interdire les rites.", "La projection rend l’homme plus autonome."],
      },
      {
        id: "roles-religion",
        title: "Les fonctions de la religion",
        summary: "Étudier la cohésion sociale, la consolation existentielle et l’éducation morale.",
        conceptTitle: "Relier, rassurer et moraliser",
        explanation: "La religion unit les fidèles par des croyances et rites communs, donne une réponse à l’angoisse de la mort et propose des règles morales. Durkheim insiste sur la cohésion sociale ; Bergson sur la réponse religieuse à la peur de la mort.",
        bodyMarkdown: String.raw`## A. Facteur de cohésion sociale et de libération

Le mot vient du latin *religio* : un **lien vertical** (l’homme à Dieu) et un **lien horizontal** (les hommes entre eux). La fonction première de la religion est de **rassembler** autour d’un idéal communautaire.

> **PROUDHON** : « C’est la religion qui **cimenta les fondements des sociétés**, qui donna l’unité et la personnalité aux nations. »

**BERGSON** (*Les deux sources de la morale et de la religion*) lui reconnaît une **triple fonction** :

1. une **assurance** contre la désorganisation, grâce aux interdits ;
2. une **protection** contre la dépression et l’angoisse de la mort ;
3. une **quiétude** face à l’imprévisibilité de l’existence.

> **HEGEL** : « La religion est la **vraie libération de l’homme** » (Leçons sur la philosophie de la religion). Et **FREUD** : elle « nous éclaire sur l’origine (…) nous assure (…) la protection divine et la béatitude finale » (L’avenir d’une illusion).

## B. Source de moralisation de l’homme

La **morale** — l’ensemble des règles de conduite jugées bonnes — trouve, pour le croyant, son fondement dans la religion (amour du prochain, partage, communion fraternelle). En les pratiquant, le croyant **s’humanise**.

> **KANT**, *La religion dans les limites de la simple raison* : « **La religion est la connaissance de tous nos devoirs comme des commandements divins.** (…) L’homme puise à cette source la claire vision que sa bonne conduite seule le rend digne du bonheur. »

Pour Kant, il n’y a donc **pas de différence entre la morale et la religion**.`,
        keyPoint: "La religion peut soutenir l’individu psychologiquement et la société moralement, sans que ces fonctions prouvent à elles seules la vérité de ses croyances.",
        example: "Une cérémonie collective console une famille tout en renforçant les liens et les obligations d’entraide du groupe.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "À quoi sert la religion ?",
          instruction: "Sélectionne une fonction pour voir l’auteur qui l’éclaire.",
          observation: "Cohésion, consolation et morale expliquent la force humaine de la religion — sans prouver à elles seules la vérité de ses croyances.",
          rootLabel: "Les fonctions de la religion",
          rootDetail: "Relier les hommes, apaiser leurs angoisses, fonder la morale",
          nodes: [
            { id: "proudhon", group: "Cohésion et libération", label: "Proudhon", role: "Cimenter les sociétés", detail: "« C’est la religion qui cimenta les fondements des sociétés, qui donna l’unité et la personnalité aux nations. » Le lien religieux est aussi un lien social." },
            { id: "bergson", group: "Cohésion et libération", label: "Bergson", role: "La triple fonction", detail: "Assurance contre la désorganisation (les interdits), protection contre l’angoisse de la mort, quiétude face à l’imprévisible (Les deux sources de la morale et de la religion)." },
            { id: "hegel-freud", group: "Cohésion et libération", label: "Hegel et Freud", role: "Libérer et donner un sens", detail: "Hegel : « la religion est la vraie libération de l’homme ». Freud : elle éclaire sur l’origine du monde et promet « la protection divine et la béatitude finale »." },
            { id: "kant-morale", group: "Moralisation", label: "Kant", role: "Fonder la morale", detail: "« La religion est la connaissance de tous nos devoirs comme des commandements divins. » Pour Kant, il n’y a pas de différence entre la morale et la religion (La religion dans les limites de la simple raison)." },
          ],
        },
        mapTitle: "Trois fonctions concrètes",
        mapInstruction: "Compare les effets individuels et collectifs.",
        map: [
          { label: "Psychologique", detail: "Apaiser l’angoisse et donner une espérance face à la souffrance ou la mort." },
          { label: "Sociale", detail: "Créer une appartenance et des pratiques communes." },
          { label: "Morale", detail: "Encourager des devoirs, vertus et conduites jugées bonnes." },
        ],
        observation: "Une fonction utile ne suffit pas à établir la vérité philosophique d’une croyance, mais elle explique sa force humaine.",
        check: q("Quelle fonction Bergson associe-t-il à la religion ?", "Opposer à la mort l’image d’une continuation de la vie", "Supprimer toute morale", "Prouver Dieu expérimentalement", "Isoler tous les croyants"),
        extraQuestions: [
          { prompt: "Selon Proudhon, quel est le rôle social de la religion ?", options: ["Elle a cimenté les fondements des sociétés et donné l’unité aux nations", "Elle divise systématiquement les peuples", "Elle supprime toute morale", "Elle remplace l’État"], correctIndex: 0, explanation: "La religion est présentée comme génératrice d’organisation sociale.", sourceLabel: "II-A Facteur de cohésion sociale", points: 2 },
          { prompt: "Pour Kant, quel rapport entre morale et religion ?", options: ["Il n’y a pas de différence : la religion est nos devoirs comme commandements divins", "La morale contredit la religion", "La religion interdit la morale", "La morale n’a aucun fondement"], correctIndex: 0, explanation: "Kant identifie le devoir moral à un commandement divin.", sourceLabel: "II-B Source de moralisation", points: 2 },
          { prompt: "Relie : « (…) La religion est la vraie libération de l’homme. »", options: ["Hegel", "Voltaire", "Pascal", "Gabriel Marcel"], correctIndex: 0, explanation: "Formule de Hegel (Leçons sur la philosophie de la religion).", sourceLabel: "Activité d’application 2", points: 2 },
        ],
        distractors: ["La religion ne joue aucun rôle social.", "La cohésion prouve automatiquement toute croyance.", "La religion augmente nécessairement les conflits."],
      },
      {
        id: "religion-freedom",
        title: "Religion et liberté",
        summary: "Distinguer obligation morale libre, soumission aveugle et fanatisme.",
        conceptTitle: "Croire sans renoncer à soi",
        explanation: "La foi peut orienter librement une conduite morale et donner un sens à l’existence. Elle devient cependant aliénante lorsqu’une autorité interdit l’examen rationnel, impose la peur ou justifie le fanatisme et la violence.",
        bodyMarkdown: String.raw`## A. La religion, source d’aliénation

La pratique religieuse exige des fidèles **sacrifices, renoncements et privations**, et **l’obéissance sans condition**. C’est en ce sens qu’elle peut apparaître comme un facteur d’**aliénation**.

> **Karl MARX**, *L’Idéologie allemande* : « Les hommes ont organisé leurs rapports en fonction des représentations qu’ils se faisaient de Dieu (…) ces produits de leur cerveau ont grandi jusqu’à les dominer (…). **Créateurs, ils se sont inclinés devant leurs propres créations.** »

Pour Marx, la vraie liberté ne serait possible que dans une société **sans religion** pour « endormir la conscience ».

## B. Liberté et obligation morale

Pourtant, les obligations morales de la religion ne **contredisent pas** la liberté : elles la **présupposent**. L’homme conscient exerce son **libre-arbitre** — il choisit de croire ou non, de faire le bien ou le mal.

Avec **KANT**, le devoir est un **impératif catégorique** : un commandement qui s’impose **sans condition** (contrairement à l’impératif *hypothétique*, subordonné à un intérêt).

| Impératif | Caractère |
|---|---|
| **Catégorique** | s’impose sans condition, par pur devoir |
| **Hypothétique** | subordonné à un besoin, une utilité, un intérêt |

> **À retenir.** Obéir par **conviction réfléchie** n’est pas s’aliéner. La pratique religieuse ne menace la liberté que lorsqu’elle impose une **obéissance aveugle** ou justifie le **fanatisme** et la violence.`,
        keyPoint: "La pratique religieuse est compatible avec la liberté lorsqu’elle engage la conscience plutôt qu’une obéissance aveugle.",
        example: "Respecter une règle par conviction réfléchie n’a pas le même sens que l’appliquer sous la menace ou contre la dignité d’autrui.",
        interaction: {
          kind: "diagram",
          eyebrow: "Explorer",
          title: "La religion libère-t-elle ou aliène-t-elle ?",
          instruction: "Sélectionne une position pour voir son argument et son auteur.",
          observation: "La foi n’aliène pas quand elle engage une conscience libre ; elle aliène quand elle exige une obéissance aveugle.",
          rootLabel: "Religion et liberté",
          rootDetail: "De l’aliénation dénoncée à l’obligation morale librement assumée",
          nodes: [
            { id: "marx", group: "La religion aliène", label: "Marx", role: "S’incliner devant sa création", detail: "« Créateurs, ils se sont inclinés devant leurs propres créations » (L’Idéologie allemande). La religion endort la conscience et soustrait l’homme à ses responsabilités." },
            { id: "libre-arbitre", group: "Liberté et obligation compatibles", label: "Le libre-arbitre", role: "Choisir de croire", detail: "L’homme conscient exerce son libre-arbitre : il choisit de croire ou non, de faire le bien ou le mal. L’obligation morale présuppose donc la liberté." },
            { id: "kant-imperatif", group: "Liberté et obligation compatibles", label: "Kant : l’impératif catégorique", role: "Un devoir sans condition", detail: "Le devoir moral est un impératif catégorique — un commandement qui s’impose sans condition, non une contrainte subie. Obéir par conviction n’est pas s’aliéner." },
          ],
        },
        mapTitle: "De l’obligation à l’aliénation",
        mapInstruction: "Repère le critère qui fait changer la valeur de la pratique.",
        map: [
          { label: "Foi réfléchie", detail: "Le sujet comprend et assume librement son engagement." },
          { label: "Obligation morale", detail: "La règle oriente l’action vers le respect d’autrui et la maîtrise de soi." },
          { label: "Fanatisme", detail: "La croyance refuse toute critique et peut justifier domination ou violence." },
        ],
        observation: "Le problème n’est pas seulement d’obéir, mais de savoir si l’obligation peut être reconnue par une conscience libre.",
        check: q("Quand une pratique religieuse menace-t-elle clairement la liberté ?", "Lorsqu’elle impose une obéissance aveugle et justifie la violence", "Lorsqu’elle invite à réfléchir", "Lorsqu’elle soutient l’entraide", "Lorsqu’elle respecte la dignité"),
        extraQuestions: [
          { prompt: "Selon Marx, comment la religion aliène-t-elle l’homme ?", options: ["L’homme s’incline devant ses propres créations (les représentations de Dieu)", "Elle supprime toute société", "Elle prouve l’existence de Dieu", "Elle renforce le libre-arbitre"], correctIndex: 0, explanation: "L’Idéologie allemande décrit ce renversement créateur/création.", sourceLabel: "III-A La religion, source d’aliénation", points: 2 },
          { prompt: "Qu’est-ce que l’impératif catégorique chez Kant ?", options: ["Un commandement qui s’impose sans condition", "Un conseil facultatif", "Un ordre subordonné à un intérêt", "Une contrainte imposée par la peur"], correctIndex: 0, explanation: "Il s’oppose à l’impératif hypothétique, subordonné à une condition.", sourceLabel: "III-B Liberté et obligation morale", points: 3 },
          { prompt: "Les obligations morales de la religion et la liberté sont-elles compatibles ?", options: ["Oui : l’obligation morale présuppose le libre-arbitre", "Non : toute obligation est une aliénation", "Non : la foi exclut la réflexion", "Oui, seulement sous la contrainte"], correctIndex: 0, explanation: "Le sujet conscient choisit de se soumettre ou non : la liberté est présupposée.", sourceLabel: "III-B Liberté et obligation morale", points: 2 },
        ],
        distractors: ["Toute obligation morale est une aliénation.", "La foi exclut nécessairement la réflexion.", "Le fanatisme garantit la liberté de conscience."],
      },
    ],
    mission: {
      title: "Sujet BAC : « Doit-on redouter la croyance religieuse ? »",
      scenario: "Traite la situation officielle en confrontant les risques d’aliénation et de fanatisme aux fonctions morales, sociales et existentielles de la religion.",
      problem: "Quel regard faut-il porter sur la foi religieuse et ses effets sur l’homme ?",
      bodyMarkdown: String.raw`## Le corrigé du sujet

### I. Définition des termes essentiels

| Terme | Définition |
|---|---|
| **Doit-on** | faut-il, est-il nécessaire de… |
| **Redouter** | craindre sérieusement, avoir une grande peur |
| **La croyance religieuse** | la croyance en la divinité, la foi religieuse |

### II. Problème à analyser

> **Quel regard doit-on porter sur la religion ?**

### III. Axes d’analyse et références

**Axe 1 — Il faut redouter la foi religieuse.**

- Elle est un obstacle à la liberté. *Cf.* **FEUERBACH** : « l’aliénation majeure est l’idée de Dieu dont les règles ont privé l’homme de sa liberté » ; **MARX** : « **la religion est l’opium du peuple** » (Critique de la philosophie du droit de Hegel).
- Elle entretient le fanatisme et la guerre. *Cf.* **KHOMEINI** : « la religion d’où la guerre est absente est une religion incomplète ».

**Axe 2 — La religion édifie l’homme.**

- Elle répond à l’angoisse existentielle. *Cf.* **BERGSON** : « À l’idée que la mort est inévitable, la religion oppose l’image d’une continuation de la vie après la mort. »
- Elle rend vertueux et consolide les liens. *Cf.* **PROUDHON** : elle « cimenta les fondements des sociétés ».
- Elle est inhérente à la nature humaine. *Cf.* **HEGEL** : « L’homme, seul être doué de raison, est aussi le seul animal religieux » ; **PASCAL**, le pari : « si vous gagnez, vous gagnez tout ; si vous perdez, vous ne perdez rien. Gagez donc qu’il est, sans hésiter » ; **Gabriel MARCEL** : « L’humain n’est authentiquement l’humain que là où il est soutenu par l’armature incorruptible du sacré. »

> **Le geste attendu.** Prendre au sérieux les dérives (Axe 1 : aliénation, fanatisme) avant de reconnaître les fonctions morales et existentielles (Axe 2). La réponse nuancée : **redouter les dérives, non condamner toute croyance réfléchie**.`,
      plan: [
        { label: "Définir", shortLabel: "Définir", detail: "Redouter : craindre fortement ; la croyance religieuse : la foi en la divinité." },
        { label: "Axe 1", shortLabel: "Axe 1", detail: "Il faut redouter la foi : l’aliénation (Feuerbach, Marx « l’opium du peuple ») et le fanatisme (Khomeini)." },
        { label: "Axe 2", shortLabel: "Axe 2", detail: "La religion édifie : réponse à l’angoisse (Bergson), cohésion (Proudhon), nature humaine (Hegel, Pascal, Gabriel Marcel)." },
        { label: "Réponse", shortLabel: "Réponse", detail: "Redouter les dérives aliénantes et fanatiques, sans condamner indistinctement toute croyance réfléchie." },
      ],
      modelAnswer: "La croyance mérite une vigilance critique lorsqu’elle aliène ou rend violent ; mais vécue dans le respect de la raison et d’autrui, elle peut donner sens, cohésion et exigence morale.",
      questions: [
        q("Quel problème le sujet pose-t-il ?", "La croyance religieuse est-elle nuisible ou peut-elle édifier l’homme ?", "Dieu est-il un objet mathématique ?", "La nation est-elle un rite ?", "La mémoire est-elle sacrée ?"),
        q("Quelle référence soutient la fonction consolatrice ?", "Bergson : la religion oppose à la mort l’image d’une continuation", "Marx : la religion est l’opium du peuple", "Feuerbach : Dieu est une aliénation", "Sartre : l’enfer, c’est les autres"),
        q("Quelle conclusion est la plus équilibrée ?", "Craindre les dérives aliénantes sans nier les fonctions morales et existentielles de la foi", "Condamner toute religion sans distinction", "Accepter toute croyance sans examen", "Éviter toute position argumentée"),
      ],
      extraQuestions: [
        { prompt: "Quelle formule de Marx illustre l’Axe 1 ?", options: ["« La religion est l’opium du peuple »", "« La religion est la vraie libération de l’homme »", "« L’homme est le seul animal religieux »", "« Gagez qu’il est, sans hésiter »"], correctIndex: 0, explanation: "Marx dénonce une religion qui console au lieu de transformer la société.", sourceLabel: "Situation d’évaluation – Axe 1", points: 2 },
        { prompt: "Que soutient Hegel sur l’homme et la religion (Axe 2) ?", options: ["« L’homme, seul être doué de raison, est aussi le seul animal religieux »", "La religion est l’opium du peuple", "La théologie est une anthropologie", "La religion prive l’homme de liberté"], correctIndex: 0, explanation: "La religion est présentée comme inhérente à la nature humaine.", sourceLabel: "Situation d’évaluation – Axe 2", points: 3 },
        { prompt: "En quoi consiste le pari de Pascal ?", options: ["Parier que Dieu est : on gagne tout, on ne perd rien", "Prouver mathématiquement Dieu", "Nier l’existence de Dieu", "Réduire la religion à la morale"], correctIndex: 0, explanation: "« Si vous gagnez, vous gagnez tout ; si vous perdez, vous ne perdez rien » (Pensées).", sourceLabel: "Activité d’application 2", points: 2 },
      ],
    },
  },
];

export const terminalPhilosophyPaths = courses.map(createPhilosophyPath);
