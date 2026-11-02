import {section,topic,example,exercise,choice,short,writing,type PhilosophyDocumentSeed} from "./model";
import {philosophyTexts as texts} from "./texts";
export const document:PhilosophyDocumentSeed={
 pathId:"terminale-philo-l4-social-life",
 source:{title:"La vie en société — École numérique, Terminale toutes séries",pageCount:10,sha256:"00538245b378949d2b94036519f2ef604597f9b098a511efa74f59c5556af137",editorialNotes:["Numérotation du catalogue L4 conservée, malgré Leçon 2 dans le thème du PDF.","Sociabilité animale reconnue ; contractualisme exposé comme théorie de légitimation, pas récit historique attesté.","Droit/justice, État/nation, légal/légitime distingués ; Weber n’est pas une justification de tous les usages de la force.","Lecture d’autrui et de Rousseau nuancée ; société sans loi écrite distinguée de société sans aucune règle."]},
 sections:[
 section("social-relations","I","Pourquoi vivre avec les autres ?",[
 topic("social-society","La société et son origine",[1],`Une société est un **ensemble de personnes dont les relations sont durables, organisées et soutenues par des règles ou des institutions**. Elle ne se réduit ni aux bâtiments ni aux valeurs morales prises seules. D’autres espèces vivent en groupes sociaux ; la réflexion porte ici sur l’organisation humaine et politique.

Aristote, dans *Les Politiques*, présente l’être humain comme naturellement politique : la cité permet de délibérer sur le juste et le bien. Les penseurs du **contrat social** interrogent plutôt les raisons qui rendent une autorité commune nécessaire et légitime. Hobbes, Locke et Rousseau ne défendent pas exactement le même contrat. Il ne faut pas présenter celui-ci comme un événement historiquement observé.`),
 topic("social-others","Autrui, une condition de ma formation",[1,2],`Autrui est une autre personne : un semblable qui n’est pas moi. Le langage, l’éducation, la reconnaissance et la coopération permettent de développer des possibilités qui ne s’accompliraient pas dans un isolement total.

Sartre montre le rôle du regard d’autrui dans la connaissance de soi ; Malson examine le poids de la socialisation dans *Les Enfants sauvages*. Cela ne signifie pas que la personne isolée perd sa dignité humaine. **L’humanisation comme développement des capacités ne doit pas être confondue avec l’appartenance à l’humanité.**

Le **solipsisme** est la position qui ne reconnaît avec certitude que son propre sujet et ses représentations. L’utiliser pour désigner toute réflexion de Descartes ou de Leibniz serait trop général.`),
 ]),
 section("social-institutions","II","État, droit, justice et nation",[
 topic("social-state","Pourquoi instituer l’État ?",[2],`L’**État** est une organisation politique et juridique exerçant une autorité sur un territoire et une population. Il ne se confond ni avec une personne gouvernante ni avec l’ensemble de la société.

Il peut protéger la sécurité et les libertés en établissant des règles communes et des procédures de règlement des conflits. Chez Spinoza, *Traité théologico-politique*, chapitre XX, sa finalité est la liberté, non la transformation des citoyens en automates.

Cette finalité ne prouve pas que chaque État réel la réalise. Il faut pouvoir évaluer les institutions et les améliorer lorsqu’elles deviennent arbitraires.`),
 topic("social-law","Droit et justice : des notions liées, non identiques",[2,9,10],`Le **droit positif** est l’ensemble des règles juridiques en vigueur. Un **droit subjectif** est une prérogative reconnue à une personne. La **justice** est à la fois une exigence d’attribuer à chacun ce qui lui revient et une institution chargée de juger selon le droit.

Une règle peut être légale sans être juste. La philosophie interroge donc la légitimité des lois, et pas seulement leur existence. Rousseau rapporte la loi à la volonté générale orientée vers l’intérêt commun ; elle n’est pas la simple somme des intérêts particuliers.

**Exemple.** Une interdiction arbitraire de s’exprimer peut être imposée par un pouvoir ; sa présence dans un texte ne suffit pas à la rendre moralement légitime.`),
 topic("social-nation","La nation et le désir de vivre ensemble",[3],`La **nation** renvoie à une communauté qui se reconnaît un héritage et un avenir communs. L’**État** renvoie à une organisation du pouvoir. Un État peut réunir plusieurs appartenances nationales ; une nation peut être répartie entre plusieurs États.

Renan, dans *Qu’est-ce qu’une nation ?*, met en avant les souvenirs partagés et le consentement actuel à poursuivre une vie commune. Une langue, un territoire ou des traditions peuvent jouer un rôle, mais **une origine ethnique unique ou une religion unique ne sont pas des conditions universelles de la nation**.`),
 ]),
 section("social-conflicts","III","Conflits et limites du pouvoir",[
 topic("social-violence","Quand les relations deviennent conflictuelles",[3,4],`La violence peut prendre des formes physiques, psychologiques ou institutionnelles lorsqu’elle impose, humilie, asservit ou détruit. Dans la relation à autrui, rivalité et regard réducteur peuvent limiter nos possibilités.

Hegel analyse une lutte pour la reconnaissance ; Sartre étudie la honte et l’expérience d’être vu comme objet. Ces analyses n’obligent pas à conclure que **toute relation est une hostilité**. La reconnaissance réciproque et la solidarité sont d’autres possibilités de la vie commune.`),
 topic("social-force","La force de l’État peut-elle être légitime ?",[4,5],`Machiavel interroge l’efficacité de l’action politique face au conflit. Weber caractérise l’État par sa revendication du monopole de la violence physique légitime sur un territoire. Il ne dit pas que toute violence commise par un État devient juste.

Dans un État de droit, le recours à la contrainte doit être encadré, contrôlé et justifiable. **Légal** signifie conforme à la règle en vigueur ; **légitime** signifie fondé sur des raisons reconnues comme valables.

Althusser distingue l’appareil répressif et des appareils idéologiques qui transmettent des représentations : école, médias, famille ou institutions religieuses. Cette distinction analyse des mécanismes de reproduction sociale ; elle ne signifie pas que toute éducation se réduit à une manipulation.

**Conclusion.** Vivre ensemble peut rendre la liberté possible, mais demande de discuter les règles, de prévenir l’arbitraire et de reconnaître les autres comme sujets.`),
 ]),
 ],
 essentials:[
 {title:"Société / État",body:"La société est un réseau organisé de relations ; l’État en est une organisation politique et juridique particulière.",topic:"social-society"},
 {title:"Autrui",body:"L’autre peut être partenaire de formation et de coopération, ou entrer avec moi dans un conflit. Il n’est pas nécessairement ennemi.",topic:"social-others"},
 {title:"Droit / justice",body:"Une règle en vigueur peut être injuste. Expliquer sa légalité n’est pas démontrer sa légitimité.",topic:"social-law"},
 {title:"Nation",body:"Héritage et volonté de vivre ensemble ; pas nécessairement une langue, une religion ou une origine unique.",topic:"social-nation"},
 ],
 legacy:{overview:"social-society","social-human":"social-society",others:"social-others","state-nation":"social-state","social-violence":"social-violence","mission-finale":"social-force"},
 exercises:[
 exercise("social-definitions","Société, droit et citations à compléter",[5,6,7],[
 choice("social-definition","Quelle définition de la société est la plus complète ?",["L’ensemble des infrastructures économiques.","Un ensemble de valeurs morales seulement.","Des personnes unies par des rapports durables et organisés.","Toutes les espèces vivant sur un territoire."],2,"La société suppose des relations organisées. Les équipements ou les valeurs en font partie, mais ne suffisent pas à la définir."),
 choice("social-right-definition","Le droit positif désigne…",["Tout ce qui me plaît.","Les règles juridiques en vigueur dans une société.","L’ensemble de mes seuls avantages personnels.","Une perfection morale déjà réalisée."],1,"Le droit positif organise des droits, des devoirs et des procédures. Son existence ne dispense pas d’en examiner la justice."),
 short("social-spinoza","Chez Spinoza, la fin de l’État est en réalité…",["la liberté","liberté"],"La protection politique doit permettre une vie raisonnable et libre, non réduire les citoyens à l’obéissance mécanique."),
 short("social-aristotle","Complète la formule d’Aristote : l’homme est par nature un animal…",["politique"],"La cité est le lieu où les personnes mettent en discussion le juste et l’utile."),
 short("social-malson","Dans la formule de Malson proposée par le document, avant la rencontre d’autrui l’homme possède des…",["virtualités","des virtualités"],"Des virtualités sont des capacités en puissance, dont le développement requiert des relations et une éducation."),
 ],undefined,"excellence"),
 exercise("social-enemy","Autrui est-il absolument mon ennemi ?",[5,6],[
 writing("social-enemy-plan","Construis une réponse argumentée au sujet.","**Termes.** Autrui : l’autre personne. Absolument : nécessairement, sans exception. Ennemi : celui qui cherche à me nuire.\n\n**Problème.** La différence et les conflits rendent-ils toute relation à autrui nuisible ?\n\n**I. Une menace possible.** Le regard d’un autre peut m’enfermer dans une image ; rivalité et instrumentalisation peuvent produire de la souffrance. Sartre en éclaire des mécanismes dans *L’Être et le Néant*.\n\n**II. Une condition du développement humain.** L’éducation, l’entraide et la reconnaissance ouvrent des possibilités. Aristote souligne la dimension politique de l’existence ; Malson le rôle de la socialisation.\n\n**Réponse.** Autrui peut devenir un ennemi, mais ne l’est pas par nécessité. La question exige de distinguer conflit et relation humaine en général.",["Le mot absolument est discuté.","Menace et nécessité d’autrui sont toutes deux argumentées."]),
 ]),
 exercise("social-hegel","Hegel : sortir de l’état de nature",[7,8],[
 writing("social-hegel-commentary","Fais l’étude ordonnée et dégage l’intérêt philosophique du texte.","**Problème.** L’état de nature permet-il des relations justes ou faut-il une organisation politique ? **Thèse.** Le droit doit devenir effectif dans l’État.\n\n**Premier mouvement**, du début à « effective réalité » : annonce de la nécessité de dépasser l’état de nature. **Second mouvement**, de « On décrit souvent » à la fin : réfutation de son idéalisation ; les différences de force laissent place à la violence si le droit n’est pas institué.\n\n**Interne.** L’opposition entre force naturelle et vouloir raisonnable justifie la nécessité d’un ordre juridique.\n\n**Discussion.** Hobbes permet de soutenir l’exigence de sécurité ; les critiques de l’État rappellent qu’un pouvoir peut aussi opprimer. L’État doit donc être jugé selon les droits et contrôles qu’il garantit.\n\n**Conclusion.** La critique d’un état sans droit n’établit pas que tout État existant soit juste.",["La thèse et sa justification sont distinctes.","L’état de nature est traité comme une construction philosophique.","La discussion ne justifie pas l’arbitraire politique."]),
 ],texts.hegelState+"\n\n**Hegel, Propédeutique philosophique, Doctrine du droit, §25**, traduction M. de Gandillac, extrait du support."),
 exercise("social-lawless","Une société sans lois est-elle envisageable ?",[9,10],[
 writing("social-lawless-plan","Distingue les sens du mot loi, puis réponds au sujet.","**Clarifier.** Une société peut ne pas avoir de lois écrites ni d’État central : cela ne signifie pas qu’elle n’a aucune règle. Coutumes et accords peuvent organiser les relations.\n\n**I. Critiquer certaines lois.** Des lois peuvent consacrer une domination ; une autorité n’est pas légitime par sa seule puissance. Cette objection justifie l’examen et la transformation des règles injustes.\n\n**II. La nécessité de normes communes.** Sans aucun engagement ni règle, la confiance et le règlement des conflits deviennent très difficiles. Rousseau et Kant permettent de penser une règle qui rend les libertés compatibles au lieu de les supprimer.\n\n**Réponse.** Une société sans code écrit est concevable ; une société durable sans aucune norme commune pose un autre problème. Il faut préciser le sens du sujet avant de trancher.",["Sans lois écrites et sans aucune règle sont distingués.","La critique d’une loi ne devient pas une défense de la violence."]),
 ]),
 ],
};
