import {section,topic,example,exercise,choice,short,writing,type PhilosophyDocumentSeed} from "./model";
import {philosophyTexts as texts} from "./texts";
export const document:PhilosophyDocumentSeed={
 pathId:"terminale-philo-l5-god-religion",
 source:{title:"Dieu et la religion — École numérique, Terminale toutes séries",pageCount:7,sha256:"d92a4b35d9da781498cfe823e05b93d715988bbf7c5dc7f82c2b3fe4b42a05a8",editorialNotes:["Religion non réduite universellement à un Dieu unique ; définitions théiste et sociologique distinguées.","Kant : critique de la preuve ontologique distincte d’une réfutation de Dieu ; autonomie morale et non peur du châtiment comme mobile moral.","Rousseau, Du contrat social IV,8 : valeur morale du christianisme et difficulté du lien civique, non simple opposition bonne foi/mauvaise pratique.","Activité Kant reformulée pour ne pas faire valider la généralisation fautive du corrigé ; appariements d’idées signalés comme tels."]},
 sections:[
 section("religion-concepts","I","Comprendre la religion et le sacré",[
 topic("religion-meaning","Croyances, pratiques et communauté",[1],`La religion réunit des croyances, des pratiques et souvent une communauté. Les religions théistes se rapportent à une ou plusieurs divinités. La définition de Durkheim, dans *Les Formes élémentaires de la vie religieuse*, insiste plutôt sur **des croyances et pratiques relatives au sacré qui unissent une communauté morale**.

Il faut donc distinguer la notion générale de religion de la seule croyance en un Dieu unique. La philosophie peut étudier ces définitions sans demander à l’élève de croire ou de ne pas croire.`),
 topic("religion-sacred","Dieu, sacré et profane",[1],`Dans une conception théiste, Dieu peut être pensé comme transcendant, omnipotent, omniscient, omniprésent et bon. **Transcendant** signifie qu’il dépasse le monde ; **omnipotent**, qu’il est tout-puissant ; **omniscient**, qu’il connaît tout.

Le **sacré** est tenu à part et fait l’objet d’un respect particulier, de rites ou d’interdits. Le **profane** relève des usages ordinaires. Cette distinction varie selon les traditions ; elle ne prouve ni la vérité ni la fausseté d’une croyance.`),
 ]),
 section("religion-existence","II","Examiner l’idée de Dieu",[
 topic("religion-kant","Concevoir ne suffit pas à prouver l’existence",[1,2],`On peut former l’idée d’un être parfait sans avoir encore établi qu’un tel être existe. Kant critique le passage du **concept** à l’**existence** dans la *Critique de la raison pure* : ajouter l’existence ne revient pas à ajouter une propriété descriptive au concept.

Cette critique d’une démonstration n’est pas une preuve de l’inexistence de Dieu. Elle examine les limites de ce que la raison théorique peut établir. Il faut garder distincts savoir, croyance et argument de foi.`),
 topic("religion-criticism","Le mal et la projection humaine",[2,4],`Le **problème du mal** confronte l’idée d’un Dieu à la fois bon et tout-puissant à l’existence de la souffrance. C’est une difficulté à discuter ; la seule question ne remplace pas l’examen des réponses proposées.

Feuerbach, dans *L’Essence du christianisme*, interprète les attributs divins comme projection de qualités humaines idéalisées. Sa critique fait de l’étude de Dieu une voie d’étude de l’homme. C’est une thèse philosophique, non une définition obligatoire de toute expérience religieuse.`),
 ]),
 section("religion-functions","III","Fonctions sociales et psychologiques",[
 topic("religion-functions-topic","Cohésion, consolation et orientation morale",[2],`Les rites et les récits peuvent créer une appartenance commune et soutenir la solidarité. Proudhon insiste sur leur rôle d’unification ; Bergson analyse des fonctions de protection face à la désorganisation, à la mort et à l’incertitude.

La religion peut aussi proposer un sens à l’existence et des valeurs de partage ou de sollicitude. Freud reconnaît la force du désir de protection tout en critiquant la croyance comme illusion dans *L’Avenir d’une illusion*. **Reconnaître une fonction n’est pas prouver la vérité de la croyance.**

La morale ne suppose pas nécessairement l’adhésion à une religion : des principes laïques peuvent aussi fonder le respect des personnes.`),
 topic("religion-alienation","Quand la croyance devient aliénante",[3,4],`Il y a **aliénation** lorsqu’une personne devient étrangère à sa propre capacité de comprendre et d’agir. Marx critique une religion qui console des souffrances sociales sans permettre d’en transformer les causes. La formule sur l’opium s’inscrit dans une analyse de la détresse et de la protestation, pas seulement dans une insulte aux croyants.

Fanatisme et instrumentalisation politique peuvent produire de la violence lorsqu’une croyance sert à imposer une domination. Cela ne permet pas d’attribuer ces effets à tous les croyants ni à toutes les traditions.`),
 ]),
 section("religion-autonomy","IV","Liberté, obligation et jugement",[
 topic("religion-duty","Obligation morale et contrainte",[3],`Une contrainte peut m’empêcher matériellement de choisir. Une obligation morale s’adresse au contraire à un sujet capable de comprendre une exigence et de lui répondre.

Chez Kant, l’**impératif catégorique** vaut sans être subordonné à un avantage personnel. Agir par peur d’une punition ou pour obtenir une récompense n’est pas encore agir par respect du devoir. L’**autonomie** est la capacité de la volonté raisonnable à se donner une loi universalisable.

**Bilan.** La relation entre religion et liberté dépend de la conception de la croyance, des institutions et du rapport personnel à l’obligation. Ni libération garantie, ni oppression nécessaire : une réponse philosophique doit préciser ses raisons.`),
 ]),
 ],
 essentials:[
 {title:"Religion / sacré",body:"Croyances, pratiques et communauté. Les religions ne se réduisent pas toutes au monothéisme.",topic:"religion-meaning"},
 {title:"Concept / existence",body:"Concevoir Dieu ne démontre pas qu’il existe ; critiquer une preuve ne démontre pas non plus son inexistence.",topic:"religion-kant"},
 {title:"Fonction / vérité",body:"Une croyance peut consoler ou unir. Cet effet ne suffit pas à établir sa vérité.",topic:"religion-functions-topic"},
 {title:"Obligation / contrainte",body:"Le devoir s’adresse à une liberté. Chez Kant, la valeur morale ne repose pas sur la peur du châtiment.",topic:"religion-duty"},
 ],
 legacy:{overview:"religion-meaning","god-sacred":"religion-sacred","criticism-god":"religion-kant","roles-religion":"religion-functions-topic","religion-freedom":"religion-duty","mission-finale":"religion-alienation"},
 exercises:[
 exercise("religion-distinctions","Vérifier les définitions et les positions",[3,5,6],[
 choice("religion-god-proof","Pour Kant, concevoir un être parfait suffit à démontrer son existence.",["Vrai","Faux"],1,"Le passage du concept à l’existence est précisément ce que la critique de la preuve ontologique conteste."),
 choice("religion-kant-atheism","Kant démontre-t-il par cette critique que Dieu n’existe pas ?",["Oui","Non"],1,"Une limite de la démonstration théorique n’est pas une démonstration d’inexistence. Cette distinction évite de confondre critique et athéisme."),
 choice("religion-feuerbach","Chez Feuerbach, la critique théologique conduit à étudier les projections humaines.",["Vrai","Faux"],0,"L’*Essence du christianisme* rapporte les attributs divins à des qualités humaines idéalisées."),
 choice("religion-universal","La religion concerne uniquement les chrétiens et les musulmans.",["Vrai","Faux"],1,"Il existe une diversité de religions et de manières de concevoir le sacré, y compris hors de ces deux traditions."),
 ]),
 exercise("religion-authors","Relier des idées à leurs auteurs",[5],[
 choice("religion-marcel","À quel auteur le support associe-t-il le rôle du sacré dans l’authenticité humaine ?",["Pascal","Gabriel Marcel","Voltaire","Hegel"],1,"Le document renvoie à Gabriel Marcel et à *Homo viator*. Il s’agit ici d’identifier une idée, pas de restituer une citation exacte."),
 choice("religion-pascal","Quel auteur examine un pari en faveur de la croyance ?",["Voltaire","Hegel","Pascal","Feuerbach"],2,"Le pari des *Pensées* compare des enjeux de gain et de perte. Il n’est pas une démonstration de l’existence de Dieu."),
 choice("religion-voltaire","Quel auteur le support associe-t-il à la nécessité sociale de l’idée de Dieu ?",["Voltaire","Hume","Marx","Durkheim"],0,"L’appariement du document vise Voltaire ; une nécessité sociale alléguée n’établit pas une existence métaphysique."),
 choice("religion-hegel","À quel auteur le document rapporte-t-il l’idée d’une libération dans la religion ?",["Kant","Freud","Pascal","Hegel"],3,"Hegel examine la religion dans son rapport à l’esprit et à la liberté. Cette référence doit être expliquée, non opposée mécaniquement à toute critique."),
 ]),
 exercise("religion-fear","Doit-on redouter la croyance religieuse ?",[4,5],[
 writing("religion-fear-plan","Rédige une réponse structurée au sujet.","**Problème.** Les effets possibles de la croyance justifient-ils de la redouter dans tous les cas ?\n\n**I. Des risques à examiner.** Une institution peut exiger une soumission sans examen et servir une domination. Feuerbach et Marx éclairent des mécanismes d’aliénation ; le fanatisme transforme la conviction en refus d’autrui.\n\n**II. Des fonctions positives possibles.** Des pratiques apportent solidarité, repères moraux et consolation ; Bergson et Durkheim aident à les analyser. Il faut distinguer ces fonctions de la preuve de Dieu.\n\n**Réponse.** On peut critiquer les usages oppressifs et défendre la liberté de conscience sans condamner indistinctement toute croyance.",["La réponse respecte la liberté de conscience.","Les effets sociaux et la vérité de la croyance restent distingués."]),
 ]),
 exercise("religion-rousseau","Rousseau : religion et lien politique",[6,7],[
 writing("religion-rousseau-commentary","Explique la progression du texte et discute son problème politique.","**Problème.** Une religion de fraternité universelle suffit-elle à soutenir l’attachement à une communauté politique ?\n\n**Premier mouvement**, jusqu’à « même à la mort » : Rousseau reconnaît la valeur morale d’une fraternité qui dépasse les divisions humaines. **Second mouvement**, introduit par « Mais » : il examine une difficulté politique ; le détachement des affaires terrestres peut affaiblir le lien civique.\n\n**Interne.** L’opposition ne porte pas simplement sur une bonne religion théorique trahie par de mauvaises pratiques : elle concerne la tension entre perfection morale et force du lien politique.\n\n**Discussion.** Une conviction universelle peut soutenir la solidarité, mais la vie civique requiert aussi des engagements communs et le respect des autres convictions.\n\n**Bilan.** Il faut distinguer valeur spirituelle et fonction politique, sans demander à l’État d’imposer une foi.",["Le rôle du mot Mais est expliqué.","La difficulté du lien civique n’est pas remplacée par un autre sujet.","La réponse ne prescrit pas une croyance à l’élève."]),
 ],texts.rousseauReligion+"\n\n**Jean-Jacques Rousseau, Du contrat social, livre IV, chapitre VIII, De la religion civile.**", "excellence"),
 exercise("religion-marx","Discuter l’image de l’opium",[7],[
 writing("religion-marx-discussion","Discute la pensée de Marx : « La religion est l’opium du peuple ».","**Comprendre.** L’image associe soulagement et possible endormissement : la religion répond à une souffrance sociale tout en risquant de détourner de ses causes.\n\n**Examiner.** Une consolation peut aider à vivre ; elle devient aliénante si elle exige d’accepter toute injustice. À l’inverse, des engagements religieux peuvent soutenir l’entraide et la contestation d’une domination.\n\n**Réponse.** La critique marxienne éclaire une fonction possible de la religion. Elle doit être confrontée à la diversité des pratiques plutôt que devenir une condamnation générale des croyants.",["L’image est expliquée dans son contexte social.","Consolation et aliénation sont distinguées."]),
 ],undefined,"excellence"),
 ],
};
