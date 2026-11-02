/**
 * Presentation-only editions of the existing authored courses.
 * Source corrections remain in the canonical lessons, not as production notes.
 */
const edits:readonly [RegExp,string][]=[
  [/Une construction progressive, corrigée et datée/g,"Les étapes de la création"],
  [/Le tableau du document donne la bonne trame générale,[^\n]+/g,"Les déclarations et conférences successives préparent la Charte :"],
  [/Le document écrit « Sithu U Than » : le nom public officiel est \*\*U Thant\*\*\./g,"**U Thant** est secrétaire général de 1961 à 1971."],
  [/> \*\*Correction de source\.\*\* Le document affiche \*\*1 230[^\n]+/g,"> **À retenir.** Le café demeure une culture d’exportation importante dans les données de la période étudiée."],
  [/> \*\*Correction \/ précision\.\*\* La situation d’évaluation du même PDF[^\n]+/g,"> **Donnée de l’étude de cas.** La situation d’évaluation utilise l’hypothèse de **52 000 tonnes**, soit **30 %** des besoins. Ces nombres servent uniquement aux calculs de cette situation."],
  [/> \*\*Correction \/ précision\.\*\* Le corps du même PDF[^\n]+/g,"> **Hypothèse de calcul.** Pour cette étude de cas, on utilise **52 000 tonnes**, correspondant à **30 %** de la consommation."],
  [/ ; elle ne s’étend pas sur toute la période 1980-1994[^\n]+/g,"."],
  [/> \*\*Précision de source\.\*\* La phrase selon laquelle le tourisme[^\n]+/g,"> **Lire un pourcentage.** Une part doit préciser la grandeur totale à laquelle elle se rapporte ; sans dénominateur défini, elle ne permet pas de comparaison fiable."],
  [/Le PDF se contredit :[^\n]+/g,"L’évolution du couvert forestier doit être étudiée avec des données datées et une définition précise de la forêt."],
  [/Les données institutionnelles permettent de corriger et d’expliquer l’écart/g,"Les données institutionnelles apportent les repères suivants"],
  [/Le document emploie le mot \*\*« fardeau »\*\*\. Cette formulation est à nuancer :/g,"Il faut distinguer le potentiel démographique et les besoins sociaux :"],
  [/> \*\*Correction de formulation\.\*\* Le PDF présente[^\n]+/g,"> **Diagnostic économique.** La nationalité d’un commerçant n’explique pas à elle seule un problème de distribution. On étudie l’accès au financement et au marché, l’informalité, la concentration, le respect des règles, la fraude et la concurrence loyale."],
  [/## Corriger la documentation finale/g,"## Exemple : les projets du PND 2016-2020"],
  [/Le dernier texte du fascicule est intitulé[^\n]+/g,"Le document consacré au PND 2016-2020 présente **12 projets prioritaires**, évalués à **2 700 milliards de francs CFA**, dans **sept secteurs**."],
  [/Le dernier texte, mal numéroté[^\n]+/g,"Le document consacré au **PND 2016-2020** présente **12 projets prioritaires**, **2 700 milliards de francs CFA** et **sept secteurs**."],
  [/> \*\*Précision\.\*\* Le PDF attribue la dégradation[^\n]+/g,"> **À retenir.** La domination japonaise, la guerre et les usages d’après-guerre ont contribué à la dégradation des forêts. Leur restauration repose ensuite sur l’action collective et les politiques d’aménagement."],
  [/> \*\*Correction botanique\.\*\*[^\n]+/g,"> **Repère.** L’espèce cultivée citée est le **châtaignier japonais ou coréen (Castanea crenata)**."],
  [/> \*\*Correction chronologique\.\*\* Park Chung-hee[^\n]+/g,"> **Repère historique.** Park Chung-hee est président de **1963 à 1979**."],
  [/Le PDF appelle déjà l’établissement créé en 1971[^\n]+/g,"Le **Korea Advanced Institute of Science (KAIS)** est fondé en **1971** ; le nom **KAIST** apparaît en **1981**, après la fusion avec le KIST. La formation scientifique de haut niveau accompagne les choix industriels."],
  [/> \*\*Correction de nom\.\*\*[^\n]+/g,"> **Repère historique.** Le président de cette première période est **Syngman Rhee**."],
  [/> \*\*Correction statistique majeure\.\*\*[^\n]+/g,"> **Lire les indicateurs.** **48,2 %** désigne un taux annuel moyen de croissance des exportations manufacturières, et non leur part dans le PNB. En **1977**, les exportations de marchandises représentent environ **25 % du PIB**, et les produits manufacturés environ **85 % des exportations**."],
  [/> \*\*Corrections de chronologie\.\*\*[^\n]+/g,"> **Repères de la CEDEAO.** Proposition de William **Tubman** en **1964** ; **quinze signataires en 1975** ; adhésion du Cabo Verde en **1977** ; retrait de la Mauritanie en **décembre 2000**."],
  [/> \*\*Corrections institutionnelles\.\*\*[^\n]+/g,"> **Le Parlement.** Institué par le traité révisé de **1993**, il inaugure sa première législature en **2000**. Sa fonction est surtout consultative et représentative ; il faut distinguer le rôle d’une institution de ses titulaires successifs."],
  [/> \*\*Correction de vocabulaire\.\*\*[^\n]+/g,"> **Vocabulaire.** Il s’agit d’échanges d’énergie **électrique** et d’interconnexion des réseaux."],
  [/> \*\*Correction de l’activité 3\.\*\*[^\n]+/g,"> **À retenir.** Les conflits entre les pays peuvent fragiliser **la construction de l’intégration régionale**."],
  [/> \*\*Correction de consigne\.\*\*[^\n]+/g,"> **Documents à comparer.** L’étude porte sur **deux pièces** : un article sur le Mali et un communiqué relatif aux attaques en Côte d’Ivoire."],
  [/> \*\*Correction du corrigé\.\*\*[^\n]+/g,"> **Argumenter.** Pour étudier une candidature à l’adhésion, distinguer le périmètre géographique du traité, la procédure, les effets économiques et la décision des États membres. Une hypothèse sur les intentions d’un pays ne remplace pas ces critères."],
  [/> \*\*Double correction\.\*\*[^\n]+/g,"> **Repère.** Le traité de Rome date du **25 mars 1957**. Il crée aussi la **Banque européenne d’investissement**, qui intervient ensuite dans la coopération."],
  [/> \*\*Corrections de source\.\*\*[^\n]+/g,"> **Repère.** Le traité de Rome est signé le **25 mars 1957**. La coopération relie progressivement l’Europe aux pays d’Afrique, des Caraïbes et du Pacifique."],
  [/> \*\*Précision\.\*\* Le document source écrit[^\n]+/g,"> **Repère.** **Winston Churchill** prononce le discours de Fulton, dans le Missouri, en **mars 1946**."],
  [/> \*\*Précision\.\*\* Le document annonce « 13 pays »[^\n]+/g,"> **Repère.** L’OTAN compte **douze membres fondateurs en 1949**."],
  [/> \*\*Précision\.\*\* Le document date la mort de Staline[^\n]+/g,"> **Trois repères.** Mort de Staline : **5 mars 1953** ; printemps de Prague : **1968** ; accords de Paris sur le Viêtnam : **27 janvier 1973**."],
  [/> \*\*Précision\.\*\* Le document indique que Gorbatchev[^\n]+/g,"> **Repère.** Gorbatchev démissionne le **25 décembre 1991**, après la création de la CEI."],
  [/> \*\*Précision\.\*\* L’activité d’application 2 du document écrit[^\n]+/g,"> **Repère.** Les attentats ont lieu le **11 septembre 2001**."],
  [/> \*\*Précision\.\*\* Le document parle de la « sortie de l’Angleterre[^\n]+/g,"> **Vocabulaire.** Le Brexit concerne le **Royaume-Uni**, qui quitte l’Union européenne en **2020**, et non la seule Angleterre."],
  [/ — le document donne aussi, par erreur,[^\n]+/g,"."],
  [/\(le support écrit parfois « Hamed »\)/g,""],
  [/ \(et non à Paris comme l’indique parfois le support\)/g,""],
  [/comme pourrait le laisser croire la formulation du PDF/g,""],
  [/La carte imprimée dans le PDF restitue[^\n]+/g,"La carte à quinze membres correspond à la configuration antérieure aux retraits entrés en vigueur le **29 janvier 2025**. Le périmètre étudié ci-dessous est daté :"],
  [/> \*\*Précision\.\*\* La décennie unipolaire[^\n]+/g,"> **Repères.** Bill Clinton est président de **1993 à 2001** ; George W. Bush entre en fonction en **janvier 2001**. Il faut dater chaque présidence pour étudier la période 1991-2001."],
  [/Le PDF juxtapose, sans millésime commun,[^\n]+/g,"Une comparaison démographique exige une même année, un même territoire et des définitions identiques. Avec une natalité de **0,59 %** et une mortalité de **0,57 %**, le solde naturel vaut **+0,02 point**. Ce calcul n’est pas, à lui seul, celui de la variation totale de la population : il faut aussi tenir compte des migrations."],
  [/>\s*\*\*Correction\.\*\* L’UA[^\n]+/g,"> **Évaluer les actions.** Distinguer les objectifs annoncés, les décisions prises et leurs résultats effectifs ; un programme ne garantit pas à lui seul la résolution de tous les problèmes."],
  [/>\s*\*\*Correction\.\*\* Le monde occidental[^\n]+/g,"> **Délimiter le sujet.** Le découpage utilisé dans ce cours ne réduit pas l’Occident à l’Europe de l’Ouest et lui associe le Japon. Cette convention d’étude doit être distinguée d’une frontière culturelle unique et universelle."],
  [/Le tableau du document donne/g,"Le tableau donne"],
  [/La correction ne diminue pas son rôle/g,"Cela ne diminue pas son rôle"],
];

export function humanitiesReadingText(value:string) {
  let result=value.replace(/\r\n/g,"\n");
  for(const [pattern,replacement] of edits)result=result.replace(pattern,replacement);
  return result.replace(/>\s*\*\*(?:Correction[^*]*|Double correction|Mise à jour[^*]*)\.\*\*/g,"> **À retenir.**")
    .replace(/millions? \$/g,"millions de dollars").replace(/milliard \$/g,"milliard de dollars")
    .replace(/Astuce mémoire de Davy/gi,"Astuce mémoire")
    .replace(/(?<![\p{L}])mission finale(?![\p{L}])/giu,"application de synthèse")
    .replace(/(?<![\p{L}])mission(?![\p{L}])/giu,"situation")
    .replace(/de ce niveau/g,"de cette partie").replace(/dans ce niveau/g,"dans cette partie")
    .replace(/lancer l’évaluation/g,"répondre aux questions")
    .replace(/« ([^»]+) »/g,"« $1 »")
    .replace(/\n{3,}/g,"\n\n").trim();
}

export function humanitiesReadingTitle(value:string) {
  return humanitiesReadingText(value).replace(/^Mission finale$/i,"Application de synthèse")
    .replace(/^(?:Corriger|Lire avec prudence)\s+/i,"Étudier ")
    .replace(/\bCorrigé(?:e)?\b/gi,"Solution").trim().replace(/^./,letter=>letter.toLocaleUpperCase("fr"));
}
