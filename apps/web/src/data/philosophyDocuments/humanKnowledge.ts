import {section,topic,example,exercise,choice,writing,type PhilosophyDocumentSeed} from "./model";
import {philosophyTexts as texts} from "./texts";
export const document:PhilosophyDocumentSeed={
 pathId:"terminale-philo-l3-knowledge-of-man",
 source:{title:"La connaissance de l’homme — École numérique, Terminale toutes séries",pageCount:6,sha256:"e10eb8391ad34618092146d6edfa514d77b569130068478b46a46c17e0510dd9",editorialNotes:["Conscience animale non niée comme fait scientifique ; spécificités étudiées comme positions philosophiques.","Freud exposé comme modèle psychanalytique, non comme explication universelle de tout oubli ou de toute violence.","Conscience psychologique/morale distinguées ; responsabilité morale et imputabilité concrète non confondues.","Situation d’évaluation 2 sur le vivant conservée comme prolongement transversal, avec modèle Excellence faute de corrigé."]},
 sections:[
 section("human-conscious","I","Conscience et connaissance de soi",[
 topic("human-problem","Qui sommes-nous ?",[1],`Connaître l’être humain, c’est interroger ses capacités, ses actes et ce qui peut leur échapper. La conscience permet de se rapporter à soi ; suffit-elle à expliquer tout ce que nous faisons ? Cette question conduit à l’inconscient et à la responsabilité.

L’**essence** désigne ce qui définit un être. Mais une seule faculté suffit-elle à épuiser une existence humaine ? La leçon confronte plusieurs réponses au lieu de réduire l’homme à une formule.`),
 topic("human-consciousness","Conscience psychologique et conscience morale",[1],`La **conscience psychologique** est la présence à ses perceptions, pensées et actes : je sais que j’ai peur, que je réfléchis ou que j’agis. La **conscience morale** est le jugement porté sur ce que je dois faire et sur la valeur de mes actes.

| Expérience | Dimension principalement mobilisée |
|---|---|
| Je remarque que je suis en colère | Conscience psychologique |
| Je juge qu’insulter quelqu’un serait injuste | Conscience morale |

Dans le *Discours de la méthode*, Descartes trouve dans l’acte de penser une certitude de son existence. Rousseau, dans *Émile*, examine la conscience comme principe du jugement moral. Il s’agit de deux problèmes différents : savoir que je pense ne me rend pas automatiquement juste.`),
 topic("human-memory","Mémoire, choix et durée",[1,2],`La mémoire conserve et rappelle le passé. Elle permet de relier ce que nous vivons à ce que nous avons déjà vécu et appris. Bergson, dans *L’Énergie spirituelle*, met en relation conscience, mémoire et anticipation : l’action présente se prépare à partir d’un passé retenu et d’un avenir possible.

**Exemple.** Avant de répondre à une critique, je me souviens d’un conflit passé et j’envisage les effets de mes paroles. La mémoire peut aider mon choix ; elle ne garantit ni une connaissance complète du passé ni une décision libre dans toutes les circonstances.`),
 ]),
 section("human-freedom","II","Liberté et limites de la maîtrise de soi",[
 topic("human-liberty","Agir librement et répondre de ses actes",[2],`La liberté peut désigner la capacité de se déterminer plutôt que de subir une contrainte. Elle ne se confond pas avec la satisfaction immédiate de toutes les envies : un choix réfléchi peut résister à une impulsion.

La **responsabilité** consiste à pouvoir répondre de ses actes, en reconnaître les effets et les raisons. Lien essentiel : savoir ce que l’on fait rend possible un examen de sa conduite. Mais la connaissance, la contrainte et la capacité effective de décider doivent être appréciées dans chaque situation.`),
 topic("human-unconscious","L’hypothèse de l’inconscient",[2,3],`Des rêves, des actes manqués et des conflits psychiques suggèrent que nous ne comprenons pas immédiatement toutes nos motivations. Leibniz avait déjà attiré l’attention sur de petites perceptions non aperçues. Freud développe ensuite une **théorie de l’inconscient psychique**.

Dans cette perspective, des désirs et des représentations refoulés continuent d’agir sans être directement accessibles à la conscience. Ce modèle ne se réduit ni au sommeil ni à l’ignorance d’un fait extérieur. Il ne faut pas non plus conclure qu’un oubli quelconque prouve à lui seul un désir refoulé.

Freud étudie aussi l’agressivité dans *Malaise dans la civilisation*. C’est une interprétation des tensions humaines : toute violence n’a pas pour cause unique l’inconscient ; des facteurs sociaux et des décisions conscientes peuvent intervenir.`,[
 example("human-motive-example","Expliquer n’est pas automatiquement excuser","Une personne affirme : « Je ne sais pas pourquoi j’ai réagi ainsi. » Que peut-on conclure ?",[
 ["1","Ce que l’on constate","Elle ne dispose pas d’une explication immédiate de sa réaction."],
 ["2","Ce qui reste à examiner","Ses habitudes, émotions, intentions, contraintes et relations peuvent être interrogées. L’absence d’explication ne prouve pas une cause inconsciente précise."],
 ["3","La responsabilité","Chercher les causes peut éclairer une conduite et aider à la modifier. Ce travail ne supprime pas automatiquement la nécessité de répondre de ses effets."],
 ]),
 ]),
 ]),
 section("human-responsibility","III","Déterminisme et responsabilité",[
 topic("human-debate","Sommes-nous entièrement déterminés ?",[3],`Le **déterminisme psychologique** est la thèse selon laquelle les faits psychiques dépendent de causes qui ne se réduisent pas à la décision consciente du moment. Elle oblige à examiner les limites de la volonté.

Alain critique l’usage de l’inconscient comme personnage intérieur qui déciderait à notre place ; Sartre refuse qu’il devienne un alibi dispensant d’examiner ses choix. Leur objection ne consiste pas à nier toute influence : elle rappelle l’exigence de se situer par rapport à ce qui nous détermine.

**Bilan.** Une explication causale et un jugement de responsabilité ne répondent pas exactement à la même question. Comprendre ce qui a influencé un acte n’équivaut pas à dire que tous les actes sont également maîtrisés ou que tout est excusable.`),
 ]),
 ],
 essentials:[
 {title:"Deux consciences",body:"Psychologique : savoir ce que l’on vit ou fait. Morale : juger ce qui est bien, juste ou dû.",topic:"human-consciousness"},
 {title:"Mémoire",body:"Retenir le passé permet de préparer l’action ; la mémoire n’est ni exhaustive ni infaillible.",topic:"human-memory"},
 {title:"Inconscient",body:"Chez Freud, des processus psychiques peuvent agir sans être conscients. Une conduite isolée ne suffit pas à identifier leur cause.",topic:"human-unconscious"},
 {title:"Responsabilité",body:"Expliquer une conduite n’est pas automatiquement l’excuser. Examiner conscience, choix et contraintes.",topic:"human-debate"},
 ],
 legacy:{overview:"human-problem","consciousness-memory":"human-consciousness",freedom:"human-liberty",unconscious:"human-unconscious","determinism-responsibility":"human-debate","mission-finale":"human-debate"},
 exercises:[
 exercise("human-awareness","Vérifier les distinctions du cours",[3,4,5],[
 choice("human-violence","Quelle proposition justifie l’idée d’une agressivité humaine dans l’analyse freudienne ?",["L’être humain peut être tenté d’agresser son prochain.","La violence n’existe que hors de toute société.","La violence prouve toujours une décision libre."],0,"Freud analyse une disposition à l’agression. Cela ne prouve ni qu’elle s’exerce toujours ni que toute violence a la même cause."),
 choice("human-freedom-definition","Quelle définition convient le mieux à la liberté étudiée ?",["Faire tout ce que l’on veut, sans tenir compte des autres.","Se déterminer en examinant ses raisons et les contraintes.","Confier toutes ses décisions à une autre personne."],1,"La liberté n’est pas la simple impulsion ni une délégation totale de ses choix."),
 choice("human-psychism","La conscience est la seule réalité du psychisme humain : cette proposition est-elle compatible avec la théorie freudienne ?",["Oui","Non"],1,"Freud distingue le conscient et des processus inconscients. Il ne faut pas attribuer à sa théorie une réduction de tout le psychisme à la conscience."),
 choice("human-memory-choice","Quelles propositions décrivent les liens étudiés entre conscience, mémoire et liberté ?",["La conscience peut mobiliser le souvenir pour préparer l’action.","La mémoire supprime toute possibilité de choix.","Avoir conscience de ses raisons peut aider à décider.","Toute conscience rend tous les actes parfaitement libres."],[0,2],"Souvenir et réflexion peuvent soutenir le choix. Ils ne garantissent pas une liberté absolue et ne s’opposent pas nécessairement."),
 ],undefined,"excellence"),
 exercise("human-unconscious-subject","L’inconscient abolit-il la responsabilité ?",[4],[
 writing("human-unconscious-plan","L’inconscient abolit-il la responsabilité humaine ?",`**Termes.** Inconscient : processus psychiques échappant à la conscience. Abolir : supprimer. Responsabilité : devoir répondre de ses actes.

**Problème.** Reconnaître des motivations inconscientes suffit-il à supprimer la possibilité de répondre de ses actes ?

**I. Une maîtrise limitée.** Nos intentions conscientes n’épuisent pas les causes de nos conduites. Freud permet de comprendre des conflits qui nous échappent ; cela invite à ne pas supposer une transparence totale à soi.

**II. Une responsabilité à examiner.** Une influence n’est pas nécessairement une contrainte irrésistible. Avec Alain et Sartre, on peut refuser l’alibi selon lequel une force intérieure excuserait tout. Réfléchir, demander de l’aide et chercher à modifier sa conduite sont aussi des actions possibles.

**Réponse.** L’inconscient oblige à nuancer la maîtrise de soi, non à supprimer indistinctement toute responsabilité. La capacité réelle de comprendre et de décider doit être appréciée, sans diagnostic improvisé.`,["Déterminer les causes et imputer un acte ne sont pas confondus.","Le modèle de Freud n’est ni caricaturé ni transformé en excuse universelle."]),
 ]),
 exercise("human-freud-text","Freud : la conscience n’épuise pas le psychisme",[5],[
 writing("human-freud-commentary","Fais l’étude ordonnée et dégage l’intérêt philosophique du texte.","**Problème.** Peut-on identifier tout le psychisme à ce que la conscience nous apprend ?\n\n**Premier mouvement**, du début à « ce sont deux choses différentes » : Freud reconstruit puis conteste la conviction d’une information intérieure complète. **Second mouvement**, de « quelque chose se passe » à la fin : l’image du souverain mal informé explique l’écart entre l’activité psychique et le savoir conscient.\n\n**Interne.** L’adresse à la deuxième personne met le lecteur face à sa présupposition ; la comparaison du souverain rend sa limite intelligible.\n\n**Discussion.** Le texte ouvre une recherche sur les causes cachées des actes. Il ne permet pas de déduire une cause précise de chaque oubli, ni de promettre qu’une connaissance de soi empêche toute maladie.\n\n**Bilan.** Se connaître demande un travail, et non une confiance absolue dans l’immédiateté de la conscience.",["L’analogie est expliquée.","La portée philosophique est distinguée d’une promesse médicale."]),
 ],texts.freudConsciousness+"\n\n**Sigmund Freud, Une difficulté de la psychanalyse**, passage proposé dans le support, p.5.","excellence"),
 exercise("human-living-extension","Prolongement : connaître scientifiquement le vivant",[6],[
 writing("human-living-plan","Une connaissance scientifique du vivant est-elle possible ?", "**Problème.** La complexité et la sensibilité du vivant empêchent-elles toute connaissance objective ?\n\n**I. Des connaissances possibles.** Observation, comparaison et expérimentation contrôlée permettent d’étudier les structures et les fonctions biologiques. Claude Bernard en expose la méthode dans l’*Introduction à l’étude de la médecine expérimentale*.\n\n**II. Des précautions nécessaires.** Un organisme n’est pas une simple collection de pièces indépendantes ; les variations individuelles et les interactions demandent des modèles adaptés. Les personnes et les autres êtres vivants ne sont pas des matériaux sans valeur.\n\n**Réponse.** La connaissance est possible, mais elle reste méthodique, révisable et soumise à des exigences éthiques. Ce prolongement rejoint la leçon sur la connaissance scientifique.",["Possibilité de connaître et limites sont distinguées.","Aucun protocole médical ou expérimental dangereux n’est proposé."]),
 ],undefined,"excellence"),
 ],
};
