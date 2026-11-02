import {section,topic,example,exercise,choice,short,writing,type PhilosophyDocumentSeed} from "./model";
import {philosophyTexts as texts} from "./texts";
export const document:PhilosophyDocumentSeed={
 pathId:"terminale-philo-l10-scientific-knowledge",
 source:{title:"La connaissance scientifique — École numérique, Terminale toutes séries",pageCount:17,sha256:"16f4ad89b323ec637b0a788a9745c1e41bc544e9bf1ca2b211e5a2ad68823d0b",editorialNotes:["Science contrôlable et révisable, non infaillible ni indistinctement apodictique.","Axiomes explicités sans les définir tous comme évidences universelles ; validité et interprétation distinguées.","Pascal : la définition et la démonstration intégrales sont impossibles, la méthode géométrique n’est pas un ordre absolument accompli.","La formule Nul n’entre ici n’est pas attribuée comme citation de la République ; citations incertaines paraphrasées.","Démarche expérimentale itérative ; confirmation limitée, non preuve universelle définitive.","Sciences humaines dotées de méthodes contrôlables, non déclarées impossibles par principe.","Vivants non ramenés à une respiration obligatoirement oxygénée ou à la reproduction de chaque individu.","Aristote distingué du vitalisme moderne ; mécanisme, vitalisme et organisme non enseignés comme quatre faits établis.","Bioéthique : autonomie, consentement, dignité, justice et risques ; aucune condamnation indistincte des biotechnologies.","Le passage Popper fourni étant tronqué et fautif, son apport est présenté en repère reformulé, non en citation littérale reconstituée."]},
 sections:[
 section("science-forms","I","Les formes de connaissance et les sciences",[
 topic("science-ordinary-philosophical","Connaissance ordinaire et réflexion philosophique",[1,2],`La **connaissance ordinaire** se forme dans les perceptions, les habitudes, l’éducation et l’expérience quotidienne. On peut savoir accomplir un geste sans pouvoir justifier une théorie. La tradition philosophique parle parfois de *doxa*, opinion : il ne s’agit pas d’insulter ce savoir ni de dire qu’il serait toujours faux, mais d’interroger sa justification.

La **connaissance philosophique** examine les concepts, les raisons et les présupposés. Elle demande par exemple ce qui distingue croire et savoir, ou quelles fins doivent guider une recherche. Elle argumente au lieu de se contenter d’une affirmation reçue.`),
 topic("science-scientific","Ce qui caractérise une connaissance scientifique",[2,3],`Une connaissance scientifique est construite par des procédures explicites, contrôlables et discutables. Elle recherche des relations, des explications ou des structures, en précisant ses objets et ses conditions de validité.

**Objectivité ne signifie pas absence de toute perspective humaine.** Elle se travaille par les méthodes, les contrôles, la critique et la confrontation des résultats. Une théorie peut être très bien étayée sans être une vérité complète et irrévisable sur tout le réel.

Une compétence ou une publication ne suffit pas seule à rendre une proposition scientifique : il faut pouvoir demander comment elle est établie et ce qui pourrait conduire à la réexaminer.`),
 topic("science-families","Trois grandes familles, plusieurs méthodes",[3,4],`| Famille | Objets et exemples | Exigence principale |
|---|---|---|
| Sciences formelles | Structures et relations : logique, mathématiques | Définir et démontrer dans un cadre explicité |
| Sciences de la nature | Phénomènes naturels : physique, chimie, biologie | Relier modèles et observations contrôlées |
| Sciences humaines et sociales | Actions, institutions, cultures : histoire, sociologie, psychologie | Construire et confronter des sources, données et interprétations |

Les frontières ne sont pas étanches : statistiques et modélisation circulent entre disciplines. Une expérience de laboratoire n’est pas l’unique forme de contrôle possible. L’historien, par exemple, critique et croise les sources sans reproduire le passé.`),
 ]),
 section("science-methods","II","Comment construire et éprouver un savoir ?",[
 topic("science-formal","La démarche des sciences formelles",[4,5],`Une **définition** précise un terme ; un **axiome** est posé comme point de départ dans un système ; une **démonstration** déduit une proposition selon des règles. Un théorème est établi relativement au cadre et aux hypothèses utilisés.

Tous les axiomes ne sont pas des évidences que chacun constaterait dans le monde. Des géométries différentes peuvent étudier des structures différentes. Il faut distinguer la cohérence d’un cadre, une preuve à l’intérieur de ce cadre et son éventuelle application à la réalité.

Pour Pascal, vouloir **tout définir et tout démontrer** entraîne une régression sans fin : chaque définition appelle d’autres mots, chaque preuve d’autres principes. La rigueur consiste donc à organiser les points de départ et les enchaînements, non à promettre une justification sans aucun commencement.`),
 topic("science-experience-reason","Expérience et raison : une opposition à dépasser",[5,6],`L’**empirisme** met l’accent sur l’expérience dans la formation des connaissances : Locke et Hume examinent ce que les idées doivent aux perceptions. Le **rationalisme** accorde une place décisive à l’activité de la raison, comme on le voit dans la méthode de Descartes.

Chez Kant, le fait que la connaissance commence avec l’expérience n’implique pas qu’elle en dérive entièrement. Sensibilité et entendement interviennent ensemble : recevoir ne suffit pas, il faut aussi organiser et penser.

Dans les sciences empiriques, une théorie oriente la question et les observations éprouvent ses conséquences. Bachelard insiste sur ce travail de construction et de rectification : **ni collection de faits sans question, ni spéculation dispensée du contrôle des faits**.`),
 topic("science-experimental","Observation, hypothèse, mise à l’épreuve",[6,7],`Claude Bernard analyse la démarche expérimentale : un fait soulève une question ; une hypothèse propose une explication ; on en tire des conséquences que l’on confronte à des observations ou à des expériences.

| Étape | Travail à réaliser | Vigilance |
|---|---|---|
| Observer et questionner | Décrire un phénomène et préciser ce qui étonne | Ne pas confondre observation et conclusion |
| Formuler une hypothèse | Proposer une explication testable | Une idée séduisante n’est pas encore une preuve |
| Mettre à l’épreuve | Construire des comparaisons et examiner les résultats | Contrôles, incertitudes et conditions comptent |
| Réexaminer | Conserver provisoirement, préciser ou modifier | Un résultat favorable ne vérifie pas tous les cas possibles |

Ces étapes ne forment pas une recette toujours linéaire. On peut revenir à la question, corriger une mesure ou comparer plusieurs hypothèses.`,[
 example("science-test-example","Tester ne signifie pas constater une fois","Une graine exposée à la lumière a poussé : la lumière explique-t-elle toute sa croissance ?",[
 ["1. Décrire","Que peut-on affirmer à ce stade ?","Une croissance a été observée dans certaines conditions. Cela ne suffit pas à isoler la lumière comme cause unique."],
 ["2. Comparer","Comment construire un contrôle ?","Comparer des groupes en précisant les autres conditions pertinentes : eau, température, type de graines, durée. La question et le protocole déterminent ce que la comparaison permet d’inférer."],
 ["3. Conclure avec mesure","Que faire du résultat ?","Indiquer ce qu’il soutient dans les conditions testées, les limites et les nouvelles questions. Une seule expérience ne démontre pas que tous les organismes réagissent identiquement."],
 ]),
 ]),
 topic("science-human-methods","Les sciences humaines : comprendre avec des contrôles",[7],`Enquête, entretien, archive, observation, expérimentation et statistiques ne répondent pas aux mêmes questions. Une enquête doit préciser qui a été interrogé et comment ; une archive exige un examen de son auteur, de sa date, de ses intentions et de son contexte.

L’objet humain est historique et les chercheurs en font partie. Ce fait impose une vigilance sur les biais, les catégories et les effets de l’enquête ; il ne rend pas toute connaissance impossible. **Comprendre un sens et expliquer des régularités peuvent se compléter**, avec des méthodes adaptées.`),
 ]),
 section("science-limits","III","Limites, rectification et progrès scientifique",[
 topic("science-domains-limits","Une méthode possède un domaine de validité",[7,8,10],`Dans les sciences formelles, une démonstration dépend d’hypothèses et ne prouve pas à elle seule qu’un modèle décrit le monde. Dans les sciences de la nature, les instruments, les incertitudes et la portée des observations limitent les conclusions. Dans les sciences humaines, la diversité des situations et les effets de contexte demandent des contrôles spécifiques.

Ces limites ne placent pas une théorie éprouvée au même niveau qu’une opinion arbitraire. Elles obligent à préciser **ce qui est établi, avec quelles raisons et dans quelles conditions**. Une théorie peut rester utile comme approximation dans un domaine même si une autre la dépasse.`),
 topic("science-popper","Réfuter, corroborer et réviser",[10,17],`Popper propose d’évaluer les théories empiriques par les risques qu’elles prennent devant les faits. Une théorie **réfutable** exclut certains résultats possibles : on peut préciser ce qui entrerait en conflit avec elle. Cela ne signifie pas qu’elle soit déjà fausse.

Si elle résiste à des tests exigeants, elle est **corroborée**, soutenue provisoirement : elle n’est pas pour autant démontrée pour toujours. Une anomalie demande aussi de vérifier les mesures, les hypothèses auxiliaires et les conditions du test ; la recherche réelle ne se réduit pas à jeter une théorie au premier désaccord apparent.

La critique, la confrontation et la révision font partie de la force des sciences. Leur reconnaître des limites ne revient pas à nier leurs résultats.`),
 ]),
 section("science-living","IV","Connaître le vivant et interroger les usages",[
 topic("science-living-object","Le vivant comme objet de connaissance",[8,9],`La biologie étudie les êtres vivants, leur organisation, leurs échanges avec le milieu, leur développement et leur évolution. On repère notamment une organisation cellulaire et des processus de métabolisme. La reproduction intervient à l’échelle des lignées ; elle n’est pas réalisée par chaque individu.

Il faut éviter les critères trop étroits : tous les vivants ne respirent pas de l’oxygène et les cellules reproductrices d’un animal ne résument pas la diversité des modes de reproduction. L’observation, la comparaison et l’expérimentation se complètent, à des échelles différentes.`),
 topic("science-living-models","Quatre manières de penser l’organisation du vivant",[8,9],`| Approche | Idée directrice | Question critique |
|---|---|---|
| Finalisme | Interpréter une organisation par des fins ou fonctions | Une fonction suffit-elle à expliquer l’origine d’un organe ? |
| Mécanisme | Chercher des rapports de causes et des processus analysables | Comment rendre compte de l’organisation et des régulations ? |
| Vitalisme | Supposer un principe vital irréductible aux processus physiques | Comment préciser et éprouver un tel principe ? |
| Pensée de l’organisme | Étudier les relations réciproques des parties et du tout | Comment articuler analyse et organisation globale ? |

Aristote, Descartes, Kant et Canguilhem interviennent dans des contextes différents de cette histoire. Kant interroge la particularité d’un être organisé ; Canguilhem insiste sur les rapports du vivant à son milieu et sur les normes de vie. Ces approches sont des problèmes et des modèles à étudier, non quatre découvertes équivalentes à réciter comme des faits.`),
 topic("science-bioethics","La bioéthique : pouvoir faire et devoir faire",[9,10],`La **bioéthique** examine les enjeux des sciences du vivant et de leurs applications : soin, recherche, procréation, données biologiques et relations au milieu. Une possibilité technique ne suffit pas à justifier un usage.

La réflexion met en relation **dignité, autonomie, consentement, bénéfices et risques, justice, confidentialité et protection des personnes vulnérables**. La Déclaration universelle sur la bioéthique et les droits de l’homme de l’UNESCO (2005) constitue un repère pour ces principes.

Il ne s’agit ni de condamner toutes les biotechnologies ni d’accepter toute innovation au nom du progrès. Il faut identifier les personnes concernées, les connaissances disponibles, les incertitudes et les conditions d’un choix éclairé. La valeur d’une personne ne dépend ni de ses performances ni de son état de santé.`),
 ]),
 ],
 essentials:[
 {title:"Connaître scientifiquement",body:"Construire des propositions justifiées par des procédures explicites et contrôlables ; préciser leur domaine de validité.",topic:"science-scientific"},
 {title:"Trois familles",body:"Formelles : démonstration. Nature : confrontation modèles/faits. Humaines : sources, données et interprétations contrôlées.",topic:"science-families"},
 {title:"Expérience et raison",body:"Les concepts orientent les questions ; les faits éprouvent les conséquences. Une hypothèse n’est pas une certitude.",topic:"science-experience-reason"},
 {title:"Popper",body:"Réfutable ne signifie pas faux. Corroboré signifie soutenu provisoirement par des tests, non définitivement prouvé.",topic:"science-popper"},
 {title:"Bioéthique",body:"Examiner les fins, le consentement, la dignité, les risques, la justice et la confidentialité ; pouvoir faire n’est pas devoir faire.",topic:"science-bioethics"},
 ],
 legacy:{overview:"science-scientific","forms-knowledge":"science-ordinary-philosophical","types-science":"science-families","scientific-process":"science-experimental","limits-bioethics":"science-bioethics","mission-finale":"science-experience-reason"},
 exercises:[
 exercise("science-identify","Reconnaître les formes de connaissance",[11],[
 choice("science-common","Quel savoir se forme d’abord dans les perceptions, les usages et les habitudes ?",["La connaissance ordinaire","Toute démonstration formelle","Une connaissance nécessairement fausse"],0,"Le savoir ordinaire peut être juste et efficace sans avoir fait l’objet d’une justification systématique."),
 choice("science-philosophical","Quel travail examine les concepts, les raisons et les présupposés ?",["L’adhésion sans examen","La réflexion philosophique","La simple répétition d’une rumeur"],1,"La philosophie demande des justifications et interroge le sens et la portée des propositions."),
 choice("science-proof","Quel énoncé décrit le mieux l’exigence scientifique ?",["Une affirmation garantie par le prestige de son auteur.","Une opinion partagée par tous.","Une proposition établie par des procédures adaptées et contrôlables."],2,"La démonstration est essentielle dans les sciences formelles ; d’autres contrôles sont nécessaires dans les sciences empiriques."),
 choice("science-opinion-vf","La connaissance scientifique se réduit à l’opinion reçue sans examen.",["Vrai","Faux"],1,"Elle exige un travail de construction, de contrôle et de discussion des résultats."),
 choice("science-method-vf","L’observation et l’expérimentation peuvent participer à la mise à l’épreuve d’une hypothèse.",["Vrai","Faux"],0,"Leur portée dépend d’un protocole et de conditions précisées. Elles ne sont pas une accumulation sans question."),
 choice("science-infallible-vf","Être objective signifie qu’une théorie scientifique ne pourra jamais être corrigée.",["Vrai","Faux"],1,"L’objectivité vise des raisons contrôlables ; elle n’exclut pas la rectification."),
 ]),
 exercise("science-sort","Classer des disciplines",[11],[
 choice("science-history","À quelle famille rattacher l’histoire ?",["Sciences formelles","Sciences de la nature","Sciences humaines et sociales"],2,"L’histoire construit une connaissance du passé humain par l’examen et le croisement des sources."),
 choice("science-logic","À quelle famille rattacher la logique ?",["Sciences formelles","Sciences de la nature","Sciences humaines et sociales"],0,"Elle étudie notamment les formes des inférences et leurs règles de validité."),
 choice("science-physics","À quelle famille rattacher la physique ?",["Sciences formelles","Sciences de la nature","Sciences humaines et sociales"],1,"Ses modèles sont confrontés à des mesures et à des observations sur des phénomènes naturels."),
 choice("science-sociology","À quelle famille rattacher la sociologie ?",["Sciences formelles","Sciences de la nature","Sciences humaines et sociales"],2,"Elle étudie les rapports et les faits sociaux par des méthodes explicites."),
 choice("science-psychology","Dans ce classement, où placer la psychologie ?",["Sciences formelles","Sciences de la nature seulement","Sciences humaines et sociales"],2,"Elle étudie notamment les conduites et les processus psychiques ; certaines approches mobilisent aussi fortement les sciences de la nature."),
 choice("science-maths","À quelle famille rattacher les mathématiques ?",["Sciences formelles","Sciences de la nature","Sciences humaines et sociales"],0,"Les démonstrations portent sur des structures définies ; leurs applications empiriques demandent un travail distinct de modélisation."),
 choice("science-biology","À quelle famille rattacher la biologie ?",["Sciences formelles","Sciences de la nature","Sciences humaines et sociales"],1,"La biologie étudie les êtres vivants, leurs organisations et leurs relations."),
 ]),
 exercise("science-steps","Reconstruire une démarche expérimentale",[12],[
 short("science-first","Dans le schéma simple du cours, que place-t-on avant la formulation d’une hypothèse ?",["observation","l’observation","observer","observation et question","observation et questionnement"],"On décrit un phénomène et l’on précise une question. Une hypothèse propose ensuite une explication."),
 choice("science-order","Quel enchaînement organise correctement les trois repères du cours ?",["Expérimentation → certitude → absence de question","Observation → hypothèse → mise à l’épreuve","Hypothèse → refus de tout contrôle → loi"],1,"Le schéma aide à s’orienter, mais la recherche comporte des retours, des comparaisons et des rectifications."),
 choice("science-favorable","Un résultat favorable suffit à prouver pour toujours une loi valable dans tous les cas.",["Vrai","Faux"],1,"Il soutient une hypothèse dans les conditions testées ; de nouveaux tests et des domaines non examinés restent possibles."),
 ]),
 exercise("science-experience-subject","Nos connaissances résultent-elles de l’expérience ?",[12,13],[
 writing("science-experience-plan","Construis une réponse en articulant expérience et activité de la raison.","**1. Définir et problématiser.** L’expérience désigne ici la rencontre du réel par les sens et les épreuves contrôlées ; connaître suppose de justifier un jugement. Recevoir des impressions suffit-il à produire un savoir ?\n\n**2. L’apport de l’expérience.** Locke et Hume montrent le rôle des perceptions. Dans les sciences empiriques, une explication ne peut se dispenser de la confrontation avec ce qui est observé.\n\n**3. L’activité de la raison.** Former un concept, distinguer des cas et déduire ne consiste pas à recevoir passivement. Les mathématiques mettent en évidence un travail de définition et de démonstration ; Descartes en fait un modèle de méthode.\n\n**4. Leur articulation.** Kant distingue le commencement avec l’expérience et la dérivation de tous les éléments à partir d’elle. Dans une recherche, la théorie oriente les questions et les faits éprouvent ses conséquences, comme le montrent les réflexions de Claude Bernard et de Bachelard.\n\n**Conclusion.** Les connaissances empiriques ne se construisent ni sans expérience ni par elle seule. Il faut préciser le type de savoir et le rôle respectif de ce qui est reçu et de ce qui est organisé.",["Expérience quotidienne et expérience contrôlée sont distinguées si nécessaire.","Les positions sont expliquées, non simplement associées à des noms.","La conclusion ne traite pas toutes les connaissances comme si elles avaient la même méthode."]),
 ]),
 exercise("science-pascal","Pascal : pourquoi ne peut-on pas tout définir et tout démontrer ?",[13,14,15],[
 writing("science-pascal-study","Explique les deux mouvements et l’intérêt philosophique du passage.","**Problème.** Une méthode humaine peut-elle établir toutes ses définitions et démontrer tous ses principes sans point de départ ?\n\n**Premier mouvement**, du début à « toutes les propositions » : Pascal présente l’idéal d’un ordre absolument accompli, où aucun terme ni aucune proposition ne serait laissé sans justification. Il s’agit d’un idéal décrit, non de la constatation que la géométrie le réalise.\n\n**Deuxième mouvement**, de « Certainement » à la fin : chaque définition requiert d’autres termes et chaque démonstration d’autres propositions. Exiger que tout soit justifié de la même façon empêche donc de commencer : c’est la régression à l’infini.\n\n**Intérêt interne.** Le raisonnement montre la limite à partir de l’exigence elle-même. Dire qu’une méthode est rigoureuse ne signifie pas qu’elle possède un fondement démontré sans aucun commencement.\n\n**Discussion.** On peut construire des démonstrations solides en explicitant les points de départ et leurs usages. Les cadres axiomatiques aident à penser cette exigence ; ils ne font pas disparaître magiquement toute question sur leurs hypothèses.\n\n**Conclusion.** La limite de la justification intégrale n’annule pas la rigueur. Elle demande de connaître ce qu’une méthode établit et ce qu’elle suppose.",["L’idéal décrit est distingué de ce qui est réalisable.","La régression à l’infini est expliquée simplement.","La géométrie n’est pas présentée comme une science absolue sans hypothèse."]),
 ],texts.pascalGeometry+"\n\n**Blaise Pascal, De l’esprit géométrique**, passage proposé par le support."),
 exercise("science-hegel-reading","Lecture : Hegel et l’examen philosophique des savoirs",[16],[
 writing("science-hegel-reading-task","Quelle conception de la philosophie est critiquée et quelle fonction lui est attribuée ?","Hegel critique l’image d’une philosophie vide qui commencerait là où cessent les connaissances. Il lui attribue au contraire un rôle dans la compréhension de la vérité et des principes des savoirs. Il faut expliquer cette exigence de réflexion plutôt qu’en conclure qu’un résultat expérimental serait vrai dès qu’un philosophe l’approuve. La discussion peut demander ce que chaque discipline établit par ses méthodes et ce qu’un examen de ses présupposés apporte.",["L’opposition du texte est identifiée.","La fonction attribuée à la philosophie est distinguée d’une garantie d’autorité."]),
 ],texts.hegelPhilosophy+"\n\n**Hegel**, passage de lecture transmis dans le support.","excellence"),
 exercise("science-nietzsche-reading","Lecture : Nietzsche et l’oubli des métaphores",[16],[
 writing("science-nietzsche-reading-task","Explique les images des métaphores usées et des monnaies.","Le texte interroge la formation historique de nos catégories et la manière dont leur origine figurée peut être oubliée. La monnaie usée reste en circulation alors que son empreinte n’est plus perçue : de même, des façons de parler finissent par sembler naturelles et nécessaires. Cette critique demande d’examiner les conventions ; elle ne se résume pas à déclarer que n’importe quelle affirmation factuelle vaut toutes les autres.",["Chaque image est reliée à l’argument.","La critique n’est pas transformée en permission de soutenir arbitrairement n’importe quoi."]),
 ],texts.nietzscheTruth+"\n\n**Nietzsche**, passage sur la vérité transmis dans le support.","excellence"),
 exercise("science-russell-reading","Lecture : Russell et le caractère provisoire des sciences",[16],[
 writing("science-russell-reading-task","Pourquoi une théorie révisable peut-elle garder une valeur ?","Russell oppose la prétention à une certitude définitive au caractère révisable des théories scientifiques. Une théorie ancienne peut rester utilisable pour des approximations dans certaines conditions. Prévisions et applications donnent des raisons de lui reconnaître une portée, sans en faire un miroir complet et éternel du monde. Il faut donc distinguer révisabilité et absence de justification : la critique précise les résultats, elle ne les efface pas indistinctement.",["Une théorie ancienne peut conserver un domaine d’usage.","Provisoire n’est pas assimilé à arbitraire ou inutile."]),
 ],texts.russellScience+"\n\n**Bertrand Russell, Science et religion**, passage transmis dans le support.","excellence"),
 exercise("science-jacob-reading","Lecture : François Jacob, imagination et épreuve des faits",[17],[
 writing("science-jacob-reading-task","Quel point commun puis quelle différence le texte établit-il ?","**Point commun :** un système d’explication ne se contente pas de répéter ce qui est visible ; il propose des mécanismes, des forces ou des relations qui demandent une construction de l’imagination. **Différence :** une théorie scientifique expose ses conséquences à des contrôles dont les résultats peuvent lui résister. L’imagination n’est donc pas exclue de la science : elle doit s’articuler à la mise à l’épreuve et à la rectification. La comparaison du texte décrit une différence de fonctionnement, non une hiérarchie de valeur entre peuples.",["Les deux étapes de la comparaison sont présentes.","L’imagination est distinguée de l’absence de contrôle."]),
 ],texts.jacobScience+"\n\n**François Jacob, « L’évolution sans projet »**, passage transmis dans le support.","excellence"),
 exercise("science-popper-reading","Lecture : mettre une théorie à l’épreuve, avec Popper",[17],[
 writing("science-popper-reading-task","Explique la différence entre réfutable, réfutée et corroborée.","Une théorie **réfutable** autorise des tests susceptibles d’entrer en conflit avec elle. Elle est **réfutée** lorsqu’un résultat contradictoire est établi dans des conditions contrôlées, en examinant aussi les hypothèses du test. Elle est **corroborée** lorsqu’elle résiste à des épreuves exigeantes : cette réussite reste provisoire. Vérifier la cohérence interne, préciser la forme de la théorie, la comparer à d’autres et confronter ses conséquences à l’expérience sont des examens distincts. Aucun ne se remplace par le prestige de son auteur.",["Les trois termes sont définis sans être confondus.","Résister à un test n’est pas être prouvé définitivement."]),
 ],"**Repère de lecture reformulé — Karl Popper, La Logique de la découverte scientifique.** Une théorie doit être examinée pour sa cohérence, la nature de ses énoncés, son apport par rapport à d’autres théories et les conséquences empiriques que l’on peut en tirer. Des tests favorables la soutiennent provisoirement ; ils ne la mettent pas à l’abri d’un examen futur.","excellence"),
 ],
};
