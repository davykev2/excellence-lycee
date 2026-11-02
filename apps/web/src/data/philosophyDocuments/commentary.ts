import {section,topic,example,exercise,choice,writing,type PhilosophyDocumentSeed} from "./model";
import {philosophyTexts as texts} from "./texts";
export const document:PhilosophyDocumentSeed={
 pathId:"terminale-philo-l2-text-commentary",
 source:{title:"Le commentaire de texte philosophique — École numérique, Terminale toutes séries",pageCount:8,sha256:"73033cf1ff589f003d470d71437cf3834dddff78898e94f475d622221b84f4c9",editorialNotes:["Situation d’apprentissage omise, trois textes et activités corrigées conservés.","Mouvements repérés par des mots du texte plutôt que par des lignes qui changent sur mobile.","Hume : distinguer la voix du personnage et la position personnelle de l’auteur des Dialogues.","La critique interne examine aussi la force du raisonnement, pas seulement la forme ; pas de doctrine médicale attribuée à la propreté."]},
 sections:[
 section("commentary-identify","I","Comprendre la question du texte",[
 topic("commentary-purpose","Expliquer avant d’évaluer",[1],`Commenter un texte philosophique, c’est **reconstruire son raisonnement pour en examiner l’intérêt**. On explique ce que l’auteur affirme, pourquoi il le dit et comment il avance vers sa conclusion. Puis on discute la portée de sa réponse.

Le devoir comprend introduction, développement et conclusion. Le développement associe **étude ordonnée** et **intérêt philosophique**. Une discussion qui oublie le texte devient une dissertation hors sujet ; une simple répétition devient une paraphrase.`),
 topic("commentary-problem","Les repères à dégager au brouillon",[1,4,5],`| Repère | Question utile |
|---|---|
| Thème | De quoi parle le texte ? |
| Problème | Quelle question difficile cherche-t-il à résoudre ? |
| Thèse | Quelle réponse défend-il ? |
| Intention | Que veut-il établir ou faire comprendre ? |
| Enjeu | Qu’est-ce qui change si cette réponse est retenue ? |
| Structure logique | Quelles étapes conduisent à la réponse ? |
| Démarche argumentative | Définit-il, oppose-t-il, déduit-il, illustre-t-il ou réfute-t-il ? |

Une thèse adverse peut aider à comprendre le débat, mais on ne l’invente pas comme si elle était explicitement écrite. Le thème n’est pas la thèse : « la philosophie » ne dit pas encore ce que l’auteur en pense.`),
 ]),
 section("commentary-explain","II","Suivre les mouvements du raisonnement",[
 topic("commentary-movements","Construire une étude ordonnée",[2,3],`Un mouvement est une étape cohérente du raisonnement. Repère ses premiers et derniers mots, puis indique **ce que l’auteur y fait**. Ne coupe pas automatiquement un texte en trois parties égales.

Pour chaque mouvement :
1. Formuler l’idée directrice.
2. Expliquer les concepts dans leur emploi précis.
3. Montrer le lien entre raisons, exemples et conclusion.
4. Citer brièvement des mots utiles, puis les expliquer.
5. Relier le mouvement au suivant.

Évite **paraphrase** (répéter sans éclairer), **contresens** (attribuer une autre idée) et **non-sens** (proposer une lecture incohérente).`,[
 example("commentary-epictetus-method","Suivre deux mouvements","Dans le texte d’Épictète, comment relier les deux étapes ?",[
 ["1","Du début à « gras et mal peignés »","Épictète décrit l’effet repoussoir d’un maître négligé, puis recommande la décence au maître et au disciple. Il relie ici la conduite visible à la crédibilité d’un enseignement."],
 ["2","De « Car par là je juge » à la fin","L’apparence devient un signe possible d’une attention à soi. Mais l’auteur place au-dessus d’elle la beauté intérieure : le bon usage de la raison. La propreté n’est donc pas la fin ultime de la philosophie."],
 ["3","Transition","La première partie recommande un soin extérieur ; la seconde en précise le sens et la limite, en le subordonnant au soin de l’âme."],
 ]),
 ]),
 ]),
 section("commentary-discuss","III","Dégager l’intérêt philosophique",[
 topic("commentary-internal","La critique interne",[2,3],`La critique interne évalue **le texte à partir de son propre projet** : les arguments soutiennent-ils la thèse ? les étapes s’enchaînent-elles ? les concepts restent-ils clairs ? un exemple justifie-t-il vraiment la conclusion ?

Pour Épictète, la description volontairement excessive cherche à faire ressentir le discrédit d’une conduite négligée. L’examen ne se limite pas à nommer le ton : il montre pourquoi ce ton sert l’intention. On peut aussi demander si l’apparence suffit à connaître la valeur morale d’une personne.`),
 topic("commentary-external","La critique externe",[2,4],`La critique externe confronte **la position expliquée** à d’autres arguments. Elle en reconnaît la portée, puis examine ses limites. Ce n’est pas une liste d’auteurs qui seraient tous « pour » ou tous « contre ».

À propos d’Épictète, on peut soutenir que le soin de soi favorise les relations sociales. Mais le lien entre beauté physique et valeur morale est contestable : une personne digne ne se juge pas à ses traits, à ses vêtements ou à sa richesse. La priorité accordée à la raison permet justement de ne pas réduire la philosophie à l’apparence.

Une référence extérieure doit être fidèle et expliquée : le *Banquet* de Platon permet de discuter le passage de la beauté sensible à des formes de beauté intelligibles, non de prouver que tout beau corps possède une belle âme.`),
 ]),
 section("commentary-compose","IV","Introduire et conclure",[
 topic("commentary-introduction","Une introduction centrée sur le texte",[1,3],`Présente l’auteur et l’œuvre lorsqu’ils sont indiqués, le thème, le problème et la thèse. La structure peut figurer à la fin de l’introduction ou au début de l’étude, selon la méthode retenue. N’invente ni date ni biographie.

**Modèle.** Dans cet extrait des *Maximes et pensées*, Épictète interroge la tenue du philosophe et de son disciple. Doivent-ils négliger leur apparence pour privilégier la vie de l’esprit ? Il recommande la propreté et la décence tout en affirmant la supériorité de la beauté intérieure. Le texte passe ainsi du soin visible de soi à sa signification rationnelle.`),
 topic("commentary-conclusion","Répondre après l’examen",[2,4],`La conclusion rappelle le résultat de l’explication et de la discussion, puis formule une position justifiée. Elle ne se contente pas de « l’auteur a raison ».

**Modèle.** L’extrait met en relation une manière de vivre et la crédibilité d’un enseignement, mais subordonne l’apparence à l’exercice de la raison. Le soin du corps peut accompagner une vie philosophique ; il ne suffit pas à établir la valeur d’une personne. L’intérêt du texte est donc de penser un rapport, sans confondre ses deux dimensions.`),
 ]),
 ],
 essentials:[
 {title:"Identifier",body:"Thème, problème, thèse, intention, enjeu : cinq repères différents, fondés sur le texte.",topic:"commentary-problem"},
 {title:"Expliquer",body:"Suivre les mouvements ; éclairer concepts, raisons et exemples. Ni paraphrase ni cours récité.",topic:"commentary-movements"},
 {title:"Discuter",body:"Critique interne : examiner le raisonnement. Critique externe : en discuter la portée avec d’autres arguments.",topic:"commentary-internal"},
 {title:"Rédiger",body:"Présenter le problème et la thèse, développer l’explication et la discussion, conclure par un bilan justifié.",topic:"commentary-introduction"},
 ],
 legacy:{overview:"commentary-purpose",problematics:"commentary-problem","ordered-study":"commentary-movements","philosophical-interest":"commentary-internal","introduction-conclusion":"commentary-introduction","mission-finale":"commentary-external"},
 exercises:[
 exercise("commentary-epictetus","Épictète : du corps au soin de l’âme",[2,3,4],[
 writing("epictetus-intro","Rédige une introduction à cet extrait.","**Thème :** la tenue du philosophe et du disciple. **Problème :** peuvent-ils négliger le soin de leur apparence ? **Thèse :** propreté et décence sont souhaitables, mais le bon usage de la raison reste supérieur.\n\n**Introduction possible.** Dans cet extrait, Épictète examine le rapport entre l’apparence d’un philosophe et la valeur de son enseignement. Il condamne la négligence qui rend ce dernier peu crédible, tout en plaçant la beauté intérieure au-dessus de la beauté du corps. Il faut donc comprendre comment l’auteur relie un soin visible à l’exigence de raison.",["Le problème est précis.","La hiérarchie entre apparence et raison n’est pas inversée."]),
 writing("epictetus-explanation","Fais l’étude ordonnée de ce texte.","**Premier mouvement, du début à « gras et mal peignés ».** Le portrait repoussant du maître montre que sa conduite peut éloigner un auditeur. La recommandation de décence est ensuite étendue au disciple.\n\n**Second mouvement, à partir de « Car par là je juge ».** Le soin visible peut indiquer une attention à soi ; toutefois la véritable beauté est l’usage raisonnable de l’esprit. L’expression finale hiérarchise les deux soins : elle n’annule pas la recommandation initiale.",["Les mouvements sont repérés par leurs mots.","Le rôle de « Car » est expliqué.","L’étude restitue la progression et ne répète pas simplement le texte."]),
 writing("epictetus-critique","Propose une critique interne, une critique externe et une conclusion.","**Interne.** L’exagération du portrait fait éprouver un rejet ; elle prépare l’appel à la décence. La dernière partie en donne la raison et la limite.\n\n**Externe.** Une conduite soignée peut favoriser la confiance, mais l’apparence ne prouve ni la moralité ni la vérité d’un enseignement. La dignité d’une personne ne dépend pas de sa beauté ou de ses moyens matériels.\n\n**Conclusion.** Le soin du corps peut accompagner celui de l’esprit, sans s’y substituer. La valeur philosophique se juge d’abord au raisonnement et à la conduite.",["Le ton du texte est relié à son effet.","La discussion évalue une idée plutôt que la personne de l’auteur."]),
 ],texts.epictetus+"\n\n**Épictète, Maximes et pensées**, édition A. Silvaire, 1962, p.151–152, extrait proposé par le support."),
 exercise("commentary-vocabulary","Distinguer les repères du commentaire",[4],[
 choice("commentary-theme","Quel repère répond à « De quoi est-il question dans le texte ? » ?",["La thèse","L’intention","Le thème","L’enjeu"],2,"Le thème est le sujet traité. La thèse est la réponse que l’auteur défend sur ce sujet."),
 choice("commentary-intention","Quel repère indique ce que l’auteur cherche à établir ?",["La structure logique","L’intention","Le thème","Le nombre de paragraphes"],1,"L’intention exprime la visée de l’argumentation ; la structure en décrit les étapes."),
 choice("commentary-structure","À quoi correspond la structure logique ?",["Aux étapes de l’argumentation","À la seule date du texte","À l’opinion du lecteur","À la biographie de l’auteur"],0,"On nomme chaque mouvement et sa fonction dans la réponse au problème."),
 choice("commentary-thesis","Quel repère nomme la réponse défendue par l’auteur ?",["Le thème","La thèse","La longueur du texte"],1,"La thèse est une position déterminée sur le problème. Le thème est le sujet plus général dont il est question."),
 choice("commentary-problem-choice","Quel repère désigne la question philosophique à laquelle le texte répond ?",["Le problème","La date","La seule conclusion du lecteur"],0,"Il faut formuler une question précise qui fasse comprendre pourquoi l’auteur argumente."),
 choice("commentary-stakes","Quel repère indique ce qui se joue dans la réponse apportée ?",["La pagination","L’intention seule","L’enjeu"],2,"L’enjeu peut être la liberté, la connaissance ou la justice : il faut le rattacher exactement au problème traité."),
 choice("commentary-argumentative-method","Quel repère décrit la manière dont l’auteur défend sa thèse ?",["La biographie","La démarche argumentative","Le nom de l’éditeur"],1,"Définir, opposer, donner un exemple ou tirer une conséquence sont des opérations de l’argumentation. Elles expliquent la progression du texte."),
 ]),
 exercise("commentary-hountondji","Hountondji : philosopher comme débat",[5,6],[
 writing("hountondji-commentary","Dégage la problématique et les mouvements, puis discute la valeur du débat philosophique.","**Problématique.** La philosophie est-elle un savoir clos ou une recherche ouverte ? Hountondji refuse un ensemble définitif de vérités indépassables.\n\n**Premier mouvement**, du début à « il n’y a pas de philosophie » : un système fermé arrêterait la pensée ; la philosophie vit de la discussion. **Second mouvement**, de « Hors de ce débat » à la fin : ce débat traverse les générations et exige que chaque penseur réponde de ses affirmations.\n\n**Critique interne.** L’opposition entre clôture et justification explique le refus du dogmatisme.\n\n**Discussion.** L’ouverture ne signifie pas que toutes les opinions se valent : chacun doit fournir des raisons. Des systèmes comme ceux de Hegel peuvent organiser la recherche ; ils restent discutables.\n\n**Conclusion.** Le débat donne à la philosophie son caractère critique lorsqu’il s’accompagne d’exigences de justification.",["Le refus d’un savoir clos est expliqué.","Le débat n’est pas confondu avec une conversation sans règles.","La discussion ne remplace pas l’explication du texte."]),
 ],texts.hountondji+"\n\n**Paulin Hountondji, Sur la philosophie africaine**, extrait fourni dans le document."),
 exercise("commentary-hume","Hume : la fonction psychologique de la religion",[6,7,8],[
 writing("hume-commentary","Explique les deux mouvements et dégage l’intérêt philosophique de cet extrait des Dialogues.","**Problème.** Quelle place les craintes et le sentiment de faiblesse prennent-ils dans l’attachement religieux ?\n\n**Premier mouvement**, de « Mon opinion » à « toute la nature » : le locuteur oppose une adhésion née du sentiment à une preuve par le raisonnement. **Second mouvement**, de « Les plus brillantes scènes » à la fin : inquiétudes, prières et rites sont présentés comme une recherche d’apaisement.\n\n**Interne.** Les images des nuages et des terreurs rendent sensible la détresse qui motive cette attente.\n\n**Externe.** Reconnaître une fonction de consolation ne prouve pas l’existence de Dieu et ne suffit pas non plus à la réfuter. Freud permet d’interroger le désir de protection ; d’autres analyses soulignent les liens sociaux et les obligations morales.\n\n**Conclusion.** Le texte éclaire une fonction psychologique sans résoudre à lui seul la question de la vérité religieuse. Dans un dialogue, une parole de personnage ne se confond pas automatiquement avec la conviction personnelle de l’auteur.",["Sentiment, fonction et preuve sont distingués.","Les deux étapes sont expliquées.","Aucune croyance personnelle n’est imposée à l’élève."]),
 ],texts.humeReligion+"\n\n**David Hume, Dialogues sur la religion naturelle**, extrait proposé par le support."),
 ],
};
