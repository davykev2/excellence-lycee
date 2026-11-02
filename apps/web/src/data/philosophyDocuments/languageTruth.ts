import {section,topic,example,exercise,choice,short,writing,type PhilosophyDocumentSeed} from "./model";
import {philosophyTexts as texts} from "./texts";
export const document:PhilosophyDocumentSeed={
 pathId:"terminale-philo-l9-language-truth",
 source:{title:"Langage et vérité — École numérique, Terminale toutes séries",pageCount:15,sha256:"d1943d753f571d0376c373dc8d4a143536ad6ec49381b340db8b29168af1d37b",editorialNotes:["Les langues des signes sont des langues naturelles complètes ; aucune infériorité de pensée n’est déduite d’un handicap.","Communication animale complexe reconnue, sans la confondre avec toutes les propriétés du langage humain.","Unanimité, autorité et évidence subjective ne constituent pas des garanties de vérité.","Scepticisme distingué d’une négation dogmatique de toute vérité ; sophistes non ramenés indistinctement au mensonge.","Formules d’association incertaines transformées en idées attribuées, non en citations à mémoriser.","Hegel : pensée dans les mots rattachée à la Philosophie de l’esprit, non à une citation inventée de la Phénoménologie.","Le Cratyle met en débat le rapport mots/choses : connaître un nom ne suffit pas à connaître la chose.","Kant : début avec l’expérience distinct d’une dérivation de toute connaissance depuis l’expérience."]},
 sections:[
 section("language-communication","I","Communication, langage, langue et parole",[
 topic("language-signs","Communiquer à l’aide de signes",[1,2],`La **communication** est une transmission ou un échange d’informations par des signes. Un geste, un signal sonore ou une trace peuvent communiquer quelque chose. Il ne faut donc pas confondre toute communication avec la parole.

Les travaux de Karl von Frisch sur les abeilles montrent un système de signaux lié notamment à la recherche de nourriture. D’autres animaux manifestent aussi des communications complexes. Les comparer aux langues humaines exige des critères précis, non un simple partage entre présence et absence d’intelligence.`),
 topic("language-langue-parole","Trois notions à distinguer",[2,3],`Le **langage** est une capacité de symboliser et de communiquer à l’aide de systèmes de signes. Une **langue** est un système partagé, avec ses unités et ses règles. La **parole** est l’usage singulier que fait une personne de cette langue dans une situation.

Chez Saussure, le signe linguistique associe un **signifiant** — sa forme — et un **signifié** — le concept. Le lien est conventionnel : des langues différentes n’emploient pas le même mot pour un même concept. Cela ne signifie pas que chacun puisse modifier seul le sens de tous les mots.

Les langues des signes sont des **langues naturelles à part entière**, avec leur grammaire. Une langue n’est donc pas nécessairement vocale. Apprendre une langue suppose des capacités et une vie sociale ; opposer absolument nature et culture manquerait leur articulation.`),
 topic("language-functions","Le langage remplit plusieurs fonctions",[3,4],`| Fonction | Exemple | Ce que l’on fait |
|---|---|---|
| Référentielle | « La réunion commence à huit heures. » | Informer sur une situation |
| Expressive | « Je suis inquiet. » | Manifester un état ou un point de vue |
| Appel à l’autre | « Ferme la porte, s’il te plaît. » | Chercher une action |
| Poétique | Une image dans un poème | Travailler la forme du message |
| Relationnelle | Saluer, maintenir un échange | Établir ou entretenir un lien |
| Performative | Promettre dans les conditions appropriées | Accomplir un acte en parlant |

Une phrase peut cumuler plusieurs fonctions. Une demande ou une promesse n’est pas simplement une description que l’on classe de la même manière en vrai ou faux.`),
 ]),
 section("language-thought","II","Les rapports du langage et de la pensée",[
 topic("language-thought-development","Les mots aident à préciser la pensée",[4,5],`Formuler une idée permet de la distinguer, de la relier à d’autres et de l’examiner. Platon représente la pensée comme un dialogue de l’âme avec elle-même ; Hegel insiste sur le rôle des mots dans l’existence déterminée de la pensée. Merleau-Ponty souligne que l’expression ne se contente pas toujours d’habiller une idée déjà achevée.

**Exemple.** Dire seulement « ce n’est pas juste » laisse le critère indécis. Préciser « deux personnes placées dans la même situation reçoivent un traitement différent sans raison pertinente » rend le jugement discutable.

Il ne s’ensuit pas qu’aucune perception, émotion ou capacité de résolution ne puisse exister sans phrase. Le rapport de la pensée aux langues ne doit pas être transformé en exclusion des personnes qui s’expriment autrement.`),
 topic("language-thought-limits","Les mots ne restituent pas tout de la même façon",[8,9,10],`Un mot commun rassemble des expériences différentes. « Tristesse » ne décrit pas entièrement la nuance singulière d’un souvenir. Bergson interroge cette distance entre des catégories générales et le vécu intime.

L’expression peut aussi être ambiguë, inexacte ou mensongère. Un **lapsus** peut être interprété dans un contexte ; il n’est pas une preuve automatique d’une intention cachée. La poésie, les images et la précision des descriptions permettent parfois d’enrichir ce que les mots donnent à comprendre.

Reconnaître une limite n’oblige donc pas à renoncer à toute expression : **on peut préciser, reformuler, donner un exemple et demander une clarification**.`),
 ]),
 section("language-truth","III","Comment reconnaître ce qui est vrai ?",[
 topic("language-truth-criteria","Quatre critères à examiner",[5,6,7],`La vérité est une propriété d’un jugement ou d’un énoncé ; sa définition fait débat. Ne la confonds pas avec la **sincérité** : on peut croire sincèrement une idée fausse.

| Critère envisagé | Intérêt | Limite à examiner |
|---|---|---|
| Accord avec les faits | Contrôler une affirmation par ce qui arrive | Accès aux faits, qualité des observations |
| Cohérence | Détecter des contradictions et suivre une déduction | Des prémisses fausses peuvent être cohérentes |
| Évidence ou accord des esprits | Chercher ce qui paraît s’imposer | Une impression ou une majorité peut se tromper |
| Résultats pratiques | Tester des prévisions et des conséquences | Une utilité particulière ne justifie pas tout énoncé |

L’autorité d’un savant ne dispense pas de vérifier ses raisons et ses méthodes. Une certitude subjective peut être forte sans constituer une preuve.`),
 topic("language-validity","Cohérence et vérité ne sont pas identiques",[6,7,13],`La **validité** d’un raisonnement concerne le lien entre les prémisses et la conclusion : si les prémisses sont vraies, la conclusion doit l’être. Elle ne garantit pas que les prémisses soient effectivement vraies.

Dans les mathématiques, on démontre à partir de définitions et d’hypothèses précisées. Pour une affirmation sur le monde, une déduction cohérente ne remplace pas l’examen des faits. La vérité ne se réduit donc pas au fait de bien enchaîner des phrases.`,[
 example("language-syllogism","Un raisonnement valide peut partir d’une erreur","Distingue la forme et le contenu.",[
 ["1. Les prémisses","Tous les poissons sont des oiseaux. Tous les oiseaux ont des ailes.","La première prémisse est fausse. Cela doit être vérifié indépendamment de la forme logique."],
 ["2. La conclusion","Donc tous les poissons ont des ailes.","La conclusion suit bien des deux prémisses, mais elle est fausse dans le monde réel."],
 ["3. Le bilan","Que montre l’exemple ?","Un enchaînement valide ne transforme pas une prémisse fausse en connaissance vraie. Il faut distinguer validité et vérité des prémisses."],
 ]),
 ]),
 topic("language-scepticism","Douter sans confondre toutes les positions",[7,8],`Le scepticisme examine nos prétentions au savoir ; certaines traditions recommandent une **suspension du jugement** quand les raisons sont insuffisantes. Ce n’est pas nécessairement affirmer avec certitude qu’aucune vérité objective n’existe.

Le relativisme interroge la dépendance des jugements à des perspectives ou à des normes. La révision d’une théorie après de meilleures observations ne signifie pas que toutes les opinions se valent. Il faut distinguer **vérité, degré de justification et limites d’un savoir**.`),
 ]),
 section("language-social-power","IV","Pouvoirs du langage et exigence de vérité",[
 topic("language-power","Parler peut lier, instruire et transformer",[8,9,10],`Nommer permet d’ordonner une expérience, transmettre un savoir et discuter une règle. Hobbes associe les dénominations à la construction du raisonnement. Une promesse peut engager ; une décision publique, prise dans les conditions requises, modifie des relations sociales.

Ce pouvoir peut aussi influencer ou manipuler. Une formulation impressionnante, une répétition ou l’émotion d’un discours ne remplacent pas une preuve. **Parler peut exprimer une pensée sans dire vrai** : erreur, fiction et mensonge sont des cas distincts.

L’exigence de vérité demande d’expliquer ses termes, distinguer fait et opinion, vérifier les sources et accepter la contradiction argumentée.`),
 ]),
 ],
 essentials:[
 {title:"Langage / langue / parole",body:"Capacité de symboliser / système partagé / usage singulier. Les langues des signes sont des langues naturelles.",topic:"language-langue-parole"},
 {title:"Penser et exprimer",body:"Les mots précisent et organisent la pensée sans restituer automatiquement toute expérience ni garantir le vrai.",topic:"language-thought-development"},
 {title:"Validité / vérité",body:"La validité porte sur l’enchaînement ; la vérité des prémisses demande un examen distinct.",topic:"language-validity"},
 {title:"Vérité / sincérité",body:"Croire et dire sincèrement une idée ne suffit pas à la rendre vraie. Une majorité et une autorité peuvent se tromper.",topic:"language-truth-criteria"},
 ],
 legacy:{overview:"language-signs","communication-language":"language-langue-parole","language-thought":"language-thought-development","criteria-truth":"language-truth-criteria","power-limits-language":"language-power","mission-finale":"language-validity"},
 exercises:[
 exercise("language-understand","Communication et vérité",[10],[
 choice("language-animal","Reconnaître des particularités aux langues humaines oblige à nier toute communication animale complexe.",["Vrai","Faux"],1,"Il faut comparer des propriétés précises. Une différence ne suppose pas que les autres espèces ne communiquent pas."),
 choice("language-culture","L’apprentissage d’une langue suppose des usages sociaux partagés.",["Vrai","Faux"],0,"La capacité humaine s’exerce dans des échanges et des règles communes. Les langues peuvent être vocales ou signées."),
 choice("language-thought-link","Mettre une idée en mots peut aider à la préciser et à l’examiner.",["Vrai","Faux"],0,"La formulation rend des distinctions et des relations explicites. Elle ne garantit pas que l’idée soit vraie."),
 choice("language-unanimity","Une proposition est nécessairement vraie dès que tout le monde l’accepte.",["Vrai","Faux"],1,"Un accord collectif peut être fondé sur une erreur commune. L’adhésion ne dispense pas de justification."),
 ],undefined,"excellence"),
 exercise("language-authors","Relier une idée à son auteur",[12],[
 choice("language-plato","Quel dialogue interroge le rapport entre les noms et les choses ?",["Le Cratyle de Platon","Candide de Voltaire","Le Léviathan de Hobbes"],0,"Le Cratyle examine les noms et la connaissance. Il ne suffit pas de répéter une formule pour conclure qu’un nom garantit le savoir de la chose."),
 choice("language-boileau","À qui l’Art poétique rattache-t-il l’exigence d’une conception et d’une expression claires ?",["Freud","Boileau","Épicure"],1,"Boileau met en relation clarté de la conception et clarté de l’expression. Une phrase claire peut néanmoins être factuellement fausse."),
 choice("language-hegel","Quel auteur insiste sur le rôle des mots dans la détermination de la pensée ?",["Hegel","Darwin","Marx"],0,"Hegel analyse le langage dans la Philosophie de l’esprit. Il faut distinguer l’idée expliquée d’une formule sortie de son contexte."),
 choice("language-hobbes","Quel auteur le cours associe-t-il aux dénominations et à la construction du raisonnement ?",["Bergson","Rousseau","Hobbes"],2,"Chez Hobbes, les noms interviennent dans le calcul et l’enchaînement des pensées. Des définitions précises évitent des confusions."),
 ],undefined,"excellence"),
 exercise("language-claims","Vérifier les critères proposés",[12],[
 choice("language-authority","La parole d’un savant dispense de toute vérification.",["Vrai","Faux"],1,"Une compétence est pertinente, mais la connaissance demande des raisons et des procédures contrôlables."),
 choice("language-sceptic","Tout sceptique soutient dogmatiquement qu’aucune vérité objective ne peut exister.",["Vrai","Faux"],1,"La suspension du jugement n’est pas identique à une négation absolue. Les formes de scepticisme doivent être distinguées."),
 choice("language-sophists","L’apparence d’un discours suffit à établir sa vérité.",["Vrai","Faux"],1,"La persuasion et la vérité sont deux questions distinctes. L’histoire des sophistes ne se réduit pas à une doctrine unique du mensonge."),
 ],undefined,"excellence"),
 exercise("language-complete","Bergson : mots et expérience vécue",[12],[
 short("language-fill-one","Complète : « … nous trompera parfois sur le caractère de la sensation éprouvée. »",["le langage","langage"],"Le langage général peut masquer une nuance de l’expérience singulière. Cela n’interdit pas tout effort pour mieux l’exprimer."),
 short("language-fill-two","Complète : « La pensée demeure … avec le langage. »",["incommensurable"],"Dans ce contexte, le mot souligne l’absence de correspondance complète de mesure entre le vécu et son expression générale."),
 short("language-fill-three","Complète : « Le langage appauvrit …, lui fait perdre son originalité. »",["le sentiment","sentiment"],"Il s’agit du sentiment singulier. Les mots communs peuvent le simplifier ; la description et les images peuvent en enrichir l’expression."),
 ]),
 exercise("language-kant","Kant : expérience et connaissance",[11,12],[
 writing("language-kant-study","Dégage la thèse, explique les deux étapes puis discute l’enjeu.","**Problème.** Le fait que notre connaissance commence avec l’expérience signifie-t-il qu’elle en dérive entièrement ?\n\n**Premier mouvement.** Kant reconnaît que les objets affectent nos sens et mettent notre activité de connaître en mouvement. Il ne nie donc pas le rôle de l’expérience.\n\n**Deuxième mouvement.** Il distingue ce commencement et l’origine de tous les éléments de la connaissance : notre faculté de connaître organise aussi ce qui est reçu.\n\n**Intérêt.** L’opposition simple entre une connaissance donnée toute faite par les sens et une raison entièrement coupée de l’expérience est insuffisante. Il faut expliquer leur articulation.\n\n**Discussion.** Dans une recherche, observer suppose des questions et des concepts ; une théorie sur les faits doit en retour être mise à l’épreuve. Cette comparaison éclaire le problème sans identifier la philosophie de Kant à un simple protocole expérimental.",["Commencer avec et dériver entièrement de sont distingués.","Les deux mouvements sont expliqués dans leur enchaînement.","La critique ne se réduit pas à citer des noms."]),
 ],texts.kantExperience+"\n\n**Emmanuel Kant, Critique de la raison pure**, passage proposé par le support."),
 exercise("language-coherence-subject","Une pensée cohérente est-elle nécessairement vraie ?",[13],[
 writing("language-coherence-plan","Analyse le mot nécessairement puis propose une discussion.","**1. Définitions et problème.** Cohérente : sans contradiction, avec des liens logiques valides. Nécessairement : dans tous les cas. Une bonne forme suffit-elle à établir un contenu vrai ?\n\n**2. La cohérence est une exigence.** Des affirmations contradictoires ne peuvent être toutes soutenues sous le même rapport. Une démonstration doit respecter des règles et préciser ses hypothèses.\n\n**3. Elle n’est pas une garantie suffisante sur le réel.** On peut déduire validement une conclusion à partir d’une prémisse fausse. Par exemple : tous les poissons sont des oiseaux ; tous les oiseaux ont des ailes ; donc tous les poissons ont des ailes. L’enchaînement est valide mais la première prémisse et la conclusion sont fausses. Les sciences empiriques doivent confronter leurs hypothèses à des observations contrôlées.\n\n**4. Conclusion.** La cohérence est nécessaire à la rigueur du raisonnement, mais ne suffit pas seule à établir toute vérité. Il faut examiner les prémisses et le domaine de validité de l’affirmation.",["Un exemple explique la différence entre validité et vérité.","Le rôle des hypothèses et des faits est précisé.","Nécessaire n’est pas confondu avec suffisant."]),
 ]),
 exercise("language-speaking-subject","Parler, est-ce ne dire que la vérité ?",[14],[
 writing("language-speaking-plan","Distingue les usages de la parole puis réponds au sujet.","**Problème.** La capacité d’exprimer une pensée garantit-elle que ce qui est dit soit vrai ?\n\n**I. La parole rend possible une recherche du vrai.** Définir, expliquer et confronter des raisons permet de partager et de vérifier une connaissance. Le lien entre pensée et langage éclaire cette possibilité.\n\n**II. Possibilité n’est pas garantie.** Une personne peut se tromper sincèrement ; une autre peut mentir. Une fiction ne se présente pas de la même façon qu’un compte rendu factuel. Enfin, promettre ou demander ne consiste pas simplement à décrire un fait.\n\n**III. Une exigence d’usage.** Pour informer honnêtement, il faut clarifier ses termes, vérifier les sources et accepter la discussion. La précision du langage sert cette démarche sans la remplacer.\n\n**Conclusion.** Parler peut servir la vérité, mais ne consiste pas toujours à l’énoncer et ne la garantit jamais par la seule existence des mots.",["Erreur, mensonge et fiction sont distingués.","Expression de la pensée et vérité de la pensée ne sont pas confondues.","La réponse tient compte des fonctions non descriptives."]),
 ]),
 ],
};
